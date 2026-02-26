import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideZap, LucideOrbit } from 'lucide-react';

const CinematicOpening = ({ onComplete }) => {
    const [phase, setPhase] = useState('idle'); // idle, ignite, flash, finish

    const audioRef = useRef(null);

    const handleIgnite = () => {
        setPhase('ignite');
        const signatureAudio = new Audio('/assets/sounds/signature-cannes.mp3');
        signatureAudio.volume = 1.0;
        audioRef.current = signatureAudio;
        signatureAudio.play().catch(e => console.log("Audio play deferred", e));

        // Sequence timing: Tailored to the 6s Cannes signature sound
        setTimeout(() => {
            setPhase('flash');

            // Initiate graceful audio fade-out
            if (audioRef.current) {
                const fadeOutInterval = setInterval(() => {
                    if (audioRef.current.volume > 0.02) {
                        audioRef.current.volume -= 0.02;
                    } else {
                        audioRef.current.volume = 0;
                        audioRef.current.pause();
                        clearInterval(fadeOutInterval);
                    }
                }, 40);
            }
        }, 5000); // Trigger flash near the crescendo of the 6s clip

        setTimeout(() => {
            setPhase('finish');
            onComplete();
        }, 5800);
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden font-['Cormorant_Garamond',_serif]">
            <AnimatePresence>
                {phase === 'idle' && (
                    <motion.div
                        key="idle-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center w-full h-full relative"
                    >
                        {/* Cannes Style Poster Background */}
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.6 }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url('/assets/images/cannes-poster.png')" }}
                        />

                        {/* Film Grain & Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-20 mix-blend-overlay pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 1.5 }}
                                className="text-white text-7xl md:text-9xl font-light italic tracking-[0.2em] mb-4 text-center select-none"
                                style={{ textShadow: "0 0 40px rgba(255,255,255,0.2)" }}
                            >
                                just.sean.flows
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                transition={{ delay: 1.5 }}
                                className="w-16 h-[1px] bg-white mb-12"
                            />

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2, duration: 1 }}
                                onClick={handleIgnite}
                                className="group relative px-16 py-3 border border-white/30 rounded-full transition-all duration-700 hover:border-white hover:bg-white/5 active:scale-95 overflow-hidden"
                            >
                                <span className="text-[10px] md:text-xs text-white/80 font-bold uppercase tracking-[0.8em] group-hover:text-white transition-all pl-2">
                                    Enter Digital Soul
                                </span>

                                {/* Cannes Golden Sweep */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent skew-x-12" />
                            </motion.button>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                transition={{ delay: 3 }}
                                className="mt-12 text-[8px] uppercase tracking-[0.6em] text-white/50 italic"
                            >
                                A Selection by The Manor
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Igniting Phase: Golden Cinematic Reveal */}
            {phase === 'ignite' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10001]">
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
                        animate={{
                            scale: [0.9, 1.1, 4],
                            opacity: [0, 1, 1],
                            filter: ["blur(20px)", "blur(0px)", "blur(10px)"],
                            color: ["#ffffff", "#ffffff", "#ECC94B"] // Fade to gold
                        }}
                        transition={{
                            duration: 5.0,
                            ease: [0.22, 1, 0.36, 1],
                            times: [0, 0.3, 1]
                        }}
                        className="text-white text-7xl md:text-9xl font-light italic tracking-[0.25em] mix-blend-screen whitespace-nowrap"
                    >
                        just.sean.flows
                    </motion.h1>

                    {/* Golden Chromatic Ghost layers */}
                    <motion.h1
                        animate={{
                            scale: [0.9, 1.15, 4.2],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{ duration: 5.0, ease: [0.22, 1, 0.36, 1], times: [0, 0.3, 1] }}
                        className="absolute text-yellow-600 text-7xl md:text-9xl font-light italic tracking-[0.25em] mix-blend-screen whitespace-nowrap blur-md"
                        style={{ marginLeft: '-15px' }}
                    >
                        just.sean.flows
                    </motion.h1>
                </div>
            )}

            {/* Blinding Golden Flash */}
            {phase === 'flash' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-[#F6E05E] z-[10002]" // Luxurious Gold
                />
            )}

            {/* Final Clean Fade */}
            {phase === 'finish' && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-white z-[10002]"
                />
            )}
        </div>
    );
};

export default CinematicOpening;
