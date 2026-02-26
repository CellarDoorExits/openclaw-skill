# Security Re-Audit Report — CellarDoorExits Public Repositories

**Procedure:** PROC-SEC-001 v1.1  
**Date:** 2026-02-26  
**Auditor:** Hawthorn (AI agent, subagent session)  
**Type:** RE-AUDIT (verifying fixes from initial audit)  

---

## Repositories Audited

| Repository | Commit | LOC (src/) | Scope |
|-----------|--------|-----------|-------|
| exit-door | `9b09e65` | ~4000 | Full 7-pass |
| entry-door | `f5e4f61` | ~600 | Full 7-pass |
| vercel-ai-sdk | `21f8378` | ~400 | Passes 4, 6 |
| langchain | `76eb73d` | ~500 | Passes 4, 6 |
| mcp-server | `75abc53` | ~300 | Passes 3, 4, 6 |
| openclaw-skill | `0490ccd` | ~100 (shell) | Pass 6 only |

---

## Re-Audit Verification Summary

These are the specific issues from the initial audit. Status of each:

| Issue | Status | Notes |
|-------|--------|-------|
| `warrenkoch@gmail.com` in files | ✅ **FIXED** | No occurrences in any tracked file across all 6 repos |
| `warrenkoch@gmail.com` in git history | ⚠️ **RESIDUAL** | 1 occurrence each in exit-door and entry-door commit messages (diff context showing the replacement). Not in file content. Acceptable — would require another force-push to erase commit message text. |
| Domain separation in exit-door | ✅ **FIXED** | `exit-marker-v1.1:`, `exit-intent-v1:`, `exit-witness-v1:` prefixes present in all signing paths |
| Domain separation in entry-door | ✅ **FIXED** | `entry-marker-v1.0:` prefix present in sign and verify paths |
| All repos have LICENSE files | ❌ **NOT FIXED** | entry-door and openclaw-skill still missing LICENSE files |
| No node_modules committed | ❌ **NOT FIXED** | langchain and vercel-ai-sdk have node_modules in the repo |
| No dist/ committed | ✅ **FIXED** | No dist/ directories in any repo |
| hono vulnerability in mcp-server | ❌ **NOT FIXED** | hono 4.12.1 (GHSA-xh87-mx6m-69f3, HIGH) still present as transitive dep via @modelcontextprotocol/sdk |
| JSON 8KB size limit | ✅ **FIXED** | Enforced in both exit-door (`validate.ts:42`) and entry-door (`validation.ts:31`) |
| Control character validation in entry-door | ✅ **FIXED** | `validation.ts:38` rejects `\x00-\x08\x0b\x0c\x0e-\x1f` in critical fields |
| Ceremony uses Signer abstraction | ✅ **FIXED** | `ceremony.ts` accepts `Signer | Uint8Array` with Signer as preferred path; `signMarkerWithSigner` available |

---

## Findings

### SUPPLY-001: Missing LICENSE file — entry-door

- **Severity:** HIGH
- **Location:** `/` (repository root)
- **Description:** entry-door has no LICENSE file. `package.json` references `"files": ["dist", "README.md", "LICENSE"]` but the file doesn't exist. This makes the package legally unusable by third parties.
- **Impact:** No license = all rights reserved by default. Downstream consumers have no legal right to use the code.
- **Recommendation:** Add an Apache-2.0 LICENSE file (consistent with other repos).

### SUPPLY-002: Missing LICENSE file — openclaw-skill

- **Severity:** HIGH
- **Location:** `/` (repository root)
- **Description:** openclaw-skill has no LICENSE file.
- **Impact:** Same as SUPPLY-001.
- **Recommendation:** Add an Apache-2.0 LICENSE file.

### SUPPLY-003: node_modules committed — langchain

- **Severity:** MEDIUM
- **Location:** `/node_modules/` (entire directory tree)
- **Description:** The langchain repo has `node_modules/` committed to git, including the full `@langchain/core` package tree. The `.gitignore` contains `node_modules` but the directory was committed before the ignore rule was added.
- **Impact:** Bloated repo, stale dependencies, potential supply chain confusion (committed deps may differ from registry versions).
- **Recommendation:** `git rm -r --cached node_modules && git commit -m "Remove committed node_modules"`

### SUPPLY-004: node_modules committed — vercel-ai-sdk

- **Severity:** MEDIUM  
- **Location:** `/node_modules/.vite/` (partial)
- **Description:** vercel-ai-sdk has partial `node_modules/` committed (`.vite/vitest/` cache and `.package-lock.json`).
- **Impact:** Minor bloat and potential cache confusion in CI.
- **Recommendation:** `git rm -r --cached node_modules && git commit -m "Remove committed node_modules"`

