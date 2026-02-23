# Multi-Lens Professional Review — Batch 4

**Protocol Under Review:** EXIT/ENTRY (Cellar Door Project)  
**Documents Reviewed:** EXIT_PAPER_v4.md, EXIT Protocol Specification v1.1  
**Date:** 2026-02-23  

---

## Persona 1: Military Logistics Officer

**Background:** 22 years in personnel transfer systems, security clearance portability, DD-214 discharge processing, joint force integration.

---

### 1. How does EXIT compare to DD-214 (military discharge) as a departure credential?

The DD-214 is the closest analog in any existing system to what EXIT is trying to build, and the comparison is instructive.

**Structural parallels:**
- Both are departure documents issued at the point of separation
- Both record identity, origin institution, type of departure, and standing
- Both are intended to be portable credentials presented to receiving institutions
- Both encode a classification of departure reason (DD-214's characterization of service maps roughly to EXIT's `exitType` + `status`)

**Critical differences:**

The DD-214 is *authoritative* — it is issued by the separating institution (the military branch), not self-attested by the departing member. This is the fundamental gap. A DD-214 with "Honorable Discharge" carries weight because the Department of Defense issued it. An EXIT marker with `status: good_standing, selfAttested: true` is the equivalent of a service member writing their own DD-214 — which is to say, it carries no weight at all.

The paper acknowledges this honestly (§4.1 on cheap talk), and the trust mechanisms (tenure weighting, commit-reveal, confidence scoring) are reasonable compensating controls. But from a personnel systems perspective, the *minimum viable credential* is one where the issuing authority attests to the departure characterization. The cooperative path with origin co-signature achieves this. The unilateral and emergency paths do not — and those are precisely the paths needed in adversarial scenarios.

**DD-214 features EXIT should consider:**
- **RE codes (Reenlistment Eligibility):** The DD-214 includes coded indicators of whether the member is eligible for future service. EXIT's binary `good_standing`/`disputed`/`unverified` is too coarse. A receiving platform wants to know: is this agent eligible for re-enrollment, eligible with waiver, or ineligible?
- **Separation Program Designator (SPD) codes:** Standardized reason codes for departure. EXIT's free-text `exitType` with four values is underspecified. Military uses hundreds of SPD codes to capture specific circumstances.
- **Narrative Reason for Separation:** Human-readable explanation mandated alongside coded fields. Module E (Metadata) covers this optionally — it should be required for `forced` and `emergency` exits.

**Assessment:** EXIT is a DD-214 analog designed for a world where the military might refuse to issue one. That's the right design constraint. But the protocol undervalues the importance of standardized departure reason taxonomies and eligibility indicators.

---

### 2. Is the classification/redaction model sufficient for sensitive departures?

**No.** This is a significant gap.

In military personnel systems, departure documents exist at multiple classification levels. A service member's unclassified DD-214 may omit duty stations, unit designations, or specialties that are classified. A separate classified separation document exists for cleared personnel.

EXIT has no classification model. Every field in the marker is visible to any verifier. The paper mentions ZK selective disclosure as future work (§4.4, §9.2), but for sensitive departures — agents leaving intelligence platforms, agents with access to proprietary trade secrets, agents departing from classified government systems — the current protocol is unusable.

**What's needed:**
- **Field-level redaction:** Ability to prove a marker exists and is valid while withholding specific fields (origin identity, departure reason, operational details)
- **Tiered disclosure:** Different verifiers see different fields based on their clearance/authorization level
- **Cover credentials:** Ability to present a sanitized marker that proves departure occurred without revealing from where (analogous to a sanitized DD-214 for members with classified service)

The BBS+ / SD-JWT roadmap items would address this, but they're not "nice to have" — they're prerequisites for any sensitive-context deployment.

---

### 3. How would this work in a hierarchical command structure where agents don't self-determine exit?

This is where EXIT's philosophical orientation creates friction with military (and most enterprise) reality.

EXIT is designed around *agent-initiated departure* — the agent (or its operator) decides to leave. In a command structure:
- Agents are *ordered* to relocate, not asked
- Transfer authority rests with the commanding entity, not the agent
- The agent has no standing to contest or delay a transfer
- Departure timing is dictated by operational requirements

The ceremony state machine's three paths all assume the departing entity initiates or at least participates in the ceremony. There's no **directed transfer path** where:
1. A command authority orders Agent X to transfer from Platform A to Platform B
2. Platform A executes the transfer, producing the EXIT marker
3. Platform B receives the agent with the marker
4. The agent's participation is limited to cryptographic signing (which could be automated)

