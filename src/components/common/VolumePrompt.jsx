import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    const [phase, setPhase] = useState('idle'); // 'idle' | 'oscillating' | 'ricochet' | 'docked'
    const [liveVolNum, setLiveVolNum] = useState(30);
    const onFlowsHitRef = useRef(onFlowsHit);
    onFlowsHitRef.current = onFlowsHit;

    useEffect(() => {
        if (!isAudioUnlocked) return;
        setPhase('oscillating');

        // Dynamic number fluctuation between 13% and 45% during 3-second calibration
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

        // At 3.0s, begin 3X Slower (4.2s) straight-line billiard roll & ricochet
        const morphTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 3000);

        // At 5.7s (mid-flight contact with .FLOWS header text), trigger exaggerated wobble
        const hitTimer = setTimeout(() => {
            if (onFlowsHitRef.current) onFlowsHitRef.current();
        }, 5700);

        // At 7.2s, ball settles gracefully into permanent top-right pocket button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 7200);

        return () => {
            clearInterval(numInterval);
            clearTimeout(morphTimer);
            clearTimeout(hitTimer);
            clearTimeout(dockTimer);
        };
    }, [isAudioUnlocked]);

    if (!isAudioUnlocked || phase === 'idle') return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 select-none overflow-hidden">
            {/* 1. LARGE SMARTPHONE CAPSULE WITH PURE WHITE OSCILLATION GAUGE (0s ~ 3s) */}
            {phase === 'oscillating' && (
                <motion.div
                    initial={{ opacity: 0, x: 80, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1.0 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute right-3.5 sm:right-4 top-1/4 sm:top-1/3 flex flex-col items-center pointer-events-none"
                >
                    {/* Realistic Smartphone Sized Capsule */}
                    <div className="w-12 sm:w-14 h-44 sm:h-52 rounded-[26px] bg-black/85 backdrop-blur-2xl border-2 border-white/25 p-2 sm:p-2.5 flex flex-col items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.2)]">
                        {/* White Speaker Icon */}
                        <Volume2 className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />

                        {/* Vertical Waveform Track with PURE WHITE GAUGE */}
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

                        {/* Live Calibrating Percentage Indicator (Pure White) */}
                        <span className="font-mono text-xs sm:text-sm font-black text-white tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                            {liveVolNum}%
                        </span>
                    </div>
                </motion.div>
            )}

            {/* 2. 3X SLOWER (4.2s) STRICTLY-CONTAINED BILLIARD PATH WITH 2-SECOND GRADUAL WHITE->YELLOW COLOR MORPH */}
            {phase === 'ricochet' && (
                <motion.div
                    initial={{
                        x: 0,
                        y: 0,
                        rotate: 0,
                        width: "52px",
                        height: "180px",
                        borderRadius: "26px",
                        top: "28%",
                        right: "16px",
                        borderColor: "#FFFFFF",
                        color: "#FFFFFF",
                        boxShadow: "0 0 10px rgba(255,255,255,0.3)"
                    }}
                    animate={{
                        // Strictly contained vector trajectory inside virtual phone/photo boundary:
                        // 0%: Origin (right margin 16px, top 28%)
                        // 30%: Gently hits right cushion without spilling outside (x: 0, y: -45)
                        // 65%: Glides to touch .FLOWS header inside top frame (x: -82, y: -142)
                        // 100%: Smoothly rebounds into top-right pocket (x: 0, y: -160)
                        x: [0, 0, -82, 0],
                        y: [0, -45, -142, -160],
                        rotate: [0, -30, 220, 360],
                        width: ["52px", "38px", "38px", "38px"],
                        height: ["180px", "38px", "38px", "38px"],
                        borderRadius: ["26px", "50%", "50%", "50%"],
                        // 2-Second Gradual Color Shift from Pure White -> Warm Glow -> Lemon Yellow
                        borderColor: [
                            "#FFFFFF",
                            "#FFFFFF",
                            "#FFF9A6",
                            "#E7FF00",
                            "#E7FF00"
                        ],
                        color: [
                            "#FFFFFF",
                            "#FFFFFF",
                            "#FFF9A6",
                            "#E7FF00",
                            "#E7FF00"
                        ],
                        boxShadow: [
                            "0 0 10px rgba(255,255,255,0.3)",
                            "0 0 20px rgba(255,255,255,0.8)",
                            "0 0 25px rgba(255,249,166,0.85)",
                            "0 0 30px rgba(231,255,0,0.85)",
                            "0 0 18px rgba(231,255,0,0.6)"
                        ]
                    }}
                    transition={{
                        duration: 4.2, // 3X slower majestic pace
                        times: [0, 0.28, 0.65, 0.85, 1.0],
                        ease: "easeInOut"
                    }}
                    className="absolute z-50 bg-black/90 border-2 flex items-center justify-center pointer-events-none"
                >
                    <Volume2 className="w-4 h-4" />
                </motion.div>
            )}

            {/* 3. PERMANENT TOP-RIGHT SOUND MUTE BUTTON (7.2s onward) */}
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
