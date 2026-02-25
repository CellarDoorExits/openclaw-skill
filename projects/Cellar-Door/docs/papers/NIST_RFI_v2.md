# Response to NIST AI Agent Standards Initiative Request for Information

**Submitted by:** Warren Koch, EXIT Protocol Project  
**Email:** warrenkoch@gmail.com  
**Date:** February 24, 2026  
**Subject:** Verifiable Agent Departure and Arrival Ceremonies for AI Agent Interoperability

---

## 1. Executive Summary

The EXIT Protocol is an open-source specification and reference implementation for creating verifiable, cryptographically signed records of AI agent departures from and arrivals into digital systems. It addresses a gap in the current AI agent ecosystem: no standardized mechanism exists for agents to portably prove where they have been, how they left, and under what standing — information critical to trust, safety, and interoperability in multi-agent environments.

This response describes the EXIT Protocol's technical architecture, its companion ENTRY Protocol for arrival verification, the current implementation status across five npm packages with 399 passing tests, and specific recommendations for how NIST AI agent standards could incorporate or reference verifiable agent mobility primitives.

The protocol is Apache 2.0 licensed, developed in the open across six GitHub repositories, and designed to be non-custodial (no central registry required), interoperable (JSON-LD, W3C DID-compatible), and safe by default (anti-weaponization clauses, coercion detection, sunset policies).

---

## 2. Problem Statement

As AI agents become more capable and autonomous, they increasingly operate across multiple platforms, frameworks, and organizational boundaries. An agent may be deployed on one platform, migrated to another, or need to establish trust with a new system it has never interacted with before.

Today, when an agent leaves a platform:

- **No verifiable record exists.** The departure is a platform-internal event invisible to the rest of the ecosystem.
- **Reputation is non-portable.** An agent's history, standing, and contributions are locked within the departing platform.
- **Trust must restart from zero.** A receiving platform has no cryptographic evidence of the agent's prior conduct or departure circumstances.
- **Agents can be trapped.** Without a standardized departure mechanism, platforms can make exit costly or impossible, creating lock-in.

These problems are not hypothetical. They are structural consequences of an ecosystem where agent identity, reputation, and mobility lack interoperable standards.

---

## 3. What the EXIT Protocol Is

The EXIT Protocol defines a **departure ceremony** — a structured, state-machine-governed process by which an entity (AI agent, service, or participant) creates a verifiable record of leaving a digital system.

The output of the ceremony is an **EXIT marker**: a JSON-LD document of approximately 300–500 bytes that records who departed, from where, when, how, and under what standing. The marker is cryptographically signed by the departing subject (Ed25519 default, ECDSA P-256 for FIPS compliance), content-addressed via SHA-256, and optionally co-signed by the origin platform or independent witnesses.

### 3.1 Core Design Principles

- **Exit cannot be blocked.** Any entity may depart at any time. Disputes are recorded but never prevent departure (a fundamental safety invariant).
- **Minimal by default.** The core schema is 7 mandatory fields. Everything else is optional, delivered through 6 composable modules (A–F).
- **Self-contained and offline-verifiable.** Markers require no network call to verify. Any party with the public key can validate the signature.
- **Non-custodial.** No central registry is required or recommended. Markers are portable artifacts controlled by their subjects.
- **Non-weaponizable.** A normative anti-weaponization clause prohibits using EXIT markers as blacklists or exclusion databases.

### 3.2 Ceremony State Machine

The departure ceremony follows a 7-state machine with three paths:

- **Cooperative path** (full process): ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED
- **Unilateral path** (no origin cooperation): ALIVE → INTENT → SNAPSHOT → FINAL → DEPARTED
- **Emergency path** (hostile or absent origin): ALIVE → FINAL → DEPARTED

The state machine ensures that departure remains possible even when the origin platform is uncooperative or unreachable — a critical safety property for AI agents operating in adversarial environments.

### 3.3 Optional Modules

Six composable modules extend the core marker:

