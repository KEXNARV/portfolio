"use client";

import React, { useState, useEffect, useRef } from "react";
import { JetBrains_Mono } from "next/font/google";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Network, Lock, ShieldCheck, Activity, Globe, Disc } from "lucide-react";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// --- Componentes de Terminal UI ---

const Panel = ({ 
  children, 
  title, 
  className = "",
  noPadding = false
}: { 
  children: React.ReactNode; 
  title: string; 
  className?: string;
  noPadding?: boolean;
}) => (
  <div className={cn("relative border border-green-900/50 bg-black/90 overflow-hidden flex flex-col group hover:border-green-500/50 transition-colors duration-300", className)}>
    {/* Header del Panel */}
    <div className="flex items-center justify-between px-3 py-1 border-b border-green-900/50 bg-green-900/10 text-[10px] uppercase tracking-wider text-green-600 group-hover:text-green-400 group-hover:bg-green-900/20 transition-all">
      <div className="flex items-center gap-2">
         <div className="w-1.5 h-1.5 bg-green-700 rounded-full animate-pulse"></div>
         {title}
      </div>
      <div className="flex gap-1">
        <div className="w-2 h-2 border border-green-800"></div>
        <div className="w-2 h-2 border border-green-800 bg-green-800/50"></div>
      </div>
    </div>
    
    {/* Contenido */}
    <div className={cn("flex-1 relative overflow-auto custom-scrollbar", noPadding ? "p-0" : "p-4")}>
       {/* Scanline overlay */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
       <div className="relative z-20 h-full">
         {children}
       </div>
    </div>
  </div>
);

// --- ASCII Chart ---
const AsciiChart = () => {
  const [bars, setBars] = useState<number[]>(Array(10).fill(5));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => {
        const newBars = [...prev.slice(1), Math.floor(Math.random() * 8) + 1];
        return newBars;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-1 h-16 mt-2">
      {bars.map((height, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
          {[...Array(height)].map((_, j) => (
            <div key={j} className="w-full h-1 bg-green-500/60"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// --- System Logs ---
const SystemLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "Initializing neural handshake...",
    "Scanning port 8080... OPEN",
    "Optimizing tensor weights...",
    "User authentication: VERIFIED",
    "Deploying container: portfolio-v2",
    "Connecting to neural net...",
    "Downloading assets...",
    "Checking system integrity...",
    "Encryption keys: ROTATED",
    "Allocating memory blocks..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 8));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] md:text-xs text-green-500/80 space-y-1">
      {logs.map((log, i) => (
        <div key={i} className={cn(i === 0 ? "text-green-400 font-bold" : "opacity-70")}>
          {i === 0 ? "> " : "  "}{log}
        </div>
      ))}
    </div>
  );
};

// --- Glitch Title ---
const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -ml-0.5 translate-x-[1px] text-red-500 opacity-0 group-hover:opacity-70 animate-pulse">{text}</span>
      <span className="absolute top-0 left-0 -ml-0.5 -translate-x-[1px] text-cyan-500 opacity-0 group-hover:opacity-70 animate-pulse delay-75">{text}</span>
    </div>
  );
};

export default function Landing7() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className={cn("min-h-screen bg-black text-green-500 p-2 md:p-4 overflow-hidden font-mono selection:bg-green-500 selection:text-black", mono.className)}>
      
      {/* Grid Layout Principal */}
      <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-12 gap-2 h-[95vh] w-full max-w-[1600px] mx-auto">
        
        {/* HEADER / NAV (Top Left) */}
        <Panel title="SYS.NAV" className="md:col-span-3 md:row-span-2">
            <div className="flex flex-col gap-2 h-full justify-center">
                <div className="text-xl font-bold tracking-tighter text-green-400">
                    K_NARVAEZ<span className="animate-blink">_</span>
                </div>
                <div className="text-[10px] text-green-700">ID: SYS-ADMIN-01</div>
            </div>
        </Panel>

        {/* STATUS BAR (Top Center) */}
        <Panel title="SYS.STATUS" className="md:col-span-6 md:row-span-2">
            <div className="grid grid-cols-4 gap-4 h-full items-center text-center">
                <div>
                    <div className="text-[10px] text-green-700 uppercase">Cpu Load</div>
                    <div className="text-lg font-bold">12%</div>
                </div>
                <div>
                    <div className="text-[10px] text-green-700 uppercase">Memory</div>
                    <div className="text-lg font-bold">64GB</div>
                </div>
                <div>
                     <div className="text-[10px] text-green-700 uppercase">Uptime</div>
                    <div className="text-lg font-bold">99.9%</div>
                </div>
                <div>
                     <div className="text-[10px] text-green-700 uppercase">Network</div>
                    <div className="text-lg font-bold text-green-400 animate-pulse">SECURE</div>
                </div>
            </div>
        </Panel>

        {/* CLOCK / WEATHER (Top Right) */}
        <Panel title="SYS.TIME" className="md:col-span-3 md:row-span-2">
            <div className="flex flex-col items-end justify-center h-full">
                <div className="text-2xl font-bold">{new Date().toLocaleTimeString('en-US', { hour12: false, hour:'2-digit', minute:'2-digit' })}</div>
                <div className="text-xs text-green-700">UTC+00:00</div>
            </div>
        </Panel>

        {/* MAIN HERO (Center Large) */}
        <Panel title="MAIN_DISPLAY" className="md:col-span-9 md:row-span-6 flex flex-col justify-center p-8 md:p-12 relative">
             <div className="absolute top-4 right-4 flex gap-2">
                <ShieldCheck className="text-green-700" size={20}/>
                <Lock className="text-green-700" size={20}/>
             </div>
             
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
             >
                 <div className="inline-block border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs mb-6 text-green-400">
                    &gt; SYSTEM ARCHITECT DETECTED
                 </div>
                 <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-none">
                    <GlitchText text="DEPLOYING" /> <br/>
                    <span className="text-green-700">INTELLIGENCE</span> <br/>
                    <GlitchText text="AT SCALE" />
                 </h1>
                 <p className="max-w-2xl text-green-600/80 text-sm md:text-lg mb-8 leading-relaxed">
                    Specialized in high-availability AI systems. 
                    Merging robust backend engineering with neural network deployment.
                 </p>
                 
                 <div className="flex gap-4">
                    <button className="bg-green-600 text-black px-6 py-3 font-bold text-sm hover:bg-green-500 transition-colors uppercase">
                        [ Initiate_Project ]
                    </button>
                    <button className="border border-green-600/50 text-green-500 px-6 py-3 text-sm hover:bg-green-900/30 transition-colors uppercase">
                        [ View_Source ]
                    </button>
                 </div>
             </motion.div>
        </Panel>

        {/* SIDEBAR TOOLS (Right Column) */}
        <Panel title="SYS.TOOLS" className="md:col-span-3 md:row-span-4">
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 bg-green-900/10 border border-green-900/30 cursor-pointer hover:bg-green-900/30 transition-colors">
                    <Cpu size={18} />
                    <div>
                        <div className="text-xs font-bold text-white">AI Models</div>
                        <div className="text-[10px] text-green-700">PyTorch / TF</div>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-2 bg-green-900/10 border border-green-900/30 cursor-pointer hover:bg-green-900/30 transition-colors">
                    <Network size={18} />
                    <div>
                        <div className="text-xs font-bold text-white">API Gateway</div>
                        <div className="text-[10px] text-green-700">NestJS / GraphQL</div>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-2 bg-green-900/10 border border-green-900/30 cursor-pointer hover:bg-green-900/30 transition-colors">
                    <Globe size={18} />
                    <div>
                        <div className="text-xs font-bold text-white">Edge Net</div>
                        <div className="text-[10px] text-green-700">Global Deployment</div>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-2 bg-green-900/10 border border-green-900/30 cursor-pointer hover:bg-green-900/30 transition-colors">
                    <Disc size={18} />
                    <div>
                        <div className="text-xs font-bold text-white">Storage</div>
                        <div className="text-[10px] text-green-700">PostgreSQL / Redis</div>
                    </div>
                </div>
            </div>
        </Panel>

        {/* LOGS (Bottom Right) */}
        <Panel title="SYS.LOGS" className="md:col-span-3 md:row-span-6 bg-black">
             <SystemLogs />
             <div className="mt-auto pt-4 border-t border-green-900/30">
                <AsciiChart />
             </div>
        </Panel>

        {/* BOTTOM WIDGETS */}
        <Panel title="PROJECT_A" className="md:col-span-3 md:row-span-4 hover:bg-green-900/5 cursor-pointer">
             <div className="h-full flex flex-col justify-between">
                <Activity className="text-green-700 mb-2" />
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Neural Bridge</h3>
                    <p className="text-xs text-green-600">High-throughput inference API.</p>
                </div>
                <div className="text-[10px] text-green-800 uppercase mt-2">Status: Active</div>
             </div>
        </Panel>

        <Panel title="PROJECT_B" className="md:col-span-3 md:row-span-4 hover:bg-green-900/5 cursor-pointer">
             <div className="h-full flex flex-col justify-between">
                <Lock className="text-green-700 mb-2" />
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Secure Vault</h3>
                    <p className="text-xs text-green-600">Encrypted data storage system.</p>
                </div>
                <div className="text-[10px] text-green-800 uppercase mt-2">Status: Deployed</div>
             </div>
        </Panel>
        
        <Panel title="PROJECT_C" className="md:col-span-3 md:row-span-4 hover:bg-green-900/5 cursor-pointer">
             <div className="h-full flex flex-col justify-between">
                <Globe className="text-green-700 mb-2" />
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Global Mesh</h3>
                    <p className="text-xs text-green-600">Distributed CDN architecture.</p>
                </div>
                <div className="text-[10px] text-green-800 uppercase mt-2">Status: Scaling</div>
             </div>
        </Panel>

      </div>
    </div>
  );
}