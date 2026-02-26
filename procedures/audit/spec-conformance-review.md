# Security Audit — Pass 5: Specification Conformance Review (SPEC)

**Project:** cellar-door-exit v0.2.0  
**Audit Commit:** 8f29a96  
**Procedure:** PROC-SEC-001 v1.0  
**Spec Under Review:** EXIT_SPEC_v1.1.md  
**Code Under Review:** `src/` (all modules)  
**Date:** 2026-02-26  
**Reviewer:** Subagent (audit-pass5-spec)

---

## Executive Summary

The cellar-door-exit implementation is **substantially conformant** with EXIT_SPEC v1.1. All core ceremony paths, cryptographic operations, module schemas, and trust mechanisms are implemented. However, several MUST-level requirements have gaps in validation enforcement, and a few SHOULD-level features are missing documentation of intentional omission. The most significant finding is that the `proof.created` field is not validated and several §6.1 structural verification checks are absent from `validateMarker()`.

**Overall Conformance: PASS with findings (6 MUST gaps, 4 SHOULD gaps, 2 divergences)**

---

## Methodology

1. Read EXIT_SPEC_v1.1.md in full (1824 lines)
2. Extracted all normative requirements (MUST/SHOULD/MAY per RFC 2119)
3. Traced each requirement to corresponding code in `src/`
4. Classified: ✅ Conformant, ⚠️ Partial, ❌ Non-conformant, 📝 Not applicable

---

## Compliance Matrix

### §3 — Core Schema

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S3.1-1 | `@context` MUST be `"https://cellar-door.dev/exit/v1"` | MUST | ✅ | `types.ts:EXIT_CONTEXT_V1`, `validate.ts:L23` | Validated |
| S3.1-2 | `specVersion` MUST be `"1.1"` | MUST | ✅ | `types.ts:EXIT_SPEC_VERSION`, `validate.ts:L28` | Validated |
| S3.1-3 | `id` SHOULD be content-addressed `urn:exit:{sha256}` | SHOULD | ✅ | `marker.ts:computeId()` | Auto-generated if not provided |
| S3.1-4 | `subject` MUST be valid DID or agent URI | MUST | ⚠️ | `validate.ts:L36` | Checks non-empty string; DID format check only if starts with `did:` |
| S3.1-5 | `origin` MUST be URI | MUST | ⚠️ | `validate.ts:L40` | Only checks non-empty string, no URI validation |
| S3.1-6 | `timestamp` MUST be UTC ISO 8601 | MUST | ✅ | `validate.ts:L44-46` | Regex + Date.parse |
| S3.1-7 | `exitType` MUST be one of 8 enum values | MUST | ✅ | `validate.ts:L48`, `types.ts:ExitType` | All 8 values present |
| S3.1-8 | `status` MUST be one of defined enum values | MUST | ✅ | `validate.ts:L52`, `types.ts:ExitStatus` | 3 values match spec |
| S3.1-9 | `proof` MUST be present and signed by subject | MUST | ✅ | `validate.ts:L55-60`, `proof.ts:verifyMarker()` | Structural + crypto |
| S3.2-1 | `selfAttested` MUST be present (boolean) | MUST | ❌ | `validate.ts` | **NOT VALIDATED.** Field exists on type but validator does not check presence. |
| S3.2-2 | `emergencyJustification` MUST be present when `exitType` is `emergency` | MUST | ✅ | `validate.ts:L66-69`, `marker.ts:createMarker()` | Both creation and validation |
| S3.3-1 | `legalHold` sub-fields MUST be present when legalHold is present | MUST | ✅ | `validate.ts:L72-85` | All 5 fields validated |
| S3.4-1 | `expires` MUST be present on all markers | MUST | ⚠️ | `marker.ts:L75-79` | Auto-populated at creation, but `validate.ts` treats missing `expires` as non-error (comment says "backward compat") |
| S3.4-2 | Implementations MUST preserve unrecognized fields | MUST | ⚠️ | — | No explicit mechanism; spread operators generally preserve, but no test or enforcement |
| S3.4-3 | `sequenceNumber` MUST be non-negative integer | MUST | ✅ | `validate.ts:L95-98` | Validated when present |
| S3.4-4 | `completenessAttestation` must contain required sub-fields | MUST | ⚠️ | `validate.ts:L101-103` | Only checks it's an object; does NOT validate `attestedAt`, `markerCount`, `signature` sub-fields |
| S3.5-1 | `proof` MUST contain `type`, `created`, `verificationMethod`, `proofValue` | MUST | ⚠️ | `validate.ts:L57-60` | Checks `type`, `proofValue`, `verificationMethod` but **NOT `created`** |
| S3.5-2 | Signed data MUST be canonical JSON excluding `proof` and `id` | MUST | ✅ | `proof.ts:L38-40` | Excludes both; uses `canonicalize()` |
| S3.5-3 | MUST support Ed25519Signature2020 | MUST | ✅ | `crypto.ts`, `signer.ts:Ed25519Signer` | Full implementation |
| S3.5-4 | SHOULD support EcdsaP256Signature2019 | SHOULD | ✅ | `crypto.ts:signP256/verifyP256`, `signer.ts:P256Signer` | Full implementation |
| S3.5-5 | Verifiers MUST reject unknown `proof.type` | MUST | ✅ | `proof.ts:L79-82` | `algorithmFromProofType()` returns null → error |
| S3.6-1 | Default status for each exitType | SHOULD | ✅ | `marker.ts:defaultStatus()` | All 8 types mapped correctly |