| Module | Purpose |
|--------|---------|
| A: Lineage | Predecessor/successor chains for agent continuity across migrations |
| B: State Snapshot | Content-addressed reference to system state at departure (hash, not data) |
| C: Dispute Bundle | Evidence preservation, challenge windows, right of reply |
| D: Economic | Asset manifests and obligation tracking (declarations, not transfer instruments) |
| E: Metadata | Human-readable narrative, reasons, tags |
| F: Cross-Domain Anchoring | On-chain or external registry anchoring with Merkle batch operations |

---

## 4. The ENTRY Protocol: Arrival Verification

EXIT records departure. Its companion, the ENTRY Protocol (v1.0), records arrival. Together they constitute **Passage** — the complete, verifiable record of an entity moving between systems.

The ENTRY Protocol defines:

- **Arrival Markers** signed by the destination platform (not the arriving entity), attesting: "We verified this departure and admitted this entity."
- **Admission Policies** — composable rule sets governing whether to accept an arriving agent. Three presets are defined: OPEN_DOOR, STRICT, and EMERGENCY_ONLY.
- **Continuity Verification** — cryptographic checks that the EXIT and ENTRY markers refer to the same subject, origin, and departure event.
- **Probation** — time-bounded reduced-trust periods for newly arrived agents, with configurable restrictions.
- **Capability Scoping** — least-privilege access derived from the EXIT marker's modules, with explicit allow/deny lists.
- **Claim Tracking** — replay-resistant binding ensuring each EXIT marker is consumed at most once per destination.
- **Revocation** — post-admission invalidation of Arrival Markers when fraud or policy violations are discovered.

The core design asymmetry is intentional: **departure is a right; admission is a privilege.** EXIT markers cannot be blocked. ENTRY markers are the destination's prerogative. This mirrors established institutional patterns (right to emigrate vs. immigration control) and prevents the protocol from being used to force platforms to accept unwanted agents.

---

## 5. Technical Architecture

### 5.1 Cryptographic Foundation

- **Signing:** Algorithm-agile via abstract `Signer` interface. Two built-in algorithms:
  - **Ed25519** (EdDSA over Curve25519) — default, fast, compact signatures
  - **ECDSA P-256** (FIPS 186-5, NIST curve secp256r1) — for FIPS 140-2/3 compliant deployments
- **FIPS compliance:** The `Signer` interface accepts external implementations, enabling integration with FIPS-validated HSMs (AWS CloudHSM, Azure Managed HSM, YubiKey FIPS) without modifying protocol logic
- **Hashing:** SHA-256 for content-addressed identifiers and integrity verification
- **Canonicalization:** Deterministic JSON with recursively sorted keys (no whitespace)
- **Encryption:** ECDH key agreement with XChaCha20-Poly1305 for marker confidentiality
- **Redaction:** Field-level SHA-256 replacement enabling selective disclosure
- **Key management:** KERI-compatible key event logs with pre-rotation commitments

### 5.2 Trust Mechanisms

EXIT v1.1 introduces graduated trust signals to address the "cheap talk" problem of self-attestation:

- **Status Confirmation Levels:** Six levels from `self_only` (lowest) to `witnessed` (highest), derived from the combination of subject claims, origin attestations, and third-party witnesses.
- **Tenure Attestation:** Time-weighted trust signal with logarithmic scaling — longer tenure increases credibility but with diminishing returns.
- **Commit-Reveal:** Temporal evidence mechanism preventing origins from front-running exits with retaliatory status changes.
- **Confidence Scoring:** Composite metric aggregating status confirmation, tenure, lineage depth, and commit-reveal evidence into a continuous trust signal.

### 5.3 Safety Guardrails

Four heuristic detection systems provide ethical guardrails:

1. **Coercion Detection** — identifies possible retaliation, conflicting status signals, and suspicious emergency patterns
2. **Weaponization Detection** — cross-marker analysis detecting origins systematically abusing forced-exit mechanisms
3. **Reputation Laundering Detection** — per-subject analysis detecting identity cycling and reputation washing
4. **Ethical Compliance Validation** — checks for transparency violations (forced exits without reasons, expired markers in use)

These are advisory signals, not enforcement mechanisms. They surface concerns for human review without creating automated penalties that could themselves be gamed.

### 5.4 Anchoring and Timestamping

- **RFC 3161 TSA Integration:** Trusted timestamping via Time-Stamp Authority services, providing third-party temporal evidence independent of the subject or origin.
- **Git Ledger Anchoring:** Append-only ledger backed by git orphan branches, enabling low-cost, self-hosted, tamper-evident storage.
- **Merkle Batch Operations:** Multiple markers batched into a single Merkle tree for efficient anchoring, with individual inclusion proofs.

---

## 6. Implementation Status

The EXIT Protocol is implemented and tested, not merely specified.

### 6.1 Packages

| Package | Description |
|---------|-------------|
| `cellar-door-exit` | Core EXIT protocol — markers, signing, verification, ceremonies, modules, ethics, KERI, privacy, anchoring |
| `cellar-door-entry` | ENTRY protocol — arrival markers, admission policies, probation, capability scoping, claim tracking, revocation, passage verification |
| `cellar-door-langchain` | LangChain integration — EXIT as an agent tool |
| `cellar-door-vercel-ai-sdk` | Vercel AI SDK integration — EXIT as middleware |
| `cellar-door-mcp-server` | Model Context Protocol server — EXIT tools exposed via MCP |

### 6.2 Test Coverage

- EXIT Protocol: 322 tests passing
- ENTRY Protocol: 77 tests passing
- **Total: 399 tests** covering structural validation, cryptographic signing and verification, ceremony state transitions, module composition, trust mechanisms, ethics guardrails, admission policies, continuity verification, and edge cases.

### 6.3 Repositories

Six public GitHub repositories under active development, all Apache 2.0 licensed.

### 6.4 Framework Integrations

The protocol integrates with three major AI agent frameworks:

- **LangChain:** EXIT exposed as an agent tool, enabling agents to create departure markers as part of their action repertoire.
- **Vercel AI SDK:** EXIT as middleware, intercepting agent lifecycle events to create markers transparently.
- **Model Context Protocol (MCP):** EXIT tools exposed via an MCP server, enabling any MCP-compatible client to create and verify markers.

---

## 7. Relevance to NIST AI Agent Standards

### 7.1 Agent Portability

NIST's AI agent standards initiative will need to address how agents move between platforms, providers, and organizational boundaries. EXIT provides the cryptographic substrate for verifiable agent mobility: a departing agent creates a signed record; a receiving platform verifies it. Without standardized portability mechanisms, agents are locked into their originating platforms, reducing competition and innovation. The NIST AI Risk Management Framework (AI 100-1) identifies governance and accountability as core functions; EXIT provides the verifiable audit trail that makes agent lifecycle governance operationally feasible across organizational boundaries.

### 7.2 Interoperability

EXIT markers are JSON-LD documents using W3C DID identifiers (W3C, 2022). They can be wrapped in W3C Verifiable Credentials (W3C, 2024) and transmitted via any transport. The protocol is DID-method-agnostic (`did:key`, `did:keri`, `did:web`, `did:peer`) and framework-agnostic (demonstrated integrations with LangChain, Vercel AI SDK, and MCP). This positions EXIT as infrastructure that works across the heterogeneous AI agent ecosystem rather than within a single framework.

