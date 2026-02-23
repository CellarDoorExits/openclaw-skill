# LangChain Integration Assessment

**Package:** `@cellar-door/langchain`
**Location:** `integrations/langchain/`
**Created:** 2026-02-23

## Summary

LangChain integration for cellar-door-exit providing two components:

1. **`createExitTool()`** — A `DynamicStructuredTool` that creates signed EXIT markers on demand. Accepts `origin`, `exitType` (voluntary/forced/emergency/keyCompromise), `reason`, and `emergencyJustification`. Returns the signed marker as JSON.

2. **`ExitCallbackHandler`** — A `BaseCallbackHandler` that automatically creates EXIT markers on `handleChainEnd` and `handleAgentEnd`. Stores markers in-memory with optional `onMarker` callback. Includes `toJSON()` for serialization.

## Files Created

| File | Purpose |
|------|---------|
| `src/exit-tool.ts` | LangChain tool with Zod schema |
| `src/exit-callback.ts` | Callback handler for auto-marking |
| `src/index.ts` | Re-exports both modules |
| `src/__tests__/exit-tool.test.ts` | 4 tests for the tool |
| `src/__tests__/exit-callback.test.ts` | 4 tests for the callback |
| `package.json` | Package config with peer deps |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.ts` | Test runner config |
| `README.md` | Usage documentation |

## Test Results

**8/8 tests passing** via vitest 1.6.0.

- Tool creates markers with correct metadata
- Tool generates valid signed markers with Ed25519 proofs
- Tool accepts different exit types (forced, emergency with justification)
- Callback records markers on chain end and agent end
- Callback fires onMarker hook
- Callback serializes to JSON array

## Dependencies

- **Peer:** `@langchain/core >=0.2.0`, `cellar-door-exit >=0.1.0`
- **Dev:** `@langchain/core`, `zod`, `vitest`, `typescript`

## Notes

- Currently imports from `../../../cellar-door-exit/src/index.js` (relative path) — will need updating when cellar-door-exit is published to npm
- The ExitType enum has 4 values: `voluntary`, `forced`, `emergency`, `keyCompromise`
- Emergency exits require `emergencyJustification` per cellar-door-exit validation
- npm had issues resolving the unpublished peer dep; yarn with explicit versions was used for local dev
