import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Download, Volume2, VolumeX, Sparkles, Sliders, Music, Mic, Layers, Disc, Radio } from 'lucide-react';
import { MR_AUDIO_SRC } from '../../constants/frames';

const SONG_DURATION = 126.79; // Exact 2:06.79

const ALIBI_SECTIONS = [
    { 
        id: 0, 
        startTime: 0, 
        endTime: 16.0, 
        title: "01. 심야의 서막 (Intro)", 
        sub: "프랑크푸르트 02:00 AM 적막과 앰비언트 비닐 노이즈", 
        lyric: "A quiet midnight alleyway... the clockwork begins to turn.",
        keyInstruments: ["Atmospheric Drone", "Vinyl Hiss", "Clockwork Ticks"],
        rms: "−19.2 dB", 
        color: "#C8A96E"
    },
    { 
        id: 1, 
        startTime: 16.0, 
        endTime: 38.0, 
        title: "02. 발걸음과 보컬의 난입 (Verse 1)", 
        sub: "드럼 비트 진입과 리드 보컬의 첫 번째 알리바이", 
        lyric: "Walking through the misty shadows, a twelve-minute alibi is born.",
        keyInstruments: ["Lead Vocals", "Drum Groove", "Sub Bass"],
        rms: "−14.8 dB", 
        color: "#E7FF00"
    },
    { 
        id: 2, 
        startTime: 38.0, 
        endTime: 58.0, 
        title: "03. 스테인드글라스 상승 (Pre-Chorus)", 
        sub: "기타 아르페지오와 신스 스위프가 만드는 긴장감", 
        lyric: "Echoes on the cobblestone, reaching for the golden sanctuary arch.",
        keyInstruments: ["Acoustic Guitar", "Synth Sweeps", "Percussion"],
        rms: "−12.1 dB", 
        color: "#00F0FF"
    },
    { 
        id: 3, 
        startTime: 58.0, 
        endTime: 86.0, 
        title: "04. 12분의 알리바이 (Chorus Apex)", 
        sub: "오케스트라 투티와 보컬 하모니의 압도적 절정", 
        lyric: "A TWELVE-MINUTE ALIBI — Lost in the midnight symphony!",
        keyInstruments: ["Full Tutti", "Lead Vocals", "Harmonic Stack", "Bass Drop"],
        rms: "−8.4 dB", 
        color: "#FF0055"
    },
    { 
        id: 4, 
        startTime: 86.0, 
        endTime: 108.0, 
        title: "05. 432Hz 낭만 살롱 카덴차 (Bridge)", 
        sub: "스타인웨이 피아노와 감성적인 보컬 하모닉스", 
        lyric: "Gentle candlelight reflections over polished black Steinway keys.",
        keyInstruments: ["Steinway Grand Piano", "Vocal Pad", "Air Reverb"],
        rms: "−16.0 dB", 
        color: "#FFD700"
    },
    { 
        id: 5, 
        startTime: 108.0, 
        endTime: 126.8, 
        title: "06. 벨벳 피날레 (Outro)", 
        sub: "모든 악기의 마지막 울림과 잔향의 소멸", 
        lyric: "The alibi is complete. The night returns to silence.",
        keyInstruments: ["Full Ensemble", "Reverb Tail", "Decay"],
        rms: "−9.8 dB", 
        color: "#E7FF00"
    }
];

const INSTRUMENT_NODES = [
    { id: 'vocals', name: 'Lead Vocals', icon: Mic, color: '#E7FF00', freqRange: 'Mid' },
    { id: 'drums', name: 'Drums & Perc', icon: Disc, color: '#FF0055', freqRange: 'Low' },
    { id: 'bass', name: 'Bass & Sub', icon: Layers, color: '#00F0FF', freqRange: 'Sub' },
    { id: 'guitar', name: 'Guitar & Arp', icon: Music, color: '#C8A96E', freqRange: 'High-Mid' },
    { id: 'synth', name: 'Synth & Keys', icon: Radio, color: '#A855F7', freqRange: 'Treble' }
];

