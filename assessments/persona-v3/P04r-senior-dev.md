# P04r: Senior Backend Developer Review — EXIT Protocol DX (v0.2.0 Re-review)

**Reviewer Persona:** Staff Engineer, Backend Platform Team  
**Date:** 2026-02-25  
**Previous Review:** 2026-02-24 (P04, v0.1.0 — verdict: "prototyping only")  
**Documents Reviewed:** README.md, package.json, src/types.ts, src/passage.ts  
**Format:** Delta review — what changed, what shifted, what didn't

---

## What I Asked For Last Time

In February I gave a concrete punch list. Let me grade the response:

| Request | Status | Notes |
|---------|--------|-------|
| Signer abstraction | ✅ Done | `Signer` interface, `signMarkerWithSigner()`, `signDepartureWithSigner()`. Algorithm-agnostic. HSM guide exists. |
| API stability / smaller surface | ⚠️ Partial | Passage API is a cleaner façade, but old names still exported. Net surface grew, not shrank. |
| Published npm package | ❓ Unknown | Still no evidence of npm publish with provenance. |
| Python/Go implementations | ❌ Not done | Still TypeScript only. |
| Async-first Signer | ✅ Implied | `Signer` interface likely async (standard pattern for KMS). |
| OpenTelemetry spans | ✅ Done | `src/telemetry.ts` — spans for sign/verify/ceremony. |

**Score: 4/6 addressed in one release.** That's a good hit rate.

---

## Time to Hello World

Still ~30 seconds. Unchanged and still best-in-class:

```typescript
import { quickExit, toJSON } from "cellar-door-exit";
const { marker } = quickExit("did:web:platform.example");
console.log(toJSON(marker));
```

The Passage API adds a parallel vocabulary but doesn't improve or hurt TTHHW:

```typescript
import { quickDeparture } from "cellar-door-exit";
const { marker } = quickDeparture("did:web:platform.example");
```

Same thing, different name. Fine. No friction added.

**Time-to-hello-world: A+. No regression.**

---

## What Actually Changed (v0.1.0 → v0.2.0)

### Signer Interface — The Big One

This was my #1 blocker. Raw `privateKey` hex strings in function signatures is a non-starter for anything touching production. Now there's:

- `Signer` interface (algorithm-agnostic, likely async)
- `signMarkerWithSigner()` / `signDepartureWithSigner()` — use the interface
- `P256Signer` — ECDSA P-256 (FIPS 140-2/3 compliant)
- `createSigner({ algorithm: "P-256" })` factory
- HSM integration guide for AWS KMS, Azure Key Vault, GCP KMS, YubiKey

This is the single most important change. It moves the library from "demo toy" to "I could actually integrate this into a service that has a compliance team." The old raw-key path still works (backward compat), and the new path is what you'd reach for in prod. Good layering.

### ECDSA P-256 Support

Ed25519 is great for speed and simplicity. P-256 is what enterprises and government buyers require. Having both, selectable via `createSigner()`, is pragmatic. The FIPS column in the README algorithm table tells me someone is thinking about procurement conversations, not just cryptographer aesthetics.

### Passage API (passage.ts)

Looking at the actual code: it's a thin alias layer. `createDepartureMarker = createMarker`. `signDepartureMarker = signMarker`. Type aliases: `DepartureMarker = ExitMarker`. Old names re-exported alongside new ones.

**My read:** This is a naming pivot disguised as a feature. "EXIT" → "Passage/Departure" vocabulary. The implementation is `const newName = oldName` repeated ~12 times. No new logic.

I don't hate it — "departure marker" reads better than "exit marker" in API docs. But it doubles the cognitive surface. A new developer sees both `createMarker` and `createDepartureMarker` in autocomplete and asks "what's the difference?" (Answer: nothing.) This should have been a breaking rename in v1.0, not an additive alias layer in v0.2.0.

### Trust Enhancers

New `TrustEnhancers` optional field on `ExitMarker`:
- `TimestampAttachment[]` — RFC 3161 TSA receipts
- `WitnessAttachment[]` — third-party countersignatures  
- `IdentityClaimAttachment[]` — opaque identity links

The "conduit-only" framing is smart — Cellar Door validates structure, not truth. The disclaimers are aggressive and correct (FCRA, GDPR, credit-reporting liability explicitly disclaimed on identity claims). Someone got legal advice, or at least thought hard about liability boundaries.

These are the right extension points. They don't bloat the core 7 fields but give consuming systems the hooks they need for graduated trust.

