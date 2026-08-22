import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, Music, Sparkles } from 'lucide-react';

export function FrankfurtAtelierModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.92, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.92, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md rounded-3xl bg-[#0D0B08] border border-[#E7FF00]/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(231,255,0,0.25)] text-white"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="p-2 rounded-xl bg-[#E7FF00]/10 text-[#E7FF00]">
                            <Building2 className="w-5 h-5" />
                        </span>
                        <div>
                            <span className="font-mono text-[10px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                ATELIER HEADQUARTERS
                            </span>
                            <h2 className="font-sans text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                                Unternehmergesellschaft (haftungsbeschränkt)
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4 my-6 text-sm text-neutral-300 leading-relaxed font-sans">
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-[#E7FF00] shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block font-medium uppercase font-mono text-xs tracking-wider text-[#E7FF00]">LOCATION</strong>
                                <span>Frankfurt am Main, State of Hesse, Germany</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                            <Music className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block font-medium uppercase font-mono text-xs tracking-wider text-[#00F0FF]">SANCTUARY PROFILE</strong>
                                <span>Acoustic Classical Violin & Modular Orchestra Sound Atelier + Analogue Salon</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-[#FFE082] shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block font-medium uppercase font-mono text-xs tracking-wider text-[#FFE082]">ROADMAP</strong>
                                <span>Lease Agreement & Official Licensing in Progress ➔ <strong className="text-white">Grand Opening October 2026</strong></span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-full bg-[#E7FF00] hover:bg-[#F3FF66] text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(231,255,0,0.4)] cursor-pointer"
                    >
                        CONFIRM & CLOSE
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
