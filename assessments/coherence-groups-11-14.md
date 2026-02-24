# Coherence Check: Groups 11–14

**Date:** 2026-02-24  
**Scope:** cellar-door-exit docs/config, papers/pitches, analysis, project-level docs  
**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | ℹ️ Info

---

## Summary (~500 words)

This coherence check evaluated the EXIT spec v1.1, papers v3–v5, NIST RFI v2, brand guide, style guide, slogans, ecosystem map, LEGAL.md, SECURITY.md, DECISIONS.md, JSON-LD schema, and cellar-door-exit/docs against ten consistency criteria.

**Domain inconsistency is the most pervasive issue.** The spec v1.1 and JSON-LD schema correctly use `cellar-door.dev`, but DECISIONS.md (D-001) still references `cellar-door.org/exit/v1`, and both paper v3 and v4 use `cellar-door.org` in their code examples. Paper v5 correctly uses `cellar-door.dev`. The NIST RFI v2 avoids inline context URIs, sidestepping the issue. Several cellar-door-exit/docs/analysis files also retain `.org` references.

**Test counts and package counts are consistent across current documents** but diverge from superseded ones as expected. The spec v1.1 footer says "279 tests. 5 packages." Paper v5 says "356 passing tests" (279 EXIT + 77 ENTRY) and "five npm packages across six GitHub repositories." The NIST RFI v2 matches: "356 tests," "five npm packages." Paper v4 says "205 tests" and "nine specification test vectors" — correct for its era but now superseded. Paper v3 says "153 tests" and "~586 bytes signed" — also correct for its era.

**Marker byte sizes show a discrepancy.** Spec v1.1 §1 says "approximately 300–500 bytes in its core form." README says "~335 bytes (unsigned)." Paper v5 says "~335 bytes unsigned, ~596 bytes signed." Paper v4 agrees: "~335 unsigned, ~596 signed." Paper v3 says "~586 bytes signed" and "442 bytes" unsigned — a different unsigned figure. The ecosystem map says "442-586 bytes (core)" and flags this as a known issue. The README says "~335 bytes" for unsigned. The 335 vs 442 discrepancy for unsigned markers exists between v3 and v4/v5; this may reflect actual schema changes between versions but v3 is not flagged as superseded.

**Brand compliance is mostly good.** "Passage" terminology is used correctly in spec v1.1, paper v5, NIST RFI v2, brand guide, and slogans v2. The 𓉸 symbol appears correctly. However, the ecosystem map §1 still uses "Module B (Reputation Receipt)" and "Module C (Origin Attestation)" and "Module D (Economic Settlement)" and "Module E (Cross-Domain Anchoring)" and "Module F (Dispute Record)" — which don't match the spec's module names (B: State Snapshot, C: Dispute Bundle, D: Economic, E: Metadata, F: Cross-Domain Anchoring). This is a significant naming mismatch. The slogans v2 file uses "Transfer" in items #22 and #29 ("Transfer ceremonies," "EXIT + ENTRY = TRANSFER") which conflicts with the brand guide's "Transfer → Passage" rule. The ecosystem map itself uses "Transfer" in some human-lens descriptions and the "liability map summary" text.

**Superseded docs:** Paper v3 has no supersession header. Paper v4 has no supersession header. Paper v5 correctly says "Supersedes" would be implicit by version, but neither v3 nor v4 contains a "superseded by v5" notice. The style guide recommends `DataIntegrityProof` but the spec and all papers use `Ed25519Signature2020` — acknowledged as a known future migration.

**GitHub org is consistent** (`CellarDoorExits`) across integration READMEs and package.json files. Papers don't mention the org name directly. NIST RFI says "six public GitHub repositories" without naming the org.

**Standards references are consistent** across paper v5 and NIST RFI v2 — both cite IEEE P2247, P3119, FIPA, ISO/IEC 42001, ISO/IEC 23894, NIST AI 100-1, AI 600-1. Paper v4 cites fewer (no FIPA, no IEEE, no ISO). Paper v3 cites the fewest.

---

## Detailed Findings

### 1. Spec v1.1 ↔ Paper v5 ↔ NIST RFI v2 Consistency

| Item | Spec v1.1 | Paper v5 | NIST RFI v2 | Status |
|------|-----------|----------|-------------|--------|
| ExitTypes count | 8 | 8 | Not enumerated (says "eight exit types") | ✅ |
| ExitType values | voluntary, forced, emergency, keyCompromise, platform_shutdown, directed, constructive, acquisition | Same | Not listed individually | ✅ |
| Mandatory fields | 8 + proof | 8 + proof | "7 mandatory fields" | 🟡 F-01 |
| Status values | good_standing, disputed, unverified | Same | Not listed | ✅ |
| Test count | "279 tests" (spec footer) | "356 passing tests" (279+77) | "356 tests" | ✅ |
| Package count | "5 packages" (spec footer) | "five npm packages across six GitHub repositories" | "five npm packages" | ✅ |
| Context URI | `cellar-door.dev/exit/v1` | `cellar-door.dev/exit/v1` | Not shown inline | ✅ |
| Byte sizes | "300–500 bytes" (intro), 335 unsigned implied | "~335 unsigned, ~596 signed" | "300–500 bytes" | ✅ |
| Ceremony states | 7 | 7 | 7 | ✅ |
| Confidence scoring formula | Additive, spec §7.4 | Matches exactly | Not detailed | ✅ |
| Tenure formula | `log₂(days+1)/log₂(731)` | Matches | Not detailed | ✅ |
| Spec version field | `specVersion: "1.1"` mandatory | Mentioned | Not mentioned | ✅ |

