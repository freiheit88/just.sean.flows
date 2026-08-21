import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, isMuted, onToggleMute, onFlowsHit }) {
    const [phase, setPhase] = useState('oscillating'); // 'oscillating' (0-4s) -> 'minimizing' (4-4.8s) -> 'ricochet' (4.8-6.8s) -> 'docked'
    const [liveVolNum, setLiveVolNum] = useState(30);
    const [wallSpark, setWallSpark] = useState(false);
    const [flowsSpark, setFlowsSpark] = useState(false);
    const onFlowsHitRef = useRef(onFlowsHit);
    onFlowsHitRef.current = onFlowsHit;

    useEffect(() => {
        // Initial Volume Calibration (0.0s ~ 4.0s)
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
        }, 320);

        // Stage 1: At 4.0s, cleanly minimize straight upward into a circle
        const minTimer = setTimeout(() => {
            setPhase('minimizing');
        }, 4000);

        // Stage 2: At 4.8s, begin fast kinetic billiard trick-shot
        const ricochetTimer = setTimeout(() => {
            setPhase('ricochet');
        }, 4800);

        // Wall impact spark at 5.3s
        const wallTimer = setTimeout(() => {
            setWallSpark(true);
            setTimeout(() => setWallSpark(false), 300);
        }, 5300);

        // .FLOWS impact spark & collision trigger at 6.0s
        const hitTimer = setTimeout(() => {
            setFlowsSpark(true);
            if (onFlowsHitRef.current) onFlowsHitRef.current();
            setTimeout(() => setFlowsSpark(false), 350);
        }, 6000);

        // Stage 3: At 6.8s, dock into permanent top-right button
        const dockTimer = setTimeout(() => {
            setPhase('docked');
        }, 6800);

        return () => {
            clearInterval(numInterval);
            clearTimeout(minTimer);
            clearTimeout(ricochetTimer);
            clearTimeout(wallTimer);
            clearTimeout(hitTimer);
            clearTimeout(dockTimer);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-[9998] select-none overflow-hidden">
            {/* 1. 4.0S OSCILLATING VOLUME CAPSULE (0s ~ 4s) */}
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
                                    duration: 4.0,
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

            {/* 2. SMOOTH UPWARD MINIMIZE (4.0s ~ 4.8s) */}
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
                        duration: 0.8,
                        ease: [0.25, 1, 0.5, 1]
                    }}
                    style={{
                        position: "absolute",
                        top: "24%",
                        right: "16px",
                        transformOrigin: "top center"
                    }}
                    className="z-[9998] bg-black/90 border-2 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                >
                    <Volume2 className="w-4 h-4" />
                </motion.div>
            )}

            {/* 3. REMASTERED FAST 3-CUSHION BILLIARD BANK SHOT (4.8s ~ 6.8s) */}
            {phase === 'ricochet' && (
                <>
                    {/* Billiard Ball Dynamic Motion */}
                    <motion.div
                        initial={{
                            x: 0,
                            y: 0,
                            rotate: 0,
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            top: "24%",
                            right: "16px",
                            borderColor: "#FFF9A6",
                            color: "#FFF9A6",
                            boxShadow: "0 0 20px rgba(255,249,166,0.7)"
                        }}
                        animate={{
                            // Shot 1: Taps Right Wall (+6px, -15px)
                            // Shot 2: Banks hard diagonally into .FLOWS (-92px, -145px)
                            // Shot 3: Rebounds cleanly into top-right pocket (0px, -165px)
                            x: [0, 6, -92, 0],
                            y: [0, -15, -145, -165],
                            scale: [1, 0.9, 1.25, 1],
                            rotate: [0, 60, 360, 540],
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
                                "0 0 35px rgba(255,224,130,0.9)",
                                "0 0 45px rgba(231,255,0,1)",
                                "0 0 20px rgba(231,255,0,0.7)"
                            ]
                        }}
                        transition={{
                            duration: 2.0,
                            times: [0, 0.25, 0.60, 1.0],
                            ease: [0.25, 0.1, 0.25, 1.0]
                        }}
                        className="absolute z-[9998] bg-black/90 border-2 flex items-center justify-center pointer-events-none"
                    >
                        <Volume2 className="w-4 h-4" />
                    </motion.div>

                    {/* Right Wall Impact Spark Ring */}
                    {wallSpark && (
                        <div className="absolute top-[22%] right-2 w-12 h-12 rounded-full border-2 border-[#FFF9A6] animate-ping pointer-events-none shadow-[0_0_20px_#FFF9A6]" />
                    )}

                    {/* .FLOWS Header Collision Spark Ring */}
                    {flowsSpark && (
                        <div className="absolute top-2.5 left-[62%] w-16 h-16 -translate-x-1/2 rounded-full border-2 border-[#E7FF00] animate-ping pointer-events-none shadow-[0_0_30px_#E7FF00]" />
                    )}
                </>
            )}

            {/* 4. PERMANENT TOP-RIGHT MUTE BUTTON (6.8s onward) */}
            {phase === 'docked' && (
                <motion.button
                    initial={{ scale: 0.7, opacity: 0 }}
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
