"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeading from "./SectionHeading";

const experiences = [
  {
    title: "Zuckerman Sustainability Software Engineering Intern",
    company: "Truman State University — Office of Sustainability",
    location: "Kirksville, MO",
    period: "Jan. 2026 — May 2026",
    points: [
      "Improved a production web application by debugging broken routes, refactoring navigation structure, and optimizing page layouts.",
      "Implemented accessibility improvements (alt text, semantic headings, contrast fixes) following WCAG guidelines.",
      "Worked with TreePlotter and structured tree inventory data to support interactive mapping and reporting features.",
      "Improved site maintainability by refactoring page structure and standardizing reusable components across the site.",
    ],
  },
  {
    title: "Computational Chemistry Research Assistant",
    company: "A.T. Still University (ATSU)",
    location: "Kirksville, MO",
    period: "Jul. 2025 — Present",
    points: [
      "Built and analyzed computational models for large-scale scientific datasets using Linux-based workflows.",
      "Prepared and processed datasets for simulation and analysis pipelines.",
      "Automated analysis pipelines using scripts and cluster tools to manage large experimental datasets.",
    ],
  },
  {
    title: "Joseph Baldwin Academy (JBA) Student Preceptor",
    company: "Truman State University",
    location: "Kirksville, MO",
    period: "Jul. 2023 — Jul. 2025",
    points: [
      "Explained and demonstrated core programming concepts in C++ and JavaScript, emphasizing problem-solving, control flow, and modular code.",
    ],
  },
];

export default function Experience() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="experience" className="relative py-16 sm:py-28 lg:py-36">
      <div className="section-divider mb-14 sm:mb-28" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-ember/[0.02] rounded-full blur-[180px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          tag="Experience"
          title="The Path So Far"
          subtitle="Where I've been, what I've carried forward"
        />

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 md:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent/15 via-primary/10 to-transparent" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-10 md:pl-14"
              >
                {/* Timeline dot */}
                <div className="absolute left-3 md:left-4 top-2 w-1.5 h-1.5 rounded-full bg-accent/30 -translate-x-[3px]" />

                <div className="glass-dark rounded-2xl p-4 sm:p-6 glass-dark-hover">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:justify-between gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-white font-serif font-semibold text-sm sm:text-base mb-1 text-glow-white">{exp.title}</h3>
                      <p className="text-accent/80 text-[11px] sm:text-xs font-medium text-glow-accent">{exp.company}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-0.5 text-[10px] text-gray-500 font-mono">
                      <span>{exp.period}</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {exp.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-400 text-[11px] sm:text-xs leading-[1.8] text-pop">
                        <span className="w-px h-3 bg-accent/15 mt-1.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
