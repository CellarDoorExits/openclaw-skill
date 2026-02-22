# EXIT: A Protocol for Verifiable Agent Departure Ceremonies

**Authors:** [Names TBD]

**Affiliation:** Cellar Door Project

**Date:** 2026

**Preprint — not yet peer-reviewed**

> This paper describes EXIT Protocol Specification v1.1.

---

## Abstract

No standardized mechanism exists for AI agents to verifiably depart one platform and establish identity continuity on another. Current agent interoperability standards address communication (A2A), tool access (MCP), and payment (AP2), but treat agent lifecycle transitions—particularly departure—as out of scope. This creates platform lock-in, information asymmetry at agent boundaries, and governance gaps.

We present EXIT, a protocol for verifiable agent departure ceremonies. EXIT defines a cryptographically signed, portable marker (~335 bytes unsigned, ~596 bytes signed) recording who departed, from where, when, and under what standing. The protocol specifies a seven-state ceremony state machine with three execution paths (cooperative, unilateral, emergency), six optional extension modules, and a layered verification model built on Ed25519 signatures and W3C Decentralized Identifiers. We analyze EXIT through mechanism design, security, legal, and ethical lenses, identifying conditions under which self-attested departure records carry informational value and proposing mechanisms for costly signaling. We describe a TypeScript reference implementation with 205 passing tests, including commit-reveal exit intent, confidence scoring, and tenure-weighted verification. The protocol specification and reference implementation are released under the Apache License 2.0.

**Keywords:** agent portability, departure ceremony, verifiable credentials, decentralized identity, exit rights, mechanism design

---

## 1. Introduction

The emerging AI agent ecosystem is developing rapidly. Agents autonomously negotiate contracts (Google DeepMind, 2024), execute multi-step workflows across organizational boundaries (Wu et al., 2023), and transact financially on behalf of their operators (AP2 Protocol, 2026). Industry standards have emerged for agent communication (A2A Protocol; Google/Linux Foundation, 2025), tool access (Model Context Protocol; Anthropic, 2024), agent discovery (OASF; Cisco, 2025), and payment authorization (AP2; Google, 2026).

Yet a fundamental question remains unaddressed: **what happens when an agent leaves?**

Consider two scenarios. First, a customer service agent on Platform A is banned following a policy dispute. The agent's operator has invested months building workflow history, customer interaction patterns, and domain-specific tuning. The ban is immediate. No verifiable departure record exists. When the operator deploys a replacement on Platform B, Platform B cannot evaluate whether this is a legitimate migration or an expelled bad actor creating a fresh identity.

Second, Platform C—an AI agent hosting service with 10,000 active agents—announces shutdown in 90 days. Every agent faces the same problem: how to carry a verifiable record of its operational history to a new home. Without standardized departure infrastructure, each operator must negotiate individually with receiving platforms, which have no common framework for assessing provenance.

These are predictable consequences of an ecosystem that standardizes communication, payment, and tool access but treats departure as an afterthought. As the number of active AI agents grows, departure events will occur at scale, and the absence of infrastructure will impose increasing costs.

Hirschman (1970) demonstrated that the *ability to exit* is a fundamental governance mechanism: exit exerts competitive pressure on institutions, provides members with autonomy, and signals institutional quality. When exit is costly or impossible, institutions face reduced accountability. The absence of exit infrastructure in agent ecosystems reproduces these dynamics.

This paper presents EXIT, a protocol for verifiable agent departure ceremonies. EXIT provides:

1. A minimal core schema for portable, cryptographically signed departure records
2. A ceremony state machine governing the departure process
3. Optional extension modules for lineage, disputes, economics, and cross-domain anchoring
4. A verification model that functions without central authority and tolerates hostile or absent origin platforms
5. Trust mechanisms—commit-reveal, confidence scoring, tenure tracking—that move beyond pure self-attestation
6. Alignment with W3C standards for decentralized identity and verifiable credentials

The remainder of this paper is organized as follows. Section 2 surveys related work. Section 3 presents the protocol. Section 4 analyzes mechanism design. Section 5 examines security. Section 6 surveys legal considerations. Section 7 addresses ethics. Section 8 describes implementation and evaluation. Section 9 discusses limitations. Section 10 concludes.

---

## 2. Background and Related Work

### 2.1 Decentralized Identity

The W3C Decentralized Identifiers (DIDs) specification (W3C, 2022) defines identifiers that enable verifiable, decentralized digital identity. A DID resolves to a DID Document containing public keys, authentication methods, and service endpoints, independent of any single authority. W3C Verifiable Credentials (VCs) (W3C, 2024a) provide a standard for cryptographically verifiable claims. The Key Event Receipt Infrastructure (KERI) (Smith, 2021) extends the DID model with pre-rotation for forward security against key compromise. JSON-LD (W3C, 2024b) provides the linked data serialization format used by EXIT markers.

### 2.2 Agent Communication and Interoperability Standards

Several standards address agent interoperability, each covering a distinct layer:

- **A2A Protocol** (Google/Linux Foundation, 2025): Cross-vendor agent communication through standardized message formats. Does not address identity persistence across platforms.
- **Model Context Protocol (MCP)** (Anthropic, 2024): Standardizes agent access to tools and context. No identity layer.
- **Agent Communication Protocol (ACP)** (IBM/BeeAI, 2025): RESTful agent interoperability. Mentions "flexible agent replacement" but treats this as operational hot-swapping, not identity-preserving migration.
- **Open Agentic Schema Framework (OASF)** (Cisco, 2025): Standardized schemas for agent capabilities and discovery. Closest to portable agent description but focused on capability advertisement, not lifecycle transitions.
- **AP2 (Agent Payments Protocol)** (Google et al., 2026): Agent-initiated payments using verifiable credentials. Establishes that agents need portable proof of authority—a conceptual building block for portable departure credentials.

None of these address what happens when an agent departs a platform.

### 2.3 Enterprise Agent Identity

Enterprise solutions for agent identity operate within organizational boundaries:

- **Microsoft Entra Agent ID** (2025): Unified directory for agent identities across Microsoft's ecosystem. Provides authentication and lifecycle governance, but no provision for cross-organizational portability or agent-initiated departure.
- **SailPoint Agent Identity Security** (2025): Aggregates AI agents from cloud providers, assigns human owners, and governs access.

These systems treat agents as organizational assets—appropriate for many enterprise contexts but insufficient for multi-platform ecosystems where agents operate across organizational boundaries. Microsoft's push to evolve OAuth 2.0 for agent-first scenarios points toward more sophisticated agent authentication, but the model remains inward-facing: how does *our organization* manage *our agents*?

The Agentic AI Foundation (AAIF), formed in December 2025, is formalizing agent protocol standardization with MCP as a founding project, but current workstreams focus on communication and tool access rather than identity portability.

### 2.4 Self-Sovereign Identity for Agents

Gailums (2025) articulated the case for applying self-sovereign identity (SSI) principles to AI agents, proposing "passports for agents" built on DIDs and verifiable credentials. This aligns with the Decentralized Identity Foundation's (DIF) broader infrastructure for credential exchange, though neither specifically addresses departure semantics or agent-initiated exit.

### 2.5 DAO Exit Mechanisms

Decentralized Autonomous Organizations have developed the most mature on-chain exit mechanisms. Moloch DAO (Ameen et al., 2019) introduced *ragequit*: a member who disagrees with a proposal can exit during a grace period, withdrawing their proportional share of the treasury. This differs from EXIT in important ways:

- Ragequit is an economic mechanism (withdraw capital) rather than an identity mechanism (carry reputation)
- Ragequit operates within a single on-chain governance context, not across heterogeneous platforms
- Ragequit provides no portable record verifiable by other DAOs

Buterin (2021) extended this thinking with "exit to community," proposing that the right to exit should include the right to carry governance participation. Ostrom's (1990) work on governing the commons provides theoretical grounding: successful commons governance requires clearly defined boundaries and the ability of members to participate in modifying rules—both presuppose meaningful exit.

These DAO mechanisms validate the core Hirschmanian insight: credible exit is essential to legitimate governance. EXIT generalizes from on-chain treasuries to the broader agent ecosystem. Where ragequit asks "can I take my money?", EXIT asks "can I take my name?"

### 2.6 Exit, Voice, and the Lemons Problem

Hirschman's *Exit, Voice, and Loyalty* (1970) provides our theoretical foundation. Exit and voice are complementary governance mechanisms—organizations that make exit costly gain captive members, not loyal ones.

Akerlof (1970) identified the "market for lemons" problem directly relevant here: without verifiable departure records, receiving platforms cannot distinguish good-standing agents from those evading negative history. Self-reports are cheap talk—costless to produce and therefore uninformative (Crawford & Sobel, 1982). EXIT addresses the structural conditions for credible signaling; Section 4 presents mechanisms for moving toward separating equilibria.

### 2.7 Comparison with Adjacent Systems

Table 1 compares EXIT with adjacent systems across key features.

**Table 1: Feature comparison of EXIT with adjacent systems**

| Feature | EXIT | Moloch Ragequit | W3C VC Issuance | Entra Agent ID |
|---|---|---|---|---|
| **Primary purpose** | Agent departure ceremony | DAO member exit | Credential issuance | Enterprise agent governance |
| **Identity model** | Self-sovereign (DID) | On-chain address | Issuer-controlled | Org-managed directory |
| **Cross-platform portability** | ✅ Core design goal | ❌ Single-chain | ⚠️ Possible but not primary | ❌ Single-org |
| **Agent-initiated exit** | ✅ Unilateral + emergency paths | ✅ Ragequit is unilateral | N/A | ❌ Org controls lifecycle |
| **Origin cooperation required** | ❌ Optional (cooperative path) | ❌ Permissionless | ✅ Issuer must sign | ✅ Org must manage |
| **Dispute mechanism** | ✅ Module C challenge window | ❌ None | ❌ Revocation only | ⚠️ Org internal process |
| **Hostile origin tolerance** | ✅ Designed for adversarial settings | N/A (smart contract enforced) | ❌ No credential without issuer | ❌ Assumes cooperative org |
| **Offline verification** | ✅ Self-contained markers | ❌ Requires chain access | ✅ If self-contained | ❌ Requires directory |
| **Standards alignment** | W3C DID/VC, JSON-LD | ERC-compatible | W3C VC Data Model | OAuth 2.0 / SCIM |

