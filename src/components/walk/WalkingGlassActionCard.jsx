import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Music, Footprints } from 'lucide-react';

export function WalkingGlassActionCard({ 
    isVisible = true, 
    onOpenInfo, 
    onOpenSoundLab 
}) {
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1.0, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute z-30 pointer-events-auto flex items-center justify-center select-none"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '320px',
                    maxWidth: '88vw'
                }}
            >
                {/* 1:1 Translucent Frosted Glass Card with Golden Metallic Rim */}
                <div className="relative w-full rounded-[28px] bg-black/45 backdrop-blur-2xl border-2 border-[#C8A96E]/60 shadow-[0_16px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(200,169,110,0.25)] p-5 pt-6 pb-6 flex flex-col items-center overflow-hidden">
                    
                    {/* Top Ambient Specular Light Glint */}
                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-t-[28px] pointer-events-none" />

                    {/* 1. Top 3D Embossed Gold Wine Glass + Treble Clef Emblem */}
                    <div className="relative mb-4 flex flex-col items-center">
                        <svg viewBox="0 0 100 130" className="w-16 h-20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                            <defs>
                                <linearGradient id="goldEmbossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFF2B2" />
                                    <stop offset="30%" stopColor="#FFD700" />
                                    <stop offset="70%" stopColor="#C8A96E" />
                                    <stop offset="100%" stopColor="#7A5826" />
                                </linearGradient>
                                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FFD700" floodOpacity="0.5"/>
                                </filter>
                            </defs>
                            {/* Wine Goblet Top Shape */}
                            <path
                                d="M 30 15 C 30 50, 70 50, 70 15 Z"
                                fill="none"
                                stroke="url(#goldEmbossGrad)"
                                strokeWidth="5.5"
                                strokeLinecap="round"
                                filter="url(#goldGlow)"
                            />
                            {/* Wine Liquid Wave Fill Inside */}
                            <path
                                d="M 34 26 Q 50 38, 66 26 C 66 38, 34 38, 34 26 Z"
                                fill="url(#goldEmbossGrad)"
                                opacity="0.85"
                            />
                            {/* Treble Clef S-Curve connected to bottom of goblet */}
                            <path
                                d="M 50 46 C 32 62, 32 90, 52 90 C 66 90, 68 76, 56 70 C 44 64, 42 76, 49 80 M 50 30 L 50 105 C 50 118, 38 116, 40 108"
                                fill="none"
                                stroke="url(#goldEmbossGrad)"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter="url(#goldGlow)"
                            />
                        </svg>
                    </div>

                    {/* 2. Radiant Neon Green Pill Button (Keep Swiping Upward) */}
                    <motion.div
                        animate={{
                            boxShadow: [
                                '0 0 15px rgba(0,255,136,0.6)',
                                '0 0 30px rgba(0,255,136,0.95)',
                                '0 0 15px rgba(0,255,136,0.6)'
                            ]
                        }}
                        transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                        className="w-full py-2.5 px-4 rounded-full bg-black/60 border-2 border-[#00FF88] flex items-center gap-3 cursor-pointer shadow-lg mb-4"
                    >
                        {/* Green Footprints Icon */}
                        <div className="p-1 rounded-full bg-[#00FF88]/20 flex items-center justify-center shrink-0">
                            <Footprints className="w-5 h-5 text-[#00FF88]" />
                        </div>
                        <div className="flex flex-col text-left leading-tight">
                            <span className="font-sans text-xs sm:text-sm font-bold text-white tracking-tight">
                                Keep Swiping Upward
                            </span>
                            <span className="font-mono text-[9px] font-bold text-[#00FF88] tracking-wider uppercase">
                                (IN PROGRESS)
                            </span>
                        </div>
                    </motion.div>

                    {/* 3. Option Rows */}
                    <div className="w-full flex flex-col gap-2.5 pt-1">
                        {/* Option 1: See the info / Enter directly */}
                        <motion.button
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onOpenInfo}
                            className="w-full py-2 px-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors text-left cursor-pointer group"
                        >
                            <span className="text-xl shrink-0">🏢</span>
                            <div className="flex flex-col">
                                <span className="font-sans text-xs font-semibold text-white group-hover:text-[#E7FF00] transition-colors leading-snug">
                                    See the info? or
                                </span>
                                <span className="font-sans text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors leading-snug">
                                    Enter directly (Next)
                                </span>
                            </div>
                        </motion.button>

                        {/* Option 2: Enjoy Classical Music */}
                        <motion.button
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onOpenSoundLab}
                            className="w-full py-2 px-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors text-left cursor-pointer group"
                        >
                            <span className="text-xl shrink-0">🎻</span>
                            <span className="font-sans text-xs font-semibold text-white group-hover:text-[#E7FF00] transition-colors">
                                Enjoy Classical Music
                            </span>
                        </motion.button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
