import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Lock } from 'lucide-react';
import { ATELIER_TITLES, getAcquiredTitles } from '../../constants/titles';

export function TitleMuseumModal({ isOpen, onClose }) {
    const [acquired, setAcquired] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setAcquired(getAcquiredTitles());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const acquiredIds = new Set(acquired.map(a => a.id));

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-3.5 sm:p-5 bg-black/55 backdrop-blur-md select-none"
                onClick={onClose}
            >
                {/* Floating Glassmorphic Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: 16 }}
                    animate={{ opacity: 1, scale: 1.0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 16 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-[420px] rounded-[32px] bg-black/85 backdrop-blur-2xl border border-[#C8A96E]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(200,169,110,0.22)] p-5 sm:p-6 flex flex-col max-h-[82vh] overflow-hidden"
                >
                    {/* Top Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/60 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(231,255,0,0.3)]">
                                🏆
                            </div>
                            <div>
                                <h2 className="font-serif text-base sm:text-lg font-bold text-[#F7EBE1] tracking-wide">
                                    TITLE VAULT
                                </h2>
                                <p className="font-mono text-[9px] text-[#C8A96E] tracking-widest uppercase">
                                    {acquired.length} OF {ATELIER_TITLES.length} UNLOCKED
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            title="Close"
                            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full my-3 overflow-hidden shrink-0 border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(acquired.length / ATELIER_TITLES.length) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#C8A96E] via-[#E7FF00] to-[#00FF88] rounded-full shadow-[0_0_8px_#00FF88]"
                        />
                    </div>

                    {/* Titles List */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar py-1">
                        {ATELIER_TITLES.map((title) => {
                            const isUnlocked = acquiredIds.has(title.id);
                            const record = acquired.find(a => a.id === title.id);

                            return (
                                <div
                                    key={title.id}
                                    className={`relative p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                                        isUnlocked
                                            ? 'bg-black/60 border-[#C8A96E]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                                            : 'bg-black/30 border-white/5 opacity-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border shrink-0 transition-all ${
                                            isUnlocked
                                                ? 'bg-gradient-to-br from-[#2A201A] to-[#120B0F] border-[#E7FF00] shadow-[0_0_12px_rgba(231,255,0,0.3)]'
                                                : 'bg-black/40 border-white/10 text-neutral-500'
                                        }`}>
                                            {isUnlocked ? title.emoji : <Lock className="w-4 h-4 text-neutral-600" />}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className={`font-mono text-xs font-black tracking-wide ${
                                                    isUnlocked ? 'text-[#F7EBE1]' : 'text-neutral-500'
                                                }`}>
                                                    {title.name}
                                                </span>
                                                <span 
                                                    style={{ 
                                                        borderColor: `${title.color}40`,
                                                        color: title.color,
                                                        backgroundColor: `${title.color}15`
                                                    }}
                                                    className="font-mono text-[7px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                                                >
                                                    {title.rarity}
                                                </span>
                                            </div>

                                            {/* Detailed, Concrete Action Description */}
                                            <p className="font-sans text-[10px] text-neutral-300 mt-1 leading-relaxed line-clamp-3">
                                                {title.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0 flex flex-col items-end">
                                        {isUnlocked ? (
                                            <span className="font-mono text-[8px] font-bold text-[#00FF88] flex items-center gap-1">
                                                <span>✓ UNLOCKED</span>
                                            </span>
                                        ) : (
                                            <span className="font-mono text-[8px] font-bold text-neutral-500">
                                                LOCKED
                                            </span>
                                        )}
                                        {isUnlocked && record?.unlockedAt && (
                                            <span className="font-mono text-[7px] text-neutral-500 mt-0.5">
                                                {record.unlockedAt}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
