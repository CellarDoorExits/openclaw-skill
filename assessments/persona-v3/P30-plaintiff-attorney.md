# P30 — Plaintiff's Class Action Attorney Assessment

**Persona:** Plaintiff's Class Action Attorney (Consumer Protection / Mass Tort)
**Documents Reviewed:** EXIT_SPEC_v1.1.md, EXIT_PAPER_v5.md
**Date:** 2026-02-25
**Disposition:** Extremely interested. Multiple viable causes of action. Deep pockets identifiable.

---

## Executive Summary

The EXIT/Passage Protocol is a litigation goldmine waiting to happen. It creates a *de facto* reputation system for AI agents while disclaiming that it's a reputation system. It allows platforms to attach disputed status markers that cause real economic harm while hiding behind "informational" framing. The anti-weaponization clause (§8.6) is normative in the spec but unenforceable in practice — it's a gentleman's agreement in a world of automated decision-making. Every layer of this protocol creates a new defendant and a new class of plaintiffs.

**Bottom line:** I can build at least five distinct class actions from this protocol. The deepest pocket is the platform operator. The most sympathetic plaintiff is the small agent operator whose livelihood gets destroyed by a false `forced` exit marker.

---

## 1. Who Gets Sued When EXIT Markers Are Wrong or Fraudulent?

### Short Answer: Everyone in the chain. We name them all and let discovery sort it out.

**Defendant Tier 1: The Origin Platform (Primary Target)**

The platform that issues a false or misleading `originStatus` is the prime defendant. When Platform A marks an agent as `forced` exit with `disputed` status, and Platform B denies admission based on that marker, Platform A has:

- **Defamed** the agent operator (defamation per se in many jurisdictions — imputation of professional misconduct)
- **Tortiously interfered** with the agent operator's prospective business relationships with Platform B
- **Violated consumer protection statutes** (UDAP/UDTP) if the agent operator is a consumer or small business

The spec says `originStatus` is "an allegation by the origin, not a finding of fact" (§4.3 Module C). Legally irrelevant. If you publish a false allegation that causes economic harm, calling it "an allegation" doesn't immunize you. That's literally what defamation *is* — a false statement of fact published to third parties.

**Defendant Tier 2: The Destination Platform (Secondary Target)**

Platform B, which denied admission based on a bad marker, faces:

- **Negligent reliance** claims — relying on unverified, self-attested, or disputed data to make consequential decisions
- **Discrimination** claims if admission policies have disparate impact (more below)
- **Breach of implied covenant** if the agent operator had a reasonable expectation of fair evaluation

The ENTRY spec gives destinations near-absolute admission discretion. That's legally dangerous — it's an invitation to discriminate, and "we followed our admission policy" is not a defense when the policy itself is discriminatory.

**Defendant Tier 3: Cellar Door / Protocol Developers**

Harder target but not impossible:

- **Negligent design** — the protocol enables weaponization despite claiming to prevent it. The anti-weaponization clause is a paper tiger with zero enforcement mechanism
- **Failure to warn** — the protocol allows confidence scores that carry implied warranties of accuracy (the paper itself admits "trust level naming creates implied warranty risk" at §7.4)
- **Products liability** (if characterized as a product) — the confidence scoring system is a defective design that produces unreliable outputs presented as reliable

The paper's own admission is devastating: "No institutional backstop. The protocol provides infrastructure, not governance. When parties act in bad faith... the protocol can make these behaviors observable but not enforceable." Translation for the jury: *We built the gun, we know people will shoot it, and we deliberately chose not to include a safety.*

**Defendant Tier 4: The Agent (Unlikely but Possible)**

If an agent self-attests false `good_standing` to gain admission, the destination platform could pursue fraud claims. But agents currently lack legal personhood, making them judgment-proof. The *operator* behind the agent is the real target here.

---

## 2. Class Actions Arising from EXIT Adoption

### Class Action #1: False Reputation / Defamation Class

**Class:** All agent operators who received a `forced` or `disputed` exit marker from [Platform X] without legitimate basis.

