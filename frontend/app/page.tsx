"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Inter, Manrope, Space_Mono, Playfair_Display, JetBrains_Mono, DotGothic16, Source_Serif_4, Orbitron, Share_Tech_Mono, Noto_Serif_JP } from "next/font/google";

// --- Fuentes para las Previews ---
const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"] });
const dotFont = DotGothic16({ subsets: ["latin"], weight: ["400"] });
const sourceSerif = Source_Serif_4({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });
const shareTech = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });
const notoSerif = Noto_Serif_JP({ subsets: ["latin"], weight: ["400"] });

// --- Datos de los Temas ---
const themes = [
  {
    id: "landing1",
    name: "INDUSTRIAL",
    description: "High-End Structure. Robust Engineering.",
    path: "/landing1",
    style: "bg-[#0a0a0a] text-gray-200 border-gray-800",
    fontMain: manrope.className,
    fontSub: spaceMono.className,
    accent: "#FF3B30",
    previewContent: (
      <div className="h-full flex flex-col justify-between p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF3B30]">
          <div className="w-2 h-2 bg-[#FF3B30]"></div>
          Sys.Online
        </div>
        <div className="text-4xl font-extrabold tracking-tighter">
          NEURAL<br/>ARCHITECT
        </div>
        <div className="text-[10px] font-mono opacity-50 border-t border-white/20 pt-2">
          &gt; EXECUTING PROTOCOL_V1
        </div>
      </div>
    )
  },
  {
    id: "landing2",
    name: "VISIONARY",
    description: "Swiss Design. Fluid Motion.",
    path: "/landing2",
    style: "bg-black text-white",
    fontMain: inter.className,
    fontSub: playfair.className,
    accent: "#ffffff",
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-900/40 to-purple-900/40 blur-xl"></div>
        <h2 className={cn("text-5xl font-black italic relative z-10 mix-blend-overlay", playfair.className)}>
          Vision
        </h2>
        <p className="text-xs uppercase tracking-[0.3em] mt-2 relative z-10">
          Kinetic
        </p>
      </div>
    )
  },
  {
    id: "landing3",
    name: "BRUTALIST",
    description: "Raw Data. Hard Shadows.",
    path: "/landing3",
    style: "bg-[#FFFDF5] text-black border-4 border-black",
    fontMain: jetbrains.className,
    fontSub: jetbrains.className,
    accent: "#FF00FF",
    previewContent: (
      <div className="h-full flex flex-col justify-between p-4 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_black]">
        <div className="bg-black text-white text-xs px-2 py-1 w-fit font-bold">WARNING</div>
        <div className="text-3xl font-black leading-none">
          SYSTEM<br/>OVERRIDE
        </div>
        <div className="text-xs font-bold border-t-4 border-black pt-2">
          &gt; DEPLOY_NOW_
        </div>
      </div>
    )
  },
  {
    id: "landing4",
    name: "NOTHING",
    description: "Transparent. Retro-Future.",
    path: "/landing4",
    style: "bg-black text-[#D71921] border border-white/20",
    fontMain: dotFont.className,
    fontSub: inter.className,
    accent: "#D71921",
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden bg-[radial-gradient(#333_1px,transparent_1px)] bg-[length:10px_10px]">
        <div className="w-20 h-20 border-[6px] border-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
           <div className="w-2 h-2 bg-[#D71921] rounded-full animate-pulse shadow-[0_0_10px_#D71921]"></div>
        </div>
        <div className={cn("text-xl uppercase tracking-widest text-white", dotFont.className)}>
          ( Glyph )
        </div>
      </div>
    )
  },
  {
    id: "landing5",
    name: "AURORA",
    description: "Spatial Computing. AI Magic.",
    path: "/landing5",
    style: "bg-[#030014] text-white border border-purple-500/30",
    fontMain: inter.className,
    fontSub: inter.className,
    accent: "#A855F7",
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent"></div>
        <div className="w-32 h-32 bg-purple-600/30 rounded-full blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="relative z-10 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-xs">
          Sentient Intelligence
        </div>
      </div>
    )
  },
  {
    id: "landing6",
    name: "ETHEREAL",
    description: "Glassmorphism. Pure Light.",
    path: "/landing6",
    style: "bg-slate-950 text-white border border-white/10",
    fontMain: playfair.className,
    fontSub: inter.className,
    accent: "#22d3ee",
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-xl"></div>
        <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl">
           <div className="text-3xl font-medium tracking-tight">Ethereal</div>
           <div className="text-[10px] uppercase tracking-widest mt-2 opacity-60">Glass & Light</div>
        </div>
      </div>
    )
  },
  {
    id: "landing7",
    name: "CYBER SEC",
    description: "Matrix. Terminal. Hacking.",
    path: "/landing7",
    style: "bg-black text-green-500 border border-green-500/30",
    fontMain: jetbrains.className,
    fontSub: jetbrains.className,
    accent: "#22c55e",
    previewContent: (
      <div className="h-full flex flex-col justify-between p-6 bg-black relative overflow-hidden font-mono">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)", backgroundSize: "50px 50px" }}></div>
        <div className="text-xs text-green-500/50">SYSTEM_READY</div>
        <div className="text-4xl font-bold text-green-500 text-shadow-glow glitch-effect">
          HACK<br/>THE<br/>PLANET
        </div>
        <div className="text-xs border border-green-500 px-2 py-1 w-fit animate-pulse">
          &gt; ACCESS GRANTED
        </div>
      </div>
    )
  },
  {
    id: "landing8",
    name: "EDITORIAL",
    description: "Newspaper. Classic Times.",
    path: "/landing8",
    style: "bg-[#FAFAF8] text-neutral-900 border border-neutral-300",
    fontMain: playfair.className,
    fontSub: sourceSerif.className,
    accent: "#C41E3A",
    previewContent: (
      <div className="h-full flex flex-col p-6 bg-[#FAFAF8] relative overflow-hidden text-neutral-900">
        <div className="border-b-2 border-neutral-900 pb-2 mb-4 flex justify-between text-[8px] uppercase tracking-widest">
           <span>Vol. 1</span>
           <span>2026</span>
        </div>
        <div className={cn("text-4xl font-bold leading-none mb-4", playfair.className)}>
          The<br/>Portfolio<br/>Times
        </div>
        <div className="flex gap-2">
           <div className="flex-1 text-[8px] leading-relaxed text-justify opacity-60">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
           </div>
           <div className="w-1/3 bg-neutral-200 h-16 grayscale"></div>
        </div>
      </div>
    )
  },
  {
    id: "landing9",
    name: "BLUEPRINT",
    description: "Technical Drawing. Engineering Plan.",
    path: "/landing9",
    style: "bg-[#0a1628] text-[#4a9eff] border border-[#4a9eff]",
    fontMain: shareTech.className,
    fontSub: shareTech.className,
    accent: "#4a9eff",
    previewContent: (
      <div className="h-full flex flex-col p-4 bg-[#0a1628] relative overflow-hidden border border-[#4a9eff]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#4a9eff 1px, transparent 1px), linear-gradient(90deg, #4a9eff 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
        <div className="flex justify-between items-start mb-4">
           <div className="w-6 h-6 border border-[#4a9eff] rounded-full flex items-center justify-center text-[8px]">A</div>
           <div className="text-[10px] text-white">REV 2.0</div>
        </div>
        <div className={cn("text-2xl font-bold text-white uppercase leading-none mb-2", shareTech.className)}>
          System<br/>Layout
        </div>
        <div className="w-full h-[1px] bg-[#4a9eff] mb-4"></div>
        <div className="flex-1 border border-dashed border-[#4a9eff]/40"></div>
      </div>
    )
  },
  {
    id: "landing10",
    name: "ZEN",
    description: "Japanese Minimal. Quiet Essence.",
    path: "/landing10",
    style: "bg-[#fafaf9] text-stone-800 border border-stone-200",
    fontMain: notoSerif.className,
    fontSub: inter.className,
    accent: "#dc2626",
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 bg-[#fafaf9] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[150px] font-bold select-none">
          静
        </div>
        <div className="w-20 h-20 border border-stone-300 rounded-full flex items-center justify-center mb-6 relative">
           <div className="absolute inset-0 border-t border-stone-800 rounded-full rotate-45"></div>
           <span className={cn("text-stone-800 text-xl", notoSerif.className)}>禅</span>
        </div>
        <div className={cn("text-sm uppercase tracking-[0.4em] text-stone-400", inter.className)}>
          Simplicity
        </div>
        <div className="mt-8 w-8 h-[1px] bg-stone-300"></div>
      </div>
    )
  }
];