The `forced` exit type partially covers this (origin-initiated expulsion), but "forced" carries negative connotations — a directed transfer isn't a punishment. The protocol needs:
- **`exitType: directed`** — Transfer ordered by authorized third party
- **Command authority signatures** — Third-party authorization in the proof chain
- **Transfer orders as ceremony initiators** — A fourth ceremony path initiated by neither subject nor origin but by a governing authority

**Assessment:** EXIT assumes a flat, autonomous agent model. Hierarchical deployment scenarios — which represent the majority of enterprise and government agent deployments — are underserved.

---

### 4. What's missing for emergency/hostile-environment departures?

The emergency path (ALIVE → FINAL → DEPARTED) is fast (0.74ms) but operationally thin.

**Missing elements for hostile-environment departures:**

- **Dead-man switch / auto-departure:** If an agent becomes unresponsive for a configurable period, a pre-authorized departure marker should be automatically published. In military terms: if you lose contact with a unit, you don't wait for them to file paperwork.

- **Delegation of departure authority:** Ability to pre-authorize another entity (buddy system, supervisor, operator) to execute departure on the agent's behalf. The `keyCompromise` exit type requires signing with a *different trusted key*, but there's no formal delegation mechanism.

- **Duress indicators:** A canary or duress code embedded in the marker that signals to informed verifiers that the departure is coerced. The coercion detection in §7.3 detects *origin* coercion of agents, but not coercion of the *operator* to force agent departure.

- **Evacuation mode:** When a platform is under active attack, you need batch emergency departures with minimal ceremony. The Merkle batch anchoring (test vector 17.9) helps with scalability, but there's no specified "evacuation" ceremony that differs from individual emergency exits.

- **Continuity of operations (COOP):** Pre-positioned departure markers at alternate locations, encrypted and activatable if primary infrastructure is compromised. Military units pre-position COOP plans — agents should too.

- **Destruction protocols:** Sometimes the right exit is to leave *no* marker — to deny adversaries information about agent capabilities, deployment history, or migration patterns. EXIT assumes departure records are always desirable. In hostile environments, sometimes you sanitize and leave nothing.

**Assessment:** The emergency path handles "platform went down, leave quickly." It does not handle "platform is actively hostile and trying to prevent or surveil departure." The threat model (§5.1) acknowledges denial-of-exit (T6) but the mitigations are about *producing* a marker — not about doing so covertly or under fire.

---

## Persona 2: Supply Chain Manager

**Background:** 15 years in logistics, GS1 EPCIS implementation, ISO 28000 supply chain security, vendor transition management, chain-of-custody certification.

---

### 1. How does EXIT compare to supply chain provenance standards (GS1 EPCIS, ISO 28000)?

The conceptual mapping is straightforward: an agent migrating between platforms is analogous to a product moving between custody points. EXIT markers are custody transfer records.

**GS1 EPCIS comparison:**

EPCIS (Electronic Product Code Information Services) tracks four dimensions: *What* (object), *Where* (location), *When* (time), *Why* (business context). EXIT maps:
- **What:** `subject` (DID) — adequate
- **Where:** `origin` (URI) — only captures departure point, not destination. EPCIS captures both source and destination in every event. EXIT needs a `destination` field or a paired ENTRY marker to complete the picture.
- **When:** `timestamp` — adequate
- **Why:** `exitType` + Module E metadata — underspecified compared to EPCIS business step vocabularies (shipping, receiving, commissioning, decommissioning, etc.)

**Key gap: EXIT is half a custody transfer.** In supply chain terms, EXIT records the *shipping* event but not the *receiving* event. A complete chain of custody requires both. The paper mentions ENTRY as a companion protocol but it's not specified. Until ENTRY exists, EXIT is a bill of lading with no proof of delivery.

**ISO 28000 comparison:**

ISO 28000 (Security Management Systems for the Supply Chain) requires:
- Risk assessment at each transfer point — EXIT has no risk scoring at departure
- Security management plans — No equivalent
- Continuous monitoring during transit — No concept of "in transit" state between DEPARTED and arrival
- Incident management — The dispute module (C) partially covers this

**What EXIT does better than supply chain standards:**
- Adversarial tolerance — supply chain standards assume cooperative custody transfer
- Self-attestation as fallback — no supply chain standard allows a product to self-certify its provenance
- Cryptographic verification without central authority — EPCIS relies on trusted repositories

---

### 2. Is the lineage module sufficient for tracking multi-hop agent migration chains?

Module A (Lineage) provides four continuity proof types. For multi-hop chains, the critical question is: **does verification scale?**

**Chain verification complexity:**

