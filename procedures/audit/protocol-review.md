# Security Audit — Pass 2: Protocol Logic Review

**Procedure:** PROC-SEC-001 v1.0  
**Pass:** 2 — Protocol Logic (PROTOCOL)  
**Audit commit:** 8f29a96  
**Auditor:** Hawthorn (AI agent, subagent:audit-pass2-protocol)  
**Date:** 2026-02-26  
**Standards:** STRIDE threat model, attack trees  

---

## Findings

### P2-01: Subject-Key Binding Enforced

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `proof.ts:89-92` |
| **Severity** | N/A |

**Evidence:** `verifyMarker()` checks `marker.proof.verificationMethod !== marker.subject` and returns an error "Proof verificationMethod does not match marker subject — possible attribution forgery" if they differ. This enforces that only the subject's key can sign the marker.

---

### P2-02: Algorithm Cross-Check Enforced

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `proof.ts:95-99` |
| **Severity** | N/A |

**Evidence:** `verifyMarker()` calls `algorithmFromDid(marker.proof.verificationMethod)` to extract the multicodec-indicated algorithm and compares it to `algorithmFromProofType(marker.proof.type)`. Mismatch produces error "Algorithm mismatch: proof type indicates {alg} but DID uses {didAlg}". This prevents an Ed25519 DID from being paired with a P-256 proof type or vice versa.

---

### P2-03: ID Excluded from Signed Content

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `proof.ts:42` (sign), `proof.ts:103` (verify), `proof.ts:131` (signWithSigner) |
| **Severity** | N/A |

**Evidence:** All sign and verify paths destructure with `const { proof: _proof, id: _id, ...rest } = marker;` before canonicalizing. The `id` field is content-addressed (SHA-256 of the same `rest` payload), so excluding it from the signed content is correct and prevents circular dependencies.

---

### P2-04: Domain Separation Prefix in All Sign/Verify Paths

| Field | Value |
|-------|-------|
| **Result** | PASS (with caveat — see P2-04a) |
| **File:Line** | `proof.ts:5` (constant), `proof.ts:44`, `proof.ts:104`, `proof.ts:133` |
| **Severity** | N/A |

**Evidence:** The constant `DOMAIN_PREFIX = "exit-marker-v1.1:"` is prepended to all sign/verify data via `new TextEncoder().encode(DOMAIN_PREFIX + canonical)`. This prevents cross-protocol signature replay.

---

### P2-04a: Missing Domain Separation in Ceremony Intent and Witness Signing

| Field | Value |
|-------|-------|
| **Result** | FAIL |
| **File:Line** | `ceremony.ts:96-102` (buildIntent), `ceremony.ts:161-164` (witness) |
| **Severity** | Medium |

**Evidence:** `CeremonyStateMachine.buildIntent()` signs `canonicalize(intentData)` without any domain prefix. Similarly, `witness()` signs `canonicalize(rest)` without a domain prefix. This means intent signatures and witness co-signatures lack domain separation, creating a theoretical cross-protocol replay risk.

**Recommendation:** Add domain prefixes `"exit-intent-v1.1:"` and `"exit-witness-v1.1:"` to intent and witness signing paths respectively.

---

### P2-04b: Missing Domain Separation in Dispute Resolution Signing

| Field | Value |
|-------|-------|
| **Result** | FAIL |
| **File:Line** | `dispute.ts:84-86` (resolveDispute), `dispute.ts:108-110` (verifyDisputeResolution) |
| **Severity** | Low |

**Evidence:** `resolveDispute()` signs `JSON.stringify({ disputeId, outcome, summary, resolvedAt })` without domain separation. Uses `JSON.stringify` instead of `canonicalize`, which is also non-deterministic (key order depends on insertion order). `verifyDisputeResolution()` uses the same non-canonical serialization for verification, so sign/verify are consistent — but the lack of canonicalization is a latent bug if the resolution object is ever reconstructed from storage with different key order.

**Recommendation:** Use `canonicalize()` with a domain prefix `"exit-dispute-resolution-v1.1:"`.

---

### P2-05: Ceremony State Machine Enforces Valid Transitions Only

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `ceremony.ts:16-24` (TRANSITIONS), `ceremony.ts:57-63` (transition method) |
| **Severity** | N/A |

**Evidence:** The `TRANSITIONS` map is a complete, explicit whitelist of valid transitions. The private `transition()` method checks `TRANSITIONS[this.state].includes(to)` and throws `CeremonyError` on invalid transitions. The map covers all 7 `CeremonyState` enum values.

