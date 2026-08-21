import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ATELIER_TIMELINE_STAGES } from '../../constants/timelineStages';

export function Step07Timeline({ activeFrameIdx, tiltX, tiltY }) {
    const [timelineStage, setTimelineStage] = useState(0);

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
        }, 2500);

        return () => clearInterval(timelineTimer);
    }, [activeFrameIdx]);

    if (activeFrameIdx !== 6) return null;

    return (
        <div className="absolute inset-x-0 top-14 md:top-18 z-20 pointer-events-none flex flex-col items-center text-center px-4">
            <div 
                className="flex flex-col items-center text-center max-w-sm select-none"
                style={{
                    transform: `perspective(600px) translate3d(${tiltX * 0.25}px, ${tiltY * 0.25}px, 15px) rotateX(${-tiltY * 0.35}deg) rotateY(${tiltX * 0.35}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.15s ease-out'
                }}
            >
                {/* Step Indicator Pill with Gyro Glow */}
                <div className="mb-2 flex items-center gap-1.5">
                    {ATELIER_TIMELINE_STAGES.map((s, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-500 ${
                                timelineStage === idx 
                                    ? 'w-6 bg-[#E7FF00] shadow-[0_0_12px_#E7FF00]' 
                                    : timelineStage > idx 
                                        ? 'w-3 bg-[#E7FF00]/60' 
                                        : 'w-2 bg-white/20'
                            }`} 
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`timeline-${timelineStage}`}
                        initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col items-center p-3 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                        style={{
                            textShadow: `${tiltX * 0.2}px ${tiltY * 0.2}px 15px rgba(231,255,0,0.3)`
                        }}
                    >
                        <span className="font-mono text-[11px] sm:text-xs font-black tracking-[0.25em] text-[#E7FF00] uppercase mb-1 drop-shadow-[0_0_12px_rgba(231,255,0,0.6)]">
                            ✦ {ATELIER_TIMELINE_STAGES[timelineStage].tag} ✦
                        </span>
                        <h1 className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight mb-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                            {ATELIER_TIMELINE_STAGES[timelineStage].title}
                        </h1>
                        <p className="font-sans text-xs sm:text-sm text-neutral-300 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                            "{ATELIER_TIMELINE_STAGES[timelineStage].desc}"
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
