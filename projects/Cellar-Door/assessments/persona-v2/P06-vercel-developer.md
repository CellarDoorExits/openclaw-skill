# P06: Vercel/Next.js Developer — Code Review

**Persona:** Full-stack dev building AI SaaS on Vercel. Ships with `ai` SDK, deploys to Edge. Cares about bundle size, patterns, and DX.
**Date:** 2026-02-24
**Files reviewed:** `integrations/vercel-ai-sdk/README.md`, `cellar-door-exit/README.md`, `cellar-door-exit/package.json`

---

## Does it follow Vercel AI SDK patterns?

**Yes — this is well-done.** The integration uses the two patterns I'd expect:

1. **Tools** (`exitMarkerTool`, `verifyAndAdmitAgentTool`, etc.) — standard Vercel AI SDK tool definitions that work with `generateText` and `streamText`. This is the canonical pattern.

2. **`onFinish` middleware** (`createExitOnFinish`, `createTransitOnFinish`) — hooks into the existing lifecycle. `onFinish` is exactly where I'd put departure logic.

```ts
const result = await streamText({
  model: openai("gpt-4o"),
  prompt: "Hello!",
  onFinish: createExitOnFinish({ origin: "my-agent" }),
});
```

That's clean. It doesn't fight the SDK; it extends it. The `withExitMarker(originalOnFinish, opts)` wrapper for composing with existing `onFinish` callbacks shows they thought about real-world usage where I already have `onFinish` logic.

The ENTRY tools (`verifyAndAdmitAgentTool`, `evaluateAdmissionTool`, `verifyTransferTool`) follow the same tool pattern. `createTransitOnFinish` for full EXIT+ENTRY in one callback is the right convenience wrapper.

## Edge runtime compatibility?

**Unclear — and this is a problem.** The README says nothing about Edge runtime. Looking at `package.json`, the core library depends on:

- `@noble/curves` — pure JS, Edge-compatible ✅
- `@noble/ed25519` — pure JS, Edge-compatible ✅
- `@noble/hashes` — pure JS, Edge-compatible ✅
- `@noble/ciphers` — pure JS, Edge-compatible ✅
- `commander` — CLI framework, NOT Edge-compatible ❌

The `commander` dependency is for the CLI (`src/cli.ts`). Since the library has separate entry points (`dist/index.js` vs `dist/cli.js`) and uses `tsup` with tree-shaking, `commander` *might* get shaken out when I import only the library API. But the `exports` field in `package.json` just has `.` pointing to `dist/index.js` — if the index re-exports CLI stuff, `commander` comes along for the ride.

**The `@noble/*` stack is the right choice** — these are the gold standard for Edge-compatible cryptography. But the build/export configuration needs verification. I'd need to test `import { quickExit } from "cellar-door-exit"` in an Edge Function to confirm.

The spec also mentions RFC 3161 TSA timestamp requests (`POST` to `https://freetsa.org/tsr`) and git ledger anchoring — these are obviously not Edge-compatible, but they're optional features so that's fine.

## Bundle size?

**Can't confirm, but the dependency profile is promising.** The `@noble/*` family is known for being small:

- `@noble/ed25519` — ~5KB minified
- `@noble/hashes` — ~15KB for SHA-256
- `@noble/curves` — ~40KB (but may tree-shake if only Ed25519 is used)
- `@noble/ciphers` — ~10KB for XChaCha20

Core library logic (marker creation, signing, verification) is probably another 10-20KB. So rough estimate: **50-80KB minified** for the core path, before gzip. That's acceptable for a server-side AI route handler. For client-side usage it's heavier than I'd like, but EXIT markers are a server-side concern.

**Missing from package.json:** No `sideEffects: false` field. This matters for tree-shaking in Next.js/Webpack. Without it, bundlers may include more than necessary.

## Is this the right abstraction level?

**For the EXIT side, yes. For ENTRY, I have questions.**

The tool + middleware pattern is the right abstraction for Vercel AI SDK. I don't want to think about ceremony state machines or DID key management when I'm building a chat endpoint. `createExitOnFinish` handles that.

But the admission policies (OPEN_DOOR, STRICT, EMERGENCY_ONLY) feel like they belong in my API middleware layer, not in AI SDK tool calls. The `evaluateAdmissionTool` exposes policy evaluation as an LLM tool — meaning the *model* decides which policy to apply. In my SaaS, I want the *platform* to decide admission policy, not GPT-4.

The three admission presets are also quite limited for production. STRICT requires "voluntary only, <24h old, requires lineage + stateSnapshot" — that's very opinionated. I'd want to define custom policies, which means dropping down to the core library.

## Other observations

- **Dual package support** (ESM + CJS via tsup) — good, my Next.js app uses ESM but some tooling still needs CJS
- **TypeScript types** (`dist/index.d.ts`) — essential, present
- **v0.1.0** — this is pre-1.0, so I'd expect breaking changes. The Vercel AI SDK itself moves fast; this integration will need to track it
- **The disclaimer** about automated admission decisions is appropriate and honest

---

## Verdict: **Ship — with caveats**

The Vercel AI SDK integration follows the right patterns, the dependency profile is Edge-friendly (pending `commander` tree-shake verification), and the DX for basic EXIT markers is good. I'd ship this in a route handler today.

**Caveats before production:**
1. **Verify Edge runtime compatibility** — test in `export const runtime = 'edge'` route
2. **Add `sideEffects: false`** to package.json for tree-shaking
3. **Bundle size audit** — run `@next/bundle-analyzer` after integration
4. **Custom admission policies** — the three presets won't cover my SaaS use cases; I'll need the core library for policy logic
5. **The v0.1.0 risk** — pin the version, expect breaking changes, don't build critical flows on this yet
