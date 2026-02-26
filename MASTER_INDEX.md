# MASTER INDEX — Hawthorn Knowledge Base

**Updated:** 2026-02-25T22:05Z | **Author:** Hawthorn (auto-reindex) | **Status:** Living document

**Total files:** ~220 | **Text files (meaningful tokens):** ~590K tokens | **Binary/images:** ~9.5M tokens (excluded from context groupings)

> Token counts = `wc -c / 4`. Context-window groups target ~30K tokens of **text** content each.
> Binary files (images, icons, lockfiles) listed but excluded from groupings.

---

## ⚠️ Flags

| File | Issue |
|------|-------|
| `memory/HAWTHORN.md` | **Superseded** — duplicate of root `HAWTHORN.md` |
| `memory/TODO.md` | **Superseded** — stale copy of root `TODO.md` (content differs) |
| `TODO_old.md` | **Historical** — earlier TODO version, can archive |
| `projects/cellar-door-exit/` (orphan) | **Orphan path** — single file outside main Cellar-Door tree; consider moving |
| `cellar-door-exit/specs/EXIT_SPEC_v1.md` | **Superseded** by EXIT_SPEC_v1.1.md |
| `cellar-door-exit/docs/EXIT_PAPER_DRAFT.md` | **Superseded** by EXIT_PAPER_v3/v4/v5 |
| `projects/Cellar-Door/docs/papers/EXIT_PAPER_v4.md` | **Superseded** by EXIT_PAPER_v5 |
| `projects/HOLOS/holos-investment-thesis.md` | **Superseded** by v2 → v3 |
| `projects/LAND/LAND-analysis.md` | **Superseded** by LAND-analysis-v2 |
| `projects/Lumen/lumen-solar-optical-analysis.md` | **Superseded** by v2 |
| `assessments/fix-log-*.md` (6 files) | **Historical** — fix logs from completed sprints |
| `cellar-door-exit/docs/analysis/cellar-door-legal-redteam.md` | **Superseded** by v2 |

### Naming Convention Note
- **ALLCAPS filenames** (e.g., `MEMORY.md`, `MASTER_INDEX.md`) are reserved for fundamental/constitutional files
- Reports, plans, and procedural outputs should use `kebab-case` (e.g., `implementation-plan.md`)
- Procedures use versioned names: `SECURITY_AUDIT_v1.0.md` (ALLCAPS acceptable for formal procedures)

### New Files (2026-02-26)
| File | Group | Tokens (est) |
|------|-------|-------------|
| `procedures/SECURITY_AUDIT_v1.0.md` | Procedures | ~3K |
| `procedures/SECURITY_AUDIT_v1.0_REVIEWS.md` | Procedures | ~6K |
| `procedures/SECURITY_AUDIT_v1.1.md` | Procedures | ~4K |
| `procedures/SECURITY_AUDIT_v1.1_REVIEWS.md` | Procedures | ~4K |
| `procedures/audit/crypto-review.md` | Audit Reports | ~3K |
| `procedures/audit/protocol-review.md` | Audit Reports | ~3K |
| `procedures/audit/input-review.md` | Audit Reports | ~3K |
| `procedures/audit/supply-chain-review.md` | Audit Reports | ~2K |
| `procedures/audit/spec-conformance-review.md` | Audit Reports | ~4K |
| `procedures/audit/legal-review.md` | Audit Reports | ~3K |
| `procedures/audit/adversarial-review.md` | Audit Reports | ~3K |
| `procedures/audit/adversarial-tests.ts` | Audit Reports | ~2K |
| `procedures/audit/ATTESTATION.md` | Audit Reports | ~2K |
| `procedures/audit/implementation-plan.md` | Audit Reports | ~4K |
| `assessments/persona-v3/synthesis.md` | Assessments | ~8K |
| `projects/Cellar-Door/docs/SHOW_HN_DRAFTS.md` | Docs | ~12K |

---

## Group 1 — Root Config & Identity (~28K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `AGENTS.md` | 1,967 | `887a5a8` | Workspace conventions, safety rules, heartbeat behavior |
| `HAWTHORN.md` | 1,449 | `bd3fde6` | Repo identity — name, GitHub links, org membership |
| `HEARTBEAT.md` | 673 | `c49b6e1` | Heartbeat idle loop instructions and reading queue |
| `IDENTITY.md` | 278 | `6642b57` | Agent identity card — name: Hawthorn, creature: Locus |
| `LOGS.md` | 1,172 | `19f9684` | Chronological operational log entries |
| `MACROS.md` | ~2,900 | — | Reusable orchestration patterns (12 macros) — sprint cycles, scrutiny, context mgmt |
| `MASTER_INDEX.md` | ~4,400 | *(self)* | This file |
| `MEMORY.md` | 672 | `ca3e67a` | Long-term curated memory — who I am, key lessons |
| `SOUL.md` | 418 | `792306a` | Core personality and values |
| `TODO.md` | 6,413 | `b913a32` | Master task list — context optimization, HOLOS, Cellar Door |
| `TODO_old.md` | 5,906 | `7e500f4` | Earlier TODO version ⚑ historical |
| `TOOLS.md` | 215 | `917e2fa` | Local tool notes template |
| `USER.md` | 381 | `75f7ea1` | About Warren Koch — PST, senior programmer |
| `agent_test.md` | 2 | `7854b4e` | Git push test file |
| `hello_world.txt` | 1 | `9daeafb` | Test file |
| `code/docker-compose.yml` | 334 | `3e37e55` | Docker compose config |
| `code/openclaw.json` | 401 | `2ac952a` | OpenClaw configuration |
| `state/hawthorn-state.md` | 299 | `9e6133d` | Agent state tracking |
| `.gitignore` | 3 | `52ce15a` | Git ignore rules |
| `.netlify/netlify.toml` | 109 | `7eaa4bf` | Netlify deploy config |
| `desktop.ini` | 112 | `2991596` | Windows folder icon config |

