# M-11 Consolidated Consistency Check + TODO Prioritization
**Date:** 2026-02-25 ~23:15 UTC  
**Sources:** Code+specs sub-agent report, docs/site/index manual scan  
**Test baseline:** 399 tests, 24 test files, ~70 src .ts files

---

## 🔴 CRITICAL / HIGH Issues

| # | Issue | File(s) | Action |
|---|-------|---------|--------|
| 1 | **`package.json` still 0.1.0** — all v0.2.0 features shipped | `cellar-door-exit/package.json` | Bump to 0.2.0, npm publish |
| 2 | **`telemetry.ts` hardcodes `"Ed25519"` algorithm** in span attributes | `src/telemetry.ts:130` | Read from `marker.proof.type` instead |
| 3 | **`types.ts` JSDoc says `EcdsaSecp256k1Signature2019`** — wrong curve! Should be P-256 | `src/types.ts:79` | Fix to `EcdsaP256Signature2019` |
| 4 | **Paper v5 says "395 tests"** — actual is 399 | `docs/papers/EXIT_PAPER_v5.md` | Update abstract + §1.3 |

## 🟡 MEDIUM Issues

| # | Issue | File(s) | Action |
|---|-------|---------|--------|
| 5 | README says "23 test files" — actual is 24 | `cellar-door-exit/README.md` | Update count |
| 6 | Paper says "eight mandatory fields" vs code's "7 fields" | Paper §3.2 vs types.ts | Pick one framing, align |
| 7 | Telemetry version hardcoded `"0.1.0"` in 3 places | `src/telemetry.ts:87,124,140` | Extract shared version constant |
| 8 | No Passage-named telemetry wrappers | `src/telemetry.ts` | Add `instrumentedSignDepartureMarker` etc |
| 9 | Old exports lack `@deprecated` JSDoc | `src/index.ts` | Add deprecation notices |
| 10 | `passage.ts` imports from `./index.js` — fragile circular-ish chain | `src/passage.ts` | Import directly from `./proof.js` |

## 🟢 LOW Issues

| # | Issue | File(s) | Action |
|---|-------|---------|--------|
| 11 | Marker size ranges inconsistent across docs (~300-500 vs ~335 vs ~335/660) | Various | Standardize to "~335B unsigned, ~660B signed" |
| 12 | `SECURITY.md` listed twice in MASTER_INDEX (lines 304, 319) | `MASTER_INDEX.md` | Deduplicate |

---

## 📋 Prioritized TODO List

### P0 — Fix Before Next Publish (do now)
1. ~~Fix `types.ts` JSDoc curve name~~ (secp256k1 → P-256) — 1 min
2. Fix `telemetry.ts` hardcoded algorithm — detect from marker — 10 min  
3. Bump `package.json` to 0.2.0 — 1 min
4. Extract version constant for telemetry — 5 min
5. Update paper v5 test count 395→399 — 2 min
6. Update README test file count 23→24 — 1 min
7. `npm publish` cellar-door-exit@0.2.0 — 5 min

### P1 — Do This Sprint
8. Add Passage-named telemetry wrappers
9. Add `@deprecated` JSDoc to old API names in index.ts
10. Fix passage.ts import chain (import from proof.js directly)
11. Deduplicate SECURITY.md in MASTER_INDEX
12. Reconcile "mandatory field count" in paper

### P2 — Brand/Docs Queue (from HEARTBEAT.md)
13. Dual-track README (technical + brand site)
14. Poet page UX improvements  
15. Update cellar-door.dev site with latest features

### P3 — Deferred / Next Milestone
16. NIST RFI submission (deadline March 9)
17. Show HN post (March 10-14 window)
18. arXiv/LaTeX conversion (Warren's task)
19. Python SDK
20. Entry-door spec document
21. Standalone exit-spec-v1.2 with all new features documented

---

## HEARTBEAT.md Status
- Implementation queue: ✅ All 10 items complete
- Brand/docs queue: 3 items remaining
- Recommend adding P0 fixes above as a new "consistency fix" queue item
