"use client";

import React, { useState, useEffect, useRef } from "react";
import { Manrope, Space_Mono } from "next/font/google";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useAnimationFrame
} from "framer-motion";
import {
  ArrowUpRight,
  Terminal,
  ExternalLink,
  Github,
  Linkedin,
  ChevronRight,
  Cpu,
  Server,
  Database,
  Code2,
  Globe,
  ArrowDown,
  Lock,
  Unlock,
  FileText,
  Radio,
  ArrowLeft,
  Mail,
  Signal,
  Folder,
  FolderOpen,
  Layout,
  Layers,
  Cloud,
  Brain,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useArrivalSound } from "@/hooks/use-arrival-sound";
import { projects, skills, profile, type Project } from "@/data/projects";
import { GridScan } from "@/components/GridScan";

import { MissionIndex3D } from "@/components/MissionIndex3D";

// --- Typography ---
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// ============================================================================
// SCROLL-BASED HOOKS & COMPONENTS
// ============================================================================

// --- Scroll Progress Bar ---
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#FF3B30] origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};

// --- Animated Counter ---
const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth finish
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

// --- Parallax Text ---
const ParallaxText = ({
  children,
  baseVelocity = 5,
  className
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useTransform(scrollY, [0, 1000], [0, baseVelocity * 10]);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  const x = useTransform(baseX, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    let moveBy = baseVelocity * (delta / 1000);
    moveBy += smoothVelocity.get() * (delta / 10000);
    baseX.set(baseX.get() + moveBy);
    if (baseX.get() < -50) baseX.set(0);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className={cn("flex gap-8", className)} style={{ x }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex-shrink-0">{children}</span>
        ))}
      </motion.div>
    </div>
  );
};

