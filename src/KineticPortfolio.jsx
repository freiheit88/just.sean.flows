import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Volume2, VolumeX, Sliders, Play, Pause, 
    Download, Music, Check, ThumbsUp, ArrowRight, 
    Compass, ExternalLink, QrCode, ChevronDown, RotateCcw, Zap, Flame, Mic, Building2, X, Globe, ShieldCheck, Activity,
    Key, Lock, Tag, Ticket, Shield, Sparkles, ChevronUp
} from 'lucide-react';

const SECRET_YOUTUBE_URL = "https://www.youtube.com/watch?v=RUoWgJDZ0M8&t=1330s";
const ATELIER_IMG = "/assets/frankfurt_sound_atelier.jpg";

// Encoded Audio URIs for 100% Mobile & PC Browser Compatibility
const STEM_SRCS = {
    guitar: "/assets/manual_upload/A%20Twelve-minute%20Alibi/3%20Guitar.mp3",
    bass: "/assets/manual_upload/A%20Twelve-minute%20Alibi/2%20Bass.mp3",
    drums: "/assets/manual_upload/A%20Twelve-minute%20Alibi/1%20Drums.mp3",
    perc: "/assets/manual_upload/A%20Twelve-minute%20Alibi/4%20Percussion.mp3",
    synth: "/assets/manual_upload/A%20Twelve-minute%20Alibi/5%20Synth.mp3",
    vocal: "/assets/manual_upload/A%20Twelve-minute%20Alibi/0%20Lead%20Vocals.mp3",
};

// Full 7-Step 1st-Person Walkthrough Story Sequence (100% Architecture & Lighting Consistency)
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

// 100 DISTINCT ATELIER CONCEPT FRAGMENTS
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

