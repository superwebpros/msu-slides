/// <reference types="@cloudflare/vitest-pool-workers" />

/**
 * Unit tests for the CourseAgent Durable Object.
 *
 * These run against the *real* DO: real `agents` base class, real SQLite
 * storage, real `generateText` tool loop. Only the leaves are faked — the model
 * (a scripted `MockLanguageModelV2`), the two tools, and the Discord PATCH. So
 * nothing here touches the network, but the wiring under test is the wiring that
 * ships: tool schemas, multi-step, history, rate limiting.
 *
 * The tests that are about behaviour rather than plumbing, and should not be
 * "fixed" if they start failing:
 *
 *   - a general question must reach an answer with **no** tool call
 *   - an empty search is an honest "not covered", never an apology and never a
 *     citation the model invented to fill the hole
 *   - a `misconfigured` assignment list must never read as "nothing due"
 *   - a model failure must still PATCH something back
 */

import { env, runInDurableObject } from 'cloudflare:test';
import type { LanguageModel } from 'ai';
import { MockLanguageModelV2 } from 'ai/test';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
	citationLabel,
	renderAssignmentsOutcome,
	renderReply,
	renderSearchOutcome,
	resolveAnswerModel,
	selectSources,
	type AgentDeps,
	type CourseAgent,
} from '../src/agent';
import { buildSystemPrompt, courseDate } from '../src/prompt';
import { AGENT_ASK_URL } from '../src/index';
import type { DeferredReplyPayload } from '../src/discord';
import type {
	AssignmentsOutcome,
	CourseChunk,
	Env,
	SearchOutcome,
} from '../src/types';

declare module 'cloudflare:test' {
	// wrangler.jsonc supplies the vars and the COURSE_AGENT binding; the secrets
	// are absent, which is fine — every path that would need one is injected.
	interface ProvidedEnv extends Env {}
}

afterEach(() => {
	vi.restoreAllMocks();
});

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

/** 2026-09-08 22:30 in America/Detroit (EDT) — deliberately the *next* UTC day. */
const NOW = new Date('2026-09-09T02:30:00Z');

const USAGE = { inputTokens: 10, outputTokens: 10, totalTokens: 20 } as const;

function chunk(overrides: Partial<CourseChunk> = {}): CourseChunk {
	return {
		content: 'Skills are folders of instructions the model loads on demand.',
		score: 0.9,
		fileName: '2026-09-08_session-3_intro-to-skills.mp4',
		session: 3,
		recordedOn: '2026-09-08',
		course: 'ssc-490',
		sourceUrl: 'https://cdn.example.com/session-3.mp4',
		...overrides,
	};
}

type Scripted =
	| { type: 'text'; text: string }
	| { type: 'tool'; toolName: string; input: Record<string, unknown> }
	| { type: 'throw'; error: Error };

/**
 * A model that replays `steps`, one per `doGenerate` call, and records what it
 * was asked. Past the end of the script it just answers, so a test never hangs
 * on an unscripted extra step.
 */
function scriptedModel(steps: Scripted[]) {
	let index = 0;
	const prompts: string[] = [];
	const systems: string[] = [];

	const model = new MockLanguageModelV2({
		modelId: 'mock-answer-model',
		doGenerate: async ({ prompt }) => {
			prompts.push(JSON.stringify(prompt));
			const system = prompt.find((message) => message.role === 'system');
			systems.push(typeof system?.content === 'string' ? system.content : '');

			const step = steps[index++] ?? ({ type: 'text', text: 'Done.' } as const);
			if (step.type === 'throw') throw step.error;
			if (step.type === 'tool') {
				return {
					content: [
						{
							type: 'tool-call' as const,
							toolCallId: `call-${index}`,
							toolName: step.toolName,
							input: JSON.stringify(step.input),
						},
					],
					finishReason: 'tool-calls' as const,
					usage: USAGE,
					warnings: [],
				};
			}
			return {
				content: [{ type: 'text' as const, text: step.text }],
				finishReason: 'stop' as const,
				usage: USAGE,
				warnings: [],
			};
		},
	});

	return {
		model,
		prompts,
		systems,
		get callCount(): number {
			return model.doGenerateCalls.length;
		},
	};
}

interface Harness {
	stub: DurableObjectStub<CourseAgent>;
	patched: DeferredReplyPayload[];
	searchCalls: string[];
	assignmentCalls: number;
	ask: (question: string, overrides?: { userKey?: string }) => Promise<Response>;
}

