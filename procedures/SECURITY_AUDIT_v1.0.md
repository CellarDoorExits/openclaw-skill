# Security Audit Procedure — v1.0

**Procedure ID:** PROC-SEC-001  
**Version:** 1.0  
**Status:** STABLE — Reviewed by P19, P27, P03r  
**Scope:** Cryptographic protocol libraries (TypeScript/Node.js)  
**Target:** cellar-door-exit, cellar-door-entry  
**Author:** Hawthorn (AI agent)  
**Date:** 2026-02-26  

---

## 0. Purpose

This procedure defines a repeatable, documented security audit process for the Passage Protocol codebase. It is designed to:

1. Be executed by AI agents with human oversight
2. Produce attestable evidence of due diligence
3. Be versioned and improved over iterations
4. Cover seven audit dimensions for cryptographic protocol libraries, including adversarial testing

The output is a **Security Self-Assessment Report** suitable for:
- Inclusion in NIST submissions
- npm package provenance documentation
- Investor/partner due diligence responses
- Internal go/no-go decisions before releases

---

## 1. Audit Dimensions (7 Passes)

Each pass is an independent review that can be executed in parallel. Each produces a structured findings document with required evidence artifacts (see §3).

### Pass 1: Cryptographic Implementation Review (CRYPTO)

**Standard:** OWASP Crypto Verification Standard (OCVS) + NIST SP 800-131A + NIST SP 800-57 Part 1 (Key Management)  
**Scope:** All cryptographic operations — key generation, key lifecycle, signing, verification, hashing, encoding, side-channel resistance

**Checklist — Primitives & Algorithms:**
- [ ] Key generation uses CSPRNG (crypto.getRandomValues or equivalent)
- [ ] Private keys are never logged, serialized to JSON, or exposed in error messages
- [ ] Signature algorithms match spec (Ed25519Signature2020, EcdsaP256Signature2019)
- [ ] Signature format is canonical and documented (compact r||s for P-256, standard for Ed25519)
- [ ] Hash functions are collision-resistant (SHA-256 minimum for content addressing, SHA-512 for Ed25519)
- [ ] No use of deprecated/weak algorithms (MD5, SHA-1, DES, RC4)
- [ ] Constant-time comparison for signature verification (library-level)
- [ ] Domain separation prevents cross-protocol signature replay
- [ ] Key encoding/decoding roundtrips are lossless (DID → pubkey → DID = identity)
- [ ] Multicodec prefixes are correct (0xed01 for Ed25519, 0x8024 for P-256)
- [ ] Base58btc encoding handles leading zeros correctly
- [ ] No custom crypto — all primitives from audited libraries (@noble/ed25519, @noble/curves)
- [ ] Library versions are current and not affected by known CVEs

**Checklist — Key Lifecycle (NIST SP 800-57):**
- [ ] **Key storage:** No plaintext private keys at rest; keys encrypted or protected by OS-level credential storage
- [ ] **Key rotation:** Mechanism exists for key rotation and has been tested end-to-end
- [ ] **Key revocation:** Revocation path is documented; verifiers can learn that a key is revoked
- [ ] **Key destruction:** Key material is zeroed after use; no residual copies in memory or on disk

**Checklist — Side-Channel Resistance:**
- [ ] All cryptographic code paths use constant-time operations (no early returns on secret data)
- [ ] No secret-dependent branching (control flow does not vary with key material or plaintext)
- [ ] No secret-dependent memory access patterns (no table lookups indexed by secret values)
- [ ] Error messages do not reveal which cryptographic check failed (generic failure only)
- [ ] Timing of the full verify cycle is independent of input (no short-circuit on invalid signatures)

**Checklist — Nonce Management:**
- [ ] For any nonce-based scheme: nonce generation method is documented (random, counter, or synthetic)
- [ ] Uniqueness guarantee mechanism is documented and tested
- [ ] Nonce-misuse resistance is provided or absence is justified with risk assessment
- [ ] Nonce size is adequate relative to the birthday bound for the expected message volume

