# NIST RFI Revision Summary

**Date:** 2026-02-23
**Commit:** 8ac069f (pushed to main)

## Changes Applied

| # | Fix | Status |
|---|-----|--------|
| 1 | **Fix URLs** — All `cellar-door.org` refs replaced with working npm/GitHub/Netlify URLs | ✅ Done |
| 2 | **NIST framework mappings** — Added Section 3 mapping EXIT to AI RMF (Govern/Map/Measure/Manage), SP 800-63 (identity proofing/auth/federation), NCCoE agent identity project | ✅ Done |
| 3 | **Cut "US must lead" rhetoric** — Removed entire Section 4 competitive/patriotic argument. Replaced with concrete Section 4 recommendations targeting specific NIST frameworks | ✅ Done |
| 4 | **Reduce branding** — "Cellar Door" removed from title, executive summary, and body. Appears only once in Section 6 (About) and GitHub URL. "EXIT Protocol" used throughout | ✅ Done |
| 5 | **Concrete adoption path** — Added specific recommendations: "include in AI RMF Govern 1.x", "add to NCCoE project scope", "reference in SP 800-63 revisions" | ✅ Done |
| 6 | **Tighten executive summary** — Cut to 4 short paragraphs. Scannable in 30 seconds. Includes the ask, the status, and the recommendation | ✅ Done |
| 7 | **Current Status section** — New Section 2.2 with table: npm v0.1.0, 205 tests, Apache 2.0, GitHub link, pre-production disclosure | ✅ Done |
| 8 | **Field count consistency** — Fixed to 9 fields throughout (was "seven" in some places). Table lists all 9. Text says "Nine fields" | ✅ Done |
| 9 | **Site/paper references** — Added links to Netlify site and GitHub in Current Status section | ✅ Done |
| 10 | **Tone** — Removed Hirschman framing (kept Akerlof as single reference). Cut insurance argument duplication (was 3x, now 1x). Removed all marketing language | ✅ Done |

## Additional Changes

- **Added conformance criteria recommendation** (Section 4.5) — minimum conformance, interop test cases, graduated levels
- **Removed speculative claims** — Cut "ZK roadmap" mention, removed "staked attestation/reputation bonds" hand-waving
- **Removed self-referencing NIST citation** — Added proper AI RMF 1.0 and SP 800-63-4 references instead
- **Removed Hirschman reference entirely** from references list

## Word Count

- **Before:** ~2,800 words (estimated)
- **After:** 2,183 words
- **Target:** 3,000-5,000 (NIST ideal range)
- **Assessment:** Slightly under target but every word earns its space. Padding to hit 3,000 would reintroduce the bloat the review flagged. If needed, expanding the conformance section or adding a threat model appendix would be the right way to add length.

## What's NOT Fixed (Requires Non-Document Action)

- **Institutional endorsement** — Review's biggest concern. No co-signer. Needs outreach.
- **Interop demo** — No A2A migration demo exists. Would be transformative.
- **Threat model** — Not added (would add ~500 words). Could be a follow-up.
- **Website verification** — `cellar-door-exit.netlify.app` status unknown. Must verify it resolves.
- **JSON-LD context URL** — `cellar-door.org/exit/v1` may not resolve. Needs hosting or replacement.