---

### P2-06: No State Can Be Skipped in Cooperative Ceremony

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `ceremony.ts:16-24` |
| **Severity** | N/A |

**Evidence:** The full cooperative path is enforced: ALIVE→INTENT→SNAPSHOT→OPEN→FINAL→DEPARTED. Each state only transitions to the next valid states. There is no way to go from INTENT directly to FINAL (must go through SNAPSHOT). SNAPSHOT can go to OPEN or FINAL (unilateral path), which is by design.

---

### P2-07: Emergency Path Available from Any Pre-Final State

| Field | Value |
|-------|-------|
| **Result** | FAIL (partial) |
| **File:Line** | `ceremony.ts:16-24` |
| **Severity** | Low |

**Evidence:** Emergency path only works from ALIVE→FINAL. If a ceremony is already in INTENT or SNAPSHOT state and an emergency arises, there is no direct transition to FINAL from INTENT. The TRANSITIONS map shows:
- `Intent → [Snapshot]` (no FINAL)
- `Snapshot → [Open, Final]` (FINAL available)
- `Open → [Contested, Final]` (FINAL available)
- `Contested → [Final]` (FINAL available)

Only INTENT state lacks a direct path to FINAL in an emergency. This means if intent has been declared and an emergency occurs, the subject must go through SNAPSHOT first.

**Recommendation:** Add `CeremonyState.Final` to the INTENT transitions to allow emergency bailout from any pre-final state.

---

### P2-08: Contests Do Not Block Exit (Non-Blocking Dispute Invariant)

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `ceremony.ts:21` (CONTESTED→FINAL), `dispute.ts:127-129` (isDisputed) |
| **Severity** | N/A |

**Evidence:** CONTESTED state transitions to FINAL — disputes do not create a dead-end. The `isDisputed()` function returns a boolean signal but never blocks any operation. The dispute module's docstring explicitly states: "Disputes never block exit — a disputed marker is still valid, just flagged." Exit proceeds regardless of dispute status.

---

### P2-09: Marker Immutability After Signing

| Field | Value |
|-------|-------|
| **Result** | PASS (structural) |
| **File:Line** | `marker.ts:133-136` (addModule), `proof.ts:36-55` (signMarker) |
| **Severity** | N/A |

**Evidence:** All mutation functions (`createMarker`, `addModule`, `signMarker`, `addCoercionLabel`, `addRightOfReply`, `applySunset`) return new objects via spread syntax (`{ ...marker, ... }`). No function mutates a marker in place. However, this is a JavaScript convention, not a hard guarantee — there is no `Object.freeze()` or readonly enforcement at runtime. The TypeScript types provide compile-time immutability for well-typed code.

**Note:** Runtime immutability could be strengthened with `Object.freeze()` on the signed marker, but this is a defense-in-depth concern, not a protocol bug.

---

### P2-10: Replay Detection via Content-Addressed IDs (128-bit+)

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `marker.ts:100-107` (computeId) |
| **Severity** | N/A |

**Evidence:** `computeId()` produces a SHA-256 hex hash (256 bits / 64 hex chars) of the canonicalized marker content (excluding proof and id). The ID format is `urn:exit:{sha256hex}`. 256 bits greatly exceeds the 128-bit minimum for collision resistance. Content-addressing means identical markers produce identical IDs, enabling deduplication and replay detection.

---

### P2-11: Trust Enhancers Are Conduit-Only

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `proof.ts:154-199` (verifyTrustEnhancers), `validate.ts:119-175` (trustEnhancers validation), `types.ts` (TrustEnhancers docstring) |
| **Severity** | N/A |

**Evidence:** `verifyTrustEnhancers()` explicitly validates only structural well-formedness (required fields present, timestamps parseable). It does NOT verify TSA receipts, witness signatures, or identity claim proofs. The types.ts docstring states: "Cellar Door acts as a CONDUIT only: it validates well-formedness of these fields but has ZERO opinion on their truth, authenticity, or legal significance." This is consistently implemented.

---

### P2-12: Confidence Scoring Weights Documented and Justified

| Field | Value |
|-------|-------|
| **Result** | N/A (not implemented in source) |
| **File:Line** | `types.ts` (ConfidenceFactors, ConfidenceScore types defined) |
| **Severity** | Informational |

