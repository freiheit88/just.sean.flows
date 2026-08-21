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
                            whileHover={{ scale: 1.018 }}
                            whileTap={{ scale: 0.982 }}
                            className="w-full h-full cursor-pointer group outline-none relative flex flex-col items-center justify-center"
                            style={{
                                transform: `translate3d(${tiltX * 0.08}px, ${tiltY * 0.08}px, 8px) rotateX(${-tiltY * 0.15}deg) rotateY(${tiltX * 0.15}deg)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.15s ease-out'
                            }}
                        >
                            {/* 1. JARVIS Holographic Rich Fill & Smooth Organic Glow */}
                            <motion.div 
                                animate={{
                                    opacity: [0.9, 1.0, 0.85, 0.98, 0.9],
                                    scale: [1, 1.015, 0.992, 1.012, 1],
                                    filter: [
                                        'drop-shadow(0 0 12px rgba(0,255,136,0.6)) drop-shadow(0 0 24px rgba(118,255,3,0.3))',
                                        'drop-shadow(0 0 22px rgba(0,255,136,0.85)) drop-shadow(0 0 42px rgba(0,229,255,0.5)) drop-shadow(0 0 60px rgba(118,255,3,0.35))',
                                        'drop-shadow(0 0 14px rgba(0,255,136,0.65)) drop-shadow(0 0 28px rgba(118,255,3,0.35))',
                                        'drop-shadow(0 0 26px rgba(0,255,136,0.9)) drop-shadow(0 0 50px rgba(0,229,255,0.6)) drop-shadow(0 0 70px rgba(118,255,3,0.4))',
                                        'drop-shadow(0 0 12px rgba(0,255,136,0.6)) drop-shadow(0 0 24px rgba(118,255,3,0.3))'
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
                                        {/* Rich Visible Jarvis Cyber-Hologram Lime-Emerald Radial Fill */}
                                        <radialGradient id="jarvisRichFill" cx="50%" cy="40%" r="65%">
                                            <stop offset="0%" stopColor="#CCFF90" stopOpacity="0.48" />
                                            <stop offset="35%" stopColor="#00FF88" stopOpacity="0.36" />
                                            <stop offset="70%" stopColor="#00E676" stopOpacity="0.22" />
                                            <stop offset="100%" stopColor="#00B0FF" stopOpacity="0.10" />
                                        </radialGradient>

                                        {/* Smooth Rounded Green-Matched Border Gradient (85% Opacity / 15% Transparency) */}
                                        <linearGradient id="jarvisSmoothBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#CCFF90" stopOpacity="0.88" />
                                            <stop offset="35%" stopColor="#00FF88" stopOpacity="0.85" />
                                            <stop offset="70%" stopColor="#00E5FF" stopOpacity="0.80" />
                                            <stop offset="100%" stopColor="#76FF03" stopOpacity="0.85" />
                                        </linearGradient>
                                    </defs>

                                    {/* Jarvis Translucent Rich Ambient Arch Fill */}
                                    <path
                                        d="M 50 0 C 84 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 16 26.25, 50 0 Z"
                                        fill="url(#jarvisRichFill)"
                                        className="transition-opacity duration-300 group-hover:opacity-100"
                                    />

                                    {/* Smooth Rounded Harmonious Border (Green-matched, 15% transparency, rounded joins) */}
                                    <path
                                        d="M 50 0 C 84 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 16 26.25, 50 0 Z"
                                        fill="none"
                                        stroke="url(#jarvisSmoothBorder)"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="transition-all duration-300 group-hover:stroke-white/90 group-hover:stroke-width-[1.9]"
                                    />
                                </svg>
                            </motion.div>

                            {/* 2. Soft Prismatic Hologram Sheen Sweep */}
                            <motion.div
                                animate={{
                                    x: ['-140%', '170%'],
                                    opacity: [0, 0.45, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3.4,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-[#CCFF90]/30 via-[#00E5FF]/18 to-transparent -skew-x-18 pointer-events-none"
                            />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
