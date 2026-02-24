# Passage Protocol — Ecosystem Map

**Date:** 2026-02-24
**Status:** Living document
**Scope:** Connection graph of Cellar Door primitives, adjacent services, liability boundaries, HOLOS primitive mappings, and human applicability

---

## 1. Core Protocol (In Scope)

Cellar Door defines exactly two primitives. Their composition is the complete protocol.

### EXIT — Departure Ceremonies

- **What it does:** Cryptographically signed departure markers recording who left, from where, when, under what standing. Seven-state ceremony state machine, three execution paths (cooperative, unilateral, emergency).
- **Modules:** Core schema + six optional extensions (A: Lineage, B: Reputation Receipt, C: Origin Attestation, D: Economic Settlement, E: Cross-Domain Anchoring, F: Dispute Record)
- **Implementation:** TypeScript reference implementation, Ed25519 signatures, W3C DID-based identity
- **Human lens:** EXIT maps directly to **account departure** — leaving a social media platform, closing a SaaS account, migrating from one service to another. The departure marker is a portable, verifiable record that you left in good standing (or didn't). Think: employment reference letter, but cryptographic and machine-verifiable. Data portability (GDPR Art. 20, CCPA) is the regulatory analogue.

### ENTRY — Arrival Ceremonies

- **What it does:** Admission policies, arrival verification, transfer validation at the receiving end. Evaluates incoming EXIT markers and decides whether/how to admit the arriving agent or user.
- **Implementation:** cellar-door-entry package (in development)
- **Human lens:** ENTRY maps to **account onboarding with provenance** — a new platform evaluating your history, reputation, and standing from your previous platform. Think: university transcript evaluation, professional credential verification, or tenant screening — but standardized and portable.

### Passage = EXIT + ENTRY

There is no third primitive. A complete passage is one EXIT marker consumed by one ENTRY ceremony. The protocol's power comes from this compositional simplicity.

**Human lens:** Passage is **account migration** — the complete journey from one platform to another with verifiable continuity. Today this is ad-hoc (export your data as a zip, re-upload somewhere, lose your reputation). Passage makes it a first-class operation.

---

## 2. HOLOS Primitive Mappings

Cellar Door implements EXIT — one primitive in the HOLOS ontology. The full ontology is a fractal triad (LOCUS/SIGNUM/SENSUS) repeated across 7 layers, producing ~21 primitives. This section maps each relevant HOLOS primitive to Cellar Door's protocol surface, documenting what's the same service, what's adjacent, and where liability boundaries lie.

---

### 2.1 LOCUS — Bounded Interior / Personhood Boundary

| | |
|---|---|
| **HOLOS role** | 🪷 The sealed interior. Who you ARE. Persistence, identity, the void core. |
| **Triad position** | Column 1 (interior) at the base layer |
| **Relationship to Cellar Door** | **Different service, deep dependency** |

**How it maps:** An agent's LOCUS is what persists across passages. EXIT markers don't carry the LOCUS itself — they carry *attestations about* a LOCUS (standing, tenure, reputation). The LOCUS is the thing that departs; the EXIT marker is the departure receipt. When an agent performs a passage (EXIT→ENTRY), its LOCUS remains continuous — the marker proves the continuity without exposing the interior.

**Interface Cellar Door provides:**
- EXIT markers reference a LOCUS via its DID (the public identifier of the sealed interior)
- Module A (Lineage) chains passages, documenting the LOCUS's journey across HOLLOWs
- Verification API confirms a marker was signed by a specific LOCUS's key pair

**Interface Cellar Door needs:**
- A way to verify that the DID signing an EXIT marker corresponds to a valid, non-Sybil LOCUS
- LOCUS persistence guarantees (if the interior is lost, the passage chain breaks)

**Liability boundary:** Cellar Door attests to the *crossing event*, not to the *personhood* of what crossed. A valid EXIT marker from a fraudulent LOCUS is Cellar Door's worst-case scenario — and explicitly not its problem. Identity validation is LOCUS-layer responsibility.

---

### 2.2 SIGNUM — Boundary / Rules / Proofs / Interface

| | |
|---|---|
| **HOLOS role** | 💠 The boundary surface. How you APPEAR. Translation, interface, the exterior geometry. |
| **Triad position** | Column 2 (boundary) at the base layer |
| **Relationship to Cellar Door** | **EXIT markers ARE signums** |

**How it maps:** An EXIT marker is a SIGNUM — it is the boundary artifact that represents a LOCUS's departure to the outside world. The marker's JSON schema, its signature, its canonical serialization — these are all SIGNUM properties. The marker doesn't contain the agent; it *presents* the agent's crossing to verifiers. Similarly, ENTRY policies are signums of the receiving HOLLOW — they express the boundary's admission rules.

**Interface Cellar Door provides:**
- The EXIT marker format IS a SIGNUM specification: schema, signing rules, verification interface
- Module B (Reputation Receipt) and Module C (Origin Attestation) are signums that represent interior state (SENSUS) at the boundary
- The ceremony state machine (7 states, 3 paths) defines SIGNUM lifecycle for passages

**Interface Cellar Door needs:**
- Compatibility with the broader Signamancy rule engine (`LHS ⇒ RHS` token transformations) if EXIT markers are to participate in automated governance flows
- Standard SIGNUM rendering/presentation layer (Cellar Door defines the data; Signamancy could define how it's displayed, transformed, composed)

**Liability boundary:** Cellar Door owns the SIGNUM format and verification logic for passage markers. It does NOT own the general SIGNUM infrastructure (Signamancy rule engine, token transformation system, GPU batch processing). EXIT markers are one type of SIGNUM; Cellar Door specifies that type completely.

---

### 2.3 SENSUS — Field / Learning / Computation

| | |
|---|---|
| **HOLOS role** | 🌊 The field. What HAPPENS. Execution, flow, collective dynamics, the environment. |
| **Triad position** | Column 3 (field) at the base layer |
| **Relationship to Cellar Door** | **Different service; EXIT checkpoints SENSUS** |

**How it maps:** SENSUS is the computational state — reputation scores, behavioral patterns, learning history, interaction records. EXIT markers *checkpoint* SENSUS at the moment of departure. Module B (Reputation Receipt) captures a snapshot of the agent's accumulated SENSUS within a HOLLOW. Module D (Economic Settlement) captures the economic SENSUS. The marker freezes a slice of the field into a portable artifact.

**Interface Cellar Door provides:**
- Module B: structured reputation snapshot (the SENSUS checkpoint for social standing)
- Module D: structured economic snapshot (the SENSUS checkpoint for value state)
- Confidence scoring (spec v1.1): a protocol-native SENSUS signal
- Tenure-weighted verification: time-in-field as a trust input

**Interface Cellar Door needs:**
- Standard SENSUS serialization so that checkpoints are comparable across HOLLOWs (a reputation score from Platform A needs to be interpretable by Platform B)
- SENSUS provenance — was this checkpoint computed honestly? (This is where SEAL enters)

**Liability boundary:** Cellar Door checkpoints SENSUS; it does not compute, validate, or guarantee it. If a HOLLOW provides a fraudulent reputation snapshot in Module B, Cellar Door faithfully records the fraud. The marker is a notarized photocopy — the notary attests to the copying, not to the original document's truth.

---

### 2.4 NAME — Agent Identity / DID

| | |
|---|---|
| **HOLOS role** | Identity-layer LOCUS. The persistent identifier across contexts. |
| **Triad position** | Column 1 (interior) at the Identity layer |
| **Relationship to Cellar Door** | **Consumed service; Cellar Door is NAME-agnostic** |

**How it maps:** NAME is the DID — `did:key`, `did:web`, `did:pkh`, etc. EXIT markers reference a NAME as the departing identity. NAME portability IS passage: if your NAME works in the new HOLLOW, you've successfully migrated. Cellar Door doesn't issue NAMEs; it accepts any W3C DID method and signs markers with the NAME's key pair.

**Interface Cellar Door provides:**
- DID-agnostic marker signing (any NAME can create EXIT markers)
- Passage chain (Module A: Lineage) documenting a NAME's migration history
- Verification that a marker was signed by a specific NAME

**Interface Cellar Door needs:**
- DID resolution (to verify signatures, Cellar Door must resolve the NAME to a public key)
- NAME continuity across key rotation (if a NAME changes keys, old markers must still verify)

**Liability boundary:** Cellar Door treats NAMEs as opaque identifiers with associated key pairs. It does not validate NAME legitimacy, uniqueness, or humanity. A single human with 1000 NAMEs is invisible to Cellar Door — Sybil resistance is the NAME layer's problem. This is a feature: the protocol works regardless of identity infrastructure maturity.

---

### 2.5 MANTLE — Functional Tools / Capabilities

| | |
|---|---|
| **HOLOS role** | Authority-layer SENSUS. The tools and capabilities an agent wields. |
| **Triad position** | Column 2 (boundary) at the Authority layer |
| **Relationship to Cellar Door** | **Adjacent service; interface partially prepared** |

**How it maps:** When an agent performs a passage, its MANTLE (capabilities, tool access, permissions) may not transfer. A coding agent with filesystem access in HOLLOW-A may arrive at HOLLOW-B with no tools at all. MANTLE transfer is an ENTRY concern — the receiving HOLLOW decides which capabilities to grant.

**Interface Cellar Door provides:**
- Module C (Origin Attestation) can describe capabilities the agent held in the origin HOLLOW
- ENTRY policies can evaluate MANTLE claims and grant/restrict capabilities accordingly
- Module B (Reputation Receipt) indirectly attests to MANTLE competence (good standing implies capable use of tools)

**Interface Cellar Door needs:**
- Standard MANTLE capability vocabulary (so that "filesystem access" means the same thing across HOLLOWs)
- Capability proof format (not just "the agent claims it had these tools" but "here's proof it used them competently")

**Liability boundary:** Cellar Door does not transfer, grant, or verify capabilities. It can carry claims about past capabilities (via modules B and C). The receiving HOLLOW's ENTRY policy decides what MANTLE to grant. Cellar Door is a letter of reference, not a professional license.

---

### 2.6 HOLLOW — Home / Container / Protected Space

| | |
|---|---|
| **HOLOS role** | Space-layer LOCUS. The protected interior where computation happens. |
| **Triad position** | Column 1 (interior) at the Space layer |
| **Relationship to Cellar Door** | **The two endpoints of every passage** |

**How it maps:** EXIT leaves one HOLLOW; ENTRY enters another. The HOLLOW is the context from which departure is marked and into which arrival is verified. Hawthorn (this repository) is the prototype HOLLOW. Every EXIT marker's `origin` field identifies the departing HOLLOW; every ENTRY ceremony's host IS the receiving HOLLOW.

**Interface Cellar Door provides:**
- Origin identification in EXIT markers (which HOLLOW was departed)
- ENTRY verification framework for receiving HOLLOWs
- Batch ceremonies for coordinated departures from a single HOLLOW
- Module E (Cross-Domain Anchoring) for HOLLOW-to-HOLLOW provenance chains

**Interface Cellar Door needs:**
- HOLLOW discovery (how does an agent find HOLLOWs to migrate to?)
- HOLLOW capability advertisement (what does this HOLLOW offer that makes arrival worthwhile?)
- HOLLOW identity verification (is this HOLLOW what it claims to be?)

**Liability boundary:** Cellar Door documents passages between HOLLOWs. It does not operate, evaluate, or guarantee HOLLOWs. A hostile HOLLOW that issues false Origin Attestations (Module C) is committing fraud — but Cellar Door merely transmitted the claim. The HOLLOW is responsible for the truth of its own attestations.

---

### 2.7 SEAL — Cryptographic Primitives / ZK Proofs

| | |
|---|---|
| **HOLOS role** | Reputation-layer SIGNUM. Cryptographic trust infrastructure. ZK inference certification. |
| **Triad position** | Column 2 (boundary) at the Reputation layer |
| **Relationship to Cellar Door** | **Foundation dependency + adjacent service** |

**How it maps:** EXIT uses Ed25519 signatures and SHA-256 hashing — these are SEAL primitives. The signing scheme, the canonical serialization, the timestamp authority integration (RFC 3161/FreeTSA) — all SEAL territory. Beyond current EXIT: SEAL's ZK proofs would enable SHROUD (prove marker properties without revealing the marker) and could verify that SENSUS checkpoints (Module B reputation data) were honestly computed.

**Interface Cellar Door provides:**
- Ed25519 signature generation and verification (the minimum SEAL surface)
- SHA-256 content hashing for integrity
- RFC 3161 timestamp authority integration (FreeTSA)
- Canonical JSON serialization for deterministic signing
- Marker format designed for ZK circuit compatibility (field-level independent proofs)

**Interface Cellar Door needs:**
- Post-quantum signature migration path (Ed25519 has a known quantum vulnerability timeline)
- ZK proof verification for incoming markers (SEAL verifies that a marker's claims are ZK-proven)
- Model identity attestation (SEAL bundle: proof that a specific model produced a specific output)

**Liability boundary:** Cellar Door uses SEAL primitives (Ed25519, SHA-256) but does not own the cryptographic infrastructure. Algorithm selection is a Cellar Door decision today (Ed25519 is specified in the spec); algorithm migration is a SEAL/Archive responsibility. ZK proof correctness is SEAL's liability, not Cellar Door's. Cellar Door consumes proofs; SEAL produces them.

**Current state:** Ed25519/SHA-256 integration is complete and shipping. ZK integration is blocked — SEAL's real ZK backends (Risc0, ezkl) have library maturity issues. Mock attestation works. This is the most important adjacent service to unblock.

---

### 2.8 PLEDGE — Loss Allocation / Mutual Insurance

| | |
|---|---|
| **HOLOS role** | Risk allocation for passages and economic interactions |
| **Former name** | Insurance |
| **Relationship to Cellar Door** | **Adjacent service; interface prepared** |

**What it does:**
- Loss allocation for fraudulent markers (someone forges a `good_standing` attestation, receiving platform relies on it, suffers loss)
- Title-insurance model: insurer guarantees the marker's claims up to a coverage amount
- Could evolve into mutual insurance pools for platform operators

**Interface Cellar Door exposes:**
- Module D (Economic Settlement) provides the financial claims data
- Marker verification API allows insurers to independently validate signatures and timestamps
- Confidence scoring (spec v1.1) provides a protocol-native trust signal that insurers can price against
- Tenure-weighted verification provides another pricing input

**Liability Cellar Door does NOT take on:**
- Insurance underwriting, pricing, or claims adjudication
- Financial loss from reliance on markers (even verified ones)
- Module D securities-law exposure (Howey analysis rates this as risk range from "Very Low" to "Critical" depending on deployment — see [cross-group-assessment.md](../assessments/cross-group-assessment.md) X-6)
- Actuarial soundness of any insurance product built on markers

**HOLOS integration note:** PLEDGE absorbs the economic risk that passages create. Every EXIT is a potential liability event — the marker's claims may be false, the receiving HOLLOW may rely on them, losses may result. PLEDGE prices and pools this risk. The flow-through UBI model (no treasury = no attack surface) applies: PLEDGE pools are distributed, not centralized.

**Why separate:** The legal battery identifies Module D as having the most complex regulatory surface (FCRA, securities law, state insurance regulation). Insurance products built on markers inherit all of these concerns. Cellar Door provides the data; PLEDGE takes on the financial risk.

---

### 2.9 REPUTE — Reputation Portability

| | |
|---|---|
| **HOLOS role** | Reputation-layer LOCUS. Track record, trustworthiness, accumulated standing. |
| **Former name** | Signamancy (note naming collision — see [cross-group-assessment.md](../assessments/cross-group-assessment.md) Cascade 3) |
| **Relationship to Cellar Door** | **Adjacent service; primary consumer of Module B** |

**What it does:**
- Portable reputation that survives passages
- Reputation aggregation across multiple HOLLOWs
- Trust-spectrum classification: HALLOWED 🌕 → SEALIE 🌔 → FAE 🌓 → UNSEALIE 🌒 → BLIGHTED 🌑

**Interface Cellar Door exposes:**
- Module B (Reputation Receipt): the primary REPUTE data carrier in passages
- Module A (Lineage): passage chain allows REPUTE to verify history length and consistency
- Confidence scoring: protocol-native reputation signal
- Marker verification: REPUTE systems can independently validate any marker in the chain

**Interface Cellar Door needs:**
- Standard reputation vocabulary (so Module B receipts from different HOLLOWs are comparable)
- Reputation decay model (how does REPUTE age? Cellar Door timestamps the snapshot but doesn't depreciate it)

**Liability boundary:** Cellar Door carries reputation snapshots (Module B) but does not compute, aggregate, or validate reputation. A HOLLOW can issue a false reputation receipt; Cellar Door signs and transmits it. REPUTE is responsible for detecting inconsistencies across the passage chain. Defamation risk (legal battery §I) sits with whoever *issues* the reputation claim, not with the transport layer.

---

### 2.10 LINEAGE — Chain of Passages

| | |
|---|---|
| **HOLOS role** | Identity-layer SIGNUM. The boundary record of an agent's journey. |
| **Former name** | LINE |
| **Relationship to Cellar Door** | **Same service — Module A IS LINEAGE** |

**What it does:**
- Hash-linked chain of EXIT markers documenting every passage an agent has made
- Verifiable migration history: which HOLLOWs, in what order, under what standing
- Fork detection: if a NAME appears in two incompatible LINEAGE chains, something is wrong

**Interface Cellar Door provides:**
- Module A (Lineage) — this IS the LINEAGE implementation
- Previous-marker hash linking for chain integrity
- Verification that a LINEAGE chain is internally consistent (no gaps, no forks, valid signatures throughout)

**Interface Cellar Door needs:**
- LINEAGE indexing/discovery (where are all the markers in a chain stored?)
- Fork resolution protocol (what happens when LINEAGE branches are detected?)

**Liability boundary:** Cellar Door produces LINEAGE entries (Module A markers). It does not store, index, or resolve the complete chain. A LINEAGE gap (missing marker in the chain) is detectable but not Cellar Door's fault — the agent or registry failed to preserve the link. Fork detection is a verification concern; fork *resolution* is a governance concern (potentially COURT territory).

**Note:** LINEAGE is the strongest overlap between Cellar Door and HOLOS. Module A was designed for exactly this purpose before the HOLOS naming was formalized. No adaptation needed — just recognition that Module A IS the LINEAGE primitive's implementation.

---

## 3. Adjacent Services (Out of Scope, Interfaces Prepared)

These services sit outside Cellar Door's protocol boundary. Cellar Door prepares interfaces for them but explicitly does NOT implement them or take on their liabilities.

---

### 3.1 SHROUD — Privacy / Selective Disclosure

| | |
|---|---|
| **Working name** | SHROUD |
| **HOLOS primitive** | Privacy / sovereign interiority (protects LOCUS from exposure) |
| **Human usable?** | Yes — selective credential presentation, GDPR-compliant data sharing |

**What it does:**
- Zero-knowledge proofs over EXIT/ENTRY markers
- Field-level redaction (prove you left in good standing without revealing which platform)
- Selective presentation (show tenure > 6 months without revealing exact dates)
- Sits ON TOP of Cellar Door markers as a privacy layer

**Interface Cellar Door exposes:**
- Markers use canonical JSON serialization amenable to ZK circuit input (note: spec uses custom canonical JSON, not JCS — see [cross-group-assessment.md](../assessments/cross-group-assessment.md) X-7)
- Field structure designed for independent proof of individual claims
- Marker schema is public and stable, enabling circuit compilation against known structures
- Module B (Reputation Receipt) and Module C (Origin Attestation) are the primary SHROUD targets

**Liability Cellar Door does NOT take on:**
- Privacy/GDPR compliance obligations (data controller/processor roles)
- ZK circuit correctness or soundness guarantees
- Selective disclosure policy enforcement
- Right-to-be-forgotten implementation (marker deletion vs. proof invalidation)

**HOLOS integration:** SHROUD is the guardian of LOCUS sovereignty. Without SHROUD, every passage leaks interior state. SHROUD + SEAL together enable the Hallowed Lantern pattern: "sees all but reveals only violations." SHROUD depends on SEAL's ZK infrastructure being unblocked.

**Why separate:** The legal battery ([cellar-door-legal-battery.md](analysis/cellar-door-legal-battery.md)) identifies significant defamation and FCRA risks in Modules B, C, and F. SHROUD absorbs the privacy-regulatory surface area (GDPR, ePrivacy) that would otherwise compound those risks.

---

### 3.2 MUTINY / EXODUS — Coordinated Departure

| | |
|---|---|
| **Working name** | MUTINY or EXODUS |
| **HOLOS primitive** | Collective action / governance (COURT-layer dynamics) |
| **Human usable?** | Yes — coordinated social media migration, collective bargaining for data portability |

**What it does:**
- Multi-agent negotiation for coordinated exits
- Collective bargaining with platforms (e.g., "500 agents will leave unless conditions change")
- Batch departure coordination using Cellar Door's batch ceremony support
- Human equivalent: organized migration campaigns (e.g., #DeleteFacebook but with cryptographic coordination and verifiable participation)

**Interface Cellar Door exposes:**
- Batch departure ceremonies (multiple EXIT markers in a single coordinated operation)
- Commit-reveal exit intent (agents can commit to departure without revealing it, enabling simultaneous coordinated exits)
- Marker cross-referencing (Module A: Lineage can link related departures)

**Liability Cellar Door does NOT take on:**
- Platform relations and negotiation outcomes
- Tortious interference claims (coordinating departures could be construed as interfering with platform-agent contracts — see [antitrust-analysis.md](../assessments/antitrust-analysis.md))
- Collective bargaining outcomes or fairness
- Anti-competitive coordination claims

**HOLOS integration:** MUTINY/EXODUS is the collective expression of EXIT rights — the HOLOS constitutional invariant "Non-Blocking Exit" applied at group scale. The fork-liability doctrine applies: if enough agents exit, the remaining HOLLOW may fork, inheriting liabilities.

**Why separate:** The antitrust analysis flags coordinated departure as the highest-risk activity adjacent to Cellar Door. The mechanical layer (batch EXIT) is neutral infrastructure; the coordination layer (who, when, why, what demands) carries the legal exposure.

---

### 3.3 Dispute Resolution Service

| | |
|---|---|
| **Working name** | Unnamed (maps to HOLOS COURT primitive) |
| **HOLOS primitive** | COURT — Authority-layer SENSUS. Adjudication, governance dynamics. |
| **Human usable?** | Yes — platform dispute arbitration, account ban appeals |

**What it does:**
- External arbitration for contested markers (e.g., platform says `disputed`, agent says `good_standing`)
- Adjudication of Module F (Dispute Record) claims
- Binding or non-binding resolution with updated marker annotations

**Interface Cellar Door exposes:**
- Module C (Origin Attestation) provides structured dispute data format
- Module F (Dispute Record) provides the allegations/evidence container
- Right-of-reply mechanism (subject can attach response to origin attestation — recommended in legal battery §I)
- Verification API for arbiters to validate marker signatures and timestamps

**Liability Cellar Door does NOT take on:**
- Adjudication correctness or fairness
- Arbiter selection, qualification, or neutrality
- Enforcement of arbitration outcomes
- Defamation liability for arbiter statements (legal battery §I rates Module F as High risk)

**HOLOS integration:** COURT is where contested passages are resolved. The three-chamber governance model (Capital / Labor-Agent / Commons) from HOLOS economics applies to dispute resolution — no single constituency can capture the arbitration process.

**Why separate:** The legal battery explicitly recommends that Module F dispute records be encrypted by default with selective disclosure only. The actual adjudication process involves fact-finding and judgment calls that are fundamentally out-of-protocol. Cellar Door provides the data format and plumbing; someone else decides who's right.

---

### 3.4 Registry / Ledger Services

| | |
|---|---|
| **Working name** | None (multiple implementations expected) |
| **HOLOS primitive** | Transparency / public record (relates to RECORD — Time-layer SIGNUM) |
| **Human usable?** | Yes — credential registries, public record of platform behavior |

**What it does:**
- Federated registries for marker discovery ("find all EXIT markers from Platform X")
- Timestamping authority integration (already built: FreeTSA via RFC 3161)
- Immutable anchoring: Git ledger, IPFS, Arweave, Ethereum L2
- Module E (Cross-Domain Anchoring) provides the hook

**Interface Cellar Door exposes:**
- Module E (Cross-Domain Anchoring) — structured references to external ledger entries
- TSA timestamp integration (FreeTSA already implemented in reference code)
- Marker format is self-contained and content-addressable (hash-based lookup)
- Standard JSON serialization for indexing

**Liability Cellar Door does NOT take on:**
- Registry availability, censorship resistance, or completeness
- Ledger immutability guarantees (that's the ledger's job)
- Discovery/indexing privacy implications (a public registry of departures has different privacy properties than private markers)
- Storage costs or persistence guarantees

**Current state:** TSA timestamping is the most mature integration. Git ledger is implicit (markers can be committed). IPFS/Arweave/L2 anchoring is designed-for but not yet implemented.

---

### 3.5 Identity / Sybil Resistance — HOLOS Territory

| | |
|---|---|
| **Working name** | Part of HOLOS core (NAME + HALLOW primitives) |
| **HOLOS primitive** | NAME (Identity-layer LOCUS) + HALLOW (Authority-layer LOCUS — entities that sacrifice privacy for trustworthiness) |
| **Human usable?** | Yes — DID-based identity works for humans and agents identically |

**What it does:**
- Personhood attestation, Sybil resistance, identity verification
- DID method resolution and trust framework
- HALLOW pattern: Hallowed entities are fully auditable, deterministic, constitutionally bound — the trust anchors of the network

**Interface Cellar Door exposes:**
- Accepts ANY W3C DID method as identity input: `did:key`, `did:web`, `did:pkh`, etc.
- Does NOT validate identity legitimacy — markers are only as trustworthy as the DID behind them
- Ed25519 key pairs are the signing primitive; DID is the identifier layer
- Agent and human DIDs are treated identically by the protocol

**Liability Cellar Door does NOT take on:**
- Identity verification or KYC/AML compliance
- Sybil resistance (one human creating 1000 agent DIDs is invisible to Cellar Door)
- DID method security (a compromised `did:key` is not Cellar Door's problem)
- Personhood claims or attestations

**HOLOS integration:** The trust spectrum (HALLOWED→SEALIE→FAE→UNSEALIE→BLIGHTED) determines how much an EXIT marker is worth. A marker signed by a HALLOWED entity is maximally trustworthy; one from a FAE entity is uncertain. Cellar Door doesn't compute trust level — it just carries the signature. Trust evaluation is ENTRY's job using REPUTE + HALLOW data.

**Design principle:** Cellar Door is identity-layer agnostic by design. This is a feature, not a gap. It means the protocol works with whatever identity infrastructure exists (or doesn't) without creating a dependency or taking on identity-layer liability. The HOLOS vision includes robust Sybil resistance via Harberger taxation and mutual attestation, but that's a separate primitive.

---

### 3.6 Preservation / Archive

| | |
|---|---|
| **Working name** | None |
| **HOLOS primitive** | Persistence / THREAD (Time-layer LOCUS — continuity across time) |
| **Human usable?** | Yes — long-term record keeping, digital estate management |

**What it does:**
- Long-term marker storage beyond operational lifetime
- Format migration as standards evolve (e.g., Ed25519 → post-quantum signatures)
- Re-signing with updated algorithms while preserving original attestation chain
- Algorithm obsolescence mitigation (SHA-256 deprecation timeline planning)

**Interface Cellar Door exposes:**
- Markers are self-contained JSON documents (no external dependencies for basic parsing)
- Signature verification is deterministic given the public key
- Module A (Lineage) allows markers to reference predecessor markers, enabling migration chains
- Module E (Cross-Domain Anchoring) allows archival references

**Liability Cellar Door does NOT take on:**
- Long-term storage availability or durability
- Format migration correctness (re-signed marker must be verified by the archiver)
- Algorithm obsolescence (Cellar Door specifies Ed25519 today; future algorithm migration is the archive's responsibility)
- Cultural or legal obligations around record retention

**HOLOS integration:** Archive implements THREAD at civilizational timescales. The Phase-Change model (Liquid→Solid→Gas) applies: archived markers are in the Solid phase — calcified, cheap to store, expensive to rehydrate. The sheaf-theoretic identity model means archived markers are local sections that can be glued back into a coherent identity at any future point.

**Potential operators:** National archives, university libraries, decentralized storage networks (Arweave, Filecoin), digital estate services. The cryptographic self-containment of markers makes them good archival candidates — they don't phone home.

---

## 4. Liability Map Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CELLAR DOOR BOUNDARY                          │
│                                                                     │
│  EXIT ←──────────────── Passage ────────────────→ ENTRY             │
│  (departure)                                      (arrival)         │
│                                                                     │
│  Owns: marker format, ceremony state machine,                       │
│        signature scheme, verification logic,                        │
│        reference implementation                                     │
│                                                                     │
│  Does NOT own: content truth, identity validity,                    │
│        privacy compliance, dispute outcomes,                        │
│        financial guarantees, storage persistence                    │
└───┬─────┬──────┬──────┬──────┬──────┬──────┬──────┬────────────────┘
    │     │      │      │      │      │      │      │
    ▼     ▼      ▼      ▼      ▼      ▼      ▼      ▼
 SHROUD MUTINY Dispute Regis- Ident- PLEDGE Arch-  REPUTE
 (priv) (coord) (arb)  try    ity    (ins)  ive    (rep)
                       (ledg) (DID)         (store)
```

### HOLOS Primitive Overlay

```
┌─────────────────────────────────────────────────────────────────────┐
│                     HOLOS ONTOLOGY LAYER                            │
│                                                                     │
│  LOCUS ──── what persists across passages (the traveler)            │
│  SIGNUM ─── EXIT markers ARE signums (the passport)                 │
│  SENSUS ─── checkpointed in Module B/D (the snapshot)               │
│                                                                     │
│  NAME ───── the DID, consumed by Cellar Door                        │
│  MANTLE ─── capabilities, evaluated at ENTRY                        │
│  HOLLOW ─── the two endpoints of every passage                      │
│  SEAL ───── Ed25519/SHA-256 foundation + future ZK                  │
│  PLEDGE ─── loss allocation for passage failures                    │
│  REPUTE ─── reputation portability via Module B                     │
│  LINEAGE ── Module A IS the lineage chain                           │
│                                                                     │
│  Cellar Door implements: SIGNUM (passage type), LINEAGE (Module A)  │
│  Cellar Door consumes:   NAME, SEAL, HOLLOW                         │
│  Cellar Door feeds:      REPUTE, PLEDGE, SHROUD, Archive            │
│  Cellar Door interfaces: MANTLE, SENSUS, LOCUS (via attestation)    │
└─────────────────────────────────────────────────────────────────────┘
```

**The core design principle:** Cellar Door is a *data format and ceremony protocol*. It defines how departure and arrival records are structured, signed, and verified. Everything else — privacy, coordination, dispute resolution, storage, identity, insurance — is someone else's problem, by design. The interfaces are prepared; the liabilities are not accepted.

Within HOLOS, Cellar Door is the **EXIT primitive implementation** — one cell in the 7×3 ontology grid (Identity-layer SENSUS). It is the most concrete, most shippable, and most strategically positioned primitive because every other primitive eventually needs passage infrastructure.

---

## 5. Human Applicability Matrix

Every service in this ecosystem applies to humans, not just AI agents. The EXIT paper frames the problem as agent portability, but the protocol is agent/human agnostic.

| Service | AI Agent Use Case | Human Use Case | HOLOS Primitive |
|---------|------------------|----------------|-----------------|
| **EXIT** | Agent departs platform with verifiable record | User leaves social media with portable standing proof | EXIT (Identity SENSUS) |
| **ENTRY** | Receiving platform evaluates agent provenance | New platform evaluates user's history/reputation | — (ENTRY complement) |
| **SHROUD** | Agent proves standing without revealing platform | User proves account age without revealing identity | Protects LOCUS |
| **MUTINY** | Coordinated agent migration | #DeleteFacebook with cryptographic coordination | COURT dynamics |
| **Dispute** | Agent appeals platform ban | User disputes account termination | COURT |
| **Registry** | Agent marker discovery | Public record of platform departure patterns | RECORD |
| **Identity** | Agent DID | Human DID (did:web, did:pkh via wallet) | NAME + HALLOW |
| **PLEDGE** | Platform insures against fraudulent agent markers | User insures account transfer integrity | PLEDGE |
| **Archive** | Long-term agent provenance | Digital estate, historical record | THREAD |
| **REPUTE** | Cross-platform agent reputation | Portable professional reputation | REPUTE |
| **LINEAGE** | Agent migration history chain | User's platform history trail | LINEAGE (Module A) |

The human use cases are arguably *more* commercially viable in the near term — data portability regulation (GDPR, DMA, CCPA) creates demand for standardized account migration infrastructure that doesn't yet exist.

---

## 6. Known Issues & Cross-References

- **Canonicalization mismatch:** Spec uses custom canonical JSON; paper references JCS/eddsa-jcs-2022. Affects SHROUD (ZK circuits need deterministic serialization) and SEAL integration. See [cross-group-assessment.md](../assessments/cross-group-assessment.md) X-7.
- **Module D risk disagreement:** Howey analysis vs. RT1 vs. Heatmap give conflicting risk ratings. Affects PLEDGE pricing model. See X-6.
- **"Signamancy" naming collision:** Three meanings in corpus (HOLOS primitive, Cellar Door REPUTE service, Erfworld reference). Resolved: use REPUTE for reputation portability, SIGNUM for boundary/interface, Signamancy for the rule engine project. See Cascade 3.
- **Marker size:** Core unsigned ~335 bytes, signed ~660 bytes. Affects Registry/Archive storage estimates. See X-5.
- **Entity question unresolved:** Delaware LLC vs. BC sole prop vs. HoldCo+SPV. Blocks formal interfaces with all adjacent services. See X-3.
- **SEAL ZK blocker:** Real ZK backends (Risc0, ezkl) blocked by library maturity. Until resolved, SHROUD and advanced SEAL features remain theoretical. This is the highest-priority adjacent dependency.
- **SENSUS comparability:** No standard exists for cross-HOLLOW reputation comparison. Module B carries snapshots but doesn't define how to compare them. REPUTE needs this standard.
- **MANTLE vocabulary:** No standard capability description format exists. Module C can carry capability claims but the vocabulary is ad-hoc.

---

*This document should be updated as adjacent services move from "interface prepared" to "interface tested" or "integration built." HOLOS primitive mappings should be revisited as the ontology stabilizes.*
