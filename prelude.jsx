import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicOpening from './components/CinematicOpening';
import {
    LucideCheckCircle, LucideGlobe, LucideInstagram,
    LucideSparkles, LucideInfo, LucideVolume2,
    LucideLoader2, LucideChevronLeft,
    LucideTrophy, LucideLayout, LucideMapPin,
    LucideFeather, LucideScroll, LucideCompass, LucideUser, LucideUpload,
    LucideCheckSquare, LucideSquare, LucideFlame, LucideSettings, LucideCamera, LucideZap, LucideScale,
    LucideArrowLeft, LucideArrowRight, LucideLock
} from 'lucide-react';
import SmokeAssistant from './components/SmokeAssistant';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const BUILD_VERSION = "v1.4.0-clockwork-masterpiece-final";

/**
 * [V19] Singleton AudioManager
 * Prevents overlapping sounds and manages persistent themes.
 */
const AudioManager = {
    currentSfx: null,
    currentTheme: null,
    currentMina: null,

    playSfx: (id, volume = 0.5) => {
        if (AudioManager.currentSfx) {
            AudioManager.currentSfx.pause();
            AudioManager.currentSfx = null;
        }
        const audio = new Audio(`/assets/sounds/${id}.mp3`);
        audio.volume = volume;
        audio.play().catch(() => { });
        AudioManager.currentSfx = audio;
    },

    playTheme: (langId, volume = 0.4) => {
        // Point 6: Immediate switch. If already playing this theme, just exit.
        if (AudioManager.currentTheme && !AudioManager.currentTheme.paused && AudioManager.currentTheme.src.includes(`${langId}-theme.mp3`)) return;

        if (AudioManager.currentTheme) {
            AudioManager.currentTheme.pause();
            AudioManager.currentTheme.currentTime = 0; // Immediate reset for faster switch
        }
        const audio = new Audio(`/assets/sounds/${langId}-theme.mp3`);
        audio.volume = volume;
        audio.loop = true;
        audio.play().catch(() => { });
        AudioManager.currentTheme = audio;
        window.journeyTheme = audio;
    },

    stopTheme: () => {
        if (AudioManager.currentTheme) {
            AudioManager.currentTheme.pause();
            AudioManager.currentTheme = null;
        }
    },

    playMina: (langId, step, volume = 1.0) => {
        if (AudioManager.currentMina) {
            AudioManager.currentMina.pause();
        }
        const audio = new Audio(`/assets/sounds/mina/mina-${langId}-${step}.mp3`);
        audio.volume = volume;
        audio.play().catch(() => { });
        AudioManager.currentMina = audio;
    }
};

