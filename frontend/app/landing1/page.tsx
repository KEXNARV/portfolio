"use client";

import React, { useState } from "react";
import { Manrope, Space_Mono } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Terminal,
  ExternalLink,
  Github,
  Mail,
  Linkedin,
  ChevronRight,
  Activity,
  Shield,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useArrivalSound } from "@/hooks/use-arrival-sound";
import { projects, skills, profile, type Project } from "@/data/projects";

// --- Fuentes ---
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// --- Componentes UI ---

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

const SectionHeader = ({ label, title }: { label: string; title: string }) => (
  <div className="mb-12">
    <div className={cn("flex items-center gap-4 mb-4 text-[#FF3B30] text-xs uppercase tracking-widest", spaceMono.className)}>
      <span>// {label}</span>
      <span className="flex-1 h-[1px] bg-neutral-800" />
    </div>
    <h2 className={cn("text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-100", manrope.className)}>
      {title}
    </h2>
  </div>
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
  variant?: "primary" | "ghost";
}) => {
  const baseStyles = "group relative px-6 py-3 uppercase tracking-widest text-xs font-bold transition-all duration-300 overflow-hidden flex items-center gap-2";
  const variants = {
    primary: "bg-transparent border border-neutral-700 text-neutral-100 hover:bg-[#FF3B30] hover:border-[#FF3B30] hover:text-white",
    ghost: "border border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900"
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      className={cn(baseStyles, variants[variant], spaceMono.className, className)}
    >
      {children}
    </Component>
  );
};

