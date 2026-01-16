"use client";

import React, { useState, useEffect } from "react";
import { DotGothic16, Inter } from "next/font/google";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { Disc, Zap, Activity, Cpu } from "lucide-react";

// --- Fuentes ---
// La fuente Dot Matrix es la firma de "Nothing"
const dotFont = DotGothic16({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

// --- Componentes UI "Nothing" ---

// Patrón de Fondo (Dotted Grid)
const DottedBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
       style={{
         backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
         backgroundSize: "20px 20px"
       }}
  />
);

// El "Glyph" Central (Interfaz de luces)
const GlyphInterface = () => {
  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto mb-12">
      {/* Center Ring */}
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 border-[12px] border-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      />
      
      {/* Top Sector */}
      <motion.div 
         initial={{ rotate: -45 }}
         className="absolute top-0 right-0 w-1/2 h-1/2 border-t-[12px] border-r-[12px] border-white rounded-tr-full shadow-[0_0_15px_rgba(255,255,255,0.2)] origin-bottom-left"
      />

      {/* Red Indicator (Recording Light) */}
      <motion.div 
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute bottom-4 right-4 w-4 h-4 bg-[#D71921] rounded-full shadow-[0_0_10px_#D71921]"
      />
      
      {/* Bottom Stripe */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
             animate={{ x: ["-100%", "100%"] }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="w-full h-full bg-white blur-sm"
          />
      </div>
    </div>
  );
};

// Tarjeta Transparente
const NothingCard = ({ title, value, icon: Icon, delay = 0 }: { title: string, value: string, icon: any, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-neutral-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/30 transition-colors"
  >
    <div className="absolute top-4 right-4 text-neutral-500 group-hover:text-white transition-colors">
      <Icon size={20} />
    </div>
    <h3 className={cn("text-neutral-400 text-xs uppercase tracking-widest mb-1", inter.className)}>{title}</h3>
    <p className={cn("text-2xl md:text-3xl text-white", dotFont.className)}>{value}</p>
    
    {/* Glyph decorativo en hover */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
  </motion.div>
);

export default function Landing4() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D71921] selection:text-white overflow-hidden relative">
      <DottedBackground />

      {/* Header Status Bar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center text-xs md:text-sm text-neutral-400 mix-blend-difference">
        <div className={cn("flex gap-2 items-center", dotFont.className)}>
            <span className="text-[#D71921]">●</span> REC
            <span>{time}</span>
        </div>
        <div className={cn("tracking-widest uppercase", inter.className)}>
            Kevin Narvaez (1)
        </div>
        <div className="flex gap-4">
            <span>5G</span>
            <span>100%</span>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        
        {/* Sección Principal */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            
            <GlyphInterface />

            <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn("text-5xl md:text-8xl mb-6 uppercase tracking-tighter", dotFont.className)}
            >
                System Engineer
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn("max-w-md text-neutral-400 text-sm md:text-base leading-relaxed mb-10", inter.className)}
            >
                Transparent architecture. Raw intelligence. <br/>
                Creating the invisible connection between complex AI models and human experience.
            </motion.p>

            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn("bg-[#D71921] text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide shadow-[0_0_20px_rgba(215,25,33,0.4)] hover:shadow-[0_0_30px_rgba(215,25,33,0.6)] transition-shadow", inter.className)}
            >
                ( View_Projects )
            </motion.button>
        </section>

        {/* Grid de Información (Widgets) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
            <NothingCard 
                title="Current Role" 
                value="AI Architect" 
                icon={Cpu} 
                delay={0.3}
            />
            <NothingCard 
                title="Availability" 
                value="Open" 
                icon={Activity} 
                delay={0.4}
            />
             <div className="col-span-1 md:col-span-2 bg-[#1a1a1a] rounded-3xl p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="flex justify-between items-start z-10">
                     <span className={cn("text-xs text-neutral-500 uppercase", inter.className)}>Stack Loop</span>
                     <Disc className="animate-spin-slow text-neutral-600" size={20}/>
                </div>
                <div className={cn("text-xl md:text-2xl mt-4 z-10 text-neutral-300", dotFont.className)}>
                    Next.js -&gt; NestJS -&gt; PostgreSQL -&gt; PyTorch
                </div>
                {/* Red stripe decoration */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#D71921] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
             </div>
        </section>

        {/* Footer Marquee */}
        <footer className="mt-32 border-t border-dotted border-neutral-800 pt-8 text-center text-neutral-600 text-xs">
            <p className={dotFont.className}>NOTHING TO HIDE © 2026</p>
        </footer>

      </main>
    </div>
  );
}
