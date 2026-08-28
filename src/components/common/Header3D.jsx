import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const HEADER_LETTERS = [
    { char: 'J', group: 0, xSpread: -24 },
    { char: 'U', group: 0, xSpread: -18 },
    { char: 'S', group: 0, xSpread: -12 },
    { char: 'T', group: 0, xSpread: -6 },
    { char: '•', group: 0, isDot: true, xSpread: 0 },
    { char: 'S', group: 1, xSpread: 6 },
    { char: 'E', group: 1, xSpread: 12 },
    { char: 'A', group: 1, xSpread: 18 },
    { char: 'N', group: 1, xSpread: 24 },
    { char: '•', group: 1, isDot: true, xSpread: 0 },
    { char: 'F', group: 2, xSpread: 32 },
    { char: 'L', group: 2, xSpread: 40 },
    { char: 'O', group: 2, xSpread: 48 },
    { char: 'W', group: 2, xSpread: 56 },
    { char: 'S', group: 2, xSpread: 64 }
];

export function Header3D({ 
    isFlowsHit, 
    tiltX = 0, 
    tiltY = 0,
    isMuted = false,
    onToggleMute
}) {
    const [isVolumeSwallowed, setIsVolumeSwallowed] = useState(false);
    const [isMagnetLocked, setIsMagnetLocked] = useState(false);

    useEffect(() => {
        const swallowTimer = setTimeout(() => setIsVolumeSwallowed(true), 3600);
        return () => clearTimeout(swallowTimer);
    }, []);

    // 2.0s Free Float -> 1.0s Snap Lock Cycle
    useEffect(() => {
        let isCancelled = false;

        const cycleLoop = () => {
            setTimeout(() => {
                if (isCancelled) return;
                setIsMagnetLocked(true);

                setTimeout(() => {
                    if (isCancelled) return;
                    setIsMagnetLocked(false);
                    cycleLoop();
                }, 1000);
            }, 2000);
        };

        cycleLoop();

        return () => {
            isCancelled = true;
        };
    }, []);

    useEffect(() => {
        if (isFlowsHit) {
            setIsVolumeSwallowed(true);
        }
    }, [isFlowsHit]);

    const effectiveTiltX = isMagnetLocked ? 0 : tiltX;
    const effectiveTiltY = isMagnetLocked ? 0 : tiltY;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
            className="fixed top-5 sm:top-6 left-0 right-0 z-[9999] px-6 py-2 flex items-center justify-center pointer-events-none select-none"
        >
            <motion.div 
                animate={{
                    x: effectiveTiltX * 5,
                    y: isMagnetLocked ? 0 : [0, -3, 0],
                    rotateX: 0,
                    rotateY: -effectiveTiltX * 4,
                    scale: isFlowsHit ? 1.08 : isMagnetLocked ? 1.02 : 1.0,
                    borderColor: isFlowsHit 
                        ? '#E7FF00' 
                        : isMagnetLocked 
                        ? 'rgba(255, 215, 0, 0.9)' 
                        : 'rgba(255, 255, 255, 0.25)',
                    boxShadow: isFlowsHit 
                        ? '0 0 35px rgba(231, 255, 0, 0.75)' 
                        : isMagnetLocked 
                        ? '0 0 25px rgba(255, 215, 0, 0.65), 0 10px 30px rgba(0,0,0,0.9)' 
                        : '0 8px 32px rgba(0,0,0,0.65), 0 0 20px rgba(255,215,0,0.2), inset 0 1px 1px rgba(255,255,255,0.45)'
                }}
                transition={{
                    y: { repeat: isMagnetLocked ? 0 : Infinity, duration: 3.2, ease: "easeInOut" },
                    type: "spring",
                    stiffness: isMagnetLocked ? 420 : 180,
                    damping: isMagnetLocked ? 24 : 18
                }}
                className="relative pointer-events-auto flex items-center justify-center gap-2 sm:gap-2.5 px-5 py-2 rounded-full bg-gradient-to-b from-white/15 via-black/70 to-black/90 backdrop-blur-2xl border transition-all duration-300 group cursor-default overflow-hidden"
            >
                {/* Bubble Specular Curved Glass Glint */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 via-white/5 to-transparent rounded-t-full pointer-events-none" />

                {/* 18K Champagne Gold Glowing Indicator Dot */}
                <div 
                    className={`w-2 h-2 rounded-full transition-all duration-500 relative z-10 ${
                        isMagnetLocked ? 'bg-[#FFD700] shadow-[0_0_12px_#FFD700] scale-125' : 'bg-[#C8A96E] shadow-[0_0_8px_#C8A96E]'
                    }`} 
                />

                {/* Letters Container */}
                <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs sm:text-sm font-black tracking-widest text-[#F7EBE1]">
                    {HEADER_LETTERS.map((item, idx) => (
                        <motion.span
                            key={idx}
                            animate={{
                                color: isFlowsHit ? '#E7FF00' : isMagnetLocked ? '#FFD700' : '#F7EBE1',
                                y: isMagnetLocked ? 0 : [0, -1.5, 0],
                                textShadow: isMagnetLocked ? '0 0 8px rgba(255, 215, 0, 0.6)' : 'none'
                            }}
                            transition={{
                                color: { duration: 0.25 },
                                y: { repeat: isMagnetLocked ? 0 : Infinity, duration: 2.2, delay: idx * 0.04 }
                            }}
                            className={item.isDot ? 'text-[#C8A96E] px-0.5' : ''}
                        >
                            {item.char}
                        </motion.span>
                    ))}
                </div>

                {/* 432Hz Sound Master Swallowed Button */}
                {isVolumeSwallowed && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: 'auto' }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        onClick={onToggleMute}
                        className="ml-2 pl-2 border-l border-white/20 flex items-center justify-center text-[#C8A96E] hover:text-[#E7FF00] hover:scale-110 transition-all cursor-pointer"
                        title={isMuted ? "432Hz Harmonic Sound Unmute" : "432Hz Sound Mute"}
                    >
                        {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                        ) : (
                            <Volume2 className="w-3.5 h-3.5 text-[#E7FF00] animate-pulse" />
                        )}
                    </motion.button>
                )}
            </motion.div>
        </motion.header>
    );
}
