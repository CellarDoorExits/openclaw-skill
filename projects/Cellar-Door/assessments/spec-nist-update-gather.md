# Spec & NIST RFI Update — Gather Document

**Date:** 2026-02-24  
**Purpose:** Comprehensive gap analysis for write agents to update EXIT_SPEC v1.1, ENTRY_SPEC v1.0, and create NIST RFI draft  
**Sources:** All codebase, specs, assessments, and brand guide

---

## 0. NIST RFI Document Status

**The file `docs/papers/NIST_RFI_PRAGMATIC.md` does NOT exist.** It needs to be created from scratch. The existing papers are `EXIT_PAPER_v3.md` and `EXIT_PAPER_v4.md`. The NIST RFI should be a new document drawing on the current project capabilities.

---

## 1. EXIT SPEC Gaps (Features in Code Not in Spec)

### 1.1 New ExitType Enum Values — CRITICAL

**Code (`types.ts`)** defines 8 ExitType values. **Spec (§3.6)** documents only 4.

| ExitType | In Spec? | Description |
|----------|----------|-------------|
| `voluntary` | ✅ §3.6 | |
| `forced` | ✅ §3.6 | |
| `emergency` | ✅ §3.6 | |
| `keyCompromise` | ✅ §3.6 | |
| `platform_shutdown` | ❌ **MISSING** | Platform shutting down, initiating departures for all agents |
| `directed` | ❌ **MISSING** | Ordered by operator/authority |
| `constructive` | ❌ **MISSING** | Conditions effectively forced departure (constructive dismissal analog) |
| `acquisition` | ❌ **MISSING** | Platform acquired/merged, triggering departure |

**Action:** Add these 4 values to §3.6 with descriptions and default status values. Update §6.1 validation rules to list all 8 values.

### 1.2 `specVersion` Field — HIGH

**Code (`types.ts`):** `ExitMarker` has a mandatory `specVersion: string` field. Validation requires it to equal `"1.1"`.  
**Spec (§3.1):** Does NOT list `specVersion` as a mandatory field. The 7-field table omits it.

**Action:** Add `specVersion` to §3.1 mandatory fields table (making it 8 mandatory fields, or list it separately as a compliance field). Update §6.1 to document specVersion validation.

### 1.3 `completenessAttestation` Field — MEDIUM

**Code (`types.ts`):** Defined as optional field on `ExitMarker` with `CompletenessAttestation` interface (`attestedAt`, `markerCount`, `signature`).  
**Spec:** Not mentioned anywhere.

**Action:** Add to §3.4 Extended Fields table. Add a brief subsection explaining the purpose (subject voluntarily attests "these are ALL my markers").

### 1.4 `sequenceNumber` Field — PARTIAL

**Code (`types.ts`):** Optional `sequenceNumber?: number` on `ExitMarker`.  
**Spec:** Documented in §20.2 and §20.7 (Checkpoint & Dead-Man Patterns) but NOT in §3.4 Extended Fields table.

**Action:** Add `sequenceNumber` to §3.4 Extended Fields table with cross-reference to §20.

### 1.5 Dispute Sub-Fields — MEDIUM

**Code (`types.ts` → `Dispute` interface):** Has `disputeExpiry?: string`, `resolution?: "settled" | "expired" | "withdrawn"`, `arbiterDid?: string`.  
**Spec (§4.3):** `Dispute` structure in Module C table does NOT list these fields.

**Action:** Add `disputeExpiry`, `resolution`, `arbiterDid` to the Module C Dispute structure table in §4.3.

### 1.6 TSA Timestamping — NOT IN SPEC

**Code (`tsa.ts`):** Full RFC 3161 TSA adapter with `requestTimestamp()`, `anchorWithTSA()`, `verifyTSAReceipt()`, `buildTimestampRequest()`, ASN.1 DER encoding.  
**Spec:** No mention of TSA/RFC 3161 timestamping anywhere.

**Action:** Add a new section (e.g., §11.3 "RFC 3161 Timestamp Anchoring") covering:
- `TSAReceipt` structure
- Request/response flow
- Structural verification caveat (not cryptographic — see sprint6 H2)
- Default TSA endpoint

### 1.7 Git Ledger Anchoring — NOT IN SPEC

**Code (`git-ledger.ts`):** Full git-backed append-only ledger with `initLedger()`, `anchorToGit()`, `verifyLedgerEntry()`, `listLedgerEntries()`.  
**Spec:** No mention of git ledger anchoring.

