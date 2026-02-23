# Security Audit: cellar-door-exit & Integration Packages

**Auditor:** Blind audit (adversarial)  
**Date:** 2026-02-23  
**Scope:** `cellar-door-exit/src/`, `integrations/vercel-ai-sdk/src/`, `integrations/langchain/src/`, `integrations/mcp-server/src/`  
**Methodology:** Manual source code review, adversarial threat modeling

---

## Executive Summary

The cellar-door-exit package is a well-structured cryptographic signing library with solid foundations. The dependency choices are excellent (@noble/* is audited, reputable, and pure-JS). No critical vulnerabilities were found. The main concerns are around private key exposure in integration layers, unbounded accumulation in the LangChain callback handler, and several medium-severity input validation gaps.

**Finding Count:** 2 HIGH, 6 MEDIUM, 5 LOW, 5 INFO

---

## 1. Core Package: cellar-door-exit

### FINDING-01: Private Key Exposure via CLI `keygen` and `create --sign`
**Severity:** HIGH  
**File:** `cellar-door-exit/src/cli.ts:209-220, 258-267`

The `keygen` command outputs the private key to stdout. The `create --sign` command (without `--key`) outputs the generated private key to stderr. While documented, this creates risk:

- Private keys in shell history if piped/redirected
- Private keys in log aggregators capturing stderr
- No warning about secure storage

```typescript
// cli.ts:258-267
process.stderr.write(
  JSON.stringify({
    _generated_keypair: {
      did: didFromPublicKey(publicKey),
      publicKey: toHex(publicKey),
      privateKey: toHex(privateKey),  // Private key to stderr
    },
  }) + "\n"
);
```

**Recommendation:** Add prominent warnings. Consider writing key files directly with restrictive permissions (0600) instead of stdout/stderr.

---

### FINDING-02: MCP Server Exposes Private Key Material in Tool Responses
**Severity:** HIGH  
**File:** `integrations/mcp-server/src/server.ts:27-44, 71-97`

The `generate_identity` tool returns `identity.publicKey` (a Uint8Array) directly in JSON. While it doesn't explicitly return the private key, the `publicKey` field is a raw Uint8Array which JSON.stringify serializes as `{"0":237,"1":1,...}` — ugly but not a security issue per se.

However, the `sessionIdentity` is stored as module-level state including the private key. A compromised AI calling `quick_exit` or `create_exit_marker` repeatedly gets markers signed by the same key, and the private key persists in server memory for the entire session.

More critically, in `quick_exit` (line 71-97), `result.identity.publicKey` is returned. If the `Identity` type's `publicKey` is accidentally swapped with `privateKey` in a future refactor, this becomes a key leak. The code lacks defensive guards.

```typescript
// server.ts:88-91 — returns identity material to LLM
identity: {
  did: result.identity.did,
  publicKey: result.identity.publicKey,  // Uint8Array serialized
},
```

**Recommendation:** 
1. Never return raw key bytes to tool responses — return only the DID string
2. Clear `sessionIdentity.privateKey` from responses explicitly
3. Consider a `toSafeIdentity()` helper that strips private key material

---

### FINDING-03: No Timing-Safe Comparison for Signature Verification
**Severity:** MEDIUM  
**File:** `cellar-door-exit/src/crypto.ts:52-59`

The `verify()` function delegates to `ed.verify()` from @noble/ed25519, which internally uses constant-time operations. However, the `verifyAnchorRecord` function in `anchor.ts:66` uses direct string comparison (`record.hash !== computed`) which is not timing-safe.

```typescript
// anchor.ts:66
if (record.hash !== computed) return false;
```

For anchor hash verification this is LOW risk (hashes are not secrets), but the pattern could be copied to security-sensitive code.

**Recommendation:** Document that `===` for hash comparison is acceptable here since hashes are public values. For any future secret comparison, use `crypto.timingSafeEqual`.

---

### FINDING-04: JSON.parse Without Size Limits (DoS via Large Payloads)
**Severity:** MEDIUM  
**File:** `cellar-door-exit/src/interop.ts:193-198`, `cellar-door-exit/src/convenience.ts:63-70`, `cellar-door-exit/src/storage.ts:37`

Multiple functions call `JSON.parse()` on untrusted input without size bounds:

- `deserializeFromTransport()` reads a 4-byte length prefix (max ~4GB) and parses
- `fromJSON()` parses arbitrary strings
- `loadMarker()` / `importMarker()` parse file contents
- `FileChainAdapter.readEntries()` reads entire file into memory

An attacker could craft a transport buffer with length prefix `0xFFFFFFFF` to attempt allocation of ~4GB.

```typescript
// interop.ts:193-198
export function deserializeFromTransport(buffer: Buffer): ExitMarker {
  if (buffer.length < 4) throw new Error("Transport buffer too short");
  const length = buffer.readUInt32BE(0);  // Up to 4,294,967,295 bytes
  if (buffer.length < 4 + length) throw new Error("Transport buffer truncated");
  const json = buffer.slice(4, 4 + length).toString("utf-8");
  return JSON.parse(json) as ExitMarker;  // No size validation
}
```

**Recommendation:** Add a maximum payload size constant (e.g., 1MB) and reject inputs exceeding it.

---

### FINDING-05: `btoa`/`atob` Usage for Binary Data — Not Safe for All Byte Sequences
**Severity:** MEDIUM  
**File:** `cellar-door-exit/src/proof.ts:27`, `cellar-door-exit/src/ceremony.ts:75`, and throughout

Signatures are encoded via `btoa(String.fromCharCode(...sig))`. This works for Ed25519's 64-byte signatures but is fragile:

```typescript
const proofValue = btoa(String.fromCharCode(...sig));
```

For large Uint8Arrays, `String.fromCharCode(...sig)` will blow the call stack due to spread operator limits (~65k args). Ed25519 sigs are 64 bytes so this is safe in practice, but it's a latent bug for any future use with larger data.

**Recommendation:** Use a proper base64 encoding utility (e.g., `Buffer.from(sig).toString('base64')` in Node.js) instead of the spread + btoa pattern.

---

### FINDING-06: `require()` in ESM CLI Code
**Severity:** MEDIUM  
**File:** `cellar-door-exit/src/cli.ts:245`

```typescript
const ed = require("@noble/ed25519") as typeof import("@noble/ed25519");
```

Dynamic `require()` in an ESM module (`"type": "module"` in package.json). This will throw at runtime in pure ESM environments. It's also a potential injection vector if `NODE_PATH` or module resolution is manipulated.

**Recommendation:** Use dynamic `import()` instead: `const ed = await import("@noble/ed25519")`.

---

### FINDING-07: Filesystem Path Traversal in Storage Functions
**Severity:** MEDIUM  
**File:** `cellar-door-exit/src/storage.ts:17-19, 28-31`

The `saveMarker` and `loadMarker` functions sanitize the marker ID by replacing non-alphanumeric chars with `_`, but the `dir` parameter is used directly without validation:

```typescript
export function saveMarker(marker: ExitMarker, dir: string): string {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const safeId = marker.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filePath = join(dir, `${safeId}.json`);
  writeFileSync(filePath, JSON.stringify(marker, null, 2), "utf-8");
```

While the `id` is sanitized, the `dir` parameter from CLI `--dir` is not. An attacker with CLI access could write to arbitrary directories.

**Recommendation:** Validate `dir` against path traversal (e.g., resolve and check it doesn't escape a base directory). For the CLI this is low risk (user already has shell access), but the library function should document this.

---

### FINDING-08: `createCompromiseMarker` Uses Private Key Where Public Key Expected
**Severity:** MEDIUM  
**File:** `cellar-door-exit/src/key-compromise.ts:37`

```typescript
const publicKey = signingKey; // We need the public key for signing; caller provides private key
```

The comment and code are contradictory. `signingKey` is the private key (used for `sign()` on line 56), but it's aliased as `publicKey`. This variable is never actually used as a public key in the function, so it's dead code with a misleading name — but it indicates confusion that could lead to bugs.

**Recommendation:** Remove the misleading alias. The function doesn't need the public key since it uses `newDid` directly for `verificationMethod`.

---

### FINDING-09: No Validation of DID Format in `createMarker`
**Severity:** LOW  
**File:** `cellar-door-exit/src/marker.ts:47-50`

`createMarker` validates that `subject` is a non-empty string but doesn't validate DID format. The `validate.ts` validator checks DID format only if the subject starts with `did:`. An attacker could create markers with arbitrary subject strings.

**Recommendation:** Consider requiring DID format for subjects, or document that arbitrary subject identifiers are acceptable.

---

### FINDING-10: Unbounded Marker Accumulation in LangChain Callback Handler
**Severity:** LOW  
**File:** `integrations/langchain/src/exit-callback.ts:33`

```typescript
readonly markers: ExitMarker[] = [];
```

The `markers` array grows without bound. In long-running LangChain applications with many chain/agent completions, this will leak memory indefinitely.

**Recommendation:** Add a configurable `maxMarkers` limit, or use a ring buffer, or provide a `clear()` method and document the need to call it periodically.

---

### FINDING-11: MCP Server Session Identity Persists Across Tool Calls
**Severity:** LOW  
**File:** `integrations/mcp-server/src/server.ts:16`

```typescript
let sessionIdentity: Identity | null = null;
```

The session identity (including the private key) persists in memory for the entire MCP server lifetime. If the server process is compromised or memory-dumped, all markers signed in that session can be forged.

**Recommendation:** Consider ephemeral identities per-call, or provide a `rotate_identity` / `clear_identity` tool. Document the threat model.

---

### FINDING-12: Malicious LLM Can Abuse Exit Tools to Generate Unlimited Markers
**Severity:** LOW  
**File:** `integrations/vercel-ai-sdk/src/exit-tool.ts`, `integrations/langchain/src/exit-tool.ts`, `integrations/mcp-server/src/server.ts`

All three integrations allow an LLM to call the exit tool with any `origin` and `exitType` without rate limiting. A compromised or misbehaving LLM could:
- Generate thousands of markers to waste compute (key generation is the bottleneck)
- Create markers with misleading origins (e.g., `origin: "openai.com"`)
- Flood downstream storage if `onMarkerCreated` writes to disk

**Recommendation:** Add rate limiting options. Consider an allowlist for valid origins. Document that the calling application should implement rate limits.

---

### FINDING-13: `canonicalize()` Does Not Handle Circular References
**Severity:** LOW  
**File:** `cellar-door-exit/src/marker.ts:85-93`

The `canonicalize()` function recurses into objects without cycle detection. A circular reference would cause a stack overflow. While ExitMarker types shouldn't have cycles, the function accepts `unknown`.

**Recommendation:** Add a depth limit or seen-set for defensive programming.

---

### FINDING-14: No `eval`, `Function()`, or Dynamic Code Execution Found
**Severity:** INFO  
**File:** Entire codebase

No instances of `eval()`, `new Function()`, `vm.runInContext()`, or any dynamic code execution were found. ✅

---

### FINDING-15: Dependency Supply Chain Assessment
**Severity:** INFO  
**File:** `cellar-door-exit/package.json`

All production dependencies are reputable:

| Dependency | Assessment |
|---|---|
| `@noble/ed25519` ^2.3.0 | ✅ Audited, pure-JS, by paulmillr. Best-in-class. |
| `@noble/hashes` ^1.8.0 | ✅ Same author, audited. |
| `@noble/ciphers` ^2.1.1 | ✅ Same author, audited. |
| `@noble/curves` ^2.0.1 | ✅ Same author, audited. |
| `commander` ^14.0.3 | ✅ Most popular Node.js CLI framework, well-maintained. |

Integration dependencies:
| Dependency | Assessment |
|---|---|
| `@modelcontextprotocol/sdk` ^1.26.0 | ✅ Official Anthropic MCP SDK |
| `zod` ^3.23.0 | ✅ Industry-standard schema validation |
| `ai` (peer) | ✅ Official Vercel AI SDK |
| `@langchain/core` (peer) | ✅ Official LangChain |

No dependency supply chain concerns. ✅

---

### FINDING-16: Error Messages Do Not Leak Sensitive State
**Severity:** INFO  
**File:** `cellar-door-exit/src/errors.ts`, `cellar-door-exit/src/cli.ts`

Error messages are well-structured and do not leak private keys, internal paths, or sensitive cryptographic state. The CLI error handler does print stack traces for unexpected errors, which is appropriate for a CLI tool.

One minor note: `cli.ts:172` prints `e.stack` for unexpected errors, which could reveal internal file paths in production deployments. This is standard CLI behavior and acceptable.

---

### FINDING-17: Marker Tampering Resistance Assessment
**Severity:** INFO  
**File:** `cellar-door-exit/src/proof.ts`, `cellar-door-exit/src/marker.ts`

The signing/verification scheme is sound:
- Signs canonical JSON of marker content (excluding proof)
- Ed25519 via @noble/ed25519 (constant-time, audited)
- Content-addressed IDs via SHA-256
- Verification checks both schema and signature

An attacker cannot forge markers without the private key. Modifying any signed field invalidates the signature. The canonicalization is deterministic (sorted keys, recursive). ✅

---

### FINDING-18: `verifyMarker` Does Not Verify Subject-Key Binding
**Severity:** INFO  
**File:** `cellar-door-exit/src/proof.ts:57-77`

`verifyMarker` verifies that the signature is valid for the key in `proof.verificationMethod`, but does NOT verify that `proof.verificationMethod` matches `marker.subject`. This means anyone with any key can sign a marker claiming to be any subject.

This is by design (the subject DID and signing key may differ, e.g., delegation scenarios), but it means the signature proves "someone with key X signed this" — not "the subject signed this."

**Recommendation:** Document this explicitly. Consider an optional strict mode that verifies `subject === proof.verificationMethod` for self-signed markers.

---

## 2. Integration: @cellar-door/vercel-ai-sdk

### Assessment: Generally Safe

- **No private key exposure:** The `exitMarkerTool` calls `quickExit` and returns only public marker data (JSON, ID, subject, origin, type, timestamp). Private keys are not included in tool responses. ✅
- **Input validation:** Uses Zod schemas via the Vercel AI SDK `tool()` helper. Origin and exitType are validated. ✅
- **No injection vectors:** No string interpolation into commands, SQL, or code. ✅
- **`withExitMarker` callback:** Wraps user callbacks safely, calls `quickExit` independently. No issues. ✅

The only concern is FINDING-12 (no rate limiting) noted above.

---

## 3. Integration: @cellar-door/langchain

### Assessment: Generally Safe, Memory Leak Concern

- **No private key exposure:** `createExitTool` returns `toJSON(marker)` which includes the proof but not the private key. ✅
- **Input validation:** Uses Zod schema. ✅
- **Memory leak:** FINDING-10 — `ExitCallbackHandler.markers` grows unbounded. This is the most significant issue in this integration.
- **No injection vectors:** ✅

---

## 4. Integration: @cellar-door/mcp-server

### Assessment: Highest Risk Surface

The MCP server is the most exposed integration because it's directly accessible to potentially compromised AI models.

- **FINDING-02 (HIGH):** Identity material returned in tool responses
- **FINDING-11 (LOW):** Session identity persistence
- **FINDING-12 (LOW):** No rate limiting
- **Input validation:** Uses Zod via MCP SDK. ✅
- **No injection vectors:** ✅
- **`fromJSON` in verify tool:** Properly validates before verification. ✅

The `verify_exit_marker` tool accepts arbitrary JSON from the LLM. The `fromJSON` function validates it, so malformed input is handled gracefully with error responses. ✅

---

## Risk Summary

| # | Finding | Severity | Component |
|---|---|---|---|
| 01 | Private key output to stdout/stderr in CLI | HIGH | core/cli |
| 02 | Identity material in MCP tool responses | HIGH | mcp-server |
| 03 | Non-timing-safe hash comparison (low practical risk) | MEDIUM | core/anchor |
| 04 | No payload size limits on JSON.parse | MEDIUM | core/interop,convenience,storage |
| 05 | Fragile btoa/atob base64 encoding | MEDIUM | core/proof,ceremony |
| 06 | `require()` in ESM module | MEDIUM | core/cli |
| 07 | Unsanitized `dir` parameter in storage | MEDIUM | core/storage |
| 08 | Misleading variable name in key-compromise | MEDIUM | core/key-compromise |
| 09 | No DID format enforcement in createMarker | LOW | core/marker |
| 10 | Unbounded marker accumulation | LOW | langchain |
| 11 | Session identity persistence | LOW | mcp-server |
| 12 | No rate limiting on exit tools | LOW | all integrations |
| 13 | No circular reference protection in canonicalize | LOW | core/marker |
| 14 | No eval/dynamic code execution | INFO | all |
| 15 | Dependencies are reputable and audited | INFO | all |
| 16 | Error messages don't leak secrets | INFO | core |
| 17 | Marker tampering resistance is sound | INFO | core |
| 18 | No subject-key binding verification | INFO | core/proof |

---

## Recommendations Priority

1. **Immediate:** Strip private key material from all MCP/integration tool responses (FINDING-02)
2. **Immediate:** Add payload size limits to deserialization functions (FINDING-04)
3. **Short-term:** Fix `require()` to `import()` in CLI (FINDING-06)
4. **Short-term:** Add `maxMarkers` / `clear()` to LangChain callback handler (FINDING-10)
5. **Short-term:** Replace `btoa(String.fromCharCode(...))` with `Buffer.from().toString('base64')` (FINDING-05)
6. **Medium-term:** Add rate limiting options to integration tools (FINDING-12)
7. **Medium-term:** Document subject-key binding behavior (FINDING-18)

---

## Positive Observations

- **Excellent dependency choices.** The @noble/* suite is the gold standard for JS cryptography.
- **No dynamic code execution anywhere.** No eval, Function, vm, or similar.
- **Clean error handling.** Structured error classes with codes, no secret leakage.
- **Immutable patterns.** Marker functions return new objects; originals are not mutated.
- **Content-addressed IDs.** Prevents ID collision attacks.
- **Good separation of concerns.** Core crypto, signing, validation, and integration layers are cleanly separated.
- **Canonicalization before signing.** Prevents field-ordering attacks on signature verification.
