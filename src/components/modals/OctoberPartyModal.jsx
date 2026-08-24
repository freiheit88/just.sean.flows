import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, MapPin, Wine, Crown, Bell } from 'lucide-react';

export function OctoberPartyModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 select-none"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.92, y: 20 }}
                    animate={{ scale: 1.0, y: 0 }}
                    exit={{ scale: 0.92, y: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md rounded-3xl bg-[#0B0A0D] border-2 border-[#E7FF00]/60 shadow-[0_0_80px_rgba(231,255,0,0.35)] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Background Ambient Glow */}
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#E7FF00]/15 to-transparent pointer-events-none" />

                    <span className="px-3.5 py-1 rounded-full bg-[#E7FF00]/15 border border-[#E7FF00]/40 font-mono text-[9px] font-black text-[#E7FF00] tracking-[0.3em] uppercase mb-3">
                        ✦ EXCLUSIVE PRIVATE INVITATION
                    </span>

                    <h2 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight">
                        OCTOBER 2026 GALA
                    </h2>
                    <span className="font-mono text-xs text-[#C8A96E] tracking-widest uppercase mt-0.5">
                        FRANKFURT SALON PARTY
                    </span>

                    <div className="w-full my-5 py-4 px-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2.5 text-left font-mono text-xs text-neutral-300">
                        <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-[#E7FF00]" />
                            <span>DATE: OCTOBER 2026 (COMING SOON)</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-[#C8A96E]" />
                            <span>VENUE: SECRET SALON, FRANKFURT AM MAIN</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Wine className="w-4 h-4 text-[#FF0055]" />
                            <span>DRESS CODE: BLACK VELVET & 18K GOLD</span>
                        </div>
                    </div>

                    <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-5">
                        JUST SEAN FLOWS VIP 회원을 위한 프라이빗 살롱 파티가 10월에 개최됩니다.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-2xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(231,255,0,0.6)] cursor-pointer"
                    >
                        NOTIFY ME WHEN OPEN
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
