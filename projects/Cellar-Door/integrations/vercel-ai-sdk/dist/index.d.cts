import * as ai from 'ai';
import { z } from 'zod';
import { ExitType, ExitMarker, Identity } from 'cellar-door-exit';

/**
 * Vercel AI SDK tool that creates a signed EXIT marker.
 */
declare const exitMarkerTool: ai.Tool<z.ZodObject<{
    origin: z.ZodString;
    exitType: z.ZodOptional<z.ZodEnum<["voluntary", "forced", "emergency", "keyCompromise"]>>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    origin: string;
    exitType?: "voluntary" | "forced" | "emergency" | "keyCompromise" | undefined;
    reason?: string | undefined;
}, {
    origin: string;
    exitType?: "voluntary" | "forced" | "emergency" | "keyCompromise" | undefined;
    reason?: string | undefined;
}>, {
    markerJson: string;
    markerId: string;
    subject: string;
    origin: string;
    exitType: ExitType;
    timestamp: string;
}> & {
    execute: (args: {
        origin: string;
        exitType?: "voluntary" | "forced" | "emergency" | "keyCompromise" | undefined;
        reason?: string | undefined;
    }, options: ai.ToolExecutionOptions) => PromiseLike<{
        markerJson: string;
        markerId: string;
        subject: string;
        origin: string;
        exitType: ExitType;
        timestamp: string;
    }>;
};
type ExitMarkerToolResult = Awaited<ReturnType<typeof exitMarkerTool.execute>>;

/**
 * Middleware / callback for automatic EXIT marker creation
 * when a Vercel AI SDK agent session ends.
 *
 * Plugs into the `onFinish` callback of `generateText` or `streamText`.
 */

interface ExitMiddlewareOpts {
    /** Platform/system identifier */
    origin: string;
    /** Exit type (defaults to Voluntary) */
    exitType?: ExitType;
    /** Called with the signed marker after creation */
    onMarkerCreated?: (marker: ExitMarker, identity: Identity) => void | Promise<void>;
    /** If true, include the marker JSON in the returned metadata */
    includeInMetadata?: boolean;
}
/**
 * Creates an `onFinish` callback that automatically generates
 * a signed EXIT marker when an AI SDK call completes.
 *
 * @example
 * ```ts
 * import { streamText } from 'ai';
 * import { createExitOnFinish } from '@cellar-door/vercel-ai-sdk';
 *
 * const result = await streamText({
 *   model,
 *   prompt: 'Hello',
 *   onFinish: createExitOnFinish({ origin: 'my-agent' }),
 * });
 * ```
 */
declare function createExitOnFinish(opts: ExitMiddlewareOpts): (event: {
    text: string;
    [key: string]: unknown;
}) => Promise<{
    exitMarker: string | undefined;
    exitMarkerId: string;
}>;
/**
 * Wraps any onFinish callback to also produce an EXIT marker.
 */
declare function withExitMarker<T extends (...args: any[]) => any>(originalOnFinish: T | undefined, opts: ExitMiddlewareOpts): (...args: Parameters<T>) => Promise<void>;

export { type ExitMarkerToolResult, type ExitMiddlewareOpts, createExitOnFinish, exitMarkerTool, withExitMarker };
