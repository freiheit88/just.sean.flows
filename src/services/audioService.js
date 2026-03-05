import { callGemini } from './aiService';

// [V7 UPDATE: Restored robust audio buffer processing, hoisted standard function]
export function pcmToWav(base64, sampleRate = 24000) {
    const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
    const view = new DataView(new ArrayBuffer(44 + buffer.byteLength));

    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + buffer.byteLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, buffer.byteLength, true);

    new Uint8Array(view.buffer, 44).set(new Uint8Array(buffer));

    return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }));
}

/**
 * Handles playing synthesized TTS audio through Gemini/ElevenLabs integration.
 */
export const speakText = async (text, langObj, apiKey, audioCache, setAudioCache) => {
    if (!apiKey || !text) return;

    // Check Cache Path first
    if (audioCache[text]) {
        new Audio(audioCache[text]).play();
        return;
    }

    try {
        const prompt = `Speak with a bright, cheerful, expressive, and highly human-like voice in ${langObj.name} language: ${text}`;

        const response = await callGemini({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: langObj.voice || "Zephyr" } } }
            }
        }, apiKey, "generateContent", "gemini-1.5-flash-latest");

        if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const audioData = response.candidates[0].content.parts[0].inlineData.data;
            const wavUrl = pcmToWav(audioData, 24000);

            // Cache for later
            setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
            new Audio(wavUrl).play();
        }
    } catch (err) {
        console.error("TTS Error:", err);
    }
};

/**
 * Handles pre-fetching TTS audio to eliminate lag when it's natively needed.
 */
export const preFetchVoice = async (text, langName, langVoice, apiKey, audioCache, setAudioCache) => {
    if (!apiKey || !text || audioCache[text]) return;

    try {
        const response = await callGemini({
            contents: [{ parts: [{ text: `Speak with a bright, cheerful, expressive, and highly human-like voice in ${langName} language: ${text}` }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: langVoice || "Zephyr" } } }
            }
        }, apiKey, "generateContent", "gemini-1.5-flash-latest");

        if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const audioData = response.candidates[0].content.parts[0].inlineData.data;
            const wavUrl = pcmToWav(audioData, 24000);

            setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
        }
    } catch (err) {
        /* Silent fail for background pre-fetch */
    }
};
