import wave
import struct
import os
import glob

# Target directory
directory = r"C:\Users\Sean Park\Desktop\sean_flows\just.sean.flows.git\just.sean.flows\public\assets\manual_upload\language_thema"
os.chdir(directory)

# Target volume multiplier (0.6 = 60%)
VOLUME_MULTIPLIER = 0.6

wav_files = glob.glob("*.wav")

print(f"Found {len(wav_files)} WAV files. Processing...")

for file in wav_files:
    # Read original file
    with wave.open(file, 'rb') as wav_in:
        params = wav_in.getparams()
        nchannels, sampwidth, framerate, nframes, comptype, compname = params
        
        frames = wav_in.readframes(nframes)
    
    # Unpack binary data
    # 'h' is signed short (16-bit)
    if sampwidth == 2:
        fmt = f"<{nframes * nchannels}h"
        samples = struct.unpack(fmt, frames)
        
        # Apply volume multiplier
        adjusted_samples = [int(sample * VOLUME_MULTIPLIER) for sample in samples]
        
        # Clamp to 16-bit range
        adjusted_samples = [max(min(sample, 32767), -32768) for sample in adjusted_samples]
        
        # Pack binary data back
        adjusted_frames = struct.pack(fmt, *adjusted_samples)
        
        # Write to temporary file, then replace
        temp_file = "temp_" + file
        with wave.open(temp_file, 'wb') as wav_out:
            wav_out.setparams(params)
            wav_out.writeframes(adjusted_frames)
            
        # Replace original file (make backup just in case)
        backup_file = "backup_" + file
        if not os.path.exists(backup_file):
            os.rename(file, backup_file)
        else:
            os.remove(file)
            
        os.rename(temp_file, file)
        print(f"Reduced volume of {file} to 60%")
    else:
        print(f"Skipping {file}: unsupported sample width {sampwidth} bytes (only 16-bit supported)")

print("Done processing volume reduction.")
