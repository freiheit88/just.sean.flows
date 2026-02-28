import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideChevronDown, LucideActivity } from 'lucide-react';

const MinaDirective = ({ text, isVisible, activeStep, position = 'top', interactionMode = 'action', sysName = "SYSTEM CONSTRUCT: MINA", actionReq = ">> ACTION REQUIRED: SELECT A MULTIVERSE <<" }) => {
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
                <div className="w-full bg-[#050505] border-[3px] border-[#1a1a1a] rounded-md shadow-[0_15px_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden relative flex flex-col h-[80px] md:h-[100px]">

                    {/* Dark Glass / Glare Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20" />

                    {/* LED Dot Matrix Mesh */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.5)_2px,transparent_2px)] bg-[size:4px_4px] pointer-events-none z-10 opacity-60" />

                    {/* Top Bar (System Status) */}
                    <div className="h-6 md:h-8 bg-[#0a0a0a] border-b border-[#111] flex justify-between items-center px-3 z-0">
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"
                            />
                            <span className="text-[8px] md:text-[10px] text-red-500/80 font-mono tracking-widest font-bold uppercase drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                                {sysName}
                            </span>
                        </div>
                        <span className="text-[8px] md:text-[10px] text-[#C5A059]/40 font-mono tracking-wider">
                            V28.0.0
                        </span>
                    </div>

                    {/* Main Display Area (Text Marquee) */}
                    <div className="flex-1 flex flex-col justify-center px-4 overflow-hidden relative z-0">
                        <div className="relative w-full overflow-hidden flex items-center h-full">
                            <motion.div
                                animate={{ x: ["5%", "-100%"] }}
                                transition={{
                                    duration: Math.max(10, text.length * 0.15),
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: 1
                                }}
                                className="whitespace-nowrap absolute"
                            >
                                <span className="text-sm md:text-xl font-mono text-[#E8D4A6] font-bold uppercase tracking-[0.2em]"
                                    style={{ textShadow: "0 0 10px rgba(197,160,89,0.8), 0 0 20px rgba(197,160,89,0.4)" }}>
                                    {text}
                                    <span className="ml-16 opacity-0">*** Spacer ***</span>
                                    {text}
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="h-5 md:h-6 bg-[#0a0a0a] border-t border-[#111] flex items-center justify-center z-0">
                        <AnimatePresence mode="popLayout">
                            {interactionMode === 'reading' ? (
                                <motion.div
                                    key="reading-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[7px] md:text-[8px] text-[#C5A059]/50 font-mono tracking-[0.4em] uppercase"
                                >
                                    [ TRANSMITTING... ]
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="action-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[7px] md:text-[8px] text-[#00E5FF] font-mono tracking-[0.3em] font-bold uppercase drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]"
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
