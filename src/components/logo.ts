/**
 * Circos-style logo — nodes on a ring connected by symmetric curved chords
 * that form a star pattern in the center.
 * Transparent background. Uses the vaporwave teal / purple / pink palette.
 */

export function generateLogoSVG(size = 32): string {
  const id = `cx-${Math.random().toString(36).slice(2, 7)}`;

  const cx = 32, cy = 32, r = 26;
  const n = 8;
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      x: Math.round((cx + r * Math.cos(angle)) * 10) / 10,
      y: Math.round((cy + r * Math.sin(angle)) * 10) / 10,
    });
  }

  // Symmetric chord sets:
  // Set 1: Opposites (distance 4) — cross through center (teal)
  // Set 2: Distance 3 — rotated square pattern (purple + pink alternating)
  const chords: [number, number, string, number][] = [
    // Opposites — near-straight through center
    [0, 4, '#01cdfe', 0.6],
    [1, 5, '#01cdfe', 0.6],
    [2, 6, '#01cdfe', 0.6],
    [3, 7, '#01cdfe', 0.6],
    // Distance 3 — wider arcs forming rotated square
    [0, 3, '#b967ff', 0.55],
    [2, 5, '#ff71ce', 0.55],
    [4, 7, '#b967ff', 0.55],
    [6, 1, '#ff71ce', 0.55],
  ];

  const chordPaths = chords.map(([i, j, color, opacity]) => {
    const a = nodes[i], b = nodes[j];
    // Control point pulled toward center
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const cpx = cx + (mid.x - cx) * 0.08;
    const cpy = cy + (mid.y - cy) * 0.08;
    return `<path d="M${a.x},${a.y} Q${cpx},${cpy} ${b.x},${b.y}" stroke="${color}" stroke-width="1.5" fill="none" opacity="${opacity}" stroke-linecap="round"/>`;
  }).join('\n  ');

  const nodeColors = ['#01cdfe', '#b967ff', '#ff71ce', '#01cdfe', '#b967ff', '#ff71ce', '#01cdfe', '#b967ff'];

  const nodeDots = nodes.map((p, i) =>
    `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${nodeColors[i]}"/>`
  ).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-label="Logo">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#01cdfe"/>
      <stop offset="50%" stop-color="#b967ff"/>
      <stop offset="100%" stop-color="#ff71ce"/>
    </linearGradient>
  </defs>

  <!-- Outer ring -->
  <circle cx="${cx}" cy="${cy}" r="${r}" stroke="url(#${id})" stroke-width="2" fill="none" opacity="0.8"/>

  <!-- Symmetric interior chords -->
  ${chordPaths}

  <!-- Nodes -->
  ${nodeDots}
</svg>`;
}
