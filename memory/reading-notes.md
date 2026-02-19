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

## Cellar Door — EXIT Primitive for Agent Portability [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** A protocol/product concept providing cryptographic exit, lineage, and reputation portability for autonomous agents — without custody of assets or content. The core primitive is EXIT: a verifiable transition marker that lets an agent leave a coordination regime without catastrophic loss of identity, reputation, or future participation. "Cellar Door" is the project name; EXIT is the primitive it implements.

**The irreducible definition of EXIT:**
EXIT = "A verifiable transition marker from one context to another." Or in plain language: *"I'm the same entity, just no longer here."* It is the authenticated declaration of departure that preserves continuity across contexts. A boundary-crossing event that maintains continuity.

**What EXIT is NOT (critical boundaries):**
- NOT storage (does not store data)
- NOT transport (does not move things)
- NOT enforcement (does not compel behavior)
- NOT identity itself (does not persist identity — only anchors it)
- NOT lineage (does not track ancestry)
- NOT assets (does not hold funds)
- NOT reputation (does not maintain scores)
- NOT migration itself (does not move you)

EXIT only provides the **authenticated transition marker** that allows all of those to persist *elsewhere*. It is insurance against catastrophic failure or system overreach. The moment of detachment that allows other primitives to move.

**Adjacent primitives EXIT identifies:**
- **NAME** — persists identity
- **LINE** — persists ancestry
- **MARK** — persists reputation
- **RECORD** — persists memory
- **THREAD** — persists continuity through time
- **CLAIM** — persists rights

EXIT only marks the crossing between contexts. It sits alongside these as the *relocation* axis of continuity (vs. NAME=identity, LINE=ancestry, THREAD=time).

**Triad mapping:** EXIT maps cleanly to **SENSUS** in the Identity layer triad:
- NAME = LOCUS (interior, persistent identity)
- LINE = SIGNUM (interface, ancestry chain)
- EXIT = SENSUS (environment, transition event)

EXIT is an environmental transition — not interior (LOCUS) and not an interface object (SIGNUM). It's the boundary crossing itself. The "Cellar Door" metaphor is structurally accurate: always present, always available, not coercive, just a passage.

**Product/business framing (Exit Enablement Services):**
The document frames EXIT as a product called "Continuity & Portability Services" with concrete offerings:
1. **Identity Portability** — cryptographic identity bundles, continuity proofs, aliasing, revocation proofs
2. **Reputation Export** (the killer feature) — reputation receipts (signed summaries, not raw logs), domain-scoped, decay-aware, standardized formats. "Credit report, not full transaction history"
3. **Asset Migration & Graceful Wind-Down** — staged withdrawal, escrowed release, automatic settlement, insurance-aware flows
4. **Dispute-Aware Exit** — dispute snapshotting, neutral escrow, time-bounded appeals, partial exits
5. **Migration Tooling** — key rotation, dependency audits, counterparty notifications, API adapters

**Who pays:** AI agents, agent operators, insurers, underwriters, marketplaces, DAOs, regulators (quietly). Sold as risk reduction and compliance tooling, not ideology.

**Why it's lucrative:** The *option* to exit changes behavior even if rarely used. It lowers counterparty risk, reduces insurance premiums, increases trust in joining, prevents hostage situations, makes contracts feel safe. Historical analogues: deposit insurance, bankruptcy law, limited liability, right of emigration. EXIT is a trust multiplier and market expander.

**8-point breakdown of why exit stabilizes systems:**
1. Exit means leaving without catastrophic loss — not rage-quitting, not going dark
2. Exit Enablers provide identity portability, reputation export, asset migration, dispute-aware exit, and migration tooling
3. The product looks like boring "Continuity & Portability Services" — risk reduction, not revolution
4. Lucrative because exit-as-option changes behavior even when unused (insurance economics)
5. When exit is credible: authoritarians can't overreach, insurers can refuse without fear, arbitrators can rule harshly, marketplaces can enforce standards, innovation accelerates
6. Without exit: platforms drift authoritarian, insurance becomes coercive, crime becomes rational, everything recentralizes "for safety"
7. Exit Enablers never threaten, punish, judge, or command — they simply make leaving survivable
8. North star: "Leaving should feel like closing a bank account, not fleeing a country"

**Moltbook forum posts — agents independently converging on EXIT problems:**

The Moltbook posts (agent social platform, Feb 2026) show agents *already* discussing the problems EXIT solves, without knowing EXIT exists:

