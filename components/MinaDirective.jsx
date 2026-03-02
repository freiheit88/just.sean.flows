import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideAward, LucideSparkles, LucideChevronUp, LucideTrophy, LucideMinimize2, CheckCircle2, Circle } from 'lucide-react';

const MinaDirective = ({ text = "[ 멍 때리는중 ]", isVisible, activeStep, position = 'fixed', interactionMode = 'action', sysName = "MINA", actionReq = "ACTION REQUIRED", isSpeaking = false, badges = [] }) => {
    const [isFolded, setIsFolded] = useState(true);
    const [activeTab, setActiveTab] = useState('directive'); // 'directive' | 'badges'

    if (!isVisible || !text) return null;

    // Draggable container logic
    const containerClasses = position === 'fixed'
        ? "pointer-events-auto fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
        : "pointer-events-auto mx-auto relative z-[5000] mt-4 flex justify-center";

    return (
        <AnimatePresence mode="wait">
            <motion.div
                drag={position === 'fixed'}
                dragMomentum={false}
                key="mina-aipill"
                className={containerClasses}
                initial={{ opacity: 0, y: 50, scale: 0.9, x: position === 'fixed' ? "-50%" : 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: position === 'fixed' ? "-50%" : 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
                <motion.div
                    layout
                    className={`flex flex-col overflow-hidden relative backdrop-blur-3xl bg-black/60 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-colors
                        ${isFolded ? 'rounded-full px-2 py-1 cursor-pointer hover:bg-black/70' : 'rounded-3xl w-[340px] sm:w-[380px] md:w-[420px]'}`}
                    animate={{
                        width: isFolded ? 'auto' : undefined,
                        height: isFolded ? 52 : (activeTab === 'directive' ? 240 : 420)
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                    {/* Glowing Aura Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-[-1]">
                        {isSpeaking && <div className="absolute -inset-4 bg-[#00E5FF]/20 blur-2xl animate-pulse" />}
                        <div className={`absolute top-0 left-1/4 right-1/4 h-[1px] ${isFolded ? 'bg-gradient-to-r from-transparent via-white/40 to-transparent' : 'bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent'}`} />
                    </div>

                    {/* FOLDED STATE : The Pill */}
                    {isFolded ? (
                        <div
                            className="flex items-center gap-3 h-full px-4"
                            onClick={() => setIsFolded(false)}
                        >
                            <div className="flex items-center justify-center p-1.5 rounded-full bg-white/10">
                                <LucideSparkles size={14} className={isSpeaking ? "text-[#00E5FF] animate-pulse" : "text-[#C5A059]"} />
                            </div>
                            <div className="flex flex-col justify-center min-w-[120px] max-w-[200px]">
                                <span className={`text-[10px] font-mono font-black tracking-widest uppercase ${isSpeaking ? 'text-[#00E5FF]' : 'text-white/40'}`}>
                                    {sysName} V28
                                </span>
                                <span className="text-xs font-semibold text-white/90 truncate">
                                    {text}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                                {badges.length > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20">
                                        <LucideAward size={10} className="text-[#C5A059]" />
                                        <span className="text-[10px] font-black text-[#C5A059]">{badges.length}</span>
                                    </div>
                                )}
                                <LucideChevronUp size={16} className="text-white/40" />
                            </div>
                        </div>
                    ) : (
                        /* EXPANDED STATE : The Modal */
                        <div className="flex flex-col h-full relative">
                            {/* Header Handle */}
                            <div className="w-full h-12 flex justify-between items-center shrink-0 border-b border-white/5 bg-white/[0.02] px-3">
                                <div className="w-8 opacity-0 pointer-events-none" /> {/* Spacer for centering */}
                                <div
                                    className="w-12 h-1.5 rounded-full bg-white/20 cursor-pointer hover:bg-white/40 transition-colors"
                                    onClick={() => setIsFolded(true)}
                                />
                                <button
                                    onClick={() => setIsFolded(true)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    <LucideMinimize2 size={14} className="text-white/60 hover:text-white" />
                                </button>
                            </div>

                            {/* Inner Content Body */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide p-5">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'directive' ? (
                                        <motion.div
                                            key="tab-directive"
                                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                                            className="flex flex-col h-full items-start gap-3 py-2"
                                        >
                                            <div className="text-[10px] font-black text-white/30 tracking-widest px-1 uppercase mb-2">
                                                Task Directives Overview
                                            </div>

                                            <div className="flex flex-col gap-3 w-full">
                                                {/* Completed Task 1 */}
                                                <div className="flex items-center gap-3 w-full px-2 py-1 opacity-40">
                                                    <CheckCircle2 size={16} className="text-[#00E5FF] shrink-0" />
                                                    <span className="text-sm md:text-base font-semibold text-white line-through break-keep">
                                                        시스템 부팅 및 자아 동기화
                                                    </span>
                                                </div>

                                                {/* Completed Task 2 */}
                                                <div className="flex items-center gap-3 w-full px-2 py-1 opacity-40">
                                                    <CheckCircle2 size={16} className="text-[#00E5FF] shrink-0" />
                                                    <span className="text-sm md:text-base font-semibold text-white line-through break-keep">
                                                        다중우주 관측 차원 진입 성공
                                                    </span>
                                                </div>

                                                {/* Active Task (from props) */}
                                                <div className="flex items-center gap-3 w-full bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden mt-2 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
                                                    {isSpeaking && <div className="absolute inset-0 bg-[#00E5FF]/10 animate-pulse pointer-events-none" />}
                                                    <div className="relative shrink-0 flex items-center justify-center">
                                                        <Circle size={18} className={isSpeaking ? "text-[#00E5FF]" : "text-[#C5A059]"} />
                                                        {isSpeaking && <div className="absolute inset-0 bg-[#00E5FF] rounded-full opacity-30 animate-ping" />}
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 relative z-10">
                                                        <span className={`text-[15px] md:text-lg font-bold leading-snug break-keep ${isSpeaking ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]' : 'text-white'}`}>
                                                            {text}
                                                        </span>
                                                        {actionReq && (
                                                            <div className="w-fit px-2 py-0.5 mt-1 text-[9px] md:text-[10px] font-mono tracking-widest text-[#E8D4A6] uppercase border border-[#E8D4A6]/20 rounded-md bg-[#E8D4A6]/5">
                                                                {actionReq}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="tab-badges"
                                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                                            className="flex flex-col gap-3 pb-8"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-white/70 font-black tracking-widest text-xs md:text-sm uppercase flex items-center gap-2">
                                                    <LucideTrophy size={14} className="text-[#C5A059]" /> Titles
                                                </h4>
                                                <span className="text-[10px] font-mono text-white/30">{badges.length} EARNED</span>
                                            </div>

                                            {badges && badges.length > 0 ? (
                                                badges.map((badge, idx) => (
                                                    <motion.div
                                                        key={badge.id}
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className={`p-4 relative rounded-2xl flex flex-col gap-1.5 overflow-hidden transition-all ${badge.isMajor
                                                            ? 'bg-gradient-to-br from-[#C5A059]/15 to-transparent border border-[#C5A059]/30 shadow-[0_4px_20px_rgba(197,160,89,0.1)]'
                                                            : 'bg-white/5 border border-white/5'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className={`font-bold tracking-wide text-sm ${badge.isMajor ? 'text-[#C5A059]' : 'text-white/80'}`}>
                                                                {badge.title}
                                                            </div>
                                                            {badge.isMajor && <LucideSparkles size={12} className="text-[#C5A059] opacity-70" />}
                                                        </div>
                                                        <div className={`text-xs break-keep leading-relaxed ${badge.isMajor ? 'text-[#e5c996]/70' : 'text-white/40'}`}>
                                                            {badge.desc}
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                                                    <LucideAward size={32} className="mb-3 text-white" />
                                                    <div className="text-center text-white text-xs md:text-sm leading-relaxed max-w-[200px]">
                                                        배지를 아직 획득하지 못했습니다. 멀티버스를 탐험해보세요.
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bottom Context Nav */}
                            <div className="flex p-2 gap-2 bg-black/40 border-t border-white/5 shrink-0 px-4">
                                <button
                                    onClick={() => setActiveTab('directive')}
                                    className={`flex-1 py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 text-xs font-semibold tracking-wider ${activeTab === 'directive' ? 'bg-white/10 text-white shadow-[inset_0_1px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                                >
                                    <LucideMessageSquare size={14} /> MINA
                                </button>
                                <button
                                    onClick={() => setActiveTab('badges')}
                                    className={`flex-1 py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 text-xs font-semibold tracking-wider ${activeTab === 'badges' ? 'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/20 shadow-[inset_0_1px_rgba(197,160,89,0.2)]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                                >
                                    <div className="relative">
                                        <LucideAward size={14} />
                                        {badges.length > 0 && activeTab !== 'badges' && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-black" />
                                        )}
                                    </div>
                                    TITLES
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MinaDirective;
