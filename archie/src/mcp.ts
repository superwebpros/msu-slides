/**
 * Archie's remote MCP server — a second transport onto the same two tools.
 *
 * Students add `https://<worker>/mcp/<secret>` as a custom connector in
 * claude.ai and get the same `search_course_content` and `list_assignments`
 * that the Discord bot uses. **Nothing here is new retrieval logic.**
 * `src/tools/search.ts` still owns the collection literal and the `must`
 * filter; `src/tools/assignments.ts` still owns the `Active` filter and the
 * `_`-prefix strip. This file is transport plus rendering, and no more.
 *
 * Four things in here are load-bearing:
 *
 *  1. **`search_course_content` takes exactly one string.** No collection, no
 *     course, no limit — same rail as the Discord tool. The Qdrant key can read
 *     all 32 collections on the instance, including client data, and the only
 *     thing keeping Archie inside `course_content` is that the collection name
 *     is a hardcoded var. Every extra knob here is a lever for a prompt
 *     injection, and over MCP the "prompt" is whatever a student typed into
 *     claude.ai.
 *
 *  2. **The outcome switches have no `default`.** Exactly as in `src/agent.ts`:
 *     the declared `string` return is what turns a new `SearchOutcome` or
 *     `AssignmentsOutcome` variant into a compile error rather than a silent
 *     fallthrough. Do not add a `default` "for safety" — the default IS the
 *     unsafe branch.
 *
 *  3. **`misconfigured` never reads as "nothing due".** Same reason as the
 *     Discord path: `Active` is false on all 431 rows across four sibling
 *     tables in this Baserow instance. If table 1068 rots the same way, the
 *     naive reading tells a class they have no homework.
 *
 *  4. **A bad secret is a 404, not a 401.** `handleMcpRequest` returns `null`
 *     for anything it does not own, and `src/index.ts` then falls through to
 *     the same "Not found" it gives any unknown URL. A 401 would confirm that
 *     `/mcp/<something>` is a real endpoint worth grinding on.
 *
 * Transport note: this uses `createMcpHandler` from `agents/mcp` (v0.2.35),
 * which is *stateless* Streamable HTTP — a fresh `McpServer` and
 * `WorkerTransport` per request, no session id, no Durable Object. The older
 * `McpAgent.serve()` API would have needed a new DO class, a new binding and a
 * new migration tag; none of that is required here, and not adding a migration
 * is strictly safer than adding one next to the deployed `CourseAgent`.
 */

import { createMcpHandler } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/cfworker';
import { z } from 'zod';

import { citationLabel } from './agent';
import { listAssignments } from './tools/assignments';
import {
	SEARCH_TOOL_DESCRIPTION,
	SEARCH_TOOL_NAME,
	searchCourseContent,
} from './tools/search';
import type { Assignment, AssignmentsOutcome, Env, SearchOutcome } from './types';

/* ------------------------------------------------------------------ */
/* Route                                                               */
/* ------------------------------------------------------------------ */

/**
 * Everything Archie's MCP server answers lives under here, and the next path
 * segment is the shared secret: `/mcp/<MCP_PATH_SECRET>`.
 *
 * The secret is in the path rather than a header because claude.ai's custom
 * connector UI takes a URL and (without a full OAuth flow) not much else. It is
 * a bearer token wearing a URL's clothes: it will end up in the student's
 * browser history and in any screenshot of the connector settings. That is an
 * accepted trade for a 25-person class — rotate it by setting a new secret.
 */
export const MCP_ROUTE_PREFIX = '/mcp/';

/** Name and description of the second tool. Mirrors `src/agent.ts`. */
export const ASSIGNMENTS_TOOL_NAME = 'list_assignments';

export const ASSIGNMENTS_TOOL_DESCRIPTION =
	'List the active assignments for this course, with any notes, due dates and ' +
	'links attached to them. Takes no parameters. Use for questions about what is ' +
	'due, what an assignment asks for, or what is coming up.';

/** What claude.ai shows the student, and what the model is told up front. */
const SERVER_INFO = { name: 'archie', version: '0.1.0' } as const;

const SERVER_INSTRUCTIONS =
	'Archie is the course assistant for this class. `search_course_content` searches ' +
	'transcripts of the recorded class sessions; `list_assignments` reads the live ' +
	'assignment list. Prefer these tools over your own memory for anything specific to ' +
	'this course, cite the session number and recording date the search returns, and do ' +
	'not invent either one.';

