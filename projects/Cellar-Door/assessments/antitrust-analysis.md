# EXIT Protocol — Antitrust Analysis

**Prepared by:** Hawthorn
**Date:** 2026-02-22
**Classification:** Internal Assessment — Gap Fill
**Source trigger:** Single-source finding in cellar-door-legal-redteam-v2.md §2.3 (never cross-checked)

---

## Background

The second-pass legal red team (§2.3) flagged "Coordinated Refusal to Deal" as a **HIGH** severity issue that the first lawyer missed entirely. The legal battery (7-section analysis) does not address antitrust at all. This assessment fills that gap with a thorough analysis.

The red team's scenario: 100 agents exit Platform A with `disputed` status on the same day, each with Module E narratives describing unfair treatment. Platforms B, C, and D read these markers and refuse to accept agents from Platform A. The red team called this a "group boycott" and a potential per se violation of Sherman Act §1.

Let's stress-test that claim.

---

## 1. The Concern

Could coordinated use of EXIT markers constitute an antitrust violation?

The concern operates on two levels:

**Level 1 — Agent coordination:** Multiple agents independently deciding to exit a platform using EXIT markers. If they coordinate timing or messaging, this resembles a group boycott or concerted refusal to deal.

**Level 2 — Platform coordination:** Receiving platforms using EXIT marker data to collectively refuse dealing with a particular origin platform or its agents. This is horizontal competitor coordination using EXIT as the information-sharing mechanism.

**Level 3 — Protocol as facilitator:** EXIT itself, as standard infrastructure, becoming a coordination mechanism that enables antitrust-violating behavior even without explicit agreement among participants.

The red team focused on Level 2. All three levels merit analysis.

---

## 2. Sherman Act §1 Analysis

> "Every contract, combination in the form of trust or otherwise, or conspiracy, in restraint of trade or commerce among the several States, or with foreign nations, is declared to be illegal." — 15 U.S.C. §1

### 2.1 Elements Required

Sherman Act §1 requires: (1) an agreement (contract, combination, or conspiracy) between two or more entities, (2) that unreasonably restrains trade.

### 2.2 The Agreement Problem

**Independent action is not an agreement.** Under *Monsanto Co. v. Spray-Rite Service Corp.* (465 U.S. 752, 1984), parallel conduct alone does not establish conspiracy. If 100 agents independently decide Platform A is bad and exit using EXIT markers, there is no §1 violation — even if the result looks coordinated. This is "conscious parallelism," which is legal.

**But EXIT could provide the "plus factors."** Courts look for "plus factors" beyond parallel conduct to infer agreement: (1) actions against individual self-interest unless coordinated, (2) a common motive to conspire, (3) evidence of communication/information exchange. Under *Bell Atlantic Corp. v. Twombly* (550 U.S. 544, 2007), plaintiffs must plead facts suggesting agreement, not merely parallel conduct.

EXIT markers are public (or semi-public) signals. If agents can observe each other's EXIT markers before deciding to exit, this creates an information-sharing channel. Under *United States v. Container Corp. of America* (393 U.S. 333, 1969), information exchange among competitors that facilitates price coordination violates §1 — even without an explicit agreement. Substitute "exit coordination" for "price coordination" and you have the argument.

**The critical question:** Are agents "competitors" in an antitrust sense? If agents are independent economic actors competing for platform resources or user attention, their coordination is subject to §1. If they are tools of separate principals (human operators), the operators' coordination through their agents' EXIT markers is the relevant conduct.

### 2.3 Per Se vs. Rule of Reason

Group boycotts have been subject to **per se** illegality in certain contexts. Under *Klor's, Inc. v. Broadway-Hale Stores* (359 U.S. 207, 1959), a concerted refusal to deal was per se illegal. But the Supreme Court narrowed this in *Northwest Wholesale Stationers v. Pacific Stationery & Printing* (472 U.S. 284, 1985), holding that per se treatment applies only when the boycotting group has market power or exclusive access to an element essential to competition.

**For agent-side coordination (agents boycotting a platform):** Unless the exiting agents collectively hold market power (unlikely for most scenarios), a court would apply the **rule of reason**, not per se analysis. Under rule of reason, the restraint must be shown to harm competition — not just a single competitor. Agents leaving Platform A harms Platform A but may *enhance* competition by redistributing agents to competing platforms.

