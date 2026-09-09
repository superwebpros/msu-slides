import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { listAssignments } from '../src/tools/assignments';
import type { Env } from '../src/types';

/** Only the fields listAssignments actually reads. */
const env = {
	BASEROW_BASEURL: 'https://baserow.example.test',
	BASEROW_RESOURCE_TOKEN: 'test-token-not-a-real-secret',
	BASEROW_DOCUMENTS_TABLE_ID: '1068',
} as unknown as Env;

interface Call {
	url: URL;
	headers: Record<string, string>;
}

let calls: Call[];

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

/** Installs a fetch mock and records every request for assertions. */
function mockFetch(handler: (url: URL) => Response | Promise<Response>): void {
	vi.stubGlobal(
		'fetch',
		vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
			const raw = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
			const url = new URL(raw);
			const headers = Object.fromEntries(new Headers(init?.headers).entries());
			calls.push({ url, headers });
			return handler(url);
		}),
	);
}

/** True when the request carries a server-side Active=true filter. */
function hasActiveFilter(url: URL): boolean {
	const advanced = url.searchParams.get('filters');
	if (advanced) {
		const parsed = JSON.parse(advanced) as {
			filters?: Array<{ field?: string; type?: string; value?: unknown }>;
		};
		return (parsed.filters ?? []).some(
			(f) => f.field === 'Active' && f.type === 'boolean' && String(f.value) === 'true',
		);
	}
	// The `filter__field_*__boolean=true` form is equally acceptable.
	for (const [key, value] of url.searchParams.entries()) {
		if (/^filter__.*__boolean$/.test(key) && String(value) === 'true') return true;
	}
	return false;
}

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('listAssignments — happy path', () => {
	it('maps the four known fields and passes unknown columns through to extra', async () => {
		mockFetch(() =>
			json({
				count: 2,
				next: null,
				results: [
					{
						id: 1,
						order: '1.00',
						Name: 'SSC490.1 - Prompting Like Peter',
						Notes: 'Read the prompt library first.',
						Active: true,
						'Document URL': 'https://example.test/a1',
						// Columns Jesse adds must arrive with no code change. Shapes here
						// mirror the live table: text, date, single-select object, array.
						Due: '2026-09-08T18:10:00Z',
						Session: '2',
						Deliverables: ['Prompt set', 'Reflection'],
						'Doc Type': { id: 3923, value: 'Lab', color: 'orange' },
					},
					{
						id: 2,
						order: '2.00',
						Name: 'SSC490.2 - Project - Career Coach in Claude',
						Notes: '',
						Active: true,
						'Document URL': '',
						// Unset single-selects and empty multi-selects are noise, not data.
						Submission: null,
						Deliverables: [],
					},
				],
			}),
		);

		const outcome = await listAssignments(env);

		expect(outcome.status).toBe('ok');
		if (outcome.status !== 'ok') return;

		expect(outcome.assignments).toHaveLength(2);

		const [first, second] = outcome.assignments;
		expect(first).toMatchObject({
			name: 'SSC490.1 - Prompting Like Peter',
			notes: 'Read the prompt library first.',
			documentUrl: 'https://example.test/a1',
		});
		// Unknown columns land in extra, with select cells collapsed to their value.
		expect(first?.extra).toEqual({
			Due: '2026-09-08T18:10:00Z',
			Session: '2',
			Deliverables: ['Prompt set', 'Reflection'],
			'Doc Type': 'Lab',
		});
		// Mapped and internal keys are not duplicated into extra.
		expect(Object.keys(first?.extra ?? {})).not.toContain('Name');
		expect(Object.keys(first?.extra ?? {})).not.toContain('id');

		// Empty Baserow cells normalise to null rather than '', and empty extras
		// are dropped instead of spending tokens on `null`.
		expect(second?.notes).toBeNull();
		expect(second?.documentUrl).toBeNull();
		expect(second?.extra).toEqual({});
	});

	it('sends user_field_names and enforces Active=true in the query, with a Token header', async () => {
		mockFetch(() => json({ count: 1, next: null, results: [{ id: 1, Name: 'A', Active: true }] }));

		await listAssignments(env);

		expect(calls).toHaveLength(1);
		const call = calls[0]!;
		expect(call.url.pathname).toBe('/api/database/rows/table/1068/');
		expect(call.url.searchParams.get('user_field_names')).toBe('true');
		expect(hasActiveFilter(call.url)).toBe(true);
		expect(call.headers['authorization']).toBe('Token test-token-not-a-real-secret');
	});

	it('never returns an inactive row, because inactive rows are never fetched', async () => {
		// The mock behaves like Baserow: it honours the filter it is sent. If the
		// implementation ever stopped filtering server-side, the draft would leak.
		mockFetch((url) => {
			const rows = [
				{ id: 1, Name: 'Published', Active: true },
				{ id: 2, Name: 'Secret draft', Active: false },
			];
			const results = hasActiveFilter(url) ? rows.filter((r) => r.Active) : rows;
			return json({ count: results.length, next: null, results });
		});

		const outcome = await listAssignments(env);

		expect(outcome.status).toBe('ok');
		if (outcome.status !== 'ok') return;
		expect(outcome.assignments.map((a) => a.name)).toEqual(['Published']);
		expect(JSON.stringify(outcome)).not.toContain('Secret draft');
	});
});

