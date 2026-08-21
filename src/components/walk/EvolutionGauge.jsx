import React from 'react';
import { motion } from 'framer-motion';

export function EvolutionGauge({ progress, isAudioUnlocked }) {
    return (
        <div className="absolute inset-x-0 bottom-3 sm:bottom-4 px-6 pointer-events-none flex flex-col items-center select-none z-30">
            {/* Pure Minimal Glowing Progress Gauge (Mobile-Optimized) */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isAudioUnlocked ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[260px] h-2 bg-white/20 rounded-full overflow-hidden p-0.5 border border-white/20 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
                <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#E7FF00] via-[#00F0FF] to-[#E7FF00] shadow-[0_0_12px_#E7FF00] transition-all duration-150"
                    style={{ width: `${Math.max(4, Math.min(100, progress))}%` }}
                />
            </motion.div>
        </div>
    );
}
