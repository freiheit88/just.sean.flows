import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Volume2, VolumeX, Sliders, Play, Pause, 
    Download, Music, Check, ThumbsUp, ArrowRight, 
    Compass, ExternalLink, QrCode, ChevronDown, RotateCcw, Zap, Flame, Mic, Building2, X, Globe, ShieldCheck, Activity,
    Key, Lock, Tag, Ticket, Shield, Sparkles, ChevronUp, Footprints, RefreshCw, Disc, Radio, Terminal, Cpu, Layers
} from 'lucide-react';

const SECRET_YOUTUBE_URL = "https://www.youtube.com/watch?v=RUoWgJDZ0M8&t=1330s";
const ATELIER_IMG = "/assets/frankfurt_sound_atelier.jpg";
const MR_AUDIO_SRC = "/assets/a_twelve_minute_alibi_mr.wav";

// Full 7-Step 1st-Person Walkthrough Story Sequence
const FRAMES = [
    { 
        id: 0, 
        src: "/assets/walk_story_01_far_alley.jpg", 
        titleTop: "JUST SEAN FLOWS", 
        titleMain: "WALK WITH MUSIC?", 
    },
    { 
        id: 1, 
        src: "/assets/walk_story_02_mid_alley.jpg", 
        titleTop: "GUILD ATELIER", 
        titleMain: "HEAR THE TUNING?", 
    },
    { 
        id: 2, 
        src: "/assets/walk_story_03_corner_turn.jpg", 
        titleTop: "02:00 AM", 
        titleMain: "STILL AWAKE HERE.", 
    },
    { 
        id: 3, 
        src: "/assets/walk_story_04_look_up_logo.jpg", 
        titleTop: "LOOK UP", 
        titleMain: "PEEK AT THE LOGO?", 
        hasBuildingTarget: true
    },
    { 
        id: 4, 
        src: "/assets/walk_story_05_amber_glow_shift.jpg", 
        titleTop: "GLOWING AMBER", 
        titleMain: "THE LIGHTS AWAKEN.", 
        hasBuildingTarget: true
    },
    { 
        id: 5, 
        src: "/assets/walk_story_06_door_handle_view.jpg", 
        titleTop: "REACH THE DOOR", 
        titleMain: "TOUCH THE HANDLE.", 
    },
    { 
        id: 6, 
        src: "/assets/walk_story_07_grand_piano_salon.jpg", 
        titleTop: "STAGE READY", 
        titleMain: "THE DOORS OPEN.", 
    }
];

const DEFAULT_ENDING = {
    id: 'virtuoso',
    title: 'THE MIDNIGHT VIRTUOSO',
    subtitle: '02:00 AM Violin Cadenza Solitude',
    desc: 'Deeply enchanted by 44.1s Paganini cadenza. A nocturnal aesthete pursuing sharp thrills in silence.',
    accent: '#E7FF00',
    quote: 'Holding a cold martini, captivated by solo violin at midnight.'
};

// 120 INTERACTIVE ATELIER 3D FRAGMENTS & SOUND SCULPTURES
const ATELIER_100_WORDS = [
    "CADENZA", "ALLEGRO", "TUTTI", "FORTE", "TEMPO 128", 
    "44.1 kHz", "24-BIT STEREO", "VIBRATO", "OVERTONE", "REVERB 85%",
    "FERMATA 𝄐", "SOLO VIOLIN", "NOIR BASS", "AMP FEEDBACK", "STEINWAY",
    "DEEP ECHO", "HARMONICS", "CRESCENDO", "SUB-BASS 30Hz", "PAGANINI 44.1s",

    "ROOM #65", "#065 WINE", "LOGO NO.65", "STEM #01", "STEM #02",
    "STEM #03", "STEM #04", "SERIES 2026", "EDITION 1/1", "GUILD #065",
    "FRAME #07", "LABEL NO.65", "VAULT 065", "TUBE 80.12", "RESERVE #65",
    "KEY #065", "CODE 0200", "PASS #065", "STAGE #01", "DECAL NO.65",

    "FRANKFURT", "ALTE OPER", "CONCERT PALACE", "STAGE DOOR", "VIP ALL-ACCESS",
    "CANAL ALLEY", "LETTERPRESS", "WINE & TREBLE", "TUBE AMP", "BRONZE EMBLEM",
    "24/7 SOUND LAB", "HYBRID DSP", "GERMANY 2026", "FLASHLIGHT ALLEY", "MIDNIGHT SALON",
    "GOLD LEAF", "DOOR KNOCKER", "GLASS DECAL", "WOVEN TAPESTRY", "SHEFFIELD GRIT",

    "'WALK WITH MUSIC?'", "'MIDNIGHT SOLITUDE'", "'VELVET DISTORTION'", "'CHAMPAGNE NOCTURNE'", "'CRYSTAL FLUTE'",
    "'ALMOST AT THE DOOR'", "'THE DOORS OPEN'", "'COLD MARTINI'", "'PRIVATE SKETCH'", "'STILL AWAKE HERE'",
    "'PEEK INSIDE?'", "'MY PRIVATE HAVEN'", "'STAGE READY'", "'HARMONY SCULPTOR'", "'NIGHT VELOCITY'",
    "'DECORUM SHATTERED'", "'HEAVY NOIR BASS'", "'SOVEREIGN ARCHITECT'", "'SYSTEMS & FREQUENCIES'", "'NOCTURNAL AESTHETE'",

    "🔑", "🗝️", "🔒", "⚜", "§", "¶", "⚜ GUILD", "🔑 ROOM 65", "🗝️ SECRET VAULT", "🔒 PRIVATE DOOR",
    "⚜ EMBLEM", "§ 02:00 AM", "¶ LESSON 65", "🔑 KEY TO HAVEN", "🗝️ CONCERT HALL", "🔒 PASSKEY",
    "⚜ ATELIER", "§ SERENADE", "¶ NOCTURNE", "just.sean.flows"
];

