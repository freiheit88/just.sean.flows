import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Sparkles, MapPin, Music, Volume2, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, ShieldCheck } from 'lucide-react';

const SPATIAL_NODES = {
    center: {
        id: 'center',
        name: "Grand Salon — Central Chamber",
        tag: "NODE 01 // OVERVIEW",
        image: "/assets/spatial/spot_a_center.jpg",
        desc: "Late Romantic noble salon with vaulted stucco ceiling, crystal chandeliers, and Steinway grand piano.",
        exits: [
            { target: 'piano', label: "Walk to Steinway Piano", x: '49%', y: '58%', key: 'W' },
            { target: 'violin', label: "Examine Violin Table", x: '24%', y: '78%', key: 'A' },
            { target: 'terrace', label: "Step toward Night Terrace", x: '76%', y: '50%', key: 'D' }
        ],
        mapX: 50, mapY: 70, mapAngle: 0
    },
    piano: {
        id: 'piano',
        name: "Steinway & Sons Grand Piano",
        tag: "NODE 02 // 432Hz ACOUSTIC APEX",
        image: "/assets/spatial/spot_b_piano.jpg",
        desc: "First-person seat at the 1924 vintage Steinway grand piano. Sheet music of 'A TWELVE-MINUTE ALIBI' resting on the stand.",
        exits: [
            { target: 'center', label: "Step Back to Center", x: '18%', y: '85%', key: 'S' },
            { target: 'terrace', label: "Look out toward Terrace", x: '82%', y: '45%', key: 'D' }
        ],
        interactiveObject: {
            title: "Steinway Key Action",
            prompt: "Press keys or click to play 432Hz Romantic Chord",
            audioTrigger: true
        },
        mapX: 50, mapY: 35, mapAngle: 0
    },
    violin: {
        id: 'violin',
        name: "Violin & Manuscript Table",
        tag: "NODE 03 // BESPOKE COMPOSITION",
        image: "/assets/spatial/spot_c_violin.jpg",
        desc: "Handcrafted violin, crystal Bordeaux decanter, and authentic manuscript score under warm candlelight.",
        exits: [
            { target: 'center', label: "Step Back to Center", x: '75%', y: '85%', key: 'S' },
            { target: 'piano', label: "Walk over to Piano", x: '52%', y: '42%', key: 'W' }
        ],
        interactiveObject: {
            title: "Inspect A TWELVE-MINUTE ALIBI Score",
            prompt: "Master manuscript composed in Frankfurt Atelier",
            audioTrigger: false
        },
        mapX: 25, mapY: 65, mapAngle: 45
    },
    terrace: {
        id: 'terrace',
        name: "Frankfurt 02:00 AM Midnight Terrace",
        tag: "NODE 04 // PANORAMA",
        image: "/assets/spatial/spot_d_terrace.jpg",
        desc: "French terrace window overlooking the misty skyscrapers of Frankfurt am Main at 02:00 AM.",
        exits: [
            { target: 'center', label: "Return into Salon", x: '50%', y: '88%', key: 'S' },
            { target: 'piano', label: "Walk back to Piano", x: '22%', y: '55%', key: 'A' }
        ],
        interactiveObject: {
            title: "Frankfurt Skyline",
            prompt: "Mainhattan night towers under 02:00 AM ambient mist",
            audioTrigger: false
        },
        mapX: 75, mapY: 35, mapAngle: -45
    }
};

const HOLD_DURATION_MS = 3000; // 3.0 Seconds Hold-to-Walk

