"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

interface IndustrialImageProps {
    src: string;
    alt?: string;
    className?: string;
}

export default function IndustrialImage({ src, alt = "Image", className }: IndustrialImageProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div className={cn("relative", className)}>
            {/* Industrial frame */}
            <div className="absolute -inset-3 border border-[#FF3B30]/30" />
            <div className="absolute -inset-6 border border-neutral-800" />

            {/* Corner accents */}
            <div className="absolute -top-6 -left-6 w-3 h-3 border-t-2 border-l-2 border-[#FF3B30]" />
            <div className="absolute -top-6 -right-6 w-3 h-3 border-t-2 border-r-2 border-[#FF3B30]" />
            <div className="absolute -bottom-6 -left-6 w-3 h-3 border-b-2 border-l-2 border-[#FF3B30]" />
            <div className="absolute -bottom-6 -right-6 w-3 h-3 border-b-2 border-r-2 border-[#FF3B30]" />

            {/* Loading/Error Placeholder */}
            {(!imageLoaded || imageError) && (
                <div className="w-full h-full bg-neutral-900 border border-neutral-800 flex items-center justify-center min-h-[300px]">
                    {imageError ? (
                        <div className="text-center p-6">
                            <div className={cn("text-xs text-neutral-600 uppercase tracking-widest mb-2", spaceMono.className)}>
                                Image Load Failed
                            </div>
                            <div className="text-neutral-700">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className={cn("text-xs text-neutral-600 uppercase tracking-widest animate-pulse", spaceMono.className)}>
                                Loading Data...
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Image */}
            <img
                src={src}
                alt={alt}
                className={cn(
                    "w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500",
                    !imageLoaded && "hidden"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                    setImageLoaded(false);
                    setImageError(true);
                }}
            />

            {/* Scanline overlay (optional, adds to aesthetic) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
        </div>
    );
}
