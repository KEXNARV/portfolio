"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Manrope, Space_Mono } from "next/font/google";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Network, Layers, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Hook de Sonido de Llegada (Continuación directa del Warp) ---
const useArrivalSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasPlayedRef = useRef(false);

  const playArrivalSound = useCallback(async () => {
    if (hasPlayedRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Resumir si está suspendido (política de autoplay del navegador)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Solo marcar como reproducido si el contexto está activo
      if (ctx.state !== 'running') {
        console.warn('AudioContext not running, state:', ctx.state);
        ctx.close();
        audioContextRef.current = null;
        return;
      }

      hasPlayedRef.current = true;
      const now = ctx.currentTime;
    const duration = 3.0;

    // Master compressor
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 25;
    compressor.ratio.value = 10;
    compressor.attack.value = 0.001;
    compressor.release.value = 0.2;
    compressor.connect(ctx.destination);

    // === CAPA 0: PICKUP INMEDIATO (Eco del warp - llena el gap) ===
    // Empieza ALTO y baja rápido, simulando que el warp sigue
    const pickup = ctx.createOscillator();
    pickup.type = 'sine';
    pickup.frequency.setValueAtTime(50, now);
    pickup.frequency.exponentialRampToValueAtTime(45, now + 0.3);

    const pickupGain = ctx.createGain();
    pickupGain.gain.setValueAtTime(1.6, now); // Empieza fuerte (200%)
    pickupGain.gain.exponentialRampToValueAtTime(0.8, now + 0.15);
    pickupGain.gain.exponentialRampToValueAtTime(0.4, now + 0.4);

    pickup.connect(pickupGain);
    pickupGain.connect(compressor);
    pickup.start(now);
    pickup.stop(now + 0.5);

    // === PICKUP RUMBLE (Continúa el ruido del warp) ===
    const pickupRumbleBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const pickupRumbleData = pickupRumbleBuffer.getChannelData(0);
    for (let i = 0; i < pickupRumbleData.length; i++) {
      pickupRumbleData[i] = Math.random() * 2 - 1;
    }
    const pickupRumble = ctx.createBufferSource();
    pickupRumble.buffer = pickupRumbleBuffer;

    const pickupRumbleFilter = ctx.createBiquadFilter();
    pickupRumbleFilter.type = 'lowpass';
    pickupRumbleFilter.frequency.setValueAtTime(120, now);
    pickupRumbleFilter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    const pickupRumbleGain = ctx.createGain();
    pickupRumbleGain.gain.setValueAtTime(1.2, now);
    pickupRumbleGain.gain.exponentialRampToValueAtTime(0.4, now + 0.4);

    pickupRumble.connect(pickupRumbleFilter);
    pickupRumbleFilter.connect(pickupRumbleGain);
    pickupRumbleGain.connect(compressor);
    pickupRumble.start(now);

    // === CAPA 1: SUB BASS DESCENDENTE (Continuación suave) ===
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(50, now);
    sub.frequency.exponentialRampToValueAtTime(18, now + duration);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(1.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    sub.connect(subGain);
    subGain.connect(compressor);
    sub.start(now);
    sub.stop(now + duration);

    // === CAPA 2: RUMBLE DESCENDENTE ===
    const rumbleBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const rumbleData = rumbleBuffer.getChannelData(0);
    for (let i = 0; i < rumbleData.length; i++) {
      rumbleData[i] = Math.random() * 2 - 1;
    }

    const rumble = ctx.createBufferSource();
    rumble.buffer = rumbleBuffer;

    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(120, now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(35, now + duration);
    rumbleFilter.Q.value = 1.5;

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(1.1, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(compressor);
    rumble.start(now);

    // === CAPA 3: TONOS DESCENDENTES (Reverb que baja) ===
    const createDescendingTone = (startFreq: number, startGain: number, delay: number) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, now + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(startGain, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(compressor);
      osc.start(now);
      osc.stop(now + duration);
    };

    // Comienzan donde el warp terminó y bajan (200%)
    createDescendingTone(40, 0.6, 0);
    createDescendingTone(38, 0.5, 0);
    createDescendingTone(35, 0.4, 0);
    createDescendingTone(32, 0.3, 0);
    createDescendingTone(30, 0.24, 0);

    // === CAPA 4: ENGINE APAGÁNDOSE ===
    const engine = ctx.createOscillator();
    engine.type = 'sawtooth';
    engine.frequency.setValueAtTime(60, now);
    engine.frequency.exponentialRampToValueAtTime(22, now + duration);

    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(150, now);
    engineFilter.frequency.exponentialRampToValueAtTime(50, now + duration);

    const engineGain = ctx.createGain();
    engineGain.gain.setValueAtTime(0.6, now);
    engineGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);

    engine.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(compressor);
    engine.start(now);
    engine.stop(now + duration);

    // === CAPA 5: GROWL DESCENDENTE (Continúa el rugido del warp) ===
    const makeDistortionCurve = (amount: number) => {
      const k = amount;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
      }
      return curve;
    };

    const growl = ctx.createOscillator();
    growl.type = 'sawtooth';
    growl.frequency.setValueAtTime(55, now); // Empieza donde warp terminó
    growl.frequency.exponentialRampToValueAtTime(25, now + duration);

    const growlFilter = ctx.createBiquadFilter();
    growlFilter.type = 'lowpass';
    growlFilter.frequency.setValueAtTime(150, now);
    growlFilter.frequency.exponentialRampToValueAtTime(60, now + duration);
    growlFilter.Q.value = 3;

    const distortion = ctx.createWaveShaper();
    distortion.curve = makeDistortionCurve(80);
    distortion.oversample = '4x';

    const growlGain = ctx.createGain();
    growlGain.gain.setValueAtTime(0.5, now);
    growlGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

    growl.connect(growlFilter);
    growlFilter.connect(distortion);
    distortion.connect(growlGain);
    growlGain.connect(compressor);
    growl.start(now);
    growl.stop(now + duration);

    // Cleanup
    setTimeout(() => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }, (duration + 0.5) * 1000);

    } catch (e) {
      console.warn('Audio arrival sound failed:', e);
    }
  }, []);

  useEffect(() => {
    // Intentar reproducir inmediatamente
    playArrivalSound();

    // Fallback: si el autoplay falló, reproducir en primera interacción
    const handleInteraction = () => {
      if (!hasPlayedRef.current) {
        playArrivalSound();
      }
      // Limpiar listeners después de reproducir
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [playArrivalSound]);
};

// --- Fuentes ---
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// --- Componentes UI Locales ---

// Efecto de Ruido (Film Grain)
const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// Botón Industrial
const IndustrialButton = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <button
    className={cn(
      "group relative px-6 py-3 bg-transparent border border-neutral-700 text-neutral-100 uppercase tracking-widest text-xs font-bold hover:bg-[#FF3B30] hover:border-[#FF3B30] hover:text-white transition-all duration-300 overflow-hidden",
      spaceMono.className,
      className
    )}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

// Tarjeta Bento Grid
const BentoCard = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  className,
  delay = 0 
}: { 
  title: string; 
  subtitle: string; 
  icon: any; 
  className?: string;
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "relative p-8 border border-neutral-800 bg-[#0a0a0a] hover:border-neutral-600 transition-colors duration-300 flex flex-col justify-between group h-full", 
      className
    )}
  >
    <div className="absolute top-4 right-4 text-neutral-700 group-hover:text-[#FF3B30] transition-colors">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div className="mt-auto">
      <p className={cn("text-xs text-neutral-500 mb-2 uppercase tracking-wider", spaceMono.className)}>
        {subtitle}
      </p>
      <h3 className={cn("text-2xl font-bold text-neutral-200 group-hover:text-white", manrope.className)}>
        {title}
      </h3>
    </div>
  </motion.div>
);

