/**
 * visual.ts — Door Hash visualization module
 * "QR code but it's a door." Renders EXIT marker hashes as visual doors.
 *
 * There's always a door.
 */

// ─── Types ──────────────────────────────────────────────────────────

export interface DoorOptions {
  exitType?: 'voluntary' | 'platform_initiated' | 'emergency';
  status?: 'complete' | 'pending' | 'disputed';
  origin?: string;
  isEntry?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────

function normalizeHash(hash: string): string {
  return hash.replace(/^0x/, '').toLowerCase();
}

function hexAt(hash: string, index: number): number {
  const h = normalizeHash(hash);
  return parseInt(h[index % h.length], 16) || 0;
}

// ─── Hash Byte Helper ───────────────────────────────────────────────

function hashByte(h: string, byteIndex: number): number {
  const i = (byteIndex * 2) % h.length;
  const hi = parseInt(h[i] || '0', 16);
  const lo = parseInt(h[(i + 1) % h.length] || '0', 16);
  return (hi << 4) | lo;
}

// ─── Character Classes (Layer 3: hash encoding within visual roles) ─
//
// WIDTH-SAFE UNICODE RANGES — Discord "safe mode" (no braille):
//   • ASCII (U+0020-U+007E): all safe
//   • Box Drawing (U+2500-U+257F): │┃║─━═╭╮╰╯┌┐└┘├┤┬┴┼╔╗╚╝╠╣╦╩╬ etc.
//   • Block Elements (U+2580-U+259F): ░▒▓█ and basic quadrants
//   • Select Latin symbols: · (U+00B7)
//
// AVOID: Braille (U+2800-U+28FF) — inconsistent width in Discord code blocks
// AVOID: East Asian Ambiguous chars, geometric shapes, math operators

const CC = {
  // Frame characters — box drawing vertical lines
  frame_v:   ['│', '┃', '║', '╎', '╏', '┆', '┇', '┊'],
  frame_h:   ['─', '━', '═', '╌', '╍', '┄', '┅', '┈'],
  // Corners — grouped by style family (index 0=double, 1=heavy, 2=rounded, 3=light)
  corner_tl: ['╔', '┏', '╭', '┌'],
  corner_tr: ['╗', '┓', '╮', '┐'],
  corner_bl: ['╚', '┗', '╰', '└'],
  corner_br: ['╝', '┛', '╯', '┘'],
  // Panel fills — Discord-safe only: ░▒▓█· (no braille, no exotic quadrants)
  panel_light:  ['░', '·', '·', '░', '░', '·', '░', '·'],
  panel_medium: ['▒', '░', '▓', '▒', '░', '▒', '▓', '░'],
  panel_heavy:  ['▓', '█', '█', '▓', '▓', '█', '▓', '█'],
  // Hinges — left and right structural markers
  hinge_l:   ['╟', '╠', '├', '╞', '┝', '┠', '┢', '┞'],
  hinge_r:   ['╢', '╣', '┤', '╡', '┥', '┨', '┪', '┦'],
  // Handles — symmetric pairs, Discord-safe (█▓ contrast, no ▖▗▘▝▐▌)
  handle_l:  ['█', '▓', '█', '▓', '█', '▓', '█', '▓'],
  handle_r:  ['▓', '█', '▓', '█', '▓', '█', '▓', '█'],
  // Arch diagonal characters — hash-varied
  arch_diag_l: ['╱', '/', '╱', '/', '╱', '/', '╱', '/'],
  arch_diag_r: ['╲', '\\', '╲', '\\', '╲', '\\', '╲', '\\'],
  // Broken seam characters for emergency exits
  seam_broken: ['╏', '┆', '┊', '╎', '│', '┇', '┆', '╏'],
  // Threshold — box drawing
  threshold: ['═', '━', '─', '━', '═', '─', '━', '═'],
  // Seam junctions
  seam_btm:  ['╧', '┻', '┴', '╨'],
  // Crack/damage characters — box drawing only
  crack:     ['╱', '╲', '╳', '╌', '╍', '┄', '┅', '┈'],
  broken:    ['┄', '┆', '┊', '╌', '╍', '┅', '┈', '┇'],
};

// ─── Style Profiles (Layer 2: status/exitType signaling) ────────────

interface StyleProfile {
  familyIdx: number;        // 0=double, 1=heavy, 2=rounded, 3=light — selects corner style
  panelClass: 'panel_light' | 'panel_medium' | 'panel_heavy';
  frameWeight: number;      // index bias into frame_v/frame_h variants
  damageRate: number;       // 0 = no damage, higher = more cracks
  gapRate: number;          // 0 = no gaps, higher = more blanks
  asymmetric: boolean;      // if true, right panel uses different fill class
}

function getStyleProfile(exitType: string, status: string): StyleProfile {
  // exitType determines the MAJOR visual style
  const base: StyleProfile = {
    familyIdx: 2,          // rounded by default (elegant)
    panelClass: 'panel_light',
    frameWeight: 0,
    damageRate: 0,
    gapRate: 0,
    asymmetric: false,
  };

  switch (exitType) {
    case 'voluntary':
      base.familyIdx = 2;    // rounded, elegant
      base.panelClass = 'panel_light';
      base.frameWeight = 0;
      break;
    case 'platform_initiated':
      base.familyIdx = 0;    // double-line, institutional
      base.panelClass = 'panel_heavy';
      base.frameWeight = 2;  // heavier frame chars
      break;
    case 'emergency':
      base.familyIdx = 1;    // heavy but broken
      base.panelClass = 'panel_medium';
      base.frameWeight = 1;
      base.damageRate = 2;   // aggressive cracking (handled specially in renderer)
      base.gapRate = 4;
      break;
  }

  // status modifies the style
  switch (status) {
    case 'pending':
      base.gapRate = Math.max(base.gapRate, 3);
      break;
    case 'disputed':
      base.asymmetric = true;
      base.damageRate = Math.max(base.damageRate, 6);
      break;
  }

  return base;
}

// ─── ASCII Door Renderer ────────────────────────────────────────────

/**
 * Render a 10-line ASCII-art door — Discord-safe (no braille).
 *
 * Three-layer hierarchy:
 *   Layer 1: Visual structure (arch, frame, panels, seam, hinges, handle)
 *   Layer 2: Status signaling (exitType/status select overall style)
 *   Layer 3: Hash encoding (within each character class, hash selects variant)
 *
 * Structure uses box drawing (U+2500-257F) + block shading (░▒▓█·).
 * Center seam ┃ runs through ALL rows including arch top.
 */
export function renderDoorASCII(hash: string, opts?: DoorOptions): string {
  const h = normalizeHash(hash);
  const exitType = opts?.exitType ?? 'voluntary';
  const status = opts?.status ?? 'complete';
  const origin = opts?.origin;
  const isEntry = opts?.isEntry ?? false;

  const originShift = origin
    ? [...origin].reduce((a, c) => a + c.charCodeAt(0), 0) % 4
    : 0;

  const profile = getStyleProfile(exitType, status);
  const fi = (profile.familyIdx + originShift) % 4;

  let byteIdx = 0;
  function nextByte(): number { return hashByte(h, byteIdx++); }
  function pick(cls: string[], b: number): string { return cls[b % cls.length]; }

  // Fill character sets — Discord-safe only (░▒▓█·)
  const fillCls = CC[profile.panelClass];
  const rightFillCls = profile.asymmetric
    ? (profile.panelClass === 'panel_light' ? CC.panel_heavy : CC.panel_light)
    : fillCls;

  const emergencyCrackCls = [...CC.crack, ...CC.broken];

  // Structural characters
  const frameV   = pick(CC.frame_v, profile.frameWeight * 2 + (hexAt(h, 0) % 2));
  const seamCh   = '┃';
  // For emergency exits, the seam is cracked/broken per row
  const archDiagL = pick(CC.arch_diag_l, hexAt(h, 7));
  const archDiagR = pick(CC.arch_diag_r, hexAt(h, 7));
  function seamAt(row: number): string {
    if (exitType === 'emergency') {
      const v = hashByte(h, row + 20);
      return pick(CC.seam_broken, v);
    }
    return seamCh;
  }
  const seamBtm  = CC.seam_btm[fi];
  const threshCh = pick(CC.threshold, hexAt(h, 3));
  const handleL  = pick(CC.handle_l, hexAt(h, 4));
  const handleR  = pick(CC.handle_r, hexAt(h, 5));
  const hingeL   = pick(CC.hinge_l, hexAt(h, 6));
  const hingeR   = pick(CC.hinge_r, hexAt(h, 6));
  const cornerBL = CC.corner_bl[fi];
  const cornerBR = CC.corner_br[fi];

  // Fill function with damage/pending overlays
  function fill(row: number, col: number, isRight: boolean): string {
    const b = nextByte();
    const cls = isRight ? rightFillCls : fillCls;
    let ch = pick(cls, b);

    if (exitType === 'emergency') {
      const v = (row * 7 + col * 11 + hexAt(h, (row + col) % h.length)) % 3;
      if (v === 0) return pick(emergencyCrackCls, nextByte());
    } else if (profile.damageRate > 0) {
      const v = (row * 7 + col * 11 + hexAt(h, (row + col) % h.length)) % (profile.damageRate + 8);
      if (v < 1) {
        if (profile.gapRate > 0 && (row + col) % profile.gapRate === 0) return ' ';
        return pick(CC.crack, nextByte());
      }
    }
    if (status === 'pending') {
      const v = (row * 7 + col * 13) % 10;
      if (v < 2) return ' ';
      if (v < 3) return '·';
    }
    return ch;
  }

  // ─── Layout: 10 rows, body width 21 codepoints ───
  // Arch rows (0-2): space-padded, NO vertical frame bars at edges.
  //   Row 0:      ╭────┬────╮       crown (11 chars, 5 spaces each side)
  //   Row 1:    ╱······┃······╲     arch mid (15 chars, 3 spaces each side)
  //   Row 2:  ╱·········┃·········╲ arch wide (19 chars, 1 space each side)
  // Rows 3-8: │█████████┃█████████│  body (21 chars)
  // Row 9:    ╰═════════┴═════════╯  threshold (21 chars)

  const W = 21;
  const PW = 9;       // panel width (each side, excluding seam)
  const HINGE_ROWS = [4, 7];
  const HANDLE_ROW = 5;

  const lines: string[] = [];

  // ─── Arch rows (0-2): space-padded, tapered width ───
  // Row 0: crown with horizontal lines, innerHalf=4 (─ chars)
  // Row 1: arch with hash fills, innerHalf=6
  // Row 2: arch with hash fills, innerHalf=8
  const archDefs: { leftEdge: string; rightEdge: string; innerHalf: number; isCrown: boolean }[] = [
    { leftEdge: '╭', rightEdge: '╮', innerHalf: 4, isCrown: true },
    { leftEdge: archDiagL, rightEdge: archDiagR, innerHalf: 6, isCrown: false },
    { leftEdge: archDiagL, rightEdge: archDiagR, innerHalf: 8, isCrown: false },
  ];

  for (let r = 0; r < archDefs.length; r++) {
    const { leftEdge, rightEdge, innerHalf, isCrown } = archDefs[r];
    // Content width = 1(left) + innerHalf + 1(seam) + innerHalf + 1(right)
    const contentW = 2 + innerHalf * 2 + 1;
    const pad = Math.floor((W - contentW) / 2);

    let row = ' '.repeat(pad) + leftEdge;

    if (isCrown) {
      // Crown: horizontal line fills + ┬ seam
      const hCh = pick(CC.frame_h, hexAt(h, 1));
      row += hCh.repeat(innerHalf) + '┬' + hCh.repeat(innerHalf);
    } else {
      // Arch: hash-encoded fills + ┃ seam
      for (let c = 0; c < innerHalf; c++) {
        row += fill(r, c, false);
      }
      row += seamAt(r);
      for (let c = 0; c < innerHalf; c++) {
        row += fill(r, c, true);
      }
    }

    row += rightEdge;
    // Pad right to full width
    row += ' '.repeat(Math.max(0, W - row.length));

    lines.push(row);
  }

  // ─── Body rows (3-8): full fill between frames ───
  for (let r = 3; r <= 8; r++) {
    let line = '';
    const isHinge = HINGE_ROWS.includes(r);
    line += isHinge ? hingeL : frameV;

    for (let c = 0; c < PW; c++) {
      if (r === HANDLE_ROW && c === PW - 2) {
        line += handleL;
      } else {
        line += fill(r, c, false);
      }
    }

    line += seamAt(r);

    for (let c = 0; c < PW; c++) {
      if (r === HANDLE_ROW && c === 1) {
        line += handleR;
      } else {
        line += fill(r, c, true);
      }
    }

    line += isHinge ? hingeR : frameV;
    lines.push(line);
  }

  // ─── Threshold row ───
  lines.push(cornerBL + threshCh.repeat(PW) + seamBtm + threshCh.repeat(PW) + cornerBR);

  // Entry markers — replace body frame chars on rows 3-5 with entry arrows
  if (isEntry) {
    for (let i = 3; i < 6 && i < lines.length; i++) {
      const arr = [...lines[i]];
      if (arr.length > 1) {
        arr[0] = '›';
        arr[arr.length - 1] = '‹';
      }
      lines[i] = arr.join('');
    }
  }

  return lines.join('\n');
}

// ─── Hash to Color Palette ──────────────────────────────────────────

export function hashToColors(hash: string): string[] {
  const h = normalizeHash(hash);
  const colors: string[] = [];

  for (let i = 0; i < 5; i++) {
    const offset = i * 6;
    const r = (hexAt(h, offset) * 16 + hexAt(h, offset + 1)) & 0xff;
    const g = (hexAt(h, offset + 2) * 16 + hexAt(h, offset + 3)) & 0xff;
    const b = (hexAt(h, offset + 4) * 16 + hexAt(h, offset + 5)) & 0xff;
    colors.push(
      '#' +
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0')
    );
  }

  return colors;
}

// ─── SVG Door Generator ─────────────────────────────────────────────

export function renderDoorSVG(
  hash: string,
  opts?: { width?: number; height?: number } & DoorOptions
): string {
  const w = opts?.width ?? 200;
  const ht = opts?.height ?? 340;
  const colors = hashToColors(hash);
  const h = normalizeHash(hash);

  const exitType = opts?.exitType ?? 'voluntary';
  const status = opts?.status ?? 'complete';
  const isEntry = opts?.isEntry ?? false;

  const handleDigit = hexAt(hash, 6);
  const handleSide = hexAt(hash, 19) & 1;
  const handleY = 200 + (handleDigit % 5) * 6;
  const handleX = handleSide === 0 ? 90 : 110;
  const hingeW = 6 + (hexAt(h, 8) % 4) * 2;

  // Status-based opacity & filters
  const panelOpacity = status === 'pending' ? 0.6 : 1.0;
  const doorTransform = status === 'pending' ? 'translate(3, 0)' : '';
  const disputedSkew = status === 'disputed' ? 'skewX(2)' : '';

  // Damage overlay for platform_initiated / emergency
  let damageElements = '';
  if (exitType === 'platform_initiated') {
    damageElements = [
      `<line x1="60" y1="140" x2="95" y2="260" stroke="#444" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>`,
      `<line x1="130" y1="150" x2="110" y2="280" stroke="#444" stroke-width="1" stroke-dasharray="3,4" opacity="0.5"/>`,
    ].join('\n  ');
  } else if (exitType === 'emergency') {
    damageElements = [
      `<line x1="55" y1="130" x2="100" y2="290" stroke="#666" stroke-width="2" stroke-dasharray="6,2" opacity="0.8"/>`,
      `<line x1="140" y1="140" x2="105" y2="285" stroke="#666" stroke-width="2" stroke-dasharray="5,3" opacity="0.8"/>`,
      `<line x1="75" y1="160" x2="60" y2="290" stroke="#555" stroke-width="1.5" opacity="0.6"/>`,
      `<rect x="95" y="280" width="10" height="20" fill="#1a1a2e" opacity="0.5"/>`,
    ].join('\n  ');
  }

  // Entry marker
  const entryMarker = isEntry
    ? `<text x="100" y="325" text-anchor="middle" font-size="12" fill="${colors[3]}" font-family="monospace">▼ ARRIVAL ▼</text>`
    : '';

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340" width="${w}" height="${ht}">`,
    `  <defs>`,
    `    <clipPath id="arch">`,
    `      <path d="M40,160 L40,300 L160,300 L160,160 A60,70 0 0,0 40,160 Z"/>`,
    `    </clipPath>`,
    `  </defs>`,
    `  <rect width="200" height="340" fill="#1a1a2e" rx="4"/>`,
    `  <g transform="${disputedSkew}">`,
    `  <path d="M35,160 L35,305 L165,305 L165,160 A65,75 0 0,0 35,160 Z" fill="${colors[4]}" stroke="#333" stroke-width="2"/>`,
    `  <g transform="${doorTransform}" opacity="${panelOpacity}">`,
    `    <rect x="42" y="130" width="55" height="168" fill="${colors[0]}" clip-path="url(#arch)" rx="2"/>`,
    `    <rect x="103" y="130" width="55" height="168" fill="${colors[1]}" clip-path="url(#arch)" rx="2"/>`,
    `  </g>`,
    `  <line x1="100" y1="95" x2="100" y2="300" stroke="${colors[2]}" stroke-width="2"/>`,
    `  <path d="M42,160 A58,67 0 0,1 158,160" fill="none" stroke="${colors[3]}" stroke-width="1.5"/>`,
    `  <rect x="38" y="170" width="${hingeW}" height="6" fill="#8b7355" rx="1"/>`,
    `  <rect x="38" y="250" width="${hingeW}" height="6" fill="#8b7355" rx="1"/>`,
    `  <rect x="${162 - hingeW}" y="170" width="${hingeW}" height="6" fill="#8b7355" rx="1"/>`,
    `  <rect x="${162 - hingeW}" y="250" width="${hingeW}" height="6" fill="#8b7355" rx="1"/>`,
    `  <circle cx="${handleX}" cy="${handleY}" r="5" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/>`,
    `  <circle cx="${handleX}" cy="${handleY + 14}" r="2.5" fill="#1a1a2e"/>`,
    `  <rect x="${handleX - 1}" y="${handleY + 14}" width="2" height="6" fill="#1a1a2e"/>`,
    damageElements ? `  ${damageElements}` : '',
    entryMarker ? `  ${entryMarker}` : '',
    `  </g>`,
    `  <line x1="20" y1="305" x2="180" y2="305" stroke="#555" stroke-width="1"/>`,
    `</svg>`,
  ].filter(Boolean).join('\n');
}

// ─── Short Hash ─────────────────────────────────────────────────────

export function shortHash(hash: string, isEntry?: boolean): string {
  const h = normalizeHash(hash);
  const seg = h.slice(0, 12).padEnd(12, '0');
  const prefix = isEntry ? '𓉸➜' : '➜𓉸';
  return `${prefix} ${seg.slice(0, 4)}-${seg.slice(4, 8)}-${seg.slice(8, 12)}`;
}
