import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_TIMELINE_STAGES } from '../../constants/timelineStages';
import { RotateCcw } from 'lucide-react';

function getCharThreshold(charIndex, lineIndex) {
    const seed = (charIndex * 137 + lineIndex * 269) % 1000;
    return seed / 1000;
}

export function Step07Timeline({ activeFrameIdx, tiltX, tiltY, onWalkAgain }) {
    // 60-second total master time (0.0 to 60.0s, ~12.0s per stage)
    const [totalElapsed, setTotalElapsed] = useState(0.0);
    const [isCompleted, setIsCompleted] = useState(false);

    const elapsedRef = useRef(0.0);
    const isPausedRef = useRef(false);

    const currentStage = Math.min(4, Math.floor(totalElapsed / 12.0));
    const stageProgress = Math.min(1.0, (totalElapsed % 12.0) / 10.0);

    useEffect(() => {
        if (activeFrameIdx !== 7) {
            setTotalElapsed(0.0);
            elapsedRef.current = 0.0;
            setIsCompleted(false);
            return;
        }

        const timer = setInterval(() => {
            if (isPausedRef.current) return;
            if (elapsedRef.current < 60.0) {
                const nextTime = Math.min(60.0, elapsedRef.current + 0.05);
                elapsedRef.current = nextTime;
                setTotalElapsed(nextTime);

                const withinStageProg = (nextTime % 12.0) / 10.0;
                setIsCompleted(withinStageProg >= 1.0 || nextTime >= 58.0);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [activeFrameIdx]);

    useEffect(() => {
        if (activeFrameIdx !== 7) return;

        let lastTouchY = 0;

        const updateScrollDelta = (deltaSeconds) => {
            isPausedRef.current = true;
            setTimeout(() => { isPausedRef.current = false; }, 3000);

            const next = Math.max(0.0, Math.min(60.0, elapsedRef.current + deltaSeconds));
            elapsedRef.current = next;
            setTotalElapsed(next);

            const withinStageProg = (next % 12.0) / 10.0;
            setIsCompleted(withinStageProg >= 1.0 || next >= 58.0);
        };

        const handleWheel = (e) => {
            const deltaSec = (e.deltaY > 0 ? 0.35 : -0.35);
            updateScrollDelta(deltaSec);
        };

        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                lastTouchY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const currentY = e.touches[0].clientY;
                const deltaY = lastTouchY - currentY;
                if (Math.abs(deltaY) > 8) {
                    const deltaSec = deltaY > 0 ? 0.45 : -0.45;
                    updateScrollDelta(deltaSec);
                    lastTouchY = currentY;
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [activeFrameIdx]);

    if (activeFrameIdx !== 7) return null;

    const data = ATELIER_TIMELINE_STAGES[currentStage];
    // Light expansion radius & brightness factor (0.0 to 1.0)
    const lightRatio = Math.min(1.0, totalElapsed / 60.0);

    // Dynamic radial mask: Starts as a tiny matchstick point light (radius ~8%) and expands to 130%
    const matchRadius = 8 + lightRatio * 115; // 8% -> 123%
    const ambientDarkness = Math.max(0.0, 0.96 - lightRatio * 0.90); // 96% dark -> 6% soft ambient

    const renderKineticLine = (text, lineIdx, startThreshold, endThreshold, textClass) => {
        const chars = text.split('');
        const lineSpan = endThreshold - startThreshold;

        return (
            <div className={`flex justify-center items-center ${textClass}`}>
                {chars.map((char, charIdx) => {
                    if (char === ' ') {
                        return <span key={charIdx} className="inline-block w-2 sm:w-3">&nbsp;</span>;
                    }

                    const rand = getCharThreshold(charIdx, lineIdx);
                    const charTrigger = startThreshold + rand * lineSpan;
                    const isRevealed = stageProgress >= charTrigger || isCompleted;

                    return (
                        <span
                            key={charIdx}
                            style={{
                                opacity: isRevealed ? 1 : 0,
                                transform: isRevealed 
                                    ? 'translate3d(0, 0, 0) scale(1)' 
                                    : `translate3d(${(rand - 0.5) * 35}px, ${(rand - 0.5) * 25}px, 0) scale(0.35)`,
                                filter: isRevealed ? 'blur(0px)' : 'blur(10px)',
                                transition: 'opacity 0.35s ease-out, transform 0.45s ease-out, filter 0.35s ease-out',
                                display: 'inline-block'
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden flex flex-col justify-between">
            {/* 1. Pure Physical Darkness & Matchstick Light Reveal Mask (No fake glowing graphics) */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
                style={{
                    background: `radial-gradient(
                        circle at 25% 78%,
                        transparent 0%,
                        transparent ${matchRadius * 0.4}%,
                        rgba(0, 0, 0, ${ambientDarkness * 0.7}) ${matchRadius * 0.8}%,
                        rgba(0, 0, 0, ${ambientDarkness}) ${matchRadius}%
                    )`
                }}
            />

            {/* 2. Top-Anchored Progressive Typography (Illuminates in sync with light expansion) */}
            <div className="w-full flex flex-col items-center px-4 pt-10 sm:pt-14 z-30">
                <div 
                    className="w-full max-w-xs sm:max-w-sm flex flex-col items-center"
                    style={{
                        transform: `perspective(600px) translate3d(${tiltX * 0.2}px, ${tiltY * 0.2}px, 12px) rotateX(${-tiltY * 0.25}deg) rotateY(${tiltX * 0.25}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.15s ease-out'
                    }}
                >
                    {/* Element A: 01/05 Index */}
                    <div className="flex items-center gap-3 mb-3 border-b border-white/15 pb-1.5 px-3">
                        <motion.span 
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2.0 }}
                            className="font-mono font-black text-xs sm:text-sm text-[#E7FF00] tracking-widest uppercase drop-shadow-[0_0_10px_rgba(231,255,0,0.9)]"
                        >
                            {data.num}
                        </motion.span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />

                        {/* Element B: Date Tag */}
                        <span 
                            style={{
                                opacity: stageProgress >= 0.15 || isCompleted ? 1 : 0,
                                transform: stageProgress >= 0.15 || isCompleted ? 'translateY(0)' : 'translateY(4px)',
                                transition: 'all 0.4s ease-out'
                            }}
                            className="font-mono text-[10px] sm:text-[11px] font-bold text-white/80 tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        >
                            {data.dateTag}
                        </span>
                    </div>

                    {/* Element C: Massive Stacked Title */}
                    <motion.div 
                        animate={isCompleted ? {
                            scale: [1, 1.025, 0.99, 1.02, 1],
                            filter: [
                                "drop-shadow(0 0 18px rgba(255,224,130,0.85)) drop-shadow(0 0 35px rgba(231,255,0,0.65)) drop-shadow(0 4px 18px rgba(0,0,0,1))",
                                "drop-shadow(0 0 35px rgba(255,255,255,1)) drop-shadow(0 0 65px rgba(255,193,7,0.95)) drop-shadow(0 4px 18px rgba(0,0,0,1))",
                                "drop-shadow(0 0 18px rgba(255,224,130,0.85)) drop-shadow(0 0 35px rgba(231,255,0,0.65)) drop-shadow(0 4px 18px rgba(0,0,0,1))"
                            ]
                        } : {}}
                        transition={isCompleted ? {
                            repeat: Infinity,
                            duration: 1.8,
                            ease: "easeInOut"
                        } : {}}
                        className="flex flex-col items-center gap-0.5 sm:gap-1 my-1"
                    >
                        {data.lines.map((lineText, lIdx) => {
                            const startRatio = 0.15 + (lIdx / data.lines.length) * 0.55;
                            const endRatio = 0.15 + ((lIdx + 1) / data.lines.length) * 0.55;
                            return (
                                <div key={lIdx}>
                                    {renderKineticLine(
                                        lineText,
                                        lIdx,
                                        startRatio,
                                        endRatio,
                                        "font-sans font-black text-3xl sm:text-4xl tracking-[0.24em] text-white uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,1)] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Element D: Poetic Subtitle */}
                    <div className="mt-3 min-h-[32px] flex items-center justify-center text-center px-2">
                        {renderKineticLine(
                            data.subline,
                            4,
                            0.70,
                            0.98,
                            "font-mono text-xs sm:text-[13px] text-neutral-200 font-medium tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Bottom Action Area (Walk Again on Stage 05) */}
            <div className="w-full flex flex-col items-center pb-8 z-30 pointer-events-auto">
                {currentStage === 4 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ 
                            opacity: isCompleted ? 1 : 0.6, 
                            scale: isCompleted ? 1 : 0.95, 
                            y: isCompleted ? 0 : 5 
                        }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onWalkAgain}
                        className="px-6 py-2.5 rounded-full bg-[#E7FF00] text-black font-mono font-black text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(231,255,0,0.85)] flex items-center justify-center gap-2 cursor-pointer hover:bg-white transition-all"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>WALK AGAIN</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
}
