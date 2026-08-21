import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Headphones } from 'lucide-react';

// 스마트폰 우측 네이티브 볼륨 인디케이터 (3초 자동 노출 후 슬라이드 아웃)
export function VolumePrompt({ isAudioUnlocked, activeFrameIdx }) {
    const [showVolumeRecommend, setShowVolumeRecommend] = useState(true);

    useEffect(() => {
        if (isAudioUnlocked) {
            const volTimer = setTimeout(() => {
                setShowVolumeRecommend(false);
            }, 3000);
            return () => clearTimeout(volTimer);
        }
    }, [isAudioUnlocked]);

    return (
        <AnimatePresence>
            {showVolumeRecommend && isAudioUnlocked && activeFrameIdx === 0 && (
                <motion.div
                    initial={{ opacity: 0, x: 60, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1.0 }}
                    exit={{ opacity: 0, x: 60, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="fixed right-3 sm:right-6 top-1/4 sm:top-1/3 z-50 pointer-events-none select-none flex items-center gap-2.5"
                >
                    {/* Leftside Floating Tip Pill */}
                    <motion.div 
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#E7FF00]/40 shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center gap-1.5 text-right"
                    >
                        <Headphones className="w-3 h-3 text-[#E7FF00] animate-pulse" />
                        <span className="font-mono text-[10px] font-bold text-neutral-200 tracking-tight">
                            권장 <strong className="text-[#E7FF00]">30%</strong>
                        </span>
                    </motion.div>

                    {/* Smartphone Native Right Vertical Volume Pill */}
                    <div className="w-8 sm:w-9 h-28 sm:h-32 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 p-1.5 flex flex-col items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(231,255,0,0.2)]">
                        {/* Top Speaker Icon */}
                        <Volume2 className="w-3.5 h-3.5 text-[#E7FF00] drop-shadow-[0_0_6px_#E7FF00] animate-pulse" />

                        {/* Vertical 30% Volume Track */}
                        <div className="relative w-2 sm:w-2.5 flex-1 my-1.5 bg-white/15 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
                            <motion.div 
                                initial={{ height: "0%" }}
                                animate={{ height: "30%" }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="w-full bg-gradient-to-t from-[#E7FF00] to-[#00F0FF] rounded-full shadow-[0_0_10px_#E7FF00]"
                            />
                        </div>

                        {/* Bottom Percentage */}
                        <span className="font-mono text-[8px] sm:text-[9px] font-black text-[#E7FF00] tracking-tighter">
                            30%
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
