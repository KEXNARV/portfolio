"use client";

import React, { useEffect, useState } from "react";
import { Share_Tech_Mono, Inter } from "next/font/google";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Fuentes ---
const shareTech = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

// --- Componentes SVG para Blueprint ---

const CADGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <svg className="w-full h-full opacity-20">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4a9eff" strokeWidth="0.5"/>
        </pattern>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)"/>
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#4a9eff" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Fondo Azul Oscuro */}
    <div className="absolute inset-0 bg-[#0f172a] -z-10" />
  </div>
);

const MeasurementLine = ({ width }: { width: string }) => (
  <div className="flex flex-col items-center w-full">
    <div className="w-full h-[1px] bg-[#4a9eff] relative">
      <div className="absolute left-0 top-[-3px] h-[7px] w-[1px] bg-[#4a9eff]" />
      <div className="absolute right-0 top-[-3px] h-[7px] w-[1px] bg-[#4a9eff]" />
    </div>
    <span className={cn("text-[10px] text-[#4a9eff] mt-1 bg-[#0f172a] px-1", shareTech.className)}>{width}</span>
  </div>
);

const NodeBox = ({ title, subtitle, delay }: { title: string, subtitle?: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="relative group border border-[#4a9eff] bg-[#0f172a] p-4 min-w-[140px] text-center hover:bg-[#4a9eff]/10 transition-colors cursor-crosshair"
  >
    {/* Puntos de conexión */}
    <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-[#0f172a] border border-[#4a9eff]" />
    <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-[#0f172a] border border-[#4a9eff]" />
    
    <h3 className={cn("text-white text-sm tracking-wider font-bold", shareTech.className)}>{title}</h3>
    {subtitle && <p className={cn("text-[#4a9eff] text-[10px] mt-1", shareTech.className)}>{subtitle}</p>}
    
    {/* Highlight Corners */}
    <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.div>
);

const Connector = ({ height = 40 }: { height?: number }) => (
  <motion.div 
    initial={{ height: 0 }}
    animate={{ height }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="w-[1px] bg-[#4a9eff] mx-auto opacity-50"
  />
);

const SpecRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-end border-b border-[#4a9eff]/20 pb-1">
    <span className={cn("text-[#4a9eff] text-xs", shareTech.className)}>{label}</span>
    <span className={cn("text-white text-sm", shareTech.className)}>{value}</span>
  </div>
);

export default function Landing9() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen text-[#4a9eff] overflow-x-hidden selection:bg-[#4a9eff] selection:text-[#0f172a]">
      <CADGrid />

      {/* --- TITLE BLOCK (Right Bottom) --- */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 border-2 border-white bg-[#0f172a] p-4 z-50 shadow-[4px_4px_0px_0px_rgba(74,158,255,0.2)] max-w-[200px]"
      >
        <div className="grid grid-cols-1 divide-y divide-white/20 gap-2">
            <div>
                <p className="text-[8px] text-white/50 uppercase">Project</p>
                <p className={cn("text-sm text-white font-bold", shareTech.className)}>PORTFOLIO_MAIN</p>
            </div>
            <div className="pt-2">
                <p className="text-[8px] text-white/50 uppercase">Engineer</p>
                <p className={cn("text-sm text-white font-bold", shareTech.className)}>K. NARVAEZ</p>
            </div>
            <div className="pt-2 flex justify-between items-center">
                <span className="text-[10px] text-white">SCALE: 1:1</span>
                <span className="text-[10px] text-[#ff6b35]">REV: A.02</span>
            </div>
        </div>
      </motion.div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 pt-20 pb-32 container mx-auto px-6">
        
        {/* Header */}
        <header className="mb-20 border-b border-[#4a9eff] pb-8 relative">
            <div className="absolute top-0 left-0 w-2 h-2 bg-[#4a9eff]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4a9eff]" />
            
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className={cn("bg-[#4a9eff] text-[#0f172a] px-2 text-xs font-bold", shareTech.className)}>SYS.DWG</span>
                    <span className={cn("text-xs text-[#4a9eff]", shareTech.className)}>SHEET 01 / 05</span>
                </div>
                <h1 className={cn("text-4xl md:text-6xl text-white uppercase tracking-widest", shareTech.className)}>
                    System <br/> Architecture
                </h1>
            </motion.div>
        </header>

        {/* --- DIAGRAM SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: The Diagram */}
            <div className="lg:col-span-8 flex flex-col items-center border border-dashed border-[#4a9eff]/30 p-8 md:p-12 relative bg-[#4a9eff]/5">
                <div className="absolute top-2 left-2 text-[10px] text-[#4a9eff]">FIG 1.0 - DATA FLOW</div>
                
                {/* Flowchart */}
                <NodeBox title="USER INPUT" subtitle="Request / Interaction" delay={0.2} />
                <Connector />
                
                <div className="grid grid-cols-3 gap-8 w-full max-w-lg">
                    <div className="flex flex-col items-center mt-8">
                        <NodeBox title="FRONTEND" subtitle="Next.js / React" delay={0.4} />
                        <Connector height={20} />
                        <span className="text-[10px]">CLIENT SIDE</span>
                    </div>
                    <div className="flex flex-col items-center relative -top-8">
                        <div className="border border-[#ff6b35] p-1 mb-2 text-[8px] text-[#ff6b35] uppercase">Core Logic</div>
                        <NodeBox title="API GATEWAY" subtitle="NestJS / Node" delay={0.5} />
                        <Connector height={60} />
                    </div>
                    <div className="flex flex-col items-center mt-8">
                        <NodeBox title="AI MODEL" subtitle="PyTorch Inference" delay={0.6} />
                        <Connector height={20} />
                        <span className="text-[10px]">GPU CLUSTER</span>
                    </div>
                </div>

                <div className="w-full max-w-lg border-t border-[#4a9eff]/50 mt-4 relative">
                    <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-[#0f172a] px-2 text-[10px]">DATA BUS</div>
                </div>
                <Connector height={30} />
                
                <NodeBox title="DATABASE" subtitle="PostgreSQL / Vector DB" delay={0.8} />

                <div className="mt-8 w-full">
                    <MeasurementLine width="100%" />
                </div>
            </div>

            {/* Right Column: Specs & Notes */}
            <div className="lg:col-span-4 space-y-8">
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="border border-[#4a9eff] bg-[#0f172a] p-6"
                >
                    <h3 className={cn("text-white text-lg border-b border-white pb-2 mb-4 uppercase", shareTech.className)}>Technical Specs</h3>
                    <div className="space-y-3">
                        <SpecRow label="AVAILABILITY" value="99.99%" />
                        <SpecRow label="LATENCY" value="< 50ms" />
                        <SpecRow label="SECURITY" value="AES-256" />
                        <SpecRow label="SCALABILITY" value="AUTO" />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="border border-[#4a9eff] bg-[#0f172a] p-6 relative"
                >
                    <div className="absolute -left-1 top-6 w-2 h-8 bg-[#ff6b35]" />
                    <h3 className={cn("text-white text-lg mb-2 uppercase", shareTech.className)}>Engineering Notes</h3>
                    <p className={cn("text-sm text-white/70 leading-relaxed", inter.className)}>
                        All systems designed with fault-tolerance as a priority. 
                        The architecture decouples the inference engine from the user interface 
                        to ensure responsive interactions even under heavy computational load.
                    </p>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(74,158,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 border-2 border-[#ff6b35] text-[#ff6b35] font-bold uppercase tracking-widest hover:text-white hover:border-white transition-colors"
                >
                    INITIALIZE CONTACT
                </motion.button>

            </div>
        </div>

      </main>
    </div>
  );
}
