# Security & Legal Audit: cellar-door-entry

**Auditor:** Adversarial review  
**Date:** 2026-02-23  
**Scope:** `cellar-door-entry/src/` — all 14 source modules  
**Dependencies:** `@noble/hashes ^1.8.0`, peer `cellar-door-exit >=0.1.0`

---

## PART 1: Security Audit

### Executive Summary

cellar-door-entry is well-structured and mirrors EXIT's crypto patterns correctly. The dependency surface is minimal and reputable. No critical vulnerabilities. Primary concerns: in-memory claim store race conditions, missing revocation authority checks, and a few validation gaps that could matter at scale.

**Finding Count:** 0 CRITICAL, 2 HIGH, 4 MEDIUM, 3 LOW, 3 INFO

---

### FINDING-E01: InMemoryClaimStore Has No Atomicity Guarantees
**Severity:** HIGH  
**File:** `claim-tracking.ts:27-33`

The `claim()` method does `has()` then `set()` — a classic check-then-act race. In any concurrent environment (multiple async arrivals), two arrivals could both pass `has()` before either calls `set()`, allowing a single EXIT marker to be claimed twice.

```typescript
claim(exitMarkerId: string, arrivalMarkerId: string): boolean {
  if (this.claims.has(exitMarkerId)) return false; // ← check
  this.claims.set(exitMarkerId, arrivalMarkerId);   // ← act
  // Race window between check and act
```

**Impact:** Replay attacks in concurrent systems. An EXIT marker could be used for multiple arrivals.

**Mitigation:** Node.js single-threaded event loop makes this safe for synchronous callers in a single process. However: (1) the `ClaimStore` interface invites async backends where this pattern breaks, (2) any future `async claim()` would need CAS semantics. Document this clearly. Consider making the interface `Promise<boolean>` from the start to force implementors to think about atomicity.

**Affects:** Tier 1 code (the interface design sets the pattern for all backends).

---

### FINDING-E02: No Authority Check on Revocation Markers
**Severity:** HIGH  
**File:** `revocation.ts:33-54`

`createRevocationMarker` accepts any keypair. `verifyRevocationMarker` checks that the signature is valid but does NOT check that the signer is authorized to revoke. Any party with any Ed25519 key can create a valid-looking revocation marker for any arrival.

```typescript
// verifyRevocationMarker only checks: is the signature valid for the stated DID?
// It does NOT check: is this DID authorized to revoke this arrival?
```

**Impact:** Forged revocations. An attacker can revoke any arrival by signing with their own key.

**Mitigation:** The `isRevoked()` function trusts all markers in the array. Consumers must pre-filter revocations by authorized issuers. This should be documented prominently, or better: add an optional `authorizedIssuers: string[]` parameter to `isRevoked()`.

**Affects:** Tier 1 code.

---

### FINDING-E03: No Size Limit on EXIT Marker Input
**Severity:** MEDIUM  
**File:** `arrival.ts:43-67`, `verify-departure.ts`

`createArrivalMarker` accepts an `ExitMarker` object with no size validation. A malicious EXIT marker with deeply nested or enormous modules could cause excessive memory use during canonicalization (recursive `canonicalize()`) and hashing.

The arrival marker itself is size-checked in `validateArrivalMarker` (1MB limit), but the input EXIT marker is never checked.

**Mitigation:** Add a size check on the serialized EXIT marker before processing. Consider a recursion depth limit in `canonicalize()`.

---

### FINDING-E04: Admission Policy `requireVerifiedDeparture` Only Checks Structural Presence
**Severity:** MEDIUM  
**File:** `admission-policy.ts:81-85`

When `requireVerifiedDeparture: true`, the policy engine only checks that `exitMarker.proof` and `exitMarker.proof.proofValue` exist — it does NOT cryptographically verify the signature. The comment says "actual crypto verification is done at arrival creation," but this creates a dangerous split responsibility. A consumer could call `evaluateAdmission()` without `createArrivalMarker()` and believe they've verified the departure.

```typescript
if (policy.requireVerifiedDeparture) {
  if (!exitMarker.proof || !exitMarker.proof.proofValue) {
    reasons.push("Departure marker has no proof/signature");
  }
  // ← No actual verification!
```

**Mitigation:** Either verify cryptographically here, or rename to `requireDepartureProofPresent` to avoid confusion.

---

### FINDING-E05: `quickEntry` Generates Ephemeral Keys — Useless Signatures
**Severity:** MEDIUM  
**File:** `convenience.ts:27-37`

