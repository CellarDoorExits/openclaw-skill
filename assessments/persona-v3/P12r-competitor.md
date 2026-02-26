# P12r: Competitor / Critic — Updated Threat Assessment

**Persona:** CTO at a competing AI governance startup
**Date:** 2026-02-25
**Previous Review:** 2026-02-24 (P12-competitor-critic.md) — Threat level: Low
**Delta Review:** v0.1.0 → v0.2.0, 291 → 399 tests, new subsystems

---

## Executive Summary

They fixed roughly half of what I flagged. The other half remains killable — but the *velocity* is concerning. One person shipped P-256/FIPS, signer abstraction, a claim store, telemetry, governance files, and 108 new tests in what appears to be days. That's not academic-project energy. That's someone building with intent.

**Updated threat level: Low → Low-Medium.** Still no production users. Still self-attestation dependent. But the codebase is maturing faster than I expected and several of our attack surfaces just closed.

---

## What They Fixed (My Previous Kills, Neutralized)

### ❌ Single-Algorithm Dependency — KILLED
Previously flagged as MEDIUM. Now they have Ed25519 + ECDSA P-256 with a clean `Signer` interface that's trivially extensible to ML-DSA. The signer abstraction (`signer.ts`) supports HSM/KMS/hardware tokens via async `sign()` returning `Promise<Uint8Array> | Uint8Array`. This is production-grade interface design. FIPS 140-2/3 compliance via P-256 closes the enterprise door I was planning to walk through.

**Damage to us:** Our "algorithm agility" differentiator is gone. They got there first with a cleaner abstraction than ours.

### ❌ Solo Maintainer Risk — Partially Addressed
GOVERNANCE.md and CONTRIBUTING.md now exist. Still one maintainer, but the project now has the scaffolding to accept contributors. The 399 tests across 24 files create a safety net that makes contribution viable.

### ❌ Spec Complexity vs. Adoption — Partially Addressed
The "Passage API" rename (`createDepartureMarker`, etc.) suggests they're thinking about developer experience. The claim store provides a concrete "what do I do with these markers" answer that was missing before.

---

## What's Still Killable

### 1. 🔴 CRITICAL: Self-Attestation Death Spiral — UNCHANGED

Not one line of code addresses this. The claim store (`claim-store.ts`) is well-built — content-addressed IDs, GDPR `deleteBySubject()`, proper query interface — but it's a *filing cabinet for unverified claims*. `claimFromMarker()` faithfully records `selfAttested` from the marker. The store "validates structure, not truth" (their own comment). That's honest, and it's fatal.

The `ingestMarker()` convenience function ingests trust enhancers (timestamps, witnesses, identity claims) but there's no verification layer. A marker with forged witness attestations gets ingested identically to one with real ones. The claim store makes it *easier* to accumulate garbage at scale.

**Kill argument (updated):** "They've built a beautifully typed database for storing lies. The claim store is append-only by default — so once a Sybil marker enters, it persists and poisons downstream queries. The GDPR delete is per-subject, not per-origin — you can't purge claims from a compromised origin without nuking legitimate claims from agents who were also on that origin."

### 2. 🔴 CRITICAL: Zero Production Deployment — UNCHANGED

v0.2.0. 399 tests against synthetic data. Still no npm published package (I checked). Still no production users. The velocity is impressive but velocity × 0 users = 0 adoption.

### 3. 🟠 HIGH: Sybil Origin Problem — UNCHANGED

The signer abstraction doesn't help here. P-256 doesn't help here. The claim store makes it *worse* — now you can accumulate Sybil claims across multiple markers and present them as a portfolio. "Look, I have 47 claims from 12 origins!" — all self-created.

### 4. 🟠 HIGH: Trust Enhancers Are Conduits, Not Solutions

The new trust enhancers (timestamps, witnesses, identity claims) are typed as attachments on markers. They're structural — "here's a slot for a TSA receipt" — but the README says "conduit-only." They don't *provide* timestamp authority integration, witness networks, or identity verification. They provide *fields for* them.

This is the same pattern as the rest of the project: excellent type definitions for infrastructure that doesn't exist yet. It's like building a perfect electrical panel for a house with no power grid.

### 5. 🟡 MEDIUM: Claim Store Has No Persistence

