import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, Copy, Check, Palette, Type, ShieldCheck, Music, Layers, Eye } from 'lucide-react';

const BRAND_COLORS = [
    { name: "Atelier Electric Volt", hex: "#E7FF00", rgb: "231, 255, 0", role: "Primary Interactive Pulse & HUD" },
    { name: "18K Antique Gold", hex: "#C8A96E", rgb: "200, 169, 110", role: "Emblem Rim & VIP Metal Medallion" },
    { name: "Imperial Pure Gold", hex: "#FFD700", rgb: "255, 215, 0", role: "3D Logo Highlights & Crown Seal" },
    { name: "Emerald Neon Pulse", hex: "#00FF88", rgb: "0, 255, 136", role: "Active Radar Waypoints & Progress" },
    { name: "Bordeaux Crimson", hex: "#7A1526", rgb: "122, 21, 38", role: "Pinot Noir Decanter & Velvet Couture" },
    { name: "Frankfurt Void Black", hex: "#060606", rgb: "6, 6, 6", role: "100% Deep Velvet Midnight Neutral" }
];

export function BrandCiBiModal({ isOpen, onClose }) {
    const [copiedHex, setCopiedHex] = useState(null);

    if (!isOpen) return null;

    const copyColor = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 1800);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-3 sm:p-6 select-none overflow-hidden"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.92, y: 25 }}
                    animate={{ scale: 1.0, y: 0 }}
                    exit={{ scale: 0.92, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-3xl bg-[#09080A] border-2 border-[#C8A96E]/50 flex flex-col overflow-hidden shadow-[0_0_120px_rgba(200,169,110,0.35)]"
                >
                    {/* 1. Top HUD Bar */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/70 backdrop-blur-md z-30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFD700] via-[#C8A96E] to-[#8C6B2D] p-0.5 shadow-[0_0_15px_rgba(200,169,110,0.6)]">
                                <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center text-[#E7FF00] font-black text-xs">
                                    ⚜️
                                </div>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    CORPORATE & BRAND IDENTITY SYSTEM
                                </span>
                                <h2 className="font-sans text-base sm:text-lg font-black text-white tracking-wide">
                                    JUST SEAN FLOWS × A TWELVE-MINUTE ALIBI
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

                    {/* 2. Scrollable Specification Content */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col gap-8">
                        {/* Section A: 3D Master Symbol & Philosophy */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-3xl bg-white/[0.02] border border-white/10">
                            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black border border-[#C8A96E]/40 shadow-[0_0_40px_rgba(200,169,110,0.25)]">
                                {/* Interactive 3D Gold Wine Glass + G-Clef Emblem */}
                                <motion.div
                                    animate={{
                                        rotateY: [-8, 8, -8],
                                        filter: [
                                            "drop-shadow(0 0 20px rgba(255,215,0,0.5))",
                                            "drop-shadow(0 0 35px rgba(231,255,0,0.8))",
                                            "drop-shadow(0 0 20px rgba(255,215,0,0.5))"
                                        ]
                                    }}
                                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                                    className="w-32 h-40 flex items-center justify-center"
                                >
                                    <svg viewBox="0 0 100 130" className="w-full h-full">
                                        <defs>
                                            <linearGradient id="cibiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#FFF2B2" />
                                                <stop offset="35%" stopColor="#FFD700" />
                                                <stop offset="70%" stopColor="#C8A96E" />
                                                <stop offset="100%" stopColor="#8C6B2D" />
                                            </linearGradient>
                                        </defs>
                                        {/* Bordeaux Glass Bowl */}
                                        <path d="M 30 15 C 30 50, 70 50, 70 15 Z" fill="none" stroke="url(#cibiGoldGrad)" strokeWidth="6" />
                                        {/* Aged Crimson Pinot Noir Liquid */}
                                        <path d="M 34 26 Q 50 38, 66 26 C 66 38, 34 38, 34 26 Z" fill="#7A1526" />
                                        {/* Seamless Treble Clef Intertwined Stem */}
                                        <path d="M 50 46 C 32 62, 32 90, 52 90 C 66 90, 68 76, 56 70 C 44 64, 42 76, 49 80 M 50 30 L 50 105 C 50 118, 38 116, 40 108" fill="none" stroke="url(#cibiGoldGrad)" strokeWidth="5.5" strokeLinecap="round" />
                                    </svg>
                                </motion.div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase mt-3">
                                    MASTER EMBLEM // 3D FUSION
                                </span>
                            </div>

                            <div className="md:col-span-8 flex flex-col gap-3">
                                <span className="font-mono text-[10px] font-black text-[#C8A96E] tracking-[0.25em] uppercase">
                                    SYMBOLIC PHILOSOPHY
                                </span>
                                <h3 className="font-sans text-xl sm:text-2xl font-black text-white">
                                    Bordeaux Wine Glass & G-Clef Synthesis
                                </h3>
                                <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                    프랑크푸르트 심야 02:00 AM 살롱에서의 사색을 상징하는 <strong>보르도 크리스탈 와인잔</strong>과 432Hz 하모닉 작곡을 상징하는 <strong>높은음자리표(Treble Clef)</strong>가 18K 브러시드 골드로 하나의 선처럼 유기적으로 결합된 하이엔드 아틀리에 마스터피스 엠블럼입니다.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-[#E7FF00]">
                                        🎻 432Hz NATURAL ACOUSTICS
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-[#C8A96E]">
                                        🍷 BORDEAUX PINOT NOIR
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-neutral-300">
                                        🏢 UNTERNEHMERGESELLSCHAFT
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Section B: Official Color Palette System */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-[#E7FF00]">
                                <Palette className="w-4 h-4" />
                                <span className="font-mono text-xs font-black tracking-widest uppercase">
                                    OFFICIAL COLOR PALETTE SYSTEM (CLICK TO COPY HEX)
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                                {BRAND_COLORS.map((col) => {
                                    const isCopied = copiedHex === col.hex;
                                    return (
                                        <div
                                            key={col.hex}
                                            onClick={() => copyColor(col.hex)}
                                            className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#E7FF00] transition-all cursor-pointer flex flex-col group"
                                        >
                                            <div 
                                                className="w-full h-16 rounded-xl mb-2.5 shadow-inner border border-white/20 relative flex items-center justify-center"
                                                style={{ backgroundColor: col.hex }}
                                            >
                                                {isCopied && (
                                                    <span className="px-2 py-0.5 rounded bg-black text-white text-[9px] font-mono font-bold animate-bounce flex items-center gap-1">
                                                        <Check className="w-3 h-3 text-[#E7FF00]" /> COPIED
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-sans text-xs font-bold text-white group-hover:text-[#E7FF00] transition-colors truncate">
                                                {col.name}
                                            </span>
                                            <span className="font-mono text-[10px] font-black text-neutral-400 mt-0.5">
                                                {col.hex}
                                            </span>
                                            <span className="font-sans text-[9px] text-neutral-500 mt-1 line-clamp-2 leading-tight">
                                                {col.role}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section C: Typography & Material Architecture */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Typography */}
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-[#C8A96E]">
                                    <Type className="w-4 h-4" />
                                    <span className="font-mono text-xs font-black tracking-widest uppercase">
                                        TYPOGRAPHY HIERARCHY
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3 pt-1">
                                    <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                                        <span className="font-mono text-[8px] text-neutral-500 block uppercase">Brand Hero (Monospaced 0.2em)</span>
                                        <span className="font-mono text-lg font-black text-white tracking-[0.2em]">JUST . SEAN . FLOWS</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                                        <span className="font-mono text-[8px] text-neutral-500 block uppercase">Master Piece Title (Late Romantic Serif)</span>
                                        <span className="font-serif text-lg font-black text-[#E7FF00] italic">A Twelve-minute Alibi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sound & Materials */}
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-[#00FF88]">
                                    <Music className="w-4 h-4" />
                                    <span className="font-mono text-xs font-black tracking-widest uppercase">
                                        ACOUSTICS & GLASS PHYSICS
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3 pt-1">
                                    <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                                        <span className="font-mono text-[8px] text-neutral-500 block uppercase">Master Tuning</span>
                                        <span className="font-mono text-base font-bold text-white">432Hz Natural Healing Harmonic Tuning</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                                        <span className="font-mono text-[8px] text-neutral-500 block uppercase">Smoked Acrylic Glassmorphism</span>
                                        <span className="font-mono text-xs text-neutral-300">rgba(0,0,0,0.40) + blur(12px) + 2px 18K Gold Rim</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
