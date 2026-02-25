"use client";

import { motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Mail, Heart } from "lucide-react";
import { useSound } from "./SoundManager";

const footerLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/Ashikvk18", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/ashik-dey-rupak-2ba866229", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ashikdeyrupak03@gmail.com", label: "Email" },
];

export default function Footer() {
  const { playHover, playClick } = useSound();

  return (
    <footer className="relative border-t border-white/[0.03] pt-10 sm:pt-16 pb-8 sm:pb-10">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: Brand + Nav + Socials */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <a href="#home" className="text-lg font-serif font-bold text-gradient-sorrow tracking-wide text-glow-primary">
              Ashik.
            </a>
            <p className="text-gray-500 text-xs leading-relaxed mt-3 max-w-[240px] text-pop">
              CS wizard at Truman State University. Crafting code that conjures real-world solutions.
            </p>
            <p className="text-amber-400/15 text-[9px] font-serif italic tracking-widest mt-3">
              ✧ Mischief Managed ✧
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/80 text-[10px] font-mono uppercase tracking-[0.25em] mb-4 text-glow-white">Navigate</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="text-gray-500 text-xs hover:text-accent/80 transition-colors duration-500"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social + Contact */}
          <div>
            <h4 className="text-white/80 text-[10px] font-mono uppercase tracking-[0.25em] mb-4 text-glow-white">Connect</h4>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.04] text-gray-400 hover:text-accent/80 hover:border-accent/20 transition-all duration-500"
                  aria-label={social.label}
                >
                  <social.icon size={14} strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
            <p className="text-gray-400 text-[10px]">ashikdeyrupak03@gmail.com</p>
            <p className="text-gray-500 text-[10px] mt-1">Kirksville, MO</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-[10px] font-mono tracking-wider">
            &copy; {new Date().getFullYear()} Ashik Dey Rupak. All rights reserved.
          </p>

          <p className="text-gray-500 text-[10px] italic flex items-center gap-1.5">
            Built with <Heart size={9} className="text-accent/40" /> and a bit of magic
          </p>

          <motion.a
            href="#home"
            whileHover={{ y: -2 }}
            onMouseEnter={playHover}
            onClick={playClick}
            className="flex items-center gap-2 text-gray-500 hover:text-accent/70 text-[10px] font-mono uppercase tracking-wider transition-colors duration-500"
          >
            Back to Top
            <ArrowUp size={11} strokeWidth={1.5} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
