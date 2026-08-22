import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_TIMELINE_STAGES } from '../../constants/timelineStages';
import { RotateCcw } from 'lucide-react';

function getCharThreshold(charIndex, lineIndex) {
    const seed = (charIndex * 137 + lineIndex * 269) % 1000;
    return seed / 1000;
}

export function Step07Timeline({ activeFrameIdx, tiltX, tiltY, onWalkAgain }) {
    const [currentStage, setCurrentStage] = useState(0);
    const [stageProgress, setStageProgress] = useState(0.0);
    const [isCompleted, setIsCompleted] = useState(false);

    const stageRef = useRef(0);
    const progressRef = useRef(0.0);
    const lockUntilTime = useRef(0);

    useEffect(() => {
        if (activeFrameIdx !== 8) {
            setCurrentStage(0);
            setStageProgress(0.0);
            setIsCompleted(false);
            stageRef.current = 0;
            progressRef.current = 0.0;
            lockUntilTime.current = 0;
        } else {
            setStageProgress(0.0);
            progressRef.current = 0.0;
            setIsCompleted(false);
        }
    }, [activeFrameIdx]);

    useEffect(() => {
        if (activeFrameIdx !== 8) return;

        let lastTouchY = 0;

        const updateScroll = (delta) => {
            const now = Date.now();

            if (now < lockUntilTime.current && delta > 0) {
                return;
            }

            let newProg = progressRef.current + delta;

            if (newProg >= 1.0) {
                if (!isCompleted && lockUntilTime.current === 0) {
                    setIsCompleted(true);
                    lockUntilTime.current = now + 3000; // 3초 정독 락!
                    newProg = 1.0;
                } else if (now >= lockUntilTime.current) {
                    if (stageRef.current < ATELIER_TIMELINE_STAGES.length - 1) {
                        stageRef.current += 1;
                        setCurrentStage(stageRef.current);
                        newProg = 0.0;
                        setIsCompleted(false);
                        lockUntilTime.current = 0;
                    } else {
                        newProg = 1.0;
                    }
                } else {
                    newProg = 1.0;
                }
            } else if (newProg < 0.0) {
                if (stageRef.current > 0) {
                    stageRef.current -= 1;
                    setCurrentStage(stageRef.current);
                    newProg = 1.0;
                    setIsCompleted(true);
                    lockUntilTime.current = 0;
                } else {
                    newProg = 0.0;
                }
            } else {
                setIsCompleted(false);
                lockUntilTime.current = 0;
            }

            progressRef.current = newProg;
            setStageProgress(Math.min(1.0, Math.max(0.0, newProg)));
        };

        const handleWheel = (e) => {
            const delta = e.deltaY * 0.0014;
            updateScroll(delta);
        };

        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                lastTouchY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const currentY = e.touches[0].clientY;
                const deltaY = (lastTouchY - currentY) * 0.0035;
                updateScroll(deltaY);
                lastTouchY = currentY;
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
    }, [activeFrameIdx, isCompleted]);

    if (activeFrameIdx !== 8) return null;

    const data = ATELIER_TIMELINE_STAGES[currentStage];

    // Character Assembly Renderer for Cinematic Stack
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
                    const isRevealed = stageProgress >= charTrigger || stageProgress >= 0.98;

                    return (
                        <span
                            key={charIdx}
                            style={{
                                opacity: isRevealed ? 1 : 0,
                                transform: isRevealed 
                                    ? 'translate3d(0, 0, 0) scale(1)' 
                                    : `translate3d(${(rand - 0.5) * 35}px, ${(rand - 0.5) * 25}px, 0) scale(0.35)`,
                                filter: isRevealed ? 'blur(0px)' : 'blur(10px)',
                                transition: 'opacity 0.25s ease-out, transform 0.35s ease-out, filter 0.25s ease-out',
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
        <div className="absolute inset-x-0 top-10 sm:top-14 z-30 pointer-events-none flex flex-col items-center px-4">
            {/* Cinematic Movie Poster Stack Wrapper */}
            <div 
                className="w-full max-w-xs sm:max-w-sm flex flex-col items-center select-none"
                style={{
                    transform: `perspective(600px) translate3d(${tiltX * 0.2}px, ${tiltY * 0.2}px, 12px) rotateX(${-tiltY * 0.25}deg) rotateY(${tiltX * 0.25}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.15s ease-out'
                }}
            >
                {/* 1. Header Index & Sub-Date Tag */}
                <div className="flex items-center gap-3 mb-3 border-b border-white/15 pb-1.5 px-2">
                    <span className="font-mono font-black text-xs sm:text-sm text-[#E7FF00] tracking-widest uppercase drop-shadow-[0_0_10px_rgba(231,255,0,0.8)]">
                        {data.num}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white/70 tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        {data.dateTag}
                    </span>
                </div>

                {/* 2. Massive Cinematic Stacked Title (A TWELVE-MINUTE ALIBI Poster Aesthetic) */}
                <motion.div 
                    animate={isCompleted ? {
                        scale: [1, 1.025, 0.99, 1.02, 1],
                        filter: [
                            "drop-shadow(0 0 16px rgba(255,255,255,0.75)) drop-shadow(0 0 35px rgba(231,255,0,0.6)) drop-shadow(0 4px 18px rgba(0,0,0,1))",
                            "drop-shadow(0 0 32px rgba(255,255,255,1)) drop-shadow(0 0 60px rgba(231,255,0,0.9)) drop-shadow(0 4px 18px rgba(0,0,0,1))",
                            "drop-shadow(0 0 16px rgba(255,255,255,0.75)) drop-shadow(0 0 35px rgba(231,255,0,0.6)) drop-shadow(0 4px 18px rgba(0,0,0,1))"
                        ]
                    } : {}}
                    transition={isCompleted ? {
                        repeat: Infinity,
                        duration: 1.6,
                        ease: "easeInOut"
                    } : {}}
                    className="flex flex-col items-center gap-0.5 sm:gap-1 my-1"
                >
                    {data.lines.map((lineText, lIdx) => {
                        const startRatio = (lIdx / data.lines.length) * 0.75;
                        const endRatio = ((lIdx + 1) / data.lines.length) * 0.75;
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

                {/* 3. Poetic Atmospheric Subtitle */}
                <div className="mt-3 min-h-[32px] flex items-center justify-center text-center px-2">
                    {renderKineticLine(
                        data.subline,
                        4,
                        0.70,
                        0.98,
                        "font-mono text-xs sm:text-[13px] text-neutral-200 font-medium tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
                    )}
                </div>

                {/* 4. Final Climax: Walk Again Button */}
                {data.isFinal && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ 
                            opacity: isCompleted ? 1 : 0, 
                            scale: isCompleted ? 1 : 0.9, 
                            y: isCompleted ? 0 : 10 
                        }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onWalkAgain}
                        className="pointer-events-auto mt-6 px-6 py-2.5 rounded-full bg-[#E7FF00] text-black font-mono font-black text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(231,255,0,0.7)] flex items-center justify-center gap-2 cursor-pointer hover:bg-white transition-all"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        WALK AGAIN
                    </motion.button>
                )}
            </div>
        </div>
    );
}
