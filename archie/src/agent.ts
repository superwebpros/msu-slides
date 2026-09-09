/**
 * CourseAgent — the Durable Object that actually answers.
 *
 * One instance per Discord channel/thread (`idFromName(conversationId)` in
 * `src/index.ts`), SQLite-backed, bound as `COURSE_AGENT`.
 *
 * This file is integration, not logic: every hard decision already lives
 * somewhere else. `src/tools/search.ts` owns the collection literal and the
 * `must` filter. `src/tools/assignments.ts` owns the `Active` filter and the
 * `_`-prefix strip. `src/discord.ts` owns the wire protocol. `src/prompt.ts`
 * owns what Archie is told. What is left here is:
 *
 *   rate limit → history → generateText(tools) → PATCH → persist
 *
 * Three things in here are load-bearing and easy to undo by accident:
 *
 *  1. **The outcome switches have no `default`.** `AssignmentsOutcome` and
 *     `SearchOutcome` are each handled variant by variant, and the function's
 *     declared `string` return is what turns a new variant into a compile error
 *     instead of a silent fallthrough. Do not add a `default` "for safety" — the
 *     default IS the unsafe branch.
 *
 *  2. **`misconfigured` is never phrased as "nothing due".** `Active` is false on
 *     all 431 rows across four other tables in this same Baserow instance. The
 *     day table 1068 rots the same way, the naive reading tells a class they have
 *     no homework.
 *
 *  3. **Nothing logs the question or the answer.** The design builds no
 *     interaction logging on purpose — AI Gateway already has the request log,
 *     with no student identity attached to it. `console.error` here takes error
 *     objects, never `ask.question` and never `result.text`.
 */

import { Agent, type AgentContext } from 'agents';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, stepCountIs, tool, type LanguageModel, type ModelMessage } from 'ai';
import { z } from 'zod';

import { patchDeferredReply } from './discord';
import { buildSystemPrompt } from './prompt';
import { listAssignments } from './tools/assignments';
import {
	aiGatewayHeaders,
	SEARCH_TOOL_DESCRIPTION,
	SEARCH_TOOL_NAME,
	searchCourseContent,
} from './tools/search';
import type {
	Assignment,
	AssignmentsOutcome,
	AskRequest,
	AskResult,
	CourseChunk,
	Env,
	SearchOutcome,
} from './types';

/* ------------------------------------------------------------------ */
/* Tunables                                                            */
/* ------------------------------------------------------------------ */

/** Per-user ceilings. Counters live in this DO's SQL, keyed on the salted hash. */
export const HOURLY_LIMIT = 20;
export const DAILY_LIMIT = 100;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** Exchanges (question + answer) kept for follow-ups in the same thread. */
const HISTORY_TURNS = 8;

/** search → (maybe search again) → assignments → answer, with slack. */
const MAX_STEPS = 6;

/**
 * Discord allows 15 minutes to PATCH the deferred reply. Cap the model well
 * inside that so a hung call becomes an honest error rather than a permanent
 * "Archie is thinking…".
 */
const MODEL_TIMEOUT_MS = 120_000;

/** Discord's hard limit on message content. */
const DISCORD_CONTENT_LIMIT = 2000;

/** Most answers lean on one or two recordings; ten citations is noise. */
const MAX_SOURCES = 3;

const RATE_LIMIT_MESSAGE =
	"You've hit my hourly question limit — give it a little while and ask me again. " +
	'In the meantime the course channel and the syllabus have most of what I would tell you.';

const DAILY_LIMIT_MESSAGE =
	"You've hit my daily question limit. It resets on a rolling 24 hours, so try me again " +
	'tomorrow — or ask in the course channel, where a human can help.';

const MODEL_FAILURE_MESSAGE =
	"Something went wrong while I was working on that, so I don't have an answer for you. " +
	'Please try again in a minute.';

const EMPTY_ANSWER_MESSAGE =
	"I wasn't able to put an answer together for that one. Try rephrasing it, or ask in the course channel.";

/* ------------------------------------------------------------------ */
/* Injection seam                                                      */
/* ------------------------------------------------------------------ */

/**
 * Everything that would otherwise be a network call, in one overridable bag.
 *
 * Tests set `instance.deps` and get the real Agent, the real SQL storage, the
 * real `generateText` loop and the real tool wiring, with a mock model and mock
 * tool bodies underneath. Production leaves it empty and the defaults apply.
 */
