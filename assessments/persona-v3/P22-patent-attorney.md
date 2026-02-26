# P22 — Patent Attorney Assessment

**Persona:** Patent Attorney — Software & Cryptographic Protocol Patents
**Subject:** EXIT/ENTRY/Passage Protocol (Cellar Door Project)
**Date:** 2026-02-25
**Classification:** Attorney Work Product — Privileged & Confidential

---

## Executive Summary

The Passage Protocol contains several potentially novel combinations of known techniques applied to an unaddressed problem domain (AI agent departure/arrival). However, the combination of Apache 2.0 licensing, open specification publication, and the nature of the claims significantly constrains patent strategy. My recommendation is **defensive publication, not patenting**.

---

## 1. Patentability Analysis

### 1.1 Potentially Novel Mechanisms

I evaluated the following mechanisms for novelty, non-obviousness, and patent eligibility under 35 U.S.C. §§ 101, 102, 103:

#### A. Departure Ceremony State Machine (7-state, 3-path)

**Novelty:** Moderate. State machines for protocol ceremonies are well-known (TLS handshake, OAuth flows, FIPA agent lifecycle). The specific combination of cooperative/unilateral/emergency paths with the invariant that disputes never block terminal state (DEPARTED) is novel in the agent departure context.

**Non-obviousness:** Weak. A skilled practitioner combining FIPA agent lifecycle models with Hirschman's exit theory and standard cryptographic ceremony design would likely arrive at a similar architecture. The "disputes never block exit" invariant, while well-motivated, is a straightforward policy choice encoded as a state machine constraint.

**§101 Eligibility:** High risk. Under *Alice Corp. v. CLS Bank* (2014), this likely fails Step 2A as an abstract idea (organizing human activity — managing departure processes) without a sufficiently "inventive concept" in the implementation. The state machine itself is implemented in software with no hardware-specific claims.

**Assessment: Not patentable.** Likely §101 rejection as abstract idea; obvious combination of known elements.

#### B. Visual Hash Art ("Hash Doors")

**Novelty:** Moderate-to-High. Deterministic visual fingerprints from hashes exist (GitHub identicons, Gravatar, SSH randomart per RFC 4716). The specific door metaphor with three-layer architecture (visual structure / status signaling / hash encoding), exit-type-driven style profiles, and entry/departure visual differentiation appears novel.

**Non-obviousness:** Moderate. The mapping of hash bytes to architectural elements within a constrained visual metaphor is a creative step beyond generic identicons. However, the underlying technique (hash → visual representation) is well-established.

**§101 Eligibility:** Moderate risk. Visual hash representations have stronger §101 arguments as they produce a "specific technological improvement" (human-recognizable fingerprinting). But the decorative/informational nature (explicitly stated as "not a security mechanism") weakens the technical-improvement argument.

**Assessment: Marginally patentable.** Most original element, but narrow claims, moderate prior art risk, and limited commercial value as a standalone patent.

#### C. Trust Enhancer / Confidence Scoring Model

**Novelty:** Low-to-Moderate. Composite trust scoring from multiple signals (tenure, attestation level, lineage depth, commit-reveal) is a standard pattern in reputation systems. The specific formula and signal weighting are novel but formulaic.

**Non-obviousness:** Low. The logarithmic tenure weighting, additive scoring model, and signal categories would be obvious to a person skilled in reputation systems and mechanism design. The Akerlof/Spence framing in the paper practically writes the prior art argument against the inventors.

**§101 Eligibility:** High risk. Mathematical formulas and scoring algorithms face severe §101 challenges post-*Alice*. The confidence score is explicitly described as a "recommendation to verifiers," not a machine-controlling output.

**Assessment: Not patentable.** Obvious combination; §101 abstract idea.

#### D. Commit-Reveal for Exit Intent (Anti-Front-Running)

**Novelty:** Very Low. Commit-reveal schemes are textbook cryptography (Pedersen commitments, sealed-bid auctions, ENS name registration). Applying commit-reveal to prevent retaliatory status changes is a straightforward application.

