# Security Audit Procedure — v1.1

**Procedure ID:** PROC-SEC-001  
**Version:** 1.1  
**Status:** STABLE — Reviewed by P19, P27, P03r  
**Scope:** Cryptographic protocol libraries (TypeScript/Node.js)  
**Target:** cellar-door-exit, cellar-door-entry  
**Author:** Hawthorn (AI agent)  
**Date:** 2026-02-26  
**Supersedes:** PROC-SEC-001 v1.0  

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

### 0.1 Effort Estimates

Based on the v1.0 execution against cellar-door-exit (~4000 LOC, 35 modules):

| Pass | Estimated Effort | Notes |
|------|-----------------|-------|
| 1 — CRYPTO | 45–60 min | Heaviest pass; side-channel + key lifecycle analysis takes time |
| 2 — PROTOCOL | 30–45 min | Scales with state machine complexity |
| 3 — INPUT | 20–30 min | Straightforward if types are well-defined |
| 4 — SUPPLY | 10–15 min | Mostly tooling output; fast if dependency tree is small |
| 5 — SPEC | 30–45 min | Scales linearly with number of normative requirements |
| 6 — LEGAL | 20–30 min | Requires legal surface knowledge |
| 7 — ADVERSARIAL | 45–60 min | Test authoring + execution + triage |
| **Pre/Post** | **30–45 min** | SAST setup, attestation, consolidated plan |
| **Total** | **~4–6 hours** | Single codebase, ~4000 LOC, 6 dependencies |

Scale linearly for larger codebases. Passes 1–7 can execute in parallel.

---

## 1. Audit Dimensions (7 Passes)

Each pass is an independent review that can be executed in parallel. Each produces a structured findings document with required evidence artifacts (see §3).

### 1.1 Evidence Depth Requirements

**v1.1 change:** The v1.0 execution revealed inconsistent evidence depth across passes. All passes MUST now meet these minimum evidence standards:

| Evidence Type | Minimum Requirement |
|---------------|-------------------|
| **File/line reference** | Exact file path and line range, not just file name |
| **Code snippet** | Relevant code block (5–15 lines) included in the finding |
| **Positive test** | Reference to existing test by file + test name, OR statement that no test exists (which itself becomes a finding) |
| **Negative test** | Reference to test proving violation detection, OR explicit statement of gap |
| **SAST correlation** | For each finding, note whether SAST tooling flagged the same issue (see §2.1) |

A finding with "PASS" status and no evidence artifacts (a), (b), (c) MUST be recorded as "NOT ASSESSED" — not "PASS."

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
- [ ] Domain separation prevents cross-protocol signature replay — **check ALL signing paths, not just the primary one**
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
- [ ] **Key material zeroing:** Ephemeral keys (ECDH, nonces) are zeroed immediately after derivation

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
- [ ] Ed25519 uses strict verification (rejects non-canonical S values per RFC 8032 §5.1.7) — or ZIP-215 choice is documented with justification
- [ ] P-256 uses low-S normalization (rejects high-S signatures or normalizes before acceptance)
- [ ] No code path accepts malleable signatures that could produce distinct valid signatures for the same message

**Checklist — Cryptographic Agility (NEW in v1.1):**
- [ ] Algorithm identifiers are present in all signed artifacts (proof.type, DID multicodec)
- [ ] Adding a new algorithm requires only additive changes (no breaking modifications)
- [ ] Post-quantum readiness: document which components would need replacement and estimated effort
- [ ] Algorithm deprecation path: document how to retire an algorithm without breaking existing markers

**Checklist — Entropy Assessment (NEW in v1.1):**
- [ ] Entropy source identified and documented (OS CSPRNG, hardware RNG, etc.)
- [ ] Behavior when entropy is insufficient: does the system block, degrade, or fail?
- [ ] CI/CD and container environments considered (early-boot, low-entropy scenarios)

**Output:** `audit/crypto-review.md` with pass/fail per item + required evidence artifacts

### Pass 2: Protocol Logic Review (PROTOCOL)

**Standard:** Protocol-specific threat model (STRIDE) + attack trees  
**Scope:** Marker creation, signing, verification, ceremony state machine, modules

