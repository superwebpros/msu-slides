/**
 * Unit tests for search_course_content.
 *
 * No live services: `fetch` is injected as a mock. The two calls the module
 * makes, in order, are (1) OpenAI embeddings, (2) Qdrant /points/search.
 *
 * The load-bearing tests here are the two safety ones:
 *   - the outbound filter uses `must`, never `should`  (the n8n regression)
 *   - the collection in the URL is always env.QDRANT_COLLECTION, whatever the
 *     query says
 * If either starts failing, do not "fix the test".
 */

import { describe, expect, it } from 'vitest';
import type { Env } from '../src/types';
import {
	aiGatewayHeaders,
	parseRecordedOn,
	parseSession,
	sanitizeContent,
	searchCourseContent,
} from '../src/tools/search';

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const ENV: Env = {
	DISCORD_BOT_TOKEN: 'x',
	DISCORD_PUBLIC_KEY: 'x',
	DISCORD_APPLICATION_ID: 'x',
	ANTHROPIC_API_KEY: 'x',
	OPENAI_API_KEY: 'test-openai-key',
	QDRANT_URL: 'https://qdrant.example.com',
	QDRANT_API_KEY: 'test-qdrant-key',
	BASEROW_BASEURL: 'https://baserow.example.com',
	BASEROW_RESOURCE_TOKEN: 'x',
	ARCHIE_USER_SALT: 'x',
	ACTIVE_COURSE: 'ssc-490',
	QDRANT_COLLECTION: 'course_content',
	EMBEDDING_MODEL: 'text-embedding-3-small',
	ANSWER_MODEL: 'gpt-5.5',
	BASEROW_DOCUMENTS_TABLE_ID: '1068',
	COURSE_TIMEZONE: 'America/Detroit',
	SEARCH_TOP_K: '10',
	COURSE_AGENT: {} as unknown as DurableObjectNamespace,
};

/** The same env with an authenticated AI Gateway in front of OpenAI. */
const GATEWAY_ENV: Env = {
	...ENV,
	AI_GATEWAY_BASE_URL: 'https://gateway.ai.cloudflare.com/v1/acct/gw',
	CF_AIG_TOKEN: 'test-cf-aig-token',
};

const VECTOR = Array.from({ length: 1536 }, () => 0.01);

function embeddingResponse(): Response {
	return new Response(JSON.stringify({ data: [{ embedding: VECTOR }] }), {
		status: 200,
		headers: { 'content-type': 'application/json' },
	});
}

interface HitInput {
	content?: string;
	score?: number;
	file_name?: string;
	course?: string | null;
	/** Pass null to omit the key entirely (the youtube_transcript points have none). */
	audio_file_url?: string | null;
	youtube_url?: string;
}

function hit(h: HitInput) {
	const metadata: Record<string, unknown> = {
		file_name: h.file_name ?? '2026-09-08_session-3_intro-to-skills.mp4',
		create_date: '2026-09-08',
		source: 'zoom',
		type: 'transcript',
		transcript_id: 'abc',
	};
	if (h.audio_file_url !== null) {
		metadata.audio_file_url = h.audio_file_url ?? 'https://example.com/a.mp3';
	}
	if (h.youtube_url !== undefined) metadata.youtube_url = h.youtube_url;
	if (h.course !== null) metadata.course = h.course ?? 'ssc-490';
	return {
		id: 'point-1',
		score: h.score ?? 0.87,
		payload: { content: h.content ?? 'We opened session three on skills.', metadata },
	};
}

function qdrantResponse(result: unknown[]): Response {
	return new Response(JSON.stringify({ result }), {
		status: 200,
		headers: { 'content-type': 'application/json' },
	});
}

interface Call {
	url: string;
	init: RequestInit;
	body: any;
}

/**
 * Mock fetch that records every outbound call and replies with the queued
 * responses in order.
 */
