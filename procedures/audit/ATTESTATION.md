# Security Self-Assessment Attestation

**Project:** cellar-door-exit (Passage Protocol — EXIT)  
**Version:** 0.2.0  
**Commit (Hawthorn):** 145e7a6  
**Commit (cellar-door-exit submodule):** 8f29a96  
**Audit Date:** 2026-02-26  
**Procedure:** PROC-SEC-001 v1.0  
**Node.js:** v22.22.0  
**OS:** Linux 6.8.0-90-generic (x64)  

---

## Scope

Full security self-assessment of cellar-door-exit v0.2.0, covering:
- 35+ source modules (~4000+ lines TypeScript)
- 410 tests across 25 test files
- 6 production dependencies
- EXIT Spec v1.1 (97 normative requirements)
- ENTRY Spec v1.0 (legal surface only)

## Passes Completed

| Pass | Domain | Reviewer | Findings | Critical | High | Medium | Low | Info |
|------|--------|----------|----------|----------|------|--------|-----|------|
| 1 | Crypto | AI-P27 | 8 | 0 | 1 | 3 | 4 | 0 |
| 2 | Protocol | AI-P19 | 4 | 0 | 0 | 1 | 3 | 0 |
| 3 | Input | AI-SEC | 4 | 0 | 0 | 3 | 1 | 0 |
| 4 | Supply Chain | AI-SEC | 0 | 0 | 0 | 0 | 0 | 0 |
| 5 | Spec Conformance | AI-SPEC | 10 | 0 | 0 | 4 | 6 | 0 |
| 6 | Legal | AI-LEGAL | 3 | 0 | 0 | 1 | 2 | 0 |
| 7 | Adversarial | AI-P19 | 1 | 0 | 0 | 0 | 1 | 0 |
| **Total** | | | **30** | **0** | **1** | **12** | **17** | **0** |

## Critical/High Findings

### HIGH: CRYPTO-001 — Domain Separation Missing in `createCompromiseMarker`

- **Location:** `src/key-compromise.ts`
- **Description:** `createCompromiseMarker` signs data without the `DOMAIN_PREFIX` ("exit-marker-v1.1:") used by all other signing paths. Signatures produced by this function will not verify through `verifyMarker()` and lack cross-protocol replay protection.
- **Impact:** Compromise markers are unverifiable through the standard path; inconsistent signing semantics.
- **Recommendation:** Add `DOMAIN_PREFIX` to the signing path in `createCompromiseMarker`, or import and use `signMarker`/`signMarkerWithSigner`.
- **Status:** OPEN — Fix deadline: 7 days (HIGH)

## Medium Findings Summary

| ID | Pass | Title | Status |
|----|------|-------|--------|
| CRYPTO-002 | Crypto | Missing domain separation in trust module (commit-reveal, tenure attestation) | OPEN |
| CRYPTO-003 | Crypto | No key storage security guidance in code/docs | OPEN |
| CRYPTO-004 | Crypto | No key material zeroing after use | OPEN |
| P2-04a | Protocol | Intent signing and witness co-signing lack domain separation | OPEN |
| INPUT-001 | Input | No string length bounds on validated fields | OPEN |
| INPUT-006 | Input | ISO 8601 timezone handling ambiguous, no date range validation | OPEN |
| INPUT-011 | Input | `publicKeyFromDid()` no decoded byte length verification | OPEN |
| SPEC-001 | Spec | Domain prefix in code not documented in spec | OPEN |
| SPEC-002 | Spec | `selfAttested` field not validated | OPEN |
| SPEC-003 | Spec | `coercionLabel`/`preRotationCommitment` not validated when present | OPEN |
| SPEC-004 | Spec | `proof.created` not checked for valid ISO 8601 | OPEN |
| LEGAL-F-002 | Legal | Cross-border data transfer mechanisms not documented | OPEN |

## Low Findings Summary

17 low-severity findings across all passes. Primary themes:
- Verbose error messages may leak implementation details (CRYPTO-005)
- Ed25519 non-strict verification mode (CRYPTO-006, mitigated by @noble defaults)
- Raw SHA-256 as KDF without HKDF (CRYPTO-007)
- TypeScript-only access control for private keys (CRYPTO-008)
- Ceremony state machine public field bypass (P2-17a)
- No emergency escape from INTENT state (P2-07)
- Dispute resolution uses JSON.stringify instead of canonicalize() (P2-04b)
- Trust enhancer arrays not length-capped (INPUT-017)
- Null bytes accepted in string fields (ADV-002)
- Various spec conformance minor gaps (SPEC-005 through SPEC-010)
- XChaCha20 not FIPS-approved for privacy module (LEGAL-F-001)
- CCPA not explicitly referenced (LEGAL-F-005)

## Residual Risk Statement

**Overall risk: LOW-MEDIUM.**

The protocol's cryptographic foundations are sound — all primitives from audited @noble/* libraries, CSPRNG throughout, zero npm vulnerabilities, minimal dependency surface (6 packages). The subject-key binding fix (P0, implemented 2026-02-26) closes the most critical attack vector identified in earlier reviews (CVSS 8.1).

**Residual risks:**
1. **Domain separation inconsistency** (HIGH) — `createCompromiseMarker` and trust module functions sign without the domain prefix. Fix is straightforward but must be completed before production deployment.
2. **Input validation gaps** (MEDIUM) — No string length bounds, ambiguous timezone handling, and DID length not verified could enable DoS or subtle bugs under adversarial conditions. None are remotely exploitable in the current library-only deployment model.
3. **Spec/code divergence** (MEDIUM) — The domain prefix exists in code but not spec. This will cause interop failures with any independent implementation. Recommend updating spec before publishing v0.2.0.
4. **Privacy module FIPS gap** (LOW) — XChaCha20-Poly1305 is not FIPS 140-2/3 approved. The privacy module is optional and rarely used in the core flow, but FIPS-focused deployments should be aware.

**No critical findings. No findings that would block npm publication**, provided the HIGH finding (CRYPTO-001) is addressed first.

## Attestation

This self-assessment was conducted using procedure PROC-SEC-001 v1.0 (stable, reviewed by 3 security personas). All 7 passes were executed by independent AI agent personas with auditor independence from the code-writing persona. Human oversight provided by Warren Koch.

The single HIGH finding (CRYPTO-001) has a 7-day fix deadline. All MEDIUM findings are documented with remediation paths. No CRITICAL findings were identified.

**This is a self-assessment, not a third-party audit.** It does not constitute certification under any regulatory framework. The attestation is valid only for the assessed commit and version.

Assessed by: Hawthorn (AI agent, PROC-SEC-001 v1.0)  
Human oversight: Warren Koch  
Date: 2026-02-26  
Procedure version: PROC-SEC-001 v1.0  
Audit artifacts: `procedures/audit/` (7 review files + adversarial test script)  
