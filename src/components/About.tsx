"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, GraduationCap, Code2, Beaker } from "lucide-react";
import SectionHeading from "./SectionHeading";
import WizardPhoto from "./WizardPhoto";

const highlights = [
  {
    icon: GraduationCap,
    title: "4.0 GPA",
    description: "B.S. Computer & Information Science at Truman State University",
  },
  {
    icon: Code2,
    title: "Full-Stack Dev",
    description: "Flask, Node.js, Spring Boot — building end-to-end applications",
  },
  {
    icon: Beaker,
    title: "Researcher",
    description: "Computational Chemistry research at A.T. Still University",
  },
  {
    icon: MapPin,
    title: "Kirksville, MO",
    description: "Open to remote & relocation opportunities",
  },
];

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="relative py-16 sm:py-28 lg:py-36">
      <div className="section-divider mb-14 sm:mb-28" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="About Me"
          title="Who I Am"
          subtitle="A quiet drive to build things that outlast the moment"
        />

        <div ref={ref} className="grid lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Photo + highlight cards */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <WizardPhoto inView={inView} />

            {/* Highlight cards */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.12 }}
                  className="group p-4 glass-dark rounded-xl glass-dark-hover cursor-default"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white/[0.03] text-accent/50 mb-2 sm:mb-2.5 group-hover:text-accent/70 transition-colors duration-500">
                    <item.icon size={14} strokeWidth={1.5} className="sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="text-white font-medium text-[11px] sm:text-xs mb-0.5 text-glow-white">{item.title}</h3>
                  <p className="text-gray-500 text-[9px] sm:text-[10px] leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side - text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-3 space-y-4 sm:space-y-6"
          >
            <p className="text-gray-400 leading-[1.9] text-sm text-pop">
              I&apos;m <span className="text-white font-medium text-glow-white">Ashik Dey Rupak</span> — a
              Computer Science student at Truman State University, graduating December 2026.
              I exist somewhere between <span className="text-primary text-glow-primary">software engineering</span> and{" "}
              <span className="text-accent text-glow-accent">scientific curiosity</span>, always searching for
              the next problem worth solving.
            </p>
            <p className="text-gray-400 leading-[1.9] text-sm text-pop">
              I&apos;ve won hackathons — <span className="text-gray-300 italic">TruHacks 1st Prize, TigerHacks Hackers&apos; Choice Award</span> — 
              but the wins that matter most are the quiet ones: debugging at 3am, 
              refactoring code until it feels right, watching a model converge after hours of tuning.
            </p>
            <p className="text-gray-400 leading-[1.9] text-sm text-pop">
              Bronze Medalist at AIME. Presidential Award recipient. John Merrill CS Foundation Scholar.
              But numbers only tell part of the story. What drives me is the feeling of building
              something from nothing — turning abstract ideas into working systems.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-wrap gap-2 pt-4"
            >
              {["Python", "C++", "Java", "JavaScript", "Flask", "Node.js", "Spring Boot", "PyTorch"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-[10px] font-mono text-gray-400 border border-white/[0.06] rounded-full hover:border-accent/20 hover:text-gray-300 transition-all duration-500"
                  >
                    {skill}
                  </span>
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
