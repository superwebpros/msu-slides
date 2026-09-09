# Archie — SSC 490 Discord course assistant

Archie is a Discord slash command (`/archie`) that answers questions about SSC 490 from the class
recording transcripts in Qdrant and the assignments table in Baserow. He runs as a Cloudflare
Worker plus one Durable Object per conversation. Replies are ephemeral by default (`public: true`
to share one with the channel), and nothing is logged about who asked what — the Discord user id
is salted and hashed for rate limiting and never leaves the request.

Design doc: [`../docs/superpowers/specs/2026-09-08-archie-discord-course-bot-design.md`](../docs/superpowers/specs/2026-09-08-archie-discord-course-bot-design.md)

---

## Discord concepts, in 60 seconds

If you have not built a Discord bot before, three things are worth knowing up front, because they
drive the whole setup order:

| Thing | What it actually is |
|---|---|
| **Application** | The registry entry. Owns the `APPLICATION_ID`, the `PUBLIC_KEY`, and the bot user's `BOT_TOKEN`. |
| **Interactions Endpoint URL** | Your Worker. Discord POSTs a signed JSON payload here every time someone runs `/archie`. There is no persistent connection and no polling — Archie is a webhook, not a daemon. |
| **Command registration** | Separate from deployment. The `/archie` *schema* (name, options, descriptions) lives on Discord's side and is uploaded by `npm run register`. Deploying the Worker does not register a command; registering a command does not deploy anything. |

Two protocol limits shape the code: you must respond to an interaction within **3 seconds**, and a
deferred ("thinking…") response then buys **15 minutes** to PATCH the real answer in. That is why
`src/index.ts` is thin and everything slow happens in the Durable Object.

---

## Setup, in order

The order matters. Step 1 cannot be completed until the Worker is deployed and the Discord secrets
are set, so read this through before starting.

### 1. Create the application

1. <https://discord.com/developers/applications> → **New Application** → name it (`ArchieF26`).
2. **General Information** → copy the **Public Key** and **Application ID**.
3. **Bot** → **Reset Token** → copy the token. It is shown once.
4. Store all three in `~/.credentials/discord.env` (already present as `BOT_TOKEN`,
   `APPLICATION_ID`, `PUBLIC_KEY`; file mode 600).
5. **Leave the Interactions Endpoint URL blank for now.** Come back to it in step 5.

Nothing on the **Bot** page needs Privileged Gateway Intents. Archie never reads messages — he only
ever sees explicit `/archie` invocations.

### 2. Invite the bot to a server

**OAuth2 → URL Generator:**

| Field | Value |
|---|---|
| Scopes | `applications.commands` **and** `bot` |
| Bot permissions | none needed — interaction responses go back over the interaction webhook, not as channel messages |

`applications.commands` is the one that matters: without it, guild command registration returns
`403 Missing Access` and `/archie` never appears in the picker. `bot` is what makes Archie show up in
the member list.

Open the generated URL, pick a **private test server** first, authorize.

### 3. Push the secrets

Everything below goes in via `wrangler secret put` (never into `wrangler.jsonc`). **Two names
deliberately differ from the credential files** — those two rows are the footgun:

| Credential file | Variable there | `wrangler secret put` name | Note |
|---|---|---|---|
| `~/.credentials/discord.env` | `BOT_TOKEN` | `DISCORD_BOT_TOKEN` | **renamed** |
| `~/.credentials/discord.env` | `APPLICATION_ID` | `DISCORD_APPLICATION_ID` | **renamed** |
| `~/.credentials/discord.env` | `PUBLIC_KEY` | `DISCORD_PUBLIC_KEY` | **renamed** |
| `~/.credentials/msu.env` | `MSU_BASEROW_BASEURL` | `BASEROW_BASEURL` | **renamed** — `MSU_` prefix dropped |
| `~/.credentials/msu.env` | `BASEROW_RESOURCE_TOKEN` | `BASEROW_RESOURCE_TOKEN` | same |
| `~/.credentials/msu.env` | `ANTHROPIC_API_KEY` | `ANTHROPIC_API_KEY` | same |
| `~/.credentials/msu.env` | `OPENAI_API_KEY` | `OPENAI_API_KEY` | same (query embeddings) |
| `~/.credentials/msu.env` | `QDRANT_URL` | `QDRANT_URL` | same |
| `~/.credentials/msu.env` | `QDRANT_API_KEY` | `QDRANT_API_KEY` | same — instance-wide key, see the threat model in the design doc |
| *(none — generate it)* | — | `ARCHIE_USER_SALT` | **not in any credential file** |
| *(AI Gateway dashboard)* | — | `AI_GATEWAY_BASE_URL` | optional, see below |

