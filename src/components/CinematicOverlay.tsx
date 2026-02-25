"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CinematicOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const scrollRef = useRef(0);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Film grain noise buffer
  const grainRef = useRef<ImageData | null>(null);

  const generateGrain = useCallback((w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 12; // Very subtle
    }
    return imageData;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const barsCanvas = barsCanvasRef.current;
    if (!canvas || !barsCanvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const barsCtx = barsCanvas.getContext("2d", { alpha: true });
    if (!ctx || !barsCtx) return;

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
      barsCanvas.width = W * dpr;
      barsCanvas.height = H * dpr;
      barsCanvas.style.width = `${W}px`;
      barsCanvas.style.height = `${H}px`;
      // Generate grain at 1/4 resolution for performance
      grainRef.current = generateGrain(Math.floor(W / 4), Math.floor(H / 4));
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };
    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Precompute god ray angles
    const RAY_COUNT = 12;
    const rays = Array.from({ length: RAY_COUNT }, (_, i) => ({
      angle: (i / RAY_COUNT) * Math.PI * 2,
      length: 0.3 + Math.random() * 0.5,
      width: 0.01 + Math.random() * 0.025,
      speed: 0.1 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.02 + Math.random() * 0.03,
    }));

    // Dust motes for atmosphere
    const DUST_COUNT = 40;
    const dustMotes = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.0002,
      speedY: -0.0001 - Math.random() * 0.0003,
      opacity: 0.05 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    // Lens flare elements
    const flareElements = [
      { offset: 0.15, size: 0.03, opacity: 0.06, color: "200,180,255" },
      { offset: 0.3, size: 0.05, opacity: 0.04, color: "255,200,120" },
      { offset: 0.5, size: 0.08, opacity: 0.03, color: "180,220,255" },
      { offset: 0.7, size: 0.04, opacity: 0.05, color: "255,215,80" },
      { offset: 0.85, size: 0.06, opacity: 0.03, color: "200,170,255" },
      { offset: 1.1, size: 0.1, opacity: 0.02, color: "255,240,200" },
    ];

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;
      timeRef.current += dt;
      const t = timeRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const pageH = document.body.scrollHeight - H;
      const scrollRatio = Math.min(scrollRef.current / Math.max(pageH, 1), 1);

      // ══════════════════════════════════════════════
      // 1. CINEMATIC COLOR GRADING (teal shadows, warm highlights)
      // ══════════════════════════════════════════════
      // Teal in shadows
      ctx.fillStyle = "rgba(0,30,40,0.06)";
      ctx.fillRect(0, 0, W, H);

      // Warm orange push in highlights (top area where moon is)
      const warmGrad = ctx.createRadialGradient(
        W * 0.85, H * 0.1, 0,
        W * 0.85, H * 0.1, H * 0.5
      );
      warmGrad.addColorStop(0, "rgba(255,180,80,0.02)");
      warmGrad.addColorStop(0.5, "rgba(255,150,60,0.01)");
      warmGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = warmGrad;
      ctx.fillRect(0, 0, W, H);

      // ══════════════════════════════════════════════
      // 2. GOD RAYS from moon position
      // ══════════════════════════════════════════════
      const moonX = W * (0.85 - scrollRatio * 0.05);
      const moonY = H * (0.08 + scrollRatio * 0.15);

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (const ray of rays) {
        const currentAngle = ray.angle + Math.sin(t * ray.speed + ray.phase) * 0.15;
        const currentLen = ray.length * H * (0.8 + Math.sin(t * ray.speed * 0.7 + ray.phase) * 0.2);
        const currentOpacity = ray.opacity * (0.7 + Math.sin(t * ray.speed * 1.3 + ray.phase) * 0.3);

        const endX = moonX + Math.cos(currentAngle) * currentLen;
        const endY = moonY + Math.sin(currentAngle) * currentLen;

        const grad = ctx.createLinearGradient(moonX, moonY, endX, endY);
        grad.addColorStop(0, `rgba(255,240,200,${currentOpacity})`);
        grad.addColorStop(0.3, `rgba(255,220,160,${currentOpacity * 0.5})`);
        grad.addColorStop(1, `rgba(255,200,120,0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width * W;
        ctx.beginPath();
        ctx.moveTo(moonX, moonY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      ctx.restore();

      // ══════════════════════════════════════════════
      // 3. VOLUMETRIC FOG / MIST (depth layers)
      // ══════════════════════════════════════════════
      // Low-lying mist that shifts
      const mistY = H * 0.7;
      const mistShift = Math.sin(t * 0.3) * W * 0.05;

      for (let i = 0; i < 3; i++) {
        const mGrad = ctx.createRadialGradient(
          W * 0.5 + mistShift + i * W * 0.15, mistY + i * 20, 0,
          W * 0.5 + mistShift + i * W * 0.15, mistY + i * 20, W * 0.5
        );
        mGrad.addColorStop(0, `rgba(150,140,180,${0.03 - i * 0.008})`);
        mGrad.addColorStop(0.5, `rgba(100,90,130,${0.015 - i * 0.004})`);
        mGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = mGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // Atmospheric haze that increases with depth
      const hazeGrad = ctx.createLinearGradient(0, H * 0.4, 0, H);
      hazeGrad.addColorStop(0, "rgba(15,12,25,0)");
      hazeGrad.addColorStop(0.6, "rgba(15,12,25,0.03)");
      hazeGrad.addColorStop(1, "rgba(15,12,25,0.08)");
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, 0, W, H);

      // ══════════════════════════════════════════════
      // 4. FLOATING DUST MOTES (bokeh-style)
      // ══════════════════════════════════════════════
      for (const dust of dustMotes) {
        dust.x += dust.speedX + Math.sin(t * 0.5 + dust.phase) * 0.00005;
        dust.y += dust.speedY;

        if (dust.y < -0.05) { dust.y = 1.05; dust.x = Math.random(); }
        if (dust.x < -0.05) dust.x = 1.05;
        if (dust.x > 1.05) dust.x = -0.05;

        const dx = dust.x * W;
        const dy = dust.y * H;
        const currentOp = dust.opacity * (0.5 + Math.sin(t * 1.5 + dust.phase) * 0.5);
        const sz = dust.size * (1 + Math.sin(t * 0.8 + dust.phase) * 0.3);

        // Bokeh circle
        const bokeh = ctx.createRadialGradient(dx, dy, 0, dx, dy, sz * 3);
        bokeh.addColorStop(0, `rgba(255,240,210,${currentOp})`);
        bokeh.addColorStop(0.5, `rgba(255,230,190,${currentOp * 0.3})`);
        bokeh.addColorStop(1, "rgba(255,220,170,0)");
        ctx.fillStyle = bokeh;
        ctx.beginPath();
        ctx.arc(dx, dy, sz * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // ══════════════════════════════════════════════
      // 5. LENS FLARE (from moon)
      // ══════════════════════════════════════════════
      const centerX = W * 0.5;
      const centerY = H * 0.5;
      const flareIntensity = Math.max(0, 1 - scrollRatio * 2) * 0.7;

      if (flareIntensity > 0.05) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Main flare line direction
        const dirX = centerX - moonX;
        const dirY = centerY - moonY;

        for (const el of flareElements) {
          const fx = moonX + dirX * el.offset;
          const fy = moonY + dirY * el.offset;
          const fSize = el.size * W * flareIntensity;
          const fOp = el.opacity * flareIntensity * (0.7 + Math.sin(t * 2 + el.offset * 5) * 0.3);

          const fGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fSize);
          fGrad.addColorStop(0, `rgba(${el.color},${fOp})`);
          fGrad.addColorStop(0.5, `rgba(${el.color},${fOp * 0.3})`);
          fGrad.addColorStop(1, `rgba(${el.color},0)`);
          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Anamorphic streak (horizontal blue line through moon)
        const streakW = W * 0.4 * flareIntensity * (0.8 + Math.sin(t * 1.5) * 0.2);
        const streakGrad = ctx.createLinearGradient(moonX - streakW, moonY, moonX + streakW, moonY);
        streakGrad.addColorStop(0, "rgba(100,150,255,0)");
        streakGrad.addColorStop(0.3, `rgba(120,170,255,${0.03 * flareIntensity})`);
        streakGrad.addColorStop(0.5, `rgba(150,200,255,${0.06 * flareIntensity})`);
        streakGrad.addColorStop(0.7, `rgba(120,170,255,${0.03 * flareIntensity})`);
        streakGrad.addColorStop(1, "rgba(100,150,255,0)");
        ctx.fillStyle = streakGrad;
        ctx.fillRect(moonX - streakW, moonY - 1, streakW * 2, 2);

        ctx.restore();
      }

      // ══════════════════════════════════════════════
      // 6. FILM GRAIN
      // ══════════════════════════════════════════════
      if (grainRef.current) {
        ctx.save();
        ctx.globalAlpha = 0.06 + Math.sin(t * 30) * 0.01; // Flicker
        ctx.globalCompositeOperation = "overlay";

        // Draw grain at quarter res, scaled up for performance
        const grainCanvas = document.createElement("canvas");
        grainCanvas.width = grainRef.current.width;
        grainCanvas.height = grainRef.current.height;
        const gCtx = grainCanvas.getContext("2d")!;
        gCtx.putImageData(grainRef.current, 0, 0);
        ctx.drawImage(grainCanvas, 0, 0, W, H);

        // Regenerate grain every few frames for animated noise
        if (Math.floor(t * 24) % 2 === 0) {
          grainRef.current = generateGrain(Math.floor(W / 4), Math.floor(H / 4));
        }

        ctx.restore();
      }

      // ══════════════════════════════════════════════
      // 7. ENHANCED VIGNETTE (cinematic, heavier)
      // ══════════════════════════════════════════════
      const vignetteGrad = ctx.createRadialGradient(
        W * 0.5, H * 0.5, W * 0.2,
        W * 0.5, H * 0.5, W * 0.75
      );
      vignetteGrad.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGrad.addColorStop(0.5, "rgba(0,0,0,0.05)");
      vignetteGrad.addColorStop(0.8, "rgba(0,0,0,0.15)");
      vignetteGrad.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, W, H);

      // ══════════════════════════════════════════════
      // 8. LETTERBOX BARS (on separate top-layer canvas)
      // ══════════════════════════════════════════════
      barsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      barsCtx.clearRect(0, 0, W, H);

      const topBarHeight = 10;
      const bottomBarHeight = H * 0.04;
      const barOpacity = 0.9;

      // Top bar — thin accent line, does not cover navbar
      barsCtx.fillStyle = `rgba(0,0,0,${barOpacity})`;
      barsCtx.fillRect(0, 0, W, topBarHeight);

      // Bottom bar — cinematic widescreen bar
      barsCtx.fillRect(0, H - bottomBarHeight, W, bottomBarHeight);

      // Subtle inner edge glow on bars
      const topBarGlow = barsCtx.createLinearGradient(0, topBarHeight, 0, topBarHeight + 6);
      topBarGlow.addColorStop(0, "rgba(255,215,80,0.03)");
      topBarGlow.addColorStop(1, "rgba(0,0,0,0)");
      barsCtx.fillStyle = topBarGlow;
      barsCtx.fillRect(0, topBarHeight, W, 6);

      const btmBarGlow = barsCtx.createLinearGradient(0, H - bottomBarHeight, 0, H - bottomBarHeight - 8);
      btmBarGlow.addColorStop(0, "rgba(255,215,80,0.03)");
      btmBarGlow.addColorStop(1, "rgba(0,0,0,0)");
      barsCtx.fillStyle = btmBarGlow;
      barsCtx.fillRect(0, H - bottomBarHeight - 8, W, 8);

      // ══════════════════════════════════════════════
      // 9. CHROMATIC ABERRATION on edges
      // ══════════════════════════════════════════════
      const caStrength = 0.015;
      // Red shift at edges
      const caGradL = ctx.createLinearGradient(0, 0, W * 0.08, 0);
      caGradL.addColorStop(0, `rgba(255,50,50,${caStrength})`);
      caGradL.addColorStop(1, "rgba(255,50,50,0)");
      ctx.fillStyle = caGradL;
      ctx.fillRect(0, 0, W * 0.08, H);

      // Blue shift at right edge
      const caGradR = ctx.createLinearGradient(W, 0, W * 0.92, 0);
      caGradR.addColorStop(0, `rgba(50,80,255,${caStrength})`);
      caGradR.addColorStop(1, "rgba(50,80,255,0)");
      ctx.fillStyle = caGradR;
      ctx.fillRect(W * 0.92, 0, W * 0.08, H);

      // ══════════════════════════════════════════════
      // 10. LIGHT LEAK (subtle warm leak from corner)
      // ══════════════════════════════════════════════
      const leakOpacity = 0.02 + Math.sin(t * 0.4) * 0.01;
      const leakGrad = ctx.createRadialGradient(
        W * 0.05, H * 0.15, 0,
        W * 0.05, H * 0.15, W * 0.35
      );
      leakGrad.addColorStop(0, `rgba(255,180,80,${leakOpacity})`);
      leakGrad.addColorStop(0.5, `rgba(255,140,60,${leakOpacity * 0.3})`);
      leakGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = leakGrad;
      ctx.fillRect(0, 0, W, H);

      // ══════════════════════════════════════════════
      // 11. MOUSE-FOLLOW SPOTLIGHT (subtle)
      // ══════════════════════════════════════════════
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const spotGrad = ctx.createRadialGradient(mx, my, 0, mx, my, W * 0.15);
      spotGrad.addColorStop(0, "rgba(255,240,220,0.012)");
      spotGrad.addColorStop(0.5, "rgba(255,230,200,0.005)");
      spotGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(mx, my, W * 0.15, 0, Math.PI * 2);
      ctx.fill();

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [generateGrain]);

  return (
    <>
      {/* Main effects layer — below content */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />
      {/* Letterbox bars — above everything including navbar */}
      <canvas
        ref={barsCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 60 }}
      />
    </>
  );
}
