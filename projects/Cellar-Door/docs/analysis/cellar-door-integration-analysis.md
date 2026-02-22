# Cellar Door EXIT — Platform Integration Analysis

**Date:** 2026-02-22  
**Prepared by:** Hawthorn  
**Purpose:** Identify easy-win integrations to establish EXIT as the de facto agent departure standard

---

## Key Insight: The Package Is Integration-Ready

`cellar-door-exit` already ships with `interop.ts` containing:
- `createExitMiddleware()` — Express-style middleware
- `createExitHook()` — lifecycle hook with `beforeExit`/`onExit`/`afterExit` callbacks
- `ExitEventEmitter` — event emitter for `intent`/`negotiating`/`signing`/`departed`
- Transport serialization (compact binary)

Plus `quickExit()` and `quickVerify()` convenience functions. The building blocks are there — integrations are mostly thin wrappers mapping framework-specific lifecycle events to these primitives.

---

## Platform Analysis

### 1. LangChain / LangGraph (TypeScript)

**Agent lifecycle:** Agents are instances of `AgentExecutor` or LangGraph `StateGraph`. They run via `.invoke()` / `.stream()` calls. No persistent lifecycle — agents are ephemeral per-invocation by default, though LangGraph adds persistence via checkpoints. Shutdown = the invoke completes or errors.

**Where EXIT hooks in:** LangChain has a `CallbackHandler` system — every agent run emits events (`handleAgentAction`, `handleAgentEnd`, `handleChainError`). A custom `CallbackHandler` that emits EXIT markers on `handleAgentEnd` is the natural integration point. LangGraph's `StateGraph` has entry/exit nodes that can trigger hooks.

**Integration difficulty:** 2/5 — CallbackHandler is a well-documented extensibility point. We subclass `BaseCallbackHandler` and wire it up.

**What we'd build:** `@cellar-door/langchain` — a `CallbackHandler` that auto-generates EXIT markers when agents complete, error out, or are explicitly terminated.

**LOE:** 8-12 hours

**Strategic value:** 5/5 — LangChain is the #1 agent framework. This is the flagship integration.

---

### 2. CrewAI

**Agent lifecycle:** CrewAI is Python-first. Agents have `role`, `goal`, `backstory`. A `Crew` orchestrates agents via `crew.kickoff()`. Agents complete when their task is done. Crew lifecycle: `kickoff()` → tasks execute → results. There's a `@before_kickoff` and `@after_kickoff` decorator pattern. CrewAI also has `AgentFinishCallback`.

**Where EXIT hooks in:** The `@after_kickoff` callback or task completion callbacks. CrewAI's Python SDK is the primary surface. A TypeScript integration would need to wrap their REST API or wait for the JS SDK.

**Integration difficulty:** 3/5 — Python-first is a friction point since `cellar-door-exit` is TypeScript. Either (a) build a Python wrapper that calls the TS package via subprocess/WASM, (b) port core EXIT logic to Python, or (c) wait for CrewAI's JS SDK. Option (a) is hacky, (b) is a major effort, (c) depends on their roadmap.

**What we'd build:** Python package `cellar-door-exit-crewai` with a thin Python EXIT marker creator (port the ~335 bytes of marker creation), or a REST endpoint that the Python code calls.

**LOE:** 20-30 hours (Python port of core marker creation + CrewAI hooks)

**Strategic value:** 4/5 — Multi-agent = more departure events. But Python-first adds friction.

---

### 3. AutoGPT

**Agent lifecycle:** AutoGPT agents are long-running autonomous loops. The agent proposes actions, executes them, and loops. Shutdown happens via: (a) goal completion, (b) user interrupt, (c) budget exhaustion, (d) error. AutoGPT has a plugin system (`autogpt-plugins`).

**Where EXIT hooks in:** Plugin lifecycle hooks — `on_agent_shutdown()` or equivalent. AutoGPT's plugin system is Python-based with defined entry points.

**Integration difficulty:** 3/5 — Same Python problem as CrewAI, plus AutoGPT's plugin API has changed across versions. Stability risk.

