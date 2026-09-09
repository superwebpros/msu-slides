/**
 * Test-only stub for `ajv` and `ajv-formats`. Aliased in by vitest.config.ts.
 *
 * `src/agent.ts` extends `Agent` from the `agents` package, whose constructor
 * builds an `MCPClientManager`. That reaches `@modelcontextprotocol/sdk/client`,
 * which statically imports `AjvJsonSchemaValidator` — so `ajv` lands in the
 * module graph of everything that imports `src/index.ts`, including the suites
 * that have nothing to do with the agent.
 *
 * `ajv` is CommonJS and does `require("./refs/data.json")`. Wrangler's esbuild
 * handles that; the vitest Workers pool does not, and the whole suite fails at
 * import time with `SyntaxError: Unexpected token ':'` before a test runs.
 *
 * Nothing here is ever called. Archie connects to no MCP servers, so the AJV
 * validator is dead code in this Worker — the `agents` SDK uses
 * `CfWorkerJsonSchemaValidator` for its own validation. If one of these ever
 * throws, an MCP client path has been added and this stub has to become a real
 * dependency rather than being widened.
 *
 * Plain `.mjs` on purpose: the pool's module fallback service serves this file
 * to workerd directly, and it will not transform a `.ts` file reached from
 * inside node_modules.
 */

const UNUSED = 'ajv is stubbed in tests — Archie connects to no MCP servers. See test/stubs/ajv-unused.mjs.';

export class Ajv {
	constructor() {
		throw new Error(UNUSED);
	}
}

export function addFormats() {
	throw new Error(UNUSED);
}

export default addFormats;
