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
// [V9 UPDATE: Masterpiece Version Polish]
const BUILD_VERSION = "v1.3.0-clockwork-masterpiece-v9";

const LANGUAGES = [
    {
        id: 'ko',
        name: 'Korean',
        welcome: '환영합니다, 귀한 손님. 이 낡은 저택의 설계자가 당신을 기다리고 있었습니다.',
        // [V7 UPDATE: Extended loading text for atmosphere]
        loading: '당신의 영혼을 초상화에 담아내고 있습니다... 증기 기관의 예열에는 인내심이 필요한 법이죠. 깃펜의 잉크가 마르기 전에는 끝날 테니, 잠시 홍차 한 잔의 여유를 즐기시길 바랍니다. 1800년대의 최첨단 기술을 믿어보십시오.',
        instrument: '가야금 (Gayageum)',
        flag: '🇰🇷',
        voice: 'Kore',
        ui: {
            confirmTitle: "설계자님, 진행하시겠습니까?",
            confirmBtn: "서약서 서명하기",
            textOptionTitle: "영혼의 이름 각인하기",
            textOptionDesc: "AI가 당신의 초상화를 학습하는 것이 꺼려지신다면, 당신을 부를 이름만 남겨주십시오. 기계 영혼이 그 이름을 가장 찬란하게 조각해 드릴 것입니다.",
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
            // [V7 UPDATE: Added power multiplier label]
            authBtn: "통행증 제시 (영향력 10배)",
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
            // [V7 UPDATE: Detailed todo done message]
            todoDone: "모든 임무를 마쳤습니다. 이제 저택을 자유롭게 거니십시오."
        }
    },
    {
        id: 'en',
        name: 'English',
        welcome: 'Welcome, esteemed guest. The Architect of this manor has been expecting you.',
        // [V7 UPDATE: Extended loading text for atmosphere]
        loading: 'Distilling your essence into the ether... This mechanism runs on steam and magic, so pray grant us a moment. Do not adjust your monocle, the transformation is imminent. The gears of fate grind slowly but exceedingly fine.',
        instrument: 'Harpsichord',
        flag: '🇬🇧',
        voice: 'Zephyr',
        ui: {
            confirmTitle: "Shall we proceed, Architect?",
            confirmBtn: "Sign the Contract",
            textOptionTitle: "Engrave Your Name",
            textOptionDesc: "If you prefer not to share your visage with the machine spirit, simply offer your name. It shall shine brightly in our halls.",
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
            // [V7 UPDATE: Added power multiplier label]
            authBtn: "PRESENT CREDENTIALS (10x Power)",
            authDone: "Credentials Verified",
            casePrefix: "CASE NO.",
            prophecyTitle: "The Prophecy",
            consulting: "Consulting the spirits...",
            sealBtn: "SEAL YOUR FATE",
            reconsiderBtn: "Reconsider Choice",
            fateSealed: "Fate Sealed",
            projectInitiated: "PROJECT INITIATED",
            todoTitle: "Tasks for Today",
            todo1: "Forge Identity",
            todo2: "Inspect the Manor",
            todo3: "Select a Case",
            // [V7 UPDATE: Detailed todo done message]
            todoDone: "Your duties are fulfilled. Feel free to wander the estate at your leisure."
        }
    },
    // [V7 UPDATE: Restored Hindi, Arabic, Chinese, German languages from user source]
    {
        id: 'hi',
        name: 'Hindi',
        welcome: 'स्वागत है, सम्मानित अतिथि। इस हवेली का वास्तुकार आपकी प्रतीक्षा कर रहा था।',
        loading: 'आपकी आत्मा को कैनवास पर उतारा जा रहा है... भाप के इंजन को गर्म होने में थोड़ा समय लगता है। धैर्य रखें, यह 19वीं सदी की सबसे बेहतरीन तकनीक है।',
        instrument: 'Sitar', flag: '🇮🇳', voice: 'Puck',
        ui: {
            confirmTitle: "क्या हम आगे बढ़ें, वास्तुकार?", confirmBtn: "अनुबंध पर हस्ताक्षर करें",
            textOptionTitle: "अपना नाम उकेरें", textOptionDesc: "यदि आप मशीन के साथ अपना चेहरा साझा नहीं करना चाहते हैं, तो बस अपना नाम बताएं। यह हमारे हॉल में चमक उठेगा।",
            textInputPlaceholder: "अपना नाम या उपनाम दर्ज करें", textSubmitBtn: "नाम से भाग्य बनाएं",
            uploadTitle: "अपना चित्र प्रस्तुत करें", generateBtn: "पहचान बनाएं", generating: "उत्कीर्णन...",
            galleryTitle: "यादों की गैलरी", gallerySub: "विरासत और वर्तमान", returnGallery: "गैलरी में लौटें",
            manorTitle: "अध्ययन कक्ष", manorHeirlooms: "विरासत", manorEstate: "जागीर",
            authTitle: "पहचान", authBtn: "क्रेडेंशियल प्रस्तुत करें", authDone: "क्रेडेंशियल सत्यापित",
            casePrefix: "प्रकरण सं.", prophecyTitle: "भविष्यवाणी", consulting: "आत्माओं से परामर्श...",
            sealBtn: "अपना भाग्य सील करें", reconsiderBtn: "पुनर्विचार करें", fateSealed: "भाग्य सील कर दिया गया",
            projectInitiated: "परियोजना शुरू की गई", todoTitle: "आज के कार्य",
            todo1: "पहचान बनाएं", todo2: "हवेली का निरीक्षण करें", todo3: "प्रकरण चुनें",
            todoDone: "आपके कर्तव्य पूरे हुए। हवेली में स्वतंत्र रूप से घूमें।"
        }
    },
    {
        id: 'ar',
        name: 'Arabic',
        welcome: 'أهلاً بك يا ضيفنا الكريم. مهندس هذا القصر كان في انتظارك.',
        loading: 'جاري نقش جوهرك على الرق... تروس القدر تدور ببطء ولكن بدقة متناهية. انتظر قليلاً بينما يقوم الخيميائي الرقمي بعمله.',
        instrument: 'Oud', flag: '🇸🇦', voice: 'Charon',
        ui: {
            confirmTitle: "هل نمضي قدمًا أيها المهندس؟", confirmBtn: "توقيع العقد",
            textOptionTitle: "انقش اسمك", textOptionDesc: "إذا كنت تفضل عدم مشاركة وجهك مع الآلة، فقط قدم اسمك. سوف يضيء في قاعاتنا.",
            textInputPlaceholder: "أدخل اسمك أو لقبك", textSubmitBtn: "اصنع مصيرك بالاسم",
            uploadTitle: "قدم صورتك الشخصية", generateBtn: "تشكيل الهوية", generating: "جاري النقش...",
            galleryTitle: "معرض الذكريات", gallerySub: "الإرث والحاضر", returnGallery: "العودة للمعرض",
            manorTitle: "غرفة الدراسة", manorHeirlooms: "الموروثات", manorEstate: "التركة",
            authTitle: "إثبات الهوية", authBtn: "تقديم أوراق الاعتماد", authDone: "تم التحقق",
            casePrefix: "قضية رقم", prophecyTitle: "النبؤة", consulting: "استشارة الأرواح...",
            sealBtn: "ختم مصيرك", reconsiderBtn: "إعادة النظر", fateSealed: "تم ختم المصير",
            projectInitiated: "بدأ المشروع", todoTitle: "مهام اليوم",
            todo1: "تشكيل الهوية", todo2: "تفقد القصر", todo3: "اختيار قضية",
            todoDone: "اكتملت مهامك. تجول بحرية في القصر."
        }
    },
    {
        id: 'zh',
        name: 'Chinese',
        welcome: '欢迎，尊贵的客人。这座庄园的建筑师一直在等您。',
        loading: '正在将您的灵魂描绘在画卷上... 蒸汽机的预热需要耐心。请稍安勿躁，这可是19世纪最尖端的工艺。',
        instrument: 'Guzheng', flag: '🇨🇳', voice: 'Leda',
        ui: {
            confirmTitle: "我们要 continue 吗，建筑师？", confirmBtn: "签署契约",
            textOptionTitle: "铭刻您的名字", textOptionDesc: "如果您不愿让机器之魂学习您的容貌，只需留下您的名字。它将在我们的殿堂中熠熠生辉。",
            textInputPlaceholder: "输入您的名字或别名", textSubmitBtn: "以名铸就命运",
            uploadTitle: "出示您的肖像", generateBtn: "铸造身份", generating: "雕刻中...",
            galleryTitle: "记忆画廊", gallerySub: "传承与现在", returnGallery: "返回画廊",
            manorTitle: "书房", manorHeirlooms: "传家宝", manorEstate: "庄园",
            authTitle: "身份验证", authBtn: "出示凭证 (10倍影响力)", authDone: "凭证已验证",
            casePrefix: "案件编号", prophecyTitle: "预言", consulting: "请示神明中...",
            sealBtn: "封印你的命运", reconsiderBtn: "重新考虑", fateSealed: "命运已定",
            projectInitiated: "项目已启动", todoTitle: "今日任务",
            todo1: "铸造身份", todo2: "参观庄园", todo3: "选择案件",
            todoDone: "任务已完成。请随意在庄园内漫步。"
        }
    },
    {
        id: 'de',
        name: 'German',
        welcome: 'Willkommen, werter Gast. Der Architekt dieses Anwesens hat Sie erwartet.',
        loading: 'Wir destillieren Ihre Essenz in den Äther... Dieser Mechanismus läuft mit Dampf und Magie. Richten Sie Ihr Monokel nicht, die Transformation steht unmittelbar bevor.',
        instrument: 'Piano', flag: '🇩🇪', voice: 'Fenrir',
        ui: {
            confirmTitle: "Sollen wir fortfahren, Architekt?", confirmBtn: "Vertrag unterzeichnen",
            textOptionTitle: "Gravieren Sie Ihren Namen", textOptionDesc: "Wenn Sie Ihr Antlitz nicht mit der Maschine teilen möchten, nennen Sie einfach Ihren Namen. Er wird in unseren Hallen hell erstrahlen.",
            textInputPlaceholder: "Geben Sie Ihren Namen ein", textSubmitBtn: "Schicksal durch Namen schmieden",
            uploadTitle: "Präsentieren Sie Ihr Porträt", generateBtn: "IDENTITÄT SCHMIEDEN", generating: "GRAVIEREN...",
            galleryTitle: "GALERIE DER ERINNERUNGEN", gallerySub: "Vermächtnis & Gegenwart", returnGallery: "Zur Galerie zurückkehren",
            manorTitle: "Das Studierzimmer", manorHeirlooms: "Erbstücke", manorEstate: "Anwesen",
            authTitle: "Identifikation", authBtn: "REFERENZEN VORLEGEN", authDone: "Referenzen verifiziert",
            casePrefix: "FALL NR.", prophecyTitle: "Die Prophezeiung", consulting: "Befragung der Geister...",
            sealBtn: "BESIEGELE DEIN SCHICKSAL", reconsiderBtn: "Wahl überdenken", fateSealed: "Schicksal besiegelt",
            projectInitiated: "PROJEKT GESTARTET", todoTitle: "Aufgaben",
            todo1: "Identität schmieden", todo2: "Anwesen inspizieren", todo3: "Fall auswählen",
            todoDone: "Ihre Pflichten sind erfüllt. Lustwandeln Sie frei auf dem Anwesen."
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
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        onClick={onClick}
        className={`relative bg-[#f4e4bc] text-[#2c241b] p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-2 border-[#d4c5a3] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] overflow-hidden ${className} group flex flex-col`}
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

// [V9 UPDATE: Component moving out of App to fix focus bug]

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
            className="w-full py-4 bg-[#2C241B] text-[#f4e4bc] font-black uppercase tracking-widest text-xs hover:bg-[#5C1A1A] transition-all border-2 border-[#8B7355]/40 shadow-lg active:scale-95"
        >
            {selectedLang.ui.confirmBtn}
        </motion.button>
    </PaperCard>
);

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
                onFocus={() => playSfx?.('click')}
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
    <PaperCard className="text-center max-w-sm mx-auto py-10 shadow-3xl relative overflow-hidden bg-[#f4e4bc] bg-paper scanline">
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
        bgmRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Placeholder atmospheric BGM
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
        const sounds = {
            click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
            shutter: 'https://assets.mixkit.co/active_storage/sfx/132/132-preview.mp3',
            forge: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
        };
        if (sounds[type]) new Audio(sounds[type]).play();
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
        if (bgmRef.current && bgmRef.current.paused) bgmRef.current.play();
        // [V8 UPDATE: Actionable pre-fetching]
        preFetchVoice(lang.ui.confirmTitle, lang.voice);
        preFetchVoice(lang.welcome, lang.voice);
    };

    const confirmLanguage = () => {
        setStep('intro');
        playSfx('shutter');
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

    return (
        <div className="min-h-screen bg-[#1A1612] text-[#E0D0B0] font-serif selection:bg-[#5C1A1A] selection:text-white relative">
            <Background />

            {/* API Status Banner */}
            {!apiKey && (
                <div className="fixed top-0 left-0 w-full z-[1000] bg-[#5C1A1A] text-[#f4e4bc] py-2 px-4 shadow-xl border-b border-[#C5A059] flex items-center justify-center gap-3">
                    <LucideZap size={16} className="text-[#C5A059] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Linking to Aether... Set VITE_GEMINI_API_KEY
                    </span>
                </div>
            )}

            <AetherWhispers text={whisper} />

            {/* Main Content Area: V9 Focus-Fixed Layout */}
            <main className="relative z-10 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step + viewMode}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex flex-col items-center"
                    >
                        {step === 'language' && (
                            <ShutterTransition isActive={true}>
                                <LanguageView LANGUAGES={LANGUAGES} handleLanguageSelect={handleLanguageSelect} />
                            </ShutterTransition>
                        )}
                        {step === 'confirm' && (
                            <ShutterTransition isActive={false}>
                                <ConfirmView selectedLang={selectedLang} confirmLanguage={confirmLanguage} />
                            </ShutterTransition>
                        )}
                        {step === 'intro' && (
                            <ShutterTransition isActive={false}>
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
                            </ShutterTransition>
                        )}
                        {step === 'dashboard' && (
                            <ShutterTransition isActive={false}>
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
                            </ShutterTransition>
                        )}
                        {step === 'trailer' && (
                            <ShutterTransition isActive={false}>
                                <TrailerView selectedLang={selectedLang} resetStates={resetStates} setStep={setStep} playSfx={playSfx} />
                            </ShutterTransition>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Status Widgets */}
            <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-4 items-start">
                <AnimatePresence>
                    {spiritHint && (
                        <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-[#5C1A1A] text-[#f4e4bc] p-4 border-2 border-[#C5A059] shadow-2xl skew-x-[-2deg] max-w-[200px] text-[10px] uppercase font-black tracking-widest leading-relaxed"
                        >
                            <div className="absolute -top-2 left-4 px-2 bg-[#C5A059] text-[#1A1612] text-[8px]">Spirit Sense</div>
                            "{spiritHint}"
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={useSpiritSense}
                    disabled={isSpiritSensing}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#C5A059] bg-[#1A1612] text-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-110 active:scale-90 transition-all ${isSpiritSensing ? 'animate-pulse opacity-50' : ''}`}
                >
                    <LucideSparkles size={24} />
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
