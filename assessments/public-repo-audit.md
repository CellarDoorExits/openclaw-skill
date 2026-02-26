# Public Repository Audit — CellarDoorExits Organization

**Date:** 2026-02-26
**Auditor:** Hawthorn (automated)
**Scope:** All 6 public GitHub repos under CellarDoorExits

---

## Summary

| Repo | Files (excl. node_modules) | Action Items |
|------|---------------------------|--------------|
| exit-door | 81 | ⚠️ 20 files should move to private |
| entry-door | 20 | ✅ All clear |
| vercel-ai-sdk | 18 | ✅ All clear |
| langchain | 21 | ✅ All clear |
| mcp-server | 9 | ✅ All clear |
| openclaw-skill | 8 | ✅ All clear |

**Critical finding:** The `exit-door` repo contains extensive internal analysis docs, legal red team reports, pitch strategies, competitive landscape research, and decision logs that reveal strategy. These should be moved to private (Hawthorn only).

---

## 1. CellarDoorExits/exit-door

### ✅ KEEP PUBLIC — Source Code & Tests

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `src/anchor.ts` | 4KB, 110 lines | KEEP PUBLIC | Source code |
| `src/batch.ts` | 8KB, 174 lines | KEEP PUBLIC | Source code |
| `src/ceremony.ts` | 8KB, 218 lines | KEEP PUBLIC | Source code |
| `src/chain.ts` | 4KB, 107 lines | KEEP PUBLIC | Source code |
| `src/cli.ts` | 28KB, 781 lines | KEEP PUBLIC | Source code |
| `src/context.ts` | 4KB, 100 lines | KEEP PUBLIC | Source code |
| `src/convenience.ts` | 4KB, 119 lines | KEEP PUBLIC | Source code |
| `src/crypto.ts` | 8KB, 176 lines | KEEP PUBLIC | Source code |
| `src/errors.ts` | 4KB, 103 lines | KEEP PUBLIC | Source code |
| `src/ethics.ts` | 16KB, 343 lines | KEEP PUBLIC | Source code |
| `src/guardrails.ts` | 8KB, 206 lines | KEEP PUBLIC | Source code |
| `src/index.ts` | 8KB, 235 lines | KEEP PUBLIC | Source code |
| `src/interop.ts` | 8KB, 230 lines | KEEP PUBLIC | Source code |
| `src/keri.ts` | 12KB, 328 lines | KEEP PUBLIC | Source code |
| `src/key-compromise.ts` | 8KB, 132 lines | KEEP PUBLIC | Source code |
| `src/marker.ts` | 8KB, 162 lines | KEEP PUBLIC | Source code |
| `src/modules/assets.ts` | 4KB, 68 lines | KEEP PUBLIC | Source code |
| `src/modules/continuity.ts` | 4KB, 36 lines | KEEP PUBLIC | Source code |
| `src/modules/dispute.ts` | 4KB, 43 lines | KEEP PUBLIC | Source code |
| `src/modules/index.ts` | 4KB, 30 lines | KEEP PUBLIC | Source code |
| `src/modules/lineage.ts` | 4KB, 105 lines | KEEP PUBLIC | Source code |
| `src/modules/origin-attestation.ts` | 4KB, 78 lines | KEEP PUBLIC | Source code |
| `src/modules/reputation.ts` | 4KB, 65 lines | KEEP PUBLIC | Source code |
| `src/modules/trust.ts` | 12KB, 357 lines | KEEP PUBLIC | Source code |
| `src/pre-rotation.ts` | 4KB, 105 lines | KEEP PUBLIC | Source code |
| `src/privacy.ts` | 8KB, 157 lines | KEEP PUBLIC | Source code |
| `src/proof.ts` | 4KB, 114 lines | KEEP PUBLIC | Source code |
| `src/registry.ts` | 4KB, 115 lines | KEEP PUBLIC | Source code |
| `src/resolver.ts` | 8KB, 157 lines | KEEP PUBLIC | Source code |
| `src/storage.ts` | 4KB, 108 lines | KEEP PUBLIC | Source code |
| `src/types.ts` | 24KB, 564 lines | KEEP PUBLIC | Source code |
| `src/validate.ts` | 8KB, 135 lines | KEEP PUBLIC | Source code |
| `src/vc.ts` | 4KB, 91 lines | KEEP PUBLIC | Source code |
| `src/demo/scenario1-voluntary.ts` | 8KB, 124 lines | KEEP PUBLIC | Demo code |
| `src/demo/scenario2-emergency.ts` | 8KB, 115 lines | KEEP PUBLIC | Demo code |
| `src/demo/scenario3-successor.ts` | 8KB, 181 lines | KEEP PUBLIC | Demo code |
| `src/__tests__/benchmarks.test.ts` | 8KB, 140 lines | KEEP PUBLIC | Tests |
| `src/__tests__/ceremony-edge-cases.test.ts` | 28KB, 630 lines | KEEP PUBLIC | Tests |
| `src/__tests__/devex.test.ts` | 8KB, 212 lines | KEEP PUBLIC | Tests |
| `src/__tests__/edge-cases.test.ts` | 12KB, 298 lines | KEEP PUBLIC | Tests |
| `src/__tests__/ethics.test.ts` | 12KB, 284 lines | KEEP PUBLIC | Tests |
| `src/__tests__/integration.test.ts` | 8KB, 237 lines | KEEP PUBLIC | Tests |
| `src/__tests__/keri.test.ts` | 12KB, 314 lines | KEEP PUBLIC | Tests |
| `src/__tests__/marker.test.ts` | 12KB, 325 lines | KEEP PUBLIC | Tests |
| `src/__tests__/modules.test.ts` | 12KB, 268 lines | KEEP PUBLIC | Tests |
| `src/__tests__/properties.test.ts` | 12KB, 324 lines | KEEP PUBLIC | Tests |
| `src/__tests__/sprint3.test.ts` | 12KB, 250 lines | KEEP PUBLIC | Tests |
| `src/__tests__/trust.test.ts` | 12KB, 357 lines | KEEP PUBLIC | Tests |
| `src/__tests__/vc.test.ts` | 4KB, 67 lines | KEEP PUBLIC | Tests |

