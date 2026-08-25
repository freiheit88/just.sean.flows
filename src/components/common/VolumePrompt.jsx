import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    // phase: 'oscillating' (0-3.4s) -> 'shrinking' (3.4-4.2s) -> 'ricochet' (4.2-5.0s) -> 'docked' (5.0s+)
    const [phase, setPhase] = useState('oscillating');
    const [liveVolNum, setLiveVolNum] = useState(30);
    const onFlowsHitRef = useRef(onFlowsHit);
    onFlowsHitRef.current = onFlowsHit;

    useEffect(() => {
        // Initial Volume Calibration (0.0s ~ 3.4s)
        const numSequence = [30, 22, 16, 28, 42, 36, 24, 38, 30, 30, 30];
        let step = 0;
        const numInterval = setInterval(() => {
            step++;
            if (step < numSequence.length) {
                setLiveVolNum(numSequence[step]);
            } else {
                setLiveVolNum(30);
                clearInterval(numInterval);
            }
        }, 300);

        // Stage 1: At 3.4s, shrink into cue ball
        const shrinkTimer = setTimeout(() => {
            setPhase('shrinking');
        }, 3400);

        // Stage 2: At 4.2s, launch billiard cue ball directly toward Header3D
        const ricochetTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 4200);

        // Break Shot Impact at 4.75s (Ball strikes Header3D and merges into its right dock)
        const breakTimer = setTimeout(() => {
            if (onFlowsHitRef.current) {
                onFlowsHitRef.current();
            }
        }, 4750);

        // Stage 3: At 5.0s, hand off to Header3D unified speaker button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 5000);

        return () => {
            clearInterval(numInterval);
            clearTimeout(shrinkTimer);
            clearTimeout(ricochetTimer);
            clearTimeout(breakTimer);
            clearTimeout(dockTimer);
        };
    }, []);

    // Once docked, Header3D renders the unified integrated speaker button!
    if (phase === 'docked') return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-[9998] select-none overflow-hidden">
            {/* 1. FULL TALL VOLUME CAPSULE (0s ~ 3.4s) */}
            {phase === 'oscillating' && (
                <motion.div
                    initial={{ opacity: 0, x: 40, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    style={{
                        position: 'absolute',
                        top: '22%',
                        right: '16px',
                        width: '42px',
                        height: '175px'
                    }}
                    className="z-[9998] bg-black/90 backdrop-blur-2xl rounded-[22px] border-2 border-white/30 p-2 flex flex-col items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.95),0_0_25px_rgba(255,255,255,0.2)] pointer-events-none"
                >
                    <Volume2 className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse shrink-0" />

                    <div className="relative w-3 flex-1 my-2 bg-white/20 rounded-full overflow-hidden flex flex-col justify-end p-0.5 border border-white/15">
                        <motion.div
                            animate={{
                                height: ["30%", "16%", "42%", "24%", "38%", "30%", "30%"]
                            }}
                            transition={{
                                duration: 3.4,
                                times: [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1.0],
                                ease: "easeInOut"
                            }}
                            className="w-full bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                        />
                    </div>

                    <span className="font-mono text-[10px] font-black text-white tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0">
                        {liveVolNum}%
                    </span>
                </motion.div>
            )}

            {/* 2. UPWARD SHRINK FROM BOTTOM INTO CUE BALL IN PLACE (3.4s ~ 4.2s) */}
            {phase === 'shrinking' && (
                <motion.div
                    initial={{
                        height: "175px",
                        width: "42px",
                        borderRadius: "22px",
                        borderColor: "rgba(255,255,255,0.3)"
                    }}
                    animate={{
                        height: "36px",
                        width: "36px",
                        borderRadius: "50%",
                        borderColor: "#FFF9A6",
                        boxShadow: "0 0 25px rgba(255,249,166,0.85)"
                    }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                        position: 'absolute',
                        top: '22%',
                        right: '16px',
                        transformOrigin: 'top center'
                    }}
                    className="z-[9998] bg-black/90 backdrop-blur-2xl border-2 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                >
                    <Volume2 className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </motion.div>
            )}

            {/* 3. CONTROLLED BILLIARD SHOT MERGING DIRECTLY INTO HEADER3D (4.2s ~ 5.0s) */}
            {phase === 'ricochet' && (
                <motion.div
                    initial={{
                        x: 0,
                        y: 0,
                        rotate: 0,
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        top: "22%",
                        right: "16px",
                        borderColor: "#FFF9A6",
                        boxShadow: "0 0 25px rgba(255,249,166,0.85)"
                    }}
                    animate={{
                        // Trajectory: Shoots from right towards Header3D, strikes and snaps into its right edge
                        x: [0, -105, -55],
                        y: [0, -95, -115],
                        scale: [1.0, 1.15, 0.85],
                        rotate: [0, -360, -720],
                        borderColor: ["#FFF9A6", "#E7FF00", "#E7FF00"],
                        boxShadow: [
                            "0 0 25px rgba(255,249,166,0.85)",
                            "0 0 35px rgba(231,255,0,0.9)",
                            "0 0 15px rgba(231,255,0,0.5)"
                        ]
                    }}
                    transition={{
                        duration: 0.8,
                        times: [0, 0.65, 1.0],
                        ease: [0.2, 0.8, 0.25, 1.0]
                    }}
                    style={{
                        position: 'absolute',
                        top: '22%',
                        right: '16px'
                    }}
                    className="z-[9998] bg-black/90 backdrop-blur-2xl border-2 flex items-center justify-center pointer-events-none overflow-hidden"
                >
                    <Volume2 className="w-3.5 h-3.5 text-[#E7FF00]" />
                </motion.div>
            )}
        </div>
    );
}
