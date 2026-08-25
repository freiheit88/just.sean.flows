import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_TIMELINE_STAGES } from '../../constants/timelineStages';
import { RotateCcw, Sparkles } from 'lucide-react';

function getCharThreshold(charIndex, lineIndex) {
    const seed = (charIndex * 137 + lineIndex * 269) % 1000;
    return seed / 1000;
}

export function Step07Timeline({ activeFrameIdx, tiltX, tiltY, onWalkAgain, onOpenMuseum }) {
    // 60-second total master time (0.0 to 60.0s, ~12.0s per stage)
    const [totalElapsed, setTotalElapsed] = useState(0.0);
    const [isCompleted, setIsCompleted] = useState(false);

    const elapsedRef = useRef(0.0);
    const isPausedRef = useRef(false);

    const isStep7 = (activeFrameIdx === 6);

    const currentStage = Math.min(4, Math.floor(totalElapsed / 12.0));
    const stageProgress = Math.min(1.0, (totalElapsed % 12.0) / 10.0);

    useEffect(() => {
        if (!isStep7) {
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
    }, [isStep7]);

    useEffect(() => {
        if (!isStep7) return;

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
    }, [isStep7]);

    if (!isStep7) return null;

    const data = ATELIER_TIMELINE_STAGES[currentStage];
    const lightRatio = Math.min(1.0, totalElapsed / 60.0);

    const textBloomY = (1.0 - lightRatio) * 190;
    const textBloomScale = 0.75 + lightRatio * 0.25;
    const letterSpread = (1.0 - lightRatio) * 45;

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

                    const scatterX = (rand - 0.5) * letterSpread;
                    const scatterY = (rand - 0.5) * (letterSpread * 0.8) + (1.0 - lightRatio) * 30;

                    return (
                        <span
                            key={charIdx}
                            style={{
                                opacity: isRevealed ? 1 : 0,
                                transform: isRevealed 
                                    ? 'translate3d(0, 0, 0) scale(1)' 
                                    : `translate3d(${scatterX}px, ${scatterY}px, 0) scale(0.3)`,
                                filter: isRevealed ? 'blur(0px)' : 'blur(12px)',
                                transition: 'opacity 0.35s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease-out',
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
            {/* 1. Natural Organic Chiaroscuro Candlelight & Deep Velvet Shadow Mask */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
                style={{
                    background: `radial-gradient(
                        ellipse ${38 + lightRatio * 82}% ${28 + lightRatio * 72}% at 50% 74%,
                        rgba(255, 235, 170, ${0.18 * (1.0 - lightRatio) + 0.08}) 0%,
                        transparent 22%,
                        rgba(120, 80, 25, 0.06) ${35 + lightRatio * 25}%,
                        rgba(0, 0, 0, 0.65) ${55 + lightRatio * 35}%,
                        rgba(0, 0, 0, 0.92) ${75 + lightRatio * 25}%,
                        #000000 100%
                    )`
                }}
            />
            {/* Ambient Deep Vignette Rim */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_85%,#000000_100%)] pointer-events-none" />

            {/* 2. Light-Origin Progressive Typography Cluster */}
            <div className="w-full flex-1 flex flex-col items-center justify-center px-4 z-30">
                <motion.div 
                    className="w-full max-w-xs sm:max-w-sm flex flex-col items-center text-center"
                    style={{
                        transform: `perspective(600px) translate3d(${tiltX * 0.2}px, ${tiltY * 0.2 + textBloomY}px, 12px) scale(${textBloomScale}) rotateX(${-tiltY * 0.25}deg) rotateY(${tiltX * 0.25}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    {/* Element A: 01/05 Index & Date Tag */}
                    <div 
                        className="flex items-center gap-3 mb-2 border-b border-white/20 pb-1 px-3 transition-all duration-500"
                        style={{
                            transform: `translateY(${(1.0 - lightRatio) * 20}px)`,
                            opacity: Math.max(0.6, lightRatio)
                        }}
                    >
                        <motion.span 
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2.0 }}
                            className="font-mono font-black text-xs sm:text-sm text-[#E7FF00] tracking-widest uppercase drop-shadow-[0_0_12px_rgba(231,255,0,0.95)]"
                        >
                            {data.num}
                        </motion.span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />

                        <span 
                            style={{
                                opacity: stageProgress >= 0.12 || isCompleted ? 1 : 0,
                                transform: stageProgress >= 0.12 || isCompleted ? 'translateY(0)' : 'translateY(6px)',
                                transition: 'all 0.4s ease-out'
                            }}
                            className="font-mono text-[10px] sm:text-[11px] font-bold text-white/85 tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        >
                            {data.dateTag}
                        </span>
                    </div>

                    {/* Element B: Massive Stacked Title */}
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
                                        "font-sans font-black text-2xl sm:text-4xl tracking-[0.24em] text-white uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,1)] drop-shadow-[0_0_18px_rgba(255,255,255,0.45)]"
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Element C: Poetic Subtitle */}
                    <div className="mt-2 min-h-[30px] flex items-center justify-center text-center px-2">
                        {renderKineticLine(
                            data.subline,
                            4,
                            0.70,
                            0.98,
                            "font-mono text-xs sm:text-[13px] text-neutral-200 font-medium tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
                        )}
                    </div>
                </motion.div>
            </div>

            {/* 3. Bottom Action Area (Walk Again & Enter Museum on Stage 05) */}
            <div className="w-full flex flex-col items-center gap-2.5 pb-8 z-30 pointer-events-auto px-4">
                {currentStage === 4 && (
                    <>
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ 
                                opacity: isCompleted ? 1 : 0.8, 
                                scale: isCompleted ? 1 : 0.96, 
                                y: 0 
                            }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(231,255,0,1)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onOpenMuseum}
                            className="w-full max-w-xs py-3 rounded-full bg-gradient-to-r from-[#E7FF00] via-[#00E5FF] to-[#E7FF00] text-black font-mono font-black text-xs tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(231,255,0,0.8)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                            <span>✦ ENTER ATELIER MUSEUM ➔</span>
                        </motion.button>

                        <button
                            onClick={onWalkAgain}
                            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white font-mono text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <RotateCcw className="w-3 h-3" />
                            <span>WALK AGAIN</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
