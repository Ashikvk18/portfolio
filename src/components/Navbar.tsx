"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSound } from "./SoundManager";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { playHover, playClick } = useSound();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = navLinks.map((link) => link.href.replace("#", ""));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-700 ${
          isScrolled
            ? "glass-dark shadow-2xl shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-3 -ml-2 text-gray-200 hover:text-white active:scale-95 transition-all relative z-10"
                onClick={() => { playClick(); setIsMobileOpen(!isMobileOpen); }}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <motion.a
                href="#home"
                className="text-base sm:text-lg font-serif font-bold text-gradient-sorrow tracking-wide text-glow-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHover}
                onClick={playClick}
              >
                Ashik.
              </motion.a>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className={`relative px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-500 ${
                    activeSection === link.href.replace("#", "")
                      ? "text-accent text-glow-accent"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {activeSection === link.href.replace("#", "") && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[75] md:hidden"
          >
            <div
              className="absolute inset-0 bg-void-950/90 backdrop-blur-md"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="absolute left-0 top-0 h-full w-[280px] max-w-[80vw] bg-void-900/95 backdrop-blur-sm border-r border-white/[0.03] p-6 pt-6"
            >
              {/* Close button */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[9px] font-serif italic tracking-[0.3em] text-amber-400/25 uppercase">Navigate</span>
                <button
                  onClick={() => { playClick(); setIsMobileOpen(false); }}
                  className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setIsMobileOpen(false)}
                    className={`px-4 py-3.5 text-xs uppercase tracking-widest font-medium transition-all duration-300 rounded-lg ${
                      activeSection === link.href.replace("#", "")
                        ? "text-accent text-glow-accent border-l-2 border-accent/40 bg-accent/[0.04]"
                        : "text-gray-500 hover:text-gray-300 border-l-2 border-transparent"
                    }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Wizard accent at bottom */}
              <div className="absolute bottom-8 left-6 right-6">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent mb-4" />
                <p className="text-[8px] font-serif italic tracking-[0.35em] text-amber-400/20 text-center uppercase">
                  ✧ Mischief Managed ✧
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
