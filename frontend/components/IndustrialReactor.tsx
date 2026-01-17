"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Fingerprint, Cpu, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Manrope, Space_Mono } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// --- UTILIDAD DE DISTORSIÓN ---
const makeDistortionCurve = (amount: number) => {
  const k = typeof amount === 'number' ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
};

// --- HOOK DE AUDIO PROCEDURAL (DEEP RUMBLE MODE) ---
const useIndustrialSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodes = useRef<AudioNode[]>([]);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const chargeOscRef = useRef<OscillatorNode | null>(null);
  const chargeGainRef = useRef<GainNode | null>(null);
  const chargeSubRef = useRef<OscillatorNode | null>(null);
  const chargeSubGainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
      const compressor = audioContextRef.current.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      compressor.connect(audioContextRef.current.destination);
      compressorRef.current = compressor;
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const stopAll = useCallback(() => {
      activeNodes.current.forEach(node => {
          try {
              (node as any).stop && (node as any).stop(); 
              node.disconnect();
          } catch(e) {}
      });
      activeNodes.current = [];
  }, []);

  // Referencias para el drone
  const droneOscsRef = useRef<OscillatorNode[]>([]);
  const droneGainRef = useRef<GainNode | null>(null);
  const droneSubRef = useRef<OscillatorNode | null>(null);
  const droneSubGainRef = useRef<GainNode | null>(null);

  const startDrone = useCallback(() => {
    initAudio();
    const ctx = audioContextRef.current!;
    const master = compressorRef.current!;
    if (droneOscsRef.current.length > 0) return;
    const freqs = [40, 40.5, 39.5];
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    const oscs: OscillatorNode[] = [];
    freqs.forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 180;
        osc.connect(filter);
        filter.connect(gain);
        osc.start();
        oscs.push(osc);
    });
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 30;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.8;
    sub.connect(subGain);
    gain.connect(master);
    subGain.connect(master);
    sub.start();
    droneOscsRef.current = oscs;
    droneGainRef.current = gain;
    droneSubRef.current = sub;
    droneSubGainRef.current = subGain;
  }, [initAudio]);

  const stopDrone = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const fadeTime = 0.35;
    if (droneGainRef.current) {
        droneGainRef.current.gain.cancelScheduledValues(now);
        droneGainRef.current.gain.setValueAtTime(droneGainRef.current.gain.value, now);
        droneGainRef.current.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
    }
    if (droneSubGainRef.current) {
        droneSubGainRef.current.gain.cancelScheduledValues(now);
        droneSubGainRef.current.gain.setValueAtTime(droneSubGainRef.current.gain.value, now);
        droneSubGainRef.current.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
    }
    setTimeout(() => {
        try {
            droneOscsRef.current.forEach(osc => osc.stop());
            droneOscsRef.current = [];
            if (droneSubRef.current) { droneSubRef.current.stop(); droneSubRef.current = null; }
        } catch (e) {}
        droneGainRef.current = null;
        droneSubGainRef.current = null;
    }, fadeTime * 1000 + 50);
  }, []);

  const startCharge = useCallback(() => {
    initAudio();
    const ctx = audioContextRef.current!;
    const master = compressorRef.current!;
    const now = ctx.currentTime;
    const duration = 4;
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(40, now);
    sub.frequency.exponentialRampToValueAtTime(100, now + duration); 
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(1.6, now + 0.5);
    sub.connect(subGain);
    subGain.connect(master);
    const engine = ctx.createOscillator();
    engine.type = 'sawtooth';
    engine.frequency.setValueAtTime(50, now);
    engine.frequency.linearRampToValueAtTime(150, now + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.linearRampToValueAtTime(400, now + duration);
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    const engineGain = ctx.createGain();
    engineGain.gain.setValueAtTime(0, now);
    engineGain.gain.linearRampToValueAtTime(1.0, now + 1);
    engine.connect(filter);
    filter.connect(engineGain);
    engineGain.connect(master);
    sub.start();
    engine.start();
    lfo.start();
    chargeOscRef.current = engine;
    chargeSubRef.current = sub;
    chargeSubGainRef.current = subGain;
    lfoRef.current = lfo;
    chargeGainRef.current = engineGain;
  }, [initAudio]);

  const stopCharge = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const fadeTime = 0.25;
    // Fade out engine
    if (chargeGainRef.current) {
        chargeGainRef.current.gain.cancelScheduledValues(now);
        chargeGainRef.current.gain.setValueAtTime(chargeGainRef.current.gain.value, now);
        chargeGainRef.current.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
    }
    // Fade out sub
    if (chargeSubGainRef.current) {
        chargeSubGainRef.current.gain.cancelScheduledValues(now);
        chargeSubGainRef.current.gain.setValueAtTime(chargeSubGainRef.current.gain.value, now);
        chargeSubGainRef.current.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
    }
    setTimeout(() => {
        try {
            if (chargeOscRef.current) { chargeOscRef.current.stop(); chargeOscRef.current = null; }
            if (chargeSubRef.current) { chargeSubRef.current.stop(); chargeSubRef.current = null; }
            if (lfoRef.current) { lfoRef.current.stop(); lfoRef.current = null; }
        } catch (e) {}
        chargeGainRef.current = null;
        chargeSubGainRef.current = null;
    }, fadeTime * 1000 + 50);
  }, []);

  useEffect(() => {
      return () => {
          stopAll();
          if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
      };
  }, [stopAll]);

  // Warp Sound - Conecta con Arrival Sound (sube frecuencias)
  const playWarpSound = useCallback(() => {
    initAudio();
    const ctx = audioContextRef.current!;
    const master = compressorRef.current!;
    const now = ctx.currentTime;
    const duration = 1.5;

    // CAPA 1: Impacto inicial
    const impact = ctx.createOscillator();
    impact.type = 'sine';
    impact.frequency.setValueAtTime(25, now);
    impact.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    const impactGain = ctx.createGain();
    impactGain.gain.setValueAtTime(1.8, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    impact.connect(impactGain);
    impactGain.connect(master);
    impact.start(now);
    impact.stop(now + 0.6);

    // CAPA 2: Rumble ascendente
    const rumbleBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const rumbleData = rumbleBuffer.getChannelData(0);
    for (let i = 0; i < rumbleData.length; i++) rumbleData[i] = Math.random() * 2 - 1;
    const rumble = ctx.createBufferSource();
    rumble.buffer = rumbleBuffer;
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(60, now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(120, now + duration);
    rumbleFilter.Q.value = 2;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0, now);
    rumbleGain.gain.linearRampToValueAtTime(1.0, now + 0.1);
    rumbleGain.gain.linearRampToValueAtTime(1.4, now + duration * 0.8);
    rumbleGain.gain.setValueAtTime(1.0, now + duration);
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(master);
    rumble.start(now);

    // CAPA 3: Engine ascendente
    const engine = ctx.createOscillator();
    engine.type = 'sawtooth';
    engine.frequency.setValueAtTime(25, now);
    engine.frequency.exponentialRampToValueAtTime(60, now + duration);
    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(80, now);
    engineFilter.frequency.exponentialRampToValueAtTime(150, now + duration);
    const engineGain = ctx.createGain();
    engineGain.gain.setValueAtTime(0, now);
    engineGain.gain.linearRampToValueAtTime(0.6, now + 0.2);
    engineGain.gain.linearRampToValueAtTime(0.8, now + duration * 0.7);
    engineGain.gain.setValueAtTime(0.5, now + duration);
    engine.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(master);
    engine.start(now);
    engine.stop(now + duration + 0.1);

    // CAPA 4: Sub ascendente
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(20, now);
    sub.frequency.exponentialRampToValueAtTime(50, now + duration);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(1.0, now);
    subGain.gain.linearRampToValueAtTime(1.6, now + duration * 0.6);
    subGain.gain.setValueAtTime(1.4, now + duration);
    sub.connect(subGain);
    subGain.connect(master);
    sub.start(now);
    sub.stop(now + duration + 0.1);

    // CAPA 5: Growl ascendente
    const growl = ctx.createOscillator();
    growl.type = 'sawtooth';
    growl.frequency.setValueAtTime(30, now);
    growl.frequency.exponentialRampToValueAtTime(55, now + duration);
    const growlFilter = ctx.createBiquadFilter();
    growlFilter.type = 'lowpass';
    growlFilter.frequency.setValueAtTime(100, now);
    growlFilter.frequency.exponentialRampToValueAtTime(150, now + duration);
    growlFilter.Q.value = 3;
    const distortion = ctx.createWaveShaper();
    distortion.curve = makeDistortionCurve(80);
    distortion.oversample = '4x';
    const growlGain = ctx.createGain();
    growlGain.gain.setValueAtTime(0, now);
    growlGain.gain.linearRampToValueAtTime(0.5, now + 0.15);
    growlGain.gain.linearRampToValueAtTime(0.7, now + duration * 0.7);
    growlGain.gain.setValueAtTime(0.4, now + duration);
    growl.connect(growlFilter);
    growlFilter.connect(distortion);
    distortion.connect(growlGain);
    growlGain.connect(master);
    growl.start(now);
    growl.stop(now + duration + 0.1);

    stopCharge();
    stopDrone();
  }, [initAudio, stopCharge, stopDrone]);

  const playBleep = useCallback(() => {
      if (Math.random() > 0.7) return; 
      initAudio();
      const ctx = audioContextRef.current!;
      const master = compressorRef.current!;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 1200 + Math.random() * 500;
      const gain = ctx.createGain();
      gain.gain.value = 0.1;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
  }, [initAudio]);

  return { initAudio, startDrone, stopDrone, startCharge, stopCharge, playWarpSound, playBleep };
};