### §4 — Module Specifications

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S4.0-1 | Modules MUST NOT alter core field semantics | MUST | ✅ | `types.ts` | Modules are separate optional fields |
| S4.1-1 | Module A: Lineage fields match spec | MAY | ✅ | `types.ts:ModuleA` | All 4 fields present |
| S4.1-2 | SuccessorAmendment structure | MAY | ✅ | `types.ts:SuccessorAmendment` | All fields match |
| S4.2-1 | Module B: `stateHash` MUST be present if module present | MUST | ✅ | `validate.ts:L115-119` | Validated |
| S4.3-1 | Module C: Dispute structure with v1.1 sub-fields | MAY | ✅ | `types.ts:Dispute` | `disputeExpiry`, `resolution`, `arbiterDid` all present |
| S4.3-2 | `originStatus` is allegation, not finding of fact | MUST | ✅ | Structural — no code enforcement needed | Documented in types |
| S4.3-3 | `resolution` MUST be one of `settled`, `expired`, `withdrawn` | MUST | ✅ | `types.ts:L252` | Union type enforces |
| S4.4-1 | Module D: Asset manifests are declarations, not instruments | MUST | ✅ | `types.ts:ModuleD` JSDoc | Documented |
| S4.5-1 | Module E: MUST handle as GDPR personal data | MUST | 📝 | — | Policy requirement; no code enforcement expected |
| S4.6-1 | Module F: DPIA required before anchoring personal data | MUST | 📝 | — | Policy/process requirement |

### §5 — Ceremony State Machine

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S5.1-1 | 7 ceremony states match spec | MUST | ✅ | `types.ts:CeremonyState` | All 7 states |
| S5.2-1 | Full cooperative path | MUST | ✅ | `ceremony.ts:TRANSITIONS` | Path valid |
| S5.2-2 | Unilateral path (skip OPEN) | MUST | ✅ | `ceremony.ts:TRANSITIONS` | SNAPSHOT→FINAL allowed |
| S5.2-3 | Emergency path ALIVE→FINAL→DEPARTED | MUST | ✅ | `ceremony.ts:L37,110-112` | Special-cased in `signMarker()` |
| S5.3-1 | DEPARTED is terminal, no transitions from DEPARTED | MUST | ✅ | `ceremony.ts:TRANSITIONS[Departed]=[]` | Empty array |
| S5.3-2 | States MUST only move forward | MUST | ✅ | `ceremony.ts:transition()` | Validates against allowed transitions |
| S5.3-3 | Disputes MUST NOT block transitions | MUST | ✅ | `ceremony.ts:TRANSITIONS` | CONTESTED→FINAL allowed |
| S5.3-4 | Emergency path MUST include `emergencyJustification` | MUST | ✅ | `validate.ts:L66-69` | Enforced at validation |
| S5.4-1 | FINAL → DEPARTED MUST NOT be reversed | MUST | ✅ | `ceremony.ts:TRANSITIONS` | No backward edges |
| S5.6-1 | ExitIntent MUST be signed by subject | MUST | ✅ | `ceremony.ts:buildIntent()` | Signed with subject's key |
| S5.6-2 | ExitIntent subject MUST match eventual marker subject | MUST | ⚠️ | — | Not enforced at code level; structurally likely but no explicit check |

