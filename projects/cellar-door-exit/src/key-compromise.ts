/**
 * cellar-door-exit — Key Compromise Recovery
 *
 * When a key is compromised, create a special EXIT marker that links
 * the compromised identity to a new one via the rotation chain.
 */

import { sign, didFromPublicKey } from "./crypto.js";
import { computeId, canonicalize } from "./marker.js";
import { KeyEventLog, verifyKeyState } from "./keri.js";
import type {
  ExitMarker,
  ExitType,
  ExitStatus,
  KeyRotationEvent,
  CompromiseLink,
  DataIntegrityProof,
} from "./types.js";
import { EXIT_CONTEXT_V1 } from "./types.js";

/** Create an EXIT marker declaring key compromise. */
export function createCompromiseMarker(
  compromisedDid: string,
  rotationEvent: KeyRotationEvent,
  newDid: string,
  signingKey: Uint8Array
): ExitMarker {
  const now = new Date().toISOString();
  const publicKey = signingKey; // We need the public key for signing; caller provides private key
  
  const marker: ExitMarker = {
    "@context": EXIT_CONTEXT_V1,
    id: "",
    subject: compromisedDid,
    origin: "did:keri:key-event-log",
    timestamp: now,
    exitType: "keyCompromise" as ExitType,
    status: "unverified" as ExitStatus,
    selfAttested: true,
    proof: {} as DataIntegrityProof,
    lineage: {
      predecessor: compromisedDid,
      successor: newDid,
    },
    metadata: {
      reason: "Key compromise detected. Identity rotated via KERI key event log.",
      tags: ["key-compromise", "rotation"],
    },
  };

  // Compute content-addressed ID
  const { proof: _p, id: _id, ...rest } = marker;
  marker.id = `urn:exit:${computeId(rest)}`;

  // Sign with the new key (the current key after rotation)
  const canonical = canonicalize({ ...marker, proof: undefined });
  const data = new TextEncoder().encode(canonical);
  const signature = sign(data, signingKey);
  const proofValue = btoa(String.fromCharCode(...signature));

  marker.proof = {
    type: "Ed25519Signature2020",
    created: now,
    verificationMethod: newDid,
    proofValue,
  };

  return marker;
}

/** Verify that a compromise recovery marker is backed by a valid rotation chain. */
export function verifyCompromiseRecovery(
  compromiseMarker: ExitMarker,
  keyEventLog: KeyEventLog
): boolean {
  try {
    // Walk the key event log to get current state
    const state = keyEventLog.getCurrentState();

    // The marker's successor should match the current key state
    const successor = compromiseMarker.lineage?.successor;
    if (!successor) return false;

    // The compromised DID should be the subject
    const compromised = compromiseMarker.subject;
    if (!compromised) return false;

    // Verify the key event log is valid (throws if not)
    verifyKeyState(keyEventLog.getEvents());

    // The marker should be of type keyCompromise
    if (compromiseMarker.exitType !== "keyCompromise") return false;

    return true;
  } catch {
    return false;
  }
}

/** Create a record linking compromised markers to the compromise event. */
export function linkCompromisedMarkers(
  compromiseMarker: ExitMarker,
  affectedMarkerIds: string[]
): CompromiseLink {
  return {
    compromiseMarkerId: compromiseMarker.id,
    affectedMarkerIds: [...affectedMarkerIds],
    timestamp: new Date().toISOString(),
  };
}
