/**
 * Icon-only logo: a DNA double helix woven through a central network node.
 * Represents the intersection of computational genomics and neuroscience.
 * No text — just the icon, using the vaporwave gradient palette.
 */

export function generateLogoSVG(size = 32): string {
  const id = `logo-g-${Math.random().toString(36).slice(2, 7)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-label="Logo">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#01cdfe"/>
      <stop offset="50%" stop-color="#b967ff"/>
      <stop offset="100%" stop-color="#ff71ce"/>
    </linearGradient>
  </defs>

  <!-- DNA strand 1 (left backbone) -->
  <path d="M18 8 C24 18, 24 26, 18 32 C12 38, 12 46, 18 56"
        stroke="url(#${id})" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <!-- DNA strand 2 (right backbone) -->
  <path d="M46 8 C40 18, 40 26, 46 32 C52 38, 52 46, 46 56"
        stroke="url(#${id})" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <!-- Base-pair rungs -->
  <line x1="22" y1="14" x2="42" y2="14" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <line x1="20" y1="23" x2="44" y2="23" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <line x1="20" y1="41" x2="44" y2="41" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <line x1="22" y1="50" x2="42" y2="50" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>

  <!-- Central node (network vertex) -->
  <circle cx="32" cy="32" r="8" stroke="url(#${id})" stroke-width="2.5" fill="none"/>
  <circle cx="32" cy="32" r="3" fill="url(#${id})" opacity="0.8"/>

  <!-- Satellite nodes + connection lines -->
  <circle cx="12" cy="32" r="3" stroke="url(#${id})" stroke-width="1.5" fill="none" opacity="0.7"/>
  <line x1="15" y1="32" x2="24" y2="32" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>

  <circle cx="52" cy="32" r="3" stroke="url(#${id})" stroke-width="1.5" fill="none" opacity="0.7"/>
  <line x1="49" y1="32" x2="40" y2="32" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>

  <circle cx="32" cy="10" r="2.5" stroke="url(#${id})" stroke-width="1.5" fill="none" opacity="0.7"/>
  <line x1="32" y1="12.5" x2="32" y2="24" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>

  <circle cx="32" cy="54" r="2.5" stroke="url(#${id})" stroke-width="1.5" fill="none" opacity="0.7"/>
  <line x1="32" y1="51.5" x2="32" y2="40" stroke="url(#${id})" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
</svg>`;
}
