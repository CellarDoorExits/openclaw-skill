# Input Validation & Injection Review — cellar-door-exit v0.2.0

**Audit ID:** AUDIT-INPUT-001  
**Procedure:** PROC-SEC-001 v1.0  
**Audit commit:** 8f29a96  
**Date:** 2026-02-26  
**Auditor:** Subagent (audit-pass3-input)  
**Standards:** CWE Top 25 (crypto-relevant), OWASP Input Validation

---

## Findings

### INPUT-001 — String inputs not length-bounded
**Severity:** MEDIUM  
**Status:** FAIL  
**Files:** `validate.ts` (all string checks), `marker.ts:57-60`, `claim-store.ts:134-139`  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Evidence:** `validateMarker()` checks `typeof m.subject === "string"` but never enforces maximum length. Same for `origin`, `id`, `emergencyJustification`, `resolution`, all trust enhancer strings, and claim store fields. An attacker can submit a marker with a multi-gigabyte `subject` field.

`deserializeFromTransport()` in `interop.ts:170` does enforce `MAX_PAYLOAD_SIZE = 1MB` on the transport layer, which provides partial mitigation for the middleware path. Direct API callers (`validateMarker`, `createMarker`) have no protection.

**Recommendation:** Add `MAX_FIELD_LENGTH` constant (e.g., 4096 bytes) and validate all string fields in `validateMarker()`. Add length check to `createMarker()` inputs.

---

### INPUT-002 — Unicode NFC normalization in canonicalize
**Severity:** INFO  
**Status:** PASS  
**File:** `marker.ts:99`

**Evidence:** `canonicalize()` applies `.normalize("NFC")` to all string values:
```ts
if (typeof obj === "string") return JSON.stringify(obj.normalize("NFC"));
```
This is correct and handles Unicode normalization before hashing/signing.

---

### INPUT-003 — JSON parsing uses standard library
**Severity:** INFO  
**Status:** PASS  
**Files:** `cli.ts:109` (`JSON.parse`), `interop.ts:173` (`JSON.parse`)

**Evidence:** All JSON parsing uses `JSON.parse()` from the standard library. No custom parsers, no `eval()`, no `Function()` constructors found in any source file.

---

### INPUT-004 — DID format validated before key extraction
**Severity:** LOW  
**Status:** PASS  
**Files:** `crypto.ts:167-183`, `validate.ts:19-21`

**Evidence:** `publicKeyFromDid()` checks prefix `did:key:z` before decoding. `isValidDid()` in validate.ts uses regex `/^did:key:z[1-9A-HJ-NP-Za-km-z]+$/` for did:key format. The `resolver.ts:isDid()` uses `/^did:[a-z]+:.+$/`. Both validate format before processing.

**Note:** `isValidDid()` in validate.ts has a fallback `|| s.startsWith("did:")` which is very permissive — any `did:` prefixed string passes. This is by design (supporting multiple DID methods) but could be tightened.

---

### INPUT-005 — Base64 decoding validates charset but not padding
**Severity:** LOW  
**Status:** PARTIAL PASS  
**File:** `cli.ts:50-56`

**Evidence:** `fromHexOrBase64()` uses `atob()` which will throw on invalid base64. The base58btc decoder in `crypto.ts:112` validates charset via `ALPHABET.indexOf(c)` returning -1 → throws. However, base64 padding validation relies entirely on `atob()` behavior which is permissive (accepts missing padding in some runtimes).

**Recommendation:** For cryptographic use, validate base64 charset and padding explicitly before decoding.

---

### INPUT-006 — ISO 8601 timestamps: format validated, range NOT validated
**Severity:** MEDIUM  
**Status:** FAIL  
**File:** `validate.ts:16-18`

**Evidence:**
```ts
const ISO_8601_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
function isValidISO8601(s: string): boolean {
  return ISO_8601_RE.test(s) && !isNaN(Date.parse(s));
}
```
Format is validated and `Date.parse` rejects nonsensical dates. However:
1. No range validation — accepts dates like `9999-12-31T23:59:59Z` or `0001-01-01T00:00:00Z`
2. The `Z?` makes the timezone suffix optional — accepts local times without timezone, which is ambiguous for canonicalization
3. Accepts non-UTC offsets via `Date.parse` (e.g., `2024-01-01T00:00:00+05:00` would fail regex but `2024-01-01T00:00:00` passes without Z)

**Recommendation:** Require trailing `Z` (change `Z?` to `Z`). Add reasonable range bounds (e.g., 2020–2100).

---