const ATELIER_DEBRIS_100 = ATELIER_100_WORDS.map((text, i) => {
    const isEmoji = ["🔑", "🗝️", "🔒", "⚜", "§", "¶"].includes(text);
    const shapeCategory = isEmoji ? 6 : (i % 6);
    
    const colors = ['#E7FF00', '#00F0FF', '#FF0055', '#FFFFFF', '#C5A059', '#A855F7', '#10B981'];
    const color = colors[(i * 3 + (i % 7)) % colors.length];

    const fontFamilies = [
        "font-mono font-bold", 
        "font-sans font-black", 
        "font-serif italic font-medium", 
        "font-mono font-light", 
        "font-sans font-extrabold uppercase", 
        "font-serif font-bold uppercase",
        "font-mono font-black"
    ];
    const fontFamily = fontFamilies[i % fontFamilies.length];

    const rotation = ((i * 13) % 45) - 22;
    const sizeClass = isEmoji ? "text-xl sm:text-3xl" : (i % 4 === 0 ? "text-xs sm:text-sm" : "text-[9px] sm:text-[11px]");

    const leftPercent = 3 + ((i * 19 + (i % 9) * 11) % 92);
    const distFromCenter = leftPercent - 50;
    const pullX = Math.abs(distFromCenter) < 38 ? (distFromCenter * -0.22) : 0;

    const isLarge = i % 3 === 0;
    const isMedium = i % 3 === 1;

    const zDepth = isLarge ? -180 : isMedium ? 20 : 140;
    const tiltMult = isLarge ? 0.6 : isMedium ? 1.4 : 2.8;

    return {
        id: i,
        text,
        shapeCategory,
        color,
        fontFamily,
        rotation,
        sizeClass,
        isEmoji,
        left: `${leftPercent}vw`,
        pullXPx: pullX * 4,
        delay: (i * 0.08) % 3.2,
        duration: isLarge ? 6.5 : isMedium ? 4.0 : 2.2,
        opacityMax: 0.45 + (i % 6) * 0.10,
        zDepth,
        tiltMult
    };
});