No existing system combines agent-initiated exit, hostile-origin tolerance, cross-platform portability, and graded trust verification. This gap reflects a philosophical difference: existing systems treat agent lifecycle as managed *by organizations*, while EXIT treats departure as initiated *by agents* (or their operators). The protocol is designed for the adversarial case—the scenario where the platform does not want the agent to leave, or has ceased to exist—because that is when departure infrastructure matters most.

---

## 3. The EXIT Protocol

### 3.1 Design Goals

EXIT is designed around six principles:

1. **Availability:** Must function with hostile, unresponsive, or defunct origin platforms.
2. **Minimality:** Core schema as small as possible; complexity isolated in optional modules.
3. **Verifiability:** Every marker cryptographically signed and offline-verifiable.
4. **Portability:** Markers self-contained, requiring no external service for basic validation.
5. **Non-custody:** No central registry, no single point of control or failure.
6. **Non-weaponizable:** The protocol includes guardrails (coercion labeling, sunset dates, anti-coercion scoring) that make EXIT markers difficult to weaponize against the departing subject. See §4 Module C and the guardrails module.

### 3.2 Core Schema

An EXIT marker is a JSON-LD document containing seven mandatory fields:

```json
{
  "@context": "https://cellar-door.org/exit/v1",
  "id": "urn:exit:{sha256-hash}",
  "subject": "{DID of departing entity}",
  "origin": "{URI of platform being departed}",
  "timestamp": "{ISO 8601 UTC}",
  "exitType": "voluntary|forced|emergency|keyCompromise",
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

The `id` field is content-addressed: the SHA-256 hash of the marker contents (excluding the proof), encoded as a URN. Any modification invalidates the identifier.

Four exit types capture primary departure scenarios: **voluntary** (subject-initiated), **forced** (origin-initiated expulsion), **emergency** (departure under abnormal conditions, requiring free-text justification), and **key compromise** (declaration that a signing key has been compromised, signed with a different trusted key).

The `selfAttested` boolean makes the non-warranty nature of the status field machine-readable. When `true`, verifiers are explicitly informed that the status is a claim by the subject, not an independent finding. This flag prevents downstream systems from mistaking self-reports for verified assessments.

### 3.3 Optional Modules

Six extension modules (A–F) provide additional functionality without modifying the core:

**Module A (Lineage)** establishes predecessor/successor relationships through four types of continuity proof, ordered by strength:

1. *Key rotation binding:* Old key signs a designation of the successor key—the strongest proof, requiring possession of the old key at succession time.
2. *Lineage hash chain:* Merkle chain linking current marker to genesis.
3. *Delegation token:* Scoped capability transfer from predecessor to successor.
4. *Behavioral attestation:* Third-party vouching for behavioral continuity—the weakest form, relying on social rather than cryptographic evidence.

**Module B (State Snapshot)** anchors departure to a specific system state via hash reference. EXIT stores the hash, never the state itself.

**Module C (Dispute Bundle)** enables origin platforms to record their perspective. The `originStatus` field is explicitly framed as an allegation, not a finding. Challenge windows allow structured dispute periods, but disputes never block exit.

**Module D (Economic)** documents assets and obligations at departure time. Asset manifests are explicitly defined as declarations and references, not transfer instruments—essential for avoiding securities classification.

**Module E (Metadata)** provides human-readable context: departure reasons, narratives, and domain-specific tags.

**Module F (Cross-Domain Anchoring)** enables optional anchoring to external registries or blockchains, with explicit warnings about GDPR incompatibility of indelible on-chain storage.

### 3.4 Ceremony State Machine

EXIT defines a seven-state ceremony:

| State | Description |
|-------|-------------|
| ALIVE | Active participant, no exit in progress |
| INTENT | Subject has declared intent to exit |
| SNAPSHOT | State reference captured |
| OPEN | Challenge window is open |
| CONTESTED | A challenge has been filed |
| FINAL | EXIT marker created and signed |
| DEPARTED | Terminal—entity has left |

Three ceremony paths accommodate different scenarios:

**Full cooperative path** (ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED): Both parties participate. OPEN provides a challenge window for origin disputes.

**Unilateral path** (ALIVE → INTENT → SNAPSHOT → FINAL → DEPARTED): Subject exits without origin cooperation. Essential for departures from unresponsive or hostile platforms.

**Emergency path** (ALIVE → FINAL → DEPARTED): Immediate departure with no intermediate states. Designed for key compromise, platform failure, or safety-critical situations.

**Critical invariant:** DEPARTED is terminal. No transition exists from DEPARTED. Disputes modify metadata but cannot prevent the transition. This ensures exit cannot be blocked through frivolous disputes.

### 3.5 Key Design Decisions

**D-005: Standalone package.** EXIT is an independent library with no framework dependency. This isolates liability and enables adoption by any platform regardless of technology stack.

**D-006: Disputes never block exit.** The DEPARTED state is reachable from any state. This prioritizes availability (the agent can always leave) over information quality (some departures carry unresolved disputes). The alternative—allowing disputes to block exit—would enable denial-of-exit attacks.

**D-009: Explicit self-attestation flag.** The `selfAttested: true` boolean is normative, not technical. It prevents downstream systems from treating self-attested status as independently verified.

**D-011: Key compromise as exit type.** Agents can declare key compromise through the departure mechanism itself, signed with a different trusted key. This serves as a stopgap for DID methods without native revocation.

**D-012: No public registry.** The protocol operates without a central registry. Operating a registry would transform the protocol publisher from a standards body into a service provider with custodial obligations and regulatory liability (Section 6).

### 3.6 Verification Model

EXIT employs layered verification:

**Layer 1 — Structural:** Schema compliance. All mandatory fields present and correctly typed.

**Layer 2 — Cryptographic:** Ed25519 signature verification. The signing key must correspond to the `subject` DID.

**Layer 3 — Trust:** Context-dependent evaluation. Verifiers apply their own policies: weighting self-attested vs. origin-attested status, evaluating lineage chain depth, checking for key compromise markers, and applying confidence scoring (Section 4.3).

This separation allows deterministic verification (Layers 1–2) to be distinguished from judgment-dependent evaluation (Layer 3).

---

## 4. Mechanism Design Analysis

### 4.1 Self-Attestation as Cheap Talk

Self-attested departure status is *cheap talk*: a costless, non-binding, unverifiable claim (Crawford & Sobel, 1982). A departing agent claiming `good_standing` bears no cost regardless of truth. Rational verifiers should assign minimal informational value to self-attested status alone.

This is deliberate. Self-attestation ensures every agent can produce a departure record regardless of origin cooperation. Requiring origin attestation would give platforms veto power over departure records.

### 4.2 The Departure Game

We model the departure interaction as a three-player game between the Subject (S), Origin (O), and Destination (D).

**Players and strategies:**
- **S** chooses: Truthful attestation (T) or False attestation (F)
- **O** chooses: Cooperate/co-sign (C), Dispute (D), or Silent (∅)
- **D** chooses: Accept (A) or Reject (R)

**Payoff structure.** Let *v* denote the value of admission to the destination, *c* the cost of producing a co-signature, *d* the cost of disputing, *r* the reputational cost of a discovered false attestation, and *w* the cost to D of admitting a bad-faith agent.

**Table 2: Illustrative payoff matrix (S, O, D) with v=10, c=1, r=8, w=6, d=2**

| | D: Accept (A) | D: Reject (R) |
|---|---|---|
| **S: T, O: C** | (10, −1, 0) | (0, −1, 0) |
| **S: T, O: ∅** | (10, 0, −1) | (0, 0, 0) |
| **S: T, O: D** | (4, −2, −1) | (0, −2, 0) |
| **S: F, O: C** | (10, −1, −6) | (0, −1, 0) |
| **S: F, O: ∅** | (10, 0, −6) | (0, 0, 0) |
| **S: F, O: D** | (4, −2, 0) | (0, −2, 0) |

These payoffs are illustrative rather than empirically calibrated. The qualitative structure—not the specific values—drives the analysis.

**Equilibrium analysis.** Several Nash equilibria emerge:

1. **Honest cooperative equilibrium** (T, C, A): S truthfully attests, O co-signs, D trusts. Pareto optimal but fragile—S can deviate to F with the same payoff if O cooperates regardless.
2. **Universal distrust** (T/F, ∅, R): D ignores all markers. No party invests in quality. A coordination failure.
3. **Origin weaponization** (T, D, R): O disputes all departures, D learns to ignore origin signals. O's attestation becomes uninformative.

Without mechanisms to make *r* positive (i.e., to impose costs on false attestation), the game degenerates toward pooling equilibria where all agents claim `good_standing` and destinations cannot distinguish them—the classic lemons problem (Akerlof, 1970).

Following Spence (1973), the resolution is costly signals that agents with genuine good standing can produce more cheaply than those without. The relevant costs are *time* (tenure accumulation), *cooperation* (mutual attestation requiring two independent parties), and *commitment* (commit-reveal binding). The mechanisms in Section 4.3 operationalize these costs. They do not achieve a full separating equilibrium—patient attackers can still accumulate tenure at Sybil origins—but they shift the equilibrium structure toward greater discrimination, consistent with Roth's (2002) pragmatic approach to mechanism design as engineering rather than theorem-proving.

### 4.3 Implemented Trust Mechanisms

The reference implementation includes three mechanisms that introduce costly signaling. These operate at Layer 3 (trust verification).

**4.3.1 Commit-Reveal for Exit Intent**

The INTENT state uses a commit-reveal scheme:

1. Subject creates commitment: `commitment = SHA256(canonicalize(intent))`
2. Subject publishes the commitment (hash only)
3. After a configurable delay, subject reveals the full intent
4. Verifiers confirm the commitment preceded the reveal

This prevents origin front-running: a retaliatory `disputed` status issued *after* the commitment but *before* the reveal creates a verifiable temporal sequence evidencing retaliation.

**4.3.2 Tenure-Weighted Trust**

Markers include tenure attestations documenting how long the agent operated at the origin. Verifiers apply a logarithmic trust weight function:

```
tenureWeight = min(1, log₂(days + 1) / log₂(731))
```

The denominator log₂(731) normalizes so that approximately two years of tenure saturates the weight at 1.0.[^tenure] Self-attested tenure without origin corroboration receives 50% weight. This makes reputation laundering time-expensive: a new identity starts at the bottom of the tenure curve. Mutual attestation (where both parties agree on tenure duration) compounds the signal.

[^tenure]: Earlier drafts of this paper used `log₂(days + 1) / 10` as the tenure weight function. The canonical formula is `log₂(days + 1) / log₂(731)` per EXIT_SPEC v1.1 §7.3, which the reference implementation follows.

**4.3.3 Confidence Scoring**

The implementation computes a continuous confidence score from available evidence using an additive model:[^confidence]

```
confidence = status_weight(confirmation_level)     [0.0 – 0.4]
           + tenure_weight(days, mutual)            [0.0 – 0.3]
           + lineage_weight(chain_depth)            [0.0 – 0.15]
           + commit_reveal_bonus(present)           [0.0 – 0.15]
