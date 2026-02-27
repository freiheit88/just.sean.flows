import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ElevenLabsClient } from 'elevenlabs';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HARDCODED logic from previous turns to ensure reliability
const apiKey = 'sk_813aecfa26381420051ec9e010841f917b6e5b8403541914';

const client = new ElevenLabsClient({ apiKey });

// Voice ID for George (Narrator/British/Polished)
const VOICE_ID = "JBFqnCBv7St9WoD2Ok7h";

const GUIDANCE = [
    {
        id: 'ko',
        steps: {
            language: "자, 멍하니 있지 마세요. 원하는 문화를 가운데로 끌어다 놓으세요. 뷔페가 아니니 하나만 고르시라고요!",
            confirm: "정말 확실한가요? 한 번 언어가 묶이면 되돌리기 아주 곤란해집니다. 뭐, 가능은 하지만... 굉장히 어색할 거예요.",
            auth: "여기에 당신의 영혼을 각인하세요. 걱정 마세요, 아프지 않아요... 조금만 참으면요.",
            avatar: "에테르를 응시하세요. 음, 최대한 인간처럼 보이게 연성해 보죠.",
            dashboard: "좋아요, 들어오셨군요. 태엽장치를 망가뜨리지 않게 조심하세요. 주인님이 지켜보고 계시니까요."
        }
    },
    {
        id: 'en',
        steps: {
            language: "Alright, don't just stare at them. Drag your preferred culture to the center. It's not a buffet, just pick one!",
            confirm: "Are you quite sure? Once we bind your tongue, there's no turning back. Well, there is, but it's very awkward.",
            auth: "Stamp your soul here. No, it won't hurt... much.",
            avatar: "Look into the aether. Let's see if we can forge something that looks vaguely human.",
            dashboard: "You're in. Try not to break the gears. The master is watching."
        }
    },
    {
        id: 'es',
        steps: {
            language: "¡Vamos! No te quedes mirando. Arrastra tu cultura favorita al centro. No es un buffet, ¡elige solo una!",
            confirm: "¿Estás seguro? Una vez que vinculamos tu lengua, no hay vuelta atrás. Bueno, sí la hay, pero será muy incómodo.",
            auth: "Sella tu alma aquí. No, no dolerá... mucho.",
            avatar: "Mira hacia el éter. Veamos si podemos forjar algo que parezca vagamente humano.",
            dashboard: "Ya estás dentro. Intenta no romper los engranajes. El maestro está observando."
        }
    },
    {
        id: 'hi',
        steps: {
            language: "आलस्य छोड़ें! बस घूरें नहीं। अपनी पसंदीदा संस्कृति को केंद्र में खींचें। यह कोई बुफ़े नहीं है, बस एक चुनें!",
            confirm: "क्या आप वाकई आश्वस्त हैं? एक बार जब हम आपकी भाषा बांध देंगे, तो पीछे मुड़ना संभव नहीं होगा। खैर, है तो, लेकिन यह बहुत अजीब होगा।",
            auth: "अपनी आत्मा की छाप यहाँ लगाएँ। नहीं, यह दर्द नहीं करेगा... ज़्यादा नहीं।",
            avatar: "ईथर में देखें। देखते हैं कि क्या हम कुछ ऐसा बना सकते हैं जो थोड़ा-बहुत इंसान जैसा लगे।",
            dashboard: "आप अंदर हैं। गियर्स को न तोड़ने की कोशिश करें। मास्टर देख रहे हैं।"
        }
    },
    {
        id: 'de',
        steps: {
            language: "Nicht nur glotzen! Ziehen Sie Ihre bevorzugte Kultur in die Mitte. Es ist kein Buffet, wählen Sie einfach eine!",
            confirm: "Sind Sie ganz sicher? Sobald wir Ihre Zunge binden, gibt es kein Zurück mehr. Nun, es gibt eines, aber es ist sehr peinlich.",
            auth: "Stempeln Sie Ihre Seele hier ab. Nein, es wird nicht wehtun... nicht allzu sehr.",
            avatar: "Blicken Sie in den Äther. Mal sehen, ob wir etwas schmieden können, das vage menschlich aussieht.",
            dashboard: "Sie sind drin. Versuchen Sie, die Zahnräder nicht zu zerbrechen. Der Meister beobachtet Sie."
        }
    },
    {
        id: 'ja',
        steps: {
            language: "ぼーっとしていないで！好きな文化を中央にドラッグしてください。ビュッフェじゃないんだから、一つだけ選んで！",
            confirm: "本当にいいんですか？一度言語を縛ると、後戻りはできませんよ。まあ、できますけど…すごく気まずいことになりますよ。",
            auth: "ここに魂を刻印してください。大丈夫、痛くはありません…たぶんね。",
            avatar: "エーテルを見つめて。まあ、なんとなく人間らしく見えるように錬成してみましょう。",
            dashboard: "入れましたね。歯車を壊さないように気をつけて。主人が見ていますよ。"
        }
    },
    {
        id: 'ar',
        steps: {
            language: "هيا، لا تكتفِ بالمشاهدة. اسحب ثقافتك المفضلة إلى المركز. إنه ليس بوفيه، اختر واحدة فقط!",
            confirm: "هل أنت متأكد تمامًا؟ بمجرد أن نربط لسانك، لا يوجد تراجع. حسنًا، يوجد، لكن الأمر سيكون محرجًا للغاية.",
            auth: "اختم روحك هنا. لا، لن يؤلم... كثيرًا.",
            avatar: "انظر إلى الأثير. لنرى ما إذا كان بإمكاننا صياغة شيء يبدو بشريًا إلى حد ما.",
            dashboard: "لقد دخلت. حاول ألا تكسر التروس. السيد يراقبك."
        }
    },
    {
        id: 'pl',
        steps: {
            language: "Hej, nie gapić się! Przeciągnij wybraną kulturę na środek. To nie bufet, wybierz tylko jedną!",
            confirm: "Czy jesteś absolutnie pewien? Gdy już powiążemy twój język, nie ma odwrotu. Cóż, jest, ale będzie to bardzo krępujące.",
            auth: "Odcisnij tutaj swoją duszę. Nie, nie będzie boleć... za bardzo.",
            avatar: "Spójrz w eter. Zobaczmy, czy uda nam se wykuć coś, co przypomina człowieka.",
            dashboard: "Jesteś w środku. Postaraj się nie połamać trybów. Pan patrzy."
        }
    }
];

async function generateMinaTTS() {
    const soundDir = path.join(__dirname, '..', 'public', 'assets', 'sounds', 'mina');
    if (!fs.existsSync(soundDir)) fs.mkdirSync(soundDir, { recursive: true });

    for (const lang of GUIDANCE) {
        for (const [step, text] of Object.entries(lang.steps)) {
            const filename = `mina-${lang.id}-${step}.mp3`;
            const targetPath = path.join(soundDir, filename);

            console.log(`Generating TTS for ${lang.id} - ${step}...`);

            try {
                const rs = await client.textToSpeech.convert(VOICE_ID, {
                    text: text,
                    model_id: "eleven_multilingual_v2",
                    output_format: "mp3_44100_128"
                });

                const fileStream = fs.createWriteStream(targetPath);
                await pipeline(rs, fileStream);
                console.log(`Saved ${filename}`);
            } catch (e) {
                console.error(`Error for ${filename}:`, e.message);
            }
        }
    }
}

generateMinaTTS();
