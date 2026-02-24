# P13: Open Source Maintainer — OSS Health Assessment

**Persona:** Maintainer of a 10K+ star open source project
**Date:** 2026-02-24
**Documents Reviewed:** README.md, package.json, DECISIONS.md, LICENSE, brand-guide.md (skim)

---

## Verdict: **Would-Watch** 👀

Not ready to depend on. Not ready to contribute to. But worth tracking — the design thinking is unusually strong for a v0.1.0.

---

## Project Health Scorecard

| Signal | Rating | Notes |
|--------|--------|-------|
| **Version** | 🔴 0.1.0 | Pre-1.0. No stability guarantees. |
| **License** | 🟢 Apache 2.0 | Excellent choice. Patent grant included. Clearly reasoned (D-007). |
| **Bus factor** | 🔴 1 | Single copyright holder: Warren Koch. No other contributors visible. |
| **Governance** | 🔴 None | No GOVERNANCE.md, no CONTRIBUTING.md, no code of conduct. |
| **Dependencies** | 🟢 Minimal | 5 runtime deps, all from `@noble/*` suite (audited crypto) + `commander`. Clean. |
| **Build tooling** | 🟢 Modern | tsup, vitest, tsx. ESM + CJS dual output. Proper exports map. |
| **Tests** | 🟢 291 passing | 18 test files. Property-based testing (fast-check). Impressive for the stage. |
| **Types** | 🟢 Full TypeScript | .d.ts shipped. Proper types field in exports. |
| **Docs** | 🟡 Mixed | README is solid. No API docs, no JSDoc comments mentioned, no generated docs. |
| **CI/CD** | ❓ Unknown | No evidence of CI config in the files reviewed. |
| **npm published** | 🔴 Unclear | README says `npm install cellar-door-exit` but no npmjs.com presence confirmed. |
| **Changelog** | 🟡 Referenced | `CHANGELOG.md` in `files` array but not reviewed. |
| **Issue tracker** | 🟡 Exists | GitHub issues URL present in package.json. Activity unknown. |

---

## Who's Behind It?

**Warren Koch.** Solo. The LICENSE says "Warren Koch, EXIT Protocol Project." The ecosystem map mentions an unresolved entity question (LLC vs. sole prop). The DECISIONS log references "red team recommendations" suggesting some review process, and the paper mentions "15 synthetic professional personas" — but these appear to be AI-generated reviews, not human contributors.

No GitHub org with multiple maintainers. No company backing. No foundation. The brand guide is surprisingly polished ("approved by Warren") which reads as one person playing multiple roles.

**Assessment:** This is a solo passion project with exceptional intellectual depth. That's a red flag for dependency, not a quality flag.

---

## Will They Maintain It?

**Uncertain.** Evidence for:
- Extremely detailed decision log (13 ratified decisions, 5 deferred). This person thinks carefully.
- Spec is at v1.1 already, showing iteration.
- 291 tests show engineering discipline.
- The ecosystem map shows long-term vision (adjacent services, liability boundaries).

Evidence against:
- v0.1.0 with no production users.
- Solo maintainer.
- No entity, no funding.
- The scope is *enormous* — EXIT + ENTRY + 5 npm packages + 3 framework integrations. One person cannot maintain this.
- The ecosystem map lists ~10 adjacent services as "interface prepared." That's aspirational architecture, not shipped software.

**Prediction:** High risk of abandonment within 12-18 months unless funding or co-maintainers materialize. The scope-to-team ratio is unsustainable.

---

## License Analysis

**Apache 2.0** — no concerns.

- Patent grant: ✅ (§3 of Apache 2.0, explicitly reasoned in D-007)
- Compatible with our project: ✅ (Apache 2.0 is compatible with MIT, BSD, GPL v3)
- Patent retaliation clause: ✅ (standard Apache 2.0)
- No CLA requirement mentioned: ✅ (reduces contribution friction)
- No "Community Edition" / "Enterprise" split: ✅

The license choice and reasoning (D-007) are actually one of the best things about this project. They specifically considered patent landscape risks in identity/credential systems. Smart.

---

## Code Quality Signals

**What I can infer from package.json and README:**

**Positive:**
- Dependencies are *excellent*. `@noble/ciphers`, `@noble/curves`, `@noble/ed25519`, `@noble/hashes` — these are paulmillr's audited, zero-dependency crypto libraries. Best-in-class choice for JS crypto. Shows someone who knows what they're doing.
- Zero framework dependencies at runtime. Pure library. This is correct for a protocol primitive.
- `fast-check` in devDeps means property-based testing. Rare and good.
- Dual ESM/CJS build with proper exports map. Correct for 2026 Node.js.
- CLI via `bin` field — good for developer experience.

