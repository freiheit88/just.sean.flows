import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Sparkles, MapPin, Music, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, ShieldCheck, Crown } from 'lucide-react';

const SPATIAL_NODES = {
    center: {
        id: 'center',
        name: "Grand Salon — Central Chamber",
        tag: "NODE 01 // OVERVIEW",
        image: "/assets/spatial/spot_a_center.jpg",
        desc: "Late Romantic noble salon with vaulted stucco ceiling, crystal chandeliers, and Steinway grand piano.",
        exits: [
            { target: 'piano', label: "Steinway Piano", x: '50%', y: '56%', key: 'W', angleHint: "▲ Walk to Piano" },
            { target: 'violin', label: "Violin Table", x: '28%', y: '74%', key: 'A', angleHint: "◀ Inspect Violin" },
            { target: 'terrace', label: "Night Terrace", x: '74%', y: '52%', key: 'D', angleHint: "▶ View Frankfurt Terrace" }
        ],
        mapX: 50, mapY: 70
    },
    piano: {
        id: 'piano',
        name: "Steinway & Sons Grand Piano",
        tag: "NODE 02 // 432Hz ACOUSTIC APEX",
        image: "/assets/spatial/spot_b_piano.jpg",
        desc: "First-person seat at the 1924 vintage Steinway grand piano. Sheet music of 'A TWELVE-MINUTE ALIBI' resting on the stand.",
        exits: [
            { target: 'center', label: "Salon Center", x: '22%', y: '82%', key: 'S', angleHint: "▼ Step Back to Center" },
            { target: 'terrace', label: "Night Terrace", x: '80%', y: '46%', key: 'D', angleHint: "▶ Step to Terrace" }
        ],
        interactiveObject: {
            title: "Steinway Key Action",
            prompt: "Press keys or click to play 432Hz Romantic Chord",
            audioTrigger: true
        },
        mapX: 50, mapY: 35
    },
    violin: {
        id: 'violin',
        name: "Violin & Manuscript Table",
        tag: "NODE 03 // BESPOKE COMPOSITION",
        image: "/assets/spatial/spot_c_violin.jpg",
        desc: "Handcrafted violin, crystal Bordeaux decanter, and authentic manuscript score under warm candlelight.",
        exits: [
            { target: 'center', label: "Salon Center", x: '72%', y: '82%', key: 'S', angleHint: "▼ Step Back to Center" },
            { target: 'piano', label: "Steinway Piano", x: '50%', y: '42%', key: 'W', angleHint: "▲ Walk to Piano" }
        ],
        interactiveObject: {
            title: "Inspect A TWELVE-MINUTE ALIBI Score",
            prompt: "Master manuscript composed in Frankfurt Atelier",
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
            { target: 'center', label: "Salon Center", x: '50%', y: '85%', key: 'S', angleHint: "▼ Return to Salon Center" },
            { target: 'piano', label: "Steinway Piano", x: '25%', y: '54%', key: 'A', angleHint: "◀ Walk back to Piano" }
        ],
        interactiveObject: {
            title: "Frankfurt Skyline",
            prompt: "Mainhattan night towers under 02:00 AM ambient mist",
            audioTrigger: false
        },
        mapX: 75, mapY: 35
    }
};

const HOLD_DURATION_MS = 2400; // 2.4s Smooth Cinematic Hold-to-Walk

