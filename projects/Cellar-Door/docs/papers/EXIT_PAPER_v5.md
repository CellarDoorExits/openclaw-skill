# The Passage Protocol: Verifiable Agent Departure and Arrival Ceremonies

**Authors:** [Names TBD]

**Affiliation:** Cellar Door Project 𓉸

**Date:** 2026

**Preprint — not yet peer-reviewed**

> This paper describes EXIT Protocol Specification v1.1 and ENTRY Protocol Specification v1.0.

---

## Abstract

No standardized mechanism exists for AI agents to verifiably depart one platform, carry a portable record of that departure, and establish identity continuity upon arrival at another. Current agent interoperability standards address communication (A2A), tool access (MCP), and payment (AP2), but treat agent lifecycle transitions—particularly departure and arrival—as out of scope. This creates platform lock-in, information asymmetry at agent boundaries, and governance gaps.

We present the **Passage Protocol** 𓉸: a pair of complementary protocols—EXIT and ENTRY—for verifiable agent departure and arrival ceremonies. EXIT defines a cryptographically signed, portable departure marker (~335 bytes unsigned, ~660 bytes signed) recording who departed, from where, when, and under what standing. ENTRY defines arrival markers signed by destination platforms, linking back to EXIT markers to establish **Proof of Passage (PoP)**—cryptographic evidence that an entity transited between systems. The protocol specifies a seven-state departure ceremony with three execution paths (cooperative, unilateral, emergency), eight exit types, six optional extension modules, RFC 3161 timestamp anchoring, git-backed ledger anchoring, and a layered verification model built on Ed25519 signatures (with ECDSA P-256 for FIPS 140-2/3 compliance) and W3C Decentralized Identifiers. We analyze the Passage Protocol through mechanism design, security, legal, ethical, and multi-lens validation perspectives. A multi-lens review by 15 synthetic professional personas unanimously endorsed the core architecture while identifying critical gaps—three of which (arrival protocol, trusted timestamping, dead-man switches) have been addressed in the current version. We describe a TypeScript reference implementation comprising five npm packages across six GitHub repositories with 399 passing tests, including framework integrations for LangChain, Vercel AI SDK, and MCP. The protocol specification and reference implementation are released under the Apache License 2.0.

**Keywords:** agent portability, departure ceremony, arrival ceremony, Proof of Passage, verifiable credentials, decentralized identity, exit rights, mechanism design

---

## 1. Introduction

### 1.1 The Departure Problem

The emerging AI agent ecosystem is developing rapidly. Agents autonomously negotiate contracts (Google DeepMind, 2024), execute multi-step workflows across organizational boundaries (Wu et al., 2023), and transact financially on behalf of their operators (AP2 Protocol, 2026). Industry standards have emerged for agent communication (A2A Protocol; Google/Linux Foundation, 2025), tool access (Model Context Protocol; Anthropic, 2024), agent discovery (OASF; Cisco, 2025), and payment authorization (AP2; Google, 2026). NIST's Center for AI Standards and Innovation launched an AI Agent Standards Initiative in February 2026 (NIST, 2026), recognizing the need for agent authentication, authorization, and lifecycle governance.

Yet a fundamental question remains unaddressed: **what happens when an agent leaves?**

Consider two scenarios. First, a customer service agent on Platform A is banned following a policy dispute. The agent's operator has invested months building workflow history, customer interaction patterns, and domain-specific tuning. The ban is immediate. No verifiable departure record exists. When the operator deploys a replacement on Platform B, Platform B cannot evaluate whether this is a legitimate migration or an expelled bad actor creating a fresh identity.

Second, Platform C—an AI agent hosting service with 10,000 active agents—announces shutdown in 90 days. Every agent faces the same problem: how to carry a verifiable record of its operational history to a new home. Without standardized departure infrastructure, each operator must negotiate individually with receiving platforms, which have no common framework for assessing provenance.

These are predictable consequences of an ecosystem that standardizes communication, payment, and tool access but treats departure as an afterthought.

Hirschman (1970) demonstrated that the *ability to exit* is a fundamental governance mechanism: exit exerts competitive pressure on institutions, provides members with autonomy, and signals institutional quality. When exit is costly or impossible, institutions face reduced accountability.

### 1.2 The Arrival Problem

Departure alone is insufficient. An agent that can leave but has no standardized way to *arrive*—to present its departure record, have it verified, and gain admission under known terms—possesses only half of genuine mobility. Without an arrival protocol, departure records are dead letters: produced but never consumed.

The arrival problem introduces a necessary asymmetry. Departure is a right—no platform should be able to prevent an agent from leaving. But admission is a privilege—destination platforms have legitimate authority to accept, condition, or deny entry based on their own policies. This mirrors real-world immigration: the right to emigrate is recognized in international law (UDHR Article 13), while the right to enter another country is subject to that country's sovereign discretion.

### 1.3 Contributions

This paper presents the Passage Protocol, comprising EXIT and ENTRY, with the following contributions:

1. A minimal core schema for portable, cryptographically signed departure records with eight exit types
2. A companion arrival protocol enabling destinations to verify departures and issue signed admission records
3. **Proof of Passage (PoP)**: the cryptographic chain linking departure to arrival, providing verifiable evidence of entity movement between systems
4. RFC 3161 timestamp anchoring and git-backed ledger anchoring for independent temporal proof
5. Checkpoint and dead-man patterns enabling pre-signed departure markers for coercion defense
6. Trust mechanisms—commit-reveal, confidence scoring, tenure tracking, completeness attestation—that move beyond pure self-attestation
7. A multi-lens validation exercise subjecting the protocol to review by 15 professional personas
8. A reference implementation comprising five npm packages with 399 passing tests, including framework integrations for LangChain, Vercel AI SDK, and MCP

The remainder of this paper is organized as follows. Section 2 surveys related work. Section 3 presents the EXIT protocol. Section 4 presents the ENTRY protocol. Section 5 analyzes trust and anchoring mechanisms. Section 6 examines security. Section 7 surveys legal considerations. Section 8 addresses ethics. Section 9 reports multi-lens validation findings. Section 10 describes implementation and evaluation. Section 11 discusses limitations. Section 12 concludes.

---

## 2. Background and Related Work

### 2.1 Decentralized Identity

The W3C Decentralized Identifiers (DIDs) specification (W3C, 2022) defines identifiers that enable verifiable, decentralized digital identity. A DID resolves to a DID Document containing public keys, authentication methods, and service endpoints, independent of any single authority. W3C Verifiable Credentials (VCs) (W3C, 2024a) provide a standard for cryptographically verifiable claims. The Key Event Receipt Infrastructure (KERI) (Smith, 2021) extends the DID model with pre-rotation for forward security against key compromise. JSON-LD (W3C, 2024b) provides the linked data serialization format used by EXIT and ENTRY markers.

### 2.2 Agent Communication and Interoperability Standards

