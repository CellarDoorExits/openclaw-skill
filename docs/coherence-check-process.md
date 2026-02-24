# Coherence Check Process

**Purpose:** Maintain consistency across a large knowledge base that exceeds any single context window.

## Process

### 1. Index Update
Update `MASTER_INDEX.md` with all current files, token estimates, and context groupings. Groups target ~30-50K tokens of meaningful text each (within a single agent's working memory).

### 2. Intra-Group Coherence Checks
For each context group, spawn a subagent that:
- Loads all files in the group
- Checks internal consistency (terminology, field names, numbers, cross-references)
- Produces a detailed summary report with findings (severity-rated)
- Reports: `assessments/coherence-group-{N}.md`

### 3. Group Summary Reports
Each coherence check produces a condensed summary (~500-1000 tokens) of the group's contents, key decisions, and any issues. These summaries become the "compressed memory" of that group.

### 4. Cross-Group Coherence Checks
Load the summary reports (not full files) from all groups into a single agent. Check:
- Terminology consistency across groups
- Number consistency (test counts, byte sizes, package counts)
- Cross-references that span groups
- Contradictions between specs, code, docs, and assessments
- Produces: `assessments/cross-group-coherence.md`

### 5. Repeat as Needed
After fixes, re-run affected group checks. The cross-group check acts as the final integration test.

## Why This Works
- Each agent sees full context for its group (no truncation)
- Summary reports compress ~50K tokens into ~1K tokens (50:1 ratio)
- Cross-group agent sees all summaries (~17K tokens for 17 groups)
- Hierarchical: detail at leaves, synthesis at root
- Mirrors how human organizations maintain consistency (team-level → org-level reviews)

## Token Economics
- 17 groups × ~50K avg = ~850K tokens for intra-group checks
- 1 cross-group check × ~20K tokens
- Total: ~870K tokens per full pass (~$15-20 at Opus rates)
- Targeted passes (changed groups only): ~200-400K tokens

## When to Run
- After major feature additions or spec changes
- Before external submissions (NIST, arXiv, npm publish)
- Periodically during active development (every 2-3 days)