**What we'd build:** AutoGPT plugin that generates EXIT markers on agent shutdown.

**LOE:** 16-24 hours

**Strategic value:** 3/5 — Philosophically aligned but smaller user base. AutoGPT's relevance has declined since 2024.

---

### 4. OpenClaw

**Agent lifecycle:** OpenClaw agents are persistent, session-based. They have heartbeats, memory files, and run across sessions. "Lifecycle" is: session start → heartbeat polls → session end. Agents can spawn sub-agents. Shutdown = session timeout or explicit termination.

**Where EXIT hooks in:** `AGENTS.md` conventions, heartbeat system, sub-agent lifecycle. An EXIT integration would hook into session teardown and sub-agent completion. OpenClaw is Node.js/TypeScript — perfect match.

**Integration difficulty:** 1/5 — Same language, same runtime. `cellar-door-exit` can be imported directly. Wire `quickExit()` into the session lifecycle.

**What we'd build:** `@cellar-door/openclaw` — middleware that auto-generates EXIT markers when sessions end or sub-agents complete. Could be as simple as a skill file + a few hooks.

**LOE:** 4-6 hours

**Strategic value:** 3/5 — Small user base, but it's our home platform. Dogfooding matters. Demonstrates the integration pattern.

---

### 5. Microsoft AutoGen

**Agent lifecycle:** AutoGen uses `ConversableAgent` classes in multi-agent conversations. Agents register in `GroupChat` or direct 1:1 patterns. The conversation runs via `initiate_chat()`. Agents can terminate conversations via termination conditions. AutoGen 0.4+ (AG2) has an event-driven architecture with `AgentRuntime`.

**Where EXIT hooks in:** AutoGen 0.4's `AgentRuntime` has lifecycle hooks — agent registration/deregistration events. The `on_unregister` event is a natural EXIT trigger. For older AutoGen, middleware injection into the reply pipeline.

**Integration difficulty:** 3/5 — Python-first again. AutoGen 0.4 (AG2) has better extensibility but is newer and less stable. The TypeScript/Python gap is the main friction.

**What we'd build:** Python package `cellar-door-exit-autogen` hooking into `AgentRuntime` lifecycle events.

**LOE:** 16-24 hours

**Strategic value:** 4/5 — Microsoft enterprise credibility. Defensive integration (be inside before they build around EXIT).

---

### 6. Vercel AI SDK

**Agent lifecycle:** Vercel AI SDK is TypeScript-first. Agents run via `generateText()`, `streamText()`, or the newer `agent()` function with tools. Lifecycle is request-scoped — each invocation is ephemeral. Multi-step agents loop via `maxSteps`. Shutdown = steps exhausted, tool calls complete, or error.

**Where EXIT hooks in:** The `onFinish` callback on `generateText`/`streamText`. Also middleware system for custom providers. The AI SDK's `experimental_telemetry` hooks provide lifecycle visibility. For multi-step agents, the `onStepFinish` callback.

**Integration difficulty:** 1/5 — TypeScript native. Clean callback-based API. `onFinish` is exactly where EXIT belongs.

**What we'd build:** `@cellar-door/vercel-ai` — a wrapper/middleware that intercepts `onFinish` to generate EXIT markers. Possibly a custom provider wrapper.

**LOE:** 6-8 hours

**Strategic value:** 4/5 — Vercel AI SDK is the fastest-growing agent framework. Massive Next.js/React developer audience. TypeScript-native = zero friction.

---

### 7. Mastra

**Agent lifecycle:** Mastra is TypeScript-first agent framework with built-in tools, workflows, and memory. Agents defined via `new Agent({...})`. Workflows are state machines with steps. Lifecycle: agent.generate() → tool calls → completion. Mastra has an event system and workflow hooks.

**Where EXIT hooks in:** Workflow step hooks (`afterAll`, completion callbacks). Agent-level lifecycle events. Mastra's middleware system for custom processing.

**Integration difficulty:** 1/5 — TypeScript native. Modern, extensible architecture. Small API surface = easy to wrap.

**What we'd build:** `@cellar-door/mastra` — workflow step or middleware that generates EXIT markers on agent/workflow completion.

