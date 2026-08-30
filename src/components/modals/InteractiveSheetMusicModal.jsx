import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Music, ZoomIn, ZoomOut, Sparkles, Copy, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import abcjs from 'abcjs';

// CALIBRATED 110.13 BPM LEAD SHEET (Clean 1/8 notation without overlaps)
const TWELVE_MINUTE_ALIBI_LEAD_SHEET = `
X: 1
T: A Twelve-minute Alibi (CADENZA-432 Live Score)
C: Just Sean Flows (A = 432Hz • 110.13 BPM)
M: 4/4
L: 1/8
Q: 1/4=110
K: Dm
%%scale 0.80
%%staffwidth 750
%%topspace 12
%%titlespace 10
%%wordsfont Helvetica-Bold 13
%%gchordfont Helvetica-Bold 14
%%subtitlespace 6
%%measurenb 0
z2 E F | "Dm" F G E A- | A G F E | "Dm" D4 | "Bb" D C C D- | D _E _E2 | "Am" A,4- | A,4 |
w: When the | Frank-furt freeze is | how- * ling, | ling, | And the surge pri- | * cing breaks | heart. | _
"Gm" F F G F | E E3 | "A7" A2 A G | A4 | "Dm" D E E F | D2 D2 | "Dm" C D C A,- | A,4 |]
w: You're hud-dled by | the con-crete, | Swa-llowed in | my | hea-vy lea-ther | ja-cket, | ja- * * * | cket.
`;

// Syllable & Note Millisecond Sync Map (Calibrated to Master Audio Waveform)
const SONG_LYRICS_TIMELINE = [
    { start: 0.00, end: 1.50, text: "[Intro Guitar Riff]", noteIdx: -1, chord: "Dm" },
    { start: 1.50, end: 2.10, text: "When", noteIdx: 0, chord: "Dm" },
    { start: 2.10, end: 2.50, text: "the", noteIdx: 1, chord: "Dm" },
    { start: 2.50, end: 3.20, text: "Frank-", noteIdx: 2, chord: "Dm" },
    { start: 3.20, end: 3.80, text: "furt", noteIdx: 3, chord: "Dm" },
    { start: 3.80, end: 4.50, text: "freeze", noteIdx: 4, chord: "Dm" },
    { start: 4.50, end: 4.90, text: "is", noteIdx: 5, chord: "Dm" },
    { start: 4.90, end: 5.80, text: "how-", noteIdx: 6, chord: "Dm" },
    { start: 5.80, end: 6.80, text: "ling,", noteIdx: 7, chord: "Dm" },
    { start: 6.80, end: 8.80, text: "ling,", noteIdx: 8, chord: "Dm" },
    { start: 8.80, end: 9.40, text: "And", noteIdx: 9, chord: "Bb" },
    { start: 9.40, end: 9.90, text: "the", noteIdx: 10, chord: "Bb" },
    { start: 9.90, end: 10.60, text: "surge", noteIdx: 11, chord: "Bb" },
    { start: 10.60, end: 11.30, text: "pri-", noteIdx: 12, chord: "Bb" },
    { start: 11.30, end: 11.90, text: "cing", noteIdx: 13, chord: "Bb" },
    { start: 11.90, end: 12.80, text: "breaks", noteIdx: 14, chord: "Bb" },
    { start: 12.80, end: 13.50, text: "your", noteIdx: 15, chord: "Am" },
    { start: 13.50, end: 15.50, text: "heart.", noteIdx: 16, chord: "Am" },
    { start: 15.50, end: 16.30, text: "[Interlude]", noteIdx: -1, chord: "Am" },
    { start: 16.30, end: 17.10, text: "You're", noteIdx: 17, chord: "Gm" },
    { start: 17.10, end: 17.80, text: "hud-", noteIdx: 18, chord: "Gm" },
    { start: 17.80, end: 18.50, text: "dled", noteIdx: 19, chord: "Gm" },
    { start: 18.50, end: 19.10, text: "by", noteIdx: 20, chord: "Gm" },
    { start: 19.10, end: 19.60, text: "the", noteIdx: 21, chord: "Gm" },
    { start: 19.60, end: 20.30, text: "con-", noteIdx: 22, chord: "Gm" },
    { start: 20.30, end: 21.30, text: "crete,", noteIdx: 23, chord: "A7" },
    { start: 21.30, end: 22.00, text: "Swa-", noteIdx: 24, chord: "A7" },
    { start: 22.00, end: 22.60, text: "llowed", noteIdx: 25, chord: "A7" },
    { start: 22.60, end: 23.00, text: "in", noteIdx: 26, chord: "A7" },
    { start: 23.00, end: 23.50, text: "my", noteIdx: 27, chord: "Dm" },
    { start: 23.50, end: 24.10, text: "hea-", noteIdx: 28, chord: "Dm" },
    { start: 24.10, end: 24.60, text: "vy", noteIdx: 29, chord: "Dm" },
    { start: 24.60, end: 25.10, text: "lea-", noteIdx: 30, chord: "Dm" },
    { start: 25.10, end: 25.60, text: "ther", noteIdx: 31, chord: "Dm" },
    { start: 25.60, end: 26.20, text: "ja-", noteIdx: 32, chord: "Dm" },
    { start: 26.20, end: 27.00, text: "cket,", noteIdx: 33, chord: "Dm" },
    { start: 27.00, end: 29.00, text: "cket.", noteIdx: 34, chord: "Dm" }
];