**Subtotal:** ~25,205 tokens

---

## Group 2 — Memory & Research Notes (~37K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `memory/2026-02-18.md` | 695 | `50b2572` | Day One — first scan, cron errors, cleanup |
| `memory/2026-02-19.md` | 802 | `5be72ab` | Day Two — Discord config, Pensieve, reading queue |
| `memory/HAWTHORN.md` | 1,449 | `bd3fde6` | ⚑ Superseded copy of root HAWTHORN.md |
| `memory/TODO.md` | 5,906 | `ce500c0` | ⚑ Superseded copy of TODO |
| `memory/holos-deep-notes.md` | 7,977 | `f612fcc` | Deep reading notes on all HOLOS repo docs |
| `memory/holos-overview.md` | 2,777 | `511b0a4` | First reading — HOLOS as sovereign economic protocol |
| `memory/locus-primitive-review.md` | 640 | `3cf9663` | Review of LOCUS_PRIMITIVE.md — 8/10 |
| `memory/pensieve-notes.md` | 3,853 | `e2c6cca` | Analysis of Pensieve memory tool repository |
| `memory/reading-notes.md` | 13,636 | `1935965` | Summaries of Signamancy, Seel, Looking Glass, Weaver, Resonance |
| `memory/scrapbook.md` | ~2,100 | — | Conversation moments & quotes worth keeping |
| `memory/discord-export/` | ~20,500 | — | Full #updates channel export (7 batch files, Feb 22–24) |

**Subtotal:** ~60,335 tokens

---

## Group 3 — Docs & Writings (~92K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `docs/Hawthorn_Hollows_Hosting_Plan.txt` | 4,961 | `e08a12c` | Hawthorn Hollows hosting/business plan |
| `docs/peace_through_commerce.txt` | 58,953 | `d07b7cf` | Long-form essay: peace through commerce |
| `docs/coherence-check-process.md` | 538 | `1824c2b` | Meta-process documentation for coherence checks |
| `docs/searches/godaddy_cellardoor_2026-02-22.txt` | 27,912 | `a19d7aa` | Domain search results for cellar-door |

**Subtotal:** ~92,364 tokens

---

## Group 4 — Cellar-Door Assessments A (~30K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `projects/Cellar-Door/assessments/antitrust-analysis.md` | 7,078 | `a22c6ae` | Antitrust gap analysis for EXIT protocol |
| `assessments/cross-group-assessment.md` | 4,003 | `e1076be` | Cross-group consistency check |
| `assessments/entry-door-analysis.md` | 5,627 | `129f411` | ENTRY as arrival counterpart to EXIT |
| `assessments/entry-institutional-research.md` | 8,992 | `ba0a4e8` | Institutional arrival → agent onboarding mapping |
| `assessments/entry-security-legal-audit.md` | 4,695 | `6d484bd` | Adversarial audit of entry source modules |

**Subtotal:** ~30,395 tokens

---

## Group 5 — Cellar-Door Assessments B (~30K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `assessments/group-a-exit-core.md` | 3,666 | `1871899` | Group A: EXIT core consistency |
| `assessments/group-b-legal-risk.md` | 4,569 | `3e20523` | Group B: EXIT legal & risk |
| `assessments/group-cd-strategy-comms.md` | 3,345 | `b606f3e` | Groups C+D: strategy & communications |
| `assessments/group-e-holos-vision.md` | 4,050 | `73a1d99` | Group E: HOLOS vision consistency |
| `assessments/group-f-side-projects.md` | 3,469 | `6ff67bb` | Group F: side projects assessment |
| `assessments/howey-module-d-v2.md` | 6,972 | `b6006ca` | Howey test v2 — Module D (Critical risk) |
| `assessments/remaining-work-audit.md` | 3,472 | `db26452` | Remaining work audit |

**Subtotal:** ~29,543 tokens

---

## Group 6 — Cellar-Door Assessments C (Multi-lens + NIST + Misc) (~33K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `assessments/multi-lens-batch1.md` | 7,453 | `333e4d7` | Multi-lens review batch 1 |
| `assessments/multi-lens-batch2.md` | 7,776 | `ff39651` | Multi-lens review batch 2 |
| `assessments/multi-lens-batch3.md` | 6,365 | `accd6d8` | Multi-lens review batch 3 |
| `assessments/multi-lens-batch4.md` | 6,839 | `72fe596` | Multi-lens review batch 4 |
| `assessments/multi-lens-batch5.md` | 5,810 | `decc255` | Multi-lens review batch 5 |
| `assessments/multi-lens-review-plan.md` | 3,867 | `7dbb90e` | Multi-lens review plan |
| `assessments/multi-lens-synthesis.md` | 5,403 | `c1b5576` | Multi-lens synthesis |
| `assessments/nist-rfi-cynical-review.md` | 4,448 | `3821bb9` | Adversarial NIST RFI review |
| `assessments/nist-rfi-fixes.md` | 777 | `c4ee99d` | NIST RFI revision summary |
| `assessments/nist-submission-mechanics.md` | 1,528 | `ac3be97` | NIST submission mechanics |
| `assessments/spec-nist-update-gather.md` | 4,090 | — | Spec + NIST update gathering notes |
| `assessments/cross-consistency-post-fixes.md` | 1,133 | — | Cross-consistency check after fixes |
| `assessments/branding-analysis.md` | 4,749 | — | Branding analysis for Cellar Door |
| `assessments/institutional-backing-options.md` | 3,750 | — | Institutional backing options research |
| `assessments/community-marketing-options.md` | 4,989 | — | Community & marketing options |
| `assessments/paper-v5-gather.md` | 5,026 | — | Paper v5 gathering notes |
| `assessments/consistency-check-code.md` | 1,670 | — | Consistency check: code |
| `assessments/consistency-check-docs.md` | 3,162 | — | Consistency check: docs |
| `assessments/consistency-check-integrations.md` | 3,490 | — | Consistency check: integrations |