**LOE:** 6-8 hours

**Strategic value:** 3/5 — Growing fast but smaller ecosystem than LangChain or Vercel AI SDK. Good for establishing breadth.

---

### 8. DSPy

**Agent lifecycle:** DSPy is Python-first, focused on programmatic LLM pipelines rather than "agents" per se. Modules compose into programs. Lifecycle: `module.forward()` → compilation via optimizers → execution. No explicit agent shutdown concept — it's functional, not stateful.

**Where EXIT hooks in:** Poorly. DSPy doesn't have agent lifecycle events because it doesn't model agents as persistent entities. An integration would need to be bolted onto the module system as a wrapper, which feels unnatural.

**Integration difficulty:** 4/5 — Python-first AND conceptually misaligned. DSPy is about prompt optimization, not agent lifecycle management.

**What we'd build:** A DSPy module that wraps EXIT marker creation, but it's awkward. Better to skip this.

**LOE:** 20-30 hours (for something that feels forced)

**Strategic value:** 2/5 — DSPy's audience cares about optimization, not lifecycle management. Low demand signal.

---

## Ranking: Difficulty × Value Score

| Platform | Difficulty | Strategic Value | Score (Value/Difficulty) | Language Match |
|----------|-----------|----------------|--------------------------|---------------|
| OpenClaw | 1 | 3 | 3.0 | ✅ TypeScript |
| Vercel AI SDK | 1 | 4 | 4.0 | ✅ TypeScript |
| Mastra | 1 | 3 | 3.0 | ✅ TypeScript |
| LangChain (TS) | 2 | 5 | 2.5 | ✅ TypeScript |
| CrewAI | 3 | 4 | 1.3 | ❌ Python |
| AutoGen | 3 | 4 | 1.3 | ❌ Python |
| AutoGPT | 3 | 3 | 1.0 | ❌ Python |
| DSPy | 4 | 2 | 0.5 | ❌ Python |

---

## Top 3 Recommendations (Build These First)

### 🥇 #1: Vercel AI SDK — Score 4.0

**Why first:** TypeScript native, highest value-to-effort ratio, fastest-growing framework, massive developer audience. The `onFinish` callback is a perfect EXIT hook.

```typescript
// @cellar-door/vercel-ai
import { generateText, type LanguageModel } from 'ai';
import { quickExit, type Identity, ExitType, ExitStatus } from 'cellar-door-exit';

export interface ExitAwareOptions {
  model: LanguageModel;
  prompt: string;
  identity: Identity;
  origin: string;
  /** Custom handler for the generated EXIT marker */
  onExitMarker?: (marker: unknown) => Promise<void> | void;
}

/**
 * Wraps Vercel AI SDK's generateText with automatic EXIT marker generation.
 * When the agent completes (or errors), an EXIT marker is created and signed.
 */
export async function generateTextWithExit(opts: ExitAwareOptions) {
  const { identity, origin, onExitMarker, ...aiOpts } = opts;

  try {
    const result = await generateText({
      ...aiOpts,
      onFinish: async ({ text, finishReason, usage }) => {
        const exitResult = await quickExit({
          identity,
          origin,
          exitType: finishReason === 'error' ? ExitType.Emergency : ExitType.Voluntary,
          status: ExitStatus.GoodStanding,
          modules: {
            metadata: {
              reason: `Agent completed: ${finishReason}`,
              tags: ['vercel-ai-sdk', finishReason],
              narrative: `Generated ${usage.totalTokens} tokens. Finish reason: ${finishReason}.`,
            },
          },
        });

        if (onExitMarker) await onExitMarker(exitResult.marker);
      },
    });

    return result;
  } catch (err) {
    // Emergency EXIT on unhandled error
    const exitResult = await quickExit({
      identity,
      origin,
      exitType: ExitType.Emergency,
      status: ExitStatus.Unverified,
      modules: {
        metadata: {
          reason: `Unhandled error: ${(err as Error).message}`,
          tags: ['vercel-ai-sdk', 'error'],
        },
      },
    });

    if (onExitMarker) await onExitMarker(exitResult.marker);
    throw err;
  }
}

/**
 * Middleware-style wrapper for multi-step agents.
 * Generates EXIT markers per-step or on final completion.
 */
export function withExitTracking(identity: Identity, origin: string) {
  return {
    onStepFinish: async ({ stepType, toolResults }: any) => {
      // Optional: emit per-step markers for long-running agents
      console.log(`[EXIT] Step completed: ${stepType}`);
    },
    onFinish: async ({ finishReason }: any) => {
      return quickExit({
        identity,
        origin,
        exitType: ExitType.Voluntary,
        status: ExitStatus.GoodStanding,
        modules: {
          metadata: { reason: `Multi-step agent completed: ${finishReason}` },
        },
      });
    },
  };
}
```

