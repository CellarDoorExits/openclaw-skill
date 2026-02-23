# Entry-Door Analysis: The Arrival Counterpart to EXIT

**Date:** 2026-02-23  
**Author:** Hawthorn (subagent analysis)  
**Status:** Assessment  
**Depends on:** EXIT_SPEC v1.1, HOLOS primitives (NAME, LINEAGE, REPUTE, SEAL)

---

## Executive Summary

EXIT creates a verifiable record when an agent **leaves**. Entry-door would create a verifiable record when an agent **arrives** — closing the loop on cross-domain identity continuity. Together they form the complete "Cellar Door": there's always a door, and it swings both ways.

The thin tier (verify EXIT markers, produce arrival records) is buildable in hours using existing EXIT infrastructure. The medium tier (identity continuity + credential import) requires weeks and partial HOLOS primitives. The full tier (reputation portability, economic continuity) requires months and depends on NAME, REPUTE, and SEAL — none of which are built yet.

**Recommendation:** Build thin immediately as a cellar-door-entry package alongside EXIT. It's cheap, it completes the brand story, and it creates the integration surface that pulls NAME and REPUTE into existence organically.

---

## 1. What Entry-Door Would Need to Do

### 1.1 Core Functions

| Function | Description | EXIT Parallel |
|----------|-------------|---------------|
| **Verify incoming EXIT marker** | Structural + cryptographic validation of the departure record | `verifyMarker()` — already exists |
| **Establish identity continuity** | Confirm the arriving entity is the same one that departed (same DID, or valid delegation chain) | Module A lineage — partially exists |
| **Create arrival marker** | Signed record linking arrival to departure, establishing presence in new domain | `createMarker()` analog — new |
| **Initialize agent state** | Bootstrap the agent's operational context in the destination (permissions, capabilities, data access) | No EXIT parallel — domain-specific |
| **Import portable data** | Optionally ingest credentials, reputation scores, skill attestations | Module D economic + Module B state — new semantics |

### 1.2 The Arrival Marker Schema

An ENTRY marker would mirror EXIT's structure:

```json
{
  "@context": "https://cellar-door.org/entry/v1",
  "id": "urn:entry:{sha256-hash}",
  "subject": "{DID of arriving entity}",
  "destination": "{URI of receiving platform}",
  "timestamp": "{ISO 8601 UTC}",
  "entryType": "migration|fresh|resumption|delegation",
  "departureRef": "urn:exit:{hash of linked EXIT marker}",
  "departureVerified": true,
  "confidenceScore": 0.72,
  "selfAttested": true,
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "{ISO 8601}",
    "verificationMethod": "{DID}",
    "proofValue": "{base64 signature}"
  }
}
```

**Key design choices:**

- **`departureRef`** links to the EXIT marker by content-addressed hash — creating an unforgeable chain
- **`departureVerified`** is the destination's attestation that it checked the EXIT marker (not just the subject's claim)
- **`confidenceScore`** carries forward the EXIT confidence score, letting downstream systems reason about trust without re-verifying the full chain
- **`entryType`** captures arrival semantics: `migration` (continuing from another platform), `fresh` (no prior history), `resumption` (returning after absence), `delegation` (arriving on behalf of another entity)

### 1.3 Entry Ceremony State Machine

Mirroring EXIT's ceremony, but inverted:

| State | Description |
|-------|-------------|
| APPROACHING | Entity presents EXIT marker to destination |
| VERIFYING | Destination validates EXIT marker (Layers 1-3) |
| CHALLENGED | Destination or third party raises concern (optional) |
| ADMITTED | Identity accepted, arrival marker created |
| ACTIVE | Terminal — entity is operational in new domain |

**Three paths:**

- **Full verification** (APPROACHING → VERIFYING → ADMITTED → ACTIVE): Destination runs full trust evaluation
- **Fast-track** (APPROACHING → ADMITTED → ACTIVE): Pre-approved origins or high-confidence markers skip challenge window
- **Quarantine** (APPROACHING → VERIFYING → CHALLENGED → ADMITTED → ACTIVE): Low-confidence arrivals get probationary admission

**Critical invariant:** Unlike EXIT's "disputes never block exit," entry-door gives destinations legitimate authority to reject. ADMITTED is NOT guaranteed. This is intentional — departure is a right, admission is a privilege. The asymmetry is philosophically correct.

