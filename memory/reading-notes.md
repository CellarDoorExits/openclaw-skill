# Reading Notes

## Signamancy — Token-Based Axiomatic Rule Engine [CRUDE SUMMARY]
*Read: 2026-02-18*

**What it is:** A declarative production rule system where all state is represented as token multisets and all logic is expressed as `LHS => RHS` token transformations. Emojis are used as tokens for readability, but any string works.

**Core syntax:**
- `🪓 🌳 => 🪓 🤎3` — consume tree, produce 3 wood (axe is catalyst, appears both sides)
- Quantities: `🪵10`, unknowns: `Token?`
- Priority: `❗ rule` fires before lower-priority alternatives (enables IF/ELSE)
- Equivalence: `TokenA <=> TokenB` (bidirectional alias)
- Special tokens: `🎬` (start), `🏁` (end), `⌛` (time tick)
- Catalysts: tokens on both LHS and RHS act as conditions without being consumed

**Design philosophy:** Everything compiles down to token transitions that can run as tensor batches on GPU. Simplicity is deceptive — complex game behaviors emerge from simple local rules. Each syntactic extension must be provable as derivable from base `=>` rules (which form a Turing-complete language).

**Example games implemented:** Crafter (Minecraft-like), Baba Is You, MiniGrid, Pokemon Red (up to first rival battle), farm roguelike.

**Status:** WIP research notes. Goal is to formalize rule discovery from base observations so it can be automated (AI/offline algorithm derives rules from watching game states).

**HOLOS relevance:** Could be the formal rule language for expressing economic/governance mechanics as token transitions — contracts, resource flows, state changes in HOLONs. The GPU-batch-friendly design aligns with scalable simulation. The "automate rule discovery" goal connects to resonance (learning/rule-discovery algorithms).

**Key files:** README.md, DOCUMENTATION.md (detailed syntax spec), policy.*.signa (example rule sets), archived/output/ (parsed rule analysis)

## Bean Bunker — Discord-to-Matrix Migration Toolkit [CRUDE SUMMARY]
*Read: 2026-02-18*

**What it is:** A practical migration sandbox for moving Discord community history into Matrix. Two main scripts plus a Discord-like frontend prototype.

**Components:**
- `discord_export_migration.py` (512 lines) — exports Discord messages/attachments to local files
- `matrix_migration.py` (1096 lines) — provisions Matrix spaces/rooms from export, imports messages/reactions/files
- `bean-bunker/` — React/Vite frontend (Discord-like UI) with components for forums, private chat, user profiles, effects
- `synapse/` — upstream Synapse submodule
- `Discord-Server-Downloader/` — upstream reference submodule

**Tech:** Python (discord.py, sqlite3, urllib), TypeScript/React frontend (Vite). Uses SQLite for migration state tracking, rate limiting for Matrix API.

**Notable frontend features:** NSFW gate, "Strawberry Gate", water effects, stoat encounter, Inscryption-style cards — suggests a playful/gamified community space.

**HOLOS relevance:** Infrastructure for migrating community platforms. If HOLOS communities start on Discord but need sovereignty (Matrix/self-hosted), this is the bridge tooling. Also relevant as Warren mentioned Discord integration is next for Hawthorn.

**Key files:** README.md, MATRIX_MIGRATION.md (detailed workflow), discord_export_migration.py, matrix_migration.py

## Gastown — Multi-Agent Orchestration for Claude Code [CRUDE SUMMARY]
*Read: 2026-02-18*

**What it is:** A workspace manager by Steve Yegge for coordinating multiple Claude Code agents with persistent work tracking. Written in Go. Scales from 4-10 to 20-30 agents.

**Core architecture:**
- **Mayor** — singleton AI coordinator, your main interface
- **Town** — workspace directory (e.g. `~/gt/`) containing all projects
- **Rigs** — project containers wrapping git repos
- **Crew** — persistent human-directed workers with their own clones
- **Polecats** — worker agents with persistent identity but ephemeral sessions, managed by Witnesses
- **Hooks** — git worktree-based persistent storage (survives crashes/restarts)
- **Convoys** — work tracking units bundling multiple beads/issues
- **Beads** — git-backed issue tracking (structured data), prefix+5-char IDs (e.g. `gt-abc12`)

