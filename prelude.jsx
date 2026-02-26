import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicOpening from './components/CinematicOpening';
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
// [V9 UPDATE: Masterpiece Version Polish]
const BUILD_VERSION = "v1.4.0-clockwork-masterpiece-final"; // V10: Final Polish

const THEME_CONFIG = {
    ko: { bg: 'bg-[#1A1612]', text: 'text-[#E0D0B0]', accent: 'text-[#C5A059]', border: 'border-[#C5A059]', shadow: 'shadow-[#C5A059]/30', font: 'font-serif' },
    en: { bg: 'bg-[#0F172A]', text: 'text-slate-200', accent: 'text-sky-400', border: 'border-sky-500/50', shadow: 'shadow-sky-500/20', font: 'font-sans' },
    ja: { bg: 'bg-[#F8F5F2]', text: 'text-[#2C2C2C]', accent: 'text-[#D0104C]', border: 'border-[#2C2C2C]', shadow: 'shadow-black/10', font: 'font-serif' },
    de: { bg: 'bg-[#120D0B]', text: 'text-[#9A8C81]', accent: 'text-[#B22222]', border: 'border-[#3D3028]', shadow: 'shadow-red-900/40', font: 'font-serif' },
    fr: { bg: 'bg-[#FDFCF0]', text: 'text-[#4A3728]', accent: 'text-[#D4AF37]', border: 'border-[#D4AF37]', shadow: 'shadow-amber-500/20', font: 'font-serif' },
    cn: { bg: 'bg-[#1C1C1C]', text: 'text-[#D4D4D4]', accent: 'text-[#EE1C25]', border: 'border-[#EE1C25]/40', shadow: 'shadow-red-600/20', font: 'font-sans' },
    es: { bg: 'bg-[#F4EBD0]', text: 'text-[#2D2926]', accent: 'text-[#E31837]', border: 'border-[#FFB81C]', shadow: 'shadow-orange-500/20', font: 'font-serif' },
    it: { bg: 'bg-[#003153]', text: 'text-[#FFFFFF]', accent: 'text-[#008C45]', border: 'border-[#CD212A]', shadow: 'shadow-white/10', font: 'font-serif' }
};