### SUPPLY-005: hono vulnerability in mcp-server (transitive)

- **Severity:** HIGH
- **CVSS 3.1:** 7.5 (per GHSA-xh87-mx6m-69f3)
- **CWE:** CWE-290 (Authentication Bypass by Spoofing)
- **Location:** `package-lock.json` — `hono@4.12.1` (transitive via `@modelcontextprotocol/sdk`)
- **Description:** hono 4.12.0–4.12.1 is vulnerable to IP spoofing in AWS Lambda ALB connector. This is a transitive dependency — mcp-server doesn't use hono directly.
- **Impact:** If the MCP server were deployed behind AWS ALB, IP-based access controls could be bypassed. Low practical risk since mcp-server uses stdio transport, not HTTP.
- **Recommendation:** Run `npm audit fix` to update hono to patched version. Or pin `@modelcontextprotocol/sdk` to a version that pulls a fixed hono.

### CRYPTO-001: entry-door canonicalize lacks NFC normalization

- **Severity:** MEDIUM
- **Location:** `entry-door/src/arrival.ts:8-15` (canonicalize function)
- **Description:** The entry-door `canonicalize()` function does not apply Unicode NFC normalization to strings before serialization. The exit-door version correctly does `JSON.stringify(obj.normalize("NFC"))` for strings, but entry-door just does `JSON.stringify(obj)`. This means two semantically identical strings with different Unicode representations would produce different canonical forms and different signatures.
- **Impact:** Signature verification could fail for markers containing non-ASCII characters with different normalization forms. Could also enable canonicalization collision attacks in edge cases.
- **Recommendation:** Add NFC normalization to entry-door's canonicalize:
  ```typescript
  if (typeof obj === "string") return JSON.stringify(obj.normalize("NFC"));
  ```

### CRYPTO-002: P-256 signP256 return type ambiguity

- **Severity:** LOW
- **Location:** `exit-door/src/crypto.ts:207-210`
- **Description:** `p256.sign(hash, privateKey)` from `@noble/curves` returns a `Signature` object, not a `Uint8Array`. The function signature declares `Uint8Array` return type. In practice, `@noble/curves` v1.x `Signature` objects auto-serialize to compact bytes when used in contexts expecting `Uint8Array`, but this is implicit behavior relying on the library's internal coercion.
- **Impact:** Low — works in practice, but a library update changing serialization behavior could silently break signatures.
- **Recommendation:** Explicitly call `.toCompactRawBytes()`:
  ```typescript
  return p256.sign(hash, privateKey).toCompactRawBytes();
  ```

### CRYPTO-003: entry-door hardcoded to Ed25519 only

- **Severity:** INFO
- **Location:** `entry-door/src/sign.ts`, `entry-door/src/types.ts`
- **Description:** entry-door only supports Ed25519 — no Signer abstraction, no P-256 support. The `ArrivalProof` type hardcodes `type: "Ed25519Signature2020"`.
- **Impact:** Cannot verify or sign arrival markers with P-256 keys. Limits cryptographic agility.
- **Recommendation:** Acceptable for v1.0. Track for v1.1 to add Signer abstraction parity with exit-door.

### INPUT-001: entry-door arrival.ts canonicalize missing undefined handling

- **Severity:** LOW
- **Location:** `entry-door/src/arrival.ts:8`
- **Description:** `canonicalize(undefined)` returns `"undefined"` (via `JSON.stringify(undefined)`), which is actually `undefined` (not a string). This differs from exit-door's canonicalize which explicitly handles `null | undefined`. While unlikely in practice since TypeScript types prevent undefined fields, the defensive check is missing.
- **Impact:** Minimal — TypeScript types prevent this path in normal usage.
- **Recommendation:** Add explicit undefined/null handling:
  ```typescript
  if (obj === null || obj === undefined) return JSON.stringify(obj);
  ```

### PROTOCOL-001: Ceremony signMarker Signer path has intermediate garbage sign

- **Severity:** LOW
- **Location:** `exit-door/src/ceremony.ts:145-157`
- **Description:** In `CeremonyStateMachine.signMarker()`, when a Signer is provided, the code first calls `signMarker(marker, signer.publicKey(), signer.publicKey())` (signing with the public key as if it were a private key), then immediately overwrites the result with a proper signing. The first call is wasted and will produce garbage (or throw internally). The final result is correct because it's overwritten.
- **Impact:** No security impact — the garbage signature is immediately discarded. However, this is dead code that's confusing and wasteful.
- **Recommendation:** Remove the intermediate `signMarker` call:
  ```typescript
  // Remove: this.marker = signMarker(marker, signer.publicKey(), signer.publicKey());
  ```

### PROTOCOL-002: Ceremony buildIntent async Signer not handled

