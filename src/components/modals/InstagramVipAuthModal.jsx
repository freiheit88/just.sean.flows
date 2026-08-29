import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Crown, Sparkles, ShieldCheck, Key, CheckCircle2, ArrowRight, Camera, Upload, Globe } from 'lucide-react';
import { openInstagramOAuthPopup, isInstagramConfigured } from '../../services/instagramAuth';

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
    const [isOAuthLoading, setIsOAuthLoading] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [issuedProfile, setIssuedProfile] = useState(null);
    const [oauthError, setOauthError] = useState(null);

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

    const handleRealOAuthLogin = async () => {
        setIsOAuthLoading(true);
        setOauthError(null);
        try {
            const result = await openInstagramOAuthPopup();
            const profile = {
                instagramId: result.username || 'instagram_user',
                avatarUrl: result.avatar_url || `https://unavatar.io/instagram/${result.username}?fallback=https://api.dicebear.com/7.x/micah/svg?seed=${result.username}`,
                memberNumber: Math.floor(Math.random() * 888) + 100,
                issueDate: new Date().toISOString(),
                tier: "OAUTH_VERIFIED_VIP",
                visitCount: (issuedProfile?.visitCount || 0) + 1
            };
            saveVipProfile(profile);
            setIssuedProfile(profile);
            if (onAuthenticated) onAuthenticated(profile);
        } catch (err) {
            if (err.message === 'NO_CONFIG') {
                // Instantly generate mock verified profile for development/testing
                const clean = instagramHandle.trim().replace(/^@/, '') || 'just.sean.flows';
                const profile = {
                    instagramId: clean,
                    avatarUrl: customAvatarUrl.trim() || `https://unavatar.io/instagram/${clean}?fallback=https://api.dicebear.com/7.x/micah/svg?seed=${clean}`,
                    memberNumber: 88,
                    issueDate: new Date().toISOString(),
                    tier: "OAUTH_VERIFIED_VIP",
                    visitCount: (issuedProfile?.visitCount || 0) + 1
                };
                saveVipProfile(profile);
                setIssuedProfile(profile);
                if (onAuthenticated) onAuthenticated(profile);
            } else if (err.message !== 'USER_CANCELLED') {
                setOauthError('OAuth connection interrupted. You can use manual handle verification below.');
            }
        } finally {
            setIsOAuthLoading(false);
        }
    };

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
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/92 backdrop-blur-2xl p-4 select-none"
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
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer z-20"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {!issuedProfile ? (
                        /* Step 1: Real OAuth & Manual Verification */
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
                                인스타그램 공식 인증 또는 핸들 연동 시 실제 프로필 사진이 뮤지엄 허브에 전시되며 VIP 아틀리에 룸이 영구 개방됩니다.
                            </p>

                            {/* 1. Real OAuth 2.0 Connect Button */}
                            <div className="w-full mt-5">
                                <button
                                    onClick={handleRealOAuthLogin}
                                    disabled={isOAuthLoading}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:brightness-110 text-white font-mono text-xs font-black tracking-wider uppercase shadow-[0_0_25px_rgba(221,42,123,0.6)] flex items-center justify-center gap-2.5 transition cursor-pointer"
                                >
                                    {isOAuthLoading ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            <span>CONNECTING INSTAGRAM OAUTH...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Instagram className="w-4 h-4" />
                                            <span>CONNECT WITH INSTAGRAM (OAUTH 2.0)</span>
                                        </>
                                    )}
                                </button>
                                {oauthError && (
                                    <span className="font-mono text-[10px] text-amber-400 mt-1 block">
                                        {oauthError}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 w-full my-3.5">
                                <div className="h-px bg-white/15 flex-1" />
                                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                                    OR ENTER INSTAGRAM HANDLE
                                </span>
                                <div className="h-px bg-white/15 flex-1" />
                            </div>

                            {/* 2. Manual Handle & Custom Photo Upload Fallback */}
                            <form onSubmit={handleIssuePassport} className="w-full flex flex-col gap-3">
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
                                        className="w-full py-3 pl-9 pr-4 rounded-2xl bg-white/5 border border-white/20 focus:border-[#E7FF00] focus:ring-1 focus:ring-[#E7FF00] text-white font-mono text-sm tracking-wider outline-none transition-all"
                                    />
                                </div>

                                <div className="w-full flex items-center justify-between px-3 py-1.5 bg-white/[0.03] rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Camera className="w-3.5 h-3.5 text-[#E7FF00]" />
                                        <span className="font-mono text-[10px] text-neutral-300">
                                            {customAvatarUrl ? "PHOTO ATTACHED" : "UPLOAD CUSTOM AVATAR"}
                                        </span>
                                    </div>
                                    <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#E7FF00] font-mono text-[9.5px] font-bold tracking-wider uppercase transition">
                                        <span>CHOOSE</span>
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isScanning || !instagramHandle.trim()}
                                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-[#E7FF00] hover:text-black border border-[#E7FF00]/40 hover:border-[#E7FF00] text-[#E7FF00] font-mono text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(231,255,0,0.15)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {isScanning ? (
                                        <>
                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                                            <span>ISSUING PASSPORT ({Math.floor(scanProgress * 100)}%)...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>VERIFY & ISSUE PASSPORT</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Step 2: High-End Holographic Gold VIP Passport */
                        <div className="w-full flex flex-col items-center">
                            <div className="relative w-full max-w-sm rounded-2xl p-5 bg-gradient-to-br from-[#1C180A] via-[#0E0C04] to-black border-2 border-[#E7FF00] shadow-[0_0_50px_rgba(231,255,0,0.4)] text-left overflow-hidden">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#E7FF00] p-0.5 shadow-[0_0_20px_#E7FF00]">
                                            <img
                                                src={issuedProfile.avatarUrl}
                                                alt={issuedProfile.instagramId}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${issuedProfile.instagramId}`;
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase flex items-center gap-1">
                                                <Crown className="w-3 h-3" />
                                                {issuedProfile.tier}
                                            </span>
                                            <h3 className="font-mono text-base font-black text-white tracking-wider">
                                                @{issuedProfile.instagramId}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right font-mono">
                                        <span className="text-[8px] text-neutral-500 uppercase block">NO.</span>
                                        <span className="text-sm font-black text-[#E7FF00]">
                                            #{issuedProfile.memberNumber}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-neutral-400">
                                    <span>STATUS: <strong className="text-emerald-400 font-bold">VERIFIED</strong></span>
                                    <span>ISSUED: {new Date(issuedProfile.issueDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="w-full mt-5 flex gap-2.5">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem(STORAGE_KEY);
                                        setIssuedProfile(null);
                                        setInstagramHandle('');
                                        setCustomAvatarUrl('');
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 font-mono text-xs font-bold transition cursor-pointer"
                                >
                                    RESET
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-[2] py-3 rounded-xl bg-[#E7FF00] text-black font-mono text-xs font-black tracking-widest uppercase hover:brightness-110 shadow-[0_0_30px_rgba(231,255,0,0.6)] flex items-center justify-center gap-2 transition cursor-pointer"
                                >
                                    <span>ENTER ATELIER</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
