import fs from 'fs';
import path from 'path';

// WARNING: DO NOT COMMIT REAL API KEYS
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

// Original text: "Thank you for coming all this way! The machine is still being built, but we will be back soon. Enjoy the music and come listen again later!"
// Using Laura's Voice ID for Mina: FGY2WhcCjOexzdzJA50x (adjust if needed based on other scripts)
const VOICE_ID = 'FGY2WhcCjOexzdzJA50x';

const translations = {
    'ko': "여기까지 와주셔서 감사합니다! 기계는 아직 조립 중이지만 금방 돌아올 예정입니다. 음악을 감상하시고 나중에 다시 들러주세요!",
    'en': "Thank you for coming all this way! The machine is still being built, but we will be back soon. Enjoy the music and come listen again later!",
    'es': "¡Gracias por llegar hasta aquí! La máquina aún está en construcción, pero volveremos pronto. ¡Disfruta la música y vuelve a escucharla más tarde!",
    'hi': "यहाँ तक आने के लिए धन्यवाद! मशीन अभी भी बनाई जा रही है, लेकिन हम जल्द ही वापस आएंगे। संगीत का आनंद लें और बाद में फिर से सुनें!",
    'de': "Danke, dass Sie den ganzen Weg hierher gekommen sind! Die Maschine wird noch gebaut, aber wir sind bald zurück. Genießen Sie die Musik und kommen Sie später wieder!",
    'ja': "ここまで来てくれてありがとう！機械はまだ組み立て中ですが、すぐに戻ってきます。音楽を楽しんで、後でまた聞きに来てください！",
    'ar': "شكراً لمجيئك كل هذا الطريق! لا تزال الآلة قيد الإنشاء، لكننا سنعود قريباً. استمتع بالموسيقى وتعال للاستماع مرة أخرى لاحقاً!",
    'pl': "Dziękujemy za przybycie aż tutaj! Maszyna jest wciąż w budowie, ale wkrótce wrócimy. Ciesz się muzyką i przyjdź posłuchać ponownie później!"
};

async function generateTTS(langId, text) {
    if (!ELEVEN_LABS_API_KEY) {
        console.log(`[DRY RUN] Would generate audio for ${langId}: "${text}"`);
        return;
    }

    console.log(`Generating audio for ${langId}...`);
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVEN_LABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8
                }
            })
        });

        if (!response.ok) {
            console.error(`Failed to generate TTS for ${langId}:`, await response.text());
            return;
        }

        const buffer = await response.arrayBuffer();
        // Determine correct output path base on typical project structure (adjust if necessary)
        const outputPath = path.join(process.cwd(), '..', 'public', 'assets', 'sounds', 'mina', `mina-${langId}-comingsoon.mp3`);
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`Saved audio for ${langId} to ${outputPath}`);
    } catch (error) {
        console.error(`Error generating TTS for ${langId}:`, error);
    }
}

async function main() {
    console.log('Starting batch TTS generation for Coming Soon screen...');

    // Create directory if it doesn't exist
    const outputDir = path.join(process.cwd(), '..', 'public', 'assets', 'sounds', 'mina');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [langId, text] of Object.entries(translations)) {
        await generateTTS(langId, text);
        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log('Batch generation complete.');
}

main();