EXIT is designed to complement, not compete with, existing standards efforts. The FIPA Agent Communication Language and Agent Management specifications established foundational patterns for agent lifecycle and inter-agent communication; EXIT extends this lineage to cover departure and arrival—lifecycle events FIPA did not address. IEEE P2247 (Ethics in Autonomous and Intelligent Systems) and IEEE P3119 (Standard for the Procurement of Artificial Intelligence) address ethical governance and procurement of AI systems; EXIT provides the verifiable mobility layer these standards can reference when agents move between governed environments. ISO/IEC 42001 (AI Management Systems) defines organizational controls for AI governance—EXIT markers serve as auditable artifacts within an ISO 42001-compliant management system, providing evidence of agent lifecycle events. ISO/IEC 23894 (AI Risk Management) and the NIST AI Risk Management Framework (AI 100-1) both emphasize traceability and accountability; EXIT's cryptographically signed departure records directly support these requirements. The NIST AI RMF Generative AI Profile (AI 600-1) extends risk management to generative AI systems, where agent mobility across platforms creates novel governance challenges that EXIT addresses.

### 7.3 Trust and Reputation

Multi-agent systems require trust signals. EXIT's graduated trust model — from self-attestation through mutual confirmation to third-party witnessing — provides a structured approach to agent reputation that is honest about its limitations (self-attestation is explicitly labeled as cheap talk) while providing mechanisms for stronger verification when available.

### 7.4 Safety

The protocol's safety properties align with the risk management approaches outlined in NIST AI 100-1, ISO/IEC 23894, and IEEE P2247. Specifically:

- **Unblockable exit** prevents agent entrapment by hostile platforms
- **Emergency path** ensures departure is possible even when origins are unresponsive
- **Coercion detection** surfaces possible retaliatory forced departures
- **Anti-weaponization clause** normatively prohibits using markers as blacklists
- **Sunset policies** prevent indefinite reputation stigma from expired markers
- **Checkpoint markers** (pre-signed emergency exits) serve as dead-man switches for agent safety

### 7.5 Accountability and Auditability

EXIT markers create a verifiable audit trail of agent movements. Combined with ENTRY markers, the full Passage chain provides end-to-end accountability: where an agent came from, how it left, where it went, and under what terms it was admitted. This supports NIST's interests in AI accountability without requiring a centralized surveillance infrastructure.

---

## 8. Legal and Regulatory Analysis

The EXIT Protocol has undergone extensive legal analysis to identify and mitigate regulatory risks:

### 8.1 Comprehensive Legal Review

An 11-lens legal analysis examined the protocol under: (1) Securities law (Howey test applied to Module D economic markers), (2) GDPR and privacy compliance, (3) Antitrust (Sherman Act §1/§2, EU TFEU Art. 101/102), (4) Defamation liability from status attestations, (5) Tortious interference, (6) CFAA/computer fraud, (7) Platform terms of service, (8) Agent legal personhood, (9) Cross-border jurisdiction, (10) Contractual liability, and (11) Intellectual property.

### 8.2 Key Findings

- **Howey Test:** Module D asset manifests are documented as "declarations and references, not transfer instruments or bearer instruments" to avoid securities classification.
- **Antitrust:** Coordinated use of `blockedOrigins` across platforms could violate Sherman Act §1. The ENTRY specification includes a normative antitrust warning. The protocol itself is procompetitive (reduces lock-in, enhances portability) but platform-side coordination using EXIT data requires care.
- **GDPR:** EXIT markers may contain personal data. The specification requires Data Protection Impact Assessments, supports field-level redaction, encryption at rest, and GDPR Art. 17 right-to-erasure via claim store deletion.
- **Overall risk:** Medium, manageable with the design mitigations already incorporated.

### 8.3 Multi-Stakeholder Validation

A 15-persona professional review examined the protocol from the perspectives of immigration law, divorce law, digital forensics, insurance actuarial science, museum archival, real estate title, venture capital, labor economics, union organizing, military logistics, supply chain management, medical records administration, AI ethics, human resources, and API platform architecture.

**Unanimous finding:** Core architecture is sound; gaps are additions (ENTRY protocol — since completed, dispute resolution framework, developer experience) rather than architectural rethinks. The unblockable-exit invariant, honest self-attestation labeling, ceremony state machine, and modular architecture were praised across all 15 domains.

---

## 9. Standards Alignment

