import { ModularSoundLabModal } from './ModularSoundLabModal';
import { SpatialSalonViewerModal } from './SpatialSalonViewerModal';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Compass, Music, MapPin, Eye, Radio, Play, Crown, Key, Instagram, ChevronLeft, ChevronRight, Globe, Clock, ShieldCheck } from 'lucide-react';
import { CoutureLookbookModal } from './CoutureLookbookModal';

const MUSEUM_ORBS = [
    {
        id: 'vip_vault',
        title: "VIP Member Private Vault",
        sub: "Claim your dedicated 3D room with Instagram Verification",
        tag: "RESTRICTED ACCESS",
        img: "/assets/spatial/spot_d_terrace.jpg",
        badge: "👑 VIP VAULT",
        isInteractive: true,
        isVip: true
    },
    {
        id: 'lookbook',
        title: "2026 Velvet & Gold Couture",
        sub: "18K Favicon Hardware & Silk Twill Collection",
        tag: "AUTUMN 2026",
        img: "/assets/lookbook/lookbook_01_portrait.jpg",
        badge: "EXHIBIT 01",
        isInteractive: true
    },
    {
        id: 'piano_salon',
        title: "Golden Steinway Salon",
        sub: "Late Romantic Acoustic Sanctuary & Violin Chamber",
        tag: "SALON 02:00 AM",
        img: "/assets/walk_story_07_grand_piano_salon.jpg",
        badge: "SANCTUARY",
        isInteractive: false
    },
    {
        id: 'midnight_walk',
        title: "Frankfurt Midnight Walk",
        sub: "1st-Person Interactive Atmospheric Prologue",
        tag: "FRANKFURT AM MAIN",
        img: "/assets/walk_story_01_far_alley.jpg",
        badge: "EXPERIENCE",
        isInteractive: false
    },
    {
        id: 'wireframe_studio',
        title: "직접 만들기 (Create World)",
        sub: "AI Generative Interactive World Sandbox",
        tag: "EXPERIMENT",
        isWireframe: true,
        badge: "LABS CORE",
        isInteractive: false
    },
    {
        id: 'stained_glass',
        title: "Stained Glass Archway",
        sub: "Unternehmergesellschaft Official Corporate Archive",
        tag: "ATELIER ARCH",
        img: "/assets/walk_story_04_look_up_logo.jpg",
        badge: "HERITAGE",
        isInteractive: false
    },
    {
        id: 'amber_speakeasy',
        title: "Amber Speakeasy Shift",
        sub: "Analogue Vinyl Bar & Dynamic Lighting Shift",
        tag: "ANALOGUE LOUNGE",
        img: "/assets/walk_story_05_amber_glow_shift.jpg",
        badge: "ACOUSTICS",
        isInteractive: false
    },
    {
        id: 'sound_lab',
        title: "Modular Orchestra Sound Lab",
        sub: "A TWELVE-MINUTE ALIBI Vinyl Master Audio",
        tag: "44.1kHz MASTER",
        img: "/assets/lookbook/lookbook_13_wineglass.jpg",
        badge: "SOUNDTRACK",
        isInteractive: false
    },
    {
        id: 'leather_journal',
        title: "Atelier Records & Journal",
        sub: "Official German Licensing & Architectural Blueprints",
        tag: "LEGAL ARCHIVE",
        img: "/assets/lookbook/lookbook_14_journal.jpg",
        badge: "DOCUMENTS",
        isInteractive: false
    }
];

