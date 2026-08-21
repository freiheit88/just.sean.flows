import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_TIMELINE_STAGES } from '../../constants/timelineStages';
import { RotateCcw } from 'lucide-react';

export function Step07Timeline({ activeFrameIdx, tiltX, tiltY, onWalkAgain }) {
    const [timelineStage, setTimelineStage] = useState(0);

    // 3X Slower Conversational Auto Progression (~7.5s per stage)
    useEffect(() => {
        if (activeFrameIdx !== 6) {
            setTimelineStage(0);
            return;
        }

        const timelineTimer = setInterval(() => {
            setTimelineStage((prev) => {
                if (prev < ATELIER_TIMELINE_STAGES.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 7500);

        return () => clearInterval(timelineTimer);
    }, [activeFrameIdx]);

    // Bidirectional Wheel & Touch Gesture Handler within Step 7
    useEffect(() => {
        if (activeFrameIdx !== 6) return;

        let lastTouchY = 0;
        let lastTriggerTime = 0;

        const handleWheel = (e) => {
            const now = Date.now();
            if (now - lastTriggerTime < 600) return;

            if (e.deltaY > 20) {
                // Scroll Up / Forward -> Next Story
                setTimelineStage((prev) => Math.min(ATELIER_TIMELINE_STAGES.length - 1, prev + 1));
                lastTriggerTime = now;
            } else if (e.deltaY < -20) {
                // Scroll Down / Backward -> Prev Story
                setTimelineStage((prev) => Math.max(0, prev - 1));
                lastTriggerTime = now;
            }
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
                const now = Date.now();

                if (Math.abs(deltaY) > 30 && now - lastTriggerTime > 600) {
                    if (deltaY > 0) {
                        // Swipe Up -> Next Story
                        setTimelineStage((prev) => Math.min(ATELIER_TIMELINE_STAGES.length - 1, prev + 1));
                    } else {
                        // Swipe Down -> Prev Story
                        setTimelineStage((prev) => Math.max(0, prev - 1));
                    }
                    lastTriggerTime = now;
                    lastTouchY = currentY;
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [activeFrameIdx]);

    if (activeFrameIdx !== 6) return null;

    const currentData = ATELIER_TIMELINE_STAGES[timelineStage];

    return (
        <div className="absolute inset-x-0 top-12 sm:top-16 z-30 pointer-events-none flex flex-col items-center text-center px-4">
            <div 
                className="flex flex-col items-center text-center w-full max-w-sm select-none"
                style={{
                    transform: `perspective(600px) translate3d(${tiltX * 0.25}px, ${tiltY * 0.25}px, 15px) rotateX(${-tiltY * 0.35}deg) rotateY(${tiltX * 0.35}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.15s ease-out'
                }}
            >
                {/* 5-Step Story Indicator Pill with Glow */}
                <div className="mb-2.5 flex items-center gap-1.5 pointer-events-auto">
                    {ATELIER_TIMELINE_STAGES.map((s, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setTimelineStage(idx)}
                            className={`h-1.5 rounded-full transition-all duration-700 cursor-pointer ${
                                timelineStage === idx 
                                    ? 'w-8 bg-[#E7FF00] shadow-[0_0_15px_#E7FF00]' 
                                    : timelineStage > idx 
                                        ? 'w-3.5 bg-[#E7FF00]/50' 
                                        : 'w-2 bg-white/20'
                            }`} 
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`timeline-${timelineStage}`}
                        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full flex flex-col items-center p-4 sm:p-5 rounded-2xl bg-black/25 backdrop-blur-md border border-[#E7FF00]/30 shadow-[0_0_30px_rgba(231,255,0,0.15),0_8px_32px_rgba(0,0,0,0.5)]"
                    >
                        {/* Story Tag */}
                        <motion.span 
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="font-mono text-[10px] sm:text-[11px] font-black tracking-[0.3em] text-[#E7FF00] uppercase mb-1.5 drop-shadow-[0_0_12px_rgba(231,255,0,0.7)]"
                        >
                            ✦ {currentData.tag} ✦
                        </motion.span>

                        {/* Story Title */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
                        >
                            {currentData.title}
                        </motion.h1>

                        {/* Conversational Description (Speaking Cadence) */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="font-sans text-xs sm:text-sm text-neutral-200 font-medium tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-1"
                        >
                            "{currentData.desc}"
                        </motion.p>

                        {/* Final Climax: Direct Walk Again Button Integration */}
                        {currentData.isFinal && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onWalkAgain}
                                className="pointer-events-auto mt-4 px-6 py-2.5 rounded-full bg-[#E7FF00] text-black font-mono font-black text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(231,255,0,0.6)] flex items-center gap-2 cursor-pointer hover:bg-white transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                WALK AGAIN (처음부터 다시 걷기)
                            </motion.button>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Subtext Guide for Bidirectional Scrolling */}
                <div className="mt-2 text-[9px] font-mono text-white/40 tracking-widest uppercase">
                    ↑ SWIPE TO EXPLORE STORIES ↓
                </div>
            </div>
        </div>
    );
}