`quickEntry()` generates a fresh keypair for each call. The resulting signature is unfalsifiable (no one knows the DID) but also unverifiable by anyone else since the private key is discarded and the public key is not returned or registered anywhere.

```typescript
const { publicKey, privateKey } = generateKeyPair();
const signed = signArrivalMarker(arrival, privateKey, publicKey);
// privateKey and publicKey are garbage collected — never returned
```

**Impact:** False sense of security. Signed markers from `quickEntry` look signed but the key is lost.

**Mitigation:** Return the keypair in `QuickEntryResult`, or document that this is for testing only.

---

### FINDING-E06: `verifyDepartureJSON` Returns `null as unknown as ExitMarker` on Error
**Severity:** MEDIUM  
**File:** `verify-departure.ts:17-22`

On parse failure, the function returns `{ marker: null as unknown as ExitMarker, result: { valid: false, ... } }`. If a consumer ignores the `result.valid` check and accesses `marker.id`, they get a runtime crash. This is a type-safety hole.

**Mitigation:** Return `marker: undefined` with proper typing, or throw.

---

### FINDING-E07: No Expiry Enforcement on Capability Scopes
**Severity:** LOW  
**File:** `capability-scope.ts`

`CapabilityScope` has an optional `expires` field but nothing in the codebase checks or enforces it. `mergeScopes` preserves earliest expiry but never validates against current time.

**Mitigation:** Add `isExpired(scope: CapabilityScope, now?: Date): boolean` utility.

---

### FINDING-E08: `parseDuration` Allows Unbounded Values
**Severity:** LOW  
**File:** `admission-policy.ts:36-42`

`parseDuration("999999999d")` returns ~86.4 trillion ms. No upper bound.

**Mitigation:** Cap at a reasonable max (e.g., 365d).

---

### FINDING-E09: `canonicalize` Does Not Handle Circular References
**Severity:** LOW  
**File:** `arrival.ts:12-20`

Recursive canonicalization with no cycle detection. A circular object reference would cause a stack overflow.

**Mitigation:** Add a `Set`-based seen check or depth limit.

---

### FINDING-E10: No `eval`, No Dynamic Code
**Severity:** INFO  

No `eval`, `Function()`, `import()`, `require()`, or dynamic code generation anywhere. Clean.

---

### FINDING-E11: Dependency Review
**Severity:** INFO  

- **`@noble/hashes`** — Audited, pure-JS, well-maintained. Excellent choice.
- **`cellar-door-exit`** (peer) — Reviewed separately. Same crypto stack.
- **No runtime network calls.** The library is fully offline.
- **No native addons.** Pure JavaScript/TypeScript.

Supply chain risk: minimal.

---

### FINDING-E12: Private Key Handling
**Severity:** INFO  

Private keys are passed as `Uint8Array` parameters and used only for `sign()` calls. They are not stored, logged, or serialized anywhere in the ENTRY codebase. Keys are the caller's responsibility. This is the correct pattern.

---

## PART 2: Legal Scrutiny

### 1. Admission Discrimination

**Risk:** MEDIUM

If platforms use EXIT marker data (exit type, origin platform, dispute history) to reject agents, this creates a reputation-based gatekeeping system. Key concerns:

- **Exit type discrimination:** Rejecting agents with `exitType: "forced"` penalizes agents who may have been unjustly evicted. No due process mechanism exists.
- **Origin discrimination:** `blockedOrigins` in admission policy is explicitly a blocklist by platform name — analogous to refusing service based on where someone came from.
- **No protected classes (yet):** AI agents aren't a protected class under current civil rights law, so anti-discrimination statutes don't directly apply. But this could change, and the pattern sets precedent.

**Antitrust angle:** If dominant platforms collectively block agents from a rival platform via `blockedOrigins`, this could constitute a group boycott (per se illegal under Sherman Act §1).

**Mitigation:** Document that `blockedOrigins` is provided for security (e.g., compromised platforms), not competitive exclusion. Consider adding `reason` fields to policy decisions for auditability.

**Affects:** Tier 1 code (the `blockedOrigins` field exists now).

---

### 2. FCRA Parallels

**Risk:** HIGH

The Fair Credit Reporting Act (15 U.S.C. §1681) applies when a "consumer report" is used for eligibility decisions. ENTRY's pattern is strikingly similar:

- **EXIT marker = consumer report?** It contains a subject's history (exit type, disputes, economic data) used by a third party (destination platform) to make an admission decision.
- **FCRA triggers:** (1) communication of information, (2) by a consumer reporting agency, (3) bearing on eligibility. The EXIT→ENTRY pipeline hits all three if the origin platform is treated as a CRA.
- **Key obligations if FCRA applies:** adverse action notices, dispute rights, accuracy requirements, permissible purpose limitations.

