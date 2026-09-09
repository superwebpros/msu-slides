#!/usr/bin/env node
/**
 * tag-semester.ts — tag every point in the `course_content` Qdrant collection
 * with `metadata.course` so a downstream bot can filter retrieval by semester.
 *
 * Two rules, in precedence order:
 *
 *   1. OVERRIDES — an explicit `file_name` -> course map, for documents whose
 *      filename cannot classify them. Always wins.
 *   2. Date prefix on `metadata.file_name`, for year 2026:
 *        months 01-04 -> "ssc-493"  (Spring 2026 pilot, frozen)
 *        months 09-12 -> "ssc-490"  (Fall 2026, active)
 *
 * Documents are tagged by PROVENANCE — the offering that ingested them. A
 * document is scoped to exactly one course; there is no cross-semester value.
 * Material assigned again in a later semester is still tagged to the semester
 * that ingested it, and is excluded from the later course's retrieval by the
 * normal filter. That is intended, not a gap.
 *
 * Anything matching neither rule is deliberately LEFT UNTAGGED. Guessing is
 * worse than omitting: a wrong semester is invisible corruption in a filtered
 * retrieval path. Add such files to OVERRIDES once a human has identified them.
 *
 * Safety:
 *   - The target collection is hard-coded. The script refuses to issue a
 *     request at any other collection; the shared API key can reach live
 *     client data.
 *   - Writes use `set_payload` (additive) only. Never `overwrite_payload`,
 *     never any delete.
 *   - Idempotent: only points missing the desired course are written, so
 *     re-running after new recordings are indexed touches only the new ones.
 *
 * Usage:
 *   node archie/scripts/tag-semester.ts            # dry run (default)
 *   node archie/scripts/tag-semester.ts --apply    # write payloads + index
 *
 * Credentials: QDRANT_URL and QDRANT_API_KEY, from the environment if present,
 * otherwise from ~/.credentials/msu.env. Never logged.
 */

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// Hard safety rail. Do not parameterize this.
// ---------------------------------------------------------------------------
const COLLECTION = 'course_content' as const;

/**
 * Explicit per-document course assignments. Takes precedence over the date
 * rule. Each entry should record why, so the next person does not have to
 * re-derive it.
 */
const OVERRIDES: Record<string, string> = {
  // create_date 2026-02-17. Content is Workflow 3 / Qdrant groups endpoint;
  // matches the ssc-493 session-11 deck and the pilot vault. The filename
  // contains "2026-02-17" but not as a prefix ("video17..."), so the date rule
  // cannot see it.
  'video172026-02-17_similarity-search_qdrant-groups_25154083.mp4': 'ssc-493',

  // create_date 2026-03-10. Content is Session 15 MCP servers + content
  // pillars; matches the ssc-493 session-15 deck. Opaque filename.
  'video1356031888.mp4': 'ssc-493',

  // IBM Technology YouTube video, third-party material assigned in the Spring
  // 2026 pilot. Tagged by ingest provenance. Fall 2026 assigns the same video,
  // but Fall retrieval stays scoped to Fall, so this stays ssc-493.
  'AI Periodic Table Explained': 'ssc-493',
};

const COURSE_BY_MONTH: Record<string, string> = {
  '01': 'ssc-493',
  '02': 'ssc-493',
  '03': 'ssc-493',
  '04': 'ssc-493',
  '09': 'ssc-490',
  '10': 'ssc-490',
  '11': 'ssc-490',
  '12': 'ssc-490',
};

/** Only a date at the very START of the filename counts. */
const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})[_-]/;

const COURSE_FIELD = 'metadata.course';
const UNTAGGED = '<untagged>';
const NO_FILE_NAME = '<<NO_FILE_NAME>>';
const BATCH_LIMIT = 500;

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------
function loadCredentials(): { url: string; apiKey: string } {
  let url = process.env.QDRANT_URL;
  let apiKey = process.env.QDRANT_API_KEY;

  if (!url || !apiKey) {
    const envPath = join(homedir(), '.credentials', 'msu.env');
    try {
      for (const raw of readFileSync(envPath, 'utf8').split('\n')) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
        const value = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key === 'QDRANT_URL' && !url) url = value;
        if (key === 'QDRANT_API_KEY' && !apiKey) apiKey = value;
      }
    } catch {
      /* fall through to the error below */
    }
  }

  if (!url || !apiKey) {
    throw new Error(
      'Missing QDRANT_URL / QDRANT_API_KEY. Set them in the environment or in ~/.credentials/msu.env',
    );
  }
  return { url: url.replace(/\/+$/, ''), apiKey };
}

const { url: QDRANT_URL, apiKey: QDRANT_API_KEY } = loadCredentials();