**Evidence:** The `ConfidenceFactors` and `ConfidenceScore` types are defined in types.ts but no `computeConfidence()` function exists in the reviewed source files. The `full-service.ts` `departAndVerify()` computes a simple trust level (high/medium/low/none) based on signature validity and TSA receipt presence, which is a simpler system. No weighted scoring implementation found to audit.

---

### P2-13: Module Attachment Doesn't Invalidate Signatures

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `marker.ts:133-136` (addModule), `proof.ts:42-44` (sign excludes proof+id) |
| **Severity** | N/A |

**Evidence:** `addModule()` returns a new marker with the module set via spread. However, since the signature covers `{ ...marker minus proof and id }`, adding a module AFTER signing WILL invalidate the signature because the module becomes part of the signed content on re-verification. This is correct behavior — modules should be attached BEFORE signing. The sign/verify paths are consistent: both exclude only `proof` and `id`.

**Clarification:** The checklist item asks if attachment invalidates signatures — it DOES, which is the CORRECT behavior. Post-signature tampering (including module addition) is detected. This is a PASS.

---

### P2-14: Backward Compatibility for Deprecated APIs

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `passage.ts:60-120` (re-exports), `proof.ts:30` (@deprecated signMarker) |
| **Severity** | N/A |

**Evidence:** `passage.ts` re-exports all original function names as aliases alongside new Passage terminology (`createMarker` alongside `createDepartureMarker`, `signMarker` alongside `signDepartureMarker`, etc.). The deprecated `signMarker()` function still works and is marked with `@deprecated` JSDoc. The `validate.ts` treats missing `expires` as non-error for backward compatibility (comment at line ~108). `sunsetDate` is preserved alongside the newer `expires` field.

---

### P2-15: Canonicalization Is Deterministic and Injective

| Field | Value |
|-------|-------|
| **Result** | PASS (with minor caveat) |
| **File:Line** | `marker.ts:76-85` (canonicalize) |
| **Severity** | N/A |

**Evidence:** `canonicalize()` implements recursive sorted-key JSON serialization with NFC Unicode normalization for strings. Properties:
- **Deterministic:** Keys are sorted lexicographically at every level; arrays preserve order; primitives use `JSON.stringify()`.
- **Injective:** Different objects produce different canonical forms because: (a) sorted keys ensure key-order independence, (b) JSON.stringify for primitives is injective for JSON-representable values, (c) NFC normalization ensures Unicode equivalence.

**Caveat:** `canonicalize(undefined)` returns `"undefined"` via `JSON.stringify(undefined)` — but this is actually `undefined` (JSON.stringify returns undefined for undefined input). However, the null check `obj === undefined` returns `JSON.stringify(undefined)` which is the string `undefined`. This is a minor edge case that doesn't affect real marker data since markers are well-typed objects.

---

### P2-16: No Prototype Pollution in Marker Creation/Module Attachment

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `marker.ts:52-89` (createMarker), `marker.ts:133-136` (addModule), `convenience.ts:82-91` (fromJSON) |
| **Severity** | N/A |

**Evidence:** 
- `createMarker()` constructs markers from explicitly named fields, not from arbitrary user input spreading.
- `addModule()` uses `{ ...marker, [key]: module }` where `key` is typed as a union of 6 specific string literals (`ModuleKey`), preventing `__proto__` injection via the key parameter.
- `fromJSON()` uses `JSON.parse()` which does NOT create prototype-polluted objects (JSON.parse never sets `__proto__` as a prototype — it creates a plain property named `"__proto__"` on a null-prototype-derived object in modern engines).
- The `canonicalize()` function iterates `Object.keys()` which only returns own enumerable properties, so inherited properties are excluded.

---

### P2-17: State Machine Cannot Enter Invalid/Undefined States

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `ceremony.ts:16-24` (TRANSITIONS), `ceremony.ts:57-63` (transition), `types.ts` (CeremonyState enum) |
| **Severity** | N/A |

