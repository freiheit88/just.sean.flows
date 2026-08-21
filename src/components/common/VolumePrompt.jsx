import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    const [phase, setPhase] = useState('oscillating'); // 'oscillating' (0-5s) -> 'minimizing' (5-6.2s) -> 'ricochet' (6.2-10s) -> 'docked'
    const [liveVolNum, setLiveVolNum] = useState(30);
    const onFlowsHitRef = useRef(onFlowsHit);
    onFlowsHitRef.current = onFlowsHit;

    useEffect(() => {
        // Extended by 2 seconds: 5.0 seconds total calibration on initial screen
        const numSequence = [30, 24, 16, 28, 45, 38, 22, 42, 34, 26, 38, 30, 30, 30];
        let step = 0;
        const numInterval = setInterval(() => {
            step++;
            if (step < numSequence.length) {
                setLiveVolNum(numSequence[step]);
            } else {
                setLiveVolNum(30);
                clearInterval(numInterval);
            }
        }, 350);

        // Stage 1: At 5.0s, cleanly minimize straight upward into a circle
        const minTimer = setTimeout(() => {
            setPhase('minimizing');
        }, 5000);

        // Stage 2: At 6.2s, begin straight billiard roll
        const ricochetTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 6200);

        // At 8.2s, hit .FLOWS in header
        const hitTimer = setTimeout(() => {
            if (onFlowsHitRef.current) onFlowsHitRef.current();
        }, 8200);

        // At 10.0s, dock into permanent top-right button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 10000);

        return () => {
            clearInterval(numInterval);
            clearTimeout(minTimer);
            clearTimeout(ricochetTimer);
            clearTimeout(hitTimer);
            clearTimeout(dockTimer);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-[9998] select-none overflow-hidden">
            {/* 1. EXTENDED 5.0S OSCILLATING VOLUME CAPSULE (0s ~ 5s) */}
            {phase === 'oscillating' && (
                <motion.div
                    initial={{ opacity: 0, x: 80, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    style={{ originY: 0 }}
                    className="absolute right-3.5 sm:right-4 top-[26%] flex flex-col items-center pointer-events-none z-[9998]"
                >
                    <div className="w-12 sm:w-14 h-44 sm:h-52 rounded-[26px] bg-black/90 backdrop-blur-2xl border-2 border-white/30 p-2 sm:p-2.5 flex flex-col items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.3)]">
                        <Volume2 className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />

                        <div className="relative w-4 sm:w-4.5 flex-1 my-2 bg-white/20 rounded-full overflow-hidden flex flex-col justify-end p-0.5 border border-white/15">
                            <motion.div
                                animate={{
                                    height: ["30%", "16%", "45%", "22%", "42%", "30%", "30%"]
                                }}
                                transition={{
                                    duration: 5.0,
                                    times: [0, 0.18, 0.38, 0.55, 0.72, 0.88, 1.0],
                                    ease: "easeInOut"
                                }}
                                className="w-full bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                            />
                        </div>

                        <span className="font-mono text-xs sm:text-sm font-black text-white tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                            {liveVolNum}%
                        </span>
                    </div>
                </motion.div>
            )}

            {/* 2. STANDARD SMOOTH UPWARD MINIMIZE (5.0s ~ 6.2s) */}
            {phase === 'minimizing' && (
                <motion.div
                    initial={{
                        width: "52px",
                        height: "180px",
                        borderRadius: "26px",
                        borderColor: "#FFFFFF",
                        color: "#FFFFFF",
                        boxShadow: "0 0 15px rgba(255,255,255,0.3)"
                    }}
                    animate={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        borderColor: "#FFF9A6",
                        color: "#FFF9A6",
                        boxShadow: "0 0 20px rgba(255,249,166,0.7)"
                    }}
                    transition={{
                        duration: 1.2,
                        ease: [0.25, 1, 0.5, 1]
                    }}
                    style={{
                        position: "absolute",
                        top: "26%",
                        right: "16px",
                        transformOrigin: "top center"
                    }}
                    className="z-[9998] bg-black/90 border-2 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                >
                    <Volume2 className="w-4 h-4" />
                </motion.div>
            )}

            {/* 3. PHYSICAL BILLIARD ROLL TO HEADER .FLOWS & TOP-RIGHT POCKET (6.2s ~ 10.0s) */}
            {phase === 'ricochet' && (
                <motion.div
                    initial={{
                        x: 0,
                        y: 0,
                        rotate: 0,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        top: "26%",
                        right: "16px",
                        borderColor: "#FFF9A6",
                        color: "#FFF9A6",
                        boxShadow: "0 0 20px rgba(255,249,166,0.7)"
                    }}
                    animate={{
                        x: [0, 4, -82, 0],
                        y: [0, -20, -140, -155],
                        rotate: [0, -25, 240, 360],
                        borderColor: [
                            "#FFF9A6",
                            "#FFE082",
                            "#E7FF00",
                            "#E7FF00"
                        ],
                        color: [
                            "#FFF9A6",
                            "#FFE082",
                            "#E7FF00",
                            "#E7FF00"
                        ],
                        boxShadow: [
                            "0 0 20px rgba(255,249,166,0.7)",
                            "0 0 25px rgba(255,224,130,0.8)",
                            "0 0 32px rgba(231,255,0,0.9)",
                            "0 0 18px rgba(231,255,0,0.6)"
                        ]
                    }}
                    transition={{
                        duration: 3.8,
                        times: [0, 0.20, 0.60, 1.0],
                        ease: "easeInOut"
                    }}
                    className="absolute z-[9998] bg-black/90 border-2 flex items-center justify-center pointer-events-none"
                >
                    <Volume2 className="w-4 h-4" />
                </motion.div>
            )}

            {/* 4. PERMANENT TOP-RIGHT MUTE BUTTON (10.0s onward) */}
            {phase === 'docked' && (
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleMute}
                    className="absolute top-3.5 right-3.5 z-[9999] pointer-events-auto w-10 h-10 rounded-full bg-black/85 border-2 border-[#E7FF00] shadow-[0_0_25px_rgba(231,255,0,0.45)] backdrop-blur-2xl flex items-center justify-center cursor-pointer transition-all group"
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5 text-neutral-400 group-hover:text-red-400 transition-colors" />
                    ) : (
                        <Volume2 className="w-5 h-5 text-[#E7FF00] drop-shadow-[0_0_8px_#E7FF00] group-hover:scale-110 transition-transform" />
                    )}
                </motion.button>
            )}
        </div>
    );
}
