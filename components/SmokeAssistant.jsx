import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideSparkles } from 'lucide-react';

// Define MAGIC_PARTICLES outside the component if it's a constant
// Assuming MAGIC_PARTICLES is defined elsewhere or needs to be added.
// For the purpose of this edit, I'll define a placeholder if not provided.
const MAGIC_PARTICLES = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    opacity: Math.random() * 0.3 + 0.1,
    tx: Math.random() * 200 - 100,
    ty: Math.random() * 200 - 100,
    duration: Math.random() * 5 + 3,
    delay: Math.random() * 2
}));

/**
 * SmokeAssistant (Mina)
 * Represents the ethereal assistant that "wraps" around active UI elements.
 */
const SmokeAssistant = ({ text, isVisible, activeStep, position = 'top' }) => {
    // Determine dynamic position classes
    const positionClasses = position === 'center'
        ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-auto min-w-[300px] md:min-w-[360px] max-w-[500px] z-[1000] transition-all duration-1000"
        : "fixed top-2 md:top-6 left-1/2 -translate-x-1/2 w-[95vw] md:w-auto min-w-[300px] md:min-w-[360px] max-w-[500px] z-[1000] transition-all duration-1000";

    if (!isVisible || !text) return null;

    return (
        <div className="relative pointer-events-none">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                {/* Flowing Smoke/Mist effects */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`smoke-${i}`}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -30, 30, 0],
                            scale: [1, 1.2, 0.9, 1],
                            rotate: [0, 90, 180, 360],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 15 + i * 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 2
                        }}
                        className="absolute rounded-full bg-[#C5A059]/10 blur-[100px] mix-blend-screen"
                        style={{
                            width: '40vw',
                            height: '40vw',
                            left: `${20 * i}%`,
                            top: `${10 * i}%`,
                        }}
                    />
                ))}
            </div>

            {activeStep === 'intro' && (
                <div className="fixed inset-0 pointer-events-none z-10 opacity-40">
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.15)_0%,_transparent_60%)]"
                    />
                </div>
            )}

            {/* Glowing Orb Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
                {activeStep === 'intro' && MAGIC_PARTICLES.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, p.opacity, 0],
                            scale: [0, 1, 0],
                            x: [0, p.tx, p.tx * 1.5],
                            y: [0, p.ty, p.ty * 1.5]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
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
            </div>

            {/* V20.3 Top-Aligned Ethereal Interface */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="mina-overlay"
                    initial={{ opacity: 0, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    className={positionClasses}
                >
                    <div className="relative p-4 md:p-6 bg-[#FDFCF0]/98 backdrop-blur-3xl border border-[#C5A059]/40 shadow-[0_50px_120px_rgba(0,0,0,0.8)]">
                        {/* Technical Corner Accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#C5A059]" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#C5A059]" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#C5A059]" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#C5A059]" />

                        <div className="flex items-center justify-between mb-4 border-b border-[#C5A059]/20 pb-2">
                            <div className="flex items-center gap-2">
                                <LucideSparkles size={12} className="text-[#C5A059] animate-pulse" />
                                <span className="text-[9px] font-black text-[#8B7355] uppercase tracking-[0.6em] font-mono">PROTOCOL: AO-H</span>
                            </div>
                            <span className="text-[9px] font-mono text-[#C5A059]/60 tracking-widest">v20.3.7</span>
                        </div>

                        <p className="text-[14px] md:text-[18px] font-serif italic text-[#2D241E] font-medium leading-[1.6] tracking-wider text-center px-4">
                            "{text}"
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SmokeAssistant;
