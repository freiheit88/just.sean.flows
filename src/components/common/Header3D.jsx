import React from 'react';
import { motion } from 'framer-motion';

const HEADER_LETTERS = [
    { char: 'J', group: 0, xSpread: -24 },
    { char: 'U', group: 0, xSpread: -18 },
    { char: 'S', group: 0, xSpread: -12 },
    { char: 'T', group: 0, xSpread: -6 },
    { char: '•', group: 0, isDot: true, xSpread: 0 },
    { char: 'S', group: 1, xSpread: 6 },
    { char: 'E', group: 1, xSpread: 12 },
    { char: 'A', group: 1, xSpread: 18 },
    { char: 'N', group: 1, xSpread: 24 },
    { char: '•', group: 1, isDot: true, xSpread: 0 },
    { char: 'F', group: 2, xSpread: 32 },
    { char: 'L', group: 2, xSpread: 40 },
    { char: 'O', group: 2, xSpread: 48 },
    { char: 'W', group: 2, xSpread: 56 },
    { char: 'S', group: 2, xSpread: 64 }
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
                    y: tiltY * 4,
                    scale: isFlowsHit ? 1.08 : 1.0,
                    borderColor: isFlowsHit ? '#E7FF00' : 'rgba(200, 169, 110, 0.40)',
                    boxShadow: isFlowsHit 
                        ? '0 0 35px rgba(231, 255, 0, 0.75)' 
                        : '0 4px 25px rgba(0,0,0,0.8), 0 0 15px rgba(200,169,110,0.2)'
                }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-2.5 px-5 py-2 rounded-full bg-black/55 backdrop-blur-md border shadow-2xl transition-all duration-300 group cursor-default"
            >
                {/* 18K Champagne Gold Glowing Indicator Dot */}
                <motion.span 
                    animate={{
                        scale: isFlowsHit ? [1, 2.0, 1] : [1, 1.35, 1],
                        backgroundColor: isFlowsHit ? '#00FF88' : '#E7FF00',
                        boxShadow: isFlowsHit ? '0 0 20px #00FF88' : '0 0 10px #E7FF00'
                    }}
                    transition={{ repeat: isFlowsHit ? 1 : Infinity, duration: isFlowsHit ? 0.4 : 2.2, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full"
                />

                {/* Kinetic CI/BI Lettering with Billiard Collision & Sound Reactive Scatter */}
                <div className="flex items-center gap-[3px] sm:gap-1.5 font-mono text-xs sm:text-sm font-black tracking-widest text-[#F7EBE1]">
                    {HEADER_LETTERS.map((item, idx) => {
                        const hitScatterY = isFlowsHit ? (item.group === 2 ? -18 : item.group === 1 ? -8 : -3) : 0;
                        const hitRotate = isFlowsHit ? (item.group === 2 ? 14 : item.group === 1 ? -6 : 0) : 0;

                        return (
                            <motion.span
                                key={idx}
                                animate={{
                                    y: hitScatterY,
                                    x: isFlowsHit ? item.xSpread * 0.3 : 0,
                                    rotate: hitRotate,
                                    color: isFlowsHit && item.group === 2 ? '#E7FF00' : undefined
                                }}
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
                        );
                    })}
                </div>

                <span className="hidden sm:inline-block font-mono text-[9px] font-bold text-[#E7FF00]/80 tracking-widest uppercase ml-1.5 pl-2 border-l border-white/20">
                    432Hz
                </span>
            </motion.div>
        </motion.header>
    );
}
