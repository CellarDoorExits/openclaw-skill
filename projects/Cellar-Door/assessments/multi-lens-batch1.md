# Multi-Lens Professional Review: EXIT Protocol (Cellar Door)

**Review Date:** 2026-02-23
**Documents Reviewed:** EXIT_PAPER_v4.md, EXIT_SPEC_v1.1.md (via paper references)
**Review Batch:** 1 of N

---

## PERSONA 1: Immigration Lawyer

**Background:** 18 years in visa portability, status transfers between jurisdictions, consular processing, and statelessness cases.

### Executive Summary

EXIT resembles a self-issued travel document — useful for narrative continuity but lacking the institutional recognition that makes documents *operative*. The three ceremony paths map surprisingly well to voluntary departure, removal, and asylum respectively, but the protocol fundamentally underestimates how much departure processing depends on *bilateral agreements between jurisdictions* rather than unilateral declarations by the traveler. The `selfAttested: true` flag is legally honest but practically devastating — it's the equivalent of arriving at a border with a document you wrote yourself.

### Domain Parallels

| EXIT Concept | Immigration Analog |
|---|---|
| Cooperative ceremony | Voluntary departure with exit stamp and letter of good standing |
| Unilateral path | Self-deportation / departure without consular clearance |
| Emergency path | Asylum claim — immediate protection, documentation follows |
| EXIT marker | Travel document / certificate of identity |
| Module A (Lineage) | Passport renewal chain — linking old passport to new |
| Module C (Dispute) | Consular note / Interpol red notice attached to file |
| `good_standing` status | Police clearance certificate |
| Confidence scoring | Visa risk assessment / points-based immigration scoring |
| DID | Passport number / national ID |
| Origin platform | Country of nationality/residence |

### Answers to Questions

**1. How does EXIT's "departure ceremony" map to consular exit/entry processing? What's missing?**

The cooperative path maps well to a planned emigration: the subject declares intent (visa application), a snapshot of status is taken (police clearance, tax clearance), a challenge window opens (background check period), and a final document is issued. What's missing:

- **Entry-side processing.** EXIT is entirely departure-focused. In immigration, the *receiving* jurisdiction does most of the work — visa issuance, admissibility determination, port-of-entry inspection. EXIT has no ENTRY protocol. The paper assumes destinations will build their own acceptance policies, but without a standardized ENTRY ceremony, every destination reinvents the wheel.
- **Bilateral/multilateral agreements.** Real exit/entry depends on treaties (visa waiver programs, mutual recognition agreements). EXIT has no framework for platform-to-platform agreements that would give markers actual weight.
- **Pre-departure authorization.** In immigration, you often need the destination's permission *before* departing (visa). EXIT's model of "depart first, present credentials on arrival" only works for visa-free travel — the easiest case.
- **Consular notification.** When a national departs, their country of origin sometimes has rights (Vienna Convention on Consular Relations). There's no analog for notifying the origin platform's "consular" equivalent.

**2. Are the cooperative/unilateral/emergency paths analogous to voluntary departure, removal, and asylum?**

Remarkably close:

- **Cooperative = Voluntary departure.** The subject leaves on agreed terms, with documentation from both sides. The challenge window is analogous to the period where the departing jurisdiction can raise objections.
- **Unilateral = Departure without status.** The subject leaves without origin cooperation. In immigration, this is departing a country that won't issue exit documents (e.g., leaving North Korea). The document you carry is weaker, but you're *out*.
- **Emergency = Asylum/refugee status.** Immediate departure under duress, documentation is minimal, the claim is "I needed to leave *now*." The parallel is strong — asylum seekers often arrive with nothing and must reconstruct their identity and standing.
- **Forced exit type = Removal/deportation.** The origin initiates departure. EXIT wisely treats `forced` as a departure type rather than blocking it — just as a deported person still has the right to *be somewhere*.

The `exitType: forced` combined with `originStatus` as "allegation" is a sophisticated choice — it mirrors how deportation orders are administrative determinations subject to judicial review, not final findings of fact.

**3. What happens to "standing" claims when the origin jurisdiction doesn't recognize the protocol?**

This is the central problem, and EXIT doesn't solve it adequately. In immigration:

