"use client";

import { useEffect, useRef, useCallback } from "react";

// ── Seeded random for deterministic star/window placement ──
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Types ──
interface Star {
  x: number; y: number; r: number;
  brightness: number; twinkleSpeed: number; twinkleOffset: number;
  color: [number, number, number];
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; length: number;
}

interface CastleWindow {
  x: number; y: number; w: number; h: number;
  brightness: number; flickerSpeed: number; flickerOffset: number;
  color: [number, number, number, number];
}

interface CloudWisp {
  x: number; y: number; w: number; h: number;
  speed: number; opacity: number;
}

interface Ember {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  color: [number, number, number];
}

export default function HogwartsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const scrollRef = useRef(0);
  const timeRef = useRef(0);

  // Pre-generated data refs
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const windowsRef = useRef<CastleWindow[]>([]);
  const cloudsRef = useRef<CloudWisp[]>([]);
  const embersRef = useRef<Ember[]>([]);

  // ── Generate stars once ──
  const generateStars = useCallback((W: number, H: number) => {
    const rng = seededRandom(42);
    const stars: Star[] = [];
    for (let i = 0; i < 250; i++) {
      const isBright = rng() < 0.08;
      const r = isBright ? 1.2 + rng() * 1.5 : 0.3 + rng() * 1.0;
      const colorChoice = rng();
      let color: [number, number, number];
      if (colorChoice < 0.3) color = [255, 240, 220]; // warm white
      else if (colorChoice < 0.5) color = [200, 180, 255]; // purple-ish
      else if (colorChoice < 0.65) color = [180, 220, 255]; // blue-ish
      else color = [255, 255, 240]; // pure white

      stars.push({
        x: rng() * W,
        y: rng() * H * 0.55,
        r,
        brightness: 0.2 + rng() * 0.6,
        twinkleSpeed: 0.3 + rng() * 2.0,
        twinkleOffset: rng() * Math.PI * 2,
        color,
      });
    }
    starsRef.current = stars;
  }, []);

  // ── Generate castle windows once ──
  const generateWindows = useCallback((W: number, H: number) => {
    const rng = seededRandom(123);
    const wins: CastleWindow[] = [];
    const baseY = H * 0.58;

    // Main castle body windows — 4 rows, ~18 columns
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 18; col++) {
        if (rng() < 0.25) continue; // some windows dark
        const wx = W * 0.2 + col * (W * 0.035);
        const wy = baseY + row * (H * 0.04) + rng() * 4;
        const isWarm = rng() > 0.3;
        wins.push({
          x: wx, y: wy,
          w: 2.5 + rng() * 2, h: 4 + rng() * 4,
          brightness: 0.08 + rng() * 0.2,
          flickerSpeed: 0.5 + rng() * 2,
          flickerOffset: rng() * Math.PI * 2,
          color: isWarm ? [255, 200, 80, 1] : [180, 160, 255, 1],
        });
      }
    }

    // Tower windows
    const towerXPositions = [0.17, 0.3, 0.47, 0.53, 0.68, 0.82];
    towerXPositions.forEach((tx) => {
      const towerHeight = 4 + Math.floor(rng() * 4);
      for (let r = 0; r < towerHeight; r++) {
        if (rng() < 0.3) continue;
        wins.push({
          x: W * tx + rng() * 6 - 3,
          y: baseY - H * 0.08 - r * (H * 0.035) + rng() * 3,
          w: 2 + rng() * 1.5, h: 3.5 + rng() * 3,
          brightness: 0.1 + rng() * 0.25,
          flickerSpeed: 0.4 + rng() * 1.8,
          flickerOffset: rng() * Math.PI * 2,
          color: rng() > 0.5 ? [255, 215, 80, 1] : [200, 170, 255, 1],
        });
      }
    });

    windowsRef.current = wins;
  }, []);

  // ── Generate cloud wisps ──
  const generateClouds = useCallback((W: number, H: number) => {
    const clouds: CloudWisp[] = [];
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * W * 1.5 - W * 0.25,
        y: H * 0.05 + Math.random() * H * 0.25,
        w: W * (0.15 + Math.random() * 0.25),
        h: H * (0.02 + Math.random() * 0.04),
        speed: 8 + Math.random() * 15,
        opacity: 0.02 + Math.random() * 0.04,
      });
    }
    cloudsRef.current = clouds;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      generateStars(W, H);
      generateWindows(W, H);
      generateClouds(W, H);
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Main animation loop ──
    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - (timeRef.current || timestamp)) / 1000, 0.05);
      timeRef.current = timestamp;
      const t = timestamp / 1000;
      const scroll = scrollRef.current;
      const scrollPx = scroll * 0.02;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // ══════════════════════════════════════════
      // 1. SKY GRADIENT (deep night → horizon)
      // ══════════════════════════════════════════
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, "#020108");
      skyGrad.addColorStop(0.25, "#050312");
      skyGrad.addColorStop(0.5, "#0a061c");
      skyGrad.addColorStop(0.7, "#0f0a24");
      skyGrad.addColorStop(0.85, "#14102e");
      skyGrad.addColorStop(1, "#0a0618");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // ══════════════════════════════════════════
      // 2. AURORA BOREALIS
      // ══════════════════════════════════════════
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 5; i++) {
        const ax = W * (0.15 + i * 0.15);
        const ay = H * 0.08 + Math.sin(t * 0.2 + i * 1.2) * H * 0.06;
        const aw = W * (0.12 + Math.sin(t * 0.15 + i) * 0.04);
        const ah = H * (0.2 + Math.sin(t * 0.1 + i * 0.8) * 0.08);

        const aGrad = ctx.createRadialGradient(ax, ay, 0, ax, ay + ah * 0.5, ah);
        const hue = 140 + i * 25 + Math.sin(t * 0.3 + i) * 20; // green → teal → purple
        aGrad.addColorStop(0, `hsla(${hue}, 60%, 50%, 0.025)`);
        aGrad.addColorStop(0.4, `hsla(${hue + 20}, 50%, 40%, 0.015)`);
        aGrad.addColorStop(1, "transparent");
        ctx.fillStyle = aGrad;
        ctx.fillRect(ax - aw, ay - ah * 0.3, aw * 2, ah * 1.5);
      }
      // Aurora curtain streaks
      for (let i = 0; i < 12; i++) {
        const sx = W * (0.1 + i * 0.07) + Math.sin(t * 0.4 + i * 0.9) * 20;
        const sy = H * 0.02;
        const sh = H * (0.15 + Math.sin(t * 0.25 + i * 1.3) * 0.08);
        const hue = 130 + i * 12 + Math.sin(t * 0.2 + i) * 15;
        const sGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
        sGrad.addColorStop(0, `hsla(${hue}, 50%, 45%, 0.03)`);
        sGrad.addColorStop(0.5, `hsla(${hue + 15}, 45%, 40%, 0.015)`);
        sGrad.addColorStop(1, "transparent");
        ctx.fillStyle = sGrad;
        ctx.fillRect(sx - 3, sy, 6, sh);
      }
      ctx.restore();

      // ══════════════════════════════════════════
      // 3. STARS
      // ══════════════════════════════════════════
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sy = s.y + scrollPx;
        if (sy < -10 || sy > H * 0.6) continue;

        const twinkle = 0.4 + 0.6 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.brightness * twinkle;
        if (alpha < 0.02) continue;

        ctx.beginPath();
        ctx.arc(s.x, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha})`;
        ctx.fill();

        // Bright stars get a cross/glow
        if (s.r > 1.5 && alpha > 0.3) {
          const glow = ctx.createRadialGradient(s.x, sy, 0, s.x, sy, s.r * 6);
          glow.addColorStop(0, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha * 0.15})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(s.x - s.r * 6, sy - s.r * 6, s.r * 12, s.r * 12);

          // Cross spikes
          ctx.strokeStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 4, sy);
          ctx.lineTo(s.x + s.r * 4, sy);
          ctx.moveTo(s.x, sy - s.r * 4);
          ctx.lineTo(s.x, sy + s.r * 4);
          ctx.stroke();
        }
      }

      // ══════════════════════════════════════════
      // 4. SHOOTING STARS
      // ══════════════════════════════════════════
      const shooters = shootingStarsRef.current;
      // Spawn occasionally
      if (Math.random() < 0.003 && shooters.length < 3) {
        const angle = -0.3 - Math.random() * 0.5;
        const speed = 300 + Math.random() * 400;
        shooters.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.3,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * -speed * 0.3 + speed * 0.5,
          life: 0, maxLife: 0.8 + Math.random() * 0.6,
          length: 40 + Math.random() * 60,
        });
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const ss = shooters[i];
        ss.life += dt;
        ss.x += ss.vx * dt;
        ss.y += ss.vy * dt;
        const lifeRatio = ss.life / ss.maxLife;
        const alpha = lifeRatio < 0.1 ? lifeRatio / 0.1 : 1 - (lifeRatio - 0.1) / 0.9;

        if (ss.life >= ss.maxLife || ss.x > W + 50 || ss.y > H) {
          shooters.splice(i, 1);
          continue;
        }

        const len = ss.length * alpha;
        const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * len;
        const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * len;

        const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,250,240,${alpha * 0.8})`);
        grad.addColorStop(0.3, `rgba(255,220,150,${alpha * 0.4})`);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Head glow
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 8);
        headGlow.addColorStop(0, `rgba(255,250,230,${alpha * 0.5})`);
        headGlow.addColorStop(1, "transparent");
        ctx.fillStyle = headGlow;
        ctx.fillRect(ss.x - 8, ss.y - 8, 16, 16);
      }

      // ══════════════════════════════════════════
      // 5. MOON (volumetric)
      // ══════════════════════════════════════════
      const moonX = W * 0.82;
      const moonY = H * 0.12 + scrollPx;
      const moonR = Math.min(W, H) * 0.04;

      // Outer atmospheric halo (very large, subtle)
      const halo3 = ctx.createRadialGradient(moonX, moonY, moonR, moonX, moonY, moonR * 12);
      halo3.addColorStop(0, "rgba(245,240,208,0.03)");
      halo3.addColorStop(0.5, "rgba(200,180,150,0.01)");
      halo3.addColorStop(1, "transparent");
      ctx.fillStyle = halo3;
      ctx.fillRect(moonX - moonR * 12, moonY - moonR * 12, moonR * 24, moonR * 24);

      // Inner halo
      const halo2 = ctx.createRadialGradient(moonX, moonY, moonR * 0.9, moonX, moonY, moonR * 4);
      halo2.addColorStop(0, "rgba(245,240,208,0.08)");
      halo2.addColorStop(0.5, "rgba(245,240,208,0.02)");
      halo2.addColorStop(1, "transparent");
      ctx.fillStyle = halo2;
      ctx.fillRect(moonX - moonR * 4, moonY - moonR * 4, moonR * 8, moonR * 8);

      // Moon body
      const moonGrad = ctx.createRadialGradient(
        moonX - moonR * 0.25, moonY - moonR * 0.25, 0,
        moonX, moonY, moonR
      );
      moonGrad.addColorStop(0, "#f5f0d8");
      moonGrad.addColorStop(0.3, "#e8dfa5");
      moonGrad.addColorStop(0.7, "#c8b870");
      moonGrad.addColorStop(1, "#a09050");
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();

      // Craters
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.arc(moonX + moonR * 0.2, moonY - moonR * 0.3, moonR * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = "#8a7a40";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX - moonR * 0.25, moonY + moonR * 0.15, moonR * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX + moonR * 0.35, moonY + moonR * 0.25, moonR * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX - moonR * 0.1, moonY - moonR * 0.4, moonR * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // ══════════════════════════════════════════
      // 6. CLOUD WISPS drifting over moon
      // ══════════════════════════════════════════
      const clouds = cloudsRef.current;
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.x += c.speed * dt;
        if (c.x > W + c.w) c.x = -c.w * 1.5;

        const cGrad = ctx.createRadialGradient(
          c.x + c.w * 0.5, c.y, 0,
          c.x + c.w * 0.5, c.y, c.w * 0.5
        );
        cGrad.addColorStop(0, `rgba(30,25,50,${c.opacity})`);
        cGrad.addColorStop(0.6, `rgba(20,15,35,${c.opacity * 0.5})`);
        cGrad.addColorStop(1, "transparent");
        ctx.fillStyle = cGrad;
        ctx.fillRect(c.x, c.y - c.h, c.w, c.h * 2);
      }

      // ══════════════════════════════════════════
      // 7. DISTANT MOUNTAINS
      // ══════════════════════════════════════════
      const mtnY = H * 0.62 + scroll * 0.03;
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, mtnY + H * 0.05);
      for (let x = 0; x <= W; x += 3) {
        const noise = Math.sin(x * 0.005) * 30 + Math.sin(x * 0.012) * 15 + Math.sin(x * 0.003) * 40;
        ctx.lineTo(x, mtnY + noise);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = "rgba(12,8,22,0.85)";
      ctx.fill();

      // Second mountain range (closer)
      const mtn2Y = H * 0.68 + scroll * 0.025;
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, mtn2Y + H * 0.03);
      for (let x = 0; x <= W; x += 3) {
        const noise = Math.sin(x * 0.007 + 2) * 25 + Math.sin(x * 0.015 + 1) * 12 + Math.sin(x * 0.004 + 3) * 35;
        ctx.lineTo(x, mtn2Y + noise);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = "rgba(10,6,18,0.9)";
      ctx.fill();

      // ══════════════════════════════════════════
      // 8. CASTLE SILHOUETTE (production quality)
      // ══════════════════════════════════════════
      const castleBaseY = H * 0.6 + scroll * 0.02;
      const cx = W * 0.5; // castle center

      ctx.fillStyle = "#080514";

      // ── Main castle body ──
      ctx.fillRect(cx - W * 0.3, castleBaseY, W * 0.6, H);

      // ── Battlements on main wall ──
      const bw = W * 0.012;
      const bCount = Math.floor(W * 0.6 / (bw * 1.8));
      for (let i = 0; i < bCount; i++) {
        const bx = cx - W * 0.3 + i * (W * 0.6 / bCount);
        ctx.fillRect(bx, castleBaseY - H * 0.012, bw, H * 0.02);
      }

      // ── Wings ──
      ctx.fillRect(cx - W * 0.35, castleBaseY + H * 0.03, W * 0.06, H);
      ctx.fillRect(cx + W * 0.29, castleBaseY + H * 0.02, W * 0.07, H);

      // ── Tower function ──
      const drawTower = (tx: number, tw: number, th: number, spireH: number, hasCrown = false) => {
        const tBase = castleBaseY - th;
        // Tower body
        ctx.fillRect(tx - tw / 2, tBase, tw, th + H * 0.5);
        // Spire
        ctx.beginPath();
        ctx.moveTo(tx - tw / 2, tBase);
        ctx.lineTo(tx, tBase - spireH);
        ctx.lineTo(tx + tw / 2, tBase);
        ctx.closePath();
        ctx.fill();
        // Crown battlements
        if (hasCrown) {
          const crownW = tw * 1.3;
          ctx.fillRect(tx - crownW / 2, tBase - 4, crownW, 6);
          for (let c = 0; c < 5; c++) {
            ctx.fillRect(tx - crownW / 2 + c * (crownW / 5), tBase - 10, crownW / 7, 8);
          }
        }
      };

      // ── 7 Towers with varying heights ──
      const towers = [
        { x: cx - W * 0.32, w: W * 0.025, h: H * 0.18, spire: H * 0.08, crown: false },
        { x: cx - W * 0.22, w: W * 0.03,  h: H * 0.22, spire: H * 0.1,  crown: false },
        { x: cx - W * 0.1,  w: W * 0.032, h: H * 0.24, spire: H * 0.09, crown: true },
        { x: cx,            w: W * 0.06,  h: H * 0.32, spire: H * 0.14, crown: true },  // GRAND
        { x: cx + W * 0.12, w: W * 0.03,  h: H * 0.2,  spire: H * 0.08, crown: false },
        { x: cx + W * 0.24, w: W * 0.028, h: H * 0.21, spire: H * 0.09, crown: true },
        { x: cx + W * 0.33, w: W * 0.025, h: H * 0.16, spire: H * 0.07, crown: false },
      ];
      towers.forEach((tw) => drawTower(tw.x, tw.w, tw.h, tw.spire, tw.crown));

      // ── Connecting bridges / walkways ──
      ctx.fillRect(cx - W * 0.32, castleBaseY - H * 0.05, W * 0.1, H * 0.008);
      ctx.fillRect(cx + W * 0.22, castleBaseY - H * 0.04, W * 0.11, H * 0.008);
      // Bridge arches
      ctx.strokeStyle = "#050310";
      ctx.lineWidth = 2;
      for (let b = 0; b < 2; b++) {
        const bx1 = cx - W * 0.32 + b * W * 0.05;
        const by = castleBaseY - H * 0.042;
        ctx.beginPath();
        ctx.arc(bx1 + W * 0.025, by, W * 0.02, Math.PI, 0);
        ctx.stroke();
      }

      // ── Grand entrance arch ──
      ctx.fillStyle = "#030108";
      ctx.beginPath();
      ctx.moveTo(cx - W * 0.025, castleBaseY + H * 0.5);
      ctx.lineTo(cx - W * 0.025, castleBaseY + H * 0.02);
      ctx.quadraticCurveTo(cx, castleBaseY - H * 0.02, cx + W * 0.025, castleBaseY + H * 0.02);
      ctx.lineTo(cx + W * 0.025, castleBaseY + H * 0.5);
      ctx.closePath();
      ctx.fill();

      // ══════════════════════════════════════════
      // 9. GLOWING WINDOWS
      // ══════════════════════════════════════════
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const wins = windowsRef.current;
      for (let i = 0; i < wins.length; i++) {
        const w = wins[i];
        const wy = w.y + scroll * 0.02;
        if (wy < 0 || wy > H) continue;

        const flicker = 0.5 + 0.5 * Math.sin(t * w.flickerSpeed + w.flickerOffset);
        const alpha = w.brightness * flicker;
        if (alpha < 0.01) continue;

        // Window glow halo
        const glowR = Math.max(w.w, w.h) * 2.5;
        const glow = ctx.createRadialGradient(w.x, wy, 0, w.x, wy, glowR);
        glow.addColorStop(0, `rgba(${w.color[0]},${w.color[1]},${w.color[2]},${alpha * 0.3})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(w.x - glowR, wy - glowR, glowR * 2, glowR * 2);

        // Window pane
        ctx.fillStyle = `rgba(${w.color[0]},${w.color[1]},${w.color[2]},${alpha})`;
        ctx.beginPath();
        ctx.roundRect(w.x - w.w / 2, wy - w.h / 2, w.w, w.h, 1);
        ctx.fill();
      }
      ctx.restore();

      // ── Grand tower beacon ──
      const beaconX = cx;
      const beaconY = castleBaseY - towers[3].h - towers[3].spire + scroll * 0.02;
      const beaconPulse = 0.5 + 0.5 * Math.sin(t * 1.5);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const beaconGlow = ctx.createRadialGradient(beaconX, beaconY, 0, beaconX, beaconY, 30 + beaconPulse * 15);
      beaconGlow.addColorStop(0, `rgba(255,215,80,${0.4 + beaconPulse * 0.3})`);
      beaconGlow.addColorStop(0.3, `rgba(255,200,60,${0.1 + beaconPulse * 0.1})`);
      beaconGlow.addColorStop(1, "transparent");
      ctx.fillStyle = beaconGlow;
      ctx.fillRect(beaconX - 50, beaconY - 50, 100, 100);
      ctx.beginPath();
      ctx.arc(beaconX, beaconY, 3 + beaconPulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,235,150,${0.7 + beaconPulse * 0.3})`;
      ctx.fill();
      ctx.restore();

      // ── Rose window on grand tower ──
      const roseY = castleBaseY - towers[3].h * 0.5 + scroll * 0.02;
      ctx.strokeStyle = "rgba(255,200,80,0.08)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, roseY, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,200,80,0.04)";
      ctx.beginPath();
      ctx.arc(cx, roseY, 10, 0, Math.PI * 2);
      ctx.fill();

      // ══════════════════════════════════════════
      // 10. FOREGROUND FOREST
      // ══════════════════════════════════════════
      const forestY = H * 0.82 + scroll * 0.01;
      ctx.fillStyle = "#050310";
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, forestY);
      for (let x = 0; x <= W; x += 2) {
        const treeNoise =
          Math.sin(x * 0.02) * 12 +
          Math.sin(x * 0.05) * 8 +
          Math.sin(x * 0.1) * 4 +
          Math.sin(x * 0.003) * 25;
        ctx.lineTo(x, forestY + treeNoise);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();

      // Second forest layer (closer, darker)
      const forest2Y = H * 0.88 + scroll * 0.005;
      ctx.fillStyle = "#030208";
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, forest2Y);
      for (let x = 0; x <= W; x += 2) {
        const treeNoise =
          Math.sin(x * 0.025 + 1) * 10 +
          Math.sin(x * 0.06 + 2) * 6 +
          Math.sin(x * 0.12 + 1) * 3;
        ctx.lineTo(x, forest2Y + treeNoise);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();

      // ══════════════════════════════════════════
      // 11. FLOATING EMBERS
      // ══════════════════════════════════════════
      const embers = embersRef.current;
      // Spawn
      if (embers.length < 30 && Math.random() < 0.15) {
        embers.push({
          x: W * 0.15 + Math.random() * W * 0.7,
          y: H * 0.6 + Math.random() * H * 0.3,
          vx: -5 + Math.random() * 10,
          vy: -15 - Math.random() * 25,
          life: 0,
          maxLife: 3 + Math.random() * 4,
          size: 0.5 + Math.random() * 1.5,
          color: Math.random() > 0.5 ? [255, 180, 60] : [255, 140, 40],
        });
      }
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life += dt;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        e.vx += (Math.random() - 0.5) * 2 * dt;
        const lifeRatio = e.life / e.maxLife;
        const alpha = lifeRatio < 0.1 ? lifeRatio / 0.1 : Math.max(0, 1 - (lifeRatio - 0.3) / 0.7);

        if (e.life >= e.maxLife) { embers.splice(i, 1); continue; }

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        // Glow
        const eGlow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 4);
        eGlow.addColorStop(0, `rgba(${e.color[0]},${e.color[1]},${e.color[2]},${alpha * 0.2})`);
        eGlow.addColorStop(1, "transparent");
        ctx.fillStyle = eGlow;
        ctx.fillRect(e.x - e.size * 4, e.y - e.size * 4, e.size * 8, e.size * 8);
        // Core
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${e.color[0]},${e.color[1]},${e.color[2]},${alpha * 0.7})`;
        ctx.fill();
        ctx.restore();
      }

      // ══════════════════════════════════════════
      // 12. DEMENTORS (improved)
      // ══════════════════════════════════════════
      const drawDementor = (dx: number, dy: number, scale: number, alpha: number) => {
        ctx.save();
        ctx.translate(dx, dy);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;

        // Body cloak
        ctx.fillStyle = "rgba(15,10,25,0.9)";
        ctx.beginPath();
        ctx.ellipse(0, -15, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flowing robes
        const robeWave = Math.sin(t * 1.5 + dx * 0.01) * 3;
        ctx.strokeStyle = "rgba(15,10,25,0.6)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-5, -5);
        ctx.quadraticCurveTo(-8 + robeWave, 20, -12 + robeWave * 1.5, 50);
        ctx.stroke();
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.quadraticCurveTo(-2 + robeWave * 0.5, 25, -4 + robeWave, 55);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(15,10,25,0.4)";
        ctx.beginPath();
        ctx.moveTo(5, -5);
        ctx.quadraticCurveTo(8 + robeWave, 20, 12 + robeWave * 1.5, 48);
        ctx.stroke();

        // Cold aura
        const coldGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
        coldGlow.addColorStop(0, "rgba(100,150,255,0.03)");
        coldGlow.addColorStop(1, "transparent");
        ctx.fillStyle = coldGlow;
        ctx.fillRect(-40, -40, 80, 80);

        ctx.restore();
      };

      const d1x = W * 0.12 + Math.sin(t * 0.2) * 30 + scroll * 0.08;
      const d1y = H * 0.22 + Math.sin(t * 0.3) * 15 + scrollPx;
      drawDementor(d1x, d1y, 1, 0.25);

      const d2x = W * 0.85 - Math.sin(t * 0.15 + 1) * 25 - scroll * 0.05;
      const d2y = H * 0.3 + Math.sin(t * 0.25 + 2) * 12 + scrollPx;
      drawDementor(d2x, d2y, 0.8, 0.15);

      // ══════════════════════════════════════════
      // 13. GROUND FOG (volumetric)
      // ══════════════════════════════════════════
      // Base gradient
      const fogGrad = ctx.createLinearGradient(0, H * 0.75, 0, H);
      fogGrad.addColorStop(0, "transparent");
      fogGrad.addColorStop(0.4, "rgba(8,5,15,0.3)");
      fogGrad.addColorStop(0.7, "rgba(8,5,15,0.7)");
      fogGrad.addColorStop(1, "rgba(8,5,15,0.95)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, H * 0.75, W, H * 0.25);

      // Rolling fog wisps
      for (let i = 0; i < 4; i++) {
        const fogX = W * 0.5 + Math.sin(t * 0.1 + i * 1.5) * W * 0.4;
        const fogY = H * 0.9 + i * H * 0.025;
        const fogW = W * (0.3 + Math.sin(t * 0.08 + i) * 0.1);
        const fGrad = ctx.createRadialGradient(fogX, fogY, 0, fogX, fogY, fogW);
        fGrad.addColorStop(0, `rgba(180,160,220,${0.02 + Math.sin(t * 0.15 + i) * 0.008})`);
        fGrad.addColorStop(1, "transparent");
        ctx.fillStyle = fGrad;
        ctx.fillRect(fogX - fogW, fogY - fogW * 0.3, fogW * 2, fogW * 0.6);
      }

      // Magical mist at castle base
      const mistGrad = ctx.createRadialGradient(cx, castleBaseY + H * 0.1, 0, cx, castleBaseY + H * 0.1, W * 0.3);
      mistGrad.addColorStop(0, `rgba(200,170,255,${0.025 + Math.sin(t * 0.2) * 0.01})`);
      mistGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mistGrad;
      ctx.fillRect(cx - W * 0.3, castleBaseY, W * 0.6, H * 0.2);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [generateStars, generateWindows, generateClouds]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
