import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    // try global process.env or loading manually
} catch (e) {
    if (fs.existsSync(path.join(__dirname, '..', '.env.local'))) {
        const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
            }
        });
    }
}

// Ensure we have an API key
const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_813aecfa26381420051ec9e010841f917b6e5b8403541914';
const VOICE_ID = "cgSgspJ2msm6clMCkdW9"; // Jessica - Playful, Bright, Warm

const HUMAN_SOUNDS = [
    { name: "human-1", text: "Hmm..." },
    { name: "human-2", text: "*Sigh*" },
    { name: "human-3", text: "*Clears throat*" },
    { name: "human-4", text: "Ah..." },
    { name: "human-5", text: "Oh..." },
    { name: "human-6", text: "*Chuckle*" },
    { name: "human-7", text: "Right..." },
    { name: "human-8", text: "Well..." },
    { name: "human-9", text: "Let's see..." },
    { name: "human-10", text: "Ugh..." }
];

async function generateVoice(text, fileName, voiceId) {
    const outputDir = path.join(__dirname, '..', 'public', 'assets', 'sounds', 'mina-human');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, fileName);
    console.log(`🎙️ Generating voice for: "${text}"...`);

    const data = JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
        }
    });

    const options = {
        hostname: 'api.elevenlabs.io',
        path: `/v1/text-to-speech/${voiceId}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': API_KEY,
            'accept': 'audio/mpeg'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode !== 200) {
                let errorData = '';
                res.on('data', (chunk) => { errorData += chunk; });
                res.on('end', () => {
                    console.error(`❌ API Error (${res.statusCode}):`, errorData);
                    reject(new Error(`API Error: ${res.statusCode}`));
                });
                return;
            }

            const fileStream = fs.createWriteStream(outputPath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✅ Success! Voice saved to: ${outputPath}`);
                resolve(outputPath);
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request Error: ${e.message}`);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    for (const sound of HUMAN_SOUNDS) {
        try {
            await generateVoice(sound.text, `${sound.name}.mp3`, VOICE_ID);
        } catch (e) {
            console.error(`Error generating ${sound.name}:`, e.message);
        }
    }
}

main();
