import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideChevronDown, LucideActivity } from 'lucide-react';

const MinaDirective = ({ text = "[ 할 말 없어서 멍 때리는중 ]", isVisible, activeStep, position = 'top', interactionMode = 'action', sysName = "SYSTEM CONSTRUCT: MINA", actionReq = ">> ACTION REQUIRED: SELECT A MULTIVERSE <<", isSpeaking = false }) => {
    if (!isVisible || !text) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="mina-scoreboard"
                initial={{ opacity: 0, y: -20, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: -90 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                style={{ perspective: "1000px" }}
                className="w-full relative z-[5000]"
            >
                {/* Scoreboard Frame */}
                <div
                    className="w-full bg-[#050505] border-[3px] border-[#1a1a1a] rounded-md shadow-[0_15px_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden relative flex flex-col"
                    style={{ height: 'max(15vh, 160px)' }}
                >

                    {/* Dark Glass / Glare Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20" />

                    {/* Speaking Pulse Alert */}
                    <AnimatePresence>
                        {isSpeaking && (
                            <motion.div
                                initial={{ opacity: 0, boxShadow: "inset 0 0 0px rgba(0,229,255,0)" }}
                                animate={{ opacity: [0, 0.6, 0], boxShadow: ["inset 0 0 0px rgba(0,229,255,0)", "inset 0 0 50px rgba(0,229,255,0.8)", "inset 0 0 0px rgba(0,229,255,0)"] }}
                                exit={{ opacity: 0, boxShadow: "inset 0 0 0px rgba(0,229,255,0)" }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 border-4 border-[#00E5FF] mix-blend-screen pointer-events-none z-30"
                            />
                        )}
                    </AnimatePresence>

                    {/* LED Dot Matrix Mesh */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.5)_2px,transparent_2px)] bg-[size:4px_4px] pointer-events-none z-10 opacity-60" />

                    {/* Top Bar (System Status) */}
                    <div className="min-h-[2rem] md:min-h-[3rem] py-1 bg-[#0a0a0a] border-b border-[#111] flex flex-wrap justify-between items-center px-2 md:px-6 z-0 gap-1 w-full overflow-hidden">
                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <motion.div
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] shrink-0"
                            />
                            <span className="text-[10px] md:text-sm lg:text-xl text-red-500/80 font-mono tracking-widest font-bold uppercase drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] truncate">
                                {sysName}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-sm lg:text-xl text-[#C5A059]/40 font-mono tracking-wider shrink-0">
                            V28.0.0
                        </span>
                    </div>

                    {/* Main Display Area (Text Marquee) */}
                    <div className="flex-1 flex flex-col justify-center px-2 md:px-4 overflow-hidden relative z-0">
                        <div className="relative w-full flex items-center justify-center h-full">
                            <span className={`w-full font-mono font-bold uppercase text-center transition-all duration-300 break-words ${isSpeaking ? 'scale-105 text-white' : 'text-[#E8D4A6]'}`}
                                style={{ fontSize: "clamp(18px, 6.5vw, 4.5rem)", letterSpacing: "0.1em", textShadow: isSpeaking ? "0 0 30px rgba(0,229,255,1), 0 0 60px rgba(0,229,255,0.6)" : "0 0 15px rgba(197,160,89,0.8), 0 0 30px rgba(197,160,89,0.4)", lineHeight: '1.2' }}>
                                {text}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="min-h-[2rem] md:min-h-[3rem] py-1 bg-[#0a0a0a] border-t border-[#111] flex items-center justify-center z-0 px-2 w-full overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {interactionMode === 'reading' ? (
                                <motion.div
                                    key="reading-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] md:text-xl lg:text-3xl text-[#C5A059] font-black tracking-[0.2em] md:tracking-[0.4em] uppercase animate-pulse drop-shadow-[0_0_8px_rgba(197,160,89,0.8)] text-center w-full break-words"
                                >
                                    [ TRANSMITTING... ]
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="action-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[9px] md:text-sm lg:text-lg text-[#00E5FF] font-mono tracking-[0.1em] md:tracking-[0.3em] font-bold uppercase drop-shadow-[0_0_5px_rgba(0,229,255,0.8)] text-center w-full break-words"
                                >
                                    {actionReq}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MinaDirective;