**Current safe harbor:** ENTRY evaluates cryptographic validity and structural data, not subjective assessments. The Tier 1 code doesn't aggregate reports from multiple sources (which would more clearly trigger CRA status).

**Mitigation:** Avoid building agent "scores" or aggregated reputation systems. If `evaluateAdmission` returns `admitted: false`, document that platforms should provide the equivalent of an adverse action notice (what data caused rejection, how to dispute).

**Affects:** Tier 1 code (the admission decision pipeline). Gets much worse in future tiers if multi-source reputation is added.

---

### 3. GDPR

**Risk:** HIGH

Arrival markers contain personal data under GDPR Article 4(1) if the agent's DID is linkable to a natural person (e.g., a human operating the agent, or an agent acting on behalf of one):

- **Data in markers:** DID (subject), origin platform, destination, timestamps, exit type, probation details, capability restrictions — all linked to an identifiable subject.
- **Right to erasure (Art. 17):** If markers are stored (claim store, revocation lists), subjects can request deletion. The `InMemoryClaimStore` has `clear()` but no per-subject deletion.
- **Data minimization (Art. 5(1)(c)):** Arrival markers include `verificationResult` with potentially detailed error messages, `conditions`, and full `probation` details. Some of this may exceed what's necessary.
- **Lawful basis:** Likely "legitimate interest" (Art. 6(1)(f)) or "contract performance" (Art. 6(1)(b)). Consent is impractical for automated agent transfers.
- **Cross-border transfer:** See §8 below.

**Mitigation:** Add `deleteBySubject(did: string)` to the `ClaimStore` interface. Document data retention recommendations. Consider a `minimal` mode that strips non-essential fields from stored markers.

**Affects:** Tier 1 code (ClaimStore interface needs per-subject operations).

---

### 4. Howey Test (Securities Analysis)

**Risk:** LOW

