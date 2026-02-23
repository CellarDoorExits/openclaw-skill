import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { quickExit, createMarker, signMarker, verifyMarker, generateIdentity, ExitType, toJSON, fromJSON, } from "cellar-door-exit";
export function createServer() {
    const server = new McpServer({
        name: "cellar-door-exit",
        version: "0.1.0",
    });
    // Stored identity for signing within a session
    let sessionIdentity = null;
    // Tool: generate_identity
    server.tool("generate_identity", "Generate a new Ed25519 DID keypair for signing EXIT markers", {}, async () => {
        const identity = generateIdentity();
        sessionIdentity = identity;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        did: identity.did,
                        publicKey: identity.publicKey,
                        message: "Identity generated and stored for this session. Use create_exit_marker or quick_exit to sign markers.",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: quick_exit
    server.tool("quick_exit", "One-shot create and sign a departure marker. Generates a new identity if none exists.", {
        origin: z.string().describe("DID or identifier of the departing agent"),
        exitType: z
            .enum(["Voluntary", "Forced", "Emergency", "KeyCompromise"])
            .optional()
            .describe("Type of exit (default: Voluntary)"),
        reason: z.string().optional().describe("Human-readable reason for departure"),
    }, async ({ origin, exitType, reason }) => {
        const et = exitType ? ExitType[exitType] : undefined;
        const result = quickExit(origin, {
            exitType: et,
            reason,
        });
        sessionIdentity = result.identity;
        // Verify the marker we just created
        const verifyResult = await verifyMarker(result.marker);
        const verified = typeof verifyResult === 'object' && verifyResult !== null
            ? verifyResult.valid
            : verifyResult;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        marker: JSON.parse(toJSON(result.marker)),
                        identity: {
                            did: result.identity.did,
                            publicKey: result.identity.publicKey,
                        },
                        verified,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: create_exit_marker
    server.tool("create_exit_marker", "Create and sign a departure marker. Uses session identity or generates a new one.", {
        origin: z.string().describe("DID or identifier of the departing agent"),
        exitType: z
            .enum(["Voluntary", "Forced", "Emergency", "KeyCompromise"])
            .optional()
            .describe("Type of exit (default: Voluntary)"),
        reason: z.string().optional().describe("Human-readable reason for departure"),
    }, async ({ origin, exitType, reason }) => {
        if (!sessionIdentity) {
            sessionIdentity = generateIdentity();
        }
        const et = exitType ? ExitType[exitType] : ExitType.Voluntary;
        const marker = createMarker({
            subject: origin,
            origin,
            exitType: et,
        });
        const signed = await signMarker(marker, sessionIdentity.privateKey, sessionIdentity.publicKey);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        marker: JSON.parse(toJSON(signed)),
                        signerDid: sessionIdentity.did,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: verify_exit_marker
    server.tool("verify_exit_marker", "Verify a signed EXIT marker from its JSON representation", {
        markerJson: z.string().describe("JSON string of the EXIT marker to verify"),
    }, async ({ markerJson }) => {
        try {
            const marker = fromJSON(markerJson);
            const verifyResult = await verifyMarker(marker);
            const valid = typeof verifyResult === 'object' && verifyResult !== null
                ? verifyResult.valid
                : verifyResult;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            valid,
                            subject: marker.subject,
                            exitType: marker.exitType,
                            timestamp: marker.timestamp,
                            id: marker.id,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            valid: false,
                            error: err.message || "Verification failed",
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    });
    return server;
}
