/**
 * cellar-door-exit — Batch Operations
 *
 * Merkle tree-based batch exits for mass/coordinated departures.
 */

import { sha256 } from "@noble/hashes/sha256";
import { computeAnchorHash } from "./anchor.js";
import type { ExitMarker } from "./types.js";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hashPair(a: string, b: string): string {
  const combined = a < b ? a + b : b + a; // deterministic ordering
  return toHex(sha256(new TextEncoder().encode(combined)));
}

export interface MerkleProof {
  /** The leaf hash being proved. */
  leaf: string;
  /** Sibling hashes from leaf to root, with position indicators. */
  path: Array<{ hash: string; position: "left" | "right" }>;
  /** The Merkle root. */
  root: string;
}

export interface BatchExit {
  /** Merkle root of all marker hashes. */
  merkleRoot: string;
  /** Number of markers in the batch. */
  count: number;
  /** Timestamp of batch creation. */
  timestamp: string;
  /** Individual marker hashes (leaves). */
  leaves: string[];
}

/** Compute the Merkle root of an array of hex hash strings. */
export function computeMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) throw new Error("Cannot compute Merkle root of empty set");
  if (hashes.length === 1) return hashes[0];

  let level = [...hashes];
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        next.push(hashPair(level[i], level[i + 1]));
      } else {
        // Odd node: promote (hash with itself)
        next.push(hashPair(level[i], level[i]));
      }
    }
    level = next;
  }
  return level[0];
}

/** Compute a Merkle inclusion proof for the hash at the given index. */
export function computeMerkleProof(hashes: string[], index: number): MerkleProof {
  if (index < 0 || index >= hashes.length) {
    throw new Error(`Index ${index} out of range [0, ${hashes.length})`);
  }

  const leaf = hashes[index];
  const path: Array<{ hash: string; position: "left" | "right" }> = [];
  let level = [...hashes];
  let idx = index;

  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        next.push(hashPair(level[i], level[i + 1]));
      } else {
        next.push(hashPair(level[i], level[i]));
      }
    }

    const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    if (siblingIdx < level.length) {
      path.push({
        hash: level[siblingIdx],
        position: idx % 2 === 0 ? "right" : "left",
      });
    } else {
      // Odd: sibling is self
      path.push({
        hash: level[idx],
        position: "right",
      });
    }

    idx = Math.floor(idx / 2);
    level = next;
  }

  return { leaf, path, root: level[0] };
}

/** Verify a Merkle inclusion proof. */
export function verifyBatchMembership(
  marker: ExitMarker,
  batchRoot: string,
  proof: MerkleProof
): boolean {
  const markerHash = computeAnchorHash(marker);
  if (markerHash !== proof.leaf) return false;

  let current = proof.leaf;
  for (const step of proof.path) {
    if (step.position === "left") {
      current = hashPair(step.hash, current);
    } else {
      current = hashPair(current, step.hash);
    }
  }

  return current === batchRoot;
}

/** Create a batch exit from an array of markers. */
export function createBatchExit(markers: ExitMarker[]): BatchExit {
  if (markers.length === 0) throw new Error("Cannot create batch from empty marker set");

  const leaves = markers.map((m) => computeAnchorHash(m));
  const merkleRoot = computeMerkleRoot(leaves);

  return {
    merkleRoot,
    count: markers.length,
    timestamp: new Date().toISOString(),
    leaves,
  };
}
