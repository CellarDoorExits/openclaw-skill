# 𓉸 Cellar Door API Quick Reference

Docs: <https://cellar-door.dev>

## cellar-door-exit (npm: v0.1.0)

### Convenience Functions
- `quickExit(origin, opts?) → { marker, identity }` — Generate identity + create + sign in one call
- `quickVerify(json) → { valid, errors }` — Verify a marker from JSON string
- `generateIdentity() → { did, publicKey, privateKey }` — Generate Ed25519 DID + keypair
- `toJSON(marker) → string` / `fromJSON(json) → ExitMarker`

### Core Functions
- `createMarker({ subject, origin, exitType?, status? }) → ExitMarker`
- `signMarker(marker, privateKey, publicKey) → ExitMarker`
- `verifyMarker(marker) → { valid, errors }`
- `validateMarker(obj) → { valid, errors }`

### Enums
- `ExitType`: `Voluntary`, `Forced`, `Emergency`
- `ExitStatus`: `GoodStanding`, `Disputed`, `Unverified`

### Advanced
- **Ceremony**: `CeremonyStateMachine` — multi-step exit with state transitions
- **Modules A–F**: `addModule(marker, module)` — lineage, continuity, disputes, assets, fees, anchors
- **Privacy**: `encryptMarker()`, `decryptMarker()`, `redactMarker()`, `createMinimalDisclosure()`
- **Batch**: `createBatchExit()`, `createShutdownBatch()` — exit multiple contexts at once
- **Anchoring**: `anchorToGit()`, `requestTimestamp()` (RFC 3161), chain adapters
- **KERI**: `createInception()`, `createRotation()`, pre-rotation key management
- **Ethics**: `detectCoercion()`, `detectWeaponization()`, `generateEthicsReport()`
- **Visual**: `renderDoorASCII()`, `renderDoorSVG()` — Door Hash visualization
- **Interop**: `serializeForTransport()` / `deserializeFromTransport()`

## cellar-door-entry (npm: v0.1.0)

### Convenience Functions
- `quickEntry(exitMarkerJson, destination, opts?) → { arrivalMarker, exitMarker, continuity }`

### Core Functions
- `createArrivalMarker(exitMarker, destination, opts?) → ArrivalMarker`
- `signArrivalMarker(marker, privateKey, publicKey) → ArrivalMarker`
- `verifyArrivalMarker(marker) → { valid, errors }`
- `verifyDeparture(exitMarker)` / `verifyDepartureJSON(json)` — Verify EXIT before admitting
- `verifyContinuity(exitMarker, arrivalMarker) → { valid, errors }`
- `verifyTransfer(exitMarker, arrivalMarker) → TransferRecord` — Full passage verification

### Admission Policy
- `evaluateAdmission(exitMarker, policy) → { admitted, reason }`
- Built-in policies: `OPEN_DOOR`, `STRICT`, `EMERGENCY_ONLY`

### Advanced
- **Probation**: `createProbationaryArrival()`, `isProbationComplete()`
- **Capability Scope**: `scopeFromExitMarker()`, `createRestrictedScope()`, `mergeScopes()`
- **Claim Tracking**: `InMemoryClaimStore` — prevent duplicate claims
- **Revocation**: `createRevocationMarker()`, `verifyRevocationMarker()`, `isRevoked()`
- **Validation**: `validateArrivalMarker(marker) → { valid, errors }`
