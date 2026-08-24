import { BrandCiBiModal } from '../modals/BrandCiBiModal';
import { ModularSoundLabModal } from './ModularSoundLabModal';
import { SpatialSalonViewerModal } from './SpatialSalonViewerModal';
import { OctoberPartyModal } from '../modals/OctoberPartyModal';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Compass, Music, MapPin, Eye, Crown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CoutureLookbookModal } from './CoutureLookbookModal';

// EXACT 5 Master Core Contents
const MASTER_EXHIBITS = [
    {
        id: 'vip_vault',
        title: "VIP Member Private Vault",
        sub: "인스타그램 인증 시 회원 전용 3D 성소 & 사진 전시",
        tag: "RESTRICTED ACCESS",
        img: "/assets/spatial/spot_d_terrace.jpg",
        badge: "👑 VIP VAULT",
        isVip: true
    },
    {
        id: 'lookbook',
        title: "2026 Velvet & Gold Couture",
        sub: "18K Favicon Hardware & Silk Twill Collection",
        tag: "EXHIBIT 01 // COUTURE",
        img: "/assets/lookbook/lookbook_01_portrait.jpg",
        badge: "AUTUMN 2026"
    },
    {
        id: 'piano_salon',
        title: "3D Spatial Salon & Steinway",
        sub: "1924 Vintage Steinway & 432Hz 1인칭 가상 세계 탐험",
        tag: "EXHIBIT 02 // 3D SPATIAL",
        img: "/assets/walk_story_07_grand_piano_salon.jpg",
        badge: "3D SALON"
    },
    {
        id: 'brand_cibi',
        title: "CI / BI Brand Identity System",
        sub: "3D 와인잔 엠블럼, 공식 컬러 시스템 & 432Hz 음향 명세",
        tag: "EXHIBIT 03 // BRAND CI/BI",
        img: "/assets/logo/jsf_official_logo.jpg",
        badge: "BRAND CI/BI"
    },
    {
        id: 'october_party',
        title: "October Private Salon Gala",
        sub: "10월 프라이빗 살롱 파티 // COMING SOON",
        tag: "OCTOBER 2026 // FRANKFURT",
        img: "/assets/events/october_party_2026.jpg",
        badge: "✦ COMING SOON"
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
    const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);
    const [isSpatialSalonOpen, setIsSpatialSalonOpen] = useState(false);
    const [isSoundLabOpen, setIsSoundLabOpen] = useState(false);
    const [isCiBiModalOpen, setIsCiBiModalOpen] = useState(false);
    const [isOctoberPartyOpen, setIsOctoberPartyOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollTrackRef = useRef(null);

    if (!isOpen) return null;

    const handleExhibitClick = (exhibit) => {
        if (exhibit.id === 'vip_vault') {
            if (vipProfile && onOpenPrivateVault) {
                onOpenPrivateVault();
            } else if (onOpenVipAuth) {
                onOpenVipAuth();
            }
        } else if (exhibit.id === 'lookbook') {
            setIsLookbookModalOpen(true);
        } else if (exhibit.id === 'piano_salon') {
            setIsSpatialSalonOpen(true);
        } else if (exhibit.id === 'brand_cibi') {
            setIsCiBiModalOpen(true);
        } else if (exhibit.id === 'october_party') {
            setIsOctoberPartyOpen(true);
        }
    };

    const scrollByStep = (direction) => {
        if (!scrollTrackRef.current) return;
        const cardWidth = scrollTrackRef.current.offsetWidth * 0.85;
        scrollTrackRef.current.scrollBy({
            left: direction * cardWidth,
            behavior: 'smooth'
        });
    };

    const scrollToIndex = (idx) => {
        if (!scrollTrackRef.current) return;
        const cardWidth = scrollTrackRef.current.offsetWidth * 0.85;
        scrollTrackRef.current.scrollTo({
            left: idx * cardWidth,
            behavior: 'smooth'
        });
        setActiveIndex(idx);
    };

    const handleTrackScroll = () => {
        if (!scrollTrackRef.current) return;
        const scrollLeft = scrollTrackRef.current.scrollLeft;
        const cardWidth = scrollTrackRef.current.offsetWidth * 0.85;
        const idx = Math.round(scrollLeft / cardWidth);
        setActiveIndex(Math.min(MASTER_EXHIBITS.length - 1, Math.max(0, idx)));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="fixed inset-0 z-50 bg-[#060606] text-white flex flex-col select-none overflow-hidden"
            >
                {/* 1. Ultra-Clean Minimal Top Header: ONLY JUST SEAN FLOWS & VIP */}
                <header className="w-full px-5 sm:px-10 py-4 flex items-center justify-between shrink-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-30 pt-[max(env(safe-area-inset-top),12px)]">
                    {/* Brand Wordmark */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFD700] via-[#C8A96E] to-[#8C6B2D] p-0.5 shadow-[0_0_12px_rgba(200,169,110,0.5)]">
                            <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center text-[#E7FF00] font-black text-xs">
                                ⚜️
                            </div>
                        </div>
                        <h1 className="font-mono font-black text-base sm:text-lg tracking-[0.2em] text-white">
                            JUST SEAN FLOWS
                        </h1>
                    </div>

                    {/* Right VIP & Navigation */}
                    <div className="flex items-center gap-2.5">
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
                            className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-black tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
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
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer border border-white/15"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>WALK</span>
                        </button>
                    </div>
                </header>

                {/* 2. Main Full-Screen Immersive 5-Card Horizontal Snap Carousel */}
                <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-10 py-3 overflow-hidden relative">
                    {/* Left / Right Quick Arrows (Desktop) */}
                    <button
                        onClick={() => scrollByStep(-1)}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-[#E7FF00] text-white hover:text-[#E7FF00] items-center justify-center transition-all cursor-pointer shadow-2xl"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scrollByStep(1)}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-[#E7FF00] text-white hover:text-[#E7FF00] items-center justify-center transition-all cursor-pointer shadow-2xl"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Horizontal Snap Scroll Track */}
                    <div 
                        ref={scrollTrackRef}
                        onScroll={handleTrackScroll}
                        className="w-full flex items-center gap-5 sm:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 px-2 select-none justify-start md:justify-center"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {MASTER_EXHIBITS.map((item, index) => {
                            const isVipItem = item.id === 'vip_vault';
                            const isOctober = item.id === 'october_party';
                            const displayTitle = isVipItem && vipProfile ? `@${vipProfile.instagramId}'s Vault` : item.title;
                            const displaySub = isVipItem && vipProfile ? `MEMBER #${vipProfile.memberNumber} // UNLOCKED` : item.sub;
                            const displayTag = isVipItem && vipProfile ? "RESTRICTED ACCESS // UNLOCKED" : item.tag;
                            const isSelected = activeIndex === index;

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleExhibitClick(item)}
                                    className={`snap-center shrink-0 w-[84vw] max-w-[380px] sm:max-w-[420px] h-[68vh] sm:h-[72vh] rounded-[32px] overflow-hidden relative cursor-pointer group shadow-[0_20px_60px_rgba(0,0,0,0.95)] border-2 transition-all duration-300 flex flex-col justify-between ${
                                        isVipItem 
                                            ? 'border-[#E7FF00] shadow-[0_0_40px_rgba(231,255,0,0.35)]' 
                                            : isOctober
                                            ? 'border-[#FFD700] shadow-[0_0_35px_rgba(255,215,0,0.35)]'
                                            : isSelected
                                            ? 'border-[#C8A96E]'
                                            : 'border-white/20 group-hover:border-[#E7FF00]'
                                    }`}
                                >
                                    {/* Edge-to-Edge Photographic Image Fill */}
                                    <div className="absolute inset-0 bg-black">
                                        <img 
                                            src={isVipItem && vipProfile?.avatarUrl ? vipProfile.avatarUrl : item.img} 
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                                            onError={(e) => {
                                                if (isVipItem) e.target.src = item.img;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
                                    </div>

                                    {/* Top Pill Badge */}
                                    <div className="relative z-10 p-5 flex items-center justify-between">
                                        <span className={`px-3.5 py-1 rounded-full backdrop-blur-md border text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase shadow-lg ${
                                            isOctober 
                                                ? 'bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700]' 
                                                : 'bg-black/80 border-white/20 text-[#E7FF00]'
                                        }`}>
                                            {item.badge}
                                        </span>
                                        {isVipItem && (
                                            <div className="w-8 h-8 rounded-full bg-[#E7FF00] text-black flex items-center justify-center shadow-[0_0_15px_#E7FF00]">
                                                <Crown className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Frosted Glass Action Info Panel (Very simple, minimal text) */}
                                    <div className="relative z-10 p-6 bg-black/75 backdrop-blur-xl border-t border-white/15 flex flex-col gap-1.5">
                                        <span className="font-mono text-[9px] sm:text-[10px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                            {displayTag}
                                        </span>
                                        <h3 className="font-sans text-xl sm:text-2xl font-black text-white group-hover:text-[#E7FF00] transition-colors leading-tight">
                                            {displayTitle}
                                        </h3>
                                        <p className="font-sans text-xs text-neutral-300 line-clamp-2 mt-0.5 leading-relaxed">
                                            {displaySub}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/10 text-white font-mono text-xs font-black tracking-wider uppercase text-[#E7FF00] group-hover:translate-x-1 transition-transform">
                                            <span>{isOctober ? "VIEW DETAILS" : "ENTER EXPERIENCE"}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* 3. Bottom Minimal Orbit Indicator (● ○ ○ ○ ○) */}
                    <div className="flex items-center gap-3 pt-3">
                        {MASTER_EXHIBITS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={`transition-all duration-300 rounded-full cursor-pointer ${
                                    activeIndex === idx 
                                        ? 'w-8 h-2 bg-[#E7FF00] shadow-[0_0_12px_#E7FF00]' 
                                        : 'w-2 h-2 bg-white/30 hover:bg-white/70'
                                }`}
                            />
                        ))}
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

                <BrandCiBiModal
                    isOpen={isCiBiModalOpen}
                    onClose={() => setIsCiBiModalOpen(false)}
                />

                <OctoberPartyModal
                    isOpen={isOctoberPartyOpen}
                    onClose={() => setIsOctoberPartyOpen(false)}
                />
            </motion.div>
        </AnimatePresence>
    );
}
