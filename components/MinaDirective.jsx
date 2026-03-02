import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideAward, LucideMaximize2, LucideMinimize2, LucideGripHorizontal, LucideTrophy } from 'lucide-react';

const MinaDirective = ({ text = "[ 멍 때리는중 ]", isVisible, activeStep, position = 'fixed', interactionMode = 'action', sysName = "MINA", actionReq = "ACTION REQUIRED", isSpeaking = false, badges = [] }) => {
    const [isFolded, setIsFolded] = useState(false);
    const [activeTab, setActiveTab] = useState('directive'); // 'directive' | 'badges'

    if (!isVisible || !text) return null;

    // Draggable container logic
    const containerClasses = position === 'fixed'
        ? "pointer-events-auto mx-auto w-[280px] md:w-[320px] z-[9999]"
        : "pointer-events-auto mx-auto w-[280px] md:w-[320px] relative z-[5000] mt-4";

    return (
        <AnimatePresence mode="wait">
            <motion.div
                drag={position === 'fixed'}
                dragMomentum={false}
                key="mina-zflip"
                className={containerClasses}
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Device Body (Z-Flip Frame) */}
                <motion.div
                    layout
                    className="bg-[#0A0A0A] border-[4px] border-[#222] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_2px_10px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col relative"
                    animate={{
                        height: isFolded ? 140 : 540
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    {/* Hinge / Drag Handle */}
                    <div className="w-full flex justify-center items-center py-2 bg-[#111] border-b border-[#222] cursor-grab active:cursor-grabbing z-50 shrink-0">
                        <LucideGripHorizontal size={16} className="text-white/30" />
                    </div>

                    {/* Fold/Unfold Toggle Button */}
                    <button
                        onClick={() => setIsFolded(!isFolded)}
                        className="absolute top-2 right-4 z-50 p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                    >
                        {isFolded ? <LucideMaximize2 size={14} /> : <LucideMinimize2 size={14} />}
                    </button>

                    {/* FOLDED STATE: Cover Display */}
                    <AnimatePresence>
                        {isFolded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col p-4 relative"
                            >
                                <div className="absolute inset-x-4 top-4 bottom-4 bg-[#050505] rounded-xl border border-white/5 overflow-hidden flex flex-col justify-center items-center p-3 shadow-inner">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.5)_2px,transparent_2px)] bg-[size:4px_4px] pointer-events-none opacity-40" />

                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#00E5FF] animate-pulse shadow-[0_0_10px_#00E5FF]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                                        <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">MINA V28</span>
                                    </div>

                                    <h3 className={`text-base font-black uppercase text-center w-full truncate ${isSpeaking ? 'text-[#00E5FF]' : 'text-[#E8D4A6]'}`}>
                                        {activeTab === 'badges' ? 'INVENTORY' : text}
                                    </h3>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* UNFOLDED STATE: Main Display */}
                    <AnimatePresence>
                        {!isFolded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col h-full bg-[#050505] relative"
                            >
                                {/* Screen Glare */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0" />

                                {/* App Content Area */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 p-4 scrollbar-hide">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'directive' ? (
                                            <motion.div
                                                key="tab-directive"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex flex-col items-center justify-center min-h-full py-6"
                                            >
                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)] pointer-events-none" />
                                                <div className={`text-2xl md:text-3xl font-black uppercase text-center font-mono leading-relaxed tracking-wider break-words w-full ${isSpeaking ? 'text-[#00E5FF] drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]' : 'text-[#E8D4A6] drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]'}`}>
                                                    {text}
                                                </div>
                                                <div className="mt-12 text-xs md:text-sm font-bold text-red-500/80 uppercase tracking-[0.2em] font-mono text-center w-full p-3 border border-red-500/30 rounded bg-red-500/5">
                                                    {actionReq}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="tab-badges"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex flex-col gap-3 pb-8"
                                            >
                                                <div className="sticky top-0 bg-[#050505]/90 backdrop-blur pb-2 z-20 border-b border-white/10 mb-2">
                                                    <h4 className="text-[#C5A059] font-black tracking-[0.2em] text-sm uppercase flex items-center justify-center gap-2">
                                                        <LucideTrophy size={14} /> Earned Titles
                                                    </h4>
                                                </div>

                                                {badges && badges.length > 0 ? (
                                                    badges.map((badge, idx) => (
                                                        <motion.div
                                                            key={badge.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className={`p-3 rounded-lg border ${badge.isMajor ? 'border-[#C5A059]/40 bg-[#C5A059]/10' : 'border-white/10 bg-white/5'} flex flex-col gap-1`}
                                                        >
                                                            <div className={`font-black uppercase text-sm ${badge.isMajor ? 'text-[#C5A059]' : 'text-white'}`}>
                                                                {badge.title}
                                                            </div>
                                                            <div className="text-[10px] text-white/50 break-keep leading-tight">
                                                                {badge.desc}
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-white/30 text-xs italic py-10">
                                                        No titles earned yet.<br />Explore the app to earn badges.
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Bottom Navigation Bar (Tabs) */}
                                <div className="h-16 bg-[#111] border-t border-[#222] flex shrink-0 relative z-20">
                                    <button
                                        onClick={() => setActiveTab('directive')}
                                        className={`flex-1 flex flex-col justify-center items-center gap-1 transition-colors ${activeTab === 'directive' ? 'text-[#00E5FF]' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        <LucideMessageSquare size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">MINA</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('badges')}
                                        className={`flex-1 flex flex-col justify-center items-center gap-1 transition-colors ${activeTab === 'badges' ? 'text-[#C5A059]' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        <div className="relative">
                                            <LucideAward size={18} />
                                            {badges.length > 0 && activeTab !== 'badges' && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-[#111]" />
                                            )}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest">INVENTORY</span>
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
