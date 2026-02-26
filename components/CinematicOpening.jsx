import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideSettings, LucideZap } from 'lucide-react';

const CinematicOpening = ({ onComplete }) => {
    const [phase, setPhase] = useState('idle'); // idle, ignite, open, flash, finish

    const handleIgnite = () => {
        setPhase('ignite');
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
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {phase === 'idle' && (
                    <motion.button
                        key="ignite-btn"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0.3, 0.7, 0.3],
                            scale: [0.98, 1.02, 0.98]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            opacity: { repeat: Infinity, duration: 3 },
                            scale: { repeat: Infinity, duration: 3 }
                        }}
                        onClick={handleIgnite}
                        className="group relative flex flex-col items-center gap-4"
                    >
                        <div className="w-24 h-24 rounded-full border-2 border-[#C5A059]/40 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border border-[#C5A059] animate-ping opacity-20" />
                            <LucideZap className="text-[#C5A059] group-hover:text-white transition-colors" size={40} />
                        </div>
                        <span className="text-[#C5A059] font-black uppercase tracking-[0.3em] text-[10px]">Ignite Engine</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Igniting Phase: Camera Shake */}
            {phase === 'ignite' && (
                <motion.div
                    animate={{
                        x: [0, -5, 5, -5, 5, 0],
                        y: [0, 5, -5, 5, -5, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="absolute inset-0 bg-[#C5A059]/5 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: [0, 1, 0.5] }}
                        className="text-[#C5A059] opacity-20"
                    >
                        <LucideSettings size={400} className="animate-spin-slow" />
                    </motion.div>
                </motion.div>
            )}

            {/* Opening Phase: Clip Path Gear */}
            {phase === 'open' && (
                <motion.div
                    initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                    animate={{
                        clipPath: 'circle(150% at 50% 50%)',
                        rotate: 360
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-[#C5A059] via-[#f4e4bc] to-[#C5A059] flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,1)]"
                >
                    <div className="text-black font-black text-6xl uppercase tracking-[1em] opacity-10">Just Sean Flows</div>
                </motion.div>
            )}

            {/* Flash Bang Phase */}
            {phase === 'flash' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-white z-[10000]"
                />
            )}

            {/* Fade Out Phase */}
            {phase === 'finish' && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-white z-[10000]"
                />
            )}

            {/* Sound of the Machine Spirit */}
            <div className="absolute bottom-10 left-10 text-[#C5A059]/20 font-mono text-[8px] uppercase tracking-widest">
                System Initializing... {phase.toUpperCase()}
            </div>
        </div>
    );
};

export default CinematicOpening;