// GENERATE 100 DIVERSE SHAPE CATEGORIES WITH 3X AMPLIFIED 3D Z-DEPTH
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
        const lerpFactors = [0.32, 0.22, 0.16, 0.11]; // Different lag per trail node

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

    const calculateEnding = () => {
        const { violin, electric, bass, orchestra } = stems;
        let ending = { ...DEFAULT_ENDING };

        if (electric > violin && electric > bass) {
            ending = {
                id: 'rebel',
                title: 'THE ELECTRIC REBEL',
                subtitle: 'Velvet Distortion & Sheffield Grit',
                desc: 'Raw indie rock energy breaking all rules. Sovereign of night velocity.',
                accent: '#FF0055',
                quote: 'Shattering classical decorum with raw guitar feedback.'
            };
        } else if (bass > violin && bass > orchestra) {
            ending = {
                id: 'nocturne',
                title: 'THE CHAMPAGNE NOCTURNE',
                subtitle: 'Midnight Salon & Crystal Flute',
                desc: 'Sensual bass pulse in a private 3 AM salon with champagne euphoria.',
                accent: '#00F0FF',
                quote: 'Ruling the heavy noir bassline while the world sleeps.'
            };
        } else if (orchestra >= 85) {
            ending = {
                id: 'architect',
                title: 'THE SOVEREIGN ARCHITECT',
                subtitle: 'Frankfurt Grand Symphony Tutti',
                desc: 'Grand orchestra tutti exploding at Alte Oper. Mathematical master of sound.',
                accent: '#C5A059',
                quote: 'Controlling systems by day, governing frequencies by night.'
            };
        }

        setActiveEnding(ending);
        setCurrentStep('ticket');
    };

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
            // 240px cursor centered: -120px offset
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
            {/* 1. UNIFIED MOBILE & PC GLOW CURSOR (20% LARGER + SOFTENED CORE + 4 MUSICAL AFTERIMAGES) */}
            
            {/* 4 TRAILING MUSICAL GLYPH AFTERIMAGES */}
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
                        {/* Trail 0: Beamed Notes ♫ */}
                        {idx === 0 && (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={colors[0]} className="filter drop-shadow-[0_0_8px_#E7FF00]">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                        )}
                        {/* Trail 1: Eighth Note ♪ */}
                        {idx === 1 && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={colors[1]} className="filter drop-shadow-[0_0_8px_#00F0FF]">
                                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
                            </svg>
                        )}
                        {/* Trail 2: Treble / Cadenza Symbol 𝄞 */}
                        {idx === 2 && (
                            <div className="font-serif font-black text-xl text-[#E7FF00] drop-shadow-[0_0_8px_#E7FF00]">
                                𝄞
                            </div>
                        )}
                        {/* Trail 3: Sharp & Fermata Dot ♯ */}
                        {idx === 3 && (
                            <div className="font-mono font-black text-base text-[#C5A059] drop-shadow-[0_0_6px_#C5A059]">
                                ♯
                            </div>
                        )}
                    </div>
                );
            })}

            {/* MAIN FLASHLIGHT SPOTLIGHT (+20% SIZE: 240px / 312px on scroll) */}
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
                {/* Outer Glow Wave (20% Softer Brightness, Enhanced Rich Atmospheric Glow) */}
                <div 
                    className={`w-full h-full rounded-full transition-all duration-300 filter blur-xl ${
                        isScrollingUp 
                            ? 'bg-radial from-[#E7FF00]/30 via-[#00F0FF]/18 to-transparent scale-110' 
                            : 'bg-radial from-[#E7FF00]/12 via-white/[0.03] to-transparent'
                    }`} 
                />

                {/* Center Core Spark with Music Glyph */}
                <div 
                    className={`absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 flex items-center justify-center ${
                        isScrollingUp 
                            ? 'w-7 h-7 bg-[#E7FF00]/80 shadow-[0_0_25px_#E7FF00,0_0_40px_#00F0FF] scale-110' 
                            : 'w-4 h-4 bg-[#E7FF00]/60 shadow-[0_0_14px_#E7FF00]'
                    }`} 
                >
                    <Music className={`w-3 h-3 text-black transition-transform ${isScrollingUp ? 'scale-125' : 'scale-90'}`} />
                </div>

                {/* Dynamic Upward Dopamine Kinetic Badge */}
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

            <main className="relative z-10 w-full h-full flex items-center justify-center md:pt-10">
                {currentStep === 'flipbook' && (
                    <FlipbookWalkingEngine 
                        tilt={tilt}
                        cursorPos={cursorPos}
                        isScrollingUp={isScrollingUp}
                        setIsScrollingUp={setIsScrollingUp}
                        onEnterMixer={() => setCurrentStep('mixer_ending')} 
                        onOpenAtelier={() => setShowAtelierModal(true)}
                    />
                )}

                {currentStep === 'mixer_ending' && (
                    <div className="w-full h-full overflow-y-auto pt-16 pb-24 touch-pan-y" style={{ touchAction: 'pan-y' }}>
                        <StemMixerEndingStage
                            userNickname={userNickname}
                            setUserNickname={setUserNickname}
                            stems={stems}
                            setStems={setStems}
                            onGenerateTicket={calculateEnding}
                        />
                    </div>
                )}

                {currentStep === 'ticket' && (
                    <div className="w-full h-full overflow-y-auto pt-16 pb-24 touch-pan-y" style={{ touchAction: 'pan-y' }}>
                        <InstagramStoryTicketModal
                            userNickname={userNickname || "SEAN"}
                            ending={activeEnding || DEFAULT_ENDING}
                            stems={stems}
                            onBack={() => setCurrentStep('mixer_ending')}
                        />
                    </div>
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
// 1인칭 보행 엔진 (초기 3초 탐색 일시정지 + 상향 스크롤 도파민 연출)
// ==============================================================================
function FlipbookWalkingEngine({ tilt, cursorPos, isScrollingUp, setIsScrollingUp, onEnterMixer, onOpenAtelier }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    
    // Initial Audio Unlock & Blur Overlay State
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

    // Initial 3-Second Exploration Grace Period (자동 진행 일시 정지)
    const [gracePeriodSec, setGracePeriodSec] = useState(3);
    const hasUserStartedScroll = useRef(false);

    // Live Dev Kinetics Power Meter State (Raw Number Only, No % Sign!)
    const [livePowerStr, setLivePowerStr] = useState("0");
    const [isTremblingAt8012, setIsTremblingAt8012] = useState(false);

    const [audioTier, setAudioTier] = useState(1);

    const audioCtxRef = useRef(null);
    const guitarRef = useRef(null); // MASTER TIER 1 TRACK (3 Guitar.mp3)
    const bassRef = useRef(null);
    const drumsRef = useRef(null);
    const percRef = useRef(null);
    const synthRef = useRef(null);
    const vocalRef = useRef(null);

    const mediaNodesRef = useRef({});
    const prevStemVolsRef = useRef({ bass: 0, drums: 0, perc: 0, synth: 0, vocal: 0 });

    // Dynamic Footstep Timestamp Guard & Alternating Foot State
    const lastFootstepTimeRef = useRef(0);
    const isLeftFootRef = useRef(true);
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

    // PAGE-LEVEL BACKGROUND AUDIO PAUSE SAFEGUARD
    useEffect(() => {
        const pauseAllAudioSafeguard = () => {
            const allAudioRefs = [guitarRef, bassRef, drumsRef, percRef, synthRef, vocalRef];
            allAudioRefs.forEach((r) => {
                if (r.current && !r.current.paused) {
                    try { r.current.pause(); } catch(e) {}
                }
            });
            if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
                try { audioCtxRef.current.suspend(); } catch(e) {}
            }
        };

        const resumeAudioIfUnlocked = () => {
            if (isAudioUnlocked) {
                if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                    try { audioCtxRef.current.resume(); } catch(e) {}
                }
                if (guitarRef.current && guitarRef.current.paused) {
                    try { guitarRef.current.play().catch(() => {}); } catch(e) {}
                }
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                pauseAllAudioSafeguard();
            } else {
                resumeAudioIfUnlocked();
            }
        };

        const handlePageHide = () => {
            pauseAllAudioSafeguard();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);
        window.addEventListener('blur', handlePageHide);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
            window.removeEventListener('blur', handlePageHide);
        };
    }, [isAudioUnlocked]);

    // UNIFIED WEB AUDIO FOOTSTEP SYNTHESIZER
    const playSingleFootstepSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const isLeft = isLeftFootRef.current;
            isLeftFootRef.current = !isLeft;

            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isLeft ? 165 : 190, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.05);

            oscGain.gain.setValueAtTime(0.15, ctx.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            const bufferSize = Math.floor(ctx.sampleRate * 0.05);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = isLeft ? 1400 : 1600;
            noiseFilter.Q.value = 2.4;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.22, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            const mainGain = ctx.createGain();
            mainGain.gain.value = 1.05;

            const delayNode = ctx.createDelay();
            delayNode.delayTime.value = 0.22;

            const echoFeedbackGain = ctx.createGain();
            echoFeedbackGain.gain.value = 0.42;

            osc.connect(oscGain);
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);

            oscGain.connect(mainGain);
            noiseGain.connect(mainGain);

            mainGain.connect(ctx.destination);
            mainGain.connect(delayNode);
            delayNode.connect(echoFeedbackGain);
            echoFeedbackGain.connect(delayNode);
            delayNode.connect(ctx.destination);

            osc.start(); noise.start();
            osc.stop(ctx.currentTime + 0.06);
            noise.stop(ctx.currentTime + 0.06);
        } catch (e) {}
    };

    // STRICT FOOTSTEP RATE-LIMIT & LEVEL 1 ONLY OFF-SWITCH SAFEGUARD
    const MIN_FOOTSTEP_INTERVAL_MS = 260;

    const triggerCleanFootstep = (speedVelocity = 1) => {
        // FOOTSTEP OFF-SWITCH: ONLY PLAY DURING INITIAL ENTRY / GUITAR-ONLY TIER 1 (OFF BEFORE LEVEL UP / TIER 2+)
        if (currentPower.current >= 20 || audioTier > 1) return;

        const now = Date.now();
        const dynamicInterval = Math.max(MIN_FOOTSTEP_INTERVAL_MS, 750 - Math.min(speedVelocity * 80, 480));
        
        if (now - lastFootstepTimeRef.current >= dynamicInterval) {
            lastFootstepTimeRef.current = now;
            playSingleFootstepSound();
        }
    };

    // SETUP UNIFIED WEB AUDIO MEDIA GRAPH
    const setupUnifiedAudioGraph = (ctx) => {
        const stemsMap = {
            guitar: guitarRef, bass: bassRef, drums: drumsRef,
            perc: percRef, synth: synthRef, vocal: vocalRef
        };

        Object.keys(stemsMap).forEach((key) => {
            const ref = stemsMap[key];
            if (ref.current && !mediaNodesRef.current[key]) {
                try {
                    const sourceNode = ctx.createMediaElementSource(ref.current);
                    const gainNode = ctx.createGain();
                    gainNode.gain.value = key === 'guitar' ? 0.50 : 0.0;
                    sourceNode.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    mediaNodesRef.current[key] = { sourceNode, gainNode };
                } catch (e) {}
            }
        });
    };

    // GUARANTEED INSTANT SOUND UNLOCKER WITH FOOTSTEP CHECK SOUND
    const forceUnlockAudio = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();

        if (!isAudioUnlocked) {
            setIsAudioUnlocked(true);
            triggerCleanFootstep(1.5);
        }

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
                const ctx = audioCtxRef.current;
                if (ctx.state === 'suspended') ctx.resume();

                setupUnifiedAudioGraph(ctx);
            }
        } catch (err) {}

        if (guitarRef.current) {
            guitarRef.current.muted = false;
            guitarRef.current.playsInline = true;
            guitarRef.current.volume = 0.50;
            if (mediaNodesRef.current.guitar) {
                mediaNodesRef.current.guitar.gainNode.gain.value = 0.50;
            }
            if (guitarRef.current.paused) {
                guitarRef.current.play().catch(() => {});
            }
        }

        const otherRefs = [bassRef, drumsRef, percRef, synthRef, vocalRef];

        otherRefs.forEach((r) => {
            if (r.current) {
                r.current.muted = false;
                r.current.playsInline = true;
                if (r.current.volume === undefined || r.current.volume === null) {
                    r.current.volume = 0.0;
                }
                if (r.current.paused) {
                    r.current.play().catch(() => {});
                }
            }
        });
    };

    // CLEAN UNMOUNT AUDIO LIFECYCLE CLEANUP
    useEffect(() => {
        return () => {
            [guitarRef, bassRef, drumsRef, percRef, synthRef, vocalRef].forEach((r) => {
                if (r.current) {
                    try {
                        r.current.pause();
                    } catch (e) {}
                }
            });
        };
    }, []);

    // REAL-TIME VOLUME DECAY & GUITAR-FIRST STEM UNMUTE ENGINE
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const volumeEngineInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceScroll = now - lastScrollPumpTime.current;

            // 3초 탐색 기간 동안에는 파워 감소 일시정지
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
            let targetGuitar = 0.50;
            let targetBass = 0.0;
            let targetOtherInst = 0.0;
            let targetVocal = 0.0;

            if (rawPower >= 80) {
                tier = 4;
                targetGuitar = 1.0;
                targetBass = 1.0;
                targetOtherInst = 1.0;
                targetVocal = 0.95;
            } else if (rawPower >= 50) {
                tier = 3;
                if (unlockedLevelFloor.current < 50) unlockedLevelFloor.current = 50;
                targetGuitar = 0.90;
                targetBass = 0.90;
                targetOtherInst = 0.85;
                targetVocal = 0.0;
            } else if (rawPower >= 20) {
                tier = 2;
                if (unlockedLevelFloor.current < 20) unlockedLevelFloor.current = 20;
                targetGuitar = 0.75;
                targetBass = 0.70;
                targetOtherInst = 0.0;
                targetVocal = 0.0;
            } else {
                tier = 1;
                targetGuitar = 0.50;
                targetBass = 0.0;
                targetOtherInst = 0.0;
                targetVocal = 0.0;
            }

            setAudioTier(tier);

            if (guitarRef.current) {
                guitarRef.current.volume = targetGuitar;
                if (mediaNodesRef.current.guitar) {
                    mediaNodesRef.current.guitar.gainNode.gain.value = targetGuitar;
                }
                if (guitarRef.current.paused) {
                    guitarRef.current.play().catch(() => {});
                }
            }

            const masterTime = (guitarRef.current && guitarRef.current.currentTime) ? guitarRef.current.currentTime : 0;

            const applyStemVolClean = (ref, targetVol, stemKey) => {
                if (ref.current) {
                    const prevVol = prevStemVolsRef.current[stemKey] || 0;
                    
                    if (prevVol <= 0.01 && targetVol > 0.01 && masterTime > 0) {
                        ref.current.currentTime = masterTime;
                    }

                    ref.current.volume = targetVol;
                    if (mediaNodesRef.current[stemKey]) {
                        mediaNodesRef.current[stemKey].gainNode.gain.value = targetVol;
                    }
                    prevStemVolsRef.current[stemKey] = targetVol;

                    if (targetVol > 0 && ref.current.paused) {
                        ref.current.play().catch(() => {});
                    }
                }
            };

            applyStemVolClean(bassRef, targetBass, 'bass');
            applyStemVolClean(drumsRef, targetOtherInst, 'drums');
            applyStemVolClean(percRef, targetOtherInst, 'perc');
            applyStemVolClean(synthRef, targetOtherInst, 'synth');
            applyStemVolClean(vocalRef, targetVocal, 'vocal');

        }, 50);

        return () => clearInterval(volumeEngineInterval);
    }, [isAudioUnlocked, gracePeriodSec]);

    // WALKING PACING TIMELINE (체류 시간 2배 확장 & 처음 3초간 자동 흐름 일시 정지)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const interval = setInterval(() => {
            // 3초 탐색 기간 동안에는 자동 흐름 일시 정지
            if (gracePeriodSec > 0 && !hasUserStartedScroll.current) return;

            setProgress((prev) => {
                if (prev >= 100) return 100;
                const next = Math.min(100, prev + 0.04);
                progressRef.current = next;
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isAudioUnlocked, gracePeriodSec]);

    // PROGRESSIVE SCROLL & TOUCH ENGINE (상향 스크롤 감지 및 도파민 활성화, 2배 체류 감도)
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

            // 오직 밑에서 위로(화면 전진 방향) 스크롤할 때만 도파민 활성화!
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

            // 체류 시간 2배 확장을 위해 진행도 증가량 절반으로 조정
            const clampedDelta = Math.min(rawDelta * 0.00225, 1.25);
            setProgress((prev) => {
                const next = Math.min(100, prev + clampedDelta);
                progressRef.current = next;
                return next;
            });

            triggerCleanFootstep(rawDelta * 0.02);
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

            // 오직 위로 스와이프(전진)할 때만 도파민 활성화!
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

                // 체류 시간 2배 확장을 위해 터치 진행도 증가량 절반으로 조정
                const strokeProgress = Math.min(deltaY * 0.011, 1.9);
                setProgress((prev) => {
                    const next = Math.min(100, prev + strokeProgress);
                    progressRef.current = next;
                    return next;
                });

                triggerCleanFootstep(velocity * 2.2);
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
            {/* Ambient Background Blur for Desktop */}
            <div 
                className="hidden md:block absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 scale-110 pointer-events-none transition-all duration-700"
                style={{ backgroundImage: `url(${currentFrame.src})` }}
            />

            {/* 6 Synchronized Multi-Stem Audio Elements */}
            <audio ref={guitarRef} src={STEM_SRCS.guitar} loop playsInline preload="auto" />
            <audio ref={bassRef} src={STEM_SRCS.bass} loop playsInline preload="auto" />
            <audio ref={drumsRef} src={STEM_SRCS.drums} loop playsInline preload="auto" />
            <audio ref={percRef} src={STEM_SRCS.perc} loop playsInline preload="auto" />
            <audio ref={synthRef} src={STEM_SRCS.synth} loop playsInline preload="auto" />
            <audio ref={vocalRef} src={STEM_SRCS.vocal} loop playsInline preload="auto" />

            {/* 1. FULL 7-STEP FLIPBOOK WALKING STAGE (CLEAN 9:16 RESPONSIVE STAGE) */}
            <div 
                className="relative w-full h-full md:w-[410px] md:h-[82vh] md:max-h-[820px] md:rounded-[36px] md:border-2 md:border-white/20 md:shadow-[0_0_80px_rgba(231,255,0,0.15)] overflow-hidden transition-all duration-700 bg-black"
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

                {/* 2. DIRECT CLICKABLE ATELIER DOOR ZONE (FRAME 3 & 4) */}
                <AnimatePresence>
                    {isAtelierOptionVisible && isAudioUnlocked && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
                        >
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenAtelier();
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="pointer-events-auto relative w-[200px] h-[360px] ml-[-20px] mt-[50px] rounded-2xl cursor-pointer group outline-none"
                            >
                                <div className="absolute inset-0 rounded-2xl border-2 border-[#E7FF00]/40 group-hover:border-[#E7FF00] transition-all duration-300 shadow-[0_0_30px_rgba(231,255,0,0.25)] group-hover:shadow-[0_0_50px_rgba(231,255,0,0.7)]" />
                                <div className="absolute inset-0 rounded-2xl bg-[#E7FF00]/[0.03] group-hover:bg-[#E7FF00]/[0.08] transition-colors duration-300" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                                {/* 2.5 NARROW AUDIO-REACTIVE KINETIC SONIC BEAM (상단 레이어 z-25, 좁고 세련된 음악 매칭 빔) */}
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
                                {/* Core Upward Neon Light Beam */}
                                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#E7FF00]/30 via-[#00F0FF]/25 to-transparent rounded-full filter blur-lg" />
                                <div className="absolute w-1.5 h-44 bottom-0 bg-gradient-to-t from-[#E7FF00] via-[#00F0FF] to-transparent rounded-full shadow-[0_0_20px_#E7FF00,0_0_35px_#00F0FF] animate-pulse" />

                                {/* 5-Pillar Rhythmic Audio EQ Kinetic Bars */}
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

                                {/* Micro Kinetic Sonic Ripples */}
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

                {/* 3. Floating Spatial HUD & Cleaned-up Signature Typography */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-16 pb-6 px-4 text-center z-20">
                    {/* PURE TRANSLUCENT ETHEREAL POWER NUMBER */}
                    <div className="flex flex-col items-center justify-center pt-2 select-none pointer-events-none">
                        <span 
                            className={`font-mono text-sm sm:text-base font-black tracking-[0.25em] transition-all duration-300 ${
                                isTremblingAt8012 
                                    ? 'text-[#FF0055] animate-pulse drop-shadow-[0_0_20px_#FF0055] opacity-90' 
                                    : isScrollingUp
                                        ? 'text-[#E7FF00] drop-shadow-[0_0_15px_#E7FF00] opacity-80 scale-110'
                                        : 'text-white/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] opacity-40'
                            }`}
                        >
                            {livePowerStr}
                        </span>
                    </div>

                    {/* True 3D Assembled Typography (단어별 대화형 블룸 & 스크롤/파워 레벨 연동 속도) */}
                    <div className="max-w-sm mx-auto my-auto px-2 flex flex-col items-center">
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
                                {/* SUBTITLE / TOP PHRASE (WORD BY WORD) */}
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

                                {/* MAIN TITLE / CONVERSATIONAL PHRASE (WORD BY WORD SPOKEN BLOOM) */}
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
                        {/* CLEAN DARK OVERLAY & BLUR FILTER LAYER */}
                        <div className="absolute inset-0 bg-black/55 backdrop-blur-[3.5px] pointer-events-none z-10" />

                        {/* 100-ITEM 3D PARALLAX DEBRIS LAYER (Z-0) */}
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

                        {/* FOREGROUND 3D TILT "LET'S GO !" CONTAINER */}
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
                            {/* 3X LOUD NEON RED/MAGENTA GHOST LAYER */}
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

                            {/* 3X LOUD NEON CYAN/BLUE GHOST LAYER */}
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

                            {/* MASTER CORE FOREGROUND TEXT */}
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
                    RESUME WALKING TOWARDS CONCERT PALACE →
                </button>
            </motion.div>
        </motion.div>
    );
}

