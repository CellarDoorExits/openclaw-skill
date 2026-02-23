# Vercel AI SDK Integration — Assessment

**Date:** 2026-02-23
**Package:** `@cellar-door/vercel-ai-sdk`
**Location:** `integrations/vercel-ai-sdk/`
**Status:** ✅ Complete — 12/12 tests passing

## What Was Built

### `src/exit-tool.ts` — AI SDK Tool Definition
- Exports `exitMarkerTool` using Vercel AI SDK's `tool()` function
- Parameters: `origin` (required), `exitType` (optional enum: voluntary/forced/emergency/keyCompromise), `reason` (optional)
- Calls `quickExit()` from cellar-door-exit, returns signed marker JSON + metadata
- Includes LLM-friendly description for tool selection
- Handles emergency exit type by auto-populating `emergencyJustification`

### `src/exit-middleware.ts` — onFinish Callback
- `createExitOnFinish(opts)` — returns an `onFinish`-compatible callback that creates EXIT markers when generation completes
- `withExitMarker(originalOnFinish, opts)` — wraps existing callbacks to also produce markers
- Both accept `onMarkerCreated` callback for custom handling (storage, logging, broadcast)

### `src/index.ts` — Barrel exports

### Tests (12 passing)
- **exit-tool.test.ts** (6 tests): schema validation, required params, optional params, execute returns signed marker, exitType respected
- **exit-middleware.test.ts** (6 tests): callback shape, marker production, onMarkerCreated callback, exitType option, wrapper with/without original callback

## Design Decisions

1. **Direct `ai` dependency** rather than pure peer dep — avoids npm install issues in development while still declaring peer dep for consumers
2. **Relative imports** to `cellar-door-exit/src/` for local dev — will switch to `cellar-door-exit` package import when published
3. **Zod schema** matches actual ExitType enum values (lowercase: `voluntary`, `forced`, etc.) not display names
4. **Emergency exits** auto-populate `emergencyJustification` from the `reason` param (or "Emergency exit" default) to satisfy marker validation

## Files

```
integrations/vercel-ai-sdk/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── exit-tool.ts
    ├── exit-middleware.ts
    └── __tests__/
        ├── exit-tool.test.ts
        └── exit-middleware.test.ts
```

## Before Publishing

- [ ] Change cellar-door-exit imports from relative paths to `cellar-door-exit`
- [ ] Run `npm run build` to verify TypeScript compilation
- [ ] Move `ai` from dependencies to peerDependencies only
- [ ] Add `zod` to peerDependencies (it's a peer dep of `ai`)
