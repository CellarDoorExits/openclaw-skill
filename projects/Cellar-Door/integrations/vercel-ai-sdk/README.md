# @cellar-door/vercel-ai-sdk

Vercel AI SDK integration for [cellar-door-exit](../../cellar-door-exit/) — verifiable agent departure markers.

## Install

```bash
npm install @cellar-door/vercel-ai-sdk cellar-door-exit ai
```

## Usage

### Tool — Let the Agent Create EXIT Markers

```ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { exitMarkerTool } from "@cellar-door/vercel-ai-sdk";

const { text, toolResults } = await generateText({
  model: openai("gpt-4o"),
  tools: { exitMarker: exitMarkerTool },
  prompt: "Complete the task and produce a departure marker.",
});

// The agent can call exitMarker with { origin: "my-app" }
// and receive a cryptographically signed EXIT marker.
```

### Middleware — Automatic EXIT on Session End

```ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createExitOnFinish } from "@cellar-door/vercel-ai-sdk";

const result = await streamText({
  model: openai("gpt-4o"),
  prompt: "Hello!",
  onFinish: createExitOnFinish({
    origin: "my-agent",
    onMarkerCreated: (marker, identity) => {
      console.log("EXIT marker created:", marker.id);
      // Store, log, or broadcast the marker
    },
  }),
});
```

### Wrapping an Existing onFinish

```ts
import { withExitMarker } from "@cellar-door/vercel-ai-sdk";

const myOnFinish = (event) => {
  console.log("Generation complete:", event.text.length, "chars");
};

const result = await streamText({
  model,
  prompt: "Hello",
  onFinish: withExitMarker(myOnFinish, { origin: "my-agent" }),
});
```

## Tool Output Example

When an agent calls the `exitMarker` tool, it receives:

```json
{
  "markerId": "urn:exit:a1b2c3...",
  "subject": "did:key:z6Mk...",
  "origin": "my-app",
  "exitType": "Voluntary",
  "timestamp": "2026-02-23T02:44:00.000Z",
  "markerJson": "{ ... full signed marker ... }"
}
```

## API

### `exitMarkerTool`

A Vercel AI SDK `tool()` with parameters:

| Parameter  | Type   | Required | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `origin`   | string | ✅       | Platform/system being exited         |
| `exitType` | enum   | ❌       | voluntary, forced, emergency, keyCompromise |
| `reason`   | string | ❌       | Human-readable reason for departure  |

### `createExitOnFinish(opts)`

Returns an `onFinish` callback. Options:

- `origin` (required) — platform identifier
- `exitType` — defaults to `Voluntary`
- `onMarkerCreated(marker, identity)` — callback after marker creation
- `includeInMetadata` — include marker JSON in return value (default: true)

### `withExitMarker(originalOnFinish, opts)`

Wraps an existing `onFinish` to also produce an EXIT marker.

## License

MIT