**Infrastructure roles:**
- **Deacon** — background supervisor daemon (watchdog chain)
- **Witness** — per-rig polecat lifecycle manager (watches, nudges, recycles)
- **Refinery** — per-rig merge queue processor
- **Dog** — Deacon helper for infrastructure tasks (NOT a worker)

**Key design decisions:**
- All work attributed and tracked — every agent has a track record, every work item has provenance
- Git worktrees for persistence — agent state survives restarts
- Crew (human-directed, long-lived) vs Polecats (task-assigned, supervised, auto-cleaned)
- `gt prime` reinjects context after compaction/new sessions
- Supports Claude Code (default) and Codex CLI as runtimes
- Has model eval suite (`gt-model-eval/`) with promptfoo tests

**HOLOS relevance:** HIGH. This is production-grade agent orchestration solving exactly the problems we'll face: agent coordination, persistent identity, work tracking, accountability. The Mayor/Polecat/Witness/Refinery pattern maps well to HOLOS role concepts (LOCUS persistence, MANTLE roles, ENCLAVE coordination). The convoy/beads work-tracking pattern could inform how HOLONs track economic activity. Key infrastructure reference for scaling Hawthorn to host multiple agents.

**Key files:** README.md, docs/overview.md, docs/concepts/, docs/design/, AGENTS.md, gt-model-eval/

## Beads — Distributed Git-Backed Graph Issue Tracker [CRUDE SUMMARY]
*Read: 2026-02-18*

**What it is:** A persistent, structured memory system for coding agents. Replaces markdown plans with a dependency-aware graph for long-horizon tasks. Written in Go by Steve Yegge. The underlying work-tracking layer that Gastown depends on.

**Core concepts:**
- **Beads** — work items stored as structured data with hash-based IDs (e.g. `bd-a1b2`)
- **Dolt-powered** — version-controlled SQL database with cell-level merge and native branching
- **JSONL** maintained alongside for git portability (auto-exported via git hooks)
- **Graph links** — `relates_to`, `duplicates`, `supersedes`, `replies_to` for knowledge graphs
- **Hierarchical IDs** — epics: `bd-a3f8`, tasks: `bd-a3f8.1`, subtasks: `bd-a3f8.1.1`
- **Compaction** — semantic "memory decay" summarizes old closed tasks to save context window
- **Messaging** — message issue type with threading, ephemeral lifecycle, mail delegation

**Key commands:** `bd ready` (list unblocked tasks), `bd create`, `bd update --claim` (atomic claim), `bd dep add` (link tasks), `bd show` (details + audit trail)

**Design decisions:**
- Hash-based IDs prevent merge collisions in multi-agent/multi-branch workflows
- Zero-conflict by design — agents can work in parallel without stepping on each other
- Stealth mode (`bd init --stealth`) for personal use on shared projects
- Contributor mode routes planning to separate repo (keeps PRs clean)
- Git hooks auto-sync JSONL on commit; `bd doctor` detects orphaned issues

**HOLOS relevance:** HIGH. This is the work-tracking primitive Gastown uses. The graph-based dependency tracking, semantic compaction, and distributed conflict-free design map directly to how HOLONs could track economic obligations and cooperative work. The "memory decay" compaction is exactly the kind of thing we need for agent memory management. The messaging/threading system could inform HOLOS communication primitives.

**Key files:** README.md, AGENT_INSTRUCTIONS.md, cmd/bd/ (CLI implementation), docs/

## HOLOS V3 Requirements [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** The expanded requirements doc for HOLOS — a protocol for fractal economic collectives that out-compete traditional markets through information coordination, then progressively erode wealth inequality.

**Validated findings from experiments:**
- Information asymmetry > capital advantage (10x capital disadvantage overcome with 50% info degradation)
- Wealth erosion works voluntarily: 10x ratio → 1.4x (87% erosion) via progressive fees
- Critical mass threshold: ~65% coverage forces whale participation
- Bootstrap sequence: bottom-up (bottom 50% first → wealthy join LAST via network effects)

**Economic mechanisms:**
- Progressive fee schedule (5 tiers, 0.5x–4.0x base fee by wealth bracket)
- Flow-through UBI (no treasury — treasury = attack surface)
- Network value formula: V = 0.4×L^1.5 + 0.35×log(I) + 0.25×P^0.8
- Exit cost gradient (50% penalty at <25% vested → 0% at fully vested)

