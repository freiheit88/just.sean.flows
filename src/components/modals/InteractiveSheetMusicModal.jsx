import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Music, ZoomIn, ZoomOut, Sparkles, Copy, Radio, Volume2 } from 'lucide-react';
import abcjs from 'abcjs';

// SEAN'S CALIBRATED 110.13 BPM LEAD SHEET (L: 1/16)
const TWELVE_MINUTE_ALIBI_LEAD_SHEET = `
X: 1
T: A Twelve-minute Alibi (CADENZA-432 Live Karaoke Sync)
C: Just Sean Flows (A = 432Hz • 110.13 BPM)
M: 4/4
L: 1/16
Q: 1/4=110
K: Dm
%%stretchlast 0
%%scale 0.68
%%staffwidth 770
%%topspace 10
%%titlespace 8
%%wordsfont Helvetica-Bold 13
%%gchordfont Helvetica-Bold 14
E2 F2 | "Dm" F2 G2 E2 A4 G2 F1 E1 | "Dm" D16 | "Bb" D2 C2 C2 D4 D#2 D#2 | "Am" A,8 z8 |
w: When the | Frank-furt freeze is how-ling, | ling, | And the surge pri-cing breaks your | heart.
"Gm" F2 F2 G2 F1 E1 E4 | "A7" A4 A2 G2 A4 | "Dm" D2 E2 E2 F2 D2 D2 | "Dm" C2 D2 C2 A,8 |]
w: You're hud-dled by the con-crete, | Swa-llowed in my | hea-vy lea-ther ja-cket, | ja-cket.
`;

// Exact Syllable & Note Millisecond Sync Map
const SONG_LYRICS_TIMELINE = [
    { start: 0.00, end: 1.85, text: "[Intro Guitar Riff]", noteIdx: -1, chord: "Dm" },
    { start: 1.85, end: 2.30, text: "When", noteIdx: 0, chord: "Dm" },
    { start: 2.30, end: 2.85, text: "the", noteIdx: 1, chord: "Dm" },
    { start: 2.85, end: 3.45, text: "Frank-", noteIdx: 2, chord: "Dm" },
    { start: 3.45, end: 3.90, text: "furt", noteIdx: 3, chord: "Dm" },
    { start: 3.90, end: 4.40, text: "freeze", noteIdx: 4, chord: "Dm" },
    { start: 4.40, end: 4.80, text: "is", noteIdx: 5, chord: "Dm" },
    { start: 4.80, end: 5.40, text: "how-", noteIdx: 6, chord: "Dm" },
    { start: 5.40, end: 6.20, text: "ling,", noteIdx: 7, chord: "Dm" },
    { start: 6.20, end: 7.20, text: "ling,", noteIdx: 8, chord: "Dm" },
    { start: 7.20, end: 7.60, text: "And", noteIdx: 9, chord: "Bb" },
    { start: 7.60, end: 8.00, text: "the", noteIdx: 10, chord: "Bb" },
    { start: 8.00, end: 8.45, text: "surge", noteIdx: 11, chord: "Bb" },
    { start: 8.45, end: 8.90, text: "pri-", noteIdx: 12, chord: "Bb" },
    { start: 8.90, end: 9.35, text: "cing", noteIdx: 13, chord: "Bb" },
    { start: 9.35, end: 9.90, text: "breaks", noteIdx: 14, chord: "Bb" },
    { start: 9.90, end: 10.40, text: "your", noteIdx: 15, chord: "Bb" },
    { start: 10.40, end: 11.50, text: "heart.", noteIdx: 16, chord: "Am" },
    { start: 11.50, end: 12.00, text: "You're", noteIdx: 17, chord: "Gm" },
    { start: 12.00, end: 12.50, text: "hud-", noteIdx: 18, chord: "Gm" },
    { start: 12.50, end: 12.90, text: "dled", noteIdx: 19, chord: "Gm" },
    { start: 12.90, end: 13.30, text: "by", noteIdx: 20, chord: "Gm" },
    { start: 13.30, end: 13.75, text: "the", noteIdx: 21, chord: "Gm" },
    { start: 13.75, end: 14.30, text: "con-", noteIdx: 22, chord: "Gm" },
    { start: 14.30, end: 15.00, text: "crete,", noteIdx: 23, chord: "Gm" },
    { start: 15.00, end: 15.55, text: "Swa-", noteIdx: 24, chord: "A7" },
    { start: 15.55, end: 16.10, text: "llowed", noteIdx: 25, chord: "A7" },
    { start: 16.10, end: 16.50, text: "in", noteIdx: 26, chord: "A7" },
    { start: 16.50, end: 17.00, text: "my", noteIdx: 27, chord: "A7" },
    { start: 17.00, end: 17.50, text: "hea-", noteIdx: 28, chord: "Dm" },
    { start: 17.50, end: 18.00, text: "vy", noteIdx: 29, chord: "Dm" },
    { start: 18.00, end: 18.50, text: "lea-", noteIdx: 30, chord: "Dm" },
    { start: 18.50, end: 19.00, text: "ther", noteIdx: 31, chord: "Dm" },
    { start: 19.00, end: 19.60, text: "ja-", noteIdx: 32, chord: "Dm" },
    { start: 19.60, end: 20.30, text: "cket,", noteIdx: 33, chord: "Dm" },
    { start: 20.30, end: 22.00, text: "ja-cket.", noteIdx: 34, chord: "Dm" }
];