// --- HOOK DE TELEMETRÍA ---
const useTelemetry = () => {
  const [cpu, setCpu] = useState(12);
  const [memory, setMemory] = useState("0x4A2B");
  const [latency, setLatency] = useState(45);
  const [history, setHistory] = useState<number[]>(new Array(20).fill(20));
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(100, Math.max(5, prev + (Math.random() - 0.5) * 10)));
      setLatency(prev => Math.min(200, Math.max(20, prev + (Math.random() - 0.5) * 20)));
      setMemory(`0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase()}`);
      setHistory(prev => {
        const nextVal = Math.min(40, Math.max(5, prev[prev.length - 1] + (Math.random() - 0.5) * 10));
        return [...prev.slice(1), nextVal];
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return { cpu, memory, latency, history };
};

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const points = data.map((d, i) => `${i * 5},${40 - d}`).join(" ");
  return (<svg width="100" height="40" className="opacity-50"><polyline points={points} fill="none" stroke={color} strokeWidth="1.5" /></svg>);
};

export const IndustrialReactor = ({ theme, onEnter }: { theme: any, onEnter: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0); 
  const [isWarping, setIsWarping] = useState(false);
  const { cpu, memory, latency, history } = useTelemetry();
  const { initAudio, startDrone, stopDrone, startCharge, stopCharge, playWarpSound, playBleep } = useIndustrialSound();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; initAudio(); };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [initAudio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Partículas normales (para estado idle/hover/holding)
    const particles: any[] = [];
    for (let i = 0; i < 600; i++) {
      particles.push({
        angle: (i / 600) * Math.PI * 2,
        radius: 150 + Math.random() * 100,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.8 ? "#FF3B30" : "#333",
        alpha: Math.random() * 0.5 + 0.2,
        speed: 0.005 + Math.random() * 0.01,
        warpSpeed: 0
      });
    }

    // === SISTEMA DE WARP 3D - Túnel de Hyperespacio ===
    interface WarpStar {
      x: number;
      y: number;
      z: number;
      prevZ: number;
      speed: number;
      isRed: boolean;
      size: number;
    }

    const warpStarCount = 1500;
    const maxDepth = 1500;
    const warpStars: WarpStar[] = [];

    for (let i = 0; i < warpStarCount; i++) {
      warpStars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * maxDepth,
        prevZ: 0,
        speed: 2 + Math.random() * 4,
        isRed: Math.random() < 0.25, // 25% rojas para tema industrial
        size: Math.random() * 2 + 1
      });
    }

    let warpStartTime = 0;
    const warpDuration = 1500; // ms

    // --- SISTEMA DE CABLES INDUSTRIAL MEJORADO ---
    const coreRadius = 130;
    const cables: {
      start: {x: number, y: number},
      control1: {x: number, y: number},
      control2: {x: number, y: number},
      end: {x: number, y: number},
      pulses: number[],
      speed: number,
      width: number
    }[] = [];

    // 8 cables - 4 cardinales + 4 diagonales
    const cableAngles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];

    cableAngles.forEach((angle, i) => {
      const edgeX = centerX + Math.cos(angle) * Math.max(width, height);
      const edgeY = centerY + Math.sin(angle) * Math.max(width, height);
      const endX = centerX + Math.cos(angle) * coreRadius;
      const endY = centerY + Math.sin(angle) * coreRadius;

      // Puntos de control para curvas bezier con variación
      const dist = Math.sqrt(Math.pow(edgeX - centerX, 2) + Math.pow(edgeY - centerY, 2));
      const midDist = dist * 0.4;
      const variation = (i % 2 === 0) ? 50 : -50;
      const perpAngle = angle + Math.PI/2;

      cables.push({
        start: { x: edgeX, y: edgeY },
        control1: {
          x: centerX + Math.cos(angle) * midDist + Math.cos(perpAngle) * variation,
          y: centerY + Math.sin(angle) * midDist + Math.sin(perpAngle) * variation
        },
        control2: {
          x: centerX + Math.cos(angle) * (coreRadius + 80),
          y: centerY + Math.sin(angle) * (coreRadius + 80)
        },
        end: { x: endX, y: endY },
        pulses: [Math.random(), Math.random() * 0.5 + 0.5, Math.random() * 0.3], // 3 pulsos por cable
        speed: 0.0008 + Math.random() * 0.0006,
        width: i % 2 === 0 ? 2 : 1.5 // Cardinales más gruesos
      });
    });

    // Grid Elástico
    const gridSize = 60;
    const cols = Math.ceil(width / gridSize) + 1;
    const rows = Math.ceil(height / gridSize) + 1;
    const gridPoints: any[] = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            gridPoints.push({ x: x * gridSize, y: y * gridSize, originX: x * gridSize, originY: y * gridSize, vx: 0, vy: 0 });
        }
    }

    let animationFrameId: number;
    const render = () => {
      ctx.fillStyle = isWarping ? "rgba(10, 10, 10, 0.1)" : "rgba(10, 10, 10, 0.3)"; 
      ctx.fillRect(0, 0, width, height);

      // 1. Grid
      if (!isWarping) {
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 1;
        const distToCenter = Math.sqrt(Math.pow(mouseRef.current.x - centerX, 2) + Math.pow(mouseRef.current.y - centerY, 2));
        const isOver = distToCenter < 200;
        gridPoints.forEach(p => {
            if (isOver) {
                const dx = p.x - mouseRef.current.x;
                const dy = p.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) {
                    const angle = Math.atan2(dy, dx);
                    const push = ((300 - dist) / 300) * 15; 
                    p.vx += Math.cos(angle) * push * 0.5;
                    p.vy += Math.sin(angle) * push * 0.5;
                }
            }
            p.vx += (p.originX - p.x) * 0.05; 
            p.vy += (p.originY - p.y) * 0.05;
            p.vx *= 0.85; p.vy *= 0.85;
            p.x += p.vx; p.y += p.vy;
        });
        ctx.beginPath();
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const p = gridPoints[y * cols + x];
                if (x === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
            }
        }
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const p = gridPoints[y * cols + x];
                if (y === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();
      }

      // 2. Sistema de Cables Industrial
      if (!isWarping) {
          // Función para obtener punto en curva bezier cúbica
          const getBezierPoint = (t: number, p0: {x:number,y:number}, p1: {x:number,y:number}, p2: {x:number,y:number}, p3: {x:number,y:number}) => {
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;
            const t2 = t * t;
            const t3 = t2 * t;
            return {
              x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
              y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
            };
          };

          cables.forEach((cable, i) => {
            const time = Date.now();
            const baseAlpha = isHolding ? 0.8 : (isHovering ? 0.4 : 0.2);
            const pulseIntensity = isHolding ? 1 : 0.3;

            // === CAPA 1: Glow del cable (solo cuando está activo) ===
            if (isHolding) {
              ctx.save();
              ctx.shadowColor = '#FF3B30';
              ctx.shadowBlur = 15 + Math.sin(time * 0.005) * 5;
              ctx.beginPath();
              ctx.moveTo(cable.start.x, cable.start.y);
              ctx.bezierCurveTo(cable.control1.x, cable.control1.y, cable.control2.x, cable.control2.y, cable.end.x, cable.end.y);
              ctx.strokeStyle = `rgba(255, 59, 48, 0.3)`;
              ctx.lineWidth = cable.width * 4;
              ctx.stroke();
              ctx.restore();
            }

            // === CAPA 2: Cable principal con gradiente ===
            const gradient = ctx.createLinearGradient(cable.start.x, cable.start.y, cable.end.x, cable.end.y);
            if (isHolding) {
              gradient.addColorStop(0, `rgba(255, 59, 48, 0.3)`);
              gradient.addColorStop(0.5, `rgba(255, 59, 48, 0.8)`);
              gradient.addColorStop(1, `rgba(255, 100, 80, 1)`);
            } else {
              gradient.addColorStop(0, `rgba(40, 40, 40, ${baseAlpha * 0.5})`);
              gradient.addColorStop(0.7, `rgba(60, 60, 60, ${baseAlpha})`);
              gradient.addColorStop(1, `rgba(80, 80, 80, ${baseAlpha})`);
            }

            ctx.beginPath();
            ctx.moveTo(cable.start.x, cable.start.y);
            ctx.bezierCurveTo(cable.control1.x, cable.control1.y, cable.control2.x, cable.control2.y, cable.end.x, cable.end.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = isHolding ? cable.width * 2 : cable.width;
            ctx.stroke();

            // === CAPA 3: Línea interior brillante (cuando holding) ===
            if (isHolding) {
              ctx.beginPath();
              ctx.moveTo(cable.start.x, cable.start.y);
              ctx.bezierCurveTo(cable.control1.x, cable.control1.y, cable.control2.x, cable.control2.y, cable.end.x, cable.end.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 0.01 + i) * 0.2})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            // === CAPA 4: Nodos de conexión ===
            // Nodo en el punto de conexión al reactor
            const nodeSize = isHolding ? 6 : 3;
            ctx.beginPath();
            ctx.arc(cable.end.x, cable.end.y, nodeSize, 0, Math.PI * 2);
            ctx.fillStyle = isHolding ? '#FF3B30' : '#444';
            ctx.fill();

            if (isHolding) {
              // Anillo exterior del nodo
              ctx.beginPath();
              ctx.arc(cable.end.x, cable.end.y, nodeSize + 4, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 59, 48, ${0.5 + Math.sin(time * 0.008) * 0.3})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            // === CAPA 5: Pulsos de energía viajando por el cable ===
            cable.pulses.forEach((pulseOffset, pi) => {
              // Actualizar posición del pulso
              cable.pulses[pi] = (pulseOffset + cable.speed * (isHolding ? 3 : 1)) % 1;
              const t = cable.pulses[pi];

              if (isHolding || isHovering) {
                const pulsePos = getBezierPoint(t, cable.start, cable.control1, cable.control2, cable.end);

                // Calcular tamaño del pulso (más grande cerca del reactor)
                const pulseSize = 3 + t * 4;
                const alpha = pulseIntensity * (0.5 + t * 0.5);

                // Glow del pulso
                if (isHolding) {
                  ctx.save();
                  ctx.shadowColor = '#FF3B30';
                  ctx.shadowBlur = 10;
                  ctx.beginPath();
                  ctx.arc(pulsePos.x, pulsePos.y, pulseSize, 0, Math.PI * 2);
                  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                  ctx.fill();
                  ctx.restore();
                }

                // Pulso principal
                ctx.beginPath();
                ctx.arc(pulsePos.x, pulsePos.y, pulseSize * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = isHolding ? `rgba(255, 255, 255, ${alpha})` : `rgba(100, 100, 100, ${alpha * 0.5})`;
                ctx.fill();

                // Trail del pulso
                if (isHolding && t > 0.05) {
                  const trailStart = getBezierPoint(t - 0.05, cable.start, cable.control1, cable.control2, cable.end);
                  ctx.beginPath();
                  ctx.moveTo(trailStart.x, trailStart.y);
                  ctx.lineTo(pulsePos.x, pulsePos.y);
                  ctx.strokeStyle = `rgba(255, 59, 48, ${alpha * 0.5})`;
                  ctx.lineWidth = 2;
                  ctx.stroke();
                }
              }
            });

            // === CAPA 6: Segmentos/marcas en el cable (estilo técnico) ===
            if (!isHolding) {
              for (let s = 0.2; s < 1; s += 0.2) {
                const segPoint = getBezierPoint(s, cable.start, cable.control1, cable.control2, cable.end);
                ctx.beginPath();
                ctx.arc(segPoint.x, segPoint.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(60, 60, 60, 0.5)`;
                ctx.fill();
              }
            }
          });

          // === Anillo de conexión central (donde todos los cables convergen) ===
          ctx.beginPath();
          ctx.arc(centerX, centerY, coreRadius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = isHolding ? `rgba(255, 59, 48, ${0.6 + Math.sin(Date.now() * 0.005) * 0.2})` : 'rgba(50, 50, 50, 0.5)';
          ctx.lineWidth = isHolding ? 2 : 1;
          ctx.stroke();
      }

      // 3. Partículas / Warp 3D
      if (isWarping) {
        // === WARP 3D - Túnel de Hyperespacio ===
        if (warpStartTime === 0) warpStartTime = Date.now();
        const elapsed = Date.now() - warpStartTime;
        const progress = Math.min(elapsed / warpDuration, 1);

        // Fondo más oscuro durante warp para contraste
        ctx.fillStyle = `rgba(5, 5, 5, ${0.3 + progress * 0.5})`;
        ctx.fillRect(0, 0, width, height);

        // Factor de velocidad que aumenta con el progreso
        const speedMultiplier = 1 + progress * 8;
        const fov = 300;

        warpStars.forEach(star => {
          // Guardar posición Z anterior para el trail
          star.prevZ = star.z;

          // Mover estrella hacia la cámara
          star.z -= star.speed * speedMultiplier;

          // Reciclar estrellas que pasan la cámara
          if (star.z <= 0) {
            star.z = maxDepth;
            star.prevZ = maxDepth;
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
          }

          // Proyección 3D a 2D
          const screenX = centerX + (star.x * fov) / star.z;
          const screenY = centerY + (star.y * fov) / star.z;
          const prevScreenX = centerX + (star.x * fov) / star.prevZ;
          const prevScreenY = centerY + (star.y * fov) / star.prevZ;

          // Solo dibujar si está en pantalla
          if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return;

          // Tamaño basado en profundidad (más cerca = más grande)
          const depth = 1 - star.z / maxDepth;
          const size = star.size * (1 + depth * 3);

          // Alpha basado en profundidad y progreso
          const alpha = Math.min(1, depth * 1.5 + progress * 0.5);

          // Color: rojas o blancas/cyan
          let color: string;
          if (star.isRed) {
            color = `rgba(255, 59, 48, ${alpha})`;
          } else {
            // Mezcla de blanco a cyan según progreso
            const r = Math.floor(200 + progress * 55);
            const g = Math.floor(220 + progress * 35);
            const b = 255;
            color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          }

          // Dibujar trail (línea desde posición anterior)
          ctx.beginPath();
          ctx.moveTo(prevScreenX, prevScreenY);
          ctx.lineTo(screenX, screenY);
          ctx.strokeStyle = color;
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Punto brillante en la punta
          if (depth > 0.5) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, size * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = star.isRed ? `rgba(255, 150, 130, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
          }
        });

        // Flash progresivo al final
        if (progress > 0.7) {
          const flashIntensity = (progress - 0.7) / 0.3;
          ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity * 0.8})`;
          ctx.fillRect(0, 0, width, height);
        }

      } else {
        // === PARTÍCULAS NORMALES (idle/hover/holding) ===
        particles.forEach((p, i) => {
          if (isHolding) {
              p.radius += (50 - p.radius) * 0.1; p.angle += 0.15;
              p.color = "#FF3B30"; p.alpha = 0.8 + Math.random() * 0.2;
          } else if (isHovering) {
              p.radius += (250 + Math.sin(Date.now() * 0.001) * 20 - p.radius) * 0.05;
              p.angle += p.speed; p.color = Math.random() > 0.8 ? "#FF3B30" : "#555";
          } else {
              p.radius += (180 + Math.sin(Date.now() * 0.002 * i) * 10 - p.radius) * 0.05;
              p.angle += p.speed; p.color = Math.random() > 0.9 ? "#FF3B30" : "#333";
          }
          const x = centerX + Math.cos(p.angle) * p.radius;
          const y = centerY + Math.sin(p.angle) * p.radius;

          // Rayos hacia el centro cuando holding
          if (isHolding && Math.random() > 0.95) {
              ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(centerX, centerY);
              ctx.strokeStyle = `rgba(255, 59, 48, 0.3)`; ctx.lineWidth = 1; ctx.stroke();
          }
          ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha;
          ctx.fillRect(x, y, p.size * (isHolding ? 5 : 3), p.size); ctx.globalAlpha = 1;
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };
    const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    render();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [isHolding, isHovering, isWarping]); 

  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isHolding && !isWarping) {
          interval = setInterval(() => {
              setChargeLevel(prev => { if (prev >= 100) return 100; return prev + 2; });
          }, 20);
      } else if (!isWarping) { setChargeLevel(0); }
      return () => clearInterval(interval);
  }, [isHolding, isWarping]);

  // Detectar cuando la carga llega a 100% y disparar warp + navegación
  useEffect(() => {
      if (chargeLevel >= 100 && !isWarping) {
          setIsWarping(true);
          playWarpSound();
          setTimeout(() => {
              onEnter();
          }, 1500);
      }
  }, [chargeLevel, isWarping, playWarpSound, onEnter]);

  const handleMouseEnter = () => {
      setIsHovering(true);
      playBleep(); 
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a] text-white select-none">
      <div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-50" style={{ backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }} />
      <div className="absolute inset-0" style={{ transform: isHolding && !isWarping ? `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*4}px)` : "none", filter: isHolding && !isWarping ? `blur(${chargeLevel * 0.02}px)` : "none" }}>
         <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      </div>
      <div className={cn("absolute inset-0 z-30 pointer-events-none p-8 md:p-16 flex flex-col justify-between transition-opacity duration-500", isWarping ? "opacity-0" : "opacity-100")}>
        <div className="flex justify-between items-start">
            <div><div className="text-[10px] text-[#FF3B30] font-mono tracking-[0.2em] mb-1">SYSTEM_ID</div><h1 className={cn("text-4xl md:text-6xl font-bold tracking-tighter leading-none mix-blend-difference", manrope.className)}>INDUSTRIAL <br/> CORE</h1></div>
            <div className="text-right hidden md:block"><div className="text-[10px] text-[#FF3B30] font-mono tracking-[0.2em] mb-1">STATUS</div><div className={cn("text-xl font-mono", spaceMono.className)}>{isHolding ? "CRITICAL" : "ONLINE"}</div><div className="flex gap-4 justify-end mt-2 font-mono text-xs opacity-60"><div>MEM: {memory}</div><div>LAT: {Math.floor(latency)}ms</div></div></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <button ref={buttonRef} onMouseEnter={handleMouseEnter} onMouseLeave={() => { setIsHovering(false); setIsHolding(false); stopCharge(); stopDrone(); }} onMouseDown={() => { setIsHolding(true); startDrone(); startCharge(); }} onMouseUp={() => { if (!isWarping) { setIsHolding(false); stopCharge(); stopDrone(); } }}
                className={cn("relative group w-64 h-64 rounded-full flex items-center justify-center transition-all duration-100", isHolding ? "scale-95" : "hover:scale-105")}>
                <div className={cn("absolute inset-0 rounded-full border border-[#333] bg-black/40 backdrop-blur-sm transition-all duration-300", isHolding ? "border-[#FF3B30] border-4 shadow-[0_0_50px_rgba(255,59,48,0.5)]" : "group-hover:border-white/30")} />
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"><circle cx="128" cy="128" r="120" fill="none" stroke="#FF3B30" strokeWidth="4" strokeDasharray="754" strokeDashoffset={754 - (754 * chargeLevel) / 100} className="transition-all duration-75 ease-linear" /></svg>
                <div className={cn("absolute inset-0 rounded-full border-2 border-dashed border-[#FF3B30]/30 animate-spin-slow transition-opacity", isHolding ? "opacity-100 duration-100 animate-spin-fast" : "opacity-0")} />
                <div className="text-center z-10"><span className={cn("block text-xs font-bold tracking-[0.2em] uppercase transition-colors", isHolding ? "text-[#FF3B30]" : "text-white group-hover:text-[#FF3B30]")}>{isHolding ? (chargeLevel >= 100 ? "INITIATED" : `${chargeLevel}%`) : "HOLD TO INIT"}</span>{isHolding && chargeLevel < 100 && <span className="block text-[10px] text-[#FF3B30] mt-1 animate-pulse">CHARGING</span>}</div>
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#333] pt-8 bg-black/20 backdrop-blur-sm pointer-events-auto">
             <div className="group hover:bg-[#FF3B30]/10 p-2 transition-colors rounded"><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2 text-[#FF3B30] text-[10px] font-bold tracking-widest"><Cpu size={14}/> LOAD</div><span className={cn("text-xs font-mono", spaceMono.className)}>{Math.floor(cpu)}%</span></div><div className="w-full h-1 bg-[#333] overflow-hidden"><div className="h-full bg-[#FF3B30] transition-all duration-500" style={{ width: `${cpu}%` }} /></div></div>
             <div className="group hover:bg-[#FF3B30]/10 p-2 transition-colors rounded"><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2 text-[#FF3B30] text-[10px] font-bold tracking-widest"><Activity size={14}/> NETWORK</div></div><Sparkline data={history} color="#FF3B30" /></div>
             <div className="group hover:bg-[#FF3B30]/10 p-2 transition-colors rounded"><div className="flex items-center gap-2 text-[#FF3B30] text-[10px] font-bold tracking-widest"><Fingerprint size={14}/> IDENTITY</div><p className={cn("text-xs opacity-70 leading-relaxed", spaceMono.className)}>Robust engineering meets minimalist aesthetics.</p></div>
        </div>
      </div>
    </div>
  );
};