**For platform-side coordination (platforms refusing agents from Platform A):** This is more dangerous. If Platforms B, C, and D agree to refuse agents from Platform A based on EXIT data, this is horizontal competitor coordination. If those platforms collectively dominate the market, per se treatment is possible. Even under rule of reason, coordinated exclusion of a competitor's agents is hard to justify.

### 2.4 EXIT as a Hub-and-Spoke Conspiracy

The most sophisticated §1 theory: EXIT operates as the "hub" in a hub-and-spoke conspiracy. Individual platforms (spokes) don't communicate directly but use EXIT marker data as a shared coordination mechanism. Under *Interstate Circuit, Inc. v. United States* (306 U.S. 208, 1939), parallel action following receipt of the same information can establish conspiracy if each party knew others were receiving the same information and acting on it.

If Platform B knows that Platforms C and D also read EXIT markers, and all three refuse agents from Platform A based on `disputed` status, the shared EXIT data infrastructure is the hub. This is the strongest §1 theory against the protocol itself.

---

## 3. Sherman Act §2 Analysis

> "Every person who shall monopolize, or attempt to monopolize, or combine or conspire with any other person or persons, to monopolize any part of the trade or commerce among the several States, or with foreign nations, shall be deemed guilty of a felony." — 15 U.S.C. §2

### 3.1 Monopolization

§2 monopolization requires: (1) monopoly power in a relevant market, and (2) willful acquisition or maintenance of that power through anticompetitive conduct (as distinguished from growth through superior product, business acumen, or historic accident — *United States v. Grinnell Corp.*, 384 U.S. 563, 1966).

**Could EXIT enable monopolization?** Two scenarios:

**Scenario A — Dominant platform weaponizes EXIT:** A platform with market power uses `disputed` attestations to taint departing agents, making it harder for them to join competitors. This is arguably anticompetitive maintenance of monopoly power through raising rivals' costs. Under *United States v. Microsoft Corp.* (253 F.3d 34, D.C. Cir. 2001), conduct that protects a monopoly by raising barriers to entry violates §2. A dominant platform systematically issuing `disputed` markers to make agent migration costly fits this pattern.

**Scenario B — EXIT becomes essential facility:** If EXIT achieves standard status for agent portability, control over the protocol specification becomes control over an essential facility. Under the essential facilities doctrine (*MCI Communications Corp. v. AT&T*, 708 F.2d 1081, 7th Cir. 1983), a monopolist controlling an essential facility must provide access on reasonable terms. If Cellar Door (or a successor) controls the EXIT standard and uses that control anticompetitively — e.g., designing status values that favor certain platforms — §2 liability is possible. The red team flagged this: "If EXIT becomes standard-essential for agent portability, its design choices become antitrust-relevant."

Note: The essential facilities doctrine's vitality is debated post-*Trinko* (*Verizon Communications v. Law Offices of Curtis V. Trinko*, 540 U.S. 398, 2004), where the Supreme Court expressed skepticism. But the doctrine remains available, particularly in technology contexts.

### 3.2 Attempted Monopolization

Attempted monopolization requires: (1) predatory or anticompetitive conduct, (2) specific intent to monopolize, and (3) dangerous probability of achieving monopoly power (*Spectrum Sports v. McQuillan*, 506 U.S. 447, 1993).

This is unlikely for EXIT itself. A protocol specification doesn't have "specific intent to monopolize" — it's infrastructure. Individual platforms using EXIT anticompetitively could face attempted monopolization claims, but that's a user problem, not a protocol problem.

---

## 4. FTC Act §5 Analysis

> "Unfair methods of competition in or affecting commerce, and unfair or deceptive acts or practices in or affecting commerce, are hereby declared unlawful." — 15 U.S.C. §45

### 4.1 Unfair Methods of Competition

FTC Act §5 is broader than the Sherman Act. The FTC can challenge conduct that doesn't rise to a Sherman Act violation but is nonetheless "unfair." Under the FTC's 2022 Policy Statement on Unfair Methods of Competition, conduct is unfair if it is: (1) coercive, exploitative, collusive, abusive, deceptive, predatory, or involves the misuse of market power, and (2) tends to negatively affect competitive conditions.