The authoritative list is `Env` in [`src/types.ts`](src/types.ts). If a secret is missing, the
Worker deploys fine and fails at request time.

Pipe values straight out of the credential file so nothing lands in shell history:

```bash
cd archie

grep '^BOT_TOKEN='             ~/.credentials/discord.env | cut -d= -f2- | npx wrangler secret put DISCORD_BOT_TOKEN
grep '^APPLICATION_ID='        ~/.credentials/discord.env | cut -d= -f2- | npx wrangler secret put DISCORD_APPLICATION_ID
grep '^PUBLIC_KEY='            ~/.credentials/discord.env | cut -d= -f2- | npx wrangler secret put DISCORD_PUBLIC_KEY

grep '^MSU_BASEROW_BASEURL='   ~/.credentials/msu.env | cut -d= -f2- | npx wrangler secret put BASEROW_BASEURL
grep '^BASEROW_RESOURCE_TOKEN=' ~/.credentials/msu.env | cut -d= -f2- | npx wrangler secret put BASEROW_RESOURCE_TOKEN
grep '^ANTHROPIC_API_KEY='     ~/.credentials/msu.env | cut -d= -f2- | npx wrangler secret put ANTHROPIC_API_KEY
grep '^OPENAI_API_KEY='        ~/.credentials/msu.env | cut -d= -f2- | npx wrangler secret put OPENAI_API_KEY
grep '^QDRANT_URL='            ~/.credentials/msu.env | cut -d= -f2- | npx wrangler secret put QDRANT_URL
grep '^QDRANT_API_KEY='        ~/.credentials/msu.env | cut -d= -f2- | npx wrangler secret put QDRANT_API_KEY
```

Generate the salt once and keep it — rotating it just resets everyone's rate-limit counters:

```bash
openssl rand -hex 32 | npx wrangler secret put ARCHIE_USER_SALT
```

> If you want the salt recorded, add `ARCHIE_USER_SALT` to `~/.credentials/msu.env` in the same
> pass. It is not a shared credential, so it is fine for it to exist only in Cloudflare — but then
> a re-deploy to a fresh Worker name will produce different user keys.

Verify with `npx wrangler secret list` (names only, never values).

### 4. Deploy

```bash
cd archie
npm run deploy     # wrangler deploy
```

This publishes to `https://archie.<your-subdomain>.workers.dev`. Confirm it is up:

```bash
curl https://archie.<your-subdomain>.workers.dev/health          # -> ok
curl -i -X POST https://archie.<your-subdomain>.workers.dev/interactions   # -> 401
```

Both checks are prerequisites for the next step.

### 5. Set the Interactions Endpoint URL — the step that trips people up

Developer Portal → **General Information** → **Interactions Endpoint URL**:

```
https://archie.<your-subdomain>.workers.dev/interactions
```

When you press **Save**, Discord immediately POSTs probe requests to that URL and refuses to save
unless the Worker behaves correctly on all of them:

- a correctly signed `PING` (type 1) → must get `200` with `{"type": 1}`
- **deliberately invalid signatures** → must get `401`

So the endpoint has to be live *and* `DISCORD_PUBLIC_KEY` has to be set *before* you can save the
field. This is why deployment comes first. `src/discord.ts` `verifyRequest()` never throws — bad
hex, wrong-length keys, and missing headers all come back as a clean `valid: false`, which
`src/index.ts` turns into a `401`. If the public key secret is missing, *every* request including
the valid PING gets a 401, and Discord rejects the URL with a message that looks like a signature
problem. Check `wrangler secret list` first.

### 6. Register `/archie`

Against the private test server:

```bash
npm run register -- --dry-run <guild-id>   # show the plan, write nothing
npm run register -- <guild-id>             # register
```

Guild id: enable **Developer Mode** (User Settings → Advanced), right-click the server → **Copy
Server ID**. Or set `DISCORD_GUILD_ID` in your environment and omit the argument.

| Command | Effect |
|---|---|
| `npm run register -- <guild-id>` | Bulk-PUT the command set to one guild. Instant. |
| `npm run register -- --list <guild-id>` | Show what is currently registered there |
| `npm run register -- --delete ask <guild-id>` | Remove one command |
| `npm run register -- --global` | Application-wide. Takes up to an hour to propagate, including when you need to undo it. Prints a warning. |
| `npm run register -- --help` | Full usage |

The script refuses to run without a guild id unless `--global` is passed, reads `BOT_TOKEN` /
`APPLICATION_ID` from `~/.credentials/discord.env`, never prints a token, and surfaces Discord's
error body verbatim on failure — it names the exact offending field for a malformed option schema.

