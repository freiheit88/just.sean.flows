import React from 'react';
import { motion } from 'framer-motion';

export function Header3D({ isFlowsHit, tiltX = 0, tiltY = 0 }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-[9999] px-6 py-4 md:py-4 flex items-center justify-center pointer-events-none select-none">
            <div className="pointer-events-auto flex items-center justify-center gap-2.5 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_15px_#E7FF00] animate-pulse" />
                <h1 
                    className="font-mono font-black text-base sm:text-lg tracking-[0.38em] uppercase text-[#E7FF00] flex items-center select-none"
                    style={{
                        textShadow: '0 2px 0 #C5A059, 0 4px 0 #000000, 0 6px 18px rgba(231,255,0,0.65)'
                    }}
                >
                    <span>JUST.SEAN.</span>
                    <motion.span
                        animate={isFlowsHit ? {
                            x: [0, 10, -14, 12, -7, 4, 0],
                            y: [0, -8, 10, -6, 4, 0],
                            rotate: [0, 22, -18, 12, -7, 0],
                            scale: [1, 1.5, 0.88, 1.2, 1],
                            color: ["#E7FF00", "#FF0055", "#00F0FF", "#E7FF00"],
                            filter: [
                                "drop-shadow(0 0 0px #E7FF00)",
                                "drop-shadow(0 0 30px #FF0055) drop-shadow(0 0 45px #00F0FF)",
                                "drop-shadow(0 0 18px #E7FF00)",
                                "drop-shadow(0 0 0px #E7FF00)"
                            ]
                        } : {
                            x: tiltX * 0.1,
                            y: tiltY * 0.1,
                            rotate: tiltX * 0.12
                        }}
                        transition={isFlowsHit ? {
                            duration: 0.95,
                            ease: "easeOut"
                        } : {
                            duration: 0.15,
                            ease: "easeOut"
                        }}
                        className="inline-block origin-center"
                    >
                        FLOWS
                    </motion.span>
                </h1>
            </div>
        </header>
    );
}
