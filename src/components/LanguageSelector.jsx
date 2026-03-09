import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideCompass, LucideCheck, LucideEye } from 'lucide-react';

// Assuming AudioManager, MinaDirective, and calculateArchetype are provided via props or imported
// For isolation, they would ideally be context or imported directly, but we assume they are globally available or passed down where needed

const LanguageCard = ({ lang, isFocused, isStaged, isDimmable, onFocus, onReady, onSelect, AudioManager }) => {
    const [saturationProgress, setSaturationProgress] = useState(0);
    const [isShakePaused, setIsShakePaused] = useState(false);
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

                if (elapsed >= 2500 && stage < 1) { // 2.5 sec jump
                    [...Array(3)].forEach(() => AudioManager?.playSfx('piano-mystic-low', 0.7, true));
                    setTimeout(() => { setIsShakePaused(true); setTimeout(() => setIsShakePaused(false), 400); }, 100);
                    stage = 1;
                } else if (elapsed >= 3500 && stage < 2) { // 3.5 sec jump
                    AudioManager?.playSfx('piano-mystic-mid', 0.42, true);
                    setTimeout(() => { setIsShakePaused(true); setTimeout(() => setIsShakePaused(false), 400); }, 100);
                    stage = 2;
                } else if (elapsed >= 4500 && stage < 3) { // 4.5 sec
                    AudioManager?.playSfx('piano-mystic-high', 0.56, true);
                    setTimeout(() => { setIsShakePaused(true); setTimeout(() => setIsShakePaused(false), 400); }, 100);
                    if (onReady) onReady({ ...lang, requestBackground: true });
                    stage = 3;
                }

                if (elapsed >= duration) { // 5.5 sec total completion
                    clearInterval(animInterval.current);
                    const currentSrc = AudioManager?.currentTheme?.src || "";
                    if (currentSrc.split('/').pop() !== `${lang.id}-theme.mp3`) {
                        AudioManager?.playTheme(lang.id, 0.28, 3000);
                    }
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

    const handleDragEnd = (event, info) => {
        if (!isFocused || saturationProgress < 100 || isStaged) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        let dropX = info.point.x;
        let dropY = info.point.y;

        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            dropX = rect.left + rect.width / 2;
            dropY = rect.top + rect.height / 2;
        }

        const dist = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));
        const dropRadius = Math.max(120, Math.min(window.innerWidth, window.innerHeight) * 0.25);

        if (dist < dropRadius) {
            AudioManager?.playSfx('shutter', 0.6);
            onSelect(lang);
        }
    };

    const isDraggable = isFocused && saturationProgress === 100 && !isStaged;

    return (
        <motion.div
            ref={cardRef}
            onClick={() => {
                if (!isFocused && !isStaged) onFocus(lang);
            }}
            drag={isDraggable}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            whileDrag={isDraggable ? { scale: 1.1, zIndex: 1000, rotate: 2 } : {}}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isDimmable ? 0.3 : 1,
                scale: isStaged ? 1 : (isFocused ? (saturationProgress === 100 && !isStaged ? [1.05, 1.08, 1.05] : 1.05) : 1),
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
                scale: isFocused && saturationProgress === 100 && !isStaged
                    ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                    : { type: 'spring', damping: 25, stiffness: 120 }
            }}
            className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl select-none transition-shadow ${isFocused && !isStaged ? 'shadow-[0_0_80px_rgba(197,160,89,0.4)] ring-2 ring-[#C5A059]' : 'cursor-pointer hover:ring-1 hover:ring-white/20'}`}
            style={{ touchAction: 'none' }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-100"
                style={{
                    backgroundImage: `url(${lang.image})`,
                    transform: 'scale(1.5)',
                    filter: isFocused
                        ? (saturationProgress < 45.45 ? `saturate(${0.1 + (0.2 * (saturationProgress / 45.45))}) grayscale(${80 - (50 * (saturationProgress / 45.45))}%) brightness(${0.1 + (0.2 * (saturationProgress / 45.45))})`
                            : saturationProgress < 63.63 ? 'saturate(0.7) grayscale(30%) brightness(0.7)'
                                : saturationProgress < 81.81 ? 'saturate(1) grayscale(0%) brightness(1)'
                                    : 'saturate(1.2) grayscale(0%) brightness(1.3) drop-shadow(0 0 10px rgba(197,160,89,0.8))')
                        : (isStaged ? 'saturate(1) grayscale(0%)' : 'saturate(0) grayscale(100%) brightness(0.5)'),
                }}
            />

            {isFocused && saturationProgress < 100 && (
                <div className="absolute bottom-0 left-0 h-2 bg-[#C5A059] z-40 transition-all duration-75" style={{ width: `${saturationProgress}%` }} />
            )}

            {isFocused && saturationProgress === 100 && !isStaged && (
                <motion.div animate={{ opacity: [0, 0.3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 border-4 border-[#C5A059] pointer-events-none z-40" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 opacity-60 pointer-events-none" />

            <div className="absolute inset-0 p-1 md:p-2 flex flex-col items-center justify-center z-30 text-center pointer-events-none">
                <h3 className={`text-base md:text-3xl font-black text-white font-serif uppercase tracking-widest leading-none mb-1 md:mb-2 transition-transform duration-500 ${isFocused ? 'scale-110 drop-shadow-[0_0_10px_rgba(197,160,89,0.8)] text-[#FDFCF0]' : ''}`}>
                    {lang.name}
                </h3>
                <div className="w-full flex justify-center items-center px-1 overflow-visible">
                    <motion.span animate={{ y: isFocused || isStaged ? 0 : 10 }} className="text-xs md:text-lg text-[#C5A059] uppercase tracking-[0.1em] md:tracking-[0.2em] font-black block leading-tight text-center">
                        {isStaged ? lang.ui.fateSealed : (saturationProgress === 100 ? lang.ui.drag : (isFocused ? `${lang.ui.sync} ${Math.round(saturationProgress)}%` : lang.ui.tap))}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

const LanguageSelector = ({ LANGUAGES, handleLanguageSelect, setSpiritHint, cardsExplored, setCardsExplored, isMinaSpeaking, earnedBadges, onEarnBadge, AudioManager, MinaDirective, calculateArchetype, selectedPath, isWipReached, onWipReached, phase, onAwarenessComplete, onSealComplete }) => {
    const [focusedLang, setFocusedLang] = useState(null);
    const [stagedLang, setStagedLang] = useState(null);
    const [minaText, setMinaText] = useState("");
    const [activeBackground, setActiveBackground] = useState(null);
    const [isIntroActive, setIsIntroActive] = useState(true);
    const [isSealed, setIsSealed] = useState(false);
    const [isRulesMerged, setIsRulesMerged] = useState(false);
    const [isMerging, setIsMerging] = useState(false);
    const [focusPhase, setFocusPhase] = useState(false);
    const [showGalleryTiles, setShowGalleryTiles] = useState(false);
    const [isGrid9Shattered, setIsGrid9Shattered] = useState(false);
    const [showInstaGallery, setShowInstaGallery] = useState(false);
    const [instaGalleryIndex, setInstaGalleryIndex] = useState(1);
    const [forceFolded, setForceFolded] = useState(false);

    // [V2] Use Refs for target bounding rects (Phase 2 Drag & Drop)
    const gridRefs = useRef([]);
    const [droppedTarget, setDroppedTarget] = useState(null);

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
        return () => clearTimeout(overlayTimer);
    }, [introSentence]);

    const onCardFocus = (lang) => {
        if (setCardsExplored) {
            setCardsExplored(prev => {
                const newSet = new Set(prev);
                newSet.add(lang.id);
                return newSet;
            });
        }
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
        }
    };

    const [holdProgress, setHoldProgress] = useState(0);
    const holdIntervalRef = useRef(null);

    const startHold = () => {
        if (!stagedLang) return;
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

        AudioManager?.playSfx('piano-mystic-low', 1.0, true);
        AudioManager?.playSfx('piano-mystic-mid', 0.9, true);

        setMinaText(stagedLang.ui.sync + '...');
        setHoldProgress(0);
        holdIntervalRef.current = setInterval(() => {
            setHoldProgress(prev => {
                const next = prev + (100 / (5000 / 50));
                if (next >= 100) {
                    clearInterval(holdIntervalRef.current);
                    holdIntervalRef.current = null;
                    return 100;
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

    useEffect(() => {
        if (holdProgress >= 100 && stagedLang && !isSealed) {
            setIsSealed(true);
            setMinaText("앵커 확정 성공!");

            // Trigger global language select (which now only updates audio out of the box, no redirect)
            if (handleLanguageSelect) {
                handleLanguageSelect(stagedLang);
            }

            if (phase === 'LANGUAGE_QUEST') {
                setTimeout(() => {
                    onSealComplete?.();
                }, 1000); // Slight delay for UX
            } else {
                // Phase 2: AWARENESS 포커싱 시퀀스 발동
                setTimeout(() => {
                    setShowGalleryTiles(true);
                    setForceFolded(true); // SEAN'S COMMENT 원래 크기로 축소 (최소화)

                    setFocusPhase(true);
                    setMinaText("[🎙️ SEAN'S COMMENT]\nPlease engrave the rules of the Multiverse (Awareness) into your body first.");
                    AudioManager?.playSfx('piano-mystic-low', 0.8);
                    AudioManager?.playSfx('shutter', 0.6);
                }, 10000);
            }

            cancelHold();
        }
    }, [holdProgress, stagedLang, isSealed, AudioManager, handleLanguageSelect]);

    // --- Phase 3: WIP State Trigger ---
    useEffect(() => {
        if (holdProgress >= 100 && isSealed && droppedTarget && !isWipReached) {
            cancelHold(); // Reset holdProgress immediately to prevent loops
            if (onWipReached) onWipReached();
            setMinaText("System Pause : 해당 차원의 건축이 아직 진행 중입니다. 다음 업데이트를 기다려 주십시오.");
        }
    }, [holdProgress, isSealed, droppedTarget, isWipReached, onWipReached]);

    const handleRulesMerge = () => {
        if (isMerging || isRulesMerged) return;
        setIsMerging(true);

        AudioManager?.playSfx('piano-mystic-high', 1.0, true);
        AudioManager?.playSfx('transition', 0.7, true);

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
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setHoldProgress(prev => {
            if (isSealed) return 0; // IF ALREADY SEALED, DO NOT OVERRIDE TEXT

            if (prev > 0 && prev < 100 && stagedLang) {
                setMinaText(stagedLang.id === 'ko' ? "▶️ 계속 5초간 길게 누르세요." : (stagedLang.ui?.holdMore || "▶️ Keep holding for 5 seconds."));
            } else if (prev === 0 && stagedLang) {
                setMinaText(stagedLang.ui.directiveConfirm);
            }
            return 0;
        });
    };

    const handleAnchorSelect = (lang) => {
        setStagedLang(lang);

        AudioManager?.playSfx('piano-mystic-high', 1.0, true);
        AudioManager?.playSfx('transition', 0.7, true);

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

    return (
        <div className="w-full mx-auto h-full flex flex-col items-center justify-center p-0 md:p-8 overflow-hidden md:overflow-visible relative" style={{ touchAction: 'none', overscrollBehavior: 'none' }}>
            <div className="fixed inset-0 z-[-1] bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: "url('/assets/click_anywhere_bg.jpg')", filter: "blur(6px)" }} />
            <div className={`fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-[3000ms] pointer-events-none ${activeBackground ? 'opacity-70' : 'opacity-0'}`} style={activeBackground ? { backgroundImage: `url(${activeBackground})` } : {}} />
            <div className={`fixed inset-0 z-[4900] bg-black/80 backdrop-blur-md transition-opacity duration-1000 pointer-events-none ${isSealed && !showGalleryTiles ? 'opacity-100' : 'opacity-0'}`} />

            <div id="language-grid" className={`w-full grid grid-cols-3 grid-rows-3 gap-1 md:gap-4 bg-black/40 backdrop-blur-3xl p-1 md:p-6 border border-white/5 rounded-lg md:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-1000 ${isIntroActive ? 'opacity-40 blur-sm scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] animate-pulse pointer-events-none" />

                {[0, 1, 2, 3, 'center', 4, 5, 6, 7].map((pos, i) => {
                    if (pos === 'center') {
                        return (
                            <div key="center-slot" className="relative z-50">
                                <AnimatePresence mode="wait">
                                    {stagedLang ? (
                                        <motion.div
                                            key={stagedLang.id}
                                            initial={{ scale: 0, opacity: 0, rotate: -20 }}
                                            animate={droppedTarget ? { scale: 0, opacity: 0 } : { scale: holdProgress > 0 ? 1 + (holdProgress / 100) * 0.5 : 1, opacity: 1, rotate: 0 }}
                                            onPointerDown={(e) => { if (!selectedPath) e.target.setPointerCapture(e.pointerId); startHold(); }}
                                            onPointerUp={(e) => { if (!selectedPath) e.target.releasePointerCapture(e.pointerId); cancelHold(); }}
                                            onPointerCancel={cancelHold}
                                            drag={!!selectedPath}
                                            dragSnapToOrigin={!droppedTarget}
                                            dragElastic={0.6}
                                            onDragEnd={(e, info) => {
                                                if (!selectedPath) return;
                                                const point = { x: info.point.x, y: info.point.y };
                                                let isValidDrop = false;

                                                const checkTarget = (index) => {
                                                    const ref = gridRefs.current[index];
                                                    if (!ref) return false;
                                                    const rect = ref.getBoundingClientRect();
                                                    return (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom);
                                                };

                                                if (selectedPath === 'vote') {
                                                    // 6번 (i=5), 7번 (i=6)
                                                    if (checkTarget(5) || checkTarget(6)) isValidDrop = true;
                                                } else if (selectedPath === 'game') {
                                                    // 1번 (i=0), 2번 (i=1)
                                                    if (checkTarget(0) || checkTarget(1)) isValidDrop = true;
                                                }

                                                if (isValidDrop) {
                                                    AudioManager.playSfx('confirm', 0.8);
                                                    setDroppedTarget(true);
                                                    // User prompt mentions "선택된 경로에 따른 드래그 타겟 활성화" but does not define what happens *after* a valid drop!
                                                    // Temporarily, we just unmount or play confirmed sound. The snapping is cancelled by `dragSnapToOrigin={!droppedTarget}`.
                                                } else {
                                                    // Snap to origin automatically handled by framer motion.
                                                }
                                            }}
                                            whileDrag={!!selectedPath ? { scale: 1.1, zIndex: 9000 } : {}}
                                            className="w-full h-full z-[2000] cursor-pointer relative"
                                        >
                                            <div className="absolute -inset-4 bg-[#C5A059]/10 blur-xl pointer-events-none transition-opacity" style={{ opacity: holdProgress / 100 }} />
                                            <LanguageCard
                                                lang={stagedLang}
                                                isFocused={true}
                                                isStaged={true}
                                                onFocus={() => { }}
                                                onSelect={() => { }}
                                                onReady={() => { }}
                                                AudioManager={AudioManager}
                                            />
                                            <div className="absolute inset-0 z-[800] flex flex-col items-center justify-center w-full h-full pointer-events-none">
                                                {/* Expanding center shape and early click handler removed per user feedback */}
                                                <AnimatePresence>
                                                    {isRulesMerged && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0, rotate: -90 }}
                                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.8 }}
                                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center justify-center w-20 h-20 bg-black/70 backdrop-blur-lg rounded-full shadow-[0_0_30px_rgba(197,160,89,1),inset_0_0_15px_rgba(197,160,89,0.5)] border border-[#C5A059]/80 pointer-events-none"
                                                        >
                                                            <LucideEye size={36} className="text-[#C5A059] drop-shadow-[0_0_12px_rgba(253,252,240,0.8)]" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div className="absolute inset-x-0 -bottom-8 md:-bottom-10 z-[800] flex flex-col items-center justify-end w-full pointer-events-none px-4">
                                                {/* Trendy Progress Pill Box perfectly centered at the bottom */}
                                                {!isRulesMerged && (
                                                    <motion.div
                                                        initial={{ y: 10, opacity: 0, scale: 0.9 }}
                                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                                        exit={{ y: 10, opacity: 0, scale: 0.9 }}
                                                        className="w-[120%] max-w-[200px] mx-auto bg-black/70 backdrop-blur-xl border border-[#C5A059]/30 rounded-full px-5 py-2.5 flex flex-col items-center justify-center gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(197,160,89,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none z-[300]"
                                                    >
                                                        <div className="flex items-center gap-3 w-full justify-center">
                                                            <span className="text-[#FDFCF0] text-[10px] md:text-sm font-serif uppercase tracking-[0.2em] md:tracking-[0.3em] text-center leading-none" style={{ textShadow: "0 0 10px rgba(197,160,89,0.5)" }}>
                                                                {holdProgress >= 100 ? (stagedLang?.ui?.aligned || "ALIGNED") : (stagedLang?.ui?.harmonizing || "HARMONIZING")}
                                                            </span>
                                                            <span className="text-[#C5A059] text-[10px] md:text-sm font-mono font-bold tracking-wider leading-none">
                                                                {Math.round(holdProgress)}%
                                                            </span>
                                                        </div>

                                                        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                                                            <motion.div
                                                                className="h-full bg-gradient-to-r from-[#C5A059]/30 via-[#C5A059] to-[#FDFCF0] rounded-full shadow-[0_0_10px_rgba(197,160,89,1)]"
                                                                style={{ width: `${holdProgress}%` }}
                                                                transition={{ ease: "linear", duration: 0.1 }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="instruction" animate={{ borderColor: focusedLang ? ['rgba(197,160,89,0.2)', 'rgba(197,160,89,0.8)', 'rgba(197,160,89,0.2)'] : 'rgba(255,255,255,0.1)', boxShadow: focusedLang ? ['0 0 10px rgba(197,160,89,0)', '0 0 30px rgba(197,160,89,0.4)', '0 0 10px rgba(197,160,89,0)'] : 'none' }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-white/5 border-2 rounded-xl border-dashed w-full h-full">
                                            <LucideCompass className={`${focusedLang ? 'text-[#C5A059] animate-spin-slow scale-150' : 'text-white/40 scale-125'} mb-4 transition-all`} size={40} />
                                            <h2 className={`text-[9px] sm:text-[10px] md:text-sm font-black ${focusedLang ? 'text-[#C5A059]' : 'text-white/40'} uppercase tracking-widest md:tracking-[0.3em] leading-snug px-1 break-words text-center transition-colors`}>
                                                {focusedLang ? focusedLang.ui.drag : 'ANCHOR'}
                                            </h2>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }

                    const lang = LANGUAGES[pos];
                    const isFocused = focusedLang?.id === lang?.id;
                    const isStaged = stagedLang?.id === lang?.id;
                    const isDimmable = focusedLang && focusedLang.id !== lang?.id;
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
                            <div key={`slot-${i}`} ref={(el) => gridRefs.current[i] = el} className="relative aspect-[4/5] w-full z-[8000]">
                                {/* Background Image for Grid 9 */}
                                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                                    <img src={`/assets/manual_upload/insta/tile_9.png`} alt="Grid 9 BG" className="w-full h-full object-cover" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={isGrid9Shattered
                                        ? { opacity: 0, scale: 1.1, filter: 'blur(10px)' }
                                        : { opacity: 1, scale: 1, boxShadow: '0 0 20px 2px rgba(197,160,89,0.5)' }
                                    }
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    onClick={() => {
                                        if (isGrid9Shattered) return;
                                        setIsGrid9Shattered(true);
                                        AudioManager?.playSfx('transition', 0.7);
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
                        <div
                            key={`slot-${i}`}
                            ref={(el) => gridRefs.current[i] = el}
                            className={`relative aspect-[4/5] w-full transition-all duration-300 ${isFocused ? 'z-[50]' : ''} ${(applyDimming || (isSealed && isDimmed && !showGalleryTiles) || phaseInvisible) && pos !== 'center' ? 'pointer-events-none' : ''} ${(selectedPath === 'vote' && (i === 5 || i === 6)) || (selectedPath === 'game' && (i === 0 || i === 1)) ? 'ring-2 ring-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.4)] z-[6000]' : ''}`}
                            style={{
                                opacity: phaseInvisible ? 0.05 : (isOriginalOfStaged ? (showGalleryTiles ? 1 : 0) : (isSealed ? (isDimmed ? (showGalleryTiles ? 1 : 0.2) : 1) : Math.max(0, 1 - (holdProgress / 100) * 1.5))),
                                filter: applyDimming ? 'grayscale(100%) brightness(0.3)' : ((isSealed && isDimmed && !showGalleryTiles) ? 'grayscale(100%) brightness(0.5)' : (phaseInvisible ? 'grayscale(100%) brightness(0.2)' : 'none'))
                            }}
                        >
                            <div className={`absolute inset-0 transition-opacity duration-1000 ${isSealed && !showGalleryTiles ? 'opacity-0' : (showGalleryTiles && !isOriginalOfStaged ? 'opacity-0' : 'opacity-100')}`}>
                                {!isOriginalOfStaged && (
                                    <LanguageCard lang={lang} idx={pos} isFocused={isFocused} isStaged={false} isDimmable={isDimmable || stagedLang} onFocus={onCardFocus} onReady={onCardReady} onSelect={onCardSelect} AudioManager={AudioManager} />
                                )}
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
                        </div>
                    );
                })}
            </div>

            {MinaDirective && (
                <div className={`fixed top-4 md:top-8 inset-x-0 pointer-events-none z-[5000] flex justify-center`}>
                    <div className="w-full max-w-5xl px-4 md:px-8 mx-auto flex justify-center">
                        <MinaDirective isVisible={true} activeStep="language" text={minaText} position="top" interactionMode={isIntroActive ? 'reading' : 'action'} sysName={minaText.includes("나의 씰") ? "나의 씰 (My Seal)" : (focusedLang?.ui?.minaSystem || "SEAN'S COMMENT")} actionReq={focusedLang?.ui?.minaAction || ">> ACTION REQUIRED: SELECT A MULTIVERSE <<"} isSpeaking={isMinaSpeaking} badges={earnedBadges} ui={focusedLang?.ui || {}} dynamicMaxHeight={expandedHeight} forceExpanded={isSealed && !forceFolded} forceFolded={forceFolded} onToggleResize={() => setForceFolded(!forceFolded)} />
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
                                AudioManager?.playSfx('click', 0.5);
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
