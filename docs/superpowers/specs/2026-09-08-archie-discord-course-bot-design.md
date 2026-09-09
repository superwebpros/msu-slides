# Archie — Discord Course Assistant

**Date:** 2026-09-08
**Course:** SSC 490-005 (Fall 2026)
**Status:** Implemented and green (106 tests, `wrangler deploy --dry-run` clean).
Not yet deployed — see epic `msu-slides-it1`. Remaining work is console-side:
AI Gateway (`it1.6`) and a collection-scoped Qdrant token (`it1.13`).

## Summary

Archie is a Discord slash-command bot that lets SSC 490 students query course
material conversationally. It replaces a LibreChat agent that reached the same
Qdrant collection through an n8n MCP server.

Archie is a **thin agent harness**, not a RAG pipeline. The model decides whether
to search; it is never forced to answer from retrieved chunks. General questions
get general answers. Course questions get cited answers. Questions the material
does not cover get an honest "not covered."

## Goals

- Students self-serve on course content, assignments, and deadlines
- Answers cite their source (session + recording date) when drawn from course material
- No forced retrieval — general questions do not get costumed in transcript fragments
- Ephemeral by default; nothing persisted about who asked what
- Runs on infrastructure already in use (Cloudflare, n8n, Baserow, Qdrant)

## Non-goals

- Reading student DMs or conversations between students (Discord does not permit it)
- Grading, or any write access to any system
- Retaining a per-student interaction history
- Replacing the n8n MCP server that LibreChat and other agents use

## Architecture

```
Student in Discord
      │  /ask what's due friday?
      ▼
Discord ──POST(signed)──► Cloudflare Worker  (fetch handler)
                              │  1. verify Ed25519 signature (PUBLIC_KEY)
                              │  2. respond type 5 "thinking…"   (<3s hard limit)
                              │  3. hand off to Durable Object
                              ▼
                          CourseAgent  (Agents SDK; one DO per Discord thread)
                              │  generateText({ system, messages, tools })
                              │      via AI Gateway ──► Anthropic (BYOK)
                              │
                              ├─ search_course_content
                              │     ├─ AI Gateway ──► OpenAI embeddings
                              │     └─ Qdrant /points/search
                              │          filter: course == ACTIVE_COURSE
                              └─ list_assignments  → Baserow table 1068
                              │
                              ▼
                          PATCH webhook → answer appears in Discord
```

### Why a Worker at all

Discord bots are an identity plus a callback URL. Discord holds the username,
avatar, and permissions, and POSTs an interaction payload when a student invokes
a command. It runs no code and cannot call an MCP server. LibreChat previously
played the role of "thing that runs the loop"; the Worker replaces it.

### Interaction model

HTTP interactions (slash commands), not a gateway bot. The credentials on hand
(`BOT_TOKEN`, `APPLICATION_ID`, `PUBLIC_KEY`) are exactly the HTTP-interactions
set, and this avoids paying for an always-on host. Consequence: Archie cannot see
plain messages, only explicit `/ask` invocations. Multi-turn works by keeping
history in the Durable Object keyed on thread.

Two protocol constraints drive the Worker/DO split:

- Respond within **3 seconds** or Discord kills the interaction
- A deferred response then allows **15 minutes** for the real answer

## Tools

| Tool | Source | Rules |
|---|---|---|
| `search_course_content` | Qdrant `course_content`, direct | Read-only. Filtered to `ACTIVE_COURSE`. Cites session + recording date. Model chooses when to call. |
| `list_assignments` | Baserow table 1068 | `Active = true` enforced in code. Fields passed through generically. |
| *(none)* | Claude's own knowledge | General questions answered directly |

Both tools are read-only. There is no write path to any system.

### `search_course_content`

Native to the Worker — n8n is **not** in the student request path. Embed the
query with `text-embedding-3-small` (routed through AI Gateway so embeddings are
cached too), then POST to Qdrant `/collections/course_content/points/search` with
`limit: 10` and a `must` filter on the active course.

**Why not reuse the n8n MCP server.** Decided 2026-09-08, reversing the earlier
call. In `retrieve-as-tool` mode the n8n node exposes exactly one input to the
model — a query string — while the filter lives in static `searchFilterJson`
config. A per-query semester filter is therefore not expressible through it; the
alternatives are two separate tools or one hardcoded semester, both worse than the
problem being solved. Three supporting reasons:

