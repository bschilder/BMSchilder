/**
 * ╔═══════════════════════════════════════════════╗
 * ║  PALETTE SELECTOR — change this to swap theme ║
 * ╠═══════════════════════════════════════════════╣
 * ║  Options:                                     ║
 * ║    'vaporwave'   — pink/teal/purple (default) ║
 * ║    'midnight'    — deep blue/cyan/white       ║
 * ║    'sunset'      — warm orange/gold/magenta   ║
 * ║    'cyberpunk'   — neon green/yellow on black  ║
 * ║    'arctic'      — ice blue/white/silver       ║
 * ║    'sakura'      — cherry blossom pink/white   ║
 * ║    'lagoon'      — minty teal/purple/pink      ║
 * ║    'greyscale'   — monochrome silver/white      ║
 * ╚═══════════════════════════════════════════════╝
 */
export let ACTIVE_PALETTE: PaletteName = 'vaporwave';

// ─────────────────────────────────────────────────

export type PaletteName = 'vaporwave' | 'midnight' | 'sunset' | 'cyberpunk' | 'arctic' | 'sakura' | 'lagoon' | 'greyscale';

export const PALETTE_NAMES: PaletteName[] = ['vaporwave', 'midnight', 'sunset', 'cyberpunk', 'arctic', 'sakura', 'lagoon', 'greyscale'];

/** Cycle to the next palette and apply it. Returns the new palette name. */
export function cyclePalette(): PaletteName {
  const idx = PALETTE_NAMES.indexOf(ACTIVE_PALETTE);
  ACTIVE_PALETTE = PALETTE_NAMES[(idx + 1) % PALETTE_NAMES.length];
  applyPalette(ACTIVE_PALETTE);
  return ACTIVE_PALETTE;
}

interface Palette {
  bgDeep: string;
  bgPrimary: string;
  bgElevated: string;
  bgSurface: string;
  pink: string;
  teal: string;
  purple: string;
  lavender: string;
  peach: string;
  mint: string;
  gold: string;
  coral: string;
  textPrimary: string;
  textSecondary: string;
  textDim: string;
  borderSubtle: string;
  borderGlow: string;
  gradientText: string;
  gradientCard: string;
  gradientHero: string;
}

