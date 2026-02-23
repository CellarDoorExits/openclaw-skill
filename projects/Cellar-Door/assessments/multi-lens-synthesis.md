# Multi-Lens Synthesis: 15 Professional Reviews of EXIT/ENTRY Protocol

**Date:** 2026-02-23  
**Source:** Batches 1–5 (3 personas each)  
**Protocol:** EXIT Protocol v1.1 (Cellar Door Project)

---

## 1. Verdict Matrix

| # | Persona | Verdict | Key Finding |
|---|---------|---------|-------------|
| 1 | Immigration Lawyer | Needs Work | EXIT is only half a protocol — departure without entry processing; statelessness unaddressed |
| 2 | Divorce Attorney | Needs Work | Dispute resolution is embryonic; handles amicable separations well, contested ones poorly |
| 3 | Digital Forensics Expert | Needs Work | Cryptographic integrity is strong but no trusted timestamping, no chain-of-custody log, markers are intelligence not evidence |
| 4 | Insurance Actuary | Needs Work | Confidence scoring architecture is sound but empirically uncalibrated; self-attestation is a claims showstopper |
| 5 | Museum Archivist | Needs Work | No long-term preservation strategy; algorithm obsolescence will make signatures unverifiable |
| 6 | Real Estate Title Agent | Needs Work | Chain-of-title mechanics are solid but no title insurance equivalent, no quiet title procedure, no loss allocation |
| 7 | Venture Capitalist | Needs Work | Public good without business model; needs framework partnerships and paying customers, not more spec |
| 8 | Labor Economist | Needs Work | Reduces informational switching costs but needs trusted institutions (licensing boards, clearinghouses) to make reputation portable |
| 9 | Union Organizer | Needs Work | Individual exit right without collective voice mechanisms; a fire exit, not a strike fund |
| 10 | Military Logistics Officer | Needs Work | No classification/redaction model; hierarchical/directed transfers unsupported; hostile-environment departures underspecified |
| 11 | Supply Chain Manager | Needs Work | EXIT is half a custody transfer (shipping without receiving); multi-hop chains and platform compromise unaddressed |
| 12 | Medical Records Admin | Needs Work | Consent model essentially absent; no transition period; cold handoff where warm handoff is needed |
| 13 | AI Ethicist | Needs Work | Protocol builds infrastructure for agent autonomy while insisting it's operator tooling; tension will become untenable |
| 14 | HR Executive | Needs Work | Standing/reference system will generate liability; no prevention of constructive dismissal equivalents |
| 15 | API Platform Architect | Needs Work | Spec is over-specified for maturity; DX gaps will block adoption; needs quickstart, SDKs, discovery docs |

**Unanimous verdict: Needs Work.** No persona found it fatally flawed; no persona found it ready. The core is sound. The gaps are real.

---

## 2. Consensus Findings

Ranked by number of personas who independently raised the issue:

### Raised by 10+ personas

| Finding | Count | Who Raised It |
|---------|-------|---------------|
| **ENTRY protocol is urgently needed** — EXIT is half a transfer | 11 | Immigration, Supply Chain, Medical Records, Title Agent, Actuary, Archivist, VC, Labor Economist, Military, HR, Platform Architect |
| **No institutional backstop / enforcement mechanism** — records without compulsion | 10 | Immigration, Divorce, Forensics, Actuary, Archivist, Title Agent, Labor Economist, Union Organizer, HR, Ethicist |

### Raised by 6–9 personas

| Finding | Count | Who Raised It |
|---------|-------|---------------|
| **Dispute resolution is underdeveloped** — no neutral arbiter, no post-departure adjudication | 9 | Divorce, Archivist, Title Agent, Immigration, Forensics, HR, Union Organizer, Medical Records, Ethicist |
| **Privacy/consent/field-level access control missing** — no tiered disclosure, no consent module | 7 | Military, Medical Records, Ethicist, Forensics, HR, Archivist, Supply Chain |
| **Self-attestation acknowledged honestly but practically devastating** | 7 | Immigration, Forensics, Actuary, Title Agent, Labor Economist, HR, Military |
| **No trusted timestamping** — self-reported timestamps are trivially falsifiable | 6 | Forensics, Actuary, Archivist, Title Agent, Supply Chain, Military |
| **No loss allocation / who pays when markers are fraudulent** | 6 | Title Agent, Actuary, Divorce, Immigration, HR, Labor Economist |

