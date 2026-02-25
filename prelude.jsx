import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideCheckCircle, LucideGlobe, LucideInstagram,
    LucideSparkles, LucideInfo, LucideVolume2,
    LucideLoader2, LucideChevronLeft,
    LucideTrophy, LucideLayout, LucideMapPin,
    LucideFeather, LucideScroll, LucideCompass, LucideUser, LucideUpload,
    LucideCheckSquare, LucideSquare, LucideFlame, LucideSettings, LucideCamera, LucideZap
} from 'lucide-react';

/* [DESIGN SYSTEM]
  - Primary: #C5A059 (Brass/Gold)
  - Secondary: #5C1A1A (Dried Blood/Wine)
  - Background: #1A1612 (Ebony/Old Wood)
  - Accent: #2C241B (Polished Bronze)
  - Text: #E0D0B0 (Aged Parchment)
*/

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const LANGUAGES = [
    {
        id: 'ko',
        name: 'Korean',
        welcome: '환영합니다, 귀한 손님. 이 낡은 저택의 설계자가 당신을 기다리고 있었습니다.',
        loading: '당신의 영혼을 초상화에 담아내고 있습니다... 증기 기관의 예열에는 인내심이 필요한 법죠.',
        instrument: '가야금', flag: '🇰🇷', voice: 'Kore',
        ui: {
            confirmTitle: "설계자님, 진행하시겠습니까?",
            confirmBtn: "서약서 서명하기",
            textOptionTitle: "영혼의 이름 각인하기",
            textOptionDesc: "AI가 당신의 초상화를 학습하는 것이 꺼려지신다면, 당신을 부를 이름만 남겨주십시오.",
            textInputPlaceholder: "이름 또는 별명을 입력하세요",
            textSubmitBtn: "이름으로 운명 시작하기",
            uploadTitle: "당신의 초상화를 제출하십시오",
            generateBtn: "운명의 초상화 생성",
            generating: "각인 중...",
            galleryTitle: "기억의 갤러리",
            gallerySub: "가문의 유산과 현재",
            returnGallery: "갤러리로 돌아가기",
            manorTitle: "대저택 서재",
            manorHeirlooms: "가보",
            manorEstate: "영지",
            authTitle: "신분 증명",
            authBtn: "통행증 제시",
            authDone: "신분 확인 완료",
            casePrefix: "사건 번호",
            prophecyTitle: "예언",
            consulting: "정령들과 교신 중...",
            sealBtn: "운명 확정하기",
            reconsiderBtn: "선택 재고하기",
            fateSealed: "운명이 봉인되었습니다",
            projectInitiated: "프로젝트 가동",
            todoTitle: "오늘의 임무",
            todo1: "초상화 완성하기",
            todo2: "대저택 둘러보기",
            todo3: "운명의 사건 선택",
            todoDone: "임무 완료."
        }
    },
    {
        id: 'en',
        name: 'English',
        welcome: 'Welcome, esteemed guest. The Architect has been expecting you.',
        loading: 'Distilling your essence into the ether... The gears of fate grind slowly.',
        instrument: 'Harpsichord', flag: '🇬🇧', voice: 'Zephyr',
        ui: {
            confirmTitle: "Shall we proceed, Architect?",
            confirmBtn: "Sign the Contract",
            textOptionTitle: "Engrave Your Name",
            textOptionDesc: "If you prefer not to share your visage, simply offer your name.",
            textInputPlaceholder: "Enter your name or alias",
            textSubmitBtn: "Forge Destiny by Name",
            uploadTitle: "Present Your Portrait",
            generateBtn: "FORGE IDENTITY",
            generating: "ENGRAVING...",
            galleryTitle: "GALLERY OF MEMORIES",
            gallerySub: "Legacy & Present",
            returnGallery: "Return to Gallery",
            manorTitle: "The Study",
            manorHeirlooms: "Heirlooms",
            manorEstate: "Estate",
            authTitle: "Identification",
            authBtn: "PRESENT CREDENTIALS",
            authDone: "Credentials Verified",
            casePrefix: "CASE NO.",
            prophecyTitle: "The Prophecy",
            consulting: "Consulting spirits...",
            sealBtn: "SEAL YOUR FATE",
            reconsiderBtn: "Reconsider Choice",
            fateSealed: "Fate Sealed",
            projectInitiated: "PROJECT INITIATED",
            todoTitle: "Daily Tasks",
            todo1: "Forge Identity",
            todo2: "Inspect Manor",
            todo3: "Select Case",
            todoDone: "Duties Fulfilled."
        }
    }
];

