"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Manrope, Space_Mono } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Archive,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GridScan } from "@/components/GridScan";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  codename: string | null;
  status: string | null;
  classification: string | null;
  problem: string | null;
  solution: string | null;
  impact: string | null;
  metrics: Array<{ label: string; value: string }> | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3001/projects/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "DEPLOYED":
        return <CheckCircle2 className="w-5 h-5" />;
      case "IN_PROGRESS":
        return <AlertCircle className="w-5 h-5" />;
      case "ARCHIVED":
        return <Archive className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "DEPLOYED":
        return "text-green-500 border-green-500/30 bg-green-500/10";
      case "IN_PROGRESS":
        return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10";
      case "ARCHIVED":
        return "text-neutral-500 border-neutral-600 bg-neutral-700/10";
      default:
        return "text-blue-500 border-blue-500/30 bg-blue-500/10";
    }
  };

  if (loading) {
    return (
      <div className={cn("min-h-screen bg-[#030303] flex items-center justify-center", manrope.className)}>
        <Loader2 className="w-12 h-12 animate-spin text-[#FF3B30]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={cn("min-h-screen bg-[#030303] flex items-center justify-center p-6", manrope.className)}>
        <div className="text-center">
          <div className={cn("text-[#FF3B30] text-6xl font-bold mb-4", spaceMono.className)}>404</div>
          <h1 className="text-2xl text-white mb-4">Project Not Found</h1>
          <button
            onClick={() => router.push("/landing1")}
            className="px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#ff5d53] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-[#030303] text-[#ededed] overflow-x-hidden", manrope.className)}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <GridScan linesColor="#FF3B30" scanColor="#FF3B30" />
      </div>

      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-[1]">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 bg-[#030303]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push("/landing1")}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className={cn("text-xs uppercase tracking-widest", spaceMono.className)}>
                Back to Projects
              </span>
            </button>

            <div className="flex items-center gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#ff5d53] transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className={cn("text-xs uppercase tracking-wider", spaceMono.className)}>
                    Live Demo
                  </span>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-700 text-white rounded-lg hover:border-[#FF3B30] hover:text-[#FF3B30] transition-colors"
                >
                  <Github size={16} />
                  <span className={cn("text-xs uppercase tracking-wider", spaceMono.className)}>
                    Source Code
                  </span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Codename & Status */}
            <div className="flex items-center gap-3 mb-6">
              {project.codename && (
                <div className={cn("px-4 py-2 bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded text-[#FF3B30] text-lg font-bold", spaceMono.className)}>
                  {project.codename}
                </div>
              )}
              {project.status && (
                <div className={cn("px-3 py-1.5 border rounded flex items-center gap-2", getStatusColor(project.status))}>
                  {getStatusIcon(project.status)}
                  <span className={cn("text-sm font-medium", spaceMono.className)}>
                    {project.status.replace("_", " ")}
                  </span>
                </div>
              )}
              {project.classification && (
                <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400">
                  <span className={cn("text-sm", spaceMono.className)}>
                    {project.classification}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-neutral-400 max-w-4xl">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 mt-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
              {project.featured && (
                <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500">
                  Featured Project
                </div>
              )}
            </div>
          </motion.div>

          {/* Image */}
          {project.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="relative">
                <div className="absolute -inset-3 border border-[#FF3B30]/30" />
                <div className="absolute -inset-6 border border-neutral-800" />
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full rounded-lg"
                />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Problem */}
              {project.problem && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="mb-4">
                    <div className={cn("text-[#FF3B30] text-xs uppercase tracking-[0.3em] mb-2", spaceMono.className)}>
                      // PROBLEM IDENTIFIED
                    </div>
                    <h2 className="text-2xl font-bold text-white">The Challenge</h2>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <p className="text-neutral-300 leading-relaxed">{project.problem}</p>
                  </div>
                </motion.section>
              )}

              {/* Solution */}
              {project.solution && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="mb-4">
                    <div className={cn("text-green-500 text-xs uppercase tracking-[0.3em] mb-2", spaceMono.className)}>
                      // SOLUTION DEPLOYED
                    </div>
                    <h2 className="text-2xl font-bold text-white">The Approach</h2>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <p className="text-neutral-300 leading-relaxed">{project.solution}</p>
                  </div>
                </motion.section>
              )}

              {/* Impact */}
              {project.impact && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="mb-4">
                    <div className={cn("text-blue-500 text-xs uppercase tracking-[0.3em] mb-2", spaceMono.className)}>
                      // IMPACT MEASURED
                    </div>
                    <h2 className="text-2xl font-bold text-white">The Results</h2>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <p className="text-neutral-300 leading-relaxed">{project.impact}</p>
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
                >
                  <h3 className={cn("text-[#FF3B30] text-xs uppercase tracking-[0.3em] mb-4", spaceMono.className)}>
                    Key Metrics
                  </h3>
                  <div className="space-y-4">
                    {project.metrics.map((metric, index) => (
                      <div key={index} className="border-l-2 border-[#FF3B30] pl-4">
                        <div className="text-sm text-neutral-500">{metric.label}</div>
                        <div className={cn("text-2xl font-bold text-white", spaceMono.className)}>
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tech Stack */}
              {project.techStack.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
                >
                  <h3 className={cn("text-[#FF3B30] text-xs uppercase tracking-[0.3em] mb-4", spaceMono.className)}>
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded text-sm text-neutral-300 hover:border-[#FF3B30] hover:text-white transition-colors"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20 py-8">
          <div className="container mx-auto px-6 text-center">
            <button
              onClick={() => router.push("/landing1")}
              className="text-neutral-500 hover:text-[#FF3B30] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span className={cn("text-xs uppercase tracking-widest", spaceMono.className)}>
                Back to All Projects
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
