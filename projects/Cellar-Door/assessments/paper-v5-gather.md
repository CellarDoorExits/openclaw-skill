# Paper v5 Gather Document

**Date:** 2026-02-24
**Purpose:** Everything needed to rewrite EXIT_PAPER_v4 → v5
**Produced by:** Subagent gather-paper-v5

---

## 1. What's New Since v4

The v4 paper describes EXIT_SPEC v1.1 but was written mid-sprint. Many v1.1 features were specified but not yet implemented or documented in the paper. The following are now complete and need paper coverage:

### 1.1 RFC 3161 TSA Timestamping (EXIT_SPEC §11.3)
- Full RFC 3161 Time-Stamp Authority integration
- ASN.1 DER request building, TSA HTTP POST, response parsing
- Default endpoint: `https://freetsa.org/tsr` (corrected from HTTP per security review)
- `requestTimestamp()`, `anchorWithTSA()`, `verifyTSAReceipt()`, `buildTimestampRequest()`
- **Important caveat:** Verification is structural only (ASN.1 parsing + hash-byte check), NOT cryptographic. Paper must state this clearly. Sprint 6 security review (H2) flagged this.
- Nonce support for replay prevention
- Size/timeout limits recommended (1MB, 30s)

### 1.2 Git Ledger Anchoring (EXIT_SPEC §11.4)
- Append-only ledger on a git orphan branch (default: `exit-ledger`)
- `initLedger()`, `anchorToGit()`, `verifyLedgerEntry()`, `listLedgerEntries()`
- Files stored at `ledger/{hash}.json`
- Security considerations: not cryptographic guarantee (rewritable with force-push), branch name validation, path traversal prevention
- GDPR tension: append-only vs right to erasure (security review LM2)

### 1.3 Visual Hash Doors (EXIT_SPEC §12.6)
- ASCII door rendering: 10×21 characters, Discord-safe Unicode (box drawing, block elements)
- Three-layer architecture: visual structure, status signaling (style profiles by exitType), hash encoding
- SVG door rendering with 5-color palette from `hashToColors()`
- Short hash format: `➜𓉸 xxxx-xxxx-xxxx` (EXIT) / `𓉸➜ xxxx-xxxx-xxxx` (ENTRY)
- ENTRY marker support (`isEntry: true` changes door body characters)
- Explicitly decorative, NOT a security mechanism

### 1.4 Full-Service Convenience API (EXIT_SPEC §12.7)
- `departAndAnchor(origin, options?)` — one-call: keygen + marker + sign + anchor + optional TSA + optional git + optional visual
- `departAndVerify(markerInput, tsaReceipt?)` — entry-side: parse + verify + TSA check + trust assessment
- Trust levels: `high` (sig+TSA), `medium` (sig only), `low` (sig+TSA-fail), `none` (sig-fail)
- Private key redacted by default (security review M5 addressed)
- Dynamic imports with graceful degradation

### 1.5 Four New ExitTypes (8 total, up from 4)
| New Type | Description | Default Status |
|---|---|---|
| `platform_shutdown` | Platform ceasing operations | `unverified` |
| `directed` | Ordered by operator/authority | `disputed` |
| `constructive` | Constructive dismissal analog | `disputed` |
| `acquisition` | Platform merger/acquisition | `unverified` |

### 1.6 New v1.1 Fields
- **`specVersion`** — mandatory, MUST be `"1.1"`
- **`completenessAttestation`** — subject attests "these are ALL my markers" (attestedAt, markerCount, signature)
- **`sequenceNumber`** — monotonically increasing checkpoint sequence number; highest wins for subject+origin pair
- **`disputeExpiry`** — ISO 8601 timestamp; dispute considered lapsed after this date
- **`resolution`** — `"settled"`, `"expired"`, or `"withdrawn"`
- **`arbiterDid`** — DID of arbiter handling the dispute

### 1.7 Key Custody Patterns (EXIT_SPEC §19)
- Agent-generated keys, platform-custodied, hardware enclaves/TEEs, key escrow
- Exit without key portability: broken lineage chain but departure right preserved
- Future: NAME-as-a-Service for key lifecycle

