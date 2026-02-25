import React, { useState, useEffect, useRef } from 'react';
import {
    LucideCheckCircle, LucideGlobe, LucideInstagram,
    LucideSparkles, LucideInfo, LucideVolume2,
    LucideLoader2, LucideChevronLeft,
    LucideTrophy, LucideLayout, LucideMapPin,
    LucideFeather, LucideScroll, LucideCompass, LucideUser, LucideUpload,
    LucideCheckSquare, LucideSquare, LucideFlame, LucideSettings, LucideCamera, LucideZap
} from 'lucide-react';

/* [ASSET REPLACEMENT GUIDE]
  1. Background Music/Ambience: Search for "Victorian ambience" or "Clockwork sound".
  2. Images: Use style "Vintage paper", "Etching", "19th century portrait".
  3. TTS: Gemini TTS
*/

const apiKey = "";

const LANGUAGES = [
    {
        id: 'ko',
        name: 'Korean',
        welcome: '환영합니다, 귀한 손님. 이 낡은 저택의 설계자가 당신을 기다리고 있었습니다.',
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
            todoDone: "모든 임무를 마쳤습니다. 이제 저택을 자유롭게 거니십시오."
        }
    },
    {
        id: 'en',
        name: 'English',
        welcome: 'Welcome, esteemed guest. The Architect of this manor has been expecting you.',
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
            generating: "ENGRACING...",
            galleryTitle: "GALLERY OF MEMORIES",
            gallerySub: "Legacy & Present",
            returnGallery: "Return to Gallery",
            manorTitle: "The Study",
            manorHeirlooms: "Heirlooms",
            manorEstate: "Estate",
            authTitle: "Identification",
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
            todoDone: "Your duties are fulfilled. Feel free to wander the estate at your leisure."
        }
    },
    {
        id: 'hi',
        name: 'Hindi',
        welcome: 'स्वागत है, सम्मानित अतिथि। इस हवेली का वास्तुकार आपकी प्रतीक्षा कर रहा था।',
        loading: 'आपकी आत्मा को कैनवास पर उतारा जा रहा है... भाप के इंजन को गर्म होने में थोड़ा समय लगता है। धैर्य रखें, यह 19वीं सदी की सबसे बेहतरीन तकनीक है।',
        instrument: 'Sitar',
        flag: '🇮🇳',
        voice: 'Puck',
        ui: {
            confirmTitle: "क्या हम आगे बढ़ें, वास्तुकार?",
            confirmBtn: "अनुबंध पर हस्ताक्षर करें",
            textOptionTitle: "अपना नाम उकेरें",
            textOptionDesc: "यदि आप मशीन के साथ अपना चेहरा साझा नहीं करना चाहते हैं, तो बस अपना नाम बताएं। यह हमारे हॉल में चमक उठेगा।",
            textInputPlaceholder: "अपना नाम या उपनाम दर्ज करें",
            textSubmitBtn: "नाम से भाग्य बनाएं",
            uploadTitle: "अपना चित्र प्रस्तुत करें",
            generateBtn: "पहचान बनाएं",
            generating: "उत्कीर्णन...",
            galleryTitle: "यादों की गैलरी",
            gallerySub: "विरासत और वर्तमान",
            returnGallery: "गैलरी में लौटें",
            manorTitle: "अध्ययन कक्ष",
            manorHeirlooms: "विरासत",
            manorEstate: "जागीर",
            authTitle: "पहचान",
            authBtn: "क्रेडेंशियल प्रस्तुत करें",
            authDone: "क्रेडेंशियल सत्यापित",
            casePrefix: "प्रकरण सं.",
            prophecyTitle: "भविष्यवाणी",
            consulting: "आत्माओं से परामर्श...",
            sealBtn: "अपना भाग्य सील करें",
            reconsiderBtn: "पुनर्विचार करें",
            fateSealed: "भाग्य सील कर दिया गया",
            projectInitiated: "परियोजना शुरू की गई",
            todoTitle: "आज के कार्य",
            todo1: "पहचान बनाएं",
            todo2: "हवेली का निरीक्षण करें",
            todo3: "प्रकरण चुनें",
            todoDone: "आपके कर्तव्य पूरे हुए। हवेली में स्वतंत्र रूप से घूमें।"
        }
    },
    {
        id: 'ar',
        name: 'Arabic',
        welcome: 'أهلاً بك يا ضيفنا الكريم. مهندس هذا القصر كان في انتظارك.',
        loading: 'جاري نقش جوهرك على الرق... تروس القدر تدور ببطء ولكن بدقة متناهية. انتظر قليلاً بينما يقوم الخيميائي الرقمي بعمله.',
        instrument: 'Oud',
        flag: '🇸🇦',
        voice: 'Charon',
        ui: {
            confirmTitle: "هل نمضي قدمًا أيها المهندس؟",
            confirmBtn: "توقيع العقد",
            textOptionTitle: "انقش اسمك",
            textOptionDesc: "إذا كنت تفضل عدم مشاركة وجهك مع الآلة، فقط قدم اسمك. سوف يضيء في قاعاتنا.",
            textInputPlaceholder: "أدخل اسمك أو لقبك",
            textSubmitBtn: "اصنع مصيرك بالاسم",
            uploadTitle: "قدم صورتك الشخصية",
            generateBtn: "تشكيل الهوية",
            generating: "جاري النقش...",
            galleryTitle: "معرض الذكريات",
            gallerySub: "الإرث والحاضر",
            returnGallery: "العودة للمعرض",
            manorTitle: "غرفة الدراسة",
            manorHeirlooms: "الموروثات",
            manorEstate: "التركة",
            authTitle: "إثبات الهوية",
            authBtn: "تقديم أوراق الاعتماد",
            authDone: "تم التحقق",
            casePrefix: "قضية رقم",
            prophecyTitle: "النبؤة",
            consulting: "استشارة الأرواح...",
            sealBtn: "ختم مصيرك",
            reconsiderBtn: "إعادة النظر",
            fateSealed: "تم ختم المصير",
            projectInitiated: "بدأ المشروع",
            todoTitle: "مهام اليوم",
            todo1: "تشكيل الهوية",
            todo2: "تفقد القصر",
            todo3: "اختيار قضية",
            todoDone: "اكتملت مهامك. تجول بحرية في القصر."
        }
    },
    {
        id: 'zh',
        name: 'Chinese',
        welcome: '欢迎，尊贵的客人。这座庄园的建筑师一直在等您。',
        loading: '正在将您的灵魂描绘在画卷上... 蒸汽机的预热需要耐心。请稍安勿躁，这可是19世纪最尖端的工艺。',
        instrument: 'Guzheng',
        flag: '🇨🇳',
        voice: 'Leda',
        ui: {
            confirmTitle: "我们要继续吗，建筑师？",
            confirmBtn: "签署契约",
            textOptionTitle: "铭刻您的名字",
            textOptionDesc: "如果您不愿让机器之魂学习您的容貌，只需留下您的名字。它将在我们的殿堂中熠熠生辉。",
            textInputPlaceholder: "输入您的名字或别名",
            textSubmitBtn: "以名铸就命运",
            uploadTitle: "出示您的肖像",
            generateBtn: "铸造身份",
            generating: "雕刻中...",
            galleryTitle: "记忆画廊",
            gallerySub: "传承与现在",
            returnGallery: "返回画廊",
            manorTitle: "书房",
            manorHeirlooms: "传가宝",
            manorEstate: "庄园",
            authTitle: "身份验证",
            authBtn: "出示凭证 (10倍影响力)",
            authDone: "凭证已验证",
            casePrefix: "案件编号",
            prophecyTitle: "预言",
            consulting: "请示神明中...",
            sealBtn: "封印你的命运",
            reconsiderBtn: "重新考虑",
            fateSealed: "命运已定",
            projectInitiated: "项目已启动",
            todoTitle: "今日任务",
            todo1: "铸造身份",
            todo2: "参观庄园",
            todo3: "选择案件",
            todoDone: "任务已完成。请随意在庄园内漫步。"
        }
    },
    {
        id: 'de',
        name: 'German',
        welcome: 'Willkommen, werter Gast. Der Architekt dieses Anwesens hat Sie erwartet.',
        loading: 'Wir destillieren Ihre Essenz in den Äther... Dieser Mechanismus läuft mit Dampf und Magie. Richten Sie Ihr Monokel nicht, die Transformation steht unmittelbar bevor.',
        instrument: 'Piano',
        flag: '🇩🇪',
        voice: 'Fenrir',
        ui: {
            confirmTitle: "Sollen wir fortfahren, Architekt?",
            confirmBtn: "Vertrag unterzeichnen",
            textOptionTitle: "Gravieren Sie Ihren Namen",
            textOptionDesc: "Wenn Sie Ihr Antlitz nicht mit der Maschine teilen möchten, nennen Sie einfach Ihren Namen. Er wird in unseren Hallen hell erstrahlen.",
            textInputPlaceholder: "Geben Sie Ihren Namen ein",
            textSubmitBtn: "Schicksal durch Namen schmieden",
            uploadTitle: "Präsentieren Sie Ihr Porträt",
            generateBtn: "IDENTITÄT SCHMIEDEN",
            generating: "GRAVIEREN...",
            galleryTitle: "GALERIE DER ERINNERUNGEN",
            gallerySub: "Vermächtnis & Gegenwart",
            returnGallery: "Zur Galerie zurückkehren",
            manorTitle: "Das Studierzimmer",
            manorHeirlooms: "Erbstücke",
            manorEstate: "Anwesen",
            authTitle: "Identifikation",
            authBtn: "REFERENZEN VORLEGEN",
            authDone: "Referenzen verifiziert",
            casePrefix: "FALL NR.",
            prophecyTitle: "Die Prophezeiung",
            consulting: "Befragung der Geister...",
            sealBtn: "BESIEGELE DEIN SCHICKSAL",
            reconsiderBtn: "Wahl überdenken",
            fateSealed: "Schicksal besiegelt",
            projectInitiated: "PROJEKT GESTARTET",
            todoTitle: "Aufgaben",
            todo1: "Identität schmieden",
            todo2: "Anwesen inspizieren",
            todo3: "Fall auswählen",
            todoDone: "Ihre Pflichten sind erfüllt. Lustwandeln Sie frei auf dem Anwesen."
        }
    },
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