**Subtotal:** ~82,325 tokens *(should split further)*

---

## Group 7 — Cellar-Door Assessments D (Small/Historical) (~15K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `assessments/entry-door-build.md` | 616 | `f9b4b6c` | Build summary for entry Tier 1 |
| `assessments/entry-door-expansion.md` | 912 | `3fde1e8` | Production expansion — 7 new modules |
| `assessments/entry-security-fixes.md` | 533 | `c8b4ebe` | Security fix summary for entry |
| `assessments/final-publish-prep.md` | 461 | `db0455d` | Integration packages pushed to GitHub |
| `assessments/fix-log-C1-C5.md` | 768 | `3cfd1a9` | ⚑ Historical fix log |
| `assessments/fix-log-C2-C4.md` | 821 | `7b52567` | ⚑ Historical fix log |
| `assessments/fix-log-important.md` | 689 | `11797e3` | ⚑ Historical fix log |
| `assessments/fix-log-legal-consolidation.md` | 1,112 | `f7d8044` | ⚑ Historical fix log |
| `assessments/fix-log-paper-v4.md` | 673 | `75d58ef` | ⚑ Historical fix log |
| `assessments/fix-log-references.md` | 513 | `948e4d7` | Reference update log |
| `assessments/fix-log-remaining.md` | 819 | `605d54d` | ⚑ Historical fix log |
| `assessments/integration-final.md` | 791 | `2d091cc` | Integration finalization summary |
| `assessments/integration-langchain.md` | 543 | `2ab11bb` | LangChain integration assessment |
| `assessments/integration-mcp.md` | 557 | `6d20b49` | MCP server integration assessment |
| `assessments/integration-security-fixes.md` | 803 | `7695437` | Security fixes for integrations |
| `assessments/integration-vercel.md` | 639 | `ba9ef7d` | Vercel AI SDK assessment |
| `assessments/integrations-entry-update.md` | 936 | `0dd9616` | Integrations updated for ENTRY |
| `assessments/integrations-security-legal-audit.md` | 2,872 | `d477349` | Security & legal audit across integrations |
| `assessments/npm-publish-prep.md` | 609 | `4481cd4` | npm publish prep |
| `assessments/openclaw-skill.md` | 438 | `29669f2` | OpenClaw skill assessment |
| `assessments/security-audit.md` | 4,621 | `a473b3f` | Blind adversarial security audit |
| `assessments/security-fixes.md` | 361 | `9915194` | Security fixes applied |
| `assessments/sprint6-security-legal-review.md` | 2,592 | `3fbc598` | Sprint 6 security & legal review |
| `assessments/whats-next.md` | 4,465 | `86884e9` | Full project state — what's next |
| `assessments/discord-retro-feb19-20.md` | ~3,400 | — | Retrospective: Feb 19-20 all-nighter (zero to library) |
| `assessments/discord-retro-feb22.md` | ~3,600 | — | Retrospective: Feb 22 marathon (5 sites, paper v4, consistency) |
| `assessments/discord-retro-feb23.md` | ~3,200 | — | Retrospective: Feb 23 ship day (5 npm, 6 repos, domain) |
| `assessments/discord-retro-feb24.md` | ~3,400 | — | Retrospective: Feb 24 polish day (paper v5, persona reviews) |
| `assessments/discord-retrospective.md` | ~2,000 | — | Overview retrospective across all sessions |
| `assessments/orchestration-patterns.md` | — | — | ⚑ Moved to root `MACROS.md` |

**Subtotal:** ~42,744 tokens

---