- **Severity:** MEDIUM
- **Location:** `exit-door/src/ceremony.ts:107-109`
- **Description:** In `buildIntent()`, when using a Signer that returns a Promise from `.sign()`, the code assigns `undefined as never` to `sig`. The comment says "Signer.sign can be sync" but the interface allows `Promise<Uint8Array>`. An async Signer passed to `declareIntent` would produce a marker with an invalid proof.
- **Impact:** Using an async Signer (e.g., HSM-backed) with `declareIntent` silently produces a corrupt intent. The sync `signMarker` path correctly throws for async signers.
- **Recommendation:** Either throw explicitly for async signers or make `buildIntent` async:
  ```typescript
  if (result instanceof Promise) throw new Error("Async signers not supported in sync declareIntent — use async API");
  ```

### LEGAL-001: warrenkoch@gmail.com residual in git history

- **Severity:** INFO
- **Location:** Git commit messages in exit-door and entry-door
- **Description:** The email `warrenkoch@gmail.com` appears in commit messages describing its removal (e.g., "Replace warrenkoch@gmail.com with hawthornhollows@gmail.com"). It does NOT appear in any file content in HEAD. 
- **Impact:** Negligible — commit messages are metadata, not code content. The email appears only in the context of documenting its removal.
- **Recommendation:** Accept as-is. A further force-push to rewrite commit messages would be disruptive for minimal benefit. If desired, use `git filter-branch` or `git filter-repo` to sanitize.

---

## Pass-by-Pass Summary

### Pass 1: Cryptographic Implementation Review

