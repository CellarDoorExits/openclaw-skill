/**
 * Module A: Lineage — Agent continuity across exits
 */

import type { ExitMarker, ModuleA, ContinuityProof } from "../types.js";
import { ContinuityProofType } from "../types.js";
import { sign, didFromPublicKey } from "../crypto.js";
import { canonicalize } from "../marker.js";

export interface CreateLineageOpts {
  predecessor?: string;
  successor?: string;
  lineageChain?: string[];
  continuityProof?: ContinuityProof;
}

/** Create a lineage module. */
export function createLineageModule(opts: CreateLineageOpts): ModuleA {
  return {
    predecessor: opts.predecessor,
    successor: opts.successor,
    lineageChain: opts.lineageChain,
    continuityProof: opts.continuityProof,
  };
}

/**
 * Verify that a chain of EXIT markers forms valid lineage.
 * Each marker[i+1] should reference marker[i]'s subject as predecessor.
 */
export function verifyLineageChain(markers: ExitMarker[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (markers.length < 2) {
    return { valid: true, errors: [] };
  }

  for (let i = 1; i < markers.length; i++) {
    const prev = markers[i - 1];
    const curr = markers[i];

    if (!curr.lineage) {
      errors.push(`Marker ${i} (${curr.id}) missing lineage module`);
      continue;
    }

    if (curr.lineage.predecessor !== prev.subject) {
      errors.push(
        `Marker ${i} predecessor mismatch: expected ${prev.subject}, got ${curr.lineage.predecessor}`
      );
    }

    // If lineage chain exists, verify prev subject is in it
    if (curr.lineage.lineageChain && !curr.lineage.lineageChain.includes(prev.subject)) {
      errors.push(`Marker ${i} lineageChain does not include predecessor ${prev.subject}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Bind a successor to an existing marker by creating a key rotation proof.
 * Returns a new marker with successor info attached.
 */
export function bindSuccessor(
  marker: ExitMarker,
  successorDid: string,
  privateKey: Uint8Array,
  publicKey: Uint8Array
): ExitMarker {
  const rotationData = canonicalize({
    predecessor: marker.subject,
    successor: successorDid,
    exitMarkerId: marker.id,
  });
  const sig = sign(new TextEncoder().encode(rotationData), privateKey);
  const proofValue = btoa(String.fromCharCode(...sig));

  const lineage: ModuleA = {
    ...marker.lineage,
    successor: successorDid,
    continuityProof: {
      type: ContinuityProofType.KeyRotationBinding,
      value: proofValue,
      verificationMethod: didFromPublicKey(publicKey),
    },
  };

  return { ...marker, lineage };
}