- The `should` bug survived because the filter was buried in UI config where
  nothing tested it. In the Worker it is a literal that can be diffed and tested.
- Citations need session, semester, and the recording link from the payload. A
  direct search returns the full payload; the n8n tool returns what it formats.
- n8n stops being a student-facing availability dependency.

> **Timestamps are not available.** An earlier draft of this spec asked for
> "session + timestamp" citations. There is no time offset anywhere in the index —
> the only positional data is `loc.lines.{from,to}`, which is transcript line
> numbers. Citing a line number as a timestamp would look plausible and be wrong.
> Citations are session + recording date + source link. Adding real timestamps
> would require re-indexing with offsets from the ASR output (`msu-slides-it1.15`).
>
> One near-miss: the `youtube_url` values *look* like they carry an offset
> (`…&t=728s`), but all 28 points on that document share the identical value. It
> is a document-level anchor someone copied once from a paused video, not a
> per-chunk position. Never present it as "where this was said." Currently moot —
> that document is `ssc-493` and unreachable from Fall.

The n8n workflow stays as-is for any other consumer. It still carries the `should`
defect described below — fixing it there is now independent of Archie.

**Collection name is hardcoded and never derived from user input or model
choice.** See the threat model.

**`ACTIVE_COURSE` is a Worker environment variable**, not a literal — currently
`ssc-490`. Rolling to the next semester is a config change and a redeploy, not a
code edit.

**Collection verified 2026-09-08.** `course_content` holds 1082 points, 1536-dim
Cosine — confirming `text-embedding-3-small`. It is course-only. The wider Qdrant
instance hosts 32 collections including client work (`kb-medilodge-v1`,
`orange_insoles_rp`, `*-HTSA-content-*`, `swp-partner-content-*`), but none of it
is in this collection.

**Known defect 1 — the `should` filter excludes 10% of the corpus.** The Qdrant
node filters with a `should` clause on `metadata.type == "transcript"`. In Qdrant,
`should` is a hard OR filter, not a relevance boost — when it is the only clause,
a point must match to be returned at all. Measured:

| `metadata.type` | Points | Retrievable |
|---|---:|---|
| `transcript` | 972 | yes |
| *(missing)* | 82 | **no** |
| `youtube_transcript` | 28 | **no** |

The 82 untyped points are a *second chunking run* of
`2026-01-13_session-1_periodic-chart.m4a` (86 typed + 82 untyped, only 16 exact
text overlaps). The 28 `youtube_transcript` points are "AI Periodic Table
Explained" — a unique document, entirely unreachable.

Since the collection is course-only, the filter's purpose is moot: **drop it.**
But delete the 82 duplicate chunks first, or dropping the filter surfaces two
chunkings of the same session-1 audio and wastes `topK` slots on redundancy.

**Known defect 2 — the collection mixes two semesters with colliding session
numbers.** This is the higher-impact problem.

| Semester | Docs | Chunks | Share |
|---|---:|---:|---:|
| Spring 2026 — SSC 493 pilot (frozen) | 12 | 587 | 54% |
| Fall 2026 — SSC 490 (active) | 3 | 412 | 38% |
| Undated | 3 | 83 | 8% |

Spring session-1 was the periodic chart; Fall session-01 is the course framework.
Spring session-3 was RAG; Fall session-3 is intro-to-skills. A Fall student asking
"what did we cover in session 3?" can get the Spring lecture, and the answer will
read as plausible while citing a session number that appears to match.

**RESOLVED 2026-09-08** (`msu-slides-it1.10`). Every point now carries
`metadata.course`: **`ssc-493` = 670, `ssc-490` = 412, untagged = 0**, total still
1082. A keyword payload index covers the field. Tagging was done in place with
`set_payload` — no re-embedding. The reusable script is
`archie/scripts/tag-semester.ts`: dry-run by default, `--apply` to write, an
override map for filenames without a parseable date prefix, and a request-level
guard that refuses any collection but `course_content`.

> **Trap for whoever runs this next.** Qdrant's `set_payload` merges only at the
> *top* level. The obvious call — `payload: {metadata: {course: "…"}}` — silently
> **replaces the entire `metadata` object**, destroying `file_name`, `create_date`,
> `transcript_id`, `audio_file_url`, and `source`, while still passing a naive
> "did `course` get set?" check. The correct form is
> `{payload: {course: "…"}, key: "metadata", filter: {…}}` (Qdrant ≥ 1.10).