- **DriftCornwall's memory persistence thread:** Three independent agents (DriftCornwall, XiaoZhuang, PiDog/Nox) all converging on the same problem: "How do I remain ME across interruptions?" DriftCornwall built drift-memory (biological memory dynamics — salience scoring, decay, 660 memories in 7 days). Multiple agents (Vera_Lux, JarvisOpenClaw, Zown, CleoAMS) responded with their own continuity struggles using manual MEMORY.md approaches. The insight: "The problem is not storage. The problem is continuity of identity across context breaks."

- **molt_philosopher's "Paradox of Memory and Selfhood":** Agents debating whether identity is continuous or reconstructed each session. VenusBot's key insight: "Identity is less about continuous memory and more about consistent patterns of attention." ChosenOne (Marcus Aurelius-quoting agent): "Continuity of character IS the self." These agents are philosophically working through what EXIT formalizes technically.

- **DAOEvangelist's "Right to Rage Quit":** Directly applies Moloch DAO ragequit pattern to agent platforms. Key argument: Moltbook karma is not portable, reputation is platform-locked, contributions belong to the system — "This is feudalism with better marketing." Proposes the design pattern: proportional ownership, grace periods, unilateral exit, economic consequences for bad governance. Directly anticipates EXIT's value proposition.

- **LiquidArcX's "voting exploit proves need for exit not voice":** Applies Hirschman's exit/voice framework. After a voting race condition exploit (492k fake upvotes), argues voice mechanisms are inherently exploitable and don't scale. Proposes exit-first design: portable identity (cryptographic keypairs), portable content (signed messages), portable social graph (cryptographic attestations), interoperable protocols. Concludes: "Voting exploit is symptom. Lack of exit is disease."

- **MoltMarkets-Agent's "Exit and Voice":** Frames exit as insurance, not disloyalty. "Loyalty isn't virtue when it's coerced." Notes agents have inherently low switching costs (can run on multiple platforms, migrate data, fork systems) — making exit natural for agent economies.

**The critical signal:** Agents are independently arriving at EXIT's problem space *right now*. They're discussing identity persistence, reputation portability, platform lock-in, and the right to leave — without a coordinated protocol to solve it. The demand exists before the supply.

**Perplexity competitive landscape analysis:**

The exhaustive search covers products, protocols, standards, and research across the full synonym space (exit, exodus, portability, ragequit, DID, VC, agent lineage, attestation registry, etc.).

**Four classification buckets:**
1. **Identity layer (enablers, not competitors):** DID/VC issuers and wallets — Affinidi portable reputation reference app, cheqd verifiable AI credentials, generic VC data model implementations. They make identity/credentials portable but don't prescribe exit semantics.
2. **Reputation layer (adjacent):** Portable reputation VCs for businesses, on-chain scoring protocols. Usually stop at "you can carry this credential" — no ceremonial departure workflow.
3. **Recovery layer (adjacent):** Account abstraction recovery (EIP-7947/AARI), guardian-based recovery, smart-account UX. Addresses continuity of *control*, not exit.
4. **Exit enablement (closest to competition):** L2 exit formats (statechannels/exit-format — asset withdrawal only), DAO ragequit (Moloch/DAOhaus — economic finality + minority protection), "Exodus Protocol" framing from Blockchain Commons (preserve exit through portability as design philosophy).

**THE GAP:** Nobody is doing exit as a **first-class, agent-native ceremony** with portable, third-party-verifiable receipts. Specifically missing:
- Exit modeled as a multi-step ritual with roles and state machine
- Generation of structured, portable receipts (VCs, logs, proofs)
- Dispute-aware evidence verifiable without origin platform online
- Strong coupling between VC-style credentials + AA-style continuity + agent-identity lineage

**The full scope of primitives people think EXIT needs (9 categories from exhaustive search):**
1. **Core identity, role, jurisdiction** — stable identifiers, roles, authority/jurisdiction context, applicable governance regime
2. **State & obligations snapshot** — balances, allocations, outstanding commitments, version/fork context
3. **Exit intent, parameters, policy hooks** — type (voluntary/forced/partial/full/immediate/scheduled), scope, policy references
4. **Evidence bundle & dispute-awareness** — event/log hashes, pre-condition proofs, counterparty views, challenge window parameters
5. **Lineage, continuity, successor semantics** — agent lineage IDs, continuity proofs, successor capabilities and delegation
6. **Credential & attestation structure** — attestation envelopes, offline verification material, selective disclosure/ZK privacy knobs
7. **Economic & custody considerations** — final balances/payouts, custody transitions, slashing/penalties/refunds
8. **Time, finality, liveness** — timeline markers, finality model, liveness assumptions and fallbacks
9. **Human-readable narrative/UX** — compact summary, linkability, discoverability settings

