"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── Video configuration ──
// To activate video backgrounds, place .mp4 files in /public/videos/
// Download free dark fantasy clips from:
//   - https://pixabay.com/videos/search/dark%20fog/
//   - https://pixabay.com/videos/search/magic%20particles/
//   - https://pixabay.com/videos/search/dark%20smoke/
//   - https://pixabay.com/videos/search/lightning%20storm/
//   - https://pexels.com/search/videos/dark%20forest/

// Direct GitHub Releases links (bypass Vercel bandwidth limits)
const VIDEO_SOURCES = [
  "https://github.com/Ashikvk18/portfolio/releases/download/v1.0.0/scene1.mp4",
  "https://github.com/Ashikvk18/portfolio/releases/download/v1.0.0/scene2.mov",
  "https://github.com/Ashikvk18/portfolio/releases/download/v1.0.0/scene3.mp4",
  "https://github.com/Ashikvk18/portfolio/releases/download/v1.0.0/scene4.mp4",
];

const SCENE_DURATION = 12000;

export default function VideoBackground() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideo1Active, setIsVideo1Active] = useState(true);
  const [videosAvailable, setVideosAvailable] = useState(false);
  const frameRef = useRef(0);
  const indexRef = useRef(0);

  // Check if any video file exists via the API proxy
  useEffect(() => {
    (async () => {
      for (const src of VIDEO_SOURCES) {
        try {
          const res = await fetch(src, { method: "HEAD" });
          if (res.ok) { setVideosAvailable(true); return; }
        } catch { /* skip */ }
      }
    })();
  }, []);

  // Video crossfade cycling
  useEffect(() => {
    if (!videosAvailable) return;
    // Load first video
    const v1 = video1Ref.current;
    if (v1) { v1.src = VIDEO_SOURCES[0]; v1.load(); v1.play().catch(() => {}); }

    const cycle = () => {
      indexRef.current = (indexRef.current + 1) % VIDEO_SOURCES.length;
      const nextV = isVideo1Active ? video2Ref.current : video1Ref.current;
      if (nextV) {
        nextV.src = VIDEO_SOURCES[indexRef.current];
        nextV.load();
        nextV.play().catch(() => {});
      }
      setTimeout(() => setIsVideo1Active((v) => !v), 300);
    };

    const interval = setInterval(cycle, SCENE_DURATION);
    return () => clearInterval(interval);
  }, [videosAvailable, isVideo1Active]);

  // Overlay canvas — particles, spell streaks, fog on top of videos
  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const t = performance.now();

    ctx.clearRect(0, 0, W * dpr, H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── Vignette ──
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(0.6, "rgba(2,1,8,0.35)");
    vig.addColorStop(1, "rgba(2,1,8,0.8)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // ── Floating magic particles ──
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 35; i++) {
      const seed = i * 137.508;
      const px = W * 0.05 + ((seed * 7.3 + t * 0.012) % (W * 0.9));
      const py = H - ((seed * 3.7 + t * (0.015 + (i % 5) * 0.003)) % (H * 1.2));
      const size = 1 + Math.sin(seed + t * 0.002) * 0.8;
      const alpha = 0.12 + Math.sin(t * 0.003 + seed) * 0.08;
      const colors = ["rgba(255,200,60,", "rgba(180,140,255,", "rgba(100,180,255,"];
      const c = colors[i % 3] + alpha + ")";
      const glow = ctx.createRadialGradient(px, py, 0, px, py, size * 5);
      glow.addColorStop(0, c); glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(px - size * 5, py - size * 5, size * 10, size * 10);
    }

    // ── Occasional spell streaks ──
    const phase = Math.sin(t * 0.0005) * 0.5 + 0.5;
    if (phase > 0.93) {
      const sx = Math.sin(t * 0.003) * W * 0.3 + W * 0.5;
      const sy = Math.sin(t * 0.002 + 1) * H * 0.2 + H * 0.35;
      const ex = sx + Math.cos(t * 0.004) * 180;
      const ey = sy + Math.sin(t * 0.004) * 80;
      const green = Math.sin(t * 0.001) > 0;
      const sg = ctx.createLinearGradient(sx, sy, ex, ey);
      sg.addColorStop(0, green ? "rgba(50,255,100,0.5)" : "rgba(255,180,50,0.5)");
      sg.addColorStop(0.5, green ? "rgba(30,200,70,0.2)" : "rgba(255,100,30,0.2)");
      sg.addColorStop(1, "transparent");
      ctx.strokeStyle = sg; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      const ig = ctx.createRadialGradient(ex, ey, 0, ex, ey, 35);
      ig.addColorStop(0, green ? "rgba(50,255,100,0.12)" : "rgba(255,180,50,0.12)");
      ig.addColorStop(1, "transparent");
      ctx.fillStyle = ig; ctx.fillRect(ex - 35, ey - 35, 70, 70);
    }
    ctx.globalCompositeOperation = "source-over";

    // ── Bottom fog blend ──
    const fog = ctx.createLinearGradient(0, H * 0.72, 0, H);
    fog.addColorStop(0, "transparent");
    fog.addColorStop(0.5, "rgba(5,3,12,0.35)");
    fog.addColorStop(1, "rgba(5,3,12,0.85)");
    ctx.fillStyle = fog; ctx.fillRect(0, H * 0.72, W, H * 0.28);

    // ── Top darkness ──
    const top = ctx.createLinearGradient(0, 0, 0, H * 0.12);
    top.addColorStop(0, "rgba(2,1,8,0.6)"); top.addColorStop(1, "transparent");
    ctx.fillStyle = top; ctx.fillRect(0, 0, W, H * 0.12);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!videosAvailable) return; // No overlay needed without videos
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => { drawOverlay(); frameRef.current = requestAnimationFrame(loop); };
    frameRef.current = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, [videosAvailable, drawOverlay]);

  // Don't render anything if no videos — HogwartsBackground handles the visuals
  if (!videosAvailable) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Video layers with crossfade */}
      <video
        ref={video1Ref}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]"
        style={{
          opacity: isVideo1Active ? 1 : 0,
          filter: "brightness(0.35) saturate(0.6) contrast(1.2) hue-rotate(10deg)",
        }}
      />
      <video
        ref={video2Ref}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]"
        style={{
          opacity: isVideo1Active ? 0 : 1,
          filter: "brightness(0.35) saturate(0.6) contrast(1.2) hue-rotate(10deg)",
        }}
      />

      {/* Dark overlay tint */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(2,1,8,0.5) 0%, rgba(5,3,15,0.3) 40%, rgba(2,1,8,0.6) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Canvas overlay for particles, spells, fog */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