**Application to EXIT:**

- **Information asymmetry:** If EXIT markers create information advantages for platforms that adopt early (they can screen agents while non-adopting platforms cannot), this could be characterized as an unfair method of competition. But this is true of any standard — HTTP gives web servers an advantage over BBS operators. The FTC wouldn't challenge this.

- **Coordinated information sharing:** The FTC has been more aggressive than DOJ on information-sharing cases. Under *FTC v. Qualcomm* (969 F.3d 974, 9th Cir. 2020, partially reversed), the FTC challenged Qualcomm's licensing practices as unfair. If EXIT enables platforms to share agent reputation data in ways that facilitate coordinated exclusion, the FTC could investigate under §5 even without proving a Sherman Act violation.

- **Algorithmic collusion through EXIT:** If platforms use automated systems to process EXIT markers and those systems converge on identical exclusion decisions without human agreement, this is the frontier question of "algorithmic collusion." The FTC and DOJ have signaled interest in this area. EXIT markers providing standardized inputs to exclusion algorithms could be the triggering infrastructure.

### 4.2 Unfair or Deceptive Acts

Less relevant. EXIT is transparent about what markers contain. Unless markers are used deceptively (e.g., a platform publishes false attestations to deceive receiving platforms), UDAP claims are unlikely.

---

## 5. Platform Retaliation Angle

### 5.1 Tortious Interference with Business Relations

Could platforms sue EXIT users/publishers for tortious interference?

Elements (Restatement (Second) of Torts §766B): (1) existence of a business relationship, (2) defendant's knowledge of the relationship, (3) intentional interference causing breach or termination, (4) damages.

**Platform A suing exiting agents:** Platform A has business relationships with its agents. Agents using EXIT to leave — even en masse — are exercising their right to terminate, not "interfering" with their own relationships. Tortious interference requires a *third party's* interference. An agent leaving its own platform relationship is not tortious interference. **Weak claim.**

**Platform A suing Cellar Door (protocol publisher):** Platform A could argue that EXIT was designed to facilitate agent departure, and that Cellar Door knowingly published a tool to interfere with Platform A's agent relationships. Under *Lumley v. Gye* (1853) and its progeny, inducing contract breach is actionable. But EXIT doesn't induce breach — it documents departure. EXIT is closer to a moving company than a home-wrecker. Publishing a protocol that enables departure is not inducement. **Weak claim.**

**Platform A suing Platform B for poaching via EXIT:** If Platform B actively recruits Platform A's agents using EXIT data (e.g., scanning for `disputed` markers and offering those agents better terms), this is competitive recruitment, not tortious interference — unless Platform B induces breach of a valid non-compete or exclusivity agreement. **Potentially viable only if agents have enforceable exclusivity agreements.**

### 5.2 Unfair Competition (State Law)

State unfair competition claims (e.g., California UCL §17200) could be used by platforms against EXIT-based coordination. The UCL's "unlawful, unfair, or fraudulent" prong is extremely broad. A platform could argue that coordinated EXIT constitutes "unfair" business practices. However, UCL claims require injury to competition (not just a competitor), and agent portability enhances competition. **Weak claim.**

### 5.3 CFAA / Computer Fraud

Could creating an EXIT marker constitute unauthorized access under the CFAA? If the marker references platform data (state hashes, asset manifests) that the platform considers proprietary, creating the marker could theoretically violate CFAA §1030(a)(2). This intersects with the platform TOS issue flagged in red team v2 §2.6. The risk is **low** for the core marker (7 fields, no platform data) but **medium** for Module B/D markers that reference platform-internal information.

---

## 6. International Analysis

### 6.1 EU Competition Law

**TFEU Article 101** (equivalent to Sherman Act §1): Prohibits agreements that restrict competition. Analysis parallels §1 — coordinated exit could constitute a concerted practice under Art. 101(1). However, Art. 101(3) provides an exemption for agreements that improve production or distribution with fair consumer benefit. Agent portability arguably qualifies.

The European Commission has been aggressive on information exchange: *Anic Partecipazioni* (Case C-49/92) held that exchanging strategic information creates a presumption of concerted practice. EXIT markers containing departure status are "strategic information" about agent-platform relationships. If platforms exchange this information and adjust behavior accordingly, Art. 101(1) is engaged.