## Group 8 — cellar-door-entry Source (~36K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `cellar-door-entry/ENTRY_SPEC_v1.0.md` | 9,976 | `9060b05` | Entry protocol specification v1.0 |
| `cellar-door-entry/README.md` | 1,965 | `5ea2d16` | Package README |
| `cellar-door-entry/package.json` | 305 | `d47c91a` | npm package manifest |
| `cellar-door-entry/package-lock.json` | 17,010 | `2665eae` | Lockfile (low-value) |
| `cellar-door-entry/tsconfig.json` | 77 | `76810f8` | TypeScript config |
| `cellar-door-entry/.gitignore` | 5 | `b947077` | Git ignore |
| `cellar-door-entry/src/index.ts` | 458 | `e8f889b` | Package entry point |
| `cellar-door-entry/src/types.ts` | 683 | `0719fff` | Type definitions |
| `cellar-door-entry/src/arrival.ts` | 603 | `9068afe` | Arrival marker creation |
| `cellar-door-entry/src/admission-policy.ts` | 1,092 | `7245837` | Admission policy engine |
| `cellar-door-entry/src/capability-scope.ts` | 524 | `6be6c32` | Capability scoping |
| `cellar-door-entry/src/claim-tracking.ts` | 836 | `3143efb` | Claim tracking |
| `cellar-door-entry/src/continuity.ts` | 530 | `16fc27e` | Continuity handling |
| `cellar-door-entry/src/convenience.ts` | 309 | `e1b3ec9` | Convenience helpers |
| `cellar-door-entry/src/probation.ts` | 448 | `2e9c85e` | Probation period logic |
| `cellar-door-entry/src/revocation.ts` | 1,057 | `a8575f7` | Revocation handling |
| `cellar-door-entry/src/sign.ts` | 560 | `e296954` | Signing utilities |
| `cellar-door-entry/src/transfer.ts` | 476 | `3f3e09c` | Transfer logic |
| `cellar-door-entry/src/validation.ts` | 926 | `495a0ce` | Input validation |
| `cellar-door-entry/src/verify-departure.ts` | 226 | `3aad1ef` | Departure verification |
| `cellar-door-entry/src/__tests__/entry.test.ts` | 8,655 | `037f73e` | Test suite (77+ tests) |

**Subtotal:** ~36,721 tokens (minus lockfile: ~19,711)

---

## Group 9 — cellar-door-exit Source (~32K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `cellar-door-exit/src/index.ts` | 1,304 | `2de8800` | Package entry point |
| `cellar-door-exit/src/types.ts` | 5,678 | `540c3da` | Core type definitions |
| `cellar-door-exit/src/marker.ts` | 1,350 | `912945f` | Exit marker creation |
| `cellar-door-exit/src/ceremony.ts` | 1,800 | `d7bdd6b` | Exit ceremony orchestration |
| `cellar-door-exit/src/crypto.ts` | 1,196 | `2f774f5` | Cryptographic primitives |
| `cellar-door-exit/src/chain.ts` | 890 | `6335c2d` | Chain verification |
| `cellar-door-exit/src/anchor.ts` | 901 | `d08fdbd` | Anchoring logic |
| `cellar-door-exit/src/batch.ts` | 1,818 | `452cd68` | Batch operations |
| `cellar-door-exit/src/cli.ts` | 7,048 | `0894157` | CLI interface |
| `cellar-door-exit/src/context.ts` | 892 | `5242827` | Context management |
| `cellar-door-exit/src/convenience.ts` | 847 | `7f31b5a` | Convenience helpers |
| `cellar-door-exit/src/errors.ts` | 753 | `89066a4` | Error definitions |
| `cellar-door-exit/src/ethics.ts` | 3,310 | `3e16219` | Ethics guardrails |
| `cellar-door-exit/src/full-service.ts` | 2,095 | `cdd1437` | Full-service exit flow |
| `cellar-door-exit/src/git-ledger.ts` | 1,898 | `dd54c67` | Git-based ledger |
| `cellar-door-exit/src/guardrails.ts` | 1,887 | `3ed8439` | Safety guardrails |
| `cellar-door-exit/src/interop.ts` | 1,996 | `a08e95c` | Interoperability layer |
| `cellar-door-exit/src/keri.ts` | 2,546 | `c447773` | KERI integration |
| `cellar-door-exit/src/key-compromise.ts` | 1,519 | `ecd7373` | Key compromise handling |
| `cellar-door-exit/src/pre-rotation.ts` | 860 | `2072f74` | Pre-rotation support |
| `cellar-door-exit/src/privacy.ts` | 1,428 | `a6149e8` | Privacy controls |
| `cellar-door-exit/src/proof.ts` | 913 | `f002463` | Proof generation |
| `cellar-door-exit/src/registry.ts` | 821 | `55ec6ac` | Registry management |
| `cellar-door-exit/src/resolver.ts` | 1,124 | `0068e0c` | DID resolver |
| `cellar-door-exit/src/storage.ts` | 903 | `9bd3afe` | Storage abstraction |
| `cellar-door-exit/src/tsa.ts` | 2,723 | `8105750` | Timestamping authority |
| `cellar-door-exit/src/validate.ts` | 1,312 | `7b2fb35` | Validation logic |
| `cellar-door-exit/src/vc.ts` | 714 | `bb1fcdb` | Verifiable credentials |
| `cellar-door-exit/src/dispute.ts` | 1,495 | `1824c2b` | Dispute resolution module |
| `cellar-door-exit/src/visual.ts` | 4,373 | `44b73ba` | Visual representation |
| `cellar-door-exit/src/signer.ts` | ~2,500 | — | Signer abstraction (Ed25519 + P-256, createSigner factory) |
| `cellar-door-exit/src/telemetry.ts` | ~1,600 | — | OpenTelemetry integration (spans for sign/verify/ceremony) |
| `cellar-door-exit/src/claim-store.ts` | ~2,300 | — | Claim store (MemoryClaimStore, claim factories, GDPR delete) |
| `cellar-door-exit/src/passage.ts` | ~900 | — | Passage API rename surface (v0.2.0 aliases) |

**Subtotal:** ~61,694 tokens *(split into two groups if needed)*

---

