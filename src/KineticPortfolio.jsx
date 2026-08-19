import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Volume2, VolumeX, Sliders, Play, Pause, 
    Download, Music, Check, ThumbsUp, ArrowRight, 
    Compass, ExternalLink, QrCode, ChevronDown, RotateCcw, Zap, Flame, Mic, Building2, X, Globe, ShieldCheck
} from 'lucide-react';

const SECRET_YOUTUBE_URL = "https://www.youtube.com/watch?v=RUoWgJDZ0M8&t=1330s";
const MR_AUDIO_SRC = "/assets/manual_upload/A twelve-alibi_MR_master.wav";
const VOCAL_AUDIO_SRC = "/assets/manual_upload/A Twelve-minute Alibi/0 Lead Vocals.mp3";
const ATELIER_IMG = "/assets/frankfurt_sound_atelier.jpg";
const BLUEPRINT_IMG = "/assets/atelier_blueprint_night.jpg";

const FRAMES = [
    { id: 0, src: "/assets/walk_01.jpg", tag: "01/07", label: "MIDNIGHT PLAZA", sub: "Distant View Across the Square" },
    { id: 1, src: "/assets/walk_02.jpg", tag: "02/07", label: "APPROACHING", sub: "Crossing the Wet Cobblestones" },
    { id: 2, src: "/assets/walk_03.jpg", tag: "03/07", label: "MIDWAY PLAZA", sub: "Monumental Facade Glowing" },
    { id: 3, src: "/assets/walk_04.jpg", tag: "04/07", label: "FOOT OF STAIRS", sub: "Looking up at Stone Arches" },
    { id: 4, src: "/assets/walk_05.jpg", tag: "05/07", label: "ASCENDING", sub: "Climbing to Central Portal" },
    { id: 5, src: "/assets/walk_06.jpg", tag: "06/07", label: "THE PORTAL", sub: "Standing at Massive Brass Handles" },
    { id: 6, src: "/assets/walk_07.jpg", tag: "07/07", label: "DOORS OPEN", sub: "Golden Opera Hall Revealed" }
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

    return (
        <div className="relative min-h-screen bg-[#050507] text-[#ECEBE4] font-sans antialiased selection:bg-[#E7FF00] selection:text-black overflow-x-hidden">
            {/* Interactive Particle Trail Layer */}
            <NeonParticleTrail />

            {/* Ultra-Clean Floating Dynamic Island Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl">
                    <span className="w-2 h-2 rounded-full bg-[#E7FF00] animate-pulse"></span>
                    <span className="font-mono font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white">
                        JUST.SEAN.FLOWS
                    </span>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                    <button
                        onClick={() => setCurrentStep(currentStep === 'flipbook' ? 'mixer_ending' : 'flipbook')}
                        className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#E7FF00] hover:bg-[#E7FF00] hover:text-black transition-all"
                    >
                        {currentStep === 'flipbook' ? 'STEM MIXER →' : '← WALK OPERA'}
                    </button>
                </div>
            </header>

            <main>
                {currentStep === 'flipbook' && (
                    <FlipbookWalkingEngine 
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
// 1. NEON FLUID PARTICLE TRAIL (Touch & Scroll Gesture Trail)
// ==============================================================================
function NeonParticleTrail() {
    const canvasRef = useRef(null);
    const pointsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const addPoint = (x, y) => {
            pointsRef.current.push({
                x, y,
                age: 0,
                maxAge: 32,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.3 ? '#E7FF00' : '#00F0FF'
            });
        };

        const handlePointerMove = (e) => {
            addPoint(e.clientX, e.clientY);
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                addPoint(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('touchmove', handleTouchMove);

        let animId;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const points = pointsRef.current;

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                p.age += 1;
                const alpha = Math.max(0, 1 - p.age / p.maxAge);
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha * 0.7;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();

                if (i > 0 && points[i - 1]) {
                    const prev = points[i - 1];
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 2.5 * alpha;
                    ctx.stroke();
                }
            }

            pointsRef.current = points.filter(p => p.age < p.maxAge);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            animId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-30"
        />
    );
}

// ==============================================================================
// 2. FLIPBOOK ENGINE WITH ATELIER INTEL OPTION & 5-SEC CHIC GESTURE TUTORIAL
// ==============================================================================
function FlipbookWalkingEngine({ onEnterMixer, onOpenAtelier }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isHeadBobbing, setIsHeadBobbing] = useState(false);
    const [vocalVolumePercent, setVocalVolumePercent] = useState(0);
    const [showGestureTutorial, setShowGestureTutorial] = useState(true);

    const audioCtxRef = useRef(null);
    const bgmRef = useRef(null);
    const vocalRef = useRef(null);
    const lastStepTime = useRef(0);
    const isLeftFoot = useRef(true);
    const touchStartY = useRef(0);

    const progressRef = useRef(0);
    const scrollCount = useRef(0);
    const isBgmStarted = useRef(false);
    const lastHardScrollTime = useRef(0);

    // 5-Second Chic Minimalist Gesture Tutorial
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowGestureTutorial(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const startMRPlayback = () => {
        if (isBgmStarted.current || !bgmRef.current) return;
        isBgmStarted.current = true;
        bgmRef.current.volume = 0.65;
        bgmRef.current.play().catch(() => {});

        if (vocalRef.current) {
            vocalRef.current.volume = 0;
            vocalRef.current.currentTime = bgmRef.current.currentTime;
            vocalRef.current.play().catch(() => {});
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            startMRPlayback();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const decayInterval = setInterval(() => {
            const timeSinceHardScroll = Date.now() - lastHardScrollTime.current;
            if (vocalRef.current) {
                if (timeSinceHardScroll < 700) {
                    vocalRef.current.volume = 0.95;
                    setVocalVolumePercent(95);
                } else if (timeSinceHardScroll < 1800) {
                    const decay = Math.max(0, 0.95 - (timeSinceHardScroll - 700) / 1100);
                    vocalRef.current.volume = decay;
                    setVocalVolumePercent(Math.round(decay * 100));
                } else {
                    vocalRef.current.volume = 0;
                    setVocalVolumePercent(0);
                }
            }
        }, 60);

        return () => clearInterval(decayInterval);
    }, []);

    const playStereoFootstep = () => {
        const now = Date.now();
        if (now - lastStepTime.current < 260) return;
        lastStepTime.current = now;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioCtx();
            }
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

    // Active Scroll
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
            setShowGestureTutorial(false);
            scrollCount.current += 1;
            if (scrollCount.current >= 10) startMRPlayback();

            const rawDelta = Math.abs(e.deltaY);
            const clampedDelta = Math.min(rawDelta * 0.0028, 1.2);

            if (rawDelta > 15) {
                lastHardScrollTime.current = Date.now();
                startMRPlayback();
            }

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
            }
        };

        const handleTouchMove = (e) => {
            if (!e.touches || !e.touches[0]) return;
            setShowGestureTutorial(false);
            scrollCount.current += 1;
            if (scrollCount.current >= 10) startMRPlayback();

            const currentY = e.touches[0].clientY;
            const rawDelta = Math.max(0, (touchStartY.current - currentY) * 0.013);
            touchStartY.current = currentY;
            const clampedDelta = Math.min(rawDelta, 1.1);

            if (rawDelta > 0.15) {
                lastHardScrollTime.current = Date.now();
                startMRPlayback();
            }

            setProgress((prev) => {
                const next = Math.min(100, prev + clampedDelta);
                progressRef.current = next;
                return next;
            });
            playStereoFootstep();
            setIsHeadBobbing(true);
            setTimeout(() => setIsHeadBobbing(false), 180);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    const currentFrame = FRAMES[activeFrameIdx] || FRAMES[0];
    const isAtelierOptionVisible = activeFrameIdx === 2 || activeFrameIdx === 3; // Frames 3 & 4

    return (
        <div className="fixed inset-0 w-screen h-screen bg-[#050507] overflow-hidden select-none">
            <audio ref={bgmRef} src={MR_AUDIO_SRC} loop preload="metadata" />
            <audio ref={vocalRef} src={VOCAL_AUDIO_SRC} loop preload="metadata" />

            {/* 1. 100vh Fullscreen 7-Frame Visual Stack */}
            <div className="relative w-full h-full">
                {FRAMES.map((f, idx) => (
                    <motion.div
                        key={f.id}
                        initial={false}
                        animate={{
                            opacity: activeFrameIdx === idx ? 1 : 0,
                            scale: activeFrameIdx === idx ? (isHeadBobbing ? 1.025 : 1.0) : 1.06,
                            y: activeFrameIdx === idx ? (isHeadBobbing ? -6 : 0) : 0,
                            filter: vocalVolumePercent > 50 ? 'contrast(115%) brightness(108%)' : 'none'
                        }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src={f.src}
                            alt={f.label}
                            className="w-full h-full object-cover brightness-95 contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60" />
                    </motion.div>
                ))}
            </div>

            {/* 2. 5-Second Chic Minimalist Gesture Tutorial Overlay */}
            <AnimatePresence>
                {showGestureTutorial && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
                        className="absolute inset-x-0 bottom-24 pointer-events-none z-30 flex flex-col items-center justify-center gap-2"
                    >
                        <div className="px-5 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-[#E7FF00]/40 flex items-center gap-3 shadow-[0_0_30px_rgba(231,255,0,0.3)]">
                            <div className="w-4 h-7 rounded-full border-2 border-[#E7FF00] p-1 flex justify-center">
                                <motion.div 
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                                    className="w-1.5 h-1.5 rounded-full bg-[#E7FF00]"
                                />
                            </div>
                            <span className="font-mono text-[10px] sm:text-xs font-bold text-[#E7FF00] tracking-widest uppercase">
                                SWIPE UP TO EXPLORE
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Floating Spatial HUD */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-16 pb-8 px-4 sm:px-12 text-center z-20">
                {/* Top Pill & Live Lead Vocal Pulse Tag */}
                <div className="flex flex-col items-center gap-2 mx-auto">
                    <motion.div 
                        key={`tag-${activeFrameIdx}`}
                        initial={{ opacity: 0, y: -12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#E7FF00]/30 font-mono text-[10px] text-[#E7FF00] tracking-widest"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E7FF00] animate-ping" />
                        <span>{currentFrame.tag} · {currentFrame.label}</span>
                    </motion.div>

                    {vocalVolumePercent > 5 && (
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E7FF00]/20 border border-[#E7FF00] text-[#E7FF00] font-mono text-[9px] font-bold tracking-wider animate-pulse"
                        >
                            <Mic className="w-3 h-3" />
                            <span>VOCAL ENERGY: {vocalVolumePercent}%</span>
                        </motion.div>
                    )}
                </div>

                {/* 3D Kinetic Stagger Headline */}
                <div className="max-w-3xl mx-auto my-auto px-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`title-${activeFrameIdx}`}
                            initial={{ opacity: 0, y: 15, rotateX: 20 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, y: -15, rotateX: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none drop-shadow-2xl">
                                {activeFrameIdx === 6 ? (
                                    <>
                                        THE DOORS <span className="text-[#E7FF00] italic font-light">OPEN</span>
                                    </>
                                ) : (
                                    <>
                                        THE MIDNIGHT <span className="text-[#E7FF00] italic font-light">PALACE</span>
                                    </>
                                )}
                            </h1>
                            <p className="mt-3 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/70">
                                {currentFrame.sub}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Interactive Area & Atelier Option Button */}
                <div className="pointer-events-auto flex flex-col items-center gap-3">
                    {/* Interactive 360 Atelier Option Button (Frames 3 & 4 Only) */}
                    <AnimatePresence>
                        {isAtelierOptionVisible && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 10 }}
                                onClick={onOpenAtelier}
                                className="px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center gap-2"
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>360° ATELIER INTEL // 프랑크푸르트 사운드 아틀리에 둘러보기</span>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {progress >= 88 ? (
                        <button
                            onClick={onEnterMixer}
                            className="w-full max-w-xs py-4 rounded-full bg-[#E7FF00] text-black font-mono text-xs font-black tracking-[0.25em] uppercase hover:scale-105 transition-all shadow-[0_0_50px_rgba(231,255,0,0.6)] flex items-center justify-center gap-2 animate-pulse"
                        >
                            <span>ENTER STEM MIXER</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex flex-col items-center gap-1 font-mono text-[11px] text-white/60 tracking-wider">
                            <span className="animate-bounce">
                                [ 비트에 맞춰 힘차게 스와이프하면 보컬이 울려 퍼집니다 ]
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#E7FF00]" />
                        </div>
                    )}

                    {/* Progress Track */}
                    <div className="w-48 sm:w-80 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#E7FF00] transition-all duration-75"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==============================================================================
// 3. FRANKFURT SOUND ATELIER & GUILD INTEL MODAL (360 Real-World Corporate Intel)
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
// 4. STEM MIXER & MULTI-ENDING CONSOLE
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
// 5. INSTAGRAM STORY 9:16 VIP TICKET MODAL & CANVAS GENERATOR
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
