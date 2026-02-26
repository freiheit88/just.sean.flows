import { ElevenLabsClient } from 'elevenlabs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/ELEVENLABS_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
}

console.log("Using API Key (last 4):", apiKey.slice(-4));

const client = new ElevenLabsClient({ apiKey });

async function test() {
    try {
        const voices = await client.voices.getAll();
        console.log("Successfully connected to ElevenLabs. Voice count:", voices.voices.length);
    } catch (e) {
        console.error("Authentication failed:", e.message);
    }
}

test();
