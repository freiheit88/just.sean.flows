import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    // phase: 'oscillating' (0-3.4s) -> 'shrinking' (3.4-4.2s) -> 'ricochet' (4.2-6.8s) -> 'docked' (6.8s+)
    const [phase, setPhase] = useState('oscillating');
    const [liveVolNum, setLiveVolNum] = useState(30);
    const [breakGlow, setBreakGlow] = useState(false);
    const [reboundGlow, setReboundGlow] = useState(false);
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

        // Stage 1: At 3.4s, smoothly shrink from bottom upward to a perfect cue ball in place
        const shrinkTimer = setTimeout(() => {
            setPhase('shrinking');
        }, 3400);

        // Stage 2: At 4.2s, launch billiard cue strike
        const ricochetTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 4200);

        // Break Shot Impact at 4.75s (Ball hits JUST.SEAN.FLOWS)
        const breakTimer = setTimeout(() => {
            setBreakGlow(true);
            if (onFlowsHitRef.current) {
                onFlowsHitRef.current();
            }
            setTimeout(() => setBreakGlow(false), 500);
        }, 4750);

        // Rebound Cushion Tap at 5.5s (Decelerated bounce on right frame)
        const reboundTimer = setTimeout(() => {
            setReboundGlow(true);
            setTimeout(() => setReboundGlow(false), 400);
        }, 5500);

        // Stage 3: At 6.8s, smoothly dock into the permanent top-right button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 6800);

        return () => {
            clearInterval(numInterval);
            clearTimeout(shrinkTimer);
            clearTimeout(ricochetTimer);
            clearTimeout(breakTimer);
            clearTimeout(reboundTimer);
            clearTimeout(dockTimer);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-[9998] select-none overflow-hidden">
            {/* 1. FULL TALL VOLUME CAPSULE (0s ~ 3.4s) */}
            {phase === 'oscillating' && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    style={{
                        position: 'absolute',
                        top: '24%',
                        right: '16px',
                        width: '44px',
                        height: '185px'
                    }}
                    className="z-[9998] bg-black/90 backdrop-blur-2xl rounded-[22px] border-2 border-white/30 p-2 flex flex-col items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.3)] pointer-events-none"
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

                    <span className="font-mono text-[11px] font-black text-white tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0">
                        {liveVolNum}%
                    </span>
                </motion.div>
            )}

            {/* 2. UPWARD SHRINK FROM BOTTOM INTO CUE BALL IN PLACE (3.4s ~ 4.2s) */}
            {phase === 'shrinking' && (
                <motion.div
                    initial={{
                        height: "185px",
                        width: "44px",
                        borderRadius: "22px",
                        borderColor: "rgba(255,255,255,0.3)",
                        boxShadow: "0 0 25px rgba(255,255,255,0.3)"
                    }}
                    animate={{
                        height: "44px",
                        width: "44px",
                        borderRadius: "50%",
                        borderColor: "#FFF9A6",
                        boxShadow: "0 0 30px rgba(255,249,166,0.85)"
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.25, 1, 0.5, 1]
                    }}
                    style={{
                        position: 'absolute',
                        top: '24%',
                        right: '16px',
                        transformOrigin: 'top center'
                    }}
                    className="z-[9998] bg-black/90 backdrop-blur-2xl border-2 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                >
                    <Volume2 className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </motion.div>
            )}

            {/* 3. PHYSICAL BREAK-SHOT & DECELERATING REBOUND (4.2s ~ 6.8s) */}
            {phase === 'ricochet' && (
                <>
                    {/* Billiard Cue Ball: Directly smashes into JUST.SEAN.FLOWS */}
                    <motion.div
                        initial={{
                            x: 0,
                            y: 0,
                            rotate: 0,
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            top: "24%",
                            right: "16px",
                            borderColor: "#FFF9A6",
                            color: "#FFF9A6",
                            boxShadow: "0 0 30px rgba(255,249,166,0.85)"
                        }}
                        animate={{
                            // Phase 1 (Direct Power Smash into JUST.SEAN.FLOWS): x: -140px, y: -135px at t=22%
                            // Phase 2 (Kinetic Transfer & Cushion Rebound): Velocity drops 60%, bounces down-right (x: 6px, y: -80px) at t=52%
                            // Phase 3 (Gentle Secondary Tap): Velocity drops 80%, bounces up (x: -15px, y: -135px) at t=78%
                            // Phase 4 (Final Soft Rolling Settle): Smoothly rolls into top-right pocket (x: 0, y: -155px) at t=100%
                            x: [0, -140, 6, -15, 0],
                            y: [0, -135, -80, -135, -155],
                            rotate: [0, -360, -520, -640, -720],
                            width: ["44px", "44px", "42px", "40px", "40px"],
                            height: ["44px", "44px", "42px", "40px", "40px"],
                            borderColor: [
                                "#FFF9A6",
                                "#E7FF00",
                                "#FFE082",
                                "#E7FF00",
                                "#E7FF00"
                            ],
                            color: [
                                "#FFF9A6",
                                "#E7FF00",
                                "#FFE082",
                                "#E7FF00",
                                "#E7FF00"
                            ],
                            boxShadow: [
                                "0 0 30px rgba(255,249,166,0.85)",
                                "0 0 55px rgba(231,255,0,1)",
                                "0 0 30px rgba(255,224,130,0.75)",
                                "0 0 25px rgba(231,255,0,0.6)",
                                "0 0 20px rgba(231,255,0,0.45)"
                            ]
                        }}
                        transition={{
                            duration: 2.6,
                            times: [0, 0.22, 0.52, 0.78, 1.0],
                            ease: [0.18, 0.8, 0.25, 1.0]
                        }}
                        className="absolute z-[9998] bg-black/90 border-2 flex items-center justify-center pointer-events-none"
                    >
                        <Volume2 className="w-5 h-5" />
                    </motion.div>

                    {/* Break Shot Impact Radial Halo Bloom behind JUST.SEAN.FLOWS */}
                    {breakGlow && (
                        <div className="absolute top-1 left-[50%] w-36 h-20 -translate-x-1/2 rounded-full bg-[#E7FF00]/45 filter blur-2xl pointer-events-none animate-pulse" />
                    )}

                    {/* Right Frame Cushion Rebound Soft Halo */}
                    {reboundGlow && (
                        <div className="absolute top-[14%] right-1 w-16 h-20 rounded-full bg-[#FFE082]/25 filter blur-xl pointer-events-none" />
                    )}
                </>
            )}

            {/* 4. PERMANENT TOP-RIGHT MUTE BUTTON (6.8s onward) */}
            {phase === 'docked' && (
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
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