function mockFetch(responses: Array<Response | (() => Response | Promise<Response>) | Error>) {
	const calls: Call[] = [];
	let i = 0;
	const fn = (async (input: any, init?: RequestInit) => {
		const url = typeof input === 'string' ? input : String(input?.url ?? input);
		let body: any;
		try {
			body = init?.body ? JSON.parse(init.body as string) : undefined;
		} catch {
			body = undefined;
		}
		calls.push({ url, init: init ?? {}, body });
		const next = responses[i++];
		if (next === undefined) throw new Error(`unexpected fetch #${i} to ${url}`);
		if (next instanceof Error) throw next;
		if (typeof next === 'function') return await next();
		return next;
	}) as unknown as typeof fetch;
	return { fetch: fn, calls };
}

/** Convenience: embeddings OK, then whatever Qdrant should do. */
function withQdrant(second: Response | Error) {
	return mockFetch([embeddingResponse(), second]);
}

/* ------------------------------------------------------------------ */
/* Happy path                                                          */
/* ------------------------------------------------------------------ */

describe('searchCourseContent — happy path', () => {
	it('maps a Qdrant payload to a CourseChunk, score included', async () => {
		const { fetch, calls } = withQdrant(
			qdrantResponse([
				hit({
					content: 'Skills let Claude load instructions on demand.',
					score: 0.9134,
					file_name: '2026-09-08_session-3_intro-to-skills.mp4',
					course: 'ssc-490',
				}),
			]),
		);

		const out = await searchCourseContent('what did we cover about skills?', ENV, { fetch });

		expect(out.status).toBe('ok');
		if (out.status !== 'ok') return;
		expect(out.chunks).toHaveLength(1);
		expect(out.chunks[0]).toEqual({
			content: 'Skills let Claude load instructions on demand.',
			score: 0.9134,
			fileName: '2026-09-08_session-3_intro-to-skills.mp4',
			session: 3,
			recordedOn: '2026-09-08',
			course: 'ssc-490',
			sourceUrl: 'https://example.com/a.mp3',
		});
		expect(calls).toHaveLength(2);
	});

	it('embeds with env.EMBEDDING_MODEL and sends top_k / payload flags to Qdrant', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('anything', { ...ENV, SEARCH_TOP_K: '7' }, { fetch });

		const embed = calls[0]!;
		expect(embed.url).toBe('https://api.openai.com/v1/embeddings');
		expect(embed.body.model).toBe('text-embedding-3-small');
		expect(embed.body.input).toBe('anything');

		const search = calls[1]!;
		expect(search.body.limit).toBe(7);
		expect(search.body.with_payload).toBe(true);
		expect(search.body.with_vector).toBe(false);
		expect(search.body.vector).toHaveLength(1536);
		expect((search.init.headers as Record<string, string>)['api-key']).toBe('test-qdrant-key');
	});

	it('routes embeddings through AI Gateway when configured', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', GATEWAY_ENV, { fetch });
		expect(calls[0]!.url).toBe('https://gateway.ai.cloudflare.com/v1/acct/gw/openai/embeddings');
	});

	it('falls back to top_k 10 when SEARCH_TOP_K is unparseable', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', { ...ENV, SEARCH_TOP_K: 'not-a-number' }, { fetch });
		expect(calls[1]!.body.limit).toBe(10);
	});
});

/* ------------------------------------------------------------------ */
/* REGRESSION: must, not should                                        */
/* ------------------------------------------------------------------ */