Registration is a **bulk overwrite**: anything registered in that scope but absent from `COMMANDS`
in [`scripts/register-commands.ts`](scripts/register-commands.ts) is removed. The plan output flags
those with `-`.

The schema must match what the Worker reads (`src/index.ts` looks for the command name `ask` and
options `question` / `public`). Rename an option in one place only and `/archie` silently returns the
usage hint forever.

### 7. Try it

In the test server: `/archie what is due friday?` — the reply should be ephemeral. Then
`/archie ... public: True` to check the shared path. When it looks right, invite the app to the real
course server and run `npm run register -- <course-guild-id>` again.

---

## Vars vs. secrets

Non-secret configuration lives in `vars` in [`wrangler.jsonc`](wrangler.jsonc); it is committed to
the repo, readable in the dashboard, and changing it **requires a redeploy**. Secrets are set with
`wrangler secret put`, are never in the repo, and take effect without a redeploy.

| Var | Current | Purpose |
|---|---|---|
| **`ACTIVE_COURSE`** | `ssc-490` | **Semester filter. Update every semester.** Qdrant points whose `metadata.course` does not equal this are invisible to Archie. |
| `QDRANT_COLLECTION` | `course_content` | Hardcoded on purpose — the Qdrant key can read all 32 collections on the instance, including client data. Never derive this from user input or model choice. |
| `EMBEDDING_MODEL` | `text-embedding-3-small` | Must match the collection: 1536-dim, cosine. Changing it without re-embedding silently degrades retrieval. |
| `ANSWER_MODEL` | `claude-sonnet-5` | Answering model |
| `BASEROW_DOCUMENTS_TABLE_ID` | `1068` | Assignments table |
| `COURSE_TIMEZONE` | `America/Detroit` | Injected into the prompt — every due-date question depends on it |
| `SEARCH_TOP_K` | `10` | Chunks per search |

`ACTIVE_COURSE` is the one that changes. It is a var rather than a literal so rolling to the next
semester is a config edit and a redeploy, not a code change.

---

## Recurring maintenance — each semester

1. **Update `ACTIVE_COURSE`** in `wrangler.jsonc` and `npm run deploy`.
2. **Tag the new recordings** with the matching `course` value. ← *this is the dangerous one*
3. **Re-register the guild command** if the course server changed:
   `npm run register -- <new-guild-id>`.

### The trap

Forgetting `ACTIVE_COURSE` is loud: Archie keeps citing last semester and someone notices in a day.

Indexing new recordings **without a `course` tag is silent**. Retrieval filters on a single `must`
clause matching `metadata.course == ACTIVE_COURSE`, so untagged points are simply not candidates.
There is no error, no warning, no empty-result signal — Archie answers "the material doesn't appear
to cover that" in a perfectly reasonable tone while sitting on a corpus he cannot see. Every new
recording must be tagged, every time.

[`scripts/tag-semester.ts`](scripts/tag-semester.ts) exists for exactly this. It derives `course`
from the date prefix on `metadata.file_name` (2026 months 01–04 → `ssc-493`, 09–12 → `ssc-490`),
plus an explicit `OVERRIDES` map for files whose names cannot classify them.

```bash
cd archie
npx tsx scripts/tag-semester.ts            # DRY RUN — default, writes nothing
npx tsx scripts/tag-semester.ts --apply    # set payloads + ensure the keyword index
```

It is idempotent (only points missing the desired course are written), additive
(`set_payload`, never `overwrite_payload`, never a delete), hard-pinned to the `course_content`
collection, and it reads back the stored distribution afterwards so you can see the result rather
than infer it.

**Read the dry-run output before applying.** Anything with no override and no parseable date prefix
is deliberately left untagged and listed under `Left UNTAGGED` — those are exactly the files that
will be invisible. Add them to `OVERRIDES` with a comment saying why, then re-run. Guessing a
semester is worse than omitting one: a wrong tag is invisible corruption inside a filtered path.

New months roll into a new academic year — extend `COURSE_BY_MONTH` and the year guard in that
script deliberately rather than letting it infer.

---

## AI Gateway (optional but wanted)

`AI_GATEWAY_BASE_URL` routes the Anthropic and OpenAI calls through Cloudflare AI Gateway.
`src/tools/search.ts` appends the provider path itself (`.../openai/embeddings`), so the secret
must be the **gateway root with no provider suffix**:

```
https://gateway.ai.cloudflare.com/v1/<account-id>/<gateway-name>
```

### Dashboard steps (manual — there is no wrangler equivalent)