// --- Project Card Component ---
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    DEPLOYED: "text-green-500 border-green-500/30",
    IN_PROGRESS: "text-yellow-500 border-yellow-500/30",
    ARCHIVED: "text-neutral-500 border-neutral-500/30"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border border-neutral-800 bg-[#0a0a0a] hover:border-neutral-700 transition-all duration-300"
    >
      {/* Scan line effect on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-[#FF3B30]/5 to-transparent transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Header */}
      <div className="border-b border-neutral-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn("text-xs text-neutral-600", spaceMono.className)}>{project.id}</span>
          <span className={cn("text-sm font-bold text-[#FF3B30]", spaceMono.className)}>{project.codename}</span>
        </div>
        <div className={cn("text-[10px] px-2 py-1 border rounded", statusColors[project.status], spaceMono.className)}>
          {project.status.replace("_", " ")}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className={cn("text-[10px] text-neutral-500 uppercase tracking-wider mb-2", spaceMono.className)}>
          {project.classification}
        </p>
        <h3 className={cn("text-xl font-bold text-neutral-100 mb-6 group-hover:text-white transition-colors", manrope.className)}>
          {project.title}
        </h3>

        {/* System Log Style Details */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-red-500/30 text-red-500">
              <Shield size={12} />
            </div>
            <div>
              <p className={cn("text-[10px] text-red-500 uppercase mb-1", spaceMono.className)}>The Glitch</p>
              <p className="text-sm text-neutral-400">{project.glitch}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-blue-500/30 text-blue-500">
              <Zap size={12} />
            </div>
            <div>
              <p className={cn("text-[10px] text-blue-500 uppercase mb-1", spaceMono.className)}>The Patch</p>
              <p className="text-sm text-neutral-400">{project.patch}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-green-500/30 text-green-500">
              <Activity size={12} />
            </div>
            <div>
              <p className={cn("text-[10px] text-green-500 uppercase mb-1", spaceMono.className)}>System Efficiency</p>
              <p className="text-sm text-neutral-300 font-medium">{project.efficiency}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-neutral-900/50 border border-neutral-800">
            {project.metrics.map((metric, i) => (
              <div key={i} className="text-center">
                <p className={cn("text-lg font-bold text-[#FF3B30]", spaceMono.className)}>{metric.value}</p>
                <p className={cn("text-[9px] text-neutral-500 uppercase", spaceMono.className)}>{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Stack */}
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 5).map((tech, i) => (
            <span
              key={i}
              className={cn("text-[10px] px-2 py-1 bg-neutral-900 text-neutral-400 border border-neutral-800", spaceMono.className)}
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 5 && (
            <span className={cn("text-[10px] px-2 py-1 text-neutral-600", spaceMono.className)}>
              +{project.stack.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800 p-4 flex justify-end gap-3">
        {project.github && (
          <a href={project.github} className="text-neutral-600 hover:text-white transition-colors">
            <Github size={16} />
          </a>
        )}
        {project.link && (
          <a href={project.link} className="text-neutral-600 hover:text-[#FF3B30] transition-colors">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

// --- Arsenal/Stack Section ---
const ArsenalSection = () => {
  const categories = [
    { key: "languages", label: "Languages", icon: ">" },
    { key: "ml", label: "ML/AI", icon: "λ" },
    { key: "infrastructure", label: "Infrastructure", icon: "◈" },
    { key: "data", label: "Data", icon: "⬡" },
    { key: "practices", label: "Practices", icon: "◉" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {categories.map((cat, idx) => (
        <motion.div
          key={cat.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="border border-neutral-800 bg-[#0a0a0a] p-4 hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-800">
            <span className={cn("text-[#FF3B30] text-lg", spaceMono.className)}>{cat.icon}</span>
            <span className={cn("text-xs text-neutral-400 uppercase tracking-wider", spaceMono.className)}>
              {cat.label}
            </span>
          </div>
          <div className="space-y-2">
            {skills[cat.key as keyof typeof skills].map((skill, i) => (
              <div
                key={i}
                className={cn(
                  "text-sm text-neutral-300 flex items-center gap-2 group cursor-default",
                  spaceMono.className
                )}
              >
                <ChevronRight size={10} className="text-neutral-700 group-hover:text-[#FF3B30] transition-colors" />
                {skill}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Main Component ---
export default function Landing1() {
  useArrivalSound();

  return (
    <div className={cn("min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#FF3B30] selection:text-white overflow-x-hidden", manrope.className)}>
      <NoiseOverlay />

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-40 border-b border-neutral-900 bg-[#050505]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#hero" className={cn("text-sm font-bold tracking-tighter flex items-center gap-2", spaceMono.className)}>
            <div className="w-2 h-2 bg-[#FF3B30]" />
            K.NARVAEZ / SYS.ENG
          </a>
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-500 uppercase tracking-widest">
            <a href="#systems" className="hover:text-white cursor-pointer transition-colors">Systems</a>
            <a href="#arsenal" className="hover:text-white cursor-pointer transition-colors">Arsenal</a>
            <a href="#architect" className="hover:text-white cursor-pointer transition-colors">Architect</a>
            <a href="#transmission" className="hover:text-white cursor-pointer transition-colors">Contact</a>
            <span className="text-[#FF3B30]">v2.0.0</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 container mx-auto px-6">

        {/* --- Hero Section --- */}
        <section id="hero" className="mb-32 relative min-h-[70vh] flex flex-col justify-center">
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
              {profile.role} specializing in bridging high-dimensional models with scalable, production-grade infrastructure.
            </p>

            <div className="flex flex-wrap gap-4">
              <IndustrialButton href="#systems">
                View Systems <ArrowUpRight size={16} />
              </IndustrialButton>
              <IndustrialButton href="#transmission" variant="ghost">
                Open Channel
              </IndustrialButton>
            </div>
          </motion.div>
        </section>

        {/* --- Selected Systems (Projects) --- */}
        <section id="systems" className="mb-32 scroll-mt-24">
          <SectionHeader label="Selected Systems" title="Mission Files" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* --- Arsenal (Tech Stack) --- */}
        <section id="arsenal" className="mb-32 scroll-mt-24">
          <SectionHeader label="Technical Arsenal" title="System Components" />
          <ArsenalSection />
        </section>

        {/* --- The Architect (About) --- */}
        <section id="architect" className="mb-32 scroll-mt-24">
          <SectionHeader label="The Architect" title="Behind The Systems" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 border border-neutral-800 bg-[#0a0a0a] p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <span className={cn("text-2xl text-[#FF3B30]", spaceMono.className)}>KN</span>
                </div>
                <div>
                  <h3 className={cn("text-xl font-bold text-neutral-100", manrope.className)}>{profile.name}</h3>
                  <p className={cn("text-sm text-neutral-500", spaceMono.className)}>{profile.role}</p>
                </div>
              </div>

              <p className="text-neutral-400 leading-relaxed mb-6">
                {profile.bio}
              </p>

              <div className="flex items-center gap-6 text-sm text-neutral-500">
                <span className={cn("flex items-center gap-2", spaceMono.className)}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Available for projects
                </span>
                <span className={spaceMono.className}>{profile.location}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-neutral-800 bg-[#0a0a0a] p-6"
            >
              <div className={cn("text-xs text-neutral-500 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-800", spaceMono.className)}>
                Quick Stats
              </div>
              <div className="space-y-4">
                <div>
                  <p className={cn("text-3xl font-bold text-[#FF3B30]", spaceMono.className)}>{profile.years}+</p>
                  <p className={cn("text-xs text-neutral-500", spaceMono.className)}>Years Experience</p>
                </div>
                <div>
                  <p className={cn("text-3xl font-bold text-neutral-100", spaceMono.className)}>{projects.filter(p => p.status === "DEPLOYED").length}</p>
                  <p className={cn("text-xs text-neutral-500", spaceMono.className)}>Systems Deployed</p>
                </div>
                <div>
                  <p className={cn("text-3xl font-bold text-neutral-100", spaceMono.className)}>99.9%</p>
                  <p className={cn("text-xs text-neutral-500", spaceMono.className)}>Uptime Record</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- Transmission (Contact) --- */}
        <section id="transmission" className="scroll-mt-24">
          <SectionHeader label="Open Channel" title="Transmission" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-neutral-800 bg-[#0a0a0a] overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="border-b border-neutral-800 px-4 py-2 flex items-center justify-between bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className={cn("text-xs text-neutral-600", spaceMono.className)}>transmission_protocol.sh</span>
              <Terminal size={14} className="text-neutral-600" />
            </div>

            {/* Terminal Content */}
            <div className={cn("p-6 text-sm", spaceMono.className)}>
              <div className="space-y-2 text-neutral-500 mb-6">
                <p><span className="text-green-500">$</span> establishing_connection...</p>
                <p><span className="text-green-500">$</span> encryption: <span className="text-neutral-300">enabled</span></p>
                <p><span className="text-green-500">$</span> channel_status: <span className="text-green-400">OPEN</span></p>
                <p><span className="text-green-500">$</span> awaiting_transmission_</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-4 border border-neutral-800 hover:border-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all group"
                >
                  <Mail size={20} className="text-neutral-600 group-hover:text-[#FF3B30]" />
                  <div>
                    <p className="text-xs text-neutral-500">Email</p>
                    <p className="text-neutral-300 group-hover:text-white">{profile.email}</p>
                  </div>
                </a>

                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-neutral-800 hover:border-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all group"
                >
                  <Github size={20} className="text-neutral-600 group-hover:text-[#FF3B30]" />
                  <div>
                    <p className="text-xs text-neutral-500">GitHub</p>
                    <p className="text-neutral-300 group-hover:text-white">@knarvaez</p>
                  </div>
                </a>

                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-neutral-800 hover:border-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all group"
                >
                  <Linkedin size={20} className="text-neutral-600 group-hover:text-[#FF3B30]" />
                  <div>
                    <p className="text-xs text-neutral-500">LinkedIn</p>
                    <p className="text-neutral-300 group-hover:text-white">/in/knarvaez</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- Footer --- */}
        <footer className="mt-32 border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className={spaceMono.className}>© 2026 {profile.name}</span>
            <span className="hidden md:inline">•</span>
            <span className="text-xs">{profile.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className={cn("text-xs", spaceMono.className)}>All systems operational</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