**Checklist — Signature Malleability:**
- [ ] Ed25519 uses strict verification (rejects non-canonical S values per RFC 8032 §5.1.7)
- [ ] P-256 uses low-S normalization (rejects high-S signatures or normalizes before acceptance)
- [ ] No code path accepts malleable signatures that could produce distinct valid signatures for the same message

**Output:** `audit/crypto-review.md` with pass/fail per item + required evidence artifacts

### Pass 2: Protocol Logic Review (PROTOCOL)

**Standard:** Protocol-specific threat model (STRIDE) + attack trees  
**Scope:** Marker creation, signing, verification, ceremony state machine, modules

**Checklist:**
- [ ] Subject-key binding enforced (verificationMethod === subject)
- [ ] Algorithm cross-check enforced (DID multicodec matches proof.type)
- [ ] ID excluded from signed content (per spec)
- [ ] Domain separation prefix present in all sign/verify paths
- [ ] Ceremony state machine enforces valid transitions only
- [ ] No state can be skipped in cooperative ceremony
- [ ] Emergency path is available from any pre-final state
- [ ] Contests do not block exit (non-blocking dispute invariant)
- [ ] Marker immutability — no mutation after signing
- [ ] Replay detection via content-addressed IDs (128-bit minimum)
- [ ] Trust enhancers are conduit-only (validated for form, not truth)
- [ ] Confidence scoring weights are documented and justified
- [ ] Module attachment doesn't invalidate existing signatures
- [ ] Backward compatibility maintained for deprecated APIs

**Output:** `audit/protocol-review.md`

### Pass 3: Input Validation & Injection Review (INPUT)

**Standard:** CWE Top 25 (crypto-relevant subset) + OWASP Input Validation  
**Scope:** All external inputs — marker fields, CLI arguments, JSON parsing

**Checklist:**
- [ ] All string inputs are length-bounded
- [ ] Unicode normalization (NFC) applied before canonicalization
- [ ] JSON parsing uses standard library (no eval, no custom parsers)
- [ ] DID format validated before key extraction (prefix, length, encoding)
- [ ] Base64 decoding validates padding and character set
- [ ] ISO 8601 timestamps validated for format and range
- [ ] No prototype pollution vectors in object spread/merge operations
- [ ] CLI arguments sanitized (no shell injection via reason/narrative fields)
- [ ] Error messages don't leak sensitive data (private keys, internal paths)
- [ ] Type assertions (as) are justified and safe
- [ ] Buffer/Uint8Array length checks before slice operations

**Output:** `audit/input-review.md`

### Pass 4: Dependency & Supply Chain Review (SUPPLY)

**Standard:** SLSA Level 1 + npm audit + Scorecard  
**Scope:** All production dependencies

