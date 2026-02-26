import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ElevenLabsClient } from 'elevenlabs';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env.local to avoid dependencies
const apiKey = 'sk_813aecfa26381420051ec9e010841f917b6e5b8403541914';

const client = new ElevenLabsClient({ apiKey });

const MULTIVERSE = [
    {
        id: 'ko',
        theme: 'Fast-paced techno-trot song in the style of Korean singer Lee Pak-sa, high energy, electronic beats mixed with trot melody, 10 seconds'
    },
    {
        id: 'en',
        theme: 'Classic British Rock band song, punchy drums, electric guitar riff, stadium anthem feel, 10 seconds'
    },
    {
        id: 'es',
        theme: 'Spanish Flamenco house dance song, acoustic guitar, rhythmic handclaps, upbeat dance beat, 10 seconds'
    },
    {
        id: 'hi',
        theme: 'Modern Indian EDM, sitar-inspired synth leads, heavy bass, high-energy festival vibe, distinct from Arabic scales, 10 seconds'
    },
    {
        id: 'de',
        theme: 'Grand Symphony Orchestra in the style of Tchaikovsky, dramatic strings, powerful brass, majestic and emotional, 10 seconds'
    },
    {
        id: 'ja',
        theme: 'Traditional Japanese trio (Shamisen, Shakuhachi, Koto) with a mysterious and ethereal atmospheric layer, shimmering quality, 10 seconds'
    },
    {
        id: 'ar',
        theme: 'Modern Arabic Indie Band, oud mixed with electric guitar, soulful vocals, alternative rock influence, 10 seconds'
    },
    {
        id: 'pl',
        theme: 'Pumping Polish club music, 10 PM early night vibe, heavy techno beats, high-energy dance floor atmosphere, 10 seconds'
    }
];

async function generateTheme(id, prompt) {
    const filename = `${id}-theme.mp3`;
    const targetPath = path.join(__dirname, '..', 'public', 'assets', 'sounds', filename);

    console.log(`Generating cultural theme (Sound Effects API): ${filename}...`);

    try {
        const rs = await client.textToSoundEffects.convert({
            text: prompt,
            duration_seconds: 10.0,
            prompt_influence: 0.5
        });

        const fileStream = fs.createWriteStream(targetPath);
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
        await generateTheme(data.id, data.theme);
        // Adding delay to respect rate limit
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("All multiversal journey themes processed.");
}

main();