**Checklist:**
- [ ] Subject-key binding enforced (verificationMethod === subject)
- [ ] Algorithm cross-check enforced (DID multicodec matches proof.type)
- [ ] ID excluded from signed content (per spec)
- [ ] Domain separation prefix present in **ALL** sign/verify paths (markers, intents, witnesses, disputes, trust module operations) — **enumerate every signing path**
- [ ] Ceremony state machine enforces valid transitions only
- [ ] No state can be skipped in cooperative ceremony
- [ ] Emergency path is available from any pre-final state (including INTENT)
- [ ] Contests do not block exit (non-blocking dispute invariant)
- [ ] Marker immutability — no mutation after signing
- [ ] Replay detection via content-addressed IDs (128-bit minimum)
- [ ] Trust enhancers are conduit-only (validated for form, not truth)
- [ ] Confidence scoring weights are documented and justified
- [ ] Module attachment doesn't invalidate existing signatures
- [ ] Backward compatibility maintained for deprecated APIs
- [ ] Canonicalization is used consistently (no `JSON.stringify` for signed data)

**Output:** `audit/protocol-review.md`

### Pass 3: Input Validation & Injection Review (INPUT)

**Standard:** CWE Top 25 (crypto-relevant subset) + OWASP Input Validation  
**Scope:** All external inputs — marker fields, CLI arguments, JSON parsing

**Checklist:**
- [ ] All string inputs are length-bounded
- [ ] Unicode normalization (NFC) applied before canonicalization
- [ ] JSON parsing uses standard library (no eval, no custom parsers)
- [ ] DID format validated before key extraction (prefix, length, encoding, **decoded byte length**)
- [ ] Base64 decoding validates padding and character set
- [ ] ISO 8601 timestamps validated for format and range
- [ ] No prototype pollution vectors in object spread/merge operations
- [ ] CLI arguments sanitized (no shell injection via reason/narrative fields)
- [ ] Error messages don't leak sensitive data (private keys, internal paths)
- [ ] Type assertions (as) are justified and safe
- [ ] Buffer/Uint8Array length checks before slice operations
- [ ] Control characters (0x00–0x1F) rejected in string fields (NEW in v1.1)
- [ ] Array fields are length-capped to prevent DoS (NEW in v1.1)

