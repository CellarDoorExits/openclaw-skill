# Security Audit — Implementation Plan

**Created:** 2026-02-26  
**Based on:** 7 audit reports (crypto, protocol, input, supply-chain, spec-conformance, legal, adversarial)  
**Total findings:** 30 (0 critical, 1 high, 12 medium, 17 low)

---

## Section A: Fix Now (simple, no tradeoffs)

These can be implemented immediately without design decisions.

### A1. CRYPTO-001 — Missing Domain Separation in Compromise Markers
- **Severity:** HIGH
- **File:** `src/key-compromise.ts:113-114`
- **Fix:** Import `DOMAIN_PREFIX` from `proof.ts` and prepend it to the signing data in `createCompromiseMarker`, matching what `signMarker`/`verifyMarker` do.
- **Effort:** 15 min

### A2. INPUT-011 — No Byte Length Check in `publicKeyFromDid()`
- **Severity:** MEDIUM
- **File:** `src/crypto.ts:174-183`
- **Fix:** After slicing off the 2-byte multicodec prefix, verify remaining bytes are exactly 32 (Ed25519) or 33 (P-256 compressed). Throw if wrong.
- **Effort:** 10 min

### A3. SPEC-004 / SPEC-F002 — `proof.created` Not Validated
- **Severity:** MEDIUM (spec), LOW (spec-conformance)
- **File:** `src/proof.ts` (verifyMarker)
- **Fix:** After confirming proof exists, validate `proof.created` is a valid ISO 8601 string. Import or inline the ISO 8601 regex check.
- **Effort:** 10 min

### A4. ADV-002 — Null Bytes Accepted in String Fields
- **Severity:** LOW
- **File:** `src/validate.ts` (validateMarker)
- **Fix:** Add a helper that rejects strings containing ASCII control characters (`\x00-\x1f` except maybe `\n`/`\r`/`\t`). Apply to `subject`, `origin`, `id`.
- **Effort:** 10 min

### A5. P2-04b — Non-Canonical Serialization in Dispute Resolution
- **Severity:** LOW
- **File:** `src/dispute.ts:84-86, 108-110`
- **Fix:** Replace `JSON.stringify(...)` with `canonicalize(...)` from `marker.ts` in both `resolveDispute()` and `verifyDisputeResolution()`.
- **Effort:** 10 min

### A6. P2-17a — Public State Field on CeremonyStateMachine
- **Severity:** LOW
- **File:** `src/ceremony.ts:50`
- **Fix:** Make `state` private, add a public getter. Update any external access in tests.
- **Effort:** 15 min

### A7. INPUT-017 — Unbounded Trust Enhancer Arrays
- **Severity:** LOW
- **File:** `src/proof.ts` (verifyTrustEnhancers)
- **Fix:** Add `MAX_TRUST_ENHANCER_ITEMS = 100` cap; reject arrays exceeding it.
- **Effort:** 10 min

### A8. SPEC-001 / SPEC-F005 — Domain Prefix Not Documented in Spec
- **Severity:** MEDIUM
- **File:** `specs/EXIT_SPEC_v1.1.md` §3.5
- **Fix:** Add normative note: "Implementations MUST prepend the domain separation string `exit-marker-v1.1:` to the canonical marker content before signing or verifying."
- **Effort:** 5 min

---

## Section B: Discuss/TODO (needs human input or design decision)

### B1. CRYPTO-002 — Missing Domain Separation in Trust Module (tenure attestation, commitment)
- **Severity:** MEDIUM
- **File:** `src/modules/trust.ts:96, 184`
- **Why discuss:** Adding domain prefixes (`"tenure-attestation-v1:"`, `"exit-commitment-v1:"`) changes the signing format. Any existing tenure attestations or commitments would become unverifiable. Need to decide: (a) add prefixes now (breaking), (b) add prefixes with versioned fallback, or (c) defer to v1.2.
- **Options:**
  - **(a) Add now** — Clean, but breaks any existing signed data. Pro: correct. Con: breaking.
  - **(b) Versioned fallback** — Try with prefix, fall back to without. Pro: backward compat. Con: complexity.
  - **(c) Defer** — Document as known gap. Pro: no risk. Con: remains vulnerable.

