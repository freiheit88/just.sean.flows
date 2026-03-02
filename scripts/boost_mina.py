import os
from pydub import AudioSegment
from pydub.effects import compress_dynamic_range, normalize

def process_audio(input_file, output_file, volume_increase=10.0):
    try:
        audio = AudioSegment.from_mp3(input_file)
        
        # Increase volume
        audio = audio + volume_increase # in dB
        
        # Add basic mastering (compression + normalization to prevent clipping)
        audio = compress_dynamic_range(audio)
        audio = normalize(audio)
        
        audio.export(output_file, format="mp3", bitrate="128k")
    except Exception as e:
        print(f"Error processing {input_file}: {e}")

if __name__ == "__main__":
    print("Starting Mina TTS Volume Boost...")
    sounds_dir = os.path.join(os.getcwd(), "public", "assets", "sounds", "mina")
    
    if not os.path.exists(sounds_dir):
        print(f"Directory not found: {sounds_dir}")
        exit(1)
        
    for f in os.listdir(sounds_dir):
        if f.endswith(".mp3"):
            path = os.path.join(sounds_dir, f)
            print(f"Boosting: {f}")
            process_audio(path, path, volume_increase=10.0)
            
    print("Done boosting all Mina TTS files!")
