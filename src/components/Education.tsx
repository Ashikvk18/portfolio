"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Trophy, Medal, Award } from "lucide-react";
import SectionHeading from "./SectionHeading";

const awards = [
  {
    title: "Bronze Medalist — AIME",
    org: "American Invitational Mathematics Examination",
    year: "2022",
    icon: Medal,
  },
  {
    title: "Presidential Award",
    org: "Truman State University",
    year: "2022 — 2026",
    icon: Trophy,
  },
  {
    title: "John Merrill CS Foundation Scholarship",
    org: "Truman State University",
    year: "2024",
    icon: Award,
  },
];

export default function Education() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="relative py-16 sm:py-28 lg:py-36">
      <div className="section-divider mb-14 sm:mb-28" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Education & Honors"
          title="Foundations"
          subtitle="The ground I stand on"
        />

        <div ref={ref} className="grid md:grid-cols-2 gap-8">
          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="glass-dark rounded-2xl p-5 sm:p-8 border-t border-accent/10"
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-8">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.03] text-accent/40">
                <GraduationCap size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-white font-serif font-semibold text-base sm:text-lg text-glow-white">Truman State University</h3>
                <p className="text-gray-500 text-xs">Kirksville, MO</p>
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-gray-300 text-sm font-medium text-pop">
                B.S. in Computer & Information Science
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="px-4 py-2.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <span className="text-white font-serif font-bold text-2xl text-glow">4.0</span>
                  <span className="text-gray-700 text-xs ml-1.5">GPA</span>
                </div>
                <div className="px-4 py-2.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <span className="text-gray-300 text-xs font-medium">Expected Dec. 2026</span>
                </div>
              </div>
              <p className="text-gray-500 text-[10px] font-mono tracking-wider">
                Aug. 2022 — Dec. 2026
              </p>
            </div>
          </motion.div>

          {/* Awards */}
          <div className="space-y-4">
            {awards.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
                className="group glass-dark rounded-xl p-5 glass-dark-hover flex items-center gap-4"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.02] text-accent/30 group-hover:text-accent/50 transition-colors duration-500">
                  <award.icon size={16} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-xs mb-0.5 text-glow-white">{award.title}</h4>
                  <p className="text-gray-500 text-[10px]">{award.org}</p>
                </div>
                <span className="text-gray-500 text-[10px] font-mono whitespace-nowrap">{award.year}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
