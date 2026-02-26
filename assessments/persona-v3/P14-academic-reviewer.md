# P14: Academic Peer Reviewer — Referee Report

**Paper:** "The Passage Protocol: Verifiable Agent Departure and Arrival Ceremonies"
**Reviewer expertise:** Distributed systems, applied cryptography, protocol design
**Reviewing for:** Top-4 security venue (IEEE S&P / USENIX Security / ACM CCS / NDSS)

---

## Verdict: **Weak Reject**

---

## Summary

The paper proposes a two-part protocol (EXIT + ENTRY) for creating cryptographically signed departure and arrival records for AI agents moving between platforms. It builds on DIDs, Ed25519 signatures, JSON-LD, and RFC 3161 timestamping to produce portable "Proof of Passage" chains. A TypeScript reference implementation with 399 tests is provided.

---

## Detailed Comments by Section

### Abstract / Introduction (Sections 1–2)

The problem framing is compelling. The Hirschman exit/voice/loyalty lens is well-chosen and the immigration analogy is effective. However, the paper oversells the contribution. The abstract reads like a product announcement, not a research paper. Listing "399 passing tests" and "five npm packages" in the abstract is an engineering metric, not a scientific contribution.

**The core question the paper never convincingly answers: who actually needs this today?** The scenarios in §1.1 are hypothetical. No evidence is presented that agent platform migration is a real, current problem at any meaningful scale. The paper would benefit enormously from a single concrete deployment or user study.

### Related Work (Section 2)

Adequate breadth but shallow depth. The comparison table (Table 1) is useful. However:

- **Conspicuously missing:** Bluesky's AT Protocol and account portability (did:plc, PDS migration) — this is *the* deployed system closest to what the paper proposes, and it isn't cited. ActivityPub/Mastodon account migration is another obvious comparator.
- **Missing:** The entire body of work on **portable reputation systems** (Resnick et al. 2000, Jøsang et al. 2007 on trust transitivity, EigenTrust).
- **Missing:** **Decentralized credential revocation** literature (accumulator-based, CRL alternatives).
- **Missing:** Work on **TEE-based attestation** (Intel SGX, ARM TrustZone) for platform co-signatures that can't be forged by the platform operator.
- **Missing:** **Certificate Transparency** (Laurie et al., RFC 6962) — the git ledger is essentially a poor man's CT log without the formal guarantees.
- The FIPA comparison is good but the paper doesn't engage with why FIPA's lifecycle model was sufficient for its era and what has fundamentally changed.

### EXIT Protocol (Section 3)

The core schema is clean and minimal — this is good engineering. The ceremony state machine is well-defined. Specific concerns:

1. **The `selfAttested: true` flag is not a contribution.** Every self-signed credential is self-attested by definition. Making this explicit is a UI/UX decision, not a protocol innovation.

2. **Eight exit types vs. extensibility.** The paper presents a fixed enum of 8 types but provides no formal argument for completeness. Why these 8? Why not an extensible type system with a core set? The `constructive` type in particular imports a legal concept (constructive dismissal) whose applicability to AI agents is entirely speculative.

3. **Content-addressed IDs are standard practice** in IPFS, git, and W3C VCs. This is not novel.

4. **The "disputes never block exit" invariant (D-006)** is the single most interesting design decision in the paper, but it receives only cursory formal treatment. This deserves a proper game-theoretic analysis showing the welfare implications of both design choices (blocking vs. non-blocking disputes).

### ENTRY Protocol (Section 4)

Solid systems design. The departure-is-a-right / admission-is-a-privilege asymmetry is the paper's strongest conceptual contribution. The admission policy framework is practical. Concerns:

1. **No formal policy language.** Admission policies are described informally. A real contribution would be a formal policy algebra with composability proofs (cf. XACML, Becker et al.'s Cassandra).
2. **Claim tracking is underspecified.** How does cross-destination claiming interact with privacy? If destinations can see that an EXIT marker was claimed elsewhere, this leaks movement information.

### Trust and Anchoring (Section 5)

This is the weakest technical section. The game-theoretic framing is promising but never delivered:

1. **The "departure game" (§5.2) is described in prose but never formalized.** No utility functions. No equilibrium analysis. No proofs. Citing Spence (1973) and Akerlof (1970) does not constitute a game-theoretic analysis — it constitutes name-dropping. A real submission would include a formal game model with at least a proposition and proof sketch showing that the proposed mechanisms shift equilibrium structure.

2. **Confidence scoring (§5.3) is an ad-hoc weighted sum** with no justification for the weights. Why does status get 0.4 max and lineage 0.15? What happens if an attacker optimizes against these exact weights? There is no robustness analysis. Compare this to proper trust aggregation systems (Marsh 1994, Jøsang's subjective logic).

3. **Tenure weighting assumes honest timestamps.** A Sybil origin can attest any tenure duration. The paper acknowledges this but the "logarithmic decay" mitigation is just a heuristic with no formal backing.

4. **TSA integration with structural-only verification** is, as the paper acknowledges, essentially security theater. The paper deserves credit for honesty here but this undermines the "trusted timestamping" contribution claim.

### Security Analysis (Section 6)

The threat model table format is good practice. However:

1. **No formal security model.** No reduction proofs. No UC framework analysis. No computational hardness assumptions stated beyond "Ed25519 is 128-bit secure." For a top security venue, this is disqualifying.

2. **The Sybil origin attack (§6.2)** is acknowledged but the proposed defenses (allowlists, tenure weighting, web-of-trust) are all hand-waved. "Future web-of-trust mechanisms" is not a mitigation.

3. **No privacy analysis.** Passage histories create detailed movement trails. The paper mentions ZK selective disclosure as future work but provides no analysis of current privacy properties. What does an adversary learn from observing the public protocol messages?

4. **T10 (Trojan horse arrival)** — "ENTRY verifies provenance, not intent" is an honest admission that the protocol provides no security guarantee against the most obvious attack: a malicious agent with a clean record.

### Legal/Ethics (Sections 7–8)

Impressively thorough for a systems paper. The GDPR analysis, agent personhood discussion, and ethics framework are well above the standard for this type of work. The "company town" problem identification is insightful. These sections are the paper's strongest non-technical contribution.

### Multi-Lens Validation (Section 9)

**This is not a valid evaluation methodology for a research paper.** Using 15 "synthetic professional personas" (presumably LLM-generated reviews) as validation is circular reasoning: an AI system reviewing an AI system designed for AI systems, with no ground truth. No peer-reviewed venue would accept this as evaluation. It should be removed entirely or reframed as "design exploration" with appropriate caveats.

### Implementation (Section 10)

Good engineering documentation. Performance numbers are reasonable. The framework integrations demonstrate practical applicability. However:

1. **No comparison benchmarks.** What does sub-millisecond ceremony timing compare against? There's no alternative system to benchmark against.
2. **No scalability evaluation.** What happens with 10M markers? 100M? The Merkle tree numbers (2.7ms for 10, 22.7ms for 1000) suggest linear scaling that will become problematic.
3. **"Hash doors" (§10.5) are whimsy, not contribution.** Remove from the paper.

---

## What's Genuinely Novel vs. Assembly of Known Primitives

**Genuinely novel:**
- The *problem definition* itself: framing agent departure as requiring a protocol is a valid conceptual contribution
- The departure-right / admission-privilege asymmetry as a design principle
- The D-006 invariant (disputes never block exit) and its governance implications
- The checkpoint/dead-man pattern for coercion resistance in agent contexts

**Assembly of known primitives (not novel):**
- Ed25519 signatures over JSON-LD documents (= W3C Verifiable Credentials)
- RFC 3161 timestamping (decades old)
- Content-addressed identifiers (git, IPFS)
- DID-based identity (W3C standard)
- Git as append-only log (Certificate Transparency did this better)
- Confidence scoring via weighted sums (standard trust management)
- Commit-reveal schemes (textbook)

The honest characterization: **this is a well-engineered application of known cryptographic and identity primitives to a new problem domain.** The novelty is in the problem identification and the specific combination, not in any individual mechanism.

---

## Would This Pass IEEE S&P or USENIX Security?

**No.** Specific reasons:

1. **No formal security proofs.** Both venues require formal security models for protocol papers.
2. **No real-world deployment or evaluation.** Synthetic validation is insufficient.
3. **The threat model acknowledges but doesn't solve its core challenges** (Sybil origins, self-attestation as cheap talk, trojan horse arrival).
4. **The game theory is informal.** Citing Akerlof and Spence without formal modeling would draw reviewer criticism at any economics-adjacent venue.
5. **The "multi-lens validation" methodology would be flagged** as inappropriate by every reviewer.

---

## Most Appropriate Venue

The paper is not ready for a top-4 security venue. With significant revision, potential targets include:

1. **USENIX ATC or EuroSys** (systems track) — if reframed as a systems contribution with real deployment evaluation
2. **ACM AIES** (AI Ethics and Society) — the governance/ethics angle is strong enough for this venue
3. **IEEE DAPPS or ACM Blockchain** — if the anchoring mechanisms are formalized
4. **Workshop paper at IEEE S&P or USENIX Security** — the problem framing deserves exposure even if the solution isn't mature
5. **Internet-Draft / RFC track** — arguably the most impactful path; this reads more like a protocol specification than a research paper, and that's not a criticism

---

## Specific Suggestions for Improvement

1. **Formalize the departure game.** Define utility functions for Subject, Origin, and Destination. Prove (or at least conjecture with evidence) that the proposed mechanisms shift equilibria. This is the difference between "we cite game theory" and "we do game theory."

2. **Drop the multi-lens validation entirely.** Replace with either (a) a real deployment on 2-3 platforms, (b) a formal simulation with agent populations, or (c) a user study with platform operators evaluating the protocol's utility.

3. **Add a formal security model.** At minimum, define the adversary capabilities precisely, state security properties as formal definitions, and prove the core properties hold. The UC framework would be ideal for a composable protocol.

4. **Cite and compare with AT Protocol / Bluesky.** This is the elephant in the room. did:plc with PDS migration is a deployed system solving an adjacent problem. Explain why that approach is insufficient for agents.

5. **Perform a privacy analysis.** Define what an observer (passive/active, internal/external) learns from protocol messages. Quantify linkability across Passage chains.

6. **Remove the hash doors section.** It's charming but it costs credibility in a research paper.

7. **Justify the confidence scoring weights.** Either derive them from a principled model or present a sensitivity analysis showing the system is robust to weight perturbation.

8. **Complete the TSA verification.** Structural-only verification undermines a claimed contribution. Either implement full verification or remove TSA from the contribution list.

9. **Address the "who needs this today" question empirically.** Survey platform operators. Document real agent migration failures. Provide evidence that the problem exists at scale.

10. **Split the paper.** At 12 sections covering protocol design, game theory, legal analysis, ethics, implementation, and validation, this paper tries to do too much. Consider: (a) a protocol paper with formal analysis, and (b) a separate SoK/position paper on agent mobility governance.

---

## Minor Issues

- The 𓉸 hieroglyph is charming branding but inappropriate for a research paper
- Several references are to LinkedIn posts and blog posts — replace with peer-reviewed sources where possible
- The securities disclaimer in the TypeScript source code (Module D) suggests legal review occurred but the paper doesn't discuss this adequately
- "399 passing tests" is mentioned three times — once is enough
- The paper is approximately 2x the typical page limit for any of the target venues

---

## Summary Assessment

This is a thoughtful, well-engineered protocol addressing a genuine gap in the AI agent ecosystem. The problem identification is the paper's strongest contribution. The implementation quality appears high. However, the paper lacks the formal rigor (security proofs, game-theoretic analysis, privacy model) required for a top security venue, and the evaluation methodology (synthetic persona review) is not credible for peer review. The most impactful path forward may be the IETF/standards track rather than the academic publication track — this is fundamentally a protocol specification, and a good one, but it is not yet a research paper.

**Verdict: Weak Reject** — significant revision required. Resubmission encouraged after formalization and real-world evaluation.

---

*Reviewed: 2026-02-25*
*Reviewer: P14 (Academic Peer Reviewer — Distributed Systems & Applied Cryptography)*
