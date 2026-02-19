# Pensieve Repository Analysis

**[CRUDE SUMMARY + ANALYSIS]** — 2026-02-19

---

## 1. What Pensieve Is

Pensieve is a **Context Operating System** — a monorepo containing multiple "organs" that together form a memory/retrieval/classification system for AI agents. It's the memory subsystem of the larger HOLOS vision (a "Sovereign Biological Operating System"). The repo is organized as:

- **`pensieve/`** — Core OS layer: indexes, registries, two-store memory model, context packing
- **`HMLR/`** — Hierarchical Memory Lookup & Routing (a git submodule from Sean-V-Dev's repo) — the structured long-term memory engine
- **`classifiers/` + `classifier/`** — TRIAD RGB classification system (Locus/Signum/Sensus spectrum)
- **`archived/triad/`** — Legacy TRIAD organ tree

### The Two-Store Model

The central architecture divides memory into:

1. **Static Index (Locus)** — `pensieve/memory/static/` — A code/document indexer that walks repos, chunks files (Python AST, regex, text blocks, HTML sections, PDFs), stores in SQLite, and classifies each chunk on the TRIAD spectrum (Locus/Signum/Sensus). Supports symbol lookup, import/call edge tracking, and directory-level summary pyramids.

2. **Dynamic Store (Sensus)** — `pensieve/memory/dynamic/` — A conversation history manager wrapping HMLR. Stores episodic "Bridge Blocks" (groups of ~20 turns), user profile facts (invariants), and a human-editable scratchpad. Two modes: `local` (no LLM, heuristic extraction) and `hmlr` (full LLM-backed routing via HMLR's ConversationEngine).

---

## 2. Architecture & Data Flow

### Indexing Pipeline (Static)
```
Repo → walk_repo() → per-file chunking → TRIAD classification → SQLite
                                        → import/call edge extraction
                                        → heuristic summary pyramid
```

Chunkers: Python AST, regex (JS/TS), text blocks (markdown/txt/JSON), HTML sections, PDF extraction. Handles large files via streaming SHA + head sampling.

### Conversation Pipeline (Dynamic)
```
Turn → entropy gate (drop low-value: "ok", "thanks", etc.)
     → user profile fact extraction (heuristic regex: "I hate X", "I am vegetarian")
     → store in Bridge Block (HMLR storage)
     → auto-fold when block grows (heuristic metadata: topic, keywords, open loops)
```

### Context Packing (The Session Packer)
```
Task + query → rank candidates (heuristic or LLM rerank)
             → fit to token budget (drop mentions first, then chunks, trim excerpts)
             → render as markdown with citations/provenance
             → emit PackManifest (auditable)
```

The packer uses a **stability bias** system: cold (immutable truth) > warm > hot (recent chat), unless the task explicitly asks for recent context. Quality warnings are emitted for budget pressure situations.

### Retrieval (Dynamic)
```
Query → assemble scratchpad + user profile + skeleton (block summaries) + expanded block (recent turns)
      → fit to token budget (trim expanded block from oldest first)
```

---

## 3. HMLR — The Memory Engine

HMLR is Sean-V-Dev's open-source project that Pensieve wraps. Key claims:
- **Perfect RAGAS scores** (1.00 Faithfulness, 1.00 Context Recall) across adversarial benchmarks
- Uses only gpt-4.1-mini with <4k tokens per query
- Bridge Block architecture: conversation segments grouped by topic, with metadata headers
- Handles temporal conflict resolution, cross-topic invariants, multi-hop policy reasoning
- "Test 12 — The Hydra" (9 policy aliases, 8 revocations, info buried at 2300 tokens deep) — passed with pure contextual memory, no vector search

Architecture: Sliding window (20 turns) + Bridge Blocks + fact scrubber + user profile + hybrid search (vector + keyword). Configurable context budget (default 4000 tokens).

**Verdict: The strongest component.** HMLR is well-tested, has RAGAS verification, and solves real problems. The Pensieve wrapper adds entropy gating, heuristic folding, and the static index — all valuable additions.

---

## 4. Classification System (TRIAD)

Everything is classified on a three-axis spectrum:
- **🪷 LOCUS** — Immutable truth, definitions, memory, law
- **💠 SIGNUM** — Interface, communication, language, form
- **🌊 SENSUS** — Execution, physics, hardware, runtime

Classification is done deterministically (heuristic rules based on file extension, path, content patterns) with optional LLM overlay for deeper analysis. Results cached in SQLite. Benchmarks exist for accuracy testing.

The spectrum approach allows continuous scoring (not just categorical) — each file/chunk gets float values for all three axes.

---

## 5. MAW — The Ingestion/Digestion System

MAW is the incremental ingestion pipeline for large datasets:
- Detects changes by `(path, size, mtime)`
- Incrementally re-indexes changed files
- Estimates Gemini API costs before running
- Prioritizes batches using HOLOS keyword-overlap heuristic
- Optional: HOLOS crossref via local LLM + context packs

The **MAW Scheduler** (`pensieve/maw/scheduler.py`) implements a UCB-based exploration/exploitation strategy:
- Entities organized as bucket → file → block tree
- Each entity tracks relevance, child sampling stats
- `score_priority()` combines relevance × (expected_value + UCB exploration bonus) × remaining_work_factor
- `pick_next()` selects highest-priority pending entities

**This is one of the most interesting components** — it's essentially a multi-armed bandit approach to deciding what to digest next, which directly connects to the resonance/sieve learning ideas.

---

## 6. RLM-Lite — Tool Plan Executor

`pensieve/runtime/rlm_lite.py` is a **deterministic tool plan runner** (not a true RLM). It:
- Takes a list of `{tool, args}` steps
- Executes them sequentially via ToolEnv
- Supports `$ref` resolution between steps
- Emits auditable `run.json` traces

The DOCS reference the actual Recursive Language Models paper (Zhang & Khattab, MIT 2025) — RLMs that recursively call themselves via REPL environments to handle unbounded context. The plan was to "cannibalize the prompt engineering and REPL sandbox logic" from the research implementation and build it into The Maw.

---

## 7. The Project Map System

`pensieve/projects/` contains a sophisticated project-mapping pipeline:
- Topic clustering of indexed content
- LLM-assisted hierarchical bucket splitting
- Two-pass block mapping (coarse → fine-grain)
- Active learning sample selection
- Proposal engine for suggesting new project groupings
- Deterministic bucket model training

This implements the vision from `the_dream.txt`: organizing an entire repository of knowledge into modular project plans with fine-grained citations, from folder level down to individual blocks.

---

## 8. What's Messy vs What's Solid

### Solid ✅
- **HMLR integration** — Well-tested, RAGAS-verified memory engine
- **Static index** — Clean chunking pipeline, good file type coverage
- **TRIAD classification** — Benchmarked, deterministic + LLM overlay
- **Context packer** — Sophisticated budget fitting with provenance tracking
- **Test suite** — Comprehensive monorepo test runner with caching, cost estimates
- **Entropy gate** — Simple but effective noise filtering for dynamic memory
- **MAW scheduler** — Elegant UCB-based prioritization

### Messy ⚠️
- **Local machine coupling** — Paths hardcoded to `G:\LOKI\LOCUS\LOCUS\pensieve`, Windows CMD examples everywhere
- **HMLR as git submodule** — Dependency management is fragile
- **RLM-Lite** — Not actually recursive; the real RLM integration is aspirational
- **Gemini/OpenAI dependency** — Many tools require API keys; local model path is "designed for" but not fully implemented
- **Project map pipeline** — Many tools, unclear which ones are actively used vs experimental
- **Dynamic memory modes** — `hmlr` mode requires HMLR's full async pipeline; `local` mode is bare-bones
- **Documentation scattered** — Mix of DOCS/, inline comments, README.md, TODO.md

### Warren's Warning Confirmed
"A lot of the pensieve code was designed to run on my local machine here and it's a bit of a mess, and it will definitely need a local model running to be worth the token costs."

This is accurate. The pipeline works but:
1. Every LLM-touching step costs API tokens (Gemini for notes, OpenAI for HMLR, local LLM for crossref)
2. Without a local model, the digestion pipeline is prohibitively expensive for large datasets
3. The code assumes Warren's local setup (Windows paths, specific venv locations)

---

## 9. Token Economics

The test suite provides explicit cost estimates:
- TRIAD LLM smoke: 2-8K input, 200-1K output tokens
- HMLR quick benchmark: 40-250K input, 5-60K output
- HMLR Hydra: 300K-3.5M input, 40-700K output (expensive!)
- Pricing baseline: gpt-4.1-mini at $0.40/1M input, $1.60/1M output

For ongoing operation:
- HMLR context budget: 4000 tokens per query
- Sliding window: 2-6K tokens
- Each dynamic retrieval: ~4-8K tokens total
- Static index: no LLM cost (deterministic)
- MAW digestion: variable, depends on dataset size and LLM usage

**Key insight**: The static index and TRIAD classification are cheap (deterministic). The expensive parts are HMLR conversation processing, Gemini note-taking, and crossref analysis. A local model would eliminate the ongoing cost for routine operations.

---

## 10. Adaptation for Hawthorn/OpenClaw Context Optimization

### What's Directly Useful
1. **Two-store model** — OpenClaw already has something similar (workspace files + conversation history). Pensieve's formalization with Static/Dynamic separation is clean.
2. **Entropy gate** — Drop low-value turns before storing. Simple regex-based, no LLM cost. Could be adapted for OpenClaw message filtering.
3. **Context packer** — Budget-aware assembly with provenance tracking. Could improve how OpenClaw constructs agent context.
4. **TRIAD classification** — Classifying workspace files by role (definition/interface/runtime) to prioritize what goes in context.
5. **Bridge Block folding** — Heuristic summarization of conversation segments. Could help compress OpenClaw conversation history.
6. **User profile facts** — Extracting and persisting user invariants ("I hate X"). Already partially implemented in OpenClaw's USER.md pattern.

### What Needs Rethinking
1. **SQLite-centric storage** — OpenClaw uses flat files (markdown). Would need adapter or migration.
2. **Python-only** — OpenClaw is Node.js. Core algorithms would need porting or service-based integration.
3. **HMLR dependency** — Heavy Python library. Either run as sidecar service or extract the concepts.
4. **Local model requirement** — MAW pipeline needs a local model for cost-effective operation. OpenClaw currently uses cloud APIs.

### Recommended Approach
Extract the **concepts and algorithms** rather than the code:
- Port entropy gate to TypeScript (trivial)
- Implement budget-aware context packing in OpenClaw's context builder
- Add TRIAD-like classification to workspace file prioritization
- Implement Bridge Block-style conversation folding for long sessions
- Use MAW's UCB scheduler concept for deciding what to index/summarize

---

## 11. Improvement Ideas

### For Pensieve Itself
1. **Decouple from local machine** — Environment variables for all paths, Docker support
2. **Abstract LLM provider** — Already partially done via `openai_compat.py`, but needs full local model support (ollama, llama.cpp)
3. **Streaming context packing** — Current packer materializes everything in memory; stream for larger datasets
4. **Time-decay on Bridge Blocks** — Currently no decay; older blocks should compress more aggressively
5. **Cross-store linking** — Static symbols referenced from dynamic turns should create explicit edges

### For HOLOS/OpenClaw Integration
1. **Resonance/Sieve Connection** — The MAW scheduler's UCB exploration is essentially a "resonance detector" — things that keep being relevant get explored more. This maps directly to the sieve algorithm concept: information that "resonates" across multiple contexts gets promoted, while noise decays.

2. **Phase Change Implementation** — Pensieve's liquid→solid concept (Hydration→Calcification) maps to:
   - **Liquid**: Full LLM context with all conversation history (expensive, flexible)
   - **Solid**: Extracted facts, user profile, folded summaries (cheap, reliable)
   - OpenClaw should track when context items "calcify" — moving from raw conversation to distilled knowledge in MEMORY.md

3. **Fractal Classification** — Apply TRIAD classification at multiple scales:
   - Session level: is this conversation about definitions (LOCUS), interface design (SIGNUM), or execution (SENSUS)?
   - Message level: is this a fact, a question, or a command?
   - Use classification to route to different context assembly strategies

4. **RLM for Context Rot** — The Recursive Language Model research (Zhang & Khattab) is directly applicable to OpenClaw's context optimization problem. Instead of stuffing everything into one prompt, let the agent recursively query its own memory. This is essentially what OpenClaw's subagent pattern already does in a crude form.

5. **Token Budget as First-Class Primitive** — Pensieve's packer treats token budget as the primary constraint. OpenClaw should expose remaining context budget to the agent, letting it make informed decisions about what to load.

6. **Deterministic Before LLM** — Pensieve's philosophy of "deterministic classification first, LLM overlay second" is exactly right for cost-conscious operation. Apply everywhere: heuristic routing first, LLM only when heuristics fail.

7. **Scratchpad Pattern** — The human-editable scratchpad (user invariants) already exists in OpenClaw as USER.md/MEMORY.md. Pensieve formalizes this with structured extraction. Could enhance OpenClaw's memory system with automatic invariant extraction from conversations.

8. **Provenance Tracking** — Every packed context item has a manifest entry explaining why it was included/excluded. OpenClaw should adopt this for debugging context quality issues.

---

## 12. Key Takeaways

1. **HMLR is the jewel** — Perfect RAGAS scores on adversarial benchmarks using mini-class models. The architecture-over-model-size thesis is proven.

2. **The two-store model is sound** — Separating static (code/docs) from dynamic (conversation) memory with budget-aware packing is the right architecture.

3. **Deterministic classification is underrated** — TRIAD's heuristic classification is cheap, fast, and "good enough" for routing. LLM overlays add precision but aren't needed for basic operation.

4. **MAW's UCB scheduler is elegant** — Multi-armed bandit for information digestion priority is a novel and practical approach.

5. **The code is research-grade** — Functional but tightly coupled to Warren's local setup. Extracting concepts > porting code.

6. **Token economics matter** — Every design decision in Pensieve is filtered through "what does this cost in tokens?" This discipline should carry over to OpenClaw.

7. **The HOLOS vision is ambitious but grounded** — Phase changes (liquid→solid), fractal classification (TRIAD), sovereign computing — these aren't just metaphors, they map to concrete architectural decisions.