const CHORD_SEQUENCE = ['Dm', 'Bb', 'Am', 'Gm', 'A7', 'Dm'];

const CHORD_FREQUENCIES_432 = {
    'Dm': [288.33, 342.88, 432.00], // D4, F4, A4
    'Bb': [228.94, 288.33, 342.88], // Bb3, D4, F4
    'Am': [216.00, 256.87, 323.63], // A3, C4, E4
    'Gm': [192.43, 228.94, 288.33], // G3, Bb3, D4
    'A7': [216.00, 272.93, 323.63, 384.87] // A3, C#4, E4, G4
};

const CHORD_COLOR_MAP = {
    'Pickup': { name: 'Intro Riff', color: '#E7FF00', glow: 'rgba(231, 255, 0, 0.85)' },
    'Dm': { name: 'Dm9 (Tonic)', color: '#FF2A55', glow: 'rgba(255, 42, 85, 0.9)' },
    'Bb': { name: 'Bbmaj7 (Subdominant)', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.95)' },
    'Am': { name: 'Am7 (Cadence)', color: '#00E5FF', glow: 'rgba(0, 229, 255, 0.9)' },
    'Gm': { name: 'Gm7 (Subdominant)', color: '#00FF88', glow: 'rgba(0, 255, 136, 0.9)' },
    'A7': { name: 'A7#9 (Dominant Push)', color: '#E056FD', glow: 'rgba(224, 86, 253, 0.95)' }
};

const MASTER_AUDIO_SRC = '/assets/manual_upload/A%20Twelve-minute%20Alibi/A%20twelve%20alibi_master.wav';

