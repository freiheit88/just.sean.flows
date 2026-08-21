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
                            {/* 1. JARVIS Holographic Soft Glow & Breathing Pulse */}
                            <motion.div 
                                animate={{
                                    opacity: [0.85, 1.0, 0.8, 0.98, 0.85],
                                    scale: [1, 1.02, 0.99, 1.018, 1],
                                    filter: [
                                        'drop-shadow(0 0 14px rgba(0,255,136,0.65)) drop-shadow(0 0 28px rgba(118,255,3,0.35))',
                                        'drop-shadow(0 0 26px rgba(0,255,136,0.95)) drop-shadow(0 0 50px rgba(0,229,255,0.65)) drop-shadow(0 0 70px rgba(118,255,3,0.45))',
                                        'drop-shadow(0 0 16px rgba(0,255,136,0.7)) drop-shadow(0 0 32px rgba(118,255,3,0.4))',
                                        'drop-shadow(0 0 32px rgba(0,255,136,1)) drop-shadow(0 0 60px rgba(0,229,255,0.75)) drop-shadow(0 0 85px rgba(118,255,3,0.5))',
                                        'drop-shadow(0 0 14px rgba(0,255,136,0.65)) drop-shadow(0 0 28px rgba(118,255,3,0.35))'
                                    ]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.2,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                            >
                                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <defs>
                                        {/* Jarvis Cyber-Hologram Translucent Lime-Emerald Gradient */}
                                        <radialGradient id="jarvisHoloFill" cx="50%" cy="42%" r="65%">
                                            <stop offset="0%" stopColor="#CCFF90" stopOpacity="0.26" />
                                            <stop offset="35%" stopColor="#00E676" stopOpacity="0.18" />
                                            <stop offset="70%" stopColor="#00B0FF" stopOpacity="0.09" />
                                            <stop offset="100%" stopColor="#004D40" stopOpacity="0.0" />
                                        </radialGradient>

                                        {/* Bold Soft-Glow Jarvis Lime-Emerald Stroke Gradient */}
                                        <linearGradient id="jarvisBorderGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#CCFF90" />
                                            <stop offset="30%" stopColor="#00FF88" />
                                            <stop offset="70%" stopColor="#00E5FF" />
                                            <stop offset="100%" stopColor="#76FF03" />
                                        </linearGradient>
                                    </defs>

                                    {/* Jarvis Translucent Ambient Arch Fill */}
                                    <path
                                        d="M 50 0 C 84 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 16 26.25, 50 0 Z"
                                        fill="url(#jarvisHoloFill)"
                                        className="transition-opacity duration-300 group-hover:opacity-95"
                                    />

                                    {/* Bolder Soft-Glowing Holographic Border */}
                                    <path
                                        d="M 50 0 C 84 26.25, 99 63.75, 99 75 L 99 99 L 1 99 L 1 75 C 1 63.75, 16 26.25, 50 0 Z"
                                        fill="none"
                                        stroke="url(#jarvisBorderGlow)"
                                        strokeWidth="2.0"
                                        className="transition-all duration-300 group-hover:stroke-white group-hover:stroke-width-[2.4]"
                                    />
                                </svg>
                            </motion.div>

                            {/* 2. Cyber-Hologram Laser Sheen Sweep */}
                            <motion.div
                                animate={{
                                    x: ['-140%', '170%'],
                                    opacity: [0, 0.55, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3.2,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#CCFF90]/35 via-[#00E5FF]/20 to-transparent -skew-x-18 pointer-events-none"
                            />

                            {/* 3. Jarvis Holographic Pill Badge */}
                            <motion.div 
                                animate={{
                                    y: [0, -3, 0],
                                    boxShadow: [
                                        "0 4px 15px rgba(0,0,0,0.85), 0 0 18px rgba(0,255,136,0.45)",
                                        "0 6px 22px rgba(0,0,0,0.95), 0 0 30px rgba(0,255,136,0.75), 0 0 45px rgba(0,229,255,0.4)",
                                        "0 4px 15px rgba(0,0,0,0.85), 0 0 18px rgba(0,255,136,0.45)"
                                    ]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.0,
                                    ease: "easeInOut"
                                }}
                                className="absolute -bottom-4 z-40 px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-lg border-2 border-[#00FF88]/70 flex items-center gap-1.5 pointer-events-auto transition-transform duration-300 group-hover:scale-105 group-hover:border-[#CCFF90]"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88] animate-ping" />
                                <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#00FF88] tracking-[0.22em] uppercase">
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
