import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Headphones } from 'lucide-react';

export function VolumePrompt({ isAudioUnlocked, activeFrameIdx, tiltX, tiltY }) {
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
                    initial={{ opacity: 0, scale: 0.85, y: 15 }}
                    animate={{ opacity: 1, scale: 1.0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -15, filter: "blur(8px)" }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none p-4 select-none"
                    style={{
                        perspective: 600,
                        transform: `translate3d(${tiltX * 0.2}px, ${tiltY * 0.2}px, 20px) rotateX(${-tiltY * 0.3}deg) rotateY(${tiltX * 0.3}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.15s ease-out'
                    }}
                >
                    <div className="relative px-6 py-5 rounded-3xl bg-black/85 border border-[#E7FF00]/60 shadow-[0_0_50px_rgba(231,255,0,0.35),0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col items-center text-center max-w-[280px]">
                        {/* Ambient glow badge */}
                        <div className="flex items-center gap-1.5 mb-3 px-3 py-0.5 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/30 font-mono text-[9px] font-black text-[#E7FF00] tracking-[0.2em] uppercase">
                            <Headphones className="w-3 h-3 text-[#E7FF00] animate-pulse" />
                            <span>AUDIO IMMERSION</span>
                        </div>

                        <div className="flex items-center gap-2.5 mb-2">
                            <Volume2 className="w-6 h-6 text-[#E7FF00] drop-shadow-[0_0_12px_#E7FF00] animate-bounce" />
                            <span className="font-mono text-2xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                                VOL 30%
                            </span>
                        </div>

                        {/* Sleek 30% Volume Bar */}
                        <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden mb-2.5 p-0.5 border border-white/10">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "30%" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#E7FF00] to-[#00F0FF] rounded-full shadow-[0_0_10px_#E7FF00]"
                            />
                        </div>

                        <p className="font-sans text-[11px] text-neutral-300 font-medium tracking-tight leading-tight">
                            볼륨을 약 <strong className="text-[#E7FF00]">30%</strong>로 맞추시면<br />
                            가장 완벽한 공간 음향을 즐기실 수 있습니다.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
