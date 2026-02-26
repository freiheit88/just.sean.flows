import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ElevenLabsClient } from 'elevenlabs';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = 'sk_813aecfa26381420051ec9e010841f917b6e5b8403541914';

const client = new ElevenLabsClient({ apiKey });

async function generateCannesSound() {
    const filename = `signature-cannes.mp3`;
    const targetPath = path.join(__dirname, '..', 'public', 'assets', 'sounds', filename);

    console.log(`Generating Cannes Signature Sound...`);

    try {
        const rs = await client.textToSoundEffects.convert({
            text: 'Grand orchestral cinematic swell, high-end film festival opening theme, elegant violins crescendoing into a majestic brass fanfare, subtle movie projector clicking in the start, premium theater atmosphere, emotional and triumphant, 6 seconds',
            duration_seconds: 6.0,
            prompt_influence: 0.5
        });

        const fileStream = fs.createWriteStream(targetPath);
        await pipeline(rs, fileStream);

        console.log(`Successfully saved ${filename}`);

    } catch (e) {
        console.error(`Error generating ${filename}:`, e.message);
    }
}

generateCannesSound();