export interface AgentDeps {
	model?: LanguageModel;
	search?: typeof searchCourseContent;
	assignments?: typeof listAssignments;
	patch?: typeof patchDeferredReply;
	now?: () => Date;
}

interface StoredTurn {
	role: string;
	content: string;
}

interface RateDecision {
	allowed: boolean;
	message?: string;
}

/* ------------------------------------------------------------------ */
/* The Durable Object                                                  */
/* ------------------------------------------------------------------ */

export class CourseAgent extends Agent<Env> {
	/** Overridden in tests; empty in production. See {@link AgentDeps}. */
	deps: AgentDeps = {};

	constructor(ctx: AgentContext, env: Env) {
		super(ctx, env);

		// Conversation history for this thread. `role` is 'user' | 'assistant';
		// SQLite has no enum, and anything else is filtered out on read.
		this.sql`
			CREATE TABLE IF NOT EXISTS archie_turns (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				role TEXT NOT NULL,
				content TEXT NOT NULL,
				created_at INTEGER NOT NULL
			)
		`;

		// One row per allowed question. Pruned past 24h on every check, so this
		// never becomes a record of how often a given student asked for help.
		this.sql`
			CREATE TABLE IF NOT EXISTS archie_rate_events (
				user_key TEXT NOT NULL,
				at INTEGER NOT NULL
			)
		`;
		this.sql`
			CREATE INDEX IF NOT EXISTS archie_rate_events_user_at
			ON archie_rate_events (user_key, at)
		`;
	}

	/**
	 * partyserver's `Server.fetch` throws unless the request carries an
	 * `x-partykit-room` header — it uses it to name the instance on first touch.
	 * The Worker addresses this DO directly via `idFromName(conversationId)` and
	 * knows nothing about that convention, so supply a name here rather than
	 * leaking partyserver's wire detail into `src/index.ts`.
	 */
	override async fetch(request: Request): Promise<Response> {
		if (request.headers.get('x-partykit-room')) return super.fetch(request);

		// Incoming request headers are immutable; a clone's are not.
		const named = new Request(request);
		named.headers.set('x-partykit-room', this.ctx.id.toString());
		return super.fetch(named);
	}

	/**
	 * POST {@link AGENT_ASK_URL} with an {@link AskRequest} body.
	 *
	 * Answers 204 once the reply has been PATCHed. The caller is already inside
	 * `ctx.waitUntil`, so awaiting the whole thing here is what keeps the isolate
	 * alive long enough to finish.
	 */
	override async onRequest(request: Request): Promise<Response> {
		if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
		if (new URL(request.url).pathname !== '/ask') return new Response('Not found', { status: 404 });

		let ask: AskRequest;
		try {
			ask = (await request.json()) as AskRequest;
		} catch {
			return new Response('Bad request', { status: 400 });
		}

		if (!ask?.question?.trim() || !ask.interactionToken) {
			return new Response('Bad request', { status: 400 });
		}

		await this.handleAsk(ask);
		return new Response(null, { status: 204 });
	}

	/**
	 * Never throws. Every path ends in a PATCH, because the alternative a student
	 * sees is "Archie is thinking…" forever.
	 */
	private async handleAsk(ask: AskRequest): Promise<void> {
		const patch = this.deps.patch ?? patchDeferredReply;
		const now = this.deps.now?.() ?? new Date();

		try {
			const gate = this.checkRateLimit(ask.userKey, now.getTime());
			if (!gate.allowed) {
				// No model call, no history write. A refusal is not an exchange.
				await patch(this.env.DISCORD_APPLICATION_ID, ask.interactionToken, {
					content: gate.message ?? RATE_LIMIT_MESSAGE,
				});
				return;
			}

			const result = await this.answer(ask, now);
			await patch(this.env.DISCORD_APPLICATION_ID, ask.interactionToken, {
				content: renderReply(result),
			});
			this.recordExchange(ask.question, result.text, now.getTime());
		} catch (error) {
			console.error('CourseAgent failed to answer', redactError(error));
			await patch(this.env.DISCORD_APPLICATION_ID, ask.interactionToken, {
				content: MODEL_FAILURE_MESSAGE,
			}).catch((patchError) => {
				console.error('CourseAgent could not report its failure to Discord', redactError(patchError));
			});
		}
	}

