import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, Filter, Eye } from 'lucide-react';

const LOOKBOOK_ITEMS = [
    { id: 1, title: "85mm Portrait & Favicon Pendant", cat: "PEOPLE", src: "/assets/lookbook/lookbook_01_portrait.jpg", desc: "18K Champagne Gold Treble Clef & Wine Glass pendant over high-neck lace blouse." },
    { id: 2, title: "Stride & Leather Flap Bag", cat: "PEOPLE", src: "/assets/lookbook/lookbook_02_stride.jpg", desc: "In-motion runway silhouette carrying the structured JSF box leather shoulder bag." },
    { id: 3, title: "Seated Elegance & Top-Handle Bag", cat: "PEOPLE", src: "/assets/lookbook/lookbook_03_seated.jpg", desc: "Relaxed tailored posture on minimalist stool with bag resting on lap." },
    { id: 4, title: "Profile & Clef Signet Ring", cat: "PEOPLE", src: "/assets/lookbook/lookbook_04_sideprofile.jpg", desc: "Sculpted 18K gold signet ring and velvet lapel seam details." },
    { id: 5, title: "Editorial Pose & Clef Belt Buckle", cat: "PEOPLE", src: "/assets/lookbook/lookbook_05_editorial.jpg", desc: "Hands-in-pockets confident fashion stance with custom gold buckle." },
    { id: 6, title: "JSF Box Calfskin Shoulder Bag", cat: "BAGS", src: "/assets/lookbook/lookbook_06_bag_hero.jpg", desc: "Structured leather & velvet flap bag with sculpted 18K gold Clef lock clasp." },
    { id: 7, title: "In-Hand Gold Chain Strap Detail", cat: "BAGS", src: "/assets/lookbook/lookbook_07_bag_hand.jpg", desc: "Manicured hand holding the curb chain strap against black velvet trousers." },
    { id: 8, title: "18K Gold Clef Pendant Macro", cat: "ACCESSORIES", src: "/assets/lookbook/lookbook_08_necklace.jpg", desc: "Ultra-close macro view of the solid gold musical clef & wine stem pendant." },
    { id: 9, title: "Gold Clef Ring & Curb Bracelet", cat: "ACCESSORIES", src: "/assets/lookbook/lookbook_09_ring_bracelet.jpg", desc: "Matching 18K solid gold signet ring and triple curb chain bracelet." },
    { id: 10, title: "Bordeaux Silk Monogram Scarf", cat: "LIFESTYLE", src: "/assets/lookbook/lookbook_10_scarf.jpg", desc: "Hermès-style silk twill scarf with allover geometric favicon monogram print." },
    { id: 11, title: "Bespoke Suit Antique Gold Buttons", cat: "ACCESSORIES", src: "/assets/lookbook/lookbook_11_buttons.jpg", desc: "Custom double-breasted velvet jacket shank buttons engraved with JSF seal." },
    { id: 12, title: "Sculptural Gold Stem Stiletto Heels", cat: "LIFESTYLE", src: "/assets/lookbook/lookbook_12_stiletto.jpg", desc: "Black velvet pointed pumps with custom treble clef S-curve heel stems." },
    { id: 13, title: "Hand-Blown Crystal Wine Tableware", cat: "LIFESTYLE", src: "/assets/lookbook/lookbook_13_wineglass.jpg", desc: "Artisanal Bordeaux wine glass with crystal clef stem by Steinway piano." },
    { id: 14, title: "Grained Leather Atelier Journal", cat: "LIFESTYLE", src: "/assets/lookbook/lookbook_14_journal.jpg", desc: "Black calfskin notebook with champagne gold foil embossed favicon emblem." }
];

export function CoutureLookbookModal({ isOpen, onClose }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [selectedCat, setSelectedCat] = useState('ALL');

    if (!isOpen) return null;

    const filteredItems = selectedCat === 'ALL' 
        ? LOOKBOOK_ITEMS 
        : LOOKBOOK_ITEMS.filter(item => item.cat === selectedCat);

    const currentItem = filteredItems[activeIdx] || filteredItems[0] || LOOKBOOK_ITEMS[0];

    const handleNext = () => {
        setActiveIdx((prev) => (prev + 1) % filteredItems.length);
    };

    const handlePrev = () => {
        setActiveIdx((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6 select-none overflow-hidden"
                onClick={onClose}
            >
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl h-[92vh] sm:h-[88vh] rounded-3xl bg-[#0B0907] border border-white/15 flex flex-col overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)]"
                >
                    {/* Top Header Bar */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-[#E7FF00]/15 text-[#E7FF00]">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    EXHIBIT 01 // COUTURE & ARTIFACTS
                                </span>
                                <h2 className="font-sans text-sm sm:text-base font-black text-white tracking-wide">
                                    JSF Luxury Signature Lookbook
                                </h2>
                            </div>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="hidden sm:flex items-center gap-1.5">
                            {['ALL', 'PEOPLE', 'BAGS', 'ACCESSORIES', 'LIFESTYLE'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setSelectedCat(cat); setActiveIdx(0); }}
                                    className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                                        selectedCat === cat 
                                            ? 'bg-[#E7FF00] text-black shadow-[0_0_12px_rgba(231,255,0,0.6)]' 
                                            : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Showcase Stage */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center p-3 sm:p-6 gap-4 sm:gap-8 overflow-hidden">
                        {/* Image Viewer with Navigation */}
                        <div className="relative h-full max-h-[62vh] sm:max-h-full aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/60 shrink-0">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentItem.src}
                                    src={currentItem.src}
                                    alt={currentItem.title}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.25 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Left/Right Arrow Overlays */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/20 hover:border-white flex items-center justify-center text-white transition-all cursor-pointer hover:scale-110"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/20 hover:border-white flex items-center justify-center text-white transition-all cursor-pointer hover:scale-110"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Info & Story Details */}
                        <div className="flex-1 flex flex-col justify-center max-w-sm px-2 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#E7FF00]/15 text-[#E7FF00] font-mono text-[9px] font-bold tracking-widest uppercase">
                                    {currentItem.cat}
                                </span>
                                <span className="font-mono text-xs text-neutral-400">
                                    {activeIdx + 1} / {filteredItems.length}
                                </span>
                            </div>

                            <h3 className="font-sans text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                                {currentItem.title}
                            </h3>

                            <p className="font-sans text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed my-3">
                                {currentItem.desc}
                            </p>

                            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-neutral-400 space-y-1">
                                <div className="flex justify-between">
                                    <span>HARDWARE</span>
                                    <span className="text-white">18K Champagne Gold</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>TEXTILE</span>
                                    <span className="text-white">Bespoke Silk & Velvet</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Thumbnail Strip */}
                    <div className="p-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
                        {filteredItems.map((item, idx) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveIdx(idx)}
                                className={`relative h-12 aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                                    idx === activeIdx ? 'border-[#E7FF00] scale-105 shadow-[0_0_10px_#E7FF00]' : 'border-white/15 opacity-50 hover:opacity-100'
                                }`}
                            >
                                <img src={item.src} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
