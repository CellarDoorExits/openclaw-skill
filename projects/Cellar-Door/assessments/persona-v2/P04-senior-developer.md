# P04: Senior Backend Developer Review — EXIT Protocol DX

**Reviewer Persona:** Staff Engineer, Backend Platform Team  
**Date:** 2026-02-24  
**Documents Reviewed:** README.md, GETTING_STARTED.md, package.json, src/types.ts, src/index.ts, DECISIONS.md  
**Format:** Developer Experience Review

---

## Time to Hello World

**~30 seconds to a working signed marker.** Not exaggerating.

```typescript
import { quickExit, toJSON } from "cellar-door-exit";
const { marker, identity } = quickExit("did:web:platform.example");
console.log(toJSON(marker));
```

That's a real, cryptographically signed EXIT marker. `quickExit` generates an Ed25519 keypair, creates the marker, signs it, and returns both. One function call. The Getting Started guide (GETTING_STARTED.md) delivers on the "30 seconds" promise.

The step-by-step path (`generateIdentity` → `createMarker` → `signMarker` → `verifyMarker`) takes about 2 minutes and gives you full control. Both paths are well-documented.

**Time-to-hello-world: A+.** This is better DX than most crypto libraries I've used.

---

## API Design

### What works well

**Naming is intuitive.** `createMarker`, `signMarker`, `verifyMarker`, `quickExit`, `quickVerify`, `fromJSON`, `toJSON`. No jargon. No `initializeCeremonyStateMachineContext()`. The API reads like what it does.

**Progressive disclosure.** Three tiers:
1. `quickExit()` — one line, everything generated
2. `generateIdentity()` + `createMarker()` + `signMarker()` — explicit control
3. `CeremonyStateMachine` + modules + anchoring — full ceremony

You can start at tier 1 and move down as needed. This is good library design.

**TypeScript types are excellent.** `types.ts` is ~400 lines of well-documented interfaces and enums. Every field has a JSDoc comment explaining what it is and why. The `ExitType` enum has inline comments for each variant. `ExitMarker` interface has clear sections: core fields, compliance fields, optional modules, ethics fields, checkpoint fields. I could understand the data model from `types.ts` alone without reading the spec.

**Enums over string literals.** `ExitType.Voluntary` instead of `"voluntary"` — catches typos at compile time. `ExitStatus`, `CeremonyState`, `ContinuityProofType`, `StatusConfirmation`, `CoercionLabel` — all enums.

**Error classes are structured.** `ValidationError`, `CeremonyError`, `SigningError`, `VerificationError`, `StorageError` — each with a `code` field. You can catch programmatically:

```typescript
try { fromJSON(untrusted); }
catch (e) { if (e instanceof ValidationError) { /* handle */ } }
```

This is better than most libraries that throw generic `Error` with string matching.

**The export surface (index.ts) is massive but organized.** ~120 exports grouped by concern: core types, crypto, markers, proofs, validation, ceremony, errors, convenience, VC wrapper, modules, anchoring, storage, chain adapters, privacy, DID resolution, registry, batch, interop, KERI, pre-rotation, ethics, guardrails, git ledger, TSA, full-service, key compromise, disputes, visual. It's a lot, but the grouping comments make it navigable. `quickExit` and `quickVerify` are all most users need.

### What concerns me

**The dependency claim is misleading.** README says "Minimal core" and the design principles emphasize minimalism. But `package.json` lists 5 runtime dependencies: `@noble/curves`, `@noble/ed25519`, `@noble/hashes`, `@noble/ciphers`, `commander`. The `@noble` family is excellent (audited, no dependencies themselves), and `commander` is for the CLI only. So it's *nearly* zero-dep for library usage — but the README should be explicit about this rather than implying zero dependencies.

**120+ exports is a large API surface for v0.1.0.** The library exposes everything: from `quickExit` to `initLedger` to `renderDoorSVG` to `flagCompromisedPlatformMarkers`. For a v0.1.0, this signals that the API is not yet settled. I'd expect a lot of this to change before v1.0. The lack of a `@deprecated` story or API stability guarantees makes me nervous about building on it.

**`signMarker(marker, privateKey, publicKey)` takes raw keys.** The Getting Started guide shows `privateKey` as a returned value from `generateIdentity()`. In production, private keys should never be in JavaScript memory as hex strings. There's no `Signer` interface that could abstract over HSMs, Cloud KMS, or hardware tokens. This is fine for prototyping but architecturally limits production use.

**Ceremony state machine API is imperative.** You call `csm.declareIntent(...)`, `csm.snapshot()`, `csm.signMarker(...)`, `csm.depart()` in sequence. The state machine rejects invalid transitions, which is good. But there's no builder pattern, no fluent API, no way to express "run the cooperative ceremony" as a single high-level call (except `quickExit`, which skips the ceremony). For the full ceremony, you're manually driving each state transition. This is correct but verbose for common cases.

