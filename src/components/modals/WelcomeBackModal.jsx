import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WelcomeBackModal({ isOpen, onComplete }) {
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (!isOpen) {
            setCount(5);
            return;
        }

        setCount(5);
        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeout(() => {
                        onComplete();
                    }, 400);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onClick={onComplete}
                className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl cursor-pointer select-none"
            >
                {/* Ambient Yellow Glow Halo */}
                <div className="absolute w-72 h-72 rounded-full bg-[#E7FF00]/15 filter blur-3xl pointer-events-none animate-pulse" />

                {/* Main Welcome Back Title */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center gap-3 text-center"
                >
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#E7FF00] shadow-[0_0_12px_#E7FF00] animate-ping" />
                        <h2 
                            className="font-mono text-xl sm:text-2xl font-black tracking-[0.4em] uppercase text-[#E7FF00]"
                            style={{
                                textShadow: '0 2px 0 #C5A059, 0 4px 0 #000000, 0 0 25px rgba(231,255,0,0.8)'
                            }}
                        >
                            WELCOME BACK !
                        </h2>
                    </div>

                    <p className="font-mono text-xs text-neutral-400 tracking-widest uppercase">
                        Resuming your journey in
                    </p>

                    {/* Big Pure Floating Countdown Number (No Box, No Border) */}
                    <motion.div
                        key={count}
                        initial={{ scale: 1.6, opacity: 0, y: 10 }}
                        animate={{ scale: 1.0, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="my-4 font-mono font-black text-7xl sm:text-8xl text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.9)] drop-shadow-[0_0_60px_rgba(231,255,0,0.8)]"
                    >
                        {count > 0 ? count : '⚡'}
                    </motion.div>

                    <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase animate-pulse">
                        Tap anywhere to resume immediately
                    </span>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