// [V10 UPDATE: Cinematic Editorial - Muted Tones & Diffused Glow]
const THEME_CONFIG = {
    ko: { bg: 'bg-[#121114]', text: 'text-[#EFEFF0]', accent: 'text-[#9A8C9E]', border: 'border-[#9A8C9E]/40', shadow: 'shadow-[#9A8C9E]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Lavender
    en: { bg: 'bg-[#0F1115]', text: 'text-[#F0F2F5]', accent: 'text-[#4A6478]', border: 'border-[#4A6478]/40', shadow: 'shadow-[#4A6478]/10', blur: 'backdrop-blur-sm', font: 'font-sans' }, // Muted Electric Blue
    es: { bg: 'bg-[#151211]', text: 'text-[#F5EBE8]', accent: 'text-[#A67B71]', border: 'border-[#A67B71]/40', shadow: 'shadow-[#A67B71]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Coral
    hi: { bg: 'bg-[#14120F]', text: 'text-[#F5F2EC]', accent: 'text-[#B08D5B]', border: 'border-[#B08D5B]/40', shadow: 'shadow-[#B08D5B]/10', blur: 'backdrop-blur-sm', font: 'font-sans' }, // Muted Amber
    de: { bg: 'bg-[#101211]', text: 'text-[#ECEFEF]', accent: 'text-[#7D9185]', border: 'border-[#7D9185]/40', shadow: 'shadow-[#7D9185]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Sage Green
    ja: { bg: 'bg-[#0E1112]', text: 'text-[#EBF1F2]', accent: 'text-[#6B8C96]', border: 'border-[#6B8C96]/40', shadow: 'shadow-[#6B8C96]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Cyan
    ar: { bg: 'bg-[#131013]', text: 'text-[#F4EEF4]', accent: 'text-[#966B84]', border: 'border-[#966B84]/40', shadow: 'shadow-[#966B84]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Magenta
    pl: { bg: 'bg-[#121212]', text: 'text-[#EEEEEE]', accent: 'text-[#8A8A8A]', border: 'border-[#8A8A8A]/40', shadow: 'shadow-[#8A8A8A]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }  // Muted Ash
};

const LANGUAGES = [
    {
        id: 'ko', name: '한국어', flag: '🇰🇷',
        image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop', // Seoul neon night
        welcome: "로드 매너에 오신 것을 환영합니다. 운명의 톱니바퀴가 당신을 기다립니다.",
        loading: "크로노미터 컨설팅 중...",
        ui: {
            authTitle: "에테르 신원 확인", authBtn: "영혼 각인 확인", authDone: "신원 봉인됨",
            galleryTitle: "매너 아카이브", gallerySub: "역사적 기록 1899",
            manorTitle: "태엽장치 심장", manorHeirlooms: "조상의 톱니바퀴", manorEstate: "저택 부지",
            returnGallery: "아카이브로 복귀", textOptionTitle: "직접 이름 기입",
            textInputPlaceholder: "방문객 성명...", textSubmitBtn: "신원 소환",
            uploadTitle: "에테르 초상화 스캔", generateBtn: "영혼 연성", generating: "연성 중...",
            confirmTitle: "이 언어가 당신의 모국어입니까?", confirmBtn: "동의합니다", confirmDone: "언어 결속됨",
            todoTitle: "선언문", todo1: "신원 연성", todo2: "심장 점검", todo3: "운명 봉인", todoDone: "운명이 실현되었습니다.",
            consulting: "알고리즘의 속삭임...", sealBtn: "운명을 봉인하기", fateSealed: "운명 확정됨",
        }
    },
    {
        id: 'en', name: 'English', flag: '🇬🇧',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', // London fog/bridge
        welcome: "Welcome to the Lord Manor, guest. The gears of destiny await your touch.",
        loading: "Consulting the Chronometer...",
        ui: {
            authTitle: "Aetherial Identity", authBtn: "Verify Soul Print", authDone: "Identity Sealed",
            galleryTitle: "MANOR ARCHIVE", gallerySub: "Historical Record 1899",
            manorTitle: "The Clockwork Heart", manorHeirlooms: "Ancestral Gears", manorEstate: "Manor Grounds",
            returnGallery: "Back to Archive", textOptionTitle: "Ink Your Name",
            textInputPlaceholder: "Guest Name...", textSubmitBtn: "Summon Identity",
            uploadTitle: "Scan Aether Portrait", generateBtn: "Forge Soul", generating: "Transmuting...",
            confirmTitle: "Is this the tongue you speak?", confirmBtn: "I Consent", confirmDone: "Tongue Bound",
            todoTitle: "Manifesto", todo1: "Forge Identity", todo2: "Inspect Heart", todo3: "Seal Fate", todoDone: "Destiny manifested.",
            consulting: "The Algorithm Whispers...", sealBtn: "Seal This Fate", fateSealed: "Destiny Locked",
        }
    },
    {
        id: 'es', name: 'Español', flag: '🇪🇸',
        image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop', // Madrid architecture
        welcome: "Bienvenido a Lord Manor. Los engranajes del destino esperan tu toque.",
        loading: "Consultando el Cronómetro...",
        ui: {
            authTitle: "Identidad Etérea", authBtn: "Verificar huella del alma", authDone: "Identidad sellada",
            galleryTitle: "ARCHIVO DE LA MANSIÓN", gallerySub: "Registro Histórico 1899",
            manorTitle: "El Corazón de Relojería", manorHeirlooms: "Engranajes Ancestrales", manorEstate: "Terrenos de la Mansión",
            returnGallery: "Volver al Archivo", textOptionTitle: "Escribe tu nombre",
            textInputPlaceholder: "Nombre del invitado...", textSubmitBtn: "Invocar Identidad",
            uploadTitle: "Escanear Retrato de Éter", generateBtn: "Forjar Alma", generating: "Transmutando...",
            confirmTitle: "¿Es esta tu lengua materna?", confirmBtn: "Doy mi consentimiento", confirmDone: "Lengua vinculada",
            todoTitle: "Manifiesto", todo1: "Forjar Identidad", todo2: "Inspeccionar Corazón", todo3: "Sellar Destino", todoDone: "Destino manifestado.",
            consulting: "El algoritmo susurra...", sealBtn: "Sellar este destino", fateSealed: "Destino bloqueado",
        }
    },
    {
        id: 'hi', name: 'हिन्दी', flag: '🇮🇳',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop', // Taj Mahal / India atmospheric
        welcome: "लॉर्ड मैनर में आपका स्वागत है। भाग्य के पहिये आपकी प्रतीक्षा कर रहे हैं।",
        loading: "क्रोनोमीटर से परामर्श किया जा रहा है...",
        ui: {
            authTitle: "ईथर पहचान", authBtn: "आत्मा की छाप सत्यापित करें", authDone: "पहचान सील",
            galleryTitle: "मैनर पुरालेख", gallerySub: "ऐतिहासिक रिकॉर्ड 1899",
            manorTitle: "लॉर्ड मैनर", manorHeirlooms: "पैतृक गियर्स", manorEstate: "मैनर मैदान",
            returnGallery: "पुरालेख पर वापस", textOptionTitle: "अपना नाम दर्ज करें",
            textInputPlaceholder: "अतिथि का नाम...", textSubmitBtn: "पहचान बुलाएं",
            uploadTitle: "ईथर पोर्ट्रेट स्कैन करें", generateBtn: "आत्मा बनाएं", generating: "रूपांतरण...",
            confirmTitle: "क्या यह आपकी मातृभाषा है?", confirmBtn: "मैं सहमत हूँ", confirmDone: "भाषा बाध्य",
            todoTitle: "घोषणापत्र", todo1: "पहचान बनाएं", todo2: "हृदय का निरीक्षण करें", todo3: "भाग्य को सील करें", todoDone: "भाग्य प्रकट हुआ।",
            consulting: "एल्गोरिथम फुसफुसाता है...", sealBtn: "इस भाग्य को सील करें", fateSealed: "भाग्य लॉक हो गया",
        }
    },
    {
        id: 'de', name: 'Deutsch', flag: '🇩🇪',
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop', // German Black Forest / Castle
        welcome: "Willkommen im Lord Manor. Die Zahnräder des Schicksals erwarten Sie.",
        loading: "Konsultiere das Chronometer...",
        ui: {
            authTitle: "Ätherische Identität", authBtn: "Seelenabdruck verifizieren", authDone: "Identität besiegelt",
            galleryTitle: "MANOR ARCHIV", gallerySub: "Historische Aufzeichnung 1899",
            manorTitle: "Das mechanische Herz", manorHeirlooms: "Ahnen-Zahnräder", manorEstate: "Anwesen",
            returnGallery: "Zurück zum Archiv", textOptionTitle: "Namen eintragen",
            textInputPlaceholder: "Gastname...", textSubmitBtn: "Identität beschwören",
            uploadTitle: "Äther-Porträt scannen", generateBtn: "Seele schmieden", generating: "Transmutiere...",
            confirmTitle: "Ist dies Ihre Muttersprache?", confirmBtn: "Ich stimme zu", confirmDone: "Sprache gebunden",
            todoTitle: "Manifest", todo1: "Identität schmieden", todo2: "Herz inspizieren", todo3: "Schicksal besiegeln", todoDone: "Schicksal manifestiert.",
            consulting: "Der Algorithmus flüstert...", sealBtn: "Schicksal besiegeln", fateSealed: "Schicksal gesperrt",
        }
    },
    {
        id: 'ja', name: '日本語', flag: '🇯🇵',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', // Kyoto temples / Japan
        welcome: "ロード・マナーへようこそ。運命の歯車があなたを待っています。",
        loading: "クロノメーターを照合中...",
        ui: {
            authTitle: "エーテル身元確認", authBtn: "魂の刻印を確認", authDone: "身元封印完了",
            galleryTitle: "マナー・アーカイブ", gallerySub: "歴史的記録 1899",
            manorTitle: "時計仕掛けの心臓", manorHeirlooms: "祖先の歯車", manorEstate: "邸宅の敷地",
            returnGallery: "アーカイブへ戻る", textOptionTitle: "名を記す",
            textInputPlaceholder: "来客名...", textSubmitBtn: "身元を召喚",
            uploadTitle: "エーテル肖像をスキャン", generateBtn: "魂を錬成", generating: "錬成中...",
            confirmTitle: "この言語があなたの母国語ですか？", confirmBtn: "同意する", confirmDone: "言語バインド完了",
            todoTitle: "マニフェスト", todo1: "身元を錬成", todo2: "心臓を点検", todo3: "運命を封印", todoDone: "運命が具現化されました。",
            consulting: "アルゴリズムの囁き...", sealBtn: "運命を封印する", fateSealed: "運命確定",
        }
    },
    {
        id: 'ar', name: 'العربية', flag: '🇸🇦',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop', // Reliable Taj Mahal / Arabic architecture image
        welcome: "مرحبًا بكم في لورد مانور. تروس القدر في انتظار لمستك.",
        loading: "استشارة الكرونومتر...",
        ui: {
            authTitle: "هوية الأثير", authBtn: "التحقق من بصمة الروح", authDone: "تم ختم الهوية",
            galleryTitle: "أرشيف القصر", gallerySub: "سجل تاريخي 1899",
            manorTitle: "قلب الساعة", manorHeirlooms: "تروس الأجداد", manorEstate: "أراضي القصر",
            returnGallery: "العودة للأرشيف", textOptionTitle: "أدخل اسمك",
            textInputPlaceholder: "اسم الضيف...", textSubmitBtn: "استدعاء الهوية",
            uploadTitle: "مسح صورة الأثير", generateBtn: "صياغة الروح", generating: "تحويل...",
            confirmTitle: "هل هذه لغتك الأم؟", confirmBtn: "أوافق", confirmDone: "تم ربط اللغة",
            todoTitle: "البيان", todo1: "صياغة الهوية", todo2: "فحص القلب", todo3: "ختم القدر", todoDone: "القدر يتجلى.",
            consulting: "الخوارزمية تهمس...", sealBtn: "ختم هذا القدر", fateSealed: "القدر مغلق",
        }
    },
    {
        id: 'pl', name: 'Polski', flag: '🇵🇱',
        image: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=800&auto=format&fit=crop', // Warsaw / Polish landscape
        welcome: "Witamy w Lord Manor. Tryby przeznaczenia czekają na twój dotyk.",
        loading: "Konsultacja z Chronometrem...",
        ui: {
            authTitle: "Eteryczna Tożsamość", authBtn: "Weryfikuj Duszę", authDone: "Tożsamość Zapieczętowana",
            galleryTitle: "ARCHIWUM DWORU", gallerySub: "Zapis Historyczny 1899",
            manorTitle: "Mechaniczne Serce", manorHeirlooms: "Zębatki Przodków", manorEstate: "Tereny Dworu",
            returnGallery: "Powrót do Archiwum", textOptionTitle: "Wpisz Swoje Imię",
            textInputPlaceholder: "Imię Gościa...", textSubmitBtn: "Przyzwij Tożsamość",
            uploadTitle: "Skanuj Eteryczny Portret", generateBtn: "Wykuj Duszę", generating: "Transmutacja...",
            confirmTitle: "Czy to twój język ojczysty?", confirmBtn: "Wyrażam zgodę", confirmDone: "Język Związany",
            todoTitle: "Manifest", todo1: "Wykuj Tożsamość", todo2: "Zbadaj Serce", todo3: "Zapieczętuj Los", todoDone: "Przeznaczenie zrealizowane.",
            consulting: "Algorytm Szepcze...", sealBtn: "Zapieczętuj ten los", fateSealed: "Los Zablokowany",
        }
    }
];

// [V7 UPDATE: Restored full 8 project cases from user source]
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

// [V8 UPDATE: Aether Whispers - subtle AI background text]
const AetherWhispers = ({ text }) => (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <AnimatePresence mode="wait">
            {text && (
                <motion.div
                    key={text}
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 0.1, scale: 1, filter: 'blur(2px)' }}
                    exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="text-[12vw] font-black uppercase tracking-[1em] text-[#C5A059] text-center leading-none opacity-10 break-all select-none"
                >
                    {text}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// [V8 UPDATE: Clockwork Shutter Transition Component]
const ShutterTransition = ({ isActive, children }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
            {!isActive && (
                <motion.div
                    key="shutter-top"
                    initial={{ y: "-100%" }}
                    animate={{ y: "-101%" }}
                    exit={{ y: "0%" }}
                    transition={{ duration: 0.4, ease: "circIn" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-[#1A1612] border-b-2 border-[#C5A059] z-[100] shadow-2xl"
                />
            )}
            {!isActive && (
                <motion.div
                    key="shutter-bottom"
                    initial={{ y: "100%" }}
                    animate={{ y: "101%" }}
                    exit={{ y: "0%" }}
                    transition={{ duration: 0.4, ease: "circIn" }}
                    className="absolute bottom-0 left-0 w-full h-1/2 bg-[#1A1612] border-t-2 border-[#C5A059] z-[100] shadow-2xl"
                />
            )}
        </AnimatePresence>
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {children}
        </div>
    </div>
);

// --- UI Primitives ---

const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        {/* Subtle cinematic gradient and noise */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-[#050505] to-black" />
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/assets/steampunk_paper_texture.png')]" />

        {/* Deep radial glow for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)]" />
    </div>
);

const GlassCard = ({ children, className = "", onClick, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        onClick={onClick}
        className={`bg-[#050505]/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group ${className}`}
    >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10">{children}</div>
    </motion.div>
);

// --- View Components (Extracted to fix focus issues) ---

const IntroView = ({ selectedLang, userName, setUserName, generateTextCharacter, isAvatarGenerating, handleImageUpload, uploadedImage, generateCharacter, playSfx }) => (
    <div className="space-y-4 max-w-md mx-auto overflow-y-auto no-scrollbar max-h-[85vh] px-4 py-4">
        <GlassCard className="text-center italic text-sm border-l-4 border-l-white/50 py-4 mb-6">
            <span className="opacity-80">"{selectedLang.welcome}"</span>
        </GlassCard>

        <GlassCard className="py-6 px-4 flex flex-col items-center">
            <div className="absolute top-0 right-0 w-8 h-8 opacity-20"><LucideZap size={32} className="text-white" /></div>
            <h3 className="text-xs font-black uppercase mb-4 tracking-[0.2em] flex items-center gap-2 text-white/50">
                <LucideFeather size={16} /> {selectedLang.ui.textOptionTitle}
            </h3>
            <input
                type="text"
                value={userName}
                onChange={e => { setUserName(e.target.value); }}
                onFocus={() => playSfx?.('click')}
                placeholder={selectedLang.ui.textInputPlaceholder}
                className="w-full bg-transparent border-b border-white/20 p-3 mb-6 focus:outline-none font-sans text-lg transition-all focus:border-white text-center text-white placeholder-white/20"
            />
            <button
                onClick={generateTextCharacter}
                disabled={isAvatarGenerating || !userName.trim()}
                onMouseEnter={() => playSfx?.('hover')}
                className="w-full py-4 bg-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/20 disabled:opacity-30 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 backdrop-blur-md"
            >
                {isAvatarGenerating ? <LucideLoader2 className="animate-spin" size={16} /> : null}
                {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn}
            </button>
        </GlassCard>

        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em] bg-transparent">
                <span className="px-4 text-white/40 bg-[#0A0A0B]">OR</span>
            </div>
        </div>

        <label className="block w-full cursor-pointer group">
            <div className="p-6 border border-dashed border-white/20 bg-white/5 hover:bg-white/10 rounded-sm flex flex-col items-center transition-all shadow-inner backdrop-blur-sm">
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                <LucideUpload className="text-white/50 mb-3 group-hover:text-white transition-colors" size={24} />
                <p className="font-black uppercase tracking-widest text-[10px] text-white/50 group-hover:text-white transition-colors">{selectedLang.ui.uploadTitle}</p>
            </div>
        </label>

        {uploadedImage && !isAvatarGenerating && (
            <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={generateCharacter}
                onMouseEnter={() => playSfx?.('hover')}
                className={`w-full py-4 bg-black/40 border border-white/10 backdrop-blur-md ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95`}
            >
                <LucideCamera size={16} />
                {selectedLang.ui.generateBtn}
            </motion.button>
        )}

        {isAvatarGenerating && (
            <div className="text-center p-4">
                <LucideLoader2 className="animate-spin mx-auto text-[#5C1A1A] mb-2" size={32} />
                <p className="text-[10px] italic text-[#8B7355] animate-pulse">{selectedLang.loading}</p>
            </div>
        )}
    </div>
);

const GalleryView = ({ selectedLang, userAvatar, setViewMode, setTodos, playSfx }) => {
    // [V10 UPDATE: Cinematic Editorial 3x3 Grid]
    const gridItems = [
        { id: 1, type: 'text', title: 'START THE JOURNEY', subtitle: 'Enter the Core' },
        { id: 2, type: 'image', title: 'MEMORY', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=300' },
        { id: 3, type: 'text', title: 'NEXT STOP: SEOUL', subtitle: 'Flight 88' },
        { id: 4, type: 'image', title: 'ARCHIVE', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=300' },
        { id: 5, type: 'current', title: '퇴근하고 곧 돌아오겠습니다.', isCenter: true },
        { id: 6, type: 'manor', title: selectedLang.ui.manorTitle },
        { id: 7, type: 'text', title: 'DIGITAL SOUL', subtitle: 'Humanity in Code' },
        { id: 8, type: 'image', title: 'VISION', image: 'https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=300&q=80' },
        { id: 9, type: 'rules', title: 'HOUSE RULES', subtitle: 'No Artificial Empathy' },
    ];

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 h-full py-4 overflow-hidden">
            <div className="text-center">
                <h1 className={`text-4xl font-black ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} mb-1 uppercase tracking-widest leading-none filter drop-shadow-md`}>{selectedLang.ui.galleryTitle}</h1>
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white/50'}`}>Cinematic Editorial</p>
            </div>

            <div className="w-full aspect-square grid grid-cols-3 grid-rows-3 gap-[2px] p-2 bg-[#0A0A0B]/80 backdrop-blur-md border border-white/10 shadow-2xl relative">
                {/* Vintage overlay artifact */}
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('/assets/steampunk_paper_texture.png')]" />

                {gridItems.map((slot, idx) => (
                    <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="w-full h-full relative"
                    >
                        {slot.type === 'current' ? (
                            <button
                                onClick={() => { setViewMode('mission_active'); playSfx?.('click'); }}
                                onMouseEnter={() => playSfx?.('hover')}
                                className={`w-full h-full relative bg-[#0A0A0B] border border-white/20 overflow-hidden group active:scale-95 transition-transform hover:border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] flex flex-col justify-center items-center`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                                <div className="absolute inset-0 flex items-center justify-center p-2 z-0">
                                    {userAvatar?.isTextAvatar ? (
                                        <span className={`font-black text-2xl uppercase text-center leading-tight ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} opacity-80 mix-blend-screen`}>{userAvatar.textName}</span>
                                    ) : (
                                        <img src={userAvatar?.image} className="w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="avatar" />
                                    )}
                                </div>
                                <div className="relative z-20 text-center px-1">
                                    <p className={`text-[8px] font-serif italic mb-1 opacity-70 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'}`}>Sean's Persona</p>
                                    <h4 className={`text-[10px] font-black uppercase tracking-widest leading-tight ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white'}`}>{slot.title}</h4>
                                </div>
                            </button>
                        ) : slot.type === 'manor' ? (
                            <button
                                onClick={() => { setViewMode('home_interior'); setTodos(p => ({ ...p, home: true })); playSfx?.('click'); }}
                                onMouseEnter={() => playSfx?.('hover')}
                                className={`w-full h-full relative bg-[#121214] flex flex-col items-center justify-center hover:bg-white/5 transition-colors group active:scale-95 border border-transparent hover:border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}]/50`}
                            >
                                <LucideLayout size={24} className={`mb-2 opacity-50 group-hover:opacity-100 transition-opacity ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white'}`} />
                                <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{slot.title}</span>
                            </button>
                        ) : slot.type === 'image' ? (
                            <div className="w-full h-full relative overflow-hidden bg-black grayscale hover:grayscale-0 transition-all duration-1000 group">
                                <img src={slot.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 group-hover:scale-110" alt="archive" />
                                <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 text-white/80 text-[7px] font-black uppercase tracking-widest backdrop-blur-sm">{slot.title}</div>
                            </div>
                        ) : slot.type === 'rules' ? (
                            <div className={`w-full h-full relative bg-[${THEME_CONFIG[selectedLang.id]?.accent || '#555'}]/10 flex flex-col items-center justify-center text-center p-2 border border-white/5 hover:bg-white/10 transition-colors`}>
                                <LucideInfo size={16} className={`mb-1 opacity-60 ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white'}`} />
                                <span className={`font-black text-[9px] uppercase leading-none mb-1 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'}`}>{slot.title}</span>
                                <span className="text-[7px] font-serif italic text-white/50 leading-tight uppercase">{slot.subtitle}</span>
                            </div>
                        ) : (
                            <div className="w-full h-full relative bg-[#0D0D10] flex flex-col items-center justify-center p-2 text-center border border-white/5 hover:border-white/20 transition-colors">
                                <span className={`font-black text-[9px] uppercase leading-tight mb-1 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white/80'}`}>{slot.title}</span>
                                <span className={`text-[7px] font-serif italic leading-none ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white/40'}`}>{slot.subtitle}</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 text-center px-8 border-t border-white/10 pt-4">
                "Digital Body. Analog Soul."
            </p>
        </div>
    );
};

const ManorView = ({ selectedLang, setViewMode, userAvatar, candleLit, setCandleLit, gearsSpinning, setGearsSpinning, loreText, playSfx }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4">
        <button onClick={() => { setViewMode('gallery'); playSfx?.('click'); }} className="text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1">
            <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
        </button>

        <PaperCard className={`w-full flex-1 max-h-[75vh] p-0 border border-[${THEME_CONFIG[selectedLang.id]?.border || '#333'}] bg-transparent relative overflow-hidden shadow-2xl backdrop-blur-md`}>
            {/* Ambient Background with subtle noise/vignette */}
            <div
                className="absolute inset-0 bg-center bg-cover opacity-10 mix-blend-overlay"
                style={{ backgroundImage: "url('/assets/steampunk_manor_background.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

            <div className="relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar">
                <div className="w-full flex justify-between mb-8 px-2">
                    <div className="cursor-pointer hover:scale-110 transition-transform flex items-center gap-2" onClick={() => setCandleLit(!candleLit)} onMouseEnter={() => playSfx?.('hover')}>
                        <LucideFlame size={20} className={candleLit ? `text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]` : 'text-white/20'} />
                        <span className="text-[8px] uppercase tracking-widest text-white/30 font-black hidden sm:block">Aether Core</span>
                    </div>
                    <div className="cursor-pointer hover:rotate-90 transition-transform flex items-center gap-2" onClick={() => setGearsSpinning(!gearsSpinning)} onMouseEnter={() => playSfx?.('hover')}>
                        <span className="text-[8px] uppercase tracking-widest text-white/30 font-black hidden sm:block">Sync</span>
                        <motion.div animate={{ rotate: gearsSpinning ? 360 : 0 }} transition={{ duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }}>
                            <LucideOrbit size={20} className={`text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}]`} />
                        </motion.div>
                    </div>
                </div>

                <div className={`relative w-28 h-28 mb-4 transition-all duration-700 ${candleLit ? '' : 'brightness-50'}`}>
                    <div className="absolute inset-0 border-4 border-[#C5A059] rounded-full shadow-[0_0_20px_rgba(197,160,89,0.3)]" />
                    <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-2 border-2 border-[#8B7355]/40 shadow-inner">
                        {userAvatar?.image ? (
                            <img src={userAvatar.image} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-[#C5A059] font-black text-xl text-center uppercase drop-shadow-md">{userAvatar?.textName?.charAt(0)}</span>
                        )}
                    </div>
                </div>

                <h3 className={`text-xl font-serif font-black ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} mb-6 uppercase tracking-[0.3em] text-center leading-none`}>{selectedLang.ui.manorTitle}</h3>

                <div className={`w-full flex-1 bg-black/40 backdrop-blur-sm p-5 border-l border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}]/30 rounded-r-lg font-mono text-[10px] ${THEME_CONFIG[selectedLang.id]?.text || 'text-white/80'} leading-relaxed relative overflow-y-auto no-scrollbar shadow-inner`}>
                    {loreText}<span className={`inline-block w-1.5 h-3 bg-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] ml-1 animate-ping`} />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-4 border-t border-white/10">
                    <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => playSfx?.('click')} onMouseEnter={() => playSfx?.('hover')}>
                        <LucideCompass size={18} className={`text-white/40 group-hover:text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] transition-colors`} />
                        <span className={`text-[9px] font-black uppercase text-white/40 group-hover:text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] tracking-widest`}>{selectedLang.ui.manorHeirlooms}</span>
                    </motion.div>
                    <div className="flex flex-col items-center gap-2 opacity-20 pointer-events-none">
                        <LucideMapPin size={18} className="text-white" />
                        <span className="text-[9px] font-black uppercase text-white tracking-widest">{selectedLang.ui.manorEstate}</span>
                    </div>
                </div>
            </div>
        </PaperCard>
    </motion.div>
);

// [V9 UPDATE: MissionView Redesign with IT-tech effects]
const MissionView = ({ selectedLang, setViewMode, PROJECTS, previewId, handlePreviewVote, isAuthenticated, setIsAuthenticated, oracleMessage, setStep, setTodos, playSfx }) => (
    <div className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-4 py-4 overflow-hidden px-4 scanline">
        <button
            onClick={() => { setViewMode('gallery'); playSfx?.('click'); }}
            className="text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1 transition-all hover:translate-x-1"
        >
            <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
        </button>

        <div className="w-full flex-1 flex flex-col overflow-hidden">
            <PaperCard className="py-4 px-6 border-[#C5A059] shadow-lg mb-4 shrink-0 bg-paper aether-glow">
                <h3 className="text-[10px] font-black text-[#5C1A1A] uppercase tracking-[0.2em] flex items-center gap-1 border-b border-black/5 pb-2">
                    <LucideInfo size={14} /> {selectedLang.ui.authTitle}
                </h3>
                {!isAuthenticated ? (
                    <button onClick={() => { setIsAuthenticated(true); playSfx?.('forge'); }} className="w-full mt-2 py-3 bg-[#1A1612] text-[#C5A059] text-[10px] font-black uppercase border border-[#C5A059]/40 hover:bg-[#5C1A1A] hover:text-white transition-all shadow-md active:scale-95">
                        {selectedLang.ui.authBtn}
                    </button>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-[#556B2F] font-black bg-[#556B2F]/10 p-2 mt-2 border border-[#556B2F]/30 uppercase text-[10px]">
                        <LucideCheckCircle size={16} /> {selectedLang.ui.authDone}
                    </div>
                )}
            </PaperCard>

            <div className="flex-1 w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-start gap-4 pb-4 px-2">
                {PROJECTS.map((proj) => {
                    const isSelected = previewId === proj.id;
                    const isInactive = previewId && !isSelected;
                    return (
                        <div key={proj.id} className={`min-w-[280px] h-full snap-center transition-all duration-500 ${isInactive ? 'opacity-20 grayscale scale-90 blur-[1px]' : 'scale-100'}`}>
                            <PaperCard
                                onClick={() => { if (!isInactive && isAuthenticated) { handlePreviewVote(proj.id); playSfx?.('click'); } }}
                                className={`h-full cursor-pointer transition-all duration-700 overflow-hidden border-2 p-0 shadow-2xl flex flex-col relative ${isSelected ? 'border-[#C5A059] bg-[#2C241B]/20 aether-glow' : 'border-[#2C241B] hover:border-[#8B7355] bg-black/5'}`}
                            >
                                {isSelected && <div className="absolute inset-0 bg-[#C5A059]/5 animate-pulse pointer-events-none" />}
                                <div className="p-6 flex flex-col flex-1 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-mono uppercase px-2 py-1 border transition-colors ${isSelected ? 'border-[#5C1A1A] text-[#5C1A1A] bg-[#5C1A1A]/10' : 'border-[#8B7355] text-[#8B7355]'}`}>Case #0{proj.id}</span>
                                        {isSelected && <LucideSparkles className="text-[#C5A059] animate-spin-slow" size={18} />}
                                    </div>
                                    <h4 className={`text-xl font-serif font-black uppercase tracking-wider mb-4 leading-tight transition-colors ${isSelected ? 'text-[#C5A059]' : 'text-[#8B7355]'}`}>{proj.title}</h4>
                                    <p className="text-[#8B7355] text-[11px] font-medium leading-relaxed italic opacity-80 mb-6 flex-1">
                                        {proj.desc}
                                    </p>

                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-auto">
                                                <div className="bg-[#1A1612] p-6 border-l-4 border-[#C5A059] mb-4 shadow-inner relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#C5A059]/30 animate-scan-line" />
                                                    <div className="absolute top-1 right-1"><LucideFeather size={14} className="text-[#5C1A1A] opacity-30" /></div>
                                                    <p className="text-[#f4e4bc] text-[11px] leading-relaxed text-center font-serif italic">"{oracleMessage || selectedLang.ui.consulting}"</p>
                                                </div>
                                                <button
                                                    onClick={() => { playSfx?.('shutter'); setStep('trailer'); setTodos(p => ({ ...p, voted: true })); }}
                                                    className="w-full py-4 bg-[#5C1A1A] text-white font-black uppercase text-xs tracking-[0.2em] border-b-4 border-black active:scale-95 transition-transform shadow-2xl hover:bg-[#7D2626]"
                                                >
                                                    {selectedLang.ui.sealBtn}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {!isSelected && isAuthenticated && (
                                        <div className="mt-auto pt-4 border-t border-[#8B7355]/10 text-[9px] font-black uppercase text-[#8B7355] text-center tracking-widest animate-pulse">Tap to examine destiny</div>
                                    )}
                                </div>
                            </PaperCard>
                        </div>
                    );
                })}
            </div>
            <div className="text-center py-2"><span className="text-[8px] font-black uppercase text-[#8B7355] tracking-widest opacity-60 flex items-center gap-2">
                <LucideArrowLeft size={10} className="animate-bounce-x" /> Swipe Aether Cases <LucideArrowRight size={10} className="animate-bounce-x" />
            </span></div>
        </div>
    </div>
);

const LanguageCard = ({ lang, idx, onSelect, setSpiritHint, isDimmable, isSelected, isAnySelected, stagedLang }) => {
    const [holdProgress, setHoldProgress] = useState(0);
    const holdTimer = useRef(null);
    const progressInterval = useRef(null);
    const lastHint = useRef("");
    const cardRef = useRef(null);

    const updateHint = (msg) => {
        if (lastHint.current !== msg) {
            lastHint.current = msg;
            setSpiritHint(msg);
        }
    };

    const handleDrag = (event, info) => {
        // Calculate distance from center of screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dist = Math.sqrt(Math.pow(info.point.x - centerX, 2) + Math.pow(info.point.y - centerY, 2));

        // Point 3: Faster audio trigger (within 350px of center)
        if (dist < 350 && !isHolding) {
            if (AudioManager.currentTheme?.src.split('/').pop() !== `${lang.id}-theme.mp3`) {
                AudioManager.playTheme(lang.id, 0.25);
            }
        }
    };

    const handleDragEnd = (event, info) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dist = Math.sqrt(Math.pow(info.point.x - centerX, 2) + Math.pow(info.point.y - centerY, 2));

        // Point 4: Stricter center detection (100px instead of 150px) to prevent accidental click-triggers
        if (dist < 100) {
            onSelect(lang);
            AudioManager.playSfx('click');
        }
    };

    const handleStart = (e) => {
        if (!isSelected) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        e.currentTarget.setPointerCapture(e.pointerId);
        setHoldProgress(1);
        updateHint("Synchronizing multiversal anchor...");

        AudioManager.playTheme(lang.id);

        const startTime = Date.now();
        const duration = 5000;

        holdTimer.current = setTimeout(() => {
            clearInterval(progressInterval.current);
            setHoldProgress(100);
            updateHint("Fate Sealed.");
            onSelect(lang);
        }, duration);

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / duration) * 100, 100);
            setHoldProgress(percentage);

            if (percentage > 90) updateHint("Fate is nearly sealed...");
            else if (percentage > 50) updateHint("Stabilizing temporal rift...");
            else if (percentage > 20) updateHint("Anchor established. Holding...");
        }, 50);
    };

    const handleEnd = (e) => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
            AudioManager.stopTheme();
        }
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
        if (e && e.currentTarget && e.pointerId) {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { }
        }
        setHoldProgress(0);
        updateHint("");
    };

    const isHolding = holdProgress > 0;

    return (
        <motion.div
            ref={cardRef}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.1, zIndex: 100, rotate: 2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isDimmable ? 0.6 : 1,
                scale: isSelected ? (isHolding ? 1.5 : 1.1) : (isAnySelected ? 0.95 : 1),
                zIndex: isSelected ? 1000 : 1,
                filter: isDimmable ? 'brightness(0.4) grayscale(50%)' : 'brightness(1) grayscale(0%)',
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className={`relative w-full h-full cursor-grab active:cursor-grabbing group rounded-lg overflow-hidden shadow-2xl select-none transition-shadow ${isHolding ? 'shadow-[0_0_100px_rgba(255,255,255,0.4)]' : ''}`}
            onPointerDown={handleStart}
            onPointerUp={handleEnd}
            onPointerLeave={handleEnd}
            onPointerCancel={handleEnd}
            onContextMenu={(e) => e.preventDefault()}
            style={{ touchAction: 'none' }}
        >
            <motion.div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{
                    backgroundImage: `url(${lang.image})`,
                    scale: isHolding ? 1.0 : 1.5,
                    filter: isHolding ? 'grayscale(0%)' : (isSelected ? 'grayscale(0%)' : 'grayscale(100%)'),
                }}
                animate={{
                    scale: isHolding ? 1.0 : 1.5,
                }}
            />

            {/* Hold Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-[#C5A059] z-40 transition-all duration-75" style={{ width: `${holdProgress}%` }} />

            {/* Visual Pulse Overlay */}
            {isHolding && (
                <motion.div
                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 bg-white z-20 pointer-events-none"
                />
            )}

            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 ${isHolding ? 'opacity-90' : 'opacity-60 group-hover:opacity-80'}`} />

            <div className="absolute inset-0 p-2 flex flex-col items-center justify-center z-30 text-center">
                <motion.h3
                    animate={{ opacity: isDimmable ? 0.8 : 1 }}
                    className={`text-[12px] md:text-xl font-black text-white font-serif uppercase tracking-widest leading-tight mb-2 transition-transform duration-500 ${isHolding ? 'scale-110' : ''}`}
                >
                    {lang.name}
                </motion.h3>
                <div className="overflow-hidden h-4 w-full flex justify-center">
                    <motion.span
                        animate={{ y: isHolding || isSelected ? 0 : 20 }}
                        className="text-[7px] md:text-[9px] text-[#C5A059] uppercase tracking-[0.3em] font-black block"
                    >
                        {isSelected ? (isHolding ? `Journeying... ${Math.round(holdProgress)}%` : 'HOLD TO START JOURNEY') : 'CASE LOCKED'}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

const LanguageView = ({ LANGUAGES, handleLanguageSelect, setSpiritHint }) => {
    const [stagedLang, setStagedLang] = useState(null);

    // [V19] Effect to play Mina's guidance on mount
    useEffect(() => {
        AudioManager.playMina(stagedLang ? stagedLang.id : 'ko', stagedLang ? 'confirm' : 'language');
    }, [stagedLang]);

    const onCardClick = (lang) => {
        if (!stagedLang) {
            setStagedLang(lang);
            AudioManager.playSfx(`${lang.id}-click`);
        }
    };

    const onHoldComplete = (lang) => {
        handleLanguageSelect(lang);
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-2 md:p-4">
            <div id="language-grid" className="w-full aspect-square grid grid-cols-3 grid-rows-3 gap-1.5 md:gap-3 bg-black/60 backdrop-blur-3xl p-3 md:p-6 border border-white/10 rounded-3xl shadow-[0_0_120px_rgba(0,0,0,0.9)] relative overflow-hidden">

                {/* Background "Flow" Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] animate-pulse pointer-events-none" />

                {/* Grid Mapping */}
                {[0, 1, 2, 3, 'center', 4, 5, 6, 7].map((pos, i) => {
                    if (pos === 'center') {
                        return (
                            <div key="center-slot" className="relative z-50">
                                <AnimatePresence mode="wait">
                                    {stagedLang ? (
                                        <motion.div
                                            key={stagedLang.id}
                                            id="center-slot"
                                            initial={{ scale: 0, opacity: 0, rotate: -20 }}
                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                            exit={{ scale: 0, opacity: 0, rotate: 20 }}
                                            className="w-full h-full cursor-pointer z-[2000]"
                                            onClick={() => setStagedLang(null)}
                                        >
                                            <LanguageCard
                                                lang={stagedLang}
                                                isSelected={true}
                                                isAnySelected={true}
                                                onSelect={onHoldComplete}
                                                setSpiritHint={setSpiritHint}
                                            />
                                            {/* Cancel Hint */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
                                            >
                                                <span className="text-[8px] text-white/80 uppercase tracking-widest font-black">Tap to Cancel</span>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="instruction"
                                            className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-white/5 border border-white/10 rounded-lg shadow-inner w-full h-full"
                                        >
                                            <LucideCompass className="text-[#C5A059] mb-1 md:mb-2 animate-spin-slow" size={20} />
                                            <h2 className="text-[8px] md:text-xs font-black text-white/80 uppercase tracking-[0.4em] leading-tight text-center">
                                                Journey Flow
                                            </h2>
                                            <p className="text-[6px] md:text-[7px] font-serif italic text-white/40 mt-1 md:mt-2 uppercase tracking-widest leading-relaxed text-center">
                                                Select Case to Begin
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }

                    const lang = LANGUAGES[pos];
                    const isDimmable = stagedLang && stagedLang.id !== lang.id;
                    const isOriginal = !stagedLang || stagedLang.id !== lang.id;

                    return (
                        <div key={`slot-${i}`} className="relative h-full w-full">
                            {isOriginal && (
                                <LanguageCard
                                    lang={lang}
                                    idx={pos}
                                    isDimmable={isDimmable}
                                    isAnySelected={!!stagedLang}
                                    onSelect={onCardClick}
                                    setSpiritHint={setSpiritHint}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <motion.p
                animate={{ opacity: stagedLang ? 0.8 : 0.2 }}
                className="text-[9px] font-black uppercase tracking-[0.8em] text-white mt-12 text-center"
            >
                {stagedLang ? `INVITING THE ${stagedLang.name} MULTIVERSE...` : "THE MANOR AWAITS YOUR SOUL'S VOYAGE."}
            </motion.p>

            {/* [V19] Mina's Directive localized to Language Selection */}
            <SmokeAssistant
                isVisible={true}
                activeStep="language"
                text={stagedLang ? stagedLang.ui.confirmTitle : LANGUAGES[0].welcome}
            />
        </div>
    );
};

// All previous inline views have been moved to the top level

const ConfirmView = ({ selectedLang, confirmLanguage, theme }) => (
    <GlassCard id="confirm-card" className="w-full max-w-sm p-10 flex flex-col items-center space-y-6">
        <h2 className={`text-xl font-black ${theme?.text || 'text-white'} uppercase tracking-widest text-center`}>{selectedLang.ui.confirmTitle}</h2>
        <div className="flex items-center gap-4 text-4xl mb-2">
            <span className="opacity-20"><LucideScale size={24} /></span>
            <span className="filter drop-shadow-lg">{selectedLang.flag}</span>
            <span className="opacity-20"><LucideScale size={24} className="scale-x-[-1]" /></span>
        </div>
        <button
            onClick={confirmLanguage}
            className={`w-full py-5 bg-white/5 ${theme?.text || 'text-white'} font-black uppercase text-xs tracking-[0.3em] hover:bg-white/10 active:scale-95 transition-all border border-white/10 shadow-2xl backdrop-blur-md`}
        >
            {selectedLang.ui.confirmBtn}
        </button>
    </GlassCard>
);

const App = () => {
    const [isOpeningFinished, setIsOpeningFinished] = useState(false);
    const [step, setStep] = useState('language');
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[1]); // V20: English (GB)

    // V20: Immediate voice guidance on load (ENSURE EN-GB)
    useEffect(() => {
        if (step === 'language' && !isOpeningFinished) {
            // Wait for opening to start
        }
    }, [step]);
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
    const [spiritHint, setSpiritHint] = useState("");
    const [isSpiritSensing, setIsSpiritSensing] = useState(false);
    const [whisper, setWhisper] = useState("");

    // [V9 UPDATE: Layered Audio & BGM]
    const bgmRef = useRef(null);
    const [bgmVol, setBgmVol] = useState(0.2);

    useEffect(() => {
        // [V8 UPDATE: Ambient whispers cycle]
        const whisperInterval = setInterval(async () => {
            if (apiKey && step !== 'language') {
                try {
                    const res = await callGemini({
                        contents: [{ parts: [{ text: "Generate 1 cryptic steampunk word or very short phrase (max 2 words) about souls, gears, or time. Uppercase only." }] }]
                    });
                    setWhisper(res?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "");
                } catch (e) { /* silent */ }
            }
        }, 15000);
        return () => clearInterval(whisperInterval);
    }, [step]);

    useEffect(() => {
        // Initialize BGM
        bgmRef.current = new Audio('/assets/sounds/manor-ambience.mp3'); // Use local ambience
        bgmRef.current.loop = true;
        bgmRef.current.volume = bgmVol;
        return () => bgmRef.current.pause();
    }, []);

    useEffect(() => {
        if (bgmRef.current) bgmRef.current.volume = bgmVol;
    }, [bgmVol]);

    // Accumulate sound layers as user progresses
    useEffect(() => {
        if (step === 'dashboard') setBgmVol(0.4);
        if (todos.voted) setBgmVol(0.6);
    }, [step, todos]);

    const playSfx = (type) => {
        const currentTheme = THEME_CONFIG[selectedLang?.id] || THEME_CONFIG.en;

        const sounds = {
            click: `/assets/sounds/${selectedLang?.id || 'en'}-click.mp3`,
            transition: `/assets/sounds/${selectedLang?.id || 'en'}-transition.mp3`,
            welcome: '/assets/sounds/welcome-voice.mp3'
        };

        const audioSrc = sounds[type] || sounds.click;
        const audio = new Audio(audioSrc);

        audio.play().catch(e => {
            console.warn(`Sound ${type} for ${selectedLang?.id} not found, using default.`);
            // Silent fallback to avoid breaking UI
        });
    };

    const [loreText, setLoreText] = useState("");

    useEffect(() => {
        if (viewMode === 'home_interior' && userAvatar?.lore) {
            let i = 0;
            setLoreText("");
            const timer = setInterval(() => {
                setLoreText(prev => prev + userAvatar.lore.charAt(i));
                i++;
                if (i >= userAvatar.lore.length) {
                    clearInterval(timer);
                    // [V9: Pre-fetch next logic after lore finished]
                    preFetchVoice(selectedLang.ui.todoDone, selectedLang.voice);
                }
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
        if (!apiKey || !text) return;

        // [V8 UPDATE: Check Cache Path first]
        if (audioCache[text]) {
            new Audio(audioCache[text]).play();
            return;
        }

        try {
            const prompt = `Speak with a 19th-century narrator style in ${selectedLang.name} language: ${text}`;
            const response = await callGemini({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedLang.voice || "Zephyr" } } }
                }
            }, "generateContent", "gemini-1.5-flash");

            if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const audioData = response.candidates[0].content.parts[0].inlineData.data;
                const sampleRate = 24000;
                const wavUrl = pcmToWav(audioData, sampleRate);

                // Cache for later
                setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
                new Audio(wavUrl).play();
            }
        } catch (err) { console.error("TTS Error:", err); }
    };

    // [V8 UPDATE: Pre-fetch Logic to eliminate sync issues]
    const preFetchVoice = async (text, langVoice, langName) => {
        if (!apiKey || !text || audioCache[text]) return;
        try {
            const response = await callGemini({
                contents: [{ parts: [{ text: `Speak with a 19th-century narrator style in ${langName} language: ${text}` }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: langVoice || "Zephyr" } } }
                }
            }, "generateContent", "gemini-1.5-flash");

            if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const audioData = response.candidates[0].content.parts[0].inlineData.data;
                const wavUrl = pcmToWav(audioData, 24000);
                setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
            }
        } catch (err) { /* Silent fail for pre-fetch */ }
    };

    // [V7 UPDATE: Restored robust audio buffer processing, hoisted standard function]
    function pcmToWav(base64, sampleRate) {
        const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
        const view = new DataView(new ArrayBuffer(44 + buffer.byteLength));
        const writeString = (offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
        writeString(0, 'RIFF'); view.setUint32(4, 36 + buffer.byteLength, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data');
        view.setUint32(40, buffer.byteLength, true); new Uint8Array(view.buffer, 44).set(new Uint8Array(buffer));
        return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }));
    };

    // [V19] Consolidated Language Selection Logic
    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setStep('confirm');
        AudioManager.playSfx('click');
        AudioManager.playMina(lang.id, 'confirm');

        // [V10: Personalized BGM Switching]
        if (bgmRef.current) {
            bgmRef.current.src = lang.bgm;
            bgmRef.current.play();
        }

        // [V10: Sequence pre-fetching]
        setTimeout(() => {
            preFetchVoice(lang.ui.confirmTitle, lang.voice, lang.name);
            preFetchVoice(lang.welcome, lang.voice, lang.name);
        }, 300);
    };

    const confirmLanguage = () => {
        setStep('intro');
        AudioManager.playMina(selectedLang.id, 'auth');

        // [V10: Delay speech slightly]
        setTimeout(() => {
            speakText(selectedLang.welcome);
            playSfx('welcome');
        }, 1000);
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
            // [V7 UPDATE: Synchronized text avatar prompt from user source]
            const prompt = `Create a short, mysterious 19th-century steampunk persona for someone named "${userName}". Output in ${selectedLang.name}. Max 40 words.`;
            const loreResult = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            const lore = loreResult?.candidates?.[0]?.content?.parts?.[0]?.text || `The enigmatic ${userName}.`;
            setUserAvatar({ image: null, textName: userName, lore, isTextAvatar: true });
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } catch (err) {
            console.error(err);
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

        // [V7 UPDATE: Restored atmospheric fallback lore and Imagen race logic from user source]
        let generatedLore = "A mysterious soul whose visage the machine could not fully comprehend.";

        try {
            const loreResult = await callGemini({
                contents: [{
                    role: "user",
                    parts: [
                        { text: `Analyze this image and create a 19th-century steampunk persona. Output in ${selectedLang.name} language. Max 50 words.` },
                        { inlineData: { mimeType: "image/png", data: uploadedImage } }
                    ]
                }]
            });
            if (loreResult?.candidates?.[0]?.content?.parts?.[0]?.text) {
                generatedLore = loreResult.candidates[0].content.parts[0].text;
            }
            setAvatarLore(generatedLore);

            // 20 Seconds Timeout Promise
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 20000));

            const imageFetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: { prompt: `Vintage oil painting style, steampunk character portrait based on description: ${generatedLore}. Sepia tones, victorian clothing, brass goggles, etching texture.` },
                    parameters: { sampleCount: 1 }
                }),
            }).then(res => res.json());

            // Race between Image API and 20s Timeout
            const imageData = await Promise.race([imageFetchPromise, timeoutPromise]);

            if (!imageData || !imageData.predictions || !imageData.predictions[0]) {
                throw new Error("Invalid image data structure");
            }

            const generatedUrl = `data:image/png;base64,${imageData.predictions[0].bytesBase64Encoded}`;

            setUserAvatar({ image: generatedUrl, lore: generatedLore, isTextAvatar: false });
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } catch (err) {
            console.error("Generation Error or Timeout:", err);
            // Fallback: Use Text Avatar if image generation hangs/fails
            setUserAvatar({ image: null, textName: "Architect", lore: generatedLore, isTextAvatar: true });
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
            // [V7 UPDATE: Restored detailed prophecy prompt from user source]
            const prompt = `The user is considering the path: "${proj.title}". Write a mysterious, victorian-style prophecy about this choice. Output in ${selectedLang.name}. Max 30 words.`;
            const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            setOracleMessage(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
        } catch (err) { console.error(err); }
    };

    // --- View Templates ---

    // GalleryView, ManorView, MissionView, TrailerView, LanguageView, ConfirmView 
    // were manually defined inside App previously, causing the re-render focus bug.
    // They are now properly hoisted and we removed the duplicate legacy ones.

    const ManorView = ({ selectedLang, setViewMode, userAvatar, candleLit, setCandleLit, gearsSpinning, setGearsSpinning, loreText }) => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4">
            <button onClick={() => setViewMode('gallery')} className="text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1">
                <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
            </button>

            <GlassCard className="w-full flex-1 max-h-[70vh] p-0 border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                <div className="relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar">
                    <div className="w-full flex justify-between mb-4 px-2">
                        <div className="cursor-pointer hover:scale-110 transition-transform opacity-30 hover:opacity-100" onClick={() => setCandleLit(!candleLit)}>
                            <LucideFlame size={24} className={candleLit ? 'text-white' : 'text-white/20'} />
                        </div>
                        <div className="cursor-pointer hover:rotate-90 transition-transform opacity-30 hover:opacity-100" onClick={() => setGearsSpinning(!gearsSpinning)}>
                            <motion.div animate={{ rotate: gearsSpinning ? 360 : 0 }} transition={{ duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }}>
                                <LucideSettings size={24} className="text-white" />
                            </motion.div>
                        </div>
                    </div>

                    <div className={`relative w-28 h-28 mb-4 transition-all duration-700 ${candleLit ? '' : 'brightness-50'}`}>
                        <div className="absolute inset-0 border border-white/20 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-1">
                            {userAvatar?.image ? (
                                <img src={userAvatar.image} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="text-white/50 font-black text-xl text-center uppercase">{userAvatar?.textName?.charAt(0)}</span>
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-white mb-4 uppercase tracking-[0.3em] text-center leading-none tracking-widest">{selectedLang.ui.manorTitle || "THE CLOCKWORK HEART"}</h3>

                    <div id="lore-box" className="w-full flex-1 bg-black/40 p-5 border border-white/5 rounded-xl font-mono text-[11px] text-white/70 leading-relaxed overflow-y-auto no-scrollbar backdrop-blur-md">
                        {loreText}<span className="inline-block w-1.5 h-3 bg-white/50 ml-1 animate-ping" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-white/10">
                        <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <LucideTrophy size={18} className="text-white/40 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white tracking-widest transition-colors">{selectedLang.ui.manorHeirlooms || "HEIRLOOMS"}</span>
                        </motion.div>
                        <div className="flex flex-col items-center gap-2 opacity-30 cursor-not-allowed">
                            <LucideMapPin size={18} className="text-white/40" />
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{selectedLang.ui.manorEstate || "ESTATE"}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );

    const MissionView = ({ selectedLang, setViewMode, PROJECTS, previewId, handlePreviewVote, isAuthenticated, setIsAuthenticated, oracleMessage, setStep, setTodos }) => (
        <div className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-4 py-4 overflow-hidden">
            <button onClick={() => setViewMode('gallery')} className="text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1 px-2">
                <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
            </button>

            <div className="w-full space-y-4 overflow-y-auto no-scrollbar flex-1 pb-10 px-2 lg:px-4">
                <GlassCard className="py-4 px-6 border-white/10 shadow-2xl">
                    <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-3">
                        <LucideInfo size={14} /> {selectedLang.ui.authTitle}
                    </h3>
                    {!isAuthenticated ? (
                        <button onClick={() => setIsAuthenticated(true)} className="w-full mt-3 py-3 bg-white/5 text-white/80 text-[10px] font-black uppercase border border-white/10 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md active:scale-95">
                            {selectedLang.ui.authBtn}
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-white/80 font-black bg-white/5 p-3 mt-3 border border-white/10 uppercase text-[10px] backdrop-blur-md">
                            <LucideCheckCircle size={16} className="text-green-500/80" /> {selectedLang.ui.authDone}
                        </div>
                    )}
                </GlassCard>

                <div className="space-y-4">
                    {PROJECTS.map((proj) => {
                        const isSelected = previewId === proj.id;
                        const isInactive = previewId && !isSelected;
                        return (
                            <motion.div key={proj.id} layout className={`${isInactive ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                                <GlassCard
                                    onClick={() => !isInactive && isAuthenticated && handlePreviewVote(proj.id)}
                                    className={`cursor-pointer transition-all duration-500 overflow-hidden border p-0 ${isSelected ? 'border-white/30 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-white/5 opacity-80 hover:border-white/20 hover:bg-white/5'}`}
                                >
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] font-mono mb-1 block uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-white/30'}`}>Case #0{proj.id}</span>
                                            <h4 className={`text-base font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-white/60'}`}>{proj.title}</h4>
                                        </div>
                                        {isSelected && <LucideSparkles className="text-white/80 animate-pulse" size={18} />}
                                    </div>
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-5 pt-0 border-t border-white/5 bg-black/40 backdrop-blur-md">
                                                <div className="mb-5 p-4 bg-white/5 border border-white/10 rounded-sm">
                                                    <p className="text-white/80 text-[11px] italic leading-relaxed text-center font-serif">"{oracleMessage || selectedLang.ui.consulting}"</p>
                                                </div>
                                                <button onClick={() => { setStep('trailer'); setTodos(p => ({ ...p, voted: true })); }} className="w-full py-4 bg-white/10 text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white/20 active:scale-95 transition-all border border-white/20">
                                                    {selectedLang.ui.sealBtn}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const TrailerView = ({ selectedLang, resetStates, setStep }) => (
        <GlassCard className="text-center w-full max-w-sm mx-auto p-10 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
            >
                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-md">
                    <LucideLock className="w-8 h-8 text-white/80" />
                </div>
            </motion.div>

            <div className="space-y-4 mb-10 w-full">
                <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white leading-tight">
                    {selectedLang.ui.fateSealed}
                </h2>
                <div className="w-12 h-[1px] bg-white/20 mx-auto" />
                <p className="text-white/50 italic text-[11px] leading-relaxed font-serif tracking-widest uppercase">
                    The network sleeps.
                </p>
            </div>

            <button
                onClick={() => { setStep('language'); resetStates(); }}
                className="w-full py-4 bg-white/5 text-white/80 font-black uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
            >
                {selectedLang.ui.returnGallery}
            </button>
        </GlassCard>
    );

    const useSpiritSense = async () => {
        if (!apiKey || isSpiritSensing) return;
        setIsSpiritSensing(true);
        playSfx('click');
        try {
            const prompt = `You are the House Spirit of the Lord Manor. Give a very short, cryptic, steampunk-style hint about what the guest should do next. Current step: ${step}, View: ${viewMode}. Output in ${selectedLang.name}. Max 15 words.`;
            const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            setSpiritHint(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
            setTimeout(() => setSpiritHint(""), 5000);
        } catch (err) { console.error(err); }
        finally { setIsSpiritSensing(false); }
    };

    // [V19] Duplicate implementations removed and consolidated above.
    // The previous block was erroneously duplicated during the V19 refactor.
    // Functions handleLanguageSelect and confirmLanguage are now uniquely defined at L1038.

    const resetStates = () => {
        setPreviewId(null);
        setOracleMessage("");
        setTodos({ avatar: false, home: false, voted: false });
    };

    const currentTheme = THEME_CONFIG[selectedLang?.id] || THEME_CONFIG.ko;

    // [V19] Effect to handle TTS for later steps
    // V20: Fix default language logic & first voice trigger
    useEffect(() => {
        if (isOpeningFinished && step === 'language') {
            // Explicitly play English mina on first load if default
            AudioManager.playMina('en', 'language');
        }
    }, [isOpeningFinished]);

    return (
        <div className={`relative w-full h-screen ${currentTheme.bg} ${currentTheme.text} ${currentTheme.font} overflow-hidden transition-colors duration-1000`}>

            {/* [V12] Cinematic Video Background */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute min-w-full min-h-full object-cover opacity-50 mix-blend-screen scale-105"
                    src="https://assets.codepen.io/3364143/7btrrd.mp4"
                />
                {/* Dark Cinematic Gradient & Blur Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 backdrop-blur-[2px]" />
            </div>

            <AnimatePresence>
                {!isOpeningFinished && (
                    <div className="relative z-[10000]">
                        <CinematicOpening onComplete={() => setIsOpeningFinished(true)} />
                    </div>
                )}
            </AnimatePresence>

            {isOpeningFinished && (
                <>
                    {/* API Status Banner */}
                    {!apiKey && (
                        <div className="fixed top-0 left-0 w-full z-[1000] bg-[#5C1A1A] text-[#f4e4bc] py-2 px-4 shadow-xl border-b border-[#C5A059] flex items-center justify-center gap-3">
                            <LucideZap size={16} className="text-[#C5A059] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Linking to Aether... Set VITE_GEMINI_API_KEY
                            </span>
                        </div>
                    )}

                    <AetherWhispers text={whisper} theme={currentTheme} />

                    {/* Main Content Area: V9 Focus-Fixed Layout */}
                    <main className="relative z-10 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step + (selectedLang?.id || '')}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="flex flex-col items-center w-full"
                            >
                                {step === 'language' && (
                                    <LanguageView LANGUAGES={LANGUAGES} handleLanguageSelect={handleLanguageSelect} setSpiritHint={setSpiritHint} />
                                )}
                                {step === 'confirm' && (
                                    <ConfirmView selectedLang={selectedLang} confirmLanguage={confirmLanguage} theme={currentTheme} />
                                )}
                                {/* More steps would follow, refactored to use currentTheme classes */}
                                {step === 'intro' && (
                                    <IntroView
                                        selectedLang={selectedLang}
                                        userName={userName}
                                        setUserName={setUserName}
                                        generateTextCharacter={generateTextCharacter}
                                        isAvatarGenerating={isAvatarGenerating}
                                        handleImageUpload={handleImageUpload}
                                        uploadedImage={uploadedImage}
                                        generateCharacter={generateCharacter}
                                        playSfx={playSfx}
                                    />
                                )}
                                {step === 'dashboard' && (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        {viewMode === 'gallery' && (
                                            <GalleryView
                                                selectedLang={selectedLang}
                                                userAvatar={userAvatar}
                                                setViewMode={setViewMode}
                                                setTodos={setTodos}
                                                playSfx={playSfx}
                                            />
                                        )}
                                        {viewMode === 'home_interior' && (
                                            <ManorView
                                                selectedLang={selectedLang}
                                                setViewMode={setViewMode}
                                                userAvatar={userAvatar}
                                                candleLit={candleLit}
                                                setCandleLit={setCandleLit}
                                                gearsSpinning={gearsSpinning}
                                                setGearsSpinning={setGearsSpinning}
                                                loreText={loreText}
                                                playSfx={playSfx}
                                            />
                                        )}
                                        {viewMode === 'mission_active' && (
                                            <MissionView
                                                selectedLang={selectedLang}
                                                setViewMode={setViewMode}
                                                PROJECTS={PROJECTS}
                                                previewId={previewId}
                                                handlePreviewVote={handlePreviewVote}
                                                isAuthenticated={isAuthenticated}
                                                setIsAuthenticated={setIsAuthenticated}
                                                oracleMessage={oracleMessage}
                                                setStep={setStep}
                                                setTodos={setTodos}
                                                playSfx={playSfx}
                                            />
                                        )}
                                    </div>
                                )}
                                {step === 'trailer' && (
                                    <TrailerView selectedLang={selectedLang} resetStates={resetStates} setStep={setStep} playSfx={playSfx} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    {/* [V19] Mina's Directive global guidance (Post-Language selection) */}
                    {step !== 'language' && (
                        <SmokeAssistant
                            isVisible={true}
                            activeStep={step}
                            text={
                                step === 'confirm' ? selectedLang.ui.confirmTitle :
                                    !todos.avatar ? selectedLang.ui.authTitle :
                                        !todos.home ? selectedLang.ui.manorTitle :
                                            selectedLang.ui.todoDone
                            }
                        />
                    )}

                    {/* Status Widgets: Integrated Assistant Only */}
                    <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-4 items-start pointer-events-none">
                        <AnimatePresence>
                            {spiritHint && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-white/5 backdrop-blur-2xl text-white/90 p-5 border border-white/10 shadow-2xl max-w-[280px] text-[11px] font-medium tracking-wide leading-relaxed relative flex flex-col gap-3 rounded-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                                        <div className="text-[8px] text-white/30 tracking-[0.4em] font-black uppercase">Manor Intelligence</div>
                                    </div>
                                    <div className="italic opacity-80 font-serif text-[13px]">
                                        "{spiritHint}"
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </>
            )}
        </div>
    );
};

export default App;
