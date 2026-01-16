"use client";

import React, { useEffect, useState } from "react";
import { Playfair_Display, Geist } from "next/font/google";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Code2, Brain, Layers, ArrowUpRight, Mail } from "lucide-react";

// --- Fuentes Refinadas ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"] });
const geist = Geist({ subsets: ["latin"] });

// --- Aurora Background (Más suave y orgánica) ---
const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#020617]">
      {/* Stars sutiles */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Aurora Layers con mezcla mejorada */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] top-[-20%] left-[-20%] rounded-full blur-[100px] opacity-30 mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(168,85,247,0.1) 60%, transparent 100%)" }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
       <motion.div
        className="absolute w-[60vw] h-[60vw] bottom-[-10%] right-[-10%] rounded-full blur-[120px] opacity-20 mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(99,102,241,0.1) 60%, transparent 100%)" }}
        animate={{ x: [0, -30, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// --- Glassmorphism Card (Refinada: Apple Vision Pro Style) ---
const GlassCard = ({
  children,
  className = "",
  delay = 0,
  hover = true
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
    className={cn(
      "relative backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-[32px] overflow-hidden",
      "shadow-[0_8px_32px_rgba(0,0,0,0.2)]", 
      // Borde interno brillante superior
      "before:absolute before:inset-0 before:rounded-[32px] before:p-[1px] before:bg-gradient-to-b before:from-white/[0.1] before:to-transparent before:content-[''] before:pointer-events-none",
      hover && "hover:bg-white/[0.04] transition-colors duration-500",
      className
    )}
  >
    {children}
  </motion.div>
);

const ServiceCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <GlassCard delay={delay} className="p-8 group h-full flex flex-col justify-between">
    <div>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/80 group-hover:text-cyan-200 group-hover:scale-110 transition-all duration-500">
        <Icon size={20} />
      </div>
      <h3 className={cn("text-xl text-white mb-3 font-medium tracking-wide", playfair.className)}>
        {title}
      </h3>
      <p className={cn("text-white/40 text-sm leading-relaxed font-light", geist.className)}>
        {description}
      </p>
    </div>
    <div className="mt-8 w-8 h-[1px] bg-white/20 group-hover:w-full group-hover:bg-cyan-500/50 transition-all duration-700" />
  </GlassCard>
);

export default function Landing6() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={cn("min-h-screen text-white selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden", geist.className)}>
      <AuroraBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="fixed top-0 w-full z-50 px-6 py-6 flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl">
            <span className={cn("text-sm font-semibold tracking-wide", playfair.className)}>KN.</span>
            <div className="flex gap-6 text-xs text-white/60 font-medium uppercase tracking-wider">
               <a href="#" className="hover:text-white transition-colors">Work</a>
               <a href="#" className="hover:text-white transition-colors">Lab</a>
               <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-48 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1.2 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-cyan-200/80 mb-8 backdrop-blur-sm"
            >
                <Sparkles size={10} /> Availability: Open
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className={cn("text-6xl md:text-8xl lg:text-9xl mb-8 leading-[0.9] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40", playfair.className)}
            >
                Ethereal <br/> <span className="italic font-light opacity-80">Logic</span>
            </motion.h1>

            <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.4, duration: 1 }}
                 className="text-lg md:text-xl text-white/40 max-w-xl mx-auto mb-16 font-light leading-relaxed"
            >
                AI Product System Engineer bridging the gap between <br className="hidden md:block"/>
                <span className="text-white/80">abstract intelligence</span> and <span className="text-white/80">human experience</span>.
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex flex-col items-center gap-2 opacity-30"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
            </motion.div>
        </div>

        {/* Services / Philosophy Grid */}
        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard 
                icon={Brain} 
                title="Neural Architecture" 
                description="Designing systems that think. Scalable inference pipelines and model optimization."
                delay={0.2}
            />
             <ServiceCard 
                icon={Layers} 
                title="System Design" 
                description="Robust backends capable of handling high-throughput data streams with minimal latency."
                delay={0.4}
            />
             <ServiceCard 
                icon={Code2} 
                title="Product Engineering" 
                description="Crafting the full lifecycle. From research prototype to production-grade application."
                delay={0.6}
            />
        </div>

        {/* Selected Work Preview */}
        <div className="max-w-4xl mx-auto mt-40 text-center">
            <h2 className={cn("text-3xl mb-12 font-medium italic", playfair.className)}>Selected Works</h2>
            <GlassCard className="aspect-video flex items-center justify-center group cursor-pointer" hover={false}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="text-center z-10">
                    <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Case Study 01</p>
                    <h3 className={cn("text-4xl md:text-5xl text-white group-hover:scale-105 transition-transform duration-700", playfair.className)}>Generative UI</h3>
                    <motion.button 
                        className="mt-8 px-6 py-2 rounded-full border border-white/20 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        whileHover={{ scale: 1.05 }}
                    >
                        Explore Project
                    </motion.button>
                </div>
            </GlassCard>
        </div>

        {/* Footer */}
        <footer className="mt-40 text-center border-t border-white/5 pt-12">
            <p className="text-xs text-white/20 uppercase tracking-widest">Designed in the Void</p>
        </footer>

      </main>
    </div>
  );
}