import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Footprints, Crown } from 'lucide-react';

const WALK_ROUTE_NODES = [
    { idx: 0, label: "01. 심야 골목 진입", sub: "FAR ALLEY", x: 50, y: 88, tag: "02:00 AM PROLOGUE", emoji: "🌙" },
    { idx: 1, label: "02. 코너 턴 & 영상 퀘스트", sub: "VIDEO QUEST", x: 34, y: 74, tag: "ACTIVE QUEST", emoji: "📜" },
    { idx: 2, label: "03. 클럽 게이트 접근", sub: "GATE APPROACH", x: 50, y: 60, tag: "CLUB APPROACH", emoji: "🗝️" },
    { idx: 3, label: "04. Unternehmergesellschaft (법인)", sub: "CORP ARCHIVE", x: 66, y: 46, tag: "UG ARCHIVE", emoji: "🏢" },
    { idx: 4, label: "05. 앰버 조명 시프트", sub: "AMBER SHIFT", x: 50, y: 34, tag: "ACOUSTICS", emoji: "🍷" },
    { idx: 5, label: "06. 살롱 문 앞 (임박)", sub: "FINAL THRESHOLD", x: 50, y: 22, tag: "THRESHOLD", emoji: "⚡" },
    { idx: 6, label: "07. 골든 스타인웨이 살롱 (보스방)", sub: "BOSS SANCTUARY", x: 50, y: 10, tag: "👑 BOSS ROOM", emoji: "👑", isBoss: true }
];

