# Repository Sync Report

**Date:** 2026-02-26T04:17Z
**Performed by:** Hawthorn (automated)

---

## Summary

| Repo | Action | Status |
|------|--------|--------|
| exit-door | Synced code + removed sensitive files + scrubbed history | ✅ Complete |
| entry-door | Synced code (no sensitive files found) | ✅ Complete |
| langchain | Synced + removed committed node_modules | ✅ Complete |
| vercel-ai-sdk | Already in sync | ✅ No action needed |
| mcp-server | Already in sync | ✅ No action needed |
| openclaw-skill | In sync (remote has node_modules committed — cosmetic issue) | ⚠️ Minor |

---

## Detailed Actions

### 1. CellarDoorExits/exit-door

**Files removed from public repo:**
- `DECISIONS.md` — internal strategy/decision log
- `LEGAL.md` — internal legal analysis (note: audit flagged as normative, but user requested removal)
- `CHANGELOG-v1.1-review.md` — internal review notes
- `analysis/howey-test-module-d.md` — securities risk analysis
- `docs/PITCH_PRAGMATIC.md` — pitch strategy
- `docs/PITCH_IDEALIST.md` — pitch strategy
- `docs/NIST_RFI_PRAGMATIC.md` — contains personal email (warrenkoch@gmail.com)
- `docs/NIST_RFI_DRAFT.md` — draft government submission
- `docs/analysis/` — 11 files (competitive landscape, legal red teams, risk heatmaps, mechanism design, project plan, etc.)

**New files added to public repo:**
- `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `SECURITY.md`
- `docs/HSM_INTEGRATION.md`, `docs/NON_BLOCKING_ENFORCEMENT.md`
- `docs/philosophical-foundations.md`, `docs/preservation-considerations.md`
- New source modules: dispute, telemetry, TSA, visual, full-service, git-ledger, passage, signer, claim-store
- New tests and demo scenario

**Git history scrub:** ✅ Completed via `git filter-branch`. All sensitive files removed from all 6 commits in history. Force-pushed to rewrite history.

**All sensitive files remain safely in local:** `/home/node/workspace/openclaw/Hawthorn/projects/Cellar-Door/cellar-door-exit/`

### 2. CellarDoorExits/entry-door

- No sensitive files found (confirmed by audit)
- Synced: added ENTRY_SPEC_v1.0.md, governance docs, updated source and tests
- Removed stale `cellar-door-entry` symlink from repo

### 3. CellarDoorExits/langchain

- Added `examples/agent-migration.ts` (new file)
- **Removed committed `node_modules/`** (~2200 files, 742K lines deleted) — was accidentally committed to the public repo
- Source files already in sync

### 4. CellarDoorExits/vercel-ai-sdk

- Already in sync (only difference was vitest cache files in node_modules, which are gitignored locally)

### 5. CellarDoorExits/mcp-server

- Already in sync. Local `dist/` is gitignored (correct behavior)

### 6. CellarDoorExits/openclaw-skill

- Source files match. However, the **remote repo has `node_modules/` committed** (~540 files).
- Did not fix this round — would require the same cleanup as langchain.
- **Recommendation:** Clone, remove node_modules, add to .gitignore, force-push.

---

## Remaining Recommendations

1. **openclaw-skill:** Remove committed node_modules from the public repo
2. **All repos:** Ensure `.gitignore` includes `node_modules/` and `dist/` where appropriate
3. **exit-door:** The history scrub used `git filter-branch`. Anyone who has cloned the repo will need to re-clone or `git fetch --all && git reset --hard origin/main`
4. **GitHub caches:** Force-pushed history removes files from the branch, but GitHub may cache old commits for ~90 days. If the personal email in NIST_RFI_PRAGMATIC.md is a concern, contact GitHub support to purge the cache.
