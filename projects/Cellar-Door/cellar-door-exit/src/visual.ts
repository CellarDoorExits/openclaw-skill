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

// ─── Braille Helpers ────────────────────────────────────────────────

const BRAILLE_BASE = 0x2800;

function byteToBraille(b: number): string {
  return String.fromCodePoint(BRAILLE_BASE + (b & 0xff));
}

function hashByte(h: string, byteIndex: number): number {
  const i = (byteIndex * 2) % h.length;
  const hi = parseInt(h[i] || '0', 16);
  const lo = parseInt(h[(i + 1) % h.length] || '0', 16);
  return (hi << 4) | lo;
}

const BR_BLANK = '\u2800';

// ─── Character Classes (Layer 3: hash encoding within visual roles) ─

const CC = {
  // Frame characters — all read as "vertical line" but encode different bits
  frame_v:   ['│', '┃', '║', '╎', '╏', '┆', '┇', '┊'],
  frame_h:   ['─', '━', '═', '╌', '╍', '┄', '┅', '┈'],
  // Corners — grouped by style family (index 0=double, 1=heavy, 2=rounded, 3=light)
  corner_tl: ['╔', '┏', '╭', '┌'],
  corner_tr: ['╗', '┓', '╮', '┐'],
  corner_bl: ['╚', '┗', '╰', '└'],
  corner_br: ['╝', '┛', '╯', '┘'],
  // Arch fill — decorative mass for the arch area
  arch_fill: ['▓', '▒', '░', '█', '▚', '▞', '▛', '▜'],
  // Panel fills by weight
  panel_light:  ['░', '·', '∙', '◌', '⠂', '⠄', '⠈', '⠐'],
  panel_medium: ['▒', '▚', '▞', '◇', '◈', '⠊', '⠑', '⠔'],
  panel_heavy:  ['▓', '█', '▛', '▜', '▙', '▟', '⠛', '⠿'],
  // Center seam — all read as "vertical divider"
  seam:      ['┆', '┊', '╎', '┋', '│', '║', '¦', '⁞'],
  // Hinges — left and right structural markers
  hinge_l:   ['╟', '╠', '├', '╞', '┝', '┠', '┢', '┞'],
  hinge_r:   ['╢', '╣', '┤', '╡', '┥', '┨', '┪', '┦'],
  // Handles
  handle:    ['◉', '◎', '⊚', '⊛', '⊙', '◍', '●', '○'],
  // Threshold
  threshold: ['═', '━', '─', '▀', '▔', '▁', '▂', '⏤'],
  // Seam junctions
  seam_top:  ['╦', '┳', '┬', '╤'],
  seam_btm:  ['╧', '┻', '┴', '╨'],
  // Crack/damage characters (for emergency/disputed)
  crack:     ['╱', '╲', '╳', '⁄', '∕', '≀', '⌇', '⌁'],
  broken:    ['⸗', '⁞', '⁝', '⁖', '⁘', '⁙', '┄', '┆'],
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
      base.damageRate = 4;   // ~1 in 4 panel cells cracked
      base.gapRate = 3;      // ~1 in 3 damaged cells become gaps
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
 * Render a 15-line ASCII-art door using three-layer hierarchy:
 *   Layer 1: Visual structure (arch, frame, panels, seam, hinges, handle)
 *   Layer 2: Status signaling (exitType/status select overall style)
 *   Layer 3: Hash encoding (within each character class, hash selects variant)
 *
 * Left and right panels share structural symmetry but differ in fill variants.
 */
export function renderDoorASCII(hash: string, opts?: DoorOptions): string {
  const h = normalizeHash(hash);
  const exitType = opts?.exitType ?? 'voluntary';
  const status = opts?.status ?? 'complete';
  const origin = opts?.origin;
  const isEntry = opts?.isEntry ?? false;

  // Origin shifts hash interpretation for style variety
  const originShift = origin
    ? [...origin].reduce((a, c) => a + c.charCodeAt(0), 0) % 4
    : 0;

  const profile = getStyleProfile(exitType, status);
  const fi = (profile.familyIdx + originShift) % 4; // corner family index

  let byteIdx = 0;
  function nextByte(): number { return hashByte(h, byteIdx++); }

  // Pick variant from a character class using a hash byte
  function pick(cls: string[], b: number): string { return cls[b % cls.length]; }

  // Structural characters (determined by style family + hash for minor variation)
  const cornerTL = CC.corner_tl[fi];
  const cornerTR = CC.corner_tr[fi];
  const cornerBL = CC.corner_bl[fi];
  const cornerBR = CC.corner_br[fi];
  const frameV   = pick(CC.frame_v, profile.frameWeight * 2 + (hexAt(h, 0) % 2));
  const frameH   = pick(CC.frame_h, profile.frameWeight * 2 + (hexAt(h, 1) % 2));
  const seamCh   = pick(CC.seam, hexAt(h, 2));
  const seamTop  = CC.seam_top[fi];
  const seamBtm  = CC.seam_btm[fi];
  const threshCh = pick(CC.threshold, hexAt(h, 3));
  const handleL  = pick(CC.handle, hexAt(h, 4));
  const handleR  = pick(CC.handle, hexAt(h, 5));
  const hingeL   = pick(CC.hinge_l, hexAt(h, 6));
  const hingeR   = pick(CC.hinge_r, hexAt(h, 6));

  // Panel fill classes: left and right use same class but different variant selection
  const panelCls = CC[profile.panelClass];
  // For disputed: right panel uses a DIFFERENT weight class (visible asymmetry)
  const rightPanelCls = profile.asymmetric
    ? (profile.panelClass === 'panel_light' ? CC.panel_heavy : CC.panel_light)
    : panelCls;

  // Damage overlay: replace fill char with crack/gap based on profile
  function maybeDamage(ch: string, row: number, col: number): string {
    if (profile.damageRate > 0) {
      const v = (row * 7 + col * 11 + hexAt(h, (row + col) % h.length)) % (profile.damageRate + 8);
      if (v < 1) {
        if (profile.gapRate > 0 && (row + col) % profile.gapRate === 0) return ' ';
        return pick(CC.crack, nextByte());
      }
    }
    if (status === 'pending') {
      const v = (row * 7 + col * 13) % 10;
      if (v < 2) return BR_BLANK;
      if (v < 3) return '·';
    }
    return ch;
  }

  // Generate a fill character for a panel cell
  function panelFill(row: number, col: number, isRight: boolean): string {
    const b = nextByte();
    const cls = isRight ? rightPanelCls : panelCls;
    // Occasionally use braille for texture variety (1 in 6)
    if (b % 6 === 0) {
      return maybeDamage(byteToBraille(nextByte()), row, col);
    }
    return maybeDamage(pick(cls, b), row, col);
  }

  // Arch fill character (denser than panel)
  function archFill(row: number, col: number): string {
    const b = nextByte();
    if (b % 8 === 0) return maybeDamage(byteToBraille(nextByte()), row, col);
    return maybeDamage(pick(CC.arch_fill, b), row, col);
  }

  // ─── Layout Constants ───
  // Total width = 24 chars
  // Arch widens: row0=12, row1=18, row2=22 (full body width)
  // Body: frame at col 1 and col 22, seam at col 11
  // Inner panels: left = cols 2-10 (9 cells), right = cols 12-21 (10... let me recalc)
  //
  // W=24, body: space + frame + 9 fill + seam + 9 fill + frame + space
  // col 0=space, 1=frame, 2-10=left panel(9), 11=seam, 12-20=right panel(9), 21=frame, 22-23=space... that's 24 but let me be explicit
  //
  // Actually: 24 chars = col 0..23
  //   col 0: space
  //   col 1: left frame
  //   col 2..10: left panel (9 chars)
  //   col 11: seam
  //   col 12..20: right panel (9 chars)
  //   col 21: right frame
  //   col 22..23: space (2 trailing... let's trim to 22)
  //
  // Simpler: W=22. col 0=frame, col 1-9=left(9), col 10=seam, col 11-19=right(9), col 20=frame... that's 21.
  // W=22: col 0=space, 1=frame, 2-10=left(9), 11=seam, 12-20=right(9), 21=frame. Done. Pad arch rows with spaces.

  const W = 22; // total display width
  const FL = 1;  // left frame column
  const FR = 21; // right frame column (W-1)
  const SEAM = 11;
  const HINGE_ROWS = [5, 9, 13]; // rows with hinge markers
  const HANDLE_ROW = 8;
  const ROWS = 15;

  // Arch widths (characters including corners) for rows 0-2
  const archWidths = [12, 18, 22];

  const lines: string[] = [];

  for (let r = 0; r < ROWS; r++) {
    let line = '';

    if (r <= 2) {
      // ─── Arch rows: filled decorative mass, widening ───
      const aw = archWidths[r]; // arch width in chars
      const pad = Math.floor((W - aw) / 2);
      const innerW = aw - 2; // minus two corners/edges
      const half = Math.floor(innerW / 2);

      line += ' '.repeat(pad);

      if (r === 2) {
        // Row 2 merges into body frame — use corner chars
        line += cornerTL;
        // Left half fill
        for (let i = 0; i < half; i++) line += archFill(r, i);
        // Seam junction at top
        if (innerW % 2 === 1) {
          line += seamTop;
          for (let i = 0; i < half; i++) line += archFill(r, half + 1 + i);
        } else {
          for (let i = 0; i < half; i++) line += archFill(r, half + i);
        }
        line += cornerTR;
      } else {
        // Rows 0-1: arch curves with fill
        line += pick(CC.corner_tl, fi + r); // slightly different curve per row
        for (let i = 0; i < half; i++) line += archFill(r, i);
        // Center keystone
        if (innerW % 2 === 1) {
          line += pick(CC.arch_fill, hexAt(h, 8 + r));
          for (let i = 0; i < half; i++) line += archFill(r, half + 1 + i);
        } else {
          for (let i = 0; i < half; i++) line += archFill(r, half + i);
        }
        line += pick(CC.corner_tr, fi + r);
      }

      line += ' '.repeat(W - pad - aw);
    } else if (r === ROWS - 1) {
      // ─── Threshold row ───
      line += ' ';
      line += cornerBL;
      for (let c = 0; c < 9; c++) line += threshCh;
      line += seamBtm;
      for (let c = 0; c < 9; c++) line += threshCh;
      line += cornerBR;
    } else {
      // ─── Body rows (3-13) ───
      line += ' '; // left margin

      // Left frame or hinge
      if (HINGE_ROWS.includes(r)) {
        line += hingeL;
      } else {
        line += frameV;
      }

      // Left panel (9 chars)
      for (let c = 0; c < 9; c++) {
        if (r === HANDLE_ROW && c === 7) {
          line += handleL;
        } else {
          line += panelFill(r, c, false);
        }
      }

      // Center seam
      line += seamCh;

      // Right panel (9 chars) — mirrors structure, different fill variants
      for (let c = 0; c < 9; c++) {
        if (r === HANDLE_ROW && c === 1) {
          line += handleR;
        } else {
          line += panelFill(r, c, true);
        }
      }

      // Right frame or hinge
      if (HINGE_ROWS.includes(r)) {
        line += hingeR;
      } else {
        line += frameV;
      }
    }

    // Entry markers on first two rows
    if (isEntry && (r === 0 || r === 1)) {
      const arr = [...line];
      if (arr.length > 1) {
        arr[0] = '›';
        arr[arr.length - 1] = '‹';
      }
      line = arr.join('');
    }

    lines.push(line);
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

export function shortHash(hash: string): string {
  const h = normalizeHash(hash);
  const seg = h.slice(0, 12).padEnd(12, '0');
  return `𓉸 ${seg.slice(0, 4)}-${seg.slice(4, 8)}-${seg.slice(8, 12)}`;
}
