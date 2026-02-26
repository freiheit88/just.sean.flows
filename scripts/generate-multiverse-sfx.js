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

const MULTIVERSE = [
    {
        id: 'ko',
        sounds: {
            click: 'Soft traditional Korean Gayageum single pluck, elegant and very short',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Korean traditional fan opening with wind-like whoosh over deep cinematic bass',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in Korean, subtle and cinematic'
        }
    },
    {
        id: 'en',
        sounds: {
            click: 'Clean, sleek modern digital click, minimal and soft',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Deep cinematic bass swell, sci-fi portal opening',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back", subtle and cinematic'
        }
    },
    {
        id: 'ja',
        sounds: {
            click: 'Japanese Zen stone tap, organic, soft, and peaceful',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Japanese Shamisen string pull transitioning into a smooth cinematic whoosh',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in Japanese, subtle and cinematic'
        }
    },
    {
        id: 'de',
        sounds: {
            click: 'Dark gothic iron lock click, heavy but muffled',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Gothic dark choir echo merging into a deep cinematic bass drop',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in German, subtle and cinematic'
        }
    },
    {
        id: 'fr',
        sounds: {
            click: 'Baroque Harpsichord single key press, delicate and ornate',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Elegant French palace chime echoing into a cinematic riser',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in French, subtle and cinematic'
        }
    },
    {
        id: 'cn',
        sounds: {
            click: 'Chinese Guzheng single soft pluck, resonant but quiet',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Chinese temple gong strike heavily muffled with a cinematic sub-bass rumble',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in Mandarin, subtle and cinematic'
        }
    },
    {
        id: 'es',
        sounds: {
            click: 'Soft Spanish Flamenco guitar body tap, rhythmic and warm',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Fast Flamenco strum dissolving into a cinematic woosh',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in Spanish, subtle and cinematic'
        }
    },
    {
        id: 'ar',
        sounds: {
            click: 'Middle Eastern Oud single soft note, warm and exotic',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Desert wind blowing through ancient ruins with a cinematic bass swell',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in Arabic, subtle and cinematic'
        }
    },
    {
        id: 'pl',
        sounds: {
            click: 'Vintage pocket watch tick, very quiet and metallic',
            hover: 'Muted cinematic synth pad swell, gentle and mysterious',
            transition: 'Cinematic orchestral swell with a hint of melancholic strings',
            whisper: 'A soft, breathy whisper of a man saying "Welcome back" in Polish, subtle and cinematic'
        }
    }
];

async function generateSound(country, type, prompt) {
    const filename = `${country}-${type}.mp3`;
    const targetPath = path.join(__dirname, '..', 'public', 'assets', 'sounds', filename);

    console.log(`Generating ${filename}...`);

    try {
        let rs;
        if (type === 'whisper') {
            // Use TTS for the whisper
            rs = await client.textToSpeech.convert("CwhRBWXzGAHq8TQ4Fs17", { // Valid voice ID
                model_id: "eleven_multilingual_v2",
                text: prompt,
                voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true }
            });
        } else {
            rs = await client.textToSoundEffects.convert({
                text: prompt,
                duration_seconds: type === 'click' ? 1.0 : type === 'hover' ? 1.5 : 3.0,
                prompt_influence: 0.3
            });
        }

        const fileStream = fs.createWriteStream(targetPath);

        // The elevenlabs sdk returns an AsyncIterable/ReadableStream, we can use pipeline for node
        await pipeline(rs, fileStream);

        console.log(`Successfully saved ${filename}`);

    } catch (e) {
        console.error(`Error generating ${filename}:`, e.message);
    }
}

async function main() {
    const outputDir = path.join(__dirname, '..', 'public', 'assets', 'sounds');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const data of MULTIVERSE) {
        for (const [type, prompt] of Object.entries(data.sounds)) {
            let actualPrompt = prompt;
            if (type === 'whisper') {
                switch (data.id) {
                    case 'ko': actualPrompt = "돌아온 걸 환영해."; break;
                    case 'en': actualPrompt = "Welcome back."; break;
                    case 'ja': actualPrompt = "お帰りなさい。"; break;
                    case 'de': actualPrompt = "Willkommen zurück."; break;
                    case 'fr': actualPrompt = "Bon retour."; break;
                    case 'cn': actualPrompt = "欢迎回来。"; break;
                    case 'es': actualPrompt = "Bienvenido de nuevo."; break;
                    case 'ar': actualPrompt = "مرحبا بعودتك"; break;
                    case 'pl': actualPrompt = "Witamy z powrotem."; break;
                }
            }

            await generateSound(data.id, type, actualPrompt);

            // Adding delay to respect rate limit
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    console.log("All multiverse sounds processed.");
}

main();
