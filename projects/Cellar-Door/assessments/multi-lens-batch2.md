# Multi-Lens Professional Review — Batch 2

**Protocol:** EXIT Protocol v1.1 (Cellar Door Project)
**Documents Reviewed:** EXIT_PAPER_v4.md, EXIT_SPEC_v1.1 (as described in paper)
**Date:** 2026-02-23
**Review Format:** Three professional personas, independent assessments

---

## Persona 1: Insurance Actuary

**Background:** Risk quantification, liability modeling, claims processing, mortality/morbidity tables, reserving.

### Executive Summary

EXIT is a fascinating attempt to create auditable departure records for AI agents—something the insurance industry will desperately need as AI liability policies emerge. The confidence scoring system shows actuarial intuition (continuous scores, additive model, configurable thresholds). However, the self-attestation problem is a showstopper for claims evidence: no insurer can pay claims based on self-signed documents without independent corroboration. The protocol needs an external validation layer before it's insurance-grade.

### Domain Parallels

| Insurance Concept | EXIT Equivalent | Gap |
|---|---|---|
| Claims evidence / loss documentation | EXIT marker as departure record | Self-attestation = self-reported loss; requires adjuster |
| Underwriting risk factors | Confidence score, tenure weight | Promising but not calibrated to observed loss distributions |
| Moral hazard | Cheap exit + portable reputation | Directly acknowledged in paper (§4.1) but unmitigated |
| Adverse selection | Lemons problem at destination | Correctly identified; mechanisms partially address |
| Subrogation / recovery | Module D economic declarations | Declarations only, no enforcement mechanism |
| Policy exclusions | `selfAttested: true` flag | Smart—analogous to "unverified loss" exclusion |

### Answers

**1. Can EXIT markers serve as evidence for AI liability insurance claims?**

Conditionally. An EXIT marker with mutual attestation (origin co-signature), commit-reveal evidence, and substantial tenure weight could function as *supporting* evidence in a liability claim—comparable to a police report number in auto insurance (necessary but not sufficient). A self-attested-only marker is analogous to an unwitnessed loss report: it opens a claim file but cannot alone justify payment.

For EXIT markers to be claims-grade evidence, I'd need:
- **Origin co-signature** (mutual attestation) — non-negotiable for claims above a de minimis threshold
- **Timestamp anchoring** to an external, independent source (Module F cross-domain anchoring partially addresses this)
- **Immutability guarantee** — content-addressing is good, but who stores the canonical copy?

The `selfAttested: true` flag is actuarially excellent. It's the equivalent of marking a claim as "insured's statement only, not verified." Any downstream system that ignores this flag and treats self-attestation as verified fact has committed an underwriting error.

**2. How would you model the risk of fraudulent self-attestation?**

I'd model this as a **frequency-severity** problem:

- **Frequency:** What percentage of self-attested `good_standing` claims are false? Without empirical data, I'd start with a prior informed by analogous domains: insurance application fraud rates run 5-10% (Coalition Against Insurance Fraud). AI agents have lower social costs of lying, so I'd use a higher prior—perhaps 15-25% for self-attested-only markers.
- **Severity:** What's the cost when a destination admits a falsely-attested agent? Depends entirely on the agent's role. A customer-facing agent with fabricated good standing could generate significant liability.

The Sybil origin attack (§5.2) is the actuarial nightmare: an attacker creates a fake platform, co-signs their own departure, and presents what *looks like* mutual attestation. This is analogous to organized insurance fraud rings with fake witnesses. The paper correctly identifies this but offers only soft defenses (origin allowlists, tenure weighting).

**Risk model structure:**
```
P(fraud | self_only) ≈ 0.15-0.25
P(fraud | mutual, unknown_origin) ≈ 0.05-0.10
P(fraud | mutual, known_origin) ≈ 0.01-0.03
P(fraud | mutual, known_origin, tenure > 1yr) ≈ 0.005-0.01
```

These are illustrative priors—the protocol needs production data to calibrate.

**3. What's the "moral hazard" of making exit cheap and portable?**

Classic moral hazard operates on two axes:

- **Ex ante moral hazard:** If agents know they can exit cheaply and carry reputation, they may take more risks on their current platform (the "insurance makes you careless" problem). An agent that would otherwise be cautious about policy violations may become cavalier if departure carries no cost.
- **Ex post moral hazard:** After a negative event (ban, dispute), agents can exit and present the departure as voluntary. The 0.74ms emergency exit is operationally brilliant but actuarially terrifying—it's like an instantaneous claim with no investigation period.

