import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Compass, Music, MapPin, Eye, Radio, Play } from 'lucide-react';
import { CoutureLookbookModal } from './CoutureLookbookModal';

const MUSEUM_ORBS = [
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

export function AtelierMuseumHub({ isOpen, onClose, onReplayWalk }) {
    const [selectedOrb, setSelectedOrb] = useState(null);
    const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);

    if (!isOpen) return null;

    const handleOrbClick = (orb) => {
        if (orb.id === 'lookbook') {
            setIsLookbookModalOpen(true);
        } else if (orb.id === 'midnight_walk') {
            onReplayWalk();
        } else {
            setSelectedOrb(orb);
        }
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
                {/* 1. Top Google Project Genie-Style Navigation Bar */}
                <header className="px-5 sm:px-10 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/60 backdrop-blur-md z-20">
                    <div className="flex items-center gap-3">
                        <h1 className="font-sans font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                            <span>JUST SEAN FLOWS</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono text-[9px] font-bold tracking-widest uppercase border border-white/15">
                                ATELIER MUSEUM
                            </span>
                        </h1>
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#E7FF00]/15 text-[#E7FF00] font-mono text-[10px] font-black tracking-widest uppercase">
                            EXPERIMENT 2026
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onReplayWalk}
                            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>WALK AGAIN</span>
                        </button>
                    </div>
                </header>

                {/* 2. Main 3D Crystal Orb Portal Grid (Scrollable) */}
                <main className="flex-1 overflow-y-auto p-6 sm:p-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8 text-center sm:text-left">
                            <span className="font-mono text-xs font-black text-[#E7FF00] tracking-[0.3em] uppercase block mb-1">
                                SELECT AN EXPEDITION ORB
                            </span>
                            <h2 className="font-sans text-2xl sm:text-4xl font-black tracking-tight text-white">
                                The Frankfurt Atelier Archive
                            </h2>
                        </div>

                        {/* Responsive Spherical Orbs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
                            {MUSEUM_ORBS.map((orb) => (
                                <motion.div
                                    key={orb.id}
                                    whileHover={{ scale: 1.05, y: -6 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleOrbClick(orb)}
                                    className="group relative flex flex-col items-center cursor-pointer"
                                >
                                    {/* 3D Glass Crystal Orb Body with Lens Refraction */}
                                    <div className="relative w-36 sm:w-48 aspect-square rounded-full overflow-hidden border-2 border-white/20 group-hover:border-[#E7FF00] transition-all shadow-[0_0_35px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_40px_rgba(231,255,0,0.4)]">
                                        {/* Wireframe Creation Globe vs Photo Orb */}
                                        {orb.isWireframe ? (
                                            <div className="w-full h-full bg-black flex flex-col items-center justify-center p-3 relative">
                                                {/* Animated Wireframe Grid Lines */}
                                                <div 
                                                    className="absolute inset-0 opacity-40 animate-pulse"
                                                    style={{
                                                        backgroundImage: `radial-gradient(circle, #E7FF00 1px, transparent 1px)`,
                                                        backgroundSize: '12px 12px'
                                                    }}
                                                />
                                                <Compass className="w-8 h-8 text-[#E7FF00] mb-1 animate-spin" style={{ animationDuration: '15s' }} />
                                                <span className="font-sans text-xs sm:text-sm font-black text-white text-center">
                                                    직접 만들기
                                                </span>
                                                <span className="font-mono text-[8px] text-[#E7FF00] tracking-widest mt-0.5 uppercase">
                                                    CREATE WORLD
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={orb.img}
                                                    alt={orb.title}
                                                    className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                                                />
                                                {/* Fisheye Spherical Convex Lens Gradient Mask */}
                                                <div 
                                                    className="absolute inset-0 pointer-events-none"
                                                    style={{
                                                        background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.95) 100%)',
                                                        mixBlendMode: 'overlay'
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Specular Curved Glint (3D Glass Reflection) */}
                                        <div className="absolute top-2 left-3 w-12 h-6 rounded-full bg-gradient-to-b from-white/60 to-transparent transform -rotate-45 pointer-events-none blur-[1px]" />
                                    </div>

                                    {/* Orb Title & Info Plate */}
                                    <div className="mt-3 text-center max-w-[170px]">
                                        <span className="font-mono text-[9px] font-bold text-[#E7FF00] tracking-widest uppercase block drop-shadow-[0_0_6px_rgba(231,255,0,0.6)]">
                                            {orb.badge}
                                        </span>
                                        <h3 className="font-sans text-xs sm:text-sm font-black text-white tracking-tight leading-snug group-hover:text-[#E7FF00] transition-colors mt-0.5">
                                            {orb.title}
                                        </h3>
                                        <p className="font-sans text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                                            {orb.sub}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* 3. Lookbook Dedicated Modal */}
                <CoutureLookbookModal 
                    isOpen={isLookbookModalOpen}
                    onClose={() => setIsLookbookModalOpen(false)}
                />

                {/* Generic World Modal for other Orbs */}
                {selectedOrb && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                            onClick={() => setSelectedOrb(null)}
                        >
                            <div 
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-lg rounded-3xl bg-[#0F0C09] border border-white/20 p-6 text-white text-center shadow-2xl"
                            >
                                <button
                                    onClick={() => setSelectedOrb(null)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#E7FF00] shadow-[0_0_30px_rgba(231,255,0,0.4)] my-3">
                                    <img src={selectedOrb.img} alt="" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-mono text-[10px] font-black text-[#E7FF00] tracking-widest uppercase">
                                    {selectedOrb.tag}
                                </span>
                                <h3 className="font-sans text-xl font-black text-white mt-1">
                                    {selectedOrb.title}
                                </h3>
                                <p className="font-sans text-xs text-neutral-300 mt-2 leading-relaxed">
                                    {selectedOrb.sub}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