	/* -------------------------------------------------------------- */
	/* Model call                                                      */
	/* -------------------------------------------------------------- */

	private async answer(ask: AskRequest, now: Date): Promise<AskResult> {
		const search = this.deps.search ?? searchCourseContent;
		const assignments = this.deps.assignments ?? listAssignments;

		/** Chunks the search tool actually handed the model, in call order. */
		const retrieved: CourseChunk[] = [];

		const tools = {
			[SEARCH_TOOL_NAME]: tool({
				description: SEARCH_TOOL_DESCRIPTION,
				// Exactly one parameter, forever. No collection, no course, no limit:
				// every additional knob here is a lever for a prompt injection to
				// steer the search off the course collection.
				inputSchema: z.object({
					query: z.string().describe('What to look for in the class recordings.'),
				}),
				execute: async ({ query }: { query: string }) => {
					const outcome = await search(query, this.env);
					if (outcome.status === 'ok') retrieved.push(...outcome.chunks);
					return renderSearchOutcome(outcome);
				},
			}),
			list_assignments: tool({
				description:
					'List the active assignments for this course, with any notes, due dates and ' +
					'links attached to them. Takes no parameters. Use for questions about what is ' +
					'due, what an assignment asks for, or what is coming up.',
				inputSchema: z.object({}),
				execute: async () => renderAssignmentsOutcome(await assignments(this.env)),
			}),
		};

		const messages: ModelMessage[] = [
			...this.loadHistory(),
			{ role: 'user', content: ask.question },
		];

		const generated = await withDeadline(MODEL_TIMEOUT_MS, (abortSignal) =>
			generateText({
				model: this.resolveModel(),
				system: buildSystemPrompt(this.env, now),
				messages,
				tools,
				// Multi-step: the model searches, sees the result, then answers.
				stopWhen: stepCountIs(MAX_STEPS),
				abortSignal,
			}),
		);

		const text = generated.text.trim() || EMPTY_ANSWER_MESSAGE;
		return { text, sources: selectSources(retrieved, text) };
	}

	/** The scripted model in tests; the configured provider in production. */
	private resolveModel(): LanguageModel {
		return this.deps.model ?? resolveAnswerModel(this.env);
	}

	/* -------------------------------------------------------------- */
	/* Rate limiting (the DO half of bead .6)                          */
	/* -------------------------------------------------------------- */

	/**
	 * Rolling windows, not calendar buckets: 20 in any 60 minutes, 100 in any 24
	 * hours. Counts the request being decided, so the 21st question inside an
	 * hour is the one that gets refused.
	 *
	 * The counter is keyed on `AskRequest.userKey` — a salted hash the Worker
	 * derived and the only per-student value that reaches this class.
	 */
	private checkRateLimit(userKey: string, nowMs: number): RateDecision {
		if (!userKey) return { allowed: true };

		// Prune first. Anything older than the widest window is not a counter any
		// more, it is a usage history, and this system does not keep one.
		this.sql`DELETE FROM archie_rate_events WHERE at <= ${nowMs - DAY_MS}`;

		const hourly = this.countSince(userKey, nowMs - HOUR_MS);
		if (hourly >= HOURLY_LIMIT) return { allowed: false, message: RATE_LIMIT_MESSAGE };

		const daily = this.countSince(userKey, nowMs - DAY_MS);
		if (daily >= DAILY_LIMIT) return { allowed: false, message: DAILY_LIMIT_MESSAGE };

		this.sql`INSERT INTO archie_rate_events (user_key, at) VALUES (${userKey}, ${nowMs})`;
		return { allowed: true };
	}

	private countSince(userKey: string, sinceMs: number): number {
		const rows = this.sql<{ n: number }>`
			SELECT COUNT(*) AS n FROM archie_rate_events
			WHERE user_key = ${userKey} AND at > ${sinceMs}
		`;
		return Number(rows[0]?.n ?? 0);
	}

	/* -------------------------------------------------------------- */
	/* Thread state                                                    */
	/* -------------------------------------------------------------- */