**Checklist — Canonicalization Security (NEW in v1.1):**
- [ ] Two semantically different inputs cannot produce the same canonical form
- [ ] Canonicalization handles all JSON edge cases (undefined vs null vs missing)
- [ ] No signature confusion possible via canonical form collision

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
- [ ] No undocumented features (code does something spec doesn't mention) — **especially domain prefixes and internal constants**
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
- [ ] CCPA explicitly referenced where applicable (NEW in v1.1)

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

**Checklist — Failure Triage (NEW in v1.1):**
- [ ] Every test failure is triaged as TRUE FINDING or FALSE POSITIVE with written rationale
- [ ] False positives due to test logic errors are documented but not counted as findings
- [ ] Test coverage metrics recorded (tests run, passed, failed, triaged)

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
8. **SAST integration (NEW in v1.1):** Each pass auditor receives the SAST results relevant to their domain and must:
   - Confirm or refute each SAST finding in their domain
   - Note any issues SAST missed that manual review found
   - Note any issues SAST found that manual review missed
   - Record the SAST correlation in each finding (see §3)

### 2.2 During Audit

Each pass:
1. Executed by a dedicated sub-agent with the relevant persona
2. **Auditor independence required:** The auditor for any pass must not be the author of the code under review. For AI agents: the persona executing the audit must be distinct from the persona that wrote the code. Document the separation in the audit record.
3. Reviews source code line-by-line for its domain
4. Records findings in structured format (see §3)
5. Classifies each finding by severity (CRITICAL / HIGH / MEDIUM / LOW / INFO)
6. Provides CVSS 3.1 score for HIGH+ findings
7. Suggests specific fix for each finding
8. **Cross-references SAST output** for their domain (see §2.1 step 8)

### 2.3 Post-Audit

1. Compile all pass outputs into a single **Security Self-Assessment Report**
2. Triage findings: fix CRITICAL/HIGH immediately, schedule MEDIUM, document LOW/INFO
3. Re-run affected passes after fixes
4. Generate attestation summary (see §5)
5. **Generate Consolidated Implementation Plan** (see §6) — NEW in v1.1
6. Sign attestation (commit to git with GPG or agent signature)

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

### 2.5 Continuous Monitoring (NEW in v1.1)

Between audits, maintain the following:

| Control | Frequency | Mechanism |
|---------|-----------|-----------|
| Dependency vulnerability scan | Every CI run | `npm audit` in CI pipeline |
| Dependency updates | Weekly | Dependabot or Renovate |
| Crypto library CVE watch | Daily | GitHub security advisories for @noble/* |
| Full re-audit trigger | On demand | Major version bump of any crypto dependency |
| Procedure review | Quarterly | Review this procedure for needed updates |

### 2.6 Evidence Retention (NEW in v1.1)

| Artifact | Retention Period | Storage |
|----------|-----------------|---------|
| Audit pass reports | 3 years minimum | Version control (git) |
| SAST tool output | 3 years minimum | Version control (git) |
| Adversarial test scripts | 3 years minimum | Version control (git) |
| Attestation | Indefinite | Version control (git) |
| Consolidated implementation plan | Until all items resolved | Version control (git) |

All artifacts MUST be committed to the repository in the `procedures/audit/` directory. The attestation MUST reference the commit hash where artifacts are stored.

---

## 3. Finding Format

Each finding MUST follow this structure. All fields marked REQUIRED must be present; omission invalidates the finding.

```markdown
### [PASS]-[###]: [Title]

- **Severity:** CRITICAL | HIGH | MEDIUM | LOW | INFO                    [REQUIRED]
- **CVSS 3.1:** [score] (for HIGH+)                                      [REQUIRED for HIGH+]
- **CWE:** [CWE-XXX] (if applicable)                                     [REQUIRED if applicable]
- **Location:** `src/file.ts:line-range`                                  [REQUIRED]

- **Description:** [What the issue is]                                    [REQUIRED]
- **Impact:** [What could happen if exploited]                            [REQUIRED]

- **Evidence:**                                                           [REQUIRED]
  - **(a) Code snippet:** [5–15 lines of relevant code]
  - **(b) Positive test case:** Reference to test exercising the check (file + test name), or "NO TEST EXISTS" (itself a sub-finding)
  - **(c) Negative test case:** Reference to test proving detection of the violation, or "NO TEST EXISTS"

- **SAST Correlation:**                                                   [REQUIRED — NEW in v1.1]
  - Flagged by: [tool name + rule ID] or "Not flagged by SAST"
  - Notes: [Why SAST missed it, or confirmation of SAST finding]

- **Recommendation:** [Specific fix with code example where practical]    [REQUIRED]
- **Status:** OPEN | FIXED | ACCEPTED_RISK | NOT_APPLICABLE              [REQUIRED]

- **Remediation Tracking:**                                               [REQUIRED]
  - **Fix deadline:** CRITICAL: 24h | HIGH: 7d | MEDIUM: 30d | LOW: next release
  - **Responsible party:** [name/role]
  - **Verification method:** [how the fix will be confirmed — re-audit, test, review]
  - **Regression test:** [reference to test preventing recurrence, or "TO BE ADDED"]
  - **Risk acceptance authority:** [for ACCEPTED_RISK: who approved and justification]
```

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
[What was audited — LOC count, module count, dependency count, spec version]

## Passes Completed
| Pass | Domain | Reviewer | Independent | Findings | Critical | High | Medium | Low | Info |
|------|--------|----------|-------------|----------|----------|------|--------|-----|------|
| 1 | Crypto | [id] | ✓ | [n] | [n] | [n] | [n] | [n] | [n] |
| 2 | Protocol | [id] | ✓ | [n] | [n] | [n] | [n] | [n] | [n] |
| 3 | Input | [id] | ✓ | [n] | [n] | [n] | [n] | [n] | [n] |
| 4 | Supply | [id] | ✓ | [n] | [n] | [n] | [n] | [n] | [n] |
| 5 | Spec | [id] | ✓ | [n] | [n] | [n] | [n] | [n] | [n] |
| 6 | Legal | [id] | ✓ | [n] | [n] | [n] | [n] | [n] | [n] |
| 7 | Adversarial | [id] | ✓ | [n] | [n] | [n] | [n] | [n] | [n] |

## SAST Tooling Results
| Tool | Ruleset | Findings | Confirmed | False Positive | Missed by Manual |
|------|---------|----------|-----------|---------------|-----------------|
| Semgrep | p/security-audit | [n] | [n] | [n] | [n] |
| npm audit | — | [n] | [n] | [n] | [n] |
| ESLint | security plugin | [n] | [n] | [n] | [n] |

## Residual Risk
[Statement of accepted risks with justification]

## Attestation
This self-assessment was conducted using procedure PROC-SEC-001 v[X.Y].
All findings above MEDIUM severity have been addressed or have documented
risk acceptance rationale. This is a self-assessment, not a third-party audit.

**Scope limitations:** This attestation covers only the assessed commit. It does
not constitute certification under any regulatory framework. It is void if the
codebase is modified after the assessed commit without re-audit.

**Validity:** This attestation is valid for the assessed commit only.

Assessed by: [agent/human]
Human oversight: [name]
Date: [date]
```

---

## 6. Consolidated Implementation Plan Template (NEW in v1.1)

After all passes are complete, compile a single implementation plan. This was created ad-hoc during v1.0 execution and is now standardized.

```markdown
# Consolidated Implementation Plan

**Audit:** [project] v[version] — [date]
**Procedure:** PROC-SEC-001 v[X.Y]
**Total findings:** [n] (C:[n] H:[n] M:[n] L:[n] I:[n])

## Immediate (CRITICAL/HIGH — fix before release)

| # | Finding ID | Title | Deadline | Owner | Status |
|---|-----------|-------|----------|-------|--------|
| 1 | [PASS-###] | [title] | [date] | [owner] | OPEN |

## Short-term (MEDIUM — fix within 30 days)

| # | Finding ID | Title | Deadline | Owner | Status |
|---|-----------|-------|----------|-------|--------|
| 1 | [PASS-###] | [title] | [date] | [owner] | OPEN |

## Backlog (LOW/INFO — schedule for next release)

| # | Finding ID | Title | Target Release | Owner | Status |
|---|-----------|-------|---------------|-------|--------|
| 1 | [PASS-###] | [title] | [version] | [owner] | OPEN |

## Accepted Risks

| # | Finding ID | Title | Accepted By | Justification |
|---|-----------|-------|-------------|---------------|
| 1 | [PASS-###] | [title] | [name/role] | [rationale] |

## Implementation Dependencies

[Note any findings that must be fixed in a specific order, or that share a common root cause]

## Re-Audit Triggers

After fixing CRITICAL/HIGH findings, re-run the following passes:
- [Pass X] — because [reason]
```

---

## 7. Attack Tree Integration (NEW in v1.1)

Before beginning the audit, the lead auditor SHOULD document the top attack scenarios as attack trees. During execution, each pass MUST map its findings to at least one attack path.

### Minimum Attack Trees

For a cryptographic protocol library, document at minimum:

1. **Signature forgery** — attacker produces a valid signature without the private key
2. **Attribution manipulation** — attacker attributes a marker to a different subject
3. **Replay attack** — attacker reuses a valid marker in a different context
4. **State machine bypass** — attacker skips ceremony steps or forces invalid transitions
5. **Key compromise escalation** — attacker with one compromised key gains broader access
6. **Supply chain injection** — attacker modifies behavior via dependency compromise
7. **Privacy breach** — attacker extracts personal data from encrypted/redacted markers

Each finding SHOULD reference which attack tree(s) it relates to, using the format: `Attack Tree: [#] [name]`.

---

## 8. Future Improvements

### Priority 3 — Target: v1.2

| # | Item | Source |
|---|------|--------|
| 16 | Legal review of attestation template (liability, validity period, scope exclusions) | P03r |
| 18 | Add reproducible builds verification (`npm pack` → hash → rebuild → compare) | P19 |
| 20 | Add multi-party collusion scenarios to threat model | P19 |

### Priority 4 — Track for Future Versions

| # | Item | Source |
|---|------|--------|
| 19 | Consider formal verification / model checking for ceremony state machine | P27 |
| 21 | Add data classification scheme for proportionate controls | P03r |
| 22 | Supplement CVSS with crypto-specific risk scoring addendum | P27 |
| 23 | Add "gameability" self-check as final audit step | P19 |

---

## 9. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0-DRAFT | 2026-02-26 | Initial procedure |
| 1.0 | 2026-02-26 | Incorporated all Priority 1 and Priority 2 reviewer feedback. Added Pass 7 (Adversarial Testing). Expanded Pass 1 with key lifecycle, side-channel analysis, nonce management, signature malleability. Added §2.4 Incident Response. Required evidence artifacts. Added SAST tooling. Added auditor independence. Expanded remediation tracking. Promoted to STABLE. |
| 1.1 | 2026-02-26 | **Post-execution improvements.** Added effort estimates (§0.1). Added evidence depth requirements (§1.1). Added SAST correlation to finding format (§3). Added consolidated implementation plan template (§6). Added attack tree integration (§7). Added continuous monitoring (§2.5). Added evidence retention policy (§2.6). Promoted Priority 3 items: cryptographic agility (Pass 1), entropy assessment (Pass 1), canonicalization security (Pass 3), continuous monitoring (§2.5), evidence retention (§2.6). Improved checklists based on v1.0 execution: domain separation now says "ALL signing paths," added control character rejection, array length caps, canonicalization consistency check, failure triage for adversarial testing. Reduced Future Improvements to remaining items. |

---

## 10. Review Sign-Off

| Reviewer | Role | Status | Notes |
|----------|------|--------|-------|
| P19 (Red Team) | Hostile security reviewer | **APPROVED** | Attack trees added, evidence depth enforced, failure triage formalized |
| P27 (Cryptographer) | Applied cryptographer | **APPROVED** | Crypto agility, entropy assessment, canonicalization security added |
| P03r (CISO) | Enterprise security officer | **APPROVED** | Continuous monitoring, evidence retention, implementation plan template, SAST correlation added |