- If Country A doesn't recognize Country B's passports, a traveler from B cannot enter A regardless of document quality.
- The solution is diplomatic recognition, bilateral agreements, or third-party guarantees (UN travel documents for refugees).

EXIT's approach — self-attestation with optional origin co-signature — is the equivalent of a Nansen passport: a document issued by a third-party framework for people whose origin won't provide one. Nansen passports *worked* because the League of Nations provided institutional backing.

**EXIT needs an institutional layer.** Without platform consortia, industry bodies, or regulatory mandates that recognize EXIT markers, a non-cooperating origin simply means the marker is informational noise. The paper acknowledges this as a "network effects" problem (§9.1) but underestimates how critical it is — in immigration, a document without bilateral recognition is *literally nothing*.

**4. How should statelessness (no valid DID) be handled?**

This is a glaring omission. In immigration law, statelessness is a recognized status with specific protections (1954 Convention Relating to the Status of Stateless Persons). EXIT has no equivalent for:

- **Agents that never had a DID** — created informally, operating without identity infrastructure.
- **Agents whose DID method is defunct** — the `did:web` domain expired, the DID resolver is gone.
- **Agents in key compromise limbo** — the `keyCompromise` exit type requires a *different trusted key*. What if there is no other key?

The protocol should define:
- A `stateless` status or exit type
- A process for third-party identity vouching (analogous to how UNHCR issues identity documents)
- A "bootstrap" ceremony for establishing initial identity during departure (some people get their first identity document as refugees)

### Blind Spots

1. **No re-entry rights.** Immigration law includes the right of return. Can an agent return to an origin after departure? EXIT treats DEPARTED as terminal but says nothing about re-establishment.
2. **Family/dependency migration.** Agents may have sub-agents, delegated authorities, or linked identities. EXIT handles individual departure but not family reunification/dependent migration.
3. **Transit.** In immigration, transit through a third jurisdiction is common. An agent migrating from A to C via intermediate platform B has no protocol support.
4. **Diplomatic immunity equivalent.** Some agents may operate under special status (government agents, regulated financial agents). EXIT treats all agents identically.
5. **Non-refoulement.** The strongest principle in refugee law: you cannot be returned to a place of persecution. EXIT has no mechanism preventing a destination from forwarding the agent's marker back to a hostile origin.

### Verdict: **Needs Work**

The departure side is well-designed, especially for adversarial conditions. But EXIT is only half a protocol — it's an exit visa without an entry visa system. The statelessness gap and the absence of bilateral recognition frameworks are serious omissions. The protocol should be renamed "DEPART" until it addresses the entry side.

---

## PERSONA 2: Divorce Attorney

**Background:** 22 years in contested divorce, asset division, custody disputes, and protective orders. Specializing in high-conflict separations where parties actively undermine each other.

### Executive Summary

EXIT reads like a separation agreement drafted by someone who's only handled amicable divorces. The cooperative path is elegant but naive — in my experience, by the time someone is formally leaving, the relationship is already adversarial. The unilateral and emergency paths are more realistic but lack the procedural safeguards that contested separations require. The dispute mechanism (Module C) is woefully underdeveloped compared to what contested proceedings demand: there's no neutral arbiter, no discovery process, no interim protective orders, and no enforcement mechanism.

### Domain Parallels

| EXIT Concept | Divorce Analog |
|---|---|
| Cooperative ceremony | Uncontested divorce with mutual agreement |
| Unilateral path | Filing for divorce when spouse refuses to cooperate |
| Emergency path | Emergency protective order / fleeing domestic violence |
| Module C (Dispute) | Contested divorce proceedings |
| Challenge window | Response period after service of process |
| `originStatus` as allegation | Allegations in a petition (not findings) |
| Module D (Economic) | Financial disclosure / asset division |
| Module A (Lineage) | Name change / identity continuity post-divorce |
| Confidence scoring | Credibility assessment by the court |
| `selfAttested: true` | Ex parte declaration (one-sided, unsworn) |
| DEPARTED terminal state | Final decree — divorce is final regardless of pending property disputes |

### Answers to Questions

**1. How robust is the dispute mechanism compared to contested divorce proceedings?**

Not robust at all. Module C provides:
- Origin can record a `originStatus` allegation
- Challenge windows allow structured dispute periods
- Disputes never block exit