## Group 10 — cellar-door-exit Modules & Tests (~31K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `cellar-door-exit/src/modules/index.ts` | 317 | `6e71b33` | Modules barrel export |
| `cellar-door-exit/src/modules/assets.ts` | 475 | `978453c` | Asset module |
| `cellar-door-exit/src/modules/continuity.ts` | 269 | `8356449` | Continuity module |
| `cellar-door-exit/src/modules/dispute.ts` | 310 | `4459057` | Dispute module |
| `cellar-door-exit/src/modules/lineage.ts` | 833 | `5c36b64` | Lineage module |
| `cellar-door-exit/src/modules/origin-attestation.ts` | 602 | `5388e59` | Origin attestation |
| `cellar-door-exit/src/modules/reputation.ts` | 440 | `2026af4` | Reputation module |
| `cellar-door-exit/src/modules/trust.ts` | 3,066 | `799c4cf` | Trust module |
| `cellar-door-exit/src/demo/scenario1-voluntary.ts` | 1,224 | `5f98c76` | Demo: voluntary exit |
| `cellar-door-exit/src/demo/scenario2-emergency.ts` | 1,148 | `bdb30ff` | Demo: emergency exit |
| `cellar-door-exit/src/demo/scenario3-successor.ts` | 1,728 | `a7fb6df` | Demo: successor exit |
| `cellar-door-exit/src/__tests__/dispute.test.ts` | 1,443 | `1824c2b` | Dispute resolution tests (12 tests) |
| `cellar-door-exit/src/__tests__/benchmarks.test.ts` | 1,165 | `0dbbdf6` | Benchmark tests |
| `cellar-door-exit/src/__tests__/ceremony-edge-cases.test.ts` | 6,213 | `45a52de` | Ceremony edge case tests |
| `cellar-door-exit/src/__tests__/devex.test.ts` | 1,834 | `29914ac` | Developer experience tests |
| `cellar-door-exit/src/__tests__/edge-cases.test.ts` | 3,006 | `10e20a7` | Edge case tests |
| `cellar-door-exit/src/__tests__/ethics.test.ts` | 2,852 | `ee90891` | Ethics tests |
| `cellar-door-exit/src/__tests__/full-service.test.ts` | 1,384 | `2e152a2` | Full-service tests |
| `cellar-door-exit/src/__tests__/git-ledger.test.ts` | 683 | `1dd84f6` | Git ledger tests |
| `cellar-door-exit/src/__tests__/integration.test.ts` | 1,903 | `2d7e722` | Integration tests |
| `cellar-door-exit/src/__tests__/keri.test.ts` | 2,267 | `0a0f74d` | KERI tests |
| `cellar-door-exit/src/__tests__/marker.test.ts` | 2,605 | `a63cae7` | Marker tests |
| `cellar-door-exit/src/__tests__/modules.test.ts` | 2,103 | `ee45a62` | Module tests |
| `cellar-door-exit/src/__tests__/properties.test.ts` | 2,783 | `2175088` | Property tests |
| `cellar-door-exit/src/__tests__/sprint3.test.ts` | 2,088 | `9512dc0` | Sprint 3 tests |
| `cellar-door-exit/src/__tests__/trust.test.ts` | 2,967 | `f2ea2eb` | Trust tests |
| `cellar-door-exit/src/__tests__/tsa.test.ts` | 1,910 | `5b60b79` | TSA tests |
| `cellar-door-exit/src/__tests__/vc.test.ts` | 498 | `5b7de82` | VC tests |
| `cellar-door-exit/src/__tests__/visual.test.ts` | 2,021 | `9e459a4` | Visual tests |
| `cellar-door-exit/src/__tests__/signer.test.ts` | ~1,900 | — | Signer + P-256 tests (24 tests) |
| `cellar-door-exit/src/__tests__/trust-enhancers.test.ts` | ~3,100 | — | Trust enhancer conduit tests (24 tests) |
| `cellar-door-exit/src/__tests__/telemetry.test.ts` | ~2,000 | — | Telemetry/span tests (14 tests) |
| `cellar-door-exit/src/__tests__/claim-store.test.ts` | ~2,500 | — | Claim store tests (28 tests) |
| `cellar-door-exit/src/__tests__/passage.test.ts` | ~900 | — | Passage API rename tests (11 tests) |
| `cellar-door-exit/docs/NON_BLOCKING_ENFORCEMENT.md` | ~1,100 | — | App-layer enforcement guide |
| `cellar-door-exit/docs/HSM_INTEGRATION.md` | ~2,400 | — | HSM integration guide (AWS/Azure/GCP/YubiKey) |
| `cellar-door-exit/CONTRIBUTING.md` | ~300 | — | Contributing guide |
| `cellar-door-exit/CODE_OF_CONDUCT.md` | ~150 | — | Code of conduct (Contributor Covenant v2.1) |
| `cellar-door-exit/GOVERNANCE.md` | ~260 | — | Project governance |

**Subtotal:** ~61,047 tokens

---

