import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function StainedGlassArch({ isVisible, isAudioUnlocked, tiltX, tiltY, onOpenAtelier }) {
    return (
        <AnimatePresence>
            {isVisible && isAudioUnlocked && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 z-30 pointer-events-none"
                    style={{ perspective: 800 }}
                >
                    {/* Mobile-Prioritized Exact Calibrated Transom: Top 16.4%, Left 54%, Width 53.5%, Height 24.2% */}
                    <div 
                        style={{
                            position: 'absolute',
                            top: '16.4%',
                            left: '54%',
                            transform: 'translateX(-50%)',
                            width: '53.5%',
                            height: '24.2%'
                        }}
                        className="pointer-events-auto flex flex-col items-center justify-center select-none"
                    >
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenAtelier();
                            }}
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            className="w-full h-full cursor-pointer group outline-none relative flex flex-col items-center justify-center"
                            style={{
                                transform: `translate3d(${tiltX * 0.08}px, ${tiltY * 0.08}px, 6px) rotateX(${-tiltY * 0.15}deg) rotateY(${tiltX * 0.15}deg)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.15s ease-out'
                            }}
                        >
                            {/* 1. Organic Warm Volumetric Backlight & Atmosphere Glow */}
                            <motion.div 
                                animate={{
                                    opacity: [0.75, 1.0, 0.7, 0.95, 0.75],
                                    scale: [1, 1.02, 0.99, 1.015, 1],
                                    filter: [
                                        'drop-shadow(0 0 12px rgba(255,193,7,0.45)) drop-shadow(0 0 25px rgba(245,124,0,0.25))',
                                        'drop-shadow(0 0 22px rgba(255,213,79,0.75)) drop-shadow(0 0 45px rgba(255,143,0,0.45))',
                                        'drop-shadow(0 0 14px rgba(255,193,7,0.5)) drop-shadow(0 0 28px rgba(245,124,0,0.3))',
                                        'drop-shadow(0 0 28px rgba(255,224,130,0.85)) drop-shadow(0 0 55px rgba(230,81,0,0.5))',
                                        'drop-shadow(0 0 12px rgba(255,193,7,0.45)) drop-shadow(0 0 25px rgba(245,124,0,0.25))'
                                    ]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.4,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                            >
                                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <defs>
                                        {/* Authentic Warm Candle/Chandelier Stained Glass Volumetric Gradient */}
                                        <radialGradient id="candleGlassGlow" cx="50%" cy="45%" r="60%">
                                            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.42" />
                                            <stop offset="40%" stopColor="#FFC107" stopOpacity="0.28" />
                                            <stop offset="75%" stopColor="#FF8F00" stopOpacity="0.18" />
                                            <stop offset="100%" stopColor="#3E2723" stopOpacity="0.05" />
                                        </radialGradient>

                                        {/* Ultra-Refined Antique Brass Hairline Rim */}
                                        <linearGradient id="antiqueBrassHairline" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#FFE082" stopOpacity="0.9" />
                                            <stop offset="45%" stopColor="#C5A059" stopOpacity="0.65" />
                                            <stop offset="80%" stopColor="#8D6E63" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#FFE082" stopOpacity="0.8" />
                                        </linearGradient>
                                    </defs>

                                    {/* Mobile Calibrated Pointed Gothic Arch Fill */}
                                    <path
                                        d="M 50 0 C 84 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 16 26.25, 50 0 Z"
                                        fill="url(#candleGlassGlow)"
                                        className="transition-opacity duration-300 group-hover:opacity-90"
                                    />

                                    {/* 0.75px Architectural Antique Brass Hairline Border */}
                                    <path
                                        d="M 50 0 C 84 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 16 26.25, 50 0 Z"
                                        fill="none"
                                        stroke="url(#antiqueBrassHairline)"
                                        strokeWidth="0.85"
                                        className="transition-all duration-300 group-hover:stroke-[#FFF9C4] group-hover:stroke-width-[1.2]"
                                    />
                                </svg>
                            </motion.div>

                            {/* 2. Delicate Prismatic Glass Specular Glint */}
                            <motion.div
                                animate={{
                                    x: ['-130%', '160%'],
                                    opacity: [0, 0.45, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3.6,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-[#FFFDE7]/25 to-transparent -skew-x-18 pointer-events-none"
                            />

                            {/* 3. Understated Luxury Floating Beacon (Pill Badge) */}
                            <motion.div 
                                animate={{
                                    y: [0, -3, 0],
                                    boxShadow: [
                                        "0 4px 15px rgba(0,0,0,0.8), 0 0 15px rgba(231,255,0,0.3)",
                                        "0 6px 20px rgba(0,0,0,0.9), 0 0 25px rgba(231,255,0,0.55)",
                                        "0 4px 15px rgba(0,0,0,0.8), 0 0 15px rgba(231,255,0,0.3)"
                                    ]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeInOut"
                                }}
                                className="absolute -bottom-4 z-40 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#E7FF00]/40 flex items-center gap-1.5 pointer-events-auto transition-transform duration-300 group-hover:scale-105 group-hover:border-[#E7FF00]"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E7FF00] shadow-[0_0_8px_#E7FF00] animate-ping" />
                                <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#E7FF00] tracking-[0.2em] uppercase">
                                    ATELIER // ENTER ➔
                                </span>
                            </motion.div>
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
