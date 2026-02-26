# PROC-SEC-001 v1.0 — Supply Chain & Dependency Review

**Package:** cellar-door-exit v0.2.0  
**Audit commit:** 8f29a96  
**Date:** 2026-02-26  
**Auditor:** Supply Chain Security Analyst (automated)  
**Standards:** SLSA Level 1, npm best practices

---

## Findings

### SUPPLY-001: npm audit — PASS ✅

**Severity:** Informational  
**Evidence:** `npm audit` returned `found 0 vulnerabilities`.  
**Assessment:** Zero critical, high, moderate, or low vulnerabilities in the dependency tree.

### SUPPLY-002: All dependencies from known, maintained packages — PASS ✅

**Severity:** Informational  
**Evidence:** Production dependencies are:
- `@noble/ciphers@2.1.1` — Paul Miller, audited cryptography library
- `@noble/curves@2.0.1` — Paul Miller, audited cryptography library
- `@noble/ed25519@2.3.0` — Paul Miller, audited cryptography library
- `@noble/hashes@1.8.0` — Paul Miller, audited cryptography library
- `commander@14.0.3` — TJ Holowaychuk / Open JS Foundation, most popular CLI framework

All packages are widely used, actively maintained, and from reputable authors.

### SUPPLY-003: Minimal dependency tree — PASS ✅

**Severity:** Informational  
**Evidence:** Full production tree has only 6 resolved packages (5 direct + 1 transitive: `@noble/hashes@2.0.1` via `@noble/curves`). Zero non-noble transitive dependencies beyond commander (which has zero deps).  
**Assessment:** Exceptionally minimal attack surface for a cryptographic package.

### SUPPLY-004: Lock file committed — PASS ✅

**Severity:** Informational  
**Evidence:** `package-lock.json` exists (81,384 bytes), last committed at audit commit `8f29a96`.  
**Assessment:** Ensures reproducible builds.

### SUPPLY-005: No dangerous post-install scripts — PASS ✅

**Severity:** Informational  
**Evidence:** Only post-install script found: `esbuild/package.json: "postinstall": "node install.js"` — this is a **devDependency** (transitive via tsup). No production dependency has install scripts.  
**Assessment:** No risk to consumers or CI pipelines running `npm install --omit=dev`.

### SUPPLY-006: @noble/* from verified @paulmillr — PASS ✅

**Severity:** Informational  
**Evidence:** All four @noble packages list:
- Author: `"Paul Miller (https://paulmillr.com)"`
- Repository: `github.com/paulmillr/noble-*`

These are the canonical, audited noble cryptography libraries. No forks or typosquats.

### SUPPLY-007: No known supply chain compromises — PASS ✅

**Severity:** Informational  
**Evidence:** 
- `npm audit` reports zero vulnerabilities
- @noble/* packages have undergone professional security audits (Cure53, Trail of Bits)
- commander has no history of compromise
- No advisories found for any dependency at current versions

### SUPPLY-008: devDependencies not bundled — PASS ✅

**Severity:** Informational  
**Evidence:** `package.json` uses `"files"` field limiting published content to `["dist", "README.md", "LICENSE", "CHANGELOG.md"]`. devDependencies (`vitest`, `tsup`, `tsx`, `typescript`, `fast-check`, `@langchain/core`, `zod`, `@types/node`) are excluded from published package.  
**Assessment:** No dev tooling leaks into published artifact.

### SUPPLY-009: Package exports minimal — PASS ✅

**Severity:** Informational  
**Evidence:** Single export entry point `"."` with conditional ESM/CJS resolution:
```json
{
  ".": {
    "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
  }
}
```
Plus `"bin": { "exit": "./dist/cli.js" }`.  
**Assessment:** Minimal, well-structured exports. No wildcard or overly broad patterns.

### SUPPLY-010: Published content limited — PASS ✅

**Severity:** Informational  
**Evidence:** Both `.npmignore` and `"files"` field are present.
- `"files"`: `["dist", "README.md", "LICENSE", "CHANGELOG.md"]`
- `.npmignore` excludes: `src/`, `benchmarks/`, `docs/`, `*.test.ts`, `tsconfig.json`, `.gitignore`

**Assessment:** Double-layered protection. Source code, tests, and build config excluded from published package.

### SUPPLY-011: No native code in production dependencies — PASS ✅

**Severity:** Informational  
**Evidence:** Native binaries found only in devDependencies (`@rollup/rollup-linux-x64-*`). All production dependencies (@noble/*, commander) are pure JavaScript/TypeScript.  
**Assessment:** No native compilation required. No binary supply chain risk for consumers.

---

## Summary Table

| # | Check | Result |
|---|-------|--------|
| SUPPLY-001 | npm audit: zero critical/high | ✅ PASS |
| SUPPLY-002 | All deps from known, maintained packages | ✅ PASS |
| SUPPLY-003 | Minimal dependency tree | ✅ PASS |
| SUPPLY-004 | Lock file committed | ✅ PASS |
| SUPPLY-005 | No dangerous post-install scripts | ✅ PASS |
| SUPPLY-006 | @noble/* from verified @paulmillr | ✅ PASS |
| SUPPLY-007 | No known supply chain compromises | ✅ PASS |
| SUPPLY-008 | devDependencies not bundled | ✅ PASS |
| SUPPLY-009 | Package exports minimal | ✅ PASS |
| SUPPLY-010 | Published content limited | ✅ PASS |
| SUPPLY-011 | No native code in production deps | ✅ PASS |

**Overall: 11/11 PASS — No supply chain findings.**

---

## Full Production Dependency Tree

```
cellar-door-exit@0.2.0
├── @noble/ciphers@2.1.1
├── @noble/curves@2.0.1
│   └── @noble/hashes@2.0.1
├── @noble/ed25519@2.3.0
├── @noble/hashes@1.8.0
└── commander@14.0.3
```

**Total production packages:** 6 (5 direct, 1 transitive)  
**Total devDependency packages:** not enumerated (excluded from published artifact)

---

*End of PROC-SEC-001 v1.0 Supply Chain Review*
