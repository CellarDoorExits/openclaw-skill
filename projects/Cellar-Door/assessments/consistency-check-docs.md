# Documentation Consistency Check

**Date:** 2026-02-24  
**Scope:** EXIT_SPEC v1.1, ENTRY_SPEC v1.0, brand guide, ecosystem map, slogans-v2, philosophical foundations, preservation considerations, LEGAL.md, CHANGELOG-v1.1-review, multi-lens-synthesis  

---

## 1. Terminology: "Passage" vs "Transfer"

Brand guide mandates **"Passage"** everywhere. "Transfer" is retired.

| Doc | Issues |
|-----|--------|
| **ENTRY_SPEC v1.0** | ✅ Uses "Passage" consistently. §2 explicitly notes: *'Formerly "transfer" — this specification uses "Passage" exclusively.'* |
| **ENTRY_SPEC v1.0 §5.1** | ⚠️ **`TransferRecord`** — the data structure is still named `TransferRecord`, not `PassageRecord`. Fields include `transferTime`. Function is `verifyTransfer()`. The type name leaks "transfer" into code and spec. |
| **ENTRY_SPEC v1.0 §5.2** | ⚠️ `verifyTransfer()` function name uses "Transfer" |
| **ENTRY_SPEC v1.0 §21** | ⚠️ `transfer` module name in exported functions table for `verifyTransfer()` |
| **slogans-v2** | ⚠️ Multiple slogans still use "transfer": #22 "Transfer ceremonies for the agentic era", #23 "Complete transfer history", #26 "The transfer protocol", #29 "EXIT + ENTRY = TRANSFER". These are rated/evaluated candidates, not active slogans, but could confuse readers. |
| **ecosystem-map** | ✅ Uses "Passage" throughout prose. Correctly maps EXIT + ENTRY = Passage. |
| **multi-lens-synthesis §6 #8** | ⚠️ Says "Add `specVersion` field" and "TRANSITIONING state between FINAL and DEPARTED" — uses "transition" but that's a different sense (state transition, not transfer). Acceptable. |
| **EXIT_SPEC v1.1** | ✅ Mostly avoids "transfer" in the Passage sense. Uses "transfer" only in §4.4 Module D context ("transfer instruments") which is correct legal usage. |
| **brand-guide** | ⚠️ Enterprise slogan "#22 Transfer ceremonies" is listed under slogans-v2, not brand guide itself — but brand guide references "Passage Architecture" for enterprise. Consistent. |

**Severity: MEDIUM** — The `TransferRecord` / `verifyTransfer()` naming in ENTRY spec contradicts the brand guide's "Passage everywhere" mandate. Should be `PassageRecord` / `verifyPassage()`.

---

## 2. Slogan Consistency

Current slogans per brand guide: **"Right of Passage"**, **"There's always a door"**, **𓉸**