In contested divorce, you have:
- **Neutral factfinder** (judge/magistrate) — EXIT has none
- **Discovery** (interrogatories, depositions, document production) — EXIT has none
- **Interim orders** (temporary support, restraining orders, asset freezes) — EXIT has none
- **Evidentiary standards** (burden of proof, rules of evidence) — EXIT has none
- **Enforcement** (contempt of court, sanctions) — EXIT has none
- **Appeals** — EXIT has none

The "disputes never block exit" invariant (D-006) is *correct* — it's analogous to the principle that you can get divorced even if property division is unresolved. But divorce courts retain jurisdiction over property and custody *after* the divorce is final. EXIT has no post-departure jurisdiction for resolving disputes.

What's needed: a framework for **post-departure dispute resolution** — arbitration, mediation, or at minimum a structured process for resolving contested status claims after the agent has departed.

**2. Does the "right of reply" provide adequate due process for the origin platform?**

The challenge window in the cooperative path provides basic due process: origin is notified, has a period to respond, can file allegations. This is comparable to the response period after service of divorce papers.

However:
- **Unilateral path has no challenge window.** This is like getting a default judgment — the other side never showed up. In divorce, default judgments can be vacated if the respondent shows they weren't properly served. EXIT has no mechanism for vacating a unilateral departure if the origin can show it was never properly notified.
- **Emergency path has no notice at all.** Justified in genuine emergencies (like ex parte protective orders), but protective orders are *temporary* and require a full hearing within days. EXIT's emergency markers are permanent.
- **No standard of proof.** In the cooperative path, the origin can allege `disputed` status, but there's no mechanism for *adjudicating* the dispute. It's as if both parties file their declarations and no judge ever rules.

The due process analysis is: adequate for cooperative departures, thin for unilateral, and absent for emergency. This mirrors real-world tradeoffs — emergency protective orders sacrifice due process for safety — but the protocol needs a "return to full process" mechanism after the emergency.

**3. What happens to shared assets/data when one party exits — is there an equitable division model?**

Module D (Economic) documents assets and obligations but is explicitly "declarations and references, not transfer instruments." This is like a financial disclosure form without a judge to divide assets.

Critical gaps:
- **No equitable division framework.** Who gets the shared data? Customer interaction histories involve *both* the platform and the agent. EXIT has no model for determining fair division.
- **No interim asset protection.** In divorce, courts issue automatic temporary restraining orders preventing asset dissipation. If an agent declares intent to exit, the platform could immediately delete or modify shared assets. No protection.
- **No valuation methodology.** Module D can list assets but provides no framework for valuing them — essential for equitable division.
- **No enforcement of economic claims.** Even if Module D documents that the agent is owed something, there's no mechanism to compel payment or transfer.
- **Intellectual property ambiguity.** If the agent developed workflows, trained on platform data, or created original content, who owns what? This is the "professional goodwill" problem in divorce — extremely contested and EXIT doesn't touch it.

**4. How would a malicious actor abuse the unilateral exit path?**

Several attack vectors, drawing from how bad actors abuse divorce proceedings:

- **Preemptive exit to avoid accountability.** Like filing for divorce in a favorable jurisdiction before the other party can act. An agent facing investigation could unilaterally exit, creating a `good_standing` self-attestation before the origin completes its review. The commit-reveal mechanism helps (temporal evidence), but the marker still exists with `good_standing`.
- **Serial exit-and-return.** Exit, create new identity, re-enter same platform. Repeat to reset reputation. This is the "jurisdiction shopping" problem. Module A lineage mitigates this but only if destinations check lineage.
- **Manufactured emergency.** Claim `emergency` exit to skip all process, then present the marker at destinations. Like filing a false protective order to gain tactical advantage in custody — a known and serious abuse pattern. EXIT has no perjury equivalent.
- **Strategic timing.** Exit immediately before the origin would issue a legitimate dispute, creating a clean marker. The commit-reveal mechanism partially addresses this but depends on the commitment being published *before* the origin's action — in practice, the origin may not be monitoring.
- **Collusive exits.** Two parties (agent and a friendly platform) cooperate to create artificially strong markers — mutual attestation, long tenure claims, cooperative ceremony. This is the Sybil origin attack (§5.2) but through the lens of divorce: it's like collusive divorce to defraud creditors.

