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
                                initial={{ y: 100, opacity: 0, filter: "blur(50px)", scale: 0.5 }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
                                transition={{ delay: 0.8, duration: 3, ease: "easeOut" }}
                                className="text-white text-[30rem] md:text-[60rem] font-light italic tracking-[-0.05em] mb-8 text-center select-none leading-[0.7] drop-shadow-[0_20px_150px_rgba(255,255,255,0.6)]"
                                style={{
                                    fontVariant: "small-caps",
                                    background: "linear-gradient(to bottom, #FFFFFF 0%, #C5A059 50%, #5C1A1A 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mixBlendMode: "screen",
                                    filter: "drop-shadow(0 0 30px rgba(197, 160, 89, 0.4)) contrast(1.2)"
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
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 3, duration: 1.5 }}
                                onClick={handleIgnite}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative px-24 py-6 overflow-hidden transition-all duration-500"
                            >
                                {/* High-Tech Holographic Interface - Added V20.3 */}
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border-x border-white/20" />
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

                                {/* Scanning Ray Effect */}
                                <motion.div
                                    animate={{ top: ['-100%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 h-[20%] bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent pointer-events-none"
                                />

                                <span className="relative z-10 text-[14px] md:text-[18px] text-[#FDFCF0] font-black uppercase tracking-[1em] group-hover:text-white transition-all flex items-center gap-4">
                                    <LucideZap size={16} className="text-[#C5A059] animate-pulse" />
                                    Initiate Digital Embodiment
                                    <LucideZap size={16} className="text-[#C5A059] animate-pulse" />
                                </span>

                                {/* Glitch Shimmer */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent skew-x-12" />
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

                        {/* V20.3: Mina positioned at Top Top */}
                        <div className="absolute top-12 inset-x-0 pointer-events-none z-[999]">
                            <SmokeAssistant
                                isVisible={phase === 'idle'}
                                activeStep="opening"
                                text="AUTHENTICATION REQUIRED. GUEST IDENTITY: PENDING. INITIATE PROTOCOL."
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
