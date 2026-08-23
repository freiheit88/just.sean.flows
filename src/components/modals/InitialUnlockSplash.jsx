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
    // Reveal Layer 2 (LET'S GO, 3D Debris, Action Buttons) precisely at 3.5 seconds
    const [showLayeredUI, setShowLayeredUI] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLayeredUI(true);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    if (isAudioUnlocked) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={onUnlock}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-black/92 cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '800px',
                transformStyle: 'preserve-3d'
            }}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-none z-10" />

            <AnimatePresence>
                {showLayeredUI && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* 3D Floating Background Debris with Gyro Parallax */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ transformStyle: 'preserve-3d' }}>
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
                        </div>

                        {/* Central 3D Gyro Rigid Body Container for LET'S GO */}
                        <div
                            style={{
                                transform: `perspective(800px) rotateX(${-tiltY * 0.35}deg) rotateY(${tiltX * 0.35}deg) translate3d(${ghostOffsetX * 0.28}px, ${ghostOffsetY * 0.28}px, 20px)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            }}
                            className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                        >
                            {/* Below-to-Above Smooth Rising Ascent Motion Loop */}
                            <motion.div
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                                className="relative flex flex-col items-center text-center cursor-pointer select-none"
                            >
                                {/* Ambient Warm Glow Halo */}
                                <div 
                                    className="absolute inset-0 bg-[#E7FF00]/20 filter blur-3xl rounded-full scale-150 pointer-events-none"
                                    style={{
                                        transform: `translate3d(${ghostOffsetX * -0.6}px, ${ghostOffsetY * -0.6}px, -25px)`
                                    }}
                                />

                                {/* Glitch Ghost Layer 1: Red/Magenta */}
                                <div 
                                    style={{
                                        transform: `translate3d(${ghostOffsetX * 0.45}px, ${ghostOffsetY * 0.45}px, -10px)`,
                                        opacity: Math.min(0.6, Math.abs(tilt.x) + Math.abs(tilt.y) + 0.15)
                                    }}
                                    className="absolute inset-0 font-mono font-black text-5xl sm:text-6xl text-[#FF0055] filter blur-[1px] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64 pointer-events-none"
                                >
                                    <span>L</span><span>E</span><span>T</span>
                                    <span></span><span className="text-4xl sm:text-5xl">'</span><span>S</span>
                                    <span></span><span>G</span><span>O</span>
                                    <span></span><span></span><span className="text-4xl sm:text-5xl font-black">!</span>
                                </div>

                                {/* Glitch Ghost Layer 2: Cyan/Blue */}
                                <div 
                                    style={{
                                        transform: `translate3d(${-ghostOffsetX * 0.45}px, ${-ghostOffsetY * 0.45}px, -10px)`,
                                        opacity: Math.min(0.6, Math.abs(tilt.x) + Math.abs(tilt.y) + 0.15)
                                    }}
                                    className="absolute inset-0 font-mono font-black text-5xl sm:text-6xl text-[#00F0FF] filter blur-[1px] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64 pointer-events-none"
                                >
                                    <span>L</span><span>E</span><span>T</span>
                                    <span></span><span className="text-4xl sm:text-5xl">'</span><span>S</span>
                                    <span></span><span>G</span><span>O</span>
                                    <span></span><span></span><span className="text-4xl sm:text-5xl font-black">!</span>
                                </div>

                                {/* Main Sharp Neon Gold 3-Column Grid */}
                                <div className="relative font-mono font-black text-5xl sm:text-6xl text-[#E7FF00] drop-shadow-[0_0_35px_rgba(231,255,0,0.9)] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64">
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

                                {/* Touch to Start Walk Hint */}
                                <div className="mt-4 font-mono text-[10px] sm:text-xs text-white/60 tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] animate-pulse">
                                    TOUCH SCREEN TO WALK FROM 02:00 AM
                                </div>
                            </motion.div>

                            {/* Direct Entry Shortcut Hub */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
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
                                    className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#181512] to-[#25201A] hover:from-[#25201A] hover:to-[#352D24] border-2 border-[#E7FF00]/50 hover:border-[#E7FF00] text-white font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(231,255,0,0.4)] flex items-center justify-center gap-2 cursor-pointer"
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
                                    className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(231,255,0,0.8)] hover:shadow-[0_0_40px_rgba(255,255,255,0.9)] flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Waves className="w-4 h-4" />
                                    <span>🎧 3D SOUND LAB ➔</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
