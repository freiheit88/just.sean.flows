import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideSparkles, LucideOrbit, LucideInstagram } from 'lucide-react';
import SmokeAssistant from './SmokeAssistant';

const CinematicOpening = ({ onStart, onComplete }) => {
    const [phase, setPhase] = useState('locked'); // locked, idle, ignite, flash, finish
    const [isInteracted, setIsInteracted] = useState(false);

    const audioRef = useRef(null);

    const handleUnlock = () => {
        setIsInteracted(true);
        setPhase('idle');

        if (onStart) onStart();
    };

    const handleIgnite = () => {
        setPhase('ignite');

        // Portal transition sound variants
        const signatureAudio = new Audio('/assets/sounds/signature-cannes.mp3');
        const portalAudio = new Audio('/assets/sounds/portal-transition.mp3');
        portalAudio.volume = 0.7; // Lowered to 70% per user request

        signatureAudio.volume = 1.0;
        audioRef.current = signatureAudio;
        signatureAudio.play().catch(e => console.log("Audio play deferred", e));

        // Sequence timing: portal trigger
        setTimeout(() => {
            portalAudio.play().catch(e => console.log("Portal sound deferred", e));

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
        }, 5000);

        setTimeout(() => {
            setPhase('finish');
            setTimeout(() => {
                onComplete();
            }, 2000);
        }, 6000);
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden font-['Cormorant_Garamond',_serif]">
            <AnimatePresence>
                {phase === 'locked' && (
                    <motion.div
                        key="locked-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleUnlock}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer group"
                    >
                        <LucideOrbit className="w-16 h-16 text-[#C5A059] opacity-50 mb-6 group-hover:scale-110 transition-transform duration-500 animate-[spin_10s_linear_infinite]" />
                        <span className="text-[#8B7355] text-xs tracking-[0.5em] uppercase font-mono animate-pulse group-hover:text-[#C5A059] transition-colors">
                            Click anywhere to begin
                        </span>
                    </motion.div>
                )}

                {phase === 'idle' && (
                    <motion.div
                        key="idle-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center w-full h-full relative"
                    >
                        {/* Aristocratic Invitation Background - Darkened to 30% Brightness for Cinematic Contrast */}
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.3 }}
                            className="absolute inset-0 bg-cover bg-center grayscale-[20%]"
                            style={{ backgroundImage: "url('/assets/images/aristocratic-invitation.png')" }}
                        />

                        {/* Atmospheric Overlays */}
                        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />

                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center w-full">
                            <motion.h1
                                initial={{ y: 50, opacity: 0, filter: "blur(20px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
                                className="text-white font-bold italic tracking-tighter mb-20 md:mb-24 text-center select-none leading-[1.1]"
                                style={{
                                    fontSize: "clamp(45px, 10vw, 120px)", // Increased for mobile
                                    fontVariant: "small-caps",
                                    background: "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 60%, #FDFCF0 80%, #E8D091 100%)", // Pure white with very slight gold at bottom
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    filter: "drop-shadow(0px 10px 40px rgba(0,0,0,1)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) contrast(1.5)"
                                }}
                            >
                                just.sean.flows
                            </motion.h1>

                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 2, duration: 1.5 }}
                                onClick={handleIgnite}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-16 md:px-32 py-6 md:py-8 overflow-hidden transition-all duration-500 rounded-2xl cursor-pointer"
                            >
                                {/* Solid Button Background */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-md border border-[#C5A059]/50 shadow-[0_0_50px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_80px_rgba(197,160,89,0.6)] group-hover:bg-[#C5A059]/20 transition-all rounded-2xl" />

                                {/* Breathing Border */}
                                <motion.div
                                    animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 border-2 border-[#C5A059]/60 rounded-2xl pointer-events-none"
                                />

                                <span className="relative z-10 text-[20px] md:text-[32px] text-white font-black uppercase tracking-[0.3em] group-hover:tracking-[0.5em] transition-all text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center gap-4">
                                    <LucideSparkles className="text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                                    CLICK TO ENTER
                                    <LucideSparkles className="text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                                </span>
                            </motion.button>


                        </div>

                    </motion.div>
                )}
            </AnimatePresence>


            {/* Igniting Phase: Golden Cinematic Reveal */}
            {phase === 'ignite' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[10001] px-4">
                    <div className="relative">
                        {/* Elegant Letter Reveal */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="flex flex-wrap justify-center gap-[0.1em]"
                        >
                            {"just.sean.flows".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                            transition: { duration: 0.8, ease: "easeOut" }
                                        }
                                    }}
                                    className="text-white text-5xl md:text-8xl font-light italic tracking-wider mix-blend-screen"
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Golden Light Sweep Overlay */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: [0, 1, 1],
                                opacity: [0, 0.8, 0],
                                x: ["-100%", "100%", "100%"]
                            }}
                            transition={{
                                duration: 5.0,
                                ease: "easeInOut",
                                times: [0, 0.5, 1]
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent h-[2px] top-1/2 -mt-[1px] blur-sm"
                        />
                    </div>
                </div>
            )}

            {/* V12 Update: Seamless Audio Element */}
            <audio id="bg-audio" loop preload="auto">
                <source src="/assets/sounds/background_candiate1.mp3" type="audio/mpeg" />
            </audio>
            {/* Final Clean Fade */}
            {phase === 'finish' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-white z-[10002]"
                />
            )}
        </div>
    );
};

export default CinematicOpening;
