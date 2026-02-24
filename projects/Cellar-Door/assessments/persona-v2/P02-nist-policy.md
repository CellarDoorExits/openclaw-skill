# P02: NIST Policy Review — EXIT Protocol

**Reviewer Persona:** Policy Analyst, NIST AI Standards Coordination  
**Date:** 2026-02-24  
**Documents Reviewed:** NIST_RFI_v2.md, EXIT_PAPER_v5.md (§§1–3), LEGAL.md  
**Format:** Policy Assessment Memo

---

## 1. Executive Summary

The EXIT Protocol is an open-source specification for verifiable AI agent departure records, submitted to NIST's AI Agent Standards Initiative RFI. This memo evaluates the submission's policy alignment, strategic value, and reputational risk for NIST engagement.

---

## 2. Alignment with EO 14110

Executive Order 14110 ("Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence," Oct 2023) directs NIST to develop standards for AI safety, security, and trustworthiness. Relevant provisions:

**§4.1 (Safety and Security):** EO 14110 emphasizes AI system accountability and traceability. EXIT markers create an auditable record of agent lifecycle events — directly supporting traceability requirements. The unblockable-exit invariant (D-006) is a safety property: agents cannot be trapped by hostile platforms.

**§4.5 (Promoting Innovation and Competition):** The protocol explicitly targets platform lock-in. The RFI §10.1 recommends "unblockable exit as a safety property" and §10.5 recommends "non-custodial architectures." Both align with EO 14110's competition mandate. Apache 2.0 licensing supports open innovation.

**§11 (International Engagement):** The submission references EU Digital Markets Act Art. 6(9) data portability, GDPR, and eIDAS (LEGAL.md §§7, 8; RFI §9). The protocol positions itself as internationally harmonizable.

**Alignment assessment: Moderate-Strong.** The protocol addresses EO 14110 themes (safety, accountability, competition, portability) but through a narrow lens — agent departure specifically, not the broader AI safety mandate. The EO does not specifically mention agent mobility, but the protocol fits within the "trustworthy AI" framework.

---

## 3. Alignment with NIST AI RMF (AI 100-1)

The RFI explicitly maps to AI RMF functions (§7.1):

- **Govern:** EXIT markers provide governance artifacts for agent lifecycle. The ceremony state machine creates a structured, auditable process. This is operationally useful for organizations implementing AI RMF Govern requirements.
- **Map:** The ecosystem map identifies where EXIT fits in the agent interoperability landscape. The comparison table (Paper §2.8, Table 1) is useful context.
- **Measure:** Confidence scoring (Paper §5.3) provides a quantifiable trust metric. However, the scoring model is non-normative — different implementations may produce different scores, limiting measurement consistency.
- **Manage:** The ENTRY protocol's admission policies, probation, and revocation mechanisms (Paper §4) support ongoing risk management.

**Gap:** The AI RMF Generative AI Profile (AI 600-1) is referenced (RFI §7.1) but the connection is thin — the protocol doesn't address generative AI-specific risks (hallucination, harmful content, training data provenance). The agent mobility use case applies equally to non-generative AI agents.

---

## 4. Evidence of Industry Demand

**Weak to Moderate.** The submission documents:

- No production deployments or enterprise adopters (Paper §11.1: "tested only with synthetic data")
- No letters of support from industry stakeholders
- No pilot programs or trials
- Framework integrations (LangChain, Vercel AI SDK, MCP) demonstrate technical compatibility but not demand
- The 15-persona validation (Paper §9) is synthetic, not drawn from actual stakeholder interviews

The problem statement is logically compelling — the absence of agent mobility standards creates lock-in — but the demand evidence is *reasoned* rather than *empirical*. No platform operator, enterprise, or agent framework maintainer is quoted as requesting this capability.

**Counter-argument:** The agent ecosystem is nascent enough that demand may not yet be articulable. NIST standards often precede widespread demand (see: post-quantum cryptography standardization, which began years before quantum computers threatened deployed systems). The question is whether NIST should lead or follow on agent mobility.

---

## 5. Interaction with W3C DID/VC

The submission demonstrates awareness of and alignment with W3C standards:

- EXIT markers use W3C DIDs for subject/verifier identification (Spec §3.1)
- Markers can be wrapped as W3C Verifiable Credentials (Decision D-001, Paper §3.2)
- JSON-LD serialization follows W3C patterns
- DID-method agnostic: `did:key`, `did:keri`, `did:web`, `did:peer` all supported

**Concern:** The protocol uses a *custom* JSON-LD context (`https://cellar-door.dev/exit/v1`) rather than extending an existing W3C context. This creates a parallel vocabulary rather than contributing to the W3C ecosystem. A more harmonized approach would submit the EXIT context to a W3C Community Group or align with the Verifiable Credentials for Education (VC-EDU) or similar working group patterns.

