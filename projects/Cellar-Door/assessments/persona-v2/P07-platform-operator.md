# P07: Platform Operator — Operational Feasibility Assessment

**Persona:** DevOps/SRE at an agent hosting platform. Runs infrastructure for thousands of agents. Cares about scale, cost, liability, and operational burden.
**Date:** 2026-02-24
**Files reviewed:** `cellar-door-exit/specs/EXIT_SPEC_v1.1.md`, `cellar-door-exit/SECURITY.md`, `docs/ecosystem-map.md`, `integrations/mcp-server/README.md`

---

## Cost to support at scale

### Compute

Marker creation is lightweight: Ed25519 sign + SHA-256 hash. Ed25519 signing is ~70μs on modern hardware. Verification is ~200μs. At 10K markers/sec, that's ~2 CPU-seconds for signing or ~2 CPU-seconds for verification. **Compute is not the bottleneck.**

The ceremony state machine adds negligible overhead — it's state tracking, not computation. The expensive optional features (RFC 3161 TSA timestamping, git ledger anchoring) are network-bound, not CPU-bound.

### Storage

Core signed marker: ~660 bytes (spec §3, README). With Module A lineage + Module E metadata: ~1-2KB. At 10K exits/sec sustained (unlikely but let's plan):
- **Raw markers:** ~15GB/day
- **With Merkle batch anchoring:** anchor records are 2 fields (hash + timestamp), ~100 bytes. Batches of 1000 reduce anchor storage by ~10x.
- **Git ledger:** each entry is a file + commit. Git objects compress well but the commit graph grows linearly. At sustained volume, git performance degrades past ~1M objects per repo. Would need repo sharding.

**Storage cost: manageable.** Markers are small. The git ledger is the scaling concern.

### Key management

Every agent needs a DID + keypair. `did:key` is trivial to generate but the spec warns it's prototype-grade — no revocation, no rotation (SECURITY.md §2). Production requires `did:keri` with key event logs (spec §9.1), pre-rotation commitments, and key state tracking.

**This is where operational cost lives.** Maintaining KERI key event logs at scale means:
- Append-only KEL storage per agent
- Key rotation workflows
- Key compromise detection and recovery (SECURITY.md §2.3)
- Pre-rotated key pair generation at identity creation

For our platform, this is essentially a PKI. We'd need dedicated key management infrastructure — HSMs for high-value agents, key ceremony processes, revocation list maintenance.

**Estimated operational overhead:** 1 FTE for key management infrastructure if supporting >1000 agents.

## 10K exits/sec bottlenecks

### Bottleneck 1: TSA timestamping

RFC 3161 TSA requests (spec §11.3) are HTTP POSTs to external services. Default endpoint is `https://freetsa.org/tsr`. At 10K/sec:
- FreeTSA will rate-limit or collapse
- 30-second timeout per request (spec §11.3.3) means 300K concurrent connections at steady state
- TSA is optional but if customers expect it, we need a private TSA or batch with Merkle trees first

**Mitigation:** Merkle batch (spec §11.2) then single TSA request per batch. 10K markers → batch of 10K → 1 TSA request/sec. Viable.

### Bottleneck 2: Git ledger

`anchorToGit()` (spec §11.4) does file write + git add + git commit per marker. Git commit is serialized. At 10K/sec this is physically impossible on a single repo.

**Mitigation:** Batch commits (accumulate markers, periodic commit). Or skip git ledger entirely and use Merkle batches with external anchoring. The spec says git ledger is optional.

### Bottleneck 3: Signature verification at ENTRY

If we're the receiving platform doing ENTRY verification for 10K arrivals/sec, each needs:
- Ed25519 signature verification (~200μs)
- Admission policy evaluation
- Continuity check against claim store (replay prevention)
- Optional lineage chain verification (depth-dependent)

At 10K/sec: 2 CPU-seconds for signatures alone. Lineage chain verification of depth N adds N×200μs per arrival. Deep lineage chains (spec recommends depth ≥3 for high-trust) at 10K/sec = 6 CPU-seconds for chain verification.

**Total: ~4 CPU cores dedicated to verification at 10K arrivals/sec.** Feasible but non-trivial.

### Bottleneck 4: Claim store

ENTRY claim tracking prevents replay — each EXIT marker consumed at most once per destination. At scale this is a uniqueness lookup against every prior claim. Needs a fast deduplicated store (Redis SET, Bloom filter). Storage grows linearly with total markers ever processed.

**Not addressed in the spec.** The MCP server README doesn't mention claim persistence. This is left as an exercise for the operator.

## Liability exposure

### What we'd own

Per `ecosystem-map.md` §4 Liability Map:
- We'd own our ENTRY admission decisions (who we admit)
- We'd own our co-signatures on EXIT markers (Module C `originStatus`)
- We'd own claim store accuracy (replay prevention)
- We'd own key management for our platform identity

### What we explicitly don't own

- Content truth of markers (ecosystem-map.md: "marker is a notarized photocopy")
- Identity validity of arriving agents (Sybil resistance is NAME layer's problem)
- Privacy compliance — but GDPR applies to us as data controller if we store markers containing personal data (LEGAL.md §7)

### Liability concerns

1. **Defamation via `originStatus`** (SECURITY.md §1.2): If we issue `disputed` status on a forced exit, and it's wrong, we're exposed. The spec's safe harbor (LEGAL.md §15.1) requires "good faith and reasonable basis" — but who adjudicates that?

2. **Module D economic manifests** (LEGAL.md §4): "Declarations, not instruments" — but if our platform processes Module D and an agent claims assets based on our co-signature, we could be in a gray zone.

3. **Emergency path abuse** (SECURITY.md §3): Agents can skip dispute resolution via emergency exit. If we're holding escrowed assets (Module D), an emergency exit that circumvents settlement is our loss.

4. **Mass coordinated exit** (SECURITY.md §1.4): A bank run on our platform creates reputational damage. The spec notes this threat but mitigations are vague ("evaluate mass exit events in context").

## Is MCP the right pattern?

**For the use case described, yes. For platform integration, no.**

The MCP server (`integrations/mcp-server/README.md`) exposes 8 tools: 4 EXIT, 4 ENTRY. It's designed for Claude Desktop / Cursor / Windsurf — interactive agent environments where a human or agent needs ad-hoc marker operations.

For platform integration at scale, MCP is wrong:
- MCP is request-response over stdio — not suitable for high-throughput batch operations
- No connection pooling, no backpressure, no streaming
- The MCP server is a single process; we need distributed workers

**What we'd actually use:** The core `cellar-door-exit` and `cellar-door-entry` libraries directly, wrapped in our own service mesh. MCP server is a developer convenience, not infrastructure.

## Key management assessment

The spec provides KERI-compatible key event logs (§9.1) with inception events, rotation events, and pre-rotation commitments. Key compromise recovery (§9.2) via `keyCompromise` exit type is a stopgap.

**Gaps for platform operations:**
- No HSM integration guidance
- No key ceremony documentation
- No multi-party key management (our agents are operated by us, not autonomous — we need organizational key governance)
- `did:key` → `did:keri` migration path undefined
- Key event log storage and replication not specified (just the data structures)

---

## Verdict: **Conditional-go**

### Conditions for go:

1. **Key management infrastructure** — We build our own PKI layer on top of the KERI primitives. Budget 1 FTE and HSM procurement. Don't go live with `did:key`.

2. **Claim store implementation** — We build the replay-prevention store. Redis-backed, with TTL for sunset policy compliance (spec §8.5). Not provided by the protocol.

3. **Batch anchoring only** — Skip per-marker git ledger and TSA. Use Merkle batches (spec §11.2) with periodic TSA stamps. One batch/minute at our volume.

4. **Co-signature policy** — Legal review of our `originStatus` attestation workflow before enabling Module C. The safe harbor (LEGAL.md §15.1) is thin.

5. **Skip Module D** — The economic module's liability surface is too broad for initial deployment. Agents can reference assets in Module E narrative if needed.

6. **Rate limiting** — Implement per-DID submission limits (spec SECURITY.md §7.2 suggests 10/hour). Our platform needs tighter limits initially.

### What works well:
- Minimal core (7 fields, ~660 bytes) is operationally efficient
- `@noble/*` crypto stack is audited and performant
- Non-custodial design means we don't become a single point of failure
- Emergency path ensures agents aren't trapped on our platform (reduces our liability for platform outages)
- Anti-weaponization clause (spec §8.6) is normatively correct and aligns with our platform values

### What doesn't work yet:
- v0.1.0 implementation maturity vs. v1.1 spec ambition — gap is real
- No operational runbooks, no monitoring guidance, no SLO recommendations
- Claim store, key management infrastructure, and batch anchoring are all "build it yourself"
- The ecosystem map (ecosystem-map.md) lists 8+ adjacent services as "interface prepared" but none are implemented — we'd be early and alone