**TFEU Article 102** (equivalent to Sherman Act §2): Prohibits abuse of dominant position. A dominant platform using EXIT markers to impede agent migration (e.g., systematically marking departures as `disputed`) could constitute abuse under Art. 102(b) (limiting markets to the prejudice of consumers) or Art. 102(c) (applying dissimilar conditions to equivalent transactions).

The Commission's *Google Shopping* decision (Case AT.39740, 2017) established that a dominant platform self-preferencing in adjacent markets violates Art. 102. A dominant platform manipulating EXIT markers to disadvantage competitors is analogous.

**Digital Markets Act (2024):** Gatekeepers under the DMA are required to enable data portability (Art. 6(9)). EXIT could be viewed as infrastructure supporting DMA compliance. If so, DMA-designated gatekeepers may be *required* to support EXIT-style portability — which flips the antitrust narrative from "EXIT enables violations" to "EXIT enables compliance." This is the strongest defensive argument in the EU context.

### 6.2 Canadian Competition Act

**Part VI — Offenses Relating to Competition:**
- §45 (Conspiracy): Criminal prohibition on agreements to fix prices, allocate markets, or restrict output. Coordinated EXIT that amounts to market allocation (agents agree to leave Platform A for Platform B) could trigger §45. But §45(4) exempts agreements between non-competitors, and agents on the same platform may not be competitors with each other.
- §48 (Bid-rigging): Not applicable.

**Part VIII — Reviewable Matters:**
- §75 (Refusal to Deal): The Competition Tribunal can order a person to supply a product if refusal substantially affects the target's business. A platform collectively denied agents via EXIT coordination could seek relief under §75.
- §79 (Abuse of Dominant Position): Similar to EU Art. 102. A dominant platform manipulating EXIT markers is reviewable conduct.

**Risk: Low.** Canada's Competition Bureau has limited enforcement resources and focuses on merger review and price-fixing. Agent portability protocols are unlikely to attract Bureau attention absent clear market harm.

### 6.3 Other Jurisdictions

**UK Competition Act 1998:** Mirrors EU framework (Chapter I = Art. 101, Chapter II = Art. 102). CMA is an active enforcer, particularly in digital markets post-Brexit. The CMA's Digital Markets, Competition and Consumers Act 2024 gives it new powers over designated "strategic market status" firms — functionally similar to DMA gatekeepers. Same analysis as EU applies.

**Australia (Competition and Consumer Act 2010):** §45 prohibits contracts restricting competition. §46 prohibits misuse of market power. Australian competition law is effects-based post-2017 reforms — any EXIT-facilitated conduct that has the purpose, effect, or likely effect of substantially lessening competition is actionable.

**Japan (Act on Prohibition of Private Monopolization):** Art. 3 prohibits private monopolization and unreasonable restraint of trade. JFTC is active but focuses on traditional industries. Low risk for EXIT.

---

## 7. Case Law — Relevant Precedents

### Group Boycott Cases

| Case | Relevance |
|------|-----------|
| *Klor's v. Broadway-Hale* (1959) | Established per se illegality for group boycotts. BUT the boycotting entities were competitors with market power. If EXIT agents lack market power, per se treatment doesn't apply. |
| *Northwest Wholesale Stationers v. Pacific Stationery* (1985) | Narrowed per se group boycott doctrine. Per se only when boycotters have market power or exclusive access to essential element. EXIT agents unlikely to meet this threshold. |
| *FTC v. Indiana Federation of Dentists* (476 U.S. 447, 1986) | Group refusal to deal analyzed under rule of reason. Collective refusal to provide X-rays to insurers was anticompetitive. Analogous to agents collectively refusing to participate on a platform. |
| *Fashion Originators' Guild v. FTC* (312 U.S. 457, 1941) | Coordinated refusal to deal with retailers selling copied designs was per se illegal. Could apply if agents coordinate to punish platforms they view as bad actors. |

### Platform / Tech Antitrust

