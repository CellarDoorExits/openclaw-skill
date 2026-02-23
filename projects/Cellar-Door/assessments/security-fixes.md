# Security Audit — Fix Log

Fixes applied for all HIGH and MEDIUM findings from `security-audit.md`.

## HIGH-01: CLI outputs private keys to stdout

**File:** `cellar-door-exit/src/cli.ts`

- Added `--show-keys` flag (default: false) to `create` and `keygen` commands
- Private keys redacted in output unless `--show-keys` is passed
- `keygen` writes private key to file with mode `0600` instead of printing to stdout

## HIGH-02: MCP server returns identity material

**File:** `integrations/mcp-server/src/server.ts`

- `generate_identity` now returns only `{ did }` (removed `publicKey`)
- `quick_exit` response changed from `identity: { did, publicKey }` to `signerDid`
- Private keys never leave the server; stored in session `Map` only
- Updated tests in `integrations/mcp-server/tests/server.test.ts`

## MEDIUM-04: No payload size limits on JSON.parse

**Files:** `interop.ts`, `convenience.ts`, `storage.ts`

- Added `MAX_PAYLOAD_SIZE` (1 MB) check in `deserializeFromTransport()` before `JSON.parse`
- Added `MAX_JSON_SIZE` (1 MB) check in `fromJSON()` before `JSON.parse`
- Added size check in `importMarker()` before parsing stored JSON

## MEDIUM-05: Fragile btoa/spread encoding

**Files:** `proof.ts`, `ceremony.ts`, `key-compromise.ts`, `keri.ts`, `modules/trust.ts`, `modules/lineage.ts`, `modules/origin-attestation.ts`, `modules/reputation.ts`, demo files, tests

- Replaced all `btoa(String.fromCharCode(...new Uint8Array(sig)))` with `Buffer.from(sig).toString("base64")`
- Replaced all `atob` decoding with `Buffer.from(x, "base64")`
- Eliminates stack overflow risk on large payloads

## MEDIUM-06: require() in ESM module

**File:** `cellar-door-exit/src/cli.ts`

- Changed `require("@noble/ed25519")` to `await import("@noble/ed25519")`
- Made the action handler `async` to support dynamic import

## MEDIUM-07: Unsanitized storage directory

**File:** `cellar-door-exit/src/storage.ts`

- Added `validateDir()` that rejects paths containing `..` (path traversal)
- Applied to `saveMarker`, `loadMarker`, and `listMarkers`

## MEDIUM-08: Misleading variable name in key-compromise.ts

**File:** `cellar-door-exit/src/key-compromise.ts`

- Removed confusing `const publicKey = signingKey` alias
- Added clarifying comment about `signingKey` usage

## MEDIUM-10: LangChain callback memory leak

**File:** `integrations/langchain/src/exit-callback.ts`

- Added `maxMarkers` option (default: 1000) to `ExitCallbackHandler`
- Oldest markers evicted when cap is reached
- Added `clear()` method for explicit cleanup

## Test Results

| Suite | Result |
|-------|--------|
| Core (cellar-door-exit) | ✅ 195 tests passing |
| LangChain integration | ✅ 8 tests passing |
| MCP server integration | ✅ 6 tests passing |
| Vercel AI SDK integration | ✅ 12 tests passing |

Only pre-existing failure: `properties.test.ts` (missing `fast-check` dev dependency — not related to these changes).
