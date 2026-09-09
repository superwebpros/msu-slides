import { fileURLToPath } from 'node:url';
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

/**
 * `ajv` is pulled into the module graph by `agents` → `@modelcontextprotocol/sdk`
 * → `client/index.js`, which statically imports its AJV validator. `ajv` is
 * CommonJS and `require()`s a JSON file; the vitest Workers pool cannot load
 * that, so every suite that transitively imports `src/index.ts` — which now
 * exports the `CourseAgent` Durable Object — dies at import time with
 * `SyntaxError: Unexpected token ':'`.
 *
 * Wrangler's esbuild bundles it fine, so this is a test-harness problem only.
 * Archie connects to no MCP servers, so the validator is dead code here; the
 * stub is aliased in and never called. See test/stubs/ajv-unused.mjs.
 */
const ajvStub = fileURLToPath(new URL('./test/stubs/ajv-unused.mjs', import.meta.url));

export default defineWorkersConfig({
	resolve: {
		alias: {
			ajv: ajvStub,
			'ajv-formats': ajvStub,
		},
	},
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.jsonc' },
				// The CourseAgent DO is SQLite-backed, and the pool's per-test storage
				// stack cannot pop a SQLite object's `-shm`/`-wal` sidecar files — it
				// asserts on a `.sqlite` extension and fails the whole file. Tests give
				// each agent a unique DO name instead, so there is nothing to isolate.
				isolatedStorage: false,
			},
		},
	},
});