const PROJECTS = [
    { id: 1, title: "The Automaton Survival", desc: "Surviving 24h guided only by the Machine Spirit." },
    { id: 2, title: "The Silent Builder", desc: "Constructing 3 inventions without uttering a single code." },
    { id: 3, title: "The Clockwork Servant", desc: "Forging a mechanical golem to labor in my stead." },
    { id: 4, title: "Séance with History", desc: "Interviewing great figures of the past via the Aether." },
    { id: 5, title: "The Alchemist's Coin", desc: "Surviving a week trading only in cryptographic tokens." },
    { id: 6, title: "The Virtual Voyage", desc: "Living 48 hours within the simulacrum visor." },
    { id: 7, title: "The Haunted Manor", desc: "Automating the estate to startle uninvited guests." },
    { id: 8, title: "The Calculated Feast", desc: "Dining only on what the Algorithm prescribes." },
];

// --- Sub-components ---

const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#1A1612]">
        {/* Texture Layer */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />

        {/* Animated Gears */}
        <div className="absolute -top-20 -left-20 w-80 h-80 opacity-20 rotate-45 animate-[spin_60s_linear_infinite]">
            <LucideSettings size={320} className="text-[#C5A059]" />
        </div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] opacity-10 animate-[spin_100s_linear_infinite_reverse]">
            <LucideSettings size={500} className="text-[#C5A059]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 animate-[spin_120s_linear_infinite]">
            <LucideSettings size={800} className="text-white" />
        </div>

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        {/* Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
    </div>
);

const PaperCard = ({ children, className = "", onClick, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        onClick={onClick}
        className={`relative bg-[#f4e4bc] text-[#2c241b] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-2 border-[#d4c5a3] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] overflow-hidden ${className} group`}
    >
        {/* Ornate Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8B7355] m-1 rounded-tl-sm group-hover:scale-110 transition-transform" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8B7355] m-1 rounded-tr-sm group-hover:scale-110 transition-transform" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8B7355] m-1 rounded-bl-sm group-hover:scale-110 transition-transform" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8B7355] m-1 rounded-br-sm group-hover:scale-110 transition-transform" />

        {/* Inner Decorative Border */}
        <div className="absolute inset-1 border border-[#8B7355]/20 pointer-events-none" />

        <div className="relative z-10">{children}</div>
    </motion.div>
);