let conversationSeq = 0;

/**
 * Spin up a fresh DO (unique name per call, so no state bleeds between tests)
 * and install the fakes on it.
 */
async function harness(options: {
	steps: Scripted[];
	search?: SearchOutcome;
	assignments?: AssignmentsOutcome;
	model?: AgentDeps['model'];
	now?: Date;
}): Promise<Harness & { model: ReturnType<typeof scriptedModel> }> {
	const scripted = scriptedModel(options.steps);
	const patched: DeferredReplyPayload[] = [];
	const searchCalls: string[] = [];
	const state = { assignmentCalls: 0 };

	const deps: AgentDeps = {
		model: options.model ?? scripted.model,
		now: () => options.now ?? NOW,
		search: async (query: string) => {
			searchCalls.push(query);
			return options.search ?? { status: 'empty' };
		},
		assignments: async () => {
			state.assignmentCalls += 1;
			return options.assignments ?? { status: 'empty' };
		},
		patch: async (_applicationId, _token, payload) => {
			patched.push(payload);
		},
	};

	const name = `thread-${++conversationSeq}`;
	const stub = env.COURSE_AGENT.get(env.COURSE_AGENT.idFromName(name)) as DurableObjectStub<CourseAgent>;
	await runInDurableObject(stub, (instance) => {
		instance.deps = deps;
	});

	return {
		stub,
		patched,
		searchCalls,
		model: scripted,
		get assignmentCalls() {
			return state.assignmentCalls;
		},
		ask: (question: string, overrides = {}) =>
			stub.fetch(
				new Request(AGENT_ASK_URL, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						question,
						interactionToken: 'interaction-token',
						userKey: overrides.userKey ?? 'user-hash-1',
						conversationId: name,
					}),
				}),
			),
	};
}

function lastContent(patched: DeferredReplyPayload[]): string {
	return patched[patched.length - 1]?.content ?? '';
}

/* ------------------------------------------------------------------ */
/* Tool discipline                                                     */
/* ------------------------------------------------------------------ */

describe('tool discipline', () => {
	it('answers a general question with no tool call at all', async () => {
		const h = await harness({
			steps: [{ type: 'text', text: 'A transformer is a neural network architecture built on attention.' }],
		});

		const response = await h.ask('what is a transformer?');

		expect(response.status).toBe(204);
		expect(h.searchCalls).toEqual([]);
		expect(h.assignmentCalls).toBe(0);
		expect(h.model.callCount).toBe(1);
		expect(lastContent(h.patched)).toContain('attention');
		// No retrieval happened, so nothing may be cited.
		expect(lastContent(h.patched)).not.toContain('Sources:');
	});

	it('calls search_course_content for a course question and answers from it', async () => {
		const h = await harness({
			steps: [
				{ type: 'tool', toolName: 'search_course_content', input: { query: 'skills' } },
				{ type: 'text', text: 'In session 3 (recorded 2026-09-08) we built a skill folder.' },
			],
			search: { status: 'ok', chunks: [chunk()] },
		});

		await h.ask('what did we cover about skills?');

		expect(h.searchCalls).toEqual(['skills']);
		expect(h.model.callCount).toBe(2);

		// The excerpt, with its citation label, reached the second model call.
		expect(h.model.prompts[1] ?? '').toContain('Session 3 · recorded 2026-09-08');

		const content = lastContent(h.patched);
		expect(content).toContain('session 3');
		expect(content).toContain('Sources: [Session 3 · recorded 2026-09-08]');
		expect(content).toContain('https://cdn.example.com/session-3.mp4');
		// Never the raw filename — a student does not recognise it.
		expect(content).not.toContain('.mp4)');
	});

	it('exposes exactly one parameter on the search tool', async () => {
		const h = await harness({ steps: [{ type: 'text', text: 'ok' }] });
		await h.ask('anything');

		const call = h.model.model.doGenerateCalls[0];
		const search = call?.tools?.find((candidate) => candidate.name === 'search_course_content');
		expect(search).toBeDefined();
		const schema = (search as { inputSchema?: { properties?: Record<string, unknown> } } | undefined)?.inputSchema;
		expect(Object.keys(schema?.properties ?? {})).toEqual(['query']);
	});
});

