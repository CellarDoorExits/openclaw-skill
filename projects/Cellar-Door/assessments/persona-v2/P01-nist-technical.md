# P01: NIST Technical Review — EXIT Protocol v1.1

**Reviewer Persona:** Computer Scientist, NIST Information Technology Laboratory  
**Date:** 2026-02-24  
**Documents Reviewed:** NIST_RFI_v2.md, EXIT_SPEC_v1.1.md, EXIT_PAPER_v5.md  
**Format:** Formal Technical Review Memo

---

## 1. Summary Assessment

The EXIT Protocol specifies a verifiable departure marker format and ceremony state machine for AI agent mobility. The submission is technically detailed, accompanied by a reference implementation with 368 tests, and addresses a genuine gap in the agent interoperability landscape: no existing standard (A2A, MCP, ACP, OASF, AP2) covers agent lifecycle transitions.

---

## 2. Does This Address a Real Gap?

**Yes, with caveats.** The problem statement (§2 of the RFI, §1.1 of the paper) correctly identifies that agent departure is unaddressed by current standards. The FIPA agent lifecycle model treated termination as platform-internal; no successor standard has filled this gap. The submission's Table 1 (paper §2.8) fairly compares against Moloch Ragequit, W3C VC issuance, and Entra Agent ID — none provide the combination of agent-initiated exit, arrival verification, and hostile-origin tolerance.

However, the gap is currently *theoretical*. The paper acknowledges "no production deployment" (§11.1). The agent ecosystem has not yet reached the maturity where cross-platform agent migration is a common operational requirement. The protocol solves tomorrow's problem today — strategically sound, but the urgency claim should be moderated.

---

## 3. Cryptographic Choices and FIPS Compliance

### Ed25519

Ed25519 (EdDSA over Curve25519) is specified for all marker signatures (Spec §3.5, §5.1). **This is NOT FIPS-approved.** FIPS 186-5 approves EdDSA over Ed448 but not Ed25519 specifically. Federal agencies requiring FIPS 140-3 validated modules cannot use Ed25519 for compliant signatures. The spec hardcodes `"Ed25519Signature2020"` as the only valid proof type (Spec §3.5: "MUST be `Ed25519Signature2020` for v1.1").

**Recommendation:** The spec should define an algorithm agility mechanism. At minimum, allow `Ed448Signature2020` or ECDSA P-256/P-384 as alternatives for FIPS-mandated environments. The paper acknowledges a post-quantum migration path (§6.3: "plan migration to ML-DSA, SLH-DSA on a 2030–2035 timeline") but provides no concrete mechanism for algorithm negotiation.

### SHA-256

SHA-256 is used for content-addressed identifiers, redaction, and Merkle trees (Spec §3.7, §10.2, §11.2). SHA-256 is FIPS 180-4 approved. **Compliant.**

### RFC 3161

RFC 3161 TSA integration is present (Spec §11.3). However, the reference implementation provides **structural verification only** — it checks that the TSR contains expected hash bytes but does NOT verify the TSA's cryptographic signature (Spec §11.3.4, emphasized repeatedly). This is a significant gap. The spec is honest about this limitation, but any NIST-referenced implementation would need full cryptographic TSA verification.

**Concern:** The default TSA endpoint is `https://freetsa.org/tsr` (Spec §11.3.3). FreeTSA is not a qualified TSA under eIDAS or any US federal standard. Production NIST use would require a NIST-operated or NIST-approved TSA.

### XChaCha20-Poly1305

Encryption uses XChaCha20-Poly1305 (Spec §10.1). This is **not FIPS-approved**. FIPS-compliant environments require AES-GCM or AES-CCM. This blocks the privacy primitives (encryption, minimal disclosure) from use in federal contexts.

### Summary of FIPS Compliance

| Primitive | Standard | FIPS Status |
|-----------|----------|-------------|
| Ed25519 | — | ❌ Not approved |
| SHA-256 | FIPS 180-4 | ✅ Approved |
| RFC 3161 | — | ⚠️ Mechanism OK, implementation incomplete, default TSA non-compliant |
| XChaCha20-Poly1305 | — | ❌ Not approved |
| ECDH (x25519) | — | ❌ Not approved (FIPS uses P-256/P-384) |

**The protocol as specified cannot be deployed in FIPS-compliant environments without algorithm substitution.** The spec provides no mechanism for this substitution.

---

## 4. Is the Spec Independently Implementable?

**Mostly yes, with notable gaps.**

