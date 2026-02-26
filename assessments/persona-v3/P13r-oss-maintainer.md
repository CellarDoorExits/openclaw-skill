# P13r: Open Source Maintainer — OSS Health Re-Assessment

**Persona:** Maintainer of a 10K+ star open source project
**Date:** 2026-02-25
**Previous Review:** 2026-02-24 (Would-Watch)
**Documents Reviewed:** README.md, CONTRIBUTING.md, GOVERNANCE.md, SECURITY.md, package.json

---

## Verdict: **Would-Contribute** 🤝

Upgraded from Would-Watch. The project addressed every governance gap I flagged. Not yet ready for hard dependency, but I'd now send PRs and recommend it to adventurous adopters.

---

## What Changed Since Last Review

| Gap I Flagged (Feb 24) | Status | Notes |
|------------------------|--------|-------|
| No CONTRIBUTING.md | ✅ Fixed | Clear PR process, code style guide, test requirements |
| No GOVERNANCE.md | ✅ Fixed | BDFL model documented honestly. RFC process for breaking changes (7-day comment). |
| No Code of Conduct | ✅ Fixed | Referenced in CONTRIBUTING.md |
| No SECURITY.md | ✅ Fixed | Vuln reporting via email, 48h response commitment. Honest about audit status. |
| v0.1.0 | ✅ → v0.2.0 | Meaningful release: P-256/FIPS, signer abstraction, claim store, OTel, passage API |
| 291 tests / 18 files | ✅ → 399 tests / 24 files | +37% test coverage growth in one release cycle |
| README license inconsistency | ✅ Fixed | Now consistently Apache-2.0 |
| Scope creep concern | 🟡 Partially | v0.2.0 additions are focused (FIPS, signer interface, telemetry) — less sprawl than feared |

---

## Updated Project Health Scorecard

| Signal | Rating | Δ | Notes |
|--------|--------|---|-------|
| **Version** | 🟡 0.2.0 | ⬆️ | Still pre-1.0, but showing release cadence |
| **License** | 🟢 Apache 2.0 | — | Consistent across all files now |
| **Bus factor** | 🔴 1 | — | Still solo. This remains the biggest risk. |
| **Governance** | 🟡 BDFL | ⬆️ | Documented, honest about stage. RFC process for breaking changes. |
| **Dependencies** | 🟢 Minimal | — | Same excellent `@noble/*` stack. No new runtime deps. |
| **Build tooling** | 🟢 Modern | — | tsup, vitest, tsx, dual ESM/CJS |
| **Tests** | 🟢 399 passing | ⬆️ | 24 test files. Property-based testing. Strong. |
| **Types** | 🟢 Full TypeScript | — | Proper exports map with types |
| **Docs** | 🟡 Improved | ⬆️ | Getting Started guide, HSM integration guide added |
| **CI/CD** | ❓ Unknown | — | Still no evidence reviewed |
| **npm published** | 🔴 Unclear | — | Still unconfirmed |
| **Security policy** | 🟢 Exists | ⬆️ | Honest about audit gaps. HSM escape hatch for production. |
| **Contribution path** | 🟢 Clear | ⬆️ | CONTRIBUTING.md with concrete guidelines |

---

## v0.2.0 Technical Assessment

The new features are well-chosen for a cryptographic primitive library:

**ECDSA P-256 / FIPS compliance** — This is the single most important addition for enterprise adoption. Shows the maintainer is thinking about real deployment contexts, not just academic elegance. The `Signer` abstraction letting you plug in HSM/KMS is exactly right.

**OpenTelemetry integration** — Operational maturity signal. Someone planning to run this in production would need observability. Good instinct.

**Claim store** — `MemoryClaimStore` with `ingestMarker()` is a natural building block. In-memory default with interface for persistence is the correct pattern.

**Passage API** — Renaming the API surface (`createDepartureMarker`, etc.) suggests the maintainer is iterating on DX before 1.0. Better to churn now than after.

**What's NOT in v0.2.0 is also good:** No KERI, no git ledger anchoring, no visual hash doors. The scope creep I feared hasn't materialized. The v0.2.0 scope is disciplined.