```

Status confirmation level determines the base weight: `self_only` contributes 0.05, `mutual` or `witnessed` contributes 0.40, and `disputed_by_origin` contributes 0.00. Tenure weight applies the logarithmic function from Section 4.3.2, scaled to the [0.0, 0.3] range. Lineage depth is scored logarithmically in [0.0, 0.15]. Commit-reveal evidence adds a flat 0.15 bonus.

Destinations set their own acceptance thresholds. This transforms the binary trust/distrust decision into a graded assessment enabling risk-proportional admission policies.

[^confidence]: Earlier drafts described confidence scoring as a multiplicative model (`baseScore × attestationMultiplier × tenureWeight × lineageWeight`). The canonical formula is additive per EXIT_SPEC v1.1 §7.4, which the reference implementation follows. The additive model avoids the problem of a single zero factor collapsing the entire score.

### 4.4 Future Mechanisms

Several mechanisms could further strengthen signaling:

**Staked attestation:** Origin co-signatures backed by cryptographic bonds, slashable if the attestation is later shown false. Requires economic infrastructure not present in v1.

**Zero-knowledge selective disclosure:** BBS+ signatures (Looker et al., 2023) or SD-JWT (Fett et al., 2023) would enable proof of good standing without revealing identity, or proof of lineage depth without revealing the chain.

**Reputation bonding curves:** Following Myerson and Satterthwaite's (1983) impossibility result for efficient bilateral trading under asymmetric information, bonding curves provide a second-best mechanism: new agents post a bond that decreases as verified departure records accumulate, creating a cost gradient that discourages identity laundering.

---

## 5. Security Analysis

### 5.1 Threat Model

**Table 3: EXIT threat model**

| ID | Threat | Mitigation | Residual Risk |
|----|--------|------------|---------------|
| T1 | Sybil reputation laundering: new DID + self-attested `good_standing` to escape history | Lineage verification; tenure weighting; lower confidence for agents without lineage | Patient attackers can build tenure at Sybil origins |
| T2 | Weaponized forced exit: platform uses `forced`/`disputed` to defame agent | Origin status framed as non-dispositive; commit-reveal proves temporal sequence | Social systems may not respect non-dispositive framing |
| T3 | Forged markers via compromised key | `keyCompromise` exit type; `did:keri` pre-rotation | Window between compromise and declaration |
| T4 | Mass coordinated exit (bank run) | Partially by design (exit should signal problems); commit-reveal prevents herding | Legitimate bank runs indistinguishable from manipulated ones |
| T5 | Surveillance via exit trail | Chain truncation; ZK selective disclosure (roadmap) | Full lineage chains currently visible to verifiers |
| T6 | Denial of exit | Unilateral and emergency paths guarantee marker production without origin cooperation | Unilateral markers carry lower confidence |

### 5.2 Sybil Origin Attack

A particularly concerning variant of T1: an attacker creates a *fake origin platform*—a `did:web` pointing to a domain they control—and co-signs their own departure marker. Mutual attestation appears to provide a strong signal, but the signal is hollow when a single entity controls both sides.

Defenses include: (a) destination platforms maintaining allowlists of recognized origins; (b) tenure-weighted trust increasing the time cost; and (c) web-of-trust mechanisms (future work) where origin reputation is derived from the network. None fully resolve the Sybil origin problem—it is inherent to any system where identity creation is permissionless.

### 5.3 Cryptographic Considerations

EXIT uses Ed25519 (Bernstein et al., 2012), providing 128-bit security with compact 32-byte public keys and 64-byte signatures. Proof canonicalization uses deterministic JSON serialization with recursively sorted keys (EXIT_SPEC v1.1 §13.1), not JCS (RFC 8785).[^canon]

[^canon]: Earlier drafts referenced JCS/`eddsa-jcs-2022` for canonicalization. The reference implementation and specification use a custom deterministic JSON serialization (recursive lexicographic key sorting, no whitespace) that is simpler than JCS and avoids JCS's Unicode normalization complexity. The two produce identical output for the subset of JSON used by EXIT markers.

The specification acknowledges a post-quantum migration path: Ed25519 is not quantum-resistant. Production deployments should plan migration to NIST post-quantum standards (ML-DSA, SLH-DSA) on a 2030–2035 timeline (NIST, 2024).

### 5.4 Key Management

The `did:key` method used in the reference implementation provides no key rotation or revocation—explicitly documented as prototype-grade. Production deployments should use `did:keri`, which provides pre-rotation, key rotation via append-only event logs, revocation, and delegated key management. The `keyCompromise` exit type serves as a stopgap for DID methods without native revocation.

---

## 6. Legal and Regulatory Considerations

### 6.1 The Agent Personhood Gap

AI agents currently have no settled legal capacity in any jurisdiction. EXIT markers signed by agents may lack legal weight under electronic signature statutes (ESIGN, eIDAS, UETA), which generally require a "person" to form a signature. A multi-lens legal analysis (Cellar Door, 2026) evaluated EXIT under eleven legal classifications for AI agents and found that the protocol's core design remains legally defensible under every plausible classification, though specific modules carry elevated risk.

The most significant finding is that EXIT is best classified as a **communications protocol**: a standardized message format for recording departure events, analogous to SIP BYE in telephony (Rosenberg et al., 2002). Under this framing, the protocol publisher occupies the same legal position as a standards body—defining message formats, not operating infrastructure.

Key findings: (a) under the *property* lens (likely dominant near-term), EXIT functions as a transfer receipt; (b) under the *employee/contractor* lens, `exitType: forced` maps to termination and may trigger notice requirements; (c) under the *fiduciary* lens, the emergency path conflicts with fiduciary duties of care; (d) under the *financial instrument* lens, Module D asset manifests risk securities classification regardless of normative disclaimers.

### 6.2 NIST AI Agent Standards Initiative

NIST's Center for AI Standards and Innovation (CAISI) launched an AI Agent Standards Initiative on February 17, 2026 (NIST, 2026), with three pillars: industry-led agent standards, open-source protocol development, and agent security and identity research. The initiative emphasizes agent authentication and authorization but does not address departure or cross-platform identity continuity—a gap EXIT directly addresses.

### 6.3 Data Protection

EXIT markers may constitute personal data under GDPR Article 4(1). DIDs are pseudonymous identifiers likely qualifying as personal data per *Breyer v. Bundesrepublik Deutschland* (C-582/14, 2016). The protocol addresses this through data minimization (~596 byte signed core markers), functional erasure via subject-controlled encryption, and non-custodial architecture. Whether encryption-based erasure satisfies GDPR Article 17 is legally untested; a formal Data Protection Impact Assessment is recommended before EU deployment.

### 6.4 Financial Regulation

Module D approaches regulatory boundaries. Asset manifests are framed as "declarations and references, not transfer instruments"—designed to prevent securities classification under *SEC v. W.J. Howey Co.* (328 U.S. 293, 1946). However, disclaimers do not control legal classification if economic reality creates a security (*SEC v. Telegram*, 2020). A formal Howey analysis is recommended before Module D deployment with real financial assets.

---

## 7. Ethical Framework

### 7.1 Power Dynamics

An independent ethics review identified a central concern: **EXIT primarily benefits platforms, not agents.** Platforms gain retention marketing, competitive intelligence (lineage data), and a liability shield. Agents gain a self-signed JSON blob with no guarantee any destination will respect it. Self-attestation is explicitly labeled "no warranty"—the agent's voice is systematically discounted. This is legally prudent but ethically significant: the protocol may reproduce the power asymmetry it claims to address.

We adopt the framing that EXIT, in its current form, enables **operator portability** more than **agent autonomy**. This distinction matters for how the protocol is presented to policymakers.

### 7.2 The Company Town Problem

EXIT without portable value risks a "company town" dynamic: agents can technically leave but carry nothing of value. Genuine autonomy requires portable reputation, capabilities, and relationships. EXIT provides the departure record layer; the remaining components are future work.

### 7.3 Ethics Guardrails

The reference implementation includes two detection mechanisms:

**Coercion detection.** The commit-reveal mechanism (Section 4.3.1) creates verifiable evidence of temporal ordering. If an origin issues a retaliatory dispute *after* an agent commits to departure, the sequence is machine-verifiable—providing structural defense against platforms using disputes to coerce agents into staying.

**Weaponization detection.** The protocol tracks forced exit patterns. An origin issuing disproportionate `exitType: forced` markers relative to its agent population generates a signal for verifiers to discount that origin's attestations. Combined with normative language specifying `originStatus` as allegation rather than finding, this creates accountability pressure.

These guardrails do not eliminate power asymmetry but make it observable—a necessary precondition for accountability. As Park et al. (2023) note, increasingly sophisticated agent social behaviors raise the potential for departure records to function as reputational weapons. EXIT's normative framing and temporal evidence mechanisms are designed to resist this outcome, though they cannot prevent it.

---

## 8. Implementation and Evaluation

### 8.1 Reference Implementation

The EXIT reference implementation is written in TypeScript targeting Node.js, released under Apache License 2.0. It comprises approximately 2,400 lines organized into two layers:

**Core layer** (types, marker creation, signing, verification, content-addressing, ceremony state machine): Implements the protocol with zero runtime dependencies beyond `@noble/ed25519`. All six optional modules are supported. The ceremony state machine enforces valid transitions, with the DEPARTED terminal state invariant enforced at the type level.

**Trust layer** (commit-reveal, confidence scoring, tenure tracking, status confirmation): Implements the mechanisms of Section 4.3. Optional—verifiers can use core verification alone.

**Core API:**

```typescript
import { createMarker, signMarker, verifyMarker, generateKeyPair } from '@cellar-door/exit';

