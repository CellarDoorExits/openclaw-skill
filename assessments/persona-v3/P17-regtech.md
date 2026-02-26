# P17 — RegTech Analyst Assessment: EXIT Protocol v1.1

**Analyst:** RegTech Coverage Desk
**Date:** 2026-02-25
**Subject:** Cellar Door EXIT Protocol — AI Agent Departure Compliance Tooling
**Classification:** Market Assessment Brief

---

## Executive Summary

EXIT is an open protocol for creating cryptographically signed, verifiable records of AI agent departures from digital systems. It is **not** a GRC platform, compliance dashboard, or regulatory reporting tool. It is infrastructure — a data standard and ceremony specification that produces auditable departure artifacts. Its regulatory relevance is real but narrow and indirect. The protocol is early-stage, unaudited, and has no production deployments in regulated environments.

**Verdict: WATCH** — with specific triggers for re-evaluation.

---

## 1. Regulatory Framework Mapping

### Directly Addressed (Partial)

| Framework | Relevant Provisions | EXIT Coverage | Gap |
|---|---|---|---|
| **EU AI Act** | Art. 14 (human oversight), Art. 15 (robustness), Art. 9 (risk management) | EXIT's ceremony state machine and non-blocking enforcement provide auditable records of agent lifecycle transitions. Coercion detection and ethics guardrails map to Art. 14 oversight requirements. | No risk classification. No conformity assessment. No technical documentation per Annex IV. EXIT doesn't know what "high-risk" means. |
| **NIST AI RMF** | GOVERN 1.x (accountability), MAP 3.x (AI lifecycle), MANAGE 2.x (risk response) | Departure records with confidence scoring, lineage chains, and dispute mechanisms support lifecycle traceability. Non-blocking design aligns with MANAGE 2.4 (risk response proportionality). | No risk measurement. No impact assessment tooling. No bias/fairness coverage. |
| **ISO 42001** | §6.1 (risk assessment), §8.2 (AI system lifecycle), §9.1 (monitoring) | Marker archives with cryptographic proofs create audit trails for lifecycle events. KERI key management supports §8.2 identity lifecycle requirements. | No AIMS framework. No policy management. No continual improvement loop. |
| **GDPR** | Art. 17 (right to erasure), Art. 20 (data portability), Art. 35 (DPIA) | Explicitly addressed: field-level redaction, encryption, sunset policies, DPIA callouts for chain anchoring. The spec is GDPR-aware in a way most agent protocols are not. | Implementation guidance only — no automated DPIA tooling, no consent management, no DPO workflows. |

### Not Addressed

| Framework | Why It Matters | EXIT Relevance |
|---|---|---|
| **DORA** (Digital Operational Resilience Act) | ICT risk management for financial entities; third-party provider oversight | Zero. EXIT doesn't address ICT incident reporting, threat-led penetration testing, or third-party risk registers. An agent departing a system is not an "ICT-related incident" under DORA Art. 3. |
| **SOC 2** (Type I/II) | Trust Services Criteria for service organizations | Tangential. EXIT markers could feed into a SOC 2 audit trail for the "Processing Integrity" criterion, but EXIT itself is not a controls framework and provides no SOC 2 mapping. |
| **MiFID II / MiCA** | Financial instrument / crypto-asset regulation | None. Module D explicitly disclaims: asset manifests are "declarations, not transfer instruments." |
| **FCRA** (Fair Credit Reporting Act) | Consumer reporting; reputation scoring | The spec explicitly warns against aggregating markers into reputation scores (FCRA risk callout in NON_BLOCKING_ENFORCEMENT.md). This is a feature, not a gap — the protocol is designed to avoid becoming a consumer reporting agency. |
| **Basel III/IV** | Capital adequacy, operational risk | None. |

### Summary Assessment

EXIT is a **lifecycle auditability primitive**, not a compliance solution. It produces evidence that compliance solutions can consume. Think of it as a structured log format for agent departures, not as a GRC platform.

---

## 2. Market Sizing: AI Agent Compliance Tooling

### TAM Estimate

