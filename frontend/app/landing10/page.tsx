"use client";

import React, { useEffect, useState } from "react";
import { Noto_Serif_JP, Shippori_Mincho } from "next/font/google";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Fuentes Japonesas Premium ---
const noto = Noto_Serif_JP({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600"] });
const mincho = Shippori_Mincho({ subsets: ["latin"], weight: ["400", "500", "600", "800"] });

// --- Textura Washi (Papel de Arroz) ---
const WashiTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#fcfbf9]">
    <div className="absolute inset-0 opacity-40 mix-blend-multiply" 
         style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }} />
    {/* Ruido sutil extra */}
    <div className="absolute inset-0 opacity-[0.03]"
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
  </div>
);

// --- Sello Rojo (Hanko) ---
const Hanko = ({ className }: { className?: string }) => (
  <div className={cn("relative min-w-[40px] min-h-[40px] px-2 py-1 border border-red-800 rounded-sm flex items-center justify-center opacity-80 mix-blend-multiply", className)}>
    <div className="absolute inset-0 border-[2px] border-red-800 rounded-sm blur-[0.5px]" />
    <span className={cn("text-red-800 text-lg font-bold writing-vertical-rl tracking-tighter leading-none", noto.className)}>
      KEVIN
    </span>
  </div>
);

// --- Vertical Text Component ---
const VerticalText = ({ children, className }: { children: string, className?: string }) => (
  <div className={cn("writing-vertical-rl text-orientation-upright tracking-[0.5em] select-none", noto.className, className)}>
    {children}
  </div>
);

// --- Ink Brush Stroke (SVG) ---
const InkStroke = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 20" className={cn("w-32 h-4 opacity-80", className)}>
    <path d="M0,10 Q50,0 100,10 T200,10" fill="none" stroke="#2d2a26" strokeWidth="2" strokeLinecap="round" 
          style={{ filter: "url(#ink-filter)" }} />
    <defs>
      <filter id="ink-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" />
        <feDisplacementMap in="SourceGraphic" scale="2" />
      </filter>
    </defs>
  </svg>
);

export default function Landing10() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={cn("min-h-screen text-[#2d2a26] overflow-x-hidden selection:bg-[#2d2a26] selection:text-[#fcfbf9]", mincho.className)}>
      <WashiTexture />

      {/* --- SIDE NAVIGATION (Vertical) --- */}
      <nav className="fixed top-0 left-0 h-full w-24 hidden md:flex flex-col items-center py-12 z-50 border-r border-[#2d2a26]/5">
        <Hanko className="mb-auto" />
        <div className="flex flex-col gap-12 text-xs font-medium tracking-widest text-[#2d2a26]/60 writing-vertical-rl">
            <a href="#" className="hover:text-[#2d2a26] transition-colors hover:opacity-100">Contact</a>
            <a href="#" className="hover:text-[#2d2a26] transition-colors hover:opacity-100">Works</a>
            <a href="#" className="hover:text-[#2d2a26] transition-colors hover:opacity-100">Philosophy</a>
        </div>
      </nav>

      <main className="md:pl-32 pr-6 md:pr-20 py-24 md:py-32">
        
        {/* --- HERO SECTION (Asymmetric) --- */}
        <section className="min-h-[80vh] relative grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Main Title Area */}
            <div className="md:col-span-8 flex flex-col justify-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-[#2d2a26]/60 mb-6">System Engineer</p>
                    <h1 className={cn("text-5xl md:text-8xl font-light leading-[1.1] mb-8", noto.className)}>
                        Silence in <br/>
                        <span className="italic font-serif">Complexity</span>
                    </h1>
                    <p className="max-w-md text-lg leading-loose text-[#2d2a26]/80 font-light">
                        Building digital architectures that flow like water. 
                        Scalable, resilient, and inherently calm.
                    </p>
                </motion.div>
            </div>

            {/* Decorative Kanji & Image */}
            <div className="md:col-span-4 relative flex justify-center md:justify-end">
                <motion.div style={{ y: y1 }} className="relative">
                    {/* Kanji Gigante de Fondo */}
                    <VerticalText className="absolute -top-20 -right-10 text-[200px] md:text-[300px] text-[#2d2a26]/5 leading-none pointer-events-none">
                        無
                    </VerticalText>
                    {/* Imagen abstracta zen */}
                    <div className="w-64 h-96 bg-[#e5e4e0] relative overflow-hidden rounded-sm shadow-xl shadow-[#2d2a26]/10">
                        <div className="absolute inset-0 opacity-60 mix-blend-multiply grayscale contrast-125"
                             style={{ backgroundImage: `url("https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop")`, backgroundSize: 'cover' }} />
                    </div>
                </motion.div>
            </div>
        </section>

        {/* --- VALUES / EXPERTISE --- */}
        <section className="py-32 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 border-t border-[#2d2a26]/10">
            {[
                { kanji: "構", title: "Structure", desc: "Robust backend foundations." },
                { kanji: "流", title: "Flow", desc: "Seamless data integration." },
                { kanji: "美", title: "Beauty", desc: "Code elegance & clarity." }
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 1 }}
                    className="flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 border border-[#2d2a26]/20 rounded-full flex items-center justify-center mb-6 text-3xl font-serif">
                        {item.kanji}
                    </div>
                    <h3 className="text-xl font-medium mb-3 tracking-wide">{item.title}</h3>
                    <p className="text-sm text-[#2d2a26]/60 max-w-[200px]">{item.desc}</p>
                    <InkStroke className="mt-6 w-16" />
                </motion.div>
            ))}
        </section>

        {/* --- MINIMAL WORKCASE --- */}
        <section className="py-32 flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <motion.div style={{ y: y2 }} className="flex-1 order-2 md:order-1">
                 <div className="aspect-[4/5] w-full max-w-md bg-[#2d2a26] relative p-8 flex flex-col justify-between text-[#fcfbf9]">
                     <div className="text-xs uppercase tracking-widest opacity-50">Selected Work</div>
                     <div>
                         <h2 className={cn("text-4xl mb-4", noto.className)}>Neural Garden</h2>
                         <p className="text-sm opacity-70 leading-relaxed mb-8">
                             An AI-powered ecosystem monitoring tool. Visualizing growth patterns through generative algorithms.
                         </p>
                         <button className="border border-[#fcfbf9]/30 px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#fcfbf9] hover:text-[#2d2a26] transition-colors">
                             Enter Garden
                         </button>
                     </div>
                 </div>
            </motion.div>
            
            <div className="flex-1 order-1 md:order-2">
                <h2 className={cn("text-5xl md:text-7xl mb-8", noto.className)}>
                    Nature <br/> & Code
                </h2>
                <p className="text-lg text-[#2d2a26]/70 max-w-sm leading-relaxed">
                    True engineering disappears into the background, leaving only the essential utility and experience.
                </p>
            </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="mt-20 pt-12 border-t border-[#2d2a26]/10 flex justify-between items-center text-xs text-[#2d2a26]/40 uppercase tracking-widest">
            <span>Kevin Narvaez © 2026</span>
            <span className="hidden md:inline">Tokyo / Global</span>
            <span>Est. 2026</span>
        </footer>

      </main>
    </div>
  );
}