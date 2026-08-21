import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WelcomeBackModal({ isOpen, onComplete }) {
    const [count, setCount] = useState(5);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (!isOpen) {
            setCount(5);
            return;
        }

        setCount(5);
        let currentCount = 5;

        const timer = setInterval(() => {
            currentCount -= 1;
            if (currentCount > 0) {
                setCount(currentCount);
            } else {
                setCount(0);
                clearInterval(timer);
                setTimeout(() => {
                    if (onCompleteRef.current) {
                        onCompleteRef.current();
                    }
                }, 500);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]); // Only depends on isOpen, immune to parent 60FPS re-renders!

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-black/85 backdrop-blur-2xl select-none"
            >
                {/* Ambient Yellow Glow Halo */}
                <div className="absolute w-80 h-80 rounded-full bg-[#E7FF00]/15 filter blur-3xl pointer-events-none animate-pulse" />

                {/* Staggered Central Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-4">
                    {/* 1. Header: Rises at 0.2s */}
                    <motion.div
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_12px_#E7FF00] animate-ping" />
                        <h2 
                            className="font-mono text-2xl sm:text-3xl font-black tracking-[0.35em] uppercase text-[#E7FF00]"
                            style={{
                                textShadow: '0 2px 0 #C5A059, 0 4px 0 #000000, 0 0 30px rgba(231,255,0,0.85)'
                            }}
                        >
                            WELCOME BACK !
                        </h2>
                    </motion.div>

                    {/* 2. Subtitle: Rises at 0.5s */}
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.4em" }}
                        animate={{ opacity: 1, letterSpacing: "0.25em" }}
                        transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
                        className="font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.25em] uppercase mb-4"
                    >
                        Resuming your journey in
                    </motion.p>

                    {/* 3. Live 1-Second Popping Countdown Number (5 -> 4 -> 3 -> 2 -> 1 -> ⚡) */}
                    <div className="h-28 flex items-center justify-center my-2">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={count}
                                initial={{ scale: 2.2, opacity: 0, y: 15 }}
                                animate={{ scale: 1.0, opacity: 1, y: 0 }}
                                exit={{ scale: 0.6, opacity: 0, y: -15 }}
                                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                                className="font-mono font-black text-7xl sm:text-8xl text-white drop-shadow-[0_0_35px_rgba(255,255,255,1)] drop-shadow-[0_0_60px_rgba(231,255,0,0.9)]"
                            >
                                {count > 0 ? count : '⚡'}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* 4. Optional Skip Tap Button: Appears at 0.8s */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (onCompleteRef.current) onCompleteRef.current();
                        }}
                        className="mt-6 px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-white/70 tracking-widest uppercase cursor-pointer transition-all"
                    >
                        Tap to Resume Immediately ➔
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