const CHORD_SEQUENCE = ['Dm', 'Bb', 'Am', 'Gm', 'A7', 'Dm'];

const CHORD_COLOR_MAP = {
    'Pickup': { name: 'Intro Riff', color: '#E7FF00', glow: 'rgba(231, 255, 0, 0.85)' },
    'Dm': { name: 'Dm9 (Tonic)', color: '#FF2A55', glow: 'rgba(255, 42, 85, 0.9)' },
    'Bb': { name: 'Bbmaj7 (Subdominant)', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.95)' },
    'Am': { name: 'Am7 (Cadence)', color: '#00E5FF', glow: 'rgba(0, 229, 255, 0.9)' },
    'Gm': { name: 'Gm7 (Subdominant)', color: '#00FF88', glow: 'rgba(0, 255, 136, 0.9)' },
    'A7': { name: 'A7#9 (Dominant Push)', color: '#E056FD', glow: 'rgba(224, 86, 253, 0.95)' }
};

const MASTER_AUDIO_SRC = '/assets/manual_upload/A Twelve-minute Alibi/A twelve alibi_master.wav';

export function InteractiveSheetMusicModal({ isOpen, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(124.8);
    const [scale, setScale] = useState(0.68);
    const [activeLyric, setActiveLyric] = useState(SONG_LYRICS_TIMELINE[0]);

    // Dual-Key Recording States
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

    const currentChord = CHORD_SEQUENCE[currentChordIndex] || 'Dm';
    const currentChordStyle = CHORD_COLOR_MAP[currentChord] || CHORD_COLOR_MAP['Dm'];

    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const playWoodblockClick = (isAccent = false) => {
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
        } catch (e) {
            console.log('Metronome click error:', e);
        }
    };

    // Render ABC Score
    useEffect(() => {
        if (isOpen && scoreContainerRef.current) {
            abcjs.renderAbc(scoreContainerRef.current, TWELVE_MINUTE_ALIBI_LEAD_SHEET, {
                responsive: 'resize',
                scale: scale,
                staffwidth: 770,
                wrap: null,
                add_classes: true,
                selectionColor: '#00FF88'
            });
        }
    }, [isOpen, scale]);

    // REAL-TIME KARAOKE LYRIC & NOTE SYNC HIGHLIGHT LOOP
    useEffect(() => {
        let animId = null;

        const syncLoop = () => {
            if (audioRef.current && !audioRef.current.paused) {
                const t = audioRef.current.currentTime;
                setCurrentTime(t);

                if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                    setDuration(audioRef.current.duration);
                }

                // 1. Find Matching Lyric Syllable
                const matched = SONG_LYRICS_TIMELINE.find(item => t >= item.start && t < item.end);
                if (matched) {
                    setActiveLyric(matched);

                    // 2. Highlighting inside ABCjs SVG DOM
                    if (scoreContainerRef.current) {
                        const lyricElements = scoreContainerRef.current.querySelectorAll('text.abcjs-lyric, .abcjs-lyric text, text');
                        const noteElements = scoreContainerRef.current.querySelectorAll('path.abcjs-note, .abcjs-note path, .abcjs-note');

                        // Highlight active lyric text
                        lyricElements.forEach((el) => {
                            const raw = el.textContent ? el.textContent.trim() : "";
                            const cleanedText = matched.text.replace(/[-,\.]/g, '').toLowerCase();
                            const cleanedRaw = raw.replace(/[-,\.]/g, '').toLowerCase();

                            if (cleanedRaw && (cleanedText.includes(cleanedRaw) || cleanedRaw.includes(cleanedText))) {
                                el.setAttribute('fill', '#00B855');
                                el.setAttribute('font-weight', '900');
                                el.style.filter = 'drop-shadow(0 0 6px rgba(0, 184, 85, 0.9))';
                                el.style.transform = 'scale(1.12)';
                                el.style.transformOrigin = 'center';
                                el.style.transition = 'all 0.15s ease-out';
                            } else if (el.classList.contains('abcjs-lyric')) {
                                el.setAttribute('fill', '#1a1a1a');
                                el.setAttribute('font-weight', 'bold');
                                el.style.filter = 'none';
                                el.style.transform = 'scale(1.0)';
                            }
                        });

                        // Highlight active note
                        if (matched.noteIdx >= 0 && noteElements[matched.noteIdx]) {
                            const activeNoteEl = noteElements[matched.noteIdx];
                            activeNoteEl.setAttribute('fill', '#E7FF00');
                            activeNoteEl.setAttribute('stroke', '#E7FF00');
                            activeNoteEl.style.filter = 'drop-shadow(0 0 10px #E7FF00)';
                        }
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

    // Global Keydown Handler: 'p'/'P' for Guitar Strum, 'i'/'I' for Chord Change
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const key = e.key.toLowerCase();
            const nowTime = audioRef.current ? audioRef.current.currentTime : 0;

            if (key === 'p') {
                e.preventDefault();
                setLastActionType('strum');

                const prevStrum = recordedEventsRef.current.filter(ev => ev.type === 'guitar_strum').slice(-1)[0];
                const delta = prevStrum ? parseFloat((nowTime - prevStrum.time_sec).toFixed(4)) : 0;

                const newEvent = {
                    event_index: recordedEventsRef.current.length + 1,
                    type: 'guitar_strum',
                    key: 'P',
                    time_sec: parseFloat(nowTime.toFixed(4)),
                    delta_from_prev_strum: delta,
                    active_chord: CHORD_SEQUENCE[currentChordIndexRef.current] || 'Dm'
                };

                setRecordedEvents(prev => [...prev, newEvent]);
            } else if (key === 'i') {
                e.preventDefault();
                setLastActionType('chord');

                const nextIdx = (currentChordIndexRef.current + 1) % CHORD_SEQUENCE.length;
                setCurrentChordIndex(nextIdx);

                const newEvent = {
                    event_index: recordedEventsRef.current.length + 1,
                    type: 'chord_change',
                    key: 'I',
                    time_sec: parseFloat(nowTime.toFixed(4)),
                    switched_to_chord: CHORD_SEQUENCE[nextIdx]
                };

                setRecordedEvents(prev => [...prev, newEvent]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    const startRecordingWithCountIn = () => {
        if (!audioRef.current) return;
        getAudioContext();

        if (isPlaying || isCountInActive) {
            if (countInTimerRef.current) clearInterval(countInTimerRef.current);
            setIsCountInActive(false);
            audioRef.current.pause();
            setIsPlaying(false);
            setIsRecording(false);
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
                    audioRef.current.play();
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
                className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-5 bg-black/60 backdrop-blur-md select-none overflow-hidden"
                onClick={onClose}
            >
                <audio ref={audioRef} src={MASTER_AUDIO_SRC} preload="auto" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: 15 }}
                    animate={{ opacity: 1, scale: 1.0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 15 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl h-[92vh] sm:h-[88vh] rounded-[32px] bg-black/85 backdrop-blur-2xl border border-[#C8A96E]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(200,169,110,0.25)] flex flex-col overflow-hidden"
                >
                    {/* 1. Haute Couture Top Ribbon */}
                    <div className="px-5 py-3.5 bg-black/90 border-b border-[#C8A96E]/30 shrink-0 flex items-center justify-between z-30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/60 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(231,255,0,0.4)]">
                                🎸
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-[9px] text-[#C8A96E] uppercase tracking-widest flex items-center gap-2">
                                    <span>[P] GUITAR STRUM</span>
                                    <span>•</span>
                                    <span>[I] CHORD CHANGE</span>
                                    <span>•</span>
                                    <span className="text-[#00FF88] font-bold">LIVE KARAOKE SYNC</span>
                                </span>
                                <h2 className="font-serif text-sm sm:text-base font-bold text-[#F7EBE1] tracking-wide">
                                    A Twelve-minute Alibi (CADENZA-432 Dual-Key Live Score)
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setScale(s => Math.max(0.48, s - 0.06))}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setScale(s => Math.min(1.0, s + 0.06))}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                                title="Zoom In"
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
                    <div className="px-5 py-2.5 bg-[#0C0B0E] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-mono text-[10px] font-black text-[#E7FF00] bg-[#E7FF00]/10 px-2 py-0.5 rounded border border-[#E7FF00]/40 shrink-0">
                                🎵 {activeLyric.chord}
                            </span>
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
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#FDFCF7] text-[#121212] custom-scrollbar relative shadow-inner flex flex-col items-center justify-center">
                        <div className="w-full flex justify-center py-1 select-text">
                            <div 
                                ref={scoreContainerRef} 
                                className="w-full flex justify-center"
                                style={{ filter: 'contrast(1.08)' }}
                            />
                        </div>
                    </div>

                    {/* 4. Audio Transport Dock with Dual-Key Recording Button */}
                    <div className="px-5 sm:px-7 py-3.5 bg-black/90 border-t border-[#C8A96E]/30 shrink-0 flex items-center gap-4 z-30">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startRecordingWithCountIn}
                            style={{
                                backgroundColor: isRecording ? '#00FF88' : currentChordStyle.color,
                                boxShadow: `0 0 20px ${isRecording ? '#00FF88' : currentChordStyle.glow}`
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
                                    <span>PLAY & KARAOKE SYNC</span>
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
                        >
                        </input>

                        <span className="font-mono text-xs text-neutral-400 font-bold shrink-0 min-w-[50px]">
                            {formatTime(duration)}
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
