import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideCompass, LucideCheck, LucideEye, LucideActivity, LucideVolume2, LucideAward } from 'lucide-react';

// Assuming AudioManager, MinaDirective, and calculateArchetype are provided via props or imported
// For isolation, they would ideally be context or imported directly, but we assume they are globally available or passed down where needed

const LanguageCard = ({ lang, isFocused, isStaged, isDimmable, onFocus, onReady, onSelect, AudioManager }) => {
    const [saturationProgress, setSaturationProgress] = useState(0);
    const [isShakePaused, setIsShakePaused] = useState(false);
    const [flashEffect, setFlashEffect] = useState(false);
    const animInterval = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (isFocused && !isStaged) {
            const startTime = Date.now();
            const duration = 5500; // 5.5s total time
            let stage = 0;

            animInterval.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const percentage = Math.min((elapsed / duration) * 100, 100);
                setSaturationProgress(percentage);

                const triggerSnap = () => {
                    setFlashEffect(true);
                    setIsShakePaused(true);
                    setTimeout(() => setFlashEffect(false), 50); // Flash ends quickly
                    setTimeout(() => setIsShakePaused(false), 450); // Freeze ends
                };

                if (elapsed >= 2500 && stage < 1) { // 2.5 sec jump
                    [...Array(3)].forEach(() => AudioManager?.playSfx('piano-mystic-low', 0.8, true));
                    triggerSnap();
                    stage = 1;
                } else if (elapsed >= 3500 && stage < 2) { // 3.5 sec jump
                    AudioManager?.playSfx('piano-mystic-mid', 0.9, true);
                    triggerSnap();
                    stage = 2;
                } else if (elapsed >= 4500 && stage < 3) { // 4.5 sec
                    AudioManager?.playSfx('piano-mystic-high', 1.0, true);
                    // AudioManager?.playSfx('transition', 0.4, true); // Removed per user request
                    triggerSnap();
                    if (onReady) onReady({ ...lang, requestBackground: true });
                    stage = 3;
                }

                if (elapsed >= duration) { // 5.5 sec total completion
                    clearInterval(animInterval.current);
                    if (onReady) onReady({ ...lang, requestSequenceComplete: true });
                }
            }, 50);
        } else {
            setSaturationProgress(0);
            if (animInterval.current) clearInterval(animInterval.current);
        }

        return () => {
            if (animInterval.current) clearInterval(animInterval.current);
        };
    }, [isFocused, isStaged]);
    return (
        <motion.div
            ref={cardRef}
            onClick={() => {
                if (!isFocused && !isStaged) {
                    onFocus(lang);
                }
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isDimmable ? 0.3 : 1,
                scale: isStaged ? 1 : (isFocused ? (flashEffect ? 1.15 : (isShakePaused ? 1.08 : (saturationProgress === 100 && !isStaged ? [1.05, 1.08, 1.05] : 1.05))) : 1),
                zIndex: isFocused ? 100 : 1,
                x: isFocused && saturationProgress > 0 && saturationProgress < 100 && !isStaged && !isShakePaused
                    ? [-1, 1, -1, 1, 0].map(v => v * (1 + (saturationProgress / 100) * 1.5))
                    : 0,
                y: isFocused && saturationProgress > 0 && saturationProgress < 100 && !isStaged && !isShakePaused
                    ? [1, -1, 1, -1, 0].map(v => v * (1 + (saturationProgress / 100) * 1.5))
                    : 0,
            }}
            transition={{
                x: { duration: 0.1, repeat: isFocused && saturationProgress < 100 && !isShakePaused ? Infinity : 0, ease: "linear" },
                y: { duration: 0.1, repeat: isFocused && saturationProgress < 100 && !isShakePaused ? Infinity : 0, ease: "linear" },
                opacity: { duration: 0.3 },
                scale: flashEffect ? { duration: 0.05, type: 'tween' } : (isFocused && saturationProgress === 100 && !isStaged
                    ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                    : { type: 'spring', damping: 25, stiffness: 120 })
            }}
            className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl select-none transition-shadow ${isFocused && !isStaged ? 'shadow-[0_0_80px_rgba(197,160,89,0.4)] ring-2 ring-[#C5A059]' : (isStaged ? 'ring-2 md:ring-4 ring-[#C5A059] shadow-[0_0_60px_rgba(197,160,89,0.8)]' : 'cursor-pointer hover:ring-1 hover:ring-white/20')}`}
            style={{ touchAction: 'none' }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-100"
                style={{
                    backgroundImage: `url(${lang.image})`,
                    transform: 'scale(1.5)',
                    filter: flashEffect ? 'saturate(0) brightness(5) contrast(2)' : (isShakePaused ? 'saturate(2) grayscale(0%) brightness(1.5) contrast(1.2)' : (isStaged ? 'saturate(1) grayscale(0%) brightness(1)' : (isFocused
                        ? (saturationProgress < 45.45 ? `saturate(${0.1 + (0.2 * (saturationProgress / 45.45))}) grayscale(${80 - (50 * (saturationProgress / 45.45))}%) brightness(${0.1 + (0.2 * (saturationProgress / 45.45))})`
                            : saturationProgress < 63.63 ? 'saturate(0.7) grayscale(30%) brightness(0.7)'
                                : saturationProgress < 81.81 ? 'saturate(1) grayscale(0%) brightness(1)'
                                    : 'saturate(1.2) grayscale(0%) brightness(1.3) drop-shadow(0 0 10px rgba(197,160,89,0.8))')
                        : 'saturate(1) grayscale(0%) brightness(1)'))),
                }}
            />

            {flashEffect && (
                <div className="absolute inset-0 bg-white z-[100] mix-blend-overlay opacity-80 pointer-events-none" />
            )}

            {
                isFocused && saturationProgress < 100 && (
                    <div className="absolute bottom-0 left-0 h-2 bg-[#C5A059] z-40 transition-all duration-75" style={{ width: `${saturationProgress}%` }} />
                )
            }

            {
                isFocused && saturationProgress === 100 && !isStaged && (
                    <motion.div animate={{ opacity: [0, 0.3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 border-4 border-[#C5A059] pointer-events-none z-40" />
                )
            }

            {
                isStaged && (
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], boxShadow: ['inset 0 0 10px rgba(197,160,89,0)', 'inset 0 0 40px rgba(197,160,89,0.8)', 'inset 0 0 10px rgba(197,160,89,0)'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 pointer-events-none z-40 rounded-lg"
                    />
                )
            }

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 opacity-60 pointer-events-none" />

            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none p-0">
                <h3 className={`font-bold text-white font-serif uppercase tracking-tighter md:tracking-normal leading-none mb-0 transition-transform duration-500 whitespace-nowrap origin-center ${isFocused ? 'drop-shadow-[0_0_10px_rgba(197,160,89,0.8)] text-[#FDFCF0]' : ''}`} style={{ fontSize: '17px', transform: isFocused ? 'scale(1.1)' : 'scale(0.95)' }}>
                    {lang.name}
                </h3>
                <div className="w-full px-1 flex justify-center items-center mt-0">
                    <motion.span animate={{ y: isFocused || isStaged ? 0 : 3 }} className="w-full text-[#C5A059] uppercase tracking-tighter md:tracking-normal font-semibold block leading-tight text-center drop-shadow-md whitespace-pre-wrap break-words origin-center" style={{ fontSize: '12px', textShadow: '0px 2px 8px rgba(0,0,0,1)', transform: 'scale(0.85)' }}>
                        {isStaged ? lang.ui.fateSealed : (saturationProgress === 100 ? lang.ui.drag : (isFocused ? `${lang.ui.sync} ${Math.round(saturationProgress)}%` : lang.ui.tap))}
                    </motion.span>
                </div>
            </div>
        </motion.div >
    );
};

// --- LanguageSelector Component ---
const LanguageSelector = ({ LANGUAGES, handleLanguageSelect, setSpiritHint, cardsExplored, setCardsExplored, isMinaSpeaking, earnedBadges, onEarnBadge, AudioManager, MinaDirective, calculateArchetype, selectedPath, isWipReached, onWipReached, phase, onVolumeCheckComplete, onVolumeCheckTrigger, onCassetteComplete, onAwarenessComplete, onSealComplete, selectedLang }) => {
    const [focusedLang, setFocusedLang] = useState(null);
    const [stagedLang, setStagedLang] = useState(null);
    const [minaText, setMinaText] = useState("");
    const [activeBackground, setActiveBackground] = useState(null);
    const [isIntroActive, setIsIntroActive] = useState(false);
    const [isSealed, setIsSealed] = useState(false);
    const [isRulesMerged, setIsRulesMerged] = useState(false);
    const [isMerging, setIsMerging] = useState(false);

    // --- AWARENESS PHASE SCORED-BOARD ---
    const [awarenessScoreboardVisible, setAwarenessScoreboardVisible] = useState(false);

    // --- Pre-intro screen state ---
    const [preintroStep, setPreintroStep] = useState('touch'); // 'touch' | 'clearing'
    const [preintroLoading, setPreintroLoading] = useState(true);

    useEffect(() => {
        if (phase === 'VOLUME_CHECK') {
            setPreintroLoading(true);
            const timer = setTimeout(() => {
                setPreintroLoading(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [phase]);


    useEffect(() => {
        if (phase === 'AWARENESS' && selectedLang) {
            setAwarenessScoreboardVisible(true);
            AudioManager?.playTheme(selectedLang.id, 0.7, 3000);
            AudioManager?.playSfx('welcome', 1.0);
        }
    }, [phase, selectedLang, AudioManager]);


    const [focusPhase, setFocusPhase] = useState(false);
    const [showGalleryTiles, setShowGalleryTiles] = useState(false);
    const [isGrid9Shattered, setIsGrid9Shattered] = useState(false);
    const [showInstaGallery, setShowInstaGallery] = useState(false);
    const [instaGalleryIndex, setInstaGalleryIndex] = useState(1);
    const [forceFolded, setForceFolded] = useState(false);

    // The introSentence state and its useEffect are now redundant if minaText is initialized with the desired intro.
    // Keeping it for now, but it will be overwritten by the initial minaText state.
    const [introSentence] = useState(() => {
        if (phase === 'AWARENESS') {
            return "Please read AWARENESS first to fully enjoy the experience.";
        }
        const introSentences = [
            "Initiating dimensional shift.",
            "Anchor your consciousness.",
            "Await multiverse synchronization.",
            "Select your frequency.",
            "Choose your anchor point."
        ];
        return introSentences[Math.floor(Math.random() * introSentences.length)];
    });

    useEffect(() => {
        setMinaText(introSentence);
        const overlayTimer = setTimeout(() => {
            setIsIntroActive(false);
        }, 6000);

        const autoFoldTimer = setTimeout(() => {
            setForceFolded(true);
        }, 5000);

        return () => {
            clearTimeout(overlayTimer);
            clearTimeout(autoFoldTimer);
        };
    }, [introSentence]);

    const onCardFocus = (lang) => {
        if (setCardsExplored) {
            setCardsExplored(prev => {
                const newSet = new Set(prev);
                newSet.add(lang.id);
                return newSet;
            });
        }
        cancelHold(); // Reset ongoing countdown if user taps another language
        setActiveBackground(null);
        setFocusedLang(lang);
        setStagedLang(null);
        setMinaText(lang.ui.sync + "...");
    };

    const onCardReady = (payload) => {
        if (onEarnBadge && calculateArchetype) {
            const metrics = {
                totalClicks: cardsExplored?.size || 1,
                uniqueCards: cardsExplored?.size || 1,
                sessionTimeSeconds: 5,
                selectedLangId: payload.id
            };
            const calculated = calculateArchetype(metrics);
            if (calculated && calculated.length > 0) {
                onEarnBadge(calculated);
            }
        }

        if (payload.requestBackground) {
            setActiveBackground(payload.image);
        }
        if (payload.requestSequenceComplete) {
            setMinaText(payload.ui.directiveLanguage);
            AudioManager?.playMina(payload.id, 'language');
            startCountdown(payload);
        }
    };

    const [countdownTime, setCountdownTime] = useState(null);
    const countdownIntervalRef = useRef(null);

    const startCountdown = (lang) => {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setCountdownTime(6.78);
        setStagedLang(lang);
        handleAnchorSelect(lang);

        countdownIntervalRef.current = setInterval(() => {
            setCountdownTime(prev => {
                const next = prev - 0.05;
                if (next <= 0) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                    return 0;
                }
                return next;
            });
        }, 50);
    };

    const [expandedHeight, setExpandedHeight] = useState('auto');

    useEffect(() => {
        const updateHeight = () => {
            const grid = document.getElementById('language-grid');
            if (grid) {
                const rect = grid.getBoundingClientRect();
                const offset = window.innerWidth >= 768 ? 32 : 16;
                const newHeight = Math.max(100, rect.bottom - offset);
                setExpandedHeight(`${newHeight}px`);
            }
        };

        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);
        const gridEl = document.getElementById('language-grid');
            if (gridEl) resizeObserver.observe(gridEl);

        return () => resizeObserver.disconnect();
    }, [isIntroActive]);

    // Very quiet (1%) background sound to keep Media Volume active for hardware keys
    useEffect(() => {
        let audioCtx;
        let silentGain;

        if (phase === 'LANGUAGE_QUEST') {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }

                silentGain = audioCtx.createGain();
                silentGain.gain.setValueAtTime(0.01, audioCtx.currentTime); // 1% volume
                silentGain.connect(audioCtx.destination);

                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(40, audioCtx.currentTime); // Very low frequency, basically inaudible
                osc.connect(silentGain);
                osc.start();
            } catch (e) {
                console.log("Hardware volume silent audio trigger blocked", e);
            }
        }

        return () => {
            if (audioCtx && audioCtx.state !== 'closed') {
                setTimeout(() => audioCtx.close(), 100);
            }
        };
    }, [phase]);

    // Cassette Insert Phase Logic
    useEffect(() => {
        if (phase === 'CASSETTE_INSERT') {
            // Play Cassette Insert Sound
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                
                const masterGain = audioCtx.createGain();
                masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
                masterGain.connect(audioCtx.destination);

                // Simulation of a mechanical clunk (noise + low frequency burst)
                const osc = audioCtx.createOscillator();
                osc.type = 'square';
                osc.frequency.setValueAtTime(120, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
                
                const oscGain = audioCtx.createGain();
                oscGain.gain.setValueAtTime(0, audioCtx.currentTime);
                oscGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.02);
                oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                
                osc.connect(oscGain);
                oscGain.connect(masterGain);
                
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.2);

                const osc2 = audioCtx.createOscillator();
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(300, audioCtx.currentTime + 0.15);
                osc2.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.25);
                
                const osc2Gain = audioCtx.createGain();
                osc2Gain.gain.setValueAtTime(0, audioCtx.currentTime + 0.15);
                osc2Gain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.17);
                osc2Gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                
                osc2.connect(osc2Gain);
                osc2Gain.connect(masterGain);

                osc2.start(audioCtx.currentTime + 0.15);
                osc2.stop(audioCtx.currentTime + 0.35);

            } catch (e) {
                console.log("Cassette audio error", e);
            }

            // Auto advance to AWARENESS after 10 seconds
            const timer = setTimeout(() => {
                if (onCassetteComplete) onCassetteComplete();
            }, 10000);

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);



    useEffect(() => {
        if (countdownTime === 0 && stagedLang && !isSealed) {
            setIsSealed(true);
            setMinaText("앵커 확정 성공!");

            if (handleLanguageSelect) {
                handleLanguageSelect(stagedLang);
            }

            if (phase === 'LANGUAGE_QUEST') {
                setTimeout(() => {
                    onSealComplete?.();
                }, 1000);
            } else {
                setTimeout(() => {
                    setShowGalleryTiles(true);
                    setForceFolded(true);

                    setFocusPhase(true);
                    setMinaText("[🎙️ SEAN'S COMMENT]\nPlease engrave the rules of the Multiverse (Awareness) into your body first.");
                    AudioManager?.playSfx('piano-mystic-low', 0.8);
                    AudioManager?.playSfx('shutter', 0.6);
                }, 10000);
            }

            cancelHold();
        }
    }, [countdownTime, stagedLang, isSealed, AudioManager, handleLanguageSelect]);

    useEffect(() => {
        if (countdownTime === 0 && isSealed && !isWipReached) {
            cancelHold();
            if (onWipReached) onWipReached();
            setMinaText("System Pause : 해당 차원의 건축이 아직 진행 중입니다. 다음 업데이트를 기다려 주십시오.");
        }
    }, [countdownTime, isSealed, isWipReached, onWipReached]);

    const handleRulesMerge = () => {
        if (isMerging || isRulesMerged) return;
        setIsMerging(true);

        AudioManager?.playSfx('piano-mystic-high', 1.0, true);
        // AudioManager?.playSfx('transition', 0.7, true); // Removed per user request

        setTimeout(() => {
            setIsRulesMerged(true);
            setIsMerging(false);
            setFocusPhase(false);

            if (onEarnBadge) {
                onEarnBadge([{
                    id: 'keeper_of_rules',
                    type: 'passive',
                    title: '규칙의 수호자',
                    group: 'awareness'
                }]);
            }

            if (stagedLang) setMinaText("규칙이 동기화되었습니다. 이제 탐색을 자유롭게 진행하세요.");
        }, 1500);
    };

    const cancelHold = () => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        setCountdownTime(null);
    };

    const handleAnchorSelect = (lang) => {
        setStagedLang(lang);

        // AudioManager?.playSfx('piano-mystic-high', 1.0, true); // Removed to prevent double playback 
        // AudioManager?.playSfx('transition', 0.7, true); // Removed per user request

        // Keep '앵커 확정 성공!' and prevent override
        if (!isSealed) {
            setMinaText(lang.ui.directiveConfirm);
        }
        AudioManager?.playMina(lang.id, 'confirm');
    };

    const onCardSelect = (lang) => {
        setFocusedLang(lang);
        handleAnchorSelect(lang);
    };

    // Distances from center grid cell (x=1, y=1) to create a radial wave effect
    const getWaveDelay = (index) => {
        const distances = [
            1.414, 1.0, 1.414,  // Top row (pos 0, 1, 2 = coords 0,0 1,0 2,0)
            1.0,        1.0,    // Middle row (pos 3, 4 = coords 0,1 2,1)
            1.414, 1.0, 1.414   // Bottom row (pos 5, 6, 7 = coords 0,2 1,2 2,2)
        ];
        // Scale the distance to control the speed of the wave spreading outwards
        return distances[index] * 0.4;
    };

    if (phase === 'VOLUME_CHECK') {
        const handleVolumeConfirmed = () => {
            if (preintroStep !== 'touch') return;
            setPreintroStep('clearing');

            // Play Timpani heavy kick sound
            try {
                const timpaniAudio = new Audio('/assets/sounds/TS_IFD_kick_timpani_heavy.wav');
                timpaniAudio.volume = 0.8;
                timpaniAudio.play().catch(() => {});
            } catch (e) {
                console.log("SFX play failed:", e);
            }

            // Trigger parent to start music video audio & brighten
            if (onVolumeCheckTrigger) onVolumeCheckTrigger();

            // Transition to language selection after 2.5 seconds (giving time for the screen to clear)
            setTimeout(() => {
                if (onVolumeCheckComplete) onVolumeCheckComplete();
            }, 2500);
        };

        const isCleared = preintroStep === 'clearing';

        return (
            <div className="absolute inset-0 w-full h-full bg-transparent overflow-hidden z-[9999] flex items-center justify-center select-none">
                {/* UI Container */}
                <div 
                    className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none transition-all duration-700"
                    style={{
                        opacity: isCleared ? 0 : 1,
                        scale: isCleared ? 0.95 : 1
                    }}
                >
                    <AnimatePresence mode="wait">
                        {preintroLoading ? (
                            <motion.div
                                key="preintro-loading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="flex flex-col items-center justify-center gap-4"
                            >
                                {/* Spinning mechanical compass radar */}
                                <motion.div 
                                    className="text-[#f5e6b8] opacity-75 animate-[spin_6s_linear_infinite]"
                                >
                                    <LucideCompass size={48} strokeWidth={1} />
                                </motion.div>
                                
                                <div className="flex flex-col items-center gap-1">
                                    <span className="font-serif text-[#f5e6b8] text-sm tracking-[0.3em] uppercase animate-pulse">
                                        Connecting to Aether
                                    </span>
                                    <span className="text-[10px] text-white/40 tracking-[0.25em] font-sans font-bold uppercase">
                                        Aligning Resonator . . .
                                    </span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="preintro-action"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                onClick={handleVolumeConfirmed}
                                disabled={isCleared}
                                className="pointer-events-auto cursor-pointer flex flex-col items-center justify-center px-10 py-5 rounded-full border border-[#f5e6b8]/50 bg-[#0a0c12]/80 text-[#f5e6b8] shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md active:scale-95 transition-all duration-300 origin-center animate-[breathe_2s_ease-in-out_infinite]"
                                style={{
                                    outline: 'none',
                                }}
                            >
                                <span 
                                    className="font-serif text-3xl md:text-4xl font-bold tracking-wider leading-none text-[#f5e6b8]"
                                    style={{
                                        textShadow: '0 0 20px rgba(245, 230, 184, 0.6)'
                                    }}
                                >
                                    Touch here!
                                </span>
                                <span className="text-xs md:text-sm text-white/60 font-semibold tracking-widest mt-2 uppercase">
                                    Volume UP 🎧🔊
                                </span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Inline CSS for breathe animation keyframes */}
                <style>{`
                    @keyframes breathe {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.04); }
                    }
                `}</style>
            </div>
        );
    }
    if (phase === 'CASSETTE_INSERT') {
        const langName = selectedLang?.name || 'English';
        
        const getLangBuff = (id) => {
            switch (id) {
                case 'ko': return { type: "MYSTIC", name: "MORNING CALM", effect: "+10% FOCUS" };
                case 'en': return { type: "ANCHOR", name: "GLOBAL SYNC", effect: "+10% ADAPTABILITY" };
                case 'es': return { type: "DYNAMIC", name: "FIESTA PASSION", effect: "+10% ENERGY" };
                case 'hi': return { type: "ANCIENT", name: "KARMA HARMONY", effect: "+10% RESILIENCE" };
                case 'de': return { type: "LOGIC", name: "IRON PRECISION", effect: "+10% EFFICIENCY" };
                case 'ja': return { type: "AESTHETIC", name: "CHERRY BLOSSOM", effect: "+10% AGILITY" };
                case 'ar': return { type: "CELESTIAL", name: "DESERT LORE", effect: "+10% WISDOM" };
                case 'pl': return { type: "TENACIOUS", name: "AMBER FORTITUDE", effect: "+10% ENDURANCE" };
                default: return { type: "AETHER", name: "UNKNOWN BIND", effect: "+10% LUCK" };
            }
        };
        const buff = getLangBuff(selectedLang?.id);

        return (
            <div className="w-full h-full flex flex-col items-center justify-start pt-10 md:pt-20 p-4 relative overflow-hidden bg-black">
                {/* Fixed Background Image using active language's image */}
                {selectedLang?.image && (
                    <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none transition-opacity duration-1000" style={{ backgroundImage: `url(${selectedLang.image})`, filter: "blur(8px) grayscale(50%)" }} />
                )}
                
                {/* Background ambient glow matching the cassette vibe */}
                <motion.div 
                    className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06)_0%,transparent_60%)]"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-4 pt-10">
                    
                    {/* The TCG Card Drop Animation */}
                    <motion.div
                        initial={{ y: -150, scale: 2, opacity: 0, rotateX: 60 }}
                        animate={{ y: 0, scale: 1.1, opacity: 1, rotateX: 0 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 1.2 }}
                        className="w-40 md:w-48 aspect-[4/5] rounded-[10px] shadow-[0_20px_50px_rgba(197,160,89,0.5)] overflow-hidden border-2 border-[#C5A059] relative z-20 mb-10 md:mb-12"
                    >
                        {/* Render the actual Language Card component passively */}
                        {selectedLang && (
                            <LanguageCard 
                                lang={selectedLang} 
                                idx={0} 
                                isFocused={true} 
                                isStaged={true} 
                                isDimmable={false} 
                                onFocus={() => {}} 
                                onReady={() => {}} 
                                onSelect={() => {}} 
                                AudioManager={AudioManager} 
                            />
                        )}
                        {/* Glint effect over the card */}
                        <motion.div 
                            className="absolute inset-0 w-full h-[200%] bg-gradient-to-tr from-transparent via-white/30 to-transparent skew-y-[30deg] pointer-events-none z-50"
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                    </motion.div>

                    {/* TCG Card Effect Text Box beneath the card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.6, type: "spring", bounce: 0.3 }}
                        className="w-[90vw] md:w-full relative z-20"
                    >
                        <div className="bg-[#1a1711]/90 backdrop-blur-xl border-t-4 border-x-2 border-b-2 border-[#C5A059] rounded-xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden group">
                            
                            {/* Inner ornate border */}
                            <div className="absolute inset-x-2 top-2 bottom-2 border border-[#C5A059]/30 rounded-lg pointer-events-none" />

                            <div className="flex justify-between items-center border-b border-[#C5A059]/20 pb-3 mb-4 mx-2">
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-white/50 text-[9px] md:text-[10px] font-bold tracking-[0.2em] leading-none mb-1">FACTION</span>
                                    <span className="text-[#FDFCF0] font-black text-xs md:text-sm tracking-wider">{langName.toUpperCase()}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-[1px] bg-white/10" />
                                </div>
                                <div className="flex flex-col items-end text-right">
                                    <span className="text-white/50 text-[9px] md:text-[10px] font-bold tracking-[0.2em] leading-none mb-1">CLASS</span>
                                    <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-wider drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]">{buff.type}</span>
                                </div>
                            </div>

                            <div className="mb-2">
                                <span className="text-white/40 text-[9px] font-mono tracking-widest">INNATE TRAIT</span>
                            </div>
                            
                            <h2 className="text-[#C5A059] font-serif font-black text-xl md:text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(197,160,89,0.5)] mb-4 uppercase">
                                {buff.name}
                            </h2>

                            <div className="bg-black/60 rounded p-4 mx-1 border border-[#C5A059]/20 shadow-inner">
                                <p className="text-white font-mono text-[13px] md:text-sm tracking-wide leading-relaxed font-semibold">
                                    <span className="text-[#00E5FF] font-bold text-lg mr-2 inline-block animate-pulse">✦</span>
                                    {buff.effect}
                                </p>
                            </div>
                            
                            {/* Background ambient lighting for the text box */}
                            <motion.div 
                                className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.1)_0%,transparent_70%)] pointer-events-none -z-10"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </div>
                    </motion.div>

                </div>

                {/* Subtle loading indicator at bottom */}
                <motion.div 
                    className="absolute bottom-8 md:bottom-12 w-48 h-[3px] bg-white/10 overflow-hidden rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <motion.div 
                        className="h-full bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                    />
                </motion.div>
            </div>
        );
    }

    if (phase === 'AWARENESS') {
        const archetypeBadge = earnedBadges?.find(b => b.type === 'archetype') || earnedBadges?.[0] || { title: 'Unknown' };

        return (
            <div className="w-full h-full flex flex-col items-center justify-start pt-10 md:pt-24 p-4 relative overflow-hidden bg-black cursor-pointer" onClick={() => onAwarenessComplete?.()}>
                <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none transition-opacity duration-[3000ms]" style={{ backgroundImage: `url(/public/backgrounds/${selectedLang?.id || 'en'}_bg.webp), url(/assets/backgrounds/${selectedLang?.id || 'en'}_bg.webp)`, filter: "blur(6px)" }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(197,160,89,0.2)] flex flex-col items-center text-center gap-6"
                >
                    <div className="flex flex-col items-center gap-2">
                        <LucideActivity className="text-[#C5A059] animate-pulse" size={32} />
                        <h2 className="text-[#00E5FF] font-mono tracking-[0.4em] text-xs md:text-sm uppercase font-black">
                            AWARENESS LEVEL: SYNCHRONIZED
                        </h2>
                    </div>

                    <div className="h-[2px] w-1/3 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent my-2" />

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="text-[#FDFCF0] font-serif text-xl md:text-3xl font-black tracking-widest leading-relaxed drop-shadow-[0_0_15px_rgba(197,160,89,0.6)] uppercase"
                    >
                        ARCHETYPE RECORDED:
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                            className="block text-[#C5A059] mt-4 text-2xl md:text-4xl drop-shadow-[0_0_30px_rgba(197,160,89,1)]"
                        >
                            "{archetypeBadge.title}"
                        </motion.span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3, duration: 2 }}
                        className="mt-8 text-white/50 text-[10px] tracking-[0.3em] font-mono uppercase animate-pulse"
                    >
                        [ TAP ANYWHERE TO INITIATE IDENTITY FORGE ]
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto h-full flex flex-col items-center justify-start pt-2 md:pt-8 px-0 md:px-8 overflow-hidden md:overflow-visible relative" style={{ touchAction: 'none', overscrollBehavior: 'none' }}>
            {phase === 'AWARENESS' && (
                <div className="absolute inset-0 z-0 grid grid-cols-3 grid-rows-3 gap-1 opacity-20 pointer-events-none transition-opacity duration-[3000ms] blur-[2px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div key={`bg-tile-${num}`} className="w-full h-full overflow-hidden">
                            <img src={`/assets/manual_upload/insta/tile_${num}.png`} alt={`Tile ${num}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
            {phase !== 'AWARENESS' && phase !== 'LANGUAGE_QUEST' && (
                <div className="fixed inset-0 z-[-1] bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: "url('/assets/click_anywhere_bg.jpg')", filter: "blur(6px)" }} />
            )}
            <div className={`fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-[3000ms] pointer-events-none ${activeBackground ? 'opacity-70' : 'opacity-0'}`} style={activeBackground ? { backgroundImage: `url(${activeBackground})` } : {}} />
            <div className={`fixed inset-0 z-[4900] bg-black/80 backdrop-blur-md transition-opacity duration-1000 pointer-events-none ${isSealed && !showGalleryTiles ? 'opacity-100' : 'opacity-0'}`} />

            <div id="language-grid" className={`w-[min(92vw,65vh)] md:w-[min(90vw,70vh)] max-w-[500px] grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 bg-black/40 backdrop-blur-3xl p-2 md:p-5 border border-white/5 rounded-lg md:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-1000 ${isIntroActive ? 'opacity-40 blur-sm scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] animate-pulse pointer-events-none" />

                {[0, 1, 2, 3, 'center', 4, 5, 6, 7].map((pos, i) => {
                    if (pos === 'center') {
                        return (
                            <div key="center-slot" className="relative aspect-[4/5] w-full z-[50]">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 md:p-4 bg-white/5 border-2 rounded-xl border-dashed border-[#C5A059]/30 w-full h-full">
                                    <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none scale-[0.7] origin-center">
                                        {countdownTime === null && (
                                            phase === 'AWARENESS' ? (
                                                <div className="absolute bottom-4 right-4 animate-bounce-x">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                                </div>
                                            ) : (
                                                MinaDirective && <MinaDirective isVisible={true} variant="mini" />
                                            )
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {countdownTime !== null && (
                                        <motion.div
                                            key="classical-countdown"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                                            transition={{ duration: 0.8 }}
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[60]"
                                        >
                                            {/* Elegant dark overlay */}
                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-xl shadow-[inset_0_0_50px_rgba(0,0,0,1)]" />
                                            
                                            {/* Classical Clockwork/Astrolabe Rings */}
                                            <svg className="absolute w-[90%] h-[90%] max-w-[220px] max-h-[220px]" viewBox="0 0 100 100">
                                                {/* Outer thin ring */}
                                                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(197, 160, 89, 0.2)" strokeWidth="0.5" />
                                                
                                                {/* Rotating inner dashed ring */}
                                                <motion.circle 
                                                    cx="50" cy="50" r="42" 
                                                    fill="none" 
                                                    stroke="rgba(197, 160, 89, 0.4)" 
                                                    strokeWidth="1" 
                                                    strokeDasharray="4 8"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                                    style={{ transformOrigin: 'center' }}
                                                />

                                                {/* Sweeping progress ring (like a metronome or music phrase) */}
                                                <motion.circle 
                                                    cx="50" cy="50" r="35" 
                                                    fill="none" 
                                                    stroke="#C5A059" 
                                                    strokeWidth="1.5" 
                                                    strokeLinecap="round"
                                                    strokeDasharray="220"
                                                    strokeDashoffset={220 - (220 * (countdownTime / 6.78))}
                                                    style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                                                />
                                            </svg>

                                            {/* Elegant Gold Glow */}
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.15)_0%,transparent_60%)] animate-pulse" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }

                    const lang = LANGUAGES[pos];
                    const isFocused = focusedLang?.id === lang?.id;
                    const isStaged = stagedLang?.id === lang?.id;
                    const isDimmable = false; // Intentionally disabled fading out of other cards
                    const isOriginalOfStaged = stagedLang && stagedLang.id === lang?.id;
                    const instaImgIndex = pos < 4 ? pos + 1 : pos;

                    const isGrid9 = pos === 7;
                    const isFocusedGrid = isGrid9;
                    const isDimmed = isSealed;
                    const isHidden = false;

                    let phaseInvisible = false;
                    if (phase === 'AWARENESS') {
                        if (pos !== 'center' && !isGrid9) {
                            phaseInvisible = true;
                        }
                    }

                    const isFocusTarget = focusPhase && !isRulesMerged;
                    const applyDimming = isFocusTarget && !isGrid9;

                    if (isGrid9 && (isFocusTarget || phase === 'AWARENESS')) {
                        return (
                            <div key={`slot-${i}`} className="relative aspect-[4/5] w-full z-[8000]">
                                {/* Background Image for Grid 9 */}
                                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                                    <img src={`/assets/manual_upload/insta/tile_9.png`} alt="Grid 9 BG" className="w-full h-full object-cover" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={isGrid9Shattered
                                        ? { scale: 1.05, filter: 'saturate(200%) brightness(1.5)', boxShadow: '0 0 40px 10px rgba(197,160,89,0.8)' }
                                        : { opacity: 1, scale: 1, boxShadow: '0 0 20px 2px rgba(197,160,89,0.5)', filter: 'saturate(100%) brightness(1)' }
                                    }
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    onClick={() => {
                                        if (isGrid9Shattered) return;
                                        setIsGrid9Shattered(true);
                                        // AudioManager?.playSfx('transition', 0.7); // Removed per user request
                                        setTimeout(() => {
                                            setShowInstaGallery(true);
                                            // Pre-load audio for the actual merge later
                                            // handleRulesMerge();
                                        }, 800);
                                    }}
                                    className="w-full h-full relative flex flex-col items-center justify-center text-center p-2 border-2 border-[#C5A059] bg-[#1A1612]/70 cursor-pointer hover:bg-[#1A1612]/40 transition-colors backdrop-blur-md rounded-lg"
                                >
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}>
                                        <LucideEye size={36} className="mb-2 text-[#C5A059] drop-shadow-[0_0_8px_rgba(197,160,89,1)]" />
                                    </motion.div>
                                    <span className="font-black uppercase leading-none mb-1 text-[#C5A059] text-[12px] tracking-widest drop-shadow-md">AWARENESS</span>
                                    <span className="font-serif italic leading-tight uppercase text-[#FDFCF0] opacity-90 text-[8px]">No Artificial Empathy</span>
                                </motion.div>
                            </div>
                        );
                    }

                    return (
                        <motion.div
                            key={`slot-${i}`}
                            animate={
                                phaseInvisible 
                                ? { opacity: 0.05, filter: 'grayscale(100%) brightness(0.2)', scale: 1, boxShadow: 'none' }
                                : applyDimming 
                                ? { opacity: 1, filter: 'grayscale(100%) brightness(0.3)', scale: 1, boxShadow: 'none' }
                                : isSealed
                                ? (isOriginalOfStaged 
                                    ? { opacity: 1, scale: 1.05, boxShadow: '0 0 40px rgba(197,160,89,1)', filter: 'brightness(1.2) saturate(1.2) sepia(0) hue-rotate(0deg)' }
                                    : { opacity: 0.5, scale: 0.95, boxShadow: 'none', filter: 'grayscale(100%) brightness(0.2) sepia(0) hue-rotate(0deg)' })
                                : (countdownTime !== null && !isOriginalOfStaged
                                    ? { 
                                        opacity: 1,
                                        filter: [
                                            'brightness(0.2) saturate(0.2) sepia(0.8) hue-rotate(-15deg)', 
                                            'brightness(1.5) saturate(1.2) sepia(0)',                      
                                            'brightness(0.2) saturate(0.2) sepia(0.8) hue-rotate(-15deg)'  
                                        ],
                                        scale: [0.98, 1.03, 0.98],
                                        boxShadow: [
                                            '0 0 0px rgba(197,160,89,0)', 
                                            '0 0 30px rgba(197,160,89,0.8)', 
                                            '0 0 0px rgba(197,160,89,0)'
                                        ]
                                    }
                                    : { opacity: 1, scale: 1, boxShadow: 'none', filter: 'brightness(1) saturate(1) sepia(0) hue-rotate(0deg)' }
                                )
                            }
                            transition={
                                countdownTime !== null && !isOriginalOfStaged && !isSealed
                                ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: getWaveDelay(i) }
                                : { duration: 0.5, ease: 'easeOut' }
                            }
                            className={`relative aspect-[4/5] w-full transition-opacity transition-filter duration-300 ${isFocused ? 'z-[50]' : ''} ${(applyDimming || (isSealed && isDimmed && !showGalleryTiles) || phaseInvisible) && pos !== 'center' ? 'pointer-events-none' : ''} ${(selectedPath === 'vote' && (i === 5 || i === 6)) || (selectedPath === 'game' && (i === 0 || i === 1)) ? 'ring-2 ring-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.4)] z-[6000]' : ''}`}
                        >

                            <div className={`absolute inset-0 transition-opacity duration-1000 ${showGalleryTiles && !isOriginalOfStaged ? 'opacity-0' : 'opacity-100'}`}>
                                <LanguageCard lang={lang} idx={pos} isFocused={isFocused} isStaged={isStaged} isDimmable={isDimmable} onFocus={onCardFocus} onReady={onCardReady} onSelect={onCardSelect} AudioManager={AudioManager} />
                            </div>

                            {/* Original Insta Images during hold */}
                            <div className={`absolute inset-0 transition-opacity duration-[2000ms] ${isSealed && !isHidden && !showGalleryTiles ? 'opacity-100' : 'opacity-0'} pointer-events-none rounded-lg overflow-hidden`}>
                                <img src={`/assets/manual_upload/insta/img${instaImgIndex}.png`} alt={`Instagram ${instaImgIndex}`} className="w-full h-full object-cover" />
                            </div>

                            {/* New Gallery Tiles after 10s */}
                            {showGalleryTiles && (
                                <div className={`absolute inset-0 transition-opacity duration-[2000ms] opacity-100 pointer-events-none rounded-lg overflow-hidden ${isOriginalOfStaged ? 'ring-2 ring-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.6)]' : ''}`}>
                                    <img src={`/assets/manual_upload/insta/tile_${i + 1}.png`} alt={`Tile ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {MinaDirective && phase !== 'LANGUAGE_QUEST' && phase !== 'AWARENESS' && (
                <div className={`fixed top-4 md:top-8 inset-x-0 pointer-events-none z-[5000] flex justify-center`}>
                    <div className="w-full max-w-5xl px-4 md:px-8 mx-auto flex justify-center h-fit max-h-[calc(100vh-80px)] md:max-h-[calc(100vh-140px)]">
                        <MinaDirective
                            isVisible={true}
                            activeStep={phase === 'AWARENESS' ? 'awareness' : 'language'}
                            text={minaText}
                            position="top"
                            interactionMode={isIntroActive ? 'reading' : 'action'}
                            sysName={minaText.includes("나의 씰") ? "나의 씰 (My Seal)" : (focusedLang?.ui?.minaSystem || "SEAN'S COMMENT")}
                            actionReq={focusedLang?.ui?.minaAction || ">> ACTION REQUIRED: SELECT A MULTIVERSE <<"}
                            isSpeaking={isMinaSpeaking}
                            badges={earnedBadges}
                            ui={focusedLang?.ui || {}}
                            dynamicMaxHeight="100%"
                            forceExpanded={isSealed && !forceFolded}
                            forceFolded={forceFolded}
                            onToggleResize={() => setForceFolded(!forceFolded)}
                        />
                    </div>
                </div>
            )}

            {/* INSTA IMAGES FULLSCREEN MODAL */}
            <AnimatePresence>
                {showInstaGallery && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Close/Proceed Button */}
                        <button
                            onClick={() => {
                                setShowInstaGallery(false);
                                if (phase === 'AWARENESS') {
                                    onAwarenessComplete?.();
                                } else {
                                    handleRulesMerge();
                                }
                            }}
                            className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-md border border-white/20 text-white/70 hover:text-white transition-all shadow-xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {/* Image Viewer Action Area */}
                        <div
                            className="w-full h-full relative flex items-center justify-center cursor-pointer select-none"
                            onClick={() => {
                                AudioManager?.playSfx('piano-mystic-high', 0.5);
                                if (instaGalleryIndex < 3) {
                                    setInstaGalleryIndex(prev => prev + 1);
                                } else {
                                    setShowInstaGallery(false);
                                    if (phase === 'AWARENESS') {
                                        onAwarenessComplete?.();
                                    } else {
                                        handleRulesMerge();
                                    }
                                }
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={`insta-img-${instaGalleryIndex}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                    src={`/assets/manual_upload/insta/tile_9_add/${instaGalleryIndex}.png`}
                                    alt={`Awareness Slide ${instaGalleryIndex}`}
                                    className="w-full h-auto max-h-screen object-contain drop-shadow-[0_0_50px_rgba(197,160,89,0.15)]"
                                />
                            </AnimatePresence>

                            {/* Pagination Dots */}
                            <div className="absolute bottom-8 flex gap-3 z-10">
                                {[1, 2, 3].map(num => (
                                    <div
                                        key={num}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${instaGalleryIndex === num ? 'bg-[#C5A059] scale-125' : 'bg-white/20'}`}
                                    />
                                ))}
                            </div>

                            {/* Visual Hint */}
                            <div className="absolute top-8 text-white/50 text-[10px] uppercase tracking-[0.3em] font-black animate-pulse bg-black/40 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
                                TAP TO ADVANCE
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;
