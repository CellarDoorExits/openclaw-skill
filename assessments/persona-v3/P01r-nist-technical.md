# P01r: NIST Technical Review — EXIT Protocol v1.1 (Updated)

**Reviewer Persona:** Computer Scientist, NIST Information Technology Laboratory  
**Date:** 2026-02-25  
**Prior Review:** 2026-02-24 (Revise & Resubmit, 7 blockers identified)  
**Documents Reviewed:** EXIT_SPEC_v1.1.md, NIST_RFI_v2.md, signer.ts, SECURITY.md, HSM_INTEGRATION.md  
**Format:** Formal Technical Review Memo — Follow-Up

---

## 1. Disposition of Prior Blockers

My Feb 24 review identified 7 issues. I assess each against the revised materials.

| # | Prior Blocker | Status | Assessment |
|---|---|---|---|
| 1 | Ed25519-only, no FIPS algorithm | ✅ **Resolved** | P-256 added via `Signer` abstraction (signer.ts); spec §3.5.1 now lists both `Ed25519Signature2020` and `EcdsaP256Signature2019` with algorithm agility. Verifiers MUST accept both. |
| 2 | No HSM / FIPS-validated module path | ✅ **Resolved** | HSM_INTEGRATION.md provides concrete integration patterns for AWS KMS, Azure Key Vault, GCP KMS, and YubiKey PKCS#11. The `Signer` interface accepts async returns, enabling network-bound HSM calls. |
| 3 | No algorithm negotiation mechanism | ✅ **Resolved** | Algorithm is encoded in `proof.type` and DID multicodec prefix (spec §3.5.1). `createSigner()` factory accepts `algorithm` parameter. `algorithmFromProofType()` and `algorithmFromDid()` enable detection. This is adequate algorithm agility for a v0.x protocol. |
| 4 | XChaCha20-Poly1305 not FIPS-approved | ❌ **Not resolved** | Spec §10.1 still mandates XChaCha20-Poly1305 for marker encryption. No AES-GCM alternative is offered. Privacy module remains non-compliant for federal use. |
| 5 | Custom canonicalization, not JCS/RFC 8785 | ❌ **Not resolved** | Spec §13.1 defines "deterministic JSON with recursively sorted keys, no whitespace." This is close to but not identical to JCS (RFC 8785). Key differences: JCS specifies IEEE 754 number serialization; the EXIT spec does not address number serialization. Custom canonicalization remains an interoperability risk. |
| 6 | Test vectors not embedded with exact bytes | ⚠️ **Partially resolved** | Spec §17 now contains 11 test vectors inline (§17.1–§17.11). However, `proofValue` fields contain placeholder strings (`"z3FXQnMLzJqTnKxH..."`, `"zPreRot..."`). Without exact signature bytes tied to known keypairs, these vectors cannot verify cross-implementation signing correctness. They are structural examples, not cryptographic test vectors. |
| 7 | FreeTSA as default TSA | ❌ **Not resolved** | Spec §11.3.3 still defaults to `https://freetsa.org/tsr`. No change from prior review. |

**Score: 3 of 7 blockers resolved; 1 partially resolved; 3 unresolved.**

---

## 2. Assessment of New Additions

### 2.1 Signer Abstraction (signer.ts)

Well-designed. The interface is minimal (4 methods: `sign`, `verify`, `did`, `publicKey`), supports both sync and async returns, and cleanly separates algorithm choice from protocol logic. The `proofTypeForAlgorithm()` / `algorithmFromProofType()` functions correctly map between proof type strings and algorithm identifiers.

One concern: the `P256Signer` uses `@noble/curves` which, per SECURITY.md, has been independently audited but the *integration* has not. For FIPS deployments, the guidance to use HSM-backed signers is correct and clearly stated.

### 2.2 HSM Integration Guide

Substantive and practical. The AWS KMS, Azure Key Vault, and YubiKey examples are concrete enough to implement from. The guide correctly identifies that cloud HSMs generally do not support Ed25519, making P-256 the practical choice for FIPS deployments. The `init()` pattern for async key fetching is clean.

Minor gap: The GCP KMS example is a stub (`// Similar pattern to AWS`). Should be fleshed out for completeness.

### 2.3 Trust Enhancers (Conduit-Only Pattern)

The trust enhancer architecture (§18 in types: `TimestampAttachment`, `WitnessAttachment`, `IdentityClaimAttachment`) with explicit "conduit-only" semantics is a sound design choice. The protocol validates structure but takes no opinion on truth — this is the correct boundary for a transport-layer specification.

