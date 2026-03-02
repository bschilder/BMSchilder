import { cyclePalette } from '../palette';

const SUBTITLES = [
  'Computational Genomics',
  'AI & Machine Learning',
  'Scientific Entrepreneur',
  'Open-Source Developer',
  'Genome-Phenome AI',
  'Evolutionary Biology',
  'Multi-Omic Medicine',
  'Data Visualization',
];

export function initHero(): void {
  initTypewriter();
  initCanvas();
}

function initTypewriter(): void {
  const el = document.querySelector('.hero__typed') as HTMLElement;
  if (!el) return;

  let subtitleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function tick() {
    const current = SUBTITLES[subtitleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        timeoutId = setTimeout(() => {
          deleting = true;
          tick();
        }, 2000);
        return;
      }
      timeoutId = setTimeout(tick, 80);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        subtitleIndex = (subtitleIndex + 1) % SUBTITLES.length;
        timeoutId = setTimeout(tick, 400);
        return;
      }
      timeoutId = setTimeout(tick, 40);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (timeoutId !== null) clearTimeout(timeoutId);
    } else {
      timeoutId = setTimeout(tick, 200);
    }
  });

  tick();
}

/* ── Flag slider (planted in the landscape) ── */
function createFlagSlider(): { getValue: () => number } {
  const hero = document.querySelector('.hero') as HTMLElement;
  if (!hero) return { getValue: () => 50 };

  const wrap = document.createElement('div');
  wrap.className = 'hero__flag-slider';
  wrap.innerHTML = `
    <div class="hero__flag-pennant">
      <svg width="22" height="16" viewBox="0 0 22 16"><polygon points="0,0 22,4 0,12" fill="var(--vapor-teal)" opacity="0.85"/></svg>
    </div>
    <div class="hero__flag-pole"></div>
    <input type="range" min="0" max="100" value="50" class="hero__flag-input" orient="vertical" aria-label="Mountain cragginess" />
    <div class="hero__flag-base">▲</div>
  `;
  hero.appendChild(wrap);

  const input = wrap.querySelector('.hero__flag-input') as HTMLInputElement;
  const pennant = wrap.querySelector('.hero__flag-pennant') as HTMLElement;

  // Move pennant with thumb
  function updatePennant() {
    const pct = Number(input.value) / 100;
    // Slider value 0=bottom, 100=top. Pennant goes from 85% to 5% of pole height
    pennant.style.top = `${5 + (1 - pct) * 80}%`;
  }
  input.addEventListener('input', updatePennant);
  updatePennant();

  return { getValue: () => Number(input.value) };
}

