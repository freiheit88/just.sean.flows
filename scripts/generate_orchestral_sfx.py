import os
import requests
import time

# Use the same API key logic seen in the repo
API_KEY = os.environ.get("ELEVENLABS_API_KEY", "sk_813aecfa26381420051ec9e010841f917b6e5b8403541914")
URL = "https://api.elevenlabs.io/v1/sound-generation"

HEADERS = {
    "Accept": "audio/mpeg",
    "xi-api-key": API_KEY,
    "Content-Type": "application/json"
}

SFX_PROMPTS = {
    "mina-ko-language": "A bright, magical orchestral bell chime combined with a soft sweeping string chord, Tchaikovsky style, very short, 0.5 second impact and 1 second fade out.",
    "mina-ko-auth": "An elegant woodwind flourish like a flute playing a quick arpeggio, classical orchestral style, ending with a subtle magical sparkle, exactly 1.5 seconds long.",
    "mina-ko-avatar": "A beautiful harp glissando sweeping upwards, bright and magical orchestral sound, Tchaikovsky style, 0.5 second hit and 1 second natural tail.",
    "mina-ko-confirm": "A majestic and triumphant brass hit, like a French horn playing a bright chord, regal orchestral style, 0.5 second impact and 1 second fade out.",
    "mina-ko-dashboard": "A grand, triumphant full orchestral hit with strings, brass, and timpani, very bright and celebratory, Tchaikovsky style ending, 0.5 second impact with a 1 second room reverb tail."
}

base_dir = r"c:\Users\Sean Park\Desktop\sean_flows\just.sean.flows.git\just.sean.flows\public\assets\sounds\mina"
os.makedirs(base_dir, exist_ok=True)

for filename, prompt in SFX_PROMPTS.items():
    print(f"Generating SFX for {filename}...")
    data = {
        "text": prompt,
        "duration_seconds": 1.5,
        "prompt_influence": 0.3
    }

    try:
        response = requests.post(URL, json=data, headers=HEADERS)
        if response.status_code == 200:
            output_path = os.path.join(base_dir, f"{filename}.mp3")
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"Saved to {output_path}")
        else:
            print(f"Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(2) # rate limit protection

print("Done!")