/* ------------------------------------------------------------------ */
/* Injection seam                                                      */
/* ------------------------------------------------------------------ */

/** Same shape as `AgentDeps`, minus the parts MCP has no use for. */
export interface McpDeps {
	search?: typeof searchCourseContent;
	assignments?: typeof listAssignments;
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

/**
 * Handle an MCP request, or decline it.
 *
 * Returns `null` — not a 404 — for every request this module does not own, so
 * that the caller answers with its ordinary "Not found". A wrong secret and a
 * typo'd URL are then literally the same response, byte for byte.
 *
 * Declines when:
 *   - the path is not under {@link MCP_ROUTE_PREFIX};
 *   - `MCP_PATH_SECRET` is unset or empty (the route does not exist at all —
 *     an unconfigured secret must never mean "open to everyone");
 *   - the segment after the prefix is missing, wrong, or has anything after it.
 */
export async function handleMcpRequest(
	request: Request,
	env: Env,
	ctx: ExecutionContext,
	deps: McpDeps = {},
): Promise<Response | null> {
	const url = new URL(request.url);
	if (!url.pathname.startsWith(MCP_ROUTE_PREFIX)) return null;

	// Unset secret disables the route entirely. Fail closed, never open.
	const secret = env.MCP_PATH_SECRET;
	if (!secret) return null;

	// Exactly one segment after the prefix. `/mcp/<secret>/anything` is not the
	// endpoint, and neither is `/mcp/`.
	const candidate = url.pathname.slice(MCP_ROUTE_PREFIX.length);
	if (!candidate || candidate.includes('/')) return null;

	if (!(await secretMatches(candidate, secret))) return null;

	const server = buildMcpServer(env, deps);

	// `route` is the exact pathname we just validated, so the handler's own
	// route check is a tautology and the auth decision stays in one place above.
	const handler = createMcpHandler(server, { route: url.pathname });
	return await handler(request, env, ctx);
}

/**
 * Constant-time-ish comparison of the path segment against the secret.
 *
 * Both sides are hashed to a fixed 32 bytes first, then compared with an
 * accumulating XOR. Hashing is what makes this cheap to get right: the compare
 * loop always runs the same number of iterations regardless of how long either
 * input is, so it leaks neither the secret's length nor the position of the
 * first differing byte. (A plain `a === b` leaks both, and over a public URL
 * that is a free hint.)
 */
async function secretMatches(candidate: string, secret: string): Promise<boolean> {
	const encoder = new TextEncoder();
	const [candidateDigest, secretDigest] = await Promise.all([
		crypto.subtle.digest('SHA-256', encoder.encode(candidate)),
		crypto.subtle.digest('SHA-256', encoder.encode(secret)),
	]);

	const a = new Uint8Array(candidateDigest);
	const b = new Uint8Array(secretDigest);

	let diff = a.length ^ b.length;
	for (let i = 0; i < a.length; i++) {
		diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
	}
	return diff === 0;
}

/* ------------------------------------------------------------------ */
/* Server                                                              */
/* ------------------------------------------------------------------ */

/**
 * Build the two-tool MCP server.
 *
 * Exported for tests, which drive it over real JSON-RPC through
 * {@link handleMcpRequest} rather than calling this directly — but a caller
 * that wants to mount Archie somewhere else should start here.
 */
export function buildMcpServer(env: Env, deps: McpDeps = {}): McpServer {
	const search = deps.search ?? searchCourseContent;
	const assignments = deps.assignments ?? listAssignments;

	// `CfWorkerJsonSchemaValidator`, not the SDK's default AJV one. This is not a
	// preference: AJV compiles schemas with `new Function`, which the Workers
	// runtime forbids, so the default would throw the first time a tool argument
	// was validated. `@cfworker/json-schema` interprets instead of codegenning.
	// (It also keeps the vitest ajv stub in test/stubs/ajv-unused.mjs honest —
	// nothing in Archie should ever construct an AJV.)
	const server = new McpServer(SERVER_INFO, {
		instructions: SERVER_INSTRUCTIONS,
		jsonSchemaValidator: new CfWorkerJsonSchemaValidator(),
	});

	server.registerTool(
		SEARCH_TOOL_NAME,
		{
			title: 'Search course recordings',
			description: SEARCH_TOOL_DESCRIPTION,
			// Exactly one parameter, forever. See rail #1 at the top of this file.
			inputSchema: {
				query: z.string().describe('What to look for in the class recordings.'),
			},
			annotations: { readOnlyHint: true, openWorldHint: true },
		},
		async ({ query }) => ({
			content: [{ type: 'text' as const, text: renderSearch(await search(query, env)) }],
		}),
	);

	server.registerTool(
		ASSIGNMENTS_TOOL_NAME,
		{
			title: 'List course assignments',
			description: ASSIGNMENTS_TOOL_DESCRIPTION,
			inputSchema: {},
			annotations: { readOnlyHint: true, openWorldHint: true },
		},
		async () => ({
			content: [{ type: 'text' as const, text: renderAssignments(await assignments(env)) }],
		}),
	);

	return server;
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

/**
 * Turn a {@link SearchOutcome} into the text claude.ai reads.
 *
 * Written for a human who will read Claude's answer, not for a machine: the
 * failure modes are described in words a student would accept, because Claude
 * may well quote them.
 *
 * Every variant, no `default` — see rail #2.
 */
export function renderSearch(outcome: SearchOutcome): string {
	switch (outcome.status) {
		case 'ok': {
			const excerpts = outcome.chunks.map((chunk, index) => {
				const link = chunk.sourceUrl ? `\nRecording: ${chunk.sourceUrl}` : '';
				return `[${index + 1}] ${citationLabel(chunk)}${link}\n${chunk.content}`;
			});
			return [
				`${outcome.chunks.length} excerpt(s) from the recorded class sessions:`,
				'',
				excerpts.join('\n\n'),
				'',
				'Cite the session number and recording date shown above. Where an excerpt shows no ' +
					'session number or no date, do not supply one. These transcripts carry no ' +
					'timestamps, so do not cite a time within a recording.',
			].join('\n');
		}
		case 'empty':
			return (
				'The search ran fine and matched nothing in the indexed class recordings. Nothing ' +
				'broke — the class material simply does not appear to cover this. Say that the ' +
				'recordings do not appear to cover it, then answer from your own knowledge if you ' +
				'can, labelled as general knowledge rather than as something from class. Do not ' +
				'cite a session.'
			);
		case 'error':
			return (
				`The class recordings cannot be searched right now (${outcome.message}). Tell the ` +
				'student the course material is unreachable at the moment. Answer from general ' +
				'knowledge if you can, and do not claim the material does not cover it — that is ' +
				'not something this result shows.'
			);
	}
}

/**
 * Turn an {@link AssignmentsOutcome} into the text claude.ai reads.
 *
 * Every variant, no `default` — and see rail #3 about `misconfigured`.
 */
export function renderAssignments(outcome: AssignmentsOutcome): string {
	switch (outcome.status) {
		case 'ok':
			return [
				`${outcome.assignments.length} active assignment(s):`,
				'',
				outcome.assignments.map(renderAssignment).join('\n\n'),
			].join('\n');
		case 'empty':
			return (
				'The assignment list is genuinely empty: the table has no rows at all, so nothing ' +
				'is posted right now. It is safe to say that the course has not posted anything yet.'
			);
		case 'misconfigured':
			// NOT "nothing due". The table has rows; none are flagged active. Telling a
			// student they have no homework here is the exact failure this variant exists
			// to prevent — `Active` is false on all 431 rows across four sibling tables.
			return (
				`The assignment list could not be read. The table holds ${outcome.totalRows} row(s), ` +
				'but none of them are flagged active, so the real list is unavailable and this is a ' +
				'misconfiguration rather than an empty list. Tell the student the assignment list ' +
				'appears misconfigured and that they should check with the instructor or the course ' +
				'channel. Report it as a fault in the list, never as a statement about their ' +
				'workload: rows exist and cannot be read, which is a different thing from an empty ' +
				'list, and saying otherwise would probably be false.'
			);
		case 'error':
			return (
				`The assignment list is unreachable right now: ${outcome.message} Tell the student ` +
				'you cannot read it at the moment, and do not guess at what is due.'
			);
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