export function SpatialSalonViewerModal({ isOpen, onClose }) {
    const [currentNodeId, setCurrentNodeId] = useState('center');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [inspectedObject, setInspectedObject] = useState(null);
    const [soundNoteActive, setSoundNoteActive] = useState(false);

    // 3-Second Hold-to-Walk State
    const [activeHoldingKey, setActiveHoldingKey] = useState(null);
    const [holdProgress, setHoldProgress] = useState(0.0);
    const [hoveredExitTarget, setHoveredExitTarget] = useState(null);

    const holdStartTimeRef = useRef(null);
    const holdIntervalRef = useRef(null);

    const currentNode = SPATIAL_NODES[currentNodeId] || SPATIAL_NODES.center;

    // Keyboard 3-Second Hold Navigation Engine
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.repeat) return; // Ignore browser auto-repeat
            const key = e.key.toUpperCase();
            const exit = currentNode.exits.find(ex => ex.key === key);
            if (exit && !isTransitioning) {
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
        
        // Footstep Reverb Synthesis
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(90, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
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
        }, 400);
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

    // Mouse drag pan handlers
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

    // Active preview node data for the held direction
    const activePreviewNode = hoveredExitTarget ? SPATIAL_NODES[hoveredExitTarget] : null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-1 sm:p-5 select-none overflow-hidden"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-6xl h-[94vh] sm:h-[90vh] rounded-3xl bg-[#080706] border border-white/20 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.98)]"
                >
                    {/* 1. Top HUD Control Bar */}
                    <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/60 backdrop-blur-md z-30">
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

                        {/* Hold Key Indicator HUD */}
                        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-neutral-300">
                            <span className="font-bold text-white">HOLD KEY 3 SECONDS:</span>
                            {['W', 'A', 'S', 'D'].map((k) => (
                                <span 
                                    key={k}
                                    className={`px-2 py-0.5 rounded font-black transition-all ${
                                        activeHoldingKey === k 
                                            ? 'bg-[#E7FF00] text-black shadow-[0_0_10px_#E7FF00] scale-110' 
                                            : 'bg-white/10 text-neutral-400'
                                    }`}
                                >
                                    {k}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* 2. Main 1st-Person 3D Spatial Canvas Viewport */}
                    <div 
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="relative flex-1 bg-black overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                        {/* 1st-Person Camera with Smooth Lean when Holding Key */}
                        <motion.div
                            animate={{
                                scale: isTransitioning ? 1.18 : (1.05 + holdProgress * 0.05),
                                opacity: isTransitioning ? 0.2 : 1,
                                x: panOffset.x * 0.4,
                                y: panOffset.y * 0.4
                            }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img
                                src={currentNode.image}
                                alt={currentNode.name}
                                className="w-full h-full object-cover select-none pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                        </motion.div>

                        {/* Interactive Spatial Exit Gateways with 3s Radial Progress & Ethereal Mirage Preview */}
                        {!isTransitioning && currentNode.exits.map((exit) => {
                            const isBeingHeld = activeHoldingKey === exit.key;
                            const isHovered = hoveredExitTarget === exit.target;
                            const targetNode = SPATIAL_NODES[exit.target];

                            return (
                                <div
                                    key={exit.target}
                                    style={{
                                        left: exit.x,
                                        top: exit.y,
                                        transform: `translate(-50%, -50%) translate3d(${panOffset.x * 0.2}px, ${panOffset.y * 0.2}px, 0)`
                                    }}
                                    className="absolute z-20 flex flex-col items-center pointer-events-auto"
                                    onMouseEnter={() => setHoveredExitTarget(exit.target)}
                                    onMouseLeave={() => {
                                        if (!activeHoldingKey) setHoveredExitTarget(null);
                                    }}
                                >
                                    {/* Ethereal Floating Holographic Room Preview Lens (No text, pure visual mirage) */}
                                    <AnimatePresence>
                                        {(isBeingHeld || isHovered) && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.6, y: 15 }}
                                                animate={{ 
                                                    opacity: isBeingHeld ? (0.4 + holdProgress * 0.55) : 0.65, 
                                                    scale: isBeingHeld ? (1.0 + holdProgress * 0.15) : 0.9, 
                                                    y: -65 
                                                }}
                                                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                                                transition={{ duration: 0.25 }}
                                                className="absolute pointer-events-none flex flex-col items-center"
                                            >
                                                {/* Circular Refractive Preview Portal */}
                                                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#E7FF00] shadow-[0_0_35px_rgba(231,255,0,0.6)] bg-black/80">
                                                    <img 
                                                        src={targetNode.image} 
                                                        alt="" 
                                                        className="w-full h-full object-cover transform scale-110"
                                                    />
                                                    {/* Spherical Glint & Gradient Mask */}
                                                    <div 
                                                        className="absolute inset-0"
                                                        style={{
                                                            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.9) 100%)',
                                                            mixBlendMode: 'overlay'
                                                        }}
                                                    />
                                                    <div className="absolute top-1 left-2 w-8 h-4 rounded-full bg-white/60 blur-[1px] transform -rotate-45" />
                                                </div>
                                                {/* Ambient Beacon Pulse beneath the orb */}
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#E7FF00] mt-1.5 shadow-[0_0_8px_#E7FF00] animate-ping" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Waypoint Action Trigger Button with 360° Circular SVG Progress Ring */}
                                    <button
                                        onMouseDown={() => startHoldKey(exit.key, exit.target)}
                                        onMouseUp={cancelHoldKey}
                                        onTouchStart={() => startHoldKey(exit.key, exit.target)}
                                        onTouchEnd={cancelHoldKey}
                                        className="relative flex items-center justify-center cursor-pointer group"
                                    >
                                        {/* Circular Radial SVG Charge Progress (0 to 360 deg) */}
                                        <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90 pointer-events-none">
                                            <circle
                                                cx="30" cy="30" r="24"
                                                className="text-white/15"
                                                strokeWidth="3.5"
                                                stroke="currentColor"
                                                fill="transparent"
                                            />
                                            {isBeingHeld && (
                                                <circle
                                                    cx="30" cy="30" r="24"
                                                    className="text-[#E7FF00]"
                                                    strokeWidth="4"
                                                    strokeDasharray={150}
                                                    strokeDashoffset={150 * (1 - holdProgress)}
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    style={{ filter: 'drop-shadow(0 0 8px #E7FF00)' }}
                                                />
                                            )}
                                        </svg>

                                        {/* Center Key Icon */}
                                        <div className={`absolute w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
                                            isBeingHeld 
                                                ? 'bg-[#E7FF00] text-black border-white scale-110 shadow-[0_0_20px_#E7FF00]' 
                                                : 'bg-black/85 text-white border-[#E7FF00]/70 group-hover:border-[#E7FF00]'
                                        }`}>
                                            <span className="font-mono font-black text-sm sm:text-base">
                                                {exit.key}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}

                        {/* Interactive Object Trigger at Piano */}
                        {currentNode.interactiveObject && !isTransitioning && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => {
                                    if (currentNode.interactiveObject.audioTrigger) {
                                        playPianoChord();
                                    } else {
                                        setInspectedObject(currentNode.interactiveObject);
                                    }
                                }}
                                style={{
                                    bottom: '18%',
                                    left: '50%',
                                    transform: `translateX(-50%) translate3d(${panOffset.x * 0.15}px, ${panOffset.y * 0.15}px, 0)`
                                }}
                                className="absolute z-20 px-5 py-2.5 rounded-2xl bg-black/85 border-2 border-[#E7FF00] text-white font-mono text-xs font-black tracking-wider uppercase shadow-[0_0_30px_rgba(231,255,0,0.6)] hover:bg-[#E7FF00] hover:text-black hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 text-[#E7FF00] group-hover:text-black" />
                                <span>{currentNode.interactiveObject.title}</span>
                                {soundNoteActive && (
                                    <span className="animate-pulse text-xs">🎶 432Hz PLAYING</span>
                                )}
                            </motion.button>
                        )}

                        {/* Top-Right Architectural Radar Mini-Map */}
                        <div className="absolute top-4 right-4 z-30 p-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 shadow-2xl flex flex-col items-center pointer-events-none">
                            <span className="font-mono text-[8px] font-bold text-neutral-400 tracking-widest uppercase mb-1">
                                SALON RADAR MAP
                            </span>
                            <div className="relative w-24 h-24 rounded-xl border border-white/15 bg-white/[0.03] overflow-hidden">
                                <div className="absolute inset-2 border border-white/10 rounded" />
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-4 border border-[#E7FF00]/40 rounded-t" />

                                {Object.values(SPATIAL_NODES).map((node) => (
                                    <div
                                        key={node.id}
                                        style={{ left: `${node.mapX}%`, top: `${node.mapY}%` }}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-all ${
                                            node.id === currentNodeId 
                                                ? 'bg-[#E7FF00] shadow-[0_0_8px_#E7FF00] scale-125' 
                                                : 'bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Object Inspection Popup */}
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
                                HOLD 3s TO WALK // 60 FPS
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
