import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Volume2, VolumeX, Sliders, Play, Pause, 
    Download, Music, Check, ThumbsUp, ArrowRight, 
    Compass, ExternalLink, QrCode, ChevronDown, RotateCcw, Zap, Flame, Mic, Building2, X, Globe, ShieldCheck, Activity
} from 'lucide-react';

const SECRET_YOUTUBE_URL = "https://www.youtube.com/watch?v=RUoWgJDZ0M8&t=1330s";
const ATELIER_IMG = "/assets/frankfurt_sound_atelier.jpg";

// Raw Path & Encoded Fallbacks for 100% Vite/Mobile Compatibility
const BASS_AUDIO_PATH = "/assets/manual_upload/A Twelve-minute Alibi/2 Bass.mp3";

const FRAMES = [
    { id: 0, src: "/assets/optics_style_02_streamline_duplex_1787171876437.jpg", titleTop: "THE REPURPOSED", titleMain: "BAUHAUS LAB", sub: "Curved Glass Ribbon Sound Atelier" },
    { id: 1, src: "/assets/optics_style_03_brick_panoramic_1787171899123.jpg", titleTop: "THE MALT HOUSE", titleMain: "BEIGE BRICK", sub: "Analog Tape & Tube Preamps Studio" },
    { id: 2, src: "/assets/optics_style_04_dockside_curved_1787171920852.jpg", titleTop: "DOCKSIDE", titleMain: "KLANGSTUDIO", sub: "Curved Glass Studio by the Canal Water", hasBuildingTarget: true },
    { id: 3, src: "/assets/optics_style_06_alley_rotunda_1787171966885.jpg", titleTop: "ALLEY BEND", titleMain: "ROTUNDA", sub: "Guitars & Neon Signature Sign", hasBuildingTarget: true },
    { id: 4, src: "/assets/optics_style_08_cantilever_balcony_1787172016436.jpg", titleTop: "CANTILEVER", titleMain: "BALCONY LOFT", sub: "Double Bass & Grand Piano Studio" },
    { id: 5, src: "/assets/optics_style_10_signature_sean_1787172064020.jpg", titleTop: "FLAGSHIP", titleMain: "SEAN FLOWS", sub: "Sign: @JUST.SEAN.FLOWS // ATELIER" },
    { id: 6, src: "/assets/walk_07.jpg", titleTop: "THE DOORS", titleMain: "OPEN", sub: "Golden Acoustic Sanctuary Revealed" }
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
    const [currentStep, setCurrentStep] = useState('flipbook');
    const [userNickname, setUserNickname] = useState("SEAN");
    const [activeEnding, setActiveEnding] = useState(DEFAULT_ENDING);
    const [showAtelierModal, setShowAtelierModal] = useState(false);

    // Cursor Tracking
    const [cursorPos, setCursorPos] = useState({ 
        x: 0.5, y: 0.5, rawX: -100, rawY: -100, isHovered: false, isOverTitle: false, isOverBuilding: false, cursorMode: 'default', speed: 0
    });
    const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

    const [stems, setStems] = useState({ violin: 85, electric: 60, bass: 75, orchestra: 90 });

    const calculateEnding = () => {
        setActiveEnding(DEFAULT_ENDING);
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

    return (
        <div 
            onPointerMove={handlePointerMove}
            className="relative min-h-screen bg-[#050507] text-[#ECEBE4] font-sans antialiased selection:bg-[#E7FF00] selection:text-black overflow-hidden select-none fixed inset-0"
        >
            {/* Header */}
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

            <main className="relative z-10 w-full h-full">
                {currentStep === 'flipbook' && (
                    <FlipbookWalkingEngine 
                        cursorPos={cursorPos}
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
// ISOLATED DIRECT AUDIO TESTER: BASS + FOOTSTEPS ONLY (COMPLEX TIERS COMMENTED OUT)
// ==============================================================================
function FlipbookWalkingEngine({ cursorPos, onEnterMixer, onOpenAtelier }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isHeadBobbing, setIsHeadBobbing] = useState(false);
    
    // Simple Direct Audio Status State
    const [isBassPlaying, setIsBassPlaying] = useState(false);
    const [audioErrorMsg, setAudioErrorMsg] = useState("");
    const [footstepCount, setFootstepCount] = useState(0);

    const audioCtxRef = useRef(null);
    const bassAudioRef = useRef(null);
    const lastStepTime = useRef(0);
    const isLeftFoot = useRef(true);

    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    // DIRECT BASS PLAYBACK TRIGGER FUNCTION
    const playBassAudioDirectly = () => {
        setAudioErrorMsg("");
        
        // 1. Resume Web Audio Context if suspended
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
                if (audioCtxRef.current.state === 'suspended') {
                    audioCtxRef.current.resume();
                }
            }
        } catch (e) {}

        // 2. Play Bass Audio HTML element directly
        if (bassAudioRef.current) {
            bassAudioRef.current.muted = false;
            bassAudioRef.current.volume = 0.80; // Explicit 80% clear bass volume
            
            const p = bassAudioRef.current.play();
            if (p !== undefined) {
                p.then(() => {
                    setIsBassPlaying(true);
                }).catch((err) => {
                    setIsBassPlaying(false);
                    setAudioErrorMsg(err.message || "Autoplay blocked by browser");
                });
            } else {
                setIsBassPlaying(true);
            }
        }
    };

    // DIRECT AUDIBLE FOOTSTEP SYNTHESIZER (Web Audio API)
    const triggerDirectFootstep = () => {
        const now = Date.now();
        if (now - lastStepTime.current < 200) return;
        lastStepTime.current = now;

        setFootstepCount((prev) => prev + 1);

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const isLeft = isLeftFoot.current;
            isLeftFoot.current = !isLeft;

            // Crisp & Audible Punch Gain
            const mainGain = ctx.createGain();
            mainGain.gain.setValueAtTime(0.40, ctx.currentTime);

            // Sub-punch low frequency pulse
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isLeft ? 90 : 105, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.09);

            oscGain.gain.setValueAtTime(0.45, ctx.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

            // Cobblestone Crunch Noise Buffer
            const bufferSize = Math.floor(ctx.sampleRate * 0.07);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = isLeft ? 1300 : 1550;
            noiseFilter.Q.value = 1.8;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

            // Spatial Echo Node (160ms Delay)
            const delayNode = ctx.createDelay();
            delayNode.delayTime.value = 0.16;

            const feedbackGain = ctx.createGain();
            feedbackGain.gain.value = 0.30;

            const panner = (typeof ctx.createStereoPanner === 'function') ? ctx.createStereoPanner() : null;
            if (panner) {
                panner.pan.setValueAtTime(isLeft ? -0.45 : 0.45, ctx.currentTime);
            }

            osc.connect(oscGain);
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);

            oscGain.connect(mainGain);
            noiseGain.connect(mainGain);

            mainGain.connect(delayNode);
            delayNode.connect(feedbackGain);
            feedbackGain.connect(delayNode);

            if (panner) {
                mainGain.connect(panner);
                delayNode.connect(panner);
                panner.connect(ctx.destination);
            } else {
                mainGain.connect(ctx.destination);
                delayNode.connect(ctx.destination);
            }

            osc.start();
            noise.start();
            osc.stop(ctx.currentTime + 0.1);
            noise.stop(ctx.currentTime + 0.1);
        } catch (e) {}
    };

    // Auto-attempt playback on load + register click listeners
    useEffect(() => {
        const handleInteraction = () => {
            playBassAudioDirectly();
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('wheel', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('wheel', handleInteraction);
        };
    }, []);

    // Simple Wheel & Touch Scroll Handler (Triggers Footsteps + Autopilot progress)
    useEffect(() => {
        const handleWheel = (e) => {
            playBassAudioDirectly();
            if (e.deltaY <= 0) return;

            triggerDirectFootstep();
            setIsHeadBobbing(true);
            setTimeout(() => setIsHeadBobbing(false), 160);

            setProgress((prev) => Math.min(100, prev + 1.5));
        };

        const handleTouchStart = (e) => {
            playBassAudioDirectly();
            if (e.touches && e.touches[0]) {
                touchStartY.current = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e) => {
            playBassAudioDirectly();
            if (!e.touches || !e.touches[0]) return;

            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY.current - currentY;

            if (deltaY > 0) {
                triggerDirectFootstep();
                setIsHeadBobbing(true);
                setTimeout(() => setIsHeadBobbing(false), 160);
                setProgress((prev) => Math.min(100, prev + 2.0));
            }

            touchStartY.current = currentY;
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
    const isAtelierOptionVisible = activeFrameIdx === 2 || activeFrameIdx === 3;

    const tiltX = (cursorPos.x - 0.5) * -22;
    const tiltY = (cursorPos.y - 0.5) * 16;
    const titleTopChars = currentFrame.titleTop.split("");
    const titleMainChars = currentFrame.titleMain.split("");

    return (
        <div 
            onClick={playBassAudioDirectly}
            onTouchStart={playBassAudioDirectly}
            className="fixed inset-0 w-screen h-screen bg-[#050507] overflow-hidden select-none"
        >
            {/* DIRECT BASS AUDIO ELEMENT WITH RAW AND ENCODED FALLBACK URIS */}
            <audio 
                ref={bassAudioRef} 
                src={BASS_AUDIO_PATH} 
                loop 
                playsInline 
                preload="auto"
                onPlay={() => setIsBassPlaying(true)}
                onPause={() => setIsBassPlaying(false)}
                onError={(e) => setAudioErrorMsg("Audio File Error: " + (e.message || "Format unsupported"))}
            />

            {/* 1. Fullscreen Visual Stack */}
            <div className="relative w-full h-full">
                {FRAMES.map((f, idx) => (
                    <motion.div
                        key={f.id}
                        initial={false}
                        animate={{
                            opacity: activeFrameIdx === idx ? 1 : 0,
                            scale: activeFrameIdx === idx ? (isHeadBobbing ? 1.025 : 1.0) : 1.06,
                            y: activeFrameIdx === idx ? (isHeadBobbing ? -6 : 0) : 0
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src={f.src}
                            alt={f.titleMain}
                            className="w-full h-full object-cover transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60" />
                    </motion.div>
                ))}

                {/* Direct In-Picture Atelier Click Zone */}
                <AnimatePresence>
                    {isAtelierOptionVisible && (
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
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="pointer-events-auto relative w-[280px] sm:w-[420px] h-[260px] sm:h-[360px] -mt-8 sm:-mt-12 rounded-3xl cursor-pointer group outline-none"
                            >
                                <div className="absolute inset-0 rounded-3xl border-2 border-[#00F0FF]/40 group-hover:border-[#00F0FF] transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.25)] group-hover:shadow-[0_0_50px_rgba(0,240,255,0.6)]" />
                                <div className="absolute inset-0 rounded-3xl bg-[#00F0FF]/[0.03] group-hover:bg-[#00F0FF]/[0.08] transition-colors duration-300" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Spatial HUD & EXPLICIT SOUND TESTER BAR */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-20 pb-8 px-4 sm:px-12 text-center z-20">
                    
                    {/* EXPLICIT BASS AUDIO TEST CONTROL PANEL */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={playBassAudioDirectly}
                            className={`pointer-events-auto inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-mono text-xs font-black tracking-widest uppercase transition-all shadow-2xl ${
                                isBassPlaying 
                                    ? 'bg-[#E7FF00] text-black border border-[#E7FF00] shadow-[0_0_25px_rgba(231,255,0,0.6)]' 
                                    : 'bg-red-600 text-white border border-red-500 animate-pulse'
                            }`}
                        >
                            {isBassPlaying ? (
                                <>
                                    <Volume2 className="w-4 h-4 text-black animate-bounce" />
                                    <span>🔊 BASS AUDIO: PLAYING (80%)</span>
                                </>
                            ) : (
                                <>
                                    <VolumeX className="w-4 h-4 text-white" />
                                    <span>▶ TAP TO PLAY BASS SOUND</span>
                                </>
                            )}
                        </button>

                        {/* Footstep Counter & Status */}
                        <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 font-mono text-[10px] text-white/80">
                            <span>👞 FOOTSTEPS TRIGGERED: <strong className="text-[#E7FF00]">{footstepCount}</strong></span>
                            <span className="w-1 h-3 bg-white/20" />
                            <span>STATUS: {isBassPlaying ? "ACTIVE" : "CLICK SCREEN TO START"}</span>
                        </div>

                        {audioErrorMsg && (
                            <div className="font-mono text-[10px] text-red-400 bg-black/90 px-3 py-1 rounded-full border border-red-500/50">
                                {audioErrorMsg}
                            </div>
                        )}
                    </div>

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
                                            transition={{ duration: 0.45, delay: i * 0.025 }}
                                            className="inline-block"
                                        >
                                            {char === " " ? " " : char}
                                        </motion.span>
                                    ))}
                                </h2>

                                <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase leading-none overflow-hidden flex justify-center flex-wrap">
                                    {titleMainChars.map((char, i) => (
                                        <motion.span
                                            key={`main-${i}-${char}`}
                                            initial={{ opacity: 0, y: 45, rotateX: -70, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.1 + i * 0.03 }}
                                            className="inline-block"
                                        >
                                            {char === " " ? " " : char}
                                        </motion.span>
                                    ))}
                                </h1>

                                <p className="mt-4 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-white/70">
                                    {currentFrame.sub}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Progress Track */}
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
        </div>
    );
}

// ==============================================================================
// FRANKFURT SOUND ATELIER MODAL
// ==============================================================================
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
                exit={{ scale: 0.9, y: 20 }}
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
                    className="w-full py-4 rounded-full bg-[#00F0FF] text-black font-mono text-xs font-black tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] my-2"
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
        <div className="pt-20 pb-20 px-4 sm:px-8 max-w-4xl mx-auto text-center">
            <h2 className="font-sans text-3xl sm:text-5xl font-black text-white uppercase mb-4">CRAFT YOUR HARMONY</h2>
            <button
                onClick={onGenerateTicket}
                className="px-10 py-4 rounded-full bg-[#E7FF00] text-black font-mono text-xs font-black tracking-[0.25em] uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(231,255,0,0.5)]"
            >
                GET 9:16 VIP PASS
            </button>
        </div>
    );
}

// INSTAGRAM STORY TICKET MODAL
function InstagramStoryTicketModal({ userNickname, ending, stems, onBack }) {
    return (
        <div className="pt-20 pb-20 px-4 max-w-lg mx-auto flex flex-col items-center text-center">
            <h2 className="font-sans text-3xl sm:text-5xl font-black text-white uppercase mb-4">9:16 VIP PASS READY</h2>
            <button onClick={onBack} className="font-mono text-[11px] text-white/40 hover:text-white transition-colors">
                ← RE-MIX STEMS &amp; TRY ANOTHER
            </button>
        </div>
    );
}