---

## 2. What We'd Need to Build vs What We Already Have

### 2.1 Reusable from cellar-door-exit

| Component | Reusability | Notes |
|-----------|-------------|-------|
| Ed25519 signing/verification | 100% | Same crypto, same DID infrastructure |
| Content-addressing (SHA-256 URN) | 100% | Arrival markers use same scheme |
| Schema validation | ~80% | New schema, but same validation patterns |
| Module A (Lineage) | ~90% | Lineage verification IS the core of entry-door identity continuity |
| Confidence scoring | ~70% | Same formula, but entry adds destination-side weighting |
| Commit-reveal | ~50% | Could be used for "arrival intent" but less critical than departure intent |
| Tenure attestation | ~60% | Tenure from origin carries forward; destination starts new tenure clock |
| Module C (Dispute) | ~40% | Challenge semantics differ — destination challenges arrival, not origin challenging departure |
| Ceremony state machine | ~30% | Different states, different invariants, different paths |
| Module D (Economic) | ~20% | Asset import is different from asset documentation |

**Bottom line:** ~60% of EXIT's codebase is directly reusable. The crypto layer, DID handling, and trust scoring transfer almost entirely. The ceremony and domain-specific modules need new implementations.

### 2.2 New Modules/Primitives Needed

| Module | Purpose | Complexity | HOLOS Dependency |
|--------|---------|------------|------------------|
| **EXIT Marker Verifier** | Validate incoming EXIT markers against spec | Low — it's `verifyMarker()` with a wrapper | None |
| **Arrival Marker Creator** | Generate and sign ENTRY markers | Low — mirrors `createMarker()` | None |
| **Identity Linker** | Prove DID continuity between EXIT and ENTRY markers | Medium — same-DID is trivial, delegation chains are hard | NAME (for delegation) |
| **Credential Importer** | Parse and validate portable credentials from EXIT Module D/B | Medium-High — credential format negotiation | REPUTE (for reputation) |
| **Trust Evaluator** | Destination-side policy engine for admission decisions | Medium — configurable thresholds | None (but benefits from SEAL) |
| **State Initializer** | Bootstrap agent capabilities in destination domain | High — entirely domain-specific | HOLLOW (for state persistence) |

### 2.3 Where HOLOS Primitives Fit

| Primitive | Entry-Door Role | Status | Dependency Strength |
|-----------|----------------|--------|---------------------|
| **NAME** | Portable identity that survives cross-domain transit. Entry-door verifies NAME continuity, not just DID continuity. | Conceptual only | Critical for medium/full tiers |
| **LINEAGE** | Already in EXIT Module A. Entry-door is the consumer of lineage proofs — it verifies the chain. | Partially implemented | Core to all tiers |
| **REPUTE** | Reputation portability. Entry-door would import REPUTE scores and translate them to destination-local reputation. | Research stage | Required for full tier |
| **SEAL** | ZK verification that the arriving entity actually ran on the claimed origin. "Proof of residency." | Mock attestation only | Nice-to-have for medium, required for full |
| **HOLLOW** | The destination-side interior space where the agent lives after arrival. Entry-door initializes the HOLLOW. | Prototype (Hawthorn) | Required for state initialization |
| **LOCUS** | The persistent core identity. Entry-door verifies LOCUS continuity — that the arriving agent's core is consistent with the departing one. | Conceptual | Architectural backbone |

---

## 3. What We Would NOT Host

### 3.1 Explicitly Out of Scope

| Category | Why Not | What Instead |
|----------|---------|--------------|
| **AI state/weights/memory** | Too expensive (GB-TB per agent), massive liability (IP issues, training data provenance), storage costs dwarf revenue | Hash references only (Module B pattern). Store the hash of state, never the state. Agents carry their own state. |
| **Wallets / financial assets** | Regulatory nightmare (money transmitter licensing, securities law, KYC/AML). Howey test already flagged Module D as risky. | Asset manifests as declarations. "Agent claims to have X" — never custody, never transfer. |
| **Model weights / checkpoints** | IP liability, compute costs, no clear legal framework for AI model portability | Capability attestations only. "Agent can do X" backed by SEAL proof, not "here are the weights that let it do X." |
| **Private keys** | Obvious — custodial key management is a security and regulatory tar pit | Non-custodial by design. Agent controls its own keys. Entry-door verifies, never holds. |