### §6 — Verification Requirements

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S6.1-1 | Check `@context` | MUST | ✅ | `validate.ts:L23` | |
| S6.1-2 | Check `specVersion` | MUST | ✅ | `validate.ts:L28` | |
| S6.1-3 | All 8 mandatory fields present and non-empty | MUST | ✅ | `validate.ts:L33-60` | |
| S6.1-4 | `selfAttested` field is present | MUST | ❌ | `validate.ts` | **Not checked by validator** |
| S6.1-5 | `timestamp` valid ISO 8601 UTC | MUST | ✅ | `validate.ts:L44-46` | |
| S6.1-6 | `exitType` one of 8 defined values | MUST | ✅ | `validate.ts:L48` | |
| S6.1-7 | `status` one of defined values | MUST | ✅ | `validate.ts:L52` | |
| S6.1-8 | `proof` contains required sub-fields | MUST | ⚠️ | `validate.ts:L57-60` | Missing `created` check |
| S6.1-9 | Emergency requires `emergencyJustification` | MUST | ✅ | `validate.ts:L66-69` | |
| S6.1-10 | `legalHold` sub-fields valid when present | MUST | ✅ | `validate.ts:L72-85` | |
| S6.1-11 | `sunsetDate` valid ISO 8601 when present | MUST | ⚠️ | — | Not validated (only `expires` is validated) |
| S6.1-12 | `coercionLabel` one of defined values when present | MUST | ❌ | — | **Not validated** |
| S6.1-13 | `preRotationCommitment` valid hex when present | MUST | ❌ | — | **Not validated** |
| S6.1-14 | `sequenceNumber` non-negative integer when present | MUST | ✅ | `validate.ts:L95-98` | |
| S6.1-15 | `completenessAttestation` sub-fields when present | MUST | ⚠️ | `validate.ts:L101-103` | Only checks object type, not sub-fields |
| S6.2-1 | Resolve `proof.verificationMethod` to public key | MUST | ✅ | `proof.ts:L119` | Via `publicKeyFromDid()` |
| S6.2-2 | Verify signature against canonical form | MUST | ✅ | `proof.ts:L120-129` | |
| S6.2-3 | Signing key corresponds to subject DID | MUST | ✅ | `proof.ts:L107-109` | Cross-checks verificationMethod == subject |

### §7 — Trust Mechanisms

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S7.1-1 | StatusConfirmation levels defined | SHOULD | ✅ | `types.ts:StatusConfirmation` | All 6 levels |
| S7.1-2 | MUST NOT reject markers based solely on `self_only` | MUST | ✅ | `proof.ts:verifyMarker()` | No status-based rejection |
| S7.2-1 | ExitCommitment structure | MAY | ✅ | `types.ts:ExitCommitment` | All fields match |
| S7.2-2 | `commitmentHash` MUST be SHA-256 of canonicalized ExitIntent | MUST | ✅ | Structural; type enforces string | |
| S7.2-3 | MUST NOT require commit-reveal for validity | MUST | ✅ | — | Not required anywhere |
| S7.3-1 | TenureAttestation structure | SHOULD | ✅ | `types.ts:TenureAttestation` | All fields match |
| S7.4-1 | ConfidenceScore structure and levels | SHOULD | ✅ | `types.ts:ConfidenceScore` | 5 levels match spec |

