import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideFlame } from 'lucide-react';

const EngravingSequence = ({ selectedLang, avatarText, avatarImage, isUploadedPhoto, onComplete }) => {
    const [burnPhase, setBurnPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setBurnPhase(1), 500),   // Initiation
            setTimeout(() => setBurnPhase(2), 2000),  // Deep Burn / Image Reveal
            setTimeout(() => setBurnPhase(3), 12000), // Extended 10s display of masterpiece
            setTimeout(() => onComplete?.(), 13500)   // Transition out
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[70000] bg-black overflow-hidden flex flex-col items-center justify-center">
            
            {/* Ambient Background matching selected lang */}
            {selectedLang?.image && (
                <motion.div 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: burnPhase >= 3 ? 0 : 0.4, scale: 1.0 }}
                    transition={{ duration: 4, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center mix-blend-screen pointer-events-none" 
                    style={{ backgroundImage: `url(${selectedLang.image})`, filter: "blur(12px) brightness(0.5)" }} 
                />
            )}

            <div className="relative w-64 md:w-80 aspect-[4/5] perspective-1000">
                <motion.div
                    initial={{ rotateX: 30, scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ 
                        rotateX: burnPhase >= 3 ? 0 : 5, 
                        scale: burnPhase >= 3 ? 1.05 : 1, 
                        opacity: burnPhase >= 3 ? 0 : 1,
                        y: 0
                    }}
                    transition={{ duration: 2, type: 'spring', bounce: 0.4 }}
                    className="w-full h-full rounded-xl border border-[#C5A059]/40 bg-[#0a0806] shadow-[0_0_50px_rgba(197,160,89,0.3)] relative overflow-hidden flex flex-col items-center justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* The Language Hero Image */}
                    {selectedLang?.image && (
                        <div 
                            className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-luminosity" 
                            style={{ backgroundImage: `url(${selectedLang.image})` }} 
                        />
                    )}
                    
                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 z-10 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-20 pointer-events-none" />

                    {/* Clean Cinematic Overlay for AI-Generated Full Scene Replacement */}
                    {avatarImage ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px) brightness(1.5)' }}
                            animate={{ 
                                opacity: burnPhase >= 1 ? 1 : 0, 
                                scale: burnPhase >= 2 ? 1 : 1.05,
                                filter: burnPhase >= 2 ? 'blur(0px) brightness(1) contrast(1.05)' : 'blur(5px) brightness(1.2)'
                            }}
                            transition={{ duration: 1.8, ease: 'easeOut' }}
                            className="absolute inset-0 z-22 bg-cover bg-center"
                            style={{ backgroundImage: `url(${avatarImage})` }}
                        />
                    ) : (
                        // Text Avatar (Fallback)
                        <motion.div 
                            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 pointer-events-none"
                        >
                            <motion.div
                                initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
                                animate={{ 
                                    opacity: burnPhase >= 1 ? 1 : 0, 
                                    filter: burnPhase >= 2 ? 'blur(0px)' : 'blur(5px)',
                                    scale: burnPhase >= 2 ? 1 : 0.98
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="w-full text-center flex flex-col items-center justify-center space-y-6"
                            >
                                {/* Environmental Texture Overlay for the Signboard */}
                                <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#C5A059]/40 to-transparent" />
                                
                                <h1 
                                    className="font-serif font-black uppercase text-center w-full relative z-10 leading-tight break-keep"
                                    style={{
                                        color: '#E5D0A1', // Premium, slightly desaturated gold
                                        textShadow: '0 0 40px rgba(197,160,89,0.5), 0 5px 20px rgba(0,0,0,0.9), 0 0 100px rgba(197,160,89,0.2)',
                                        fontSize: avatarText?.length > 8 ? '2.5rem' : '3.5rem',
                                        wordBreak: 'keep-all',
                                        overflowWrap: 'break-word'
                                    }}
                                >
                                    {avatarText?.split(' ').map((word, i) => (
                                        <span key={i} className="block tracking-[0.2em] mb-2">{word}</span>
                                    ))}
                                </h1>

                                <div className="w-px h-24 bg-gradient-to-t from-transparent via-[#C5A059]/40 to-transparent" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Burning Edge / Spark Effects */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: burnPhase === 2 ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-50 pointer-events-none shadow-[inset_0_0_100px_rgba(197,160,89,0.7)] mix-blend-overlay"
                    />

                </motion.div>
            </div>

            {/* Description UI shown during the 10s extended display */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: (burnPhase >= 2 && burnPhase < 3) ? 1 : 0, y: (burnPhase >= 2 && burnPhase < 3) ? 0 : 15 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="mt-10 text-center px-6 z-[70010] relative max-w-md pointer-events-none"
            >
                <h2 className="text-[#C5A059] font-serif text-2xl md:text-3xl font-black tracking-[0.2em] uppercase mb-4 drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">
                    {selectedLang?.name || 'MUNDUS'}
                </h2>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent mx-auto mb-4" />
                <p className="text-white/80 text-xs md:text-sm tracking-widest font-light leading-relaxed">
                    {selectedLang?.welcome || 'Fate sealed successfully.'}
                </p>
            </motion.div>

            {/* Flashbang Transition out */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: burnPhase >= 3 ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-[80000] bg-white pointer-events-none"
            />
        </div>
    );
};

export default EngravingSequence;