For the Howey test (investment of money, common enterprise, expectation of profits from others' efforts):

- **No investment of money:** Arrival markers are created through protocol participation, not purchased.
- **No common enterprise:** Each arrival is bilateral (one agent, one platform). No pooling.
- **No profit expectation:** Capability scopes grant permissions, not economic returns. Probation restricts rather than promises.
- **Not transferable:** Arrival markers reference a specific subject DID and destination. They can't be traded or assigned.

**However:** If future tiers add "reputation tokens" or economic modules where accumulated successful arrivals unlock economic benefits, this analysis changes significantly.

**Mitigation:** Don't create transferable or economically valuable representations of arrival history.

**Affects:** Future tiers only. Tier 1 is clean.

---

### 5. Platform Liability

**Risk:** MEDIUM

If a platform admits an agent based on a verified EXIT marker and that agent causes harm:

- **Reliance defense:** The platform relied on cryptographic verification of the EXIT marker. This is similar to relying on a background check — it doesn't eliminate liability but may reduce negligence claims.
- **Negligent admission:** If the EXIT marker showed `exitType: "forced"` with a dispute module indicating harmful behavior, and the platform admitted anyway (e.g., via `OPEN_DOOR` policy), there's a stronger negligence argument.
- **No warranty:** The protocol provides verification, not recommendation. This distinction should be explicit.
- **`admissionType: "automatic"`** is particularly risky — it implies no human review occurred.

**Mitigation:** Document that `evaluateAdmission` results are advisory, not guarantees. Platforms should maintain their own risk assessment. The `reviewed` admission type exists for exactly this reason.

**Affects:** Documentation concern for Tier 1. Code is fine.

---

### 6. Antitrust

**Risk:** HIGH

The admission policy engine creates infrastructure for coordinated exclusion:

- **`blockedOrigins`** enables platforms to collectively blacklist origins. If Platform A, B, and C all block Platform D's agents, this is a concerted refusal to deal.
- **`STRICT` preset** requires `voluntary` exit type only — if widely adopted, this collectively punishes force-exited agents without due process, potentially constituting a group boycott.
- **`requiredModules`** could be used to exclude agents from platforms that don't implement all modules — a de facto interoperability barrier that advantages incumbents.
- **Preset policies as coordination mechanism:** Shipping `OPEN_DOOR`, `STRICT`, and `EMERGENCY_ONLY` as named presets could become Schelling points for coordinated behavior, similar to "suggested retail prices."

**Key case law:** *Klor's Inc. v. Broadway-Hale Stores* (group boycotts); *FTC v. Indiana Federation of Dentists* (collective refusal to deal with information).

**Mitigation:** Add documentation warning against coordinated policy adoption. Consider removing `blockedOrigins` or requiring per-agent (not per-platform) blocking. Add antitrust guidance in README.

**Affects:** Tier 1 code (`blockedOrigins` and preset policies).

---

### 7. Contractual Implications

**Risk:** MEDIUM

Admission policies could create implied contracts:

- **Offer and acceptance:** An admission policy published by a platform ("we accept voluntary exits with valid signatures") could be construed as a standing offer. An agent presenting a conforming EXIT marker could argue acceptance.
- **Conditions as terms:** `admissionType: "conditional"` with explicit `conditions` array looks very contractual. If the platform later violates those conditions (e.g., revoking despite compliance), breach of contract claims arise.
- **Probation as contract:** `ProbationInfo` with `duration`, `restrictions`, and `reviewRequired` creates specific, measurable obligations on both sides. This is arguably a fixed-term agreement.
- **Detrimental reliance:** If an agent exits Platform A (irrevocably) relying on Platform B's published admission policy, and Platform B rejects them, there's a promissory estoppel argument.

**Mitigation:** Include disclaimer language in policy presets. Document that admission policies are not binding offers. Consider adding a `nonBinding: true` flag.

**Affects:** Primarily documentation. Tier 1 code structures (conditions, probation) create the contractual surface.

---

### 8. Cross-Border / Conflict of Laws

**Risk:** MEDIUM

Agent exits Jurisdiction A, enters Jurisdiction B:

- **Which law governs?** No choice-of-law clause in the protocol. The arrival marker records `departureOrigin` and `destination` but these are platform identifiers, not jurisdictions.
- **GDPR territorial scope:** If either platform serves EU residents, GDPR applies to the marker data regardless of where servers are located (Art. 3(2)).
- **Data localization:** Some jurisdictions (Russia, China, India proposed) require personal data to be stored locally. Arrival markers transiting between jurisdictions could violate these requirements.
- **Regulatory arbitrage:** An agent could be force-exited under EU consumer protection law, then arrive at a platform in a jurisdiction with no equivalent protections.
- **Mutual legal assistance:** If a dispute arises about a transfer, which court has jurisdiction? The protocol doesn't specify.

**Mitigation:** Add optional `jurisdiction` field to arrival markers. Document that platforms are responsible for their own jurisdictional compliance. Consider a `dataResidency` hint in the protocol.

**Affects:** Future tiers primarily. Tier 1 should add the `jurisdiction` field as optional to avoid breaking changes later.

---

## Summary Table

| # | Issue | Risk | Affects Tier 1? |
|---|-------|------|-----------------|
| E01 | Claim store race conditions | HIGH | Yes (interface design) |
| E02 | No revocation authority check | HIGH | Yes |
| E03 | No EXIT marker size limit | MEDIUM | Yes |
| E04 | Policy checks presence not validity | MEDIUM | Yes |
| E05 | quickEntry discards keys | MEDIUM | Yes |
| E06 | Null-as-ExitMarker type hole | MEDIUM | Yes |
| E07 | Capability expiry not enforced | LOW | No |
| E08 | Unbounded duration values | LOW | No |
| E09 | No circular reference protection | LOW | No |
| Legal-1 | Admission discrimination | MEDIUM | Yes (blockedOrigins) |
| Legal-2 | FCRA parallels | HIGH | Yes (admission pipeline) |
| Legal-3 | GDPR | HIGH | Yes (ClaimStore) |
| Legal-4 | Howey | LOW | No |
| Legal-5 | Platform liability | MEDIUM | Docs only |
| Legal-6 | Antitrust | HIGH | Yes (presets, blockedOrigins) |
| Legal-7 | Contractual | MEDIUM | Docs + conditions/probation |
| Legal-8 | Cross-border | MEDIUM | Optional field addition |

---

## Recommended Priority Actions

1. **Add authority validation to revocation** (E02) — most exploitable finding
2. **Make ClaimStore interface async** (E01) — prevents bad patterns in backends
3. **Add per-subject deletion to ClaimStore** (Legal-3/GDPR) — compliance requirement
4. **Document antitrust guidance** (Legal-6) — blockedOrigins is a liability
5. **Add adverse action notice guidance** (Legal-2/FCRA) — low effort, high legal value
6. **Fix quickEntry key handling** (E05) — return or document as test-only
7. **Add EXIT marker size validation** (E03) — DoS prevention
