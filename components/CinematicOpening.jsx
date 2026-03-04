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
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer group"
                    >
                        {/* New Background with Heavy Blur */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                initial={{ scale: 1.05 }}
                                animate={{ scale: 1.05 }}
                                className="absolute inset-[-2%] bg-cover bg-center"
                                style={{ backgroundImage: "url('/assets/click_anywhere_bg.jpg')", filter: "blur(8px) brightness(0.9)" }}
                            />
                            {/* Dark Overlay for readability and atmosphere */}
                            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                        </div>

                        {/* SEAN's comment / MinaDirective implementation */}
                        <div className="relative z-[5000] w-full max-w-5xl px-4 md:px-8 mx-auto pointer-events-none flex justify-center">
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
                        className="flex flex-col items-center justify-center w-full h-full relative"
                    >
                        {/* [BOLD UI OVERHAUL] Panning Atmospheric Collage Background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                initial={{ scale: 1.2, x: "-5%", y: "-5%", opacity: 0 }}
                                animate={{
                                    scale: 1.2,
                                    opacity: 1,
                                    x: ["-5%", "5%", "-5%"],
                                    y: ["-5%", "5%", "-5%"],
                                    filter: "blur(8px)" // Atmospheric blur
                                }}
                                transition={{
                                    opacity: { duration: 2 },
                                    x: { duration: 120, repeat: Infinity, ease: "linear" },
                                    y: { duration: 150, repeat: Infinity, ease: "linear" },
                                    filter: { duration: 0 } // static tween
                                }}
                                className="absolute inset-[-10%] bg-cover bg-center grayscale-[40%]"
                                style={{ backgroundImage: "url('/assets/intro-collage.png')", backgroundSize: 'cover' }}
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
                                className="text-white font-bold italic tracking-tighter mb-20 md:mb-24 text-center select-none leading-[1.1]"
                                style={{
                                    fontSize: "clamp(45px, 10vw, 120px)", // Reverted back to original size
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
                            className="flex flex-nowrap justify-center gap-[0.05em] overflow-visible"
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
                                            filter: "blur(0px) drop-shadow(0 0 15px rgba(232, 208, 145, 0.8)) drop-shadow(0 0 40px rgba(197, 160, 89, 0.9))",
                                            transition: { duration: 0.8, ease: "easeOut" }
                                        }
                                    }}
                                    className="text-white font-bold italic tracking-tighter mix-blend-screen leading-none"
                                    style={{
                                        fontSize: "clamp(30px, 7.5vw, 200px)",
                                        lineHeight: 1
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Massive Cinematic Light Sweep Overlay (Left to Right) */}
                        <motion.div
                            initial={{ left: "-50%", opacity: 0 }}
                            animate={{ left: "120%", opacity: [0, 0.9, 0] }}
                            transition={{
                                duration: 1.8,
                                ease: "linear",
                                delay: 0.2 // Sync with the stagger animation
                            }}
                            className="absolute inset-y-0 w-3/4 bg-gradient-to-r from-transparent via-[#FDFCF0] to-transparent mix-blend-overlay blur-xl pointer-events-none z-50 transform -skew-x-12"
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