const App = () => {
    const [step, setStep] = useState('language');
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [votedId, setVotedId] = useState(null);
    const [viewMode, setViewMode] = useState('gallery');
    const [previewId, setPreviewId] = useState(null);

    const [todos, setTodos] = useState({ avatar: false, home: false, voted: false });
    const [showTodo, setShowTodo] = useState(false);

    const [userAvatar, setUserAvatar] = useState(null);
    const [avatarLore, setAvatarLore] = useState("");
    const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [userName, setUserName] = useState('');

    const [candleLit, setCandleLit] = useState(true);
    const [gearsSpinning, setGearsSpinning] = useState(false);
    const [loreText, setLoreText] = useState("");
    const [oracleMessage, setOracleMessage] = useState("");

    useEffect(() => {
        if (viewMode === 'home_interior' && userAvatar?.lore) {
            let i = 0;
            setLoreText("");
            const timer = setInterval(() => {
                setLoreText(prev => prev + userAvatar.lore.charAt(i));
                i++;
                if (i >= userAvatar.lore.length) clearInterval(timer);
            }, 30);
            return () => clearInterval(timer);
        }
    }, [viewMode, userAvatar]);

    const callGemini = async (payload, endpoint = "generateContent", model = "gemini-2.5-flash-preview-09-2025") => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`;
        for (let i = 0; i < 5; i++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('API request failed');
                return await response.json();
            } catch (err) {
                if (i === 4) throw err;
                await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
            }
        }
    };

    const speakText = async (text) => {
        if (!apiKey) return;
        try {
            const prompt = `British 19th-century narrator: ${text}`;
            const response = await callGemini({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedLang.voice || "Zephyr" } } }
                }
            }, "generateContent", "gemini-2.5-flash-preview-tts");

            if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const audioData = response.candidates[0].content.parts[0].inlineData.data;
                const sampleRate = 24000;
                const wavUrl = pcmToWav(audioData, sampleRate);
                new Audio(wavUrl).play();
            }
        } catch (err) { console.error("TTS Error:", err); }
    };

    const pcmToWav = (base64, sampleRate) => {
        const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
        const view = new DataView(new ArrayBuffer(44 + buffer.byteLength));
        const writeString = (offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
        writeString(0, 'RIFF'); view.setUint32(4, 36 + buffer.byteLength, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data');
        view.setUint32(40, buffer.byteLength, true); new Uint8Array(view.buffer, 44).set(new Uint8Array(buffer));
        return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }));
    };

    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setStep('confirm');
    };

    const confirmLanguage = () => {
        setStep('intro');
        speakText(selectedLang.welcome);
        setShowTodo(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        }
    };

    const generateTextCharacter = async () => {
        if (!userName.trim()) return;
        setIsAvatarGenerating(true);
        try {
            const prompt = `Mysterious 19th-century steampunk persona for "${userName}" in ${selectedLang.name}. Max 40 words.`;
            const loreResult = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            const lore = loreResult?.candidates?.[0]?.content?.parts?.[0]?.text || `The enigmatic ${userName}.`;
            setUserAvatar({ image: null, textName: userName, lore, isTextAvatar: true });
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } catch (err) {
            setUserAvatar({ image: null, textName: userName, lore: `The enigmatic ${userName}.`, isTextAvatar: true });
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } finally {
            setIsAvatarGenerating(false);
        }
    };

    const generateCharacter = async () => {
        if (!uploadedImage) return;
        setIsAvatarGenerating(true);
        try {
            const prompt = `Steampunk persona analysis for image in ${selectedLang.name}. Max 50 words.`;
            const loreResult = await callGemini({
                contents: [{
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: "image/png", data: uploadedImage } }
                    ]
                }]
            });
            const lore = loreResult?.candidates?.[0]?.content?.parts?.[0]?.text || "...";
            setAvatarLore(lore);
            // Fallback since Imagen might be slow/unavailable
            setUserAvatar({ image: null, textName: "Architect", lore, isTextAvatar: false });
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } catch (err) {
            setUserAvatar({ image: null, textName: "Architect", lore: "...", isTextAvatar: true });
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } finally {
            setIsAvatarGenerating(false);
        }
    };

    const handlePreviewVote = async (id) => {
        if (!isAuthenticated) return;
        setPreviewId(id);
        const proj = PROJECTS.find(p => p.id === id);
        try {
            const prompt = `Mysterious victorian prophecy for path "${proj.title}" in ${selectedLang.name}. Max 30 words.`;
            const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            setOracleMessage(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
        } catch (err) { setOracleMessage("The spirits are silent."); }
    };

    // --- View Templates ---

    const LanguageView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
            {LANGUAGES.map((lang, idx) => (
                <PaperCard
                    key={lang.id}
                    delay={idx * 0.1}
                    onClick={() => handleLanguageSelect(lang)}
                    className="cursor-pointer hover:border-[#C5A059] transition-all hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(197,160,89,0.3)]"
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-7xl group-hover:scale-125 transition-transform drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]">{lang.flag}</span>
                        <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-[#8B7355] group-hover:text-[#5C1A1A] transition-colors">{lang.name}</h3>
                        <div className="w-12 h-1 bg-[#8B7355]/20" />
                    </div>
                </PaperCard>
            ))}
        </div>
    );

    const ConfirmView = () => (
        <PaperCard className="text-center max-w-lg mx-auto py-16">
            <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-8"
            >
                <LucideFeather className="w-20 h-20 mx-auto text-[#5C1A1A]" />
            </motion.div>
            <h2 className="text-3xl font-serif font-black mb-10 leading-relaxed text-[#2C241B]">
                {selectedLang.ui.confirmTitle}
            </h2>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmLanguage}
                className="w-full py-5 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest text-lg hover:bg-[#5C1A1A] transition-all border-2 border-[#8B7355]/40 shadow-xl"
            >
                {selectedLang.ui.confirmBtn}
            </motion.button>
        </PaperCard>
    );

    const IntroView = () => (
        <div className="space-y-12 max-w-xl mx-auto">
            <PaperCard className="text-center italic text-xl border-l-[12px] border-l-[#5C1A1A]">
                "{selectedLang.welcome}"
            </PaperCard>

            <div className="space-y-8">
                <PaperCard className="bg-[#1A1612]/5 border-[#C5A059]/40 border-2">
                    <h3 className="text-xl font-black text-[#5C1A1A] uppercase mb-4 tracking-widest flex items-center gap-2">
                        <LucideFeather size={24} /> {selectedLang.ui.textOptionTitle}
                    </h3>
                    <p className="text-sm italic mb-6 text-[#5C4D3C]">{selectedLang.ui.textOptionDesc}</p>
                    <input
                        type="text"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        placeholder={selectedLang.ui.textInputPlaceholder}
                        className="w-full bg-[#1A1612]/10 text-[#5C1A1A] border-b-2 border-[#8B7355] p-4 mb-6 focus:outline-none focus:border-[#5C1A1A] font-serif text-xl placeholder:opacity-30"
                    />
                    <button
                        onClick={generateTextCharacter}
                        disabled={isAvatarGenerating || !userName.trim()}
                        className="w-full py-4 bg-[#C5A059] text-[#1A1612] font-black uppercase tracking-widest hover:bg-[#D4C5A3] disabled:opacity-50 transition-all shadow-md group border-b-4 border-[#8B7355]"
                    >
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                            {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn}
                        </span>
                    </button>
                </PaperCard>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#8B7355]/20"></div></div>
                    <div className="relative flex justify-center text-xs uppercase text-[#8B7355] font-black tracking-[0.5em] bg-transparent"><span className="px-4">Aether Scan</span></div>
                </div>

                <label className="block w-full cursor-pointer group">
                    <div className="p-12 border-4 border-dashed border-[#8B7355]/30 bg-[#25201B]/5 hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all rounded-sm flex flex-col items-center transition-all">
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        <div className="p-4 bg-[#f4e4bc] rounded-full border-2 border-[#8B7355]/40 mb-4 group-hover:scale-110 transition-transform">
                            <LucideUpload className="text-[#5C1A1A]" size={32} />
                        </div>
                        <p className="font-black uppercase tracking-widest text-[#8B7355]">{selectedLang.ui.uploadTitle}</p>
                    </div>
                </label>

                {uploadedImage && (
                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={generateCharacter}
                        disabled={isAvatarGenerating}
                        className="w-full py-6 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest hover:bg-[#5C1A1A] border-b-4 border-black transition-all flex items-center justify-center gap-3"
                    >
                        {isAvatarGenerating ? <LucideLoader2 className="animate-spin" /> : <LucideCamera size={24} />}
                        {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.generateBtn}
                    </motion.button>
                )}

                {isAvatarGenerating && (
                    <PaperCard className="bg-[#5C1A1A]/10 border-[#5C1A1A] text-left">
                        <p className="animate-pulse leading-loose text-sm italic">{selectedLang.loading}</p>
                    </PaperCard>
                )}
            </div>
        </div>
    );

    const GalleryView = () => {
        const slots = [
            { id: 1, type: 'manor', title: selectedLang.ui.manorTitle, icon: <LucideLayout size={32} /> },
            { id: 2, type: 'archive', title: '1899', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400' },
            { id: 3, type: 'ad', title: 'Steam Co.', text: 'Industrial Brass' },
            { id: 4, type: 'archive', title: '1900', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=400' },
            { id: 5, type: 'current', isCenter: true },
            { id: 6, type: 'ad', title: 'Aether', text: 'Wireless Pulse' },
            { id: 7, type: 'empty' },
            { id: 8, type: 'empty' },
            { id: 9, type: 'ad', title: 'Elixir', text: 'Vitality Tonic' },
            { id: 10, type: 'empty' },
            { id: 11, type: 'empty' },
            { id: 12, type: 'empty' },
        ];

        return (
            <div className="w-full max-w-2xl mx-auto space-y-10">
                <div className="text-center px-4">
                    <h1 className="text-5xl font-black text-[#C5A059] mb-4 drop-shadow-2xl uppercase tracking-[0.1em]">{selectedLang.ui.galleryTitle}</h1>
                    <div className="h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent w-full mb-2" />
                    <p className="text-[#8B7355] text-xs font-black uppercase tracking-[0.5em]">{selectedLang.ui.gallerySub}</p>
                </div>

                <div className="grid grid-cols-3 gap-6 p-4">
                    {slots.map((slot, idx) => (
                        <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            {slot.type === 'current' ? (
                                <button
                                    onClick={() => setViewMode('mission_active')}
                                    className="w-full aspect-square relative bg-[#2C241B] border-4 border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.4)] hover:scale-105 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center p-2">
                                        {userAvatar?.isTextAvatar ? (
                                            <div className="w-full h-full border-2 border-[#C5A059]/20 flex items-center justify-center p-4 bg-[#1A1612]">
                                                <span className="text-[#C5A059] font-black text-2xl uppercase break-words text-center leading-tight drop-shadow-[0_0_10px_#C5A059]">{userAvatar.textName}</span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-[#1A1612] flex items-center justify-center">
                                                <LucideUser className="text-[#C5A059] w-1/2 h-1/2" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-[#5C1A1A] text-[#f4e4bc] text-[10px] font-black py-2 uppercase tracking-widest border-t border-[#C5A059]">Active</div>
                                </button>
                            ) : slot.type === 'manor' ? (
                                <button
                                    onClick={() => { setViewMode('home_interior'); setTodos(p => ({ ...p, home: true })); }}
                                    className="w-full aspect-square relative bg-[#2C241B] border-4 border-[#8B7355] shadow-xl flex flex-col items-center justify-center hover:border-[#C5A059] transition-all group"
                                >
                                    <div className="text-[#C5A059] group-hover:scale-120 transition-transform mb-2">
                                        <LucideLayout size={40} />
                                    </div>
                                    <span className="text-[#8B7355] text-[10px] font-black uppercase tracking-widest">{slot.title}</span>
                                </button>
                            ) : slot.type === 'archive' ? (
                                <div className="w-full aspect-square border-4 border-[#2C241B] relative overflow-hidden group grayscale hover:grayscale-0 transition-all bg-black">
                                    <img src={slot.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" alt="archive" />
                                    <div className="absolute bottom-2 left-2 bg-[#1A1612]/80 px-2 py-1 text-[#f4e4bc] text-[10px] font-black border border-[#C5A059]/40">{slot.title}</div>
                                </div>
                            ) : slot.type === 'ad' ? (
                                <div className="w-full aspect-square relative bg-[#f4e4bc] border-4 border-[#2C241B] p-2 flex flex-col items-center justify-center text-center bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] shadow-lg">
                                    <span className="font-black text-[12px] uppercase text-[#5C1A1A] border-b-2 border-black/10 mb-2 leading-none">{slot.title}</span>
                                    <span className="text-[9px] italic text-[#2C241B] leading-tight font-serif">{slot.text}</span>
                                </div>
                            ) : (
                                <div className="w-full aspect-square relative border-4 border-[#2C241B]/50 bg-black/20 shadow-inner flex items-center justify-center">
                                    <div className="w-3/4 h-3/4 border-2 border-dashed border-[#8B7355]/10 rounded-sm" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    const ManorView = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <button onClick={() => setViewMode('gallery')} className="flex items-center gap-2 text-[#C5A059] hover:text-[#f4e4bc] uppercase text-xs font-black tracking-widest mb-4">
                <LucideChevronLeft size={20} /> {selectedLang.ui.returnGallery}
            </button>

            <PaperCard className="min-h-[600px] p-0 border-[#C5A059] border-4 bg-[#1A1612] relative overflow-hidden">
                {/* Living Background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200')] opacity-30 sepia brightness-50 contrast-150 rotate-1 scale-110" />

                <div className="relative z-10 flex flex-col items-center p-12 h-full">
                    {/* Interactive Candle */}
                    <div className="absolute top-8 left-8 cursor-pointer group" onClick={() => setCandleLit(!candleLit)}>
                        <div className={`transition-all duration-700 ${candleLit ? 'drop-shadow-[0_0_20px_#FFAA00]' : 'brightness-50'}`}>
                            <LucideFlame size={48} className={candleLit ? 'text-[#FFAA00]' : 'text-[#2C241B]'} />
                        </div>
                        <p className="text-[10px] text-[#8B7355] mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black">Flame</p>
                    </div>

                    {/* Interactive Settings */}
                    <div className="absolute top-8 right-8 cursor-pointer group" onClick={() => setGearsSpinning(!gearsSpinning)}>
                        <motion.div
                            animate={{ rotate: gearsSpinning ? 360 : 0 }}
                            transition={{ duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }}
                        >
                            <LucideSettings size={48} className="text-[#C5A059]" />
                        </motion.div>
                        <p className="text-[10px] text-[#8B7355] mt-2 opacity-0 group-hover:opacity-100 text-right uppercase font-black">Mechanism</p>
                    </div>

                    {/* Avatar Frame */}
                    <div className={`relative w-48 h-48 mb-10 transition-all duration-1000 ${candleLit ? '' : 'brightness-50'}`}>
                        <div className="absolute inset-0 border-8 border-[#C5A059] rounded-full shadow-[0_0_50px_rgba(197,160,89,0.4)] z-0" />
                        <div className="absolute inset-2 border-4 border-[#8B7355] rounded-full z-10" />
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-4">
                            {userAvatar?.isTextAvatar ? (
                                <span className="text-[#C5A059] font-black text-3xl text-center uppercase leading-none drop-shadow-[0_0_10px_#C5A059]">{userAvatar.textName}</span>
                            ) : (
                                <LucideUser className="text-[#C5A059] w-2/3 h-2/3 opacity-50" />
                            )}
                        </div>
                    </div>

                    <h3 className="text-4xl font-serif font-black text-[#f4e4bc] mb-2 uppercase tracking-[0.2em]">{selectedLang.ui.manorTitle}</h3>
                    <div className="w-24 h-1 bg-[#C5A059] mb-10" />

                    {/* Typewriter Terminal */}
                    <div className="w-full bg-black/80 p-8 border-2 border-[#8B7355]/40 rounded-sm shadow-inner font-mono text-sm text-[#D4C5A3] leading-relaxed relative min-h-[160px]">
                        <div className="absolute top-0 right-0 p-2 opacity-20"><LucideFeather size={20} /></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#5C1A1A] rounded-full animate-pulse" />
                        {loreText}<span className="inline-block w-2 h-5 bg-[#C5A059] ml-1 animate-ping" />
                    </div>

                    <div className="grid grid-cols-2 gap-10 w-full mt-12 border-t border-[#8B7355]/20 pt-12">
                        <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-4 cursor-pointer group">
                            <div className="w-20 h-20 rounded-full border-4 border-[#8B7355] flex items-center justify-center bg-[#1A1A1A] group-hover:border-[#C5A059] group-hover:shadow-[0_0_20px_#C5A059] transition-all">
                                <LucideTrophy size={32} className="text-[#8B7355] group-hover:text-[#C5A059]" />
                            </div>
                            <span className="text-xs font-black uppercase text-[#8B7355] group-hover:text-[#C5A059] tracking-widest">{selectedLang.ui.manorHeirlooms}</span>
                        </motion.div>
                        <div className="flex flex-col items-center gap-4 opacity-30 grayscale cursor-not-allowed">
                            <div className="w-20 h-20 rounded-full border-4 border-[#2C241B] flex items-center justify-center bg-black">
                                <LucideMapPin size={32} className="text-[#2C241B]" />
                            </div>
                            <span className="text-xs font-black uppercase text-[#2C241B] tracking-widest">{selectedLang.ui.manorEstate}</span>
                        </div>
                    </div>
                </div>
            </PaperCard>
        </motion.div>
    );

    const MissionView = () => (
        <div className="space-y-8 pb-32">
            <button onClick={() => setViewMode('gallery')} className="flex items-center gap-2 text-[#C5A059] hover:text-[#f4e4bc] uppercase text-xs font-black tracking-widest">
                <LucideChevronLeft size={20} /> {selectedLang.ui.returnGallery}
            </button>

            <PaperCard className="border-[#C5A059]">
                <h3 className="text-xs font-black text-[#5C1A1A] uppercase mb-4 tracking-[0.3em] flex items-center gap-2">
                    <LucideInfo size={18} /> {selectedLang.ui.authTitle}
                </h3>
                {!isAuthenticated ? (
                    <button onClick={() => setIsAuthenticated(true)} className="w-full py-4 bg-[#1A1612] text-[#C5A059] text-xs font-black uppercase border-2 border-[#C5A059]/40 hover:bg-[#5C1A1A] hover:text-white transition-all">
                        {selectedLang.ui.authBtn}
                    </button>
                ) : (
                    <div className="flex items-center justify-center gap-4 text-[#556B2F] font-black bg-[#556B2F]/10 p-4 border border-[#556B2F]/30 uppercase text-xs tracking-widest">
                        <LucideCheckCircle size={20} /> {selectedLang.ui.authDone}
                    </div>
                )}
            </PaperCard>

            <div className="space-y-6">
                {PROJECTS.map((proj) => {
                    const isSelected = previewId === proj.id;
                    const isInactive = previewId && !isSelected;
                    return (
                        <motion.div
                            key={proj.id}
                            layout
                            className={`${isInactive ? 'opacity-30 grayscale pointer-events-none' : ''}`}
                        >
                            <div
                                onClick={() => !isInactive && isAuthenticated && handlePreviewVote(proj.id)}
                                className={`cursor-pointer transition-all duration-500 overflow-hidden border-2 ${isSelected ? 'bg-[#f4e4bc] border-[#C5A059] shadow-2xl scale-105' : 'bg-[#1A1612]/80 border-[#2C241B] hover:border-[#8B7355]'}`}
                            >
                                <div className="p-8">
                                    <span className={`text-[10px] font-mono mb-2 block uppercase tracking-widest ${isSelected ? 'text-[#5C1A1A]' : 'text-[#8B7355]'}`}>{selectedLang.ui.casePrefix} 0{proj.id}</span>
                                    <h4 className={`text-2xl font-black mb-2 uppercase tracking-tight ${isSelected ? 'text-[#2C241B]' : 'text-[#C5A059]'}`}>{proj.title}</h4>
                                    <p className={`text-sm italic ${isSelected ? 'text-[#5C4D3C]' : 'text-[#8B7355]'}`}>{proj.desc}</p>
                                </div>

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-8 pt-0 border-t-2 border-black/5 mt-4">
                                            <div className="bg-[#1A1612] p-6 border border-[#C5A059] relative mb-6">
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1612] px-3 text-[#C5A059] text-[10px] uppercase font-black tracking-widest border border-[#C5A059]">{selectedLang.ui.prophecyTitle}</div>
                                                <p className="text-[#f4e4bc] text-sm italic leading-relaxed text-center">"{oracleMessage || selectedLang.ui.consulting}"</p>
                                            </div>
                                            <button onClick={() => setStep('trailer')} className="w-full py-5 bg-[#5C1A1A] text-white font-black uppercase tracking-[0.2em] border-b-4 border-black group">
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                                    {selectedLang.ui.sealBtn}
                                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                                </div>
                                            </button>
                                            <button onClick={() => { setPreviewId(null); setOracleMessage(""); }} className="w-full mt-4 text-[#8B7355] text-xs font-black uppercase tracking-widest hover:text-[#5C1A1A] transition-colors">
                                                {selectedLang.ui.reconsiderBtn}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );

    const TrailerView = () => (
        <div className="max-w-xl mx-auto space-y-8">
            <PaperCard className="bg-black p-1 border-[#C5A059] border-4">
                <div className="aspect-video relative overflow-hidden flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10 text-center p-10 bg-black/40 backdrop-blur-sm border-2 border-[#C5A059]/40 m-4"
                    >
                        <LucideZap className="text-[#C5A059] mx-auto mb-6 drop-shadow-[0_0_15px_#C5A059] animate-pulse" size={60} />
                        <h2 className="text-4xl font-black text-[#f4e4bc] uppercase tracking-[0.2em] mb-4">{selectedLang.ui.fateSealed}</h2>
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent w-full mb-4" />
                        <p className="text-xs text-[#8B7355] tracking-[0.8em] font-black">{selectedLang.ui.projectInitiated}</p>
                    </motion.div>
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-30 sepia brightness-50" alt="Trailer" />
                </div>
            </PaperCard>

            <PaperCard className="text-center italic text-lg py-12">
                "{oracleMessage}"
                <div className="mt-10 flex justify-center">
                    <button onClick={() => { setStep('dashboard'); setViewMode('gallery'); }} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5C4D3C] hover:text-[#5C1A1A]">
                        <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
                    </button>
                </div>
            </PaperCard>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#1A1612] text-[#E0D0B0] font-serif selection:bg-[#5C1A1A] selection:text-white relative">
            <Background />

            {/* API Status Banner */}
            {!apiKey && (
                <div className="fixed top-0 left-0 w-full z-[1000] bg-[#5C1A1A] text-[#f4e4bc] py-2 px-4 shadow-xl border-b border-[#C5A059] flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500">
                    <LucideZap size={16} className="text-[#C5A059] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Aether Connection Pending: Please set VITE_GEMINI_API_KEY in environment variables
                    </span>
                </div>
            )}

            {/* Main Content Area */}
            <main className="relative z-10 max-w-4xl mx-auto pt-20 pb-40 px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step + viewMode}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex flex-col items-center"
                    >
                        {step === 'language' && <LanguageView />}
                        {step === 'confirm' && <ConfirmView />}
                        {step === 'intro' && <IntroView />}
                        {step === 'dashboard' && (
                            <>
                                {viewMode === 'gallery' && <GalleryView />}
                                {viewMode === 'home_interior' && <ManorView />}
                                {viewMode === 'mission_active' && <MissionView />}
                            </>
                        )}
                        {step === 'trailer' && <TrailerView />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Todo Widget */}
            {showTodo && (
                <div className="fixed bottom-8 right-8 z-[100]">
                    <PaperCard className="p-6 border-2 border-[#5C1A1A] shadow-2xl skew-x-1 max-w-[240px]">
                        <h4 className="font-black text-[#5C1A1A] text-sm mb-4 uppercase tracking-[0.2em] border-b-2 border-[#8B7355]/20 pb-2">{selectedLang.ui.todoTitle}</h4>
                        <div className="space-y-4 text-xs font-black uppercase tracking-widest text-[#2C241B]">
                            <div className="flex items-center gap-3">
                                {todos.avatar ? <LucideCheckSquare size={18} className="text-[#556B2F]" /> : <LucideSquare size={18} className="text-[#8B7355]" />}
                                <span className={todos.avatar ? 'line-through opacity-40' : ''}>{selectedLang.ui.todo1}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {todos.home ? <LucideCheckSquare size={18} className="text-[#556B2F]" /> : <LucideSquare size={18} className="text-[#8B7355]" />}
                                <span className={todos.home ? 'line-through opacity-40' : ''}>{selectedLang.ui.todo2}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {todos.voted ? <LucideCheckSquare size={18} className="text-[#556B2F]" /> : <LucideSquare size={18} className="text-[#8B7355]" />}
                                <span className={todos.voted ? 'line-through opacity-40' : ''}>{selectedLang.ui.todo3}</span>
                            </div>
                        </div>
                    </PaperCard>
                </div>
            )}
        </div>
    );
};

export default App;
