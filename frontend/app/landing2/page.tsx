"use client";

import React, { useEffect, useRef } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Fuentes ---
const inter = Inter({ subsets: ["latin"], weight: ["400", "900"] });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], weight: ["400", "700"] });

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

// Marquee Infinito
const Marquee = ({ text }: { text: string }) => {
  return (
    <div className="relative flex overflow-x-hidden border-y border-white/10 py-4 bg-white/5 backdrop-blur-sm">
      <div className="animate-marquee whitespace-nowrap flex gap-8">
        {[...Array(10)].map((_, i) => (
          <span key={i} className={cn("text-4xl md:text-6xl font-black text-white/20 uppercase", inter.className)}>
            {text} — 
          </span>
        ))}
      </div>
    </div>
  );
};

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
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className={cn("min-h-screen bg-black text-white cursor-none selection:bg-white selection:text-black", inter.className)}>
      <CustomCursor />
      
      {/* Header Flotante */}
      <nav className="fixed top-8 left-8 right-8 z-50 flex justify-between items-center mix-blend-difference text-white">
        <span className="text-xl font-bold tracking-tighter">Kevin Narvaez</span>
        <button className="text-sm font-semibold uppercase tracking-widest hover:underline decoration-1 underline-offset-4">Menu</button>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-4 md:px-20 relative overflow-hidden">
        {/* Fondo decorativo abstracto */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-900 to-purple-900 rounded-full blur-[120px] opacity-20" />

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
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
          className="absolute bottom-12 right-12 flex gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
           <div className="w-24 h-[1px] bg-white/30" />
           <span className="uppercase text-xs tracking-widest text-neutral-400">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <div className="py-20 rotate-[-2deg] scale-110">
        <Marquee text="Machine Learning • Product Strategy • System Architecture • High End Frontend" />
      </div>

      {/* Content Section (Asimétrico) */}
      <section className="min-h-screen py-32 px-4 md:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 relative">
           <motion.div style={{ y }} className="aspect-[4/5] bg-neutral-900 relative overflow-hidden group">
              {/* Placeholder de imagen artística */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs uppercase tracking-widest mb-2">Selected Work</p>
                <h3 className={cn("text-4xl", playfair.className)}>Neural Interface V1</h3>
              </div>
           </motion.div>
        </div>
        
        <div className="md:col-span-5 flex flex-col gap-8 justify-center">
           <h2 className="text-5xl md:text-6xl font-bold leading-tight">
             Bridging the gap between <span className={cn("text-neutral-500 italic", playfair.className)}>human intuition</span> and artificial logic.
           </h2>
           <p className="text-neutral-400 text-lg leading-relaxed">
             I don't just build systems; I craft experiences where data feels alive. My work sits at the intersection of rigorous backend engineering and fluid, emotional design.
           </p>
           <button className="flex items-center gap-2 text-xl font-bold group w-fit">
             See Case Studies 
             <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </section>

      {/* Footer Big Typography */}
      <footer className="h-[50vh] flex flex-col justify-end px-4 md:px-20 pb-20 border-t border-white/10">
        <h2 className="text-[12vw] leading-none font-black text-white/10 hover:text-white/30 transition-colors cursor-pointer text-center">
          LET'S TALK
        </h2>
      </footer>

    </div>
  );
}