**`departAndAnchor()` and `departAndVerify()` exist** (full-service.ts exports) — these appear to be the high-level convenience wrappers. Good. But they're not featured in the Getting Started guide, which only shows the low-level path or `quickExit`. The guide should lead with `departAndAnchor` for anyone wanting the full flow.

---

## Zero Dependencies — Real?

**No.** 5 runtime deps:

| Dependency | Purpose | Own deps? |
|------------|---------|-----------|
| `@noble/ed25519` | Signing | 0 |
| `@noble/curves` | Curve ops | `@noble/hashes` |
| `@noble/hashes` | SHA-256 | 0 |
| `@noble/ciphers` | XChaCha20-Poly1305 | 0 |
| `commander` | CLI | 0 |

The `@noble` family is about as close to "zero deps" as you get in the crypto space — audited by Cure53, zero transitive dependencies, pure JS. `commander` is CLI-only and wouldn't be loaded in library usage. So the practical dependency footprint is small and high-quality. But "zero deps" it is not.

DevDependencies include `@langchain/core`, `fast-check`, `tsup`, `tsx`, `typescript`, `vitest`, `zod` — standard tooling.

---

## Production Readiness

**Not production-ready.** Specific concerns:

1. **v0.1.0** — the version number says "this is experimental." Semver v0.x means "anything can change."

2. **No published package.** The package.json has `"name": "cellar-door-exit"` but I see no evidence it's published to npm. The README says `npm install cellar-door-exit` but this may be aspirational.

3. **No rate limiting, no retry logic, no circuit breakers** in the TSA integration. `requestTimestamp()` hits an external HTTP endpoint (`freetsa.org`) with no backoff. In production, this would fail under load.

4. **Git ledger runs `git` commands.** `anchorToGit()` shells out to git. In a containerized production environment, this may not be available or desirable. The security note about branch name validation (Spec §11.4.5) suggests injection risks were considered, but shelling out to git is inherently fragile.

5. **No connection pooling, no caching** for DID resolution. `resolveDid()` presumably does network calls for `did:web`. In a high-throughput verification pipeline, this would bottleneck.

6. **291 tests is solid** for the scope, and `fast-check` in devDeps suggests property-based testing. But no benchmark suite is published, no load testing, no fuzzing harness.

---

## Error Handling

Structured errors with codes is the right approach. The hierarchy (`ExitError` base → `ValidationError` / `SigningError` / `VerificationError` / `CeremonyError` / `StorageError`) covers the failure modes.

`verifyMarker` returns `{ valid: boolean, errors: string[] }` instead of throwing — correct choice for verification, where failure is a normal outcome, not an exception.

`fromJSON` throws `ValidationError` on invalid input — correct for parsing, where invalid input is exceptional.

This dual approach (return-errors for verification, throw for parsing) is thoughtful and matches how I'd use the library.

---

## What I'd Want Before Using in Production

1. **Signer abstraction.** `interface Signer { sign(data: Uint8Array): Promise<Uint8Array> }` that I can implement for my KMS. Currently, raw keys are the only option.
2. **API stability commitment.** v1.0 with semver guarantees. Or at minimum, a `@stable` / `@experimental` annotation on exports.
3. **Published npm package** with provenance attestation.
4. **Python and Go implementations.** My team uses TypeScript for frontends, not backends.
5. **Async-first API.** `signMarker` appears synchronous. Ed25519 is fast enough for this, but a `Signer` interface should be async to support remote signing.
6. **OpenTelemetry spans** for ceremony steps, signing, verification, and TSA calls.

---

## Verdict

**Would-use for prototyping. Would-not-use in production (today).**

The DX is genuinely good — best-in-class for a crypto protocol library. `quickExit` to a working marker in one line. Types are excellent. Error handling is thoughtful. The progressive disclosure from simple to complex is well-designed.

But v0.1.0 with a solo maintainer, no npm publish, no signer abstraction, and 120+ exports on an unstable API is not something I'd put in a production service. I'd use it to build a proof-of-concept, demonstrate the concept to stakeholders, and then either wait for maturation or build an internal implementation from the spec.

The architecture decisions (DECISIONS.md) are well-reasoned. D-006 (disputes never block exit) is the right call. D-009 (explicit self-attestation) is smart. D-012 (no public registry) simplifies deployment. These decisions show someone who's thought carefully about the operational realities. The protocol is more mature than the implementation.

**If I were advising the maintainer:** Ship a v1.0 with a smaller, stable API surface (just the convenience layer + types + verification). Move everything else to `cellar-door-exit/advanced` or similar. Add a `Signer` interface. Publish to npm with provenance. Get a second implementation in Python or Go. The protocol deserves better packaging than it currently has.
