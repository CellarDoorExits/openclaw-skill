# Legal & Compliance Surface Review — cellar-door-exit v0.2.0

**Procedure:** PROC-SEC-001 v1.0  
**Pass:** 6 (LEGAL)  
**Audit Commit:** 8f29a96  
**Date:** 2026-02-26  
**Reviewer:** Automated Legal Compliance Analysis  
**Standards:** GDPR, CCPA, Sherman Act, Securities Act, FCRA

---

## Checklist Results

### 1. Personal Data Encryption: MUST (not MAY)
**Status:** ✅ PASS

- EXIT_SPEC §10.1: "Implementations that store or transmit markers containing personal data … **MUST** encrypt those markers" — mandatory language confirmed.
- `src/privacy.ts` header comment: "Encryption is MANDATORY for markers with personal data, not optional."
- Code implements `encryptMarker()` / `decryptMarker()` using ECDH + XChaCha20-Poly1305.

### 2. Sunset/Expiry Policies Mandatory with Defaults
**Status:** ✅ PASS

- EXIT_SPEC §3.4: `expires` field is **MUST**. Default: 730 days (voluntary), 365 days (involuntary).
- EXIT_SPEC §8.5: "All markers MUST include an `expires` field… implementations MUST apply sunset policies to all markers to prevent indefinite reputation effects."
- `types.ts`: `expires` field documented with MUST language and default durations.
- `sunsetDate` is deprecated in favor of `expires`.

### 3. Anti-Securitization Clause
**Status:** ✅ PASS

- EXIT_SPEC §14.1: Normative anti-securitization clause present. "EXIT markers, confidence scores, reputation aggregates, and any derivatives thereof MUST NOT be packaged, bundled, tranched, or otherwise structured as financial instruments, securities, or investment contracts."
- Clause explicitly prohibits tokenization for trading purposes.

### 4. Anti-Coordination Clause (ENTRY Spec)
**Status:** ✅ PASS

- ENTRY_SPEC §4.4: "Platforms implementing ENTRY policies MUST NOT coordinate admission decisions with other platforms."
- Explicitly enumerates prohibited behaviors: shared denial lists, collective blocking agreements, shared databases.
- References Sherman Act §1 and EU TFEU Art. 101.

### 5. No Coordinated Blocking Mechanism (blockedOrigins removed)
**Status:** ✅ PASS

- No `blockedOrigins` field found in any spec or code file.
- ENTRY_SPEC §4.4 note: "The ENTRY protocol intentionally does not standardize exclusion mechanisms."
- Admission policies (`AdmissionPolicy` in ENTRY_SPEC §4.1) contain `allowedExitTypes` but no origin blocklist.

### 6. Module D Securities Disclaimer
**Status:** ✅ PASS

- `src/types.ts` ModuleD interface has extensive JSDoc disclaimer referencing:
  - Howey test (SEC v. W.J. Howey Co., 1946)
  - "data transport mechanism only"
  - Counsel recommendation
  - Cross-reference to `assessments/howey-module-d-v2.md`
- EXIT_SPEC §4.4: "Asset manifests are **declarations and references**, not transfer instruments or bearer instruments."

### 7. No Reputation Aggregation Triggering Howey
**Status:** ✅ PASS (with advisory)

- Confidence scoring (§7.4) is explicitly a "recommendation to verifiers, not a protocol-level enforcement."
- Anti-securitization clause (§14.1) prevents packaging scores as financial instruments.
- `IdentityClaimAttachment` in types.ts explicitly notes: "Cellar Door does NOT verify, resolve, or store these claims… This avoids FCRA, GDPR, and credit-reporting liability."

**Advisory (LEGAL-ADV-001):** The confidence score aggregation model (§7.4) could theoretically be used by third parties to construct tradeable reputation derivatives. The anti-securitization clause provides normative protection but has no technical enforcement. Recommend monitoring for ecosystem misuse.

### 8. GDPR Erasure Path (Crypto-Shredding)
**Status:** ✅ PASS

- EXIT_SPEC §10.1: Encryption enables crypto-shredding (destroy key = destroy data).
- EXIT_SPEC §10.4: Explicit GDPR compliance section referencing Art. 35 DPIA, Art. 6 lawful basis, data subject rights, data minimization.
- ENTRY_SPEC §8.1: `ClaimStore.deleteBySubject()` supports Art. 17 right to erasure.
- ENTRY_SPEC §18: Dedicated GDPR section.
- Field-level redaction (`src/privacy.ts`) provides selective erasure.

**Note:** On-chain anchoring (Module F, §11.1) is flagged as "fundamentally incompatible with GDPR right to erasure" — spec requires DPIA before use.

### 9. No FCRA-Triggering Features in Core
**Status:** ✅ PASS

- `IdentityClaimAttachment` explicitly disclaims FCRA liability ("This avoids FCRA, GDPR, and credit-reporting liability").
- Confidence scores are verifier-side computations, not stored reports.
- No "consumer report" generation in core protocol.
- Anti-weaponization clause (§8.6) prevents use as blacklists.
- Ethics module (`src/ethics.ts`) generates advisory signals only — "signals, not verdicts."

### 10. Privacy Module: Approved Encryption (XChaCha20 FIPS Gap)
**Status:** ⚠️ PASS WITH FINDING

**Finding LEGAL-F-001 (Low):** XChaCha20-Poly1305 is not FIPS 140-2/3 approved.