	/**
	 * The last few exchanges in this thread, oldest first.
	 *
	 * Thread-scoped, not student-scoped — the DO id is the channel, so a
	 * follow-up reads as a follow-up without anything being keyed to who asked.
	 */
	private loadHistory(): ModelMessage[] {
		const rows = this.sql<StoredTurn>`
			SELECT role, content FROM archie_turns
			ORDER BY id DESC
			LIMIT ${HISTORY_TURNS * 2}
		`;

		return rows
			.reverse()
			.filter((row) => row.role === 'user' || row.role === 'assistant')
			.map((row) =>
				row.role === 'user'
					? ({ role: 'user', content: row.content } as const)
					: ({ role: 'assistant', content: row.content } as const),
			);
	}

	/**
	 * Persist the exchange for follow-ups, and trim.
	 *
	 * This is the *only* place a question or an answer is written down, it stays
	 * inside this thread's Durable Object, and the trim keeps it to a working
	 * context window rather than a transcript. Nothing here is exported, logged,
	 * or keyed to a student.
	 */
	private recordExchange(question: string, answer: string, atMs: number): void {
		this.sql`INSERT INTO archie_turns (role, content, created_at) VALUES ('user', ${question}, ${atMs})`;
		this.sql`INSERT INTO archie_turns (role, content, created_at) VALUES ('assistant', ${answer}, ${atMs})`;
		this.sql`
			DELETE FROM archie_turns WHERE id NOT IN (
				SELECT id FROM archie_turns ORDER BY id DESC LIMIT ${HISTORY_TURNS * 2}
			)
		`;
	}
}

/* ------------------------------------------------------------------ */
/* Model resolution                                                    */
/* ------------------------------------------------------------------ */

/**
 * The answering model: OpenAI through AI Gateway when one is configured, direct
 * to OpenAI otherwise.
 *
 * OpenAI rather than Anthropic because the `archie` gateway holds OpenAI and
 * Groq provider keys and no Anthropic one — an Anthropic model cannot reach a
 * provider through it. `ANTHROPIC_API_KEY` is deliberately left in place and
 * unused, so switching back is a key in the gateway dashboard plus this
 * function, not a redeploy of the secret set.
 *
 * Two things are load-bearing:
 *
 *  - The `/openai` suffix is the same one `src/tools/search.ts` appends for
 *    embeddings. Both legs of a question now land in one gateway log under one
 *    provider.
 *  - `aiGatewayHeaders` throws when a gateway is configured without a token.
 *    That throw is wanted: it surfaces in `handleAsk`, which logs it redacted
 *    and still PATCHes the student an answer, rather than becoming a 401 nobody
 *    attributes to config.
 *
 * No `temperature` or other sampling parameter is set anywhere. `gpt-5.5` is a
 * reasoning-family model routed through the Responses API, which rejects some
 * of them; not sending them is simpler than negotiating with them.
 *
 * > **Dependency note.** This needs `@ai-sdk/openai@^2` — the line built against
 * > `@ai-sdk/provider@2`, the same spec `ai@5` and `@ai-sdk/anthropic@2` use.
 * > `@ai-sdk/openai@4` is the AI SDK **v6** line: it returns a `LanguageModelV4`,
 * > which `generateText` from `ai@5` neither type-checks nor accepts at runtime.
 * > If `tsc` reports "LanguageModelV4 is not assignable to LanguageModelV2" on
 * > the return below, the installed major is wrong, not this function.
 *
 * @param fetchImpl Test seam only, mirroring `SearchDeps.fetch`. Production
 *                  passes nothing and the provider uses the global `fetch`.
 */
