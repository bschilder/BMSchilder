export type LogoTheme = 'teal-pink' | 'purple-gold' | 'mono-teal' | 'white';

/** Change this to swap the active logo theme site-wide */
export const ACTIVE_THEME: LogoTheme = 'teal-pink';

const THEMES: Record<LogoTheme, { primary: string; secondary: string; accent: string }> = {
  'teal-pink':   { primary: '#01cdfe', secondary: '#ff71ce', accent: '#b967ff' },
  'purple-gold': { primary: '#b967ff', secondary: '#fffb96', accent: '#ff71ce' },
  'mono-teal':   { primary: '#01cdfe', secondary: '#01cdfe', accent: '#01cdfe' },
  'white':       { primary: '#ffffff', secondary: '#ffffff', accent: '#ffffff' },
};

/**
 * Generate an inline SVG logo.
 * The logo is a stylized "BMS" monogram with a DNA double-helix motif
 * and a small perspective grid line beneath.
 */
export function generateLogo(size: number, theme?: LogoTheme): string {
  const t = THEMES[theme || ACTIVE_THEME];
  const id = `logo-${Math.random().toString(36).slice(2, 7)}`;

  // Aspect ratio ~2.8:1 for "BMS"
  const w = size * 2.8;
  const h = size;

  return `<svg viewBox="0 0 112 40" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-label="BMS Logo">
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.primary}"/>
      <stop offset="50%" stop-color="${t.accent}"/>
      <stop offset="100%" stop-color="${t.secondary}"/>
    </linearGradient>
  </defs>
  <!-- BMS text -->
  <text x="56" y="28" text-anchor="middle" font-family="'Space Grotesk', sans-serif"
        font-size="30" font-weight="700" fill="url(#${id})" letter-spacing="3">BMS</text>
  <!-- DNA helix motif through the B vertical -->
  <path d="M8 8 Q14 14 8 20 Q2 26 8 32" stroke="${t.primary}" stroke-width="1.2" fill="none" opacity="0.6"/>
  <path d="M12 8 Q6 14 12 20 Q18 26 12 32" stroke="${t.secondary}" stroke-width="1.2" fill="none" opacity="0.6"/>
  <!-- Helix rungs -->
  <line x1="8" y1="11" x2="12" y2="11" stroke="${t.accent}" stroke-width="0.8" opacity="0.4"/>
  <line x1="8" y1="17" x2="12" y2="17" stroke="${t.accent}" stroke-width="0.8" opacity="0.4"/>
  <line x1="8" y1="23" x2="12" y2="23" stroke="${t.accent}" stroke-width="0.8" opacity="0.4"/>
  <line x1="8" y1="29" x2="12" y2="29" stroke="${t.accent}" stroke-width="0.8" opacity="0.4"/>
  <!-- Grid line beneath -->
  <line x1="4" y1="36" x2="108" y2="36" stroke="${t.primary}" stroke-width="0.5" opacity="0.25"/>
  <line x1="20" y1="36" x2="56" y2="38" stroke="${t.primary}" stroke-width="0.3" opacity="0.15"/>
  <line x1="92" y1="36" x2="56" y2="38" stroke="${t.primary}" stroke-width="0.3" opacity="0.15"/>
</svg>`;
}

/**
 * Generate a compact icon logo (just "B" with helix) for favicon and small uses.
 */
export function generateIconLogo(size: number, theme?: LogoTheme): string {
  const t = THEMES[theme || ACTIVE_THEME];
  const id = `icon-${Math.random().toString(36).slice(2, 7)}`;

  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" aria-label="BMS">
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.primary}"/>
      <stop offset="100%" stop-color="${t.secondary}"/>
    </linearGradient>
  </defs>
  <rect width="40" height="40" rx="8" fill="#0d0221"/>
  <text x="20" y="29" text-anchor="middle" font-family="'Space Grotesk', sans-serif"
        font-size="26" font-weight="700" fill="url(#${id})">B</text>
  <!-- Helix -->
  <path d="M10 8 Q16 14 10 20 Q4 26 10 32" stroke="${t.primary}" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M14 8 Q8 14 14 20 Q20 26 14 32" stroke="${t.secondary}" stroke-width="1" fill="none" opacity="0.5"/>
</svg>`;
}
