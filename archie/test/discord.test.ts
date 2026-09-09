import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import worker from '../src/index';
import {
	bytesToHex,
	EPHEMERAL_FLAG,
	InteractionResponseType,
	InteractionType,
	patchDeferredReply,
} from '../src/discord';
import type { Env } from '../src/types';

afterEach(() => {
	vi.restoreAllMocks();
});

/**
 * Intercept outbound HTTP so no test ever reaches discord.com. Returns the
 * captured calls.
 */
function stubFetch(handler: (request: Request) => Response | Promise<Response>) {
	const requests: Request[] = [];
	vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
		const request = input instanceof Request ? input : new Request(input as string, init);
		requests.push(request.clone());
		return handler(request);
	});
	return requests;
}

/* ------------------------------------------------------------------ */
/* Real Ed25519 keys — the verifier is never mocked                    */
/* ------------------------------------------------------------------ */

let keyPair: CryptoKeyPair;
let publicKeyHex: string;

beforeAll(async () => {
	keyPair = (await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify'])) as CryptoKeyPair;
	publicKeyHex = await exportPublicKeyHex(keyPair.publicKey);
});

async function exportPublicKeyHex(key: CryptoKey): Promise<string> {
	const raw = (await crypto.subtle.exportKey('raw', key)) as ArrayBuffer;
	return bytesToHex(new Uint8Array(raw));
}

async function sign(message: string): Promise<string> {
	const signature = await crypto.subtle.sign({ name: 'Ed25519' }, keyPair.privateKey, new TextEncoder().encode(message));
	return bytesToHex(new Uint8Array(signature));
}

/* ------------------------------------------------------------------ */
/* Test doubles                                                        */
/* ------------------------------------------------------------------ */

interface AgentCall {
	body: unknown;
}

/** Records what the Worker hands the DO, and lets a test hold it open. */
function stubAgentNamespace(options: { gate?: Promise<void> } = {}) {
	const calls: AgentCall[] = [];
	const names: string[] = [];
	let settled = false;

	const namespace = {
		idFromName(name: string) {
			names.push(name);
			return { toString: () => name } as unknown as DurableObjectId;
		},
		get() {
			return {
				async fetch(request: Request) {
					const body = await request.json();
					if (options.gate) await options.gate;
					calls.push({ body });
					settled = true;
					return new Response('ok');
				},
			} as unknown as DurableObjectStub;
		},
	};

	return {
		namespace: namespace as unknown as DurableObjectNamespace,
		calls,
		names,
		get settled() {
			return settled;
		},
	};
}

function makeEnv(overrides: Partial<Env> = {}): Env {
	return {
		DISCORD_BOT_TOKEN: 'test-bot-token',
		DISCORD_PUBLIC_KEY: publicKeyHex,
		DISCORD_APPLICATION_ID: '111111111111111111',
		ANTHROPIC_API_KEY: 'test',
		OPENAI_API_KEY: 'test',
		QDRANT_URL: 'https://qdrant.invalid',
		QDRANT_API_KEY: 'test',
		BASEROW_BASEURL: 'https://baserow.invalid',
		BASEROW_RESOURCE_TOKEN: 'test',
		ARCHIE_USER_SALT: 'test-salt',
		ACTIVE_COURSE: 'ssc-490',
		QDRANT_COLLECTION: 'course_content',
		EMBEDDING_MODEL: 'text-embedding-3-small',
		ANSWER_MODEL: 'claude-sonnet-5',
		BASEROW_DOCUMENTS_TABLE_ID: '1068',
		COURSE_TIMEZONE: 'America/Detroit',
		SEARCH_TOP_K: '10',
		COURSE_AGENT: stubAgentNamespace().namespace,
		...overrides,
	};
}

/** ExecutionContext that keeps hold of the backgrounded promises. */
function makeCtx() {
	const pending: Promise<unknown>[] = [];
	const ctx = {
		waitUntil(promise: Promise<unknown>) {
			pending.push(promise);
		},
		passThroughOnException() {},
		props: {},
	} as unknown as ExecutionContext;
	return { ctx, pending, drain: () => Promise.all(pending) };
}

async function post(
	env: Env,
	ctx: ExecutionContext,
	payload: unknown,
	options: { tamper?: boolean; omitSignature?: boolean } = {},
): Promise<Response> {
	const body = JSON.stringify(payload);
	const timestamp = String(Math.floor(Date.now() / 1000));
	const headers = new Headers({ 'content-type': 'application/json' });

	if (!options.omitSignature) {
		headers.set('X-Signature-Ed25519', await sign(timestamp + body));
		headers.set('X-Signature-Timestamp', timestamp);
	}

	// Tamper AFTER signing, exactly as an attacker would.
	const sentBody = options.tamper ? body.replace('"archie"', '"evil"') : body;

	const request = new Request('https://archie.test/interactions', { method: 'POST', headers, body: sentBody });
	return worker.fetch(request, env, ctx);
}

function askInteraction(options: { question?: string; isPublic?: boolean; name?: string } = {}) {
	const data: Record<string, unknown> = { id: '999', name: options.name ?? 'archie', type: 1 };
	const opts: unknown[] = [];
	if (options.question !== undefined) opts.push({ name: 'question', type: 3, value: options.question });
	if (options.isPublic !== undefined) opts.push({ name: 'public', type: 5, value: options.isPublic });
	data.options = opts;

	return {
		id: '424242424242424242',
		type: InteractionType.ApplicationCommand,
		token: 'interaction-token-abc',
		application_id: '111111111111111111',
		channel_id: '555555555555555555',
		guild_id: '777777777777777777',
		member: { user: { id: '888888888888888888', username: 'student' } },
		data,
	};
}

/* ------------------------------------------------------------------ */
/* Routing                                                             */
/* ------------------------------------------------------------------ */

describe('routing', () => {
	it('serves GET /health', async () => {
		const { ctx } = makeCtx();
		const response = await worker.fetch(new Request('https://archie.test/health'), makeEnv(), ctx);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe('ok');
	});

	it('404s everything that is not POST /interactions', async () => {
		const { ctx } = makeCtx();
		const env = makeEnv();
		const cases = [
			new Request('https://archie.test/'),
			new Request('https://archie.test/interactions'), // GET, not POST
			new Request('https://archie.test/anything', { method: 'POST' }),
		];
		for (const request of cases) {
			expect((await worker.fetch(request, env, ctx)).status).toBe(404);
		}
	});
});

/* ------------------------------------------------------------------ */
/* Signature verification                                              */
/* ------------------------------------------------------------------ */

describe('signature verification', () => {
	it('answers a correctly-signed PING with PONG', async () => {
		const { ctx } = makeCtx();
		const response = await post(makeEnv(), ctx, { id: '1', type: InteractionType.Ping, token: 't' });

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ type: InteractionResponseType.Pong });
	});

	it('401s a tampered body carrying an otherwise-valid signature', async () => {
		const { ctx } = makeCtx();
		const response = await post(makeEnv(), ctx, askInteraction({ question: 'hi' }), { tamper: true });

		expect(response.status).toBe(401);
	});

	it('401s a missing signature header', async () => {
		const { ctx } = makeCtx();
		const response = await post(makeEnv(), ctx, { id: '1', type: InteractionType.Ping, token: 't' }, { omitSignature: true });

		expect(response.status).toBe(401);
	});

	it('401s a signature from the wrong key', async () => {
		const other = (await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify'])) as CryptoKeyPair;
		const otherPublic = await exportPublicKeyHex(other.publicKey);

		const { ctx } = makeCtx();
		const response = await post(makeEnv({ DISCORD_PUBLIC_KEY: otherPublic }), ctx, {
			id: '1',
			type: InteractionType.Ping,
			token: 't',
		});

		expect(response.status).toBe(401);
	});

	it('401s garbage in the signature header rather than throwing', async () => {
		const body = JSON.stringify({ id: '1', type: InteractionType.Ping, token: 't' });
		const { ctx } = makeCtx();
		const request = new Request('https://archie.test/interactions', {
			method: 'POST',
			headers: {
				'X-Signature-Ed25519': 'not-hex-at-all',
				'X-Signature-Timestamp': '1700000000',
			},
			body,
		});

		expect((await worker.fetch(request, makeEnv(), ctx)).status).toBe(401);
	});
});