describe('listAssignments — select-cell normalization', () => {
	/** Runs one row through and hands back its `extra`. */
	async function extraFor(fields: Record<string, unknown>): Promise<Record<string, unknown>> {
		mockFetch(() =>
			json({
				count: 1,
				next: null,
				results: [{ id: 1, order: '1.00', Name: 'Row', Active: true, ...fields }],
			}),
		);
		const outcome = await listAssignments(env);
		if (outcome.status !== 'ok') throw new Error(`expected ok, got ${outcome.status}`);
		return outcome.assignments[0]!.extra;
	}

	it('collapses a single-select to its value string', async () => {
		const extra = await extraFor({
			'Doc Type': { id: 3923, value: 'Lab', color: 'orange' },
			Milestone: { id: 3934, value: 'M1', color: 'green' },
			Unit: { id: 3939, value: 'Foundations', color: 'blue' },
		});

		expect(extra).toEqual({ 'Doc Type': 'Lab', Milestone: 'M1', Unit: 'Foundations' });
		// The bookkeeping the model must never see in prose.
		const serialised = JSON.stringify(extra);
		expect(serialised).not.toContain('orange');
		expect(serialised).not.toContain('3923');
	});

	it('collapses a multi-select to an array of value strings', async () => {
		const extra = await extraFor({
			Tags: [
				{ id: 1, value: 'Lab', color: 'orange' },
				{ id: 2, value: 'Project', color: 'green' },
			],
		});

		expect(extra['Tags']).toEqual(['Lab', 'Project']);
	});

	it('drops an empty multi-select entirely', async () => {
		const extra = await extraFor({ Tags: [], Submission: null });

		expect(extra).toEqual({});
	});

	it('passes unrecognised object shapes through untouched', async () => {
		const linkRow = [{ id: 12, value: 'Session 3' }]; // link-to-table: no `color`
		const extra = await extraFor({
			// Right keys, wrong count.
			'Four Keys': { id: 1, value: 'Lab', color: 'orange', extra: true },
			// Right count, wrong keys.
			'Wrong Keys': { id: 1, value: 'Lab', shade: 'orange' },
			// Right keys, non-string value.
			'Numeric Value': { id: 1, value: 42, color: 'orange' },
			// Not every element is a select cell.
			Mixed: [{ id: 1, value: 'Lab', color: 'orange' }, 'plain'],
			Linked: linkRow,
			Nested: { a: { b: 1 } },
		});

		expect(extra['Four Keys']).toEqual({ id: 1, value: 'Lab', color: 'orange', extra: true });
		expect(extra['Wrong Keys']).toEqual({ id: 1, value: 'Lab', shade: 'orange' });
		expect(extra['Numeric Value']).toEqual({ id: 1, value: 42, color: 'orange' });
		expect(extra['Mixed']).toEqual([{ id: 1, value: 'Lab', color: 'orange' }, 'plain']);
		expect(extra['Linked']).toEqual(linkRow);
		expect(extra['Nested']).toEqual({ a: { b: 1 } });
	});

	it('leaves Due as a parseable ISO datetime string', async () => {
		// The highest-value field on the table: "what's due Friday" depends on the
		// agent layer parsing this itself against the injected Detroit date.
		const extra = await extraFor({ Due: '2026-09-22T03:59:00Z', Introduced: '2026-09-08' });

		expect(extra['Due']).toBe('2026-09-22T03:59:00Z');
		expect(Number.isNaN(Date.parse(extra['Due'] as string))).toBe(false);
		expect(extra['Introduced']).toBe('2026-09-08');
	});
});