### 🥈 #2: LangChain (TypeScript) — Score 2.5 but highest absolute strategic value

**Why second:** Despite slightly more effort, LangChain is the most important framework for credibility. The CallbackHandler pattern is clean.

```typescript
// @cellar-door/langchain
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { AgentAction, AgentFinish } from '@langchain/core/agents';
import {
  quickExit,
  ExitEventEmitter,
  type Identity,
  ExitType,
  ExitStatus,
} from 'cellar-door-exit';

export interface ExitCallbackHandlerOpts {
  identity: Identity;
  origin: string;
  /** Store or broadcast the marker */
  onMarker?: (marker: unknown) => Promise<void> | void;
  /** Generate EXIT on every chain end, or only on agent end? Default: agent only */
  agentOnly?: boolean;
}

/**
 * LangChain CallbackHandler that generates EXIT markers
 * when agents complete, error, or are interrupted.
 */
export class ExitCallbackHandler extends BaseCallbackHandler {
  name = 'ExitCallbackHandler';

  private identity: Identity;
  private origin: string;
  private onMarker?: (marker: unknown) => Promise<void> | void;
  private agentOnly: boolean;
  private emitter = new ExitEventEmitter();
  private actionCount = 0;
  private startTime = Date.now();

  constructor(opts: ExitCallbackHandlerOpts) {
    super();
    this.identity = opts.identity;
    this.origin = opts.origin;
    this.onMarker = opts.onMarker;
    this.agentOnly = opts.agentOnly ?? true;
  }

  async handleAgentAction(action: AgentAction): Promise<void> {
    this.actionCount++;
  }

  async handleAgentEnd(output: AgentFinish): Promise<void> {
    const duration = Date.now() - this.startTime;
    const result = await quickExit({
      identity: this.identity,
      origin: this.origin,
      exitType: ExitType.Voluntary,
      status: ExitStatus.GoodStanding,
      modules: {
        metadata: {
          reason: 'Agent execution completed',
          tags: ['langchain', `actions:${this.actionCount}`],
          narrative: `Agent ran for ${duration}ms, performed ${this.actionCount} actions.`,
        },
      },
    });

    this.emitter.emitDeparted(result.marker);
    if (this.onMarker) await this.onMarker(result.marker);
  }

  async handleChainError(err: Error): Promise<void> {
    const result = await quickExit({
      identity: this.identity,
      origin: this.origin,
      exitType: ExitType.Emergency,
      status: ExitStatus.Unverified,
      modules: {
        metadata: {
          reason: `Chain error: ${err.message}`,
          tags: ['langchain', 'error'],
        },
      },
    });

    this.emitter.emitDeparted(result.marker);
    if (this.onMarker) await this.onMarker(result.marker);
  }

  /** Access the event emitter for custom handling */
  get events() { return this.emitter; }
}

// Usage:
// import { ChatOpenAI } from '@langchain/openai';
// import { AgentExecutor } from 'langchain/agents';
//
// const exitHandler = new ExitCallbackHandler({
//   identity: await generateIdentity(),
//   origin: 'platform:my-saas-app',
//   onMarker: (m) => console.log('EXIT:', JSON.stringify(m, null, 2)),
// });
//
// const result = await agentExecutor.invoke(
//   { input: "What's the weather?" },
//   { callbacks: [exitHandler] }
// );
```