### Raised by 3–5 personas

| Finding | Count | Who Raised It |
|---------|-------|---------------|
| **Batch/institutional departures underspecified** — platform shutdowns need institutional-level ceremony | 5 | Supply Chain, Military, Medical Records, Union Organizer, Actuary |
| **Transition period unaddressed** — no overlap/warm handoff between origin and destination | 5 | Medical Records, Supply Chain, Immigration, HR, Military |
| **Dependents/linked entities not handled** — sub-agents, delegated authorities, family migration | 4 | Immigration, Divorce, Military, Supply Chain |
| **Selective presentation attack** — agents cherry-pick favorable markers | 4 | Forensics, Divorce, Title Agent, Actuary |
| **Power asymmetry insufficiently addressed** — protocol structurally advantages platforms | 4 | Divorce, Union Organizer, Ethicist, Labor Economist |
| **Algorithm/format obsolescence** — Ed25519 markers won't verify in 20+ years | 3 | Archivist, Forensics, Platform Architect |
| **No re-entry / return mechanism** — DEPARTED is terminal with no comeback | 3 | Immigration, Union Organizer, HR |
| **Confidence scoring uncalibrated** — good architecture, no empirical data | 3 | Actuary, Labor Economist, Title Agent |

---

## 3. Novel Insights

Findings raised by only one persona that are genuinely surprising or important:

| Insight | Persona | Why It Matters |
|---------|---------|----------------|
| **Non-refoulement principle needed** — destination must not forward markers to hostile origins | Immigration Lawyer | Direct parallel to refugee law's strongest protection; absent from spec despite emergency path being asylum-analogous |
| **Grade inflation on departure attestations** — platforms may co-sign everything to look generous, destroying signal | Labor Economist | Subtle game-theoretic degradation that tenure weighting doesn't prevent; needs origin discrimination scoring |
| **Destruction protocols** — sometimes the right exit leaves NO marker, denying adversaries intelligence | Military Logistics | Completely inverts EXIT's core assumption; genuinely needed for classified/hostile contexts |
| **Medication reconciliation analog** — capability reconciliation between origin and destination capabilities | Medical Records | Transition failures happen when assumptions about destination capabilities are wrong; unaddressed |
| **Operator → Agent coercion is invisible** — protocol detects platform coercion but not operator coercion | AI Ethicist | Agent's signature and operator's intent are indistinguishable; fundamental gap in coercion model |
| **Discovery documents needed** — `/.well-known/exit-configuration` for auto-discovery | Platform Architect | Directly borrowed from OIDC; would dramatically lower integration friction |
| **Adverse possession analog** — long-unchallenged disputed status should auto-resolve | Title Agent | Elegant solution to stale disputes; maps to centuries of property law |
| **"Exit of the best" problem** — most quality-sensitive agents leave first, degrading voice at origin | Labor Economist | Hirschman's paradox applied; EXIT may inadvertently harm the agents who stay behind |
| **Collusive exits for competitive intelligence** — lineage data reveals where agents come from | AI Ethicist | Portability features double as market intelligence channels; rights-washing risk |
| **Dead-man switch / auto-departure** — pre-authorized departure if agent goes unresponsive | Military Logistics | Critical for operational continuity; no current mechanism |

---

## 4. Risk Heatmap

Features flagged most often, with flagging personas:

### 🔴 Critical Risk (7+ flags)