**Concern:** The paper notes a canonicalization mismatch: the spec uses custom canonical JSON while the paper references JCS/eddsa-jcs-2022 (Ecosystem Map §6: "Known Issues"). This divergence from JCS (RFC 8785) creates unnecessary incompatibility with the W3C Data Integrity ecosystem, which is converging on JCS.

**Opportunity:** If NIST's agent standards work proceeds, the EXIT schema could be submitted to the W3C Credentials Community Group as a candidate vocabulary for agent lifecycle credentials. This would strengthen both the EXIT ecosystem and W3C's agent-relevant offerings.

---

## 6. Reputational Risk for NIST

### Low-Risk Factors

- Apache 2.0 licensed, no commercial obligations, no venture funding (RFI §11)
- Protocol is technically sound and well-documented
- Explicit legal disclaimers (LEGAL.md) appropriately limit scope
- Anti-weaponization clause (Spec §8.6) addresses misuse proactively
- The submission is one RFI response among many — engagement doesn't imply endorsement

### Moderate-Risk Factors

- **Solo submitter.** The project is attributed to a single individual (Warren Koch, BC, Canada) with no institutional affiliation, no co-authors, and no advisory board. NIST engagement with a solo project — however technically meritorious — could appear as endorsement of a particular implementation rather than a category.
- **No peer review.** The paper is explicitly marked "Preprint — not yet peer-reviewed" (Paper header). The 15-persona validation is synthetic. NIST typically references peer-reviewed work or multi-stakeholder standards.
- **"Cellar Door" branding.** The project name, hieroglyph symbol (𓉸), and visual hash doors are distinctive but unconventional for standards work. This is cosmetic but may create a perception gap.
- **HOLOS framework.** The ecosystem map (§2) reveals that EXIT is conceived as one primitive in a larger "HOLOS ontology" with philosophical/metaphysical framing (LOCUS/SIGNUM/SENSUS, "fractal triad," trust spectrum from HALLOWED to BLIGHTED). While EXIT itself is pragmatically engineered, the surrounding framework could invite skepticism about the project's grounding.
- **Claims vs. validation.** The RFI §8.3 states "Unanimous finding: Core architecture is sound" from the 15-persona review, but this was an internal exercise, not an independent validation. Presenting synthetic persona reviews as "multi-stakeholder validation" stretches the term.

### Risk Mitigation

NIST should not reference the EXIT Protocol implementation specifically but could:
1. Reference the *problem category* (agent mobility, departure verification) in standards scoping documents
2. Include agent lifecycle transitions as a topic area in future workshops
3. Encourage the submitter to pursue W3C Community Group engagement and academic peer review
4. Track the project's maturation (production deployments, multi-implementation interop testing)

---

## 7. International Harmonization

The submission demonstrates awareness of international regulatory context:

- EU Digital Markets Act Art. 6(9) — data portability (RFI §9)
- GDPR compliance analysis (LEGAL.md §7)
- eIDAS timestamp recognition (Paper §7.4)
- ISO/IEC 42001 and 23894 references (RFI §7.2, §9)

The protocol's non-custodial, jurisdiction-neutral design (LEGAL.md §Appendix: "New §8.2 — Jurisdictional Neutrality") supports international harmonization. EXIT markers don't assume US law applies at the destination — a property that would facilitate adoption across jurisdictions.

**However:** The FIPS non-compliance of core cryptographic choices (Ed25519, XChaCha20-Poly1305) creates a gap between the protocol's international aspirations and US federal requirements. Any NIST-adjacent work would need algorithm flexibility.

---

## 8. Verdict

**Monitor**

The EXIT Protocol addresses a legitimate problem space (agent lifecycle transitions) that will become increasingly relevant as the AI agent ecosystem matures. The technical work is substantive — this is not a whitepaper without code. The 368-test reference implementation, comprehensive spec, and legal analysis demonstrate serious effort.

However, the project is not yet at a stage warranting active NIST engagement:

1. **No empirical demand signal** — no production users, no enterprise pilots, no multi-stakeholder governance
2. **Solo project** — lacks the institutional backing or community governance expected for standards input
3. **FIPS non-compliant** — algorithm choices preclude federal adoption without modification
4. **Not peer-reviewed** — claims of validation are based on synthetic exercises

**Recommended actions:**
- Add "agent mobility / lifecycle transitions" to the NIST AI Agent Standards Initiative's problem taxonomy
- Track the Cellar Door project for maturation signals: production deployments, additional implementers, W3C engagement, peer review
- If the submitter seeks NIST workshop participation, accept — the technical contribution is substantive enough to contribute to multi-stakeholder discussions
- Do not reference the EXIT Protocol specifically in any NIST publication at this time