1. Cloudflare dashboard → **AI** → **AI Gateway** → **Create Gateway**. Name it `archie`.
2. **Provider Keys / BYOK** — store the Anthropic key (and the OpenAI key, if you want embeddings
   billed through the same place) in the gateway's Secrets Store so the gateway can attach it.
3. **Limits** — set a **budget cap** (spend or request count per period). This is the account
   ceiling in the design's access-control table; without it a runaway loop is unbounded.
4. **Caching** — enable it and pick a TTL. Repeat questions from a 25-person class are the common
   case, and cached responses are free and instant.
5. Copy the gateway's base URL from the dashboard, then:
   ```bash
   npx wrangler secret put AI_GATEWAY_BASE_URL
   ```

### If it is unset

Everything still works. Calls go direct to Anthropic and OpenAI using the API keys, and you lose
exactly three things:

- response caching (repeat questions cost full price)
- the budget cap (no account ceiling)
- **request logs** — and per the design, AI Gateway logs are Archie's *only* observability into
  what students asked and what he answered. There is deliberately no second logging system, and
  student identity is never sent to the gateway. With `AI_GATEWAY_BASE_URL` unset there is no
  record at all of a bad answer to go back and look at.

---

## Local development

```bash
npm run dev         # wrangler dev
npm test            # vitest run
npm run typecheck   # tsc --noEmit
```

`wrangler dev` alone is not reachable by Discord. To exercise the real interaction path you need a
public tunnel pointed at the dev server and the tunnel URL temporarily set as the Interactions
Endpoint URL — same pattern as `poll-worker`. Remember to point the endpoint back at the deployed
Worker afterwards, or `/archie` breaks the moment you close the laptop.

Worth testing without Discord in the loop:

- `POST /interactions` with a bad signature → `401` (this is what Discord's probe checks)
- the 3-second ack path independently of the slow answer path
- `_`-prefixed Baserow fields never appear in output
- an `Active = false` assignment row is unreachable through any phrasing

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Discord won't save the Interactions Endpoint URL | The Worker isn't deployed, or isn't returning `401` for bad signatures | `curl` the `/health` and `/interactions` checks in step 4. If `/interactions` returns 500 or 200 for an unsigned POST, that's the bug. |
| Same, but the Worker is definitely up | `DISCORD_PUBLIC_KEY` not set → the valid PING gets a 401 too | `npx wrangler secret list`; re-push the key; note the `DISCORD_` prefix |
| Same, and the key is set | Wrong key pasted — the Public Key on **General Information**, not the bot token | Re-copy from the portal |
| `/archie` doesn't appear in the picker | Registered globally (up to an hour), or to a different guild | `npm run register -- --list <guild-id>` to see what is actually there |
| `/archie` still doesn't appear | The app was invited without the `applications.commands` scope | Re-run the OAuth2 URL Generator with both scopes and re-authorize |
| Register fails `403 Missing Access` | The bot is not in that guild, or the guild id is wrong | Invite it first; re-copy the server id with Developer Mode on |
| Register fails with a `50035` validation error | Malformed option schema | The error body names the exact field — the script prints it verbatim |
| "The application did not respond" | The 3-second ack was missed | Nothing slow may run before `deferredResponse()` in `src/index.ts`. Check `wrangler tail` for an exception in `handle()` before the ack, and confirm the DO dispatch is `ctx.waitUntil(...)` and not awaited. |
| Permanent "Archie is thinking…" | The ack landed but the follow-up PATCH never did | `wrangler tail`. The interaction token expires after 15 minutes; after that the message can't be replaced at all. |
| Archie finds nothing on a topic that is definitely in a recording | Those Qdrant points have no `metadata.course` tag, or it doesn't match `ACTIVE_COURSE` | `npx tsx scripts/tag-semester.ts` (dry run) and read the `Left UNTAGGED` list — this is the silent failure described above |
| Archie says materials are unreachable | Qdrant or the embeddings call failed | Check `QDRANT_URL` / `QDRANT_API_KEY`; `wrangler tail` for the status code |
| "There's a problem with the assignments table" | The `Active = true` filter returned zero rows on a non-empty table | Deliberate — `Active` has rotted to false across 431 rows in four other tables in this Baserow instance. Fix the flags in table 1068; Archie must never tell a student they have nothing due. |
| `wrangler deploy` fails on the `CourseAgent` class | `src/agent.ts` must export `CourseAgent`, matching the `durable_objects` binding and the `v1` migration in `wrangler.jsonc` | — |

`npx wrangler tail` is the fastest way into any of these — observability is already enabled in
`wrangler.jsonc`.