describe('listAssignments — instructor-only fields', () => {
	it('strips underscore-prefixed fields everywhere, including extra', async () => {
		mockFetch(() =>
			json({
				count: 1,
				next: null,
				results: [
					{
						id: 7,
						Name: 'SSC490.1 - Prompting Like Peter',
						Notes: 'Student-facing notes.',
						Active: true,
						'Document URL': 'https://example.test/a1',
						_Rubric: 'Full marks for a working prompt chain.',
						'_Grading Notes': 'Curve by half a letter.',
						' _Sneaky': 'leading space should not smuggle it through',
					},
				],
			}),
		);

		const outcome = await listAssignments(env);

		expect(outcome.status).toBe('ok');
		if (outcome.status !== 'ok') return;

		const assignment = outcome.assignments[0]!;
		expect(Object.keys(assignment.extra)).toEqual([]);

		// The strongest form of the assertion: nothing underscore-prefixed
		// survives anywhere in the serialised outcome.
		const serialised = JSON.stringify(outcome);
		expect(serialised).not.toContain('_Rubric');
		expect(serialised).not.toContain('Full marks');
		expect(serialised).not.toContain('_Grading Notes');
		expect(serialised).not.toContain('Curve by half a letter');
		expect(serialised).not.toContain('_Sneaky');
	});
});

describe('listAssignments — the misconfiguration check', () => {
	it('reports misconfigured when the Active filter is empty but the table is not', async () => {
		mockFetch((url) =>
			hasActiveFilter(url)
				? json({ count: 0, next: null, results: [] })
				: json({ count: 431, next: null, results: [{ id: 1, Name: 'Row', Active: false }] }),
		);

		const outcome = await listAssignments(env);

		expect(outcome).toEqual({ status: 'misconfigured', totalRows: 431 });
		// It had to actually go look — a second, unfiltered request.
		expect(calls).toHaveLength(2);
		expect(hasActiveFilter(calls[0]!.url)).toBe(true);
		expect(hasActiveFilter(calls[1]!.url)).toBe(false);
	});

	it('reports empty only when the table is genuinely empty', async () => {
		mockFetch(() => json({ count: 0, next: null, results: [] }));

		const outcome = await listAssignments(env);

		expect(outcome).toEqual({ status: 'empty' });
		expect(calls).toHaveLength(2);
	});
});

describe('listAssignments — pagination', () => {
	it('follows the next chain across two pages', async () => {
		mockFetch((url) => {
			const page = url.searchParams.get('page');
			if (page === '1') {
				return json({
					count: 3,
					next: `${env.BASEROW_BASEURL}/api/database/rows/table/1068/?page=2`,
					results: [
						{ id: 1, Name: 'One', Active: true },
						{ id: 2, Name: 'Two', Active: true },
					],
				});
			}
			return json({
				count: 3,
				next: null,
				results: [{ id: 3, Name: 'Three', Active: true }],
			});
		});

		const outcome = await listAssignments(env);

		expect(outcome.status).toBe('ok');
		if (outcome.status !== 'ok') return;
		expect(outcome.assignments.map((a) => a.name)).toEqual(['One', 'Two', 'Three']);
		expect(calls).toHaveLength(2);
		// Every page keeps the Active filter — page 2 is not a back door.
		expect(calls.every((c) => hasActiveFilter(c.url))).toBe(true);
	});
});

describe('listAssignments — failures', () => {
	it('returns a student-safe error on HTTP 500', async () => {
		mockFetch(() => new Response('Internal Server Error', { status: 500 }));

		const outcome = await listAssignments(env);

		expect(outcome.status).toBe('error');
		if (outcome.status !== 'error') return;
		expect(outcome.message.length).toBeGreaterThan(0);
		expect(outcome.message).not.toMatch(/\bat\s+\w+.*:\d+:\d+/); // no stack frames
		expect(outcome.message).not.toMatch(/Error:|500|baserow|http/i);
	});

	it('returns a student-safe error when the network throws', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => {
				throw new TypeError('Network connection lost. at fetchPage (assignments.ts:1:1)');
			}),
		);

		const outcome = await listAssignments(env);

		expect(outcome.status).toBe('error');
		if (outcome.status !== 'error') return;
		expect(outcome.message).not.toContain('assignments.ts');
		expect(outcome.message).not.toContain('Network connection lost');
	});

	it('returns an error rather than "empty" when the misconfiguration check itself fails', async () => {
		mockFetch((url) =>
			hasActiveFilter(url) ? json({ count: 0, next: null, results: [] }) : new Response('nope', { status: 503 }),
		);

		const outcome = await listAssignments(env);

		expect(outcome.status).toBe('error');
	});
});
