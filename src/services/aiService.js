export const callGemini = async (payload, apiKey, endpoint = "generateContent", model = "gemini-1.5-flash-latest") => {
    if (!apiKey) {
        console.error("Gemini API Key is missing. Cannot call the AI service.");
        throw new Error("Missing API Key");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`;

    // Simple retry mechanism for robustness
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API Error", errorData);
                throw new Error(`API request failed with status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            if (i === 4) throw err;
            await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        }
    }
};