For an agent that has migrated through N platforms, a verifier must:
1. Retrieve N markers (or however many are available)
2. Verify N signatures
3. Validate N-1 lineage links (key rotation bindings or hash chains)
4. Evaluate confidence scores for each hop

With verification at ~1.9ms per marker, a 10-hop chain takes ~19ms — acceptable. But the *data availability* problem is harder: where are old markers stored? EXIT is non-custodial with no registry. Each marker lives wherever the agent (or its operator) stores it. Lost markers break the chain.

**Supply chain parallel:** This is the "one step up, one step down" problem in food traceability. Each node knows its immediate supplier and customer, but end-to-end traceability requires every node to maintain and share records. EPCIS solves this with centralized or federated repositories. EXIT explicitly rejects registries (D-012).

**Gaps:**
- **No chain validation primitive:** The spec has marker-level verification but no `verifyChain(markers[])` function that checks inter-marker lineage consistency
- **No gap detection:** If markers 3 and 5 exist but marker 4 is lost, there's no mechanism to flag the gap
- **No chain branching model:** What if an agent forks (copies deployed to two platforms)? Supply chains handle this with lot splitting — EXIT has no equivalent
- **Behavioral attestation weakness:** The weakest lineage proof (type 4) relies on third-party vouching — in supply chain terms, this is verbal assurance without documentation, which would fail any audit

**Assessment:** Module A is adequate for simple linear migrations (A→B→C). It is insufficient for complex migration topologies (forking, merging, circular migrations) and has no answer for data availability in long chains.

---

### 3. What happens when an intermediate node in the chain is compromised?

This is the supply chain's central nightmare — a compromised intermediate node can:

1. **Forge downstream markers:** If Platform B's keys are compromised, an attacker can create fake EXIT markers claiming agents departed from B in good standing
2. **Retroactively contaminate the chain:** All agents that transited through B now have a suspect link in their lineage
3. **Inject phantom agents:** Create fake agent identities that "departed" from B with full cooperative attestation

**EXIT's mitigations:**
- `keyCompromise` exit type — but this is for *agent* key compromise, not *platform* key compromise
- Platform key compromise has no specified recovery mechanism

**What supply chain security does:**
- **Tamper-evident seals:** Physical and digital seals that reveal if custody was violated — EXIT markers are tamper-evident (content-addressed) but the *signing authority* itself being compromised is a different threat
- **Recall mechanisms:** When a supply chain node is compromised, all products that passed through it are recalled for inspection. EXIT has no recall/re-verification mechanism
- **Alternative attestation:** Independent third-party auditors can re-certify products. EXIT has no concept of re-certification after chain compromise

**What's needed:**
- **Platform compromise declarations:** Analogous to `keyCompromise` but for origin platforms, marking all markers co-signed by that platform during a time window as suspect
- **Chain quarantine:** Ability for verifiers to flag and isolate markers with compromised intermediate nodes
- **Re-attestation ceremony:** A process for agents with compromised lineage links to obtain fresh attestation through alternative means

---

### 4. How would batch departures (platform shutdown) scale?

This is the "Platform C with 10,000 agents" scenario from the paper's introduction. Let's do the math.

**Current performance:**
- Full cooperative ceremony: 0.91ms per agent
- Merkle tree construction: 22.7ms for 1,000 markers
- Signing: 0.46ms per marker

**For 10,000 agents (cooperative batch):**
- Marker creation + signing: ~14ms (parallelizable)
- Merkle anchoring: ~50-100ms estimated (extrapolating from benchmarks)
- Total: Under 1 second for marker production

**The bottleneck isn't marker creation — it's ceremony coordination.**

Each of 10,000 agents needs to:
1. Declare intent (INTENT state)
2. Wait for snapshot
3. Potentially wait through challenge window (OPEN state)
4. Complete departure

If the challenge window is any meaningful duration (hours? days?), platform shutdown blocks on the *slowest ceremony*. Supply chain parallel: when a warehouse closes, you don't individually negotiate the transfer of each item — you execute a bulk transfer order.

**What's needed:**
- **Batch ceremony:** A single ceremony that covers N agents simultaneously, with one challenge window for the entire batch
- **Platform departure declaration:** Origin publishes a signed "platform shutting down" event that implicitly initiates departure for all hosted agents
- **Priority queuing:** Critical agents depart first; lower-priority agents batch-process
- **Receivership protocol:** When a platform fails unexpectedly (no cooperative shutdown), a designated receiver (analogous to a bankruptcy trustee) can issue departure markers on behalf of stranded agents
- **SLA-based departure windows:** Pre-agreed departure timelines in platform terms of service, analogous to supplier exit clauses in procurement contracts

