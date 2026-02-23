import * as ai from 'ai';
import { z } from 'zod';
import { ExitType, ExitMarker, Identity } from 'cellar-door-exit';
import * as cellar_door_entry from 'cellar-door-entry';
import { ArrivalMarker } from 'cellar-door-entry';

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
interface EntryMiddlewareOpts {
    /** Destination platform/system identifier */
    destination: string;
    /** Called with the arrival marker after creation */
    onArrivalCreated?: (arrival: ArrivalMarker, exit: ExitMarker) => void | Promise<void>;
    /** If true, include arrival marker JSON in returned metadata */
    includeInMetadata?: boolean;
}
interface TransitMiddlewareOpts extends ExitMiddlewareOpts {
    /** If provided, also create an arrival marker at this destination */
    arrivalDestination?: string;
    /** Called with the arrival marker */
    onArrivalCreated?: (arrival: ArrivalMarker, exit: ExitMarker) => void | Promise<void>;
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
/**
 * Creates an `onStart` callback that verifies an EXIT marker and creates
 * an arrival marker when an AI SDK call begins (entry side).
 */
declare function createEntryOnStart(exitMarkerJson: string, opts: EntryMiddlewareOpts): (_event: Record<string, unknown>) => Promise<{
    arrivalMarker: string | undefined;
    continuity: {
        valid: boolean;
        errors: string[];
    };
}>;
/**
 * Creates an `onFinish` callback that produces BOTH an EXIT marker
 * and optionally an arrival marker at a destination (full transit).
 */
declare function createTransitOnFinish(opts: TransitMiddlewareOpts): (event: {
    text: string;
    [key: string]: unknown;
}) => Promise<{
    exitMarker: string | undefined;
    exitMarkerId: string;
    arrivalMarker: string | undefined;
    continuity: {
        valid: boolean;
        errors: string[];
    } | undefined;
}>;

/**
 * Tool: verify an EXIT marker and create a signed arrival marker.
 */
declare const verifyAndAdmitAgentTool: ai.Tool<z.ZodObject<{
    exitMarkerJson: z.ZodString;
    destination: z.ZodString;
    admissionPolicy: z.ZodOptional<z.ZodEnum<["OPEN_DOOR", "STRICT", "EMERGENCY_ONLY"]>>;
}, "strip", z.ZodTypeAny, {
    exitMarkerJson: string;
    destination: string;
    admissionPolicy?: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY" | undefined;
}, {
    exitMarkerJson: string;
    destination: string;
    admissionPolicy?: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY" | undefined;
}>, {
    admitted: boolean;
    reasons: string[];
    arrivalMarker: null;
    exitMarkerId?: undefined;
    subject?: undefined;
    destination?: undefined;
    continuity?: undefined;
} | {
    admitted: boolean;
    arrivalMarker: any;
    exitMarkerId: string;
    subject: string;
    destination: string;
    continuity: {
        valid: boolean;
        errors: string[];
    };
    reasons?: undefined;
}> & {
    execute: (args: {
        exitMarkerJson: string;
        destination: string;
        admissionPolicy?: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY" | undefined;
    }, options: ai.ToolExecutionOptions) => PromiseLike<{
        admitted: boolean;
        reasons: string[];
        arrivalMarker: null;
        exitMarkerId?: undefined;
        subject?: undefined;
        destination?: undefined;
        continuity?: undefined;
    } | {
        admitted: boolean;
        arrivalMarker: any;
        exitMarkerId: string;
        subject: string;
        destination: string;
        continuity: {
            valid: boolean;
            errors: string[];
        };
        reasons?: undefined;
    }>;
};
/**
 * Tool: evaluate whether an EXIT marker meets an admission policy.
 */
declare const evaluateAdmissionTool: ai.Tool<z.ZodObject<{
    exitMarkerJson: z.ZodString;
    policy: z.ZodEnum<["OPEN_DOOR", "STRICT", "EMERGENCY_ONLY"]>;
}, "strip", z.ZodTypeAny, {
    exitMarkerJson: string;
    policy: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
}, {
    exitMarkerJson: string;
    policy: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
}>, {
    admitted: boolean;
    conditions: string[];
    reasons: string[];
    policy: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
}> & {
    execute: (args: {
        exitMarkerJson: string;
        policy: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
    }, options: ai.ToolExecutionOptions) => PromiseLike<{
        admitted: boolean;
        conditions: string[];
        reasons: string[];
        policy: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
    }>;
};
/**
 * Tool: verify a complete EXIT→ENTRY transfer chain.
 */
declare const verifyTransferTool: ai.Tool<z.ZodObject<{
    exitMarkerJson: z.ZodString;
    arrivalMarkerJson: z.ZodString;
}, "strip", z.ZodTypeAny, {
    exitMarkerJson: string;
    arrivalMarkerJson: string;
}, {
    exitMarkerJson: string;
    arrivalMarkerJson: string;
}>, {
    verified: boolean;
    transferTime: null;
    errors: string[];
    continuity: null;
} | {
    verified: boolean;
    transferTime: number;
    errors: string[];
    continuity: cellar_door_entry.ContinuityResult;
}> & {
    execute: (args: {
        exitMarkerJson: string;
        arrivalMarkerJson: string;
    }, options: ai.ToolExecutionOptions) => PromiseLike<{
        verified: boolean;
        transferTime: null;
        errors: string[];
        continuity: null;
    } | {
        verified: boolean;
        transferTime: number;
        errors: string[];
        continuity: cellar_door_entry.ContinuityResult;
    }>;
};
type VerifyAndAdmitResult = Awaited<ReturnType<typeof verifyAndAdmitAgentTool.execute>>;
type EvaluateAdmissionResult = Awaited<ReturnType<typeof evaluateAdmissionTool.execute>>;
type VerifyTransferResult = Awaited<ReturnType<typeof verifyTransferTool.execute>>;

export { type EntryMiddlewareOpts, type EvaluateAdmissionResult, type ExitMarkerToolResult, type ExitMiddlewareOpts, type TransitMiddlewareOpts, type VerifyAndAdmitResult, type VerifyTransferResult, createEntryOnStart, createExitOnFinish, createTransitOnFinish, evaluateAdmissionTool, exitMarkerTool, verifyAndAdmitAgentTool, verifyTransferTool, withExitMarker };
