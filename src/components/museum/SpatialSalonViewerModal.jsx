import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Sparkles, MapPin, Music, ChevronLeft, ChevronRight, Flame, Moon, Zap, Volume2, Eye } from 'lucide-react';

const SALON_NODES = {
    center: {
        id: 'center',
        name: "Grand Salon — Central Chamber",
        tag: "01 // OVERVIEW",
        image: "/assets/spatial/spot_a_center.jpg",
        desc: "Late Romantic noble salon with crystal chandeliers, French oak woodwork, and 1924 Steinway grand piano.",
        exits: [
            { target: 'piano', label: "Steinway Piano", x: '50%', y: '56%', key: 'W', dir: 'forward' },
            { target: 'violin', label: "Violin Table", x: '26%', y: '74%', key: 'A', dir: 'left' },
            { target: 'terrace', label: "Night Terrace", x: '76%', y: '52%', key: 'D', dir: 'right' }
        ],
        mapX: 50, mapY: 70
    },
    piano: {
        id: 'piano',
        name: "Steinway & Sons Grand Piano",
        tag: "02 // 432Hz APEX",
        image: "/assets/spatial/spot_b_piano.jpg",
        desc: "Seat at the 1924 vintage Steinway Model O grand piano. Sheet music of 'A TWELVE-MINUTE ALIBI' resting on the stand.",
        exits: [
            { target: 'center', label: "Salon Center", x: '24%', y: '82%', key: 'S', dir: 'back' },
            { target: 'terrace', label: "Night Terrace", x: '78%', y: '48%', key: 'D', dir: 'right' }
        ],
        interactiveObject: {
            title: "Steinway 432Hz Key Action",
            prompt: "1924 Hamburg Steinway concert grand tuned to 432Hz natural harmonic resonance. Tap to play Romantic Triad Chord.",
            audioTrigger: true,
            freqs: [432.0, 544.29, 647.27]
        },
        mapX: 50, mapY: 35
    },
    violin: {
        id: 'violin',
        name: "Violin & Manuscript Table",
        tag: "03 // BESPOKE SCORE",
        image: "/assets/spatial/spot_c_violin.jpg",
        desc: "Handcrafted Italian violin, crystal Bordeaux decanter, and authentic manuscript score under warm candlelight.",
        exits: [
            { target: 'center', label: "Salon Center", x: '72%', y: '82%', key: 'S', dir: 'back' },
            { target: 'piano', label: "Steinway Piano", x: '50%', y: '42%', key: 'W', dir: 'forward' }
        ],
        interactiveObject: {
            title: "A TWELVE-MINUTE ALIBI Score",
            prompt: "Master manuscript score composed in Frankfurt Atelier. 12-minute thematic counterpoint in D minor.",
            audioTrigger: false
        },
        mapX: 25, mapY: 65
    },
    terrace: {
        id: 'terrace',
        name: "Frankfurt 02:00 AM Midnight Terrace",
        tag: "04 // PANORAMA",
        image: "/assets/spatial/spot_d_terrace.jpg",
        desc: "French terrace window overlooking the misty skyscrapers of Frankfurt am Main at 02:00 AM.",
        exits: [
            { target: 'center', label: "Salon Center", x: '50%', y: '85%', key: 'S', dir: 'back' },
            { target: 'piano', label: "Steinway Piano", x: '25%', y: '54%', key: 'A', dir: 'left' }
        ],
        interactiveObject: {
            title: "Frankfurt 02:00 AM Skyline",
            prompt: "Mainhattan towers under midnight ambient mist and distant river reflections.",
            audioTrigger: false
        },
        mapX: 75, mapY: 35
    }
};

const SPOT_LIST = [
    { id: 'center', label: '1. Center' },
    { id: 'piano', label: '2. Steinway' },
    { id: 'violin', label: '3. Violin' },
    { id: 'terrace', label: '4. Terrace' }
];

