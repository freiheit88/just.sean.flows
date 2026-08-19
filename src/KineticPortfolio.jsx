import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Volume2, VolumeX, Sliders, Play, Pause, 
    Download, Music, Check, ThumbsUp, ArrowRight, 
    Compass, ExternalLink, QrCode, ChevronDown, RotateCcw, Zap, Flame, Mic, Building2, X, Globe, ShieldCheck, Activity
} from 'lucide-react';

const SECRET_YOUTUBE_URL = "https://www.youtube.com/watch?v=RUoWgJDZ0M8&t=1330s";
const ATELIER_IMG = "/assets/frankfurt_sound_atelier.jpg";

// Encoded Audio URIs for 100% Mobile & PC Browser Compatibility
const STEM_SRCS = {
    bass: "/assets/manual_upload/A%20Twelve-minute%20Alibi/2%20Bass.mp3",
    guitar: "/assets/manual_upload/A%20Twelve-minute%20Alibi/3%20Guitar.mp3",
    drums: "/assets/manual_upload/A%20Twelve-minute%20Alibi/1%20Drums.mp3",
    perc: "/assets/manual_upload/A%20Twelve-minute%20Alibi/4%20Percussion.mp3",
    synth: "/assets/manual_upload/A%20Twelve-minute%20Alibi/5%20Synth.mp3",
    vocal: "/assets/manual_upload/A%20Twelve-minute%20Alibi/0%20Lead%20Vocals.mp3",
};