---

## Governance Analysis

The GOVERNANCE.md is refreshingly honest:

> "This project is early-stage (v0.x). Governance will evolve as the community grows. The current model is benevolent dictator — simple and fast while the contributor base is small."

This is the correct governance model for this stage. I've seen too many solo projects adopt elaborate governance theatre (steering committees of one, etc.). Calling it BDFL and promising evolution is both honest and pragmatic.

The RFC process for breaking changes (7-day comment period in GitHub Issues) gives me enough confidence that my contributions won't be obsoleted without warning.

**Ecosystem awareness:** The mention of "Passage Protocol" with `cellar-door-entry` as a sibling project is good — it shows the scope is intentional, not accidental. The CellarDoorExits GitHub org suggests some organizational thinking.

---

## Security Policy Analysis

**Strengths:**
- Honest about what's NOT audited ("this package's usage of those primitives has not been independently audited")
- Clear escape hatch for production ("use the Signer interface to plug in a FIPS-validated HSM")
- Vuln reporting with 48h response commitment
- Correct distinction between Ed25519 (not FIPS) and P-256 (FIPS)

**Gaps:**
- Email-only reporting (no encrypted channel, no HackerOne/huntr)
- No CVE assignment process mentioned
- No supported versions matrix
- 48h response is a commitment from one person — what if he's on vacation?

For a v0.2.0, this is adequate. For a v1.0.0 I'd want more.

---

## Remaining Concerns

1. **Bus factor is still 1.** This is the blocker for Would-Depend. One maintainer with a full-time job (presumably) handling security disclosures, PR reviews, releases, and roadmap for a cryptographic library is unsustainable. Everything else has improved; this hasn't.

2. **No confirmed npm publication.** `npm install cellar-door-exit` is in the README but I haven't verified it on npmjs.com. If it's not published, the contribution path is academic.

3. **No CI evidence.** CONTRIBUTING.md says "Ensure CI passes before requesting review" — implying CI exists — but I haven't seen config files. For a crypto library, CI with multiple Node versions matters.

4. **The HOLOS/cosmological ambition.** Not visible in these docs, but the broader ecosystem map from last review still suggests a grand vision that could pull focus. The Passage Protocol framing is fine; the fractal ontology stuff would concern me if it crept into the core library.

5. **`@langchain/core` in devDeps.** Still there. Suggests in-tree LangChain integration rather than separate package. Not a dealbreaker but adds maintenance surface.

---

## Updated Recommendation

### Would-Contribute: **Yes** ✅

The contribution path is now clear and professional. I would:
- File issues for edge cases I discover
- Submit PRs for documentation improvements
- Consider contributing test vectors
- Potentially contribute a verification-only subset for lightweight consumers

The CONTRIBUTING.md, governance model, and test-first culture give me confidence my time wouldn't be wasted.

### Would-Depend: **Not yet**

Upgraded from hard-no to conditional-no. Blockers:
- Bus factor must reach 2+
- npm publication confirmed with semver discipline
- At least v0.5.0 (API stability approaching)
- One documented production deployment
- Security audit or at minimum a peer review of crypto usage

### Would-Watch → Would-Contribute Trigger (achieved): 
- ✅ CONTRIBUTING.md published
- ✅ Governance model documented
- ✅ Security policy exists
- ✅ v0.2.0 shipped with focused scope
- ✅ Test count growing meaningfully

### Would-Contribute → Would-Depend Triggers (watching for):
- Second maintainer with commit access
- v1.0.0 or credible stability commitment
- npm publication with ≥3 releases showing cadence
- Independent crypto review
- First production adopter

---

## Delta Summary

The project went from "brilliant design, zero operational maturity" to "brilliant design, emerging operational maturity." Every governance gap from my Feb 24 review was addressed within a release cycle. That responsiveness itself is a positive signal — it suggests the maintainer takes project health seriously, not just code quality.

The intellectual quality still deserves respect. The operational maturity now deserves cautious engagement. I'm upgrading from spectator to participant.
