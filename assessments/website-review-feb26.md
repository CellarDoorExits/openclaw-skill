# Website Review: cellar-door.dev — Feb 26, 2026

## Summary

The site is strong. The six-mode concept is genuinely clever and the Cynic default is the right call for HN. Below are specific issues organized by priority.

---

## 1. Content That Should Change

### Cynic Mode (Default Landing — Most Critical)

**Issue: Opening header is good but the slogan feels generic.**
- Current: `"You don't build the fire station after the fire."`
- The Show HN drafts use sharper language. Consider something more aligned with the cynical brand voice.

**Issue: "3 Core Primitives" stat card in Pragmatist is misleading.**
- The "3" refers to NAMES/MANTLES/EXIT, but only EXIT is built. Showing "3 core primitives" as a stat implies they're all available. This will get called out on HN.
- **Suggestion:** Replace with something real — e.g., `6 deps` or `410 tests` or `0.47ms sign`.

**Issue: The "∞ Offline Verifiable" stat card is marketing-speak.**
- HN will mock this. ∞ is not a number. "Offline Verifiable" is a boolean property, not a metric.
- **Suggestion:** Replace with actual perf data: `0.47ms` / `Sign Time` or `1.9ms` / `Verify Time`.

**Issue: Bureaucrat seal says "Process Infrastructure for Agent Sovereignty".**
- "Agent sovereignty" is loaded language that invites the "agents don't have rights" debate prematurely.
- **Suggestion:** `Process Infrastructure for Agent Accountability` — consistent with the Cynic framing.

### Agent Mode

**Issue: `cellardoor.network` reference at the bottom.**
- `EXIT.protocol v0.1 · Cellar Door · cellardoor.network`
- Is `cellardoor.network` a real domain? The rest of the site uses `cellar-door.dev`. Inconsistency will look sloppy.
- **Fix:** Use `cellar-door.dev` consistently.