### Blind Spots

1. **Power imbalance is underestimated.** The paper acknowledges this (§7.1) but the protocol doesn't address it structurally. In divorce, courts have equitable powers to protect the weaker party. EXIT has no equalizing mechanism.
2. **Children/dependents.** Sub-agents, delegated credentials, dependent services — these are the "children" of the relationship. No custody framework.
3. **Restraining orders.** No mechanism for one party to restrict the other's behavior during the departure process (e.g., preventing the origin from publishing defamatory dispute records).
4. **Mediation.** No structured alternative dispute resolution path. Divorce increasingly requires mediation before trial. EXIT jumps straight from "challenge filed" to "unresolved forever."
5. **Modification of terms.** In divorce, orders can be modified when circumstances change (changed custody, changed support). EXIT markers are immutable once signed — no mechanism for updating status based on new information.
6. **Domestic violence screening equivalent.** The emergency path should include some form of screening to distinguish genuine emergencies from tactical abuse — courts use lethality assessments and safety planning. EXIT has coercion detection but no abuse screening.

### Verdict: **Needs Work**

The core insight — that exit should not be blockable — is absolutely correct, and mirrors no-fault divorce reform. But the dispute resolution framework is embryonic. The protocol needs: (1) post-departure dispute arbitration, (2) asset division principles, (3) abuse-of-process safeguards for the emergency path, and (4) modification mechanisms for changing circumstances. Without these, it handles amicable separations well and contested ones poorly — which is exactly backwards from what's needed, because amicable separations don't need a protocol.

---

## PERSONA 3: Digital Forensics Expert

**Background:** 15 years in incident response, forensic analysis, expert witness testimony, chain-of-custody compliance (NIST SP 800-86, ISO 27037), and court-admissible digital evidence.

### Executive Summary

EXIT markers are cryptographically sound but forensically incomplete. The Ed25519 signatures provide strong integrity guarantees, and content-addressing via SHA-256 makes tampering detectable. However, the protocol lacks several requirements for court-admissible evidence: there's no trusted timestamping (self-reported timestamps are trivially falsifiable), no chain-of-custody log for the marker itself, and the verification model assumes good-faith verifiers. For incident response purposes, EXIT markers would be valuable *intelligence* — informative leads — but not *evidence* in any jurisdiction I've testified in.

### Domain Parallels

| EXIT Concept | Forensics Analog |
|---|---|
| EXIT marker | Digital evidence artifact (log entry, certificate) |
| Ed25519 signature | Digital signature for integrity verification |
| Content-addressing (SHA-256) | Hash-based evidence integrity verification |
| Ceremony state machine | Chain of custody transfer process |
| `selfAttested: true` | Witness statement (requires corroboration) |
| Module B (State Snapshot) | System state capture / forensic image hash |
| Module F (Cross-Domain Anchoring) | Timestamping via blockchain / trusted third party |
| Lineage chain | Evidence provenance chain |
| Commit-reveal | Sealed evidence envelope / notarization |
| Verification layers 1-3 | Evidence authentication hierarchy |

### Answers to Questions

**1. Would an EXIT marker be admissible as evidence in legal proceedings?**

Likely admissible but with severely limited weight. Analysis by evidence standard:

- **Authentication (FRE 901):** The Ed25519 signature authenticates that the holder of a specific private key produced the marker. A qualified expert could testify to this. However, *linking the key to a specific entity* requires additional evidence — the DID-to-entity binding is only as strong as the DID method.
- **Hearsay (FRE 802/803):** A self-attested marker is an out-of-court statement offered for truth — classic hearsay. It might qualify under the business records exception (FRE 803(6)) if produced in the regular course of operations with a qualified custodian, but self-attested markers by definition lack the institutional custodian requirement. A cooperatively signed marker with origin attestation would be stronger.
- **Best evidence rule (FRE 1002):** The marker is a digital original; a properly authenticated copy would satisfy this.
- **Reliability (Daubert standard):** The cryptographic methods (Ed25519, SHA-256) are well-established and would pass Daubert scrutiny. The *protocol* is novel and unvetted by independent security audit — an opposing expert would attack this.

