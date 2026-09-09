/**
 * search_course_content — semantic search over the course transcript corpus.
 *
 * Read-only. Two outbound calls per invocation:
 *   1. OpenAI embeddings (optionally via AI Gateway) to vectorise the query
 *   2. Qdrant `/points/search` on the ONE collection named by env
 *
 * ---------------------------------------------------------------------------
 * SAFETY RAILS — read before editing
 * ---------------------------------------------------------------------------
 *
 * 1. The collection name comes from `env.QDRANT_COLLECTION` and nowhere else.
 *    `QDRANT_API_KEY` is instance-wide: it can read all 32 collections on that
 *    Qdrant, including live client data (kb-medilodge-v1, orange_insoles_rp,
 *    *-HTSA-content-*, swp-partner-content-*, glcf-content-v1). Until a
 *    collection-scoped read-only JWT exists, Archie's isolation is a property
 *    of THIS LINE, not of the credential. Do not add a collection parameter,
 *    do not interpolate anything derived from the query or the model.
 *
 * 2. The semester filter uses `must`, never `should`. In Qdrant `should` is a
 *    hard OR, not a relevance boost: as the only clause it silently drops every
 *    non-matching point. A `should`-only filter in the n8n workflow has been
 *    excluding 10% of this collection for months. `test/search.test.ts` has a
 *    regression test asserting on the serialized filter. Keep it.
 *
 *    Fall students are scoped to Fall only: one course value, exact match. The
 *    session numbers collide across semesters (Spring session-3 was RAG, Fall
 *    session-3 is intro-to-skills), so a wrong-semester hit reads as plausible
 *    rather than obviously wrong.
 *
 * 3. Zero results is `{status:'empty'}`, never `{status:'error'}`. Conflating
 *    them makes Archie apologise when he should answer, or confabulate when he
 *    should say the material does not cover it.
 *
 * 4. Never log or echo an API key. Error messages here are safe to surface to
 *    the model; keys only ever travel in headers.
 *
 * 5. `cf-aig-authorization` goes out ONLY when `AI_GATEWAY_BASE_URL` is set. See
 *    {@link aiGatewayHeaders} — a direct-to-provider call must never carry a
 *    Cloudflare token to OpenAI.
 */

import type { CourseChunk, Env, SearchOutcome } from '../types';

/* ------------------------------------------------------------------ */
/* Tunables                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_TOP_K = 10;
const OPENAI_DIRECT_BASE = 'https://api.openai.com/v1';
const EMBEDDING_TIMEOUT_MS = 15_000;
const SEARCH_TIMEOUT_MS = 15_000;

/** Injectable seam so unit tests never touch the network. */
export interface SearchDeps {
	fetch?: typeof fetch;
}

/* ------------------------------------------------------------------ */
/* Filename parsing                                                    */
/* ------------------------------------------------------------------ */

/**
 * A date only counts as a recording date if it is the filename PREFIX — same
 * rule scripts/tag-semester.ts uses to derive `metadata.course`. Matching a
 * date anywhere in the name would pick up unrelated numbers.
 */
const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})(?=[_\-.]|$)/;

/**
 * `session-3`, `session-03`, `session_3`, `session 3`. Bounded on both sides so
 * `sessions-recap` or a bare `3` in a title never matches.
 */
const SESSION_TOKEN = /(?:^|[_\-\s])session[-_\s]?(\d{1,3})(?=[_\-.\s]|$)/i;

/**
 * Session number from a recording filename, or null when the name carries none.
 * Never guessed — a wrong session number in a citation reads as authoritative.
 */
export function parseSession(fileName: string): number | null {
	const m = SESSION_TOKEN.exec(fileName);
	if (!m || m[1] === undefined) return null;
	const n = Number.parseInt(m[1], 10);
	return Number.isFinite(n) ? n : null;
}

/**
 * ISO date from the filename prefix, or null when there is no date prefix.
 * Calendar-validated: `2026-13-45_session-1.mp4` yields null rather than a
 * bogus date.
 */
export function parseRecordedOn(fileName: string): string | null {
	const m = DATE_PREFIX.exec(fileName);
	if (!m) return null;
	const [, y, mo, d] = m;
	if (y === undefined || mo === undefined || d === undefined) return null;
	const month = Number(mo);
	const day = Number(d);
	if (month < 1 || month > 12 || day < 1 || day > 31) return null;
	// Reject 2026-02-31 and friends.
	const probe = new Date(`${y}-${mo}-${d}T00:00:00Z`);
	if (Number.isNaN(probe.getTime()) || probe.getUTCDate() !== day) return null;
	return `${y}-${mo}-${d}`;
}

/* ------------------------------------------------------------------ */
/* Qdrant response shapes (only the parts we read)                     */
/* ------------------------------------------------------------------ */

interface QdrantHit {
	id?: string | number;
	score?: number;
	payload?: {
		content?: unknown;
		metadata?: Record<string, unknown> | null;
	} | null;
}

/* ------------------------------------------------------------------ */
/* Embedding                                                           */
/* ------------------------------------------------------------------ */

