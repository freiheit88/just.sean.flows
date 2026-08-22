import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Sparkles, MapPin, Music } from 'lucide-react';

const SALON_HOTSPOTS = [
    { id: 'piano', label: "Steinway Grand Piano", x: '48%', y: '56%', desc: "1924 Vintage Steinway & Sons Grand Piano tuned to 432Hz." },
    { id: 'violin', label: "Violin & Sheet Music Table", x: '28%', y: '74%', desc: "Mastercrafted violin with handwritten score of A TWELVE-MINUTE ALIBI." },
    { id: 'decanter', label: "Crystal Wine Decanter", x: '21%', y: '68%', desc: "Artisanal hand-blown decanter with 18K gold treble clef stopper." },
    { id: 'arch', label: "Gothic Sanctuary Arch", x: '49%', y: '28%', desc: "Vaulted ceiling leading to the Frankfurt Atelier inner sanctum." }
];

export function SpatialSalonViewerModal({ isOpen, onClose }) {
    const [activeSpot, setActiveSpot] = useState(null);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-6 select-none overflow-hidden"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-3xl bg-[#080706] border border-white/20 flex flex-col overflow-hidden shadow-[0_0_90px_rgba(0,0,0,0.95)]"
                >
                    {/* Top Bar */}
                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/50 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
                            <span className="p-1.5 rounded-lg bg-[#E7FF00]/15 text-[#E7FF00]">
                                <Compass className="w-4 h-4" />
                            </span>
                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    STANDALONE OFFLINE SPATIAL NODE // 60 FPS
                                </span>
                                <h2 className="font-sans text-sm sm:text-base font-black text-white tracking-wide">
                                    Golden Steinway Salon — 1st-Person Spatial Chamber
                                </h2>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Interactive Viewport */}
                    <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                        <img
                            src="/assets/walk_story_07_grand_piano_salon.jpg"
                            alt="Golden Piano Salon"
                            className="w-full h-full object-cover select-none"
                        />

                        {/* Interactive Hotspots */}
                        {SALON_HOTSPOTS.map((spot) => (
                            <button
                                key={spot.id}
                                onClick={() => setActiveSpot(spot)}
                                style={{ left: spot.x, top: spot.y }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                            >
                                <span className="relative flex h-8 w-8 items-center justify-center">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7FF00] opacity-60"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-black border-2 border-[#E7FF00] items-center justify-center shadow-[0_0_15px_#E7FF00]">
                                        <Sparkles className="w-2.5 h-2.5 text-[#E7FF00]" />
                                    </span>
                                </span>
                                <span className="hidden sm:inline-block absolute top-9 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {spot.label}
                                </span>
                            </button>
                        ))}

                        {/* Active Hotspot Info Overlay */}
                        <AnimatePresence>
                            {activeSpot && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 rounded-2xl bg-black/85 backdrop-blur-lg border border-[#E7FF00]/40 shadow-2xl text-center z-30"
                                >
                                    <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block mb-1">
                                        OBJECT INSPECTION
                                    </span>
                                    <h3 className="font-sans text-base font-black text-white">
                                        {activeSpot.label}
                                    </h3>
                                    <p className="font-sans text-xs text-neutral-300 mt-1 leading-relaxed">
                                        {activeSpot.desc}
                                    </p>
                                    <button
                                        onClick={() => setActiveSpot(null)}
                                        className="mt-3 px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-white uppercase transition-all cursor-pointer"
                                    >
                                        DISMISS
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Navigation Hint Bar */}
                    <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between bg-black/60 text-neutral-400 font-mono text-[11px] shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[#E7FF00]">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>FRANKFURT ATELIER // MAIN SALON</span>
                            </span>
                            <span className="hidden sm:inline-block">•</span>
                            <span className="hidden sm:inline-block text-neutral-300">
                                100% OFFLINE CAPABLE (ZERO SERVER DEPENDENCY)
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">
                                432Hz ACOUSTICS
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
