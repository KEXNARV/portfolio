"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Playfair_Display } from "next/font/google";
import { Project } from "@/data/projects";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], weight: ["400", "700"] });

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={containerRef}
            style={{ opacity }}
            className={cn(
                "min-h-[80vh] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center py-20 border-t border-white/10 last:border-b",
                index % 2 === 0 ? "" : "md:flex-row-reverse" // Alternating layout support if flex, but grid is rigid. We can shift columns.
            )}
        >
            {/* Text Side - Swaps based on index for even/odd */}
            <div className={cn("md:col-span-5 flex flex-col gap-6", index % 2 === 1 ? "md:order-2" : "md:order-1")}>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-neutral-500">{(index + 1).toString().padStart(2, '0')}</span>
                    <span className="h-px w-12 bg-neutral-800" />
                    <span className="text-xs uppercase tracking-widest text-[#FF3B30]">{project.classification}</span>
                </div>

                <h3 className={cn("text-5xl md:text-7xl leading-[0.9]", playfair.className)}>
                    {project.codename}
                </h3>

                <p className="text-xl md:text-2xl text-white font-bold max-w-lg">
                    {project.title}
                </p>

                <div className="space-y-4 my-4">
                    <div className="pl-4 border-l border-white/20">
                        <p className="text-xs uppercase text-neutral-500 mb-1">Challenge</p>
                        <p className="text-neutral-400 text-sm leading-relaxed">{project.glitch}</p>
                    </div>
                    <div className="pl-4 border-l border-[#FF3B30]">
                        <p className="text-xs uppercase text-neutral-500 mb-1">Solution</p>
                        <p className="text-white text-sm leading-relaxed">{project.patch}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase hover:bg-white/10 transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex gap-6 mt-4">
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm uppercase font-bold tracking-widest hover:text-[#FF3B30] transition-colors group">
                            Live Demo
                            <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform w-4 h-4" />
                        </a>
                    )}
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm uppercase font-bold tracking-widest hover:text-[#FF3B30] transition-colors group">
                            Code
                            <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* Image / Visual Side */}
            <div className={cn("md:col-span-7 h-full relative", index % 2 === 1 ? "md:order-1" : "md:order-2")}>
                <motion.div
                    style={{ y }}
                    className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden group grayscale hover:grayscale-0 transition-all duration-700"
                >
                    {/* Fallback pattern if no image */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[size:24px_24px]" />

                    {project.metrics && project.metrics.length > 0 && (
                        <div className="absolute bottom-0 right-0 p-8 bg-black/80 backdrop-blur-md border-l border-t border-white/10 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <div className="text-4xl font-bold text-[#FF3B30] tabular-nums">
                                {project.metrics[0].value}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
                                {project.metrics[0].label}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
