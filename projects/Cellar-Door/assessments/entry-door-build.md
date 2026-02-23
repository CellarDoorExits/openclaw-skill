# Entry-Door Build Summary

**Date:** 2026-02-23
**Status:** ✅ Complete (Tier 1)
**Location:** `cellar-door-entry/`

## What Was Built

`cellar-door-entry` v0.1.0 — the arrival counterpart to `cellar-door-exit`. Verifies departure markers and creates linked, signed arrival records establishing identity continuity across domains.

## Modules

| File | Purpose |
|------|---------|
| `src/types.ts` | `ArrivalMarker` interface, `ENTRY_CONTEXT_V1`, admission types, continuity result types |
| `src/verify-departure.ts` | `verifyDeparture()` / `verifyDepartureJSON()` — wraps EXIT's `verifyMarker()` |
| `src/arrival.ts` | `createArrivalMarker()` — verifies EXIT marker, creates linked arrival with content-addressed ID |
| `src/sign.ts` | `signArrivalMarker()` / `verifyArrivalMarker()` — Ed25519 signing for arrival markers |
| `src/continuity.ts` | `verifyContinuity()` — checks ref match, subject DID match, origin match, temporal order, crypto validity |
| `src/convenience.ts` | `quickEntry()` — one-shot parse → verify → create → sign → check continuity |
| `src/index.ts` | Re-exports everything |

## Tests (17/17 passing)

- Verify valid/tampered EXIT markers
- Parse and verify from JSON
- Create linked arrival markers with auto/reviewed/conditional admission
- Sign and verify arrival markers, reject tampered
- Continuity: reject mismatched ref, mismatched subject, mismatched origin, temporal violation
- Full round-trip: `quickEntry()` end-to-end
- Full lifecycle: generate identity → exit → arrive → sign → verify → continuity

## Design Decisions

- **Peer dependency on `cellar-door-exit`** — entry doesn't bundle exit, consumers install both
- **`@noble/hashes`** as direct dependency (for content-addressed IDs)
- **Admission types**: `automatic` (valid exit), `reviewed` (invalid exit), `conditional` (with conditions array)
- **Arrival markers are unsigned by default** — destination signs them explicitly
- **`quickEntry()`** generates a fresh keypair for convenience; real usage would use destination's persistent key
- **Context URI**: `https://cellar-door.dev/entry/v1` (distinct from exit's `cellar-door.org`)

## Not Built (Tier 2+)

- Entry ceremony state machine (APPROACHING → VERIFYING → ADMITTED → ACTIVE)
- Delegation chain verification (only same-DID matching)
- Credential import / vocabulary mapping
- Policy engine for admission decisions
- CLI tooling
- Privacy / selective disclosure
