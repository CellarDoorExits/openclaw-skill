# Cellar Door / EXIT — Style Guide

## Terminology Conventions

### "Departure" vs "Transition"

| Term | Context | Use when |
|------|---------|----------|
| **Departure** | External-facing, public docs, pitches, README | General audience; emphasizes the act of leaving |
| **Transition** | NIST submissions, regulatory filings, formal standards work | Regulatory/compliance contexts; aligns with NIST SP 800-63 and identity lifecycle language |

### "Agent" vs "Subject"

| Term | Context | Use when |
|------|---------|----------|
| **Agent** | General discussion, pitches, blog posts, README | Broad audience; encompasses humans, AI agents, organizations |
| **Subject** | Specification, formal paper, test vectors, code | Formal/technical contexts; aligns with W3C VC data model (`credentialSubject`) |

### Proof Type

The canonical proof type is **`DataIntegrityProof`** (per W3C Data Integrity specification).

Do **not** use:
- ~~`Ed25519Signature2020`~~ (legacy; acceptable in existing test vectors but new docs should reference `DataIntegrityProof`)
- ~~`Ed25519Signature2018`~~ (deprecated)
- ~~`JsonWebSignature2020`~~ (different spec family)

> **Note:** The current codebase uses `Ed25519Signature2020` in test vectors and implementation for pragmatic reasons (direct Ed25519 without the Data Integrity envelope). Future versions should migrate to `DataIntegrityProof` with `cryptosuite: eddsa-rdfc-2022`.

## General Style

- Use ISO 8601 for all dates/timestamps
- Use DIDs for all identity references
- Capitalize EXIT when referring to the protocol; lowercase "exit" for the general concept
- "Cellar Door" is two words, title case
