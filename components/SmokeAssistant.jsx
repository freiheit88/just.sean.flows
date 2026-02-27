import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideSparkles } from 'lucide-react';

/**
 * SmokeAssistant (Mina)
 * Represents the ethereal assistant that "wraps" around active UI elements.
 */
const SmokeAssistant = ({ activeStep, targetRect, text, isVisible }) => {
    // Generate organic "smoke" particles
    const particles = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        size: Math.random() * 60 + 40,
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
        duration: Math.random() * 4 + 2
    })), []);

    const [rect, setRect] = React.useState(targetRect);

    React.useLayoutEffect(() => {
        if (isVisible && !targetRect) {
            // Attempt to find target if not passed
            const target = document.querySelector(activeStep === 'confirm' ? '#confirm-card' : '#language-grid');
            if (target) setRect(target.getBoundingClientRect());
        } else {
            setRect(targetRect);
        }
    }, [isVisible, targetRect, activeStep]);

    if (!isVisible || !rect) return null;

    return (
        <div
            className="fixed pointer-events-none z-[9999] transition-all duration-1000 ease-in-out"
            style={{
                top: rect.top - 20,
                left: rect.left - 20,
                width: rect.width + 40,
                height: rect.height + 40
            }}
        >
            {/* The "Smoke" Swirl Flowing Around the Target */}
            <div className="absolute inset-0">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1],
                            x: [p.x, -p.x, p.x],
                            y: [p.y, -p.y, p.y],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute rounded-full bg-white/20 blur-[40px]"
                        style={{
                            width: p.size,
                            height: p.size,
                            top: '50%',
                            left: '50%',
                        }}
                    />
                ))}
            </div>

            {/* Localized Floating Guidance Label */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={text}
                    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                    className="absolute top-full mt-8 left-1/2 -translate-x-1/2 min-w-[240px] max-w-[320px]"
                >
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <LucideSparkles size={10} className="text-[#C5A059] animate-pulse" />
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Mina's Directive</span>
                        </div>
                        <p className="text-[11px] md:text-[12px] font-serif italic text-white/90 leading-relaxed tracking-wide">
                            "{text}"
                        </p>

                        {/* Dynamic Smoke Tail to Target */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/5 backdrop-blur-3xl rotate-45 border-l border-t border-white/10" />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SmokeAssistant;