export function ModularSoundLabModal({ isOpen, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [focusedInstrument, setFocusedInstrument] = useState(null);
    const [audioEnergy, setAudioEnergy] = useState({ bass: 0, mid: 0, high: 0, peak: 0 });

    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close().catch(() => {});
                audioCtxRef.current = null;
            }
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            setIsPlaying(false);
            setCurrentTime(0);
            return;
        }

        // Pause all other audio on page
        document.querySelectorAll('audio').forEach(el => {
            try { el.pause(); } catch(e) {}
        });

        // Initialize Audio Element with Master MR track
        const audio = new Audio(MR_AUDIO_SRC);
        audioRef.current = audio;
        audio.preload = "auto";

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
        });

        // Connect Web Audio API Analyser
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            audioCtxRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.85;
            analyserRef.current = analyser;

            const source = ctx.createMediaElementSource(audio);
            sourceNodeRef.current = source;
            source.connect(analyser);
            analyser.connect(ctx.destination);
        } catch (err) {
            console.warn("Web Audio Context initialization:", err);
        }

        // Auto-play audio safely
        audio.play().then(() => {
            setIsPlaying(true);
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        }).catch(err => console.log('Autoplay blocked:', err));

        // Start 3D Holographic Spatial Visualizer
        start3DVisualizer();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isOpen]);

    const start3DVisualizer = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = canvas.parentElement.clientWidth);
        let height = (canvas.height = canvas.parentElement.clientHeight);

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', handleResize);

        const dataArray = new Uint8Array(128);
        let angle = 0;

        // 3D Orbiting Particle Nodes
        const particles = Array.from({ length: 100 }, (_, i) => ({
            dist: 60 + Math.random() * 220,
            angle: Math.random() * Math.PI * 2,
            speed: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 140,
            size: Math.random() * 2.5 + 1,
            hue: i % 2 === 0 ? 55 : 45
        }));

        const render = () => {
            // Semi-transparent fade for motion blur
            ctx.fillStyle = 'rgba(6, 5, 8, 0.28)';
            ctx.fillRect(0, 0, width, height);

            let bass = 0, mid = 0, high = 0;

            if (analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
                // Calculate frequency bands
                for (let i = 0; i < 15; i++) bass += dataArray[i];
                for (let i = 15; i < 50; i++) mid += dataArray[i];
                for (let i = 50; i < 100; i++) high += dataArray[i];

                bass = (bass / 15) / 255;
                mid = (mid / 35) / 255;
                high = (high / 50) / 255;
            } else {
                bass = 0.3; mid = 0.4; high = 0.2;
            }

            const masterPulse = (bass * 0.5 + mid * 0.3 + high * 0.2);
            setAudioEnergy({ bass, mid, high, peak: masterPulse });

            const centerX = width / 2;
            const centerY = height / 2;
            angle += 0.015 + masterPulse * 0.02;

            // 1. Draw 3D Central Holographic Vocal Core (Pulsing Concentric Glass Rings)
            const coreRadius = 45 + masterPulse * 55;
            const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, coreRadius * 1.8);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.3, 'rgba(231, 255, 0, 0.7)');
            gradient.addColorStop(0.7, 'rgba(200, 169, 110, 0.25)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(centerX, centerY, coreRadius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // 2. Multi-Layer Frequency Circular Waveform Spokes
            const spokes = 48;
            ctx.lineWidth = 2;
            for (let i = 0; i < spokes; i++) {
                const spokeAngle = (i / spokes) * Math.PI * 2 + angle;
                const freqVal = dataArray[i % dataArray.length] / 255;
                const rInner = coreRadius;
                const rOuter = coreRadius + freqVal * (80 + bass * 60);

                const x1 = centerX + Math.cos(spokeAngle) * rInner;
                const y1 = centerY + Math.sin(spokeAngle) * rInner * 0.7; // 3D Isometric tilt
                const x2 = centerX + Math.cos(spokeAngle) * rOuter;
                const y2 = centerY + Math.sin(spokeAngle) * rOuter * 0.7;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `hsla(${45 + freqVal * 30}, 100%, 65%, ${0.3 + freqVal * 0.7})`;
                ctx.stroke();
            }

            // 3. 3D Orbiting Golden Star Particles
            particles.forEach((p) => {
                p.angle += p.speed + (isPlaying ? masterPulse * 0.03 : 0.005);
                const px = centerX + Math.cos(p.angle) * p.dist;
                const py = centerY + Math.sin(p.angle) * (p.dist * 0.45) + p.y * (1 + bass * 0.4);

                ctx.beginPath();
                ctx.arc(px, py, p.size * (1 + high * 1.5), 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${0.4 + high * 0.6})`;
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#E7FF00';
                ctx.fill();
            });

            animFrameRef.current = requestAnimationFrame(render);
        };

        render();
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const targetPercent = Math.max(0, Math.min(1, clickX / rect.width));
        const targetTime = targetPercent * SONG_DURATION;
        if (audioRef.current) {
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
        }
    };

    const jumpToSection = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            if (!isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
        }
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    // Find active section based on exact current time
    const activeSection = ALIBI_SECTIONS.find(
        s => currentTime >= s.startTime && currentTime < s.endTime
    ) || ALIBI_SECTIONS[0];

    const progressPercent = Math.min(100, (currentTime / SONG_DURATION) * 100);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-1 sm:p-5 select-none overflow-hidden"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-3xl bg-[#08070A] border border-white/20 flex flex-col overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.98)]"
                >
                    {/* 1. Top HUD Master Bar */}
                    <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/60 backdrop-blur-md z-30">
                        <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-xl bg-[#E7FF00]/15 text-[#E7FF00] border border-[#E7FF00]/30 shadow-[0_0_12px_rgba(231,255,0,0.5)]">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    3D HOLOGRAPHIC STEM ACOUSTIC LAB // 44.1kHz MASTER
                                </span>
                                <h2 className="font-sans text-sm sm:text-base font-black text-white tracking-wide flex items-center gap-2">
                                    <span>A TWELVE-MINUTE ALIBI</span>
                                    <span className="text-xs font-mono font-normal text-neutral-400">· J. SEAN FLOWS</span>
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={MR_AUDIO_SRC}
                                download="JUST_SEAN_FLOWS_A_TWELVE_MINUTE_ALIBI_MASTER.wav"
                                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-mono font-bold text-white uppercase transition-all cursor-pointer shadow-lg"
                            >
                                <Download className="w-3.5 h-3.5 text-[#E7FF00]" />
                                <span>DOWNLOAD MASTER WAV</span>
                            </a>

                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* 2. Main 3D Holographic Stage */}
                    <div className="relative flex-1 bg-black overflow-hidden flex flex-col justify-between p-4 sm:p-8">
                        {/* 3D Flowfield Web Audio Canvas */}
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

                        {/* Top Synchronized Section Narrative Card */}
                        <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span 
                                        className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black tracking-widest uppercase border"
                                        style={{ 
                                            backgroundColor: `${activeSection.color}20`, 
                                            color: activeSection.color, 
                                            borderColor: `${activeSection.color}50` 
                                        }}
                                    >
                                        SYNCHRONIZED TIMELINE
                                    </span>
                                    <span className="font-mono text-xs text-neutral-400">
                                        {formatTime(currentTime)} / {formatTime(SONG_DURATION)}
                                    </span>
                                </div>

                                <h3 className="font-serif italic text-2xl sm:text-4xl font-bold text-white tracking-tight">
                                    {activeSection.title}
                                </h3>
                                <p className="font-sans text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                                    "{activeSection.lyric}"
                                </p>
                            </div>

                            {/* Live Spectrum Frequency Energy VU Meters */}
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl shrink-0">
                                <div className="text-center">
                                    <span className="font-mono text-[8px] text-neutral-400 block mb-1 uppercase">SUB-BASS</span>
                                    <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            style={{ width: `${audioEnergy.bass * 100}%` }}
                                            className="h-full bg-[#00F0FF] transition-all duration-75"
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="font-mono text-[8px] text-neutral-400 block mb-1 uppercase">VOCAL/MID</span>
                                    <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            style={{ width: `${audioEnergy.mid * 100}%` }}
                                            className="h-full bg-[#E7FF00] transition-all duration-75"
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="font-mono text-[8px] text-neutral-400 block mb-1 uppercase">TREBLE/AIR</span>
                                    <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            style={{ width: `${audioEnergy.high * 100}%` }}
                                            className="h-full bg-[#FF0055] transition-all duration-75"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center Orbiting Instrument Stem Nodes */}
                        <div className="relative z-20 flex items-center justify-center gap-2 sm:gap-4 flex-wrap my-3">
                            {INSTRUMENT_NODES.map((inst) => {
                                const IconComponent = inst.icon;
                                const isFocused = focusedInstrument === inst.id;
                                return (
                                    <motion.button
                                        key={inst.id}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setFocusedInstrument(isFocused ? null : inst.id)}
                                        className={`px-3.5 py-2 rounded-2xl border font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                                            isFocused 
                                                ? 'bg-[#E7FF00] text-black border-[#E7FF00] shadow-[0_0_25px_rgba(231,255,0,0.8)]' 
                                                : 'bg-black/70 text-neutral-300 border-white/15 hover:border-white/40'
                                        }`}
                                    >
                                        <IconComponent className="w-3.5 h-3.5" style={{ color: isFocused ? '#000' : inst.color }} />
                                        <span>{inst.name}</span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Bottom Master Playback & Timeline Controls */}
                        <div className="relative z-20 flex flex-col gap-3 p-4 sm:p-5 rounded-3xl bg-black/80 border border-white/15 backdrop-blur-2xl">
                            {/* Interactive Millisecond Seek Bar */}
                            <div
                                onClick={handleSeek}
                                className="relative w-full h-3.5 bg-white/15 rounded-full cursor-pointer overflow-hidden group shadow-inner"
                            >
                                <div
                                    style={{ width: `${progressPercent}%` }}
                                    className="h-full bg-gradient-to-r from-[#C8A96E] via-[#E7FF00] to-white rounded-full relative transition-all duration-75 shadow-[0_0_15px_#E7FF00]"
                                />
                            </div>

                            {/* Section Jump Marker Pills */}
                            <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1">
                                {ALIBI_SECTIONS.map((sec) => (
                                    <button
                                        key={sec.id}
                                        onClick={() => jumpToSection(sec.startTime)}
                                        className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                                            activeSection.id === sec.id
                                                ? 'bg-[#E7FF00] text-black shadow-[0_0_12px_#E7FF00]'
                                                : 'bg-white/5 text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        <span>{formatTime(sec.startTime)} {sec.title.split('.')[1].split('(')[0]}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Master Deck Controls */}
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={togglePlay}
                                        className="w-12 h-12 rounded-full bg-[#E7FF00] text-black flex items-center justify-center shadow-[0_0_30px_rgba(231,255,0,0.85)] hover:scale-110 transition-all cursor-pointer"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                    </button>

                                    <div className="font-mono text-xs sm:text-sm font-black text-white tracking-widest">
                                        <span>{formatTime(currentTime)}</span>
                                        <span className="text-neutral-500 mx-1.5">/</span>
                                        <span className="text-neutral-400">{formatTime(SONG_DURATION)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-[#E7FF00] font-bold">
                                        128-BAND FFT // 3D SPATIAL
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
