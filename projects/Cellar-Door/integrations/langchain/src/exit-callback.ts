/**
 * LangChain Callback Handler that creates EXIT markers on chain/agent completion.
 */

import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import type { Serialized } from "@langchain/core/load/serializable";
import type { AgentFinish, AgentAction } from "@langchain/core/agents";
import type { ChainValues } from "@langchain/core/utils/types";
import {
  quickExit,
  toJSON,
  ExitType,
  type ExitMarker,
  type Identity,
} from "cellar-door-exit";

export interface ExitCallbackOpts {
  /** Origin platform/system name. Defaults to "langchain". */
  origin?: string;
  /** Exit type for auto-generated markers. Defaults to Voluntary. */
  exitType?: ExitType;
  /** Called whenever a new marker is created. */
  onMarker?: (marker: ExitMarker) => void;
  /** Maximum number of markers to retain in memory. Oldest are evicted when exceeded. Default: 1000. */
  maxMarkers?: number;
}

/**
 * A LangChain callback handler that automatically creates EXIT markers
 * when chains or agents finish execution.
 */
export class ExitCallbackHandler extends BaseCallbackHandler {
  name = "ExitCallbackHandler";

  readonly origin: string;
  readonly exitType: ExitType;
  readonly markers: ExitMarker[] = [];
  readonly maxMarkers: number;
  private onMarker?: (marker: ExitMarker) => void;

  constructor(opts?: ExitCallbackOpts) {
    super();
    this.origin = opts?.origin ?? "langchain";
    this.exitType = opts?.exitType ?? ExitType.Voluntary;
    this.onMarker = opts?.onMarker;
    this.maxMarkers = opts?.maxMarkers ?? 1000;
  }

  /** Remove all stored markers. */
  clear(): void {
    this.markers.length = 0;
  }

  private recordMarker(): ExitMarker {
    const { marker } = quickExit(this.origin, { exitType: this.exitType });
    this.markers.push(marker);
    // Evict oldest markers when limit exceeded
    while (this.markers.length > this.maxMarkers) {
      this.markers.shift();
    }
    this.onMarker?.(marker);
    return marker;
  }

  async handleChainEnd(_outputs: ChainValues): Promise<void> {
    this.recordMarker();
  }

  async handleAgentEnd(_action: AgentFinish): Promise<void> {
    this.recordMarker();
  }

  /** Get all recorded markers as JSON array. */
  markersToJSON(): string {
    return JSON.stringify(this.markers.map((m) => JSON.parse(toJSON(m))), null, 2);
  }
}
