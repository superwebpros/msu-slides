/**
 * Shared contract for Archie.
 *
 * Every module in src/ depends on this file and nothing else of each other's
 * internals. If you need to change a type here, say so rather than widening it
 * locally — these are the seams the pieces are built against independently.
 */

export interface Env {
	// --- Secrets (wrangler secret put) ---
	DISCORD_BOT_TOKEN: string;
	DISCORD_PUBLIC_KEY: string;
	DISCORD_APPLICATION_ID: string;
	ANTHROPIC_API_KEY: string;
	OPENAI_API_KEY: string;
	QDRANT_URL: string;
	QDRANT_API_KEY: string;
	BASEROW_BASEURL: string;
	BASEROW_RESOURCE_TOKEN: string;
	/**
	 * Optional: AI Gateway root, e.g. https://gateway.ai.cloudflare.com/v1/<acct>/archie
	 * Root only — callers append `/openai`. A trailing provider segment breaks them.
	 */
	AI_GATEWAY_BASE_URL?: string;
	/**
	 * Cloudflare API token with `AI Gateway: Run`, sent as `cf-aig-authorization`.
	 * Required because the `archie` gateway has Authentication enabled. Send it
	 * ONLY alongside `AI_GATEWAY_BASE_URL` — a direct-to-provider call must never
	 * carry a Cloudflare token to OpenAI.
	 */
	CF_AIG_TOKEN?: string;
	/**
	 * Salt for hashing Discord user ids into `AskRequest.userKey`.
	 * An unsalted SHA-256 of a snowflake is trivially brute-forceable against a
	 * known member list — and a class roster is ~25 people. Rate limiting is the
	 * only consumer, but the design promises not to track students, so salt it.
	 */
	ARCHIE_USER_SALT: string;

	// --- Vars (wrangler.jsonc) ---
	ACTIVE_COURSE: string;
	QDRANT_COLLECTION: string;
	EMBEDDING_MODEL: string;
	ANSWER_MODEL: string;
	BASEROW_DOCUMENTS_TABLE_ID: string;
	COURSE_TIMEZONE: string;
	SEARCH_TOP_K: string;

	// --- Bindings ---
	COURSE_AGENT: DurableObjectNamespace;
}

/* ------------------------------------------------------------------ */
/* Course content search                                               */
/* ------------------------------------------------------------------ */

/** One retrieved transcript chunk, already scoped to the active course. */
export interface CourseChunk {
	content: string;
	score: number;
	/** Source recording filename, e.g. 2026-09-08_session-3_intro-to-skills.mp4 */
	fileName: string;
	/** Parsed from fileName where derivable, e.g. 3. Null when the name has none. */
	session: number | null;
	/** ISO date parsed from the filename prefix, e.g. 2026-09-08. Null if absent. */
	recordedOn: string | null;
	/** Semester tag from Qdrant payload, e.g. ssc-490. */
	course: string | null;
	/**
	 * Link to the source recording — `metadata.audio_file_url`, falling back to
	 * `metadata.youtube_url`. Fills `AskResult.sources[].url`; without it a
	 * citation is a bare label a student cannot follow.
	 */
	sourceUrl: string | null;
}

export type SearchOutcome =
	| { status: 'ok'; chunks: CourseChunk[] }
	/** Query succeeded, nothing matched. NOT an error — see spec. */
	| { status: 'empty' }
	/** Qdrant or the embedding call failed. Archie should say so, not confabulate. */
	| { status: 'error'; message: string };

/* ------------------------------------------------------------------ */
/* Assignments                                                         */
/* ------------------------------------------------------------------ */

/**
 * A Baserow assignment row. Fields beyond the known ones are passed through so
 * new columns (Due Date, Start Date, Deliverables) work without a code change.
 * Any Baserow field whose name begins with "_" is instructor-only and MUST be
 * stripped before it reaches this type.
 */
export interface Assignment {
	name: string;
	notes: string | null;
	documentUrl: string | null;
	/** Everything else on the row, minus underscore-prefixed fields. */
	extra: Record<string, unknown>;
}

export type AssignmentsOutcome =
	| { status: 'ok'; assignments: Assignment[] }
	/** Table genuinely has no active rows. */
	| { status: 'empty' }
	/**
	 * The Active=true filter returned nothing while the unfiltered table has rows.
	 * `Active` is false on all 431 rows across four other tables in this Baserow
	 * instance, so this is a real failure mode, not a hypothetical. Report a
	 * problem — never tell a student they have nothing due.
	 */
	| { status: 'misconfigured'; totalRows: number }
	| { status: 'error'; message: string };

/* ------------------------------------------------------------------ */
/* Agent I/O                                                           */
/* ------------------------------------------------------------------ */

/** What the Worker hands the Durable Object after acking Discord. */
export interface AskRequest {
	question: string;
	/** Discord interaction token — used to PATCH the deferred reply. */
	interactionToken: string;
	/** Opaque per-user key for rate limiting. Never sent to AI Gateway. */
	userKey: string;
	/** Channel or thread id; determines which DO instance handles this. */
	conversationId: string;
}

export interface AskResult {
	text: string;
	/** Rendered as a compact source list under the answer. */
	sources: Array<{ label: string; url?: string }>;
}
