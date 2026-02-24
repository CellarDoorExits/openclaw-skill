# Coherence Report: Groups 8–10

**Date:** 2026-02-24  
**Scope:** cellar-door-entry source, cellar-door-exit source, modules, tests  
**Tests:** ✅ exit 291/291 passed · ✅ entry 77/77 passed

---

## Group 8: cellar-door-entry/src (13 source files + 1 test file)

Core ENTRY package implementing Arrival Markers. Files: types.ts, index.ts, arrival.ts, verify-departure.ts, sign.ts, continuity.ts, convenience.ts, admission-policy.ts, probation.ts, capability-scope.ts, claim-tracking.ts, revocation.ts, transfer.ts, validation.ts. Plus ENTRY_SPEC_v1.0.md.

**Key exports:** ArrivalMarker type, createArrivalMarker, signArrivalMarker, verifyArrivalMarker, verifyContinuity, quickEntry, evaluateAdmission, probation/capability/claim/revocation subsystems, verifyTransfer (passage).

## Group 9: cellar-door-exit/src (25+ source files)

Core EXIT package. Types define ExitMarker with 8 ExitTypes, 6 modules (A–F), ceremony state machine, KERI key management, ethics/guardrails, dispute resolution, privacy, batch operations, DID resolution, VC wrapping, visual hashing, git ledger, TSA anchoring, full-service orchestration.

## Group 10: cellar-door-exit modules + tests (8 module files, 18 test files)

Modules: lineage, reputation, origin-attestation, assets, continuity, dispute, trust. Tests cover all major subsystems with 291 tests across 18 files.

---

## Findings

### 🟢 PASS — No Issues

1. **Domain references:** All `cellar-door.dev` — no `.org` instances found.
2. **specVersion:** Correctly uses `EXIT_SPEC_VERSION = "1.1"` constant everywhere in exit package. Entry package doesn't use specVersion (correct — entry spec is separate).
3. **Import paths:** All use `.js` extensions consistently for ESM.
4. **Tests pass:** Both packages green (291 + 77 = 368 tests).
5. **Index exports match source:** All exported types/functions from both index.ts files correspond to actual definitions in source files. Verified manually.
6. **Type consistency across packages:** Entry imports `ExitMarker` from `cellar-door-exit` correctly. Uses `verifyMarker`, `fromJSON`, `generateKeyPair`, `didFromPublicKey`, `publicKeyFromDid`, `sign`, `verify` — all valid exit exports.

### 🟡 LOW — Minor Issues

7. **Transfer vs Passage terminology:** transfer.ts is correctly documented with JSDoc noting the rename to Passage in v0.2.0. Index.ts comment says "Passage (exported as Transfer names for backward compat)". The test file still uses section header `// ─── Transfer ───`. The spec (ENTRY_SPEC_v1.0.md §2) explicitly retires "transfer" — code should eventually follow. **Status: acceptable, tracked for v0.2.0.**

8. **Duplicate type names in modules/index.ts:** `modules/index.ts` re-exports `DisputeType` and `ResolutionStatus` from `modules/dispute.ts`, while the main `index.ts` also re-exports via `export * from "./modules/index.js"`. The top-level `dispute.ts` exports a *different* `DisputeState` type. No actual name collision since the module dispute types (`DisputeType`, `ResolutionStatus`) and the top-level dispute types (`DisputeState`, `DisputeRecord`, `DisputeResolution`) are distinct names. **But conceptually confusing** — two dispute systems coexist (Module C disputes in types.ts vs standalone dispute.ts vs modules/dispute.ts).

9. **Module naming inconsistency:** types.ts calls Module C "Dispute Bundle" and Module F "Cross-Domain Anchoring", but modules/dispute.ts calls its output "Module F: Dispute Record". The module letter assignments conflict — is dispute Module C or Module F? Module C in types.ts is the dispute bundle; modules/dispute.ts claims to be "Module F" but is actually a separate dispute-tracking construct unrelated to Module F (cross-domain anchoring).

### 🟠 MEDIUM — Should Fix

10. **modules/dispute.ts "Module F" label is wrong:** The file header says `Module F: Dispute Record` but Module F in types.ts is Cross-Domain Anchoring (`ModuleF` with anchors/registryEntries). This dispute module doesn't correspond to any of the 6 defined modules (A–F). It should either be relabeled (e.g., "Dispute Tracking Module" without a letter) or mapped correctly.

11. **ExitType handling — 8 values not fully tested in entry package:** The admission-policy.ts handles `allowedExitTypes` as string comparison, which works for all 8 values. However, the entry test file only exercises `voluntary` and `emergency` exit types. No test verifies behavior with `constructive`, `acquisition`, `directed`, `platform_shutdown`, or `keyCompromise` exit types flowing through the entry pipeline.

12. **ArrivalMarker type has `type` field in code but not in interface:** `arrival.ts` line 56 adds `type: "ArrivalMarker"` to the body, but the `ArrivalMarker` interface in `types.ts` doesn't declare a `type` field. This works at runtime (extra properties) but means TypeScript won't catch typos and the field isn't documented.

---

## Compressed Summary (~500 words)

Both cellar-door-entry (77 tests) and cellar-door-exit (291 tests) pass all tests. The packages are well-integrated: entry correctly imports exit's types (ExitMarker, crypto functions, verifyMarker, fromJSON) and all index.ts exports correspond to actual source definitions. Import paths consistently use `.js` extensions for ESM. All domain references use `cellar-door.dev` (no `.org`). The exit package correctly uses `EXIT_SPEC_VERSION = "1.1"` throughout, and the entry package has its own context constant `ENTRY_CONTEXT_V1`.

The primary structural concern is **dispute concept fragmentation**: three separate dispute constructs exist — (1) `ModuleC` in types.ts with `Dispute` and `ChallengeWindow` interfaces for the EXIT marker's dispute bundle, (2) top-level `dispute.ts` with `DisputeRecord`/`DisputeResolution` for post-exit dispute resolution, and (3) `modules/dispute.ts` with `DisputeModule` for dispute tracking. These serve different purposes but the module file incorrectly labels itself "Module F" when Module F is actually Cross-Domain Anchoring. This should be relabeled.

The Transfer→Passage rename is properly tracked with JSDoc deprecation notices and comments in index.ts. The spec explicitly retires "transfer" terminology. Code rename is planned for v0.2.0 — acceptable.

A minor type gap exists: `arrival.ts` adds `type: "ArrivalMarker"` to created objects, but the `ArrivalMarker` interface doesn't declare this field. This should be added to the interface for type safety and documentation.

Test coverage for the entry package is solid for core flows but doesn't exercise all 8 ExitType values through the admission pipeline — only `voluntary` and `emergency` are tested. The exit package has comprehensive coverage across 18 test files.

Cross-package type consistency is clean: entry's `VerificationResult` (valid + errors) mirrors exit's pattern. The `ExitMarker` type is imported directly from exit, not redefined. Continuity verification correctly checks departure reference, subject DID, origin, temporal ordering, and cryptographic validity.

**Action items:** (1) Relabel modules/dispute.ts from "Module F" to a neutral name. (2) Add `type` field to ArrivalMarker interface. (3) Add entry tests for all 8 ExitType values. All are low-to-medium priority — no blockers.
