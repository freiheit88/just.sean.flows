import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints } from 'lucide-react';

export function SonicFootprints({ isScrollingUp }) {
    return (
        <div className="absolute inset-x-0 bottom-12 h-52 pointer-events-none z-25 flex flex-col items-center justify-end overflow-hidden select-none">
            {/* DYNAMIC KINETIC SCROLLING FOOTPRINTS (APPEARS ONLY ON SCROLL UP) */}
            <AnimatePresence>
                {isScrollingUp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 25 }}
                        animate={{ opacity: 1, scale: 1.0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
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
                                scale: [0.9, 1.5],
                                opacity: [1.0, 0],
                                y: [0, -75]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.65,
                                ease: "easeOut"
                            }}
                            className="absolute bottom-4 flex items-center justify-center pointer-events-none"
                        >
                            <Footprints className="w-11 h-11 text-[#E7FF00] drop-shadow-[0_0_25px_#E7FF00] drop-shadow-[0_0_40px_#00F0FF]" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