**F-01** 🟡 **Medium — NIST RFI says "7 mandatory fields" but spec v1.1 has 8 mandatory fields** (added `specVersion` in v1.1). The NIST RFI §3 says "7 mandatory fields" and "Minimal by default. The core schema is 7 mandatory fields." The README also says "7 Fields" in its schema table (doesn't include `specVersion`). The spec §3.1 lists 8 numbered fields. This is a counting inconsistency — `specVersion` was added in v1.1 and the NIST RFI and README weren't updated.

### 2. Brand Guide Compliance

**F-02** 🟡 **Medium — Slogans v2 uses "Transfer" in violation of brand guide.** Items #22 ("Transfer ceremonies for the agentic era"), #23 ("Complete transfer history"), #26 ("The transfer protocol"), #29 ("EXIT + ENTRY = TRANSFER") all use "Transfer" which the brand guide explicitly retires in favor of "Passage."

**F-03** 🟠 **High — Ecosystem map uses wrong module names.** The ecosystem map §1 and §2 uses alternative module names that don't match the spec:
- "Module B (Reputation Receipt)" → Spec: "Module B: State Snapshot Reference"
- "Module C (Origin Attestation)" → Spec: "Module C: Dispute Bundle"  
- "Module D (Economic Settlement)" → Spec: "Module D: Economic"
- "Module E (Cross-Domain Anchoring)" → Spec: "Module E: Metadata / Narrative"
- "Module F (Dispute Record)" → Spec: "Module F: Cross-Domain Anchoring"

Modules C/E/F are completely swapped. This will confuse anyone reading both documents.

**F-04** 🟢 **Low — Ecosystem map uses "Transfer" in several places.** Human-lens descriptions say "account migration," "transfer history," etc. The liability map text is pre-rebrand.

**F-05** ✅ **𓉸 usage is correct** across spec, paper v5, NIST RFI, brand guide, slogans.

### 3. Domain Consistency

**F-06** 🟠 **High — DECISIONS.md D-001 uses `cellar-door.org`.** "The core schema is self-contained JSON-LD at `https://cellar-door.org/exit/v1`." This is the authoritative decisions log and should use `.dev`.

**F-07** 🟡 **Medium — Paper v3 and v4 use `cellar-door.org` in code examples.** Both show `"@context": "https://cellar-door.org/exit/v1"` in their JSON examples. These are superseded papers but are still in the repo without correction.

**F-08** 🟡 **Medium — Multiple analysis docs in cellar-door-exit/docs/analysis/ use `.org`.** Files: cellar-door-project-plan.md, cellar-door-legal-redteam-v2.md, cellar-door-gastown-notes.md, cellar-door-master-assessment.md.

**F-09** 🟡 **Medium — preservation-considerations.md uses `.org`.** This is a cellar-door-exit/docs file.

**F-10** ✅ **Spec v1.1 correctly uses `cellar-door.dev` throughout.**

**F-11** ✅ **JSON-LD schema correctly uses `cellar-door.dev`.**

**F-12** ✅ **Paper v5 correctly uses `cellar-door.dev`.**

**F-13** ✅ **NIST RFI v2 avoids inline context URIs.**

### 4. Superseded Docs Flagged

**F-14** 🟠 **High — Paper v3 has no supersession notice.** No header indicating it's superseded by v4 or v5.

**F-15** 🟠 **High — Paper v4 has no supersession notice.** No header indicating it's superseded by v5. The header still says "This paper describes EXIT Protocol Specification v1.1" — same as v5, which is confusing.

**F-16** ✅ **Spec v1.1 correctly says "Supersedes: EXIT_SPEC_v1.0-draft".**

**F-17** 🟡 **Medium — cellar-door-exit/docs/ contains EXIT_PAPER_DRAFT.md and NIST_RFI_DRAFT.md** — unclear if these are superseded by the docs/papers/ versions. No supersession headers.

### 5. GitHub Org Name Consistency

**F-18** ✅ **Consistent.** Integration READMEs and package.json files all use `CellarDoorExits`. Papers and NIST RFI don't mention the org by name (say "six GitHub repositories" generically). No conflicting org names in the reviewed document set.

### 6. Test Counts, Byte Sizes, Package Counts

**F-19** 🟡 **Medium — Unsigned marker size: 335 vs 442 bytes.** Paper v3 says "442 bytes" unsigned. Papers v4 and v5 say "~335 bytes." README says "~335 bytes." This discrepancy is likely due to schema changes between versions but isn't documented.

**F-20** 🟡 **Medium — Paper v3 abstract says "~586 bytes signed" but body says "442 bytes" unsigned and "586 bytes" signed.** Paper v4 abstract says "~596 bytes signed" but body (§8.2) says "586 bytes" signed. Paper v5 consistently says "~596 bytes signed."  The 586 vs 596 discrepancy between v3/v4-body and v4-abstract/v5 is unexplained.

**F-21** ✅ **Test vector counts are consistent within each paper version.** v3: 9 vectors (matches body). v4: 9 vectors (matches body). v5: 11 vectors (matches spec v1.1 §17).

### 7. Legal Docs Align with Current Spec

**F-22** ✅ **LEGAL.md aligns well with spec v1.1.** References D-006, selfAttested, legalHold, Module C originStatus, Module D — all consistent with current spec.

**F-23** ✅ **SECURITY.md aligns with spec v1.1.** References 4 exit types (original set) but doesn't mention the 4 new v1.1 types. Functionally fine since the security concerns are additive.

**F-24** 🟢 **Low — SECURITY.md §3.6 exit types only lists 3** (voluntary/forced/emergency) in the visual hash style profiles. Doesn't mention keyCompromise or the 4 new v1.1 types. Not a correctness issue since it's about visual rendering defaults.

### 8. Paper v5 vs v4 — Proper Supersession

**F-25** 🟡 **Medium — Paper v5 doesn't explicitly state it supersedes v4.** The title changed from "EXIT: A Protocol for Verifiable Agent Departure Ceremonies" (v4) to "The Passage Protocol: Verifiable Agent Departure and Arrival Ceremonies" (v5). v5 adds ENTRY protocol (§4), expands to 356 tests from 205, adds Passage/PoP framing, adds TSA/git-ledger/checkpoint coverage, adds multi-lens validation (§9). Content clearly supersedes v4 but no explicit "Supersedes" header.

**F-26** ✅ **v5 properly incorporates v4 content.** All v4 sections are present in v5 with updates. v4's "9 test vectors" → v5's "11 test vectors." v4's "205 tests" → v5's "356 tests." New sections on ENTRY, TSA, git ledger, checkpoints, multi-lens validation.

### 9. NIST RFI References Actual Current State

**F-27** ✅ **NIST RFI v2 accurately reflects current implementation.** 356 tests, 5 packages, 6 repos, framework integrations (LangChain, Vercel AI SDK, MCP), trust mechanisms, safety guardrails — all match.

**F-28** 🟡 **Medium — NIST RFI v2 §3.1 says "7 mandatory fields"** — should be 8 per spec v1.1 (see F-01).

### 10. Standards References Consistency

**F-29** ✅ **Paper v5 and NIST RFI v2 use consistent standards references.** Both cite: W3C DID Core, W3C VC 2.0, JSON-LD 1.1, RFC 2119, RFC 3161, KERI, FIPA, IEEE P2247, IEEE P3119, ISO/IEC 42001, ISO/IEC 23894, NIST AI 100-1, NIST AI 600-1.

**F-30** 🟢 **Low — Paper v4 cites fewer standards** (no FIPA, no IEEE, no ISO). This is expected since v4 pre-dates the multi-lens validation that identified these connections.

**F-31** 🟢 **Low — FIPA is described differently.** Paper v5 says "FIPA, now absorbed into IEEE." NIST RFI doesn't qualify the absorption. Both are acceptable but could be more consistent.

---

## Findings Summary Table

| ID | Severity | Finding |
|----|----------|---------|
| F-01 | 🟡 Medium | NIST RFI + README say "7 fields" but spec v1.1 has 8 (added specVersion) |
| F-02 | 🟡 Medium | Slogans v2 uses retired "Transfer" term in 4 entries |
| F-03 | 🟠 High | Ecosystem map uses completely wrong module names (B–F all misnamed) |
| F-04 | 🟢 Low | Ecosystem map uses "Transfer" in human-lens descriptions |
| F-06 | 🟠 High | DECISIONS.md D-001 still uses `cellar-door.org` |
| F-07 | 🟡 Medium | Papers v3/v4 use `cellar-door.org` in code examples |
| F-08 | 🟡 Medium | Multiple analysis docs use `.org` |
| F-09 | 🟡 Medium | preservation-considerations.md uses `.org` |
| F-14 | 🟠 High | Paper v3 has no supersession notice |
| F-15 | 🟠 High | Paper v4 has no supersession notice |
| F-17 | 🟡 Medium | cellar-door-exit/docs/ has draft papers without supersession status |
| F-19 | 🟡 Medium | Unsigned marker size: 335 vs 442 bytes across versions |
| F-20 | 🟡 Medium | Signed marker size: 586 vs 596 bytes across paper versions |
| F-25 | 🟡 Medium | Paper v5 lacks explicit "Supersedes v4" header |
| F-28 | 🟡 Medium | NIST RFI says "7 mandatory fields" (should be 8) |

**Totals:** 0 Critical, 4 High, 9 Medium, 3 Low, 0 Info