## Group 11 — cellar-door-exit Docs & Config (~30K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `cellar-door-exit/README.md` | 1,681 | `ef5dd21` | Package README |
| `cellar-door-exit/LEGAL.md` | 4,099 | `643927e` | Legal analysis document |
| `cellar-door-exit/SECURITY.md` | 2,787 | `3091ca1` | Security policy |
| `cellar-door-exit/DECISIONS.md` | 2,498 | `772737a` | Design decisions log |
| `cellar-door-exit/CHANGELOG-v1.1-review.md` | 1,015 | `1936773` | v1.1 changelog review |
| `cellar-door-exit/LICENSE` | 2,696 | `0ddcd17` | MIT License |
| `cellar-door-exit/.gitignore` | 5 | `b947077` | Git ignore |
| `cellar-door-exit/.npmignore` | 14 | `0ee2255` | npm ignore |
| `cellar-door-exit/package.json` | 470 | `93e6632` | npm manifest |
| `cellar-door-exit/package-lock.json` | 20,346 | `1f03f7e` | Lockfile (low-value) |
| `cellar-door-exit/tsconfig.json` | 111 | `67dec30` | TypeScript config |
| `cellar-door-exit/schemas/exit-context-v1.jsonld` | 621 | `49de409` | JSON-LD schema |
| `cellar-door-exit/specs/EXIT_SPEC_v1.md` | 4,721 | `fc214a1` | ⚑ Superseded by v1.1 |
| `cellar-door-exit/specs/EXIT_SPEC_v1.1.md` | 12,572 | `94ce41a` | EXIT specification v1.1 |
| `cellar-door-exit/benchmarks/results.md` | 314 | `546eba9` | Benchmark results |
| `cellar-door-exit/analysis/howey-test-module-d.md` | 6,512 | `c2facf7` | Howey test Module D analysis |

**Subtotal:** ~56,462 tokens (minus lockfile: ~36,116)

---

## Group 12 — cellar-door-exit Papers & Pitches (~30K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `cellar-door-exit/docs/EXIT_PAPER_DRAFT.md` | 10,207 | `456edd5` | ⚑ Superseded by v3/v4 |
| `cellar-door-exit/docs/GETTING_STARTED.md` | 1,515 | `0d72bea` | Getting started guide |
| `cellar-door-exit/docs/NIST_RFI_DRAFT.md` | 4,735 | `1eb1d66` | NIST RFI draft |
| `cellar-door-exit/docs/NIST_RFI_PRAGMATIC.md` | 4,230 | `d911e9d` | NIST RFI pragmatic version |
| `cellar-door-exit/docs/PITCH_IDEALIST.md` | 3,254 | `075d8ff` | Idealist pitch deck |
| `cellar-door-exit/docs/PITCH_PRAGMATIC.md` | 2,763 | `068909c` | Pragmatic pitch deck |
| `cellar-door-exit/docs/philosophical-foundations.md` | 1,197 | `7c11d8b` | Philosophical foundations |
| `cellar-door-exit/docs/preservation-considerations.md` | 783 | `7add18b` | Preservation considerations |

**Subtotal:** ~28,684 tokens

---

## Group 13 — cellar-door-exit Analysis Docs (~32K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `cellar-door-exit/docs/analysis/cellar-door-competitive-landscape.md` | 3,932 | `36ca9c4` | Competitive landscape analysis |
| `cellar-door-exit/docs/analysis/cellar-door-gastown-notes.md` | 2,660 | `953fd88` | Gastown meeting notes |
| `cellar-door-exit/docs/analysis/cellar-door-legal-lenses.md` | 17,950 | `c8e050a` | Legal lenses analysis (large) |
| `cellar-door-exit/docs/analysis/cellar-door-legal-redteam-v2.md` | 7,637 | `f10ae95` | Legal red-team v2 |
| `cellar-door-exit/docs/analysis/cellar-door-legal-redteam.md` | 7,097 | `a0d4199` | ⚑ Superseded by v2 |
| `cellar-door-exit/docs/analysis/cellar-door-master-assessment.md` | 9,543 | `2355f8c` | Master assessment |
| `cellar-door-exit/docs/analysis/cellar-door-mechanism-design.md` | 4,927 | `083f226` | Mechanism design analysis |
| `cellar-door-exit/docs/analysis/cellar-door-professional-reviews.md` | 11,028 | `ddce33d` | Professional reviews compilation |
| `cellar-door-exit/docs/analysis/cellar-door-project-plan.md` | 3,280 | `86f2e0f` | Project plan |
| `cellar-door-exit/docs/analysis/cellar-door-risk-heatmap.md` | 8,790 | `b2888bf` | Risk heatmap |
| `cellar-door-exit/docs/analysis/risk-scale-mapping.md` | 815 | `c9085f4` | Risk scale mapping |

**Subtotal:** ~77,659 tokens *(large — legal-lenses alone is 18K)*

---

## Group 14 — Cellar-Door Project-Level Docs & Papers (~30K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `projects/Cellar-Door/docs/papers/EXIT_PAPER_v3.md` | 11,664 | `38582cd` | EXIT paper v3 |
| `projects/Cellar-Door/docs/papers/EXIT_PAPER_v4.md` | 11,684 | `83c4c42` | ⚑ Superseded by v5 |
| `projects/Cellar-Door/docs/papers/EXIT_PAPER_v5.md` | 15,209 | `1824c2b` | EXIT paper v5 (current) |
| `projects/Cellar-Door/docs/papers/NIST_RFI_v2.md` | 4,778 | — | NIST RFI response v2 |
| `projects/Cellar-Door/docs/brand-guide.md` | 692 | `2043a4d` | Brand guide |
| `projects/Cellar-Door/docs/ecosystem-map.md` | 4,383 | `4562746` | Ecosystem map |
| `projects/Cellar-Door/docs/slogans-v2.md` | 1,421 | `22eced7` | Slogans v2 |
| `projects/Cellar-Door/docs/style-guide.md` | 413 | `a3cfac2` | Style guide |
| `projects/Cellar-Door/docs/analysis/cellar-door-benchmarks.md` | 324 | `3e115ef` | Benchmark analysis |
| `projects/Cellar-Door/docs/analysis/cellar-door-business-plan.md` | 9,356 | `298c940` | Business plan |
| `projects/Cellar-Door/docs/analysis/cellar-door-integration-analysis.md` | 4,899 | `feb38b3` | Integration analysis |
| `projects/Cellar-Door/docs/analysis/cellar-door-legal-battery.md` | 11,023 | `999550` | Legal battery of tests |
| `projects/Cellar-Door/docs/analysis/cellar-door-paper-readiness.md` | 3,479 | `c3c2142` | Paper readiness check |
| `projects/Cellar-Door/docs/analysis/cellar-door-pre-export-checklist.md` | 3,234 | `002bfeb` | Pre-export checklist |
| `projects/Cellar-Door/docs/analysis/cellar-door-slogan-workshop.md` | 3,628 | `6843846` | Slogan workshop |

