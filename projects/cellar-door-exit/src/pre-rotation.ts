/**
 * cellar-door-exit — Pre-Rotation Key Management
 *
 * The core KERI innovation: commit to your next key before you need it.
 * "I'm exiting with key A, and I've pre-committed to key B for my next identity."
 */

import { sha256 } from "@noble/hashes/sha256";
import { generateKeyPair, type KeyPair } from "./crypto.js";
import { createRotation, digestKey } from "./keri.js";
import type { KeyState, KeyRotationEvent } from "./types.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Pre-Rotation ────────────────────────────────────────────────────────────

export interface PreRotatedKeys {
  currentKeyPair: KeyPair;
  nextKeyPair: KeyPair;
  nextKeyDigest: string;
}

/** Generate current keys and commit to the next ones. */
export function generatePreRotatedKeys(): PreRotatedKeys {
  const currentKeyPair = generateKeyPair();
  const nextKeyPair = generateKeyPair();
  const nextKeyDigest = commitNextKey(nextKeyPair.publicKey);
  return { currentKeyPair, nextKeyPair, nextKeyDigest };
}

/** SHA-256 digest of the next public key (the commitment). */
export function commitNextKey(publicKey: Uint8Array): string {
  return digestKey(publicKey);
}

/** Verify that a public key matches a pre-rotation commitment. */
export function verifyNextKeyCommitment(
  publicKey: Uint8Array,
  commitment: string
): boolean {
  return digestKey(publicKey) === commitment;
}

export interface RotationResult {
  newState: KeyState;
  rotationEvent: KeyRotationEvent;
}

/** Rotate keys: transition to pre-committed next key and commit to a new next. */
export function rotateKeys(
  currentState: KeyState,
  nextKeyPair: KeyPair,
  newNextKeyDigest: string,
  signingKey: Uint8Array
): RotationResult {
  const rotationEvent = createRotation(
    currentState,
    [nextKeyPair.publicKey],
    [newNextKeyDigest],
    signingKey
  );

  const newState: KeyState = {
    ...currentState,
    currentKeys: [nextKeyPair.publicKey],
    nextKeyDigests: [newNextKeyDigest],
    sequenceNumber: currentState.sequenceNumber + 1,
  };

  return { newState, rotationEvent };
}