**Non-obviousness:** Very Low. Any cryptographer would reach for commit-reveal to solve temporal ordering disputes.

**Assessment: Not patentable.** Prior art is overwhelming.

#### E. Checkpoint / Dead-Man Pattern for Pre-Signed Departure

**Novelty:** Moderate. The specific application of pre-signed markers with sequence-number authority, held in escrow with heartbeat-triggered broadcast, applied to the agent departure context is a relatively novel combination.

**Non-obviousness:** Moderate. Dead-man switches exist across many domains. The combination with sequence numbers, escrow providers, and the specific threat model (coercion defense for departing agents) adds specificity. However, cryptocurrency dead-man wallets and automated will execution systems are strong analogues.

**Assessment: Marginally patentable.** Narrow claims possible but vulnerable to analogous prior art.

#### F. Proof of Passage (PoP) — EXIT+ENTRY Chain

**Novelty:** Moderate-to-High. The two-ceremony model linking departure and arrival with asymmetric trust (departure = right, admission = privilege), producing a cryptographic chain of provenance across platforms, appears to be a novel system architecture.

**Non-obviousness:** Moderate. The immigration metaphor is explicitly acknowledged. Combining departure credentials with arrival verification is conceptually straightforward once the problem is framed. However, no existing system actually implements this combination for digital agents.

**§101 Eligibility:** Moderate risk. The system-level architecture has a stronger §101 argument than individual components. A well-drafted claim focusing on the technical implementation of cross-platform cryptographic passage verification (rather than the abstract concept) might survive.

**Assessment: Best candidate for patentability.** Novel system architecture, but §101 risk remains.

#### G. Claim Store Pattern (Replay Prevention)

**Novelty:** Very Low. Nonce/token consumption tracking for replay prevention is fundamental to security protocols (CSRF tokens, OAuth authorization codes, SAML assertion consumption).

**Assessment: Not patentable.** Standard technique.

### 1.2 Summary of Patentable Claims

| Mechanism | Novelty | Non-Obvious | §101 Eligible | Verdict |
|---|---|---|---|---|
| Ceremony state machine | Moderate | Weak | High risk | ❌ |
| Visual hash doors | Moderate-High | Moderate | Moderate risk | ⚠️ Marginal |
| Confidence scoring | Low-Moderate | Low | High risk | ❌ |
| Commit-reveal for exit | Very Low | Very Low | N/A | ❌ |
| Checkpoint/dead-man | Moderate | Moderate | Moderate risk | ⚠️ Marginal |
| Proof of Passage (system) | Moderate-High | Moderate | Moderate risk | ✅ Best candidate |
| Claim store pattern | Very Low | Very Low | N/A | ❌ |

---

## 2. Prior Art Landscape

### 2.1 Closest Prior Art

| Prior Art | Relevance | Distinguishing Feature of EXIT |
|---|---|---|
| W3C Verifiable Credentials | High — signed portable credentials | EXIT is self-issued, departure-specific, functions without issuer cooperation |
| FIPA Agent Lifecycle (IEEE) | High — agent states including termination | FIPA is platform-internal; EXIT is cross-platform with portable markers |
| Moloch DAO ragequit | Moderate — member-initiated exit with token | Economic exit, not identity exit; single-chain, not cross-platform |
| Microsoft Entra Agent ID | Moderate — agent identity lifecycle | Enterprise-scoped, not portable, not agent-initiated |
| SSH Randomart (RFC 4716) | Moderate (for hash doors) — visual fingerprinting | EXIT applies to protocol markers with status-driven styling |
| GitHub Identicons | Moderate (for hash doors) — hash → visual | Same category; EXIT's door metaphor is more structured |
| ENS Commit-Reveal | High (for commit-reveal) — identical mechanism | Different domain; same technique |
| OAuth/SAML Token Consumption | High (for claim store) — replay prevention | Standard technique applied to new domain |