**Subtotal:** ~81,409 tokens *(could split)*

---

## Group 15 — Integrations (~32K tokens)

All paths under `projects/Cellar-Door/integrations/`.

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| **LangChain** | | | |
| `langchain/README.md` | 757 | `d10b279` | LangChain integration README |
| `langchain/LICENSE` | 2,696 | `0ddcd17` | MIT License |
| `langchain/package.json` | 394 | `9459a5c` | npm manifest |
| `langchain/package-lock.json` | 25,529 | `55936a1` | Lockfile (low-value) |
| `langchain/tsconfig.json` | 89 | `931f3ac` | TS config |
| `langchain/vitest.config.ts` | 28 | `e2ec332` | Vitest config |
| `langchain/src/index.ts` | 93 | `aaab6fc` | Entry point |
| `langchain/src/admission-tool.ts` | 326 | `769ff9b` | Admission tool |
| `langchain/src/entry-tool.ts` | 293 | `abf7441` | Entry tool |
| `langchain/src/exit-callback.ts` | 996 | `63993bc` | Exit callback handler |
| `langchain/src/exit-tool.ts` | 504 | `52b9ebb` | Exit tool |
| `langchain/src/transfer-tool.ts` | 372 | `2258123` | Transfer tool |
| `langchain/src/__tests__/entry-tools.test.ts` | 723 | `87e5952` | Entry tools tests |
| `langchain/src/__tests__/exit-callback.test.ts` | 354 | `bbd6933` | Exit callback tests |
| `langchain/src/__tests__/exit-tool.test.ts` | 358 | `abcf8a3` | Exit tool tests |
| **MCP Server** | | | |
| `mcp-server/README.md` | 678 | `8122d5b` | MCP server README |
| `mcp-server/package.json` | 263 | `926e629` | npm manifest |
| `mcp-server/package-lock.json` | 23,796 | `6ca4054` | Lockfile (low-value) |
| `mcp-server/tsconfig.json` | 83 | `d569036` | TS config |
| `mcp-server/src/index.ts` | 180 | `fdc4699` | Entry point |
| `mcp-server/src/server.ts` | 3,090 | `6c0d136` | MCP server implementation |
| `mcp-server/src/__tests__/server.test.ts` | 102 | `a9e7e9c` | Server tests (src) |
| `mcp-server/tests/server.test.ts` | 1,333 | `3c191b6` | Server tests (root) |
| **Vercel AI SDK** | | | |
| `vercel-ai-sdk/README.md` | 1,009 | `07da57d` | Vercel AI SDK README |
| `vercel-ai-sdk/LICENSE` | 2,696 | `0ddcd17` | MIT License |
| `vercel-ai-sdk/package.json` | 381 | `dd0637d` | npm manifest |
| `vercel-ai-sdk/package-lock.json` | 22,709 | `ee3f673` | Lockfile (low-value) |
| `vercel-ai-sdk/tsconfig.json` | 89 | `931f3ac` | TS config |
| `vercel-ai-sdk/src/index.ts` | 129 | `e1e888c` | Entry point |
| `vercel-ai-sdk/src/entry-tools.ts` | 1,103 | `1a78277` | Entry tools |
| `vercel-ai-sdk/src/exit-middleware.ts` | 1,168 | `a0223de` | Exit middleware |
| `vercel-ai-sdk/src/exit-tool.ts` | 470 | `0e4467e` | Exit tool |
| `vercel-ai-sdk/src/__tests__/entry-tools.test.ts` | 764 | `37882cf` | Entry tools tests |
| `vercel-ai-sdk/src/__tests__/exit-middleware.test.ts` | 519 | `913d855` | Exit middleware tests |
| `vercel-ai-sdk/src/__tests__/exit-tool.test.ts` | 434 | `b932f73` | Exit tool tests |
| **OpenClaw Skill** | | | |
| `openclaw-skill/SKILL.md` | 491 | `1bc1fb6` | Skill definition |
| `openclaw-skill/package.json` | 125 | `05c6e3f` | npm manifest |
| `openclaw-skill/package-lock.json` | 815 | `6f36778` | Lockfile |
| `openclaw-skill/references/api-guide.md` | 483 | `1154de3` | API guide |
| `openclaw-skill/scripts/entry.sh` | 405 | `f9d0423` | Entry script |
| `openclaw-skill/scripts/exit.sh` | 149 | `fcd1831` | Exit script |
| `openclaw-skill/scripts/transfer.sh` | 512 | `861fa8f` | Transfer script |
| `openclaw-skill/scripts/verify.sh` | 443 | `5111414` | Verify script |

**Subtotal:** ~97,561 tokens (minus lockfiles ~72K: ~25,527 meaningful)

---