const PALETTES: Record<PaletteName, Palette> = {
  vaporwave: {
    bgDeep: '#0d0221',
    bgPrimary: '#150535',
    bgElevated: '#1a0a4a',
    bgSurface: '#241660',
    pink: '#ff71ce',
    teal: '#01cdfe',
    purple: '#b967ff',
    lavender: '#d9b3ff',
    peach: '#ffb7c5',
    mint: '#05ffa1',
    gold: '#fffb96',
    coral: '#ff6e6e',
    textPrimary: '#e8e0f0',
    textSecondary: '#b0a0c8',
    textDim: '#6a5a80',
    borderSubtle: '#2d1b6940',
    borderGlow: '#01cdfe33',
    gradientText: 'linear-gradient(90deg, #01cdfe 0%, #01cdfe 25%, #b967ff 65%, #ff71ce 100%)',
    gradientCard: 'linear-gradient(160deg, #1a0a4a 0%, #150535 100%)',
    gradientHero: 'linear-gradient(135deg, #0d0221 0%, #1a0a4a 30%, #2d1b69 60%, #150535 100%)',
  },

  midnight: {
    bgDeep: '#0a0e1a',
    bgPrimary: '#0f1628',
    bgElevated: '#162040',
    bgSurface: '#1c2a52',
    pink: '#7eb8da',
    teal: '#00d4ff',
    purple: '#6c8eff',
    lavender: '#a8c4ff',
    peach: '#c4d8f0',
    mint: '#4bf5c8',
    gold: '#f0e68c',
    coral: '#ff8a80',
    textPrimary: '#e0e8f0',
    textSecondary: '#8a9bb8',
    textDim: '#4a5a78',
    borderSubtle: '#1c2a5240',
    borderGlow: '#00d4ff33',
    gradientText: 'linear-gradient(90deg, #00d4ff 0%, #6c8eff 50%, #a8c4ff 100%)',
    gradientCard: 'linear-gradient(160deg, #162040 0%, #0f1628 100%)',
    gradientHero: 'linear-gradient(135deg, #0a0e1a 0%, #162040 30%, #1c2a52 60%, #0f1628 100%)',
  },

  sunset: {
    bgDeep: '#1a0a0a',
    bgPrimary: '#2a1010',
    bgElevated: '#3d1818',
    bgSurface: '#4a2020',
    pink: '#ff6b9d',
    teal: '#ffaa44',
    purple: '#ff4488',
    lavender: '#ffc4dd',
    peach: '#ffd4a0',
    mint: '#ffcc00',
    gold: '#ffe066',
    coral: '#ff5533',
    textPrimary: '#f0e0d8',
    textSecondary: '#c8a898',
    textDim: '#806058',
    borderSubtle: '#4a202040',
    borderGlow: '#ffaa4433',
    gradientText: 'linear-gradient(90deg, #ffaa44 0%, #ff6b9d 50%, #ff4488 100%)',
    gradientCard: 'linear-gradient(160deg, #3d1818 0%, #2a1010 100%)',
    gradientHero: 'linear-gradient(135deg, #1a0a0a 0%, #3d1818 30%, #4a2020 60%, #2a1010 100%)',
  },

  cyberpunk: {
    bgDeep: '#0a0a0a',
    bgPrimary: '#111111',
    bgElevated: '#1a1a1a',
    bgSurface: '#222222',
    pink: '#ff2a6d',
    teal: '#05d9e8',
    purple: '#d300c5',
    lavender: '#ff6ac1',
    peach: '#ffc8dd',
    mint: '#39ff14',
    gold: '#fcee09',
    coral: '#ff073a',
    textPrimary: '#e0ffe0',
    textSecondary: '#88cc88',
    textDim: '#446644',
    borderSubtle: '#22222240',
    borderGlow: '#39ff1433',
    gradientText: 'linear-gradient(90deg, #39ff14 0%, #05d9e8 40%, #d300c5 70%, #ff2a6d 100%)',
    gradientCard: 'linear-gradient(160deg, #1a1a1a 0%, #111111 100%)',
    gradientHero: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #222222 60%, #111111 100%)',
  },

  arctic: {
    bgDeep: '#0b1520',
    bgPrimary: '#101e2e',
    bgElevated: '#182a3e',
    bgSurface: '#203650',
    pink: '#90caf9',
    teal: '#80deea',
    purple: '#b0bec5',
    lavender: '#cfd8dc',
    peach: '#e1f5fe',
    mint: '#a7ffeb',
    gold: '#fff9c4',
    coral: '#ef9a9a',
    textPrimary: '#eceff1',
    textSecondary: '#90a4ae',
    textDim: '#546e7a',
    borderSubtle: '#203650440',
    borderGlow: '#80deea33',
    gradientText: 'linear-gradient(90deg, #80deea 0%, #b0bec5 50%, #cfd8dc 100%)',
    gradientCard: 'linear-gradient(160deg, #182a3e 0%, #101e2e 100%)',
    gradientHero: 'linear-gradient(135deg, #0b1520 0%, #182a3e 30%, #203650 60%, #101e2e 100%)',
  },

  sakura: {
    bgDeep: '#1a0f1e',
    bgPrimary: '#241428',
    bgElevated: '#301a35',
    bgSurface: '#3d2042',
    pink: '#ffb7c5',
    teal: '#f8bbd0',
    purple: '#ce93d8',
    lavender: '#e1bee7',
    peach: '#fce4ec',
    mint: '#f48fb1',
    gold: '#fff0f5',
    coral: '#ef5350',
    textPrimary: '#fce4ec',
    textSecondary: '#d4a0b0',
    textDim: '#8a6070',
    borderSubtle: '#3d204240',
    borderGlow: '#ffb7c533',
    gradientText: 'linear-gradient(90deg, #ffb7c5 0%, #f8bbd0 30%, #ce93d8 65%, #e1bee7 100%)',
    gradientCard: 'linear-gradient(160deg, #301a35 0%, #241428 100%)',
    gradientHero: 'linear-gradient(135deg, #1a0f1e 0%, #301a35 30%, #3d2042 60%, #241428 100%)',
  },

  lagoon: {
    bgDeep: '#030f0f',
    bgPrimary: '#061a1a',
    bgElevated: '#0c2828',
    bgSurface: '#123535',
    pink: '#e88acd',
    teal: '#00e5c8',
    purple: '#a37be8',
    lavender: '#c4a8f0',
    peach: '#f0d0e0',
    mint: '#05ffa1',
    gold: '#b8f0c8',
    coral: '#ff7eb3',
    textPrimary: '#d8f5f0',
    textSecondary: '#8cc8b8',
    textDim: '#4a7a6a',
    borderSubtle: '#16404040',
    borderGlow: '#00e5c833',
    gradientText: 'linear-gradient(90deg, #05ffa1 0%, #00e5c8 30%, #a37be8 65%, #e88acd 100%)',
    gradientCard: 'linear-gradient(160deg, #0c2828 0%, #061a1a 100%)',
    gradientHero: 'linear-gradient(135deg, #030f0f 0%, #0c2828 30%, #123535 60%, #061a1a 100%)',
  },

  greyscale: {
    bgDeep: '#0a0a0a',
    bgPrimary: '#141414',
    bgElevated: '#1e1e1e',
    bgSurface: '#2a2a2a',
    pink: '#c0c0c0',
    teal: '#d0d0d0',
    purple: '#a0a0a0',
    lavender: '#b8b8b8',
    peach: '#e0e0e0',
    mint: '#e8e8e8',
    gold: '#f0f0f0',
    coral: '#909090',
    textPrimary: '#e8e8e8',
    textSecondary: '#999999',
    textDim: '#555555',
    borderSubtle: '#2a2a2a40',
    borderGlow: '#d0d0d033',
    gradientText: 'linear-gradient(90deg, #e8e8e8 0%, #c0c0c0 40%, #a0a0a0 70%, #d0d0d0 100%)',
    gradientCard: 'linear-gradient(160deg, #1e1e1e 0%, #141414 100%)',
    gradientHero: 'linear-gradient(135deg, #0a0a0a 0%, #1e1e1e 30%, #2a2a2a 60%, #141414 100%)',
  },
};

