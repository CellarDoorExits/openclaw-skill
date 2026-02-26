# P06r: Vercel/Next.js Developer — v0.2.0 Re-Review

**Persona:** Full-stack dev building AI SaaS on Vercel. Ships with `ai` SDK, deploys to Edge. Cares about bundle size, patterns, and DX.
**Date:** 2026-02-25
**Previous review:** v0.1.0 — "Ship with caveats" (2026-02-24)
**Version reviewed:** v0.2.0

---

## What changed since v0.1.0?

| Addition | My take |
|----------|---------|
| ECDSA P-256 via `createSigner()` | ✅ Huge. FIPS compliance unlocks enterprise. P-256 also has WebCrypto alignment, which matters for Edge. |
| Signer abstraction (`Signer` interface) | ✅ This is what I wanted — HSM/KMS pluggability without the library caring. |
| Passage API (`createDepartureMarker`, etc.) | ✅ Better naming. "Passage" reads like an API surface, not protocol internals. |
| Claim store (`MemoryClaimStore`, `ingestMarker()`) | ⚠️ In-memory only. Fine for dev/test, but I'll need a durable store for prod. |
| OpenTelemetry spans | ✅ For an AI SaaS running on Vercel, OTel is table stakes. Spans on sign/verify/ceremony are exactly what I'd instrument. |
| Trust enhancers (timestamps, witnesses, identity claims) | ℹ️ Marked conduit-only. Not something I'd touch yet but good to see the surface area growing. |
| 399 tests across 24 files | ✅ Up from wherever it was. That's a real test suite. |

## Previous caveats — status check

### 1. Edge runtime compatibility
**Still unaddressed in docs.** But: the P-256 addition via `@noble/curves` stays pure-JS, and the `Signer` abstraction means I could plug in `crypto.subtle` (WebCrypto, native in Edge) as a backend. The dependency profile remains Edge-safe — `commander` is still CLI-only and shouldn't leak into library imports given the separate `src/cli.ts` entry in tsup. I'd still want to *test* it, but I'm less worried now.

### 2. `sideEffects: false`
**Still missing from `package.json`.** This is a one-line fix. Come on.

### 3. Bundle size audit
**Still no published numbers.** The addition of P-256 via `@noble/curves` adds weight — the full curves package is ~40KB, but if both Ed25519 and P-256 are used, tree-shaking won't save you. Estimate bumps to **60-90KB minified** for the core path. Still acceptable server-side. Still too heavy for client.

### 4. Custom admission policies
**Not mentioned in v0.2.0 changes.** Passage API is a rename/reorganization, not new policy flexibility. My original concern stands — the presets are too rigid for real SaaS.

### 5. v0.1.0 risk → v0.2.0
**Version bump is good signal.** They're iterating. The Passage API rename in a 0.x is exactly the kind of breaking change I expected. Better now than at 1.0.

## New observations

### Signer abstraction is the real win
```typescript
createSigner({ algorithm: "P-256" })
```
This decouples signing from key management. For my Vercel SaaS, I'd write a `VercelKMSSigner` that wraps my cloud KMS. The library doesn't need to know — it just calls `sign()`. This is the right pattern for an SDK that'll be embedded everywhere.

### OTel in a 0.2.0 library is ambitious
Most libraries at this stage don't bother. The fact that sign/verify/ceremony all emit spans means I get EXIT visibility in my Datadog/Axiom dashboards for free. For debugging agent departure flows in production, this is genuinely useful.

### Passage API naming
`createDepartureMarker` > `createMarker`. Self-documenting. When I'm reading a route handler at 2 AM, "departure marker" tells me what's happening. "Marker" doesn't. Good rename.

### devDependencies note
`@langchain/core` and `zod@4.3.6` in devDeps — they're testing interop with LangChain and Zod v4. Smart. These are the two ecosystems this library will collide with in real AI apps. Zod v4 is new; good to see they're already on it.

### What's still missing for my stack
- **Middleware pattern for Next.js** — I want `withExitVerification()` as Next.js middleware that checks incoming agent markers before they hit my API routes. The `onFinish` pattern handles *outgoing* exits. Incoming verification should be middleware, not a tool call.
- **Streaming compatibility** — does `createExitOnFinish` work with `streamText`'s `onFinish`? The v1 review assumed yes; still no explicit confirmation.
- **Rate limiting / replay protection** — `ClaimStore.ingestMarker()` could deduplicate, but there's no built-in replay window. In a Vercel serverless context where each invocation is stateless, the in-memory store resets every cold start.

---

## Verdict: **Ship** ✅

Upgrading from "ship with caveats" to **ship**. The v0.2.0 additions address the most important architectural concern from my first review: the signer abstraction makes this production-viable for enterprise deployments (FIPS, KMS, HSM). OTel is gravy. Passage API improves DX.

Two of my five original caveats are resolved (signer/KMS story, version maturity signal). Two are trivial (`sideEffects`, bundle audit). One remains real but livable (custom admission policies — I'll use the core library).

**What I'd do today:**
1. `npm install cellar-door-exit@0.2.0`
2. Use Passage API in my route handlers with `createSigner({ algorithm: "P-256" })`
3. Wire OTel spans into my existing Axiom pipeline
4. Build my own `NextMiddleware` wrapper for incoming marker verification
5. File an issue for `sideEffects: false` — it's free performance

**Risk level:** Low for server-side route handlers. Don't put this in client bundles. Don't rely on `MemoryClaimStore` surviving cold starts.
