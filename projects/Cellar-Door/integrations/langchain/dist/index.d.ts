import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { Identity, ExitType, ExitMarker } from 'cellar-door-exit';
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { AgentFinish } from '@langchain/core/agents';
import { ChainValues } from '@langchain/core/utils/types';

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
    private onMarker?;
    constructor(opts?: ExitCallbackOpts);
    private recordMarker;
    handleChainEnd(_outputs: ChainValues): Promise<void>;
    handleAgentEnd(_action: AgentFinish): Promise<void>;
    /** Get all recorded markers as JSON array. */
    markersToJSON(): string;
}

export { ExitCallbackHandler, type ExitCallbackOpts, type ExitToolInput, type ExitToolOpts, createExitTool };
