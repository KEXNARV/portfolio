"use client";

import React from "react";
import { JetBrains_Mono } from "next/font/google";
import { motion } from "framer-motion";
import { Terminal, Database, Cpu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "800"] });

// --- Componentes Brutalistas ---

const BrutalCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all", className)}>
    <h3 className="bg-black text-white inline-block px-2 py-1 text-lg font-bold mb-4 uppercase">{title}</h3>
    <div className="text-black font-medium">{children}</div>
  </div>
);

const BrutalButton = ({ children }: { children: React.ReactNode }) => (
  <button className="bg-[#FF00FF] text-black border-4 border-black px-8 py-4 font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all active:bg-[#D900D9] flex items-center gap-2">
    {children}
  </button>
);

export default function Landing3() {
  return (
    <div className={cn("min-h-screen bg-[#FFFDF5] text-black p-4 md:p-12", mono.className)}>
      
      {/* Top Bar */}
      <header className="flex justify-between items-center mb-20 border-b-4 border-black pb-4">
        <div className="text-2xl font-black uppercase tracking-tighter">
          K_NARVAEZ<span className="animate-pulse">_</span>
        </div>
        <nav className="hidden md:flex gap-8 font-bold">
          <a href="#" className="hover:bg-black hover:text-white px-2">/ROOT</a>
          <a href="#" className="hover:bg-black hover:text-white px-2">/PROJECTS</a>
          <a href="#" className="hover:bg-black hover:text-white px-2">/LOGS</a>
        </nav>
      </header>

      {/* Hero */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="border-4 border-black p-8 bg-yellow-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
          >
            <h1 className="text-5xl md:text-8xl font-black mb-4 leading-none">
              SYSTEM <br/> ENGINEER
            </h1>
            <p className="text-xl md:text-2xl font-bold border-t-4 border-black pt-4">
              &gt; DEPLOYING INTELLIGENCE AT SCALE.
            </p>
          </motion.div>

          <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(100,100,100,1)]">
            <code className="text-sm md:text-base">
              <span className="text-green-400">$</span> whoami <br/>
              AI Product System Engineer. <br/>
              Specialized in Neural Architectures & Full-Stack Scalability. <br/>
              <span className="text-green-400 animate-pulse">_</span>
            </code>
          </div>
          
          <div className="flex gap-4">
             <BrutalButton>INITIATE PROTOCOL <ArrowRight strokeWidth={3}/></BrutalButton>
          </div>
        </div>

        {/* Stats / Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BrutalCard title="Stack Status" className="bg-[#00FFFF]">
            <ul className="space-y-2">
              <li className="flex justify-between border-b-2 border-black border-dashed">
                <span>NEXT.JS</span> <span>READY</span>
              </li>
              <li className="flex justify-between border-b-2 border-black border-dashed">
                <span>NEST.JS</span> <span>READY</span>
              </li>
              <li className="flex justify-between border-b-2 border-black border-dashed">
                <span>PYTORCH</span> <span>LOADING...</span>
              </li>
              <li className="flex justify-between border-b-2 border-black border-dashed">
                <span>DOCKER</span> <span>ACTIVE</span>
              </li>
            </ul>
          </BrutalCard>

          <BrutalCard title="Recent Logs">
            <div className="text-xs space-y-2 opacity-70">
              <p>[INFO] Cluster scaling optimized by 40%</p>
              <p>[WARN] High latency in neuron_layer_4</p>
              <p>[SUCCESS] Deployment v2.4.0 verified</p>
            </div>
          </BrutalCard>
        </div>
      </main>

      {/* Grid Section */}
      <section className="border-t-4 border-black pt-12">
        <h2 className="text-6xl font-black mb-12 uppercase">Selected Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
                <div key={item} className="group cursor-pointer">
                    <div className="bg-gray-200 border-4 border-black h-64 mb-4 flex items-center justify-center overflow-hidden relative">
                         <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                         <Cpu size={64} strokeWidth={1} />
                    </div>
                    <div className="flex justify-between items-end border-b-4 border-black pb-2">
                        <h3 className="text-2xl font-bold">PROJECT_0{item}</h3>
                        <span className="bg-black text-white px-2 font-bold text-sm">2026</span>
                    </div>
                </div>
            ))}
        </div>
      </section>

    </div>
  );
}
