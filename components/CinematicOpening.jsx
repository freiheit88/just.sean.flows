import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideSparkles, LucideOrbit, LucideCompass, LucideVolume2, LucideVolumeX, LucideInstagram } from 'lucide-react';
import SmokeAssistant from './SmokeAssistant';
import MinaDirective from './MinaDirective';

const CinematicOpening = ({ onStart, onComplete }) => {
    const [phase, setPhase] = useState('idle'); // locked, idle, ignite, flash, finish
    const [isInteracted, setIsInteracted] = useState(true);

    // --- Interactive Volume Calibration Overlay States ---
    const [calibrationStep, setCalibrationStep] = useState('start'); // 'start', 'playing', 'dismissed'
    const calibrationAudioRef = useRef(null);
    const videoElementRef = useRef(null);

    const audioRef = useRef(null);

    // Autoplay safety effect for background video
    useEffect(() => {
        if (videoElementRef.current) {
            videoElementRef.current.muted = true;
            videoElementRef.current.play().catch(err => {
                console.log("CinematicOpening background video autoplay blocked:", err);
            });
        }
    }, []);

    // Calibration Sound Loop Manager
    useEffect(() => {
        if (calibrationStep === 'playing') {
            try {
                const audio = new Audio('/assets/manual_upload/A twelve-alibi_MR_master.wav');
                audio.loop = true;
                audio.volume = 0.08; // Quiet reference BGM
                calibrationAudioRef.current = audio;
                audio.play().catch(e => console.log("Calibration audio play deferred:", e));
            } catch (e) {
                console.log("Failed to setup calibration audio:", e);
            }
        }
        return () => {
            if (calibrationAudioRef.current) {
                calibrationAudioRef.current.pause();
                calibrationAudioRef.current = null;
            }
        };
    }, [calibrationStep]);

    const handleCalibrationClick = () => {
        if (calibrationStep === 'start') {
            setCalibrationStep('playing');
        } else if (calibrationStep === 'playing') {
            // Play Timpani heavy kick sound
            try {
                const timpaniAudio = new Audio('/assets/sounds/TS_IFD_kick_timpani_heavy.wav');
                timpaniAudio.volume = 0.8;
                timpaniAudio.play().catch(() => {});
            } catch (e) {
                console.log("SFX play failed:", e);
            }

            // Fade out the calibration audio
            if (calibrationAudioRef.current) {
                const audio = calibrationAudioRef.current;
                let vol = audio.volume;
                const fade = setInterval(() => {
                    vol -= 0.01;
                    if (vol <= 0) {
                        vol = 0;
                        audio.pause();
                        clearInterval(fade);
                    } else {
                        audio.volume = vol;
                    }
                }, 50);
            }

            setCalibrationStep('dismissed');
            
            // Trigger main BGM fade-in on parent
            if (onStart) onStart();
        }
    };

    // 3D Spatial Audio Engine (European Park Ambience)
    useEffect(() => {
        let audioCtx;
        let sources = [];
        
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            // Create listener
            const listener = audioCtx.listener;
            if (listener.positionX) {
                listener.positionX.setValueAtTime(0, audioCtx.currentTime);
                listener.positionY.setValueAtTime(0, audioCtx.currentTime);
                listener.positionZ.setValueAtTime(0, audioCtx.currentTime);
            } else {
                listener.setPosition(0, 0, 0);
            }

            // Helper to load, decode and setup 3D Panner Node for a sound file
            const setupSpatialLayer = async (url, initialPos, updatePosFn) => {
                try {
                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.loop = true;

                    const panner = audioCtx.createPanner();
                    panner.panningModel = 'HRTF';
                    panner.distanceModel = 'inverse';
                    panner.refDistance = 1;
                    panner.maxDistance = 100;
                    panner.rolloffFactor = 1;

                    if (panner.positionX) {
                        panner.positionX.setValueAtTime(initialPos.x, audioCtx.currentTime);
                        panner.positionY.setValueAtTime(initialPos.y, audioCtx.currentTime);
                        panner.positionZ.setValueAtTime(initialPos.z, audioCtx.currentTime);
                    } else {
                        panner.setPosition(initialPos.x, initialPos.y, initialPos.z);
                    }

                    const gainNode = audioCtx.createGain();
                    gainNode.gain.setValueAtTime(initialPos.vol, audioCtx.currentTime);

                    source.connect(gainNode);
                    gainNode.connect(panner);
                    panner.connect(audioCtx.destination);

                    source.start();
                    sources.push(source);

                    if (updatePosFn) {
                        let startTime = audioCtx.currentTime;
                        const tick = () => {
                            if (audioCtx.state === 'closed') return;
                            const t = audioCtx.currentTime - startTime;
                            const newPos = updatePosFn(t);
                            if (panner.positionX) {
                                panner.positionX.setValueAtTime(newPos.x, audioCtx.currentTime);
                                panner.positionY.setValueAtTime(newPos.y, audioCtx.currentTime);
                                panner.positionZ.setValueAtTime(newPos.z, audioCtx.currentTime);
                            } else {
                                panner.setPosition(newPos.x, newPos.y, newPos.z);
                            }
                            requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                    }
                } catch (err) {
                    console.log("Spatial layer setup failed", url, err);
                }
            };

            // Birds (Elevated Left, circling overhead slowly)
            setupSpatialLayer(
                '/assets/sounds/ambient_birds.mp3',
                { x: -3, y: 3, z: 1, vol: 0.15 },
                (t) => {
                    const radius = 4;
                    const speed = 0.15;
                    return {
                        x: Math.cos(t * speed) * radius,
                        y: 3,
                        z: Math.sin(t * speed) * radius
                    };
                }
            );

            // Wind (Behind the listener, slowly drifting left to right)
            setupSpatialLayer(
                '/assets/sounds/ambient_wind.mp3',
                { x: 0, y: 1, z: 4, vol: 0.08 },
                (t) => {
                    const range = 5;
                    const speed = 0.08;
                    return {
                        x: Math.sin(t * speed) * range,
                        y: 1,
                        z: 4
                    };
                }
            );

            // Children/Chatter (Front Right, stationary)
            setupSpatialLayer(
                '/assets/sounds/ambient_chatter.mp3',
                { x: 3, y: 0, z: -4, vol: 0.12 }
            );

        } catch (e) {
            console.log("3D Spatial Audio Context creation failed", e);
        }

        return () => {
            if (audioCtx) {
                audioCtx.close().catch(() => {});
            }
            sources.forEach(src => {
                try { src.stop(); } catch (e) {}
            });
        };
    }, []);

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
            // portalAudio.play().catch(e => console.log("Portal sound deferred", e));

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
            {/* Global 1st-Person POV Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video
                    ref={videoElementRef}
                    src="/assets/manual_upload/club_entrance_1st_person.mp4"
                    autoPlay={true}
                    loop={true}
                    playsInline={true}
                    muted={true}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all duration-[2500ms] ease-out hidden"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <motion.img
                    src="/assets/manual_upload/club_gate_1st_person.jpg"
                    alt="Club Entrance POV"
                    initial={{ scale: 1.0 }}
                    animate={{ scale: [1.0, 1.05, 1.0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all duration-[2500ms] ease-out"
                    style={{
                        filter: calibrationStep !== 'dismissed' ? 'brightness(1.0)' : 'brightness(0.6)',
                    }}
                />
            </div>

            {/* Calibration Overlay */}
            <AnimatePresence>
                {calibrationStep !== 'dismissed' && (
                    <motion.div
                        key="calibration-overlay"
                        initial={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ 
                            opacity: 0, 
                            filter: "blur(20px)", 
                            scale: 1.05,
                        }}
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        onClick={handleCalibrationClick}
                        className="fixed inset-0 z-[50000] bg-black/15 backdrop-blur-[3px] cursor-pointer select-none"
                    >
                        <div className="relative w-full h-full max-w-[430px] mx-auto flex items-center justify-center p-4">
                            {/* Center Widget Card */}
                            <div className="flex flex-col items-center justify-center p-6 bg-[#0a0c12]/50 border border-white/10 rounded-2xl max-w-[260px] w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden">
                                <motion.div 
                                    className="text-[#C5A059] mb-4 opacity-80"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                >
                                    <LucideCompass size={32} strokeWidth={1} />
                                </motion.div>

                                <AnimatePresence mode="wait">
                                    {calibrationStep === 'start' ? (
                                        <motion.div
                                            key="step-start"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <h3 className="font-serif text-[#FDFCF0] text-sm tracking-[0.2em] uppercase font-bold">
                                                🔊 Calibrate Sound
                                            </h3>
                                            <div className="mt-2 text-[#C5A059] font-sans text-[9px] tracking-[0.15em] uppercase font-black animate-pulse">
                                                👇 Tap to Play Tone
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step-playing"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <h3 className="font-serif text-[#C5A059] text-sm tracking-[0.2em] uppercase font-bold">
                                                🎧 Align Volume
                                            </h3>
                                            <p className="text-[10px] text-white/70 tracking-wider font-light uppercase">
                                                🔉 Adjust system volume to 20%
                                            </p>
                                            <div className="mt-3 text-[9px] text-white/30 tracking-[0.2em] font-sans uppercase animate-pulse">
                                                👉 Tap to Enter 👈
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Right Side Vertical Volume Slider HUD (similar to mobile system volume overlay) */}
                            {calibrationStep === 'playing' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-50 pointer-events-none"
                                >
                                    <span className="text-[11px] opacity-70">🔊</span>
                                    <div className="relative h-[180px] flex items-center justify-center">
                                        {/* Slider Track */}
                                        <div className="w-[10px] h-[180px] bg-white/15 rounded-full relative border border-white/10 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                                            {/* Progress Fill (20% from bottom) */}
                                            <div 
                                                className="absolute bottom-0 left-0 w-full bg-[#C5A059] rounded-full shadow-[0_0_12px_#C5A059]"
                                                style={{ height: '20%' }}
                                            />
                                            {/* Target Line at 20% mark */}
                                            <div 
                                                className="absolute left-0 w-full h-[2px] bg-white shadow-[0_0_6px_rgba(255,255,255,1)]"
                                                style={{ bottom: '20%' }}
                                            />
                                        </div>
                                        
                                        {/* Target Indicator pointer pointing to the 20% height mark */}
                                        <div 
                                            className="absolute right-[22px] bottom-[30px] flex items-center gap-1.5 text-[#C5A059] font-mono text-[9px] font-black uppercase tracking-widest select-none whitespace-nowrap"
                                        >
                                            <span className="animate-pulse">Target 20%</span>
                                            <span>👉</span>
                                        </div>
                                    </div>
                                    <span className="text-[11px] opacity-70">🔉</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {phase === 'locked' && (
                    <motion.div
                        key="locked-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleUnlock}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer group p-4"
                    >
                        {/* Removed click_anywhere_bg image div */}

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
                        className="flex flex-col items-center justify-center w-full h-full relative p-4"
                    >
                        {/* Removed click_anywhere_bg image div */}

                        {/* Heavy Dark Overlays for "Flashy but Restrained" feel */}
                        <div className="absolute inset-0 bg-black/80 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_100%)] pointer-events-none" />

                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-fit max-w-full sm:max-w-[420px] md:max-w-[540px] lg:max-w-[620px] mx-auto md:p-10 md:bg-black/40 md:backdrop-blur-2xl md:border md:border-[#C5A059]/30 md:rounded-[40px] md:shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-1000 mt-[5vh] md:mt-0">
                            {/* Decorative Top Accent */}
                            <div className="hidden md:block absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />
                            <div className="hidden md:block absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                            <div className="w-full flex justify-center items-center mb-12 md:mb-16">
                                <LucideSparkles className="text-[#C5A059]/60 w-6 h-6 animate-pulse" strokeWidth={1} />
                            </div>

                            {/* Completely Renewed Cinematic Text */}
                            <div className="relative z-10 flex flex-col items-center justify-center w-full gap-4 md:gap-6 mb-6 md:mb-10">
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

                                    {/* Stacked "J. S. F." structure for vertical impact */}
                                    <span
                                        className="font-serif uppercase italic text-[#FDFCF0] drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                                        style={{ fontSize: "clamp(28px, 6vw, 56px)", letterSpacing: "0.15em", lineHeight: 1.1 }}
                                    >
                                        <span className="text-[#C5A059]">J</span>UST<span className="text-[#C5A059]/40 ml-2">.</span>
                                    </span>

                                    <span
                                        className="font-serif uppercase italic text-[#FDFCF0] drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                                        style={{ fontSize: "clamp(28px, 6vw, 56px)", letterSpacing: "0.15em", lineHeight: 1.1 }}
                                    >
                                        <span className="text-[#C5A059]">S</span>EAN<span className="text-[#C5A059]/40 ml-2">.</span>
                                    </span>

                                    <span
                                        className="font-serif uppercase italic text-[#FDFCF0] drop-shadow-[0_0_40px_rgba(197,160,89,0.6)]"
                                        style={{ fontSize: "clamp(28px, 6vw, 56px)", letterSpacing: "0.15em", marginTop: "0.2em", lineHeight: 1.1 }}
                                    >
                                        <span className="text-[#C5A059]">F</span>LOWS
                                    </span>
                                </motion.h1>

                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "80%", opacity: 0.6 }}
                                    transition={{ duration: 2, ease: "easeOut", delay: 1 }}
                                    className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent pointer-events-none mt-4 md:mt-6"
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
                                    <span className="text-[#C5A059]">J</span>UST<span className="text-[#C5A059]/40 ml-2">.</span>
                                </span>

                                <span
                                    className="font-serif uppercase italic text-[#FDFCF0]"
                                    style={{
                                        fontSize: "clamp(36px, 8vw, 72px)",
                                        letterSpacing: "0.15em",
                                        lineHeight: 1.1,
                                        textShadow: "0 0 60px rgba(197, 160, 89, 0.8), 0 0 100px rgba(255, 255, 255, 0.4)"
                                    }}
                                >
                                    <span className="text-[#C5A059]">S</span>EAN<span className="text-[#C5A059]/40 ml-2">.</span>
                                </span>

                                <span
                                    className="font-serif uppercase italic text-[#FDFCF0]"
                                    style={{
                                        fontSize: "clamp(36px, 8vw, 72px)",
                                        letterSpacing: "0.15em",
                                        marginTop: "0.2em",
                                        lineHeight: 1.1,
                                        textShadow: "0 0 60px rgba(197, 160, 89, 0.8), 0 0 100px rgba(255, 255, 255, 0.4)"
                                    }}
                                >
                                    <span className="text-[#C5A059]">F</span>LOWS
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
                <source src="/assets/manual_upload/A twelve-alibi_MR_master.wav" type="audio/wav" />
            </audio>
            {/* Final Clean Fade */}
            {phase === 'finish' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-black z-[10002]"
                />
            )}
        </div>
    );
};

export default CinematicOpening;