export default function App() {
    // Current Step: 'flipbook' -> 'grand_showcase_2026' (Locked)
    const [currentStep, setCurrentStep] = useState('flipbook');
    const [userNickname, setUserNickname] = useState("SEAN");
    const [activeEnding, setActiveEnding] = useState(DEFAULT_ENDING);
    const [showAtelierModal, setShowAtelierModal] = useState(false);

    // 3D Gyroscope & Mouse/Touch Parallax Orientation
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5, rawX: -100, rawY: -100, isHovered: false });
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    
    // 4 Musical Trailing Nodes for Smooth Afterimages
    const [trails, setTrails] = useState([
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 }
    ]);
    
    const targetPos = useRef({ x: -100, y: -100 });
    const currentTrails = useRef([
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 }
    ]);
    
    const spotlightRef = useRef(null);

    // 60FPS SMOOTH TRAIL LERP LOOP
    useEffect(() => {
        let animId;
        const lerpFactors = [0.32, 0.22, 0.16, 0.11];

        const updateTrails = () => {
            let prevX = targetPos.current.x;
            let prevY = targetPos.current.y;

            const updated = currentTrails.current.map((t, idx) => {
                const factor = lerpFactors[idx];
                t.x += (prevX - t.x) * factor;
                t.y += (prevY - t.y) * factor;
                prevX = t.x;
                prevY = t.y;
                return { x: t.x, y: t.y };
            });

            setTrails([...updated]);
            animId = requestAnimationFrame(updateTrails);
        };

        animId = requestAnimationFrame(updateTrails);
        return () => cancelAnimationFrame(animId);
    }, []);

    const [stems, setStems] = useState({
        violin: 85, electric: 60, bass: 75, orchestra: 90
    });

    // Mobile Gyroscope Device Orientation Listener
    useEffect(() => {
        const handleDeviceOrientation = (e) => {
            if (e.beta !== null && e.gamma !== null) {
                const normX = Math.max(-1, Math.min(1, e.gamma / 16));
                const normY = Math.max(-1, Math.min(1, e.beta / 16));
                setTilt({ x: normX, y: normY });
            }
        };

        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    }, []);

    const updatePointerPos = (clientX, clientY) => {
        const normX = (clientX / window.innerWidth - 0.5) * 2;
        const normY = (clientY / window.innerHeight - 0.5) * 2;

        targetPos.current = { x: clientX, y: clientY };
        setCursorPos({ x: clientX / window.innerWidth, y: clientY / window.innerHeight, rawX: clientX, rawY: clientY, isHovered: true });
        setTilt({ x: normX, y: normY });

        if (spotlightRef.current) {
            spotlightRef.current.style.transform = `translate3d(${clientX - 120}px, ${clientY - 120}px, 0)`;
        }
    };

    const handlePointerMove = (e) => {
        updatePointerPos(e.clientX, e.clientY);
    };

    const handleTouchMoveUnified = (e) => {
        if (e.touches && e.touches[0]) {
            updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    return (
        <div 
            onPointerMove={handlePointerMove}
            onTouchMove={handleTouchMoveUnified}
            onTouchStart={handleTouchMoveUnified}
            className="relative min-h-screen bg-[#050507] text-[#ECEBE4] font-sans antialiased selection:bg-[#E7FF00] selection:text-black overflow-hidden select-none fixed inset-0 flex items-center justify-center"
        >
            {/* 1. UNIFIED MOBILE & PC GLOW CURSOR */}
            {cursorPos.isHovered && trails.map((t, idx) => {
                const scales = [0.85, 0.65, 0.48, 0.32];
                const opacities = isScrollingUp ? [0.90, 0.75, 0.55, 0.38] : [0.65, 0.45, 0.28, 0.16];
                const colors = ['#E7FF00', '#00F0FF', '#E7FF00', '#C5A059'];
                
                return (
                    <div
                        key={`trail-${idx}`}
                        style={{
                            transform: `translate3d(${t.x - 14}px, ${t.y - 14}px, 0) scale(${scales[idx]})`,
                            opacity: opacities[idx],
                            willChange: 'transform, opacity'
                        }}
                        className="fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-150 flex items-center justify-center"
                    >
                        {idx === 0 && (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={colors[0]} className="filter drop-shadow-[0_0_8px_#E7FF00]">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                        )}
                        {idx === 1 && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={colors[1]} className="filter drop-shadow-[0_0_8px_#00F0FF]">
                                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
                            </svg>
                        )}
                        {idx === 2 && (
                            <div className="font-serif font-black text-xl text-[#E7FF00] drop-shadow-[0_0_8px_#E7FF00]">
                                𝄞
                            </div>
                        )}
                        {idx === 3 && (
                            <div className="font-mono font-black text-base text-[#C5A059] drop-shadow-[0_0_6px_#C5A059]">
                                ♯
                            </div>
                        )}
                    </div>
                );
            })}

            {/* MAIN FLASHLIGHT SPOTLIGHT */}
            <div 
                ref={spotlightRef}
                style={{
                    willChange: 'transform',
                    opacity: cursorPos.isHovered ? 1 : 0
                }}
                className={`fixed top-0 left-0 rounded-full pointer-events-none z-50 transition-all duration-200 mix-blend-screen ${
                    isScrollingUp 
                        ? 'w-[312px] h-[312px] -ml-[36px] -mt-[36px]' 
                        : 'w-[240px] h-[240px]'
                }`}
            >
                <div 
                    className={`w-full h-full rounded-full transition-all duration-300 filter blur-xl ${
                        isScrollingUp 
                            ? 'bg-radial from-[#E7FF00]/30 via-[#00F0FF]/18 to-transparent scale-110' 
                            : 'bg-radial from-[#E7FF00]/12 via-white/[0.03] to-transparent'
                    }`} 
                />

                <div 
                    className={`absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 flex items-center justify-center ${
                        isScrollingUp 
                            ? 'w-7 h-7 bg-[#E7FF00]/80 shadow-[0_0_25px_#E7FF00,0_0_40px_#00F0FF] scale-110' 
                            : 'w-4 h-4 bg-[#E7FF00]/60 shadow-[0_0_14px_#E7FF00]'
                    }`} 
                >
                    <Music className={`w-3 h-3 text-black transition-transform ${isScrollingUp ? 'scale-125' : 'scale-90'}`} />
                </div>

                {isScrollingUp && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -30, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#E7FF00] shadow-[0_0_15px_#E7FF00] flex items-center gap-1 font-mono text-[9px] font-black text-[#E7FF00] whitespace-nowrap tracking-wider"
                    >
                        <ChevronUp className="w-3 h-3 animate-bounce" />
                        <span>WALK FORWARD</span>
                    </motion.div>
                )}
            </div>

            {/* 2. REFINED SUBTLE GOLD/BLACK 3D HEADER */}
            <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 md:py-4 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto flex items-center justify-center gap-3 py-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_15px_#E7FF00] animate-pulse"></span>
                    <h1 
                        className="font-mono font-black text-base sm:text-lg tracking-[0.38em] uppercase text-[#E7FF00] relative select-none"
                        style={{
                            textShadow: '0 2px 0 #C5A059, 0 4px 0 #000000, 0 6px 18px rgba(231,255,0,0.65)'
                        }}
                    >
                        JUST.SEAN.FLOWS
                    </h1>
                </div>
            </header>

            <main className="relative z-10 w-full h-full flex items-center justify-center">
                {currentStep === 'flipbook' && (
                    <FlipbookWalkingEngine 
                        tilt={tilt}
                        cursorPos={cursorPos}
                        isScrollingUp={isScrollingUp}
                        setIsScrollingUp={setIsScrollingUp}
                        onFinishWalk={() => setCurrentStep('grand_showcase_2026')} 
                        onOpenAtelier={() => setShowAtelierModal(true)}
                    />
                )}

                {currentStep === 'grand_showcase_2026' && (
                    <Grand2026InteractiveCyberSalon 
                        tilt={tilt}
                        userNickname={userNickname}
                        setUserNickname={setUserNickname}
                        stems={stems}
                        setStems={setStems}
                        onOpenAtelier={() => setShowAtelierModal(true)}
                    />
                )}
            </main>

            {/* Frankfurt Sound Atelier Modal */}
            <AnimatePresence>
                {showAtelierModal && (
                    <FrankfurtAtelierModal onClose={() => setShowAtelierModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ==============================================================================
// 1인칭 보행 엔진 (100% 도달 시 영구 고정 2026 쇼케이스 화면으로 전환)
// ==============================================================================
function FlipbookWalkingEngine({ tilt, cursorPos, isScrollingUp, setIsScrollingUp, onFinishWalk, onOpenAtelier }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    
    // Audio Unlock State
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

    // Initial 3-Second Exploration Grace Period
    const [gracePeriodSec, setGracePeriodSec] = useState(3);
    const hasUserStartedScroll = useRef(false);

    // Live Power State (Pure UI Value)
    const [livePowerStr, setLivePowerStr] = useState("0");
    const [isTremblingAt8012, setIsTremblingAt8012] = useState(false);
    const [audioTier, setAudioTier] = useState(1);

    // SINGLE PURE MR AUDIO ELEMENT REF
    const mrAudioRef = useRef(null);

    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    const progressRef = useRef(0);
    const scrollUpTimerRef = useRef(null);

    // Power Reservoir & Level Floor
    const currentPower = useRef(0);
    const unlockedLevelFloor = useRef(0);
    const lastScrollPumpTime = useRef(Date.now());

    // 80.12% Trembling Hold Ref
    const tremblingStartTime = useRef(0);
    const isHoldingAt8012 = useRef(false);

    // 3-SECOND INITIAL EXPLORATION COUNTDOWN
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const graceTimer = setInterval(() => {
            setGracePeriodSec((prev) => {
                if (prev <= 1) {
                    clearInterval(graceTimer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(graceTimer);
    }, [isAudioUnlocked]);

    // PAGE VISIBILITY: PAUSE/RESUME SINGLE MR AUDIO CLEANLY
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (mrAudioRef.current && !mrAudioRef.current.paused) {
                    try { mrAudioRef.current.pause(); } catch(e) {}
                }
            } else {
                if (isAudioUnlocked && mrAudioRef.current && mrAudioRef.current.paused) {
                    try { mrAudioRef.current.play().catch(() => {}); } catch(e) {}
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isAudioUnlocked]);

    // GUARANTEED INSTANT AUDIO UNLOCKER
    const forceUnlockAudio = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();

        if (!isAudioUnlocked) {
            setIsAudioUnlocked(true);
        }

        if (mrAudioRef.current) {
            mrAudioRef.current.muted = false;
            mrAudioRef.current.playsInline = true;
            mrAudioRef.current.volume = 0.85;
            if (mrAudioRef.current.paused) {
                mrAudioRef.current.play().catch(() => {});
            }
        }
    };

    // INDEPENDENT KINETIC POWER & TIER ENGINE
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const powerInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceScroll = now - lastScrollPumpTime.current;
            const isGraceActive = (gracePeriodSec > 0 && !hasUserStartedScroll.current);

            if (timeSinceScroll > 180 && !isGraceActive) {
                const minFloor = unlockedLevelFloor.current;

                if (currentPower.current > 80 && currentPower.current <= 81.5) {
                    if (!isHoldingAt8012.current) {
                        isHoldingAt8012.current = true;
                        tremblingStartTime.current = now;
                        setIsTremblingAt8012(true);
                    }

                    const timeHolding = now - tremblingStartTime.current;
                    if (timeHolding < 1000) {
                        currentPower.current = 80.12;
                    } else {
                        setIsTremblingAt8012(false);
                        currentPower.current = Math.max(minFloor, currentPower.current - 1.2);
                    }
                } else {
                    if (currentPower.current <= 80) {
                        isHoldingAt8012.current = false;
                        setIsTremblingAt8012(false);
                    }
                    currentPower.current = Math.max(minFloor, currentPower.current - 1.2);
                }
            }

            const rawPower = currentPower.current;
            const powerInt = Math.round(rawPower);

            if (isHoldingAt8012.current && rawPower === 80.12) {
                setLivePowerStr("80.12");
            } else {
                setLivePowerStr(`${powerInt}`);
            }

            let tier = 1;
            if (rawPower >= 80) tier = 4;
            else if (rawPower >= 50) tier = 3;
            else if (rawPower >= 20) tier = 2;
            else tier = 1;

            setAudioTier(tier);
        }, 50);

        return () => clearInterval(powerInterval);
    }, [isAudioUnlocked, gracePeriodSec]);

    // WALKING PACING TIMELINE (2배 체류 시간)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const interval = setInterval(() => {
            if (gracePeriodSec > 0 && !hasUserStartedScroll.current) return;

            setProgress((prev) => {
                if (prev >= 100) {
                    // Trigger finish transition when reaching 100%
                    setTimeout(() => {
                        onFinishWalk();
                    }, 800);
                    return 100;
                }
                const next = Math.min(100, prev + 0.04);
                progressRef.current = next;
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isAudioUnlocked, gracePeriodSec]);

    // INDEPENDENT SCROLL & TOUCH ENGINE
    useEffect(() => {
        const triggerDopamineScrollUp = () => {
            hasUserStartedScroll.current = true;
            setIsScrollingUp(true);
            if (scrollUpTimerRef.current) clearTimeout(scrollUpTimerRef.current);
            scrollUpTimerRef.current = setTimeout(() => {
                setIsScrollingUp(false);
            }, 400);
        };

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }
            forceUnlockAudio(e);
            if (!isAudioUnlocked) return;

            if (e.deltaY > 0) {
                triggerDopamineScrollUp();
            } else {
                return;
            }

            const rawDelta = e.deltaY;
            const cPower = currentPower.current;
            let tierMult = 1.0;
            if (cPower < 20) tierMult = 3.6;
            else if (cPower < 50) tierMult = 2.2;

            const powerIncrement = Math.min(rawDelta * 0.015 * tierMult, 4.5);
            currentPower.current = Math.min(100, currentPower.current + powerIncrement);
            lastScrollPumpTime.current = Date.now();

            const clampedDelta = Math.min(rawDelta * 0.00225, 1.25);
            setProgress((prev) => {
                const next = Math.min(100, prev + clampedDelta);
                progressRef.current = next;
                if (next >= 100) {
                    setTimeout(() => {
                        onFinishWalk();
                    }, 800);
                }
                return next;
            });
        };

        const handleTouchStart = (e) => {
            forceUnlockAudio(e);
            if (e.touches && e.touches[0]) {
                touchStartY.current = e.touches[0].clientY;
                touchStartTime.current = Date.now();
            }
        };

        const handleTouchMove = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            
            if (!isScrollableChild && e.touches && e.touches[0]) {
                const currentY = e.touches[0].clientY;
                const deltaY = touchStartY.current - currentY;
                if (deltaY < 0 && window.scrollY === 0 && e.cancelable) {
                    e.preventDefault();
                }
            }

            forceUnlockAudio(e);
            if (!isAudioUnlocked) return;
            if (!e.touches || !e.touches[0]) return;

            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY.current - currentY;
            const now = Date.now();
            const timeDiff = Math.max(16, now - touchStartTime.current);

            if (deltaY > 0) {
                triggerDopamineScrollUp();

                const velocity = deltaY / timeDiff;

                const cPower = currentPower.current;
                let tierMult = 1.0;
                if (cPower < 20) tierMult = 3.8;
                else if (cPower < 50) tierMult = 2.4;

                const powerIncrement = Math.min((velocity * 0.6 + deltaY * 0.015) * tierMult, 5.5);
                currentPower.current = Math.min(100, currentPower.current + powerIncrement);
                lastScrollPumpTime.current = now;

                const strokeProgress = Math.min(deltaY * 0.011, 1.9);
                setProgress((prev) => {
                    const next = Math.min(100, prev + strokeProgress);
                    progressRef.current = next;
                    if (next >= 100) {
                        setTimeout(() => {
                            onFinishWalk();
                        }, 800);
                    }
                    return next;
                });
            }

            touchStartY.current = currentY;
            touchStartTime.current = now;
        };

        const handleTouchEnd = (e) => {
            forceUnlockAudio(e);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            if (scrollUpTimerRef.current) clearTimeout(scrollUpTimerRef.current);
        };
    }, [isAudioUnlocked]);

    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    const currentFrame = FRAMES[activeFrameIdx] || FRAMES[0];
    const isAtelierOptionVisible = (activeFrameIdx === 3 || activeFrameIdx === 4);

    // 3D GYRO TILT
    const tiltX = tilt.x * 55;
    const tiltY = tilt.y * 45;

    const ghostOffsetX = tilt.x * 65;
    const ghostOffsetY = tilt.y * 45;

    return (
        <div 
            onClick={(e) => forceUnlockAudio(e)}
            onTouchStart={(e) => forceUnlockAudio(e)}
            className="fixed inset-0 w-screen h-screen bg-[#050507] overflow-hidden select-none flex items-center justify-center cursor-pointer"
        >
            {/* Ambient Background Blur for Mobile & Desktop (Cinematic Canvas Atmosphere) */}
            <div 
                className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-40 scale-115 pointer-events-none transition-all duration-700"
                style={{ backgroundImage: `url(${currentFrame.src})` }}
            />

            {/* SINGLE PURE HIGH-QUALITY MR AUDIO ELEMENT */}
            <audio ref={mrAudioRef} src={MR_AUDIO_SRC} loop playsInline preload="auto" />

            {/* 1. FULL 7-STEP FLIPBOOK WALKING STAGE (모바일 100% 풀스크린 엣지-투-엣지 몰입감) */}
            <div 
                className="relative w-full h-full md:w-[410px] md:h-[82vh] md:max-h-[820px] md:rounded-[36px] md:border-2 md:border-white/20 md:shadow-[0_0_80px_rgba(231,255,0,0.2)] overflow-hidden transition-all duration-700 bg-black flex flex-col justify-between"
                style={{
                    filter: !isAudioUnlocked ? 'blur(20px) brightness(40%)' : 'none'
                }}
            >
                {FRAMES.map((f, idx) => (
                    <motion.div
                        key={f.id}
                        initial={false}
                        animate={{
                            opacity: activeFrameIdx === idx ? 1 : 0,
                            scale: activeFrameIdx === idx ? 1.0 : 1.05,
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src={f.src}
                            alt={f.titleMain}
                            className="w-full h-full object-cover transition-transform duration-700 scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/60" />
                    </motion.div>
                ))}

                {/* 2. AUTHENTIC WARM AMBER-GOLD STAINED-GLASS GOTHIC ARCH (PC & MOBILE RESPONSIVE FIT) */}
                <AnimatePresence>
                    {isAtelierOptionVisible && isAudioUnlocked && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1.0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute inset-0 z-30 pointer-events-none"
                        >
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenAtelier();
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="pointer-events-auto absolute top-[11.5%] md:top-[23.5%] left-[50%] md:left-[49%] -translate-x-1/2 w-[230px] md:w-[165px] h-[215px] md:h-[185px] rounded-t-[115px] md:rounded-t-[85px] rounded-b-sm cursor-pointer group outline-none flex flex-col items-center justify-end pb-3"
                            >
                                {/* Exact Matching Warm Antique Gold & Amber Stained-Glass Halo */}
                                <div className="absolute inset-0 rounded-t-[115px] md:rounded-t-[85px] rounded-b-sm border-2 border-[#C5A059] group-hover:border-[#F3E5AB] transition-all duration-400 shadow-[0_0_25px_rgba(197,160,89,0.55),0_0_55px_rgba(230,167,64,0.35),inset_0_0_20px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_45px_rgba(243,229,171,0.85),0_0_80px_rgba(230,167,64,0.6),inset_0_0_30px_rgba(197,160,89,0.5)] animate-pulse" />
                                
                                {/* Inner Ambient Warm Amber & Wine Illumination */}
                                <div className="absolute inset-0 rounded-t-[115px] md:rounded-t-[85px] rounded-b-sm bg-gradient-to-b from-[#C5A059]/25 via-[#E6A740]/15 to-[#8B263E]/10 group-hover:from-[#C5A059]/35 transition-all duration-300 backdrop-blur-[1px]" />

                                {/* Diagonal Light Sweep / Warm Glass Shimmer */}
                                <motion.div
                                    animate={{
                                        x: ['-120%', '160%'],
                                        opacity: [0, 0.65, 0]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.5,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-[#FFF8DC]/30 to-transparent -skew-x-12 pointer-events-none"
                                />

                                {/* Elegant Antique Bronze/Gold Seal Callout Badge */}
                                <div className="relative z-10 px-3.5 py-1.5 rounded-full bg-[#16120C]/90 border border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.45)] flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-black text-[#E5C158] tracking-widest uppercase transition-transform group-hover:scale-105">
                                    <Building2 className="w-3.5 h-3.5 text-[#C5A059] animate-bounce" />
                                    <span>⚜ J.S.F 간판 터치 (설립 정보)</span>
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2.5 NARROW AUDIO-REACTIVE KINETIC SONIC BEAM */}
                <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none z-25 flex flex-col items-center justify-end overflow-hidden">
                    <AnimatePresence>
                        {isScrollingUp && (
                            <motion.div
                                initial={{ opacity: 0, scaleY: 0.2, y: 40 }}
                                animate={{ opacity: 1, scaleY: 1.0, y: 0 }}
                                exit={{ opacity: 0, scaleY: 0.4, y: 20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="relative w-40 sm:w-52 h-52 flex flex-col items-center justify-end"
                            >
                                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#E7FF00]/30 via-[#00F0FF]/25 to-transparent rounded-full filter blur-lg" />
                                <div className="absolute w-1.5 h-44 bottom-0 bg-gradient-to-t from-[#E7FF00] via-[#00F0FF] to-transparent rounded-full shadow-[0_0_20px_#E7FF00,0_0_35px_#00F0FF] animate-pulse" />

                                <div className="relative z-10 flex items-end gap-1.5 mb-8">
                                    {[0.4, 0.8, 1.0, 0.75, 0.45].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                height: [12 * h, 36 * h, 8 * h, 42 * h],
                                                opacity: [0.6, 1, 0.7, 1]
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.4 + i * 0.08,
                                                ease: "easeInOut"
                                            }}
                                            className="w-1 rounded-full bg-gradient-to-t from-[#E7FF00] to-[#00F0FF] shadow-[0_0_10px_#E7FF00]"
                                        />
                                    ))}
                                </div>

                                <motion.div
                                    animate={{
                                        scale: [0.8, 1.4],
                                        opacity: [0.8, 0],
                                        y: [0, -60]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.7,
                                        ease: "easeOut"
                                    }}
                                    className="absolute bottom-6 w-24 h-6 rounded-full border border-[#E7FF00]/60 shadow-[0_0_15px_#E7FF00]"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. CENTER WATERMARK POWER CHECK NUMBER (DEEP BACKGROUND WATERMARK) */}
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center select-none overflow-hidden">
                    <div 
                        className={`flex items-center gap-3 transition-all duration-300 ${
                            isTremblingAt8012
                                ? 'scale-110 text-[#FF0055] drop-shadow-[0_0_35px_#FF0055] opacity-70 animate-pulse'
                                : isScrollingUp
                                    ? 'scale-105 text-[#E7FF00] drop-shadow-[0_0_25px_rgba(231,255,0,0.4)] opacity-25'
                                    : 'text-white/10 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] opacity-10'
                        }`}
                        style={{
                            transform: `perspective(600px) translate3d(${tiltX * 0.25}px, ${tiltY * 0.25}px, -40px)`
                        }}
                    >
                        <Footprints className={`w-8 h-8 sm:w-12 sm:h-12 transition-transform duration-200 ${
                            isScrollingUp ? 'scale-125 animate-bounce' : 'scale-100'
                        }`} />

                        <span className="font-mono text-5xl sm:text-7xl font-black tracking-tight leading-none">
                            {livePowerStr}
                        </span>
                    </div>
                </div>

                {/* 4. Floating Spatial HUD & Cleaned-up Signature Typography */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-14 pb-5 px-4 text-center z-20">
                    <div className="h-4" />

                    {/* True 3D Assembled Typography (하단 1/3 영역에 안정적 배치) */}
                    <div className="max-w-sm mx-auto mt-auto mb-10 md:mb-14 px-2 flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`assembled-title-${activeFrameIdx}`}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -15, filter: "blur(6px)", transition: { duration: 0.2 } }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: audioTier === 4 ? 0.05 : audioTier === 3 ? 0.12 : audioTier === 2 ? 0.22 : 0.36,
                                            delayChildren: 0.04
                                        }
                                    }
                                }}
                                className="flex flex-col items-center text-center"
                            >
                                <h2 className="font-sans text-xl sm:text-2xl font-light tracking-tight text-[#E7FF00] uppercase leading-none mb-2 flex flex-wrap items-center justify-center gap-x-2">
                                    {currentFrame.titleTop.split(" ").map((word, wIdx) => (
                                        <motion.span
                                            key={`top-${wIdx}`}
                                            variants={{
                                                hidden: { opacity: 0, y: 12, filter: "blur(8px)", scale: 0.85 },
                                                visible: { 
                                                    opacity: 1, 
                                                    y: 0, 
                                                    filter: "blur(0px)", 
                                                    scale: 1,
                                                    transition: { 
                                                        duration: audioTier === 4 ? 0.18 : audioTier === 3 ? 0.28 : audioTier === 2 ? 0.42 : 0.60,
                                                        ease: [0.22, 1, 0.36, 1] 
                                                    } 
                                                }
                                            }}
                                            className="inline-block"
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </h2>

                                <h1 
                                    className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight max-w-xs flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5"
                                    style={{
                                        textShadow: cursorPos.isHovered 
                                            ? `${tiltX * 0.5}px ${tiltY * 0.5}px 35px rgba(231,255,0,0.4)` 
                                            : '0 0 35px rgba(0,0,0,0.9)'
                                    }}
                                >
                                    {currentFrame.titleMain.split(" ").map((word, wIdx) => (
                                        <motion.span
                                            key={`main-${wIdx}`}
                                            variants={{
                                                hidden: { opacity: 0, y: 18, filter: "blur(10px)", scale: 0.80 },
                                                visible: { 
                                                    opacity: 1, 
                                                    y: 0, 
                                                    filter: "blur(0px)", 
                                                    scale: 1,
                                                    transition: { 
                                                        duration: audioTier === 4 ? 0.20 : audioTier === 3 ? 0.32 : audioTier === 2 ? 0.48 : 0.68,
                                                        ease: [0.22, 1, 0.36, 1] 
                                                    } 
                                                }
                                            }}
                                            className="inline-block"
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </h1>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Progress Track with Dynamic Dopamine Glow */}
                    <div className="pointer-events-auto flex flex-col items-center gap-2.5">
                        <div className={`w-40 sm:w-60 h-1 bg-white/20 rounded-full overflow-hidden transition-all duration-300 ${
                            isScrollingUp ? 'ring-2 ring-[#E7FF00] shadow-[0_0_15px_#E7FF00]' : ''
                        }`}>
                            <div
                                className={`h-full bg-[#E7FF00] transition-all duration-75 ${
                                    isScrollingUp ? 'shadow-[0_0_10px_#E7FF00]' : ''
                                }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. INITIAL UNLOCK SPLASH */}
            <AnimatePresence>
                {!isAudioUnlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        onClick={(e) => forceUnlockAudio(e)}
                        onTouchStart={(e) => forceUnlockAudio(e)}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/90 cursor-pointer overflow-hidden"
                        style={{
                            perspective: '600px',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <div className="absolute inset-0 bg-black/55 backdrop-blur-[3.5px] pointer-events-none z-10" />

                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ transformStyle: 'preserve-3d' }}>
                            {ATELIER_DEBRIS_100.map((item) => {
                                const tiltXVal = tilt.x * 32 * item.tiltMult;
                                const tiltYVal = tilt.y * 32 * item.tiltMult;

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
                                        className="absolute select-none flex items-center justify-center pointer-events-none"
                                    >
                                        {item.shapeCategory === 0 && (
                                            <div 
                                                className={`${item.fontFamily} ${item.sizeClass} tracking-wider`}
                                                style={{ color: item.color }}
                                            >
                                                {item.text}
                                            </div>
                                        )}

                                        {item.shapeCategory === 1 && (
                                            <div 
                                                className={`px-3 py-0.5 rounded-full border bg-black/70 ${item.fontFamily} ${item.sizeClass} tracking-widest uppercase`}
                                                style={{ color: item.color, borderColor: `${item.color}70` }}
                                            >
                                                {item.text}
                                            </div>
                                        )}

                                        {item.shapeCategory === 2 && (
                                            <div 
                                                className="w-9 h-9 rounded-full border-2 bg-neutral-900/90 flex items-center justify-center font-mono font-black text-xs"
                                                style={{ color: item.color, borderColor: `${item.color}80` }}
                                            >
                                                {item.text}
                                            </div>
                                        )}

                                        {item.shapeCategory === 3 && (
                                            <div 
                                                className={`font-serif italic font-medium underline underline-offset-4 ${item.sizeClass} tracking-normal`}
                                                style={{ color: item.color, textDecorationColor: `${item.color}80` }}
                                            >
                                                {item.text}
                                            </div>
                                        )}

                                        {item.shapeCategory === 4 && (
                                            <div 
                                                className={`px-3 py-1 bg-neutral-900/90 border-l-4 -skew-x-12 ${item.fontFamily} ${item.sizeClass} tracking-widest uppercase`}
                                                style={{ color: item.color, borderLeftColor: item.color }}
                                            >
                                                <span className="inline-block skew-x-12">{item.text}</span>
                                            </div>
                                        )}

                                        {item.shapeCategory === 5 && (
                                            <div 
                                                className={`px-3 py-0.5 rounded-sm border border-dashed bg-black/70 ${item.fontFamily} ${item.sizeClass} tracking-widest uppercase`}
                                                style={{ color: item.color, borderColor: `${item.color}60` }}
                                            >
                                                {item.text}
                                            </div>
                                        )}

                                        {item.shapeCategory === 6 && (
                                            <div 
                                                className={`${item.sizeClass} leading-none`}
                                                style={{ color: item.color }}
                                            >
                                                {item.text}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ y: 260, opacity: 0 }}
                            animate={{ 
                                y: [260, 180, 0, -120],
                                opacity: [0, 1, 0.9, 0]
                            }}
                            transition={{
                                duration: 3.8,
                                repeat: Infinity,
                                times: [0, 0.18, 0.65, 1],
                                ease: 'easeInOut'
                            }}
                            style={{
                                transform: `perspective(600px) rotateX(${tiltY * -1.4}deg) rotateY(${tiltX * 1.4}deg) translateZ(60px)`,
                                transformStyle: 'preserve-3d'
                            }}
                            className="relative flex flex-col items-center text-center cursor-pointer select-none leading-[1.15] z-20"
                        >
                            <div 
                                className="absolute inset-0 flex flex-col items-center text-center pointer-events-none opacity-90 transition-transform duration-75 ease-out"
                                style={{
                                    transform: `translate3d(${-ghostOffsetX}px, ${-ghostOffsetY}px, 20px)`
                                }}
                            >
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_20px_#FF0055]">LET</span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_20px_#FF0055]">'S</span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_20px_#FF0055]">GO</span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_25px_#FF0055]">!</span>
                            </div>

                            <div 
                                className="absolute inset-0 flex flex-col items-center text-center pointer-events-none opacity-90 transition-transform duration-75 ease-out"
                                style={{
                                    transform: `translate3d(${ghostOffsetX}px, ${ghostOffsetY}px, 20px)`
                                }}
                            >
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_20px_#00F0FF]">LET</span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_20px_#00F0FF]">'S</span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_20px_#00F0FF]">GO</span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_25px_#00F0FF]">!</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                                    LET
                                </span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                                    'S
                                </span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                                    GO
                                </span>
                                <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#E7FF00] drop-shadow-[0_0_35px_#E7FF00]">
                                    !
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ==============================================================================
// 🌟 2026 INTERACTIVE 3D CYBER-SALON SHOWCASE (영구 고정 에필로그 스테이지)
// ==============================================================================
function Grand2026InteractiveCyberSalon({ tilt, userNickname, setUserNickname, stems, setStems, onOpenAtelier }) {
    const [soundNotes, setSoundNotes] = useState([]);
    const [activeTab, setActiveTab] = useState('stage'); // 'stage', 'mixer', 'intel'
    const [vinylSpeed, setVinylSpeed] = useState(1);
    const synthCtxRef = useRef(null);

    const tiltX = tilt.x * 45;
    const tiltY = tilt.y * 35;

    // Interactive Pentatonic Chime Synthesizer on Fragment Tap
    const playChimeNote = (freq = 440) => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!synthCtxRef.current) synthCtxRef.current = new AudioCtx();
            const ctx = synthCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.36);
        } catch (e) {}
    };

    const handleFragmentClick = (item) => {
        const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        const randomFreq = pentatonicScale[item.id % pentatonicScale.length];
        playChimeNote(randomFreq);

        setSoundNotes(prev => [...prev.slice(-12), {
            id: Date.now() + Math.random(),
            text: item.text,
            color: item.color,
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15
        }]);
    };

    return (
        <div 
            className="fixed inset-0 w-full h-full bg-[#050507] overflow-hidden flex flex-col items-center justify-between text-center select-none"
            style={{ perspective: '1000px' }}
        >
            {/* 1. 3D FLOATING BACKGROUND DEBRIS WITH REAL-TIME GYRO TILT & CLICK-CHIME */}
            <div className="absolute inset-0 pointer-events-auto overflow-hidden z-0" style={{ transformStyle: 'preserve-3d' }}>
                {ATELIER_DEBRIS_100.map((item) => {
                    const tiltXVal = tilt.x * 40 * item.tiltMult;
                    const tiltYVal = tilt.y * 40 * item.tiltMult;

                    return (
                        <motion.div
                            key={item.id}
                            onClick={() => handleFragmentClick(item)}
                            initial={{
                                y: `${(item.id * 17) % 90}vh`,
                                x: 0,
                                opacity: item.opacityMax * 0.7,
                                scale: 0.85
                            }}
                            animate={{
                                y: [`${(item.id * 17) % 90}vh`, `${((item.id * 17) % 90) - 20}vh`, `${(item.id * 17) % 90}vh`],
                                rotate: [item.rotation, item.rotation + 10, item.rotation],
                                scale: [0.85, 1.05, 0.85]
                            }}
                            transition={{
                                duration: item.duration * 1.5,
                                repeat: Infinity,
                                delay: item.delay,
                                ease: 'easeInOut'
                            }}
                            style={{
                                left: item.left,
                                transform: `translate3d(${tiltXVal}px, ${tiltYVal}px, ${item.zDepth}px)`
                            }}
                            className="absolute cursor-pointer hover:scale-125 transition-transform p-2 pointer-events-auto"
                        >
                            <div 
                                className={`px-3 py-1 rounded-full border bg-black/80 backdrop-blur-md font-mono text-[10px] font-black tracking-widest shadow-xl transition-colors hover:border-[#E7FF00] hover:text-[#E7FF00]`}
                                style={{ color: item.color, borderColor: `${item.color}50` }}
                            >
                                {item.text}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* SOUND BURST PARTICLES */}
            <AnimatePresence>
                {soundNotes.map(sn => (
                    <motion.div
                        key={sn.id}
                        initial={{ opacity: 1, scale: 0.5, y: 0 }}
                        animate={{ opacity: 0, scale: 1.8, y: -80 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ left: `${sn.x}%`, top: `${sn.y}%`, color: sn.color }}
                        className="fixed z-40 font-mono text-sm font-black pointer-events-none drop-shadow-[0_0_15px_currentColor]"
                    >
                        ✦ {sn.text} ♫
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* 2. TOP CYBERNETIC DEV STATUS BANNER */}
            <div className="relative z-20 pt-16 px-4 flex flex-col items-center">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/90 border border-[#E7FF00] shadow-[0_0_25px_rgba(231,255,0,0.4)] mb-3"
                >
                    <span className="w-2 h-2 rounded-full bg-[#E7FF00] animate-ping" />
                    <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-[#E7FF00] uppercase">
                        [DEV PROTOTYPE V1 COMPLETED · 여기까지 개발 완료]
                    </span>
                </motion.div>

                <h1 
                    className="font-sans text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase"
                    style={{
                        textShadow: `${tiltX * 0.4}px ${tiltY * 0.4}px 40px rgba(231,255,0,0.5)`
                    }}
                >
                    FRANKFURT SOUND ATELIER
                </h1>
                <p className="font-mono text-xs sm:text-sm text-white/60 mt-1 max-w-lg">
                    1인칭 3D 공간 오디오 &amp; 키네틱 보행 시퀀스 프로토타입 완결
                </p>
            </div>

            {/* 3. CENTER 3D INTERACTIVE HERO STAGE */}
            <div className="relative z-20 w-full max-w-xl px-4 my-auto flex flex-col items-center">
                {activeTab === 'stage' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1.0 }}
                        className="w-full bg-[#0B0B10]/85 border border-white/20 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] relative flex flex-col items-center"
                        style={{
                            transform: `perspective(800px) rotateX(${tiltY * -0.6}deg) rotateY(${tiltX * 0.6}deg)`,
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {/* 3D VINYL TURNTABLE */}
                        <div 
                            onClick={() => {
                                setVinylSpeed(v => v === 1 ? 2.5 : 1);
                                playChimeNote(659.25);
                            }}
                            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white/20 bg-neutral-950 flex items-center justify-center cursor-pointer shadow-[0_0_40px_rgba(231,255,0,0.25)] hover:scale-105 transition-all mb-4 group"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4 / vinylSpeed, ease: "linear" }}
                                className="w-full h-full rounded-full flex items-center justify-center border-2 border-white/10"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#E7FF00] flex flex-col items-center justify-center text-black font-mono font-black text-[9px]">
                                    <Disc className="w-6 h-6 animate-spin" />
                                    <span>MR MASTER</span>
                                </div>
                            </motion.div>
                            <div className="absolute inset-0 rounded-full bg-[#E7FF00]/0 group-hover:bg-[#E7FF00]/10 transition-colors" />
                        </div>

                        <h2 className="font-mono text-lg font-black text-[#E7FF00] tracking-wider uppercase mb-1">
                            A TWELVE-MINUTE ALIBI (MR)
                        </h2>
                        <p className="font-mono text-[11px] text-white/50 mb-4">
                            클릭하여 부유 파편들의 화음을 연주하거나 믹서/설립 정보를 확인하세요.
                        </p>

                        {/* ACTION BUTTON GRID */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
                            <button
                                onClick={() => setActiveTab('mixer')}
                                className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Sliders className="w-3.5 h-3.5 text-[#E7FF00]" />
                                <span>STEM 믹서</span>
                            </button>

                            <button
                                onClick={onOpenAtelier}
                                className="py-3 px-3 rounded-2xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] font-mono text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>회사 설립 정보</span>
                            </button>

                            <a
                                href={SECRET_YOUTUBE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="col-span-2 sm:col-span-1 py-3 px-3 rounded-2xl bg-[#FF0055]/15 hover:bg-[#FF0055]/25 border border-[#FF0055]/40 text-[#FF0055] font-mono text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>시크릿 영상</span>
                            </a>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'mixer' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1.0 }}
                        className="w-full bg-[#0B0B10]/95 border border-white/20 rounded-3xl p-5 backdrop-blur-2xl shadow-2xl flex flex-col items-center"
                    >
                        <div className="flex justify-between items-center w-full mb-3 pb-2 border-b border-white/10 font-mono text-xs text-[#E7FF00]">
                            <span className="font-bold">STEM HARMONY SANDBOX</span>
                            <button onClick={() => setActiveTab('stage')} className="text-white/60 hover:text-white">✕ CLOSE</button>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
                            {[
                                { id: 'violin', label: '01. SOLO VIOLIN', color: '#E7FF00' },
                                { id: 'electric', label: '02. ELECTRIC DIST', color: '#FF0055' },
                                { id: 'bass', label: '03. NOIR BASS', color: '#00F0FF' },
                                { id: 'orchestra', label: '04. GRAND SYMPHONY', color: '#C5A059' },
                            ].map((s) => (
                                <div key={s.id} className="p-2.5 rounded-xl border border-white/10 bg-black/40">
                                    <div className="flex justify-between font-mono text-[10px] mb-1">
                                        <span className="text-white font-bold">{s.label}</span>
                                        <span style={{ color: s.color }}>{stems[s.id]}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={stems[s.id]}
                                        onChange={(e) => setStems({ ...stems, [s.id]: Number(e.target.value) })}
                                        className="w-full accent-white h-1 bg-white/20 rounded cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveTab('stage')}
                            className="w-full py-2.5 rounded-xl bg-[#E7FF00] text-black font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_25px_rgba(231,255,0,0.4)]"
                        >
                            ✓ SAVE &amp; RETURN
                        </button>
                    </motion.div>
                )}
            </div>

            {/* 4. BOTTOM PERSISTENT RELOAD/RESTART CONTROLLER */}
            <div className="relative z-20 pb-8 px-4 flex flex-col items-center gap-2">
                <button
                    onClick={() => window.location.reload()}
                    className="group px-8 py-3.5 rounded-full bg-white/10 hover:bg-[#E7FF00] text-white hover:text-black border border-white/20 hover:border-[#E7FF00] font-mono text-xs font-black tracking-[0.25em] uppercase transition-all duration-300 shadow-xl flex items-center gap-2.5"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span>↻ WALK AGAIN (새로고침하여 처음부터 다시 걷기)</span>
                </button>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                    ※ 현재 화면에 영구 고정되어 있으며, 새로고침 시에만 1번 골목길로 복귀합니다.
                </span>
            </div>
        </div>
    );
}

// FRANKFURT SOUND ATELIER MODAL
function FrankfurtAtelierModal({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl p-4 sm:p-8 flex items-center justify-center overflow-y-auto touch-pan-y"
            style={{ touchAction: 'pan-y' }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 0 }}
                className="w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-[#09090D] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative custom-scrollbar touch-pan-y"
                style={{ touchAction: 'pan-y' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="inline-flex items-center gap-2 font-mono text-[10px] text-[#00F0FF] tracking-widest uppercase mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>CORPORATE INTEL &amp; SOUND ATELIER</span>
                </div>

                <h2 className="font-sans text-2xl sm:text-4xl font-black text-white uppercase mb-2 pr-8">
                    JUST SEAN FLOWS // GUILD ATELIER
                </h2>
                <p className="font-mono text-xs text-white/60 mb-6">
                    Sole-proprietor hybrid sound production guild headquarters in formation at Frankfurt am Main, Germany.
                </p>

                <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/15 aspect-video">
                    <img
                        src={ATELIER_IMG}
                        alt="Frankfurt Atelier Facade"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <div className="font-mono text-[10px] text-[#00F0FF] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                            <span>FRANKFURT AM MAIN · 24/7 SOUND ATELIER FACADE</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs mb-6">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <span className="text-[#E7FF00] font-bold block mb-1">LEGAL STRUCTURE</span>
                        <p className="text-white/80 text-[11px]">
                            Hybrid Guild Corporation (UG / GmbH in Formation)
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#00F0FF]/[0.03] border border-[#00F0FF]/20">
                        <span className="text-[#00F0FF] font-bold block mb-1">HEADQUARTERS</span>
                        <p className="text-white/80 text-[11px]">
                            Frankfurt am Main, Hessen, Germany
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 sm:col-span-2">
                        <span className="text-white font-bold block mb-1">CORE MISSION</span>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                            Fusing classical orchestra, indie rock, and AI audio DSP for proprietary soundscapes and global licensing.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 rounded-full bg-[#00F0FF] text-[#000000] font-mono text-xs font-black tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] my-2"
                >
                    CLOSE ATELIER INTEL →
                </button>
            </motion.div>
        </motion.div>
    );
}