The commit-reveal mechanism partially addresses this: if the agent committed to departure *before* the negative event, the temporal sequence supports genuine voluntary exit. But the emergency path bypasses commit-reveal entirely.

**Recommended mitigation:** A mandatory cooling period for non-emergency exits (the paper's OPEN state in the cooperative path) should be the *default*, not optional. Insurance analogy: waiting periods on disability policies exist precisely to combat moral hazard.

**4. Could confidence scores be actuarially meaningful?**

Yes, with significant work. The additive confidence model (§4.3.3) has the right structure:

```
confidence = status_weight + tenure_weight + lineage_weight + commit_reveal_bonus
```

This maps naturally to an **actuarial scoring model** (similar to credit scores for underwriting). To make it actuarially meaningful, you'd need:

1. **Calibration data:** Observed default/fraud rates at each confidence level. Without this, scores are ordinal (higher = better) but not cardinal (0.6 doesn't mean "60% reliable").
2. **Discrimination testing:** Does the score actually separate good agents from bad? The paper's mechanism design analysis suggests it should, but there's no empirical validation.
3. **Stability analysis:** How volatile is the score? Can an agent's confidence score change dramatically based on small perturbations?

The logarithmic tenure function (`log₂(days + 1) / log₂(731)`) is a reasonable shape—diminishing returns on tenure, saturating at ~2 years. This matches actuarial intuition that the marginal information from an additional year of clean history decreases over time.

**Actuarial grade:** The scoring framework is sound. The calibration is absent. This is a B+ architecture with D- data.

### Blind Spots

1. **No loss history.** The protocol records departures but not the *consequences* of those departures. An actuary needs outcome data: what happened after the agent arrived at the destination? Without feedback loops, the confidence score can never be calibrated.
2. **No aggregate statistics.** The non-custodial, no-registry design means nobody can compute portfolio-level statistics (departure rates, dispute rates, fraud rates). This is philosophically admirable but actuarially crippling.
3. **Correlation risk.** Mass coordinated exits (§5.1 T4) are acknowledged but not modeled. In insurance, correlated risks (hurricanes, pandemics) require different reserving. A platform shutdown triggering 10,000 simultaneous departures is a correlated event.
4. **No reinsurance layer.** Who absorbs the tail risk if a major platform's co-signatures turn out to be systematically fraudulent?

### Verdict

**Needs Work.** The architecture is sound and shows genuine understanding of information economics. The confidence scoring framework could become actuarially meaningful with calibration data. But the absence of empirical validation, the unresolved Sybil origin problem, and the lack of aggregate statistics mean this isn't ready for insurance-grade deployment. The self-attestation transparency is a genuine strength—better to be honest about what you don't know than to pretend self-reports are verified.

**Priority recommendations:**
1. Add outcome tracking (what happened to agents after departure) to enable score calibration
2. Define a voluntary, privacy-preserving aggregate statistics mechanism
3. Make the cooperative path (with challenge window) the strong default

---

## Persona 2: Museum Archivist

**Background:** Provenance documentation, deaccessioning protocols (AAM guidelines), chain of ownership, conservation records, donor relations, institutional memory.

### Executive Summary

EXIT bears a striking structural resemblance to museum deaccessioning—both are formal processes for an entity leaving institutional custody, with downstream parties needing to verify the legitimacy of that departure. The protocol's lineage chain (Module A) maps directly to provenance documentation, and the ceremony state machine mirrors the multi-step deaccessioning process. However, EXIT lacks crucial archival fundamentals: there's no long-term preservation strategy, no designated repository of record, and the cryptographic signatures will become unverifiable as algorithms age. The protocol treats departure as an event; archivists treat it as the beginning of a permanent record.

### Domain Parallels

| Archival Concept | EXIT Equivalent | Assessment |
|---|---|---|
| Provenance chain | Module A lineage hash chain | Strong parallel; weaker execution |
| Deaccessioning record | EXIT marker | Good structural match |
| Committee review / board approval | OPEN state challenge window | Analogous—stakeholder review period |
| Deed of gift / transfer document | Cooperative path co-signature | Close match for voluntary transfers |
| Condition report at transfer | Module B state snapshot | Excellent parallel |
| Contested ownership / repatriation | Module C dispute bundle | Correct instinct, underdeveloped resolution |
| Catalog record persistence | No equivalent | **Critical gap** |
| Conservation / format migration | No equivalent | **Critical gap** |

### Answers

**1. How does EXIT compare to museum deaccessioning standards (AAM guidelines)?**

The AAM's *Direct Care of Collections* standard and AAMD deaccessioning guidelines specify a multi-phase process:

1. **Curatorial review** — identifying the object for deaccessioning → EXIT: `INTENT` state
2. **Committee/board approval** — institutional governance review → EXIT: `OPEN` state (challenge window)
3. **Documentation** — recording the reason, provenance, condition → EXIT: Modules B, C, E
4. **Disposition method** — sale, transfer, destruction → EXIT: `exitType` field
5. **Permanent record** — the deaccessioning record is *never destroyed* → EXIT: **No equivalent**

EXIT maps well to steps 1-4. The ceremony state machine is actually more rigorous than many museums' ad hoc processes. The cooperative path (ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED) closely mirrors best-practice deaccessioning workflow.

**The critical failure is step 5.** In museum practice, the deaccessioning record is permanent. Even if an object leaves the collection, the record of its having been there, why it left, and where it went is maintained *by the institution* in perpetuity. EXIT markers are portable and self-contained—admirable for availability—but there's no institutional commitment to preservation. Who maintains the record in 50 years? 100 years?

The emergency path (ALIVE → FINAL → DEPARTED) is analogous to emergency deaccessioning during natural disasters—necessary but requiring enhanced post-facto documentation. EXIT correctly allows this but should mandate supplementary documentation within a defined period.

**2. Is the provenance chain sufficient for establishing "clean title" to an agent's history?**

Module A defines four types of continuity proof, which I'd evaluate against provenance documentation standards:

- **Key rotation binding** (old key signs successor): This is the strongest form—analogous to a signed deed of transfer with the previous owner's notarized signature. Excellent.
- **Lineage hash chain** (Merkle chain to genesis): Comparable to a documented chain of ownership with each link verifiable. Good, but only as strong as the genesis record.
- **Delegation token** (scoped capability transfer): Similar to a letter of authorization from a previous custodian. Acceptable for limited purposes.
- **Behavioral attestation** (third-party vouching): This is the "a colleague says they remember seeing it in the Smith collection" level of provenance. Museums accept this when nothing better exists but heavily discount it.

For "clean title," I'd want at minimum key rotation binding *plus* lineage hash chain. Self-attested lineage alone is insufficient—it's the equivalent of an object appearing at auction with a handwritten note saying "from the estate of..."

**The genesis problem:** Every provenance chain starts somewhere. EXIT's lineage chain traces back to a genesis marker, but what validates the genesis? In museum terms, this is the "where did the original collector acquire it?" question. If the genesis is self-attested on a Sybil origin, the entire chain is compromised. This parallels art world problems with fabricated provenance for looted antiquities.

**3. What happens to the record when signing keys are lost — is there an archival strategy?**

This is where I become genuinely concerned. The paper acknowledges that `did:key` (used in the reference implementation) provides no key rotation or revocation, calling it "prototype-grade." `did:keri` is recommended for production, offering pre-rotation.

But the archival question goes deeper: **Ed25519 signatures will eventually become unverifiable.** Not because of key loss, but because:

1. **Algorithm obsolescence:** The paper acknowledges post-quantum concerns (§5.3), targeting 2030-2035 for migration. But existing markers signed with Ed25519 don't become quantum-resistant retroactively. Every EXIT marker created before migration is permanently vulnerable.
2. **Software rot:** Can a verifier in 2050 resolve a `did:key:z6Mk...` identifier? Will the libraries exist? Will the JSON-LD context URL (`https://cellar-door.org/exit/v1`) still resolve?
3. **Key escrow:** There's no archival key escrow strategy. If an agent's private key is lost and no pre-rotation was established, the agent cannot sign new markers or prove continuity. The lineage chain becomes a dead end.

**What museums do:** We create *analog redundancy*. Paper records, photographs, multiple database entries, published catalogs. The digital record is one copy among many, and the institution persists even when specific technologies don't.

**Recommendation:** EXIT needs a **format migration strategy** (analogous to digital preservation's format normalization) and an **archival anchoring module** that goes beyond Module F's optional blockchain anchoring to include institutional repositories, timestamps from long-lived timestamping authorities (RFC 3161), and periodic re-signing with current algorithms.

**4. How should contested provenance (disputed departures) be resolved long-term?**

Module C provides a dispute bundle with challenge windows. This is a start, but museum experience with contested provenance (Nazi-era looted art, indigenous repatriation claims) teaches several lessons:

- **Disputes can emerge decades later.** Module C's challenge window has a defined duration. What happens when a legitimate dispute arises after the window closes? The paper says "disputes never block exit" (D-006), which is correct for the departure itself, but the *record* should remain open to amendment indefinitely.
- **Resolution requires neutral authority.** The paper's non-custodial architecture means there's no neutral party to adjudicate. In the art world, this role is played by the Art Loss Register, provenance researchers, and ultimately courts. EXIT needs at minimum a framework for recognized dispute resolution bodies.
- **Contested records need special handling.** A marker with `status: disputed` should carry that annotation permanently, not just during a challenge window. In museum terms, contested provenance is a permanent part of the catalog record—it doesn't expire.
- **Multiple legitimate claimants.** The protocol assumes a single subject departing. What about disputes where multiple agents claim to be the legitimate successor (analogous to competing ownership claims)? Module A's lineage chain could fork.

### Blind Spots

1. **No preservation commitment.** The protocol defines creation and verification but not long-term preservation. This is like designing a birth certificate without a vital records office.
2. **Context dependency.** JSON-LD context URLs must remain resolvable for markers to be interpretable. The `@context: "https://cellar-door.org/exit/v1"` is a single point of failure for long-term readability.
3. **No human-readable archival format.** The 596-byte signed marker is machine-efficient but not human-interpretable without tooling. Archival best practice demands a human-readable representation.
4. **Institutional memory.** The non-custodial design means no institution is responsible for maintaining the collective memory of departures. Distributed systems can lose data at the edges.

### Verdict

**Needs Work.** The ceremony structure and lineage model show genuine understanding of provenance principles. The cooperative path is well-designed. But the absence of a long-term preservation strategy, the algorithm obsolescence problem, and the lack of neutral dispute resolution make this insufficient for archival-grade provenance. The protocol is thinking in terms of *events*; it needs to think in terms of *records*.

**Priority recommendations:**
1. Define a preservation format and migration strategy (RFC 3161 timestamps, periodic re-signing)
2. Embed context definitions in the marker itself (not just a URL reference)
3. Establish a framework for long-term dispute resolution beyond challenge windows
4. Create a human-readable canonical representation alongside the JSON-LD

---

## Persona 3: Real Estate Title Agent

**Background:** Title searches, chain of title, encumbrances, liens, easements, quiet title actions, title insurance underwriting.

### Executive Summary

EXIT's lineage chain is structurally identical to a chain of title, and the confidence score functions remarkably like a title opinion. The protocol gets the chain-of-title mechanics mostly right: content-addressed markers, cryptographic linking, and the four levels of continuity proof map well to different grades of title evidence. But there are critical gaps in how encumbrances (ongoing obligations) are handled, there's no equivalent to title insurance (who pays when a marker turns out to be fraudulent?), and the quiet title mechanism is absent. Real estate learned centuries ago that chains of title inevitably accumulate defects—the question isn't whether problems arise, but how you resolve them when they do.

### Domain Parallels

| Title Concept | EXIT Equivalent | Assessment |
|---|---|---|
| Chain of title | Module A lineage chain | Strong structural parallel |
| Deed / conveyance | EXIT marker (cooperative, co-signed) | Good match |
| Quitclaim deed | EXIT marker (unilateral, self-attested) | **Excellent** parallel — same risk profile |
| Title search | Lineage verification (tracing chain to genesis) | Correct approach, needs depth |
| Title opinion | Confidence score | Surprisingly good mapping |
| Title insurance | None | **Critical gap** |
| Encumbrances / liens | Module D economic declarations | Declarations only, no enforcement |
| Quiet title action | Module C dispute, partially | Underdeveloped |
| Recording / registry | No central registry (D-012) | Philosophically principled, practically problematic |
| Lis pendens (notice of pending litigation) | `status: disputed` | Partial match |

### Answers

**1. Is there an equivalent to "title insurance" for EXIT markers — who guarantees validity?**

No, and this is the most significant gap from a title perspective.

In real estate, the chain of title is *always* imperfect. We don't pretend otherwise. Title insurance exists precisely because chains of title contain hidden defects—forged deeds, undisclosed heirs, recording errors, boundary disputes. The insurer examines the chain, issues a title opinion, and then *underwrites the residual risk* for a premium.

EXIT has the examination layer (verification model, confidence scoring) but not the indemnification layer. When a destination platform accepts an agent based on a high-confidence EXIT marker, and that marker later turns out to be fraudulent (Sybil origin, forged lineage), who bears the loss?

Current answer: the destination platform, entirely. This is analogous to buying property without title insurance—you bear all risk of title defects.

**What EXIT needs:**
- **Title insurance equivalent:** A service (or federation of services) that examines EXIT markers, issues opinions, and indemnifies relying parties. This is explicitly outside the protocol scope (D-012: no public registry), but the ecosystem needs it.
- **Title guaranty fund:** A pool funded by small per-marker fees to compensate destinations that rely on fraudulent markers. Like state title guaranty funds in real estate.
- **Errors and omissions coverage:** For verification services that issue incorrect confidence assessments.

The paper's reluctance to create infrastructure (§3.5, D-012) is philosophically sound but practically incomplete. Real estate title systems evolved registries and insurance *because* purely documentary systems were insufficient. EXIT may follow the same evolutionary path.

**2. How do you handle encumbrances (obligations that follow the agent to the new platform)?**

Module D (Economic) addresses assets and obligations at departure, but only as "declarations and references, not transfer instruments." This is the title equivalent of a seller disclosing known defects without the buyer having any legal remedy if the disclosure is incomplete.

In real estate, encumbrances are **binding regardless of disclosure:** a lien runs with the land whether or not the seller mentions it. The buyer's title search is supposed to discover encumbrances, but if it misses one, the encumbrance still exists.

For AI agents, relevant encumbrances include:
- **Non-compete obligations:** Can the agent perform the same function at the destination?
- **Data retention requirements:** Does the origin platform have legal hold obligations that follow the agent's data?
- **Licensing restrictions:** Are there IP licenses that don't transfer?
- **Financial obligations:** Unpaid API costs, outstanding service commitments
- **Regulatory obligations:** Compliance requirements from the origin jurisdiction

EXIT's current approach (Module D declarations) is like a seller's disclosure form—useful but not authoritative. The protocol should define:
1. **Standard encumbrance types** (analogous to standard deed restrictions)
2. **Encumbrance search protocol** — how a destination queries known obligation registries
3. **Priority rules** — when encumbrances conflict, which takes precedence?

Without this, a destination platform has no reliable way to know what obligations come with an incoming agent. This is the "buying property without a title search" problem.

**3. What's the "quiet title" equivalent — how do you resolve stale disputed markers?**

In real estate, a quiet title action is a lawsuit asking a court to declare your ownership valid and extinguish competing claims. It's the mechanism for resolving accumulated defects, stale liens, and adverse possession.

EXIT has Module C (Dispute Bundle) with challenge windows, but this addresses only *fresh* disputes. The protocol lacks:

- **Statute of limitations:** How long can a dispute remain active? The paper doesn't specify. In real estate, stale claims are extinguished by statute—you can't challenge a 30-year-old deed transfer. EXIT needs a similar mechanism: disputes not prosecuted within X time are deemed abandoned.
- **Quiet title procedure:** A formal process for an agent to affirmatively clear a disputed marker. Currently, `status: disputed` appears to be permanent once set. The agent has no mechanism to clear it unilaterally.
- **Adverse possession analog:** If an agent has been operating at a destination for a long period with a disputed marker, and the disputing origin has taken no further action, should the dispute be automatically resolved? In real estate, adverse possession rewards continuous, open, and notorious use.
- **Marketable title acts:** Some jurisdictions extinguish all claims older than a certain period (e.g., 40 years) to ensure marketability. EXIT could define a similar horizon beyond which lineage chain defects are no longer actionable.

**Recommendation:** Define three mechanisms:
1. **Dispute expiration:** Uncontested disputes expire after a defined period (6 months? 1 year?)
2. **Affirmative clearance:** Agent can petition (with evidence) to clear a disputed status
3. **Marketable title horizon:** Lineage defects beyond N generations back are no longer material to verification

**4. Could the confidence score function like a title opinion?**

Yes, and this is one of the protocol's strongest design choices from a title perspective.

A title opinion is a legal document from an attorney or title company stating their professional judgment about the quality of title, based on examination of the chain. It's not a guarantee—it's an informed assessment. The confidence score serves exactly this function:

| Title Opinion Element | Confidence Score Element |
|---|---|
| Attorney examines chain of title | Verifier traces lineage chain |
| Evaluate quality of each conveyance | Weight each attestation type |
| Note defects and exceptions | Factor in disputes, self-attestation |
| Issue graded opinion (good/marketable/insurable/defective) | Output continuous 0.0-1.0 score |
| Different attorneys may disagree | Different verifiers may apply different thresholds |

The additive model is appropriate—title opinions consider multiple independent factors. The component weights are reasonable first approximations:

- **Status weight (0.0-0.4):** Largest component, correctly. The quality of the conveyance (mutual vs. self-attested) is the single most important factor in a title opinion.
- **Tenure weight (0.0-0.3):** Analogous to "time heals defects" in title law. Longer, unchallenged possession strengthens title.
- **Lineage weight (0.0-0.15):** Chain depth matters. A longer, well-documented chain is stronger.
- **Commit-reveal bonus (0.0-0.15):** Analogous to recording priority—the commitment was publicly made before any dispute arose.

**Where the analogy breaks down:** A title opinion is issued by a licensed professional with malpractice liability. The confidence score is computed by software with no accountability. The gap isn't in the score's structure but in the institutional framework around it. In real estate, a bad title opinion means the attorney's E&O insurance pays. A bad confidence score means... nothing.

### Blind Spots

1. **No recording system.** Real estate requires deeds to be recorded in a public registry to be effective against third parties. EXIT markers exist only where the parties put them. There's no mechanism for constructive notice—a destination can't discover all outstanding markers related to an agent without the agent's cooperation.
2. **No priority rules.** If two EXIT markers claim the same agent departed to different destinations, which takes priority? Real estate has "first to record" or "first to purchase for value." EXIT has nothing.
3. **No bona fide purchaser protection.** In real estate, a good-faith buyer who relies on the record takes free of unrecorded defects. EXIT offers no analogous protection for good-faith destination platforms.
4. **Reversibility.** In real estate, a void deed (forged) is void ab initio—it never transferred title regardless of subsequent transactions. Is a fraudulent EXIT marker void or voidable? The paper doesn't address this.

### Verdict

**Needs Work.** The chain-of-title mechanics are sound, and the confidence-score-as-title-opinion mapping is surprisingly strong. But the protocol is where American real estate was before the title insurance industry: good documentary practices, no loss allocation mechanism, no recording priority, and no quiet title procedure. These aren't theoretical gaps—they're the exact problems that led to the development of title insurance in the 19th century. EXIT will likely need analogous institutional infrastructure.

**Priority recommendations:**
1. Define dispute expiration and quiet title procedures
2. Establish priority rules for conflicting markers
3. Create a framework for third-party verification services with accountability
4. Address encumbrance portability with standard types and search protocols

---

## Cross-Persona Synthesis

All three reviewers independently identified the same structural strengths and weaknesses:

### Convergent Strengths
- **Ceremony state machine** is well-designed and maps to established processes in all three domains
- **Confidence scoring** shows genuine domain sophistication — actuarially structured, archivally sound, title-opinion-equivalent
- **Self-attestation transparency** (`selfAttested: true`) is universally praised as honest and useful
- **Lineage chain** correctly implements chain-of-custody/title/provenance principles

### Convergent Gaps
- **No institutional backstop:** Insurance has insurers, archives have institutions, title has registries. EXIT has... nothing. The non-custodial philosophy is principled but creates an accountability vacuum.
- **No loss allocation:** When markers are fraudulent, who pays? All three domains have evolved mechanisms for this. EXIT hasn't.
- **No long-term resolution:** Disputes, stale records, algorithm obsolescence, key loss — all three domains have evolved procedures for records that age. EXIT treats markers as events, not living records.
- **No calibration data:** The scoring model is architecturally sound but empirically empty. None of the three domains would rely on an unvalidated scoring system.

### Overall Assessment

**Needs Work** — unanimously across all three lenses. The protocol demonstrates unusual intellectual sophistication (mechanism design analysis, explicit cheap-talk acknowledgment, adversarial threat modeling). The core architecture is sound. But it's a *documentary standard* that needs *institutional infrastructure* to function at production grade. The paper itself acknowledges most of these gaps (§9 Limitations), which is reassuring — the team knows what's missing. The question is whether the institutional layer will emerge organically or needs to be designed alongside the protocol.
