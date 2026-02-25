"use client";

import { useEffect, useRef, useCallback } from "react";

interface Point { x: number; y: number; }

// ── Spell Particle ──
interface SpellParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'ember' | 'orb' | 'trail';
}

// ── Phoenix Feather ──
interface Feather {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  rotation: number;
  rotSpeed: number;
}

export default function WizardScenes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const timeRef = useRef(0);
  const particlesRef = useRef<SpellParticle[]>([]);
  const feathersRef = useRef<Feather[]>([]);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);

  const getScrollRatio = useCallback(() => {
    const h = document.body.scrollHeight - window.innerHeight;
    return Math.min(scrollRef.current / Math.max(h, 1), 1);
  }, []);

  // ── Draw a detailed human figure silhouette ──
  const drawFigure = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, scale: number,
    opts: {
      headRadius?: number;
      cloakWidth?: number;
      cloakLength?: number;
      armAngleL?: number;
      armAngleR?: number;
      armLenL?: number;
      armLenR?: number;
      legSpread?: number;
      fillColor?: string;
      strokeColor?: string;
      hasHair?: 'messy' | 'long' | 'bushy' | 'bald' | 'hat';
      wandArm?: 'left' | 'right' | 'none';
      wandAngle?: number;
      wandLength?: number;
      lean?: number;
    }
  ) => {
    const {
      headRadius = 8, cloakWidth = 20, cloakLength = 50,
      armAngleL = -0.8, armAngleR = 0.8, armLenL = 25, armLenR = 25,
      legSpread = 8, fillColor = "rgba(50,35,75,1)",
      strokeColor = "rgba(60,45,90,1)",
      hasHair = 'messy', wandArm = 'none', wandAngle = -0.5,
      wandLength = 20, lean = 0,
    } = opts;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(lean, 0);

    const hr = headRadius;
    const neckY = hr + 2;
    const shoulderY = neckY + 5;
    const torsoEnd = shoulderY + cloakLength * 0.5;
    const hipY = torsoEnd;
    const kneeY = hipY + 20;
    const footY = kneeY + 18;

    // ── Cloak / body ──
    ctx.beginPath();
    ctx.moveTo(-cloakWidth * 0.4, shoulderY);
    ctx.quadraticCurveTo(-cloakWidth * 0.55, hipY * 0.7, -cloakWidth * 0.5, hipY);
    ctx.quadraticCurveTo(-cloakWidth * 0.6 + Math.sin(timeRef.current * 1.5) * 2, hipY + cloakLength * 0.35, -cloakWidth * 0.55 + Math.sin(timeRef.current * 1.2) * 3, hipY + cloakLength * 0.5);
    ctx.lineTo(cloakWidth * 0.55 + Math.sin(timeRef.current * 1.3 + 1) * 3, hipY + cloakLength * 0.5);
    ctx.quadraticCurveTo(cloakWidth * 0.6 + Math.sin(timeRef.current * 1.4 + 1) * 2, hipY + cloakLength * 0.35, cloakWidth * 0.5, hipY);
    ctx.quadraticCurveTo(cloakWidth * 0.55, hipY * 0.7, cloakWidth * 0.4, shoulderY);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // ── Neck ──
    ctx.beginPath();
    ctx.moveTo(-3, neckY);
    ctx.lineTo(3, neckY);
    ctx.lineTo(4, shoulderY);
    ctx.lineTo(-4, shoulderY);
    ctx.closePath();
    ctx.fill();

    // ── Head ──
    ctx.beginPath();
    ctx.arc(0, 0, hr, 0, Math.PI * 2);
    ctx.fill();

    // ── Hair ──
    if (hasHair === 'messy') {
      ctx.fillStyle = strokeColor;
      for (let i = -5; i <= 5; i++) {
        const angle = (i / 5) * 1.2 - Math.PI / 2;
        const len = hr + 2 + Math.sin(i * 3 + timeRef.current * 2) * 1.5;
        ctx.beginPath();
        ctx.ellipse(
          Math.cos(angle) * hr * 0.8,
          Math.sin(angle) * hr * 0.8 - 2,
          3, len * 0.3, angle, 0, Math.PI * 2
        );
        ctx.fill();
      }
    } else if (hasHair === 'long') {
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.moveTo(-hr - 1, -2);
      ctx.quadraticCurveTo(-hr - 2, shoulderY, -hr + Math.sin(timeRef.current * 1.5) * 2, shoulderY + 15);
      ctx.lineTo(-hr + 3, shoulderY + 15);
      ctx.quadraticCurveTo(-hr + 2, shoulderY * 0.6, -hr + 3, -2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(hr + 1, -2);
      ctx.quadraticCurveTo(hr + 2, shoulderY, hr + Math.sin(timeRef.current * 1.5 + 1) * 2, shoulderY + 15);
      ctx.lineTo(hr - 3, shoulderY + 15);
      ctx.quadraticCurveTo(hr - 2, shoulderY * 0.6, hr - 3, -2);
      ctx.closePath();
      ctx.fill();
    } else if (hasHair === 'hat') {
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.moveTo(-hr - 3, -1);
      ctx.lineTo(0, -hr * 3);
      ctx.lineTo(hr + 3, -1);
      ctx.closePath();
      ctx.fill();
    }

    // ── Arms ──
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // Left arm
    const lax = -cloakWidth * 0.35;
    const lay = shoulderY + 2;
    const lEx = lax + Math.cos(armAngleL) * armLenL;
    const lEy = lay + Math.sin(armAngleL) * armLenL;
    ctx.beginPath();
    ctx.moveTo(lax, lay);
    ctx.lineTo(lEx, lEy);
    ctx.stroke();

    // Right arm
    const rax = cloakWidth * 0.35;
    const ray = shoulderY + 2;
    const rEx = rax + Math.cos(armAngleR) * armLenR;
    const rEy = ray + Math.sin(armAngleR) * armLenR;
    ctx.beginPath();
    ctx.moveTo(rax, ray);
    ctx.lineTo(rEx, rEy);
    ctx.stroke();

    // ── Wand ──
    let wandTipX = 0, wandTipY = 0;
    if (wandArm !== 'none') {
      const wx = wandArm === 'left' ? lEx : rEx;
      const wy = wandArm === 'left' ? lEy : rEy;
      wandTipX = wx + Math.cos(wandAngle) * wandLength;
      wandTipY = wy + Math.sin(wandAngle) * wandLength;

      ctx.strokeStyle = "rgba(180,150,100,0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wandTipX, wandTipY);
      ctx.stroke();
    }

    // ── Legs ──
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-2, hipY + cloakLength * 0.35);
    ctx.lineTo(-legSpread, footY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2, hipY + cloakLength * 0.35);
    ctx.lineTo(legSpread, footY);
    ctx.stroke();

    // Feet
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-legSpread, footY);
    ctx.lineTo(-legSpread - 4, footY + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(legSpread, footY);
    ctx.lineTo(legSpread + 4, footY + 2);
    ctx.stroke();

    ctx.restore();

    // Return wand tip in world coords for spell effects
    return {
      wandTip: {
        x: x + (wandArm === 'none' ? 0 : ((wandArm === 'left' ? lEx : rEx) + Math.cos(wandAngle) * wandLength) * scale + lean * scale),
        y: y + (wandArm === 'none' ? 0 : ((wandArm === 'left' ? lEy : rEy) + Math.sin(wandAngle) * wandLength) * scale),
      }
    };
  }, []);

  // ── Draw spell beam (Priori Incantatem style) ──
  const drawSpellBeam = useCallback((
    ctx: CanvasRenderingContext2D,
    from: Point, to: Point,
    colorFrom: string, colorTo: string,
    t: number
  ) => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const wobble1 = Math.sin(t * 4) * 15;
    const wobble2 = Math.cos(t * 3.7) * 12;

    // Multiple beam layers for glow
    for (let i = 3; i >= 0; i--) {
      const w = 1 + i * 2.5;
      const alpha = i === 0 ? 0.9 : 0.15 / i;

      const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      grad.addColorStop(0, colorFrom.replace('1)', `${alpha})`));
      grad.addColorStop(0.5, `rgba(255,215,80,${alpha * 0.8})`);
      grad.addColorStop(1, colorTo.replace('1)', `${alpha})`));

      ctx.strokeStyle = grad;
      ctx.lineWidth = w;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(midX + wobble1, midY + wobble2, to.x, to.y);
      ctx.stroke();
    }

    // Secondary threads
    for (let j = 0; j < 3; j++) {
      const offset = (j - 1) * 8;
      ctx.strokeStyle = `rgba(255,220,100,${0.1 + Math.sin(t * 5 + j) * 0.05})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(midX + wobble1 + offset, midY + wobble2 + offset * 0.5, to.x, to.y);
      ctx.stroke();
    }

    // Collision point glow
    const collX = midX + wobble1 * 0.3;
    const collY = midY + wobble2 * 0.3;
    const collR = 8 + Math.sin(t * 8) * 4;

    const collGrad = ctx.createRadialGradient(collX, collY, 0, collX, collY, collR * 3);
    collGrad.addColorStop(0, `rgba(255,255,200,${0.6 + Math.sin(t * 6) * 0.2})`);
    collGrad.addColorStop(0.3, `rgba(255,215,80,0.3)`);
    collGrad.addColorStop(1, `rgba(255,215,80,0)`);
    ctx.fillStyle = collGrad;
    ctx.beginPath();
    ctx.arc(collX, collY, collR * 3, 0, Math.PI * 2);
    ctx.fill();

    // Emit particles from collision
    if (Math.random() < 0.4) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      particlesRef.current.push({
        x: collX, y: collY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1, maxLife: 1,
        size: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? "rgba(255,80,80,1)" : "rgba(80,255,80,1)",
        type: 'spark',
      });
    }
  }, []);

  // ── Draw wand glow ──
  const drawWandGlow = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, color: string, radius: number, t: number
  ) => {
    const r = radius + Math.sin(t * 5) * 2;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    grad.addColorStop(0, color);
    grad.addColorStop(0.3, color.replace('1)', '0.4)'));
    grad.addColorStop(1, color.replace('1)', '0)'));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, Math.PI * 2);
    ctx.fill();

    // Core bright point
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Emit trail particles
    if (Math.random() < 0.3) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.5,
        life: 1, maxLife: 1,
        size: 1 + Math.random(),
        color,
        type: 'trail',
      });
    }
  }, []);

  // ── Draw phoenix ──
  const drawPhoenix = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, scale: number, t: number
  ) => {
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 1.5) * 5);
    ctx.scale(scale, scale);

    const wingAngle = Math.sin(t * 3) * 0.4;

    // Glow aura
    const auraR = 30 + Math.sin(t * 2) * 5;
    const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, auraR);
    aura.addColorStop(0, "rgba(255,180,50,0.15)");
    aura.addColorStop(0.5, "rgba(255,100,20,0.05)");
    aura.addColorStop(1, "rgba(255,50,0,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, auraR, 0, Math.PI * 2);
    ctx.fill();

    // Tail feathers
    for (let i = 0; i < 5; i++) {
      const tailAngle = (i - 2) * 0.15 + Math.sin(t * 2 + i * 0.5) * 0.1;
      const tailLen = 25 + i * 3;
      ctx.strokeStyle = `rgba(255,${100 - i * 15},${20 - i * 4},${0.4 - i * 0.05})`;
      ctx.lineWidth = 2 - i * 0.2;
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.quadraticCurveTo(
        Math.sin(tailAngle) * tailLen * 0.5,
        6 + tailLen * 0.5,
        Math.sin(tailAngle + Math.sin(t * 1.5) * 0.2) * 8,
        6 + tailLen
      );
      ctx.stroke();
    }

    // Body
    const bodyGrad = ctx.createLinearGradient(0, -8, 0, 8);
    bodyGrad.addColorStop(0, "rgba(255,200,50,0.8)");
    bodyGrad.addColorStop(0.5, "rgba(255,140,30,0.7)");
    bodyGrad.addColorStop(1, "rgba(255,80,10,0.5)");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Left wing
    ctx.save();
    ctx.rotate(-wingAngle - 0.3);
    const lwGrad = ctx.createLinearGradient(-25, 0, 0, 0);
    lwGrad.addColorStop(0, "rgba(255,80,10,0.2)");
    lwGrad.addColorStop(0.5, "rgba(255,140,40,0.5)");
    lwGrad.addColorStop(1, "rgba(255,180,60,0.6)");
    ctx.fillStyle = lwGrad;
    ctx.beginPath();
    ctx.moveTo(-4, -2);
    ctx.quadraticCurveTo(-18, -18, -25, -10);
    ctx.quadraticCurveTo(-20, -6, -10, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.rotate(wingAngle + 0.3);
    const rwGrad = ctx.createLinearGradient(25, 0, 0, 0);
    rwGrad.addColorStop(0, "rgba(255,80,10,0.2)");
    rwGrad.addColorStop(0.5, "rgba(255,140,40,0.5)");
    rwGrad.addColorStop(1, "rgba(255,180,60,0.6)");
    ctx.fillStyle = rwGrad;
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.quadraticCurveTo(18, -18, 25, -10);
    ctx.quadraticCurveTo(20, -6, 10, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Head
    ctx.fillStyle = "rgba(255,215,80,0.8)";
    ctx.beginPath();
    ctx.arc(0, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "rgba(20,10,0,0.8)";
    ctx.beginPath();
    ctx.arc(1.5, -10.5, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "rgba(255,180,50,0.9)";
    ctx.beginPath();
    ctx.moveTo(3.5, -10);
    ctx.lineTo(7, -9);
    ctx.lineTo(3.5, -8.5);
    ctx.closePath();
    ctx.fill();

    // Crest feathers
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(255,${180 + i * 20},${50 + i * 15},0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-1 + i, -13);
      ctx.quadraticCurveTo(-3 + i * 2 + Math.sin(t * 3 + i) * 2, -20, -2 + i * 2, -22 + Math.sin(t * 2.5 + i) * 2);
      ctx.stroke();
    }

    // Emit feather particles
    if (Math.random() < 0.15) {
      feathersRef.current.push({
        x: x + (Math.random() - 0.5) * 10 * scale,
        y: y + (Math.random() - 0.5) * 8 * scale,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.3 + Math.random() * 0.5,
        life: 1, maxLife: 1,
        size: 2 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
      });
    }

    ctx.restore();
  }, []);

  // ── Draw tomb ──
  const drawTomb = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, scale: number, t: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Tomb body
    const tombGrad = ctx.createLinearGradient(0, -20, 0, 20);
    tombGrad.addColorStop(0, "rgba(200,195,215,0.2)");
    tombGrad.addColorStop(1, "rgba(160,155,175,0.12)");
    ctx.fillStyle = tombGrad;

    // Rounded rectangle
    const w = 70, h = 25, r = 4;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + r, -h / 2);
    ctx.arcTo(w / 2, -h / 2, w / 2, h / 2, r);
    ctx.arcTo(w / 2, h / 2, -w / 2, h / 2, r);
    ctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r);
    ctx.arcTo(-w / 2, -h / 2, w / 2, -h / 2, r);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(220,215,235,0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tomb lid
    ctx.fillStyle = "rgba(210,205,225,0.18)";
    ctx.beginPath();
    ctx.roundRect(-w / 2 - 3, -h / 2 - 8, w + 6, 10, 3);
    ctx.fill();

    // Wand on tomb
    ctx.strokeStyle = "rgba(170,140,90,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-15, -h / 2 - 4);
    ctx.lineTo(20, -h / 2 - 5);
    ctx.stroke();

    // Wand tip glow (Elder Wand)
    const ewGlow = ctx.createRadialGradient(20, -h / 2 - 5, 0, 20, -h / 2 - 5, 8);
    ewGlow.addColorStop(0, `rgba(255,215,80,${0.2 + Math.sin(t * 2) * 0.1})`);
    ewGlow.addColorStop(1, "rgba(255,215,80,0)");
    ctx.fillStyle = ewGlow;
    ctx.beginPath();
    ctx.arc(20, -h / 2 - 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Tomb ornamental line
    ctx.strokeStyle = "rgba(255,215,80,0.08)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();

    ctx.restore();
  }, []);

  // ── Draw doe patronus ──
  const drawDoePatronus = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, scale: number, t: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const alpha = 0.15 + Math.sin(t * 1.5) * 0.08;

    // Glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    glow.addColorStop(0, `rgba(180,200,255,${alpha * 0.5})`);
    glow.addColorStop(1, "rgba(180,200,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    // Doe body
    ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = `rgba(200,220,255,${alpha * 0.3})`;

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.ellipse(14, -6, 5, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ears
    ctx.beginPath();
    ctx.moveTo(16, -9);
    ctx.lineTo(19, -14 + Math.sin(t * 2) * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(13, -9);
    ctx.lineTo(11, -14 + Math.sin(t * 2 + 0.5) * 0.5);
    ctx.stroke();

    // Legs
    const legPhase = Math.sin(t * 3) * 2;
    ctx.beginPath(); ctx.moveTo(-6, 5); ctx.lineTo(-8 + legPhase, 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, 5); ctx.lineTo(-3 - legPhase, 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, 5); ctx.lineTo(5 + legPhase, 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, 5); ctx.lineTo(10 - legPhase, 16); ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-12, -1);
    ctx.quadraticCurveTo(-16, -4 + Math.sin(t * 2) * 2, -14, -6);
    ctx.stroke();

    // Sparkle particles around patronus
    if (Math.random() < 0.2) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 30 * scale,
        y: y + (Math.random() - 0.5) * 20 * scale,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5,
        life: 1, maxLife: 1,
        size: 1 + Math.random(),
        color: "rgba(200,220,255,1)",
        type: 'orb',
      });
    }

    ctx.restore();
  }, []);

  // ── Draw glasses (Harry) ──
  const drawGlasses = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, scale: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "rgba(200,210,230,0.5)";
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(-3, 0, 3.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(3, 0, 3.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0.5, 0); ctx.lineTo(-0.5, 0); ctx.stroke();
    ctx.restore();
  }, []);

  // ── Draw lightning scar ──
  const drawScar = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, scale: number, t: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const alpha = 0.5 + Math.sin(t * 3) * 0.3;

    // Glow
    const scarGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 6);
    scarGlow.addColorStop(0, `rgba(255,215,80,${alpha * 0.4})`);
    scarGlow.addColorStop(1, "rgba(255,215,80,0)");
    ctx.fillStyle = scarGlow;
    ctx.beginPath();
    ctx.arc(0, -1, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255,215,80,${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-2, -1);
    ctx.lineTo(1, -1);
    ctx.lineTo(-1, 4);
    ctx.stroke();
    ctx.restore();
  }, []);

  // ── Draw floating candles ──
  const drawCandles = useCallback((
    ctx: CanvasRenderingContext2D,
    baseX: number, baseY: number, count: number, spread: number, t: number
  ) => {
    for (let i = 0; i < count; i++) {
      const cx = baseX + (i - count / 2) * (spread / count);
      const cy = baseY - 20 + Math.sin(t * 1.2 + i * 1.5) * 8;

      // Candle body
      ctx.fillStyle = "rgba(255,250,230,0.12)";
      ctx.fillRect(cx - 1, cy, 2, 10);

      // Flame
      const flameH = 4 + Math.sin(t * 5 + i * 2) * 1.5;
      const flameGrad = ctx.createRadialGradient(cx, cy - flameH / 2, 0, cx, cy - flameH / 2, flameH);
      flameGrad.addColorStop(0, `rgba(255,215,80,${0.3 + Math.sin(t * 6 + i) * 0.1})`);
      flameGrad.addColorStop(0.5, "rgba(255,180,50,0.15)");
      flameGrad.addColorStop(1, "rgba(255,150,30,0)");
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy - flameH / 2, 2.5, flameH, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // ── Main render loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;
      timeRef.current += dt;
      const t = timeRef.current;

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W(), H());

      const scrollP = scrollRef.current * 0.035;

      // ══════════════════════════════════════════════
      // SCENE 1: HARRY vs VOLDEMORT DUEL (left side)
      // ══════════════════════════════════════════════
      const duelBaseX = W() * 0.12;
      const duelBaseY = H() * 0.62 + scrollP;
      const duelScale = Math.max(W() / 1600, 0.5);

      // Harry
      const harryResult = drawFigure(ctx, duelBaseX, duelBaseY, duelScale, {
        headRadius: 7,
        cloakWidth: 18,
        cloakLength: 45,
        fillColor: "rgba(50,35,80,1)",
        strokeColor: "rgba(35,25,60,1)",
        hasHair: 'messy',
        armAngleL: -0.6 + Math.sin(t * 2) * 0.05,
        armAngleR: 0.9,
        armLenL: 28,
        armLenR: 18,
        wandArm: 'left',
        wandAngle: -0.5 + Math.sin(t * 1.5) * 0.05,
        wandLength: 22,
        lean: -3,
        legSpread: 10,
      });

      // Harry's glasses
      drawGlasses(ctx, duelBaseX - 3 * duelScale, duelBaseY - 1 * duelScale, duelScale);

      // Harry's scar
      drawScar(ctx, duelBaseX, duelBaseY - 7 * duelScale, duelScale * 0.7, t);

      // Voldemort
      const voldX = duelBaseX + 160 * duelScale;
      const voldResult = drawFigure(ctx, voldX, duelBaseY - 5 * duelScale, duelScale * 1.1, {
        headRadius: 8,
        cloakWidth: 24,
        cloakLength: 55,
        fillColor: "rgba(40,25,60,1)",
        strokeColor: "rgba(30,18,45,1)",
        hasHair: 'bald',
        armAngleL: Math.PI + 0.5 + Math.sin(t * 2.2) * 0.04,
        armAngleR: -0.4,
        armLenL: 30,
        armLenR: 22,
        wandArm: 'left',
        wandAngle: Math.PI + 0.4 + Math.sin(t * 1.8) * 0.04,
        wandLength: 24,
        lean: 3,
        legSpread: 9,
      });

      // Voldemort red eyes
      ctx.fillStyle = `rgba(255,20,20,${0.6 + Math.sin(t * 3) * 0.3})`;
      ctx.beginPath();
      ctx.arc(voldX - 2.5 * duelScale * 1.1, duelBaseY - 5 * duelScale - 1 * duelScale * 1.1, 1.5 * duelScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(voldX + 2.5 * duelScale * 1.1, duelBaseY - 5 * duelScale - 1 * duelScale * 1.1, 1.5 * duelScale, 0, Math.PI * 2);
      ctx.fill();

      // Spell wand glows
      drawWandGlow(ctx, harryResult.wandTip.x, harryResult.wandTip.y, "rgba(255,60,60,1)", 4 * duelScale, t);
      drawWandGlow(ctx, voldResult.wandTip.x, voldResult.wandTip.y, "rgba(50,255,50,1)", 5 * duelScale, t);

      // Priori Incantatem beam
      drawSpellBeam(ctx,
        harryResult.wandTip,
        voldResult.wandTip,
        "rgba(255,60,60,1)",
        "rgba(50,255,50,1)",
        t
      );

      // ══════════════════════════════════════════════
      // SCENE 2: SNAPE (right side, solitary)
      // ══════════════════════════════════════════════
      const snapeX = W() * 0.88;
      const snapeY = H() * 0.58 + scrollP * 1.2;
      const snapeScale = Math.max(W() / 1800, 0.45);

      // Hill
      ctx.fillStyle = "rgba(30,20,45,0.6)";
      ctx.beginPath();
      ctx.moveTo(snapeX - 60 * snapeScale, snapeY + 60 * snapeScale);
      ctx.quadraticCurveTo(snapeX, snapeY + 35 * snapeScale, snapeX + 60 * snapeScale, snapeY + 55 * snapeScale);
      ctx.lineTo(snapeX + 60 * snapeScale, snapeY + 80 * snapeScale);
      ctx.lineTo(snapeX - 60 * snapeScale, snapeY + 80 * snapeScale);
      ctx.closePath();
      ctx.fill();

      drawFigure(ctx, snapeX, snapeY, snapeScale, {
        headRadius: 7,
        cloakWidth: 22,
        cloakLength: 55,
        fillColor: "rgba(35,22,55,1)",
        strokeColor: "rgba(25,15,40,1)",
        hasHair: 'long',
        armAngleL: 1.2,
        armAngleR: 1.0,
        armLenL: 18,
        armLenR: 16,
        wandArm: 'right',
        wandAngle: 1.5,
        wandLength: 16,
        lean: 0,
        legSpread: 6,
      });

      // Doe Patronus near Snape
      const doeX = snapeX - 50 * snapeScale;
      const doeY = snapeY + 10 * snapeScale;
      drawDoePatronus(ctx, doeX, doeY, snapeScale * 0.8, t);

      // "Always" text
      ctx.save();
      ctx.font = `italic ${Math.max(10, 12 * snapeScale)}px serif`;
      ctx.fillStyle = `rgba(200,220,255,${0.08 + Math.sin(t * 1.2) * 0.04})`;
      ctx.textAlign = "center";
      ctx.fillText("Always", snapeX, snapeY + 72 * snapeScale);
      ctx.restore();

      // ══════════════════════════════════════════════
      // SCENE 3: DUMBLEDORE'S FUNERAL (center)
      // ══════════════════════════════════════════════
      const funeralX = W() * 0.48;
      const funeralY = H() * 0.68 + scrollP * 1.1;
      const funScale = Math.max(W() / 1700, 0.5);

      // Ground
      ctx.fillStyle = "rgba(25,18,40,0.5)";
      ctx.beginPath();
      ctx.moveTo(funeralX - 120 * funScale, funeralY + 40 * funScale);
      ctx.quadraticCurveTo(funeralX, funeralY + 30 * funScale, funeralX + 120 * funScale, funeralY + 38 * funScale);
      ctx.lineTo(funeralX + 120 * funScale, funeralY + 60 * funScale);
      ctx.lineTo(funeralX - 120 * funScale, funeralY + 60 * funScale);
      ctx.closePath();
      ctx.fill();

      // Tomb
      drawTomb(ctx, funeralX, funeralY + 15 * funScale, funScale, t);

      // Phoenix rising
      drawPhoenix(ctx, funeralX, funeralY - 30 * funScale, funScale * 1.2, t);

      // Floating candles
      drawCandles(ctx, funeralX, funeralY - 5 * funScale, 8, 160 * funScale, t);

      // Mourners — McGonagall (hat), Hagrid (large), 3 others
      const mournerConfigs = [
        { xOff: -80, yOff: 10, s: 0.35, hair: 'hat' as const },
        { xOff: -55, yOff: -5, s: 0.5, hair: 'bushy' as const },
        { xOff: 60, yOff: 12, s: 0.32, hair: 'messy' as const },
        { xOff: 75, yOff: 10, s: 0.34, hair: 'long' as const },
        { xOff: 90, yOff: 14, s: 0.3, hair: 'messy' as const },
      ];
      mournerConfigs.forEach(m => {
        drawFigure(ctx, funeralX + m.xOff * funScale, funeralY + m.yOff * funScale, funScale * m.s, {
          headRadius: 7,
          cloakWidth: 18,
          cloakLength: 42,
          fillColor: "rgba(40,28,60,0.7)",
          strokeColor: "rgba(30,20,48,0.7)",
          hasHair: m.hair,
          armAngleL: 1.2,
          armAngleR: 1.0,
          armLenL: 15,
          armLenR: 15,
          wandArm: 'none',
          lean: 0,
          legSpread: 5,
        });
      });

      // ══════════════════════════════════════════════
      // PARTICLES
      // ══════════════════════════════════════════════
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 0.8;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;

        if (p.type === 'spark') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'trail') {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          g.addColorStop(0, p.color.replace('1)', `${alpha})`));
          g.addColorStop(1, p.color.replace('1)', '0)'));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'orb') {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          g.addColorStop(0, `rgba(200,220,255,${alpha * 0.5})`);
          g.addColorStop(1, `rgba(200,220,255,0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Limit particles
      if (particles.length > 200) {
        particles.splice(0, particles.length - 200);
      }

      // Feathers
      const feathers = feathersRef.current;
      for (let i = feathers.length - 1; i >= 0; i--) {
        const f = feathers[i];
        f.x += f.vx;
        f.y += f.vy;
        f.rotation += f.rotSpeed;
        f.life -= dt * 0.4;

        if (f.life <= 0) {
          feathers.splice(i, 1);
          continue;
        }

        const alpha = f.life / f.maxLife;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.globalAlpha = alpha * 0.4;

        const featherGrad = ctx.createLinearGradient(-f.size, 0, f.size, 0);
        featherGrad.addColorStop(0, "rgba(255,120,30,0.3)");
        featherGrad.addColorStop(0.5, "rgba(255,180,60,0.5)");
        featherGrad.addColorStop(1, "rgba(255,100,20,0.2)");
        ctx.fillStyle = featherGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, f.size, f.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.restore();
      }
      if (feathers.length > 50) {
        feathers.splice(0, feathers.length - 50);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [drawFigure, drawSpellBeam, drawWandGlow, drawPhoenix, drawTomb, drawDoePatronus, drawGlasses, drawScar, drawCandles, getScrollRatio]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
