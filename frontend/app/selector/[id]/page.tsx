"use client";

import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Info, Code, Cpu, Layers, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Inter, Manrope, Space_Mono, Playfair_Display, JetBrains_Mono, DotGothic16, Source_Serif_4, Orbitron, Share_Tech_Mono, Noto_Serif_JP } from "next/font/google";
import { IndustrialReactor } from "@/components/IndustrialReactor";

// --- Fuentes ---
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

// --- DETAILS LAYOUTS ---

const TechDetails = ({ theme, onEnter }: { theme: any, onEnter: () => void }) => (
  <div className="w-full h-full p-8 md:p-12 lg:p-20 flex flex-col justify-center relative overflow-hidden border border-current">
    {/* Absolute Labels */}
    <div className="absolute top-6 left-8 text-[10px] font-mono opacity-40 uppercase tracking-[0.2em]">System_Manifest // ID: {theme.id}</div>
    <div className="absolute top-6 right-8 text-[10px] font-mono opacity-40 uppercase tracking-[0.2em]">Revision: 2.0.4</div>
    <div className="absolute bottom-6 left-8 text-[10px] font-mono opacity-40 uppercase tracking-[0.2em]">Status: Core_Ready</div>
    
    {/* Grid Background */}
    <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

    <div className="max-w-6xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
            <h1 className={cn("text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]", theme.fontMain)}>{theme.name}</h1>
            <div className="h-[1px] w-full bg-current opacity-20 mb-8" />
            <p className="text-lg md:text-xl opacity-70 font-mono leading-relaxed max-w-xl">{theme.philosophy}</p>
        </div>
        <div className="space-y-10 font-mono text-sm bg-black/20 backdrop-blur-sm p-8 border border-current/10">
            <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold opacity-40 text-[10px] uppercase tracking-widest">
                    <Fingerprint size={14} /> Tech_Stack
                </div>
                <div className="text-base">{theme.stack}</div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold opacity-40 text-[10px] uppercase tracking-widest">
                    <Layers size={14} /> Inspiration_Source
                </div>
                <div className="text-base">{theme.inspiration}</div>
            </div>
            <button 
                onClick={onEnter}
                className="w-full py-5 border-2 border-current text-current hover:bg-[#00ff00] hover:border-[#00ff00] hover:text-black transition-all uppercase font-black tracking-[0.3em] flex items-center justify-center gap-3 mt-4 group"
            >
                [ Initialize_System ]
            </button>
        </div>
    </div>
  </div>
);

