/**
 * cellar-door-exit — Cryptographic Operations
 *
 * Ed25519 key generation, signing, verification, and DID encoding.
 */

import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

// ed25519 requires sha512 sync
ed.etc.sha512Sync = (...m: Uint8Array[]) => {
  const h = sha512.create();
  for (const msg of m) h.update(msg);
  return h.digest();
};

/** Ed25519 multicodec prefix: varint 0xed01 → [0xed, 0x01] */
const ED25519_MULTICODEC = new Uint8Array([0xed, 0x01]);

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

/** Generate an Ed25519 keypair. */
export function generateKeyPair(): KeyPair {
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = ed.getPublicKey(privateKey);
  return { publicKey, privateKey };
}

/** Sign data with an Ed25519 private key. */
export function sign(data: Uint8Array, privateKey: Uint8Array): Uint8Array {
  return ed.sign(data, privateKey);
}

/** Verify an Ed25519 signature. */
export function verify(
  data: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array
): boolean {
  try {
    return ed.verify(signature, data, publicKey);
  } catch {
    return false;
  }
}

/** Encode bytes to base58btc (multibase 'z' prefix). */
function base58btcEncode(bytes: Uint8Array): string {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let num = 0n;
  for (const b of bytes) num = num * 256n + BigInt(b);

  let encoded = "";
  while (num > 0n) {
    encoded = ALPHABET[Number(num % 58n)] + encoded;
    num /= 58n;
  }

  // Leading zeros
  for (const b of bytes) {
    if (b === 0) encoded = "1" + encoded;
    else break;
  }

  return encoded || "1";
}

/** Decode base58btc string to bytes. */
function base58btcDecode(str: string): Uint8Array {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let num = 0n;
  for (const c of str) {
    const idx = ALPHABET.indexOf(c);
    if (idx === -1) throw new Error(`Invalid base58 character: ${c}`);
    num = num * 58n + BigInt(idx);
  }

  // Convert bigint to bytes
  const hex = num.toString(16).padStart(2, "0");
  const paddedHex = hex.length % 2 ? "0" + hex : hex;
  const bytes: number[] = [];
  for (let i = 0; i < paddedHex.length; i += 2) {
    bytes.push(parseInt(paddedHex.slice(i, i + 2), 16));
  }

  // Leading zeros
  let leadingZeros = 0;
  for (const c of str) {
    if (c === "1") leadingZeros++;
    else break;
  }

  const result = new Uint8Array(leadingZeros + bytes.length);
  result.set(new Uint8Array(bytes), leadingZeros);
  return result;
}

/** Convert an Ed25519 public key to a did:key string (z6Mk...). */
export function didFromPublicKey(publicKey: Uint8Array): string {
  const multicodec = new Uint8Array(ED25519_MULTICODEC.length + publicKey.length);
  multicodec.set(ED25519_MULTICODEC);
  multicodec.set(publicKey, ED25519_MULTICODEC.length);
  return `did:key:z${base58btcEncode(multicodec)}`;
}

/** Extract an Ed25519 public key from a did:key string. */
export function publicKeyFromDid(did: string): Uint8Array {
  if (!did.startsWith("did:key:z")) {
    throw new Error("Invalid did:key format: must start with 'did:key:z'");
  }
  const encoded = did.slice("did:key:z".length);
  const decoded = base58btcDecode(encoded);

  if (decoded[0] !== 0xed || decoded[1] !== 0x01) {
    throw new Error("Invalid multicodec prefix: expected Ed25519 (0xed01)");
  }

  return decoded.slice(2);
}