export function resolveAnswerModel(env: Env, fetchImpl?: typeof fetch): LanguageModel {
	const gateway = env.AI_GATEWAY_BASE_URL?.trim();
	const openai = createOpenAI({
		apiKey: env.OPENAI_API_KEY,
		...(gateway ? { baseURL: `${gateway.replace(/\/+$/, '')}/openai` } : {}),
		// `{}` unless a gateway is configured. A direct call to api.openai.com must
		// never carry a Cloudflare token.
		headers: aiGatewayHeaders(env),
		...(fetchImpl ? { fetch: fetchImpl } : {}),
	});
	return openai(env.ANSWER_MODEL);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Run `work` under a deadline, and *clear the timer afterwards*.
 *
 * `AbortSignal.timeout(ms)` would be one line, but its timer cannot be
 * cancelled: every answered question would leave a live two-minute timer behind,
 * holding the Durable Object's I/O context open long after the student has their
 * reply.
 */
/** Cap on the error text that reaches the log. Long enough to debug, short
 * enough that an echoed prompt cannot ride out on it. */
const ERROR_MESSAGE_LIMIT = 200;

/**
 * What is safe to write to the Worker log when something fails.
 *
 * `console.error(error)` is not safe here. An AI SDK `APICallError` carries
 * `requestBodyValues` — the entire request, system prompt and student question
 * included — and workerd serialises those own properties straight into the log.
 * The design builds no interaction logging on purpose, and a crash is not an
 * exemption from that. Name, a truncated message, and the stack: the stack is
 * frames, not content, and it is the part that actually helps.
 */
function redactError(error: unknown): { name: string; message: string; frames?: string } {
	if (error instanceof Error) {
		// Drop the stack's first line: it repeats the untruncated message.
		const frames = error.stack?.split('\n').slice(1).join('\n').slice(0, 2000);
		return {
			name: error.name,
			message: error.message.slice(0, ERROR_MESSAGE_LIMIT),
			...(frames ? { frames } : {}),
		};
	}
	return { name: 'UnknownError', message: String(error).slice(0, ERROR_MESSAGE_LIMIT) };
}

async function withDeadline<T>(ms: number, work: (signal: AbortSignal) => Promise<T>): Promise<T> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), ms);
	try {
		return await work(controller.signal);
	} finally {
		clearTimeout(timer);
	}
}

/* ------------------------------------------------------------------ */
/* Outcome rendering — exhaustive, no `default`                        */
/* ------------------------------------------------------------------ */

/**
 * Turn a {@link SearchOutcome} into the string the model sees.
 *
 * Switch is exhaustive with no `default`: adding a variant to `SearchOutcome`
 * makes this function fall off the end, which the declared `string` return type
 * turns into a compile error. That is the point.
 *
 * `empty` is deliberately *not* phrased as a failure. The prompt tells Archie to
 * say the material does not appear to cover it; wording this as an error makes
 * him apologise for a search that worked.
 */
export function renderSearchOutcome(outcome: SearchOutcome): string {
	switch (outcome.status) {
		case 'ok': {
			const excerpts = outcome.chunks.map((chunk, index) => {
				return `[${index + 1}] ${citationLabel(chunk)}\n${chunk.content}`;
			});
			return [
				`${outcome.chunks.length} excerpt(s) from the class recordings:`,
				'',
				excerpts.join('\n\n'),
				'',
				'Cite the session number and recording date shown above. Where an excerpt shows no ' +
					'session number or no date, do not supply one.',
			].join('\n');
		}
		case 'empty':
			return (
				'The search ran and matched nothing in the indexed class recordings. This is not an ' +
				'error — the recordings simply do not appear to cover it. Say so, then answer from ' +
				'your own knowledge if you can, labelled as general knowledge rather than as ' +
				'something from class. Do not cite a session.'
			);
		case 'error':
			return (
				`Course material search is unavailable right now (${outcome.message}). Tell the student ` +
				'you cannot reach the class recordings at the moment. Answer from general knowledge if ' +
				'you can, and do not claim the material does not cover it — you do not know that.'
			);
	}
}

/**
 * Turn an {@link AssignmentsOutcome} into the string the model sees.
 *
 * Same rule: every variant, no `default`.
 */
export function renderAssignmentsOutcome(outcome: AssignmentsOutcome): string {
	switch (outcome.status) {
		case 'ok':
			return [
				`${outcome.assignments.length} active assignment(s):`,
				'',
				outcome.assignments.map(renderAssignment).join('\n\n'),
			].join('\n');
		case 'empty':
			return (
				'The assignment list is genuinely empty: the table has no rows at all, so nothing is ' +
				'posted right now. It is safe to say there are no assignments listed at the moment.'
			);
		case 'misconfigured':
			// NOT "nothing due". The table has rows; none are flagged active. Telling a
			// student they have no homework here is the exact failure this variant exists
			// to prevent — `Active` is false on all 431 rows across four sibling tables.
			return (
				`The assignment list looks misconfigured: the table holds ${outcome.totalRows} row(s), ` +
				'but none are flagged active, so the real list cannot be read. Tell the student the ' +
				'assignment list appears misconfigured and that they should check with the instructor ' +
				'or the course channel. Report it as a fault in the list, never as a statement about ' +
				'their workload: rows exist and cannot be read, which is a different thing from an ' +
				'empty list, and saying otherwise would probably be false.'
			);
		case 'error':
			return `${outcome.message} (Tell the student the assignment list is unreachable right now — do not guess at what is due.)`;
	}
}