// 7 European Sound Atelier Frames featuring 100% Logo No. 65 (Wine × Treble - J.S.F)
const FRAMES = [
    { 
        id: 0, 
        src: "/assets/wine_atelier_04_neon_wisteria_1787173906304.jpg", 
        titleTop: "JUST SEAN FLOWS", 
        titleMain: "WALK WITH MUSIC?", 
        sub: "Private Midnight Sound Sketch",
        buildingSign: "BRAND MARK NO. 65 // BURGUNDY NEON WISTERIA"
    },
    { 
        id: 1, 
        src: "/assets/wine_atelier_01_stained_glass_1787173882749.jpg", 
        titleTop: "GUILD ATELIER", 
        titleMain: "WANT A QUICK LOOK?", 
        sub: "Hybrid Sound Lab in Formation",
        buildingSign: "BRAND MARK NO. 65 // STAINED GLASS TRANSOM",
        hasBuildingTarget: true
    },
    { 
        id: 2, 
        src: "/assets/wine_atelier_02_poster_brick_1787173891199.jpg", 
        titleTop: "02:00 AM", 
        titleMain: "STILL AWAKE HERE.", 
        sub: "24/7 Letterpress Concert Poster Lab",
        buildingSign: "BRAND MARK NO. 65 // LETTERPRESS POSTER"
    },
    { 
        id: 3, 
        src: "/assets/wine_atelier_03_tapestry_piano_1787173899303.jpg", 
        titleTop: "CANAL ALLEY", 
        titleMain: "PEEK INSIDE?", 
        sub: "Steinway Piano & Woven Tapestry",
        buildingSign: "BRAND MARK NO. 65 // ACOUSTIC TAPESTRY",
        hasBuildingTarget: true
    },
    { 
        id: 4, 
        src: "/assets/logo_v09_no65_door_knocker_1787173209628.jpg", 
        titleTop: "SECRET HIDEAWAY", 
        titleMain: "MY PRIVATE HAVEN.", 
        sub: "Cast Bronze Door Emblem",
        buildingSign: "BRAND MARK NO. 65 // BRONZE EMBLEM"
    },
    { 
        id: 5, 
        src: "/assets/logo_v11_no65_amp_1787173235884.jpg", 
        titleTop: "NEARLY THERE", 
        titleMain: "ALMOST AT THE DOOR.", 
        sub: "Custom Tube Amplifier Faceplate",
        buildingSign: "BRAND MARK NO. 65 // TUBE AMP FACEPLATE"
    },
    { 
        id: 6, 
        src: "/assets/logo_v17_no65_glass_decal_1787173294923.jpg", 
        titleTop: "STAGE READY", 
        titleMain: "THE DOORS OPEN.", 
        sub: "Flagship Gold Leaf Glass Decal Atelier",
        buildingSign: "BRAND MARK NO. 65 // GOLD LEAF DECAL"
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

export default function App() {
    const [currentStep, setCurrentStep] = useState('flipbook');
    const [userNickname, setUserNickname] = useState("SEAN");
    const [activeEnding, setActiveEnding] = useState(DEFAULT_ENDING);
    const [showAtelierModal, setShowAtelierModal] = useState(false);

    // High Precision Cursor Tracking with 16-Node Ribbon Trail Physics
    const [cursorPos, setCursorPos] = useState({ 
        x: 0.5, y: 0.5, rawX: -100, rawY: -100, isHovered: false, isOverTitle: false, isOverBuilding: false, cursorMode: 'default', speed: 0
    });
    const [trailNodes, setTrailNodes] = useState(
        Array.from({ length: 16 }, () => ({ x: -100, y: -100 }))
    );
    const [touchRipples, setTouchRipples] = useState([]);
    const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

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

        // Update 16-node spring ribbon trail
        setTrailNodes((prev) => {
            const next = [{ x: e.clientX, y: e.clientY }];
            for (let i = 1; i < prev.length; i++) {
                const prevNode = next[i - 1];
                const currNode = prev[i];
                const ease = 0.45 - i * 0.02;
                next.push({
                    x: currNode.x + (prevNode.x - currNode.x) * ease,
                    y: currNode.y + (prevNode.y - currNode.y) * ease
                });
            }
            return next;
        });
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
            className="relative min-h-screen bg-[#050507] text-[#ECEBE4] font-sans antialiased selection:bg-[#E7FF00] selection:text-black overflow-hidden select-none fixed inset-0"
        >
            {/* 1. RESTORED LONG LIQUID RIBBON TAIL CUSTOM CURSOR */}
            <div className="hidden md:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
                {/* 16 Spring Trail Nodes */}
                {trailNodes.map((node, i) => {
                    const size = Math.max(3, 24 - i * 1.3);
                    const opacity = Math.max(0.08, 0.95 - i * 0.055);
                    const color = i % 2 === 0 ? '#E7FF00' : '#00F0FF';
                    return (
                        <motion.div
                            key={i}
                            style={{
                                left: node.x - size / 2,
                                top: node.y - size / 2,
                                width: size,
                                height: size,
                                backgroundColor: color,
                                opacity: cursorPos.isHovered ? opacity : 0,
                                boxShadow: i === 0 ? '0 0 20px #E7FF00, 0 0 35px #00F0FF' : 'none'
                            }}
                            className="fixed rounded-full pointer-events-none transition-all duration-75 mix-blend-screen"
                        />
                    );
                })}
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

            {/* 3. Editorial Brand Header */}
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
// 1. FLIPBOOK ENGINE WITH HUMAN WALKING CADENCE FOOTSTEP THROTTLING (340ms)
// ==============================================================================
function FlipbookWalkingEngine({ cursorPos, onEnterMixer, onOpenAtelier }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isHeadBobbing, setIsHeadBobbing] = useState(false);
    
    // 10-Second Splash Sound Unlocker Overlay State
    const [show10sSplashOverlay, setShow10sSplashOverlay] = useState(true);
    const [splashCountdown, setSplashCountdown] = useState(10);
    
    // Live Dev Kinetics Power Meter State & 80.12% Trembling Easter Egg
    const [livePower, setLivePower] = useState(0);
    const [powerDisplayStr, setPowerDisplayStr] = useState("0%");
    const [isTremblingAt8012, setIsTremblingAt8012] = useState(false);

    const [audioTier, setAudioTier] = useState(1);
    const [lastVelocityStr, setLastVelocityStr] = useState("0.0");
    const [hasUserUnlockedAudio, setHasUserUnlockedAudio] = useState(false);

    // Initial Preloader State
    const [isInitialBuffering, setIsInitialBuffering] = useState(true);
    const [simulatedVolume, setSimulatedVolume] = useState(12);
    const [isLocked30Glitter, setIsLocked30Glitter] = useState(false);

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

    // Power Reservoir & Level Floor (Checkpoints: 0%, 20%, 50%, NOT permanent 80%)
    const currentPower = useRef(0);
    const unlockedLevelFloor = useRef(0);
    const lastScrollPumpTime = useRef(Date.now());
    const lastSyncTier = useRef(1);

    // 80.12% Trembling Hold Ref
    const tremblingStartTime = useRef(0);
    const isHoldingAt8012 = useRef(false);

    // AUDIBLE CRISP SINGLE FOOTSTEP
    const playSingleFootstep = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const isLeft = isLeftFoot.current;
            isLeftFoot.current = !isLeft;

            const mainGain = ctx.createGain();
            mainGain.gain.setValueAtTime(0.26, ctx.currentTime);

            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isLeft ? 90 : 100, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.08);

            oscGain.gain.setValueAtTime(0.28, ctx.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            const bufferSize = Math.floor(ctx.sampleRate * 0.06);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = isLeft ? 1250 : 1480;
            noiseFilter.Q.value = 1.8;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.30, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

            const delayNode = ctx.createDelay();
            delayNode.delayTime.value = 0.16;

            const feedbackGain = ctx.createGain();
            feedbackGain.gain.value = 0.28;

            osc.connect(oscGain);
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);

            oscGain.connect(mainGain);
            noiseGain.connect(mainGain);

            mainGain.connect(delayNode);
            delayNode.connect(feedbackGain);
            feedbackGain.connect(delayNode);

            mainGain.connect(ctx.destination);
            delayNode.connect(ctx.destination);

            osc.start(); noise.start();
            osc.stop(ctx.currentTime + 0.09);
            noise.stop(ctx.currentTime + 0.09);
        } catch (e) {}
    };

    // HUMAN WALKING CADENCE FOOTSTEP TRIGGER (Enforces min 340ms between steps)
    const triggerRhythmicFootstep = (speedVelocity = 1) => {
        const now = Date.now();
        // Dynamic walking cadence: minimum 320ms interval during fast scroll, 360ms during steady walk
        const minCadenceInterval = Math.max(300, 360 - Math.min(speedVelocity * 30, 60));
        
        if (now - lastStepTime.current >= minCadenceInterval) {
            lastStepTime.current = now;
            playSingleFootstep();
            setIsHeadBobbing(true);
            setTimeout(() => setIsHeadBobbing(false), 160);
        }
    };

    // PLAY 3-SECOND REALISTIC WALKING FOOTSTEP AMBIENCE SEQUENCE
    const trigger3SecFootstepSequence = () => {
        playSingleFootstep();
        setTimeout(() => playSingleFootstep(), 500);
        setTimeout(() => playSingleFootstep(), 1150);
        setTimeout(() => playSingleFootstep(), 1750);
        setTimeout(() => playSingleFootstep(), 2400);
    };

    // GUARANTEED SOUND ENGINE UNLOCKER
    const forceUnlockAudio = (isExplicitTap = false) => {
        if (isExplicitTap) {
            setShow10sSplashOverlay(false);
            trigger3SecFootstepSequence();
        }

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
                if (audioCtxRef.current.state === 'suspended') {
                    audioCtxRef.current.resume();
                }
            }
        } catch (e) {}

        const audioRefs = [bassRef, guitarRef, drumsRef, percRef, synthRef, vocalRef];
        const masterTime = (bassRef.current && bassRef.current.currentTime) ? bassRef.current.currentTime : 0;

        audioRefs.forEach((r, idx) => {
            if (r.current) {
                r.current.muted = false;
                r.current.playsInline = true;
                if (idx === 0) {
                    r.current.volume = 0.50;
                } else if (r.current.volume === undefined || r.current.volume === null) {
                    r.current.volume = 0.0;
                }

                if (Math.abs(r.current.currentTime - masterTime) > 0.08) {
                    r.current.currentTime = masterTime;
                }

                if (r.current.paused) {
                    const p = r.current.play();
                    if (p !== undefined) {
                        p.then(() => setHasUserUnlockedAudio(true)).catch(() => {});
                    } else {
                        setHasUserUnlockedAudio(true);
                    }
                }
            }
        });
    };

    // 10-Second Countdown & Auto-Dismiss Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setSplashCountdown((prev) => {
                if (prev <= 1) {
                    setShow10sSplashOverlay(false);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // CHECKPOINT-ONLY SYNC
    const performCheckpointSync = () => {
        if (!bassRef.current) return;
        const masterTime = bassRef.current.currentTime;

        [guitarRef, drumsRef, percRef, synthRef, vocalRef].forEach((r) => {
            if (r.current) {
                const diff = Math.abs(r.current.currentTime - masterTime);
                if (diff > 0.08) {
                    r.current.currentTime = masterTime;
                }
            }
        });
    };

    // DECAY ENGINE WITH LEVEL 4 -> LEVEL 3 DECAY & 80.12% 1S TREMBLING EASTER EGG
    useEffect(() => {
        const volumeEngineInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceScroll = now - lastScrollPumpTime.current;

            if (timeSinceScroll > 180) {
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
            setLivePower(powerInt);

            if (isHoldingAt8012.current && rawPower === 80.12) {
                setPowerDisplayStr("80.12%");
            } else {
                setPowerDisplayStr(`${powerInt}%`);
            }

            let tier = 1;
            let targetBass = 0.50;
            let targetGuitar = 0.0;
            let targetOtherInst = 0.0;
            let targetVocal = 0.0;

            if (rawPower >= 80) {
                tier = 4;
                targetBass = 1.0;
                targetGuitar = 1.0;
                targetOtherInst = 1.0;
                targetVocal = 0.95;
            } else if (rawPower >= 50) {
                tier = 3;
                if (unlockedLevelFloor.current < 50) unlockedLevelFloor.current = 50;
                targetBass = 0.90;
                targetGuitar = 0.90;
                targetOtherInst = 0.85;
                targetVocal = 0.0;
            } else if (rawPower >= 20) {
                tier = 2;
                if (unlockedLevelFloor.current < 20) unlockedLevelFloor.current = 20;
                targetBass = 0.75;
                targetGuitar = 0.70;
                targetOtherInst = 0.0;
                targetVocal = 0.0;
            } else {
                tier = 1;
                targetBass = 0.50;
                targetGuitar = 0.0;
                targetOtherInst = 0.0;
                targetVocal = 0.0;
            }

            if (tier !== lastSyncTier.current) {
                lastSyncTier.current = tier;
                performCheckpointSync();
            }

            setAudioTier(tier);

            if (bassRef.current) {
                bassRef.current.volume = targetBass;
                if (bassRef.current.paused) bassRef.current.play().catch(() => {});
            }
            if (guitarRef.current) guitarRef.current.volume = targetGuitar;
            if (drumsRef.current) drumsRef.current.volume = targetOtherInst;
            if (percRef.current) percRef.current.volume = targetOtherInst;
            if (synthRef.current) synthRef.current.volume = targetOtherInst;
            if (vocalRef.current) vocalRef.current.volume = targetVocal;

        }, 50);

        return () => clearInterval(volumeEngineInterval);
    }, []);

    // Initial Buffering Sequence + Global Event Sound Unlockers
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
            forceUnlockAudio();
        }, 1800);

        const handleGlobalUnlock = () => forceUnlockAudio();

        window.addEventListener('click', handleGlobalUnlock);
        window.addEventListener('pointerdown', handleGlobalUnlock);
        window.addEventListener('touchstart', handleGlobalUnlock);
        window.addEventListener('wheel', handleGlobalUnlock);
        window.addEventListener('keydown', handleGlobalUnlock);

        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
            window.removeEventListener('click', handleGlobalUnlock);
            window.removeEventListener('pointerdown', handleGlobalUnlock);
            window.removeEventListener('touchstart', handleGlobalUnlock);
            window.removeEventListener('wheel', handleGlobalUnlock);
            window.removeEventListener('keydown', handleGlobalUnlock);
        };
    }, []);

    // 5-SECOND EXTENDED WALKING PACING TIMELINE
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                const next = Math.min(100, prev + 0.05);
                progressRef.current = next;
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // PROGRESSIVE TIER DIFFICULTY SCROLL ENGINE WITH CADENCE THROTTLING
    useEffect(() => {
        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }
            forceUnlockAudio();

            if (e.deltaY <= 0) return;

            const rawDelta = e.deltaY;
            setLastVelocityStr(rawDelta.toFixed(0) + " delta");

            const cPower = currentPower.current;
            let tierMult = 0.7;
            if (cPower < 20) tierMult = 3.2;
            else if (cPower < 50) tierMult = 1.8;

            const powerIncrement = Math.min(rawDelta * 0.008 * tierMult, 2.8);
            currentPower.current = Math.min(100, currentPower.current + powerIncrement);
            lastScrollPumpTime.current = Date.now();

            const clampedDelta = Math.min(rawDelta * 0.0022, 1.2);
            setProgress((prev) => {
                const next = Math.min(100, prev + clampedDelta);
                progressRef.current = next;
                return next;
            });

            // Trigger footstep with human walking cadence throttling (min 340ms interval)
            triggerRhythmicFootstep(rawDelta * 0.01);
        };

        const handleTouchStart = (e) => {
            forceUnlockAudio();
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

            forceUnlockAudio();
            if (!e.touches || !e.touches[0]) return;

            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY.current - currentY;
            const now = Date.now();
            const timeDiff = Math.max(16, now - touchStartTime.current);

            if (deltaY > 0) {
                const velocity = deltaY / timeDiff;
                setLastVelocityStr(velocity.toFixed(2) + " px/ms");

                const cPower = currentPower.current;
                let tierMult = 0.7;
                if (cPower < 20) tierMult = 3.4;
                else if (cPower < 50) tierMult = 1.9;

                const powerIncrement = Math.min((velocity * 0.45 + deltaY * 0.008) * tierMult, 3.8);
                currentPower.current = Math.min(100, currentPower.current + powerIncrement);
                lastScrollPumpTime.current = now;

                const strokeProgress = Math.min(deltaY * 0.010, 2.2);
                setProgress((prev) => {
                    const next = Math.min(100, prev + strokeProgress);
                    progressRef.current = next;
                    return next;
                });

                // Trigger footstep with human walking cadence throttling (min 340ms interval)
                triggerRhythmicFootstep(velocity);
            }

            touchStartY.current = currentY;
            touchStartTime.current = now;
        };

        const handleTouchEnd = () => {
            forceUnlockAudio();
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
        };
    }, []);

    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    const currentFrame = FRAMES[activeFrameIdx] || FRAMES[0];
    const isAtelierOptionVisible = activeFrameIdx === 1 || activeFrameIdx === 3;

    const tiltX = (cursorPos.x - 0.5) * -22;
    const tiltY = (cursorPos.y - 0.5) * 16;

    const titleTopChars = currentFrame.titleTop.split("");
    const titleMainChars = currentFrame.titleMain.split("");

    return (
        <div 
            onClick={() => forceUnlockAudio()}
            onTouchStart={() => forceUnlockAudio()}
            className="fixed inset-0 w-screen h-screen bg-[#050507] overflow-hidden select-none"
        >
            {/* 6 Synchronized Multi-Stem Audio Elements */}
            <audio ref={bassRef} src={STEM_SRCS.bass} loop playsInline preload="auto" />
            <audio ref={guitarRef} src={STEM_SRCS.guitar} loop playsInline preload="auto" />
            <audio ref={drumsRef} src={STEM_SRCS.drums} loop playsInline preload="auto" />
            <audio ref={percRef} src={STEM_SRCS.perc} loop playsInline preload="auto" />
            <audio ref={synthRef} src={STEM_SRCS.synth} loop playsInline preload="auto" />
            <audio ref={vocalRef} src={STEM_SRCS.vocal} loop playsInline preload="auto" />

            {/* 1. 100vh Fullscreen 7-Frame Visual Stack */}
            <div 
                className="relative w-full h-full transition-all duration-700"
                style={{
                    filter: isInitialBuffering ? 'blur(22px) brightness(35%) saturate(50%)' : 'none'
                }}
            >
                {FRAMES.map((f, idx) => {
                    const isTargetBuildingFrame = (idx === 1 || idx === 3);
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

                {/* 2. DIRECT IN-PICTURE BUILDING CLICK ZONE */}
                <AnimatePresence>
                    {isAtelierOptionVisible && !isInitialBuffering && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
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

                {/* 3. Floating Spatial HUD & Real Letter-by-Letter Assembled Typography */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-20 pb-8 px-4 sm:px-12 text-center z-20">
                    {/* LIVE DEV KINETICS ACCUMULATIVE POWER GAUGE HUD WITH 80.12% TREMBLING */}
                    <div className="flex flex-col items-center gap-1.5">
                        <button
                            onClick={() => forceUnlockAudio(true)}
                            className={`pointer-events-auto inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border shadow-2xl font-mono text-[11px] font-bold transition-all ${
                                isTremblingAt8012 
                                    ? 'border-[#FF0055] text-[#FF0055] animate-bounce shadow-[0_0_25px_#FF0055]' 
                                    : 'border-white/20 hover:border-[#E7FF00]'
                            }`}
                        >
                            <div className="flex items-center gap-1.5">
                                <Zap className={`w-3.5 h-3.5 ${isTremblingAt8012 ? 'text-[#FF0055] animate-ping' : livePower >= 80 ? 'text-[#FF0055] animate-bounce' : livePower >= 50 ? 'text-[#E7FF00]' : 'text-[#00F0FF]'}`} />
                                <span className="text-white/60">POWER:</span>
                                <span className={`text-sm font-black ${isTremblingAt8012 ? 'text-[#FF0055] animate-pulse' : livePower >= 80 ? 'text-[#FF0055]' : livePower >= 50 ? 'text-[#E7FF00]' : 'text-[#00F0FF]'}`}>
                                    {powerDisplayStr}
                                </span>
                            </div>

                            <span className="w-1 h-3 bg-white/20" />

                            <div className="flex items-center gap-1 text-[10px]">
                                <span className="text-white/50">TIER:</span>
                                <span className="text-white">
                                    {audioTier === 4 && '⚡ LV.4 VOCAL'}
                                    {audioTier === 3 && '🔥 LV.3 TUTTI'}
                                    {audioTier === 2 && '🎸 LV.2 GUITAR'}
                                    {audioTier === 1 && '🌙 LV.1 BASS'}
                                </span>
                            </div>

                            <span className="w-1 h-3 bg-white/20 hidden sm:inline-block" />

                            <span className="text-[9px] text-white/40 font-mono hidden sm:inline-block">
                                FLOOR: {unlockedLevelFloor.current}%
                            </span>
                        </button>

                        {/* Visual Live Power Bar with Tremble Shake */}
                        <motion.div 
                            animate={isTremblingAt8012 ? { x: [-3, 3, -3, 3, 0] } : {}}
                            transition={isTremblingAt8012 ? { repeat: Infinity, duration: 0.1 } : {}}
                            className="w-36 sm:w-56 h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15"
                        >
                            <div 
                                className={`h-full rounded-full transition-all duration-75 ${
                                    isTremblingAt8012 
                                        ? 'bg-[#FF0055] shadow-[0_0_15px_#FF0055]'
                                        : livePower >= 80 
                                        ? 'bg-[#FF0055] shadow-[0_0_10px_#FF0055]' 
                                        : livePower >= 50 
                                        ? 'bg-[#E7FF00] shadow-[0_0_10px_#E7FF00]' 
                                        : 'bg-[#00F0FF]'
                                }`}
                                style={{ width: `${isTremblingAt8012 ? 80.12 : livePower}%` }}
                            />
                        </motion.div>
                    </div>

                    {/* True 3D Letter-by-Letter Assembled Typography & Building Sign Overlay */}
                    <div className="max-w-4xl mx-auto my-auto px-2 flex flex-col items-center">
                        {/* Brand Mark Emblem Overlay Badge */}
                        {currentFrame.buildingSign && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="mb-4 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/90 border border-[#800020] shadow-[0_0_30px_rgba(128,0,32,0.6)] backdrop-blur-xl"
                            >
                                <div className="w-3.5 h-4 bg-[#800020] border border-[#FF0055] clip-path-pick rounded-xs flex items-center justify-center shadow-sm">
                                    <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                                </div>
                                <span className="font-mono text-[10px] sm:text-xs font-black text-[#FF4D79] tracking-widest uppercase">
                                    {currentFrame.buildingSign}
                                </span>
                            </motion.div>
                        )}

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
                                <h2 className="font-sans text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#E7FF00] uppercase leading-none mb-3 overflow-hidden flex justify-center flex-wrap">
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
                                    className="font-sans text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-tight overflow-hidden flex justify-center flex-wrap max-w-3xl"
                                    style={{
                                        textShadow: cursorPos.isHovered 
                                            ? `${tiltX * 1.8}px ${tiltY * 1.8}px 35px rgba(231,255,0,0.4)` 
                                            : '0 0 35px rgba(0,0,0,0.9)'
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
                                    animate={{ opacity: 0.8, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.4 }}
                                    className="mt-4 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/80 max-w-xl"
                                >
                                    {currentFrame.sub}
                                </motion.p>
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

            {/* 4. 10-SECOND INITIAL SOUND UNLOCKER SPLASH OVERLAY CARD */}
            <AnimatePresence>
                {show10sSplashOverlay && !isInitialBuffering && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={() => forceUnlockAudio(true)}
                    >
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                forceUnlockAudio(true);
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative w-full max-w-md p-6 rounded-3xl bg-black/90 border border-[#E7FF00]/80 shadow-[0_0_50px_rgba(231,255,0,0.4)] text-center flex flex-col items-center gap-4 cursor-pointer outline-none"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#E7FF00]/10 border border-[#E7FF00]/40 flex items-center justify-center text-[#E7FF00]">
                                <Volume2 className="w-6 h-6 animate-pulse" />
                            </div>

                            <div>
                                <span className="font-mono text-[10px] text-[#E7FF00] font-bold tracking-[0.25em] uppercase block mb-1">
                                    JUST SEAN FLOWS // AUDIO EXPERIENCE
                                </span>
                                <h3 className="font-sans text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                                    TAP TO START MIDNIGHT SOUND
                                </h3>
                                <p className="font-mono text-[10px] text-white/60 mt-1">
                                    Triggers immediate footstep &amp; 3-second walking ambience
                                </p>
                            </div>

                            <div className="w-full py-3.5 rounded-full bg-[#E7FF00] text-black font-mono text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(231,255,0,0.5)]">
                                <Play className="w-4 h-4 fill-current" />
                                <span>TAP TO START ({splashCountdown}s)</span>
                            </div>

                            <span className="font-mono text-[9px] text-white/40">
                                Auto-dismisses in {splashCountdown} seconds
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 5. ULTRA-CHIC RISING AURORA LIGHT WAVE */}
            <div className="fixed inset-x-0 bottom-0 h-48 pointer-events-none z-30 overflow-hidden">
                <motion.div
                    animate={{
                        y: ['100%', '-80%'],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3.2,
                        ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                    className="w-full h-24 bg-gradient-to-t from-[#E7FF00]/0 via-[#E7FF00]/15 to-[#E7FF00]/0 blur-xl"
                />
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

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
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
                <h2 className="font-sans text-3xl sm:text-5xl font-black text-white uppercase">
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
                Ready for Instagram Story sharing in 9:16 vertical high resolution.
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
                    <ExternalLink className="w-3.5 h-3.5 text-[#E7FF00] group-hover:text-[#E7FF00]" />
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
