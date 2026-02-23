# Security Fixes — 2026-02-23

Commit: `8f29a96` on `main`, pushed to GitHub.

## HIGH-01: CLI Private Key Leak
**File:** `cellar-door-exit/src/cli.ts`
- Added `--show-keys` flag; private keys are now `[REDACTED]` by default
- Only DID and public key shown unless `--show-keys` is explicitly passed

## HIGH-02: MCP Server Private Key in Responses
**File:** `integrations/mcp-server/src/server.ts`
- `generate_identity` returns only `did` + message; private key stored server-side in `sessionIdentity`
- `quick_exit` returns marker + signerDid + verified status; no private key material exposed

## MEDIUM: LangChain Memory Leak
**File:** `integrations/langchain/src/exit-callback.ts`
- Added `maxMarkers` constructor option (default 1000)
- Oldest markers evicted via `shift()` when limit exceeded

## MEDIUM: No JSON Size Limit
**File:** `cellar-door-exit/src/convenience.ts`
- Added `MAX_JSON_SIZE` constant (1 MB / 1,048,576 bytes)
- `fromJSON()` throws `ValidationError` if input exceeds limit

## MEDIUM: Misleading Variable in Key-Compromise
**File:** `cellar-door-exit/src/key-compromise.ts`
- Removed misleading `const publicKey = signingKey` assignment (was aliasing private key as "publicKey")
- Replaced with descriptive comment; `signingKey` used directly
- Fixed base64 encoding: `btoa(String.fromCharCode(...))` → `Buffer.from().toString("base64")`

## Test Results
All **205 tests pass** across 13 test files. No regressions.
