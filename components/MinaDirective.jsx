import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideAward, LucideSparkles, LucideChevronUp, LucideChevronDown, LucideMinimize2, LucideMaximize2, CheckCircle2, Circle } from 'lucide-react';

const TypewriterText = ({ text, speed = 30 }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        if (!text) return;

        const interval = setInterval(() => {
            setDisplayedText(prev => {
                if (prev.length < text.length) {
                    return text.slice(0, prev.length + 1);
                } else {
                    clearInterval(interval);
                    return prev;
                }
            });
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return <span>{displayedText}</span>;
};

const MinaDirective = ({ text = "[ 멍 때리는중 ]", isVisible, activeStep, position = 'fixed', interactionMode = 'action', sysName = "SEAN'S COMMENT", actionReq = "ACTION REQUIRED", isSpeaking = false, badges = [], disableToggle = false, ui = {}, dynamicMaxHeight = '75vh', forceExpanded = false, forceFolded = false, onToggleResize }) => {
    const [isFoldedState, setIsFoldedState] = useState(true);
    const isFolded = forceFolded ? true : (forceExpanded ? false : isFoldedState);
    const setIsFolded = setIsFoldedState;

    const [activeTab, setActiveTab] = useState('directive'); // 'directive' | 'badges'
    const [showStrikethrough, setShowStrikethrough] = useState(false);
    const [expandedBadges, setExpandedBadges] = useState({});

    // Persona dynamic theme setup
    const isConductor = sysName.includes('🎻');
    const themeColor = isConductor ? '#00E5FF' : '#C5A059';
    const themeColorRgb = isConductor ? '0,229,255' : '197,160,89';

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
                    style={{
                        height: isFolded ? 'auto' : dynamicMaxHeight, // Force exact stretch to grid bottom even if empty
                        maxHeight: isFolded ? 'none' : dynamicMaxHeight // Dynamic layout lock matching exactly to grid's bottom
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {/* Organic Spotlight Glow: Dynamic Persona Top 50% FX */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1] rounded-[inherit]">
                        {!isFolded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -top-[20%] -left-[20%] w-[140%] h-[70%] pointer-events-none"
                                style={{ background: `radial-gradient(ellipse at center top, rgba(${themeColorRgb}, 0.18) 0%, transparent 70%)` }}
                            />
                        )}
                        {isSpeaking && <div className="absolute inset-0 animate-[pulse_3s_ease-in-out_infinite]" style={{ background: `radial-gradient(ellipse at top, rgba(${themeColorRgb}, 0.25) 0%, transparent 60%)` }} />}
                    </div>

                    {/* ALWAYS VISIBLE HEADER (MINIMIZED STATE UI) */}
                    <div className="flex flex-col min-h-[150px] md:min-h-[170px] relative z-10 transition-colors shrink-0">
                        {/* Title Bar: Guide Concept (50% visual weight) - CLICKABLE TOGGLE */}
                        <div
                            className={`flex-1 w-full bg-black/40 border-b border-white/10 flex items-center justify-center relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm z-10 px-6 py-4 ${disableToggle ? '' : 'cursor-pointer hover:bg-black/50 transition-colors'}`}
                            onClick={() => {
                                if (!disableToggle) {
                                    setIsFolded(!isFolded);
                                    if (onToggleResize) onToggleResize();
                                }
                            }}
                            title={!disableToggle ? (isFolded ? "Click to Expand" : "Click to Collapse") : ""}
                        >
                            <span className={`flex items-center gap-2 text-[16px] md:text-[19px] font-serif tracking-[0.2em] font-bold uppercase transition-colors duration-700 drop-shadow-md`} style={{ color: themeColor }}>
                                {/* Dual Persona Icons: Fixed Inactive brightness/glow */}
                                <div className="flex items-center gap-1.5 mr-1 text-[17px] md:text-[20px]">
                                    <span className={`transition-all duration-700 ${!isConductor ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.9)]' : 'opacity-30 grayscale-[0.8] brightness-[0.4] drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] scale-90'}`} title="SEAN'S COMMENT Mode">
                                        🎙️
                                    </span>
                                    <span className={`transition-all duration-700 ${isConductor ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.9)]' : 'opacity-30 grayscale-[0.8] brightness-[0.4] drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] scale-90'}`} title="Principal Conductor Mode">
                                        🎻
                                    </span>
                                </div>
                                {sysName.replace('🎻', '').replace('🎙️', '').trim()}
                                {!disableToggle && (
                                    <div className="ml-2 text-white/50 hover:text-white/90 transition-colors bg-white/5 p-1.5 rounded-md border border-white/10" onClick={(e) => {
                                        if (onToggleResize) { e.stopPropagation(); onToggleResize(); }
                                    }}>
                                        {isFolded ? <LucideMaximize2 size={14} strokeWidth={2} /> : <LucideMinimize2 size={14} strokeWidth={2} />}
                                    </div>
                                )}
                            </span>

                            {/* Decorative Elegant Divider Line: Thicker, Sharper, Dynamic Color */}
                            <div className={`absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-2/3 h-[2px] opacity-90`} style={{ background: `linear-gradient(90deg, transparent 0%, ${themeColor} 50%, transparent 100%)` }} />

                            {/* Absolute Right Badges (if any, kept for info but moved controls) */}
                            {!disableToggle && badges.length > 0 && (
                                <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 hidden sm:flex">
                                    <LucideAward size={14} style={{ color: themeColor }} />
                                    <span className="text-xs font-serif text-white">{badges.length}</span>
                                </div>
                            )}
                        </div>

                        {/* Message: Typewriter Effect (50% visual weight) */}
                        <div className="flex-1 flex items-center justify-center w-full px-8 py-4">
                            <motion.div
                                animate={!isConductor ? {
                                    y: [0, -2, 0],
                                    scale: [1, 1.04, 1], // Trendy Flinch/Pulse effect specifically for action prompts
                                    textShadow: ["0px 2px 10px rgba(255,255,255,0.3)", `0px 0px 15px rgba(${themeColorRgb}, 0.8)`, "0px 2px 10px rgba(255,255,255,0.3)"]
                                } : {
                                    textShadow: "0px 2px 10px rgba(255,255,255,0.3)"
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                className="text-[15px] sm:text-base md:text-lg font-serif text-white/95 tracking-wide leading-relaxed break-keep whitespace-pre-wrap text-center cursor-default"
                            >
                                <TypewriterText text={text} speed={30} />
                            </motion.div>
                        </div>
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

                                {/* Top Context Nav (Moved from Bottom) */}
                                <div className="flex p-3 gap-3 mx-6 mt-5 md:mx-8 md:mt-8 rounded-2xl bg-black/30 border border-white/10 shrink-0 relative z-20">
                                    <button
                                        onClick={() => setActiveTab('directive')}
                                        className={`flex-1 py-4 transition-all rounded-xl flex justify-center items-center gap-2 text-xs md:text-sm font-serif tracking-widest ${activeTab === 'directive' ? 'bg-white/10 text-white shadow-inner' : 'bg-transparent text-white/40 hover:text-white/80'}`}
                                    >
                                        <LucideMessageSquare size={16} strokeWidth={1.5} /> {ui.tabGuide || "GUIDE"}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('badges')}
                                        className={`flex-1 py-4 transition-all rounded-xl flex justify-center items-center gap-2 text-xs md:text-sm font-serif tracking-widest ${activeTab === 'badges' ? 'shadow-inner' : 'bg-transparent text-white/40'}`}
                                        style={activeTab === 'badges' ? { backgroundColor: `rgba(${themeColorRgb}, 0.2)`, color: themeColor } : {}}
                                    >
                                        <div className="relative">
                                            <LucideAward size={14} strokeWidth={1.5} />
                                            {badges.length > 0 && activeTab !== 'badges' && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full shadow-md" style={{ backgroundColor: themeColor }} />
                                            )}
                                        </div>
                                        {ui.tabArchive || "ARCHIVE"}
                                    </button>
                                </div>

                                {/* Inner Content Body */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar px-6 md:px-8 pt-4 md:pt-4 pb-8 h-full min-h-[150px]">
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
                                                        <span className="text-xs font-serif tracking-widest uppercase" style={{ color: themeColor }}>
                                                            {ui.guideHeader || "1. Language & Flow"}
                                                        </span>
                                                    </div>

                                                    {/* Completed Task 1 */}
                                                    <div className="flex items-center justify-between w-full px-3">
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors duration-1000 ${showStrikethrough ? 'text-white/30' : ''}`} style={!showStrikethrough ? { color: themeColor } : {}} strokeWidth={1.5} />
                                                            <span className={`text-sm font-serif tracking-wide italic transition-all duration-1000 ${showStrikethrough ? 'text-white/40 line-through' : 'text-white/90'}`}>
                                                                {ui.guideStep1 || "1-1. System boot & sync"}
                                                            </span>
                                                        </div>
                                                        <motion.span
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: showStrikethrough ? 1 : 0, scale: showStrikethrough ? 1 : 0.8 }}
                                                            className="text-[9px] font-sans font-black tracking-widest uppercase border px-1.5 py-0.5 rounded-sm h-fit"
                                                            style={{ color: `rgba(${themeColorRgb}, 0.6)`, borderColor: `rgba(${themeColorRgb}, 0.3)` }}
                                                        >
                                                            {ui.guideComplete || "Complete"}
                                                        </motion.span>
                                                    </div>

                                                    {/* Completed Task 2 */}
                                                    <div className="flex items-center justify-between w-full px-3">
                                                        <div className="flex items-center gap-3">
                                                            <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors duration-1000 ${showStrikethrough ? 'text-white/30' : ''}`} style={!showStrikethrough ? { color: themeColor } : {}} strokeWidth={1.5} />
                                                            <span className={`text-sm font-serif tracking-wide italic transition-all duration-1000 ${showStrikethrough ? 'text-white/40 line-through' : 'text-white/90'}`}>
                                                                {ui.guideStep2 || "1-2. Multiverse Breach"}
                                                            </span>
                                                        </div>
                                                        <motion.span
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: showStrikethrough ? 1 : 0, scale: showStrikethrough ? 1 : 0.8 }}
                                                            className="text-[9px] font-sans font-black tracking-widest uppercase border px-1.5 py-0.5 rounded-sm h-fit"
                                                            style={{ color: `rgba(${themeColorRgb}, 0.6)`, borderColor: `rgba(${themeColorRgb}, 0.3)` }}
                                                        >
                                                            {ui.guideComplete || "Complete"}
                                                        </motion.span>
                                                    </div>

                                                    {/* Active Task */}
                                                    <motion.div
                                                        animate={!forceExpanded && text !== "앵커 확정 성공!" ? {
                                                            borderColor: [`rgba(${themeColorRgb}, 0.2)`, `rgba(${themeColorRgb}, 0.8)`, `rgba(${themeColorRgb}, 0.2)`],
                                                            boxShadow: ['0 0 10px rgba(0,0,0,0)', `0 0 20px rgba(${themeColorRgb}, 0.2)`, '0 0 10px rgba(0,0,0,0)']
                                                        } : {}}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        className={`flex items-start gap-3 w-full px-4 py-4 rounded-xl relative mt-2 border-2 ${forceExpanded || text === "앵커 확정 성공!" ? 'border-white/10 bg-transparent' : 'border-dashed bg-black/40'}`}
                                                    >
                                                        {forceExpanded || text === "앵커 확정 성공!" ? (
                                                            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 transition-colors duration-1000 ${showStrikethrough ? 'text-white/30' : ''}`} style={!showStrikethrough ? { color: themeColor } : {}} strokeWidth={1.5} />
                                                        ) : (
                                                            <Circle className="w-4 h-4 mt-0.5 shrink-0 animate-pulse glow" style={{ color: themeColor }} strokeWidth={2} />
                                                        )}
                                                        <div className="flex flex-col gap-1 w-full relative">
                                                            <div className="flex justify-between items-center w-full">
                                                                <span className={`text-sm font-serif tracking-wide ${forceExpanded || text === "앵커 확정 성공!" ? 'italic text-white/40 line-through' : 'font-bold'}`} style={!(forceExpanded || text === "앵커 확정 성공!") ? { color: themeColor } : {}}>
                                                                    {ui.guideStep3 || "1-3. Select your frequency."}
                                                                </span>
                                                                {(forceExpanded || text === "앵커 확정 성공!") && (
                                                                    <span className="text-[9px] font-sans font-black tracking-widest uppercase border px-1.5 py-0.5 rounded-sm h-fit" style={{ color: `rgba(${themeColorRgb}, 0.6)`, borderColor: `rgba(${themeColorRgb}, 0.3)` }}>
                                                                        {ui.guideComplete || "Complete"}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {!(forceExpanded || text === "앵커 확정 성공!") && (
                                                                <span className={`text-sm font-serif tracking-wide leading-snug text-white/80 mt-1 block whitespace-pre-wrap break-keep`}>
                                                                    {text}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.div>

                                                    {/* Phase 2: Make yourself (Appears after Phase 1 is Sealed) */}
                                                    {(forceExpanded || text === "앵커 확정 성공!") && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.5, duration: 0.8 }}
                                                            className="flex flex-col gap-3 w-full mt-6"
                                                        >
                                                            {/* Section 2 Header */}
                                                            <div className="px-3 pb-1 border-b border-white/10 mb-1">
                                                                <span className="text-xs font-serif tracking-widest uppercase" style={{ color: themeColor }}>
                                                                    {ui.guideHeader2 || "2. Make yourself"}
                                                                </span>
                                                            </div>

                                                            {/* Active Task (Phase 2) */}
                                                            <motion.div
                                                                animate={{
                                                                    borderColor: [`rgba(${themeColorRgb}, 0.2)`, `rgba(${themeColorRgb}, 0.8)`, `rgba(${themeColorRgb}, 0.2)`],
                                                                    boxShadow: ['0 0 10px rgba(0,0,0,0)', `0 0 20px rgba(${themeColorRgb}, 0.2)`, '0 0 10px rgba(0,0,0,0)']
                                                                }}
                                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                                className={`flex items-start gap-3 w-full px-4 py-4 rounded-xl relative mt-2 border-2 border-dashed bg-black/40`}
                                                            >
                                                                <Circle className="w-4 h-4 mt-0.5 shrink-0 animate-pulse glow" style={{ color: themeColor }} strokeWidth={2} />
                                                                <div className="flex flex-col gap-1 w-full">
                                                                    <span className="text-sm font-serif tracking-wide font-bold" style={{ color: themeColor }}>
                                                                        {ui.guideStep4 || "2-1. Verify your existence."}
                                                                    </span>
                                                                    <span className={`text-sm font-serif tracking-wide leading-snug text-white/80 mt-1 block whitespace-pre-wrap break-keep`}>
                                                                        {ui.guideStep4Desc || "Please explore the gallery."}
                                                                    </span>
                                                                </div>
                                                            </motion.div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="tab-badges"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex flex-col gap-3 w-full"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-xs font-serif italic tracking-[0.2em] text-white/60">
                                                        {ui.archiveTitle || "Archive Records"}
                                                    </div>
                                                    <span className="text-xs font-serif px-4 py-1.5 rounded-full border" style={{ color: themeColor, backgroundColor: `rgba(${themeColorRgb}, 0.1)`, borderColor: `rgba(${themeColorRgb}, 0.3)` }}>
                                                        {badges.length} {ui.earned || "EARNED"}
                                                    </span>
                                                </div>

                                                {badges && badges.length > 0 ? (
                                                    badges.map((rawBadge, idx) => {
                                                        const def = ui?.badges?.[rawBadge.id] || { title: rawBadge.id, desc: '' };
                                                        let title = def.title || rawBadge.id;
                                                        let desc = def.desc || '';

                                                        if (rawBadge.vars) {
                                                            Object.entries(rawBadge.vars).forEach(([k, v]) => {
                                                                title = title.replace(`{${k}}`, v);
                                                                desc = desc.replace(`{${k}}`, v);
                                                            });
                                                        }

                                                        const badge = { ...rawBadge, title, desc };

                                                        return (
                                                            <motion.div
                                                                key={badge.id}
                                                                initial={{ opacity: 0, y: 15 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                className={`p-4 rounded-2xl flex flex-col gap-2 transition-all duration-300 ${badge.isMajor
                                                                    ? 'bg-gradient-to-br from-[#C5A059]/10 to-transparent border border-[#C5A059]/40 shadow-[0_0_20px_rgba(197,160,89,0.1)] backdrop-blur-md'
                                                                    : 'bg-black/20 border border-white/10 backdrop-blur-md'
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`flex items-center justify-between cursor-pointer ${expandedBadges[badge.id] ? 'border-b border-light/10 pb-3' : ''}`}
                                                                    onClick={() => {
                                                                        setExpandedBadges(prev => ({
                                                                            ...prev,
                                                                            [badge.id]: !prev[badge.id]
                                                                        }));
                                                                        if (playClick) playClick();
                                                                    }}
                                                                >
                                                                    <div className={`font-serif tracking-wide text-sm md:text-base ${badge.isMajor ? 'text-[#C5A059]' : 'text-white/90'}`}>
                                                                        {badge.title}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {badge.isMajor && <LucideSparkles size={16} className="text-[#C5A059]" />}
                                                                        {expandedBadges[badge.id] ?
                                                                            <LucideChevronUp size={16} className="text-white/40" /> :
                                                                            <LucideChevronDown size={16} className="text-white/40" />
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <AnimatePresence>
                                                                    {expandedBadges[badge.id] && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0 }}
                                                                            animate={{ opacity: 1, height: 'auto' }}
                                                                            exit={{ opacity: 0, height: 0 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="text-xs md:text-sm font-sans font-light tracking-wide text-white/50 leading-relaxed mt-2 pl-2 border-l-2 border-white/10">
                                                                                {badge.desc}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl border border-white/10 bg-black/20 mx-2">
                                                        <LucideAward size={36} className="mb-5 text-white/20" strokeWidth={1} />
                                                        <div className="text-center font-serif text-white/40 text-sm tracking-wide leading-relaxed">
                                                            {ui.noRecords || "No records found."}<br />{ui.exploreMore || "Explore the multiverse to collect memories."}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
