# Passage Protocol — Ecosystem Map

**Date:** 2026-02-24
**Status:** Living document
**Scope:** Connection graph of Cellar Door primitives, adjacent services, liability boundaries, and human applicability

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

## 2. Adjacent Services (Out of Scope, Interfaces Prepared)

These services sit outside Cellar Door's protocol boundary. Cellar Door prepares interfaces for them but explicitly does NOT implement them or take on their liabilities.

---

### 2.1 SHROUD — Privacy / Selective Disclosure

| | |
|---|---|
| **Working name** | SHROUD |
| **HOLOS primitive** | Privacy / sovereign interiority |
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

**Why separate:** The legal battery ([cellar-door-legal-battery.md](analysis/cellar-door-legal-battery.md)) identifies significant defamation and FCRA risks in Modules B, C, and F. SHROUD absorbs the privacy-regulatory surface area (GDPR, ePrivacy) that would otherwise compound those risks.

---

### 2.2 MUTINY / EXODUS — Coordinated Departure

| | |
|---|---|
| **Working name** | MUTINY or EXODUS |
| **HOLOS primitive** | Collective action / governance |
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

**Why separate:** The antitrust analysis flags coordinated departure as the highest-risk activity adjacent to Cellar Door. The mechanical layer (batch EXIT) is neutral infrastructure; the coordination layer (who, when, why, what demands) carries the legal exposure.

---

### 2.3 Dispute Resolution Service

| | |
|---|---|
| **Working name** | Unnamed |
| **HOLOS primitive** | Governance / adjudication |
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

**Why separate:** The legal battery explicitly recommends that Module F dispute records be encrypted by default with selective disclosure only. The actual adjudication process involves fact-finding and judgment calls that are fundamentally out-of-protocol. Cellar Door provides the data format and plumbing; someone else decides who's right.

---

### 2.4 Registry / Ledger Services

| | |
|---|---|
| **Working name** | None (multiple implementations expected) |
| **HOLOS primitive** | Transparency / public record |
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

### 2.5 Identity / Sybil Resistance — HOLOS Territory

| | |
|---|---|
| **Working name** | Part of HOLOS core (Signamancy — note naming collision, see [cross-group-assessment.md](../assessments/cross-group-assessment.md) Cascade 3) |
| **HOLOS primitive** | Identity / personhood attestation |
| **Human usable?** | Yes — DID-based identity works for humans and agents identically |

**What it does:**
- Personhood attestation, Sybil resistance, identity verification
- DID method resolution and trust framework

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

**Design principle:** Cellar Door is identity-layer agnostic by design. This is a feature, not a gap. It means the protocol works with whatever identity infrastructure exists (or doesn't) without creating a dependency or taking on identity-layer liability. The HOLOS vision includes robust Sybil resistance via Harberger taxation and mutual attestation, but that's a separate primitive.

---

### 2.6 Insurance / PLEDGE

| | |
|---|---|
| **Working name** | PLEDGE |
| **HOLOS primitive** | Risk allocation / mutual insurance |
| **Human usable?** | Yes — title insurance equivalent for digital account transfers |

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

**Why separate:** The legal battery identifies Module D as having the most complex regulatory surface (FCRA, securities law, state insurance regulation). Insurance products built on markers inherit all of these concerns. Cellar Door provides the data; PLEDGE takes on the financial risk.

---

### 2.7 Preservation / Archive

| | |
|---|---|
| **Working name** | None |
| **HOLOS primitive** | Persistence / cultural memory |
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

**Potential operators:** National archives, university libraries, decentralized storage networks (Arweave, Filecoin), digital estate services. The cryptographic self-containment of markers makes them good archival candidates — they don't phone home.

---

## 3. Liability Map Summary

```
┌─────────────────────────────────────────────────────────┐
│                    CELLAR DOOR BOUNDARY                  │
│                                                         │
│  EXIT ←──────────── Passage ──────────→ ENTRY           │
│  (departure)                            (arrival)       │
│                                                         │
│  Owns: marker format, ceremony state machine,           │
│        signature scheme, verification logic,             │
│        reference implementation                         │
│                                                         │
│  Does NOT own: content truth, identity validity,        │
│        privacy compliance, dispute outcomes,            │
│        financial guarantees, storage persistence        │
└────┬──────┬──────┬──────┬──────┬──────┬──────┬─────────┘
     │      │      │      │      │      │      │
     ▼      ▼      ▼      ▼      ▼      ▼      ▼
  SHROUD  MUTINY  Dispute Registry Identity PLEDGE Archive
  (privacy)(coord) (arb)  (ledger) (DID)  (ins)  (store)
```

**The core design principle:** Cellar Door is a *data format and ceremony protocol*. It defines how departure and arrival records are structured, signed, and verified. Everything else — privacy, coordination, dispute resolution, storage, identity, insurance — is someone else's problem, by design. The interfaces are prepared; the liabilities are not accepted.

---

## 4. Human Applicability Matrix

Every service in this ecosystem applies to humans, not just AI agents. The EXIT paper frames the problem as agent portability, but the protocol is agent/human agnostic.

| Service | AI Agent Use Case | Human Use Case |
|---------|------------------|----------------|
| **EXIT** | Agent departs platform with verifiable record | User leaves social media with portable standing proof |
| **ENTRY** | Receiving platform evaluates agent provenance | New platform evaluates user's history/reputation |
| **SHROUD** | Agent proves standing without revealing platform | User proves account age without revealing identity |
| **MUTINY** | Coordinated agent migration | #DeleteFacebook with cryptographic coordination |
| **Dispute** | Agent appeals platform ban | User disputes account termination |
| **Registry** | Agent marker discovery | Public record of platform departure patterns |
| **Identity** | Agent DID | Human DID (did:web, did:pkh via wallet) |
| **PLEDGE** | Platform insures against fraudulent agent markers | User insures account transfer integrity |
| **Archive** | Long-term agent provenance | Digital estate, historical record |

The human use cases are arguably *more* commercially viable in the near term — data portability regulation (GDPR, DMA, CCPA) creates demand for standardized account migration infrastructure that doesn't yet exist.

---

## 5. Known Issues & Cross-References

- **Canonicalization mismatch:** Spec uses custom canonical JSON; paper references JCS/eddsa-jcs-2022. Affects SHROUD (ZK circuits need deterministic serialization). See [cross-group-assessment.md](../assessments/cross-group-assessment.md) X-7.
- **Module D risk disagreement:** Howey analysis vs. RT1 vs. Heatmap give conflicting risk ratings. Affects PLEDGE pricing model. See X-6.
- **"Signamancy" naming collision:** Three meanings in corpus. Affects Identity service mapping to HOLOS. See Cascade 3.
- **Marker size:** Comms say ~300 bytes; actual is 442-586 bytes (core). Affects Registry/Archive storage estimates. See X-5.
- **Entity question unresolved:** Delaware LLC vs. BC sole prop vs. HoldCo+SPV. Blocks formal interfaces with all adjacent services. See X-3.

---

*This document should be updated as adjacent services move from "interface prepared" to "interface tested" or "integration built."*
