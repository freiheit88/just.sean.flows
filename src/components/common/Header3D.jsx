import React from 'react';
import { motion } from 'framer-motion';

const HEADER_LETTERS = [
    { char: 'J', group: 0 },
    { char: 'U', group: 0 },
    { char: 'S', group: 0 },
    { char: 'T', group: 0 },
    { char: '•', group: 0, isDot: true },
    { char: 'S', group: 1 },
    { char: 'E', group: 1 },
    { char: 'A', group: 1 },
    { char: 'N', group: 1 },
    { char: '•', group: 1, isDot: true },
    { char: 'F', group: 2 },
    { char: 'L', group: 2 },
    { char: 'O', group: 2 },
    { char: 'W', group: 2 },
    { char: 'S', group: 2 }
];

export function Header3D({ isFlowsHit, tiltX = 0, tiltY = 0 }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-2.5 sm:top-3 left-0 right-0 z-[9999] px-6 py-2 flex items-center justify-center pointer-events-none select-none pt-[max(env(safe-area-inset-top),8px)]"
        >
            <motion.div 
                animate={{
                    x: tiltX * 8,
                    y: tiltY * 4
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-2.5 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-[#C8A96E]/40 shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(200,169,110,0.2)] hover:border-[#E7FF00] hover:shadow-[0_0_25px_rgba(231,255,0,0.4)] transition-all duration-300 group cursor-default"
            >
                {/* 18K Champagne Gold Glowing Indicator */}
                <motion.span 
                    animate={{
                        scale: [1, 1.35, 1],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full bg-[#E7FF00] shadow-[0_0_10px_#E7FF00]"
                />

                {/* Kinetic CI/BI Champagne Gold Lettering */}
                <div className="flex items-center gap-[3px] sm:gap-1.5 font-mono text-xs sm:text-sm font-black tracking-widest text-[#F7EBE1]">
                    {HEADER_LETTERS.map((item, idx) => (
                        <motion.span
                            key={idx}
                            whileHover={{ y: -3, color: '#E7FF00', scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 350, damping: 15 }}
                            className={`transition-colors select-none ${
                                item.isDot 
                                    ? 'text-[#C8A96E] text-[10px] mx-0.5' 
                                    : 'text-[#F7EBE1] group-hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                            }`}
                        >
                            {item.char}
                        </motion.span>
                    ))}
                </div>

                <span className="hidden sm:inline-block font-mono text-[9px] font-bold text-[#E7FF00]/80 tracking-widest uppercase ml-1.5 pl-2 border-l border-white/20">
                    432Hz
                </span>
            </motion.div>
        </motion.header>
    );
}
