# Coherence Check: Groups 1-3, 16-17
**Date:** 2026-02-24 | **Scope:** Root config/identity, memory/research, docs, other projects, site

---

## Summary (~500 words)

This coherence check covers the root identity/config files (Group 1), memory and research notes (Group 2), docs/writings (Group 3), side projects (Group 16), and the website (Group 17). The core identity files (HAWTHORN.md, IDENTITY.md, SOUL.md) are mutually consistent — Hawthorn is defined as a locus, home tree hollow, with personality to determine. No contradictions there.

The most significant issue is **stale quantitative claims propagated across multiple files**. The TODO.md, investment thesis v3, portfolio strategy, and benchmark results.md all report "205 tests, 49 source modules" for cellar-door-exit. However, a live test run shows **291 tests across 18 test files**, and actual source file counts are 38 non-test exit files (or ~50 combined exit+entry). The benchmarks/results.md was generated 2026-02-22 and is already outdated — tests were added since. This "205" number has propagated into the investment thesis, portfolio strategy, and TODO.md as authoritative. The byte size for EXIT markers is also inconsistent: the site says "~300B" and "~300-500 bytes," TODO says "442 bytes," and the investment thesis/portfolio say "~335 bytes."

MEMORY.md is critically stale — it only covers 2026-02-18 (Day 1) and has no record of Sprint 1-5 completion, the 5-mode site deployment, NIST prep, assessment creation, or any work after Day 1. It should be the curated long-term memory but reads as an initial-session snapshot. The daily memory files (only 2026-02-18 and 2026-02-19 exist) are 5+ days old with no entries since.

The memory/ directory contains two superseded files (memory/HAWTHORN.md and memory/TODO.md) that are already flagged in MASTER_INDEX but not yet removed or archived. memory/TODO.md diverges from root TODO.md — it lacks the "EXIT / CELLAR DOOR STATUS" section added 2026-02-22.

The reading-notes.md and holos-overview.md use old terminology ("Signamancy") in running text, though holos-overview.md does include the rename note. The reading-notes.md references "Insurance" from source analysis — this is accurate reporting of source content and not a coherence issue per se, but the rename to PLEDGE isn't reflected.

