import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { Identity, ExitType, ExitMarker } from 'cellar-door-exit';
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { AgentFinish } from '@langchain/core/agents';
import { ChainValues } from '@langchain/core/utils/types';
import { ArrivalMarker, QuickEntryResult } from 'cellar-door-entry';

/**
 * LangChain Tool for creating EXIT markers via cellar-door-exit.
 */

declare const exitToolSchema: z.ZodObject<{
    origin: z.ZodString;
    exitType: z.ZodOptional<z.ZodEnum<["voluntary", "forced", "emergency", "keyCompromise"]>>;
    reason: z.ZodOptional<z.ZodString>;
    emergencyJustification: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    origin: string;
    exitType?: "voluntary" | "forced" | "emergency" | "keyCompromise" | undefined;
    reason?: string | undefined;
    emergencyJustification?: string | undefined;
}, {
    origin: string;
    exitType?: "voluntary" | "forced" | "emergency" | "keyCompromise" | undefined;
    reason?: string | undefined;
    emergencyJustification?: string | undefined;
}>;
type ExitToolInput = z.infer<typeof exitToolSchema>;
interface ExitToolOpts {
    /** If provided, reuse this identity instead of generating a new one each call. */
    identity?: Identity;
}
/**
 * Creates a LangChain tool that generates signed EXIT markers.
 */
declare function createExitTool(opts?: ExitToolOpts): DynamicStructuredTool<z.ZodObject<{
    origin: z.ZodString;
    exitType: z.ZodOptional<z.ZodEnum<["voluntary", "forced", "emergency", "keyCompromise"]>>;
    reason: z.ZodOptional<z.ZodString>;
    emergencyJustification: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    origin: string;
    exitType?: "voluntary" | "forced" | "emergency" | "keyCompromise" | undefined;
    reason?: string | undefined;
    emergencyJustification?: string | undefined;
}, {
    origin: string;
    exitType?: "voluntary" | "forced" | "emergency" | "keyCompromise" | undefined;
    reason?: string | undefined;
    emergencyJustification?: string | undefined;
}>>;

/**
 * LangChain Callback Handler that creates EXIT markers on chain/agent completion.
 */

interface ExitCallbackOpts {
    /** Origin platform/system name. Defaults to "langchain". */
    origin?: string;
    /** Exit type for auto-generated markers. Defaults to Voluntary. */
    exitType?: ExitType;
    /** Called whenever a new marker is created. */
    onMarker?: (marker: ExitMarker) => void;
    /** Maximum number of markers to retain in memory. Oldest are evicted when exceeded. Default: 1000. */
    maxMarkers?: number;
    /** If set, also create arrival markers at this destination on chain/agent start. */
    arrivalDestination?: string;
    /** Called whenever an arrival marker is created. */
    onArrival?: (arrival: ArrivalMarker) => void;
}
/**
 * A LangChain callback handler that automatically creates EXIT markers
 * when chains or agents finish execution.
 */
declare class ExitCallbackHandler extends BaseCallbackHandler {
    name: string;
    readonly origin: string;
    readonly exitType: ExitType;
    readonly markers: ExitMarker[];
    readonly arrivals: ArrivalMarker[];
    readonly maxMarkers: number;
    readonly arrivalDestination?: string;
    private onMarker?;
    private onArrival?;
    /** Stores the last exit marker JSON for creating arrivals */
    private lastExitMarkerJson?;
    constructor(opts?: ExitCallbackOpts);
    /** Remove all stored markers and arrivals. */
    clear(): void;
    /**
     * Record an arrival from an EXIT marker JSON string.
     * Call this to manually trigger entry processing.
     */
    recordArrival(exitMarkerJson: string, destination?: string): QuickEntryResult;
    private recordMarker;
    handleChainEnd(_outputs: ChainValues): Promise<void>;
    handleAgentEnd(_action: AgentFinish): Promise<void>;
    /** Get all recorded markers as JSON array. */
    markersToJSON(): string;
}

/**
 * LangChain Tool for creating ENTRY (arrival) markers via cellar-door-entry.
 */

/**
 * Creates a LangChain tool that verifies an EXIT marker and creates a signed arrival.
 */
declare function createEntryTool(): DynamicStructuredTool<z.ZodObject<{
    exitMarkerJson: z.ZodString;
    destination: z.ZodString;
}, "strip", z.ZodTypeAny, {
    exitMarkerJson: string;
    destination: string;
}, {
    exitMarkerJson: string;
    destination: string;
}>>;

/**
 * LangChain Tool for evaluating admission policies via cellar-door-entry.
 */

/**
 * Creates a LangChain tool that evaluates admission policies.
 */
declare function createAdmissionPolicyTool(): DynamicStructuredTool<z.ZodObject<{
    exitMarkerJson: z.ZodString;
    policy: z.ZodEnum<["OPEN_DOOR", "STRICT", "EMERGENCY_ONLY"]>;
}, "strip", z.ZodTypeAny, {
    exitMarkerJson: string;
    policy: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
}, {
    exitMarkerJson: string;
    policy: "OPEN_DOOR" | "STRICT" | "EMERGENCY_ONLY";
}>>;

/**
 * LangChain Tool for verifying EXIT→ENTRY transfers via cellar-door-entry.
 */

/**
 * Creates a LangChain tool that verifies a complete EXIT→ENTRY transfer.
 */
declare function createTransferVerificationTool(): DynamicStructuredTool<z.ZodObject<{
    exitMarkerJson: z.ZodString;
    arrivalMarkerJson: z.ZodString;
}, "strip", z.ZodTypeAny, {
    exitMarkerJson: string;
    arrivalMarkerJson: string;
}, {
    exitMarkerJson: string;
    arrivalMarkerJson: string;
}>>;

export { ExitCallbackHandler, type ExitCallbackOpts, type ExitToolInput, type ExitToolOpts, createAdmissionPolicyTool, createEntryTool, createExitTool, createTransferVerificationTool };