**Checklist:**
- [ ] `npm audit` reports zero critical/high vulnerabilities
- [ ] All dependencies are from known, maintained packages
- [ ] No unnecessary dependencies (minimal dependency tree)
- [ ] Lock file (package-lock.json) is committed and up-to-date
- [ ] No post-install scripts in dependencies that execute arbitrary code
- [ ] @noble/* libraries are from the verified Paul Miller (@paulmillr) org
- [ ] No dependencies with known supply chain compromises
- [ ] devDependencies are not bundled in production
- [ ] Package exports are minimal (no internal modules leaked)
- [ ] .npmignore or "files" field limits published content

**Output:** `audit/supply-chain-review.md`

### Pass 5: Specification Conformance Review (SPEC)

**Standard:** EXIT Spec v1.1 + ENTRY Spec v1.0  
**Scope:** Every MUST/SHOULD/MAY in the spec checked against code

**Checklist:**
- [ ] All MUST requirements implemented and tested
- [ ] All SHOULD requirements implemented or documented as intentional omissions
- [ ] All MAY requirements documented (implemented or not)
- [ ] Spec field table matches TypeScript types exactly
- [ ] Spec ceremony states match state machine implementation
- [ ] Spec module schemas match code module types
- [ ] Spec cryptographic requirements match implementation
- [ ] Spec canonicalization algorithm matches code
- [ ] Version string in code matches spec version
- [ ] No undocumented features (code does something spec doesn't mention)
- [ ] No spec features that are unimplemented without documentation

**Output:** `audit/spec-conformance-review.md`

### Pass 6: Legal & Compliance Surface Review (LEGAL)

**Standard:** GDPR, CCPA, Sherman Act, Securities Act, FCRA  
**Scope:** Data handling, privacy, antitrust, securities, consumer protection

**Checklist:**
- [ ] Personal data encryption is MUST (not MAY)
- [ ] Sunset/expiry policies are mandatory with defaults
- [ ] Anti-securitization clause present in spec
- [ ] Anti-coordination clause present in ENTRY spec
- [ ] No coordinated blocking mechanism (blockedOrigins removed)
- [ ] Module D has securities disclaimer
- [ ] No reputation aggregation that could trigger Howey
- [ ] GDPR erasure path documented (crypto-shredding)
- [ ] No FCRA-triggering features in core protocol
- [ ] Privacy module uses approved encryption (note XChaCha20 FIPS gap)
- [ ] Cross-border data transfer considerations documented
- [ ] Dispute resolution is non-blocking (can't weaponize disputes)

**Output:** `audit/legal-review.md`

### Pass 7: Adversarial Testing (ADVERSARIAL)

**Standard:** Property-based testing + fuzz testing + negative test matrices  
**Scope:** All public API entry points, ceremony state machine, cryptographic operations under adversarial conditions

This pass validates runtime behavior under adversarial conditions. Static review (Passes 1–6) cannot surface bugs that manifest only under malformed input, unexpected sequences, or load.

**Checklist — Fuzz Testing:**
- [ ] All public API entry points fuzzed via fast-check property-based testing
- [ ] Minimum **1,000 iterations per entry point** (10,000 recommended for crypto paths)
- [ ] Malformed input sequences tested: truncated, oversized, wrong type, null, undefined, NaN, empty
- [ ] Boundary values tested for all numeric inputs (0, -1, MAX_SAFE_INTEGER, Infinity)
- [ ] Random valid-structure but semantically invalid inputs (valid JSON, wrong schema)

**Checklist — Ceremony State Machine Negative Testing:**
- [ ] Negative test matrix covering all **invalid** state transitions (every non-edge in the state graph)
- [ ] Out-of-order operation sequences tested (sign before create, verify before sign, etc.)
- [ ] Duplicate operation sequences tested (double-sign, double-finalize)
- [ ] Concurrent operation attempts tested where applicable
- [ ] Emergency path tested from every non-final state

**Checklist — Cryptographic Adversarial Tests:**
- [ ] Signature verification rejects: truncated signatures, zero signatures, all-ones signatures
- [ ] Signature verification rejects: signatures from wrong key, signatures over wrong message
- [ ] Key decoding rejects: wrong multicodec prefix, wrong length, invalid encoding
- [ ] Replay of valid markers is detected and rejected by the system (not just content-addressing)
- [ ] Domain separation prevents cross-context signature acceptance

**Output:** `audit/adversarial-review.md` with iteration counts, failure rates, and any crashes/hangs discovered

---

## 2. Execution Protocol

### 2.1 Pre-Audit

1. Record the exact commit hash being audited
2. Record all package versions (package.json)
3. Record Node.js version and OS
4. Run `npm test` — all tests must pass before audit begins
5. Run `npm audit` — record baseline
6. **Run SAST tooling and record results as part of the audit record:**
   - Semgrep with `p/security-audit` ruleset
   - `npm audit` (detailed report, not just summary)
   - ESLint with security plugin (`eslint-plugin-security`)
7. Triage SAST findings: incorporate into the relevant pass or document as false positives with justification

### 2.2 During Audit

Each pass:
1. Executed by a dedicated sub-agent with the relevant persona
2. **Auditor independence required:** The auditor for any pass must not be the author of the code under review. For AI agents: the persona executing the audit must be distinct from the persona that wrote the code. Document the separation in the audit record.
3. Reviews source code line-by-line for its domain
4. Records findings in structured format (see §3)
5. Classifies each finding by severity (CRITICAL / HIGH / MEDIUM / LOW / INFO)
6. Provides CVSS 3.1 score for HIGH+ findings
7. Suggests specific fix for each finding

### 2.3 Post-Audit

1. Compile all pass outputs into a single **Security Self-Assessment Report**
2. Triage findings: fix CRITICAL/HIGH immediately, schedule MEDIUM, document LOW/INFO
3. Re-run affected passes after fixes
4. Generate attestation summary with:
   - Commit hash audited
   - Procedure version used
   - Passes completed
   - Findings count by severity
   - Residual risk statement
5. Sign attestation (commit to git with GPG or agent signature)

### 2.4 Incident Response

When a CRITICAL or HIGH finding is discovered during or after an audit, the following response timelines apply:

**CRITICAL Findings:**
- **Notify maintainer** within **24 hours** of discovery
- **Draft security advisory** within **72 hours**
- **Public disclosure** within **90 days** (coordinated disclosure)
- If actively exploited: immediate disclosure at maintainer's discretion

**HIGH Findings:**
- **Fix SLA:** 7 calendar days from discovery to merged fix
- Notify maintainer within 48 hours

**Downstream Notification:**
- File **npm security advisory** via `npm audit` advisory submission
- File **GitHub Security Advisory** (GHSA) on the affected repository
- Notify known downstream consumers via repository security policy (`SECURITY.md`)
- For CRITICAL: consider requesting a CVE identifier

**Disclosure Format:**
- Use GitHub Security Advisory (GHSA) format
- Include: affected versions, patched version, CVSS score, CWE, description, mitigation steps
- Reference the finding ID from the audit (e.g., `CRYPTO-001`)

---

## 3. Finding Format

Each finding MUST follow this structure. All fields marked REQUIRED must be present; omission invalidates the finding.

```markdown
### [PASS]-[###]: [Title]

- **Severity:** CRITICAL | HIGH | MEDIUM | LOW | INFO                    [REQUIRED]
- **CVSS 3.1:** [score] (for HIGH+)                                      [REQUIRED for HIGH+]
- **CWE:** [CWE-XXX] (if applicable)                                     [REQUIRED if applicable]
- **Location:** `src/file.ts:line`                                        [REQUIRED]

- **Description:** [What the issue is]                                    [REQUIRED]
- **Impact:** [What could happen if exploited]                            [REQUIRED]

- **Evidence:**                                                           [REQUIRED]
  - **(a) File/line reference:** `src/file.ts:42-58` — [what the code does wrong]
  - **(b) Positive test case:** Reference to test exercising the check (file + test name)
  - **(c) Negative test case:** Reference to test proving detection of the violation

- **Recommendation:** [Specific fix]                                      [REQUIRED]
- **Status:** OPEN | FIXED | ACCEPTED_RISK | NOT_APPLICABLE              [REQUIRED]

- **Remediation Tracking:**                                               [REQUIRED]
  - **Fix deadline:** CRITICAL: 24h | HIGH: 7d | MEDIUM: 30d | LOW: next release
  - **Responsible party:** [name/role]
  - **Verification method:** [how the fix will be confirmed — re-audit, test, review]
  - **Regression test:** [reference to test preventing recurrence]
  - **Risk acceptance authority:** [for ACCEPTED_RISK: who approved and justification]
```

> **Note:** A finding with "PASS" status and no evidence artifacts (a), (b), (c) must be recorded as "NOT ASSESSED" — not "PASS." Evidence is non-negotiable.

---

## 4. Severity Definitions

| Severity | CVSS | Description | Fix Deadline |
|----------|------|-------------|--------------|
| CRITICAL | 9.0-10.0 | Exploitable remotely, no auth needed, full compromise | 24 hours |
| HIGH | 7.0-8.9 | Significant impact, exploitable with some conditions | 7 days |
| MEDIUM | 4.0-6.9 | Limited impact or requires unusual conditions | 30 days |
| LOW | 0.1-3.9 | Minimal impact, defense-in-depth concern | Next release |
| INFO | N/A | Best practice recommendation, no security impact | Discretionary |

---

## 5. Attestation Template

```markdown
# Security Self-Assessment Attestation

**Project:** [name]
**Version:** [version]
**Commit:** [hash]
**Audit Date:** [date]
**Procedure:** PROC-SEC-001 v[X.Y]

## Scope
[What was audited]

## Passes Completed
| Pass | Reviewer | Independent | Findings | Critical | High | Medium | Low |
|------|----------|-------------|----------|----------|------|--------|-----|
| CRYPTO | [id] | ✓ | [n] | [n] | [n] | [n] | [n] |
| PROTOCOL | [id] | ✓ | [n] | [n] | [n] | [n] | [n] |
| INPUT | [id] | ✓ | [n] | [n] | [n] | [n] | [n] |
| SUPPLY | [id] | ✓ | [n] | [n] | [n] | [n] | [n] |
| SPEC | [id] | ✓ | [n] | [n] | [n] | [n] | [n] |
| LEGAL | [id] | ✓ | [n] | [n] | [n] | [n] | [n] |
| ADVERSARIAL | [id] | ✓ | [n] | [n] | [n] | [n] | [n] |

## SAST Tooling Results
- Semgrep (p/security-audit): [n findings / clean]
- npm audit: [n advisories / clean]
- ESLint security: [n findings / clean]

## Residual Risk
[Statement of accepted risks]

## Attestation
This self-assessment was conducted using procedure PROC-SEC-001 v[X.Y].
All findings above MEDIUM severity have been addressed or have documented
risk acceptance rationale. This is a self-assessment, not a third-party audit.

Assessed by: [agent/human]
Date: [date]
```

---

## 6. Future Improvements

The following items were identified during the v1.0 review process (Priority 3–4) and are tracked for incorporation in future versions.

### Priority 3 — Target: v1.1

| # | Item | Source |
|---|------|--------|
| 11 | Add attack tree documentation; map findings to attack paths | P19 |
| 12 | Add evidence retention policy (3-year minimum) | P03r |
| 13 | Add cryptographic agility assessment and post-quantum readiness | P27 |
| 14 | Add entropy quality verification beyond CSPRNG API check | P27 |
| 15 | Add canonicalization security review (signature confusion via canonical form collision) | P27 |
| 16 | Legal review of attestation template (liability, validity period, scope exclusions) | P03r |
| 17 | Add continuous monitoring requirements between audits (Dependabot, scheduled re-audits) | P03r |

### Priority 4 — Track for Future Versions

| # | Item | Source |
|---|------|--------|
| 18 | Add reproducible builds verification (`npm pack` → hash → rebuild → compare) | P19 |
| 19 | Consider formal verification / model checking for ceremony state machine | P27 |
| 20 | Add multi-party collusion scenarios to threat model | P19 |
| 21 | Add data classification scheme for proportionate controls | P03r |
| 22 | Supplement CVSS with crypto-specific risk scoring addendum | P27 |
| 23 | Add "gameability" self-check as final audit step | P19 |

---

## 7. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0-DRAFT | 2026-02-26 | Initial procedure |
| 1.0 | 2026-02-26 | Incorporated all Priority 1 and Priority 2 reviewer feedback. Added Pass 7 (Adversarial Testing). Expanded Pass 1 with key lifecycle (NIST SP 800-57), side-channel analysis, nonce management, and signature malleability checks. Added §2.4 Incident Response. Required evidence artifacts in §3 Finding Format. Added SAST tooling to §2.1. Added auditor independence to §2.2. Expanded remediation tracking in §3. Added Future Improvements section (Priority 3–4). Promoted to STABLE after reviewer sign-off. |

---

## 8. Review Sign-Off

| Reviewer | Role | Status | Notes |
|----------|------|--------|-------|
| P19 (Red Team) | Hostile security reviewer | **APPROVED** | Conditions met: adversarial testing pass added, evidence artifacts required |
| P27 (Cryptographer) | Applied cryptographer | **APPROVED** | Conditions met: key lifecycle, side-channel analysis, nonce management, signature malleability added |
| P03r (CISO) | Enterprise security officer | **APPROVED** | Conditions met: SAST tooling, incident response, auditor independence, remediation tracking added |