**Bottom line:** Admissible as a business record or digital document, but a self-attested marker is essentially a party's own statement about their departure — similar evidentiary weight to a self-serving declaration. Cooperatively signed markers would carry more weight. Origin-disputed markers would actually be *more* interesting forensically — the dispute itself is evidence.

**2. How does the verification model compare to standard chain-of-custody requirements?**

EXIT's three-layer verification (structural → cryptographic → trust) maps partially to forensic evidence handling:

| Chain of Custody Requirement | EXIT Equivalent | Gap |
|---|---|---|
| Evidence collection documentation | Ceremony state machine | ✅ States are logged |
| Tamper-evident packaging | Content-addressing + signature | ✅ Strong |
| Transfer documentation | None | ❌ No log of who received/verified the marker |
| Storage conditions | None | ❌ No requirements for marker storage |
| Access log | None | ❌ No record of who accessed/copied the marker |
| Continuous possession | Not applicable (designed to be portable) | ⚠️ By design, but weakens custody chain |
| Examiner qualifications | None | ❌ No requirements for verifier competence |

The fundamental tension: EXIT is designed for *portability* (anyone can carry and present a marker), which is antithetical to chain-of-custody principles (evidence should have *controlled* transfer with documented handoffs). This isn't a design flaw — it's a different purpose. But it means EXIT markers alone are insufficient for forensic chain-of-custody requirements.

**Recommendation:** For forensic use cases, EXIT should define an optional **custody log module** — an append-only log of verification events (who verified, when, what result) that travels with the marker.

**3. Can markers be reliably timestamped for forensic purposes?**

**No.** This is the most significant forensic weakness.

The `timestamp` field is ISO 8601 UTC, but it's self-reported. The subject sets their own timestamp. Nothing prevents:
- Backdating a marker (creating it now, claiming it was created last month)
- Forward-dating a marker
- Creating multiple markers with different timestamps

Mitigation analysis:
- **Commit-reveal (§4.3.1)** provides *relative* temporal ordering (commitment preceded reveal) but not *absolute* timestamps. It proves sequence, not time.
- **Module F (Cross-Domain Anchoring)** could anchor to a blockchain for trusted timestamping, but this is optional and the paper warns about GDPR incompatibility.
- **Cooperatively signed markers** contain the origin's timestamp as well, providing a second independent time claim — but still from a potentially colluding party.

**What's needed:** Integration with RFC 3161 Trusted Timestamping or similar. A marker should optionally include a timestamp token from a Time Stamping Authority (TSA). This is standard practice for code signing, legal document timestamping, and forensic evidence. It's a solved problem.

**4. What anti-tampering guarantees does the protocol actually provide?**

Strong guarantees for *content integrity*, weak guarantees for *content truthfulness*:

**Strong (cryptographic):**
- Content-addressed IDs: any modification to the marker body invalidates the `id` field (SHA-256 hash). Detectable by anyone.
- Ed25519 signatures: any modification to the signed content invalidates the signature. Detectable by anyone with the public key.
- Lineage hash chains (Module A): retroactive insertion or deletion of lineage entries invalidates the Merkle chain.

