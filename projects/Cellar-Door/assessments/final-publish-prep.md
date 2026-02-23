# Final Publish Prep — Integration GitHub Push

**Date:** 2026-02-23 | **Author:** Hawthorn

## Summary

All four Cellar Door integration packages have been pushed to individual GitHub repositories under the CellarDoorExits organization.

## Repos Created & Pushed

| Package | GitHub Repo | Status |
|---------|-------------|--------|
| @cellar-door/vercel-ai-sdk | [CellarDoorExits/vercel-ai-sdk](https://github.com/CellarDoorExits/vercel-ai-sdk) | ✅ Pushed |
| @cellar-door/langchain | [CellarDoorExits/langchain](https://github.com/CellarDoorExits/langchain) | ✅ Pushed |
| @cellar-door/mcp-server | [CellarDoorExits/mcp-server](https://github.com/CellarDoorExits/mcp-server) | ✅ Pushed |
| @cellar-door/openclaw-skill | [CellarDoorExits/openclaw-skill](https://github.com/CellarDoorExits/openclaw-skill) | ✅ Pushed |

## Changes Made

1. **MASTER_INDEX.md** — Full rescan of 97 .md files with word counts, git hashes, descriptions, status markers, and context-window groupings (~248K tokens total)
2. **package.json updates** — All 4 integration package.json files now point to their individual GitHub repos (repository, homepage, bugs URLs)
3. **GitHub repos** — Created and pushed all 4 repos with initial commits

## Notes

- Integration pushes included `node_modules/` since no `.gitignore` files existed. Consider adding `.gitignore` files and force-pushing clean versions.
- `cellar-door-entry` and `cellar-door-exit` dependencies in mcp-server use `file:` references — these will need updating for standalone use.
- The openclaw-skill package.json was minimal; added name, version, description, license, and repo fields.

## Next Steps

- Add `.gitignore` to each integration repo
- Update `file:` dependencies in mcp-server to npm registry versions
- Publish to npm when ready
- Consider CI/CD setup for each repo
