import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { Compass, Sparkles, Waves, Crown, CheckCircle2 } from 'lucide-react';
import { getStoredVipProfile } from './InstagramVipAuthModal';

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
    // Staggered Staging Timers:
    // Stage 1 (3.5s): LET'S GO smoothly rises from below with crisp neon gold
    // Stage 2 (4.0s): Background ambient debris emerges softly
    // Stage 3 (5.2s): Bottom navigation buttons slide up separately
    const [unblurStage, setUnblurStage] = useState(0);
    const [vipProfile, setVipProfile] = useState(null);

    // Continuous Organic Idle Ambient Sway Physics (Natural breathing motion when stationary)
    const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
    const animFrameRef = useRef(null);

    useEffect(() => {
        const stored = getStoredVipProfile();
        if (stored) setVipProfile(stored);

        const t1 = setTimeout(() => setUnblurStage(1), 3500); // 3.5s: LET'S GO rises
        const t2 = setTimeout(() => setUnblurStage(2), 4000); // 4.0s: Ambient Debris
        const t3 = setTimeout(() => setUnblurStage(3), 5200); // 5.2s: Action Buttons

        let startTime = Date.now();
        const loop = () => {
            const time = (Date.now() - startTime) * 0.001; // in seconds
            const ix = Math.sin(time * 0.8) * 8 + Math.sin(time * 1.5) * 4;
            const iy = Math.cos(time * 0.6) * 7 + Math.cos(time * 1.2) * 3;
            const iRotX = Math.sin(time * 0.5) * 3;
            const iRotY = Math.cos(time * 0.7) * 3;

            setIdleOffset({ x: ix, y: iy, rotX: iRotX, rotY: iRotY });
            animFrameRef.current = requestAnimationFrame(loop);
        };
        animFrameRef.current = requestAnimationFrame(loop);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    if (isAudioUnlocked) return null;

    // INVERTED Gyro Physics + Organic Idle Floating Coordinates
    const targetRotX = (tiltY * 0.45) + idleOffset.rotX;
    const targetRotY = (-tiltX * 0.45) + idleOffset.rotY;
    const targetTransX = (-ghostOffsetX * 0.4) + idleOffset.x;
    const targetTransY = (-ghostOffsetY * 0.4) + idleOffset.y;

    // Dynamic Glitch Spread (Tightly locked when stationary, expanding on movement)
    const gyroSpeed = Math.abs(tilt.x) + Math.abs(tilt.y);
    const glitchDist = 3 + gyroSpeed * 12;
    const glitchAlpha = Math.min(0.75, 0.2 + gyroSpeed * 0.6);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={onUnlock}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-black/90 cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
        >
            <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />

            <AnimatePresence>
                {unblurStage >= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* 1. Soft Ambient Background Debris (Emerges softly at 4.0s) */}
                        {unblurStage >= 2 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.65 }}
                                transition={{ duration: 1.4, ease: 'easeOut' }}
                                className="absolute inset-0 pointer-events-none overflow-hidden z-0" 
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {ATELIER_DEBRIS_100.map((item) => {
                                    const tiltXVal = -tilt.x * 20 * item.tiltMult + idleOffset.x * 0.5;
                                    const tiltYVal = -tilt.y * 20 * item.tiltMult + idleOffset.y * 0.5;
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
                                            className="absolute select-none flex items-center justify-center pointer-events-none filter blur-[0.5px]"
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

                        {/* 2. Central 3D Container with INVERTED Gyro + Organic Idle Floating Physics */}
                        <div
                            style={{
                                transform: `perspective(1000px) rotateX(${targetRotX}deg) rotateY(${targetRotY}deg) translate3d(${targetTransX}px, ${targetTransY}px, 20px)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.1s linear'
                            }}
                            className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                        >
                            {/* Persistent VIP Recognition Floating Badge when Member is authenticated */}
                            {vipProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="mb-4 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border-2 border-[#E7FF00] shadow-[0_0_30px_rgba(231,255,0,0.6)] flex items-center gap-2.5"
                                >
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#E7FF00]">
                                        <img src={vipProfile.avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${vipProfile.instagramId}`; }} />
                                    </div>
                                    <span className="font-mono text-[10px] font-black text-[#E7FF00] tracking-wider uppercase">
                                        ⚜️ WELCOME BACK, @{vipProfile.instagramId} (VIP #{vipProfile.memberNumber})
                                    </span>
                                </motion.div>
                            )}

                            {/* LET'S GO Smoothly Rises from Below with ZERO blur at 3.5s */}
                            <motion.div
                                initial={{ opacity: 0, y: 70, scale: 0.92 }}
                                animate={{ opacity: 1, y: 0, scale: 1.0 }}
                                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex flex-col items-center text-center cursor-pointer select-none"
                            >
                                {/* Ambient Warm Glow Halo */}
                                <div 
                                    className="absolute inset-0 bg-[#E7FF00]/25 filter blur-3xl rounded-full scale-150 pointer-events-none"
                                />

                                {/* 🔴 RGB Chromatic Glitch Layer 1: Red/Magenta (Inverted Parallax Shift) */}
                                <div 
                                    style={{
                                        transform: `translate3d(${-glitchDist}px, ${-glitchDist * 0.4}px, -10px)`,
                                        opacity: glitchAlpha
                                    }}
                                    className="absolute inset-0 font-mono font-black text-5xl sm:text-6xl text-[#FF0055] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64 pointer-events-none"
                                >
                                    <span>L</span><span>E</span><span>T</span>
                                    <span></span><span className="text-4xl sm:text-5xl">'</span><span>S</span>
                                    <span></span><span>G</span><span>O</span>
                                    <span></span><span></span><span className="text-4xl sm:text-5xl font-black">!</span>
                                </div>

                                {/* 🔵 RGB Chromatic Glitch Layer 2: Cyan/Blue (Inverted Parallax Shift) */}
                                <div 
                                    style={{
                                        transform: `translate3d(${glitchDist}px, ${glitchDist * 0.4}px, -10px)`,
                                        opacity: glitchAlpha
                                    }}
                                    className="absolute inset-0 font-mono font-black text-5xl sm:text-6xl text-[#00F0FF] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64 pointer-events-none"
                                >
                                    <span>L</span><span>E</span><span>T</span>
                                    <span></span><span className="text-4xl sm:text-5xl">'</span><span>S</span>
                                    <span></span><span>G</span><span>O</span>
                                    <span></span><span></span><span className="text-4xl sm:text-5xl font-black">!</span>
                                </div>

                                {/* 🟡 Main Razor-Sharp Ultra-Crisp Neon Gold Grid (Zero Blur) */}
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

                                <div className="mt-4 font-mono text-[10px] sm:text-xs text-white/80 tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] animate-pulse">
                                    TOUCH SCREEN TO WALK FROM 02:00 AM
                                </div>
                            </motion.div>

                            {/* 3. Bottom Action Portals (Unblurs & Slides Up separately at 5.2s) */}
                            {unblurStage >= 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, filter: 'blur(8px)', y: 35 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
