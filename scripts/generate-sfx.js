import fs from 'fs';
import path from 'path';
import https from 'https';

// Load environment variables
try {
    dotenv.config({ path: '.env.local' });
} catch (e) {
    // Fallback manual parsing if dotenv is missing
    if (fs.existsSync('.env.local')) {
        const envContent = fs.readFileSync('.env.local', 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
            }
        });
    }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const SOUND_GENERATION_URL = 'https://api.elevenlabs.io/v1/sound-generation';

if (!API_KEY) {
    console.error('Error: ELEVENLABS_API_KEY not found in .env.local');
    process.exit(1);
}

async function generateSfx(prompt, fileName) {
    const outputDir = path.join(process.cwd(), 'public', 'assets', 'sounds');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, fileName);

    console.log(`🔨 Generating sound for: "${prompt}"...`);

    const data = JSON.stringify({
        text: prompt,
        duration_seconds: 1.5, // Subtle click/gear sound
        prompt_influence: 0.3
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
                console.log(`✅ Success! Saved to: ${outputPath}`);
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

async function generateVoice(text, fileName, voiceId = 'cgS7DJ9TNaoYv0959FsS') { // Default to some voice
    const outputDir = path.join(process.cwd(), 'public', 'assets', 'sounds');
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

async function listVoices() {
    const options = {
        hostname: 'api.elevenlabs.io',
        path: '/v1/voices',
        method: 'GET',
        headers: {
            'xi-api-key': API_KEY,
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const voices = JSON.parse(data).voices;
                    console.log('Available Voices:');
                    voices.slice(0, 15).forEach(v => console.log(`- ${v.name}: ${v.voice_id}`));
                    resolve(voices);
                } else {
                    console.error('❌ Failed to list voices:', data);
                    reject(new Error(res.statusCode));
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

// Check for command line arguments
const args = process.argv.slice(2);
if (args.includes('--list-voices')) {
    listVoices().catch(console.error);
} else {
    const type = args[0] === '--voice' ? 'voice' : 'sfx';
    const filterArgs = args.filter(a => a !== '--voice');
    const promptArg = filterArgs[0] || "A low, magnificent, and majestic cinematic drone sound. It begins with a short, deep impact and gracefully lingers, fading away softly. Minimalist, grand, and resonant.";
    const fileNameArg = filterArgs[1] || 'portal-transition.mp3';
    const voiceIdArg = filterArgs[2]; // Optional voice ID

    if (type === 'voice') {
        generateVoice(promptArg, fileNameArg, voiceIdArg).catch(err => {
            console.error('💥 Fatal Error:', err);
            process.exit(1);
        });
    } else {
        generateSfx(promptArg, fileNameArg).catch(err => {
            console.error('💥 Fatal Error:', err);
            process.exit(1);
        });
    }
}
