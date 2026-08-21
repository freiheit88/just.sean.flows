import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_TIMELINE_STAGES } from '../../constants/timelineStages';
import { RotateCcw } from 'lucide-react';

// Deterministic Pseudo-Random Generator for character assembly thresholds
function getCharThreshold(charIndex, lineIndex) {
    const seed = (charIndex * 137 + lineIndex * 269) % 1000;
    return seed / 1000; // 0.0 to 1.0
}

export function Step07Timeline({ activeFrameIdx, tiltX, tiltY, onWalkAgain }) {
    const [currentStage, setCurrentStage] = useState(0); // 0 to 4
    const [stageProgress, setStageProgress] = useState(1.0); // 0.0 to 1.0
    const stageRef = useRef(0);
    const progressRef = useRef(1.0);
    const isAutoDriftPaused = useRef(false);

    // Auto Gentle Story Progression (~7.5s per card if idle)
    useEffect(() => {
        if (activeFrameIdx !== 6) {
            setCurrentStage(0);
            setStageProgress(1.0);
            stageRef.current = 0;
            progressRef.current = 1.0;
            return;
        }

        const autoTimer = setInterval(() => {
            if (isAutoDriftPaused.current) return;
            if (stageRef.current < ATELIER_TIMELINE_STAGES.length - 1) {
                stageRef.current += 1;
                progressRef.current = 1.0;
                setCurrentStage(stageRef.current);
                setStageProgress(1.0);
            }
        }, 7500);

        return () => clearInterval(autoTimer);
    }, [activeFrameIdx]);

    // 2026 Awwwards Continuous Bidirectional Scroll Kinetic Engine
    useEffect(() => {
        if (activeFrameIdx !== 6) return;

        let lastTouchY = 0;

        const updateScroll = (delta) => {
            isAutoDriftPaused.current = true;
            setTimeout(() => { isAutoDriftPaused.current = false; }, 4000);

            let newProg = progressRef.current + delta;

            // Intentional 25% reading buffer: Sentence stays assembled and doesn't instantly jump
            if (newProg > 1.25) {
                if (stageRef.current < ATELIER_TIMELINE_STAGES.length - 1) {
                    stageRef.current += 1;
                    newProg = 0.0;
                } else {
                    newProg = 1.0;
                }
            } else if (newProg < -0.25) {
                if (stageRef.current > 0) {
                    stageRef.current -= 1;
                    newProg = 1.0;
                } else {
                    newProg = 0.0;
                }
            }

            progressRef.current = newProg;
            setStageProgress(Math.min(1.0, Math.max(0.0, newProg)));
            setCurrentStage(stageRef.current);
        };

        const handleWheel = (e) => {
            // Calm, controllable, luxury scrolling cadence
            const delta = e.deltaY * 0.0012;
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
                const deltaY = (lastTouchY - currentY) * 0.0032;
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
    }, [activeFrameIdx]);

    if (activeFrameIdx !== 7) return null;

    const data = ATELIER_TIMELINE_STAGES[currentStage];

    // Render individual characters with randomized assembly
    const renderKineticLine = (text, lineIdx, startThreshold, endThreshold, textClass) => {
        const chars = text.split('');
        const lineSpan = endThreshold - startThreshold;

        return (
            <div className={`flex flex-wrap justify-center items-center ${textClass}`}>
                {chars.map((char, charIdx) => {
                    if (char === ' ') {
                        return <span key={charIdx} className="inline-block w-1.5 sm:w-2">&nbsp;</span>;
                    }

                    const rand = getCharThreshold(charIdx, lineIdx);
                    const charTrigger = startThreshold + rand * lineSpan;
                    const isRevealed = stageProgress >= charTrigger || stageProgress >= 0.96;

                    return (
                        <span
                            key={charIdx}
                            style={{
                                opacity: isRevealed ? 1 : 0,
                                transform: isRevealed ? 'translate3d(0, 0, 0) scale(1)' : `translate3d(${(rand - 0.5) * 25}px, ${(rand - 0.5) * 20}px, 0) scale(0.3)`,
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
        <div className="absolute inset-x-0 top-10 sm:top-14 z-30 pointer-events-none flex flex-col items-center text-center px-4">
            <div 
                className="flex flex-col items-center text-center w-full max-w-sm select-none"
                style={{
                    transform: `perspective(600px) translate3d(${tiltX * 0.25}px, ${tiltY * 0.25}px, 15px) rotateX(${-tiltY * 0.35}deg) rotateY(${tiltX * 0.35}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.15s ease-out'
                }}
            >
                {/* 5-Step Story Indicator Pill */}
                <div className="mb-4 flex items-center gap-1.5 pointer-events-auto">
                    {ATELIER_TIMELINE_STAGES.map((s, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => {
                                stageRef.current = idx;
                                progressRef.current = 1.0;
                                setCurrentStage(idx);
                                setStageProgress(1.0);
                            }}
                            className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                                currentStage === idx 
                                    ? 'w-7 bg-[#E7FF00] shadow-[0_0_15px_#E7FF00]' 
                                    : currentStage > idx 
                                        ? 'w-3 bg-[#E7FF00]/50' 
                                        : 'w-2 bg-white/25'
                            }`} 
                        />
                    ))}
                </div>

                {/* Box-Free Pure Floating 3D Typography with Scroll-Driven Random Assembly */}
                <div className="w-full flex flex-col items-center px-2">
                    {/* Line 1: Phase Tag (Assembles from 0.0 to 0.35) */}
                    <div className="mb-2">
                        {renderKineticLine(
                            data.phase,
                            1,
                            0.0,
                            0.35,
                            "font-mono text-[10px] sm:text-[11px] font-black tracking-[0.35em] text-[#E7FF00] uppercase drop-shadow-[0_0_12px_rgba(231,255,0,0.85)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                        )}
                    </div>

                    {/* Line 2: Headline (Assembles from 0.25 to 0.70 with 3s completion glow shimmer) */}
                    <motion.div 
                        animate={stageProgress >= 0.70 ? {
                            scale: [1, 1.025, 0.99, 1.02, 1],
                            filter: [
                                "drop-shadow(0 0 15px rgba(231,255,0,0.6))",
                                "drop-shadow(0 0 30px rgba(231,255,0,0.95)) drop-shadow(0 0 45px rgba(255,255,255,0.7))",
                                "drop-shadow(0 0 15px rgba(231,255,0,0.6))"
                            ]
                        } : {}}
                        transition={stageProgress >= 0.70 ? {
                            repeat: Infinity,
                            duration: 1.8,
                            ease: "easeInOut"
                        } : {}}
                        className="mb-3 min-h-[36px] flex items-center justify-center transition-all duration-300"
                    >
                        {renderKineticLine(
                            data.headline,
                            2,
                            0.25,
                            0.70,
                            "font-sans text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-[0_3px_16px_rgba(0,0,0,1)]"
                        )}
                    </motion.div>

                    {/* Line 3: Subline (Assembles from 0.55 to 1.00) */}
                    <div className="min-h-[44px] flex items-center justify-center max-w-xs">
                        {renderKineticLine(
                            data.subline,
                            3,
                            0.55,
                            1.00,
                            "font-mono text-xs sm:text-sm text-neutral-200 font-medium tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,1)] drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]"
                        )}
                    </div>

                    {/* Final Climax: Walk Again Button */}
                    {data.isFinal && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.85, y: 10 }}
                            animate={{ 
                                opacity: stageProgress >= 0.85 ? 1 : 0, 
                                scale: stageProgress >= 0.85 ? 1 : 0.85, 
                                y: stageProgress >= 0.85 ? 0 : 10 
                            }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onWalkAgain}
                            className="pointer-events-auto mt-6 px-6 py-2.5 rounded-full bg-[#E7FF00] text-black font-mono font-black text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(231,255,0,0.7)] flex items-center gap-2 cursor-pointer hover:bg-white transition-all"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            WALK AGAIN
                        </motion.button>
                    )}
                </div>

                {/* Subtext Guide for Bidirectional Scrolling */}
                <div className="mt-5 text-[9px] font-mono text-white/35 tracking-[0.25em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    ↑ SCROLL TO ASSEMBLE & EXPLORE ↓
                </div>
            </div>
        </div>
    );
}
