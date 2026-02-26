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

async function generateSignatureIntro() {
    const filename = `signature-intro.mp3`;
    const targetPath = path.join(__dirname, '..', 'public', 'assets', 'sounds', filename);
    const prompt = 'A Netflix-style logo intro signature sound: combining a single Traditional Korean Gayageum pluck, a soaring classical violin swell, and a heavy modern electronic synth chord, playing together in a mysterious, awe-inspiring harmony.';

    console.log(`Generating ${filename}...`);
    console.log(`Prompt: ${prompt}`);

    try {
        const rs = await client.textToSoundEffects.convert({
            text: prompt,
            duration_seconds: 3.5, // Short, punchy intro length
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

    await generateSignatureIntro();
    console.log("Signature intro generation complete.");
}

main();
