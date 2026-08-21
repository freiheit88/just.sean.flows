import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    // 4 Distinct Phases:
    // 'idle' -> 'oscillating' (0-3s) -> 'shrinking' (3-4.2s in-place) -> 'ricochet' (4.2-8.0s physical roll) -> 'docked'
    const [phase, setPhase] = useState('idle');
    const [liveVolNum, setLiveVolNum] = useState(30);
    const onFlowsHitRef = useRef(onFlowsHit);
    onFlowsHitRef.current = onFlowsHit;

    useEffect(() => {
        if (!isAudioUnlocked) return;
        setPhase('oscillating');

        // Dynamic fluctuation between 13% and 45%, finishing solidly at 30% at 3.0s
        const numSequence = [30, 22, 14, 28, 45, 36, 18, 42, 26, 38, 30];
        let step = 0;
        const numInterval = setInterval(() => {
            step++;
            if (step < numSequence.length) {
                setLiveVolNum(numSequence[step]);
            } else {
                setLiveVolNum(30);
                clearInterval(numInterval);
            }
        }, 270);

        // Stage 1: At 3.0s, lock at 30% and begin IN-PLACE upward shrinkage into a circle
        const shrinkTimer = setTimeout(() => {
            setPhase('shrinking');
        }, 3000);

        // Stage 2: At 4.2s, start physical billiard motion (cushion tap -> .FLOWS hit -> pocket rebound)
        const ricochetTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 4200);

        // At 6.2s (mid-flight contact with .FLOWS), trigger collision wobble
        const hitTimer = setTimeout(() => {
            if (onFlowsHitRef.current) onFlowsHitRef.current();
        }, 6200);

        // At 8.0s, ball settles into permanent top-right pocket button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 8000);

        return () => {
            clearInterval(numInterval);
            clearTimeout(shrinkTimer);
            clearTimeout(ricochetTimer);
            clearTimeout(hitTimer);
            clearTimeout(dockTimer);
        };
    }, [isAudioUnlocked]);

    if (!isAudioUnlocked || phase === 'idle') return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 select-none overflow-hidden">
            {/* 1. OSCILLATING VOLUME CAPSULE (0.0s ~ 3.0s) */}
            {phase === 'oscillating' && (
                <motion.div
                    initial={{ opacity: 0, x: 80, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1.0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    style={{ originY: 0 }}
                    className="absolute right-3.5 sm:right-4 top-[28%] flex flex-col items-center pointer-events-none"
                >
                    <div className="w-12 sm:w-14 h-44 sm:h-52 rounded-[26px] bg-black/85 backdrop-blur-2xl border-2 border-white/25 p-2 sm:p-2.5 flex flex-col items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.2)]">
                        <Volume2 className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />

                        <div className="relative w-4 sm:w-4.5 flex-1 my-2 bg-white/20 rounded-full overflow-hidden flex flex-col justify-end p-0.5 border border-white/15">
                            <motion.div
                                animate={{
                                    height: ["30%", "14%", "45%", "18%", "42%", "26%", "30%"]
                                }}
                                transition={{
                                    duration: 3.0,
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

            {/* 2. FIXED-POSITION UPWARD SHRINKAGE INTO CIRCLE (3.0s ~ 4.2s) */}
            {phase === 'shrinking' && (
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
                        ease: [0.25, 1, 0.5, 1] // Smooth natural cubic deceleration
                    }}
                    style={{
                        position: "absolute",
                        top: "28%",
                        right: "16px",
                        transformOrigin: "top center"
                    }}
                    className="z-50 bg-black/90 border-2 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                >
                    <Volume2 className="w-4 h-4" />
                </motion.div>
            )}

            {/* 3. REALISTIC PHYSICAL BILLIARD TRAJECTORY (4.2s ~ 8.0s) */}
            {phase === 'ricochet' && (
                <motion.div
                    initial={{
                        x: 0,
                        y: 0,
                        rotate: 0,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        top: "28%",
                        right: "16px",
                        borderColor: "#FFF9A6",
                        color: "#FFF9A6",
                        boxShadow: "0 0 20px rgba(255,249,166,0.7)"
                    }}
                    animate={{
                        // 1) 0% (t=0s): Rested at right cushion origin
                        // 2) 20% (t=0.7s): Gentle cushion tap on the right wall (x: 4, y: -20)
                        // 3) 60% (t=2.2s): Straight line physical roll striking .FLOWS (x: -82, y: -140)
                        // 4) 100% (t=3.8s): Clean rebound into top-right pocket (x: 0, y: -160)
                        x: [0, 4, -82, 0],
                        y: [0, -20, -140, -160],
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
                    className="absolute z-50 bg-black/90 border-2 flex items-center justify-center pointer-events-none"
                >
                    <Volume2 className="w-4 h-4" />
                </motion.div>
            )}

            {/* 4. PERMANENT TOP-RIGHT SOUND MUTE BUTTON (8.0s onward) */}
            {phase === 'docked' && (
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleMute}
                    className="absolute top-4 right-4 z-50 pointer-events-auto w-10 h-10 rounded-full bg-black/80 border border-[#E7FF00]/70 shadow-[0_0_20px_rgba(231,255,0,0.35)] backdrop-blur-xl flex items-center justify-center cursor-pointer transition-all group"
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
