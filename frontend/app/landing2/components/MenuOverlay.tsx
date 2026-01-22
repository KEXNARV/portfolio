"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { title: "Home", href: "#" },
    { title: "Work", href: "#" },
    { title: "About", href: "#" },
    { title: "Contact", href: "#" },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[60] bg-zinc-950 text-white flex flex-col items-center justify-center"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close menu"
                    >
                        <X size={32} />
                    </button>

                    <motion.div
                        className="flex flex-col gap-8 items-center"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={{
                            open: {
                                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                            },
                            closed: {
                                transition: { staggerChildren: 0.05, staggerDirection: -1 }
                            }
                        }}
                    >
                        {menuItems.map((item, index) => (
                            <motion.a
                                key={index}
                                href={item.href}
                                className={cn("text-6xl md:text-8xl font-black uppercase tracking-tighter hover:text-neutral-500 transition-colors flex items-center gap-4 group", inter.className)}
                                variants={{
                                    open: { opacity: 1, y: 0 },
                                    closed: { opacity: 0, y: 50 }
                                }}
                            >
                                {item.title}
                                <ArrowUpRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300 w-12 h-12" />
                            </motion.a>
                        ))}
                    </motion.div>

                    <motion.div
                        className="absolute bottom-12 flex flex-col items-center gap-2 text-neutral-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.8 } }}
                    >
                        <p className={playfair.className}>Paris • New York • Tokyo</p>
                        <p className="text-xs uppercase tracking-widest font-mono">© 2024 System Vision</p>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