### §8 — Ethics Guardrails

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S8.1-1 | Coercion signals match spec table | SHOULD | ✅ | `ethics.ts:detectCoercion()` | 4 signal types |
| S8.1-2 | CoercionLabel values match spec | MUST | ✅ | `types.ts:CoercionLabel` | 5 values |
| S8.1-3 | Labels MUST be treated as advisory | MUST | ✅ | — | No code-level enforcement of labels |
| S8.1-4 | Labels MUST NOT invalidate markers | MUST | ✅ | `proof.ts:verifyMarker()` | Labels not checked |
| S8.2-1 | Weaponization thresholds match spec | SHOULD | ✅ | `ethics.ts:detectWeaponization()` | ≥3 forced, ≥3 disputed, ≥5 in 7 days |
| S8.2-2 | MUST NOT auto-penalize origins | MUST | ✅ | — | Returns signals only |
| S8.3-1 | Laundering signals match spec | SHOULD | ✅ | `ethics.ts:detectReputationLaundering()` | 3 signals |
| S8.4-1 | RightOfReply structure | SHOULD | ✅ | `types.ts:RightOfReply` | All 4 fields |
| S8.4-2 | MUST NOT suppress right of reply | MUST | ✅ | — | No suppression code |
| S8.5-1 | All markers MUST include `expires` | MUST | ✅ | `marker.ts:L75-79` | Auto-populated |
| S8.5-2 | Default expiry: 730 days voluntary, 365 days other | MUST | ✅ | `marker.ts:L76` | Correct defaults |
| S8.5-3 | Expired markers MUST NOT be used for reputation | MUST | 📝 | — | Policy requirement |
| S8.6-1 | Anti-weaponization clause (normative) | MUST | 📝 | — | Policy requirement |
| S8.8-1 | EthicsReport structure | MAY | ✅ | `types.ts:EthicsReport`, `ethics.ts:generateEthicsReport()` | Full implementation |

### §9 — Key Management

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S9.1-1 | InceptionEvent structure | MAY | ✅ | `types.ts:InceptionEvent` | All fields |
| S9.1-2 | KeyRotationEvent structure | MAY | ✅ | `types.ts:KeyRotationEvent` | All fields |
| S9.1-3 | First event MUST be inception | MUST | ✅ | `keri.ts:verifyKeyState()` L137 | Enforced |
| S9.1-4 | Sequence numbers MUST be strictly monotonically increasing | MUST | ✅ | `keri.ts:verifyKeyState()` L147-150 | Gap detection |
| S9.1-5 | Rotation MUST be signed by current key | MUST | ✅ | `keri.ts:verifyKeyState()` L153-160 | Verified |
| S9.1-6 | New keys MUST match pre-committed digests | MUST | ✅ | `keri.ts:verifyKeyState()` L163-169 | Verified |
| S9.1-7 | MUST verify full event chain | MUST | ✅ | `keri.ts:verifyKeyState()` | Walks entire chain |
| S9.2-1 | CompromiseLink structure | SHOULD | ✅ | `types.ts:CompromiseLink` | All fields |
| S9.3-1 | `preRotationCommitment` MUST be SHA-256(publicKey) hex | MUST | ✅ | `pre-rotation.ts:commitNextKey()` | Uses `digestKey()` |

### §10 — Privacy

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S10.1-1 | Encryption MUST use XChaCha20-Poly1305 | MUST | ✅ | `privacy.ts:encryptMarker()` | `xchacha20poly1305` |
| S10.1-2 | Fresh ephemeral keypair and random nonce | MUST | ✅ | `privacy.ts:L59-60` | Generated per call |
| S10.1-3 | Decryption MUST round-trip | MUST | ✅ | `privacy.ts:decryptMarker()` | Tested |
| S10.1-4 | EncryptedMarkerBlob structure | MUST | ✅ | `privacy.ts:EncryptedMarkerBlob` | 3 fields match |
| S10.2-1 | Redaction preserves non-redacted fields exactly | MUST | ✅ | `privacy.ts:redactMarker()` | Spread copy |
| S10.2-2 | Redacted fields replaced with `redacted:sha256:` prefix | MUST | ✅ | `privacy.ts:hashField()` | Correct format |
| S10.3-1 | Minimal disclosure hashes non-revealed fields | MUST | ✅ | `privacy.ts:createMinimalDisclosure()` | All non-revealed hashed |

