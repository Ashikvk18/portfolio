"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeading from "./SectionHeading";

const skillCategories = [
  {
    title: "Languages",
    accent: "bg-primary/40",
    barColor: "bg-gradient-to-r from-primary/30 to-primary/60",
    skills: [
      { name: "Python", level: 95 },
      { name: "C++", level: 88 },
      { name: "Java", level: 85 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 92 },
      { name: "Kotlin", level: 70 },
    ],
  },
  {
    title: "Frameworks & Tools",
    accent: "bg-accent/40",
    barColor: "bg-gradient-to-r from-accent/20 to-accent/50",
    skills: [
      { name: "Flask", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "Express", level: 82 },
      { name: "Spring Boot", level: 78 },
      { name: "Git/GitHub", level: 92 },
      { name: "Linux", level: 85 },
    ],
  },
  {
    title: "Data & ML",
    accent: "bg-sorrow/40",
    barColor: "bg-gradient-to-r from-sorrow/20 to-sorrow/50",
    skills: [
      { name: "Pandas", level: 88 },
      { name: "NumPy", level: 88 },
      { name: "PyTorch", level: 75 },
      { name: "TensorFlow", level: 72 },
      { name: "Matplotlib", level: 85 },
      { name: "XGBoost", level: 70 },
    ],
  },
  {
    title: "Concepts",
    accent: "bg-ember/40",
    barColor: "bg-gradient-to-r from-ember/20 to-ember/45",
    skills: [
      { name: "REST APIs", level: 92 },
      { name: "API Design", level: 88 },
      { name: "JWT Auth", level: 90 },
      { name: "Full-Stack Dev", level: 90 },
      { name: "Responsive Design", level: 88 },
      { name: "Cloud (Firebase)", level: 80 },
    ],
  },
];

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="skills" className="relative py-16 sm:py-28 lg:py-36">
      <div className="section-divider mb-14 sm:mb-28" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sorrow/[0.03] rounded-full blur-[180px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          tag="Skills"
          title="What I Know"
          subtitle="The tools and technologies I reach for"
        />

        <div ref={ref} className="grid md:grid-cols-2 gap-5">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: catIndex * 0.15 }}
              className="glass-dark rounded-2xl p-6 glass-dark-hover"
            >
              <h3 className="text-white font-medium text-sm mb-6 flex items-center gap-2.5 text-glow-white">
                <span className={`w-1.5 h-1.5 rounded-full ${category.accent}`} />
                {category.title}
              </h3>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-300 font-medium">{skill.name}</span>
                      <span className="text-gray-500 font-mono text-[10px]">{skill.level}%</span>
                    </div>
                    <div className="h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : {}}
                        transition={{
                          duration: 1.5,
                          delay: catIndex * 0.15 + skillIndex * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`h-full rounded-full ${category.barColor}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
