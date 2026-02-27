import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideZap, LucideOrbit } from 'lucide-react';
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
                        {/* Aristocratic Invitation Background */}
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.8 }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url('/assets/images/aristocratic-invitation.png')" }}
                        />

                        {/* Atmospheric Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />

                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-20 mix-blend-overlay pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.h1
                                initial={{ y: 50, opacity: 0, filter: "blur(30px)", scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
                                transition={{ delay: 0.8, duration: 2.5, ease: "easeOut" }}
                                className="text-white text-[15rem] md:text-[24rem] font-light italic tracking-[-0.02em] mb-4 text-center select-none leading-[0.8] drop-shadow-[0_10px_100px_rgba(255,255,255,0.4)]"
                                style={{
                                    fontVariant: "small-caps",
                                    background: "linear-gradient(to bottom, #FFFFFF 20%, #C5A059 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mixBlendMode: "screen"
                                }}
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
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 2.5, duration: 1.5 }}
                                onClick={handleIgnite}
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(197, 160, 89, 0.15)" }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-20 py-8 overflow-hidden rounded-full transition-all duration-700 active:scale-95 shadow-[0_0_50px_rgba(197,160,89,0.2)] hover:shadow-[0_0_80px_rgba(197,160,89,0.5)]"
                            >
                                {/* Golden Wax Seal Style Button - V20.1 Polish */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/40 to-[#5C1A1A]/20 opacity-30 group-hover:opacity-60 transition-opacity" />
                                <div className="absolute inset-0 border-2 border-[#C5A059]/50 group-hover:border-[#F6E05E] transition-colors rounded-full" />

                                {/* Magnetic Pulsing Glow */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 0.7, 0.3],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#F6E05E_0%,_transparent_70%)] blur-2xl"
                                />

                                <span className="relative z-10 text-[14px] md:text-[18px] text-white font-black uppercase tracking-[0.8em] group-hover:text-[#FDFCF0] transition-all drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                    Enter Digital Soul
                                </span>

                                {/* Enhanced Golden Sweep */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-20 blur-sm" />
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

                        {/* V20: Opening Guidance with Mina */}
                        <div className="absolute inset-0 pointer-events-none">
                            <SmokeAssistant
                                isVisible={phase === 'idle'}
                                activeStep="opening"
                                text="The Manor awaits your presence, Guest. Step into the digital beyond."
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
