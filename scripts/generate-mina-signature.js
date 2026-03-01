import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
            }
        });
    }
} catch (e) { }

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_813aecfa26381420051ec9e010841f917b6e5b8403541914';

const SIGNATURES = [
    { lang: 'ko', prompt: "A 1-second majestic signature bright UI notification sound using Korean Gayageum and Janggu, harmonious, striking chords." },
    { lang: 'en', prompt: "A 1-second majestic signature bright UI notification sound using British orchestral brass and chimes, harmonious, striking chords." },
    { lang: 'es', prompt: "A 1-second majestic signature bright UI notification sound using Spanish Flamenco guitar and castanets, harmonious, striking chords." },
    { lang: 'hi', prompt: "A 1-second majestic signature bright UI notification sound using Indian Sitar and Tabla, harmonious, striking chords." },
    { lang: 'de', prompt: "A 1-second majestic signature bright UI notification sound using German accordion and orchestral strings, harmonious, striking chords." },
    { lang: 'ja', prompt: "A 1-second majestic signature bright UI notification sound using Japanese Koto and Taiko drum, harmonious, striking chords." },
    { lang: 'ar', prompt: "A 1-second majestic signature bright UI notification sound using Arabic Oud and Darbuka, harmonious, striking chords." },
    { lang: 'pl', prompt: "A 1-second majestic signature bright UI notification sound using Polish folk fiddle and accordion, harmonious, striking chords." }
];

async function generateSfx(prompt, langId) {
    const outputDir = path.join(__dirname, '..', 'public', 'assets', 'sounds', 'signature');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `sig-${langId}.mp3`);
    console.log(`🔨 Generating signature sound for: ${langId}...`);

    const data = JSON.stringify({
        text: prompt,
        duration_seconds: 1.5,
        prompt_influence: 0.8
    });

    const options = {
        hostname: 'api.elevenlabs.io',
        path: '/v1/sound-generation',
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
                console.log(`✅ Saved: ${outputPath}`);
                resolve(outputPath);
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    for (const sig of SIGNATURES) {
        try {
            await generateSfx(sig.prompt, sig.lang);
        } catch (e) {
            console.error(`Error for ${sig.lang}:`, e.message);
        }
    }
}

main();