function embeddingsUrl(env: Env): string {
	const gateway = env.AI_GATEWAY_BASE_URL?.trim();
	if (gateway) {
		// AI Gateway universal endpoint: <base>/openai/<openai path>
		return `${gateway.replace(/\/+$/, '')}/openai/embeddings`;
	}
	return `${OPENAI_DIRECT_BASE}/embeddings`;
}

/* ------------------------------------------------------------------ */
/* AI Gateway authentication                                           */
/* ------------------------------------------------------------------ */

/**
 * The extra header an authenticated AI Gateway requires, or nothing.
 *
 * Lives here because this file already owns the `<base>/openai` gateway
 * convention; `src/agent.ts` imports it so the model call and the embeddings
 * call cannot drift apart on the one rule that matters:
 *
 *  - **No gateway configured → `{}`.** `CF_AIG_TOKEN` is a Cloudflare API token.
 *    Attaching it to a direct `api.openai.com` request would hand a third party
 *    a credential for this Cloudflare account. That is the failure this function
 *    exists to make impossible, so the gateway check comes first and the token
 *    is never read when there is no gateway to send it to.
 *  - **Gateway configured, token missing → throw.** The `archie` gateway has
 *    Authentication enabled. Sending the request anyway produces a 401 that
 *    reads exactly like an OpenAI outage; the caller would blame the provider
 *    and never look at the config. Fail at the call site with the fix in the
 *    message instead.
 *
 * Callers that must not throw (this module's {@link searchCourseContent}) catch
 * it and turn it into an `error` outcome; `src/agent.ts` lets it propagate to
 * the one handler that always PATCHes something back to the student.
 */
export function aiGatewayHeaders(env: Env): Record<string, string> {
	const gateway = env.AI_GATEWAY_BASE_URL?.trim();
	if (!gateway) return {};

	const token = env.CF_AIG_TOKEN?.trim();
	if (!token) {
		throw new Error(
			'AI_GATEWAY_BASE_URL is set but CF_AIG_TOKEN is missing. The archie AI Gateway has ' +
				'Authentication enabled and will reject this request with a 401 that looks like a ' +
				'provider fault. Set the CF_AIG_TOKEN secret, or unset AI_GATEWAY_BASE_URL to call ' +
				'the provider directly.',
		);
	}
	return { 'cf-aig-authorization': `Bearer ${token}` };
}

/**
 * The model MUST match whatever indexed the collection (text-embedding-3-small,
 * 1536-dim, Cosine). A mismatch does not error — it silently returns garbage
 * neighbours — so this reads from env rather than being inferred anywhere.
 */
async function embedQuery(
	query: string,
	env: Env,
	doFetch: typeof fetch,
): Promise<{ ok: true; vector: number[] } | { ok: false; message: string }> {
	// Gateway auth is a configuration fault, not a network fault: decide it before
	// anything goes on the wire, so a missing token never becomes a 401 that reads
	// like OpenAI being down. See rail #5 / `aiGatewayHeaders`.
	let gatewayHeaders: Record<string, string>;
	try {
		gatewayHeaders = aiGatewayHeaders(env);
	} catch (err) {
		return { ok: false, message: describe(err) };
	}

	let res: Response;
	try {
		res = await doFetch(embeddingsUrl(env), {
			method: 'POST',
			headers: {
				authorization: `Bearer ${env.OPENAI_API_KEY}`,
				'content-type': 'application/json',
				// Empty unless a gateway is configured. Qdrant, below, never gets this.
				...gatewayHeaders,
			},
			body: JSON.stringify({ model: env.EMBEDDING_MODEL, input: query }),
			signal: AbortSignal.timeout(EMBEDDING_TIMEOUT_MS),
		});
	} catch (err) {
		return { ok: false, message: `Embedding request failed: ${describe(err)}` };
	}

	if (!res.ok) {
		return { ok: false, message: `Embedding API returned ${res.status}` };
	}

	let body: unknown;
	try {
		body = await res.json();
	} catch (err) {
		return { ok: false, message: `Embedding response was not JSON: ${describe(err)}` };
	}

	const vector = (body as { data?: Array<{ embedding?: unknown }> } | null)?.data?.[0]?.embedding;
	if (!Array.isArray(vector) || vector.length === 0 || typeof vector[0] !== 'number') {
		return { ok: false, message: 'Embedding response contained no vector' };
	}
	return { ok: true, vector: vector as number[] };
}

/* ------------------------------------------------------------------ */
/* Main entry point                                                    */
/* ------------------------------------------------------------------ */

/**
 * Search the active course's transcripts.
 *
 * @param query  Natural-language query. Untrusted student/model input — it is
 *               used ONLY as embedding input. It never reaches the URL, the
 *               collection name, or the filter.
 */