### 1.8 Checkpoint & Dead-Man Patterns (EXIT_SPEC §20)
- Pre-signed checkpoint markers held in escrow
- Heartbeat + auto-broadcast pattern (dead-man trigger)
- Sequence numbers prevent replay of older checkpoints
- Coercion defense: platform can't forge/replay after departure
- Escrow provider requirements (verify sig, hold highest seq, don't modify)
- Scale: thousands of checkpoints per agent is normal

### 1.9 ENTRY Companion Protocol (ENTRY_SPEC v1.0)
Complete arrival-side protocol:
- **Arrival Markers** signed by destination (not subject)
- **Admission policies**: OPEN_DOOR, STRICT, EMERGENCY_ONLY + custom
- **Continuity verification**: departureRef match, subject match, origin match, temporal ordering
- **Passage = EXIT + ENTRY** — verified chain = Proof of Passage (PoP)
- **Probation**: time-bounded reduced trust with restrictions
- **Capability scoping**: derived from EXIT modules, allow/deny lists, denied-wins merging
- **Claim tracking**: replay prevention (one EXIT → one arrival per destination)
- **Revocation**: destination can invalidate arrivals
- **Unpaired ENTRYs ("births")**: entities with no prior departure
- **Lifecycle chain**: EXIT₁ → ENTRY₁ → EXIT₂ → ENTRY₂ → ...
- Core asymmetry: "Departure is a right. Admission is a privilege."
- Antitrust warning on coordinated blockedOrigins

### 1.10 Additional v1.1 Features Already in v4 But Worth Noting
- Trust mechanisms (§7): StatusConfirmation levels, commit-reveal, tenure attestation, confidence scoring — these are in v4 but the confidence scoring footnote correcting from multiplicative to additive should be integrated into main text
- Ethics guardrails (§8): coercion detection, weaponization detection, laundering detection, right of reply, sunset policies, anti-weaponization clause
- KERI key management (§9): inception/rotation events, key compromise recovery, pre-rotation commitments
- Privacy (§10): XChaCha20-Poly1305 encryption, field-level redaction, minimal disclosure
- Anchor records and Merkle batch operations (§11.1-11.2)

---

## 2. Numbers to Update

| Item | v4 Value | v5 Value | Notes |
|---|---|---|---|
| EXIT tests | 205 | **279** | Significant growth |
| ENTRY tests | N/A | **77** | New package |
| Total tests | 205 | **356** | 279 + 77 |
| npm packages | (not stated) | **5** | exit, entry, langchain, vercel-ai-sdk, mcp-server |
| GitHub repos | (not stated) | **6** | |
| ExitTypes | 4 | **8** | +platform_shutdown, directed, constructive, acquisition |
| Core marker unsigned | ~335 bytes | Verify — still ~335? | Check if specVersion field changed this |
| Core marker signed | ~596 bytes | Verify — may have changed | specVersion adds a few bytes |
| Full marker (all modules) | 1,294 bytes | Verify | |
| Test vectors | 9 (§17.1-17.9) | **11** (§17.1-17.11) | +platform_shutdown, constructive+completeness |
| StatusConfirmation levels | (in v4) | 6 levels | No change |
| Spec version described | v1.1 | v1.1 | Same spec, more complete coverage |
| Lines of code | ~2,400 | **Update** | Likely much higher with TSA, git-ledger, visual, full-service, ENTRY |
| Context URI | `cellar-door.org` | `cellar-door.dev` | v4 uses .org in the example; spec uses .dev |

---

## 3. Terminology Changes

### 3.1 Transfer → Passage
- All instances of "transfer" → "Passage" throughout
- "Transfer Protocol" → "Passage Protocol"
- "Transfer history" → "Passage history"
- Exception: ENTRY spec still exports `TransferRecord` and `verifyTransfer()` for backward compat (renamed in v0.2.0)

### 3.2 Brand Elements
- **𓉸** (U+13268) — core brand symbol
- **➜𓉸** — EXIT motif (departing through the door)
- **𓉸➜** — ENTRY motif (arriving through the door)
- **"Right of Passage"** — primary slogan (triple wordplay: rite/right/passage)
- **"There's always a door..."** — signature line
- **"Proof of Passage" (PoP)** — cryptographic proof term (cf. PoS, PoW)
- **"Two ceremonies. One protocol."** — technical contexts only
- **"Departure is a right. Admission is a privilege."** — protocol asymmetry discussion only

### 3.3 Title Consideration
v4 title: "EXIT: A Protocol for Verifiable Agent Departure Ceremonies"
v5 candidates:
- "The Passage Protocol: Verifiable Agent Departure and Arrival Ceremonies" (reflects EXIT+ENTRY)
- "EXIT and ENTRY: A Protocol for Verifiable Agent Passage" 
- Keep existing title and add ENTRY as a section

---

## 4. Sections: Rewrite vs Minor Update

### Full Rewrite Required
| Section | Reason |
|---|---|
| **Abstract** | Must cover ENTRY, Passage, new test counts, new features |
| **§1 Introduction** | Add Passage framing, ENTRY context, updated ecosystem (NIST RFI submitted) |
| **§3.2 Core Schema** | 8 exitTypes, specVersion, new fields, context URI .dev |
| **§8 Implementation** | 279+77 tests, 5 packages, 6 repos, new modules (TSA, git-ledger, visual, full-service), updated benchmarks, ENTRY implementation |
| **§9 Discussion / Limitations** | Many v4 limitations are now addressed (ENTRY exists, timestamping exists, more exitTypes); new limitations to add |
| **§10 Conclusion** | Incorporate ENTRY, Passage, brand language |

### Significant Updates
| Section | Changes |
|---|---|
| **§2 Background** | Add NIST AI Agent Standards Initiative RFI context (we submitted!), update AAIF status, any new agent portability work |
| **§3.3 Optional Modules** | Module C now has disputeExpiry, resolution, arbiterDid, rightOfReply |
| **§3.5 Key Design Decisions** | Add decisions about TSA, git ledger, visual, Passage terminology |
| **§4 Mechanism Design** | Footnotes about additive scoring should become main text; completenessAttestation as anti-selective-presentation |
| **§5 Security** | Add TSA-specific threats (H1-H4 from security review), git-ledger threats, checkpoint/dead-man security properties |
| **§6 Legal** | Update NIST section (we responded to RFI), add TSA legal weight discussion |
| **§7 Ethics** | Checkpoint markers as coercion defense; ENTRY-side ethics (destination power) |

### Minor Updates
| Section | Changes |
|---|---|
| **§2.5 DAO Exit** | No change needed |
| **§2.6 Exit, Voice, Lemons** | No change needed |
| **§3.4 Ceremony State Machine** | No change (v4 already covers this) |
| **§3.6 Verification Model** | No structural change |
| **§4.3 Trust Mechanisms** | Already in v4; fix footnotes inline |
| **§4.4 Future Mechanisms** | Update: some are no longer "future" |
| **§5.3 Crypto** | Add post-quantum timeline note (already there) |

---

## 5. New Sections Needed

### 5.1 ENTRY Protocol Summary (NEW §X)
- Core concept: arrival markers signed by destination
- Admission policies (OPEN_DOOR, STRICT, EMERGENCY_ONLY)
- Passage = EXIT + ENTRY = Proof of Passage
- Probation and capability scoping
- Claim tracking (replay prevention)
- Revocation
- The asymmetry: "Departure is a right. Admission is a privilege."
- Unpaired markers (births, deaths, orphans)
- Lifecycle chains

### 5.2 Anchoring and Timestamping (NEW §X or expand §3.3 Module F)
- RFC 3161 TSA integration
- Git ledger anchoring
- Merkle batch operations
- Trust level computation (sig + TSA = high, etc.)
- Security caveats (structural-only TSA verification)

### 5.3 Visual Identity (NEW §X or subsection of Implementation)
- Visual hash doors (ASCII + SVG)
- Short hash format with brand symbols
- Decorative, not security
- Brief — probably 1-2 paragraphs + figure

### 5.4 Key Custody and Checkpoints (NEW §X)
- Custody models
- Checkpoint / dead-man patterns
- Sequence numbers
- Escrow pattern

### 5.5 Developer Experience (NEW §X or subsection of Implementation)
- 5 npm packages with descriptions
- Framework integrations (LangChain, Vercel AI SDK, MCP)
- Full-service convenience API
- CLI: `exit keygen`, `exit create`, `exit verify`, `exit inspect`

---

## 6. Multi-Lens Validation Summary

### Key Result
15 professional personas, unanimous "Needs Work" (not fatally flawed, not ready). Core architecture praised universally.

### Worth Including in Paper

**Universally Praised (cite in paper):**
- Unblockable exit invariant (D-006) — mapped to no-fault divorce, right to emigrate
- `selfAttested: true` transparency — "actuarially excellent"
- Ceremony state machine — maps to processes in 15 domains
- Confidence scoring — "B+ architecture"
- Modular design — correct separation of concerns

**Top Gaps Identified (cite as acknowledged limitations or addressed items):**
- ENTRY protocol needed (11/15) → **NOW ADDRESSED** ✅
- No institutional backstop (10/15) → still a limitation
- Dispute resolution underdeveloped (9/15) → partially addressed (disputeExpiry, resolution, arbiterDid)
- Self-attestation practically devastating (7/15) → addressed by trust mechanisms, still honest about limits
- No trusted timestamping (6/15) → **NOW ADDRESSED** ✅ (TSA integration)
- Privacy/consent missing (7/15) → partially addressed (encryption, redaction)

**Novel Insights Worth Citing:**
- Non-refoulement principle (immigration lawyer) — destination must not forward markers to hostile origins
- Grade inflation on departure attestations (labor economist) — platforms may co-sign everything
- Dead-man switch / auto-departure (military) → **NOW ADDRESSED** ✅ (checkpoint patterns)
- Selective presentation attack (4 personas) → partially addressed (completenessAttestation)

### Suggested Framing
"A multi-lens validation exercise subjected the protocol to review by 15 synthetic professional personas spanning immigration law, digital forensics, insurance actuarial science, and ten other domains. The core architecture received unanimous endorsement. Three critical gaps identified — absence of an arrival protocol, lack of trusted timestamping, and no dead-man switch mechanism — have been addressed in v1.1. Remaining gaps include [...]."

---

## 7. Related Work Updates

### 7.1 NIST AI Agent Standards Initiative
- Launched February 17, 2026 (already in v4)
- **NEW:** We submitted an RFI response (NIST_RFI_v2.md) — cite this
- Three pillars: industry-led standards, open-source protocol development, agent security & identity research
- Our response recommended: standardize agent mobility primitives, require unblockable exit, separate departure rights from admission privileges, mandate non-custodial architectures, incorporate anti-weaponization provisions

### 7.2 Check for Updates Since v4
Things to web-search before writing:
- Any new agent portability/mobility standards since Feb 2026?
- A2A Protocol updates?
- AAIF (Agentic AI Foundation) progress?
- Any academic papers on agent departure/migration?
- EU AI Act agent provisions?
- AP2 (Agent Payments Protocol) updates?
- MCP updates relevant to identity?

### 7.3 Framework Integrations as Related Work
v5 can now cite concrete framework integrations:
- LangChain tool integration
- Vercel AI SDK middleware
- MCP server — particularly relevant since MCP is an AAIF founding project

---

## 8. Suggested Paper Structure for v5

```
Title: "The Passage Protocol: Verifiable Agent Departure and Arrival Ceremonies"
       OR keep "EXIT" in title and subtitle ENTRY

Abstract (rewrite — cover EXIT+ENTRY, 356 tests, 5 packages, Passage)

1. Introduction (rewrite — Passage framing, NIST context)
   1.1 The Departure Problem (from v4, tightened)
   1.2 The Arrival Problem (NEW — why ENTRY is needed)
   1.3 Contributions

2. Background and Related Work (update)
   2.1 Decentralized Identity (minor update)
   2.2 Agent Communication Standards (update with AAIF, NIST)
   2.3 Enterprise Agent Identity (minor update)
   2.4 Self-Sovereign Identity for Agents (no change)
   2.5 DAO Exit Mechanisms (no change)
   2.6 Theoretical Foundations (Hirschman, Akerlof — from v4)
   2.7 Comparison Table (update — add ENTRY column)

3. The EXIT Protocol (update v4 §3)
   3.1 Design Goals (no change)
   3.2 Core Schema (update: 8 exitTypes, specVersion, new fields)
   3.3 Optional Modules (update: dispute sub-fields)
   3.4 Ceremony State Machine (no change)
   3.5 Key Design Decisions (add new decisions)
   3.6 Verification Model (no change)

4. The ENTRY Protocol (NEW)
   4.1 Design Goals and Asymmetry
   4.2 Arrival Markers
   4.3 Admission Policies
   4.4 Passage Verification (EXIT + ENTRY = PoP)
   4.5 Probation and Capability Scoping
   4.6 Claim Tracking and Revocation

5. Trust and Anchoring (restructure from v4 §4 + new material)
   5.1 Self-Attestation as Cheap Talk (from v4)
   5.2 The Departure Game (from v4)
   5.3 Implemented Trust Mechanisms (from v4, fix footnotes)
   5.4 Anchoring: TSA and Git Ledger (NEW)
   5.5 Checkpoint and Dead-Man Patterns (NEW)
   5.6 Key Custody Considerations (NEW)
   5.7 Future Mechanisms (update from v4)

6. Security Analysis (update v4 §5)
   6.1 Threat Model (add TSA, git-ledger, checkpoint threats)
   6.2 Sybil Origin Attack (no change)
   6.3 Cryptographic Considerations (no change)
   6.4 Key Management (no change)
   6.5 TSA Security Caveats (NEW — from security review)
   6.6 Git Ledger Security (NEW — from security review)

7. Legal and Regulatory (update v4 §6)
   7.1 Agent Personhood Gap (no change)
   7.2 NIST Standards Initiative (update — we submitted RFI)
   7.3 Data Protection (no change)
   7.4 Financial Regulation (no change)
   7.5 TSA Legal Weight (NEW — eIDAS caveats)

8. Ethics (update v4 §7)
   8.1 Power Dynamics (update — ENTRY introduces destination power)
   8.2 Company Town Problem (update — ENTRY partially addresses)
   8.3 Ethics Guardrails (expand — checkpoint coercion defense)

9. Multi-Lens Validation (NEW — from multi-lens-synthesis.md)
   9.1 Methodology
   9.2 Key Findings
   9.3 Gaps Addressed Since Review
   9.4 Remaining Limitations

10. Implementation and Evaluation (major rewrite)
    10.1 Reference Implementation (5 packages, updated LOC)
    10.2 EXIT Package (279 tests, benchmarks)
    10.3 ENTRY Package (77 tests)
    10.4 Framework Integrations (LangChain, Vercel AI SDK, MCP)
    10.5 Visual Identity (hash doors, short hashes)
    10.6 Demo Scenarios (update)

11. Discussion (rewrite)
    11.1 Limitations (update — many addressed, new ones)
    11.2 Future Work (update — what's left)

12. Conclusion (rewrite — Passage framing)

References (update — add NIST RFI, new standards)
```

---

## 9. Specific Text Issues in v4

1. **Context URI inconsistency:** v4 example uses `cellar-door.org/exit/v1`; spec uses `cellar-door.dev/exit/v1`. Use `.dev` consistently.
2. **Footnotes → main text:** The confidence scoring and tenure weight footnotes in v4 §4.3 correcting from earlier drafts should be integrated as main text in v5.
3. **"~2,400 lines"**: Needs updating.
4. **Abstract says "205 passing tests"**: Update to 356.
5. **Abstract says "seven-state ceremony state machine"**: Still correct.
6. **Abstract says "six optional extension modules"**: Still correct.
7. **Abstract says "~335 bytes unsigned, ~596 bytes signed"**: Verify with specVersion field.
8. **Table 1 comparison**: Add ENTRY column or row; consider adding AP2.
9. **v4 mentions "three execution paths"**: Still correct.

---

## 10. Security Review Findings to Incorporate

From sprint6-security-legal-review.md:

### Must Mention in Paper
- TSA verification is structural only, not cryptographic (H2) — critical honesty point
- Git ledger is integrity mechanism, not legal proof (LM1)
- GDPR vs append-only ledger tension (LM2)
- Trust level naming creates implied warranty risk (LH2) — consider `confidenceHint`

### Already Fixed (Mention as Addressed)
- TSA default URL changed to HTTPS (H1)
- Fetch timeout/size limits added (H3, H4)
- Branch name validation (M1)
- Private key redaction by default (M5)

---

## 11. NIST RFI Key Language Worth Reusing

From NIST_RFI_v2.md — good summary language for paper:

- "No standardized mechanism exists for agents to portably prove where they have been, how they left, and under what standing"
- "Departure is a right. Admission is a privilege."
- "Non-custodial, content-addressed, cryptographically signed artifacts — verifiable by any party without a network call"
- Recommendation framing: "standardize agent mobility primitives," "require unblockable exit as a safety property"
- Elevator pitch: "Cellar Door is a Proof of Passage provider, enabling AI agents graceful Exits and Entries across any platform."

---

*This gather document covers all material needed for the v5 paper rewrite.*
