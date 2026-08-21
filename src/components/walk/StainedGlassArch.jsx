import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function StainedGlassArch({ isVisible, isAudioUnlocked, tiltX, tiltY, onOpenAtelier }) {
    return (
        <AnimatePresence>
            {isVisible && isAudioUnlocked && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute inset-0 z-30 pointer-events-none"
                    style={{ perspective: 800 }}
                >
                    {/* User Calibrated 1:1 Pixel-Perfect Stained Glass Transom: Top 16.8%, Left 54.6%, Width 56%, Height 24.6% */}
                    <div 
                        style={{
                            position: 'absolute',
                            top: '16.8%',
                            left: '54.6%',
                            transform: 'translateX(-50%)',
                            width: '56%',
                            height: '24.6%'
                        }}
                        className="pointer-events-auto flex items-center justify-center select-none"
                    >
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenAtelier();
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-full cursor-pointer group outline-none relative flex items-center justify-center"
                            style={{
                                transform: `translate3d(${tiltX * 0.1}px, ${tiltY * 0.1}px, 8px) rotateX(${-tiltY * 0.18}deg) rotateY(${tiltX * 0.18}deg)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.15s ease-out'
                            }}
                        >
                            {/* Multi-Layer 3D Prismatic Glow & Organic Musical Pulse */}
                            <motion.div 
                                animate={{
                                    scale: [1, 1.03, 0.99, 1.04, 1],
                                    filter: [
                                        'drop-shadow(0 0 16px rgba(255,183,3,0.7)) drop-shadow(0 0 35px rgba(230,126,34,0.5)) drop-shadow(0 0 45px rgba(194,24,91,0.3))',
                                        'drop-shadow(0 0 32px rgba(255,215,0,0.95)) drop-shadow(0 0 65px rgba(230,126,34,0.75)) drop-shadow(0 0 80px rgba(194,24,91,0.5))',
                                        'drop-shadow(0 0 18px rgba(255,183,3,0.7)) drop-shadow(0 0 40px rgba(230,126,34,0.5)) drop-shadow(0 0 50px rgba(194,24,91,0.3))',
                                        'drop-shadow(0 0 42px rgba(255,215,0,1)) drop-shadow(0 0 85px rgba(211,84,0,0.85)) drop-shadow(0 0 100px rgba(194,24,91,0.6))',
                                        'drop-shadow(0 0 16px rgba(255,183,3,0.7)) drop-shadow(0 0 35px rgba(230,126,34,0.5)) drop-shadow(0 0 45px rgba(194,24,91,0.3))'
                                    ]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.15,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                            >
                                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <defs>
                                        {/* Rich Chromatic Amber-Ruby Iridescent Gradient */}
                                        <radialGradient id="chromaticGlassGlow" cx="50%" cy="40%" r="65%">
                                            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.30" />
                                            <stop offset="35%" stopColor="#FFB300" stopOpacity="0.22" />
                                            <stop offset="65%" stopColor="#E65100" stopOpacity="0.16" />
                                            <stop offset="85%" stopColor="#880E4F" stopOpacity="0.10" />
                                            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.08" />
                                        </radialGradient>

                                        {/* Multi-Spectrum Antique Gold Leaded Stroke */}
                                        <linearGradient id="richGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#FFF59D" />
                                            <stop offset="25%" stopColor="#FFB300" />
                                            <stop offset="50%" stopColor="#F57C00" />
                                            <stop offset="75%" stopColor="#D81B60" />
                                            <stop offset="90%" stopColor="#FFD54F" />
                                            <stop offset="100%" stopColor="#00E5FF" />
                                        </linearGradient>

                                        {/* Inner Panel Dividers for 3 Gothic Panes */}
                                        <linearGradient id="mullionStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#FF6F00" stopOpacity="0.4" />
                                        </linearGradient>
                                    </defs>

                                    {/* Full Stilted Gothic Pointed Arch Fill matching Calibrated Path */}
                                    <path
                                        d="M 50 0 C 91 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 9 26.25, 50 0 Z"
                                        fill="url(#chromaticGlassGlow)"
                                        className="group-hover:opacity-95 transition-opacity"
                                    />

                                    {/* Subtle Leaded Glass Inner Mullion Lines (3D Depth Structure) */}
                                    <path
                                        d="M 32 45 L 32 99 M 68 45 L 68 99 M 1 72 L 99 72"
                                        stroke="url(#mullionStroke)"
                                        strokeWidth="0.9"
                                        strokeDasharray="2 2"
                                        fill="none"
                                        className="opacity-45 group-hover:opacity-80 transition-opacity"
                                    />

                                    {/* Precise Outer Pointed Gothic Arch Border */}
                                    <path
                                        d="M 50 0 C 91 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 9 26.25, 50 0 Z"
                                        fill="none"
                                        stroke="url(#richGoldStroke)"
                                        strokeWidth="2.4"
                                        className="transition-all duration-300 group-hover:stroke-white/95"
                                    />
                                </svg>
                            </motion.div>

                            {/* 3D Caustic Glass Light Sweep */}
                            <motion.div
                                animate={{
                                    x: ['-140%', '180%'],
                                    opacity: [0, 0.65, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.8,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#FFFDE7]/35 via-[#00E5FF]/20 to-transparent -skew-x-18 pointer-events-none"
                            />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
