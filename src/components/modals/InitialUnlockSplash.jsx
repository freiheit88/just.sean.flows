import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { Compass, Sparkles, Waves, Crown, CheckCircle2, Play, Volume2 } from 'lucide-react';
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
    const [isHovered, setIsHovered] = useState(false);

    // Continuous Organic Idle Ambient Sway Physics
    const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
    const animFrameRef = useRef(null);

    useEffect(() => {
        const stored = getStoredVipProfile();
        if (stored) setVipProfile(stored);

        const t1 = setTimeout(() => setUnblurStage(1), 1800); // Emblem emerges
        const t2 = setTimeout(() => setUnblurStage(2), 2600); // Ambient Debris
        const t3 = setTimeout(() => setUnblurStage(3), 3800); // Action Buttons

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
            clearTimeout(t3);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    if (isAudioUnlocked) return null;

    // INVERTED Gyro Physics + Organic Idle Floating Coordinates
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-[#070506] cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Rich Bordeaux Velvet Vignette Background */}
            <div 
                className="absolute inset-0 pointer-events-none z-0 opacity-80"
                style={{
                    background: 'radial-gradient(circle at center, #52111E 0%, #29080E 50%, #080305 100%)'
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
                        {/* 1. Soft Ambient Background Debris */}
                        {unblurStage >= 2 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.45 }}
                                transition={{ duration: 1.4, ease: 'easeOut' }}
                                className="absolute inset-0 pointer-events-none overflow-hidden z-0" 
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {ATELIER_DEBRIS_100.map((item) => {
                                    const tiltXVal = -tilt.x * 15 * item.tiltMult + idleOffset.x * 0.4;
                                    const tiltYVal = -tilt.y * 15 * item.tiltMult + idleOffset.y * 0.4;
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

                        {/* 2. Master Interactive Bordeaux Wine Glass + G-Clef Emblem Hero Button */}
                        <div
                            style={{
                                transform: `perspective(1000px) rotateX(${targetRotX}deg) rotateY(${targetRotY}deg) translate3d(${targetTransX}px, ${targetTransY}px, 20px)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.1s linear'
                            }}
                            className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                        >
                            {/* VIP Welcome Badge */}
                            {vipProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="mb-5 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border-2 border-[#E7FF00] shadow-[0_0_30px_rgba(231,255,0,0.6)] flex items-center gap-2.5"
                                >
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#E7FF00]">
                                        <img src={vipProfile.avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${vipProfile.instagramId}`; }} />
                                    </div>
                                    <span className="font-mono text-[10px] font-black text-[#E7FF00] tracking-wider uppercase">
                                        ⚜️ WELCOME BACK, @{vipProfile.instagramId} (VIP #{vipProfile.memberNumber})
                                    </span>
                                </motion.div>
                            )}

                            {/* Top Elegant Brand Wordmark */}
                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="flex flex-col items-center gap-1 mb-6 text-center"
                            >
                                <span className="font-mono text-[9px] sm:text-[10px] font-black text-[#F7EBE1]/70 tracking-[0.4em] uppercase">
                                    FRANKFURT AM MAIN • ATELIER
                                </span>
                                <h1 className="font-mono text-xl sm:text-2xl font-black text-[#F7EBE1] tracking-[0.25em] drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
                                    JUST SEAN FLOWS
                                </h1>
                            </motion.div>

                            {/* THE MASTER EMBLEM BUTTON (Vector Wine Glass + G-Clef + J.S.F) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                                animate={{ opacity: 1, scale: 1.0, y: 0 }}
                                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.96 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                                className="relative flex flex-col items-center cursor-pointer pointer-events-auto group p-6 rounded-[36px] bg-black/35 backdrop-blur-xl border border-[#F7EBE1]/25 hover:border-[#F7EBE1] shadow-[0_20px_80px_rgba(0,0,0,0.95)] hover:shadow-[0_0_60px_rgba(247,235,225,0.4)] transition-all duration-500"
                            >
                                {/* Radial Glow Behind Emblem */}
                                <div 
                                    className="absolute inset-0 rounded-[36px] bg-[#E7FF00]/10 filter blur-2xl pointer-events-none group-hover:bg-[#E7FF00]/25 transition-all duration-500"
                                />

                                {/* High-Precision Vector SVG: Bordeaux Glass + Fluid G-Clef Synthesis */}
                                <div className="w-28 sm:w-36 h-36 sm:h-48 relative flex items-center justify-center">
                                    <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                                        {/* Wine Glass Bowl Outline */}
                                        <path 
                                            d="M 68 30 L 132 30 C 145 70, 140 100, 100 115 C 60 100, 55 70, 68 30 Z" 
                                            fill="none" 
                                            stroke="#F7EBE1" 
                                            strokeWidth="7" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />

                                        {/* Dynamic Curved Wave of Pinot Noir Wine inside */}
                                        <motion.path 
                                            d="M 65 58 Q 88 74, 102 62 Q 118 50, 135 60 C 135 90, 65 90, 65 58 Z" 
                                            fill="#F7EBE1"
                                            animate={{
                                                d: isHovered 
                                                    ? "M 65 54 Q 85 64, 102 70 Q 120 74, 135 56 C 135 90, 65 90, 65 54 Z"
                                                    : "M 65 58 Q 88 74, 102 62 Q 118 50, 135 60 C 135 90, 65 90, 65 58 Z"
                                            }}
                                            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.2, ease: "easeInOut" }}
                                        />

                                        {/* Organic Flowing G-Clef Stem */}
                                        <path 
                                            d="M 100 115 C 72 135, 70 185, 102 185 C 130 185, 132 155, 108 145 C 84 135, 80 160, 95 168 M 100 78 L 100 215 C 100 236, 76 234, 82 216" 
                                            fill="none" 
                                            stroke="#F7EBE1" 
                                            strokeWidth="7" 
                                            strokeLinecap="round" 
                                        />

                                        {/* Terminus Dot */}
                                        <circle cx="82" cy="216" r="8" fill="#F7EBE1" />
                                    </svg>
                                </div>

                                {/* J · S · F Classical Roman Serif Lettering */}
                                <div className="mt-4 flex items-center justify-center gap-3 font-serif font-black text-2xl sm:text-3xl text-[#F7EBE1] tracking-[0.25em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                                    <span>J</span>
                                    <span className="text-sm sm:text-base text-[#C8A96E] font-sans">•</span>
                                    <span>S</span>
                                    <span className="text-sm sm:text-base text-[#C8A96E] font-sans">•</span>
                                    <span>F</span>
                                </div>

                                {/* Tap to Walk Live Indicator */}
                                <div className="mt-3 px-4 py-1 rounded-full bg-white/10 border border-white/15 flex items-center gap-2 group-hover:bg-[#E7FF00] group-hover:text-black group-hover:border-[#E7FF00] transition-all">
                                    <Play className="w-3 h-3 fill-current text-[#E7FF00] group-hover:text-black" />
                                    <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-200 group-hover:text-black">
                                        TAP EMBLEM TO ENTER (432Hz)
                                    </span>
                                </div>
                            </motion.div>

                            {/* 3. Bottom Direct Action Portals */}
                            {unblurStage >= 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, filter: 'blur(8px)', y: 25 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={(e) => e.stopPropagation()}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    className="mt-6 flex flex-col sm:flex-row items-center gap-3 z-40 pointer-events-auto w-full max-w-sm px-2"
                                >
                                    {/* Direct Museum Hub */}
                                    <motion.button
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onDirectMuseum) onDirectMuseum();
                                        }}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-black/60 hover:bg-black/90 border border-[#F7EBE1]/40 hover:border-[#E7FF00] text-[#F7EBE1] hover:text-[#E7FF00] font-mono text-xs font-black tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Compass className="w-3.5 h-3.5" />
                                        <span>🏛️ ATELIER HUB ➔</span>
                                    </motion.button>

                                    {/* Direct 3D Sound Lab */}
                                    <motion.button
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onDirectSoundLab) onDirectSoundLab();
                                        }}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(231,255,0,0.6)] flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Waves className="w-3.5 h-3.5" />
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
