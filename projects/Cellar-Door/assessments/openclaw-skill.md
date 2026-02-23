# OpenClaw Skill Assessment: cellar-door

**Date:** 2026-02-23
**Status:** ✅ Complete and tested

## What Was Built

OpenClaw skill at `integrations/openclaw-skill/` enabling any agent to create, verify, and transfer EXIT and ENTRY markers.

## Structure

```
openclaw-skill/
├── SKILL.md              — Skill instructions with frontmatter
├── node_modules/         — cellar-door-exit dependency
├── scripts/
│   ├── exit.sh           — Create signed EXIT markers
│   ├── entry.sh          — Create ENTRY records from EXIT markers
│   ├── verify.sh         — Verify EXIT or ENTRY markers
│   └── transfer.sh       — Verify full EXIT→ENTRY transfers
└── references/
    └── api-guide.md      — API quick reference
```

## Test Results

Full workflow tested successfully:
1. **exit.sh** — Creates signed Ed25519 EXIT marker ✓
2. **entry.sh** — Verifies EXIT, creates linked ENTRY record ✓
3. **verify.sh** — Validates both EXIT (cryptographic) and ENTRY (structural) markers ✓
4. **transfer.sh** — Validates subject match, ID linkage, timestamp ordering, and EXIT signature ✓

## Notes

- **CLI workaround:** The `cellar-door-exit` package registers `exit` as its binary name, which conflicts with the shell builtin. Scripts call `node dist/cli.js` directly instead of using `npx`.
- **cellar-door-entry not on npm:** The entry package doesn't exist yet. `entry.sh` constructs ENTRY records using `cellar-door-exit` for verification + manual record construction following the expected schema.
- **Auto-install:** Scripts auto-install `cellar-door-exit` via npm if `node_modules` is missing.
- All scripts are executable and use `set -euo pipefail` for safety.
