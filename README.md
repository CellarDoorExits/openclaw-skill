# @cellar-door/openclaw-skill

[![npm version](https://img.shields.io/npm/v/@cellar-door/openclaw-skill)](https://www.npmjs.com/package/@cellar-door/openclaw-skill)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE)
[![NIST](https://img.shields.io/badge/NIST-submitted-orange)](https://cellar-door.dev/nist/)

> **⚠️ Pre-release software — no formal security audit has been conducted.** This project is published for transparency, review, and community feedback. It should not be used in production systems where security guarantees are required. If you find a vulnerability, please report it to hawthornhollows@gmail.com.

Let your OpenClaw agent create and verify EXIT/ENTRY markers.

## 🗺️ Ecosystem

| Package | Description | npm |
|---------|-------------|-----|
| [cellar-door-exit](https://github.com/CellarDoorExits/exit-door) | Core protocol — departure markers | [![npm](https://img.shields.io/npm/v/cellar-door-exit)](https://www.npmjs.com/package/cellar-door-exit) |
| [cellar-door-entry](https://github.com/CellarDoorExits/entry-door) | Arrival markers + admission | [![npm](https://img.shields.io/npm/v/cellar-door-entry)](https://www.npmjs.com/package/cellar-door-entry) |
| [@cellar-door/mcp-server](https://github.com/CellarDoorExits/mcp-server) | MCP integration | [![npm](https://img.shields.io/npm/v/@cellar-door/mcp-server)](https://www.npmjs.com/package/@cellar-door/mcp-server) |
| [@cellar-door/langchain](https://github.com/CellarDoorExits/langchain) | LangChain integration | [![npm](https://img.shields.io/npm/v/@cellar-door/langchain)](https://www.npmjs.com/package/@cellar-door/langchain) |
| [@cellar-door/vercel-ai-sdk](https://github.com/CellarDoorExits/vercel-ai-sdk) | Vercel AI SDK integration | [![npm](https://img.shields.io/npm/v/@cellar-door/vercel-ai-sdk)](https://www.npmjs.com/package/@cellar-door/vercel-ai-sdk) |
| **[@cellar-door/openclaw-skill](https://github.com/CellarDoorExits/openclaw-skill)** | **OpenClaw agent skill** ← you are here | [![npm](https://img.shields.io/npm/v/@cellar-door/openclaw-skill)](https://www.npmjs.com/package/@cellar-door/openclaw-skill) |

**[Paper](https://cellar-door.dev/paper/) · [Website](https://cellar-door.dev) · [NIST Submission](https://cellar-door.dev/nist/) · [Policy Briefs](https://cellar-door.dev/briefs/)**

## Quick Start

Install as an [OpenClaw](https://openclaw.ai) skill. The scripts handle dependency installation automatically.

```bash
# Your OpenClaw agent can now say:
# "Create a departure record for did:web:platform.example"
# "Verify this EXIT marker: {...}"
# "Transfer my agent from platform-a to platform-b"
```

## Commands

| Script | Purpose |
|--------|---------|
| `exit.sh` | Create a signed EXIT marker for agent departure |
| `entry.sh` | Create an ENTRY marker for agent arrival |
| `verify.sh` | Verify any EXIT or ENTRY marker |
| `transfer.sh` | Full passage: EXIT → ENTRY with continuity proof |

## Dependencies

- [cellar-door-exit](https://www.npmjs.com/package/cellar-door-exit) — EXIT marker creation and verification
- [cellar-door-entry](https://www.npmjs.com/package/cellar-door-entry) — ENTRY marker creation and verification

## Links

- [cellar-door.dev](https://cellar-door.dev) — Project homepage
- [EXIT Protocol Spec v1.2](https://github.com/CellarDoorExits/exit-door/blob/main/specs/EXIT_SPEC_v1.2.md)
- [ENTRY Protocol Spec v1.0](https://github.com/CellarDoorExits/entry-door/blob/main/ENTRY_SPEC_v1.0.md)

## License

Apache-2.0
