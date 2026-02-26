import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideZap, LucideOrbit } from 'lucide-react';

const CinematicOpening = ({ onComplete }) => {
    const [phase, setPhase] = useState('idle'); // idle, ignite, open, flash, finish

    const handleIgnite = () => {
        setPhase('ignite');
        // We'll use a generic power-up sound or existing click for now
        const audio = new Audio('/assets/sounds/gear-click.mp3');
        audio.play().catch(e => console.log("Audio play deferred", e));

        // Sequence timing
        setTimeout(() => setPhase('open'), 3000);
        setTimeout(() => setPhase('flash'), 7000);
        setTimeout(() => {
            setPhase('finish');
            onComplete();
        }, 10000);
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {phase === 'idle' && (
                    <motion.button
                        key="ignite-btn"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0.4, 0.8, 0.4],
                            scale: [0.95, 1.05, 0.95]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            opacity: { repeat: Infinity, duration: 2 },
                            scale: { repeat: Infinity, duration: 4 }
                        }}
                        onClick={handleIgnite}
                        className="group relative flex flex-col items-center gap-6"
                    >
                        <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center relative bg-gradient-to-b from-white/5 to-transparent">
                            <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-10" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-t border-r border-white/30"
                            />
                            <LucideZap className="text-white group-hover:scale-110 transition-transform" size={48} />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-white font-black uppercase tracking-[0.5em] text-[12px] mb-2">Initialize Multiverse</span>
                            <div className="w-12 h-[1px] bg-white/30" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Igniting Phase: Cosmic Turbulence */}
            {phase === 'ignite' && (
                <motion.div
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-[500px] h-[500px] rounded-full bg-white opacity-5 blur-[120px]" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <LucideOrbit size={400} className="text-white opacity-10" />
                    </motion.div>
                </motion.div>
            )}

            {/* Opening Phase: Dimensional Portal */}
            {phase === 'open' && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, borderRadius: '100%' }}
                    animate={{
                        scale: 15,
                        opacity: 1,
                        rotate: 180
                    }}
                    transition={{ duration: 4, ease: "circIn" }}
                    className="absolute w-40 h-40 bg-gradient-to-tr from-white via-blue-50 to-white shadow-[0_0_100px_white]"
                />
            )}

            {/* Flash Bang Phase */}
            {phase === 'flash' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white z-[10001]"
                />
            )}

            {/* Fade Out Phase */}
            {phase === 'finish' && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-white z-[10001]"
                />
            )}

            {/* Subtle System Status */}
            <div className="absolute bottom-12 left-12 text-white/30 font-mono text-[10px] uppercase tracking-[0.5em]">
                {phase !== 'finish' && `Synchronizing Realities... ${phase}...`}
            </div>
        </div>
    );
};

export default CinematicOpening;
