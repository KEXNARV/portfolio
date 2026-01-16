"use client";

import React from "react";
import { Manrope, Space_Mono } from "next/font/google";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Network, Layers, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Fuentes ---
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// --- Componentes UI Locales ---

// Efecto de Ruido (Film Grain)
const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// Botón Industrial
const IndustrialButton = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <button
    className={cn(
      "group relative px-6 py-3 bg-transparent border border-neutral-700 text-neutral-100 uppercase tracking-widest text-xs font-bold hover:bg-[#FF3B30] hover:border-[#FF3B30] hover:text-white transition-all duration-300 overflow-hidden",
      spaceMono.className,
      className
    )}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

// Tarjeta Bento Grid
const BentoCard = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  className,
  delay = 0 
}: { 
  title: string; 
  subtitle: string; 
  icon: any; 
  className?: string;
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "relative p-8 border border-neutral-800 bg-[#0a0a0a] hover:border-neutral-600 transition-colors duration-300 flex flex-col justify-between group h-full", 
      className
    )}
  >
    <div className="absolute top-4 right-4 text-neutral-700 group-hover:text-[#FF3B30] transition-colors">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div className="mt-auto">
      <p className={cn("text-xs text-neutral-500 mb-2 uppercase tracking-wider", spaceMono.className)}>
        {subtitle}
      </p>
      <h3 className={cn("text-2xl font-bold text-neutral-200 group-hover:text-white", manrope.className)}>
        {title}
      </h3>
    </div>
  </motion.div>
);

export default function Landing1() {
  return (
    <div className={cn("min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#FF3B30] selection:text-white overflow-x-hidden", manrope.className)}>
      <NoiseOverlay />

      {/* --- Navegación Industrial --- */}
      <nav className="fixed top-0 w-full z-40 border-b border-neutral-900 bg-[#050505]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className={cn("text-sm font-bold tracking-tighter flex items-center gap-2", spaceMono.className)}>
            <div className="w-2 h-2 bg-[#FF3B30]" />
            K.NARVAEZ / SYS.ENG
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-500 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Index</span>
            <span className="hover:text-white cursor-pointer transition-colors">Systems</span>
            <span className="hover:text-white cursor-pointer transition-colors">Intelligence</span>
            <span className="text-[#FF3B30]">v1.0.0</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 container mx-auto px-6">
        
        {/* --- Hero Section --- */}
        <section className="mb-32 relative">
          {/* Líneas de grid decorativas */}
          <div className="absolute top-0 left-0 w-full h-full border-l border-r border-neutral-900 pointer-events-none opacity-50" />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={cn("flex flex-col md:flex-row items-baseline gap-4 mb-4 text-[#FF3B30] text-sm uppercase tracking-widest", spaceMono.className)}>
              <span>// Neural Architect</span>
              <span className="w-12 h-[1px] bg-[#FF3B30]" />
              <span>System Status: Online</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-[0.9] mb-8 text-neutral-100">
              BUILDING <br />
              <span className="text-neutral-600">THE DIGITAL</span> <br />
              CORTEX.
            </h1>
            
            <p className="max-w-xl text-lg md:text-xl text-neutral-400 leading-relaxed mb-12">
              AI Product System Engineer specializing in bridging high-dimensional models with scalable, production-grade infrastructure.
            </p>

            <div className="flex flex-wrap gap-4">
              <IndustrialButton>
                View Architecture <ArrowUpRight size={16} />
              </IndustrialButton>
              <IndustrialButton className="border-transparent hover:bg-neutral-900 hover:border-neutral-800">
                Contact Protocol
              </IndustrialButton>
            </div>
          </motion.div>
        </section>

        {/* --- Bento Grid / Stats Section --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-auto md:h-[500px]">
          {/* Main Focus */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
            <BentoCard 
              title="Large Scale Model Deployment" 
              subtitle="Core Competency"
              icon={Cpu}
              className="bg-neutral-900/20"
              delay={0.1}
            />
          </div>
          
          {/* Tech Stack 1 */}
          <div className="col-span-1 row-span-1">
             <BentoCard 
              title="Neural Networks" 
              subtitle="Deep Learning"
              icon={Network}
              delay={0.2}
            />
          </div>

          {/* Tech Stack 2 */}
          <div className="col-span-1 row-span-1">
             <BentoCard 
              title="System Design" 
              subtitle="Architecture"
              icon={Layers}
              delay={0.3}
            />
          </div>

          {/* Stats / CLI */}
          <div className="col-span-1 md:col-span-2 row-span-1 bg-[#111] border border-neutral-800 p-6 font-mono text-xs text-green-500 flex flex-col">
             <div className="flex items-center justify-between text-neutral-500 mb-4 border-b border-neutral-800 pb-2">
                <span>TERMINAL_OUTPUT</span>
                <Terminal size={14} />
             </div>
             <div className="flex-1 overflow-hidden opacity-70 space-y-1">
               <p>{`> Initializing neural_bridge...`}</p>
               <p>{`> Loading weights [##########] 100%`}</p>
               <p>{`> Connection established: 5433ms`}</p>
               <p className="text-white animate-pulse">{`> Awaiting input_`}</p>
             </div>
          </div>
        </section>

        {/* --- Footer Minimal --- */}
        <footer className="mt-32 border-t border-neutral-900 pt-8 flex justify-between items-end text-neutral-600">
          <div className="flex flex-col gap-1">
             <span className={spaceMono.className}>© 2026 Kevin Narvaez</span>
             <span className="text-xs">Based in [Location]</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold opacity-10 tracking-tighter">KN.AI</h2>
        </footer>

      </main>
    </div>
  );
}