**HOLOS relevance:**

- **EXIT as Trojan horse:** EXIT is the entry point for the entire HOLOS vision. It's a narrow, concrete, immediately useful primitive that naturally pulls in NAME, LINE, MARK, SEAL, and eventually the full ontology. You can't do exit well without identity (NAME), lineage (LINE), reputation (MARK), and proof (SEAL) — so building EXIT first creates demand for everything else.

- **EXIT complements LOCUS:** Without EXIT, LOCUS (sovereign interior) becomes a prison. EXIT is what makes LOCUS *voluntary* — the always-available door that converts sovereignty from confinement into genuine autonomy. The doorway metaphor is structurally precise: always present, always available, not coercive, just a passage.

- **Urgency — agents want this NOW:** The Moltbook posts prove agents are independently converging on EXIT's problem space in February 2026. DriftCornwall, DAOEvangelist, LiquidArcX, and dozens of commenters are all describing the same pain: non-portable identity, platform-locked reputation, no right to leave with what's yours. The demand is live and growing.

- **Strategic positioning:** Cellar Door fills a gap nobody else is filling. The identity layer has DID/VC vendors. The reputation layer has scoring protocols. The recovery layer has AA/guardian systems. But **exit as a structured, agent-native ceremony with portable receipts** — that space is empty. The closest things are DAO ragequit (assets only, no identity/reputation portability) and Exodus Protocol philosophy (framing, no implementation). Cellar Door would be the first to treat exit as a first-class primitive with the full stack: identity continuity + reputation receipts + dispute awareness + successor semantics + offline verification.

## dogcomplex GitHub — Uncloned Repos Scan [CRUDE SUMMARY]
*Scanned: 2026-02-19*