/* ------------------------------------------------------------------ */
/* /archie                                                                */
/* ------------------------------------------------------------------ */

describe('/archie', () => {
	it('returns a type-5 deferred response, ephemeral by default', async () => {
		const agent = stubAgentNamespace();
		const { ctx, drain } = makeCtx();

		const response = await post(makeEnv({ COURSE_AGENT: agent.namespace }), ctx, askInteraction({ question: 'what is due friday?' }));

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: { flags: EPHEMERAL_FLAG },
		});

		await drain();
	});

	it('is non-ephemeral when public: true', async () => {
		const agent = stubAgentNamespace();
		const { ctx, drain } = makeCtx();

		const response = await post(
			makeEnv({ COURSE_AGENT: agent.namespace }),
			ctx,
			askInteraction({ question: 'what is due friday?', isPublic: true }),
		);

		const payload = (await response.json()) as { type: number; data: Record<string, unknown> };
		expect(payload.type).toBe(InteractionResponseType.DeferredChannelMessageWithSource);
		expect(payload.data.flags).toBeUndefined();

		await drain();
	});

	it('hands the DO an AskRequest keyed on the channel, with a hashed user id', async () => {
		const agent = stubAgentNamespace();
		const { ctx, drain } = makeCtx();

		await post(makeEnv({ COURSE_AGENT: agent.namespace }), ctx, askInteraction({ question: '  what is RAG?  ' }));
		await drain();

		expect(agent.names).toEqual(['555555555555555555']);
		expect(agent.calls).toHaveLength(1);

		const ask = agent.calls[0]!.body as Record<string, unknown>;
		expect(ask.question).toBe('what is RAG?');
		expect(ask.interactionToken).toBe('interaction-token-abc');
		expect(ask.conversationId).toBe('555555555555555555');

		// Opaque, and specifically not the Discord snowflake.
		expect(ask.userKey).toMatch(/^[0-9a-f]{64}$/);
		expect(ask.userKey).not.toContain('888888888888888888');
	});

	it('rejects an empty question without touching the agent', async () => {
		const agent = stubAgentNamespace();
		const { ctx, pending } = makeCtx();

		const response = await post(makeEnv({ COURSE_AGENT: agent.namespace }), ctx, askInteraction({ question: '   ' }));
		const payload = (await response.json()) as { type: number; data: { flags: number } };

		expect(payload.type).toBe(InteractionResponseType.ChannelMessageWithSource);
		expect(payload.data.flags).toBe(EPHEMERAL_FLAG);
		expect(pending).toHaveLength(0);
	});

	it('does not blow up on an unknown command', async () => {
		const { ctx, pending } = makeCtx();
		const response = await post(makeEnv(), ctx, askInteraction({ question: 'hi', name: 'grade-me' }));

		const payload = (await response.json()) as { type: number };
		expect(payload.type).toBe(InteractionResponseType.ChannelMessageWithSource);
		expect(pending).toHaveLength(0);
	});
});

