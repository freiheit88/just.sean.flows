import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    LucideSparkles, LucideVolume2, LucideVolumeX, LucideSliders,
    LucideCompass, LucideInstagram, LucideArrowDown, LucideMaximize2,
    LucidePlay, LucidePause, LucideCheckCircle, LucideGlobe
} from 'lucide-react';

const logoCollection = [
    { id: "01", title: "JSF Imperial Monogram", category: "Haute Couture", img: "/assets/logos/logo_clean_01_ysl_monogram_1786398697349.jpg" },
    { id: "02", title: "Celine Gold Dot Serif", category: "Haute Couture", img: "/assets/logos/logo_clean_02_celine_serif_1786398708890.jpg" },
    { id: "03", title: "Gentle Monster One-Line", category: "Haute Couture", img: "/assets/logos/logo_clean_03_gentle_monster_line_1786398719536.jpg" },
    { id: "04", title: "Balenciaga Monolith", category: "Haute Couture", img: "/assets/logos/logo_clean_04_balenciaga_monolith_1786398730432.jpg" },
    { id: "11", title: "Clean Sine Wave Monogram", category: "Sound Wave", img: "/assets/logos/logo_clean_11_sine_wave_1786398798443.jpg" },
    { id: "14", title: "Spatial Audio Orbit Ring", category: "Sound Wave", img: "/assets/logos/logo_clean_14_orbit_ring_1786398829656.jpg" },
    { id: "21", title: "Joseon Royal Gold Stamp", category: "Korean Heritage", img: "/assets/logos/logo_clean_21_kr_seal_square_1786398911531.jpg" },
    { id: "23", title: "Hanok Eaves Horizon Line", category: "Korean Heritage", img: "/assets/logos/logo_clean_23_hanok_eaves_1786398936685.jpg" },
    { id: "31", title: "Chopin Piano Harp Line", category: "Classical", img: "/assets/logos/logo_romantic_chopin_nocturne_1786391164885.jpg" },
    { id: "34", title: "Stradivarius Violin F-Hole", category: "Classical", img: "/assets/logos/logo_romantic_violin_fhole_1786391270569.jpg" }
];

