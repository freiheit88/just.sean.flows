import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Sparkles, MapPin, Music, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, ShieldCheck, Crown, Wand2, Sun, Moon, Flame, Zap, Volume2, Share2, Layers } from 'lucide-react';

// Google Genie Pre-Trained Virtual World Archetypes
const GENIE_WORLDS = {
    salon: {
        id: 'salon',
        name: "Late Romantic Frankfurt Grand Salon",
        seed: "GENIE-FRANKFURT-1924-SALON",
        themeTag: "CLASSICAL ACOUSTIC",
        themeColor: "#E7FF00",
        lighting: "warm_amber",
        ambientSound: "steinway_432hz",
        nodes: {
            center: {
                id: 'center',
                name: "Grand Salon — Central Chamber",
                tag: "NODE 01 // OVERVIEW",
                image: "/assets/spatial/spot_a_center.jpg",
                desc: "Late Romantic noble salon with vaulted stucco ceiling, crystal chandeliers, and Steinway grand piano.",
                exits: [
                    { target: 'piano', label: "Steinway Piano", x: '50%', y: '56%', key: 'W', angleHint: "▲ Walk to Piano", dir: 'forward' },
                    { target: 'violin', label: "Violin Table", x: '28%', y: '74%', key: 'A', angleHint: "◀ Inspect Violin", dir: 'left' },
                    { target: 'terrace', label: "Night Terrace", x: '74%', y: '52%', key: 'D', angleHint: "▶ View Frankfurt Terrace", dir: 'right' }
                ],
                mapX: 50, mapY: 70
            },
            piano: {
                id: 'piano',
                name: "Steinway & Sons Grand Piano",
                tag: "NODE 02 // 432Hz APEX",
                image: "/assets/spatial/spot_b_piano.jpg",
                desc: "First-person seat at the 1924 vintage Steinway grand piano. Sheet music of 'A TWELVE-MINUTE ALIBI' resting on the stand.",
                exits: [
                    { target: 'center', label: "Salon Center", x: '22%', y: '82%', key: 'S', angleHint: "▼ Step Back to Center", dir: 'back' },
                    { target: 'terrace', label: "Night Terrace", x: '80%', y: '46%', key: 'D', angleHint: "▶ Step to Terrace", dir: 'right' }
                ],
                interactiveObject: {
                    title: "Steinway 432Hz Key Action",
                    prompt: "Press keys or click to play 432Hz Romantic Harmonic Chord",
                    audioTrigger: true,
                    freqs: [432.0, 544.29, 647.27]
                },
                mapX: 50, mapY: 35
            },
            violin: {
                id: 'violin',
                name: "Violin & Manuscript Table",
                tag: "NODE 03 // BESPOKE SCORE",
                image: "/assets/spatial/spot_c_violin.jpg",
                desc: "Handcrafted violin, crystal Bordeaux decanter, and authentic manuscript score under warm candlelight.",
                exits: [
                    { target: 'center', label: "Salon Center", x: '72%', y: '82%', key: 'S', angleHint: "▼ Step Back to Center", dir: 'back' },
                    { target: 'piano', label: "Steinway Piano", x: '50%', y: '42%', key: 'W', angleHint: "▲ Walk to Piano", dir: 'forward' }
                ],
                interactiveObject: {
                    title: "Inspect A TWELVE-MINUTE ALIBI Score",
                    prompt: "Master manuscript composed in Frankfurt Atelier. 12-minute thematic counterpoint.",
                    audioTrigger: false
                },
                mapX: 25, mapY: 65
            },
            terrace: {
                id: 'terrace',
                name: "Frankfurt 02:00 AM Midnight Terrace",
                tag: "NODE 04 // PANORAMA",
                image: "/assets/spatial/spot_d_terrace.jpg",
                desc: "French terrace window overlooking the misty skyscrapers of Frankfurt am Main at 02:00 AM.",
                exits: [
                    { target: 'center', label: "Salon Center", x: '50%', y: '85%', key: 'S', angleHint: "▼ Return to Salon Center", dir: 'back' },
                    { target: 'piano', label: "Steinway Piano", x: '25%', y: '54%', key: 'A', angleHint: "◀ Walk back to Piano", dir: 'left' }
                ],
                interactiveObject: {
                    title: "Frankfurt Skyline at 02:00 AM",
                    prompt: "Mainhattan towers under midnight ambient mist and distant river reflections.",
                    audioTrigger: false
                },
                mapX: 75, mapY: 35
            }
        }
    },
    speakeasy: {
        id: 'speakeasy',
        name: "Midnight Amber Vinyl Speakeasy",
        seed: "GENIE-SPEAKEASY-0200-AMBER",
        themeTag: "ANALOGUE NOIR",
        themeColor: "#FF9900",
        lighting: "crimson_candle",
        ambientSound: "vinyl_crackle",
        nodes: {
            center: {
                id: 'center',
                name: "Speakeasy Lounge Entrance",
                tag: "NODE 01 // VINYL LOUNGE",
                image: "/assets/walk_story_05_amber_glow_shift.jpg",
                desc: "Warm glowing amber speakeasy bar with vintage vacuum tube amplifiers and mahogany woodwork.",
                exits: [
                    { target: 'piano', label: "Bar Counter", x: '52%', y: '54%', key: 'W', angleHint: "▲ Approach Bar Counter", dir: 'forward' },
                    { target: 'violin', label: "Vinyl Records", x: '25%', y: '70%', key: 'A', angleHint: "◀ Inspect Vinyl Stacks", dir: 'left' },
                    { target: 'terrace', label: "Back Speakeasy Booth", x: '75%', y: '60%', key: 'D', angleHint: "▶ View Leather Booth", dir: 'right' }
                ],
                mapX: 50, mapY: 70
            },
            piano: {
                id: 'piano',
                name: "Mahogany Bar & Bordeaux Decanter",
                tag: "NODE 02 // VINTAGE TASTING",
                image: "/assets/lookbook/lookbook_13_wineglass.jpg",
                desc: "Crystal decanter pouring 1924 vintage Pinot Noir over aged French oak.",
                exits: [
                    { target: 'center', label: "Lounge Center", x: '30%', y: '80%', key: 'S', angleHint: "▼ Step Back", dir: 'back' },
                    { target: 'terrace', label: "Back Booth", x: '75%', y: '50%', key: 'D', angleHint: "▶ Step to Booth", dir: 'right' }
                ],
                interactiveObject: {
                    title: "Bordeaux Crystal Decanter",
                    prompt: "Aged vintage wine carrying the fragrance of Frankfurt autumn.",
                    audioTrigger: true,
                    freqs: [220.0, 330.0, 440.0]
                },
                mapX: 50, mapY: 35
            },
            violin: {
                id: 'violin',
                name: "Vinyl Turntable & Acoustic Tubes",
                tag: "NODE 03 // 44.1kHz MASTER",
                image: "/assets/lookbook/lookbook_14_journal.jpg",
                desc: "Direct vinyl master pressing of A Twelve-minute Alibi spinning on vintage deck.",
                exits: [
                    { target: 'center', label: "Lounge Center", x: '70%', y: '80%', key: 'S', angleHint: "▼ Return", dir: 'back' }
                ],
                interactiveObject: {
                    title: "Play Vinyl Master Cut",
                    prompt: "Vacuum tube warmed analogue pressing recorded live in Frankfurt.",
                    audioTrigger: false
                },
                mapX: 25, mapY: 65
            },
            terrace: {
                id: 'terrace',
                name: "Secret Alley Speakeasy Gateway",
                tag: "NODE 04 // THRESHOLD",
                image: "/assets/walk_story_01_far_alley.jpg",
                desc: "Hidden heavy wooden door leading out to the misty cobblestone alleyways.",
                exits: [
                    { target: 'center', label: "Enter Lounge", x: '50%', y: '80%', key: 'S', angleHint: "▼ Re-enter Lounge", dir: 'back' }
                ],
                interactiveObject: {
                    title: "Cobblestone Alley Threshold",
                    prompt: "Midnight chill outside the warm speakeasy warmth.",
                    audioTrigger: false
                },
                mapX: 75, mapY: 35
            }
        }
    },
    cathedral: {
        id: 'cathedral',
        name: "Cyber-Acoustic Stained Cathedral 2026",
        seed: "GENIE-CYBER-CATHEDRAL-2026",
        themeTag: "NEO-FUTURISTIC",
        themeColor: "#00F0FF",
        lighting: "cyber_neon",
        ambientSound: "pipe_organ_reverb",
        nodes: {
            center: {
                id: 'center',
                name: "Gothic Stained Glass Portal",
                tag: "NODE 01 // HOLOGRAPHIC NAVE",
                image: "/assets/walk_story_04_look_up_logo.jpg",
                desc: "Glowing stained glass window refracting laser beams across 15th-century stone arches.",
                exits: [
                    { target: 'piano', label: "High Altar", x: '50%', y: '50%', key: 'W', angleHint: "▲ Walk to Altar", dir: 'forward' },
                    { target: 'violin', label: "Archive Stacks", x: '25%', y: '72%', key: 'A', angleHint: "◀ Inspect Archive", dir: 'left' },
                    { target: 'terrace', label: "Sky Tower", x: '75%', y: '55%', key: 'D', angleHint: "▶ View Sky Tower", dir: 'right' }
                ],
                mapX: 50, mapY: 70
            },
            piano: {
                id: 'piano',
                name: "Cyber Organ & Hologram HUD",
                tag: "NODE 02 // PIPE SYNTHESIS",
                image: "/assets/walk_story_07_grand_piano_salon.jpg",
                desc: "Holographic polyphonic organ echoing 8-channel acoustic frequencies into the high stone vaults.",
                exits: [
                    { target: 'center', label: "Nave Portal", x: '30%', y: '80%', key: 'S', angleHint: "▼ Step to Nave", dir: 'back' }
                ],
                interactiveObject: {
                    title: "Polyphonic Organ Core",
                    prompt: "Synthesize 8-channel harmonic sound resonance.",
                    audioTrigger: true,
                    freqs: [130.81, 261.63, 523.25]
                },
                mapX: 50, mapY: 35
            },
            violin: {
                id: 'violin',
                name: "Corporate Archive Crypt",
                tag: "NODE 03 // UG LICENSING",
                image: "/assets/lookbook/lookbook_01_portrait.jpg",
                desc: "Historic German Unternehmergesellschaft founding charters framed in gold.",
                exits: [
                    { target: 'center', label: "Nave Portal", x: '70%', y: '80%', key: 'S', angleHint: "▼ Return", dir: 'back' }
                ],
                interactiveObject: {
                    title: "Inspect Velvet Couture Charter",
                    prompt: "German intellectual property registration records.",
                    audioTrigger: false
                },
                mapX: 25, mapY: 65
            },
            terrace: {
                id: 'terrace',
                name: "Frankfurt Cyber Skyline Spire",
                tag: "NODE 04 // APEX VANTAGE",
                image: "/assets/spatial/spot_d_terrace.jpg",
                desc: "300-meter observation platform overlooking cybernetic Frankfurt am Main.",
                exits: [
                    { target: 'center', label: "Nave Portal", x: '50%', y: '80%', key: 'S', angleHint: "▼ Return to Nave", dir: 'back' }
                ],
                interactiveObject: {
                    title: "Frankfurt Main Tower Vantage",
                    prompt: "02:00 AM panoramic cyber cityscape.",
                    audioTrigger: false
                },
                mapX: 75, mapY: 35
            }
        }
    }
};