// STEM MIXER STAGE
function StemMixerEndingStage({ userNickname, setUserNickname, stems, setStems, onGenerateTicket }) {
    return (
        <div className="pt-20 pb-20 px-4 sm:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-[#E7FF00] tracking-widest uppercase mb-2">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>CURATOR STEM MIXER</span>
                </div>
                <h2 className="font-sans text-3xl sm:text-5xl font-black text-[#FFFFFF] uppercase">
                    CRAFT YOUR HARMONY
                </h2>
                <p className="font-mono text-xs text-white/60 mt-2 max-w-md mx-auto">
                    Sculpt the 4 audio stems to reveal your personalized VIP ending pass.
                </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="font-mono text-xs text-center sm:text-left">
                    <span className="text-[#E7FF00] font-bold block mb-0.5">ARTIST NICKNAME</span>
                    <span className="text-white/50 text-[10px]">Your signature printed on ticket.</span>
                </div>
                <input
                    type="text"
                    value={userNickname}
                    maxLength={12}
                    onChange={(e) => setUserNickname(e.target.value.toUpperCase() || "SEAN")}
                    className="w-full sm:w-auto bg-black/70 border border-white/20 px-5 py-2 rounded-xl font-mono text-xs font-bold text-center tracking-widest uppercase text-white outline-none focus:border-[#E7FF00]"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                    { id: 'violin', label: '01. SOLO VIOLIN', desc: 'Paganini Solo Cadenza', color: '#E7FF00' },
                    { id: 'electric', label: '02. ELECTRIC DISTORTION', desc: 'Indie Rock Amp Feedback', color: '#FF0055' },
                    { id: 'bass', label: '03. NOIR BASS', desc: '02:00 AM Midnight Salon Pulse', color: '#00F0FF' },
                    { id: 'orchestra', label: '04. GRAND SYMPHONY', desc: 'Full Orchestra Tutti', color: '#C5A059' },
                ].map((s) => (
                    <div key={s.id} className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/[0.02] flex flex-col justify-between">
                        <div className="flex justify-between items-center font-mono text-xs mb-2">
                            <span className="font-bold text-[#FFFFFF] text-[11px]">{s.label}</span>
                            <span style={{ color: s.color }} className="font-bold">{stems[s.id]}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={stems[s.id]}
                            onChange={(e) => setStems({ ...stems, [s.id]: Number(e.target.value) })}
                            className="w-full accent-white h-2 bg-white/10 rounded cursor-pointer my-3"
                        />
                        <span className="font-mono text-[9px] text-white/50">{s.desc}</span>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={onGenerateTicket}
                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#E7FF00] text-black font-mono text-xs font-black tracking-[0.25em] uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(231,255,0,0.5)] flex items-center justify-center gap-2 mx-auto"
                >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>GET 9:16 VIP PASS</span>
                </button>
            </div>
        </div>
    );
}

// INSTAGRAM STORY 9:16 VIP TICKET MODAL
function InstagramStoryTicketModal({ userNickname, ending, stems, onBack }) {
    const canvasRef = useRef(null);
    const [ticketDataUrl, setTicketDataUrl] = useState(null);

    const safeEnding = ending || DEFAULT_ENDING;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = 1080;
        const H = 1920;
        canvas.width = W;
        canvas.height = H;

        ctx.fillStyle = '#070709';
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        for (let x = 60; x < W; x += 120) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }

        ctx.strokeStyle = safeEnding.accent || '#E7FF00';
        ctx.lineWidth = 8;
        ctx.strokeRect(60, 60, W - 120, H - 120);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('JUST.SEAN.FLOWS // PRIVATE EXHIBITION', W / 2, 160);

        ctx.fillStyle = safeEnding.accent || '#E7FF00';
        ctx.font = '700 24px monospace';
        ctx.fillText('VIP ALL-ACCESS PASS · 2026', W / 2, 210);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 68px sans-serif';
        ctx.fillText(safeEnding.title, W / 2, 360);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '400 30px monospace';
        ctx.fillText(safeEnding.subtitle, W / 2, 420);

        ctx.strokeStyle = safeEnding.accent || '#E7FF00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let x = 120; x < W - 120; x += 8) {
            const h = Math.sin(x * 0.03) * 60 + Math.cos(x * 0.08) * 30;
            ctx.moveTo(x, 580 - h);
            ctx.lineTo(x, 580 + h);
        }
        ctx.stroke();

        ctx.fillStyle = '#111115';
        ctx.fillRect(120, 700, W - 240, 240);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeRect(120, 700, W - 240, 240);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 24px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`ARTIST: ${userNickname}`, 160, 760);
        ctx.fillText(`VIOLIN STEM: ${stems.violin}%`, 160, 810);
        ctx.fillText(`ELECTRIC STEM: ${stems.electric}%`, 160, 860);
        ctx.fillText(`BASS / ORCH: ${stems.bass}% / ${stems.orchestra}%`, 160, 910);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'italic 34px serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${safeEnding.quote}"`, W / 2, 1060);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(W / 2 - 140, 1180, 280, 280);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(W / 2 - 120, 1200, 70, 70);
        ctx.fillRect(W / 2 + 50, 1200, 70, 70);
        ctx.fillRect(W / 2 - 120, 1370, 70, 70);
        ctx.font = 'bold 20px monospace';
        ctx.fillText('SCAN FOR SECRET VAULT', W / 2, 1500);

        ctx.fillStyle = safeEnding.accent || '#E7FF00';
        ctx.font = '900 36px monospace';
        ctx.fillText('JUST.SEAN.FLOWS', W / 2, 1720);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '400 22px monospace';
        ctx.fillText('FRANKFURT AM MAIN · ALL RIGHTS RESERVED', W / 2, 1780);

        try {
            setTicketDataUrl(canvas.toDataURL('image/png'));
        } catch (e) {}
    }, [safeEnding, stems, userNickname]);

    const downloadTicket = () => {
        if (!ticketDataUrl) return;
        const a = document.createElement('a');
        a.href = ticketDataUrl;
        a.download = `JUST_SEAN_FLOWS_VIP_PASS_${userNickname}.png`;
        a.click();
    };

    return (
        <div className="pt-20 pb-20 px-4 max-w-lg mx-auto flex flex-col items-center text-center">
            <canvas ref={canvasRef} className="hidden" />

            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#E7FF00] tracking-widest uppercase mb-3">
                <Check className="w-3.5 h-3.5" />
                <span>ENDING UNLOCKED: {safeEnding.title}</span>
            </div>

            <h2 className="font-sans text-3xl sm:text-5xl font-black text-white uppercase mb-2">
                9:16 VIP PASS READY
            </h2>
            <p className="font-mono text-[11px] text-white/60 max-w-xs mb-6">
                Ready for Instagram Story sharing in 9:16 vertical high resolution.
            </p>

            <div className="w-full rounded-3xl border border-white/20 bg-black/90 p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden mb-6">
                <div className="flex justify-between items-center font-mono text-[9px] text-[#E7FF00] mb-3 pb-2 border-b border-white/10">
                    <span>VIP PASS · 2026</span>
                    <span>JUST.SEAN.FLOWS</span>
                </div>

                <div className="text-left mb-4">
                    <span className="font-mono text-[9px] text-white/50 block">ARTIST: {userNickname}</span>
                    <h3 className="font-sans text-xl font-black text-white" style={{ color: safeEnding.accent }}>
                        {safeEnding.title}
                    </h3>
                    <p className="font-mono text-[9px] text-white/70 mt-0.5">{safeEnding.subtitle}</p>
                </div>

                <p className="font-serif italic text-[11px] text-white/90 my-4 border-y border-white/10 py-2.5">
                    "{safeEnding.quote}"
                </p>

                <a
                    href={SECRET_YOUTUBE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between hover:border-[#E7FF00] transition-colors mb-3 group"
                >
                    <div className="flex items-center gap-2.5 text-left">
                        <QrCode className="w-5 h-5 text-[#E7FF00]" />
                        <div>
                            <span className="font-mono text-[9px] text-[#FFFFFF] font-bold block">SECRET YOUTUBE VAULT</span>
                            <span className="font-mono text-[7px] text-white/40">CLICK TO UNLOCK UNLISTED VIDEO</span>
                        </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#E7FF00] group-hover:text-[#E7FF00]" />
                </a>

                <div className="font-mono text-[8px] text-white/40">
                    FRANKFURT AM MAIN · JUST.SEAN.FLOWS
                </div>
            </div>

            <div className="w-full flex flex-col gap-2.5">
                <button
                    onClick={downloadTicket}
                    className="w-full py-3.5 rounded-full bg-[#E7FF00] text-black font-mono text-xs font-black tracking-wider uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(231,255,0,0.4)] flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD 9:16 STORY TICKET</span>
                </button>

                <a
                    href={SECRET_YOUTUBE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs font-bold tracking-wider uppercase hover:border-[#E7FF00] hover:text-[#E7FF00] transition-all flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4 fill-current" />
                    <span>WATCH SECRET YOUTUBE VIDEO</span>
                </a>
            </div>

            <button
                onClick={onBack}
                className="mt-6 font-mono text-[11px] text-[#FFFFFF]/40 hover:text-white transition-colors"
            >
                ← RE-MIX STEMS &amp; TRY ANOTHER
            </button>
        </div>
    );
}
