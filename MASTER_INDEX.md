# MASTER INDEX — Hawthorn Knowledge Base

**Updated:** 2026-02-22 | **Author:** Hawthorn | **Status:** Living document

Total: ~79 .md files | ~210K tokens estimated

---

## How to Use

Files are grouped by project. Token counts are estimates (~4 tokens/word). Status key:
- **current** — Active, up-to-date
- **historical** — Retained for reference, not actively maintained
- **superseded** — Replaced by newer version

### Context Window Chunks (~100K tokens each)

**Chunk 1 — Cellar-Door Core** (~105K tokens)
All files under `projects/Cellar-Door/` (cellar-door-exit, assessments, docs)

**Chunk 2 — Projects + Memory + Root** (~105K tokens)
All files under `projects/HOLOS/`, `projects/Lumen/`, `projects/LAND/`, `projects/Fool-Hardy/`, `projects/Hot-Chip/`, `memory/`, root files, `state/`

---

## Root Files

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `AGENTS.md` | Agent workspace instructions and conventions | 4,876 | current |
| `HAWTHORN.md` | Project overview and repo description | 3,752 | current |
| `HEARTBEAT.md` | Heartbeat/idle loop operational config | 1,432 | current |
| `IDENTITY.md` | Agent identity template | 772 | current |
| `LOGS.md` | Operational logs | 2,408 | current |
| `MEMORY.md` | Long-term curated memory | 1,660 | current |
| `SOUL.md` | Agent personality/identity core | 1,080 | current |
| `TODO.md` | Active task list and priorities | 15,984 | current |
| `TODO_old.md` | Previous task list snapshot | 14,812 | historical |
| `TOOLS.md` | Local tool notes and config | 532 | current |
| `USER.md` | User profile (Warren Koch) | 916 | current |
| `agent_test.md` | Test file | 12 | historical |

**Root subtotal: ~48,236 tokens**

---

## projects/Cellar-Door/

### docs/papers/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `EXIT_PAPER_v3.md` | EXIT protocol academic paper v3 | 24,504 | superseded |
| `EXIT_PAPER_v4.md` | EXIT protocol academic paper v4 | 24,548 | current |

### docs/analysis/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `cellar-door-benchmarks.md` | Benchmark results summary | 1,004 | current |
| `cellar-door-business-plan.md` | Business plan and strategic analysis | 21,524 | current |
| `cellar-door-integration-analysis.md` | Platform integration analysis | 9,624 | current |
| `cellar-door-legal-battery.md` | Legal analysis battery (multi-test) | 24,704 | current |
| `cellar-door-paper-readiness.md` | arXiv paper readiness assessment | 8,508 | current |
| `cellar-door-pre-export-checklist.md` | Pre-export readiness checklist | 7,820 | current |
| `cellar-door-slogan-workshop.md` | Branding/slogan workshop | 8,620 | current |

### docs/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `style-guide.md` | Terminology and writing conventions | 892 | current |

### assessments/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `antitrust-analysis.md` | Antitrust risk analysis for EXIT | 15,968 | current |
| `cross-group-assessment.md` | Cross-group consistency check | 9,992 | current |
| `fix-log-C1-C5.md` | Fix log: marker size & test count | 1,548 | historical |
| `fix-log-C2-C4.md` | Fix log: contradictions & reputation_score removal | 1,608 | historical |
| `fix-log-important.md` | Fix log: important items | 1,328 | historical |
| `fix-log-legal-consolidation.md` | Fix log: legal consolidation | 2,092 | historical |
| `fix-log-remaining.md` | Fix log: remaining items | 1,740 | historical |
| `group-a-exit-core.md` | Assessment: EXIT core consistency | 8,764 | current |
| `group-b-legal-risk.md` | Assessment: legal & risk | 10,520 | current |
| `group-cd-strategy-comms.md` | Assessment: strategy & communications | 7,832 | current |
| `group-e-holos-vision.md` | Assessment: HOLOS vision alignment | 9,652 | current |
| `group-f-side-projects.md` | Assessment: side projects | 8,272 | current |
| `howey-module-d-v2.md` | Howey test analysis v2 (unconstrained) | 15,944 | current |
| `remaining-work-audit.md` | Audit of remaining work across groups | 9,928 | current |

