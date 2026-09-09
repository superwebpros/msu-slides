#!/usr/bin/env node
/**
 * register-commands.ts — register Archie's `/archie` slash command with Discord.
 *
 * This runs on your machine (via `tsx`), NOT in the Worker. Discord keeps the
 * command *schema* on its own side: the Worker only ever sees the resulting
 * interaction payload. So registration is a separate, occasional, out-of-band
 * step — you do not redeploy to change a command, and deploying does not
 * register one.
 *
 * GUILD-SCOPED BY DEFAULT, on purpose:
 *   - guild commands appear the instant this script returns
 *   - global commands can take up to an hour to propagate, and cannot be
 *     un-propagated any faster
 * Register against a private test server first. `--global` exists but shouts.
 *
 * The command schema below must stay in lockstep with what the Worker reads:
 *   src/index.ts  COMMAND_NAME === 'archie'
 *                 getStringOption(interaction, 'question')
 *                 getBooleanOption(interaction, 'public')
 *   src/discord.ts ApplicationCommandOptionType.String === 3
 *                  ApplicationCommandOptionType.Boolean === 5
 * Rename an option here and the Worker silently stops finding it — `question`
 * comes back undefined and every `/archie` returns the usage hint.
 *
 * Usage:
 *   npm run register -- <guild-id>          # register /archie to one guild
 *   npm run register -- --dry-run <guild-id>
 *   npm run register -- --list <guild-id>   # show what is registered
 *   npm run register -- --delete archie <guild-id>
 *   npm run register -- --global            # slow, application-wide
 *
 * The guild id may also come from DISCORD_GUILD_ID instead of an argument.
 *
 * Credentials: BOT_TOKEN and APPLICATION_ID, from the environment if present,
 * otherwise from ~/.credentials/discord.env. The token is never printed.
 */

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const CREDENTIALS_FILE = join(homedir(), '.credentials', 'discord.env');

/** Subset of Discord's ApplicationCommandType. */
const CHAT_INPUT = 1;

/** Mirrors ApplicationCommandOptionType in src/discord.ts. */
const OptionType = {
  String: 3,
  Boolean: 5,
} as const;

// ---------------------------------------------------------------------------
// The command set. This array is the whole desired state: registration is a
// bulk PUT, so anything NOT listed here is removed from the target scope.
// ---------------------------------------------------------------------------

interface CommandOption {
  type: number;
  name: string;
  description: string;
  required: boolean;
}

interface CommandDefinition {
  name: string;
  type: number;
  description: string;
  options: CommandOption[];
}