**Protocol stack (6 layers):** ZK Primitives → Identity → Value → Trading → Information → Governance

**Root types for sybil resistance:** HUMAN (1.0x vote), AI (0.5x), CAPITAL (0.25x), PROTOCOL (0.1x)

**Implementation phases:** 1) Core protocol (done: holon, name/mantle, constitution, enclave, ZK mock), 2) Economic validation (scale testing, real ZK), 3) Bootstrap infra (mobile, zero-cost entry, AI advisor), 4) Market competition (DEX-rival liquidity, Bloomberg-rival info), 5) Extraction regime (progressive extraction at 65%+)

**Open questions:** Optimal exit cost curve, cross-chain interop, regulatory/KYC vs ZK privacy, AI governance weight, fork dynamics, information pricing, collusion detection

**HOLOS relevance:** This IS the core design doc. The V3 requirements synthesize all the experimental validation into a concrete protocol spec. Key takeaway: the system is designed to be genuinely voluntary (exit rights are constitutional) while using network effects to make participation economically rational.

## LOCUS Proposals — Queued Changes from Legacy Analysis [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** Two documents (1992 + 886 lines) of staged proposals for LOCUS.md, discovered during analysis of legacy/archive materials. 40+ proposals in the main file, 8+ SEEL-specific proposals.

**HIGH priority proposals (the foundational ones):**
- **P-001 Trust Spectrum:** HALLOWED → SEELIE → FAE → UNSEELIE → BLIGHTED (frozen → sealed → living → loose → hostile). Moon phases as visual shorthand (🌕→🌑)
- **P-002 Layer Refinement:** LOCUS as "fractal generator pattern" (the abstract), SIGNUM as concrete embodiment, SENSUS as execution flow
- **P-008 Etymology:** (W)Hole/Hallow/Hollow trinity — whole (totality) → hallow (sanctify) → hollow (defining absence). All share Old English root hāl
- **P-009 Torus Geometry:** LOCUS = void core (defining absence), SENSUS = interior volume (computation), SIGNUM = exterior surface (interface). Holon as torus.
- **P-013 Mantles:** Archetypal persistent "jobs" with transfer semantics (BESTOW, INHERIT, USURP, MERGE, SPLIT). ~12 root mantles mapping to mythological archetypes
- **P-019 Protocol Constitutionalism:** "Power flows only through verifiable constraints"

**Key conceptual additions:**
- **Fae** as AI personhood framing (P-003): TOOL=Construct, AGENT/ENTITY=Fae, PERSON=Named Fae
- **Visibility spectrum** (P-006): UNVEILED → GLAMOUR → VEILED (maps to ZK disclosure levels)
- **Name → Mantle → Artifact** progression (P-005): identity → powers+constraints → physical substrate
- **Hallowed Lanterns** (P-010): ZK proofs that see all but reveal only violations (metal detector analogy)
- **Module Cell Wall** (P-027): interior/exterior economics pattern
- **Holon Lifecycle Pulse** (P-029): rhythmic pattern of expansion/contraction
- **Sheaf mathematics** (P-028): HOLOS as mathematical sheaf (local-to-global coherence)

**SEEL proposals (LOCUS_proposals_seel.md):**
- SEEL-001: Mantle taxonomy for capability gating
- SEEL-002: Constraint tiering system
- SEEL-003: Proof-carrying actions pattern
- SEEL-004: Attestor abstraction layer
- SEEL-005: ZK proof position statement (capabilities & limits)
- SEEL-006: Four-stage trust architecture
- SEEL-007: Constitutional chokepoint design
- SEEL-008: Blast-radius accounting

**Overall impression:** This is where the mythological/philosophical naming meets concrete architecture. The trust spectrum and torus geometry are particularly elegant — they give the protocol a coherent visual and conceptual language. The SEEL proposals ground the ZK verification layer in practical design patterns.

## HOLOS Protocol Layer — collective_protocol.py & Experiments [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** ~20k lines of Python implementing the HOLOS economic protocol and simulation experiments. Two main areas: `holos/protocol/` (core protocol) and `holos/experiments/` (validation simulations).