### ✅ KEEP PUBLIC — Standard OSS Files

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `.gitignore` | 4KB, 2 lines | KEEP PUBLIC | Standard OSS |
| `.npmignore` | 4KB, 6 lines | KEEP PUBLIC | Standard OSS |
| `LICENSE` | 12KB, 191 lines | KEEP PUBLIC | License file |
| `README.md` | 8KB, 224 lines | KEEP PUBLIC | Documentation |
| `SECURITY.md` | 12KB, 246 lines | KEEP PUBLIC | Standard OSS governance |
| `package.json` | 4KB, 76 lines | KEEP PUBLIC | Package config |
| `package-lock.json` | 80KB, 2468 lines | KEEP PUBLIC | Lockfile |
| `tsconfig.json` | 4KB, 19 lines | KEEP PUBLIC | Config |

### ✅ KEEP PUBLIC — Specs & Schemas

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `specs/EXIT_SPEC_v1.md` | 20KB, 501 lines | KEEP PUBLIC | Spec document |
| `specs/EXIT_SPEC_v1.1.md` | 48KB, 1215 lines | KEEP PUBLIC | Spec document |
| `schemas/exit-context-v1.jsonld` | 4KB, 43 lines | KEEP PUBLIC | Schema |
| `benchmarks/results.md` | 4KB, 28 lines | KEEP PUBLIC | Benchmark data |
| `docs/GETTING_STARTED.md` | 8KB, 246 lines | KEEP PUBLIC | User-facing docs |
| `docs/EXIT_PAPER_DRAFT.md` | 40KB, 506 lines | KEEP PUBLIC | Academic paper — intended for publication |

### ✅ KEEP PUBLIC — Legal Compliance (Normative)

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `LEGAL.md` | 16KB, 262 lines | KEEP PUBLIC | Normative legal notice, serves as compliance doc for users |