**Evidence:** 
- `CeremonyState` is a TypeScript enum with exactly 7 values.
- `TRANSITIONS` has explicit entries for all 7 states.
- The `transition()` method checks inclusion in `TRANSITIONS[this.state]` — if `this.state` were somehow an invalid value, `TRANSITIONS[this.state]` would be `undefined`, and `undefined.includes(to)` would throw, which is fail-closed behavior.
- The initial state is hardcoded to `CeremonyState.Alive`.
- `Departed` has an empty transitions array `[]`, making it terminal.
- No external code can set `state` directly (it's a public field — see P2-17a).

---

### P2-17a: State Field Is Publicly Mutable

| Field | Value |
|-------|-------|
| **Result** | FAIL |
| **File:Line** | `ceremony.ts:50` (`state: CeremonyState = CeremonyState.Alive`) |
| **Severity** | Low |

**Evidence:** The `state` field on `CeremonyStateMachine` is public, allowing external code to bypass the state machine by directly setting `ceremony.state = CeremonyState.Final`. The `transition()` method is private, but the state field it guards is not.

**Recommendation:** Make `state` a private field with a public getter, or use `readonly` with internal mutation via a private backing field.

---

### P2-18: Convenience fromJSON Input Size Limit

| Field | Value |
|-------|-------|
| **Result** | PASS |
| **File:Line** | `convenience.ts:66-67` (MAX_JSON_SIZE = 1MB) |
| **Severity** | N/A |

**Evidence:** `fromJSON()` checks `json.length > MAX_JSON_SIZE` (1,048,576 chars) before parsing. This prevents DoS via oversized JSON payloads. The limit is reasonable for EXIT markers which are ~300-500 bytes core + modules.

---

## Summary Table

| # | Check | Result | Severity | File |
|---|-------|--------|----------|------|
| P2-01 | Subject-key binding enforced | **PASS** | — | proof.ts:89-92 |
| P2-02 | Algorithm cross-check enforced | **PASS** | — | proof.ts:95-99 |
| P2-03 | ID excluded from signed content | **PASS** | — | proof.ts:42,103,131 |
| P2-04 | Domain separation in sign/verify | **PASS** | — | proof.ts:5,44,104,133 |
| P2-04a | Domain separation in intent/witness | **FAIL** | Medium | ceremony.ts:96-102,161-164 |
| P2-04b | Domain separation in dispute resolution | **FAIL** | Low | dispute.ts:84-86,108-110 |
| P2-05 | State machine enforces valid transitions | **PASS** | — | ceremony.ts:16-24,57-63 |
| P2-06 | No state skip in cooperative ceremony | **PASS** | — | ceremony.ts:16-24 |
| P2-07 | Emergency path from any pre-final state | **FAIL** | Low | ceremony.ts:16-24 |
| P2-08 | Contests don't block exit | **PASS** | — | ceremony.ts:21, dispute.ts:127 |
| P2-09 | Marker immutability after signing | **PASS** | — | marker.ts:133, proof.ts:42 |
| P2-10 | Replay detection (128-bit+ IDs) | **PASS** | — | marker.ts:100-107 |
| P2-11 | Trust enhancers conduit-only | **PASS** | — | proof.ts:154-199 |
| P2-12 | Confidence scoring weights | **N/A** | Info | types.ts (types only) |
| P2-13 | Module attachment & signatures | **PASS** | — | marker.ts:133, proof.ts:42 |
| P2-14 | Backward compatibility | **PASS** | — | passage.ts:60-120 |
| P2-15 | Canonicalization deterministic/injective | **PASS** | — | marker.ts:76-85 |
| P2-16 | No prototype pollution | **PASS** | — | marker.ts:52,133, convenience.ts:82 |
| P2-17 | No invalid/undefined states | **PASS** | — | ceremony.ts:16-24,57-63 |
| P2-17a | State field publicly mutable | **FAIL** | Low | ceremony.ts:50 |
| P2-18 | JSON input size limit | **PASS** | — | convenience.ts:66-67 |

## Totals

- **PASS:** 14
- **FAIL:** 4 (1 Medium, 3 Low)
- **N/A:** 1 (Informational)

## Overall Assessment

The protocol logic is **sound**. Core signing, verification, subject-key binding, algorithm cross-checking, state machine enforcement, and canonicalization are all correctly implemented. The four failures are defense-in-depth issues — none enable direct exploitation of the core EXIT marker flow:

1. **P2-04a (Medium):** Missing domain separation in ceremony intent and witness signatures. Most impactful — should be fixed before v1.0 stable.
2. **P2-04b (Low):** Missing domain separation + non-canonical serialization in dispute resolution signing.
3. **P2-07 (Low):** INTENT state lacks emergency escape hatch to FINAL.
4. **P2-17a (Low):** Public state field allows state machine bypass in-process.

No critical or high-severity findings.