const ArtisticDetails = ({ theme, onEnter }: { theme: any, onEnter: () => void }) => (
  <div className="w-full h-full p-8 flex items-center justify-center relative overflow-hidden">
    {/* Ambient Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
    
    <div className="relative z-10 text-center max-w-3xl">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={cn("text-7xl md:text-9xl font-light tracking-tight mb-8 mix-blend-overlay", theme.fontMain)}
        >
            {theme.name}
        </motion.h1>
        <p className="text-xl md:text-2xl font-light opacity-80 mb-12 leading-relaxed">{theme.philosophy}</p>
        
        <div className="grid grid-cols-2 gap-8 text-sm opacity-60 mb-12 max-w-lg mx-auto text-left">
            <div>
                <span className="block uppercase tracking-widest text-[10px] mb-2 opacity-50">Stack</span>
                {theme.stack}
            </div>
            <div>
                <span className="block uppercase tracking-widest text-[10px] mb-2 opacity-50">Inspiration</span>
                {theme.inspiration}
            </div>
        </div>

        <button 
            onClick={onEnter}
            className="px-12 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-sm uppercase tracking-[0.2em]"
        >
            Enter Experience
        </button>
    </div>
  </div>
);

const EditorialDetails = ({ theme, onEnter }: { theme: any, onEnter: () => void }) => (
  <div className="w-full h-full p-8 md:p-16 flex flex-col items-center justify-center relative bg-[#fafaf9] text-[#1c1917]">
    <div className="max-w-2xl text-center border-y border-[#1c1917] py-12">
        <div className="text-xs uppercase tracking-[0.3em] mb-6 opacity-50">Vol. 1 — The Portfolio</div>
        <h1 className={cn("text-6xl md:text-8xl mb-8 leading-none", theme.fontMain)}>{theme.name}</h1>
        <p className={cn("text-lg italic font-serif opacity-80 leading-relaxed", sourceSerif.className)}>
            "{theme.philosophy}"
        </p>
    </div>
    
    <div className="mt-12 flex flex-col items-center gap-8">
        <div className="flex gap-12 text-xs uppercase tracking-widest opacity-60">
            <div>Stack: {theme.stack}</div>
            <div>Ref: {theme.inspiration}</div>
        </div>
        <button 
            onClick={onEnter}
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#C41E3A] transition-colors"
        >
            Read Edition <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
    </div>
  </div>
);

const RetroDetails = ({ theme, onEnter }: { theme: any, onEnter: () => void }) => (
  <div className="w-full h-full p-8 flex flex-col justify-center items-center relative overflow-hidden bg-black text-[#00ff00]">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00ff00_1px,transparent_1px)] bg-[length:20px_20px]" />
    
    <div className="border-4 border-current p-8 md:p-16 bg-black relative shadow-[8px_8px_0px_0px_rgba(0,255,0,0.5)]">
        <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-bold">SYSTEM_INFO</div>
        
        <h1 className={cn("text-5xl md:text-7xl font-bold mb-6 glitch-effect", theme.fontMain)}>{theme.name}</h1>
        
        <div className="font-mono text-sm space-y-4 mb-8 border-t border-dashed border-current pt-4">
            <div className="flex justify-between gap-8">
                <span>PHILOSOPHY:</span>
                <span className="text-right max-w-xs">{theme.philosophy}</span>
            </div>
            <div className="flex justify-between gap-8">
                <span>STACK:</span>
                <span className="text-right">{theme.stack}</span>
            </div>
        </div>

        <button 
            onClick={onEnter}
            className="w-full py-3 bg-current text-black font-bold uppercase hover:opacity-80 transition-opacity"
        >
            &gt; EXECUTE_
        </button>
    </div>
  </div>
);

// --- COMING SOON COMPONENT ---
const ComingSoonDetails = ({ theme, onEnter }: { theme: any, onEnter: () => void }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:20px_20px]" />
    <h1 className={cn("text-4xl md:text-6xl font-bold mb-4 opacity-50", theme.fontMain)}>{theme.name}</h1>
    <div className="px-4 py-2 border border-red-500/50 bg-red-500/10 text-red-500 rounded-full text-xs uppercase tracking-widest animate-pulse flex items-center gap-2">
      <div className="w-2 h-2 bg-red-500 rounded-full" />
      Access Restricted // Construction in Progress
    </div>
    <div className="mt-8 text-xs text-white/20 uppercase tracking-[0.2em]">
      System Locked
    </div>
  </div>
);

// --- LOADERS ---
const IndustrialLoader = () => (
  <div className="w-64">
    <div className="flex justify-between text-xs text-[#FF3B30] mb-2 font-mono uppercase tracking-widest">
      <span>System_Boot</span>
      <span>Processing...</span>
    </div>
    <div className="h-2 w-full bg-[#1a1a1a] border border-[#333]">
      <motion.div 
        initial={{ width: "0%" }} 
        animate={{ width: "100%" }} 
        transition={{ duration: 2, ease: "linear" }} 
        className="h-full bg-[#FF3B30] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </motion.div>
    </div>
  </div>
);

const VisionaryLoader = () => (
  <div className="text-center">
    <motion.h2 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={cn("text-4xl italic font-light mb-4 text-white mix-blend-difference", playfair.className)}
    >
      Vision
    </motion.h2>
    <div className="w-64 h-[1px] bg-white/20 mx-auto overflow-hidden">
      <motion.div 
        initial={{ x: "-100%" }} 
        animate={{ x: "0%" }} 
        transition={{ duration: 2, ease: "circOut" }} 
        className="w-full h-full bg-white"
      />
    </div>
  </div>
);

const BrutalistLoader = () => (
  <div className="border-4 border-black bg-[#FFFDF5] p-4 shadow-[8px_8px_0px_0px_black]">
    <div className={cn("text-xl font-black text-black mb-2 uppercase", jetbrains.className)}>
      LOADING ASSETS...
    </div>
    <div className="w-64 h-8 border-4 border-black p-1">
      <motion.div 
        initial={{ width: "0%" }} 
        animate={{ width: "100%" }} 
        transition={{ duration: 2, ease: "linear" }} 
        className="h-full bg-[#FF00FF]"
      />
    </div>
  </div>
);

const NothingLoader = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex gap-2">
      {[...Array(5)].map((_, i) => (
        <motion.div 
          key={i} 
          animate={{ opacity: [0.2, 1, 0.2] }} 
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }} 
          className="w-3 h-3 bg-[#D71921] rounded-full"
        />
      ))}
    </div>
    <span className={cn("text-xs tracking-[0.3em] uppercase text-[#D71921]", dotFont.className)}>
      ( Loading )
    </span>
  </div>
);

const AuroraLoader = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
      className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 blur-sm"
    />
    <motion.div 
      animate={{ rotate: -360 }} 
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
      className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500 blur-sm"
    />
    <span className="text-xs text-white tracking-widest animate-pulse">SYNC</span>
  </div>
);

const EtherealLoader = () => (
  <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl">
    <div className="w-12 h-12 border-2 border-cyan-200/30 rounded-full mx-auto mb-4 border-t-cyan-200 animate-spin" />
    <p className={cn("text-xs text-cyan-100 uppercase tracking-widest", inter.className)}>Materializing</p>
  </div>
);

const CyberSecLoader = () => (
  <div className="font-mono text-green-500 text-sm">
    <div>&gt; ESTABLISHING_LINK...</div>
    <div className="w-64 h-4 border border-green-500/50 mt-2 p-[2px]">
      <motion.div 
        initial={{ width: "0%" }} 
        animate={{ width: "100%" }} 
        transition={{ duration: 2 }} 
        className="h-full bg-green-500"
      />
    </div>
    <div className="mt-1 text-[10px] opacity-70">PACKETS: ENCRYPTED</div>
  </div>
);

const EditorialLoader = () => (
  <div className="text-center text-[#1c1917]">
    <div className={cn("text-3xl font-bold mb-2 italic", playfair.className)}>The Portfolio</div>
    <div className="w-12 h-[2px] bg-[#C41E3A] mx-auto mb-4" />
    <p className={cn("text-xs uppercase tracking-widest", sourceSerif.className)}>Printing Edition...</p>
  </div>
);

const BlueprintLoader = () => (
  <div className="relative w-64 h-32 border border-[#4a9eff] bg-[#0a1628] p-4 flex flex-col justify-center items-center">
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
    <span className={cn("text-[#4a9eff] text-lg animate-pulse", shareTech.className)}>RENDERING_DWG</span>
    <motion.div 
      initial={{ width: "0%" }} 
      animate={{ width: "100%" }} 
      transition={{ duration: 2 }} 
      className="h-[1px] bg-[#4a9eff] w-full mt-4"
    />
  </div>
);

const ZenLoader = () => (
  <div className="flex flex-col items-center">
    <motion.div 
      initial={{ scale: 0, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ duration: 1.5 }} 
      className="w-16 h-16 border border-stone-800 rounded-full flex items-center justify-center mb-4"
    >
      <span className={cn("text-2xl", notoSerif.className)}>禅</span>
    </motion.div>
    <motion.div 
      initial={{ width: 0 }} 
      animate={{ width: 100 }} 
      transition={{ duration: 2 }} 
      className="h-[1px] bg-stone-800"
    />
  </div>
);

// --- DATOS COMPLETOS DE TEMAS ---
const themes = [
  {
    id: "industrial",
    name: "INDUSTRIAL",
    description: "High-End Structure. Robust Engineering.",
    inspiration: "Dieter Rams, Braun Design, Server Rooms.",
    stack: "Next.js, Tailwind, Framer Motion",
    philosophy: "Function over form. The beauty lies in the raw utility and exposed structure.",
    path: "/landing1",
    style: "bg-[#0a0a0a] text-gray-200 border-gray-800",
    fontMain: manrope.className,
    Loader: IndustrialLoader,
    Details: IndustrialReactor, 
    locked: false,
    previewContent: (
      <div className="h-full flex flex-col justify-between p-6 border border-white/10 relative overflow-hidden"><div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div><div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF3B30]"><div className="w-2 h-2 bg-[#FF3B30]"></div>Sys.Online</div><div className="text-4xl font-extrabold tracking-tighter">NEURAL<br/>ARCHITECT</div><div className="text-[10px] font-mono opacity-50 border-t border-white/20 pt-2">&gt; EXECUTING PROTOCOL_V1</div></div>
    )
  },
  {
    id: "visionary",
    name: "VISIONARY",
    description: "Swiss Design. Fluid Motion.",
    inspiration: "Swiss Grid Systems, Kinetic Typography, Editorial Web.",
    stack: "WebGL, Lenis Scroll, Custom Easings",
    philosophy: "Motion conveys meaning. A design that breathes and reacts to human intent.",
    path: "/landing2",
    style: "bg-black text-white",
    fontMain: inter.className,
    Loader: VisionaryLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-900/40 to-purple-900/40 blur-xl"></div><h2 className={cn("text-5xl font-black italic relative z-10 mix-blend-overlay", playfair.className)}>Vision</h2><p className="text-xs uppercase tracking-[0.3em] mt-2 relative z-10">Kinetic</p></div>
    )
  },
  {
    id: "brutalist",
    name: "BRUTALIST",
    description: "Raw Data. Hard Shadows.",
    inspiration: "Neo-Brutalism, Print Design, HTML Raw.",
    stack: "CSS Grid, Hard Shadows, Monospace",
    philosophy: "Unapologetically bold. High contrast for high impact.",
    path: "/landing3",
    style: "bg-[#FFFDF5] text-black border-4 border-black",
    fontMain: jetbrains.className,
    Loader: BrutalistLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col justify-between p-4 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_black]"><div className="bg-black text-white text-xs px-2 py-1 w-fit font-bold">WARNING</div><div className="text-3xl font-black leading-none">SYSTEM<br/>OVERRIDE</div><div className="text-xs font-bold border-t-4 border-black pt-2">&gt; DEPLOY_NOW_</div></div>
    )
  },
  {
    id: "nothing",
    name: "NOTHING",
    description: "Transparent. Retro-Future.",
    inspiration: "Nothing OS, Teenage Engineering, Cassette Futurism.",
    stack: "Dot Matrix Fonts, Glass, Red Accents",
    philosophy: "Technology should be felt, not just seen. A tactile digital experience.",
    path: "/landing4",
    style: "bg-black text-[#D71921] border border-white/20",
    fontMain: dotFont.className,
    Loader: NothingLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden bg-[radial-gradient(#333_1px,transparent_1px)] bg-[length:10px_10px]"><div className="w-20 h-20 border-[6px] border-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.2)]"><div className="w-2 h-2 bg-[#D71921] rounded-full animate-pulse shadow-[0_0_10px_#D71921]"></div></div><div className={cn("text-xl uppercase tracking-widest text-white", dotFont.className)}>( Glyph )</div></div>
    )
  },
  {
    id: "aurora",
    name: "AURORA",
    description: "Spatial Computing. AI Magic.",
    inspiration: "Apple Intelligence, Siri UI, Bioluminescence.",
    stack: "CSS Filters, Blurs, Gradients",
    philosophy: "Intelligence is organic. It should glow, pulse, and feel alive.",
    path: "/landing5",
    style: "bg-[#030014] text-white border border-purple-500/30",
    fontMain: inter.className,
    Loader: AuroraLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent"></div><div className="w-32 h-32 bg-purple-600/30 rounded-full blur-2xl absolute top-1/2 animate-pulse"></div><div className="relative z-10 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-xs">Sentient</div></div>
    )
  },
  {
    id: "ethereal",
    name: "ETHEREAL",
    description: "Glassmorphism. Pure Light.",
    inspiration: "VisionOS, Frost, Light Refraction.",
    stack: "Backdrop Filter, Inner Shadows",
    philosophy: "Clarity through transparency. The interface disappears.",
    path: "/landing6",
    style: "bg-slate-950 text-white border border-white/10",
    fontMain: playfair.className,
    Loader: EtherealLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-xl"></div><div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl"><div className="text-3xl font-medium tracking-tight">Ethereal</div></div></div>
    )
  },
  {
    id: "cybersec",
    name: "CYBER SEC",
    description: "Matrix. Terminal. Hacking.",
    inspiration: "Mr. Robot, Linux Terminals, CLI.",
    stack: "Monospace, ASCII Art, Glitch Effects",
    philosophy: "Access granted. For those who speak the language of the machine.",
    path: "/landing7",
    style: "bg-black text-green-500 border border-green-500/30",
    fontMain: jetbrains.className,
    Loader: CyberSecLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col justify-between p-6 bg-black relative overflow-hidden font-mono"><div className="absolute inset-0 opacity-20 bg-[linear-gradient(0deg,transparent_24%,rgba(0,255,0,.3)_25%)] bg-[length:50px_50px]"></div><div className="text-xs text-green-500/50">SYSTEM_READY</div><div className="text-4xl font-bold text-green-500 glitch-effect">HACK<br/>THE<br/>PLANET</div></div>
    )
  },
  {
    id: "editorial",
    name: "EDITORIAL",
    description: "Newspaper. Classic Times.",
    inspiration: "New York Times, Monocle, Print Layouts.",
    stack: "Serif Fonts, Grid Systems, Typography",
    philosophy: "Content is king. Respecting the heritage of the written word.",
    path: "/landing8",
    style: "bg-[#FAFAF8] text-neutral-900 border border-neutral-300",
    fontMain: playfair.className,
    Loader: EditorialLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col p-6 bg-[#FAFAF8] relative overflow-hidden text-neutral-900"><div className="border-b-2 border-neutral-900 pb-2 mb-4 flex justify-between text-[8px] uppercase tracking-widest"><span>Vol. 1</span><span>2026</span></div><div className={cn("text-4xl font-bold leading-none mb-4", playfair.className)}>The<br/>Portfolio<br/>Times</div></div>
    )
  },
  {
    id: "blueprint",
    name: "BLUEPRINT",
    description: "Technical Drawing. Engineering Plan.",
    inspiration: "CAD Software, Blueprints, Schematics.",
    stack: "SVG, Vector Lines, Monospace",
    philosophy: "Precision engineering. Nothing hidden, everything measured.",
    path: "/landing9",
    style: "bg-[#0a1628] text-[#4a9eff] border border-[#4a9eff]",
    fontMain: shareTech.className,
    Loader: BlueprintLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col p-4 bg-[#0a1628] relative overflow-hidden border border-[#4a9eff]"><div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#4a9eff 1px, transparent 1px), linear-gradient(90deg, #4a9eff 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div><div className="flex justify-between items-start mb-4"><div className="w-6 h-6 border border-[#4a9eff] rounded-full flex items-center justify-center text-[8px]">A</div><div className="text-[10px] text-white">REV 2.0</div></div><div className={cn("text-2xl font-bold text-white uppercase leading-none mt-10", shareTech.className)}>System<br/>Layout</div></div>
    )
  },
  {
    id: "zen",
    name: "ZEN",
    description: "Japanese Minimal. Quiet Essence.",
    inspiration: "Wabi-Sabi, Traditional Ink, Negative Space.",
    stack: "Paper Textures, Vertical Text, SVG Filters",
    philosophy: "Silence is the most powerful sound. Simplicity is the ultimate sophistication.",
    path: "/landing10",
    style: "bg-[#fafaf9] text-stone-800 border border-stone-200",
    fontMain: notoSerif.className,
    Loader: ZenLoader,
    Details: ComingSoonDetails,
    locked: true,
    previewContent: (
      <div className="h-full flex flex-col justify-center items-center p-6 bg-[#fafaf9] relative overflow-hidden"><div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[150px] font-bold select-none">静</div><div className="w-20 h-20 border border-stone-300 rounded-full flex items-center justify-center mb-6 relative"><span className={cn("text-stone-800 text-xl", notoSerif.className)}>禅</span></div></div>
    )
  }
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 20 : -20,
    zIndex: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 20 : -20
  })
};

type ViewState = 'carousel' | 'loading' | 'info';

export default function ThemeSelector({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const initialThemeIndex = themes.findIndex(t => t.id === unwrappedParams.id);
  
  const [currentIndex, setCurrentIndex] = useState(initialThemeIndex !== -1 ? initialThemeIndex : 0);
  const [direction, setDirection] = useState(0);
  const [viewState, setViewState] = useState<ViewState>('carousel');

  const currentTheme = themes[currentIndex];

  useEffect(() => {
    if (viewState === 'carousel') {
      const newPath = `/selector/${currentTheme.id}`;
      window.history.replaceState(null, '', newPath);
    }
  }, [currentIndex, viewState, currentTheme.id]);

  const nextTheme = () => {
    if (viewState !== 'carousel') return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % themes.length);
  };

  const prevTheme = () => {
    if (viewState !== 'carousel') return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + themes.length) % themes.length);
  };

  const handleEnter = () => {
    // Validar bloqueo usando el índice actual directamente del array themes
    if (themes[currentIndex].locked) return;

    if (viewState === 'carousel') {
      setViewState('loading');
      setTimeout(() => {
        setViewState('info');
      }, 2200);
    } else if (viewState === 'info') {
      router.push(currentTheme.path);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextTheme();
      if (e.key === "ArrowLeft") prevTheme();
      if (e.key === "Enter") handleEnter();
      if (e.key === "Escape" && viewState === 'info') setViewState('carousel');
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, viewState]); 

  const ActiveLoader = currentTheme.Loader;
  const ActiveDetails = currentTheme.Details || TechDetails; // Fallback

  return (
    <div className={cn("min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden selection:bg-white/20", inter.className)}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/50 via-neutral-950 to-neutral-950 pointer-events-none" />
      
      {/* Header */}
      <header className="absolute top-8 left-0 right-0 z-10 flex flex-col items-center gap-2 text-center pointer-events-none">
        <motion.div animate={{ opacity: viewState === 'carousel' ? 1 : 0 }}>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kevin Narvaez</h1>
            <p className="text-sm text-white/60 tracking-wider font-light">AI Product System Engineer</p>
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent my-2 mx-auto" />
            <span className="text-[10px] uppercase tracking-[0.5em] opacity-50">Select Interface</span>
        </motion.div>
      </header>

      {/* --- CAROUSEL --- */}
      <AnimatePresence>
        {viewState === 'carousel' && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }} transition={{ duration: 0.8 }}
                className="relative w-full max-w-5xl h-[500px] flex items-center justify-center perspective-[1000px]"
            >
                {/* Navigation Buttons */}
                <button onClick={prevTheme} className="absolute left-4 md:left-10 z-20 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:scale-110 cursor-pointer">
                    <ArrowLeft size={24} />
                </button>
                <button onClick={nextTheme} className="absolute right-4 md:right-10 z-20 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:scale-110 cursor-pointer">
                    <ArrowRight size={24} />
                </button>

                {/* Cards */}
                <div className="relative w-[300px] md:w-[400px] h-[500px] flex items-center justify-center">
                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={cn("absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-pointer ring-1 ring-white/10", currentTheme.style)}
                            onClick={handleEnter}
                        >
                            <div className={cn("w-full h-full", currentTheme.fontMain)}>{currentTheme.previewContent}</div>
                            {/* LOCKED OVERLAY */}
                            {currentTheme.locked && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
                                    <div className="border border-white/20 bg-black/80 px-4 py-2 text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Locked
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent pt-20">
                                <h3 className={cn("text-2xl font-bold mb-1 text-white", currentTheme.fontMain)}>{currentTheme.name}</h3>
                                <p className="text-xs text-gray-300 opacity-80">{currentTheme.description}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- LOADING OVERLAY --- */}
      <AnimatePresence>
        {viewState === 'loading' && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={cn("fixed inset-0 z-50 flex items-center justify-center", currentTheme.style)}
            >
                <ActiveLoader />
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- DETAILS OVERLAY (CUSTOMIZED) --- */}
      <AnimatePresence>
        {viewState === 'info' && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className={cn("fixed inset-0 z-50 flex items-center justify-center", currentTheme.style)}
            >
                <ActiveDetails theme={currentTheme} onEnter={handleEnter} />
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTROLS --- */}
      {viewState === 'carousel' && (
          <div className="mt-12 flex flex-col items-center gap-6 z-10">
            <div className="flex gap-3">
                {themes.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
                        className={cn("w-2 h-2 rounded-full transition-all duration-300", idx === currentIndex ? "bg-white w-8" : "bg-white/20 hover:bg-white/40")}
                    />
                ))}
            </div>
            <motion.button
                onClick={handleEnter}
                disabled={currentTheme.locked}
                whileHover={!currentTheme.locked ? { scale: 1.05 } : {}}
                whileTap={!currentTheme.locked ? { scale: 0.95 } : {}}
                className={cn(
                    "group relative px-8 py-4 rounded-full font-bold tracking-wider uppercase overflow-hidden transition-all",
                    currentTheme.locked ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-white text-black"
                )}
            >
                <span className="relative z-10 flex items-center gap-2">
                   {currentTheme.locked ? "Restricted" : "Initialize Interface"} 
                   {!currentTheme.locked && <ExternalLink size={16} />}
                </span>
                {!currentTheme.locked && <div className="absolute inset-0 bg-neutral-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />}
            </motion.button>
          </div>
      )}

    </div>
  );
}