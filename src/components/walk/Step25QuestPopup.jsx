import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Step25QuestPopup({ 
    isOpen = false, 
    onComplete, 
    tiltX = 0, 
    tiltY = 0 
}) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!isOpen) {
            setCountdown(5);
            return;
        }

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-40 flex items-center justify-center pointer-events-auto select-none px-4"
                onClick={onComplete}
            >
                {/* 1. Frosted Translucent Backdrop Overlay */}
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[1.5px] pointer-events-none" />

                {/* 2. Main 1:1 Pixel-Perfect Glassmorphic Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.90, y: 12 }}
                    animate={{ opacity: 1, scale: 1.0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        transform: `perspective(1000px) rotateX(${-tiltY * 0.45}deg) rotateY(${tiltX * 0.45}deg) translate3d(${tiltX * 0.5}px, ${tiltY * 0.5}px, 10px)`,
                        transformStyle: 'preserve-3d'
                    }}
                    className="relative w-[240px] sm:w-[260px] aspect-[232/340] rounded-[28px] overflow-hidden border border-[#D4AF37]/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.35)] cursor-pointer group"
                >
                    {/* Layer A: Authentic High-Res Card Graphic with Frosted Glass & Gold Emblem */}
                    <img 
                        src="/assets/quest_card_exact_cutout.png" 
                        alt="Quest Card" 
                        className="w-full h-full object-cover select-none pointer-events-none drop-shadow-2xl"
                    />

                    {/* Layer B: Live Countdown Pulse Badge over Green Button */}
                    <div 
                        onClick={onComplete}
                        className="absolute bottom-[36%] inset-x-[8%] h-[15%] rounded-full flex items-center justify-end pr-3 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                        <span className="font-mono text-[9px] font-black text-[#00FF88] uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded-full border border-[#00FF88]/50 shadow-[0_0_8px_#00FF88]">
                            {countdown}s
                        </span>
                    </div>

                    {/* Layer C: Interactive Touch Zones */}
                    <div 
                        onClick={onComplete}
                        className="absolute bottom-[18%] inset-x-[8%] h-[14%] rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    />
                    <div 
                        onClick={onComplete}
                        className="absolute bottom-[4%] inset-x-[8%] h-[14%] rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
