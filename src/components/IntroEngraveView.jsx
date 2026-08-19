import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideChevronRight, LucideVolume2 } from 'lucide-react';

const IntroEngraveView = ({ userName, setUserName, handleAnalogSoul }) => {
    const [dialogueStep, setDialogueStep] = useState(0); // 0: guard shouting, 1: input ready
    const [guardSpeech, setGuardSpeech] = useState("IDs out, everyone! Name and ID!!");

    useEffect(() => {
        // Trigger synthetic bouncer voice if Web Speech API is supported
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance("IDs out, everyone! Name and ID!");
                utterance.pitch = 0.5; // Low pitch for intimidating bouncer voice
                utterance.rate = 0.85; // Slightly slower pacing
                utterance.volume = 0.8;
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                console.log("SpeechSynthesis error:", e);
            }
        }

        // Show name input field after 1.2 seconds
        const timer = setTimeout(() => {
            setDialogueStep(1);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (userName && userName.trim()) {
            handleAnalogSoul?.(userName.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center overflow-hidden font-['Cormorant_Garamond',_serif] select-none">
            {/* 1st Person POV Background (Supports video when uploaded, falls back to 1st person POV image with subtle breathing zoom animation) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video
                    src="/assets/manual_upload/club_entrance_1st_person.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover hidden"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <motion.img
                    src="/assets/manual_upload/club_gate_1st_person.jpg"
                    alt="Club Gate Entrance POV"
                    initial={{ scale: 1.0 }}
                    animate={{ scale: [1.0, 1.05, 1.0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
                />
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
            </div>

            {/* Bouncer Dialogue & Input Form Container */}
            <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center gap-6">
                
                {/* Guard Dialogue Subtitle Floating HUD */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center gap-1.5 bg-black/40 border border-[#C5A059]/30 px-5 py-3 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                >
                    <div className="flex items-center gap-2 text-[#C5A059] text-[9px] font-sans font-black uppercase tracking-[0.25em]">
                        <LucideVolume2 size={12} className="animate-pulse" />
                        <span>[ GATEKEEPER ]</span>
                    </div>
                    <p className="text-xs md:text-sm font-serif text-[#FDFCF0] italic tracking-wider drop-shadow-md">
                        "{guardSpeech}"
                    </p>
                </motion.div>

                {/* Ultra-Minimalist Floating Single Input Field */}
                <AnimatePresence>
                    {dialogueStep >= 1 && (
                        <motion.form
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1.0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col items-center gap-4"
                        >
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    maxLength={16}
                                    autoFocus
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    placeholder="ENTER YOUR NAME..."
                                    className="w-full bg-[#0a0c12]/70 border border-[#C5A059]/40 rounded-xl px-5 py-4 text-center font-serif text-base text-[#FDFCF0] placeholder-white/30 tracking-[0.2em] focus:outline-none focus:border-[#C5A059] focus:shadow-[0_0_25px_rgba(197,160,89,0.3)] transition-all backdrop-blur-xl uppercase"
                                />
                                <div className="absolute inset-0 rounded-xl border border-[#C5A059]/20 pointer-events-none group-hover:border-[#C5A059]/50 transition-colors" />
                            </div>

                            <button
                                type="submit"
                                disabled={!userName || !userName.trim()}
                                className="w-full py-3.5 bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/40 to-[#C5A059]/20 border border-[#C5A059]/60 rounded-xl text-[#FDFCF0] font-sans text-[10px] font-black uppercase tracking-[0.25em] hover:bg-[#C5A059]/50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-md"
                            >
                                <span>INSCRIBE & ENTER</span>
                                <LucideChevronRight size={14} />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default IntroEngraveView;