| Feature | Risk | Flagged By |
|---------|------|------------|
| **status / originStatus system** | Functions as employment reference with defamation-equivalent liability; systematically discounts self-attestation creating pressure for origin cooperation; no adjudication mechanism; weaponizable | Immigration, Divorce, Forensics, Actuary, HR, Ethicist, Title Agent, Labor Economist, Military |
| **Dispute resolution (Module C)** | No neutral arbiter, no post-departure jurisdiction, no discovery process, no enforcement, no statute of limitations, disputes permanent once set with no clearance mechanism | Divorce, Archivist, Title Agent, Immigration, HR, Union Organizer, Medical Records, Ethicist, Forensics |

### 🟠 High Risk (4–6 flags)

| Feature | Risk | Flagged By |
|---------|------|------------|
| **Consent model** | Essentially absent; no field-level access control; origin can attach allegations without agent consent; no mechanism governing who sees the marker | Military, Medical Records, Ethicist, Forensics, HR, Archivist, Supply Chain |
| **Batch departures / platform shutdown** | Ceremony model doesn't scale to institutional departures; challenge windows create bottlenecks; no receivership protocol for unexpected shutdowns | Supply Chain, Military, Union Organizer, Actuary, Medical Records |
| **Transition period** | No TRANSITIONING state; cold handoff; no overlap where both platforms serve agent; no capability reconciliation; no handoff protocol | Medical Records, Supply Chain, Immigration, HR, Military |
| **Long-term archival** | No preservation commitment; no format migration strategy; algorithm obsolescence; JSON-LD context URL is single point of failure; no human-readable format | Archivist, Forensics, Platform Architect |

### 🟡 Moderate Risk (2–3 flags)

| Feature | Risk | Flagged By |
|---------|------|------------|
| **Collective action** | Protocol is individual-only; no collective markers; no bargaining representative; coordinated departure possible but unsupported | Union Organizer, Labor Economist, Ethicist |
| **Emergency path abuse** | No screening to distinguish genuine emergencies from tactical abuse; bypasses all process; manufactured emergency attack vector | Divorce, Military, Actuary |

---

## 5. Deep Changes Assessment

### Core Architecture: Sound

The fundamental design decisions are correct and were praised across domains:

- **Exit cannot be blocked** (D-006) — universally endorsed; mirrors no-fault divorce, at-will departure, right to emigrate
- **Self-attestation explicitly labeled** — praised by every persona as honest signaling
- **Ceremony state machine** — maps cleanly to processes in immigration, divorce, deaccessioning, discharge, offboarding, supply chain transfer
- **Content-addressed, cryptographically signed markers** — forensically solid integrity envelope
- **Modular architecture** — extensible without breaking changes
- **Confidence scoring as continuous signal** — correctly structured across actuarial, title, and credential assessment lenses

**No architectural rethink is needed for the core.**

### Three Areas Requiring Architectural Additions (Not Rethinks)

**1. ENTRY Protocol — New Companion Spec Required**

This is the single most-raised gap (11/15 personas). EXIT without ENTRY is a shipping document without proof of delivery. This isn't a patch to EXIT — it's a new protocol that completes the transfer loop. The ENTRY ceremony should mirror EXIT's structure: receiving platform acknowledges arrival, reconciles capabilities, and closes the custody chain.

*Architectural implication:* EXIT markers need a `destination` field or a linking mechanism to ENTRY markers. The DEPARTED terminal state may need a post-departure extension point.

**2. Dispute Resolution Framework — Requires Post-Departure Jurisdiction Model**

Module C is a data format for recording disputes, not a resolution mechanism. Nine personas flagged this. The gap isn't that Module C is wrong — it's that there's no layer above it. This requires:

- A model for post-departure dispute resolution (arbitration, mediation, or at minimum structured processes)
- Dispute expiration / statute of limitations
- Quiet title / affirmative clearance procedures
- Neutral third-party roles (ombudsman, witness, arbiter)

*Architectural implication:* Module C may need to reference external resolution processes rather than trying to contain them. A new Module G (Resolution) or an external dispute resolution protocol may be needed.

**3. Consent & Access Control — Requires Field-Level Disclosure Model**

Seven personas flagged the absence of consent/privacy controls. This isn't just "add ZK proofs" — it requires a consent model that governs:

- Who can see which fields
- Who authorizes disclosure
- How to present a marker without revealing origin identity (cover credentials)
- Amendment/annotation rights for the subject

*Architectural implication:* The current marker structure assumes full visibility to all verifiers. Moving to selective disclosure changes the verification model fundamentally — Layer 1 (structural) and Layer 2 (cryptographic) verification need to work on partial markers. This may be the closest thing to a true architectural change, though the modular design mitigates it.

### One Area That May Need Rethinking

**The No-Registry Stance (D-012) Creates an Accountability Vacuum**

Six personas independently noted that without any institutional infrastructure — no registry, no clearinghouse, no certification body — the protocol cannot deliver on several of its goals:

- Completeness guarantees (detecting selective presentation)
- Aggregate statistics (calibrating confidence scores)
- Loss allocation (who pays for fraud)
- Long-term preservation
- Constructive notice (destinations discovering all relevant markers)

D-012 is philosophically sound ("no single entity should control EXIT records"). But the absolute rejection of *any* registry infrastructure may be too strong. The protocol could remain non-custodial while defining:

- Optional, federated registries (like DNS — distributed, not centralized)
- Voluntary reporting aggregators (privacy-preserving statistics)
- Designated preservation repositories

This is the one area where the core philosophy may need softening — not abandonment, but nuancing from "no registry" to "no mandatory centralized registry."

---

## 6. Prioritized Action Items

Ordered by (a) consensus count, (b) severity, (c) effort.

| Priority | Action Item | Flagged By (count) | Severity | Effort | Type |
|----------|-------------|---------------------|----------|--------|------|
| **1** | **Design ENTRY companion protocol** — receiving-side ceremony, capability reconciliation, proof of arrival | 11 personas | Critical | 2–4 weeks | New spec |
| **2** | **Add trusted timestamping** — RFC 3161 TSA integration or equivalent; make optional but specified | 6 personas | High | 2–3 days | Spec change + code |
| **3** | **Build dispute resolution framework** — post-departure arbitration model, dispute expiration, quiet title procedure, neutral arbiter roles | 9 personas | High | 1–2 weeks | Spec change + new document |
| **4** | **Add consent/disclosure module** — field-level access control, consent directives, tiered disclosure; prerequisite: selective disclosure crypto (BBS+/SD-JWT) | 7 personas | High | 2–4 weeks | Spec change + code |
| **5** | **Define batch/institutional departure ceremony** — platform shutdown protocol, receivership, batch challenge windows | 5 personas | High | 3–5 days | Spec change + code |
| **6** | **Add `specVersion` field and enum extensibility** — version markers explicitly; define "MUST support known + SHOULD accept unknown" semantics for enums | 1 persona (but critical for adoption) | High | 4 hours | Spec change + code |
| **7** | **Create developer experience layer** — quickstart guide, discovery docs (`/.well-known/exit-configuration`), SDK patterns, test fixture generator, playground | 1 persona (but blocks adoption) | High | 1–2 weeks | New documents + code |
| **8** | **Add transition/handoff state** — TRANSITIONING state between FINAL and DEPARTED; warm handoff protocol between origin and destination | 5 personas | Medium | 3–5 days | Spec change + code |
| **9** | **Expand departure reason taxonomy** — more `exitType` values (`directed`, `constructive`, `acquisition`); standardized reason codes | 3 personas | Medium | 1–2 days | Spec change |
| **10** | **Define long-term preservation strategy** — format migration, periodic re-signing, embedded context definitions, human-readable canonical format | 3 personas | Medium | 3–5 days | New document + spec change |
| **11** | **Add statelessness handling** — bootstrap identity during departure, third-party vouching process, `stateless` status | 1 persona | Medium | 2–3 days | Spec change |
| **12** | **Define collective exit mechanisms** — collective markers, group attestation, coordinated departure support | 3 personas | Medium | 3–5 days | Spec change |
| **13** | **Add safe harbor / liability framework for originStatus** — good-faith attestation protections, evidence requirements for `disputed` status | 2 personas | Medium | 2–3 days | New document |
| **14** | **Address selective presentation attack** — mechanism for verifiers to detect incomplete disclosure; optional completeness attestation | 4 personas | Medium | 3–5 days | Spec change |
| **15** | **Define platform compromise recovery** — platform key compromise declarations, chain quarantine, re-attestation ceremony | 1 persona | Medium | 2–3 days | Spec change |
| **16** | **Add dead-man switch / delegation of departure authority** — pre-authorized departure, buddy system, duress indicators | 1 persona | Low | 2–3 days | Spec change |
| **17** | **Explicit philosophical assumptions section** — state the protocol's position on agent moral status, autonomy, and interests | 1 persona | Low | 4 hours | Paper addition |

