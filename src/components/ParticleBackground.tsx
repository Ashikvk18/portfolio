"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  color: string;
  type: "spark" | "rune" | "wisp" | "stardust" | "spell";
  angle: number;
  rotSpeed: number;
  wobble: number;
}

const SPELL_COLORS = [
  "255, 215, 80",   // golden spell
  "180, 160, 60",   // aged gold
  "120, 180, 255",  // lumos blue
  "200, 170, 255",  // patronus silver-purple
  "255, 180, 100",  // warm wand spark
  "160, 220, 255",  // ice spell
  "255, 140, 60",   // fire spell
];

const RUNE_CHARS = ["✦", "⚡", "☽", "✧", "◈", "❋", "⊛", "⌘", "△", "⟡", "✶", "❖"];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let scrollY = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const rand = Math.random();
      let type: Particle["type"];
      if (rand < 0.08) type = "rune";
      else if (rand < 0.2) type = "spell";
      else if (rand < 0.45) type = "wisp";
      else if (rand < 0.7) type = "stardust";
      else type = "spark";

      const maxLife = type === "rune" ? 300 + Math.random() * 500
        : type === "spell" ? 100 + Math.random() * 200
        : type === "wisp" ? 400 + Math.random() * 600
        : 200 + Math.random() * 400;

      const maxOpacity = type === "rune" ? 0.15 + Math.random() * 0.2
        : type === "spell" ? 0.4 + Math.random() * 0.5
        : type === "wisp" ? 0.03 + Math.random() * 0.08
        : type === "stardust" ? 0.2 + Math.random() * 0.5
        : 0.3 + Math.random() * 0.5;

      return {
        x: Math.random() * canvas.width,
        y: type === "spark" || type === "spell"
          ? canvas.height + Math.random() * 30
          : Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (type === "spell" ? 1.5 : 0.3),
        vy: type === "spark" ? -(0.3 + Math.random() * 1.2)
          : type === "spell" ? -(1 + Math.random() * 2)
          : type === "wisp" ? (Math.random() - 0.5) * 0.1
          : -(0.05 + Math.random() * 0.2),
        size: type === "rune" ? 8 + Math.random() * 6
          : type === "wisp" ? 15 + Math.random() * 40
          : type === "spell" ? 1 + Math.random() * 3
          : type === "stardust" ? 0.5 + Math.random() * 1.5
          : 0.5 + Math.random() * 2.5,
        opacity: 0,
        maxOpacity,
        life: 0,
        maxLife,
        color: SPELL_COLORS[Math.floor(Math.random() * SPELL_COLORS.length)],
        type,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        wobble: Math.random() * Math.PI * 2,
      };
    };

    const init = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 6000);
      for (let i = 0; i < count; i++) {
        const p = createParticle();
        p.life = Math.random() * p.maxLife;
        p.y = Math.random() * canvas.height;
        particles.push(p);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.angle += p.rotSpeed;

        // Movement
        if (p.type === "wisp") {
          p.x += Math.sin(time * 0.003 + p.wobble) * 0.3;
          p.y += Math.cos(time * 0.002 + p.wobble) * 0.2;
        } else if (p.type === "spell") {
          p.x += p.vx + Math.sin(p.life * 0.05) * 0.8;
          p.y += p.vy;
          p.vy *= 0.995;
        } else {
          p.x += p.vx + Math.sin(p.life * 0.015 + p.wobble) * 0.2;
          p.y += p.vy;
        }

        // Mouse interaction — particles gently repel from cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.3;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Scroll parallax
        const parallaxFactor = p.type === "wisp" ? 0.01 : p.type === "rune" ? 0.02 : 0.03;
        p.y -= scrollY * parallaxFactor * 0.01;

        // Fade in/out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = (lifeRatio / 0.15) * p.maxOpacity;
        } else if (lifeRatio > 0.75) {
          p.opacity = ((1 - lifeRatio) / 0.25) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        // Magical flickering for sparks and spells
        if (p.type === "spark" || p.type === "spell") {
          p.opacity *= 0.6 + Math.sin(p.life * 0.1) * 0.4;
        }
        if (p.type === "stardust") {
          p.opacity *= 0.7 + Math.sin(p.life * 0.04 + p.wobble) * 0.3;
        }

        if (p.life >= p.maxLife || p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
          particles[i] = createParticle();
          continue;
        }

        // Draw
        ctx.save();

        if (p.type === "wisp") {
          // Large soft glowing orbs — like distant magic
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `rgba(${p.color}, ${p.opacity * 0.6})`);
          gradient.addColorStop(0.5, `rgba(${p.color}, ${p.opacity * 0.15})`);
          gradient.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === "rune") {
          // Floating magical runes/symbols
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.font = `${p.size}px serif`;
          ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const runeIndex = Math.floor(p.wobble / (Math.PI * 2) * RUNE_CHARS.length) % RUNE_CHARS.length;
          ctx.fillText(RUNE_CHARS[runeIndex], 0, 0);
          // glow behind rune
          ctx.shadowColor = `rgba(${p.color}, ${p.opacity * 0.5})`;
          ctx.shadowBlur = 15;
          ctx.fillText(RUNE_CHARS[runeIndex], 0, 0);

        } else if (p.type === "spell") {
          // Fast moving spell sparks with trails
          const trailLength = 5;
          for (let t = 0; t < trailLength; t++) {
            const trailOpacity = p.opacity * (1 - t / trailLength) * 0.5;
            const trailX = p.x - p.vx * t * 2;
            const trailY = p.y - p.vy * t * 2;
            ctx.beginPath();
            ctx.arc(trailX, trailY, p.size * (1 - t / trailLength * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${trailOpacity})`;
            ctx.fill();
          }
          // Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`;
          ctx.fill();
          // Outer glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.opacity * 0.1})`;
          ctx.fill();

        } else if (p.type === "stardust") {
          // Tiny twinkling stars
          ctx.beginPath();
          // Draw 4-point star shape
          const s = p.size;
          const flicker = 0.7 + Math.sin(p.life * 0.08) * 0.3;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.moveTo(0, -s * 2 * flicker);
          ctx.lineTo(s * 0.3, -s * 0.3);
          ctx.lineTo(s * 2 * flicker, 0);
          ctx.lineTo(s * 0.3, s * 0.3);
          ctx.lineTo(0, s * 2 * flicker);
          ctx.lineTo(-s * 0.3, s * 0.3);
          ctx.lineTo(-s * 2 * flicker, 0);
          ctx.lineTo(-s * 0.3, -s * 0.3);
          ctx.closePath();
          ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
          ctx.fill();

        } else {
          // Regular sparks — rising golden particles
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
          ctx.fill();
          // glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.opacity * 0.08})`;
          ctx.fill();
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleScroll = () => { scrollY = window.scrollY; };
    const handleMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const handleMouseLeave = () => { mouseX = -1000; mouseY = -1000; };

    resize();
    init();
    draw();

    window.addEventListener("resize", () => { resize(); init(); });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
