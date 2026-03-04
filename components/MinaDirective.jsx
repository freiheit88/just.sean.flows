import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideAward, LucideSparkles, LucideChevronUp, LucideTrophy, LucideMinimize2, CheckCircle2, Circle } from 'lucide-react';

const MinaDirective = ({ text = "[ 멍 때리는중 ]", isVisible, activeStep, position = 'fixed', interactionMode = 'action', sysName = "SEAN'S COMMENT", actionReq = "ACTION REQUIRED", isSpeaking = false, badges = [] }) => {
    const [isFolded, setIsFolded] = useState(true);
    const [activeTab, setActiveTab] = useState('directive'); // 'directive' | 'badges'

    if (!isVisible || !text) return null;

    // Draggable container logic
    const containerClasses = position === 'fixed'
        ? "pointer-events-auto fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
        : "pointer-events-auto mx-auto relative z-[5000] mt-4 flex justify-center w-full";

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
                    className={`flex flex-col w-full overflow-hidden relative bg-black border-[3px] shadow-[8px_8px_0px_rgba(197,160,89,0.3)] transition-colors
                        ${isFolded ? 'rounded-none border-[#C5A059] cursor-pointer hover:bg-[#111]' : 'rounded-none border-white'}`}
                    animate={{
                        height: isFolded ? 'auto' : (activeTab === 'directive' ? 400 : 500)
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                    {/* Glowing Aura Effect - Replaced with scanning line for brutalist feel */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
                        {isSpeaking && <div className="absolute top-0 left-0 w-full h-1 bg-[#00E5FF] animate-[scan_2s_linear_infinite] opacity-50" />}
                    </div>

                    {/* ALWAYS VISIBLE HEADER (MINIMIZED STATE UI) */}
                    <div
                        className={`flex items-stretch gap-5 p-5 md:p-6 relative z-10 cursor-pointer transition-colors border-b-[3px] ${isFolded ? 'border-transparent hover:bg-[#111]' : 'border-white/20 bg-black'}`}
                        onClick={() => setIsFolded(!isFolded)}
                    >
                        {/* Status Icon */}
                        <div className={`p-2.5 mt-0.5 border-[3px] shrink-0 self-start ${isSpeaking ? "border-[#00E5FF] bg-[#00E5FF]/20" : "border-[#C5A059] bg-[#C5A059]/10"}`}>
                            <LucideSparkles size={20} className={isSpeaking ? "text-[#00E5FF] animate-pulse" : "text-[#C5A059]"} />
                        </div>

                        {/* Title & Message */}
                        <div className="flex flex-col justify-center flex-1 min-w-0 pr-4">
                            <span className={`text-[11px] font-mono font-black tracking-[0.4em] uppercase mb-2 opacity-90 ${isSpeaking ? 'text-[#00E5FF]' : 'text-[#C5A059]'}`}>
                                {sysName}
                            </span>
                            <span className="text-base md:text-xl font-black text-white uppercase tracking-wider leading-snug break-words">
                                {text}
                            </span>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-4 pl-5 border-l-2 border-white/20 ml-auto shrink-0 self-stretch">
                            {badges.length > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#C5A059] text-black border-2 border-[#C5A059] hidden sm:flex">
                                    <LucideAward size={14} className="text-black" />
                                    <span className="text-xs font-black">{badges.length}</span>
                                </div>
                            )}
                            <div>
                                {isFolded ? (
                                    <LucideChevronUp size={24} className="text-white hover:text-[#C5A059] transition-colors" />
                                ) : (
                                    <LucideMinimize2 size={24} className="text-white hover:text-[#C5A059] transition-colors" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* EXPANDED STATE CONTENT BODY */}
                    <AnimatePresence>
                        {!isFolded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col flex-1 relative z-10 bg-[#0A0A0A] overflow-hidden"
                            >
                                {/* Inner Content Body */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'directive' ? (
                                            <motion.div
                                                key="tab-directive"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex flex-col h-full items-start gap-4"
                                            >
                                                <div className="bg-white text-black px-2 py-1 text-[10px] font-black tracking-[0.3em] uppercase border-l-4 border-[#C5A059]">
                                                    SEAN'S GUIDE
                                                </div>

                                                <div className="flex flex-col gap-3 w-full">
                                                    {/* Completed Task 1 */}
                                                    <div className="flex items-center gap-4 w-full px-3 py-2 border-2 border-[#00E5FF]/30 bg-[#00E5FF]/5 opacity-60">
                                                        <div className="w-4 h-4 bg-[#00E5FF] shrink-0 border-2 border-[#00E5FF]" />
                                                        <span className="text-sm font-black text-white/50 line-through tracking-wider uppercase">
                                                            SYSTEM BOOT & SYNC
                                                        </span>
                                                    </div>

                                                    {/* Completed Task 2 */}
                                                    <div className="flex items-center gap-4 w-full px-3 py-2 border-2 border-[#00E5FF]/30 bg-[#00E5FF]/5 opacity-60">
                                                        <div className="w-4 h-4 bg-[#00E5FF] shrink-0 border-2 border-[#00E5FF]" />
                                                        <span className="text-sm font-black text-white/50 line-through tracking-wider uppercase">
                                                            MULTIVERSE BREACH
                                                        </span>
                                                    </div>

                                                    {/* Active Task */}
                                                    <div className={`flex items-start gap-4 w-full p-4 border-[3px] relative mt-2 ${isSpeaking ? 'border-[#00E5FF] bg-black shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'border-[#C5A059] bg-[#111]'}`}>
                                                        <div className={`w-5 h-5 shrink-0 mt-0.5 border-4 ${isSpeaking ? "border-[#00E5FF] bg-[#00E5FF]/20 animate-pulse" : "border-[#C5A059] bg-[#C5A059]/20"}`} />
                                                        <div className="flex flex-col gap-2 relative z-10 w-full">
                                                            {actionReq && (
                                                                <div className={`w-fit px-2 py-1 text-[9px] font-black tracking-[0.2em] uppercase border-b-2 ${isSpeaking ? 'text-[#00E5FF] border-[#00E5FF]' : 'text-[#C5A059] border-[#C5A059]'}`}>
                                                                    {actionReq}
                                                                </div>
                                                            )}
                                                            <span className={`text-lg md:text-xl font-black uppercase tracking-wide leading-tight ${isSpeaking ? 'text-white' : 'text-white/90'}`}>
                                                                {text}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="tab-badges"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex flex-col gap-4 pb-8"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="bg-[#C5A059] text-black px-2 py-1 text-[10px] font-black tracking-[0.3em] uppercase border-l-4 border-white">
                                                        SEAN'S ARCHIVE
                                                    </div>
                                                    <span className="text-[10px] font-black text-white/50 tracking-[0.3em] border-2 border-white/20 px-2 py-1">{badges.length} EARNED</span>
                                                </div>

                                                {badges && badges.length > 0 ? (
                                                    badges.map((badge, idx) => (
                                                        <motion.div
                                                            key={badge.id}
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className={`p-4 flex flex-col gap-2 ${badge.isMajor
                                                                ? 'bg-black border-[3px] border-[#C5A059]'
                                                                : 'bg-[#111] border-2 border-white/20'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between border-b-2 border-white/10 pb-2">
                                                                <div className={`font-black tracking-[0.2em] uppercase text-sm ${badge.isMajor ? 'text-[#C5A059]' : 'text-white/80'}`}>
                                                                    {badge.title}
                                                                </div>
                                                                {badge.isMajor && <LucideSparkles size={14} className="text-[#C5A059]" />}
                                                            </div>
                                                            <div className="text-xs font-bold uppercase tracking-wider text-white/50 leading-relaxed mt-1">
                                                                // {badge.desc}
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/20 bg-black">
                                                        <LucideAward size={40} className="mb-4 text-white/20" />
                                                        <div className="text-center font-black uppercase text-white/40 text-xs tracking-[0.2em]">
                                                            NO DATA FOUND.<br />EXPLORE THE MULTIVERSE.
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Bottom Context Nav */}
                                <div className="flex p-4 gap-4 bg-black border-t-[3px] border-white/20 shrink-0">
                                    <button
                                        onClick={() => setActiveTab('directive')}
                                        className={`flex-1 py-3 transition-colors flex justify-center items-center gap-3 text-xs font-black tracking-[0.3em] uppercase border-2 ${activeTab === 'directive' ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20 hover:border-white hover:text-white'}`}
                                    >
                                        <LucideMessageSquare size={16} /> GUIDE
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('badges')}
                                        className={`flex-1 py-3 transition-colors flex justify-center items-center gap-3 text-xs font-black tracking-[0.3em] uppercase border-2 ${activeTab === 'badges' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'bg-transparent text-white/50 border-white/20 hover:border-[#C5A059] hover:text-[#C5A059]'}`}
                                    >
                                        <div className="relative">
                                            <LucideAward size={16} />
                                            {badges.length > 0 && activeTab !== 'badges' && (
                                                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-black" />
                                            )}
                                        </div>
                                        ARCHIVE
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MinaDirective;
