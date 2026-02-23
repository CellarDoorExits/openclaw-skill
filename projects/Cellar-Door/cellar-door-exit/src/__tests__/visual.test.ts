import { describe, it, expect } from "vitest";
import { renderDoorASCII, hashToColors, renderDoorSVG, shortHash } from "../visual.js";

const HASH_A = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
const HASH_B = "0000000000000000000000000000000000";
const HASH_C = "ffffffffffffffffffffffffffffffff";
const HASH_D = "0xDEADBEEFCAFE1234567890abcdef0123";

describe("visual — shortHash", () => {
  it("formats with door emoji and dashes", () => {
    expect(shortHash(HASH_A)).toBe("𓉸 a1b2-c3d4-e5f6");
  });

  it("strips 0x prefix", () => {
    expect(shortHash(HASH_D)).toBe("𓉸 dead-beef-cafe");
  });

  it("pads short hashes", () => {
    expect(shortHash("ab")).toBe("𓉸 ab00-0000-0000");
  });
});

describe("visual — hashToColors", () => {
  it("returns 5 hex color strings", () => {
    const colors = hashToColors(HASH_A);
    expect(colors).toHaveLength(5);
    for (const c of colors) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("different hashes produce different colors", () => {
    const a = hashToColors(HASH_A);
    const b = hashToColors(HASH_B);
    expect(a).not.toEqual(b);
  });

  it("all-zero hash gives #000000 colors", () => {
    const colors = hashToColors(HASH_B);
    expect(colors[0]).toBe("#000000");
  });

  it("all-f hash gives #ffffff colors", () => {
    const colors = hashToColors(HASH_C);
    expect(colors[0]).toBe("#ffffff");
  });
});

describe("visual — renderDoorASCII", () => {
  it("renders ~15 lines (13-17 acceptable)", () => {
    const door = renderDoorASCII(HASH_A);
    const lines = door.split("\n");
    expect(lines.length).toBeGreaterThanOrEqual(13);
    expect(lines.length).toBeLessThanOrEqual(17);
  });

  it("default is exactly 15 lines", () => {
    const door = renderDoorASCII(HASH_A);
    expect(door.split("\n")).toHaveLength(15);
  });

  it("contains no English words — purely visual encoding", () => {
    const door = renderDoorASCII(HASH_A);
    expect(door).not.toMatch(/EXIT/i);
    expect(door).not.toMatch(/door/i);
    expect(door).not.toMatch(/always/i);
  });

  it("is compact — max ~30 chars wide", () => {
    const door = renderDoorASCII(HASH_A);
    const lines = door.split("\n");
    for (const line of lines) {
      expect([...line].length).toBeLessThanOrEqual(30);
    }
  });

  it("different hashes produce different ASCII", () => {
    const a = renderDoorASCII(HASH_A);
    const b = renderDoorASCII(HASH_B);
    expect(a).not.toBe(b);
  });

  it("produces visibly different output for similar hashes", () => {
    const a = renderDoorASCII("a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6");
    const b = renderDoorASCII("b1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6");
    expect(a).not.toBe(b);
  });

  it("contains mixed Unicode character sets (not just braille)", () => {
    const door = renderDoorASCII(HASH_A);
    // Should contain braille
    expect(door).toMatch(/[\u2800-\u28FF]/);
    // Should contain box drawing or block elements
    expect(door).toMatch(/[\u2500-\u257F\u2580-\u259F\u2550-\u256C]/);
  });

  it("backward compatible — no opts works", () => {
    const door = renderDoorASCII(HASH_A);
    expect(door.split("\n")).toHaveLength(15);
    expect(door.length).toBeGreaterThan(50);
  });

  // State encoding tests
  it("voluntary/complete door looks different from emergency/disputed", () => {
    const normal = renderDoorASCII(HASH_A, { exitType: 'voluntary', status: 'complete' });
    const emergency = renderDoorASCII(HASH_A, { exitType: 'emergency', status: 'disputed' });
    expect(normal).not.toBe(emergency);
  });

  it("pending status introduces gaps/transparency", () => {
    const pending = renderDoorASCII(HASH_A, { status: 'pending' });
    // Pending doors should have dots or blanks where complete ones have fills
    expect(pending).toMatch(/[·\u2800]/);
  });

  it("platform_initiated has crack characters", () => {
    const cracked = renderDoorASCII(HASH_A, { exitType: 'platform_initiated' });
    // Should contain some crack-like chars (slashes, lightning, etc.)
    expect(cracked).not.toBe(renderDoorASCII(HASH_A, { exitType: 'voluntary' }));
  });

  it("isEntry adds entry markers", () => {
    const entry = renderDoorASCII(HASH_A, { isEntry: true });
    expect(entry).toMatch(/[›‹]/);
  });

  it("origin influences style", () => {
    const a = renderDoorASCII(HASH_A, { origin: 'twitter' });
    const b = renderDoorASCII(HASH_A, { origin: 'mastodon' });
    expect(a).not.toBe(b);
  });

  it("all exitType/status combos render 15 lines", () => {
    for (const exitType of ['voluntary', 'platform_initiated', 'emergency'] as const) {
      for (const status of ['complete', 'pending', 'disputed'] as const) {
        const door = renderDoorASCII(HASH_A, { exitType, status });
        expect(door.split("\n")).toHaveLength(15);
      }
    }
  });
});

describe("visual — renderDoorSVG", () => {
  it("returns valid SVG string", () => {
    const svg = renderDoorSVG(HASH_A);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("embeds hash-derived colors", () => {
    const svg = renderDoorSVG(HASH_A);
    const colors = hashToColors(HASH_A);
    for (const c of colors) {
      expect(svg).toContain(c);
    }
  });

  it("contains arch path for hobbit-hole shape", () => {
    const svg = renderDoorSVG(HASH_A);
    expect(svg).toContain("<path");
    expect(svg).toContain("clipPath");
  });

  it("respects custom dimensions", () => {
    const svg = renderDoorSVG(HASH_A, { width: 400, height: 680 });
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="680"');
  });

  it("different hashes produce different SVGs", () => {
    expect(renderDoorSVG(HASH_A)).not.toBe(renderDoorSVG(HASH_B));
  });

  it("emergency exitType adds damage lines", () => {
    const svg = renderDoorSVG(HASH_A, { exitType: 'emergency' });
    expect(svg).toContain('stroke-dasharray');
  });

  it("pending status reduces opacity", () => {
    const svg = renderDoorSVG(HASH_A, { status: 'pending' });
    expect(svg).toContain('opacity="0.6"');
  });

  it("entry door adds arrival marker", () => {
    const svg = renderDoorSVG(HASH_A, { isEntry: true });
    expect(svg).toContain('ARRIVAL');
  });

  it("disputed status applies skew", () => {
    const svg = renderDoorSVG(HASH_A, { status: 'disputed' });
    expect(svg).toContain('skewX');
  });
});
