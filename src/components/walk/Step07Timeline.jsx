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
    const lockUntilTime = useRef(0); // 3-second completion lock timestamp

    useEffect(() => {
        if (activeFrameIdx !== 7) {
            setCurrentStage(0);
            setStageProgress(0.0);
            setIsCompleted(false);
            stageRef.current = 0;
            progressRef.current = 0.0;
            lockUntilTime.current = 0;
        } else {
            // Start assembling stage 0 smoothly
            setStageProgress(0.0);
            progressRef.current = 0.0;
            setIsCompleted(false);
        }
    }, [activeFrameIdx]);

    useEffect(() => {
        if (activeFrameIdx !== 7) return;

        let lastTouchY = 0;

        const updateScroll = (delta) => {
            const now = Date.now();

            // If currently in 3-second completion read lock, ignore scroll to prevent skipping
            if (now < lockUntilTime.current && delta > 0) {
                return;
            }

            let newProg = progressRef.current + delta;

            if (newProg >= 1.0) {
                // First time completing this sentence -> Lock scroll for 3.0s so user can read!
                if (!isCompleted && lockUntilTime.current === 0) {
                    setIsCompleted(true);
                    lockUntilTime.current = now + 3000; // 3.0초 정독 락!
                    newProg = 1.0;
                } else if (now >= lockUntilTime.current) {
                    // 3 seconds have passed, advance to next stage on further scroll
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

    if (activeFrameIdx !== 7) return null;

    const data = ATELIER_TIMELINE_STAGES[currentStage];

    // Character Assembly Renderer
    const renderKineticLine = (text, lineIdx, startThreshold, endThreshold, textClass) => {
        const chars = text.split('');
        const lineSpan = endThreshold - startThreshold;

        return (
            <div className={`flex flex-wrap items-center ${textClass}`}>
                {chars.map((char, charIdx) => {
                    if (char === ' ') {
                        return <span key={charIdx} className="inline-block w-2">&nbsp;</span>;
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
                                    : `translate3d(${(rand - 0.5) * 30}px, ${(rand - 0.5) * 25}px, 0) scale(0.3)`,
                                filter: isRevealed ? 'blur(0px)' : 'blur(8px)',
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
        <div className="absolute inset-x-0 top-12 sm:top-16 z-30 pointer-events-none flex flex-col items-center px-6">
            {/* Magazine Spread Container (High-End Asymmetrical Editorial Layout) */}
            <div 
                className="w-full max-w-xs sm:max-w-sm flex flex-col select-none"
                style={{
                    transform: `perspective(600px) translate3d(${tiltX * 0.2}px, ${tiltY * 0.2}px, 12px) rotateX(${-tiltY * 0.25}deg) rotateY(${tiltX * 0.25}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.15s ease-out'
                }}
            >
                {/* 1. Editorial Index Header (Large Numeral + Thin Rule + Date Tag) */}
                <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg sm:text-xl text-[#E7FF00] tracking-tighter drop-shadow-[0_0_12px_rgba(231,255,0,0.8)]">
                            {data.num}
                        </span>
                        <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
                            / 05
                        </span>
                    </div>

                    <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#E7FF00] tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(231,255,0,0.7)]">
                        {data.phase}
                    </span>
                </div>

                {/* 2. Bold Editorial Headline (Large Magazine Typography + 3-Second Completion Breathing Glow) */}
                <motion.div 
                    animate={isCompleted ? {
                        scale: [1, 1.02, 0.99, 1.015, 1],
                        filter: [
                            "drop-shadow(0 0 15px rgba(231,255,0,0.65)) drop-shadow(0 4px 12px rgba(0,0,0,1))",
                            "drop-shadow(0 0 35px rgba(231,255,0,0.95)) drop-shadow(0 0 50px rgba(255,255,255,0.8)) drop-shadow(0 4px 12px rgba(0,0,0,1))",
                            "drop-shadow(0 0 15px rgba(231,255,0,0.65)) drop-shadow(0 4px 12px rgba(0,0,0,1))"
                        ]
                    } : {}}
                    transition={isCompleted ? {
                        repeat: Infinity,
                        duration: 1.6,
                        ease: "easeInOut"
                    } : {}}
                    className="min-h-[56px] flex flex-col justify-center mb-2"
                >
                    {renderKineticLine(
                        data.headline,
                        1,
                        0.05,
                        0.60,
                        "font-sans text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,1)] text-left"
                    )}
                </motion.div>

                {/* 3. Poetic Subtitle Line (Clean, Artistic, Easy Reading) */}
                <div className="min-h-[40px] flex items-center text-left">
                    {renderKineticLine(
                        data.subline,
                        2,
                        0.45,
                        0.95,
                        "font-mono text-xs sm:text-sm text-neutral-300 font-medium tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
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
                        className="pointer-events-auto mt-5 px-6 py-2.5 rounded-full bg-[#E7FF00] text-black font-mono font-black text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(231,255,0,0.7)] flex items-center justify-center gap-2 cursor-pointer hover:bg-white transition-all self-start"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        WALK AGAIN
                    </motion.button>
                )}
            </div>
        </div>
    );
}
