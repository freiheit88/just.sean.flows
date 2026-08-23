import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Crown, Sparkles, ShieldCheck, Key, CheckCircle2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'jsf_vip_member_profile';

export function getStoredVipProfile() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
}

export function saveVipProfile(profile) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {}
}

export function InstagramVipAuthModal({ isOpen, onClose, onAuthenticated }) {
    const [instagramHandle, setInstagramHandle] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [issuedProfile, setIssuedProfile] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const existing = getStoredVipProfile();
            if (existing) {
                setIssuedProfile(existing);
                setInstagramHandle(existing.instagramId);
            }
        }
    }, [isOpen]);

    const handleIssuePassport = (e) => {
        e.preventDefault();
        const cleanHandle = instagramHandle.trim().replace(/^@/, '');
        if (!cleanHandle) return;

        setIsScanning(true);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress((prev) => {
                const next = prev + 0.15;
                if (next >= 1.0) {
                    clearInterval(interval);
                    const newProfile = {
                        instagramId: cleanHandle,
                        memberNumber: Math.floor(Math.random() * 888) + 100,
                        issueDate: new Date().toISOString(),
                        tier: "FOUNDING_ATELIER_VIP",
                        visitCount: 1
                    };
                    saveVipProfile(newProfile);
                    setIssuedProfile(newProfile);
                    setIsScanning(false);
                    if (onAuthenticated) onAuthenticated(newProfile);
                    return 1.0;
                }
                return next;
            });
        }, 120);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-2xl p-4 select-none"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg rounded-3xl bg-[#0B0A0D] border border-[#E7FF00]/40 shadow-[0_0_80px_rgba(231,255,0,0.3)] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
                >
                    {/* Top Ambient Laser Scan Line during verification */}
                    {isScanning && (
                        <motion.div
                            animate={{ y: ['0%', '400%', '0%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E7FF00] to-transparent shadow-[0_0_15px_#E7FF00] pointer-events-none z-30"
                        />
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Header Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E7FF00]/20 to-[#FF0055]/20 border border-[#E7FF00]/50 flex items-center justify-center text-[#E7FF00] mb-4 shadow-[0_0_25px_rgba(231,255,0,0.4)]">
                        <Crown className="w-7 h-7" />
                    </div>

                    <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-[0.3em] uppercase block mb-1">
                        EXCLUSIVE ATELIER MEMBERSHIP
                    </span>
                    <h2 className="font-sans text-xl sm:text-2xl font-black text-white tracking-wide">
                        {issuedProfile ? "VIP ATELIER PASSPORT ISSUED" : "CLAIM YOUR PRIVATE SALON VAULT"}
                    </h2>
                    <p className="font-sans text-xs sm:text-sm text-neutral-300 mt-2 max-w-sm leading-relaxed">
                        {issuedProfile 
                            ? "Your browser is permanently recognized. Your private atelier vault is unlocked."
                            : "Register your Instagram to unlock your own private 3D museum chamber and personalized browser entrance."}
                    </p>

                    {/* Body Form or Issued Golden Passport */}
                    {!issuedProfile ? (
                        <form onSubmit={handleIssuePassport} className="w-full mt-6 flex flex-col gap-4">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
                                    <Instagram className="w-5 h-5 text-[#E7FF00]" />
                                    <span className="ml-2 font-mono font-bold text-white">@</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="your_instagram_handle"
                                    value={instagramHandle}
                                    onChange={(e) => setInstagramHandle(e.target.value)}
                                    disabled={isScanning}
                                    className="w-full py-3.5 pl-14 pr-4 rounded-2xl bg-white/5 border border-white/20 focus:border-[#E7FF00] focus:ring-2 focus:ring-[#E7FF00]/40 text-white font-mono text-sm outline-none transition-all"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isScanning || !instagramHandle.trim()}
                                className="w-full py-3.5 px-6 rounded-2xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(231,255,0,0.8)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isScanning ? (
                                    <span>HOLOGRAPHIC SCANNING... {Math.floor(scanProgress * 100)}%</span>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        <span>ISSUE VIP DIGITAL PASSPORT</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        /* Issued 3D Digital Passport Card */
                        <div className="w-full mt-6 flex flex-col items-center">
                            <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#1C1814] via-[#2A231C] to-[#0F0D0B] border-2 border-[#E7FF00] p-5 shadow-[0_0_40px_rgba(231,255,0,0.4)] text-left flex flex-col justify-between">
                                <div className="flex items-center justify-between pb-3 border-b border-[#E7FF00]/30">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#E7FF00]" />
                                        <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase">
                                            FOUNDING VIP MEMBER
                                        </span>
                                    </div>
                                    <span className="font-mono text-[10px] font-bold text-white/60">
                                        #{issuedProfile.memberNumber}
                                    </span>
                                </div>

                                <div className="my-3">
                                    <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider block">IDENTIFIER</span>
                                    <h3 className="font-mono text-xl font-black text-white tracking-wide">
                                        @{issuedProfile.instagramId}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] font-mono text-neutral-300">
                                    <span>STATUS: PERMANENT RECOGNITION</span>
                                    <span className="text-[#E7FF00] font-bold">VAULT UNLOCKED</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-5 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white uppercase transition-all cursor-pointer"
                            >
                                ENTER MY ATELIER
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