// --- Reveal on Scroll ---
const RevealOnScroll = ({
  children,
  direction = "up",
  delay = 0,
  className
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Magnetic Button ---
const MagneticButton = ({
  children,
  className,
  href
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  );
};

// --- Stagger Container ---
const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.1
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// ============================================================================
// GEMINI ANIMATION COMPONENTS
// ============================================================================

// --- Glitch Reveal Effect ---
const GlitchReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const animationParams = React.useMemo(() => {
    const steps = Math.floor(Math.random() * 6) + 4;
    const keyframesOpacity = [0];
    const keyframesFilter = ["brightness(1)"];
    const times = [0];

    let currentTime = 0;

    for (let i = 0; i < steps; i++) {
      const isVisible = Math.random() > 0.5;
      const brightness = isVisible ? (Math.random() * 2 + 1) : 0;
      const duration = Math.random() * 0.2 + 0.05;

      keyframesOpacity.push(isVisible ? (Math.random() * 0.5 + 0.5) : 0);
      keyframesFilter.push(`brightness(${brightness})`);

      currentTime += duration;
      times.push(currentTime);
    }

    keyframesOpacity.push(1);
    keyframesFilter.push("brightness(1)");
    times.push(currentTime + 0.1);

    const totalDuration = times[times.length - 1];
    const normalizedTimes = times.map(t => t / totalDuration);

    return {
      opacity: keyframesOpacity,
      filter: keyframesFilter,
      times: normalizedTimes,
      duration: totalDuration + (Math.random() * 1.0)
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: animationParams.opacity,
        filter: animationParams.filter
      }}
      transition={{
        duration: animationParams.duration,
        delay: delay + Math.random() * 0.5,
        times: animationParams.times
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};

// --- Data Ticker ---
const DataTicker = () => {
  const items = [
    "SYS_OP: NORMAL", "MEM_ALLOC: 64TB", "NET_LATENCY: 12ms",
    "ENCRYPTION: AES-4096", "AI_CORE: ONLINE", "NEURAL_LINK: ACTIVE",
    "TARGET: PRODUCTION", "UPTIME: 99.999%", "BUILD: v2.0.26"
  ];

  return (
    <div className="w-full overflow-hidden bg-[#FF3B30]/5 border-y border-[#FF3B30]/10 py-2 relative select-none">
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-[#030303] z-10" />
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className={cn("text-[10px] text-[#FF3B30]/70 font-mono tracking-widest flex items-center gap-2", spaceMono.className)}>
            <span className="w-1 h-1 bg-[#FF3B30]/50" />
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================================================
// ANIMATION COMPONENTS
// ============================================================================

// --- Animated Terminal ---
const AnimatedTerminal = () => {
  const [lines, setLines] = useState<{ type: 'command' | 'output' | 'success' | 'error'; text: string }[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  const terminalScript = [
    { type: 'command' as const, text: '$ whoami' },
    { type: 'output' as const, text: 'kevin.narvaez // AI Product System Engineer' },
    { type: 'command' as const, text: '$ cat /etc/status' },
    { type: 'success' as const, text: '[ONLINE] Available for deployment' },
    { type: 'command' as const, text: '$ ls ~/skills/' },
    { type: 'output' as const, text: 'python/  typescript/  rust/  go/' },
    { type: 'output' as const, text: 'tensorflow/  pytorch/  langchain/' },
    { type: 'output' as const, text: 'kubernetes/  docker/  aws/  gcp/' },
    { type: 'command' as const, text: '$ neural-link --status' },
    { type: 'success' as const, text: '[ACTIVE] Bridging AI ↔ Production' },
    { type: 'command' as const, text: '$ uptime' },
    { type: 'output' as const, text: `${new Date().getFullYear() - 2019}+ years building digital systems` },
    { type: 'command' as const, text: '$ tail -f /var/log/mission.log' },
    { type: 'output' as const, text: 'Transforming complex AI into scalable solutions...' },
    { type: 'success' as const, text: '[READY] Awaiting next mission_' },
  ];

  useEffect(() => {
    if (currentLine >= terminalScript.length) {
      // Restart after delay
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
        setIsTyping(true);
      }, 5000);
      return () => clearTimeout(timeout);
    }

    const current = terminalScript[currentLine];
    const isCommand = current.type === 'command';
    const typingSpeed = isCommand ? 50 : 15;

    if (currentChar < current.text.length) {
      const timeout = setTimeout(() => {
        setLines(prev => {
          const newLines = [...prev];
          if (newLines.length <= currentLine) {
            newLines.push({ type: current.type, text: '' });
          }
          newLines[currentLine] = {
            type: current.type,
            text: current.text.slice(0, currentChar + 1)
          };
          return newLines;
        });
        setCurrentChar(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const delay = isCommand ? 300 : 150;
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full h-full bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className={cn("text-[10px] text-neutral-500 ml-4 uppercase tracking-widest", spaceMono.className)}>
          knarvaez@neural-core:~
        </span>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className={cn("flex-1 p-4 overflow-y-auto text-sm leading-relaxed", spaceMono.className)}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "mb-1",
              line.type === 'command' && "text-white",
              line.type === 'output' && "text-neutral-400 pl-2",
              line.type === 'success' && "text-green-500 pl-2",
              line.type === 'error' && "text-[#FF3B30] pl-2"
            )}
          >
            {line.text}
            {i === lines.length - 1 && currentLine < terminalScript.length && (
              <motion.span
                className="inline-block w-2 h-4 bg-[#FF3B30] ml-1 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        ))}
        {currentLine >= terminalScript.length && (
          <motion.span
            className="inline-block w-2 h-4 bg-[#FF3B30]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};

const ScrambleText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const [display, setDisplay] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let iteration = 0;

    const startScramble = () => {
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    };

    timeout = setTimeout(startScramble, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className={className}>{display}</span>;
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const SectionHeader = ({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) => (
  <RevealOnScroll direction="up" className="mb-16 relative">
    <div className={cn("flex items-center gap-4 mb-4 text-[#FF3B30] text-xs uppercase tracking-[0.2em]", spaceMono.className)}>
      <span className="w-2 h-2 bg-[#FF3B30]" />
      <span>// {label}</span>
      <motion.span
        className="flex-1 h-[1px] bg-gradient-to-r from-[#FF3B30]/50 to-transparent origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </div>
    <h2 className={cn("text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-100 uppercase", manrope.className)}>
      {title}
    </h2>
    {subtitle && (
      <p className={cn("mt-4 text-neutral-500 max-w-xl text-sm md:text-base", spaceMono.className)}>
        {subtitle}
      </p>
    )}
  </RevealOnScroll>
);

const IndustrialButton = ({
  children,
  className,
  href,
  variant = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "ghost" | "outline";
}) => {
  const variants = {
    primary: "bg-[#FF3B30] text-white hover:bg-[#ff5d53] border border-transparent shadow-[0_0_20px_-5px_#FF3B30]",
    ghost: "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5",
    outline: "bg-transparent border border-neutral-700 text-neutral-100 hover:border-[#FF3B30] hover:text-[#FF3B30]"
  };

  return (
    <MagneticButton
      href={href}
      className={cn(
        "group relative px-6 py-3 uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2",
        "[clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]",
        variants[variant],
        spaceMono.className,
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'outline' && (
        <div className="absolute inset-0 bg-[#FF3B30]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      )}
    </MagneticButton>
  );
};

// --- Project Card with Scroll Effects ---
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const statusConfig = {
    DEPLOYED: { color: "text-emerald-500", border: "border-emerald-500/30", bg: "bg-emerald-500/10", label: "Active" },
    IN_PROGRESS: { color: "text-amber-500", border: "border-amber-500/30", bg: "bg-amber-500/10", label: "Building" },
    ARCHIVED: { color: "text-neutral-500", border: "border-neutral-500/30", bg: "bg-neutral-500/10", label: "Archived" }
  };

  const config = statusConfig[project.status as keyof typeof statusConfig];

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full min-h-[400px] bg-black/60 border border-white/5 backdrop-blur-md rounded-sm overflow-hidden flex flex-col hover:border-[#FF3B30]/50 transition-colors duration-500"
    >
      {/* HUD Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 group-hover:border-[#FF3B30] transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 group-hover:border-[#FF3B30] transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 group-hover:border-[#FF3B30] transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 group-hover:border-[#FF3B30] transition-colors duration-300" />

      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-start justify-between relative z-10">
        <div className={cn("flex items-center gap-2 text-xs text-neutral-500", spaceMono.className)}>
          <FileText size={12} />
          <span>{project.id}</span>
        </div>
        <div className={cn("text-[9px] px-2 py-1 border rounded uppercase tracking-wider flex items-center gap-2", config.color, config.border, config.bg, spaceMono.className)}>
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", project.status === 'DEPLOYED' ? "bg-emerald-500" : project.status === 'IN_PROGRESS' ? "bg-amber-500" : "bg-neutral-500")} />
          {config.label}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1 relative z-10 flex flex-col">
        {/* Codename - Always visible */}
        <h3 className={cn("text-4xl font-black text-white/90 mb-2 uppercase tracking-tight", manrope.className)}>
          {project.codename}
        </h3>
        
        {/* Real Title - Reveal on Hover */}
        <div className="h-8 mb-6">
           {isHovered ? (
             <ScrambleText text={project.title} className={cn("text-sm text-[#FF3B30] font-bold uppercase tracking-wider", spaceMono.className)} />
           ) : (
             <span className={cn("text-sm text-neutral-600 font-bold uppercase tracking-wider", spaceMono.className)}>
               // SYSTEM_LOCKED
             </span>
           )}
        </div>

        {/* Encrypted/Decrypted Details */}
        <div className="space-y-4 flex-1">
           <div className="relative pl-4 border-l-2 border-white/10 group-hover:border-[#FF3B30]/50 transition-colors">
              <h4 className={cn("text-[10px] uppercase tracking-widest text-neutral-500 mb-1", spaceMono.className)}>Mission Objective</h4>
              {isHovered ? (
                 <p className="text-sm text-neutral-300 leading-relaxed">{project.glitch}</p>
              ) : (
                 <div className="flex flex-col gap-1 opacity-30">
                    <div className="h-2 bg-white w-3/4 animate-pulse" />
                    <div className="h-2 bg-white w-1/2 animate-pulse" />
                    <div className="h-2 bg-white w-2/3 animate-pulse" />
                 </div>
              )}
           </div>

           <div className="relative pl-4 border-l-2 border-white/10 group-hover:border-emerald-500/50 transition-colors">
              <h4 className={cn("text-[10px] uppercase tracking-widest text-neutral-500 mb-1", spaceMono.className)}>Execution</h4>
              {isHovered ? (
                 <p className="text-sm text-neutral-300 leading-relaxed">{project.patch}</p>
              ) : (
                 <div className="flex flex-col gap-1 opacity-30">
                    <div className="h-2 bg-white w-full animate-pulse delay-75" />
                    <div className="h-2 bg-white w-5/6 animate-pulse delay-75" />
                 </div>
              )}
           </div>
        </div>

        {/* Action / Lock State */}
        <div className="mt-8 flex justify-between items-center">
           <div className="flex gap-2">
              {project.stack.slice(0, 3).map((tech, i) => (
                <span key={i} className={cn("text-[9px] text-neutral-500 border border-white/5 bg-white/5 px-1.5 py-0.5 rounded-sm", spaceMono.className)}>
                  {tech}
                </span>
              ))}
           </div>
           
           <div className={cn("transition-colors duration-300", isHovered ? "text-[#FF3B30]" : "text-neutral-700")}>
              {isHovered ? <Unlock size={20} /> : <Lock size={20} />}
           </div>
        </div>
      </div>

      {/* Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-20" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF3B30]/5 to-transparent h-[20%] w-full animate-scan pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

// --- Mission Access Terminal (Login Screen) ---
const MissionAccessTerminal = ({ onUnlock }: { onUnlock: () => void }) => {
  const [textState, setTextState] = useState(0);
  const [accessText, setAccessText] = useState("");
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") onUnlock();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUnlock]);

  // Typing effect for the "boot" sequence of the terminal
  useEffect(() => {
    if (textState === 0) {
      let i = 0;
      const txt = "ESTABLISHING SECURE CONNECTION...";
      const interval = setInterval(() => {
        setAccessText(txt.slice(0, i));
        i++;
        if (i > txt.length) {
          clearInterval(interval);
          setTimeout(() => setTextState(1), 500);
        }
      }, 30);
      return () => clearInterval(interval);
    } else if (textState === 1) {
      setAccessText("CONNECTION ESTABLISHED.");
      setTimeout(() => setTextState(2), 500);
    }
  }, [textState]);

  return (
    <div className="w-full h-[600px] bg-black border border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-6 group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Scanline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF3B30]/5 to-transparent h-[10%] w-full animate-scan pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Lock Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#FF3B30]/20 blur-xl rounded-full" />
          <Lock size={64} className="text-[#FF3B30] relative z-10" />
        </motion.div>

        {/* Status Text */}
        <div className={cn("font-mono text-sm h-12", spaceMono.className)}>
          <span className="text-[#FF3B30]">{accessText}</span>
          <span className="animate-pulse text-[#FF3B30]">_</span>
        </div>

        {/* Main Title */}
        <h3 className={cn("text-3xl md:text-5xl font-black text-white uppercase tracking-tighter", manrope.className)}>
          Restricted Archives
        </h3>
        
        <p className="text-neutral-500 text-sm max-w-md">
          Level 5 Security Clearance required. Accessing these files will log your IP address to the central mainframe.
        </p>

        {/* Input / Action Area */}
        <div className="w-full max-w-sm relative group/input">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3B30] to-[#FF3B30]/50 rounded opacity-20 group-hover/input:opacity-50 transition duration-500 blur" />
           <button 
             onClick={onUnlock}
             className={cn("relative w-full bg-black border border-[#FF3B30]/30 text-[#FF3B30] hover:text-white hover:bg-[#FF3B30] transition-all duration-300 py-4 px-8 uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-between group/btn", spaceMono.className)}
           >
             <span>Initialize Decryption</span>
             <span className="bg-[#FF3B30]/20 px-2 py-1 text-[10px] rounded group-hover/btn:bg-white/20 group-hover/btn:text-white">ENTER ⏎</span>
           </button>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#FF3B30]/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#FF3B30]/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#FF3B30]/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#FF3B30]/30" />
    </div>
  );
};

// --- System Loader (Glitchy Loading Screen) ---
const SystemLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING...");

  useEffect(() => {
    const steps = [
      { p: 20, t: "BYPASSING_FIREWALL..." },
      { p: 45, t: "DECRYPTING_INDEX..." },
      { p: 70, t: "MOUNTING_VIRTUAL_DRIVE..." },
      { p: 90, t: "LOADING_GUI_ASSETS..." },
      { p: 100, t: "SYSTEM_READY" }
    ];

    let currentStep = 0;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        // Random jumps in progress for "hacking" feel
        const jump = Math.random() * 2;
        const next = Math.min(prev + jump, 100);

        if (currentStep < steps.length && next >= steps[currentStep].p) {
          setStatusText(steps[currentStep].t);
          currentStep++;
        }

        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-[600px] bg-black border border-white/10 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 bg-red-500/5 animate-pulse" style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 60%)" }} />

      <div className="w-full max-w-md relative z-10 space-y-4">
        <div className="flex justify-between text-xs font-mono text-[#FF3B30]">
          <ScrambleText text={statusText} />
          <span>{Math.floor(progress)}%</span>
        </div>
        
        <div className="h-2 w-full bg-[#1a1a1a] border border-[#333] p-[1px]">
          <motion.div 
            className="h-full bg-[#FF3B30]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="font-mono text-[10px] text-neutral-500 h-20 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="opacity-50">
              {`> 0x${Math.floor(Math.random()*10000).toString(16)} module_load::OK`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Arsenal App (Tech Stack) - Military Style ---
const ArsenalApp = ({ onClose }: { onClose: () => void }) => {
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [glitchText, setGlitchText] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [flicker, setFlicker] = useState(false);

  // Glitch text effect - random short bursts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 50 + Math.random() * 80);
      }
    }, 1500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Scan line - jumps in steps
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(Math.floor(Math.random() * 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Screen flicker
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 30);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const folders = [
    {
      id: "frontend",
      code: "FE-001",
      label: "FRONTEND",
      classification: "INTERFACE_SYSTEMS",
      icon: Layout,
      status: "ACTIVE",
      description: "Client-side rendering and user interface modules. Primary focus on reactive component architecture.",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"]
    },
    {
      id: "backend",
      code: "BE-002",
      label: "BACKEND",
      classification: "SERVER_OPERATIONS",
      icon: Server,
      status: "ACTIVE",
      description: "Server-side logic processors and API gateway configurations. Handles data flow and authentication.",
      items: ["Node.js", "NestJS", "Python", "FastAPI", "Go", "GraphQL"]
    },
    {
      id: "devops",
      code: "DO-003",
      label: "DEVOPS",
      classification: "DEPLOYMENT_OPS",
      icon: Cloud,
      status: "ACTIVE",
      description: "Infrastructure provisioning and continuous deployment pipelines. Cloud resource orchestration.",
      items: ["Docker", "Kubernetes", "AWS", "GCP", "Terraform", "CI/CD"]
    },
    {
      id: "data",
      code: "DT-004",
      label: "DATA",
      classification: "STORAGE_SYSTEMS",
      icon: Database,
      status: "ACTIVE",
      description: "Persistent storage solutions and real-time data streaming. Query optimization and caching layers.",
      items: ["PostgreSQL", "Redis", "MongoDB", "Kafka", "Elasticsearch", "Prisma"]
    },
    {
      id: "ml",
      code: "AI-005",
      label: "ML/AI",
      classification: "NEURAL_SYSTEMS",
      icon: Brain,
      status: "EXPERIMENTAL",
      description: "Machine learning frameworks and large language model integrations. Vector databases and embeddings.",
      items: ["PyTorch", "TensorFlow", "LangChain", "Hugging Face", "OpenAI", "Pinecone"]
    },
    {
      id: "tools",
      code: "TL-006",
      label: "TOOLS",
      classification: "UTILITY_MODULES",
      icon: Wrench,
      status: "ACTIVE",
      description: "Development environment configurations and operational practices. System monitoring and design patterns.",
      items: ["Git", "Vim", "Linux", "Observability", "System Design", "API Design"]
    }
  ];

  const activeFolder = folders.find(f => f.id === (selectedFolder || hoveredFolder));

  return (
    <div className={cn(
      "w-full h-full min-h-[600px] bg-[#050505] relative overflow-hidden flex flex-col",
      spaceMono.className,
      flicker && "brightness-150"
    )}>
      {/* Flicker overlay */}
      {flicker && <div className="absolute inset-0 bg-white/5 z-50 pointer-events-none" />}

      {/* Scan line - jumps around */}
      <div
        className="absolute left-0 right-0 h-[2px] bg-[#FF3B30]/20 pointer-events-none z-40"
        style={{ top: `${scanLine}%` }}
      />

      {/* RGB split on glitch */}
      {glitchText && (
        <>
          <div className="absolute inset-0 bg-[#ff0000]/[0.03] translate-x-[3px] pointer-events-none z-30" />
          <div className="absolute inset-0 bg-[#00ffff]/[0.03] -translate-x-[3px] pointer-events-none z-30" />
        </>
      )}

      {/* Scan lines texture */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.04]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#FF3B30 1px, transparent 1px), linear-gradient(90deg, #FF3B30 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* Corner brackets - shift on glitch */}
      <div className={cn("absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#FF3B30]/30 pointer-events-none", glitchText && "translate-x-[2px] border-[#00ffff]/50")} />
      <div className={cn("absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#FF3B30]/30 pointer-events-none", glitchText && "-translate-x-[2px] border-[#00ffff]/50")} />
      <div className={cn("absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#FF3B30]/30 pointer-events-none", glitchText && "translate-x-[1px]")} />
      <div className={cn("absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#FF3B30]/30 pointer-events-none", glitchText && "-translate-x-[1px]")} />

      {/* Header */}
      <div className="h-12 bg-black/90 border-b border-[#FF3B30]/20 flex items-center justify-between px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent" />

        <div className="flex items-center gap-4">
          <button onClick={onClose} className="flex items-center gap-2 text-neutral-600 hover:text-[#FF3B30] group">
            <div className="w-6 h-6 border border-neutral-800 group-hover:border-[#FF3B30]/50 flex items-center justify-center">
              <ArrowLeft size={12} />
            </div>
            <span className="text-[9px] uppercase tracking-wider">Exit</span>
          </button>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 bg-[#FF3B30]", glitchText && "bg-[#00ffff]")} />
              <span className={cn(
                "text-[11px] text-[#FF3B30] uppercase tracking-[0.2em] relative",
                glitchText && "text-[#00ffff]"
              )}>
                {glitchText ? "Ar$3nal D@tab@se" : "Arsenal Database"}
                {glitchText && <span className="absolute inset-0 text-[#ff0000]/50 translate-x-[1px]">Ar$3nal D@tab@se</span>}
              </span>
            </div>
            <div className={cn(
              "text-[8px] text-neutral-700 uppercase tracking-wider",
              glitchText && "text-[#FF3B30]/50 translate-x-[-1px]"
            )}>
              {glitchText ? "T3chn1cal Cap@b1l1t1es R3g1stry" : "Technical Capabilities Registry"}
            </div>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-4 text-[8px] text-neutral-600",
          glitchText && "text-[#00ffff]/50"
        )}>
          <span>{glitchText ? `S3CT0RS: ${Math.floor(Math.random() * 99)}` : `SECTORS: ${folders.length}`}</span>
          <span className="text-neutral-800">|</span>
          <span>{glitchText ? `M0DUL3S: ???` : `MODULES: ${folders.reduce((acc, f) => acc + f.items.length, 0)}`}</span>
          <span className="text-neutral-800">|</span>
          <span className={cn("text-[#FF3B30]/70", glitchText && "text-[#ff0000]/70")}>
            {glitchText ? "CL3@R@NC3: ERR" : "CLEARANCE: L3"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Folders Panel */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[8px] text-neutral-700 uppercase tracking-[0.3em] mb-1">[SECTOR_INDEX]</div>
              <div className="text-[10px] text-neutral-500">Select module cluster for detailed analysis</div>
            </div>
            <div className="text-[8px] text-neutral-800 text-right">
              REF: ARN-2026-{Math.floor(Math.random() * 9000 + 1000)}
            </div>
          </div>

          {/* Folder Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onMouseEnter={() => setHoveredFolder(folder.id)}
                onMouseLeave={() => setHoveredFolder(null)}
                onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
                className={cn(
                  "group cursor-pointer relative border",
                  (selectedFolder === folder.id || hoveredFolder === folder.id)
                    ? "border-[#FF3B30]/50 bg-[#FF3B30]/5"
                    : "border-white/5 bg-black/50 hover:border-white/10"
                )}
              >
                {/* Top accent line - instant */}
                {(selectedFolder === folder.id || hoveredFolder === folder.id) && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF3B30]" />
                )}

                {/* Folder header */}
                <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                  <span className={cn(
                    "text-[8px] text-[#FF3B30]/70",
                    glitchText && "text-[#00ffff]/70 tracking-[0.3em]"
                  )}>
                    {glitchText ? folder.code.replace(/[0-9]/g, () => String(Math.floor(Math.random() * 10))) : folder.code}
                  </span>
                  <span className={cn(
                    "text-[7px] px-1.5 py-0.5 uppercase tracking-wider",
                    folder.status === "EXPERIMENTAL"
                      ? "bg-amber-500/10 text-amber-500/70 border border-amber-500/20"
                      : "bg-green-500/10 text-green-500/70 border border-green-500/20",
                    glitchText && "opacity-50 translate-x-[1px]"
                  )}>
                    {glitchText ? (folder.status === "EXPERIMENTAL" ? "ERR0R" : "0NL1NE") : folder.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Icon */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className={cn(
                      "w-10 h-10 border flex items-center justify-center relative",
                      (selectedFolder === folder.id || hoveredFolder === folder.id)
                        ? "border-[#FF3B30]/50 text-[#FF3B30]"
                        : "border-white/10 text-neutral-600",
                      glitchText && "border-[#00ffff]/50"
                    )}>
                      <folder.icon size={20} className={cn(glitchText && "opacity-50")} />
                      {glitchText && <folder.icon size={20} className="absolute text-[#ff0000]/30 translate-x-[2px]" />}
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-[8px] text-neutral-700 tabular-nums",
                        glitchText && "text-[#FF3B30]/50"
                      )}>
                        {glitchText ? `${Math.floor(Math.random() * 99)} ERR` : `${folder.items.length} MODULES`}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className={cn(
                    "text-[12px] font-medium mb-1 relative",
                    (selectedFolder === folder.id || hoveredFolder === folder.id) ? "text-white" : "text-neutral-400",
                    glitchText && "text-[#00ffff]"
                  )}>
                    {glitchText ? folder.label.split('').map((c, i) => Math.random() > 0.7 ? String.fromCharCode(33 + Math.floor(Math.random() * 14)) : c).join('') : folder.label}
                    {glitchText && <span className="absolute inset-0 text-[#ff0000]/40 translate-x-[1px] -translate-y-[1px]">{folder.label}</span>}
                  </div>
                  <div className={cn(
                    "text-[8px] text-neutral-700 uppercase tracking-wider",
                    glitchText && "opacity-30"
                  )}>
                    {glitchText ? "████████████" : folder.classification}
                  </div>

                  {/* Loading bar - stepped */}
                  <div className="mt-4 h-[2px] bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-[#FF3B30]"
                      style={{
                        width: (selectedFolder === folder.id || hoveredFolder === folder.id) ? "100%" : "0%",
                        transition: "width 0.15s steps(5)",
                        backgroundColor: glitchText ? "#00ffff" : undefined
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Info Panel */}
        <div className={cn(
          "w-80 border-l border-white/5 bg-black/80 flex flex-col",
          glitchText && "border-[#00ffff]/20"
        )}>
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-white/5 bg-black/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5",
                  activeFolder ? "bg-[#FF3B30]" : "bg-neutral-800",
                  glitchText && "bg-[#00ffff] scale-150"
                )} />
                <span className={cn(
                  "text-[9px] text-neutral-500 uppercase tracking-wider",
                  glitchText && "text-[#00ffff]/70 tracking-[0.4em]"
                )}>
                  {glitchText ? "S3ct0r @nalys1s" : "Sector Analysis"}
                </span>
              </div>
              {activeFolder && (
                <span className={cn(
                  "text-[8px] text-[#FF3B30]/70",
                  glitchText && "text-[#00ffff]/70"
                )}>
                  {glitchText ? "???-???" : activeFolder.code}
                </span>
              )}
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-auto">
            {activeFolder ? (
              <div
                key={activeFolder.id}
                className="p-4 space-y-4"
              >
                {/* Header info */}
                <div className="border border-white/5 bg-black/50 p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30]">
                      <activeFolder.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] text-white font-medium">{activeFolder.label}</div>
                      <div className="text-[8px] text-neutral-600 uppercase tracking-wider mt-0.5">{activeFolder.classification}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={cn("w-1.5 h-1.5", activeFolder.status === "EXPERIMENTAL" ? "bg-amber-500" : "bg-green-500")} />
                        <span className="text-[8px] text-neutral-500">{activeFolder.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-[8px] text-neutral-700 uppercase tracking-wider mb-2">[DESCRIPTION]</div>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    {activeFolder.description}
                  </p>
                </div>

                {/* Modules list */}
                <div>
                  <div className={cn(
                    "text-[8px] text-neutral-700 uppercase tracking-wider mb-2",
                    glitchText && "text-[#FF3B30]/50"
                  )}>
                    {glitchText ? "[L0AD1NG_M0DUL3S]" : "[LOADED_MODULES]"}
                  </div>
                  <div className={cn(
                    "border border-white/5 bg-black/30",
                    glitchText && "border-[#00ffff]/10"
                  )}>
                    {activeFolder.items.map((item, i) => (
                      <div
                        key={item}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 border-b border-white/5 last:border-b-0 hover:bg-[#FF3B30]/10 group cursor-default",
                          glitchText && i % 2 === 0 && "translate-x-[2px] opacity-60"
                        )}
                      >
                        <span className={cn(
                          "text-[8px] text-neutral-700 w-6 tabular-nums",
                          glitchText && "text-[#00ffff]/50"
                        )}>
                          {glitchText ? String(Math.floor(Math.random() * 99)).padStart(2, '0') : String(i + 1).padStart(2, '0')}
                        </span>
                        <div className={cn(
                          "w-1 h-1 bg-[#FF3B30]/50 group-hover:bg-[#FF3B30]",
                          glitchText && "bg-[#00ffff] scale-150"
                        )} />
                        <span className={cn(
                          "text-[10px] text-neutral-400 group-hover:text-white",
                          glitchText && "text-[#00ffff]/70"
                        )}>
                          {glitchText ? item.split('').map(c => Math.random() > 0.8 ? '█' : c).join('') : item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className={cn("grid grid-cols-2 gap-2", glitchText && "gap-3")}>
                  <div className={cn(
                    "border border-white/5 bg-black/30 p-2 relative overflow-hidden",
                    glitchText && "border-[#00ffff]/20 translate-y-[-1px]"
                  )}>
                    <div className={cn(
                      "absolute top-0 left-0 w-full h-[1px] bg-[#FF3B30]/30",
                      glitchText && "bg-[#00ffff]/50 h-[2px]"
                    )} />
                    <div className="text-[8px] text-neutral-700">{glitchText ? "PR0F1C13NCY" : "PROFICIENCY"}</div>
                    <div className={cn(
                      "text-[14px] text-[#FF3B30] tabular-nums",
                      glitchText && "text-[#00ffff]"
                    )}>
                      {glitchText ? `${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 10)}%` : "98.2%"}
                    </div>
                  </div>
                  <div className={cn(
                    "border border-white/5 bg-black/30 p-2 relative overflow-hidden",
                    glitchText && "border-[#FF3B30]/20 translate-y-[1px]"
                  )}>
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
                    <div className="text-[8px] text-neutral-700">{glitchText ? "D3PL0YM3NTS" : "DEPLOYMENTS"}</div>
                    <div className={cn(
                      "text-[14px] text-white tabular-nums",
                      glitchText && "text-[#ff0000]/70"
                    )}>
                      {glitchText ? `${Math.floor(Math.random() * 999)}+` : "147+"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4">
                <div className={cn("text-center", glitchText && "translate-x-[1px]")}>
                  <div className={cn(
                    "w-16 h-16 border border-white/5 flex items-center justify-center mx-auto mb-4 relative",
                    glitchText && "border-[#00ffff]/20"
                  )}>
                    <Folder size={24} className={cn("text-neutral-800", glitchText && "text-[#00ffff]/30")} />
                    {glitchText && <Folder size={24} className="absolute text-[#ff0000]/20 translate-x-[2px] -translate-y-[1px]" />}
                  </div>
                  <div className={cn(
                    "text-[9px] text-neutral-700 uppercase tracking-wider",
                    glitchText && "text-[#00ffff]/50 tracking-[0.3em]"
                  )}>
                    {glitchText ? "N0 S3CT0R S3L3CT3D" : "No Sector Selected"}
                  </div>
                  <div className={cn(
                    "text-[8px] text-neutral-800 mt-1",
                    glitchText && "opacity-30"
                  )}>
                    {glitchText ? "████ ██ █████ █ ██████<br/>██ ████ ██████████████" : "Hover or click a sector"}<br/>
                    {!glitchText && "to view specifications"}
                  </div>
                  <div className={cn(
                    "mt-4 text-[8px] text-[#FF3B30]/50",
                    glitchText && "text-[#00ffff]/70"
                  )}>
                    {">"} {glitchText ? "SY$T3M_1DL3_" : "AWAITING_INPUT_"}
                    <span className={cn(glitchText && "animate-pulse")}>█</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className={cn(
            "px-4 py-2 border-t border-white/5 bg-black/50",
            glitchText && "border-[#00ffff]/10"
          )}>
            <div className="flex items-center justify-between text-[8px]">
              <span className={cn("text-neutral-700", glitchText && "text-[#00ffff]/40")}>
                {glitchText ? "T0TAL_M0DUL3S" : "TOTAL_MODULES"}
              </span>
              <span className={cn("text-neutral-500", glitchText && "text-[#FF3B30]/50")}>
                {glitchText ? `${Math.floor(Math.random() * 999)}` : folders.reduce((acc, f) => acc + f.items.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "h-8 bg-black/90 border-t border-[#FF3B30]/10 flex items-center justify-between px-4",
        glitchText && "border-[#00ffff]/20"
      )}>
        <div className="flex items-center gap-4 text-[8px]">
          <span className={cn("text-neutral-700", glitchText && "text-[#00ffff]/50")}>
            {glitchText ? "ARS3NAL_DB::v?.?.?" : "ARSENAL_DB::v2.1.0"}
          </span>
          <span className="text-neutral-800">|</span>
          <span className={cn("text-neutral-700 tabular-nums", glitchText && "text-[#FF3B30]/50")}>
            {glitchText ? `BUILD:${Math.floor(Math.random() * 9999)}` : "BUILD:2026.01"}
          </span>
        </div>
        <div className="text-[8px]">
          {activeFolder ? (
            <span className={cn(
              "text-[#FF3B30]/70",
              glitchText && "text-[#00ffff]/70"
            )}>
              {glitchText
                ? `R3AD1NG: ???-??? [${activeFolder.label.split('').reverse().join('')}]`
                : `READING: ${activeFolder.code} [${activeFolder.label}]`
              }
            </span>
          ) : (
            <span className={cn("text-neutral-700", glitchText && "text-[#FF3B30]/40")}>
              {glitchText ? "SY$T3M_3RR0R" : "AWAITING_SELECTION"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-1.5 h-1.5 bg-green-500/70",
            glitchText && "bg-[#FF3B30] scale-125"
          )} />
          <span className={cn(
            "text-[8px] text-neutral-600",
            glitchText && "text-[#FF3B30]/70"
          )}>
            {glitchText ? "SYS:W@RN1NG" : "SYS:NOMINAL"}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Communications App (Satellite Uplink) ---
const CommunicationsApp = ({ onClose }: { onClose: () => void }) => {
  const [bootPhase, setBootPhase] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [selectedSat, setSelectedSat] = useState<string | null>(null);
  const [uplinkStatus, setUplinkStatus] = useState<"IDLE" | "CONNECTING" | "LINKED">("IDLE");
  const [signalStrength, setSignalStrength] = useState(87);
  const [glitchText, setGlitchText] = useState(false);
  const [scanAngle, setScanAngle] = useState(0);
  const [transmissionLog, setTransmissionLog] = useState<string[]>([]);
  const [pingWaves, setPingWaves] = useState<{ id: string; satId: string; time: number }[]>([]);
  const lastSweptRef = useRef<{ [key: string]: number }>({});
  const [, forceUpdate] = useState(0);

  // Boot sequence
  useEffect(() => {
    const bootMessages = [
      "[SYS] Initializing ground station...",
      "[SYS] Calibrating antenna array...",
      "[SYS] Loading orbital parameters...",
      "[SYS] Establishing frequency bands...",
      "[SYS] Scanning for satellites...",
      "[OK] 3 satellites acquired"
    ];

    let phase = 0;
    const interval = setInterval(() => {
      if (phase < bootMessages.length) {
        setTransmissionLog(prev => [...prev, bootMessages[phase]]);
        setBootPhase(phase + 1);
        phase++;
      } else {
        clearInterval(interval);
        setBootComplete(true);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Animate waves by forcing re-renders
  useEffect(() => {
    if (pingWaves.length === 0) return;
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 30);
    return () => clearInterval(interval);
  }, [pingWaves.length]);

  // Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.75) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 60 + Math.random() * 100);
      }
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Radar scan animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Signal strength fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalStrength(prev => {
        const delta = (Math.random() - 0.5) * 10;
        return Math.max(60, Math.min(99, prev + delta));
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Detect radar sweep over satellites and create ping waves
  useEffect(() => {
    const sats = [
      { id: "SAT-MAIL", angle: 45 },
      { id: "SAT-NET", angle: 165 },
      { id: "SAT-CODE", angle: 285 }
    ];

    sats.forEach(sat => {
      const angleDiff = Math.abs(((scanAngle - sat.angle + 180) % 360) - 180);
      const isSwept = angleDiff < 5;

      if (isSwept && (!lastSweptRef.current[sat.id] || Date.now() - lastSweptRef.current[sat.id] > 1000)) {
        lastSweptRef.current[sat.id] = Date.now();
        const waveId = `${sat.id}-${Date.now()}`;
        setPingWaves(prev => [...prev, { id: waveId, satId: sat.id, time: Date.now() }]);

        // Remove wave after animation completes
        setTimeout(() => {
          setPingWaves(prev => prev.filter(w => w.id !== waveId));
        }, 1000);
      }
    });
  }, [scanAngle]);

  const satellites = [
    {
      id: "SAT-MAIL",
      code: "COMM-01",
      name: "EMAIL_RELAY",
      orbit: "LEO-340km",
      frequency: "2.4 GHz",
      encryption: "AES-256",
      status: "ACTIVE",
      icon: Mail,
      link: `mailto:${profile.email}`,
      value: profile.email,
      angle: 45,
      distance: 85
    },
    {
      id: "SAT-NET",
      code: "COMM-02",
      name: "LINKEDIN_NODE",
      orbit: "MEO-2000km",
      frequency: "5.8 GHz",
      encryption: "RSA-4096",
      status: "ACTIVE",
      icon: Linkedin,
      link: profile.linkedin,
      value: "Professional Network",
      angle: 165,
      distance: 70
    },
    {
      id: "SAT-CODE",
      code: "COMM-03",
      name: "GITHUB_REPO",
      orbit: "GEO-35786km",
      frequency: "12.5 GHz",
      encryption: "ED25519",
      status: "ACTIVE",
      icon: Github,
      link: profile.github,
      value: "Source Repository",
      angle: 285,
      distance: 95
    }
  ];

  const activeSat = satellites.find(s => s.id === selectedSat);

  const handleSatelliteClick = (satId: string) => {
    setSelectedSat(satId);
    setUplinkStatus("CONNECTING");
    setTransmissionLog(prev => [...prev, `[CMD] Targeting ${satId}...`]);

    setTimeout(() => {
      setTransmissionLog(prev => [...prev, `[SYS] Handshake initiated`]);
    }, 300);

    setTimeout(() => {
      setTransmissionLog(prev => [...prev, `[SYS] Encryption verified`]);
    }, 600);

    setTimeout(() => {
      setUplinkStatus("LINKED");
      setTransmissionLog(prev => [...prev, `[OK] Uplink established`]);
    }, 900);
  };

  const handleTransmit = () => {
    if (activeSat) {
      setTransmissionLog(prev => [...prev, `[TX] Opening channel...`]);
      setTimeout(() => {
        window.open(activeSat.link, activeSat.id === "SAT-MAIL" ? "_self" : "_blank");
      }, 200);
    }
  };

  return (
    <div className={cn(
      "w-full h-full min-h-[600px] bg-[#030303] relative overflow-hidden flex flex-col",
      spaceMono.className
    )}>
      {/* Boot overlay */}
      {!bootComplete && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-24 h-24 border border-[#FF3B30]/30 rounded-full flex items-center justify-center mb-6 mx-auto relative">
              {/* Spinning ring */}
              <div
                className="absolute inset-0 border-2 border-transparent border-t-[#FF3B30] rounded-full"
                style={{ animation: 'spin 1s linear infinite' }}
              />
              <Signal size={32} className="text-[#FF3B30]/70" />
            </div>
            <div className="text-[10px] text-[#FF3B30] uppercase tracking-[0.3em] mb-2">
              Initializing Uplink
            </div>
            <div className="w-48 h-1 bg-white/10 mx-auto overflow-hidden">
              <div
                className="h-full bg-[#FF3B30]"
                style={{
                  width: `${(bootPhase / 6) * 100}%`,
                  transition: 'width 0.2s steps(3)'
                }}
              />
            </div>
            <div className="text-[8px] text-neutral-600 mt-2 tabular-nums">
              {Math.floor((bootPhase / 6) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Glitch overlays */}
      {glitchText && (
        <>
          <div className="absolute inset-0 bg-[#ff0000]/[0.02] translate-x-[2px] pointer-events-none z-50" />
          <div className="absolute inset-0 bg-[#00ffff]/[0.02] -translate-x-[2px] pointer-events-none z-50" />
        </>
      )}

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)' }} />

      {/* Corner brackets */}
      <div className={cn("absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#FF3B30]/30 pointer-events-none z-30", glitchText && "border-[#00ffff]/50")} />
      <div className={cn("absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#FF3B30]/30 pointer-events-none z-30", glitchText && "border-[#00ffff]/50")} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#FF3B30]/30 pointer-events-none z-30" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#FF3B30]/30 pointer-events-none z-30" />

      {/* Header */}
      <div className="h-12 bg-black/90 border-b border-[#FF3B30]/20 flex items-center justify-between px-4 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent" />

        <div className="flex items-center gap-4">
          <button onClick={onClose} className="flex items-center gap-2 text-neutral-600 hover:text-[#FF3B30] group">
            <div className="w-6 h-6 border border-neutral-800 group-hover:border-[#FF3B30]/50 flex items-center justify-center">
              <ArrowLeft size={12} />
            </div>
            <span className="text-[9px] uppercase tracking-wider">Exit</span>
          </button>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 bg-[#FF3B30]", glitchText && "bg-[#00ffff]")} />
              <span className={cn(
                "text-[11px] text-[#FF3B30] uppercase tracking-[0.2em]",
                glitchText && "text-[#00ffff]"
              )}>
                {glitchText ? "S@T3LL1T3 UPL1NK" : "Satellite Uplink"}
              </span>
            </div>
            <div className="text-[8px] text-neutral-700 uppercase tracking-wider">
              {glitchText ? "GR0UND_ST@T10N_01" : "Ground Station Control"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[8px] text-neutral-600">
          <span>SATS: {satellites.length}</span>
          <span className="text-neutral-800">|</span>
          <span className={cn(glitchText && "text-[#00ffff]/50")}>
            SIGNAL: {glitchText ? "???" : `${Math.floor(signalStrength)}%`}
          </span>
          <span className="text-neutral-800">|</span>
          <span className={cn(
            uplinkStatus === "LINKED" ? "text-green-500" : uplinkStatus === "CONNECTING" ? "text-amber-500" : "text-neutral-600"
          )}>
            {uplinkStatus}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Radar Display */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="text-[8px] text-neutral-700 uppercase tracking-[0.3em] mb-4">[ORBITAL_TRACKER]</div>

          {/* Radar Container */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-[320px] h-[320px]">
              {/* Radar background circles - appear progressively */}
              <div
                className="absolute inset-0 border border-[#FF3B30]/10 rounded-full"
                style={{
                  opacity: bootPhase >= 1 ? 1 : 0,
                  transform: bootPhase >= 1 ? 'scale(1)' : 'scale(0.5)',
                  transition: 'all 0.3s ease-out'
                }}
              />
              <div
                className="absolute inset-[25%] border border-[#FF3B30]/10 rounded-full"
                style={{
                  opacity: bootPhase >= 2 ? 1 : 0,
                  transform: bootPhase >= 2 ? 'scale(1)' : 'scale(0.5)',
                  transition: 'all 0.3s ease-out'
                }}
              />
              <div
                className="absolute inset-[50%] border border-[#FF3B30]/10 rounded-full"
                style={{
                  opacity: bootPhase >= 3 ? 1 : 0,
                  transform: bootPhase >= 3 ? 'scale(1)' : 'scale(0.5)',
                  transition: 'all 0.3s ease-out'
                }}
              />

              {/* Radar cross */}
              <div
                className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#FF3B30]/10"
                style={{
                  opacity: bootPhase >= 4 ? 1 : 0,
                  transition: 'opacity 0.3s ease-out'
                }}
              />
              <div
                className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#FF3B30]/10"
                style={{
                  opacity: bootPhase >= 4 ? 1 : 0,
                  transition: 'opacity 0.3s ease-out'
                }}
              />

              {/* Radar sweep */}
              <div
                className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left"
                style={{
                  transform: `rotate(${scanAngle}deg)`,
                  background: 'linear-gradient(90deg, #FF3B30 0%, transparent 100%)',
                  opacity: bootPhase >= 5 ? 1 : 0,
                  transition: 'opacity 0.3s ease-out'
                }}
              />

              {/* Sweep trail */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: `conic-gradient(from ${scanAngle}deg, transparent 0deg, #FF3B30/10 30deg, transparent 60deg)`,
                  opacity: bootPhase >= 5 ? 1 : 0,
                  transition: 'opacity 0.3s ease-out'
                }}
              />

              {/* Connection line to selected satellite */}
              {selectedSat && uplinkStatus === "LINKED" && (() => {
                const sat = satellites.find(s => s.id === selectedSat);
                if (!sat) return null;
                // Container is 320x320, center is at 160,160
                const offsetX = Math.cos((sat.angle * Math.PI) / 180) * (sat.distance * 1.5);
                const offsetY = Math.sin((sat.angle * Math.PI) / 180) * (sat.distance * 1.5);
                const centerX = 160;
                const centerY = 160;
                const endX = centerX + offsetX;
                const endY = centerY + offsetY;
                return (
                  <svg
                    className="absolute inset-0 pointer-events-none z-10"
                    width="320"
                    height="320"
                    viewBox="0 0 320 320"
                  >
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={endX}
                      y2={endY}
                      stroke="#FF3B30"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                    />
                  </svg>
                );
              })()}

              {/* Center point (Ground Station) */}
              <div
                className="absolute w-4 h-4 z-20"
                style={{
                  left: '50%',
                  top: '50%',
                  opacity: bootPhase >= 1 ? 1 : 0,
                  transform: `translate(-50%, -50%) scale(${bootPhase >= 1 ? 1 : 0})`,
                  transition: 'all 0.3s ease-out'
                }}
              >
                <div className="absolute inset-0 bg-[#FF3B30] rounded-full animate-ping opacity-20" />
                <div className="absolute inset-1 bg-[#FF3B30] rounded-full" />
              </div>

              {/* Satellites */}
              {satellites.map((sat, index) => {
                const x = Math.cos((sat.angle * Math.PI) / 180) * (sat.distance * 1.5);
                const y = Math.sin((sat.angle * Math.PI) / 180) * (sat.distance * 1.5);
                const isSelected = selectedSat === sat.id;
                const satWaves = pingWaves.filter(w => w.satId === sat.id);
                const hasActiveWave = satWaves.length > 0;
                const satVisible = bootComplete;

                return (
                  <button
                    key={sat.id}
                    onClick={() => handleSatelliteClick(sat.id)}
                    className={cn(
                      "absolute w-8 h-8 group z-20",
                      "flex items-center justify-center"
                    )}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      opacity: satVisible ? 1 : 0,
                      transform: `translate(-50%, -50%) scale(${satVisible ? 1 : 0})`,
                      transition: `all 0.3s ease-out ${index * 0.15}s`
                    }}
                  >
                    {/* Expanding wave rings when radar sweeps */}
                    {satWaves.map((wave) => {
                      const age = Date.now() - wave.time;
                      const progress = Math.min(age / 800, 1);
                      const scale = 1 + progress * 3;
                      const opacity = 1 - progress;

                      return (
                        <div
                          key={wave.id}
                          className="absolute w-6 h-6 border-2 border-[#FF3B30] rounded-full pointer-events-none"
                          style={{
                            transform: `scale(${scale})`,
                            opacity: opacity
                          }}
                        />
                      );
                    })}

                    {/* Selection ring */}
                    {isSelected && (
                      <div className="absolute inset-[-4px] border-2 border-[#FF3B30] rounded-full animate-pulse" />
                    )}

                    {/* Satellite icon */}
                    <div className={cn(
                      "w-6 h-6 border flex items-center justify-center",
                      isSelected
                        ? "border-[#FF3B30] bg-[#FF3B30]/20 text-[#FF3B30]"
                        : hasActiveWave
                          ? "border-[#FF3B30] bg-[#FF3B30]/30 text-[#FF3B30]"
                          : "border-white/20 bg-black/80 text-neutral-500 group-hover:border-[#FF3B30]/50 group-hover:text-[#FF3B30]"
                    )}>
                      <sat.icon size={12} />
                    </div>

                    {/* Satellite label */}
                    <div className={cn(
                      "absolute top-full mt-1 text-[7px] whitespace-nowrap",
                      isSelected ? "text-[#FF3B30]" : hasActiveWave ? "text-[#FF3B30]" : "text-neutral-600 group-hover:text-neutral-400"
                    )}>
                      {sat.code}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordinates display */}
          <div className="flex items-center justify-between text-[8px] text-neutral-700 mt-4 border-t border-white/5 pt-3">
            <span>LAT: -0.1807° S</span>
            <span>LON: -78.4678° W</span>
            <span>ALT: 2850m</span>
            <span className={cn(glitchText && "text-[#00ffff]/50")}>
              {glitchText ? "AZ: ???°" : `AZ: ${scanAngle.toFixed(0)}°`}
            </span>
          </div>
        </div>

        {/* Right Panel - Telemetry & Controls */}
        <div className="w-80 border-l border-white/5 bg-black/50 flex flex-col">
          {/* Telemetry Header */}
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-1.5 h-1.5",
                activeSat ? "bg-[#FF3B30]" : "bg-neutral-800"
              )} />
              <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
                {glitchText ? "T3L3M3TRY" : "Telemetry"}
              </span>
            </div>
          </div>

          {/* Satellite Info */}
          <div className="flex-1 overflow-auto">
            {activeSat ? (
              <div className="p-4 space-y-4">
                {/* Sat Header */}
                <div className="border border-white/5 bg-black/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30]",
                      glitchText && "border-[#00ffff]/30 text-[#00ffff]"
                    )}>
                      <activeSat.icon size={24} />
                    </div>
                    <div>
                      <div className="text-[11px] text-white font-medium">
                        {glitchText ? activeSat.name.replace(/[AEIOU]/g, '@') : activeSat.name}
                      </div>
                      <div className="text-[8px] text-neutral-600 uppercase tracking-wider">
                        {activeSat.code}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 bg-green-500" />
                        <span className="text-[8px] text-green-500">{activeSat.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telemetry Data */}
                <div className="space-y-2">
                  <div className="text-[8px] text-neutral-700 uppercase tracking-wider">[LINK_DATA]</div>

                  {[
                    { label: "ORBIT", value: activeSat.orbit },
                    { label: "FREQUENCY", value: activeSat.frequency },
                    { label: "ENCRYPTION", value: activeSat.encryption },
                    { label: "SIGNAL", value: `${Math.floor(signalStrength)}%` },
                    { label: "LATENCY", value: `${Math.floor(Math.random() * 50 + 10)}ms` }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-1.5 border border-white/5 bg-black/30">
                      <span className="text-[8px] text-neutral-600">{item.label}</span>
                      <span className={cn(
                        "text-[9px] text-neutral-400 tabular-nums",
                        glitchText && "text-[#00ffff]/70"
                      )}>
                        {glitchText && i > 2 ? "█████" : item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Channel Info */}
                <div className="border border-[#FF3B30]/20 bg-[#FF3B30]/5 p-3">
                  <div className="text-[8px] text-[#FF3B30]/70 uppercase tracking-wider mb-2">[CHANNEL_ENDPOINT]</div>
                  <div className="text-[10px] text-white break-all">
                    {activeSat.value}
                  </div>
                </div>

                {/* Transmit Button */}
                <button
                  onClick={handleTransmit}
                  disabled={uplinkStatus !== "LINKED"}
                  className={cn(
                    "w-full py-3 border text-[10px] uppercase tracking-[0.2em] relative overflow-hidden group",
                    uplinkStatus === "LINKED"
                      ? "border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-black"
                      : "border-neutral-800 text-neutral-700 cursor-not-allowed"
                  )}
                >
                  <div className="absolute inset-0 bg-[#FF3B30]/10 translate-y-full group-hover:translate-y-0" style={{ transition: 'transform 0.15s steps(4)' }} />
                  <span className="relative">
                    {uplinkStatus === "CONNECTING" ? "ESTABLISHING LINK..." : uplinkStatus === "LINKED" ? "TRANSMIT" : "SELECT SATELLITE"}
                  </span>
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center">
                  <div className={cn(
                    "w-16 h-16 border border-white/5 flex items-center justify-center mx-auto mb-4",
                    glitchText && "border-[#00ffff]/20"
                  )}>
                    <Signal size={24} className="text-neutral-800" />
                  </div>
                  <div className="text-[9px] text-neutral-700 uppercase tracking-wider">
                    {glitchText ? "N0 S@T3LL1T3" : "No Satellite Selected"}
                  </div>
                  <div className="text-[8px] text-neutral-800 mt-1">
                    Click a satellite on the<br/>radar to establish uplink
                  </div>
                  <div className="mt-4 text-[8px] text-[#FF3B30]/50">
                    {">"} {glitchText ? "SC@NN1NG_" : "SCANNING_"}
                    <span className="animate-pulse">█</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transmission Log */}
          <div className="h-32 border-t border-white/5">
            <div className="px-3 py-1.5 border-b border-white/5 text-[8px] text-neutral-700 uppercase tracking-wider">
              [TRANSMISSION_LOG]
            </div>
            <div className="h-[calc(100%-24px)] overflow-auto p-2 text-[8px] space-y-0.5">
              {transmissionLog.slice(-8).map((log, i) => log && (
                <div
                  key={i}
                  className={cn(
                    log.startsWith("[OK]") ? "text-green-500/70" :
                    log.startsWith("[CMD]") ? "text-[#FF3B30]/70" :
                    log.startsWith("[TX]") ? "text-amber-500/70" :
                    "text-neutral-600"
                  )}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "h-8 bg-black/90 border-t border-[#FF3B30]/10 flex items-center justify-between px-4",
        glitchText && "border-[#00ffff]/20"
      )}>
        <div className="flex items-center gap-4 text-[8px]">
          <span className={cn("text-neutral-700", glitchText && "text-[#00ffff]/50")}>
            {glitchText ? "UPL1NK_SYS::v?.?" : "UPLINK_SYS::v3.2.1"}
          </span>
          <span className="text-neutral-800">|</span>
          <span className="text-neutral-700 tabular-nums">
            {glitchText ? `SCAN:${Math.floor(Math.random() * 360)}°` : `SCAN:${scanAngle.toFixed(0)}°`}
          </span>
        </div>
        <div className="text-[8px]">
          {activeSat ? (
            <span className={cn("text-[#FF3B30]/70", glitchText && "text-[#00ffff]/70")}>
              TARGET: {activeSat.code}
            </span>
          ) : (
            <span className="text-neutral-700">AWAITING_TARGET</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-1.5 h-1.5",
            uplinkStatus === "LINKED" ? "bg-green-500" : "bg-amber-500 animate-pulse"
          )} />
          <span className="text-[8px] text-neutral-600">
            {glitchText ? "GND:0NL1N3" : "GND:ONLINE"}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Virtual Desktop (The 4 Apps) ---
const VirtualDesktop = ({
  onOpenMissions,
  onOpenArsenal,
  onOpenComms
}: {
  onOpenMissions: () => void;
  onOpenArsenal: () => void;
  onOpenComms: () => void;
}) => {
  const [showApps, setShowApps] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [glitchFlash, setGlitchFlash] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').slice(0, 19));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const lines = [
      "[0x00] MOUNT /dev/sda1",
      "[0x01] LOAD kernel_gui.sys",
      "[0x02] INIT display_driver",
      "[0x03] EXEC desktop.exe",
      "[OK] SYSTEM_READY"
    ];

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex >= lines.length) {
        clearInterval(interval);
        setGlitchFlash(true);
        setTimeout(() => setGlitchFlash(false), 60);
        setTimeout(() => {
          setGlitchFlash(true);
          setTimeout(() => setGlitchFlash(false), 40);
        }, 100);
        setTimeout(() => setShowApps(true), 180);
        return;
      }
      setBootLines(prev => [...prev, lines[lineIndex]]);
      lineIndex++;
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("w-full h-full min-h-[600px] bg-[#0a0a0a] relative overflow-hidden flex flex-col", spaceMono.className)}>
      {/* Scan lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-40 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)'
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glitch Flash */}
      {glitchFlash && (
        <div className="absolute inset-0 bg-white z-50 opacity-5" />
      )}

      {/* Boot Terminal */}
      {!showApps && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-neutral-600 text-[10px] space-y-0.5 text-left">
            {bootLines.map((line, i) => (
              <div key={i} className={i === bootLines.length - 1 && line?.includes("OK") ? "text-[#FF3B30]" : ""}>
                {line}
              </div>
            ))}
            <span className="inline-block w-1.5 h-3 bg-neutral-600 animate-pulse" />
          </div>
        </div>
      )}

      {/* Desktop Interface */}
      {showApps && (
        <>
          {/* Top System Bar */}
          <div className="h-8 bg-black/80 border-b border-white/5 flex items-center justify-between px-3 z-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#FF3B30]" />
                <span className="text-[9px] text-neutral-500">SYS:OPERATIONAL</span>
              </div>
              <span className="text-[9px] text-neutral-600">MEM:64%</span>
              <span className="text-[9px] text-neutral-600">CPU:12%</span>
            </div>
            <div className="text-[9px] text-neutral-600 tabular-nums">{time}</div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex">
            {/* Left Sidebar - File Browser Style */}
            <div className="w-48 border-r border-white/5 bg-black/30 flex flex-col">
              {/* Sidebar Header */}
              <div className="px-3 py-2 border-b border-white/5">
                <span className="text-[9px] text-neutral-600 uppercase tracking-wider">System Applications</span>
              </div>

              {/* App List */}
              <div className="flex-1 py-1">
                {/* Mission Index */}
                <button
                  onClick={onOpenMissions}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors group text-left"
                >
                  <div className="w-6 h-6 border border-neutral-700 group-hover:border-[#FF3B30] flex items-center justify-center bg-black/50">
                    <Database size={12} className="text-neutral-500 group-hover:text-[#FF3B30]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-neutral-400 group-hover:text-white truncate">MISSION_INDEX</div>
                    <div className="text-[8px] text-neutral-700">tactical_db.exe</div>
                  </div>
                </button>

                {/* Arsenal */}
                <button
                  onClick={onOpenArsenal}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors group text-left"
                >
                  <div className="w-6 h-6 border border-neutral-700 group-hover:border-amber-500 flex items-center justify-center bg-black/50">
                    <Cpu size={12} className="text-neutral-500 group-hover:text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-neutral-400 group-hover:text-white truncate">ARSENAL</div>
                    <div className="text-[8px] text-neutral-700">tech_stack.dat</div>
                  </div>
                </button>

                {/* Communications */}
                <button
                  onClick={onOpenComms}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors group text-left"
                >
                  <div className="w-6 h-6 border border-neutral-700 group-hover:border-cyan-500 flex items-center justify-center bg-black/50">
                    <Radio size={12} className="text-neutral-500 group-hover:text-cyan-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-neutral-400 group-hover:text-white truncate">COMMS_MODULE</div>
                    <div className="text-[8px] text-neutral-700">transmission.exe</div>
                  </div>
                </button>

                {/* Divider */}
                <div className="mx-3 my-2 border-t border-white/5" />

                {/* Disabled item for realism */}
                <div className="px-3 py-2 flex items-center gap-3 opacity-30 cursor-not-allowed">
                  <div className="w-6 h-6 border border-neutral-800 flex items-center justify-center bg-black/50">
                    <Terminal size={12} className="text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-neutral-600 truncate">TERMINAL</div>
                    <div className="text-[8px] text-neutral-800">[LOCKED]</div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="px-3 py-2 border-t border-white/5 bg-black/50">
                <div className="text-[8px] text-neutral-700">4 items • 3 available</div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="flex-1 flex flex-col">
              {/* Panel Header */}
              <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">WORKSPACE://root/applications</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-neutral-700">VIEW:LIST</span>
                </div>
              </div>

              {/* Content Grid */}
              <div className="flex-1 p-6 flex flex-wrap items-start justify-start gap-4 content-start">
                {/* App Tiles */}
                <button
                  onClick={onOpenMissions}
                  className="group flex flex-col items-center gap-2 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-16 border border-neutral-800 group-hover:border-[#FF3B30] flex items-center justify-center bg-black/50 relative">
                    <Database size={24} className="text-neutral-600 group-hover:text-[#FF3B30]" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF3B30]" />
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-neutral-500 group-hover:text-white">MISSION_INDEX</div>
                  </div>
                </button>

                <button
                  onClick={onOpenArsenal}
                  className="group flex flex-col items-center gap-2 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-16 border border-neutral-800 group-hover:border-amber-500 flex items-center justify-center bg-black/50">
                    <Cpu size={24} className="text-neutral-600 group-hover:text-amber-500" />
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-neutral-500 group-hover:text-white">ARSENAL</div>
                  </div>
                </button>

                <button
                  onClick={onOpenComms}
                  className="group flex flex-col items-center gap-2 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-16 border border-neutral-800 group-hover:border-cyan-500 flex items-center justify-center bg-black/50">
                    <Radio size={24} className="text-neutral-600 group-hover:text-cyan-500" />
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-neutral-500 group-hover:text-white">COMMS</div>
                  </div>
                </button>
              </div>

              {/* Bottom Info */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[8px] text-neutral-700">
                <span>CLEARANCE:LEVEL_3</span>
                <span>SESSION:0x7F3A</span>
                <span>UPTIME:04:23:17</span>
              </div>
            </div>
          </div>

          {/* Corner Coordinates */}
          <div className="absolute bottom-12 left-3 text-[8px] text-neutral-800 space-y-0.5">
            <div>X:0.00</div>
            <div>Y:0.00</div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Arsenal Card ---
const ArsenalCard = ({ category, icon: Icon, index }: { category: string; icon: React.ComponentType<{ size?: number }>; index: number }) => {
  const skillList = skills[category as keyof typeof skills] || [];

  return (
    <RevealOnScroll direction="up" delay={index * 0.1}>
      <div className="p-6 border border-white/5 bg-[#0a0a0a] hover:border-[#FF3B30]/30 transition-all duration-500 group relative overflow-hidden h-full">
        {/* Animated background on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#FF3B30]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 transition-opacity text-[#FF3B30]">
          <Icon size={20} />
        </div>

        <h3 className={cn("text-sm text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10", spaceMono.className)}>
          <motion.span
            className="w-1 h-1 bg-[#FF3B30]"
            whileHover={{ scale: 2 }}
          />
          {category}
        </h3>

        <div className="flex flex-wrap gap-2 relative z-10">
          {skillList.map((skill, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              className={cn(
                "text-xs px-2 py-1 border border-white/10 text-neutral-300 bg-white/5 transition-all cursor-default",
                spaceMono.className
              )}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
};

// --- Section with Highlight Effect ---
const SectionWithHighlight = ({
  id,
  isHighlighted,
  children,
  className
}: {
  id: string;
  isHighlighted: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={id} className={cn("relative", className)}>
    {/* Highlight flash effect */}
    <motion.div
      className="absolute inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isHighlighted ? [0, 0.15, 0] : 0,
        scale: isHighlighted ? [1, 1.02, 1] : 1
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/20 via-transparent to-transparent rounded-lg" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent" />
    </motion.div>
    {children}
  </section>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

// Hero data interface
interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: { text: string; link: string };
  ctaSecondary: { text: string; link: string };
  backgroundType: string;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
}

const defaultHeroData: HeroData = {
  title: "Kevin Narvaez",
  subtitle: "AI Product System Engineer",
  description: "I architect the bridge between AI research and production systems.",
  ctaPrimary: { text: "View Projects", link: "#projects" },
  ctaSecondary: { text: "Contact Me", link: "#contact" },
  backgroundType: "solid",
  backgroundColor: "#0a0a0a",
  gradientFrom: "#0a0a0a",
  gradientTo: "#1a1a2e",
  backgroundImage: ""
};

export default function Landing1() {
  useArrivalSound();
  const [activeSection, setActiveSection] = useState("hero");
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);
  // System State: 'LOCKED' | 'LOADING' | 'DESKTOP' | 'MISSIONS'
  const [systemState, setSystemState] = useState<"LOCKED" | "LOADING" | "DESKTOP" | "MISSIONS" | "ARSENAL" | "COMMS">("LOCKED");
  const containerRef = useRef<HTMLDivElement>(null);
  const systemContainerRef = useRef<HTMLDivElement>(null);

  // Fetch hero data from backend
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("http://localhost:3001/hero");
        if (response.ok) {
          const data = await response.json();
          setHeroData(data);
        }
      } catch (error) {
        console.log("Using default hero data");
      }
    };
    fetchHeroData();
  }, []);

  const toggleSystemFullscreen = () => {
    if (!systemContainerRef.current) return;

    if (!document.fullscreenElement) {
      systemContainerRef.current.requestFullscreen().catch((e) => {
        console.error(`Error enabling fullscreen: ${e.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Smooth scroll with highlight effect
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      // Trigger highlight effect
      setHighlightedSection(sectionId);
      setTimeout(() => setHighlightedSection(null), 1500);

      // Smooth scroll with custom easing
      const targetPosition = element.offsetTop - 80;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let start: number | null = null;

      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  // Track scroll position for parallax hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  // Navigation highlight based on scroll
  useEffect(() => {
    const sections = ["hero", "systems", "architect"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("min-h-screen bg-[#030303] text-[#ededed] selection:bg-[#FF3B30] selection:text-white overflow-x-hidden scroll-smooth", manrope.className)}
    >
      <ScrollProgressBar />
      <NoiseOverlay />

      {/* GridScan Full Screen Background */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <GridScan
          linesColor="#FF3B30"
          scanColor="#FF3B30"
          gridScale={0.08}
          lineThickness={0.8}
          enablePost={true}
          bloomIntensity={0.3}
          bloomThreshold={0.5}
          scanOpacity={0.25}
          scanDuration={5}
          scanDelay={3}
          scanDirection="pingpong"
          scanGlow={0.5}
          scanSoftness={0.5}
          enableWebcam={false}
          scanOnClick={false}
          sensitivity={0.4}
          className="w-full h-full"
        />
      </div>

      {/* --- Navigation with scroll indicator --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#hero" className={cn("text-sm font-bold tracking-tighter flex items-center gap-2 group", spaceMono.className)}>
            <motion.div
              className="w-2 h-2 bg-[#FF3B30]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white">K.NARVAEZ</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-500">SYS.ENG</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {[
              { id: 'architect', label: 'Architect' },
              { id: 'systems', label: 'Systems' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={cn(
                  "px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 relative",
                  activeSection === item.id ? "text-white" : "text-neutral-500 hover:text-white"
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF3B30]"
                  />
                )}
              </a>
            ))}
            <a
              href="#systems"
              onClick={(e) => scrollToSection(e, 'systems')}
              className={cn("ml-4 px-4 py-2 text-xs font-bold bg-[#FF3B30] text-white uppercase tracking-widest hover:bg-[#ff5d53] transition-colors", spaceMono.className)}
            >
              Access System
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-24 pb-20 relative z-10">

        {/* --- Hero Section: OPTION 1 MODIFIED - IDENTITY FIRST + IMAGE --- */}
        <motion.section
          id="hero"
          className="min-h-[85vh] flex items-center justify-center mb-20 relative"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text Content */}
            <div className="flex-1 text-center lg:text-left">
            <div className="max-w-2xl">
              {/* Boot sequence */}
              <GlitchReveal delay={0.2}>
                <div className={cn("flex items-center gap-3 mb-8 text-[#FF3B30] text-xs md:text-sm uppercase tracking-[0.25em]", spaceMono.className)}>
                  <motion.span
                    className="w-2 h-2 bg-[#FF3B30] shadow-[0_0_10px_#FF3B30]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <ScrambleText text="Identity_Core: Online" delay={0.5} />
                  <span className="w-8 h-[1px] bg-[#FF3B30]/50" />
                  <span className="text-neutral-500">v2.0.26</span>
                </div>
              </GlitchReveal>

              {/* Main Headline: HUGE NAME (Left Aligned) */}
              <div className="mb-8 relative">
                 <h1 className="text-6xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-extrabold tracking-tighter leading-[0.85] text-neutral-100 uppercase relative z-10">
                  <GlitchReveal delay={0.5}>
                    <span className="block">{heroData.title.split(" ")[0] || "KEVIN"}</span>
                  </GlitchReveal>
                  <GlitchReveal delay={0.8}>
                    <motion.span
                      className="block text-transparent bg-clip-text bg-repeat"
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 2 -0.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\"), linear-gradient(135deg, #404040 0%, #a0a0a0 50%, #606060 100%)",
                        backgroundBlendMode: "multiply",
                        backgroundSize: "100px 100px, 100% 100%"
                      }}
                      animate={{
                        backgroundPosition: ["0px 0px, 0% 0%", "100px 100px, 0% 0%"]
                      }}
                      transition={{
                        duration: 4,
                        ease: "linear",
                        repeat: Infinity
                      }}
                    >
                      <ScrambleText text={heroData.title.split(" ")[1] || "NARVAEZ"} delay={1.0} />
                    </motion.span>
                  </GlitchReveal>
                </h1>
              </div>

              {/* Subtext and Slogan */}
              <GlitchReveal delay={1.4}>
                  <h3 className={cn("text-xl md:text-2xl text-[#FF3B30] uppercase tracking-widest mb-6 font-bold", spaceMono.className)}>
                      {heroData.subtitle}
                  </h3>
              </GlitchReveal>

              <GlitchReveal delay={1.8}>
                <div className="flex flex-col items-start gap-8 mb-12 border-l-2 border-[#FF3B30]/20 pl-6">
                  <p className="max-w-xl text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
                    {heroData.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className={cn("text-xs text-neutral-600 uppercase tracking-widest text-right hidden md:block", spaceMono.className)}>
                      Available for<br/>Deployment
                    </span>
                    <div className="w-px h-8 bg-neutral-800 hidden md:block" />
                    <IndustrialButton href={heroData.ctaPrimary.link}>
                      {heroData.ctaPrimary.text} <ArrowDown size={16} />
                    </IndustrialButton>
                  </div>
                </div>
              </GlitchReveal>
            </div>
            </div>

            {/* Right: Hero Image */}
            {heroData.backgroundType === "image" && heroData.backgroundImage && (
              <motion.div
                className="flex-1 flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="relative">
                  {/* Industrial frame */}
                  <div className="absolute -inset-3 border border-[#FF3B30]/30" />
                  <div className="absolute -inset-6 border border-neutral-800" />
                  {/* Corner accents */}
                  <div className="absolute -top-6 -left-6 w-3 h-3 border-t-2 border-l-2 border-[#FF3B30]" />
                  <div className="absolute -top-6 -right-6 w-3 h-3 border-t-2 border-r-2 border-[#FF3B30]" />
                  <div className="absolute -bottom-6 -left-6 w-3 h-3 border-b-2 border-l-2 border-[#FF3B30]" />
                  <div className="absolute -bottom-6 -right-6 w-3 h-3 border-b-2 border-r-2 border-[#FF3B30]" />
                  {/* Image */}
                  <img
                    src={heroData.backgroundImage}
                    alt="Hero"
                    className="w-full max-w-md lg:max-w-lg object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)"
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <span className={cn("text-[10px] text-neutral-600 uppercase tracking-[0.3em]", spaceMono.className)}>
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown size={16} className="text-[#FF3B30]" />
            </motion.div>
          </motion.div>
        </motion.section>

      </main>

      {/* Full-width Tickers - Stacked */}
      <div className="relative z-20 -mt-8 mb-12">
        {/* ParallaxText - base layer */}
        <div className="overflow-hidden pointer-events-none opacity-[0.06]">
          <ParallaxText baseVelocity={-2} className={cn("text-[150px] font-black uppercase tracking-tighter text-white", manrope.className)}>
            Neural Architect • System Engineer • AI Builder •
          </ParallaxText>
        </div>

        {/* DataTicker on top - positioned over the ParallaxText */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-10"
        >
          <DataTicker />
        </motion.div>
      </div>

      <main className="container mx-auto px-6 pb-20 relative z-10">
      
         {/* --- Architect Section (Moved Up for Option 1) --- */}
        <SectionWithHighlight id="architect" isHighlighted={highlightedSection === 'architect'} className="scroll-mt-32 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <SectionHeader label="The Architect" title="Profile Data" />
              
              <RevealOnScroll direction="up" delay={0.2}>
                <div className="space-y-6 text-neutral-400 leading-relaxed text-lg font-light">
                  <p>{profile.bio}</p>
                  <p>My philosophy: Code is not just syntax; it is the blueprint for digital machinery.</p>
                </div>
              </RevealOnScroll>

               {/* Animated Stats */}
              <RevealOnScroll direction="up" delay={0.4}>
                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                  <div>
                    <h4 className={cn("text-3xl font-bold text-white", spaceMono.className)}>
                      <AnimatedCounter value={profile.years} suffix="+" />
                    </h4>
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">Years Experience</span>
                  </div>
                  <div>
                    <h4 className={cn("text-3xl font-bold text-white", spaceMono.className)}>
                      <AnimatedCounter value={projects.length} />
                    </h4>
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">Missions Complete</span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
              <RevealOnScroll direction="left" className="w-full flex justify-center">
                {/* Animated Terminal */}
                <div className="relative w-full max-w-xl h-[400px]">
                  <AnimatedTerminal />
                  {/* Corner accents */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#FF3B30]" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#FF3B30]" />
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </SectionWithHighlight>

        {/* --- Systems Grid (Interactive Multi-Stage Unlock) --- */}
        <SectionWithHighlight id="systems" isHighlighted={highlightedSection === 'systems'} className="scroll-mt-32 mb-40">
          <SectionHeader
            label="Selected Works"
            title="Mission Files"
            subtitle={systemState === "MISSIONS" ? "Access granted. Reviewing mission parameters." : "Secure access required to view full mission parameters."}
          />

          <div
            ref={systemContainerRef}
            className="relative min-h-[600px] w-full bg-black overflow-hidden flex flex-col [&:fullscreen]:p-0 [&:fullscreen]:justify-center"
          >
            {/* Fullscreen Button - Always visible */}
            <button
              onClick={toggleSystemFullscreen}
              className={cn(
                "absolute top-2 right-2 z-50 w-7 h-7 border border-neutral-700 hover:border-[#FF3B30] bg-black/80 flex items-center justify-center group transition-colors",
                spaceMono.className
              )}
              title="Toggle Fullscreen"
            >
              <ArrowUpRight size={12} className="text-neutral-500 group-hover:text-[#FF3B30]" />
            </button>

            {/* 1. LOCKED STATE */}
            {systemState === "LOCKED" && (
               <RevealOnScroll direction="up" className="w-full h-full flex-1">
                  <MissionAccessTerminal onUnlock={() => setSystemState("LOADING")} />
               </RevealOnScroll>
            )}

            {/* 2. LOADING STATE */}
            {systemState === "LOADING" && (
               <SystemLoader onComplete={() => setSystemState("DESKTOP")} />
            )}

            {/* 3. DESKTOP STATE */}
            {systemState === "DESKTOP" && (
               <VirtualDesktop
                 onOpenMissions={() => setSystemState("MISSIONS")}
                 onOpenArsenal={() => setSystemState("ARSENAL")}
                 onOpenComms={() => setSystemState("COMMS")}
               />
            )}

            {/* 4. MISSIONS STATE (Project Grid) */}
            {systemState === "MISSIONS" && (
              <MissionIndex3D
                projects={projects}
                onClose={() => setSystemState("DESKTOP")}
              />
            )}

            {/* 5. ARSENAL STATE (Tech Stack) */}
            {systemState === "ARSENAL" && (
              <ArsenalApp onClose={() => setSystemState("DESKTOP")} />
            )}

            {/* 6. COMMS STATE (Contact) */}
            {systemState === "COMMS" && (
              <CommunicationsApp onClose={() => setSystemState("DESKTOP")} />
            )}
          </div>
        </SectionWithHighlight>

        {/* --- Footer --- */}
        <footer className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
          <div className={cn("flex gap-6 uppercase tracking-widest", spaceMono.className)}>
            <span>© 2026 Kevin Narvaez</span>
            <span>All Rights Reserved</span>
          </div>
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>All Systems Operational</span>
          </motion.div>
        </footer>

      </main>
    </div>
  );
}
