import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ElevenLabsClient } from 'elevenlabs';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function generateSFX(name, prompt, duration) {
    const targetPath = path.join(__dirname, '..', 'public', 'assets', 'sounds', `${name}.mp3`);
    console.log(`Generating ${name}.mp3...`);

    try {
        const rs = await client.textToSoundEffects.convert({
            text: prompt,
            duration_seconds: duration,
            prompt_influence: 0.5
        });

        const fileStream = fs.createWriteStream(targetPath);
        await pipeline(rs, fileStream);
        console.log(`Successfully saved ${name}.mp3`);
    } catch (e) {
        console.error(`Error generating ${name}.mp3:`, e.message);
    }
}

async function main() {
    const outputDir = path.join(__dirname, '..', 'public', 'assets', 'sounds');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // Mystical Piano Chords for 3-stage saturation
    await generateSFX('piano-mystic-low', 'A single, deep, mystical piano chord with long resonance. Low register, mysterious, ethereal, cinematic.', 3);
    await generateSFX('piano-mystic-mid', 'A single, bright, mystical piano chord with long resonance. Mid register, magical, sparkling, cinematic.', 3);
    await generateSFX('piano-mystic-high', 'A single, high-pitched, heavenly piano chord. Shimmering, bright, triumphant, cinematic crescendo.', 3);

    // Portal Transition SFX
    await generateSFX('portal-transition', 'A cinematic sci-fi portal whoosh combined with a shimmering piano glissando. Transdimensional, high-tech, magical transition sound.', 4);

    console.log("Audio generation complete.");
}

main();