const LANGUAGES = [
    {
        id: 'ko', name: '한국어', flag: '🇰🇷',
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
        id: 'en', name: 'English', flag: '🇺🇸',
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
        id: 'ja', name: '日本語', flag: '🇯🇵',
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
        id: 'de', name: 'Deutsch', flag: '🇩🇪',
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
        id: 'fr', name: 'Français', flag: '🇫🇷',
        welcome: "Bienvenue au Lord Manor. Les rouages du destin attendent votre toucher.",
        loading: "Consultation du Chronomètre...",
        ui: {
            authTitle: "Identité Éthérée", authBtn: "Vérifier l'empreinte de l'âme", authDone: "Identité scellée",
            galleryTitle: "ARCHIVES DU MANOIR", gallerySub: "Dossier Historique 1899",
            manorTitle: "Le Coeur Mécanique", manorHeirlooms: "Engrenages Ancestraux", manorEstate: "Domaine",
            returnGallery: "Retour aux Archives", textOptionTitle: "Inscrivez votre nom",
            textInputPlaceholder: "Nom du client...", textSubmitBtn: "Invoquer l'identité",
            uploadTitle: "Scanner le portrait éthéré", generateBtn: "Forger l'âme", generating: "Transmutation...",
            confirmTitle: "Est-ce votre langue maternelle ?", confirmBtn: "Je consens", confirmDone: "Langue liée",
            todoTitle: "Manifeste", todo1: "Forger l'identité", todo2: "Inspecter le coeur", todo3: "Sceller le destin", todoDone: "Destin manifesté.",
            consulting: "L'algorithme murmure...", sealBtn: "Sceller ce destin", fateSealed: "Destin verrouillé",
        }
    },
    {
        id: 'cn', name: '简体中文', flag: '🇨🇳',
        welcome: "欢迎来到领主庄园。命运的齿轮正等待着您的触碰。",
        loading: "咨询计时器...",
        ui: {
            authTitle: "以太身份", authBtn: "验证灵魂印记", authDone: "身份已密封",
            galleryTitle: "庄园档案", gallerySub: "历史记录 1899",
            manorTitle: "发条之心", manorHeirlooms: "祖先的齿轮", manorEstate: "庄园领地",
            returnGallery: "回到档案", textOptionTitle: "签下你的大名",
            textInputPlaceholder: "访客姓名...", textSubmitBtn: "召唤身份",
            uploadTitle: "扫描以太肖像", generateBtn: "锻造灵魂", generating: "正在嬗变...",
            confirmTitle: "这是您的母语吗？", confirmBtn: "我同意", confirmDone: "语言已绑定",
            todoTitle: "宣言", todo1: "锻造身份", todo2: "检查心脏", todo3: "封印命运", todoDone: "命运已显现。",
            consulting: "算法在低语...", sealBtn: "封印这个命运", fateSealed: "命运已锁定",
        }
    },
    {
        id: 'es', name: 'Español', flag: '🇪🇸',
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
        id: 'it', name: 'Italiano', flag: '🇮🇹',
        welcome: "Benvenuti a Lord Manor. Gli ingranaggi del destino attendono il vostro tocco.",
        loading: "Consultazione del Cronometro...",
        ui: {
            authTitle: "Identità Eterea", authBtn: "Verifica l'impronta dell'anima", authDone: "Identità sigillata",
            galleryTitle: "ARCHIVIO DEL MANIERO", gallerySub: "Documenti Storici 1899",
            manorTitle: "Il Cuore a Orologeria", manorHeirlooms: "Ingranaggi Ancestrali", manorEstate: "Terreni del Maniero",
            returnGallery: "Torna all'Archivio", textOptionTitle: "Scrivi il tuo nome",
            textInputPlaceholder: "Nome dell'ospite...", textSubmitBtn: "Invoca Identità",
            uploadTitle: "Scansiona Ritratto dell'Etere", generateBtn: "Forgia l'Anima", generating: "Trasmutazione...",
            confirmTitle: "È la vostra lingua madre?", confirmBtn: "Acconsento", confirmDone: "Lingua vincolata",
            todoTitle: "Manifesto", todo1: "Forgia identità", todo2: "Ispeziona il cuore", todo3: "Sigilla il destino", todoDone: "Destino manifestato.",
            consulting: "L'algoritmo sussurra...", sealBtn: "Sigilla questo destino", fateSealed: "Destino bloccato",
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

const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#1A1612]">
        {/* Texture Layer */}
        <div className="absolute inset-0 opacity-40 bg-[url('/assets/steampunk_background.png')]" />

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

// [V10: Paper Texture Artifact integration]
const PaperCard = ({ children, className = "", onClick, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        onClick={onClick}
        className={`bg-[#f4e4bc] border-2 border-[#8B7355] rounded-sm relative shadow-xl overflow-hidden group ${className}`}
        style={{ backgroundImage: "url('/assets/steampunk_paper_texture.png')" }}
    >

        {/* Inner Decorative Border */}
        <div className="absolute inset-1 border border-[#8B7355]/20 pointer-events-none" />

        <div className="relative z-10">{children}</div>
    </motion.div>
);

// [V9/V10] View components defined outside for focus stability

const IntroView = ({ selectedLang, userName, setUserName, generateTextCharacter, isAvatarGenerating, handleImageUpload, uploadedImage, generateCharacter, playSfx }) => (
    <div className="space-y-4 max-w-md mx-auto overflow-y-auto no-scrollbar max-h-[85vh] px-4 py-4 scanline">
        <PaperCard className="text-center italic text-sm border-l-8 border-l-[#5C1A1A] py-4 bg-paper">
            "{selectedLang.welcome}"
        </PaperCard>

        <PaperCard className="bg-[#1A1612]/5 border-[#C5A059]/40 border-2 py-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 opacity-10"><LucideZap size={32} className="text-[#C5A059]" /></div>
            <h3 className="text-sm font-black text-[#5C1A1A] uppercase mb-3 tracking-widest flex items-center gap-2">
                <LucideFeather size={18} /> {selectedLang.ui.textOptionTitle}
            </h3>
            <input
                type="text"
                value={userName}
                onChange={e => { setUserName(e.target.value); }}
                onFocus={() => playSfx?.('scratch')}
                placeholder={selectedLang.ui.textInputPlaceholder}
                className="w-full bg-transparent text-[#5C1A1A] border-b border-[#8B7355] p-2 mb-4 focus:outline-none font-serif text-lg transition-all focus:border-[#C5A059]"
            />
            <button
                onClick={generateTextCharacter}
                disabled={isAvatarGenerating || !userName.trim()}
                onMouseEnter={() => playSfx?.('click')}
                className="w-full py-3 bg-[#C5A059] text-[#1A1612] font-black uppercase tracking-widest text-xs hover:bg-[#D4C5A3] disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
                {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn}
            </button>
        </PaperCard>

        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#8B7355]/20"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase text-[#8B7355] font-black tracking-[0.4em] bg-[#f4e4bc]"><span className="px-4">Aether Scan</span></div>
        </div>

        <label className="block w-full cursor-pointer group">
            <div className="p-6 border-2 border-dashed border-[#8B7355]/30 bg-[#25201B]/5 hover:bg-[#C5A059]/10 rounded-sm flex flex-col items-center transition-all shadow-inner">
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                <LucideUpload className="text-[#5C1A1A] mb-2" size={24} />
                <p className="font-black uppercase tracking-widest text-[10px] text-[#8B7355]">{selectedLang.ui.uploadTitle}</p>
            </div>
        </label>

        {uploadedImage && !isAvatarGenerating && (
            <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={generateCharacter}
                className="w-full py-4 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest text-xs hover:bg-[#5C1A1A] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
                <LucideCamera size={18} />
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

const GalleryView = ({ selectedLang, userAvatar, setViewMode, setTodos }) => {
    const slots = [
        { id: 1, type: 'manor', title: selectedLang.ui.manorTitle },
        { id: 2, type: 'archive', title: '1899', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=300' },
        { id: 3, type: 'ad', title: 'Steam Co.', text: 'Industrial' },
        { id: 4, type: 'archive', title: '1900', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=300' },
        { id: 5, type: 'current', isCenter: true },
        { id: 6, type: 'ad', title: 'Aether', text: 'Wireless' },
        { id: 7, type: 'empty' },
        { id: 8, type: 'ad', title: 'Elixir', text: 'Vitality' },
        { id: 10, type: 'poster', title: 'GRAND OPENING', image: '/assets/opening-poster.jpg' },
        { id: 9, type: 'empty' },
    ];

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-4 h-full py-4 overflow-hidden">
            <div className="text-center">
                <h1 className="text-3xl font-black text-[#C5A059] mb-1 uppercase tracking-widest leading-none">{selectedLang.ui.galleryTitle}</h1>
                <p className="text-[#8B7355] text-[8px] font-black uppercase tracking-[0.4em]">{selectedLang.ui.gallerySub}</p>
            </div>

            <div className="flex-1 w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-center gap-4 px-10">
                {slots.map((slot, idx) => (
                    <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="min-w-[180px] aspect-square snap-center"
                    >
                        {slot.type === 'current' ? (
                            <button
                                onClick={() => setViewMode('mission_active')}
                                className="w-full h-full relative bg-[#2C241B] border-4 border-[#C5A059] shadow-inner overflow-hidden active:scale-95 transition-transform"
                            >
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                    {userAvatar?.isTextAvatar ? (
                                        <span className="text-[#C5A059] font-black text-xl uppercase text-center leading-tight">{userAvatar.textName}</span>
                                    ) : (
                                        <img src={userAvatar?.image} className="w-full h-full object-cover" alt="avatar" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 w-full bg-[#5C1A1A] text-[#f4e4bc] text-[8px] font-black py-1 uppercase tracking-widest text-center">Active</div>
                            </button>
                        ) : slot.type === 'manor' ? (
                            <button
                                onClick={() => { setViewMode('home_interior'); setTodos(p => ({ ...p, home: true })); }}
                                className="w-full h-full relative bg-[#2C241B] border-4 border-[#8B7355] flex flex-col items-center justify-center hover:border-[#C5A059] transition-all group active:scale-95"
                            >
                                <LucideLayout size={32} className="text-[#C5A059] mb-1" />
                                <span className="text-[#8B7355] text-[8px] font-black uppercase">{slot.title}</span>
                            </button>
                        ) : slot.type === 'archive' ? (
                            <div className="w-full h-full border-4 border-[#2C241B] relative overflow-hidden bg-black grayscale">
                                <img src={slot.image} className="w-full h-full object-cover opacity-50" alt="archive" />
                                <div className="absolute bottom-1 left-1 bg-black/80 px-1 text-[#f4e4bc] text-[8px] font-black border border-[#C5A059]/40 uppercase tracking-widest">{slot.title}</div>
                            </div>
                        ) : slot.type === 'ad' ? (
                            <div className="w-full h-full relative bg-[#f4e4bc] border-4 border-[#2C241B] p-2 flex flex-col items-center justify-center text-center bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] shadow-inner">
                                <span className="font-black text-[10px] uppercase text-[#5C1A1A] leading-none mb-1">{slot.title}</span>
                                <span className="text-[8px] italic text-[#2C241B] leading-none uppercase">{slot.text}</span>
                            </div>
                        ) : slot.type === 'poster' ? (
                            <div className="w-full h-full border-4 border-[#C5A059] relative overflow-hidden shadow-2xl group">
                                <img src={slot.image} className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-125" alt="teaser" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                                    <span className="text-[10px] font-black text-[#C5A059] tracking-widest leading-none mb-1">Coming Soon</span>
                                    <span className="text-[8px] text-[#f4e4bc] opacity-60 uppercase">{slot.title}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full relative border-4 border-[#2C241B]/30 bg-black/10 flex items-center justify-center">
                                <div className="w-1/2 h-1/2 border border-dashed border-[#8B7355]/20" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
            <div className="flex gap-1 mb-4">
                {slots.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/20 shadow-sm" />)}
            </div>
        </div>
    );
};

const ManorView = ({ selectedLang, setViewMode, userAvatar, candleLit, setCandleLit, gearsSpinning, setGearsSpinning, loreText, playSfx }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4">
        <button onClick={() => { setViewMode('gallery'); playSfx?.('click'); }} className="text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1">
            <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
        </button>

        <PaperCard className="w-full flex-1 max-h-[75vh] p-0 border-[#C5A059] border-4 bg-[#1A1612] relative overflow-hidden shadow-2xl">
            {/* Artifact Manor BG: steampunk_manor_background_1772052884363.png */}
            <div
                className="absolute inset-0 bg-center bg-cover opacity-30 sepia brightness-75 contrast-125"
                style={{ backgroundImage: "url('/assets/steampunk_manor_background.png')" }}
            />

            <div className="relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar">
                <div className="w-full flex justify-between mb-4 px-2">
                    <div className="cursor-pointer hover:scale-110 transition-transform" onClick={() => setCandleLit(!candleLit)}>
                        <LucideFlame size={24} className={candleLit ? 'text-[#FFAA00] drop-shadow-[0_0_10px_#FFAA00]' : 'text-[#2C241B]'} />
                    </div>
                    <div className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setGearsSpinning(!gearsSpinning)}>
                        <motion.div animate={{ rotate: gearsSpinning ? 360 : 0 }} transition={{ duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }}>
                            <LucideSettings size={24} className="text-[#C5A059]" />
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

                <h3 className="text-xl font-serif font-black text-[#f4e4bc] mb-4 uppercase tracking-widest text-center leading-none">{selectedLang.ui.manorTitle}</h3>

                <div className="w-full flex-1 bg-black/80 p-4 border border-[#8B7355]/40 rounded-sm font-mono text-[10px] text-[#D4C5A3] leading-relaxed relative overflow-y-auto no-scrollbar shadow-inner">
                    {loreText}<span className="inline-block w-1.5 h-3 bg-[#C5A059] ml-1 animate-ping" />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-[#8B7355]/20">
                    <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center gap-2 cursor-pointer group">
                        <LucideTrophy size={18} className="text-[#8B7355] group-hover:text-[#C5A059] transition-colors" />
                        <span className="text-[10px] font-black uppercase text-[#8B7355] group-hover:text-[#C5A059] tracking-widest">{selectedLang.ui.manorHeirlooms}</span>
                    </motion.div>
                    <div className="flex flex-col items-center gap-2 opacity-30">
                        <LucideMapPin size={18} className="text-[#2C241B]" />
                        <span className="text-[10px] font-black uppercase text-[#2C241B] tracking-widest">{selectedLang.ui.manorEstate}</span>
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

const TrailerView = ({ selectedLang, resetStates, setStep, playSfx }) => (
    <PaperCard className="w-full max-w-sm p-8 border-[#5C1A1A] border-4 flex flex-col items-center space-y-6 bg-paper aether-glow">
        <div className="w-16 h-16 rounded-full border-4 border-[#C5A059] flex items-center justify-center bg-[#1A1612] animate-spin-slow">
            <LucideLock size={32} className="text-[#C5A059]" />
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-[#5C1A1A] uppercase tracking-widest">{selectedLang.ui.fateSealed}</h2>
            <p className="text-[10px] font-black uppercase text-[#8B7355] tracking-widest opacity-60">The Chronometer remains silent.</p>
        </div>
        <div className="w-full h-[1px] bg-[#8B7355]/20" />
        <button
            onClick={() => { resetStates(); setStep('language'); playSfx?.('forge'); }}
            className="w-[85%] py-4 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest text-[10px] border-b-4 border-black hover:bg-[#5C1A1A] active:scale-95 transition-all shadow-xl"
        >
            {selectedLang.ui.returnGallery}
        </button>
    </PaperCard>
);

const LanguageView = ({ LANGUAGES, handleLanguageSelect }) => (
    <div className="flex flex-col items-center space-y-12 animate-in fade-in zoom-in duration-1000">
        <div className="text-center space-y-4">
            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-black text-white tracking-[0.4em] uppercase filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                Multiverse
            </motion.h1>
            <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">Select Your Reality</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {LANGUAGES.map((lang, idx) => (
                <motion.button
                    key={lang.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleLanguageSelect(lang)}
                    className="group relative flex flex-col items-center p-6 bg-white/5 border border-white/10 hover:border-white/40 transition-all rounded-xl backdrop-blur-sm"
                >
                    <span className="text-4xl mb-3 transition-transform group-hover:scale-125">{lang.flag}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{lang.name}</span>
                </motion.button>
            ))}
        </div>
    </div>
);

const ConfirmView = ({ selectedLang, confirmLanguage }) => (
    <PaperCard className="w-full max-w-sm p-10 border-[#C5A059] border-4 flex flex-col items-center space-y-6 bg-paper aether-glow">
        <h2 className="text-xl font-black text-[#5C1A1A] uppercase tracking-widest text-center">{selectedLang.ui.confirmTitle}</h2>
        <div className="flex items-center gap-4 text-4xl mb-2">
            <span className="opacity-40"><LucideScale size={24} /></span>
            <span className="filter drop-shadow-lg">{selectedLang.flag}</span>
            <span className="opacity-40"><LucideScale size={24} className="scale-x-[-1]" /></span>
        </div>
        <button
            onClick={confirmLanguage}
            className="w-full py-5 bg-[#5C1A1A] text-white font-black uppercase text-xs tracking-[0.3em] border-b-4 border-black hover:bg-[#7D2626] active:scale-95 transition-all shadow-2xl"
        >
            {selectedLang.ui.confirmBtn}
        </button>
    </PaperCard>
);

const App = () => {
    const [isOpeningFinished, setIsOpeningFinished] = useState(false);
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
            const prompt = `Speak with a British 19th-century narrator style, elegant and slightly dramatic: ${text}`;
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

                // Cache for later
                setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
                new Audio(wavUrl).play();
            }
        } catch (err) { console.error("TTS Error:", err); }
    };

    // [V8 UPDATE: Pre-fetch Logic to eliminate sync issues]
    const preFetchVoice = async (text, langVoice) => {
        if (!apiKey || !text || audioCache[text]) return;
        try {
            const response = await callGemini({
                contents: [{ parts: [{ text: `Speak with a British 19th-century narrator style: ${text}` }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: langVoice || "Zephyr" } } }
                }
            }, "generateContent", "gemini-2.5-flash-preview-tts");

            if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const audioData = response.candidates[0].content.parts[0].inlineData.data;
                const wavUrl = pcmToWav(audioData, 24000);
                setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
            }
        } catch (err) { /* Silent fail for pre-fetch */ }
    };

    const pcmToWav = (base64, sampleRate) => {
        // [V7 UPDATE: Restored robust audio buffer processing from user source]
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
        playSfx('click');

        // [V10: Personalized BGM Switching]
        if (bgmRef.current) {
            bgmRef.current.src = lang.bgm;
            bgmRef.current.play();
        }

        // [V10: Sequence pre-fetching for better timing]
        setTimeout(() => {
            preFetchVoice(lang.ui.confirmTitle, lang.voice);
            preFetchVoice(lang.welcome, lang.voice);
        }, 300);
    };

    const confirmLanguage = () => {
        setStep('intro');
        playSfx('shutter');
        // [V10: Delay speech slightly to allow transition to settle]
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

            const imageFetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
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

    const LanguageView = ({ LANGUAGES, handleLanguageSelect }) => (
        <div className="flex flex-row md:grid md:grid-cols-2 gap-4 w-full max-w-4xl px-2 overflow-x-auto pb-4 no-scrollbar">
            {LANGUAGES.map((lang, idx) => (
                <PaperCard
                    key={lang.id}
                    delay={idx * 0.1}
                    onClick={() => handleLanguageSelect(lang)}
                    className="min-w-[200px] md:min-w-0 cursor-pointer hover:border-[#C5A059] transition-all"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl group-hover:scale-110 transition-transform drop-shadow-md">{lang.flag}</span>
                        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[#8B7355]">{lang.name}</h3>
                        <div className="w-8 h-0.5 bg-[#8B7355]/20" />
                    </div>
                </PaperCard>
            ))}
        </div>
    );

    const ConfirmView = ({ selectedLang, confirmLanguage }) => (
        <PaperCard className="text-center max-w-sm mx-auto py-8">
            <motion.div
                animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-4"
            >
                <LucideFeather className="w-12 h-12 mx-auto text-[#5C1A1A]" />
            </motion.div>
            <h2 className="text-xl font-serif font-black mb-6 leading-relaxed text-[#2C241B]">
                {selectedLang.ui.confirmTitle}
            </h2>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmLanguage}
                className="w-full py-4 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest text-xs hover:bg-[#5C1A1A] transition-all border-2 border-[#8B7355]/40 shadow-lg"
            >
                {selectedLang.ui.confirmBtn}
            </motion.button>
        </PaperCard>
    );

    const IntroView = ({ selectedLang, userName, setUserName, generateTextCharacter, isAvatarGenerating, handleImageUpload, uploadedImage, generateCharacter }) => (
        <div className="space-y-4 max-w-md mx-auto overflow-y-auto no-scrollbar max-h-[85vh] px-4 py-4">
            <PaperCard className="text-center italic text-sm border-l-8 border-l-[#5C1A1A] py-4">
                "{selectedLang.welcome}"
            </PaperCard>

            <PaperCard className="bg-[#1A1612]/5 border-[#C5A059]/40 border-2 py-4 shadow-xl">
                <h3 className="text-sm font-black text-[#5C1A1A] uppercase mb-3 tracking-widest flex items-center gap-2">
                    <LucideFeather size={18} /> {selectedLang.ui.textOptionTitle}
                </h3>
                <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder={selectedLang.ui.textInputPlaceholder}
                    className="w-full bg-transparent text-[#5C1A1A] border-b border-[#8B7355] p-2 mb-4 focus:outline-none font-serif text-lg"
                />
                <button
                    onClick={generateTextCharacter}
                    disabled={isAvatarGenerating || !userName.trim()}
                    className="w-full py-3 bg-[#C5A059] text-[#1A1612] font-black uppercase tracking-widest text-xs hover:bg-[#D4C5A3] disabled:opacity-50 transition-all shadow-md active:scale-95"
                >
                    {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn}
                </button>
            </PaperCard>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#8B7355]/20"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase text-[#8B7355] font-black tracking-[0.4em] bg-[#f4e4bc]"><span className="px-4">Aether Scan</span></div>
            </div>

            <label className="block w-full cursor-pointer group">
                <div className="p-6 border-2 border-dashed border-[#8B7355]/30 bg-[#25201B]/5 hover:bg-[#C5A059]/10 rounded-sm flex flex-col items-center transition-all shadow-inner">
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    <LucideUpload className="text-[#5C1A1A] mb-2" size={24} />
                    <p className="font-black uppercase tracking-widest text-[10px] text-[#8B7355]">{selectedLang.ui.uploadTitle}</p>
                </div>
            </label>

            {uploadedImage && (
                <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={generateCharacter}
                    disabled={isAvatarGenerating}
                    className="w-full py-4 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest text-xs hover:bg-[#5C1A1A] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    {isAvatarGenerating ? <LucideLoader2 className="animate-spin" /> : <LucideCamera size={18} />}
                    {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.generateBtn}
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

    const GalleryView = ({ selectedLang, userAvatar, setViewMode, setTodos }) => {
        const slots = [
            { id: 1, type: 'manor', title: selectedLang.ui.manorTitle },
            { id: 2, type: 'archive', title: '1899', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=300' },
            { id: 3, type: 'ad', title: 'Steam Co.', text: 'Industrial' },
            { id: 4, type: 'archive', title: '1900', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=300' },
            { id: 5, type: 'current', isCenter: true },
            { id: 6, type: 'ad', title: 'Aether', text: 'Wireless' },
            { id: 7, type: 'empty' },
            { id: 8, type: 'ad', title: 'Elixir', text: 'Vitality' },
            { id: 9, type: 'empty' },
        ];

        return (
            <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-4 h-full py-4 overflow-hidden">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-[#C5A059] mb-1 uppercase tracking-widest leading-none">{selectedLang.ui.galleryTitle}</h1>
                    <p className="text-[#8B7355] text-[8px] font-black uppercase tracking-[0.4em]">{selectedLang.ui.gallerySub}</p>
                </div>

                <div className="flex-1 w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-center gap-4 px-10">
                    {slots.map((slot, idx) => (
                        <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="min-w-[180px] aspect-square snap-center"
                        >
                            {slot.type === 'current' ? (
                                <button
                                    onClick={() => setViewMode('mission_active')}
                                    className="w-full h-full relative bg-[#2C241B] border-4 border-[#C5A059] shadow-inner overflow-hidden"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center p-2">
                                        {userAvatar?.isTextAvatar ? (
                                            <span className="text-[#C5A059] font-black text-xl uppercase text-center leading-tight">{userAvatar.textName}</span>
                                        ) : (
                                            <img src={userAvatar?.image} className="w-full h-full object-cover" alt="avatar" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-[#5C1A1A] text-[#f4e4bc] text-[8px] font-black py-1 uppercase tracking-widest text-center uppercase">Active</div>
                                </button>
                            ) : slot.type === 'manor' ? (
                                <button
                                    onClick={() => { setViewMode('home_interior'); setTodos(p => ({ ...p, home: true })); }}
                                    className="w-full h-full relative bg-[#2C241B] border-4 border-[#8B7355] flex flex-col items-center justify-center hover:border-[#C5A059] transition-all group"
                                >
                                    <LucideLayout size={32} className="text-[#C5A059] mb-1" />
                                    <span className="text-[#8B7355] text-[8px] font-black uppercase">{slot.title}</span>
                                </button>
                            ) : slot.type === 'archive' ? (
                                <div className="w-full h-full border-4 border-[#2C241B] relative overflow-hidden bg-black grayscale">
                                    <img src={slot.image} className="w-full h-full object-cover opacity-50" alt="archive" />
                                    <div className="absolute bottom-1 left-1 bg-black/80 px-1 text-[#f4e4bc] text-[8px] font-black border border-[#C5A059]/40 uppercase tracking-widest">{slot.title}</div>
                                </div>
                            ) : slot.type === 'ad' ? (
                                <div className="w-full h-full relative bg-[#f4e4bc] border-4 border-[#2C241B] p-2 flex flex-col items-center justify-center text-center bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] shadow-inner">
                                    <span className="font-black text-[10px] uppercase text-[#5C1A1A] leading-none mb-1">{slot.title}</span>
                                    <span className="text-[8px] italic text-[#2C241B] leading-none uppercase">{slot.text}</span>
                                </div>
                            ) : (
                                <div className="w-full h-full relative border-4 border-[#2C241B]/30 bg-black/10 flex items-center justify-center">
                                    <div className="w-1/2 h-1/2 border border-dashed border-[#8B7355]/20" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
                <div className="flex gap-1 mb-4">
                    {slots.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/20 shadow-sm" />)}
                </div>
            </div>
        );
    };

    const ManorView = ({ selectedLang, setViewMode, userAvatar, candleLit, setCandleLit, gearsSpinning, setGearsSpinning, loreText }) => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4">
            <button onClick={() => setViewMode('gallery')} className="text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1">
                <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
            </button>

            <PaperCard className="w-full flex-1 max-h-[70vh] p-0 border-[#C5A059] border-4 bg-[#1A1612] relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800')] opacity-20 sepia brightness-50 contrast-150" />

                <div className="relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar">
                    <div className="w-full flex justify-between mb-4 px-2">
                        <div className="cursor-pointer hover:scale-110 transition-transform" onClick={() => setCandleLit(!candleLit)}>
                            <LucideFlame size={24} className={candleLit ? 'text-[#FFAA00] drop-shadow-[0_0_10px_#FFAA00]' : 'text-[#2C241B]'} />
                        </div>
                        <div className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setGearsSpinning(!gearsSpinning)}>
                            <motion.div animate={{ rotate: gearsSpinning ? 360 : 0 }} transition={{ duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }}>
                                <LucideSettings size={24} className="text-[#C5A059]" />
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

                    <h3 className="text-xl font-serif font-black text-[#f4e4bc] mb-4 uppercase tracking-widest text-center leading-none">{selectedLang.ui.manorTitle}</h3>

                    <div className="w-full flex-1 bg-black/80 p-4 border border-[#8B7355]/40 rounded-sm font-mono text-[10px] text-[#D4C5A3] leading-relaxed relative overflow-y-auto no-scrollbar shadow-inner">
                        {loreText}<span className="inline-block w-1.5 h-3 bg-[#C5A059] ml-1 animate-ping" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-[#8B7355]/20">
                        <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <LucideTrophy size={18} className="text-[#8B7355] group-hover:text-[#C5A059] transition-colors" />
                            <span className="text-[10px] font-black uppercase text-[#8B7355] group-hover:text-[#C5A059] tracking-widest">{selectedLang.ui.manorHeirlooms}</span>
                        </motion.div>
                        <div className="flex flex-col items-center gap-2 opacity-30">
                            <LucideMapPin size={18} className="text-[#2C241B]" />
                            <span className="text-[10px] font-black uppercase text-[#2C241B] tracking-widest">{selectedLang.ui.manorEstate}</span>
                        </div>
                    </div>
                </div>
            </PaperCard>
        </motion.div>
    );

    const MissionView = ({ selectedLang, setViewMode, PROJECTS, previewId, handlePreviewVote, isAuthenticated, setIsAuthenticated, oracleMessage, setStep, setTodos }) => (
        <div className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-4 py-4 overflow-hidden">
            <button onClick={() => setViewMode('gallery')} className="text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1 px-2">
                <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
            </button>

            <div className="w-full space-y-4 overflow-y-auto no-scrollbar flex-1 pb-10 px-2 lg:px-4">
                <PaperCard className="py-4 px-6 border-[#C5A059] shadow-lg">
                    <h3 className="text-[10px] font-black text-[#5C1A1A] uppercase tracking-[0.2em] flex items-center gap-1 border-b border-black/5 pb-2">
                        <LucideInfo size={14} /> {selectedLang.ui.authTitle}
                    </h3>
                    {!isAuthenticated ? (
                        <button onClick={() => setIsAuthenticated(true)} className="w-full mt-2 py-3 bg-[#1A1612] text-[#C5A059] text-[10px] font-black uppercase border border-[#C5A059]/40 hover:bg-[#5C1A1A] hover:text-white transition-all shadow-md active:scale-95">
                            {selectedLang.ui.authBtn}
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-[#556B2F] font-black bg-[#556B2F]/10 p-2 mt-2 border border-[#556B2F]/30 uppercase text-[10px]">
                            <LucideCheckCircle size={16} /> {selectedLang.ui.authDone}
                        </div>
                    )}
                </PaperCard>

                <div className="space-y-4">
                    {PROJECTS.map((proj) => {
                        const isSelected = previewId === proj.id;
                        const isInactive = previewId && !isSelected;
                        return (
                            <motion.div key={proj.id} layout className={`${isInactive ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
                                <PaperCard
                                    onClick={() => !isInactive && isAuthenticated && handlePreviewVote(proj.id)}
                                    className={`cursor-pointer transition-all duration-300 overflow-hidden border-2 p-0 shadow-lg ${isSelected ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30' : 'border-[#2C241B] opacity-90'}`}
                                >
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className={`text-[8px] font-mono mb-0.5 block uppercase ${isSelected ? 'text-[#5C1A1A]' : 'text-[#8B7355]'}`}>Case #0{proj.id}</span>
                                            <h4 className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-[#2C241B]' : 'text-[#8B7355]'}`}>{proj.title}</h4>
                                        </div>
                                        {isSelected && <LucideSparkles className="text-[#C5A059] animate-pulse" size={16} />}
                                    </div>
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-4 pt-0 border-t border-black/5 bg-black/5">
                                                <div className="bg-[#1A1612] p-4 border border-[#C5A059]/40 mb-4 shadow-inner">
                                                    <p className="text-[#f4e4bc] text-[10px] italic leading-relaxed text-center">"{oracleMessage || selectedLang.ui.consulting}"</p>
                                                </div>
                                                <button onClick={() => { setStep('trailer'); setTodos(p => ({ ...p, voted: true })); }} className="w-full py-3 bg-[#5C1A1A] text-white font-black uppercase text-[10px] tracking-widest border-b-2 border-black active:scale-95 transition-transform shadow-lg">
                                                    {selectedLang.ui.sealBtn}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </PaperCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const TrailerView = ({ selectedLang, resetStates, setStep }) => (
        <PaperCard className="text-center max-w-sm mx-auto py-10 shadow-3xl relative overflow-hidden bg-[#f4e4bc]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C5A059] animate-pulse" />
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-8"
            >
                <div className="w-24 h-24 mx-auto rounded-full bg-[#556B2F]/20 flex items-center justify-center border-4 border-[#556B2F]/40 shadow-[0_0_30px_rgba(85,107,47,0.4)]">
                    <LucideCheckCircle className="w-12 h-12 text-[#556B2F]" />
                </div>
            </motion.div>

            <div className="space-y-4 mb-10 px-6">
                <h2 className="text-3xl font-serif font-black uppercase tracking-[0.3em] text-[#2C241B] leading-none">
                    {selectedLang.ui.fateSealed}
                </h2>
                <div className="w-16 h-1 bg-[#5C1A1A] mx-auto" />
                <p className="text-[#5C4D3C] italic text-[11px] leading-relaxed font-serif">
                    {selectedLang.ui.todoDone}
                </p>
            </div>

            <button
                onClick={() => { setStep('language'); resetStates(); }}
                className="w-[85%] py-4 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest text-[10px] border-b-4 border-black hover:bg-[#5C1A1A] active:scale-95 transition-all shadow-xl"
            >
                {selectedLang.ui.returnGallery}
            </button>
        </PaperCard>
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

    const resetStates = () => {
        setPreviewId(null);
        setOracleMessage("");
        setTodos({ avatar: false, home: false, voted: false });
    };

    const currentTheme = THEME_CONFIG[selectedLang?.id] || THEME_CONFIG.ko;

    return (
        <div className={`relative w-full h-screen ${currentTheme.bg} ${currentTheme.text} ${currentTheme.font} overflow-hidden transition-colors duration-1000`}>
            <AnimatePresence>
                {!isOpeningFinished && (
                    <CinematicOpening onComplete={() => setIsOpeningFinished(true)} />
                )}
            </AnimatePresence>

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
                            <LanguageView LANGUAGES={LANGUAGES} handleLanguageSelect={handleLanguageSelect} />
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

            {/* Status Widgets: [V10] Refined Spirit Sense Only */}
            <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-4 items-start">
                <AnimatePresence>
                    {spiritHint && (
                        <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-[#5C1A1A] text-[#f4e4bc] p-4 border-2 border-[#C5A059] shadow-2xl skew-x-[-2deg] max-w-[200px] text-[10px] uppercase font-black tracking-widest leading-relaxed relative"
                        >
                            <div className="absolute -top-3 -left-2 bg-[#C5A059] text-[#1A1612] text-[9px] px-2 py-0.5 font-black shadow-lg">SPIRIT ADVICE</div>
                            "{spiritHint}"
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#C5A059] rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={useSpiritSense}
                    disabled={isSpiritSensing}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#C5A059] bg-[#1A1612] text-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-110 active:scale-90 transition-all group relative ${isSpiritSensing ? 'animate-pulse opacity-50' : ''}`}
                >
                    <LucideSparkles size={24} />
                    {!isSpiritSensing && <div className="absolute inset-0 rounded-full border border-[#C5A059]/30 animate-ping" />}
                    <div className="absolute -top-2 -right-2 bg-[#5C1A1A] text-[7px] text-white px-1.5 py-0.5 rounded-full border border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">SENSE AETHER</div>
                </button>
            </div>

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
