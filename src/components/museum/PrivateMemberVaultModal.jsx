import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Music, Sparkles, Volume2, ShieldCheck, MapPin, Radio, Key } from 'lucide-react';

export function PrivateMemberVaultModal({ isOpen, onClose, vipProfile }) {
    const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);

    if (!isOpen || !vipProfile) return null;

    const toggleAmbient = () => {
        setIsPlayingAmbient(!isPlayingAmbient);
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(432, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 3.0);
        } catch (e) {}
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-2 sm:p-6 select-none overflow-hidden"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-3xl bg-[#09080A] border-2 border-[#E7FF00]/60 flex flex-col overflow-hidden shadow-[0_0_120px_rgba(231,255,0,0.35)]"
                >
                    {/* Top HUD */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/60 backdrop-blur-md z-30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#E7FF00] text-black shadow-[0_0_15px_#E7FF00]">
                                <Crown className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    EXCLUSIVE PRIVATE VAULT // MEMBER #{vipProfile.memberNumber}
                                </span>
                                <h2 className="font-sans text-base sm:text-lg font-black text-white tracking-wide">
                                    @{vipProfile.instagramId}'s PRIVATE ATELIER
                                </h2>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Vault Stage */}
                    <div className="relative flex-1 bg-black overflow-hidden flex flex-col justify-between p-6 sm:p-10">
                        {/* Background 3D Terrace Room */}
                        <img 
                            src="/assets/spatial/spot_d_terrace.jpg" 
                            alt="" 
                            className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[1px]" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                        {/* Central Personalized Wall Engraving */}
                        <div className="relative z-20 flex flex-col items-center text-center my-auto">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="relative p-8 rounded-3xl bg-black/75 backdrop-blur-xl border border-[#E7FF00]/40 shadow-[0_0_60px_rgba(231,255,0,0.25)] max-w-xl"
                            >
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-[0.4em] uppercase block mb-2">
                                    SANCTUARY RESTRICTED ACCESS
                                </span>
                                <h1 className="font-mono text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E7FF00] to-[#FFE066] drop-shadow-[0_0_25px_rgba(231,255,0,0.8)] tracking-tight">
                                    @{vipProfile.instagramId}
                                </h1>
                                <p className="font-sans text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                                    This sanctuary is permanently reserved for your session. Enjoy the private 432Hz Steinway resonance and midnight Frankfurt terrace skyline.
                                </p>

                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <button
                                        onClick={toggleAmbient}
                                        className="px-5 py-2.5 rounded-2xl bg-[#E7FF00] text-black font-mono text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_20px_#E7FF00] hover:scale-105 cursor-pointer flex items-center gap-2"
                                    >
                                        <Music className="w-4 h-4" />
                                        <span>{isPlayingAmbient ? "🎶 432Hz HARMONIC ACTIVE" : "PLAY 432Hz HARMONIC"}</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Status Deck */}
                        <div className="relative z-20 flex items-center justify-between p-4 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-md font-mono text-[10px] text-neutral-400">
                            <div className="flex items-center gap-2 text-white">
                                <Key className="w-3.5 h-3.5 text-[#E7FF00]" />
                                <span>TIER: FOUNDING ATELIER MEMBER</span>
                            </div>
                            <span className="text-[#E7FF00] font-bold">AUTHENTICATED DIGITAL KEY</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