**Strengths:**
- The core schema (Spec §3) is precise: 8 mandatory fields with exact types, enumerations, and validation rules
- The ceremony state machine (Spec §5) is formally defined with explicit states, transitions, and invariants
- 11 test vectors are referenced (Paper §10.6, Table 3), though the actual vector data was not included in the reviewed documents
- Canonical JSON serialization is specified (Spec §13.1 referenced but section not in reviewed portion)
- RFC 2119 requirement levels are used throughout

**Gaps that would impede independent implementation:**

1. **Canonicalization underspecified in reviewed sections.** The spec references "deterministic JSON with recursively sorted keys (no whitespace)" (RFI §5.1) but the full canonicalization algorithm (referenced as §13.1) was not in the reviewed portion. This is the most critical interoperability surface — if two implementations canonicalize differently, signatures won't verify cross-implementation.

2. **Test vectors not embedded.** The spec references 11 test vectors in §17, but these were not present in the reviewed document (truncated at §12.6). Independently implementable specs must include normative test vectors with exact byte sequences.

3. **DID resolution underspecified.** Verification requires resolving `proof.verificationMethod` to a public key (Spec §6.2). The spec is DID-method-agnostic, which is good for flexibility but means two implementations might resolve the same DID differently. No normative DID resolution profile is specified.

4. **Confidence scoring is RECOMMENDED but not normative.** The scoring model (Spec §7.4) is explicitly non-normative ("Implementations MAY use different scoring models"). This means confidence scores are not interoperable across implementations — a verifier using the recommended model will produce different scores than one using a custom model. If NIST were to standardize this, the scoring model would need to be normative.

5. **KERI integration is partial.** The spec defines KERI structures (§9) but the paper describes these as "stubs" in places. The key event log verification procedure would need more formal specification for independent implementation.

---

## 5. What's Missing?

1. **Algorithm agility.** The single hardcoded algorithm (Ed25519) is the most significant technical gap for standardization purposes. Any NIST-adjacent standard must support algorithm negotiation and FIPS-approved algorithms.

2. **Formal security proofs.** The threat model (Paper §6, Table 2) is thorough but informal. No formal verification of the state machine properties, no reduction proofs for the cryptographic constructions. The claim that "disputes MUST NOT block transitions" (Spec §5.4) is an invariant that could be formally verified.

3. **Interoperability testing.** Only one implementation exists (TypeScript). There is no interoperability test suite, no cross-implementation validation. The 368 tests verify internal consistency, not cross-implementation portability.

4. **Performance at scale.** Benchmarks are provided (Paper §10.2: 525 full verifications/sec) but only for single-marker operations. No evaluation of Merkle batch performance beyond 1,000 markers, no analysis of ceremony latency under adversarial conditions.

5. **Post-quantum transition plan.** Acknowledged in the paper but no concrete mechanism. A post-quantum migration would require re-signing all existing markers or defining a dual-signature scheme. Neither is addressed.

6. **Revocation beyond keyCompromise.** The `keyCompromise` exit type is explicitly called a "stopgap" (SECURITY.md §2.3). No general revocation mechanism exists for markers whose content (not just key) becomes invalid.

---

## 6. Technical Merits

- The ceremony state machine is well-designed: three paths accommodate cooperative, unilateral, and emergency scenarios with clear invariants
- The modular architecture (core + 6 optional modules) achieves genuine separation of concerns
- The trust mechanism design (§7) honestly labels self-attestation as "cheap talk" (citing Akerlof and Crawford & Sobel correctly) and provides graduated alternatives
- The anti-weaponization clause (Spec §8.6) is normative, not advisory — a strong design choice
- The `selfAttested: true` boolean (D-009) is an elegant solution to the non-warranty problem
- Content-addressed identifiers (Spec §3.7) provide deterministic deduplication
- Marker size (~660 bytes signed) is practical for transport

---

## 7. Verdict

**Revise & Resubmit**

The protocol addresses a genuine gap with a technically sound architecture. The ceremony state machine, modular design, and trust mechanisms are well-conceived. However, three issues must be resolved before NIST engagement:

1. **FIPS compliance:** Algorithm agility must be added. Ed25519-only is a non-starter for federal adoption. At minimum, ECDSA P-256 and Ed448 must be supported, with a negotiation mechanism.

2. **Canonicalization formalization:** The canonical JSON algorithm must be fully specified with normative test vectors, ideally aligned with an existing standard (JCS per RFC 8785) rather than a custom scheme.

3. **TSA verification:** Structural-only TSA verification is insufficient. The reference implementation must demonstrate full cryptographic TSA verification, or the TSA integration should be marked as informational rather than normative.

The protocol is at a stage where NIST technical staff should monitor its development and consider it as input to agent lifecycle standardization work, but it is not yet ready for direct reference in a NIST standard.
