/**
 * Discord HTTP-interactions protocol helpers.
 *
 * Two things live here and nothing else: signature verification, and building
 * the wire payloads Discord expects. No course logic, no AI.
 *
 * Deliberately dependency-free at runtime. `discord-api-types` is available for
 * command *registration*, but the request path stays on plain literals so the
 * Worker bundle has nothing to load before it can answer Discord's 3-second
 * clock.
 */

/* ------------------------------------------------------------------ */
/* Protocol constants                                                  */
/* ------------------------------------------------------------------ */

export const DISCORD_API_BASE = 'https://discord.com/api/v10';

export const SIGNATURE_HEADER = 'X-Signature-Ed25519';
export const TIMESTAMP_HEADER = 'X-Signature-Timestamp';

/** Inbound `interaction.type`. */
export const InteractionType = {
	Ping: 1,
	ApplicationCommand: 2,
	MessageComponent: 3,
	ApplicationCommandAutocomplete: 4,
	ModalSubmit: 5,
} as const;

/** Outbound `type` on the interaction response. */
export const InteractionResponseType = {
	Pong: 1,
	ChannelMessageWithSource: 4,
	/** "Archie is thinking…" — buys 15 minutes to PATCH the real answer in. */
	DeferredChannelMessageWithSource: 5,
} as const;

/** `interaction.data.options[].type`. */
export const ApplicationCommandOptionType = {
	String: 3,
	Integer: 4,
	Boolean: 5,
} as const;

/** Only the invoking user sees the reply. Discord message flag 1 << 6. */
export const EPHEMERAL_FLAG = 1 << 6; // 64

/* ------------------------------------------------------------------ */
/* Minimal inbound payload shapes                                      */
/* ------------------------------------------------------------------ */

export interface InteractionOption {
	name: string;
	type: number;
	value?: string | number | boolean;
	options?: InteractionOption[];
}

export interface InteractionUser {
	id: string;
	username?: string;
}

/**
 * The slice of Discord's interaction payload Archie actually reads. Narrower
 * than `APIInteraction` on purpose — everything here is load-bearing.
 */
export interface Interaction {
	id: string;
	type: number;
	token: string;
	application_id?: string;
	channel_id?: string;
	channel?: { id: string };
	guild_id?: string;
	member?: { user?: InteractionUser };
	user?: InteractionUser;
	data?: {
		id?: string;
		name?: string;
		type?: number;
		options?: InteractionOption[];
	};
}

/* ------------------------------------------------------------------ */
/* Signature verification                                              */
/* ------------------------------------------------------------------ */

export interface VerificationResult {
	valid: boolean;
	/**
	 * The raw body, already consumed off the request. Callers must parse THIS
	 * rather than re-reading the request — the stream is spent, and the
	 * signature covers these exact bytes.
	 */
	body: string;
}

/**
 * Imported Ed25519 keys, cached per isolate keyed on the hex public key.
 * The key is derived entirely from configuration and is non-extractable, so
 * this is a pure memoisation, not request state.
 */
const publicKeyCache = new Map<string, Promise<CryptoKey>>();

function hexToBytes(hex: string): Uint8Array | null {
	if (hex.length === 0 || hex.length % 2 !== 0) return null;
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i++) {
		const byte = Number.parseInt(hex.substring(i * 2, i * 2 + 2), 16);
		if (Number.isNaN(byte)) return null;
		out[i] = byte;
	}
	return out;
}

export function bytesToHex(bytes: Uint8Array): string {
	let out = '';
	for (const byte of bytes) out += byte.toString(16).padStart(2, '0');
	return out;
}

function importPublicKey(publicKeyHex: string, keyBytes: Uint8Array): Promise<CryptoKey> {
	const cached = publicKeyCache.get(publicKeyHex);
	if (cached) return cached;
	const imported = crypto.subtle.importKey('raw', keyBytes, { name: 'Ed25519' }, false, ['verify']);
	publicKeyCache.set(publicKeyHex, imported);
	return imported;
}

/**
 * Validate `X-Signature-Ed25519` / `X-Signature-Timestamp` against the raw body.
 *
 * Workers has no `tweetnacl` — this uses WebCrypto's native Ed25519. The signed
 * message is `timestamp + rawBody`; parsing the JSON and re-stringifying it
 * changes the bytes and every signature fails.
 *
 * Never throws. Malformed hex, a wrong-length key, a missing header, and a
 * genuinely bad signature all come back as `valid: false` — Discord probes this
 * endpoint with deliberately-invalid requests during registration and expects a
 * clean rejection, not a 500.
 */
