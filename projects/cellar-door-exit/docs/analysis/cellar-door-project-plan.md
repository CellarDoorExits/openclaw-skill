# Cellar-Door / EXIT — Macro Project Plan
**Created**: 2026-02-19 | **Status**: Launch planning — ready to build

---

## 1. Current State

### What Exists
- **Full architectural spec** (ARCHITECTURE.md) — 7 principles, core schema, ceremony state machine, agent lineage model
- **Core schema design** (EXIT_SCHEMA.md) — 7 mandatory fields, 6 optional modules, size profiles
- **Ceremony state machine** (EXIT_CEREMONY.md) — 7 states, 3 paths, failure modes
- **Agent lineage spec** (AGENT_LINEAGE.md) — successor appointment, continuity proofs, rotation patterns
- **Synthesis doc** (SYNTHESIS.md) — competitive landscape, gap analysis, open questions
- **3 research spikes complete:** DID method catalog (did:keri recommended), VC envelope fit test (dual format confirmed), Moloch ragequit analysis (EXIT fills the gap)
- **Scholar review + research brief** — 10 new research threads, 14 open questions mapped

### What's Been Decided
- **7 core fields** are locked (id, subject, origin, timestamp, exitType, status, proof)
- **6 optional modules** defined (Lineage, State Snapshot, Dispute, Economic, Metadata, Cross-Domain)
- **3 Mayor decisions all recommend option C:**
  1. Envelope: dual format (standalone JSON-LD + VC wrapper) ✓ confirmed by research
  2. Verification: layered (subject mandatory, co-sigs optional) ✓
  3. Status: multi-source (self-attested + optional origin view) ✓
- **DID method:** did:keri primary, did:key for emergency fallback
- **Proof format:** DataIntegrityProof + eddsa-jcs-2022 (modern W3C standard)
- **Contests don't block exit** — status changes only, never prevents departure
- **Emergency path always available** — ALIVE → FINAL in one operation
- **DEPARTED is terminal** — no undo, return = new JOIN

### What Doesn't Exist Yet
- **Zero code.** No prototype, no library, no CLI tool, no tests.
- No JSON-LD context document
- No reference implementation of signing/verification
- No test vectors
- No integration with any agent framework

---

## 2. Architecture Overview

```
EXIT Marker (the artifact)
├── Core: 7 fields, ~300-500 bytes, always valid
├── + Module A (Lineage): successor, predecessor, continuity proof
├── + Module B (State): hash refs to external state
├── + Module C (Dispute): challenge window, evidence refs
├── + Module D (Economic): asset manifest, obligations
├── + Module E (Metadata): reason, narrative, tags
└── + Module F (Cross-Domain): on-chain anchors, registry entries

EXIT Ceremony (the process)
├── Full cooperative: ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED
├── Unilateral: ALIVE → INTENT → SNAPSHOT → FINAL → DEPARTED
└── Emergency: ALIVE → FINAL → DEPARTED

Identity Layer
├── Primary: did:keri (pre-rotation, self-certifying, survives origin death)
├── Discovery: did:webs (KERI security + web resolution)
└── Emergency: did:key (zero-infrastructure, one-shot)

Envelope Formats
├── Canonical: standalone EXIT JSON-LD
└── VC Profile: W3C VC Data Model 2.0 wrapper
```

**Dependencies:**
- Cryptographic signing (Ed25519 via tweetnacl or noble-ed25519)
- Content addressing (SHA-256)
- DID resolution (did:key initially, did:keri later)
- JSON-LD context document (to be authored)

---

## 3. What Needs to Be Built — Phases

### Phase 1: Core Library (Weeks 1-3) ← START HERE
**Goal:** A TypeScript library that can create, sign, verify, and serialize EXIT markers.

- [ ] **EXIT marker schema** — TypeScript types, JSON Schema, validation
- [ ] **Marker creation** — build core markers with all 7 fields
- [ ] **Signing** — Ed25519 signature creation (DataIntegrityProof format)
- [ ] **Verification** — signature verification, schema validation
- [ ] **Content addressing** — SHA-256 based marker IDs
- [ ] **Serialization** — JSON output, canonical form
- [ ] **CLI tool** — `exit create`, `exit verify`, `exit inspect`
- [ ] **Test vectors** — known-good markers for each ceremony path
- [ ] **JSON-LD context document** — the `cellar-door.org/exit/v1` context

### Phase 2: Ceremony + Modules (Weeks 3-5)
**Goal:** State machine implementation, Module A (Lineage), and the 3 ceremony paths.