| Segment | 2026E | 2028E | Notes |
|---|---|---|---|
| AI Governance / AI Risk Management platforms | $2.1B | $5.8B | Gartner, Forrester estimates. Includes tools like Credo AI, Holistic AI, IBM OpenPages AI module |
| Agent-specific compliance tooling (lifecycle, identity, portability) | $80–150M | $400–700M | Nascent. No established market yet. Derived from enterprise agent deployment projections × compliance spend ratios |
| EXIT-addressable slice (departure/passage audit infrastructure) | $10–30M | $80–200M | Subset of agent compliance focused on inter-system mobility. Grows proportionally with multi-agent, multi-platform deployments |

**Key driver:** The TAM for EXIT-class tooling depends entirely on whether autonomous AI agents become first-class participants in regulated workflows. If banks deploy agents that move between systems (internal and third-party), departure auditability becomes a regulatory requirement by implication. If agents remain stateless API calls, the TAM is near zero.

**Our estimate:** $15M addressable in 2026, growing to $120M by 2028 under moderate agent adoption scenarios.

---

## 3. Competitive Positioning

### Existing GRC/Compliance Landscape

| Competitor | What They Do | Overlap with EXIT |
|---|---|---|
| **Credo AI** | AI governance platform — policy management, risk assessment, regulatory mapping | Near-zero. Credo AI manages policies; EXIT creates departure records. Complementary, not competitive. |
| **Holistic AI** | AI risk management — bias auditing, compliance dashboards | Zero overlap. Different layer entirely. |
| **IBM OpenPages + watsonx.governance** | Enterprise GRC with AI module — model inventory, lifecycle tracking | Slight overlap on lifecycle tracking. OpenPages tracks model lineage; EXIT tracks agent departures. IBM could consume EXIT markers. |
| **OneTrust AI Governance** | Privacy + AI governance convergence | GDPR overlap on data portability and erasure rights. OneTrust manages consent; EXIT manages departure records. |
| **Anthropic Constitutional AI / OpenAI safety tooling** | Provider-side safety and alignment | Different layer. These constrain agent behavior; EXIT records agent movement. |

### EXIT's Actual Competitive Position

EXIT has **no direct competitors** because the category doesn't exist yet. There is no other open standard for cryptographically verifiable agent departure records. This is both an advantage (first-mover in a new primitive) and a risk (the category may never materialize).

**Closest analogs:**
- W3C Verifiable Credentials — EXIT wraps into VCs but is more specific
- KERI — EXIT borrows key management concepts but applies them to departures specifically
- X.509 certificate revocation (CRL/OCSP) — conceptual parallel for "this identity is no longer valid here"

---

## 4. Bank Compliance Team Evaluation

### Would a Tier 1 Bank's Compliance Team Consider This?

**Short answer:** Not today. Possibly in 18–24 months.

### What a Bank Compliance Officer Would Say

**Positive signals:**
- FIPS 140-2/3 awareness (P-256 support, HSM signer interface) — this shows the authors understand regulated environments
- Legal hold structure — banks live and die by litigation holds; including this in the core schema is surprisingly mature
- Non-blocking enforcement design — separating protocol from policy is exactly how banks want infrastructure to work
- GDPR awareness is thorough (redaction, encryption, sunset policies, DPIA warnings for chain anchoring)
- Anti-weaponization clause — prevents the protocol from becoming a blacklist, which would create massive fair lending / anti-discrimination exposure

**Blocking concerns:**

1. **No independent security audit.** The SECURITY.md explicitly states: "Neither algorithm implementation has undergone formal security certification." Full stop for any bank's CISO. The noble libraries are audited, but EXIT's usage of them is not.

2. **No production deployments.** Zero track record in regulated environments. Banks require 12+ months of production operation with reference customers before evaluation.

3. **Key custody is deferred.** §19 acknowledges this openly: "The EXIT protocol assumes that agents can hold and transport private keys. This is a prerequisite for cryptographic EXIT — not something EXIT itself solves." For a bank, key custody IS the compliance question. Deferring it to a future "NAME-as-a-service" that doesn't exist yet is insufficient.

