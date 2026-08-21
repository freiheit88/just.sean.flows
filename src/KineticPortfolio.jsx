const ATELIER_TIMELINE_STAGES = [
    {
        tag: "JULY 2026",
        title: "THE SEARCH BEGAN",
        desc: "프랑크푸르트 아틀리에 공간 탐색 시작"
    },
    {
        tag: "AUGUST 2026",
        title: "VIEWING COMPLETE",
        desc: "살롱 후보지 뷰잉 및 음향 공간 검증 완료"
    },
    {
        tag: "2026.08.21 TODAY",
        title: "CONTRACT IN PROGRESS",
        desc: "현재 임대 계약 및 정식 인허가 절차 진행 중"
    },
    {
        tag: "OCTOBER 2026",
        title: "GRAND OPENING",
        desc: "모든 준비가 순조롭다면 10월 정식 오픈 예정!"
    }
];

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Volume2, VolumeX, Headphones, Sliders, Play, Pause, 
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
        titleTop: "FRANKFURT 02:00 AM", 
        titleMain: "WALK WITH MUSIC", 
    },
    { 
        id: 1, 
        src: "/assets/walk_story_02_mid_alley.jpg", 
        videoSrc: "/assets/step_02_transition.mp4",
        titleTop: "MISSION MANIFEST", 
        titleMain: "ACTIVE QUEST", 
    },
    { 
        id: 2, 
        src: "/assets/walk_story_03_corner_turn.jpg", 
        titleTop: "CORNER TURN", 
        titleMain: "STILL AWAKE", 
    },
    { 
        id: 3, 
        src: "/assets/walk_story_04_look_up_logo.jpg", 
        titleTop: "LOOK UP", 
        titleMain: "THE LOGO", 
        hasBuildingTarget: true
    },
    { 
        id: 4, 
        src: "/assets/walk_story_05_amber_glow_shift.jpg", 
        titleTop: "LIGHTS AWAKEN", 
        titleMain: "AMBER GLOW", 
        hasBuildingTarget: true
    },
    { 
        id: 5, 
        src: "/assets/walk_story_06_door_handle_view.jpg", 
        titleTop: "REACH OUT", 
        titleMain: "TOUCH HANDLE", 
    },
    { 
        id: 6, 
        src: "/assets/walk_story_07_grand_piano_salon.jpg", 
        titleTop: "20% READY", 
        titleMain: "ENTER ATELIER", 
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
                        initial={{ opacity: 0, y: 0, scale: 0.85 }}
                        animate={{ opacity: 1, y: -18, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 font-mono text-[10px] sm:text-xs font-black text-[#E7FF00] whitespace-nowrap tracking-widest pointer-events-none select-none drop-shadow-[0_0_12px_rgba(231,255,0,0.9)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                    >
                        <ChevronUp className="w-3.5 h-3.5 animate-bounce text-[#E7FF00]" />
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
                        onFinishWalk={() => {}} 
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
    const [videoPlayState, setVideoPlayState] = useState('idle'); // 'idle' | 'playing' | 'card_reading' | 'unlocked'
    const hasVideoPlayedOnce = useRef(false);
    const [timelineStage, setTimelineStage] = useState(0);
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [showVolumeRecommend, setShowVolumeRecommend] = useState(true);
    const videoSwipeCountRef = useRef(0);

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
                // Video & 3-Second Card Lock Handling: Hold between 12% and 22% until video ends and 3s card read is done
                if (prev >= 12 && prev < 24 && videoPlayState !== 'unlocked') {
                    if (!hasVideoPlayedOnce.current && videoPlayState === 'idle') {
                        setVideoPlayState('playing');
                        hasVideoPlayedOnce.current = true;
                    }
                    const next = Math.min(20, prev + clampedDelta * 0.2);
                    progressRef.current = next;
                    return next;
                }
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
                    // Video & 3-Second Card Lock Handling: Hold between 12% and 22% until video ends and 3s card read is done
                    if (prev >= 12 && prev < 24 && videoPlayState !== 'unlocked') {
                        if (!hasVideoPlayedOnce.current && videoPlayState === 'idle') {
                            setVideoPlayState('playing');
                            hasVideoPlayedOnce.current = true;
                        }
                        const next = Math.min(20, prev + strokeProgress * 0.2);
                        progressRef.current = next;
                        return next;
                    }
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

    // 3-SECOND VOLUME RECOMMENDATION TIMER ON INITIAL AUDIO UNLOCK
    useEffect(() => {
        if (isAudioUnlocked) {
            const volTimer = setTimeout(() => {
                setShowVolumeRecommend(false);
            }, 3000);
            return () => clearTimeout(volTimer);
        }
    }, [isAudioUnlocked]);

    // 10-SECOND PROGRESSIVE ATELIER TIMELINE IN STEP 7
    useEffect(() => {
        if (activeFrameIdx !== 6) {
            setTimelineStage(0);
            return;
        }

        const timelineTimer = setInterval(() => {
            setTimelineStage((prev) => {
                if (prev < ATELIER_TIMELINE_STAGES.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 2500);

        return () => clearInterval(timelineTimer);
    }, [activeFrameIdx]);

    // Reaching 100% triggers trailer modal teaser
    useEffect(() => {
        if (progress >= 99.5) {
            setIsTrailerModalOpen(true);
        }
    }, [progress]);

    // 3D GYRO TILT (50% REDUCED SENSITIVITY FOR SMOOTH ELEGANCE)
    const tiltX = tilt.x * 26;
    const tiltY = tilt.y * 22;

    const ghostOffsetX = tilt.x * 30;
    const ghostOffsetY = tilt.y * 22;

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


            {/* 6. CINEMATIC TRAILER OUTRO TEASER (10월에 만나요!) */}
            <AnimatePresence>
                {isTrailerModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm rounded-3xl bg-[#0D0B08]/95 border-2 border-[#E7FF00]/80 p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(231,255,0,0.3)] overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E7FF00]/15 rounded-full filter blur-2xl pointer-events-none" />

                            <span className="inline-block px-3 py-1 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/40 font-mono text-[10px] font-black text-[#E7FF00] tracking-[0.25em] uppercase mb-4 shadow-[0_0_12px_rgba(231,255,0,0.3)]">
                                ✦ TEASER TRAILER • 2026 ✦
                            </span>

                            <h2 className="font-sans text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-2">
                                SEE YOU IN OCTOBER.
                            </h2>

                            <p className="font-sans text-sm text-[#E7FF00] font-bold tracking-wide mb-1">
                                10월에 정식으로 돌아옵니다!
                            </p>

                            <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-6">
                                프랑크푸르트 아틀리에 계약과 인허가가 순조롭게 완료되면,<br />
                                10월 환상적인 음악과 공간으로 여러분을 초대합니다.
                            </p>

                            <div className="flex flex-col gap-2.5">
                                <button
                                    onClick={() => {
                                        setIsTrailerModalOpen(false);
                                        setProgress(0);
                                        progressRef.current = 0;
                                    }}
                                    className="w-full py-3 rounded-full bg-[#E7FF00] hover:bg-[#F3FF66] text-black font-mono text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(231,255,0,0.5)] active:scale-95 cursor-pointer"
                                >
                                    ↺ WALK AGAIN (처음부터 다시 걷기)
                                </button>
                                <button
                                    onClick={() => setIsTrailerModalOpen(false)}
                                    className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs font-medium tracking-wider transition-colors cursor-pointer"
                                >
                                    ✕ 아틀리에 둘러보기
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        {f.videoSrc && activeFrameIdx === idx && (videoPlayState === 'playing' || (!hasVideoPlayedOnce.current && videoPlayState === 'idle')) ? (
                            <video
                                ref={(el) => {
                                    if (el) {
                                        // Unmute video audio to play simultaneously with background MR
                                        el.muted = false;
                                        el.volume = 1.0;
                                        el.playsInline = true;
                                        el.play().catch(() => {
                                            // Fallback to muted if browser blocks unmuted video before touch
                                            el.muted = true;
                                            el.play().catch(() => {});
                                        });
                                    }
                                }}
                                src={f.videoSrc}
                                poster={f.src}
                                autoPlay
                                playsInline
                                preload="auto"
                                onEnded={() => {
                                    setVideoPlayState('card_reading');
                                    // Hold the 2번 card still frame for 3.0 seconds so user can read text comfortably
                                    setTimeout(() => {
                                        setVideoPlayState('unlocked');
                                    }, 3000);
                                }}
                                className="w-full h-full object-cover transition-transform duration-700 scale-100"
                            />
                        ) : (
                            <img
                                src={f.src}
                                alt={f.titleMain}
                                className="w-full h-full object-cover transition-transform duration-700 scale-100"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/60" />
                    </motion.div>
                ))}


                {/* 1.5 CENTER 3-SECOND 30% VOLUME RECOMMENDATION HUD */}
                <AnimatePresence>
                    {showVolumeRecommend && isAudioUnlocked && activeFrameIdx === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 15 }}
                            animate={{ opacity: 1, scale: 1.0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -15, filter: "blur(8px)" }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none p-4 select-none"
                            style={{
                                perspective: 600,
                                transform: `translate3d(${tiltX * 0.2}px, ${tiltY * 0.2}px, 20px) rotateX(${-tiltY * 0.3}deg) rotateY(${tiltX * 0.3}deg)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.15s ease-out'
                            }}
                        >
                            <div className="relative px-6 py-5 rounded-3xl bg-black/85 border border-[#E7FF00]/60 shadow-[0_0_50px_rgba(231,255,0,0.35),0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col items-center text-center max-w-[280px]">
                                {/* Ambient glow badge */}
                                <div className="flex items-center gap-1.5 mb-3 px-3 py-0.5 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/30 font-mono text-[9px] font-black text-[#E7FF00] tracking-[0.2em] uppercase">
                                    <Headphones className="w-3 h-3 text-[#E7FF00] animate-pulse" />
                                    <span>AUDIO IMMERSION</span>
                                </div>

                                <div className="flex items-center gap-2.5 mb-2">
                                    <Volume2 className="w-6 h-6 text-[#E7FF00] drop-shadow-[0_0_12px_#E7FF00] animate-bounce" />
                                    <span className="font-mono text-2xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                                        VOL 30%
                                    </span>
                                </div>

                                {/* Sleek 30% Volume Bar */}
                                <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden mb-2.5 p-0.5 border border-white/10">
                                    <motion.div 
                                        initial={{ width: "0%" }}
                                        animate={{ width: "30%" }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-[#E7FF00] to-[#00F0FF] rounded-full shadow-[0_0_10px_#E7FF00]"
                                    />
                                </div>

                                <p className="font-sans text-[11px] text-neutral-300 font-medium tracking-tight leading-tight">
                                    볼륨을 약 <strong className="text-[#E7FF00]">30%</strong>로 맞추시면<br />
                                    가장 완벽한 공간 음향을 즐기실 수 있습니다.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. AUTHENTIC 3-PANEL GOTHIC ARCH (PERFECT CENTERED FIT: w-[215px] h-[225px] top-[11.8%] left-1/2) */}
                <AnimatePresence>
                    {isAtelierOptionVisible && isAudioUnlocked && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1.0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="absolute inset-0 z-30 pointer-events-none"
                            style={{
                                perspective: 800,
                            }}
                        >
                            {/* Pure Centered Outer Wrapper without inline transforms (guarantees exact center on all mobile screens) */}
                            <div 
                                className="pointer-events-auto absolute top-[11.8%] md:top-[14.5%] left-1/2 -translate-x-1/2 w-[215px] md:w-[172px] h-[225px] md:h-[190px] flex items-center justify-center select-none"
                            >
                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenAtelier();
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-full cursor-pointer group outline-none relative flex items-center justify-center"
                                    style={{
                                        transform: `translate3d(${tiltX * 0.1}px, ${tiltY * 0.1}px, 8px) rotateX(${-tiltY * 0.18}deg) rotateY(${tiltX * 0.18}deg)`,
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.15s ease-out'
                                    }}
                                >
                                    {/* Multi-Layer 3D Prismatic Glow & Organic Musical Pulse */}
                                    <motion.div 
                                        animate={{
                                            scale: [1, 1.03, 0.99, 1.04, 1],
                                            filter: [
                                                'drop-shadow(0 0 16px rgba(255,183,3,0.7)) drop-shadow(0 0 35px rgba(230,126,34,0.5)) drop-shadow(0 0 45px rgba(194,24,91,0.3))',
                                                'drop-shadow(0 0 32px rgba(255,215,0,0.95)) drop-shadow(0 0 65px rgba(230,126,34,0.75)) drop-shadow(0 0 80px rgba(194,24,91,0.5))',
                                                'drop-shadow(0 0 18px rgba(255,183,3,0.7)) drop-shadow(0 0 40px rgba(230,126,34,0.5)) drop-shadow(0 0 50px rgba(194,24,91,0.3))',
                                                'drop-shadow(0 0 42px rgba(255,215,0,1)) drop-shadow(0 0 85px rgba(211,84,0,0.85)) drop-shadow(0 0 100px rgba(194,24,91,0.6))',
                                                'drop-shadow(0 0 16px rgba(255,183,3,0.7)) drop-shadow(0 0 35px rgba(230,126,34,0.5)) drop-shadow(0 0 45px rgba(194,24,91,0.3))'
                                            ]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.15,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                    >
                                        <svg viewBox="0 0 100 110" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                            <defs>
                                                {/* Rich Chromatic Amber-Ruby Iridescent Gradient */}
                                                <radialGradient id="chromaticGlassGlow" cx="50%" cy="40%" r="65%">
                                                    <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.25" />
                                                    <stop offset="35%" stopColor="#FFB300" stopOpacity="0.20" />
                                                    <stop offset="65%" stopColor="#E65100" stopOpacity="0.15" />
                                                    <stop offset="85%" stopColor="#880E4F" stopOpacity="0.10" />
                                                    <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.08" />
                                                </radialGradient>

                                                {/* Multi-Spectrum Antique Gold Leaded Stroke */}
                                                <linearGradient id="richGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#FFF59D" />
                                                    <stop offset="25%" stopColor="#FFB300" />
                                                    <stop offset="50%" stopColor="#F57C00" />
                                                    <stop offset="75%" stopColor="#D81B60" />
                                                    <stop offset="90%" stopColor="#FFD54F" />
                                                    <stop offset="100%" stopColor="#00E5FF" />
                                                </linearGradient>

                                                {/* Inner Panel Dividers for 3 Gothic Panes */}
                                                <linearGradient id="mullionStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
                                                    <stop offset="100%" stopColor="#FF6F00" stopOpacity="0.4" />
                                                </linearGradient>
                                            </defs>

                                            {/* Full 3-Panel Outer Gothic Arch Fill */}
                                            <path
                                                d="M 50 2 C 76 16, 98 48, 98 108 L 2 108 C 2 48, 24 16, 50 2 Z"
                                                fill="url(#chromaticGlassGlow)"
                                                className="group-hover:opacity-90 transition-opacity"
                                            />

                                            {/* Subtle Leaded Glass Inner Mullion Lines (3D Depth Structure) */}
                                            <path
                                                d="M 28 48 L 28 108 M 72 48 L 72 108 M 2 72 L 98 72"
                                                stroke="url(#mullionStroke)"
                                                strokeWidth="0.8"
                                                strokeDasharray="2 2"
                                                fill="none"
                                                className="opacity-40 group-hover:opacity-75 transition-opacity"
                                            />

                                            {/* Precise Outer Leaded Stone Arch Border */}
                                            <path
                                                d="M 50 2 C 76 16, 98 48, 98 108 L 2 108 C 2 48, 24 16, 50 2 Z"
                                                fill="none"
                                                stroke="url(#richGoldStroke)"
                                                strokeWidth="2.2"
                                                className="transition-all duration-300 group-hover:stroke-white/90"
                                            />
                                        </svg>
                                    </motion.div>

                                    {/* 3D Caustic Glass Light Sweep */}
                                    <motion.div
                                        animate={{
                                            x: ['-140%', '180%'],
                                            opacity: [0, 0.65, 0]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2.8,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#FFFDE7]/35 via-[#00E5FF]/20 to-transparent -skew-x-18 pointer-events-none"
                                    />
                                </motion.button>
                            </div>
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

                                {/* Pure Kinetic Footprint Surge (No Rectangular Box Border) */}
                                <motion.div
                                    animate={{
                                        scale: [0.85, 1.45],
                                        opacity: [0.9, 0],
                                        y: [0, -75]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.7,
                                        ease: "easeOut"
                                    }}
                                    className="absolute bottom-6 flex items-center justify-center pointer-events-none"
                                >
                                    <Footprints className="w-8 h-8 text-[#E7FF00] drop-shadow-[0_0_20px_#E7FF00] drop-shadow-[0_0_35px_#00F0FF]" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. UPPER KINETIC TYPOGRAPHY & STEP 7 PROGRESSIVE 10-SEC TIMELINE */}
                <div className="absolute inset-x-0 top-14 md:top-18 z-20 pointer-events-none flex flex-col items-center text-center px-4">
                    {activeFrameIdx === 6 ? (
                        <div 
                            className="flex flex-col items-center text-center max-w-sm select-none"
                            style={{
                                transform: `perspective(600px) translate3d(${tiltX * 0.25}px, ${tiltY * 0.25}px, 15px) rotateX(${-tiltY * 0.35}deg) rotateY(${tiltX * 0.35}deg)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.15s ease-out'
                            }}
                        >
                            {/* Step Indicator Pill with Gyro Glow */}
                            <div className="mb-2 flex items-center gap-1.5">
                                {ATELIER_TIMELINE_STAGES.map((s, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`h-1 rounded-full transition-all duration-500 ${
                                            timelineStage === idx 
                                                ? 'w-6 bg-[#E7FF00] shadow-[0_0_12px_#E7FF00]' 
                                                : timelineStage > idx 
                                                    ? 'w-3 bg-[#E7FF00]/60' 
                                                    : 'w-2 bg-white/20'
                                        }`} 
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`timeline-${timelineStage}`}
                                    initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="flex flex-col items-center p-3 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                                    style={{
                                        textShadow: `${tiltX * 0.2}px ${tiltY * 0.2}px 15px rgba(231,255,0,0.3)`
                                    }}
                                >
                                    <span className="font-mono text-[11px] sm:text-xs font-black tracking-[0.25em] text-[#E7FF00] uppercase mb-1 drop-shadow-[0_0_12px_rgba(231,255,0,0.6)]">
                                        ✦ {ATELIER_TIMELINE_STAGES[timelineStage].tag} ✦
                                    </span>
                                    <h1 className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight mb-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                                        {ATELIER_TIMELINE_STAGES[timelineStage].title}
                                    </h1>
                                    <p className="font-sans text-xs sm:text-sm text-neutral-300 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                        "{ATELIER_TIMELINE_STAGES[timelineStage].desc}"
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    ) : null}
                </div>

                {/* 4. LOWER KINETIC FOOTPRINT & SONIC PACING VISUALIZER (NO RAW NUMBERS) */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-5 px-4 text-center z-20">
                    <div className="flex flex-col items-center gap-1.5 mb-2 pointer-events-none select-none">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{
                                    scale: isScrollingUp ? [1, 1.25, 1] : [1, 1.08, 1],
                                    opacity: isScrollingUp ? 1 : 0.65,
                                    y: isScrollingUp ? [-2, -6, 0] : [0, -2, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: isScrollingUp ? 0.4 : 0.9,
                                    ease: "easeInOut"
                                }}
                                className="flex items-center gap-1.5"
                            >
                                <Footprints className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                                    isScrollingUp 
                                        ? 'text-[#E7FF00] drop-shadow-[0_0_12px_#E7FF00]' 
                                        : 'text-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                                }`} />
                            </motion.div>

                            {/* Dynamic Sonic Pacing Equalizer Bars */}
                            <div className="flex items-end gap-1 h-3.5">
                                {[0.4, 0.85, 1.0, 0.7, 0.45].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            height: isScrollingUp 
                                                ? [4 * h, 14 * h, 3 * h, 14 * h] 
                                                : [3 * h, 7 * h, 3 * h],
                                            opacity: isScrollingUp ? [0.7, 1, 0.7] : [0.35, 0.7, 0.35]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: isScrollingUp ? 0.35 + i * 0.05 : 0.8 + i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                        className="w-0.5 rounded-full bg-gradient-to-t from-[#E7FF00] to-[#00F0FF] shadow-[0_0_6px_#E7FF00]"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Visual Pace Rhythm Dots */}
                        <div className="flex items-center gap-1.5 opacity-60">
                            {[0, 1, 2, 3].map((dotIdx) => (
                                <motion.span
                                    key={dotIdx}
                                    animate={{
                                        scale: isScrollingUp && (audioTier >= dotIdx + 1) ? [1, 1.4, 1] : 1,
                                        opacity: audioTier >= dotIdx + 1 ? 0.9 : 0.25
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.5,
                                        delay: dotIdx * 0.1
                                    }}
                                    className="w-1 h-1 rounded-full bg-[#E7FF00] shadow-[0_0_5px_#E7FF00]"
                                />
                            ))}
                        </div>
                    </div>

                    {/* 7-STAGE EVOLVING BOTTOM PROGRESS GAUGE (STAGE 1 -> STAGE 7 MASTERPIECE) */}
                    <div className="pointer-events-auto flex flex-col items-center gap-1.5 select-none">
                        {/* Evolutionary Stage Badge & Wing Nodes */}
                        <div className="flex items-center gap-2">
                            {activeFrameIdx >= 3 && (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="font-mono text-[9px] text-[#E7FF00] drop-shadow-[0_0_8px_#E7FF00]"
                                >
                                    {activeFrameIdx === 6 ? '✦ 🏛️ ✦' : '✦'}
                                </motion.span>
                            )}

                            {/* Dynamic Evolutionary Track Frame */}
                            <div 
                                className={`relative rounded-full overflow-hidden transition-all duration-500 flex items-center ${
                                    activeFrameIdx === 6
                                        ? 'w-52 sm:w-72 h-2.5 bg-gradient-to-r from-[#00F0FF]/30 via-[#E7FF00]/40 to-[#FF007F]/30 border border-[#E7FF00] shadow-[0_0_25px_rgba(231,255,0,0.8),0_0_40px_rgba(0,240,255,0.6)]'
                                        : activeFrameIdx === 5
                                            ? 'w-48 sm:w-68 h-2 bg-black/80 border border-[#E7FF00]/80 shadow-[0_0_20px_rgba(231,255,0,0.6)]'
                                            : activeFrameIdx === 4
                                                ? 'w-44 sm:w-64 h-1.5 bg-black/70 border border-[#FFA000]/60 shadow-[0_0_15px_#FFA000]'
                                                : activeFrameIdx === 3
                                                    ? 'w-44 sm:w-64 h-1.5 bg-white/20 border border-[#FFE082]/50 shadow-[0_0_12px_#FFE082]'
                                                    : activeFrameIdx >= 1
                                                        ? 'w-40 sm:w-60 h-1 bg-white/20 border border-[#00F0FF]/40 shadow-[0_0_10px_#00F0FF]'
                                                        : 'w-40 sm:w-60 h-1 bg-white/15'
                                } ${isScrollingUp ? 'scale-105' : 'scale-100'}`}
                            >
                                {/* Inner Energy Fill */}
                                <motion.div
                                    className={`h-full rounded-full transition-all duration-75 ${
                                        activeFrameIdx === 6
                                            ? 'bg-gradient-to-r from-[#E7FF00] via-[#00F0FF] via-[#FFE082] to-[#FF007F] shadow-[0_0_15px_#E7FF00]'
                                            : activeFrameIdx === 5
                                                ? 'bg-gradient-to-r from-[#E7FF00] via-[#00F0FF] to-[#E7FF00] shadow-[0_0_12px_#E7FF00]'
                                                : activeFrameIdx === 4
                                                    ? 'bg-gradient-to-r from-[#FFE082] to-[#FF8F00] shadow-[0_0_10px_#FFA000]'
                                                    : activeFrameIdx === 3
                                                        ? 'bg-gradient-to-r from-[#FFE082] to-[#E7FF00]'
                                                        : activeFrameIdx >= 1
                                                            ? 'bg-gradient-to-r from-[#E7FF00] to-[#00F0FF]'
                                                            : 'bg-[#E7FF00]'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />

                                {/* Stage 6/7 Prismatic Caustic Light Sweep on Bar */}
                                {activeFrameIdx >= 5 && (
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                                        className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 pointer-events-none"
                                    />
                                )}
                            </div>

                            {activeFrameIdx >= 3 && (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="font-mono text-[9px] text-[#E7FF00] drop-shadow-[0_0_8px_#E7FF00]"
                                >
                                    {activeFrameIdx === 6 ? '✦ 🏛️ ✦' : '✦'}
                                </motion.span>
                            )}
                        </div>

                        {/* Stage Level Indicator */}
                        <div className="flex items-center gap-1 opacity-75">
                            <span className="font-mono text-[8px] tracking-widest text-[#E7FF00] font-black uppercase">
                                {activeFrameIdx === 6 
                                    ? 'STAGE VII • ATELIER TRANSCENDED' 
                                    : `STAGE 0${activeFrameIdx + 1} / 07`}
                            </span>
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
                                const tiltXVal = tilt.x * 16 * item.tiltMult;
                                const tiltYVal = tilt.y * 16 * item.tiltMult;

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
                                transform: `perspective(600px) rotateX(${tiltY * -0.6}deg) rotateY(${tiltX * 0.6}deg) translateZ(30px)`,
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
