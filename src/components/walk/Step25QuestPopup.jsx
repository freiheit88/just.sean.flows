import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Music2 } from 'lucide-react';

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
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />

                {/* 2. Pure Authentic Web Glassmorphic Card (Real Transparency & Zero Artifacts) */}
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
                    className="relative w-[250px] sm:w-[270px] aspect-[232/340] rounded-[28px] p-5 flex flex-col items-center justify-between bg-black/65 backdrop-blur-2xl border border-[#D4AF37]/80 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] cursor-pointer group"
                >
                    {/* Top: 18K Gold Emblem with Warm Halo */}
                    <div className="flex-1 flex flex-col items-center justify-center relative w-full pt-1">
                        <div className="absolute w-24 h-24 rounded-full bg-[#E5A93C]/20 blur-xl pointer-events-none" />
                        <img 
                            src="/assets/logo/jsf_emblem_transparent.png" 
                            alt="18K Gold Emblem" 
                            className="relative z-10 w-20 sm:w-24 object-contain drop-shadow-[0_6px_16px_rgba(255,215,0,0.45)] select-none pointer-events-none"
                        />
                    </div>

                    {/* Middle: Crisp Neon Green Glowing Pulse Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onComplete}
                        className="w-full py-2 px-3 rounded-full border-2 border-[#00FF88] bg-[#00FF88]/15 hover:bg-[#00FF88]/25 shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center justify-center gap-2.5 transition-all cursor-pointer my-2.5 shrink-0"
                    >
                        <span className="text-base animate-bounce">🐾</span>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-xs font-black text-white tracking-wide leading-tight">
                                Keep Swiping Upward
                            </span>
                            <span className="font-mono text-[9px] font-black text-[#00FF88] tracking-wider uppercase leading-none">
                                IN PROGRESS · {countdown}s
                            </span>
                        </div>
                    </motion.button>

                    {/* Bottom: Luxury Option List */}
                    <div className="w-full space-y-2 pb-1 shrink-0">
                        <div 
                            onClick={onComplete}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left cursor-pointer transition-colors"
                        >
                            <Building2 className="w-4 h-4 text-neutral-300 shrink-0" />
                            <span className="font-sans text-[11px] font-bold text-neutral-200 leading-tight">
                                See the info? or Enter directly (Next)
                            </span>
                        </div>

                        <div 
                            onClick={onComplete}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left cursor-pointer transition-colors"
                        >
                            <Music2 className="w-4 h-4 text-[#E7FF00] shrink-0" />
                            <span className="font-sans text-[11px] font-bold text-neutral-200 leading-tight">
                                Enjoy Classical Music
                            </span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
