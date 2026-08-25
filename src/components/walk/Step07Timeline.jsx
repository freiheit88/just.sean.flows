import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_TIMELINE_STAGES } from '../../constants/timelineStages';
import { RotateCcw, Sparkles } from 'lucide-react';

function getCharThreshold(charIndex, lineIndex) {
    const seed = (charIndex * 137 + lineIndex * 269) % 1000;
    return seed / 1000;
}

export function Step07Timeline({ activeFrameIdx, tiltX, tiltY, onWalkAgain, onOpenMuseum }) {
    // 25.0-second total master time (5.0s per stage, 1.5x+ Faster Pacing)
    const [totalElapsed, setTotalElapsed] = useState(0.0);
    const [isCompleted, setIsCompleted] = useState(false);

    const elapsedRef = useRef(0.0);
    const isPausedRef = useRef(false);

    const isStep7 = (activeFrameIdx === 6);

    const currentStage = Math.min(4, Math.floor(totalElapsed / 5.0));
    const stageProgress = Math.min(1.0, (totalElapsed % 5.0) / 4.2);

    useEffect(() => {
        if (!isStep7) {
            setTotalElapsed(0.0);
            elapsedRef.current = 0.0;
            setIsCompleted(false);
            return;
        }

        const timer = setInterval(() => {
            if (isPausedRef.current) return;
            if (elapsedRef.current < 25.0) {
                const nextTime = Math.min(25.0, elapsedRef.current + 0.08); // 1.5x+ faster tick
                elapsedRef.current = nextTime;
                setTotalElapsed(nextTime);

                const withinStageProg = (nextTime % 5.0) / 4.2;
                setIsCompleted(withinStageProg >= 1.0 || nextTime >= 24.0);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [isStep7]);

    useEffect(() => {
        if (!isStep7) return;

        let lastTouchY = 0;

        const updateScrollDelta = (deltaSeconds) => {
            isPausedRef.current = true;
            setTimeout(() => { isPausedRef.current = false; }, 2000);

            const next = Math.max(0.0, Math.min(25.0, elapsedRef.current + deltaSeconds));
            elapsedRef.current = next;
            setTotalElapsed(next);

            const withinStageProg = (next % 5.0) / 4.2;
            setIsCompleted(withinStageProg >= 1.0 || next >= 24.0);
        };

        const handleWheel = (e) => {
            const deltaSec = (e.deltaY > 0 ? 0.9 : -0.9); // 1.5x+ faster scroll
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
                if (Math.abs(deltaY) > 6) {
                    const deltaSec = deltaY > 0 ? 1.0 : -1.0; // 1.5x+ faster touch swipe
                    updateScrollDelta(deltaSec);
                    lastTouchY = currentY;
                }
            }
        };

        const handleClickAdvance = () => {
            updateScrollDelta(1.2); // Instant click jump
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('click', handleClickAdvance);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('click', handleClickAdvance);
        };
    }, [isStep7]);

    if (!isStep7) return null;

    const data = ATELIER_TIMELINE_STAGES[currentStage];
    const lightRatio = Math.min(1.0, totalElapsed / 25.0);

    const textBloomY = (1.0 - lightRatio) * 160;
    const textBloomScale = 0.80 + lightRatio * 0.20;
    const letterSpread = (1.0 - lightRatio) * 35;

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
                    const scatterY = (rand - 0.5) * (letterSpread * 0.8) + (1.0 - lightRatio) * 25;

                    return (
                        <span
                            key={charIdx}
                            style={{
                                opacity: isRevealed ? 1 : 0,
                                transform: isRevealed 
                                    ? 'translate3d(0, 0, 0) scale(1)' 
                                    : `translate3d(${scatterX}px, ${scatterY}px, 0) scale(0.3)`,
                                filter: isRevealed ? 'blur(0px)' : 'blur(10px)',
                                transition: 'opacity 0.25s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease-out',
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
        <div className="absolute inset-0 z-30 pointer-events-none select-none flex flex-col items-center justify-between overflow-hidden">
            {/* 1. Deep Chiaroscuro Dark Vignette (Darkens rest of room, spotlights flame) */}
            <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                style={{
                    background: 'radial-gradient(circle at 50% 82%, rgba(229,169,60,0.35) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.92) 85%)'
                }}
            />

            {/* 2. Candlestick Flame Light Halo & Sparks */}
            <div 
                className="absolute pointer-events-none transition-all duration-700 ease-out flex items-center justify-center"
                style={{
                    bottom: '18%',
                    left: '50%',
                    transform: `translate(-50%, 50%) translate3d(${tiltX * 0.4}px, ${tiltY * 0.4}px, 0)`,
                    width: `${90 + lightRatio * 220}px`,
                    height: `${90 + lightRatio * 220}px`,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(255,215,0,${0.45 + lightRatio * 0.35}) 0%, rgba(229,169,60,${0.25 + lightRatio * 0.25}) 40%, rgba(0,0,0,0) 70%)`,
                    filter: `blur(${12 + lightRatio * 18}px)`
                }}
            />

            {/* 3. Kinetic Typography Floating from Candlelight Flame */}
            <div 
                className="relative z-20 flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-center px-6 text-center transition-all duration-500 ease-out"
                style={{
                    transform: `translate3d(${tiltX * 0.6}px, ${textBloomY + tiltY * 0.6}px, 0) scale(${textBloomScale})`
                }}
            >
                {/* Stage Counter Tag */}
                <motion.div
                    key={`tag-${currentStage}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mb-2"
                >
                    <span className="font-mono text-[9px] sm:text-[10px] font-black tracking-[0.28em] text-[#E7FF00] uppercase bg-black/80 px-3 py-1 rounded-full border border-[#E7FF00]/40 shadow-[0_0_15px_rgba(231,255,0,0.35)]">
                        {data.num} • {data.dateTag}
                    </span>
                </motion.div>

                {/* Floating Big Headline Words */}
                <div className="flex flex-col items-center gap-0.5 my-1 sm:my-2">
                    {data.lines.map((lineText, lineIdx) => {
                        const start = lineIdx * 0.25;
                        const end = start + 0.30;
                        return (
                            <React.Fragment key={`${currentStage}-${lineIdx}`}>
                                {renderKineticLine(
                                    lineText, 
                                    lineIdx, 
                                    start, 
                                    end, 
                                    "font-serif font-black text-2xl sm:text-4xl md:text-5xl tracking-wide text-[#FFFDF8] drop-shadow-[0_4px_25px_rgba(229,169,60,0.6)] uppercase"
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Poetic Subline */}
                <motion.p
                    key={`sub-${currentStage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: stageProgress > 0.45 || isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-sans text-xs sm:text-sm font-semibold text-neutral-200 mt-2 max-w-sm leading-relaxed drop-shadow-md"
                >
                    {data.subline}
                </motion.p>
            </div>

            {/* 4. Action Gateway Buttons */}
            <div className="relative z-30 pb-16 sm:pb-20 flex flex-col items-center gap-2 pointer-events-auto px-4 w-full max-w-xs">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenMuseum}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#E5A93C] text-black font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_35px_rgba(255,215,0,0.7)] flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition-all"
                >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>ENTER ATELIER MUSEUM ➔</span>
                </motion.button>

                <button
                    onClick={onWalkAgain}
                    className="flex items-center justify-center gap-1.5 py-1 text-[10.5px] font-mono font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                    <RotateCcw className="w-3 h-3" />
                    <span>WALK AGAIN</span>
                </button>
            </div>
        </div>
    );
}