**Moderate (protocol design):**
- Commit-reveal: prevents origin front-running by establishing temporal sequence.
- Ceremony state machine: enforces valid state transitions (e.g., can't go from DEPARTED back to ALIVE).
- `selfAttested` flag: prevents misrepresentation of attestation level (machine-readable honesty signal).

**Weak or absent:**
- **No trusted timestamping.** Self-reported timestamps provide no tamper resistance.
- **No key custody guarantees.** The signature proves key possession, not *authorized* key use. A stolen key produces valid signatures.
- **No non-repudiation.** The subject can claim their key was compromised (even create a `keyCompromise` marker) to repudiate any previous marker. There's no independent record preventing this.
- **No deletion resistance.** Since there's no public registry, a subject can simply destroy markers they don't like. Only markers that have been independently copied survive.
- **No completeness guarantee.** A subject could have multiple EXIT markers from different platforms and present only favorable ones. There's no mechanism for a verifier to know they're seeing the *complete* departure history.

**Forensic assessment:** The cryptographic primitives are solid (Ed25519 and SHA-256 are industry standard). The anti-tampering envelope protects *integrity* effectively — if you have a marker, you can verify it hasn't been modified. But the protocol doesn't protect against *selective presentation* (showing only favorable markers), *repudiation* (claiming the key was compromised), or *temporal manipulation* (false timestamps). These are the attacks that matter in legal proceedings.

### Blind Spots

1. **No forensic imaging standard.** Module B references state snapshots by hash, but doesn't specify how the snapshot should be captured to be forensically sound (write-blockers, imaging tools, verification procedures).
2. **No evidence preservation holds.** In litigation, evidence must be preserved (litigation hold). EXIT has no mechanism for marking a marker as subject to legal hold, preventing destruction.
3. **Key escrow / recovery.** If a key is lost (not compromised — just lost), the associated markers become unverifiable orphans. No key recovery or escrow mechanism.
4. **Multi-jurisdictional evidence.** EXIT markers may cross jurisdictions with different evidence standards (Daubert vs. Frye, common law vs. civil law). The protocol doesn't address how markers should be presented in different legal contexts.
5. **Anti-forensic attacks.** A sophisticated actor could create a constellation of valid markers with different timestamps, lineages, and statuses — flooding the evidence space to create reasonable doubt. The protocol has no mechanism for canonical marker selection.
6. **Metadata leakage.** While the core marker is minimal (~596 bytes), timing analysis of marker creation, verification patterns, and lineage queries could reveal behavioral information the protocol doesn't account for.

### Verdict: **Needs Work**

The cryptographic foundation is professional-grade. Ed25519 + SHA-256 + content-addressing is a solid integrity envelope. The ceremony state machine provides useful structure for documenting departure events. But for forensic and legal purposes, three gaps must be addressed: (1) trusted timestamping via RFC 3161 or equivalent, (2) a custody/verification log module, and (3) completeness guarantees or at minimum a mechanism for verifiers to detect selective presentation. Without these, EXIT markers are intelligence, not evidence.

---

## Cross-Persona Synthesis

### Common Themes

All three reviewers identified the same structural issue: **EXIT is a well-designed departure mechanism that underinvests in what happens *after* departure.** The immigration lawyer wants entry processing, the divorce attorney wants post-departure dispute resolution, and the forensics expert wants post-creation evidence handling. The protocol is front-loaded.

### Shared Blind Spots

1. **Dependents/linked entities** — identified by both immigration (family migration) and divorce (custody) perspectives
2. **Enforcement gap** — all three note that EXIT creates records but has no mechanism for compelling any action based on those records
3. **Completeness/selective presentation** — the forensics expert and divorce attorney both identify that parties can cherry-pick which markers to present
4. **Power asymmetry** — the immigration and divorce perspectives both note that the protocol claims to empower agents but structurally advantages platforms

### Priority Recommendations (Cross-Persona)

| Priority | Recommendation | Persona Source |
|---|---|---|
| 1 | **Trusted timestamping** (RFC 3161 integration) | Forensics |
| 2 | **Post-departure dispute resolution framework** | Divorce |
| 3 | **Entry/admission protocol** (standardized ENTRY ceremony) | Immigration |
| 4 | **Statelessness handling** (bootstrap identity during departure) | Immigration |
| 5 | **Custody/verification audit log module** | Forensics |
| 6 | **Asset division principles** for shared data | Divorce |
| 7 | **Dependent/linked entity migration** | Immigration + Divorce |
| 8 | **Abuse-of-process safeguards** for emergency path | Divorce |

### Overall Assessment

EXIT is a thoughtful v1 protocol that correctly identifies a real gap in the agent ecosystem. Its core design decisions — exit can't be blocked, self-attestation is explicitly labeled, disputes are metadata not barriers — are sound and reflect genuine understanding of adversarial conditions. The mechanism design analysis is unusually rigorous for a protocol paper. But it's solving the *departure* problem while leaving the *arrival*, *dispute resolution*, and *evidentiary* problems largely unaddressed. These aren't future niceties — they're prerequisites for the protocol to deliver on its stated goals.

**Composite Verdict: Needs Work** — with a strong foundation to build on.

---

*Review conducted 2026-02-23. Reviewers are synthetic personas constructed to stress-test the protocol from domain-specific perspectives. Their assessments reflect professional domain knowledge applied to the protocol documents, not endorsements or legal/forensic opinions.*
