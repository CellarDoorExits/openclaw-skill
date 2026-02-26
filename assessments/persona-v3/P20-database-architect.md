# P20 — Database Architect Assessment

**Persona:** Principal Database Architect (data modeling, query patterns, storage at scale, schema evolution)
**Target:** cellar-door-exit claim-store.ts, types.ts, EXIT_SPEC v1.1
**Date:** 2026-02-25

---

## 1. Data Model Assessment for Persistence & Querying

**Verdict: Well-designed with minor gaps.**

The `StoredClaim` schema is clean and persistence-friendly:

- **Content-addressed IDs** (`claim:{sha256_prefix}`) — excellent for deduplication and idempotent writes
- **Flat top-level fields** (subject, type, issuer, issuedAt, expiresAt) — all indexable without JSON unpacking
- **Opaque payload** (Record<string, unknown>) — correctly separates queryable metadata from opaque content
- **Tags as string arrays** — standard pattern, well-supported by Postgres (GIN) and DynamoDB (GSI on flattened tags)

**Gaps:**
- No `updatedAt` / `createdAt` distinction — `issuedAt` is semantic (when the claim was made), not when it was stored. Need a `storedAt` for operational queries
- No `version` field on StoredClaim — makes schema migration harder
- `markerRef` is optional and single-valued — a claim could relate to multiple markers (e.g., a witness attesting to a batch). Consider an array
- The 16-char truncated SHA-256 for IDs (`hash.digest("hex").slice(0, 16)`) gives 64 bits — collision probability reaches ~1% at ~600M claims (birthday paradox). **Use at least 32 hex chars (128 bits) for production**

The `ExitMarker` type is deeply nested (modules A–F, trust enhancers, disputes, etc.). This is fine for document storage but requires careful flattening for relational persistence.

---

## 2. Production Store Design

### Option A: PostgreSQL (Recommended for most deployments)

```sql
-- Core claims table
CREATE TABLE claims (
    id              TEXT PRIMARY KEY,
    subject         TEXT NOT NULL,
    type            TEXT NOT NULL,
    issuer          TEXT NOT NULL,
    issued_at       TIMESTAMPTZ NOT NULL,
    expires_at      TIMESTAMPTZ,
    marker_ref      TEXT,
    tags            TEXT[],           -- GIN-indexed array
    payload         JSONB NOT NULL,
    stored_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    schema_version  SMALLINT NOT NULL DEFAULT 1
);

-- Full EXIT markers (document store pattern)
CREATE TABLE exit_markers (
    id              TEXT PRIMARY KEY,
    subject         TEXT NOT NULL,
    origin          TEXT NOT NULL,
    exit_type       TEXT NOT NULL,
    status          TEXT NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL,
    spec_version    TEXT NOT NULL,
    self_attested   BOOLEAN NOT NULL DEFAULT TRUE,
    sequence_number INTEGER,
    sunset_date     TIMESTAMPTZ,
    coercion_label  TEXT,
    marker_json     JSONB NOT NULL,   -- Full marker for round-tripping
    stored_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Why Postgres:**
- JSONB for opaque payloads with optional path indexing
- Array types for tags with GIN indexes
- TIMESTAMPTZ for proper expiry queries
- Partitioning by time range at scale
- `ON CONFLICT DO NOTHING` for idempotent upserts matching the append-only design

### Option B: DynamoDB (For serverless / AWS-native)

```
Table: exit-claims
  PK: subject (partition key)
  SK: type#issued_at#id (sort key)

GSI-1: issuer-index
  PK: issuer
  SK: issued_at

GSI-2: marker-ref-index
  PK: marker_ref
  SK: issued_at

GSI-3: type-time-index
  PK: type
  SK: issued_at