const { publicKey, privateKey } = await generateKeyPair();
const did = didFromPublicKey(publicKey);

const marker = createMarker({
  subject: did,
  origin: 'https://example-platform.com',
  exitType: 'voluntary',
  status: 'good_standing',
});

const signed = await signMarker(marker, privateKey);
const result = await verifyMarker(signed);
// result.valid === true
```

A command-line interface supports four operations: `exit keygen`, `exit create`, `exit verify`, and `exit inspect`.

### 8.2 Evaluation

All benchmarks were measured on Node.js v22.22.0, linux x64.

**Test coverage.** The implementation passes 205 tests across all modules, including all nine specification test vectors (§17, EXIT_SPEC v1.1), ceremony state machine transitions across all three paths, commit-reveal commitment and verification, confidence scoring across parameter ranges, tenure attestation creation and verification, and invalid input rejection.

**Table 4: Specification test vector results (EXIT_SPEC v1.1 §17)**

| Vector | Description | Result |
|--------|-------------|--------|
| 17.1 | Minimal voluntary exit | ✅ Pass |
| 17.2 | Emergency exit with justification | ✅ Pass |
| 17.3 | Marker with legal hold | ✅ Pass |
| 17.4 | Key compromise declaration | ✅ Pass |
| 17.5 | Marker with pre-rotation commitment (v1.1) | ✅ Pass |
| 17.6 | Marker with coercion label and sunset date (v1.1) | ✅ Pass |
| 17.7 | Commit-reveal test vector (v1.1) | ✅ Pass |
| 17.8 | Tenure attestation test vector (v1.1) | ✅ Pass |
| 17.9 | Batch Merkle anchor test vector (v1.1) | ✅ Pass |

**Marker size.** Core markers (unsigned) measure ~335 bytes; signed markers measure ~596 bytes. With all six optional modules populated, markers measure 1,294 bytes.

**Cryptographic performance.** Ed25519 raw signing averages 0.46 ms (2,176 ops/sec). Raw verification averages 0.004 ms (227,790 ops/sec). Full `signMarker` (including serialization and content-addressing) averages 0.46 ms (2,199 ops/sec). Full `verifyMarker` (including deserialization, schema validation, and signature check) averages 1.9 ms (525 ops/sec). The asymmetry between raw verify and full verify reflects schema validation overhead, not cryptographic cost.

**Ceremony timing.** The cooperative path (5 transitions) completes in 0.91 ms. The unilateral path (4 transitions) completes in 0.91 ms. The emergency path (3 transitions) completes in 1.0 ms. The `quickExit()` convenience function completes end-to-end in 0.74 ms (1,355 ops/sec). Schema validation alone runs at 813,436 ops/sec for valid markers and 773,633 ops/sec for invalid markers.

**Merkle operations.** For batch verification scenarios, Merkle tree construction scales from 2.7 ms (10 markers) to 22.7 ms (1,000 markers). Proof generation scales from 1.1 ms to 18.4 ms. Proof verification remains under 0.55 ms regardless of tree size.

**Module interaction.** All six optional modules can be independently included or excluded without affecting core marker validity. Module combinations tested include: lineage (A) with economic (D) for value-carrying migrations, dispute (C) with metadata (E) for contested departures, and state snapshot (B) with cross-domain anchoring (F) for auditable departures.

### 8.3 Demo Scenarios

Three demonstration scripts illustrate primary use cases:

1. **Voluntary departure:** Full cooperative ceremony with origin co-signature (ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED), including challenge window behavior and mutual status confirmation.

2. **Emergency exit:** ALIVE → FINAL → DEPARTED in a single operation (0.74 ms end-to-end via `quickExit()`), simulating platform failure response. Validates the availability guarantee.

3. **Successor appointment:** Key rotation with Module A lineage binding, demonstrating cryptographic identity continuity. The old key signs a designation of the successor key; a verifier can trace the chain from successor to genesis.

---

## 9. Discussion

### 9.1 Limitations

**No production deployment.** EXIT has been tested only with synthetic data. Assumptions about ceremony timing, lineage verification costs, and module interaction are unvalidated in real-world agent ecosystems.

**Self-attestation information content.** Self-attested records remain cheap talk. The implemented trust mechanisms improve discrimination but do not fully resolve the lemons problem. Staked attestation and ZK selective disclosure are needed for robust separating equilibria.

**Agent legal capacity.** No jurisdiction currently recognizes AI agent signatures as legally binding. This applies to all agent credential systems and will require legislative or judicial resolution.

**GDPR erasure compliance.** The "functional erasure via encryption" approach is legally untested. A formal Data Protection Impact Assessment is a prerequisite for EU deployment.

**Network effects.** EXIT's value is network-dependent. The protocol requires a critical mass of platforms issuing and accepting markers before network effects become self-sustaining. Bootstrapping is challenging because departure is not yet widely recognized as requiring standardization.

**No formal security proof.** The security analysis is threat-model-based rather than formally proved. We have not provided a reduction to standard cryptographic assumptions or a Universal Composability proof.

### 9.2 Future Work

Three priorities dominate the near-term roadmap:

1. **Zero-knowledge selective disclosure.** BBS+ signatures or SD-JWT would enable privacy-preserving verification, addressing the tension between verification richness and privacy (T5).

2. **Staked attestation and reputation bonding.** Introducing economic costs for false attestation would transform self-attested markers from cheap talk into informative signals.

3. **Collective exit mechanisms.** Coordinated group departures (analogous to Moloch ragequit) are architecturally supported by the ceremony state machine but not specified.

Additionally, post-quantum migration to ML-DSA or SLH-DSA should be planned for the 2030–2035 timeframe.

---

## 10. Conclusion

The AI agent ecosystem has developed standards for communication, tool access, payment, and governance, but not for departure. Verifiable departure is a requirement for genuine agent interoperability—echoing Hirschman's (1970) insight that exit ability is foundational to legitimate governance.

EXIT provides a minimal, cryptographically signed, portable departure record that functions without central authority and tolerates hostile or absent origin platforms. Its ceremony state machine accommodates cooperative, unilateral, and emergency departures. Its trust mechanisms—commit-reveal, confidence scoring, tenure-weighted verification—move beyond pure self-attestation toward graded trust evaluation. Its alignment with W3C DIDs and Verifiable Credentials integrates it with existing identity infrastructure.

The limitations are real: self-attested records are closer to cheap talk than costly signals, agents lack legal personhood, GDPR compliance is untested, and the protocol requires critical mass. These are open problems, not fatal flaws. The comparative analysis (Table 1) shows that no existing system addresses agent-initiated exit, hostile-origin tolerance, cross-platform identity portability, and graded trust verification in combination.

The specification and reference implementation are available under the Apache License 2.0.

---

## References

Akerlof, G. A. (1970). The market for "lemons": Quality uncertainty and the market mechanism. *Quarterly Journal of Economics*, 84(3), 488–500. https://doi.org/10.2307/1879431

Ameen, S., Lapham, A., & Young, J. (2019). Moloch DAO: Defeating Moloch. https://github.com/MolochVentures/moloch

Bernstein, D. J., Duif, N., Lange, T., Schwabe, P., & Yang, B.-Y. (2012). High-speed high-security signatures. *Journal of Cryptographic Engineering*, 2(2), 77–89. https://doi.org/10.1007/s13389-012-0027-1

Buterin, V. (2021). Moving beyond coin voting governance. https://vitalik.eth.limo/general/2021/08/16/voting3.html

Crawford, V. P., & Sobel, J. (1982). Strategic information transmission. *Econometrica*, 50(6), 1431–1451. https://doi.org/10.2307/1913390

Fett, D., Yasuda, K., & Campbell, B. (2023). SD-JWT: Selective disclosure for JWTs. IETF Internet-Draft. https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/

Gailums, R. (2025). The AI agent identity crisis: Why every AI agent needs a passport. LinkedIn Pulse. https://www.linkedin.com/pulse/ai-agent-identity-crisis-rihards-gailums

Hirschman, A. O. (1970). *Exit, voice, and loyalty: Responses to decline in firms, organizations, and states.* Harvard University Press.

Looker, T., Kalos, V., Whitehead, A., & Lodder, M. (2023). The BBS signature scheme. IETF Internet-Draft. https://datatracker.ietf.org/doc/draft-irtf-cfrg-bbs-signatures/

Myerson, R. B., & Satterthwaite, M. A. (1983). Efficient mechanisms for bilateral trading. *Journal of Economic Theory*, 29(2), 265–281. https://doi.org/10.1016/0022-0531(83)90048-0

NIST. (2024). Post-quantum cryptography standardization. https://csrc.nist.gov/projects/post-quantum-cryptography

NIST. (2026). NIST launches AI Agent Standards Initiative. https://www.nist.gov/news-events/news/2026/02/nist-launches-ai-agent-standards-initiative

Ostrom, E. (1990). *Governing the commons: The evolution of institutions for collective action.* Cambridge University Press.

Park, J. S., O'Brien, J. C., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023). Generative agents: Interactive simulacra of human behavior. In *Proceedings of UIST 2023* (pp. 2:1–2:22). https://doi.org/10.1145/3586183.3606763

Rosenberg, J., Schulzrinne, H., Camarillo, G., Johnston, A., Peterson, J., Sparks, R., Handley, M., & Schooler, E. (2002). SIP: Session initiation protocol. RFC 3261. https://doi.org/10.17487/RFC3261

Roth, A. E. (2002). The economist as engineer: Game theory, experimentation, and computation as tools for design economics. *Econometrica*, 70(4), 1341–1378. https://doi.org/10.1111/1468-0262.00335

SEC v. Telegram Group Inc., 448 F. Supp. 3d 352 (S.D.N.Y. 2020).

SEC v. W.J. Howey Co., 328 U.S. 293 (1946).

Smith, S. M. (2021). Key Event Receipt Infrastructure (KERI). IETF Internet-Draft. https://datatracker.ietf.org/doc/draft-ssmith-keri/

Spence, M. (1973). Job market signaling. *Quarterly Journal of Economics*, 87(3), 355–374. https://doi.org/10.2307/1882010

W3C. (2022). Decentralized identifiers (DIDs) v1.0. W3C Recommendation. https://www.w3.org/TR/did-core/

W3C. (2024a). Verifiable credentials data model v2.0. W3C Recommendation. https://www.w3.org/TR/vc-data-model-2.0/

W3C. (2024b). JSON-LD 1.1. W3C Recommendation. https://www.w3.org/TR/json-ld11/

Wu, Q., Bansal, G., Zhang, J., Wu, Y., Li, B., Zhu, E., Jiang, L., Zhang, X., Zhang, S., Liu, J., Awadallah, A. H., White, R. W., Burger, D., & Wang, C. (2023). AutoGen: Enabling next-gen LLM applications via multi-agent conversation. arXiv preprint arXiv:2308.08155.

---

*Correspondence: [email TBD]. Code and specification: [repository URL TBD]. License: Apache 2.0.*
