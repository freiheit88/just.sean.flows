import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideSparkles, LucideOrbit, LucideInstagram } from 'lucide-react';
import SmokeAssistant from './SmokeAssistant';
import MinaDirective from './MinaDirective';

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
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer group pb-[15vh]"
                    >
                        {/* Centered, Contained Intro Poster Background as requested */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, filter: "blur(4px)" }}
                                transition={{ duration: 2 }}
                                className="absolute inset-0 bg-no-repeat bg-center"
                                style={{ backgroundImage: "url('/assets/click_anywhere_bg.jpg')", backgroundSize: 'contain' }}
                            />
                            {/* Dark Overlay for readability and atmosphere */}
                            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                        </div>

                        {/* SEAN's comment / MinaDirective implementation */}
                        <div className="relative z-[5000] w-full max-w-5xl px-8 md:px-12 mx-auto pointer-events-none flex justify-center">
                            <MinaDirective
                                isVisible={true}
                                activeStep="locked"
                                text="PRESS AREA TO INITIATE"
                                position="top"
                                interactionMode="reading"
                                sysName="SEAN'S COMMENT"
                                actionReq=">> ACTION REQUIRED: CLICK ANYWHERE TO BEGIN <<"
                                isSpeaking={false}
                                disableToggle={true}
                            />
                        </div>
                    </motion.div>
                )}

                {phase === 'idle' && (
                    <motion.div
                        key="idle-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center w-full h-full relative pb-[15vh]"
                    >
                        {/* Centered, Contained Intro Poster Background as requested */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, filter: "blur(4px)" }}
                                transition={{ duration: 2 }}
                                className="absolute inset-0 bg-no-repeat bg-center"
                                style={{ backgroundImage: "url('/assets/click_anywhere_bg.jpg')", backgroundSize: 'contain' }}
                            />
                        </div>

                        {/* Heavy Dark Overlays for "Flashy but Restrained" feel */}
                        <div className="absolute inset-0 bg-black/80 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_100%)] pointer-events-none" />

                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center w-full">
                            {/* Cannes-Style Elegant Trademark Text */}
                            <div className="relative mb-20 md:mb-24 px-4 md:px-6 z-10 w-full max-w-4xl">
                                <motion.h1
                                    initial={{ y: 50, opacity: 0, filter: "blur(20px)" }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                        filter: "blur(0px) drop-shadow(0px 0px 12px rgba(255, 230, 150, 0.8))",
                                        backgroundPosition: ["200% center", "-200% center"]
                                    }}
                                    transition={{
                                        y: { duration: 2, ease: "easeOut", delay: 0.8 },
                                        opacity: { duration: 2, ease: "easeOut", delay: 0.8 },
                                        filter: { duration: 2, ease: "easeOut", delay: 0.8 },
                                        backgroundPosition: { duration: 8, ease: "linear", repeat: Infinity, delay: 2.8 }
                                    }}
                                    className="text-white font-serif uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light text-center select-none leading-[1.1] relative z-10"
                                    style={{
                                        fontSize: "clamp(20px, 5vw, 64px)", // Cannes style size - elegant, not screaming
                                        background: "linear-gradient(to right, #e6ce8a 0%, #fdf5c9 20%, #ffffff 50%, #fdf5c9 80%, #e6ce8a 100%)",
                                        backgroundSize: "200% auto",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    JUST.SEAN.FLOWS
                                </motion.h1>
                                {/* Trademark Floating Sparkle (Lens Flare illusion) */}
                                <motion.div
                                    initial={{ opacity: 0, left: "10%" }}
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        left: ["10%", "50%", "90%", "90%"],
                                        scale: [0.5, 1.5, 0.5, 0.5],
                                        rotate: [0, 90, 180, 180]
                                    }}
                                    transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, delay: 2.8 }}
                                    className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                                >
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full shadow-[0_0_20px_4px_rgba(255,255,255,0.9)] filter blur-[0.5px]" />
                                    <LucideSparkles className="absolute inset-0 text-white w-4 h-4 md:w-6 md:h-6 -translate-x-1/2 -translate-y-1/2 opacity-90 transition-opacity" strokeWidth={1} />
                                </motion.div>
                            </div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2, duration: 1.5 }}
                                onClick={handleIgnite}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative transition-all duration-500 cursor-pointer mt-4"
                                style={{ padding: '3.5rem 5rem' }}
                            >
                                {/* Minimalist Glass Container with rounded borders */}
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)] group-hover:bg-white/10 group-hover:border-white/40 transition-all duration-500 rounded-2xl group-hover:rounded-3xl overflow-hidden">
                                    {/* Soft Blooming Light Inside */}
                                    <motion.div
                                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -inset-[100%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_50%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_50%)] transition-colors duration-1000 pointer-events-none"
                                    />
                                </div>

                                <div className="relative z-10 flex flex-col items-center gap-2 md:gap-3">
                                    <span className="text-[9px] md:text-[10px] font-serif italic text-white/50 tracking-[0.4em] uppercase group-hover:text-white/80 transition-colors duration-500">
                                        The Symphony Awaits
                                    </span>
                                    <div className="text-[16px] md:text-[22px] text-white font-serif tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-700 text-center drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 md:gap-2.5">
                                        <LucideSparkles className="text-white/40 group-hover:text-white transition-colors duration-500 w-4 h-4 md:w-5 md:h-5 shrink-0" strokeWidth={1.5} />
                                        <span>CLICK TO ENTER</span>
                                        <LucideSparkles className="text-white/40 group-hover:text-white transition-colors duration-500 w-4 h-4 md:w-5 md:h-5 shrink-0" strokeWidth={1.5} />
                                    </div>
                                </div>
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
                            className="flex flex-nowrap justify-center gap-[0.05em] overflow-visible w-full px-8 md:px-12"
                        >
                            {"JUST.SEAN.FLOWS".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 10,
                                            filter: "blur(10px) drop-shadow(0 0 0px rgba(223, 193, 109, 0)) drop-shadow(0 0 0px rgba(197, 160, 89, 0))"
                                        },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px) drop-shadow(0px 0px 15px rgba(223, 193, 109, 0.6)) drop-shadow(0 0 40px rgba(197, 160, 89, 0.8))",
                                            transition: { duration: 0.8, ease: "easeOut" }
                                        }
                                    }}
                                    className="font-serif uppercase tracking-widest md:tracking-[0.2em] font-light mix-blend-screen leading-none"
                                    style={{
                                        fontSize: "clamp(20px, 5vw, 64px)",
                                        lineHeight: 1,
                                        background: "linear-gradient(to bottom, #ffffff 0%, #dfc16d 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Subtle Toned-down Golden Glow Overlay (Replacing the harsh light sweep) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0, 0.2, 0], scale: 1.1 }}
                            transition={{
                                duration: 4,
                                ease: "easeInOut",
                                delay: 0.2
                            }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#C5A059_0%,_transparent_60%)] mix-blend-screen pointer-events-none z-0"
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
