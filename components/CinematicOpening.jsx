import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideZap, LucideOrbit } from 'lucide-react';

const CinematicOpening = ({ onComplete }) => {
    const [phase, setPhase] = useState('idle'); // idle, ignite, flash, finish

    const audioRef = useRef(null);

    const handleIgnite = () => {
        setPhase('ignite');
        const signatureAudio = new Audio('/assets/sounds/signature-intro.mp3');
        signatureAudio.volume = 0.8;
        audioRef.current = signatureAudio;
        signatureAudio.play().catch(e => console.log("Audio play deferred", e));

        // Sequence timing: Tailored to the 5.5s signature sound (orchestra tuning)
        setTimeout(() => {
            setPhase('flash');

            // Initiate graceful audio fade-out
            if (audioRef.current) {
                const fadeOutInterval = setInterval(() => {
                    if (audioRef.current.volume > 0.05) {
                        audioRef.current.volume -= 0.05;
                    } else {
                        audioRef.current.volume = 0;
                        audioRef.current.pause();
                        clearInterval(fadeOutInterval);
                    }
                }, 50); // Fade out over ~800ms
            }
        }, 4500); // Trigger flash near the crescendo

        setTimeout(() => {
            setPhase('finish');
            onComplete();
        }, 5200);
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {phase === 'idle' && (
                    <motion.div
                        key="idle-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center w-full h-full relative"
                    >
                        {/* Background visual texture */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

                        <h1 className="text-white text-6xl md:text-8xl font-black uppercase tracking-[0.2em] mb-12 mix-blend-screen opacity-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            just.sean.flows
                        </h1>

                        <button
                            onClick={handleIgnite}
                            className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-12 py-4 rounded-full transition-all hover:bg-white hover:text-black active:scale-95 flex items-center gap-3"
                        >
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] group-hover:text-black transition-colors">
                                Enter Digital Soul
                            </span>
                            <LucideZap size={14} className="group-hover:text-black transition-colors" />

                            {/* Hover sweep effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_forwards] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Igniting Phase: Netflix-style Dramatic Typography Scaling */}
            {phase === 'ignite' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10001]">
                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)", textShadow: "0 0 0px rgba(255,255,255,0)" }}
                        animate={{
                            scale: [0.8, 1, 3], // Slow push in, then massive scale up
                            opacity: [0, 1, 1],
                            filter: ["blur(10px)", "blur(0px)", "blur(10px)"],
                            textShadow: [
                                "0 0 0px rgba(255,255,255,0)",
                                "0 0 20px rgba(255,255,255,0.5)",
                                "0 0 100px rgba(255,255,255,1)"
                            ]
                        }}
                        transition={{
                            duration: 4.5, // Match new audio tuning length
                            ease: [0.11, 0, 0.5, 0], // Custom cubic-bezier for a snap at the end
                            times: [0, 0.4, 1]
                        }}
                        className="text-white text-6xl md:text-8xl font-black uppercase tracking-[0.2em] mix-blend-screen whitespace-nowrap"
                    >
                        just.sean.flows
                    </motion.h1>

                    {/* Secondary Chromatic/Ghost layer for impact */}
                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1, 3.2],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{ duration: 4.5, ease: [0.11, 0, 0.5, 0], times: [0, 0.4, 1] }}
                        className="absolute text-red-500 text-6xl md:text-8xl font-black uppercase tracking-[0.2em] mix-blend-screen whitespace-nowrap blur-sm"
                        style={{ marginLeft: '-10px' }}
                    >
                        just.sean.flows
                    </motion.h1>
                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1, 3.2],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{ duration: 4.5, ease: [0.11, 0, 0.5, 0], times: [0, 0.4, 1] }}
                        className="absolute text-blue-500 text-6xl md:text-8xl font-black uppercase tracking-[0.2em] mix-blend-screen whitespace-nowrap blur-sm"
                        style={{ marginLeft: '10px' }}
                    >
                        just.sean.flows
                    </motion.h1>
                </div>
            )}

            {/* Flash Bang Phase - Blinding white */}
            {phase === 'flash' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 bg-white z-[10002]"
                />
            )}

            {/* Fade Out Phase - handled by main App mount usually, but kept for safety */}
            {phase === 'finish' && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white z-[10002]"
                />
            )}
        </div>
    );
};

export default CinematicOpening;
