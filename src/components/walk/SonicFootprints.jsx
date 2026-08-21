import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints } from 'lucide-react';

export function SonicFootprints({ isScrollingUp, isAudioUnlocked }) {
    return (
        <>
            {/* 1. DYNAMIC KINETIC SCROLLING FOOTPRINTS (SURGE ON SCROLL UP) */}
            <div className="absolute inset-x-0 bottom-16 h-48 pointer-events-none z-25 flex flex-col items-center justify-end overflow-hidden">
                <AnimatePresence>
                    {isScrollingUp && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 20 }}
                            animate={{ opacity: 1, scale: 1.0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="relative w-44 h-40 flex flex-col items-center justify-end"
                        >
                            {/* 5-Channel Sonic Equalizer Frequency Bars */}
                            <div className="relative z-10 flex items-end gap-2 mb-4">
                                {[0.4, 0.85, 1.0, 0.75, 0.45].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            height: [12 * h, 36 * h, 8 * h, 40 * h],
                                            opacity: [0.7, 1, 0.7, 1]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.35 + i * 0.08,
                                            ease: "easeInOut"
                                        }}
                                        className="w-1.5 rounded-full bg-gradient-to-t from-[#E7FF00] to-[#00F0FF] shadow-[0_0_12px_#E7FF00]"
                                    />
                                ))}
                            </div>

                            {/* Stepping Footprint Particle Surge */}
                            <motion.div
                                animate={{
                                    scale: [1.0, 1.6],
                                    opacity: [1.0, 0],
                                    y: [0, -80]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.7,
                                    ease: "easeOut"
                                }}
                                className="absolute bottom-4 flex items-center justify-center pointer-events-none"
                            >
                                <Footprints className="w-12 h-12 text-[#E7FF00] drop-shadow-[0_0_25px_#E7FF00] drop-shadow-[0_0_40px_#00F0FF]" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. CENTERED 3X ENLARGED FOOTPRINT & AMBIENT EQUALIZER (STAGGERED ENTRANCE) */}
            <div className="absolute inset-x-0 bottom-14 pointer-events-none flex flex-col items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
                    {/* Footprint Icon: Rises smoothly at 1.0s */}
                    <motion.div
                        initial={{ opacity: 0, y: 25, scale: 0.8 }}
                        animate={{ 
                            opacity: isAudioUnlocked ? 1 : 0, 
                            y: isAudioUnlocked ? 0 : 25, 
                            scale: isAudioUnlocked ? (isScrollingUp ? [1.1, 1.35, 1.1] : [1.0, 1.12, 1.0]) : 0.8 
                        }}
                        transition={{
                            delay: 0.8,
                            duration: 0.9,
                            ease: "easeOut"
                        }}
                        className="flex items-center justify-center p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-[#E7FF00]/30 shadow-[0_0_20px_rgba(231,255,0,0.25)]"
                    >
                        <Footprints className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-200 ${
                            isScrollingUp 
                                ? 'text-[#E7FF00] drop-shadow-[0_0_16px_#E7FF00]' 
                                : 'text-white/85 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                        }`} />
                    </motion.div>

                    {/* Ambient Equalizer Bar: Expands up at 1.6s */}
                    <motion.div 
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: isAudioUnlocked ? 1 : 0, scaleY: isAudioUnlocked ? 1 : 0 }}
                        transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
                        className="flex items-end gap-1.5 h-3"
                    >
                        {[0.4, 0.85, 1.0, 0.7, 0.45].map((h, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: isScrollingUp 
                                        ? [4 * h, 14 * h, 3 * h, 14 * h] 
                                        : [3 * h, 8 * h, 3 * h],
                                    opacity: isScrollingUp ? [0.8, 1, 0.8] : [0.4, 0.8, 0.4]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: isScrollingUp ? 0.35 + i * 0.05 : 0.9 + i * 0.1,
                                    ease: "easeInOut"
                                }}
                                className="w-1 rounded-full bg-gradient-to-t from-[#E7FF00] to-[#00F0FF] shadow-[0_0_8px_#E7FF00]"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </>
    );
}