### ⚠️ MOVE TO PRIVATE — Internal Strategy & Analysis

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `DECISIONS.md` | 12KB, 205 lines | **MOVE TO PRIVATE** | Internal decision log revealing architectural strategy and rationale behind choices — gives competitors insight into design tradeoffs |
| `docs/PITCH_IDEALIST.md` | 16KB, 197 lines | **MOVE TO PRIVATE** | Pitch strategy document — reveals fundraising/positioning approach |
| `docs/PITCH_PRAGMATIC.md` | 12KB, 200 lines | **MOVE TO PRIVATE** | Pitch strategy document — reveals market positioning and business framing |
| `docs/NIST_RFI_DRAFT.md` | 20KB, 271 lines | **MOVE TO PRIVATE** | Draft government submission — should not be public before submission; reveals lobbying strategy |
| `docs/NIST_RFI_PRAGMATIC.md` | 20KB, 283 lines | **MOVE TO PRIVATE** | Contains personal info (Warren Koch, warrenkoch@gmail.com); draft government submission |
| `analysis/howey-test-module-d.md` | 28KB, 344 lines | **MOVE TO PRIVATE** | Securities risk analysis — internal legal strategy doc; reveals risk awareness and mitigation approach |
| `docs/analysis/cellar-door-competitive-landscape.md` | 16KB, 190 lines | **MOVE TO PRIVATE** | Competitive intelligence — reveals who you see as competitors and your positioning against them |
| `docs/analysis/cellar-door-gastown-notes.md` | 12KB, 183 lines | **MOVE TO PRIVATE** | Internal working notes from Gastown sessions — raw strategy context |
| `docs/analysis/cellar-door-legal-lenses.md` | 72KB, 808 lines | **MOVE TO PRIVATE** | Multi-lens legal analysis by Hawthorn — internal strategy document |
| `docs/analysis/cellar-door-legal-redteam-v2.md` | 32KB, 379 lines | **MOVE TO PRIVATE** | Legal red team report — reveals vulnerabilities and risk awareness |
| `docs/analysis/cellar-door-legal-redteam.md` | 28KB, 383 lines | **MOVE TO PRIVATE** | Legal red team report — reveals vulnerabilities and risk awareness |
| `docs/analysis/cellar-door-master-assessment.md` | 40KB, 650 lines | **MOVE TO PRIVATE** | Master index of all internal assessments — roadmap of internal analysis work |
| `docs/analysis/cellar-door-mechanism-design.md` | 20KB, 437 lines | **MOVE TO PRIVATE** | Internal mechanism design analysis — reveals design reasoning not in spec |
| `docs/analysis/cellar-door-professional-reviews.md` | 44KB, 477 lines | **MOVE TO PRIVATE** | Simulated professional reviews (economics, ethics, devex) — internal assessment |
| `docs/analysis/cellar-door-project-plan.md` | 16KB, 258 lines | **MOVE TO PRIVATE** | Project plan with timelines and priorities — internal strategy |
| `docs/analysis/cellar-door-risk-heatmap.md` | 36KB, 465 lines | **MOVE TO PRIVATE** | Legal risk heat map — reveals exactly where you think the legal risks are |
| `docs/analysis/risk-scale-mapping.md` | 4KB, 45 lines | **MOVE TO PRIVATE** | Risk scale reference used by internal analysis docs |

---

## 2. CellarDoorExits/entry-door

All files are standard OSS (source code, tests, README, config). **No action needed.**

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `.gitignore` | 4KB, 2 lines | KEEP PUBLIC | Standard |
| `README.md` | 8KB, 231 lines | KEEP PUBLIC | Documentation |
| `package.json` | 4KB, 56 lines | KEEP PUBLIC | Config |
| `package-lock.json` | 68KB, 2088 lines | KEEP PUBLIC | Lockfile |
| `tsconfig.json` | 4KB, 15 lines | KEEP PUBLIC | Config |
| `src/index.ts` | 4KB, 86 lines | KEEP PUBLIC | Source code |
| `src/types.ts` | 4KB, 103 lines | KEEP PUBLIC | Source code |
| `src/admission-policy.ts` | 8KB, 126 lines | KEEP PUBLIC | Source code |
| `src/arrival.ts` | 4KB, 73 lines | KEEP PUBLIC | Source code |
| `src/capability-scope.ts` | 4KB, 63 lines | KEEP PUBLIC | Source code |
| `src/claim-tracking.ts` | 4KB, 99 lines | KEEP PUBLIC | Source code |
| `src/continuity.ts` | 4KB, 62 lines | KEEP PUBLIC | Source code |
| `src/convenience.ts` | 4KB, 40 lines | KEEP PUBLIC | Source code |
| `src/probation.ts` | 4KB, 57 lines | KEEP PUBLIC | Source code |
| `src/revocation.ts` | 8KB, 126 lines | KEEP PUBLIC | Source code |
| `src/sign.ts` | 4KB, 74 lines | KEEP PUBLIC | Source code |
| `src/transfer.ts` | 4KB, 62 lines | KEEP PUBLIC | Source code |
| `src/validation.ts` | 4KB, 119 lines | KEEP PUBLIC | Source code |
| `src/verify-departure.ts` | 4KB, 30 lines | KEEP PUBLIC | Source code |
| `src/__tests__/entry.test.ts` | 36KB, 861 lines | KEEP PUBLIC | Tests |

