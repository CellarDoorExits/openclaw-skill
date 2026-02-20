/**
 * Module D: Asset Manifest — Portable assets at exit
 */

import { sha256 } from "@noble/hashes/sha256";

export type AssetType = "data" | "tokens" | "credentials" | "compute_credits" | "reputation_score";

export interface Asset {
  id: string;
  type: AssetType;
  description: string;
  hash: string;
  portable: boolean;
}

export interface AssetManifestModule {
  moduleType: "assets";
  assets: Asset[];
}

export interface CreateAssetOpts {
  id: string;
  type: AssetType;
  description: string;
  data?: string; // If provided, hash is computed
  hash?: string;
  portable?: boolean;
}

/** Compute SHA-256 hex hash of a string. */
function hashString(s: string): string {
  const h = sha256(new TextEncoder().encode(s));
  return Array.from(h).map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Create an asset manifest module from asset definitions. */
export function createAssetManifest(assetOpts: CreateAssetOpts[]): AssetManifestModule {
  const assets: Asset[] = assetOpts.map(a => ({
    id: a.id,
    type: a.type,
    description: a.description,
    hash: a.hash ?? (a.data ? hashString(a.data) : ""),
    portable: a.portable ?? true,
  }));

  return { moduleType: "assets", assets };
}
