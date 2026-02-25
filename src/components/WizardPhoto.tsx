"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WizardPhoto({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative w-full max-w-[200px] sm:max-w-[280px] mx-auto"
    >
      {/* Outer ambient glow */}
      <div className="absolute -inset-12 rounded-full opacity-50 blur-[60px] animate-pulse-dim"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,215,80,0.12), rgba(120,80,220,0.06), transparent 70%)" }}
      />

      {/* Subtle orbiting particles */}
      <div className="absolute -inset-4 animate-[spin_25s_linear_infinite]">
        <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/50 blur-[2px]" />
        <div className="absolute bottom-0 right-0 w-1 h-1 rounded-full bg-purple-300/30 blur-[1px]" />
      </div>
      <div className="absolute -inset-4 animate-[spin_18s_linear_infinite_reverse]">
        <div className="absolute top-1/4 right-0 w-1 h-1 rounded-full bg-amber-300/40 blur-[1px]" />
        <div className="absolute bottom-1/4 left-0 w-1.5 h-1.5 rounded-full bg-blue-300/25 blur-[1px]" />
      </div>

      {/* Main photo container — circular professional portrait */}
      <div className="relative aspect-square rounded-full overflow-hidden" style={{
        boxShadow: `
          0 0 0 2px rgba(255,215,80,0.12),
          0 0 0 6px rgba(10,3,24,0.8),
          0 0 0 8px rgba(255,215,80,0.06),
          0 0 60px rgba(255,215,80,0.08),
          0 0 120px rgba(120,80,220,0.06)
        `
      }}>
        {/* Photo */}
        <Image
          src="/profile.jpg"
          alt="Ashik Dey Rupak"
          fill
          className="object-cover object-top scale-110"
          priority
        />

        {/* Edge fade — dissolves the background into darkness */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at center, transparent 35%, rgba(8,3,18,0.3) 55%, rgba(8,3,18,0.7) 70%, rgba(8,3,18,0.95) 85%)"
        }} />

        {/* Mystical color grading — subtle purple-gold tones */}
        <div className="absolute inset-0 mix-blend-soft-light" style={{
          background: "linear-gradient(160deg, rgba(120,80,220,0.12), transparent 50%, rgba(255,180,50,0.08))"
        }} />

        {/* Top-down dramatic lighting */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(8,3,18,0.4) 75%, rgba(8,3,18,0.8) 100%)"
        }} />

        {/* Inner ring glow */}
        <div className="absolute inset-0 rounded-full" style={{
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(10,3,24,0.4)"
        }} />
      </div>

      {/* Enchanted double ring */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(255,215,80,0.08)",
          animation: "enchanted-border 8s ease infinite"
        }}
      />
      <div className="absolute -inset-3 rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(120,80,220,0.06)",
        }}
      />

      {/* Small lightning bolt accent — bottom right */}
      <div className="absolute bottom-2 right-2 z-20 pointer-events-none opacity-60">
        <svg width="12" height="20" viewBox="0 0 16 28" className="animate-flicker">
          <defs>
            <filter id="scarGlow2">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M8 0 L3 11 L7 11 L2 28 L14 10 L9 10 L14 0 Z"
            fill="#FFD700" opacity="0.8" filter="url(#scarGlow2)" />
        </svg>
      </div>

      {/* Corner rune accents */}
      <div className="absolute -top-2 -left-2 text-amber-500/20 text-xs font-serif animate-pulse-dim">✧</div>
      <div className="absolute -top-2 -right-2 text-purple-400/20 text-xs font-serif animate-pulse-dim" style={{ animationDelay: "1s" }}>◈</div>
      <div className="absolute -bottom-2 -left-2 text-blue-400/20 text-xs font-serif animate-pulse-dim" style={{ animationDelay: "2s" }}>☽</div>
      <div className="absolute -bottom-2 -right-2 text-amber-400/20 text-xs font-serif animate-pulse-dim" style={{ animationDelay: "3s" }}>⚡</div>

      {/* Name label beneath */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-5 text-center"
      >
        <p className="text-[9px] font-serif italic tracking-[0.35em] uppercase text-amber-400/30 text-glow">
          ⚡ Wizard of Code ⚡
        </p>
      </motion.div>
    </motion.div>
  );
}