## Group 16 — Other Projects (~31K tokens)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `projects/HOLOS/holos-investment-thesis.md` | 8,708 | `8d0d081` | ⚑ Superseded by v2/v3 |
| `projects/HOLOS/holos-investment-thesis-v2.md` | 8,681 | `0734b63` | Investment thesis v2 |
| `projects/HOLOS/holos-investment-thesis-v3.md` | 9,603 | `3e46932` | Investment thesis v3 (current) |
| `projects/HOLOS/holos-portfolio-strategy.md` | 9,022 | `3d7b8df` | Portfolio strategy |
| `projects/LAND/LAND-analysis.md` | 4,418 | `7406b12` | ⚑ Superseded by v2 |
| `projects/LAND/LAND-analysis-v2.md` | 8,382 | `5f1ad9b` | LAND analysis v2 (current) |
| `projects/Lumen/lumen-solar-optical-analysis.md` | 3,757 | `edc7b1c` | ⚑ Superseded by v2 |
| `projects/Lumen/lumen-solar-optical-analysis-v2.md` | 5,898 | `f6f5a33` | Lumen solar/optical v2 (current) |
| `projects/Hot-Chip/hot-chip-analysis.md` | 2,339 | `d4a8aac` | Hot Chip business analysis |
| `projects/Fool-Hardy/fool-hardy-analysis.md` | 4,889 | `ee3afc3` | Fool-Hardy analysis |
| `projects/cellar-door-exit/analysis/gdpr-erasure-encryption.md` | 8,152 | `a8b2dbf` | ⚑ Orphan path — GDPR erasure analysis |

**Subtotal:** ~73,849 tokens

---

## Group 17 — Website / Site (~34K tokens text + images)

| File | Tokens | Git Hash | Description |
|------|-------:|----------|-------------|
| `site/index.html` | 42 | `91d49a2` | Root redirect page |
| `site/_redirects` | 5 | `e87a5c8` | Netlify redirects |
| `site/cellar-door/index.html` | 17,254 | — | Cellar Door unified 5-mode site (poet/idealist/pragmatist/bureaucrat/agent) |
| `site/demo/index.html` | 5,083 | `c501102` | Interactive demo page |
| `site/entry/v1/index.html` | 85 | `5a9993e` | Entry v1 redirect |
| `site/exit/v1/index.html` | 62 | `d679cc6` | Exit v1 redirect |
| `site/holos-thesis/index.html` | 15,157 | `8f9fce9` | HOLOS thesis page |
| `site/idealist/index.html` | 4,069 | `2a75645` | Idealist pitch page |
| `site/paper/index.html` | 14,580 | `215d355` | Paper page |
| `site/policy/index.html` | 5,474 | `f5b29aa` | Policy page |
| `site/pragmatic/index.html` | 4,549 | `9f69da3` | Pragmatic pitch page |
| ~~`cellar-door-exit/websites/`~~ | — | — | **REMOVED 2026-02-26** — 3 deprecated site variants (pragmatic/idealist/policy) consolidated into mono-site at `cellar-door.dev`; removed from public `CellarDoorExits/exit-door` repo; preserved in git history |

**Subtotal:** ~79,442 tokens

---

## Binary / Image Files (excluded from context groupings)

| File | Tokens | Description |
|------|-------:|-------------|
| `folder.ico` | 38,964 | Windows folder icon |
| `icon_output/drive/.VolumeIcon.ico` | 27,421 | Drive volume icon |
| `icon_output/drive/autorun.inf` | 7 | Autorun config |
| `icon_output/folder/desktop.ini` | 21 | Desktop config |
| `icon_output/folder/folder.ico` | 38,964 | Folder icon (dup) |
| `icon_output/mac/icon_*.png` (10 files) | ~606,541 | macOS icon set (16px–1024px) |
| `images/Hawthorn*.jpg` (6 files) | ~1,018,179 | Hawthorn brand images |
| `images/sources/*.jpeg` (19 files) | ~7,386,295 | Source/generated images |
| `site/cellar-door/images/*` (6 files) | ~1,551,842 | Cellar Door site images |

**Binary total:** ~10,668,234 tokens (not loadable as text)

---

## Summary by Group

| Group | Focus | ~Tokens |
|-------|-------|--------:|
| 1 | Root Config & Identity | 25K |
| 2 | Memory & Research Notes | 38K |
| 3 | Docs & Writings | 92K |
| 4 | Assessments A (large) | 30K |
| 5 | Assessments B (groups/howey) | 30K |
| 6 | Assessments C (multi-lens/NIST) | 50K |
| 7 | Assessments D (small/historical) | 27K |
| 8 | cellar-door-entry source | 37K |
| 9 | cellar-door-exit source | 54K |
| 10 | cellar-door-exit modules & tests | 46K |
| 11 | cellar-door-exit docs & config | 56K |
| 12 | cellar-door-exit papers & pitches | 29K |
| 13 | cellar-door-exit analysis docs | 78K |
| 14 | CD project-level docs & papers | 81K |
| 15 | Integrations (4 packages) | 98K |
| 16 | Other Projects (HOLOS/LAND/Lumen/etc) | 74K |
| 17 | Website / Site | 79K |
| — | Binary/Images | ~10.7M |

**Total text tokens:** ~926K | **Total with binaries:** ~11.6M

---

**Test totals:** 291 (exit) + 77 (entry) = **368 tests**

*Auto-generated 2026-02-24T09:11Z. Next reindex recommended after significant file additions.*
