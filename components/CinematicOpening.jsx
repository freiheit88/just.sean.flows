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

                        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-full sm:max-w-[420px] md:max-w-[540px] lg:max-w-[620px] mx-auto md:p-10 md:bg-black/40 md:backdrop-blur-2xl md:border md:border-[#C5A059]/30 md:rounded-[40px] md:shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-1000 mt-[10vh] md:mt-0">
                            {/* Decorative Top Accent */}
                            <div className="hidden md:block absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />
                            <div className="hidden md:block absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                            <div className="w-full flex justify-center items-center mb-12 md:mb-16">
                                <LucideSparkles className="text-[#C5A059]/60 w-6 h-6 animate-pulse" strokeWidth={1} />
                            </div>

                            {/* Completely Renewed Cinematic Text */}
                            <div className="relative z-10 flex flex-col items-center justify-center w-full gap-4 md:gap-6 mb-16 md:mb-20">
                                {/* Soft Background Pulse Behind Text */}
                                <motion.div
                                    animate={{ opacity: [0.1, 0.3, 0.1], filter: ["blur(30px)", "blur(50px)", "blur(30px)"], scale: [0.9, 1.1, 0.9] }}
                                    transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                                    className="absolute inset-0 bg-[#C5A059] rounded-full pointer-events-none -z-10 mix-blend-screen"
                                />

                                <motion.h1
                                    initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                    className="flex flex-col items-center gap-1 md:gap-2 select-none"
                                >
                                    <span className="font-sans font-light tracking-[0.5em] md:tracking-[0.8em] text-white/50 text-[10px] md:text-xs uppercase mb-2">
                                        The Multiverse Project
                                    </span>

                                    {/* Stacked "JUST. SEAN." structure for more impact */}
                                    <span
                                        className="font-serif uppercase italic text-[#FDFCF0] drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                                        style={{ fontSize: "clamp(28px, 6vw, 56px)", letterSpacing: "0.15em", lineHeight: 1.1 }}
                                    >
                                        <span className="text-[#C5A059]">J</span>UST<span className="text-[#C5A059]/40 mx-2">.</span><span className="text-[#C5A059]">S</span>EAN
                                    </span>

                                    {/* Dramatic "FLOWS" */}
                                    <span
                                        className="font-serif uppercase font-light text-[#FDFCF0] tracking-[0.3em] md:tracking-[0.4em] drop-shadow-[0_0_40px_rgba(197,160,89,0.6)]"
                                        style={{ fontSize: "clamp(24px, 5vw, 48px)", marginTop: "0.2em" }}
                                    >
                                        FLOWS
                                    </span>
                                </motion.h1>

                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "80%", opacity: 0.6 }}
                                    transition={{ duration: 2, ease: "easeOut", delay: 1 }}
                                    className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent pointer-events-none mt-6"
                                />
                            </div>

                            {/* Elevated Entry Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5, duration: 1.5 }}
                                onClick={handleIgnite}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative transition-all duration-500 cursor-pointer w-[85%] md:w-[70%]"
                            >
                                {/* Button Box - Matches inner theme */}
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/20 group-hover:bg-[#C5A059]/10 group-hover:border-[#C5A059]/50 transition-all duration-500 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <motion.div
                                        animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -inset-[50%] bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.2)_0%,transparent_50%)] pointer-events-none"
                                    />
                                </div>

                                <div className="relative z-10 flex flex-col items-center py-6 md:py-8 gap-2">
                                    <span className="text-[9px] md:text-[10px] font-sans font-black text-[#C5A059]/70 tracking-[0.5em] md:tracking-[0.6em] uppercase group-hover:text-[#C5A059] transition-colors duration-500">
                                        Initiate
                                    </span>
                                    <div className="text-sm md:text-lg text-white font-serif tracking-[0.3em] group-hover:tracking-[0.5em] transition-all duration-700 text-center drop-shadow-lg flex items-center justify-center gap-3">
                                        <span>CLICK TO ENTER</span>
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
                    <div className="relative flex flex-col items-center justify-center w-full">
                        {/* Elite 'Ignite' Reveal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                            animate={{ opacity: [0, 1, 1, 0], scale: 1.05, filter: ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"] }}
                            transition={{ duration: 6, ease: "easeInOut" }}
                            className="flex flex-col items-center gap-8 md:gap-12 relative z-10 w-full"
                        >
                            <h1 className="flex flex-col items-center gap-1 md:gap-2 select-none mix-blend-screen w-full px-4">
                                <span
                                    className="font-serif uppercase italic text-[#FDFCF0]"
                                    style={{
                                        fontSize: "clamp(36px, 8vw, 72px)",
                                        letterSpacing: "0.15em",
                                        lineHeight: 1.1,
                                        textShadow: "0 0 60px rgba(197, 160, 89, 0.8), 0 0 100px rgba(255, 255, 255, 0.4)"
                                    }}
                                >
                                    <span className="text-[#C5A059]">J</span>UST<span className="text-[#C5A059]/40 mx-2 md:mx-4">.</span><span className="text-[#C5A059]">S</span>EAN
                                </span>

                                <span
                                    className="font-serif uppercase font-light text-[#FDFCF0] tracking-[0.3em] md:tracking-[0.4em]"
                                    style={{
                                        fontSize: "clamp(32px, 7vw, 64px)",
                                        marginTop: "0.2em",
                                        textShadow: "0 0 60px rgba(197, 160, 89, 0.8), 0 0 100px rgba(255, 255, 255, 0.4)"
                                    }}
                                >
                                    FLOWS
                                </span>
                            </h1>

                            {/* Epic Expanding Energy Line */}
                            <motion.div
                                initial={{ width: "0%", opacity: 0 }}
                                animate={{ width: ["0%", "80%", "100%"], opacity: [0, 1, 0] }}
                                transition={{ duration: 5, ease: "easeInOut", delay: 0.5 }}
                                className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent max-w-3xl absolute -bottom-10"
                            />
                        </motion.div>

                        {/* Deep Core Bloom (Replacing harsh sweep) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.3, 0], scale: 1.5 }}
                            transition={{ duration: 6, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.5)_0%,_transparent_50%)] mix-blend-screen pointer-events-none -z-10"
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
