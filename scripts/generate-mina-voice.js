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
        language: "동기화 완료. 선택한 포트레잇을 중앙으로 끌어와 멀티버스를 확정하세요. 시간은 가연성 높은 자원이니 지체하지 마시길.",
        confirm: "탁월한 결단입니다. 이제 지문을 찍어 운명을 봉인하세요. 폭발은 면할 겁니다.",
        auth: "이름을 등록하거나 초상화를 제출해 신원을 인증하세요. 기계는 유령을 태우지 않습니다.",
        avatar: "페르소나 연성 완료. 꽤 봐줄 만하군요. 이제 저택의 기록 보관소로 이동하시죠.",
        dashboard: "기록 보관소 진입 성공. 각 기록을 탭하여 조사하세요. 복도에서 길을 잃어도 구하러 가지 않습니다."
    },
    en: {
        language: "Synchronization achieved. Drag the chosen portrait to the center to lock your multiverse. Time is highly flammable, do not dawdle.",
        confirm: "A calculated choice. Imprint your thumb to seal this fate. We should avoid any spontaneous combustion.",
        auth: "Identity verification required. Ink your name or submit a scan. The machine does not transport ghosts.",
        avatar: "Persona forged. Passable, I suppose. Proceed to the Manor archives immediately.",
        dashboard: "Archive breach successful. Tap the records to investigate. If you get lost in the halls, I will not search for you."
    },
    es: {
        language: "Sincronización lograda. Arrastra el retrato elegido al centro para fijar tu multiverso. El tiempo es muy inflamable, no te demores.",
        confirm: "Una elección calculada. Imprime tu huella para sellar este destino. Deberíamos evitar la combustión espontánea.",
        auth: "Se requiere verificación. Escribe tu nombre o escanea tu retrato. La máquina no transporta fantasmas.",
        avatar: "Persona forjada. Pasable, supongo. Proceda a los archivos de la Mansión inmediatamente.",
        dashboard: "Infiltración al archivo exitosa. Toca los registros para investigar. Si te pierdes, no iré a buscarte."
    },
    hi: {
        language: "तुल्यकालन पूरा हुआ। अपने मल्टीवर्स को लॉक करने के लिए चुने गए चित्र को केंद्र में खींचें। समय अत्यधिक ज्वलनशील है, देर न करें।",
        confirm: "एक सोची-समझी पसंद। इस भाग्य को सील करने के लिए अपना अंगूठा छापें। हमें किसी भी विस्फोट से बचना चाहिए।",
        auth: "पहचान सत्यापन आवश्यक है। अपना नाम लिखें या चित्र स्कैन करें। मशीन भूतों को नहीं ले जाती।",
        avatar: "व्यक्तित्व गढ़ा गया। ठीक-ठाक है। तुरंत मैनर के अभिलेखागार में आगे बढ़ें।",
        dashboard: "अभिलेखागार में प्रवेश सफल। जांच के लिए रिकॉर्ड पर टैप करें। यदि आप खो जाते हैं, तो मैं आपको नहीं ढूंढूंगी।"
    },
    de: {
        language: "Synchronisation erreicht. Ziehen Sie das Porträt in die Mitte, um Ihr Multiversum zu sperren. Zeit ist hochentzündlich, trödeln Sie nicht.",
        confirm: "Eine kalkulierte Wahl. Drücken Sie Ihren Daumen darauf, um dieses Schicksal zu besiegeln. Wir sollten spontane Selbstentzündung vermeiden.",
        auth: "Identitätsprüfung erforderlich. Tragen Sie Ihren Namen ein oder scannen Sie Ihr Porträt. Die Maschine transportiert keine Geister.",
        avatar: "Persona geschmiedet. Akzeptabel, nehme ich an. Begeben Sie sich umgehend in das Manor-Archiv.",
        dashboard: "Archivzugriff erfolgreich. Tippen Sie auf die Akten, um zu untersuchen. Wenn Sie sich verirren, werde ich nicht nach Ihnen suchen."
    },
    ja: {
        language: "同期完了。選択した肖像を中央にドラッグしてマルチバースを確定しなさい。時間は引火性が高いので、ぐずぐずしないでください。",
        confirm: "計算された選択です。指紋を押してこの運命を封印しなさい。自然発火は避けるべきです。",
        auth: "身元確認が必要です。署名するか肖像をスキャンしなさい。この機械は幽霊を運びません。",
        avatar: "ペルソナ錬成完了。まあまあですね。直ちに館の記録保管所へ進みなさい。",
        dashboard: "アーカイブへの侵入成功。各記録をタップして調査しなさい。廊下で迷子になっても探しに行きませんよ。"
    },
    ar: {
        language: "تمت المزامنة. اسحب الصورة المختارة إلى المركز لقفل الكون المتعدد الخاص بك. الوقت سريع الاشتعال، لا تتباطأ.",
        confirm: "اختيار محسوب. اطبع إبهامك لختم هذا القدر. يجب أن نتجنب الاحتراق التلقائي.",
        auth: "مطلوب التحقق من الهوية. اكتب اسمك أو قم بمسح صورتك. الآلة لا تنقل الأشباح.",
        avatar: "تمت صياغة الشخصية. مقبولة، على ما أظن. تقدم إلى أرشيفات القصر على الفور.",
        dashboard: "اقتحام الأرشيف ناجح. اضغط على السجلات للتحقيق. إذا ضللت طريقك، فلن أبحث عنك."
    },
    pl: {
        language: "Synchronizacja zakończona. Przeciągnij portret na środek, aby zablokować multiversum. Czas jest wysoce łatwopalny, nie zwlekaj.",
        confirm: "Wyrachowany wybór. Odciśnij kciuk, aby przypieczętować ten los. Powinniśmy unikać samozapłonu.",
        auth: "Wymagana weryfikacja. Wpisz imię lub zeskanuj portret. Maszyna nie transportuje duchów.",
        avatar: "Persona wykuta. Znośna, jak sądzę. Natychmiast udaj się do Archiwum Dworu.",
        dashboard: "Włamanie do Archiwum udane. Dotknij akt, aby zbadać. Jeśli się zgubisz, nie będę cię szukać."
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
