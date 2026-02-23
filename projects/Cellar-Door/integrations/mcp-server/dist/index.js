#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
async function main() {
    const opts = {};
    // Set serverPolicy from environment variable if provided
    const envPolicy = process.env.CELLAR_DOOR_SERVER_POLICY;
    if (envPolicy && ["OPEN_DOOR", "STRICT", "EMERGENCY_ONLY"].includes(envPolicy)) {
        opts.serverPolicy = envPolicy;
    }
    const server = createServer(opts);
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
});