### INPUT-007 — No prototype pollution in object spread/merge
**Severity:** INFO  
**Status:** PASS  
**Files:** `marker.ts:93,138`, `interop.ts:173`, `claim-store.ts:110`

**Evidence:** Object spread (`{ ...marker }`) is used throughout but only on typed objects, never on raw user input merged into existing objects. `validateMarker()` casts to `Record<string, unknown>` but only reads properties, never merges. `Object.setPrototypeOf` in `errors.ts:31` is the standard pattern for custom Error subclasses — safe.

The `canonicalize()` function iterates `Object.keys()` which skips `__proto__` as an inherited property. `JSON.parse()` output also cannot contain `__proto__` as an actual prototype. No pollution vector found.

---

### INPUT-008 — CLI arguments sanitized (no shell injection)
**Severity:** INFO  
**Status:** PASS  
**File:** `cli.ts`

**Evidence:** CLI uses `commander` library for argument parsing. No `child_process.exec()`, no shell invocation, no template string interpolation into commands. File paths are passed directly to `readFileSync`/`writeFileSync`/`existsSync`. The `keygen` command writes a filename derived from DID with regex sanitization: `did.replace(/[^a-zA-Z0-9]/g, "_")` (cli.ts:246).

---

### INPUT-009 — Error messages don't leak sensitive data
**Severity:** LOW  
**Status:** PARTIAL PASS  
**File:** `cli.ts:54, cli.ts:310`

**Evidence:** The `error()` function includes system error messages (`e.message`) in suggestions. The `fromHexOrBase64()` function truncates key data in errors: `s.slice(0, 20)...`. Private keys are redacted by default in keygen output.

**Concern:** Unexpected error handler (cli.ts:166) prints full stack trace to stderr. In production, stack traces can reveal internal paths and dependency versions.

**Recommendation:** Consider suppressing stack traces in production mode or making them opt-in with `--verbose`.

---

### INPUT-010 — Type assertions are justified and safe
**Severity:** INFO  
**Status:** PASS  
**Files:** `validate.ts` (throughout), `cli.ts:109`

**Evidence:** All `as Record<string, unknown>` casts in `validate.ts` are preceded by `typeof m !== "object"` null checks. The `as ExitMarker` cast after `JSON.parse` in `readMarkerFile()` is validated downstream by `validateMarker()` or `verifyMarker()`. The `as ExitMarker` in `deserializeFromTransport()` is also safe since it passes through validation in middleware.

---

### INPUT-011 — Buffer/Uint8Array length checks before slice
**Severity:** MEDIUM  
**Status:** FAIL  
**File:** `crypto.ts:174-183`