---

## 3. CellarDoorExits/vercel-ai-sdk

All files are standard OSS. **No action needed.**

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `.gitignore` | 4KB, 2 lines | KEEP PUBLIC | Standard |
| `.npmignore` | 4KB, 8 lines | KEEP PUBLIC | Standard |
| `LICENSE` | 12KB, 191 lines | KEEP PUBLIC | License |
| `README.md` | 4KB, 134 lines | KEEP PUBLIC | Documentation |
| `package.json` | 4KB, 57 lines | KEEP PUBLIC | Config |
| `package-lock.json` | 92KB, 2780 lines | KEEP PUBLIC | Lockfile |
| `tsconfig.json` | 4KB, 16 lines | KEEP PUBLIC | Config |
| `src/index.ts` | 4KB, 21 lines | KEEP PUBLIC | Source code |
| `src/entry-tools.ts` | 8KB, 140 lines | KEEP PUBLIC | Source code |
| `src/exit-middleware.ts` | 8KB, 153 lines | KEEP PUBLIC | Source code |
| `src/exit-tool.ts` | 4KB, 56 lines | KEEP PUBLIC | Source code |
| `src/__tests__/entry-tools.test.ts` | 4KB, 76 lines | KEEP PUBLIC | Tests |
| `src/__tests__/exit-middleware.test.ts` | 4KB, 65 lines | KEEP PUBLIC | Tests |
| `src/__tests__/exit-tool.test.ts` | 4KB, 51 lines | KEEP PUBLIC | Tests |
| `dist/index.cjs` | 128KB, 4265 lines | KEEP PUBLIC | Build output |
| `dist/index.d.cts` | 12KB, 261 lines | KEEP PUBLIC | Build output |
| `dist/index.d.ts` | 12KB, 261 lines | KEEP PUBLIC | Build output |
| `dist/index.js` | 128KB, 4253 lines | KEEP PUBLIC | Build output |

---

## 4. CellarDoorExits/langchain

All files are standard OSS. **No action needed.**

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `.gitignore` | 4KB, 2 lines | KEEP PUBLIC | Standard |
| `.npmignore` | 4KB, 8 lines | KEEP PUBLIC | Standard |
| `LICENSE` | 12KB, 191 lines | KEEP PUBLIC | License |
| `README.md` | 4KB, 104 lines | KEEP PUBLIC | Documentation |
| `package.json` | 4KB, 59 lines | KEEP PUBLIC | Config |
| `package-lock.json` | 100KB, 3115 lines | KEEP PUBLIC | Lockfile |
| `tsconfig.json` | 4KB, 16 lines | KEEP PUBLIC | Config |
| `vitest.config.ts` | 4KB, 7 lines | KEEP PUBLIC | Config |
| `src/index.ts` | 4KB, 8 lines | KEEP PUBLIC | Source code |
| `src/admission-tool.ts` | 4KB, 41 lines | KEEP PUBLIC | Source code |
| `src/entry-tool.ts` | 4KB, 33 lines | KEEP PUBLIC | Source code |
| `src/exit-callback.ts` | 4KB, 118 lines | KEEP PUBLIC | Source code |
| `src/exit-tool.ts` | 4KB, 66 lines | KEEP PUBLIC | Source code |
| `src/transfer-tool.ts` | 4KB, 46 lines | KEEP PUBLIC | Source code |
| `src/__tests__/entry-tools.test.ts` | 4KB, 83 lines | KEEP PUBLIC | Tests |
| `src/__tests__/exit-callback.test.ts` | 4KB, 44 lines | KEEP PUBLIC | Tests |
| `src/__tests__/exit-tool.test.ts` | 4KB, 43 lines | KEEP PUBLIC | Tests |
| `dist/index.cjs` | 128KB, 4268 lines | KEEP PUBLIC | Build output |
| `dist/index.d.cts` | 8KB, 157 lines | KEEP PUBLIC | Build output |
| `dist/index.d.ts` | 8KB, 157 lines | KEEP PUBLIC | Build output |
| `dist/index.js` | 128KB, 4258 lines | KEEP PUBLIC | Build output |

