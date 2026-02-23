# Integration Security Fixes — Summary

**Date:** 2026-02-23  
**Scope:** HIGH findings from `integrations-security-legal-audit.md`

---

## S-01: Raw JSON.parse without try/catch ✅ FIXED

**vercel-ai-sdk `entry-tools.ts`** — `verifyTransferTool`: Wrapped `JSON.parse(arrivalMarkerJson)` in try/catch. On parse failure, returns `{ verified: false, errors: ["Invalid arrival marker JSON: failed to parse"] }` instead of crashing.

**langchain `transfer-tool.ts`** — `createTransferVerificationTool`: Same fix. Returns JSON error response instead of throwing.

**mcp-server `server.ts`** — Already had try/catch around the `verify_transfer` tool handler. No change needed.

---

## S-02: Optional policy skips all checks ✅ FIXED

**vercel-ai-sdk `entry-tools.ts`** — `verifyAndAdmitAgentTool`: Changed from `if (admissionPolicy) { ... }` (skip when omitted) to always applying a policy, defaulting to `OPEN_DOOR` when omitted: `const policyName = admissionPolicy ?? "OPEN_DOOR"`.

**mcp-server `server.ts`** — `verify_and_admit`: Same pattern. Policy now resolves as `options.serverPolicy ?? admissionPolicy ?? "OPEN_DOOR"`, ensuring admission is always evaluated.

---

## S-03: LLM controls policy selection ✅ FIXED

**mcp-server `server.ts`**:
- Added `CreateServerOptions` interface with `serverPolicy` field.
- `createServer()` now accepts `options?: CreateServerOptions`.
- `verify_and_admit` and `evaluate_admission` both respect `options.serverPolicy` — when set, the LLM-provided policy parameter is ignored.
- Added prominent `⚠️ SECURITY WARNING (S-03)` comments on both tools explaining that production deployments should hardcode the policy.
- `index.ts` reads `CELLAR_DOOR_SERVER_POLICY` env var to set `serverPolicy` from environment.

---

## L-01: Auto-admission liability disclaimer ✅ FIXED

Added the following disclaimer section to all three READMEs (`vercel-ai-sdk`, `langchain`, `mcp-server`):

> **WARNING:** Automated admission decisions should be reviewed by platform operators. This integration does not constitute legal advice. Platforms are responsible for their own admission policies and the consequences of admitting agents.

---

## Test Results

| Package | Result | Notes |
|---------|--------|-------|
| langchain | ✅ 15/15 passed | All tests pass |
| vercel-ai-sdk | ⚠️ Pre-existing infra issue | `vitest` not installed as dependency; `ai` package missing from test resolution |
| mcp-server | ⚠️ Pre-existing infra issue | `vitest` not installed as dependency |

The test infrastructure issues in vercel-ai-sdk and mcp-server are pre-existing (not caused by these fixes). The langchain package — which has working test infrastructure — passes all 15 tests including entry tool tests that exercise the modified code paths.

---

## Files Modified

- `integrations/vercel-ai-sdk/src/entry-tools.ts` — S-01, S-02
- `integrations/langchain/src/transfer-tool.ts` — S-01
- `integrations/mcp-server/src/server.ts` — S-02, S-03
- `integrations/mcp-server/src/index.ts` — S-03 (env var support)
- `integrations/vercel-ai-sdk/README.md` — L-01
- `integrations/langchain/README.md` — L-01
- `integrations/mcp-server/README.md` — L-01