### B2. CRYPTO-003 — No Key Storage Security Guidance
- **Severity:** MEDIUM
- **Why discuss:** This is a documentation/API design decision. Options: (a) add `destroy()` to Signer, (b) document storage requirements, (c) accept opaque signing function for HSM/KMS. Warren should decide scope.

### B3. CRYPTO-004 — No Key Material Zeroing
- **Severity:** MEDIUM
- **File:** `src/signer.ts`, `src/privacy.ts`
- **Why discuss:** JS `Uint8Array.fill(0)` is best-effort, not guaranteed constant-time. Adds API surface (`destroy()`). Need to decide if the complexity is worth it given JS runtime limitations.

### B4. P2-04a — Missing Domain Separation in Ceremony Intent/Witness Signing
- **Severity:** MEDIUM
- **File:** `src/ceremony.ts:96-102, 161-164`
- **Why discuss:** Same concern as B1 — adding prefixes changes signing format. Intent and witness signatures would need to be re-generated. Likely safe to add since ceremony is ephemeral (not stored long-term).
- **Recommendation:** Likely safe to fix now, but flagging for Warren's awareness.

### B5. P2-07 — No Emergency Escape from INTENT State
- **Severity:** LOW
- **Why discuss:** Adding `CeremonyState.Final` to INTENT transitions changes the state machine. Need to decide if this is desired behavior or if going through SNAPSHOT first is acceptable for emergencies declared mid-ceremony.

### B6. INPUT-001 — No String Length Bounds
- **Severity:** MEDIUM
- **Why discuss:** Need to decide MAX_FIELD_LENGTH. 4096 bytes? 8192? Also need to decide which fields get limits and whether this is a hard error or warning.

### B7. INPUT-006 — ISO 8601 Timezone Handling
- **Severity:** MEDIUM
- **Why discuss:** Requiring trailing `Z` would reject timestamps without timezone. Could break existing markers. Need to decide backward compat strategy.

### B8. SPEC-F001 — `selfAttested` Not Validated
- **Severity:** MEDIUM
- **Why discuss:** Adding validation for `selfAttested` as boolean could reject existing markers that omit it. Need to decide: error or warning?

### B9. SPEC-F003 — `coercionLabel`/`preRotationCommitment` Not Validated
- **Severity:** MEDIUM
- **Why discuss:** Adding validation when present is low-risk, but need to confirm enum values are stable.

### B10. LEGAL-F-002 — Cross-Border Data Transfer Guidance
- **Severity:** MEDIUM
- **Why discuss:** Spec update requiring legal expertise. Warren should draft or review.

### B11. CRYPTO-005 — Verbose Verification Error Messages
- **Severity:** LOW
- **Why discuss:** Detailed errors aid debugging but help attackers. Need to decide: verbose by default with option to suppress, or generic by default with verbose opt-in?

### B12. CRYPTO-006 — Ed25519 ZIP-215 vs Strict Verification
- **Severity:** LOW
- **Why discuss:** ZIP-215 is the @noble default and is consensus-compatible. Switching to strict could reject previously-valid signatures. Document and leave as-is unless there's a specific need.

### B13. CRYPTO-007 — Raw SHA-256 KDF Without HKDF
- **Severity:** LOW
- **Why discuss:** Changing to HKDF breaks encrypted marker decryption for any existing encrypted blobs. Need migration strategy.

### B14. CRYPTO-008 — TypeScript-Only Private Field Access Control
- **Severity:** LOW
- **Why discuss:** Using `#privateKey` (ES2022) or WeakMap changes the class API surface. Minor but worth deciding on convention.

### B15. Various SPEC findings (F004, F006-F010) — Minor Validation Gaps
- **Severity:** LOW
- **Why discuss:** Each is a small validation addition. Can be batched but should confirm they won't break existing marker ingestion.

### B16. LEGAL-F-001 — FIPS Encryption Gap
- **Severity:** LOW
- **Why discuss:** Documenting the gap is easy. Providing AES-256-GCM alternative requires new code path. Warren should decide priority.
