import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { Compass, Sparkles, Waves, Crown, Play, Volume2, Footprints } from 'lucide-react';
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
    const [unblurStage, setUnblurStage] = useState(0);
    const [vipProfile, setVipProfile] = useState(null);

    // Continuous Organic Idle Ambient Sway Physics
    const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
    const animFrameRef = useRef(null);

    useEffect(() => {
        const stored = getStoredVipProfile();
        if (stored) setVipProfile(stored);

        const t1 = setTimeout(() => setUnblurStage(1), 1000); // 1.0s Card Emerges
        const t2 = setTimeout(() => setUnblurStage(2), 1600); // 1.6s Ambient Debris

        let startTime = Date.now();
        const loop = () => {
            const time = (Date.now() - startTime) * 0.001;
            const ix = Math.sin(time * 0.8) * 6 + Math.sin(time * 1.5) * 3;
            const iy = Math.cos(time * 0.6) * 5 + Math.cos(time * 1.2) * 2;
            const iRotX = Math.sin(time * 0.5) * 2.5;
            const iRotY = Math.cos(time * 0.7) * 2.5;

            setIdleOffset({ x: ix, y: iy, rotX: iRotX, rotY: iRotY });
            animFrameRef.current = requestAnimationFrame(loop);
        };
        animFrameRef.current = requestAnimationFrame(loop);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    if (isAudioUnlocked) return null;

    // Inverted Gyro + Organic Idle Floating Physics
    const targetRotX = (tiltY * 0.35) + idleOffset.rotX;
    const targetRotY = (-tiltX * 0.35) + idleOffset.rotY;
    const targetTransX = (-ghostOffsetX * 0.35) + idleOffset.x;
    const targetTransY = (-ghostOffsetY * 0.35) + idleOffset.y;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={onUnlock}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-[#060405] cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Rich Bordeaux Velvet Vignette Background */}
            <div 
                className="absolute inset-0 pointer-events-none z-0 opacity-80"
                style={{
                    background: 'radial-gradient(circle at center, #52111E 0%, #29080E 50%, #060405 100%)'
                }}
            />

            <AnimatePresence>
                {unblurStage >= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* 1. Soft Ambient Background Debris with 3X Super-Large Music Emojis */}
                        {unblurStage >= 2 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.50 }}
                                transition={{ duration: 1.4, ease: 'easeOut' }}
                                className="absolute inset-0 pointer-events-none overflow-hidden z-0" 
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {ATELIER_DEBRIS_100.map((item) => {
                                    const tiltXVal = -tilt.x * 18 * item.tiltMult + idleOffset.x * 0.4;
                                    const tiltYVal = -tilt.y * 18 * item.tiltMult + idleOffset.y * 0.4;
                                    const startY = item.isSuperLargeEmoji ? '95vh' : '110vh';
                                    const endY = item.isSuperLargeEmoji ? '-15vh' : '-30vh';

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{
                                                y: startY,
                                                x: 0,
                                                opacity: 0,
                                                scale: item.scaleRange[0],
                                                rotate: item.rotation
                                            }}
                                            animate={{
                                                y: [startY, endY],
                                                x: [0, item.pullXPx * 0.6, -item.pullXPx * 0.4, item.pullXPx],
                                                opacity: [0, item.opacityMax, item.opacityMax * 0.85, item.opacityMax * 0.3, 0],
                                                scale: [item.scaleRange[0], item.scaleRange[1], item.scaleRange[2]],
                                                rotate: [item.rotation, item.rotation + 25, item.rotation - 15, item.rotation]
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

                        {/* 2. Central 3D Container: The Master Card IS the Walk Button */}
                        <div
                            style={{
                                transform: `perspective(1000px) rotateX(${targetRotX}deg) rotateY(${targetRotY}deg) translate3d(${targetTransX}px, ${targetTransY}px, 20px)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.1s linear'
                            }}
                            className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                        >
                            {/* VIP Recognition Badge */}
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

                            {/* 1:1 Translucent Frosted Glass Card: The entire box is the Walk Button */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 25 }}
                                animate={{ opacity: 1, scale: 1.0, y: 0 }}
                                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onUnlock}
                                className="relative rounded-[28px] bg-black/40 backdrop-blur-md border-2 border-[#C8A96E]/80 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(200,169,110,0.3)] p-5 sm:p-7 flex flex-col items-center overflow-hidden transition-all duration-300 w-72 sm:w-84 group cursor-pointer pointer-events-auto"
                            >
                                {/* Top Specular Light Glint */}
                                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-[28px] pointer-events-none" />

                                {/* 1. Header Bar with Gold Status */}
                                <div className="w-full flex items-center justify-between pb-3 border-b border-[#C8A96E]/35 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_10px_#E7FF00] animate-pulse" />
                                        <span className="font-mono text-[10px] sm:text-[11px] font-black text-white tracking-[0.2em] uppercase">
                                            JUST SEAN FLOWS
                                        </span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-[#C8A96E]/20 border border-[#C8A96E]/50 font-mono text-[8px] font-black text-[#E7FF00] tracking-widest uppercase">
                                        432Hz ATELIER
                                    </span>
                                </div>

                                {/* 2. THE EXACT HIGH-RES OFFICIAL LOGO EMBLEM */}
                                <div className="my-5 w-full flex flex-col items-center justify-center relative z-10">
                                    <motion.div 
                                        animate={{
                                            filter: [
                                                "drop-shadow(0 0 15px rgba(247,235,225,0.4))",
                                                "drop-shadow(0 0 30px rgba(231,255,0,0.7))",
                                                "drop-shadow(0 0 15px rgba(247,235,225,0.4))"
                                            ]
                                        }}
                                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                        className="w-32 sm:w-40 aspect-square flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
                                    >
                                        <img 
                                            src="/assets/logo/jsf_official_logo.jpg" 
                                            alt="Just Sean Flows Official Emblem" 
                                            className="w-full h-full object-cover select-none"
                                        />
                                    </motion.div>
                                </div>

                                {/* 3. Enter Atelier Direct Action Button inside the card */}
                                <div className="w-full relative z-20">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onDirectMuseum) onDirectMuseum();
                                        }}
                                        className="w-full py-2.5 px-4 rounded-full bg-black/75 hover:bg-[#E7FF00] text-white hover:text-black border-2 border-[#C8A96E]/70 hover:border-[#E7FF00] shadow-[0_0_20px_rgba(200,169,110,0.3)] hover:shadow-[0_0_25px_#E7FF00] flex items-center justify-center gap-2 transition-all cursor-pointer font-mono text-xs sm:text-sm font-black tracking-widest uppercase group/btn"
                                    >
                                        <Compass className="w-4 h-4 text-[#E7FF00] group-hover/btn:text-black" />
                                        <span>ENTER ATELIER ➔</span>
                                    </motion.button>
                                </div>

                                <span className="font-mono text-[9px] text-neutral-400 mt-3 tracking-widest uppercase block relative z-10">
                                    TAP CARD TO WALK // 02:00 AM
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