- `src/privacy.ts` uses `xchacha20poly1305` from `@noble/ciphers` — strong cryptography but not on the FIPS approved list.
- EXIT_SPEC §3.5.1 acknowledges: Ed25519 is "❌ Not approved" for FIPS; P-256 is "✅ Approved."
- The spec supports `EcdsaP256Signature2019` for FIPS-regulated environments (signing), but the **encryption** path has no FIPS-compliant alternative specified.

**Recommendation:** Document the FIPS gap explicitly in a compliance matrix. For FIPS-regulated deployments, specify AES-256-GCM as an alternative encryption algorithm. This is informational — XChaCha20-Poly1305 is cryptographically sound; the gap is regulatory, not security.

### 11. Cross-Border Data Transfer
**Status:** ⚠️ PASS WITH FINDING

**Finding LEGAL-F-002 (Medium):** Cross-border data transfer mechanisms are not fully documented.

- EXIT_SPEC §10.4 references GDPR DPIA requirements and data minimization.
- ENTRY_SPEC §18 references Art. 35 DPIA for EU jurisdictions.
- Module F (cross-domain anchoring) warns about indelible on-chain records.
- **Gap:** No explicit mention of Standard Contractual Clauses (SCCs), Binding Corporate Rules (BCRs), or adequacy decisions for cross-border marker transit.
- The protocol is non-custodial and markers are self-contained, which reduces transfer risk, but implementations that aggregate or store markers across jurisdictions need guidance.

**Recommendation:** Add a §10.5 "Cross-Border Data Transfer" section to EXIT_SPEC addressing: (a) markers as portable personal data under GDPR Art. 44-49; (b) recommended transfer mechanisms; (c) encryption as a supplementary measure per EDPB guidance.

### 12. Dispute Resolution is Non-Blocking
**Status:** ✅ PASS

- EXIT_SPEC §5.4: "Disputes MUST NOT block transitions (D-006). Disputes change metadata only."
- EXIT_SPEC §5.3: CONTESTED → FINAL is a valid transition; disputes are recorded but do not prevent departure.
- `src/dispute.ts`: `isDisputed()` and `getDisputeStatus()` are read-only queries — no blocking logic. `resolveDispute()` adds metadata, doesn't gate ceremony progression.
- ENTRY_SPEC §15.2: Asymmetry is explicit — "Unlike EXIT, where disputes never block departure, **the destination MAY block admission.**"

---

## Additional Findings

### LEGAL-F-003 (Informational): TrustEnhancers Conduit Liability
- `src/types.ts` `TrustEnhancers` interface has clear conduit-only disclaimers.
- Each attachment type (timestamps, witnesses, identity claims) explicitly states Cellar Door has "ZERO opinion on their truth, authenticity, or legal significance."
- This is well-designed liability isolation. No action required.

### LEGAL-F-004 (Informational): Legal Hold Structure
- EXIT_SPEC §3.3 defines `legalHold` with `holdType`, `authority`, `reference`, `dateIssued`, `acknowledged`.
- This is a data structure for recording holds, not a mechanism for enforcing them — appropriate separation of concerns.
- Implementation responsibility for compliance with actual legal holds rests with platforms, not the protocol.

### LEGAL-F-005 (Low): CCPA Specific Provisions
- GDPR compliance is well-documented throughout.
- CCPA is not explicitly mentioned in either spec, though the GDPR provisions (erasure, minimization, encryption) generally satisfy CCPA requirements.
- `deleteBySubject()` in ENTRY ClaimStore satisfies CCPA right-to-delete.

**Recommendation:** Add a brief note in §10.4 or §14 acknowledging CCPA applicability for California residents.

---

## Risk Matrix by Regulatory Domain

| Domain | Risk Level | Key Controls | Gaps |
|---|---|---|---|
| **GDPR** | 🟢 Low | Encryption MUST, crypto-shredding, DPIA requirements, Art. 17 erasure, redaction, minimal disclosure, on-chain anchoring warnings | Cross-border transfer guidance (F-002) |
| **CCPA** | 🟢 Low | Erasure via `deleteBySubject()`, encryption at rest, data minimization | No explicit CCPA mention (F-005) |
| **Sherman Act / Antitrust** | 🟢 Low | Anti-coordination clause (ENTRY §4.4), no shared blocklists, independent policy decisions, explicit antitrust reference | None |
| **Securities Act / Howey** | 🟢 Low | Anti-securitization clause (§14.1), Module D disclaimer, conduit-only trust enhancers, no tradeable reputation tokens | Theoretical third-party derivative risk (ADV-001) |
| **FCRA** | 🟢 Low | No consumer reports, advisory signals only, anti-weaponization clause, identity claims are opaque conduit | None |
| **FIPS 140-2/3** | 🟡 Medium | P-256 signature support available | XChaCha20 encryption not FIPS-approved (F-001); no FIPS encryption alternative specified |

---

## Summary

**Overall Legal Risk: LOW**

The cellar-door-exit v0.2.0 specification and codebase demonstrate mature legal/compliance awareness. Key protections are in place:

- Mandatory encryption with crypto-shredding erasure path
- Normative anti-securitization and anti-coordination clauses
- Securities disclaimers on Module D
- FCRA liability isolation via conduit-only design
- Non-blocking dispute resolution preserving right of exit
- Mandatory expiry preventing indefinite reputation effects

Two findings require attention:
1. **LEGAL-F-001 (Low):** FIPS encryption gap — document and provide alternative for regulated environments
2. **LEGAL-F-002 (Medium):** Cross-border data transfer guidance needed in spec

No blocking issues identified.
