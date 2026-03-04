import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideAward, LucideSparkles, LucideChevronUp, LucideMinimize2, CheckCircle2, Circle } from 'lucide-react';

const MinaDirective = ({ text = "[ 멍 때리는중 ]", isVisible, activeStep, position = 'fixed', interactionMode = 'action', sysName = "SEAN'S COMMENT", actionReq = "ACTION REQUIRED", isSpeaking = false, badges = [], disableToggle = false }) => {
    const [isFolded, setIsFolded] = useState(true);
    const [activeTab, setActiveTab] = useState('directive'); // 'directive' | 'badges'
    const [showStrikethrough, setShowStrikethrough] = useState(false);

    useEffect(() => {
        if (!isFolded) {
            // Reset and trigger delayed strikethrough when opened
            setShowStrikethrough(false);
            const timer = setTimeout(() => setShowStrikethrough(true), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowStrikethrough(false);
        }
    }, [isFolded]);

    if (!isVisible || !text) return null;

    // Draggable container logic
    const containerClasses = position === 'fixed'
        ? "pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-[500px]"
        : "pointer-events-auto mx-auto relative z-[5000] mt-4 flex justify-center w-full max-w-[500px]";

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
                    className={`flex flex-col w-full overflow-hidden relative backdrop-blur-xl bg-white/5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500
                        ${isFolded ? 'rounded-3xl cursor-pointer hover:bg-white/10' : 'rounded-[2rem]'}`}
                    animate={{
                        height: isFolded ? 'auto' : (activeTab === 'directive' ? 400 : 500)
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                    {/* Organic Spotlight Glow */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1] rounded-[inherit]">
                        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
                        {isSpeaking && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)] animate-[pulse_3s_ease-in-out_infinite]" />}
                    </div>

                    {/* ALWAYS VISIBLE HEADER (MINIMIZED STATE UI) */}
                    <div
                        className={`flex items-center gap-4 px-5 py-4 md:px-8 md:py-6 relative z-10 ${disableToggle ? '' : 'cursor-pointer'} transition-colors`}
                        onClick={() => !disableToggle && setIsFolded(!isFolded)}
                    >
                        {/* Title & Message */}
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                            <span className="text-xs md:text-sm font-serif italic text-white/60 tracking-[0.2em]">
                                {sysName}
                            </span>
                            <span className="text-base md:text-lg font-serif text-white/90 tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] break-keep whitespace-pre-wrap mt-1">
                                {text}
                            </span>
                        </div>

                        {/* Right Controls */}
                        {!disableToggle && (
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-auto shrink-0">
                                {badges.length > 0 && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 hidden sm:flex">
                                        <LucideAward size={14} className="text-[#C5A059]" />
                                        <span className="text-xs font-serif text-white">{badges.length}</span>
                                    </div>
                                )}
                                <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    {isFolded ? (
                                        <LucideChevronUp size={24} className="text-white/70" strokeWidth={1.5} />
                                    ) : (
                                        <LucideMinimize2 size={24} className="text-white/70" strokeWidth={1.5} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* EXPANDED STATE CONTENT BODY */}
                    <AnimatePresence>
                        {!isFolded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="flex flex-col flex-1 relative z-10"
                            >
                                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                {/* Inner Content Body */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide p-6 md:p-8">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'directive' ? (
                                            <motion.div
                                                key="tab-directive"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex flex-col h-full items-start gap-5"
                                            >

                                                <div className="flex flex-col gap-3 w-full">
                                                    {/* Section Header */}
                                                    <div className="px-3 pb-1 border-b border-white/10 mb-1">
                                                        <span className="text-xs font-serif text-[#C5A059] tracking-widest uppercase">
                                                            1. Language & Flow
                                                        </span>
                                                    </div>

                                                    {/* Completed Task 1 */}
                                                    <div className="flex items-center justify-between w-full px-3">
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors duration-1000 ${showStrikethrough ? 'text-white/30' : 'text-[#C5A059]'}`} strokeWidth={1.5} />
                                                            <span className={`text-sm font-serif tracking-wide italic transition-all duration-1000 ${showStrikethrough ? 'text-white/40 line-through' : 'text-white/90'}`}>
                                                                1-1. System boot & sync
                                                            </span>
                                                        </div>
                                                        <motion.span
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: showStrikethrough ? 1 : 0, scale: showStrikethrough ? 1 : 0.8 }}
                                                            className="text-[9px] font-sans font-black tracking-widest text-[#C5A059]/60 uppercase border border-[#C5A059]/30 px-1.5 py-0.5 rounded-sm h-fit"
                                                        >
                                                            Complete
                                                        </motion.span>
                                                    </div>

                                                    {/* Completed Task 2 */}
                                                    <div className="flex items-center justify-between w-full px-3">
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors duration-1000 ${showStrikethrough ? 'text-white/30' : 'text-[#C5A059]'}`} strokeWidth={1.5} />
                                                            <span className={`text-sm font-serif tracking-wide italic transition-all duration-1000 ${showStrikethrough ? 'text-white/40 line-through' : 'text-white/90'}`}>
                                                                1-2. Multiverse Breach
                                                            </span>
                                                        </div>
                                                        <motion.span
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: showStrikethrough ? 1 : 0, scale: showStrikethrough ? 1 : 0.8 }}
                                                            className="text-[9px] font-sans font-black tracking-widest text-[#C5A059]/60 uppercase border border-[#C5A059]/30 px-1.5 py-0.5 rounded-sm h-fit"
                                                        >
                                                            Complete
                                                        </motion.span>
                                                    </div>

                                                    {/* Active Task */}
                                                    <motion.div
                                                        animate={{
                                                            borderColor: ['rgba(197,160,89,0.2)', 'rgba(197,160,89,0.8)', 'rgba(197,160,89,0.2)'],
                                                            boxShadow: ['0 0 10px rgba(197,160,89,0)', '0 0 20px rgba(197,160,89,0.2)', '0 0 10px rgba(197,160,89,0)']
                                                        }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        className={`flex items-start gap-3 w-full px-4 py-4 rounded-xl relative mt-2 border-2 border-dashed bg-black/40`}
                                                    >
                                                        <Circle className={`w-4 h-4 mt-0.5 shrink-0 text-[#C5A059] animate-pulse glow`} strokeWidth={2} />
                                                        <div className="flex flex-col gap-1 w-full">
                                                            <span className="text-sm font-serif text-[#C5A059] tracking-wide font-bold">
                                                                1-3. Select your frequency.
                                                            </span>
                                                            <span className={`text-sm font-serif tracking-wide leading-snug text-white/80 mt-1 block whitespace-pre-wrap break-keep`}>
                                                                {text}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="tab-badges"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex flex-col gap-4 pb-8"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="text-xs font-serif italic tracking-[0.2em] text-white/60">
                                                        Archive Records
                                                    </div>
                                                    <span className="text-xs font-serif text-[#C5A059] bg-[#C5A059]/10 px-4 py-1.5 rounded-full border border-[#C5A059]/30">
                                                        {badges.length} EARNED
                                                    </span>
                                                </div>

                                                {badges && badges.length > 0 ? (
                                                    badges.map((badge, idx) => (
                                                        <motion.div
                                                            key={badge.id}
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className={`p-5 rounded-2xl flex flex-col gap-2 ${badge.isMajor
                                                                ? 'bg-gradient-to-br from-[#C5A059]/10 to-transparent border border-[#C5A059]/40 shadow-[0_0_20px_rgba(197,160,89,0.1)] backdrop-blur-md'
                                                                : 'bg-black/20 border border-white/10 backdrop-blur-md'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                                <div className={`font-serif tracking-wide text-sm md:text-base ${badge.isMajor ? 'text-[#C5A059]' : 'text-white/90'}`}>
                                                                    {badge.title}
                                                                </div>
                                                                {badge.isMajor && <LucideSparkles size={16} className="text-[#C5A059]" />}
                                                            </div>
                                                            <div className="text-xs md:text-sm font-sans font-light tracking-wide text-white/60 leading-relaxed mt-2">
                                                                {badge.desc}
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl border border-white/10 bg-black/20 mx-2">
                                                        <LucideAward size={36} className="mb-5 text-white/20" strokeWidth={1} />
                                                        <div className="text-center font-serif text-white/40 text-sm tracking-wide leading-relaxed">
                                                            No records found.<br />Explore the multiverse to collect memories.
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Bottom Context Nav */}
                                <div className="flex p-3 gap-3 mx-4 mb-5 rounded-2xl bg-black/30 border border-white/10 shrink-0">
                                    <button
                                        onClick={() => setActiveTab('directive')}
                                        className={`flex-1 py-5 transition-all rounded-xl flex justify-center items-center gap-2 text-xs md:text-sm font-serif tracking-widest ${activeTab === 'directive' ? 'bg-white/10 text-white shadow-inner' : 'bg-transparent text-white/40 hover:text-white/80'}`}
                                    >
                                        <LucideMessageSquare size={16} strokeWidth={1.5} /> GUIDE
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('badges')}
                                        className={`flex-1 py-5 transition-all rounded-xl flex justify-center items-center gap-2 text-xs md:text-sm font-serif tracking-widest ${activeTab === 'badges' ? 'bg-[#C5A059]/20 text-[#C5A059] shadow-inner' : 'bg-transparent text-white/40 hover:text-[#C5A059]/80'}`}
                                    >
                                        <div className="relative">
                                            <LucideAward size={14} strokeWidth={1.5} />
                                            {badges.length > 0 && activeTab !== 'badges' && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C5A059] rounded-full shadow-[0_0_5px_#C5A059]" />
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