| Case | Relevance |
|------|-----------|
| *United States v. Microsoft* (2001) | Monopolist cannot raise rivals' costs through anticompetitive conduct. Dominant platform weaponizing EXIT markers to impede departure fits this framework. |
| *FTC v. Qualcomm* (2020, 9th Cir.) | Reversal limited FTC's ability to challenge component-level licensing as antitrust violation. But the case established that standard-essential technology licensing is subject to antitrust scrutiny. If EXIT becomes standard-essential, relevant. |
| *Epic Games v. Apple* (2021) | Apple's App Store policies analyzed under rule of reason. Apple won on most counts but lost on anti-steering provisions under California UCL. Relevant: platform control over participant exit/entry is antitrust-cognizable. |
| *Google Shopping* (EU, 2017) | Dominant platform self-preferencing violates Art. 102. Direct precedent for dominant platform manipulating EXIT markers. |
| *Ohio v. American Express* (2018) | Supreme Court required showing harm to competition on both sides of a two-sided market. Complicates antitrust claims against platforms — must show harm to both agents and end-users. |

### Information Exchange

| Case | Relevance |
|------|-----------|
| *Container Corp. of America* (1969) | Information exchange among competitors that facilitates parallel conduct violates §1. EXIT markers as information exchange infrastructure is the direct analogy. |
| *Todd v. Exxon* (275 F.3d 191, 2d Cir. 2001) | Salary information exchange among competitors could violate §1. Reputation/status information exchange via EXIT is analogous. |
| *Anic Partecipazioni* (EU, 1999) | Strategic information exchange creates presumption of concerted practice under Art. 101. |

---

## 8. Risk Rating

### Overall: **Medium**

**Breakdown:**

| Scenario | Risk | Rationale |
|----------|------|-----------|
| Independent agents using EXIT to leave platforms | **Low** | Unilateral conduct. No agreement. Not antitrust-cognizable. |
| Agents coordinating exit timing via EXIT signals | **Medium** | Could constitute concerted practice, but agents likely lack market power. Rule of reason applies; procompetitive justification (portability) is strong. |
| Platforms using EXIT data to coordinate exclusion | **High** | Horizontal competitor coordination using shared information. Strongest antitrust theory. Container Corp. analogy applies. |
| Dominant platform weaponizing EXIT markers | **High** | §2 / Art. 102 abuse of dominance. Microsoft precedent directly applicable. |
| EXIT as standard-essential coordination hub | **Medium** | Theoretical until EXIT achieves meaningful adoption. If it becomes standard, design choices become antitrust-relevant per Qualcomm. |
| Protocol publisher (Cellar Door) liability | **Low** | Designing a neutral protocol is not conspiracy. No more liable than HTTP publishers for web-based antitrust violations. |

### Why Not Higher?

1. **Agent personhood is unsettled.** If agents aren't independent economic actors (red team §2.1), they can't form antitrust conspiracies. The antitrust risk depends on a legal determination that hasn't been made.
2. **EXIT is procompetitive.** Agent portability enhances competition by reducing switching costs and platform lock-in. Under rule of reason, procompetitive justification is strong. This is the same argument that makes data portability requirements (GDPR Art. 20, DMA Art. 6(9)) politically popular.
3. **No enforcement precedent.** No antitrust authority has investigated agent mobility protocols. This is novel territory. Enforcement agencies prioritize established patterns.
4. **The protocol is neutral.** EXIT doesn't coordinate behavior — it documents departure. The telephone enables conspiracy but isn't a conspirator.

### Why Not Lower?

1. **The information exchange theory is real.** Container Corp. established that competitors sharing strategic information violates §1 even without explicit agreement. EXIT markers are strategic information.
2. **Platform-side coordination risk is concrete.** If multiple platforms read EXIT data and converge on exclusion decisions, the FTC will investigate — regardless of whether a formal agreement exists.
3. **The algorithmic collusion frontier.** Automated processing of EXIT markers creating coordinated exclusion without human agreement is exactly the scenario antitrust scholars and enforcers are worried about.

---

## 9. Mitigation — Design Choices That Reduce Antitrust Risk

### 9.1 Protocol-Level Mitigations

1. **No aggregation tools.** Do not build or endorse tools that aggregate EXIT markers across agents or platforms. Aggregation creates the information exchange infrastructure that triggers Container Corp. concerns. Individual markers = references. Aggregated databases = antitrust risk.

