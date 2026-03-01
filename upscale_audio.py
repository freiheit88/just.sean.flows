import os
from pydub import AudioSegment
from pydub.effects import compress_dynamic_range, normalize

def process_audio(input_file, output_file, volume_increase=6.0):
    try:
        print(f"Loading {input_file}...")
        audio = AudioSegment.from_mp3(input_file)
        
        print(f"Original channels: {audio.channels}, Frame rate: {audio.frame_rate}, Sample width: {audio.sample_width}")
        
        # Increase volume
        audio = audio + volume_increase # in dB
        
        # Add basic mastering (compression + normalization to prevent clipping)
        audio = compress_dynamic_range(audio)
        audio = normalize(audio)
        
        # Ensure 48kHz stereo (like "8K" rich sound)
        audio = audio.set_frame_rate(48000).set_channels(2)
        
        print(f"Exporting to {output_file}...")
        audio.export(output_file, format="mp3", bitrate="320k") # High quality bitrate
        
        print("Done!")
    except Exception as e:
        print(f"Error processing {input_file}: {e}")

if __name__ == "__main__":
    sounds_dir = "public/assets/sounds"
    songs = ["ar_song1.mp3", "ar_song2.mp3", "en_song1.mp3", "en_song2.mp3", "jp_song1.mp3", "jp_song2.mp3", "ko_song1.mp3", "ko_song2.mp3"]
    
    for song in songs:
        input_path = os.path.join(sounds_dir, song)
        if os.path.exists(input_path):
            output_path = os.path.join(sounds_dir, f"{song.split('.')[0]}_upscaled.mp3")
            print(f"Processing {song}...")
            process_audio(input_path, output_path, volume_increase=10.0)
        else:
            print(f"File not found: {input_path}")
