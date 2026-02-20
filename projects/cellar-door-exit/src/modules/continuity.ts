/**
 * Module E: Memory/State Continuity — Preserve agent state across exits
 */

export type ContinuityProofType = "merkle" | "hash_chain" | "snapshot_hash" | "external_attestation";

export interface ContinuityModule {
  moduleType: "continuity";
  stateHash: string;
  memoryRef?: string;
  configHash?: string;
  continuityProofType: ContinuityProofType;
}

export interface CreateContinuityOpts {
  stateHash: string;
  memoryRef?: string;
  configHash?: string;
  continuityProofType?: ContinuityProofType;
}

/** Create a continuity module. */
export function createContinuityModule(opts: CreateContinuityOpts): ContinuityModule {
  return {
    moduleType: "continuity",
    stateHash: opts.stateHash,
    memoryRef: opts.memoryRef,
    configHash: opts.configHash,
    continuityProofType: opts.continuityProofType ?? "snapshot_hash",
  };
}
