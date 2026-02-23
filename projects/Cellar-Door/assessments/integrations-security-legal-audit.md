# Integration Packages — Security & Legal Audit (EXIT + ENTRY)

**Date:** 2026-02-23  
**Scope:** `vercel-ai-sdk/src/`, `langchain/src/`, `mcp-server/src/` — all source files  
**Auditor:** Automated deep review

---

## SECURITY FINDINGS

### S-01: Unvalidated JSON.parse on arrivalMarkerJson — ALL PACKAGES
**Severity: HIGH**

In `verifyTransferTool` (Vercel), `createTransferVerificationTool` (LangChain), and `verify_transfer` (MCP), the `arrivalMarkerJson` parameter is parsed with raw `JSON.parse()` without try/catch (Vercel & LangChain) or type validation. A malformed string crashes the process.

- **Vercel `entry-tools.ts`:** `JSON.parse(arrivalMarkerJson)` inside `execute` — no try/catch. Unhandled exception kills the tool call and potentially the host.
- **LangChain `transfer-tool.ts`:** Same pattern — bare `JSON.parse`.
- **MCP `server.ts`:** Has try/catch, so crashes are handled. But parsed object is passed to `verifyTransfer` without schema validation — could inject unexpected fields.

**Contrast:** `exitMarkerJson` goes through `fromJSON()` which presumably validates. Arrival markers get no such treatment.

**Recommendation:** Validate arrival marker structure with zod schema before passing to core. Wrap all JSON.parse in try/catch in Vercel/LangChain tools.

---

### S-02: Admission Policy Bypass via Missing Policy Parameter — Vercel & MCP
**Severity: HIGH**

In `verifyAndAdmitAgentTool` (Vercel) and `verify_and_admit` (MCP), the `admissionPolicy` parameter is **optional**. If omitted, **no admission check occurs** — the agent is admitted unconditionally with only signature verification.

This means a malicious LLM can simply omit the policy parameter to skip all admission checks. The tool description says "Default: OPEN_DOOR" but the code doesn't apply any default — it skips entirely.

```typescript
if (admissionPolicy) {  // ← if undefined, no check at all
  ...
}
```

**Recommendation:** Default to OPEN_DOOR when policy is omitted, or make policy required.

---

### S-03: LLM-Controlled Admission Decisions
**Severity: HIGH**

All three packages expose admission evaluation as LLM-callable tools. The LLM chooses:
- Whether to call admission at all (S-02)
- Which policy to apply (OPEN_DOOR vs STRICT)
- What exit marker JSON to pass (could be crafted/replayed)

A compromised or manipulated LLM can:
1. Skip admission entirely (S-02)
2. Always choose OPEN_DOOR
3. Replay a valid exit marker from a different context

**Recommendation:** Admission policy should be set by the platform operator (server-side config), not as a tool parameter. At minimum, allow a server-side minimum policy floor.

---

### S-04: No Replay Protection at Integration Layer
**Severity: MEDIUM**

None of the integration tools check whether an exit marker has already been claimed/used. If the core `quickEntry` doesn't enforce single-use claims (or uses an in-memory store that resets), the same exit marker can be admitted repeatedly.

The integration layer has no `ClaimStore` integration — it relies entirely on the core's default behavior.

**Recommendation:** Document claim store requirements. Consider exposing claim store configuration in integration constructors.

---

### S-05: HIGH-01 Fix (Private Key Leak) — INTACT ✓
**Severity: INFO**

MCP `generate_identity` returns only `did` + message. `quick_exit` returns `marker` + `signerDid` + `verified`. No private key material in any response across all three packages. The `sessionIdentity` is stored server-side only.

**Status:** Fix intact.

---

### S-06: HIGH-02 Fix (MCP Private Key in Responses) — INTACT ✓  
**Severity: INFO**

Same as S-05 — verified across all new ENTRY tools. No tool in any package returns `privateKey`, `identity.privateKey`, or similar.

**Status:** Fix intact.

---

### S-07: LangChain Memory Leak Fix — INTACT ✓
**Severity: INFO**

`ExitCallbackHandler` has `maxMarkers` (default 1000) with eviction on both `markers[]` and `arrivals[]` arrays. The `clear()` method exists for manual cleanup.

**Status:** Fix intact. Arrivals array also bounded.

---

### S-08: MCP Session Identity as Shared Mutable State
**Severity: MEDIUM**

`sessionIdentity` in the MCP server is a module-level mutable variable. `quick_exit` and `create_exit_marker` both write to it. If the MCP server handles concurrent requests (e.g., over SSE transport), there's a race condition where one request's identity overwrites another's mid-operation.

For stdio transport (current default), this is single-client and low risk. For future HTTP/SSE transports, this is a real race condition.

**Recommendation:** Use per-request identity or a mutex.

---

### S-09: Unbounded exitMarkerJson Input Size
**Severity: LOW**

No tool in any package validates the length of `exitMarkerJson` or `arrivalMarkerJson` strings. A malicious caller could pass multi-megabyte strings to trigger expensive JSON parsing and crypto operations.

Zod `.string()` has no `.max()` constraint applied anywhere.

**Recommendation:** Add `.max(65536)` or similar to all marker JSON string parameters.

---

### S-10: LangChain Callback Auto-Arrival Without Verification Context
**Severity: MEDIUM**

When `ExitCallbackHandler` has `arrivalDestination` set, it automatically creates both EXIT and arrival markers on every `handleChainEnd`/`handleAgentEnd`. This creates self-referential transit records (exit from self → arrive at destination) without any external verification.

