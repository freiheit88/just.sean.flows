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
    // phase: 'center' (0.0s - 2.6s) -> 'ascending' (2.6s - 3.5s) -> 'docked' (3.5s+)
    const [phase, setPhase] = useState('center');
    const [isVolumeSwallowed, setIsVolumeSwallowed] = useState(false);
    
    // Magnetic Snap & 1-Second Origin Lock State
    // Cycle: 2.0s Free Float -> Snap to Origin & Lock for 1.0s -> Repeat
    const [isMagnetLocked, setIsMagnetLocked] = useState(false);

    useEffect(() => {
        const ascendTimer = setTimeout(() => setPhase('ascending'), 2600);
        const dockTimer = setTimeout(() => setPhase('docked'), 3500);
        const swallowTimer = setTimeout(() => setIsVolumeSwallowed(true), 4800);

        return () => {
            clearTimeout(ascendTimer);
            clearTimeout(dockTimer);
            clearTimeout(swallowTimer);
        };
    }, []);

    // 2.0s Free -> 1.0s Snap Lock Cycle
    useEffect(() => {
        let isCancelled = false;

        const cycleLoop = () => {
            // Free phase: 2000ms
            setTimeout(() => {
                if (isCancelled) return;
                // Snap to Origin & Lock for 1000ms
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

    const isCenter = phase === 'center';

    // When Magnet is Locked, target offset is precisely (0, 0)
    const effectiveTiltX = isMagnetLocked ? 0 : tiltX;
    const effectiveTiltY = isMagnetLocked ? 0 : tiltY;

    return (
        <motion.header
            animate={{
                top: isCenter ? '45vh' : '24px',
                y: isCenter ? '-50%' : '0%',
                scale: isCenter ? 1.35 : 1.0
            }}
            transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1]
            }}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
            className="fixed left-0 right-0 z-[9999] px-6 py-2 flex items-center justify-center pointer-events-none select-none"
        >
            <motion.div 
                animate={{
                    x: effectiveTiltX * (isCenter ? 14 : 5),
                    y: isCenter ? (effectiveTiltY * 10) : Math.max(0, effectiveTiltY * 2.5),
                    rotateX: isCenter ? effectiveTiltY * 8 : 0,
                    rotateY: isCenter ? -effectiveTiltX * 8 : 0,
                    scale: isFlowsHit ? 1.08 : isMagnetLocked ? 1.02 : 1.0,
                    borderColor: isFlowsHit 
                        ? '#E7FF00' 
                        : isMagnetLocked 
                        ? 'rgba(255, 215, 0, 0.9)' 
                        : isCenter 
                        ? 'rgba(200, 169, 110, 0.75)' 
                        : 'rgba(200, 169, 110, 0.40)',
                    boxShadow: isFlowsHit 
                        ? '0 0 35px rgba(231, 255, 0, 0.75)' 
                        : isMagnetLocked 
                        ? '0 0 25px rgba(255, 215, 0, 0.65), 0 10px 30px rgba(0,0,0,0.9)' 
                        : isCenter 
                        ? '0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(200,169,110,0.45)'
                        : '0 4px 25px rgba(0,0,0,0.8), 0 0 15px rgba(200,169,110,0.2)'
                }}
                transition={{
                    type: "spring",
                    stiffness: isMagnetLocked ? 420 : 180,
                    damping: isMagnetLocked ? 24 : 18
                }}
                className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-2.5 px-5 py-2 rounded-full bg-black/80 backdrop-blur-xl border shadow-2xl transition-all duration-300 group cursor-default"
            >
                {/* 18K Champagne Gold Glowing Indicator Dot */}
                <div 
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
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