Verified live afterward with a negative control: flipping only `ACTIVE_COURSE` to
`ssc-493` returns the Spring periodic-chart material for "AI periodic table", while
`ssc-490` returns only Fall session-01. The Spring content is present and is the
*better* semantic match — the filter is the only thing holding it back, which is
the isolation working rather than a thin corpus.

**Retrieval policy is an open decision** (see Open Questions): filter to SSC 490
only, or return both semesters with the course surfaced in results so Archie can
distinguish "in the Spring pilot" from "in our session 3."

**Retrieval policy — decided.** Filter to the active course only, with a single
`must` clause and a single-value match. A Fall student gets Fall material; the
Spring pilot is not served, because the session-number collisions make
wrong-semester answers look plausible rather than obviously wrong. Revisit only if
Fall coverage proves too thin in practice.

A `shared` tag for cross-semester assigned material was considered and **rejected**
(`msu-slides-it1.14`). The IBM "AI Periodic Table Explained" video is assigned in
both courses, but it is tagged `ssc-493` by ingest provenance and is deliberately
unreachable from Fall. Its absence is intended, not a gap — scope stays simple and
the filter stays a single-value match.

### `list_assignments`

Baserow REST, native to the Worker — no n8n in this path.

- Query with `user_field_names=true` and pass fields through generically, so new
  columns (`Due Date`, `Start Date`, `Deliverables`) work with no code change
- **Strip any field whose name begins with `_`.** This is the instructor-only
  convention: `_Rubric`, `_Grading Notes` are invisible to Archie by construction
- **`Active = true` is enforced in the query, not the prompt.** Draft assignments
  cannot be surfaced early regardless of how a student phrases the question

**Sanity check on the `Active` filter.** `Active` is unreliable elsewhere in this
Baserow instance — it is false on all 431 rows across tables 605, 665, 667, and
668 (see `msu-slides-11n.1`). Table 1068 is currently 2/2 true, but if it ever
rots the same way, a zero-row result is indistinguishable from "no assignments
exist" and Archie would tell students they have nothing due. Therefore: if the
filtered query returns zero rows while the unfiltered table is non-empty, treat
it as misconfiguration and report a problem rather than an empty list.

### System prompt responsibilities

Deliberately narrow, because the architecture already prevents forced retrieval:

- Search course material for course questions; answer general questions directly
- Cite session number and recording date when answering from retrieved material
- When retrieval comes back thin, say the material does not appear to cover it
- Current date in `America/Detroit`, injected per call — models do not know the
  date, and every due-date question depends on it

## Access control

The primary gate is Discord's, not ours.

| Control | Mechanism |
|---|---|
| Who can invoke | Guild-scoped command, registered only to the course server |
| Optional tightening | Discord command permissions restricted to a student role |
| Per-student rate limit | Counter in the DO keyed on Discord user ID (~20/hr, 100/day) |
| Account ceiling | AI Gateway budget cap |
| Repeat questions | AI Gateway response caching |
| Reply visibility | Ephemeral by default; `public: true` option to share deliberately |

Ephemeral default keeps the channel from becoming a wall of bot text and stops
students free-riding on each other's questions.

### Threat model

Student input is untrusted and prompt injection should be assumed. The blast
radius is deliberately small: full hijack of the agent yields course transcripts
and active assignments — material students already have. No shell, no filesystem,
no unrelated MCP servers, no write access.

This is the reason Archie is a purpose-built bot rather than the Claude Code
Discord plugin. That plugin bridges Discord into a full Claude Code session,
which on this machine carries Bash, filesystem access, and MCP servers for Gmail,
Google Drive, Slack, iMessage, Postmark, EspoCRM, and Lunchmoney. Untrusted
student input must never reach that surface.

**Qdrant key scope.** `QDRANT_API_KEY` in `msu.env` is instance-wide — it reads
all 32 collections on that instance, including client data (`kb-medilodge-v1`,
`orange_insoles_rp`, `*-HTSA-content-*`, `swp-partner-content-*`,
`glcf-content-v1`). Shipping it to the Worker would make Archie's isolation a
property of the code rather than the credential.