**Action:** Add a new section (e.g., §11.4 "Git Ledger Anchoring") covering:
- `GitLedgerConfig` structure
- `LedgerEntry` structure
- Orphan branch pattern
- Verify/list operations

### 1.8 Visual Hash Doors — NOT IN SPEC

**Code (`visual.ts`):** `renderDoorASCII()`, `renderDoorSVG()`, `hashToColors()`, `shortHash()` with style profiles for exitType/status.  
**Spec:** No mention of visual representations.

**Action:** Add a new section (e.g., in Appendix or §12.x "Visual Representations") covering:
- Door ASCII art as hash fingerprint
- SVG generation
- Color palette derivation
- Short hash format with 𓉸 motif
- `isEntry` flag for ENTRY marker doors

### 1.9 Full-Service Wrapper — NOT IN SPEC

**Code (`full-service.ts`):** `departAndAnchor()` and `departAndVerify()` combining identity generation, signing, anchoring, TSA, git ledger, and visual in one call.  
**Spec:** No mention of full-service convenience API.

**Action:** Consider adding to §12.x "Convenience API" or documenting in an implementation guide rather than the spec.

### 1.10 `ExitIntent` and `SuccessorAmendment` — PARTIAL

**Code (`types.ts`):** `ExitIntent` interface (subject, origin, timestamp, exitType, reason, proof). `SuccessorAmendment` interface (exitMarkerId, successor, timestamp, proof).  
**Spec:** `ExitIntent` is mentioned in §7.2 commit-reveal context but not formally specified as a structure. `SuccessorAmendment` is not mentioned.

**Action:** Add formal structure tables for both. `SuccessorAmendment` may warrant a subsection under §4.1 (Module A: Lineage).

### 1.11 Validation: Module Validation Gaps

**Code (`validate.ts`):** Only validates Module B (`stateSnapshot.stateHash`). Does NOT validate Modules C, D, E, F.  
**Spec (§6.1):** Lists 12 structural checks but doesn't mention module validation.

**Action:** Either document that module validation is implementation-optional, or add normative requirements for module validation.

### 1.12 Domain URI Inconsistency

**Code (`types.ts`):** `EXIT_CONTEXT_V1 = "https://cellar-door.dev/exit/v1"`  
**Spec (§3.1):** Uses `"https://cellar-door.dev/exit/v1"` ✅ — matches.  
**Old spec v1.0 and papers:** Use `cellar-door.org` — stale.

**Action:** No spec change needed. Note for papers/old docs cleanup.

---

## 2. ENTRY SPEC Gaps (Features in Code Not in Spec)

### 2.1 Transfer→Passage Rename in Code — HIGH

**Code:** `transfer.ts` module, `TransferRecord` type, `verifyTransfer()` function, `transferTime` field.  
**Spec (§5.1):** Correctly notes these as transitional names with "API Note" about renaming to `PassageRecord`/`verifyPassage()` in v0.2.0.

**Action:** The spec correctly documents the gap. When code is renamed, update the spec to remove the API Notes.

### 2.2 ENTRY Spec Appears Complete

The ENTRY_SPEC v1.0 is comprehensive and closely matches the codebase. Key modules all have spec coverage:
- ✅ Arrival markers, verification, signing
- ✅ Admission policies with presets
- ✅ Probation
- ✅ Capability scoping
- ✅ Claim tracking (with GDPR deletion)
- ✅ Revocation
- ✅ Continuity verification
- ✅ Passage verification (transfer)
- ✅ Validation rules
- ✅ Convenience functions

### 2.3 Missing: Visual Door Support for ENTRY

**Code (`visual.ts`):** `isEntry` parameter on `renderDoorASCII()` and `renderDoorSVG()`, `shortHash(hash, isEntry)` with `𓉸➜` prefix.  
**ENTRY Spec:** No mention of visual representations.

**Action:** Consider adding a section or cross-reference to EXIT spec's visual section noting ENTRY marker support.

### 2.4 Missing: Brand Elements

**ENTRY Spec:** Closing line uses "Departure is a right. Admission is a privilege. Together they make Passage." but no 𓉸 symbol, no "Right of Passage" reference.

**Action:** Consider adding 𓉸 to the document header or closing. Low priority for a technical spec.

---

## 3. NIST RFI — Content Needed for New Document

Since the NIST RFI document doesn't exist yet, here's what it should contain based on project capabilities:

### 3.1 Project Overview
- Cellar Door / Passage Protocol
- Two ceremonies, one protocol: EXIT (departure) + ENTRY (arrival) = Passage
- Proof of Passage (PoP) — cryptographic proof of entity movement between systems
- Non-custodial, portable, verifiable