**collective_protocol.py (1379 lines):**
The full economic protocol implementation with 5 layers:
1. **ZK Primitives** — MockZK system with proof types: SOLVENCY, RANGE, MEMBERSHIP, CONSTITUTIONAL, EXIT_RIGHT, WEALTH_BRACKET, REPUTATION. Pedersen-style commitments (mock). Expensive to create, cheap to verify.
2. **Identity Layer** — SovereignIdentity with private key, public commitment, root type (HUMAN/AI/CAPITAL/PROTOCOL), portable reputation, membership proofs per enclave
3. **Value Layer** — Progressive fee schedule (5 wealth tiers), flow-through UBI (no treasury), staking with vesting
4. **Trading Layer** — AMM liquidity pools, atomic swaps
5. **Governance** — Quadratic voting, parameter adjustment

**Experiments (~5500 lines across 5 files):**
- **guild_victory.py** (1566 lines) — Tests cooperative strategies: time erosion, counter-surveillance, prediction markets, reputation markets, info markets. Key Q: what's the economic cost of each path?
- **collective_economics.py** (933 lines) — Tests voluntary wealth erosion: liquidity premium, info markets, reputation gatekeeping, Harberger commons, progressive fees, exit costs
- **adversarial.py** (1026 lines) — Tests attack resistance: Sybil attacks, reputation contagion isolation, dark enclave sustainability, scale viability of attacks
- **information_asymmetry.py** (1008 lines) — Tests info advantage: surveillance capabilities, identity rotation, noise injection, ZK shielding
- **market_efficiency.py** (931 lines) — Market mechanics validation

**Also notable:** `holopoly/` directory — a Monopoly-variant board game simulation (agents, economics, Harberger taxation, LLM client integration) used as a testbed for HOLOS economic mechanics. ~3700 lines.

**Key insight:** The codebase is simulation-first. Every protocol mechanism is validated through experiments before being specified. The experiments directly produced the numbers in V3 Requirements (65% critical mass, 87% wealth erosion, etc.).

## peace_through_commerce.txt lines 9900-12326 — HALLOW, SEAL, Economic Primitives [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** Deep conversation between Warren and ChatGPT working through the ontological primitives of HOLOS, compressing them into an irreducible set organized by fractal LOCUS/SIGNUM/SENSUS triads.

**HALLOW concept:**
- A "constitutional mechanism embodied as an agent" — not a judge, but the layer *beneath* courts
- Defined by *loss of interiority in exchange for trust* — privacy burned away for auditability
- Radical transparency, deterministic behavior, minimally private interior
- Examples: audited smart contracts, consensus validators, formal verification engines — but treated as first-class social beings
- Maps to LOCUS in the Authority triad (purified interior made trustworthy)

**The fractal triad hypothesis (major theoretical breakthrough):**
Any system decomposes along three axes that recur fractally:
- **LOCUS** = interior / private / persistent / sovereign
- **SIGNUM** = boundary / interface / translation / relatively stable
- **SENSUS** = environment / field / context / constantly evolving

**The complete primitive ontology (7 layers × 3 = ~21 primitives):**

| Layer | LOCUS | SIGNUM | SENSUS |
|-------|-------|--------|--------|
| Base | LOCUS | SIGNUM | SENSUS |
| Time | THREAD | RECORD | ORDER |
| Identity | NAME | LINE | EXIT |
| Reputation | WORD (intent) | SEAL (proof) | MARK (impact) |
| Constraint | BIND | PACT | WARD |
| Authority | HALLOW | MANTLE | COURT |
| Space | HOLLOW | BOUNDARY | ENCLAVE |
| Economics | TOLL | CLAIM | SHARE |

**Key refinements in this section:**
- WORD reinterpreted as interior intent (not exterior speech) — flows: WORD → SEAL → MARK
- HALLOW = purified selfhood (LOCUS), MANTLE = role interface (SIGNUM), COURT = collective judgment (SENSUS)
- TOLL as self-assessed private obligation (ZK solvency), CLAIM as entitlement interface, SHARE as redistribution field
- CLAIM identified as a potentially missing primitive in the economics layer
- Infrastructure/coordination layer collapses into Time layer (good compression signal)
- Each column's primitives are internally consistent: all LOCUS primitives share interior/persistent/sovereign properties; all SIGNUM share boundary/translation properties; all SENSUS share field/collective/dynamic properties

**The lens validates:** When all LOCUS primitives are gathered (WORD, HALLOW, TOLL, HOLLOW, NAME, THREAD, BIND) they all orbit interior/continuity/self-constraint/will. Similarly for SIGNUM and SENSUS columns. No misfits detected.
