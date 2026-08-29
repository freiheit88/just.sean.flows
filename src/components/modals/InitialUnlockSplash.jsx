import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { getStoredVipProfile } from './InstagramVipAuthModal';
import { unlockTitle } from '../../constants/titles';

const RESONANCE_SCALES = [1.00, 1.03, 1.06, 1.09, 1.12, 1.15];

const KEYPAD_BUTTONS = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '·', sub: 'PASS' },
    { num: '0', sub: '+' },
    { num: '⌫', sub: 'DEL' }
];

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

    // flowPhase: 'card_idle' -> 'keypad' -> 'unlock_flash' -> 'dissolving' -> 'emblem_pure' -> 'emblem_absorb' -> 'fade_out'
    const [flowPhase, setFlowPhase] = useState('card_idle');
    const [enteredPin, setEnteredPin] = useState('');
    const [isWrongPin, setIsWrongPin] = useState(false);

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

    useEffect(() => {
        const stored = getStoredVipProfile();
        if (stored) setVipProfile(stored);

        const tLock = setTimeout(() => {
            canShakeTriggerRef.current = true;
        }, 3000);

        const tCard = setTimeout(() => {
            setCardUnblurStage(true);
        }, 1000);

        const tDebris = setTimeout(() => {
            setDebrisStage(true);
        }, 1500);

        return () => {
            clearTimeout(tLock);
            clearTimeout(tCard);
            clearTimeout(tDebris);
        };
    }, []);

    // Handle Tap on Card: Morphs smoothly into Finom Keypad (Zero abrupt switch!)
    const handleCardTap = (e) => {
        if (flowPhase !== 'card_idle') return;
        if (e) e.stopPropagation();

        if (navigator.vibrate) {
            try { navigator.vibrate(20); } catch (err) {}
        }
        setFlowPhase('keypad');
    };

    // Handle Finom Keypad Input
    const handleKeypadPress = (val, e) => {
        if (e) e.stopPropagation();
        if (flowPhase !== 'keypad') return;

        if (navigator.vibrate) {
            try { navigator.vibrate(15); } catch (err) {}
        }

        if (val === '⌫') {
            setEnteredPin(prev => prev.slice(0, -1));
            return;
        }

        if (val === '·') {
            // Quick bypass trigger
            triggerMasterUnlock();
            return;
        }

        if (enteredPin.length < 4) {
            const nextPin = enteredPin + val;
            setEnteredPin(nextPin);

            if (nextPin.length === 4) {
                // PIN Complete: Trigger Continuous Staggered Unlock
                setTimeout(() => {
                    triggerMasterUnlock();
                }, 180);
            }
        }
    };

    // Master Unlock Sequence (Staggered continuous orchestration)
    const triggerMasterUnlock = () => {
        setFlowPhase('unlock_flash');

        // 1. Flash pips & dissolve keypad (0.0s ~ 0.5s)
        setTimeout(() => {
            setFlowPhase('dissolving');

            // 2. Pure 18K Emblem stands isolated in dark space with signature sound (0.5s ~ 1.8s)
            setTimeout(() => {
                setFlowPhase('emblem_pure');
                if (signatureAudioRef.current) {
                    try {
                        signatureAudioRef.current.currentTime = 0;
                        signatureAudioRef.current.play().catch(() => {});
                    } catch (err) {}
                }

                // 3. Dark Salon emerges with TV as Lone Light Source, Emblem absorbs into TV Screen (1.8s ~ 3.2s)
                setTimeout(() => {
                    setFlowPhase('emblem_absorb');

                    // 4. Seamless handoff to walking engine (3.2s)
                    setTimeout(() => {
                        setFlowPhase('fade_out');
                        setTimeout(() => {
                            if (onUnlock) onUnlock();
                        }, 300);
                    }, 1400);
                }, 1400);
            }, 500);
        }, 300);
    };

    // Gyro calculations
    const isLockedMotion = flowPhase === 'dissolving' || flowPhase === 'emblem_pure' || flowPhase === 'emblem_absorb' || flowPhase === 'fade_out';
    const targetRotX = isLockedMotion ? 0 : (tiltY * 0.6);
    const targetRotY = isLockedMotion ? 0 : (-tiltX * 0.6);
    const targetTransX = isLockedMotion ? 0 : (tiltX * 1.5);
    const targetTransY = isLockedMotion ? 0 : (tiltY * 1.5);

    const isCardDissolved = flowPhase === 'dissolving' || flowPhase === 'emblem_pure' || flowPhase === 'emblem_absorb' || flowPhase === 'fade_out';

    return (
        <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: flowPhase === 'fade_out' ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse at center, rgba(35, 6, 14, 0.95) 0%, rgba(10, 7, 8, 0.99) 70%, #030203 100%)'
            }}
        >
            {/* Ambient Debris Particles */}
            <motion.div 
                animate={{ opacity: debrisStage && !isLockedMotion ? 0.35 : 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 pointer-events-none z-10"
            >
                {ATELIER_DEBRIS_100.slice(0, 20).map((d) => (
                    <motion.div
                        key={d.id}
                        animate={{
                            y: [0, -15, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ repeat: Infinity, duration: 4 + d.size, ease: "easeInOut" }}
                        style={{
                            left: `${d.left}%`,
                            top: `${d.top}%`,
                            width: `${d.size * 2}px`,
                            height: `${d.size * 2}px`,
                            backgroundColor: '#C8A96E',
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                            position: 'absolute'
                        }}
                    />
                ))}
            </motion.div>

            {/* Central 3D Container */}
            <motion.div
                animate={{
                    rotateX: targetRotX,
                    rotateY: targetRotY,
                    x: targetTransX,
                    y: targetTransY
                }}
                transition={{
                    duration: isLockedMotion ? 1.2 : 0.25,
                    ease: isLockedMotion ? [0.16, 1, 0.3, 1] : "easeOut"
                }}
                style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                }}
                className="relative z-20 flex flex-col items-center justify-center pointer-events-auto select-none px-4"
            >
                {/* VIP Recognition Badge */}
                {vipProfile && flowPhase === 'card_idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        onClick={() => triggerMasterUnlock()}
                        className="mb-3 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#E7FF00]/50 shadow-[0_0_20px_rgba(231,255,0,0.4)] flex items-center gap-2 z-30 cursor-pointer pointer-events-auto hover:scale-105 transition-transform"
                    >
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-[#E7FF00]">
                            <img src={vipProfile.avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${vipProfile.instagramId}`; }} />
                        </div>
                        <span className="font-mono text-[9.5px] font-black text-[#E7FF00] tracking-wider uppercase">
                            ⚜️ WELCOME BACK, @{vipProfile.instagramId}
                        </span>
                    </motion.div>
                )}

                {/* 1. MASTER CARD (Continuous Morphing between Velvet Card and Finom Keypad) */}
                <motion.div
                    initial={{ opacity: 1, filter: 'blur(0px)', scale: 1.0 }}
                    animate={{ 
                        opacity: isCardDissolved ? 0 : 1, 
                        filter: 'blur(0px)',
                        scale: isCardDissolved ? 1.04 : (flowPhase === 'keypad' ? 1.0 : 1.0),
                        height: flowPhase === 'keypad' ? '460px' : '380px',
                        width: flowPhase === 'keypad' ? '300px' : '300px',
                        borderColor: isCardDissolved ? 'transparent' : 'rgba(200, 169, 110, 0.75)',
                        backgroundColor: isCardDissolved ? 'transparent' : 'rgba(25, 5, 10, 0.96)'
                    }}
                    transition={{
                        opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        height: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                        borderColor: { duration: 0.4, ease: "easeOut" },
                        backgroundColor: { duration: 0.5, ease: "easeOut" }
                    }}
                    onClick={handleCardTap}
                    className="relative rounded-[32px] border-2 border-[#C8A96E]/80 shadow-[0_25px_70px_rgba(0,0,0,0.98),0_0_35px_rgba(200,169,110,0.25)] p-5 sm:p-6 flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#3E0916]/95 via-[#1D040A]/95 to-[#0A0708]/98 backdrop-blur-2xl group cursor-pointer pointer-events-auto"
                >
                    {/* Top Delicate Specular Light Glint */}
                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none rounded-t-[30px]" />

                    {/* 18K GOLD EMBLEM - Smoothly glides to top in keypad mode */}
                    <motion.div
                        animate={{
                            y: flowPhase === 'card_idle' ? 0 : -10,
                            scale: flowPhase === 'card_idle' ? 1.0 : 0.46
                        }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative z-20 flex flex-col items-center justify-center ${flowPhase === 'card_idle' ? 'my-auto' : 'mt-1'}`}
                    >
                        <div className="absolute w-28 h-28 rounded-full bg-[#D4AF37]/15 blur-xl pointer-events-none" />
                        <motion.img
                            src="/assets/logo/jsf_emblem_transparent.png"
                            alt="Just Sean Flows 18K Gold Emblem"
                            animate={{
                                filter: [
                                    "drop-shadow(0 4px 14px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212,175,55,0.4))",
                                    "drop-shadow(0 4px 18px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(231,255,0,0.6))",
                                    "drop-shadow(0 4px 14px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212,175,55,0.4))"
                                ]
                            }}
                            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                            className="w-28 sm:w-32 object-contain pointer-events-none select-none drop-shadow-2xl"
                        />
                    </motion.div>

                    {/* MODE A: Initial Card State Prompt */}
                    <AnimatePresence>
                        {flowPhase === 'card_idle' && (
                            <motion.div
                                key="initial_prompt"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 12 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="w-full relative z-30 text-center py-2 mt-auto"
                            >
                                <span className="font-mono text-[9px] text-[#C8A96E] font-black tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(200,169,110,0.5)]">
                                    TAP CARD TO ENTER // 02:00 AM
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* MODE B: Finom-Style Interactive PIN Vault */}
                    <AnimatePresence>
                        {(flowPhase === 'keypad' || flowPhase === 'unlock_flash') && (
                            <motion.div
                                key="finom_keypad_area"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full relative z-30 flex flex-col items-center mt-1"
                            >
                                {/* 4 Elegant Golden Glass PIN Pips */}
                                <div className="flex items-center gap-3.5 mb-4">
                                    {[0, 1, 2, 3].map((idx) => {
                                        const isFilled = enteredPin.length > idx;
                                        return (
                                            <motion.div
                                                key={idx}
                                                animate={{
                                                    scale: isFilled ? (flowPhase === 'unlock_flash' ? 1.3 : 1.15) : 1.0,
                                                    backgroundColor: isFilled ? '#FFD700' : 'rgba(255, 255, 255, 0.08)',
                                                    borderColor: isFilled ? '#FFD700' : 'rgba(200, 169, 110, 0.4)',
                                                    boxShadow: isFilled ? '0 0 12px rgba(255, 215, 0, 0.8)' : 'none'
                                                }}
                                                transition={{ duration: 0.15 }}
                                                className="w-2.5 h-2.5 rounded-full border border-[#C8A96E]/40 transition-colors"
                                            />
                                        );
                                    })}
                                </div>

                                {/* Finom Minimal Numeric Keypad */}
                                <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
                                    {KEYPAD_BUTTONS.map((btn, bIdx) => (
                                        <motion.button
                                            key={bIdx}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (bIdx * 0.02), duration: 0.3 }}
                                            whileTap={{ scale: 0.90, backgroundColor: 'rgba(212, 175, 55, 0.25)' }}
                                            onClick={(e) => handleKeypadPress(btn.num, e)}
                                            className="h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-[#D4AF37]/30 border border-white/10 hover:border-[#D4AF37]/40 flex flex-col items-center justify-center transition-all cursor-pointer group"
                                        >
                                            <span className="font-mono text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors leading-none">
                                                {btn.num}
                                            </span>
                                            {btn.sub && (
                                                <span className="font-mono text-[7px] text-neutral-400 group-hover:text-[#D4AF37]/80 tracking-widest leading-none mt-0.5">
                                                    {btn.sub}
                                                </span>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* 2. PURE 18K GOLD EMBLEM LAYER (Appears during unlock -> absorbs into TV) */}
                <AnimatePresence>
                    {(flowPhase === 'emblem_pure' || flowPhase === 'emblem_absorb' || flowPhase === 'fade_out') && (
                        <motion.div
                            key="pure_emblem_solo"
                            initial={{ opacity: 0, scale: 1.0, y: 0 }}
                            animate={{ 
                                opacity: flowPhase === 'fade_out' ? 0 : 1,
                                scale: flowPhase === 'emblem_absorb' 
                                    ? 0.13 
                                    : (flowPhase === 'fade_out' ? 0.10 : [1.0, 1.03, 1.0]),
                                y: flowPhase === 'emblem_absorb' || flowPhase === 'fade_out' ? -18 : 0
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 0.4, ease: "easeOut" },
                                scale: { duration: flowPhase === 'emblem_absorb' ? 1.4 : 1.8, ease: [0.25, 1, 0.5, 1] },
                                y: { duration: flowPhase === 'emblem_absorb' ? 1.4 : 0.4, ease: [0.25, 1, 0.5, 1] }
                            }}
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
                        >
                            {/* Subtle Editorial Champagne Micro-Halo */}
                            <motion.div 
                                animate={{
                                    scale: flowPhase === 'emblem_absorb' ? 0.4 : [1.0, 1.12, 1.0],
                                    opacity: flowPhase === 'emblem_absorb' ? 0.3 : [0.35, 0.55, 0.35]
                                }}
                                transition={{ repeat: flowPhase === 'emblem_absorb' ? 0 : Infinity, duration: 2.2, ease: "easeInOut" }}
                                style={{
                                    background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(200,169,110,0.08) 45%, transparent 70%)',
                                    filter: 'blur(20px)'
                                }}
                                className="absolute w-[220px] h-[220px] rounded-full pointer-events-none"
                            />

                            {/* Pure 18K Gold Emblem */}
                            <motion.img
                                src="/assets/logo/jsf_emblem_transparent.png"
                                alt="Just Sean Flows 18K Gold Emblem"
                                animate={{
                                    filter: flowPhase === 'emblem_absorb' ? [
                                        "drop-shadow(0 0 20px rgba(212,175,55,0.9)) brightness(1.3)"
                                    ] : [
                                        "drop-shadow(0 4px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 15px rgba(212,175,55,0.6)) brightness(1.15)",
                                        "drop-shadow(0 4px 24px rgba(0,0,0,0.98)) drop-shadow(0 0 25px rgba(231,255,0,0.75)) brightness(1.25)",
                                        "drop-shadow(0 4px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 15px rgba(212,175,55,0.6)) brightness(1.15)"
                                    ]
                                }}
                                transition={{ repeat: flowPhase === 'emblem_absorb' ? 0 : Infinity, duration: 2.0, ease: "easeInOut" }}
                                className="w-32 sm:w-36 object-contain pointer-events-none select-none relative z-10"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. LONE LIGHT SALON BACKGROUND (Mounts ONLY during absorption) */}
                <AnimatePresence>
                    {(flowPhase === 'emblem_absorb' || flowPhase === 'fade_out') && (
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