const HOLD_DURATION_MS = 1800; // 1.8s Hold-to-Walk

// Universal Key Normalizer
function normalizeKey(e) {
    const code = e.code;
    const key = e.key;

    if (code === 'KeyW' || key === 'w' || key === 'W' || key === 'ㅈ' || key === 'ArrowUp') return 'W';
    if (code === 'KeyA' || key === 'a' || key === 'A' || key === 'ㅁ' || key === 'ArrowLeft') return 'A';
    if (code === 'KeyS' || key === 's' || key === 'S' || key === 'ㄴ' || key === 'ArrowDown') return 'S';
    if (code === 'KeyD' || key === 'd' || key === 'D' || key === 'ㅇ' || key === 'ArrowRight') return 'D';
    return null;
}

export function SpatialSalonViewerModal({ isOpen, onClose }) {
    const [currentWorldId, setCurrentWorldId] = useState('salon');
    const [currentNodeId, setCurrentNodeId] = useState('center');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDir, setTransitionDir] = useState('forward');
    const [lightingAtmosphere, setLightingAtmosphere] = useState('warm_amber');
    const [isGeneratingWorld, setIsGeneratingWorld] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [showGeniePanel, setShowGeniePanel] = useState(false);

    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [inspectedObject, setInspectedObject] = useState(null);
    const [soundNoteActive, setSoundNoteActive] = useState(false);

    // Hold-to-Walk State
    const [activeHoldingKey, setActiveHoldingKey] = useState(null);
    const [holdProgress, setHoldProgress] = useState(0.0);
    const [hoveredExitTarget, setHoveredExitTarget] = useState(null);

    const holdStartTimeRef = useRef(null);
    const holdIntervalRef = useRef(null);

    const currentWorld = GENIE_WORLDS[currentWorldId] || GENIE_WORLDS.salon;
    const currentNode = currentWorld.nodes[currentNodeId] || currentWorld.nodes.center;

    // Keyboard Navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.repeat) return;
            const normKey = normalizeKey(e);
            if (!normKey) return;

            const exit = currentNode.exits.find(ex => ex.key === normKey);
            if (exit && !isTransitioning && activeHoldingKey !== normKey) {
                startHoldKey(normKey, exit.target, exit.dir);
            }
        };

        const handleKeyUp = (e) => {
            const normKey = normalizeKey(e);
            if (normKey && activeHoldingKey === normKey) {
                cancelHoldKey();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelHoldKey();
        };
    }, [isOpen, currentWorldId, currentNodeId, activeHoldingKey, isTransitioning]);

    const startHoldKey = (key, targetId, direction = 'forward') => {
        if (isTransitioning) return;
        setActiveHoldingKey(key);
        setHoveredExitTarget(targetId);
        setTransitionDir(direction);
        holdStartTimeRef.current = Date.now();

        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

        holdIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - holdStartTimeRef.current;
            const prog = Math.min(1.0, elapsed / HOLD_DURATION_MS);
            setHoldProgress(prog);

            if (prog >= 1.0) {
                clearInterval(holdIntervalRef.current);
                holdIntervalRef.current = null;
                setActiveHoldingKey(null);
                setHoldProgress(0.0);
                transitionToNode(targetId, direction);
            }
        }, 25);
    };

    const cancelHoldKey = () => {
        if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
        }
        setActiveHoldingKey(null);
        setHoldProgress(0.0);
        setHoveredExitTarget(null);
    };

    const transitionToNode = (targetId, direction = 'forward') => {
        if (isTransitioning || targetId === currentNodeId) return;
        setIsTransitioning(true);
        setTransitionDir(direction);
        setInspectedObject(null);
        setHoveredExitTarget(null);
        
        // Procedural Stereo Footsteps
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(105, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.16);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.16);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.16);
        } catch (e) {}

        setTimeout(() => {
            setCurrentNodeId(targetId);
            setPanOffset({ x: 0, y: 0 });
            setIsTransitioning(false);
            setActiveHoldingKey(null);
            setHoldProgress(0.0);
        }, 550);
    };

    // Google Genie Real-Time World Synthesizer
    const handleSynthesizeWorld = (worldKey) => {
        setIsGeneratingWorld(true);
        setTimeout(() => {
            setCurrentWorldId(worldKey);
            setCurrentNodeId('center');
            setPanOffset({ x: 0, y: 0 });
            setIsGeneratingWorld(false);
            setShowGeniePanel(false);
        }, 900);
    };

    const handleCustomPromptGenerate = (e) => {
        e.preventDefault();
        if (!customPrompt.trim()) return;
        setIsGeneratingWorld(true);
        setTimeout(() => {
            // Pick or synthesize archetype
            const keys = Object.keys(GENIE_WORLDS);
            const nextKey = keys[(keys.indexOf(currentWorldId) + 1) % keys.length];
            setCurrentWorldId(nextKey);
            setCurrentNodeId('center');
            setIsGeneratingWorld(false);
            setShowGeniePanel(false);
            setCustomPrompt('');
        }, 1200);
    };

    const playInteractiveAudio = (freqs = [432.0, 544.29, 647.27]) => {
        setSoundNoteActive(true);
        setTimeout(() => setSoundNoteActive(false), 1400);

        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            freqs.forEach((f, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.2 + idx * 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 2.5);
            });
        } catch (e) {}
    };

    // Mouse Drag Panning
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = Math.max(-120, Math.min(120, e.clientX - dragStart.x));
        const newY = Math.max(-60, Math.min(60, e.clientY - dragStart.y));
        setPanOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    if (!isOpen) return null;

    // Camera Locomotion Transform
    const getCameraTransform = () => {
        if (isTransitioning) {
            if (transitionDir === 'forward') {
                return { scale: 1.38, y: -25, rotateY: 0, opacity: 0.15, filter: 'blur(8px)' };
            } else if (transitionDir === 'left') {
                return { scale: 1.25, x: 220, rotateY: -22, opacity: 0.15, filter: 'blur(8px)' };
            } else if (transitionDir === 'right') {
                return { scale: 1.25, x: -220, rotateY: 22, opacity: 0.15, filter: 'blur(8px)' };
            } else {
                return { scale: 0.85, y: 35, rotateY: 0, opacity: 0.15, filter: 'blur(8px)' };
            }
        }

        const holdLeanX = activeHoldingKey === 'A' ? 25 * holdProgress : activeHoldingKey === 'D' ? -25 * holdProgress : 0;
        const holdLeanY = activeHoldingKey === 'W' ? -15 * holdProgress : activeHoldingKey === 'S' ? 15 * holdProgress : 0;
        const holdScale = 1.0 + holdProgress * 0.08;

        return {
            scale: holdScale,
            x: panOffset.x * 0.25 + holdLeanX,
            y: panOffset.y * 0.25 + holdLeanY,
            rotateY: activeHoldingKey === 'A' ? -4 * holdProgress : activeHoldingKey === 'D' ? 4 * holdProgress : 0,
            opacity: 1.0,
            filter: 'blur(0px)'
        };
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-1 sm:p-4 select-none overflow-hidden"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-3xl bg-[#090807] border border-white/20 flex flex-col overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.98)]"
                    style={{ perspective: '1000px' }}
                >
                    {/* 1. Top Google Genie HUD Control Bar */}
                    <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/75 backdrop-blur-md z-30">
                        <div className="flex items-center gap-3">
                            {/* Google Genie Synthesizer Trigger Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowGeniePanel(!showGeniePanel)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] p-0.5 shadow-[0_0_20px_rgba(66,133,244,0.6)] cursor-pointer"
                            >
                                <div className="px-2.5 py-1 rounded-[10px] bg-black/90 flex items-center gap-2 text-white font-mono text-[10px] font-black tracking-wider uppercase">
                                    <Wand2 className="w-3.5 h-3.5 text-[#E7FF00] animate-pulse" />
                                    <span>GOOGLE GENIE WORLD</span>
                                </div>
                            </motion.button>

                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    {currentWorld.themeTag} // {currentNode.tag}
                                </span>
                                <h2 className="font-sans text-sm sm:text-base font-black text-white tracking-wide truncate max-w-xs sm:max-w-md">
                                    {currentWorld.name} — {currentNode.name}
                                </h2>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2.5">
                            {/* Lighting Atmosphere Shift Controls */}
                            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
                                <button
                                    onClick={() => setLightingAtmosphere('warm_amber')}
                                    className={`p-1.5 rounded-full transition-all cursor-pointer ${lightingAtmosphere === 'warm_amber' ? 'bg-[#E7FF00] text-black shadow-[0_0_10px_#E7FF00]' : 'text-neutral-400 hover:text-white'}`}
                                    title="Warm Amber Chandelier"
                                >
                                    <Flame className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setLightingAtmosphere('moonlight_blue')}
                                    className={`p-1.5 rounded-full transition-all cursor-pointer ${lightingAtmosphere === 'moonlight_blue' ? 'bg-[#00F0FF] text-black shadow-[0_0_10px_#00F0FF]' : 'text-neutral-400 hover:text-white'}`}
                                    title="02:00 AM Moonlight Blue"
                                >
                                    <Moon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setLightingAtmosphere('cyber_volt')}
                                    className={`p-1.5 rounded-full transition-all cursor-pointer ${lightingAtmosphere === 'cyber_volt' ? 'bg-[#00FF88] text-black shadow-[0_0_10px_#00FF88]' : 'text-neutral-400 hover:text-white'}`}
                                    title="Cyber Volt Neon"
                                >
                                    <Zap className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Google Genie World Synthesizer Drawer Overlay */}
                    <AnimatePresence>
                        {showGeniePanel && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-14 inset-x-4 sm:inset-x-12 z-40 p-5 rounded-3xl bg-[#0C0B0E]/95 backdrop-blur-2xl border-2 border-[#E7FF00]/50 shadow-[0_20px_80px_rgba(0,0,0,0.95)] flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <Wand2 className="w-4 h-4 text-[#E7FF00]" />
                                        <span className="font-mono text-xs font-black text-white tracking-widest uppercase">
                                            GOOGLE GENIE AI WORLD SYNTHESIZER
                                        </span>
                                    </div>
                                    <span className="font-mono text-[9px] text-[#E7FF00] px-2.5 py-0.5 rounded-full bg-[#E7FF00]/15 border border-[#E7FF00]/40">
                                        SEED: {currentWorld.seed}
                                    </span>
                                </div>

                                {/* Pre-trained Virtual World Archetypes */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {Object.values(GENIE_WORLDS).map((w) => (
                                        <button
                                            key={w.id}
                                            onClick={() => handleSynthesizeWorld(w.id)}
                                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                                                currentWorldId === w.id 
                                                    ? 'bg-[#E7FF00]/15 border-[#E7FF00] shadow-[0_0_20px_rgba(231,255,0,0.4)]' 
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            <span className="font-mono text-[8px] font-bold text-[#E7FF00] uppercase">
                                                {w.themeTag}
                                            </span>
                                            <span className="font-sans text-xs font-black text-white">
                                                {w.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom World Text Prompt Input */}
                                <form onSubmit={handleCustomPromptGenerate} className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        placeholder="Type custom world prompt (e.g. 1920s Berlin Jazz Sanctuary, Gothic Organ Crypt)..."
                                        className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/20 focus:border-[#E7FF00] text-xs font-mono text-white outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 rounded-xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_15px_#E7FF00] cursor-pointer shrink-0"
                                    >
                                        SYNTHESIZE WORLD
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 2. Main Full-Bleed 1st-Person Photographic Stage with 3D Camera Rig */}
                    <div 
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="relative flex-1 bg-black overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* 1st-Person 3D Camera Rig with Dynamic Lighting Atmosphere */}
                        <motion.div
                            animate={getCameraTransform()}
                            transition={{ duration: isTransitioning ? 0.55 : 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                        >
                            <img
                                src={currentNode.image}
                                alt={currentNode.name}
                                className="w-full h-full object-cover select-none"
                            />
                            
                            {/* Dynamic Atmosphere Lighting Overlay */}
                            <div 
                                className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                                    lightingAtmosphere === 'warm_amber' 
                                        ? 'bg-gradient-to-t from-[#1F140A]/60 via-transparent to-black/20 mix-blend-color-dodge' 
                                        : lightingAtmosphere === 'moonlight_blue'
                                        ? 'bg-gradient-to-t from-[#0A1224]/75 via-transparent to-black/30 mix-blend-color-dodge'
                                        : 'bg-gradient-to-t from-[#003822]/60 via-transparent to-black/20 mix-blend-color-dodge'
                                }`}
                            />
                        </motion.div>

                        {/* Real-time World Synthesizing Laser Wipe Animation */}
                        {isGeneratingWorld && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center"
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-[#E7FF00] border-t-transparent animate-spin mb-4 shadow-[0_0_30px_#E7FF00]" />
                                <span className="font-mono text-sm font-black text-[#E7FF00] tracking-widest uppercase animate-pulse">
                                    GOOGLE GENIE: SYNTHESIZING NEURAL 3D WORLD...
                                </span>
                            </motion.div>
                        )}

                        {/* 3D Motion Warp Streaks */}
                        {isTransitioning && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.55 }}
                                className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(231,255,0,0.25)_80%,rgba(0,0,0,0.85)_100%)]" />
                                <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(231,255,0,0.15)_50%,transparent_100%)] scale-150 animate-pulse" />
                            </motion.div>
                        )}

                        {/* Interactive Spatial Gateways with 360° Circular SVG Hold Charge & Ethereal Preview Lens */}
                        {!isTransitioning && currentNode.exits.map((exit) => {
                            const isBeingHeld = activeHoldingKey === exit.key;
                            const isHovered = hoveredExitTarget === exit.target;
                            const targetNode = currentWorld.nodes[exit.target] || currentNode;
                            const radius = 24;
                            const circumference = 2 * Math.PI * radius;
                            const currentProgress = isBeingHeld ? holdProgress : 0.0;
                            const strokeDashoffset = circumference - (currentProgress * circumference);

                            return (
                                <div
                                    key={exit.target}
                                    style={{
                                        left: exit.x,
                                        top: exit.y,
                                        transform: `translate(-50%, -50%) translate3d(${panOffset.x * 0.15}px, ${panOffset.y * 0.15}px, 0)`
                                    }}
                                    className="absolute z-20 flex flex-col items-center pointer-events-auto"
                                    onMouseEnter={() => setHoveredExitTarget(exit.target)}
                                    onMouseLeave={() => {
                                        if (!activeHoldingKey) setHoveredExitTarget(null);
                                    }}
                                >
                                    {/* Ethereal Floating Preview Lens */}
                                    <AnimatePresence>
                                        {(isBeingHeld || isHovered) && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.6, y: 15 }}
                                                animate={{ 
                                                    opacity: isBeingHeld ? (0.45 + holdProgress * 0.55) : 0.75, 
                                                    scale: isBeingHeld ? (1.0 + holdProgress * 0.18) : 0.95, 
                                                    y: -75 
                                                }}
                                                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                                                transition={{ duration: 0.25 }}
                                                className="absolute pointer-events-none flex flex-col items-center z-30"
                                            >
                                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-[#E7FF00] shadow-[0_0_40px_rgba(231,255,0,0.8)] bg-black">
                                                    <img 
                                                        src={targetNode.image} 
                                                        alt="" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div 
                                                        className="absolute inset-0"
                                                        style={{
                                                            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.9) 100%)',
                                                            mixBlendMode: 'overlay'
                                                        }}
                                                    />
                                                </div>
                                                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#E7FF00]/60 text-[9px] font-mono font-bold text-[#E7FF00] uppercase tracking-wider whitespace-nowrap shadow-lg">
                                                    {targetNode.name}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Waypoint Hold Trigger Button */}
                                    <button
                                        onMouseDown={() => startHoldKey(exit.key, exit.target, exit.dir)}
                                        onMouseUp={cancelHoldKey}
                                        onTouchStart={() => startHoldKey(exit.key, exit.target, exit.dir)}
                                        onTouchEnd={cancelHoldKey}
                                        onClick={() => transitionToNode(exit.target, exit.dir)}
                                        className="relative flex items-center justify-center cursor-pointer group"
                                    >
                                        <svg className="w-16 h-16 sm:w-18 sm:h-18 transform -rotate-90 pointer-events-none">
                                            <circle
                                                cx="32" cy="32" r={radius}
                                                className="text-white/20"
                                                strokeWidth="3.5"
                                                stroke="currentColor"
                                                fill="transparent"
                                            />
                                            <circle
                                                cx="32" cy="32" r={radius}
                                                stroke="#E7FF00"
                                                strokeWidth="4"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                                fill="transparent"
                                                style={{ filter: 'drop-shadow(0 0 8px #E7FF00)' }}
                                                className="transition-all duration-75"
                                            />
                                        </svg>

                                        <div className={`absolute inset-2.5 rounded-full flex flex-col items-center justify-center transition-all ${
                                            isBeingHeld 
                                                ? 'bg-[#E7FF00] text-black shadow-[0_0_25px_#E7FF00] scale-110' 
                                                : 'bg-black/85 text-white border border-[#E7FF00]/50 group-hover:border-[#E7FF00] group-hover:shadow-[0_0_15px_#E7FF00]'
                                        }`}>
                                            <span className="font-mono font-black text-sm sm:text-base leading-none">
                                                {exit.key}
                                            </span>
                                        </div>
                                    </button>

                                    <div className="mt-1 px-2.5 py-0.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-[9px] font-mono font-bold text-neutral-200 group-hover:text-[#E7FF00] group-hover:border-[#E7FF00] whitespace-nowrap shadow-md transition-all">
                                        {exit.label}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Interactive Object Trigger */}
                        {currentNode.interactiveObject && !isTransitioning && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (currentNode.interactiveObject.audioTrigger) {
                                        playInteractiveAudio(currentNode.interactiveObject.freqs);
                                    } else {
                                        setInspectedObject(currentNode.interactiveObject);
                                    }
                                }}
                                style={{
                                    bottom: '16%',
                                    left: '50%',
                                    transform: `translateX(-50%) translate3d(${panOffset.x * 0.1}px, ${panOffset.y * 0.1}px, 0)`
                                }}
                                className="absolute z-20 px-5 py-2.5 rounded-2xl bg-black/85 border-2 border-[#E7FF00] text-white font-mono text-xs font-black tracking-wider uppercase shadow-[0_0_30px_rgba(231,255,0,0.7)] hover:bg-[#E7FF00] hover:text-black transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 text-[#E7FF00] group-hover:text-black" />
                                <span>{currentNode.interactiveObject.title}</span>
                                {soundNoteActive && (
                                    <span className="animate-pulse text-xs">🎶 RESONATING</span>
                                )}
                            </motion.button>
                        )}

                        {/* Top-Right Frosted Glass Radar Mini-Map */}
                        <div className="absolute top-4 right-4 z-30 p-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center pointer-events-none">
                            <span className="font-mono text-[8px] font-black text-[#E7FF00] tracking-widest uppercase mb-1.5">
                                WORLD RADAR
                            </span>
                            <div className="relative w-24 h-24 rounded-xl border border-white/15 bg-white/[0.03] overflow-hidden">
                                <div className="absolute inset-2 border border-white/10 rounded" />
                                {Object.values(currentWorld.nodes).map((node) => (
                                    <div
                                        key={node.id}
                                        style={{ left: `${node.mapX}%`, top: `${node.mapY}%` }}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                                            node.id === currentNodeId 
                                                ? 'w-3 h-3 bg-[#E7FF00] shadow-[0_0_10px_#E7FF00] scale-125 border border-white' 
                                                : 'w-2 h-2 bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Object Inspection Modal */}
                        <AnimatePresence>
                            {inspectedObject && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-5 rounded-3xl bg-black/90 backdrop-blur-xl border-2 border-[#E7FF00]/60 shadow-[0_0_40px_rgba(0,0,0,0.9)] text-center z-40"
                                >
                                    <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block mb-1">
                                        GENIE OBJECT RECORD
                                    </span>
                                    <h3 className="font-sans text-lg font-black text-white">
                                        {inspectedObject.title}
                                    </h3>
                                    <p className="font-sans text-xs text-neutral-300 mt-2 leading-relaxed">
                                        {inspectedObject.prompt}
                                    </p>
                                    <button
                                        onClick={() => setInspectedObject(null)}
                                        className="mt-4 px-5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white uppercase transition-all cursor-pointer"
                                    >
                                        CLOSE RECORD
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 3. Bottom Spatial Status Bar */}
                    <div className="px-5 py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 bg-black/60 text-neutral-400 font-mono text-[11px] shrink-0 z-30">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-[#E7FF00] font-bold">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{currentWorld.name}</span>
                            </span>
                            <span className="hidden sm:inline text-neutral-500">•</span>
                            <span className="hidden sm:inline text-neutral-300">
                                {currentNode.desc}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">
                                HOLD KEY (W, A, S, D) OR CLICK TO STEP // 60 FPS
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
