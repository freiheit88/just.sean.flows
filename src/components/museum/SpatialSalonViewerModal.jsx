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

export function SpatialSalonViewerModal({ isOpen, onClose }) {
    const [currentNodeId, setCurrentNodeId] = useState('center');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [inspectedObject, setInspectedObject] = useState(null);
    const [soundNoteActive, setSoundNoteActive] = useState(false);

    const currentNode = SPATIAL_NODES[currentNodeId] || SPATIAL_NODES.center;

    // Keyboard WASD Navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            const exit = currentNode.exits.find(ex => ex.key === key);
            if (exit) {
                transitionToNode(exit.target);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentNodeId]);

    const transitionToNode = (targetId) => {
        if (isTransitioning || targetId === currentNodeId) return;
        setIsTransitioning(true);
        setInspectedObject(null);
        
        // Footstep Audio Simulation
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(80, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
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
            // 432Hz Tuned A-Major Triad (A4: 432Hz, C#5: 544.29Hz, E5: 647.27Hz)
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

                        {/* WASD Keyboard Controller Indicator */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-neutral-300">
                            <span className="font-bold text-white">CONTROLS:</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#E7FF00] font-bold">W</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#E7FF00] font-bold">A</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#E7FF00] font-bold">S</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#E7FF00] font-bold">D</span>
                            <span>/ Drag to Look</span>
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
                        {/* 1st-Person Photographic Spatial Viewport with Camera Dolly & Parallax */}
                        <motion.div
                            animate={{
                                scale: isTransitioning ? 1.15 : 1.05,
                                opacity: isTransitioning ? 0.2 : 1,
                                x: panOffset.x * 0.4,
                                y: panOffset.y * 0.4
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img
                                src={currentNode.image}
                                alt={currentNode.name}
                                className="w-full h-full object-cover select-none pointer-events-none"
                            />
                            {/* Realistic Ambient Lighting Tint */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                        </motion.div>

                        {/* Interactive Spatial Exit Gateways (Floating Waypoints in 3D Space) */}
                        {!isTransitioning && currentNode.exits.map((exit) => (
                            <motion.button
                                key={exit.target}
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => transitionToNode(exit.target)}
                                style={{
                                    left: exit.x,
                                    top: exit.y,
                                    transform: `translate(-50%, -50%) translate3d(${panOffset.x * 0.2}px, ${panOffset.y * 0.2}px, 0)`
                                }}
                                className="absolute group z-20 flex flex-col items-center cursor-pointer pointer-events-auto"
                            >
                                <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7FF00] opacity-50"></span>
                                    <span className="relative inline-flex rounded-2xl h-8 w-8 sm:h-9 sm:w-9 bg-black/85 border-2 border-[#E7FF00] items-center justify-center shadow-[0_0_25px_#E7FF00] group-hover:scale-110 group-hover:bg-[#E7FF00] group-hover:text-black transition-all">
                                        <ArrowUp className="w-4 h-4 text-[#E7FF00] group-hover:text-black transition-colors" />
                                    </span>
                                </span>

                                <div className="mt-1.5 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono font-bold text-white whitespace-nowrap group-hover:border-[#E7FF00] group-hover:text-[#E7FF00] shadow-lg transition-all flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-[#E7FF00] font-black">{exit.key}</span>
                                    <span>{exit.label}</span>
                                </div>
                            </motion.button>
                        ))}

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
                                {/* Floor Plan Outline */}
                                <div className="absolute inset-2 border border-white/10 rounded" />
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-4 border border-[#E7FF00]/40 rounded-t" />

                                {/* Node Indicators */}
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

                    {/* 3. Bottom Spatial Status Bar & Mobile Directional Pad */}
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

                        {/* Mobile Touch Navigation Pad */}
                        <div className="flex sm:hidden items-center gap-2">
                            {currentNode.exits.map((exit) => (
                                <button
                                    key={exit.target}
                                    onClick={() => transitionToNode(exit.target)}
                                    className="px-3 py-1 rounded-lg bg-[#E7FF00]/20 border border-[#E7FF00] text-[#E7FF00] font-mono text-xs font-black"
                                >
                                    {exit.key}: {exit.target}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
