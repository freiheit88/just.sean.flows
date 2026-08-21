import React from 'react';
import { motion } from 'framer-motion';
import { ATELIER_DEBRIS_100 } from '../../constants/debrisParticles';

export function InitialUnlockSplash({ isAudioUnlocked, onUnlock, tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY }) {
    if (isAudioUnlocked) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={onUnlock}
            onTouchStart={onUnlock}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/90 cursor-pointer overflow-hidden select-none"
            style={{
                perspective: '600px',
                transformStyle: 'preserve-3d'
            }}
        >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[3.5px] pointer-events-none z-10" />

            {/* 3D Floating Background Debris */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ transformStyle: 'preserve-3d' }}>
                {ATELIER_DEBRIS_100.map((item) => {
                    const tiltXVal = tilt.x * 16 * item.tiltMult;
                    const tiltYVal = tilt.y * 16 * item.tiltMult;
                    const startY = item.isLarge ? '85vh' : '108vh';
                    const endY = item.isLarge ? '10vh' : '-28vh';

                    return (
                        <motion.div
                            key={item.id}
                            initial={{
                                y: startY,
                                x: 0,
                                opacity: 0,
                                scale: 0.6,
                                rotate: item.rotation
                            }}
                            animate={{
                                y: [startY, endY],
                                x: [0, item.pullXPx],
                                opacity: [0, item.opacityMax, 0],
                                scale: [0.6, 1.15, 0.5],
                                rotate: [item.rotation, item.rotation * -0.5, item.rotation]
                            }}
                            transition={{
                                duration: item.duration,
                                repeat: Infinity,
                                delay: item.delay,
                                ease: 'easeInOut'
                            }}
                            style={{
                                left: item.left,
                                top: 0,
                                transform: `translate3d(${tiltXVal}px, ${tiltYVal}px, ${item.zDepth}px)`
                            }}
                            className="absolute select-none flex items-center justify-center pointer-events-none"
                        >
                            <div 
                                className={`${item.fontFamily} ${item.sizeClass} tracking-wider`}
                                style={{ color: item.color }}
                            >
                                {item.text}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Central 3D LET ' S GO ! 3-Column Grid matching media_1787346426285.png */}
            <motion.div
                initial={{ y: 220, opacity: 0 }}
                animate={{ 
                    y: [220, 160, 0, -100],
                    opacity: [0, 1, 0.95, 0]
                }}
                transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    times: [0, 0.18, 0.65, 1],
                    ease: 'easeInOut'
                }}
                style={{
                    transform: `perspective(600px) rotateX(${tiltY * -0.6}deg) rotateY(${tiltX * 0.6}deg) translateZ(30px)`,
                    transformStyle: 'preserve-3d'
                }}
                className="relative flex flex-col items-center text-center cursor-pointer select-none z-20"
            >
                {/* Ambient Warm Glow Halo */}
                <div className="absolute inset-0 bg-[#E7FF00]/15 filter blur-3xl rounded-full scale-150 pointer-events-none" />

                {/* 3-Column Precise Grid: 
                    [L] [E] [T]
                    [ ] ['] [S]
                    [ ] [G] [O]
                    [ ] [ ] [!]
                */}
                <div className="relative font-mono font-black text-5xl sm:text-6xl text-[#E7FF00] drop-shadow-[0_0_35px_rgba(231,255,0,0.85)] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64">
                    {/* Row 1: L E T */}
                    <span>L</span>
                    <span>E</span>
                    <span>T</span>

                    {/* Row 2: _ ' S */}
                    <span></span>
                    <span className="text-4xl sm:text-5xl">'</span>
                    <span>S</span>

                    {/* Row 3: _ G O */}
                    <span></span>
                    <span>G</span>
                    <span>O</span>

                    {/* Row 4: _ _ ! */}
                    <span></span>
                    <span></span>
                    <span className="text-4xl sm:text-5xl font-black">!</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