/** Apply the active palette's CSS variables to :root */
export function applyPalette(name: PaletteName = ACTIVE_PALETTE): void {
  const p = PALETTES[name];
  if (!p) return;

  const root = document.documentElement;
  root.style.setProperty('--bg-deep', p.bgDeep);
  root.style.setProperty('--bg-primary', p.bgPrimary);
  root.style.setProperty('--bg-elevated', p.bgElevated);
  root.style.setProperty('--bg-surface', p.bgSurface);

  root.style.setProperty('--vapor-pink', p.pink);
  root.style.setProperty('--vapor-teal', p.teal);
  root.style.setProperty('--vapor-purple', p.purple);
  root.style.setProperty('--vapor-lavender', p.lavender);
  root.style.setProperty('--vapor-peach', p.peach);
  root.style.setProperty('--vapor-mint', p.mint);
  root.style.setProperty('--vapor-gold', p.gold);
  root.style.setProperty('--vapor-coral', p.coral);

  root.style.setProperty('--text-primary', p.textPrimary);
  root.style.setProperty('--text-secondary', p.textSecondary);
  root.style.setProperty('--text-dim', p.textDim);

  root.style.setProperty('--border-subtle', p.borderSubtle);
  root.style.setProperty('--border-glow', p.borderGlow);

  root.style.setProperty('--gradient-text', p.gradientText);
  root.style.setProperty('--gradient-card', p.gradientCard);
  root.style.setProperty('--gradient-hero', p.gradientHero);

  // Recompute glows
  root.style.setProperty('--glow-pink', `0 0 15px ${p.pink}55, 0 0 45px ${p.pink}22`);
  root.style.setProperty('--glow-teal', `0 0 15px ${p.teal}55, 0 0 45px ${p.teal}22`);
  root.style.setProperty('--glow-purple', `0 0 15px ${p.purple}55, 0 0 45px ${p.purple}22`);
}