export function AtelierMuseumHub({ 
    isOpen, 
    onClose, 
    onReplayWalk,
    onOpenVipAuth,
    onOpenPrivateVault,
    vipProfile
}) {
    const [selectedOrb, setSelectedOrb] = useState(null);
    const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);
    const [isSpatialSalonOpen, setIsSpatialSalonOpen] = useState(false);
    const [isSoundLabOpen, setIsSoundLabOpen] = useState(false);
    const [activeOrbIndex, setActiveOrbIndex] = useState(0);

    const scrollTrackRef = useRef(null);

    if (!isOpen) return null;

    const handleOrbClick = (orb) => {
        if (orb.id === 'vip_vault') {
            if (vipProfile && onOpenPrivateVault) {
                onOpenPrivateVault();
            } else if (onOpenVipAuth) {
                onOpenVipAuth();
            }
        } else if (orb.id === 'lookbook') {
            setIsLookbookModalOpen(true);
        } else if (orb.id === 'piano_salon' || orb.id === 'wireframe_studio') {
            setIsSpatialSalonOpen(true);
        } else if (orb.id === 'sound_lab' || orb.id === 'amber_speakeasy') {
            setIsSoundLabOpen(true);
        } else if (orb.id === 'midnight_walk') {
            onReplayWalk();
        } else {
            setSelectedOrb(orb);
        }
    };

    const scrollByStep = (direction) => {
        if (!scrollTrackRef.current) return;
        const width = 280;
        scrollTrackRef.current.scrollBy({
            left: direction * width,
            behavior: 'smooth'
        });
    };

    const scrollToIndex = (idx) => {
        if (!scrollTrackRef.current) return;
        const width = 280;
        scrollTrackRef.current.scrollTo({
            left: idx * width,
            behavior: 'smooth'
        });
        setActiveOrbIndex(idx);
    };

    const handleTrackScroll = () => {
        if (!scrollTrackRef.current) return;
        const scrollLeft = scrollTrackRef.current.scrollLeft;
        const width = 280;
        const idx = Math.round(scrollLeft / width);
        setActiveOrbIndex(Math.min(MUSEUM_ORBS.length - 1, Math.max(0, idx)));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-50 bg-[#060606] text-white flex flex-col select-none overflow-hidden"
            >
                {/* 1. Architectural Gilded Crown Bar & Mobile Notch Safe-Area */}
                <div className="w-full bg-[#0E0C09] border-b border-[#C8A96E]/30 shrink-0 z-30 pt-[max(env(safe-area-inset-top),6px)]">
                    {/* Live Frankfurt Atelier Marquee Ticker */}
                    <div className="w-full py-1 px-4 bg-black/70 border-b border-white/5 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-neutral-400 overflow-hidden">
                        <div className="flex items-center gap-2 text-[#E7FF00] shrink-0 font-bold">
                            <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7FF00] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1 w-1 bg-[#E7FF00]"></span>
                            </span>
                            <span>LIVE FRANKFURT ATELIER</span>
                        </div>

                        {/* Running Ticker Info */}
                        <div className="hidden sm:flex items-center gap-6 text-neutral-300 font-medium tracking-wider">
                            <span>📍 FRANKFURT AM MAIN, GERMANY</span>
                            <span>•</span>
                            <span>🌙 02:00 AM MIDNIGHT SESSION</span>
                            <span>•</span>
                            <span>🎻 432Hz STEINWAY ACOUSTIC</span>
                            <span>•</span>
                            <span>🏢 UNTERNEHMERGESELLSCHAFT ARCHIVE</span>
                        </div>

                        <div className="flex items-center gap-2 text-[#C8A96E] shrink-0 font-bold">
                            <span>EXPEDITION 2026</span>
                        </div>
                    </div>

                    {/* Main Navigation Header Row */}
                    <header className="px-4 sm:px-10 py-3 flex items-center justify-between bg-black/60 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFD700] via-[#C8A96E] to-[#8C6B2D] p-0.5 shadow-[0_0_12px_rgba(200,169,110,0.5)]">
                                <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center text-[#E7FF00] font-black text-xs">
                                    JSF
                                </div>
                            </div>
                            <div>
                                <h1 className="font-sans font-black text-sm sm:text-lg tracking-tight text-white flex items-center gap-2 leading-none">
                                    <span>JUST SEAN FLOWS</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono text-[8px] font-bold tracking-widest uppercase border border-white/15">
                                        ATELIER
                                    </span>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            {/* Instagram VIP Authentication Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (vipProfile && onOpenPrivateVault) {
                                        onOpenPrivateVault();
                                    } else if (onOpenVipAuth) {
                                        onOpenVipAuth();
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-black tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                                    vipProfile 
                                        ? 'bg-[#E7FF00] text-black border-[#E7FF00] shadow-[0_0_18px_rgba(231,255,0,0.8)]' 
                                        : 'bg-gradient-to-r from-[#1E1912] to-[#2E2519] text-[#E7FF00] border-[#E7FF00]/60 hover:border-[#E7FF00] shadow-[0_0_12px_rgba(231,255,0,0.3)]'
                                }`}
                            >
                                <Crown className="w-3.5 h-3.5" />
                                <span>
                                    {vipProfile ? `@${vipProfile.instagramId} 👑` : "VIP 인증"}
                                </span>
                            </motion.button>

                            <button
                                onClick={onReplayWalk}
                                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white font-mono text-[11px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer border border-white/15"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                <span>WALK AGAIN</span>
                            </button>
                        </div>
                    </header>
                </div>

                {/* 2. Main Horizontal Snap Orbit Carousel Stage */}
                <main className="flex-1 flex flex-col justify-center px-4 sm:px-12 py-4 overflow-hidden relative">
                    <div className="max-w-6xl w-full mx-auto flex flex-col gap-3 sm:gap-4">
                        {/* Section Header with Left/Right Nav Arrows */}
                        <div className="flex items-end justify-between px-2">
                            <div>
                                <span className="font-mono text-[9px] sm:text-[10px] font-black text-[#E7FF00] tracking-[0.25em] uppercase block">
                                    SWIPE HORIZONTALLY // EXPEDITION ORBS
                                </span>
                                <h2 className="font-sans text-xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                                    The Frankfurt Atelier Archive
                                </h2>
                            </div>

                            {/* Left / Right Navigation Controls */}
                            <div className="hidden sm:flex items-center gap-2">
                                <button
                                    onClick={() => scrollByStep(-1)}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 hover:border-[#E7FF00] text-neutral-300 hover:text-[#E7FF00] flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => scrollByStep(1)}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 hover:border-[#E7FF00] text-neutral-300 hover:text-[#E7FF00] flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Horizontal Snap Scroll Track */}
                        <div 
                            ref={scrollTrackRef}
                            onScroll={handleTrackScroll}
                            className="flex items-center gap-6 sm:gap-10 overflow-x-auto snap-x snap-mandatory scroll-smooth py-5 px-4 select-none"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            {MUSEUM_ORBS.map((orb, index) => {
                                const isVipOrb = orb.id === 'vip_vault';
                                const displayTitle = isVipOrb && vipProfile ? `@${vipProfile.instagramId}'s Vault` : orb.title;
                                const displaySub = isVipOrb && vipProfile ? `MEMBER #${vipProfile.memberNumber} // UNLOCKED` : orb.sub;
                                const displayTag = isVipOrb && vipProfile ? "VAULT UNLOCKED" : orb.tag;
                                const isSelected = activeOrbIndex === index;

                                return (
                                    <motion.div
                                        key={orb.id}
                                        whileHover={{ y: -8, scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleOrbClick(orb)}
                                        className="snap-center shrink-0 w-52 sm:w-64 flex flex-col items-center text-center cursor-pointer group select-none"
                                    >
                                        {/* Circular Sphere Lens */}
                                        <div className={`relative w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-2 shadow-2xl transition-all duration-300 ${
                                            isVipOrb 
                                                ? 'border-[#E7FF00] shadow-[0_0_40px_rgba(231,255,0,0.6)] group-hover:shadow-[0_0_60px_#E7FF00]' 
                                                : isSelected
                                                ? 'border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                                : 'border-white/20 group-hover:border-[#E7FF00] group-hover:shadow-[0_0_30px_rgba(231,255,0,0.4)]'
                                        }`}>
                                            {orb.isWireframe ? (
                                                /* 직접 만들기 Wireframe Sandbox */
                                                <div className="w-full h-full bg-[#0E0E0C] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-[radial-gradient(#E7FF00_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
                                                    <div className="w-12 h-12 rounded-full border-2 border-[#E7FF00] border-dashed flex items-center justify-center text-[#E7FF00] mb-2 animate-spin-slow">
                                                        <Compass className="w-6 h-6" />
                                                    </div>
                                                    <span className="font-sans text-xs sm:text-sm font-black text-white z-10">
                                                        직접 만들기
                                                    </span>
                                                    <span className="font-mono text-[8px] sm:text-[9px] text-[#E7FF00] tracking-widest uppercase z-10 mt-0.5">
                                                        CREATE WORLD
                                                    </span>
                                                </div>
                                            ) : isVipOrb && vipProfile?.avatarUrl ? (
                                                /* Verified Instagram Profile Photo Display */
                                                <div className="relative w-full h-full bg-black flex items-center justify-center">
                                                    <img
                                                        src={vipProfile.avatarUrl}
                                                        alt={vipProfile.instagramId}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(e) => {
                                                            e.target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${vipProfile.instagramId}`;
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/20 pointer-events-none" />
                                                    <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#E7FF00] text-black flex items-center justify-center shadow-[0_0_15px_#E7FF00] border border-black">
                                                        <Crown className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            ) : (
                                                /* High-Res Photographic Asset Lens */
                                                <div className="relative w-full h-full bg-black">
                                                    <img
                                                        src={orb.img}
                                                        alt={orb.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/20 pointer-events-none" />
                                                    {isVipOrb && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                            <div className="w-14 h-14 rounded-full bg-[#E7FF00] text-black flex items-center justify-center shadow-[0_0_25px_#E7FF00]">
                                                                <Crown className="w-7 h-7" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Top Pill Badge */}
                                            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[8px] font-mono font-bold text-[#E7FF00] tracking-wider uppercase whitespace-nowrap">
                                                {orb.badge}
                                            </div>
                                        </div>

                                        {/* Meta Label Info */}
                                        <div className="mt-3 flex flex-col items-center max-w-[200px]">
                                            <span className="font-mono text-[8px] sm:text-[9px] text-[#E7FF00] tracking-widest uppercase block">
                                                {displayTag}
                                            </span>
                                            <h3 className="font-sans text-sm sm:text-base font-bold text-white group-hover:text-[#E7FF00] transition-colors mt-0.5">
                                                {displayTitle}
                                            </h3>
                                            <p className="font-sans text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
                                                {displaySub}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Bottom Orbit Pagination Dots */}
                        <div className="flex items-center justify-between px-3 pt-1">
                            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">
                                {activeOrbIndex + 1} / {MUSEUM_ORBS.length} ORBS
                            </span>

                            <div className="flex items-center gap-2">
                                {MUSEUM_ORBS.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => scrollToIndex(idx)}
                                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                                            activeOrbIndex === idx 
                                                ? 'w-6 h-1.5 bg-[#E7FF00] shadow-[0_0_10px_#E7FF00]' 
                                                : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>

                            <span className="font-mono text-[8px] text-[#E7FF00] tracking-widest uppercase hidden sm:inline-block">
                                SWIPE / DRAG TO EXPLORE
                            </span>
                        </div>
                    </div>
                </main>

                {/* Sub Modals */}
                <CoutureLookbookModal
                    isOpen={isLookbookModalOpen}
                    onClose={() => setIsLookbookModalOpen(false)}
                />

                <SpatialSalonViewerModal
                    isOpen={isSpatialSalonOpen}
                    onClose={() => setIsSpatialSalonOpen(false)}
                />

                <ModularSoundLabModal
                    isOpen={isSoundLabOpen}
                    onClose={() => setIsSoundLabOpen(false)}
                />
            </motion.div>
        </AnimatePresence>
    );
}
