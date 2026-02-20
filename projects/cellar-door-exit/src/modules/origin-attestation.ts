/**
 * Module C: Origin Attestation — Origin's perspective on the exit
 */

import type { ExitMarker, ExitStatus } from "../types.js";
import { sign, didFromPublicKey } from "../crypto.js";
import { canonicalize } from "../marker.js";

export interface OriginAttestationModule {
  moduleType: "originAttestation";
  originStatus: ExitStatus;
  originStatement: string;
  originSignature: string;
  originDid: string;
  timestamp: string;
}

export interface CreateOriginAttestationOpts {
  originStatus: ExitStatus;
  originStatement: string;
  originSignature?: string;
  originDid?: string;
  timestamp?: string;
}

/** Create an origin attestation module. */
export function createOriginAttestation(opts: CreateOriginAttestationOpts): OriginAttestationModule {
  return {
    moduleType: "originAttestation",
    originStatus: opts.originStatus,
    originStatement: opts.originStatement,
    originSignature: opts.originSignature ?? "",
    originDid: opts.originDid ?? "",
    timestamp: opts.timestamp ?? new Date().toISOString(),
  };
}

/** Sign an attestation: origin co-signs the marker with their assessment. */
export function signAttestation(
  marker: ExitMarker,
  originPrivateKey: Uint8Array,
  originPublicKey: Uint8Array,
  status: ExitStatus,
  statement: string
): OriginAttestationModule {
  const timestamp = new Date().toISOString();
  const data = canonicalize({
    markerId: marker.id,
    subject: marker.subject,
    originStatus: status,
    originStatement: statement,
    timestamp,
  });
  const sig = sign(new TextEncoder().encode(data), originPrivateKey);

  return {
    moduleType: "originAttestation",
    originStatus: status,
    originStatement: statement,
    originSignature: btoa(String.fromCharCode(...sig)),
    originDid: didFromPublicKey(originPublicKey),
    timestamp,
  };
}