/* ------------------------------------------------------------------ */
/* The 3-second clock — the important one                              */
/* ------------------------------------------------------------------ */

describe('the ack does not wait on the agent', () => {
	it('defers immediately even when the DO call never finishes in time', async () => {
		let release!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = resolve;
		});

		const agent = stubAgentNamespace({ gate });
		const { ctx, drain } = makeCtx();

		const startedAt = Date.now();
		const response = await post(makeEnv({ COURSE_AGENT: agent.namespace }), ctx, askInteraction({ question: 'slow one' }));
		const elapsed = Date.now() - startedAt;

		// Discord kills the interaction at 3s. We are nowhere near it, and the
		// agent has not even been reached yet.
		expect(elapsed).toBeLessThan(3000);
		expect(response.status).toBe(200);
		expect(((await response.json()) as { type: number }).type).toBe(InteractionResponseType.DeferredChannelMessageWithSource);
		expect(agent.settled).toBe(false);
		expect(agent.calls).toHaveLength(0);

		// The work is still queued on waitUntil and completes afterwards.
		release();
		await drain();
		expect(agent.calls).toHaveLength(1);
	});

	it('still acks when the agent binding is broken, and reports the failure afterwards', async () => {
		const brokenNamespace = {
			idFromName() {
				return {} as DurableObjectId;
			},
			get() {
				return {
					fetch() {
						return Promise.reject(new Error('durable object exploded'));
					},
				} as unknown as DurableObjectStub;
			},
		} as unknown as DurableObjectNamespace;

		const followUps = stubFetch(() => new Response('{}', { status: 200 }));
		const { ctx, drain } = makeCtx();
		const response = await post(makeEnv({ COURSE_AGENT: brokenNamespace }), ctx, askInteraction({ question: 'boom' }));

		expect(((await response.json()) as { type: number }).type).toBe(InteractionResponseType.DeferredChannelMessageWithSource);

		// Draining must not reject, and the student must not be left staring at
		// a permanent "thinking…".
		await expect(drain()).resolves.toBeDefined();
		expect(followUps).toHaveLength(1);
		expect(followUps[0]!.url).toBe(
			'https://discord.com/api/v10/webhooks/111111111111111111/interaction-token-abc/messages/@original',
		);
		expect(await followUps[0]!.json()).toMatchObject({ content: expect.stringContaining("couldn't reach") });
	});

	it('swallows a failing follow-up rather than rejecting the waitUntil promise', async () => {
		const brokenNamespace = {
			idFromName: () => ({}) as DurableObjectId,
			get: () =>
				({
					fetch: () => Promise.reject(new Error('durable object exploded')),
				}) as unknown as DurableObjectStub,
		} as unknown as DurableObjectNamespace;

		stubFetch(() => new Response('{"message":"Unknown Webhook"}', { status: 404 }));
		const { ctx, drain } = makeCtx();

		await post(makeEnv({ COURSE_AGENT: brokenNamespace }), ctx, askInteraction({ question: 'boom' }));
		await expect(drain()).resolves.toBeDefined();
	});
});

/* ------------------------------------------------------------------ */
/* patchDeferredReply                                                  */
/* ------------------------------------------------------------------ */

describe('patchDeferredReply', () => {
	it('PATCHes @original with no bot token — the interaction token is the credential', async () => {
		const requests = stubFetch(() => new Response('{}', { status: 200 }));

		await patchDeferredReply('app-id', 'token-xyz', { content: 'the answer' });

		expect(requests).toHaveLength(1);
		const request = requests[0]!;
		expect(request.method).toBe('PATCH');
		expect(request.url).toBe('https://discord.com/api/v10/webhooks/app-id/token-xyz/messages/@original');
		expect(request.headers.get('authorization')).toBeNull();
		expect(await request.json()).toEqual({ allowed_mentions: { parse: [] }, content: 'the answer' });
	});

	it('throws on a non-2xx so the caller can fall back', async () => {
		stubFetch(() => new Response('rate limited', { status: 429 }));

		await expect(patchDeferredReply('app-id', 'token-xyz', { content: 'hi' })).rejects.toThrow(/429/);
	});
});
