import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Volume2, VolumeX, Sliders, Play, Pause, 
    Download, Music, Check, ThumbsUp, ArrowRight, 
    Compass, ExternalLink, QrCode, ChevronDown, RotateCcw, Zap, Flame, Mic, Building2, X, Globe, ShieldCheck, Activity
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

// Full 7-Step Flipbook Story Timeline (100% Logo No. 65 Wine × Treble Atelier Collection)
const FRAMES = [
    { 
        id: 0, 
        src: "/assets/wine_atelier_04_neon_wisteria_1787173906304.jpg", 
        titleTop: "JUST SEAN FLOWS", 
        titleMain: "WALK WITH MUSIC?", 
        sub: "Private Midnight Sound Sketch"
    },
    { 
        id: 1, 
        src: "/assets/wine_atelier_01_stained_glass_1787173882749.jpg", 
        titleTop: "GUILD ATELIER", 
        titleMain: "WANT A QUICK LOOK?", 
        sub: "Hybrid Sound Lab in Formation",
        hasBuildingTarget: true
    },
    { 
        id: 2, 
        src: "/assets/wine_atelier_02_poster_brick_1787173891199.jpg", 
        titleTop: "02:00 AM", 
        titleMain: "STILL AWAKE HERE.", 
        sub: "24/7 Letterpress Concert Poster Lab"
    },
    { 
        id: 3, 
        src: "/assets/wine_atelier_03_tapestry_piano_1787173899303.jpg", 
        titleTop: "CANAL ALLEY", 
        titleMain: "PEEK INSIDE?", 
        sub: "Steinway Piano & Woven Tapestry",
        hasBuildingTarget: true
    },
    { 
        id: 4, 
        src: "/assets/logo_v09_no65_door_knocker_1787173209628.jpg", 
        titleTop: "SECRET HIDEAWAY", 
        titleMain: "MY PRIVATE HAVEN.", 
        sub: "Cast Bronze Emblem"
    },
    { 
        id: 5, 
        src: "/assets/logo_v11_no65_amp_1787173235884.jpg", 
        titleTop: "NEARLY THERE", 
        titleMain: "ALMOST AT THE DOOR.", 
        sub: "Custom Tube Amplifier Faceplate"
    },
    { 
        id: 6, 
        src: "/assets/logo_v17_no65_glass_decal_1787173294923.jpg", 
        titleTop: "STAGE READY", 
        titleMain: "THE DOORS OPEN.", 
        sub: "Flagship Gold Leaf Glass Decal Atelier"
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

// ASTRONOMICAL VECTOR STAR COMPONENTS (Diffraction Spikes, Photospheres, Lens Flares)
function AstronomicalSpikeStar({ color, size }) {
    return (
        <svg viewBox="0 0 60 60" width={size * 2.6} height={size * 2.6} className="overflow-visible pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
            {/* Outer Halo Glow */}
            <circle cx="30" cy="30" r="18" fill={color} opacity="0.3" filter="blur(4px)" />
            {/* Diffraction Cross Spikes */}
            <path d="M 30,2 L 32.5,27.5 L 58,30 L 32.5,32.5 L 30,58 L 27.5,32.5 L 2,30 L 27.5,27.5 Z" fill={color} opacity="0.9" />
            {/* Secondary Rays */}
            <path d="M 30,12 L 31.5,28.5 L 48,30 L 31.5,31.5 L 30,48 L 28.5,31.5 L 12,30 L 28.5,28.5 Z" fill="#FFFFFF" opacity="0.75" />
            {/* Bright Center Photosphere */}
            <circle cx="30" cy="30" r="3" fill="#FFFFFF" />
        </svg>
    );
}

function AstronomicalOrbStar({ color, size }) {
    return (
        <svg viewBox="0 0 40 40" width={size * 2.0} height={size * 2.0} className="overflow-visible pointer-events-none">
            <circle cx="20" cy="20" r="14" fill={color} opacity="0.35" filter="blur(3px)" />
            <circle cx="20" cy="20" r="7" fill={color} opacity="0.85" />
            <circle cx="20" cy="20" r="2.5" fill="#FFFFFF" />
        </svg>
    );
}

function AstronomicalFlareStar({ color, size }) {
    return (
        <svg viewBox="0 0 80 40" width={size * 3.2} height={size * 1.6} className="overflow-visible pointer-events-none">
            <path d="M 0,20 Q 40,16 80,20 Q 40,24 0,20 Z" fill={color} opacity="0.85" filter="blur(1px)" />
            <path d="M 40,5 Q 38,20 40,35 Q 42,20 40,5 Z" fill={color} opacity="0.65" />
            <circle cx="40" cy="20" r="2.5" fill="#FFFFFF" />
        </svg>
    );
}

// MULTI-COLOR & ASTRONOMICAL SHAPE STAR DATABASE WITH PARALLAX MASS & DEPTH
const STARS_DATABASE = Array.from({ length: 32 }).map((_, i) => {
    const size = 5 + (i * 7) % 12; // 5px to 16px
    const isLarge = size > 10;
    const isMedium = size >= 7 && size <= 10;

    const colors = ['#E7FF00', '#00F0FF', '#FF0055', '#FFFFFF', '#C5A059'];
    const color = colors[i % colors.length];

    const type = i % 3; // 0: Spike, 1: Orb, 2: Flare

    const zDepth = isLarge ? -95 : isMedium ? 15 : 95;
    const tiltMult = isLarge ? 0.35 : isMedium ? 0.85 : 1.55;

    return {
        id: i,
        size,
        color,
        type,
        left: `${(i * 11 + 4) % 92}vw`,
        delay: (i * 0.22) % 2.8,
        duration: isLarge ? 5.4 : isMedium ? 3.8 : 2.5, // Heavy stars move slowly, small light stars get dragged smoothly!
        opacityMax: 0.45 + (i % 5) * 0.12,
        zDepth,
        tiltMult,
        isLarge
    };
});

export default function App() {
    const [currentStep, setCurrentStep] = useState('flipbook');
    const [userNickname, setUserNickname] = useState("SEAN");
    const [activeEnding, setActiveEnding] = useState(DEFAULT_ENDING);
    const [showAtelierModal, setShowAtelierModal] = useState(false);

    // Amplified 3D Gyroscope & Mouse Parallax Orientation
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5, rawX: -100, rawY: -100, isHovered: false });
    
    const spotlightRef = useRef(null);

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

    // Mobile Gyroscope Device Orientation Event Listener
    useEffect(() => {
        const handleDeviceOrientation = (e) => {
            if (e.beta !== null && e.gamma !== null) {
                const normX = Math.max(-1, Math.min(1, e.gamma / 22));
                const normY = Math.max(-1, Math.min(1, e.beta / 22));
                setTilt({ x: normX, y: normY });
            }
        };

        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    }, []);

    const handlePointerMove = (e) => {
        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;

        setCursorPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight, rawX: e.clientX, rawY: e.clientY, isHovered: true });
        setTilt({ x: normX, y: normY });

        if (spotlightRef.current) {
            spotlightRef.current.style.transform = `translate3d(${e.clientX - 100}px, ${e.clientY - 100}px, 0)`;
        }
    };

    return (
        <div 
            onPointerMove={handlePointerMove}
            className="relative min-h-screen bg-[#050507] text-[#ECEBE4] font-sans antialiased selection:bg-[#E7FF00] selection:text-black overflow-hidden select-none fixed inset-0 flex items-center justify-center"
        >
            {/* 1. MINIMALIST NIGHT ALLEY FLASHLIGHT SPOTLIGHT CURSOR */}
            <div 
                ref={spotlightRef}
                style={{
                    willChange: 'transform',
                    opacity: cursorPos.isHovered ? 1 : 0
                }}
                className="hidden md:block fixed top-0 left-0 w-[200px] h-[200px] rounded-full pointer-events-none z-50 transition-opacity duration-300 mix-blend-screen"
            >
                <div className="w-full h-full rounded-full bg-radial from-[#E7FF00]/15 via-white/[0.04] to-transparent filter blur-md" />
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E7FF00] shadow-[0_0_12px_#E7FF00]" />
            </div>

            {/* 2. Editorial 3D Star Title Header */}
            <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-none">
                <motion.div 
                    style={{
                        transform: `perspective(500px) rotateX(${tilt.y * -28}deg) rotateY(${tilt.x * 28}deg) translateZ(25px)`,
                        transformStyle: 'preserve-3d'
                    }}
                    className="pointer-events-auto flex items-center gap-3 transition-transform duration-100 ease-out"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_16px_#E7FF00] animate-pulse"></span>
                    <span className="font-mono font-black text-sm sm:text-base tracking-[0.32em] text-white uppercase drop-shadow-[0_4px_16px_rgba(231,255,0,0.5)]">
                        @just.sean.flows
                    </span>
                </motion.div>
            </header>

            <main className="relative z-10 w-full h-full flex items-center justify-center">
                {currentStep === 'flipbook' && (
                    <FlipbookWalkingEngine 
                        tilt={tilt}
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
// 1. UNIFIED SINGLE AudioContext DSP ENGINE & ASTRONOMICAL VECTOR STARFIELD
// ==============================================================================
function FlipbookWalkingEngine({ tilt, cursorPos, onEnterMixer, onOpenAtelier }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    
    // Initial Audio Unlock & Blur Overlay State
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

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

    // Power Reservoir & Level Floor
    const currentPower = useRef(0);
    const unlockedLevelFloor = useRef(0);
    const lastScrollPumpTime = useRef(Date.now());

    // 80.12% Trembling Hold Ref
    const tremblingStartTime = useRef(0);
    const isHoldingAt8012 = useRef(false);

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

    // DYNAMIC PACING TRIGGER
    const triggerCleanFootstep = (speedVelocity = 1) => {
        const now = Date.now();
        const dynamicInterval = Math.max(320, 800 - Math.min(speedVelocity * 60, 480));
        
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

        const masterTime = (guitarRef.current && guitarRef.current.currentTime) ? guitarRef.current.currentTime : 0;
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

    // PROGRESSIVE SCROLL & TOUCH ENGINE WITH DYNAMIC PACING FOOTSTEP TRIGGER
    useEffect(() => {
        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }
            forceUnlockAudio(e);

            if (e.deltaY <= 0) return;

            const rawDelta = e.deltaY;
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

            triggerCleanFootstep(rawDelta * 0.015);
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
            if (!e.touches || !e.touches[0]) return;

            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY.current - currentY;
            const now = Date.now();
            const timeDiff = Math.max(16, now - touchStartTime.current);

            if (deltaY > 0) {
                const velocity = deltaY / timeDiff;

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

                triggerCleanFootstep(velocity * 1.8);
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
        };
    }, []);

    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    const currentFrame = FRAMES[activeFrameIdx] || FRAMES[0];
    const isAtelierOptionVisible = (activeFrameIdx === 1 || activeFrameIdx === 3);

    const tiltX = tilt.x * 20;
    const tiltY = tilt.y * 15;

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
                className="relative w-full h-full md:w-[430px] md:h-[90vh] md:max-h-[920px] md:rounded-[36px] md:border-2 md:border-white/20 md:shadow-[0_0_80px_rgba(231,255,0,0.15)] overflow-hidden transition-all duration-700 bg-black"
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

                {/* 2. DIRECT CLICKABLE ATELIER DOOR ZONE (FRAME 1 & 3) */}
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

                {/* 3. Floating Spatial HUD & Pure Minimalist Typography */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-16 pb-6 px-4 text-center z-20">
                    {/* ULTRA-MINIMALIST POWER NUMBER DISPLAY */}
                    <div className="flex flex-col items-center gap-1.5 pt-4">
                        <button
                            onClick={(e) => forceUnlockAudio(e)}
                            className={`pointer-events-auto inline-flex items-center justify-center px-4 py-1 rounded-full bg-black/80 backdrop-blur-xl border shadow-2xl font-mono text-xs font-black tracking-widest transition-all ${
                                isTremblingAt8012 
                                    ? 'border-[#FF0055] text-[#FF0055] animate-bounce shadow-[0_0_25px_#FF0055]' 
                                    : 'border-white/20 hover:border-[#E7FF00] text-[#E7FF00]'
                            }`}
                        >
                            <span className="text-sm font-black tracking-wider">
                                {livePowerStr}
                            </span>
                        </button>
                    </div>

                    {/* True 3D Letter-by-Letter Assembled Typography (Middle Text Only!) */}
                    <div className="max-w-sm mx-auto my-auto px-2 flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`assembled-title-${activeFrameIdx}`}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center text-center"
                            >
                                <h2 className="font-sans text-xl sm:text-2xl font-light tracking-tight text-[#E7FF00] uppercase leading-none mb-2">
                                    {currentFrame.titleTop}
                                </h2>

                                <h1 
                                    className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight max-w-xs"
                                    style={{
                                        textShadow: cursorPos.isHovered 
                                            ? `${tiltX * 1.5}px ${tiltY * 1.5}px 35px rgba(231,255,0,0.4)` 
                                            : '0 0 35px rgba(0,0,0,0.9)'
                                    }}
                                >
                                    {currentFrame.titleMain}
                                </h1>

                                <p className="mt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/90 max-w-xs bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                                    {currentFrame.sub}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Progress Track */}
                    <div className="pointer-events-auto flex flex-col items-center gap-2.5">
                        {progress >= 88 && (
                            <button
                                onClick={onEnterMixer}
                                className="w-full max-w-xs py-3 rounded-full bg-[#E7FF00] text-black font-mono text-[11px] font-black tracking-[0.2em] uppercase hover:scale-105 transition-all shadow-[0_0_50px_rgba(231,255,0,0.6)] flex items-center justify-center gap-2 animate-pulse"
                            >
                                <span>ENTER STEM MIXER</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        )}

                        <div className="w-40 sm:w-60 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#E7FF00] transition-all duration-75"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. INITIAL UNLOCK SPLASH: ASTRONOMICAL VECTOR STARFIELD WITH ZERO EMOJI TEXT */}
            <AnimatePresence>
                {!isAudioUnlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        onClick={(e) => forceUnlockAudio(e)}
                        onTouchStart={(e) => forceUnlockAudio(e)}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/80 backdrop-blur-2xl cursor-pointer overflow-hidden"
                        style={{
                            perspective: '800px',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {/* PURE VECTOR ASTRONOMICAL STARFIELD LAYER */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                            {STARS_DATABASE.map((s) => {
                                const starTiltX = tilt.x * 24 * s.tiltMult;
                                const starTiltY = tilt.y * 24 * s.tiltMult;

                                const startY = s.isLarge ? '80vh' : '100vh';
                                const endY = s.isLarge ? '10vh' : '-20vh';

                                return (
                                    <motion.div
                                        key={s.id}
                                        initial={{
                                            x: s.left,
                                            y: startY,
                                            opacity: 0,
                                            scale: 0.3
                                        }}
                                        animate={{
                                            y: [startY, endY],
                                            opacity: [0, s.opacityMax, 0],
                                            scale: [0.3, 1.4, 0.2]
                                        }}
                                        transition={{
                                            duration: s.duration,
                                            repeat: Infinity,
                                            delay: s.delay,
                                            ease: 'easeInOut'
                                        }}
                                        style={{
                                            transform: `translate3d(${starTiltX}px, ${starTiltY}px, ${s.zDepth}px)`
                                        }}
                                        className="absolute select-none transition-transform duration-150 ease-out flex items-center justify-center"
                                    >
                                        {s.type === 0 && <AstronomicalSpikeStar color={s.color} size={s.size} />}
                                        {s.type === 1 && <AstronomicalOrbStar color={s.color} size={s.size} />}
                                        {s.type === 2 && <AstronomicalFlareStar color={s.color} size={s.size} />}
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
                                transform: `perspective(600px) rotateX(${tilt.y * -32}deg) rotateY(${tilt.x * 32}deg) translateZ(40px)`,
                                transformStyle: 'preserve-3d'
                            }}
                            className="flex flex-col items-center text-center cursor-pointer select-none leading-[1.15] z-20 transition-transform duration-100 ease-out"
                        >
                            <span 
                                className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase drop-shadow-[0_10px_25px_rgba(255,255,255,0.4)]"
                                style={{
                                    WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.75)',
                                    color: 'transparent',
                                    textShadow: '0 0 30px rgba(255,255,255,0.45)'
                                }}
                            >
                                LET
                            </span>
                            <span 
                                className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase drop-shadow-[0_10px_25px_rgba(255,255,255,0.4)]"
                                style={{
                                    WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.75)',
                                    color: 'transparent',
                                    textShadow: '0 0 30px rgba(255,255,255,0.45)'
                                }}
                            >
                                'S
                            </span>
                            <span 
                                className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase drop-shadow-[0_10px_25px_rgba(255,255,255,0.4)]"
                                style={{
                                    WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.75)',
                                    color: 'transparent',
                                    textShadow: '0 0 30px rgba(255,255,255,0.45)'
                                }}
                            >
                                GO
                            </span>
                            <span 
                                className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#E7FF00]"
                                style={{
                                    WebkitTextStroke: '2px rgba(231, 255, 0, 0.95)',
                                    color: 'transparent',
                                    textShadow: '0 0 40px rgba(231,255,0,0.9)'
                                }}
                            >
                                !
                            </span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. ULTRA-CHIC RISING AURORA LIGHT WAVE */}
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