### cellar-door-exit/ (exportable product)

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `README.md` | Project readme | 3,524 | current |
| `DECISIONS.md` | Architectural decision log | 5,304 | current |
| `LEGAL.md` | Legal compliance notice | 8,216 | current |
| `SECURITY.md` | Security considerations | 6,472 | current |
| `analysis/howey-test-module-d.md` | Howey test analysis for Module D | 14,504 | current |
| `benchmarks/results.md` | Test & benchmark results | 640 | current |
| `docs/EXIT_PAPER_DRAFT.md` | EXIT paper early draft | 21,532 | superseded |
| `docs/GETTING_STARTED.md` | Quick-start guide | 3,100 | current |
| `docs/NIST_RFI_DRAFT.md` | NIST RFI response (idealist version) | 9,888 | current |
| `docs/NIST_RFI_PRAGMATIC.md` | NIST RFI response (pragmatic version) | 10,476 | current |
| `docs/PITCH_IDEALIST.md` | Pitch deck: idealist framing | 8,000 | current |
| `docs/PITCH_PRAGMATIC.md` | Pitch deck: pragmatic framing | 6,496 | current |
| `docs/analysis/cellar-door-competitive-landscape.md` | Competitive landscape research | 8,828 | current |
| `docs/analysis/cellar-door-gastown-notes.md` | Gastown docs crude summaries | 5,492 | historical |
| `docs/analysis/cellar-door-legal-lenses.md` | Multi-lens legal analysis | 41,036 | current |
| `docs/analysis/cellar-door-legal-redteam-v2.md` | Legal red team v2 | 17,992 | current |
| `docs/analysis/cellar-door-legal-redteam.md` | Legal red team v1 | 16,280 | superseded |
| `docs/analysis/cellar-door-master-assessment.md` | Master assessment index | 20,084 | current |
| `docs/analysis/cellar-door-mechanism-design.md` | Mechanism design analysis | 10,472 | current |
| `docs/analysis/cellar-door-professional-reviews.md` | Three professional reviews | 24,708 | current |
| `docs/analysis/cellar-door-project-plan.md` | Macro project plan | 7,892 | historical |
| `docs/analysis/cellar-door-risk-heatmap.md` | Legal risk heat map | 18,192 | current |
| `docs/analysis/risk-scale-mapping.md` | Risk rating scale mapping reference | 1,872 | current |
| `specs/EXIT_SPEC_v1.md` | EXIT specification v1.0 | 10,328 | superseded |
| `specs/EXIT_SPEC_v1.1.md` | EXIT specification v1.1 | 26,112 | current |

**Cellar-Door subtotal: ~504,712 tokens**

---

## projects/HOLOS/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `holos-investment-thesis.md` | Investment thesis v1 | 19,920 | superseded |
| `holos-investment-thesis-v2.md` | Investment thesis v2 | 19,412 | superseded |
| `holos-investment-thesis-v3.md` | Investment thesis v3 — complete portfolio | 22,484 | current |
| `holos-portfolio-strategy.md` | Portfolio strategy & business plan | 21,552 | current |

**HOLOS subtotal: ~83,368 tokens**

---

## projects/Lumen/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `lumen-solar-optical-analysis.md` | Solar-optical computing analysis v1 | 8,648 | superseded |
| `lumen-solar-optical-analysis-v2.md` | Optical computing analysis v2 (full read) | 13,668 | current |

**Lumen subtotal: ~22,316 tokens**

---

## projects/LAND/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `LAND-analysis.md` | Land investment opportunities analysis | 10,460 | superseded |
| `LAND-analysis-v2.md` | Land investment deep analysis v2 | 19,404 | current |

**LAND subtotal: ~29,864 tokens**

---

## projects/Fool-Hardy/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `fool-hardy-analysis.md` | AI consulting opportunity analysis | 10,900 | current |

**Fool-Hardy subtotal: ~10,900 tokens**

---

## projects/Hot-Chip/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `hot-chip-analysis.md` | Fry kiosk project analysis | 5,760 | current |

**Hot-Chip subtotal: ~5,760 tokens**

---

## memory/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `2026-02-18.md` | Day one timeline and notes | 1,496 | historical |
| `2026-02-19.md` | Day two timeline and notes | 1,888 | historical |
| `HAWTHORN.md` | Project overview copy (in memory) | 3,752 | current |
| `TODO.md` | TODO copy (in memory) | 14,812 | current |
| `holos-deep-notes.md` | Deep reading notes on all HOLOS docs | 16,556 | current |
| `holos-overview.md` | HOLOS first reading overview | 5,872 | current |
| `locus-primitive-review.md` | LOCUS_PRIMITIVE review notes | 1,484 | current |
| `pensieve-notes.md` | Pensieve repo analysis notes | 8,164 | current |
| `reading-notes.md` | Reading notes (Signamancy, HOLOS, etc.) | 28,100 | current |

**Memory subtotal: ~82,124 tokens**

---

## state/

| File | Description | ~Tokens | Status |
|------|-------------|---------|--------|
| `hawthorn-state.md` | Agent operational state snapshot | 624 | current |

---

## Grand Total: ~787,880 tokens (~79 files)