export function WalkRadarMap({ activeFrameIdx = 0, isVisible = true }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!isVisible) return null;

    const currentNode = WALK_ROUTE_NODES[activeFrameIdx] || WALK_ROUTE_NODES[0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -10 }}
            animate={{ opacity: 1, scale: 1.0, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-12 sm:top-16 right-3 sm:right-6 z-40 select-none pointer-events-auto"
        >
            {/* 1:1 Translucent Frosted Glass Card Structure matching the Reference Design */}
            <div 
                className="relative rounded-[26px] bg-black/40 backdrop-blur-md border-2 border-[#C8A96E]/70 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(200,169,110,0.25)] p-3 sm:p-3.5 flex flex-col items-center overflow-hidden transition-all duration-300 w-40 sm:w-48 group"
            >
                {/* Top Subtle Specular Light Glint */}
                <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-t-[26px] pointer-events-none" />

                {/* 1. Header with Mini 3D Gold Wine Glass + Treble Clef Emblem & Collapse Toggle */}
                <div 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-between pb-2 border-b border-[#C8A96E]/30 cursor-pointer relative z-10"
                >
                    <div className="flex items-center gap-1.5">
                        {/* Mini Gold Emblem */}
                        <svg viewBox="0 0 100 130" className="w-4 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            <defs>
                                <linearGradient id="miniGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFF2B2" />
                                    <stop offset="50%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#C8A96E" />
                                </linearGradient>
                            </defs>
                            <path d="M 30 15 C 30 50, 70 50, 70 15 Z" fill="none" stroke="url(#miniGoldGrad)" strokeWidth="8" />
                            <path d="M 34 26 Q 50 38, 66 26 C 66 38, 34 38, 34 26 Z" fill="url(#miniGoldGrad)" />
                            <path d="M 50 46 C 32 62, 32 90, 52 90 C 66 90, 68 76, 56 70 C 44 64, 42 76, 49 80 M 50 30 L 50 105 C 50 118, 38 116, 40 108" fill="none" stroke="url(#miniGoldGrad)" strokeWidth="7" strokeLinecap="round" />
                        </svg>
                        <span className="font-mono text-[9px] font-black text-white tracking-[0.18em] uppercase">
                            WALK RADAR
                        </span>
                    </div>

                    <button className="text-neutral-300 hover:text-[#00FF88] transition-colors p-0.5">
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                </div>

                {/* Collapsible Radar Viewport */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full flex flex-col items-center pt-2.5 overflow-hidden relative z-10"
                        >
                            {/* 2. Middle Glowing Electric Neon-Green Pill Button (Matching Reference Card) */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 10px rgba(0,255,136,0.6)',
                                        '0 0 22px rgba(0,255,136,0.95)',
                                        '0 0 10px rgba(0,255,136,0.6)'
                                    ]
                                }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                                className="w-full py-1.5 px-2.5 rounded-full bg-black/60 border-2 border-[#00FF88] flex items-center justify-between mb-2.5"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Footprints className="w-3.5 h-3.5 text-[#00FF88]" />
                                    <span className="font-sans text-[10px] font-bold text-white tracking-tight">
                                        Step {activeFrameIdx + 1} / 7
                                    </span>
                                </div>
                                <span className="font-mono text-[8px] font-black text-[#00FF88] tracking-wider uppercase">
                                    {currentNode.isBoss ? "👑 BOSS" : "IN PROGRESS"}
                                </span>
                            </motion.div>

                            {/* 3. Translucent Frosted Blueprint Grid */}
                            <div className="relative w-full h-44 rounded-2xl border border-[#C8A96E]/30 bg-white/[0.03] overflow-hidden flex items-center justify-center shadow-inner">
                                {/* Dotted & Line Grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
                                
                                {/* Boss Room Gate Glow at Top */}
                                <div className="absolute top-0 inset-x-3 h-6 bg-gradient-to-b from-[#00FF88]/20 to-transparent rounded-t-xl border-t border-[#00FF88]/40 pointer-events-none" />

                                {/* Ambient Warm Glow behind active beacon */}
                                <div 
                                    className="absolute w-16 h-16 rounded-full bg-[#00FF88]/20 filter blur-lg pointer-events-none transition-all duration-700"
                                    style={{
                                        left: `${currentNode.x}%`,
                                        top: `${currentNode.y}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />

                                {/* Connecting Route Path Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {/* Dotted Trail */}
                                    <path
                                        d="M 50% 88% L 34% 74% L 50% 60% L 66% 46% L 50% 34% L 50% 22% L 50% 10%"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="1.6"
                                        strokeDasharray="3 3"
                                    />
                                    {/* Neon-Green Lit Active Route Trail */}
                                    <path
                                        d="M 50% 88% L 34% 74% L 50% 60% L 66% 46% L 50% 34% L 50% 22% L 50% 10%"
                                        fill="none"
                                        stroke="#00FF88"
                                        strokeWidth="2.4"
                                        strokeDasharray="1000"
                                        strokeDashoffset={1000 - (activeFrameIdx / 6) * 1000}
                                        style={{ filter: 'drop-shadow(0 0 6px #00FF88)' }}
                                        className="transition-all duration-700"
                                    />
                                </svg>

                                {/* Route Nodes */}
                                {WALK_ROUTE_NODES.map((node) => {
                                    const isCurrent = node.idx === activeFrameIdx;
                                    const isPassed = node.idx < activeFrameIdx;
                                    const isBossRoom = node.isBoss;

                                    return (
                                        <div
                                            key={node.idx}
                                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center"
                                        >
                                            {/* Dynamic Pulsing Beacon Ring */}
                                            {isCurrent && (
                                                <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-[#00FF88] opacity-80 pointer-events-none" />
                                            )}

                                            {/* Node Marker */}
                                            {isBossRoom ? (
                                                <div className={`p-0.5 rounded-lg flex items-center justify-center transition-all duration-500 shadow-md ${
                                                    isCurrent 
                                                        ? 'bg-[#00FF88] text-black shadow-[0_0_15px_#00FF88] scale-125 border border-white' 
                                                        : 'bg-black/80 text-[#C8A96E] border border-[#C8A96E]/60'
                                                }`}>
                                                    <span className="text-[10px]">👑</span>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                                        isCurrent
                                                            ? 'w-4 h-4 bg-[#00FF88] shadow-[0_0_12px_#00FF88] scale-125 border border-white text-[8px]'
                                                            : isPassed
                                                            ? 'w-2.5 h-2.5 bg-[#C8A96E] border border-white/50 shadow-[0_0_4px_rgba(200,169,110,0.6)]'
                                                            : 'w-2 h-2 bg-white/25 border border-white/10'
                                                    }`}
                                                >
                                                    {isCurrent ? node.emoji : null}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 4. Bottom Location Metadata Info */}
                            <div className="mt-2 w-full text-center">
                                <span className={`font-mono text-[8px] font-black tracking-widest uppercase block ${
                                    currentNode.isBoss ? 'text-[#FF0055] animate-pulse' : 'text-[#00FF88]'
                                }`}>
                                    {currentNode.tag}
                                </span>
                                <span className="font-sans text-[11px] font-bold text-white block truncate mt-0.5">
                                    {currentNode.label}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