### 3.2 Technical Capabilities to Highlight
- Ed25519 cryptographic signing and verification
- Content-addressed identifiers (SHA-256)
- KERI-compatible key management (pre-rotation, key event logs)
- RFC 3161 TSA timestamping
- Git-backed append-only ledger anchoring
- Merkle batch operations for efficient anchoring
- Field-level redaction and encryption (XChaCha20-Poly1305)
- Visual hash fingerprinting (door motif)
- Full ceremony state machine (7 states, 3 paths)
- Composable admission policies
- Replay-resistant claim tracking
- Probation and capability scoping

### 3.3 Numbers to Include
- **Test coverage:** 279 EXIT tests + 77 ENTRY tests = **356 total**
- **Packages:** 5 npm packages (cellar-door-exit, cellar-door-entry, langchain integration, vercel-ai-sdk integration, mcp-server)
- **GitHub repos:** 6 (exit, entry, langchain, vercel-ai-sdk, mcp-server, openclaw-skill)
- **Marker size:** ~300–500 bytes core
- **Spec version:** EXIT v1.1, ENTRY v1.0
- **Modules:** 6 optional EXIT modules (A–F)
- **ExitTypes:** 8 defined
- **Ethics guardrails:** 4 detection systems (coercion, weaponization, laundering, ethical compliance)
- **Admission policy presets:** 3 (OPEN_DOOR, STRICT, EMERGENCY_ONLY)

### 3.4 Standards Alignment
- W3C Verifiable Credentials Data Model 2.0
- W3C DID Core
- JSON-LD 1.1
- RFC 2119 (requirement levels)
- RFC 3161 (trusted timestamping)
- KERI (key management)
- GDPR compliance (right to erasure, DPIA)
- Howey test analysis (Module D securities considerations)

### 3.5 Integration Ecosystem
- LangChain integration (agent tool)
- Vercel AI SDK integration (middleware)
- MCP server (tool exposure)
- OpenClaw skill (CLI integration)

---

## 4. Terminology Changes Required

### 4.1 "Transfer" → "Passage" Instances

