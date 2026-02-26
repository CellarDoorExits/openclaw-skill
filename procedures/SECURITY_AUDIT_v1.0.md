# Security Audit Procedure — v1.0

**Procedure ID:** PROC-SEC-001  
**Version:** 1.0-DRAFT  
**Status:** DRAFT — Awaiting security reviewer sign-off  
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
4. Cover the six standard audit dimensions for cryptographic protocol libraries

The output is a **Security Self-Assessment Report** suitable for:
- Inclusion in NIST submissions
- npm package provenance documentation
- Investor/partner due diligence responses
- Internal go/no-go decisions before releases

---

## 1. Audit Dimensions (6 Passes)

Each pass is an independent review that can be executed in parallel. Each produces a structured findings document.

### Pass 1: Cryptographic Implementation Review (CRYPTO)

**Standard:** OWASP Crypto Verification Standard (OCVS) + NIST SP 800-131A  
**Scope:** All cryptographic operations — key generation, signing, verification, hashing, encoding

**Checklist:**
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

**Output:** `audit/crypto-review.md` with pass/fail per item + evidence

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

---

## 2. Execution Protocol

### 2.1 Pre-Audit

1. Record the exact commit hash being audited
2. Record all package versions (package.json)
3. Record Node.js version and OS
4. Run `npm test` — all tests must pass before audit begins
5. Run `npm audit` — record baseline

### 2.2 During Audit

Each pass:
1. Executed by a dedicated sub-agent with the relevant persona
2. Reviews source code line-by-line for its domain
3. Records findings in structured format (see §3)
4. Classifies each finding by severity (CRITICAL / HIGH / MEDIUM / LOW / INFO)
5. Provides CVSS 3.1 score for HIGH+ findings
6. Suggests specific fix for each finding

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

---

## 3. Finding Format

Each finding MUST follow this structure:

```markdown
### [PASS]-[###]: [Title]

- **Severity:** CRITICAL | HIGH | MEDIUM | LOW | INFO
- **CVSS 3.1:** [score] (for HIGH+)
- **CWE:** [CWE-XXX] (if applicable)
- **Location:** `src/file.ts:line`
- **Description:** [What the issue is]
- **Impact:** [What could happen if exploited]
- **Evidence:** [Code snippet or proof]
- **Recommendation:** [Specific fix]
- **Status:** OPEN | FIXED | ACCEPTED_RISK | NOT_APPLICABLE
```

---

## 4. Severity Definitions

| Severity | CVSS | Description |
|----------|------|-------------|
| CRITICAL | 9.0-10.0 | Exploitable remotely, no auth needed, full compromise |
| HIGH | 7.0-8.9 | Significant impact, exploitable with some conditions |
| MEDIUM | 4.0-6.9 | Limited impact or requires unusual conditions |
| LOW | 0.1-3.9 | Minimal impact, defense-in-depth concern |
| INFO | N/A | Best practice recommendation, no security impact |

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
| Pass | Reviewer | Findings | Critical | High | Medium | Low |
|------|----------|----------|----------|------|--------|-----|
| CRYPTO | [id] | [n] | [n] | [n] | [n] | [n] |
| PROTOCOL | [id] | [n] | [n] | [n] | [n] | [n] |
| INPUT | [id] | [n] | [n] | [n] | [n] | [n] |
| SUPPLY | [id] | [n] | [n] | [n] | [n] | [n] |
| SPEC | [id] | [n] | [n] | [n] | [n] | [n] |
| LEGAL | [id] | [n] | [n] | [n] | [n] | [n] |

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

## 6. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0-DRAFT | 2026-02-26 | Initial procedure |

---

## 7. Review Sign-Off

This procedure requires review by security-focused personas before being versioned as stable.

| Reviewer | Role | Status | Notes |
|----------|------|--------|-------|
| P19 (Red Team) | Hostile security reviewer | PENDING | |
| P27 (Cryptographer) | Applied cryptographer | PENDING | |
| P03r (CISO) | Enterprise security officer | PENDING | |

Once all three sign off, version advances to **1.0** (remove DRAFT suffix).
