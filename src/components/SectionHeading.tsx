"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  tag?: string;
}

export default function SectionHeading({ title, subtitle, tag }: SectionHeadingProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="text-center mb-12 sm:mb-20">
      {tag && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="inline-block px-5 py-1.5 mb-5 text-[10px] font-mono font-medium text-accent/80 border border-accent/20 rounded-full uppercase tracking-[0.25em] text-glow-accent"
        >
          {tag}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
        className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-5 tracking-tight text-glow-white"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
        className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed text-pop"
      >
        {subtitle}
      </motion.p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
    </div>
  );
}