**Assessment:** The cryptographic primitives scale fine. The ceremony model doesn't account for institutional-level departures. EXIT is designed for individual agents leaving platforms, not platforms leaving the ecosystem.

---

## Persona 3: Medical Records Administrator

**Background:** 18 years in health information management, HL7 FHIR implementation, C-CDA document exchange, HIPAA Privacy & Security Rule compliance, consent management systems.

---

### 1. How does EXIT/ENTRY compare to patient record transfer standards (C-CDA, FHIR)?

Healthcare has been solving record portability for decades, often painfully. The parallels to EXIT are remarkably close.

**C-CDA (Consolidated Clinical Document Architecture) comparison:**

C-CDA defines standardized clinical documents (discharge summaries, care plans, referral notes) exchanged between providers. An EXIT marker maps to a **Transfer Summary** — the document sent when a patient moves from one provider to another.

| Aspect | C-CDA Transfer Summary | EXIT Marker |
|--------|----------------------|-------------|
| **Content** | Clinical history, medications, problems, procedures | Departure standing, lineage, disputes |
| **Size** | Typically 50KB-500KB | ~596 bytes (core) to ~1.3KB (full modules) |
| **Authorship** | Sending provider (authoritative) | Self-attested or mutually attested |
| **Standard body** | HL7 International | None yet (Cellar Door Project) |
| **Adoption** | Mandated by US federal regulation (ONC) | Voluntary |
| **Verification** | Provider NPI + digital signature | DID + Ed25519 |

**FHIR comparison:**

FHIR (Fast Healthcare Interoperability Resources) is the modern standard, built on RESTful APIs and granular resources. FHIR doesn't just transfer documents — it enables *ongoing access* to discrete data elements.

EXIT is architecturally more like C-CDA (document-based exchange) than FHIR (API-based access). This is a deliberate and defensible choice for v1 — document exchange is simpler and works offline. But the healthcare industry's evolution from C-CDA to FHIR suggests EXIT will eventually need:

- **Granular resource access:** Instead of one monolithic marker, ability to query specific aspects of departure (standing, tenure, disputes) independently
- **Subscription model:** Receiving platforms subscribe to updates about a departing agent (dispute filed, standing changed) rather than receiving a point-in-time snapshot
- **Bulk data export:** FHIR Bulk Data Access ($export) enables mass data extraction — relevant for the platform shutdown scenario

**Critical healthcare lesson for EXIT:** The US spent 15+ years and billions of dollars achieving basic clinical document exchange. The hardest problems weren't technical — they were *trust frameworks* and *participant agreements*. Who agrees to accept whose documents? Under what terms? EXIT's non-custodial, no-registry approach is technically elegant but sidesteps the governance infrastructure that makes exchange *work* in practice.

---

### 2. Is the consent model sufficient — who authorizes disclosure of departure details?

**The consent model is essentially absent.** This is a serious gap viewed through a healthcare privacy lens.

In healthcare, patient records cannot be disclosed without patient authorization (HIPAA §164.508) except under specific exceptions. The patient controls who sees what.

In EXIT:
- The agent/operator creates the marker and presumably controls its distribution
- But Module C (Dispute Bundle) allows the *origin* to attach allegations to the marker
- Module A (Lineage) reveals the agent's migration history to any verifier
- There's no consent mechanism governing *who can see the marker* or *which fields are disclosed to whom*

**Questions EXIT doesn't answer:**
- Can the origin platform disclose that an agent departed? (In healthcare, confirming a patient was ever treated is itself protected information)
- Who consents to lineage chain disclosure? Each intermediate platform's participation in the chain is revealed
- Can an agent revoke a marker? (HIPAA gives patients the right to request amendment of records)
- Who controls disclosure of Module C dispute details? The origin writes them, but the agent carries the marker

**What healthcare does:**
- **Consent directives (FHIR Consent resource):** Machine-readable consent documents specifying who can access what under which conditions
- **Minimum necessary standard:** Only the minimum information needed for the purpose should be disclosed
- **Accounting of disclosures:** Patients have the right to know who accessed their records
- **Designated record set:** Patients can access and request amendments to their own records

**What EXIT needs:**
- **Consent module:** A Module G specifying who is authorized to receive the marker and under what conditions
- **Field-level access control:** Different verifiers authorized for different fields (parallels the classification/redaction gap identified in the military review)
- **Amendment mechanism:** Ability for the subject to annotate or contest information in the marker after creation (distinct from Module C disputes, which are origin-initiated)
- **Disclosure logging:** Cryptographic proof of who verified the marker and when

---

### 3. What about "break the glass" scenarios for emergency access?

