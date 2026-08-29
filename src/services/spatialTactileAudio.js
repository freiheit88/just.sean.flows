// Continuous Analog Tactile Soundscape (Web Audio API Synthesizer)
// Provides zero-latency LP vinyl crackle and 50Hz CRT hum modulated by scroll velocity and TV proximity.

class SpatialTactileAudioEngine {
    constructor() {
        this.ctx = null;
        this.isInitialized = false;
        this.masterGain = null;
        this.crHumGain = null;
        this.crHumOsc = null;
        this.crHumOsc2 = null;
        this.lastCrackTime = 0;
        this.isMuted = false;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            this.ctx = new AudioContext();

            // Master Gain (-24dB baseline limit for ultra-subtle tactile feel)
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            // 1. 50Hz European CRT Sub-Hum Oscillator
            this.crHumOsc = this.ctx.createOscillator();
            this.crHumOsc.type = 'sine';
            this.crHumOsc.frequency.setValueAtTime(50, this.ctx.currentTime); // European 50Hz mains hum

            // 2. 100Hz Harmonic Tone
            this.crHumOsc2 = this.ctx.createOscillator();
            this.crHumOsc2.type = 'triangle';
            this.crHumOsc2.frequency.setValueAtTime(100, this.ctx.currentTime);

            // CRT Low-Pass Filter (removes harsh highs, keeps warm tube vibration)
            const crtFilter = this.ctx.createBiquadFilter();
            crtFilter.type = 'lowpass';
            crtFilter.frequency.setValueAtTime(160, this.ctx.currentTime);

            this.crHumGain = this.ctx.createGain();
            this.crHumGain.gain.setValueAtTime(0.001, this.ctx.currentTime); // Starts almost inaudible

            this.crHumOsc.connect(crtFilter);
            this.crHumOsc2.connect(crtFilter);
            crtFilter.connect(this.crHumGain);
            this.crHumGain.connect(this.masterGain);

            this.crHumOsc.start();
            this.crHumOsc2.start();

            this.isInitialized = true;
        } catch (e) {
            console.warn('[SpatialTactileAudio] Web Audio initialization deferred:', e);
        }
    }

    // Trigger Micro LP Vinyl Needle Crackle
    triggerVinylCrackle(intensity = 1.0) {
        if (!this.isInitialized || this.isMuted) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }

        const now = this.ctx.currentTime;
        if (now - this.lastCrackTime < 0.04) return; // Prevent dense harsh clustering
        this.lastCrackTime = now;

        // Generate tiny micro-noise burst (0.008s)
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.012);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Analog dust pop distribution
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        // Bandpass to capture authentic 1.2kHz ~ 4.5kHz vinyl needle resonance
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800 + Math.random() * 800, now);
        filter.Q.setValueAtTime(3.5, now);

        const crackGain = this.ctx.createGain();
        const finalVol = Math.min(0.08, 0.02 + intensity * 0.04);
        crackGain.gain.setValueAtTime(finalVol, now);
        crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        whiteNoise.connect(filter);
        filter.connect(crackGain);
        crackGain.connect(this.masterGain);

        whiteNoise.start(now);
        whiteNoise.stop(now + 0.015);
    }

    // Update real-time continuous tactile physics (called on scroll/drag)
    updatePhysics({ velocity = 0, depthProgress = 0, isMuted = false }) {
        this.isMuted = isMuted;
        if (!this.isInitialized) {
            this.init();
        }
        if (!this.isInitialized || this.isMuted) return;

        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }

        const absVel = Math.abs(velocity);

        // 1. Vinyl Crackle on scroll movement
        if (absVel > 0.002) {
            this.triggerVinylCrackle(Math.min(2.0, absVel * 20));
        }

        // 2. CRT Hum volume increases smoothly as user approaches the TV (depthProgress 0 -> 1)
        if (this.crHumGain && this.ctx) {
            const targetHumGain = Math.min(0.07, 0.005 + (depthProgress * 0.065));
            this.crHumGain.gain.setTargetAtTime(targetHumGain, this.ctx.currentTime, 0.1);
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.06, this.ctx.currentTime, 0.05);
        }
    }
}

export const spatialTactileAudio = new SpatialTactileAudioEngine();