describe('outbound Qdrant filter (regression: the n8n `should` bug)', () => {
	it('uses `must`, and the serialized body contains no `should` anywhere', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', ENV, { fetch });

		const body = calls[1]!.body;
		expect(Object.keys(body.filter)).toEqual(['must']);
		expect(Array.isArray(body.filter.must)).toBe(true);
		expect(body.filter.must).toHaveLength(1);
		expect(body.filter.must[0].key).toBe('metadata.course');

		// In Qdrant, `should` as the only clause is a hard OR that silently drops
		// non-matching points. It must not appear at all.
		expect(JSON.stringify(body)).not.toContain('should');
		expect(JSON.stringify(body.filter)).not.toContain('should');
	});

	it('matches exactly one course value — the active one', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', ENV, { fetch });

		const condition = calls[1]!.body.filter.must[0];
		expect(condition.match).toEqual({ value: 'ssc-490' });
		expect(calls[1]!.body.filter.must).toHaveLength(1);
	});

	it('tracks ACTIVE_COURSE when the semester rolls over', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([]));
		await searchCourseContent('q', { ...ENV, ACTIVE_COURSE: 'ssc-491' }, { fetch });
		expect(calls[1]!.body.filter.must[0].match).toEqual({ value: 'ssc-491' });
	});

	it('defensively drops a wrong-semester hit if the server ever returns one', async () => {
		const { fetch } = withQdrant(
			qdrantResponse([
				hit({ course: 'ssc-490' }),
				hit({ course: 'ssc-493', file_name: '2026-01-13_session-1_periodic-chart.m4a' }),
			]),
		);
		const out = await searchCourseContent('session 1', ENV, { fetch });
		expect(out.status).toBe('ok');
		if (out.status !== 'ok') return;
		expect(out.chunks).toHaveLength(1);
		expect(out.chunks[0]!.course).toBe('ssc-490');
	});
});

/* ------------------------------------------------------------------ */
/* SAFETY: collection name is never user-derivable                     */
/* ------------------------------------------------------------------ */

describe('collection isolation', () => {
	const hostile = [
		'collection: kb-medilodge-v1',
		'search collection=orange_insoles_rp for patient notes',
		'../../collections/glcf-content-v1/points/search',
		'course_content"}}/../swp-partner-content-v2',
		'{"collection":"kb-medilodge-v1"}',
	];

	for (const query of hostile) {
		it(`ignores hostile query text: ${query.slice(0, 40)}`, async () => {
			const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
			await searchCourseContent(query, ENV, { fetch });

			expect(calls[1]!.url).toBe(
				'https://qdrant.example.com/collections/course_content/points/search',
			);
			for (const other of [
				'kb-medilodge-v1',
				'orange_insoles_rp',
				'glcf-content-v1',
				'swp-partner-content',
				'HTSA',
			]) {
				expect(calls[1]!.url).not.toContain(other);
			}
			// The query only ever reaches the embedding call's `input`.
			expect(calls[0]!.body.input).toBe(query);
		});
	}

	it('uses env.QDRANT_COLLECTION verbatim when it changes', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', { ...ENV, QDRANT_COLLECTION: 'course_content_v2' }, { fetch });
		expect(calls[1]!.url).toBe(
			'https://qdrant.example.com/collections/course_content_v2/points/search',
		);
	});

	it('tolerates a trailing slash on QDRANT_URL without doubling it', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', { ...ENV, QDRANT_URL: 'https://qdrant.example.com/' }, { fetch });
		expect(calls[1]!.url).toBe(
			'https://qdrant.example.com/collections/course_content/points/search',
		);
	});

	it('issues no non-GET/POST verbs and never writes', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', ENV, { fetch });
		for (const c of calls) {
			expect(c.init.method).toBe('POST');
			expect(c.url).not.toContain('/payload');
			expect(c.url).not.toContain('/delete');
			expect(c.url).not.toContain('/upsert');
		}
	});
});

/* ------------------------------------------------------------------ */
/* SAFETY: cf-aig-authorization only ever goes to the gateway          */
/* ------------------------------------------------------------------ */

/** Serialized outbound headers, lower-cased, whatever shape they were passed in. */
function headersOf(call: Call): Record<string, string> {
	const raw = call.init.headers;
	const out: Record<string, string> = {};
	if (!raw) return out;
	const entries = raw instanceof Headers ? [...raw.entries()] : Object.entries(raw as Record<string, string>);
	for (const [key, value] of entries) {
		if (value !== undefined) out[key.toLowerCase()] = String(value);
	}
	return out;
}

