/**
 * Module B: Reputation Receipt — Portable reputation at exit
 */

import { sign, didFromPublicKey } from "../crypto.js";
import { canonicalize } from "../marker.js";

export interface Endorsement {
  text: string;
  signer: string;
  signature: string;
  timestamp: string;
}

export interface ReputationModule {
  moduleType: "reputation";
  metrics: Record<string, number>;
  endorsements: Endorsement[];
  tenure?: string; // ISO 8601 duration
}

export interface CreateReputationOpts {
  metrics: Record<string, number>;
  endorsements?: Endorsement[];
  tenure?: string;
}

/** Create a reputation module. */
export function createReputationModule(opts: CreateReputationOpts): ReputationModule {
  return {
    moduleType: "reputation",
    metrics: opts.metrics,
    endorsements: opts.endorsements ?? [],
    tenure: opts.tenure,
  };
}

/** Sign an endorsement with a signer's key. */
export function signEndorsement(
  text: string,
  privateKey: Uint8Array,
  publicKey: Uint8Array
): Endorsement {
  const timestamp = new Date().toISOString();
  const data = canonicalize({ text, timestamp });
  const sig = sign(new TextEncoder().encode(data), privateKey);
  return {
    text,
    signer: didFromPublicKey(publicKey),
    signature: btoa(String.fromCharCode(...sig)),
    timestamp,
  };
}
