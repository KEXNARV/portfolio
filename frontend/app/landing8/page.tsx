"use client";

import React, { useEffect, useState } from "react";
import { Playfair_Display, Source_Serif_4, Inter } from "next/font/google";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// --- Fuentes ---
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "900"] 
});
const sourceSerif = Source_Serif_4({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

// --- Componentes Editoriales ---

const Separator = ({ className = "" }: { className?: string }) => (
  <div className={cn("w-full h-[1px] bg-neutral-900", className)} />
);

const VerticalSeparator = ({ className = "" }: { className?: string }) => (
  <div className={cn("w-[1px] h-full bg-neutral-900 absolute top-0 bottom-0", className)} />
);

const SectionLabel = ({ children }: { children: string }) => (
  <div className={cn("flex items-center gap-3 mb-6", inter.className)}>
    <div className="w-2 h-2 bg-[#ef4444]" />
    <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{children}</span>
  </div>
);

const Article = ({ 
  title, 
  category, 
  children, 
  delay = 0 
}: { 
  title: string; 
  category: string; 
  children: React.ReactNode; 
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="flex flex-col h-full"
  >
    <div className={cn("text-[10px] font-bold uppercase tracking-widest text-[#ef4444] mb-2", inter.className)}>
      {category}
    </div>
    <h3 className={cn("text-2xl md:text-3xl font-bold leading-tight mb-4", playfair.className)}>
      {title}
    </h3>
    <div className={cn("text-neutral-600 text-base leading-relaxed font-light", sourceSerif.className)}>
      {children}
    </div>
  </motion.div>
);

const BigStat = ({ label, value }: { label: string; value: string }) => (
  <div className="py-6 border-b border-neutral-200 last:border-0">
    <div className={cn("text-4xl md:text-6xl font-black text-neutral-900 mb-1", playfair.className)}>
      {value}
    </div>
    <div className={cn("text-xs uppercase tracking-widest text-neutral-500", inter.className)}>
      {label}
    </div>
  </div>
);

export default function Landing8() {
  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setMounted(true);
    setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("min-h-screen bg-[#FDFBF7] text-[#1c1917] selection:bg-[#ef4444] selection:text-white pb-20")}>
      
      {/* --- MASTHEAD --- */}
      <header className="px-6 md:px-12 pt-8 pb-8 border-b-4 border-neutral-900">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-neutral-900 pb-2 mb-2">
            <div className={cn("text-xs uppercase tracking-widest font-bold", inter.className)}>
                Vol. 1 — No. 24
            </div>
            <div className={cn("text-xs uppercase tracking-widest font-bold hidden md:block", inter.className)}>
                {dateStr}
            </div>
            <div className={cn("text-xs uppercase tracking-widest font-bold", inter.className)}>
                Global Edition
            </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center py-8 md:py-12"
        >
            <h1 className={cn("text-6xl md:text-9xl font-black tracking-tight leading-none mb-4", playfair.className)}>
                The Portfolio
            </h1>
            <div className="flex items-center justify-center gap-4">
                 <Separator className="flex-1 max-w-[100px] md:max-w-[200px]" />
                 <span className={cn("text-sm md:text-lg italic font-medium text-neutral-500", playfair.className)}>
                     "Engineering the Future of Intelligence"
                 </span>
                 <Separator className="flex-1 max-w-[100px] md:max-w-[200px]" />
            </div>
        </motion.div>
      </header>

      {/* --- MAIN GRID --- */}
      <main className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen border-b border-neutral-900">
        
        {/* LEFT COLUMN (Lead Story) */}
        <div className="lg:col-span-8 p-6 md:p-12 lg:border-r border-neutral-900 relative">
            
            <SectionLabel>Cover Story</SectionLabel>
            
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className={cn("text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8 italic", playfair.className)}
            >
                Architecting <br/>
                <span className="not-italic text-[#ef4444]">Sentience.</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12">
                 <div className={cn("text-lg md:text-xl font-medium leading-relaxed drop-cap", sourceSerif.className)}>
                    <span className={cn("float-left text-7xl leading-[0.7] mr-3 mt-[-4px] font-bold text-neutral-900", playfair.className)}>K</span>
                    evin Narvaez is not just building software; he is composing the digital nervous system of tomorrow. In a world saturated with data, his approach to AI System Engineering cuts through the noise with surgical precision. By bridging the gap between theoretical models and production-grade infrastructure, he transforms abstract algorithms into tangible, scalable reality.
                 </div>
                 <div className={cn("text-lg text-neutral-600 leading-relaxed font-light flex flex-col justify-between", sourceSerif.className)}>
                    <p>
                        "The code is just the medium," Narvaez explains from his digital studio. "The real art lies in the architecture—how the system breathes, scales, and adapts." This philosophy has driven his work across 50+ successful deployments, creating a legacy of reliability that stands at 99.9%.
                    </p>
                    <button className={cn("mt-8 group flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-[#ef4444] transition-colors", inter.className)}>
                        Read Full Bio <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
            </div>

            <div className="mt-16 border-t border-neutral-900 pt-8">
                 <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
                    alt="Abstract Tech" 
                    className="w-full h-[300px] object-cover grayscale contrast-125"
                 />
                 <p className={cn("mt-2 text-[10px] uppercase tracking-widest text-neutral-500", inter.className)}>
                    Fig 1.1 — Visualization of Neural Pathways in a distributed system.
                 </p>
            </div>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="lg:col-span-4 bg-[#F5F4F0]">
            
            {/* Stats Block */}
            <div className="p-8 border-b border-neutral-900">
                <SectionLabel>Market Data</SectionLabel>
                <div className="space-y-2">
                    <BigStat label="Successful Deploys" value="50+" />
                    <BigStat label="System Uptime" value="99.9%" />
                    <BigStat label="Years Active" value="05" />
                </div>
            </div>

            {/* Selected Works List */}
            <div className="p-8">
                <SectionLabel>Opinion & Analysis</SectionLabel>
                <div className="space-y-12">
                    <Article title="The Death of Monoliths" category="Architecture" delay={0.4}>
                        Why distributed microservices are the inevitable future of enterprise AI, and how to migrate without losing your mind.
                    </Article>
                    <Article title="Latency is the Mind-Killer" category="Performance" delay={0.5}>
                        Optimizing inference times in Large Language Models using quantization and edge computing strategies.
                    </Article>
                    <Article title="Designing for Humans" category="UX / UI" delay={0.6}>
                        Even the most complex backend needs a frontend that feels human. Exploring the psychology of interface design.
                    </Article>
                </div>
            </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="max-w-[1800px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="md:col-span-2">
            <h3 className={cn("text-3xl font-bold mb-4", playfair.className)}>Kevin Narvaez</h3>
            <p className={cn("text-neutral-500 max-w-sm", sourceSerif.className)}>
                System Engineer based in the cloud. Building the infrastructure for the next generation of intelligence.
            </p>
         </div>
         <div>
            <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-4", inter.className)}>Connect</h4>
            <ul className={cn("space-y-2 text-sm underline decoration-neutral-300 underline-offset-4", sourceSerif.className)}>
                <li><a href="#" className="hover:text-[#ef4444]">Email</a></li>
                <li><a href="#" className="hover:text-[#ef4444]">GitHub</a></li>
                <li><a href="#" className="hover:text-[#ef4444]">LinkedIn</a></li>
            </ul>
         </div>
         <div>
            <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-4", inter.className)}>Legal</h4>
            <p className={cn("text-xs text-neutral-400", inter.className)}>
                © 2026 The Portfolio Times.<br/>
                All rights reserved.
            </p>
         </div>
      </footer>
    </div>
  );
}