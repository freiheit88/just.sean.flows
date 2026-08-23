import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Crown, Sparkles, ShieldCheck, Key, CheckCircle2, ArrowRight, Camera, Upload } from 'lucide-react';

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
    const [customAvatarUrl, setCustomAvatarUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [issuedProfile, setIssuedProfile] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const existing = getStoredVipProfile();
            if (existing) {
                setIssuedProfile(existing);
                setInstagramHandle(existing.instagramId);
                if (existing.avatarUrl) setCustomAvatarUrl(existing.avatarUrl);
            }
        }
    }, [isOpen]);

    const handleIssuePassport = (e) => {
        e.preventDefault();
        const cleanHandle = instagramHandle.trim().replace(/^@/, '');
        if (!cleanHandle) return;

        setIsScanning(true);
        setScanProgress(0);

        // Auto-resolve avatar: Unavatar with fallback to DiceBear SVG
        const resolvedAvatar = customAvatarUrl.trim() || `https://unavatar.io/instagram/${cleanHandle}?fallback=https://api.dicebear.com/7.x/micah/svg?seed=${cleanHandle}`;

        const interval = setInterval(() => {
            setScanProgress((prev) => {
                const next = prev + 0.18;
                if (next >= 1.0) {
                    clearInterval(interval);
                    const newProfile = {
                        instagramId: cleanHandle,
                        avatarUrl: resolvedAvatar,
                        memberNumber: Math.floor(Math.random() * 888) + 100,
                        issueDate: new Date().toISOString(),
                        tier: "FOUNDING_ATELIER_VIP",
                        visitCount: (issuedProfile?.visitCount || 0) + 1
                    };
                    saveVipProfile(newProfile);
                    setIssuedProfile(newProfile);
                    setIsScanning(false);
                    if (onAuthenticated) onAuthenticated(newProfile);
                    return 1.0;
                }
                return next;
            });
        }, 110);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                if (uploadEvent.target?.result) {
                    setCustomAvatarUrl(uploadEvent.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
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
                    {/* Laser Scan Beam */}
                    {isScanning && (
                        <motion.div
                            animate={{ y: ['0%', '450%', '0%'] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E7FF00] to-transparent shadow-[0_0_20px_#E7FF00] pointer-events-none z-30"
                        />
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {!issuedProfile ? (
                        /* Step 1: Input Instagram Handle & Verify */
                        <div className="w-full flex flex-col items-center">
                            {/* Instagram Glowing Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-0.5 shadow-[0_0_30px_rgba(221,42,123,0.5)] mb-4">
                                <div className="w-full h-full bg-black/80 rounded-[14px] flex items-center justify-center text-white">
                                    <Instagram className="w-8 h-8" />
                                </div>
                            </div>

                            <span className="font-mono text-[10px] font-black text-[#E7FF00] tracking-[0.25em] uppercase block">
                                ATELIER PATRON RECOGNITION
                            </span>
                            <h2 className="font-sans text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                                Instagram VIP Membership
                            </h2>
                            <p className="font-sans text-xs text-neutral-300 max-w-sm mt-1.5 leading-relaxed">
                                인스타그램 계정을 연동하면 실제 프로필 사진이 뮤지엄 허브에 전시되며, 회원 전용 3D 살롱 룸이 영구 개방됩니다.
                            </p>

                            <form onSubmit={handleIssuePassport} className="w-full mt-5 flex flex-col gap-3.5">
                                <div className="relative w-full">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm font-bold">
                                        @
                                    </span>
                                    <input
                                        type="text"
                                        value={instagramHandle}
                                        onChange={(e) => setInstagramHandle(e.target.value)}
                                        placeholder="instagram_username"
                                        required
                                        className="w-full py-3.5 pl-9 pr-4 rounded-2xl bg-white/5 border border-white/20 focus:border-[#E7FF00] focus:ring-1 focus:ring-[#E7FF00] text-white font-mono text-sm tracking-wider outline-none transition-all"
                                    />
                                </div>

                                {/* Custom Profile Image / Photo Upload Option */}
                                <div className="w-full flex items-center justify-between px-2 py-1 bg-white/[0.03] rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Camera className="w-4 h-4 text-[#E7FF00]" />
                                        <span className="font-mono text-[10px] text-neutral-300">프로필 사진 직접 등록 (선택)</span>
                                    </div>
                                    <label className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-white cursor-pointer transition-all flex items-center gap-1">
                                        <Upload className="w-3 h-3" />
                                        <span>사진 선택</span>
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>

                                {customAvatarUrl && (
                                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-[#E7FF00]/40">
                                        <img src={customAvatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-[#E7FF00]" />
                                        <span className="font-mono text-[10px] text-[#E7FF00] truncate">사진 로드 완료</span>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isScanning}
                                    type="submit"
                                    className="w-full py-3.5 rounded-2xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(231,255,0,0.6)] flex items-center justify-center gap-2 cursor-pointer mt-1"
                                >
                                    {isScanning ? (
                                        <>
                                            <Sparkles className="w-4 h-4 animate-spin text-black" />
                                            <span>VERIFYING @{instagramHandle} ({Math.floor(scanProgress * 100)}%)...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="w-4 h-4" />
                                            <span>ISSUE VIP DIGITAL PASSPORT</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    ) : (
                        /* Step 2: Digital VIP Passport Card Issued */
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-2 text-[#E7FF00] mb-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-mono text-xs font-black tracking-widest uppercase">
                                    AUTHENTICATION COMPLETE
                                </span>
                            </div>

                            {/* Luxury Holographic Passport Card */}
                            <div className="w-full relative rounded-2xl bg-gradient-to-br from-[#1F1910] via-[#120F0B] to-[#0A0907] border-2 border-[#E7FF00]/70 p-5 shadow-[0_0_35px_rgba(231,255,0,0.35)] flex flex-col items-center text-left overflow-hidden mt-2">
                                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

                                <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-[#E7FF00]" />
                                        <span className="font-mono text-[10px] font-black text-white tracking-widest uppercase">
                                            JUST SEAN FLOWS ATELIER
                                        </span>
                                    </div>
                                    <span className="font-mono text-[9px] font-bold text-[#E7FF00] px-2 py-0.5 rounded bg-[#E7FF00]/15 border border-[#E7FF00]/40">
                                        MEMBER #{issuedProfile.memberNumber}
                                    </span>
                                </div>

                                <div className="w-full flex items-center gap-4 py-4">
                                    {/* User's Verified Profile Photo */}
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#E7FF00] shadow-[0_0_20px_rgba(231,255,0,0.7)] shrink-0 bg-black">
                                        <img 
                                            src={issuedProfile.avatarUrl} 
                                            alt="" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${issuedProfile.instagramId}`;
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <span className="font-mono text-[9px] text-[#E7FF00] tracking-widest uppercase block">
                                            VERIFIED PATRON
                                        </span>
                                        <h3 className="font-sans text-lg font-black text-white">
                                            @{issuedProfile.instagramId}
                                        </h3>
                                        <span className="font-mono text-[9px] text-neutral-400 block mt-0.5">
                                            TIER: {issuedProfile.tier}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-neutral-400">
                                    <span>ISSUED: {new Date(issuedProfile.issueDate).toLocaleDateString()}</span>
                                    <span className="text-[#E7FF00] font-bold">STATUS: ACTIVE</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="w-full py-3.5 rounded-2xl bg-[#E7FF00] hover:bg-white text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(231,255,0,0.6)] flex items-center justify-center gap-2 cursor-pointer mt-5"
                            >
                                <span>ENTER MUSEUM WITH VIP ACCESS</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
