import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideChevronRight } from 'lucide-react';
import { callGemini } from '../services/aiService';

const ConductorChatView = ({ apiKey, onComplete }) => {
    const [step, setStep] = useState('input'); // input, loading, reply
    const [name, setName] = useState('');
    const [typedText, setTypedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [aiReply, setAiReply] = useState('');
    
    const warmupAudioRef = useRef(null);

    // Play low volume mechanical tick sound for typewriter
    const playTickSound = () => {
        try {
            const tick = new Audio('/assets/sounds/sfx_5_clockwork_tick.mp3');
            tick.volume = 0.08;
            tick.play().catch(() => {});
        } catch (e) {}
    };

    // Play portal transition sound when leaving
    const playTransitionSound = () => {
        try {
            const sfx = new Audio('/assets/sounds/portal-transition.mp3');
            sfx.volume = 0.5;
            sfx.play().catch(() => {});
        } catch (e) {}
    };

    // Start theater warmup/tuning audio in the background on mount
    useEffect(() => {
        try {
            const audio = new Audio('/assets/sounds/tune_orchestra_warmup1.mp3');
            audio.volume = 0.15;
            audio.loop = true;
            audio.play().catch(() => {});
            warmupAudioRef.current = audio;
        } catch (e) {}

        return () => {
            if (warmupAudioRef.current) {
                // Fade out warmup music slowly
                const audio = warmupAudioRef.current;
                const fade = setInterval(() => {
                    if (audio.volume > 0.02) {
                        audio.volume -= 0.02;
                    } else {
                        audio.volume = 0;
                        audio.pause();
                        clearInterval(fade);
                    }
                }, 50);
            }
        };
    }, []);

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const userName = name.trim();
        setStep('loading');

        // Setup fallback reply
        const firstLetter = userName[0] ? userName[0].toUpperCase() : 'N';
        const fallbackReply = `M... ${firstLetter}... what was it again? No matter. Let's proceed!`;

        const systemPrompt = `You are the 'Aether Guide' (the mysterious girl from the music video), an elegant, poetic steampunk entity in a multiversal opera. 
The guest just entered their name: "${userName}". 
Write a very short, lighthearted, polite, or friendly joke or positive comment about their name in English. 
For example, if their name is "Sean", you could say: "Ah, Sean! A name sharing frequencies with the American Shawn—a close friend of mine in the mechanical archives. A truly resonance-tuned name."
Keep your response under 2 sentences (maximum 25 words). Do not include any greeting or introduction. Start directly with the name comment.`;

        try {
            if (!apiKey) {
                // Offline fallback after 1.5 seconds
                setTimeout(() => {
                    setAiReply(fallbackReply);
                    setStep('reply');
                }, 1500);
                return;
            }

            const response = await callGemini({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `My name is ${userName}.` }]
                    }
                ],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                }
            }, apiKey);

            const replyText = response.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText && replyText.trim()) {
                setAiReply(replyText.trim());
            } else {
                setAiReply(fallbackReply);
            }
            setStep('reply');
        } catch (error) {
            console.error("Gemini Guide Chat Error", error);
            setAiReply(fallbackReply);
            setStep('reply');
        }
    };

    // Typewriter effect for the AI reply
    useEffect(() => {
        if (step !== 'reply' || !aiReply) return;

        let currentText = '';
        let index = 0;

        const interval = setInterval(() => {
            if (index < aiReply.length) {
                currentText += aiReply[index];
                
                // Play tick sound every few letters
                if (index % 2 === 0) {
                    playTickSound();
                }

                setTypedText(currentText);
                index++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [step, aiReply]);

    const handleScreenClick = () => {
        if (step !== 'reply' || !isComplete) return;
        playTransitionSound();
        onComplete();
    };

    // Trigger synthetic bouncer voice if Web Speech API is supported
    useEffect(() => {
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance("IDs out, everyone! Name and ID!");
                utterance.pitch = 0.5; // Low pitch for intimidating bouncer voice
                utterance.rate = 0.85; // Slightly slower pacing
                utterance.volume = 0.8;
                window.speechSynthesis.speak(utterance);
            } catch (e) {}
        }
    }, []);

    return (
        <div 
            onClick={handleScreenClick}
            className={`w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black select-none ${step === 'reply' && isComplete ? 'cursor-pointer' : ''}`}
        >
            {/* 1st Person POV Background (Video or 4K Sample Image) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover z-0 hidden"
                    onError={(e) => { e.target.style.display = 'none'; }}
                >
                    <source src="/assets/manual_upload/club_entrance_1st_person.mp4" type="video/mp4" />
                </video>
                <motion.img
                    src="/assets/manual_upload/club_gate_1st_person.jpg"
                    alt="Club Gate Entrance POV"
                    initial={{ scale: 1.0 }}
                    animate={{ scale: [1.0, 1.05, 1.0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
            </div>

            {/* Guard Voice Subtitle HUD */}
            <div className="relative z-20 mb-8 flex flex-col items-center text-center gap-1.5 bg-black/50 border border-[#C5A059]/30 px-5 py-3 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-2 text-[#C5A059] text-[9px] font-sans font-black uppercase tracking-[0.25em]">
                    <span className="animate-pulse">🔊</span>
                    <span>[ GATEKEEPER ]</span>
                </div>
                <p className="text-xs md:text-sm font-serif text-[#FDFCF0] italic tracking-wider drop-shadow-md">
                    "IDs out, everyone! Name and ID!!"
                </p>
            </div>

            {/* Ultra-Minimalist Floating Container (No welcome text) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-20 w-full max-w-[340px]"
                onClick={(e) => {
                    if (step !== 'reply' || !isComplete) {
                        e.stopPropagation();
                    }
                }}
            >
                <AnimatePresence mode="wait">
                    {step === 'input' && (
                        /* Minimalist Name Input Only */
                        <motion.form
                            key="input-stage"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleNameSubmit}
                            className="flex flex-col gap-4 w-full"
                        >
                            <input
                                type="text"
                                maxLength={20}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ENTER YOUR NAME..."
                                autoFocus
                                className="w-full bg-[#0a0c12]/75 border border-[#C5A059]/40 hover:border-[#C5A059]/70 focus:border-[#C5A059] focus:outline-none rounded-xl px-5 py-4 text-[13px] text-[#FDFCF0] font-serif tracking-[0.2em] placeholder-white/30 transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.8)] text-center uppercase backdrop-blur-xl"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={!name.trim()}
                                className="py-3.5 bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/40 to-[#C5A059]/20 border border-[#C5A059]/60 rounded-xl font-sans text-[10px] font-black tracking-[0.25em] text-[#FDFCF0] uppercase hover:bg-[#C5A059]/50 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-lg backdrop-blur-md"
                            >
                                <span>INSCRIBE & ENTER</span>
                                <LucideChevronRight size={12} />
                            </motion.button>
                        </motion.form>
                    )}

                    {step === 'loading' && (
                        <motion.div
                            key="loading-stage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center py-6 p-6 bg-[#0a0c12]/80 border border-[#C5A059]/30 rounded-2xl backdrop-blur-xl gap-4 shadow-2xl"
                        >
                            <p className="font-serif text-[#C5A059] text-[13px] tracking-wide text-center">
                                Inscribing name to the clockwork heart...
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '150ms', margin: '0 2px' }} />
                                <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}

                    {step === 'reply' && (
                        <motion.div
                            key="reply-stage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center p-6 bg-[#0a0c12]/85 border border-[#C5A059]/40 rounded-2xl backdrop-blur-xl gap-4 shadow-2xl"
                        >
                            <p className="font-serif text-[#f5e6b8] text-[14px] leading-relaxed tracking-wider drop-shadow-[0_0_8px_rgba(245,230,184,0.15)] text-center whitespace-pre-line w-full">
                                {typedText}
                                {!isComplete && (
                                    <span className="inline-block w-1.5 h-3.5 bg-[#f5e6b8] ml-1 animate-pulse" />
                                )}
                            </p>

                            {isComplete && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                    className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059]/80 mt-2 block text-center"
                                >
                                    [ Click anywhere to enter ]
                                </motion.span>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ConductorChatView;
