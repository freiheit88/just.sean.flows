import { InteractiveSheetMusicModal } from '../modals/InteractiveSheetMusicModal';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Compass, Music, MapPin, Eye, Crown, ChevronLeft, ChevronRight, X, Lock, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { TitleMuseumModal } from '../modals/TitleMuseumModal';
import { ATELIER_TITLES, unlockTitle, getAcquiredTitles } from '../../constants/titles';
import { BrandCiBiModal } from '../modals/BrandCiBiModal';
import { ModularSoundLabModal } from './ModularSoundLabModal';
import { SpatialSalonViewerModal } from './SpatialSalonViewerModal';
import { OctoberPartyModal } from '../modals/OctoberPartyModal';
import { CoutureLookbookModal } from './CoutureLookbookModal';

// EXACT 5 Master Core Contents (100% English Global Luxury)
const MASTER_EXHIBITS = [
    {
        id: 'vip_vault',
        title: "VIP Member Private Vault",
        sub: "Exclusive 3D Sanctuary & Private Archives for Verified Members",
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
        sub: "1924 Vintage Steinway & 432Hz 1st-Person Spatial Odyssey",
        tag: "EXHIBIT 02 // 3D SPATIAL",
        img: "/assets/walk_story_07_grand_piano_salon.jpg",
        badge: "3D SALON"
    },
    {
        id: 'brand_cibi',
        title: "CI / BI Brand Identity System",
        sub: "18K Wine Emblem, Formal Palette & 432Hz Acoustic Specs",
        tag: "EXHIBIT 03 // BRAND CI/BI",
        img: "/assets/logo/jsf_official_logo.jpg",
        badge: "BRAND CI/BI"
    },
    {
        id: 'october_party',
        title: "October Private Salon Gala",
        sub: "October Private Salon Gala // COMING SOON",
        tag: "OCTOBER 2026 // FRANKFURT",
        img: "/assets/events/october_party_2026.jpg",
        badge: "✦ COMING SOON"
    }
];