function renderAssignment(assignment: Assignment): string {
	const lines = [`- ${assignment.name}`];
	if (assignment.notes) lines.push(`  Notes: ${assignment.notes}`);
	if (assignment.documentUrl) lines.push(`  Document: ${assignment.documentUrl}`);
	for (const [key, value] of Object.entries(assignment.extra)) {
		lines.push(`  ${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
	}
	return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* Citations                                                           */
/* ------------------------------------------------------------------ */

/**
 * How a chunk is described to the model and to the student.
 *
 * `session` and `recordedOn` are independently nullable — a recording whose
 * filename carries neither still has to render as something a human can read,
 * and "Session null" is not it.
 */
export function citationLabel(chunk: CourseChunk): string {
	const session = chunk.session === null ? null : `Session ${chunk.session}`;
	const date = chunk.recordedOn === null ? null : `recorded ${chunk.recordedOn}`;

	if (session && date) return `${session} · ${date}`;
	if (session) return session;
	if (date) return `Class recording · ${date}`;
	return 'Class recording';
}

/**
 * Which retrieved chunks to show under the answer.
 *
 * Two rules, both about not burying a two-sentence answer under ten citations:
 *
 *  - Deduplicate to the *recording*, not the chunk. Ten hits are usually two or
 *    three sessions, and a student recognises "Session 3" — not
 *    `2026-09-08_session-3_intro-to-skills.mp4`, which is why the filename never
 *    appears in a label.
 *  - Prefer sources the answer actually leans on. If the text names a session
 *    number or a recording date, cite those; only when it names none do we fall
 *    back to the best-scoring recordings, capped at {@link MAX_SOURCES}.
 *
 * A chunk with no session, no date and no URL is dropped: "Class recording" with
 * nothing to click is not a citation, it is a line of noise.
 */
export function selectSources(chunks: CourseChunk[], answerText: string): AskResult['sources'] {
	interface Candidate {
		label: string;
		url?: string;
		score: number;
		mentioned: boolean;
	}

	const haystack = answerText.toLowerCase();
	const byKey = new Map<string, Candidate>();

	for (const chunk of chunks) {
		const label = citationLabel(chunk);
		const url = chunk.sourceUrl ?? undefined;
		if (label === 'Class recording' && !url) continue;

		const key = `${chunk.session ?? ''}|${chunk.recordedOn ?? ''}|${url ?? ''}`;
		const mentioned =
			(chunk.session !== null && haystack.includes(`session ${chunk.session}`)) ||
			(chunk.recordedOn !== null && haystack.includes(chunk.recordedOn.toLowerCase()));

		const existing = byKey.get(key);
		if (existing) {
			existing.score = Math.max(existing.score, chunk.score);
			continue;
		}
		byKey.set(key, { label, ...(url ? { url } : {}), score: chunk.score, mentioned });
	}

	const candidates = [...byKey.values()].sort((a, b) => b.score - a.score);
	const cited = candidates.filter((candidate) => candidate.mentioned);
	const chosen = (cited.length > 0 ? cited : candidates).slice(0, MAX_SOURCES);

	return chosen.map(({ label, url }) => (url ? { label, url } : { label }));
}

/* ------------------------------------------------------------------ */
/* Discord rendering                                                   */
/* ------------------------------------------------------------------ */

/**
 * Answer plus a one-line source list, inside Discord's 2000-character limit.
 *
 * The sources line is built first and the answer is what gets trimmed, so a long
 * answer never silently drops its citations.
 */
export function renderReply(result: AskResult): string {
	const footer =
		result.sources.length === 0
			? ''
			: `\n\nSources: ${result.sources
					.map((source) => (source.url ? `[${source.label}](<${source.url}>)` : source.label))
					.join(' · ')}`;

	const budget = DISCORD_CONTENT_LIMIT - footer.length;
	const body =
		result.text.length <= budget ? result.text : `${result.text.slice(0, Math.max(0, budget - 1)).trimEnd()}…`;

	return `${body}${footer}`;
}