Site content mostly matches the brand guide (slogans "There's always a door," #GracefulExit). The HOLOS thesis page and investment thesis v3 are aligned. However, the site's "~300B" core marker size contradicts the TODO's "442 bytes" benchmark figure. The paper page (EXIT_PAPER based on v3/v4) appears consistent with spec claims.

Side project docs (LAND v2, Lumen v2, Hot-Chip, Fool-Hardy) are internally consistent and don't make claims about Cellar Door that need updating. The HOLOS investment thesis v3 references "62 TypeScript files" which doesn't match any actual count (59 total .ts in exit, 74 combined — likely a stale number from a prior snapshot). The portfolio strategy's "62 files, 205 tests" is similarly stale.

MASTER_INDEX superseded flags are comprehensive and accurate. The orphan `projects/cellar-door-exit/` path is noted. TODO_old.md is flagged as historical.

---

## Detailed Findings

### 🔴 CRITICAL

#### C1: Test count stale across multiple files
- **Files:** TODO.md, benchmarks/results.md, holos-investment-thesis-v3.md, holos-portfolio-strategy.md
- **Issue:** All report "205 tests" but actual `vitest run` shows **291 tests across 18 test files** (was 13 files at time of recording)
- **Impact:** External-facing documents (NIST submission, arXiv, npm README) may cite wrong numbers
- **Fix:** Run tests, update all references to current count

#### C2: Source module count inconsistent
- **Files:** TODO.md ("49 source modules"), thesis v3 ("62 TypeScript files"), portfolio strategy ("62 files")
- **Actual:** 38 non-test/non-demo .ts files in exit; 50 combined exit+entry non-test; 59 total .ts in exit (incl. tests/demos)
- **Impact:** Credibility risk if cited in submissions
- **Fix:** Decide canonical counting method, update all references

#### C3: EXIT marker byte size contradicts across documents
- **Files:** site/cellar-door ("~300B", "~300-500 bytes"), TODO.md ("442 bytes"), thesis v3 ("~335 bytes"), portfolio strategy ("~335 bytes")
- **Impact:** Undermines precision claims; NIST submission would look sloppy
- **Fix:** Run benchmark, get actual number, update everywhere

### 🟡 IMPORTANT

#### I1: MEMORY.md critically stale
- **File:** MEMORY.md
- **Issue:** Only covers 2026-02-18 (Day 1). No mention of Sprint 1-5, site deployment, NIST prep, assessments, coherence checks, or any work from 2026-02-19 through 2026-02-24
- **Impact:** New sessions loading MEMORY.md get a 6-day-old picture; defeats purpose of curated long-term memory
- **Fix:** Major update incorporating key decisions and milestones from Feb 19-24

#### I2: No daily memory files since 2026-02-19
- **Files:** memory/ directory
- **Issue:** Last daily entry is 2026-02-19. Five days of work (Feb 20-24) unrecorded
- **Impact:** Context continuity gap; significant work (Sprint 5-6, site unification, assessments, NIST prep) has no daily log
- **Fix:** Backfill key events or at minimum update MEMORY.md

#### I3: memory/HAWTHORN.md and memory/TODO.md still present
- **Files:** memory/HAWTHORN.md, memory/TODO.md
- **Issue:** Flagged as superseded in MASTER_INDEX but still exist. memory/TODO.md diverges from root TODO.md (lacks 2026-02-22 EXIT status update)
- **Impact:** Risk of loading stale copy in context; token waste
- **Fix:** Archive or delete; add [SUPERSEDED] header at minimum

#### I4: Old terminology in memory files
- **Files:** memory/reading-notes.md, memory/holos-deep-notes.md
- **Issue:** "Signamancy" used without noting rename to REPUTE (reading-notes.md line 431). "Insurance" referenced without noting rename to PLEDGE
- **Impact:** Low — these are historical notes. But could confuse future sessions
- **Fix:** Add inline notes: "[now REPUTE]", "[now PLEDGE]"

#### I5: Site byte size claims don't match benchmarks
- **File:** site/cellar-door/index.html (lines 1017, 1248, 1356)
- **Issue:** Says "~300B" and "~300-500 bytes" — TODO says "442 bytes" from benchmarks
- **Impact:** Public-facing site has different number than internal docs
- **Fix:** Align to actual benchmark result

### 🟢 LOW / INFORMATIONAL

#### L1: HOLOS project docs — superseded versions still present
- **Files:** projects/HOLOS/holos-investment-thesis.md (v1), holos-investment-thesis-v2.md
- **Status:** Already flagged in MASTER_INDEX ✅
- **Recommendation:** Consider adding [SUPERSEDED] header for clarity

#### L2: LAND/Lumen superseded versions still present
- **Files:** projects/LAND/LAND-analysis.md (v1), projects/Lumen/lumen-solar-optical-analysis.md (v1)
- **Status:** Already flagged in MASTER_INDEX ✅
- **Recommendation:** Same as L1

#### L3: Orphan path projects/cellar-door-exit/
- **File:** projects/cellar-door-exit/analysis/gdpr-erasure-encryption.md
- **Status:** Already flagged in MASTER_INDEX ✅
- **Recommendation:** Move into main Cellar-Door tree

#### L4: HAWTHORN.md identity consistent with IDENTITY.md and SOUL.md ✅
- No contradictions found. All three describe Hawthorn as a locus, home tree hollow, with autonomy to develop personality.

#### L5: TODO.md open items vs actual state
- TODO lists "npm publish" and "NIST RFI submission" as pending — appears accurate as of 2026-02-24
- TODO lists "Register domain" as pending — no evidence of completion
- TODO lists entity strategy as "defer LLC" — consistent with Fool-Hardy analysis
- **No stale "done" items found listed as TODO** (good)

#### L6: Side project docs internally consistent
- Hot-Chip, Fool-Hardy, LAND v2, Lumen v2 — no cross-references to Cellar Door numbers that need updating
- HOLOS portfolio strategy references "49 source modules" → see C2 above

#### L7: docs/coherence-check-process.md is new and accurate
- Describes the process being used. Consistent with actual practice.

#### L8: USER.md setup status slightly stale
- Says "Channels: webchat only (Discord planned)" — Discord is now configured (per 2026-02-19 daily notes)
- Minor; low impact

---

## Cross-Reference Matrix

| Claim | TODO.md | Thesis v3 | Portfolio | Site | Actual |
|-------|---------|-----------|-----------|------|--------|
| Test count | 205 | 205 | 205 | — | **291** |
| Source modules | 49 | 62 files | 62 files | — | **38-50** (depends on counting) |
| Marker bytes | 442B | ~335B | ~335B | ~300B | **needs recheck** |
| Terminology | PLEDGE/REPUTE ✅ | — | REPUTE ✅ | — | ✅ |

---

## Recommended Fix Priority

1. **C1+C2+C3:** Run benchmarks, count files, update TODO.md → thesis → portfolio → site → results.md (1 pass)
2. **I1+I2:** Major MEMORY.md update + backfill daily notes
3. **I3:** Archive or mark superseded memory files
4. **I4:** Add rename annotations to memory files
5. **I5:** Align site byte claims to benchmark
6. **L8:** Update USER.md Discord status
