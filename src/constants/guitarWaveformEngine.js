// INFINITE CONTINUOUS HARMONIC CHROMA ENGINE & AUDIO WAVEFORM PULSE
// Seamlessly loops across any duration (MR 126.79s, Capriccio 178.44s, Master 124.80s, or Infinite Loop)

export const CHORD_LOOP_SEQUENCE = ['Dm', 'Dm', 'Bb', 'Am', 'Gm', 'A7', 'Dm', 'Dm'];
export const MEASURE_DURATION = 2.172; // Calibrated 110.32 BPM 1-bar cycle (sec)
export const LOOP_PERIOD = 8 * MEASURE_DURATION; // 17.376s full harmonic cycle
export const STRUM_INTERVAL = 0.2715; // 8-strum 8th-note pulse (sec)

// PHOTO-EXTRACTED FRANKFURT NOIR & 18K CHAMPAGNE PALETTE
export const PHOTO_ATMOSPHERE_PALETTE = {
    'Dm': {
        name: 'Dm9 (Tonic)',
        accent: '#D4AF37',       // 18K Champagne Gold
        secondary: '#C8A96E',
        glow: 'rgba(212, 175, 55, 0.40)',
        subtleGlow: 'rgba(212, 175, 55, 0.24)',
        borderColor: 'rgba(212, 175, 55, 0.65)',
        ambientGradient: 'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(212, 175, 55, 0.22) 0%, rgba(45, 32, 20, 0.38) 45%, rgba(6, 6, 8, 0.98) 75%)'
    },
    'Bb': {
        name: 'Bbmaj7 (Subdominant)',
        accent: '#E5A93C',       // Warm Amber Torch
        secondary: '#FF9F6A',
        glow: 'rgba(229, 169, 60, 0.42)',
        subtleGlow: 'rgba(229, 169, 60, 0.26)',
        borderColor: 'rgba(229, 169, 60, 0.70)',
        ambientGradient: 'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(229, 169, 60, 0.24) 0%, rgba(55, 35, 18, 0.40) 45%, rgba(6, 6, 8, 0.98) 75%)'
    },
    'Am': {
        name: 'Am7 (Cadence)',
        accent: '#7EB8FF',       // Moonlit Capriccio Blue
        secondary: '#4A7FC2',
        glow: 'rgba(126, 184, 255, 0.40)',
        subtleGlow: 'rgba(126, 184, 255, 0.24)',
        borderColor: 'rgba(126, 184, 255, 0.65)',
        ambientGradient: 'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(126, 184, 255, 0.20) 0%, rgba(22, 34, 52, 0.40) 45%, rgba(6, 6, 8, 0.98) 75%)'
    },
    'Gm': {
        name: 'Gm7 (Subdominant)',
        accent: '#94FFD8',       // Emerald Solace Green
        secondary: '#5B8A72',
        glow: 'rgba(148, 255, 216, 0.40)',
        subtleGlow: 'rgba(148, 255, 216, 0.24)',
        borderColor: 'rgba(148, 255, 216, 0.65)',
        ambientGradient: 'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(148, 255, 216, 0.20) 0%, rgba(18, 42, 34, 0.40) 45%, rgba(6, 6, 8, 0.98) 75%)'
    },
    'A7': {
        name: 'A7#9 (Dominant)',
        accent: '#FF6B6B',       // Bordeaux Crimson Velvet
        secondary: '#C4735E',
        glow: 'rgba(255, 107, 107, 0.42)',
        subtleGlow: 'rgba(255, 107, 107, 0.26)',
        borderColor: 'rgba(255, 107, 107, 0.70)',
        ambientGradient: 'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(255, 107, 107, 0.22) 0%, rgba(52, 20, 24, 0.42) 45%, rgba(6, 6, 8, 0.98) 75%)'
    }
};

export function getWaveformHarmonicState(currentTime) {
    const validTime = Math.max(0, currentTime);

    // 1. Exact Continuous Mathematical Modulo Harmonic Calculation (Never stops!)
    const loopOffset = validTime % LOOP_PERIOD;
    const measureIndexInLoop = Math.floor(loopOffset / MEASURE_DURATION);
    const activeChord = CHORD_LOOP_SEQUENCE[measureIndexInLoop % CHORD_LOOP_SEQUENCE.length] || 'Dm';
    const totalMeasureNumber = Math.floor(validTime / MEASURE_DURATION) + 1;

    // 2. Continuous 8-Strum Heartbeat Pulse (95ms transient attack window)
    const strumPhase = validTime % STRUM_INTERVAL;
    const isStrumming = strumPhase < 0.095;

    const palette = PHOTO_ATMOSPHERE_PALETTE[activeChord] || PHOTO_ATMOSPHERE_PALETTE['Dm'];

    return {
        activeChord,
        currentMeasure: totalMeasureNumber,
        isStrumming,
        palette
    };
}
