import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, ChevronDown, ChevronUp, Sparkles, Navigation, Crown } from 'lucide-react';

const WALK_ROUTE_NODES = [
    { idx: 0, label: "01. 심야 골목 진입", sub: "FAR ALLEY", x: 50, y: 88, tag: "PROLOGUE", emoji: "🌙" },
    { idx: 1, label: "02. 코너 턴 (발걸음 퀘스트)", sub: "VIDEO QUEST", x: 34, y: 74, tag: "QUEST", emoji: "📜" },
    { idx: 2, label: "03. 클럽 게이트 접근", sub: "GATE APPROACH", x: 50, y: 60, tag: "APPROACH", emoji: "🗝️" },
    { idx: 3, label: "04. Unternehmergesellschaft (법인)", sub: "CORP ARCHIVE", x: 66, y: 46, tag: "UG ARCHIVE", emoji: "🏢" },
    { idx: 4, label: "05. 앰버 조명 시프트", sub: "AMBER SHIFT", x: 50, y: 34, tag: "ACOUSTICS", emoji: "🍷" },
    { idx: 5, label: "06. 살롱 문 앞 (결전 직전)", sub: "FINAL THRESHOLD", x: 50, y: 22, tag: "THRESHOLD", emoji: "⚡" },
    { idx: 6, label: "07. 골든 스타인웨이 살롱 (보스방)", sub: "BOSS SANCTUARY", x: 50, y: 10, tag: "👑 BOSS ROOM", emoji: "👑", isBoss: true }
];

export function WalkRadarMap({ activeFrameIdx = 0, isVisible = true }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!isVisible) return null;

    const currentNode = WALK_ROUTE_NODES[activeFrameIdx] || WALK_ROUTE_NODES[0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -10 }}
            animate={{ opacity: 1, scale: 1.0, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-14 sm:top-18 right-3 sm:right-6 z-40 select-none pointer-events-auto"
        >
            {/* Frosted Arched Glass Card Container Matching Alleyway Signboard */}
            <div className="relative rounded-t-[28px] rounded-b-2xl bg-black/40 backdrop-blur-2xl border border-white/20 hover:border-[#E7FF00]/50 shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-3.5 flex flex-col items-center overflow-hidden transition-all duration-300 w-36 sm:w-44 group">
                
                {/* Top Glass Specular Glint Reflection */}
                <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-t-[28px] pointer-events-none" />

                {/* Header with Arched Glass Title & Minimize Button */}
                <div 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-between pb-2 border-b border-white/15 cursor-pointer relative z-10"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7FF00] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E7FF00]"></span>
                        </span>
                        <span className="font-mono text-[9px] font-black text-white tracking-[0.2em] uppercase">
                            WALK RADAR
                        </span>
                    </div>

                    <button className="text-neutral-300 hover:text-[#E7FF00] transition-colors p-0.5">
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                </div>

                {/* Collapsible Blueprint Viewport */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full flex flex-col items-center pt-3 overflow-hidden relative z-10"
                        >
                            {/* Frosted Translucent Map Stage */}
                            <div className="relative w-full h-48 rounded-2xl border border-white/15 bg-white/[0.04] overflow-hidden flex items-center justify-center shadow-inner">
                                {/* Elegant Frosted Blueprint Grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
                                
                                {/* Epic Boss Room Gate Glowing Halo at Top Node */}
                                <div className="absolute top-1 inset-x-4 h-8 bg-gradient-to-b from-[#E7FF00]/25 to-transparent rounded-t-xl border-t border-[#E7FF00]/50 pointer-events-none filter blur-[2px]" />

                                {/* Ambient Warm Radial Light Behind Active Position */}
                                <div 
                                    className="absolute w-20 h-20 rounded-full bg-[#E7FF00]/20 filter blur-xl pointer-events-none transition-all duration-700"
                                    style={{
                                        left: `${currentNode.x}%`,
                                        top: `${currentNode.y}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />

                                {/* Connecting Route Path Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {/* Dotted Inactive Trail */}
                                    <path
                                        d="M 50% 88% L 34% 74% L 50% 60% L 66% 46% L 50% 34% L 50% 22% L 50% 10%"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="1.8"
                                        strokeDasharray="3 3"
                                    />
                                    {/* Golden Lit Active Trail */}
                                    <path
                                        d="M 50% 88% L 34% 74% L 50% 60% L 66% 46% L 50% 34% L 50% 22% L 50% 10%"
                                        fill="none"
                                        stroke="#E7FF00"
                                        strokeWidth="2.4"
                                        strokeDasharray="1000"
                                        strokeDashoffset={1000 - (activeFrameIdx / 6) * 1000}
                                        style={{ filter: 'drop-shadow(0 0 6px #E7FF00)' }}
                                        className="transition-all duration-700"
                                    />
                                </svg>

                                {/* Route Waypoint Nodes with Bespoke Themed Emojis */}
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
                                                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#E7FF00] opacity-75 pointer-events-none" />
                                            )}

                                            {/* Node Marker & Emoji Badge */}
                                            {isBossRoom ? (
                                                /* Boss Room Grand Crown Gate Marker */
                                                <div className={`p-1 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                                                    isCurrent 
                                                        ? 'bg-[#E7FF00] text-black shadow-[0_0_20px_#E7FF00] scale-125 border-2 border-white ring-2 ring-[#E7FF00]' 
                                                        : 'bg-black/80 text-[#E7FF00] border-2 border-[#E7FF00]/60 shadow-[0_0_10px_rgba(231,255,0,0.3)]'
                                                }`}>
                                                    <span className="text-xs">👑</span>
                                                </div>
                                            ) : (
                                                /* Regular / Themed Waypoint Dot with Emoji Hint */
                                                <div
                                                    className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                                                        isCurrent
                                                            ? 'w-5 h-5 bg-[#E7FF00] shadow-[0_0_15px_#E7FF00] scale-125 border-2 border-white text-[10px]'
                                                            : isPassed
                                                            ? 'w-3 h-3 bg-[#C8A96E] border border-white/50 shadow-[0_0_6px_rgba(200,169,110,0.6)]'
                                                            : 'w-2.5 h-2.5 bg-white/25 border border-white/10'
                                                    }`}
                                                >
                                                    {isCurrent ? node.emoji : null}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Location Legend Card matching option typography */}
                            <div className="mt-2.5 w-full text-center">
                                <span className={`font-mono text-[8px] font-black tracking-widest uppercase block ${
                                    currentNode.isBoss ? 'text-[#FF0055] animate-pulse drop-shadow-[0_0_8px_#FF0055]' : 'text-[#E7FF00]'
                                }`}>
                                    {currentNode.tag}
                                </span>
                                <span className="font-sans text-xs font-bold text-white block truncate mt-0.5">
                                    {currentNode.label}
                                </span>
                                <span className="font-mono text-[8px] text-neutral-300 block tracking-wider mt-0.5">
                                    STEP {activeFrameIdx + 1} / 7
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
