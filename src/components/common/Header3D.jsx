import React from 'react';
import { motion } from 'framer-motion';

const HEADER_LETTERS = [
    { char: 'J', group: 0 },
    { char: 'U', group: 0 },
    { char: 'S', group: 0 },
    { char: 'T', group: 0 },
    { char: '.', group: 0 },
    { char: 'S', group: 1 },
    { char: 'E', group: 1 },
    { char: 'A', group: 1 },
    { char: 'N', group: 1 },
    { char: '.', group: 1 },
    { char: 'F', group: 2 },
    { char: 'L', group: 2 },
    { char: 'O', group: 2 },
    { char: 'W', group: 2 },
    { char: 'S', group: 2 }
];

export function Header3D({ isFlowsHit, tiltX = 0, tiltY = 0 }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-[9999] px-6 py-4 flex items-center justify-center pointer-events-none select-none">
            <div className="pointer-events-auto flex items-center justify-center gap-2.5 py-1">
                {/* Leading Neon Indicator Dot */}
                <motion.span 
                    animate={isFlowsHit ? {
                        scale: [1, 2.2, 0.8, 1.3, 1],
                        boxShadow: [
                            "0 0 15px #E7FF00",
                            "0 0 45px #FFF9A6",
                            "0 0 15px #E7FF00"
                        ]
                    } : {}}
                    transition={{ duration: 0.6, delay: 0.08 }}
                    className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_15px_#E7FF00] shrink-0" 
                />

                {/* Individual Physics Reactive Billiard Letters */}
                <h1 
                    className="font-mono font-black text-base sm:text-lg tracking-[0.34em] uppercase text-[#E7FF00] flex items-center select-none"
                    style={{
                        textShadow: '0 2px 0 #C5A059, 0 4px 0 #000000, 0 6px 18px rgba(231,255,0,0.65)'
                    }}
                >
                    {HEADER_LETTERS.map((item, idx) => {
                        // Delay wave propagation: FLOWS (Group 2) hits first at 0ms, SEAN at 35ms, JUST at 70ms
                        const groupDelay = (2 - item.group) * 0.035;
                        const isHitZone = item.group === 2;

                        return (
                            <motion.span
                                key={idx}
                                animate={isFlowsHit ? {
                                    y: isHitZone ? [0, -18, 8, -4, 0] : item.group === 1 ? [0, -12, 5, -2, 0] : [0, -7, 3, 0],
                                    x: isHitZone ? [0, (idx - 12) * 5, -(idx - 12) * 2, 0] : [0, (idx - 7) * 2, 0],
                                    rotate: isHitZone ? [0, (idx % 2 === 0 ? 22 : -22), -8, 0] : item.group === 1 ? [0, 12, -5, 0] : [0, -6, 0],
                                    scale: isHitZone ? [1, 1.6, 0.88, 1.15, 1] : item.group === 1 ? [1, 1.35, 0.94, 1] : [1, 1.18, 1],
                                    color: isHitZone ? ["#E7FF00", "#FFFFFF", "#00F0FF", "#E7FF00"] : ["#E7FF00", "#FFF9A6", "#E7FF00"],
                                    filter: isHitZone ? [
                                        "drop-shadow(0 0 0px #E7FF00)",
                                        "drop-shadow(0 0 35px #00F0FF) drop-shadow(0 0 45px #FF0055)",
                                        "drop-shadow(0 0 20px #E7FF00)",
                                        "drop-shadow(0 0 0px #E7FF00)"
                                    ] : []
                                } : {
                                    x: tiltX * 0.08,
                                    y: tiltY * 0.08,
                                    rotate: tiltX * 0.06
                                }}
                                transition={isFlowsHit ? {
                                    duration: 0.8,
                                    delay: groupDelay,
                                    ease: [0.175, 0.885, 0.32, 1.275]
                                } : {
                                    duration: 0.15,
                                    ease: "easeOut"
                                }}
                                className="inline-block origin-center"
                            >
                                {item.char}
                            </motion.span>
                        );
                    })}
                </h1>
            </div>
        </header>
    );
}
