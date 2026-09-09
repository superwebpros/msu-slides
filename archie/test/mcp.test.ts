/// <reference types="@cloudflare/vitest-pool-workers" />

/**
 * Tests for the remote MCP server (`src/mcp.ts`).
 *
 * These drive the *real* thing over real MCP JSON-RPC: the request goes into
 * `worker.fetch`, through the path-secret gate, through `createMcpHandler`'s
 * `WorkerTransport`, into the real `@modelcontextprotocol/sdk` `McpServer`, and
 * the Streamable HTTP / SSE response is parsed back out. Only the two tool
 * bodies are faked, so nothing here touches Qdrant, OpenAI or Baserow.
 *
 * The tests that are about behaviour rather than plumbing, and should not be
 * "fixed" if they start failing:
 *
 *   - a wrong or missing secret is a **404**, byte-identical to any typo'd URL
 *   - an unset `MCP_PATH_SECRET` removes the route rather than opening it
 *   - `tools/list` returns exactly two tools, and search takes exactly `query`
 *   - an empty search reads as "not covered", never as a failure
 *   - a `misconfigured` assignment list never reads as "nothing due"
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import worker from '../src/index';
import {
	ASSIGNMENTS_TOOL_NAME,
	buildMcpServer,
	handleMcpRequest,
	renderAssignments,
	renderSearch,
} from '../src/mcp';
import { SEARCH_TOOL_NAME } from '../src/tools/search';
import type {
	AssignmentsOutcome,
	CourseChunk,
	Env,
	SearchOutcome,
} from '../src/types';

afterEach(() => {
	vi.restoreAllMocks();
});

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const SECRET = 's3cr3t-path-segment';

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

function makeEnv(overrides: Partial<Env> = {}): Env {
	return {
		DISCORD_BOT_TOKEN: 'test-bot-token',
		DISCORD_PUBLIC_KEY: '00'.repeat(32),
		DISCORD_APPLICATION_ID: '111111111111111111',
		ANTHROPIC_API_KEY: 'test',
		OPENAI_API_KEY: 'test',
		QDRANT_URL: 'https://qdrant.invalid',
		QDRANT_API_KEY: 'test',
		BASEROW_BASEURL: 'https://baserow.invalid',
		BASEROW_RESOURCE_TOKEN: 'test',
		ARCHIE_USER_SALT: 'test-salt',
		MCP_PATH_SECRET: SECRET,
		ACTIVE_COURSE: 'ssc-490',
		QDRANT_COLLECTION: 'course_content',
		EMBEDDING_MODEL: 'text-embedding-3-small',
		ANSWER_MODEL: 'gpt-5.5',
		BASEROW_DOCUMENTS_TABLE_ID: '1068',
		COURSE_TIMEZONE: 'America/Detroit',
		SEARCH_TOP_K: '10',
		COURSE_AGENT: undefined as unknown as DurableObjectNamespace,
		...overrides,
	};
}

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

/* ------------------------------------------------------------------ */
/* JSON-RPC over Streamable HTTP                                       */
/* ------------------------------------------------------------------ */

interface JsonRpcResponse {
	jsonrpc: '2.0';
	id: number | string | null;
	result?: Record<string, unknown>;
	error?: { code: number; message: string };
}

/** The `Accept` a Streamable HTTP client must send. The transport enforces it. */
const MCP_ACCEPT = 'application/json, text/event-stream';

const INITIALIZE_PARAMS = {
	protocolVersion: '2025-06-18',
	capabilities: {},
	clientInfo: { name: 'test-client', version: '0.0.0' },
};