---

## 5. CellarDoorExits/mcp-server

All files are standard OSS. **No action needed.**

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `.gitignore` | 4KB, 2 lines | KEEP PUBLIC | Standard |
| `README.md` | 4KB, 113 lines | KEEP PUBLIC | Documentation |
| `package.json` | 4KB, 37 lines | KEEP PUBLIC | Config |
| `package-lock.json` | 96KB, 2824 lines | KEEP PUBLIC | Lockfile |
| `tsconfig.json` | 4KB, 15 lines | KEEP PUBLIC | Config |
| `src/index.ts` | 4KB, 21 lines | KEEP PUBLIC | Source code |
| `src/server.ts` | 16KB, 423 lines | KEEP PUBLIC | Source code |
| `src/__tests__/server.test.ts` | 4KB, 13 lines | KEEP PUBLIC | Tests |
| `tests/server.test.ts` | 8KB, 154 lines | KEEP PUBLIC | Tests |

---

## 6. CellarDoorExits/openclaw-skill

All files are standard OSS. **No action needed.**

| File | Size | Assessment | Reason |
|------|------|-----------|--------|
| `SKILL.md` | 4KB, 59 lines | KEEP PUBLIC | Skill documentation |
| `package.json` | 4KB, 5 lines | KEEP PUBLIC | Config |
| `package-lock.json` | 4KB, 97 lines | KEEP PUBLIC | Lockfile |
| `references/api-guide.md` | 4KB, 50 lines | KEEP PUBLIC | API reference |
| `scripts/entry.sh` | 4KB, 50 lines | KEEP PUBLIC | Script |
| `scripts/exit.sh` | 4KB, 18 lines | KEEP PUBLIC | Script |
| `scripts/transfer.sh` | 4KB, 59 lines | KEEP PUBLIC | Script |
| `scripts/verify.sh` | 4KB, 50 lines | KEEP PUBLIC | Script |

---

## Recommended Actions

### Immediate (exit-door repo)

1. **Move 17 analysis/strategy files to Hawthorn private repo:**
   - `DECISIONS.md`
   - `docs/PITCH_IDEALIST.md`
   - `docs/PITCH_PRAGMATIC.md`
   - `docs/NIST_RFI_DRAFT.md`
   - `docs/NIST_RFI_PRAGMATIC.md` ⚠️ **Contains personal info (email)**
   - `analysis/howey-test-module-d.md`
   - All 11 files in `docs/analysis/`

2. **After moving, remove from public repo** with a force-push to scrub git history (these files contain strategic intelligence that persists in git history even after deletion).

### No Action Needed

- `entry-door` — clean
- `vercel-ai-sdk` — clean
- `langchain` — clean
- `mcp-server` — clean
- `openclaw-skill` — clean

### Notes

- The `EXIT_PAPER_DRAFT.md` is borderline — it's an academic paper draft intended for publication. Keeping it public is fine if the intent is to share the research. If it contains unpublished ideas you want to protect, move it.
- `LEGAL.md` is a normative compliance document (tells users about legal constraints). This should stay public.
- No HOLOS architecture details were found leaked in any repo.
- `dist/` directories in vercel-ai-sdk and langchain contain bundled build output — these are fine to keep public but could be `.gitignore`d if you prefer npm-only distribution.
