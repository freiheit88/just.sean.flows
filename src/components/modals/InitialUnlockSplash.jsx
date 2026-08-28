import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { getStoredVipProfile } from './InstagramVipAuthModal';
import { unlockTitle } from '../../constants/titles';

const RESONANCE_SCALES = [1.00, 1.03, 1.06, 1.09, 1.12, 1.15];

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
    const [debrisStage, setDebrisStage] = useState(false);
    const [vipProfile, setVipProfile] = useState(null);
    const [isQuestUnlocked, setIsQuestUnlocked] = useState(false);
    const [resonanceStage, setResonanceStage] = useState(0);
    // animPhase: 'idle' -> 'snapping' (0-0.8s) -> 'dissolving_card' (0.8-1.4s) -> 'emblem_pure' (1.4-2.8s) -> 'emblem_absorb' (2.8-4.2s) -> 'fade_out' (4.2s+)
    const [animPhase, setAnimPhase] = useState('idle');

    const canShakeTriggerRef = useRef(false);
    const lastStageTimeRef = useRef(0);
    const accumulatedMotionRef = useRef(0);
    const signatureAudioRef = useRef(null);

    // Initialize signature audio
    useEffect(() => {
        const audio = new Audio('/assets/sounds/signature-intro.mp3');
        audio.preload = 'auto';
        signatureAudioRef.current = audio;
    }, []);

    const handleCardClick = (e) => {
        if (animPhase !== 'idle') return;
        if (e) {
            e.stopPropagation();
        }

        // 1. Snapping (0.0s ~ 0.8s): Zero out tilt and slide out prompt text
        setAnimPhase('snapping');
        if (navigator.vibrate) {
            try { navigator.vibrate([20, 30]); } catch (err) {}
        }

        // 2. Dissolving Card (0.8s ~ 1.4s): Card borders & velvet texture smoothly dissolve
        setTimeout(() => {
            setAnimPhase('dissolving_card');

            // 3. Pure Emblem (1.4s ~ 2.8s): Isolated emblem in dark space with signature sound
            setTimeout(() => {
                setAnimPhase('emblem_pure');
                if (signatureAudioRef.current) {
                    try {
                        signatureAudioRef.current.currentTime = 0;
                        signatureAudioRef.current.play().catch(() => {});
                    } catch (err) {}
                }

                // 4. Emblem Absorb (2.8s ~ 4.2s): Dark salon emerges, emblem glides into TV screen
                setTimeout(() => {
                    setAnimPhase('emblem_absorb');

                    // 5. Seamless handoff to walk engine (4.2s)
                    setTimeout(() => {
                        setAnimPhase('fade_out');
                        setTimeout(() => {
                            if (onUnlock) onUnlock();
                        }, 300);
                    }, 1400);
                }, 1400);
            }, 600);
        }, 800);
    };

    // Continuous Organic Idle Ambient Sway Physics
    const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
    const animFrameRef = useRef(null);

    const triggerShortcutUnlock = () => {
        setIsQuestUnlocked(true);
        setResonanceStage(5);
        if (typeof unlockTitle === 'function') {
            unlockTitle('hidden_atelier_key');
        }
        if (navigator.vibrate) {
            try { navigator.vibrate([50, 40, 70]); } catch (e) {}
        }
    };

    useEffect(() => {
        const stored = getStoredVipProfile();
        if (stored) setVipProfile(stored);

        // Strict 3.0s (3000ms) initial shake lock
        const tLock = setTimeout(() => {
            canShakeTriggerRef.current = true;
        }, 3000);

        // 1.2s: Main Card Bubble emerges from inside the parent header bubble
        const tCard = setTimeout(() => {
            setCardUnblurStage(true);
        }, 1200);

        // 1.8s: Ambient Debris fades in
        const tDebris = setTimeout(() => {
            setDebrisStage(true);
        }, 1800);

        // Mobile Device Motion & Gyro Resonance Engine
        let mobileSpikeTimestamps = [];
        let lastAcc = { x: 0, y: 0, z: 0 };
        let lastMotionTime = Date.now();

        const handleMotion = (e) => {
            const acc = e.accelerationIncludingGravity || e.acceleration;
            if (!acc) return;

            const now = Date.now();
            lastMotionTime = now;

            const curX = acc.x || 0;
            const curY = acc.y || 0;
            const curZ = acc.z || 0;

            const deltaX = Math.abs(curX - lastAcc.x);
            const deltaY = Math.abs(curY - lastAcc.y);
            const deltaZ = Math.abs(curZ - lastAcc.z);
            const totalDelta = deltaX + deltaY + deltaZ;

            // 5-Stage Progressive Card Resonance Scaling with 0.5s Pause
            if (totalDelta > 1.4) {
                accumulatedMotionRef.current += totalDelta;
                if (accumulatedMotionRef.current > 18 && (now - lastStageTimeRef.current > 500)) {
                    lastStageTimeRef.current = now;
                    accumulatedMotionRef.current = 0;
                    setResonanceStage((prev) => Math.min(5, prev + 1));
                }
            }

            // High-speed 4-Shake in 0.4s (Only active AFTER 3.0s initial lock)
            if (canShakeTriggerRef.current && (totalDelta > 5.5 || deltaX > 3.8 || deltaY > 3.8)) {
                mobileSpikeTimestamps.push(now);
                // 0.4s (400ms) sliding window
                mobileSpikeTimestamps = mobileSpikeTimestamps.filter(t => (now - t) <= 400);

                if (mobileSpikeTimestamps.length >= 4) {
                    triggerShortcutUnlock();
                    mobileSpikeTimestamps = [];
                }
            }

            lastAcc = { x: curX, y: curY, z: curZ };
        };

        // Desktop Mouse Movement Resonance
        let mouseReversalTimestamps = [];
        let lastMouseX = 0;
        let lastDir = 0;

        const handleMouseMove = (e) => {
            const now = Date.now();
            const dx = e.clientX - lastMouseX;
            const currentDir = dx > 0 ? 1 : dx < 0 ? -1 : 0;
            const dist = Math.abs(dx);

            // Progressive Desktop Resonance
            if (dist > 8) {
                accumulatedMotionRef.current += dist;
                if (accumulatedMotionRef.current > 120 && (now - lastStageTimeRef.current > 500)) {
                    lastStageTimeRef.current = now;
                    accumulatedMotionRef.current = 0;
                    setResonanceStage((prev) => Math.min(5, prev + 1));
                }
            }

            // Rapid Mouse Shake Detection (Only active AFTER 3.0s initial lock)
            if (currentDir !== 0 && currentDir !== lastDir && dist > 14) {
                lastDir = currentDir;
                if (canShakeTriggerRef.current) {
                    mouseReversalTimestamps.push(now);
                    // 400ms sliding window
                    mouseReversalTimestamps = mouseReversalTimestamps.filter(t => (now - t) <= 400);

                    if (mouseReversalTimestamps.length >= 4) {
                        triggerShortcutUnlock();
                        mouseReversalTimestamps = [];
                    }
                }
            }
            lastMouseX = e.clientX;
        };

        window.addEventListener('devicemotion', handleMotion, true);
        window.addEventListener('mousemove', handleMouseMove);

        let startTime = Date.now();
        const loop = () => {
            const time = (Date.now() - startTime) * 0.001;
            const ix = Math.sin(time * 0.8) * 5 + Math.sin(time * 1.5) * 2.5;
            const iy = Math.cos(time * 0.6) * 4 + Math.cos(time * 1.2) * 2;
            const iRotX = Math.sin(time * 0.5) * 2.0;
            const iRotY = Math.cos(time * 0.7) * 2.0;

            setIdleOffset({ x: ix, y: iy, rotX: iRotX, rotY: iRotY });
            animFrameRef.current = requestAnimationFrame(loop);
        };
        animFrameRef.current = requestAnimationFrame(loop);

        return () => {
            clearTimeout(tLock);
            clearTimeout(tCard);
            clearTimeout(tDebris);
            window.removeEventListener('devicemotion', handleMotion, true);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    if (isAudioUnlocked) return null;

    // Organic Gyro + Idle Floating 3D Physics (Zeroed out during snapping/emblem_pure)
    const isLockedMotion = animPhase !== 'idle';
    const targetRotX = isLockedMotion ? 0 : ((-tiltY * 0.65) + idleOffset.rotX);
    const targetRotY = isLockedMotion ? 0 : ((tiltX * 0.65) + idleOffset.rotY);
    const targetTransX = isLockedMotion ? 0 : ((tiltX * 0.85) + idleOffset.x);
    const targetTransY = isLockedMotion ? 0 : ((tiltY * 0.85) + idleOffset.y);

    const currentScaleMultiplier = (animPhase === 'emblem_pure') 
        ? 1.12 
        : (animPhase === 'fade_out') 
        ? 1.28 
        : (RESONANCE_SCALES[resonanceStage] || 1.0);

    const isCardHidden = animPhase === 'emblem_pure' || animPhase === 'fade_out';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: animPhase === 'fade_out' ? 0 : 1 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleCardClick}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-[#060405] cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Rich Bordeaux Velvet Vignette Background - Fades to Pure Dark in emblem_pure */}
            <motion.div 
                animate={{
                    opacity: isCardHidden ? 0.15 : 0.90
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(circle at center, #480B1B 0%, #25060E 55%, #060405 100%)'
                }}
            />

            {/* Background Floating Particles - Fades out on click */}
            <motion.div 
                animate={{ opacity: isLockedMotion ? 0 : 0.4 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            >
                {debrisStage && ATELIER_DEBRIS_100.map((item) => {
                    const tiltXVal = isLockedMotion ? 0 : (-tilt.x * 12 * item.tiltMult + idleOffset.x * 0.3);
                    const tiltYVal = isLockedMotion ? 0 : (-tilt.y * 12 * item.tiltMult + idleOffset.y * 0.3);
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ y: '105vh', x: 0, opacity: 0, scale: item.scaleRange[0], rotate: item.rotation }}
                            animate={{
                                y: ['105vh', '-25vh'],
                                x: [0, item.pullXPx, 0],
                                opacity: [0, item.opacityMax, item.opacityMax * 0.8, 0],
                                scale: [item.scaleRange[0], item.scaleRange[1], item.scaleRange[2]],
                                rotate: [item.rotation, item.rotation + 15, item.rotation]
                            }}
                            transition={{ duration: item.duration, repeat: Infinity, delay: item.delay, ease: 'linear' }}
                            style={{
                                left: item.left,
                                top: 0,
                                transform: `translate3d(${tiltXVal}px, ${tiltYVal}px, ${item.zDepth}px)`,
                                willChange: 'transform, opacity'
                            }}
                            className="absolute select-none flex items-center justify-center pointer-events-none"
                        >
                            <div className={item.styleClass} style={{ color: item.color }}>{item.text}</div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Top-Right Shortcut Notification Toast */}
            <AnimatePresence>
                {isQuestUnlocked && !isLockedMotion && (
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: [0, 1, 1, 0], y: [18, 0, -4, -28] }}
                        transition={{ duration: 1.5, times: [0, 0.18, 0.7, 1.0], ease: "easeOut" }}
                        className="fixed top-[12%] sm:top-[14%] right-[6%] sm:right-[10%] z-[9999] pointer-events-none flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black text-[#E7FF00] drop-shadow-[0_0_15px_rgba(231,255,0,0.9)] tracking-wider uppercase select-none"
                    >
                        <span className="text-sm">🗝️</span>
                        <span>+ SHORTCUT UNLOCKED!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Central 3D Container with Parallax & Snap Physics */}
            <motion.div
                animate={{
                    rotateX: targetRotX,
                    rotateY: targetRotY,
                    x: targetTransX,
                    y: targetTransY
                }}
                transition={{
                    duration: isLockedMotion ? 1.5 : 0.25,
                    ease: isLockedMotion ? [0.16, 1, 0.3, 1] : "easeOut"
                }}
                style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                }}
                className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
            >
                {/* VIP Recognition Badge */}
                {vipProfile && !isLockedMotion && (
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

                {/* 1. V04 MASTER CARD LAYER (Staggered Dissolution on click) */}
                <motion.div
                    initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
                    animate={{ 
                        opacity: animPhase === 'idle' || animPhase === 'snapping' ? 1 : 0, 
                        filter: 'blur(0px)',
                        scale: animPhase === 'idle' 
                            ? currentScaleMultiplier 
                            : (animPhase === 'snapping' ? 1.0 : 1.04),
                        borderColor: animPhase === 'dissolving_card' || animPhase === 'emblem_pure' || animPhase === 'emblem_absorb' || animPhase === 'fade_out'
                            ? 'transparent'
                            : 'rgba(200, 169, 110, 0.8)',
                        backgroundColor: animPhase === 'dissolving_card' || animPhase === 'emblem_pure' || animPhase === 'emblem_absorb' || animPhase === 'fade_out'
                            ? 'transparent'
                            : 'rgba(37, 6, 14, 0.95)'
                    }}
                    transition={{
                        opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                        borderColor: { duration: 0.5, ease: "easeOut" },
                        backgroundColor: { duration: 0.6, ease: "easeOut" }
                    }}
                    whileHover={animPhase === 'idle' && !isLockedMotion ? { scale: currentScaleMultiplier * 1.03 } : {}}
                    whileTap={animPhase === 'idle' && !isLockedMotion ? { scale: currentScaleMultiplier * 0.97 } : {}}
                    onClick={handleCardClick}
                    className="relative rounded-[32px] border-2 border-[#C8A96E]/80 shadow-[0_25px_70px_rgba(0,0,0,0.98),0_0_40px_rgba(200,169,110,0.25)] p-6 sm:p-7 flex flex-col items-center justify-between overflow-hidden w-[290px] sm:w-[330px] aspect-[4/5] bg-gradient-to-b from-[#4A0D1D]/95 via-[#25060E]/95 to-[#0A0708]/98 backdrop-blur-2xl group cursor-pointer pointer-events-auto"
                >
                    {/* Top Delicate Specular Light Glint */}
                    <motion.div 
                        animate={{ opacity: animPhase === 'idle' || animPhase === 'snapping' ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none rounded-t-[30px]" 
                    />

                    {/* Top Spacer */}
                    <div className="w-full h-6" />

                    {/* Center 18K Gold Cutout Emblem inside Card */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                        <motion.div 
                            animate={{ opacity: animPhase === 'idle' || animPhase === 'snapping' ? 1 : 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-32 h-32 rounded-full bg-[#D4AF37]/15 blur-xl pointer-events-none" 
                        />
                        <motion.img
                            src="/assets/logo/jsf_emblem_transparent.png"
                            alt="Just Sean Flows 18K Gold Emblem"
                            animate={{
                                opacity: animPhase === 'idle' || animPhase === 'snapping' ? 1 : 0,
                                filter: [
                                    "drop-shadow(0 4px 16px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(212,175,55,0.4))",
                                    "drop-shadow(0 4px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 22px rgba(231,255,0,0.6))",
                                    "drop-shadow(0 4px 16px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(212,175,55,0.4))"
                                ]
                            }}
                            transition={{ 
                                opacity: { duration: 0.4 },
                                filter: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } 
                            }}
                            className="w-32 sm:w-36 object-contain pointer-events-none select-none drop-shadow-2xl"
                        />
                    </div>

                    {/* Bottom Action Area (Fades out first on click) */}
                    <motion.div 
                        animate={{ 
                            opacity: animPhase === 'idle' ? 1 : 0,
                            y: animPhase === 'idle' ? 0 : 8
                        }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="w-full relative z-30 min-h-[46px] flex items-center justify-center mt-auto"
                    >
                        <AnimatePresence mode="wait">
                            {isQuestUnlocked ? (
                                <motion.div
                                    key="atelier_btn"
                                    initial={{ opacity: 0, y: 15, scale: 0.92 }}
                                    animate={{ opacity: 1, y: 0, scale: 1.0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                    className="w-full"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onDirectMuseum) onDirectMuseum();
                                        }}
                                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#E5A93C] hover:brightness-110 text-black font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.6)] border border-white/60 flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                                    >
                                        <span className="text-base leading-none">🏛️</span>
                                        <span className="text-neutral-700 font-light">|</span>
                                        <span>ENTER ATELIER</span>
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="walk_prompt"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-1"
                                >
                                    <span className="font-mono text-[9.5px] text-[#C8A96E] font-black tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(200,169,110,0.5)]">
                                        TAP CARD TO WALK // 02:00 AM
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* 2. PURE 18K GOLD EMBLEM LAYER (Refined Editorial Lighting, Glides smoothly to TV Screen) */}
                <AnimatePresence>
                    {(animPhase === 'emblem_pure' || animPhase === 'emblem_absorb' || animPhase === 'fade_out') && (
                        <motion.div
                            key="pure_emblem_solo"
                            initial={{ opacity: 0, scale: 1.0, y: 0 }}
                            animate={{ 
                                opacity: animPhase === 'fade_out' ? 0 : 1,
                                scale: animPhase === 'emblem_absorb' 
                                    ? 0.13 
                                    : (animPhase === 'fade_out' ? 0.10 : [1.0, 1.03, 1.0]),
                                y: animPhase === 'emblem_absorb' || animPhase === 'fade_out' ? -18 : 0
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 0.4, ease: "easeOut" },
                                scale: { duration: animPhase === 'emblem_absorb' ? 1.4 : 1.8, ease: [0.25, 1, 0.5, 1] },
                                y: { duration: animPhase === 'emblem_absorb' ? 1.4 : 0.4, ease: [0.25, 1, 0.5, 1] }
                            }}
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
                        >
                            {/* Subtle Editorial Champagne Micro-Halo (No oversized chunky yellow bulb!) */}
                            <motion.div 
                                animate={{
                                    scale: animPhase === 'emblem_absorb' ? 0.4 : [1.0, 1.12, 1.0],
                                    opacity: animPhase === 'emblem_absorb' ? 0.3 : [0.35, 0.55, 0.35]
                                }}
                                transition={{ repeat: animPhase === 'emblem_absorb' ? 0 : Infinity, duration: 2.2, ease: "easeInOut" }}
                                style={{
                                    background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(200,169,110,0.08) 45%, transparent 70%)',
                                    filter: 'blur(20px)'
                                }}
                                className="absolute w-[220px] h-[220px] rounded-full pointer-events-none"
                            />

                            {/* Pure 18K Gold Emblem with Sharp Crisp Editorial Lighting */}
                            <motion.img
                                src="/assets/logo/jsf_emblem_transparent.png"
                                alt="Just Sean Flows 18K Gold Emblem"
                                animate={{
                                    filter: animPhase === 'emblem_absorb' ? [
                                        "drop-shadow(0 0 20px rgba(212,175,55,0.9)) brightness(1.3)"
                                    ] : [
                                        "drop-shadow(0 4px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 15px rgba(212,175,55,0.6)) brightness(1.15)",
                                        "drop-shadow(0 4px 24px rgba(0,0,0,0.98)) drop-shadow(0 0 25px rgba(231,255,0,0.75)) brightness(1.25)",
                                        "drop-shadow(0 4px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 15px rgba(212,175,55,0.6)) brightness(1.15)"
                                    ]
                                }}
                                transition={{ repeat: animPhase === 'emblem_absorb' ? 0 : Infinity, duration: 2.0, ease: "easeInOut" }}
                                className="w-32 sm:w-36 object-contain pointer-events-none select-none relative z-10"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. LONE LIGHT SALON BACKGROUND (Smooth Cinematic Fade-In) */}
                <AnimatePresence>
                    {(animPhase === 'emblem_absorb' || animPhase === 'fade_out') && (
                        <motion.div
                            key="lone_light_bg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex items-center justify-center rounded-[32px]"
                        >
                            <img 
                                src="/assets/lone_light_salon_02am.jpg" 
                                alt="02:00 AM Lone Light Salon" 
                                className="w-full h-full object-fill brightness-95"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-1.5 font-mono text-[8.5px] font-black text-[#D4AF37] tracking-[0.2em] uppercase"
                            >
                                <span>📺</span>
                                <span>LONE FREQUENCY DETECTED</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