**Concerns:**
- `@langchain/core` is a devDependency, not a peer dependency. This suggests the LangChain integration is in-tree, not a separate package (despite the paper claiming 5 separate packages). Monorepo structure unclear.
- `zod` in devDeps — used for schema validation presumably. Not a red flag but suggests runtime validation might not use zod (since it's devDep only).
- No linting config visible (eslint/biome). `lint` script is just `tsc --noEmit`.

---

## Governance Model

**There is none.**

No CONTRIBUTING.md. No code of conduct. No maintainer list. No RFC process (despite having a very RFC-like spec). No issue labels or templates (unknown). No PR review process documented.

The DECISIONS.md is the closest thing to governance — it's a well-structured decision log that would serve a team. But it reads as one person documenting their own thinking, not a multi-stakeholder process.

For a library I depend on, I need to know: Who reviews my PR? Who decides what goes in v2.0? Who handles security disclosures? What's the deprecation policy? None of this exists.

---

## Would I Add as Dependency?

### Would-Contribute: **No (not yet)**

- No CONTRIBUTING.md — I don't know how to contribute.
- Solo maintainer with an enormous vision — my PRs might conflict with undocumented architectural plans.
- No governance means my contributions could be rejected arbitrarily or the project could change direction without notice.
- **If** they publish a CONTRIBUTING.md and demonstrate responsive PR review, I'd reconsider.

### Would-Depend: **No**

- v0.1.0. API will break.
- Bus factor of 1. If Warren gets busy, I'm stuck.
- No npm publication confirmed.
- The scope ambition suggests the API surface will churn significantly before stabilizing.
- I'd vendor-lock to a protocol with zero adoption — if EXIT doesn't become a standard, I've wasted integration effort.

### Would-Watch: **Yes** ✅

This is the correct posture. Specifically watching for:
- v1.0.0 release (API stability commitment)
- Second maintainer
- Entity formation (LLC, foundation, anything)
- First production adoption by a real platform
- NIST or AAIF recognition
- npm publication with regular release cadence

### Would-Avoid: **Not applicable**

The project isn't harmful or badly designed. It's just pre-mature for dependency.

---

## What Impresses Me

1. **Dependency choices.** `@noble/*` for crypto is the right call and signals real expertise. Many projects reach for `node-forge` or `crypto-js` and regret it.

2. **The decision log.** 13 decisions with options considered, rationale, and status. I wish my project had started this disciplined. D-006 (disputes never block exit) and D-012 (no public registry) show someone who's thought deeply about failure modes.

3. **Test coverage at 291 tests for v0.1.0.** Most projects at this stage have 20 tests and a dream. Property-based testing with fast-check is a genuine quality signal.

4. **The spec exists.** Most OSS protocol libraries ship code with no spec. This has a 1,778-line specification with test vectors. Interop-ready if anyone else implements it.

5. **Minimal core design.** 7 fields, ~335 bytes. The README communicates this clearly. I can understand what EXIT *is* in 60 seconds.

---

## What Concerns Me

1. **Scope creep is already visible.** v0.1.0 with KERI key management, RFC 3161 TSA, git ledger anchoring, visual hash doors, three framework integrations, and a CLI. That's a v3.0 feature set crammed into a v0.1.0. This suggests the maintainer can't say no to features — fatal for long-term maintenance.

2. **README license inconsistency.** The README says "License: MIT" at the bottom. The LICENSE file is Apache 2.0. The package.json says Apache 2.0. The decision log explains the switch from MIT to Apache 2.0. Someone forgot to update the README. Small thing, but it signals "one person, no review process."

3. **The HOLOS/ecosystem map concern.** The ecosystem map references a grand unified theory (HOLOS ontology, fractal triad, 7×3 primitive grid, trust spectrums with emoji names). This reads as either visionary architecture or a warning sign that the project will get absorbed into a larger, more abstract system and lose focus. For a dependency, I want boring focus, not cosmological ambitions.

4. **No security policy.** No SECURITY.md. No responsible disclosure process. For a cryptographic signing library, this is a meaningful gap.

---

## Recommendation

**Star the repo. Set a reminder for 6 months. Don't depend, don't contribute, don't ignore.**

If in 6 months it has: a second maintainer, v0.5.0+, npm publication, and one real user — upgrade to Would-Contribute. If it has v1.0.0 and a governance model — upgrade to Would-Depend.

The intellectual quality deserves respect. The operational maturity doesn't yet deserve trust.