/** Read a CSS custom property value from :root */
function cssVar(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** Hex string → {r, g, b} integers */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/** Blend two hex colors by ratio (0 = a, 1 = b) */
function blendHex(a: string, b: string, ratio: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * ratio);
  const g = Math.round(ca.g + (cb.g - ca.g) * ratio);
  const bl = Math.round(ca.b + (cb.b - ca.b) * ratio);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

/** Darken a hex color by a factor (0 = black, 1 = original) */
function darkenHex(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const dr = Math.round(r * factor);
  const dg = Math.round(g * factor);
  const db = Math.round(b * factor);
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

function initCanvas(): void {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const mtnSlider = createFlagSlider();

  // ── Palette-derived colors (recomputed on palette switch) ──
  interface CanvasColors {
    tealRgb: { r: number; g: number; b: number };
    pinkRgb: { r: number; g: number; b: number };
    palTeal: string;
    palTextPrimary: string;
    skyTop: string; skyMid1: string; skyMid2: string; skyBottom: string;
    sunGlowInner: string; sunGlowMid: string; sunGlowOuter: string;
    sunDiscTop: string; sunDiscMid: string; sunDiscBottom: string;
    mtnFarLight: string; mtnFarMid: string; mtnFarDark: string; mtnFarBase: string;
    mtnMidLight: string; mtnMidMid: string; mtnMidBase: string;
    mtnNearLight: string; mtnNearMid: string; mtnNearBase: string;
    ridgeFarColor: string; ridgeMidColor: string;
    rockFarLight: string; rockFarDark: string;
    rockMidLight: string; rockMidDark: string;
    rockNearLight: string; rockNearDark: string;
    groundTop: string; groundBottom: string;
  }

  function computeColors(): CanvasColors {
    const bgDeep = cssVar('--bg-deep', '#0d0221');
    const bgPrimary = cssVar('--bg-primary', '#150535');
    const bgElevated = cssVar('--bg-elevated', '#1a0a4a');
    const bgSurface = cssVar('--bg-surface', '#241660');
    const teal = cssVar('--vapor-teal', '#01cdfe');
    const pink = cssVar('--vapor-pink', '#ff71ce');
    const purple = cssVar('--vapor-purple', '#b967ff');
    const gold = cssVar('--vapor-gold', '#fffb96');
    const lavender = cssVar('--vapor-lavender', '#d9b3ff');
    const textPrimary = cssVar('--text-primary', '#e8e0f0');

    const tealRgb = hexToRgb(teal);
    const pinkRgb = hexToRgb(pink);

    return {
      tealRgb, pinkRgb,
      palTeal: teal,
      palTextPrimary: textPrimary,
      skyTop: bgDeep, skyMid1: bgElevated, skyMid2: bgSurface,
      skyBottom: blendHex(bgSurface, purple, 0.25),
      sunGlowInner: pink + '66', sunGlowMid: purple + '33', sunGlowOuter: teal + '15',
      sunDiscTop: gold, sunDiscMid: pink, sunDiscBottom: purple,
      mtnFarLight: bgSurface, mtnFarMid: blendHex(bgElevated, bgSurface, 0.4),
      mtnFarDark: bgElevated, mtnFarBase: bgPrimary,
      mtnMidLight: bgElevated, mtnMidMid: blendHex(bgPrimary, bgElevated, 0.5),
      mtnMidBase: darkenHex(bgPrimary, 0.7),
      mtnNearLight: darkenHex(bgPrimary, 0.7), mtnNearMid: darkenHex(bgPrimary, 0.5),
      mtnNearBase: darkenHex(bgDeep, 0.7),
      ridgeFarColor: `rgba(${pinkRgb.r}, ${pinkRgb.g}, ${pinkRgb.b}, 0.18)`,
      ridgeMidColor: `rgba(${tealRgb.r}, ${tealRgb.g}, ${tealRgb.b}, 0.10)`,
      rockFarLight: lavender, rockFarDark: bgElevated,
      rockMidLight: teal, rockMidDark: darkenHex(bgDeep, 0.6),
      rockNearLight: blendHex(purple, bgSurface, 0.5), rockNearDark: darkenHex(bgDeep, 0.3),
      groundTop: bgPrimary, groundBottom: bgDeep,
    };
  }

  let C = computeColors();

  // Sun interaction state
  let sunHoverGlow = 0;   // 0..1, intensifies on hover
  let sunBarOffset = 0;    // vertical offset for animating bar scroll on click
  let sunBarSpeed = 0;     // decaying speed for bar animation

  let animId: number;
  let width: number;
  let height: number;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx!.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  // Pre-compute star positions
  const NUM_STARS = 80;
  const starSeeds = Array.from({ length: NUM_STARS }, (_, i) => ({
    xBase: (i * 137.5) % 1000,
    yBase: (i * 97.3) % 1000,
    speed: (i % 4 + 1) * 0.015,
    size: (i % 3 === 0) ? 1.5 : 0.8,
  }));

  // Per-star activation brightness (for mouse interaction)
  const starBrightness = new Float32Array(NUM_STARS); // 0..1, decays over time
  // Track stars activated specifically by shooting stars (for white constellation lines)
  const starShootActivated = new Float32Array(NUM_STARS);

  // Mouse tracking
  let mouseX = -1000;
  let mouseY = -1000;
  let mouseOnCanvas = false;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    mouseOnCanvas = true;
  });
  canvas.addEventListener('mouseleave', () => {
    mouseOnCanvas = false;
  });

  // ── Shooting star state ──
  interface ShootingStar {
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    progress: number;
    speed: number;
    active: boolean;
  }
  let shootingStar: ShootingStar | null = null;

  // Distance from point (px, py) to line segment (ax, ay)→(bx, by)
  function pointToSegmentDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
    let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = ax + t * dx;
    const projY = ay + t * dy;
    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const horizon = height * 0.58;
    const sunY = horizon - 20;
    const sunR = Math.min(width, height) * 0.11;
    const sunCX = width / 2;

    // Check if click is on the sun
    const dxSun = clickX - sunCX;
    const dySun = clickY - sunY;
    if (Math.sqrt(dxSun * dxSun + dySun * dySun) < sunR * 1.3) {
      // Cycle palette and recompute colors
      cyclePalette();
      C = computeColors();
      // Trigger bar scroll animation
      sunBarSpeed = 6;
      canvas.style.cursor = 'pointer';
      return;
    }

    // Only trigger shooting star in the sky region
    if (clickY < horizon) {
      const edge = Math.random();
      let startX: number, startY: number;
      if (edge < 0.4) {
        startX = Math.random() * width;
        startY = -10;
      } else if (edge < 0.7) {
        startX = -10;
        startY = Math.random() * clickY * 0.4;
      } else {
        startX = width + 10;
        startY = Math.random() * clickY * 0.4;
      }

      shootingStar = {
        startX, startY,
        targetX: clickX, targetY: clickY,
        progress: 0,
        speed: 0.015 + Math.random() * 0.01,
        active: true,
      };
    }
  });

  // Pre-compute rock texture seeds for each mountain layer
  const ROCK_SEEDS = 600;
  const rockDots = Array.from({ length: ROCK_SEEDS }, (_, i) => ({
    xPct: ((i * 173.7 + i * i * 0.3) % 1000) / 1000,
    yPct: ((i * 241.3 + i * 0.7) % 1000) / 1000,
    seed: ((i * 97.1) % 1000) / 1000,
    size: 0.8 + ((i * 53) % 100) / 100 * 2.0,
  }));

  let time = 0;

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const horizon = height * 0.58;

    // ---- SKY ----
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
    skyGrad.addColorStop(0, C.skyTop);
    skyGrad.addColorStop(0.4, C.skyMid1);
    skyGrad.addColorStop(0.75, C.skyMid2);
    skyGrad.addColorStop(1, C.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, horizon);

    // ---- STARS with mouse-driven brightness ----
    const starPositions: { x: number; y: number }[] = [];
    const MOUSE_RADIUS = 180;

    for (let si = 0; si < starSeeds.length; si++) {
      const star = starSeeds[si];
      const x = ((star.xBase / 1000 * width) + time * star.speed) % width;
      const y = (star.yBase / 1000) * (horizon * 0.85);
      starPositions.push({ x, y });

      // Mouse proximity boost
      if (mouseOnCanvas) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const boost = (1 - dist / MOUSE_RADIUS);
          starBrightness[si] = Math.min(1, Math.max(starBrightness[si], boost));
        }
      }

      // Decay brightness slowly
      starBrightness[si] *= 0.993;

      const baseAlpha = 0.3 + Math.sin(time * 0.012 + star.xBase) * 0.25;
      const brightness = starBrightness[si];
      const alpha = Math.min(1, baseAlpha + brightness * 0.7);
      const starSize = star.size + brightness * 2.5;

      // Glow for bright stars
      if (brightness > 0.15) {
        ctx.globalAlpha = brightness * 0.3;
        ctx.fillStyle = C.palTeal;
        ctx.beginPath();
        ctx.arc(x, y, starSize + 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = brightness > 0.2 ? '#ffffff' : C.palTextPrimary;
      ctx.beginPath();
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // ---- CONSTELLATIONS ----
    ctx.lineWidth = 0.6;
    for (let i = 0; i < starPositions.length; i++) {
      for (let j = i + 1; j < starPositions.length; j++) {
        const dx = starPositions[i].x - starPositions[j].x;
        const dy = starPositions[i].y - starPositions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          // Base subtle flicker
          const flicker = 0.5 + 0.5 * Math.sin(time * 0.008 + i * 3.7 + j * 2.3);
          const baseAlpha = (1 - dist / 120) * 0.15 * flicker;

          // Mouse-activated bright constellations
          const pairBright = Math.min(starBrightness[i], starBrightness[j]);
          const mouseAlpha = pairBright * (1 - dist / 120) * 0.8;

          const alpha = baseAlpha + mouseAlpha;
          if (alpha > 0.015) {
            ctx.globalAlpha = Math.min(1, alpha);
            ctx.lineWidth = pairBright > 0.2 ? 1.2 : 0.6;
            ctx.strokeStyle = pairBright > 0.2 ? C.palTeal : `rgba(${C.tealRgb.r}, ${C.tealRgb.g}, ${C.tealRgb.b}, 0.8)`;
            ctx.beginPath();
            ctx.moveTo(starPositions[i].x, starPositions[i].y);
            ctx.lineTo(starPositions[j].x, starPositions[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // ---- SHOOTING STAR MEGA-CONSTELLATION ----
    // Directly activated stars + one-hop neighbors form a rich web
    const SHOOT_THRESHOLD = 0.1;
    const NEIGHBOR_RADIUS = 140;
    const directSet = new Set<number>();
    const megaSet = new Set<number>();
    // Brightness for mega-constellation members (direct or neighbor)
    const megaBright = new Float32Array(NUM_STARS);

    // 1. Collect directly activated stars
    for (let si = 0; si < NUM_STARS; si++) {
      if (starShootActivated[si] > SHOOT_THRESHOLD) {
        directSet.add(si);
        megaSet.add(si);
        megaBright[si] = starShootActivated[si];
      }
    }

    // 2. Add one-hop neighbors of directly activated stars
    if (directSet.size > 0) {
      for (let si = 0; si < NUM_STARS; si++) {
        if (megaSet.has(si)) continue;
        for (const di of directSet) {
          const dx = starPositions[si].x - starPositions[di].x;
          const dy = starPositions[si].y - starPositions[di].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < NEIGHBOR_RADIUS) {
            megaSet.add(si);
            // Neighbor brightness is dimmer, scaled by distance
            megaBright[si] = Math.max(megaBright[si],
              starShootActivated[di] * (1 - dist / NEIGHBOR_RADIUS) * 0.7);
            break;
          }
        }
      }
    }

    // 3. Draw all connections between mega-constellation members within range
    if (megaSet.size > 1) {
      const megaArr = Array.from(megaSet);
      ctx.save();
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 4;

      for (let a = 0; a < megaArr.length; a++) {
        for (let b = a + 1; b < megaArr.length; b++) {
          const ai = megaArr[a];
          const bi = megaArr[b];
          const dx = starPositions[ai].x - starPositions[bi].x;
          const dy = starPositions[ai].y - starPositions[bi].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < NEIGHBOR_RADIUS) {
            const pairAlpha = Math.min(megaBright[ai], megaBright[bi]);
            const distFade = 1 - dist / NEIGHBOR_RADIUS;
            const alpha = pairAlpha * distFade * 1.2;
            if (alpha < 0.02) continue;

            ctx.globalAlpha = Math.min(1, alpha);
            // Direct-to-direct: thick bright white; others: slightly thinner
            const bothDirect = directSet.has(ai) && directSet.has(bi);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = bothDirect ? 1.5 : 1.0;
            ctx.beginPath();
            ctx.moveTo(starPositions[ai].x, starPositions[ai].y);
            ctx.lineTo(starPositions[bi].x, starPositions[bi].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    ctx.globalAlpha = 1;

    // ---- SUN HOVER GLOW ----
    const sunY = horizon - 20;
    const sunR = Math.min(width, height) * 0.11;
    const sunCX = width / 2;

    // Compute hover intensity
    if (mouseOnCanvas) {
      const dxSun = mouseX - sunCX;
      const dySun = mouseY - sunY;
      const sunDist = Math.sqrt(dxSun * dxSun + dySun * dySun);
      if (sunDist < sunR * 1.5) {
        sunHoverGlow = Math.min(1, sunHoverGlow + 0.04);
        canvas.style.cursor = 'pointer';
      } else {
        sunHoverGlow *= 0.95;
        if (sunHoverGlow < 0.01) sunHoverGlow = 0;
        canvas.style.cursor = '';
      }
    } else {
      sunHoverGlow *= 0.95;
      if (sunHoverGlow < 0.01) sunHoverGlow = 0;
    }

    // Animate bar scroll offset (triggered by click)
    sunBarOffset += sunBarSpeed;
    sunBarSpeed *= 0.96;
    if (sunBarSpeed < 0.05) sunBarSpeed = 0;

    // Outer glow (intensifies on hover)
    const glowRadius = sunR * (2.5 + sunHoverGlow * 1.5);
    const sunGlow = ctx.createRadialGradient(sunCX, sunY, 0, sunCX, sunY, glowRadius);
    sunGlow.addColorStop(0, C.sunGlowInner);
    sunGlow.addColorStop(0.3, C.sunGlowMid);
    sunGlow.addColorStop(0.6, C.sunGlowOuter);
    sunGlow.addColorStop(1, 'transparent');
    ctx.globalAlpha = 1 + sunHoverGlow * 0.6;
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    // Extra hover glow ring
    if (sunHoverGlow > 0.05) {
      ctx.save();
      ctx.globalAlpha = sunHoverGlow * 0.35;
      const hoverGlow = ctx.createRadialGradient(sunCX, sunY, sunR * 0.8, sunCX, sunY, sunR * 2.2);
      hoverGlow.addColorStop(0, C.sunGlowInner);
      hoverGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = hoverGlow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // ---- SUN DISC (sliced with animated bars) ----
    ctx.save();
    ctx.beginPath();
    const sliceGap = 3;
    for (let y = sunY - sunR; y < sunY + sunR; y += sliceGap * 2) {
      const barY = y - (sunBarOffset % (sliceGap * 2));
      ctx.rect(sunCX - sunR - 10, barY, sunR * 2 + 20, sliceGap);
    }
    ctx.clip();
    const discGrad = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
    discGrad.addColorStop(0, C.sunDiscTop);
    discGrad.addColorStop(0.35, C.sunDiscMid);
    discGrad.addColorStop(1, C.sunDiscBottom);
    ctx.beginPath();
    ctx.arc(sunCX, sunY, sunR, 0, Math.PI * 2);
    ctx.fillStyle = discGrad;
    ctx.fill();
    ctx.restore();

    // ---- MOUNTAINS ----
    const crag = mtnSlider.getValue() / 100; // 0..1
    // Higher max: amplitude scale goes from 0.3 (gentle) to 2.0 (towering)
    const ampScale = 0.3 + crag * 1.7;

    function mountainProfile(seed: number, segments: number, baseY: number, amplitude: number): number[] {
      const pts: number[] = [];
      const weights = [
        0.30,
        0.18 + crag * 0.12,
        0.05 + crag * 0.20,
        crag * 0.22,
        crag * crag * 0.14,
        crag * crag * crag * 0.08,
      ];
      const freqs = [3.1, 7.7, 15.3, 31.1, 63.7, 127.0];
      const seedMults = [1, 2.3, 0.7, 1.9, 3.1, 0.3];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        let val = 0;
        for (let o = 0; o < freqs.length; o++) {
          val += Math.sin(t * freqs[o] + seed * seedMults[o]) * weights[o];
        }
        const envelope = Math.sin(t * Math.PI) * 0.7 + 0.3;
        pts.push(baseY - val * amplitude * ampScale * envelope);
      }
      return pts;
    }

    // Draw rock texture on a mountain range — evolves with cragginess
    function drawRockTexture(
      profile: number[], segments: number, baseY: number,
      lightColor: string, darkColor: string,
    ) {
      if (!ctx) return;
      const intensity = 0.15 + crag * 0.85; // 0.15 at smooth → 1.0 at max crag

      // ── Horizontal strata bands ──
      const strataCount = Math.floor(4 + crag * 12);
      for (let s = 0; s < strataCount; s++) {
        const bandPct = (s + 0.5) / strataCount; // 0..1 within the mountain face
        ctx.globalAlpha = intensity * (0.06 + crag * 0.10);
        ctx.strokeStyle = s % 2 === 0 ? lightColor : darkColor;
        ctx.lineWidth = 0.8 + crag * 0.5;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * width;
          const ridgeY = profile[i] || baseY;
          const yRange = baseY - ridgeY;
          if (yRange < 4) continue;
          const bandY = ridgeY + bandPct * yRange;
          // Add subtle waviness to the strata
          const wobble = Math.sin(x * 0.02 + s * 7.3) * (2 + crag * 4);
          if (i === 0) ctx.moveTo(x, bandY + wobble);
          else ctx.lineTo(x, bandY + wobble);
        }
        ctx.stroke();
      }

      // ── Stipple / shard dots ──
      const dotCount = Math.floor(ROCK_SEEDS * intensity);
      for (let di = 0; di < dotCount; di++) {
        const dot = rockDots[di];
        const seg = Math.floor(dot.xPct * segments);
        const ridgeY = profile[seg] || baseY;
        const yRange = baseY - ridgeY;
        if (yRange < 4) continue;

        const dotX = dot.xPct * width;
        const dotY = ridgeY + dot.yPct * yRange;
        const alpha = (0.08 + dot.seed * 0.15) * intensity;
        const size = dot.size * (0.6 + crag * 0.8);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = dot.seed > 0.5 ? lightColor : darkColor;

        if (crag > 0.4 && di % 3 === 0) {
          // Angular shards at higher crag
          const shardSize = size * (1.0 + crag);
          const angle = dot.xPct * 17 + dot.yPct * 31;
          ctx.beginPath();
          ctx.moveTo(dotX, dotY - shardSize);
          ctx.lineTo(dotX + shardSize * Math.cos(angle), dotY + shardSize * 0.7);
          ctx.lineTo(dotX - shardSize * Math.cos(angle + 1.2), dotY + shardSize * 0.5);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(dotX, dotY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Crack lines (vertical fissures) ──
      const crackCount = Math.floor(crag * 18);
      for (let c = 0; c < crackCount; c++) {
        const crack = rockDots[c % ROCK_SEEDS];
        const seg = Math.floor(crack.xPct * segments);
        const ridgeY = profile[seg] || baseY;
        const yRange = baseY - ridgeY;
        if (yRange < 8) continue;

        const crackX = crack.xPct * width;
        const crackTopY = ridgeY + crack.yPct * yRange * 0.3;
        const crackLen = yRange * (0.15 + crack.seed * 0.35);

        ctx.globalAlpha = (0.1 + crag * 0.2) * intensity;
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 0.5 + crag * 0.8;
        ctx.beginPath();
        ctx.moveTo(crackX, crackTopY);
        // Jagged crack path
        const steps = 3 + Math.floor(crag * 4);
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const jitter = (Math.sin(crackX * 0.1 + s * 5.7 + crack.seed * 20) * 3) * crag;
          ctx.lineTo(crackX + jitter, crackTopY + crackLen * t);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    const mtnSegments = Math.max(Math.floor(width / 3), 120);

    // Far range
    const farProfile = mountainProfile(42.7, mtnSegments, horizon, 150);
    const farGrad = ctx.createLinearGradient(0, horizon - 180, 0, horizon);
    farGrad.addColorStop(0, C.mtnFarLight);
    farGrad.addColorStop(0.3, C.mtnFarMid);
    farGrad.addColorStop(0.7, C.mtnFarDark);
    farGrad.addColorStop(1, C.mtnFarBase);
    ctx.fillStyle = farGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (let i = 0; i <= mtnSegments; i++) {
      ctx.lineTo((i / mtnSegments) * width, farProfile[i]);
    }
    ctx.lineTo(width, horizon);
    ctx.closePath();
    ctx.fill();

    // Ridge highlight
    ctx.save();
    ctx.strokeStyle = C.ridgeFarColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= mtnSegments; i++) {
      const x = (i / mtnSegments) * width;
      if (i === 0) ctx.moveTo(x, farProfile[i]);
      else ctx.lineTo(x, farProfile[i]);
    }
    ctx.stroke();
    ctx.restore();

    drawRockTexture(farProfile, mtnSegments, horizon, C.rockFarLight, C.rockFarDark);

    // Mid range
    const midProfile = mountainProfile(19.3, mtnSegments, horizon, 100);
    const midGrad = ctx.createLinearGradient(0, horizon - 120, 0, horizon);
    midGrad.addColorStop(0, C.mtnMidLight);
    midGrad.addColorStop(0.5, C.mtnMidMid);
    midGrad.addColorStop(1, C.mtnMidBase);
    ctx.fillStyle = midGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (let i = 0; i <= mtnSegments; i++) {
      ctx.lineTo((i / mtnSegments) * width, midProfile[i]);
    }
    ctx.lineTo(width, horizon);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = C.ridgeMidColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= mtnSegments; i++) {
      const x = (i / mtnSegments) * width;
      if (i === 0) ctx.moveTo(x, midProfile[i]);
      else ctx.lineTo(x, midProfile[i]);
    }
    ctx.stroke();
    ctx.restore();

    drawRockTexture(midProfile, mtnSegments, horizon, C.rockMidLight, C.rockMidDark);

    // Near range
    const nearProfile = mountainProfile(7.1, mtnSegments, horizon + 5, 65);
    const nearGrad = ctx.createLinearGradient(0, horizon - 70, 0, horizon + 5);
    nearGrad.addColorStop(0, C.mtnNearLight);
    nearGrad.addColorStop(0.6, C.mtnNearMid);
    nearGrad.addColorStop(1, C.mtnNearBase);
    ctx.fillStyle = nearGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 5);
    for (let i = 0; i <= mtnSegments; i++) {
      ctx.lineTo((i / mtnSegments) * width, nearProfile[i]);
    }
    ctx.lineTo(width, horizon + 5);
    ctx.closePath();
    ctx.fill();

    drawRockTexture(nearProfile, mtnSegments, horizon + 5, C.rockNearLight, C.rockNearDark);

    // ---- GROUND ----
    const groundGrad = ctx.createLinearGradient(0, horizon, 0, height);
    groundGrad.addColorStop(0, C.groundTop);
    groundGrad.addColorStop(1, C.groundBottom);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizon, width, height - horizon);

    // ---- PERSPECTIVE GRID (racing toward viewer) ----
    const gridSpeed = 0.003;
    const lineCount = 24;

    for (let i = 0; i <= lineCount; i++) {
      const rawT = ((i / lineCount) + (time * gridSpeed)) % 1.0;
      const y = horizon + (height - horizon) * (rawT * rawT);
      const alpha = 0.08 + rawT * 0.25;
      ctx.strokeStyle = `rgba(${C.tealRgb.r}, ${C.tealRgb.g}, ${C.tealRgb.b}, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const vLines = 26;
    const vanishX = width / 2;
    for (let i = -vLines / 2; i <= vLines / 2; i++) {
      const bottomX = vanishX + i * (width / vLines) * 1.6;
      ctx.strokeStyle = `rgba(${C.tealRgb.r}, ${C.tealRgb.g}, ${C.tealRgb.b}, 0.1)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vanishX, horizon);
      ctx.lineTo(bottomX, height);
      ctx.stroke();
    }

    // ---- SHOOTING STAR ----
    if (shootingStar && shootingStar.active) {
      shootingStar.progress += shootingStar.speed;

      if (shootingStar.progress >= 1) {
        shootingStar.active = false;
      } else {
        const { startX, startY, targetX, targetY, progress } = shootingStar;
        const currentX = startX + (targetX - startX) * progress;
        const currentY = startY + (targetY - startY) * progress;

        // Light up nearby stars along the trajectory
        for (let si = 0; si < starPositions.length; si++) {
          const dist = pointToSegmentDist(
            starPositions[si].x, starPositions[si].y,
            startX, startY, currentX, currentY,
          );
          if (dist < 70) {
            const boost = (1 - dist / 70);
            starBrightness[si] = Math.min(1, Math.max(starBrightness[si], boost));
            starShootActivated[si] = Math.min(1, Math.max(starShootActivated[si], boost));
          }
        }

        // Draw the shooting star trail
        const tailLen = 0.12;
        const tailProgress = Math.max(0, progress - tailLen);
        const tailX = startX + (targetX - startX) * tailProgress;
        const tailY = startY + (targetY - startY) * tailProgress;

        ctx.save();
        // Trail gradient
        const grad = ctx.createLinearGradient(tailX, tailY, currentX, currentY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        grad.addColorStop(0.8, 'rgba(200, 220, 255, 0.8)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 1)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Bright head glow
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow ring
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = C.palTeal;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Decay shooting star activation
    for (let si = 0; si < NUM_STARS; si++) {
      starShootActivated[si] *= 0.992;
    }

    // ---- SCANLINES ----
    ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }

    time++;
    animId = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  }
}