async function qdrant<T = any>(path: string, init?: RequestInit): Promise<T> {
  // Belt and braces: nothing leaves this process aimed at another collection.
  if (path.includes('/collections/') && !path.includes(`/collections/${COLLECTION}`)) {
    throw new Error(`REFUSING request to a collection other than ${COLLECTION}: ${path}`);
  }
  const res = await fetch(`${QDRANT_URL}${path}`, {
    ...init,
    headers: {
      'api-key': QDRANT_API_KEY,
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.text();
  if (!res.ok) {
    // body may echo the request, but never the api key (it lives in a header)
    throw new Error(`Qdrant ${res.status} on ${path}: ${body.slice(0, 500)}`);
  }
  return body ? (JSON.parse(body) as T) : (undefined as T);
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------
export function courseForFileName(fileName: string | undefined | null): string | null {
  if (!fileName) return null;

  // 1. Explicit override always wins.
  const override = OVERRIDES[fileName];
  if (override) return override;

  // 2. Date prefix.
  const m = DATE_PREFIX.exec(fileName);
  if (!m) return null;
  // Under `noUncheckedIndexedAccess` capture groups are `string | undefined`.
  // Narrow rather than assert: an unreadable date is exactly the "cannot
  // classify" case, and the safe answer there is to leave the point untagged.
  const year = m[1];
  const month = m[2];
  if (year === undefined || month === undefined) return null;
  if (year !== '2026') return null; // extend the table deliberately, don't infer
  return COURSE_BY_MONTH[month] ?? null;
}

type Doc = {
  fileName: string;
  total: number;
  /** Actual stored `metadata.course` values, counted. Never re-derived. */
  actual: Map<string, number>;
  /** Points still carrying a `metadata.content_role` key (should be none). */
  withContentRole: number;
};

async function scrollAll(): Promise<Map<string, Doc>> {
  const docs = new Map<string, Doc>();
  let offset: unknown = undefined;
  let seen = 0;
  let missingFileName = 0;

  for (;;) {
    const body: Record<string, unknown> = {
      limit: BATCH_LIMIT,
      // metadata only — the `content` field is large, irrelevant here, and
      // contains raw control characters that break naive JSON consumers.
      with_payload: ['metadata'],
      with_vector: false,
    };
    if (offset !== undefined && offset !== null) body.offset = offset;

    const res = await qdrant<{
      result: {
        points: Array<{ id: string | number; payload?: { metadata?: Record<string, any> } }>;
        next_page_offset: unknown;
      };
    }>(`/collections/${COLLECTION}/points/scroll`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    for (const p of res.result.points) {
      seen++;
      const md = p.payload?.metadata ?? {};
      if (!md.file_name) missingFileName++;
      const fileName: string = md.file_name ?? NO_FILE_NAME;
      const doc =
        docs.get(fileName) ??
        { fileName, total: 0, actual: new Map<string, number>(), withContentRole: 0 };
      doc.total++;
      const course: string = md.course ?? UNTAGGED;
      doc.actual.set(course, (doc.actual.get(course) ?? 0) + 1);
      if (md.content_role !== undefined) doc.withContentRole++;
      docs.set(fileName, doc);
    }

    offset = res.result.next_page_offset;
    if (offset === null || offset === undefined) break;
  }

  console.log(`Scrolled ${seen} points across ${docs.size} distinct file_name values.`);
  if (missingFileName > 0) {
    console.warn(`  WARNING: ${missingFileName} points have no metadata.file_name`);
  }
  return docs;
}

async function setCourseForFile(fileName: string, course: string): Promise<void> {
  await qdrant(`/collections/${COLLECTION}/points/payload?wait=true`, {
    method: 'POST',
    body: JSON.stringify({
      // set_payload merges at the TOP level only. Sending `{metadata:{course}}`
      // would REPLACE the whole metadata object and destroy file_name et al.
      // The `key` parameter (Qdrant >= 1.10) sets into the nested path instead,
      // leaving every sibling key under `metadata` intact.
      payload: { course },
      key: 'metadata',
      filter: {
        must: [{ key: 'metadata.file_name', match: { value: fileName } }],
      },
    }),
  });
}

async function ensurePayloadIndex(): Promise<'created' | 'exists'> {
  const info = await qdrant<{ result: { payload_schema?: Record<string, unknown> } }>(
    `/collections/${COLLECTION}`,
  );
  if (info.result.payload_schema && COURSE_FIELD in info.result.payload_schema) return 'exists';
  await qdrant(`/collections/${COLLECTION}/index?wait=true`, {
    method: 'PUT',
    body: JSON.stringify({ field_name: COURSE_FIELD, field_schema: 'keyword' }),
  });
  return 'created';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const apply = process.argv.includes('--apply');
  console.log(
    `Collection: ${COLLECTION}   mode: ${apply ? 'APPLY' : 'DRY RUN (pass --apply to write)'}\n`,
  );

  const docs = [...(await scrollAll()).values()].sort((a, b) => b.total - a.total);

  const planned: Array<{ doc: Doc; course: string; needs: number; via: string }> = [];
  const skipped: Doc[] = [];

  for (const doc of docs) {
    const name = doc.fileName === NO_FILE_NAME ? null : doc.fileName;
    const course = courseForFileName(name);
    if (!course) {
      skipped.push(doc);
      continue;
    }
    planned.push({
      doc,
      course,
      needs: doc.total - (doc.actual.get(course) ?? 0),
      via: name && OVERRIDES[name] ? 'override' : 'date',
    });
  }

  console.log('file_name'.padEnd(64) + 'chunks    set  course   via');
  console.log('-'.repeat(64) + '------  -----  --------------');
  for (const p of planned) {
    console.log(
      p.doc.fileName.padEnd(64) +
        String(p.doc.total).padStart(6) +
        String(p.doc.actual.get(p.course) ?? 0).padStart(7) +
        '  ' +
        p.course.padEnd(9) +
        p.via,
    );
  }

  const byCourse = new Map<string, { docs: number; chunks: number }>();
  for (const p of planned) {
    const agg = byCourse.get(p.course) ?? { docs: 0, chunks: 0 };
    agg.docs++;
    agg.chunks += p.doc.total;
    byCourse.set(p.course, agg);
  }
  console.log('\nPlanned totals:');
  for (const [course, agg] of [...byCourse].sort()) {
    console.log(`  ${course}: ${agg.docs} docs / ${agg.chunks} chunks`);
  }

  const skippedChunks = skipped.reduce((n, d) => n + d.total, 0);
  console.log(
    `\nLeft UNTAGGED (no override, no parseable date prefix): ${skipped.length} docs / ${skippedChunks} chunks`,
  );
  for (const s of skipped) console.log(`  - ${s.fileName} (${s.total})`);

  const toWrite = planned.filter((p) => p.needs > 0);
  console.log(
    `\n${toWrite.length} of ${planned.length} documents need a write (${toWrite.reduce((n, p) => n + p.needs, 0)} chunks).`,
  );

  if (!apply) {
    console.log('\nDry run — nothing written. Re-run with --apply.');
    return;
  }

  for (const p of toWrite) {
    await setCourseForFile(p.doc.fileName, p.course);
    console.log(`  set course=${p.course} on ${p.doc.total} chunks of ${p.doc.fileName}`);
  }

  const index = await ensurePayloadIndex();
  console.log(`\nPayload index on ${COURSE_FIELD} (keyword): ${index}`);

  // -------------------------------------------------------------------------
  // Verify by re-scrolling and reading the values ACTUALLY stored.
  // -------------------------------------------------------------------------
  const after = await scrollAll();
  const dist = new Map<string, number>();
  const untaggedDocs: Doc[] = [];
  let totalPoints = 0;
  let withFileName = 0;
  let withContentRole = 0;

  for (const doc of after.values()) {
    totalPoints += doc.total;
    if (doc.fileName !== NO_FILE_NAME) withFileName += doc.total;
    withContentRole += doc.withContentRole;
    for (const [c, n] of doc.actual) dist.set(c, (dist.get(c) ?? 0) + n);
    if (doc.actual.has(UNTAGGED)) untaggedDocs.push(doc);

    const expected = courseForFileName(doc.fileName === NO_FILE_NAME ? null : doc.fileName);
    if (expected) {
      const wrong = doc.total - (doc.actual.get(expected) ?? 0);
      if (wrong > 0) console.warn(`  WARNING: ${doc.fileName}: ${wrong} chunks not as expected`);
    }
  }

  console.log(`\nFinal metadata.course distribution (read back from Qdrant):`);
  for (const [k, v] of [...dist].sort()) console.log(`  ${k}: ${v}`);
  console.log(`Untagged documents: ${untaggedDocs.length}`);
  for (const d of untaggedDocs) console.log(`  - ${d.fileName} (${d.actual.get(UNTAGGED)})`);
  console.log(`Points with metadata.file_name intact: ${withFileName} / ${totalPoints}`);
  console.log(`Points carrying a metadata.content_role key: ${withContentRole} (expected 0)`);

  // Authoritative counts straight from the server.
  console.log('\nServer-side counts:');
  for (const course of [...byCourse.keys()].sort()) {
    const res = await qdrant<{ result: { count: number } }>(
      `/collections/${COLLECTION}/points/count`,
      {
        method: 'POST',
        body: JSON.stringify({
          exact: true,
          filter: { must: [{ key: COURSE_FIELD, match: { value: course } }] },
        }),
      },
    );
    console.log(`  course=${course}: ${res.result.count}`);
  }
  const tagged = await qdrant<{ result: { count: number } }>(
    `/collections/${COLLECTION}/points/count`,
    {
      method: 'POST',
      body: JSON.stringify({
        exact: true,
        filter: { must_not: [{ is_empty: { key: COURSE_FIELD } }] },
      }),
    },
  );
  const all = await qdrant<{ result: { count: number } }>(
    `/collections/${COLLECTION}/points/count`,
    { method: 'POST', body: JSON.stringify({ exact: true }) },
  );
  console.log(`  tagged with any course: ${tagged.result.count}`);
  console.log(`  untagged: ${all.result.count - tagged.result.count}`);
  console.log(`  total points: ${all.result.count}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
