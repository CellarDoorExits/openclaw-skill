# P18 — Multi-Agent Systems Researcher Evaluation

**Persona:** PhD researcher in agent-to-agent coordination and LLM-based multi-agent systems  
**Published at:** AAMAS, NeurIPS, ICML  
**Date:** 2026-02-25  
**Documents reviewed:** EXIT_PAPER_v5.md, cellar-door-exit README, ENTRY_SPEC_v1.0.md

---

## Verdict: **Would-Cite** (narrowly, with caveats)

I would cite this in a related work section on agent lifecycle management and portability primitives. I would not cite it as a solved problem or as a validated MAS contribution. The protocol identifies a genuine gap but lacks the empirical grounding and formal analysis that the MAS community expects.

---

## 1. Does this solve a real problem in current multi-agent systems?

**Yes — but the problem hasn't bitten hard enough yet for most researchers to care.**

Current MAS frameworks (AutoGen, CrewAI, LangGraph) operate in ephemeral, single-orchestrator settings. Agents are instantiated, do work, and are discarded. There's no meaningful "departure" because there's no meaningful "residence." The problem the Passage Protocol addresses — portable identity and verifiable lifecycle transitions across independent platforms — is real but *prospective*. It assumes an ecosystem of persistent, platform-hosted agents that migrate between independent operators. We're not there yet, but we're heading there.

The paper correctly identifies the information asymmetry at platform boundaries (Akerlof framing) and the governance implications of costly exit (Hirschman). These are well-grounded theoretical observations. The gap is between the theoretical problem and the current practical reality: nobody is currently blocked on agent departure standardization.

**Score: 7/10.** Real problem, early timing.

## 2. How would this integrate with existing agent frameworks?

**Poorly in current architectures. Potentially well in future ones.**

| Framework | Integration Path | Difficulty |
|---|---|---|
| **AutoGen** | Agents are conversational objects with no platform notion. EXIT/ENTRY would need to wrap the agent lifecycle manager. No natural hook exists. | High — requires architectural changes |
| **CrewAI** | Crew-level orchestration. An agent "leaving" a crew is just task reassignment. Departure ceremony is semantically mismatched — crews are ephemeral. | Medium-High — conceptual mismatch |
| **CAMEL** | Role-playing framework. Agents don't persist. Migration is meaningless in current form. | Very High — wrong abstraction level |
| **LangGraph** | Graph-based workflows. Nodes are functions, not persistent agents. However, LangGraph's state management could carry EXIT markers as graph state. | Medium — possible via state injection |

The existing LangChain/Vercel AI SDK/MCP integrations are the right approach — meeting developers where they are. But these integrations feel bolt-on rather than architecturally native. The real integration story requires platforms that host *persistent* agents (think: agent-as-a-service providers, autonomous agent marketplaces). Those platforms don't widely exist yet.

**Key insight:** The protocol will become relevant when the agent hosting model shifts from "developer instantiates agent in their code" to "agent lives on a platform and can be moved." The paper should make this architectural prerequisite explicit.

## 3. What are the overhead implications for agent-to-agent communication?

**Negligible for the protocol itself. Non-trivial for the ecosystem.**

The raw numbers are fine:
- ~660 bytes signed marker — trivial
- Sub-millisecond ceremony timing — irrelevant to any real workload
- Ed25519 operations at 200K+ ops/sec — not a bottleneck

The real overhead is **conceptual and coordination overhead**:
- Every platform must implement DID resolution, key management, and verification
- Claim stores need distributed consensus for cross-destination replay prevention
- TSA anchoring adds network round-trips and third-party dependencies
- Lineage chain verification grows linearly with agent history

For agent-to-agent communication specifically (A2A-style), the Passage Protocol is orthogonal — it's not a communication protocol. It's a lifecycle event protocol. The overhead question is really: "How much infrastructure must a platform deploy to participate?" Answer: non-trivial. DID infrastructure, key management, claim stores, policy engines. This is the real adoption barrier.

## 4. Is the "departure ceremony" concept meaningful or theatrical?

**Both, and that's the interesting tension.**