/* ------------------------------------------------------------------ */
/* SearchOutcome handling                                              */
/* ------------------------------------------------------------------ */

describe('empty retrieval', () => {
	it('is framed as "not covered", not as an error or an apology', () => {
		const rendered = renderSearchOutcome({ status: 'empty' });

		expect(rendered).toMatch(/do not appear to cover/i);
		expect(rendered).toMatch(/not an error/i);
		expect(rendered).toMatch(/do not cite a session/i);
		expect(rendered).not.toMatch(/sorry|apolog|failed|unavailable/i);
	});

	it('is distinct from a search failure', () => {
		const failed = renderSearchOutcome({ status: 'error', message: 'Qdrant search returned 503' });
		expect(failed).toMatch(/unavailable/i);
		expect(failed).toMatch(/do not claim the material does not cover it/i);
	});

	it('attaches no sources, so nothing can look like a citation', async () => {
		const h = await harness({
			steps: [
				{ type: 'tool', toolName: 'search_course_content', input: { query: 'kubernetes' } },
				{
					type: 'text',
					text: "Our recordings don't appear to cover Kubernetes. Generally speaking, it orchestrates containers.",
				},
			],
			search: { status: 'empty' },
		});

		await h.ask('did we cover kubernetes?');

		const content = lastContent(h.patched);
		expect(content).not.toContain('Sources:');
		expect(content).not.toMatch(/session \d/i);
		expect(content).toContain("don't appear to cover");
	});

	it('selects no sources from an empty chunk list', () => {
		expect(selectSources([], 'anything at all')).toEqual([]);
	});
});

/* ------------------------------------------------------------------ */
/* AssignmentsOutcome handling                                         */
/* ------------------------------------------------------------------ */