export async function verifyRequest(request: Request, publicKey: string): Promise<VerificationResult> {
	const signature = request.headers.get(SIGNATURE_HEADER);
	const timestamp = request.headers.get(TIMESTAMP_HEADER);
	const body = await request.text();

	if (!signature || !timestamp || !publicKey) return { valid: false, body };

	const signatureBytes = hexToBytes(signature);
	const keyBytes = hexToBytes(publicKey);
	if (!signatureBytes || signatureBytes.length !== 64) return { valid: false, body };
	if (!keyBytes || keyBytes.length !== 32) return { valid: false, body };

	try {
		const key = await importPublicKey(publicKey, keyBytes);
		const valid = await crypto.subtle.verify(
			{ name: 'Ed25519' },
			key,
			signatureBytes,
			new TextEncoder().encode(timestamp + body),
		);
		return { valid, body };
	} catch {
		// A key that fails to import is a config error, not a valid request.
		publicKeyCache.delete(publicKey);
		return { valid: false, body };
	}
}

/* ------------------------------------------------------------------ */
/* Outbound responses                                                  */
/* ------------------------------------------------------------------ */

function json(payload: unknown, status = 200): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
}

/** Discord's endpoint-validation handshake. Must answer every PING. */
export function pongResponse(): Response {
	return json({ type: InteractionResponseType.Pong });
}

/**
 * "Archie is thinking…" — the 3-second ack. Nothing slow may happen before this
 * is returned. The real answer arrives later via {@link patchDeferredReply}.
 *
 * The ephemeral flag is fixed *here*, at defer time; the follow-up PATCH cannot
 * change a public reply into a private one.
 */
export function deferredResponse(options: { ephemeral?: boolean } = {}): Response {
	const ephemeral = options.ephemeral ?? true;
	return json({
		type: InteractionResponseType.DeferredChannelMessageWithSource,
		data: ephemeral ? { flags: EPHEMERAL_FLAG } : {},
	});
}

/** Immediate visible reply. Used for input errors, not for answers. */
export function messageResponse(content: string, options: { ephemeral?: boolean } = {}): Response {
	const ephemeral = options.ephemeral ?? true;
	return json({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content,
			allowed_mentions: { parse: [] },
			...(ephemeral ? { flags: EPHEMERAL_FLAG } : {}),
		},
	});
}

/* ------------------------------------------------------------------ */
/* Follow-up (the real answer)                                         */
/* ------------------------------------------------------------------ */

export interface DeferredReplyPayload {
	content?: string;
	embeds?: unknown[];
	components?: unknown[];
	allowed_mentions?: { parse: string[] };
}

/**
 * Replace the "thinking…" placeholder with the real answer.
 *
 * Needs no bot token: the interaction token *is* the credential, and it is
 * valid for 15 minutes from the original interaction.
 *
 * Throws on a non-2xx so the caller can fall back rather than leave a student
 * staring at a permanent "thinking…".
 */
export async function patchDeferredReply(
	applicationId: string,
	interactionToken: string,
	payload: DeferredReplyPayload,
): Promise<void> {
	const url = `${DISCORD_API_BASE}/webhooks/${applicationId}/${interactionToken}/messages/@original`;
	const response = await fetch(url, {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ allowed_mentions: { parse: [] }, ...payload }),
	});

	if (!response.ok) {
		const detail = await response.text().catch(() => '');
		throw new Error(`Discord follow-up failed: ${response.status} ${detail.slice(0, 300)}`);
	}
}

/* ------------------------------------------------------------------ */
/* Option access                                                       */
/* ------------------------------------------------------------------ */

export function getStringOption(interaction: Interaction, name: string): string | undefined {
	const option = interaction.data?.options?.find((candidate) => candidate.name === name);
	return typeof option?.value === 'string' ? option.value : undefined;
}

export function getBooleanOption(interaction: Interaction, name: string): boolean | undefined {
	const option = interaction.data?.options?.find((candidate) => candidate.name === name);
	return typeof option?.value === 'boolean' ? option.value : undefined;
}

/** Discord puts the user under `member` in a guild and `user` in a DM. */
export function getInvokingUserId(interaction: Interaction): string | undefined {
	return interaction.member?.user?.id ?? interaction.user?.id;
}