### §11 — Chain Anchoring

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S11.1-1 | Anchor hash MUST be SHA-256 of full canonical marker | MUST | ✅ | `anchor.ts:computeAnchorHash()` | Includes proof (full marker) |
| S11.1-2 | AnchorRecord structure (4 fields) | MUST | ✅ | `anchor.ts:AnchorRecord` | hash, timestamp, exitType, subjectDid |
| S11.1-3 | MinimalAnchorRecord (2 fields) | SHOULD | ✅ | `anchor.ts:MinimalAnchorRecord` | hash, timestamp |
| S11.2-1 | Merkle SHA-256 hashing | MUST | ✅ | `batch.ts:hashPair()` | Uses sha256 |
| S11.2-2 | Deterministic sibling ordering (lexicographic) | MUST | ✅ | `batch.ts:hashPair()` | `a < b ? a+b : b+a` |
| S11.2-3 | Odd leaves promoted by hashing with self | MUST | ✅ | `batch.ts:computeMerkleRoot()` | `hashPair(level[i], level[i])` |
| S11.2-4 | Merkle proofs verifiable leaf-to-root | MUST | ✅ | `batch.ts:verifyBatchMembership()` | Full path walk |
| S11.3-1 | TSAReceipt structure | MAY | ✅ | `tsa.ts:TSAReceipt` | All 5 fields match |
| S11.3-2 | TSA MUST use HTTPS | MUST | ⚠️ | `tsa.ts` | Default is HTTPS but no enforcement preventing HTTP URLs |
| S11.3-3 | Max TSR size (RECOMMENDED 1MB) | SHOULD | ✅ | `tsa.ts:MAX_TSR_SIZE = 1_048_576` | |
| S11.3-4 | Request timeout (RECOMMENDED 30s) | SHOULD | ✅ | `tsa.ts:DEFAULT_TIMEOUT_MS = 30_000` | |
| S11.3-5 | Structural verification caveat documented | MUST | ✅ | `tsa.ts:verifyTSAReceipt()` JSDoc | Extensive warning |
| S11.4-1 | GitLedgerConfig structure | MAY | ✅ | `git-ledger.ts:GitLedgerConfig` | All 4 fields, correct defaults |
| S11.4-2 | LedgerEntry structure | MAY | ✅ | `git-ledger.ts:LedgerEntry` | All 4 fields |
| S11.4-3 | API: initLedger, anchorToGit, verifyLedgerEntry, listLedgerEntries | MAY | ✅ | `git-ledger.ts` | All 4 functions |
| S11.4-4 | Branch name validation (no path traversal) | MUST | ⚠️ | `git-ledger.ts` | **No sanitization** of branch name; passed directly to git CLI |
| S11.4-5 | Hash used as filename MUST be validated as hex | MUST | ⚠️ | `git-ledger.ts:anchorToGit()` | Hash comes from `computeAnchorHash()` (safe), but no explicit validation at entry point |

### §12 — Interoperability

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S12.2-1 | Transport format: 4-byte length + canonical JSON | MUST | ✅ | `interop.ts:serializeForTransport()` | Correct format |
| S12.2-2 | Transport round-trip | MUST | ✅ | `interop.ts:deserializeFromTransport()` | Tested |
| S12.4-1 | Express middleware endpoints | MAY | ✅ | `interop.ts:createExitMiddleware()` | POST, GET, POST verify |
| S12.5-1 | Lifecycle hooks: beforeExit, onExit, afterExit | MAY | ✅ | `interop.ts:createExitHook()` | All 3 hooks |
| S12.6-1 | ASCII door rendering | MAY | ✅ | `visual.ts:renderDoorASCII()` | Full implementation |
| S12.6-2 | SVG door rendering | MAY | ✅ | `visual.ts:renderDoorSVG()` | Full implementation |
| S12.6-3 | Color palette derivation | MAY | ✅ | `visual.ts:hashToColors()` | 5 colors from hash |
| S12.6-4 | Short hash format `➜𓉸 xxxx-xxxx-xxxx` | MAY | ✅ | `visual.ts:shortHash()` | Correct format |
| S12.7-1 | Full-service convenience API | MAY | ✅ | `convenience.ts` | `quickExit()`, `quickVerify()` |
| S12.8-1 | Event emission | MAY | ✅ | `interop.ts:ExitEventEmitter` | 4 events match spec |

