import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ArrowRight, ArrowLeft, Disc, Sparkles, ExternalLink } from 'lucide-react';

const AUDIO_SRC = "/assets/manual_upload/A Twelve-minute Alibi_classic/FINAL_MASTER_ASSETS/J_SEAN_F_Capriccio_in_A_minor_Op1_FINAL_MASTER.wav";

export default function ModernExperience() {
    const [currentScene, setCurrentScene] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(178.44);

    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const containerRef = useRef(null);

    const totalScenes = 4;

    // Web Audio API
    const initAudioContext = () => {
        if (!audioCtxRef.current && audioRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.8;
            const source = ctx.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(ctx.destination);

            audioCtxRef.current = ctx;
            analyserRef.current = analyser;
            dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
            sourceRef.current = source;
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    const togglePlay = () => {
        initAudioContext();
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(e => console.log('Autoplay prevented:', e));
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                setDuration(audioRef.current.duration);
            }
        }
    };

    const seekTo = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            if (!isPlaying) togglePlay();
        }
    };

    // Horizontal wheel navigation listener
    useEffect(() => {
        let isThrottled = false;

        const handleWheel = (e) => {
            if (isThrottled) return;

            if (e.deltaY > 30 || e.deltaX > 30) {
                setCurrentScene((prev) => Math.min(totalScenes - 1, prev + 1));
                isThrottled = true;
                setTimeout(() => { isThrottled = false; }, 800);
            } else if (e.deltaY < -30 || e.deltaX < -30) {
                setCurrentScene((prev) => Math.max(0, prev - 1));
                isThrottled = true;
                setTimeout(() => { isThrottled = false; }, 800);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                setCurrentScene((prev) => Math.min(totalScenes - 1, prev + 1));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                setCurrentScene((prev) => Math.max(0, prev - 1));
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Minimal audio wave animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let phase = 0;
        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            let energy = 0;
            if (analyserRef.current && isPlaying) {
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                let sum = 0;
                for (let i = 0; i < dataArrayRef.current.length; i++) sum += dataArrayRef.current[i];
                energy = (sum / dataArrayRef.current.length) / 255;
            }

            phase += 0.02 + energy * 0.06;

            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            for (let x = 0; x < width; x++) {
                const amp = (isPlaying ? 15 + energy * 40 : 4);
                const freq = 0.01;
                const y = height / 2 + Math.sin(x * freq + phase) * amp * Math.sin(x / width * Math.PI);
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = `rgba(197, 160, 89, ${isPlaying ? 0.7 + energy * 0.3 : 0.25})`;
            ctx.lineWidth = isPlaying ? 2 : 1;
            ctx.stroke();

            animFrameRef.current = requestAnimationFrame(render);
        };

        render();
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPlaying]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-[#050507] text-[#F5F4EE] font-serif overflow-hidden select-none">
            <audio
                ref={audioRef}
                src={AUDIO_SRC}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
            />

            {/* Persistent Top Minimalist Frame */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 sm:px-14 py-7 flex items-center justify-between pointer-events-auto">
                <a href="#" className="font-sans text-xs tracking-[0.4em] uppercase font-light text-[#F5F4EE] hover:text-[#C5A059] transition-colors">
                    JUST<span className="text-[#C5A059]">.</span>SEAN<span className="text-[#C5A059]">.</span>FLOWS
                </a>

                {/* Persistent Mini Audio Play / Pause */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={togglePlay}
                        className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A059]/40 bg-[#0E0F14]/80 hover:border-[#C5A059] transition-all"
                    >
                        {isPlaying ? <Pause className="w-3 h-3 text-[#C5A059]" /> : <Play className="w-3 h-3 text-[#C5A059]" />}
                        <span className="font-sans text-[10px] tracking-[0.2em] text-[#C5A059]">
                            {isPlaying ? formatTime(currentTime) : 'PLAY OP. 1'}
                        </span>
                    </button>

                    <div className="hidden sm:flex items-center gap-6 font-sans text-xs tracking-[0.2em] uppercase text-[#F5F4EE]/50">
                        <a href="/logos.html" className="hover:text-[#C5A059] transition-colors">LOGOS (72)</a>
                        <a href="/mixer.html" className="hover:text-[#C5A059] transition-colors">CRITIQUE</a>
                    </div>
                </div>
            </header>

            {/* Horizontal Film-Strip Camera Track (100vw per Scene) */}
            <motion.div
                className="flex w-[400vw] h-screen"
                animate={{ x: `-${currentScene * 100}vw` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* ========================================================
                    SCENE 01: OVERTURE (Pure Monolithic Identity)
                   ======================================================== */}
                <div className="w-screen h-screen flex flex-col justify-center items-center px-8 text-center relative flex-shrink-0">
                    <div className="max-w-4xl flex flex-col items-center">
                        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-4">
                            SCENE 01 // OVERTURE
                        </span>

                        <h1 className="text-7xl sm:text-9xl md:text-[11rem] font-light tracking-[0.06em] text-[#F5F4EE] uppercase leading-[0.88]">
                            JUST<span className="text-[#C5A059] italic">.</span>SEAN
                            <br />
                            <span className="italic text-[#C5A059] font-normal">FLOWS</span>
                        </h1>

                        <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-[#F5F4EE]/50 mt-8 max-w-lg leading-relaxed">
                            A symphony of midnight romance,
                            <br />
                            classical virtuosity, and raw indie souls.
                        </p>

                        <button
                            onClick={togglePlay}
                            className="mt-10 px-8 py-3.5 rounded-full border border-[#C5A059] text-[#050507] bg-[#C5A059] font-sans text-xs tracking-[0.25em] font-semibold uppercase hover:bg-transparent hover:text-[#F5F4EE] transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                            <span>{isPlaying ? 'PAUSE CAPRICCIO OP. 1' : 'ENTER SOUNDSCAPE (OP. 1)'}</span>
                        </button>
                    </div>

                    <div className="absolute bottom-12 right-14 flex items-center gap-3 font-sans text-xs tracking-[0.2em] text-[#F5F4EE]/40">
                        <span>SWIPE OR SCROLL</span>
                        <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                    </div>
                </div>

                {/* ========================================================
                    SCENE 02: THE MASTERPIECE (Acoustic Timeline)
                   ======================================================== */}
                <div className="w-screen h-screen flex flex-col justify-center px-12 sm:px-24 relative flex-shrink-0">
                    <div className="max-w-5xl mx-auto w-full">
                        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-3">
                            SCENE 02 // MASTERPIECE
                        </span>

                        <h2 className="text-5xl sm:text-7xl font-light text-[#F5F4EE] mb-2">
                            Capriccio in A minor, <span className="text-[#C5A059] italic">Op. 1</span>
                        </h2>
                        <p className="font-sans text-xs tracking-[0.25em] text-[#F5F4EE]/50 uppercase mb-12">
                            Solo Violin &amp; Grand Symphony Orchestra · J. SEAN F
                        </p>

                        {/* 4 Movements Seamless Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                            {[
                                { num: 'I', title: 'Intro & Pizzicato', time: 0, tag: '0:00' },
                                { num: 'II', title: 'Solo Violin Cadenza', time: 44.1, tag: '0:44' },
                                { num: 'III', title: 'Grand Finale Surge', time: 93, tag: '1:33' },
                                { num: 'IV', title: 'Presto Coda Climax', time: 135, tag: '2:15' },
                            ].map((m, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => seekTo(m.time)}
                                    className={`p-6 text-left border transition-all duration-300 ${
                                        currentTime >= m.time && (idx === 3 || currentTime < [44.1, 93, 135][idx])
                                            ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#ECEBE4]'
                                            : 'border-[#22232C] bg-[#0A0B10]/60 text-[#888] hover:border-[#C5A059]/50 hover:text-[#ECEBE4]'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-sans text-xs text-[#C5A059] font-bold">{m.num}</span>
                                        <span className="font-sans text-[10px] text-[#666]">{m.tag}</span>
                                    </div>
                                    <div className="text-lg font-light text-[#F5F4EE]">{m.title}</div>
                                </button>
                            ))}
                        </div>

                        {/* Live Audio Progress */}
                        <div className="w-full h-1 bg-[#1A1A22] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#C5A059] transition-all duration-100"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    SCENE 03: ALLURE & NOIR (Cinematic Art Panorama)
                   ======================================================== */}
                <div className="w-screen h-screen flex flex-col justify-center px-12 sm:px-24 relative flex-shrink-0">
                    <div className="max-w-6xl mx-auto w-full">
                        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-3">
                            SCENE 03 // MANIFESTO
                        </span>
                        <h2 className="text-5xl sm:text-7xl font-light text-[#F5F4EE] mb-12">
                            The Four <span className="italic text-[#C5A059]">Forces</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                            {[
                                { title: '01. ALLURE', desc: 'Feminine Curves', img: '/assets/logos/logo_brand_61_martini_femme_1787073382006.jpg' },
                                { title: '02. INDIE ROCK', desc: 'Velvet Distortion', img: '/assets/logos/logo_indie_44_serpent_guitar_1787072867739.jpg' },
                                { title: '03. ACOUSTICS', desc: 'Stradivarius S', img: '/assets/logos/logo_brand_69_violin_s_letterform_1787073494208.jpg' },
                                { title: '04. NIGHTLIFE', desc: 'Champagne Trinity', img: '/assets/logos/logo_brand_68_party_champagne_stack_1787073485320.jpg' },
                            ].map((f, i) => (
                                <div key={i} className="group relative aspect-[3/4] border border-[#22232C] bg-[#0A0B10] overflow-hidden p-6 flex flex-col justify-between">
                                    <img
                                        src={f.img}
                                        alt={f.title}
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <span className="relative z-10 font-sans text-[10px] tracking-[0.25em] text-[#C5A059] uppercase">{f.title}</span>
                                    <div className="relative z-10 text-xl font-light text-[#F5F4EE]">{f.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    SCENE 04: THE PORTALS (Ecosystem Gateways)
                   ======================================================== */}
                <div className="w-screen h-screen flex flex-col justify-center px-12 sm:px-24 relative flex-shrink-0">
                    <div className="max-w-5xl mx-auto w-full">
                        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-3">
                            SCENE 04 // VAULT
                        </span>
                        <h2 className="text-5xl sm:text-7xl font-light text-[#F5F4EE] mb-12">
                            The <span className="italic text-[#C5A059]">Portals</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <a
                                href="/logos.html"
                                className="group p-10 border border-[#22232C] bg-[#0A0B10] hover:border-[#C5A059] transition-all flex flex-col justify-between aspect-[16/10] relative overflow-hidden"
                            >
                                <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A059] flex justify-between items-center">
                                    <span>EXHIBIT</span>
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-3xl sm:text-4xl font-light text-[#F5F4EE] group-hover:text-[#C5A059] transition-colors">
                                        72 Logo Museum
                                    </h3>
                                    <p className="font-sans text-xs text-[#888] mt-2">
                                        Haute Couture · Korean Heritage · Indie &amp; Beauty
                                    </p>
                                </div>
                            </a>

                            <a
                                href="/mixer.html"
                                className="group p-10 border border-[#22232C] bg-[#0A0B10] hover:border-[#C5A059] transition-all flex flex-col justify-between aspect-[16/10] relative overflow-hidden"
                            >
                                <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A059] flex justify-between items-center">
                                    <span>HERMENEUTICS</span>
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-3xl sm:text-4xl font-light text-[#F5F4EE] group-hover:text-[#C5A059] transition-colors">
                                        Music Critic Cinema
                                    </h3>
                                    <p className="font-sans text-xs text-[#888] mt-2">
                                        7-Section Realtime FFT Acoustic Analysis
                                    </p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Persistent Bottom Scene Navigator (Dots & Numbers) */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 px-8 sm:px-14 py-7 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-4">
                    {[0, 1, 2, 3].map((sceneIdx) => (
                        <button
                            key={sceneIdx}
                            onClick={() => setCurrentScene(sceneIdx)}
                            className="flex items-center gap-2 group cursor-pointer"
                        >
                            <span
                                className={`h-1 transition-all duration-500 rounded-full ${
                                    currentScene === sceneIdx
                                        ? 'w-10 bg-[#C5A059]'
                                        : 'w-3 bg-[#333] group-hover:bg-[#666]'
                                }`}
                            />
                        </button>
                    ))}
                </div>

                <div className="font-sans text-[11px] tracking-[0.25em] text-[#F5F4EE]/50 uppercase">
                    SCENE <span className="text-[#C5A059] font-bold">0{currentScene + 1}</span> / 04
                </div>
            </footer>

            {/* Ambient Bottom Wave Canvas */}
            <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none opacity-40 z-10">
                <canvas ref={canvasRef} width={1200} height={96} className="w-full h-full" />
            </div>
        </div>
    );
}
