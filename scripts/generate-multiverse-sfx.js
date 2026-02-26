const fs = require('fs');
const https = require('https');
const path = require('path');

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

const SOUNDS_TO_GENERATE = [
    { country: 'ko', type: 'click', prompt: 'Traditional Korean Gayageum pluck, elegant and sharp' },
    { country: 'ko', type: 'transition', prompt: 'Korean traditional fan opening, wind-like whoosh' },
    { country: 'en', type: 'click', prompt: 'Modern cinematic digital click, clean and sleek' },
    { country: 'en', type: 'transition', prompt: 'Deep cinematic bass swell, sci-fi portal opening' },
    { country: 'ja', type: 'click', prompt: 'Japanese Zen stone click, organic and peaceful' },
    { country: 'ja', type: 'transition', prompt: 'Japanese Shamisen string pull, sharp and traditional' },
    { country: 'de', type: 'click', prompt: 'Dark gothic iron door lock, heavy and metallic' },
    { country: 'de', type: 'transition', prompt: 'Gothic dark choir echo, haunting and majestic' },
    { country: 'fr', type: 'click', prompt: 'Baroque Harpsichord key press, delicate and ornate' },
    { country: 'fr', type: 'transition', prompt: 'Elegant French palace chime, crystal clear' },
    { country: 'cn', type: 'click', prompt: 'Chinese Guzheng pluck, resonant and traditional' },
    { country: 'cn', type: 'transition', prompt: 'Chinese temple gong strike, deep and ceremonial' },
    { country: 'es', type: 'click', prompt: 'Spanish Flamenco guitar tap, rhythmic and warm' },
    { country: 'es', type: 'transition', prompt: 'Fast Flamenco strum, energetic and vibrant' },
    { country: 'it', type: 'click', prompt: 'Renaissance marble sculpture chisel, solid and artistic' },
    { country: 'it', type: 'transition', prompt: 'Italian Opera high note resonance, soaring and clear' },
];

async function generateSound({ country, type, prompt }) {
    const filename = `${country}-${type}.mp3`;
    const targetPath = path.join(__dirname, '..', 'public', 'assets', 'sounds', filename);

    console.log(`Generating ${filename}...`);

    const postData = JSON.stringify({
        text: prompt,
        duration_seconds: 2.0,
        prompt_influence: 0.3
    });

    const options = {
        hostname: 'api.elevenlabs.io',
        path: '/v1/sound-generation',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode !== 200) {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => reject(new Error(`API Error: ${res.statusCode} - ${data}`)));
                return;
            }

            const fileStream = fs.createWriteStream(targetPath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Successfully saved ${filename}`);
                resolve();
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function main() {
    const outputDir = path.join(__dirname, '..', 'public', 'assets', 'sounds');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const item of SOUNDS_TO_GENERATE) {
        try {
            await generateSound(item);
        } catch (err) {
            console.error(`Failed to generate ${item.country}-${item.type}:`, err.message);
        }
    }
    console.log("All multiverse sounds processed.");
}

main();
