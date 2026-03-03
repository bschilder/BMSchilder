/**
 * "The Nexus" — icon-only logo.
 *
 * Three orbital ellipses (teal / purple / pink) converge through a central
 * gradient node, with six satellite dots at the orbital endpoints forming
 * a hexagonal pattern.  Represents the harmonisation of many disciplines
 * through a single creative nexus.
 */

export function generateLogoSVG(size = 32): string {
  const id = `nx-${Math.random().toString(36).slice(2, 7)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-label="Logo">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#01cdfe"/>
      <stop offset="50%" stop-color="#b967ff"/>
      <stop offset="100%" stop-color="#ff71ce"/>
    </linearGradient>
  </defs>

  <!-- Orbital 1 — teal (horizontal) -->
  <ellipse cx="32" cy="32" rx="27" ry="10"
           stroke="#01cdfe" stroke-width="2" fill="none" opacity="0.85"/>

  <!-- Orbital 2 — purple (60°) -->
  <ellipse cx="32" cy="32" rx="27" ry="10"
           transform="rotate(60 32 32)"
           stroke="#b967ff" stroke-width="2" fill="none" opacity="0.85"/>

  <!-- Orbital 3 — pink (120°) -->
  <ellipse cx="32" cy="32" rx="27" ry="10"
           transform="rotate(120 32 32)"
           stroke="#ff71ce" stroke-width="2" fill="none" opacity="0.85"/>

  <!-- Satellite nodes (discipline endpoints) -->
  <circle cx="59"   cy="32"   r="2.5" fill="#01cdfe" opacity="0.8"/>
  <circle cx="5"    cy="32"   r="2.5" fill="#01cdfe" opacity="0.8"/>
  <circle cx="45.5" cy="55.4" r="2.5" fill="#b967ff" opacity="0.8"/>
  <circle cx="18.5" cy="8.6"  r="2.5" fill="#b967ff" opacity="0.8"/>
  <circle cx="18.5" cy="55.4" r="2.5" fill="#ff71ce" opacity="0.8"/>
  <circle cx="45.5" cy="8.6"  r="2.5" fill="#ff71ce" opacity="0.8"/>

  <!-- Central nexus -->
  <circle cx="32" cy="32" r="6" fill="url(#${id})"/>
  <circle cx="32" cy="32" r="2.5" fill="white" opacity="0.5"/>
</svg>`;
}