const COMMANDS: CommandDefinition[] = [
  {
    // Must stay identical to COMMAND_NAME in src/index.ts.
    name: 'archie',
    type: CHAT_INPUT,
    description: 'Ask Archie about the course',
    options: [
      {
        type: OptionType.String,
        name: 'question',
        description: 'What do you want to know?',
        required: true,
      },
      {
        type: OptionType.Boolean,
        name: 'public',
        description: 'Show the answer to the whole channel (default: only you)',
        required: false,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

interface Credentials {
  botToken: string;
  applicationId: string;
}

/**
 * Read BOT_TOKEN / APPLICATION_ID from the environment, falling back to
 * ~/.credentials/discord.env. Note the names: the credential file uses the
 * bare Discord names, while the Worker's Env uses DISCORD_-prefixed ones.
 * This script talks to Discord directly, so it uses the file's names.
 */
function loadCredentials(): Credentials {
  let botToken = process.env.BOT_TOKEN ?? process.env.DISCORD_BOT_TOKEN;
  let applicationId = process.env.APPLICATION_ID ?? process.env.DISCORD_APPLICATION_ID;

  if (!botToken || !applicationId) {
    try {
      for (const raw of readFileSync(CREDENTIALS_FILE, 'utf8').split('\n')) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
        const value = line
          .slice(eq + 1)
          .trim()
          .replace(/^['"]|['"]$/g, '');
        if (key === 'BOT_TOKEN' && !botToken) botToken = value;
        if (key === 'APPLICATION_ID' && !applicationId) applicationId = value;
      }
    } catch {
      /* fall through to the error below */
    }
  }

  if (!botToken || !applicationId) {
    throw new Error(
      `Missing BOT_TOKEN / APPLICATION_ID. Set them in the environment or in ${CREDENTIALS_FILE}`,
    );
  }
  return { botToken, applicationId };
}

// ---------------------------------------------------------------------------
// Discord REST
// ---------------------------------------------------------------------------

/**
 * Thin wrapper that surfaces Discord's error body verbatim.
 *
 * That body is worth reading: a malformed option schema comes back as a nested
 * `errors` object naming the exact field ("options.0.description: Must be
 * between 1 and 100 in length"), which is far more useful than the status code.
 */
async function discord<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${DISCORD_API_BASE}${path}`, {
    ...init,
    headers: {
      // The token lives only in this header. Never log `init` or these headers.
      authorization: `Bot ${token}`,
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    const detail = formatDiscordError(text);
    throw new Error(`Discord ${res.status} ${res.statusText} on ${init.method ?? 'GET'} ${path}\n${detail}`);
  }
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

/** Pretty-print Discord's JSON error body; fall back to the raw text. */
function formatDiscordError(body: string): string {
  if (!body) return '(empty response body)';
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body.slice(0, 2000);
  }
}

interface RegisteredCommand {
  id: string;
  name: string;
  description?: string;
  type?: number;
  options?: Array<{
    type: number;
    name: string;
    description: string;
    required?: boolean;
  }>;
}

// ---------------------------------------------------------------------------
// Diffing
// ---------------------------------------------------------------------------

/**
 * Reduce either shape (ours or Discord's) to just the fields we manage, so a
 * diff does not light up on server-assigned metadata (id, version, guild_id,
 * default_member_permissions, integration_types, …).
 */
function normalize(command: CommandDefinition | RegisteredCommand): string {
  return JSON.stringify({
    name: command.name,
    type: command.type ?? CHAT_INPUT,
    description: command.description ?? '',
    options: (command.options ?? []).map((option) => ({
      type: option.type,
      name: option.name,
      description: option.description,
      required: option.required ?? false,
    })),
  });
}

function describe(command: CommandDefinition): string[] {
  const lines = [`/${command.name} — ${command.description}`];
  for (const option of command.options) {
    const kind = option.type === OptionType.String ? 'string' : option.type === OptionType.Boolean ? 'boolean' : `type ${option.type}`;
    lines.push(`      ${option.name} (${kind}, ${option.required ? 'required' : 'optional'}) — ${option.description}`);
  }
  return lines;
}

function printPlan(existing: RegisteredCommand[], desired: CommandDefinition[]): void {
  const existingByName = new Map(existing.map((command) => [command.name, command]));

  for (const command of desired) {
    const current = existingByName.get(command.name);
    const status = !current ? 'NEW' : normalize(current) === normalize(command) ? 'unchanged' : 'CHANGED';
    const marker = status === 'NEW' ? '+' : status === 'CHANGED' ? '~' : ' ';
    const [head, ...rest] = describe(command);
    console.log(`  ${marker} ${head}   [${status}]`);
    for (const line of rest) console.log(`    ${line}`);
  }

  const desiredNames = new Set(desired.map((command) => command.name));
  for (const command of existing) {
    if (desiredNames.has(command.name)) continue;
    console.log(`  - /${command.name}   [WILL BE REMOVED — this PUT replaces the whole command set]`);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface Cli {
  guildId?: string;
  global: boolean;
  list: boolean;
  dryRun: boolean;
  deleteName?: string;
  help: boolean;
}

function parseArgs(argv: string[]): Cli {
  const cli: Cli = { global: false, list: false, dryRun: false, help: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === undefined) continue;

    switch (arg) {
      case '--global':
        cli.global = true;
        break;
      case '--list':
        cli.list = true;
        break;
      case '--dry-run':
        cli.dryRun = true;
        break;
      case '-h':
      case '--help':
        cli.help = true;
        break;
      case '--delete': {
        const name = argv[++i];
        if (!name) throw new Error('--delete needs a command name, e.g. --delete ask');
        cli.deleteName = name;
        break;
      }
      case '--guild': {
        const id = argv[++i];
        if (!id) throw new Error('--guild needs a guild id');
        cli.guildId = id;
        break;
      }
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown flag: ${arg}`);
        if (cli.guildId) throw new Error(`Unexpected extra argument: ${arg}`);
        cli.guildId = arg;
    }
  }

  return cli;
}

const USAGE = `
Register Archie's slash commands with Discord.

  npm run register -- <guild-id>              register to one guild (instant)
  npm run register -- --dry-run <guild-id>    show the plan, write nothing
  npm run register -- --list <guild-id>       list what is currently registered
  npm run register -- --delete ask <guild-id> remove one command
  npm run register -- --global                register application-wide (SLOW)

Options
  --guild <id>   guild id, if you prefer a flag to a positional argument
  --global       target the application scope instead of a guild.
                 Propagation takes up to an hour. Guild-scoped is instant and
                 is what you want for a course server.
  --list         print the registered commands for the target scope and exit
  --delete <n>   delete the command named <n> from the target scope and exit
  --dry-run      print the plan and exit without calling Discord's write API
  -h, --help     this message

Environment
  DISCORD_GUILD_ID   used when no guild id is passed on the command line
  BOT_TOKEN,
  APPLICATION_ID     read from ~/.credentials/discord.env when not in the env

Where to find the guild id: enable Developer Mode in Discord
(User Settings -> Advanced), then right-click the server -> Copy Server ID.
`.trim();

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const cli = parseArgs(process.argv.slice(2));

  if (cli.help) {
    console.log(USAGE);
    return;
  }

  const guildId = cli.guildId ?? process.env.DISCORD_GUILD_ID;

  if (!cli.global && !guildId) {
    console.error(
      'Refusing to run without a target.\n\n' +
        'Pass a guild id (npm run register -- <guild-id>) or set DISCORD_GUILD_ID.\n' +
        'Guild-scoped commands register instantly and are scoped to the course\n' +
        'server; use --global only if you really mean application-wide.\n',
    );
    process.exit(2);
  }

  if (cli.global && guildId) {
    console.error('Pass either --global or a guild id, not both.');
    process.exit(2);
  }

  const { botToken, applicationId } = loadCredentials();

  const scopePath = cli.global
    ? `/applications/${applicationId}/commands`
    : `/applications/${applicationId}/guilds/${guildId}/commands`;

  const scopeLabel = cli.global ? 'GLOBAL (all servers this app is in)' : `guild ${guildId}`;

  console.log(`Application: ${applicationId}`);
  console.log(`Target scope: ${scopeLabel}`);

  if (cli.global) {
    console.log(
      '\n  !! WARNING: global registration.\n' +
        '  !! Discord takes up to an hour to propagate global commands, and the\n' +
        '  !! same delay applies to fixing a mistake. For a single course server,\n' +
        '  !! register guild-scoped instead — it is instant.\n',
    );
  }

  // ---- --list ----------------------------------------------------------
  if (cli.list) {
    const registered = await discord<RegisteredCommand[]>(botToken, scopePath);
    if (registered.length === 0) {
      console.log('\nNo commands registered in this scope.');
      return;
    }
    console.log(`\n${registered.length} command(s) registered:\n`);
    for (const command of registered) {
      console.log(`  /${command.name}  (id ${command.id}) — ${command.description ?? ''}`);
      for (const option of command.options ?? []) {
        console.log(
          `      ${option.name} (type ${option.type}, ${option.required ? 'required' : 'optional'}) — ${option.description}`,
        );
      }
    }
    return;
  }

  // ---- --delete --------------------------------------------------------
  if (cli.deleteName) {
    const registered = await discord<RegisteredCommand[]>(botToken, scopePath);
    const target = registered.find((command) => command.name === cli.deleteName);
    if (!target) {
      console.log(`\n/${cli.deleteName} is not registered in this scope. Nothing to delete.`);
      return;
    }
    console.log(`\nDeleting /${target.name} (id ${target.id}) from ${scopeLabel}…`);
    await discord<void>(botToken, `${scopePath}/${target.id}`, { method: 'DELETE' });
    console.log('Deleted.');
    return;
  }

  // ---- register (bulk overwrite) ---------------------------------------
  const existing = await discord<RegisteredCommand[]>(botToken, scopePath);

  console.log(`\nPlan (${existing.length} currently registered -> ${COMMANDS.length} after):\n`);
  printPlan(existing, COMMANDS);

  if (cli.dryRun) {
    console.log('\nDry run — nothing written. Re-run without --dry-run to register.');
    return;
  }

  console.log(`\nPUT ${scopePath}`);
  const result = await discord<RegisteredCommand[]>(botToken, scopePath, {
    method: 'PUT',
    body: JSON.stringify(COMMANDS),
  });

  console.log(`\nRegistered ${result.length} command(s) to ${scopeLabel}:`);
  for (const command of result) console.log(`  /${command.name}  (id ${command.id})`);
  console.log(
    cli.global
      ? '\nGlobal commands may take up to an hour to appear in clients.'
      : '\nGuild commands are live immediately. Type / in that server to check.',
  );
}

main().catch((error: unknown) => {
  // Errors here can carry a Discord response body but never a token — the
  // token only ever exists in a request header.
  console.error(`\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