export function SpatialSalonViewerModal({ isOpen, onClose }) {
    const [currentNodeId, setCurrentNodeId] = useState('center');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [lightingAtmosphere, setLightingAtmosphere] = useState('warm_amber');
    const [inspectedObject, setInspectedObject] = useState(null);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);

    // Touch Swipe Navigation for Mobile
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);

    const isDraggingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });
    const audioCtxRef = useRef(null);

    const currentNode = SALON_NODES[currentNodeId] || SALON_NODES.center;

    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const playPianoChord = (freqs) => {
        try {
            const ctx = getAudioContext();
            setIsSoundPlaying(true);
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                gain.gain.setValueAtTime(0.001, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.3 / (idx + 1), ctx.currentTime + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 2.9);
            });

            setTimeout(() => setIsSoundPlaying(false), 3000);
        } catch (e) {
            console.log('Audio chord error:', e);
        }
    };

    const transitionToNode = (targetNodeId) => {
        if (targetNodeId === currentNodeId || isTransitioning) return;
        setIsTransitioning(true);
        setInspectedObject(null);
        setTimeout(() => {
            setCurrentNodeId(targetNodeId);
            setIsTransitioning(false);
            setPanOffset({ x: 0, y: 0 });
        }, 320);
    };

    // Mouse Pan Drag Handlers
    const handleMouseDown = (e) => {
        isDraggingRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };

        setPanOffset(prev => ({
            x: Math.max(-40, Math.min(40, prev.x + dx * 0.4)),
            y: Math.max(-25, Math.min(25, prev.y + dy * 0.4))
        }));
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
    };

    // Mobile Touch Handlers
    const onTouchStart = (e) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const diff = touchStartX - touchEndX;
        const spotKeys = Object.keys(SALON_NODES);
        const currentIdx = spotKeys.indexOf(currentNodeId);

        if (diff > 50) {
            // Swipe Left -> Next Spot
            const nextIdx = (currentIdx + 1) % spotKeys.length;
            transitionToNode(spotKeys[nextIdx]);
        } else if (diff < -50) {
            // Swipe Right -> Prev Spot
            const prevIdx = (currentIdx - 1 + spotKeys.length) % spotKeys.length;
            transitionToNode(spotKeys[prevIdx]);
        }
        setTouchStartX(0);
        setTouchEndX(0);
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
                    className="relative w-full max-w-6xl h-[94vh] sm:h-[90vh] rounded-3xl bg-[#090807] border border-white/15 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.98)]"
                >
                    {/* 1. Haute Couture Top Header Bar */}
                    <div className="px-3 sm:px-6 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/85 backdrop-blur-md z-30">
                        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                            <span className="p-1 sm:p-1.5 rounded-lg bg-[#E7FF00]/15 text-[#E7FF00] shrink-0">
                                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase truncate">
                                    3D SPATIAL SALON // {currentNode.tag}
                                </span>
                                <h2 className="font-sans text-xs sm:text-base font-black text-white tracking-wide truncate">
                                    {currentNode.name}
                                </h2>
                            </div>
                        </div>

                        {/* Atmosphere Lights & Close Button */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                            <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
                                <button
                                    onClick={() => setLightingAtmosphere('warm_amber')}
                                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                        lightingAtmosphere === 'warm_amber' ? 'bg-[#E7FF00] text-black shadow-[0_0_10px_#E7FF00]' : 'text-neutral-400 hover:text-white'
                                    }`}
                                    title="Warm Amber Chandelier"
                                >
                                    <Flame className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setLightingAtmosphere('moonlight_blue')}
                                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                        lightingAtmosphere === 'moonlight_blue' ? 'bg-[#00F0FF] text-black shadow-[0_0_10px_#00F0FF]' : 'text-neutral-400 hover:text-white'
                                    }`}
                                    title="02:00 AM Moonlight Blue"
                                >
                                    <Moon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setLightingAtmosphere('cyber_volt')}
                                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                        lightingAtmosphere === 'cyber_volt' ? 'bg-[#00FF88] text-black shadow-[0_0_10px_#00FF88]' : 'text-neutral-400 hover:text-white'
                                    }`}
                                    title="Cyber Volt Neon"
                                >
                                    <Zap className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* 2. Main 1st-Person 3D Photographic Stage */}
                    <div 
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        className="relative flex-1 bg-black overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                        {/* 1st-Person Spatial Viewport */}
                        <motion.div
                            animate={{
                                scale: isTransitioning ? 1.08 : 1.0,
                                x: panOffset.x,
                                y: panOffset.y,
                                opacity: isTransitioning ? 0.35 : 1.0
                            }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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

                        {/* Interactive Waypoint Target Buttons */}
                        {!isTransitioning && currentNode.exits.map((exit) => (
                            <motion.div
                                key={exit.target}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    left: exit.x,
                                    top: exit.y,
                                    transform: `translate(-50%, -50%) translate3d(${panOffset.x * 0.2}px, ${panOffset.y * 0.2}px, 0)`
                                }}
                                className="absolute z-20 flex flex-col items-center pointer-events-auto"
                            >
                                <button
                                    onClick={() => transitionToNode(exit.target)}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 border-2 border-[#E7FF00] hover:bg-[#E7FF00] hover:text-black text-white flex flex-col items-center justify-center shadow-[0_0_20px_rgba(231,255,0,0.6)] cursor-pointer transition-all duration-200 group hover:scale-110"
                                >
                                    <span className="font-mono text-xs sm:text-sm font-black group-hover:text-black">
                                        {exit.key}
                                    </span>
                                </button>
                                <span className="mt-1 px-2 py-0.5 rounded-full bg-black/85 border border-white/20 text-[9px] font-mono font-bold text-neutral-200 uppercase tracking-wide whitespace-nowrap shadow-lg pointer-events-none">
                                    {exit.label}
                                </span>
                            </motion.div>
                        ))}

                        {/* Interactive Object Trigger (Piano Chord / Manuscript) */}
                        {currentNode.interactiveObject && !isTransitioning && (
                            <motion.button
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (currentNode.interactiveObject.audioTrigger) {
                                        playPianoChord(currentNode.interactiveObject.freqs);
                                    } else {
                                        setInspectedObject(currentNode.interactiveObject);
                                    }
                                }}
                                className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black/85 border border-[#E7FF00]/80 text-white font-mono text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-[0_0_25px_rgba(231,255,0,0.65)] hover:bg-[#E7FF00] hover:text-black transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-[#E7FF00] group-hover:text-black" />
                                <span>{currentNode.interactiveObject.title}</span>
                                {isSoundPlaying && (
                                    <span className="text-[10px] text-[#00FF88] animate-pulse">🎶 432Hz</span>
                                )}
                            </motion.button>
                        )}

                        {/* Top-Right Compact Frosted Radar Mini-Map */}
                        <div className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-xl flex flex-col items-center pointer-events-none">
                            <span className="font-mono text-[7.5px] font-black text-[#E7FF00] tracking-widest uppercase mb-1">
                                RADAR
                            </span>
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
                                {Object.values(SALON_NODES).map((node) => (
                                    <div
                                        key={node.id}
                                        style={{ left: `${node.mapX}%`, top: `${node.mapY}%` }}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                                            node.id === currentNodeId 
                                                ? 'w-2.5 h-2.5 bg-[#E7FF00] shadow-[0_0_8px_#E7FF00] scale-125 border border-white' 
                                                : 'w-1.5 h-1.5 bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Object Inspection Bottom Card */}
                        <AnimatePresence>
                            {inspectedObject && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md p-4 sm:p-5 rounded-2xl bg-black/95 backdrop-blur-2xl border border-[#E7FF00]/70 shadow-[0_0_50px_rgba(0,0,0,0.95)] text-center z-40"
                                >
                                    <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block mb-1">
                                        OBJECT ARCHIVE
                                    </span>
                                    <h3 className="font-sans text-base sm:text-lg font-black text-white">
                                        {inspectedObject.title}
                                    </h3>
                                    <p className="font-sans text-xs text-neutral-300 mt-2 leading-relaxed">
                                        {inspectedObject.prompt}
                                    </p>
                                    <button
                                        onClick={() => setInspectedObject(null)}
                                        className="mt-3.5 px-5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white uppercase transition-all cursor-pointer"
                                    >
                                        CLOSE RECORD
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 3. Bottom Spot Selector Tabs & Status */}
                    <div className="px-3 sm:px-6 py-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 bg-black/85 text-neutral-400 font-mono text-[11px] shrink-0 z-30">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
                            {SPOT_LIST.map((spot) => (
                                <button
                                    key={spot.id}
                                    onClick={() => transitionToNode(spot.id)}
                                    className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                                        currentNodeId === spot.id
                                            ? 'bg-[#E7FF00] text-black shadow-[0_0_12px_rgba(231,255,0,0.6)] font-black'
                                            : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {spot.label}
                                </button>
                            ))}
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-[10px]">
                            <span>SWIPE / TAP TO MOVE // 60 FPS</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
