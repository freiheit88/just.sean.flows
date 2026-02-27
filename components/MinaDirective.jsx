import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideChevronDown, LucideActivity } from 'lucide-react';

const MinaDirective = ({ text, isVisible, activeStep, position = 'top', interactionMode = 'action', sysName = "SYSTEM CONSTRUCT: MINA", actionReq = ">> ACTION REQUIRED: SELECT A MULTIVERSE <<" }) => {
    if (!isVisible || !text) return null;

    // The container dynamically shifts from the center to the top based on the prop.
    const positionClasses = position === 'center'
        ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-auto min-w-[320px] md:min-w-[480px] max-w-[600px] z-[5000] transition-all duration-1000 ease-in-out"
        : "fixed top-2 md:top-6 left-1/2 -translate-x-1/2 w-[95vw] md:w-auto min-w-[320px] md:min-w-[480px] max-w-[600px] z-[5000] transition-all duration-1000 ease-in-out";

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="mina-directive"
                initial={{ opacity: 0, scaleY: 0, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scaleY: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // smooth swift expansion
                className={positionClasses}
                style={{ transformOrigin: 'center' }}
            >
                {/* Continuous breathing glow around the box */}
                <motion.div
                    animate={{ boxShadow: ['0 0 20px rgba(197,160,89,0.1)', '0 0 40px rgba(197,160,89,0.3)', '0 0 20px rgba(197,160,89,0.1)'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative bg-black/85 backdrop-blur-xl border-2 border-[#C5A059]/60 flex flex-col overflow-hidden"
                >
                    {/* Technical Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C5A059]" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C5A059]" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C5A059]" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C5A059]" />

                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-30" />

                    {/* HEADER */}
                    <div className="relative border-b border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/20 to-transparent px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]"
                            />
                            <span className="text-[10px] md:text-xs font-black text-[#E8D4A6] uppercase tracking-[0.4em] font-mono">
                                {sysName}
                            </span>
                        </div>
                        <span className="text-[9px] font-mono text-[#C5A059]/50 tracking-widest hidden md:block">v24.0.0</span>
                    </div>

                    {/* BODY (Text) */}
                    <div className="relative px-6 py-6 md:py-8 min-h-[120px] flex items-center justify-center">
                        <p className="text-[15px] md:text-[18px] font-serif italic text-[#FDFCF0] font-medium leading-[1.8] tracking-wider text-center drop-shadow-md">
                            "{text}"
                        </p>
                    </div>

                    {/* FOOTER / ACTION PROMPT */}
                    <div className="relative border-t border-[#C5A059]/30 bg-black/40 px-4 py-2 h-10 flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                            {interactionMode === 'reading' ? (
                                <motion.div
                                    key="reading-state"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 text-[#C5A059]/70"
                                >
                                    <LucideActivity size={12} className="animate-pulse" />
                                    <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.5em] animate-pulse">
                                        [ TRANSMITTING... ]
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="action-state"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 text-[#00E5FF]"
                                    style={{ textShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
                                >
                                    <motion.div
                                        animate={{ y: [0, 4, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <LucideChevronDown size={14} />
                                    </motion.div>
                                    <span className="text-[10px] md:text-[11px] font-black font-sans uppercase tracking-[0.3em]">
                                        {actionReq}
                                    </span>
                                    <motion.div
                                        animate={{ y: [0, 4, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <LucideChevronDown size={14} />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MinaDirective;
