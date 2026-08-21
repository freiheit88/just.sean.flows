import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints } from 'lucide-react';

export function SonicFootprints({ isScrollingUp }) {
    return (
        <>
            {/* 1. KINETIC STEPPING FOOTPRINTS & EQUALIZER SURGE (NO STRAIGHT VERTICAL BEAM) */}
            <div className="absolute inset-x-0 bottom-10 sm:bottom-0 h-52 pointer-events-none z-25 flex flex-col items-center justify-end overflow-hidden">
                <AnimatePresence>
                    {isScrollingUp && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1.0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 15 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="relative w-40 sm:w-52 h-44 flex flex-col items-center justify-end"
                        >
                            {/* 5-Channel Sonic Equalizer Frequency Bars */}
                            <div className="relative z-10 flex items-end gap-1.5 mb-6">
                                {[0.4, 0.8, 1.0, 0.75, 0.45].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            height: [10 * h, 32 * h, 6 * h, 36 * h],
                                            opacity: [0.6, 1, 0.7, 1]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.4 + i * 0.08,
                                            ease: "easeInOut"
                                        }}
                                        className="w-1 rounded-full bg-gradient-to-t from-[#E7FF00] to-[#00F0FF] shadow-[0_0_10px_#E7FF00]"
                                    />
                                ))}
                            </div>

                            {/* Pure Kinetic Footprint Surge */}
                            <motion.div
                                animate={{
                                    scale: [0.85, 1.45],
                                    opacity: [0.95, 0],
                                    y: [0, -70]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.75,
                                    ease: "easeOut"
                                }}
                                className="absolute bottom-5 flex items-center justify-center pointer-events-none"
                            >
                                <Footprints className="w-8 h-8 text-[#E7FF00] drop-shadow-[0_0_20px_#E7FF00] drop-shadow-[0_0_35px_#00F0FF]" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. LOWER KINETIC FOOTPRINT & SONIC PACING VISUALIZER */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-16 sm:pb-8 px-4 text-center z-20">
                <div className="flex flex-col items-center gap-1.5 mb-2 pointer-events-none select-none">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                scale: isScrollingUp ? [1, 1.25, 1] : [1, 1.08, 1],
                                opacity: isScrollingUp ? 1 : 0.65,
                                y: isScrollingUp ? [-2, -6, 0] : [0, -2, 0]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: isScrollingUp ? 0.4 : 0.9,
                                ease: "easeInOut"
                            }}
                            className="flex items-center gap-1.5"
                        >
                            <Footprints className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                                isScrollingUp 
                                    ? 'text-[#E7FF00] drop-shadow-[0_0_12px_#E7FF00]' 
                                    : 'text-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                            }`} />
                        </motion.div>

                        {/* Dynamic Sonic Pacing Equalizer Bars */}
                        <div className="flex items-end gap-1 h-3.5">
                            {[0.4, 0.85, 1.0, 0.7, 0.45].map((h, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: isScrollingUp 
                                            ? [4 * h, 14 * h, 3 * h, 14 * h] 
                                            : [3 * h, 7 * h, 3 * h],
                                        opacity: isScrollingUp ? [0.7, 1, 0.7] : [0.35, 0.7, 0.35]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: isScrollingUp ? 0.35 + i * 0.05 : 0.8 + i * 0.1,
                                        ease: "easeInOut"
                                    }}
                                    className="w-0.5 rounded-full bg-gradient-to-t from-[#E7FF00] to-[#00F0FF] shadow-[0_0_6px_#E7FF00]"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
