"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface StackTickerProps {
    skills: {
        [category: string]: string[];
    };
}

const TickerRow = ({ items, direction = "left", speed = 20 }: { items: string[], direction?: "left" | "right", speed?: number }) => {
    return (
        <div className="relative flex overflow-hidden py-4 group">
            <motion.div
                className="flex gap-16 whitespace-nowrap"
                animate={{ x: direction === "left" ? "-50%" : "0%" }}
                initial={{ x: direction === "left" ? "0%" : "-50%" }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                    repeatType: "loop"
                }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <span key={i} className={cn("text-4xl md:text-6xl font-black text-white/10 uppercase hover:text-white/40 transition-colors cursor-default", inter.className)}>
                        {item}
                    </span>
                ))}
            </motion.div>

            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
        </div>
    );
};

export default function StackTicker({ skills }: StackTickerProps) {
    // Flatten skills or display by category? Let's do rows by category groups for visual density.

    const allSkills = Object.values(skills).flat();

    // Split into 3 rows for visual effect
    const row1 = allSkills.slice(0, Math.ceil(allSkills.length / 3));
    const row2 = allSkills.slice(Math.ceil(allSkills.length / 3), Math.ceil(allSkills.length * 2 / 3));
    const row3 = allSkills.slice(Math.ceil(allSkills.length * 2 / 3));

    return (
        <div className="w-full py-20 flex flex-col gap-0 select-none">
            <div className="px-4 md:px-20 mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-[#FF3B30]">Skillset / Arsenal</span>
            </div>

            <div className="-rotate-1 hover:rotate-0 transition-transform duration-700">
                <TickerRow items={row1} speed={40} direction="left" />
                <TickerRow items={row2} speed={50} direction="right" />
                <TickerRow items={row3} speed={45} direction="left" />
            </div>
        </div>
    );
}
