/**
 * Archie — Cloudflare Worker entrypoint.
 *
 * Responsibilities, in order and no more than these:
 *
 *   1. Reject anything that is not a signed POST to /interactions.
 *   2. Answer Discord's PING handshake.
 *   3. For `/archie`, hand the question to the CourseAgent Durable Object
 *      *without awaiting it* and ack within Discord's 3-second window.
 *
 * The 3-second limit is the whole reason this file is thin. Every slow thing —
 * embeddings, Qdrant, Baserow, the model — happens in the DO, after the ack,
 * and lands via a PATCH to the interaction webhook.
 */

import type { AskRequest, Env } from './types';
import {
	deferredResponse,
	getBooleanOption,
	getInvokingUserId,
	getStringOption,
	InteractionType,
	messageResponse,
	patchDeferredReply,
	pongResponse,
	verifyRequest,
	type Interaction,
} from './discord';

/**
 * The slash command Archie answers. Registered guild-scoped.
 *
 * Must stay identical to `COMMANDS[0].name` in `scripts/register-commands.ts`.
 * If they drift, Discord happily accepts the invocation and this Worker replies
 * with the usage hint instead — a failure that looks like a bug in the bot.
 *
 * Unrelated to `AGENT_ASK_URL` below, which is the internal Worker→DO route.
 */
const COMMAND_NAME = 'archie';

/**
 * Path the Worker POSTs the {@link AskRequest} to on the DO stub.
 *
 * This is the Worker↔DO contract: a POST whose JSON body is an `AskRequest`.
 * The URL host is synthetic — DO stub fetches never leave the isolate.
 */
export const AGENT_ASK_URL = 'https://course-agent.internal/ask';

export { CourseAgent } from './agent';

/**
 * Minimal view of the CourseAgent namespace.
 *
 * `src/agent.ts` does not exist yet, so this file cannot import the real class.
 * `DurableObjectNamespace` from the runtime types already gives us what we
 * need; this alias exists to name the intent and to keep the call site honest
 * about how little of the namespace is used.
 */
type CourseAgentNamespace = Pick<DurableObjectNamespace, 'idFromName' | 'get'>;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			return await handle(request, env, ctx);
		} catch (error) {
			// Never hand Discord a stack trace. Log it; say nothing useful outward.
			console.error('Unhandled error in fetch handler', error);
			return new Response('Internal error', { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;

async function handle(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);

	if (request.method === 'GET' && url.pathname === '/health') {
		return new Response('ok', { status: 200, headers: { 'content-type': 'text/plain' } });
	}

	if (request.method !== 'POST' || url.pathname !== '/interactions') {
		return new Response('Not found', { status: 404 });
	}

	// Verify against the RAW body. `body` below is the exact signed bytes.
	const { valid, body } = await verifyRequest(request, env.DISCORD_PUBLIC_KEY);
	if (!valid) {
		// Discord probes with deliberately-bad signatures during endpoint
		// registration and will not accept the URL unless this is a 401.
		return new Response('invalid request signature', { status: 401 });
	}

	let interaction: Interaction;
	try {
		interaction = JSON.parse(body) as Interaction;
	} catch {
		return new Response('Bad request', { status: 400 });
	}

	if (interaction.type === InteractionType.Ping) {
		return pongResponse();
	}

	if (interaction.type === InteractionType.ApplicationCommand) {
		if (interaction.data?.name !== COMMAND_NAME) {
			return messageResponse('That command is not one I know.');
		}
		return await handleAsk(interaction, env, ctx);
	}

	return new Response('Unsupported interaction type', { status: 400 });
}

async function handleAsk(interaction: Interaction, env: Env, ctx: ExecutionContext): Promise<Response> {
	const question = getStringOption(interaction, 'question')?.trim();
	const isPublic = getBooleanOption(interaction, 'public') ?? false;

	if (!question) {
		return messageResponse('Ask me a question — for example: `/archie what is due friday?`');
	}

	// One DO per channel/thread, so multi-turn context follows the conversation
	// rather than the student. Falls back to the interaction id (a fresh, single
	// -use conversation) if Discord somehow omits the channel.
	const conversationId = interaction.channel_id ?? interaction.channel?.id ?? interaction.id;

	// Rate-limit key only. The design deliberately does not track students, so
	// the raw Discord id never leaves this function.
	const userId = getInvokingUserId(interaction) ?? 'anonymous';
	const userKey = await hashUserId(userId, env.ARCHIE_USER_SALT);

	const ask: AskRequest = {
		question,
		interactionToken: interaction.token,
		userKey,
		conversationId,
	};

	// Fire-and-forget. Awaiting this would blow the 3-second budget on the first
	// model call and Discord would kill the interaction.
	ctx.waitUntil(dispatch(env, ask));

	return deferredResponse({ ephemeral: !isPublic });
}

async function dispatch(env: Env, ask: AskRequest): Promise<void> {
	try {
		const namespace = env.COURSE_AGENT as CourseAgentNamespace | undefined;
		if (!namespace) throw new Error('COURSE_AGENT binding is missing');

		const stub = namespace.get(namespace.idFromName(ask.conversationId));
		const response = await stub.fetch(
			new Request(AGENT_ASK_URL, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(ask),
			}),
		);

		if (!response.ok) {
			throw new Error(`CourseAgent returned ${response.status}`);
		}
	} catch (error) {
		console.error('CourseAgent dispatch failed', error);
		// The student is looking at "Archie is thinking…". Replace it with
		// something honest rather than leaving it there forever.
		await patchDeferredReply(env.DISCORD_APPLICATION_ID, ask.interactionToken, {
			content: "I couldn't reach the course assistant just now. Please try again in a moment.",
		}).catch((followUpError) => {
			console.error('Failed to report dispatch failure to Discord', followUpError);
		});
	}
}

/**
 * Salted SHA-256 of the Discord user id. Gives the DO a stable key for per-user
 * rate limiting without the Worker or the DO ever holding an id that identifies
 * a student.
 *
 * The salt is load-bearing, not decoration: a Discord snowflake is a known,
 * enumerable value, and a class roster is ~25 people. An unsalted digest could
 * be reversed by hashing the member list and comparing.
 */
async function hashUserId(userId: string, salt: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`archie:v1:${salt}:${userId}`));
	let hex = '';
	for (const byte of new Uint8Array(digest)) hex += byte.toString(16).padStart(2, '0');
	return hex;
}