export function SpatialSalonViewerModal({ isOpen, onClose }) {
    const [currentNodeId, setCurrentNodeId] = useState('center');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [inspectedObject, setInspectedObject] = useState(null);
    const [soundNoteActive, setSoundNoteActive] = useState(false);

    // 3-Second Hold-to-Walk State & Progress
    const [activeHoldingKey, setActiveHoldingKey] = useState(null);
    const [holdProgress, setHoldProgress] = useState(0.0);
    const [hoveredExitTarget, setHoveredExitTarget] = useState(null);

    const holdStartTimeRef = useRef(null);
    const holdIntervalRef = useRef(null);

    const currentNode = SPATIAL_NODES[currentNodeId] || SPATIAL_NODES.center;

    // Keyboard Hold-to-Walk Navigation Engine
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.repeat) return; // Prevent OS repeat flickering
            const key = e.key.toUpperCase();
            const exit = currentNode.exits.find(ex => ex.key === key);
            if (exit && !isTransitioning && activeHoldingKey !== key) {
                startHoldKey(key, exit.target);
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toUpperCase();
            if (activeHoldingKey === key) {
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
    }, [isOpen, currentNodeId, activeHoldingKey, isTransitioning]);

    const startHoldKey = (key, targetId) => {
        if (isTransitioning) return;
        setActiveHoldingKey(key);
        setHoveredExitTarget(targetId);
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
                transitionToNode(targetId);
            }
        }, 30);
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

    const transitionToNode = (targetId) => {
        if (isTransitioning || targetId === currentNodeId) return;
        setIsTransitioning(true);
        setInspectedObject(null);
        setHoveredExitTarget(null);
        
        // Footstep Audio Simulation
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(85, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.24, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.18);
        } catch (e) {}

        setTimeout(() => {
            setCurrentNodeId(targetId);
            setPanOffset({ x: 0, y: 0 });
            setIsTransitioning(false);
            setActiveHoldingKey(null);
            setHoldProgress(0.0);
        }, 420);
    };

    const playPianoChord = () => {
        setSoundNoteActive(true);
        setTimeout(() => setSoundNoteActive(false), 1200);

        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const freqs = [432.0, 544.29, 647.27];
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
                    className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-3xl bg-[#090807] border border-white/20 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.98)]"
                >
                    {/* 1. Top HUD Control Bar */}
                    <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/60 backdrop-blur-md z-30">
                        <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-xl bg-[#E7FF00]/15 text-[#E7FF00] border border-[#E7FF00]/30 shadow-[0_0_10px_rgba(231,255,0,0.4)]">
                                <Compass className="w-4 h-4" />
                            </span>
                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    {currentNode.tag}
                                </span>
                                <h2 className="font-sans text-sm sm:text-base font-black text-white tracking-wide">
                                    {currentNode.name}
                                </h2>
                            </div>
                        </div>

                        {/* Hold Key / Button Indicator */}
                        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-neutral-300">
                            <span className="font-bold text-[#E7FF00]">HOLD KEY (W, A, S, D) OR BUTTON:</span>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-black">
                                {activeHoldingKey ? `${activeHoldingKey} (${Math.floor(holdProgress * 100)}%)` : "HOLD TO WALK"}
                            </span>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* 2. Main Full-Bleed 1st-Person Photographic Stage (Zero Black Bars) */}
                    <div 
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="relative flex-1 bg-black overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                        {/* 1st-Person Edge-to-Edge Image Stage */}
                        <motion.div
                            animate={{
                                scale: isTransitioning ? 1.1 : (1.0 + holdProgress * 0.04),
                                opacity: isTransitioning ? 0.25 : 1.0,
                                x: panOffset.x * 0.25,
                                y: panOffset.y * 0.25
                            }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                        >
                            <img
                                src={currentNode.image}
                                alt={currentNode.name}
                                className="w-full h-full object-cover select-none pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
                        </motion.div>

                        {/* Interactive Spatial Gateways with 360° Circular SVG Hold Charge & Ethereal Preview Lens */}
                        {!isTransitioning && currentNode.exits.map((exit) => {
                            const isBeingHeld = activeHoldingKey === exit.key;
                            const isHovered = hoveredExitTarget === exit.target;
                            const targetNode = SPATIAL_NODES[exit.target];
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
                                    {/* Ethereal Floating Holographic Room Preview Lens on Hold / Hover */}
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
                                                {/* Circular Refractive Preview Portal */}
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
                                                    <div className="absolute top-1 left-2 w-8 h-4 rounded-full bg-white/60 blur-[1px] transform -rotate-45" />
                                                </div>
                                                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#E7FF00]/60 text-[9px] font-mono font-bold text-[#E7FF00] uppercase tracking-wider whitespace-nowrap shadow-lg">
                                                    {targetNode.name}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Waypoint Hold Trigger Button with 360° Circular SVG Progress Ring */}
                                    <button
                                        onMouseDown={() => startHoldKey(exit.key, exit.target)}
                                        onMouseUp={cancelHoldKey}
                                        onTouchStart={() => startHoldKey(exit.key, exit.target)}
                                        onTouchEnd={cancelHoldKey}
                                        className="relative flex items-center justify-center cursor-pointer group"
                                    >
                                        {/* Circular Radial SVG Charge Progress (0 to 360 deg) */}
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

                                        {/* Inner Center Key Button */}
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

                        {/* Interactive Object Trigger at Piano */}
                        {currentNode.interactiveObject && !isTransitioning && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (currentNode.interactiveObject.audioTrigger) {
                                        playPianoChord();
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
                                    <span className="animate-pulse text-xs">🎶 432Hz CHORD</span>
                                )}
                            </motion.button>
                        )}

                        {/* Top-Right Frosted Glass Radar Mini-Map */}
                        <div className="absolute top-4 right-4 z-30 p-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center pointer-events-none">
                            <span className="font-mono text-[8px] font-black text-[#E7FF00] tracking-widest uppercase mb-1.5">
                                SALON RADAR
                            </span>
                            <div className="relative w-24 h-24 rounded-xl border border-white/15 bg-white/[0.03] overflow-hidden">
                                <div className="absolute inset-2 border border-white/10 rounded" />
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-3 border border-[#E7FF00]/40 rounded-t" />

                                {Object.values(SPATIAL_NODES).map((node) => (
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
                                        OBJECT RECORD
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
                                        CLOSE INSPECTION
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
                                <span>{currentNode.name}</span>
                            </span>
                            <span className="hidden sm:inline text-neutral-500">•</span>
                            <span className="hidden sm:inline text-neutral-300">
                                {currentNode.desc}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">
                                HOLD KEY (W, A, S, D) OR BUTTON TO STEP // 60 FPS
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
