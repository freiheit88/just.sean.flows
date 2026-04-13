import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideShield, LucideFeather, LucideLoader2, LucideUpload, LucideCamera, LucideBot } from 'lucide-react';
import MinaDirective from '../../components/MinaDirective';

const IntroEngraveView = ({ selectedLang, userName, setUserName, generateTextCharacter, isAvatarGenerating, handleImageUpload, uploadedImage, generateCharacter, THEME_CONFIG, handleAnalogSoul }) => {
    const [aiUserName, setAiUserName] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMinaExpanded(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className="flex flex-col w-full h-full justify-start items-center px-4 relative z-20 overflow-y-auto no-scrollbar pb-2 pt-2 md:pt-4">
            {/* Removed SEAN'S COMMENT Directive Container */}

            <div className="w-full max-w-4xl flex flex-col gap-3 md:gap-4 shrink-0 transition-all duration-500">
                {/* PRIMARY: Analog Soul (Reject AI) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col justify-between bg-[#110D08]/80 backdrop-blur-xl border border-[#C5A059]/40 shadow-[0_0_30px_rgba(197,160,89,0.15),inset_0_0_20px_rgba(197,160,89,0.05)] relative overflow-hidden group p-5 md:p-8 rounded-lg"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="absolute top-4 right-4 opacity-20"><LucideShield size={64} className="text-[#C5A059]" /></div>

                    <div>
                        <h2 className="text-lg md:text-xl font-serif text-[#C5A059] font-black uppercase tracking-[0.15em] mb-1 drop-shadow-md">
                            Analog
                        </h2>
                        <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-2 text-[#FDFCF0]/80 mb-2 border-l-2 border-[#C5A059]/50 pl-2">
                            USE NICKNAME
                        </h3>
                        <p className="text-[10px] md:text-[11px] text-white/60 leading-snug font-serif italic mb-3 max-w-[95%]">
                            "Skip the A.I. and just use a nickname to enter."
                        </p>
                    </div>

                    <div className="space-y-4 md:space-y-6 relative z-10 w-full mt-auto">
                        <input
                            type="text"
                            maxLength={12}
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            placeholder="YOUR NICKNAME"
                            className="w-full bg-black/40 border-b-2 border-white/20 p-2.5 md:p-3 focus:outline-none font-serif tracking-[0.15em] text-base transition-all focus:border-[#C5A059] text-center text-[#FDFCF0] placeholder-white/20"
                        />
                        <button
                            onClick={() => handleAnalogSoul?.(userName)}
                            disabled={isAvatarGenerating || !userName.trim()}
                            className="w-full py-3.5 border border-[#C5A059]/50 bg-gradient-to-r from-[#C5A059]/10 via-[#C5A059]/20 to-[#C5A059]/10 text-[#FDFCF0] font-black uppercase tracking-[0.15em] text-[10px] hover:bg-[#C5A059]/30 hover:border-[#C5A059] disabled:opacity-30 disabled:grayscale transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)] active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-md relative overflow-hidden group/btn"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/5 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                            <span className="relative z-10 flex items-center gap-2">
                                <LucideFeather size={14} /> START WITH NICKNAME
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* SECONDARY: A.I. Intervention (Accept AI) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col bg-[#050505]/60 relative overflow-hidden group p-5 border border-white/10 opacity-60 hover:opacity-100 transition-opacity duration-500 shadow-xl rounded-lg"
                >
                    <div className="border-l-2 border-white/20 pl-2 mb-3">
                        <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 text-white/50 mb-1">
                            A.I. AVATAR
                        </h3>
                        <p className="text-[9px] text-white/30 leading-snug font-serif italic max-w-[95%]">
                            "Provide your nickname or upload a photo for A.I. synthesis."
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center gap-3 w-full">
                        {!isAvatarGenerating ? (
                            <>
                                <input
                                    type="text"
                                    maxLength={12}
                                    value={aiUserName}
                                    onChange={e => setAiUserName(e.target.value)}
                                    placeholder="YOUR NICKNAME (OPTIONAL)"
                                    className="w-full bg-black/40 border-b-2 border-white/20 p-2 focus:outline-none font-serif tracking-[0.1em] text-sm transition-all focus:border-[#C5A059] text-center text-[#FDFCF0] placeholder-white/20"
                                />
                                <label className="block w-full cursor-pointer group/upload flex-1 min-h-[70px]">
                                    <div className={`w-full h-full p-2 border border-dashed ${uploadedImage ? 'border-[#C5A059]/50 bg-[#C5A059]/10 shadow-[0_0_10px_rgba(197,160,89,0.1)]' : 'border-white/20 bg-white/5 group-hover/upload:bg-white/10 group-hover/upload:border-white/40'} rounded-lg flex flex-col items-center justify-center transition-all backdrop-blur-sm`}>
                                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                        {uploadedImage ? (
                                            <LucideCamera className="text-[#C5A059] mb-2 drop-shadow-[0_0_5px_rgba(197,160,89,0.5)]" size={20} />
                                        ) : (
                                            <LucideUpload className="text-white/40 mb-2 group-hover/upload:text-white/80 transition-colors" size={20} />
                                        )}
                                        <p className="font-sans font-bold uppercase tracking-widest text-[9px] text-white/40 group-hover/upload:text-white/80 transition-colors text-center mt-1">
                                            {uploadedImage ? "PHOTO UPLOADED" : "UPLOAD PHOTO"}
                                        </p>
                                    </div>
                                </label>

                                <AnimatePresence>
                                    {(uploadedImage || aiUserName.trim()) && (
                                        <motion.button
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            onClick={() => generateCharacter(aiUserName)}
                                            className={`w-full py-4 mt-2 bg-white/10 border border-white/30 backdrop-blur-md text-white/90 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white/20 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 rounded-sm`}
                                        >
                                            <LucideBot size={16} /> START A.I. SCAN
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <div className="text-center p-8 w-full mt-2 flex-1 bg-black/40 rounded-sm border border-white/5 flex flex-col items-center justify-center min-h-[150px]">
                                <LucideLoader2 className="animate-spin mx-auto text-white/60 mb-4" size={32} />
                                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-white/80 animate-pulse">Scanning your dimension...</p>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default IntroEngraveView;
