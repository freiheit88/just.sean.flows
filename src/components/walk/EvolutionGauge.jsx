import React from 'react';
import { motion } from 'framer-motion';

export function EvolutionGauge({ progress, activeFrameIdx, isScrollingUp }) {
    return (
        <div className="absolute inset-x-0 bottom-14 sm:bottom-6 z-30 pointer-events-auto flex flex-col items-center gap-1.5 select-none">
            {/* Evolutionary Stage Badge & Wing Nodes */}
            <div className="flex items-center gap-2">
                {activeFrameIdx >= 3 && (
                    <motion.span 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[9px] text-[#E7FF00] drop-shadow-[0_0_8px_#E7FF00]"
                    >
                        {activeFrameIdx === 6 ? '✦ 🏛️ ✦' : '✦'}
                    </motion.span>
                )}

                {/* Dynamic Evolutionary Track Frame */}
                <div 
                    className={`relative rounded-full overflow-hidden transition-all duration-500 flex items-center ${
                        activeFrameIdx === 6
                            ? 'w-52 sm:w-72 h-2.5 bg-gradient-to-r from-[#00F0FF]/30 via-[#E7FF00]/40 to-[#FF007F]/30 border border-[#E7FF00] shadow-[0_0_25px_rgba(231,255,0,0.8),0_0_40px_rgba(0,240,255,0.6)]'
                            : activeFrameIdx === 5
                                ? 'w-48 sm:w-68 h-2 bg-black/80 border border-[#E7FF00]/80 shadow-[0_0_20px_rgba(231,255,0,0.6)]'
                                : activeFrameIdx === 4
                                    ? 'w-44 sm:w-64 h-1.5 bg-black/70 border border-[#FFA000]/60 shadow-[0_0_15px_#FFA000]'
                                    : activeFrameIdx === 3
                                        ? 'w-44 sm:w-64 h-1.5 bg-white/20 border border-[#FFE082]/50 shadow-[0_0_12px_#FFE082]'
                                        : activeFrameIdx >= 1
                                            ? 'w-40 sm:w-60 h-1 bg-white/20 border border-[#00F0FF]/40 shadow-[0_0_10px_#00F0FF]'
                                            : 'w-40 sm:w-60 h-1 bg-white/15'
                    } ${isScrollingUp ? 'scale-105' : 'scale-100'}`}
                >
                    {/* Inner Energy Fill */}
                    <motion.div
                        className={`h-full rounded-full transition-all duration-75 ${
                            activeFrameIdx === 6
                                ? 'bg-gradient-to-r from-[#E7FF00] via-[#00F0FF] via-[#FFE082] to-[#FF007F] shadow-[0_0_15px_#E7FF00]'
                                : activeFrameIdx === 5
                                    ? 'bg-gradient-to-r from-[#E7FF00] via-[#00F0FF] to-[#E7FF00] shadow-[0_0_12px_#E7FF00]'
                                    : activeFrameIdx === 4
                                        ? 'bg-gradient-to-r from-[#FFE082] to-[#FF8F00] shadow-[0_0_10px_#FFA000]'
                                        : activeFrameIdx === 3
                                            ? 'bg-gradient-to-r from-[#FFE082] to-[#E7FF00]'
                                            : activeFrameIdx >= 1
                                                ? 'bg-gradient-to-r from-[#E7FF00] to-[#00F0FF]'
                                                : 'bg-[#E7FF00]'
                        }`}
                        style={{ width: `${progress}%` }}
                    />

                    {/* Stage 6/7 Prismatic Caustic Light Sweep on Bar */}
                    {activeFrameIdx >= 5 && (
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                            className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 pointer-events-none"
                        />
                    )}
                </div>

                {activeFrameIdx >= 3 && (
                    <motion.span 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[9px] text-[#E7FF00] drop-shadow-[0_0_8px_#E7FF00]"
                    >
                        {activeFrameIdx === 6 ? '✦ 🏛️ ✦' : '✦'}
                    </motion.span>
                )}
            </div>

            {/* Stage Level Indicator */}
            <div className="flex items-center gap-1 opacity-75">
                <span className="font-mono text-[8px] tracking-widest text-[#E7FF00] font-black uppercase">
                    {activeFrameIdx === 6 
                        ? 'STAGE VII • ATELIER TRANSCENDED' 
                        : `STAGE 0${activeFrameIdx + 1} / 07`}
                </span>
            </div>
        </div>
    );
}
