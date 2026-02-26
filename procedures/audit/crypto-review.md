# Cryptographic Implementation Review — cellar-door-exit v0.2.0

**Audit Date:** 2026-02-26  
**Audit Commit:** 8f29a96  
**Procedure:** PROC-SEC-001 v1.0  
**Auditor:** Subagent (audit-pass1-crypto)  
**Standards:** OWASP OCVS, NIST SP 800-131A, NIST SP 800-57

---

## Scope

Files reviewed:
- `src/crypto.ts` — key generation, signing, verification, DID encoding
- `src/proof.ts` — marker signing/verification, trust enhancer verification
- `src/signer.ts` — signer abstraction, algorithm detection
- `src/privacy.ts` — ECDH encryption, redaction, minimal disclosure
- `src/pre-rotation.ts` — pre-rotation key management
- `src/keri.ts` — KERI key event log, inception, rotation, verification
- `src/key-compromise.ts` — compromise recovery markers
- `src/modules/trust.ts` — confidence scoring, commit-reveal, tenure attestation

---

## Checklist Results

### Core Crypto

| Item | Result | Evidence |
|------|--------|----------|
| Key generation uses CSPRNG | **PASS** | `ed.utils.randomPrivateKey()` (crypto.ts:44), `p256.utils.randomSecretKey()` (crypto.ts:179), `randomBytes(32)` from @noble/ciphers (privacy.ts:63,68) — all use `crypto.getRandomValues` internally |
| Private keys never logged/serialized/exposed in errors | **PASS** | Error messages use generic text (`Failed to sign marker: ...`). Private keys stored as class fields (`_privateKey`) but never serialized. No `console.log` or `JSON.stringify` on private keys found. |
| Signature algorithms match spec | **PASS** | Ed25519Signature2020, EcdsaP256Signature2019 — standard proof type strings (signer.ts:153-157) |
| Signature format canonical and documented | **PASS** | Ed25519: 64-byte raw. P-256: 64-byte compact r‖s with lowS normalization (noble/curves default). Base64-encoded for proofValue. |
| Hash functions collision-resistant | **PASS** | SHA-256 (hashing/KDF), SHA-512 (Ed25519 internal). No MD5/SHA-1. |
| No deprecated/weak algorithms | **PASS** | Only Ed25519 and P-256 — both NIST-approved, no RSA-1024, no 3DES, no SHA-1 |
| Constant-time comparison (library-level) | **PASS** | All signature verification delegated to `ed.verify()` and `p256.verify()` — @noble libraries use constant-time field arithmetic |
| Domain separation | **FAIL** | See [CRYPTO-001] and [CRYPTO-002] |
| Key encoding roundtrips lossless | **PASS** | base58btc encode/decode handles leading zeros correctly (crypto.ts:93-98, 113-118). DID→key→DID roundtrip verified by test suite. |
| Multicodec prefixes correct | **PASS** | Ed25519: `[0xed, 0x01]` (varint for 0xed01) ✓. P-256: `[0x80, 0x24]` (varint for 0x1200) ✓. Both match did:key spec. |
| Base58btc handles leading zeros | **PASS** | Encode: prepends '1' for each leading zero byte (crypto.ts:93-97). Decode: counts leading '1' chars (crypto.ts:113-118). |
| No custom crypto | **PASS** | All primitives from @noble/{ed25519,curves,hashes,ciphers}. base58btc is encoding, not crypto. Canonicalization is JSON deterministic serialization. |
| Library versions current, no CVEs | **PASS** | @noble/ed25519@2.3.0, @noble/curves@2.0.1, @noble/hashes@1.8.0, @noble/ciphers@2.1.1. `npm audit` reports 0 vulnerabilities. |

### Key Lifecycle (NIST SP 800-57)

| Item | Result | Evidence |
|------|--------|----------|
| Key storage security | **FAIL** | See [CRYPTO-003] |
| Key rotation mechanism exists | **PASS** | Full KERI-style key event log with inception and rotation (keri.ts). Pre-rotation commitment scheme (pre-rotation.ts). |
| Key revocation documented | **PASS** | Key compromise markers (key-compromise.ts) link compromised DID to rotated successor. `flagCompromisedPlatformMarkers` handles platform-level compromise windows. |
| Key destruction (zeroing) | **FAIL** | See [CRYPTO-004] |