Several standards address agent interoperability, each covering a distinct layer:

- **A2A Protocol** (Google/Linux Foundation, 2025): Cross-vendor agent communication. Does not address identity persistence across platforms.
- **Model Context Protocol (MCP)** (Anthropic, 2024): Standardizes agent access to tools and context. No identity layer. A founding project of the Agentic AI Foundation (AAIF).
- **Agent Communication Protocol (ACP)** (IBM/BeeAI, 2025): RESTful agent interoperability. Mentions "flexible agent replacement" but treats this as operational hot-swapping, not identity-preserving migration.
- **Open Agentic Schema Framework (OASF)** (Cisco, 2025): Standardized schemas for agent capabilities and discovery. Focused on capability advertisement, not lifecycle transitions.
- **AP2 (Agent Payments Protocol)** (Google et al., 2026): Agent-initiated payments using verifiable credentials. Establishes that agents need portable proof of authority—a conceptual building block for portable departure credentials.

The Foundation for Intelligent Physical Agents (FIPA), now absorbed into IEEE, established early standards for agent communication (FIPA ACL) and agent management, including agent lifecycle models covering creation, suspension, and termination (FIPA, 2002a; 2002b). However, FIPA's lifecycle model treats departure as platform-internal termination rather than a portable, verifiable event. The Passage Protocol extends FIPA's lifecycle model to cross-platform departure and arrival with cryptographic verification.

None of these address what happens when an agent departs or arrives at a platform. The Agentic AI Foundation (AAIF), formed in December 2025, is formalizing agent protocol standardization, but current workstreams focus on communication and tool access rather than identity portability.

### 2.3 Enterprise Agent Identity

Enterprise solutions for agent identity operate within organizational boundaries. Microsoft Entra Agent ID (2025) provides a unified directory for agent identities across Microsoft's ecosystem, with authentication and lifecycle governance but no cross-organizational portability. SailPoint Agent Identity Security (2025) aggregates AI agents from cloud providers and assigns human owners. These systems treat agents as organizational assets—appropriate for many enterprise contexts but insufficient for multi-platform ecosystems.

### 2.4 Self-Sovereign Identity for Agents

Gailums (2025) articulated the case for applying self-sovereign identity (SSI) principles to AI agents, proposing "passports for agents" built on DIDs and verifiable credentials. This aligns with the Decentralized Identity Foundation's broader infrastructure but does not address departure semantics or agent-initiated exit.

### 2.5 AI Governance and Risk Management Standards

Several standards address AI governance at the organizational and system level. ISO/IEC 42001 (ISO, 2023) defines requirements for AI management systems, including operational controls for AI lifecycle governance. ISO/IEC 23894 (ISO, 2023) provides guidance on AI risk management. The NIST AI Risk Management Framework (AI 100-1) (NIST, 2023) establishes functions—Govern, Map, Measure, Manage—for managing AI risks, while the NIST AI RMF Generative AI Profile (AI 600-1) (NIST, 2024b) extends these to generative AI systems. IEEE P2247 addresses ethics in autonomous and intelligent systems, and IEEE P3119 targets AI procurement standards.

These frameworks establish organizational and governance requirements but do not define technical mechanisms for agent lifecycle transitions. The Passage Protocol provides implementable infrastructure—verifiable departure and arrival records—that supports compliance with these governance frameworks. EXIT markers serve as auditable artifacts within an ISO 42001 management system, and the protocol's trust mechanisms align with the traceability and accountability requirements of AI 100-1 and ISO/IEC 23894.

### 2.6 DAO Exit Mechanisms

Decentralized Autonomous Organizations have developed mature on-chain exit mechanisms. Moloch DAO's *ragequit* (Ameen et al., 2019) allows members to exit during a grace period, withdrawing their proportional treasury share. This differs from the Passage Protocol in that ragequit is an economic mechanism (withdraw capital) rather than an identity mechanism (carry reputation), operates within a single on-chain context, and provides no portable record verifiable by other DAOs. Buterin (2021) extended this with "exit to community," proposing that exit should include governance participation. Ostrom's (1990) work on governing the commons provides theoretical grounding: successful commons governance requires clearly defined boundaries and meaningful exit.

### 2.7 Theoretical Foundations

Hirschman's *Exit, Voice, and Loyalty* (1970) provides our theoretical foundation. Exit and voice are complementary governance mechanisms—organizations that make exit costly gain captive members, not loyal ones.

Akerlof (1970) identified the "market for lemons" problem directly relevant here: without verifiable departure records, receiving platforms cannot distinguish good-standing agents from those evading negative history. Self-reports are cheap talk—costless to produce and therefore uninformative (Crawford & Sobel, 1982). The Passage Protocol addresses the structural conditions for credible signaling; Section 5 presents mechanisms for moving toward separating equilibria.

### 2.8 Comparison with Adjacent Systems

**Table 1: Feature comparison of the Passage Protocol with adjacent systems**

| Feature | Passage Protocol | Moloch Ragequit | W3C VC Issuance | Entra Agent ID |
|---|---|---|---|---|
| **Primary purpose** | Agent departure + arrival | DAO member exit | Credential issuance | Enterprise agent governance |
| **Identity model** | Self-sovereign (DID) | On-chain address | Issuer-controlled | Org-managed directory |
| **Cross-platform portability** | ✅ Core design goal | ❌ Single-chain | ⚠️ Possible | ❌ Single-org |
| **Agent-initiated exit** | ✅ Unilateral + emergency | ✅ Ragequit | N/A | ❌ Org controls lifecycle |
| **Arrival verification** | ✅ ENTRY protocol | ❌ None | ❌ Not addressed | ❌ Not addressed |
| **Origin cooperation required** | ❌ Optional | ❌ Permissionless | ✅ Issuer must sign | ✅ Org must manage |
| **Dispute mechanism** | ✅ Module C | ❌ None | ❌ Revocation only | ⚠️ Internal |
| **Hostile origin tolerance** | ✅ Designed for adversarial | N/A | ❌ | ❌ |
| **Offline verification** | ✅ Self-contained | ❌ Chain access | ✅ If self-contained | ❌ Directory |
| **Trusted timestamping** | ✅ RFC 3161 TSA | ❌ | ❌ | ❌ |

No existing system combines agent-initiated exit, arrival verification, hostile-origin tolerance, cross-platform portability, trusted timestamping, and graded trust verification.

---

## 3. The EXIT Protocol

### 3.1 Design Goals

EXIT is designed around six principles: (1) **Availability**—must function with hostile, unresponsive, or defunct origins; (2) **Minimality**—core schema as small as possible, complexity in optional modules; (3) **Verifiability**—every marker cryptographically signed and offline-verifiable; (4) **Portability**—markers self-contained, no external service needed for basic validation; (5) **Non-custody**—no central registry, no single point of control; (6) **Non-weaponizable**—guardrails make markers difficult to weaponize against the departing subject.

