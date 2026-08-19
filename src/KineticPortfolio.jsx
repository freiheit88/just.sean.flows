import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Volume2, VolumeX, Sliders, Play, Pause, 
    Download, Music, Check, ThumbsUp, ArrowRight, 
    Compass, ExternalLink, QrCode, ChevronDown, RotateCcw, Zap, Flame, Mic, Building2, X, Globe, ShieldCheck
} from 'lucide-react';

const SECRET_YOUTUBE_URL = "https://www.youtube.com/watch?v=RUoWgJDZ0M8&t=1330s";
const ATELIER_IMG = "/assets/frankfurt_sound_atelier.jpg";

// Encoded Audio URIs for 100% Mobile Browser Compatibility
const STEM_SRCS = {
    bass: "/assets/manual_upload/A%20Twelve-minute%20Alibi/2%20Bass.mp3",
    guitar: "/assets/manual_upload/A%20Twelve-minute%20Alibi/3%20Guitar.mp3",
    drums: "/assets/manual_upload/A%20Twelve-minute%20Alibi/1%20Drums.mp3",
    perc: "/assets/manual_upload/A%20Twelve-minute%20Alibi/4%20Percussion.mp3",
    synth: "/assets/manual_upload/A%20Twelve-minute%20Alibi/5%20Synth.mp3",
    vocal: "/assets/manual_upload/A%20Twelve-minute%20Alibi/0%20Lead%20Vocals.mp3",
};

const FRAMES = [
    { id: 0, src: "/assets/walk_01.jpg", titleTop: "THE MIDNIGHT", titleMain: "PALACE", sub: "Distant View Across the Square" },
    { id: 1, src: "/assets/walk_02.jpg", titleTop: "APPROACHING", titleMain: "STONE ARCHES", sub: "Crossing the Wet Cobblestones" },
    { id: 2, src: "/assets/walk_03.jpg", titleTop: "MONUMENTAL", titleMain: "FACADE", sub: "Warm Amber Lanterns Glowing", hasBuildingTarget: true },
    { id: 3, src: "/assets/walk_04.jpg", titleTop: "FOOT OF", titleMain: "STAIRWAY", sub: "Looking up at Central Portal", hasBuildingTarget: true },
    { id: 4, src: "/assets/walk_05.jpg", titleTop: "ASCENDING", titleMain: "TO PORTAL", sub: "Climbing Stone Steps" },
    { id: 5, src: "/assets/walk_06.jpg", titleTop: "THE BRASS", titleMain: "HANDLES", sub: "Standing Before Massive Double Doors" },
    { id: 6, src: "/assets/walk_07.jpg", titleTop: "THE DOORS", titleMain: "OPEN", sub: "Golden Opera Hall Revealed" }
];

const DEFAULT_ENDING = {
    id: 'virtuoso',
    title: 'THE MIDNIGHT VIRTUOSO',
    subtitle: '02:00 AM Violin Cadenza Solitude',
    desc: '현의 44.1초 초절기교 카덴차에 깊이 매료된 영혼. 고요함 속에서 가장 날카로운 전율을 쫓는 고독한 탐미주의자.',
    accent: '#E7FF00',
    quote: '당신은 차가운 마티니를 쥐고 바이올린의 독주에 영혼을 파는 타입입니다.'
};