export default function ThemeLobby() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTheme = () => {
    setCurrentIndex((prev) => (prev + 1) % themes.length);
  };

  const prevTheme = () => {
    setCurrentIndex((prev) => (prev - 1 + themes.length) % themes.length);
  };

  const currentTheme = themes[currentIndex];

  return (
    <div className={cn("min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden selection:bg-white/20", inter.className)}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/50 via-neutral-950 to-neutral-950 pointer-events-none" />
      
      <header className="absolute top-8 text-center z-10 opacity-50">
        <h1 className="text-xs uppercase tracking-[0.5em] font-medium">System Interface Selector</h1>
      </header>

      {/* --- CAROUSEL --- */}
      <div className="relative w-full max-w-5xl h-[500px] flex items-center justify-center perspective-[1000px]">
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevTheme}
          className="absolute left-4 md:left-10 z-20 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={nextTheme}
          className="absolute right-4 md:right-10 z-20 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
        >
          <ArrowRight size={24} />
        </button>

        {/* Cards */}
        <div className="relative w-[300px] md:w-[400px] h-[500px] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.8, x: 100, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0, zIndex: 10 }}
                    exit={{ opacity: 0, scale: 0.8, x: -100, rotateY: 20, zIndex: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                        "absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-pointer ring-1 ring-white/10",
                        currentTheme.style
                    )}
                >
                    {/* Preview Content */}
                    <div className={cn("w-full h-full", currentTheme.fontMain)}>
                        {currentTheme.previewContent}
                    </div>

                    {/* Metadata Overlay */}
                    <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent pt-20">
                         <h3 className={cn("text-2xl font-bold mb-1 text-white", currentTheme.fontMain)}>{currentTheme.name}</h3>
                         <p className="text-xs text-gray-300 opacity-80">{currentTheme.description}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* --- CONTROLS --- */}
      <div className="mt-12 flex flex-col items-center gap-6 z-10">
         {/* Dots Indicator */}
         <div className="flex gap-3">
            {themes.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        idx === currentIndex ? "bg-white w-8" : "bg-white/20 hover:bg-white/40"
                    )}
                />
            ))}
         </div>

         {/* Launch Button */}
         <Link href={currentTheme.path}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold tracking-wider uppercase overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-2">
                   Initialize Interface <ExternalLink size={16} />
                </span>
                <div className="absolute inset-0 bg-neutral-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </motion.button>
         </Link>
      </div>

    </div>
  );
}
