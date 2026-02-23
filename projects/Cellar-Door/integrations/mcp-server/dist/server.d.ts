import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export interface CreateServerOptions {
    /**
     * Server-side admission policy override. When set, this policy is used for
     * all admission decisions and any LLM-provided policy parameter is ignored.
     *
     * ⚠️  SECURITY (S-03): Production deployments SHOULD set this to prevent
     * the LLM from choosing or downgrading the admission policy.
     */
    serverPolicy?: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
}
export declare function createServer(options?: CreateServerOptions): McpServer;