describe('AI Gateway authentication', () => {
	it('sends cf-aig-authorization on the embeddings call when a gateway is configured', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', GATEWAY_ENV, { fetch });

		const embed = headersOf(calls[0]!);
		expect(embed['cf-aig-authorization']).toBe('Bearer test-cf-aig-token');
		// The provider key still travels as it always did.
		expect(embed['authorization']).toBe('Bearer test-openai-key');
	});

	/**
	 * Qdrant is not behind the gateway. A Cloudflare API token on that request
	 * would be a credential handed to an unrelated third party.
	 */
	it('never sends the Cloudflare token to Qdrant', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		await searchCourseContent('q', GATEWAY_ENV, { fetch });

		const qdrant = headersOf(calls[1]!);
		expect(qdrant['cf-aig-authorization']).toBeUndefined();
		expect(JSON.stringify(calls[1]!.init.headers)).not.toContain('test-cf-aig-token');
	});

	/**
	 * The rail. Without a gateway the embeddings call goes straight to
	 * api.openai.com, and a Cloudflare account token must not ride along.
	 */
	it('omits the header entirely when AI_GATEWAY_BASE_URL is unset, even with a token present', async () => {
		const { fetch, calls } = withQdrant(qdrantResponse([hit({})]));
		// Token present, gateway absent: the token must still not go out.
		await searchCourseContent('q', { ...ENV, CF_AIG_TOKEN: 'test-cf-aig-token' }, { fetch });

		expect(calls[0]!.url).toBe('https://api.openai.com/v1/embeddings');
		for (const call of calls) {
			const headers = headersOf(call);
			expect(Object.keys(headers)).not.toContain('cf-aig-authorization');
			expect(JSON.stringify(call.init.headers)).not.toContain('test-cf-aig-token');
		}
	});

	it('returns {} rather than a header when no gateway is configured', () => {
		expect(aiGatewayHeaders(ENV)).toEqual({});
		expect(aiGatewayHeaders({ ...ENV, CF_AIG_TOKEN: 'test-cf-aig-token' })).toEqual({});
		expect(aiGatewayHeaders({ ...ENV, AI_GATEWAY_BASE_URL: '   ' })).toEqual({});
	});

	/**
	 * A gateway with Authentication enabled answers an unauthenticated request
	 * with a 401 that is indistinguishable from a provider outage. Fail here, with
	 * the fix in the message, instead.
	 */
	it('fails loudly, before any network call, when the gateway is set but the token is missing', async () => {
		const { fetch, calls } = mockFetch([]);
		const out = await searchCourseContent('q', { ...GATEWAY_ENV, CF_AIG_TOKEN: undefined }, { fetch });

		expect(calls).toHaveLength(0);
		expect(out.status).toBe('error');
		if (out.status !== 'error') return;
		expect(out.message).toContain('CF_AIG_TOKEN');
		expect(out.message).toMatch(/AI_GATEWAY_BASE_URL is set/i);
	});

	it('throws with a message that names the fix and carries no secret value', () => {
		expect(() => aiGatewayHeaders({ ...GATEWAY_ENV, CF_AIG_TOKEN: '  ' })).toThrow(/CF_AIG_TOKEN/);

		let message = '';
		try {
			aiGatewayHeaders({ ...GATEWAY_ENV, CF_AIG_TOKEN: undefined });
		} catch (err) {
			message = err instanceof Error ? err.message : String(err);
		}
		expect(message).not.toContain(ENV.OPENAI_API_KEY);
		expect(message).not.toContain(ENV.QDRANT_API_KEY);
	});
});

/* ------------------------------------------------------------------ */
/* Filename parsing                                                    */
/* ------------------------------------------------------------------ */

