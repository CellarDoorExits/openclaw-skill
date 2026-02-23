/**
 * Middleware / callback for automatic EXIT marker creation
 * when a Vercel AI SDK agent session ends.
 *
 * Plugs into the `onFinish` callback of `generateText` or `streamText`.
 */

import {
  quickExit,
  toJSON,
  ExitType,
  type ExitMarker,
  type Identity,
} from "../../cellar-door-exit/src/index.js";

export interface ExitMiddlewareOpts {
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
export function createExitOnFinish(opts: ExitMiddlewareOpts) {
  return async (event: { text: string; [key: string]: unknown }) => {
    const { marker, identity } = quickExit(opts.origin, {
      exitType: opts.exitType ?? ExitType.Voluntary,
    });

    if (opts.onMarkerCreated) {
      await opts.onMarkerCreated(marker, identity);
    }

    return {
      exitMarker: opts.includeInMetadata !== false ? toJSON(marker) : undefined,
      exitMarkerId: marker.id,
    };
  };
}

/**
 * Wraps any onFinish callback to also produce an EXIT marker.
 */
export function withExitMarker<T extends (...args: any[]) => any>(
  originalOnFinish: T | undefined,
  opts: ExitMiddlewareOpts,
): (...args: Parameters<T>) => Promise<void> {
  return async (...args: Parameters<T>) => {
    if (originalOnFinish) {
      await originalOnFinish(...args);
    }

    const { marker, identity } = quickExit(opts.origin, {
      exitType: opts.exitType ?? ExitType.Voluntary,
    });

    if (opts.onMarkerCreated) {
      await opts.onMarkerCreated(marker, identity);
    }
  };
}