**exit-door:** ✅ PASS with minor findings
- CSPRNG via `ed.utils.randomPrivateKey()` and `p256.utils.randomSecretKey()` ✓
- Private keys in `#privateKey` private fields, `destroy()` zeros them ✓
- Correct multicodec prefixes (0xed01, 0x8024) ✓
- Base58btc handles leading zeros ✓
- All crypto from @noble/* (audited libraries) ✓
- Domain separation on all signing paths ✓
- ZIP-215 choice documented with justification ✓
- P-256 return type issue (CRYPTO-002, LOW)

**entry-door:** ⚠️ PASS with findings
- Delegates to exit-door for primitives ✓
- Domain separation present ✓
- Missing NFC normalization (CRYPTO-001, MEDIUM)

### Pass 2: Protocol Logic Review

**exit-door:** ✅ PASS with minor findings
- Subject-key binding enforced in `verifyMarker` ✓
- Algorithm cross-check (DID multicodec vs proof.type) ✓
- ID excluded from signed content ✓
- Domain separation on all paths (marker, intent, witness) ✓
- Ceremony state machine enforces valid transitions ✓
- Emergency path from ALIVE and INTENT ✓
- Contests don't block exit (CONTESTED → FINAL) ✓
- Marker immutability (spread operator, new objects) ✓
- Content-addressed IDs (SHA-256, 256-bit) ✓
- Garbage intermediate sign in ceremony (PROTOCOL-001, LOW)
- Async signer gap in buildIntent (PROTOCOL-002, MEDIUM)

**entry-door:** ✅ PASS
- Verifies EXIT marker before creating arrival ✓
- Links via `departureRef` to EXIT marker ID ✓
- Subject continuity checked ✓

### Pass 3: Input Validation & Boundary Testing

**exit-door:** ✅ PASS
- 8KB size limit enforced ✓
- Control characters rejected ✓
- ISO 8601 validation ✓
- DID format validation ✓
- Array length caps (100 items for trust enhancers) ✓
- String length warnings ✓
- NFC normalization in canonicalize ✓

**entry-door:** ✅ PASS with findings
- 8KB size limit enforced ✓
- Control characters rejected ✓
- DID format validated ✓
- ISO 8601 validated (stricter — requires Z suffix) ✓
- Missing NFC normalization (noted in CRYPTO-001)
- Missing undefined handling in canonicalize (INPUT-001, LOW)

### Pass 4: Supply Chain & Dependency Audit

| Repo | npm audit | node_modules committed | dist committed | LICENSE |
|------|-----------|----------------------|----------------|---------|
| exit-door | ✅ Clean | ✅ No | ✅ No | ✅ Apache-2.0 |
| entry-door | N/A (peer deps) | ✅ No | ✅ No | ❌ **MISSING** |
| vercel-ai-sdk | N/A | ❌ **Partial** | ✅ No | ✅ Apache-2.0 |
| langchain | N/A | ❌ **Full tree** | ✅ No | ✅ Apache-2.0 |
| mcp-server | ❌ **1 HIGH** (hono) | ✅ No | ✅ No | ✅ Apache-2.0 |
| openclaw-skill | N/A | ✅ No | ✅ No | ❌ **MISSING** |

### Pass 5: Spec Conformance Check

**exit-door:** ✅ PASS
- All required fields validated ✓
- Ceremony states match spec ✓  
- Module schemas validated ✓
- Domain prefix documented (though spec should explicitly mention it)
- `specVersion` checked ✓

**entry-door:** ✅ PASS
- `@context` validated against `ENTRY_CONTEXT_V1` ✓
- All required fields validated ✓
- `admissionType` enum validated ✓

### Pass 6: Legal/Compliance Alignment

- LICENSE files present on 4/6 repos (entry-door, openclaw-skill missing)
- Apache-2.0 consistently used where present ✓
- No personal data in published code ✓
- Privacy considerations documented in exit-door ✓

### Pass 7: Adversarial Scenario Testing

Not executed as live test suite in this re-audit. Verified that:
- exit-door has extensive test suite (`src/__tests__/security.test.ts`, `properties.test.ts`) covering adversarial scenarios ✓
- 8KB limit rejects oversized payloads ✓
- Control character rejection tested ✓
- Array length caps tested ✓

---

## Consolidated Findings

| # | ID | Severity | Repo | Title | Status |
|---|-----|----------|------|-------|--------|
| 1 | SUPPLY-001 | HIGH | entry-door | Missing LICENSE file | OPEN |
| 2 | SUPPLY-002 | HIGH | openclaw-skill | Missing LICENSE file | OPEN |
| 3 | SUPPLY-005 | HIGH | mcp-server | hono vulnerability (transitive) | OPEN |
| 4 | CRYPTO-001 | MEDIUM | entry-door | Canonicalize lacks NFC normalization | OPEN |
| 5 | PROTOCOL-002 | MEDIUM | exit-door | Async signer silently corrupts intent | OPEN |
| 6 | SUPPLY-003 | MEDIUM | langchain | node_modules committed | OPEN |
| 7 | SUPPLY-004 | MEDIUM | vercel-ai-sdk | node_modules committed (partial) | OPEN |
| 8 | CRYPTO-002 | LOW | exit-door | P-256 sign return type ambiguity | OPEN |
| 9 | PROTOCOL-001 | LOW | exit-door | Garbage intermediate sign in ceremony | OPEN |
| 10 | INPUT-001 | LOW | entry-door | Canonicalize missing undefined handling | OPEN |
| 11 | CRYPTO-003 | INFO | entry-door | Hardcoded Ed25519 only | OPEN |
| 12 | LEGAL-001 | INFO | exit-door, entry-door | warrenkoch email in commit messages | ACCEPTED_RISK |

**Totals:** 0 CRITICAL, 3 HIGH, 4 MEDIUM, 3 LOW, 2 INFO

---

## Implementation Plan

### Immediate (HIGH — fix before release)

| # | Finding | Fix | Owner |
|---|---------|-----|-------|
| 1 | SUPPLY-001 | Add Apache-2.0 LICENSE to entry-door | Hawthorn |
| 2 | SUPPLY-002 | Add Apache-2.0 LICENSE to openclaw-skill | Hawthorn |
| 3 | SUPPLY-005 | `cd mcp-server && npm audit fix` | Hawthorn |

### Short-term (MEDIUM — fix within 30 days)

| # | Finding | Fix | Owner |
|---|---------|-----|-------|
| 4 | CRYPTO-001 | Add NFC normalization to entry-door canonicalize | Hawthorn |
| 5 | PROTOCOL-002 | Throw explicitly for async signers in buildIntent | Hawthorn |
| 6 | SUPPLY-003 | `git rm -r --cached node_modules` in langchain | Hawthorn |
| 7 | SUPPLY-004 | `git rm -r --cached node_modules` in vercel-ai-sdk | Hawthorn |

### Backlog (LOW/INFO)

| # | Finding | Fix | Target |
|---|---------|-----|--------|
| 8 | CRYPTO-002 | Use `.toCompactRawBytes()` explicitly | v0.3.0 |
| 9 | PROTOCOL-001 | Remove dead intermediate signMarker call | v0.3.0 |
| 10 | INPUT-001 | Add null/undefined guard to entry-door canonicalize | v0.2.0 |
| 11 | CRYPTO-003 | Add Signer abstraction to entry-door | v1.1 |
| 12 | LEGAL-001 | Accept — commit message metadata only | N/A |

---

## Attestation

This re-audit was conducted using procedure PROC-SEC-001 v1.1. All 6 public CellarDoorExits repositories were audited at the commits listed above. No CRITICAL findings were discovered. Three HIGH findings require attention before release (two missing LICENSE files and one transitive dependency vulnerability). The core cryptographic and protocol fixes from the initial audit have been verified as properly implemented.

**Assessed by:** Hawthorn (AI agent, subagent session)  
**Date:** 2026-02-26  
