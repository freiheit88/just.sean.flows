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
    // Progressive Staggered Unblur Stages starting at 3.5s
    const [unblurStage, setUnblurStage] = useState(0);

    useEffect(() => {
        // Stage 1 at 3.5s: LET'S GO unblurs into crisp focus
        const t1 = setTimeout(() => setUnblurStage(1), 3500);

        // Stage 2 at 3.9s: Debris particles unblur
        const t2 = setTimeout(() => setUnblurStage(2), 3900);

        // Stage 3 at 4.3s: Direct action buttons slide up and unblur
        const t3 = setTimeout(() => setUnblurStage(3), 4300);

        // Stage 4 at 4.7s: Touch to walk guide unblurs
        const t4 = setTimeout(() => setUnblurStage(4), 4700);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    if (isAudioUnlocked) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={onUnlock}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-black/88 cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '800px',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

            <AnimatePresence>
                {unblurStage >= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* 1. Element: 3D Floating Debris Particles (Unblurs in Stage 2) */}
                        {unblurStage >= 2 && (
                            <motion.div 
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                                className="absolute inset-0 pointer-events-none overflow-hidden z-0" 
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {ATELIER_DEBRIS_100.map((item) => {
                                    const tiltXVal = tilt.x * 22 * item.tiltMult;
                                    const tiltYVal = tilt.y * 22 * item.tiltMult;
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
                                                className={`${item.fontFamily} ${item.sizeClass} tracking-wider`}
                                                style={{ color: item.color }}
                                            >
                                                {item.text}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* 2. Element: Central Sharp Neon Gold LET'S GO ! (Unblurs in Stage 1) */}
                        <div
                            style={{
                                transform: `perspective(800px) rotateX(${-tiltY * 0.35}deg) rotateY(${tiltX * 0.35}deg) translate3d(${ghostOffsetX * 0.28}px, ${ghostOffsetY * 0.28}px, 20px)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            }}
                            className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.92 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1.0 }}
                                transition={{ duration: 0.85, ease: 'easeOut' }}
                                className="relative flex flex-col items-center text-center cursor-pointer select-none"
                            >
                                {/* Ambient Warm Glow Halo */}
                                <div 
                                    className="absolute inset-0 bg-[#E7FF00]/25 filter blur-2xl rounded-full scale-150 pointer-events-none"
                                    style={{
                                        transform: `translate3d(${ghostOffsetX * -0.6}px, ${ghostOffsetY * -0.6}px, -25px)`
                                    }}
                                />

                                {/* Main Ultra-Crisp Sharp Neon Gold 3-Column Grid (Zero Smudge) */}
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
                            </motion.div>

                            {/* 3. Element: Touch to Walk Hint (Unblurs in Stage 4) */}
                            {unblurStage >= 4 && (
                                <motion.div 
                                    initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="mt-4 font-mono text-[10px] sm:text-xs text-white/70 tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] animate-pulse"
                                >
                                    TOUCH SCREEN TO WALK FROM 02:00 AM
                                </motion.div>
                            )}

                            {/* 4. Element: Direct Entry Action Portals (Unblurs in Stage 3) */}
                            {unblurStage >= 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, filter: 'blur(10px)', y: 22 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.75, ease: 'easeOut' }}
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
