import React, { useState, useEffect } from 'react';
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
    // phase: 'center' (0.0s - 2.6s) -> 'ascending' (2.6s - 3.5s) -> 'docked' (3.5s+)
    const [phase, setPhase] = useState('center');

    useEffect(() => {
        // 2.6s: Start ascending to the top dock
        const ascendTimer = setTimeout(() => {
            setPhase('ascending');
        }, 2600);

        // 3.5s: Fully docked at top as Logo Card unblurs
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 3500);

        return () => {
            clearTimeout(ascendTimer);
            clearTimeout(dockTimer);
        };
    }, []);

    const isCenter = phase === 'center';

    return (
        <motion.header
            animate={{
                top: isCenter ? '45vh' : '28px',
                y: isCenter ? '-50%' : '0%',
                scale: isCenter ? 1.35 : 1.0
            }}
            transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1]
            }}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
            className="fixed left-0 right-0 z-[9999] px-6 py-2 flex items-center justify-center pointer-events-none select-none"
        >
            <motion.div 
                animate={{
                    x: tiltX * (isCenter ? 18 : 8),
                    y: tiltY * (isCenter ? 12 : 4),
                    rotateX: isCenter ? tiltY * 10 : 0,
                    rotateY: isCenter ? -tiltX * 10 : 0,
                    scale: isFlowsHit ? 1.08 : 1.0,
                    borderColor: isFlowsHit ? '#E7FF00' : isCenter ? 'rgba(200, 169, 110, 0.75)' : 'rgba(200, 169, 110, 0.40)',
                    boxShadow: isFlowsHit 
                        ? '0 0 35px rgba(231, 255, 0, 0.75)' 
                        : isCenter 
                        ? '0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(200,169,110,0.45)'
                        : '0 4px 25px rgba(0,0,0,0.8), 0 0 15px rgba(200,169,110,0.2)'
                }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-2.5 px-6 py-2.5 rounded-full bg-black/75 backdrop-blur-xl border shadow-2xl transition-all duration-300 group cursor-default"
            >
                {/* 18K Champagne Gold Glowing Indicator Dot */}
                <motion.span 
                    animate={{
                        scale: isFlowsHit ? [1, 2.0, 1] : isCenter ? [1, 1.5, 1] : [1, 1.35, 1],
                        backgroundColor: isFlowsHit ? '#00FF88' : '#E7FF00',
                        boxShadow: isFlowsHit ? '0 0 20px #00FF88' : '0 0 12px #E7FF00'
                    }}
                    transition={{ repeat: isFlowsHit ? 1 : Infinity, duration: isFlowsHit ? 0.4 : 2.0, ease: "easeInOut" }}
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                />

                {/* 2-Second Dedicated Letter-by-Letter Kinetic 3D Reveal & Soundwave Cascade */}
                <div className="flex items-center gap-[3px] sm:gap-1.5 font-mono text-xs sm:text-sm font-black tracking-widest text-[#F7EBE1]">
                    {HEADER_LETTERS.map((item, idx) => {
                        const hitScatterY = isFlowsHit ? (item.group === 2 ? -18 : item.group === 1 ? -8 : -3) : 0;
                        const hitRotate = isFlowsHit ? (item.group === 2 ? 14 : item.group === 1 ? -6 : 0) : 0;

                        return (
                            <motion.span
                                key={idx}
                                initial={{
                                    opacity: 0,
                                    y: 25,
                                    rotateX: 90,
                                    scale: 0.4
                                }}
                                animate={{
                                    opacity: 1,
                                    y: isFlowsHit ? hitScatterY : [25, -6, 0],
                                    rotateX: [90, -15, 0],
                                    scale: [0.4, 1.25, 1.0],
                                    x: isFlowsHit ? item.xSpread * 0.3 : 0,
                                    rotate: isFlowsHit ? hitRotate : 0,
                                    color: isFlowsHit && item.group === 2 ? '#E7FF00' : undefined
                                }}
                                transition={{
                                    duration: 0.9,
                                    delay: idx * 0.065, // Staggered 2-second cascade across letters
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                whileHover={{ y: -3, color: '#E7FF00', scale: 1.25 }}
                                className={`transition-colors select-none inline-block ${
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