describe('assignments', () => {
	/**
	 * The whole reason `misconfigured` exists. `Active` is false on all 431 rows
	 * across four sibling tables in this Baserow instance; if table 1068 rots the
	 * same way, the naive reading tells a class they have no homework.
	 */
	it('reports a misconfigured list as a problem, never as "nothing due"', async () => {
		const h = await harness({
			steps: [
				{ type: 'tool', toolName: 'list_assignments', input: {} },
				{
					type: 'text',
					text: 'The assignment list looks misconfigured on my end, so I cannot read it. Please check with the instructor.',
				},
			],
			assignments: { status: 'misconfigured', totalRows: 7 },
		});

		await h.ask('what do I have due?');

		expect(h.assignmentCalls).toBe(1);

		const toolOutput = renderAssignmentsOutcome({ status: 'misconfigured', totalRows: 7 });
		expect(toolOutput).toMatch(/misconfigured/i);
		expect(toolOutput).toContain('7 row(s)');
		expect(toolOutput).toMatch(/check with the instructor/i);

		// Neither the tool output the model reads, nor the reply the student sees,
		// may contain anything that reads as "you have nothing due".
		const forbidden = /nothing (is )?due|no assignments|nothing to (do|turn in)|caught up|all set|no outstanding/i;
		expect(toolOutput).not.toMatch(forbidden);
		expect(lastContent(h.patched)).not.toMatch(forbidden);
	});

	it('distinguishes an empty table from a misconfigured one', () => {
		const empty = renderAssignmentsOutcome({ status: 'empty' });
		expect(empty).toMatch(/no rows at all/i);
		expect(empty).not.toMatch(/misconfigured/i);
	});

	it('surfaces an unreachable list as unreachable', () => {
		const failed = renderAssignmentsOutcome({ status: 'error', message: "I couldn't reach the assignment list just now." });
		expect(failed).toMatch(/couldn't reach the assignment list/i);
		expect(failed).toMatch(/do not guess/i);
	});

	it('renders assignment rows including generic passthrough fields', () => {
		const rendered = renderAssignmentsOutcome({
			status: 'ok',
			assignments: [
				{
					name: 'Skill build',
					notes: 'Ship one working skill.',
					documentUrl: 'https://docs.example.com/skill-build',
					extra: { Due: '2026-09-22T03:59:00Z', Type: 'Lab' },
				},
			],
		});

		expect(rendered).toContain('Skill build');
		expect(rendered).toContain('Due: 2026-09-22T03:59:00Z');
		expect(rendered).toContain('Type: Lab');
	});
});

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */

describe('rate limiting', () => {
	it('refuses the 21st question in an hour without calling the model', async () => {
		const h = await harness({ steps: [{ type: 'text', text: 'ok' }] });

		for (let i = 0; i < 20; i++) {
			await h.ask(`question ${i}`);
		}
		expect(h.model.callCount).toBe(20);

		await h.ask('question 21');

		expect(h.model.callCount).toBe(20); // no 21st model call
		expect(h.patched).toHaveLength(21); // but the student still hears back
		expect(lastContent(h.patched)).toMatch(/hourly question limit/i);
	});

	it('counts per user, so one heavy asker does not lock out the thread', async () => {
		const h = await harness({ steps: [{ type: 'text', text: 'ok' }] });

		for (let i = 0; i < 20; i++) {
			await h.ask(`question ${i}`, { userKey: 'heavy-user' });
		}
		await h.ask('blocked', { userKey: 'heavy-user' });
		expect(lastContent(h.patched)).toMatch(/hourly question limit/i);

		await h.ask('fine', { userKey: 'other-user' });
		expect(lastContent(h.patched)).not.toMatch(/limit/i);
	});
});

/* ------------------------------------------------------------------ */
/* Multi-turn                                                          */
/* ------------------------------------------------------------------ */

describe('thread state', () => {
	it('shows the second question the first exchange', async () => {
		const h = await harness({
			steps: [
				{ type: 'text', text: 'Retrieval-augmented generation.' },
				{ type: 'text', text: 'It grounds answers in retrieved documents.' },
			],
		});

		await h.ask('what does RAG stand for?');
		await h.ask('why does it matter?');

		expect(h.model.callCount).toBe(2);

		const second = h.model.prompts[1] ?? '';
		expect(second).toContain('what does RAG stand for?');
		expect(second).toContain('Retrieval-augmented generation.');
		expect(second).toContain('why does it matter?');

		// The first call saw no history — it was the first thing said in the thread.
		const first = h.model.prompts[0] ?? '';
		expect(first).not.toContain('why does it matter?');
	});

	it('does not persist an exchange that was rate limited', async () => {
		const h = await harness({ steps: [{ type: 'text', text: 'ok' }] });

		for (let i = 0; i < 20; i++) await h.ask(`question ${i}`);
		await h.ask('refused question');
		await h.ask('another refused question');

		// A refusal is not an exchange, so nothing new should be in history when
		// the counter eventually clears. Model was never called for either.
		expect(h.model.callCount).toBe(20);
	});
});

/* ------------------------------------------------------------------ */
/* Failure handling                                                    */
/* ------------------------------------------------------------------ */

describe('failures', () => {
	it('PATCHes something back when the model call throws', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		const h = await harness({
			steps: [{ type: 'throw', error: new Error('upstream 529 overloaded') }],
		});

		const response = await h.ask('anything at all');

		expect(response.status).toBe(204);
		expect(h.patched).toHaveLength(1);
		expect(lastContent(h.patched)).toMatch(/something went wrong/i);
		// Never a permanent "thinking…", and never the raw upstream error.
		expect(lastContent(h.patched)).not.toContain('529');
	});

	it('never logs the question or the answer', async () => {
		const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

		const h = await harness({
			steps: [{ type: 'throw', error: new Error('boom') }],
		});
		await h.ask('a question about something private');

		const logged = errors.mock.calls.map((call) => JSON.stringify(call)).join('\n');
		expect(logged).not.toContain('a question about something private');
	});

	/**
	 * An AI SDK `APICallError` carries `requestBodyValues` — the whole request,
	 * system prompt and student question included. `console.error(error)` would
	 * serialise that straight into the Worker log, which is exactly the
	 * interaction logging the design declines to build.
	 */
	it('does not log an error object that carries the request body', async () => {
		const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

		const leaky = Object.assign(new Error('Bad Request'), {
			requestBodyValues: { messages: [{ role: 'user', content: 'my secret question text' }] },
		});

		const h = await harness({ steps: [{ type: 'throw', error: leaky }] });
		await h.ask('my secret question text');

		const logged = errors.mock.calls.map((call) => JSON.stringify(call)).join('\n');
		expect(logged).not.toContain('my secret question text');
		expect(logged).toContain('Bad Request');
	});

	it('rejects a malformed ask body', async () => {
		const h = await harness({ steps: [{ type: 'text', text: 'ok' }] });

		const bad = await h.stub.fetch(
			new Request(AGENT_ASK_URL, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: 'not json',
			}),
		);
		expect(bad.status).toBe(400);

		const empty = await h.stub.fetch(
			new Request(AGENT_ASK_URL, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ question: '   ', interactionToken: 't', userKey: 'u', conversationId: 'c' }),
			}),
		);
		expect(empty.status).toBe(400);
		expect(h.model.callCount).toBe(0);
	});
});