export default function App() {
    const [currentStep, setCurrentStep] = useState('flipbook'); // 'flipbook', 'mixer_ending', 'ticket'
    const [userNickname, setUserNickname] = useState("SEAN");
    const [activeEnding, setActiveEnding] = useState(DEFAULT_ENDING);
    const [showAtelierModal, setShowAtelierModal] = useState(false);

    // High Precision Cursor Position & Velocity Tracking
    const [cursorPos, setCursorPos] = useState({ 
        x: 0.5, 
        y: 0.5, 
        rawX: -100, 
        rawY: -100, 
        isHovered: false, 
        isOverTitle: false,
        isOverBuilding: false,
        cursorMode: 'default',
        speed: 0
    });
    const [touchRipples, setTouchRipples] = useState([]);
    const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

    const [stems, setStems] = useState({
        violin: 85,
        electric: 60,
        bass: 75,
        orchestra: 90
    });

    const calculateEnding = () => {
        const { violin, electric, bass, orchestra } = stems;
        let ending = { ...DEFAULT_ENDING };

        if (electric > violin && electric > bass) {
            ending = {
                id: 'rebel',
                title: 'THE ELECTRIC REBEL',
                subtitle: 'Velvet Distortion & Sheffield Grit',
                desc: '규칙을 파괴하는 일렉트릭 디스토션과 로우(Raw)한 인디 록 에너지의 정점. 밤의 무법자.',
                accent: '#FF0055',
                quote: '정제된 클래식의 껍질을 깨부수고 날 것의 기타 앰프 피드백에 열광합니다.'
            };
        } else if (bass > violin && bass > orchestra) {
            ending = {
                id: 'nocturne',
                title: 'THE CHAMPAGNE NOCTURNE',
                subtitle: 'Midnight Salon & Crystal Flute',
                desc: '심야 프라이빗 살롱의 관능적인 베이스 그루브와 샴페인의 기포를 닮은 황홀경.',
                accent: '#00F0FF',
                quote: '모두가 잠든 새벽 3시, 은밀한 사교 살롱의 묵직한 베이스라인을 지배합니다.'
            };
        } else if (orchestra >= 85) {
            ending = {
                id: 'architect',
                title: 'THE SOVEREIGN ARCHITECT',
                subtitle: 'Frankfurt Grand Symphony Tutti',
                desc: '알테 오퍼의 모든 악기가 일제히 폭발하는 그랜드 튜티. 시스템과 소리의 완벽한 수학적 군주.',
                accent: '#C5A059',
                quote: '낮에는 시스템을 통제하고, 밤에는 오케스트라의 모든 주파수를 장악합니다.'
            };
        }

        setActiveEnding(ending);
        setCurrentStep('ticket');
    };

    const handlePointerMove = (e) => {
        const now = Date.now();
        const dt = Math.max(1, now - lastMousePos.current.time);
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.min(dist / dt, 2.5);

        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const isOverTitle = Math.abs(x - 0.5) < 0.28 && Math.abs(y - 0.5) < 0.22;
        const isOverBuilding = Math.abs(x - 0.5) < 0.22 && Math.abs(y - 0.45) < 0.22;
        
        let cursorMode = 'default';
        if (isOverTitle) cursorMode = 'explore';
        if (isOverBuilding) cursorMode = 'building';

        setCursorPos({ x, y, rawX: e.clientX, rawY: e.clientY, isHovered: true, isOverTitle, isOverBuilding, cursorMode, speed });
    };

    const handleTouchMove = (e) => {
        if (e.touches && e.touches[0]) {
            const tx = e.touches[0].clientX;
            const ty = e.touches[0].clientY;
            const x = tx / window.innerWidth;
            const y = ty / window.innerHeight;
            const isOverTitle = Math.abs(x - 0.5) < 0.3 && Math.abs(y - 0.5) < 0.25;
            setCursorPos({ x, y, rawX: tx, rawY: ty, isHovered: true, isOverTitle, isOverBuilding: false, cursorMode: isOverTitle ? 'explore' : 'default', speed: 0 });

            setTouchRipples((prev) => [
                ...prev.slice(-3),
                { id: Date.now() + Math.random(), x: tx, y: ty }
            ]);
        }
    };

    return (
        <div 
            onPointerMove={handlePointerMove}
            onTouchMove={handleTouchMove}
            className="relative min-h-screen bg-[#050507] text-[#ECEBE4] font-sans antialiased selection:bg-[#E7FF00] selection:text-black overflow-x-hidden"
        >
            {/* 1. Awwwards Magnetic Difference Jelly Lens */}
            <div className="hidden md:block pointer-events-none fixed inset-0 z-50 mix-blend-difference">
                <motion.div
                    animate={{
                        x: cursorPos.rawX - 3,
                        y: cursorPos.rawY - 3,
                        opacity: cursorPos.isHovered ? 1 : 0
                    }}
                    transition={{ type: "spring", damping: 45, stiffness: 750, mass: 0.05 }}
                    className="w-1.5 h-1.5 rounded-full bg-white fixed top-0 left-0"
                />

                <motion.div
                    animate={{
                        x: cursorPos.rawX - (cursorPos.cursorMode === 'explore' || cursorPos.cursorMode === 'building' ? 36 : (18 + cursorPos.speed * 4)),
                        y: cursorPos.rawY - (cursorPos.cursorMode === 'explore' || cursorPos.cursorMode === 'building' ? 36 : 18),
                        width: cursorPos.cursorMode === 'explore' || cursorPos.cursorMode === 'building' ? 72 : (36 + cursorPos.speed * 8),
                        height: cursorPos.cursorMode === 'explore' || cursorPos.cursorMode === 'building' ? 72 : 36,
                        borderRadius: '9999px',
                        scale: cursorPos.isHovered ? 1 : 0,
                        opacity: cursorPos.isHovered ? 0.95 : 0
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 260, mass: 0.3 }}
                    className="fixed top-0 left-0 border border-white bg-white/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                >
                    <AnimatePresence>
                        {cursorPos.cursorMode === 'explore' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="font-mono text-[8px] font-black tracking-widest uppercase text-white"
                            >
                                EXPLORE
                            </motion.span>
                        )}
                        {cursorPos.cursorMode === 'building' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="font-mono text-[8px] font-black tracking-widest uppercase text-white text-center leading-tight"
                            >
                                ATELIER
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* 2. Mobile Touch Pulse */}
            <div className="md:hidden pointer-events-none fixed inset-0 z-40 overflow-hidden">
                {touchRipples.map((r) => (
                    <motion.div
                        key={r.id}
                        initial={{ opacity: 0.8, scale: 0.3 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ left: r.x - 14, top: r.y - 14 }}
                        className="absolute w-7 h-7 rounded-full border border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                    />
                ))}
            </div>

            {/* 3. Ultra-Chic Single Editorial Brand Header */}
            <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E7FF00] animate-pulse"></span>
                    <span className="font-mono font-bold text-xs sm:text-sm tracking-[0.25em] text-white/90 lowercase hover:text-white transition-colors">
                        @just.sean.flows
                    </span>
                </div>

                <div className="pointer-events-auto">
                    <button
                        onClick={() => setCurrentStep(currentStep === 'flipbook' ? 'mixer_ending' : 'flipbook')}
                        className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#E7FF00] hover:underline transition-all"
                    >
                        {currentStep === 'flipbook' ? 'STEM MIXER →' : '← WALK OPERA'}
                    </button>
                </div>
            </header>

            <main>
                {currentStep === 'flipbook' && (
                    <FlipbookWalkingEngine 
                        cursorPos={cursorPos}
                        onEnterMixer={() => setCurrentStep('mixer_ending')} 
                        onOpenAtelier={() => setShowAtelierModal(true)}
                    />
                )}

                {currentStep === 'mixer_ending' && (
                    <StemMixerEndingStage
                        userNickname={userNickname}
                        setUserNickname={setUserNickname}
                        stems={stems}
                        setStems={setStems}
                        onGenerateTicket={calculateEnding}
                    />
                )}

                {currentStep === 'ticket' && (
                    <InstagramStoryTicketModal
                        userNickname={userNickname || "SEAN"}
                        ending={activeEnding || DEFAULT_ENDING}
                        stems={stems}
                        onBack={() => setCurrentStep('mixer_ending')}
                    />
                )}
            </main>

            {/* Frankfurt Sound Atelier & Corporation Intel Modal */}
            <AnimatePresence>
                {showAtelierModal && (
                    <FrankfurtAtelierModal onClose={() => setShowAtelierModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ==============================================================================
// 1. FLIPBOOK ENGINE WITH DIRECT IN-PICTURE BUILDING CLICK ZONE (No Text Boxes)
// ==============================================================================
function FlipbookWalkingEngine({ cursorPos, onEnterMixer, onOpenAtelier }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isHeadBobbing, setIsHeadBobbing] = useState(false);
    
    // Initial Preloader State
    const [isInitialBuffering, setIsInitialBuffering] = useState(true);
    const [simulatedVolume, setSimulatedVolume] = useState(12);
    const [isLocked30Glitter, setIsLocked30Glitter] = useState(false);
    const [showSwipeCue, setShowSwipeCue] = useState(true);

    const audioCtxRef = useRef(null);
    const bassRef = useRef(null);
    const guitarRef = useRef(null);
    const drumsRef = useRef(null);
    const percRef = useRef(null);
    const synthRef = useRef(null);
    const vocalRef = useRef(null);

    const lastStepTime = useRef(0);
    const isLeftFoot = useRef(true);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    const progressRef = useRef(0);
    const isAudioStarted = useRef(false);

    // True Combo Energy Reservoir (0 ~ 100)
    const currentEnergy = useRef(0);
    const lastEnergyPumpTime = useRef(Date.now());

    // Robust Mobile Audio Unlocker for all 6 stems
    const unlockAllStems = () => {
        const audioRefs = [bassRef, guitarRef, drumsRef, percRef, synthRef, vocalRef];

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
                if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
            }
        } catch (e) {}

        const masterTime = (bassRef.current && bassRef.current.currentTime) ? bassRef.current.currentTime : 0;

        audioRefs.forEach((r) => {
            if (r.current) {
                r.current.muted = false;
                if (Math.abs(r.current.currentTime - masterTime) > 0.06) {
                    r.current.currentTime = masterTime;
                }
                const p = r.current.play();
                if (p !== undefined) {
                    p.then(() => {
                        isAudioStarted.current = true;
                    }).catch(() => {});
                }
            }
        });
    };

    // Auto-sync intervals for all stems
    useEffect(() => {
        const syncInterval = setInterval(() => {
            if (bassRef.current && isAudioStarted.current) {
                const masterTime = bassRef.current.currentTime;
                [guitarRef, drumsRef, percRef, synthRef, vocalRef].forEach((r) => {
                    if (r.current) {
                        const diff = Math.abs(r.current.currentTime - masterTime);
                        if (diff > 0.05) {
                            r.current.currentTime = masterTime;
                        }
                    }
                });
            }
        }, 200);

        return () => clearInterval(syncInterval);
    }, []);

    // 5X HARDER Dynamic Volume Engine with Fast Decay
    useEffect(() => {
        const volumeEngineInterval = setInterval(() => {
            const now = Date.now();
            const timeSincePump = now - lastEnergyPumpTime.current;

            if (timeSincePump > 100) {
                currentEnergy.current = Math.max(0, currentEnergy.current - 4.5);
            }

            const energy = currentEnergy.current;

            let targetBass = 0.50;
            let targetGuitar = 0.0;
            let targetOtherInst = 0.0;
            let targetVocal = 0.0;

            if (energy >= 88) {
                targetBass = 1.0;
                targetGuitar = 1.0;
                targetOtherInst = 1.0;
                targetVocal = 0.95;
            } else if (energy >= 55) {
                targetBass = 0.90;
                targetGuitar = 0.90;
                targetOtherInst = 0.85;
                targetVocal = 0.0;
            } else if (energy >= 20) {
                targetBass = 0.75;
                targetGuitar = 0.70;
                targetOtherInst = 0.0;
                targetVocal = 0.0;
            } else {
                targetBass = 0.50;
                targetGuitar = 0.0;
                targetOtherInst = 0.0;
                targetVocal = 0.0;
            }

            if (bassRef.current) bassRef.current.volume = targetBass;
            if (guitarRef.current) guitarRef.current.volume = targetGuitar;
            if (drumsRef.current) drumsRef.current.volume = targetOtherInst;
            if (percRef.current) percRef.current.volume = targetOtherInst;
            if (synthRef.current) synthRef.current.volume = targetOtherInst;
            if (vocalRef.current) vocalRef.current.volume = targetVocal;

        }, 50);

        return () => clearInterval(volumeEngineInterval);
    }, []);

    // Initial Buffering Sequence
    useEffect(() => {
        const t1 = setTimeout(() => setSimulatedVolume(36), 300);
        const t2 = setTimeout(() => setSimulatedVolume(16), 650);
        const t3 = setTimeout(() => setSimulatedVolume(42), 1000);
        
        const t4 = setTimeout(() => {
            setSimulatedVolume(30);
            setIsLocked30Glitter(true);
        }, 1300);

        const t5 = setTimeout(() => {
            setIsInitialBuffering(false);
            unlockAllStems();
        }, 2800);

        const t6 = setTimeout(() => {
            if (!isAudioStarted.current) unlockAllStems();
        }, 3800);

        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
            clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowSwipeCue(false), 6500);
        return () => clearTimeout(timer);
    }, []);

    const playStereoFootstep = () => {
        const now = Date.now();
        if (now - lastStepTime.current < 260) return;
        lastStepTime.current = now;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const isLeft = isLeftFoot.current;
            isLeftFoot.current = !isLeft;

            const bufferSize = Math.floor(ctx.sampleRate * 0.08);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = isLeft ? 520 : 580;

            const panner = (typeof ctx.createStereoPanner === 'function') ? ctx.createStereoPanner() : null;
            if (panner) {
                panner.pan.setValueAtTime(isLeft ? -0.38 : 0.38, ctx.currentTime);
            }

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.28, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.075);

            noise.connect(filter);
            if (panner) {
                filter.connect(panner);
                panner.connect(gain);
            } else {
                filter.connect(gain);
            }
            gain.connect(ctx.destination);
            noise.start();
        } catch (e) {}
    };

    // Autopilot timeline
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                const next = Math.min(100, prev + 0.16);
                progressRef.current = next;
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Active Gesture Velocity Handlers
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
            setShowSwipeCue(false);
            if (!isAudioStarted.current) unlockAllStems();

            const rawDelta = Math.abs(e.deltaY);
            const energyAdd = Math.min(rawDelta * 0.08, 12);
            currentEnergy.current = Math.min(100, currentEnergy.current + energyAdd);
            lastEnergyPumpTime.current = Date.now();

            const clampedDelta = Math.min(rawDelta * 0.0028, 1.2);
            setProgress((prev) => {
                const next = Math.min(100, prev + clampedDelta);
                progressRef.current = next;
                return next;
            });

            playStereoFootstep();
            setIsHeadBobbing(true);
            setTimeout(() => setIsHeadBobbing(false), 180);
        };

        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                touchStartY.current = e.touches[0].clientY;
                touchStartTime.current = Date.now();
                if (!isAudioStarted.current) unlockAllStems();
            }
        };

        const handleTouchMove = (e) => {
            if (!e.touches || !e.touches[0]) return;
            setShowSwipeCue(false);
            if (!isAudioStarted.current) unlockAllStems();

            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY.current - currentY;
            const now = Date.now();
            const timeDiff = Math.max(16, now - touchStartTime.current);

            if (deltaY > 0) {
                const velocity = deltaY / timeDiff;
                if (velocity > 0.4) {
                    const energyAdd = Math.min(velocity * 12, 16);
                    currentEnergy.current = Math.min(100, currentEnergy.current + energyAdd);
                    lastEnergyPumpTime.current = now;
                }
            }

            touchStartY.current = currentY;
            touchStartTime.current = now;

            const rawDelta = Math.max(0, deltaY * 0.013);
            const clampedDelta = Math.min(rawDelta, 1.1);
            setProgress((prev) => {
                const next = Math.min(100, prev + clampedDelta);
                progressRef.current = next;
                return next;
            });

            playStereoFootstep();
            setIsHeadBobbing(true);
            setTimeout(() => setIsHeadBobbing(false), 180);
        };

        const handleTouchEnd = () => {
            if (!isAudioStarted.current) unlockAllStems();
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    const currentFrame = FRAMES[activeFrameIdx] || FRAMES[0];
    const isAtelierOptionVisible = activeFrameIdx === 2 || activeFrameIdx === 3;

    const tiltX = (cursorPos.x - 0.5) * -22;
    const tiltY = (cursorPos.y - 0.5) * 16;

    const titleTopChars = currentFrame.titleTop.split("");
    const titleMainChars = currentFrame.titleMain.split("");

    return (
        <div 
            onClick={() => { if (!isAudioStarted.current) unlockAllStems(); }}
            onTouchStart={() => { if (!isAudioStarted.current) unlockAllStems(); }}
            className="fixed inset-0 w-screen h-screen bg-[#050507] overflow-hidden select-none"
        >
            {/* 6 Synchronized Multi-Stem Audio Elements with Encoded Mobile URIs */}
            <audio ref={bassRef} src={STEM_SRCS.bass} loop playsInline preload="auto" />
            <audio ref={guitarRef} src={STEM_SRCS.guitar} loop playsInline preload="auto" />
            <audio ref={drumsRef} src={STEM_SRCS.drums} loop playsInline preload="auto" />
            <audio ref={percRef} src={STEM_SRCS.perc} loop playsInline preload="auto" />
            <audio ref={synthRef} src={STEM_SRCS.synth} loop playsInline preload="auto" />
            <audio ref={vocalRef} src={STEM_SRCS.vocal} loop playsInline preload="auto" />

            {/* 1. 100vh Fullscreen 7-Frame Visual Stack with Direct In-Picture Building Highlight */}
            <div 
                className="relative w-full h-full transition-all duration-700"
                style={{
                    filter: isInitialBuffering ? 'blur(22px) brightness(35%) saturate(50%)' : 'none'
                }}
            >
                {FRAMES.map((f, idx) => {
                    const isTargetBuildingFrame = (idx === 2 || idx === 3);
                    return (
                        <motion.div
                            key={f.id}
                            initial={false}
                            animate={{
                                opacity: activeFrameIdx === idx ? 1 : 0,
                                scale: activeFrameIdx === idx ? (isHeadBobbing ? 1.025 : 1.0) : 1.06,
                                y: activeFrameIdx === idx ? (isHeadBobbing ? -6 : 0) : 0,
                                filter: isTargetBuildingFrame && activeFrameIdx === idx
                                    ? 'contrast(115%) brightness(105%)'
                                    : 'none'
                            }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img
                                src={f.src}
                                alt={f.titleMain}
                                className={`w-full h-full object-cover transition-transform duration-700 ${
                                    isTargetBuildingFrame && activeFrameIdx === idx ? 'scale-105' : 'scale-100'
                                }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60" />
                        </motion.div>
                    );
                })}

                {/* 2. DIRECT IN-PICTURE BUILDING CLICK ZONE & ORGANIC CONTOUR (Frames 2 & 3 - Zero Text Boxes) */}
                <AnimatePresence>
                    {isAtelierOptionVisible && !isInitialBuffering && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
                        >
                            {/* The Actual In-Picture Clickable Building Zone */}
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenAtelier();
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="pointer-events-auto relative w-[280px] sm:w-[420px] h-[260px] sm:h-[360px] -mt-8 sm:-mt-12 rounded-3xl cursor-pointer group outline-none"
                            >
                                {/* Organic Neon Architectural Contour Highlight */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-[#00F0FF]/40 group-hover:border-[#00F0FF] transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.25)] group-hover:shadow-[0_0_50px_rgba(0,240,255,0.6)]" />

                                {/* Glowing Light Sweep within Building Window Frame */}
                                <div className="absolute inset-0 rounded-3xl bg-[#00F0FF]/[0.03] group-hover:bg-[#00F0FF]/[0.08] transition-colors duration-300" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Spatial HUD & Real Letter-by-Letter Assembled Typography */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-20 pb-8 px-4 sm:px-12 text-center z-20">
                    <div className="h-6" />

                    {/* True 3D Letter-by-Letter Assembled Kinetic Typography */}
                    <div className="max-w-4xl mx-auto my-auto px-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`assembled-title-${activeFrameIdx}`}
                                animate={{ 
                                    rotateY: tiltX,
                                    rotateX: tiltY,
                                    scale: cursorPos.isOverTitle ? 1.05 : 1.0
                                }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
                                className="flex flex-col items-center"
                            >
                                <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white/90 uppercase leading-none mb-2 overflow-hidden flex justify-center flex-wrap">
                                    {titleTopChars.map((char, i) => (
                                        <motion.span
                                            key={`top-${i}-${char}`}
                                            initial={{ opacity: 0, y: 35, rotateX: 60, z: -80 }}
                                            animate={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                                            transition={{ 
                                                duration: 0.45, 
                                                delay: i * 0.025, 
                                                ease: [0.215, 0.61, 0.355, 1.0] 
                                            }}
                                            className="inline-block"
                                        >
                                            {char === " " ? " " : char}
                                        </motion.span>
                                    ))}
                                </h2>

                                <h1 
                                    className="font-sans text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase leading-none overflow-hidden flex justify-center flex-wrap"
                                    style={{
                                        textShadow: cursorPos.isHovered 
                                            ? `${tiltX * 1.8}px ${tiltY * 1.8}px 35px rgba(231,255,0,0.4)` 
                                            : '0 0 30px rgba(0,0,0,0.9)'
                                    }}
                                >
                                    {titleMainChars.map((char, i) => (
                                        <motion.span
                                            key={`main-${i}-${char}`}
                                            initial={{ opacity: 0, y: 45, rotateX: -70, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                                            transition={{ 
                                                duration: 0.5, 
                                                delay: 0.1 + i * 0.03, 
                                                type: "spring",
                                                damping: 15,
                                                stiffness: 150
                                            }}
                                            className="inline-block"
                                        >
                                            {char === " " ? " " : char}
                                        </motion.span>
                                    ))}
                                </h1>

                                <motion.p 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 0.7, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.4 }}
                                    className="mt-4 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-white/70"
                                >
                                    {currentFrame.sub}
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Progress Track Only (No Artificial Button Boxes) */}
                    <div className="pointer-events-auto flex flex-col items-center gap-3">
                        {progress >= 88 && (
                            <button
                                onClick={onEnterMixer}
                                className="w-full max-w-xs py-4 rounded-full bg-[#E7FF00] text-black font-mono text-xs font-black tracking-[0.25em] uppercase hover:scale-105 transition-all shadow-[0_0_50px_rgba(231,255,0,0.6)] flex items-center justify-center gap-2 animate-pulse"
                            >
                                <span>ENTER STEM MIXER</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        <div className="w-48 sm:w-80 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#E7FF00] transition-all duration-75"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. LAYER ABOVE BLUR: 30% SOFTENED SUBTLE BREATHING SHIMMER */}
            <AnimatePresence>
                {isInitialBuffering && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.6 } }}
                        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-end pr-5 sm:pr-10"
                    >
                        <motion.div
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ 
                                x: 0, 
                                opacity: 1,
                                scale: isLocked30Glitter ? [1.0, 1.04, 1.0] : 1.0
                            }}
                            exit={{ x: 40, opacity: 0 }}
                            transition={isLocked30Glitter ? { repeat: Infinity, duration: 1.6, ease: "easeInOut" } : { duration: 0.4 }}
                            className={`p-3.5 rounded-3xl bg-black/90 backdrop-blur-2xl border transition-all duration-500 shadow-2xl flex flex-col items-center gap-3 ${
                                isLocked30Glitter 
                                    ? 'border-[#E7FF00]/70 shadow-[0_0_22px_rgba(231,255,0,0.35)]' 
                                    : 'border-white/20'
                            }`}
                        >
                            <Volume2 className={`w-4 h-4 transition-colors ${isLocked30Glitter ? 'text-[#E7FF00]' : 'text-white/70'}`} />
                            <div className="w-2 h-28 bg-white/20 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
                                <motion.div
                                    className="w-full bg-[#E7FF00] rounded-full transition-all duration-200"
                                    style={{ height: `${simulatedVolume}%` }}
                                />
                            </div>
                            <motion.span 
                                animate={isLocked30Glitter ? { opacity: [0.8, 1, 0.8], scale: [0.98, 1.04, 0.98] } : {}}
                                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                                className={`font-mono text-[10px] font-bold tracking-wider transition-all duration-300 ${
                                    isLocked30Glitter 
                                        ? 'text-[#E7FF00] drop-shadow-[0_0_8px_rgba(231,255,0,0.5)]' 
                                        : 'text-white'
                                }`}
                            >
                                {simulatedVolume}%
                            </motion.span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. ZERO-TEXT VISUAL UPWARD ENERGY CUE */}
            <AnimatePresence>
                {showSwipeCue && !isInitialBuffering && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.6 } }}
                        className="fixed inset-x-0 bottom-24 pointer-events-none z-30 flex flex-col items-center justify-center"
                    >
                        <div className="w-7 h-14 rounded-full border border-white/20 bg-black/60 backdrop-blur-xl p-1 flex flex-col items-center justify-end overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                            <motion.div
                                animate={{ y: [0, -32, 0], opacity: [0.2, 1, 0], scale: [0.8, 1.1, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: [0.45, 0, 0.55, 1] }}
                                className="w-3.5 h-3.5 rounded-full bg-gradient-to-t from-[#E7FF00]/40 to-[#E7FF00] shadow-[0_0_12px_#E7FF00]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ==============================================================================
// 2. FRANKFURT SOUND ATELIER & GUILD INTEL MODAL
// ==============================================================================
function FrankfurtAtelierModal({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl p-4 sm:p-8 flex items-center justify-center overflow-y-auto"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-2xl bg-[#09090D] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="inline-flex items-center gap-2 font-mono text-[10px] text-[#00F0FF] tracking-widest uppercase mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>CORPORATE INTEL &amp; SOUND ATELIER</span>
                </div>

                <h2 className="font-sans text-2xl sm:text-4xl font-black text-white uppercase mb-2">
                    JUST SEAN FLOWS // GUILD ATELIER
                </h2>
                <p className="font-mono text-xs text-white/60 mb-6">
                    독일 프랑크푸르트 암 마인(Frankfurt am Main)에 설립 진행 중인 1인 하이브리드 사운드 프로덕션 길드 본부입니다.
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
                            1인 하이브리드 길드 법인 (UG / GmbH in Formation)
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <span className="text-[#00F0FF] font-bold block mb-1">HEADQUARTERS</span>
                        <p className="text-white/80 text-[11px]">
                            Frankfurt am Main, Hessen, Germany
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 sm:col-span-2">
                        <span className="text-white font-bold block mb-1">CORE MISSION</span>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                            클래식 오케스트라와 인디 록, 첨단 AI 오디오 DSP를 융합하는 독자적 사운드스케이프 제작 및 글로벌 아티스트 라이선싱.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 rounded-full bg-[#00F0FF] text-black font-mono text-xs font-black tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                >
                    RESUME WALKING TOWARDS CONCERT PALACE →
                </button>
            </motion.div>
        </motion.div>
    );
}

// ==============================================================================
// 3. STEM MIXER & MULTI-ENDING CONSOLE
// ==============================================================================
function StemMixerEndingStage({ userNickname, setUserNickname, stems, setStems, onGenerateTicket }) {
    return (
        <div className="pt-20 pb-20 px-4 sm:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-[#E7FF00] tracking-widest uppercase mb-2">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>CURATOR STEM MIXER</span>
                </div>
                <h2 className="font-sans text-3xl sm:text-5xl font-black text-white uppercase">
                    CRAFT YOUR HARMONY
                </h2>
                <p className="font-mono text-xs text-white/60 mt-2 max-w-md mx-auto">
                    4가지 음원 스템을 조절하여 당신만의 비밀 엔딩을 완성하세요.
                </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="font-mono text-xs text-center sm:text-left">
                    <span className="text-[#E7FF00] font-bold block mb-0.5">ARTIST NICKNAME</span>
                    <span className="text-white/50 text-[10px]">티켓에 각인될 서명입니다.</span>
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
                    { id: 'violin', label: '01. SOLO VIOLIN', desc: '파가니니 솔로 카덴차', color: '#E7FF00' },
                    { id: 'electric', label: '02. ELECTRIC DISTORTION', desc: '인디 록 앰프 피드백', color: '#FF0055' },
                    { id: 'bass', label: '03. NOIR BASS', desc: '02:00 AM 심야 살롱 펄스', color: '#00F0FF' },
                    { id: 'orchestra', label: '04. GRAND SYMPHONY', desc: '전단 오케스트라 튜티', color: '#C5A059' },
                ].map((s) => (
                    <div key={s.id} className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/[0.02] flex flex-col justify-between">
                        <div className="flex justify-between items-center font-mono text-xs mb-2">
                            <span className="font-bold text-white text-[11px]">{s.label}</span>
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

// ==============================================================================
// 4. INSTAGRAM STORY 9:16 VIP TICKET MODAL & CANVAS GENERATOR
// ==============================================================================
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
        ctx.fillText('@just.sean.flows', W / 2, 1720);

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
                인스타그램 스토리에 바로 공유할 수 있는 9:16 고화질 패스입니다.
            </p>

            <div className="w-full rounded-3xl border border-white/20 bg-black/90 p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden mb-6">
                <div className="flex justify-between items-center font-mono text-[9px] text-[#E7FF00] mb-3 pb-2 border-b border-white/10">
                    <span>VIP PASS · 2026</span>
                    <span>@just.sean.flows</span>
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
                            <span className="font-mono text-[9px] text-white font-bold block">SECRET YOUTUBE VAULT</span>
                            <span className="font-mono text-[7px] text-white/40">CLICK TO UNLOCK UNLISTED VIDEO</span>
                        </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-[#E7FF00]" />
                </a>

                <div className="font-mono text-[8px] text-white/40">
                    FRANKFURT AM MAIN · @just.sean.flows
                </div>
            </div>

            <div className="w-full flex flex-col gap-2.5">
                <button
                    onClick={downloadTicket}
                    className="w-full py-3.5 rounded-full bg-[#E7FF00] text-black font-mono text-xs font-black tracking-wider uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(231,255,0,0.4)] flex items-center justify-center gap-2"
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
                className="mt-6 font-mono text-[11px] text-white/40 hover:text-white transition-colors"
            >
                ← RE-MIX STEMS &amp; TRY ANOTHER
            </button>
        </div>
    );
}
