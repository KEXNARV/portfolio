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
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useArrivalSound } from "@/hooks/use-arrival-sound";
import { projects, skills, profile, type Project } from "@/data/projects";

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

// --- Background Grid with Big Glow ---
const BackgroundGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    <motion.div
      className="absolute left-0 right-0 top-[-200px] -z-10 m-auto h-[800px] w-[800px] rounded-full bg-[#FF3B30] opacity-[0.15] blur-[140px]"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.15, 0.2, 0.15]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// ============================================================================
// ANIMATION COMPONENTS
// ============================================================================

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
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const statusConfig = {
    DEPLOYED: { color: "text-emerald-500", border: "border-emerald-500/30", bg: "bg-emerald-500/10", label: "Active" },
    IN_PROGRESS: { color: "text-amber-500", border: "border-amber-500/30", bg: "bg-amber-500/10", label: "Building" },
    ARCHIVED: { color: "text-neutral-500", border: "border-neutral-500/30", bg: "bg-neutral-500/10", label: "Archived" }
  };

  const config = statusConfig[project.status as keyof typeof statusConfig];

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="group relative h-full bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col hover:border-[#FF3B30]/30 transition-colors duration-500"
    >
      {/* Animated border glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 59, 48, 0.06), transparent 40%)"
        }}
      />

      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-start justify-between relative z-10">
        <div>
          <div className={cn("flex items-center gap-2 text-xs text-neutral-500 mb-2", spaceMono.className)}>
            <span>ID: {project.id}</span>
            <span className="text-[#FF3B30]">///</span>
            <span>{project.classification}</span>
          </div>
          <h3 className={cn("text-2xl font-bold text-neutral-100 group-hover:text-[#FF3B30] transition-colors duration-300", manrope.className)}>
            {project.title}
          </h3>
        </div>
        <div className={cn("text-[10px] px-2 py-1 border rounded uppercase tracking-wider", config.color, config.border, config.bg, spaceMono.className)}>
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 relative z-10 flex flex-col gap-6">
        <StaggerContainer className="grid grid-cols-1 gap-4" staggerDelay={0.1}>
          <StaggerItem>
            <div className="relative pl-4 border-l-2 border-red-500/30 group/item">
              <motion.div
                className="absolute left-0 top-0 w-[2px] h-0 bg-red-500 group-hover/item:h-full transition-all duration-500"
              />
              <h4 className={cn("text-[10px] uppercase tracking-widest text-red-500 mb-1", spaceMono.className)}>The Glitch</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">{project.glitch}</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="relative pl-4 border-l-2 border-blue-500/30 group/item">
              <motion.div
                className="absolute left-0 top-0 w-[2px] h-0 bg-blue-500 group-hover/item:h-full transition-all duration-500"
              />
              <h4 className={cn("text-[10px] uppercase tracking-widest text-blue-500 mb-1", spaceMono.className)}>The Patch</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">{project.patch}</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="relative pl-4 border-l-2 border-emerald-500/30 group/item">
              <motion.div
                className="absolute left-0 top-0 w-[2px] h-0 bg-emerald-500 group-hover/item:h-full transition-all duration-500"
              />
              <h4 className={cn("text-[10px] uppercase tracking-widest text-emerald-500 mb-1", spaceMono.className)}>Efficiency</h4>
              <p className="text-sm text-neutral-200 font-medium">{project.efficiency}</p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Metrics with animated counters */}
        {project.metrics && (
          <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5 mt-auto">
            {project.metrics.map((metric, i) => (
              <div key={i} className="bg-[#0c0c0c] p-3 text-center group-hover:bg-[#111] transition-colors">
                <p className={cn("text-lg font-bold text-[#FF3B30]", spaceMono.className)}>{metric.value}</p>
                <p className={cn("text-[9px] text-neutral-600 uppercase tracking-tight", spaceMono.className)}>{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-neutral-900/30 border-t border-white/5 flex items-center justify-between z-10">
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 3).map((tech, i) => (
            <span key={i} className={cn("text-[10px] text-neutral-500 bg-white/5 px-2 py-1 rounded-sm", spaceMono.className)}>
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.github && (
            <a href={project.github} className="text-neutral-500 hover:text-white transition-colors">
              <Github size={18} />
            </a>
          )}
          {project.link && (
            <a href={project.link} className="text-neutral-500 hover:text-[#FF3B30] transition-colors">
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Arsenal Card ---
const ArsenalCard = ({ category, icon: Icon, index }: { category: string; icon: React.ElementType; index: number }) => {
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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Landing1() {
  useArrivalSound();
  const [activeSection, setActiveSection] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for parallax hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  // Navigation highlight based on scroll
  useEffect(() => {
    const sections = ["hero", "systems", "arsenal", "architect", "transmission"];

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
      <BackgroundGrid />

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
              { id: 'systems', label: 'Systems' },
              { id: 'arsenal', label: 'Arsenal' },
              { id: 'architect', label: 'Architect' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
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
              href="#transmission"
              className={cn("ml-4 px-4 py-2 text-xs font-bold bg-[#FF3B30] text-white uppercase tracking-widest hover:bg-[#ff5d53] transition-colors", spaceMono.className)}
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">

        {/* --- Hero Section with Parallax + Glitch --- */}
        <motion.section
          id="hero"
          className="min-h-[90vh] flex flex-col justify-center mb-20 relative"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <div className="max-w-5xl">
            {/* Boot sequence with Glitch */}
            <GlitchReveal delay={0.2}>
              <div className={cn("flex items-center gap-3 mb-6 text-[#FF3B30] text-xs md:text-sm uppercase tracking-[0.25em]", spaceMono.className)}>
                <motion.span
                  className="w-2 h-2 bg-[#FF3B30] shadow-[0_0_10px_#FF3B30]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <ScrambleText text="System Online" delay={0.5} />
                <span className="w-8 h-[1px] bg-[#FF3B30]/50" />
                <span className="text-neutral-500">v2.0.26</span>
              </div>
            </GlitchReveal>

            {/* Main Headline with Glitch + stagger */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[0.9] text-neutral-100 uppercase">
                <GlitchReveal delay={0.5}>
                  <span className="block">Building</span>
                </GlitchReveal>
                <GlitchReveal delay={0.8}>
                  <span className="block text-transparent bg-clip-text bg-cover bg-center"
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E\"), linear-gradient(to right, #737373, #ffffff)",
                          backgroundBlendMode: "overlay"
                        }}>
                    <ScrambleText text="The Digital" delay={1.0} />
                  </span>
                </GlitchReveal>
                <GlitchReveal delay={1.1}>
                  <span className="block">Cortex.</span>
                </GlitchReveal>
              </h1>
            </div>

            {/* Subtext and CTA */}
            <GlitchReveal delay={1.8}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-l-2 border-[#FF3B30]/20 pl-6 md:border-none md:pl-0">
                <p className="max-w-xl text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
                  <span className="text-white font-medium">{profile.role}</span> specializing in bridging high-dimensional AI models with scalable, production-grade infrastructure.
                </p>
                <div className="flex items-center gap-4">
                  <span className={cn("text-xs text-neutral-600 uppercase tracking-widest text-right hidden md:block", spaceMono.className)}>
                    Available for<br/>Deployment
                  </span>
                  <div className="w-px h-8 bg-neutral-800 hidden md:block" />
                  <IndustrialButton href="#systems">
                    Explore Systems <ArrowUpRight size={16} />
                  </IndustrialButton>
                </div>
              </div>
            </GlitchReveal>
          </div>

          {/* Data Ticker at bottom of Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-20 left-0 right-0 z-20"
          >
            <DataTicker />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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

          {/* Parallax floating text */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden opacity-[0.03] pointer-events-none">
            <ParallaxText baseVelocity={-2} className={cn("text-[150px] font-black uppercase tracking-tighter text-white", manrope.className)}>
              Neural Architect • System Engineer • AI Builder •
            </ParallaxText>
          </div>
        </motion.section>

        {/* --- Systems Grid --- */}
        <section id="systems" className="scroll-mt-32 mb-40">
          <SectionHeader
            label="Selected Works"
            title="Mission Files"
            subtitle="A collection of deployed systems and architectural experiments."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </section>

        {/* --- Arsenal Section --- */}
        <section id="arsenal" className="scroll-mt-32 mb-40">
          <SectionHeader
            label="Technical Stack"
            title="Arsenal"
            subtitle="Core technologies for building robust digital infrastructures."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { category: "languages", icon: Code2 },
              { category: "ml", icon: Cpu },
              { category: "infrastructure", icon: Server },
              { category: "data", icon: Database },
              { category: "practices", icon: Globe },
            ].map((item, idx) => (
              <ArsenalCard key={item.category} category={item.category} icon={item.icon} index={idx} />
            ))}
          </div>
        </section>

        {/* --- Architect Section with Parallax Image --- */}
        <section id="architect" className="scroll-mt-32 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <SectionHeader label="The Architect" title="Kevin Narvaez" />

              <RevealOnScroll direction="left">
                <div className="relative aspect-square bg-neutral-900 border border-white/10 overflow-hidden group">
                  <motion.div
                    className="absolute inset-0 bg-[#FF3B30] mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  />
                  <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                    <motion.span
                      className={cn("text-8xl text-neutral-800 font-bold", manrope.className)}
                      whileHover={{ scale: 1.1, color: "#FF3B30" }}
                      transition={{ duration: 0.3 }}
                    >
                      KN
                    </motion.span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <RevealOnScroll direction="right">
                <h3 className={cn("text-2xl text-white mb-6 font-bold", manrope.className)}>
                  Engineering the bridge between <span className="text-[#FF3B30]">Abstract Logic</span> and <span className="text-[#FF3B30]">Concrete Reality</span>.
                </h3>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.2}>
                <div className="space-y-6 text-neutral-400 leading-relaxed text-lg font-light">
                  <p>{profile.bio}</p>
                  <p>My philosophy: Code is not just syntax; it is the blueprint for digital machinery.</p>
                </div>
              </RevealOnScroll>

              {/* Animated Stats */}
              <RevealOnScroll direction="up" delay={0.4}>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
                  <div>
                    <h4 className={cn("text-3xl font-bold text-white", spaceMono.className)}>
                      <AnimatedCounter value={profile.years} suffix="+" />
                    </h4>
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">Years</span>
                  </div>
                  <div>
                    <h4 className={cn("text-3xl font-bold text-white", spaceMono.className)}>
                      <AnimatedCounter value={projects.length} />
                    </h4>
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">Projects</span>
                  </div>
                  <div>
                    <h4 className={cn("text-3xl font-bold text-white", spaceMono.className)}>
                      <AnimatedCounter value={99} suffix="%" />
                    </h4>
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">Uptime</span>
                  </div>
                  <div>
                    <motion.div
                      className="flex items-center gap-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-emerald-500 uppercase tracking-widest">Available</span>
                    </motion.div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* --- Contact Section --- */}
        <section id="transmission" className="scroll-mt-32 mb-20">
          <RevealOnScroll direction="up">
            <div className="border border-white/10 bg-[#050505] relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF3B30] via-[#FF3B30]/50 to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 border-b lg:border-b-0 lg:border-r border-white/10">
                  <div className={cn("flex items-center gap-3 mb-6 text-[#FF3B30]", spaceMono.className)}>
                    <Terminal size={20} />
                    <span className="text-sm uppercase tracking-widest">Secure_Channel</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                    Ready to <br/> collaborate?
                  </h2>
                  <p className="text-neutral-400 mb-8 max-w-md">
                    Initialize a transmission to discuss system architecture, full-stack development, or AI integration.
                  </p>

                  <StaggerContainer className="flex flex-col gap-4" staggerDelay={0.1}>
                    <StaggerItem>
                      <a href={`mailto:${profile.email}`} className="flex items-center justify-between p-4 border border-white/10 hover:border-[#FF3B30] hover:bg-white/5 transition-all group">
                        <span className={cn("text-sm text-neutral-300", spaceMono.className)}>EMAIL</span>
                        <span className="text-neutral-500 group-hover:text-white transition-colors">{profile.email}</span>
                      </a>
                    </StaggerItem>
                    <StaggerItem>
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:border-[#FF3B30] hover:bg-white/5 transition-all group">
                        <span className={cn("text-sm text-neutral-300", spaceMono.className)}>LINKEDIN</span>
                        <Linkedin size={16} className="text-neutral-500 group-hover:text-white" />
                      </a>
                    </StaggerItem>
                    <StaggerItem>
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:border-[#FF3B30] hover:bg-white/5 transition-all group">
                        <span className={cn("text-sm text-neutral-300", spaceMono.className)}>GITHUB</span>
                        <Github size={16} className="text-neutral-500 group-hover:text-white" />
                      </a>
                    </StaggerItem>
                  </StaggerContainer>
                </div>

                <div className="p-10 flex flex-col justify-between bg-neutral-900/20">
                  <div className={cn("font-mono text-xs text-green-500/80 space-y-2", spaceMono.className)}>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      {`> establishing_connection... [OK]`}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      {`> encryption: AES-256`}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      {`> channel_status: OPEN`}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                    >
                      {`> await_input: `}<span className="animate-pulse">_</span>
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </section>

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