/* ------------------------------------------------------------------ */
/* System prompt                                                       */
/* ------------------------------------------------------------------ */

describe('system prompt', () => {
	it('carries today\'s date in the course timezone, not UTC', async () => {
		const h = await harness({ steps: [{ type: 'text', text: 'ok' }], now: NOW });
		await h.ask('what is due tomorrow?');

		const system = h.model.systems[0] ?? '';
		// NOW is 2026-09-09T02:30Z, which is still 2026-09-08 in America/Detroit.
		expect(system).toContain('2026-09-08');
		expect(system).toContain('America/Detroit');
		expect(system).not.toContain('2026-09-09');
	});

	it('respects DST rather than a hand-rolled offset', () => {
		const summer = courseDate(new Date('2026-09-09T02:30:00Z'), 'America/Detroit');
		expect(summer.iso).toBe('2026-09-08'); // EDT, UTC-4

		const winter = courseDate(new Date('2026-01-15T04:30:00Z'), 'America/Detroit');
		expect(winter.iso).toBe('2026-01-14'); // EST, UTC-5
	});

	it('falls back to UTC on an unusable timezone rather than throwing', () => {
		const fallback = courseDate(NOW, 'Not/AZone');
		expect(fallback.timeZone).toBe('UTC');
		expect(fallback.iso).toBe('2026-09-09');
	});

	it('tells Archie to answer general questions without searching', () => {
		const system = buildSystemPrompt(env, NOW);
		expect(system).toMatch(/answer directly/i);
		expect(system).toMatch(/Do not search/i);
		expect(system).not.toMatch(/always search/i);
	});

	it('draws the study-aide line at writing the submission', () => {
		const system = buildSystemPrompt(env, NOW);
		expect(system).toMatch(/understand an assignment is the job/i);
		expect(system).toMatch(/do not produce the deliverable/i);
	});

	it('forbids timestamp citations, which the payload cannot support', () => {
		const system = buildSystemPrompt(env, NOW);
		expect(system).toMatch(/never cite a timestamp/i);
		expect(system).toMatch(/session null/i);
	});
});

/* ------------------------------------------------------------------ */
/* Model wiring: AI Gateway auth and provider routing                  */
/* ------------------------------------------------------------------ */

/**
 * Drive the real provider once against a stub `fetch` and report what actually
 * went on the wire.
 *
 * Deliberately not a flag on a config object: the thing worth asserting is the
 * serialized header map the provider builds, because that is what a gateway
 * with Authentication enabled either accepts or 401s. The response is thrown
 * away — `doGenerate` may reject on the stub body, and the request has already
 * been captured by then.
 */
async function captureModelRequest(
	overrides: Partial<Env>,
): Promise<{ url: string; headers: Record<string, string> }> {
	let captured: { url: string; headers: Record<string, string> } | undefined;

	const stub = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const request = new Request(input as RequestInfo, init);
		const headers: Record<string, string> = {};
		request.headers.forEach((value, key) => {
			headers[key.toLowerCase()] = value;
		});
		captured = { url: request.url, headers };
		return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
	}) as unknown as typeof fetch;

	// `LanguageModel` is `LanguageModelV2 | string`; only the object half has doGenerate.
	const model = resolveAnswerModel({ ...env, ...overrides } as Env, stub) as Exclude<
		LanguageModel,
		string
	>;
	try {
		await model.doGenerate({ prompt: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }] });
	} catch {
		// The stub body is not a valid provider response; the request is what matters.
	}

	if (!captured) throw new Error('the provider made no outbound request');
	return captured;
}

