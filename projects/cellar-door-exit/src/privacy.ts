/**
 * cellar-door-exit — Privacy Utilities
 *
 * Encryption, redaction, and minimal disclosure for GDPR compliance.
 * Uses @noble/ciphers (xchacha20-poly1305) + ECDH key agreement via x25519.
 */

import { sha256 } from "@noble/hashes/sha256";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { canonicalize } from "./marker.js";
import type { ExitMarker } from "./types.js";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  return bytes;
}

// ─── Encrypted Marker Blob ───────────────────────────────────────────────────

export interface EncryptedMarkerBlob {
  /** Ephemeral x25519 public key (hex) used for ECDH. */
  ephemeralPublicKey: string;
  /** XChaCha20-Poly1305 nonce (hex). */
  nonce: string;
  /** Encrypted ciphertext (hex). */
  ciphertext: string;
}

/** Encrypt a marker so only the holder of the private key can decrypt it. */
export function encryptMarker(marker: ExitMarker, recipientPublicKey: Uint8Array): EncryptedMarkerBlob {
  // Generate ephemeral x25519 keypair
  const ephemeralPrivate = randomBytes(32);
  const ephemeralPublic = x25519.getPublicKey(ephemeralPrivate);

  // ECDH shared secret → SHA-256 → symmetric key
  const shared = x25519.getSharedSecret(ephemeralPrivate, recipientPublicKey);
  const key = sha256(shared);

  // Encrypt
  const nonce = randomBytes(24);
  const plaintext = new TextEncoder().encode(JSON.stringify(marker));
  const cipher = xchacha20poly1305(key, nonce);
  const ciphertext = cipher.encrypt(plaintext);

  return {
    ephemeralPublicKey: toHex(ephemeralPublic),
    nonce: toHex(nonce),
    ciphertext: toHex(ciphertext),
  };
}

/** Decrypt an encrypted marker blob using the recipient's x25519 private key. */
export function decryptMarker(blob: EncryptedMarkerBlob, privateKey: Uint8Array): ExitMarker {
  const ephemeralPublic = fromHex(blob.ephemeralPublicKey);
  const shared = x25519.getSharedSecret(privateKey, ephemeralPublic);
  const key = sha256(shared);

  const nonce = fromHex(blob.nonce);
  const ciphertext = fromHex(blob.ciphertext);
  const cipher = xchacha20poly1305(key, nonce);
  const plaintext = cipher.decrypt(ciphertext);

  return JSON.parse(new TextDecoder().decode(plaintext)) as ExitMarker;
}

// ─── Redaction ───────────────────────────────────────────────────────────────

/** Hash a field value for redaction. */
function hashField(value: unknown): string {
  const canonical = canonicalize(value);
  const hash = sha256(new TextEncoder().encode(canonical));
  return `redacted:sha256:${toHex(hash)}`;
}

/**
 * Create a redacted marker with specified fields replaced by their hashes.
 * ZK-lite: proves fields existed without revealing content.
 */
export function redactMarker(marker: ExitMarker, fields: string[]): Record<string, unknown> {
  const result = { ...marker } as Record<string, unknown>;
  for (const field of fields) {
    if (field in result) {
      result[field] = hashField(result[field]);
    }
  }
  return result;
}

/**
 * Create a minimal disclosure: only reveal specified fields, hash everything else.
 */
export function createMinimalDisclosure(
  marker: ExitMarker,
  revealFields: string[]
): Record<string, unknown> {
  const full = marker as unknown as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(full)) {
    if (revealFields.includes(key)) {
      result[key] = full[key];
    } else {
      result[key] = hashField(full[key]);
    }
  }
  return result;
}
