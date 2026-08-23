import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HEADER_LETTERS = [
    { char: 'J', group: 0, xOffset: -120 },
    { char: 'U', group: 0, xOffset: -100 },
    { char: 'S', group: 0, xOffset: -80 },
    { char: 'T', group: 0, xOffset: -60 },
    { char: '.', group: 0, xOffset: -40 },
    { char: 'S', group: 1, xOffset: -20 },
    { char: 'E', group: 1, xOffset: 0 },
    { char: 'A', group: 1, xOffset: 20 },
    { char: 'N', group: 1, xOffset: 40 },
    { char: '.', group: 1, xOffset: 60 },
    { char: 'F', group: 2, xOffset: 80 },
    { char: 'L', group: 2, xOffset: 100 },
    { char: 'O', group: 2, xOffset: 120 },
    { char: 'W', group: 2, xOffset: 140 },
    { char: 'S', group: 2, xOffset: 160 }
];

export function Header3D({ isFlowsHit, tiltX = 0, tiltY = 0 }) {
    // phase: 'center' (0-2.8s) -> 'ascending' (2.8-5.0s) -> 'docked' (5.0s+)
    const [openingPhase, setOpeningPhase] = useState('center');

    useEffect(() => {
        const ascendTimer = setTimeout(() => {
            setOpeningPhase('ascending');
        }, 2800);

        const dockTimer = setTimeout(() => {
            setOpeningPhase('docked');
        }, 5000);

        return () => {
            clearTimeout(ascendTimer);
            clearTimeout(dockTimer);
        };
    }, []);

    const isCenter = openingPhase === 'center';
    const isAscending = openingPhase === 'ascending';
    const isDocked = openingPhase === 'docked';

    return (
        <motion.header
            animate={{
                top: isCenter ? '42vh' : '12px',
                scale: isCenter ? 1.45 : 1.0,
                y: isCenter ? '-50%' : '0%'
            }}
            transition={{
                duration: 2.0,
                ease: [0.16, 1, 0.3, 1] // Apple chic ease
            }}
            className="fixed left-0 right-0 z-[9999] px-6 py-2 flex items-center justify-center pointer-events-none select-none"
        >
            <div className="pointer-events-auto flex items-center justify-center gap-3 py-1">
                {/* Leading Neon Indicator Dot with Pulse */}
                <motion.span 
                    animate={isFlowsHit ? {
                        scale: [1, 2.4, 0.8, 1.4, 1],
                        boxShadow: [
                            "0 0 15px #E7FF00",
                            "0 0 50px #FFF9A6",
                            "0 0 15px #E7FF00"
                        ]
                    } : {
                        scale: isCenter ? [1, 1.3, 1] : 1
                    }}
                    transition={isFlowsHit ? { duration: 0.6, delay: 0.08 } : { repeat: Infinity, duration: 2.0 }}
                    className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_20px_#E7FF00] shrink-0" 
                />

                {/* Kinetic Billiard & Chic Spawning Letters */}
                <h1 
                    className="font-mono font-black text-base sm:text-xl tracking-[0.36em] uppercase text-[#E7FF00] flex items-center select-none"
                    style={{
                        textShadow: isCenter 
                            ? '0 0 25px rgba(231,255,0,0.85), 0 4px 15px rgba(0,0,0,1)' 
                            : '0 2px 0 #C5A059, 0 4px 0 #000000, 0 6px 18px rgba(231,255,0,0.65)'
                    }}
                >
                    {HEADER_LETTERS.map((item, idx) => {
                        const groupDelay = (2 - item.group) * 0.04;
                        const isHitZone = item.group === 2;

                        return (
                            <motion.span
                                key={idx}
                                initial={{
                                    opacity: 0,
                                    scale: 0.4,
                                    y: 40,
                                    x: (idx - 7) * 15
                                }}
                                animate={isFlowsHit ? {
                                    y: isHitZone ? [0, -22, 10, -5, 0] : item.group === 1 ? [0, -14, 6, -2, 0] : [0, -8, 4, 0],
                                    x: isHitZone ? [0, (idx - 12) * 6, -(idx - 12) * 2, 0] : [0, (idx - 7) * 2, 0],
                                    rotate: isHitZone ? [0, (idx % 2 === 0 ? 25 : -25), -10, 0] : item.group === 1 ? [0, 14, -6, 0] : [0, -7, 0],
                                    scale: isHitZone ? [1, 1.7, 0.85, 1.2, 1] : item.group === 1 ? [1, 1.4, 0.92, 1] : [1, 1.2, 1],
                                    color: isHitZone ? ["#E7FF00", "#FFFFFF", "#00F0FF", "#E7FF00"] : ["#E7FF00", "#FFF9A6", "#E7FF00"],
                                    filter: isHitZone ? [
                                        "drop-shadow(0 0 0px #E7FF00)",
                                        "drop-shadow(0 0 35px #00F0FF) drop-shadow(0 0 50px #FF0055)",
                                        "drop-shadow(0 0 25px #E7FF00)",
                                        "drop-shadow(0 0 0px #E7FF00)"
                                    ] : []
                                } : {
                                    opacity: 1,
                                    scale: 1,
                                    x: tiltX * 0.08,
                                    y: tiltY * 0.08,
                                    rotate: tiltX * 0.06
                                }}
                                transition={isFlowsHit ? {
                                    duration: 0.85,
                                    delay: groupDelay,
                                    ease: [0.175, 0.885, 0.32, 1.275]
                                } : {
                                    opacity: { duration: 0.6, delay: idx * 0.05 },
                                    scale: { duration: 0.7, delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 },
                                    y: { duration: 0.15, ease: 'easeOut' }
                                }}
                                className="inline-block origin-center"
                            >
                                {item.char}
                            </motion.span>
                        );
                    })}
                </h1>
            </div>
        </motion.header>
    );
}
