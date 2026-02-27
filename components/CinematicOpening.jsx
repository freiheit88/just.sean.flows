import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideSparkles, LucideOrbit } from 'lucide-react';
import SmokeAssistant from './SmokeAssistant';

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
                        {/* Aristocratic Invitation Background - Darkened to 30% Brightness for Cinematic Contrast */}
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.3 }}
                            className="absolute inset-0 bg-cover bg-center grayscale-[20%]"
                            style={{ backgroundImage: "url('/assets/images/aristocratic-invitation.png')" }}
                        />

                        {/* Atmospheric Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />

                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center w-full">
                            <motion.h1
                                initial={{ y: 50, opacity: 0, filter: "blur(20px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
                                className="text-white font-bold italic tracking-tighter mb-16 text-center select-none leading-[1.1] drop-shadow-[0_15px_60px_rgba(197,160,89,0.5)]"
                                style={{
                                    fontSize: "clamp(40px, 8vw, 180px)",
                                    fontVariant: "small-caps",
                                    background: "linear-gradient(to bottom, #FFFFFF 0%, #C5A059 50%, #8B7355 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mixBlendMode: "screen",
                                    filter: "drop-shadow(0 0 20px rgba(197, 160, 89, 0.4)) contrast(1.1)"
                                }}
                            >
                                just.sean.flows
                            </motion.h1>

                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 2, duration: 1.5 }}
                                onClick={handleIgnite}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-32 py-10 overflow-hidden transition-all duration-500 rounded-lg"
                            >
                                {/* Futuristic Click-to-Enter Interface - Clean icons for V20.7 */}
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_0_100px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_140px_rgba(197,160,89,0.6)] transition-all" />

                                {/* Intense Iridescent Glow */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 0.7, 0.3],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent blur-2xl pointer-events-none"
                                />

                                <span className="relative z-10 text-[24px] md:text-[42px] text-white font-black uppercase tracking-[0.5em] group-hover:tracking-[0.7em] transition-all text-center">
                                    CLICK TO ENTER
                                </span>

                                {/* Enhanced Tech Shimmer */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                            </motion.button>


                        </div>

                        {/* V20.4: Mina positioned at Top Top */}
                        <div className="absolute top-12 inset-x-0 pointer-events-none z-[999]">
                            <SmokeAssistant
                                isVisible={phase === 'idle'}
                                activeStep="opening"
                                text="AUTHENTICATION REQUIRED. GUEST IDENTITY: PENDING. CLICK TO INITIATE PROTOCOL."
                            />
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

                    {/* Final Golden Resolve (Syncs with Harmony Chord) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: phase === 'flash' ? 1 : [0, 0.1, 0],
                            scale: phase === 'flash' ? 1.2 : 1,
                            filter: phase === 'flash' ? "blur(0px)" : "blur(20px)"
                        }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <h1 className="text-yellow-500/30 text-7xl md:text-9xl font-light italic tracking-[0.25em] blur-xl px-4 text-center">
                            just.sean.flows
                        </h1>
                    </motion.div>
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