- [ ] **Ceremony state machine** — state transitions, validation rules
- [ ] **Module A: Lineage** — successor designation, key rotation binding, lineage chains
- [ ] **Module B: State Snapshot** — hash references to external state
- [ ] **Emergency path** — single-operation EXIT (ALIVE → FINAL)
- [ ] **SuccessorAmendment** — post-hoc successor designation
- [ ] **Deferred appointment** — EXIT without successor, amend later
- [ ] **VC wrapper profile** — W3C VC envelope generation from standalone markers

### Phase 3: Agent Integration (Weeks 5-8)
**Goal:** Make EXIT usable by actual agents.

- [ ] **did:keri integration** — signify-ts for KERI-based identity
- [ ] **KEL inclusion** — embed Key Event Log data in EXIT packages
- [ ] **Agent SDK** — simple API for agent frameworks to call
- [ ] **Pre-signed rotation escrow** — emergency preparedness tooling
- [ ] **Gas Town integration** — first real-world deployment (agents exiting rigs)
- [ ] **Multi-proof support** — proof sets for co-signed markers

### Phase 4: Ecosystem (Weeks 8+)
- [ ] **Verification service** — API endpoint for checking EXIT markers
- [ ] **Registry** — optional public registry of EXIT markers
- [ ] **did:webs discovery** — web-based resolution alongside did:keri
- [ ] **Cross-domain anchoring** — Module F implementation
- [ ] **Documentation + spec publication**

---

## 4. Dependencies on Other HOLOS Primitives

| Dependency | Needed For | Can Stub? | How to Stub |
|-----------|-----------|:---------:|-------------|
| **NAME/LOCUS** (identity) | Subject field resolution | YES | Use did:key for prototype. Identity is just a pointer in EXIT. |
| **LINE/SIGNUM** (lineage) | Module A ancestry chains | YES | Build lineage within EXIT's Module A. LINE would formalize it later. |
| **MARK** (reputation) | Status field ecosystem norms | YES | Self-attested status is the floor. Co-signature norms come later. |
| **RECORD** (memory) | State snapshot references | YES | Module B just stores hashes. Memory system referenced, not required. |
| **Gas Town** (orchestration) | First integration target | YES | Test with synthetic agent scenarios first. |
| **Beads** (work tracking) | Tracking EXIT development | Already exists | Use it. |

**Key insight: EXIT is deliberately dependency-minimal.** The core library needs only crypto primitives (Ed25519, SHA-256) and a DID method (did:key to start). Everything else is optional modules or integration work.

---

## 5. Open Questions & Decisions Needed

### Must Decide Before Coding
1. **Package name/repo structure** — standalone repo or monorepo? npm package name?
2. **TypeScript or Rust?** — Research spikes assume TS (Veramo ecosystem). Rust would be more portable but slower to prototype. **Recommendation: TypeScript first**, Rust binding later.
3. **Mayor ratification of the 3 architect decisions** — all recommend option C, need formal approval to proceed.

### Can Defer
4. **`exitType: systemic`** — 4th exit type for mass-exit events. Useful but not blocking v1.
5. **Collective exit (GroupExit)** — composition of individual markers vs. protocol-level wrapper. Research needed.
6. **Timing oracle for challenge windows** — who controls the clock in agent contexts? Defer to Phase 2.
7. **Minimum viable witness model** — who qualifies as witness? Defer to Phase 3.
8. **ZK selective disclosure** — "prove good standing without full history". Future work (BBS+/SD-JWT).
9. **Privacy model** — how much does the EXIT marker reveal? Defer, but keep schema ZK-compatible.
10. **`@context` offline resolution** — cache vs embed vs hash-verify. Solve in Phase 1 pragmatically (embed + cache).
11. **Provenance tracking for post-hoc upgrades** — timestamps per field vs. per marker. Phase 2.

### Research Still Needed
12. **Partial exit scoping** (cd-1zc.6) — exit some relationships but not others
13. **Agent memory persistence + EXIT** (cd-1zc.7) — how EXIT interacts with the memory problem
14. **First profitable integrity island** — where does EXIT get deployed first for real value?

---

## 6. Suggested First Sprint (THIS WEEK)

**Goal: A working `exit` CLI tool that can create and verify EXIT markers.**

