"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "./SoundManager";

export default function SoundToggle() {
  const { isMuted, toggleMute } = useSound();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 2 }}
      onClick={toggleMute}
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full glass-dark border transition-all duration-500 ${
        isMuted
          ? "border-white/[0.06] text-gray-600 hover:text-gray-400"
          : "border-amber-400/20 text-amber-400/60 hover:text-amber-400/80 shadow-[0_0_15px_rgba(255,215,80,0.08)]"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? (
        <VolumeX size={15} strokeWidth={1.5} />
      ) : (
        <Volume2 size={15} strokeWidth={1.5} />
      )}
      {!isMuted && (
        <motion.div
          className="absolute inset-0 rounded-full border border-amber-400/20"
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
