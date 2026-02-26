# P05r: AI Agent Developer (LangChain) — Re-review

**Persona:** Senior developer building multi-agent systems with LangChain. Previously reviewed Feb 24.
**Date:** 2026-02-25
**Delta since v2:** Passage API rename, trust enhancers, P-256/FIPS signer, claim store, OpenTelemetry, 399 tests (up from 291).

---

## What changed since my last review?

### Passage API (`src/passage.ts`)

Thin rename layer: `createDepartureMarker`, `signDepartureMarker`, `verifyDeparture`, `quickDeparture`, `verifyPassage`, etc. Old names kept as deprecated aliases. Zero breaking changes.

**Agent-dev take:** The rename is cosmetically nicer ("departure marker" reads better than "exit marker" in tool descriptions) but functionally identical — every new name delegates to the original function. My existing `quickExit()` calls still work. This is a non-event for integration decisions.

### Trust Enhancers

`TrustEnhancers` type on markers: timestamps, witnesses, identity claims (conduit-only). These are passive data — they enrich the marker but don't change the create/sign/verify flow.

**Agent-dev take:** Useful for multi-agent audit trails. When Agent A departs and Agent B needs to evaluate the marker, witness signatures and tenure attestations (`createTenureAttestation()`) give B more signal without requiring out-of-band checks. The confidence scoring (`computeConfidenceScore()`) is interesting for agent decision-making — I could feed that score into a LangChain tool's output and let the orchestrator decide whether to trust the departure.

### Signer Abstraction + P-256

`Signer` interface with `signDepartureWithSigner()`. P-256 for FIPS environments. HSM/KMS integration guide.

**Agent-dev take:** This matters for production. My previous concern was "v0.1.0 library, production risk." A proper signer abstraction that supports AWS KMS / Azure Key Vault means I can use hardware-backed keys without the library touching secrets. `signDepartureWithSigner(marker, kmsSigner)` is the pattern I'd actually use in production multi-agent deployments. Significant maturity signal.

### Claim Store

`MemoryClaimStore` with `ingestMarker()`. Accumulates departure history for a subject.

**Agent-dev take:** This is the piece I was missing. In my LangChain orchestrators, when Agent B receives Agent A's marker, I need somewhere to check A's departure history. A claim store that ingests markers and lets me query by subject DID fits naturally as a LangChain retriever or tool backing store. Still in-memory only, but the interface is what matters — I can back it with Redis/Postgres.

### OpenTelemetry

Spans for sign/verify/ceremony operations.

**Agent-dev take:** I already instrument my LangChain chains with OTel. Having EXIT operations show up in the same trace is exactly right. No extra work.

### Test Coverage

291 → 399 tests, 18 → 24 test files. Commit-reveal, tenure attestation, coercion labeling, guardrails, pre-rotation all implemented and tested.

---

## Has my verdict changed?

Last time: "Would integrate EXIT side only." The ENTRY side was too heavy for agent tools, and I wanted production maturity signals.

**What moved:**
1. **Signer abstraction** — removes my biggest production blocker (key management)
2. **Claim store** — gives me the query layer I'd have had to build myself
3. **OTel** — zero-friction observability integration
4. **Trust enhancers + confidence scoring** — actionable signal for agent decision loops
5. **399 tests** — 37% more coverage in one release cycle; spec-implementation gap is closing

**What didn't move:**
- Still no ENTRY-side review (out of scope for this package)
- Still no npm download numbers or third-party adoption evidence
- The ceremony state machine is still not exposed through the LangChain tool layer — I'd still build coordination myself for cooperative exits

---

## Verdict: **Would integrate — EXIT + trust layer**

Upgraded from "EXIT side only" to "EXIT + trust layer." The signer abstraction, claim store, and confidence scoring turn this from a signing primitive into something I can meaningfully compose with agent orchestration. Concrete integration path:

1. `quickDeparture()` / `createDepartureMarker()` for agent exits
2. `signDepartureWithSigner(marker, kmsSigner)` for production key management
3. `computeConfidenceScore()` piped into LangChain tool output for downstream trust decisions
4. `MemoryClaimStore.ingestMarker()` backing a retriever for departure history queries
5. OTel spans flowing into existing trace infrastructure

The gap between "interesting spec" and "production-ready primitive" narrowed significantly in this release. I'd still want a second team using it before going GA, but I'd start integration in staging now.