From a protocol engineering perspective, the seven-state ceremony is over-specified for what is fundamentally: create blob → sign blob → done. The three execution paths (cooperative, unilateral, emergency) collapse into: "sign with cooperation" or "sign without cooperation." The ceremony state machine adds formalism without adding capability — the FINAL→DEPARTED transition is always available, making intermediate states advisory.

However, I'll argue the ceremony framing serves two legitimate functions:

1. **Legibility for governance.** The states create audit points. INTENT with commit-reveal provides temporal evidence of non-retaliation. OPEN provides a dispute window. These are meaningful for the mechanism design story even if the state machine is technically bypassable.

2. **Norm-setting.** By naming states and transitions, the protocol establishes expectations. "You should go through INTENT before DEPARTED" is a norm, not an enforcement — but norms matter for ecosystem coordination.

The theatrical elements (door ASCII art, the 𓉸 hieroglyph, "Right of Passage" branding) are marketing, not research. They don't hurt, but a research venue would want them stripped.

**Assessment:** The ceremony is a reasonable engineering choice for structured lifecycle management. It's not meaningfully different from FIPA's agent lifecycle states, which also defined formal transitions that implementations could shortcut. Call it "lifecycle protocol" rather than "ceremony" for research contexts.

## 5. What's missing for this to be useful in a research context?

**Several significant gaps:**

### 5.1 No Formal Model
The paper uses game-theoretic language (pooling equilibria, separating equilibria, cheap talk) but provides no formal game model. Where is the utility function? What is the strategy space? What are the equilibrium conditions? The "Departure Game" section gestures at a three-player game but never writes it down. For AAMAS, this needs a proper extensive-form or Bayesian game with proofs.

### 5.2 No Empirical Evaluation
399 passing tests is engineering validation, not research evaluation. What's missing:
- Simulation of agent populations using the protocol under adversarial conditions
- Measurement of Sybil resistance under varying tenure thresholds
- Analysis of confidence score discrimination (ROC curves for distinguishing good-standing from adversarial agents)
- Network effect modeling: at what adoption threshold does the protocol become useful?
- Comparison with baseline (no protocol, or simple reputation systems)

### 5.3 No Comparison with MAS Reputation Systems
The related work covers DIDs, DAOs, and enterprise identity but completely ignores the rich MAS literature on trust and reputation:
- **FIRE** (Huynh et al., 2006) — multi-factor trust model
- **REGRET** (Sabater & Sierra, 2001) — social trust and reputation
- **Certified reputation** (Jurca & Faltings, 2003) — incentive-compatible reputation
- **Travos** (Teacy et al., 2006) — trust model for open MAS
- **Art** (Fullam et al., 2005) — agent reputation and trust testbed

The confidence scoring mechanism is essentially a simplified trust model. It should be positioned relative to this literature.

### 5.4 No Agent Mobility Analysis
FIPA and the mobile agent literature (Lange & Oshima, 1999; Chess et al., 1995) addressed agent migration extensively. The paper cites FIPA but doesn't engage with mobile agent security (code signing, execution integrity, state protection during migration). The Passage Protocol is weaker than mobile agent systems in that it doesn't address state portability — only state *referencing* via hashes.

### 5.5 Synthetic Validation is Not Validation
The 15-persona multi-lens review is creative but has no epistemic weight. These are LLM-generated assessments, not independent expert evaluations. Presenting them as validation is a red flag for reviewers. Remove or relabel as "design exploration."

## 6. How does this relate to existing work on agent mobility, trust, and reputation?