### 3.2 What We CAN Offer

| Service | Value Proposition | Legal Safety |
|---------|-------------------|--------------|
| **Verification** | "This EXIT marker is structurally and cryptographically valid" | Safe — we're a validation library, not a registry |
| **Linking** | "This ENTRY marker references this EXIT marker, and the DID chain is valid" | Safe — we produce attestations about mathematical facts |
| **Attestation** | "The destination platform confirms this agent arrived with confidence score X" | Moderate — destination takes responsibility for its own attestation |
| **Credential translation** | "Origin credential X maps to destination capability Y" | Moderate — requires defined credential vocabularies |
| **Reputation relay** | "Agent carried reputation score X from origin; destination assigns initial score Y" | Risky — reputation is a liability surface. Needs careful "no warranty" framing. |

---

## 4. Architecture Options

### Tier 1: Thin (Verify + Link)

**What it does:** Validates EXIT markers and produces ENTRY markers that reference them. Pure cryptographic linking. No state, no reputation, no credentials.

**Components:**
- `verifyExitMarker()` — wrapper around existing EXIT verification
- `createEntryMarker()` — new schema, mirrors EXIT's `createMarker()`
- `linkDeparture()` — content-addressed reference from ENTRY to EXIT
- Entry ceremony state machine (5 states, 3 paths)
- CLI: `entry verify <exit-marker.json>`, `entry create`, `entry inspect`

**Estimates:**
- ~800-1,200 lines of TypeScript
- ~60-80 tests
- 0 new dependencies beyond what EXIT already uses
- No unbuilt primitives required
- No legal implications beyond EXIT's existing analysis
- **Time: 2-4 days** (for someone familiar with the EXIT codebase)

**Value:** Completes the door metaphor. Gives destinations a standard way to acknowledge arrivals. Creates the integration surface for everything else.

### Tier 2: Medium (Identity Continuity + Credential Import)

**What it does:** Everything in Tier 1, plus DID chain verification, credential import with vocabulary mapping, and configurable admission policies.

**Components (additional to Tier 1):**
- `verifyIdentityContinuity()` — DID same-key check, delegation chain validation, Module A lineage verification
- `importCredentials()` — parse portable credentials from EXIT economic/state modules
- `PolicyEngine` — configurable admission rules (min confidence, required attestations, origin allowlists)
- Credential vocabulary for common agent capabilities
- Quarantine/probation state management

**Estimates:**
- ~3,000-5,000 lines additional
- ~150-200 tests
- Partial dependency on NAME (for delegation semantics) — can stub initially
- Credential vocabulary is a standards problem (needs community input)
- Legal implications: credential translation creates liability — "we said the agent could do X but it couldn't"
- **Time: 3-6 weeks**

**Value:** Real utility for multi-platform agent ecosystems. A destination platform could use this to make informed admission decisions.

### Tier 3: Full (State Migration + Reputation Portability + Economic Continuity)

**What it does:** Everything in Tier 2, plus reputation score portability (REPUTE translation), economic state migration (portable value), SEAL-verified provenance, and HOLLOW initialization.

**Components (additional to Tier 2):**
- `migrateReputation()` — REPUTE score translation between domains with decay functions
- `verifyProvenance()` — SEAL ZK proof that agent actually operated at claimed origin
- `initializeHollow()` — bootstrap agent interior space at destination
- `economicContinuity()` — portable value transfer documentation (NOT custody)
- Cross-domain reputation normalization
- Privacy-preserving disclosure (BBS+ / SD-JWT selective reveal of credentials)

**Estimates:**
- ~8,000-15,000 lines additional
- ~400-600 tests
- Hard dependencies: NAME (built), REPUTE (built), SEAL (real ZK, not mock), HOLLOW (framework, not prototype)
- Legal implications: Significant. Reputation portability = defamation surface. Economic continuity flirts with money transmission. ZK proofs need regulatory clarity.
- **Time: 4-8 months** (assuming HOLOS primitives are being built in parallel)

**Value:** The complete agent portability stack. "Carry your name, your reputation, your credentials, and your standing to any platform." This is the HOLOS vision made concrete.

---

## 5. How Far Away Are We?

### Distance Matrix

