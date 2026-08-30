import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';
import { PolyphonicFugueLogo } from '../common/PolyphonicFugueLogo';

const KEYPAD_BUTTONS = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', min: 'MNO', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '·', sub: 'PASS' },
    { num: '0', sub: '+' },
    { num: '⌫', sub: 'DEL' }
];

export function InitialUnlockSplash({ 
    isAudioUnlocked, 
    onUnlock 
}) {
    // flowPhase: 'card_idle' -> 'keypad' -> 'unlock_flash' -> 'dissolving' -> 'emblem_pure' -> 'emblem_absorb' -> 'fade_out'
    const [flowPhase, setFlowPhase] = useState('card_idle');
    const [isFugueDone, setIsFugueDone] = useState(false);
    const [morphProgress, setMorphProgress] = useState(0.0); // 0.0 (JUST SEAN FLOWS) -> 1.0 (J · S · F)
    const [enteredPin, setEnteredPin] = useState('');
    const signatureAudioRef = useRef(null);
    const touchStartYRef = useRef(0);

    // Initialize signature audio
    useEffect(() => {
        const audio = new Audio('/assets/sounds/signature-intro.mp3');
        audio.preload = 'auto';
        signatureAudioRef.current = audio;
    }, []);

    // Handle User Scroll/Wheel to drive Morph Progress (SFI-4: Heavy Velvet 3x Friction)
    const handleWheel = (e) => {
        if (flowPhase !== 'card_idle' || !isFugueDone) return;
        
        // SFI-4: 0.00115 (3x heavier resistance, requires ~900px of wheel rotation)
        const delta = e.deltaY * 0.00115;
        setMorphProgress(prev => {
            const next = Math.max(0.0, Math.min(1.0, prev + delta));
            if (next >= 0.95 && prev < 0.95) {
                // Auto cascade into keypad upon completing the morph
                setTimeout(() => {
                    setFlowPhase('keypad');
                }, 150);
            }
            return next;
        });
    };

    // Handle Touch Drag on Mobile (SFI-4: 360px travel)
    const handleTouchStart = (e) => {
        if (e.touches && e.touches[0]) {
            touchStartYRef.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e) => {
        if (flowPhase !== 'card_idle' || !isFugueDone) return;
        if (e.touches && e.touches[0]) {
            const deltaY = touchStartYRef.current - e.touches[0].clientY;
            if (deltaY > 0) {
                // SFI-4: 360px swipe stroke
                const prog = Math.min(1.0, deltaY / 360.0);
                setMorphProgress(prog);
                if (prog >= 0.95) {
                    setTimeout(() => {
                        setFlowPhase('keypad');
                    }, 150);
                }
            }
        }
    };

    // Handle Tap on Card: Morphs smoothly into Finom Keypad (Quick 0.3s morph)
    const handleCardTap = (e) => {
        if (flowPhase !== 'card_idle') return;
        if (e) e.stopPropagation();

        if (navigator.vibrate) {
            try { navigator.vibrate(20); } catch (err) {}
        }
        setMorphProgress(1.0);
        setFlowPhase('keypad');
    };

    // Handle Finom Keypad Input
    const handleKeypadPress = (val, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (flowPhase !== 'keypad') return;

        if (navigator.vibrate) {
            try { navigator.vibrate(15); } catch (err) {}
        }

        if (val === '⌫') {
            setEnteredPin(prev => prev.slice(0, -1));
            return;
        }

        if (val === '·') {
            triggerMasterUnlock();
            return;
        }

        if (enteredPin.length < 4) {
            const nextPin = enteredPin + val;
            setEnteredPin(nextPin);

            if (nextPin.length === 4) {
                setTimeout(() => {
                    triggerMasterUnlock();
                }, 180);
            }
        }
    };

    // Master Unlock Sequence (Staggered continuous orchestration)
    const triggerMasterUnlock = () => {
        setFlowPhase('unlock_flash');

        // 1. Flash pips & dissolve keypad (0.0s ~ 0.3s)
        setTimeout(() => {
            setFlowPhase('dissolving');

            // 2. Pure 18K Emblem stands isolated in dark space with signature sound (0.3s ~ 0.8s)
            setTimeout(() => {
                setFlowPhase('emblem_pure');
                if (signatureAudioRef.current) {
                    try {
                        signatureAudioRef.current.currentTime = 0;
                        signatureAudioRef.current.play().catch(() => {});
                    } catch (err) {}
                }

                // 3. Dark Salon emerges with TV as Lone Light Source, Emblem absorbs into TV Screen (0.8s ~ 2.2s)
                setTimeout(() => {
                    setFlowPhase('emblem_absorb');

                    // 4. Seamless handoff to walking engine (2.2s)
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

    const isCardDissolved = flowPhase === 'dissolving' || flowPhase === 'emblem_pure' || flowPhase === 'emblem_absorb' || flowPhase === 'fade_out';

    if (isAudioUnlocked) return null;

    return (
        <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: flowPhase === 'fade_out' ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse at center, #190409 0%, #080204 60%, #020102 100%)'
            }}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            {/* Ambient Debris Particles (Subtle 60FPS) */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-25">
                {ATELIER_DEBRIS_100.slice(0, 14).map((d, i) => (
                    <motion.div
                        key={d.id || i}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.15, 0.4, 0.15]
                        }}
                        transition={{ repeat: Infinity, duration: d.duration || 7, ease: "easeInOut" }}
                        style={{
                            left: `${d.left || (i * 7)}%`,
                            top: `${d.top || (i * 6)}%`,
                            width: `${(d.size || 2) * 1.6}px`,
                            height: `${(d.size || 2) * 1.6}px`,
                            backgroundColor: '#C8A96E',
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                            position: 'absolute'
                        }}
                    />
                ))}
            </div>

            {/* Central Solid Container (ZERO Gyro Tilt - Completely Stable Luxury) */}
            <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto select-none px-4 max-w-full">
                
                {/* 1. MASTER FINOM VAULT CARD */}
                <motion.div
                    initial={{ opacity: 1, filter: 'blur(0px)', scale: 1.0 }}
                    animate={{ 
                        opacity: isCardDissolved ? 0 : 1, 
                        scale: isCardDissolved ? 1.03 : 1.0,
                        height: flowPhase === 'keypad' ? '460px' : '380px',
                        width: '290px',
                        borderColor: isCardDissolved ? 'transparent' : 'rgba(200, 169, 110, 0.60)',
                        backgroundColor: isCardDissolved ? 'transparent' : 'rgba(20, 4, 8, 0.96)'
                    }}
                    transition={{
                        opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        height: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                        borderColor: { duration: 0.4, ease: "easeOut" },
                        backgroundColor: { duration: 0.5, ease: "easeOut" }
                    }}
                    onClick={handleCardTap}
                    className="relative rounded-[32px] border border-[#C8A96E]/60 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_40px_rgba(200,169,110,0.18)] px-6 pt-16 pb-6 flex flex-col items-center justify-start overflow-hidden bg-gradient-to-b from-[#2E0711]/95 via-[#140306]/98 to-[#060203]/99 backdrop-blur-3xl group cursor-pointer pointer-events-auto"
                >
                    {/* Top Specular Hairline Glint */}
                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none rounded-t-[30px]" />

                    {/* DUAL-TIMING 18K GOLD EMBLEM CONTAINER (ORIGINAL CHIC UPPER POSITION) */}
                    <motion.div
                        animate={{
                            y: flowPhase === 'card_idle' ? 0 : -8,
                            scale: flowPhase === 'card_idle' ? 1.0 : 0.46
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative z-20 flex flex-col items-center justify-center ${flowPhase === 'card_idle' ? 'mt-0' : 'mt-1'}`}
                    >
                        {/* PART A: 3-Voice Polyphonic Fugue 3.0s Web-Coding Logo Renderer */}
                        <PolyphonicFugueLogo 
                            onFugueComplete={() => setIsFugueDone(true)}
                            isKeypadMode={flowPhase === 'keypad'}
                            className="w-18 sm:w-20"
                        />

                        {/* PART B: SCROLL MORPHING TEXT (JUST SEAN FLOWS -> J · S · F) */}
                        {isFugueDone && (
                            <motion.div 
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="relative mt-3.5 flex items-center justify-center font-serif text-[11px] font-black tracking-widest text-[#FFF8DB] select-none"
                                style={{
                                    filter: 'drop-shadow(0 0 1px #FFF8DB) drop-shadow(0 0 3.5px #FFD700) drop-shadow(0 0 8px rgba(212,175,55,0.4))'
                                }}
                            >
                                {/* Word 1: J + [UST] */}
                                <div className="flex items-center">
                                    <span className="text-[#FFD700] text-[12px] font-bold">J</span>
                                    <motion.span 
                                        style={{
                                            maxWidth: `${Math.max(0, (1 - morphProgress) * 26)}px`,
                                            opacity: Math.max(0, 1 - (morphProgress * 2.0)),
                                            transform: `scaleX(${1 - morphProgress})`,
                                            transformOrigin: 'left'
                                        }}
                                        className="overflow-hidden inline-block text-[10px] text-neutral-300 font-normal ml-0.5 tracking-wider"
                                    >
                                        UST
                                    </motion.span>
                                </div>

                                {/* Dot Separator 1 */}
                                <motion.span 
                                    style={{
                                        opacity: Math.max(0, (morphProgress - 0.3) * 1.5),
                                        transform: `scale(${Math.min(1.0, morphProgress * 1.3)})`
                                    }}
                                    className="mx-1 text-[#FFD700] text-[9px] font-bold"
                                >
                                    •
                                </motion.span>

                                {/* Word 2: S + [EAN] */}
                                <div className="flex items-center ml-1">
                                    <span className="text-[#FFD700] text-[12px] font-bold">S</span>
                                    <motion.span 
                                        style={{
                                            maxWidth: `${Math.max(0, (1 - morphProgress) * 26)}px`,
                                            opacity: Math.max(0, 1 - (morphProgress * 2.0)),
                                            transform: `scaleX(${1 - morphProgress})`,
                                            transformOrigin: 'left'
                                        }}
                                        className="overflow-hidden inline-block text-[10px] text-neutral-300 font-normal ml-0.5 tracking-wider"
                                    >
                                        EAN
                                    </motion.span>
                                </div>

                                {/* Dot Separator 2 */}
                                <motion.span 
                                    style={{
                                        opacity: Math.max(0, (morphProgress - 0.3) * 1.5),
                                        transform: `scale(${Math.min(1.0, morphProgress * 1.3)})`
                                    }}
                                    className="mx-1 text-[#FFD700] text-[9px] font-bold"
                                >
                                    •
                                </motion.span>

                                {/* Word 3: F + [LOWS] */}
                                <div className="flex items-center ml-1">
                                    <span className="text-[#FFD700] text-[12px] font-bold">F</span>
                                    <motion.span 
                                        style={{
                                            maxWidth: `${Math.max(0, (1 - morphProgress) * 36)}px`,
                                            opacity: Math.max(0, 1 - (morphProgress * 2.0)),
                                            transform: `scaleX(${1 - morphProgress})`,
                                            transformOrigin: 'left'
                                        }}
                                        className="overflow-hidden inline-block text-[10px] text-neutral-300 font-normal ml-0.5 tracking-wider"
                                    >
                                        LOWS
                                    </motion.span>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* MODE B: Finom-Style Interactive PIN Vault */}
                    <AnimatePresence>
                        {(flowPhase === 'keypad' || flowPhase === 'unlock_flash') && (
                            <motion.div
                                key="finom_keypad_area"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full relative z-30 flex flex-col items-center mt-2"
                            >
                                {/* 4 High-End Golden Glass PIN Pips */}
                                <div className="flex items-center gap-4 mb-4">
                                    {[0, 1, 2, 3].map((idx) => {
                                        const isFilled = enteredPin.length > idx;
                                        return (
                                            <motion.div
                                                key={idx}
                                                animate={{
                                                    scale: isFilled ? (flowPhase === 'unlock_flash' ? 1.35 : 1.15) : 1.0,
                                                    backgroundColor: isFilled ? '#FFD700' : 'rgba(255, 255, 255, 0.06)',
                                                    borderColor: isFilled ? '#FFD700' : 'rgba(200, 169, 110, 0.35)',
                                                    boxShadow: isFilled ? '0 0 14px rgba(255, 215, 0, 0.85)' : 'none'
                                                }}
                                                transition={{ duration: 0.15 }}
                                                className="w-3 h-3 rounded-full border border-[#C8A96E]/40 transition-colors"
                                            />
                                        );
                                    })}
                                </div>

                                {/* Finom Minimal Numeric Keypad Matrix */}
                                <div 
                                    onClick={(e) => e.stopPropagation()} 
                                    className="grid grid-cols-3 gap-2 w-full max-w-[240px]"
                                >
                                    {KEYPAD_BUTTONS.map((btn, bIdx) => (
                                        <motion.button
                                            key={bIdx}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 + (bIdx * 0.02), duration: 0.25 }}
                                            whileTap={{ scale: 0.92, backgroundColor: 'rgba(212, 175, 55, 0.25)' }}
                                            onClick={(e) => handleKeypadPress(btn.num, e)}
                                            className="h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] active:bg-[#D4AF37]/30 border border-white/10 hover:border-[#D4AF37]/50 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-sm"
                                        >
                                            <span className="font-sans text-sm font-semibold text-white group-hover:text-[#FFD700] transition-colors leading-none">
                                                {btn.num}
                                            </span>
                                            {btn.sub && (
                                                <span className="font-mono text-[6.5px] text-neutral-400 group-hover:text-[#D4AF37] tracking-widest leading-none mt-0.5">
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
                                    : (flowPhase === 'fade_out' ? 0.10 : 1.0),
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
                            {/* Subtle Champagne Micro-Halo */}
                            <motion.div 
                                animate={{
                                    scale: flowPhase === 'emblem_absorb' ? 0.4 : [1.0, 1.12, 1.0],
                                    opacity: flowPhase === 'emblem_absorb' ? 0.3 : [0.35, 0.55, 0.35]
                                }}
                                transition={{ duration: 2.2, ease: "easeInOut" }}
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
                                transition={{ duration: 2.0, ease: "easeInOut" }}
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