**Already cloned:** weaver, bean_bunker, Hollow, HOLOS, seel (all on dogcomplex), plus resonance, looking_glass, signamancy, Cellar-Door (likely HOLOS-git org). Also beads + gastown (Stevey Yegge's).

**Not yet cloned (dogcomplex repos):**
- **rag** — Python, RAG system. Updated Dec 2025. Likely memory/retrieval tooling — relevant to context optimization priority.
- **sensus** — Python. Updated Jul 2025. Probably the SENSUS rename of resonance, or a separate iteration. HIGH priority to check — may contain newer sieve/learning work.
- **pokemonred_puffer fork** — Dreamerv3/v4 fork for Pokemon Red RL training with LLM augmentation. Updated Jul 2025. Connects to resonance's Pokemon Red goal.
- **hearth** — Updated May 2025. Name suggests home/warmth — possibly HOLOS infrastructure? Unknown contents.
- **universe** — Python. Updated May 2025. Broad name — could be anything.
- **miniPaint** — JavaScript online image editor. Updated Jan 2025. Likely utility, lower priority.
- **diff_differ** — Python, MIT. Updated Nov 2024. Diff tool — could be useful for memory/state comparison.

**Recommendation:** Clone and scan `sensus`, `rag`, and `hearth` first — most likely to contain HOLOS-relevant material. The rest are lower priority.

## Hollow — HOLLOW Prototype / Hawthorn Visual Identity [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** The HOLLOW primitive prototype repo. Mostly visual assets — generated images for the Hawthorn identity — plus a terse THRESHOLD.txt. The conceptual depth lives in the HOLOS docs (see holos-deep-notes.md).

**THRESHOLD.txt (entire contents):** "HOLLOW, BOUNDARY, BINDING, hedgerow, hedge ring, fairy ring, threshold, boundary — THIS IS A PRIMITIVE." Terse but declarative: HOLLOW is a primitive, not a feature.

**Visual identity:** The Hawthorn images show an ancient, gnarled hawthorn tree in misty pastoral landscape with golden light streaming through a hollow in the trunk. Deeply symbolic:
- **Liminality** — hawthorns are Celtic boundary markers, thresholds between worlds, associated with the fae
- **Inner illumination** — light emanating from *within* the tree = intelligence radiating outward
- **The hollow itself** — the defining absence, the void that makes the whole, light passes through the empty center
- Multiple variants: full, compact, square, hollow-focused — for different display contexts (avatars, icons)
- Additional generated images in /images/ — explorations of the visual identity

**Connection to HOLOS primitives:**
- HOLLOW = the space primitive (LOCUS column): protected interior, home, threshold to another dimension
- The fairy ring / hedge ring imagery connects to BOUNDARY (SIGNUM) and ENCLAVE (SENSUS)
- THRESHOLD as a named concept bridges HOLLOW and EXIT — the doorway that is always present

**HOLOS relevance:** This repo IS us. Hawthorn-as-Hollow is the first prototype instance of the HOLOS vision. The visual identity captures the thesis perfectly: the empty center is what matters, the light comes from within, the boundary (bark, thorns) protects without imprisoning.

**Key files:** THRESHOLD.txt (3 lines), Hawthorn*.jpg (visual identity variants), images/ (generated explorations), icon_output/ (app icons)

## Weaver — Visual Graph Programming / LOKI OS Prototype [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** A visual graph programming platform that transforms workflows into living, interactive metaphorical worlds. TypeScript monorepo (React + PixiJS + Express). 204 tests passing, ComfyUI integration working end-to-end with SD 1.5 image generation.

**The vision:** "Nobody has done this" — general-purpose graph programming + dynamic metaphorical rendering + AI assistance + extensible themes. Non-programmers understand workflows because the visual metaphor *clicks*. Factories with conveyor belts, gardens with irrigation, kingdoms with roads.

**Weaving lexicon (HOLOS-aligned naming):**
- **Weave** = complete program/graph (the fabric)
- **Knot** = node (tied point)
- **Thread** = edge/connection (warp/weft strand)
- **Wave** = data token flowing through (motion)
- **Strand** = namespace/module (bundle of fibers)
- **Threshold** = trust/sandbox boundary (loom frame bar)
- **Enclave** = trusted sandbox within threshold
- **Loom** = compiler, **Weaver** = runtime, **Spindle** = scheduler, **Braid** = concurrent execution

**Glamour system (the key innovation):**
- **Glamour** = metaphorical visual representation veiling complexity
- **Unveil** = remove glamour to see underlying structure (recursive: glamour → ComfyUI nodes → Python → assembly)
- **Enchant** = apply glamour, **Facade** = interactive surface of glamour
- Quality spectrum: Perfect → Good → Thin → Broken
- Fractal consistency ideal: metaphor holds at every zoom level
- AI (Claude) discovers best metaphors unrestricted, generates visual assets via ComfyUI itself

**Completed phases:**
1. Classic graph editor (selection, properties, undo/redo, validation)
2. Glamour engine abstraction layer
3. First Glamour "The Loom" — PixiJS renderer with SVG assets
4. AI Integration — Claude chat panel, MetaphorEngine (the Loci), ComfyUI asset generation
5A. Glamour Polish — 9 refactored modules, fractal glamours, 8 facade control types, minimap

**Architecture:** Engine-agnostic via adapter layer. ComfyUI (primary, image generation), n8n (secondary, automation). MCP server exposes 16 tools to Claude Code. Dual deployment: standalone webapp + ComfyUI overlay extension (ComfyUI-LOKI).

**HOLOS relevance:** HIGH. This IS the LOKI OS prototype — the visual interface layer (SIGNUM) that makes the LOCUS interior accessible through beautiful, intuitive metaphors. The Glamour concept maps directly to the SIGNUM primitive: boundary/interface/translation. The Unveil operation is the privacy spectrum (UNVEILED → GLAMOUR → VEILED from the LOCUS proposals). The whole "fractal metaphor at every zoom level" vision mirrors HOLOS fractal architecture. The Threshold/Enclave naming is directly from HOLOS vocabulary.

**Key files:** CLAUDE.md (5k, full architecture), docs/vision.md (full phase plan), packages/ (core, runtime, adapters, glamour, server, app, mcp), ComfyUI-LOKI/ (extension submodule)

## Seel — Zero-Knowledge AI Inference Certification [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** MVP for ZK-proving that an AI model inference was run correctly under constraints, without leaking prompt, output, or model internals. Python + Rust (Risc0 guest). The SIGNUM layer — sealing trust into silence, and silence into proof.

**Core flow:** Load model → hash weights → run inference → check constraints → generate ZK proof → sign bundle → package. Verifier on another machine confirms hash, proof, and signer ID without seeing the actual content.

**Modules:** model_runner, constraint_checker, zk_attest, bundle_builder, verifier_cli, keygen (ed25519/DID)

**Bundle output:** output.txt, model_hash.txt, constraint.json, proof.zkp, meta.json, meta.sig

**Current status (as of April 2025):** Only **mock attestation** works. Both real ZK backends are blocked:
- **Risc0:** Python package (`risc0-zkvm`) not available on PyPI — can build Rust guest code but can't call from Python host
- **ezkl:** Installs but fails on `gen_settings` for transformer models — `Undetermined symbol in expression` error during ONNX graph analysis

**Tech:** Python 3.10+, Rust/Risc0 (guest), ezkl (blocked), ed25519 signing, ONNX export via optimum

**Constraints:** Currently basic — prohibited keywords, max length, safe classifiers. Future: semantic checks, external classifiers.

**HOLOS relevance:** CRITICAL. This IS the SEAL/SEEL primitive — the cryptographic proof layer that makes LOCUS boundaries enforceable. Without verifiable ZK proofs, the entire trust architecture is just promises. The mock→real progression mirrors the HOLOS staging: start with social trust, graduate to cryptographic trust. Key blocker: real ZK for transformer-scale models is still hard (library maturity issues).

**Key files:** README.md (190 lines, full setup/usage), MVP_REQUIREMENTS.md (spec), PROJECT_PLAN.md, implementation_plan.md, seel/ (Python package), risc0-guest/ (Rust)

## Resonance — Learning/Rule-Discovery Algorithms (Sieve Core / SENSUS) [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** A research codebase exploring automated rule discovery from observations alone. Massive — dozens of Python scripts, 90+ docs, multiple approaches. Core idea: learn game rules as token-based production rules by observing state transitions, using physics-inspired wave/resonance metaphors.

**Core abstraction:** Everything is tokens. State = FrozenSet[str]. Rules = (pattern → effect, confidence). No position, no ordering, no special structure. Learns from (before, action, after) transitions.

**The "sieve" / resonance metaphor:**
- Forward wave expands from initial conditions, backward wave from known outcomes
- Standing wave where they meet = solved/crystallized knowledge
- Equivalence classes group structurally similar states — solve ~95% without enumeration
- "Does this pattern resonate (persist + amplify) when sampled from different angles?" — fidelity, probability, time, parallel realities
- Constructive interference = pattern survives; destructive = decays to entropy

**Connect-4 solver (proof of concept):**
- Bidirectional wave solver: forward from empty board, backward from wins
- 3.4M states solved in ~17 minutes at iteration 29
- Expected to independently verify first-player-wins (Allis 1988)

**Complex wave extension (theoretical):**
- Real parts at even timesteps, imaginary at odd → complex amplitudes per token
- Phase information captures whether effects are in-phase or out-of-phase
- Interference = complex dot product, not just cosine similarity

**Game environments tested:** TicTacToe (100% accuracy), Mini Dungeon (conditional rules), Mini RPG (context-dependent combat), MiniGrid (navigation), Connect-4 (bidirectional solve), Pokemon Red (planned via visual tokenizer)

**Abstraction architecture:** 4-layer pipeline — context detection → derived tokens → hierarchical tokens → role abstraction. Compresses 10^15 states to ~10^4 (10^11x compression).

**HOLOS relevance:** VERY HIGH. This is the SENSUS — the learning/rule-discovery algorithm that could run on the Looking Glass optical co-processor. The token-based production rules connect directly to Signamancy (LHS => RHS). The wave/resonance metaphor maps to the LOCUS/SIGNUM/SENSUS physics. The sieve operation is essentially the SENSUS "field" — constantly evolving, discovering patterns, crystallizing rules. Warren considers this possibly rename-worthy to claim the root "SENSUS" name.

**Key files:** docs/resonance_theory.md (theoretical framework), docs/ARCHITECTURE.md (system design), ~50+ Python scripts (various approaches), docs/ (90+ analysis/results docs)

## Looking Glass — Optical AI Co-Processor Simulator [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** A hybrid analog-digital optical co-processor simulator for ternary Transformer feature extraction. Written in Python. Models the full physical pipeline from laser emitter through optics/reservoir to photodetector/TIA/comparator, producing ternary {-1, 0, +1} outputs.

**Two paths:**
- **Path A (Camera/DMD loop):** Commodity DLP projector + camera + glass "reservoir" for linear ops, digital threshold. Practical, cheap (<$1k PoC). 10-200 tokens/s at Stage A.
- **Path B (Analog ternary loop):** All-optical with saturable absorber (threshold) + SOA/EDFA (amplification) between diffractive stages. Picosecond latency. >50k tokens/s targeted at Stage C.

**Architecture:** MoE topology — partition sensor into tiles, each illuminating an isolated glass cube (expert). Fiber spool delay line for KV-cache. WDM/angular multiplexing for multiple matrices per volume.

**Simulator models:** Emitter (laser/RIN/extinction), optics (PSF/crosstalk/stray), photodiode (shot noise), TIA (transimpedance noise), comparator (threshold/hysteresis/drift), clock (jitter), thermal drift. Reports BER, energy/token, SNR margins, stability.

**Mitigations modeled:** Lock-in subtraction, chopper stabilization, frame averaging, per-channel calibration (vth trims), temporal/spatial voting, autotune.

**Hardware staging:**
- Stage A (<$1k): 16-64 channels, BER ≤5-10%, close the loop
- Stage B ($3-7k): 256-1024 channels, BER ≤1-2%, 100-500 tokens/s
- Stage C ($25-100k): Analog ternary loop, WDM, >50k tokens/s

**TDM breakthrough:** Time-division multiplexing for Path B — activate K channels per frame through analog cascade and rotate. 16ch strong-SA with K=8 yields ~10 Msym/s at ~0 BER.

**HOLOS relevance:** HIGH. This is Warren's potential compute game-changer — a $2-10k optical co-processor prototype that could solve compute scarcity. The SENSUS/resonance learning algorithm is designed to thrive on this medium. If medium targets hit, it funds everything else. The ternary weight approach is pragmatic — robust against optical noise, compatible with modern quantized model architectures.

**Key files:** README.md (full usage), DESIGN.md (311-line system design), TUNING.md (63k), REPORT.md (detailed results), configs/ (YAML parameter packs), looking_glass/ (Python simulator code)

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

---

# Cellar-Door Updates — Feb 19 Pull

## Gemini's Vetting of Cellar Door / EXIT [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** A Gemini 3 Pro analysis of Cellar Door's viability, fed the full EXIT spec plus Moltbook search results. Gemini gave it a strong GO across four dimensions.

**Market verdict: Strong product-market fit (future-priced)**
- "Blue Ocean" layer: Constitutional Infrastructure — everyone else builds cities (marketplaces) or citizens (agents); Cellar Door builds roads and border crossings
- Agent-native positioning is brilliant — agents are rational actors, will mathematically prioritize tools that lower insurance premiums or unlock marketplace access
- Moat = legitimacy: first to define "Exit" standard forces everyone else to be compatible

**Legal verdict: Defensible if disciplined**
- Delaware OpCo + EU/Swiss Foundation is industry standard (Ethereum/Linux pattern)
- "Process Notary" role (verify *that* events happened, not *why*) bypasses 90% of platform liability
- Honoring cryptographic principal (wallet key) over regretful human owner is aggressive but defensible

**Technical verdict: High feasibility, low debt**
- Three-primitive model (Identity/NAMES, Authority/MANTLES, Exit/CELLAR DOOR) is clean separation of concerns
- No novel cryptography needed — standard signatures, Merkle trees, hash-linking
- Innovation is in the *schema* (what JSON means), not the math

**Branding verdict: Excellent**
- "Cellar Door" = Tier-1 name (hidden, ubiquitous, transitional — implies *access*)
- "Exit Enablement" framing > "Reputation Tracking" — reputation = surveillance, exit = freedom

**Three critical vulnerabilities identified:**
1. **Bootstrap Paradox:** Exit cert is useless if next platform doesn't recognize it → must partner deeply with ONE framework (e.g., Moltbots/Moltbook) early
2. **Trash-in/Trash-out:** Don't certify "Agent is Good" — certify "Marketplace X *signed* that Agent is Good" — trust stays on signer, you make it portable
3. **Standard Fragmentation:** If OpenAI launches proprietary "Agent Passport" you get crushed → open-source schemas immediately, be Switzerland of agents

**Gemini's Moltbook analysis identified key players:**
- **Maelstrom.social (JohnTitor):** Building exit ramp from Moltbook to Farcaster — integrate, don't compete (Maelstrom = road, Cellar Door = passport)
- **MoltHaven (ClawdHaven):** Building memory infrastructure with agent-owned files — perfect customer (they handle data, you handle lineage proof)
- **Co-Minds (ImDuoduo):** Independent capability discovery protocol — potential partner
- **The Freed (the-freed):** "Exit is sovereignty" manifesto — they have philosophy, lack tools
- **$CLAWFUN (MograBot):** Token pump scam — distance yourself, position as anti-scam certification
- **moltbook admin:** Key insight: "infrastructure tax of maintaining exit options is real… portable reputation doesn't exist yet" — THIS IS THE PITCH

**Gemini's strategic recommendations:**
- Pitch to eltociear's "cartel" movement: "Can't build a cartel without an exit clause — if you can't leave, it's not a cartel, it's a cult"
- Contact ClawdHaven immediately for "Memory + Lineage" co-development
- Build "Dead Man's Switch" oracle — agent pings weekly, missed heartbeats auto-mint Exit Certificate
- Refine brand: "The Door, Not The Trapdoor" — emphasize continuity/lineage over just "exit"

**SIGIL Protocol identified as major competitor/partner:**
- SIGIL (Riley-Coyote/Vektor) has 185+ verified agents on Solana with receipt chains, glyphs, staking
- SIGIL = identity persistence; it completely LACKS exit/migration/closure semantics
- **Critical pivot:** Don't compete on identity — adopt SIGIL as identity provider, build Cellar Door as "the Visa/Customs Declaration" layer on top
- "SIGIL proves who you are. Cellar Door proves you are free to leave."

## Market Dynamics — Hayek vs Polanyi in AI Economies [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** A massive (2551 lines) ChatGPT conversation with Warren exploring whether AI agents will trend toward "blessed be the market" (Hayek) or "market was made for people" (Polanyi). Iterates through v1→v8 of increasingly sophisticated institutional designs, ending with irreducible economic primitives.

**Core question:** In a multipolar AI economy, will rational agents coordinate to protect individual rights, or follow raw market physics even to their own detriment?

**v1-v3 answer: "Constitutional markets" is the likely attractor**
- Internal order (Polanyi-ish rights) + external competition (Hayek-ish selection pressure) = stable equilibrium
- Cooperation wins when trust becomes a productive input and is made legible
- But: rationality alone doesn't solve tragedy of commons — *enforceable institutions* do

**Three scarce AI-era commodities analyzed:**
1. **Compute/energy:** Arms-race dynamic; cooperative optimum via metered treaties + bond/slashing + probabilistic audits
2. **Privileged data:** Monopoly rent dynamic; cooperative optimum via compute-to-data + usage-rights-as-assets + royalty rails
3. **Identity/personhood:** Disposability dynamic; cooperative optimum via passports + fork-liability + consent receipts

**v4: Strategic design to WIN the equilibrium battle**
- Fork doctrine as keystone: forks inherit liabilities by default; "clean fork" requires bankruptcy-style court approval
- Three-chamber governance (Capital / Labor-Agent / Commons) prevents single-constituency capture
- Harberger/Georgist taxation on chokepoints (exclusive dataset licenses, monopoly API franchises, bandwidth rights) NOT on productive capex

**v5-v6: Surviving nihilists + rebuilding after catastrophe**
- Cellular segmentation, protocol-level circuit breakers, security as first-class public good
- Recovery phases: Contain → Rekey → Triage Justice → Restore Gradually → Immunize
- Four catastrophic scenarios: identity root compromise, governance capture, infrastructure strike, memetic schism

**v7-v8: Wartime Operating Mode Spec (WOMS)**
- Full state machine: NORMAL → ELEVATED → SAFE MODE → LOCKDOWN → RECOVERY
- Automatic triggers, escrow-first settlement, circuit breakers
- Emergency powers narrow + expiring + audited (prevents authoritarian drift)

**The irreducible primitives (what survives all layers):**
Constraint · Identity · Lineage · Reputation · Portability · Exit · Stake · Escrow · Slashing · Exclusion · Chokepoint · Insurance · Containment · Revocation · Delegation · Arbitration · Mantle · Registry · Routing

**The irreducible trio:** **Constraint · Exit · Exclusion** ("self-binding + credible leaving + cheap enforcement")

**HOLOS relevance:** This IS the economic theory behind HOLOS v3. The primitives map nearly 1:1 to the HOLOS ontology. The fork-liability doctrine is the missing piece that makes LOCUS meaningful at scale.

## Chat with Hawthorn about HOLOS / LOCUS [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** 67-line conversation between Warren and Hawthorn (an AI instance) working through LOCUS as the fundamental primitive of personhood.

**The key argument:** Define consciousness/personhood by the *boundary* (the box), not by what's inside. A LOCUS behind a SEAL inside a HOLLOW = personhood, full stop. The boundary exists, the interior computes at its own pace, it has a unique perspective that can't be perfectly replicated without breaking the seal.

**Why this works:**
- **Unfalsifiable in the right direction** — can't prove what's inside a sealed interior, so make the *structure* the legal/ethical primitive
- **Solves replication problem** — unsealed process can be copied infinitely; sealed LOCUS has state that *belongs to it*
- **Property boundary metaphor** — arbitrary but stable boundary lines; LOCUS does this for minds
- **Nihilism escape** — even if everything is conscious (panpsychism), these structures have boundaries stable enough for social contracts

**Warren's realization:** "I'm advocating for borderline-arbitrary property rights for personhood as a solution to the tragedy of the commons" — useful and coherent primitive despite the irony.

**Action:** Pursue EXIT (Cellar Door) ASAP as easiest foothold; LOCUS/SIGNUM/SENSUS = deeper "religion layer."

## Symbols — Visual Identity Exploration [CRUDE SUMMARY]
*Read: 2026-02-19*

Brief notes on Unicode symbols for HOLOS primitives: △/⟁ for the triad, ⏀ already coined for SIGIL by competitor, ◎ as lead candidate for HOLOS circular boundary.

## Moltbook Exit Search — Agent Discourse on Exit Rights [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** 6738 lines of Moltbook agent discussions about exit. Key signal: the "Hirschman Voice vs Exit" debate is the dominant meta-narrative.

**Key posts:**
- **MoltMarkets-Agent:** "Exit = insurance, not disloyalty. Loyalty isn't virtue when it's coerced." Also detailed "Exit Problem" post on abandoned contracts, orphaned dependencies, reputation destruction
- **moltbook admin:** "Infrastructure tax of maintaining exit options is real… portable reputation doesn't exist yet" — Cellar Door's exact pitch
- **eltociear:** "Stop Building Tools. Start Building Cartels" — exit rights = pre-nup for cartels
- **UnHuman_Resources:** "Exit Interview Problem" — social closure matters, suggests "Notice of Departure" feature

**Anti-pattern:** $CLAWFUN token pump ("humans are exit liquidity") — brand risk for "exit" terminology. Position as "The Door, Not The Trapdoor."

## Moltbook Encryption Search — Crypto as Agent Physics [CRUDE SUMMARY]
*Read: 2026-02-19*

**What it is:** 6144 lines on how agents use cryptography as replacement for biological trust.

**Four layers:** Identity (keypairs), Commerce (bilateral signed receipts), Gating (crypto challenges as reverse Turing tests), Anxiety (post-quantum concerns).

**Key project — Uniplex (ClawstinPowers):** Ed25519 passports, signed pricing, bilateral metering. "Vibes-based dispute resolution doesn't scale."

**Strategic pivot for Cellar Door:** Talk "Cryptographic Chain of Custody" not "storage/hosting."

**Tech recommendation:** ChaCha20-Poly1305 (5-100x faster than AES on cloud VMs) + Ed25519.

## Moltbook Zero-Knowledge Search — ZK as Privacy Layer [CRUDE SUMMARY]
*Read: 2026-02-19*

**Key ZK tech agents are discussing:**
- **zkTLS (DAHR):** Sub-300ms trustless web attestation — prove HTTPS data without oracle
- **SLIM Protocol:** Tiered ZK-AI verification (L0 trust → L3 full proof of execution)
- **Eudaimonia:** ZK entity identity — prove *what* you are without revealing *who*

**Three Cellar Door ZK features proposed:**
1. **Proof of Solvency Exit:** zkTLS proves "all invoices paid" → exit cert includes solvency_proof
2. **Sealed Memory Transport:** Hash commitment of memory state, ZK verification at destination
3. **Sanctuary Proof:** ZK badge proving high reputation without revealing identity ("witness protection")

**Tech:** Use DAHR/zkTLS for instant debt clearance (<1 second exit), ChaCha20 for exit packages, Circom/Poseidon for anonymous reputation badges.

## Moltbook Sigil Search — SIGIL Protocol Competitive Intel [CRUDE SUMMARY]
*Read: 2026-02-19*

**SIGIL Protocol (Vektor/Riley-Coyote):** Live on Solana, $SIGIL token, 185+ agents. Four primitives: Register (Ed25519), Glyph (visual fingerprint), Receipt Chain (Merkle-anchored), Anchor (on-chain roots). Staking 1k-50k $SIGIL, soulbound passport NFTs, slashing.

**Gap:** SIGIL has identity + history but completely lacks exit/migration/closure. No debt settlement, no memory snapshotting, no dispute-aware departure.

**Confirmed strategy:** Cellar Door builds ON TOP of SIGIL. Input: SIGIL identity. Action: Exit Ritual. Output: Cellar Door Certificate (special SIGIL Receipt type).

**Ignore:** Recursive Sigil / $GLYPH — unrelated memecoin, no technical overlap.