export default function Landing1() {
  // Activar sonido de llegada al montar
  useArrivalSound();

  return (
    <div className={cn("min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#FF3B30] selection:text-white overflow-x-hidden", manrope.className)}>
      <NoiseOverlay />

      {/* --- Navegación Industrial --- */}
      <nav className="fixed top-0 w-full z-40 border-b border-neutral-900 bg-[#050505]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className={cn("text-sm font-bold tracking-tighter flex items-center gap-2", spaceMono.className)}>
            <div className="w-2 h-2 bg-[#FF3B30]" />
            K.NARVAEZ / SYS.ENG
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-500 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Index</span>
            <span className="hover:text-white cursor-pointer transition-colors">Systems</span>
            <span className="hover:text-white cursor-pointer transition-colors">Intelligence</span>
            <span className="text-[#FF3B30]">v1.0.0</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 container mx-auto px-6">
        
        {/* --- Hero Section --- */}
        <section className="mb-32 relative">
          {/* Líneas de grid decorativas */}
          <div className="absolute top-0 left-0 w-full h-full border-l border-r border-neutral-900 pointer-events-none opacity-50" />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={cn("flex flex-col md:flex-row items-baseline gap-4 mb-4 text-[#FF3B30] text-sm uppercase tracking-widest", spaceMono.className)}>
              <span>// Neural Architect</span>
              <span className="w-12 h-[1px] bg-[#FF3B30]" />
              <span>System Status: Online</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-[0.9] mb-8 text-neutral-100">
              BUILDING <br />
              <span className="text-neutral-600">THE DIGITAL</span> <br />
              CORTEX.
            </h1>
            
            <p className="max-w-xl text-lg md:text-xl text-neutral-400 leading-relaxed mb-12">
              AI Product System Engineer specializing in bridging high-dimensional models with scalable, production-grade infrastructure.
            </p>

            <div className="flex flex-wrap gap-4">
              <IndustrialButton>
                View Architecture <ArrowUpRight size={16} />
              </IndustrialButton>
              <IndustrialButton className="border-transparent hover:bg-neutral-900 hover:border-neutral-800">
                Contact Protocol
              </IndustrialButton>
            </div>
          </motion.div>
        </section>

        {/* --- Bento Grid / Stats Section --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-auto md:h-[500px]">
          {/* Main Focus */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
            <BentoCard 
              title="Large Scale Model Deployment" 
              subtitle="Core Competency"
              icon={Cpu}
              className="bg-neutral-900/20"
              delay={0.1}
            />
          </div>
          
          {/* Tech Stack 1 */}
          <div className="col-span-1 row-span-1">
             <BentoCard 
              title="Neural Networks" 
              subtitle="Deep Learning"
              icon={Network}
              delay={0.2}
            />
          </div>

          {/* Tech Stack 2 */}
          <div className="col-span-1 row-span-1">
             <BentoCard 
              title="System Design" 
              subtitle="Architecture"
              icon={Layers}
              delay={0.3}
            />
          </div>

          {/* Stats / CLI */}
          <div className="col-span-1 md:col-span-2 row-span-1 bg-[#111] border border-neutral-800 p-6 font-mono text-xs text-green-500 flex flex-col">
             <div className="flex items-center justify-between text-neutral-500 mb-4 border-b border-neutral-800 pb-2">
                <span>TERMINAL_OUTPUT</span>
                <Terminal size={14} />
             </div>
             <div className="flex-1 overflow-hidden opacity-70 space-y-1">
               <p>{`> Initializing neural_bridge...`}</p>
               <p>{`> Loading weights [##########] 100%`}</p>
               <p>{`> Connection established: 5433ms`}</p>
               <p className="text-white animate-pulse">{`> Awaiting input_`}</p>
             </div>
          </div>
        </section>

        {/* --- Footer Minimal --- */}
        <footer className="mt-32 border-t border-neutral-900 pt-8 flex justify-between items-end text-neutral-600">
          <div className="flex flex-col gap-1">
             <span className={spaceMono.className}>© 2026 Kevin Narvaez</span>
             <span className="text-xs">Based in [Location]</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold opacity-10 tracking-tighter">KN.AI</h2>
        </footer>

      </main>
    </div>
  );
}