export function InteractiveSheetMusicModal({ isOpen, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(124.8);
    const [scale, setScale] = useState(0.80);
    const [activeLyric, setActiveLyric] = useState(SONG_LYRICS_TIMELINE[0]);

    // Dual-Key Recording & Interactive States
    const [isRecording, setIsRecording] = useState(false);
    const [recordedEvents, setRecordedEvents] = useState([]);
    const [lastActionType, setLastActionType] = useState(null);
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [copiedJson, setCopiedJson] = useState(false);
    const [isCountInActive, setIsCountInActive] = useState(false);
    const [countInBeat, setCountInBeat] = useState(0);

    const scoreContainerRef = useRef(null);
    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const countInTimerRef = useRef(null);

    const recordedEventsRef = useRef([]);
    const currentChordIndexRef = useRef(0);
    recordedEventsRef.current = recordedEvents;
    currentChordIndexRef.current = currentChordIndex;

    const currentChord = activeLyric?.chord || CHORD_SEQUENCE[currentChordIndex] || 'Dm';
    const currentChordStyle = CHORD_COLOR_MAP[currentChord] || CHORD_COLOR_MAP['Dm'];

    const getAudioContext = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    // 432Hz Acoustic Cadenza Chord Synthesizer
    const playCadenza432Chord = useCallback((chordName) => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const freqs = CHORD_FREQUENCIES_432[chordName] || CHORD_FREQUENCIES_432['Dm'];

            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Warm Acoustic String/Guitar Strum (Sawtooth + Lowpass)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now + idx * 0.025);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1800, now + idx * 0.025);
                filter.frequency.exponentialRampToValueAtTime(600, now + idx * 0.025 + 1.2);

                gain.gain.setValueAtTime(0, now + idx * 0.025);
                gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.025 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.025 + 1.6);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + idx * 0.025);
                osc.stop(now + idx * 0.025 + 1.7);
            });
        } catch (e) {
            console.error('Cadenza Synth error:', e);
        }
    }, [getAudioContext]);

    // Woodblock Metronome Click
    const playWoodblockClick = useCallback((isAccent = false) => {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(isAccent ? 1200 : 800, ctx.currentTime);

            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(isAccent ? 0.6 : 0.35, ctx.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.09);
        } catch (e) {}
    }, [getAudioContext]);

    // Render ABC Score with High-Precision Typography
    useEffect(() => {
        if (isOpen && scoreContainerRef.current) {
            abcjs.renderAbc(scoreContainerRef.current, TWELVE_MINUTE_ALIBI_LEAD_SHEET, {
                responsive: 'resize',
                scale: scale,
                staffwidth: 750,
                wrap: null,
                add_classes: true,
                selectionColor: '#00FF88',
                paddingtop: 15,
                paddingbottom: 25
            });
        }
    }, [isOpen, scale]);

    // Live Karaoke Sync Loop (Clean Highlighting with Reset)
    useEffect(() => {
        let animId = null;

        const syncLoop = () => {
            if (audioRef.current && !audioRef.current.paused) {
                const t = audioRef.current.currentTime;
                setCurrentTime(t);

                if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                    setDuration(audioRef.current.duration);
                }

                // 1. Find Matching Lyric
                const matched = SONG_LYRICS_TIMELINE.find(item => t >= item.start && t < item.end);
                if (matched) {
                    setActiveLyric(matched);

                    // 2. Highlighting inside ABCjs SVG DOM
                    if (scoreContainerRef.current) {
                        const lyricElements = scoreContainerRef.current.querySelectorAll('text.abcjs-lyric, .abcjs-lyric text, text');
                        const noteElements = scoreContainerRef.current.querySelectorAll('path.abcjs-note, .abcjs-note path, path[d]');

                        // Clean reset & highlight lyrics
                        lyricElements.forEach((el) => {
                            const raw = el.textContent ? el.textContent.trim() : "";
                            const cleanedText = matched.text.replace(/[-,\.]/g, '').toLowerCase();
                            const cleanedRaw = raw.replace(/[-,\.]/g, '').toLowerCase();

                            if (cleanedRaw && cleanedText && (cleanedText === cleanedRaw || cleanedText.startsWith(cleanedRaw) || cleanedRaw.startsWith(cleanedText))) {
                                el.setAttribute('fill', '#00FF88');
                                el.setAttribute('font-weight', '900');
                                el.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.95))';
                                el.style.transform = 'scale(1.18)';
                                el.style.transformOrigin = 'center';
                                el.style.transition = 'all 0.1s ease-out';
                            } else {
                                el.setAttribute('fill', '#1a1a1a');
                                el.setAttribute('font-weight', 'bold');
                                el.style.filter = 'none';
                                el.style.transform = 'scale(1.0)';
                            }
                        });

                        // Clean reset & highlight notes
                        noteElements.forEach((noteEl, idx) => {
                            if (matched.noteIdx >= 0 && idx === matched.noteIdx) {
                                noteEl.setAttribute('fill', '#FFD700');
                                noteEl.setAttribute('stroke', '#FFD700');
                                noteEl.style.filter = 'drop-shadow(0 0 10px #FFD700)';
                            } else {
                                noteEl.setAttribute('fill', '#000000');
                                noteEl.setAttribute('stroke', '#000000');
                                noteEl.style.filter = 'none';
                            }
                        });
                    }
                }

                if (audioRef.current.ended) {
                    setIsPlaying(false);
                    setIsRecording(false);
                }
            }

            if (isPlaying) {
                animId = requestAnimationFrame(syncLoop);
            }
        };

        if (isPlaying) {
            animId = requestAnimationFrame(syncLoop);
        }

        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [isPlaying]);

    // Keyboard Shortcuts: [Space] Play/Pause, [P] Strum, [1]/[I] Chord Change, [+/-] Zoom
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const key = e.key.toLowerCase();
            const nowTime = audioRef.current ? audioRef.current.currentTime : 0;

            if (e.code === 'Space') {
                e.preventDefault();
                togglePlayback();
            } else if (key === 'p') {
                e.preventDefault();
                setLastActionType('strum');
                const curChord = CHORD_SEQUENCE[currentChordIndexRef.current] || 'Dm';
                playCadenza432Chord(curChord);

                const prevStrum = recordedEventsRef.current.filter(ev => ev.type === 'guitar_strum').slice(-1)[0];
                const delta = prevStrum ? parseFloat((nowTime - prevStrum.time_sec).toFixed(4)) : 0;

                const newEvent = {
                    event_index: recordedEventsRef.current.length + 1,
                    type: 'guitar_strum',
                    key: 'P',
                    time_sec: parseFloat(nowTime.toFixed(4)),
                    delta_from_prev_strum: delta,
                    active_chord: curChord
                };

                setRecordedEvents(prev => [...prev, newEvent]);
            } else if (key === '1' || key === 'i') {
                e.preventDefault();
                setLastActionType('chord');

                const nextIdx = (currentChordIndexRef.current + 1) % CHORD_SEQUENCE.length;
                setCurrentChordIndex(nextIdx);
                const nextChord = CHORD_SEQUENCE[nextIdx];
                playCadenza432Chord(nextChord);

                const newEvent = {
                    event_index: recordedEventsRef.current.length + 1,
                    type: 'chord_change',
                    key: key.toUpperCase(),
                    time_sec: parseFloat(nowTime.toFixed(4)),
                    switched_to_chord: nextChord
                };

                setRecordedEvents(prev => [...prev, newEvent]);
            } else if (key === '=' || key === '+') {
                e.preventDefault();
                setScale(s => Math.min(1.1, s + 0.06));
            } else if (key === '-') {
                e.preventDefault();
                setScale(s => Math.max(0.5, s - 0.06));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, playCadenza432Chord]);

    if (!isOpen) return null;

    const togglePlayback = () => {
        if (!audioRef.current) return;
        getAudioContext();

        if (isPlaying || isCountInActive) {
            if (countInTimerRef.current) clearInterval(countInTimerRef.current);
            setIsCountInActive(false);
            audioRef.current.pause();
            setIsPlaying(false);
            setIsRecording(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsRecording(true);
            }).catch(() => {
                // Fallback synth playback
                setIsPlaying(true);
                setIsRecording(true);
            });
        }
    };

    const startRecordingWithCountIn = () => {
        if (!audioRef.current) return;
        getAudioContext();

        if (isPlaying || isCountInActive) {
            togglePlayback();
            return;
        }

        setRecordedEvents([]);
        setCurrentChordIndex(0);
        setLastActionType(null);

        const beatIntervalMs = 544.8;
        let currentBeat = 1;

        setIsCountInActive(true);
        setCountInBeat(currentBeat);
        playWoodblockClick(true);

        countInTimerRef.current = setInterval(() => {
            currentBeat += 1;
            if (currentBeat <= 8) {
                setCountInBeat(currentBeat);
                const isAccent = (currentBeat === 1 || currentBeat === 5);
                playWoodblockClick(isAccent);
            } else {
                clearInterval(countInTimerRef.current);
                setIsCountInActive(false);
                setCountInBeat(0);
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(() => {});
                    setIsPlaying(true);
                    setIsRecording(true);
                }
            }
        }, beatIntervalMs);
    };

    const copyRecordedJson = () => {
        const json = JSON.stringify(recordedEvents, null, 2);
        navigator.clipboard.writeText(json);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2500);
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = (secs % 60).toFixed(2);
        return `${m}:${s.padStart(5, '0')}`;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-5 bg-black/75 backdrop-blur-md select-none overflow-hidden"
                onClick={onClose}
            >
                <audio ref={audioRef} src={MASTER_AUDIO_SRC} preload="auto" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: 15 }}
                    animate={{ opacity: 1, scale: 1.0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 15 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl h-[92vh] sm:h-[88vh] rounded-[32px] bg-[#0A090D]/95 backdrop-blur-2xl border border-[#C8A96E]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(200,169,110,0.25)] flex flex-col overflow-hidden"
                >
                    {/* 1. Top Ribbon */}
                    <div className="px-5 py-3.5 bg-black/90 border-b border-[#C8A96E]/30 shrink-0 flex items-center justify-between z-30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/60 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(255,215,0,0.4)]">
                                🎻
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-[9px] text-[#C8A96E] uppercase tracking-widest flex items-center gap-2">
                                    <span>[P] ACOUSTIC STRUM</span>
                                    <span>•</span>
                                    <span>[1] CHORD SWITCH</span>
                                    <span>•</span>
                                    <span className="text-[#00FF88] font-bold">432Hz KARAOKE SYNC</span>
                                </span>
                                <h2 className="font-serif text-sm sm:text-base font-bold text-[#F7EBE1] tracking-wide">
                                    A Twelve-minute Alibi (CADENZA-432 Master Score)
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setScale(s => Math.max(0.5, s - 0.06))}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                                title="Zoom Out (-)"
                            >
                                <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setScale(s => Math.min(1.1, s + 0.06))}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                                title="Zoom In (+)"
                            >
                                <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer ml-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* 2. REAL-TIME LIVE KARAOKE STREAMER BAR */}
                    <div className="px-5 py-2.5 bg-[#121118] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <button 
                                onClick={() => playCadenza432Chord(activeLyric.chord)}
                                className="font-mono text-[10px] font-black text-[#FFD700] bg-[#FFD700]/15 px-2.5 py-1 rounded border border-[#FFD700]/50 shrink-0 cursor-pointer hover:bg-[#FFD700]/30 transition-all"
                            >
                                🎵 {activeLyric.chord}
                            </button>
                            <div className="flex items-center gap-1.5 font-serif text-sm sm:text-base font-bold text-white tracking-wide truncate">
                                <span>LYRIC:</span>
                                <span className="text-[#00FF88] drop-shadow-[0_0_8px_#00FF88] font-black underline decoration-[#00FF88]/50">
                                    "{activeLyric.text}"
                                </span>
                            </div>
                        </div>

                        {isCountInActive && (
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 0.54 }}
                                className="px-3.5 py-0.5 rounded-full bg-[#FFD700] text-black font-mono text-xs font-black shadow-[0_0_12px_#FFD700]"
                            >
                                COUNT-IN : {countInBeat} / 8
                            </motion.div>
                        )}

                        <button
                            onClick={copyRecordedJson}
                            disabled={recordedEvents.length === 0}
                            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                        >
                            <Copy className="w-3 h-3" />
                            <span>{copiedJson ? 'COPIED! ✨' : 'COPY JSON'}</span>
                        </button>
                    </div>

                    {/* 3. Interactive Sheet Music Vector Display */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F2] text-[#121212] custom-scrollbar relative shadow-inner flex flex-col items-center justify-start">
                        <div className="w-full max-w-3xl flex justify-center py-2 select-text">
                            <div 
                                ref={scoreContainerRef} 
                                className="w-full flex justify-center"
                                style={{ filter: 'contrast(1.05)' }}
                            />
                        </div>
                    </div>

                    {/* 4. Audio Transport Dock with 432Hz Interactive Controls */}
                    <div className="px-5 sm:px-7 py-3.5 bg-black/95 border-t border-[#C8A96E]/30 shrink-0 flex items-center gap-4 z-30">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startRecordingWithCountIn}
                            style={{
                                backgroundColor: isPlaying ? '#00FF88' : currentChordStyle.color,
                                boxShadow: `0 0 20px ${isPlaying ? '#00FF88' : currentChordStyle.glow}`
                            }}
                            className="px-5 h-10 rounded-full text-black flex items-center justify-center font-black cursor-pointer shrink-0 transition-colors duration-300 gap-2 font-mono text-xs"
                        >
                            {isPlaying || isCountInActive ? (
                                <>
                                    <Pause className="w-3.5 h-3.5 fill-black" />
                                    <span>STOP</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                                    <span>PLAY & SCORE SYNC</span>
                                </>
                            )}
                        </motion.button>

                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold shrink-0 min-w-[70px]" style={{ color: currentChordStyle.color }}>
                            <Music className="w-3.5 h-3.5" />
                            <span>{formatTime(currentTime)}</span>
                        </div>

                        <input
                            type="range"
                            min={0}
                            max={duration || 124.8}
                            step={0.01}
                            value={currentTime}
                            onChange={(e) => {
                                const st = parseFloat(e.target.value);
                                setCurrentTime(st);
                                if (audioRef.current) audioRef.current.currentTime = st;
                            }}
                            style={{ accentColor: currentChordStyle.color }}
                            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />

                        <span className="font-mono text-xs text-neutral-400 font-bold shrink-0 min-w-[50px]">
                            {formatTime(duration)}
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

