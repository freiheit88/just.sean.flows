import React from 'react';
import { motion } from 'framer-motion';

export function EvolutionGauge({ progress, activeFrameIdx, isScrollingUp, isAudioUnlocked }) {
    const stageNum = Math.min(7, Math.max(1, activeFrameIdx + 1));
    const stageStr = `STAGE 0${stageNum} / 07`;

    return (
        <div className="absolute inset-x-0 bottom-3 px-6 pointer-events-none flex flex-col items-center select-none z-20">
            {/* Progress Bar: Slides in at 2.1s */}
            <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: isAudioUnlocked ? 1 : 0, scaleX: isAudioUnlocked ? 1 : 0 }}
                transition={{ delay: 2.1, duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[280px] h-1.5 bg-white/15 rounded-full overflow-hidden p-0.5 border border-white/10"
            >
                <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-[#E7FF00] via-[#00F0FF] to-[#E7FF00] shadow-[0_0_12px_#E7FF00]"
                    style={{ width: `${Math.max(4, progress)}%` }}
                    transition={{ duration: 0.15 }}
                />
            </motion.div>

            {/* Stage Text: Fades in at 2.7s */}
            <motion.span 
                initial={{ opacity: 0, letterSpacing: "0.4em" }}
                animate={{ opacity: isAudioUnlocked ? 1 : 0, letterSpacing: isAudioUnlocked ? "0.2em" : "0.4em" }}
                transition={{ delay: 2.7, duration: 0.7, ease: "easeOut" }}
                className="font-mono text-[9px] font-black text-white/50 tracking-[0.2em] uppercase mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
            >
                {stageStr}
            </motion.span>
        </div>
    );
}
