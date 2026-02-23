import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

async function setupClient() {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  
  const client = new Client({ name: "test-client", version: "0.1.0" });
  
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);
  
  return client;
}

describe("MCP Server", () => {
  it("lists all tools", async () => {
    const client = await setupClient();
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      "create_exit_marker",
      "generate_identity",
      "quick_exit",
      "verify_exit_marker",
    ]);
  });

  it("generate_identity returns a DID", async () => {
    const client = await setupClient();
    const result = await client.callTool({ name: "generate_identity", arguments: {} });
    const data = JSON.parse((result.content as any)[0].text);
    expect(data.did).toMatch(/^did:key:z/);
    expect(data.publicKey).toBeUndefined(); // private key material no longer exposed
  });

  it("quick_exit creates a verified marker", async () => {
    const client = await setupClient();
    const result = await client.callTool({
      name: "quick_exit",
      arguments: { origin: "did:example:test-agent" },
    });
    const data = JSON.parse((result.content as any)[0].text);
    expect(data.verified).toBe(true);
    expect(data.marker.subject).toMatch(/^did:key:z/);
    expect(data.signerDid).toMatch(/^did:key:z/);
  });

  it("create_exit_marker creates a signed marker", async () => {
    const client = await setupClient();
    // Generate identity first
    await client.callTool({ name: "generate_identity", arguments: {} });
    
    const result = await client.callTool({
      name: "create_exit_marker",
      arguments: {
        origin: "did:example:departing",
        exitType: "Voluntary",
        reason: "Mission complete",
      },
    });
    const data = JSON.parse((result.content as any)[0].text);
    expect(data.marker.subject).toBe("did:example:departing");
    expect(data.signerDid).toMatch(/^did:key:z/);
  });

  it("verify_exit_marker round-trips", async () => {
    const client = await setupClient();
    
    // Create a marker
    const createResult = await client.callTool({
      name: "quick_exit",
      arguments: { origin: "did:example:roundtrip" },
    });
    const created = JSON.parse((createResult.content as any)[0].text);
    const markerJson = JSON.stringify(created.marker);
    
    // Verify it
    const verifyResult = await client.callTool({
      name: "verify_exit_marker",
      arguments: { markerJson },
    });
    const verified = JSON.parse((verifyResult.content as any)[0].text);
    expect(verified.valid).toBe(true);
    expect(verified.subject).toMatch(/^did:key:z/);
  });

  it("verify_exit_marker rejects garbage", async () => {
    const client = await setupClient();
    const result = await client.callTool({
      name: "verify_exit_marker",
      arguments: { markerJson: '{"garbage": true}' },
    });
    const data = JSON.parse((result.content as any)[0].text);
    expect(data.valid).toBe(false);
  });
});
