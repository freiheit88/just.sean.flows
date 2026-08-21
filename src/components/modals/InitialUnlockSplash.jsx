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
                perspective: '800px',
                transformStyle: 'preserve-3d'
            }}
        >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[3.5px] pointer-events-none z-10" />

            {/* 3D Floating Background Debris with Gyro Parallax */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ transformStyle: 'preserve-3d' }}>
                {ATELIER_DEBRIS_100.map((item) => {
                    const tiltXVal = tilt.x * 22 * item.tiltMult;
                    const tiltYVal = tilt.y * 22 * item.tiltMult;
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

            {/* Central 3D Gyro Rigid Body Container (Immune to Framer Motion Transform Stomping) */}
            <div
                style={{
                    transform: `perspective(800px) rotateX(${-tiltY * 1.1}deg) rotateY(${tiltX * 1.1}deg) translate3d(${ghostOffsetX * 0.9}px, ${ghostOffsetY * 0.9}px, 45px)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.08s ease-out'
                }}
                className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none"
            >
                {/* Vertical Breathing / Float Motion Div */}
                <motion.div
                    animate={{ 
                        y: [12, -12, 12],
                        scale: [1.0, 1.03, 1.0]
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="relative flex flex-col items-center text-center cursor-pointer select-none"
                >
                    {/* Ambient Warm Glow Halo that shifts with Gyro */}
                    <div 
                        className="absolute inset-0 bg-[#E7FF00]/20 filter blur-3xl rounded-full scale-150 pointer-events-none"
                        style={{
                            transform: `translate3d(${ghostOffsetX * -0.5}px, ${ghostOffsetY * -0.5}px, -20px)`
                        }}
                    />

                    {/* 3-Column Precise Grid: 
                        [L] [E] [T]
                        [ ] ['] [S]
                        [ ] [G] [O]
                        [ ] [ ] [!]
                    */}
                    <div className="relative font-mono font-black text-5xl sm:text-6xl text-[#E7FF00] drop-shadow-[0_0_35px_rgba(231,255,0,0.9)] grid grid-cols-3 gap-x-5 gap-y-1 text-center w-52 sm:w-64">
                        {/* Row 1: L E T */}
                        <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">L</span>
                        <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">E</span>
                        <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">T</span>

                        {/* Row 2: _ ' S */}
                        <span></span>
                        <span className="text-4xl sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">'</span>
                        <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">S</span>

                        {/* Row 3: _ G O */}
                        <span></span>
                        <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">G</span>
                        <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">O</span>

                        {/* Row 4: _ _ ! */}
                        <span></span>
                        <span></span>
                        <span className="text-4xl sm:text-5xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">!</span>
                    </div>

                    {/* Touch to Enter Guidance Text */}
                    <div className="mt-8 font-mono text-[10px] sm:text-xs text-white/50 tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] animate-pulse">
                        TOUCH TO ENTER
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