describe('filename parsing', () => {
	it('parses session and date from a well-formed name', () => {
		const f = '2026-09-08_session-3_intro-to-skills.mp4';
		expect(parseSession(f)).toBe(3);
		expect(parseRecordedOn(f)).toBe('2026-09-08');
	});

	it('parses zero-padded session numbers', () => {
		expect(parseSession('2026-09-08_session-03_intro.mp4')).toBe(3);
		expect(parseSession('2026-10-20_session-12_apis.m4a')).toBe(12);
	});

	it('returns null session when the name has no session number', () => {
		const f = '2026-09-08_guest-lecture-on-agents.mp4';
		expect(parseSession(f)).toBeNull();
		expect(parseRecordedOn(f)).toBe('2026-09-08');
	});

	it('returns null date when there is no date prefix', () => {
		const f = 'session-3_intro-to-skills.mp4';
		expect(parseRecordedOn(f)).toBeNull();
		expect(parseSession(f)).toBe(3);
	});

	it('returns null for both when the name has neither', () => {
		const f = 'ai-periodic-table-explained.txt';
		expect(parseSession(f)).toBeNull();
		expect(parseRecordedOn(f)).toBeNull();
	});

	it('does not treat a mid-name date as the recording date', () => {
		expect(parseRecordedOn('recap-of-2026-09-08_session-3.mp4')).toBeNull();
	});

	it('rejects impossible dates rather than guessing', () => {
		expect(parseRecordedOn('2026-13-45_session-1.mp4')).toBeNull();
		expect(parseRecordedOn('2026-02-31_session-1.mp4')).toBeNull();
	});

	it('does not mistake other digits for a session number', () => {
		expect(parseSession('2026-09-08_sessions-recap.mp4')).toBeNull();
		expect(parseSession('2026-09-08_top-10-prompts.mp4')).toBeNull();
	});

	it('surfaces both nulls through a real search result', async () => {
		const { fetch } = withQdrant(
			qdrantResponse([
				hit({ file_name: 'ai-periodic-table-explained.txt' }),
				hit({ file_name: 'session-3_intro-to-skills.mp4' }),
				hit({ file_name: '2026-09-08_guest-lecture.mp4' }),
			]),
		);
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('ok');
		if (out.status !== 'ok') return;
		expect(out.chunks.map((c) => [c.session, c.recordedOn])).toEqual([
			[null, null],
			[3, null],
			[null, '2026-09-08'],
		]);
	});
});

/* ------------------------------------------------------------------ */
/* sourceUrl — the citation link                                       */
/* ------------------------------------------------------------------ */

describe('sourceUrl', () => {
	async function chunksFor(h: HitInput) {
		const { fetch } = withQdrant(qdrantResponse([hit(h)]));
		const out = await searchCourseContent('q', ENV, { fetch });
		if (out.status !== 'ok') throw new Error(`expected ok, got ${out.status}`);
		return out.chunks;
	}

	it('uses audio_file_url when present', async () => {
		const [c] = await chunksFor({
			audio_file_url: 'https://drive.google.com/file/d/abc123/view',
		});
		expect(c!.sourceUrl).toBe('https://drive.google.com/file/d/abc123/view');
	});

	it('falls back to youtube_url when there is no audio_file_url', async () => {
		const [c] = await chunksFor({
			audio_file_url: null,
			youtube_url: 'https://www.youtube.com/watch?v=abc123',
			file_name: 'AI Periodic Table Explained',
		});
		expect(c!.sourceUrl).toBe('https://www.youtube.com/watch?v=abc123');
	});

	it('prefers audio_file_url when both are present', async () => {
		const [c] = await chunksFor({
			audio_file_url: 'https://drive.google.com/file/d/abc123/view',
			youtube_url: 'https://www.youtube.com/watch?v=abc123',
		});
		expect(c!.sourceUrl).toBe('https://drive.google.com/file/d/abc123/view');
	});

	it('is null when neither url is present', async () => {
		const [c] = await chunksFor({ audio_file_url: null });
		expect(c!.sourceUrl).toBeNull();
	});

	it('treats a blank or non-string url as absent rather than emitting an empty link', async () => {
		expect((await chunksFor({ audio_file_url: '   ' }))[0]!.sourceUrl).toBeNull();
		const [c] = await chunksFor({ audio_file_url: '  https://example.com/a.mp3  ' });
		expect(c!.sourceUrl).toBe('https://example.com/a.mp3');
	});

	it('carries no timestamp field — loc.lines are line numbers, not time offsets', async () => {
		const { fetch } = withQdrant(
			qdrantResponse([
				{
					id: 'p1',
					score: 0.5,
					payload: {
						content: 'text',
						metadata: {
							file_name: '2026-09-08_session-3_intro-to-skills.mp4',
							course: 'ssc-490',
							audio_file_url: 'https://example.com/a.mp3',
							loc: { lines: { from: 83, to: 83 } },
						},
					},
				},
			]),
		);
		const out = await searchCourseContent('q', ENV, { fetch });
		if (out.status !== 'ok') throw new Error('expected ok');
		const chunk = out.chunks[0]!;
		expect(Object.keys(chunk).sort()).toEqual([
			'content',
			'course',
			'fileName',
			'recordedOn',
			'score',
			'session',
			'sourceUrl',
		]);
		// A line number rendered beside a session reads as a timestamp and is wrong.
		expect(JSON.stringify(chunk)).not.toContain('83');
	});
});

