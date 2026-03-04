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
                            <motion.h1
                                initial={{ y: 50, opacity: 0, filter: "blur(20px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
                                className="text-white font-bold italic tracking-tighter mb-20 md:mb-24 text-center select-none leading-[1.1] px-4 md:px-6"
                                style={{
                                    fontSize: "clamp(28px, 6vw, 84px)", // Further reduced by ~10%
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2, duration: 1.5 }}
                                onClick={handleIgnite}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-10 md:px-20 py-5 md:py-6 transition-all duration-500 cursor-pointer mt-4"
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
                            {"just.sean.flows".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 10,
                                            filter: "blur(10px) drop-shadow(0 0 0px rgba(232, 208, 145, 0)) drop-shadow(0 0 0px rgba(197, 160, 89, 0))"
                                        },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px) drop-shadow(0 0 25px rgba(232, 208, 145, 1)) drop-shadow(0 0 60px rgba(197, 160, 89, 1))",
                                            transition: { duration: 0.8, ease: "easeOut" }
                                        }
                                    }}
                                    className="text-white font-bold italic tracking-tighter mix-blend-screen leading-none px-2"
                                    style={{
                                        fontSize: "clamp(16.5px, 4.2vw, 112px)",
                                        lineHeight: 1
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
