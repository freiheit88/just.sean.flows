import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ElevenLabsClient } from 'elevenlabs';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env.local to avoid dependencies
const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/ELEVENLABS_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
}

if (!apiKey) {
    console.error("Error: ELEVENLABS_API_KEY NOT found in .env.local");
    process.exit(1);
}

const client = new ElevenLabsClient({ apiKey });

const GUIDANCE = {
    ko: {
        language: "로드 매너에 오신 것을 환영합니다. 마음에 드는 '에테르 케이스'를 중앙으로 끌어오세요. 아, 손가락은 조심하시고요.",
        confirm: "탁월한 선택입니다. 이제 그 케이스를 꾹 눌러서 당신의 세계로 확정하세요. 비가 올지도 모르니까요.",
        auth: "신원 확인이 필요합니다. 에테르에 당신의 이름을 남기거나 초상화를 스캔하세요. 영혼이 바뀔 일은 없을 겁니다.",
        avatar: "당신의 새로운 자아가 연성되었습니다. 꽤 근사하군요! 이제 매너의 아카이브를 탐험할 시간입니다.",
        dashboard: "매너 아카이브에 오신 것을 환영합니다. 각 칸을 눌러 우리 저택의 비밀과 기록들을 살펴보세요. 길을 잃지는 마시고요."
    },
    en: {
        language: "Welcome to the Lord Manor. Drag your preferred 'Aether Case' to the center. Mind your fingers, they're quite essential.",
        confirm: "A splendid choice. Now, hold down that case to seal your destination. Don't worry, the leak in the roof is mostly fixed.",
        auth: "Identity verification required. Ink your name into the Aether or scan your portrait. We promise not to mix up your soul with anyone else's.",
        avatar: "Your new persona has been forged. Quite dashing! It’s time to explore the Manor's archives.",
        dashboard: "Welcome to the Manor Archive. Tap each tile to reveal our secrets. Do try not to get lost in the hallways."
    },
    es: {
        language: "Bienvenido a Lord Manor. Arrastra tu 'Aether Case' preferido al centro. Cuida tus dedos, son bastante esenciales.",
        confirm: "Una elección espléndida. Ahora, mantén presionado ese estuche para sellar tu destino. No te preocupes, la gotera en el techo está casi arreglada.",
        auth: "Se requiere verificación de identidad. Escribe tu nombre en el Aether o escanea tu retrato. Prometemos no mezclar tu alma con la de nadie más.",
        avatar: "Tu nuevo personaje ha sido forjado. ¡Muy apuesto! Es hora de explorar los archivos de la Mansión.",
        dashboard: "Bienvenido al Archivo de la Mansión. Toca cada mosaico para revelar nuestros secretos. Intenta no perderte en los pasillos."
    },
    hi: {
        language: "लॉर्ड मै너 में आपका स्वागत है। अपने पसंदीदा 'ईथर केस' को केंद्र में खींचें। अपनी उंगलियों का ध्यान रखें, वे काफी आवश्यक हैं।",
        confirm: "एक शानदार विकल्प। अब, अपने गंतव्य को सील करने के लिए उस केस को दबाकर रखें। चिंता न करें, छत का रिساव काफी हद तक ठीक हो गया है।",
        auth: "पहचान सत्यापन आवश्यक है। ईथर में अपना नाम लिखें या अपना चित्र स्कैन करें। हम आपकी आत्मा को किसी और के साथ नहीं मिलाने का वादा करते हैं।",
        avatar: "आपका नया व्यक्तित्व गढ़ा गया है। काफी सुंदर! अब मै너 के अभिलेखागार का पता लगाने का समय आ गया है।",
        dashboard: "मैनर पुरालेख में आपका स्वागत है। हमारे रहस्यों को उजागर करने के लिए प्रत्येक टाइल पर टैप करें। गलियारों में खो न जाने का प्रयास करें।"
    },
    de: {
        language: "Willkommen im Lord Manor. Ziehen Sie Ihr bevorzugtes 'Äther-Case' in die Mitte. Passen Sie auf Ihre Finger auf, sie sind lebensnotwendig.",
        confirm: "Eine glänzende Wahl. Halten Sie nun dieses Case gedrückt, um Ihr Ziel zu besiegeln. Keine Sorge, das Leck im Dach ist fast repariert.",
        auth: "Identitätsprüfung erforderlich. Tragen Sie Ihren Namen in den Äther ein oder scannen Sie Ihr Porträt. Wir versprechen, Ihre Seele nicht mit der eines anderen zu vertauschen.",
        avatar: "Ihre neue Persona wurde geschmiedet. Ziemlich fesch! Es ist Zeit, die Archive des Herrenhauses zu erkunden.",
        dashboard: "Willkommen im Manor-Archiv. Tippen Sie auf jede Kachel, um unsere Geheimnisse zu enthüllen. Versuchen Sie, sich nicht in den Fluren zu verirren."
    },
    ja: {
        language: "ロード・マナーへようこそ。お好みの「エーテル・ケース」を中央にドラッグしてください。指を挟まないようにお気をつけください、大切ですから。",
        confirm: "素晴らしい選択です。では、そのケースを長押しして目的地を確定させましょう。屋根の雨漏りは大体直っていますのでご安心を。",
        auth: "身元確認が必要です。エーテルにお名前を記すか、肖像画をスキャンしてください。あなたの魂が他の誰かと入れ替わらないよう約束します。",
        avatar: "あなたの新しいペルソナが錬成されました。なかなかお似合いですよ！それでは、邸宅のアーカイブを探索しましょう。",
        dashboard: "マナー・アーカイブへようこそ。各タイルをタップして秘密を解き明かしてください。廊下で迷子にならないようにしてくださいね。"
    },
    ar: {
        language: "مرحبًا بكم في لورد مانور. اسحب 'حقيبة الأثير' المفضلة لديك إلى المركز. انتبه لأصابعك، فهي ضرورية للغاية.",
        confirm: "اختيار رائع. الآن، اضغط باستمرار على تلك الحقيبة لختم وجهتك. لا تقلق، لقد تم إصلاح تسرب السقف بشكل كبير.",
        auth: "مطلوب التحقق من الهوية. اكتب اسمك في الأثير أو امسح صورتك الشخصية. نعدك بعدم خلط روحك مع روح أي شخص آخر.",
        avatar: "لقد تمت صياغة شخصيتك الجديدة. أنيقة للغاية! حان الوقت لاستكشاف أرشيفات القصر.",
        dashboard: "مرحبًا بكم في أرشيف القصر. اضغط على كل بلاطة للكشف عن أسرارنا. حاول ألا تضيع في الممرات."
    },
    pl: {
        language: "Witamy w Lord Manor. Przeciągnij wybraną 'Eteryczną Skrzynię' na środek. Uważaj na palce, są całkiem przydatne.",
        confirm: "Wspaniały wybór. Teraz przytrzymaj tę skrzynię, aby przypieczętować swój cel. Nie martw się, przeciek w dachu został niemal naprawiony.",
        auth: "Wymagana weryfikacja tożsamości. Wpisz swoje imię w Eter lub zeskanuj swój portret. Obiecujemy nie pomylić twojej duszy z niczyją inną.",
        avatar: "Twoja nowa postać została wykuta. Całkiem szykownie! Czas odkryć archiwa Dworu.",
        dashboard: "Witamy w Archiwum Dworu. Dotknij każdego kafela, aby odkryć nasze sekrety. Staraj się nie zgubić w korytarzach."
    }
};

async function generateMinaVoice(langId, step, text) {
    const filename = `mina-${langId}-${step}.mp3`;
    const targetDir = path.join(__dirname, '..', 'public', 'assets', 'sounds', 'mina');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, filename);

    console.log(`Generating Mina voice: ${filename}...`);

    try {
        const rs = await client.textToSpeech.convert("CwhRBWXzGAHq8TQ4Fs17", { // Mimi voice - known good ID
            model_id: "eleven_multilingual_v2",
            text: text,
            voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true }
        });

        const fileStream = fs.createWriteStream(targetPath);
        await pipeline(rs, fileStream);
        console.log(`Successfully saved ${filename}`);

    } catch (e) {
        console.error(`Error generating ${filename}:`, e.message);
    }
}

async function main() {
    for (const [langId, steps] of Object.entries(GUIDANCE)) {
        for (const [step, text] of Object.entries(steps)) {
            await generateMinaVoice(langId, step, text);
            // Throttle to respect rate limits
            await new Promise(r => setTimeout(r, 1500));
        }
    }
    console.log("All Mina guidance voices processed.");
}

main();
