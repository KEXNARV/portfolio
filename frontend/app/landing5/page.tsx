"use client";

import React, { useState, useEffect, useRef } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { ArrowRight, Box, Cpu, Layers, Zap, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Configuración de Fuentes ---
const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"] });

// --- Componentes Avanzados ---

// 1. Hook para Efecto de Desencriptación de Texto
const useScramble = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < i) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      i += 1 / 3;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayText;
};

const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
  const scrambled = useScramble(text);
  return <span className={className}>{scrambled}</span>;
};

// 2. Fondo Aurora (Computational Sky)
const AuroraBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030014]">
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
    );
};

// 3. Spotlight Card (La luz sigue al mouse)
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-xl border border-white/10 bg-white/5 overflow-hidden group",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// --- Página Principal ---

export default function Landing5() {
  return (
    <div className={cn("min-h-screen text-white selection:bg-purple-500/30", sans.className)}>
      <AuroraBackground />

      {/* Navbar Flotante */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 flex items-center gap-6 text-xs font-medium text-neutral-300 shadow-2xl shadow-purple-900/20">
            <span className="text-white">K.N.</span>
            <div className="w-[1px] h-4 bg-white/20" />
            <a href="#" className="hover:text-white transition-colors">Stack</a>
            <a href="#" className="hover:text-white transition-colors">Work</a>
            <a href="#" className="hover:text-white transition-colors">Labs</a>
            <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors">
                Connect
            </button>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs mb-8"
            >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                System Operational v2.0
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                <ScrambleText text="Sentient Systems" />
            </h1>

            <p className={cn("max-w-xl text-lg text-neutral-400 mb-10 leading-relaxed", sans.className)}>
                AI Product System Engineer bridging the void between <span className="text-purple-300">abstract models</span> and <span className="text-blue-300">tangible utility</span>.
            </p>

            <div className="flex gap-4">
                <button className="group relative px-8 py-3 bg-white text-black rounded-lg font-semibold overflow-hidden">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-300 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                        Deploy Vision <ArrowRight size={16} />
                    </span>
                </button>
                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                    View Architecture
                </button>
            </div>
        </section>

        {/* Bento Grid Architecture */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
            
            {/* Main Feature */}
            <SpotlightCard className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between">
                <div>
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 mb-4">
                        <Cpu size={20} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Neural Backbone Design</h3>
                    <p className="text-neutral-400">Architecting high-throughput inference engines using NestJS and PyTorch. Optimized for micro-second latency.</p>
                </div>
                <div className={cn("text-xs text-neutral-500 mt-8", mono.className)}>
                    <div>&gt; IMPORTING TORCH.NN</div>
                    <div>&gt; OPTIMIZING CUDA KERNELS...</div>
                    <div className="text-green-400">&gt; READY</div>
                </div>
            </SpotlightCard>

            {/* Stat Card */}
            <SpotlightCard className="p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-400">
                    99.9%
                </div>
                <p className="text-sm text-neutral-500 mt-2 uppercase tracking-widest">Uptime Reliability</p>
            </SpotlightCard>

            {/* Tech Stack Mini */}
            <SpotlightCard className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <Globe size={20} className="text-blue-400"/>
                    <span className="text-xs text-neutral-500">GLOBAL</span>
                </div>
                <h4 className="font-semibold text-lg">Scalable Edge</h4>
                <p className="text-sm text-neutral-400 mt-2">Next.js deployed on global edge networks.</p>
            </SpotlightCard>

            {/* Security */}
            <SpotlightCard className="p-6 group-hover:bg-red-500/5 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <Lock size={20} className="text-emerald-400"/>
                    <span className="text-xs text-neutral-500">SECURE</span>
                </div>
                <h4 className="font-semibold text-lg">Enterprise Ready</h4>
                <p className="text-sm text-neutral-400 mt-2">Auth & RBAC baked into the core.</p>
            </SpotlightCard>

             {/* Footer Card */}
             <SpotlightCard className="md:col-span-3 p-8 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div>
                    <h3 className="text-xl font-bold">Let's build the future.</h3>
                    <p className="text-neutral-400">Available for select projects in Q2 2026.</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                    <ArrowRight />
                </div>
            </SpotlightCard>

        </section>

      </main>
    </div>
  );
}
