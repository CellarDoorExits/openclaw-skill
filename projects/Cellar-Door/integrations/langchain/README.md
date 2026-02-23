# @cellar-door/langchain

LangChain integration for [cellar-door-exit](../../cellar-door-exit/) — verifiable agent departure markers.

## Installation

```bash
npm install @cellar-door/langchain @langchain/core cellar-door-exit
```

## Usage

### Exit Tool

Give your LangChain agent the ability to create signed EXIT markers:

```ts
import { createExitTool } from "@cellar-door/langchain";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

const tool = createExitTool();

// Add to your agent's tool list
const agent = await createOpenAIFunctionsAgent({
  llm: new ChatOpenAI({ model: "gpt-4" }),
  tools: [tool],
  prompt: yourPrompt,
});

const executor = new AgentExecutor({ agent, tools: [tool] });
```

The tool accepts:
- `origin` (required) — platform/system being exited
- `exitType` (optional) — `"voluntary"`, `"involuntary"`, `"emergency"`, `"constructive"`, `"planned"`
- `reason` (optional) — reason for exit

### Exit Callback Handler

Automatically create EXIT markers when chains or agents finish:

```ts
import { ExitCallbackHandler } from "@cellar-door/langchain";

const exitHandler = new ExitCallbackHandler({
  origin: "my-app",
  onMarker: (marker) => {
    console.log("Agent departed:", marker.id);
  },
});

// Attach to any chain or agent
const result = await chain.invoke(input, {
  callbacks: [exitHandler],
});

// Access all recorded markers
console.log(exitHandler.markers);
console.log(exitHandler.toJSON());
```

## API

### `createExitTool(opts?)`

Returns a `DynamicStructuredTool` for creating EXIT markers.

### `ExitCallbackHandler`

A `BaseCallbackHandler` that records EXIT markers on chain/agent completion.

- `markers: ExitMarker[]` — all recorded markers
- `toJSON(): string` — serialize markers to JSON array

## License

MIT
