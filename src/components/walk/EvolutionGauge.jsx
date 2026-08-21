import React from 'react';
import { motion } from 'framer-motion';

export function EvolutionGauge({ progress, isAudioUnlocked }) {
    return (
        <div className="absolute inset-x-0 bottom-4 px-8 pointer-events-none flex flex-col items-center select-none z-20">
            {/* Pure Minimal Glowing Progress Gauge (No Text) */}
            <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: isAudioUnlocked ? 1 : 0, scaleX: isAudioUnlocked ? 1 : 0 }}
                transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[240px] h-1.5 bg-white/15 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
                <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-[#E7FF00] via-[#00F0FF] to-[#E7FF00] shadow-[0_0_12px_#E7FF00]"
                    style={{ width: `${Math.max(4, progress)}%` }}
                    transition={{ duration: 0.15 }}
                />
            </motion.div>
        </div>
    );
}