export default function ScrollytellingHome() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const [userName, setUserName] = useState('');
    const [nameSubmitted, setNameSubmitted] = useState(false);
    const [isPlayingBgm, setIsPlayingBgm] = useState(false);
    const [selectedLogoModal, setSelectedLogoModal] = useState(null);

    const bgmRef = useRef(null);

    // Scroll Transformations
    const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.4]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroRotate = useTransform(scrollYProgress, [0, 0.25], [0, 15]);

    const gateScale = useTransform(scrollYProgress, [0.2, 0.45], [0.8, 1.15]);
    const gateOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.4, 0.45], [0, 1, 1, 0]);

    const galleryY = useTransform(scrollYProgress, [0.4, 0.75], [100, -50]);
    const galleryOpacity = useTransform(scrollYProgress, [0.42, 0.48, 0.72, 0.78], [0, 1, 1, 0]);

    const audioOpacity = useTransform(scrollYProgress, [0.75, 0.8, 0.95, 1], [0, 1, 1, 1]);

    const toggleBgm = () => {
        if (!bgmRef.current) return;
        if (isPlayingBgm) {
            bgmRef.current.pause();
            setIsPlayingBgm(false);
        } else {
            bgmRef.current.play();
            setIsPlayingBgm(true);
        }
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (userName.trim()) {
            setNameSubmitted(true);
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(`Welcome to the manor, ${userName}`);
                utterance.pitch = 0.5;
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        }
    };

    return (
        <div ref={containerRef} className="relative w-full bg-[#08090d] text-[#FDFCF0] font-serif overflow-x-hidden selection:bg-[#C5A059] selection:text-black">

            {/* Audio Source */}
            <audio ref={bgmRef} src="/assets/manual_upload/A Twelve-minute Alibi_classic/A_Twelve_minute_Alibi_Maestro_Conducted_Master.wav" loop />

            {/* Top Fixed Scrollytelling HUD */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#08090d]/80 backdrop-blur-xl border-b border-[#C5A059]/20">
                <div className="flex items-center gap-3">
                    <span className="font-sans text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase">JUST.SEAN.FLOWS</span>
                    <span className="text-[10px] font-sans px-2 py-0.5 rounded-full border border-[#C5A059]/30 text-[#C5A059]">SCROLL CINEMA</span>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleBgm} className="p-2 rounded-full border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all">
                        {isPlayingBgm ? <LucideVolume2 size={16} /> : <LucideVolumeX size={16} />}
                    </button>
                    <a href="/logos.html" className="text-[10px] font-sans font-bold tracking-widest text-[#FDFCF0] hover:text-[#C5A059] transition-colors border border-white/10 px-3 py-1.5 rounded-full">
                        40 LOGOS
                    </a>
                    <a href="/mixer.html" className="text-[10px] font-sans font-bold tracking-widest text-[#C5A059] border border-[#C5A059]/40 px-3 py-1.5 rounded-full hover:bg-[#C5A059] hover:text-black transition-all">
                        STEM STUDIO
                    </a>
                </div>

                {/* Top Scroll Progress Bar */}
                <motion.div style={{ scaleX: scrollYProgress }} className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] origin-left shadow-[0_0_10px_#C5A059]" />
            </header>

            {/* Scroll Down Indicator */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none opacity-70">
                <span className="font-sans text-[9px] tracking-[0.3em] text-[#C5A059] uppercase">SCROLL TO EXPERIENCE</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <LucideArrowDown size={14} className="text-[#C5A059]" />
                </motion.div>
            </div>

            {/* ACT I: The Signature Sound Awakening (0% ~ 20%) */}
            <section className="relative h-[120vh] flex flex-col items-center justify-center text-center px-4 sticky top-0">
                <motion.div style={{ scale: heroScale, opacity: heroOpacity, rotate: heroRotate }} className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059] font-sans text-[10px] tracking-[0.3em] uppercase mb-6 backdrop-blur-md">
                        <LucideSparkles size={12} />
                        <span>ACT I — THE SIGNATURE AWAKENING</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-light tracking-[0.25em] uppercase text-[#FDFCF0] drop-shadow-[0_0_40px_rgba(197,160,89,0.4)]">
                        JUST<span className="text-[#C5A059] font-serif italic">.</span>SEAN<span className="text-[#C5A059] font-serif italic">.</span>FLOWS
                    </h1>

                    <p className="font-sans text-xs md:text-sm tracking-[0.3em] text-white/60 max-w-xl mt-6 uppercase leading-relaxed">
                        A MULTIVERSAL SOUND & HAUTE COUTURE LOGO EXPERIENCE
                    </p>
                </motion.div>
            </section>

            {/* ACT II: The Conductor's Gate (20% ~ 45%) */}
            <section className="relative h-[150vh] flex items-center justify-center px-4">
                <motion.div style={{ scale: gateScale, opacity: gateOpacity }} className="sticky top-1/4 max-w-3xl w-full bg-[#0f121a]/85 border border-[#C5A059]/40 rounded-3xl p-8 md:p-12 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/assets/club_gate_1st_person.jpg')] bg-cover bg-center opacity-25 mix-blend-luminosity" />

                    <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        <span className="font-sans text-[10px] tracking-[0.3em] text-[#C5A059] uppercase border border-[#C5A059]/30 px-3 py-1 rounded-full bg-[#08090d]/60">
                            ACT II — THE GATEKEEPER
                        </span>

                        <div className="bg-[#08090d]/80 border border-[#C5A059]/30 px-6 py-3 rounded-2xl">
                            <span className="font-sans text-xs font-bold text-[#C5A059] tracking-widest uppercase block mb-1">[ GATEKEEPER ]</span>
                            <p className="text-lg md:text-xl italic text-white/90">"IDs out, everyone! Name and ID!!"</p>
                        </div>

                        {!nameSubmitted ? (
                            <form onSubmit={handleNameSubmit} className="w-full max-w-md flex flex-col gap-4 mt-2">
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="ENTER YOUR NAME..."
                                    className="w-full bg-black/60 border border-[#C5A059]/40 rounded-full px-6 py-3.5 text-center font-sans text-xs tracking-widest text-[#FDFCF0] placeholder-white/40 outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                                />
                                <button type="submit" className="w-full bg-[#C5A059] hover:bg-[#d5b069] text-black font-sans text-xs font-bold tracking-widest py-3.5 rounded-full transition-all uppercase shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                                    ENTER THE MANOR
                                </button>
                            </form>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 text-[#C5A059] font-sans text-xs tracking-widest">
                                <LucideCheckCircle size={18} />
                                <span>WELCOME, {userName.toUpperCase()} — GATE CLEARED</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* ACT III: The 40 Masterworks Logo Exhibition (45% ~ 75%) */}
            <section className="relative min-h-[160vh] py-24 px-6 flex flex-col items-center">
                <motion.div style={{ y: galleryY, opacity: galleryOpacity }} className="w-full max-w-6xl flex flex-col items-center">
                    <div className="text-center mb-16">
                        <span className="font-sans text-[10px] tracking-[0.3em] text-[#C5A059] uppercase border border-[#C5A059]/30 px-4 py-1.5 rounded-full bg-[#C5A059]/10 backdrop-blur-md">
                            ACT III — THE 40 MASTERWORKS EXHIBITION
                        </span>
                        <h2 className="text-3xl md:text-5xl font-light tracking-wider text-white mt-4 uppercase">CURATED LOGO CATALOGUE</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                        {logoCollection.map((logo) => (
                            <motion.div
                                key={logo.id}
                                whileHover={{ y: -8, borderColor: '#C5A059' }}
                                onClick={() => setSelectedLogoModal(logo)}
                                className="bg-[#0f121a]/80 border border-[#C5A059]/25 rounded-2xl overflow-hidden cursor-pointer backdrop-blur-md transition-all group"
                            >
                                <div className="aspect-square relative overflow-hidden bg-black">
                                    <img src={logo.img} alt={logo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <span className="absolute top-3 left-3 bg-black/80 border border-[#C5A059]/30 text-[#C5A059] font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full">
                                        NO. {logo.id}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col gap-1">
                                    <span className="font-sans text-[8px] tracking-widest text-[#C5A059] uppercase">{logo.category}</span>
                                    <h3 className="text-lg text-white font-normal">{logo.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ACT IV & V: Orchestral Symphony & Corporate Contact (75% ~ 100%) */}
            <motion.section style={{ opacity: audioOpacity }} className="relative py-28 px-6 bg-gradient-to-b from-[#08090d] via-[#0f121a] to-[#040507] border-t border-[#C5A059]/20 flex flex-col items-center text-center">
                <div className="max-w-4xl w-full flex flex-col items-center gap-10">
                    <span className="font-sans text-[10px] tracking-[0.3em] text-[#C5A059] uppercase border border-[#C5A059]/30 px-4 py-1.5 rounded-full bg-[#C5A059]/10">
                        ACT IV & V — ORCHESTRAL SYMPHONY & CORPORATE MONOLITH
                    </span>

                    <h2 className="text-4xl md:text-6xl font-light tracking-widest text-[#FDFCF0] uppercase">
                        JUST SEAN FLOWS INC.
                    </h2>

                    <p className="font-sans text-xs md:text-sm tracking-widest text-white/60 max-w-lg leading-relaxed uppercase">
                        A MINOR PURE ORCHESTRAL SYMPHONY & HIGH-FASHION CORPORATE IDENTITY
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                        <a href="/mixer.html" className="flex items-center gap-2 bg-[#C5A059] text-black font-sans text-xs font-bold tracking-widest px-8 py-4 rounded-full hover:bg-white transition-all shadow-[0_0_30px_rgba(197,160,89,0.5)]">
                            <LucideSliders size={16} />
                            <span>OPEN 5-STEM MIXER</span>
                        </a>
                        <a href="https://instagram.com/just.sean.flows" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-[#C5A059]/40 text-[#C5A059] font-sans text-xs font-bold tracking-widest px-8 py-4 rounded-full hover:bg-[#C5A059]/20 transition-all">
                            <LucideInstagram size={16} />
                            <span>@JUST.SEAN.FLOWS</span>
                        </a>
                    </div>
                </div>

                <footer className="mt-28 font-sans text-[10px] tracking-[0.4em] text-white/30 uppercase">
                    JUST SEAN FLOWS © 2026. SCROLL INTERACTIVE BRANDING CINEMA.
                </footer>
            </motion.section>

            {/* Modal for Artwork Details */}
            <AnimatePresence>
                {selectedLogoModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLogoModal(null)} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
                        <div onClick={(e) => e.stopPropagation()} className="bg-[#0f121a] border border-[#C5A059] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
                            <img src={selectedLogoModal.img} alt={selectedLogoModal.title} className="w-full aspect-square object-cover" />
                            <div className="p-6 flex flex-col gap-2">
                                <span className="font-sans text-[10px] tracking-widest text-[#C5A059] uppercase">NO. {selectedLogoModal.id} — {selectedLogoModal.category}</span>
                                <h3 className="text-2xl text-white font-normal">{selectedLogoModal.title}</h3>
                                <button onClick={() => setSelectedLogoModal(null)} className="mt-4 bg-[#C5A059] text-black font-sans text-xs font-bold tracking-widest py-3 rounded-full uppercase hover:bg-white transition-all">
                                    CLOSE ARTWORK
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