```

DynamoDB works but the query patterns are more constrained. The `ClaimQuery` interface maps well to single-GSI lookups but multi-field filters require client-side filtering or composite keys.

### Option C: SQLite (Edge / embedded)

For the local-first design philosophy described in the code ("local-first database that agents use to accumulate trust evidence"), **SQLite is actually the best fit** for single-agent deployments. The MemoryClaimStore's API maps 1:1 to SQLite with FTS5 for tag search.

---

## 3. Indexing Requirements

| Query Pattern | Frequency | Index Required |
|---|---|---|
| Claims by subject | Very High | `claims(subject)` — B-tree |
| Claims by subject + type | High | `claims(subject, type)` — composite |
| Claims by marker_ref | High | `claims(marker_ref)` — B-tree |
| Claims by issuer | Medium | `claims(issuer)` — B-tree |
| Non-expired claims | High | `claims(expires_at) WHERE expires_at IS NOT NULL` — partial |
| Claims by tag | Medium | `claims USING GIN(tags)` |
| Claims sorted by time | High | `claims(issued_at DESC)` — B-tree |
| Markers by subject + origin | Very High | `exit_markers(subject, origin)` — composite |
| Markers by origin + exit_type | Medium | `exit_markers(origin, exit_type)` — for weaponization detection |
| Markers by sequence_number | Medium | `exit_markers(subject, origin, sequence_number DESC)` — for checkpoint resolution |

**Key observation:** The `deleteBySubject()` GDPR method requires efficient subject-based access. Subject MUST be a primary access pattern, not a secondary index — confirmed by the design.

---

## 4. Schema Evolution Handling

**Current state: Adequate but informal.**

**What works:**
- `specVersion` field on ExitMarker enables version discrimination
- The spec mandates: "Implementations MUST preserve unrecognized fields when round-tripping markers" — this is the correct forward-compatibility strategy
- Opaque `payload` in StoredClaim means the claim store itself is version-agnostic
- ClaimType enum uses string values (not integers) — safe for wire evolution
- Optional modules (A–F) are additive — new modules don't break old markers

**What's missing:**
- No `schema_version` on `StoredClaim` itself — if the claim store schema changes (not the marker schema), there's no migration discriminator
- No migration framework or versioned serialization strategy
- The `ClaimType` enum is open (`ClaimType | string`) — good for extensibility, but consumers need to handle unknown types gracefully
- No explicit deprecation mechanism for fields or modules

**Recommendation:** Add a `schemaVersion: number` to StoredClaim (default 1). When persisted, this allows batch migration queries like `UPDATE claims SET ... WHERE schema_version < 2`.

---

## 5. MemoryClaimStore Assessment

**Verdict: Good reference implementation.**

**Strengths:**
- Clean interface segregation (`ClaimStoreBackend` interface + `MemoryClaimStore` impl)
- Sync/async flexibility (`Promise<T> | T` return types) — smart, allows both sync in-memory and async DB backends
- Content-addressed ID generation with SHA-256
- Defensive copies on put (`{ ...claim }`) — prevents aliasing bugs
- GDPR `deleteBySubject()` as a first-class operation
- `stats()` method for observability
- Validation on write (not just read)

**Issues:**
- **O(n) query performance** — `Array.from(this.claims.values())` on every query. Fine for reference impl, but should be documented as O(n)
- **No pagination** — `limit` exists but no `offset` or cursor. For a production backend, cursor-based pagination is essential
- **String comparison for date filtering** (`c.expiresAt > now`) — works because ISO 8601 sorts lexicographically, but fragile if any date isn't UTC-normalized
- **No concurrency control** — fine for single-threaded reference impl, but the interface should document expected concurrency semantics for implementers
- **Tag matching is OR-based** (`some`) — no AND-based tag query. Consider adding `tagMatchMode: "any" | "all"` to ClaimQuery
- **No `count()` method** — useful for pagination metadata

**Overall:** This is exactly what a reference implementation should be — correct, readable, minimal. The interface is well-designed for multiple backend implementations.

---

## 6. Storage Implications at Scale

### Per-Claim Estimates

| Component | Size |
|---|---|
| StoredClaim (minimal, no payload) | ~300 bytes |
| StoredClaim (typical, with marker payload) | ~800 bytes |
| StoredClaim (rich, with trust enhancers) | ~2 KB |
| Full ExitMarker JSON (core only) | ~500 bytes |
| Full ExitMarker JSON (all modules) | ~5–10 KB |

### Scale Projections

| Scale | Claims | Raw Storage | With Indexes (1.5x) | Notes |
|---|---|---|---|---|
| 1M | 1M | ~800 MB | ~1.2 GB | Single Postgres instance, no partitioning needed |
| 100M | 100M | ~80 GB | ~120 GB | Partition by month on `issued_at`. Single large instance or read replicas |
| 1B | 1B | ~800 GB | ~1.2 TB | Time-based partitioning mandatory. Consider archival tier for expired claims. Shard by subject hash if write-heavy |

### Operational Notes at 1B Scale

- **ID collision risk with 16-char hex:** Birthday paradox gives ~1% collision probability at 600M records. **Must extend to 32+ hex chars.**
- **GDPR deleteBySubject at scale:** With proper subject index, deletion is fast. But if claims are anchored on-chain (Module F), deletion creates a consistency problem — the chain record persists. The spec acknowledges this tension.
- **Expired claim cleanup:** At 1B claims with sunset dates, a background job purging/archiving expired claims is essential. Add a partial index: `WHERE expires_at IS NOT NULL AND expires_at < NOW()`.
- **Hot partition risk (DynamoDB):** If a single subject generates millions of claims, the subject-partitioned design creates hot keys. Mitigate with write sharding suffix on PK.
- **The opaque payload field is the wildcard:** JSONB payloads vary wildly in size. Set a max payload size (e.g., 64 KB) at the store level to prevent storage blowout.

### Append-Only Implications

The spec says "append-only by default." At 1B records, this means:
- No UPDATE path reduces write amplification (good for LSM-tree stores)
- But storage grows monotonically — need a retention/archival policy
- The `sequenceNumber` checkpoint pattern (§20) helps: only the highest-sequence marker per subject+origin is authoritative, so older checkpoints can be archived

---

## 7. Additional Recommendations

1. **Add cursor-based pagination** to `ClaimQuery` — essential for any production backend
2. **Add `storedAt` timestamp** to `StoredClaim` — separate operational time from semantic time
3. **Add `schemaVersion`** to `StoredClaim` for migration support
4. **Extend content-addressed IDs** from 16 to 32 hex characters minimum
5. **Add a `count(query)` method** to `ClaimStoreBackend` for pagination metadata
6. **Document concurrency semantics** — should `put()` be idempotent (upsert) or reject duplicates?
7. **Add batch operations** — `putMany(claims[])` and `queryStream()` for bulk ingest (the `ingestMarker` function creates 1+N claims per marker)
8. **Consider a separate marker store** — the claim store conflates marker storage with claim storage via `claimFromMarker()`. At scale, markers and derived claims have different access patterns and lifecycle

---

## Verdict: **Well-Designed**

The data model is thoughtfully structured for its purpose. The separation of queryable metadata from opaque payloads, the clean backend interface, the GDPR-aware deletion, and the append-only design are all correct architectural choices. The content-addressed IDs, open enum types, and module system handle evolution well.

The issues identified (ID truncation, missing pagination, no storedAt/schemaVersion) are normal gaps for a v1 implementation and are straightforward to address. None are fundamental — they're the kind of things you fix when moving from reference implementation to production.

The claim store pattern of decomposing markers into typed claims is particularly smart — it normalizes a deeply nested document into flat, queryable records while preserving the full marker in payload. This is the right architecture for a system that needs both structured queries and document fidelity.

**Production readiness:** Add the 8 recommendations above, pick SQLite for edge/agent-local and Postgres for multi-tenant, and this is ready for production.