export async function searchCourseContent(
	query: string,
	env: Env,
	deps: SearchDeps = {},
): Promise<SearchOutcome> {
	const doFetch = deps.fetch ?? globalThis.fetch;

	const trimmed = query?.trim() ?? '';
	if (!trimmed) {
		return { status: 'error', message: 'Search query was empty.' };
	}

	const embedded = await embedQuery(trimmed, env, doFetch);
	if (!embedded.ok) {
		return { status: 'error', message: embedded.message };
	}

	// --- collection: env only, never user- or model-derived. See rail #1. ---
	const collection = env.QDRANT_COLLECTION;
	if (!collection) {
		return { status: 'error', message: 'QDRANT_COLLECTION is not configured.' };
	}
	const base = (env.QDRANT_URL ?? '').replace(/\/+$/, '');
	const url = `${base}/collections/${encodeURIComponent(collection)}/points/search`;

	const body = {
		vector: embedded.vector,
		limit: topK(env),
		with_payload: true,
		with_vector: false,
		filter: {
			// `must`. Not `should`. See rail #2 — this is the whole bead.
			must: [
				{
					key: 'metadata.course',
					match: { value: env.ACTIVE_COURSE },
				},
			],
		},
	};

	let res: Response;
	try {
		res = await doFetch(url, {
			method: 'POST',
			headers: {
				'api-key': env.QDRANT_API_KEY,
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
		});
	} catch (err) {
		return { status: 'error', message: `Qdrant request failed: ${describe(err)}` };
	}

	if (!res.ok) {
		return { status: 'error', message: `Qdrant search returned ${res.status}` };
	}

	let parsed: unknown;
	try {
		parsed = await res.json();
	} catch (err) {
		return { status: 'error', message: `Qdrant response was not JSON: ${describe(err)}` };
	}

	const hits = (parsed as { result?: unknown } | null)?.result;
	if (!Array.isArray(hits)) {
		// Malformed is a failure, not an absence of material.
		return { status: 'error', message: 'Qdrant response had no result array.' };
	}

	const chunks: CourseChunk[] = [];
	for (const hit of hits as QdrantHit[]) {
		const chunk = toChunk(hit);
		if (!chunk) continue;
		// Belt and braces on top of the server-side filter. If a point ever comes
		// back tagged for another semester, drop it rather than cite it: colliding
		// session numbers across semesters make wrong answers look plausible.
		if (chunk.course !== env.ACTIVE_COURSE) continue;
		chunks.push(chunk);
	}

	// Rail #3: a successful search that matched nothing is `empty`, not an error.
	if (chunks.length === 0) return { status: 'empty' };
	return { status: 'ok', chunks };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function topK(env: Env): number {
	const parsed = Number.parseInt(env.SEARCH_TOP_K ?? '', 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TOP_K;
}

/**
 * Some indexed `content` values carry raw C0 control characters left over from
 * transcription. They break downstream JSON tooling and render as mojibake in
 * Discord, so strip everything except tab/newline/CR and collapse the leftovers.
 * Deliberately non-destructive otherwise — the text is quoted back to students.
 */
export function sanitizeContent(raw: string): string {
	// eslint-disable-next-line no-control-regex
	return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

function toChunk(hit: QdrantHit): CourseChunk | null {
	const payload = hit.payload;
	if (!payload) return null;
	const content = typeof payload.content === 'string' ? sanitizeContent(payload.content) : '';
	if (!content) return null;

	const metadata = (payload.metadata ?? {}) as Record<string, unknown>;
	const fileName = typeof metadata.file_name === 'string' ? metadata.file_name : '';
	const course = typeof metadata.course === 'string' ? metadata.course : null;

	return {
		content,
		score: typeof hit.score === 'number' ? hit.score : 0,
		fileName,
		session: fileName ? parseSession(fileName) : null,
		recordedOn: fileName ? parseRecordedOn(fileName) : null,
		course,
		sourceUrl: sourceUrlFrom(metadata),
	};
}

/**
 * Recording link for the citation. `audio_file_url` first (present on every
 * transcript chunk — a Drive link to the class recording), then `youtube_url`,
 * which is the only link the `youtube_transcript` points carry.
 *
 * Citations carry session + recording date, never a timestamp: there is no time
 * offset anywhere in the payload. The nearest thing, `loc.lines.{from,to}`, is
 * transcript LINE NUMBERS — rendered next to a session it would read as a
 * timestamp and be wrong. Do not derive one from it.
 */
function sourceUrlFrom(metadata: Record<string, unknown>): string | null {
	for (const key of ['audio_file_url', 'youtube_url'] as const) {
		const value = metadata[key];
		if (typeof value === 'string' && value.trim()) return value.trim();
	}
	return null;
}

function describe(err: unknown): string {
	if (err instanceof Error) return err.message;
	return String(err);
}

/* ------------------------------------------------------------------ */
/* Tool metadata (optional convenience for the agent wiring)           */
/* ------------------------------------------------------------------ */

/**
 * The model-visible surface is exactly one string. Deliberately: no collection,
 * no course, no limit. Anything else here would be a way for a prompt injection
 * to steer the search off the course collection.
 */
export const SEARCH_TOOL_NAME = 'search_course_content';

export const SEARCH_TOOL_DESCRIPTION =
	'Search transcripts of this course’s recorded class sessions. Use for questions ' +
	'about what was covered, said, or demonstrated in class. Returns excerpts with the ' +
	'session number and recording date so you can cite them. Answer general questions ' +
	'from your own knowledge instead of calling this.';
