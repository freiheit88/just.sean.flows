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
            {/* V20 Golden Mist Effect */}
            <div className="absolute inset-0">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            scale: [1, 1.4, 1],
                            x: [p.x, -p.x * 1.5, p.x],
                            y: [p.y, -p.y * 1.5, p.y],
                            rotate: [0, 90, 180]
                        }}
                        transition={{
                            duration: p.duration * 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute rounded-full bg-gradient-to-br from-[#F6E05E]/40 to-[#C5A059]/20 blur-[50px] mix-blend-screen"
                        style={{
                            width: p.size * 1.2,
                            height: p.size * 1.2,
                            top: '50%',
                            left: '50%',
                        }}
                    />
                ))}
                {/* Center Sparkles */}
                <motion.div
                    animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-[#C5A059]/10 blur-[80px] rounded-full"
                />
            </div>

            {/* V20 Ethereal Letter (Parchment) UI */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={text}
                    initial={{ opacity: 0, y: -20, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    className="absolute bottom-full mb-24 left-1/2 -translate-x-1/2 min-w-[320px] max-w-[400px] z-[100]"
                >
                    <div className="relative p-8 bg-[#FDFCF0]/95 backdrop-blur-md rounded-[2px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-[#C5A059]/30">
                        {/* Decorative Corner Guards */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C5A059]/60" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C5A059]/60" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#C5A059]/60" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#C5A059]/60" />

                        <div className="flex items-center gap-3 mb-4 border-b border-[#C5A059]/10 pb-3">
                            <LucideSparkles size={14} className="text-[#C5A059]" />
                            <span className="text-[9px] font-black text-[#8B7355] uppercase tracking-[0.5em] font-serif">Aetherial Dispatch</span>
                        </div>

                        <p className="text-[15px] md:text-[17px] font-serif italic text-[#2D241E] font-medium leading-relaxed tracking-wide text-center">
                            "{text}"
                        </p>

                        {/* Subtle Wax Seal Sealant Graphic (CSS Circle) */}
                        <div className="absolute -bottom-4 right-8 w-12 h-12 bg-[#5C1A1A]/10 rounded-full border border-[#5C1A1A]/20 flex items-center justify-center rotate-12">
                            <div className="w-8 h-8 rounded-full border border-[#5C1A1A]/30" />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default SmokeAssistant;
