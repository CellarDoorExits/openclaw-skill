# Integration Assessment: MCP Server for cellar-door-exit

**Date:** 2026-02-23  
**Status:** ✅ Complete  
**Location:** `integrations/mcp-server/`

## What Was Built

An MCP (Model Context Protocol) server that exposes cellar-door-exit functionality as AI-native tools. Any MCP-compatible client (Claude Desktop, Cursor, Windsurf, etc.) can create, sign, and verify EXIT markers through standard tool calls.

## Files Created

| File | Purpose |
|------|---------|
| `src/server.ts` | MCP server with 4 tools using `@modelcontextprotocol/sdk` |
| `src/index.ts` | Entry point with stdio transport |
| `package.json` | `@cellar-door/mcp-server` package config |
| `tsconfig.json` | TypeScript build configuration |
| `README.md` | Usage docs with Claude Desktop config examples |
| `tests/server.test.ts` | 6 tests covering all tools |

## Tools Exposed

| MCP Tool | Description |
|----------|-------------|
| `generate_identity` | Generate Ed25519 DID keypair for signing |
| `quick_exit` | One-shot create + sign (simplest path) |
| `create_exit_marker` | Create and sign with full options |
| `verify_exit_marker` | Verify a marker from JSON string |

## Implementation Notes

- **Session identity:** The server stores a generated identity per session, so multiple markers can be signed with the same key within one conversation.
- **verifyMarker returns `{ valid, errors }`** — not a bare boolean. Server extracts `.valid` for clean tool responses.
- **quickExit `origin` param** is the platform being exited; the `subject` is auto-set to the generated DID.
- **createMarker** requires both `subject` and `origin` fields; `reason` is not a direct field on `CreateMarkerOpts`.

## Test Results

```
✓ lists all tools
✓ generate_identity returns a DID
✓ quick_exit creates a verified marker
✓ create_exit_marker creates a signed marker
✓ verify_exit_marker round-trips
✓ verify_exit_marker rejects garbage

6 passed (0 failed)
```

## Dependencies

- `@modelcontextprotocol/sdk` ^1.26.0
- `cellar-door-exit` ^0.1.0
- `zod` ^3.23.0 (for MCP tool parameter schemas)

## Usage

```json
{
  "mcpServers": {
    "cellar-door-exit": {
      "command": "npx",
      "args": ["@cellar-door/mcp-server"]
    }
  }
}
```
