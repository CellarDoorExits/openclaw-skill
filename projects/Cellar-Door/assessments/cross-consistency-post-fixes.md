# Cross-Consistency Check — Post-Fix Assessment

**Date:** 2026-02-24  
**Scope:** Entire Cellar-Door project after code, docs, and skill fix passes

## Summary

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Domain (`cellar-door.org`) | ⚠️ PARTIAL | Gone from source code; persists in specs, papers, decisions, and assessments |
| 2 | Type exports | ✅ PASS | `VerificationResult` and `ValidationResult` both exported from index.ts |
| 3 | v1.1 fields | ✅ PASS | All 5 fields in types.ts, validate.ts, and JSON-LD context |
| 4 | ExitType coverage | ⚠️ GAP | 3 of 8 enum values lack test coverage |
| 5 | "Transfer" terminology | ⚠️ PARTIAL | ENTRY_SPEC has Passage notes; README headings still say "Transfer" without note |
| 6 | OpenClaw skill | ✅ PASS | Scripts exist, reference correct packages and APIs |
| 7 | Brand elements (𓉸) | ✅ PASS | Present in skill, scripts, brand guide, visual.ts |
| 8 | GitHub org | ✅ PASS | Source code uses `CellarDoorExits`; `cellar-door-project` only in old assessments |
| 9 | Tests | ✅ PASS | exit: 279/279, entry: 77/77 |

---

## Details

### 1. Domain: `cellar-door.org` references

**Source code/types:** Clean — `EXIT_CONTEXT_V1` uses `cellardoor.network`.

**Still present (26 files):** Primarily in:
- `cellar-door-exit/specs/EXIT_SPEC_v1.md` (7 occurrences) — `@context` value in spec examples
- `cellar-door-exit/DECISIONS.md` (1) — historical decision record
- `docs/papers/EXIT_PAPER_v3.md`, `EXIT_PAPER_v4.md` (1 each) — paper examples
- Various `assessments/*.md` — historical audit notes (acceptable)
- `cellar-door-exit/docs/analysis/*.md` — analysis docs
- `dist/` and `node_modules/` — stale build artifacts

**Action needed:** Update `EXIT_SPEC_v1.md` context URI (the spec is normative). Papers and decisions can note the change or be left as historical.

### 2. Type Exports ✅

```typescript
export { signMarker, verifyMarker, type VerificationResult } from "./proof.js";
export { validateMarker, type ValidationResult } from "./validate.js";
```

Both correctly exported.

### 3. v1.1 Fields ✅

| Field | types.ts | validate.ts | JSON-LD context |
|-------|----------|-------------|-----------------|
| `completenessAttestation` | ✅ L179 | ✅ L136-138 | ✅ L43 |
| `disputeExpiry` | ✅ L264 | ✅ L142-144 | ✅ L44 |
| `resolution` | ✅ L266 | ✅ L148-150 | ✅ L45 |
| `arbiterDid` | ✅ L268 | ✅ L154-156 | ✅ L46 |
| `sequenceNumber` | ✅ L183 | ✅ L128-131 | ✅ L47 |

### 4. ExitType Test Coverage ⚠️

| ExitType | Tested? |
|----------|---------|
| Voluntary | ✅ |
| Forced | ✅ |
| Emergency | ✅ |
| KeyCompromise | ✅ |
| Acquisition | ✅ |
| **PlatformShutdown** | ❌ Not found in tests |
| **Directed** | ❌ Not found in tests |
| **Constructive** | ❌ Not found in tests |

**Action:** Add test cases for PlatformShutdown, Directed, and Constructive exit types.

### 5. "Transfer" Terminology ⚠️

**Good:** `ENTRY_SPEC_v1.0.md` includes explicit Passage notes (e.g., "To be renamed `PassageRecord` in v0.2.0").

**Needs update:** `cellar-door-entry/README.md`:
- Line 31: `## The Transfer Flow` — should note Passage rename
- Line 173: `### Transfer Verification` — should note Passage rename  
- Line 216: API table says "transfer verification" without Passage context

### 6. OpenClaw Skill ✅

- All 4 scripts exist: `exit.sh`, `entry.sh`, `verify.sh`, `transfer.sh`
- Scripts reference correct package names (`cellar-door-exit`, `cellar-door-entry`)
- SKILL.md API reference matches actual exports
- Scripts have 𓉸 in comments

### 7. Brand Elements ✅

𓉸 appears in: SKILL.md, all 4 scripts, brand-guide.md, visual.ts, api-guide.md

### 8. GitHub Org ✅

All source `package.json` files and READMEs use `CellarDoorExits`. The only `cellar-door-project` references are in old assessment files noting the inconsistency (already flagged and resolved).

### 9. Test Results ✅

- **cellar-door-exit:** 17 test files, **279 tests passed**, 6.66s
- **cellar-door-entry:** 1 test file, **77 tests passed**, 901ms

---

## Recommended Actions (Priority Order)

1. **Update EXIT_SPEC_v1.md** — Replace `cellar-door.org` with `cellardoor.network` in all `@context` values
2. **Add tests** for `PlatformShutdown`, `Directed`, `Constructive` ExitTypes
3. **Update cellar-door-entry README** — Add Passage notes to "Transfer" headings
4. **Rebuild dist/** — `npm run build` in cellar-door-exit to clear stale `.org` references from compiled output
