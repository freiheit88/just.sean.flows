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

            {/* 3D Floating Background Debris with 50% Gyro Tilt */}
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

            {/* Central 3D LET'S GO! Call to Action */}
            <motion.div
                initial={{ y: 260, opacity: 0 }}
                animate={{ 
                    y: [260, 180, 0, -120],
                    opacity: [0, 1, 0.9, 0]
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
                className="relative flex flex-col items-center text-center cursor-pointer select-none leading-[1.15] z-20"
            >
                <div 
                    className="absolute inset-0 flex flex-col items-center text-center pointer-events-none opacity-90 transition-transform duration-75 ease-out"
                    style={{
                        transform: `translate3d(${-ghostOffsetX}px, ${-ghostOffsetY}px, 20px)`
                    }}
                >
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_20px_#FF0055]">LET</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_20px_#FF0055]">'S</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_20px_#FF0055]">GO</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#FF0055] drop-shadow-[0_0_25px_#FF0055]">!</span>
                </div>

                <div 
                    className="absolute inset-0 flex flex-col items-center text-center pointer-events-none opacity-90 transition-transform duration-75 ease-out"
                    style={{
                        transform: `translate3d(${ghostOffsetX}px, ${ghostOffsetY}px, 20px)`
                    }}
                >
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_20px_#00F0FF]">LET</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_20px_#00F0FF]">'S</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_20px_#00F0FF]">GO</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#00F0FF] drop-shadow-[0_0_25px_#00F0FF]">!</span>
                </div>

                <div className="relative flex flex-col items-center">
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#E7FF00] drop-shadow-[0_0_25px_#E7FF00]">LET</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#E7FF00] drop-shadow-[0_0_25px_#E7FF00]">'S</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#E7FF00] drop-shadow-[0_0_25px_#E7FF00]">GO</span>
                    <span className="font-mono text-4xl sm:text-6xl font-black tracking-[0.5em] block uppercase text-[#E7FF00] drop-shadow-[0_0_30px_#E7FF00]">!</span>
                </div>

                <div className="mt-8 px-6 py-2 rounded-full border border-[#E7FF00]/80 bg-black/60 shadow-[0_0_20px_rgba(231,255,0,0.5)] font-mono text-xs text-[#E7FF00] tracking-widest uppercase animate-pulse">
                    TOUCH ANYWHERE TO ENTER
                </div>
            </motion.div>
        </motion.div>
    );
}
