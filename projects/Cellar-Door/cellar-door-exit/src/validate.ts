/**
 * cellar-door-exit — Schema Validation
 */

import { ExitType, ExitStatus, EXIT_CONTEXT_V1, EXIT_SPEC_VERSION } from "./types.js";
import type { ExitMarker } from "./types.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const ISO_8601_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
const DID_KEY_RE = /^did:key:z[1-9A-HJ-NP-Za-km-z]+$/;

function isValidISO8601(s: string): boolean {
  return ISO_8601_RE.test(s) && !isNaN(Date.parse(s));
}

function isValidDid(s: string): boolean {
  return DID_KEY_RE.test(s) || s.startsWith("did:");
}

/**
 * Validate an ExitMarker against the schema.
 *
 * Checks all 7 required fields, proof structure, DID formats, emergency justification
 * requirements, legal hold structure, and optional module structures.
 *
 * @param marker - The object to validate (typically parsed from JSON).
 * @returns A {@link ValidationResult} with `valid` boolean and array of `errors`.
 *
 * @example
 * ```ts
 * const result = validateMarker(parsedJson);
 * if (!result.valid) {
 *   console.error("Validation errors:", result.errors);
 * }
 * ```
 */
export function validateMarker(marker: unknown): ValidationResult {
  const errors: string[] = [];
  const m = marker as Record<string, unknown>;

  if (!m || typeof m !== "object") {
    return { valid: false, errors: ["Marker must be an object"] };
  }

  // @context
  if (m["@context"] !== EXIT_CONTEXT_V1) {
    errors.push(`Invalid @context: expected "${EXIT_CONTEXT_V1}"`);
  }

  // specVersion
  if (typeof m.specVersion !== "string" || !m.specVersion) {
    errors.push("Missing or invalid required field: specVersion");
  } else if (m.specVersion !== EXIT_SPEC_VERSION) {
    errors.push(`Unsupported specVersion: expected "${EXIT_SPEC_VERSION}", got "${m.specVersion}"`);
  }

  // 7 required fields
  if (typeof m.id !== "string" || !m.id) {
    errors.push("Missing or invalid required field: id");
  }

  if (typeof m.subject !== "string" || !m.subject) {
    errors.push("Missing or invalid required field: subject");
  }

  if (typeof m.origin !== "string" || !m.origin) {
    errors.push("Missing or invalid required field: origin");
  }

  if (typeof m.timestamp !== "string" || !m.timestamp) {
    errors.push("Missing or invalid required field: timestamp");
  } else if (!isValidISO8601(m.timestamp as string)) {
    errors.push("Invalid timestamp: must be ISO-8601 format");
  }

  if (!Object.values(ExitType).includes(m.exitType as ExitType)) {
    errors.push(`Invalid exitType: must be one of ${Object.values(ExitType).join(", ")}`);
  }

  if (!Object.values(ExitStatus).includes(m.status as ExitStatus)) {
    errors.push(`Invalid status: must be one of ${Object.values(ExitStatus).join(", ")}`);
  }

  // proof
  if (!m.proof || typeof m.proof !== "object") {
    errors.push("Missing or invalid required field: proof");
  } else {
    const p = m.proof as Record<string, unknown>;
    if (typeof p.type !== "string" || !p.type) errors.push("Proof missing type");
    if (typeof p.proofValue !== "string") errors.push("Proof missing proofValue");
    if (typeof p.verificationMethod !== "string") errors.push("Proof missing verificationMethod");
  }

  // Validate DID formats where applicable
  if (typeof m.subject === "string" && m.subject.startsWith("did:") && !isValidDid(m.subject)) {
    errors.push("Invalid subject DID format");
  }

  // emergencyJustification required for emergency exits
  if (m.exitType === ExitType.Emergency) {
    if (typeof m.emergencyJustification !== "string" || !m.emergencyJustification) {
      errors.push("emergencyJustification is required when exitType is 'emergency'");
    }
  }

  // Validate legalHold structure if present
  if (m.legalHold !== undefined) {
    if (typeof m.legalHold !== "object" || m.legalHold === null) {
      errors.push("legalHold must be an object");
    } else {
      const lh = m.legalHold as Record<string, unknown>;
      if (typeof lh.holdType !== "string" || !lh.holdType) errors.push("legalHold.holdType is required");
      if (typeof lh.authority !== "string" || !lh.authority) errors.push("legalHold.authority is required");
      if (typeof lh.reference !== "string" || !lh.reference) errors.push("legalHold.reference is required");
      if (typeof lh.dateIssued !== "string" || !lh.dateIssued) {
        errors.push("legalHold.dateIssued is required");
      } else if (!isValidISO8601(lh.dateIssued as string)) {
        errors.push("legalHold.dateIssued must be ISO-8601 format");
      }
      if (typeof lh.acknowledged !== "boolean") errors.push("legalHold.acknowledged must be a boolean");
    }
  }

  // Warn (not error) if expires is missing — backward compat (§8.5)
  if (m.expires !== undefined) {
    if (typeof m.expires !== "string" || !isValidISO8601(m.expires as string)) {
      errors.push("expires must be a valid ISO-8601 date string");
    }
  }
  // Note: missing `expires` is non-compliant per §8.5 but treated as a warning
  // for backward compatibility. Implementations SHOULD auto-populate defaults.

  // Validate sequenceNumber if present
  if (m.sequenceNumber !== undefined) {
    if (typeof m.sequenceNumber !== "number" || !Number.isInteger(m.sequenceNumber) || m.sequenceNumber < 0) {
      errors.push("sequenceNumber must be a non-negative integer");
    }
  }

  // Validate v1.1 optional fields
  if (m.completenessAttestation !== undefined) {
    if (typeof m.completenessAttestation !== "object" || m.completenessAttestation === null) {
      errors.push("completenessAttestation must be an object");
    }
  }

  if (m.disputeExpiry !== undefined) {
    if (typeof m.disputeExpiry !== "string" || !isValidISO8601(m.disputeExpiry as string)) {
      errors.push("disputeExpiry must be a valid ISO-8601 date string");
    }
  }

  if (m.resolution !== undefined) {
    if (typeof m.resolution !== "string" || !m.resolution) {
      errors.push("resolution must be a non-empty string");
    }
  }

  if (m.arbiterDid !== undefined) {
    if (typeof m.arbiterDid !== "string" || !m.arbiterDid.startsWith("did:")) {
      errors.push("arbiterDid must be a string starting with \"did:\"");
    }
  }

  // Validate optional modules if present
  if (m.lineage !== undefined && (typeof m.lineage !== "object" || m.lineage === null)) {
    errors.push("Module A (lineage) must be an object");
  }
  if (m.stateSnapshot !== undefined) {
    const ss = m.stateSnapshot as Record<string, unknown>;
    if (typeof ss !== "object" || ss === null) {
      errors.push("Module B (stateSnapshot) must be an object");
    } else if (typeof ss.stateHash !== "string" || !ss.stateHash) {
      errors.push("Module B (stateSnapshot) requires stateHash");
    }
  }

  // Validate trustEnhancers if present (conduit-only: well-formedness, not truth)
  if (m.trustEnhancers !== undefined) {
    if (typeof m.trustEnhancers !== "object" || m.trustEnhancers === null) {
      errors.push("trustEnhancers must be an object");
    } else {
      const te = m.trustEnhancers as Record<string, unknown>;

      // Timestamps
      if (te.timestamps !== undefined) {
        if (!Array.isArray(te.timestamps)) {
          errors.push("trustEnhancers.timestamps must be an array");
        } else {
          for (let i = 0; i < te.timestamps.length; i++) {
            const ts = te.timestamps[i] as Record<string, unknown>;
            if (typeof ts.tsaUrl !== "string" || !ts.tsaUrl) {
              errors.push(`trustEnhancers.timestamps[${i}].tsaUrl is required`);
            }
            if (typeof ts.hash !== "string" || !/^[0-9a-f]{64}$/i.test(ts.hash as string)) {
              errors.push(`trustEnhancers.timestamps[${i}].hash must be a 64-char hex SHA-256`);
            }
            if (typeof ts.timestamp !== "string" || !isValidISO8601(ts.timestamp as string)) {
              errors.push(`trustEnhancers.timestamps[${i}].timestamp must be ISO-8601`);
            }
            if (typeof ts.receipt !== "string" || !ts.receipt) {
              errors.push(`trustEnhancers.timestamps[${i}].receipt is required`);
            }
          }
        }
      }

      // Witnesses
      if (te.witnesses !== undefined) {
        if (!Array.isArray(te.witnesses)) {
          errors.push("trustEnhancers.witnesses must be an array");
        } else {
          for (let i = 0; i < te.witnesses.length; i++) {
            const w = te.witnesses[i] as Record<string, unknown>;
            if (typeof w.witnessDid !== "string" || !w.witnessDid) {
              errors.push(`trustEnhancers.witnesses[${i}].witnessDid is required`);
            }
            if (typeof w.attestation !== "string" || !w.attestation) {
              errors.push(`trustEnhancers.witnesses[${i}].attestation is required`);
            }
            if (typeof w.timestamp !== "string" || !isValidISO8601(w.timestamp as string)) {
              errors.push(`trustEnhancers.witnesses[${i}].timestamp must be ISO-8601`);
            }
            if (typeof w.signature !== "string" || !w.signature) {
              errors.push(`trustEnhancers.witnesses[${i}].signature is required`);
            }
            if (typeof w.signatureType !== "string" || !w.signatureType) {
              errors.push(`trustEnhancers.witnesses[${i}].signatureType is required`);
            }
          }
        }
      }

      // Identity claims
      if (te.identityClaims !== undefined) {
        if (!Array.isArray(te.identityClaims)) {
          errors.push("trustEnhancers.identityClaims must be an array");
        } else {
          for (let i = 0; i < te.identityClaims.length; i++) {
            const ic = te.identityClaims[i] as Record<string, unknown>;
            if (typeof ic.scheme !== "string" || !ic.scheme) {
              errors.push(`trustEnhancers.identityClaims[${i}].scheme is required`);
            }
            if (typeof ic.value !== "string" || !ic.value) {
              errors.push(`trustEnhancers.identityClaims[${i}].value is required`);
            }
            if (typeof ic.issuedAt !== "string" || !isValidISO8601(ic.issuedAt as string)) {
              errors.push(`trustEnhancers.identityClaims[${i}].issuedAt must be ISO-8601`);
            }
            if (ic.expiresAt !== undefined && (typeof ic.expiresAt !== "string" || !isValidISO8601(ic.expiresAt as string))) {
              errors.push(`trustEnhancers.identityClaims[${i}].expiresAt must be ISO-8601`);
            }
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