`MemoryClaimStore` is the only implementation. In-memory. Gone on restart. The comment says "For persistence, implement ClaimStoreBackend with a database" — so the user is expected to build the hard part. For a system whose value proposition is *accumulating trust over time*, having no persistent storage is... a choice.

### 6. 🟡 MEDIUM: No Cross-Language Story

Still TypeScript only. The signer abstraction is beautiful TypeScript but means nothing to the Python/Rust agent ecosystem. A `Signer` interface in Python would need completely separate implementation.

---

## What I'd Steal (Updated)

### Steal immediately:
- **The `Signer` interface pattern.** `sign(): Promise<Uint8Array> | Uint8Array` — the sync/async union type is clever. Lets in-memory keys be synchronous while HSM calls are async. No unnecessary `await` overhead. We should copy this verbatim.
- **`createVerifier()` as a separate factory.** Verify-only objects from a DID + public key. Clean separation of signing authority from verification capability. Good security posture.
- **`algorithmFromProofType()` / `proofTypeForAlgorithm()` bidirectional mapping.** Small thing but prevents magic strings everywhere. We're still using string literals.
- **The `ClaimStoreBackend` interface.** Abstract over storage with `put/get/query/delete/deleteBySubject/stats`. The GDPR-aware `deleteBySubject` is smart. The content-addressed ID computation is solid.

### Steal with modifications:
- **`ingestMarker()` pattern** — but add a verification layer before storage. Their version trusts the marker structure; ours should verify signatures before ingestion.
- **Trust enhancer type system** — but wire it to actual TSA/witness infrastructure rather than leaving it as conduit slots.

### New things to steal (v0.2.0):
- **OpenTelemetry integration for sign/verify/ceremony.** We hadn't thought about observability for credential operations. Enterprise buyers will want dashboards showing "how many markers verified this quarter" and latency percentiles. They're ahead here.

---

## Revised Competitive Strategy

### What changed:
- ~~"Algorithm agility" differentiator~~ — Dead. They have it.
- ~~"Enterprise readiness" via FIPS~~ — Weakened. P-256 closes that gap.
- "No governance/contribution path" — Weakened. Files exist now.

### What still works:
- **"No production users" argument** — Still devastating. Still true.
- **"Self-attestation is useless" argument** — Still devastating. Still true. Nothing in v0.2.0 addresses this.
- **"Simpler protocol" play** — Still viable. Their surface area grew (signer abstraction, claim store, telemetry, passage API) without growing adoption. More code to maintain, same zero users.
- **Federated platform registry** — Still our opening. They still refuse centralized trust anchors (principle D-012). The market will want them.

### New concern:
The **claim store + telemetry** combination suggests they're thinking about the enterprise pitch: "ingest markers into your system, query them, observe operations." If they ship a persistent backend (SQLite, Postgres) and a REST API in front of the claim store, they suddenly have a product, not just a library. That would change the threat level to Medium.

---

## 6-Month Prediction (Updated)

**Previously:** "Watch for 6 months."

**Now:** Watch for 3 months. The velocity increase is real. If by May 2026 they have:
1. A persistent claim store backend
2. One real integration (LangChain, CrewAI, anything)
3. One platform accepting markers

...then we need to either acquire, partner, or ship our competing protocol immediately. The window for "let them prove the market then steal it" is shorter than I thought.

If they *don't* have those three things by May, the self-attestation problem and zero-adoption problem will have compounded. Academic projects that don't ship to production within 6 months of reaching this maturity level rarely do.

---

## Bottom Line

The codebase went from "impressive spec exercise" to "almost a product." The signer abstraction and claim store are genuinely good engineering — I'd hire whoever wrote them. But engineering quality doesn't solve the fundamental trust model problem, and the claim store arguably makes the Sybil attack surface larger by providing infrastructure for accumulating unverified claims.

They're building faster than expected. They're building the right abstractions. They're still building on a foundation of self-attestation that the market won't trust for high-value decisions.

**Threat level: Low-Medium.**
- Low because: zero users, self-attestation unsolved, no persistent storage, no cross-language
- Medium because: velocity, FIPS compliance, signer abstraction quality, claim store design, telemetry

**The thing that would scare me:** A blog post titled "Platform X now accepts EXIT markers for agent offboarding." One real deployment turns every "academic exercise" argument to ash. Watch for it.
