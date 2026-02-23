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
} from "../../../cellar-door-exit/src/index.js";

export interface ExitCallbackOpts {
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
export class ExitCallbackHandler extends BaseCallbackHandler {
  name = "ExitCallbackHandler";

  readonly origin: string;
  readonly exitType: ExitType;
  readonly markers: ExitMarker[] = [];
  private onMarker?: (marker: ExitMarker) => void;

  constructor(opts?: ExitCallbackOpts) {
    super();
    this.origin = opts?.origin ?? "langchain";
    this.exitType = opts?.exitType ?? ExitType.Voluntary;
    this.onMarker = opts?.onMarker;
  }

  private recordMarker(): ExitMarker {
    const { marker } = quickExit(this.origin, { exitType: this.exitType });
    this.markers.push(marker);
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
  toJSON(): string {
    return JSON.stringify(this.markers.map((m) => JSON.parse(toJSON(m))), null, 2);
  }
}