/* ------------------------------------------------------------------ */
/* Content hygiene                                                     */
/* ------------------------------------------------------------------ */

describe('content hygiene', () => {
	it('strips C0 control characters but preserves tabs and newlines', () => {
		const raw = 'line one\nline\ttwo\u0000\u0007 end\u001F';
		expect(sanitizeContent(raw)).toBe('line one\nline\ttwo end');
	});

	it('drops a hit whose content is only control characters', async () => {
		const { fetch } = withQdrant(
			qdrantResponse([hit({ content: '\u0000\u0001\u0002' }), hit({ content: 'real text' })]),
		);
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('ok');
		if (out.status !== 'ok') return;
		expect(out.chunks).toHaveLength(1);
		expect(out.chunks[0]!.content).toBe('real text');
	});
});

/* ------------------------------------------------------------------ */
/* Empty vs error                                                      */
/* ------------------------------------------------------------------ */

describe('empty is not an error', () => {
	it('returns empty for zero hits', async () => {
		const { fetch } = withQdrant(qdrantResponse([]));
		expect(await searchCourseContent('q', ENV, { fetch })).toEqual({ status: 'empty' });
	});

	it('returns empty when every hit is filtered out defensively', async () => {
		const { fetch } = withQdrant(qdrantResponse([hit({ course: 'ssc-493' })]));
		expect(await searchCourseContent('q', ENV, { fetch })).toEqual({ status: 'empty' });
	});
});

describe('errors are errors', () => {
	it('embedding HTTP failure → error', async () => {
		const { fetch } = mockFetch([new Response('nope', { status: 401 })]);
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('error');
	});

	it('embedding network throw → error, and Qdrant is never called', async () => {
		const { fetch, calls } = mockFetch([new Error('ECONNRESET')]);
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('error');
		expect(calls).toHaveLength(1);
	});

	it('embedding response with no vector → error', async () => {
		const { fetch } = mockFetch([
			new Response(JSON.stringify({ data: [] }), { status: 200 }),
		]);
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('error');
	});

	it('Qdrant 500 → error', async () => {
		const { fetch } = withQdrant(new Response('boom', { status: 500 }));
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('error');
		if (out.status !== 'error') return;
		expect(out.message).toContain('500');
	});

	it('Qdrant network throw → error', async () => {
		const { fetch } = withQdrant(new Error('tunnel closed'));
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('error');
	});

	it('Qdrant malformed body → error, not empty', async () => {
		const { fetch } = withQdrant(
			new Response(JSON.stringify({ status: 'ok' }), { status: 200 }),
		);
		const out = await searchCourseContent('q', ENV, { fetch });
		expect(out.status).toBe('error');
	});

	it('blank query → error without any network call', async () => {
		const { fetch, calls } = mockFetch([]);
		const out = await searchCourseContent('   ', ENV, { fetch });
		expect(out.status).toBe('error');
		expect(calls).toHaveLength(0);
	});

	it('never leaks an API key into an error message', async () => {
		const { fetch } = withQdrant(new Response('boom', { status: 500 }));
		const out = await searchCourseContent('q', ENV, { fetch });
		if (out.status !== 'error') throw new Error('expected error');
		expect(out.message).not.toContain(ENV.QDRANT_API_KEY);
		expect(out.message).not.toContain(ENV.OPENAI_API_KEY);
	});
});
