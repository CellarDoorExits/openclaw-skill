# P07r: Platform Operator — Updated Operational Feasibility Assessment

**Persona:** DevOps/SRE lead at an agent hosting platform. Runs infrastructure for thousands of agents.
**Date:** 2026-02-25
**Reviewer:** Platform Operator (re-review)
**Prior review:** P07 (2026-02-24) — Conditional-go
**Files reviewed:** EXIT_SPEC_v1.1.md (trust enhancers, claim store sections), `claim-store.ts`, `telemetry.ts`, `HSM_INTEGRATION.md`, prior assessment P07

---

## What changed since last review

Four items were flagged as blockers or gaps. Here's the delta:

### 1. Claim Store — ✅ Addressed

Previously: *"Not addressed in the spec… left as an exercise for the operator."*

Now: `MemoryClaimStore` implemented with a clean `ClaimStoreBackend` interface. The design is sound:

- **Interface-first:** `ClaimStoreBackend` is abstract — `put`, `get`, `query`, `delete`, `deleteBySubject`, `stats`. We can implement Redis/Postgres behind it without touching consumer code.
- **GDPR-aware:** `deleteBySubject()` is explicitly called out as Article 17 compliance. Good.
- **Content-addressed IDs:** Claims get deterministic IDs from `SHA-256(subject + type + issuer + issuedAt + payload)`. Deduplication is built in.
- **Ingestion helpers:** `ingestMarker()` and `claimsFromTrustEnhancers()` decompose a marker into typed claims (exit_marker, witness_attestation, timestamp, identity). This is the right decomposition for queryability.
- **Query model:** Filtering by subject, type, issuer, tags, marker ref, with expiry exclusion and pagination. Sufficient for replay prevention and trust lookups.

**Remaining gap:** `MemoryClaimStore` is in-memory only — no persistence. For production we still build the Redis/Postgres backend ourselves. But the interface is clean enough that this is a 1-2 sprint effort, not a design problem. The hard part (data model, query semantics, GDPR hooks) is done.

**Verdict on this condition:** Met. Interface contract is production-ready; we swap the backend.

### 2. HSM / Key Management — ✅ Addressed

Previously: *"No HSM integration guidance… Budget 1 FTE and HSM procurement."*

Now: `HSM_INTEGRATION.md` provides concrete `Signer` interface plus copy-paste implementations for:

- **AWS KMS** (ECC_NIST_P256, FIPS 140-2 Level 2/3)
- **Azure Key Vault** (P-256, ES256, FIPS 140-2 Level 3 with Managed HSM)
- **Google Cloud KMS** (EC_SIGN_P256_SHA256) — stub but pattern is clear
- **YubiKey** (PKCS#11, PIV slot 9a/9c, FIPS 140-2 Level 3)

The `Signer` interface is minimal and async-compatible:

```typescript
interface Signer {
  readonly algorithm: "Ed25519" | "P-256";
  sign(data: Uint8Array): Promise<Uint8Array> | Uint8Array;
  verify(data: Uint8Array, signature: Uint8Array): Promise<boolean> | boolean;
  did(): string;
  publicKey(): Uint8Array;
}
```

This is exactly what we needed. We use AWS KMS in production; the provided `AwsKmsSigner` class requires only our key alias and region. The `init()` pattern (fetch public key from KMS on startup, cache it) matches our standard HSM usage patterns.

**Remaining gap:** Organizational key governance (multi-party ceremonies, key escrow policies, rotation runbooks) is still our responsibility. But that's org-specific — a protocol spec shouldn't dictate our internal PKI procedures.

**FTE estimate revised:** 0.5 FTE for integration (down from 1 FTE) since the plumbing is provided.

**Verdict on this condition:** Met. HSM path is clear and matches our cloud provider stack.

### 3. Observability — ✅ New (not previously requested, but welcome)

`telemetry.ts` provides OpenTelemetry integration:

- **No-op by default:** If `@opentelemetry/api` isn't installed, all spans are no-ops. Zero overhead in test/dev. This is the correct pattern.
- **Instrumented wrappers:** `instrumentedSignMarker`, `instrumentedVerifyMarker` emit spans with attributes (`exit_type`, `algorithm`, `proof_type`, error counts).
- **Ceremony spans:** `startCeremonySpan()` for long-running multi-step operations.
- **PII controls:** `includeMarkerIds` and `includeSubjects` are opt-in flags. Good — we don't want DIDs in our Datadog traces by default.
- **Sync + async span wrappers:** `withSpan` and `withSpanAsync` — standard pattern, nothing surprising.

**What this gives us operationally:**
- Sign/verify latency tracking per algorithm
- Error rate monitoring on verification failures
- Ceremony duration tracking (intent → departed)
- We can plug this into our existing OTel collector → Datadog pipeline without custom instrumentation

**Verdict:** This was a gap we would have built ourselves. Having it in the library saves us ~1 sprint of instrumentation work.

### 4. Trust Enhancers — ✅ Addressed in spec

The spec's §7 trust mechanisms (StatusConfirmation, TenureAttestation, ExitCommitment, ConfidenceScore) and §8 ethics guardrails are well-specified. The confidence scoring model (§7.4) gives us a concrete formula we can implement in our admission policy:

```
confidence = status_weight + tenure_weight + lineage_weight + commit_reveal_bonus
```

For platform operations, the key insight is that `mutual` or `witnessed` confirmation levels (§7.1) give us a defensible admission standard. We can set a confidence threshold (e.g., ≥0.5 for auto-admit, <0.3 for manual review) and point to the spec when questioned.

---

## Remaining conditions (carried forward)

### Co-signature policy — Still pending (our responsibility)
Legal review of `originStatus` attestation workflow. This is org-specific and not the protocol's job. Timeline: before we enable Module C.

### Module D — Still skip for initial deployment
Economic module liability surface unchanged. No new mitigations in this update. Revisit after legal framework matures.

### Rate limiting — Still our build
Per-DID submission limits. The claim store's query model makes this feasible (query by subject, count, done). Not a protocol gap — it's an operational policy.

---

## Revised cost assessment

| Item | Previous estimate | Revised estimate | Delta |
|------|------------------|-----------------|-------|
| Key management infra | 1 FTE | 0.5 FTE | HSM guide eliminates design work |
| Claim store backend | 1-2 sprints (design + build) | 1 sprint (build only) | Interface provided |
| Observability | 1 sprint (custom instrumentation) | 0 sprints | OTel integration provided |
| Batch anchoring | 1 sprint | 1 sprint | Unchanged |
| **Total integration effort** | **~8-10 sprints** | **~4-5 sprints** | **~50% reduction** |

---

## Verdict: **Go**

All four conditions from the prior Conditional-go are now met or reduced to standard operational work:

1. ✅ **Claim store** — Interface defined, backend swap is routine
2. ✅ **HSM/PKI** — Integration guide with our cloud provider (AWS KMS) provided
3. ✅ **Observability** — OTel integration ships with the library
4. ✅ **Trust model** — Confidence scoring gives us a defensible admission policy

**Remaining work is operational, not architectural.** We need to:
- Implement a persistent `ClaimStoreBackend` (Redis or Postgres)
- Wire up the AWS KMS signer with our key management policies
- Set admission confidence thresholds
- Complete legal review for Module C co-signatures (can run in parallel)

**What tipped this from conditional to go:**
- The `Signer` interface and HSM guide eliminated the "build a PKI from scratch" concern. We're integrating with an existing abstraction, not designing one.
- The `ClaimStoreBackend` interface means the claim store is a backend implementation problem, not a data model problem. We've done this a hundred times.
- OTel integration means we get day-one observability in our existing monitoring stack.
- The overall engineering maturity has moved from "spec with stubs" to "spec with usable primitives."

**Risk acceptance:** We accept that this is a v0.2.0 library backing a v1.1 spec. We'll pin the dependency, run it behind a feature flag, and have a kill switch. Standard practice for early protocol adoption.

**Timeline:** 4-5 sprints to production-ready integration. We can start with a pilot cohort of agents (our internal tooling agents) before opening to customer agents.
