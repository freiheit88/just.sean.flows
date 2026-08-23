import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { Compass, Sparkles, Waves } from 'lucide-react';

export function InitialUnlockSplash({ 
    isAudioUnlocked, 
    onUnlock, 
    onDirectMuseum, 
    onDirectSoundLab, 
    tilt = { x: 0, y: 0 }, 
    tiltX = 0, 
    tiltY = 0, 
    ghostOffsetX = 0, 
    ghostOffsetY = 0 
}) {
    // Staggered Unblur Stages:
    // Stage 1 (3.5s): LET'S GO unblurs with 3D RGB Chromatic Glitch Parallax
    // Stage 2 (4.0s): Diverse 3D Debris unblurs into floating cosmos
    // Stage 3 (4.8s): Bottom Navigation Buttons unblur separately
    const [unblurStage, setUnblurStage] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setUnblurStage(1), 3500); // 3.5s: LET'S GO
        const t2 = setTimeout(() => setUnblurStage(2), 4000); // 4.0s: Debris
        const t3 = setTimeout(() => setUnblurStage(3), 4800); // 4.8s: Action Buttons

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    if (isAudioUnlocked) return null;

    // Dynamic Gyro Glitch Magnitude
    const glitchIntensity = Math.min(0.85, Math.abs(tilt.x) + Math.abs(tilt.y) + 0.25);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={onUnlock}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-black/88 cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '900px',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Ambient Lighting Vignette */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />

            <AnimatePresence>
                {unblurStage >= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* 1. Diverse Floating 3D Debris (Unblurs in Stage 2 at 4.0s) */}
                        {unblurStage >= 2 && (
                            <motion.div 
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 1.0, ease: 'easeOut' }}
                                className="absolute inset-0 pointer-events-none overflow-hidden z-0" 
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {ATELIER_DEBRIS_100.map((item) => {
                                    const tiltXVal = tilt.x * 24 * item.tiltMult;
                                    const tiltYVal = tilt.y * 24 * item.tiltMult;
                                    const startY = item.isLarge ? '85vh' : '108vh';
                                    const endY = item.isLarge ? '10vh' : '-28vh';

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{
                                                y: startY,
                                                x: 0,
                                                opacity: 0,
                                                scale: 0.6,
                                                rotate: item.rotation
                                            }}
                                            animate={{
                                                y: [startY, endY],
                                                x: [0, item.pullXPx],
                                                opacity: [0, item.opacityMax, 0],
                                                scale: [0.6, 1.15, 0.5],
                                                rotate: [item.rotation, item.rotation * -0.5, item.rotation]
                                            }}
                                            transition={{
                                                duration: item.duration,
                                                repeat: Infinity,
                                                delay: item.delay,
                                                ease: 'easeInOut'
                                            }}
                                            style={{
                                                left: item.left,
                                                top: 0,
                                                transform: `translate3d(${tiltXVal}px, ${tiltYVal}px, ${item.zDepth}px)`
                                            }}
                                            className="absolute select-none flex items-center justify-center pointer-events-none"
                                        >
                                            <div 
                                                className={item.styleClass}
                                                style={{ color: item.color }}
                                            >
                                                {item.text}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* 2. Central 3D Gyro Rigid Body Container for LET'S GO */}
                        <div
                            style={{
                                transform: `perspective(900px) rotateX(${-tiltY * 0.4}deg) rotateY(${tiltX * 0.4}deg) translate3d(${ghostOffsetX * 0.32}px, ${ghostOffsetY * 0.32}px, 20px)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            }}
                            className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                        >
                            {/* LET'S GO Unblurs at Stage 1 (3.5s) */}
                            <motion.div
                                initial={{ opacity: 0, filter: 'blur(14px)', scale: 0.9 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1.0 }}
                                transition={{ duration: 0.85, ease: 'easeOut' }}
                                className="relative flex flex-col items-center text-center cursor-pointer select-none"
                            >
                                {/* Ambient Warm Glow Halo */}
                                <div 
                                    className="absolute inset-0 bg-[#E7FF00]/25 filter blur-3xl rounded-full scale-150 pointer-events-none"
                                    style={{
                                        transform: `translate3d(${ghostOffsetX * -0.6}px, ${ghostOffsetY * -0.6}px, -25px)`
                                    }}
                                />

                                {/* 🔴 RGB Chromatic Glitch Layer 1: Red/Magenta Parallax Shift */}
                                <div 
                                    style={{
                                        transform: `translate3d(${ghostOffsetX * 0.65}px, ${ghostOffsetY * 0.65}px, -12px)`,
                                        opacity: glitchIntensity
                                    }}
                                    className="absolute inset-0 font-mono font-black text-5xl sm:text-6xl text-[#FF0055] filter blur-[0.6px] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64 pointer-events-none"
                                >
                                    <span>L</span><span>E</span><span>T</span>
                                    <span></span><span className="text-4xl sm:text-5xl">'</span><span>S</span>
                                    <span></span><span>G</span><span>O</span>
                                    <span></span><span></span><span className="text-4xl sm:text-5xl font-black">!</span>
                                </div>

                                {/* 🔵 RGB Chromatic Glitch Layer 2: Cyan/Blue Parallax Shift */}
                                <div 
                                    style={{
                                        transform: `translate3d(${-ghostOffsetX * 0.65}px, ${-ghostOffsetY * 0.65}px, -12px)`,
                                        opacity: glitchIntensity
                                    }}
                                    className="absolute inset-0 font-mono font-black text-5xl sm:text-6xl text-[#00F0FF] filter blur-[0.6px] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64 pointer-events-none"
                                >
                                    <span>L</span><span>E</span><span>T</span>
                                    <span></span><span className="text-4xl sm:text-5xl">'</span><span>S</span>
                                    <span></span><span>G</span><span>O</span>
                                    <span></span><span></span><span className="text-4xl sm:text-5xl font-black">!</span>
                                </div>

                                {/* 🟡 Main Sharp Neon Gold 3-Column Grid */}
                                <div className="relative font-mono font-black text-5xl sm:text-6xl text-[#E7FF00] drop-shadow-[0_0_35px_rgba(231,255,0,0.95)] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64">
                                    <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">L</span>
                                    <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">E</span>
                                    <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">T</span>
                                    <span></span>
                                    <span className="text-4xl sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">'</span>
                                    <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">S</span>
                                    <span></span>
                                    <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">G</span>
                                    <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">O</span>
                                    <span></span>
                                    <span></span>
                                    <span className="text-4xl sm:text-5xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">!</span>
                                </div>

                                <div className="mt-4 font-mono text-[10px] sm:text-xs text-white/70 tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] animate-pulse">
                                    TOUCH SCREEN TO WALK FROM 02:00 AM
                                </div>
                            </motion.div>

                            {/* 3. Bottom Action Portals (Unblurs separately in Stage 3 at 4.8s) */}
                            {unblurStage >= 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, filter: 'blur(10px)', y: 22 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    onClick={(e) => e.stopPropagation()}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    className="mt-7 flex flex-col sm:flex-row items-center gap-3.5 z-40 pointer-events-auto w-full max-w-md px-2"
                                >
                                    {/* Button 1: Direct Museum Hub */}
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onDirectMuseum) onDirectMuseum();
                                        }}
                                        className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#181512] to-[#25201A] hover:from-[#25201A] hover:to-[#352D24] border-2 border-[#E7FF00]/50 hover:border-[#E7FF00] text-white font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(231,255,0,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Compass className="w-4 h-4 text-[#E7FF00]" />
                                        <span>🏛️ ATELIER MUSEUM ➔</span>
                                    </motion.button>

                                    {/* Button 2: Direct 3D Sound Lab */}
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onDirectSoundLab) onDirectSoundLab();
                                        }}
                                        className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(231,255,0,0.85)] hover:shadow-[0_0_40px_rgba(255,255,255,0.9)] flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Waves className="w-4 h-4" />
                                        <span>🎧 3D SOUND LAB ➔</span>
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