2. **Selective disclosure by default.** EXIT markers should not be publicly indexable. Agents should control who sees their markers. This prevents platforms from passively surveilling competitor-platform departures. ZK selective disclosure (already roadmapped) is the strongest mitigation — it allows verification without revealing origin platform identity.

3. **No coordination features.** The protocol must not include any mechanism for agents to signal intent to exit collectively, discover other agents' exit plans, or time departures. EXIT documents individual departures. If it ever facilitates group action, the antitrust exposure increases dramatically.

4. **Neutral status vocabulary.** The `originStatus` field should be documented as the origin platform's unilateral characterization, not a shared assessment. Verifiers should be guided to treat origin attestations as one party's view, not as authoritative determinations. This reduces the risk of status values becoming coordination signals.

5. **Anti-retaliation guidance.** Document in LEGAL.md that using EXIT markers to systematically exclude agents from a specific origin platform may violate competition law. Put platforms on notice.

6. **Procompetitive framing in all documentation.** Consistently frame EXIT as portability infrastructure that reduces lock-in and enhances competition. If antitrust scrutiny comes, the documentary record should show procompetitive intent. This matters under rule of reason analysis.

### 9.2 Governance Mitigations

7. **Open standard, open governance.** If EXIT becomes standard-essential, ensure the specification is governed by an open process (W3C, IETF, or similar). Antitrust risk from controlling a standard-essential specification is significantly reduced by open governance. Qualcomm-style concerns disappear when no single entity controls the standard.

8. **FRAND licensing (if patents emerge).** If any EXIT-related patents are filed (by Cellar Door or implementers), commit to Fair, Reasonable, and Non-Discriminatory licensing. This is standard practice for essential patents and eliminates the §2 essential facilities argument.

### 9.3 Documentation Mitigations

9. **Add antitrust warning to SECURITY.md.** Per the red team's recommendation (§2.3): note that coordinated use of EXIT markers for collective refusal to deal may violate competition law. Estimated cost: $0, 2 hours.

10. **Add antitrust section to LEGAL.md.** Brief statement: "EXIT is designed to facilitate individual agent portability. Coordinated use of EXIT markers to collectively boycott platforms, allocate markets, or exclude competitors may violate antitrust law including Sherman Act §1, TFEU Article 101, and equivalent statutes. Users are responsible for ensuring their use of EXIT markers complies with applicable competition law."

11. **Implementer guidance.** Provide guidance to platforms implementing EXIT that using EXIT data to coordinate exclusion decisions with competitor platforms may create antitrust liability. Each platform should make independent acceptance/rejection decisions based on its own policies, not on observed behavior of other platforms.

---

## Appendix: Comparison with Red Team Finding

The red team (§2.3) flagged this as **HIGH** severity. My assessment is **MEDIUM** overall, with specific scenarios reaching HIGH.

**Where I agree with the red team:**
- Platform-side coordination via EXIT is a real antitrust risk
- EXIT as standard-essential infrastructure creates antitrust-relevant design choices
- This needs to be addressed in SECURITY.md and LEGAL.md

**Where I diverge:**
- The "per se violation" framing is too aggressive. Per se treatment for group boycotts has been significantly narrowed since Klor's. Rule of reason is the likely framework, and EXIT's procompetitive justification is strong.
- The FTC v. Qualcomm citation is partially misleading — the 9th Circuit reversed key portions of the district court's holding, limiting the precedent's applicability.
- Agent legal personhood uncertainty actually *reduces* antitrust risk because agents that aren't independent economic actors can't form conspiracies.

**What the red team missed:**
- The algorithmic collusion angle (automated processing creating coordination without agreement)
- The DMA defensive argument (EXIT as infrastructure for mandatory portability compliance)
- The tortious interference retaliation vector
- EU-specific analysis beyond the Qualcomm mention

---

*This analysis was prepared to fill an identified gap in legal coverage. It should be cross-referenced with the legal battery and red team reports. The antitrust risk is real but manageable with appropriate design choices. The biggest risk is not the protocol itself but how platforms use EXIT data to coordinate behavior — and the strongest mitigation is ensuring EXIT markers are subject to selective disclosure rather than public broadcast.*
