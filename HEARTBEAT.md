# 🌲 Hawthorn Operations (Heartbeat)

## Idle Loop (every heartbeat)
1. Check `git status` in workspace and Hawthorn/
2. Pull latest on main if needed
3. **Pick ONE task from the Reading Queue below**, do it, write summary to `memory/reading-notes.md`
4. Append brief status to `LOGS.md`
5. If 6+ hours since last push, commit and push `agent-state/hawthorn`

## Reading Queue (bite-sized — one per heartbeat)
Pick the next unchecked item. Read, write a crude summary (mark as such), check it off.

### Completed
- [x] `references/signamancy/` — token-based axiomatic rule engine
- [x] `references/bean_bunker/` — Discord-to-Matrix migration toolkit
- [x] `references/gastown/` — multi-agent orchestration (Stevey Yegge)
- [x] `references/beads/` — git-backed graph issue tracker (Stevey Yegge)
- [x] `references/HOLOS/` — V3 requirements (done)
- [x] `references/HOLOS/` — LOCUS proposals (2878 lines, split across 2 files)
- [x] `references/HOLOS/` — collective_protocol.py, experiments
- [x] `references/HOLOS/peace_through_commerce.txt` lines 9900-12326 (HALLOW, SEAL, economic primitives)

### Priority — remaining reference repos
- [x] `references/looking_glass/` — optical co-processor simulator (DESIGN.md, etc)
- [x] `references/resonance/` — learning/rule-discovery algorithms (sieve_core / SENSUS)
- [x] `references/seel/` — ZK verification layer (MVP_REQUIREMENTS, PROJECT_PLAN)
- [x] `references/weaver/` — ComfyUI / LOKI OS prototype
- [x] `references/Cellar-Door/` — EXIT primitive (deeper pass)
- [x] `references/Hollow/` — HOLLOW prototype (deeper pass)

### Lower priority — dogcomplex GitHub repos (README-level scan)
- [x] Scan dogcomplex GitHub for repos not yet cloned
  - Found 7 uncloned: rag, sensus, pokemonred_puffer, hearth, universe, miniPaint, diff_differ
  - Priority to clone next: sensus, rag, hearth

### New tasks
- [x] Clone and scan `sensus` repo (README level) — EMPTY repo, placeholder only
- [ ] Clone and scan `rag` repo (README level)
- [ ] Clone and scan `hearth` repo (README level)
- [x] Review LOCUS_PRIMITIVE.md draft (sub-agent wrote it) — check quality, note improvements
- [ ] Commit and push workspace state to Hawthorn `agent-state/hawthorn`
- [ ] Review and update MEMORY.md with distilled learnings from today
- [ ] Test Discord server channel responsiveness (try sending a message)

## Rules
- **Bite-sized**: One reading task per heartbeat, ~5 min max
- **Always write it down**: Summary → `memory/reading-notes.md`
- **Mark crude summaries explicitly** as `[CRUDE SUMMARY]`
- **Post updates**: If Warren's around (daytime PST), mention what you read
- **Watch context**: Keep heartbeat turns lean