In healthcare, "break the glass" (BTG) allows a provider to access restricted patient records in an emergency, overriding normal access controls. The access is logged and audited after the fact.

**EXIT equivalents needed:**

Scenario: An agent arrives at a new platform in emergency mode. The receiving platform needs to verify the agent's standing immediately but the agent's marker is encrypted, consent directives restrict access, or the lineage chain is incomplete.

Current EXIT behavior: The emergency path produces a minimal marker quickly, but there's no mechanism for a *receiving* platform to access departure information that wasn't proactively shared.

**What's needed:**
- **Emergency access flag:** Receiving platforms can request expanded marker disclosure under declared emergency conditions
- **Post-hoc audit trail:** Emergency access is logged and subject/operator is notified
- **Time-limited emergency credentials:** Temporary acceptance with full verification deferred — in healthcare, a patient is treated first, insurance verified later
- **Provisional admission:** The receiving platform admits the agent provisionally while verification completes, analogous to emergency department treatment of unidentified patients

**The deeper issue:** EXIT assumes the *departing* entity controls information flow. In emergencies, the *receiving* entity may need to pull information, not wait for it to be pushed. This inversion of control is fundamental to emergency medicine and entirely absent from EXIT.

---

### 4. How would continuity of care/service be maintained during transition?

In healthcare, the transition between providers is the highest-risk period for patient safety. "Warm handoffs" — where the outgoing and incoming providers directly communicate — dramatically reduce adverse events.

**EXIT's transition model is cold.** The agent departs, carries a marker, presents it elsewhere. There's no protocol for:

- **Overlap periods:** In healthcare, patients are often co-managed during transition. EXIT's DEPARTED state is terminal and immediate — there's no "transitioning" state where both origin and destination have active relationships with the agent.

- **Structured handoff communication:** C-CDA Transfer Summaries include care plans, pending orders, and follow-up instructions. EXIT markers contain departure *status* but no forward-looking information about what the agent needs to function at the destination.

- **Reconciliation:** When a patient arrives at a new provider, medication reconciliation compares what the patient was taking with what's available. Agent "capability reconciliation" — comparing what the agent could do at origin vs. what's available at destination — is unaddressed.

- **Follow-up responsibility:** Who is responsible if something goes wrong during transition? In healthcare, the referring provider retains responsibility until the receiving provider accepts. EXIT has no concept of transfer of responsibility.

**What EXIT should consider:**

- **TRANSITIONING state:** Between FINAL and DEPARTED, a state where both origin and destination acknowledge the agent, enabling warm handoff. The ceremony state machine could add: ALIVE → ... → FINAL → TRANSITIONING → DEPARTED.
- **Capability manifest:** An extension to Module B (State Snapshot) that documents the agent's operational capabilities, configurations, and dependencies — the "care plan" equivalent.
- **Handoff protocol:** A structured exchange between origin and destination during the transition window, not just a marker carried by the agent.
- **Post-departure follow-up:** A mechanism for the destination to query the origin about specific operational questions during an adjustment period (time-limited, consent-governed).

**The healthcare lesson:** Portability isn't just about carrying a record from A to B. It's about ensuring *continuity of function* during the transition. EXIT focuses on the credential (the document) rather than the process (the transition). The credential is necessary but not sufficient.

---

## Cross-Cutting Findings

All three review perspectives converge on several themes:

1. **EXIT is a departure *record*, not a departure *process*.** The ceremony state machine adds process elements, but the protocol is fundamentally document-centric. Real-world departures in military, supply chain, and healthcare contexts require richer process orchestration.

2. **The self-attestation gap is real but honestly acknowledged.** All three domains rely on authoritative third-party attestation. EXIT's design for adversarial scenarios (where authority is hostile or absent) is genuinely novel, but the protocol should more clearly distinguish between "we designed for this" and "this is a limitation."

3. **Privacy/classification/consent is the biggest missing piece.** All three reviewers independently identified the need for field-level access control, tiered disclosure, and consent governance. ZK selective disclosure isn't a roadmap item — it's a prerequisite for most real-world deployments.

4. **Batch/institutional departures are underspecified.** EXIT models individual agent departure. Platform shutdowns, organizational transfers, and mass migrations need institutional-level ceremony constructs.

5. **The transition period is unaddressed.** EXIT focuses on the moment of departure. The period between departure and arrival — and the handoff between origin and destination — is where most real-world failures occur.

6. **Destination-side protocol (ENTRY) is urgently needed.** EXIT is half a transfer. Without ENTRY, there's no proof of receipt, no reconciliation, and no closed loop.

---

*Review conducted 2026-02-23. All three personas are simulated professional perspectives applied to provide domain-specific critique.*
