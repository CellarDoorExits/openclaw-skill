---
name: cellar-door
description: "𓉸 Cellar Door — Create, verify, and link EXIT and ENTRY markers: portable cryptographic proofs of departure and arrival for agents, users, and DAOs."
---

# 𓉸 Cellar Door Skill

Cryptographic passage markers for agent mobility. Uses [cellar-door-exit](https://cellar-door.dev) and [cellar-door-entry](https://cellar-door.dev) on npm.

## When to Use

- **Agent departing** a platform/context → `exit.sh`
- **Agent arriving** at a new destination → `entry.sh`
- **Verifying** any marker (EXIT or ENTRY) → `verify.sh`
- **Full passage** (EXIT → ENTRY with continuity proof) → `transfer.sh`

## Commands

| Script | Purpose | Usage |
|--------|---------|-------|
| `exit.sh` | Create a signed EXIT marker | `exit.sh <origin-uri> [voluntary\|forced\|emergency]` |
| `entry.sh` | Create a signed ENTRY (arrival) marker from an EXIT marker | `entry.sh <exit-marker.json> <destination-uri>` |
| `verify.sh` | Verify any marker's cryptographic signature | `verify.sh <marker.json>` |
| `transfer.sh` | Verify a full EXIT→ENTRY passage | `transfer.sh <exit-marker.json> <entry-marker.json>` |

## Common Workflows

### 1. Departure — Agent Leaves a Platform

```bash
./scripts/exit.sh "did:web:old-platform.example" voluntary
# Outputs signed EXIT marker JSON
```

### 2. Arrival — Agent Enters a New Platform

```bash
./scripts/entry.sh exit-marker.json "did:web:new-platform.example"
# Outputs signed ENTRY (arrival) marker JSON
```

### 3. Verify a Marker

```bash
./scripts/verify.sh marker.json
# ✓ VALID or ✗ INVALID — works for both EXIT and ENTRY markers
```

### 4. Verify a Full Passage

```bash
./scripts/transfer.sh exit-marker.json entry-marker.json
# Checks: both signatures valid, subjects match, continuity holds
```

## API Reference

### cellar-door-exit

- `quickExit(origin, opts?) → { marker, identity }` — Generate identity + create + sign in one call
- `quickVerify(json) → { valid, errors }` — Verify an EXIT marker from JSON
- `verifyMarker(marker) → { valid, errors }` — Verify an EXIT marker object
- `generateIdentity() → { did, publicKey, privateKey }` — Ed25519 DID + keypair
- `createMarker({ subject, origin, exitType, status }) → ExitMarker`
- `signMarker(marker, privateKey, publicKey) → ExitMarker`
- `toJSON(marker) / fromJSON(json)` — Serialization helpers
- Enums: `ExitType.Voluntary | Forced | Emergency`, `ExitStatus.GoodStanding | Disputed | Unverified`

### cellar-door-entry

- `quickEntry(exitMarkerJson, destination, opts?) → { arrivalMarker, exitMarker, continuity }`
- `createArrivalMarker(exitMarker, destination, opts?) → ArrivalMarker`
- `signArrivalMarker(marker, privateKey, publicKey) → ArrivalMarker`
- `verifyArrivalMarker(marker) → { valid, errors }`
- `verifyDeparture(exitMarker) / verifyDepartureJSON(json)` — Verify an EXIT marker before admitting
- `verifyContinuity(exitMarker, arrivalMarker) → { valid, errors }` — Identity continuity check
- `verifyTransfer(exitMarker, arrivalMarker) → TransferRecord` — Full passage verification

## Notes

- Both packages are on npm (v0.1.0). Install: `npm install cellar-door-exit cellar-door-entry`
- All markers are Ed25519-signed and offline-verifiable.
- For advanced usage (ceremonies, key rotation, admission policies, probation), see `references/api-guide.md`.
- Spec & docs: <https://cellar-door.dev>