const App = () => {
    const [step, setStep] = useState('language');
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]); // Default to first for safety
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [votedId, setVotedId] = useState(null);
    const [viewMode, setViewMode] = useState('gallery');
    const [previewId, setPreviewId] = useState(null);

    // Todo State
    const [todos, setTodos] = useState({ avatar: false, home: false, voted: false });
    const [showTodo, setShowTodo] = useState(false);

    // Character State
    const [userAvatar, setUserAvatar] = useState(null);
    const [avatarLore, setAvatarLore] = useState("");
    const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [userName, setUserName] = useState(''); // New state for Text Avatar

    // Manor Interactive States
    const [candleLit, setCandleLit] = useState(true);
    const [gearsSpinning, setGearsSpinning] = useState(false);
    const [loreText, setLoreText] = useState("");

    const [oracleMessage, setOracleMessage] = useState("");

    useEffect(() => {
        // Typewriter effect for lore in Manor
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

    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setStep('confirm');
        // [TODO] Play background instrument sound without visual blocking
    };

    const confirmLanguage = async () => {
        setStep('intro');
        speakText(selectedLang.welcome);
        setShowTodo(true); // Show todo list from intro
    };

    const speakText = async (text) => {
        if (!apiKey) return; // Prevent failure if API key is not yet set by environment
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
                const mimeType = response.candidates[0].content.parts[0].inlineData.mimeType;
                const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)?.[1] || "24000");
                const wavUrl = pcmToWav(audioData, sampleRate);
                new Audio(wavUrl).play();
            }
        } catch (err) { console.error("TTS Error:", err); }
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
            const prompt = `Create a short, mysterious 19th-century steampunk persona for someone named "${userName}". Output in ${selectedLang.name}. Max 40 words.`;
            const loreResult = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            const lore = loreResult?.candidates?.[0]?.content?.parts?.[0]?.text || `The enigmatic ${userName}.`;

            const newUser = { image: null, textName: userName, lore: lore, isTextAvatar: true };
            setUserAvatar(newUser);
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } catch (err) {
            console.error(err);
            // Fallback if Gemini fails
            const newUser = { image: null, textName: userName, lore: `The enigmatic ${userName}.`, isTextAvatar: true };
            setUserAvatar(newUser);
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } finally {
            setIsAvatarGenerating(false);
        }
    };

    const generateCharacter = async () => {
        if (!uploadedImage) return;
        setIsAvatarGenerating(true);

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

            const newUser = { image: generatedUrl, lore: generatedLore, isTextAvatar: false };
            setUserAvatar(newUser);
            setTodos(p => ({ ...p, avatar: true }));
            setStep('dashboard');
        } catch (err) {
            console.error("Generation Error or Timeout:", err);
            // Fallback: Use Text Avatar if image generation hangs/fails
            const fallbackUser = { image: null, textName: "Anonymous", lore: generatedLore, isTextAvatar: true };
            setUserAvatar(fallbackUser);
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
            const prompt = `The user is considering the path: "${proj.title}". Write a mysterious, victorian-style prophecy about this choice. Output in ${selectedLang.name}. Max 30 words.`;
            const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            setOracleMessage(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
        } catch (err) { console.error(err); }
    };

    const confirmFinalVote = () => {
        if (!previewId) return;
        setVotedId(previewId);
        setTodos(p => ({ ...p, voted: true }));
        setStep('trailer');
    }

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

    // ---------------- STYLED COMPONENTS ----------------
    const PaperCard = ({ children, className = "", onClick }) => (
        <div onClick={onClick} className={`relative bg-[#f4e4bc] text-[#2c241b] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-[#d4c5a3] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] ${className}`}>
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#8b7355]" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#8b7355]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#8b7355]" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#8b7355]" />
            {children}
        </div>
    );

    // 3x4 Gallery Feed (Instagram style but Victorian Frames)
    const GalleryMap = () => {
        // 12 slots for 3x4 grid
        const slots = [
            { id: 1, type: 'manor', title: selectedLang.ui.manorTitle, icon: <LucideLayout size={28} /> },
            { id: 2, type: 'archive', title: '1899', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=200' },
            { id: 3, type: 'ad', title: 'Steam Co.', text: 'Finest Brass Gears' },
            { id: 4, type: 'archive', title: '1900', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=200' },
            { id: 5, type: 'current', isCenter: true }, // The Avatar (Center-ish)
            { id: 6, type: 'ad', title: 'Aether', text: 'Wireless Telegrams' },
            { id: 7, type: 'empty' },
            { id: 8, type: 'empty' },
            { id: 9, type: 'ad', title: 'Elixir', text: 'Cures all maladies' },
            { id: 10, type: 'empty' },
            { id: 11, type: 'empty' },
            { id: 12, type: 'empty' },
        ];

        return (
            <div className="w-full max-w-lg mx-auto grid grid-cols-3 gap-3 p-2">
                {slots.map((slot) => {
                    if (slot.type === 'current') {
                        return (
                            <button
                                key={slot.id}
                                onClick={() => setViewMode('mission_active')}
                                className="relative aspect-square bg-[#f4e4bc] border-4 border-[#c5a059] shadow-xl hover:scale-105 transition-transform group overflow-hidden"
                            >
                                <div className="absolute inset-0 p-1 bg-[#2c241b] flex items-center justify-center">
                                    {userAvatar?.isTextAvatar ? (
                                        <div className="w-full h-full border border-[#c5a059] flex items-center justify-center p-2">
                                            <span className="text-[#c5a059] font-serif font-black text-xl text-center break-words drop-shadow-[0_0_15px_rgba(197,160,89,0.8)] leading-tight">{userAvatar.textName}</span>
                                        </div>
                                    ) : userAvatar?.image ? (
                                        <img src={userAvatar.image} className="w-full h-full object-cover sepia-[0.3]" alt="Avatar" />
                                    ) : (
                                        <div className="w-full h-full bg-[#1a1612] flex items-center justify-center"><LucideUser className="text-[#c5a059]" size={32} /></div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 w-full bg-[#8b0000]/90 text-[#f4e4bc] text-[8px] font-bold py-1 uppercase border-t border-[#c5a059]">Current Era</div>
                            </button>
                        )
                    }
                    if (slot.type === 'manor') {
                        return (
                            <button
                                key={slot.id}
                                onClick={() => {
                                    setViewMode('home_interior');
                                    setTodos(p => ({ ...p, home: true }));
                                }}
                                className="relative aspect-square bg-[#2c241b] border-4 border-[#4a3b2a] shadow-lg flex flex-col items-center justify-center hover:border-[#c5a059] transition-colors group"
                            >
                                <div className="text-[#c5a059] group-hover:scale-110 transition-transform mb-1">{slot.icon}</div>
                                <span className="text-[#8b7355] text-[9px] font-serif uppercase">{slot.title}</span>
                            </button>
                        )
                    }
                    if (slot.type === 'archive') {
                        return (
                            <div key={slot.id} className="relative aspect-square border-4 border-[#2c241b] bg-[#1a1612] overflow-hidden group grayscale hover:grayscale-0 transition-all">
                                <img src={slot.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" alt="archive" />
                                <div className="absolute bottom-1 left-1 bg-black/60 px-1 text-[#d4c5a3] text-[8px] border border-[#4a3b2a]">{slot.title}</div>
                            </div>
                        )
                    }
                    if (slot.type === 'ad') {
                        return (
                            <PaperCard key={slot.id} className="relative aspect-square flex flex-col items-center justify-center p-2 text-center border-[#4a3b2a]">
                                <span className="font-black text-[10px] uppercase border-b border-[#8b7355] mb-1 leading-tight">{slot.title}</span>
                                <span className="text-[8px] italic text-[#5c4d3c] leading-tight">{slot.text}</span>
                            </PaperCard>
                        )
                    }
                    // Empty frame
                    return (
                        <div key={slot.id} className="relative aspect-square border-4 border-[#2c241b] bg-[#1a1612]/50 shadow-inner flex items-center justify-center">
                            <div className="w-full h-full m-1 border border-dashed border-[#4a3b2a] opacity-30" />
                        </div>
                    )
                })}
            </div>
        );
    };

    // To-Do List Widget
    const TodoWidget = () => {
        if (!showTodo) return null;
        const allDone = todos.avatar && todos.home && todos.voted;

        return (
            <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-8">
                <div className="bg-[#f4e4bc] border-2 border-[#8b7355] p-4 shadow-[5px_5px_0_rgba(44,36,27,1)] max-w-[200px] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
                    <div className="absolute -top-3 -left-3 bg-[#8b0000] p-1 border border-[#c5a059] rotate-[-10deg]">
                        <LucideScroll size={16} className="text-[#f4e4bc]" />
                    </div>
                    <h4 className="font-serif font-bold text-[#5c1a1a] text-xs border-b border-[#8b7355] pb-1 mb-2 uppercase text-center ml-2">{selectedLang.ui.todoTitle}</h4>

                    <div className="space-y-2 text-[10px] font-serif text-[#2c241b]">
                        <div className="flex items-start gap-2">
                            {todos.avatar ? <LucideCheckSquare size={14} className="text-[#556b2f] shrink-0" /> : <LucideSquare size={14} className="text-[#8b7355] shrink-0" />}
                            <span className={todos.avatar ? 'line-through opacity-50' : ''}>{selectedLang.ui.todo1}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            {todos.home ? <LucideCheckSquare size={14} className="text-[#556b2f] shrink-0" /> : <LucideSquare size={14} className="text-[#8b7355] shrink-0" />}
                            <span className={todos.home ? 'line-through opacity-50' : ''}>{selectedLang.ui.todo2}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            {todos.voted ? <LucideCheckSquare size={14} className="text-[#556b2f] shrink-0" /> : <LucideSquare size={14} className="text-[#8b7355] shrink-0" />}
                            <span className={todos.voted ? 'line-through opacity-50' : ''}>{selectedLang.ui.todo3}</span>
                        </div>
                    </div>

                    {allDone && (
                        <div className="mt-3 p-2 bg-[#556b2f]/20 border border-[#556b2f] text-[#556b2f] text-[9px] text-center italic animate-pulse">
                            {selectedLang.ui.todoDone}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#1a1612] text-[#e0d0b0] font-serif selection:bg-[#5c1a1a] selection:text-white overflow-x-hidden relative">
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] opacity-30 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />

            <main className="relative z-10 max-w-lg mx-auto px-4 py-10 pb-32">

                {/* Step 1: Language */}
                {step === 'language' && (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-8 duration-1000 ease-out">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => handleLanguageSelect(lang)}
                                className="relative p-6 bg-[#25201b] border border-[#4a3b2a] hover:bg-[#2c241b] hover:border-[#c5a059] transition-all duration-500 group overflow-hidden"
                            >
                                <span className="relative z-10 text-4xl block mb-3 group-hover:scale-110 transition-transform">{lang.flag}</span>
                                <span className="relative z-10 font-serif font-bold text-sm uppercase text-[#c5a059]">{lang.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Confirm */}
                {step === 'confirm' && selectedLang && (
                    <PaperCard className="text-center py-16 space-y-8 animate-in zoom-in duration-700">
                        <LucideFeather className="w-16 h-16 mx-auto text-[#5c1a1a] animate-pulse" />
                        <p className="text-2xl font-bold leading-tight px-4 text-[#2c241b] font-serif italic">"{selectedLang.ui.confirmTitle}"</p>
                        <button onClick={confirmLanguage} className="w-full py-4 bg-[#2c241b] text-[#f4e4bc] font-serif font-bold text-lg hover:bg-[#5c1a1a] transition-colors border border-[#4a3b2a]">
                            {selectedLang.ui.confirmBtn}
                        </button>
                    </PaperCard>
                )}

                {/* Step 3: Intro */}
                {step === 'intro' && selectedLang && (
                    <div className="text-center space-y-8 animate-in fade-in duration-1000">
                        <PaperCard className="py-8">
                            <h2 className="text-xl font-bold italic text-[#2c241b] leading-relaxed font-serif">"{selectedLang.welcome}"</h2>
                        </PaperCard>

                        <div className="space-y-6">
                            {/* 1. Text Avatar Option (Gentle Fallback) */}
                            <div className="p-8 border-2 border-[#c5a059] bg-[#5c1a1a]/10 hover:bg-[#5c1a1a]/20 transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.15)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#c5a059] to-transparent opacity-20 pointer-events-none" />
                                <h3 className="text-lg font-bold text-[#c5a059] mb-2 drop-shadow-[0_0_8px_rgba(197,160,89,0.8)] font-serif uppercase tracking-widest">{selectedLang.ui.textOptionTitle}</h3>
                                <p className="text-xs text-[#d4c5a3] mb-5 leading-relaxed italic">{selectedLang.ui.textOptionDesc}</p>

                                <input
                                    type="text"
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    placeholder={selectedLang.ui.textInputPlaceholder}
                                    className="w-full bg-[#1a1612] text-[#f4e4bc] border border-[#c5a059] p-4 mb-4 focus:outline-none focus:shadow-[0_0_15px_rgba(197,160,89,0.4)] text-center font-serif text-lg transition-all"
                                />

                                <button
                                    onClick={generateTextCharacter}
                                    disabled={isAvatarGenerating || !userName.trim()}
                                    className="w-full py-4 bg-[#c5a059] text-[#1a1612] font-serif font-bold text-sm hover:bg-[#d4c5a3] transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg"
                                >
                                    {isAvatarGenerating ? <LucideLoader2 className="animate-spin" /> : <LucideFeather size={18} />}
                                    {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-[#4a3b2a]"></div>
                                <span className="text-[#8b7355] text-[10px] uppercase font-bold tracking-widest">OR</span>
                                <div className="flex-1 h-px bg-[#4a3b2a]"></div>
                            </div>

                            {/* 2. Image Upload Option */}
                            <label className="block w-full cursor-pointer group">
                                <div className="p-8 border-2 border-dashed border-[#4a3b2a] bg-[#25201b]/50 hover:border-[#8b7355] transition-all duration-500">
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    <LucideUpload className="mx-auto mb-4 text-[#8b7355] group-hover:text-[#d4c5a3] transition-colors" />
                                    <p className="text-xs text-[#8b7355] uppercase font-bold tracking-widest">{selectedLang.ui.uploadTitle}</p>
                                </div>
                            </label>

                            {uploadedImage && (
                                <button onClick={generateCharacter} disabled={isAvatarGenerating} className="w-full py-5 bg-[#2c241b] text-[#f4e4bc] font-serif font-bold text-sm hover:bg-[#4a3b2a] transition-all disabled:opacity-50 flex items-center justify-center gap-3 border border-[#8b7355]">
                                    {isAvatarGenerating ? <LucideLoader2 className="animate-spin" /> : <LucideCamera size={18} />}
                                    {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.generateBtn}
                                </button>
                            )}

                            {isAvatarGenerating && (
                                <div className="p-4 bg-[#1a1612] border border-[#8b7355] text-[#8b7355] text-xs font-serif italic mt-4 animate-pulse leading-loose text-left shadow-inner">
                                    {selectedLang.loading}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 4: Dashboard */}
                {step === 'dashboard' && selectedLang && (
                    <div className="animate-in fade-in duration-1000">

                        {viewMode === 'gallery' && (
                            <>
                                <div className="text-center mb-10">
                                    <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 text-[#c5a059] drop-shadow-md">{selectedLang.ui.galleryTitle}</h1>
                                    <div className="w-16 h-[2px] bg-[#c5a059] mx-auto mb-2" />
                                    <p className="text-[#8b7355] text-[10px] uppercase tracking-widest">{selectedLang.ui.gallerySub}</p>
                                </div>
                                <GalleryMap />
                            </>
                        )}

                        {/* Interactive Manor */}
                        {viewMode === 'home_interior' && (
                            <div className="animate-in zoom-in duration-700">
                                <button onClick={() => setViewMode('gallery')} className="mb-4 flex items-center gap-2 text-[#8b7355] hover:text-[#c5a059] uppercase text-[10px] font-bold tracking-widest"><LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}</button>

                                <PaperCard className="min-h-[500px] p-0 overflow-hidden bg-[#2c241b] border-[#4a3b2a] relative">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800')] opacity-30 sepia contrast-125" />

                                    {/* Floating Dust Particles Effect */}
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_4s_linear_infinite]" />

                                    <div className="relative z-10 flex flex-col items-center p-8 h-full">

                                        {/* Interactive Candle */}
                                        <div
                                            className="absolute top-6 left-6 cursor-pointer group"
                                            onClick={() => setCandleLit(!candleLit)}
                                        >
                                            <LucideFlame size={32} className={`transition-all duration-500 ${candleLit ? 'text-[#ffaa00] drop-shadow-[0_0_15px_rgba(255,170,0,0.8)]' : 'text-[#4a3b2a]'}`} />
                                            <span className="text-[8px] text-[#8b7355] opacity-0 group-hover:opacity-100 absolute -bottom-4 whitespace-nowrap">Touch to extinguish</span>
                                        </div>

                                        {/* Interactive Gears */}
                                        <div
                                            className="absolute top-6 right-6 cursor-pointer group"
                                            onClick={() => setGearsSpinning(!gearsSpinning)}
                                        >
                                            <LucideSettings size={32} className={`text-[#c5a059] transition-all duration-[3000ms] ease-linear ${gearsSpinning ? 'rotate-[360deg]' : ''}`} />
                                        </div>

                                        <div className={`w-32 h-32 rounded-full border-4 border-[#c5a059] flex items-center justify-center overflow-hidden shadow-2xl mb-6 transition-all duration-1000 ${candleLit ? '' : 'brightness-50'} ${userAvatar?.isTextAvatar ? 'bg-[#1a1612]' : ''}`}>
                                            {userAvatar?.isTextAvatar ? (
                                                <span className="text-[#c5a059] font-serif font-black text-2xl text-center break-words drop-shadow-[0_0_15px_rgba(197,160,89,0.8)] px-2 leading-tight tracking-widest">{userAvatar.textName}</span>
                                            ) : (
                                                <img src={userAvatar?.image || "https://via.placeholder.com/150"} className="w-full h-full object-cover sepia-[0.4]" alt="Avatar" />
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-serif font-bold text-[#f4e4bc] mb-2 uppercase tracking-widest">{selectedLang.ui.manorTitle}</h3>
                                        <div className="w-12 h-1 bg-[#c5a059] mb-4" />

                                        {/* Typewriter Lore */}
                                        <div className="min-h-[100px] w-full bg-[#1a1612]/50 p-4 border border-[#4a3b2a] mb-8 font-mono text-xs text-[#d4c5a3] leading-relaxed relative">
                                            <span className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-[#8b7355]" />
                                            <span className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-[#8b7355]" />
                                            {loreText}<span className="animate-pulse">_</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 w-full border-t border-[#4a3b2a] pt-8">
                                            <div className="flex flex-col items-center justify-center hover:scale-110 transition-transform cursor-pointer group" onClick={() => { }}>
                                                <div className="w-12 h-12 rounded-full border border-[#8b7355] flex items-center justify-center bg-[#1a1a1a]/80 group-hover:border-[#c5a059] group-hover:bg-[#2c241b]">
                                                    <LucideTrophy size={20} className="text-[#8b7355] group-hover:text-[#c5a059]" />
                                                </div>
                                                <span className="text-[10px] uppercase font-bold text-[#8b7355] mt-2">{selectedLang.ui.manorHeirlooms}</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center opacity-50">
                                                <div className="w-12 h-12 rounded-full border border-[#4a3b2a] flex items-center justify-center bg-[#1a1a1a]/80">
                                                    <LucideLayout size={20} className="text-[#4a3b2a]" />
                                                </div>
                                                <span className="text-[10px] uppercase font-bold text-[#4a3b2a] mt-2">{selectedLang.ui.manorEstate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </PaperCard>
                            </div>
                        )}

                        {/* Active Mission Selection */}
                        {viewMode === 'mission_active' && (
                            <div className="animate-in slide-in-from-bottom duration-700">
                                <button onClick={() => setViewMode('gallery')} className="mb-4 flex items-center gap-2 text-[#8b7355] hover:text-[#c5a059] uppercase text-[10px] font-bold tracking-widest"><LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}</button>

                                <PaperCard className="mb-6 border-[#c5a059]">
                                    <h3 className="flex items-center gap-2 font-bold text-[#5c1a1a] mb-2 uppercase tracking-widest text-sm">{selectedLang.ui.authTitle}</h3>
                                    {!isAuthenticated ? (
                                        <button onClick={setIsAuthenticated.bind(null, true)} className="w-full py-3 bg-[#2c241b] text-[#f4e4bc] text-xs font-bold border border-[#4a3b2a] hover:bg-[#5c1a1a]">
                                            {selectedLang.ui.authBtn}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 text-[#556b2f] font-bold bg-[#556b2f]/10 p-3 justify-center text-xs border border-[#556b2f]/30">
                                            <LucideCheckCircle size={16} /> {selectedLang.ui.authDone}
                                        </div>
                                    )}
                                </PaperCard>

                                <div className="grid grid-cols-1 gap-4 pb-20">
                                    {PROJECTS.sort((a, b) => (a.id === previewId ? -1 : b.id === previewId ? 1 : 0)).map((proj) => {
                                        const isSelected = previewId === proj.id;
                                        const isDisabled = previewId && !isSelected;

                                        return (
                                            <div key={proj.id} className={`transition-all duration-700 ${isDisabled ? 'opacity-40 grayscale pointer-events-none scale-95' : ''} ${isSelected ? 'scale-105 z-10' : ''}`}>
                                                <button disabled={!isAuthenticated || isDisabled} onClick={() => handlePreviewVote(proj.id)} className={`w-full p-6 text-left transition-all border-2 relative group ${isSelected ? 'bg-[#f4e4bc] border-[#c5a059] shadow-2xl' : 'bg-[#25201b] border-[#4a3b2a] hover:border-[#8b7355]'}`}>
                                                    <span className={`text-[10px] font-mono mb-1 block ${isSelected ? 'text-[#8b0000]' : 'text-[#5c4d3c]'}`}>{selectedLang.ui.casePrefix} 0{proj.id}</span>
                                                    <h4 className={`font-serif font-bold text-lg mb-1 ${isSelected ? 'text-[#2c241b]' : 'text-[#c5a059]'}`}>{proj.title}</h4>
                                                    <p className={`text-xs ${isSelected ? 'text-[#5c4d3c]' : 'text-[#8b7355]'}`}>{proj.desc}</p>
                                                </button>

                                                {isSelected && (
                                                    <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
                                                        <div className="bg-[#1a1612] p-6 border border-[#c5a059] relative mb-4">
                                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a1612] px-3 text-[#c5a059] text-[10px] uppercase border border-[#c5a059]">{selectedLang.ui.prophecyTitle}</div>
                                                            <p className="text-[#f4e4bc] text-sm italic leading-relaxed text-center">"{oracleMessage || selectedLang.ui.consulting}"</p>
                                                        </div>
                                                        <button onClick={confirmFinalVote} className="w-full py-4 bg-[#8b0000] text-[#f4e4bc] font-bold text-sm uppercase border-2 border-[#5c1a1a] flex items-center justify-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#f4e4bc]" /> {selectedLang.ui.sealBtn} <div className="w-1.5 h-1.5 rounded-full bg-[#f4e4bc]" />
                                                        </button>
                                                        <button onClick={() => { setPreviewId(null); setOracleMessage(""); }} className="w-full mt-2 text-[#8b7355] text-[10px] uppercase tracking-widest">
                                                            {selectedLang.ui.reconsiderBtn}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* Step 5: Trailer */}
                {step === 'trailer' && selectedLang && (
                    <div className="animate-in slide-in-from-top-8 duration-1000 space-y-6">
                        <div className="aspect-video bg-[#1a1a1a] border-8 border-[#2c241b] relative shadow-2xl">
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-10 text-center">
                                <LucideZap className="text-[#c5a059] mb-4 animate-[bounce_3s_infinite]" size={40} />
                                <h2 className="text-3xl font-serif font-bold text-[#f4e4bc] uppercase tracking-widest mb-2">{selectedLang.ui.fateSealed}</h2>
                                <p className="text-[10px] text-[#8b7355] tracking-[0.5em] mt-2 border-t border-b border-[#8b7355] py-2">{selectedLang.ui.projectInitiated}</p>
                            </div>
                            <img src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800`} className="absolute inset-0 w-full h-full object-cover opacity-20 sepia" alt="Trailer BG" />
                        </div>

                        <PaperCard className="text-center space-y-6">
                            <p className="text-sm italic leading-relaxed text-[#2c241b]">"{oracleMessage}"</p>
                            <div className="w-8 h-8 mx-auto border-t border-b border-[#8b7355]" />
                            <button onClick={() => { setStep('dashboard'); setViewMode('gallery'); }} className="flex items-center gap-2 mx-auto text-[10px] text-[#5c4d3c] hover:text-[#8b0000] uppercase font-bold">
                                <LucideChevronLeft size={14} /> {selectedLang.ui.returnGallery}
                            </button>
                        </PaperCard>
                    </div>
                )}

                {/* Floating To-Do Widget */}
                <TodoWidget />

            </main>
        </div>
    );
};

export default App;
