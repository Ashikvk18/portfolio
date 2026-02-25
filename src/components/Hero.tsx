"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { useSound } from "./SoundManager";

export default function Hero() {
  const { playHover, playClick, playSpell } = useSound();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Magical gradient orbs */}
      <div className="absolute top-1/4 -left-40 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-amber-500/[0.04] rounded-full blur-[120px] sm:blur-[200px] animate-drift" />
      <div className="absolute bottom-1/3 -right-40 w-[200px] sm:w-[450px] h-[200px] sm:h-[450px] bg-purple-500/[0.03] rounded-full blur-[100px] sm:blur-[180px] animate-drift-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[300px] sm:h-[700px] bg-blue-400/[0.02] rounded-full blur-[140px] sm:blur-[220px] animate-pulse-dim" />

      {/* Enchanted light beam from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[40vh] bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-4 text-center">
        {/* Magical rune intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 0.3 }}
          className="mb-4"
        >
          <span className="inline-block text-amber-400/40 text-sm tracking-[1em] font-serif text-glow">
            ✧ ⚡ ✧
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="mb-8"
        >
          <span className="inline-block text-[10px] font-serif italic tracking-[0.4em] text-amber-200/40 uppercase text-glow">
            The Marauder&apos;s Portfolio
          </span>
        </motion.div>

        {/* Name — wizard style */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-7xl lg:text-9xl font-serif font-bold tracking-tight mb-3 text-glow"
        >
          <span className="text-gradient-ember">Ashik</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="text-[10px] font-serif italic text-amber-300/30 tracking-[0.5em] uppercase mb-10 text-glow"
        >
          Dey Rupak
        </motion.p>

        {/* Typing subtitle — spell-themed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.3 }}
          className="text-xs sm:text-base lg:text-lg font-light mb-8 sm:mb-12 min-h-[2rem] sm:min-h-[1.75rem]"
        >
          <TypeAnimation
            sequence={[
              "⚡ Lumos — Illuminating code in the dark.",
              3500,
              "✦ Expecto Patronum — Crafting full-stack magic.",
              3500,
              "☽ Accio Knowledge — Researching the unknown.",
              3500,
              "◈ Wingardium Leviosa — Elevating ideas into reality.",
              3500,
            ]}
            wrapper="span"
            speed={35}
            deletionSpeed={50}
            repeat={Infinity}
            className="text-amber-200/50 font-serif italic text-glow-accent"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.8 }}
          className="max-w-lg mx-auto text-gray-400 text-xs sm:text-sm leading-relaxed mb-10 sm:mb-14 px-2 sm:px-0 text-pop"
        >
          CS wizard at Truman State. I conjure code that solves real problems —
          from AI-powered platforms to computational chemistry research.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.2 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          <a
            href="#projects"
            onMouseEnter={playHover}
            onClick={playSpell}
            className="group relative px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-serif font-medium text-amber-300/70 border border-amber-400/20 rounded-full overflow-hidden transition-all duration-700 hover:border-amber-400/35 hover:text-amber-200/90 hover:shadow-[0_0_25px_rgba(255,215,80,0.12)] text-glow"
          >
            <span className="relative z-10">✦ View My Spells</span>
            <div className="absolute inset-0 bg-amber-400/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </a>
          <a
            href="#contact"
            onMouseEnter={playHover}
            onClick={playClick}
            className="px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-serif text-gray-400 hover:text-amber-300/60 transition-colors duration-500 text-pop"
          >
            Send an Owl
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3.6 }}
          className="flex items-center justify-center gap-8"
        >
          {[
            { icon: Github, href: "https://github.com/Ashikvk18", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/ashik-dey-rupak-2ba866229", label: "LinkedIn" },
            { icon: Mail, href: "mailto:ashikdeyrupak03@gmail.com", label: "Email" },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-amber-400/70 transition-all duration-500"
              whileHover={{ y: -3 }}
              onMouseEnter={playHover}
              onClick={playClick}
            >
              <social.icon size={17} strokeWidth={1.5} />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 4.2 }}
          className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-amber-400/30 hover:text-amber-400/50 transition-colors duration-500 text-glow"
          >
            <span className="text-[8px] uppercase tracking-[0.4em] font-serif">Mischief Managed</span>
            <ChevronDown size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
