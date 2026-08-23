import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Download, Sparkles, Sliders, Volume2, VolumeX, Music, Waves } from 'lucide-react';
import { MR_AUDIO_SRC } from '../../constants/frames';

const ALIBI_SECTIONS = [
    { id: 0, time: 0, label: "01. 심야의 서막", sub: "프랑크푸르트 02:00 AM 적막과 앰비언트 비트", metric: "RMS −18.4 dB", peak: "−3.50 dB", style: "Atmospheric Rain & Drone" },
    { id: 1, time: 24, label: "02. 코너 턴 & 발걸음", sub: "자유 보행 진입과 비트의 고조", metric: "Peak −3.10 dB", peak: "−2.60 dB", style: "Kinetic Tempo & Pulse" },
    { id: 2, time: 52, label: "03. 스테인드글라스 아치", sub: "3D 홀로그램 조각과 오케스트라 현악 난입", metric: "배음 비중 6.8%", peak: "−1.80 dB", style: "Orchestral Arpeggio" },
    { id: 3, time: 88, label: "04. 골든 스타인웨이 살롱", sub: "432Hz 빈티지 그랜드 피아노 & 독주 바이올린 카덴차", metric: "432Hz Tuning", peak: "−1.20 dB", style: "Chamber Cadenza" },
    { id: 4, time: 130, label: "05. 12분의 알리바이 (피날레)", sub: "벨벳 수트와 18K 골드 테마의 화려한 투티", metric: "Dynamic Range 14 LUFS", peak: "−0.20 dB", style: "Full Tutti & Velvet Apex" }
];