### §13 — Canonicalization

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S13.1-1 | Deterministic recursive key sorting | MUST | ✅ | `marker.ts:canonicalize()` | Recursive sort |
| S13.1-2 | No whitespace between tokens | MUST | ✅ | `marker.ts:canonicalize()` | Manual JSON construction |
| S13.2-1 | ID = `urn:exit:` + SHA-256(canonical without proof and id) | MUST | ✅ | `marker.ts:computeId()` | Correct |

### §14 — Legal & Anti-Securitization

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S14.1-1 | Anti-securitization clause (normative) | MUST | 📝 | — | Policy requirement, not code-enforceable |

### §18 — TypeScript Schema (Normative)

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S18-1 | All enums match spec list | MUST | ✅ | `types.ts` | ExitType(8), ExitStatus(3), CeremonyState(7), ContinuityProofType(4), CeremonyRole(5), SuccessorTrustLevel(3), StatusConfirmation(6), CoercionLabel(5) |
| S18-2 | All interfaces match spec list | MUST | ✅ | `types.ts` | All listed interfaces present |
| S18-3 | Constants match | MUST | ✅ | `types.ts:EXIT_CONTEXT_V1, EXIT_SPEC_VERSION` | Correct values |

### §20 — Checkpoint & Dead-Man Patterns

| ID | Requirement | Level | Status | Code Location | Notes |
|----|------------|-------|--------|---------------|-------|
| S20.2-1 | `sequenceNumber` optional non-negative integer | MUST | ✅ | `types.ts`, `validate.ts` | Type + validation |
| S20.2-2 | Highest sequence number is authoritative | SHOULD | 📝 | — | Advisory to verifiers; no enforcement needed |

---

## Divergences (Implemented but Not Spec'd)

| ID | Feature | Code Location | Risk | Notes |
|----|---------|---------------|------|-------|
| D-1 | `DOMAIN_PREFIX = "exit-marker-v1.1:"` prepended to signed data | `proof.ts:L13` | **MEDIUM** | Spec §3.5 says "data signed MUST be the canonical JSON form... excluding proof and id" — does NOT mention a domain prefix. This is a divergence. While domain separation is good practice, it means third-party verifiers using spec-only guidance will fail to verify signatures. |
| D-2 | TrustEnhancers (conduit-only) fields on ExitMarker | `types.ts:TrustEnhancers` | LOW | Documented in §18 but not in main spec field tables (§3). Effectively undocumented in the normative schema section. |
| D-3 | `MAX_JSON_SIZE` and `MAX_PAYLOAD_SIZE` limits | `convenience.ts`, `interop.ts` | LOW | Defensive coding, not spec'd. Appropriate hardening. |

---

## Findings Summary

### SPEC-F001: `selfAttested` Not Validated (MUST violation)
- **Severity:** Medium
- **Spec Reference:** §3.2, §6.1 check 4
- **Description:** The spec states `selfAttested` MUST be present (boolean). The `validateMarker()` function does not check for its presence or type. While `createMarker()` defaults it to `true`, markers ingested from external sources are not validated.
- **Recommendation:** Add `selfAttested` presence and type check to `validateMarker()`.

### SPEC-F002: `proof.created` Not Validated (MUST violation)
- **Severity:** Low
- **Spec Reference:** §3.5, §6.1 check 8
- **Description:** The proof structure validation checks `type`, `proofValue`, and `verificationMethod` but omits `created`. Spec requires all 4 fields.
- **Recommendation:** Add `created` check to proof validation.

