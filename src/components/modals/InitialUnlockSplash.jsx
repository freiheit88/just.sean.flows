import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { Compass, Sparkles, Crown, Play, ArrowRight } from 'lucide-react';
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

        const t1 = setTimeout(() => setUnblurStage(1), 800);  // 0.8s Card Emerges
        const t2 = setTimeout(() => setUnblurStage(2), 1400); // 1.4s Ambient Debris

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
                className="absolute inset-0 pointer-events-none z-0 opacity-85"
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
                        {/* 1. Soft Ambient Background Debris (22 Curated 60FPS Particles) */}
                        {unblurStage >= 2 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.45 }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className="absolute inset-0 pointer-events-none overflow-hidden z-0" 
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {ATELIER_DEBRIS_100.map((item) => {
                                    const tiltXVal = -tilt.x * 12 * item.tiltMult + idleOffset.x * 0.3;
                                    const tiltYVal = -tilt.y * 12 * item.tiltMult + idleOffset.y * 0.3;
                                    const startY = '105vh';
                                    const endY = '-25vh';

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
                                                x: [0, item.pullXPx, 0],
                                                opacity: [0, item.opacityMax, item.opacityMax * 0.8, 0],
                                                scale: [item.scaleRange[0], item.scaleRange[1], item.scaleRange[2]],
                                                rotate: [item.rotation, item.rotation + 15, item.rotation]
                                            }}
                                            transition={{
                                                duration: item.duration,
                                                repeat: Infinity,
                                                delay: item.delay,
                                                ease: 'linear'
                                            }}
                                            style={{
                                                left: item.left,
                                                top: 0,
                                                transform: `translate3d(${tiltXVal}px, ${tiltYVal}px, ${item.zDepth}px)`,
                                                willChange: 'transform, opacity'
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

                        {/* 2. Central Pure Glass Card: Official Logo Emblem & Remastered Button */}
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

                            {/* Clean 1:1 Translucent Frosted Glass Card: NO cluttered text, just Pure Official Logo & Remastered Button */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 25 }}
                                animate={{ opacity: 1, scale: 1.0, y: 0 }}
                                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onUnlock}
                                className="relative rounded-[30px] bg-black/40 backdrop-blur-md border-2 border-[#C8A96E]/80 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(200,169,110,0.35)] p-6 sm:p-8 flex flex-col items-center overflow-hidden transition-all duration-300 w-72 sm:w-84 group cursor-pointer pointer-events-auto"
                            >
                                {/* Top Specular Light Glint */}
                                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-[30px] pointer-events-none" />

                                {/* 1. THE EXACT HIGH-RES OFFICIAL MASTER LOGO */}
                                <div className="w-full flex flex-col items-center justify-center relative z-10 py-2">
                                    <motion.div 
                                        animate={{
                                            filter: [
                                                "drop-shadow(0 0 15px rgba(247,235,225,0.4))",
                                                "drop-shadow(0 0 32px rgba(231,255,0,0.75))",
                                                "drop-shadow(0 0 15px rgba(247,235,225,0.4))"
                                            ]
                                        }}
                                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                        className="w-36 sm:w-44 aspect-square flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
                                    >
                                        <img 
                                            src="/assets/logo/jsf_official_logo.jpg" 
                                            alt="Just Sean Flows Official Emblem" 
                                            className="w-full h-full object-cover select-none"
                                        />
                                    </motion.div>
                                </div>

                                {/* 2. Remastered ENTER ATELIER Button inside the card (18K Gold Liquid Glass Shimmer) */}
                                <div className="w-full relative z-20 mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onDirectMuseum) onDirectMuseum();
                                        }}
                                        className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#1F1913] via-[#2A2218] to-[#1F1913] hover:from-[#E7FF00] hover:via-[#FFF2B2] hover:to-[#E7FF00] text-[#F7EBE1] hover:text-black border-2 border-[#C8A96E]/80 hover:border-[#E7FF00] shadow-[0_0_20px_rgba(200,169,110,0.35)] hover:shadow-[0_0_30px_rgba(231,255,0,0.85)] flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer font-mono text-xs sm:text-sm font-black tracking-widest uppercase group/btn"
                                    >
                                        <Compass className="w-4 h-4 text-[#E7FF00] group-hover/btn:text-black transition-colors" />
                                        <span>ENTER ATELIER</span>
                                        <ArrowRight className="w-4 h-4 text-[#C8A96E] group-hover/btn:text-black group-hover/btn:translate-x-1 transition-all" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
