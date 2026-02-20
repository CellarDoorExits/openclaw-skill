/**
 * cellar-door-exit — Chain Anchoring Utilities
 *
 * Prepares data for on-chain anchoring. No actual chain interaction —
 * just the minimal hash marks a ledger needs.
 */

import { sha256 } from "@noble/hashes/sha256";
import { canonicalize } from "./marker.js";
import type { ExitMarker } from "./types.js";

// ─── Types ───────────────────────────────────────────────────────────────────

/** Minimal anchor: just a hash and timestamp. The absolute bare minimum for a ledger. */
export interface MinimalAnchorRecord {
  hash: string;
  timestamp: string;
}

/** Standard anchor: hash + minimal public metadata. */
export interface AnchorRecord extends MinimalAnchorRecord {
  exitType: string;
  subjectDid: string;
}

// ─── Functions ───────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Compute a SHA-256 hash of the full marker suitable for on-chain posting. */
export function computeAnchorHash(marker: ExitMarker): string {
  const canonical = canonicalize(marker);
  return toHex(sha256(new TextEncoder().encode(canonical)));
}

/** Create a standard anchor record with minimal public metadata. */
export function createAnchorRecord(marker: ExitMarker): AnchorRecord {
  return {
    hash: computeAnchorHash(marker),
    timestamp: marker.timestamp,
    exitType: marker.exitType,
    subjectDid: marker.subject,
  };
}

/** Verify that an anchor record matches a given marker. */
export function verifyAnchorRecord(record: MinimalAnchorRecord | AnchorRecord, marker: ExitMarker): boolean {
  const computed = computeAnchorHash(marker);
  if (record.hash !== computed) return false;
  if ("exitType" in record && record.exitType !== marker.exitType) return false;
  if ("subjectDid" in record && record.subjectDid !== marker.subject) return false;
  return true;
}

/** Create the absolute bare minimum anchor: just hash + timestamp. */
export function createMinimalAnchor(marker: ExitMarker): MinimalAnchorRecord {
  return {
    hash: computeAnchorHash(marker),
    timestamp: marker.timestamp,
  };
}
