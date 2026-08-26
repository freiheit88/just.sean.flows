import React from 'react';
import { motion } from 'framer-motion';

/**
 * ArchitecturalLedBoundaries
 * 
 * High-end architectural linear LED lighting fixtures positioned at top (~3%) and bottom (~3%).
 * Provides an authentic physical fixture aesthetic (recessed aluminum track, 18K warm-gold core filament,
 * multi-layered volumetric ambient diffusion, and subtle 432Hz harmonic breathing),
 * defining a clean visual boundary that prevents viewport cut-off across all mobile & desktop screens.
 */
export function ArchitecturalLedBoundaries({ tiltX = 0, tiltY = 0, isMuted = false }) {
    // Dynamic shimmer offset from device gyro
    const lightGlintOffset = Math.max(-40, Math.min(40, tiltX * 1.5));

    return (
        <div className="fixed inset-0 pointer-events-none z-[9998] select-none overflow-hidden">
            {/* ========================================================
                1. TOP ARCHITECTURAL LINEAR LED FIXTURE (~3% Envelope)
            ======================================================== */}
            <div className="fixed top-0 inset-x-0 h-7 sm:h-8 flex flex-col justify-start">
                {/* Layer A: Ambient Volumetric Downward Light Pool (3% Depth) */}
                <div 
                    className="absolute top-0 inset-x-0 h-10 sm:h-12 bg-gradient-to-b from-[#FFEAA0]/18 via-[#D4AF37]/06 to-transparent blur-md pointer-events-none"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                />

                {/* Layer B: Recessed Extruded Metal Track (Dark Titanium & Champagne Bevel) */}
                <div className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-[#1A1412] to-transparent border-b border-[#D4AF37]/35 flex items-center justify-center">
                    {/* Layer C: Razor-Thin 1.5px Ultra-Bright Neon Core Filament */}
                    <div 
                        className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#FFF9E6] to-transparent shadow-[0_0_12px_#FFF9E6,0_0_24px_#E7FF00,0_0_36px_rgba(212,175,55,0.7)]"
                        style={{
                            transform: `translateX(${lightGlintOffset}px)`,
                            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    />

                    {/* Layer D: Concentrated Center High-Intensity Diode Spotlight Glint */}
                    <motion.div 
                        animate={{
                            opacity: [0.75, 1.0, 0.75],
                            scaleX: [0.95, 1.05, 0.95]
                        }}
                        transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
                        className="absolute w-48 sm:w-80 h-[2.5px] bg-gradient-to-r from-transparent via-[#FFFFFF] to-transparent shadow-[0_0_20px_#FFFFFF,0_0_40px_#E7FF00]"
                    />
                </div>

                {/* Layer E: Micro Architectural Fixture Graticules & Spec Labels */}
                <div className="relative w-full px-4 sm:px-8 pt-1 flex items-center justify-between font-mono text-[7px] sm:text-[8px] font-black tracking-[0.3em] uppercase text-[#D4AF37]/50 drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#E7FF00] shadow-[0_0_6px_#E7FF00] animate-pulse" />
                        <span>BOUND • TOP · 0.03</span>
                    </span>
                    <span className="hidden sm:inline tracking-[0.4em] opacity-40">
                        JUST SEAN FLOWS // 432Hz LINEAR ILLUMINATION
                    </span>
                    <span className="opacity-70">
                        SAFE ZONE 94%
                    </span>
                </div>
            </div>

            {/* ========================================================
                2. BOTTOM ARCHITECTURAL LINEAR LED FIXTURE (~3% Envelope)
            ======================================================== */}
            <div className="fixed bottom-0 inset-x-0 h-7 sm:h-8 flex flex-col justify-end">
                {/* Layer E: Bottom Micro Architectural Graticules */}
                <div className="relative w-full px-4 sm:px-8 pb-1 flex items-center justify-between font-mono text-[7px] sm:text-[8px] font-black tracking-[0.3em] uppercase text-[#D4AF37]/50 drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]">
                    <span className="opacity-70">
                        FRAME BOUNDARY
                    </span>
                    <span className="hidden sm:inline tracking-[0.4em] opacity-40">
                        FRANKFURT ATELIER // ARCHITECTURAL LED BEAM
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span>BOUND • BTM · 0.03</span>
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37] animate-pulse" />
                    </span>
                </div>

                {/* Layer B: Recessed Extruded Metal Track (Bottom) */}
                <div className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-[#1A1412] to-transparent border-t border-[#D4AF37]/35 flex items-center justify-center">
                    {/* Layer C: Razor-Thin 1.5px Ultra-Bright Neon Core Filament */}
                    <div 
                        className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#FFF9E6] to-transparent shadow-[0_0_12px_#FFF9E6,0_0_24px_#E7FF00,0_0_36px_rgba(212,175,55,0.7)]"
                        style={{
                            transform: `translateX(${-lightGlintOffset}px)`,
                            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    />

                    {/* Layer D: Concentrated Center High-Intensity Diode Spotlight Glint */}
                    <motion.div 
                        animate={{
                            opacity: [0.75, 1.0, 0.75],
                            scaleX: [0.95, 1.05, 0.95]
                        }}
                        transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut", delay: 1.8 }}
                        className="absolute w-48 sm:w-80 h-[2.5px] bg-gradient-to-r from-transparent via-[#FFFFFF] to-transparent shadow-[0_0_20px_#FFFFFF,0_0_40px_#E7FF00]"
                    />
                </div>

                {/* Layer A: Ambient Volumetric Upward Light Pool (3% Depth) */}
                <div 
                    className="absolute bottom-0 inset-x-0 h-10 sm:h-12 bg-gradient-to-t from-[#FFEAA0]/18 via-[#D4AF37]/06 to-transparent blur-md pointer-events-none"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                />
            </div>
        </div>
    );
}