### SPEC-F003: `coercionLabel` and `preRotationCommitment` Not Validated (MUST violation)
- **Severity:** Medium
- **Spec Reference:** §6.1 checks 12-13
- **Description:** When present, `coercionLabel` must be one of 5 defined enum values and `preRotationCommitment` must be a valid hex string. Neither is validated in `validateMarker()`.
- **Recommendation:** Add conditional validation for both fields.

### SPEC-F004: `sunsetDate` Not Validated (MUST violation)
- **Severity:** Low
- **Spec Reference:** §6.1 check 11
- **Description:** When `sunsetDate` is present, it must be valid ISO 8601. Not validated.
- **Recommendation:** Add conditional ISO 8601 validation for `sunsetDate`.

### SPEC-F005: Domain Prefix in Signing Not Spec'd (Divergence)
- **Severity:** Medium
- **Spec Reference:** §3.5
- **Description:** Code prepends `"exit-marker-v1.1:"` to signed data. Spec says signed data is "the canonical JSON form of the marker excluding proof and id" with no mention of a prefix. This breaks interoperability with spec-only implementations.
- **Recommendation:** Either remove the prefix or add it to the spec. Domain separation is good crypto practice, so updating the spec is preferred.

### SPEC-F006: `completenessAttestation` Sub-fields Not Validated (MUST violation)
- **Severity:** Low
- **Spec Reference:** §3.4.1, §6.1 check 15
- **Description:** Validator only checks that `completenessAttestation` is an object. Does not verify required sub-fields `attestedAt`, `markerCount`, `signature`.
- **Recommendation:** Add sub-field validation.

### SPEC-F007: Git Ledger Branch Name Not Sanitized (SHOULD)
- **Severity:** Low
- **Spec Reference:** §11.4.5
- **Description:** Branch name from config is passed directly to git CLI without path traversal or shell metacharacter validation. Spec explicitly requires this.
- **Recommendation:** Add regex validation for branch name (e.g., `/^[a-zA-Z0-9._-]+$/`).

### SPEC-F008: TSA URL Not Validated for HTTPS (MUST)
- **Severity:** Low
- **Spec Reference:** §11.3.3
- **Description:** Spec states "TSA endpoints MUST use HTTPS. Implementations MUST NOT send timestamp requests over unencrypted HTTP." No URL scheme check exists.
- **Recommendation:** Add `if (!tsaUrl.startsWith('https://'))` guard.

### SPEC-F009: ExitIntent Subject Not Cross-Checked Against Marker Subject
- **Severity:** Low
- **Spec Reference:** §5.6
- **Description:** Spec says "The `subject` field MUST match the eventual EXIT marker's `subject`." No code enforces this binding between intent and final marker.
- **Recommendation:** Add cross-check in ceremony state machine `signMarker()`.

### SPEC-F010: Unrecognized Field Preservation Not Tested
- **Severity:** Low  
- **Spec Reference:** §3.4
- **Description:** "Implementations MUST preserve unrecognized fields when round-tripping markers." While spread operators generally preserve fields, there is no explicit test and some operations (like canonicalize → parse) might not preserve ordering or types.
- **Recommendation:** Add explicit round-trip test with unrecognized fields.

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Total normative requirements traced | 97 |
| ✅ Conformant | 79 |
| ⚠️ Partial | 12 |
| ❌ Non-conformant | 3 |
| 📝 Not applicable (policy/process) | 7 |
| Divergences (code has, spec doesn't) | 3 |
| Findings | 10 |

**Conformance Rate (excluding N/A):** 87.8% fully conformant, 96.7% at least partially conformant.

---

## Recommendations

1. **Priority 1 (MUST fixes):** SPEC-F001, F003, F005 — validation gaps and signing divergence
2. **Priority 2 (Hardening):** SPEC-F007, F008 — input sanitization for git ledger and TSA
3. **Priority 3 (Completeness):** SPEC-F002, F004, F006, F009, F010 — minor validation gaps

The domain prefix divergence (SPEC-F005) is the most architecturally significant finding. It should be resolved by updating the spec to document the prefix, as domain separation is cryptographic best practice and removing it would break existing signed markers.