const STRINGS_AUDIO_SRC = '/assets/manual_upload/A twelve-alibi_Strings.wav';

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

    // Micro Strings Player States
    const [isStringsPlaying, setIsStringsPlaying] = useState(false);
    const [isStringsMuted, setIsStringsMuted] = useState(false);
    const stringsAudioRef = useRef(null);

    const scrollTrackRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setAcquiredTitles(getAcquiredTitles());
        }
    }, [isOpen, isTitleModalOpen]);

    const toggleStringsPlayback = () => {
        if (!stringsAudioRef.current) return;
        if (isStringsPlaying) {
            stringsAudioRef.current.pause();
            setIsStringsPlaying(false);
        } else {
            stringsAudioRef.current.play().then(() => {
                setIsStringsPlaying(true);
            }).catch(e => console.log('Audio autoplay prevented:', e));
        }
    };

    const toggleStringsMute = (e) => {
        e.stopPropagation();
        if (!stringsAudioRef.current) return;
        const newMuted = !isStringsMuted;
        stringsAudioRef.current.muted = newMuted;
        setIsStringsMuted(newMuted);
    };

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
                {/* Audio Element for Micro Strings Player */}
                <audio 
                    ref={stringsAudioRef} 
                    src={STRINGS_AUDIO_SRC} 
                    loop 
                    preload="auto"
                />

                {/* ========================================================================= */}
                {/* 1. HAUTE COUTURE EDITORIAL TOP HEADER */}
                {/* ========================================================================= */}
                <header className="relative z-20 w-full px-3 sm:px-6 py-2.5 flex items-center border-b border-white/10 bg-black/80 backdrop-blur-xl shrink-0 gap-2 sm:gap-3 overflow-hidden">
                    {/* Left Brand Anchor */}
                    <div className="flex items-center gap-2 shrink-0 pr-2.5 sm:pr-3 border-r border-[#C8A96E]/40">
                        <div className="w-2 h-2 rounded-full bg-[#E7FF00] shadow-[0_0_8px_#E7FF00] animate-pulse" />
                        <span className="font-mono text-xs sm:text-sm font-black tracking-[0.20em] text-[#F7EBE1] uppercase whitespace-nowrap">
                            JUST SEAN FLOWS
                        </span>
                    </div>

                    {/* Middle Scrollable Actions & Micro Player */}
                    <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-3 py-1 px-1">
                        {/* 1. Ultra-Compact Emoji-Only Score Studio Button */}
                        <button
                            onClick={() => setIsSheetMusicOpen(true)}
                            className="w-8 h-8 rounded-full border border-[#C8A96E]/60 bg-[#C8A96E]/15 hover:bg-[#C8A96E]/30 text-base flex items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(200,169,110,0.35)] shrink-0 hover:scale-105"
                            title="Interactive Sheet Music Studio"
                        >
                            <span>🎼</span>
                        </button>

                        {/* 2. Title Museum Button */}
                        <button
                            onClick={() => setIsTitleModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7FF00]/60 bg-[#E7FF00]/15 hover:bg-[#E7FF00]/30 text-[#E7FF00] font-mono text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(231,255,0,0.35)] shrink-0 hover:scale-105"
                        >
                            <span>🏆 TITLES</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-[#E7FF00] text-black font-black text-[9px]">
                                {acquiredTitles.length}/{ATELIER_TITLES.length}
                            </span>
                        </button>

                        {/* 3. Ultra-Compact Strings Micro-Player with Rolling Marquee Ticker */}
                        <div 
                            onClick={toggleStringsPlayback}
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-[#C8A96E]/50 cursor-pointer transition-all shadow-[0_0_15px_rgba(200,169,110,0.2)] shrink-0 group"
                            title={isStringsPlaying ? "Pause Strings Ensemble" : "Play Strings Ensemble"}
                        >
                            {/* Play/Pause Button Icon */}
                            <div className="w-5 h-5 rounded-full bg-[#E7FF00]/20 border border-[#E7FF00]/60 flex items-center justify-center text-[#E7FF00] shrink-0">
                                {isStringsPlaying ? (
                                    <Pause className="w-2.5 h-2.5 fill-[#E7FF00]" />
                                ) : (
                                    <Play className="w-2.5 h-2.5 fill-[#E7FF00] ml-0.5" />
                                )}
                            </div>

                            {/* Rolling Marquee Track Title Ticker */}
                            <div className="w-32 sm:w-44 overflow-hidden relative h-4 flex items-center select-none">
                                <motion.div
                                    animate={isStringsPlaying ? { x: ['100%', '-100%'] } : { x: '0%' }}
                                    transition={isStringsPlaying ? { repeat: Infinity, duration: 9, ease: 'linear' } : { duration: 0 }}
                                    className="font-mono text-[10px] text-[#E7FF00] font-bold tracking-wide whitespace-nowrap flex items-center gap-2"
                                >
                                    <span>🎻 A Twelve-minute Alibi (Strings Ensemble)</span>
                                </motion.div>
                            </div>

                            {/* Volume Mute/Unmute Toggle */}
                            <button
                                onClick={toggleStringsMute}
                                className="text-neutral-400 hover:text-white p-0.5 shrink-0 transition-colors cursor-pointer"
                                title={isStringsMuted ? "Unmute" : "Mute"}
                            >
                                {isStringsMuted ? (
                                    <VolumeX className="w-3 h-3 text-red-400" />
                                ) : (
                                    <Volume2 className="w-3 h-3 text-[#E7FF00]" />
                                )}
                            </button>
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
                        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/65 border border-white/20 hover:border-white text-white items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-2xl backdrop-blur-md"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scrollByStep(1)}
                        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/65 border border-white/20 hover:border-white text-white items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-2xl backdrop-blur-md"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Scrollable Exhibits Track */}
                    <div 
                        ref={scrollTrackRef}
                        className="w-full h-full max-h-[72vh] flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 sm:px-12 py-2"
                    >
                        {MASTER_EXHIBITS.map((exhibit, idx) => (
                            <motion.div
                                key={exhibit.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleExhibitClick(exhibit)}
                                className={`relative h-full aspect-[9/16] sm:aspect-[10/16] max-h-[68vh] rounded-[28px] overflow-hidden border transition-all duration-500 cursor-pointer snap-center shrink-0 flex flex-col justify-between p-5 sm:p-6 group ${
                                    exhibit.isVip
                                        ? 'border-[#FFD700]/70 shadow-[0_15px_40px_rgba(255,215,0,0.25)]'
                                        : 'border-white/15 hover:border-[#C8A96E] shadow-2xl'
                                }`}
                            >
                                {/* Background Image with Zoom on Hover */}
                                <div className="absolute inset-0 z-0 overflow-hidden">
                                    <img 
                                        src={exhibit.img} 
                                        alt={exhibit.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-95"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30" />
                                </div>

                                {/* Top Pill Badges */}
                                <div className="relative z-10 flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[#E7FF00] font-mono text-[9px] sm:text-[10px] font-black tracking-widest uppercase">
                                        {exhibit.badge}
                                    </span>
                                    <span className="font-mono text-xs text-neutral-400 font-bold">
                                        0{idx + 1} / 0{MASTER_EXHIBITS.length}
                                    </span>
                                </div>

                                {/* Bottom Info Area */}
                                <div className="relative z-10 flex flex-col text-left">
                                    <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase mb-1">
                                        {exhibit.tag}
                                    </span>
                                    <h3 className="font-sans text-lg sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-[#E7FF00] transition-colors">
                                        {exhibit.title}
                                    </h3>
                                    <p className="font-sans text-xs text-neutral-300 font-medium leading-relaxed my-2 line-clamp-2">
                                        {exhibit.sub}
                                    </p>

                                    {/* Action Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
                                        <span className="font-mono text-[10px] font-bold tracking-wider text-neutral-300 group-hover:text-white uppercase flex items-center gap-1">
                                            EXPLORE EXHIBIT ➔
                                        </span>
                                        <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-[#E7FF00] group-hover:text-black flex items-center justify-center text-xs transition-all">
                                            {exhibit.isVip ? '👑' : '🧭'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Carousel Dots */}
                    <div className="flex items-center gap-1.5 mt-2">
                        {MASTER_EXHIBITS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                    idx === activeIndex 
                                        ? 'w-6 bg-[#E7FF00] shadow-[0_0_8px_#E7FF00]' 
                                        : 'w-1.5 bg-white/20 hover:bg-white/40'
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
                <InteractiveSheetMusicModal 
                    isOpen={isSheetMusicOpen} 
                    onClose={() => setIsSheetMusicOpen(false)} 
                />
                <TitleMuseumModal 
                    isOpen={isTitleModalOpen} 
                    onClose={() => setIsTitleModalOpen(false)} 
                />
                <BrandCiBiModal 
                    isOpen={isCiBiModalOpen} 
                    onClose={() => setIsCiBiModalOpen(false)} 
                />
                <SpatialSalonViewerModal 
                    isOpen={isSpatialSalonOpen} 
                    onClose={() => setIsSpatialSalonOpen(false)} 
                />
                <OctoberPartyModal 
                    isOpen={isOctoberPartyOpen} 
                    onClose={() => setIsOctoberPartyOpen(false)} 
                />
            </motion.div>
        </AnimatePresence>
    );
}