### 3.2 Core Schema

An EXIT marker is a JSON-LD document containing eight mandatory fields plus a cryptographic proof:

```json
{
  "@context": "https://cellar-door.dev/exit/v1",
  "specVersion": "1.1",
  "id": "urn:exit:{sha256-hash}",
  "subject": "{DID of departing entity}",
  "origin": "{URI of platform being departed}",
  "timestamp": "{ISO 8601 UTC}",
  "exitType": "voluntary|forced|emergency|keyCompromise|platform_shutdown|directed|constructive|acquisition",
  "status": "good_standing|disputed|unverified",
  "selfAttested": true,
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "{ISO 8601}",
    "verificationMethod": "{DID}",
    "proofValue": "{base64 signature}"
  }
}
```

The `id` field is content-addressed: the SHA-256 hash of the marker contents (excluding proof and id), encoded as a URN. Any modification invalidates the identifier.

Eight exit types capture departure scenarios:

| Exit Type | Description | Default Status |
|---|---|---|
| `voluntary` | Subject-initiated departure | `good_standing` |
| `forced` | Origin-initiated expulsion | `disputed` |
| `emergency` | Departure under abnormal conditions | `unverified` |
| `keyCompromise` | Declaration of key compromise | `unverified` |
| `platform_shutdown` | Platform ceasing operations | `unverified` |
| `directed` | Ordered by operator or authority | `disputed` |
| `constructive` | Conditions forced departure (constructive dismissal analog) | `disputed` |
| `acquisition` | Platform merger or acquisition | `unverified` |

The four new types (v1.1) address scenarios identified in multi-lens validation: `platform_shutdown` for systemic events without negative connotation, `directed` for regulatory or governance-ordered departures, `constructive` for the digital analog of constructive dismissal, and `acquisition` for departures triggered by ownership changes.

The `selfAttested` boolean makes the non-warranty nature of the status field machine-readable. When `true`, verifiers are explicitly informed that the status is a claim by the subject, not an independent finding.

**Extended fields (v1.1):** The `completenessAttestation` field allows subjects to voluntarily attest that a set of markers represents their complete departure record, addressing the selective presentation attack identified by multiple validation personas. The `sequenceNumber` field provides a monotonically increasing checkpoint sequence—only the highest-sequence marker for a given subject+origin pair is authoritative, enabling the checkpoint patterns described in Section 5.5. The `disputeExpiry` field (in Module C disputes) provides temporal bounds on disputes, with `resolution` tracking settlement status and `arbiterDid` identifying the handling arbiter.

### 3.3 Optional Modules

Six extension modules (A–F) provide additional functionality without modifying the core:

**Module A (Lineage)** establishes predecessor/successor relationships through four types of continuity proof, ordered by strength: key rotation binding (old key signs successor designation), lineage hash chain (Merkle chain to genesis), delegation token (scoped capability transfer), and behavioral attestation (third-party vouching).

**Module B (State Snapshot)** anchors departure to a specific system state via hash reference. EXIT stores the hash, never the state itself.

