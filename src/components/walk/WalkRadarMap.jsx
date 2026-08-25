import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, Crown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MapPin, Music, Sparkles, X } from 'lucide-react';
import { unlockTitle } from '../../constants/titles';

const WALK_ROUTE_NODES = [
    { 
        idx: 0, 
        step: "1", 
        label: "01. Midnight Alley Entry", 
        tag: "NORMAL FIELD", 
        badgeColor: "#C8A96E",
        displayType: "number",
        emoji: "🌙",
        loot: null
    },
    { 
        idx: 1, 
        step: "2", 
        label: "02. Cinematic Quest (Turn)", 
        tag: "MAP UNLOCKED", 
        badgeColor: "#00FF88",
        displayType: "emoji",
        emoji: "🗺️",
        loot: "Altstadt Ancient Map",
        hasMapLoot: true
    },
    { 
        idx: 2, 
        step: "3", 
        label: "03. Club Gate Approach", 
        tag: "NORMAL FIELD", 
        badgeColor: "#C8A96E",
        displayType: "number",
        emoji: "🗝️",
        loot: null
    },
    { 
        idx: 3, 
        step: "4", 
        label: "04. Unternehmergesellschaft", 
        tag: "UG ARCHIVE", 
        badgeColor: "#00E5FF",
        displayType: "emoji",
        emoji: "🏢",
        loot: "UG 2026 Archive",
        hasCompanyArchive: true
    },
    { 
        idx: 4, 
        step: "5", 
        label: "05. Amber Atelier Glow Shift", 
        tag: "NORMAL FIELD", 
        badgeColor: "#E5A93C",
        displayType: "number",
        emoji: "🏢",
        loot: "432Hz Resonance"
    },
    { 
        idx: 5, 
        step: "6", 
        label: "06. Salon Foyer Threshold", 
        tag: "SALON THRESHOLD", 
        badgeColor: "#FF6B8B",
        displayType: "emoji",
        emoji: "🏛️",
        loot: "18K Door Handle"
    },
    { 
        idx: 6, 
        step: "7", 
        label: "07. Golden Steinway Salon", 
        tag: "BOSS ROOM", 
        badgeColor: "#FFD700",
        displayType: "emoji",
        emoji: "👑",
        isBoss: true
    }
];

