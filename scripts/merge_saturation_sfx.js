import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicAudioDir = path.resolve(__dirname, '../public/assets/sounds');
const outPath = path.resolve(__dirname, '../public/assets/sounds/merged_saturation_effect.mp3');

const lowPath = path.join(publicAudioDir, 'piano-mystic-low.mp3');
const midPath = path.join(publicAudioDir, 'piano-mystic-mid.mp3');
const highPath = path.join(publicAudioDir, 'piano-mystic-high.mp3');

console.log('Merging sound effects...');
console.log('Output will be saved to:', outPath);

ffmpeg()
    .input(lowPath)
    .input(midPath)
    .input(highPath)
    .complexFilter([
        // [0:a] is low, volume 1.0
        '[0:a]volume=1.0[a0]',
        // [1:a] is mid, delayed by 1000ms, volume 0.6
        '[1:a]adelay=1000|1000,volume=0.6[a1]',
        // [2:a] is high, delayed by 2000ms, volume 0.8
        '[2:a]adelay=2000|2000,volume=0.8[a2]',
        // Mix them together
        '[a0][a1][a2]amix=inputs=3:duration=longest:dropout_transition=2[out]'
    ])
    .map('[out]')
    .outputOptions([
        '-ac 2', // stereo
        '-b:a 192k' // bitrate
    ])
    .save(outPath)
    .on('end', () => {
        console.log('Successfully merged the 3 saturation sound effects!');
        process.exit(0);
    })
    .on('error', (err) => {
        console.error('Error merging files:', err);
        process.exit(1);
    });
