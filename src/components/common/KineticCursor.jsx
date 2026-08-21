import React from 'react';
import { motion } from 'framer-motion';
import { Music, ChevronUp } from 'lucide-react';

export function KineticCursor({ cursorPos, trails, isScrollingUp }) {
    if (!cursorPos.isHovered) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {/* 4 Musical Trailing Afterimages */}
            {trails.map((t, idx) => {
                const sizes = ['w-12 h-12', 'w-10 h-10', 'w-8 h-8', 'w-6 h-6'];
                const opacities = [0.45, 0.32, 0.22, 0.14];
                const blurs = ['blur-[2px]', 'blur-[4px]', 'blur-[6px]', 'blur-[8px]'];
                const scales = [1.0, 0.88, 0.74, 0.60];
                return (
                    <div
                        key={idx}
                        className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${sizes[idx]} ${blurs[idx]} ${
                            isScrollingUp 
                                ? 'bg-gradient-to-tr from-[#E7FF00] to-[#00F0FF]' 
                                : 'bg-[#E7FF00]'
                        }`}
                        style={{
                            left: `${t.x}px`,
                            top: `${t.y}px`,
                            opacity: opacities[idx],
                            transform: `translate(-50%, -50%) scale(${scales[idx]})`
                        }}
                    />
                );
            })}

            {/* Glowing Core Head Target */}
            <div 
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                    left: `${cursorPos.rawX}px`,
                    top: `${cursorPos.rawY}px`,
                }}
            >
                <div 
                    className={`w-14 h-14 rounded-full transition-all duration-300 ${
                        isScrollingUp 
                            ? 'bg-radial from-[#E7FF00]/40 via-[#00F0FF]/25 to-transparent scale-125' 
                            : 'bg-radial from-[#E7FF00]/20 via-white/[0.05] to-transparent'
                    }`} 
                />

                <div 
                    className={`absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 flex items-center justify-center ${
                        isScrollingUp 
                            ? 'w-7 h-7 bg-[#E7FF00]/80 shadow-[0_0_25px_#E7FF00,0_0_40px_#00F0FF] scale-110' 
                            : 'w-4 h-4 bg-[#E7FF00]/60 shadow-[0_0_14px_#E7FF00]'
                    }`} 
                >
                    <Music className={`w-3 h-3 text-black transition-transform ${isScrollingUp ? 'scale-125' : 'scale-90'}`} />
                </div>

                {/* Borderless Floating ^ WALK FORWARD Indicator */}
                {isScrollingUp && (
                    <motion.div 
                        initial={{ opacity: 0, y: 0, scale: 0.85 }}
                        animate={{ opacity: 1, y: -18, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 font-mono text-[10px] sm:text-xs font-black text-[#E7FF00] whitespace-nowrap tracking-widest pointer-events-none select-none drop-shadow-[0_0_12px_rgba(231,255,0,0.9)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                    >
                        <ChevronUp className="w-3.5 h-3.5 animate-bounce text-[#E7FF00]" />
                        <span>WALK FORWARD</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
