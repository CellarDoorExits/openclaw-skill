# cellar-door-entry — Security Fix Summary

**Date:** 2026-02-23  
**Audit reference:** entry-security-legal-audit.md  
**Test status:** 77/77 passing

---

## HIGH-01: Claim Store Race Conditions — FIXED

**File:** `src/claim-tracking.ts`

- Changed `ClaimStore` interface to async (`Promise`-based) methods: `claim()`, `isClaimed()`, `getArrivalId()`, `revoke()`
- Updated `InMemoryClaimStore` to implement async interface
- Production implementations can now use Redis/DB with proper locking without breaking the interface contract
- Updated all tests and pipeline integration tests to use `async/await`

## HIGH-02: No Revocation Authority Check — FIXED

**File:** `src/revocation.ts`

- Added `authority` field to `RevocationMarker` (DID of the revoking platform)
- `createRevocationMarker()` now verifies that the revoker's DID matches the arrival marker's `proof.verificationMethod` (destination signer); throws on mismatch
- `verifyRevocationMarker()` accepts optional `arrivalMarker` parameter to cross-check authority against the arrival signer
- Also validates that `proof.verificationMethod` matches the claimed `authority`
- Added test for rejection of unauthorized revocation attempts

## MEDIUM: GDPR Per-Subject Deletion — FIXED

**File:** `src/claim-tracking.ts`

- Added `deleteBySubject(subjectDid: string): Promise<number>` to `ClaimStore` interface
- `InMemoryClaimStore` tracks a `subjectIndex` (subjectDid → Set<exitMarkerId>) populated via optional `subjectDid` parameter on `claim()`
- `deleteBySubject()` removes all claims, reverse-index entries, and subject-index entries for the given DID; returns count deleted
- Added tests for GDPR deletion and edge case (unknown subject returns 0)

## MEDIUM: Antitrust Documentation for blockedOrigins — FIXED

**File:** `src/admission-policy.ts`

- Added prominent JSDoc warning on `blockedOrigins` property of `AdmissionPolicy` interface:
  > WARNING: Coordinating blockedOrigins lists across platforms may raise antitrust concerns under Sherman Act §1 / EU TFEU Art. 101. Use only for platform-specific security policies, not industry-wide exclusion.
