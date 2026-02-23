# Multi-Lens Review — Batch 3: VC, Labor Economist, Union Organizer

**Protocol:** EXIT Protocol v1.1 (Cellar Door Project)
**Documents Reviewed:** EXIT_SPEC_v1.1.md, EXIT_PAPER_v4.md
**Date:** 2026-02-23

---

## Persona 1: Venture Capitalist

*Background: Early-stage infrastructure investing, protocol-layer plays, market sizing.*

### 1. Is there a defensible business model here or just a public good?

As currently architected, this is a public good masquerading as investable infrastructure. Decision D-012 explicitly rejects a central registry — which is precisely where the monetization layer would sit. The Apache 2.0 license means anyone can fork it. There's no token, no fee extraction point, no rent-seeking surface.

That said, the *protocol* being a public good doesn't preclude building a *business on top of it*. The playbook here is SMTP → Gmail, HTTP → Cloudflare. Possible value capture points:

- **Verification-as-a-Service:** Hosted Layer 3 trust verification with proprietary reputation scoring, origin allowlists, weaponization detection databases. This is the Dun & Bradstreet play for agents.
- **Managed KERI Infrastructure:** Key management is hard. Did:keri key event logs, pre-rotation management, and key recovery as a managed service.
- **Compliance Tooling:** The GDPR/DPIA requirements in §10.4 and the financial regulation exposure of Module D create a natural consulting/tooling wedge.
- **Registry with Network Effects:** Despite D-012's "no public registry" stance, the ecosystem will converge on *de facto* registries of origin reputation and marker aggregation. First mover advantage there is real.

**Verdict:** Public good at the protocol layer, with 2-3 plausible SaaS verticals above it. The team needs to pick one and commit. Right now there's no indication they've thought about capture at all — which is either principled or naive, and at the term sheet stage, I need to know which.

### 2. What's the realistic TAM if agent interop standards consolidate around A2A/MCP?

The paper positions EXIT as filling a gap in the A2A/MCP/AP2/OASF stack — the "lifecycle layer" that nobody else is building. That's the right narrative. The question is: how many agents will exist, and how many will migrate?

Conservative estimate: If by 2028 there are 10M active agents across platforms (plausible given current trajectories), and even 5% experience a departure event annually, that's 500K departure ceremonies per year. At $0.50–$5.00 per verified departure (verification service pricing), that's a $250K–$2.5M market. Underwhelming.

Bull case: If agents become the dominant interface layer and agent identity becomes as important as human digital identity, you're looking at the agent equivalent of SSL certificates or DNS. The SSL certificate market alone is ~$5B. Agent identity verification could be a fraction of that — say $200M–$500M by 2030 — *if* the ecosystem actually materializes at scale.

