/**
 * cellar-door-exit — In-Memory Marker Registry
 *
 * ⚠️ FOR TESTING ONLY. Production systems should NOT use centralized registries.
 * EXIT markers are designed to be decentralized and self-verifying.
 * This registry exists solely for testing, demos, and local development.
 */

import type { ExitMarker } from "./types.js";

/**
 * In-memory marker registry for testing and demos.
 *
 * @remarks FOR TESTING ONLY. Production systems should NOT use centralized registries.
 * EXIT markers are self-verifying; centralized lookup defeats the purpose.
 */
export class MarkerRegistry {
  private byId = new Map<string, ExitMarker>();
  private bySubject = new Map<string, Set<string>>();
  private byOrigin = new Map<string, Set<string>>();

  /** Register a marker. Indexes by ID, subject DID, and origin. */
  register(marker: ExitMarker): void {
    if (this.byId.has(marker.id)) {
      throw new Error(`Marker already registered: ${marker.id}`);
    }

    this.byId.set(marker.id, marker);

    if (!this.bySubject.has(marker.subject)) {
      this.bySubject.set(marker.subject, new Set());
    }
    this.bySubject.get(marker.subject)!.add(marker.id);

    if (!this.byOrigin.has(marker.origin)) {
      this.byOrigin.set(marker.origin, new Set());
    }
    this.byOrigin.get(marker.origin)!.add(marker.id);
  }

  /** Look up a marker by ID. */
  lookup(id: string): ExitMarker | null {
    return this.byId.get(id) ?? null;
  }

  /** Find all markers for a given subject DID. */
  findBySubject(did: string): ExitMarker[] {
    const ids = this.bySubject.get(did);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)!);
  }

  /** Find all markers from a given origin URI. */
  findByOrigin(uri: string): ExitMarker[] {
    const ids = this.byOrigin.get(uri);
    if (!ids) return [];
    return [...ids].map((id) => this.byId.get(id)!);
  }

  /** Find markers within a time range (inclusive). */
  findByTimeRange(start: Date, end: Date): ExitMarker[] {
    const results: ExitMarker[] = [];
    for (const marker of this.byId.values()) {
      const t = new Date(marker.timestamp).getTime();
      if (t >= start.getTime() && t <= end.getTime()) {
        results.push(marker);
      }
    }
    return results;
  }

  /** Total number of registered markers. */
  count(): number {
    return this.byId.size;
  }

  /** Export all markers as an array. */
  export(): ExitMarker[] {
    return [...this.byId.values()];
  }
}
