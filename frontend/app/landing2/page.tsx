"use client";

import React, { useEffect, useRef, useState } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Scene3D from "./components/Scene3D";
import MenuOverlay from "./components/MenuOverlay";
import StackTicker from "./components/StackTicker";
import ProjectCard from "./components/ProjectCard";
import IndustrialImage from "./components/IndustrialImage";
import { projects, skills, profile } from "@/data/projects";

// --- Fuentes ---
const inter = Inter({ subsets: ["latin"], weight: ["400", "900"] });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], weight: ["400", "700"] });

interface HeroData {
  backgroundImage: string;
  location?: string;
}

// --- Componentes ---

// Texto Metálico (Chrome Effect)
const ChromeText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={cn("bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-300 to-gray-500", className)}
    style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.3)" }}
  >
    {children}
  </span>
);

// Cursor Personalizado
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      ref={cursorRef}
      className="fixed w-8 h-8 border border-white rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
      style={{ x: cursorX, y: cursorY }}
    />
  );
};

export default function Landing2() {
  const containerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string>("");
  const [heroLocation, setHeroLocation] = useState<string>("");

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("http://localhost:3001/hero");
        if (response.ok) {
          const data = await response.json();
          if (data.backgroundImage) {
            setHeroImage(data.backgroundImage);
          }
          if (data.location) {
            setHeroLocation(data.location);
          }
        }
      } catch (error) {
        console.log("Failed to fetch hero data, falling back to default.");
      }
    };
    fetchHeroData();
  }, []);

  return (
    <div ref={containerRef} className={cn("min-h-screen bg-black text-white cursor-none selection:bg-white selection:text-black relative", inter.className)}>
      <CustomCursor />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header Flotante */}
      <nav className="fixed top-8 left-8 right-8 z-50 flex justify-between items-center mix-blend-difference text-white">
        <span className="text-xl font-bold tracking-tighter mix-blend-difference">{profile.name}</span>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-sm font-semibold uppercase tracking-widest hover:underline decoration-1 underline-offset-4 mix-blend-difference"
        >
          Menu
        </button>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-4 md:px-20 relative overflow-hidden">
        {/* Fondo decorativo abstracto - Reemplazado por Scene3D */}
        <Scene3D />

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 pointer-events-none"
        >
          <p className={cn("text-2xl md:text-4xl text-neutral-400 mb-4 ml-2", playfair.className)}>
            The art of intelligence
          </p>
          <h1 className="text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tighter mix-blend-overlay opacity-90">
            SYSTEM <br />
            <ChromeText className="italic pr-4 font-serif font-light">Vision</ChromeText> <br />
            ENGINEER
          </h1>
        </motion.div>

        <motion.div
          className="absolute bottom-12 right-12 flex gap-4 items-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-24 h-[1px] bg-white/30" />
          <span className="uppercase text-xs tracking-widest text-neutral-400">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* About Section - Moved to Top */}
      <section className="min-h-screen py-32 px-4 md:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-20 bg-black">
        <div className="md:col-span-5 relative">
          <div className="aspect-[3/4] bg-neutral-900 relative overflow-hidden group">
            {/* Placeholder for Profile Image */}
            {/* Profile Image with Industrial Frame */}
            <div className="absolute inset-0">
              <IndustrialImage src={heroImage || profile.image} alt={profile.name} className="w-full h-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
              <p className="text-xs uppercase tracking-widest text-[#FF3B30] mb-2">{heroLocation || profile.location}</p>
              <p className="text-white font-mono text-xs shadow-black drop-shadow-md">{profile.role}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-8 justify-center">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Bridging the gap between <span className={cn("text-neutral-500 italic", playfair.className)}>human intuition</span> and artificial logic.
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">
            {profile.bio}
          </p>

          <div className="grid grid-cols-2 gap-8 mt-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-xs uppercase text-neutral-500 tracking-widest mb-2">Experience</p>
              <p className="text-3xl font-bold">{profile.years}+ Years</p>
            </div>
            <div>
              <p className="text-xs uppercase text-neutral-500 tracking-widest mb-2">Focus</p>
              <p className="text-3xl font-bold">AI Systems</p>
            </div>
          </div>

          <button className="flex items-center gap-2 text-xl font-bold group w-fit hover:text-[#FF3B30] transition-colors mt-8">
            Download Resume / CV
            <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Stack Ticker Section */}
      <div className="z-20 relative bg-black border-y border-white/5">
        <StackTicker skills={skills} />
      </div>

      {/* Projects Section */}
      <section className="relative z-20 bg-black px-4 md:px-20 py-20">
        <div className="mb-20">
          <h2 className="text-sm uppercase tracking-[0.3em] text-[#FF3B30] mb-4">Selected Works</h2>
          <p className={cn("text-4xl md:text-6xl max-w-4xl leading-tight", playfair.className)}>
            Engineering intelligence into <span className="text-neutral-500">production reality</span>.
          </p>
        </div>

        <div className="flex flex-col">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Footer Big Typography */}
      <footer className="h-[70vh] flex flex-col justify-end px-4 md:px-20 pb-20 border-t border-white/10 relative z-20 bg-black">
        <div className="flex justify-between items-end mb-20">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-[#FF3B30]">Get in touch</span>
            <a href={`mailto:${profile.email}`} className="text-2xl md:text-4xl hover:text-neutral-400 transition-colors">{profile.email}</a>
          </div>

          <div className="flex gap-4">
            <a href={profile.github} target="_blank" className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
              <Github size={24} />
            </a>
            <a href={profile.linkedin} target="_blank" className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        <h2 className="text-[12vw] leading-none font-black text-white/10 hover:text-white/30 transition-colors cursor-pointer text-center group">
          LET'S TALK
        </h2>

        <div className="flex justify-between items-center mt-8 text-xs text-neutral-600 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>All rights reserved</span>
        </div>
      </footer>

    </div>
  );
}
