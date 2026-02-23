# cellar-door-entry — Production Expansion Summary

*Date: 2026-02-23*

## What Was Done

Expanded `cellar-door-entry` from a minimal arrival marker library (5 source files, ~17 tests) to a production-grade entry protocol with **7 new modules** and **74 passing tests**.

## New Modules

### 1. `admission-policy.ts` — AdmissionPolicy Engine
- Composable policy rules: `requireVerifiedDeparture`, `maxDepartureAge`, `allowedExitTypes`, `blockedOrigins`, `requiredModules`
- `evaluateAdmission(exitMarker, policy)` → `{ admitted, conditions, reasons }`
- Three preset policies: `OPEN_DOOR`, `STRICT`, `EMERGENCY_ONLY`
- Duration parser for human-friendly time strings (`24h`, `7d`, `30m`)

### 2. `probation.ts` — Probationary Status Tracking
- `ProbationConfig`: duration, restrictions, reviewRequired
- `createProbationaryArrival()` — creates arrival with embedded probation metadata
- `isProbationComplete()` — time-based probation check
- Probation stored as a field on `ArrivalMarker`, not a separate record

### 3. `capability-scope.ts` — Capability Scoping
- `CapabilityScope`: allowed/denied capability lists with optional expiry
- `scopeFromExitMarker()` — derives capabilities from EXIT modules (A→F)
- `createRestrictedScope()` / `mergeScopes()` — composition with denied-wins semantics

### 4. `claim-tracking.ts` — Departure Claim Tracking
- `ClaimStore` interface for pluggable backends
- `InMemoryClaimStore` — Map-based implementation
- Claim, check, revoke operations with bidirectional index
- Prevents replay attacks (each EXIT marker claimed at most once)

### 5. `revocation.ts` — Arrival Revocation
- `createRevocationMarker()` — signed revocation linked to arrival
- `verifyRevocationMarker()` — cryptographic verification
- `isRevoked()` — check against revocation list

### 6. `transfer.ts` — End-to-End Transfer Verification
- `verifyTransfer(exit, arrival)` — verifies EXIT sig, ARRIVAL sig, and continuity in one call
- `TransferRecord` with transfer time, verification status, and error collection
- The composable TRANSFER primitive from EXIT + ENTRY

### 7. `validation.ts` — Input Validation
- `validateArrivalMarker()` — validates all fields
- Size limits (1MB, consistent with exit)
- DID format, ISO 8601 timestamp, URN ID format validation
- Context, admissionType, verificationResult structure checks

## Type Extensions

- `ArrivalMarker` gained `probation?: ProbationInfo` and `capabilityScope?: CapabilityScope` fields
- `CreateArrivalOpts` extended to pass probation and capability scope through

## Test Coverage

**74 tests total**, all passing:
- Original tests: 17 (verifyDeparture, createArrival, sign/verify, continuity, quickEntry, lifecycle)
- Admission policy: 10 (presets, custom, composition, duration parsing)
- Probation: 4 (create, incomplete, complete, no-probation)
- Capability scope: 6 (derive, restrict, merge, edge cases)
- Claim tracking: 8 (claim, double-claim, revoke, reclaim, size, clear)
- Revocation: 4 (create+verify, tamper detection, isRevoked, missing proof)
- Transfer: 5 (valid, tampered exit, tampered arrival, mismatched, unsigned)
- Validation: 13 (all field types, size limits, malformed input)
- Integration pipelines: 3 (full flow, probation flow, revocation flow)

## Architecture Notes

- All modules are pure functions (no side effects except InMemoryClaimStore)
- ClaimStore is interface-based for production backends (Redis, DB, ledger)
- Revocation markers are independently signed and verifiable
- Transfer verification composes all three verification layers
- Everything exported from `src/index.ts` for clean public API