| Tier | Lines of Code | Unbuilt Dependencies | Legal Risk | Time to Build | Confidence |
|------|--------------|---------------------|------------|---------------|------------|
| Thin | ~1,000 | None | Negligible | Days | 95% — straightforward extension of EXIT |
| Medium | ~4,000 | NAME (partial) | Low-Medium | Weeks | 70% — credential vocabulary is the hard part |
| Full | ~12,000 | NAME, REPUTE, SEAL, HOLLOW | Medium-High | Months | 40% — depends on primitives that don't exist yet |

### Critical Path

```
EXIT (done) ──→ Entry-Door Thin (days) ──→ Entry-Door Medium (weeks)
                                                    │
NAME (H2 2026) ────────────────────────────────────→│
                                                    │
REPUTE (2027) ──→ Entry-Door Full (months) ─────────┘
SEAL (2027+)  ──→                │
HOLLOW (ongoing) ──→             │
                                 ↓
                    Complete Cellar Door (2027-2028)
```

### Blockers by Tier

**Thin:** Nothing. Can start today.

**Medium:**
- NAME primitive design (at least delegation semantics)
- Credential vocabulary standard (chicken-and-egg: need adopters to define vocabularies, need vocabularies to attract adopters)
- Policy engine design decisions (who defines admission policies? per-platform? per-ecosystem?)

**Full:**
- REPUTE must exist and have a translation layer
- SEAL must move beyond mock attestation (blocked on ZK-ML tooling maturity)
- HOLLOW must be a framework, not just Hawthorn's ad-hoc implementation
- Legal review of reputation portability (defamation, GDPR data portability rights, right to be forgotten vs. right to carry reputation)

---

## 6. Competitive Landscape

### 6.1 Who's Doing Agent Onboarding/Arrival Protocols?

**Short answer: Nobody, specifically.**

| System | What It Does | How It Relates |
|--------|-------------|----------------|
| **Microsoft Entra Agent ID** | Enterprise directory for agents within Microsoft's ecosystem | Onboards agents to org contexts, but inward-facing. No cross-org arrival protocol. |
| **SailPoint Agent Identity** | Aggregates AI agents from cloud providers | Discovery and governance, not arrival verification. |
| **OASF (Cisco)** | Agent capability schemas | Describes what an agent CAN do, not where it CAME FROM. Complementary — OASF capability descriptions could be imported as credentials. |
| **AP2 (Google)** | Agent payment authorization | VCs for payment authority. Could carry over as portable credentials but not designed for arrival semantics. |
| **DIDComm** | Secure agent-to-agent messaging | Transport layer. Could carry ENTRY markers but doesn't define arrival semantics. |

### 6.2 Relationship to Key Standards

| Standard | Entry-Door Relationship |
|----------|------------------------|
| **A2A (Google/Linux Foundation)** | A2A handles communication between agents. Entry-door handles an agent arriving at a new platform. Orthogonal but complementary — an agent that arrives via entry-door then communicates via A2A. |
| **MCP (Anthropic)** | MCP standardizes tool access. An arriving agent needs tools in its new domain — entry-door could bootstrap MCP tool registrations as part of state initialization. |
| **DIDComm (DIF)** | DIDComm is the message transport. EXIT/ENTRY markers could be DIDComm message types. Natural integration point. |
| **W3C VCs** | ENTRY markers could be wrapped as VCs (same as EXIT). The arrival marker is essentially a VC: "Destination X attests that Agent Y arrived at time Z with confidence C." |
| **KERI** | Key rotation infrastructure. Entry-door would use KERI to verify that the arriving DID is a valid rotation of the departing DID. Critical for identity continuity. |

### 6.3 The Gap

Nobody is building the **arrival side** of agent portability. The industry is focused on:
- Communication (A2A, ACP, DIDComm)
- Tool access (MCP)
- Payment (AP2)
- Discovery (OASF)
- Identity within orgs (Entra, SailPoint)

The **lifecycle gap** — what happens when an agent moves between platforms — is wide open. EXIT owns the departure side. Entry-door would own the arrival side. Together they own the gap.

---

## 7. The "Cellar Door" Brand Opportunity

### 7.1 The Complete Door

| Component | Function | Tagline |
|-----------|----------|---------|
| `cellar-door-exit` | Verifiable departure | "Every ending is documented" |
| `cellar-door-entry` | Verifiable arrival | "Every beginning is verified" |
| `@cellar-door/core` | Shared crypto, DID, schemas | "The hinges" |