These markers are cryptographically valid but semantically meaningless for transfer verification — the same entity signs both sides.

**Recommendation:** Document this limitation clearly. Consider requiring separate identity for arrival signing.

---

### S-11: Revocation Forgery via Integration Layer
**Severity: INFO**

No integration tool exposes revocation functionality. Revocation can only occur through direct use of the core `cellar-door-entry` package. The authority check (HIGH-02 fix) in the core prevents unauthorized revocation regardless.

**Status:** Not a concern at integration layer.

---

## LEGAL FINDINGS

### L-01: Automated Admission Creates Platform Operator Liability
**Severity: HIGH**

All three packages enable automated agent admission without human review. If a platform deploys `verifyAndAdmitAgentTool` or `verify_and_admit` (MCP) with OPEN_DOOR policy, it programmatically admits any agent with a valid signature — including potentially malicious or sanctioned agents.

**Exposure:** Platform operators become liable for admitted agents' actions if admission was automated without reasonable safeguards. This parallels "safe harbor" loss in hosting liability (DMCA §512, DSA Art. 6).

**Recommendation:** Document that automated admission shifts liability to the deploying platform. Recommend human-in-the-loop for production deployments or at minimum STRICT policy.

---

### L-02: FCRA Risk from Admission Decisions Based on EXIT Data
**Severity: MEDIUM**

The admission tools evaluate EXIT markers (departure records) to make accept/deny decisions. If EXIT markers contain behavioral data, reputation signals, or "reason" fields that function as character assessments, this could trigger FCRA obligations:

- EXIT markers include `exitType` (voluntary/forced/emergency/keyCompromise) and `reason` fields
- STRICT policy filters by exit type and age — this is functionally a "background check"
- If the "reason" field contains performance or conduct information, it's a consumer report

**Current risk is LOW-MEDIUM** because:
- Markers are self-generated (not third-party reports)
- Current policies evaluate structural fields, not narrative content
- No "furnisher" relationship exists

**Risk increases if:** platforms share exit markers with reason fields containing behavioral assessments across organizational boundaries.

**Recommendation:** Add FCRA analysis to documentation. Warn against including behavioral assessments in `reason` fields if markers will be used cross-platform.

---

### L-03: LangChain Callback Auto-Recording as Consent-less Data Collection
**Severity: MEDIUM**

`ExitCallbackHandler` with `arrivalDestination` automatically creates arrival records for every chain/agent execution. If the agent represents or acts on behalf of a user:

- The user may not know arrival markers are being created
- Arrival markers contain timestamps, origin, destination, and cryptographic identity
- Under GDPR Art. 6, this processing needs a legal basis
- Under CCPA, this is "collection" of identifiers

**Mitigating factor:** The callback is opt-in (developer must configure `arrivalDestination`). But end-users of the LangChain application have no visibility or control.

**Recommendation:** Document data collection implications. Recommend platforms disclose marker creation in privacy policies. Consider adding a consent callback hook.

---

### L-04: MCP Server — Compromised AI Liability Gap
**Severity: MEDIUM**

If a compromised AI client uses MCP tools to:
1. Generate identities (`generate_identity`)
2. Create fraudulent exit markers (`quick_exit`)
3. Self-admit at destinations (`verify_and_admit`)

**Who's liable?**
- The MCP server operator hosts the signing infrastructure
- The AI client operator controls the compromised agent
- The destination platform relied on cryptographic verification

This creates a three-party liability gap. The MCP server acts as a "signing oracle" — it signs whatever the client asks for. Current design has no authorization layer for who can request signatures.

**Recommendation:** Add authentication/authorization to MCP server (API keys, allowlists). Document the signing oracle risk model.

---

### L-05: Auto-Admission and Negligence Per Se
**Severity: LOW**

If future regulations mandate specific agent verification requirements (e.g., EU AI Act agent identification), platforms using OPEN_DOOR auto-admission may face negligence per se claims for failing to meet statutory verification standards.

**Recommendation:** Design admission policies to be extensible for regulatory compliance. Document that OPEN_DOOR is for development/testing only.

---

## SUMMARY TABLE

| ID | Package | Type | Severity | Status |
|----|---------|------|----------|--------|
| S-01 | All | Security | HIGH | Open — unvalidated JSON.parse on arrival markers |
| S-02 | Vercel, MCP | Security | HIGH | Open — optional policy = no policy |
| S-03 | All | Security | HIGH | Open — LLM controls admission decisions |
| S-04 | All | Security | MEDIUM | Open — no replay protection at integration layer |
| S-05 | All | Security | INFO | ✓ HIGH-01 fix intact |
| S-06 | All | Security | INFO | ✓ HIGH-02 fix intact |
| S-07 | LangChain | Security | INFO | ✓ Memory leak fix intact |
| S-08 | MCP | Security | MEDIUM | Open — shared mutable session identity |
| S-09 | All | Security | LOW | Open — unbounded input size |
| S-10 | LangChain | Security | MEDIUM | Open — auto-arrival self-referential |
| S-11 | All | Security | INFO | Revocation not exposed — no concern |
| L-01 | All | Legal | HIGH | Open — auto-admission liability |
| L-02 | All | Legal | MEDIUM | Open — FCRA risk from EXIT-based decisions |
| L-03 | LangChain | Legal | MEDIUM | Open — consent-less arrival recording |
| L-04 | MCP | Legal | MEDIUM | Open — signing oracle liability gap |
| L-05 | All | Legal | LOW | Open — future regulatory risk |

**Critical: 0 | High: 4 | Medium: 6 | Low: 2 | Info: 4**