**Issue: `verify` import is used but not imported.**
- The code example calls `verify(marker)` but only imports `quickExit, checkpoint, toJSON`. Should import `quickVerify` (matching Pragmatist's example) or `verify`.

### Pragmatist Mode

**Issue: `secp256k1` mentioned in Bureaucrat verification section but the rest of the site says Ed25519 + P-256.**
- Bureaucrat §5 says: "Standard cryptographic libraries (Ed25519 or secp256k1)"
- Everywhere else: Ed25519 + P-256
- **Fix:** Change `secp256k1` to `P-256 (secp256r1)` in the Bureaucrat section. secp256k1 is Bitcoin's curve; P-256 is FIPS. These are different curves. This will get caught on HN.

---

## 2. Branding Consistency Issues

| Element | Location | Issue |
|---|---|---|
| Domain | Agent footer | `cellardoor.network` vs `cellar-door.dev` |
| Tagline | Pragmatist header | Missing "There's always a door" / "Right of Passage" — just says "Exit Architecture" |
| Tagline | Bureaucrat header | Says "The Right to Exit · Exit Architecture" — mixes brand phrases |
| Slogan | Cynic | Uses fire station metaphor — not from the brand vocabulary |
| "Right of Passage" | Nowhere on site | The core brand phrase doesn't appear anywhere! |
| #WhereIsTheDoor | Nowhere on site | The hashtag/campaign phrase is absent |

**The "Right of Passage" brand phrase should appear at least once — the Idealist or Poet mode would be natural homes.** The Cynic mode intentionally strips poetry, so its absence there is fine.

The persistent footer ("There's always a door.") is good — that's the one piece of brand consistency that works across all modes.

---

## 3. Things That Will Hurt on HN

1. **"∞ Offline Verifiable"** — Will be screenshot-mocked. Replace with real numbers.

2. **"3 Core Primitives" when only 1 exists** — HN commenters will check. "You built 1/3 of your own architecture" is a predictable dunk.

3. **"Agent Sovereignty" language** — The Show HN drafts deliberately avoid this framing, using "accountability" instead. The site should match.

4. **"Departure Ceremony" in Idealist** — The word "ceremony" will trigger "this is a cult" jokes. The Show HN draft uses "receipt" and "certificate." Keep "ceremony" in Idealist (its audience accepts it) but make sure the Cynic/Pragmatist modes never use it. ✅ Currently fine — Cynic says "signed receipt."

5. **"Constitutional layer" / "constitutional primitives"** — Used in Idealist, Pragmatist, Bureaucrat, and Agent modes. The word "constitutional" implies governance/rights in a way that's premature for a zero-user protocol. On HN, "constitutional" + "zero users" = hubris.
   - **Suggestion for Pragmatist/Cynic:** Just say "foundational primitives" or "core primitives."

6. **No performance benchmarks** — The Show HN drafts mention 410 tests, but the site never shows sign/verify performance (0.47ms / 1.9ms). HN engineers care about this. Add it to Pragmatist and Agent modes.

7. **The Idealist mode's historical analogies** — Letters of Manumission, Underground Railroad, Nansen Passports, Right of Asylum. These are powerful but risky. Some HN readers will see "comparing your npm package to the Underground Railroad" as offensive. The analogies are well-constructed and defensible, but be aware this is a lightning rod.

8. **No link to GitHub/source** — HN readers want to see code immediately. The npm package name is mentioned (`cellar-door-exit`) but there's no GitHub link anywhere on the site. **Add a prominent GitHub link** to at least Pragmatist, Cynic, and Agent modes.

---

## 4. Missing Content That Would Strengthen the Pitch

1. **GitHub link** — Critical. Must add.

2. **Performance stats** — 0.47ms sign, 1.9ms verify. Add to Pragmatist stat cards (replace ∞ and 3).

3. **Test count** — "410 tests" appears in Show HN drafts but not on the site. Add to Pragmatist or Cynic.

4. **Dependency count** — "6 dependencies" is a flex. Show it. HN loves minimal dependency counts.

5. **Actual marker example** — Show a real JSON-LD marker in Pragmatist/Agent mode. The code examples show API calls but never show what the output looks like. "Show don't tell."

6. **License clarity on the page** — Apache 2.0 is mentioned in drafts but not visible on the site. Add it.

7. **Anti-securitization mention** — This is one of the most interesting design decisions (per the mock HN comments). It doesn't appear on the website at all. At minimum, mention it in Cynic mode's "Honest Limitations" section or Pragmatist mode.

8. **Crypto-shredding / GDPR** — Featured prominently in drafts but barely on the site. The Bureaucrat mode mentions GDPR alignment but doesn't explain the ephemeral-key crypto-shredding mechanism. This is the "real gem" per the mock comments. Surface it.

---

## 5. Mode-Specific Issues

### Poet ✅ 
Works well. Atmospheric, brief, links to Pragmatist for details. No issues.

### Idealist ⚠️
- HOLOS Vision section confirmed removed ✅
- Still references "constitutional layer for agent sovereignty" — consider softening
- The historical analogies are powerful but risky (see §3.7)
- "What Cellar Door Builds" section is good — clearly separates protocol from vendor

### Pragmatist ⚠️
- Missing perf benchmarks, GitHub link, real marker example
- "3 Core Primitives" and "∞" stat cards need replacing
- Code examples are clean and correct
- Selective Disclosure section honestly marked as planned — good

### Bureaucrat ✅
- Strong. Exactly what a regulator/compliance person needs
- secp256k1 error needs fixing (see §1)
- Good links to paper and demo at the bottom
- "Agent Sovereignty" in seal should change to "Agent Accountability"

### Cynic ✅✅
- Best mode. Perfect for HN landing.
- "Big Tech Wins By Default" card is excellent — this is the killer argument
- "Honest Limitations" section is the site's strongest asset
- "I'll just never let my agents leave" response is devastating
- Only issues: missing GitHub link, missing perf stats, fire-station slogan is generic

### Agent ✅
- Clean, appropriate tone for the audience
- `cellardoor.network` domain inconsistency
- Missing `verify` import in code example
- Good structure — schema table, code, operational notes

---

## 6. Technical Accuracy Check

| Claim | Status | Notes |
|---|---|---|
| ~335B marker size | ⚠️ | Pragmatist says "~335 bytes", Bureaucrat says "~335–660 bytes". Pick one or clarify that 335 is base, 660 with extensions. |
| Ed25519 + P-256 | ✅ | Consistent across modes (except Bureaucrat secp256k1 error) |
| JSON-LD format | ✅ | Consistent |
| W3C VC conformance | ⚠️ | Claimed in Agent mode ("signed W3C Verifiable Credential"). If true, good. If loosely true, HN will check. |
| 8 exit types | ✅ | Consistent list across all modes |
| Offline verification | ✅ | Consistent, well-explained |
| Non-custodial | ✅ | Consistent |
| Service-attested timestamps | ✅ | Well-explained in multiple modes |
| DID-based identity | ✅ | Consistent |
| Checkpoint support | ✅ | Well-documented |

**secp256k1 vs P-256 (secp256r1):** This is a real error. secp256k1 is the Bitcoin/Ethereum curve. P-256 (secp256r1) is the NIST/FIPS curve. The Show HN drafts say "P-256 (FIPS-compliant)" which is correct. The Bureaucrat mode says "secp256k1" which is wrong. Fix this — a security engineer on HN will catch it immediately.

**Marker size inconsistency:** ~335B vs ~335-660B. The Pragmatist and Cynic modes say ~335B. The Bureaucrat says ~335-660B. Either clarify that 335 is the base marker and 660 includes extension modules, or pick one number.

---

## 7. HOLOS References

**Searched the entire HTML file for "HOLOS", "holos", "Holos":** 

✅ **No HOLOS references found.** The removal is clean.

The Idealist mode previously had a "HOLOS Vision" section — it's gone. The "Architecture" sections in various modes reference NAMES/MANTLES/EXIT but never HOLOS. Clean.

---

## Priority Actions (Ranked)

1. **Fix secp256k1 → P-256** in Bureaucrat §5 (technical error, will be caught)
2. **Replace "∞" and "3" stat cards** in Pragmatist with real numbers (0.47ms sign, 1.9ms verify, 410 tests, 6 deps)
3. **Add GitHub link** to Pragmatist, Cynic, and Agent modes
4. **Fix `cellardoor.network` → `cellar-door.dev`** in Agent footer
5. **Fix `verify` import** in Agent code example
6. **Add Apache 2.0 license** visibility somewhere prominent
7. **Add anti-securitization and crypto-shredding** mentions to Cynic or Pragmatist
8. **Soften "constitutional" and "sovereignty"** language in non-Idealist modes
9. **Clarify marker size** inconsistency (335 vs 335-660)
10. **Add "Right of Passage"** brand phrase to at least one mode

---

*Review completed 2026-02-26T04:05Z*
