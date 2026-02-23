# Cellar Door API Quick Reference

## cellar-door-exit (npm: v0.1.0)

### Convenience Functions
- `quickExit(origin: string) → { marker, identity }` — Generate identity + create + sign in one call
- `quickVerify(json: string) → { valid, errors? }` — Verify a marker from JSON string
- `toJSON(marker) → string` — Serialize marker to JSON
- `fromJSON(json: string) → Marker` — Deserialize marker from JSON

### Core Functions
- `generateIdentity() → { did, publicKey, privateKey }` — Generate Ed25519 DID + keypair
- `createMarker({ subject, origin, exitType?, status? }) → Marker` — Create unsigned marker
- `signMarker(marker, privateKey, publicKey) → Marker` — Sign a marker
- `verifyMarker(marker) → { valid, errors? }` — Verify a marker object

### Enums
- `ExitType`: `Voluntary`, `Forced`, `Emergency`
- `ExitStatus`: `GoodStanding`, `Disputed`, `Unverified`

### CLI (`node .../dist/cli.js`)
- `create --origin <uri> [--subject <did>] [--type <type>] [--status <status>] [--reason <text>] [--sign] [--key <path>]`
- `verify <marker.json>`
- `inspect <marker.json>`
- `keygen`

### Advanced
- `bindSuccessor(marker, successorDid)` — Designate successor via Module A
- `createLineageModule(predecessor?, successor?)` — Lineage/continuity
- `encryptMarker(marker, recipientPubKey)` / `decryptMarker(encrypted, privateKey)`
- `createBatchExit(origins[], identity)` — Exit multiple contexts at once
- `serializeForTransport(marker)` / `deserializeFromTransport(data)`

## cellar-door-entry (not yet on npm)

Entry records are currently constructed manually (see `entry.sh`). Expected schema:

```json
{
  "@context": "https://cellar-door.org/entry/v1",
  "id": "urn:entry:<hex>",
  "subject": "<did>",
  "origin": "<exit-origin-uri>",
  "destination": "<destination-uri>",
  "exitMarkerId": "<exit-marker-id>",
  "timestamp": "<ISO-8601>",
  "status": "admitted",
  "exitVerified": true
}
```
