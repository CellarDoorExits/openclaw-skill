# Security Audit Report — CellarDoorExits Public Repositories

**Procedure:** PROC-SEC-001 v1.1  
**Audit Date:** 2026-02-26  
**Auditor:** Hawthorn (AI agent, subagent instance)  
**Scope:** All 6 public GitHub repositories under CellarDoorExits  

---

## Repositories Audited

| Repository | Commit | Version | LOC (approx) |
|-----------|--------|---------|--------------|
| exit-door | `d1aa84c` | 0.2.0 | ~7,500 TS |
| entry-door | `78118c5` | 0.1.0 | ~2,500 TS |
| vercel-ai-sdk | `e9c6644` | 0.1.0 | ~800 TS |
| langchain | `bb7281c` | 0.1.0 | ~900 TS |
| mcp-server | `e0f1e4b` | 0.1.0 | ~400 TS |
| openclaw-skill | `efd353d` | 0.1.0 | ~100 (shell scripts + docs) |

---

## Executive Summary

**Total Findings: 22** — CRITICAL: 1 | HIGH: 3 | MEDIUM: 7 | LOW: 6 | INFO: 5

The codebase is generally well-structured with good security awareness. The core cryptographic implementation in exit-door uses audited @noble/* libraries correctly. However, one **CRITICAL** finding exists: entry-door's signing function lacks domain separation, enabling cross-protocol signature replay. Three **HIGH** findings relate to a vulnerable dependency (hono in mcp-server), committed node_modules in openclaw-skill, and a personal email address in a public repo.

---

## Findings

### CRITICAL

---

### ENTRY-CRYPTO-001: Missing Domain Separation in Entry Signing

- **Severity:** CRITICAL
- **CVSS 3.1:** 9.1
- **CWE:** CWE-290 (Authentication Bypass by Spoofing)
- **Location:** `entry-door/src/sign.ts:16-19`

- **Description:** The `signArrivalMarker()` function signs the canonical marker content **without any domain prefix**. Exit-door uses `"exit-marker-v1.1:"` as a domain prefix, and intent signing uses `"exit-intent-v1:"`, but entry-door uses raw canonical content. This means a signature over arrival marker content could potentially be replayed in any other context that also signs raw canonical JSON, and vice versa.

- **Impact:** Cross-protocol signature confusion. An attacker who obtains a signature from another context that happens to match the canonical form of an arrival marker could potentially forge arrival markers.

- **Evidence:**
  - **(a) Code snippet:**
    ```typescript
    const { proof: _proof, ...rest } = marker;
    const canonical = canonicalize(rest);
    const data = new TextEncoder().encode(canonical);  // NO DOMAIN PREFIX
    const signature = sign(data, privateKey);
    ```
  - **(b) Positive test case:** `entry-door/src/__tests__/entry.test.ts` tests signing/verification but does not test domain separation
  - **(c) Negative test case:** NO TEST EXISTS for cross-protocol replay rejection

- **SAST Correlation:** Not flagged by SAST (semantic issue, not pattern-based)

- **Recommendation:** Add domain prefix `"entry-arrival-v1:"` to both `signArrivalMarker()` and `verifyArrivalMarker()`:
  ```typescript
  const DOMAIN_PREFIX = "entry-arrival-v1:";
  const data = new TextEncoder().encode(DOMAIN_PREFIX + canonical);
  ```

- **Status:** OPEN
- **Remediation Tracking:**
  - **Fix deadline:** 24 hours
  - **Responsible party:** Maintainer
  - **Verification method:** Re-audit of sign.ts + cross-protocol replay test
  - **Regression test:** TO BE ADDED — test that exit-door signatures are rejected by entry-door verifier and vice versa

---

### HIGH

---

### SUPPLY-001: Vulnerable Dependency — hono in mcp-server

- **Severity:** HIGH
- **CVSS 3.1:** 7.5
- **CWE:** CWE-1395 (Dependency on Vulnerable Third-Party Component)
- **Location:** `mcp-server/package-lock.json` (hono 4.12.0-4.12.1)

- **Description:** `npm audit` reports 1 high-severity vulnerability in hono (GHSA-xh87-mx6m-69f3): Authentication Bypass by IP Spoofing in AWS Lambda ALB conninfo. The hono dependency comes transitively through `@modelcontextprotocol/sdk`.

- **Impact:** If mcp-server is deployed behind AWS ALB, IP-based auth checks could be bypassed.

- **Evidence:**
  - **(a)** `npm audit` output: "hono 4.12.0 - 4.12.1 — Severity: high — fix available via `npm audit fix`"
  - **(b)** Positive test case: N/A (dependency issue)
  - **(c)** Negative test case: N/A

- **SAST Correlation:** Flagged by `npm audit`

- **Recommendation:** Run `npm audit fix` or update `@modelcontextprotocol/sdk` to a version that pulls a patched hono.

- **Status:** OPEN
- **Remediation Tracking:**
  - **Fix deadline:** 7 days
  - **Responsible party:** Maintainer
  - **Verification method:** `npm audit` returns 0 vulnerabilities
  - **Regression test:** Add `npm audit --audit-level=high` to CI

---

### SUPPLY-002: Committed node_modules in openclaw-skill

- **Severity:** HIGH
- **CVSS 3.1:** 7.0
- **CWE:** CWE-1395 (Dependency on Vulnerable Third-Party Component)
- **Location:** `openclaw-skill/` (entire node_modules directory tracked in git)

- **Description:** The openclaw-skill repository has its entire `node_modules/` directory committed to git (including cellar-door-exit, @noble/*, commander). There is no `.gitignore` file. This means:
  1. Dependencies are frozen at arbitrary versions and won't receive security updates via normal workflows
  2. The repo is bloated and hard to audit
  3. Supply chain integrity cannot be verified against npm registry

- **Impact:** Dependency vulnerabilities will persist indefinitely. Malicious modifications to vendored code would be hard to detect.

- **Evidence:**
  - **(a)** `git ls-files | grep node_modules` returns tracked files
  - **(b)** No `.gitignore` exists in the repository
  - **(c)** N/A

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Add `.gitignore` with `node_modules/`, remove tracked `node_modules/` with `git rm -r --cached node_modules`, and add `package-lock.json` for reproducible installs.

- **Status:** OPEN
- **Remediation Tracking:**
  - **Fix deadline:** 7 days
  - **Responsible party:** Maintainer
  - **Verification method:** `git ls-files | grep node_modules` returns empty
  - **Regression test:** CI check for tracked node_modules

---

### INFO-LEAK-001: Personal Email in SECURITY.md

- **Severity:** HIGH
- **Location:** `exit-door/SECURITY.md:18`

- **Description:** The file contains a personal Gmail address (`warrenkoch@gmail.com`) as the security contact. This exposes personal information publicly and may not be the intended long-term security contact for an open-source project.

- **Impact:** Personal information exposure. If this individual is a maintainer who wants to remain pseudonymous, this leaks their identity. Also, Gmail may not be ideal for sensitive security reports.

- **Evidence:**
  - **(a)** `SECURITY.md:18`: `Email warrenkoch@gmail.com with subject "cellar-door-exit security".`
  - **(b)** N/A
  - **(c)** N/A

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Replace with a project-specific security contact (e.g., `security@cellardoor.dev`) or use GitHub's private vulnerability reporting feature. If the personal email is intentional, document that decision.

- **Status:** OPEN
- **Remediation Tracking:**
  - **Fix deadline:** 7 days
  - **Responsible party:** Project owner
  - **Verification method:** Manual review
  - **Regression test:** N/A

---

### MEDIUM

---

### CRYPTO-001: Raw SHA-256 KDF Instead of HKDF

- **Severity:** MEDIUM
- **CWE:** CWE-328 (Use of Weak Hash)
- **Location:** `exit-door/src/privacy.ts:60-61`

- **Description:** The ECDH shared secret is passed through raw `sha256()` to derive a symmetric key, rather than using HKDF (HMAC-based Key Derivation Function). While SHA-256 over a high-entropy x25519 secret is practically safe, it violates best-practice KDF usage and prevents domain separation of derived keys.

- **Impact:** No practical attack currently, but deviates from NIST recommendations. Code comments acknowledge this (B13) and plan HKDF for v1.2.

- **Evidence:**
  - **(a)** `privacy.ts:60`: `const key = sha256(shared);`
  - **(b)** Tests exist for encrypt/decrypt roundtrip
  - **(c)** NO TEST EXISTS for KDF correctness

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Migrate to HKDF-SHA256 with domain separation: `hkdf(sha256, shared, salt, "cellar-door-exit-encryption-v1", 32)`

- **Status:** OPEN (tracked for v1.2)

---

### CRYPTO-002: No Ephemeral Key Zeroing in Privacy Module

- **Severity:** MEDIUM
- **CWE:** CWE-226 (Sensitive Information in Resource Not Removed Before Reuse)
- **Location:** `exit-door/src/privacy.ts:55-62`

- **Description:** In `encryptMarker()`, the ephemeral x25519 private key (`ephemeralPrivate`) and the derived shared secret are never zeroed after use. The Signer abstraction has `destroy()` for key zeroing, but the privacy module doesn't follow this pattern.

- **Impact:** Ephemeral key material may persist in memory, accessible to memory dumps or side-channel attacks.

- **Evidence:**
  - **(a)** `privacy.ts:55-62`: `ephemeralPrivate` and `shared` are never `.fill(0)`
  - **(b)** N/A
  - **(c)** N/A

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Add `ephemeralPrivate.fill(0); shared.fill(0);` after the symmetric key is derived, wrapped in a try/finally.

- **Status:** OPEN

---

### INPUT-001: No Size Limit on JSON.parse Inputs

- **Severity:** MEDIUM
- **CWE:** CWE-400 (Uncontrolled Resource Consumption)
- **Location:** Multiple files: `exit-door/src/convenience.ts:98`, `mcp-server/src/server.ts` (multiple), `langchain/src/transfer-tool.ts:28`

- **Description:** Several `JSON.parse()` calls process external input without checking the size of the input string first. A very large JSON payload could cause excessive memory consumption.

- **Impact:** Denial of service via memory exhaustion.

- **Evidence:**
  - **(a)** `convenience.ts:98`: `parsed = JSON.parse(json);` with no size check
  - **(b)** entry-door has `MAX_MARKER_SIZE` (1MB) check in `validateArrivalMarker()`, showing awareness of the issue
  - **(c)** NO TEST EXISTS for oversized input rejection in exit-door

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Add a size check before `JSON.parse()` in all external-facing entry points, consistent with entry-door's `MAX_MARKER_SIZE` pattern.

- **Status:** OPEN

---

### LEGAL-001: Missing LICENSE File in 3 Repos

- **Severity:** MEDIUM
- **Location:** `entry-door/`, `mcp-server/`, `openclaw-skill/`

- **Description:** Three repositories have no LICENSE file, despite `package.json` declaring `"license": "Apache-2.0"` (entry-door, mcp-server). openclaw-skill has no license declaration at all. Without a LICENSE file, the code is technically all-rights-reserved regardless of package.json.

- **Impact:** Legal ambiguity for users and contributors. Contributors may be deterred.

- **Evidence:**
  - **(a)** `ls entry-door/LICENSE` → file not found; `ls mcp-server/LICENSE` → file not found; `ls openclaw-skill/LICENSE` → file not found
  - **(b)** exit-door, vercel-ai-sdk, and langchain all have Apache 2.0 LICENSE files
  - **(c)** N/A

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Add the Apache 2.0 LICENSE file to all three repos.

- **Status:** OPEN

---

### PROTOCOL-001: Witness Function Hardcodes Ed25519

- **Severity:** MEDIUM
- **CWE:** CWE-327 (Use of Broken Crypto Algorithm — future-proofing)
- **Location:** `exit-door/src/ceremony.ts:183-196`

- **Description:** The `CeremonyStateMachine.witness()` method hardcodes `"Ed25519Signature2020"` as the proof type and uses only the Ed25519 `sign()` function. It does not use the algorithm-agnostic `Signer` abstraction that `signMarkerWithSigner()` supports. This means witnesses cannot use P-256 keys.

- **Impact:** Functional limitation. P-256 witnesses cannot co-sign markers.

- **Evidence:**
  - **(a)** `ceremony.ts:193`: `type: "Ed25519Signature2020"` hardcoded
  - **(b)** Tests only exercise Ed25519 witnesses
  - **(c)** N/A

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Accept a `Signer` parameter instead of raw key bytes, consistent with `signMarkerWithSigner()`.

- **Status:** OPEN

---

### PROTOCOL-002: Intent Signing Hardcodes Ed25519

- **Severity:** MEDIUM
- **CWE:** CWE-327
- **Location:** `exit-door/src/ceremony.ts:129-145`

- **Description:** `CeremonyStateMachine.declareIntent()` and `buildIntent()` hardcode Ed25519 signing and `"Ed25519Signature2020"` proof type, same issue as witness function.

- **Impact:** P-256 key holders cannot declare ceremony intents.

- **Evidence:**
  - **(a)** `ceremony.ts:139`: hardcoded `"Ed25519Signature2020"`
  - **(b)** N/A
  - **(c)** N/A

- **Recommendation:** Accept a `Signer` parameter.

- **Status:** OPEN

---

### INPUT-002: Incomplete DID Validation in entry-door

- **Severity:** MEDIUM
- **CWE:** CWE-20 (Improper Input Validation)
- **Location:** `entry-door/src/validation.ts:57`

- **Description:** The DID regex `^did:[a-z0-9]+:[a-zA-Z0-9._:%-]+$` validates format but does not check the decoded byte length of the public key (unlike exit-door's `publicKeyFromDid()` which validates 32 bytes for Ed25519 / 33 for P-256). A DID with correct format but wrong key length would pass validation but fail at verification time with an unhelpful error.

- **Impact:** Poor error messages; potential for confusion. Not directly exploitable.

- **Recommendation:** Call `publicKeyFromDid()` during validation to verify the embedded key length.

- **Status:** OPEN

---

### LOW

---

### CRYPTO-003: ZIP-215 vs Strict Ed25519 Verification

- **Severity:** LOW
- **Location:** `exit-door/src/crypto.ts:73-83`

- **Description:** The code uses @noble/ed25519's default non-strict (ZIP-215) verification. This is **documented and intentional** (see code comment referencing B12), chosen for consensus compatibility. However, ZIP-215 accepts malleable signatures that strict RFC 8032 §5.1.7 would reject.

- **Impact:** Minimal — documented risk acceptance. Two distinct valid signatures could exist for the same message, which matters only if signature uniqueness is relied upon (it currently isn't).

- **SAST Correlation:** Not flagged by SAST

- **Recommendation:** Document this decision in SECURITY.md. No code change needed if the rationale is accepted.

- **Status:** ACCEPTED_RISK

---

### SUPPLY-003: dist/ Directory Committed in vercel-ai-sdk and langchain

- **Severity:** LOW
- **Location:** `vercel-ai-sdk/dist/`, `langchain/dist/`

- **Description:** Built artifacts are committed to git. This creates risk of source/build mismatch and makes code review harder (changes to dist/ could mask source changes).

- **Impact:** Low. Could mask malicious modifications in build output.

- **Recommendation:** Add `dist/` to `.gitignore` and build in CI. Or if intentional for consumption without build step, document this decision.

- **Status:** OPEN

---

### INPUT-003: No Control Character Rejection in entry-door

- **Severity:** LOW
- **CWE:** CWE-20
- **Location:** `entry-door/src/validation.ts`

- **Description:** Unlike exit-door which has `containsControlChars()` rejection (ADV-002), entry-door's validation does not reject null bytes or control characters in string fields.

- **Impact:** Minimal — could allow smuggling of invisible characters in subject, destination, etc.

- **Recommendation:** Port the `containsControlChars()` check from exit-door.

- **Status:** OPEN

---

### SUPPLY-004: vercel-ai-sdk Has node_modules/.vite Tracked

- **Severity:** LOW
- **Location:** `vercel-ai-sdk/node_modules/.vite/`

- **Description:** Vitest cache files are committed under `node_modules/.vite/`. While `.gitignore` includes `node_modules`, these files appear to have been committed before the gitignore was added.

- **Impact:** Minimal — just test cache files, but violates clean repo hygiene.

- **Recommendation:** `git rm -r --cached node_modules/.vite`

- **Status:** OPEN

---

### PROTOCOL-003: MCP Server Default Policy is OPEN_DOOR

- **Severity:** LOW
- **Location:** `mcp-server/src/server.ts:244`

- **Description:** When no `serverPolicy` option is set and the LLM omits the policy parameter, the default is `OPEN_DOOR` (accept everything with a valid signature). The code has good security comments (S-02, S-03) warning about this, but the default is still permissive.

- **Impact:** In production deployments without `serverPolicy` override, the LLM could choose or omit the admission policy.

- **Recommendation:** Consider making `serverPolicy` required in production mode, or defaulting to `STRICT`.

- **Status:** OPEN

---

### LEGAL-002: Paper Draft Contains TBD Placeholders

- **Severity:** LOW
- **Location:** `exit-door/docs/EXIT_PAPER_DRAFT.md:1,506`

- **Description:** The draft paper has `[Names TBD]`, `[email TBD]`, `[repository URL TBD]` placeholders. If published as-is, these look unprofessional but are not a security risk.

- **Impact:** Cosmetic / professional appearance only.

- **Recommendation:** Fill in or remove before public announcement.

- **Status:** OPEN

---

### INFO

---

### INFO-001: FIPS Gap Documented for XChaCha20-Poly1305

- **Severity:** INFO
- **Location:** `exit-door/src/privacy.ts:8-10`

- **Description:** XChaCha20-Poly1305 is not FIPS 140-2/3 approved. This is **already documented** in code comments (B16) with a plan for AES-256-GCM alternative in v1.2.

- **Recommendation:** Track in roadmap. No immediate action needed.

- **Status:** ACCEPTED_RISK

---

### INFO-002: Git-Ledger Uses Local Email Fallback

- **Severity:** INFO
- **Location:** `exit-door/src/git-ledger.ts:103-105`

- **Description:** If git user.email is not configured, the code sets it to `exit-ledger@cellar-door.local`. This is a reasonable fallback for a local tool.

- **Recommendation:** No action needed.

- **Status:** NOT_APPLICABLE

---

### INFO-003: Object.setPrototypeOf in Errors

- **Severity:** INFO
- **Location:** `exit-door/src/errors.ts:30-31`

- **Description:** `Object.setPrototypeOf(this, new.target.prototype)` is used in custom error classes. This is the standard TypeScript pattern for extending Error and is safe.

- **Recommendation:** No action needed.

- **Status:** NOT_APPLICABLE

---

### INFO-004: mcp-server Has Duplicate Test Directory

- **Severity:** INFO
- **Location:** `mcp-server/src/__tests__/server.test.ts` AND `mcp-server/tests/server.test.ts`

- **Description:** Two test files exist in different locations. May cause confusion about which is canonical.

- **Recommendation:** Remove the duplicate and standardize on one location.

- **Status:** OPEN

---

### INFO-005: README Accuracy

- **Severity:** INFO
- **Location:** All repos

- **Description:** READMEs are generally accurate and match code behavior. exit-door's README properly describes the API, ceremony states, and modules. Integration repos (vercel-ai-sdk, langchain, mcp-server) have accurate usage examples.

- **Recommendation:** No action needed.

- **Status:** NOT_APPLICABLE

---

## Supply Chain Summary

| Repository | npm audit | Dependencies | Lock File | Notes |
|-----------|-----------|-------------|-----------|-------|
| exit-door | 0 vulnerabilities | 5 prod (@noble/*, commander) | ✅ | Clean |
| entry-door | 0 vulnerabilities | 1 prod (@noble/hashes) + peer dep | ✅ | Clean |
| vercel-ai-sdk | 0 vulnerabilities | Peer deps only | ✅ | dist/ committed |
| langchain | 0 vulnerabilities | Peer deps only | ✅ | dist/ committed |
| mcp-server | **1 HIGH** (hono) | 4 prod | ✅ | Fix available |
| openclaw-skill | 0 vulnerabilities | 1 prod (cellar-door-exit) | ✅ | **node_modules committed** |

---

## Consolidated Implementation Plan

### Immediate (CRITICAL — fix before any release)

| # | Finding ID | Title | Deadline | Status |
|---|-----------|-------|----------|--------|
| 1 | ENTRY-CRYPTO-001 | Missing domain separation in entry-door signing | 24h | OPEN |

### Short-term (HIGH — fix within 7 days)

| # | Finding ID | Title | Deadline | Status |
|---|-----------|-------|----------|--------|
| 2 | SUPPLY-001 | Vulnerable hono dependency in mcp-server | 7d | OPEN |
| 3 | SUPPLY-002 | Committed node_modules in openclaw-skill | 7d | OPEN |
| 4 | INFO-LEAK-001 | Personal email in SECURITY.md | 7d | OPEN |

### Medium-term (MEDIUM — fix within 30 days)

| # | Finding ID | Title | Deadline | Status |
|---|-----------|-------|----------|--------|
| 5 | CRYPTO-001 | Raw SHA-256 KDF instead of HKDF | 30d | OPEN |
| 6 | CRYPTO-002 | No ephemeral key zeroing in privacy module | 30d | OPEN |
| 7 | INPUT-001 | No size limit on JSON.parse inputs | 30d | OPEN |
| 8 | LEGAL-001 | Missing LICENSE file in 3 repos | 30d | OPEN |
| 9 | PROTOCOL-001 | Witness function hardcodes Ed25519 | 30d | OPEN |
| 10 | PROTOCOL-002 | Intent signing hardcodes Ed25519 | 30d | OPEN |
| 11 | INPUT-002 | Incomplete DID validation in entry-door | 30d | OPEN |

### Backlog (LOW/INFO — next release)

| # | Finding ID | Title | Status |
|---|-----------|-------|--------|
| 12 | SUPPLY-003 | dist/ committed in vercel-ai-sdk, langchain | OPEN |
| 13 | INPUT-003 | No control character rejection in entry-door | OPEN |
| 14 | SUPPLY-004 | Tracked .vite cache in vercel-ai-sdk | OPEN |
| 15 | PROTOCOL-003 | MCP server default policy is OPEN_DOOR | OPEN |
| 16 | LEGAL-002 | Paper draft TBD placeholders | OPEN |
| 17 | INFO-004 | Duplicate test directory in mcp-server | OPEN |

### Accepted Risks

| # | Finding ID | Title | Justification |
|---|-----------|-------|---------------|
| 1 | CRYPTO-003 | ZIP-215 vs strict Ed25519 | Documented decision (B12) for consensus compatibility |
| 2 | INFO-001 | XChaCha20 FIPS gap | Documented (B16), AES-GCM planned for v1.2 |

---

## Passes Not Applicable to Smaller Repos

| Repo | Skipped Passes | Reason |
|------|---------------|--------|
| vercel-ai-sdk | Crypto (1), Protocol (2), Spec (5), Legal (6), Adversarial (7) | Wrapper/integration only, no crypto or protocol logic |
| langchain | Crypto (1), Protocol (2), Spec (5), Legal (6), Adversarial (7) | Wrapper/integration only |
| mcp-server | Crypto (1), Spec (5), Adversarial (7) | Thin MCP wrapper; protocol logic delegated to core libs |
| openclaw-skill | Crypto (1), Protocol (2), Spec (5), Legal (6), Adversarial (7) | Shell scripts + docs only |

---

## Attestation

This security audit was conducted using procedure PROC-SEC-001 v1.1 (adapted for multi-repo scope). All findings above MEDIUM severity have been documented with remediation plans. This is a self-assessment by an AI agent, not a third-party audit.

**Scope limitations:** This audit covers the commits listed above. It does not constitute certification under any regulatory framework. The audit focused on source code review and dependency analysis; no runtime fuzzing or adversarial testing was performed (Pass 7 deferred — would require building and running all test suites).

Assessed by: Hawthorn (AI agent)  
Date: 2026-02-26
