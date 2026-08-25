import { InteractiveSheetMusicModal } from '../modals/InteractiveSheetMusicModal';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Compass, Music, MapPin, Eye, Crown, ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';
import { TitleMuseumModal } from '../modals/TitleMuseumModal';
import { ATELIER_TITLES, unlockTitle, getAcquiredTitles } from '../../constants/titles';
import { BrandCiBiModal } from '../modals/BrandCiBiModal';
import { ModularSoundLabModal } from './ModularSoundLabModal';
import { SpatialSalonViewerModal } from './SpatialSalonViewerModal';
import { OctoberPartyModal } from '../modals/OctoberPartyModal';
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
    const [isSheetMusicOpen, setIsSheetMusicOpen] = useState(false);
    const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
    const [acquiredTitles, setAcquiredTitles] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollTrackRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setAcquiredTitles(getAcquiredTitles());
        }
    }, [isOpen, isTitleModalOpen]);

    if (!isOpen) return null;

    const acquiredIds = new Set(acquiredTitles.map(a => a.id));

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
            unlockTitle('steinway_virtuoso');
            setIsSpatialSalonOpen(true);
        } else if (exhibit.id === 'brand_cibi') {
            unlockTitle('founding_member_2026');
            setIsCiBiModalOpen(true);
        } else if (exhibit.id === 'october_party') {
            unlockTitle('october_gala_vip');
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

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9990] bg-[#0A0708] flex flex-col justify-between overflow-hidden select-none"
            >
                {/* ========================================================================= */}
                {/* 1. HAUTE COUTURE EDITORIAL TOP HEADER WITH UNIFIED SCROLLABLE ACTION TRACK */}
                {/* ========================================================================= */}
                <header className="relative z-20 w-full px-3 sm:px-6 py-2.5 flex items-center border-b border-white/10 bg-black/75 backdrop-blur-xl shrink-0 gap-2 sm:gap-3 overflow-hidden">
                    {/* Left Fixed Brand Name Anchor */}
                    <div className="flex items-center gap-2 shrink-0 pr-2.5 sm:pr-3 border-r border-[#C8A96E]/40">
                        <div className="w-2 h-2 rounded-full bg-[#E7FF00] shadow-[0_0_8px_#E7FF00] animate-pulse" />
                        <span className="font-mono text-xs sm:text-sm font-black tracking-[0.20em] text-[#F7EBE1] uppercase whitespace-nowrap">
                            JUST SEAN FLOWS
                        </span>
                    </div>

                    {/* Unified Horizontal Scrollable Action Track */}
                    <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-3 py-1 px-1">
                        {/* 1. Sheet Music Studio Button */}
                        <button
                            onClick={() => setIsSheetMusicOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C8A96E]/60 bg-[#C8A96E]/15 hover:bg-[#C8A96E]/30 text-[#F7EBE1] font-mono text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(200,169,110,0.35)] shrink-0"
                        >
                            <span>🎼 악보 스튜디오</span>
                        </button>

                        {/* 2. Title Museum Button */}
                        <button
                            onClick={() => setIsTitleModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7FF00]/60 bg-[#E7FF00]/15 hover:bg-[#E7FF00]/30 text-[#E7FF00] font-mono text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(231,255,0,0.35)] shrink-0"
                        >
                            <span>🏆 칭호</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-[#E7FF00] text-black font-black text-[9px]">
                                {acquiredTitles.length}/{ATELIER_TITLES.length}
                            </span>
                        </button>

                        {/* 3. Magazine Editorial Teaser */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#C8A96E]/40 shrink-0">
                            <Sparkles className="w-3 h-3 text-[#E7FF00] animate-spin" />
                            <span className="font-serif italic text-xs sm:text-sm font-bold text-[#E7FF00] tracking-wide whitespace-nowrap">
                                "Music & Velvet Gala Plan"
                            </span>
                            <span className="font-mono text-[8px] text-[#C8A96E] uppercase font-bold tracking-widest pl-1.5 border-l border-white/20 whitespace-nowrap">
                                OCTOBER 2026
                            </span>
                        </div>

                        {/* 4. Interactive Emoticon Title Badges */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            {ATELIER_TITLES.map((title) => {
                                const isEarned = acquiredIds.has(title.id);
                                return (
                                    <motion.button
                                        key={title.id}
                                        whileHover={{ scale: isEarned ? 1.18 : 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        onClick={() => setIsTitleModalOpen(true)}
                                        title={`${title.name} (${isEarned ? '✨ 획득 완료' : '🔒 미획득'})`}
                                        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm transition-all duration-300 cursor-pointer shrink-0 ${
                                            isEarned
                                                ? 'bg-gradient-to-br from-[#2D1B22] to-[#120B0F] border-2 border-[#E7FF00] shadow-[0_0_12px_rgba(231,255,0,0.65)] text-white scale-105'
                                                : 'bg-black/50 border border-white/10 opacity-35 grayscale blur-[0.8px] hover:opacity-80 hover:blur-0'
                                        }`}
                                    >
                                        <span>{title.emoji}</span>
                                        {isEarned && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Close Button */}
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer shrink-0 ml-1"
                        title="Close Museum"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </header>

                {/* ========================================================================= */}
                {/* 2. 5-CARD HORIZONTAL CAROUSEL EXHIBITS */}
                {/* ========================================================================= */}
                <main className="relative flex-1 w-full flex flex-col items-center justify-center overflow-hidden py-2 px-3 sm:px-6">
                    {/* Floating Navigation Arrows */}
                    <button
                        onClick={() => scrollByStep(-1)}
                        className="hidden md:flex absolute left-4 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#E7FF00] text-white hover:text-[#E7FF00] items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-md"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => scrollByStep(1)}
                        className="hidden md:flex absolute right-4 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#E7FF00] text-white hover:text-[#E7FF00] items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-md"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Horizontal Scroll Track */}
                    <div
                        ref={scrollTrackRef}
                        onScroll={(e) => {
                            const track = e.currentTarget;
                            const idx = Math.round(track.scrollLeft / (track.offsetWidth * 0.85));
                            setActiveIndex(idx);
                        }}
                        className="w-full h-[72vh] sm:h-[76vh] flex items-center gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-12 py-2"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {MASTER_EXHIBITS.map((item, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleExhibitClick(item)}
                                    className={`snap-center shrink-0 w-[84vw] max-w-[360px] sm:max-w-[400px] h-full rounded-[28px] sm:rounded-[32px] overflow-hidden border-2 transition-all duration-500 cursor-pointer flex flex-col justify-between p-6 relative group select-none ${
                                        isActive 
                                            ? 'border-[#C8A96E] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(200,169,110,0.35)]' 
                                            : 'border-white/20 opacity-85'
                                    }`}
                                    style={{
                                        backgroundImage: `linear-gradient(to top, rgba(6,4,5,0.95) 0%, rgba(6,4,5,0.4) 50%, rgba(6,4,5,0.7) 100%), url(${item.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {/* Top Card Badges */}
                                    <div className="w-full flex items-center justify-between z-10">
                                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 font-mono text-[9px] font-bold text-[#E7FF00] tracking-widest uppercase">
                                            {item.badge}
                                        </span>
                                        <span className="font-mono text-[9px] text-neutral-400 font-bold">
                                            0{index + 1} / 05
                                        </span>
                                    </div>

                                    {/* Bottom Info & Action Button */}
                                    <div className="w-full flex flex-col z-10">
                                        <span className="font-mono text-[9px] font-bold text-[#C8A96E] tracking-widest uppercase mb-1">
                                            {item.tag}
                                        </span>
                                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-tight group-hover:text-[#E7FF00] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="font-sans text-xs text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed">
                                            {item.sub}
                                        </p>

                                        {/* Action Button */}
                                        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                                            <span className="font-mono text-[10px] font-bold text-white group-hover:text-[#E7FF00] tracking-wider uppercase flex items-center gap-1.5">
                                                <span>EXPLORE EXHIBIT</span>
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#E7FF00] group-hover:text-black text-white flex items-center justify-center transition-all">
                                                <Compass className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Pagination Indicators */}
                    <div className="flex items-center gap-2 mt-2 z-20">
                        {MASTER_EXHIBITS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    activeIndex === idx 
                                        ? 'w-8 bg-[#E7FF00] shadow-[0_0_8px_#E7FF00]' 
                                        : 'w-2 bg-white/25 hover:bg-white/50'
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

                <TitleMuseumModal 
                    isOpen={isTitleModalOpen} 
                    onClose={() => setIsTitleModalOpen(false)} 
                />
                <InteractiveSheetMusicModal 
                    isOpen={isSheetMusicOpen} 
                    onClose={() => setIsSheetMusicOpen(false)} 
                />
            </motion.div>
        </AnimatePresence>
    );
}