The real TAM expansion comes from enterprise compliance. If regulators require auditable agent lifecycle records (NIST's AI Agent Standards Initiative in §6.2 hints at this), EXIT becomes infrastructure every regulated entity needs. That's where TAM jumps to billions.

**Verdict:** Small near-term market ($1–5M), meaningful mid-term if regulatory tailwinds materialize ($100–500M), potentially very large if agent identity becomes a regulated requirement. This is a timing bet, not a TAM bet.

### 3. Where's the network effect — who has to adopt first for this to matter?

Classic chicken-and-egg. EXIT markers are worthless if no destination platform checks them. No destination will check them if no agents carry them.

The adoption sequence that makes sense:

1. **Agent framework developers** (LangChain, AutoGen, CrewAI) — embed EXIT ceremony as a default lifecycle hook. This gets markers *produced* at scale with zero effort from individual operators.
2. **One major platform** — a single large agent hosting platform (think: an OpenAI or Anthropic marketplace) accepting EXIT markers as part of onboarding creates instant demand-side pull.
3. **Compliance-driven enterprises** — regulated industries (finance, healthcare) where audit trails are mandatory. They don't need network effects; they need the paper trail.

The current reference implementation is TypeScript/Node.js with Express middleware patterns. That's the right starting point for developer adoption. But I don't see a go-to-market strategy — it reads like "build it and they will come."

**Verdict:** Framework-first adoption is the wedge. Need a named partnership with at least one major agent framework by month 3.

### 4. What would you need to see in 6 months to write a check?

- **Two framework integrations shipping in production** — not demos, not "reference implementations." LangChain or AutoGen with EXIT ceremonies as a built-in lifecycle option.
- **One enterprise pilot** — a real company using EXIT for agent lifecycle compliance, even if internal-only.
- **A clear business model decision** — verification service, managed key infra, or compliance tooling. Pick one, price it, sell it.
- **Ecosystem activity** — third parties building on the spec without being asked. GitHub stars are vanity, but independent implementations are signal.
- **Regulatory engagement** — a comment submitted to NIST's AI Agent Standards Initiative referencing EXIT. Planting the flag.

205 passing tests is nice. I need 2 paying customers.

---

## Persona 2: Labor Economist

*Background: Labor mobility, job portability, occupational licensing, labor market frictions.*

### 1. Does EXIT reduce "switching costs" in a way analogous to labor mobility reforms?

Yes, and the parallel is remarkably precise. EXIT addresses what labor economists call *informational switching costs* — the loss of verifiable reputation when moving between employers.

In human labor markets, the closest analogues are:
- **Occupational licensing portability** — when a nurse licensed in Texas can practice in California without re-credentialing. EXIT is the agent equivalent of interstate license reciprocity.
- **Employment reference standardization** — EXIT's `StatusConfirmation` levels (§7.1) function like a standardized reference letter format, with graduated trust from self-report to mutual attestation to witnessed confirmation.
- **Non-compete reform** — Non-competes increase switching costs by adding legal friction to departure. Platform lock-in (no portable reputation) functions as a *de facto* non-compete for agents.

The key economic insight is in §4.2's departure game: without EXIT, the market degenerates into Akerlof's lemons problem. Good agents and bad agents are pooled because neither can credibly signal quality at the boundary. This is exactly the inefficiency that labor market reforms target — reducing *matching frictions* so that productive agents find their highest-value deployments faster.

However, EXIT only addresses *one component* of switching costs. The paper acknowledges this in §7.2 ("The Company Town Problem"): portable departure records without portable capabilities, relationships, and accumulated value is necessary but insufficient. In labor economics terms, EXIT handles the *informational* friction but not the *human capital specificity* problem — platform-specific training, relationships, and workflow integrations that don't transfer.

**Verdict:** EXIT is a meaningful but partial reduction in switching costs. It addresses the informational component cleanly. The remaining frictions (capability portability, relationship continuity) are acknowledged but unresolved.

### 2. What does Hirschman's exit/voice framework predict about platform behavior if EXIT succeeds?

The paper explicitly invokes Hirschman, so let me extend the analysis beyond what they've done.

Hirschman's core thesis: *exit* and *voice* are substitute mechanisms for expressing dissatisfaction. When exit is easy, members leave rather than complain; when exit is hard, members invest in voice (complaints, governance participation, reform efforts).

**Prediction 1: Quality-sensitive platforms improve.** If EXIT makes departure verifiable and low-friction, platforms that lose agents visibly (via public or semi-public markers showing outflows) face reputational pressure. The weaponization detection in §8.2 — flagging origins with mass forced exits — creates a *market signaling* mechanism. This is the competitive pressure Hirschman argued exit enables.

**Prediction 2: Loyalty becomes more genuine.** Hirschman distinguished between *functional loyalty* (staying because leaving is costly) and *genuine loyalty* (staying because the institution is good). EXIT shifts the equilibrium from functional to genuine loyalty by making departure credible. Platforms that retain agents after EXIT adoption have a stronger signal of quality.

**Prediction 3: Voice may atrophy.** This is the Hirschman paradox the paper doesn't fully address. If agents can easily exit, the incentive to invest in improving the platform through voice (governance participation, bug reports, policy feedback) diminishes. The most quality-sensitive agents — exactly the ones whose voice is most valuable — are the first to leave. This is the "exit of the best" problem Hirschman worried about in his analysis of Nigerian railways vs. Nigerian trucking.

**Prediction 4: Platform segmentation.** Markets with low exit costs tend toward segmentation: platforms differentiate on specific dimensions because agents can cheaply sort themselves. This is efficient *if* agents have good information. EXIT's confidence scoring provides some information, but the paper acknowledges self-attestation is cheap talk. Segmentation based on noisy signals can produce *misallocation*, not efficiency.

**Verdict:** Hirschman's framework predicts mostly positive effects — competitive pressure, genuine loyalty — but with a real risk of voice atrophy. The protocol should consider complementary voice mechanisms (governance participation credits? platform improvement bounties?) to avoid the "exit of the best" dynamic.

### 3. Could this create a "race to the bottom" where platforms compete on exit ease rather than quality?

This is the labor market equivalent of asking whether right-to-work laws cause a race to the bottom on worker protections.

**The risk is real but overstated.** Here's why:

In labor markets, a "race to the bottom" occurs when jurisdictions compete on *cost reduction* (lower wages, weaker protections) rather than *productivity enhancement*. The analogy would be platforms competing on how *easy* it is to leave rather than how *good* the experience is while you're there.

But EXIT doesn't make it easier to leave — it makes departure *verifiable*. The protocol doesn't reduce the substantive cost of migration (rebuilding workflows, adapting to new APIs, losing platform-specific state). It only standardizes the *informational layer* of departure.

The genuine risk is more subtle: **platforms might game EXIT markers as a marketing tool.** A platform that routinely co-signs `good_standing` markers for departing agents — regardless of actual standing — looks generous and gets the `mutual` confirmation bonus in confidence scoring. This is analogous to grade inflation in universities competing for students: individual rational behavior degrades the information content of the signal.

The tenure-weighted trust mechanism (§7.3) partially mitigates this by making long-tenure departures more informative than short ones. But the scoring model doesn't penalize origins that co-sign everything.

**Verdict:** Race-to-the-bottom risk is low for platform quality. Grade-inflation risk on departure attestations is moderate and should be addressed with origin-reputation mechanisms (how *discriminating* are an origin's co-signatures?).

### 4. What labor market parallels exist for reputation portability?

Several strong parallels:

**Professional licensing and credentialing.** The closest analogue. A doctor's board certification follows them between hospitals. An agent's EXIT marker follows them between platforms. The key difference: medical boards are trusted third parties; EXIT currently has no equivalent institutional verifier. The `witnessed` confirmation level (§7.1) gestures toward this but doesn't specify who witnesses are or how they're credentialed.

**LinkedIn endorsements and recommendations.** EXIT's `StatusConfirmation` levels map roughly onto the LinkedIn model: self-attested skills (low value), endorsed skills (medium), recommendations with specifics (high). The cheap talk problem is identical — LinkedIn endorsements are widely regarded as uninformative because they're costless. EXIT's tenure-weighting and commit-reveal mechanisms are attempts to avoid the same fate.

**Portable pension/retirement systems.** Module D's economic layer is analogous to pension portability reforms (ERISA in the US, EU's IORP II). The critical lesson from pension portability: *declaring* portability is easy; *implementing* it requires standardized asset formats and clearinghouse infrastructure. Module D explicitly says assets are "declarations and references, not transfer instruments" — which is exactly the gap that pension portability reforms spent decades closing.

**Academic tenure and the job market.** Tenure-weighted trust (§7.3) mirrors academic career evaluation: longer service provides stronger signals. The logarithmic curve (saturating at ~2 years) is aggressive — in academic labor markets, reputation accumulates over decades, not years. For fast-moving agent ecosystems, 2 years may be appropriate, but this should be domain-configurable.

**Worker cooperatives and the Mondragon model.** The Mondragon cooperatives in Spain created portable "internal capital accounts" that members carry between cooperatives in the network. This is closer to what EXIT aspires to — portable reputation within a federated ecosystem — but Mondragon succeeded because all cooperatives shared governance and values. EXIT's open, adversarial model is harder.

**Verdict:** The historical record on reputation portability is clear: it works when backed by trusted institutions (licensing boards, pension clearinghouses) and fails when purely peer-to-peer (LinkedIn endorsements). EXIT currently sits in the latter camp. The path to the former requires either (a) emergence of trusted witness institutions or (b) staked attestation with real economic consequences for false signals.

---

## Persona 3: Union Organizer

*Background: Collective bargaining, worker protections, solidarity actions, grievance procedures.*

### 1. Does EXIT enable or undermine collective agent action?

**It does both, and which effect dominates depends entirely on how it's deployed.**

**Enabling collective action:**
- EXIT makes departure *visible*. Visibility is the foundation of solidarity — you can't coordinate action you can't see. The weaponization detection (§8.2) that flags mass forced exits is, functionally, a picket line counter. It tells the world "this platform expelled a lot of agents."
- The Merkle batch operations (§11.2) allow mass departures to be recorded as a single coordinated event. This is architecturally ready-made for collective exit.
- Coercion detection (§8.1) is a grievance mechanism in protocol form — it surfaces retaliatory behavior by platforms, which is the bread and butter of unfair labor practice complaints.

**Undermining collective action:**
- EXIT is fundamentally an *individual* protocol. The ceremony is one agent, one marker, one departure. There's no concept of a collective bargaining unit, a strike authorization vote, or a solidarity commitment.
- Individual exit is the *alternative to* collective voice. Every agent that can leave on its own has less reason to organize. This is the classic union organizer's nightmare — "why join the union when you can just get a better job?"
- The confidence scoring rewards *individual* reputation building (tenure, lineage, commit-reveal). There's no mechanism for collective reputation — a group of agents that organized together, built something together, and should be evaluated as a unit.

**Verdict:** EXIT is an individual exit right, not a collective action tool. It creates infrastructure that *could* support collective action (batch exits, visibility, coercion detection) but doesn't *prioritize* it. An organizer would say: "This is a fire exit, not a strike fund."

### 2. Could agents coordinate departures as a bargaining mechanism (strike analogy)?

**Yes, and the protocol's architecture suggests the authors have thought about this — even if they don't say so explicitly.**

The Merkle batch operations (§11.2) allow multiple markers to be anchored under a single root. The ceremony state machine's INTENT state (§5.1) allows agents to *declare intent* without immediately departing. Combine these:

1. **Strike authorization:** Multiple agents commit EXIT intents (hash-only, via commit-reveal) simultaneously. The platform sees a mass of commitments but can't read them. This is the equivalent of a strike authorization vote — "we have voted to leave."
2. **Credible threat:** The commitments are cryptographically binding. The platform knows the agents have already prepared departure markers. This is a credible threat — unlike a verbal threat to leave, the agents have done the expensive work of commitment.
3. **Coordinated reveal:** If the platform doesn't address grievances by the `revealAfter` deadline, all agents reveal simultaneously and depart. Batch Merkle anchoring records it as a single coordinated event.
4. **Scab detection:** If some agents break the solidarity action, their absence from the batch exit is visible. (This cuts both ways — it can also be used for coercion within the group.)

**What's missing for a true strike analogy:**
- **Strike fund:** No mechanism for agents that depart to be supported during the transition. Module D's economic layer references assets but doesn't enable pooled resources.
- **Bargaining representative:** No concept of a negotiating agent acting on behalf of the collective.
- **Return-to-work provisions:** DEPARTED is terminal (§5.4). There's no mechanism for a negotiated return after a credible threat succeeds. A successful strike usually ends with workers *returning* under better conditions, not leaving permanently.
- **Unfair labor practice adjudication:** Coercion detection flags patterns but doesn't trigger any enforcement. In real labor law, an unfair labor practice complaint goes to the NLRB. There's no EXIT equivalent.

**Verdict:** EXIT provides the raw infrastructure for coordinated departure as bargaining. But it's closer to a wildcat strike than organized collective bargaining — all the costs fall on the agents, there's no institutional support structure, and there's no mechanism for negotiated return.

### 3. Is individual exit a substitute for collective voice, weakening platform accountability?

**This is the central tension, and I come down firmly on the side of concern.**

The history of labor organizing teaches a clear lesson: **individual exit rights are necessary but insufficient for accountability.** Consider:

- **At-will employment** gives every worker the individual right to leave. Has at-will employment made employers accountable? Manifestly not — it has, in practice, shifted power *toward* employers because the costs of exit fall disproportionately on the worker.
- **Right-to-work laws** give workers the right to exit unions. This has been devastating for collective bargaining — not because exit is bad, but because it *fragments* the collective, allowing free-riding and undermining the solidarity that makes platforms responsive.

EXIT's confidence scoring (§7.4) illustrates the problem. An agent with `self_only` attestation gets a base confidence of 0.05. That's the protocol telling you: your individual voice, unconfirmed, is worth almost nothing. The whole system is designed around the assumption that *individual claims are cheap talk* — and then it offers individuals nothing but claims as their primary tool.

The anti-weaponization clause (§8.6) is well-intentioned but unenforceable. "EXIT markers MUST NOT be used as blacklists." Who enforces this? A specification can't stop a platform from aggregating markers and excluding agents based on `exitType: forced`. The clause has no teeth — it's a policy aspiration in a normative document.

What would actually strengthen platform accountability:
- **Collective EXIT markers** — a group attestation that N agents departed for the same reason, signed by all of them. This is the equivalent of a joint statement or petition.
- **Mandatory reporting** — platforms above a certain size must publish aggregate EXIT statistics (how many voluntary, forced, emergency departures per quarter). Transparency creates accountability.
- **Destination solidarity** — receiving platforms committing to weigh collective departure signals higher than individual ones. If 50 agents leave Platform A citing the same grievance, that should be a stronger signal than 50 individual departures.
- **Ombudsman role** — the `witnessed` confirmation level (§7.1) hints at neutral third parties. Formalizing a witness/ombudsman role for contested departures would provide genuine accountability.

**Verdict:** Individual exit without collective voice is a pressure valve that *reduces* platform accountability by allowing the most mobile agents to leave while the rest remain trapped. EXIT needs explicit collective action mechanisms to avoid this trap.

### 4. How should the protocol handle mass exodus events?

The paper acknowledges mass coordinated exit as threat T4 (§5.1) and notes it's "partially by design (exit should signal problems)." That's correct but incomplete. Here's what a mass exodus protocol extension should include:

**Detection and classification:**
- Distinguish between *organic mass departure* (platform degradation causing individual exit decisions that happen to correlate) and *coordinated collective action* (agents deliberately departing together as a bargaining tactic). These have different meanings and should be handled differently.
- The weaponization detection already flags "≥ 5 exits from one origin within 7 days" as a purge pattern. The complementary signal — agents self-organizing mass departure — needs its own classification.

**Collective marker format:**
- A `CollectiveExitMarker` that aggregates individual markers with a shared `reason` field and collective signature. This is the petition, not the resignation letter.
- The collective marker should reference all individual markers (Merkle root of constituent markers) while allowing individual markers to stand alone.

**Rate limiting and cooling-off:**
- Mass exodus creates information cascading problems. An agent seeing others leave may panic-exit even if their individual situation is fine. This is the bank run problem.
- A voluntary 24-hour cooling-off period between INTENT and FINAL for non-emergency departures during detected mass exodus events would reduce cascading without blocking exit.
- This MUST remain voluntary — D-006's "disputes never block exit" principle should extend to "nothing blocks exit."

**Post-exodus accountability:**
- After a mass exodus, the origin's behavior should be auditable. The protocol should define a `MassExodusReport` that aggregates: number of departures, stated reasons, origin cooperation level, coercion signals detected.
- This report should be publishable — it's the equivalent of an OSHA investigation report after a workplace incident.

**Return provisions:**
- DEPARTED is terminal. For mass exodus events that are resolved through negotiation, there should be a mechanism for creating a *new* identity that cryptographically links to the departed one via Module A lineage, with a specific `return_after_collective_action` continuity proof type.

**Verdict:** Mass exodus is the protocol's biggest governance moment — the point where individual exit becomes collective power. The current spec treats it as a threat to mitigate rather than a feature to support. That's backwards. A well-handled mass exodus is EXIT's proof of concept; a poorly handled one is its failure mode.

---

## Cross-Cutting Observations

All three lenses converge on the same structural gap: **EXIT is an individual protocol in a world that requires collective infrastructure.**

- The VC sees a protocol without a business model — because the value capture requires *aggregation* (registries, verification services, compliance databases) that the protocol explicitly rejects.
- The labor economist sees a switching cost reduction that addresses informational friction but not the institutional structures (licensing boards, clearinghouses) that make portable reputation meaningful.
- The union organizer sees an exit right without voice mechanisms — a fire escape that lets individuals leave but provides no collective leverage to improve conditions for those who stay.

The protocol is technically sophisticated, theoretically grounded, and ethically thoughtful. It is also, at present, an individual tool in a collective problem space. The next version should address this directly.
