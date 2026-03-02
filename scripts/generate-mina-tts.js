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

// Voice ID for Jessica (Bright, Cheerful, Human)
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";

const GUIDANCE = [
    {
        id: 'ko',
        steps: {
            language: "원하는 세계관을 드래그하세요.",
            confirm: "지문을 찍어 운명을 확정하세요.",
            auth: "이름이나 사진으로 인증하세요.",
            avatar: "당신의 페르소나가 완성되었습니다.",
            dashboard: "기록 보관소를 탐색하세요."
        }
    },
    {
        id: 'en',
        steps: {
            language: "Drag your chosen multiverse.",
            confirm: "Imprint to seal fate.",
            auth: "Verify identity now.",
            avatar: "Your persona is forged.",
            dashboard: "Investigate the Manor archives."
        }
    },
    {
        id: 'es',
        steps: {
            language: "Arrastra tu multiverso elegido.",
            confirm: "Imprime para sellar destino.",
            auth: "Verifica tu identidad ahora.",
            avatar: "Tu persona está forjada.",
            dashboard: "Investiga los archivos ahora."
        }
    },
    {
        id: 'hi',
        steps: {
            language: "अपना मल्टीवर्स खींचें।", // Drag your multiverse.
            confirm: "भाग्य को सील करें।", // Seal the fate.
            auth: "अपनी पहचान सत्यापित करें।", // Verify your identity.
            avatar: "आपका व्यक्तित्व तैयार है।", // Your persona is ready.
            dashboard: "अभिलेखागार की जांच करें।" // Investigate the archives.
        }
    },
    {
        id: 'de',
        steps: {
            language: "Ziehe dein gewähltes Multiversum.",
            confirm: "Drücke, um Schicksal besiegeln.",
            auth: "Verifiziere deine Identität jetzt.",
            avatar: "Deine Persona ist geschmiedet.",
            dashboard: "Untersuche die Manor-Archive."
        }
    },
    {
        id: 'ja',
        steps: {
            language: "世界観をドラッグしてください。",
            confirm: "指紋で運命を確定。",
            auth: "身元を証明してください。",
            avatar: "ペルソナが完成しました。",
            dashboard: "保管所を探索してください。"
        }
    },
    {
        id: 'ar',
        steps: {
            language: "اسحب الكون المتعدد الخاص.", // Drag your multiverse.
            confirm: "ابصم لختم المصير.", // Imprint to seal fate.
            auth: "تحقق من هويتك الآن.", // Verify your identity now.
            avatar: "تم تشكيل شخصيتك.", // Your persona is formed.
            dashboard: "اكتشف أرشيف القصر." // Explore the Manor archive.
        }
    },
    {
        id: 'pl',
        steps: {
            language: "Przeciągnij wybrane multiwersum.",
            confirm: "Odciśnij, by zapieczętować los.",
            auth: "Zweryfikuj tożsamość teraz.",
            avatar: "Twoja persona jest gotowa.",
            dashboard: "Zbadaj archiwa Dworu."
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
                    output_format: "mp3_44100_128",
                    voice_settings: {
                        stability: 0.35,
                        similarity_boost: 0.8,
                        style: 0.15,
                        use_speaker_boost: true
                    }
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