**Evidence:** `publicKeyFromDid()` does:
```ts
const decoded = base58btcDecode(encoded);
if (decoded[0] === 0xed && decoded[1] === 0x01) {
  return decoded.slice(2);
}
```
No check that `decoded.length >= 2` before accessing `decoded[0]` and `decoded[1]`. If the base58-decoded bytes are 0 or 1 bytes long, this reads `undefined` (which won't match, so it falls through to the error). Same pattern at lines 237-244 for P-256.

Additionally, no check that the sliced key is the expected length (32 bytes for Ed25519, 33 bytes for compressed P-256). A truncated DID would return a short key that would fail at signature verification but could cause subtle bugs.

**Recommendation:** Add `decoded.length >= 34` check for Ed25519 (2 prefix + 32 key) and `decoded.length >= 35` for P-256 (2 prefix + 33 key).

---

### INPUT-012 — No eval() or Function() constructor
**Severity:** INFO  
**Status:** PASS  
**Files:** All source files in `src/`

**Evidence:** `grep -rn 'eval\|Function(' src/` returns no matches except the word "retrieval" in a comment. No dynamic code execution anywhere.

---

### INPUT-013 — No RegExp DoS (ReDoS) patterns
**Severity:** INFO  
**Status:** PASS  
**Files:** `validate.ts:16`, `validate.ts:17`, `resolver.ts:42`, `cli.ts:47`

**Evidence:** Regexes found:
- `ISO_8601_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/` — linear, anchored both ends
- `DID_KEY_RE = /^did:key:z[1-9A-HJ-NP-Za-km-z]+$/` — linear, anchored
- `/^did:[a-z]+:.+$/` — linear, anchored (`.+` is greedy but anchored)
- `/^[0-9a-fA-F]+$/` — linear, anchored
- `/^[0-9a-f]{64}$/i` — fixed length, no backtracking

No nested quantifiers, no alternation with overlapping patterns. All safe.

---

### INPUT-014 — Content-addressed IDs resist collision attacks (128-bit+)
**Severity:** INFO  
**Status:** PASS  
**File:** `marker.ts:107-112`

**Evidence:** `computeId()` uses SHA-256 (256-bit) via `@noble/hashes/sha256`. Collision resistance is 128-bit (birthday bound). The claim store ID in `claim-store.ts:163` truncates to 32 hex chars (128 bits) — at the boundary but acceptable for non-adversarial claim deduplication (not security-critical).

The anchor hash also uses SHA-256. All content-addressing meets the 128-bit minimum.

---

### INPUT-015 — Transport deserialization has size limit
**Severity:** INFO  
**Status:** PASS  
**File:** `interop.ts:168-173`

**Evidence:** `deserializeFromTransport()` checks `length > MAX_PAYLOAD_SIZE` (1MB) before allocating. Also validates buffer minimum length (4 bytes) and that buffer contains the full declared payload.

---

### INPUT-016 — Claim store query limit has default cap
**Severity:** INFO  
**Status:** PASS  
**File:** `claim-store.ts:121`

**Evidence:** `query()` defaults `limit` to 100 and applies `.slice(0, limit)`. Prevents unbounded result sets.

---

### INPUT-017 — trustEnhancers array iteration unbounded
**Severity:** LOW  
**Status:** FAIL  
**File:** `validate.ts:193-256`

**Evidence:** `validateMarker()` iterates `te.timestamps`, `te.witnesses`, and `te.identityClaims` arrays without length limits. A malicious marker could contain millions of trust enhancer entries, causing CPU exhaustion during validation.

**Recommendation:** Add maximum array length checks (e.g., 1000 entries) before iteration.

---

## Test Coverage Assessment

| Area | Test File | Coverage |
|------|-----------|----------|
| Marker creation/canon | `marker.test.ts` | ✓ Core paths |
| Crypto operations | `security.test.ts`, `signer.test.ts` | ✓ Subject-key binding, algorithm cross-check |
| Schema validation | `edge-cases.test.ts`, `properties.test.ts` | ✓ Basic validation |
| Claim store | `claim-store.test.ts` | ✓ CRUD operations |
| Trust enhancers | `trust-enhancers.test.ts` | ✓ Structure validation |
| **Input fuzzing** | — | ✗ **No adversarial input tests** |
| **Length bounds** | — | ✗ **No oversized input tests** |
| **Malformed DIDs** | — | ✗ **No truncated/malformed DID tests** |
| **Unicode edge cases** | — | ✗ **No NFC equivalence tests** |

---

## Summary Table

| # | Check | Status | Severity | File(s) |
|---|-------|--------|----------|---------|
| INPUT-001 | String inputs length-bounded | **FAIL** | MEDIUM | validate.ts, marker.ts, claim-store.ts |
| INPUT-002 | Unicode NFC normalization | PASS | — | marker.ts:99 |
| INPUT-003 | JSON parsing standard library | PASS | — | cli.ts, interop.ts |
| INPUT-004 | DID format validated | PASS | — | crypto.ts, validate.ts, resolver.ts |
| INPUT-005 | Base64 charset/padding validation | PARTIAL | LOW | cli.ts:50-56 |
| INPUT-006 | ISO 8601 format and range | **FAIL** | MEDIUM | validate.ts:16-18 |
| INPUT-007 | No prototype pollution | PASS | — | all |
| INPUT-008 | CLI argument sanitization | PASS | — | cli.ts |
| INPUT-009 | Error message data leakage | PARTIAL | LOW | cli.ts:54,166 |
| INPUT-010 | Type assertions justified | PASS | — | validate.ts, cli.ts |
| INPUT-011 | Buffer length checks before slice | **FAIL** | MEDIUM | crypto.ts:174-183 |
| INPUT-012 | No eval/Function | PASS | — | all |
| INPUT-013 | No ReDoS patterns | PASS | — | all |
| INPUT-014 | Content-addressed ID collision resistance | PASS | — | marker.ts, claim-store.ts |
| INPUT-015 | Transport size limit | PASS | — | interop.ts:168 |
| INPUT-016 | Query result limit | PASS | — | claim-store.ts:121 |
| INPUT-017 | Unbounded array iteration | **FAIL** | LOW | validate.ts:193-256 |

**Overall: 10 PASS, 3 PARTIAL/FAIL (MEDIUM), 1 FAIL (LOW)**

No critical or high-severity input validation issues found. The codebase follows good practices overall (NFC normalization, standard JSON parsing, no dynamic code execution, anchored regexes). The main gaps are missing length bounds on string inputs, missing Uint8Array length validation before slicing, and optional timezone in timestamp regex.