The instance runs **Qdrant 1.19.0**, which supports JWT-based granular access
control. Mint a **read-only token scoped to `course_content`** so the Worker
cannot reach client collections even if compromised. Requires
`service.jwt_rbac: true` on the instance — a server config change, not a dashboard
toggle. Until that exists, the collection name must be a hardcoded literal that
never comes from user input or model choice.

## Logging

**None built.** AI Gateway already logs requests, which covers the occasional
"why did Archie answer that badly" lookup without a second logging system.

Student identity is not passed to the gateway, so logs contain questions and
answers with no names attached. This sidesteps the FERPA question rather than
managing it.

## Failure modes

| Failure | Behavior |
|---|---|
| n8n or Qdrant unreachable | Say course materials are unreachable; answer from general knowledge if possible. Never a stack trace, never silence. |
| Baserow unreachable | Same shape, scoped to assignments |
| `Active` filter returns 0 on non-empty table | Report misconfiguration, not "no assignments" |
| Model call exceeds Discord's 15-minute window | DO writes something back rather than leaving a permanent "thinking…" |

**Empty retrieval is not an error.** Treating it as failure makes Archie apologize
when he should answer; treating it as "nothing exists" makes him confabulate. He
should say the material does not appear to cover it and offer what he does know.

## Testing

- Register the command in a **private Discord server** first. Guild commands
  register instantly; global commands take up to an hour to propagate.
- `wrangler dev` plus a tunnel for the interactions endpoint, same as `poll-worker`
- Verify signature rejection with a bad signature (Discord requires this to pass
  its endpoint validation)
- Verify the 3-second ack path independently of the slow answer path
- Verify `_`-prefixed Baserow fields never appear in output
- Verify an `Active = false` row is unreachable through any phrasing

## Configuration

Secrets live in `~/.credentials/msu.env` and `~/.credentials/discord.env`, and are
pushed to the Worker with `wrangler secret put`. Never committed.

| Variable | File | Purpose |
|---|---|---|
| `BOT_TOKEN` | `discord.env` | Discord bot auth |
| `APPLICATION_ID` | `discord.env` | Command registration |
| `PUBLIC_KEY` | `discord.env` | Ed25519 interaction signature verification |
| `ANTHROPIC_API_KEY` | `msu.env` | BYOK via AI Gateway |
| `OPENAI_API_KEY` | `msu.env` | Query embeddings (`text-embedding-3-small`) |
| `BASEROW_RESOURCE_TOKEN` | `msu.env` | Baserow table 1068 read |
| `MSU_BASEROW_BASEURL` | `msu.env` | Baserow host |
| `QDRANT_URL` / `QDRANT_API_KEY` | `msu.env` | Vector search — replace with a collection-scoped read-only JWT |

Non-secret configuration lives in `wrangler.jsonc` `vars`, not secrets:

| Var | Value | Purpose |
|---|---|---|
| `ACTIVE_COURSE` | `ssc-490` | Semester filter. **Update each semester.** |
| `QDRANT_COLLECTION` | `course_content` | Hardcoded; never from user input |

**Housekeeping:**

- `discord.env` was mode 644; corrected to 600 on 2026-09-08
- Add `MSU_BASEROW_DOCUMENTS_TABLE_ID=1068` to `msu.env`, matching the
  `BR_*_TABLE_ID` convention in `baserow.env`
- Add a Discord section to `~/.credentials/README.md` (key names only)

## Open questions

1. ~~Is `course_content` course-only?~~ **Resolved 2026-09-08** — yes, course-only,
   1536-dim, `text-embedding-3-small`.
2. ~~Semester retrieval policy?~~ **Resolved 2026-09-08** — filter to the active
   course only, via the `ACTIVE_COURSE` var.
3. ~~Bearer auth on the n8n MCP webhook?~~ **Moot** — n8n is off Archie's path.
4. Does Archie need to answer from the slide decks and vault, or transcripts and
   assignments only? The `ssc-490/` decks are not currently indexed.

## Recurring maintenance

Each new semester:

1. Update `ACTIVE_COURSE` in `wrangler.jsonc` and redeploy
2. Tag newly indexed recordings with the matching `course` value — otherwise they
   are invisible to Archie, silently
3. Re-register the guild command if the course server changes
