# Cellar Door EXIT — Source Code Consistency Check (Groups 9-10)

**Date:** 2026-02-24
**Scope:** All `.ts` source files in `cellar-door-exit/src/` (excluding tests)
**Spec version target:** 1.1

---

## Findings

| ID | Severity | Description | Files | Suggested Fix |
|----|----------|-------------|-------|---------------|
| CC-01 | **HIGH** | `VerificationResult` (interface) exported from `proof.ts` but NOT re-exported from `index.ts`. Consumers importing from the package root cannot access this type. | `proof.ts`, `index.ts` | Add `type VerificationResult` to the `proof.js` re-exports in `index.ts` |
| CC-02 | **HIGH** | `ValidationResult` (interface) exported from `validate.ts` but NOT re-exported from `index.ts`. Same issue as CC-01. | `validate.ts`, `index.ts` | Add `type ValidationResult` to the `validate.js` re-exports in `index.ts` |
| CC-03 | **HIGH** | New v1.1 Dispute fields (`disputeExpiry`, `resolution`, `arbiterDid`) are defined in `types.ts` → `Dispute` interface but **never validated** in `validate.ts`. A marker with invalid `resolution` values or malformed `disputeExpiry` dates would pass validation. | `types.ts`, `validate.ts` | Add validation for `Dispute` sub-fields when `ModuleC.disputes` is present |
| CC-04 | **HIGH** | `completenessAttestation` field is defined in `types.ts` → `ExitMarker` but **never validated** in `validate.ts`. Malformed attestations (missing `attestedAt`, negative `markerCount`, empty `signature`) pass silently. | `types.ts`, `validate.ts` | Add validation for `completenessAttestation` structure when present |
| CC-05 | **HIGH** | New `ExitType` values (`PlatformShutdown`, `Directed`, `Constructive`, `Acquisition`) have **zero test coverage** across all 17 test files. Not a single test creates a marker with these types. | `types.ts`, `__tests__/*` | Add test cases for each new ExitType, especially edge cases (e.g., PlatformShutdown + batch, Constructive + coercion detection) |
| CC-06 | **MEDIUM** | `completenessAttestation` has **zero test coverage**. No test creates, validates, or serializes a marker with this field. | `types.ts`, `__tests__/*` | Add tests for creating markers with completenessAttestation and round-tripping through JSON |
| CC-07 | **MEDIUM** | `disputeExpiry`, `resolution`, `arbiterDid` fields on `Dispute` have **zero test coverage**. | `types.ts`, `__tests__/*` | Add tests for disputes with expiry, resolution states, and arbiter assignment |
| CC-08 | **MEDIUM** | Module type system is **dual-track and inconsistent**: Core `types.ts` defines `ModuleA`–`ModuleF` (structurally typed, no `moduleType` discriminant), while `modules/*.ts` defines independent types (`ReputationModule`, `DisputeModule`, `AssetManifestModule`, `ContinuityModule`, `OriginAttestationModule`) each with a `moduleType` string discriminant. These two type systems are parallel and never unified. | `types.ts`, `modules/*.ts` | Either: (a) add `moduleType` discriminants to ModuleA-F, or (b) make module files use ModuleA-F types directly. Current dual system will confuse consumers. |
| CC-09 | **MEDIUM** | `modules/dispute.ts` defines its own `DisputeType`, `ResolutionStatus`, and `DisputeModule` types that **shadow/overlap** with `types.ts` → `Dispute` interface. The `resolution` field in `types.ts` uses literal union `"settled" | "expired" | "withdrawn"` while `modules/dispute.ts` uses `ResolutionStatus = "open" | "resolved" | "escalated" | "withdrawn"` — different values for overlapping concepts. | `types.ts`, `modules/dispute.ts` | Reconcile the two dispute models. Likely the `types.ts` Dispute (core) and `modules/dispute.ts` DisputeModule (extended) should reference a shared resolution enum. |
| CC-10 | **MEDIUM** | `context.ts` defines `EXIT_CONTEXT` JSON-LD object with terms for `lineage`, `reputation`, `originAttestation`, `assets` etc., but does **not** include terms for `specVersion`, `completenessAttestation`, `selfAttested`, `emergencyJustification`, `legalHold`, `preRotationCommitment`, `sunsetDate`, or `coercionLabel`. JSON-LD processors would treat these as opaque properties. | `context.ts`, `types.ts` | Add JSON-LD term definitions for all v1.1 fields in `EXIT_CONTEXT` |
| CC-11 | **LOW** | `commander` import in `cli.ts` does not use `.js` extension: `import { Command, InvalidArgumentError } from "commander"`. This is correct for an npm package, but it's the only non-`.js` non-`@noble` import — worth noting for consistency awareness. All internal imports correctly use `.js` extensions. | `cli.ts` | No action needed — npm packages don't use `.js` extensions |
| CC-12 | **LOW** | No circular imports detected. Import graph is clean: `types.ts` is a leaf, `crypto.ts` is a leaf, `marker.ts` imports both, `proof.ts` imports `crypto`+`marker`+`validate`+`types`, `ceremony.ts` imports `types`+`crypto`+`marker`+`proof`. No cycles. | All source files | No action needed |
| CC-13 | **LOW** | Naming consistency is **good**: "lineage" (not "LINE"), ExitStatus (not "Signamancy"/"REPUTE"), no references to "Passage", "Transfer", "PLEDGE", or "Insurance" found anywhere in source. Terminology is consistent throughout. | All source files | No action needed |
| CC-14 | **LOW** | `specVersion` is consistently `"1.1"` everywhere: defined as `EXIT_SPEC_VERSION = "1.1"` in `types.ts`, used in `marker.ts` (creation), `validate.ts` (validation), `key-compromise.ts` (compromise markers). No hardcoded `"1.0"` found. | `types.ts`, `marker.ts`, `validate.ts`, `key-compromise.ts` | No action needed |
| CC-15 | **LOW** | `EXIT_SPEC_v1.1.md` spec document does **not exist** at `cellar-door-exit/EXIT_SPEC_v1.1.md`. Cannot cross-check code against spec. | N/A | Create or locate the v1.1 spec document for future consistency checks |
| CC-16 | **LOW** | `validate.ts` checks Module B (`stateSnapshot.stateHash`) but does **not** validate Module C (dispute), Module D (economic), Module E (metadata), or Module F (crossDomain) structures when present. | `validate.ts` | Add structural validation for all optional modules |

---

## Summary

- **CRITICAL:** 0
- **HIGH:** 5 (CC-01 through CC-05)
- **MEDIUM:** 4 (CC-06 through CC-10)
- **LOW:** 6 (CC-11 through CC-16)

### Key Themes

1. **Export gaps** (CC-01, CC-02): Two public types not exported from package root.
2. **Validation gaps** (CC-03, CC-04, CC-16): New v1.1 fields defined but not validated.
3. **Test coverage gaps** (CC-05, CC-06, CC-07): New ExitType values and v1.1 fields untested.
4. **Type system dualism** (CC-08, CC-09): Two parallel module type systems that should be reconciled.
5. **JSON-LD context incomplete** (CC-10): Context document lags behind type definitions.