describe('model wiring', () => {
	it('sends cf-aig-authorization to the gateway, on the /openai suffix', async () => {
		const { url, headers } = await captureModelRequest({
			AI_GATEWAY_BASE_URL: 'https://gateway.ai.cloudflare.com/v1/acct/archie',
			CF_AIG_TOKEN: 'test-cf-aig-token',
			OPENAI_API_KEY: 'test-openai-key',
		});

		// Same `/openai` suffix search.ts uses, so both legs share one gateway log.
		expect(url).toBe('https://gateway.ai.cloudflare.com/v1/acct/archie/openai/responses');
		expect(headers['cf-aig-authorization']).toBe('Bearer test-cf-aig-token');
		expect(headers['authorization']).toBe('Bearer test-openai-key');
	});

	/**
	 * The rail. `CF_AIG_TOKEN` is a Cloudflare API token; sending it to
	 * api.openai.com would hand a third party a credential for this account.
	 */
	it('sends no Cloudflare token at all when no gateway is configured', async () => {
		const { url, headers } = await captureModelRequest({
			AI_GATEWAY_BASE_URL: undefined,
			// Token present but unusable: the gateway check, not the token, decides.
			CF_AIG_TOKEN: 'test-cf-aig-token',
			OPENAI_API_KEY: 'test-openai-key',
		});

		expect(url).toBe('https://api.openai.com/v1/responses');
		expect(Object.keys(headers)).not.toContain('cf-aig-authorization');
		expect(JSON.stringify(headers)).not.toContain('test-cf-aig-token');
	});

	it('refuses to build a model for an authenticated gateway with no token', () => {
		expect(() =>
			resolveAnswerModel({
				...env,
				AI_GATEWAY_BASE_URL: 'https://gateway.ai.cloudflare.com/v1/acct/archie',
				CF_AIG_TOKEN: undefined,
			} as Env),
		).toThrow(/CF_AIG_TOKEN/);
	});
});

/* ------------------------------------------------------------------ */
/* Citations and rendering                                             */
/* ------------------------------------------------------------------ */

describe('citations', () => {
	it('labels every nullable combination without emitting "Session null"', () => {
		expect(citationLabel(chunk())).toBe('Session 3 · recorded 2026-09-08');
		expect(citationLabel(chunk({ recordedOn: null }))).toBe('Session 3');
		expect(citationLabel(chunk({ session: null }))).toBe('Class recording · recorded 2026-09-08');
		expect(citationLabel(chunk({ session: null, recordedOn: null }))).toBe('Class recording');
	});

	it('deduplicates to the recording and prefers what the answer mentions', () => {
		const chunks = [
			chunk({ session: 3, score: 0.9 }),
			chunk({ session: 3, score: 0.8 }),
			chunk({
				session: 5,
				recordedOn: '2026-09-22',
				score: 0.7,
				sourceUrl: 'https://cdn.example.com/session-5.mp4',
			}),
		];

		const mentioned = selectSources(chunks, 'As we said in session 5, the loop runs twice.');
		expect(mentioned).toEqual([
			{ label: 'Session 5 · recorded 2026-09-22', url: 'https://cdn.example.com/session-5.mp4' },
		]);

		// Nothing named in the answer: fall back to best-scoring, deduplicated.
		const fallback = selectSources(chunks, 'Here is a general answer.');
		expect(fallback).toHaveLength(2);
		expect(fallback[0]?.label).toBe('Session 3 · recorded 2026-09-08');
	});

	it('caps the source list rather than dumping every retrieved chunk', () => {
		const chunks = Array.from({ length: 10 }, (_, i) =>
			chunk({ session: i + 1, recordedOn: null, sourceUrl: `https://cdn.example.com/${i}.mp4`, score: 1 - i / 100 }),
		);
		expect(selectSources(chunks, 'no citations here')).toHaveLength(3);
	});

	it('drops an unidentifiable chunk with nothing to link to', () => {
		expect(selectSources([chunk({ session: null, recordedOn: null, sourceUrl: null })], 'text')).toEqual([]);
	});
});

describe('reply rendering', () => {
	it('keeps the whole reply inside Discord\'s 2000-character limit', () => {
		const rendered = renderReply({
			text: 'x'.repeat(4000),
			sources: [{ label: 'Session 3 · recorded 2026-09-08', url: 'https://cdn.example.com/s3.mp4' }],
		});

		expect(rendered.length).toBeLessThanOrEqual(2000);
		// The answer is what gets trimmed; the citation survives.
		expect(rendered).toContain('Sources: [Session 3 · recorded 2026-09-08]');
	});

	it('omits the source line entirely when there is nothing to cite', () => {
		expect(renderReply({ text: 'A general answer.', sources: [] })).toBe('A general answer.');
	});
});