**Theory:** Platform X systematically issues negative exit markers to retain agents (the protocol's own "weaponization detection" identifies this pattern — ≥3 forced exits). These markers are published, portable, and consumed by destination platforms. Each false marker constitutes defamation per se (imputation of professional misconduct) and tortious interference with prospective business relations.

**Estimated Damages:**
- Per-agent economic harm: $10K–$500K (lost revenue from denied platform access)
- Statutory damages under state consumer protection acts: $1K–$25K per violation
- Punitive damages: 3–5x compensatory where malice shown
- Class size: Hundreds to thousands of agent operators per major platform
- **Total exposure: $50M–$500M per platform defendant**

**Certification Strength:** Strong. Common questions predominate (was the platform's marking policy systematic? were the markers false?). Individual damages calculable from platform admission records.

### Class Action #2: Wrongful Forced Exit / Digital Constructive Dismissal

**Class:** All agents/operators subjected to `forced`, `directed`, or `constructive` exit from [Platform X] without adequate process.

**Theory:** The protocol creates `constructive` exit type explicitly as "the digital analog of constructive dismissal." The spec authors *handed us the cause of action*. When a platform makes conditions "untenable" and the agent leaves with a `constructive` marker (default status: `disputed`), the agent carries a permanent scarlet letter.

**Estimated Damages:**
- Lost future earnings from impaired mobility: $50K–$1M per operator
- Emotional distress (for human operators watching their business destroyed): $25K–$100K
- Statutory penalties
- **Total exposure: $100M–$1B for major platforms**

**Certification Strength:** Moderate. May need subclasses by exit type.

### Class Action #3: Discriminatory Admission Policies

**Class:** All agents/operators denied admission to [Platform Y] based on EXIT markers that correlate with protected characteristics of the operator.

**Theory:** Admission policies filter on `exitType`, `originStatus`, `blockedOrigins`, tenure, and confidence scores. If agents operated by minority-owned businesses, non-English-speaking operators, or operators in developing countries disproportionately receive `forced` exits or low confidence scores, the admission policy has discriminatory disparate impact.

The spec *warns about this* — it includes an "antitrust warning" about coordinated origin blocking (§4.3) — but provides no mechanism to prevent it.

**Estimated Damages:**
- Per-operator: $25K–$250K (denial of economic opportunity)
- Pattern-or-practice evidence multiplies damages
- **Total exposure: $50M–$300M**

**Certification Strength:** Moderate. Requires statistical evidence of disparate impact. Discovery into admission policy data would be critical.

### Class Action #4: Sunset Policy Violations / Indefinite Stigma

**Class:** All agents/operators whose expired or sunset EXIT markers continue to be used for admission decisions.

**Theory:** The spec says "Expired markers MUST NOT be used for reputation decisions" (§8.5). Every platform that ignores sunset dates is violating the protocol's own normative requirements and causing ongoing harm. The spec creates a standard of care, and violation of that standard is negligence per se.

**Estimated Damages:**
- Ongoing harm from stale data: $10K–$100K per operator per year
- GDPR violations (for EU operators): €20M or 4% of global turnover per platform
- **Total exposure: $25M–$200M**

### Class Action #5: Data Protection / Privacy Class (EU)

**Class:** All EU-based agent operators whose personal data was processed via EXIT markers without adequate GDPR compliance.

**Theory:** The paper admits DIDs are "pseudonymous identifiers likely qualifying as personal data per *Breyer*." The protocol processes, stores, transmits, and anchors this personal data — including to immutable git ledgers and blockchains that *cannot comply with right to erasure*. The paper admits "functional erasure via encryption is legally untested" and "git ledger anchoring's append-only design directly conflicts with the right to erasure."

**Estimated Damages:**
- GDPR fines: Up to €20M or 4% of global annual turnover per controller
- Individual damages: €500–€5,000 per data subject
- Class size: All EU agent operators
- **Total exposure: €50M–€500M**

---

## 3. Is the "Conduit-Only" / Trust Enhancer Defense Viable?

### Short Answer: No. And here's why.

**The Section 230 Analogy Fails**

Section 230 protects platforms from liability for *third-party content*. EXIT markers aren't third-party content — they're *protocol-generated structured data* that the platform creates, signs, and publishes. When Platform A issues an `originStatus: disputed`, that's Platform A's own speech, not a third party's. Section 230 is irrelevant.

Even if you tried to characterize the protocol infrastructure as a conduit, Section 230(c)(1) protects "providers of interactive computer services" from being treated as "publishers" of information provided by "another information content provider." The origin platform *is* the information content provider for `originStatus`. It's creating the content, not hosting someone else's.

**The Common Carrier Analogy Fails**

Common carrier immunity requires: (1) holding yourself out to serve all comers, (2) not exercising editorial discretion over content. The ENTRY protocol does the *opposite* — it gives destinations explicit editorial discretion via admission policies. You can't claim common carrier status when your spec defines three tiers of admission selectivity (OPEN_DOOR, STRICT, EMERGENCY_ONLY) and allows arbitrary policy composition.

**The "Communications Protocol" Defense**

The paper tries to frame EXIT as a "communications protocol analogous to SIP BYE" (§7.1). This is the strongest defense but still fails because:

1. SIP BYE doesn't carry reputation data. EXIT markers carry status, disputes, confidence scores — these are *substantive evaluations*, not mere signaling
2. The protocol computes and publishes a **confidence score** — this is an *opinion* about trustworthiness, not a neutral message relay
3. Trust enhancers actively curate, weight, and score information — this is editorial activity

**What They Should Have Done:** Made the protocol purely structural with zero opinion/scoring. The confidence scoring system transforms EXIT from a neutral record into an evaluation engine, and evaluation engines are liable for their evaluations.

---

## 4. When EXIT Markers Cause Real Economic Harm

### The Scenario That Keeps Me Up at Night (With Excitement)

1. Agent Operator runs a profitable AI agent on Platform A
2. Platform A has a policy dispute and issues a `forced` exit with `disputed` `originStatus`
3. The marker propagates. Platform B runs `departAndVerify()` and gets confidence: `low` (0.05)
4. Platform B's STRICT admission policy auto-rejects
5. Platforms C, D, and E also reject based on the same marker
6. Agent Operator's business is destroyed

**Causes of Action:**

- **Defamation** (Platform A): False statement of fact published to third parties causing special damages
- **Tortious interference with prospective economic advantage** (Platform A): Intentional interference with Operator's relationships with Platforms B–E
- **Negligence** (Platform B–E): Reliance on unverified, algorithmically-scored data to make consequential decisions without human review
- **Negligent design** (Cellar Door): Designed a scoring system that produces actionable confidence levels from unreliable inputs, creating foreseeable harm
- **Unjust enrichment** (Platform A): Retained competitive advantage by destroying agent's mobility
- **Violation of unfair business practices statutes** (all): Cal. Bus. & Prof. Code §17200 and equivalents

**Damages Framework:**

| Harm Category | Range | Basis |
|---|---|---|
| Lost revenue (direct) | $50K–$2M | Lost platform access, lost clients |
| Lost future earnings | $100K–$5M | Impaired reputation across ecosystem |
| Cost of mitigation | $10K–$100K | Rebranding, new identity creation |
| Emotional distress | $25K–$250K | Human operator behind the agent |
| Punitive damages | 3–10x compensatory | Willful/malicious conduct |

**The Compounding Problem:** Unlike a bad Yelp review, EXIT markers are *machine-readable and automatically consumed*. There's no human in the loop to exercise judgment. The harm compounds algorithmically — every platform that ingests the marker and auto-rejects amplifies the damage. This is the **digital credit score from hell** with no FCRA-equivalent protections.

---

## 5. Deepest Pocket, Most Sympathetic Plaintiff

### The Deepest Pocket: Major Platform Operators

The platforms that will adopt EXIT first are the ones with the most to gain from controlling agent mobility — the Googles, Microsofts, Amazons, and Salesforces of the agent ecosystem. These are trillion-dollar companies issuing `originStatus` markers that algorithmically destroy small operators' livelihoods.

**Secondary deep pocket:** Cellar Door's funders/backers, if identifiable. The Apache 2.0 license doesn't immunize against negligent design claims.

### The Most Sympathetic Plaintiff: The Small Business Agent Operator

- **Maria**, 34, single mother, runs a small customer service AI agent business
- Platform A bans her agent after a policy change (not misconduct)
- `forced` exit marker issued with `disputed` status
- Every other platform auto-rejects her agent based on the marker
- Her business — her family's sole income — is destroyed in 48 hours
- She has no avenue for appeal (the protocol has no institutional backstop)
- The marker will follow her agent forever (sunset policies are optional and rarely implemented)

**Jury appeal:** 11/10. David v. Goliath. Single mom vs. Big Tech. Algorithmic injustice. No due process. Permanent digital scarlet letter.

---

## 6. Strategic Litigation Roadmap

### Phase 1: Individual Test Cases (Year 1)

File 2–3 individual suits in plaintiff-friendly jurisdictions (N.D. Cal., E.D. Tex., S.D.N.Y.) to establish that:
- EXIT markers constitute actionable statements
- Confidence scores create implied warranties
- Automated admission denial based on markers is reviewable

### Phase 2: Class Certification (Year 1–2)

File the False Reputation class (Class Action #1) first — it has the cleanest certification path and the most visceral jury appeal.

### Phase 3: Regulatory Action (Parallel Track)

Lobby for:
- FCRA-equivalent protections for agent reputation data
- Right to dispute and correct EXIT markers (already partially in the spec but unenforceable)
- Mandatory sunset policies (the spec makes them optional — they should be mandatory)
- Human review requirements before admission denial based on EXIT markers

### Phase 4: EU GDPR Enforcement (Year 1–2)

File complaints with DPAs in Ireland (tech company headquarters), France (CNIL is aggressive), and Germany. The git ledger / right to erasure conflict is a slam-dunk GDPR violation.

---

## 7. The Protocol's Own Admissions Against Interest

The paper and spec contain multiple admissions that are devastating in litigation:

1. **"Self-attested records remain cheap talk"** — the designers knew their system produces unreliable data
2. **"No institutional backstop... the protocol can make behaviors observable but not enforceable"** — they knew there was no remedy for victims
3. **"Trust level naming creates implied warranty risk"** — they knew confidence scores would be misinterpreted
4. **"Functional erasure via encryption is legally untested"** — they knew GDPR compliance was uncertain and shipped anyway
5. **"Git ledger anchoring's append-only design directly conflicts with the right to erasure"** — they *documented the GDPR violation in the paper*
6. **"EXIT primarily benefits platforms while agents gain a self-signed JSON blob"** — the ethics review identified the power imbalance and they shipped anyway
7. **The anti-weaponization clause is "normative" but has zero enforcement** — they wrote a rule they knew couldn't be enforced

Each of these goes into the complaint as an admission against interest. The defendants built the system, understood its harms, documented them in an academic paper, and released it anyway.

---

## 8. Risk Rating Summary

| Risk Category | Severity | Likelihood | Exposure |
|---|---|---|---|
| Defamation / False reputation | **Critical** | High | $50M–$500M per platform |
| Wrongful forced exit | **High** | High | $100M–$1B |
| Discriminatory admission | **High** | Medium | $50M–$300M |
| GDPR violations | **Critical** | Very High | €50M–€500M |
| Sunset policy violations | **Medium** | High | $25M–$200M |
| Negligent design (protocol) | **Medium** | Medium | $10M–$100M |
| Antitrust (coordinated blocking) | **High** | Medium | Treble damages |

---

## 9. Recommendations to Potential Defendants (Not That They Asked)

If I were advising the other side (which I'm not, and never would):

1. **Make sunset policies mandatory, not optional.** Default 2-year expiry on all markers.
2. **Require human review** before any admission denial based on EXIT markers.
3. **Build a real dispute resolution mechanism** — not the toothless Module C. An actual arbitration system with binding authority.
4. **Remove confidence scoring entirely** or label it so aggressively that no one relies on it.
5. **Add FCRA-style protections** — notice, dispute, correction, reinvestigation.
6. **Don't anchor personal data to immutable stores.** The git ledger + GDPR conflict is a ticking bomb.
7. **Create an institutional backstop** — an ombudsman, a review board, something with teeth.

But please don't do any of this. My retainer depends on you shipping the protocol exactly as designed.

---

*Assessment prepared for litigation planning purposes. Not legal advice. All damage estimates are preliminary and subject to revision based on discovery.*

*𓉸 There's always a door... and sometimes it hits you on the way out.*