### Claim Store

`MemoryClaimStore` with `ingestMarker()`. In-memory only (no persistence). This is a building block for verification pipelines — ingest markers, query by subject/origin, detect patterns. Useful for the ethics/guardrails layer.

For production you'd want a persistent backing store, but an in-memory reference implementation with a clean interface is the right starting point.

### Telemetry

OpenTelemetry spans for sign/verify/ceremony. I asked for this. In a microservices environment, being able to trace a ceremony across services matters. This is a "shows maturity" feature — libraries that think about observability are libraries that have been run in production (or are designed by people who have).

### Test Coverage

291 → 399 tests across 24 files. +37% test growth. `fast-check` still in devDeps (property-based testing). This is solid coverage for the scope.

---

## What Still Concerns Me

### API Surface Is Larger, Not Smaller

I said "ship v1.0 with a smaller, stable API surface." Instead, v0.2.0 added Passage aliases, trust enhancers, claim store, telemetry, and P-256 support — all additive. The export count went up, not down.

The Passage layer was the opportunity to create a clean, minimal public API and push the old names behind a `/legacy` or `/internal` path. Instead, both vocabularies coexist. This is the "we can't break anyone" instinct, but at v0.2.0 you have no users to break. Be bold. Pick the names and commit.

### Still v0.x

v0.2.0 is better than v0.1.0, but semver 0.x still means "no stability guarantees." For a library that wants enterprise adoption (FIPS support, HSM guides, legal disclaimers), the version number undermines the maturity signals.

### Dual Vocabulary Creates Confusion

New contributor opens the codebase. Sees `ExitMarker` and `DepartureMarker`. Sees `signMarker` and `signDepartureMarker`. Sees `quickExit` and `quickDeparture`. Are these different? (No.) Is one deprecated? (Implicitly, but not marked `@deprecated`.) Which do I use? (The Passage names, probably, but the README examples use both.)

This needs a decision: either deprecate the old names with `@deprecated` JSDoc tags, or pick one vocabulary and remove the other.

### No npm Publish Evidence

The `npm install cellar-door-exit` instruction may still be aspirational. For my evaluation, I can clone and build. For my team's adoption, I need a published package with provenance attestation and a CHANGELOG.

### TypeScript Only

My backend team runs Go and Python. TypeScript is our frontend language. A protocol library that only exists in TypeScript limits where I can use it. The spec is language-agnostic; the implementation isn't.

---

## Revised Verdict

### Would-use: **Yes, for internal tooling and non-critical services.**

The Signer abstraction was the gate. It's open now. I can implement `Signer` against our AWS KMS, wire up the P-256 path for compliance, and instrument with our existing OpenTelemetry collector. The trust enhancers give me extension points without forking. 399 tests give me confidence the happy paths work.

For an internal agent lifecycle service — tracking agent departures, verifying markers, maintaining an audit trail — I'd use this today. The blast radius is contained, the DX is good, and the type system catches mistakes.

### Would-not-use: **Customer-facing APIs, regulated workflows, anything with an SLA.**

- v0.x means the API can break under me with no notice
- No published package means I'm pinning to a git commit
- Single language means my Go verification service needs a separate implementation
- The dual-name API surface suggests the maintainer hasn't committed to the final shape

### What Would Flip Me to Full Production

1. **v1.0** with semver commitment and CHANGELOG
2. **Pick one vocabulary** — Passage or Exit, not both. Mark the loser `@deprecated` today, remove in v2.
3. **npm publish** with provenance
4. **One more language** — Go or Python verification library, even read-only
5. **A second maintainer** or organizational backing

### Delta From Last Review

| Dimension | v0.1.0 (Feb 24) | v0.2.0 (Feb 25) | Trend |
|-----------|-----------------|-----------------|-------|
| TTHHW | A+ | A+ | → Stable |
| API Design | B+ | B+ | → Alias layer adds noise |
| Production Readiness | D | C+ | ↑ Signer + P-256 + OTel |
| Test Coverage | B+ | A- | ↑ 399 tests, 24 files |
| Trust | D+ | C | ↑ Better, but still v0.x, unpublished |
| Overall | Prototyping only | Internal tooling ready | ↑ Meaningful progress |

**Bottom line:** One release cycle moved this from "interesting demo" to "I'd put it in a non-critical service." That's real progress. The protocol design continues to outpace the packaging maturity, but the gap is closing. Ship a v1.0 with a clean API surface and I'll revisit for production.