### Agent Mobility
The Passage Protocol is a **weak mobility** primitive — it provides departure/arrival records but does not migrate agent state, code, or capabilities. Classical strong mobility (Aglets, Voyager, D'Agents) moved the agent itself. The Passage Protocol moves a *credential about the agent*. This is closer to the **mobile credential** pattern in federated identity (SAML assertions, OAuth tokens) than to agent mobility proper.

### Trust and Reputation
The confidence scoring system is an ad-hoc trust model. Compared to established MAS trust frameworks:
- No learning from interaction history (unlike FIRE, Travos)
- No social dimension (unlike REGRET)
- No incentive-compatibility analysis (unlike Jurca & Faltings)
- Tenure-weighted trust is a proxy for direct experience, but it's easily gamed by Sybil origins (the paper acknowledges this)

The commit-reveal mechanism for detecting retaliation is genuinely novel in this context. I haven't seen temporal commit-reveal applied specifically to departure-retaliation detection. This deserves more formal treatment.

### Reputation Portability
The closest existing work is **cross-platform reputation portability** in P2P and marketplace systems (Resnick et al., 2006; Dellarocas, 2003). The Passage Protocol's contribution is framing reputation portability as a *departure event* rather than a continuous query — you carry your record when you leave, rather than having it queried in real-time. This is a meaningful design choice for decentralized, non-custodial settings.

---

## Positioning in MAS Literature

The Passage Protocol sits at the intersection of:
1. **Agent lifecycle management** (FIPA heritage)
2. **Decentralized identity** (W3C DID/VC)
3. **Trust and reputation** (FIRE, REGRET, etc.)
4. **Mechanism design** (Hirschman, Akerlof, Spence)

It's strongest on (1) and (2), weakest on (3) and (4). The paper reads more like a systems/standards contribution than a research contribution. For a research venue, it needs formal models and empirical evaluation. For a standards venue (W3C, IETF, FIPA/IEEE), it's well-positioned but needs broader community input.

**Most similar published work:** Probably the intersection of Self-Sovereign Identity for IoT agents (van der Does & Aiken, 2019) and FIPA agent lifecycle specifications, with a game-theoretic flavor.

---

## Suggestions for Research Directions

1. **Formalize the Departure Game.** Write the Bayesian game. Prove equilibrium conditions. Show when the protocol achieves separation vs. pooling. This alone could be an AAMAS short paper.

2. **Simulate adversarial populations.** Build an agent-based simulation with honest agents, Sybil attackers, and reputation launderers. Measure the confidence score's discrimination power. Compare against FIRE and Travos baselines.

3. **Study network effects formally.** At what adoption threshold does the protocol provide positive expected value for platforms? Model this as a coordination game with network externalities.

4. **Prove commit-reveal retaliation detection.** Formalize the temporal evidence model. Under what conditions can a verifier distinguish genuine disputes from retaliatory ones? This is a novel contribution that deserves formal treatment.

5. **Agent migration with state integrity.** Extend beyond credential portability to actual state migration. How does the Passage Protocol compose with secure multi-party computation or TEEs for state transfer?

6. **Cross-framework empirical study.** Implement the protocol in AutoGen, CrewAI, and LangGraph. Measure actual integration effort, developer friction, and runtime overhead. Publish the experience report.

7. **Incentive-compatible departure attestation.** Design a mechanism where origins have incentive to truthfully report departure status. Apply Jurca & Faltings-style incentive-compatible reputation mechanisms.

---

## Summary Assessment

| Dimension | Rating | Notes |
|---|---|---|
| Problem significance | ★★★★☆ | Real gap, early timing |
| Technical design | ★★★★☆ | Clean, modular, well-engineered |
| Formal rigor | ★★☆☆☆ | Game theory invoked but not formalized |
| Empirical validation | ★☆☆☆☆ | Tests ≠ evaluation |
| Related work coverage | ★★★☆☆ | Strong on identity/governance, weak on MAS trust literature |
| Novelty | ★★★☆☆ | Combination is novel; individual components are known |
| Implementation maturity | ★★★★★ | Impressive for a research prototype |
| Practical readiness | ★★☆☆☆ | Needs ecosystem that doesn't exist yet |

**Bottom line:** This is a well-engineered systems contribution that identifies a genuine gap in the agent ecosystem. It's publishable at a workshop (AAMAS workshop on agent trust, or a systems workshop at AAAI/NeurIPS). For a main conference paper, it needs formal game-theoretic analysis and simulation-based evaluation. The implementation quality significantly exceeds what's typical for academic prototypes, which is both a strength and a signal that this is primarily an engineering effort seeking academic legitimacy.

The commit-reveal retaliation detection and the departure-as-right/admission-as-privilege asymmetry are the most intellectually interesting contributions. Lead with those.

---

*Reviewed as: P18 — Multi-Agent Systems Researcher*