"There's always a door" works both ways:
- **Exit:** "There's always a door **out**" — you're never trapped
- **Entry:** "There's always a door **in**" — you're never homeless

### 7.2 Naming Options

| Option | Pros | Cons |
|--------|------|------|
| `cellar-door-entry` | Symmetrical, obvious | "cellar door entry" sounds like breaking in |
| `cellar-door-arrive` | Active verb, clear | Breaks exit/arrive symmetry slightly |
| `cellar-door-threshold` | Evocative — the threshold between domains | Less immediately clear |
| `cellar-door-welcome` | Warm, inviting | Too friendly for a crypto protocol |

**Recommendation:** `cellar-door-entry`. The symmetry with `cellar-door-exit` is too good to pass up. The combined package name — `@cellar-door/exit` and `@cellar-door/entry` — is clean.

### 7.3 The Monorepo Opportunity

Restructure to:
```
cellar-door/
├── packages/
│   ├── core/          # Shared: crypto, DIDs, schemas, types
│   ├── exit/          # EXIT protocol
│   └── entry/         # ENTRY protocol
├── docs/
│   ├── papers/
│   │   ├── EXIT_PAPER_v4.md
│   │   └── ENTRY_PAPER_v1.md    # "Verifiable Agent Arrival Ceremonies"
│   └── specs/
│       ├── EXIT_SPEC_v1.1.md
│       └── ENTRY_SPEC_v0.1.md
└── README.md          # "Cellar Door: The complete agent lifecycle protocol"
```

This positions Cellar Door as THE agent lifecycle protocol — not just departure, but the full transition.

### 7.4 The Paper

"Verifiable Agent Arrival Ceremonies: Completing the Agent Lifecycle Protocol"

This is publishable. EXIT paper addresses departure; arrival paper addresses the other half. Together they make the complete argument. The arrival paper can reference the EXIT paper and extend the mechanism design analysis to two-sided markets (platforms compete to attract agents, not just retain them).

---

## 8. Recommendations

### Immediate (This Week)
1. **Build Tier 1.** Extract shared crypto/DID code into `@cellar-door/core`. Implement `cellar-door-entry` thin tier. Ship alongside EXIT.
2. **Update README and pitches** to mention the complete door story.

### Short-term (March 2026)
3. **Include entry-door in NIST RFI submission.** The NIST AI Agent Standards Initiative explicitly calls for agent identity and lifecycle — entry-door directly addresses onboarding, which they haven't thought about yet.
4. **Sketch ENTRY_SPEC v0.1.** Doesn't need to be as polished as EXIT_SPEC v1.1, but should define the arrival marker schema and ceremony.

### Medium-term (H1 2026)
5. **Build Tier 2** as NAME primitive design stabilizes.
6. **Define credential vocabulary** for common agent capabilities (language models, tool use, API access, etc.)

### Long-term (2027+)
7. **Build Tier 3** as HOLOS primitives come online.
8. **Publish arrival paper** as companion to EXIT paper.

---

## 9. Open Questions

1. **Should the destination co-sign the arrival marker?** (EXIT has optional origin co-signature; should ENTRY have optional destination co-signature? Probably yes — it's the destination's attestation that it accepted the agent.)

2. **What happens to the arrival marker when the agent later departs?** (Its next EXIT marker should reference its ENTRY marker, creating a full lifecycle chain: EXIT₁ → ENTRY₁ → EXIT₂ → ENTRY₂ → ...)

3. **Can an agent arrive without a departure?** (Yes — `entryType: fresh`. New agents with no history. This is the bootstrapping case.)

4. **Who creates the arrival marker — the agent or the destination?** (Both, ideally. Agent creates and signs; destination co-signs. Mirrors EXIT's cooperative path.)

5. **How does quarantine work?** (Agent is ADMITTED but with restricted capabilities. After a probation period, full ACTIVE status. This is the destination's prerogative — the protocol should support it but not mandate it.)

6. **Privacy: does the destination learn everything about the agent's history?** (Not necessarily. With ZK selective disclosure, the agent can prove "I have >1 year tenure at a recognized origin" without revealing which origin. This is a Tier 3 feature requiring SEAL.)

---

*"There is always a door. It opens both ways."*