### 2.4 SECURITY.md

Honest and appropriately scoped. The disclosure that neither algorithm implementation has undergone formal security certification, combined with clear guidance to use HSM-backed signers for production, is the right approach for a pre-1.0 specification.

---

## 3. Answers to Specific Questions

### Q1: Does this move from "Revise & Resubmit"?

**Yes, conditionally.** The FIPS compliance path is now architecturally sound. P-256 + HSM integration + algorithm agility address the primary blocker from my prior review. The protocol can now be deployed in FIPS-regulated environments via the HSM path without protocol-level changes.

### Q2: Are remaining gaps still blockers for NIST engagement?

**XChaCha20:** Blocker for the privacy module only. The core signing/verification path is now FIPS-capable. I recommend: add an `encryptionAlgorithm` field to `EncryptedMarkerBlob` and define an AES-256-GCM profile alongside XChaCha20. This is a contained fix.

**Custom canonicalization:** Moderate risk. The current scheme will work if all implementations follow the spec exactly, but divergent number serialization (e.g., `1.0` vs `1` vs `1.00`) will produce different canonical forms and break cross-implementation signature verification. Adopting JCS (RFC 8785) or explicitly specifying number serialization rules would eliminate this class of bug. Not a hard blocker but a strong recommendation.

**FreeTSA:** Not a blocker for the protocol itself — the TSA URL is configurable. The default should be changed or removed. Recommend: no default TSA; require explicit configuration. FreeTSA in the spec text undermines credibility with federal reviewers.

**Test vectors:** Moderate concern. The structural vectors are useful; the missing cryptographic vectors mean independent implementors cannot validate their signing code against the spec alone. Recommend: publish at least 2 complete vectors (one Ed25519, one P-256) with known keypairs, exact canonical bytes, and exact signature bytes.

### Q3: Is the spec independently implementable?

**Substantially yes, with one critical gap.** The core schema, ceremony state machine, verification rules, and module structures are precisely specified. The `Signer` interface and proof types are clear. The canonicalization gap (§13.1 — no number serialization rule) is the remaining interoperability risk for independent implementation. An implementor in Go or Rust could build a conformant EXIT library from the spec, but might produce different canonical forms for markers containing floating-point numbers, causing signature verification failures against the TypeScript reference.

### Q4: Updated Verdict

**Conditional Accept — Recommend for NIST Monitoring with Minor Revisions**

The protocol has moved from "interesting but non-compliant" to "architecturally sound with a credible FIPS path." The Signer abstraction and HSM integration guide demonstrate that the team understands the federal compliance landscape and has made the correct architectural decisions to support it.

---

## 4. Remaining Recommendations (Priority-Ordered)

1. **Add AES-256-GCM encryption profile** alongside XChaCha20 in §10.1. Add `algorithm` field to `EncryptedMarkerBlob`. Estimated effort: small.

2. **Specify number serialization** in §13.1, or adopt JCS (RFC 8785) by reference. This is the highest interoperability risk remaining.

3. **Publish complete cryptographic test vectors** with known keys, canonical bytes, and exact signatures for both Ed25519 and P-256.

4. **Remove FreeTSA as default.** Make TSA URL a required parameter with no default, or reference NIST's internal TSA for federal contexts.

5. **Flesh out GCP KMS example** in HSM_INTEGRATION.md.

6. **Seek independent implementation.** A second implementation in a different language (Go, Rust, Python) would substantially strengthen the interoperability claim. Until then, "independently implementable" remains theoretical.

---

## 5. Summary

The EXIT Protocol has made material progress since my Feb 24 review. The FIPS compliance architecture is now sound. The core protocol (signing, verification, ceremonies) can be used in federal environments via P-256 + HSM. The privacy module remains non-compliant (XChaCha20) but this is a contained, fixable issue.

The protocol is approaching the maturity level where NIST technical staff should actively track its development and consider it as input to AI agent lifecycle standardization. It is not yet ready for normative reference in a NIST standard — the absence of a second independent implementation and the canonicalization ambiguity preclude that — but it is the most complete specification for agent departure/arrival ceremonies in the current landscape.

**Verdict: Conditional Accept (from prior Revise & Resubmit)**  
**Condition: Resolve items 1–4 above before any NIST normative reference.**

---

*Reviewed by: [NIST/ITL Reviewer Persona — P01]*  
*Prior review: P01-nist-technical.md (2026-02-24, Revise & Resubmit)*