### Day 1-2: Project Setup + Schema
- [ ] Create repo/package (`@cellar-door/exit` or `cellar-door-exit`)
- [ ] TypeScript project setup (tsconfig, vitest, tsup for build)
- [ ] Define TypeScript types for core schema (7 fields)
- [ ] Define TypeScript types for Module A (Lineage)
- [ ] Write JSON Schema for validation
- [ ] Write the JSON-LD context document (can be local file for now)

### Day 3-4: Core Operations
- [ ] `createMarker(opts)` — build a core EXIT marker from options
- [ ] `signMarker(marker, privateKey)` — Ed25519 DataIntegrityProof signing
- [ ] `verifyMarker(marker)` — signature verification + schema validation
- [ ] `computeId(marker)` — SHA-256 content-addressed ID generation
- [ ] Use `@noble/ed25519` for crypto (small, audited, no native deps)
- [ ] Use `did:key` for subject/proof.verificationMethod (simplest)

### Day 5: CLI + Tests
- [ ] CLI tool: `exit create --subject <did> --origin <uri> --type voluntary --status good_standing`
- [ ] CLI tool: `exit verify <marker.json>`
- [ ] CLI tool: `exit inspect <marker.json>` (human-readable display)
- [ ] Test vectors: voluntary exit, emergency exit, forced exit
- [ ] Test: tamper detection (flip one bit, verify fails)
- [ ] Test: schema validation (missing field → reject)

### Day 6-7: Demo Scenarios
- [ ] **Scenario 1: Agent voluntary exit** — agent leaves a rig, signs marker, verifies
- [ ] **Scenario 2: Emergency exit** — context dying, minimal marker in one operation
- [ ] **Scenario 3: Successor handoff** — agent exits with Module A, designates successor with key rotation binding
- [ ] Write README with examples and rationale
- [ ] Celebrate: the first EXIT marker in history 🎉

### What This Sprint Produces
- A TypeScript library that creates, signs, and verifies EXIT markers
- A CLI tool for manual marker creation/inspection
- Test vectors proving the schema works
- 3 demo scenarios showing the 3 ceremony paths
- A foundation to build ceremony state machine and modules on top of

### Tech Stack for Sprint 1
| Component | Choice | Why |
|-----------|--------|-----|
| Language | TypeScript | Veramo ecosystem, agent frameworks, fast prototyping |
| Runtime | Node.js | Universal, npm distribution |
| Crypto | @noble/ed25519 | Small, audited, pure JS, no native deps |
| Hashing | built-in crypto (SHA-256) | No extra dependency |
| DID method | did:key (z6Mk...) | Zero infrastructure, perfect for prototype |
| CLI | commander.js or yargs | Standard, well-known |
| Testing | vitest | Fast, TS-native |
| Build | tsup | Simple bundler for library output |
| Schema validation | zod or ajv | Runtime type checking |

---

## 7. Success Metrics

### Sprint 1 (this week)
- [ ] Can create a valid EXIT marker in <10 lines of code
- [ ] Can verify a marker offline with no network calls
- [ ] CLI tool works end-to-end
- [ ] 3 test scenarios pass

### Phase 1 (3 weeks)
- [ ] Full core library published to npm
- [ ] JSON-LD context document authored
- [ ] 20+ test vectors covering edge cases
- [ ] Documentation sufficient for another developer to use it

### Phase 2 (5 weeks)
- [ ] Ceremony state machine implemented
- [ ] Module A (Lineage) working with key rotation
- [ ] VC wrapper profile generates valid VCs
- [ ] Emergency path works in <100ms

### Phase 3 (8 weeks)
- [ ] At least one agent framework integration
- [ ] Gas Town agents producing real EXIT markers
- [ ] did:keri integration working

---

## 8. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Scope creep (EXIT becomes a platform) | HIGH | HIGH | Relentlessly enforce "EXIT is only the marker". Ref: SYNTHESIS.md's "5 things EXIT is NOT" |
| did:keri complexity delays integration | MEDIUM | MEDIUM | Start with did:key. KERI is Phase 3, not Phase 1. |
| No real users beyond Gas Town | MEDIUM | HIGH | Design for the general case. Gas Town is first user, not only user. |
| JSON-LD complexity slows development | MEDIUM | LOW | Start with plain JSON + validation. Add JSON-LD processing later. |
| Warren's budget/time constraints | HIGH | HIGH | Keep scope minimal. One library, one CLI. No infrastructure. |
| Standards change (VC 2.0 updates) | LOW | LOW | Dual format means standalone works regardless. |

---

*This plan is a living document. Update as decisions are made and work progresses.*