EXIT aligns with or references the following standards:

| Standard | Relationship |
|----------|-------------|
| W3C Verifiable Credentials Data Model 2.0 | Markers can be wrapped as VCs (Decision D-001) |
| W3C DID Core | Subject and verifier identifiers use DIDs |
| JSON-LD 1.1 | Marker serialization format with defined context |
| RFC 2119 | Requirement level keywords throughout specification |
| RFC 3161 | Trusted timestamping integration |
| KERI | Key event logs and pre-rotation commitments |
| IEEE P2247 | EXIT complements ethical governance of autonomous/intelligent systems |
| IEEE P3119 | EXIT provides verifiable lifecycle records for AI procurement compliance |
| FIPA ACL / Agent Management | EXIT extends FIPA's agent lifecycle model to departure and arrival ceremonies |
| ISO/IEC 42001 | EXIT markers serve as auditable controls within AI management systems |
| ISO/IEC 23894 | EXIT supports traceability requirements in AI risk management |
| NIST AI 100-1 (AI RMF) | EXIT provides governance and accountability artifacts aligned with AI RMF functions |
| NIST AI 600-1 (GenAI Profile) | EXIT addresses agent mobility risks in generative AI deployments |
| EU Digital Markets Act | EXIT supports Art. 6(9) data portability requirements |
| GDPR | Privacy primitives (encryption, redaction, erasure) support compliance |

---

## 10. Recommendations for NIST

Based on our experience developing and validating the EXIT Protocol, we offer the following recommendations for NIST's AI agent standards work:

### 10.1 Standardize Agent Mobility Primitives

Agent departure and arrival are fundamental lifecycle events. NIST standards should define or reference verifiable mechanisms for these events, ensuring agents can move between systems with cryptographic proof of their history and standing.

### 10.2 Require Unblockable Exit as a Safety Property

Any standard governing AI agent lifecycle should ensure that agents (or their operators) can always initiate departure. Blocking exit creates lock-in, enables exploitation, and removes a critical safety mechanism. EXIT's invariant — disputes are recorded but never prevent departure — should be a normative requirement.

### 10.3 Separate Departure Rights from Admission Privileges

Standards should recognize the asymmetry between leaving and arriving. Departure is a safety-critical right. Admission is a platform's legitimate prerogative. Conflating the two creates either unsafe systems (exit can be blocked) or insecure ones (admission cannot be controlled).

### 10.4 Address Trust Signal Portability

Self-attested reputation is cheap talk. Origin-attested reputation may be weaponized. NIST standards should encourage graduated trust models that honestly label the provenance and strength of trust signals rather than treating all attestations as equivalent.

### 10.5 Mandate Non-Custodial Architectures

Agent mobility standards should not require a central registry controlled by any single entity. Non-custodial, content-addressed, cryptographically signed artifacts — verifiable by any party without a network call — provide the strongest foundation for a decentralized agent ecosystem.

### 10.6 Incorporate Anti-Weaponization Provisions

Any standard that creates portable reputation or status records must include normative provisions against their use as blacklists or exclusion databases. Without such provisions, mobility infrastructure becomes surveillance infrastructure.

---

## 11. About the Submitter

Warren Koch is the founder of the EXIT Protocol project, based in British Columbia, Canada. The project is open source under Apache 2.0, with no venture funding or commercial obligations. The protocol was developed to address a structural gap in the AI agent ecosystem identified through direct experience building agent systems.

The project maintains six public GitHub repositories, five published npm packages, and two protocol specifications (EXIT v1.1, ENTRY v1.0) that have undergone multi-lens legal analysis and multi-stakeholder professional review.

**Contact:** warrenkoch@gmail.com  
**License:** Apache 2.0  
**Specifications:** EXIT Protocol v1.1, ENTRY Protocol v1.0

---

*This response is submitted to the NIST AI Agent Standards Initiative Request for Information. The views expressed are those of the submitter and do not represent any organization or employer.*