export function WalkRadarMap({ 
    activeFrameIdx = 0, 
    isVisible = true,
    goToStep,
    stepForward,
    stepBackward
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hasLootedMap, setHasLootedMap] = useState(false);
    const [isArchiveDismissed, setIsArchiveDismissed] = useState(false);

    const currentStep = Math.min(7, Math.max(1, activeFrameIdx + 1));
    const currentNode = WALK_ROUTE_NODES[activeFrameIdx] || WALK_ROUTE_NODES[0];
    const progressPercent = ((currentStep - 1) / 6) * 100;

    // Auto-open Archive strictly in Step 4
    useEffect(() => {
        setIsArchiveDismissed(false);
    }, [activeFrameIdx]);

    const showCompanyDrawer = activeFrameIdx === 3 && !isArchiveDismissed;

    // Step 2 Map Looting & Cartographer Title Trigger
    useEffect(() => {
        if (activeFrameIdx >= 1 && !hasLootedMap) {
            setHasLootedMap(true);
            if (typeof unlockTitle === 'function') {
                unlockTitle('altstadt_cartographer');
            }
        }
    }, [activeFrameIdx, hasLootedMap]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute top-12 sm:top-14 inset-x-3 sm:inset-x-4 z-40 select-none pointer-events-auto flex flex-col items-center"
        >
            {/* HORIZONTAL EXPANDABLE HUD CAPSULE DOCK */}
            <div className="w-full max-w-[375px] rounded-2xl bg-black/80 backdrop-blur-xl border border-[#C8A96E]/50 shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(200,169,110,0.2)] p-2.5 transition-all duration-300">
                
                {/* 1. Top Mini Stage Tracker Row with Prev/Next Navigation Buttons */}
                <div className="w-full flex items-center justify-between gap-1.5">
                    
                    {/* Previous Step Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (stepBackward) stepBackward();
                        }}
                        disabled={activeFrameIdx <= 0}
                        title="Previous Step"
                        className={`p-1 rounded-lg border transition-all ${
                            activeFrameIdx <= 0 
                                ? 'opacity-30 border-white/10 text-neutral-500 cursor-not-allowed' 
                                : 'border-[#C8A96E]/40 text-[#F0EAE0] hover:bg-[#C8A96E]/20 hover:border-[#FFD700] active:scale-95 cursor-pointer'
                        }`}
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                        <Footprints className="w-3 h-3 text-[#00FF88]" />
                        <span className="font-mono text-[9px] font-black text-white tracking-wider">
                            {currentStep}/7
                        </span>
                    </div>

                    {/* Horizontal 7-Stage Track (1, 3, 5 Numbers / 2, 4, 6, 7 Emojis) */}
                    <div className="relative flex-1 flex items-center justify-between px-1">
                        {/* Background Track Line */}
                        <div className="absolute inset-x-2 h-[2px] bg-white/15 rounded-full" />
                        
                        {/* Active Filled Progress Line */}
                        <motion.div 
                            className="absolute left-2 h-[2px] bg-gradient-to-r from-[#00FF88] via-[#FFD700] to-[#E7FF00] rounded-full shadow-[0_0_8px_#00FF88]"
                            initial={false}
                            animate={{ width: `${progressPercent * 0.94}%` }}
                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        />

                        {/* 7 Horizontal Clickable Step Nodes */}
                        {WALK_ROUTE_NODES.map((node, idx) => {
                            const isPassed = idx < activeFrameIdx;
                            const isCurrent = idx === activeFrameIdx;

                            return (
                                <button
                                    key={node.idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (goToStep) goToStep(idx);
                                    }}
                                    title={`Step ${idx + 1}: ${node.label}`}
                                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                                >
                                    <motion.div
                                        animate={{
                                            scale: isCurrent ? [1, 1.3, 1.15] : 1.0,
                                            backgroundColor: isCurrent ? '#00FF88' : isPassed ? '#FFD700' : '#1A181B',
                                            borderColor: isCurrent ? '#00FF88' : isPassed ? '#C8A96E' : 'rgba(255,255,255,0.25)',
                                            boxShadow: isCurrent 
                                                ? '0 0 12px #00FF88, 0 0 20px rgba(0,255,136,0.6)' 
                                                : isPassed 
                                                ? '0 0 8px rgba(255,215,0,0.5)' 
                                                : 'none'
                                        }}
                                        transition={{ duration: 0.2 }}
                                        className="w-[19px] h-[19px] rounded-full border flex items-center justify-center font-mono text-[8px] font-black text-black group-hover:scale-125 transition-transform"
                                    >
                                        {node.displayType === "number" ? (
                                            <span className={isCurrent || isPassed ? 'text-black' : 'text-neutral-400'}>
                                                {node.step}
                                            </span>
                                        ) : (
                                            <span className={`text-[8.5px] select-none leading-none ${isPassed || isCurrent ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                                {node.emoji}
                                            </span>
                                        )}
                                    </motion.div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Step Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (stepForward) stepForward();
                        }}
                        disabled={activeFrameIdx >= 6}
                        title="Next Step"
                        className={`p-1 rounded-lg border transition-all ${
                            activeFrameIdx >= 6 
                                ? 'opacity-30 border-white/10 text-neutral-500 cursor-not-allowed' 
                                : 'border-[#C8A96E]/40 text-[#F0EAE0] hover:bg-[#C8A96E]/20 hover:border-[#FFD700] active:scale-95 cursor-pointer'
                        }`}
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Collapse Toggle Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCollapsed(!isCollapsed);
                        }}
                        className="text-neutral-400 hover:text-white p-0.5 shrink-0 transition-colors cursor-pointer"
                    >
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                </div>

                {/* 2. Bottom Contextual Info Row */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="w-full flex items-center justify-between pt-1.5 mt-1.5 border-t border-white/10 overflow-hidden"
                        >
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-[11px]">{currentNode.emoji}</span>
                                <span className="font-sans text-[10px] font-bold text-[#F0EAE0] truncate tracking-tight">
                                    {currentNode.label}
                                </span>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (currentNode.hasCompanyArchive) {
                                        setIsArchiveDismissed(!isArchiveDismissed);
                                    }
                                }}
                                style={{ 
                                    color: currentNode.badgeColor,
                                    borderColor: `${currentNode.badgeColor}40`,
                                    backgroundColor: `${currentNode.badgeColor}15`
                                }}
                                className="font-mono text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 cursor-pointer hover:brightness-125 transition-all"
                            >
                                {currentNode.tag}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. ULTRA-COMPACT INTEGRATED UG CORPORATE HUD DRAWER (Appears in Step 4) */}
                <AnimatePresence>
                    {showCompanyDrawer && !isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -6 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -6 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="w-full mt-2 pt-2 border-t border-[#00E5FF]/30 bg-black/60 rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden shadow-inner border border-[#00E5FF]/20"
                        >
                            {/* Drawer Mini Header with Dismiss X */}
                            <div className="w-full flex items-center justify-between pb-1 border-b border-white/10">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                                    <span className="font-mono text-[8.5px] font-black text-[#00E5FF] tracking-wider uppercase">
                                        ATELIER HQ · UG (haftungsbeschränkt)
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsArchiveDismissed(true);
                                    }}
                                    className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>

                            {/* 3 Concise 1-Line Key Descriptors (Half-Size Layout) */}
                            <div className="grid grid-cols-1 gap-1 text-[9px] font-sans">
                                
                                {/* 01. LOCATION */}
                                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.04] border border-white/5">
                                    <div className="flex items-center gap-1.5 text-neutral-400">
                                        <MapPin className="w-3 h-3 text-[#00FF88] shrink-0" />
                                        <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-400">LOCATION</span>
                                    </div>
                                    <span className="font-semibold text-white truncate text-right">
                                        Frankfurt am Main, Hesse, DE
                                    </span>
                                </div>

                                {/* 02. SANCTUARY */}
                                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.04] border border-white/5">
                                    <div className="flex items-center gap-1.5 text-neutral-400">
                                        <Music className="w-3 h-3 text-[#00E5FF] shrink-0" />
                                        <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-400">PROFILE</span>
                                    </div>
                                    <span className="font-semibold text-[#00E5FF] truncate text-right">
                                        Acoustic Modular Salon & Orchestra
                                    </span>
                                </div>

                                {/* 03. ROADMAP */}
                                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.04] border border-white/5">
                                    <div className="flex items-center gap-1.5 text-neutral-400">
                                        <Sparkles className="w-3 h-3 text-[#FFD700] shrink-0" />
                                        <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-neutral-400">ROADMAP</span>
                                    </div>
                                    <span className="font-bold text-[#FFD700] truncate text-right">
                                        Grand Opening October 2026
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
