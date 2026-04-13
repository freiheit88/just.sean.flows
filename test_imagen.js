const apiKey = "AIzaSyArYHntALJBeMH75h1cyJCi-27QU9XrzFs";
const imagenPrompt = "A hot air balloon";

fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        instances: [{ prompt: imagenPrompt }],
        parameters: { sampleCount: 1 }
    }),
}).then(res => res.text()).then(text => console.log("Response:", text)).catch(err => console.error(err));
