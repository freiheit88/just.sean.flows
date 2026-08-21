import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    const [phase, setPhase] = useState('idle'); // 'idle' | 'oscillating' | 'ricochet' | 'docked'
    const [liveVolNum, setLiveVolNum] = useState(30);

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

        // At 3.0s, begin straight-line billiard roll & ricochet
        const morphTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 3000);

        // At 3.7s (mid-flight collision with .FLOWS header text), trigger exaggerated wobble
        const hitTimer = setTimeout(() => {
            if (onFlowsHit) onFlowsHit();
        }, 3700);

        // At 4.4s, ball settles into permanent top-right pocket button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 4400);

        return () => {
            clearInterval(numInterval);
            clearTimeout(morphTimer);
            clearTimeout(hitTimer);
            clearTimeout(dockTimer);
        };
    }, [isAudioUnlocked, onFlowsHit]);

    if (!isAudioUnlocked || phase === 'idle') return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 select-none">
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

            {/* 2. STRAIGHT-LINE BILLIARD BALL RICOCHET PATH (3.0s ~ 4.4s) */}
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
                        right: "14px",
                        boxShadow: "0 0 10px rgba(255,255,255,0.2)"
                    }}
                    animate={{
                        x: [0, 8, -90, 0],
                        y: [0, -60, -180, -200],
                        rotate: [0, -35, 180, 360],
                        width: ["52px", "40px", "40px", "40px"],
                        height: ["180px", "40px", "40px", "40px"],
                        borderRadius: ["26px", "50%", "50%", "50%"],
                        boxShadow: [
                            "0 0 10px rgba(255,255,255,0.2)",
                            "0 0 25px rgba(255,255,255,0.9)",
                            "0 0 35px rgba(231,255,0,0.9)",
                            "0 0 15px rgba(231,255,0,0.5)"
                        ]
                    }}
                    transition={{
                        duration: 1.4,
                        times: [0, 0.35, 0.70, 1.0],
                        ease: "easeInOut"
                    }}
                    className="absolute z-50 bg-black/90 border-2 border-white flex items-center justify-center pointer-events-none"
                >
                    <Volume2 className="w-4 h-4 text-white" />
                </motion.div>
            )}

            {/* 3. PERMANENT TOP-RIGHT SOUND MUTE BUTTON (4.4s onward) */}
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