| Location | Current | Needed |
|----------|---------|--------|
| ENTRY_SPEC §5.1 | `TransferRecord` (with API note) | Keep API note until code renamed |
| ENTRY_SPEC §5.2 | `verifyTransfer()` (with API note) | Keep API note until code renamed |
| ENTRY_SPEC §21 | `transfer` module name | Update when code renamed |
| `cellar-door-entry/src/transfer.ts` | File name | Rename to `passage.ts` in v0.2.0 |
| slogans-v2.md | Various "transfer" slogans (#22, #23, #26, #29) | Mark as retired/superseded |
| Various README files | May use "Transfer" in headings | Audit and update |

### 4.2 Brand Elements to Add

Per brand guide:
- **𓉸** symbol — add to spec headers/footers where appropriate
- **"Right of Passage"** — primary slogan
- **"There's always a door..."** — signature line
- **"Passage Protocol"** — technical name for EXIT+ENTRY combined
- **"Proof of Passage"** — cryptographic proof term
- **"Departure is a right. Admission is a privilege."** — for protocol nuance contexts

---

## 5. Numbers to Update/Verify

| Metric | Current Value | Source | Where Referenced |
|--------|--------------|--------|-----------------|
| EXIT tests | 279 | cross-consistency-post-fixes.md | Specs, NIST RFI |
| ENTRY tests | 77 | cross-consistency-post-fixes.md | Specs, NIST RFI |
| Total tests | 356 | Computed | NIST RFI |
| Core marker size | ~300–500 bytes | EXIT_SPEC §1 | NIST RFI |
| ExitType values | 8 (code) / 4 (spec) | types.ts vs spec §3.6 | EXIT SPEC needs update |
| npm packages | 5 | Audit needed | NIST RFI |
| GitHub repos | 6 | Audit needed | NIST RFI |
| EXIT modules | 6 (A–F) | Consistent | All docs |
| Spec version | EXIT 1.1, ENTRY 1.0 | Headers | All docs |
| Ceremony states | 7 | Consistent | All docs |
| Ceremony paths | 3 | Consistent | All docs |
| Admission presets | 3 | Consistent | ENTRY spec, NIST RFI |
| Ethics detectors | 4 | Consistent | EXIT spec §8, NIST RFI |

---

## 6. New Sections Needed

### EXIT SPEC — New Sections
1. **§11.3 RFC 3161 Timestamp Anchoring** — TSA receipts, request flow, structural verification caveat
2. **§11.4 Git Ledger Anchoring** — git-backed append-only ledger
3. **§12.x Visual Representations** (or new Appendix) — door ASCII/SVG, color palettes, short hash
4. **Update §3.4** — Add `completenessAttestation`, `sequenceNumber` to Extended Fields table
5. **Update §3.6** — Add 4 new ExitType values
6. **Update §4.3** — Add Dispute sub-fields (`disputeExpiry`, `resolution`, `arbiterDid`)
7. **Add `specVersion`** — Either to §3.1 mandatory fields or §3.2 compliance fields
8. **Add `ExitIntent` formal structure** — expand §7.2
9. **Add `SuccessorAmendment` structure** — new subsection under §4.1
10. **Update §1.3 Changes from v1.0** — Add new ExitTypes, TSA, git ledger, visual, completeness attestation

### ENTRY SPEC — Updates
1. Minor: cross-reference to EXIT visual section for ENTRY door support
2. Minor: brand element additions (optional for technical spec)

### NIST RFI — New Document
1. Entire document needs to be created (see §3 above for content outline)

---

## 7. Cross-References That Must Match

| Item | EXIT SPEC | ENTRY SPEC | NIST RFI |
|------|-----------|------------|----------|
| ExitType enum values | §3.6 (needs 8) | §4.2 references exitType | Must list all 8 |
| Spec versions | Header: v1.1 | Header: v1.0, companion to EXIT v1.1 | Both versions |
| Test counts | N/A | N/A | 279 + 77 = 356 |
| Context URIs | §3.1: `cellar-door.dev/exit/v1` | §3.1: `cellar-door.dev/entry/v1` | Both URIs |
| Proof type | §3.5: Ed25519Signature2020 | §3.3: Ed25519Signature2020 | Ed25519 |
| Ceremony states | §5.1: 7 states | §15.1: 6 states (different) | Mention both |
| Module count | §4: 6 modules (A–F) | §7.2: references EXIT modules | 6 modules |
| Brand: "Passage" | Use in transition period, §Transition | §Abstract: EXIT + ENTRY = Passage | Primary term |
| Canonicalization | §13.1 | §11.1 | Must match approach |
| GDPR | §10.4 | §18 | Both approaches |
| Antitrust | Not in spec | §4.4 warning | Reference analysis |

---

## 8. Assessment Findings to Incorporate

### From consistency-check-code.md
- **CC-03:** Dispute sub-fields not validated → document in spec or add validation
- **CC-08/CC-09:** Dual module type system → resolve or document
- **CC-10:** JSON-LD context missing v1.1 field terms → document in spec

### From consistency-check-docs.md
- `TransferRecord`/`verifyTransfer()` naming contradicts brand guide → tracked in §4.1
- Specs don't reference primary slogans → low priority

### From cross-consistency-post-fixes.md
- 3 of 8 ExitType values lack test coverage → not a spec issue but note in NIST
- `cellar-door.org` domain persists in old docs → cleanup separately

### From multi-lens-synthesis.md
- 15 professional reviewers unanimously said "Needs Work"
- Top findings: ENTRY protocol needed ✅ (now exists), no institutional backstop, dispute resolution underdeveloped
- Novel insights: non-refoulement principle, destruction protocols, `/.well-known/exit-configuration` discovery

### From sprint6-security-legal-review.md
- **H1:** TSA default was HTTP, now HTTPS → verify in code, document in spec
- **H2:** TSA verification is structural only → document this caveat prominently
- **H3/H4:** Timeout and size limits added → document in spec
- **M1-M3:** Git ledger input validation → document security considerations

### From howey-module-d-v2.md
- Module D is higher risk than originally assessed
- `reputation_score` as asset type should be removed or heavily caveated
- Asset manifests need stronger "not a bearer instrument" language

### From antitrust-analysis.md
- Coordinated `blockedOrigins` across platforms = potential Sherman Act §1 violation
- ENTRY spec §4.4 already has antitrust warning ✅
- EXIT spec should cross-reference this concern

---

## 9. Security Findings to Document in Specs

From sprint6-security-legal-review.md, items that should appear in spec security sections:

1. TSA structural verification caveat (not cryptographic) — §11.3 or §15
2. Git ledger branch name validation requirement — §11.4
3. Git ledger path traversal prevention — §11.4
4. Full-service private key redaction default — §12.x or security section
5. Visual hash is decorative, not a security mechanism — visual section caveat

---

*This gather document is complete. Write agents should use it to update EXIT_SPEC_v1.1.md, ENTRY_SPEC_v1.0.md, and create NIST_RFI_PRAGMATIC.md.*