| Doc | "Right of Passage" | "There's always a door" | 𓉸 |
|-----|----|----|---|
| brand-guide | ✅ | ✅ | ✅ |
| slogans-v2 | ✅ (top pick) | ✅ (#10) | Not mentioned |
| ENTRY_SPEC v1.0 | ❌ Not referenced | ❌ | ❌ |
| EXIT_SPEC v1.1 | ❌ | ❌ | ❌ |
| ecosystem-map | ❌ | ❌ | ❌ |
| philosophical-foundations | ❌ | ❌ | ❌ |
| LEGAL.md | ❌ | ❌ | ❌ |
| multi-lens-synthesis | ❌ | ❌ | ❌ |

**Severity: LOW** — Specs and legal/assessment docs aren't expected to carry marketing slogans. The ENTRY spec closing line (*"Departure is a right. Admission is a privilege. Together they make Passage."*) is brand-aligned but uses the "downplayed" slogan rather than the primary one.

---

## 3. Package/Repo Names

| Reference | Where Used | Correct? |
|-----------|-----------|----------|
| `cellar-door-exit` | ENTRY_SPEC §1.2, §10, §21 | ✅ |
| `cellar-door-entry` | ecosystem-map §1 | ✅ |
| `@cellar-door/*` | Not explicitly referenced in any doc | ⚠️ No npm scope mentioned |
| `CellarDoorExits` (GitHub org) | Not referenced in any doc reviewed | ⚠️ No GitHub org mentioned |

**Severity: LOW** — Package names are consistent where used. GitHub org and npm scope aren't mentioned in these docs (may be in README or package.json).

---

## 4. Spec Cross-References

| Reference | In Doc | Target | Correct? |
|-----------|--------|--------|----------|
| "EXIT_SPEC v1.1" | ENTRY_SPEC header | EXIT_SPEC_v1.1.md | ✅ |
| `../cellar-door-exit/specs/EXIT_SPEC_v1.1.md` | ENTRY_SPEC §References | Actual path | ✅ Matches actual file location |
| LEGAL.md version "1.1-draft" | LEGAL.md header | EXIT_SPEC v1.1 | ✅ |
| CHANGELOG references `specs/EXIT_SPEC_v1.1.md` | CHANGELOG | ✅ |

**Severity: NONE** — Cross-references are correct.

---

## 5. Entity Names

| Name | Expected Context | Found |
|------|-----------------|-------|
| "Fool-Hardy Designs" | Not found in any reviewed doc | ❌ Absent — may be in other files |
| "Warren Koch, EXIT Protocol Project" | Not found in any reviewed doc | ❌ Absent |
| "Cellar Door Contributors" | EXIT_SPEC v1.1 Authors, ENTRY_SPEC v1.0 Authors | ✅ Correct for spec context |
| "Warren" | brand-guide ("Approved by Warren") | ✅ Informal, appropriate for internal doc |

**Severity: LOW** — Entity names aren't present in these docs. "Cellar Door Contributors" is used as author attribution, which is appropriate for open-source specs.

---

## 6. HOLOS Primitive Names

Brand guide doesn't address HOLOS naming, but ecosystem-map defines the canonical names.

| Old Name | Correct Name | ecosystem-map | Other Docs |
|----------|-------------|---------------|------------|
| Insurance | **PLEDGE** | ✅ §2.8 uses "PLEDGE", notes `Former name: Insurance` | ✅ No "Insurance" as primary |
| Signamancy | **REPUTE** | ✅ §2.9 uses "REPUTE", notes `Former name: Signamancy` | ⚠️ ecosystem-map §2.2 still discusses "Signamancy rule engine" as a separate project name — this is intentional per naming resolution |
| LINE | **LINEAGE** | ✅ §2.10 uses "LINEAGE", notes `Former name: LINE` | ✅ |

**Severity: NONE** — HOLOS primitives use correct names. The "Signamancy" reference in §2.2 is correctly scoped to the rule engine project, not the reputation primitive.

---

## 7. Numbers

| Claim | Where | Matches? |
|-------|-------|----------|
| 275 tests in EXIT | CHANGELOG-v1.1-review: "all 275 tests passing" | ✅ Stated; cannot verify without running tests |
| 77 tests in ENTRY | Not mentioned in any reviewed doc | ⚠️ Not found in these docs |
| ~300 bytes marker size | EXIT_SPEC v1.1 §1: "approximately 300–500 bytes" | ⚠️ ecosystem-map §6 notes "Comms say ~300 bytes; actual is 442-586 bytes (core)" — EXIT spec says "300–500" which partially overlaps but the lower bound is below measured reality |
| 7 ceremony states | EXIT_SPEC §5.1, ecosystem-map §2.2 | ✅ Consistent (alive, intent, snapshot, open, contested, final, departed) |
| 3 ceremony paths | EXIT_SPEC §5.2, ecosystem-map §2.2 | ✅ Consistent (cooperative, unilateral, emergency) |
| 6 optional modules (A–F) | EXIT_SPEC §4, ecosystem-map §1 | ✅ |
| 1 MB max marker size | ENTRY_SPEC §13.1: "1,048,576 bytes (1 MB)" | ✅ (ENTRY only; EXIT spec doesn't specify a max) |

**Severity: LOW** — The marker byte size discrepancy is already documented in ecosystem-map known issues. The 77 ENTRY tests claim isn't in these docs.

---

## 8. Domain References

| Domain/URL | Where | Correct? |
|------------|-------|----------|
| `cellar-door.org/exit/v1` | EXIT_SPEC §3.1 `@context` | ⚠️ Uses `.org` |
| `cellar-door.dev/entry/v1` | ENTRY_SPEC §3.1 `@context` | ⚠️ Uses `.dev` |
| `cellar-door.org/exit/v1` | preservation-considerations §2 | Uses `.org` |
| `cellar-door.dev` | Not explicitly referenced as the main domain | — |

**Severity: HIGH** — **Domain mismatch between specs!** EXIT spec uses `cellar-door.org` for its `@context` URL; ENTRY spec uses `cellar-door.dev`. These MUST be consistent. Pick one domain and use it everywhere. The brand guide doesn't specify which domain is canonical.

---

## 9. Legal Consistency

### Safe Harbor ↔ Philosophical Foundations

| LEGAL.md §15 Claim | Philosophical Foundations Support |
|--------------------|---------------------------------|
| Good-faith attestation protection (§15.1) | ✅ §3 "Self-Attestation as Epistemic Commitment" — consistent; both treat attestation as honest but limited |
| Evidence requirements for disputed status (§15.2) | ✅ §2 "Functional Right to Departure" — departure is functional, disputes don't block it |
| Protocol operator safe harbor (§15.3) | ✅ §1 "Ontological Agnosticism" — protocol is neutral infrastructure |

### Ecosystem Map Liability Boundaries ↔ LEGAL.md

| ecosystem-map Boundary | LEGAL.md Alignment |
|------------------------|-------------------|
| "Cellar Door attests to the crossing event, not to the personhood of what crossed" (§2.1) | ✅ LEGAL §2: "EXIT markers are factual records" |
| "Does NOT own: content truth, identity validity" (§4) | ✅ LEGAL §3: self-attested status carries no warranty |
| PLEDGE absorbs economic risk, not Cellar Door (§2.8) | ✅ LEGAL §4: Module D manifests are declarations, not instruments; §6 prohibits use as financial instruments |
| "Defamation risk sits with whoever issues the reputation claim, not with the transport layer" (§2.9) | ✅ LEGAL §15.1: good-faith attestation protection for originStatus |
| SHROUD absorbs privacy-regulatory surface (§3.1) | ⚠️ LEGAL §7 addresses GDPR directly — slight overlap, but LEGAL.md addresses current obligations while SHROUD is future |

**Severity: NONE** — Legal and philosophical docs are well-aligned.

---

## 10. New Additions from Today (v1.1 Review Changes)

Per CHANGELOG-v1.1-review.md, these were added on 2026-02-24:

| Addition | In EXIT_SPEC v1.1? | In ENTRY_SPEC v1.0? | In Other Docs? |
|----------|--------------------|--------------------|----------------|
| `specVersion` field | ❌ **NOT in EXIT_SPEC** — CHANGELOG says it was added to types.ts/marker.ts/validate.ts but the spec text doesn't mention it | ❌ Not in ENTRY_SPEC | ⚠️ multi-lens-synthesis §6 #6 recommended it |
| New exitTypes (`platform_shutdown`, `directed`, `constructive`, `acquisition`) | ❌ **NOT in EXIT_SPEC §3.6** — spec still lists only 4 types (voluntary, forced, emergency, keyCompromise) | ENTRY_SPEC §4.1 references `allowedExitTypes: ["voluntary"]` — doesn't list new types | CHANGELOG confirms code has them |
| Dispute fields (`disputeExpiry`, `resolution`, `arbiterDid`) | ❌ **NOT in EXIT_SPEC Module C (§4.3)** | ❌ Not in ENTRY_SPEC | CHANGELOG confirms types.ts has them |
| `completenessAttestation` | ❌ **NOT in EXIT_SPEC** | ❌ Not in ENTRY_SPEC | CHANGELOG confirms types.ts has it |
| `PlatformCompromiseDeclaration` | ❌ **NOT in EXIT_SPEC** | ❌ | CHANGELOG confirms code has it |
| `BatchShutdownCeremony` | ❌ **NOT in EXIT_SPEC** | ❌ | CHANGELOG confirms code has it |
| Philosophical foundations doc | N/A (separate doc) | ❌ Not referenced | ✅ Exists as standalone |
| Preservation considerations doc | N/A (separate doc) | ❌ Not referenced | ✅ Exists as standalone |
| Safe harbor §15 | ✅ In LEGAL.md | ❌ Not referenced | ✅ |
| Transition period section | ✅ In EXIT_SPEC (appended at end) | ✅ ENTRY_SPEC §5.4 covers transition period | ✅ Consistent |

**Severity: HIGH** — The EXIT_SPEC v1.1 document is **out of sync with the codebase**. Six features were added to the TypeScript implementation but NOT reflected in the spec text:
1. `specVersion` field
2. Four new `exitType` values
3. Three new `Dispute` interface fields
4. `CompletenessAttestation` type
5. `PlatformCompromiseDeclaration`
6. `BatchShutdownCeremony`

The spec needs updating to match the code.

---

## Summary

| # | Check | Severity | Action Needed |
|---|-------|----------|---------------|
| 1 | "Transfer" in code names | **MEDIUM** | Rename `TransferRecord` → `PassageRecord`, `verifyTransfer()` → `verifyPassage()` in ENTRY spec |
| 2 | Slogan presence | LOW | No action — specs don't need slogans |
| 3 | Package names | LOW | Consider documenting npm scope and GitHub org in specs |
| 4 | Cross-references | NONE | ✅ All correct |
| 5 | Entity names | LOW | Decide if "Fool-Hardy Designs" should appear anywhere |
| 6 | HOLOS primitives | NONE | ✅ All using correct names |
| 7 | Numbers | LOW | Reconcile marker byte size claims |
| 8 | **Domain mismatch** | **HIGH** | EXIT uses `cellar-door.org`, ENTRY uses `cellar-door.dev` — pick one |
| 9 | Legal consistency | NONE | ✅ Well-aligned |
| 10 | **Spec ↔ Code drift** | **HIGH** | EXIT_SPEC v1.1 missing 6 features that are in the codebase |

### Top 3 Actions

1. **🔴 Fix domain inconsistency** — `cellar-door.org` vs `cellar-door.dev` in `@context` URLs between EXIT and ENTRY specs
2. **🔴 Update EXIT_SPEC v1.1** — Add `specVersion`, new exitTypes, dispute fields, completeness attestation, platform compromise, batch shutdown to the spec document
3. **🟡 Rename Transfer → Passage** — `TransferRecord`, `verifyTransfer()`, `transferTime` in ENTRY spec should use "Passage" per brand guide
