import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    const [phase, setPhase] = useState('oscillating'); // 'oscillating' (0-3.6s) -> 'minimizing' (3.6-4.4s) -> 'ricochet' (4.4-6.8s) -> 'docked'
    const [liveVolNum, setLiveVolNum] = useState(30);
    const [wallGlow, setWallGlow] = useState(false);
    const [flowsGlow, setFlowsGlow] = useState(false);
    const [cornerGlow, setCornerGlow] = useState(false);
    const onFlowsHitRef = useRef(onFlowsHit);
    onFlowsHitRef.current = onFlowsHit;

    useEffect(() => {
        // Initial Volume Calibration (0.0s ~ 3.6s)
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

        // Stage 1: At 3.6s, smoothly shrink as a tall vertical cylinder in place
        const minTimer = setTimeout(() => {
            setPhase('minimizing');
        }, 3600);

        // Stage 2: At 4.4s, begin the 4-cushion fluid billiard bank shot
        const ricochetTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 4400);

        // 1st Bounce (Right Wall) glow at 4.7s
        const wallTimer = setTimeout(() => {
            setWallGlow(true);
            setTimeout(() => setWallGlow(false), 350);
        }, 4700);

        // 2nd Bounce (.FLOWS Smash) flinch & soft glow at 5.2s
        const hitTimer = setTimeout(() => {
            setFlowsGlow(true);
            if (onFlowsHitRef.current) onFlowsHitRef.current();
            setTimeout(() => setFlowsGlow(false), 400);
        }, 5200);

        // 3rd & 4th Corner Bounce glow at 6.1s
        const cornerTimer = setTimeout(() => {
            setCornerGlow(true);
            setTimeout(() => setCornerGlow(false), 400);
        }, 6100);

        // Stage 3: At 6.8s, seamlessly dock into the top-right button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 6800);

        return () => {
            clearInterval(numInterval);
            clearTimeout(minTimer);
            clearTimeout(ricochetTimer);
            clearTimeout(wallTimer);
            clearTimeout(hitTimer);
            clearTimeout(cornerTimer);
            clearTimeout(dockTimer);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-[9998] select-none overflow-hidden">
            {/* 1. FULL EXPANDED VOLUME CALIBRATION (0s ~ 3.6s) */}
            {phase === 'oscillating' && (
                <motion.div
                    initial={{ opacity: 0, x: 60, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    style={{ originY: 0 }}
                    className="absolute right-3.5 sm:right-4 top-[24%] flex flex-col items-center pointer-events-none z-[9998]"
                >
                    <div className="w-12 sm:w-14 h-44 sm:h-52 rounded-[26px] bg-black/90 backdrop-blur-2xl border-2 border-white/30 p-2 sm:p-2.5 flex flex-col items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.3)]">
                        <Volume2 className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />

                        <div className="relative w-4 sm:w-4.5 flex-1 my-2 bg-white/20 rounded-full overflow-hidden flex flex-col justify-end p-0.5 border border-white/15">
                            <motion.div
                                animate={{
                                    height: ["30%", "16%", "42%", "24%", "38%", "30%", "30%"]
                                }}
                                transition={{
                                    duration: 3.6,
                                    times: [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1.0],
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

            {/* 2. NORMAL SLEEK VERTICAL CYLINDER SHRINK IN PLACE (3.6s ~ 4.4s) */}
            {phase === 'minimizing' && (
                <motion.div
                    initial={{
                        width: "52px",
                        height: "180px",
                        borderRadius: "26px",
                        borderColor: "#FFFFFF",
                        color: "#FFFFFF",
                        boxShadow: "0 0 20px rgba(255,255,255,0.3)"
                    }}
                    animate={{
                        width: "36px",
                        height: "72px",
                        borderRadius: "22px",
                        borderColor: "#FFF9A6",
                        color: "#FFF9A6",
                        boxShadow: "0 0 25px rgba(255,249,166,0.7)"
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.25, 1, 0.5, 1]
                    }}
                    style={{
                        position: "absolute",
                        top: "24%",
                        right: "16px",
                        transformOrigin: "center center"
                    }}
                    className="z-[9998] bg-black/90 border-2 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                >
                    <Volume2 className="w-4 h-4" />
                </motion.div>
            )}

            {/* 3. FLUID 4-CUSHION BANK SHOT & SMOOTH SETTLE (4.4s ~ 6.8s) */}
            {phase === 'ricochet' && (
                <>
                    {/* Sleek Vertical Cylinder Kinetic Motion */}
                    <motion.div
                        initial={{
                            x: 0,
                            y: 0,
                            rotate: 0,
                            width: "36px",
                            height: "72px",
                            borderRadius: "22px",
                            top: "24%",
                            right: "16px",
                            borderColor: "#FFF9A6",
                            color: "#FFF9A6",
                            boxShadow: "0 0 25px rgba(255,249,166,0.7)"
                        }}
                        animate={{
                            // Bounce 1 (Right Wall): x: 10, y: -20 (at 15% time)
                            // Bounce 2 (.FLOWS Header): x: -95, y: -145 (at 40% time)
                            // Bounce 3 (Top Ceiling): x: -35, y: -170 (at 65% time)
                            // Bounce 4 (Upper Right Corner): x: 8, y: -155 (at 85% time)
                            // Final Settle into Mute Dock: x: 0, y: -160, width: 40px, height: 40px, borderRadius: 50% (at 100% time)
                            x: [0, 10, -95, -35, 8, 0],
                            y: [0, -20, -145, -170, -155, -160],
                            width: ["36px", "36px", "36px", "36px", "38px", "40px"],
                            height: ["72px", "72px", "72px", "72px", "48px", "40px"],
                            borderRadius: ["22px", "22px", "22px", "22px", "30px", "50%"],
                            rotate: [0, 15, -25, 45, -15, 0],
                            borderColor: [
                                "#FFF9A6",
                                "#FFE082",
                                "#E7FF00",
                                "#E7FF00",
                                "#E7FF00",
                                "#E7FF00"
                            ],
                            color: [
                                "#FFF9A6",
                                "#FFE082",
                                "#E7FF00",
                                "#E7FF00",
                                "#E7FF00",
                                "#E7FF00"
                            ],
                            boxShadow: [
                                "0 0 25px rgba(255,249,166,0.7)",
                                "0 0 35px rgba(255,224,130,0.85)",
                                "0 0 45px rgba(231,255,0,1)",
                                "0 0 35px rgba(231,255,0,0.8)",
                                "0 0 25px rgba(231,255,0,0.6)",
                                "0 0 20px rgba(231,255,0,0.45)"
                            ]
                        }}
                        transition={{
                            duration: 2.4,
                            times: [0, 0.15, 0.40, 0.65, 0.85, 1.0],
                            ease: [0.25, 0.1, 0.25, 1.0]
                        }}
                        className="absolute z-[9998] bg-black/90 border-2 flex items-center justify-center pointer-events-none"
                    >
                        <Volume2 className="w-4 h-4" />
                    </motion.div>

                    {/* Subtle Borderless Halo Glow on Right Wall */}
                    {wallGlow && (
                        <div className="absolute top-[22%] right-1 w-16 h-20 rounded-full bg-[#FFF9A6]/25 filter blur-xl pointer-events-none" />
                    )}

                    {/* Subtle Borderless Amber Halo Glow on .FLOWS Header */}
                    {flowsGlow && (
                        <div className="absolute top-1 left-[64%] w-24 h-16 -translate-x-1/2 rounded-full bg-[#E7FF00]/30 filter blur-xl pointer-events-none" />
                    )}

                    {/* Subtle Borderless Corner Halo Glow */}
                    {cornerGlow && (
                        <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-[#E7FF00]/25 filter blur-xl pointer-events-none" />
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