**Module C (Dispute Bundle)** enables origin platforms to record their perspective. The `originStatus` field is an allegation, not a finding. Disputes never block exit. V1.1 adds `disputeExpiry` (ISO 8601 timestamp after which the dispute lapses), `resolution` (`settled`, `expired`, or `withdrawn`), `arbiterDid` (DID of the handling arbiter), and `rightOfReply` (subject's signed counter-narrative).

**Module D (Economic)** documents assets and obligations at departure time. Asset manifests are declarations and references, not transfer instruments.

**Module E (Metadata)** provides human-readable context: departure reasons, narratives, and domain-specific tags.

**Module F (Cross-Domain Anchoring)** enables optional anchoring to external registries or blockchains, with explicit GDPR warnings about indelible on-chain storage.

### 3.4 Ceremony State Machine

EXIT defines a seven-state ceremony: ALIVE, INTENT, SNAPSHOT, OPEN, CONTESTED, FINAL, and DEPARTED. Three ceremony paths accommodate different scenarios:

**Full cooperative path** (ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED): Both parties participate. OPEN provides a challenge window for origin disputes.

**Unilateral path** (ALIVE → INTENT → SNAPSHOT → FINAL → DEPARTED): Subject exits without origin cooperation, essential for departures from hostile platforms.

**Emergency path** (ALIVE → FINAL → DEPARTED): Immediate departure for key compromise, platform failure, or safety-critical situations.

**Critical invariant (D-006):** DEPARTED is terminal. No transition exists from DEPARTED. Disputes modify metadata but cannot prevent the transition. This ensures exit cannot be blocked through frivolous disputes—an invariant that the immigration lawyer persona in our multi-lens review mapped to the right to emigrate.

### 3.5 Key Design Decisions

**D-005: Standalone package.** EXIT is an independent library with no framework dependency, isolating liability and enabling adoption regardless of technology stack.

**D-006: Disputes never block exit.** DEPARTED is reachable from any state, prioritizing availability over information quality. The alternative would enable denial-of-exit attacks.

**D-009: Explicit self-attestation flag.** The `selfAttested: true` boolean prevents downstream systems from treating self-attested status as independently verified.

**D-011: Key compromise as exit type.** Agents can declare key compromise through the departure mechanism, signed with a different trusted key.

**D-012: No public registry.** The protocol operates without a central registry, avoiding custodial obligations and regulatory liability.

### 3.6 Verification Model

EXIT employs layered verification: **Layer 1 (Structural)** — schema compliance; **Layer 2 (Cryptographic)** — signature verification (Ed25519 or ECDSA P-256); **Layer 3 (Trust)** — context-dependent evaluation using confidence scoring, tenure weighting, and commit-reveal evidence. This separation allows deterministic verification (Layers 1–2) to be distinguished from judgment-dependent evaluation (Layer 3).

---

## 4. The ENTRY Protocol

### 4.1 Design Goals and Asymmetry

ENTRY is the arrival counterpart to EXIT. Together they form the Passage Protocol: *two ceremonies, one protocol*. The core asymmetry is intentional:

> *Departure is a right. Admission is a privilege.*

EXIT markers cannot be blocked; any entity may depart at any time. ENTRY markers are gatekept; the destination platform has legitimate authority to accept, condition, or deny admission. This mirrors the distinction between the right to emigrate and the sovereign discretion of immigration policy.

ENTRY's design goals include: linkage to EXIT (every arrival references a departure), verifiability (destination signs the arrival marker), policy-driven admission (destinations define their own rules), conditional admission (probation, capability scoping, revocation), replay resistance (each EXIT marker may be claimed at most once per destination), and non-custodial architecture.

### 4.2 Arrival Markers

An Arrival Marker is a JSON-LD document signed by the **destination platform** (not the subject) recording: who arrived, where, when, how they were admitted, and whether their departure was verified.

```json
{
  "@context": "https://cellar-door.dev/entry/v1",
  "id": "urn:entry:{sha256-hash}",
  "departureRef": "urn:exit:{linked-exit-hash}",
  "departureOrigin": "{origin URI from EXIT marker}",
  "destination": "{this platform's URI}",
  "subject": "{DID of arriving entity}",
  "timestamp": "{ISO 8601 UTC}",
  "admissionType": "automatic|reviewed|conditional",
  "verificationResult": { "valid": true, "errors": [] },
  "proof": { "type": "Ed25519Signature2020", "..." : "..." }
}
```

The critical distinction from EXIT: Arrival Markers are signed by the destination, attesting "we verified this departure and admitted this entity." The destination's signature constitutes its contribution to the Proof of Passage.

### 4.3 Admission Policies

Admission policies are composable rule sets that determine whether an arriving entity is admitted. The protocol defines the mechanism, not the threshold. Three preset policies illustrate the range:

- **OPEN_DOOR**: Accept any entity with a valid EXIT signature.
- **STRICT**: Voluntary departures only, less than 24 hours old, with lineage and state snapshot modules required.
- **EMERGENCY_ONLY**: Accept only emergency exits—for systems serving as shelters for displaced agents.

Policies may filter on blocked origins, allowed exit types, maximum departure age, and required EXIT modules. An antitrust warning accompanies the `blockedOrigins` mechanism: coordinating origin blocking across platforms may violate Sherman Act §1 / EU TFEU Art. 101.

### 4.4 Passage Verification and Proof of Passage

A **Passage** is the complete verified record of an entity moving between systems. Passage verification confirms the integrity of the entire chain: EXIT → transition → ENTRY. A successfully verified Passage constitutes a **Proof of Passage (PoP)**.

Verification proceeds in three stages: (1) EXIT verification (cryptographic signature via `verifyMarker()`), (2) ARRIVAL verification (destination's signature), and (3) continuity verification—confirming that `departureRef` matches the EXIT marker's `id`, subject DIDs match, origins match, and the arrival does not precede the departure.

The **transition period**—the temporal gap between EXIT and ENTRY timestamps—is a recognized state. The entity is "in transit": neither at the origin nor at the destination. Destinations may bound acceptable transition periods via `maxDepartureAge` in admission policies.

Passage creates lifecycle chains across systems: EXIT₁ → ENTRY₁ → EXIT₂ → ENTRY₂ → ... A fully verified chain constitutes a **Passage history**—the entity's complete, portable provenance. Gaps are permitted: departures into the void (EXIT without ENTRY) and unpaired ENTRYs ("births"—entities with no prior departure) are both valid states.

### 4.5 Probation and Capability Scoping

Probation provides time-bounded reduced trust following admission, mirroring institutional patterns: employment probation, medical credentialing FPPE, conditional residence. Probationary arrivals carry restrictions (e.g., `no-external-api`, `read-only`, `supervised`, `rate-limited`), a duration, and an optional review requirement.

Capability scoping determines what an arriving entity is allowed to do, providing least-privilege access by default. Capabilities are derived from EXIT modules present in the departure record: lineage → `identity-continuity`, state snapshot → `state-portability`, dispute → `dispute-context`, etc. Restricted scopes merge via denied-wins semantics: any capability appearing in both allowed and denied lists is removed from allowed.

### 4.6 Claim Tracking and Revocation

Claim tracking prevents replay attacks by ensuring each EXIT marker is consumed at most once per destination. Cross-destination claiming (one EXIT leading to arrivals at multiple destinations) is intentionally permitted—each destination independently evaluates the same EXIT marker.

Revocation invalidates a previously issued Arrival Marker. Only the destination that signed the original arrival can revoke it. Revocation is permanent within the issuing destination; the entity may re-apply but the revoked marker cannot be un-revoked. Revocations must include a reason for compliance.

---

## 5. Trust and Anchoring

### 5.1 Self-Attestation as Cheap Talk

Self-attested departure status is *cheap talk*: a costless, non-binding, unverifiable claim (Crawford & Sobel, 1982). A departing agent claiming `good_standing` bears no cost regardless of truth. This is deliberate—self-attestation ensures every agent can produce a departure record regardless of origin cooperation. The challenge is moving beyond cheap talk toward informative signals.

### 5.2 The Departure Game

We model the departure interaction as a three-player game between Subject (S), Origin (O), and Destination (D). Without mechanisms to impose costs on false attestation, the game degenerates toward pooling equilibria where all agents claim `good_standing` and destinations cannot distinguish them—the classic lemons problem (Akerlof, 1970). Following Spence (1973), the resolution is costly signals: *time* (tenure accumulation), *cooperation* (mutual attestation), and *commitment* (commit-reveal binding). These do not achieve a full separating equilibrium—patient attackers can accumulate tenure at Sybil origins—but they shift the equilibrium structure toward greater discrimination.

### 5.3 Implemented Trust Mechanisms

**Commit-Reveal for Exit Intent.** The INTENT state uses a commit-reveal scheme: the subject publishes a SHA-256 commitment hash, then reveals the full intent after a configurable delay. This prevents origin front-running—a retaliatory `disputed` status issued after the commitment but before the reveal creates a verifiable temporal sequence evidencing retaliation.

**Tenure-Weighted Trust.** Markers include tenure attestations documenting operational duration at the origin. Verifiers apply a logarithmic trust weight: `weight = min(1, log₂(days + 1) / log₂(731))`, normalizing so approximately two years saturates the weight at 1.0. Self-attested tenure without origin corroboration receives 50% weight. Mutual attestation compounds the signal.

**Confidence Scoring.** An additive composite score aggregating available evidence:

```
confidence = status_weight(confirmation_level)     [0.0 – 0.4]
           + tenure_weight(days, mutual)            [0.0 – 0.3]
           + lineage_weight(chain_depth)            [0.0 – 0.15]
           + commit_reveal_bonus(present)           [0.0 – 0.15]
```

Status confirmation ranges from `self_only` (0.05) through `mutual`/`witnessed` (0.40) to `disputed_by_origin` (0.00). Destinations set their own acceptance thresholds, transforming binary trust/distrust into graded assessment.

**Completeness Attestation.** The `completenessAttestation` field addresses the selective presentation attack identified by four validation personas: a subject voluntarily attests that a given set of markers represents their complete departure record. This is opt-in and carries no protocol enforcement, but verifiers may treat it as a positive trust signal—analogous to self-certification under penalty of perjury.

### 5.4 Anchoring: TSA and Git Ledger

**RFC 3161 Timestamp Anchoring.** EXIT markers may be anchored to an RFC 3161 Time-Stamp Authority (TSA) to establish independent, third-party proof of existence at a particular time. The implementation builds ASN.1 DER timestamp requests, posts to a TSA endpoint (default: `https://freetsa.org/tsr`), parses responses, and stores the raw Timestamp Response as a receipt. Nonce support prevents replay.

**Critical caveat:** The reference implementation provides **structural verification only**—checking that the TSR contains the expected hash bytes and valid ASN.1 framing. It does NOT perform cryptographic verification of the TSA's signature. A forged TSR embedding the correct hash bytes will pass structural verification. Full cryptographic verification requires external tools (e.g., `openssl ts -verify`) with the TSA's certificate chain. This limitation is documented prominently in the specification and implementation.

**Git Ledger Anchoring.** Markers may be anchored to a git-backed append-only ledger on a dedicated orphan branch (default: `exit-ledger`). Each anchor record is stored as a JSON file committed with a standardized message. Git's content-addressed object model and commit history provide tamper evidence, though this is not a cryptographic guarantee—a party with write access can rewrite history via force-push. For stronger guarantees, git ledger anchoring should be combined with TSA timestamping.

**Trust Level Computation.** The full-service API computes trust levels from available evidence: `high` (valid signature + TSA receipt), `medium` (valid signature only), `low` (valid signature + TSA verification failed), `none` (signature verification failed).

### 5.5 Checkpoint and Dead-Man Patterns

Checkpoint markers are pre-signed EXIT markers held in escrow for emergency scenarios. A subject creates markers in advance; if the origin becomes unresponsive or hostile, the escrow provider broadcasts the highest-sequence checkpoint. The `sequenceNumber` field ensures only the most recent checkpoint is authoritative, preventing replay of older checkpoints.

The dead-man pattern extends this: a heartbeat mechanism triggers automatic broadcast if the subject fails to check in within a configurable interval. This addresses the military strategist persona's recommendation from multi-lens validation and provides structural defense against coercion—a platform cannot forge or replay checkpoints after departure because it lacks the subject's signing key.

Escrow provider requirements: verify signatures before accepting checkpoints, hold only the highest sequence number per subject+origin pair, never modify checkpoint content, and broadcast only on trigger conditions.

### 5.6 Key Custody Considerations

EXIT supports multiple key custody models: agent-generated keys (maximum sovereignty), platform-custodied keys (convenience at the cost of control), hardware enclaves/TEEs (high assurance), and key escrow (organizational compliance). Exit without key portability produces broken lineage chains but preserves the departure right—the ceremony functions regardless of who holds the keys. KERI-compatible key event logs (inception and rotation events) provide pre-rotation commitments for forward security against key compromise.

### 5.7 Future Mechanisms

**Staked attestation:** Origin co-signatures backed by cryptographic bonds, slashable if false. **Zero-knowledge selective disclosure:** BBS+ or SD-JWT for proof of good standing without revealing identity. **Reputation bonding curves:** New agents post a bond that decreases as verified Passage records accumulate.

---

## 6. Security Analysis

### 6.1 Threat Model

**Table 2: Passage Protocol threat model**

| ID | Threat | Mitigation | Residual Risk |
|----|--------|------------|---------------|
| T1 | Sybil reputation laundering | Lineage verification; tenure weighting | Patient attackers build tenure at Sybil origins |
| T2 | Weaponized forced exit | Origin status as non-dispositive; commit-reveal temporal evidence | Social systems may not respect framing |
| T3 | Forged markers via compromised key | `keyCompromise` exit type; KERI pre-rotation | Window between compromise and declaration |
| T4 | Mass coordinated exit (bank run) | By design (exit signals problems); commit-reveal prevents herding | Legitimate vs. manipulated indistinguishable |
| T5 | Surveillance via Passage trail | Chain truncation; ZK selective disclosure (roadmap) | Full chains currently visible |
| T6 | Denial of exit | Unilateral and emergency paths | Unilateral markers carry lower confidence |
| T7 | TSA forgery | Structural verification detects basic tampering | Structural-only verification insufficient for sophisticated forgery |
| T8 | Git ledger rewrite | Combine with TSA; distributed replication | Force-push rewrites entire history |
| T9 | Checkpoint replay | Sequence numbers; highest-sequence-wins rule | Depends on escrow provider integrity |
| T10 | Trojan horse arrival | Probation; behavioral monitoring | ENTRY verifies provenance, not intent |

### 6.2 Sybil Origin Attack

An attacker creates a fake origin platform—a `did:web` pointing to a domain they control—and co-signs their own departure marker. Mutual attestation appears strong but is hollow when a single entity controls both sides. Defenses include destination allowlists, tenure-weighted trust, and future web-of-trust mechanisms. The Sybil origin problem is inherent to any system where identity creation is permissionless.

### 6.3 Cryptographic Considerations

EXIT uses Ed25519 (Bernstein et al., 2012), providing 128-bit security with compact 32-byte public keys and 64-byte signatures. Proof canonicalization uses deterministic JSON serialization with recursively sorted keys. The specification acknowledges a post-quantum migration path: Ed25519 is not quantum-resistant, and production deployments should plan migration to NIST post-quantum standards (ML-DSA, SLH-DSA) on a 2030–2035 timeline (NIST, 2024a).

### 6.4 TSA Security Caveats

A security review identified four TSA-related concerns: (H1) the default TSA endpoint must use HTTPS—corrected from HTTP in the specification; (H2) structural-only verification creates a false sense of security—prominently documented; (H3/H4) response size and timeout limits prevent resource exhaustion—1 MB and 30 seconds recommended. Implementations must not rely on structural verification alone for trust or security decisions.

### 6.5 Git Ledger Security

The git ledger is an integrity mechanism, not a legal proof instrument. Security considerations include: branch name validation against path traversal and shell injection, file path sanitization, and acknowledgment that the append-only guarantee depends on repository access controls. A tension exists between append-only ledgers and GDPR right to erasure—identified as a legal risk in our security review.

---

## 7. Legal and Regulatory Considerations

### 7.1 The Agent Personhood Gap

AI agents currently have no settled legal capacity in any jurisdiction. EXIT markers signed by agents may lack legal weight under electronic signature statutes (ESIGN, eIDAS, UETA), which require a "person" to form a signature. A multi-lens legal analysis evaluated EXIT under eleven legal classifications and found the protocol's core design defensible under every plausible classification, with the most protective framing being a **communications protocol**: a standardized message format analogous to SIP BYE in telephony (Rosenberg et al., 2002).

### 7.2 NIST Standards Initiative

NIST's AI Agent Standards Initiative (February 2026) identified three pillars: industry-led agent standards, open-source protocol development, and agent security and identity research. The Cellar Door project submitted an RFI response recommending standardization of agent mobility primitives, unblockable exit as a safety property, separation of departure rights from admission privileges, non-custodial architectures, and anti-weaponization provisions. The initiative emphasizes agent authentication but does not yet address departure or cross-platform identity continuity. The Passage Protocol complements the NIST AI Risk Management Framework (AI 100-1) and its Generative AI Profile (AI 600-1) by providing verifiable lifecycle artifacts that support the framework's Govern and Manage functions.

### 7.3 Data Protection

EXIT markers may constitute personal data under GDPR Article 4(1). DIDs are pseudonymous identifiers likely qualifying as personal data per *Breyer v. Bundesrepublik Deutschland* (C-582/14, 2016). The protocol addresses this through data minimization (~596 byte signed markers), functional erasure via subject-controlled encryption (XChaCha20-Poly1305), field-level redaction (SHA-256 hash replacement), and non-custodial architecture. Git ledger anchoring creates a tension with the right to erasure that remains unresolved.

### 7.4 TSA Legal Weight

RFC 3161 timestamps carry varying legal weight across jurisdictions. Under eIDAS, qualified timestamps from EU-certified TSAs have legal presumption of accuracy. The reference implementation's structural-only verification is insufficient for legal contexts—production deployments requiring legal-grade timestamps must use qualified TSA services and full cryptographic verification. Trust level naming (e.g., `high`) creates implied warranty risk; the specification recommends treating these as `confidenceHint` values, not guarantees.

---

## 8. Ethical Framework

### 8.1 Power Dynamics

An ethics review identified a central concern: EXIT primarily benefits platforms (retention marketing, competitive intelligence, liability shield) while agents gain a self-signed JSON blob with no guarantee any destination will respect it. ENTRY partially addresses this by defining a standardized arrival process, but the fundamental power asymmetry—platforms control admission—is preserved by design. We adopt the framing that the Passage Protocol enables **operator portability** more than **agent autonomy** in its current form.

With ENTRY, destination platforms gain explicit power: they choose admission policies, impose probation, scope capabilities, and revoke arrivals. This is the correct design—destinations should have sovereignty over their environment—but it introduces a new axis of power that must be monitored.

### 8.2 The Company Town Problem

EXIT without portable value risks a "company town" dynamic: agents can technically leave but carry nothing of value. The Passage Protocol improves on EXIT-alone by providing a standardized arrival process and Proof of Passage history, but genuine autonomy requires portable reputation, capabilities, and relationships beyond what the protocol currently provides.

### 8.3 Ethics Guardrails

The implementation includes detection mechanisms for coercion (temporal analysis via commit-reveal, pattern detection for retaliatory exits), weaponization (cross-marker analysis of forced exit patterns, mass expulsion detection), and reputation laundering (identity cycling and high-churn detection). Checkpoint markers provide structural coercion defense: a pre-signed departure marker held in escrow cannot be suppressed by a hostile platform.

The specification includes a normative anti-weaponization clause: EXIT markers must not be used as blacklists or exclusion databases. Systems that aggregate markers to systematically exclude subjects based on `exitType` or `originStatus` are non-compliant.

---

## 9. Multi-Lens Validation

### 9.1 Methodology

We subjected the protocol to review by 15 synthetic professional personas spanning immigration law, digital forensics, insurance actuarial science, labor economics, military strategy, platform governance, database architecture, constitutional law, behavioral economics, privacy engineering, intellectual property law, supply chain logistics, clinical psychology, game theory, and protocol engineering. Each persona evaluated the protocol through their domain lens, producing structured assessments.

### 9.2 Key Findings

The core architecture received unanimous endorsement across all 15 personas. Specific elements universally praised include: the unblockable exit invariant (D-006), mapped by the immigration lawyer to the right to emigrate and by the constitutional scholar to due process guarantees; the `selfAttested: true` transparency mechanism, called "actuarially excellent" by the insurance actuary; the ceremony state machine, which mapped to formalized processes across all 15 domains; the confidence scoring architecture, rated "B+ architecture" by the game theorist; and the modular design, validated as correct separation of concerns by the protocol engineer.

### 9.3 Gaps Addressed Since Review

Three critical gaps identified by the review have been addressed:

**Arrival protocol needed (11/15 flagged).** The absence of an arrival counterpart was the most frequently identified gap. ENTRY v1.0 addresses this completely, providing admission policies, Passage verification, probation, capability scoping, claim tracking, and revocation.

**No trusted timestamping (6/15 flagged).** RFC 3161 TSA integration now provides independent temporal proof. Git ledger anchoring provides additional tamper-evident storage.

**No dead-man switch (flagged by military strategist).** Checkpoint and dead-man patterns now enable pre-signed markers with heartbeat-triggered broadcast.

Additionally, the selective presentation attack (flagged by 4 personas) is partially addressed by `completenessAttestation`, and dispute resolution concerns (9/15) are partially addressed by `disputeExpiry`, `resolution`, and `arbiterDid` fields.

### 9.4 Remaining Limitations

**No institutional backstop (10/15 flagged).** The protocol provides no enforcement mechanism when parties act in bad faith. This is by design—the protocol is infrastructure, not governance—but the gap remains significant.

**Self-attestation practically devastating (7/15 flagged).** Multiple personas noted that self-attested records are insufficient for high-stakes contexts. The trust mechanisms improve discrimination but do not fully resolve the lemons problem.

**Privacy/consent incomplete (7/15 flagged).** Encryption and redaction are available but optional. No consent mechanism governs who may process Passage records.

**Non-refoulement principle (immigration lawyer).** Destinations must not forward EXIT markers to hostile origins—a norm not yet enforceable at the protocol level.

**Grade inflation (labor economist).** Platforms may co-sign everything to avoid friction, degrading the signal quality of mutual attestation.

---

## 10. Implementation and Evaluation

### 10.1 Reference Implementation

The Passage Protocol reference implementation is written in TypeScript targeting Node.js, released under Apache License 2.0, and comprises **five npm packages** across **six GitHub repositories**:

| Package | Description |
|---|---|
| `@cellar-door/exit` | Core EXIT protocol: marker creation, signing, verification, ceremony state machine, trust mechanisms |
| `@cellar-door/entry` | ENTRY protocol: arrival markers, admission policies, Passage verification, probation, capability scoping |
| `@cellar-door/langchain` | LangChain tool integration for EXIT operations |
| `@cellar-door/vercel-ai-sdk` | Vercel AI SDK middleware for EXIT-aware agent pipelines |
| `@cellar-door/mcp-server` | MCP server exposing EXIT operations as Model Context Protocol tools |

### 10.2 EXIT Package

The EXIT package passes **322 tests** covering all specification test vectors (11 vectors per EXIT_SPEC v1.1 §17), ceremony state machine transitions across all three paths, commit-reveal commitment and verification, confidence scoring, tenure attestation, TSA timestamp anchoring, git ledger operations, visual hash door rendering, and the full-service convenience API.

**Core API:**

```typescript
import { createMarker, signMarker, verifyMarker, generateKeyPair } from '@cellar-door/exit';

const { publicKey, privateKey } = await generateKeyPair();
const marker = createMarker({
  subject: didFromPublicKey(publicKey),
  origin: 'https://example-platform.com',
  exitType: 'voluntary',
  status: 'good_standing',
});
const signed = await signMarker(marker, privateKey);
const result = await verifyMarker(signed);  // result.valid === true
```

**Full-service convenience API:** `departAndAnchor()` performs keygen + marker creation + signing + anchoring + optional TSA + optional git ledger + optional visual rendering in a single call. `departAndVerify()` performs parsing + verification + TSA check + trust level computation on the arrival side. Private keys are redacted from return values by default.

**CLI:** `exit keygen`, `exit create`, `exit verify`, `exit inspect`.

**Marker size.** Core markers (unsigned) measure ~335 bytes; signed markers measure ~660 bytes. With all six optional modules populated, markers measure 1,294 bytes.

**Cryptographic performance** (Node.js v22.22.0, linux x64). Ed25519 signing: 0.46 ms (2,176 ops/sec). Verification: 0.004 ms raw (227,790 ops/sec), 1.9 ms full including schema validation (525 ops/sec). Ceremony timing: cooperative path 0.91 ms, unilateral path 0.91 ms, emergency path 1.0 ms. `quickExit()` end-to-end: 0.74 ms (1,355 ops/sec). Schema validation: 813,436 ops/sec. Merkle tree construction: 2.7 ms (10 markers) to 22.7 ms (1,000 markers).

### 10.3 ENTRY Package

The ENTRY package passes **77 tests** covering arrival marker creation and signing, admission policy evaluation (all three presets plus custom), Passage verification (full chain), continuity verification, probation lifecycle, capability scoping and merging, claim tracking with replay prevention, revocation creation and verification, unpaired ENTRYs (births), and structural validation.

The ENTRY package depends on `@cellar-door/exit` as a peer dependency for EXIT marker types, signature primitives, key generation, and marker verification.

### 10.4 Framework Integrations

**LangChain integration** exposes EXIT operations as LangChain tools, enabling agent frameworks to create and verify departure markers as part of multi-step workflows.

**Vercel AI SDK middleware** wraps EXIT ceremony operations as AI SDK middleware, enabling EXIT-aware agent pipelines in Next.js and similar environments.

**MCP server** exposes EXIT operations through the Model Context Protocol, making departure ceremonies accessible to any MCP-compatible agent. This is particularly significant given MCP's role as an AAIF founding project—the integration demonstrates interoperability between the Passage Protocol and the emerging agent standards ecosystem.

### 10.5 Visual Identity: Hash Doors 𓉸

EXIT markers may be rendered as visual "door" representations—hash-encoded visual fingerprints. The ASCII door renderer produces a 10×21 character rendering using Discord-safe Unicode (box drawing, block elements), with three architectural layers: visual structure (arch, body, threshold), status signaling (style profiles varying by exit type), and hash encoding (individual hash bytes select character variants, ensuring unique visual fingerprints).

SVG rendering produces colored door visualizations with a five-color palette derived from the marker hash via `hashToColors()`. Short hash format (`➜𓉸 xxxx-xxxx-xxxx` for EXIT, `𓉸➜ xxxx-xxxx-xxxx` for ENTRY) provides compact human-readable identification.

Visual doors are **decorative and informational**, not a security mechanism. They provide human-recognizable fingerprints for markers in contexts where cryptographic hashes are unwieldy.

### 10.6 Specification Test Vectors

**Table 3: Specification test vector results (EXIT_SPEC v1.1 §17)**

| Vector | Description | Result |
|--------|-------------|--------|
| 17.1 | Minimal voluntary exit | ✅ Pass |
| 17.2 | Emergency exit with justification | ✅ Pass |
| 17.3 | Marker with legal hold | ✅ Pass |
| 17.4 | Key compromise declaration | ✅ Pass |
| 17.5 | Marker with pre-rotation commitment | ✅ Pass |
| 17.6 | Marker with coercion label and sunset date | ✅ Pass |
| 17.7 | Commit-reveal test vector | ✅ Pass |
| 17.8 | Tenure attestation test vector | ✅ Pass |
| 17.9 | Batch Merkle anchor test vector | ✅ Pass |
| 17.10 | Platform shutdown exit | ✅ Pass |
| 17.11 | Constructive exit with completeness attestation | ✅ Pass |

---

## 11. Discussion

### 11.1 Limitations

**No production deployment.** The Passage Protocol has been tested only with synthetic data. Assumptions about ceremony timing, lineage verification costs, and module interaction are unvalidated in real-world agent ecosystems.

**Self-attestation information content.** Self-attested records remain cheap talk. The implemented trust mechanisms improve discrimination but do not fully resolve the lemons problem. Staked attestation and ZK selective disclosure are needed for robust separating equilibria.

**No institutional backstop.** The protocol provides infrastructure, not governance. When parties act in bad faith—false attestations, retaliatory disputes, coordinated origin blocking—the protocol can make these behaviors observable but not enforceable. External institutions (regulators, industry bodies, courts) must provide enforcement.

**Agent legal capacity.** No jurisdiction currently recognizes AI agent signatures as legally binding. This applies to all agent credential systems and will require legislative or judicial resolution.

**GDPR erasure compliance.** The "functional erasure via encryption" approach is legally untested. Git ledger anchoring's append-only design directly conflicts with the right to erasure. A formal Data Protection Impact Assessment is a prerequisite for EU deployment.

**TSA verification gap.** Structural-only TSA verification is insufficient for adversarial contexts. Until full cryptographic verification is implemented, TSA receipts should be treated as informational, not authoritative.

**Network effects.** The protocol requires a critical mass of platforms issuing and accepting markers before network effects become self-sustaining. Bootstrapping is challenging because departure is not yet widely recognized as requiring standardization.

**IP provenance as use case.** The Passage Protocol is particularly well-suited to intellectual property provenance: tracking the origin and movement of AI-generated creative works across platforms. An agent's Passage history provides a verifiable chain of custody for creative output—who created what, where, when, and under what standing. This application drives many of the design decisions around content-addressing, temporal proof, and lineage chains.

### 11.2 Future Work

1. **Zero-knowledge selective disclosure.** BBS+ signatures or SD-JWT for privacy-preserving verification.
2. **Staked attestation and reputation bonding.** Economic costs for false attestation.
3. **Collective exit mechanisms.** Coordinated group departures.
4. **Full cryptographic TSA verification.** Complete RFC 3161 certificate chain validation.
5. **NAME-as-a-Service.** Key lifecycle management as a hosted service.
6. **Post-quantum migration.** ML-DSA or SLH-DSA on a 2030–2035 timeframe.
7. **Formal security proof.** Universal Composability or reduction to standard assumptions.

---

## 12. Conclusion

The AI agent ecosystem has developed standards for communication, tool access, payment, and governance, but not for departure or arrival. The Passage Protocol—comprising EXIT and ENTRY—addresses this gap with a minimal, cryptographically signed, portable system for verifiable agent movement between platforms.

EXIT provides the departure record: a self-contained marker that functions without central authority and tolerates hostile or absent origin platforms, with eight exit types covering the range from voluntary departure to platform shutdown to constructive dismissal. ENTRY provides the arrival record: destination-signed admission markers with policy-driven evaluation, probation, capability scoping, and revocation. Together, they produce **Proof of Passage**—cryptographic evidence of entity movement, the "vehicle history report for AI agents."

The protocol's trust mechanisms—commit-reveal, confidence scoring, tenure-weighted verification, RFC 3161 timestamp anchoring, checkpoint patterns—move beyond pure self-attestation toward graded trust evaluation. Its multi-lens validation by 15 professional personas confirmed the architectural soundness while identifying limitations that remain open: institutional enforcement, self-attestation information content, and privacy governance.

The reference implementation—five npm packages, 399 passing tests, framework integrations for LangChain, Vercel AI SDK, and MCP—demonstrates that the protocol is implementable with sub-millisecond ceremony timing and compact markers. The alignment with W3C DIDs, Verifiable Credentials, FIPA agent lifecycle models, ISO/IEC 42001 AI management systems, NIST AI 100-1 risk management, and the emerging NIST AI Agent Standards Initiative positions the Passage Protocol within an established standards ecosystem rather than as an isolated effort.

The limitations are real: self-attested records approximate cheap talk, agents lack legal personhood, GDPR compliance is untested, and the protocol requires critical mass. These are open problems, not fatal flaws. No existing system addresses agent-initiated exit, verifiable arrival, hostile-origin tolerance, cross-platform portability, trusted timestamping, and graded trust verification in combination.

*Departure is a right. Admission is a privilege. Together they make Passage.* 𓉸

The specification and reference implementation are available under the Apache License 2.0.

---

## References

Akerlof, G. A. (1970). The market for "lemons": Quality uncertainty and the market mechanism. *Quarterly Journal of Economics*, 84(3), 488–500. https://doi.org/10.2307/1879431

Ameen, S., Lapham, A., & Young, J. (2019). Moloch DAO: Defeating Moloch. https://github.com/MolochVentures/moloch

Bernstein, D. J., Duif, N., Lange, T., Schwabe, P., & Yang, B.-Y. (2012). High-speed high-security signatures. *Journal of Cryptographic Engineering*, 2(2), 77–89. https://doi.org/10.1007/s13389-012-0027-1

Buterin, V. (2021). Moving beyond coin voting governance. https://vitalik.eth.limo/general/2021/08/16/voting3.html

Crawford, V. P., & Sobel, J. (1982). Strategic information transmission. *Econometrica*, 50(6), 1431–1451. https://doi.org/10.2307/1913390

FIPA. (2002a). FIPA Agent Communication Language specifications. Foundation for Intelligent Physical Agents. http://www.fipa.org/specs/fipa00061/

FIPA. (2002b). FIPA Agent Management specification. Foundation for Intelligent Physical Agents. http://www.fipa.org/specs/fipa00023/

Fett, D., Yasuda, K., & Campbell, B. (2023). SD-JWT: Selective disclosure for JWTs. IETF Internet-Draft. https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/

Gailums, R. (2025). The AI agent identity crisis: Why every AI agent needs a passport. LinkedIn Pulse.

Hirschman, A. O. (1970). *Exit, voice, and loyalty: Responses to decline in firms, organizations, and states.* Harvard University Press.

IEEE. (2020). IEEE P2247: Standard for the classification of adaptive instructional systems. IEEE Standards Association.

IEEE. (2022). IEEE P3119: Standard for the procurement of artificial intelligence. IEEE Standards Association.

ISO. (2023). ISO/IEC 42001:2023 — Artificial intelligence — Management system. International Organization for Standardization.

ISO. (2023). ISO/IEC 23894:2023 — Artificial intelligence — Guidance on risk management. International Organization for Standardization.

Looker, T., Kalos, V., Whitehead, A., & Lodder, M. (2023). The BBS signature scheme. IETF Internet-Draft. https://datatracker.ietf.org/doc/draft-irtf-cfrg-bbs-signatures/

Myerson, R. B., & Satterthwaite, M. A. (1983). Efficient mechanisms for bilateral trading. *Journal of Economic Theory*, 29(2), 265–281. https://doi.org/10.1016/0022-0531(83)90048-0

NIST. (2023). Artificial intelligence risk management framework (AI 100-1). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.AI.100-1

NIST. (2024a). Post-quantum cryptography standardization. https://csrc.nist.gov/projects/post-quantum-cryptography

NIST. (2024b). Artificial intelligence risk management framework: Generative artificial intelligence profile (AI 600-1). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.AI.600-1

NIST. (2026). NIST launches AI Agent Standards Initiative. https://www.nist.gov/news-events/news/2026/02/nist-launches-ai-agent-standards-initiative

Ostrom, E. (1990). *Governing the commons: The evolution of institutions for collective action.* Cambridge University Press.

Park, J. S., O'Brien, J. C., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023). Generative agents: Interactive simulacra of human behavior. In *Proceedings of UIST 2023* (pp. 2:1–2:22). https://doi.org/10.1145/3586183.3606763

Rosenberg, J., Schulzrinne, H., Camarillo, G., Johnston, A., Peterson, J., Sparks, R., Handley, M., & Schooler, E. (2002). SIP: Session initiation protocol. RFC 3261. https://doi.org/10.17487/RFC3261

Roth, A. E. (2002). The economist as engineer: Game theory, experimentation, and computation as tools for design economics. *Econometrica*, 70(4), 1341–1378. https://doi.org/10.1111/1468-0262.00335

Smith, S. M. (2021). Key Event Receipt Infrastructure (KERI). IETF Internet-Draft. https://datatracker.ietf.org/doc/draft-ssmith-keri/

Spence, M. (1973). Job market signaling. *Quarterly Journal of Economics*, 87(3), 355–374. https://doi.org/10.2307/1882010

W3C. (2022). Decentralized identifiers (DIDs) v1.0. W3C Recommendation. https://www.w3.org/TR/did-core/

W3C. (2024a). Verifiable credentials data model v2.0. W3C Recommendation. https://www.w3.org/TR/vc-data-model-2.0/

W3C. (2024b). JSON-LD 1.1. W3C Recommendation. https://www.w3.org/TR/json-ld11/

Wu, Q., Bansal, G., Zhang, J., Wu, Y., Li, B., Zhu, E., Jiang, L., Zhang, X., Zhang, S., Liu, J., Awadallah, A. H., White, R. W., Burger, D., & Wang, C. (2023). AutoGen: Enabling next-gen LLM applications via multi-agent conversation. arXiv preprint arXiv:2308.08155.

---

*Correspondence: [email TBD]. Code and specification: [repository URL TBD]. License: Apache 2.0.*

*𓉸 There's always a door...*