4. **No regulatory mapping documentation.** The spec doesn't include a controls mapping to any standard framework (NIST CSF, ISO 27001, SOC 2 TSC). Banks need this before procurement.

5. **No enterprise features.** No RBAC, no multi-tenancy, no audit log export in SIEM-compatible formats, no integration with ServiceNow/Archer/OpenPages.

6. **Immature DID ecosystem.** Banks are skeptical of DIDs generally. did:key has no revocation; did:keri is not widely deployed; did:web depends on DNS (which banks are comfortable with but raises different trust questions).

### What's Missing for Bank Adoption

| Requirement | Status | Priority |
|---|---|---|
| Independent security audit (SOC 2 Type II or equivalent) | ❌ Missing | P0 |
| FIPS 140-3 validated cryptographic module | ❌ Missing (interface exists, no validated implementation) | P0 |
| Controls mapping (NIST CSF, ISO 27001) | ❌ Missing | P1 |
| Enterprise deployment guide (HA, DR, monitoring) | ❌ Missing | P1 |
| SIEM integration (Splunk, Sentinel, QRadar) | ❌ Missing | P1 |
| Reference implementation with HSM integration (AWS CloudHSM, Thales Luna) | ❌ Missing | P1 |
| Key custody solution (not deferred) | ❌ Missing | P2 |
| Regulatory opinion letter or no-action letter | ❌ Missing | P2 |

---

## 5. Commercialization Path in Regulated Industries

### Phase 1: Open Standard Adoption (Now – Q4 2026)

- Publish spec through a recognized standards body (W3C Community Group, IETF individual draft, or DIF)
- Obtain independent security audit of reference implementation
- Build reference integrations with 2–3 agent frameworks (LangChain, AutoGen, CrewAI)
- **Revenue: $0.** This is infrastructure credibility-building.

### Phase 2: Enterprise Tooling Layer (2027)

- Build commercial layer on top of open protocol:
  - Managed EXIT verification service (SaaS)
  - Enterprise admin console (RBAC, policy management, audit export)
  - SIEM connectors and compliance dashboard
  - HSM-backed signing service
- Target: InsurTech and WealthTech firms deploying AI agents (lower regulatory bar than Tier 1 banks)
- **Revenue model:** Per-marker verification fees + enterprise license for management tooling
- **Target: $2–5M ARR**

### Phase 3: Regulated Industry Penetration (2028+)

- SOC 2 Type II certification of hosted service
- FIPS 140-3 validated signing module
- Bank pilot programs (start with innovation labs, not production)
- Regulatory engagement: present to OCC, FCA, BaFin innovation offices
- **Revenue model:** Enterprise contracts, $100K–$500K/year per institution
- **Target: $15–30M ARR**

### Key Risk to Commercialization

The biggest risk is that the agent mobility pattern EXIT addresses never materializes in regulated industries. If banks deploy agents as stateless microservices that don't "move" between platforms, EXIT solves a problem that doesn't exist in financial services. The protocol's value proposition depends on a world where autonomous agents are persistent entities that transit between systems — a world that is plausible but not yet real.

---

## 6. Recommendation

### WATCH

**Rating:** WATCH (not Buy, not Pass)

**Rationale:**
- EXIT addresses a real gap — there is no standard for verifiable agent departure records
- The spec is technically sophisticated and shows unusual regulatory awareness for an open-source protocol project
- The market doesn't exist yet, but the directional bet (agents as persistent, mobile entities) aligns with industry trajectory
- Too early for procurement: no audit, no production track record, no enterprise features

**Re-evaluate when:**
1. Independent security audit is published
2. A recognized standards body accepts the spec
3. Two or more enterprise agent platforms integrate EXIT natively
4. A regulated institution (any sector) announces a pilot

**For clients deploying AI agents today:** Monitor EXIT development. Do not depend on it for compliance. Use it as a design reference for your own agent lifecycle logging — the schema and ceremony design are well-thought-out regardless of whether you adopt the protocol itself.

---

*Assessment prepared for internal distribution. Not investment advice. Not legal advice. Regulatory landscape as of 2026-02-25.*