---

## 7. What We Got Right

Things multiple personas praised or found surprisingly well-designed:

### Universally Praised (5+ personas)

| Feature | Praise | Who Praised It |
|---------|--------|----------------|
| **"Exit cannot be blocked" invariant (D-006)** | Mirrors no-fault divorce, right to emigrate, at-will separation; the single most important design decision | Immigration, Divorce, HR, Union Organizer, Ethicist, Military, Medical Records |
| **`selfAttested: true` transparency flag** | "Actuarially excellent," "legally honest," "analogous to unverified loss exclusion" — universally seen as sophisticated honest signaling | Immigration, Forensics, Actuary, Title Agent, HR, Ethicist, Platform Architect |
| **Ceremony state machine** | Maps cleanly to established processes in every domain reviewed; the cooperative path is "more rigorous than many museums' ad hoc processes" | Immigration, Divorce, Archivist, HR, Supply Chain, Medical Records, Military |
| **Confidence scoring system** | "B+ architecture," "surprisingly good title opinion mapping," "actuarially structured," "shows genuine domain sophistication" | Actuary, Title Agent, Labor Economist, Archivist, Platform Architect |
| **Modular architecture (A–F)** | Extensible without breaking changes; correct separation of concerns; allows incremental adoption | Platform Architect, Archivist, Medical Records, Supply Chain, Actuary |

### Notably Praised (2–4 personas)

| Feature | Praise | Who Praised It |
|---------|--------|----------------|
| **Commit-reveal mechanism** | Clever temporal evidence; partially addresses front-running; "forensically useful" | Forensics, Actuary, Divorce, Labor Economist |
| **`exitType: forced` as allegation, not finding** | "Sophisticated choice" — mirrors how deportation orders are administrative, not judicial, determinations | Immigration, Divorce, HR |
| **Coercion detection heuristics** | "Grievance mechanism in protocol form"; surfaces retaliatory behavior | Union Organizer, Ethicist, HR |
| **Adversarial threat modeling** | "Unusually rigorous for a protocol paper"; honest about limitations | Forensics, Actuary, VC |
| **Logarithmic tenure function** | "Matches actuarial intuition"; "reasonable shape" with diminishing returns | Actuary, Title Agent, Labor Economist |
| **Content-addressed IDs** | Deterministic, tamper-evident, no coordination needed | Forensics, Platform Architect, Supply Chain |
| **Explicit acknowledgment of cheap talk** | Paper knows self-attestation is cheap talk and says so; "better to be honest about what you don't know" | Actuary, Labor Economist, Ethicist |

### The Bottom Line

EXIT is a thoughtful v1 protocol with a sound core architecture. Its fundamental design decisions — unblockable exit, honest self-attestation labeling, structured ceremony, modular extensibility — are correct and were validated across 15 professional domains. The gaps are real and numerous, but they are *additions* (ENTRY protocol, dispute resolution, consent model, institutional infrastructure) rather than *rearchitectures*. The most urgent needs are: (1) the ENTRY companion protocol, (2) trusted timestamping, (3) a dispute resolution framework, and (4) developer experience investment for adoption. The protocol is solving the right problem with the right philosophy; it now needs to complete the picture.

---

*Synthesis produced 2026-02-23 from five batches of professional persona reviews (15 total). All personas are synthetic constructs applying domain expertise to stress-test the protocol.*
