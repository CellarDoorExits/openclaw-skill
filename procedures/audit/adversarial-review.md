# Adversarial Testing Review — cellar-door-exit v0.2.0

**Audit commit:** 8f29a96  
**Procedure:** PROC-SEC-001 v1.0  
**Date:** 2026-02-26T01:13:51.460Z  
**Auditor:** Automated adversarial test suite (Pass 7)

## Summary

| Metric | Count |
|--------|-------|
| Total tests | 103 |
| Passed | 100 |
| Raw failures | 3 |
| True findings | 1 |
| False positives (test logic) | 2 |

### Failure Triage

| # | Test | Verdict | Rationale |
|---|------|---------|-----------|
| ADV-001 | extra field breaks verify | **False positive** | Adding a field changes canonical content, so signature correctly fails. This is expected behavior — signatures cover all non-proof, non-id fields. Not a bug. |
| ADV-002 | null bytes in subject pass validate | **TRUE FINDING** | `validateMarker()` does not reject null bytes (`\x00`) in string fields. While `verifyMarker()` catches this via signature mismatch, a null byte in a DID string could cause truncation in C-based systems or injection in transport layers. Validation should reject control characters. |
| ADV-003 | wrong signature passes validate | **False positive** | `validateMarker()` is schema-only validation by design — it checks structure, not cryptographic integrity. Signature verification is `verifyMarker()`'s job, which correctly rejects this. The two-layer design is intentional. |

## Findings

### ADV-002: Null Bytes Accepted in String Fields (validateMarker)

- **Severity:** Low
- **Category:** Input Validation
- **Component:** `src/validate.ts` → `validateMarker()`
- **Input:** `subject = "did\x00injected"`
- **Expected:** Rejected by schema validation
- **Actual:** Accepted as valid by `validateMarker()` (caught later by `verifyMarker()` via signature mismatch)
- **Risk:** Null bytes in DID strings could cause truncation or injection when markers are passed to C-based systems, databases, or transport layers that treat `\x00` as a string terminator. While the cryptographic layer catches this for signed markers, unsigned markers (pre-signing) or markers processed only through `validateMarker()` would pass.
- **Recommendation:** Add control character rejection to `validateMarker()` for all string fields, or at minimum for `subject`, `origin`, and `id`. Regex: `/[\x00-\x1f]/` (reject ASCII control characters).
- **Mitigating factors:** `verifyMarker()` catches this case via signature mismatch. The practical attack surface is limited to systems that call `validateMarker()` without `verifyMarker()`.

## Results by Category

### 1. Ceremony State Machine (44/44 PASS)

All 44 tests passed. The state machine correctly:
- Rejects all 33 invalid cross-state transitions
- Rejects all 7 self-transitions
- Rejects double-transitioning (snapshot twice)
- Rejects transitions from terminal state (departed)
- Rejects state skipping (alive → snapshot)
- Rejects backwards transitions (snapshot → intent)

**Verdict: STRONG** — No state machine bypass found.

### 2. Malformed Marker Inputs (41/44 PASS, 2 false positives, 1 true finding)

Key results:
- All 9 required field deletions caught by both `validateMarker()` and `verifyMarker()`
- All type confusion attacks (number/object/null/string where wrong type expected) caught
- Empty proof objects caught
- Extra fields accepted by validate (open schema, by design) but break signatures (correct)
- 1MB strings accepted — no length limits (acceptable for a library; consumers should enforce)
- Unicode edge cases (RTL override, ZWJ, combining chars) accepted in subject field — technically valid DIDs won't contain these, but no explicit rejection
- **Null bytes in strings not rejected by validateMarker** (ADV-002)

### 3. Cryptographic Adversarial Tests (7/7 PASS)

All attacks defeated:
- **Content tampering:** Single byte change → signature fails ✅
- **Subject-key binding:** Swapped verificationMethod caught ("possible attribution forgery") ✅
- **Proof swapping:** Cross-subject proof swap caught via subject-key binding ✅
- **Algorithm confusion:** Ed25519↔P-256 mismatch caught via DID multicodec cross-check ✅
- **Forged proof type:** Unknown type "RSA2048" rejected ✅

**Verdict: STRONG** — No cryptographic bypass found.

### 4. Canonicalization Adversarial Tests (8/8 PASS)

All canonicalization properties verified:
- Integer vs string correctly produces different canonical forms
- Key ordering is deterministic (sorted)
- IEEE 754 float precision preserved (0.1+0.2 ≠ 0.3)
- NFC normalization applied (NFD → NFC)
- NFKC not applied (correct per JSON-LD conventions)
- Nested key ordering handled recursively
- null vs undefined vs missing all produce distinct canonical forms

**Verdict: STRONG** — No canonicalization collision found.

## Overall Assessment

The cellar-door-exit library demonstrates **robust adversarial resistance**:

| Category | Score | Notes |
|----------|-------|-------|
| State Machine | ✅ Excellent | 44/44 invalid transitions rejected |
| Input Validation | ⚠️ Good | 1 minor gap (null bytes); all attacks caught at crypto layer |
| Cryptography | ✅ Excellent | All 7 attack vectors defeated |
| Canonicalization | ✅ Excellent | 8/8 edge cases handled correctly |

**One finding (ADV-002):** `validateMarker()` should reject control characters in string fields. Severity is Low because the cryptographic verification layer provides defense-in-depth, but explicit rejection at the validation layer is best practice.

## Observations

### Strengths
1. **State machine is strict** — all invalid transitions properly rejected
2. **Subject-key binding enforced** — verificationMethod must match subject DID
3. **Algorithm cross-check** — proof.type must match DID multicodec prefix
4. **Defense in depth** — validateMarker (schema) + verifyMarker (crypto) = two layers
5. **Canonicalization is sound** — NFC normalization, sorted keys, handles all edge cases

### Design Notes (Not Findings)
- **No field length limits** — acceptable for a library (consumers should enforce)
- **Open schema** — extra fields accepted by validation (extensibility by design)
- **Unicode in DIDs** — RTL override/ZWJ characters pass validation for non-`did:key` subjects (e.g., bare `did:` prefix match). Real `did:key` DIDs have base58btc encoding that naturally excludes these.
- **validateMarker is schema-only** — does not check signatures (by design; that's verifyMarker's job)
