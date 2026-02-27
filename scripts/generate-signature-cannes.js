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

async function generateSignature() {
    const targetPath = path.join(__dirname, '..', 'public', 'assets', 'sounds', 'signature-cannes.mp3');

    // Prompting for a cinematic sweep followed by a genius resolution chord
    const prompt = "A prestigious cinematic intro sound. It starts with a 3-second grand orchestral string and brass sweep, reaching a crescendo, followed immediately by a single, perfectly harmonized and brilliant 'genius' major resolution chord on violins and a golden celesta. Elegant, high-end acoustic resonance, 5 seconds total.";

    console.log("Generating signature-cannes.mp3...");

    try {
        const rs = await client.textToSoundEffects.convert({
            text: prompt,
            duration_seconds: 5.5,
            prompt_influence: 0.5
        });

        const fileStream = fs.createWriteStream(targetPath);
        await pipeline(rs, fileStream);
        console.log("Successfully saved signature-cannes.mp3");
    } catch (e) {
        console.error("Error generating sound:", e.message);
    }
}

generateSignature();
