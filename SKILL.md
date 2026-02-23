---
name: cellar-door
description: Create, verify, and transfer EXIT and ENTRY markers — portable cryptographic proofs of departure and arrival for agents, users, and DAOs.
---

# Cellar Door Skill

## When to Use

- **Agent departing** a platform/context → `exit.sh`
- **Agent arriving** at a new context with an EXIT marker → `entry.sh`
- **Verifying** any marker's cryptographic signature → `verify.sh`
- **Auditing a transfer** (EXIT→ENTRY chain) → `transfer.sh`

## Commands

| Script | Purpose | Usage |
|--------|---------|-------|
| `exit.sh` | Create a signed EXIT marker | `exit.sh <origin-uri> [voluntary\|forced\|emergency]` |
| `entry.sh` | Create an ENTRY/arrival record from an EXIT marker | `entry.sh <exit-marker.json> <destination-uri>` |
| `verify.sh` | Verify any marker's signature | `verify.sh <marker.json>` |
| `transfer.sh` | Verify a full EXIT→ENTRY transfer | `transfer.sh <exit-marker.json> <entry-marker.json>` |

## Common Workflows

### 1. Agent Leaves a Platform

```bash
./scripts/exit.sh "did:web:old-platform.example" voluntary
# Outputs signed EXIT marker JSON
```

### 2. Agent Arrives at New Platform

```bash
# Save the EXIT marker to a file first, then:
./scripts/entry.sh exit-marker.json "did:web:new-platform.example"
```

### 3. Verify a Marker

```bash
./scripts/verify.sh marker.json
# ✓ VALID or ✗ INVALID
```

### 4. Verify Full Transfer

```bash
./scripts/transfer.sh exit-marker.json entry-marker.json
# Checks: both valid, subjects match, EXIT timestamp < ENTRY timestamp
```

## Notes

- `cellar-door-exit` is on npm (v0.1.0). `cellar-door-entry` is not yet published — entry.sh uses the exit package's verify + custom logic.
- The CLI binary is `exit` but conflicts with shell builtins, so scripts call `node` directly via the installed package.
- All markers are Ed25519-signed and offline-verifiable.
- For advanced usage (modules, ceremonies, key rotation), see `references/api-guide.md`.