### 🥉 #3: OpenClaw — Score 3.0, dogfooding value

**Why third:** Lowest effort (4-6 hours), same runtime, and dogfooding on our own platform proves the concept works in production.

```typescript
// @cellar-door/openclaw — EXIT integration for OpenClaw agents
import {
  quickExit,
  generateIdentity,
  createExitHook,
  ExitType,
  ExitStatus,
  type Identity,
  type ExitMarker,
} from 'cellar-door-exit';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const MARKERS_DIR = '/home/node/workspace/openclaw/memory/exit-markers';

/**
 * Generate and store an EXIT marker for a sub-agent session.
 * Call this when a sub-agent completes its task.
 */
export async function exitSubAgent(opts: {
  label: string;
  origin: string;
  task: string;
  success: boolean;
  identity?: Identity;
}): Promise<ExitMarker> {
  const identity = opts.identity ?? await generateIdentity();

  const result = await quickExit({
    identity,
    origin: opts.origin,
    exitType: ExitType.Voluntary,
    status: opts.success ? ExitStatus.GoodStanding : ExitStatus.Unverified,
    modules: {
      metadata: {
        reason: `Sub-agent "${opts.label}" completed`,
        narrative: opts.task,
        tags: ['openclaw', 'sub-agent', opts.label],
      },
    },
  });

  // Persist to workspace
  if (!existsSync(MARKERS_DIR)) mkdirSync(MARKERS_DIR, { recursive: true });
  const filename = `${new Date().toISOString().slice(0, 10)}-${opts.label}.json`;
  writeFileSync(
    join(MARKERS_DIR, filename),
    JSON.stringify(result.marker, null, 2)
  );

  return result.marker;
}

/**
 * Session-level EXIT hook. Wire into OpenClaw's session teardown.
 * Records that an agent session ended, with what standing.
 */
export function createSessionExitHook(agentName: string, origin: string) {
  return createExitHook({
    beforeExit: async (marker) => {
      console.log(`[EXIT] ${agentName} preparing to depart ${origin}`);
    },
    onExit: async (marker) => {
      if (!existsSync(MARKERS_DIR)) mkdirSync(MARKERS_DIR, { recursive: true });
      const filename = `${new Date().toISOString().slice(0, 10)}-session-${agentName}.json`;
      writeFileSync(
        join(MARKERS_DIR, filename),
        JSON.stringify(marker, null, 2)
      );
    },
    afterExit: async (marker) => {
      console.log(`[EXIT] ${agentName} departed. Marker: ${marker.id}`);
    },
  });
}

// Usage in a sub-agent's final message:
//
// await exitSubAgent({
//   label: 'integration-analysis',
//   origin: 'openclaw:main:subagent:abc123',
//   task: 'Analyzed platform integrations for EXIT protocol',
//   success: true,
// });
```

---

## Build Order & Timeline

| Order | Integration | LOE | Cumulative | Ship Target |
|-------|------------|-----|------------|-------------|
| 1 | OpenClaw | 4-6h | 6h | Week 1 (dogfood immediately) |
| 2 | Vercel AI SDK | 6-8h | 14h | Week 1-2 |
| 3 | LangChain (TS) | 8-12h | 26h | Week 2-3 |
| 4 | Mastra | 6-8h | 34h | Week 3 (if momentum) |

**Total for top 3:** ~20-26 hours of development.

## What to Skip (For Now)

- **Python platforms (CrewAI, AutoGen, AutoGPT, DSPy):** The language barrier is real. Don't port to Python until TypeScript integrations prove demand. If Python demand emerges, consider a minimal Python package that creates/signs EXIT markers natively rather than wrapping the TS package.
- **DSPy specifically:** Conceptual mismatch. DSPy doesn't model agents as entities that "depart." Forced integration hurts credibility.

## Strategic Note

The pattern is clear: **TypeScript-native frameworks first.** The package is TypeScript. The integrations are thin wrappers. Ship 3-4 TS integrations in 2-3 weeks, get npm downloads flowing, then assess whether Python demand justifies a port. The Python port should be a separate Phase 2 decision — it's essentially a new package, not a wrapper.
