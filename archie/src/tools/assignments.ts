/**
 * list_assignments — Baserow table 1068, read-only.
 *
 * Three rules that are load-bearing (see the design spec, `list_assignments`):
 *
 *  1. `Active = true` is enforced **in the query**, not in the prompt and not by
 *     post-filtering rows already fetched. A draft assignment is never in memory
 *     next to a published one, so no phrasing can shake it loose.
 *  2. Any field whose name begins with `_` is instructor-only (`_Rubric`,
 *     `_Grading Notes`) and is dropped before the row becomes an `Assignment` —
 *     including from the generic `extra` passthrough, which would otherwise be
 *     the leak that defeats the convention.
 *  3. Zero active rows on a non-empty table is a **misconfiguration**, not an
 *     empty list. `Active` is false on all 431 rows across four other tables in
 *     this same Baserow instance (bead msu-slides-11n.1). If 1068 rots the same
 *     way, the naive read tells students they have nothing due.
 *
 * Everything else is passed through generically, so columns Jesse adds later
 * (`Due Date`, `Start Date`, `Deliverables`) reach the model with no code change.
 */

import type { Assignment, AssignmentsOutcome, Env } from '../types';

/** Baserow's page ceiling for `size`. */
const PAGE_SIZE = 200;

/** Guard against an unterminated `next` chain; 20 * 200 = 4000 rows. */
const MAX_PAGES = 20;

/** Baserow bookkeeping keys that are not assignment content. */
const INTERNAL_KEYS = new Set(['id', 'order']);

/** Row fields mapped onto typed properties, so they are not repeated in `extra`. */
const MAPPED_FIELDS = new Set(['Name', 'Notes', 'Document URL', 'Active']);

/** Shown to students verbatim. No URLs, no status codes, no stack traces. */
const ERROR_MESSAGE =
	"I couldn't reach the assignment list just now. Check the course site or Discord " +
	'for the current assignments, and try me again in a few minutes.';

interface BaserowListResponse {
	count?: number;
	next?: string | null;
	results?: unknown;
}

/**
 * Instructor-only convention: a leading underscore hides the field from Archie.
 * Trimmed first so a stray leading space in a Baserow column name cannot
 * smuggle `_Rubric` through as ` _Rubric`.
 */
function isInstructorOnly(fieldName: string): boolean {
	return fieldName.trimStart().startsWith('_');
}

function asText(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

/**
 * Baserow renders empty cells as `''` / `null` / `[]`. Those carry no
 * information and would just cost the model tokens, so they stay out of `extra`.
 */
function isEmptyValue(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string') return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	return false;
}

/**
 * A Baserow single-select cell: exactly `{ id, value, color }` with a string
 * `value`. The key set must match exactly — anything else is a shape this code
 * has not seen, and a wrong guess is worse than passing the raw object through.
 */
function isSelectCell(value: unknown): value is { id: unknown; value: string; color: unknown } {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
	const keys = Object.keys(value);
	if (keys.length !== 3) return false;
	if (!keys.includes('id') || !keys.includes('value') || !keys.includes('color')) return false;
	return typeof (value as { value: unknown }).value === 'string';
}

/**
 * Collapse select cells to the only part a language model should see.
 *
 * `{"id":3923,"value":"Lab","color":"orange"}` becomes `"Lab"`; a multi-select
 * array of those becomes `["Lab","Project"]`. The id and colour are Baserow
 * bookkeeping — they cost tokens and invite the model to mention a colour or a
 * row id in prose to a student. Everything else is returned untouched, so
 * `Due` ("2026-09-22T03:59:00Z") stays the parseable ISO string the agent layer
 * compares against the injected America/Detroit date.
 */
function normalizeCell(value: unknown): unknown {
	if (isSelectCell(value)) return value.value;
	if (Array.isArray(value) && value.length > 0 && value.every(isSelectCell)) {
		return value.map((entry) => entry.value);
	}
	return value;
}

function toAssignment(row: Record<string, unknown>): Assignment {
	const extra: Record<string, unknown> = {};

	for (const [key, rawValue] of Object.entries(row)) {
		if (isInstructorOnly(key)) continue; // rule 2 — must also cover the passthrough
		if (INTERNAL_KEYS.has(key)) continue;
		if (MAPPED_FIELDS.has(key)) continue;
		const value = normalizeCell(rawValue);
		if (isEmptyValue(value)) continue; // also catches an empty multi-select
		extra[key] = value;
	}

	return {
		name: asText(row['Name']) ?? '(untitled assignment)',
		notes: asText(row['Notes']),
		documentUrl: asText(row['Document URL']),
		extra,
	};
}

function baseUrl(env: Env): string {
	return env.BASEROW_BASEURL.replace(/\/+$/, '');
}

function listUrl(env: Env, page: number, activeOnly: boolean, size = PAGE_SIZE): string {
	const url = new URL(`${baseUrl(env)}/api/database/rows/table/${env.BASEROW_DOCUMENTS_TABLE_ID}/`);
	url.searchParams.set('user_field_names', 'true');
	url.searchParams.set('size', String(size));
	url.searchParams.set('page', String(page));

	if (activeOnly) {
		// Rule 1. Server-side filter — with user_field_names=true, `field` in the
		// advanced `filters` payload is the column name rather than its numeric id.
		url.searchParams.set(
			'filters',
			JSON.stringify({
				filter_type: 'AND',
				filters: [{ field: 'Active', type: 'boolean', value: 'true' }],
				groups: [],
			}),
		);
	}

	return url.toString();
}

async function fetchPage(env: Env, url: string): Promise<BaserowListResponse> {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			// Never logged. The value is a secret; only ever a header.
			Authorization: `Token ${env.BASEROW_RESOURCE_TOKEN}`,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(`Baserow responded ${response.status}`);
	}

	return (await response.json()) as BaserowListResponse;
}

function rowsOf(payload: BaserowListResponse): Array<Record<string, unknown>> {
	if (!Array.isArray(payload.results)) return [];
	return payload.results.filter(
		(row): row is Record<string, unknown> => typeof row === 'object' && row !== null && !Array.isArray(row),
	);
}

/** Total rows in the table with no filter applied. One row fetched, count read. */
async function countAllRows(env: Env): Promise<number> {
	const payload = await fetchPage(env, listUrl(env, 1, false, 1));
	if (typeof payload.count === 'number') return payload.count;
	return rowsOf(payload).length;
}

/**
 * Active assignments from Baserow, safe to hand to the model.
 *
 * Never throws — every failure path is an `AssignmentsOutcome`.
 */
export async function listAssignments(env: Env): Promise<AssignmentsOutcome> {
	try {
		const rows: Array<Record<string, unknown>> = [];

		for (let page = 1; page <= MAX_PAGES; page++) {
			const payload = await fetchPage(env, listUrl(env, page, true));
			const pageRows = rowsOf(payload);
			rows.push(...pageRows);

			// Baserow signals the end of the chain with next: null. Fall back to an
			// empty/short page so a proxy that strips `next` cannot loop forever.
			if (!payload.next || pageRows.length === 0) break;
		}

		if (rows.length === 0) {
			// Rule 3. Distinguish "nothing is due" from "Active rotted to false".
			const totalRows = await countAllRows(env);
			if (totalRows > 0) {
				return { status: 'misconfigured', totalRows };
			}
			return { status: 'empty' };
		}

		return { status: 'ok', assignments: rows.map(toAssignment) };
	} catch {
		// Deliberately swallows the cause: students see a plain sentence, and the
		// Worker's observability captures the real failure.
		return { status: 'error', message: ERROR_MESSAGE };
	}
}
