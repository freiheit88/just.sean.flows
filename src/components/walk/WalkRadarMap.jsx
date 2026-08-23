import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const WALK_ROUTE_NODES = [
    { idx: 0, label: "01. 심야 골목 진입", sub: "02:00 AM FAR ALLEY", x: 50, y: 88, tag: "PROLOGUE" },
    { idx: 1, label: "02. 코너 턴 & 발걸음", sub: "CORNER BRICK TURN", x: 32, y: 74, tag: "PULSE" },
    { idx: 2, label: "03. 클럽 게이트 접근", sub: "CLUB GATE APPROACH", x: 50, y: 60, tag: "APPROACH" },
    { idx: 3, label: "04. 스테인드글라스 아치", sub: "LOOK UP ARCH LOGO", x: 68, y: 46, tag: "HERITAGE" },
    { idx: 4, label: "05. 앰버 조명 시프트", sub: "AMBER GLOW SHIFT", x: 50, y: 34, tag: "ACOUSTICS" },
    { idx: 5, label: "06. 피아노 살롱 문 앞", sub: "SALON THRESHOLD", x: 50, y: 22, tag: "SANCTUARY" },
    { idx: 6, label: "07. 골든 스타인웨이 살롱", sub: "GRAND PIANO SALON", x: 50, y: 10, tag: "FINALE" }
];

export function WalkRadarMap({ activeFrameIdx = 0, isVisible = true }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!isVisible) return null;

    const currentNode = WALK_ROUTE_NODES[activeFrameIdx] || WALK_ROUTE_NODES[0];

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-16 sm:top-20 right-4 sm:right-6 z-40 select-none pointer-events-auto"
        >
            <div className="relative rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-[0_0_35px_rgba(0,0,0,0.85)] p-3 flex flex-col items-center overflow-hidden transition-all duration-300 w-36 sm:w-44">
                {/* Header with Collapse Toggle */}
                <div 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-between pb-2 border-b border-white/10 cursor-pointer"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#E7FF00] shadow-[0_0_8px_#E7FF00] animate-pulse" />
                        <span className="font-mono text-[9px] font-black text-white tracking-widest uppercase">
                            WALK RADAR
                        </span>
                    </div>

                    <button className="text-neutral-400 hover:text-white">
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
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col items-center pt-2.5 overflow-hidden"
                        >
                            {/* Blueprint Vector Map Canvas */}
                            <div className="relative w-full h-44 rounded-xl border border-white/15 bg-white/[0.02] overflow-hidden flex items-center justify-center">
                                {/* Grid Blueprint Background */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

                                {/* Connecting Route Path Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <path
                                        d="M 50% 88% L 32% 74% L 50% 60% L 68% 46% L 50% 34% L 50% 22% L 50% 10%"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.15)"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                    />
                                    {/* Active Lit Path up to activeFrameIdx */}
                                    <path
                                        d="M 50% 88% L 32% 74% L 50% 60% L 68% 46% L 50% 34% L 50% 22% L 50% 10%"
                                        fill="none"
                                        stroke="#E7FF00"
                                        strokeWidth="2.5"
                                        strokeDasharray="1000"
                                        strokeDashoffset={1000 - (activeFrameIdx / 6) * 1000}
                                        style={{ filter: 'drop-shadow(0 0 6px #E7FF00)' }}
                                        className="transition-all duration-700"
                                    />
                                </svg>

                                {/* Waypoint Nodes */}
                                {WALK_ROUTE_NODES.map((node) => {
                                    const isCurrent = node.idx === activeFrameIdx;
                                    const isPassed = node.idx < activeFrameIdx;

                                    return (
                                        <div
                                            key={node.idx}
                                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center group"
                                        >
                                            {/* Pulsing Beacon Ring on Active Node */}
                                            {isCurrent && (
                                                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#E7FF00] opacity-60 pointer-events-none" />
                                            )}

                                            {/* Node Marker Dot */}
                                            <div
                                                className={`rounded-full transition-all duration-300 ${
                                                    isCurrent
                                                        ? 'w-3.5 h-3.5 bg-[#E7FF00] shadow-[0_0_12px_#E7FF00] scale-125 border-2 border-white'
                                                        : isPassed
                                                        ? 'w-2.5 h-2.5 bg-[#C8A96E] border border-white/40'
                                                        : 'w-2 h-2 bg-white/20'
                                                }`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Active Location Legend */}
                            <div className="mt-2.5 w-full text-center">
                                <span className="font-mono text-[8px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    {currentNode.tag}
                                </span>
                                <span className="font-sans text-[11px] font-bold text-white block truncate">
                                    {currentNode.label}
                                </span>
                                <span className="font-mono text-[8px] text-neutral-400 block tracking-wider mt-0.5">
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