function rpcRequest(path: string, body: unknown): Request {
	return new Request(`https://archie.test${path}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			accept: MCP_ACCEPT,
		},
		body: JSON.stringify(body),
	});
}

/**
 * Read a single JSON-RPC response out of the transport's reply.
 *
 * `createMcpHandler` defaults to the streaming path, so the body is
 * `text/event-stream` framed as `event: message\ndata: {...}\n\n`. The stream is
 * closed once the response is written, so `.text()` terminates.
 */
async function readRpc(response: Response): Promise<JsonRpcResponse> {
	const contentType = response.headers.get('content-type') ?? '';
	const raw = await response.text();

	if (contentType.includes('application/json')) {
		return JSON.parse(raw) as JsonRpcResponse;
	}

	expect(contentType).toContain('text/event-stream');
	const data = raw
		.split('\n')
		.filter((line) => line.startsWith('data:'))
		.map((line) => line.slice('data:'.length).trim());

	expect(data.length).toBeGreaterThan(0);
	return JSON.parse(data[data.length - 1] as string) as JsonRpcResponse;
}

/**
 * A live MCP session against the Worker: initialize, then whatever the test
 * wants. Every call goes through `worker.fetch`, so the path gate is exercised
 * on each one.
 */
async function session(env: Env, path = `/mcp/${SECRET}`) {
	const { ctx } = makeCtx();
	let nextId = 1;

	async function call(method: string, params?: unknown): Promise<JsonRpcResponse> {
		const response = await worker.fetch(
			rpcRequest(path, { jsonrpc: '2.0', id: nextId++, method, params: params ?? {} }),
			env,
			ctx,
		);
		expect(response.status).toBe(200);
		return readRpc(response);
	}

	const initialized = await call('initialize', INITIALIZE_PARAMS);
	return { call, initialized };
}

/* ------------------------------------------------------------------ */
/* Routing and auth                                                    */
/* ------------------------------------------------------------------ */

describe('mcp route gating', () => {
	it('serves the MCP endpoint at /mcp/<secret>', async () => {
		const { initialized } = await session(makeEnv());
		expect(initialized.error).toBeUndefined();
		expect(initialized.result).toBeDefined();
	});

	/**
	 * 404, not 401. A 401 would confirm that `/mcp/<something>` is a real
	 * endpoint; the whole point of a secret path segment is that a prober
	 * cannot tell it from a typo.
	 */
	it('404s a wrong secret', async () => {
		const { ctx } = makeCtx();
		const response = await worker.fetch(
			rpcRequest('/mcp/wrong', { jsonrpc: '2.0', id: 1, method: 'initialize', params: INITIALIZE_PARAMS }),
			makeEnv(),
			ctx,
		);
		expect(response.status).toBe(404);
		expect(response.status).not.toBe(401);
	});

	it('404s the bare prefix', async () => {
		const { ctx } = makeCtx();
		for (const path of ['/mcp/', '/mcp']) {
			const response = await worker.fetch(
				rpcRequest(path, { jsonrpc: '2.0', id: 1, method: 'initialize', params: INITIALIZE_PARAMS }),
				makeEnv(),
				ctx,
			);
			expect(response.status, path).toBe(404);
		}
	});

	it('404s a secret with extra path after it', async () => {
		const { ctx } = makeCtx();
		const response = await worker.fetch(
			rpcRequest(`/mcp/${SECRET}/extra`, { jsonrpc: '2.0', id: 1, method: 'initialize', params: INITIALIZE_PARAMS }),
			makeEnv(),
			ctx,
		);
		expect(response.status).toBe(404);
	});

	it('404s a prefix of the secret (no early-exit shortcut)', async () => {
		const { ctx } = makeCtx();
		const response = await worker.fetch(
			rpcRequest(`/mcp/${SECRET.slice(0, -1)}`, { jsonrpc: '2.0', id: 1, method: 'initialize', params: INITIALIZE_PARAMS }),
			makeEnv(),
			ctx,
		);
		expect(response.status).toBe(404);
	});

	/**
	 * An unconfigured secret must remove the route, not open it. This is the
	 * failure mode that turns a forgotten `wrangler secret put` into a public
	 * endpoint onto the course tools.
	 */
	it('disables the route entirely when MCP_PATH_SECRET is unset', async () => {
		const { ctx } = makeCtx();
		const env = makeEnv({ MCP_PATH_SECRET: undefined });

		for (const path of [`/mcp/${SECRET}`, '/mcp/anything', '/mcp/']) {
			const response = await worker.fetch(
				rpcRequest(path, { jsonrpc: '2.0', id: 1, method: 'initialize', params: INITIALIZE_PARAMS }),
				env,
				ctx,
			);
			expect(response.status, path).toBe(404);
		}

		// And the module itself declines rather than answering.
		expect(
			await handleMcpRequest(rpcRequest(`/mcp/${SECRET}`, {}), env, ctx),
		).toBeNull();
	});

	it('treats an empty-string secret as unset', async () => {
		const { ctx } = makeCtx();
		const env = makeEnv({ MCP_PATH_SECRET: '' });
		const response = await worker.fetch(rpcRequest('/mcp/', {}), env, ctx);
		expect(response.status).toBe(404);
	});

	/** A wrong secret must look exactly like an unrelated URL. */
	it('gives a wrong secret the same response as an unknown path', async () => {
		const { ctx } = makeCtx();
		const env = makeEnv();

		const wrong = await worker.fetch(
			rpcRequest('/mcp/wrong', { jsonrpc: '2.0', id: 1, method: 'initialize', params: INITIALIZE_PARAMS }),
			env,
			ctx,
		);
		const unrelated = await worker.fetch(
			rpcRequest('/definitely-not-a-route', { jsonrpc: '2.0', id: 1, method: 'initialize' }),
			env,
			ctx,
		);

		expect(wrong.status).toBe(unrelated.status);
		expect(await wrong.text()).toBe(await unrelated.text());
	});

	it('declines any path outside the /mcp/ prefix', async () => {
		const { ctx } = makeCtx();
		expect(
			await handleMcpRequest(rpcRequest('/health', {}), makeEnv(), ctx),
		).toBeNull();
	});
});

/* ------------------------------------------------------------------ */
/* Protocol surface                                                    */
/* ------------------------------------------------------------------ */

describe('mcp protocol', () => {
	it('returns a valid initialize result', async () => {
		const { initialized } = await session(makeEnv());

		const result = initialized.result as {
			protocolVersion: string;
			capabilities: { tools?: unknown };
			serverInfo: { name: string; version: string };
			instructions?: string;
		};

		expect(initialized.jsonrpc).toBe('2.0');
		expect(initialized.id).toBe(1);
		expect(typeof result.protocolVersion).toBe('string');
		expect(result.capabilities.tools).toBeDefined();
		expect(result.serverInfo.name).toBe('archie');
		expect(result.serverInfo.version).toBe('0.1.0');
		expect(result.instructions).toMatch(/course assistant/i);
	});

	it('lists exactly the two tools', async () => {
		const { call } = await session(makeEnv());
		const listed = await call('tools/list');

		const tools = (listed.result as { tools: Array<{ name: string; description?: string; inputSchema: Record<string, unknown> }> }).tools;

		expect(tools.map((t) => t.name).sort()).toEqual([ASSIGNMENTS_TOOL_NAME, SEARCH_TOOL_NAME].sort());
		expect(tools).toHaveLength(2);
	});

	/**
	 * The search surface is exactly one string, forever. No collection, no
	 * course, no limit: the Qdrant key can read every collection on the
	 * instance, and the only thing keeping Archie inside `course_content` is
	 * that the name is a hardcoded var. Any extra knob here is a lever for a
	 * prompt injection — and over MCP the prompt is whatever a student typed.
	 */
	it('exposes exactly one parameter on search_course_content', async () => {
		const { call } = await session(makeEnv());
		const listed = await call('tools/list');
		const tools = (listed.result as { tools: Array<{ name: string; inputSchema: Record<string, unknown> }> }).tools;

		const search = tools.find((t) => t.name === SEARCH_TOOL_NAME);
		expect(search).toBeDefined();

		const properties = search?.inputSchema.properties as Record<string, unknown>;
		expect(Object.keys(properties)).toEqual(['query']);
		expect(search?.inputSchema.required).toEqual(['query']);

		const assignments = tools.find((t) => t.name === ASSIGNMENTS_TOOL_NAME);
		const assignmentProperties = (assignments?.inputSchema.properties ?? {}) as Record<string, unknown>;
		expect(Object.keys(assignmentProperties)).toEqual([]);
	});
});

/* ------------------------------------------------------------------ */
/* tools/call                                                          */
/* ------------------------------------------------------------------ */

/** Text of a `tools/call` result, joined. */
function callText(response: JsonRpcResponse): string {
	const result = response.result as { content: Array<{ type: string; text?: string }>; isError?: boolean };
	expect(result.isError).toBeFalsy();
	return result.content.map((part) => part.text ?? '').join('\n');
}

/**
 * Drive `tools/call` with the tool bodies stubbed.
 *
 * `handleMcpRequest` takes the same deps bag the DO does, so the transport,
 * the server and the JSON-RPC framing are all real; only the network leaves
 * are faked.
 */
async function callTool(
	name: string,
	args: Record<string, unknown>,
	outcomes: { search?: SearchOutcome; assignments?: AssignmentsOutcome },
	env: Env = makeEnv(),
) {
	const { ctx } = makeCtx();
	const searchQueries: string[] = [];
	let assignmentCalls = 0;

	const deps = {
		search: async (query: string) => {
			searchQueries.push(query);
			return outcomes.search ?? ({ status: 'empty' } as SearchOutcome);
		},
		assignments: async () => {
			assignmentCalls += 1;
			return outcomes.assignments ?? ({ status: 'empty' } as AssignmentsOutcome);
		},
	};

	const path = `/mcp/${SECRET}`;
	const init = await handleMcpRequest(
		rpcRequest(path, { jsonrpc: '2.0', id: 1, method: 'initialize', params: INITIALIZE_PARAMS }),
		env,
		ctx,
		deps,
	);
	expect(init).not.toBeNull();
	await readRpc(init as Response);

	const response = await handleMcpRequest(
		rpcRequest(path, { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name, arguments: args } }),
		env,
		ctx,
		deps,
	);
	expect(response).not.toBeNull();

	return {
		rpc: await readRpc(response as Response),
		searchQueries,
		get assignmentCalls() {
			return assignmentCalls;
		},
	};
}

describe('tools/call', () => {
	it('renders search hits with session number and recording date', async () => {
		const called = await callTool(
			SEARCH_TOOL_NAME,
			{ query: 'what are skills?' },
			{ search: { status: 'ok', chunks: [chunk()] } },
		);

		expect(called.searchQueries).toEqual(['what are skills?']);

		const text = callText(called.rpc);
		expect(text).toContain('Session 3');
		expect(text).toContain('2026-09-08');
		expect(text).toContain('folders of instructions');
		expect(text).toContain('https://cdn.example.com/session-3.mp4');
	});

	it('renders the assignment list', async () => {
		const called = await callTool(
			ASSIGNMENTS_TOOL_NAME,
			{},
			{
				assignments: {
					status: 'ok',
					assignments: [
						{
							name: 'Session 3 deliverable',
							notes: 'Bring a working skill.',
							documentUrl: 'https://docs.example.com/a3',
							extra: { 'Due Date': '2026-09-12' },
						},
					],
				},
			},
		);

		expect(called.assignmentCalls).toBe(1);

		const text = callText(called.rpc);
		expect(text).toContain('Session 3 deliverable');
		expect(text).toContain('Bring a working skill.');
		expect(text).toContain('https://docs.example.com/a3');
		expect(text).toContain('2026-09-12');
	});

	/** `empty` is a fact about the recordings, not a fault. */
	it('renders an empty search as "not covered", not as a failure', async () => {
		const called = await callTool(
			SEARCH_TOOL_NAME,
			{ query: 'kubernetes' },
			{ search: { status: 'empty' } },
		);

		const text = callText(called.rpc);
		expect(text).toMatch(/do(es)? not appear to cover/i);
		expect(text).not.toMatch(/unavailable|unreachable|failed|went wrong|couldn't|cannot be searched/i);
	});

	it('renders a search failure as a failure, not as absence', async () => {
		const called = await callTool(
			SEARCH_TOOL_NAME,
			{ query: 'skills' },
			{ search: { status: 'error', message: 'Qdrant returned 503' } },
		);

		const text = callText(called.rpc);
		expect(text).toContain('Qdrant returned 503');
		expect(text).toMatch(/unreachable|cannot be searched/i);
	});

	/**
	 * The whole reason `misconfigured` exists. `Active` is false on all 431 rows
	 * across four sibling tables in this Baserow instance; if table 1068 rots the
	 * same way, the naive reading tells a class they have no homework.
	 *
	 * Grepped against the *serialized JSON-RPC response*, not just the render
	 * function, so a future change to the content framing cannot smuggle the
	 * phrasing back in.
	 */
	it('never lets a misconfigured list read as "nothing due"', async () => {
		const called = await callTool(
			ASSIGNMENTS_TOOL_NAME,
			{},
			{ assignments: { status: 'misconfigured', totalRows: 7 } },
		);

		const text = callText(called.rpc);
		expect(text).toMatch(/misconfigur/i);
		expect(text).toContain('7 row(s)');
		expect(text).toMatch(/check with the instructor/i);

		const forbidden = /nothing due|no assignments|caught up|no outstanding/i;
		expect(text).not.toMatch(forbidden);
		expect(JSON.stringify(called.rpc)).not.toMatch(forbidden);

		// The wider net the Discord path uses, too.
		expect(text).not.toMatch(/nothing (is )?due|nothing to (do|turn in)|all set/i);
	});

	it('reports an unknown tool as an error rather than inventing one', async () => {
		const called = await callTool('delete_everything', {}, {});
		const result = called.rpc.result as { isError?: boolean } | undefined;
		expect(called.rpc.error ?? result?.isError).toBeTruthy();
	});
});

/* ------------------------------------------------------------------ */
/* Renderers, directly                                                 */
/* ------------------------------------------------------------------ */

describe('renderers', () => {
	it('never invents a session, a date or a timestamp', () => {
		const text = renderSearch({
			status: 'ok',
			chunks: [chunk({ session: null, recordedOn: null, sourceUrl: null })],
		});

		expect(text).not.toMatch(/session (null|undefined|\d)/i);
		expect(text).toContain('Class recording');
		// No timestamps exist in the index; nothing may look like one.
		expect(text).not.toMatch(/\b\d{1,2}:\d{2}\b/);
		expect(text).toMatch(/no timestamps/i);
	});

	it('distinguishes an empty assignment table from a misconfigured one', () => {
		const empty = renderAssignments({ status: 'empty' });
		expect(empty).toMatch(/no rows at all/i);
		expect(empty).not.toMatch(/misconfigur/i);

		const broken = renderAssignments({ status: 'misconfigured', totalRows: 3 });
		expect(broken).toMatch(/misconfigur/i);
		expect(broken).not.toMatch(/no rows at all/i);
	});

	it('surfaces an unreachable assignment list as unreachable', () => {
		const failed = renderAssignments({
			status: 'error',
			message: "I couldn't reach the assignment list just now.",
		});
		expect(failed).toMatch(/unreachable/i);
		expect(failed).toMatch(/do not guess/i);
	});

	it('builds a server without touching the network', () => {
		expect(buildMcpServer(makeEnv())).toBeDefined();
	});
});

/* ------------------------------------------------------------------ */
/* The Discord path is untouched                                       */
/* ------------------------------------------------------------------ */

describe('coexistence with the Discord transport', () => {
	it('still serves /health', async () => {
		const { ctx } = makeCtx();
		const response = await worker.fetch(
			new Request('https://archie.test/health'),
			makeEnv(),
			ctx,
		);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe('ok');
	});

	/**
	 * The MCP branch runs before the Discord routing, so it must not swallow
	 * `/interactions`. An unsigned POST there is still a 401 from the verifier —
	 * which is exactly the response Discord requires during endpoint
	 * registration, and a response the MCP path must never produce.
	 */
	it('leaves /interactions to the Discord verifier', async () => {
		const { ctx } = makeCtx();
		const response = await worker.fetch(
			new Request('https://archie.test/interactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ type: 1 }),
			}),
			makeEnv(),
			ctx,
		);
		expect(response.status).toBe(401);
	});
});