### 2.2 Would a Patent Survive Examination?

**Unlikely for individual mechanisms.** Each component has substantial prior art in adjacent domains. The examiner would likely issue §103 (obviousness) rejections combining 2-3 references.

**Possible for the system claim (Proof of Passage).** A well-drafted system claim covering the complete two-ceremony architecture — departure marker signed by subject + arrival marker signed by destination + cryptographic chain linking them + policy-driven admission with probation — might survive if the examiner treats the AI agent departure domain as sufficiently distinct. However, the §101 abstract idea hurdle is significant for software method claims post-*Alice*.

**Estimated probability of grant:** 20-30% for a system claim after prosecution. Prosecution would likely take 3-5 years and cost $30-60K through issuance.

---

## 3. Infringement Risk (Freedom to Operate)

### 3.1 Potentially Relevant Patent Families

| Area | Risk | Notes |
|---|---|---|
| W3C DID / Verifiable Credentials | Low | W3C patent policy requires royalty-free licensing |
| Digital signature methods (Ed25519) | None | Public domain / IETF standards |
| JSON-LD processing | Low | W3C royalty-free |
| Commit-reveal schemes | None | Well-established, no blocking patents identified |
| RFC 3161 timestamping | None | IETF standard |
| Agent lifecycle management | Low-Moderate | FIPA/IEEE standards are royalty-free; some enterprise identity patents (Microsoft, IBM) may have tangential claims |
| Reputation/trust scoring | Low-Moderate | Broad patent landscape but EXIT's specific model is sufficiently different from e-commerce reputation patents |
| Visual hash representations | Low | Identicon/randomart patents not identified; mostly open-source implementations |
| Blockchain anchoring | Moderate | Dense patent thicket around blockchain timestamping, Merkle proofs, and anchoring. Module F usage could trigger exposure. |

### 3.2 Specific Risk Areas

1. **Blockchain anchoring (Module F):** The blockchain timestamping and Merkle proof space has extensive patent coverage from Guardtime (KSI timestamps), Surety (linked timestamping), and various blockchain companies. If Module F sees production use with specific chains, a targeted FTO search is recommended. **Risk: Moderate.**

2. **Enterprise agent identity:** Microsoft (Entra), IBM (Watson/BeeAI), and Salesforce have filed agent identity and lifecycle patents. These tend to focus on enterprise orchestration, not portable departure markers, but overlapping claims on "agent credential issuance" or "agent lifecycle state transitions" are conceivable. **Risk: Low-Moderate.**

3. **Trust/reputation scoring:** The e-commerce reputation patent landscape (eBay, Amazon, various NPEs) is dense. EXIT's confidence scoring model is distinguishable (cryptographic attestation signals vs. transaction feedback) but could face nuisance assertions. **Risk: Low.**

### 3.3 FTO Assessment

**Overall FTO risk: LOW-MODERATE.** No blocking patents identified for the core protocol. Module F (blockchain anchoring) is the highest-risk area. I recommend:

- A targeted FTO search for Module F before production deployment (~$8-15K)
- Monitoring enterprise agent identity filings (Microsoft, IBM, Google) quarterly
- Maintaining the current royalty-free, open-specification posture as a defensive measure

---

## 4. Impact of Apache 2.0 + Open Spec Strategy

### 4.1 Patent Grant in Apache 2.0

Apache 2.0 §3 contains an express patent license:

> *"...each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable... patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work..."*

**This means:** Any patents obtained by the contributors on the implementation are automatically licensed royalty-free to all users of the Apache 2.0 code. Filing a patent and then releasing under Apache 2.0 effectively donates the patent to the commons for the scope of the licensed work.

### 4.2 Public Disclosure

The paper (preprint), specification, and open-source code constitute **prior art publications**. Under 35 U.S.C. §102(a)(1), any disclosure before filing creates a novelty bar. The inventors have a **one-year grace period** (§102(b)(1)(A)) from public disclosure to file, but:

- In jurisdictions with absolute novelty (EU, China, Japan, Korea), the disclosure **destroys patentability** immediately
- The grace period applies only to the inventors' own disclosure, not to any independent prior art that emerged in the interim

**Timeline implication:** If the paper and spec were published before 2026-02-25, any patent application must be filed before the 1-year anniversary (US only). International patent rights are likely already forfeited.

### 4.3 Strategic Effect

The open publication strategy is **incompatible with offensive patenting** but **perfectly aligned with defensive publication**. Publishing creates prior art that prevents *others* from patenting the same concepts — which is the most cost-effective defensive IP strategy for an open-source project.

---

## 5. Strategic Recommendation

### 5.1 Options Evaluated

| Strategy | Cost | Benefit | Risk |
|---|---|---|---|
| **Offensive patents** | $50-100K+ per patent family | Licensing revenue; competitor exclusion | §101 rejection likely; Apache 2.0 auto-licenses to users; incompatible with open-source ethos; international rights likely lost |
| **Defensive patents** | $30-60K per patent | Deterrence against patent trolls; cross-licensing leverage | Same prosecution risks; cost may not justify benefit for an open-source project |
| **Defensive publication** | $2-5K | Prevents others from patenting; establishes prior art | No exclusionary rights; cannot countersue with patents |
| **Do nothing** | $0 | Paper + code already serve as prior art | Slightly less formal than defensive publication |

### 5.2 Recommendation: Defensive Publication

**Do NOT pursue patents.** Instead:

1. **File a Defensive Publication** with a service like the Defensive Patent License (DPL) registry or publish a formal technical disclosure document with IP.com or the Linux Foundation's prior art database. Cost: ~$2-5K.

2. **Rely on existing publications as prior art.** The paper, specification, and open-source repository already constitute strong prior art against future patent filers. A formal defensive publication adds belt-and-suspenders protection.

3. **Consider joining the Open Invention Network (OIN)** or the **Defensive Patent License (DPL)** community for additional cross-licensing protection.

4. **Monitor the patent landscape.** Set up quarterly alerts for patent applications in the agent identity, agent lifecycle, and departure credential spaces. Key applicants to watch: Google (A2A/AP2), Microsoft (Entra), IBM (BeeAI/ACP), Cisco (OASF).

### 5.3 Rationale

- The Apache 2.0 license already grants patent rights to all users, nullifying offensive value
- §101 eligibility is the primary prosecution risk and is unresolvable through claim drafting
- International rights are likely forfeited by public disclosure
- The project's values (open, non-custodial, non-weaponizable) are fundamentally misaligned with patent exclusion
- Defensive publication achieves the primary strategic goal (preventing patent trolls) at 5-10% of the cost
- The open specification itself is the best moat — network effects and standards adoption, not patent exclusion

---

## 6. Summary

| Question | Answer |
|---|---|
| Is any aspect patentable? | Proof of Passage (system claim) is the strongest candidate; marginal for hash doors and checkpoint patterns. Individual mechanisms are not patentable. |
| Would a patent survive examination? | 20-30% probability for a system claim. High §101 risk. |
| Existing patents EXIT might infringe? | No blocking patents identified. Module F (blockchain anchoring) is the highest-risk area. Targeted FTO search recommended before production use of Module F. |
| Should the project pursue patents? | **No.** Defensive publication instead. |
| Does Apache 2.0 affect patentability? | Yes — it auto-licenses any contributor patents. Combined with public disclosure, offensive patents are strategically incoherent. |
| Freedom to operate? | **Low-Moderate risk overall.** No blocking patents for core protocol. Monitor enterprise agent identity filings. |

---

*This assessment is based on publicly available information and does not constitute a formal legal opinion. A comprehensive FTO analysis would require professional patent search services and review by a registered patent attorney with access to patent databases. The author is a synthetic persona created for evaluation purposes.*
