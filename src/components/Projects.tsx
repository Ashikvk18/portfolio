"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Award, Shield, Brain, Dumbbell, Leaf } from "lucide-react";
import SectionHeading from "./SectionHeading";

const projects = [
  {
    title: "Deep Packet Inspection System",
    description:
      "Network security tool with TLS SNI extraction, threat detection (port scans, DDoS, DNS tunneling), bandwidth monitoring, and a real-time web dashboard with interactive rule management and JSON/CSV export.",
    tags: ["C++", "Networking", "Multithreading", "TLS/HTTP/DNS", "Web Dashboard"],
    date: "2025",
    award: null,
    github: "https://github.com/Ashikvk18/DPI",
    icon: Shield,
    gradient: "from-cyan-500/20 via-blue-600/20 to-indigo-700/20",
    iconColor: "text-cyan-400",
    accentBorder: "border-cyan-500/20",
  },
  {
    title: "Scam Call Analysis — ML & NLP",
    description:
      "Machine learning research analyzing scam call patterns among university students. Built with Logistic Regression, Decision Trees, TF-IDF NLP analysis, a Streamlit web app, and a full IEEE conference paper.",
    tags: ["Python", "Scikit-learn", "NLP", "TF-IDF", "Streamlit", "LaTeX"],
    date: "2025",
    award: null,
    github: "https://github.com/Ashikvk18/scam-call-ml",
    icon: Brain,
    gradient: "from-purple-500/20 via-fuchsia-600/20 to-pink-700/20",
    iconColor: "text-purple-400",
    accentBorder: "border-purple-500/20",
  },
  {
    title: "Truman Rec Center AI Website",
    description:
      "Full-stack web platform with an AI chatbot, fitness calculators, and personalized workout & nutrition generation. Secure REST APIs with Flask and JWT authentication.",
    tags: ["Flask", "REST APIs", "JWT", "HTML/CSS", "JavaScript", "Anthropic API"],
    date: "Apr. 2025",
    award: null,
    github: "https://github.com/Ashikvk18",
    icon: Dumbbell,
    gradient: "from-amber-500/20 via-orange-600/20 to-red-700/20",
    iconColor: "text-amber-400",
    accentBorder: "border-amber-500/20",
  },
  {
    title: "Green Pulse",
    description:
      "AI-based plant disease detection using image analysis and backend services. Cloud integration with Firebase and MySQL for secure data handling.",
    tags: ["Java", "Spring Boot", "Firebase", "MySQL"],
    date: "Oct. 2024",
    award: "TigerHacks — Hackers' Choice Award",
    github: "https://github.com/Ashikvk18",
    icon: Leaf,
    gradient: "from-emerald-500/20 via-green-600/20 to-teal-700/20",
    iconColor: "text-emerald-400",
    accentBorder: "border-emerald-500/20",
  },
];

export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="projects" className="relative py-16 sm:py-28 lg:py-36">
      <div className="section-divider mb-14 sm:mb-28" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Projects"
          title="Things I've Built"
          subtitle="Each one a small piece of who I am"
        />

        <div ref={ref} className="space-y-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <div className={`group glass-dark rounded-2xl overflow-hidden glass-dark-hover border ${project.accentBorder} border-opacity-0 hover:border-opacity-100 transition-all duration-700`}>
                {/* Gradient placeholder image */}
                <div className={`relative h-40 sm:h-48 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.07]" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }} />
                  {/* Radial glow behind icon */}
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
                  {/* Centered icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <project.icon size={64} strokeWidth={1} className={`${project.iconColor} opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700`} />
                  </div>
                  {/* Date badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[10px] font-mono text-gray-300 bg-black/40 backdrop-blur-sm rounded-full border border-white/[0.06]">
                      {project.date}
                    </span>
                  </div>
                  {/* Award badge */}
                  {project.award && (
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 text-accent/90 bg-black/40 backdrop-blur-sm rounded-full border border-accent/20 text-[10px] font-medium text-glow-accent">
                        <Award size={11} />
                        <span className="italic">{project.award}</span>
                      </div>
                    </div>
                  )}
                  {/* Bottom gradient fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-white font-serif font-semibold text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-accent transition-colors duration-500 text-glow-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-[1.8] mb-4 sm:mb-5 text-pop">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-[10px] font-mono text-gray-400 border border-white/[0.06] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-5">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-500 hover:text-accent/80 text-xs transition-colors duration-500"
                    >
                      <Github size={13} strokeWidth={1.5} />
                      Source
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-500 hover:text-primary/80 text-xs transition-colors duration-500"
                    >
                      <ExternalLink size={13} strokeWidth={1.5} />
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
