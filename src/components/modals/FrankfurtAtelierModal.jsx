import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Music, Sparkles, Radio, Activity, Compass, Cpu } from 'lucide-react';

export function FrankfurtAtelierModal({ isOpen, onClose, tiltX = 0, tiltY = 0, tilt = { x: 0, y: 0 } }) {
    const audioCtxRef = useRef(null);

    // Synthesize Hologram Projector Laser Audio Chirp on Open/Close
    useEffect(() => {
        if (!isOpen) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                audioCtxRef.current = ctx;

                // 1. High-tech dual-oscillator hologram projector sweep (580Hz -> 1160Hz)
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();

                osc1.type = 'sine';
                osc2.type = 'triangle';

                const now = ctx.currentTime;
                osc1.frequency.setValueAtTime(540, now);
                osc1.frequency.exponentialRampToValueAtTime(1180, now + 0.22);

                osc2.frequency.setValueAtTime(270, now);
                osc2.frequency.exponentialRampToValueAtTime(590, now + 0.22);

                gain.gain.setValueAtTime(0.01, now);
                gain.gain.linearRampToValueAtTime(0.09, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.36);
                osc2.stop(now + 0.36);
            }
        } catch (e) {
            console.warn("Hologram audio synth error:", e);
        }

        return () => {
            if (audioCtxRef.current) {
                try { audioCtxRef.current.close(); } catch (e) {}
            }
        };
    }, [isOpen]);

    const handleHoloClose = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(980, now);
                osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.2);
            }
        } catch (e) {}
        onClose();
    };

    if (!isOpen) return null;

    // Dynamic 3D Parallax Calculation based on Mouse & Gyro
    const rotX = -tiltY * 0.45;
    const rotY = tiltX * 0.45;
    const transX = tiltX * 0.35;
    const transY = tiltY * 0.35;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg select-none overflow-hidden"
                style={{ perspective: 1200 }}
                onClick={handleHoloClose}
            >
                {/* 1. Spatial Cybernetic Background Grid & Lens Vignette */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(0, 255, 136, 0.12) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(0, 255, 136, 0.12) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                    }}
                />

                {/* 2. Concentric Rotating J.A.R.V.I.S. Radar Dials (Z: -40px) */}
                <div 
                    className="absolute pointer-events-none w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] flex items-center justify-center"
                    style={{
                        transform: `translate3d(${transX * 0.5}px, ${transY * 0.5}px, -40px) rotateX(${rotX * 0.6}deg) rotateY(${rotY * 0.6}deg)`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Clockwise Outer Compass Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-dashed border-[#00FF88]/20"
                    />

                    {/* Counter-Clockwise Segmented Ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                        className="absolute inset-6 rounded-full border border-[#00E5FF]/25 border-t-transparent border-b-transparent"
                    />

                    {/* Outer Coordinate Ticks */}
                    <div className="absolute inset-0 flex items-center justify-between text-[8px] font-mono text-[#00FF88]/40 px-2">
                        <span>090° EAST</span>
                        <span>270° WEST</span>
                    </div>
                </div>

                {/* 3. Main 3D Spatial Holographic HUD Container */}
                <motion.div
                    initial={{ scale: 0.8, rotateX: 25, y: 60, opacity: 0 }}
                    animate={{ scale: 1, rotateX: rotX, rotateY: rotY, x: transX, y: transY, opacity: 1 }}
                    exit={{ scale: 0.8, rotateX: -20, y: 40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg rounded-3xl p-5 sm:p-7 text-white"
                    style={{
                        transformStyle: 'preserve-3d',
                        background: 'linear-gradient(135deg, rgba(3, 20, 14, 0.88) 0%, rgba(5, 12, 10, 0.94) 100%)',
                        border: '1.5px solid rgba(0, 255, 136, 0.5)',
                        boxShadow: '0 0 50px rgba(0, 255, 136, 0.25), 0 0 100px rgba(0, 229, 255, 0.15), inset 0 0 35px rgba(0, 255, 136, 0.12)'
                    }}
                >
                    {/* Futuristic Cyber Laser Scanline Sweep */}
                    <motion.div
                        animate={{ y: ['-120%', '240%'] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                        className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#00FF88]/15 to-transparent pointer-events-none rounded-3xl"
                    />

                    {/* Sci-Fi Corner Brackets [ ┌ ┐ └ ┘ ] */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00FF88] rounded-tl-sm pointer-events-none" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00FF88] rounded-tr-sm pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00FF88] rounded-bl-sm pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00FF88] rounded-br-sm pointer-events-none" />

                    {/* Close Hologram Button */}
                    <button
                        onClick={handleHoloClose}
                        className="absolute top-4 right-4 z-40 w-8 h-8 rounded-full bg-black/60 border border-[#00FF88]/40 hover:border-[#00FF88] flex items-center justify-center text-[#00FF88] hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.3)] hover:scale-110"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* LAYER 1: Header Telemetry & Status Bar (translateZ: 35px) */}
                    <div 
                        className="flex flex-col gap-1.5 pb-3 border-b border-[#00FF88]/25"
                        style={{ transform: 'translateZ(35px)' }}
                    >
                        {/* Live Telemetry Status Ticker */}
                        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-widest text-[#00FF88]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88] animate-ping" />
                                <span className="font-black">J.S.F. ARCH // ONLINE</span>
                            </div>
                            <span className="text-neutral-400">LAT 50.1109° N // LON 8.6821° E</span>
                        </div>

                        {/* Title & Entity Name */}
                        <div className="mt-1">
                            <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#00E5FF] tracking-[0.25em] uppercase block drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                                ATELIER HEADQUARTERS
                            </span>
                            <h2 className="font-sans text-base sm:text-lg font-black tracking-tight text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                                Unternehmergesellschaft (haftungsbeschränkt)
                            </h2>
                        </div>
                    </div>

                    {/* LAYER 2: 3 Floating Spatial Data Modules (translateZ: 55px) */}
                    <div 
                        className="space-y-3 my-4 sm:my-5"
                        style={{ transform: 'translateZ(55px)' }}
                    >
                        {/* Sector 1: Location */}
                        <motion.div 
                            whileHover={{ scale: 1.015, x: 3 }}
                            className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-[#00FF88]/30 flex items-start gap-3 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                        >
                            <div className="p-2 rounded-xl bg-[#00FF88]/15 text-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.35)] shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] font-black tracking-wider text-[#00FF88] uppercase">
                                        SECTOR 01 // LOCATION
                                    </span>
                                    <span className="text-[8px] font-mono text-white/40">ALT 112M</span>
                                </div>
                                <span className="font-sans text-xs sm:text-sm text-neutral-100 font-medium leading-snug">
                                    Frankfurt am Main, State of Hesse, Germany
                                </span>
                            </div>
                        </motion.div>

                        {/* Sector 2: Sanctuary Profile */}
                        <motion.div 
                            whileHover={{ scale: 1.015, x: 3 }}
                            className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-[#00E5FF]/30 flex items-start gap-3 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                        >
                            <div className="p-2 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.35)] shrink-0">
                                <Music className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] font-black tracking-wider text-[#00E5FF] uppercase">
                                        SECTOR 02 // SANCTUARY PROFILE
                                    </span>
                                    <span className="text-[8px] font-mono text-white/40">44.1kHz STEREO</span>
                                </div>
                                <span className="font-sans text-xs sm:text-sm text-neutral-100 font-medium leading-snug">
                                    Acoustic Classical Violin & Modular Orchestra Sound Atelier + Analogue Salon
                                </span>
                            </div>
                        </motion.div>

                        {/* Sector 3: Development Roadmap */}
                        <motion.div 
                            whileHover={{ scale: 1.015, x: 3 }}
                            className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-[#FFE082]/30 flex items-start gap-3 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                        >
                            <div className="p-2 rounded-xl bg-[#FFE082]/15 text-[#FFE082] shadow-[0_0_12px_rgba(255,224,130,0.35)] shrink-0">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] font-black tracking-wider text-[#FFE082] uppercase">
                                        SECTOR 03 // ROADMAP
                                    </span>
                                    <span className="text-[8px] font-mono text-white/40">PHASE 4</span>
                                </div>
                                <span className="font-sans text-xs sm:text-sm text-neutral-100 font-medium leading-snug">
                                    Lease Agreement & Official Licensing in Progress ➔ <strong className="text-[#E7FF00] font-black">Grand Opening October 2026</strong>
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* LAYER 3: Interactive Holographic Action Trigger (translateZ: 70px) */}
                    <div style={{ transform: 'translateZ(70px)' }}>
                        <motion.button
                            whileHover={{ scale: 1.025, boxShadow: '0 0 35px rgba(0,255,136,0.8)' }}
                            whileTap={{ scale: 0.975 }}
                            onClick={handleHoloClose}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00FF88] via-[#00E5FF] to-[#00FF88] text-black font-mono text-xs font-black tracking-[0.25em] uppercase transition-all shadow-[0_0_25px_rgba(0,255,136,0.55)] cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Cpu className="w-4 h-4" />
                            <span>DISMISS HOLOGRAM // PROCEED</span>
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
