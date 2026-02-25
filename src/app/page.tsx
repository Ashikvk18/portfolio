"use client";

import ParticleBackground from "@/components/ParticleBackground";
import HogwartsBackground from "@/components/HogwartsBackground";
import VideoBackground from "@/components/VideoBackground";
import WizardScenes from "@/components/WizardScenes";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import SoundProvider from "@/components/SoundManager";

export default function Home() {
  return (
    <SoundProvider>
      <main className="relative">
        {/* Atmospheric layers */}
        <HogwartsBackground />
        <VideoBackground />
        <WizardScenes />
        <ParticleBackground />
        <div className="fog-layer fog-layer-1" />
        <div className="fog-layer fog-layer-2" />
        <div className="fog-layer fog-layer-3" />
        <CinematicOverlay />

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Contact />
          <Footer />
        </div>
      </main>
    </SoundProvider>
  );
}