export function ModularSoundLabModal({ isOpen, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(168); // ~2:48
    const [activeSectionIdx, setActiveSectionIdx] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [bassBoost, setBassBoost] = useState(1.0);
    const [trebleAir, setTrebleAir] = useState(1.0);

    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            return;
        }

        // Initialize Audio Element
        const audio = new Audio(MR_AUDIO_SRC);
        audioRef.current = audio;
        audio.preload = "auto";

        audio.addEventListener('loadedmetadata', () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        });

        audio.addEventListener('timeupdate', () => {
            const cur = audio.currentTime;
            setCurrentTime(cur);

            // Determine active section
            for (let i = ALIBI_SECTIONS.length - 1; i >= 0; i--) {
                if (cur >= ALIBI_SECTIONS[i].time) {
                    setActiveSectionIdx(i);
                    break;
                }
            }
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
        });

        // Auto-play on open
        audio.play().then(() => setIsPlaying(true)).catch((err) => console.log('Audio autoplay blocked:', err));

        // Start Canvas Visualizer Animation
        initVisualizer();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isOpen]);

    const initVisualizer = () => {
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

        // Particle Flowfield & Waves
        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            hue: Math.random() > 0.4 ? 48 : 55 // Gold & Yellow hues
        }));

        let angle = 0;

        const render = () => {
            ctx.fillStyle = 'rgba(7, 6, 8, 0.25)';
            ctx.fillRect(0, 0, width, height);

            angle += 0.02;

            // Draw Audio-Reactive Multi-Wave Sine Ribbons
            const waveCount = 4;
            for (let w = 0; w < waveCount; w++) {
                ctx.beginPath();
                ctx.lineWidth = w === 0 ? 3 : 1.5;
                ctx.strokeStyle = w === 0 ? 'rgba(231, 255, 0, 0.85)' : `rgba(200, 169, 110, ${0.4 - w * 0.08})`;

                for (let x = 0; x < width; x += 6) {
                    const freq = 0.008 + w * 0.003;
                    const amp = (35 + w * 18) * (isPlaying ? 1.4 : 0.4);
                    const y = height / 2 + Math.sin(x * freq + angle + w * 1.2) * amp * Math.cos(angle * 0.5 + x * 0.002);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Draw Particles with Spring Trajectories
            particles.forEach((p) => {
                p.x += p.vx * (isPlaying ? 1.8 : 0.6);
                p.y += p.vy * (isPlaying ? 1.8 : 0.6);

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * (isPlaying ? 1.4 : 1), 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${isPlaying ? 0.7 : 0.3})`;
                ctx.shadowBlur = 10;
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
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const targetPercent = Math.max(0, Math.min(1, clickX / rect.width));
        const targetTime = targetPercent * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
        }
    };

    const jumpToSection = (sectionTime) => {
        if (audioRef.current) {
            audioRef.current.currentTime = sectionTime;
            setCurrentTime(sectionTime);
            if (!isPlaying) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    const currentSec = ALIBI_SECTIONS[activeSectionIdx] || ALIBI_SECTIONS[0];
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-6 select-none overflow-hidden"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl h-[94vh] sm:h-[90vh] rounded-3xl bg-[#09080B] border border-white/20 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.98)]"
                >
                    {/* Top Sound Control Bar */}
                    <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/60 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
                            <span className="p-1.5 rounded-lg bg-[#E7FF00]/15 text-[#E7FF00]">
                                <Waves className="w-4 h-4" />
                            </span>
                            <div>
                                <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase block">
                                    44.1kHz MASTER AUDIO LAB // 3D FLUID FIELD
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
                                download="JUST_SEAN_FLOWS_A_TWELVE_MINUTE_ALIBI_MR.wav"
                                className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-white uppercase transition-all cursor-pointer"
                            >
                                <Download className="w-3 h-3 text-[#E7FF00]" />
                                <span>DOWNLOAD WAV</span>
                            </a>

                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Main Visualizer Stage */}
                    <div className="relative flex-1 bg-black overflow-hidden flex flex-col justify-between p-6 sm:p-10">
                        {/* 3D Flowfield Canvas Background */}
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

                        {/* Top Active Section Tag & Metrics */}
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#E7FF00]/15 text-[#E7FF00] font-mono text-[9px] font-bold tracking-widest uppercase border border-[#E7FF00]/30">
                                    ACTIVE TIMELINE SEGMENT
                                </span>
                                <h3 className="font-serif italic text-2xl sm:text-4xl font-bold text-white mt-1">
                                    {currentSec.label}
                                </h3>
                                <p className="font-sans text-xs sm:text-sm text-neutral-300 mt-0.5">
                                    {currentSec.sub}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                                <div className="text-right">
                                    <span className="font-mono text-[8px] text-neutral-400 uppercase block tracking-wider">STYLE / TIMBRE</span>
                                    <span className="font-mono text-xs font-bold text-[#E7FF00]">{currentSec.style}</span>
                                </div>
                                <span className="w-px h-6 bg-white/15" />
                                <div className="text-right">
                                    <span className="font-mono text-[8px] text-neutral-400 uppercase block tracking-wider">ACOUSTIC DYNAMICS</span>
                                    <span className="font-mono text-xs font-bold text-white">{currentSec.metric}</span>
                                </div>
                            </div>
                        </div>

                        {/* Center Interactive Section Track Pills */}
                        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap my-4">
                            {ALIBI_SECTIONS.map((sec, idx) => (
                                <button
                                    key={sec.id}
                                    onClick={() => jumpToSection(sec.time)}
                                    className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                                        idx === activeSectionIdx
                                            ? 'bg-[#E7FF00] text-black shadow-[0_0_20px_rgba(231,255,0,0.7)] scale-105'
                                            : 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20'
                                    }`}
                                >
                                    <span>{formatTime(sec.time)}</span>
                                    <span className="hidden sm:inline font-sans">{sec.label.split('.')[1]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Bottom Master Playback Deck */}
                        <div className="relative z-10 flex flex-col gap-3 p-4 rounded-3xl bg-black/70 border border-white/15 backdrop-blur-xl">
                            {/* Seek Progress Bar */}
                            <div
                                onClick={handleSeek}
                                className="relative w-full h-3 bg-white/15 rounded-full cursor-pointer overflow-hidden group"
                            >
                                <div
                                    style={{ width: `${progressPercent}%` }}
                                    className="h-full bg-gradient-to-r from-[#C8A96E] via-[#E7FF00] to-white rounded-full relative transition-all duration-100 shadow-[0_0_12px_#E7FF00]"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={togglePlay}
                                        className="w-11 h-11 rounded-full bg-[#E7FF00] text-black flex items-center justify-center shadow-[0_0_25px_rgba(231,255,0,0.8)] hover:scale-110 transition-all cursor-pointer"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                    </button>

                                    <div className="font-mono text-xs font-bold text-white tracking-widest">
                                        <span>{formatTime(currentTime)}</span>
                                        <span className="text-neutral-500 mx-1">/</span>
                                        <span className="text-neutral-400">{formatTime(duration)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-[#E7FF00] font-bold">
                                        44.1kHz / 24-BIT STEREO
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
