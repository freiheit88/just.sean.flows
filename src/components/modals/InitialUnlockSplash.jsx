import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredVipProfile } from './InstagramVipAuthModal';
import { unlockTitle } from '../../constants/titles';
import { GoldEmblem3DCanvas } from '../common/GoldEmblem3DCanvas';

export function InitialUnlockSplash({ 
    isAudioUnlocked, 
    onUnlock, 
    onDirectMuseum, 
    tilt = { x: 0, y: 0 }, 
    tiltX = 0, 
    tiltY = 0, 
    ghostOffsetX = 0, 
    ghostOffsetY = 0 
}) {
    const [cardUnblurStage, setCardUnblurStage] = useState(false);
    const [vipProfile, setVipProfile] = useState(null);
    const [isCardHovered, setIsCardHovered] = useState(false);

    // 1. Shake trigger locked during first 3.5s
    const [canShakeTrigger, setCanShakeTrigger] = useState(false);
    const [isQuestUnlocked, setIsQuestUnlocked] = useState(false);

    // 2. Gyro Motion Resonance Growth: +3.5% scale per stage (Max 5 stages, purely visual growth)
    const [growthStage, setGrowthStage] = useState(0);
    const growthStageRef = useRef(0);
    growthStageRef.current = growthStage;

    const activeMotionTimeRef = useRef(0);

    // Continuous Organic Idle Ambient Sway Physics (Calibrated 1/3)
    const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
    const animFrameRef = useRef(null);

    useEffect(() => {
        const stored = getStoredVipProfile();
        if (stored) setVipProfile(stored);

        // First 3.5s shake lock (Wait until main card finishes opening)
        const tLock = setTimeout(() => {
            setCanShakeTrigger(true);
        }, 3500);

        // 3.5s: Main Logo Card unblurs over 1.5s
        const tCard = setTimeout(() => {
            setCardUnblurStage(true);
        }, 3500);

        // Mobile Device Shake Sensor (devicemotion) - 0.5s sliding window
        let mobileSpikeTimestamps = [];
        let lastAcc = { x: 0, y: 0, z: 0 };
        let lastMotionTime = Date.now();

        const handleMotion = (e) => {
            const acc = e.accelerationIncludingGravity || e.acceleration;
            if (!acc) return;
            const now = Date.now();
            const dt = Math.max(16, now - lastMotionTime);
            lastMotionTime = now;

            const deltaX = Math.abs((acc.x || 0) - lastAcc.x);
            const deltaY = Math.abs((acc.y || 0) - lastAcc.y);
            const deltaZ = Math.abs((acc.z || 0) - lastAcc.z);
            const instantSpeed = (deltaX + deltaY + deltaZ) / dt * 10000;

            if (instantSpeed > 220) {
                accumulateMotionProgress(dt);
            }

            if (canShakeTrigger && instantSpeed > 600) {
                mobileSpikeTimestamps.push(now);
                mobileSpikeTimestamps = mobileSpikeTimestamps.filter(t => (now - t) <= 400);
                if (mobileSpikeTimestamps.length >= 4) {
                    triggerShortcutUnlock();
                    mobileSpikeTimestamps = [];
                }
            }

            lastAcc = { x: acc.x || 0, y: acc.y || 0, z: acc.z || 0 };
        };

        // Desktop Mouse 500ms Shake Detection
        let mouseReversalTimestamps = [];
        let lastMouseX = 0;
        let lastDir = 0;
        let lastMouseMoveTime = Date.now();

        const handleMouseMove = (e) => {
            const now = Date.now();
            const dx = e.clientX - lastMouseX;
            const dt = Math.max(16, now - lastMouseMoveTime);
            lastMouseMoveTime = now;
            const mouseSpeed = Math.abs(dx) / dt;

            if (mouseSpeed > 0.8) {
                accumulateMotionProgress(dt);
            }

            const currentDir = dx > 0 ? 1 : dx < 0 ? -1 : 0;
            if (currentDir !== 0 && currentDir !== lastDir && Math.abs(dx) > 15) {
                lastDir = currentDir;
                if (canShakeTrigger) {
                    mouseReversalTimestamps.push(now);
                    mouseReversalTimestamps = mouseReversalTimestamps.filter(t => (now - t) <= 500);
                    if (mouseReversalTimestamps.length >= 5) {
                        triggerShortcutUnlock();
                        mouseReversalTimestamps = [];
                    }
                }
            }
            lastMouseX = e.clientX;
        };

        window.addEventListener('devicemotion', handleMotion);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(tLock);
            clearTimeout(tCard);
            window.removeEventListener('devicemotion', handleMotion);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [canShakeTrigger]);

    // Motion Resonance Growth (Pure Visual Scaling)
    const accumulateMotionProgress = (dtMs) => {
        if (growthStageRef.current >= 5) return;
        activeMotionTimeRef.current += dtMs;
        const newStage = Math.min(5, Math.floor(activeMotionTimeRef.current / 1000));
        if (newStage > growthStageRef.current) {
            setGrowthStage(newStage);
        }
    };

    // Shortcut Unlock Trigger
    const triggerShortcutUnlock = () => {
        if (isQuestUnlocked) return;
        setIsQuestUnlocked(true);
        if (typeof unlockTitle === 'function') {
            unlockTitle('shortcut_master');
        }
    };

    // Continuous Idle Ambient Sway Loop (1/3 Amplitude)
    useEffect(() => {
        let startTime = Date.now();
        const loop = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const x = Math.sin(elapsed * 0.9) * 1.5 + Math.cos(elapsed * 0.45) * 0.8;
            const y = Math.cos(elapsed * 0.75) * 1.2 + Math.sin(elapsed * 0.35) * 0.6;
            const rotX = Math.sin(elapsed * 0.6) * 0.6;
            const rotY = Math.cos(elapsed * 0.7) * 0.8;

            setIdleOffset({ x, y, rotX, rotY });
            animFrameRef.current = requestAnimationFrame(loop);
        };
        animFrameRef.current = requestAnimationFrame(loop);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // 3D Parallax Calculation for the Card
    const targetRotX = (-tiltY * 1.6) + idleOffset.rotX;
    const targetRotY = (tiltX * 1.6) + idleOffset.rotY;
    const targetTransX = (tiltX * 1.8) + ghostOffsetX * 0.35 + idleOffset.x;
    const targetTransY = (tiltY * 1.8) + ghostOffsetY * 0.35 + idleOffset.y;

    const currentCardScale = 1.0 + (growthStage * 0.035);

    return (
        <AnimatePresence>
            {!isAudioUnlocked && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0, 
                        scale: 1.12, 
                        filter: "blur(18px)",
                        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                >
                    {/* Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-[#050507]/60 pointer-events-none" />

                    {/* Borderless Floating Toast Notification in Upper-Right */}
                    <AnimatePresence>
                        {isQuestUnlocked && (
                            <motion.div
                                initial={{ opacity: 0, y: 18, x: 0 }}
                                animate={{ 
                                    opacity: [0, 1, 1, 0], 
                                    y: [18, 0, -4, -28] 
                                }}
                                transition={{ 
                                    duration: 1.5, 
                                    times: [0, 0.18, 0.7, 1.0],
                                    ease: "easeOut" 
                                }}
                                className="fixed top-[18%] sm:top-[20%] right-[6%] sm:right-[12%] z-[9999] pointer-events-none flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black text-[#E7FF00] drop-shadow-[0_0_15px_rgba(231,255,0,0.9)] tracking-wider uppercase select-none"
                            >
                                <span className="text-sm">🗝️</span>
                                <span>+ SHORTCUT UNLOCKED!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Central 3D Container with Clean Luxury Staging */}
                    <div
                        style={{
                            transform: `perspective(1200px) rotateX(${targetRotX}deg) rotateY(${targetRotY}deg) translate3d(${targetTransX}px, ${targetTransY}px, 15px)`,
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                    >
                        {/* VIP Recognition Badge */}
                        {vipProfile && cardUnblurStage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="mb-3 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#E7FF00]/50 shadow-[0_0_25px_rgba(231,255,0,0.5)] flex items-center gap-2.5 z-30"
                            >
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#E7FF00]">
                                    <img src={vipProfile.avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${vipProfile.instagramId}`; }} />
                                </div>
                                <span className="font-mono text-[10px] font-black text-[#E7FF00] tracking-wider uppercase">
                                    ⚜️ WELCOME BACK, @{vipProfile.instagramId} (VIP #{vipProfile.memberNumber})
                                </span>
                            </motion.div>
                        )}

                        {/* MAIN MASTER PHOTO CARD: Seamless Bordeaux Velvet + 3D Gold WebGL Emblem */}
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(22px)', scale: 0.92, y: 20 }}
                            animate={{ 
                                opacity: cardUnblurStage ? 1 : 0, 
                                filter: cardUnblurStage ? 'blur(0px)' : 'blur(22px)',
                                scale: cardUnblurStage ? currentCardScale : 0.92,
                                y: cardUnblurStage ? 0 : 20
                            }}
                            transition={{ 
                                scale: { type: "spring", stiffness: 200, damping: 18 },
                                filter: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                            }}
                            onMouseEnter={() => setIsCardHovered(true)}
                            onMouseLeave={() => setIsCardHovered(false)}
                            whileHover={{ scale: currentCardScale * 1.015 }}
                            whileTap={{ scale: currentCardScale * 0.98 }}
                            onClick={onUnlock}
                            style={{
                                transformStyle: 'preserve-3d'
                            }}
                            className="relative rounded-[32px] border-2 border-[#C8A96E]/85 shadow-[0_25px_70px_rgba(0,0,0,0.98),0_0_40px_rgba(200,169,110,0.35)] p-6 sm:p-7 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 w-[290px] sm:w-[330px] aspect-[4/5] group cursor-pointer pointer-events-auto z-10"
                        >
                            {/* Layer 1: Clean Seamless Bordeaux Velvet Canvas Background */}
                            <div className="absolute inset-0 w-full h-full rounded-[30px] overflow-hidden">
                                <img 
                                    src="/assets/logo/jsf_card_velvet_pure.jpg" 
                                    alt="Bordeaux Velvet Card Canvas" 
                                    className="w-full h-full object-cover select-none"
                                />
                                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {/* Layer 2: REAL THREE.JS WEBGL 3D GOLD EMBLEM (TOP-DOWN LIGHTING & PERFECTLY CENTERED) */}
                            <div className="relative z-20 w-[140px] sm:w-[160px] aspect-[3/4] flex items-center justify-center my-auto pointer-events-none select-none">
                                <div className="absolute inset-0 bg-[#FFD700]/15 rounded-full blur-2xl pointer-events-none scale-110" />
                                
                                <GoldEmblem3DCanvas 
                                    tiltX={tiltX} 
                                    tiltY={tiltY} 
                                    isHovered={isCardHovered}
                                />
                            </div>

                            {/* Layer 3: [ 🏛️ | ENTER ATELIER ] Button (Appears on Shortcut Unlock) */}
                            <AnimatePresence>
                                {isQuestUnlocked && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1.0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (onDirectMuseum) onDirectMuseum();
                                        }}
                                        className="w-full relative z-30 mt-auto pointer-events-auto"
                                    >
                                        <button 
                                            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#AA771C] text-black font-mono text-[11px] font-black tracking-widest uppercase shadow-[0_0_25px_rgba(255,215,0,0.8)] border border-white/60 flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                                        >
                                            <span>🏛️</span>
                                            <span>| ENTER ATELIER</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
