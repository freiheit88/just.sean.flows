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
    const [animPhase, setAnimPhase] = useState('idle'); // 'idle' | 'snapping' | 'emblem_pure' | 'fade_out'

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

        // Phase 1 (0.0s ~ 1.5s): Magnetic pull & snap to center (zeroing gyro & tilt)
        setAnimPhase('snapping');
        if (navigator.vibrate) {
            try { navigator.vibrate([30, 40, 60]); } catch (err) {}
        }

        // Phase 2 (1.5s ~ 3.5s = 2.0s duration): 
        // Card wine background & borders completely vanish, leaving ONLY pure 18K Gold Emblem floating with gold halo & signature audio
        setTimeout(() => {
            setAnimPhase('emblem_pure');
            if (signatureAudioRef.current) {
                try {
                    signatureAudioRef.current.currentTime = 0;
                    signatureAudioRef.current.play().catch(() => {});
                } catch (err) {}
            }

            // Phase 3 (3.5s): Seamless dissolve into walk screen
            setTimeout(() => {
                setAnimPhase('fade_out');
                setTimeout(() => {
                    if (onUnlock) onUnlock();
                }, 600);
            }, 2000);
        }, 1500);
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

        // 1.0s: Main Logo Card unblurs
        const tCard = setTimeout(() => {
            setCardUnblurStage(true);
        }, 1000);

        // 1.4s: Ambient Debris fades in
        const tDebris = setTimeout(() => {
            setDebrisStage(true);
        }, 1400);

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

                {/* V04 MASTER CARD: Bordeaux Velvet disappears completely on emblem_pure */}
                <motion.div
                    initial={{ opacity: 0, filter: 'blur(22px)', scale: 0.92, y: 20 }}
                    animate={{ 
                        opacity: cardUnblurStage ? (animPhase === 'fade_out' ? 0 : 1) : 0, 
                        filter: cardUnblurStage ? 'blur(0px)' : 'blur(22px)',
                        scale: cardUnblurStage ? currentScaleMultiplier : 0.92,
                        y: cardUnblurStage ? 0 : 20,
                        borderColor: isCardHidden ? 'transparent' : 'rgba(200, 169, 110, 0.8)',
                        backgroundColor: isCardHidden ? 'transparent' : 'rgba(37, 6, 14, 0.95)',
                        backdropFilter: isCardHidden ? 'none' : 'blur(24px)',
                        WebkitBackdropFilter: isCardHidden ? 'none' : 'blur(24px)',
                        boxShadow: isCardHidden 
                            ? '0 0 0 transparent' 
                            : '0 25px 70px rgba(0,0,0,0.98), 0 0 40px rgba(200,169,110,0.35)'
                    }}
                    transition={{
                        duration: isLockedMotion ? 0.8 : 0.3,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={!isLockedMotion ? { scale: currentScaleMultiplier * 1.03 } : {}}
                    whileTap={!isLockedMotion ? { scale: currentScaleMultiplier * 0.97 } : {}}
                    onClick={handleCardClick}
                    className="relative rounded-[32px] border-2 p-6 sm:p-7 flex flex-col items-center justify-between overflow-hidden w-[290px] sm:w-[330px] aspect-[4/5] group cursor-pointer pointer-events-auto"
                >
                    {/* Top Delicate Specular Light Glint (Fades out when pure emblem) */}
                    <motion.div 
                        animate={{ opacity: isCardHidden ? 0 : 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none rounded-t-[30px]" 
                    />

                    {/* Center 18K Gold Cutout Emblem - REMAINS AND GLOWS BEAUTIFULLY */}
                    <div className="relative z-20 flex flex-col items-center justify-center my-auto py-4">
                        <motion.div 
                            animate={{
                                scale: isCardHidden ? [1.2, 1.7, 1.4] : [1, 1.2, 1],
                                opacity: isCardHidden ? [0.6, 0.95, 0.75] : [0.2, 0.35, 0.2]
                            }}
                            transition={{ repeat: isCardHidden ? 0 : Infinity, duration: isCardHidden ? 1.8 : 3.5, ease: "easeInOut" }}
                            className="absolute w-44 h-44 rounded-full bg-[#FFD700] blur-3xl pointer-events-none" 
                        />
                        <motion.img
                            src="/assets/logo/jsf_emblem_transparent.png"
                            alt="Just Sean Flows 18K Gold Emblem"
                            animate={{
                                scale: isCardHidden ? 1.15 : 1.0,
                                filter: isCardHidden ? [
                                    "drop-shadow(0 0 35px rgba(255,215,0,1)) drop-shadow(0 0 80px rgba(231,255,0,0.95)) brightness(1.28)"
                                ] : [
                                    "drop-shadow(0 0 16px rgba(255,215,0,0.5)) drop-shadow(0 6px 18px rgba(0,0,0,0.85))",
                                    "drop-shadow(0 0 32px rgba(231,255,0,0.9)) drop-shadow(0 6px 24px rgba(0,0,0,0.95))",
                                    "drop-shadow(0 0 16px rgba(255,215,0,0.5)) drop-shadow(0 6px 18px rgba(0,0,0,0.85))"
                                ]
                            }}
                            transition={{ 
                                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                                filter: { repeat: isCardHidden ? 0 : Infinity, duration: 3.5, ease: "easeInOut" }
                            }}
                            className="w-32 sm:w-44 object-contain pointer-events-none select-none drop-shadow-2xl"
                        />
                    </div>

                    {/* Bottom Action Area (Fades out when pure emblem) */}
                    <motion.div 
                        animate={{ opacity: isCardHidden ? 0 : 1 }}
                        transition={{ duration: 0.4 }}
                        className="w-full relative z-20 min-h-[46px] flex items-center justify-center mt-auto"
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
                                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#E5A93C] hover:brightness-110 text-black font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_30px_rgba(255,215,0,0.85)] border border-white/60 flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
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
            </motion.div>
        </motion.div>
    );
}