### Side-Channel Resistance

| Item | Result | Evidence |
|------|--------|----------|
| Constant-time in all crypto paths | **PASS** | All crypto operations delegated to @noble/* which provides constant-time field arithmetic |
| No secret-dependent branching | **PASS** | Application code does not branch on secret values. Signing functions are straight-through calls to @noble. |
| No secret-dependent memory access | **PASS** | No lookup tables indexed by secret data in application code |
| Error messages don't reveal which check failed | **ADVISORY** | See [CRYPTO-005] |
| Timing of verify cycle is input-independent | **PASS** | `verify()` and `verifyP256()` catch all exceptions and return false (crypto.ts:82-86, 197-201). No early-exit based on partial verification. |

### Nonce Management

| Item | Result | Evidence |
|------|--------|----------|
| Nonce generation method | **PASS** | XChaCha20-Poly1305 uses 24-byte random nonce from `randomBytes(24)` (privacy.ts:68). Ed25519 uses deterministic nonce (RFC 8032). P-256 uses RFC 6979 deterministic nonce. |
| Uniqueness guarantee | **PASS** | 24-byte random nonce gives 2^192 space — collision probability negligible. Ed25519/P-256 nonces are deterministic per (key, message). |
| Nonce-misuse resistance | **ADVISORY** | XChaCha20-Poly1305 is not nonce-misuse resistant (unlike AES-GCM-SIV). However, 24-byte random nonces make reuse astronomically unlikely. Acceptable. |

### Signature Malleability

| Item | Result | Evidence |
|------|--------|----------|
| Ed25519 strict verification | **FAIL** | See [CRYPTO-006] |
| P-256 low-S normalization | **PASS** | @noble/curves defaults `lowS: true` for both signing and verification (weierstrass.js:934). Signatures with high-S are rejected on verify. |

---

## Findings

### [CRYPTO]-[001]: Missing Domain Separation in Compromise Markers

- **Severity:** HIGH
- **Location:** `src/key-compromise.ts:113-114`
- **Description:** `createCompromiseMarker` signs the canonical marker content without the `DOMAIN_PREFIX` ("exit-marker-v1.1:") that is used by `signMarker` and `signMarkerWithSigner` in `proof.ts`. This means compromise markers use a different signing domain than regular markers, and the `verifyMarker` function (which prepends the domain prefix) will reject these signatures. More critically, the absence of domain separation could enable cross-protocol signature replay if the same keys are used in another context that signs arbitrary canonical JSON.
- **Evidence:**
  ```typescript
  // key-compromise.ts:113-114 — NO domain prefix
  const canonical = canonicalize({ ...marker, proof: undefined });
  const data = new TextEncoder().encode(canonical);

  // proof.ts:40 — HAS domain prefix
  const data = new TextEncoder().encode(DOMAIN_PREFIX + canonical);
  ```
- **Recommendation:** Use the same `DOMAIN_PREFIX` constant in `createCompromiseMarker`. Verify that `verifyMarker` can successfully round-trip compromise markers. Consider extracting the "sign marker payload" logic into a single shared function.
- **Status:** OPEN

### [CRYPTO]-[002]: Missing Domain Separation in Trust Module Signatures

- **Severity:** MEDIUM
- **Location:** `src/modules/trust.ts:96`, `src/modules/trust.ts:184`
- **Description:** Tenure attestation signing (`createTenureAttestation`, line 96) and commitment signing (`createCommitment`, line 184) do not use any domain prefix. While these are different data structures from markers (so accidental collision is unlikely), there is no domain tag to prevent a tenure attestation signature from being interpreted in another context if the canonical JSON happens to collide. This violates the principle of domain separation.
- **Evidence:**
  ```typescript
  // trust.ts:96 — tenure attestation, no domain prefix
  const sig = sign(new TextEncoder().encode(data), privateKey);

  // trust.ts:184 — commitment, no domain prefix
  const sig = sign(new TextEncoder().encode(commitData), privateKey);
  ```
- **Recommendation:** Add unique domain prefixes: e.g., `"tenure-attestation-v1:"` and `"exit-commitment-v1:"`. This prevents cross-context signature reuse even if the canonical payloads happen to match.
- **Status:** OPEN

### [CRYPTO]-[003]: No Key Storage Security Guidance or Abstraction

- **Severity:** MEDIUM
- **Location:** `src/signer.ts` (entire file), `src/crypto.ts:31` (`KeyPair` interface)
- **Description:** Private keys are held in plain `Uint8Array` fields on `Ed25519Signer._privateKey` and `P256Signer._privateKey`. There is no mechanism for encrypted-at-rest storage, HSM/KMS integration, or secure enclave backing. The `Signer` interface accepts raw private key bytes. While this is a library (not a storage layer), there is no documentation warning consumers about key storage requirements, and no `destroy()` method on signers.
- **Evidence:**
  ```typescript
  // signer.ts:56-57
  export class Ed25519Signer implements Signer {
    private _privateKey: Uint8Array;
    private _publicKey: Uint8Array;
  ```
- **Recommendation:** (1) Add a `destroy()` method to `Signer` that zeros the private key buffer. (2) Document that consumers MUST use secure storage (encrypted file, OS keychain, HSM) for private keys. (3) Consider accepting an opaque signing function instead of raw key bytes for HSM/KMS integration.
- **Status:** OPEN

### [CRYPTO]-[004]: No Key Material Zeroing After Use

- **Severity:** MEDIUM
- **Location:** `src/signer.ts:56-57,79-80`, `src/privacy.ts:63`
- **Description:** Private keys and ephemeral secrets are never zeroed from memory after use. The ephemeral ECDH private key in `encryptMarker` (privacy.ts:63) is particularly concerning — it should be zeroed immediately after the shared secret is derived. JavaScript does not guarantee garbage collection timing, so sensitive bytes may persist in memory indefinitely.
- **Evidence:**
  ```typescript
  // privacy.ts:63-66 — ephemeral key never zeroed
  const ephemeralPrivate = randomBytes(32);
  const ephemeralPublic = x25519.getPublicKey(ephemeralPrivate);
  const shared = x25519.getSharedSecret(ephemeralPrivate, recipientPublicKey);
  const key = sha256(shared);
  // ephemeralPrivate and shared are never zeroed
  ```
- **Recommendation:** After deriving the shared secret, zero the ephemeral private key: `ephemeralPrivate.fill(0)`. After deriving the symmetric key, zero the shared secret: `shared.fill(0)`. Add `destroy()` to `Signer` classes that zeros `_privateKey`. Note: JavaScript's `Uint8Array.fill(0)` is not guaranteed constant-time, but it's the best available option in JS runtimes.
- **Status:** OPEN

### [CRYPTO]-[005]: Verification Error Messages May Aid Attackers (Advisory)

- **Severity:** LOW
- **Location:** `src/proof.ts:81-97`
- **Description:** `verifyMarker` returns specific error messages distinguishing between missing proof, unsupported proof type, incomplete proof fields, subject-key mismatch, algorithm mismatch, and signature failure. An attacker submitting crafted markers can determine exactly which validation stage fails, potentially aiding in constructing a forgery. This is an informational finding — the detailed errors are useful for debugging and the signature itself is not weakened.
- **Evidence:**
  ```typescript
  if (!marker.proof) errors.push("Missing proof");
  if (!alg) errors.push(`Unsupported proof type: ${marker.proof.type}`);
  if (marker.subject && marker.proof.verificationMethod !== marker.subject)
    errors.push("Proof verificationMethod does not match marker subject — possible attribution forgery");
  if (didAlg !== alg) errors.push(`Algorithm mismatch: proof type indicates ${alg} but DID uses ${didAlg}`);
  ```
- **Recommendation:** For production-facing APIs, consider returning a single generic "Verification failed" error. Keep detailed errors available via a debug/verbose mode or internal logging.
- **Status:** OPEN

### [CRYPTO]-[006]: Ed25519 Uses ZIP-215 (Non-Strict) Verification

- **Severity:** LOW
- **Location:** `src/crypto.ts:82` → `@noble/ed25519` (node_modules)
- **Description:** `@noble/ed25519@2.3.0` defaults to ZIP-215 verification (`zip215: true`), which accepts some non-canonical signatures that strict RFC 8032 verification would reject. ZIP-215 is the consensus-compatible choice (used by Solana, etc.) and prevents consensus splits, but it means that for a given (message, key) pair, multiple distinct valid signatures may exist (signature malleability). For EXIT markers this is low risk because markers are content-addressed and signatures are not used as unique identifiers. However, if signatures are ever stored as deduplication keys, this could cause issues.
- **Evidence:**
  ```javascript
  // @noble/ed25519/index.js:460
  const veriOpts = { zip215: true };
  ```
- **Recommendation:** Document the ZIP-215 choice explicitly. If strict verification is needed in the future, pass `{ zip215: false }` to `ed.verify()`. For current use cases, ZIP-215 is acceptable.
- **Status:** OPEN

### [CRYPTO]-[007]: ECDH KDF Uses Raw SHA-256 Without Context Binding

- **Severity:** LOW
- **Location:** `src/privacy.ts:66`
- **Description:** The symmetric key for encryption is derived as `sha256(shared_secret)` with no additional context (salt, info, label). This is a basic KDF that doesn't bind the derived key to the protocol, recipient, or purpose. A proper KDF (HKDF) with context info would prevent key reuse across protocols if the same ECDH shared secret is somehow reused.
- **Evidence:**
  ```typescript
  // privacy.ts:66
  const key = sha256(shared);
  ```
- **Recommendation:** Use HKDF (available via `@noble/hashes/hkdf`) with a protocol-specific info string: e.g., `hkdf(sha256, shared, salt, "cellar-door-exit-v1-encrypt")`. This provides defense-in-depth.
- **Status:** OPEN

### [CRYPTO]-[008]: Signer Classes Expose Private Key via JavaScript Introspection

- **Severity:** LOW
- **Location:** `src/signer.ts:56-57,79-80`
- **Description:** While `_privateKey` is declared `private` in TypeScript, this is compile-time only. At runtime, JavaScript has no access control — `(signer as any)._privateKey` exposes the raw key bytes. This is inherent to the JavaScript runtime and cannot be fully mitigated, but using a `WeakMap` or closure would make accidental exposure less likely.
- **Evidence:**
  ```typescript
  export class Ed25519Signer implements Signer {
    private _privateKey: Uint8Array; // TypeScript-only privacy
  ```
- **Recommendation:** Store private keys in a closure-scoped `WeakMap` keyed by `this`, making them inaccessible via property enumeration. Or use a `#privateKey` ES2022 private field for runtime enforcement.
- **Status:** OPEN

---

## Summary

| Severity | Count | Finding IDs |
|----------|-------|-------------|
| **HIGH** | 1 | CRYPTO-001 |
| **MEDIUM** | 3 | CRYPTO-002, CRYPTO-003, CRYPTO-004 |
| **LOW** | 4 | CRYPTO-005, CRYPTO-006, CRYPTO-007, CRYPTO-008 |
| **CRITICAL** | 0 | — |
| **Total** | **8** | |

### Overall Assessment

The cryptographic implementation is **sound in its fundamentals**. All crypto primitives come from the well-audited `@noble/*` library family with no custom cryptography. Key generation uses CSPRNG, algorithms are modern (Ed25519, P-256, XChaCha20-Poly1305, x25519), and the library versions have no known CVEs.

The primary concern is **inconsistent domain separation** (CRYPTO-001, HIGH) — the `createCompromiseMarker` function signs without the domain prefix used everywhere else, which means those signatures won't verify through the standard `verifyMarker` path and could theoretically be replayed in other contexts. This should be fixed before any production deployment.

Secondary concerns are **key lifecycle hygiene** (CRYPTO-003, CRYPTO-004) — no zeroing of ephemeral or long-lived key material, and no guidance for consumers on secure storage. These are important for defense-in-depth but don't represent immediate exploitability.

The remaining findings are low-severity hardening recommendations that improve the security posture but don't represent vulnerabilities in the current threat model.
