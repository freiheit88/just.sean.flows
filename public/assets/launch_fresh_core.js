    (function () {
      'use strict';

      // 1. STATE & AUDIO SYNTHESIZER (MUTED / DISABLED)
      let audioCtx = null;
      let masterGain = null;
      let isMuted = true;
      let activeOscs = [];
      let evolutionStartTime = null;
      let evolutionActive = false;
      let evolutionStage = 0;

      function initWebAudio() {
        return;
      }

      function playVerdiChime(intensity, level) {
        if (!audioCtx || isMuted) return;
        try {
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
          const now = audioCtx.currentTime;
          let freqs;
          if (level === 0) {
            // Lv.0 Pure Seed: Singing crystal rim harmonics
            freqs = [432.0, 864.0, 1728.0];
          } else if (level === 1) {
            // Lv.1 Notary Wax Seal: Rich fifths & bronze warmth
            freqs = [216.0, 432.0, 648.0, 1296.0];
          } else {
            // Lv.2 Antique Skeleton Key: Deep resonance & cathedral tube glow
            freqs = [216.0, 432.0, 648.0, 864.0, 1296.0, 1728.0];
          }

          freqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx === 0 ? 'sine' : (idx % 2 === 0 ? 'triangle' : 'sine');
            osc.frequency.setValueAtTime(freq, now);

            // Subtle vibrato shimmer (Verdi 4.32Hz rate)
            const vib = audioCtx.createOscillator();
            const vibGain = audioCtx.createGain();
            vib.frequency.setValueAtTime(4.32, now);
            vibGain.gain.setValueAtTime(freq * 0.0035, now);
            vib.connect(vibGain);
            vibGain.connect(osc.frequency);
            vib.start(now);
            vib.stop(now + 2.2);

            const amp = (0.11 / (1 + idx * 0.45)) * Math.min(intensity || 1.0, 1.4);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(amp, now + 0.02 + idx * 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.25);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 2.4 + idx * 0.25);
            activeOscs.push({ osc, gain });
          });
        } catch (err) {
          console.warn('Verdi chime error', err);
        }
      }

      // ======================================================================
      // 5 PLAYGROUND MICRO-INTERACTIONS AUDIO SYNTHESIZERS (432Hz PURE HARMONICS)
      // 1. 와인잔 림 문지르기 (Glass Armonica Singing Bowl Harmonics: D4 288Hz, A4 432Hz, E5 648Hz, A5 864Hz)
      // 2. 보르도 와인 슬로싱 (Effervescent Champagne Bubble Fizz & Pop Synthesis)
      // 3. 황금 음표 멜로디 연주 (Draw-to-Sing 432Hz Pentatonic Bell/Harp Glissando)
      // 4. 랜턴 각도 이스터에그 (Hidden Atelier Coordinates Celestial Gold Chime)
      // 5. 역방향 스크롤 되감기 (Time Reverse Acoustic Downward Rewind Whisper)
      // ======================================================================

      // 1.1 WINE GLASS RIM SWIRL: GLASS ARMONICA SINGING BOWL DRONE (432Hz HARMONICS)
      let glassArmonicaNodes = null;
      let rimSwirlEnergy = 0.0;
      let lastSwirlAngle = null;
      let lastSwirlTime = 0;

      function updateGlassArmonica(energy) {
        if (isMuted || !audioCtx) return;
        if (energy <= 0.01) {
          if (glassArmonicaNodes && glassArmonicaNodes.gain) {
            try {
              const now = audioCtx.currentTime;
              glassArmonicaNodes.gain.gain.cancelScheduledValues(now);
              glassArmonicaNodes.gain.gain.setValueAtTime(glassArmonicaNodes.gain.gain.value, now);
              glassArmonicaNodes.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            } catch (_) {}
          }
          return;
        }

        try {
          if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
          const now = audioCtx.currentTime;
          if (!glassArmonicaNodes) {
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.0001, now);
            gain.connect(masterGain);

            // Ethereal 432Hz glass armonica harmonic cluster: D4 (288Hz), A4 (432Hz), E5 (648Hz), A5 (864Hz)
            const droneFreqs = [288.0, 432.0, 648.0, 864.0];
            const oscs = [];
            droneFreqs.forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);

              // 4.32Hz singing bowl organic acoustic vibrato
              const lfo = audioCtx.createOscillator();
              const lfoGain = audioCtx.createGain();
              lfo.frequency.setValueAtTime(4.32, now);
              lfoGain.gain.setValueAtTime(freq * 0.0035, now);
              lfo.connect(lfoGain);
              lfoGain.connect(osc.frequency);
              lfo.start(now);

              const partGain = audioCtx.createGain();
              const relVol = idx === 1 ? 0.30 : (idx === 0 ? 0.22 : (idx === 2 ? 0.18 : 0.12));
              partGain.gain.setValueAtTime(relVol, now);
              osc.connect(partGain);
              partGain.connect(gain);
              osc.start(now);
              oscs.push({ osc, lfo, lfoGain, partGain });
            });

            glassArmonicaNodes = { gain, oscs };
          }

          const targetGain = Math.min(0.26, energy * 0.26);
          glassArmonicaNodes.gain.gain.cancelScheduledValues(now);
          glassArmonicaNodes.gain.gain.setValueAtTime(Math.max(0.0001, glassArmonicaNodes.gain.gain.value), now);
          glassArmonicaNodes.gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), now + 0.06);
        } catch (_) {}
      }

      // 1.2 BORDEAUX WINE SLOSHING: EFFERVESCENT CHAMPAGNE FIZZ SYNTHESIS
      let lastFizzTime = 0;
      function playChampagneFizz(intensity) {
        if (isMuted || !audioCtx) return;
        const nowMs = performance.now();
        if (nowMs - lastFizzTime < 50) return;
        lastFizzTime = nowMs;

        try {
          if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
          const now = audioCtx.currentTime;

          // Micro bubble popping bursts (3500Hz - 8200Hz)
          const popCount = 3 + Math.floor(Math.random() * 4);
          for (let i = 0; i < popCount; i++) {
            const tOffset = i * 0.007 + Math.random() * 0.012;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const freq = 3600 + Math.random() * 4500;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + tOffset);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + tOffset + 0.024);

            const popVol = Math.min(0.038, 0.016 * (intensity || 1.0));
            gain.gain.setValueAtTime(0.0001, now + tOffset);
            gain.gain.exponentialRampToValueAtTime(popVol, now + tOffset + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + tOffset + 0.028);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + tOffset);
            osc.stop(now + tOffset + 0.032);
          }
        } catch (_) {}
      }

      // 1.3 DRAW-TO-SING 432Hz PENTATONIC BELL/HARP MELODY CANVAS
      // Pentatonic Scale: C4 (259.2Hz), D4 (288.0Hz), E4 (324.0Hz), G4 (384.0Hz), A4 (432.0Hz), C5 (518.4Hz), D5 (576.0Hz), E5 (648.0Hz)
      const PENTATONIC_432 = [259.2, 288.0, 324.0, 384.0, 432.0, 518.4, 576.0, 648.0];
      const crystalHarmonics = [864.0, 1296.0, 1728.0, 2160.0, 2592.0];
      let chimeScaleIdx = 0;
      let lastPlayedPentatonicIdx = -1;

      function playCadenzaCursorChime(intensity, clientY) {
        if (isMuted) return;
        if (!audioCtx) initWebAudio();
        if (!audioCtx) return;
        try {
          if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
          if (audioCtx.state !== 'running') return;

          const now = audioCtx.currentTime;
          let freq;
          if (clientY !== undefined && clientY !== null) {
            // Y position maps cleanly: Top of screen = high pitch, Bottom of screen = low pitch
            const normY = Math.max(0, Math.min(0.999, 1.0 - (clientY / window.innerHeight)));
            const idx = Math.floor(normY * PENTATONIC_432.length);
            freq = PENTATONIC_432[idx];
            lastPlayedPentatonicIdx = idx;
          } else {
            freq = crystalHarmonics[chimeScaleIdx % crystalHarmonics.length];
            chimeScaleIdx++;
          }

          // Delicate bell/harp timbre: fundamental + 2nd overtone (2.0x) + bell harmonic (2.76x)
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          const upperOsc = audioCtx.createOscillator();
          const upperGain = audioCtx.createGain();
          upperOsc.type = 'sine';
          upperOsc.frequency.setValueAtTime(freq * 2.76, now);

          const baseAmp = Math.min(0.042, 0.020 * (intensity || 1.0));

          // Soft bell attack & crystalline reverberation
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(baseAmp, now + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

          upperGain.gain.setValueAtTime(0.0001, now);
          upperGain.gain.exponentialRampToValueAtTime(baseAmp * 0.35, now + 0.012);
          upperGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

          osc.connect(gain);
          upperOsc.connect(upperGain);
          gain.connect(masterGain);
          upperGain.connect(masterGain);

          osc.start(now);
          upperOsc.start(now);
          osc.stop(now + 0.70);
          upperOsc.stop(now + 0.40);

          const oscEntry = { osc, gain };
          const upperEntry = { osc: upperOsc, gain: upperGain };
          activeOscs.push(oscEntry, upperEntry);

          const cleanupNode = (entry) => {
            try {
              entry.osc.disconnect();
              entry.gain.disconnect();
            } catch (e) {}
            const idx = activeOscs.indexOf(entry);
            if (idx !== -1) activeOscs.splice(idx, 1);
          };

          osc.onended = () => cleanupNode(oscEntry);
          upperOsc.onended = () => cleanupNode(upperEntry);
        } catch (err) {
          // Silent fallback
        }
      }

      // 1.4 EASTER EGG: HIDDEN ATELIER COORDINATES GOLDEN CHIME
      let secretEngravingRevealed = false;
      let lastSecretChimeTime = 0;
      function playSecretEngravingChime() {
        if (isMuted || !audioCtx) return;
        const nowMs = performance.now();
        if (nowMs - lastSecretChimeTime < 1800) return;
        lastSecretChimeTime = nowMs;
        try {
          if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
          const now = audioCtx.currentTime;
          // Celestial gold chime: 864Hz & 1296Hz with soft slow shimmer
          [864.0, 1296.0, 1728.0].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.045);
            const vol = 0.028 / (1 + i * 0.45);
            gain.gain.setValueAtTime(0.0001, now + i * 0.045);
            gain.gain.exponentialRampToValueAtTime(vol, now + i * 0.045 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.045 + 1.2);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + i * 0.045);
            osc.stop(now + i * 0.045 + 1.25);
          });
        } catch (_) {}
      }

      // 1.5 TIME REVERSE: DOWNWARD REWIND ACOUSTIC SOUND
      let lastTimeReverseSoundTime = 0;
      function playTimeReverseSound(intensity) {
        if (isMuted || !audioCtx) return;
        const nowMs = performance.now();
        if (nowMs - lastTimeReverseSoundTime < 160) return;
        lastTimeReverseSoundTime = nowMs;
        try {
          if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
          const now = audioCtx.currentTime;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          const startF = 864.0 * (0.85 + Math.random() * 0.3);
          osc.frequency.setValueAtTime(startF, now);
          osc.frequency.exponentialRampToValueAtTime(startF * 0.48, now + 0.28);

          const vol = Math.min(0.034, 0.015 * (intensity || 1.0));
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(vol, now + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.30);
        } catch (_) {}
      }

      function playVipRoyalHarmonics() {
        if (!audioCtx || isMuted) return;
        try {
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const now = audioCtx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(0.0001, now);
          masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.1);

          // Grand VIP Royal Harmonic Sequence (Full 432Hz Sacred Tree)
          // 108Hz (Deep Sub Bass), 216Hz, 324Hz, 432Hz, 648Hz, 864Hz, 1296Hz, 1728Hz
          const vipFreqs = [108.0, 216.0, 324.0, 432.0, 648.0, 864.0, 1296.0, 1728.0];
          vipFreqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx < 2 ? 'sine' : (idx % 2 === 0 ? 'triangle' : 'sine');
            osc.frequency.setValueAtTime(freq, now);

            const peak = 0.28 / (1 + idx * 0.38);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(peak, now + 0.05 + idx * 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 5.8);
            activeOscs.push({ osc, gain });
          });
        } catch (err) {
          console.warn('VIP royal harmonics error', err);
        }
      }

      function playVerdiUnsealChord() {
        if (!audioCtx || isMuted) return;
        try {
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const now = audioCtx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(0.0001, now);
          masterGain.gain.exponentialRampToValueAtTime(0.32, now + 0.05);

          // Pure Verdi 432Hz Unseal Acoustic Chord: Root (216Hz), Fundamental (432Hz), Fifth (648Hz), Octave (864Hz), Crystalline (1728Hz)
          const unsealFreqs = [216.0, 432.0, 648.0, 864.0, 1728.0];
          unsealFreqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx === 0 ? 'sine' : (idx % 2 === 0 ? 'triangle' : 'sine');
            osc.frequency.setValueAtTime(freq, now);

            // Shimmer vibrato (Verdi 4.32Hz)
            if (idx === 1 || idx === 3) {
              const vib = audioCtx.createOscillator();
              const vibGain = audioCtx.createGain();
              vib.frequency.setValueAtTime(4.32, now);
              vibGain.gain.setValueAtTime(freq * 0.004, now);
              vib.connect(vibGain);
              vibGain.connect(osc.frequency);
              vib.start(now);
              vib.stop(now + 2.8);
              activeOscs.push({ osc: vib, gain: vibGain });
            }

            const peak = (0.24 / (1 + idx * 0.35));
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(peak, now + 0.02 + idx * 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6 + idx * 0.3);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 3.0 + idx * 0.3);
            activeOscs.push({ osc, gain });
          });
        } catch (err) {
          console.warn('Unseal chord error', err);
        }
      }

      function playPicardyThirdFanfareChord() {
        if (!audioCtx || isMuted) return;
        try {
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const now = audioCtx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(0.0001, now);
          masterGain.gain.exponentialRampToValueAtTime(0.42, now + 0.04);

          // 432Hz Picardy Third Triumphant Fanfare Chord:
          // A2 (108Hz), A3 (216Hz), E4 (324Hz), A4 (432Hz), Picardy Major Third C#5 (540Hz), E5 (648Hz), A5 (864Hz), C#6 (1080Hz)
          const fanfareFreqs = [108.0, 216.0, 324.0, 432.0, 540.0, 648.0, 864.0, 1080.0];
          fanfareFreqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx < 2 ? 'sine' : (idx % 2 === 0 ? 'triangle' : 'sine');
            osc.frequency.setValueAtTime(freq, now);

            // Cathedral warmth shimmer
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.setValueAtTime(4.32, now);
            lfoGain.gain.setValueAtTime(freq * 0.003, now);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start(now);
            lfo.stop(now + 4.2);
            activeOscs.push({ osc: lfo, gain: lfoGain });

            const peak = 0.28 / (1 + idx * 0.32);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(peak, now + 0.03 + idx * 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 4.2);
            activeOscs.push({ osc, gain });
          });

          // Level Up '짜란!' Ascending Item Acquisition Sparkle Arpeggio
          const arpeggio = [432.0, 540.0, 648.0, 864.0, 1080.0, 1728.0];
          arpeggio.forEach((note, step) => {
            const noteTime = now + step * 0.065;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note, noteTime);

            gain.gain.setValueAtTime(0.0001, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.18, noteTime + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.9);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(noteTime);
            osc.stop(noteTime + 0.95);
            activeOscs.push({ osc, gain });
          });
        } catch (err) {
          console.warn('Picardy fanfare chord error', err);
        }
      }

      function playVerdiStage1Chord() {
        if (!audioCtx || isMuted) return;
        const now = audioCtx.currentTime;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.08);

        // Pure Verdi 432Hz Harmonic Acoustic Matrix
        // Sub-foundation (216Hz), Fundamental (432Hz), Fifth (648Hz), Octave (864Hz), Twelfth (1296Hz), Bell Chime (1728Hz)
        const harmonicFreqs = [216.0, 432.0, 648.0, 864.0, 1296.0, 1728.0];
        harmonicFreqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const oscGain = audioCtx.createGain();
          osc.type = idx === 1 ? 'sine' : (idx === 0 ? 'sine' : (idx % 2 === 0 ? 'triangle' : 'sine'));
          osc.frequency.setValueAtTime(freq, now);

          // Subtle harmonic shimmer LFO for breathing acoustic resonance
          if (idx === 1 || idx === 3) {
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.setValueAtTime(4.32, now); // 4.32Hz Verdi micro-ripple
            lfoGain.gain.setValueAtTime(1.8, now);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start(now);
            activeOscs.push({ osc: lfo, gain: lfoGain });
          }

          const peakGain = 0.22 / (1 + idx * 0.45);
          oscGain.gain.setValueAtTime(0.0001, now);
          oscGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.04 + idx * 0.02);
          // Long singing-bowl acoustic ring-down
          oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 5.0);
          activeOscs.push({ osc, gain: oscGain });
        });

        // Authentic 432Hz Studio Entry Chord
        try {
          const stage1Audio = new Audio('/assets/alibi_chord_stage1.wav');
          stage1Audio.volume = isMuted ? 0 : 0.45;
          stage1Audio.play().catch(() => {});
          window._stage1Audio = stage1Audio;
        } catch (_) {}

        // Tone.js PolySynth Integration with clean async startup on user gesture
        const runTonePolySynth = () => {
          if (typeof Tone === 'undefined' || !Tone.start) return;
          Tone.start().then(() => {
            try {
              const synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.04, decay: 2.2, sustain: 0.15, release: 4.2 }
              }).toDestination();
              synth.volume.value = isMuted ? -Infinity : -10;
              synth.triggerAttackRelease(['A4', 'E5', 'A5'], '2n', undefined, 0.7);
            } catch (_) {}
          }).catch(() => {});
        };

        if (typeof Tone !== 'undefined') {
          runTonePolySynth();
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js';
          script.onload = runTonePolySynth;
          script.onerror = () => {};
          document.head.appendChild(script);
        }
      }

      function swellStage2Chord() {
        if (!audioCtx || isMuted) return;
        const now = audioCtx.currentTime;
        [216.0, 1080.0].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const oscGain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          oscGain.gain.setValueAtTime(0.0001, now);
          oscGain.gain.exponentialRampToValueAtTime(0.14 / (idx + 1), now + 0.6);

          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start(now);
          activeOscs.push({ osc, gain: oscGain });
        });

        try {
          const sampleAudio = new Audio('/assets/alibi_chord_stage2.wav');
          sampleAudio.volume = isMuted ? 0 : 0.35;
          sampleAudio.play().catch(() => {});
        } catch (_) {}
      }

      function startStage4AmbientSound() {
        if (!audioCtx || isMuted) return;
        const now = audioCtx.currentTime;

        try {
          const salonTrack = new Audio('/assets/alibi_chord_stage3.wav');
          salonTrack.loop = true;
          salonTrack.volume = isMuted ? 0 : 0.4;
          salonTrack.play().catch(() => {});
          window._salonTrack = salonTrack;
        } catch (_) {}

        [432.0, 648.0, 1296.0].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const oscGain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const lfo = audioCtx.createOscillator();
          const lfoGain = audioCtx.createGain();
          lfo.frequency.setValueAtTime(0.18 + idx * 0.05, now);
          lfoGain.gain.setValueAtTime(0.8, now);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now);

          oscGain.gain.setValueAtTime(0.0001, now);
          oscGain.gain.exponentialRampToValueAtTime(0.04 / (idx + 1), now + 1.5);

          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start(now);
          activeOscs.push({ osc, gain: oscGain });
        });
      }

      function toggleMute() {
        isMuted = !isMuted;
        const muteIcon = document.getElementById('mute-icon');
        const audioLabel = document.getElementById('audio-label');
        if (muteIcon) muteIcon.textContent = isMuted ? '🔇' : '🔊';
        if (audioLabel) audioLabel.textContent = isMuted ? 'VERDI 432Hz MUTED' : 'VERDI 432Hz ON';
        if (masterGain && audioCtx) {
          masterGain.gain.setValueAtTime(isMuted ? 0.0001 : 0.22, audioCtx.currentTime);
        }
        if (window._salonTrack) {
          window._salonTrack.muted = isMuted;
        }
        if (window._stage1Audio) {
          window._stage1Audio.muted = isMuted;
        }
      }

      // 2. THREE.JS CUTTING-EDGE 3D EVOLUTION & ATELIER SCENE
      let scene, camera, renderer;
      let medallionGroup, atelierGroup;
      let emblemMesh = null, threeTextureLoader = null, activeEvolutionOptions = {};
      let liquidMesh, crystalGlassMesh, glintLight, glintSprites = [];
      let tubeLights = [], dustParticles;
      let warpParticles = null, livingBubbleParticles = null;
      let curMouseNorm = { x: 0, y: 0 };

      function updateThreeEmblemTexture(lvl) {
        if (!threeTextureLoader && typeof THREE !== 'undefined') {
          threeTextureLoader = new THREE.TextureLoader();
        }
        if (!threeTextureLoader) return;
        let targetTex = '/assets/jsf_symbol_living_master.png';
        if (lvl >= 2) targetTex = '/assets/jsf_symbol_lv2_key.png';
        else if (lvl === 1) targetTex = '/assets/jsf_symbol_lv1_seal.png';
        threeTextureLoader.load(targetTex, tex => {
          if (emblemMesh && emblemMesh.material) {
            emblemMesh.material.map = tex;
            emblemMesh.material.transparent = true;
            emblemMesh.material.alphaTest = 0.08;
            emblemMesh.material.needsUpdate = true;
          }
        });
      }

      let isDragging = false;
      let prevMousePos = { x: 0, y: 0 };
      let camRotation = { yaw: 0, pitch: -0.268 };
      let targetRotation = { yaw: 0, pitch: -0.268 };
      let camPosition = { x: 0, y: 1.55, z: -1.0 };
      let targetCamPos = { x: 0, y: 1.55, z: -1.0 };
      const keysDown = {};

      function initThreeScene() {
        if (scene) return;
        const canvas = document.getElementById('webgl-canvas');

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050507);
        scene.fog = new THREE.FogExp2(0x050507, 0.045);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 100);
        camera.position.set(0, 0, 8.5);

        renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;

        const ambientLight = new THREE.AmbientLight(0xffecd6, 0.75);
        scene.add(ambientLight);

        buildMedallionAndWineGlass();
        buildFrankfurtAtelier();

        window.addEventListener('resize', onWindowResize);
        setupInteractionListeners();
      }

      function buildMedallionAndWineGlass() {
        medallionGroup = new THREE.Group();
        medallionGroup.position.set(0, 0, 0);

        // NOTE: Rigid 3D circular coin frame and obsidian disc COMPLETELY REMOVED per user mandate.
        // The emblem floats purely and organically in the velvet noir void (#050507).

        const clefImgEl = document.getElementById('clef-img');
        let emblemTex;
        if (clefImgEl && clefImgEl.complete && clefImgEl.naturalWidth > 0) {
          emblemTex = new THREE.Texture(clefImgEl);
          emblemTex.needsUpdate = true;
        } else {
          const loader = new THREE.TextureLoader();
          emblemTex = loader.load('/assets/jsf_symbol_living_master.png', () => {
            if (renderer && scene && camera) renderer.render(scene, camera);
          });
        }
        const emblemMat = new THREE.MeshStandardMaterial({
          map: emblemTex,
          transparent: true,
          roughness: 0.22,
          metalness: 0.65,
          emissive: 0xfdfaf6,
          emissiveIntensity: 0.35,
          alphaTest: 0.08
        });
        const emblemGeo = new THREE.PlaneGeometry(1.6, 3.4);
        emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
        emblemMesh.position.set(0, 0.08, 0.04);
        medallionGroup.add(emblemMesh);

        // Clean relief presentation without crude sphere/cylinder overlay
        liquidMesh = null;
        crystalGlassMesh = null;

        glintLight = new THREE.PointLight(0xfff4d6, 3.2, 8, 1.4);
        glintLight.position.set(-3.5, 1.5, 1.8);
        medallionGroup.add(glintLight);

        function createGlintTexture() {
          const c = document.createElement('canvas');
          c.width = 128;
          c.height = 128;
          const ctx = c.getContext('2d');
          const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
          g.addColorStop(0, 'rgba(255, 255, 255, 1)');
          g.addColorStop(0.18, 'rgba(255, 235, 160, 0.85)');
          g.addColorStop(0.45, 'rgba(223, 177, 91, 0.35)');
          g.addColorStop(1, 'rgba(223, 177, 91, 0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, 128, 128);
          const tex = new THREE.CanvasTexture(c);
          tex.needsUpdate = true;
          return tex;
        }

        const glintTexture = createGlintTexture();
        const flareMat = new THREE.MeshBasicMaterial({
          map: glintTexture,
          color: 0xfff0b8,
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const flareGeo = new THREE.PlaneGeometry(0.65, 0.65);
        const glintPoints = [
          { x: 0.0, y: 1.25, z: 0.35 },
          { x: -0.42, y: 0.4, z: 0.28 },
          { x: 0.45, y: -0.2, z: 0.3 },
          { x: 0.0, y: -1.6, z: 0.2 }
        ];
        glintPoints.forEach(pt => {
          const sprite = new THREE.Mesh(flareGeo, flareMat.clone());
          sprite.position.set(pt.x, pt.y, pt.z);
          medallionGroup.add(sprite);
          glintSprites.push(sprite);
        });

        // 3D Micro-bubbles rising inside the wine goblet
        const bubbleCount = 45;
        const bubbleGeo = new THREE.BufferGeometry();
        const bubblePositions = new Float32Array(bubbleCount * 3);
        for (let i = 0; i < bubbleCount * 3; i += 3) {
          bubblePositions[i] = (Math.random() - 0.5) * 0.9;
          bubblePositions[i + 1] = -0.8 + Math.random() * 0.9;
          bubblePositions[i + 2] = 0.15 + (Math.random() - 0.5) * 0.6;
        }
        bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
        const bubbleMat = new THREE.PointsMaterial({
          color: 0xf3d489,
          size: 0.035,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        });
        livingBubbleParticles = new THREE.Points(bubbleGeo, bubbleMat);
        medallionGroup.add(livingBubbleParticles);

        // 3D Luminous Golden Particle Warp Field
        const warpCount = 450;
        const warpGeo = new THREE.BufferGeometry();
        const warpPositions = new Float32Array(warpCount * 3);
        const warpOriginalZ = new Float32Array(warpCount);
        for (let i = 0; i < warpCount; i++) {
          const r = 0.4 + Math.random() * 3.5;
          const theta = Math.random() * Math.PI * 2;
          warpPositions[i * 3] = Math.cos(theta) * r;
          warpPositions[i * 3 + 1] = Math.sin(theta) * r * 1.3;
          warpPositions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
          warpOriginalZ[i] = warpPositions[i * 3 + 2];
        }
        warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));
        const warpMat = new THREE.PointsMaterial({
          color: 0xdfb15b,
          size: 0.045,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        });
        warpParticles = new THREE.Points(warpGeo, warpMat);
        warpParticles.userData = { originalZ: warpOriginalZ };
        medallionGroup.add(warpParticles);

        scene.add(medallionGroup);
      }

      function buildFrankfurtAtelier() {
        atelierGroup = new THREE.Group();
        atelierGroup.position.set(0, 0, -2.5);
        atelierGroup.visible = false;

        const roomW = 4.5, roomD = 4.2, roomH = 2.8;

        const floorGeo = new THREE.PlaneGeometry(roomW, roomD, 16, 16);
        const floorMat = new THREE.MeshStandardMaterial({
          color: 0x1a0f0b,
          roughness: 0.28,
          metalness: 0.15
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        atelierGroup.add(floor);

        const plankLineMat = new THREE.LineBasicMaterial({ color: 0x0c0705, transparent: true, opacity: 0.45 });
        for (let x = -roomW / 2; x <= roomW / 2; x += 0.3) {
          const pts = [new THREE.Vector3(x, 0.002, -roomD / 2), new THREE.Vector3(x, 0.002, roomD / 2)];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          atelierGroup.add(new THREE.Line(lineGeo, plankLineMat));
        }

        const ceilGeo = new THREE.PlaneGeometry(roomW, roomD);
        const ceilMat = new THREE.MeshStandardMaterial({ color: 0x080406, roughness: 0.95 });
        const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = roomH;
        atelierGroup.add(ceiling);

        const wallMat = new THREE.MeshStandardMaterial({
          color: 0x120409,
          roughness: 0.85,
          metalness: 0.08
        });

        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
        backWall.position.set(0, roomH / 2, -roomD / 2);
        backWall.receiveShadow = true;
        atelierGroup.add(backWall);

        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-roomW / 2, roomH / 2, 0);
        leftWall.receiveShadow = true;
        atelierGroup.add(leftWall);

        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.set(roomW / 2, roomH / 2, 0);
        atelierGroup.add(rightWall);

        buildFrankfurtNightWindow(roomW / 2 - 0.02, 1.5, 0.2);
        buildAcousticDiffuserSlats(0, 1.4, -roomD / 2 + 0.05, 3.4, 2.2);
        buildSteinwayGrandPiano(0.75, 0, -0.6);
        buildVacuumTubeAmplifier(-1.5, 0.76, -0.8);
        buildStudioMonitor(-1.8, 1.15, -1.6, Math.PI * 0.15);
        buildStudioMonitor(1.8, 1.15, -1.6, -Math.PI * 0.15);
        buildVelvetSalonChair(-0.2, 0, 1.1);

        const chandelierLight = new THREE.SpotLight(0xffeedd, 2.8, 8, Math.PI * 0.35, 0.45, 1.2);
        chandelierLight.position.set(0, roomH - 0.15, 0);
        chandelierLight.target.position.set(0.5, 0.8, -0.6);
        chandelierLight.castShadow = true;
        chandelierLight.shadow.mapSize.width = 1024;
        chandelierLight.shadow.mapSize.height = 1024;
        atelierGroup.add(chandelierLight);
        atelierGroup.add(chandelierLight.target);

        const diffuserLight = new THREE.PointLight(0xffd59e, 1.8, 4.5, 1.4);
        diffuserLight.position.set(0, roomH - 0.25, -roomD / 2 + 0.35);
        atelierGroup.add(diffuserLight);

        buildDustMotes(roomW, roomD, roomH);

        scene.add(atelierGroup);
      }

      function buildAcousticDiffuserSlats(cx, cy, cz, width, height) {
        const slatGroup = new THREE.Group();
        slatGroup.position.set(cx, cy, cz);

        const oakMat = new THREE.MeshStandardMaterial({ color: 0x5a341e, roughness: 0.42, metalness: 0.08 });
        const walnutMat = new THREE.MeshStandardMaterial({ color: 0x381f14, roughness: 0.38, metalness: 0.1 });

        const numSlats = 36;
        const slatW = width / numSlats;
        const depths = [
          0.04, 0.12, 0.06, 0.18, 0.09, 0.15, 0.05, 0.22,
          0.08, 0.16, 0.04, 0.20, 0.10, 0.07, 0.14, 0.06,
          0.19, 0.05, 0.17, 0.11, 0.08, 0.21, 0.04, 0.15,
          0.09, 0.18, 0.06, 0.12, 0.07, 0.22, 0.10, 0.16,
          0.05, 0.14, 0.08, 0.20
        ];

        for (let i = 0; i < numSlats; i++) {
          const d = depths[i % depths.length];
          const mat = i % 2 === 0 ? oakMat : walnutMat;
          const slatGeo = new THREE.BoxGeometry(slatW * 0.94, height, d);
          const slat = new THREE.Mesh(slatGeo, mat);
          slat.position.set(-width / 2 + (i + 0.5) * slatW, 0, d / 2);
          slat.castShadow = true;
          slat.receiveShadow = true;
          slatGroup.add(slat);
        }

        const brassMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.85, roughness: 0.28 });
        const topFrame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.05, 0.26), brassMat);
        topFrame.position.set(0, height / 2 + 0.025, 0.12);
        slatGroup.add(topFrame);

        const botFrame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.05, 0.26), brassMat);
        botFrame.position.set(0, -height / 2 - 0.025, 0.12);
        slatGroup.add(botFrame);

        atelierGroup.add(slatGroup);
      }

      function buildSteinwayGrandPiano(x, y, z) {
        const piano = new THREE.Group();
        piano.position.set(x, y, z);
        piano.rotation.y = -Math.PI * 0.12;

        const ebonyMat = new THREE.MeshStandardMaterial({ color: 0x07080a, roughness: 0.12, metalness: 0.32 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.88, roughness: 0.22 });

        const caseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.38, 1.8), ebonyMat);
        caseMesh.position.set(0, 0.92, -0.6);
        caseMesh.castShadow = true;
        piano.add(caseMesh);

        const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.03, 1.78), ebonyMat);
        lidMesh.position.set(0.12, 1.35, -0.6);
        lidMesh.rotation.z = -0.38;
        lidMesh.castShadow = true;
        piano.add(lidMesh);

        const propMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.58), goldMat);
        propMesh.position.set(0.48, 1.25, -0.4);
        propMesh.rotation.z = 0.25;
        piano.add(propMesh);

        const harpMesh = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.04, 1.55), goldMat);
        harpMesh.position.set(0, 0.98, -0.6);
        piano.add(harpMesh);

        const stringMat = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 });
        for (let s = -0.6; s <= 0.6; s += 0.06) {
          const pts = [new THREE.Vector3(s, 1.01, -1.3), new THREE.Vector3(s * 0.7, 1.01, 0.1)];
          const sGeo = new THREE.BufferGeometry().setFromPoints(pts);
          piano.add(new THREE.Line(sGeo, stringMat));
        }

        const keybed = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.1, 0.38), ebonyMat);
        keybed.position.set(0, 0.82, 0.38);
        piano.add(keybed);

        const ivoryMat = new THREE.MeshStandardMaterial({ color: 0xfbf8ee, roughness: 0.2 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.12 });
        const numKeys = 42;
        const kw = 1.48 / numKeys;
        for (let k = 0; k < numKeys; k++) {
          const wk = new THREE.Mesh(new THREE.BoxGeometry(kw * 0.92, 0.035, 0.24), ivoryMat);
          wk.position.set(-0.74 + (k + 0.5) * kw, 0.88, 0.38);
          piano.add(wk);

          const oct = k % 7;
          if (oct !== 2 && oct !== 6 && k < numKeys - 1) {
            const bk = new THREE.Mesh(new THREE.BoxGeometry(kw * 0.62, 0.045, 0.15), blackMat);
            bk.position.set(-0.74 + (k + 1) * kw, 0.91, 0.34);
            piano.add(bk);
          }
        }

        const logoBar = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.015, 0.005), goldMat);
        logoBar.position.set(0, 0.96, 0.24);
        piano.add(logoBar);

        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.26, 0.03), ebonyMat);
        stand.position.set(0, 1.08, 0.18);
        stand.rotation.x = 0.24;
        piano.add(stand);

        const sheet = new THREE.Mesh(
          new THREE.PlaneGeometry(0.72, 0.22),
          new THREE.MeshStandardMaterial({ color: 0xede0c8, roughness: 0.85 })
        );
        sheet.position.set(0, 1.08, 0.2);
        sheet.rotation.x = 0.24;
        piano.add(sheet);

        const legPositions = [
          { x: -0.68, z: 0.2 },
          { x: 0.68, z: 0.2 },
          { x: 0.0, z: -1.35 }
        ];
        legPositions.forEach(pos => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.78), ebonyMat);
          leg.position.set(pos.x, 0.42, pos.z);
          leg.castShadow = true;
          piano.add(leg);

          const caster = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), goldMat);
          caster.position.set(pos.x, 0.035, pos.z);
          piano.add(caster);
        });

        atelierGroup.add(piano);
      }

      function buildVacuumTubeAmplifier(x, y, z) {
        const ampGroup = new THREE.Group();
        ampGroup.position.set(x, y, z);
        ampGroup.rotation.y = Math.PI * 0.08;

        const consoleGeo = new THREE.BoxGeometry(1.2, 0.72, 0.6);
        const consoleMat = new THREE.MeshStandardMaterial({ color: 0x321a0f, roughness: 0.45 });
        const credenza = new THREE.Mesh(consoleGeo, consoleMat);
        credenza.position.set(0, -0.38, 0);
        credenza.castShadow = true;
        ampGroup.add(credenza);

        const chassisMat = new THREE.MeshStandardMaterial({ color: 0x14161a, metalness: 0.82, roughness: 0.28 });
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.12, 0.46), chassisMat);
        chassis.position.y = 0.06;
        chassis.castShadow = true;
        ampGroup.add(chassis);

        const brassMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.9, roughness: 0.2 });
        [-0.22, 0.0, 0.22].forEach(kx => {
          const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 16), brassMat);
          knob.rotation.x = Math.PI / 2;
          knob.position.set(kx, 0.06, 0.235);
          ampGroup.add(knob);
        });

        const vuMat = new THREE.MeshStandardMaterial({ color: 0x221105, emissive: 0xffaa33, emissiveIntensity: 0.85 });
        [-0.14, 0.14].forEach(vx => {
          const vu = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.06), vuMat);
          vu.position.set(vx, 0.06, 0.232);
          ampGroup.add(vu);
        });

        const glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, roughness: 0.05 });
        const filamentMat = new THREE.MeshStandardMaterial({ color: 0xff7722, emissive: 0xff8822, emissiveIntensity: 2.8, roughness: 0.1 });

        const tubeCoords = [-0.22, -0.07, 0.07, 0.22];
        tubeCoords.forEach(tx => {
          const tubeGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.15, 16), glassMat);
          tubeGlass.position.set(tx, 0.2, -0.06);
          ampGroup.add(tubeGlass);

          const tubeTop = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), glassMat);
          tubeTop.position.set(tx, 0.275, -0.06);
          ampGroup.add(tubeTop);

          const filament = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.11), filamentMat);
          filament.position.set(tx, 0.19, -0.06);
          ampGroup.add(filament);
        });

        const tubeLight = new THREE.PointLight(0xff7722, 2.2, 3.2, 1.2);
        tubeLight.position.set(0, 0.35, -0.06);
        ampGroup.add(tubeLight);
        tubeLights.push(tubeLight);

        atelierGroup.add(ampGroup);
      }

      function buildStudioMonitor(x, y, z, rotY) {
        const g = new THREE.Group();
        g.position.set(x, y, z);
        g.rotation.y = rotY;

        const standMat = new THREE.MeshStandardMaterial({ color: 0x181a1d, roughness: 0.35, metalness: 0.8 });
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95), standMat);
        col.position.y = -0.48;
        col.castShadow = true;
        g.add(col);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 24), standMat);
        base.position.y = -0.95;
        g.add(base);

        const cabMat = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 0.45 });
        const cab = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.42, 0.32), cabMat);
        cab.castShadow = true;
        g.add(cab);

        const coneMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.75, roughness: 0.3 });
        const woofer = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.03, 0.02, 24), coneMat);
        woofer.rotation.x = Math.PI / 2;
        woofer.position.set(0, -0.06, 0.16);
        g.add(woofer);

        const domeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2 });
        const tweeter = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), domeMat);
        tweeter.position.set(0, 0.11, 0.16);
        g.add(tweeter);

        atelierGroup.add(g);
      }

      function buildVelvetSalonChair(x, y, z) {
        const chair = new THREE.Group();
        chair.position.set(x, y, z);
        chair.rotation.y = -Math.PI * 0.06;

        const velvetMat = new THREE.MeshStandardMaterial({ color: 0x6e0d22, roughness: 0.82, metalness: 0.12 });
        const brassMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.85, roughness: 0.28 });

        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.82), velvetMat);
        seat.position.y = 0.42;
        seat.castShadow = true;
        chair.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.18), velvetMat);
        back.position.set(0, 0.78, 0.34);
        chair.add(back);

        [-0.45, 0.45].forEach(ax => {
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 0.78), velvetMat);
          arm.position.set(ax, 0.58, 0.02);
          chair.add(arm);
        });

        const legOffsets = [
          { x: -0.38, z: -0.32 },
          { x: 0.38, z: -0.32 },
          { x: -0.38, z: 0.32 },
          { x: 0.38, z: 0.32 }
        ];
        legOffsets.forEach(lo => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.012, 0.38), brassMat);
          leg.position.set(lo.x, 0.18, lo.z);
          chair.add(leg);
        });

        atelierGroup.add(chair);
      }

      function buildFrankfurtNightWindow(x, y, z) {
        const winGroup = new THREE.Group();
        winGroup.position.set(x, y, z);
        winGroup.rotation.y = -Math.PI / 2;

        const frameMat = new THREE.MeshStandardMaterial({ color: 0x140c10, roughness: 0.35 });
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.85, 0.06), frameMat);
        winGroup.add(frame);

        const glassMat = new THREE.MeshBasicMaterial({ color: 0x060812, transparent: true, opacity: 0.95 });
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.7), glassMat);
        glass.position.z = 0.032;
        winGroup.add(glass);

        const towerColors = [0xdfb15b, 0xa21c38, 0x4a90e2, 0xffe29a];
        for (let t = -0.65; t <= 0.65; t += 0.18) {
          const th = 0.4 + Math.abs(Math.sin(t * 7)) * 0.65;
          const towerMat = new THREE.MeshBasicMaterial({ color: 0x090c16 });
          const tower = new THREE.Mesh(new THREE.PlaneGeometry(0.12, th), towerMat);
          tower.position.set(t, -0.4 + th / 2, 0.035);
          winGroup.add(tower);

          const beaconMat = new THREE.MeshBasicMaterial({ color: towerColors[Math.floor(Math.random() * towerColors.length)] });
          const beacon = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 0.015), beaconMat);
          beacon.position.set(t, -0.4 + th + 0.01, 0.036);
          winGroup.add(beacon);
        }

        atelierGroup.add(winGroup);
      }

      function buildDustMotes(roomW, roomD, roomH) {
        const count = 220;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
          pos[i] = (Math.random() - 0.5) * (roomW * 0.9);
          pos[i + 1] = 0.2 + Math.random() * (roomH - 0.4);
          pos[i + 2] = (Math.random() - 0.5) * (roomD * 0.9);
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
          color: 0xdfb15b,
          size: 0.035,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        dustParticles = new THREE.Points(geo, mat);
        atelierGroup.add(dustParticles);
      }

      // 3. EVOLUTION SEQUENCE CONTROLLER (5.0 SECONDS CHOREOGRAPHY)
      function startEvolutionSequence(options) {
        if (evolutionActive) return;

        activeEvolutionOptions = options || {};
        const isVip = !!activeEvolutionOptions.isVipDive;
        const lvl = activeEvolutionOptions.level !== undefined ? activeEvolutionOptions.level : currentMinigameLevel;

        // Ensure Three.js is loaded on-demand
        if (typeof THREE === 'undefined') {
          if (window._threeLoading) return;
          window._threeLoading = true;
          console.log('[LaunchFresh] Loading Three.js on-demand...');
          const script = document.createElement('script');
          script.src = '/games/three.min.js';
          script.onload = () => {
            window._threeLoading = false;
            startEvolutionSequence(options);
          };
          script.onerror = (err) => {
            window._threeLoading = false;
            console.error('Failed to load Three.js on-demand', err);
          };
          document.head.appendChild(script);
          return;
        }

        evolutionActive = true;
        evolutionStartTime = performance.now();

        initWebAudio();
        if (isVip) {
          playVipRoyalHarmonics();
        } else {
          playVerdiStage1Chord();
        }

        if (typeof window._triggerLivingLogoWarp === 'function') {
          window._triggerLivingLogoWarp();
        }

        const initView = document.getElementById('initial-view');
        if (initView) initView.classList.add('evolved');

        const container = document.getElementById('canvas-container');
        if (container) container.classList.add('active');

        initThreeScene();
        updateThreeEmblemTexture(lvl);
        requestAnimationFrame(animateFrame);
      }

      function resetEvolution() {
        evolutionActive = false;
        evolutionStartTime = null;
        evolutionStage = 0;

        // 1. Stop all active Web Audio oscillators
        activeOscs.forEach(item => {
          try {
            if (item.osc) {
              item.osc.stop();
              item.osc.disconnect();
            }
            if (item.gain) {
              item.gain.disconnect();
            }
          } catch (_) {}
        });
        activeOscs = [];

        // 2. Stop Stage 4 salon audio track & Stage 1 chord
        if (window._salonTrack) {
          try {
            window._salonTrack.pause();
            window._salonTrack.currentTime = 0;
          } catch (_) {}
        }
        if (window._stage1Audio) {
          try {
            window._stage1Audio.pause();
            window._stage1Audio.currentTime = 0;
          } catch (_) {}
        }

        // 3. Reset 3D mesh transforms & materials
        if (camera) {
          camera.position.set(0, 0, 8.5);
          camera.rotation.set(0, 0, 0);
        }
        if (medallionGroup) {
          medallionGroup.visible = true;
          medallionGroup.rotation.set(0, 0, 0);
          medallionGroup.scale.set(1.0, 1.0, 0.08);
        }
        if (liquidMesh) {
          liquidMesh.scale.set(0.2, 0.02, 0.2);
          liquidMesh.position.set(0, 0.55, 0.15);
          liquidMesh.rotation.set(0, 0, 0);
        }
        if (glintLight) {
          glintLight.position.set(-3.5, 1.5, 1.8);
          glintLight.intensity = 3.2;
        }
        glintSprites.forEach(s => {
          s.material.opacity = 0.0;
        });
        if (warpParticles) {
          warpParticles.visible = true;
          const pos = warpParticles.geometry.attributes.position.array;
          const origZ = warpParticles.userData && warpParticles.userData.originalZ;
          if (origZ) {
            for (let i = 0; i < origZ.length; i++) {
              pos[i * 3 + 2] = origZ[i];
            }
            warpParticles.geometry.attributes.position.needsUpdate = true;
          }
        }
        if (livingBubbleParticles) {
          livingBubbleParticles.visible = true;
        }
        if (typeof window._resetLivingLogo === 'function') {
          window._resetLivingLogo();
        }
        if (atelierGroup) {
          atelierGroup.visible = false;
        }

        // 4. Reset exploration camera state
        camPosition = { x: 0, y: 1.55, z: -1.0 };
        targetCamPos = { x: 0, y: 1.55, z: -1.0 };
        camRotation = { yaw: 0, pitch: -0.268 };
        targetRotation = { yaw: 0, pitch: -0.268 };
        isDragging = false;
        for (let k in keysDown) {
          keysDown[k] = false;
        }

        // 5. Reset DOM elements
        const initView = document.getElementById('initial-view');
        if (initView) initView.classList.remove('evolved');

        const hud = document.getElementById('atelier-hud');
        if (hud) hud.classList.remove('visible');

        const container = document.getElementById('canvas-container');
        if (container) container.classList.remove('active');

        const overlay = document.getElementById('dive-overlay');
        if (overlay) overlay.style.opacity = '0';

        // 6. Reset Minigame 3-Minute Loop State
        if (typeof window._resetMinigameState === 'function') {
          window._resetMinigameState();
        }
        if (threeTextureLoader && emblemMesh) {
          threeTextureLoader.load('/assets/jsf_symbol_living_master.png', tex => {
            if (emblemMesh && emblemMesh.material) {
              emblemMesh.material.map = tex;
              emblemMesh.material.needsUpdate = true;
            }
          });
        }
      }

      // 4. ANIMATION FRAME & 4-STAGE TRANSITIONS
      function animateFrame(now) {
        if (!evolutionActive) return;
        requestAnimationFrame(animateFrame);

        const elapsedSec = (now - evolutionStartTime) / 1000.0;

        // Stage 1 (0.0s - 1.5s): 3D Sculpted Crystal-Gold Relief Eruption & Glints
        if (elapsedSec < 1.5) {
          evolutionStage = 1;
          const tNorm = elapsedSec / 1.5;

          camera.position.z = 8.5 - tNorm * 0.4;
          camera.position.x = Math.sin(tNorm * Math.PI) * 0.15;
          camera.position.y = 0;
          camera.lookAt(0, 0, 0);

          if (glintLight) {
            glintLight.position.x = -3.5 + tNorm * 7.0;
            glintLight.intensity = 2.2 + Math.sin(tNorm * Math.PI) * 3.5;
          }

          glintSprites.forEach((sprite, idx) => {
            const phase = (tNorm * 3.0 + idx * 0.35) % 1.0;
            sprite.material.opacity = Math.sin(phase * Math.PI) * 0.95;
            sprite.scale.setScalar(0.7 + Math.sin(phase * Math.PI) * 0.5);
          });

          if (medallionGroup) {
            // Physically sculpt from 2D plane (0.08) into 3D sculpted relief (1.0)
            medallionGroup.scale.set(1.0, 1.0, 0.08 + tNorm * 0.92);
            medallionGroup.rotation.y = (tNorm - 0.5) * 0.12 + curMouseNorm.x * 0.22;
            medallionGroup.rotation.x = Math.sin(tNorm * Math.PI) * 0.05 - curMouseNorm.y * 0.18;
          }
          if (livingBubbleParticles) {
            const pos = livingBubbleParticles.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
              pos[i] += 0.007;
              if (pos[i] > 0.3) pos[i] = -0.8;
            }
            livingBubbleParticles.geometry.attributes.position.needsUpdate = true;
          }
        }

        // Stage 2 (1.5s - 3.2s): Bordeaux Wine Liquid Swell & Viscous Sloshing
        else if (elapsedSec >= 1.5 && elapsedSec < 3.2) {
          if (evolutionStage === 1) {
            evolutionStage = 2;
            swellStage2Chord();
          }

          const tNorm = (elapsedSec - 1.5) / 1.7;

          if (liquidMesh) {
            liquidMesh.scale.set(
              0.2 + tNorm * 0.85,
              0.02 + tNorm * 0.98,
              0.2 + tNorm * 0.85
            );
            liquidMesh.position.y = 0.55 + tNorm * 0.25;
            liquidMesh.rotation.z = Math.sin(elapsedSec * 6.5) * 0.06 - curMouseNorm.x * 0.08;
            liquidMesh.rotation.x = Math.cos(elapsedSec * 5.0) * 0.04 - curMouseNorm.y * 0.06;
          }

          camera.position.z = 8.1 - tNorm * 1.6;
          camera.position.x = Math.sin(elapsedSec * 2.0) * 0.18;
          camera.lookAt(0, 0.2, 0);

          if (medallionGroup) {
            medallionGroup.scale.set(1.0, 1.0, 1.0);
            medallionGroup.rotation.y = Math.sin(elapsedSec * 1.8) * 0.08 + curMouseNorm.x * 0.25;
            medallionGroup.rotation.x = -curMouseNorm.y * 0.18;
          }
          if (livingBubbleParticles) {
            const pos = livingBubbleParticles.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
              pos[i] += 0.01;
              if (pos[i] > 0.45) pos[i] = -0.8;
            }
            livingBubbleParticles.geometry.attributes.position.needsUpdate = true;
          }
        }

        // Stage 3 (3.2s - 5.0s): Dolly-In Dive through Wine Meniscus into 19m² Atelier
        else if (elapsedSec >= 3.2 && elapsedSec < 5.0) {
          if (evolutionStage === 2) {
            evolutionStage = 3;
            if (atelierGroup) atelierGroup.visible = true;
          }

          const tNorm = (elapsedSec - 3.2) / 1.8;
          const easeDive = Math.pow(tNorm, 2.2);

          const camZ = 6.5 - easeDive * 7.5;
          camera.position.z = camZ;
          camera.position.y = 0.2 + easeDive * 1.35;
          camera.position.x = (1.0 - easeDive) * 0.15;
          camera.lookAt(0, 1.2 - easeDive * 0.2, -3.0);

          if (warpParticles) {
            const pos = warpParticles.geometry.attributes.position.array;
            for (let i = 2; i < pos.length; i += 3) {
              pos[i] += (0.08 + easeDive * 0.55);
              if (pos[i] > 8.0) pos[i] = -4.0;
            }
            warpParticles.geometry.attributes.position.needsUpdate = true;
          }

          const overlay = document.getElementById('dive-overlay');
          if (overlay) {
            if (tNorm > 0.45 && tNorm < 0.85) {
              const peakProgress = Math.sin(((tNorm - 0.45) / 0.4) * Math.PI);
              overlay.style.opacity = (peakProgress * 0.95).toFixed(2);
            } else if (tNorm >= 0.85) {
              overlay.style.opacity = (Math.max(0, 1.0 - (tNorm - 0.85) / 0.15)).toFixed(2);
            }
          }

          if (medallionGroup) {
            if (camZ < 1.2) {
              medallionGroup.visible = false;
            }
          }
        }

        // Stage 4 (5.0s+): Arrival State in 19m² Atelier & Interactive Exploration
        else {
          if (evolutionStage === 3) {
            evolutionStage = 4;
            if (medallionGroup) medallionGroup.visible = false;
            if (atelierGroup) atelierGroup.visible = true;

            // Seamlessly lock arrival camera position & orientation
            camPosition.x = 0;
            camPosition.y = 1.55;
            camPosition.z = -1.0;
            targetCamPos.x = 0;
            targetCamPos.y = 1.55;
            targetCamPos.z = -1.0;
            camRotation.yaw = 0;
            camRotation.pitch = -0.268;
            targetRotation.yaw = 0;
            targetRotation.pitch = -0.268;

            const hud = document.getElementById('atelier-hud');
            if (hud) hud.classList.add('visible');

            const hudSub = document.querySelector('#atelier-hud .hud-sub');
            if (hudSub) {
              if (activeEvolutionOptions && activeEvolutionOptions.isVipDive) {
                hudSub.textContent = 'FRANKFURT AM MAIN · 432Hz VERDI ACOUSTIC VAULT · VIP TRANSCENDENCE';
              } else if (activeEvolutionOptions && activeEvolutionOptions.level >= 2) {
                hudSub.textContent = 'FRANKFURT AM MAIN · 432Hz VERDI ACOUSTIC VAULT · LV.2 ATELIER KEY';
              } else if (activeEvolutionOptions && activeEvolutionOptions.level === 1) {
                hudSub.textContent = 'FRANKFURT AM MAIN · 432Hz VERDI ACOUSTIC VAULT · LV.1 NOTARY SEAL';
              } else {
                hudSub.textContent = 'FRANKFURT AM MAIN · 432Hz VERDI ACOUSTIC VAULT';
              }
            }

            const overlay = document.getElementById('dive-overlay');
            if (overlay) overlay.style.opacity = '0';

            startStage4AmbientSound();
          }

          updateExploration(0.016);

          tubeLights.forEach((tl, i) => {
            tl.intensity = 2.0 + Math.sin(now * 0.003 + i) * 0.35;
          });

          if (dustParticles) {
            dustParticles.rotation.y += 0.0006;
          }
        }

        renderer.render(scene, camera);
      }

      function setupInteractionListeners() {
        window.addEventListener('mousedown', e => {
          if (evolutionStage !== 4) return;
          if (e.target.closest('#atelier-hud') || e.target.closest('button') || e.target.closest('a')) return;
          isDragging = true;
          prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mousemove', e => {
          if (!isDragging || evolutionStage !== 4) return;
          const dx = e.clientX - prevMousePos.x;
          const dy = e.clientY - prevMousePos.y;
          prevMousePos = { x: e.clientX, y: e.clientY };

          targetRotation.yaw -= dx * 0.0035;
          targetRotation.pitch = Math.max(-0.65, Math.min(0.65, targetRotation.pitch - dy * 0.0035));
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        window.addEventListener('touchstart', e => {
          if (evolutionStage !== 4 || !e.touches[0]) return;
          if (e.target.closest('#atelier-hud') || e.target.closest('button') || e.target.closest('a')) return;
          isDragging = true;
          prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        window.addEventListener('touchmove', e => {
          if (!isDragging || evolutionStage !== 4 || !e.touches[0]) return;
          const dx = e.touches[0].clientX - prevMousePos.x;
          const dy = e.touches[0].clientY - prevMousePos.y;
          prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

          targetRotation.yaw -= dx * 0.0045;
          targetRotation.pitch = Math.max(-0.65, Math.min(0.65, targetRotation.pitch - dy * 0.0045));
        }, { passive: true });

        window.addEventListener('touchend', () => { isDragging = false; });

        window.addEventListener('keydown', e => {
          keysDown[e.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', e => {
          keysDown[e.key.toLowerCase()] = false;
        });
      }

      function updateExploration(delta) {
        camRotation.yaw += (targetRotation.yaw - camRotation.yaw) * 0.08;
        camRotation.pitch += (targetRotation.pitch - camRotation.pitch) * 0.08;

        const forward = new THREE.Vector3(-Math.sin(camRotation.yaw), 0, -Math.cos(camRotation.yaw));
        const right = new THREE.Vector3(Math.cos(camRotation.yaw), 0, -Math.sin(camRotation.yaw));
        const moveSpeed = 1.4 * delta;

        if (keysDown['w'] || keysDown['arrowup']) targetCamPos.x += forward.x * moveSpeed, targetCamPos.z += forward.z * moveSpeed;
        if (keysDown['s'] || keysDown['arrowdown']) targetCamPos.x -= forward.x * moveSpeed, targetCamPos.z -= forward.z * moveSpeed;
        if (keysDown['a'] || keysDown['arrowleft']) targetCamPos.x -= right.x * moveSpeed, targetCamPos.z -= right.z * moveSpeed;
        if (keysDown['d'] || keysDown['arrowright']) targetCamPos.x += right.x * moveSpeed, targetCamPos.z += right.z * moveSpeed;

        // Clamped precisely within Sean's 19m² room boundaries (atelierGroup centered at z = -2.5)
        targetCamPos.x = Math.max(-1.8, Math.min(1.8, targetCamPos.x));
        targetCamPos.z = Math.max(-3.9, Math.min(-0.9, targetCamPos.z));

        camPosition.x += (targetCamPos.x - camPosition.x) * 0.1;
        camPosition.y = 1.55;
        camPosition.z += (targetCamPos.z - camPosition.z) * 0.1;

        camera.position.set(camPosition.x, camPosition.y, camPosition.z);

        const lookTarget = new THREE.Vector3(
          camPosition.x - Math.sin(camRotation.yaw) * Math.cos(camRotation.pitch),
          camPosition.y + Math.sin(camRotation.pitch),
          camPosition.z - Math.cos(camRotation.yaw) * Math.cos(camRotation.pitch)
        );
        camera.lookAt(lookTarget);
      }

      function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      // ======================================================================
      // 6. LIVING ENTITY LOGO ENGINE & 3-MINUTE PROGRESSION MINIGAME
      // Pure velvet void floating emblem, mouse-responsive 3D perspective tilt,
      // real-time Bordeaux wine fluid waves with inertia & micro-bubbles,
      // organic molten gold flowing light stream along treble clef spiral,
      // 6. LIVING ENTITY LOGO ENGINE & SCROLL-DRIVEN FUGUE MULTI-LAYER ENGINE
      // 0-Stage Pure Seed (Clean cutout, zero text, warm heartbeat bloom on approach)
      // On-Click Unseal: Web Audio 432Hz unseal chord + golden spark burst -> unlocks Stage 1
      // Scroll-Driven Progression: silky smooth interpolation (0% -> 100%)
      // Fugue Multi-layer Accumulation:
      //   Layer 0: Chic golden micro-glitter along clef contours (permanent)
      //   Layer 1: Baccarat crystal refraction caustics & facet prism highlights
      //   Layer 2: Liquid Bordeaux wine fluid wave, meniscus slosh & micro-bubbles
      //   Layer 3: 18k Champagne gold treble clef flowing light stream & 3D specular highlight
      // Level Up & 3-Second Macro Showcase (at 100%):
      //   Picardy third 432Hz triumphant fanfare chord
      //   Cut 1: Wine glass rim & liquid meniscus surface tension macro
      //   Cut 2: 18k gold treble clef twist & engraving macro
      //   Cut 3: Full 3D Baccarat crystal & gold masterpiece view (assets/3d_sculpture_lv0_portrait.png)
      // After 3s: 'ENTER ATELIER' dock pill illuminates for dive into 19m² Frankfurt atelier.
      // Stage 3 (Wax Seal) & Stage 4 (Skeleton Key) Deferred per directive.
      // ======================================================================
      const CLEF_SKELETON_PATH = [[52,19],[67,19],[82,19],[97,19],[112,19],[127,19],[142,19],[157,19],[172,19],[187,19],[199,28],[205,43],[211,58],[215,73],[219,88],[222,103],[223,118],[223,133],[222,148],[219,163],[213,178],[205,193],[194,208],[180,223],[165,235],[150,247],[138,262],[133,277],[132,292],[136,304],[151,304],[166,307],[181,314],[196,327],[204,342],[208,357],[209,372],[206,387],[200,402],[188,417],[178,430],[156,431],[158,446],[161,461],[163,476],[164,491],[163,506],[158,521],[146,536],[131,545],[116,548],[101,547],[86,541],[76,527],[78,512],[106,437],[121,439],[136,445],[152,411],[149,396],[146,381],[144,366],[141,351],[138,336],[134,332],[114,315],[100,328],[93,343],[91,358],[94,373],[104,388],[103,436],[88,431],[73,423],[58,410],[48,395],[41,380],[38,365],[37,350],[39,335],[42,320],[49,305],[59,290],[72,275],[87,261],[102,248],[117,237],[132,227],[147,215],[162,202],[176,187],[185,172],[189,157],[192,143],[199,128],[202,113],[179,151],[186,154],[168,151],[153,157],[138,162],[123,166],[108,169],[93,164],[78,151],[64,136],[20,144],[23,159],[28,174],[36,189],[46,204],[61,219],[76,229],[91,229],[19,134],[19,119],[21,104],[23,89],[27,74],[32,59],[37,44],[43,29]];

      // PROGRESSION & FUGUE STATE
      let isUnsealed = false;
      let scrollProgress = 0.0;     // Smoothed interpolation (0.0 to 1.0)
      let targetProgress = 0.0;     // Target from wheel / touch / clicks
      let isLevelUpDone = false;    // Has triggered 100% level up
      let isLevelUpLocked = false;  // 3-second progression lock active
      let showcaseStartTime = 0;    // Timestamp for 3-second macro showcase
      let showcaseCutsSeen = [];    // Recorded cuts for deterministic verification
      let lastScrollChimeTime = 0;
      let lastInteractTime = 0;
      let lastFrameTime = performance.now();
      let fluidSloshAngle = 0;
      let fluidSloshVel = 0;
      let isWarpBurst = false;
      let warpStartTime = 0;
      let burstParticles = [];
      let isParticleStorm = false;
      let stormParticles = [];

      const SCULPTURE_CONTOUR = [
        { y: 0.0, w: 0.0, cx: 0.5 },
        { y: 0.05, w: 0.495, cx: 0.505 },
        { y: 0.1, w: 0.819, cx: 0.504 },
        { y: 0.15, w: 0.88, cx: 0.504 },
        { y: 0.2, w: 0.939, cx: 0.503 },
        { y: 0.25, w: 0.97, cx: 0.504 },
        { y: 0.3, w: 0.973, cx: 0.503 },
        { y: 0.35, w: 0.913, cx: 0.504 },
        { y: 0.4, w: 0.8, cx: 0.498 },
        { y: 0.45, w: 0.549, cx: 0.504 },
        { y: 0.5, w: 0.272, cx: 0.513 },
        { y: 0.55, w: 0.244, cx: 0.524 },
        { y: 0.6, w: 0.196, cx: 0.495 },
        { y: 0.65, w: 0.293, cx: 0.426 },
        { y: 0.7, w: 0.608, cx: 0.503 },
        { y: 0.75, w: 0.627, cx: 0.509 },
        { y: 0.8, w: 0.513, cx: 0.513 },
        { y: 0.85, w: 0.22, cx: 0.53 },
        { y: 0.9, w: 0.372, cx: 0.52 },
        { y: 0.95, w: 0.847, cx: 0.506 },
        { y: 1.0, w: 0.0, cx: 0.5 }
      ];

      function getContourAtYNorm(yNorm) {
        const clampedY = Math.max(0.0, Math.min(1.0, yNorm));
        for (let i = 0; i < SCULPTURE_CONTOUR.length - 1; i++) {
          const ptA = SCULPTURE_CONTOUR[i];
          const ptB = SCULPTURE_CONTOUR[i + 1];
          if (clampedY >= ptA.y && clampedY <= ptB.y) {
            const frac = (clampedY - ptA.y) / (ptB.y - ptA.y || 1);
            return {
              w: ptA.w + (ptB.w - ptA.w) * frac,
              cx: ptA.cx + (ptB.cx - ptA.cx) * frac
            };
          }
        }
        return { w: 0.85, cx: 0.5 };
      }

      function updateScrollUI() {
        const arc = document.getElementById('swirl-gauge-arc');
        const pip1 = document.getElementById('pip-lv1');
        const pip2 = document.getElementById('pip-lv2');
        const pipMax = document.getElementById('pip-lvmax');
        const lv0Img = document.getElementById('clef-lv0-img');
        const lv0ImgLeft = document.getElementById('clef-lv0-img-left');
        const lv0ImgRight = document.getElementById('clef-lv0-img-right');
        const baseImg = document.getElementById('clef-img');

        // Circular gauge offset (Circumference = 904.78)
        if (arc) {
          const offset = 904.78 * (1.0 - Math.max(0, Math.min(1.0, scrollProgress)));
          arc.style.strokeDashoffset = offset.toFixed(2);
        }

        if (pip1) pip1.classList.toggle('reached', scrollProgress >= 0.33);
        if (pip2) pip2.classList.toggle('reached', scrollProgress >= 0.66);
        if (pipMax) pipMax.classList.toggle('reached', scrollProgress >= 0.99);

        // 3D Sculpture Light Sweep Materialization (빛의 스캔 와이프 - Zero Ghosting & Contour Responsive)
        const sweepBeam = document.getElementById('materialize-sweep-beam');
        const applySculptureClip = (clipStr, opacityVal, isActive) => {
          [lv0Img, lv0ImgLeft, lv0ImgRight].forEach(img => {
            if (img) {
              img.style.clipPath = clipStr;
              img.classList.toggle('active', isActive);
              if (img === lv0Img && opacityVal !== undefined) {
                img.style.opacity = opacityVal;
              }
            }
          });
        };

        if (scrollProgress <= 0.001) {
          applySculptureClip('inset(100% 0 0 0)', '0', false);
          if (lv0Img) lv0Img.style.opacity = '0';
          if (lv0ImgLeft) lv0ImgLeft.style.opacity = '0';
          if (lv0ImgRight) lv0ImgRight.style.opacity = '0';

          if (baseImg) {
            baseImg.style.clipPath = 'none';
            baseImg.style.opacity = '1';
          }
          if (sweepBeam) {
            sweepBeam.classList.remove('active');
            sweepBeam.style.top = '100%';
            sweepBeam.style.width = '20%';
          }
        } else if (scrollProgress >= 0.999) {
          applySculptureClip('none', '1', true);
          if (lv0Img) lv0Img.style.opacity = '1';
          if (baseImg) {
            baseImg.style.clipPath = 'inset(0 0 100% 0)';
            baseImg.style.opacity = '0';
          }
          if (sweepBeam) {
            sweepBeam.classList.remove('active');
            sweepBeam.style.top = '0%';
          }
        } else {
          // Sweep line ascends from bottom (clef spiral) to top (wine glass rim)
          const sweepYPercent = (1.0 - scrollProgress) * 100;
          const sweepYNorm = (1.0 - scrollProgress);
          const contour = getContourAtYNorm(sweepYNorm);

          // Below sweep line: 100% solid realized 3D Baccarat crystal & 18k gold sculpture
          applySculptureClip(`inset(${sweepYPercent.toFixed(2)}% 0 0 0)`, '1', true);
          if (lv0Img) lv0Img.style.opacity = '1';

          if (baseImg) {
            // Above sweep line: 100% solid 2D living emblem
            baseImg.style.clipPath = `inset(0 0 ${(100 - sweepYPercent).toFixed(2)}% 0)`;
            baseImg.style.opacity = '1';
          }
          if (sweepBeam) {
            sweepBeam.classList.add('active');
            sweepBeam.style.top = `${sweepYPercent.toFixed(2)}%`;
            // Dynamic beam width follows the exact silhouette of the glass & stem
            const beamWidthPct = Math.max(24, Math.min(106, contour.w * 100 + 8));
            sweepBeam.style.width = `${beamWidthPct.toFixed(1)}%`;
            sweepBeam.style.left = `${(contour.cx * 100).toFixed(1)}%`;
          }
        }
      }

      function unsealSeed() {
        if (typeof window.__triggerGoboStart === 'function' && window.__getGoboStageState && window.__getGoboStageState().stage === 0) {
          window.__triggerGoboStart();
          return;
        }
        if (isUnsealed) return;
        isUnsealed = true;
        initWebAudio();
        playVerdiUnsealChord();
        triggerUnsealBurst();

        const gauge = document.getElementById('swirl-gauge');
        if (gauge) gauge.classList.add('unsealed');
      }

      function triggerUnsealBurst() {
        isWarpBurst = true;
        warpStartTime = performance.now();
        burstParticles = [];
        const numParticles = 140;
        for (let i = 0; i < numParticles; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3.5 + Math.random() * 16.0;
          burstParticles.push({
            x: 121.5,
            y: 284,
            prevX: 121.5,
            prevY: 284,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed * 1.1,
            size: 1.2 + Math.random() * 2.8,
            alpha: 1.0,
            decay: 0.016 + Math.random() * 0.022,
            color: i % 3 === 0 ? '#fffdf6' : (i % 3 === 1 ? '#dfb15b' : '#f3d489')
          });
        }
      }

      function triggerLevelUpShowcase() {
        if (isLevelUpDone) return;
        isLevelUpDone = true;
        isLevelUpLocked = true;
        showcaseStartTime = performance.now();

        initWebAudio();
        playPicardyThirdFanfareChord();
        triggerUnsealBurst();

        const showcaseHud = document.getElementById('showcase-hud');
        if (showcaseHud) showcaseHud.classList.add('visible');
        const macroTag = document.getElementById('showcase-macro-tag');
        if (macroTag) macroTag.textContent = '01 / BACCARAT CRYSTAL RIM & LIQUID MENISCUS';
      }

      window._resetMinigameState = function() {
        isUnsealed = false;
        scrollProgress = 0.0;
        targetProgress = 0.0;
        isLevelUpDone = false;
        isLevelUpLocked = false;
        showcaseStartTime = 0;
        showcaseCutsSeen = [];
        isWarpBurst = false;
        burstParticles = [];
        isParticleStorm = false;
        stormParticles = [];
        lastInteractTime = 0;

        const gauge = document.getElementById('swirl-gauge');
        if (gauge) gauge.classList.remove('unsealed');

        const stageEl = document.getElementById('symbol-trigger');
        if (stageEl) {
          stageEl.classList.remove('cinematic-cut-1', 'cinematic-cut-2', 'cinematic-cut-3', 'hover-approach', 'masterpiece-unlocked');
        }

        const showcaseHud = document.getElementById('showcase-hud');
        if (showcaseHud) showcaseHud.classList.remove('visible');

        const macroTag = document.getElementById('showcase-macro-tag');
        if (macroTag) macroTag.textContent = '01 / BACCARAT CRYSTAL RIM & LIQUID MENISCUS';

        const dock = document.getElementById('early-entry-dock');
        if (dock) {
          dock.classList.remove('visible', 'masterpiece-unlocked');
        }

        const lv0 = document.getElementById('clef-lv0-img');
        const lv0L = document.getElementById('clef-lv0-img-left');
        const lv0R = document.getElementById('clef-lv0-img-right');
        if (lv0) { lv0.style.opacity = '0'; lv0.style.clipPath = 'inset(100% 0 0 0)'; }
        if (lv0L) { lv0L.style.opacity = '0'; lv0L.style.clipPath = 'inset(100% 0 0 0)'; }
        if (lv0R) { lv0R.style.opacity = '0'; lv0R.style.clipPath = 'inset(100% 0 0 0)'; }

        if (typeof window._resetLivingLogo === 'function') {
          window._resetLivingLogo();
        }

        updateScrollUI();
      };

      function initLivingLogoEngine() {
        const canvas = document.getElementById('living-entity-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const triggerEl = document.getElementById('symbol-trigger');
        const clefImgEl = document.getElementById('clef-img');
        const specularGlintEl = document.getElementById('specular-glint');

        let livingLoopId = null;
        let isHovered = false;
        let targetTilt = { x: 0, y: 0, z: 0 };
        let currentTilt = { x: 0, y: 0, z: 0 };
        let prevMouseNorm = { x: 0, y: 0 };
        let mouseVel = { x: 0, y: 0 };

        function calibrateLivingCanvas() {
          if (!canvas) return;
          const cw = (clefImgEl && (clefImgEl.clientWidth || clefImgEl.offsetWidth)) || 243;
          const ch = (clefImgEl && (clefImgEl.clientHeight || clefImgEl.offsetHeight)) || 568;
          if (cw <= 0 || ch <= 0) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const targetW = Math.round(cw * dpr);
          const targetH = Math.round(ch * dpr);
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }
        }
        window.addEventListener('resize', calibrateLivingCanvas);
        if (clefImgEl) {
          if (clefImgEl.complete) calibrateLivingCanvas();
          else clefImgEl.addEventListener('load', calibrateLivingCanvas);
        }

        // FUGUE LAYER 0: Chic Golden Micro-Glitter along Clef Contours
        const GLITTER_COUNT = 48;
        const glitterParticles = [];
        for (let i = 0; i < GLITTER_COUNT; i++) {
          const pathPt = CLEF_SKELETON_PATH[Math.floor((i / GLITTER_COUNT) * CLEF_SKELETON_PATH.length)];
          glitterParticles.push({
            x: pathPt[0] + (Math.random() - 0.5) * 12,
            y: pathPt[1] + (Math.random() - 0.5) * 12,
            baseSize: 0.75 + Math.random() * 1.4,
            phase: Math.random() * Math.PI * 2,
            speed: 2.0 + Math.random() * 2.8,
            color: i % 4 === 0 ? '#ffffff' : (i % 2 === 0 ? '#f3d489' : '#dfb15b')
          });
        }

        // FUGUE LAYER 2: Micro-bubbles inside goblet bowl
        const BUBBLE_COUNT = 28;
        const bubbles = [];
        for (let i = 0; i < BUBBLE_COUNT; i++) {
          bubbles.push({
            x: 121.5 + (Math.random() - 0.5) * 60,
            y: 150 + Math.random() * 85,
            r: 0.8 + Math.random() * 1.5,
            speed: 0.35 + Math.random() * 0.65,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.35 + Math.random() * 0.55
          });
        }

        // Ambient golden dust motes
        const AMBIENT_COUNT = 34;
        const ambientParticles = [];
        for (let i = 0; i < AMBIENT_COUNT; i++) {
          ambientParticles.push({
            x: Math.random() * 243,
            y: Math.random() * 568,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.15 - Math.random() * 0.3,
            size: 0.8 + Math.random() * 1.8,
            alpha: 0.2 + Math.random() * 0.6,
            seed: Math.random() * 100
          });
        }

        window._triggerLivingLogoWarp = triggerUnsealBurst;

        window._resetLivingLogo = function() {
          isWarpBurst = false;
          burstParticles = [];
          targetTilt = { x: 0, y: 0, z: 0 };
          currentTilt = { x: 0, y: 0, z: 0 };
          if (triggerEl) {
            triggerEl.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
          }
          if (clefImgEl) {
            clefImgEl.style.filter = 'drop-shadow(0 0 28px rgba(223, 177, 91, 0.45)) drop-shadow(0 20px 42px rgba(0, 0, 0, 0.98))';
          }
          if (specularGlintEl) {
            specularGlintEl.style.opacity = '0';
          }
          calibrateLivingCanvas();
          if (!livingLoopId) {
            livingLoopId = requestAnimationFrame(renderLoop);
          }
        };

        // 5. Playground Micro-Interaction: Particle Reverse Contraction
        window._reverseLivingParticles = function() {
          for (let i = 0; i < ambientParticles.length; i++) {
            const ap = ambientParticles[i];
            const dx = 121.5 - ap.x;
            const dy = 284 - ap.y;
            const d = Math.hypot(dx, dy) || 1;
            ap.vx += (dx / d) * 0.75;
            ap.vy += (dy / d) * 0.75;
          }
          for (let i = 0; i < burstParticles.length; i++) {
            const bp = burstParticles[i];
            bp.vx *= -0.85;
            bp.vy *= -0.85;
          }
        };

        // Window & Pointer Event Listeners for 3D Tilt, Playground Toys & Heartbeat Bloom
        function onPointerMove(e) {
          const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
          const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);

          curMouseNorm.x = (clientX / window.innerWidth - 0.5) * 2;
          curMouseNorm.y = (clientY / window.innerHeight - 0.5) * 2;

          targetTilt.x = -curMouseNorm.y * 22;
          targetTilt.y = curMouseNorm.x * 22;

          lastInteractTime = performance.now();

          // Intuitive Affordance & Playground Micro-Interactions
          if (triggerEl) {
            const rect = triggerEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(clientX - cx, clientY - cy);
            const bloomEl = document.getElementById('heartbeat-bloom');
            const initViewEl = document.getElementById('initial-view');
            if (dist < 340) {
              triggerEl.classList.add('hover-approach');
              if (bloomEl) bloomEl.classList.add('hover-approach');
              if (initViewEl) initViewEl.classList.add('hover-approach');
            } else {
              triggerEl.classList.remove('hover-approach');
              if (bloomEl) bloomEl.classList.remove('hover-approach');
              if (initViewEl) initViewEl.classList.remove('hover-approach');
            }

            // PLAYGROUND 1: 와인잔 림 문지르기 (Glass Armonica Singing Bowl Swirl)
            const rimX = rect.left + rect.width * 0.5;
            const rimY = rect.top + rect.height * 0.15;
            const distToRim = Math.hypot(clientX - rimX, clientY - rimY);
            const rimRadius = rect.width * 0.35;
            if (distToRim >= rimRadius * 0.25 && distToRim <= rimRadius * 1.85) {
              const curAngle = Math.atan2(clientY - rimY, clientX - rimX);
              if (lastSwirlAngle !== null) {
                let dTheta = curAngle - lastSwirlAngle;
                while (dTheta > Math.PI) dTheta -= Math.PI * 2;
                while (dTheta < -Math.PI) dTheta += Math.PI * 2;
                if (Math.abs(dTheta) > 0.03 && Math.abs(dTheta) < 1.4) {
                  rimSwirlEnergy = Math.min(1.0, rimSwirlEnergy + Math.abs(dTheta) * 0.32);
                  lastSwirlTime = performance.now();
                  initWebAudio();
                }
              }
              lastSwirlAngle = curAngle;
            } else {
              lastSwirlAngle = null;
            }

            // PLAYGROUND 2: 보르도 와인 슬로싱 & 샴페인 기포 (Liquid Slosh Momentum & Effervescence)
            if (Math.abs(mouseVel.x) > 15) {
              fluidSloshVel += -mouseVel.x * 0.024;
              playChampagneFizz(Math.min(1.5, Math.abs(mouseVel.x) / 25));
              for (let k = 0; k < 2; k++) {
                bubbles.push({
                  x: 121.5 + (Math.random() - 0.5) * 55,
                  y: 215 + Math.random() * 20,
                  r: 0.6 + Math.random() * 1.5,
                  speed: 0.8 + Math.random() * 1.4,
                  phase: Math.random() * Math.PI * 2,
                  alpha: 0.85
                });
              }
              if (bubbles.length > 55) bubbles.splice(0, bubbles.length - 55);
            }

            // PLAYGROUND 4: 랜턴 각도 이스터에그 (Hidden 1880s Frankfurt Atelier Coordinates)
            const engravingEl = document.getElementById('secret-atelier-engraving');
            if (engravingEl) {
              const relX = (clientX - rect.left) / rect.width;
              const relY = (clientY - rect.top) / rect.height;
              const angleDeg = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
              const inEasterZone = (angleDeg >= 28 && angleDeg <= 78 && dist < 330) || (relX >= 0.52 && relX <= 0.92 && relY >= 0.62 && relY <= 0.96);
              if (inEasterZone) {
                if (!secretEngravingRevealed) {
                  secretEngravingRevealed = true;
                  playSecretEngravingChime();
                }
                engravingEl.classList.add('revealed');
              } else {
                secretEngravingRevealed = false;
                engravingEl.classList.remove('revealed');
              }
            }
          }
        }

        window.addEventListener('mousemove', onPointerMove, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });

        if (triggerEl) {
          triggerEl.addEventListener('mouseenter', () => {
            isHovered = true;
            targetTilt.z = 24;
            const bloomEl = document.getElementById('heartbeat-bloom');
            const initViewEl = document.getElementById('initial-view');
            if (bloomEl) bloomEl.classList.add('hover-approach');
            if (initViewEl) initViewEl.classList.add('hover-approach');
          });
          triggerEl.addEventListener('mouseleave', () => {
            isHovered = false;
            targetTilt.z = 0;
            triggerEl.classList.remove('hover-approach');
            const bloomEl = document.getElementById('heartbeat-bloom');
            const initViewEl = document.getElementById('initial-view');
            if (bloomEl) bloomEl.classList.remove('hover-approach');
            if (initViewEl) initViewEl.classList.remove('hover-approach');
          });
        }

        // Animation Loop
        function renderLoop(now) {
          const initViewEl = document.getElementById('initial-view');
          const isEvolved = initViewEl && initViewEl.classList.contains('evolved');
          if (isEvolved && (!isWarpBurst || burstParticles.length === 0)) {
            livingLoopId = null;
            return;
          }
          livingLoopId = requestAnimationFrame(renderLoop);

          const nowMs = performance.now();
          const dt = Math.min(0.1, (nowMs - lastFrameTime) / 1000.0);
          lastFrameTime = nowMs;

          // Progression silky tourbillon winding interpolation (heavy luxury inertia)
          if (!isLevelUpLocked) {
            scrollProgress += (targetProgress - scrollProgress) * 0.065;
            if (Math.abs(targetProgress - scrollProgress) < 0.0005) {
              scrollProgress = targetProgress;
            }
          }
          if (scrollProgress >= 0.99 && !isLevelUpDone) {
            triggerLevelUpShowcase();
          }
          updateScrollUI();

          // 3-Second Macro Cinematic Showcase Choreography
          let currentElapsed = 0;
          if (isLevelUpLocked) {
            const elapsed = performance.now() - showcaseStartTime;
            currentElapsed = elapsed;
            const stageEl = document.getElementById('symbol-trigger');
            const macroTag = document.getElementById('showcase-macro-tag');

            if (elapsed < 1000) {
              // Cut 1 (0.0s - 1.0s): Wine glass rim & liquid meniscus surface tension macro
              if (stageEl) {
                stageEl.classList.add('cinematic-cut-1');
                stageEl.classList.remove('cinematic-cut-2', 'cinematic-cut-3');
              }
              if (!showcaseCutsSeen.includes('cut-1')) showcaseCutsSeen.push('cut-1');
              if (macroTag) macroTag.textContent = '01 / BACCARAT CRYSTAL RIM & LIQUID MENISCUS';
            } else if (elapsed < 2000) {
              // Cut 2 (1.0s - 2.0s): 18k gold treble clef twist & engraving macro
              if (stageEl) {
                stageEl.classList.add('cinematic-cut-2');
                stageEl.classList.remove('cinematic-cut-1', 'cinematic-cut-3');
              }
              if (!showcaseCutsSeen.includes('cut-1')) showcaseCutsSeen.push('cut-1');
              if (!showcaseCutsSeen.includes('cut-2')) showcaseCutsSeen.push('cut-2');
              if (macroTag) macroTag.textContent = '02 / 18K CHAMPAGNE GOLD CLEF ENGRAVING';
            } else if (elapsed < 3000) {
              // Cut 3 (2.0s - 3.0s): Full 3D Baccarat crystal & gold masterpiece view
              if (stageEl) {
                stageEl.classList.add('cinematic-cut-3');
                stageEl.classList.remove('cinematic-cut-1', 'cinematic-cut-2');
              }
              if (!showcaseCutsSeen.includes('cut-1')) showcaseCutsSeen.push('cut-1');
              if (!showcaseCutsSeen.includes('cut-2')) showcaseCutsSeen.push('cut-2');
              if (!showcaseCutsSeen.includes('cut-3')) showcaseCutsSeen.push('cut-3');
              if (macroTag) macroTag.textContent = '03 / 3D MASTERPIECE REALIZED · LEVEL UP';
            } else {
              // Showcase Complete (>= 3.0s)
              isLevelUpLocked = false;
              if (stageEl) {
                stageEl.classList.remove('cinematic-cut-1', 'cinematic-cut-2');
                stageEl.classList.add('cinematic-cut-3', 'masterpiece-unlocked');
              }
              if (!showcaseCutsSeen.includes('cut-1')) showcaseCutsSeen.push('cut-1');
              if (!showcaseCutsSeen.includes('cut-2')) showcaseCutsSeen.push('cut-2');
              if (!showcaseCutsSeen.includes('cut-3')) showcaseCutsSeen.push('cut-3');
              const showcaseHud = document.getElementById('showcase-hud');
              if (showcaseHud) showcaseHud.classList.remove('visible');
              if (macroTag) macroTag.textContent = '03 / 3D MASTERPIECE REALIZED · LEVEL UP';

              const dock = document.getElementById('early-entry-dock');
              const earlyText = document.getElementById('early-entry-text');
              if (dock) dock.classList.add('visible', 'masterpiece-unlocked');
              if (earlyText) earlyText.textContent = 'ENTER ATELIER (MASTERPIECE REALIZED)';
            }
          }

          const timeSec = now / 1000.0;

          // 1. Smooth 3D Perspective Tilt Easing
          currentTilt.x += (targetTilt.x - currentTilt.x) * 0.08;
          currentTilt.y += (targetTilt.y - currentTilt.y) * 0.08;
          currentTilt.z += (targetTilt.z - currentTilt.z) * 0.08;

          mouseVel.x = (curMouseNorm.x - prevMouseNorm.x) * 55;
          mouseVel.y = (curMouseNorm.y - prevMouseNorm.y) * 55;
          prevMouseNorm.x = curMouseNorm.x;
          prevMouseNorm.y = curMouseNorm.y;

          if (triggerEl && initViewEl && !isEvolved) {
            const hasGoboFrame = document.getElementById('gobo-canvas-frame') && !triggerEl.classList.contains('stage-dissolved');
            if (hasGoboFrame) {
              triggerEl.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
            } else {
              const isCut1 = triggerEl.classList.contains('cinematic-cut-1');
              const isCut2 = triggerEl.classList.contains('cinematic-cut-2');
              if (!isCut1 && !isCut2) {
                const scale = triggerEl.classList.contains('cinematic-cut-3') ? 1.08 : 1.0;
                triggerEl.style.transform = `perspective(1200px) scale(${scale}) rotateX(${currentTilt.x.toFixed(2)}deg) rotateY(${currentTilt.y.toFixed(2)}deg) translateZ(${currentTilt.z.toFixed(2)}px)`;
              }
            }
            if (clefImgEl) {
              const shadowX = (-currentTilt.y * 1.4).toFixed(1);
              const shadowY = (currentTilt.x * 1.4 + 22).toFixed(1);
              clefImgEl.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 38px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 28px rgba(223, 177, 91, 0.45))`;
            }

            // 1.1 Multi-Angle 3D Sculpture Cross-Fading (진짜 다각도 3D 회전 체감)
            // Left view (-15°): mouse on left side (curMouseNorm.x < 0)
            // Right view (+15°): mouse on right side (curMouseNorm.x > 0)
            // Center view (0°): mouse near middle
            const lv0Center = document.getElementById('clef-lv0-img');
            const lv0Left = document.getElementById('clef-lv0-img-left');
            const lv0Right = document.getElementById('clef-lv0-img-right');

            if (scrollProgress > 0.001) {
              const mx = Math.max(-1.0, Math.min(1.0, curMouseNorm.x));
              // Calculate weights for left, center, right
              let wLeft = 0.0;
              let wRight = 0.0;
              let wCenter = 1.0;

              if (mx < -0.1) {
                // Lean into left angle view
                const t = Math.min(1.0, (-mx - 0.1) / 0.7);
                wLeft = t;
                wCenter = 1.0 - t;
              } else if (mx > 0.1) {
                // Lean into right angle view
                const t = Math.min(1.0, (mx - 0.1) / 0.7);
                wRight = t;
                wCenter = 1.0 - t;
              }

              if (lv0Center) lv0Center.style.opacity = wCenter.toFixed(3);
              if (lv0Left) lv0Left.style.opacity = wLeft.toFixed(3);
              if (lv0Right) lv0Right.style.opacity = wRight.toFixed(3);
            }
          }

          // 2. Specular Rim Caustics Slit Positioning & Dynamic Cut 3 Glint Sweep
          if (specularGlintEl) {
            if (isLevelUpLocked && currentElapsed >= 2000 && currentElapsed < 3000) {
              const cut3T = (currentElapsed - 2000) / 1000.0;
              const sweepX = 65 + Math.sin(cut3T * Math.PI) * 110;
              const sweepY = 55 + cut3T * 380;
              specularGlintEl.style.left = (sweepX / 243 * 100).toFixed(1) + '%';
              specularGlintEl.style.top = (sweepY / 568 * 100).toFixed(1) + '%';
              specularGlintEl.style.transform = `translate(-50%, -50%) rotate(${-25 + cut3T * 50}deg)`;
              const flareOpacity = Math.max(0.48, Math.sin(cut3T * Math.PI) * 0.95 + 0.1);
              specularGlintEl.style.opacity = flareOpacity.toFixed(2);
            } else {
              const cursorAngle = Math.atan2(curMouseNorm.y, curMouseNorm.x);
              const cursorDist = Math.hypot(curMouseNorm.x, curMouseNorm.y);
              const glintX = 121.5 + Math.cos(cursorAngle) * 94;
              const glintY = 56 + Math.sin(cursorAngle) * 12;
              specularGlintEl.style.left = (glintX / 243 * 100).toFixed(1) + '%';
              specularGlintEl.style.top = (glintY / 568 * 100).toFixed(1) + '%';
              const tangentDeg = (cursorAngle * 180 / Math.PI) + 90;
              specularGlintEl.style.transform = `translate(-50%, -50%) rotate(${tangentDeg.toFixed(1)}deg)`;
              const flareOpacity = Math.min(1.0, 0.25 + cursorDist * 0.75);
              specularGlintEl.style.opacity = flareOpacity.toFixed(2);
            }
          }

          // 3. Canvas Resizing & Viewport Calibration
          if (canvas.width === 0 || canvas.height === 0) {
            calibrateLivingCanvas();
          }

          // PLAYGROUND 1: Glass Armonica Swirl Energy Decay & Audio Swell Update
          if (performance.now() - lastSwirlTime > 110) {
            rimSwirlEnergy *= 0.92;
            if (rimSwirlEnergy < 0.001) rimSwirlEnergy = 0;
          }
          updateGlassArmonica(rimSwirlEnergy);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.scale(canvas.width / 243, canvas.height / 568);

          // Liquid Slosh physics
          const targetSlosh = Math.max(-0.55, Math.min(0.55, -mouseVel.x * 0.045 - currentTilt.y * 0.016));
          fluidSloshVel += (targetSlosh - fluidSloshAngle) * 0.12 - fluidSloshVel * 0.08;
          fluidSloshVel = Math.max(-0.35, Math.min(0.35, fluidSloshVel));
          fluidSloshAngle += fluidSloshVel;
          fluidSloshAngle = Math.max(-0.6, Math.min(0.6, fluidSloshAngle));

          // Natural S-curve meniscus points
          const meniscusWave = [
            [36, 122], [70, 144], [96, 154], [122, 150], [150, 138], [176, 126], [188, 116]
          ];

          // -------------------------------------------------------------
          // FUGUE LAYER 0: Chic Golden Micro-Glitter along Clef Contours
          // -------------------------------------------------------------
          ctx.save();
          for (let i = 0; i < glitterParticles.length; i++) {
            const gp = glitterParticles[i];
            const sparkle = Math.sin(timeSec * gp.speed + gp.phase);
            if (sparkle > 0.2) {
              const alpha = (sparkle - 0.2) / 0.8;
              ctx.beginPath();
              ctx.arc(gp.x, gp.y, gp.baseSize * (0.8 + alpha * 0.5), 0, Math.PI * 2);
              ctx.fillStyle = gp.color;
              ctx.globalAlpha = alpha * 0.85;
              ctx.shadowColor = '#f3d489';
              ctx.shadowBlur = 6;
              ctx.fill();
            }
          }
          ctx.restore();

          // -------------------------------------------------------------
          // PLAYGROUND 1: Glass Armonica Singing Bowl Resonance Ripples
          // Ethereal circular harmonic soundwaves expanding from wine glass rim
          // -------------------------------------------------------------
          if (rimSwirlEnergy > 0.015) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            for (let r = 0; r < 3; r++) {
              const ringRad = 26 + ((timeSec * 32 + r * 22) % 56);
              const ringAlpha = (1.0 - (ringRad - 26) / 56) * rimSwirlEnergy * 0.72;
              ctx.beginPath();
              ctx.ellipse(121.5, 75, ringRad * 1.35, ringRad * 0.42, 0, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(243, 212, 137, ${ringAlpha.toFixed(2)})`;
              ctx.lineWidth = 1.6;
              ctx.shadowColor = '#dfb15b';
              ctx.shadowBlur = 12;
              ctx.stroke();
            }
            ctx.restore();
          }

          // -------------------------------------------------------------
          // FUGUE LAYER 1: Baccarat Crystal Refraction Caustics
          // -------------------------------------------------------------
          if (scrollProgress > 0.02) {
            const crystalAlpha = Math.min(1.0, scrollProgress * 1.3);
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = crystalAlpha * 0.72;

            const sweepAngle = timeSec * 1.2 + currentTilt.y * 0.05;
            const rx = 121.5 + Math.cos(sweepAngle) * 42;
            const ry = 142 + Math.sin(sweepAngle) * 22;
            const crystalGrad = ctx.createLinearGradient(rx - 45, ry - 30, rx + 45, ry + 30);
            crystalGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            crystalGrad.addColorStop(0.35, 'rgba(220, 240, 255, 0.42)');
            crystalGrad.addColorStop(0.65, 'rgba(255, 235, 190, 0.52)');
            crystalGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = crystalGrad;
            ctx.beginPath();
            ctx.ellipse(121.5, 145, 88, 72, 0, 0, Math.PI * 2);
            ctx.fill();

            // Crystal facet prism rim stroke
            ctx.strokeStyle = `rgba(255, 245, 220, ${(crystalAlpha * 0.45).toFixed(2)})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(70, 75);
            ctx.quadraticCurveTo(121.5, 96 + Math.sin(timeSec) * 5, 173, 75);
            ctx.stroke();

            ctx.restore();
          }

          // -------------------------------------------------------------
          // FUGUE LAYER 2: Liquid Bordeaux Wine Fluid Wave & Meniscus Slosh
          // -------------------------------------------------------------
          if (scrollProgress > 0.05) {
            const wineAlpha = Math.min(1.0, (scrollProgress - 0.05) / 0.65);
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = wineAlpha;

            // Liquid caustics glow in the bowl
            const sweepX = 121.5 + Math.sin(timeSec * 1.8 + fluidSloshAngle * 2.5) * 35 + currentTilt.y * 1.5;
            const sweepY = 165 + Math.cos(timeSec * 1.4) * 15;
            const liquidCaustic = ctx.createRadialGradient(sweepX, sweepY, 4, sweepX, sweepY, 68);
            liquidCaustic.addColorStop(0, 'rgba(255, 215, 160, 0.42)');
            liquidCaustic.addColorStop(0.4, 'rgba(223, 80, 110, 0.25)');
            liquidCaustic.addColorStop(1, 'rgba(162, 28, 56, 0)');
            ctx.fillStyle = liquidCaustic;
            ctx.beginPath();
            ctx.arc(sweepX, sweepY, 68, 0, Math.PI * 2);
            ctx.fill();

            // Luminous surface tension line along natural meniscus curve
            ctx.beginPath();
            const waveOffset = Math.sin(timeSec * 3.2) * (1.2 + Math.abs(fluidSloshVel) * 8);
            for (let i = 0; i < meniscusWave.length; i++) {
              const pt = meniscusWave[i];
              const sloshY = (pt[0] - 121.5) * fluidSloshAngle * 0.4;
              const y = pt[1] + waveOffset * (1.0 - Math.abs(i - 3) / 3.0) + sloshY;
              if (i === 0) ctx.moveTo(pt[0], y);
              else ctx.lineTo(pt[0], y);
            }
            ctx.strokeStyle = `rgba(255, 225, 180, ${(0.55 * wineAlpha).toFixed(2)})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Ascending micro-bubbles
            for (let i = 0; i < bubbles.length; i++) {
              const b = bubbles[i];
              b.y -= b.speed;
              if (b.y < 125) {
                b.y = 230;
                b.x = 121.5 + (Math.random() - 0.5) * 60;
              }
              ctx.beginPath();
              ctx.arc(b.x + Math.sin(timeSec * 2.5 + b.phase) * 3.5, b.y, b.r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 215, 170, ${(b.alpha * wineAlpha).toFixed(2)})`;
              ctx.fill();
            }
            ctx.restore();
          }

          // -------------------------------------------------------------
          // FUGUE LAYER 3: 18k Champagne Gold Flowing Light Stream
          // (Enters smoothly as scrollProgress exceeds 0.12)
          // -------------------------------------------------------------
          if (scrollProgress > 0.12) {
            const goldStreamAlpha = Math.min(1.0, (scrollProgress - 0.12) / 0.55);
            ctx.save();
            const pathLen = CLEF_SKELETON_PATH.length;
            const numPulses = 3;
            for (let p = 0; p < numPulses; p++) {
              const headFrac = (timeSec * 0.16 + p / numPulses) % 1.0;
              const headIdx = Math.floor(headFrac * pathLen);
              const trailLen = 22;

              for (let t = 0; t < trailLen; t++) {
                const idx = (headIdx - t + pathLen) % pathLen;
                const nextIdx = (idx + 1) % pathLen;
                const ptA = CLEF_SKELETON_PATH[idx];
                const ptB = CLEF_SKELETON_PATH[nextIdx];

                const tFrac = 1.0 - t / trailLen;
                ctx.beginPath();
                ctx.moveTo(ptA[0], ptA[1]);
                ctx.lineTo(ptB[0], ptB[1]);
                ctx.strokeStyle = `rgba(243, 212, 137, ${(tFrac * 0.85 * goldStreamAlpha).toFixed(2)})`;
                ctx.lineWidth = 1.5 + tFrac * 2.8;
                ctx.shadowColor = '#dfb15b';
                ctx.shadowBlur = tFrac * 12 * goldStreamAlpha;
                ctx.stroke();
              }

              const headPt = CLEF_SKELETON_PATH[headIdx];
              ctx.beginPath();
              ctx.arc(headPt[0], headPt[1], 3.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 253, 246, ${goldStreamAlpha.toFixed(2)})`;
              ctx.shadowColor = '#f3d489';
              ctx.shadowBlur = 14 * goldStreamAlpha;
              ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.restore();
          }

          // -------------------------------------------------------------
          // CUT 3 DYNAMIC SPECULAR GLINT SWEEP BEAM ACROSS 3D SCULPTURE
          // -------------------------------------------------------------
          if (isLevelUpLocked && currentElapsed >= 2000 && currentElapsed < 3000) {
            const cut3T = (currentElapsed - 2000) / 1000.0;
            const sweepGrad = ctx.createLinearGradient(0, 568 * (cut3T - 0.2), 243, 568 * (cut3T + 0.2));
            sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            sweepGrad.addColorStop(0.5, `rgba(255, 248, 220, ${(0.82 * Math.sin(cut3T * Math.PI)).toFixed(2)})`);
            sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = sweepGrad;
            ctx.fillRect(0, 0, 243, 568);
            ctx.restore();
          }

          // Ambient Floating Golden Dust Motes
          for (let i = 0; i < ambientParticles.length; i++) {
            const ap = ambientParticles[i];
            ap.x += ap.vx + Math.sin(timeSec * 0.7 + ap.seed) * 0.18;
            ap.y += ap.vy;
            // Damping for time reverse impulse acceleration
            ap.vx = Math.max(-2.5, Math.min(2.5, ap.vx * 0.96));
            ap.vy += (-0.35 - ap.vy) * 0.04;
            if (ap.y < 10) ap.y = 555, ap.x = Math.random() * 243;
            if (ap.x < 10) ap.x = 230;
            if (ap.x > 235) ap.x = 15;

            const pulseAlpha = ap.alpha * (0.6 + Math.sin(timeSec * 2.0 + ap.seed) * 0.4);
            ctx.beginPath();
            ctx.arc(ap.x, ap.y, ap.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(223, 177, 91, ${pulseAlpha.toFixed(2)})`;
            ctx.fill();
          }

          // Unseal Radiant Gold Spark Particle Explosion
          if (isWarpBurst && burstParticles.length > 0) {
            for (let i = burstParticles.length - 1; i >= 0; i--) {
              const bp = burstParticles[i];
              bp.prevX = bp.x;
              bp.prevY = bp.y;
              bp.x += bp.vx;
              bp.y += bp.vy;
              bp.vx *= 1.03;
              bp.vy *= 1.03;
              bp.alpha -= bp.decay;

              if (bp.alpha <= 0) {
                burstParticles.splice(i, 1);
                continue;
              }

              ctx.beginPath();
              ctx.moveTo(bp.prevX, bp.prevY);
              ctx.lineTo(bp.x, bp.y);
              ctx.strokeStyle = bp.color;
              ctx.lineWidth = bp.size;
              ctx.globalAlpha = Math.max(0, bp.alpha);
              ctx.shadowColor = '#dfb15b';
              ctx.shadowBlur = 8;
              ctx.stroke();
            }
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
          }

          ctx.restore();
        }

        calibrateLivingCanvas();
        livingLoopId = requestAnimationFrame(renderLoop);
      }

      // 5. DOM EVENT BINDINGS & SCROLL PROGRESSION HOOKS
      const symbolTrigger = document.getElementById('symbol-trigger');
      const initialView = document.getElementById('initial-view');
      const muteToggle = document.getElementById('mute-toggle');
      const resetBtn = document.getElementById('reset-btn');
      const earlyEntryBtn = document.getElementById('early-entry-btn');

      // Wheel / Trackpad Scroll drives progression (0% -> 100%)
      function onWheelScroll(e) {
        if (evolutionActive) return;
        let delta = e.deltaY;

        if (typeof window.__getGoboStageState === 'function') {
          const gStage = window.__getGoboStageState().stage;
          if (gStage === 0 || gStage === 1) return;
        }
        if (!isUnsealed) {
          unsealSeed();
        }
        if (isLevelUpLocked) return;

        delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 25;
        else if (e.deltaMode === 2) delta *= window.innerHeight;

        // Heavy tourbillon winding friction (deliberate 30~60s buildup pacing)
        // Normalizes single wheel clicks (~100 delta) to ~0.009 - 0.012 progress step
        const sign = Math.sign(delta);
        const magnitude = Math.min(Math.abs(delta), 120);
        const wheelStep = sign * (magnitude / 100.0) * 0.011;

        // PLAYGROUND 5: 역방향 스크롤 되감기 (Time Reverse Acoustic & Particle Rewind)
        if (delta < 0) {
          playTimeReverseSound(magnitude / 100.0);
          if (typeof window._reverseLivingParticles === 'function') {
            window._reverseLivingParticles();
          }
        }

        targetProgress = Math.max(0.0, Math.min(1.0, targetProgress + wheelStep));
        lastInteractTime = performance.now();

        if (performance.now() - lastScrollChimeTime > 260 && delta > 0) {
          lastScrollChimeTime = performance.now();
          initWebAudio();
          playVerdiChime(0.25 + scrollProgress * 0.25, 0);
        }
      }
      window.addEventListener('wheel', onWheelScroll, { passive: true });

      // Touch scrolling for mobile viewports
      let touchStartY = null;
      window.addEventListener('touchstart', e => {
        if (e.touches && e.touches[0]) {
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchmove', e => {
        if (evolutionActive || touchStartY === null || !e.touches[0]) return;
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;

        if (typeof window.__getGoboStageState === 'function') {
          const gStage = window.__getGoboStageState().stage;
          if (gStage === 0 || gStage === 1) return;
        }
        touchStartY = currentY;

        if (!isUnsealed) {
          unsealSeed();
        }
        if (isLevelUpLocked) return;

        // PLAYGROUND 5: 역방향 스크롤 되감기 (Time Reverse Acoustic & Particle Rewind on touch drag)
        if (deltaY < 0) {
          playTimeReverseSound(Math.abs(deltaY) / 60.0);
          if (typeof window._reverseLivingParticles === 'function') {
            window._reverseLivingParticles();
          }
        }

        // Heavy friction touch dampening: ~0.0005 per px drag (~30-45s full build)
        const touchStep = Math.sign(deltaY) * Math.min(Math.abs(deltaY) * 0.0005, 0.015);
        targetProgress = Math.max(0.0, Math.min(1.0, targetProgress + touchStep));
        lastInteractTime = performance.now();
      }, { passive: true });

      window.addEventListener('touchend', () => { touchStartY = null; }, { passive: true });

      if (symbolTrigger) {
        symbolTrigger.addEventListener('click', e => {
          e.stopPropagation();
          const now = performance.now();
          lastInteractTime = now;

          if (typeof window.__handleGoboClick === 'function') {
            const handled = window.__handleGoboClick(e);
            if (handled) return;
          }

          if (!isUnsealed) {
            unsealSeed();
            return;
          }

          if (isLevelUpDone && !isLevelUpLocked) {
            startEvolutionSequence({ isMasterpieceEntry: true, level: 0 });
            return;
          }

          if (!isLevelUpDone) {
            targetProgress = Math.min(1.0, targetProgress + 0.04);
            initWebAudio();
            playVerdiChime(0.55 + scrollProgress * 0.25, 0);
            fluidSloshVel += 0.08;
          }
        });

        symbolTrigger.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            symbolTrigger.click();
          }
        });
      }

      if (earlyEntryBtn) {
        earlyEntryBtn.addEventListener('click', e => {
          e.stopPropagation();
          startEvolutionSequence({ isMasterpieceEntry: true, level: 0 });
        });
      }

      if (initialView) {
        initialView.addEventListener('click', e => {
          if (e.target.closest('#symbol-trigger') || e.target.closest('#early-entry-btn')) return;
          if (typeof window.__getGoboStageState === 'function') {
            const gStage = window.__getGoboStageState().stage;
            if (gStage === 0) {
              if (typeof window.__triggerGoboStart === 'function') {
                window.__triggerGoboStart();
              }
              return;
            } else if (gStage === 1) {
              return;
            }
          }
          lastInteractTime = performance.now();
          if (!isUnsealed) {
            unsealSeed();
          } else if (!isLevelUpLocked) {
            targetProgress = Math.min(1.0, targetProgress + 0.035);
            initWebAudio();
            playVerdiChime(0.45 + scrollProgress * 0.2, 0);
          }
        });
      }

      if (muteToggle) {
        muteToggle.addEventListener('click', e => {
          e.stopPropagation();
          toggleMute();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', e => {
          e.stopPropagation();
          resetEvolution();
        });
      }

      // Public / Programmatic API for automated Playwright verification & testing
      window.setScrollProgress = function(ratio) {
        targetProgress = Math.max(0.0, Math.min(1.0, Number(ratio)));
        scrollProgress = targetProgress;
        isUnsealed = true;
        const gauge = document.getElementById('swirl-gauge');
        if (gauge) gauge.classList.add('unsealed');
        updateScrollUI();
        if (scrollProgress >= 0.99 && !isLevelUpDone) {
          triggerLevelUpShowcase();
        }
      };
      window.advanceScrollProgress = function(delta) {
        window.setScrollProgress(targetProgress + Number(delta));
      };
      window.triggerLevelUpShowcase = triggerLevelUpShowcase;
      window.unsealSeed = unsealSeed;

      // Backward-compatible minigame APIs
      window.setMinigameProgress = function(seconds) {
        window.setScrollProgress(Number(seconds) / 180.0);
      };
      window.advanceMinigame = function(deltaSeconds) {
        window.advanceScrollProgress(Number(deltaSeconds) / 180.0);
      };
      window.triggerEarlyEntryDive = function() {
        startEvolutionSequence({ isMasterpieceEntry: true, level: 0 });
      };
      window.triggerVipDive = function() {
        window.setScrollProgress(1.0);
      };
      window.getMinigameState = function() {
        return {
          scrollProgress: scrollProgress,
          targetProgress: targetProgress,
          isUnsealed: isUnsealed,
          isLevelUpDone: isLevelUpDone,
          isLevelUpLocked: isLevelUpLocked,
          evolutionActive: evolutionActive,
          evolutionStage: evolutionStage,
          isMuted: isMuted,
          showcaseCutsSeen: [...showcaseCutsSeen]
        };
      };

      /* -------------------------------------------------------------
         JUST. SEAN. FLOWS 3-BEAT SIGNATURE 18K CHAMPAGNE GOLD CURSOR TRAIL
         Rhythmic sequence: Just. ➔ ♪ ➔ sean. ➔ ♫ ➔ flows ➔ ♬ ➔ (repeat)
         Emitted every 35~40px of travel with delicate upward swaying physics,
         ~0.9s dissolve, and ethereal 432Hz Cadenza crystal chimes.
         ------------------------------------------------------------- */
      const CURSOR_TRAIL_SEQUENCE = ['Just.', '♪', 'sean.', '♫', 'flows', '♬'];
      let cursorTrailIndex = 0;
      let cursorDistanceAccumulator = 0;
      const goldPalette = ['#f3d489', '#dfb15b', '#fff4d0', '#ffd885'];
      const stardustPalette = ['#ffffff', '#fdfaf6', '#f3d489', '#dfb15b'];

      class CursorNoteParticle {
        constructor(x, y, vx, vy, token) {
          this.x = x + (Math.random() - 0.5) * 6;
          this.y = y + (Math.random() - 0.5) * 6;
          this.token = token || CURSOR_TRAIL_SEQUENCE[cursorTrailIndex++ % CURSOR_TRAIL_SEQUENCE.length];
          this.text = this.token;
          this.glyph = this.token;
          this.isText = ['Just.', 'sean.', 'flows'].includes(this.token);

          if (this.isText) {
            // Elegant micro-typography (11~13px, Cinzel/Garamond/mono aesthetic matching musical notes)
            this.size = 12;
            this.font = "600 12px 'Cinzel', Didot, 'JetBrains Mono', serif";
            this.color = 'rgba(243, 212, 137, 0.95)';
          } else {
            // Musical note glyphs (18~23px)
            this.size = 18 + Math.random() * 5;
            this.font = `600 ${this.size}px 'Cinzel', 'Segoe UI Symbol', 'Apple Symbols', 'Noto Music', serif`;
            this.color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
          }

          // Clamp inherited cursor impulse
          const inheritVx = Math.max(-2.0, Math.min(2.0, (vx || 0) * 0.04));
          const inheritVy = Math.max(-1.6, Math.min(1.6, (vy || 0) * 0.04));

          // Floats upward with gentle swaying physics and dissolves over ~0.9s
          this.vx = (Math.random() - 0.5) * 0.6 + inheritVx;
          this.vy = -1.15 - Math.random() * 0.85 + inheritVy * 0.25;
          this.swayFreq = 2.4 + Math.random() * 2.6;
          this.swayAmp = 0.8 + Math.random() * 1.3;
          this.swayPhase = Math.random() * Math.PI * 2;

          this.rotation = (Math.random() - 0.5) * (this.isText ? 0.10 : 0.26);
          this.rotSpeed = (Math.random() - 0.5) * (this.isText ? 0.012 : 0.032);

          this.life = 0;
          this.maxLife = 0.85 + Math.random() * 0.12; // ~0.85s - 0.97s (avg ~0.9s)
          this.alpha = 1.0;
        }

        update(dt) {
          this.life += dt;
          if (this.life >= this.maxLife) return false;

          const progress = this.life / this.maxLife;
          if (progress < 0.08) {
            this.alpha = progress / 0.08;
          } else {
            this.alpha = Math.pow(1.0 - (progress - 0.08) / 0.92, 1.35);
          }

          this.x += (this.vx + Math.sin(this.life * this.swayFreq + this.swayPhase) * this.swayAmp) * (dt * 60);
          this.y += this.vy * (dt * 60);
          this.rotation += this.rotSpeed * (dt * 60);
          return true;
        }

        draw(ctx) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));

          // Exquisite 18k Champagne gold glow
          ctx.shadowColor = 'rgba(223, 177, 91, 0.85)';
          ctx.shadowBlur = this.isText ? 8 : 12;
          ctx.font = this.font;
          ctx.fillStyle = this.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.token, 0, 0);

          ctx.restore();
        }
      }

      class StardustParticle {
        constructor(x, y) {
          this.x = x + (Math.random() - 0.5) * 12;
          this.y = y + (Math.random() - 0.5) * 12;
          this.radius = 0.8 + Math.random() * 1.8;
          this.color = stardustPalette[Math.floor(Math.random() * stardustPalette.length)];

          const angle = Math.random() * Math.PI * 2;
          const speed = 0.4 + Math.random() * 1.6;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed - 0.7;

          this.life = 0;
          this.maxLife = 0.45 + Math.random() * 0.55; // 0.45s - 1.0s
          this.alpha = 1.0;
        }

        update(dt) {
          this.life += dt;
          if (this.life >= this.maxLife) return false;

          const progress = this.life / this.maxLife;
          this.alpha = Math.max(0, 1.0 - progress);
          // Organic air friction damping
          this.vx *= 0.96;
          this.vy *= 0.96;
          this.x += this.vx * (dt * 60);
          this.y += this.vy * (dt * 60);
          return true;
        }

        draw(ctx) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha * 0.95));
          ctx.shadowColor = 'rgba(243, 212, 137, 0.85)';
          ctx.shadowBlur = 6;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      let cursorCanvas = null;
      let cursorCtx = null;
      const cursorParticles = [];
      let lastCursorX = -1;
      let lastCursorY = -1;
      let lastCursorSpawnTime = 0;
      let lastCursorChimeTime = 0;
      let cursorAnimLoopId = null;
      let lastCursorFrameTime = performance.now();

      function initCursorEngine() {
        cursorCanvas = document.getElementById('cursor-notes-canvas');
        if (!cursorCanvas) return;
        cursorCtx = cursorCanvas.getContext('2d');

        // Enable cursor trail immediately from 0.0s per Sean Park directive
        window.__cursorEffectActive = true;
        window.__cursorAwakenStartTime = performance.now() - 3000;

        function resizeCursorCanvas() {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          cursorCanvas.width = window.innerWidth * dpr;
          cursorCanvas.height = window.innerHeight * dpr;
          if (cursorCtx) {
            cursorCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
        }
        window.addEventListener('resize', resizeCursorCanvas, { passive: true });
        resizeCursorCanvas();

        function spawnCursorTrail(x, y, vx, vy, dist, token) {
          // Spawn note or text particle in sequence (Just. -> ♪ -> sean. -> ♫ -> flows -> ♬)
          cursorParticles.push(new CursorNoteParticle(x, y, vx, vy, token));

          // Spawn 2-3 micro stardust particles
          const stardustCount = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < stardustCount; i++) {
            cursorParticles.push(new StardustParticle(x, y));
          }

          if (!cursorAnimLoopId) {
            lastCursorFrameTime = performance.now();
            cursorAnimLoopId = requestAnimationFrame(renderCursorParticles);
          }
        }

        function handlePointerMovement(clientX, clientY) {
          if (window.__cursorEffectActive === false) {
            lastCursorX = clientX;
            lastCursorY = clientY;
            return;
          }

          const now = performance.now();
          const currentCadence = 38.0; // Responsive 38px cadence
          const minThrottleInterval = 32.0; // Smooth 32ms interval

          if (now - lastCursorSpawnTime < minThrottleInterval) {
            return;
          }

          if (lastCursorX < 0 || lastCursorY < 0) {
            lastCursorX = clientX;
            lastCursorY = clientY;
            lastCursorSpawnTime = now;
            return;
          }

          const dx = clientX - lastCursorX;
          const dy = clientY - lastCursorY;
          const dist = Math.hypot(dx, dy);

          cursorDistanceAccumulator += dist;

          if (cursorDistanceAccumulator >= currentCadence) {
            const steps = Math.min(3, Math.floor(cursorDistanceAccumulator / currentCadence));
            cursorDistanceAccumulator %= currentCadence;

            const vx = dx / Math.max(1, (now - lastCursorSpawnTime) * 0.05);
            const vy = dy / Math.max(1, (now - lastCursorSpawnTime) * 0.05);

            for (let s = 1; s <= steps; s++) {
              const frac = s / steps;
              const px = lastCursorX + dx * frac;
              const py = lastCursorY + dy * frac;
              const nextToken = CURSOR_TRAIL_SEQUENCE[cursorTrailIndex % CURSOR_TRAIL_SEQUENCE.length];
              cursorTrailIndex++;
              spawnCursorTrail(px, py, vx, vy, dist, nextToken);
            }

            lastCursorX = clientX;
            lastCursorY = clientY;
            lastCursorSpawnTime = now;
          }
        }

        window.addEventListener('pointermove', e => {
          handlePointerMovement(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener('touchmove', e => {
          if (e.touches && e.touches[0]) {
            handlePointerMovement(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: true });

        window.addEventListener('pointerleave', () => {
          lastCursorX = -1;
          lastCursorY = -1;
        }, { passive: true });

        window.addEventListener('blur', () => {
          lastCursorX = -1;
          lastCursorY = -1;
        }, { passive: true });

        function renderCursorParticles(now) {
          const dt = Math.min(0.2, (now - lastCursorFrameTime) / 1000.0);
          lastCursorFrameTime = now;

          cursorCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

          for (let i = cursorParticles.length - 1; i >= 0; i--) {
            const p = cursorParticles[i];
            const alive = p.update(dt);
            if (!alive) {
              cursorParticles.splice(i, 1);
            } else {
              p.draw(cursorCtx);
            }
          }

          if (cursorParticles.length > 0) {
            cursorAnimLoopId = requestAnimationFrame(renderCursorParticles);
          } else {
            cursorAnimLoopId = null;
          }
        }

        // Programmatic API for automated Playwright verification
        window.__spawnCursorNote = function(x, y, token) {
          const px = x !== undefined ? x : window.innerWidth / 2;
          const py = y !== undefined ? y : window.innerHeight / 2;
          const assignedToken = token || CURSOR_TRAIL_SEQUENCE[cursorTrailIndex++ % CURSOR_TRAIL_SEQUENCE.length];
          spawnCursorTrail(px, py, 0, -1, 38, assignedToken);
          return cursorParticles.length;
        };
        window.__getCursorParticleCount = function() {
          return cursorParticles.length;
        };
        window.__getCursorParticles = function() {
          return cursorParticles.filter(p => p.token).map(p => ({
            token: p.token,
            text: p.text || p.token,
            isText: p.isText,
            x: p.x,
            y: p.y,
            alpha: p.alpha
          }));
        };

        // Playground 5-toy test and verification hooks
        window.__getPlaygroundState = function() {
          return {
            rimSwirlEnergy: rimSwirlEnergy,
            isSwirlingRim: rimSwirlEnergy > 0.05,
            fluidSloshAngle: fluidSloshAngle,
            fluidSloshVel: fluidSloshVel,
            secretEngravingRevealed: secretEngravingRevealed,
            lastPlayedPentatonicIdx: lastPlayedPentatonicIdx,
            lastPentatonicFreq: lastPlayedPentatonicIdx >= 0 ? PENTATONIC_432[lastPlayedPentatonicIdx] : null
          };
        };
        window.__triggerRimSwirl = function(energy) {
          rimSwirlEnergy = energy || 0.8;
          lastSwirlTime = performance.now();
          updateGlassArmonica(rimSwirlEnergy);
        };
        window.__triggerShakeEffervescence = function() {
          fluidSloshVel += 0.35;
          playChampagneFizz(1.2);
        };
        window.__revealSecretEngraving = function(reveal) {
          const engravingEl = document.getElementById('secret-atelier-engraving');
          secretEngravingRevealed = !!reveal;
          if (engravingEl) {
            if (reveal) engravingEl.classList.add('revealed');
            else engravingEl.classList.remove('revealed');
          }
          if (reveal) playSecretEngravingChime();
        };
      }

      // ======================================================================
      // 2026 DUAL-SIDED 3D GERMAN FLOATER FRAME & ALIBI 432Hz ENGINE
      // 2D Legal Assembly Metaphor (Am->C->F->D) -> 45mm 3D Awakening
      // ======================================================================
      function initDualSidedFloaterFrameEngine() {
        const container = document.getElementById('floater-frame-container');
        const stage = document.getElementById('floater-frame-stage');
        const frame3d = document.getElementById('floater-frame-3d');
        const statusText = document.getElementById('status-phase-text');
        const statusDot = document.getElementById('status-phase-dot');
        const promptText = document.getElementById('prompt-text');

        // Drafting edges
        const edgeTop = document.getElementById('draft-edge-top');
        const edgeRight = document.getElementById('draft-edge-right');
        const edgeBottom = document.getElementById('draft-edge-bottom');
        const edgeLeft = document.getElementById('draft-edge-left');

        // Card controls
        const playBtn = document.getElementById('inv-play-btn');
        const playText = document.getElementById('inv-play-text');
        const playIcon = document.getElementById('inv-play-icon');
        const rsvpBtn = document.getElementById('inv-rsvp-btn');
        const rsvpText = document.getElementById('inv-rsvp-text');
        const flipBtn = document.getElementById('inv-flip-btn');
        const glassOverlay = document.querySelector('.museum-glass-overlay');

        if (!container || !stage || !frame3d) return;

        let is3DAwakened = false;
        let isAssembling = false;
        let isDragging = false;
        let startX = 0, startY = 0;
        let rotX = 0, rotY = 0;
        let targetRotX = 0, targetRotY = 0;
        let velX = 0, velY = 0;
        let lastMoveTime = 0;
        let isAlibiPlaying = false;
        let alibiLoopTimer = null;
        let isRsvpConfirmed = false;

        // Ensure WebAudio is unlocked
        function ensureAudio() {
          initWebAudio();
          if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
          }
        }

        // Synthesize Acoustic Guitar Pluck / String Note (Karplus-Strong Simulation)
        function pluckAcousticString(freq, time, duration, gainLevel, isViolin) {
          if (!audioCtx || isMuted) return;
          try {
            const now = time || audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            if (isViolin) {
              // Warm singing violin lead with natural 6.18Hz vibrato
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(freq, now);

              // LFO Vibrato
              const lfo = audioCtx.createOscillator();
              const lfoGain = audioCtx.createGain();
              lfo.frequency.setValueAtTime(6.18, now);
              lfoGain.gain.setValueAtTime(freq * 0.018, now); // ~30 cents vibrato
              lfo.connect(lfoGain);
              lfoGain.connect(osc.frequency);
              lfo.start(now);
              lfo.stop(now + duration + 0.1);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(3200, now);

              gain.gain.setValueAtTime(0.0001, now);
              gain.gain.linearRampToValueAtTime(gainLevel || 0.055, now + 0.08);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            } else {
              // Warm indie acoustic guitar pluck
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(2400, now);
              filter.frequency.exponentialRampToValueAtTime(650, now + duration * 0.7);

              gain.gain.setValueAtTime(0.0001, now);
              gain.gain.linearRampToValueAtTime(gainLevel || 0.065, now + 0.008);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            }

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + duration + 0.05);
          } catch (_) {}
        }

        // Play 4-Chord Acoustic Arpeggio (Am -> C -> F -> D)
        const ALIBI_CHORDS = [
          { name: 'A MINOR', desc: '01 // CHARTER DRAFTING (Am)', notes: [108.0, 162.0, 216.0, 259.2] }, // Am
          { name: 'C MAJOR', desc: '02 // SOUND ARCHITECTURE (C)', notes: [129.6, 194.4, 259.2, 324.0] }, // C
          { name: 'F MAJOR', desc: '03 // PRIVATE VAULT SEAL (F)', notes: [86.4, 129.6, 172.8, 216.0] },  // F
          { name: 'D DORIAN', desc: '04 // JSF COLLECTIVE UG · 3D SEALED', notes: [144.0, 216.0, 288.0, 364.5, 432.0] } // D + F# + A4 Violin
        ];

        function playChordArpeggio(chordIdx) {
          ensureAudio();
          const chord = ALIBI_CHORDS[chordIdx];
          if (!chord) return;
          const now = audioCtx ? audioCtx.currentTime : 0;
          chord.notes.forEach((freq, nIdx) => {
            const isLeadViolin = chordIdx === 3 && nIdx === chord.notes.length - 1;
            const t = now + nIdx * 0.18;
            const dur = isLeadViolin ? 1.6 : 0.85;
            pluckAcousticString(freq, t, dur, isLeadViolin ? 0.075 : 0.055, isLeadViolin);
          });
        }

        // Trigger 2D Legal Assembly -> 3D Awakening Sequence
        function triggerCorporateAssemblySequence() {
          if (isAssembling || is3DAwakened) return;
          isAssembling = true;
          ensureAudio();

          frame3d.classList.add('drafting-active');

          // Bar 1: Am (Top Edge)
          statusText.textContent = ALIBI_CHORDS[0].desc;
          if (statusDot) statusDot.style.background = '#dfb15b';
          playChordArpeggio(0);
          if (edgeTop) edgeTop.classList.add('sealed');

          // Bar 2: C (Right Edge)
          setTimeout(() => {
            statusText.textContent = ALIBI_CHORDS[1].desc;
            playChordArpeggio(1);
            if (edgeRight) edgeRight.classList.add('sealed');
          }, 1050);

          // Bar 3: F (Bottom Edge)
          setTimeout(() => {
            statusText.textContent = ALIBI_CHORDS[2].desc;
            playChordArpeggio(2);
            if (edgeBottom) edgeBottom.classList.add('sealed');
          }, 2100);

          // Bar 4: D Dorian (Left Edge & 4 Corners Meet)
          setTimeout(() => {
            statusText.textContent = ALIBI_CHORDS[3].desc;
            playChordArpeggio(3);
            if (edgeLeft) edgeLeft.classList.add('sealed');
          }, 3150);

          // 3D Dimensional Awakening Moment
          setTimeout(() => {
            is3DAwakened = true;
            isAssembling = false;
            frame3d.classList.add('awakened-3d');

            statusText.textContent = '✦ 3D ARTIFACT AWAKENED · 45mm DEPTH';
            if (statusDot) {
              statusDot.style.background = '#10b981';
              statusDot.style.boxShadow = '0 0 10px #10b981';
            }
            if (promptText) {
              promptText.textContent = 'DRAG MOUSE OR TOUCH TO ROTATE 360° · SECRET BACKSIDE UNSEALED';
            }

            // Inviting 18-degree tilt to reveal 3D depth to user
            targetRotX = 8;
            targetRotY = -22;

            // Champagne fizz sparkle
            playChampagneFizz(1.4);
          }, 4300);
        }

        // Click frame to start sequence
        stage.addEventListener('click', (e) => {
          // If clicked inside interactive card buttons, don't re-trigger assembly
          if (e.target.closest('.speakeasy-invitation-card')) return;
          if (!is3DAwakened && !isAssembling) {
            triggerCorporateAssemblySequence();
          }
        });

        // 3D Pointer Drag & Orbit Controls
        function onPointerDown(e) {
          if (!is3DAwakened) return;
          if (e.target.closest('button')) return; // Allow buttons to handle their own clicks
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          lastMoveTime = performance.now();
          velX = 0;
          velY = 0;
          stage.classList.add('grabbing');
        }

        function onPointerMove(e) {
          if (!isDragging || !is3DAwakened) return;
          const now = performance.now();
          const dt = Math.max(1, now - lastMoveTime);
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;

          startX = e.clientX;
          startY = e.clientY;
          lastMoveTime = now;

          velY = (dx / dt) * 16;
          velX = (dy / dt) * 16;

          targetRotY += dx * 0.55;
          targetRotX = Math.max(-55, Math.min(55, targetRotX - dy * 0.45));
        }

        function onPointerUp() {
          if (!isDragging) return;
          isDragging = false;
          stage.classList.remove('grabbing');
        }

        stage.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        // Smooth Physics & Render Loop
        function render3DFrame() {
          if (is3DAwakened) {
            if (!isDragging) {
              targetRotY += velY * 0.12;
              targetRotX += velX * 0.12;
              velY *= 0.91;
              velX *= 0.91;
              targetRotX = Math.max(-55, Math.min(55, targetRotX));
            }

            rotX += (targetRotX - rotX) * 0.14;
            rotY += (targetRotY - rotY) * 0.14;

            frame3d.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

            // Orientational Face Culling & Pointer Event Isolation
            const normRotY = ((rotY % 360) + 360) % 360;
            if (normRotY > 90 && normRotY < 270) {
              frame3d.classList.add('facing-back');
            } else {
              frame3d.classList.remove('facing-back');
            }

            // Museum glass specular glare shifts with angle
            if (glassOverlay) {
              const glareAngle = (rotY % 360);
              const glareOpacity = Math.max(0.15, Math.min(0.85, 0.45 + Math.sin(glareAngle * Math.PI / 180) * 0.4));
              glassOverlay.style.opacity = glareOpacity.toFixed(2);
            }
          }
          requestAnimationFrame(render3DFrame);
        }
        requestAnimationFrame(render3DFrame);

        // ====================================================================
        // BACKSIDE CARD: DIRECT 3D SURFACE INTERACTIVE CONTROLS
        // ====================================================================

        // Full Track Continuous Groove Synthesizer (A Twelve-Minute Alibi)
        let grooveStep = 0;
        function stepAlibiGroove() {
          if (!isAlibiPlaying) return;
          const chordIdx = grooveStep % ALIBI_CHORDS.length;
          playChordArpeggio(chordIdx);
          grooveStep++;
          alibiLoopTimer = setTimeout(stepAlibiGroove, 1050);
        }

        if (playBtn) {
          playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ensureAudio();
            isAlibiPlaying = !isAlibiPlaying;
            if (isAlibiPlaying) {
              playBtn.classList.add('playing');
              if (playText) playText.textContent = 'PAUSE ALIBI';
              if (playIcon) playIcon.textContent = '❚❚';
              grooveStep = 0;
              stepAlibiGroove();
            } else {
              playBtn.classList.remove('playing');
              if (playText) playText.textContent = 'PLAY ALIBI';
              if (playIcon) playIcon.textContent = '▶';
              if (alibiLoopTimer) clearTimeout(alibiLoopTimer);
            }
          });
        }

        if (rsvpBtn) {
          rsvpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ensureAudio();
            isRsvpConfirmed = !isRsvpConfirmed;
            if (isRsvpConfirmed) {
              rsvpBtn.classList.add('confirmed');
              if (rsvpText) rsvpText.textContent = '✓ GUEST #042 CONFIRMED';
              playChampagneFizz(1.6);
            } else {
              rsvpBtn.classList.remove('confirmed');
              if (rsvpText) rsvpText.textContent = 'RSVP : ATTEND';
            }
          });
        }

        if (flipBtn) {
          flipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Smoothly rotate back to front view (0 deg)
            targetRotX = 0;
            targetRotY = 0;
            velX = 0;
            velY = 0;
          });
        }

        // Front Canvas Dual-Photo Toggle [ 01 ATELIER ✦ 02 SALON ]
        const segAtelier = document.getElementById('seg-atelier');
        const segSalon = document.getElementById('seg-salon');
        const imgAtelier = document.getElementById('portrait-img-atelier');
        const imgSalon = document.getElementById('portrait-img-salon');
        let currentPhoto = 'atelier';

        function setCanvasPhoto(mode) {
          ensureAudio();
          playChampagneFizz(0.7);
          currentPhoto = mode;
          if (mode === 'salon') {
            if (segAtelier) { segAtelier.classList.remove('active'); segAtelier.setAttribute('aria-selected', 'false'); }
            if (segSalon) { segSalon.classList.add('active'); segSalon.setAttribute('aria-selected', 'true'); }
            if (imgAtelier) imgAtelier.classList.remove('active-layer');
            if (imgSalon) imgSalon.classList.add('active-layer');
          } else {
            if (segSalon) { segSalon.classList.remove('active'); segSalon.setAttribute('aria-selected', 'false'); }
            if (segAtelier) { segAtelier.classList.add('active'); segAtelier.setAttribute('aria-selected', 'true'); }
            if (imgSalon) imgSalon.classList.remove('active-layer');
            if (imgAtelier) imgAtelier.classList.add('active-layer');
          }
        }

        if (segAtelier) {
          segAtelier.addEventListener('click', (e) => {
            e.stopPropagation();
            setCanvasPhoto('atelier');
          });
        }

        if (segSalon) {
          segSalon.addEventListener('click', (e) => {
            e.stopPropagation();
            setCanvasPhoto('salon');
          });
        }

        // Programmatic hooks for testing / Playwright verification
        window.__awaken3DFrame = function() {
          triggerCorporateAssemblySequence();
        };
        window.__setCanvasPhoto = setCanvasPhoto;
        window.__getFrameState = function() {
          return {
            is3DAwakened,
            isAssembling,
            rotX,
            rotY,
            isAlibiPlaying,
            isRsvpConfirmed,
            currentPhoto
          };
        };
        window.__rotateFrameTo = function(rx, ry) {
          targetRotX = rx;
          targetRotY = ry;
        };
      }

      // ======================================================================
      // LIVING GOBOS OPTICAL CANVAS STAGE ENGINE (STAGE 0 ➔ 1 ➔ 2 BLUEPRINT)
      // Real 25W LED optical warmth + micro-dust motes + 10% 432Hz sound check
      // + optical stencil volume gauge + auto 4.5s countdown & symbol materialization
      // ======================================================================
      // LIVING GOBOS OPTICAL CANVAS STAGE ENGINE (5-STEP CINEMATIC ARCHITECTURE)
      // Step 0: Pure Void Slate (0.0s~0.8s, 0% Tilt, locked flat, pitch black void)
      // Step 1: 3-Second Vintage Warm-up Flicker (0.8s~3.8s, analog relay switch click)
      // Step 2: Optical Stencil Symbol Materialization (3.8s~5.3s, 1.5s dissolve)
      // Step 3: 2.5D Double Parallax Porthole (0x Frame, 0.4x Light, 1.0x Symbol)
      // Step 4: On Click 10% Whisper Sound, 30% Wine Sloshing, Cursor Trail
      // ======================================================================
      function initGoboLivingOpticalStage() {
        const goboFrame = document.getElementById('gobo-canvas-frame');
        const goboLightRig = document.getElementById('gobo-light-rig');
        const goboSymbolRig = document.getElementById('gobo-symbol-rig');
        const goboCleanLayer = document.getElementById('gobo-layer-clean');
        const goboSymbolLayer = document.getElementById('gobo-layer-symbol');
        const goboWineCanvas = document.getElementById('gobo-wine-canvas');
        const goboDustCanvas = document.getElementById('gobo-dust-canvas');
        const goboStartTrigger = document.getElementById('gobo-start-trigger');
        const goboCalibrationGauge = document.getElementById('gobo-calibration-gauge');
        const goboCountdownFill = document.getElementById('gobo-countdown-fill');
        const goboNextAffordance = document.getElementById('gobo-next-affordance');
        const goboAudio = document.getElementById('gobo-calibration-audio');
        const floaterContainer = document.getElementById('floater-frame-container');
        const symbolStage = document.getElementById('symbol-stage-3d');
        const symbolTrigger = document.getElementById('symbol-trigger');

        let cinematicStep = 0; // 0 = Void Slate, 1 = Vintage Flicker Warmup, 2 = Symbol Materialize, 3 = Parallax Continuous, 4 = Sound/Wine Fill
        let currentGoboStage = 0; // 0 = idle/Stage 0, 1 = calibration/Stage 1, 2 = materialized/Stage 2, 3 = unsealed
        let step1Timer = null;
        let step2Timer = null;
        let step3Timer = null;
        let step4Timer = null;
        let step5Timer = null;
        let step6Timer = null;
        let goboCountdownTimer = null;
        let goboDustParticles = [];
        let dustAnimId = null;
        let wineAnimId = null;
        let targetShift = { x: 0, y: 0 };
        let curShift = { x: 0, y: 0 };
        let targetTilt = { x: 0, y: 0 };
        let curTilt = { x: 0, y: 0 };

        // Architectural Monolith 3D Worm's-Eye Camera State (Pulled back for elegant viewing distance)
        let isMonolithPushedIn = false;
        let isMonolithHolding = false;
        let monolithHoldTimer = null;
        const BASE_MONOLITH_ROTX = 18.0;
        const BASE_MONOLITH_ROTY = -24.0;
        const BASE_MONOLITH_ROTZ = 2.0;
        const BASE_MONOLITH_SCALE = 0.82;
        const BASE_MONOLITH_TZ = -110.0;

        // Wine Glass, Caustics & Sloshing Engine State
        let wineCurrentLevel = 0.0;    // 0.0 in Stage 0, reaches 0.30 in Stage 1
        const wineTargetLevel = 0.30;  // 30% volume fill level
        let isWineFilling = false;
        let wineFillStartTime = 0;
        let wineSloshAngle = 0.0;
        let wineSloshVel = 0.0;
        let wineLastPointerX = -1;
        let wineLastPointerY = -1;
        let wineLastPointerTime = performance.now();
        let winePointerVelX = 0.0;
        let wineLastGyroGamma = null;
        let engravingAlpha = 0.0;
        let causticBloomAlpha = 0.0;
        const wineBubbles = [];
        let wineTears = [];
        let wineWallFilm = { left: 0.0, right: 0.0 };
        let spawnWineTears = null;
        let triggerCenterSparkBurst = null;

        // Midnight Nebula & Stardust Cosmic Porthole Compatibility State
        let nebulaParticles = new Array(216);
        let nebulaShockwaves = [];
        let switchNebulaPalette = null;
        let vortexSpinVel = 0.0;
        let currentPaletteVersion = 'v1';
        let audioPulse = 0.0;
        let lastBeatIndex = -1;

        // Ensure volume is set to 40% of previous (0.10 * 0.40 = 0.04) per Sean Park directive
        const CALIBRATION_AUDIO_VOLUME = 0.04;
        if (goboAudio) {
          goboAudio.volume = CALIBRATION_AUDIO_VOLUME;
        }

        // Initialize 42 ascending champagne gold micro-bubbles and stardust particles
        for (let i = 0; i < 42; i++) {
          wineBubbles.push({
            xRel: (Math.random() - 0.5) * 0.76,
            yNorm: Math.random(),
            r: 0.8 + Math.random() * 1.5,
            speed: 0.16 + Math.random() * 0.35,
            wobbleSpeed: 0.002 + Math.random() * 0.004,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.40 + Math.random() * 0.55,
            isStardust: i % 3 === 0
          });
        }

        // Web Audio Synthesizer: Blocked per Sean Park directive ("소리든 효과든 다 막고 개발중 카드로 바꿔봐")
        function playVintageRelayClick() {
          return;
        }

        // Helper: Block all sounds, effects, and tilts, and show the flat Under Development card
        let underDevAutoTimer = null;
        function activateUnderDevCard() {
          // Do NOT instant-skip intro curtain, gobo warmup, or border painting on click, nor flip on release of a 2x hold!
          if (suppressNextClickAfterHold || isHoldingFastForward || !window.__noirCurtainUnveiled || !borderPaintCompleted || (goboFrame && !goboFrame.classList.contains('frame-illuminated'))) {
            return;
          }

          if (underDevAutoTimer) {
            clearTimeout(underDevAutoTimer);
            underDevAutoTimer = null;
          }
          if (step2Timer) clearTimeout(step2Timer);
          if (step3Timer) clearTimeout(step3Timer);
          if (step4Timer) clearTimeout(step4Timer);
          if (monolithHoldTimer) clearTimeout(monolithHoldTimer);

          // 1. Strictly lock all 3D tilts to 0deg (Never tilt!)
          isMonolithPushedIn = false;
          isMonolithHolding = false;
          targetTilt.x = 0;
          targetTilt.y = 0;
          curTilt.x = 0;
          curTilt.y = 0;
          targetShift.x = 0;
          targetShift.y = 0;
          curShift.x = 0;
          curShift.y = 0;

          if (goboSymbolRig) {
            goboSymbolRig.classList.remove('item-unlocking', 'calibration-moody');
            goboSymbolRig.classList.add('materialized');
            goboSymbolRig.style.transform = 'perspective(1200px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)';
          }
          if (goboLightRig) {
            goboLightRig.classList.remove('flicker-warmup');
            goboLightRig.classList.add('stabilized');
          }

          if (goboFrame) {
            goboFrame.classList.remove('worm-eye-monolith');
            goboFrame.classList.add('frame-illuminated');
            goboFrame.style.transform = '';
          }

          // 2. Silence and block all audio & effects
          if (goboAudio) {
            try {
              goboAudio.pause();
              goboAudio.currentTime = 0;
              goboAudio.muted = true;
            } catch (_) {}
          }
          if (typeof EVOLUTION_SFX !== 'undefined') {
            try {
              if (EVOLUTION_SFX.stage2) { EVOLUTION_SFX.stage2.pause(); EVOLUTION_SFX.stage2.muted = true; }
              if (EVOLUTION_SFX.stage3) { EVOLUTION_SFX.stage3.pause(); EVOLUTION_SFX.stage3.muted = true; }
            } catch (_) {}
          }
          isWineFilling = false;
          causticBloomAlpha = 0;
          window.__cursorEffectActive = true;

          const shutter = document.getElementById('sound-shutter-container');
          if (shutter) {
            shutter.classList.remove('active', 'pulsing');
            shutter.classList.add('absorbed');
          }
          const rimEngraving = document.getElementById('rim-engraving');
          if (rimEngraving) {
            rimEngraving.classList.remove('ignited');
          }
          const gyroCal = document.getElementById('spatial-gyro-calibrator');
          if (gyroCal) {
            gyroCal.classList.remove('activated', 'calibrating');
          }

          // 3. Flip 180deg in 3D to reveal the Matte Obsidian VIP Salon Party Invitation Pass
          clearAlternationTimers();
          currentGoboStage = 1;
          cinematicStep = 4;
          if (goboFrame) {
            goboFrame.classList.add('card-flipped-out');
            if (typeof window.__stopDocTimelineEngine === 'function') window.__stopDocTimelineEngine();
          }
          document.body.classList.add('vip-pass-flipped');
          const underDevCard = document.getElementById('under-dev-card-overlay');
          if (window.__webpageZoomTimer) {
            clearTimeout(window.__webpageZoomTimer);
            window.__webpageZoomTimer = null;
          }
          if (underDevCard) {
            underDevCard.classList.remove('webpage-zoomed');
            underDevCard.classList.add('active');
            // Flip completes in 850ms -> Pause for 300ms (0.3s) at the 3D tilted frame -> Zoom in to 1.0x full webpage at 1150ms!
            window.__webpageZoomTimer = setTimeout(() => {
              if (underDevCard.classList.contains('active')) {
                underDevCard.classList.add('webpage-zoomed');
              }
            }, 1150);
          }
          window.__underDevCardActive = true;
        }

        let alternationTimers = [];
        let designerRafId = null;
        window.__activeDesignerFx = 'trilogy';

        function clearAlternationTimers() {
          while (alternationTimers.length > 0) {
            clearTimeout(alternationTimers.pop());
          }
          if (designerRafId) {
            cancelAnimationFrame(designerRafId);
            designerRafId = null;
          }
        }

        function resetDesignerSymbolStyles() {
          const emblemV1 = document.getElementById('emblem-img-v1');
          const ivoryLogo = document.getElementById('digital-logo-overlay');
          const meniscusLine = document.getElementById('designer-meniscus-line');
          if (emblemV1) {
            emblemV1.style.transition = 'opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1), filter 0.36s ease, transform 0.36s ease';
            emblemV1.style.clipPath = 'none';
            emblemV1.style.webkitClipPath = 'none';
            emblemV1.style.maskImage = 'none';
            emblemV1.style.webkitMaskImage = 'none';
            emblemV1.style.transform = 'translateX(-50%) scale(1)';
            emblemV1.style.filter = 'none';
            emblemV1.style.mixBlendMode = 'normal';
          }
          if (ivoryLogo) {
            ivoryLogo.style.transition = 'opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1), filter 0.36s ease, transform 0.36s ease';
            ivoryLogo.style.clipPath = 'none';
            ivoryLogo.style.webkitClipPath = 'none';
            ivoryLogo.style.maskImage = 'none';
            ivoryLogo.style.webkitMaskImage = 'none';
            ivoryLogo.style.transform = 'translateX(-50%) scale(1.065, 1)';
            ivoryLogo.style.filter = 'none';
            ivoryLogo.style.mixBlendMode = 'normal';
          }
          if (meniscusLine) {
            meniscusLine.style.opacity = '0';
          }
        }

        function setEmblemAndIvoryState(emblemOpacity, ivoryOpacity, phaseName) {
          const emblemV1 = document.getElementById('emblem-img-v1');
          const ivoryLogo = document.getElementById('digital-logo-overlay');
          if (emblemV1) {
            emblemV1.style.opacity = String(emblemOpacity);
            if (emblemOpacity <= 0.01) {
              emblemV1.classList.remove('active-emblem');
            } else {
              emblemV1.classList.add('active-emblem');
            }
          }
          if (ivoryLogo) {
            ivoryLogo.style.opacity = String(ivoryOpacity);
            if (ivoryOpacity >= 0.99) {
              ivoryLogo.classList.add('materialized', 'locked-ivory');
            } else {
              ivoryLogo.classList.remove('locked-ivory');
            }
          }
          window.__emblemPhase = phaseName;
        }

        let loupeHoverActive = false;
        let loupePointerX = -9999;
        let loupePointerY = -9999;
        let loupeSmoothX = -9999;
        let loupeSmoothY = -9999;
        let loupeCurrRadius = 0;
        let loupeTargetRadius = 0;
        let loupeRafId = null;

        function applyLoupeRevealFrame() {
          loupeRafId = null;
          const emblemV1 = document.getElementById('emblem-img-v1');
          const ivoryLogo = document.getElementById('digital-logo-overlay');
          if (!emblemV1 || !ivoryLogo) return;

          // Only active after loading curtain is unveiled and Gobo light/logo has stabilized
          if (!window.__noirCurtainUnveiled || cinematicStep < 2 || window.__underDevCardActive) {
            loupeCurrRadius = 0;
            loupeTargetRadius = 0;
            window.__loupeRevealing = false;
            return;
          }

          loupeSmoothX += (loupePointerX - loupeSmoothX) * 0.34;
          loupeSmoothY += (loupePointerY - loupeSmoothY) * 0.34;
          loupeCurrRadius += (loupeTargetRadius - loupeCurrRadius) * 0.22;

          if (loupeCurrRadius > 0.8) {
            const r1 = emblemV1.getBoundingClientRect();
            const r2 = ivoryLogo.getBoundingClientRect();
            if (r1.width > 10 && r2.width > 10) {
              const x1Pct = ((loupeSmoothX - r1.left) / r1.width) * 100;
              const y1Pct = ((loupeSmoothY - r1.top) / r1.height) * 100;
              const x2Pct = ((loupeSmoothX - r2.left) / r2.width) * 100;
              const y2Pct = ((loupeSmoothY - r2.top) / r2.height) * 100;

              const rad = loupeCurrRadius;
              const rx2 = rad / 1.065; // Compensate for scale(1.065, 1) on ivoryLogo

              const embMask = `radial-gradient(circle ${rad.toFixed(1)}px at ${x1Pct.toFixed(2)}% ${y1Pct.toFixed(2)}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.96) 52%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0) 100%)`;
              const ivMask = `radial-gradient(ellipse ${rx2.toFixed(1)}px ${rad.toFixed(1)}px at ${x2Pct.toFixed(2)}% ${y2Pct.toFixed(2)}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 52%, rgba(0,0,0,0.58) 78%, rgba(0,0,0,1) 100%)`;

              emblemV1.style.transition = 'none';
              emblemV1.style.opacity = '1';
              emblemV1.style.transform = 'translateX(-50%) scale(1)';
              emblemV1.style.filter = 'none';
              emblemV1.style.webkitMaskImage = embMask;
              emblemV1.style.maskImage = embMask;
              emblemV1.classList.add('active-emblem');

              ivoryLogo.style.transition = 'none';
              ivoryLogo.style.opacity = '1';
              ivoryLogo.style.filter = 'none';
              ivoryLogo.style.webkitMaskImage = ivMask;
              ivoryLogo.style.maskImage = ivMask;
              window.__loupeRevealing = true;
              window.__loupeRadius = Math.round(rad);
            }
          } else {
            emblemV1.style.opacity = '0';
            emblemV1.style.filter = 'none';
            emblemV1.style.webkitMaskImage = 'none';
            emblemV1.style.maskImage = 'none';
            emblemV1.classList.remove('active-emblem');
            ivoryLogo.style.opacity = '1';
            ivoryLogo.style.filter = 'none';
            ivoryLogo.style.webkitMaskImage = 'none';
            ivoryLogo.style.maskImage = 'none';
            window.__loupeRevealing = false;
            window.__loupeRadius = 0;
          }

          if (Math.abs(loupeTargetRadius - loupeCurrRadius) > 0.35 || loupeTargetRadius > 0.5) {
            loupeRafId = requestAnimationFrame(applyLoupeRevealFrame);
          }
        }

        function updateLoupePointer(clientX, clientY, isLeaving = false) {
          if (!window.__noirCurtainUnveiled || cinematicStep < 2 || window.__underDevCardActive || isLeaving) {
            loupeTargetRadius = 0;
            if (!loupeRafId && loupeCurrRadius > 0.5) {
              loupeRafId = requestAnimationFrame(applyLoupeRevealFrame);
            }
            return;
          }
          const emblemV1 = document.getElementById('emblem-img-v1');
          const frameEl = goboFrame || emblemV1;
          if (!frameEl) return;
          const rect = frameEl.getBoundingClientRect();
          if (rect.width < 10) return;

          loupePointerX = clientX;
          loupePointerY = clientY;
          if (loupeSmoothX < -1000) {
            loupeSmoothX = clientX;
            loupeSmoothY = clientY;
          }

          const pad = 28;
          const insideCard =
            clientX >= rect.left - pad &&
            clientX <= rect.right + pad &&
            clientY >= rect.top - pad &&
            clientY <= rect.bottom + pad;

          loupeTargetRadius = insideCard ? Math.max(76, Math.min(125, rect.width * 0.28)) : 0;
          if (!loupeRafId) {
            loupeRafId = requestAnimationFrame(applyLoupeRevealFrame);
          }
        }

        // ======================================================================
        // CHIC TOP-CENTER BIDIRECTIONAL SPLIT & 7-SECOND AUTO-FLOW BORDER ENGINE
        // Starts at Top-Center, splits symmetrically Left & Right down to Bottom-Center over 7.0s
        // ======================================================================
        const borderPaintCanvas = document.getElementById('card-border-paint-canvas');
        const borderPaintCtx = borderPaintCanvas ? borderPaintCanvas.getContext('2d') : null;
        let borderPaintRatio = 0;
        let borderPaintCompleted = false;
        let borderAutoFlowRaf = null;
        let borderLastTickTime = 0;
        window.__borderPaintRatio = 0;
        window.__borderPaintCompleted = false;

        // Card geometry inside 1024 x 1143 canvas (24px inset around 976 x 1095 card)
        const B_X0 = 24, B_Y0 = 24, B_W = 976, B_H = 1095, B_R = 48;
        const B_CX = B_X0 + B_W * 0.5; // 512 (Top-Center & Bottom-Center X)
        const B_HALF_TOP = B_W * 0.5 - B_R; // 440
        const B_CORNER_ARC = 0.5 * Math.PI * B_R; // ~75.398
        const B_SIDE_H = B_H - 2 * B_R; // 999
        const B_HALF_BOT = B_W * 0.5 - B_R; // 440
        const B_HALF_TOTAL = B_HALF_TOP + B_CORNER_ARC + B_SIDE_H + B_CORNER_ARC + B_HALF_BOT;
        const BORDER_AUTO_DURATION_MS = 3800; // 3.8 seconds full automatic progression (shortened by ~3.2s per Sean Park directive)

        // Traces either the Right (+1) or Left (-1) half-perimeter from Top-Center down to Bottom-Center
        // for a given progress ratio in [0, 1], and returns the leading tip coordinates { x, y }
        function traceHalfPerimeterBranch(ctx, dir, ratio) {
          const clamped = Math.max(0, Math.min(1, ratio));
          let rem = clamped * B_HALF_TOTAL;
          let tipX = B_CX;
          let tipY = B_Y0;

          ctx.moveTo(B_CX, B_Y0);
          if (rem <= 0.01) return { x: tipX, y: tipY };

          // 1. Top horizontal segment from Top-Center outward
          const seg1 = Math.min(rem, B_HALF_TOP);
          tipX = B_CX + dir * seg1;
          tipY = B_Y0;
          ctx.lineTo(tipX, tipY);
          rem -= seg1;
          if (rem <= 0.01) return { x: tipX, y: tipY };

          // 2. Top corner arc (90 deg)
          const seg2 = Math.min(rem, B_CORNER_ARC);
          const frac2 = seg2 / B_CORNER_ARC;
          const arcCx1 = dir > 0 ? (B_X0 + B_W - B_R) : (B_X0 + B_R);
          const arcCy1 = B_Y0 + B_R;
          const startA1 = -Math.PI * 0.5;
          const endA1 = startA1 + dir * frac2 * (Math.PI * 0.5);
          ctx.arc(arcCx1, arcCy1, B_R, startA1, endA1, dir < 0);
          tipX = arcCx1 + Math.cos(endA1) * B_R;
          tipY = arcCy1 + Math.sin(endA1) * B_R;
          rem -= seg2;
          if (rem <= 0.01) return { x: tipX, y: tipY };

          // 3. Vertical side edge (top to bottom)
          const seg3 = Math.min(rem, B_SIDE_H);
          tipX = dir > 0 ? (B_X0 + B_W) : B_X0;
          tipY = B_Y0 + B_R + seg3;
          ctx.lineTo(tipX, tipY);
          rem -= seg3;
          if (rem <= 0.01) return { x: tipX, y: tipY };

          // 4. Bottom corner arc (90 deg)
          const seg4 = Math.min(rem, B_CORNER_ARC);
          const frac4 = seg4 / B_CORNER_ARC;
          const arcCx2 = dir > 0 ? (B_X0 + B_W - B_R) : (B_X0 + B_R);
          const arcCy2 = B_Y0 + B_H - B_R;
          const startA2 = dir > 0 ? 0 : Math.PI;
          const endA2 = startA2 + dir * frac4 * (Math.PI * 0.5);
          ctx.arc(arcCx2, arcCy2, B_R, startA2, endA2, dir < 0);
          tipX = arcCx2 + Math.cos(endA2) * B_R;
          tipY = arcCy2 + Math.sin(endA2) * B_R;
          rem -= seg4;
          if (rem <= 0.01) return { x: tipX, y: tipY };

          // 5. Bottom horizontal segment inward to Bottom-Center
          const seg5 = Math.min(rem, B_HALF_BOT);
          const botStartX = dir > 0 ? (B_X0 + B_W - B_R) : (B_X0 + B_R);
          tipX = botStartX - dir * seg5;
          tipY = B_Y0 + B_H;
          ctx.lineTo(tipX, tipY);
          return { x: tipX, y: tipY };
        }

        function renderCardBorderPaintCanvas(customAlpha) {
          if (!borderPaintCtx || !borderPaintCanvas) return;
          const W = borderPaintCanvas.width;
          const H = borderPaintCanvas.height;
          borderPaintCtx.clearRect(0, 0, W, H);

          const alpha = typeof customAlpha === 'number' ? Math.max(0, Math.min(1.4, customAlpha)) : borderPaintRatio;
          if (alpha <= 0.005) return;

          // Draw the FULL 100% card border simultaneously (ratio = 1.0), synced to the end of the gobo light flicker!
          borderPaintCtx.save();
          borderPaintCtx.globalAlpha = Math.min(1.0, alpha);
          borderPaintCtx.lineCap = 'round';
          borderPaintCtx.lineJoin = 'round';

          // Pass 1: Subtle Dark Obsidian contrast backing
          borderPaintCtx.beginPath();
          traceHalfPerimeterBranch(borderPaintCtx, 1, 1.0);
          traceHalfPerimeterBranch(borderPaintCtx, -1, 1.0);
          borderPaintCtx.strokeStyle = 'rgba(6, 5, 8, 0.82)';
          borderPaintCtx.lineWidth = 5.5;
          borderPaintCtx.shadowBlur = 0;
          borderPaintCtx.stroke();

          // Pass 2: 18K Champagne Gold soft halo
          borderPaintCtx.beginPath();
          traceHalfPerimeterBranch(borderPaintCtx, 1, 1.0);
          traceHalfPerimeterBranch(borderPaintCtx, -1, 1.0);
          borderPaintCtx.strokeStyle = alpha > 1.02 ? 'rgba(255, 238, 170, 0.96)' : 'rgba(223, 177, 91, 0.82)';
          borderPaintCtx.lineWidth = alpha > 1.02 ? 3.6 : 3.0;
          borderPaintCtx.shadowColor = 'rgba(243, 212, 137, 0.92)';
          borderPaintCtx.shadowBlur = alpha > 1.02 ? 18 : 12;
          borderPaintCtx.stroke();

          // Pass 3: Crisp Warm Ivory / Champagne Gold core hairline
          borderPaintCtx.beginPath();
          traceHalfPerimeterBranch(borderPaintCtx, 1, 1.0);
          traceHalfPerimeterBranch(borderPaintCtx, -1, 1.0);
          borderPaintCtx.strokeStyle = alpha > 1.02 ? '#ffffff' : 'rgba(255, 248, 228, 0.96)';
          borderPaintCtx.lineWidth = alpha > 1.02 ? 2.0 : 1.65;
          borderPaintCtx.shadowBlur = 0;
          borderPaintCtx.stroke();
          borderPaintCtx.restore();
        }

        function completeCardBorderPaint(instant = false) {
          if (borderAutoFlowRaf) {
            cancelAnimationFrame(borderAutoFlowRaf);
            borderAutoFlowRaf = null;
          }
          borderPaintRatio = 1.0;
          borderPaintCompleted = true;
          window.__borderPaintRatio = 1.0;
          window.__borderPaintCompleted = true;
          if (goboFrame) {
            goboFrame.classList.remove('worm-eye-monolith');
            goboFrame.classList.add('frame-illuminated');
          }
          renderCardBorderPaintCanvas();
        }
        window.__completeCardBorderPaint = completeCardBorderPaint;

        let goboSpeedMultiplier = 1.0;
        let isHoldingFastForward = false;
        let suppressNextClickAfterHold = false;
        window.__goboSpeedMultiplier = 1.0;

        function setGoboPlaybackSpeed(rate) {
          goboSpeedMultiplier = rate;
          window.__goboSpeedMultiplier = rate;
          // Sync Web Animations API playbackRate on gobo warmup layers & symbol layers
          const animRoot = document.getElementById('symbol-stage-3d');
          if (animRoot && typeof animRoot.getAnimations === 'function') {
            animRoot.getAnimations({ subtree: true }).forEach((anim) => {
              try { anim.playbackRate = rate; } catch (_) {}
            });
          }
          const bgVid = document.getElementById('ambient-bg-video');
          if (bgVid) {
            try { bgVid.playbackRate = rate > 1 ? 1.6 : 1.0; } catch (_) {}
          }
        }

        function tickCardBorderAutoFlow(now) {
          borderAutoFlowRaf = null;
          if (borderPaintCompleted || window.__underDevCardActive) return;
          if (!borderLastTickTime) borderLastTickTime = now;
          const dt = Math.min(64, Math.max(0, now - borderLastTickTime));
          borderLastTickTime = now;

          borderPaintRatio = Math.min(1.0, borderPaintRatio + (dt * goboSpeedMultiplier) / BORDER_AUTO_DURATION_MS);
          window.__borderPaintRatio = Number(borderPaintRatio.toFixed(3));
          renderCardBorderPaintCanvas();

          if (borderPaintRatio >= 0.999) {
            completeCardBorderPaint(true);
          } else {
            borderAutoFlowRaf = requestAnimationFrame(tickCardBorderAutoFlow);
          }
        }

        function startCardBorderAutoFlow() {
          completeCardBorderPaint(true);
        }
        window.__startCardBorderAutoFlow = startCardBorderAutoFlow;

        function resetCardBorderPaint() {
          if (borderAutoFlowRaf) {
            cancelAnimationFrame(borderAutoFlowRaf);
            borderAutoFlowRaf = null;
          }
          borderPaintRatio = 0;
          borderPaintCompleted = false;
          borderLastTickTime = 0;
          window.__borderPaintRatio = 0;
          window.__borderPaintCompleted = false;
          if (goboFrame) {
            goboFrame.classList.remove('frame-illuminated');
          }
          renderCardBorderPaintCanvas();
        }
        window.__resetCardBorderPaint = resetCardBorderPaint;

        function scrubCardBorderAtPointer(clientX, clientY) {
          // Border progression is driven by 1x auto-flow and 2x press-and-hold fast-forward
          return;
        }

        window.addEventListener('mousemove', (e) => {
          updateLoupePointer(e.clientX, e.clientY, false);
          scrubCardBorderAtPointer(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
          updateLoupePointer(-9999, -9999, true);
        }, { passive: true });

        window.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches.length > 0) {
            const t = e.touches[0];
            loupeSmoothX = t.clientX;
            loupeSmoothY = t.clientY;
            updateLoupePointer(t.clientX, t.clientY, false);
            scrubCardBorderAtPointer(t.clientX, t.clientY);
          }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
          if (e.touches && e.touches.length > 0) {
            const t = e.touches[0];
            updateLoupePointer(t.clientX, t.clientY, false);
            scrubCardBorderAtPointer(t.clientX, t.clientY);
          }
        }, { passive: true });

        window.addEventListener('touchend', () => {
          updateLoupePointer(-9999, -9999, true);
        }, { passive: true });

        function lockFinalPureIvoryLogo(fxTag, forceCompleteBorder = false) {
          resetDesignerSymbolStyles();
          cinematicStep = 3;
          setEmblemAndIvoryState(0, 1.0, 'locked_pure_ivory_' + (fxTag || 'final'));
          if (goboFrame) {
            goboFrame.classList.remove('worm-eye-monolith');
            if (forceCompleteBorder || borderPaintCompleted) {
              completeCardBorderPaint(true);
            } else {
              startCardBorderAutoFlow();
            }
          }
          if (goboNextAffordance) {
            goboNextAffordance.classList.add('visible');
          }
          if (loupePointerX > -1000) {
            updateLoupePointer(loupePointerX, loupePointerY, false);
          }
        }

        // ======================================================================
        // FX 01 · BORDEAUX LIQUID MENISCUS POUR (ManvsMachine / Dom Pérignon Style)
        // Feathered optical mask-image wipe: 3D Emblem -> Half-Filled -> Pure Ivory Logo
        // ======================================================================
        function runDesignerLiquidPour(startDelayMs = 700) {
          clearAlternationTimers();
          resetDesignerSymbolStyles();
          setEmblemAndIvoryState(1, 0, '3d_emblem_liquid_ready');

          const emblemV1 = document.getElementById('emblem-img-v1');
          const ivoryLogo = document.getElementById('digital-logo-overlay');
          const meniscusLine = document.getElementById('designer-meniscus-line');

          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            if (!emblemV1 || !ivoryLogo) return;

            emblemV1.style.transition = 'none';
            ivoryLogo.style.transition = 'none';
            emblemV1.style.opacity = '1';
            ivoryLogo.style.opacity = '1';
            emblemV1.classList.add('active-emblem');
            ivoryLogo.classList.add('materialized');
            window.__emblemPhase = 'fx1_liquid_meniscus_pouring';

            const t0 = performance.now();
            const totalDur = 2150; // 2.15s two-wave decanter pour

            function easeInOutCubic(t) {
              return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function stepLiquid(now) {
              if (window.__underDevCardActive) return;
              const elapsed = now - t0;
              const u = Math.min(1, elapsed / totalDur);

              let fillLevel = 0;
              if (u < 0.42) {
                fillLevel = 0.68 * easeInOutCubic(u / 0.42);
              } else if (u < 0.64) {
                fillLevel = 0.68 - 0.50 * easeInOutCubic((u - 0.42) / 0.22);
              } else {
                fillLevel = 0.18 + 0.82 * easeInOutCubic((u - 0.64) / 0.36);
              }

              const topCutPct = Math.max(0, Math.min(100, (1 - fillLevel) * 100));
              const botCutPct = Math.max(0, Math.min(100, fillLevel * 100));
              const feather = 6.5;

              const embSolid = Math.max(0, topCutPct - feather).toFixed(2);
              const embFade = Math.min(100, topCutPct + feather).toFixed(2);
              const ivSolid = Math.max(0, botCutPct - feather).toFixed(2);
              const ivFade = Math.min(100, botCutPct + feather).toFixed(2);

              const embMask = `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${embSolid}%, rgba(0,0,0,0) ${embFade}%, rgba(0,0,0,0) 100%)`;
              const ivMask = `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${ivSolid}%, rgba(0,0,0,0) ${ivFade}%, rgba(0,0,0,0) 100%)`;

              emblemV1.style.webkitMaskImage = embMask;
              emblemV1.style.maskImage = embMask;
              ivoryLogo.style.webkitMaskImage = ivMask;
              ivoryLogo.style.maskImage = ivMask;

              if (meniscusLine) {
                const lineTopPct = 17.35 + (topCutPct / 100) * 58.08;
                const edgeFade = fillLevel > 0.03 && fillLevel < 0.97 ? 0.92 : 0;
                const sloshTilt = Math.sin(elapsed * 0.011) * 2.4;
                meniscusLine.style.top = `${lineTopPct.toFixed(2)}%`;
                meniscusLine.style.opacity = String(edgeFade);
                meniscusLine.style.transform = `translate(-50%, -50%) rotate(${sloshTilt.toFixed(2)}deg)`;
              }

              if (u < 1) {
                designerRafId = requestAnimationFrame(stepLiquid);
              } else {
                lockFinalPureIvoryLogo('liquid');
              }
            }

            designerRafId = requestAnimationFrame(stepLiquid);
          }, startDelayMs));
        }

        // ======================================================================
        // FX 02 · LEICA NOCTILUX f/0.95 RACK-FOCUS (A24 / Analog Cinema Optics)
        // True depth-of-field focus breathing, golden bokeh halation & focal plane pull
        // ======================================================================
        function runDesignerLeicaRackFocus(startDelayMs = 700) {
          clearAlternationTimers();
          resetDesignerSymbolStyles();
          setEmblemAndIvoryState(1, 0, '3d_emblem_leica_ready');

          const emblemV1 = document.getElementById('emblem-img-v1');
          const ivoryLogo = document.getElementById('digital-logo-overlay');

          // Pre-stage Ivory Logo in out-of-focus background focal plane
          if (ivoryLogo) {
            ivoryLogo.style.transition = 'opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
            ivoryLogo.style.transform = 'translateX(-50%) scale(1.01, 0.945)';
            ivoryLogo.style.filter = 'blur(8px) brightness(1.22)';
          }
          if (emblemV1) {
            emblemV1.style.transition = 'opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
          }

          // Pull 1: Focus ring searches forward -> 3D blurs into warm halation, Ivory pulls near-sharp
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx2_leica_focus_pull_1';
            if (emblemV1) {
              emblemV1.style.opacity = '0.22';
              emblemV1.style.transform = 'translateX(-50%) scale(1.045)';
              emblemV1.style.filter = 'blur(8px) brightness(1.25)';
            }
            if (ivoryLogo) {
              ivoryLogo.style.opacity = '0.92';
              ivoryLogo.style.transform = 'translateX(-50%) scale(1.06, 0.995)';
              ivoryLogo.style.filter = 'blur(1px) brightness(1.08)';
            }
          }, startDelayMs));

          // Pull 2: Lens barrel pulls back -> 3D snaps back to crisp focus, Ivory recedes into bokeh
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx2_leica_focus_pull_2';
            if (emblemV1) {
              emblemV1.style.opacity = '1';
              emblemV1.style.transform = 'translateX(-50%) scale(1.0)';
              emblemV1.style.filter = 'none';
            }
            if (ivoryLogo) {
              ivoryLogo.style.opacity = '0.12';
              ivoryLogo.style.transform = 'translateX(-50%) scale(1.01, 0.95)';
              ivoryLogo.style.filter = 'blur(8px) brightness(1.18)';
            }
          }, startDelayMs + 620));

          // Pull 3 (Final Decisive Rack-Focus): 3D blooms out into golden bokeh -> Pure Ivory locks at 0px razor focus
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx2_leica_rack_lock';
            if (emblemV1) {
              emblemV1.style.transition = 'opacity 0.72s cubic-bezier(0.16, 1, 0.3, 1), filter 0.72s cubic-bezier(0.16, 1, 0.3, 1), transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)';
              emblemV1.style.opacity = '0';
              emblemV1.style.transform = 'translateX(-50%) scale(1.06)';
              emblemV1.style.filter = 'blur(10px) brightness(1.28)';
            }
            if (ivoryLogo) {
              ivoryLogo.style.transition = 'opacity 0.68s cubic-bezier(0.16, 1, 0.3, 1), filter 0.68s cubic-bezier(0.16, 1, 0.3, 1), transform 0.68s cubic-bezier(0.16, 1, 0.3, 1)';
              ivoryLogo.style.opacity = '1';
              ivoryLogo.style.transform = 'translateX(-50%) scale(1.065, 1.0)';
              ivoryLogo.style.filter = 'none';
              ivoryLogo.classList.add('materialized', 'locked-ivory');
            }
          }, startDelayMs + 1240));

          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            lockFinalPureIvoryLogo('leica');
          }, startDelayMs + 1980));
        }

        // ======================================================================
        // FX 03 · 35MM CONTACT-SHEET SHUTTER & HOT-FOIL STAMP (Pentagram / Kyle Cooper Style)
        // Zero-tween 24fps dry shutter cuts, double-exposure screen frame & letterpress stamp
        // ======================================================================
        function runDesignerFilmShutter(startDelayMs = 700) {
          clearAlternationTimers();
          resetDesignerSymbolStyles();
          setEmblemAndIvoryState(1, 0, '3d_emblem_shutter_ready');

          const emblemV1 = document.getElementById('emblem-img-v1');
          const ivoryLogo = document.getElementById('digital-logo-overlay');

          // Cut 1: Instant 24fps dry-cut to Ivory negative (+1.5px vertical gate weave)
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx3_shutter_cut_1';
            if (emblemV1 && ivoryLogo) {
              emblemV1.style.transition = 'none';
              ivoryLogo.style.transition = 'none';
              emblemV1.style.opacity = '0';
              ivoryLogo.style.opacity = '1';
              ivoryLogo.style.transform = 'translateX(-50%) translateY(-2px) scale(1.075, 1.012)';
              ivoryLogo.style.filter = 'contrast(1.22) brightness(1.18) drop-shadow(0 0 22px rgba(243, 212, 137, 0.78))';
            }
          }, startDelayMs));

          // Cut 2: Hard shutter return to 3D Emblem
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx3_shutter_cut_2';
            if (emblemV1 && ivoryLogo) {
              emblemV1.style.opacity = '1';
              ivoryLogo.style.opacity = '0';
              emblemV1.style.transform = 'translateX(-50%) translateY(1px) scale(1.0)';
            }
          }, startDelayMs + 130));

          // Cut 3: 35mm Double-Exposure Contact Frame (Both 3D + Ivory screen-blended together)
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx3_shutter_double_exposure';
            if (emblemV1 && ivoryLogo) {
              emblemV1.style.opacity = '0.82';
              emblemV1.style.transform = 'translateX(calc(-50% + 2px)) translateY(-1px) scale(1.005)';
              ivoryLogo.style.opacity = '0.88';
              ivoryLogo.style.mixBlendMode = 'screen';
              ivoryLogo.style.transform = 'translateX(calc(-50% - 2px)) translateY(1.5px) scale(1.06, 0.995)';
            }
          }, startDelayMs + 340));

          // Cut 4: Brief 3D Emblem pre-press tension
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx3_shutter_pre_stamp';
            if (emblemV1 && ivoryLogo) {
              ivoryLogo.style.mixBlendMode = 'normal';
              ivoryLogo.style.opacity = '0';
              emblemV1.style.opacity = '1';
              emblemV1.style.transform = 'translateX(-50%) scale(1.022)';
            }
          }, startDelayMs + 510));

          // Cut 5 (Final Hot-Foil Letterpress Stamp into Linen): Compresses to 0.968 -> settles at 1.0 Pure Ivory
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'fx3_shutter_foil_stamp';
            if (emblemV1 && ivoryLogo) {
              emblemV1.style.opacity = '0';
              ivoryLogo.style.opacity = '1';
              ivoryLogo.style.transform = 'translateX(-50%) scale(1.03, 0.968)';
              ivoryLogo.style.filter = 'brightness(1.32) drop-shadow(0 0 28px rgba(255, 240, 185, 0.9))';
              setTimeout(() => {
                if (window.__underDevCardActive) return;
                ivoryLogo.style.transition = 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), filter 0.42s ease';
                lockFinalPureIvoryLogo('shutter');
              }, 65);
            }
          }, startDelayMs + 680));
        }

        // ======================================================================
        // ✦ TRILOGY SHOWCASE (Default on Load: 35mm Cut -> Leica Focus Pull -> Liquid Meniscus Pour)
        // ======================================================================
        function runDesignerTrilogy(startDelayMs = 950) {
          clearAlternationTimers();
          resetDesignerSymbolStyles();
          setEmblemAndIvoryState(1, 0, '3d_emblem');

          const emblemV1 = document.getElementById('emblem-img-v1');
          const ivoryLogo = document.getElementById('digital-logo-overlay');

          // Act 1 (t + 950ms): 35mm Film Double-Exposure Flash
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'trilogy_act1_shutter';
            if (emblemV1 && ivoryLogo) {
              emblemV1.style.transition = 'none';
              ivoryLogo.style.transition = 'none';
              emblemV1.style.opacity = '0.45';
              ivoryLogo.style.opacity = '0.92';
              ivoryLogo.style.mixBlendMode = 'screen';
              ivoryLogo.style.transform = 'translateX(-50%) translateY(-1.5px) scale(1.07, 1.01)';
            }
          }, startDelayMs));

          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            if (emblemV1 && ivoryLogo) {
              ivoryLogo.style.mixBlendMode = 'normal';
              emblemV1.style.opacity = '1';
              ivoryLogo.style.opacity = '0';
              ivoryLogo.style.transform = 'translateX(-50%) scale(1.065, 1)';
            }
          }, startDelayMs + 160));

          // Act 2 (t + 440ms): Leica f/0.95 Optical Rack-Focus Breathe
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'trilogy_act2_leica';
            if (emblemV1 && ivoryLogo) {
              emblemV1.style.transition = 'opacity 0.42s ease, filter 0.42s ease, transform 0.42s ease';
              ivoryLogo.style.transition = 'opacity 0.42s ease, filter 0.42s ease, transform 0.42s ease';
              emblemV1.style.opacity = '0.18';
              emblemV1.style.transform = 'translateX(-50%) scale(1.042)';
              emblemV1.style.filter = 'blur(10px) brightness(1.32) drop-shadow(0 0 24px rgba(223, 177, 91, 0.6))';
              ivoryLogo.style.opacity = '0.94';
              ivoryLogo.style.transform = 'translateX(-50%) scale(1.06, 0.995)';
              ivoryLogo.style.filter = 'blur(0.8px) brightness(1.12) drop-shadow(0 0 20px rgba(243, 212, 137, 0.65))';
            }
          }, startDelayMs + 440));

          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            if (emblemV1 && ivoryLogo) {
              emblemV1.style.opacity = '1';
              emblemV1.style.transform = 'translateX(-50%) scale(1.0)';
              emblemV1.style.filter = 'drop-shadow(-8px 16px 20px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 16px rgba(223, 177, 91, 0.35))';
              ivoryLogo.style.opacity = '0';
            }
          }, startDelayMs + 880));

          // Act 3 (t + 1250ms): Bordeaux Liquid Meniscus Rise (Bottom-to-Top Final Transmutation into Pure Ivory Logo)
          alternationTimers.push(setTimeout(() => {
            if (window.__underDevCardActive) return;
            window.__emblemPhase = 'trilogy_act3_liquid_pour';
            const meniscusLine = document.getElementById('designer-meniscus-line');
            if (!emblemV1 || !ivoryLogo) return;

            emblemV1.style.transition = 'none';
            ivoryLogo.style.transition = 'none';
            ivoryLogo.style.transform = 'translateX(-50%) scale(1.065, 1)';
            ivoryLogo.style.filter = 'drop-shadow(-6px 14px 18px rgba(0, 0, 0, 0.92)) drop-shadow(0 0 18px rgba(243, 212, 137, 0.52))';
            emblemV1.style.opacity = '1';
            ivoryLogo.style.opacity = '1';

            const t0 = performance.now();
            const pourDur = 1150;
            function stepPour(now) {
              if (window.__underDevCardActive) return;
              const u = Math.min(1, (now - t0) / pourDur);
              const eased = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
              const topCutPct = (1 - eased) * 100;
              const botCutPct = eased * 100;
              const feather = 6.5;

              const embSolid = Math.max(0, topCutPct - feather).toFixed(2);
              const embFade = Math.min(100, topCutPct + feather).toFixed(2);
              const ivSolid = Math.max(0, botCutPct - feather).toFixed(2);
              const ivFade = Math.min(100, botCutPct + feather).toFixed(2);

              const embMask = `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${embSolid}%, rgba(0,0,0,0) ${embFade}%, rgba(0,0,0,0) 100%)`;
              const ivMask = `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${ivSolid}%, rgba(0,0,0,0) ${ivFade}%, rgba(0,0,0,0) 100%)`;

              emblemV1.style.webkitMaskImage = embMask;
              emblemV1.style.maskImage = embMask;
              ivoryLogo.style.webkitMaskImage = ivMask;
              ivoryLogo.style.maskImage = ivMask;

              if (meniscusLine) {
                const lineTopPct = 17.35 + (topCutPct / 100) * 58.08;
                meniscusLine.style.top = `${lineTopPct.toFixed(2)}%`;
                meniscusLine.style.opacity = u > 0.04 && u < 0.96 ? '0.92' : '0';
              }

              if (u < 1) {
                designerRafId = requestAnimationFrame(stepPour);
              } else {
                lockFinalPureIvoryLogo('trilogy');
              }
            }
            designerRafId = requestAnimationFrame(stepPour);
          }, startDelayMs + 1250));
        }

        function triggerDesignerFxMode(fxMode, startDelayMs = 350) {
          window.__activeDesignerFx = fxMode;
          const fxBtns = document.querySelectorAll('.designer-fx-btn');
          fxBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-fx') === fxMode);
          });

          // If VIP pass was flipped open, flip back to front and ensure stage is lit
          const underDevCard = document.getElementById('under-dev-card-overlay');
          if (underDevCard) underDevCard.classList.remove('active');
          if (goboFrame) goboFrame.classList.remove('card-flipped-out');
          document.body.classList.remove('vip-pass-flipped');
          window.__underDevCardActive = false;
          currentGoboStage = 0;
          cinematicStep = 2;

          if (goboLightRig) {
            goboLightRig.classList.remove('flicker-warmup');
            goboLightRig.classList.add('stabilized');
          }
          if (goboSymbolRig) {
            goboSymbolRig.classList.add('materialized');
          }
          if (goboNextAffordance) {
            goboNextAffordance.classList.remove('visible');
          }

          if (fxMode === 'liquid') {
            runDesignerLiquidPour(startDelayMs);
          } else if (fxMode === 'leica') {
            runDesignerLeicaRackFocus(startDelayMs);
          } else if (fxMode === 'shutter') {
            runDesignerFilmShutter(startDelayMs);
          } else {
            runDesignerTrilogy(startDelayMs);
          }
        }
        window.__triggerDesignerFxMode = triggerDesignerFxMode;

        document.querySelectorAll('.designer-fx-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fx = btn.getAttribute('data-fx') || 'trilogy';
            triggerDesignerFxMode(fx, 320);
          });
        });

        // ======================================================================
        // SALON 3 CONCEPTS DRAWER & FOREST €20 -> 99% COUPON (just.sean.flows) -> €1 TICKET ENGINE
        // ======================================================================
        const SALON_CONCEPTS_DATA = [
          {
            title: '01 · MUSIC JAM (LIVE SESSION)',
            desc: '야마하 피아노, 아이바네즈 마호가니 기타, 과르네리 바이올린과 2500K 웜앰버 조명이 어우러진 U22 어쿠스틱 & 네오소울 잼 세션',
            img: '/assets/salon_concepts/concept_01_music_jam.jpg',
            pickLabel: '01. MUSIC JAM'
          },
          {
            title: '02 · SALON TALK (CINEMA & DIALOGUE)',
            desc: '빈티지 영사기 필름 상영과 함께 와인 크레이트 테이블에 둘러앉아 영화·음악·예술을 이야기하는 심야 살롱 토크 클럽',
            img: '/assets/salon_concepts/concept_02_salon_talk.jpg',
            pickLabel: '02. SALON TALK'
          },
          {
            title: '03 · SOLO CAFE (INTROVERT PARTY)',
            desc: '서로 말 걸지 않고 각자 독서, 드립 커피와 와인, 바이닐 음악에만 온전히 몰입하는 인트로버트 전용 심야 카페 라운지',
            img: '/assets/salon_concepts/concept_03_introvert_cafe.jpg',
            pickLabel: '03. SOLO CAFE'
          }
        ];

        // ======================================================================
        // NOCTURNAL TORCH ALTAR PUZZLE ENGINE (DETACHABLE TORCH + 2-STAGE HIDDEN SANCTUARY)
        // ======================================================================
        const torchAltarState = {
          activeZone: 0, // 0 = cradle, 1 = Map, 2 = Concepts, 3 = Forest Ticket
          visited: { 1: false, 2: false, 3: false },
          stage2Revealed: false,
          masterUnlocked: false
        };
        window.__torchAltarState = torchAltarState;

        // Ultra-soft 7.5% volume Web Audio warm torch whoosh/ignition synthesizer
        function playSoftTorchIgnitionWhoosh(isMasterUnlock = false) {
          try {
            const ctx = ensureNoirAudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            if (ctx.state !== 'running') return;

            const now = ctx.currentTime + 0.01;
            const dur = isMasterUnlock ? 0.85 : 0.48;

            // Filtered warm fire noise whoosh
            const bufLen = Math.floor(ctx.sampleRate * dur);
            const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
            const data = noiseBuf.getChannelData(0);
            for (let i = 0; i < bufLen; i++) {
              data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * (isMasterUnlock ? 0.32 : 0.18)));
            }
            const noiseSrc = ctx.createBufferSource();
            noiseSrc.buffer = noiseBuf;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(isMasterUnlock ? 420 : 340, now);
            filter.frequency.exponentialRampToValueAtTime(180, now + dur);
            filter.Q.value = 1.4;

            const gain = ctx.createGain();
            // Strictly capped <= 0.065 (under 7.5% volume ceiling)
            const peakGain = isMasterUnlock ? 0.065 : 0.048;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

            noiseSrc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noiseSrc.start(now);
            noiseSrc.stop(now + dur);

            // Subtle warm golden chime harmonic on Master Unlock
            if (isMasterUnlock) {
              const osc = ctx.createOscillator();
              const oscGain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(440.0, now);
              osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.55); // A4 -> E5 fifth
              oscGain.gain.setValueAtTime(0.0001, now);
              oscGain.gain.exponentialRampToValueAtTime(0.032, now + 0.08);
              oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
              osc.connect(oscGain);
              oscGain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + 0.76);
            }
          } catch (_) {}
        }

        function syncTorchAltarDOM() {
          const card = document.getElementById('under-dev-card-overlay');
          const torchEl = document.getElementById('salon-draggable-torch');
          const torchLabel = document.getElementById('salon-torch-label');
          const cradleDock = document.getElementById('torch-cradle-dock');
          const cradleLabel = document.getElementById('torch-cradle-label');
          const guideText = document.getElementById('torch-quest-guide-text');
          const zone3 = document.getElementById('torch-zone-3');
          const dot1 = document.getElementById('torch-dot-1');
          const dot2 = document.getElementById('torch-dot-2');
          const dot3 = document.getElementById('torch-dot-3');

          // Check if both Zone 1 & Zone 2 have been visited -> unseal Hidden Altar III!
          if (torchAltarState.visited[1] && torchAltarState.visited[2] && !torchAltarState.stage2Revealed) {
            torchAltarState.stage2Revealed = true;
            if (zone3) zone3.setAttribute('data-sanctuary-sealed', 'false');
            if (dot3) dot3.classList.remove('hidden-step');
          }

          // Update each of the 3 zones
          [1, 2, 3].forEach((zId) => {
            const zEl = document.getElementById('torch-zone-' + zId);
            const sockEl = document.getElementById('torch-socket-' + zId);
            const dotEl = document.getElementById('torch-dot-' + zId);
            if (!zEl || !sockEl) return;

            const textSpan = sockEl.querySelector('.sconce-socket-text');
            let state = 'unlit';
            if (torchAltarState.masterUnlocked || torchAltarState.activeZone === zId) {
              state = 'lit';
            } else if (torchAltarState.visited[zId]) {
              state = 'ember';
            }
            zEl.setAttribute('data-zone-state', state);

            // Update step indicator dots
            if (dotEl) {
              dotEl.classList.toggle('lit', state === 'lit');
              dotEl.classList.toggle('ember', state === 'ember');
            }

            // Update socket label & physically move the Torch element into the active socket!
            if (torchAltarState.activeZone === zId && torchEl && !torchEl.classList.contains('dragging')) {
              if (sockEl !== torchEl.parentElement) {
                sockEl.appendChild(torchEl);
              }
              if (textSpan) {
                textSpan.textContent = zId === 3 ? '✦ 전체 점등 완료 · 숲속 입장 가능' : '🔥 점화됨 (다른 제단으로 옮기기)';
              }
              if (torchLabel) torchLabel.textContent = '🔥 횃불 꽂힘';
            } else {
              if (textSpan) {
                if (torchAltarState.masterUnlocked) {
                  textSpan.textContent = '🔥 성화 점등됨';
                } else if (state === 'ember') {
                  textSpan.textContent = '🔥 잔불 (클릭하여 다시 횃불 꽂기)';
                } else if (zId === 1) {
                  textSpan.textContent = '🔥 [제단 I · 시크릿 위치] 여기에 횃불 꽂기';
                } else if (zId === 2) {
                  textSpan.textContent = '🔥 [제단 II · 3대 살롱 나이트] 여기에 횃불 꽂기';
                } else if (zId === 3) {
                  textSpan.textContent = '🔥 [히든 제단 III · 숲속 티켓 성소] 마지막 횃불 꽂기!';
                }
              }
            }
          });

          // If activeZone === 0, keep Torch in the top cradle dock
          if ((torchAltarState.activeZone === 0 || torchAltarState.masterUnlocked) && torchEl && cradleDock && !torchEl.classList.contains('dragging')) {
            if (torchEl.parentElement !== cradleDock) {
              cradleDock.appendChild(torchEl);
            }
            if (torchLabel) torchLabel.textContent = torchAltarState.masterUnlocked ? '🔥 성화 마스터 해금' : '🔥 황금 횃불 (드래그)';
            if (cradleLabel) cradleLabel.textContent = torchAltarState.masterUnlocked ? 'ALL ALTARS LIT' : 'TORCH READY';
          } else if (cradleLabel) {
            cradleLabel.textContent = '↺ 성화대 회수';
          }

          if (card) {
            card.classList.toggle('master-torch-unlocked', !!torchAltarState.masterUnlocked);
          }

          // Update dynamic quest narrative text
          if (guideText) {
            if (torchAltarState.masterUnlocked) {
              guideText.textContent = '✨ 3대 성화가 모두 점화되어 살롱 전체가 해금되었습니다! 이제 횃불을 들고 숲속 티켓 부스로 입장하세요';
            } else if (torchAltarState.stage2Revealed) {
              guideText.textContent = '🔓 히든 제단 III가 어둠 속에서 솟아올랐습니다! 횃불을 뽑아 하단 [제단 III]에 꽂으세요';
            } else if (torchAltarState.activeZone === 1) {
              guideText.textContent = '📍 제단 I(시크릿 위치) 점화 완료! 이제 횃불을 [제단 II · 3대 살롱 나이트]에 옮겨 꽂아보세요';
            } else if (torchAltarState.activeZone === 2) {
              guideText.textContent = '🥂 제단 II(3대 살롱 나이트) 점화 완료! 아직 안 밝힌 제단에 횃불을 꽂아 히든 성소를 깨우세요';
            } else {
              guideText.textContent = '🔥 성화대의 [황금 횃불]을 드래그하거나 각 제단 홈(I·II)을 눌러 어둠을 밝히세요';
            }
          }
        }

        window.__plugTorchIntoAltar = function(zoneId) {
          const zNum = Number(zoneId) || 0;
          const torchEl = document.getElementById('salon-draggable-torch');
          if (torchEl && zNum > 0) {
            torchEl.classList.add('puppet-walking');
            setTimeout(() => torchEl.classList.remove('puppet-walking'), 520);
          }
          if (zNum === 3 && !torchAltarState.stage2Revealed) {
            // Auto-reveal if called directly in tests or after 1 & 2
            torchAltarState.visited[1] = true;
            torchAltarState.visited[2] = true;
            torchAltarState.stage2Revealed = true;
          }
          torchAltarState.activeZone = zNum;
          if (zNum >= 1 && zNum <= 3) {
            torchAltarState.visited[zNum] = true;
          }
          const allThreeVisited = !!(torchAltarState.visited[1] && torchAltarState.visited[2] && torchAltarState.visited[3]);
          const justUnlockedMaster = ((zNum === 3 || allThreeVisited) && !torchAltarState.masterUnlocked);
          if (zNum === 3 || allThreeVisited) {
            torchAltarState.visited[1] = true;
            torchAltarState.visited[2] = true;
            torchAltarState.visited[3] = true;
            torchAltarState.stage2Revealed = true;
            torchAltarState.masterUnlocked = true;
          }
          if (zNum > 0) {
            playSoftTorchIgnitionWhoosh(justUnlockedMaster);
          }
          syncTorchAltarDOM();

          // Update Miniature Sean badge text
          const badgeEl = document.getElementById('salon-torch-label');
          if (badgeEl) {
            if (torchAltarState.masterUnlocked) {
              badgeEl.textContent = '👑 3 TORCHES LIT';
            } else if (zNum > 0) {
              badgeEl.textContent = '🔥 LIT #' + zNum;
            } else {
              badgeEl.textContent = '🔥 GRAB SEAN';
            }
          }

          // Trigger Instagram VIP Verification Modal when all 3 torches are lit!
          if (justUnlockedMaster && typeof window.__openInstagramVipModal === 'function') {
            setTimeout(() => {
              if (!window.__suppressAutoVipModalOnce) {
                window.__openInstagramVipModal();
              }
            }, 620);
          }
        };

        window.__resetTorchAltarPuzzle = function() {
          torchAltarState.activeZone = 0;
          torchAltarState.visited = { 1: false, 2: false, 3: false };
          torchAltarState.stage2Revealed = false;
          torchAltarState.masterUnlocked = false;
          const zone3 = document.getElementById('torch-zone-3');
          const dot3 = document.getElementById('torch-dot-3');
          if (zone3) zone3.setAttribute('data-sanctuary-sealed', 'true');
          if (dot3) dot3.classList.add('hidden-step');
          syncTorchAltarDOM();
        };

        // Wire Pointer Drag-and-Drop + Real-time 2500K Firelight Halo for #salon-draggable-torch
        (function initTorchDragAndDrop() {
          const card = document.getElementById('under-dev-card-overlay');
          const torchEl = document.getElementById('salon-draggable-torch');
          const cradleDock = document.getElementById('torch-cradle-dock');
          if (!card || !torchEl) return;

          let isDraggingTorch = false;
          let dragStartX = 0;
          let dragStartY = 0;

          function updateHaloPosition(clientX, clientY) {
            const rect = card.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              const rx = ((clientX - rect.left) / rect.width) * 100;
              const ry = ((clientY - rect.top) / rect.height) * 100;
              card.style.setProperty('--torch-x', rx.toFixed(1) + '%');
              card.style.setProperty('--torch-y', ry.toFixed(1) + '%');
            }
          }

          function findHoveredAltarZone(clientX, clientY) {
            const zones = [1, 2, 3];
            for (const zId of zones) {
              if (zId === 3 && !torchAltarState.stage2Revealed) continue;
              const zEl = document.getElementById('torch-zone-' + zId);
              if (!zEl) continue;
              const r = zEl.getBoundingClientRect();
              if (clientX >= r.left - 12 && clientX <= r.right + 12 && clientY >= r.top - 12 && clientY <= r.bottom + 12) {
                return zId;
              }
            }
            return 0;
          }

          torchEl.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            isDraggingTorch = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            card.classList.add('torch-dragging');
            torchEl.classList.add('dragging');
            document.body.appendChild(torchEl);
            torchEl.style.left = e.clientX + 'px';
            torchEl.style.top = e.clientY + 'px';
            updateHaloPosition(e.clientX, e.clientY);
          });

          window.addEventListener('pointermove', (e) => {
            if (!isDraggingTorch) {
              // Subtle ambient halo tracking when hovering inside the card
              if (window.__underDevCardActive) {
                updateHaloPosition(e.clientX, e.clientY);
              }
              return;
            }
            torchEl.style.left = e.clientX + 'px';
            torchEl.style.top = e.clientY + 'px';
            updateHaloPosition(e.clientX, e.clientY);

            const hoveredZone = findHoveredAltarZone(e.clientX, e.clientY);
            [1, 2, 3].forEach((zId) => {
              const sock = document.getElementById('torch-socket-' + zId);
              if (sock) sock.classList.toggle('drag-over', hoveredZone === zId);
            });
          }, { passive: true });

          window.addEventListener('pointerup', (e) => {
            if (!isDraggingTorch) return;
            isDraggingTorch = false;
            card.classList.remove('torch-dragging');
            torchEl.classList.remove('dragging');
            torchEl.style.left = '';
            torchEl.style.top = '';
            [1, 2, 3].forEach((zId) => {
              const sock = document.getElementById('torch-socket-' + zId);
              if (sock) sock.classList.remove('drag-over');
            });

            const distMoved = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
            const dropZone = findHoveredAltarZone(e.clientX, e.clientY);

            if (dropZone > 0) {
              window.__plugTorchIntoAltar(dropZone);
            } else if (distMoved < 8) {
              // Simple click on the torch itself cycles smoothly to the next unvisited altar!
              if (!torchAltarState.visited[1]) {
                window.__plugTorchIntoAltar(1);
              } else if (!torchAltarState.visited[2]) {
                window.__plugTorchIntoAltar(2);
              } else if (torchAltarState.stage2Revealed) {
                window.__plugTorchIntoAltar(3);
              }
            } else {
              // Dropped outside -> return to active zone or cradle
              syncTorchAltarDOM();
            }
          });

          if (cradleDock) {
            cradleDock.addEventListener('click', (e) => {
              e.stopPropagation();
              if (e.target === torchEl || torchEl.contains(e.target)) return;
              window.__plugTorchIntoAltar(0);
            });
          }

          syncTorchAltarDOM();
        })();

        window.__openSalonConceptDrawer = function(idx) {
          const drawer = document.getElementById('salon-concept-drawer');
          const item = SALON_CONCEPTS_DATA[idx] || SALON_CONCEPTS_DATA[0];
          const imgEl = document.getElementById('concept-drawer-img');
          const titleEl = document.getElementById('concept-drawer-title');
          const descEl = document.getElementById('concept-drawer-desc');
          if (imgEl) imgEl.src = item.img;
          if (titleEl) titleEl.textContent = item.title;
          if (descEl) descEl.textContent = item.desc;
          document.querySelectorAll('.concept-drawer-tab').forEach((btn, i) => {
            btn.classList.toggle('active', i === idx);
          });
          if (drawer) drawer.classList.add('open');
        };

        window.__closeSalonConceptDrawer = function() {
          const drawer = document.getElementById('salon-concept-drawer');
          if (drawer) drawer.classList.remove('open');
        };

        let forestWalkTimer = null;

        window.__openForestTicketModal = function() {
          const modal = document.getElementById('forest-ticket-modal');
          if (!modal) return;
          modal.classList.add('open');
          window.__resetForestWalkToStart(true);
        };

        window.__closeForestTicketModal = function() {
          if (forestWalkTimer) {
            clearTimeout(forestWalkTimer);
            forestWalkTimer = null;
          }
          const modal = document.getElementById('forest-ticket-modal');
          if (modal) modal.classList.remove('open');
        };

        window.__resetForestWalkToStart = function(autoWalk = false) {
          if (forestWalkTimer) {
            clearTimeout(forestWalkTimer);
            forestWalkTimer = null;
          }
          const modal = document.getElementById('forest-ticket-modal');
          const oldP = document.getElementById('forest-sign-old-price');
          const newP = document.getElementById('forest-sign-new-price');
          const badge = document.getElementById('forest-status-badge');
          const issued = document.getElementById('forest-ticket-issued-box');
          if (modal) modal.setAttribute('data-walk-stage', 'distant');
          if (oldP) oldP.classList.remove('slashed');
          if (newP) newP.classList.remove('visible');
          if (badge) badge.textContent = '🌲 SECRET FOREST TRAIL · DISTANT VIEW (€20.00)';
          if (issued) issued.style.display = 'none';
          if (autoWalk) {
            forestWalkTimer = setTimeout(() => {
              const m = document.getElementById('forest-ticket-modal');
              if (m && m.classList.contains('open') && m.getAttribute('data-walk-stage') === 'distant') {
                window.__startForestWalkApproach();
              }
            }, 950);
          }
        };

        window.__startForestWalkApproach = function() {
          if (forestWalkTimer) {
            clearTimeout(forestWalkTimer);
            forestWalkTimer = null;
          }
          const modal = document.getElementById('forest-ticket-modal');
          const badge = document.getElementById('forest-status-badge');
          if (!modal) return;
          modal.setAttribute('data-walk-stage', 'walking');
          if (badge) badge.textContent = '👣 WALKING TOWARD FOREST TICKET BOOTH...';
          // Mid-way through the approach (~1.35s), pop out the 99% discount coupon discovery!
          forestWalkTimer = setTimeout(() => {
            modal.setAttribute('data-walk-stage', 'coupon');
            if (badge) badge.textContent = '✨ HIDDEN OPENING EVENT COUPON DISCOVERED!';
            const inp = document.getElementById('forest-coupon-input');
            if (inp && !inp.value) {
              inp.focus();
            }
          }, 1350);
        };

        window.__autoFillForestCoupon = function() {
          const inp = document.getElementById('forest-coupon-input');
          const fb = document.getElementById('forest-coupon-feedback');
          if (!inp) return;
          inp.value = 'just.sean.flows';
          if (fb) {
            fb.style.color = '#4ade80';
            fb.textContent = '✓ [just.sean.flows] 99% 할인 코드 입력 완료! (€20 ➔ €1)';
          }
        };

        window.__applyForestCouponAndArrive = function() {
          const inp = document.getElementById('forest-coupon-input');
          const fb = document.getElementById('forest-coupon-feedback');
          const modal = document.getElementById('forest-ticket-modal');
          const oldP = document.getElementById('forest-sign-old-price');
          const newP = document.getElementById('forest-sign-new-price');
          const badge = document.getElementById('forest-status-badge');
          if (!inp || !modal) return;
          const raw = (inp.value || '').trim().toLowerCase().replace(/^@/, '');
          if (raw !== 'just.sean.flows') {
            inp.value = 'just.sean.flows';
          }
          if (fb) {
            fb.style.color = '#4ade80';
            fb.textContent = '🎉 99% 할인 적용 완료! €20.00 ➔ €1.00';
          }
          if (oldP) oldP.classList.add('slashed');
          if (newP) newP.classList.add('visible');
          if (badge) badge.textContent = '🎟️ COUPON [just.sean.flows] APPLIED · 99% OFF (€1.00)';
          modal.setAttribute('data-walk-stage', 'arrived');
        };

        window.__selectForestTicketConcept = function(btnEl) {
          if (!btnEl) return;
          document.querySelectorAll('.forest-concept-pick-btn').forEach((b) => b.classList.remove('active'));
          btnEl.classList.add('active');
        };

        window.__completeForest1EurCheckout = function() {
          const issued = document.getElementById('forest-ticket-issued-box');
          const btn = document.getElementById('forest-pay-1eur-btn');
          if (issued) issued.style.display = 'block';
          if (btn) btn.textContent = '✓ €1.00 오픈 기념 티켓 발권 완료 (#JSF-U22-001)';
        };

        // === DOCUMENTARY SHARED-CANVAS TIMELINE ENGINE START ===
        let docTimelineStep = 0;
        let docTimelineAutoPlaying = true;
        let docTimelineTimer = null;
        const DOC_STEP_DURATION_MS = 5200;
        const DOC_TIMECODE_LABELS = [
          'ARCHIVE FILE #JSF-01 // WHO WE ARE',
          'ARCHIVE FILE #JSF-02 // WHAT WE DO',
          'ARCHIVE FILE #JSF-03 // WHERE & CONTACT'
        ];

        function scheduleNextDocTimelineStep() {
          if (docTimelineTimer) {
            clearTimeout(docTimelineTimer);
            docTimelineTimer = null;
          }
          if (!docTimelineAutoPlaying) return;
          const gobo = document.getElementById('gobo-canvas-frame');
          if (!gobo || !gobo.classList.contains('corp-profile-active')) return;
          docTimelineTimer = setTimeout(() => {
            const nextStep = (docTimelineStep + 1) % 3;
            window.__setDocTimelineStep(nextStep, false);
          }, DOC_STEP_DURATION_MS);
        }

        window.__setDocTimelineStep = function(stepIndex, isManualClick = false) {
          const step = Math.max(0, Math.min(2, Number(stepIndex) || 0));
          docTimelineStep = step;
          const root = document.getElementById('jsf-front-corp-profile');
          if (root) {
            root.setAttribute('data-doc-step', String(step));
          }
          const tc = document.getElementById('doc-top-timecode');
          if (tc) {
            tc.textContent = DOC_TIMECODE_LABELS[step] || DOC_TIMECODE_LABELS[0];
          }
          document.querySelectorAll('#jsf-front-corp-profile .doc-slide-card').forEach((card) => {
            const s = Number(card.getAttribute('data-step'));
            card.classList.toggle('active', s === step);
          });
          document.querySelectorAll('#jsf-front-corp-profile .doc-tl-node').forEach((btn) => {
            const s = Number(btn.getAttribute('data-tl-step'));
            btn.classList.toggle('active', s === step);
          });
          const fill0 = document.getElementById('doc-tl-fill-0');
          const fill1 = document.getElementById('doc-tl-fill-1');
          if (fill0) fill0.style.width = step >= 1 ? '100%' : '0%';
          if (fill1) fill1.style.width = step >= 2 ? '100%' : '0%';
          if (step === 2 && typeof window.__triggerQuestClearEffect === 'function') {
            window.__triggerQuestClearEffect('front');
          }

          scheduleNextDocTimelineStep();
        };

        window.__toggleDocTimelineAuto = function() {
          docTimelineAutoPlaying = !docTimelineAutoPlaying;
          const btn = document.getElementById('doc-autoplay-toggle-btn');
          if (btn) {
            btn.textContent = docTimelineAutoPlaying ? '❚❚ AUTO' : '▶ AUTO';
          }
          if (docTimelineAutoPlaying) {
            scheduleNextDocTimelineStep();
          } else if (docTimelineTimer) {
            clearTimeout(docTimelineTimer);
            docTimelineTimer = null;
          }
        };

        window.__startDocTimelineEngine = function() {
          docTimelineAutoPlaying = true;
          const btn = document.getElementById('doc-autoplay-toggle-btn');
          if (btn) btn.textContent = '❚❚ AUTO';
          window.__setDocTimelineStep(0, false);
        };

        window.__stopDocTimelineEngine = function() {
          if (docTimelineTimer) {
            clearTimeout(docTimelineTimer);
            docTimelineTimer = null;
          }
        };

        // Allow mouse wheel scrolling inside #jsf-front-corp-profile to scrub 01 -> 02 -> 03
        (function bindDocTimelineWheel() {
          let lastWheelAt = 0;
          const prof = document.getElementById('jsf-front-corp-profile');
          if (!prof) return;
          prof.addEventListener('wheel', (e) => {
            e.stopPropagation();
            const now = performance.now();
            if (now - lastWheelAt < 550) return;
            if (Math.abs(e.deltaY) < 12) return;
            lastWheelAt = now;
            if (e.deltaY > 0) {
              window.__setDocTimelineStep((docTimelineStep + 1) % 3, true);
            } else {
              window.__setDocTimelineStep((docTimelineStep + 2) % 3, true);
            }
          }, { passive: true });
        })();
        // === DOCUMENTARY SHARED-CANVAS TIMELINE ENGINE END ===

        function hideUnderDevCardToFlatGobo() {
          clearAlternationTimers();
          if (window.__webpageZoomTimer) {
            clearTimeout(window.__webpageZoomTimer);
            window.__webpageZoomTimer = null;
          }
          const underDevCard = document.getElementById('under-dev-card-overlay');
          if (underDevCard) {
            underDevCard.classList.remove('webpage-zoomed', 'active');
          }
          if (goboFrame) {
            goboFrame.classList.remove('card-flipped-out', 'corp-profile-active');
            goboFrame.classList.add('frame-illuminated', 'symbol-inspect-mode');
            if (typeof window.__stopDocTimelineEngine === 'function') window.__stopDocTimelineEngine();
          }
          document.body.classList.remove('vip-pass-flipped');
          borderPaintCompleted = true;
          window.__borderPaintCompleted = true;
          isTouchAllowed = true;
          currentGoboStage = 1;
          cinematicStep = 3;
          isMonolithPushedIn = false;
          isMonolithHolding = false;
          if (goboLightRig) {
            goboLightRig.classList.remove('flicker-warmup');
            goboLightRig.classList.add('stabilized');
          }
          if (goboSymbolRig) {
            goboSymbolRig.classList.add('materialized');
          }
          lockFinalPureIvoryLogo('replay', true);
          window.__underDevCardActive = false;
        }

        // Flipping between Salon Pass and Symbol Stage is strictly controlled via explicit corner ↺ buttons (#btn-under-dev-replay / #btn-gobo-flip-to-salon)
        const underDevCardEl = document.getElementById('under-dev-card-overlay');
        void underDevCardEl;

        const btnReplayFlatGobo = document.getElementById('btn-under-dev-replay');
        if (btnReplayFlatGobo) {
          btnReplayFlatGobo.addEventListener('click', (e) => {
            e.stopPropagation();
            hideUnderDevCardToFlatGobo();
          });
        }

        const frontFlipHintPill = document.getElementById('front-flip-hint-pill');
        if (frontFlipHintPill) {
          frontFlipHintPill.addEventListener('click', (e) => {
            e.stopPropagation();
            activateUnderDevCard();
          });
        }

        // Step 0: The Pure Void Slate (Paused behind Chic Noir Preloader Curtain until assets are 100% decoded & unveiled)
        cinematicStep = 0;
        window.__noirCurtainUnveiled = false;
        window.__emblemPhase = 'hidden_during_lighting';
        if (goboFrame) {
          goboFrame.style.transform = '';
        }
        if (goboSymbolRig) {
          goboSymbolRig.classList.remove('materialized');
        }
        if (frontFlipHintPill) {
          frontFlipHintPill.classList.remove('visible');
        }
        setEmblemAndIvoryState(0, 0, 'hidden_during_lighting');

        const noirCurtain = document.getElementById('noir-preload-curtain');
        const noirFill = document.getElementById('noir-preload-fill');
        let noirReady = false;

        function preloadSingleImage(src) {
          return new Promise((resolve) => {
            const img = new Image();
            let done = false;
            const finish = () => {
              if (done) return;
              done = true;
              resolve();
            };
            img.onload = () => {
              if (typeof img.decode === 'function') {
                img.decode().then(finish).catch(finish);
              } else {
                finish();
              }
            };
            img.onerror = finish;
            setTimeout(finish, 3500);
            img.src = src;
          });
        }

        // Split text into individual character spans and assign shuffled random delays within [startMs, endMs]
        const allNoirCharSpans = [];
        function buildRandomStaggeredChars(elements, startMs, endMs) {
          const charSpans = [];
          elements.forEach((el) => {
            if (!el) return;
            const raw = el.getAttribute('data-raw-text') || el.textContent || '';
            el.innerHTML = '';
            for (const ch of raw) {
              if (ch === ' ') {
                const sp = document.createElement('span');
                sp.className = 'cinema-rand-space';
                sp.innerHTML = '&nbsp;';
                el.appendChild(sp);
              } else {
                const span = document.createElement('span');
                span.className = 'cinema-rand-char' + ((ch === '@' || ch === '.' || ch === ',') ? ' char-punct' : '');
                span.textContent = ch;
                el.appendChild(span);
                charSpans.push(span);
              }
            }
          });

          // Fisher-Yates shuffle so characters materialize in an organic random order within this stage
          const order = charSpans.map((_, idx) => idx);
          for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = order[i];
            order[i] = order[j];
            order[j] = tmp;
          }

          const count = Math.max(1, order.length);
          const spanDuration = Math.max(100, endMs - startMs);
          order.forEach((charIdx, step) => {
            const frac = count > 1 ? step / (count - 1) : 0;
            const jitter = (Math.random() - 0.5) * 45;
            const delayMs = Math.max(0, Math.round(startMs + frac * spanDuration + jitter));
            charSpans[charIdx].style.setProperty('--char-delay', `${delayMs}ms`);
            allNoirCharSpans.push({
              el: charSpans[charIdx],
              appearMs: delayMs,
              revealed: false
            });
          });
        }

        let noirSpeedMultiplier = 1.0;
        let noirVirtualElapsedMs = 0;
        let noirLastTickTime = 0;
        let noirIntroRafId = null;
        let noirBorderPhase = 0; // 0: waiting, 1: fade-in (0.5s), 2: ping ("띵!"), 3: fade-out (0.5s), 4: done
        let noirAssetsDecoded = false;
        let noirPointerStartedAfterReady = false;
        const noirSigReveal = document.getElementById('noir-signature-reveal');

        // ======================================================================
        // SET 10 · GRAND TUTTI MORPH WAVEFORM & ANALYSER SYNC ENGINE
        // Measured Set 10 Waveform Profile:
        //   - 1.55s ~ 2.05s (0.50s): Accelerating buildup ("지지지직")
        //   - 2.05s (Peak RMS 0.3039 / Peak Amp 0.88): Climax Attack ("띵!")
        //   - 2.05s ~ 3.20s (1.15s): Cathedral Organ & String Reverb Tail ("스르륵 소멸")
        // ======================================================================
        const NOIR_SET10_URL = '/assets/sounds/hr_signature/proposals/hr_signature_set10_grand_tutti_morph_master.wav';
        // Normalized 50ms RMS decay table of Set 10 from 2.05s (1.000) to 3.20s (0.000)
        const SET10_REVERB_RMS_CURVE = [
          1.000, 0.950, 0.802, 0.629, 0.483, 0.348, 0.405, 0.372,
          0.372, 0.264, 0.167, 0.138, 0.148, 0.125, 0.121, 0.088,
          0.047, 0.047, 0.049, 0.028, 0.027, 0.026, 0.023, 0.000
        ];
        let noirSet10RawArrayBuffer = null;
        let noirSet10AudioBuffer = null;
        let noirSet10ActiveSource = null;
        let noirSet10Analyser = null;
        let noirSet10AnalyserData = null;
        let noirSet10PlayedDuringIntro = false;
        window.__noirAudioGestureArmed = false;

        // ======================================================================
        // ZERO-DISTORTION PRE-WARMUP AUDIO ENGINE:
        // 1. Pre-create AudioContext & decode Set 10 immediately on page load (0ms)
        // 2. Every 2.0 seconds, schedule a 5.0-second ultra-quiet micro-warmup pad
        //    so the OS/browser DAC hardware stream stays 100% open & warm (zero cold-start distortion!)
        // 3. Smooth zero-crossing S-curve attack from 1.65s -> 2.05s peak so '띵!' never clips!
        // ======================================================================
        let noirWarmup5sBuffer = null;
        let noirWarmupIntervalId = null;

        function ensureNoirAudioCtx() {
          try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return null;
            if (!window.__noirPingAudioCtx) {
              window.__noirPingAudioCtx = new Ctx({ latencyHint: 'interactive' });
            }
            return window.__noirPingAudioCtx;
          } catch (_) {
            return null;
          }
        }

        function build5SecMicroWarmupBuffer(ctx) {
          if (noirWarmup5sBuffer) return noirWarmup5sBuffer;
          try {
            const sr = ctx.sampleRate || 44100;
            const len = sr * 5; // 5.0-second duration
            const buf = ctx.createBuffer(2, len, sr);
            for (let ch = 0; ch < 2; ch++) {
              const data = buf.getChannelData(ch);
              for (let i = 0; i < len; i++) {
                const t = i / sr;
                // Smooth 5-second bell envelope (0 -> 1 -> 0) with ultra-soft warm 220Hz + 330Hz air
                const env = Math.sin(Math.PI * (t / 5.0));
                data[i] = env * (Math.sin(2 * Math.PI * 220 * t) * 0.6 + Math.sin(2 * Math.PI * 330 * t) * 0.4) * 0.0012;
              }
            }
            noirWarmup5sBuffer = buf;
            return buf;
          } catch (_) {
            return null;
          }
        }

        function fire5SecWarmupCarrierPulse() {
          try {
            const ctx = ensureNoirAudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }
            const buf = build5SecMicroWarmupBuffer(ctx);
            if (!buf) return;
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const g = ctx.createGain();
            g.gain.value = 1.0; // Already scaled to 0.0012 inside the 5s buffer
            src.connect(g);
            g.connect(ctx.destination);
            src.start(0);
          } catch (_) {}
        }

        // Pre-create AudioContext & pre-decode Set 10 immediately on page load (works even while suspended!)
        (function initPredecodeAnd2SecWarmupLoop() {
          const ctx = ensureNoirAudioCtx();
          if (ctx) {
            build5SecMicroWarmupBuffer(ctx);
          }
          fetch(NOIR_SET10_URL)
            .then((r) => r.arrayBuffer())
            .then((buf) => {
              noirSet10RawArrayBuffer = buf;
              const c = ensureNoirAudioCtx();
              if (c && !noirSet10AudioBuffer && !window.__noirSet10Decoding) {
                window.__noirSet10Decoding = true;
                c.decodeAudioData(buf.slice(0)).then((decoded) => {
                  noirSet10AudioBuffer = decoded;
                }).catch(() => {
                  window.__noirSet10Decoding = false;
                });
              }
            })
            .catch(() => {});

          // Fire a 5-second ultra-quiet warmup carrier immediately and every 2.0 seconds!
          fire5SecWarmupCarrierPulse();
          noirWarmupIntervalId = setInterval(() => {
            if (window.__alibiMrStarted) {
              clearInterval(noirWarmupIntervalId);
              noirWarmupIntervalId = null;
              return;
            }
            fire5SecWarmupCarrierPulse();
          }, 2000);
        })();

        // Soft background MR player (/assets/a_twelve_minute_alibi_mr.wav) via Web Audio API
        // Deferred until Location lamp is clicked + 1:1 Analog Tube/Vinyl Voltage-Sag Sync with flickering lamps!
        const ALIBI_MR_URL = '/assets/a_twelve_minute_alibi_mr.wav';
        const ALIBI_BASE_GAIN = 0.095;
        let alibiMrAudioEl = null;
        let alibiMrMediaNode = null;
        let alibiFilterNode = null;
        let alibiMrGainNode = null;
        let alibiMrStarted = false;
        let alibiMrFadeInterval = null;
        let alibiCurrentLampMult = 1.0;
        window.__alibiUnlockedByLocation = false;

        function ensureAlibiMrElement() {
          if (!alibiMrAudioEl) {
            alibiMrAudioEl = new Audio(ALIBI_MR_URL);
            alibiMrAudioEl.loop = true;
            alibiMrAudioEl.preload = 'auto';
            alibiMrAudioEl.crossOrigin = 'anonymous';
            alibiMrAudioEl.volume = 1.0;
            alibiMrAudioEl.playsInline = true;
            // Disable granular WSOLA pitch-stretcher so micro playbackRate sags sound like pure analog vinyl/tape inertia
            if ('preservesPitch' in alibiMrAudioEl) alibiMrAudioEl.preservesPitch = false;
            if ('webkitPreservesPitch' in alibiMrAudioEl) alibiMrAudioEl.webkitPreservesPitch = false;
            if ('mozPreservesPitch' in alibiMrAudioEl) alibiMrAudioEl.mozPreservesPitch = false;
            window.__alibiMrAudioEl = alibiMrAudioEl;
          }
          return alibiMrAudioEl;
        }
        ensureAlibiMrElement();

        function ensureAlibiWebAudioGraph(ctx) {
          const el = ensureAlibiMrElement();
          if (ctx && !alibiMrMediaNode) {
            try {
              alibiMrMediaNode = ctx.createMediaElementSource(el);
              alibiFilterNode = ctx.createBiquadFilter();
              alibiFilterNode.type = 'lowpass';
              alibiFilterNode.frequency.setValueAtTime(20000, ctx.currentTime);
              alibiFilterNode.Q.setValueAtTime(0.707, ctx.currentTime);

              alibiMrGainNode = ctx.createGain();
              alibiMrGainNode.gain.setValueAtTime(0.0005, ctx.currentTime);

              alibiMrMediaNode.connect(alibiFilterNode);
              alibiFilterNode.connect(alibiMrGainNode);
              alibiMrGainNode.connect(ctx.destination);
            } catch (_) {}
          }
        }

        function startSoftAlibiMrPlayback(targetVol = ALIBI_BASE_GAIN, fadeMs = 650) {
          if (typeof window.__jsfAlibiSyncPlay === 'function') {
            return window.__jsfAlibiSyncPlay(targetVol, fadeMs);
          }
          try {
            const el = ensureAlibiMrElement();
            if (window.__jsfAudioMuted) {
              if (el) el.muted = true;
              if (typeof window.__triggerJsfCenterNowPlayingReveal === 'function') {
                window.__triggerJsfCenterNowPlayingReveal();
              }
              return;
            }
            const ctx = ensureNoirAudioCtx();
            if (ctx && ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }
            ensureAlibiWebAudioGraph(ctx);

            const effectiveTarget = targetVol * alibiCurrentLampMult;
            if (alibiMrStarted && !el.paused) {
              if (ctx && alibiMrGainNode) {
                const now = ctx.currentTime;
                alibiMrGainNode.gain.cancelScheduledValues(now);
                alibiMrGainNode.gain.setTargetAtTime(Math.max(0.0005, effectiveTarget), now, 0.08);
              }
              if (ctx && alibiFilterNode && alibiCurrentLampMult >= 0.95) {
                const now = ctx.currentTime;
                alibiFilterNode.frequency.cancelScheduledValues(now);
                alibiFilterNode.frequency.setTargetAtTime(20000, now, 0.09);
                alibiFilterNode.Q.setTargetAtTime(0.707, now, 0.09);
              }
              return;
            }
            alibiMrStarted = true;
            window.__alibiMrStarted = true;
            el.muted = false;
            el.playbackRate = 1.0;

            if (ctx && alibiMrGainNode) {
              const now = ctx.currentTime;
              alibiMrGainNode.gain.cancelScheduledValues(now);
              alibiMrGainNode.gain.setValueAtTime(0.0008, now);
              alibiMrGainNode.gain.linearRampToValueAtTime(Math.max(0.002, effectiveTarget), now + fadeMs / 1000);
              if (alibiFilterNode) {
                // Analog tube amp warm-up bloom: 650Hz -> 20,000Hz as Location light turns ON
                alibiFilterNode.frequency.cancelScheduledValues(now);
                alibiFilterNode.frequency.setValueAtTime(650, now);
                alibiFilterNode.frequency.exponentialRampToValueAtTime(20000, now + Math.max(0.28, (fadeMs / 1000) * 0.85));
                alibiFilterNode.Q.setValueAtTime(0.85, now);
              }
            } else {
              el.volume = 0.002;
              if (alibiMrFadeInterval) clearInterval(alibiMrFadeInterval);
              const startTs = performance.now();
              alibiMrFadeInterval = setInterval(() => {
                const p = Math.min(1, (performance.now() - startTs) / fadeMs);
                el.volume = Math.max(0, Math.min(1, (0.002 + (targetVol - 0.002) * p) * alibiCurrentLampMult));
                if (p >= 1) {
                  clearInterval(alibiMrFadeInterval);
                  alibiMrFadeInterval = null;
                }
              }, 40);
            }

            const playPromise = el.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.then(() => {
                if (typeof window.__triggerJsfCenterNowPlayingReveal === 'function') {
                  window.__triggerJsfCenterNowPlayingReveal();
                }
              }).catch(() => {
                alibiMrStarted = false;
                window.__alibiMrStarted = false;
              });
            }
            if (typeof window.__triggerJsfCenterNowPlayingReveal === 'function') {
              window.__triggerJsfCenterNowPlayingReveal();
            }
          } catch (_) {}
        }

        window.__startAlibiFromLocationLamp = function() {
          window.__alibiUnlockedByLocation = true;
          alibiCurrentLampMult = 1.0;
          startSoftAlibiMrPlayback(ALIBI_BASE_GAIN, 520);
        };

        // Real-time 60fps Acoustic-Lighting Sync Controller driven by Brass Lamp Flicker & Auto-Off
        // Combines:
        //   1) Elastic -30%~-42% Gain Bounce on every filament voltage dip
        //   2) Psychoacoustic Optical-to-Treble Lowpass Filter (20kHz <-> 1,050Hz warm tube sag)
        //   3) Subtle 1.4% Analog Vinyl/Capstan Motor Tug (playbackRate 1.000 <-> 0.986)
        window.__setAlibiLampSyncState = function(state) {
          if (!window.__alibiUnlockedByLocation) return;
          const st = state || {};
          const power = typeof st.power === 'number' ? Math.max(0, Math.min(1, st.power)) : 1.0;
          const dip = typeof st.dip === 'number' ? Math.max(0, Math.min(1, st.dip)) : 0.0;
          const isFlickering = !!st.isFlickering;
          const anyLit = st.anyLit !== undefined ? !!st.anyLit : true;

          let gainMult = 1.0;
          let cutoffHz = 20000;
          let filterQ = 0.707;
          let targetRate = 1.0;

          if (!anyLit) {
            // All lamps dark after 7.0s auto-off: hushed behind-the-velvet-curtain room state (-54% vol, 980Hz warm LPF)
            gainMult = 0.46;
            cutoffHz = 980;
            filterQ = 0.95;
            targetRate = 0.996;
          } else if (isFlickering) {
            // Elastic voltage-bounce sync: each filament dip tugs volume down by ~32%-44% and rebounds sharply!
            const sag = Math.max(1.0 - power, dip * 0.95);
            gainMult = Math.max(0.32, 1.0 - sag * 0.56);
            // Exponential frequency mapping: 20,000Hz at full light -> ~1,050Hz at deepest blink trough
            cutoffHz = Math.max(920, Math.min(20000, 980 * Math.pow(20.4, Math.pow(1.0 - sag * 0.88, 1.35))));
            // Slight warm resonant bump during transient blink gives tactile analog '튕기는' bounce feel
            filterQ = 0.75 + dip * 1.45;
            // Subtle turntable voltage tug on blink troughs (max -1.4%, zero metallic artifacts)
            targetRate = 1.0 - dip * 0.014 - (1.0 - power) * 0.004;
          }

          alibiCurrentLampMult = gainMult;

          const bottomBar = document.getElementById('jsf-minimal-mp3-bar');
          if (bottomBar && bottomBar.classList.contains('visible')) {
            const barOpacity = !anyLit ? 0.58 : (isFlickering ? (0.46 + 0.54 * power) : 1.0);
            bottomBar.style.opacity = barOpacity.toFixed(3);
          }

          if (window.__jsfAudioMuted) return;

          const el = alibiMrAudioEl;
          const ctx = window.__noirPingAudioCtx;
          if (ctx && alibiMrGainNode && ctx.state === 'running') {
            const now = ctx.currentTime;
            // Fast 16ms attack on voltage dip, smooth 48ms tube-capacitor rebound
            const timeConst = (dip > 0.15) ? 0.016 : (anyLit ? 0.048 : 0.16);
            try {
              alibiMrGainNode.gain.cancelScheduledValues(now);
              alibiMrGainNode.gain.setTargetAtTime(Math.max(0.0005, ALIBI_BASE_GAIN * gainMult), now, timeConst);
              if (alibiFilterNode) {
                alibiFilterNode.frequency.cancelScheduledValues(now);
                alibiFilterNode.frequency.setTargetAtTime(cutoffHz, now, timeConst);
                alibiFilterNode.Q.cancelScheduledValues(now);
                alibiFilterNode.Q.setTargetAtTime(filterQ, now, 0.025);
              }
            } catch (_) {}
          } else if (el && !el.paused) {
            try {
              el.volume = Math.max(0, Math.min(1, ALIBI_BASE_GAIN * gainMult));
            } catch (_) {}
          }

          if (el && !el.paused) {
            try {
              const clampedRate = Math.max(0.96, Math.min(1.02, targetRate));
              if (Math.abs(el.playbackRate - clampedRate) > 0.0008) {
                el.playbackRate = clampedRate;
              }
            } catch (_) {}
          }
        };

        // ======================================================================
        // 3-SECOND CENTER ZERO-BOX NOW-PLAYING REVEAL -> BOTTOM MINIMAL MP3 BAR
        // ======================================================================
        let jsfNowPlayingCenterTimer = null;
        let jsfNowPlayingBottomTimer = null;
        let jsfNowPlayingShownCount = 0;
        window.__jsfAudioMuted = false;

        window.__triggerJsfCenterNowPlayingReveal = function(forceShow = false) {
          if (!forceShow && !window.__alibiUnlockedByLocation) return;
          const centerStage = document.getElementById('jsf-center-nowplaying-stage');
          const bottomBar = document.getElementById('jsf-minimal-mp3-bar');
          if (centerStage) {
            centerStage.classList.remove('active', 'dissolving-to-bottom');
            centerStage.style.display = 'none';
          }
          document.body.classList.remove('jsf-nowplaying-center-active');
          if (bottomBar) {
            bottomBar.classList.add('visible');
          }
        };

        window.__toggleJsfMinimalMp3Mute = function(forceMuteState) {
          const nextMuted = typeof forceMuteState === 'boolean' ? forceMuteState : !window.__jsfAudioMuted;
          window.__jsfAudioMuted = nextMuted;
          isMuted = nextMuted;

          const el = ensureAlibiMrElement();
          if (el) {
            el.muted = nextMuted;
            if (nextMuted) {
              if (alibiMrFadeInterval) {
                clearInterval(alibiMrFadeInterval);
                alibiMrFadeInterval = null;
              }
              try { el.pause(); } catch (_) {}
            } else if (window.__alibiUnlockedByLocation) {
              if (el.paused) {
                alibiMrStarted = false;
                startSoftAlibiMrPlayback(ALIBI_BASE_GAIN, 450);
              }
            }
          }

          if (alibiMrGainNode && window.__noirPingAudioCtx) {
            try {
              const now = window.__noirPingAudioCtx.currentTime;
              alibiMrGainNode.gain.cancelScheduledValues(now);
              alibiMrGainNode.gain.setValueAtTime(
                nextMuted ? 0.00001 : (window.__alibiUnlockedByLocation ? ALIBI_BASE_GAIN * alibiCurrentLampMult : 0.00001),
                now
              );
            } catch (_) {}
          }

          // Background <video> elements (#ambient-bg-video, #noir-living-card-video, #hp-video-*)
          // and #gobo-calibration-audio MUST ALWAYS stay 100% muted so the MV audio never blasts over the MR!
          document.querySelectorAll('video, #gobo-calibration-audio').forEach((bgMediaEl) => {
            try {
              bgMediaEl.muted = true;
              bgMediaEl.volume = 0;
            } catch (_) {}
          });

          // Suspend or resume Web Audio contexts so no background synth/chime leaks while muted
          [window.__noirPingAudioCtx, window.__hpLampAudioCtx, typeof audioCtx !== 'undefined' ? audioCtx : null].forEach((ctxObj) => {
            if (!ctxObj) return;
            try {
              if (nextMuted && ctxObj.state === 'running') {
                ctxObj.suspend().catch(() => {});
              } else if (!nextMuted && ctxObj.state === 'suspended') {
                ctxObj.resume().catch(() => {});
              }
            } catch (_) {}
          });

          const bottomBar = document.getElementById('jsf-minimal-mp3-bar');
          const muteBtn = document.getElementById('jsf-mp3-mute-btn');
          if (bottomBar) {
            bottomBar.classList.toggle('is-muted', nextMuted);
          }
          if (muteBtn) {
            muteBtn.setAttribute('aria-pressed', nextMuted ? 'true' : 'false');
            muteBtn.setAttribute('title', nextMuted ? 'Unmute Audio' : 'Mute Audio');
          }
          return nextMuted;
        };

        (function bindJsfMinimalMp3MuteBtn() {
          const btn = document.getElementById('jsf-mp3-mute-btn');
          if (!btn) return;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.__toggleJsfMinimalMp3Mute();
          });
        })();

        function armNoirSet10AudioOnGesture() {
          try {
            const ctx = ensureNoirAudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }
            if (!window.__noirAudioGestureArmed) {
              window.__noirAudioGestureArmed = true;
              // Fire the 5-second micro-warmup carrier immediately to lock open the DAC stream cleanly
              fire5SecWarmupCarrierPulse();
            }
            if (noirSet10RawArrayBuffer && !noirSet10AudioBuffer && !window.__noirSet10Decoding) {
              window.__noirSet10Decoding = true;
              ctx.decodeAudioData(noirSet10RawArrayBuffer.slice(0)).then((decoded) => {
                noirSet10AudioBuffer = decoded;
                if (!noirSet10PlayedDuringIntro && noirBorderPhase >= 1 && noirBorderPhase <= 3 && !window.__noirCurtainUnveiled) {
                  startNoirSet10SyncedPlayback(1.65, 1.60);
                }
              }).catch(() => {});
            } else if (noirSet10AudioBuffer && !noirSet10PlayedDuringIntro && noirBorderPhase >= 1 && noirBorderPhase <= 3 && !window.__noirCurtainUnveiled) {
              startNoirSet10SyncedPlayback(1.65, 1.60);
            }
            if (window.__alibiUnlockedByLocation) {
              startSoftAlibiMrPlayback(ALIBI_BASE_GAIN, 600);
            }
          } catch (_) {}
        }

        ['pointerdown', 'pointermove', 'mousedown', 'mousemove', 'touchstart', 'touchmove', 'touchend', 'wheel', 'keydown', 'focus', 'click'].forEach((evtName) => {
          window.addEventListener(evtName, armNoirSet10AudioOnGesture, { capture: true, passive: true });
        });

        let noirSet10GainNode = null;
        function startNoirSet10SyncedPlayback(startOffsetSec = 1.65, playDurationSec = 1.60) {
          try {
            const ctx = ensureNoirAudioCtx();
            if (!ctx) return false;
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }
            if (ctx.state !== 'running' || !noirSet10AudioBuffer) return false;

            if (noirSet10ActiveSource) {
              try { noirSet10ActiveSource.stop(); } catch (_) {}
              noirSet10ActiveSource = null;
            }

            const rate = noirSpeedMultiplier > 1.0 ? 2.0 : 1.0;
            // Align 2.05s '띵!' climax peak to exact virtual time (0.40s / rate) while preserving 440Hz pitch (playbackRate = 1.0)!
            const baseLeadToPeak = Math.max(0.05, 2.05 - startOffsetSec);
            const scaledOffset = Math.max(0, 2.05 - (baseLeadToPeak / rate));
            const scaledDur = Math.max(0.45, playDurationSec / rate);

            const src = ctx.createBufferSource();
            src.buffer = noirSet10AudioBuffer;
            src.playbackRate.value = 1.0;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.65;
            noirSet10Analyser = analyser;
            noirSet10AnalyserData = new Float32Array(analyser.fftSize);

            const gain = ctx.createGain();
            noirSet10GainNode = gain;
            const startAt = ctx.currentTime + 0.025;
            const attackDur = 0.24 / rate;
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.setValueAtTime(0.0001, startAt);
            gain.gain.exponentialRampToValueAtTime(0.075, startAt + attackDur);
            gain.gain.setValueAtTime(0.075, startAt + Math.max(attackDur + 0.03, scaledDur - (0.35 / rate)));
            gain.gain.exponentialRampToValueAtTime(0.0001, startAt + scaledDur);

            src.connect(analyser);
            analyser.connect(gain);
            gain.connect(ctx.destination);

            src.start(startAt, scaledOffset, scaledDur);
            noirSet10ActiveSource = src;
            noirSet10PlayedDuringIntro = true;
            window.__noirSet10Played = true;
            return true;
          } catch (_) {
            return false;
          }
        }

        function sampleSet10ReverbEnvelope(normProgress) {
          const p = Math.max(0, Math.min(1, normProgress));
          const maxIdx = SET10_REVERB_RMS_CURVE.length - 1;
          const fIdx = p * maxIdx;
          const i0 = Math.floor(fIdx);
          const i1 = Math.min(maxIdx, i0 + 1);
          const frac = fIdx - i0;
          const curveVal = SET10_REVERB_RMS_CURVE[i0] * (1 - frac) + SET10_REVERB_RMS_CURVE[i1] * frac;

          // If real-time Web Audio AnalyserNode is active, blend live acoustic RMS with the Set 10 envelope
          if (noirSet10Analyser && noirSet10AnalyserData && window.__noirPingAudioCtx && window.__noirPingAudioCtx.state === 'running') {
            try {
              noirSet10Analyser.getFloatTimeDomainData(noirSet10AnalyserData);
              let sumSq = 0;
              for (let i = 0; i < noirSet10AnalyserData.length; i++) {
                const s = noirSet10AnalyserData[i];
                sumSq += s * s;
              }
              const liveRms = Math.sqrt(sumSq / noirSet10AnalyserData.length);
              // Peak RMS at 2.05s with gain 0.72 is ~0.22
              const normLive = Math.min(1.0, liveRms / 0.28);
              return Math.max(0, Math.min(1, normLive * 0.65 + curveVal * 0.35));
            } catch (_) {}
          }
          return curveVal;
        }

        function setNoirIntroSpeed(mult) {
          const rate = mult > 1.0 ? 2.0 : 1.0;
          noirSpeedMultiplier = rate;
          window.__noirSpeedMultiplier = rate;
          if (noirCurtain) {
            noirCurtain.style.setProperty('--noir-speed-inv', rate > 1.0 ? '0.5' : '1');
          }

        }

        function playNoirBorderPingBell() {
          // If Set 10 wasn't started at 4600ms (e.g. decoded late), trigger right at the 2.05s peak!
          if (!noirSet10PlayedDuringIntro) {
            startNoirSet10SyncedPlayback(1.65, 1.60);
          }
        }

        (function runRealAssetPreloader() {
          const coreAssets = [
            '/assets/just_sean_flows_title_only.png?v=1',
            '/assets/u22_window_card_aligned_bg.jpg?v=2',
            '/assets/gobo_real_photo_step1.jpg?v=3',
            '/assets/gobo_real_photo_step2.jpg?v=3',
            '/assets/gobo_real_photo_step3.jpg?v=3',
            '/assets/emblem_photo_v1_ivory_rosegold.png',
            '/assets/jsf_symbol_pure_cream.png'
          ];

          // Build 3-Stage Random Staggered Character Spans:
          // Stage 1 (0.10s ~ 1.40s): @just.sean.flows
          // Stage 2 (1.52s ~ 2.76s): music salon
          // Stage 3 (2.90s ~ 4.30s): in frankfurt am main, Germany
          const stage1El = document.getElementById('cinema-stage1-brand');
          const stage2El = document.getElementById('cinema-stage2-salon');
          const stage3Els = Array.from(document.querySelectorAll('#cinema-stage3-loc [data-raw-text]'));

          buildRandomStaggeredChars([stage1El], 100, 1400);
          buildRandomStaggeredChars([stage2El], 1520, 2760);
          buildRandomStaggeredChars(stage3Els, 2900, 4300);

          if (noirFill) {
            noirFill.style.transition = 'none';
            noirFill.style.width = '0%';
          }
          if (noirCurtain) {
            noirCurtain.classList.add('cinema-act-1', 'chars-revealing');
          }

          // Decode all real assets + pre-decode live DOM images so Gobo stage has 0ms lag
          const domImgs = Array.from(document.querySelectorAll('#gobo-light-rig img, #gobo-symbol-rig img, #window-room-bg-anchor img'));
          const domDecodePromises = domImgs.map((img) => {
            if (typeof img.decode === 'function') {
              return img.decode().catch(() => {});
            }
            return Promise.resolve();
          });

          Promise.all([
            ...coreAssets.map((url) => preloadSingleImage(url)),
            ...domDecodePromises
          ]).then(() => {
            noirAssetsDecoded = true;
          }).catch(() => {
            noirAssetsDecoded = true;
          });

          function tickNoirIntroClock(now) {
            noirIntroRafId = null;
            if (window.__noirCurtainUnveiled) return;
            if (!noirLastTickTime) noirLastTickTime = now;
            const dt = Math.min(64, Math.max(0, now - noirLastTickTime));
            noirLastTickTime = now;

            noirVirtualElapsedMs += dt * noirSpeedMultiplier;

            // 1. Reveal each character as its virtual timestamp arrives
            for (let i = 0; i < allNoirCharSpans.length; i++) {
              const item = allNoirCharSpans[i];
              if (!item.revealed && noirVirtualElapsedMs >= item.appearMs) {
                item.revealed = true;
                item.el.classList.add('char-visible');
              }
            }

            // 2. Smoothly advance golden horizon bar (0ms ~ 4200ms)
            if (noirFill) {
              const fillPct = Math.min(100, (noirVirtualElapsedMs / 4200) * 100);
              noirFill.style.width = `${fillPct.toFixed(1)}%`;
            }

            // 3. Stage 2 & 3 class triggers
            if (noirVirtualElapsedMs >= 1520 && noirCurtain && !noirCurtain.classList.contains('cinema-act-2') && !noirCurtain.classList.contains('cinema-act-3')) {
              noirCurtain.classList.remove('cinema-act-1');
              noirCurtain.classList.add('cinema-act-2');
            }
            if (noirVirtualElapsedMs >= 2900 && noirCurtain && !noirCurtain.classList.contains('cinema-act-3')) {
              noirCurtain.classList.add('cinema-act-3');
            }

            // 4. Set 10 Waveform-Synced 3D Border Sequence:
            //    - 4600ms ~ 5100ms (0.50s = Set 10 1.55s~2.05s): "지지지직!" 가속 필라멘트 빌드업 (border-flash-in)
            //    - 5100ms ~ 5220ms (0.12s = Set 10 2.05s Peak): "띵!" 최대 음량 피크 점등 (border-flash-ping)
            //    - 5220ms ~ 6250ms (1.03s = Set 10 2.15s~3.20s): 오르간·현악 잔향(AnalyserNode RMS)에 맞춰 스르륵 소멸 (border-flash-out)
            if (noirVirtualElapsedMs >= 4600 && noirBorderPhase === 0) {
              noirBorderPhase = 1;
              startNoirSet10SyncedPlayback(1.65, 1.60);
              if (noirSigReveal) {
                noirSigReveal.style.setProperty('--noir-reverb-env', '1');
                noirSigReveal.classList.remove('border-flash-out', 'border-flash-ping');
                noirSigReveal.classList.add('border-flash-in');
              }
            } else if (noirVirtualElapsedMs >= 5100 && noirBorderPhase === 1) {
              noirBorderPhase = 2;
              if (noirSigReveal) {
                noirSigReveal.style.setProperty('--noir-reverb-env', '1');
                noirSigReveal.classList.add('border-flash-ping');
              }
              playNoirBorderPingBell();
            } else if (noirVirtualElapsedMs >= 5220 && noirBorderPhase === 2) {
              noirBorderPhase = 3;
              if (noirSigReveal) {
                noirSigReveal.classList.remove('border-flash-in', 'border-flash-ping');
                noirSigReveal.classList.add('border-flash-out');
              }
            }

            if (noirBorderPhase === 3) {
              const reverbNorm = (noirVirtualElapsedMs - 5220) / 1030;
              const envVal = sampleSet10ReverbEnvelope(reverbNorm);
              if (noirSigReveal) {
                noirSigReveal.style.setProperty('--noir-reverb-env', envVal.toFixed(3));
              }
              if (noirVirtualElapsedMs >= 6250 && (noirAssetsDecoded || noirVirtualElapsedMs >= 6800)) {
                noirBorderPhase = 4;
                if (noirSigReveal) {
                  noirSigReveal.style.setProperty('--noir-reverb-env', '0');
                }
                noirReady = true;
                window.__noirPreloadReady = true;
                if (typeof window.__triggerJsfCenterNowPlayingReveal === 'function' && jsfNowPlayingShownCount === 0) {
                  window.__triggerJsfCenterNowPlayingReveal();
                }
                setNoirIntroSpeed(1.0);
                if (noirCurtain) {
                  noirCurtain.classList.add('ready-to-unveil');
                }
                return;
              }
            }

            if (!noirReady) {
              noirIntroRafId = requestAnimationFrame(tickNoirIntroClock);
            }
          }

          noirLastTickTime = performance.now();
          noirIntroRafId = requestAnimationFrame(tickNoirIntroClock);
        })();

        // ======================================================================
        // GOBO 3.0S SPOTLIGHT WIDER-VIBRATO VIOLIN & SIGNATURE LOCK-IN ENGINE
        // 1:1 Coupled to #gobo-light-rig 3-Stage Expansion (GOBO_WARMUP_DURATION_MS = 3000):
        //   - Step 1 (0.00s ~ 0.60s / p 0.00~0.20, 1800K Ember): Senza Vibrato (±1.2~3.0 cents)
        //   - Step 2 (0.60s ~ 1.44s / p 0.20~0.48, 2200K Medium): Narrow -> Medium (±3.0~16.5 cents)
        //   - Step 3 (1.44s ~ 2.60s / p 0.48~0.865, 2500K Wide): Wider Vibrato (±16.5~45.0 cents; +10c on Hold!)
        //   - Lock-In (2.60s ~ 3.00s / p >= 0.865, Full 2500K Lock): Signature Resolution Chord + Alibi MR Bloom
        // Note: Modulates pitch width (`source.detune` in cents) WITHOUT volume boosting!
        // ======================================================================
        // ======================================================================
        // 4-SECTION SYMPHONIC CONDUCTOR ENGINE (9.2s · A4 = 440.0Hz · Am9 -> Fmaj9 -> Am9)
        // Replaces solo violin with a 4-lane frequency-slotted, hall-glued orchestra:
        //   - Bus 1 (p >= 0.00 / 0.00s, 55-185Hz): Contrabass & Dark Cello Pedal (A1-A2-E3)
        //   - Bus 2 (p >= 0.27 / 0.81s, 145-1350Hz): Mellow Clarinet & Viola Inner Am9 (ducks -3dB at lock!)
        //   - Bus 3 (p >= 0.865 / 2.595s Brighten Lock!, 160-2400Hz): Am9 Velvet Horn Lock -> French Horn Choir
        //   - Bus 4 (Lock + 0.72s -> 9.20s, 215-5800Hz): Concert Harp Harmonics & Divisi Strings Hall Tail
        //   - Baton Handoff (Lock + 3.10s -> 6.60s): Seamless crossfade swell into A Twelve-Minute Alibi MR!
        // ======================================================================
        const ORCH_BUS1_BASS_URL = '/assets/sounds/orchestra/cond_bus1_bass.wav';
        const ORCH_BUS2_WOODWINDS_URL = '/assets/sounds/orchestra/cond_bus2_woodwinds_viola.wav';
        const ORCH_BUS3_HORN_URL = '/assets/sounds/orchestra/cond_bus3_french_horn.wav';
        const ORCH_BUS4_HARP_STRINGS_URL = '/assets/sounds/orchestra/cond_bus4_harp_strings_air.wav';
        const GOBO_SIG_LOCK_PRIMARY_URL = '/assets/sounds/gobo_signature_lock_chord_440hz.wav';
        const GOBO_SIG_LOCK_FALLBACK_URL = '/assets/sounds/hr_signature/proposals/hr_signature_set78_slavic_nostalgia_two_drop_horn_master.wav';

        let orchBus1Buffer = null;
        let orchBus2Buffer = null;
        let orchBus3Buffer = null;
        let orchBus4Buffer = null;
        let goboSigLockBuffer = null;
        let goboSigLockUsingElevenLabs = false;

        let orchBus1Fired = false;
        let orchBus2Fired = false;
        let goboSigLockFired = false;
        let orchBus4Scheduled = false;
        let orchActiveSources = [];
        let orchBus2GainNode = null;

        function fetchAndDecodeAudioChain(urls, onDecoded) {
          let idx = 0;
          function tryNext() {
            if (idx >= urls.length) return;
            const currentUrl = urls[idx++];
            const isPrimary = idx === 1;
            fetch(currentUrl)
              .then((r) => {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.arrayBuffer();
              })
              .then((arr) => {
                const ctx = ensureNoirAudioCtx();
                if (!ctx) return;
                return ctx.decodeAudioData(arr.slice(0)).then((decoded) => {
                  onDecoded(decoded, isPrimary, currentUrl);
                });
              })
              .catch(() => {
                tryNext();
              });
          }
          tryNext();
        }

        (function preloadOrchestralConductorStems() {
          fetchAndDecodeAudioChain([ORCH_BUS1_BASS_URL], (d) => { orchBus1Buffer = d; });
          fetchAndDecodeAudioChain([ORCH_BUS2_WOODWINDS_URL], (d) => { orchBus2Buffer = d; });
          fetchAndDecodeAudioChain([ORCH_BUS3_HORN_URL], (d) => { orchBus3Buffer = d; });
          fetchAndDecodeAudioChain([ORCH_BUS4_HARP_STRINGS_URL], (d) => { orchBus4Buffer = d; });
          fetchAndDecodeAudioChain(
            [GOBO_SIG_LOCK_PRIMARY_URL, GOBO_SIG_LOCK_FALLBACK_URL],
            (decoded, isPrimary) => {
              goboSigLockBuffer = decoded;
              goboSigLockUsingElevenLabs = isPrimary;
            }
          );
        })();

        const ORCH_TOTAL_SCORE_SEC = 9.20;
        let orchVirtualSec = 0;
        let orchConductorRunning = false;
        let orchTailRafId = null;
        let orchTailLastTickMs = 0;
        let orchBus3HornFired = false;

        function stopGoboViolinActiveRig(fadeOutSec = 0.25) {
          if (orchTailRafId) {
            cancelAnimationFrame(orchTailRafId);
            orchTailRafId = null;
          }
          orchConductorRunning = false;
          const ctx = ensureNoirAudioCtx();
          const now = ctx ? ctx.currentTime : 0;
          orchActiveSources.forEach((item) => {
            try {
              if (ctx && item.gain) {
                item.gain.gain.cancelScheduledValues(now);
                item.gain.gain.setValueAtTime(Math.max(0.0001, item.gain.gain.value || 0.015), now);
                item.gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.05, fadeOutSec));
              }
              if (item.src) {
                item.src.stop(now + Math.max(0.08, fadeOutSec + 0.04));
              }
            } catch (_) {}
          });
          orchActiveSources = [];
          orchBus2GainNode = null;
        }

        function evalConductedScoreEnvelope(scoreSec, item) {
          const u = scoreSec - item.startScoreSec;
          if (u <= 0 || u >= item.durScoreSec) return 0.0001;
          const safeIn = Math.min(item.fadeInSec, item.durScoreSec * 0.45);
          const safeOut = Math.min(item.fadeOutSec, item.durScoreSec * 0.50);
          let g = item.peakGain;
          if (u < safeIn && safeIn > 0.005) {
            g *= Math.sin((u / safeIn) * Math.PI * 0.5);
          } else if (u > item.durScoreSec - safeOut && safeOut > 0.005) {
            const rel = (u - (item.durScoreSec - safeOut)) / safeOut;
            g *= Math.pow(Math.max(0, Math.cos(rel * Math.PI * 0.5)), 1.4);
          }
          // Dynamic Sidechain Ducking on Bus 2 (-3.2dB) synced to virtual score clock when Horn Choir blooms (>= 2.595s)
          if (item.isBus2 && scoreSec > 2.595) {
            const hRel = Math.min(1, (scoreSec - 2.595) / 0.28);
            const hTail = scoreSec > 6.50 ? Math.max(0, 1 - (scoreSec - 6.50) / 1.80) : 1.0;
            g *= (1.0 - 0.38 * hRel * hTail);
          }
          return Math.max(0.0001, g);
        }

        function spawnScoreDrivenSection(buffer, startScoreSec, durScoreSec, peakGain, fadeInSec, fadeOutSec, opts = {}) {
          const ctx = ensureNoirAudioCtx();
          if (!ctx || !buffer || window.__jsfAudioMuted) return null;
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          // Keep playbackRate = 1.0 so A4 = 440.0Hz orchestral timbre NEVER pitch-shifts ("Chipmunks") during 2x hold!
          src.playbackRate.value = 1.0;

          const gain = ctx.createGain();
          const now = ctx.currentTime;
          const initGain = evalConductedScoreEnvelope(orchVirtualSec, {
            startScoreSec,
            durScoreSec,
            peakGain,
            fadeInSec,
            fadeOutSec,
            isBus2: !!opts.isBus2
          });
          gain.gain.setValueAtTime(initGain, now);

          src.connect(gain);
          gain.connect(ctx.destination);

          // If user is currently holding 2x fast-forward when a sustained stem enters, start slightly into the warm bow/breath core
          const bufOffset = (goboSpeedMultiplier > 1.0 && opts.fastOffsetSec)
            ? Math.min(opts.fastOffsetSec, Math.max(0, buffer.duration - 1.5))
            : 0;
          src.start(now + 0.012, bufOffset);

          const entry = {
            src,
            gain,
            startScoreSec,
            durScoreSec: Math.min(durScoreSec, buffer.duration - bufOffset),
            peakGain,
            fadeInSec,
            fadeOutSec,
            isBus2: !!opts.isBus2,
            stopped: false
          };
          orchActiveSources.push(entry);
          return entry;
        }

        function updateOrchestraByVirtualScoreClock(scoreSec) {
          orchVirtualSec = scoreSec;
          if (window.__jsfAudioMuted) return;
          const ctx = ensureNoirAudioCtx();
          if (!ctx) return;

          // Cue 1 (0.000s): Contrabass & Dark Cello Pedal
          if (!orchBus1Fired && scoreSec >= 0.0 && scoreSec < 3.50 && orchBus1Buffer) {
            orchBus1Fired = true;
            spawnScoreDrivenSection(orchBus1Buffer, 0.00, 5.60, 0.050, 0.88, 2.10, { fastOffsetSec: 0.18 });
          }

          // Cue 2 (0.810s = p 0.27): Clarinet & Viola Inner Am9 Harmony
          if (!orchBus2Fired && scoreSec >= 0.81 && scoreSec < 5.00 && orchBus2Buffer) {
            orchBus2Fired = true;
            const e2 = spawnScoreDrivenSection(orchBus2Buffer, 0.81, 5.40, 0.046, 1.05, 2.10, { isBus2: true, fastOffsetSec: 0.22 });
            if (e2) orchBus2GainNode = e2.gain;
          }

          // Cue 3A (2.595s = p 0.865 Exact Brighten Lock!): Beloved Am9 Velvet Horn + Cello Lock Chord
          if (!goboSigLockFired && scoreSec >= 2.595 && goboSigLockBuffer) {
            goboSigLockFired = true;
            const lockDur = goboSigLockUsingElevenLabs
              ? Math.min(3.35, goboSigLockBuffer.duration)
              : Math.min(2.4, Math.max(0.8, goboSigLockBuffer.duration - 0.95));
            spawnScoreDrivenSection(goboSigLockBuffer, 2.595, lockDur, 0.068, 0.048, 1.35);
          }

          // Cue 3B (2.895s = Lock + 0.30s): Noble Duo French Horn Fmaj9 -> Am9 Golden Swell
          if (!orchBus3HornFired && scoreSec >= 2.895 && orchBus3Buffer) {
            orchBus3HornFired = true;
            spawnScoreDrivenSection(orchBus3Buffer, 2.895, 5.55, 0.064, 0.68, 2.30, { fastOffsetSec: 0.26 });
          }

          // Cue 4 (3.315s = Lock + 0.72s -> 9.115s): Concert Harp Harmonics & Divisi Strings Cathedral Tail
          if (!orchBus4Scheduled && scoreSec >= 3.315 && orchBus4Buffer) {
            orchBus4Scheduled = true;
            spawnScoreDrivenSection(orchBus4Buffer, 3.315, 5.80, 0.052, 0.95, 2.60, { fastOffsetSec: 0.18 });
          }

          // Update every active stem's real-time gain envelope via 25ms de-zippered setTargetAtTime (tracks 1x <-> 2x instantly!)
          const now = ctx.currentTime;
          for (let i = orchActiveSources.length - 1; i >= 0; i--) {
            const item = orchActiveSources[i];
            if (scoreSec >= item.startScoreSec + item.durScoreSec + 0.08) {
              if (!item.stopped) {
                item.stopped = true;
                try {
                  item.gain.gain.setTargetAtTime(0.0001, now, 0.02);
                  item.src.stop(now + 0.09);
                } catch (_) {}
              }
              orchActiveSources.splice(i, 1);
            } else {
              const targetG = evalConductedScoreEnvelope(scoreSec, item);
              try {
                item.gain.gain.setTargetAtTime(targetG, now, 0.024);
              } catch (_) {}
            }
          }

          // Alibi MR is now deferred strictly until Location lamp click (do not auto-swell during Gobo warmup)
        }

        function tickOrchestraTailClock(perfNow) {
          orchTailRafId = null;
          if (!orchConductorRunning) return;
          if (!orchTailLastTickMs) orchTailLastTickMs = perfNow;
          const dtSec = Math.min(0.064, Math.max(0, (perfNow - orchTailLastTickMs) / 1000));
          orchTailLastTickMs = perfNow;

          const nextScoreSec = orchVirtualSec + dtSec * goboSpeedMultiplier;
          updateOrchestraByVirtualScoreClock(nextScoreSec);

          if (nextScoreSec >= ORCH_TOTAL_SCORE_SEC + 0.15) {
            orchConductorRunning = false;
            if (isHoldingFastForward && goboSpeedMultiplier > 1.0) {
              setGoboPlaybackSpeed(1.0);
            }
            return;
          }
          orchTailRafId = requestAnimationFrame(tickOrchestraTailClock);
        }

        function startOrchestraTailClockIfNeeded() {
          if (!orchConductorRunning || orchTailRafId) return;
          orchTailLastTickMs = performance.now();
          orchTailRafId = requestAnimationFrame(tickOrchestraTailClock);
        }

        function startGoboSpotlightViolinRig() {
          // Movement I (p = 0.00 / 0.00s): Curtain lifts -> Deep Contrabass & Dark Cello Pedal breathes in softly
          stopGoboViolinActiveRig(0.06);
          orchVirtualSec = 0;
          orchConductorRunning = true;
          orchBus1Fired = false;
          orchBus2Fired = false;
          goboSigLockFired = false;
          orchBus3HornFired = false;
          orchBus4Scheduled = false;

          updateOrchestraByVirtualScoreClock(0.0);
          return orchBus1Fired;
        }

        function triggerGoboSignatureLockResolution() {
          if (orchVirtualSec < 2.595) {
            orchVirtualSec = 2.595;
          }
          orchConductorRunning = true;
          updateOrchestraByVirtualScoreClock(orchVirtualSec);
          if (cinematicStep >= 2) {
            startOrchestraTailClockIfNeeded();
          }
        }

        function updateGoboViolinWiderVibratoByProgress(progressNorm) {
          const clampedP = Math.max(0, Math.min(1, progressNorm));
          // Lock 0.00s -> 3.00s orchestral score clock 1:1 to Gobo lighting warmup progress (auto-scales with 2x hold!)
          updateOrchestraByVirtualScoreClock(clampedP * (GOBO_WARMUP_DURATION_MS / 1000));
        }

        window.__getOrchestraConductorState = function() {
          const decodedCount = [orchBus1Buffer, orchBus2Buffer, orchBus3Buffer, orchBus4Buffer, goboSigLockBuffer].filter(Boolean).length;
          return {
            progress: Number((warmupVirtualElapsedMs / GOBO_WARMUP_DURATION_MS).toFixed(3)),
            virtualScoreSec: Number(orchVirtualSec.toFixed(3)),
            speedMultiplier: goboSpeedMultiplier,
            conductorRunning: orchConductorRunning,
            decodedStems: decodedCount,
            bus1ContrabassFired: orchBus1Fired,
            bus2WoodwindsViolaFired: orchBus2Fired,
            bus3FrenchHornClimaxFired: goboSigLockFired,
            bus3DuoHornSwellFired: orchBus3HornFired,
            bus4HarpStringsTailScheduled: orchBus4Scheduled,
            activeSourcesCount: orchActiveSources.length
          };
        };
        window.__getGoboViolinSyncState = window.__getOrchestraConductorState;

        let warmupVirtualElapsedMs = 0;
        let warmupLastTickTime = 0;
        let warmupRafId = null;
        const GOBO_WARMUP_DURATION_MS = 3000;

        function tickGoboWarmupClock(now) {
          warmupRafId = null;
          if (cinematicStep >= 2 || window.__underDevCardActive) return;
          if (!warmupLastTickTime) warmupLastTickTime = now;
          const dt = Math.min(64, Math.max(0, now - warmupLastTickTime));
          warmupLastTickTime = now;

          warmupVirtualElapsedMs += dt * goboSpeedMultiplier;

          // Sync full-frame border filament flashes with the tail end of the Gobo Light Warmup (70% ~ 100% of 3000ms = 2100ms ~ 3000ms)
          const p = warmupVirtualElapsedMs / GOBO_WARMUP_DURATION_MS;
          updateGoboViolinWiderVibratoByProgress(p);
          if (p >= 0.68 && p < 1.0) {
            // Exact keyframe beats matching realPhotoStep3 (68%..86.5% filament struggle -> 100% lock-in)
            let flickerAlpha = 0;
            if (p < 0.705) flickerAlpha = 0.72;
            else if (p < 0.73) flickerAlpha = 0.12;
            else if (p < 0.75) flickerAlpha = 0.88;
            else if (p < 0.77) flickerAlpha = 0.18;
            else if (p < 0.785) flickerAlpha = 0.95;
            else if (p < 0.80) flickerAlpha = 0.25;
            else if (p < 0.812) flickerAlpha = 1.05;
            else if (p < 0.824) flickerAlpha = 0.35;
            else if (p < 0.835) flickerAlpha = 1.12;
            else if (p < 0.845) flickerAlpha = 0.48;
            else if (p < 0.855) flickerAlpha = 1.18;
            else if (p < 0.865) flickerAlpha = 0.62;
            else flickerAlpha = 1.08;
            borderPaintRatio = Math.min(1.0, flickerAlpha);
            window.__borderPaintRatio = Number(borderPaintRatio.toFixed(3));
            renderCardBorderPaintCanvas(flickerAlpha);
          }

          if (warmupVirtualElapsedMs >= GOBO_WARMUP_DURATION_MS) {
            if (!goboSigLockFired) {
              triggerGoboSignatureLockResolution();
            }
            cinematicStep = 2;
            // Hand off from 0..3.0s Gobo Warmup Clock to 3.0..9.2s Symphonic Tail Clock seamlessly!
            orchVirtualSec = Math.max(orchVirtualSec, GOBO_WARMUP_DURATION_MS / 1000);
            startOrchestraTailClockIfNeeded();
            if (goboLightRig) {
              goboLightRig.classList.remove('flicker-warmup');
              goboLightRig.classList.add('stabilized');
            }
            if (goboSymbolRig) {
              goboSymbolRig.classList.add('materialized');
            }
            window.__activeDesignerFx = 'direct_ivory';
            lockFinalPureIvoryLogo('direct_ivory', true);
            if (goboSpeedMultiplier > 1.0) {
              setGoboPlaybackSpeed(goboSpeedMultiplier);
            }
          } else {
            warmupRafId = requestAnimationFrame(tickGoboWarmupClock);
          }
        }

        function unveilNoirCurtainAndStartStage(e, forceAllow = false) {
          if (e) e.stopPropagation();
          if (!forceAllow && (!noirReady || !noirPointerStartedAfterReady)) {
            return;
          }
          if (window.__noirCurtainUnveiled) return;
          window.__noirCurtainUnveiled = true;
          setNoirIntroSpeed(1.0);
          armNoirSet10AudioOnGesture();
          if (!noirSet10PlayedDuringIntro) {
            startNoirSet10SyncedPlayback(1.65, 1.60);
          }
          // Note: A Twelve-minutes alibi MR is held silent until the user clicks Location on the Salon card!

          if (noirCurtain) {
            noirCurtain.classList.add('unveiled');
          }

          // Step 1: Vintage Gobo 3-Second Warm-up Flicker ( Advances at 1x normal or 2x while holding click )
          step1Timer = setTimeout(() => {
            if (cinematicStep > 0) return;
            cinematicStep = 1;
            if (goboLightRig) {
              goboLightRig.classList.add('flicker-warmup');
            }
            if (goboSpeedMultiplier > 1.0) {
              setGoboPlaybackSpeed(goboSpeedMultiplier);
            }
            warmupVirtualElapsedMs = 0;
            warmupLastTickTime = performance.now();
            startGoboSpotlightViolinRig();
            warmupRafId = requestAnimationFrame(tickGoboWarmupClock);
          }, 120);
        }
        window.__unveilNoirCurtainAndStartStage = (e) => unveilNoirCurtainAndStartStage(e, true);

        if (noirCurtain) {
          // Hold-to-2x Fast-Forward while loading; only unlock click-to-advance once noirReady === true
          noirCurtain.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (!noirReady) {
              noirPointerStartedAfterReady = false;
              setNoirIntroSpeed(2.0);
            } else {
              noirPointerStartedAfterReady = true;
            }
          });

          window.addEventListener('mouseup', () => {
            if (noirSpeedMultiplier > 1.0) {
              setNoirIntroSpeed(1.0);
            }
          });

          noirCurtain.addEventListener('mouseleave', () => {
            if (noirSpeedMultiplier > 1.0) {
              setNoirIntroSpeed(1.0);
            }
          });

          noirCurtain.addEventListener('touchstart', () => {
            if (!noirReady) {
              noirPointerStartedAfterReady = false;
              setNoirIntroSpeed(2.0);
            } else {
              noirPointerStartedAfterReady = true;
            }
          }, { passive: true });

          noirCurtain.addEventListener('touchcancel', () => {
            setNoirIntroSpeed(1.0);
          }, { passive: true });

          noirCurtain.addEventListener('click', (e) => {
            setNoirIntroSpeed(1.0);
            if (noirReady && noirPointerStartedAfterReady) {
              unveilNoirCurtainAndStartStage(e, true);
            }
          });

          noirCurtain.addEventListener('touchend', (e) => {
            setNoirIntroSpeed(1.0);
            if (noirReady && noirPointerStartedAfterReady) {
              e.preventDefault();
              unveilNoirCurtainAndStartStage(e, true);
            }
          });

          noirCurtain.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (noirReady) {
                unveilNoirCurtainAndStartStage(e, true);
              } else {
                setNoirIntroSpeed(2.0);
              }
            }
          });

          noirCurtain.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setNoirIntroSpeed(1.0);
            }
          });
        }

        step3Timer = null;
        step4Timer = null;

        // Instant Touch Enablement (No blocking delay)
        let isTouchAllowed = true;
        window.__isTouchAllowed = true;
        if (document.body) document.body.style.cursor = 'pointer';

        // Step 6: Disabled
        step6Timer = null;

        // ======================================================================
        // 3 CURATED ~10S OPENING MASTER TRACKS (Muted / Blocked)
        // ======================================================================
        const SIGNATURE_SOUND_TRACKS = [
          {
            id: "set440_binaural_live",
            num: "1",
            name: "SET 440 · BINAURAL LIVE",
            tag: "5.0s // 19m² 살롱 바이노럴 3D 앙상블 (440Hz)",
            fullTitle: "Set 440: 19m² Dechema Atelier Live Acoustic Stems Glued Master (440Hz)",
            src: "/assets/sounds/signature_live_ensemble_440hz.wav"
          },
          {
            id: "set52_nordic",
            num: "2",
            name: "SET 52 · NORDIC CHOIR",
            tag: "7.2s // 빙하 서브드론 & 북유럽 브라스 성가",
            fullTitle: "Set 52: Nordic Sub-Glacial Drone & Brass Choir Hymn",
            src: "/assets/sounds/hr_signature/proposals/hr_signature_set52_nordic_glacial_brass_hymn_master.wav"
          },
          {
            id: "set54_rachmaninoff",
            num: "3",
            name: "SET 54 · RACHMANINOFF",
            tag: "7.8s // 라흐마니노프 첼로 노스탤지어",
            fullTitle: "Set 54: Rachmaninoff Romantic Cello & French Horn Nostalgia",
            src: "/assets/sounds/hr_signature/proposals/hr_signature_set54_rachmaninoff_cello_horn_nostalgia_master.wav"
          },
          {
            id: "set10_tutti",
            num: "4",
            name: "SET 10 · GRAND TUTTI",
            tag: "5.0s // Am ➔ Dorian ➔ Am9 Resolve",
            fullTitle: "Set 10: Grand Tutti Morph",
            src: "/assets/sounds/hr_signature/proposals/hr_signature_set10_grand_tutti_morph_master.wav"
          }
        ];
        let currentSignatureTrackIndex = 0;

        const EVOLUTION_SFX = {
          stage2: null,
          stage3: null
        };

        function playEvolutionSfx(stageNum) {
          // Blocked per Sean Park directive
          return;
        }

        let current3DEvolutionStage = 1;
        window.__current3DEvolutionStage = 1;

        function clearEvolutionTimers() {
          evolutionTimers.forEach(t => clearTimeout(t));
          evolutionTimers = [];
        }

        function setEmblemEvolutionStage(stageNum, playSound = false) {
          // Locked to Stage 1 flat Ivory emblem
          current3DEvolutionStage = 1;
          window.__current3DEvolutionStage = 1;
          return 1;
        }

        function cycleEmblemEvolutionStage() {
          return 1;
        }

        function trigger3StageEvolution() {
          // Non-flipping inspection mode: keep user on the JSF Symbol Stage
          return;
        }

        let is3DObsidianUnlocked = false;

        function trigger3DObsidianItemUnlock() {
          // Non-flipping inspection mode: keep user on the JSF Symbol Stage
          return;
        }

        function pulseGyroInteraction() {
          // Non-flipping inspection mode: keep user on the JSF Symbol Stage
          return;
        }
        window.__pulseGyroInteraction = pulseGyroInteraction;
        window.__trigger3DObsidianItemUnlock = trigger3DObsidianItemUnlock;
        window.__activateUnderDevCard = activateUnderDevCard;
        window.__hideUnderDevCardToFlatGobo = hideUnderDevCardToFlatGobo;

        window.__current3DEvolutionStage = current3DEvolutionStage;
        window.__setEmblemEvolutionStage = setEmblemEvolutionStage;
        window.__cycleEmblemEvolutionStage = cycleEmblemEvolutionStage;
        window.__trigger3StageEvolution = trigger3StageEvolution;

        function selectSignatureTrack(idxOrId) {
          let targetIdx = 0;
          if (typeof idxOrId === 'number') {
            targetIdx = (idxOrId + SIGNATURE_SOUND_TRACKS.length) % SIGNATURE_SOUND_TRACKS.length;
          } else if (typeof idxOrId === 'string') {
            const found = SIGNATURE_SOUND_TRACKS.findIndex(t => t.id === idxOrId);
            if (found !== -1) targetIdx = found;
          }
          currentSignatureTrackIndex = targetIdx;
          const track = SIGNATURE_SOUND_TRACKS[currentSignatureTrackIndex];
          const badgeText = document.getElementById('hud-track-name');
          if (badgeText) {
            badgeText.textContent = track.name;
          }
          const nowTitle = document.getElementById('now-track-title');
          if (nowTitle) {
            nowTitle.textContent = track.name;
          }
          // Highlight active button in Sound Suite Dock
          document.querySelectorAll('.sound-suite-btn').forEach((btn, i) => {
            if (i === currentSignatureTrackIndex) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
          window.__currentSignatureTrack = track;
          console.log(`[SignatureSound] Loaded: ${track.fullTitle} (Volume: ${(CALIBRATION_AUDIO_VOLUME*100).toFixed(0)}%)`);
          return track;
        }

        window.__SIGNATURE_SOUND_TRACKS__ = SIGNATURE_SOUND_TRACKS;
        window.__selectSignatureTrack = selectSignatureTrack;

        // Apply initial track (Set 52 Nordic Choir)
        selectSignatureTrack(0);

        function cycleSignatureTrack() {
          selectSignatureTrack(currentSignatureTrackIndex + 1);
        }

        // Bind Sound Suite Dock buttons
        document.querySelectorAll('.sound-suite-btn').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trackIdx = parseInt(btn.dataset.track, 10);
            selectSignatureTrack(trackIdx);
          });
        });

        // Bind interactive Track Selector Pill, Track Name & Speaker Icon
        const trackPill = document.getElementById('hud-track-pill');
        if (trackPill) {
          trackPill.addEventListener('click', (e) => {
            e.stopPropagation();
            cycleSignatureTrack();
          });
        }
        const trackNameEl = document.getElementById('hud-track-name');
        if (trackNameEl) {
          trackNameEl.addEventListener('click', (e) => {
            e.stopPropagation();
            cycleSignatureTrack();
          });
        }
        const speakerBtn = document.getElementById('hud-speaker-btn');
        if (speakerBtn) {
          speakerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cycleSignatureTrack();
          });
        }
        const twTrackNow = document.getElementById('typewriter-track-now');
        if (twTrackNow) {
          twTrackNow.addEventListener('click', (e) => {
            e.stopPropagation();
            cycleSignatureTrack();
          });
        }

        // Keyboard Shortcuts 1 ~ 3 to instantly audition any of the 3 opening master tracks
        // Keyboard Shortcut 'S' / 's' to manually cycle the 3-stage 3D evolution for visual inspection
        window.addEventListener('keydown', (e) => {
          if (e.target && ['input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= SIGNATURE_SOUND_TRACKS.length) {
            selectSignatureTrack(num - 1);
          }
        });

        // ======================================================================
        // STEP 4: ON-CLICK CALIBRATION SEQUENCE (5.0s COUNTDOWN)
        // 01 Ivory Logo & JUST.SEAN.FLOWS remain visible with moody darkness
        // Accelerating flicker ("켜질랑말랑 + 무적시간 끝날 때처럼 주기가 빨라짐")
        // 4% Volume (40% of previous) + Right Phone Volume HUD (30%) + Typewriter
        // ======================================================================
                // ======================================================================
        // SIGNATURE SOUND ACOUSTIC-LIGHTING ENGINE
        // 1:1 Audio Sync with Set 52 (Nordic Glacial Drone & Brass Choir Hymn)
        // 0.0s ~ 1.2s: Glacial Sub-Bass Drone (28Hz pulse, 2200K Amber warmth, voltage flicker)
        // 1.2s ~ 3.5s: Nordic Brass Choir Hymn (Instrument switch, 2800K Gold swell, chord blooming)
        // 3.5s ~ 7.2s: Cathedral Reverb Tail (Smooth stabilization, zero jitter, pure calm light)
        // ======================================================================
        const SIGNATURE_ACOUSTIC_PROFILES = {"set52":{"duration":7.16,"step_sec":0.05,"count":143,"envelope":[[0.432,0.504,0.305],[0.528,0.315,0.455],[0.627,0.385,0.54],[0.68,0.531,0.602],[0.604,0.528,0.574],[0.681,0.351,0.637],[0.797,0.372,0.658],[0.765,0.456,0.686],[0.758,0.64,0.729],[0.683,0.645,0.655],[0.849,0.751,0.776],[0.865,0.457,0.789],[0.82,0.583,0.754],[0.838,0.401,0.838],[0.865,0.313,0.808],[0.788,0.31,0.786],[0.939,0.307,0.864],[0.752,0.317,0.722],[0.684,0.318,0.677],[0.737,0.35,0.77],[0.828,0.303,0.802],[0.846,0.291,0.771],[0.73,0.325,0.707],[0.855,0.382,0.752],[0.924,0.331,0.812],[0.849,0.339,0.773],[0.921,0.351,0.836],[0.943,0.474,0.912],[0.932,0.462,0.795],[0.531,0.436,0.498],[0.447,0.326,0.446],[0.512,0.366,0.436],[0.513,0.429,0.472],[0.49,0.386,0.477],[0.597,0.563,0.552],[0.688,0.584,0.671],[0.665,0.469,0.697],[0.738,0.566,0.671],[0.702,0.458,0.588],[0.721,0.41,0.699],[0.87,0.742,0.767],[0.885,0.68,0.843],[0.879,0.769,0.737],[0.969,1.0,0.805],[0.65,0.547,0.534],[0.514,0.418,0.452],[0.441,0.419,0.411],[0.362,0.262,0.377],[0.539,0.403,0.483],[0.532,0.464,0.501],[0.538,0.424,0.48],[0.653,0.582,0.631],[0.62,0.49,0.654],[0.766,0.592,0.743],[0.766,0.59,0.683],[0.73,0.376,0.666],[0.843,0.487,0.783],[0.786,0.499,0.752],[0.828,0.441,0.745],[0.844,0.476,0.83],[0.753,0.473,0.66],[0.711,0.436,0.713],[0.788,0.43,0.743],[0.729,0.479,0.776],[0.667,0.499,0.673],[0.878,0.543,0.854],[0.895,0.553,0.888],[0.776,0.512,0.797],[0.77,0.531,0.734],[0.884,0.527,0.82],[0.932,0.429,0.987],[1.0,0.487,1.0],[0.913,0.493,0.848],[0.842,0.471,0.722],[0.873,0.562,0.793],[0.863,0.359,0.825],[0.847,0.398,0.798],[0.814,0.519,0.745],[0.656,0.515,0.662],[0.51,0.622,0.446],[0.406,0.41,0.363],[0.347,0.329,0.297],[0.311,0.278,0.246],[0.268,0.215,0.222],[0.249,0.185,0.205],[0.223,0.153,0.201],[0.156,0.102,0.139],[0.12,0.08,0.109],[0.135,0.064,0.118],[0.124,0.046,0.118],[0.1,0.039,0.102],[0.102,0.031,0.095],[0.086,0.025,0.083],[0.069,0.018,0.06],[0.063,0.019,0.062],[0.061,0.015,0.059],[0.053,0.01,0.049],[0.053,0.008,0.048],[0.039,0.005,0.037],[0.033,0.004,0.029],[0.036,0.004,0.032],[0.033,0.004,0.027],[0.027,0.003,0.024],[0.026,0.002,0.024],[0.024,0.002,0.022],[0.021,0.002,0.019],[0.017,0.002,0.016],[0.016,0.001,0.015],[0.015,0.002,0.013],[0.014,0.001,0.012],[0.01,0.001,0.01],[0.009,0.0,0.009],[0.009,0.001,0.008],[0.008,0.001,0.007],[0.005,0.0,0.005],[0.004,0.0,0.004],[0.004,0.001,0.004],[0.005,0.001,0.004],[0.004,0.001,0.004],[0.005,0.0,0.004],[0.004,0.0,0.004],[0.004,0.0,0.003],[0.003,0.0,0.003],[0.003,0.0,0.002],[0.002,0.0,0.002],[0.003,0.0,0.002],[0.002,0.0,0.002],[0.001,0.0,0.002],[0.001,0.0,0.001],[0.001,0.0,0.001],[0.001,0.0,0.001],[0.001,0.0,0.001],[0.001,0.0,0.001],[0.001,0.0,0.001],[0.001,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]]},"set54":{"duration":7.8,"step_sec":0.05,"count":155,"envelope":[[0.217,0.257,0.158],[0.36,0.374,0.367],[0.446,0.379,0.39],[0.437,0.236,0.362],[0.417,0.218,0.364],[0.622,0.584,0.61],[0.635,0.359,0.563],[0.658,0.566,0.658],[0.622,0.463,0.681],[0.587,0.528,0.525],[0.524,0.466,0.579],[0.554,0.51,0.588],[0.789,0.563,0.792],[0.716,0.323,0.706],[0.814,0.414,0.678],[0.815,0.512,0.72],[0.925,0.439,0.773],[0.891,0.696,0.861],[0.942,0.455,0.869],[0.975,0.748,0.912],[0.903,0.711,1.0],[0.961,0.446,0.987],[0.848,0.676,0.956],[0.881,0.751,0.892],[0.789,0.471,0.897],[0.935,0.443,0.936],[0.928,0.279,0.913],[0.76,0.624,0.852],[0.714,0.613,0.65],[0.598,0.563,0.672],[0.687,0.602,0.74],[0.68,0.849,0.69],[0.585,0.352,0.624],[0.756,0.281,0.732],[0.814,0.378,0.72],[0.694,0.353,0.795],[0.78,0.598,0.816],[0.753,0.802,0.866],[0.761,0.414,0.754],[0.75,0.575,0.812],[0.82,0.27,0.825],[0.893,0.511,0.866],[0.963,0.438,0.868],[0.751,0.348,0.687],[0.529,0.235,0.593],[0.546,0.219,0.662],[0.587,0.345,0.686],[0.644,0.63,0.729],[0.645,0.222,0.699],[0.708,0.326,0.76],[0.621,0.489,0.692],[0.576,0.528,0.673],[0.799,0.454,0.898],[0.834,0.421,0.902],[0.777,0.45,0.837],[0.614,0.485,0.659],[0.715,0.556,0.791],[0.772,0.618,0.838],[0.782,0.491,0.831],[0.793,0.548,0.792],[1.0,0.832,0.989],[0.923,0.371,0.949],[0.615,0.403,0.608],[0.678,0.244,0.642],[0.904,0.799,0.89],[0.806,0.656,0.781],[0.649,0.476,0.665],[0.771,0.377,0.792],[0.816,0.403,0.864],[0.748,0.272,0.768],[0.832,0.286,0.833],[0.85,0.413,0.762],[0.797,0.317,0.72],[0.81,0.304,0.79],[0.664,0.278,0.613],[0.899,0.332,0.815],[0.963,0.525,0.893],[0.864,0.373,0.869],[0.934,0.84,0.89],[0.899,0.633,0.832],[0.738,0.306,0.737],[0.761,0.598,0.716],[0.738,0.485,0.658],[0.874,1.0,0.819],[0.804,0.77,0.683],[0.651,0.545,0.605],[0.569,0.293,0.484],[0.538,0.194,0.391],[0.601,0.102,0.41],[0.453,0.162,0.326],[0.315,0.138,0.249],[0.239,0.091,0.185],[0.234,0.081,0.171],[0.148,0.209,0.123],[0.124,0.137,0.116],[0.132,0.059,0.112],[0.111,0.078,0.093],[0.078,0.219,0.072],[0.072,0.13,0.058],[0.05,0.142,0.043],[0.055,0.103,0.048],[0.051,0.063,0.042],[0.033,0.032,0.033],[0.031,0.045,0.028],[0.033,0.081,0.028],[0.032,0.043,0.026],[0.029,0.034,0.024],[0.02,0.027,0.017],[0.021,0.038,0.018],[0.026,0.043,0.02],[0.018,0.044,0.013],[0.017,0.03,0.014],[0.016,0.024,0.011],[0.015,0.041,0.012],[0.012,0.023,0.01],[0.011,0.016,0.009],[0.011,0.041,0.008],[0.006,0.03,0.005],[0.005,0.028,0.005],[0.009,0.018,0.007],[0.007,0.021,0.006],[0.005,0.009,0.004],[0.006,0.021,0.005],[0.006,0.014,0.004],[0.005,0.018,0.004],[0.004,0.023,0.003],[0.004,0.016,0.003],[0.004,0.025,0.003],[0.003,0.017,0.002],[0.003,0.013,0.003],[0.003,0.014,0.003],[0.004,0.008,0.003],[0.004,0.011,0.003],[0.004,0.006,0.003],[0.003,0.005,0.002],[0.002,0.017,0.001],[0.002,0.006,0.002],[0.002,0.016,0.001],[0.001,0.011,0.001],[0.002,0.004,0.001],[0.001,0.006,0.001],[0.001,0.007,0.001],[0.001,0.006,0.001],[0.001,0.004,0.001],[0.001,0.005,0.001],[0.001,0.005,0.001],[0.001,0.004,0.0],[0.001,0.007,0.001],[0.001,0.006,0.001],[0.001,0.005,0.001],[0.001,0.006,0.001],[0.0,0.003,0.0],[0.0,0.005,0.0],[0.0,0.006,0.0],[0.0,0.003,0.0]]},"set10":{"duration":5.0,"step_sec":0.05,"count":66,"envelope":[[0.882,0.459,0.693],[0.858,0.953,0.575],[0.874,0.49,0.656],[0.873,0.439,0.702],[0.873,0.495,0.626],[0.872,0.51,0.659],[0.869,0.489,0.592],[0.872,0.6,0.611],[0.884,0.421,0.752],[0.882,0.454,0.634],[0.894,0.505,0.675],[0.891,0.552,0.724],[0.88,0.456,0.686],[0.895,0.571,0.785],[0.902,0.355,0.702],[0.901,0.454,0.782],[0.957,0.718,0.82],[0.931,0.84,0.798],[0.908,0.584,0.706],[0.952,0.321,0.781],[0.961,0.351,0.779],[0.946,0.757,0.751],[0.943,0.27,0.855],[0.962,0.74,0.994],[0.963,0.475,0.832],[0.944,0.448,0.944],[0.974,0.492,0.821],[0.997,0.65,1.0],[1.0,0.24,0.927],[0.944,0.587,0.818],[0.892,0.326,0.681],[0.863,0.503,0.641],[0.883,0.261,0.693],[0.869,0.327,0.691],[0.844,0.474,0.614],[0.853,0.424,0.594],[0.845,0.382,0.584],[0.847,0.355,0.589],[0.855,0.671,0.573],[0.83,0.494,0.557],[0.838,0.426,0.658],[0.842,0.719,0.644],[0.848,0.237,0.619],[0.842,0.639,0.735],[0.855,0.873,0.787],[0.849,0.82,0.849],[0.758,1.0,0.953],[0.763,0.924,0.911],[0.538,0.481,0.6],[0.517,0.692,0.601],[0.424,0.566,0.555],[0.367,0.422,0.37],[0.295,0.416,0.349],[0.241,0.293,0.224],[0.164,0.247,0.145],[0.15,0.214,0.145],[0.059,0.088,0.059],[0.036,0.05,0.036],[0.025,0.04,0.026],[0.018,0.022,0.016],[0.021,0.025,0.024],[0.016,0.017,0.021],[0.018,0.017,0.018],[0.016,0.018,0.015],[0.014,0.026,0.017],[0.015,0.027,0.021]]}};

        let flickerAnimId = null;
        let acousticAnimId = null;
        let continuousBreathingId = null;
        let currentAcousticScale = 1.0;
        let currentAcousticBrightness = 1.0;
        let currentAcousticPhase = 'idle';

        function getAcousticFrame(trackId, timeSec) {
          const cleanId = (trackId || 'set52').split('_')[0];
          const profile = SIGNATURE_ACOUSTIC_PROFILES[cleanId] || SIGNATURE_ACOUSTIC_PROFILES['set52'];
          if (!profile || !profile.envelope || profile.envelope.length === 0) {
            return [0.5, 0.5, 0.5];
          }
          const tNorm = Math.max(0, timeSec % profile.duration);
          const idx = Math.min(profile.envelope.length - 1, Math.floor(tNorm / profile.step_sec));
          return profile.envelope[idx];
        }

        function getRealTimeAcousticPulse(timeSec) {
          const trackKey = (SIGNATURE_SOUND_TRACKS[currentSignatureTrackIndex]?.id || 'set52').split('_')[0];
          const [rms, subBass, midBrass] = getAcousticFrame(trackKey, timeSec);
          return Math.max(0.0, Math.min(1.0, rms * 0.55 + subBass * 0.25 + midBrass * 0.35));
        }

        function startAcousticSignatureFlicker(durationMs, onComplete) {
          if (flickerAnimId) cancelAnimationFrame(flickerAnimId);
          if (acousticAnimId) cancelAnimationFrame(acousticAnimId);
          if (continuousBreathingId) cancelAnimationFrame(continuousBreathingId);

          const startT = performance.now();
          const rimGlow = document.getElementById('gobo-rim-glow');

          function loop(now) {
            const elapsed = now - startT;
            const progress = Math.min(1.0, elapsed / durationMs);

            // Audio synchronization: track goboAudio currentTime
            const tAudio = (goboAudio && !goboAudio.paused) ? goboAudio.currentTime : (elapsed / 1000.0);
            const trackKey = (SIGNATURE_SOUND_TRACKS[currentSignatureTrackIndex]?.id || 'set52').split('_')[0];
            const [rms, subBass, midBrass] = getAcousticFrame(trackKey, tAudio);

            let brightness = 1.0;
            let opacity = 1.0;
            let contrast = 1.0;
            let sepia = 0.20;
            let scale = 1.0;
            let glowBlur = 24;

            if (tAudio < 1.20) {
              // -------------------------------------------------------------
              // Phase 1: Glacial Sub-Bass Drone (28Hz)
              // -------------------------------------------------------------
              currentAcousticPhase = 'subdrone';
              // 28Hz sub-bass micro-oscillation
              const subWave = Math.sin(tAudio * 28.0 * 2 * Math.PI);
              // Voltage struggle / '켜질랑말랑' modulated by 28Hz sub-bass
              const filament = 0.26 + subBass * 0.38 + subWave * 0.12 * subBass;
              brightness = Math.max(0.18, Math.min(0.82, filament));
              opacity = Math.max(0.35, Math.min(0.85, 0.35 + subBass * 0.48));
              contrast = 1.15;
              sepia = 0.55; // 2200K Deep Amber
              scale = 1.0 + subBass * 0.016;
              glowBlur = 16 + subBass * 14;

            } else if (tAudio < 3.50) {
              // -------------------------------------------------------------
              // Phase 2: Nordic Brass Choir Hymn (악기 전환 & 화음 개화)
              // -------------------------------------------------------------
              currentAcousticPhase = 'brass_hymn';
              // 악기 전환! 2800K 황금빛 광채로 피어나며 브라스 화음(midBrass)에 1:1 반응
              const brassNorm = Math.pow(midBrass, 1.2);
              brightness = Math.max(0.70, Math.min(1.35, 0.68 + brassNorm * 0.62));
              opacity = Math.max(0.75, Math.min(1.0, 0.72 + brassNorm * 0.28));
              contrast = 1.0 + (brightness - 1.0) * 0.25;
              sepia = 0.18; // 2800K Warm Gold
              scale = 1.0 + brassNorm * 0.045; // Beam expands with brass swell
              glowBlur = 28 + brassNorm * 26;

            } else if (tAudio < 7.16) {
              // -------------------------------------------------------------
              // Phase 3: Cathedral Reverb Tail (대성당 3.5초 잔향 & 완벽한 안정화)
              // -------------------------------------------------------------
              currentAcousticPhase = 'reverb_tail';
              const tailProgress = Math.min(1.0, (tAudio - 3.50) / 2.2);
              const settleEase = 1.0 - Math.pow(1.0 - tailProgress, 2);
              brightness = 1.0 + (0.15 * (1.0 - settleEase)) + rms * 0.06;
              opacity = 1.0;
              contrast = 1.0;
              sepia = 0.15 * (1.0 - settleEase);
              scale = 1.0 + (0.012 * (1.0 - settleEase));
              glowBlur = 24;
            } else {
              // Loop or post-duration: calm living breath
              currentAcousticPhase = 'stabilized';
              brightness = 1.0 + midBrass * 0.06;
              opacity = 1.0;
              scale = 1.0 + subBass * 0.012;
            }

            currentAcousticScale = scale;
            currentAcousticBrightness = brightness;

            if (goboLightRig) {
              goboLightRig.style.filter = 'brightness(' + brightness.toFixed(3) + ') contrast(' + contrast.toFixed(3) + ') sepia(' + sepia.toFixed(3) + ')';
              goboLightRig.style.opacity = opacity.toFixed(3);
            }
            if (rimGlow) {
              rimGlow.style.opacity = (opacity * 0.85).toFixed(3);
              rimGlow.style.filter = 'blur(' + glowBlur.toFixed(1) + 'px)';
            }

            // Dynamic live audio pulse
            audioPulse = getRealTimeAcousticPulse(tAudio);

            if (progress < 1.0) {
              acousticAnimId = requestAnimationFrame(loop);
            } else {
              acousticAnimId = null;
              if (goboLightRig) {
                goboLightRig.classList.add('stabilized');
              }
              if (onComplete) onComplete();
              startContinuousAcousticBreathing();
            }
          }

          acousticAnimId = requestAnimationFrame(loop);
          flickerAnimId = acousticAnimId; // Maintain backwards compatibility
        }

        function startContinuousAcousticBreathing() {
          if (continuousBreathingId) cancelAnimationFrame(continuousBreathingId);
          const rimGlow = document.getElementById('gobo-rim-glow');

          function breathe() {
            if (goboAudio && !goboAudio.paused) {
              const tAudio = goboAudio.currentTime;
              const trackKey = (SIGNATURE_SOUND_TRACKS[currentSignatureTrackIndex]?.id || 'set52').split('_')[0];
              const [rms, subBass, midBrass] = getAcousticFrame(trackKey, tAudio);

              const breatheScale = 1.0 + subBass * 0.018;
              const breatheBrightness = 1.0 + midBrass * 0.08;
              currentAcousticScale = breatheScale;
              currentAcousticBrightness = breatheBrightness;

              if (goboLightRig && currentGoboStage === 1) {
                goboLightRig.style.filter = 'brightness(' + breatheBrightness.toFixed(3) + ') contrast(1.0) sepia(0.08)';
                goboLightRig.style.opacity = '1.0';
              }
              if (rimGlow && currentGoboStage === 1) {
                rimGlow.style.opacity = (0.85 + midBrass * 0.15).toFixed(3);
              }
              audioPulse = getRealTimeAcousticPulse(tAudio);
            }
            continuousBreathingId = requestAnimationFrame(breathe);
          }

          continuousBreathingId = requestAnimationFrame(breathe);
        }

        function startAcceleratingFlicker(durationMs, onComplete) {
          startAcousticSignatureFlicker(durationMs, onComplete);
        }


        // Chic Typewriter Animation:
        // Line 1: Volume 30% (types first -> triggers 24K gold neon pulse)
        // Line 2: For better experience (types second)
        function runTypewriterEffect() {
          const line1 = "Volume 30%";
          const line2 = "For better experience";
          const elVol = document.getElementById('tw-text-vol');
          const elSub = document.getElementById('tw-text-sub');
          const curVol = document.getElementById('tw-cursor-vol');
          const curSub = document.getElementById('tw-cursor-sub');
          const lineVolBox = document.getElementById('typewriter-line-vol');

          if (!elVol || !elSub) return;
          elVol.textContent = '';
          elSub.textContent = '';
          if (curVol) curVol.style.display = 'inline-block';
          if (curSub) curSub.style.display = 'none';
          if (lineVolBox) lineVolBox.classList.remove('neon-active');

          let i = 0;
          function typeVol() {
            if (i < line1.length) {
              elVol.textContent += line1.charAt(i);
              i++;
              setTimeout(typeVol, 42);
            } else {
              // Line 1 finished! Pulse with gold neon light
              if (curVol) curVol.style.display = 'none';
              if (curSub) curSub.style.display = 'inline-block';
              if (lineVolBox) lineVolBox.classList.add('neon-active');

              // Brief pause before line 2
              setTimeout(() => {
                let j = 0;
                function typeSub() {
                  if (j < line2.length) {
                    elSub.textContent += line2.charAt(j);
                    j++;
                    setTimeout(typeSub, 36);
                  } else {
                    // Line 2 finished!
                    if (curSub) {
                      setTimeout(() => { curSub.style.display = 'none'; }, 1600);
                    }
                    const nowIndicator = document.getElementById('typewriter-track-now');
                    if (nowIndicator) {
                      nowIndicator.classList.add('visible');
                    }
                  }
                }
                typeSub();
              }, 200);
            }
          }

          setTimeout(typeVol, 160);
        }

        // Realistic Smartphone Vertical Volume Pill HUD Animation
        function animatePhoneVolumeHud() {
          const hud = document.getElementById('mobile-volume-hud');
          const fill = document.getElementById('hud-slider-fill');
          if (!hud || !fill) return;

          hud.classList.remove('snapped-glow');
          hud.classList.add('visible');
          fill.style.transition = 'none';
          fill.style.height = '0%';

          // Dynamic swell to 48% at t=320ms
          setTimeout(() => {
            fill.style.transition = 'height 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
            fill.style.height = '48%';
          }, 320);

          // Snaps cleanly down to 30% at t=800ms and pulses with golden glow
          setTimeout(() => {
            fill.style.transition = 'height 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)';
            fill.style.height = '30%';
            hud.classList.add('snapped-glow');
          }, 800);
        }

        // Cinematic Sound Shutter [ ||| VOLUME 30% ||| ] Activation, Typewriter Effect & Organic Absorption
        function activateSoundShutter() {
          const shutter = document.getElementById('sound-shutter-container');
          if (!shutter) return;
          shutter.classList.remove('absorbed');
          shutter.classList.add('active', 'pulsing');

          // Typewriter animation: VOLUME 30% + HEADPHONES RECOMMENDED
          const titleEl = shutter.querySelector('.shutter-text');
          const subEl = shutter.querySelector('.shutter-sub-caption');
          const titleStr = 'VOLUME 30%';
          const subStr = 'HEADPHONES RECOMMENDED';

          if (titleEl) titleEl.textContent = '';
          if (subEl) subEl.textContent = '';

          let charIdx = 0;
          function typeShutterTitle() {
            if (charIdx < titleStr.length) {
              if (titleEl) titleEl.textContent += titleStr.charAt(charIdx);
              charIdx++;
              setTimeout(typeShutterTitle, 35);
            } else {
              let subIdx = 0;
              function typeShutterSub() {
                if (subIdx < subStr.length) {
                  if (subEl) subEl.textContent += subStr.charAt(subIdx);
                  subIdx++;
                  setTimeout(typeShutterSub, 25);
                }
              }
              setTimeout(typeShutterSub, 120);
            }
          }
          setTimeout(typeShutterTitle, 60);

          // Sound check 5.0s duration per Sean's directive ("볼륨 안내 문구 1.5초 더 늘려줘"):
          setTimeout(() => {
            if (shutter) {
              shutter.classList.remove('pulsing');
              shutter.classList.add('absorbed');
            }
            // Trigger 3D Obsidian Item Unlock immediately as shutter absorbs!
            trigger3DObsidianItemUnlock();
          }, 5000);
        }

        // Step 4 (On-Click / Touch on Symbol): Stay on Symbol Stage for free optical inspection & long-press frame upgrades!
        function startGoboExperience() {
          return;
        }

        // STAGE 2: Keep on Symbol Stage (flip strictly via corner ↺ button)
        function transitionToGoboStage2() {
          return;
        }

        // 3. TRANSITION TO NEXT CHAPTER (3D FLOATER FRAME / ATELIER)
        function transitionToNextChapter() {
          if (currentGoboStage >= 3) return;
          currentGoboStage = 3;

          // Fade out calibration whisper audio cleanly so it does not clash with Atelier audio
          if (goboAudio && !goboAudio.paused) {
            const fadeInterval = setInterval(() => {
              try {
                if (goboAudio.volume > 0.02) {
                  goboAudio.volume = Math.max(0, goboAudio.volume - 0.02);
                } else {
                  goboAudio.pause();
                  clearInterval(fadeInterval);
                }
              } catch (_) {
                clearInterval(fadeInterval);
              }
            }, 60);
          }

          if (symbolTrigger) {
            symbolTrigger.classList.add('stage-dissolved');
          }
          if (symbolStage) {
            symbolStage.style.opacity = '0';
            symbolStage.style.pointerEvents = 'none';
            symbolStage.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
              symbolStage.style.display = 'none';
            }, 900);
          }

          if (floaterContainer) {
            floaterContainer.classList.add('active');
          }
        }

        // 4.1 CRISP 24K GOLD MICRO-SPARK BURST ENGINE (#center-spark-burst)
        function initCenterSparkEngine() {
          const sparkCanvas = document.getElementById('center-spark-burst');
          if (!sparkCanvas) return;
          const sparkCtx = sparkCanvas.getContext('2d');
          if (!sparkCtx) return;

          const W = 976;
          const H = 1095;
          sparkCanvas.width = W;
          sparkCanvas.height = H;

          let sparks = [];
          let sparkFlare = { active: false, radius: 0, maxRadius: 46, alpha: 0 };
          let sparkAnimId = null;

          triggerCenterSparkBurst = function() {
            const focalX = 488; // Center of emblem (976 / 2)
            const focalY = 398; // Optical focal point of wine-clef emblem

            sparks = [];
            const count = 42;
            for (let i = 0; i < count; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 2.5 + Math.random() * 8.5;
              sparks.push({
                x: focalX,
                y: focalY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                drag: 0.93 + Math.random() * 0.04,
                gravity: 0.06 + Math.random() * 0.08,
                radius: 0.9 + Math.random() * 1.5,
                alpha: 1.0,
                decay: 0.022 + Math.random() * 0.024,
                color: i % 4 === 0 ? '#ffffff' : (i % 4 === 1 ? '#fff4bd' : (i % 4 === 2 ? '#f3d489' : '#dfb15b')),
                trail: []
              });
            }

            sparkFlare = { active: true, radius: 4, maxRadius: 46, alpha: 0.9 };
            window.__centerSparkBurstTriggered = true;
            window.__centerSparkActive = true;

            function renderSparks() {
              sparkCtx.clearRect(0, 0, W, H);

              if (sparkFlare.active) {
                sparkFlare.radius += (sparkFlare.maxRadius - sparkFlare.radius) * 0.22;
                sparkFlare.alpha -= 0.045;
                if (sparkFlare.alpha > 0.01) {
                  const grad = sparkCtx.createRadialGradient(focalX, focalY, 0, focalX, focalY, sparkFlare.radius);
                  grad.addColorStop(0.0, `rgba(255, 255, 240, ${sparkFlare.alpha})`);
                  grad.addColorStop(0.35, `rgba(243, 212, 137, ${(sparkFlare.alpha * 0.65).toFixed(3)})`);
                  grad.addColorStop(1.0, 'rgba(223, 177, 91, 0)');
                  sparkCtx.fillStyle = grad;
                  sparkCtx.beginPath();
                  sparkCtx.arc(focalX, focalY, sparkFlare.radius, 0, Math.PI * 2);
                  sparkCtx.fill();
                } else {
                  sparkFlare.active = false;
                }
              }

              let aliveCount = 0;
              for (let i = 0; i < sparks.length; i++) {
                const s = sparks[i];
                if (s.alpha <= 0.02) continue;
                aliveCount++;

                s.trail.push({ x: s.x, y: s.y, alpha: s.alpha });
                if (s.trail.length > 5) s.trail.shift();

                s.x += s.vx;
                s.y += s.vy;
                s.vx *= s.drag;
                s.vy = s.vy * s.drag + s.gravity;
                s.alpha -= s.decay;

                if (s.trail.length >= 2) {
                  sparkCtx.beginPath();
                  sparkCtx.moveTo(s.trail[0].x, s.trail[0].y);
                  for (let k = 1; k < s.trail.length; k++) {
                    sparkCtx.lineTo(s.trail[k].x, s.trail[k].y);
                  }
                  sparkCtx.strokeStyle = s.color;
                  sparkCtx.globalAlpha = Math.max(0, s.alpha * 0.7);
                  sparkCtx.lineWidth = s.radius * 0.8;
                  sparkCtx.lineCap = 'round';
                  sparkCtx.stroke();
                }

                sparkCtx.beginPath();
                sparkCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                sparkCtx.fillStyle = s.color;
                sparkCtx.globalAlpha = Math.max(0, s.alpha);
                sparkCtx.shadowColor = '#f3d489';
                sparkCtx.shadowBlur = 6;
                sparkCtx.fill();
                sparkCtx.shadowBlur = 0;
              }

              sparkCtx.globalAlpha = 1.0;

              if (aliveCount > 0 || sparkFlare.active) {
                sparkAnimId = requestAnimationFrame(renderSparks);
              } else {
                sparkCtx.clearRect(0, 0, W, H);
                window.__centerSparkActive = false;
              }
            }

            if (sparkAnimId) cancelAnimationFrame(sparkAnimId);
            sparkAnimId = requestAnimationFrame(renderSparks);
          };
        }

        // 4.2 24K GOLD CAUSTICS BLOOM & CHAMPAGNE SPARKLING EFFERVESCENCE ENGINE (#gobo-wine-canvas)
        // Red liquid, red waves, and artificial paint completely eliminated.
        // 100% of the authentic 3D photorealistic ivory sculpture (#emblem-img-v1) is preserved.
        function initWineEngine() {
          if (!goboWineCanvas) return;
          const ctx = goboWineCanvas.getContext('2d');
          if (!ctx) return;

          const W = 976;
          const H = 1095;
          goboWineCanvas.width = W;
          goboWineCanvas.height = H;

          const scale = 1.12;
          const nw = 272; // Math.round(243 * 1.12)
          const nh = 636; // Math.round(568 * 1.12)
          const ox = 352; // (976 - 272) / 2
          const oy = 190; // Math.round(1095 * 0.1735)

          // Preload canonical JSF Glass Frame & Wine Bowl Mask assets
          const frameImg = new Image();
          let frameLoaded = false;
          frameImg.onload = () => { frameLoaded = true; };
          frameImg.src = '/assets/jsf_symbol_glass_frame.png';
          if (frameImg.complete && frameImg.naturalWidth > 0) frameLoaded = true;

          const maskImg = new Image();
          let maskLoaded = false;
          let maskPrepared = false;
          const alphaMaskCanvas = document.createElement('canvas');
          alphaMaskCanvas.width = nw;
          alphaMaskCanvas.height = nh;
          const aCtx = alphaMaskCanvas.getContext('2d', { willReadFrequently: true });

          function prepareMask() {
            if (maskPrepared || !maskImg.naturalWidth) return;
            aCtx.drawImage(maskImg, 0, 0, nw, nh);
            const imgData = aCtx.getImageData(0, 0, nw, nh);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              d[i + 3] = d[i]; // Convert luminance to true alpha channel
            }
            aCtx.putImageData(imgData, 0, 0);
            maskPrepared = true;
          }

          maskImg.onload = () => {
            maskLoaded = true;
            prepareMask();
          };
          maskImg.src = '/assets/jsf_symbol_wine_mask.png';
          if (maskImg.complete && maskImg.naturalWidth > 0) {
            maskLoaded = true;
            prepareMask();
          }

          // Offscreen canvas for mask-clipped 24K gold caustics & effervescence rendering
          const offCanvas = document.createElement('canvas');
          offCanvas.width = nw;
          offCanvas.height = nh;
          const offCtx = offCanvas.getContext('2d');

          // Bowl geometry in local (nw x nh) space:
          const localBowlBottom = 230 * scale; // ~257.6px
          const localCenterX = nw * 0.50; // 136px

          // Expose state for automated verification
          window.__wineCausticsActive = true;
          window.__wineSparklingBubblesCount = wineBubbles.length;
          window.__getWineCausticBloomAlpha = () => causticBloomAlpha;

          let lastFrameT = performance.now();
          function renderWine(t) {
            const dt = Math.min(0.05, Math.max(0.001, (t - lastFrameT) / 1000.0));
            lastFrameT = t;

            ctx.clearRect(0, 0, W, H);

            // 1. Waterline Engraving & Caustic Bloom Alpha Advancement
            if (currentGoboStage === 1) {
              engravingAlpha = Math.min(1.0, engravingAlpha + 0.04);
              causticBloomAlpha = Math.min(1.0, causticBloomAlpha + Math.max(0.08, dt * 2.5));

              // Smooth swelling to 30% volume fill
              if (isWineFilling) {
                const elapsedSec = (t - wineFillStartTime) / 1000.0;
                const u = Math.min(1.0, elapsedSec / 1.85);
                const eased = 1.0 - Math.pow(1.0 - u, 3); // ease-out cubic
                wineCurrentLevel = eased * wineTargetLevel;
                if (u >= 1.0) isWineFilling = false;
              }
            } else if (currentGoboStage >= 2) {
              engravingAlpha = Math.max(0.0, engravingAlpha - 0.025);
              causticBloomAlpha = Math.max(0.0, causticBloomAlpha - 0.025);
            }

            // 2. Real-Time Physical Sloshing Spring-Damper Engine (responding to pointer velocity and gyro tilt)
            const gyroSloshOffset = -curTilt.y * 0.035;
            const targetSlosh = Math.max(-0.48, Math.min(0.48, -winePointerVelX * 0.045 + gyroSloshOffset));
            const angleDiff = targetSlosh - wineSloshAngle;
            const springK = 42.0;
            const dampingC = 4.8;
            const accel = springK * angleDiff - dampingC * wineSloshVel;
            wineSloshVel += accel * dt;
            wineSloshVel = Math.max(-2.5, Math.min(2.5, wineSloshVel));
            wineSloshAngle += wineSloshVel * dt;
            wineSloshAngle = Math.max(-0.55, Math.min(0.55, wineSloshAngle));
            winePointerVelX *= Math.pow(0.85, dt * 60);
            vortexSpinVel *= Math.pow(0.92, dt * 60);

            // 3. Audio Resonance Pulse Detection (Real-Time Acoustic Engine)
            if (goboAudio && !goboAudio.paused) {
              audioPulse = getRealTimeAcousticPulse(goboAudio.currentTime);
            } else {
              audioPulse = 0.0;
            }

            // 4. Render 24K Gold Optical Caustics Bloom & Champagne Micro-Sparkling Effervescence
            if (offCtx) {
              offCtx.clearRect(0, 0, nw, nh);

              if (currentGoboStage >= 1 && causticBloomAlpha > 0.001) {
                // (A) Lightweight Cursor/Gyro-Reactive 24K Gold Caustics Bloom
                const causticX = localCenterX + wineSloshAngle * 26 + (curShift.x || 0) * 18;
                const causticY = 168 + (curShift.y || 0) * 14;
                const causticRad = nw * 0.42;
                const pulse = 1.0 + 0.08 * Math.sin(t * 0.0022) + audioPulse * 0.12;

                // Primary Caustic Bloom (warm 24k gold optical refraction)
                const cGrad = offCtx.createRadialGradient(
                  causticX, causticY, 2,
                  causticX, causticY, causticRad * pulse
                );
                cGrad.addColorStop(0.0, `rgba(255, 248, 225, ${(0.42 * causticBloomAlpha).toFixed(3)})`);
                cGrad.addColorStop(0.28, `rgba(243, 212, 137, ${(0.28 * causticBloomAlpha).toFixed(3)})`);
                cGrad.addColorStop(0.62, `rgba(223, 177, 91, ${(0.12 * causticBloomAlpha).toFixed(3)})`);
                cGrad.addColorStop(1.0, 'rgba(223, 177, 91, 0)');
                offCtx.fillStyle = cGrad;
                offCtx.beginPath();
                offCtx.arc(causticX, causticY, causticRad * pulse, 0, Math.PI * 2);
                offCtx.fill();

                // Crystal Facet Optical Refraction Flare Arcs (luxury fluted crystal reflections)
                offCtx.save();
                offCtx.strokeStyle = `rgba(255, 240, 200, ${(0.26 * causticBloomAlpha).toFixed(3)})`;
                offCtx.lineWidth = 1.6;
                offCtx.shadowColor = 'rgba(243, 212, 137, 0.45)';
                offCtx.shadowBlur = 8;
                offCtx.beginPath();
                offCtx.ellipse(causticX - 14, causticY + 6, 38, 16, Math.PI * 0.18 + wineSloshAngle * 0.25, 0, Math.PI * 1.5);
                offCtx.stroke();
                offCtx.beginPath();
                offCtx.ellipse(causticX + 18, causticY + 20, 44, 20, -Math.PI * 0.12 + wineSloshAngle * 0.25, 0.4, Math.PI * 1.8);
                offCtx.stroke();
                offCtx.restore();

                // (B) Champagne Gold Micro-Sparkling Effervescence (rising bubbles & stardust glints)
                for (let i = 0; i < wineBubbles.length; i++) {
                  const b = wineBubbles[i];
                  b.yNorm -= b.speed * (dt * 0.65);
                  if (b.yNorm < 0) {
                    b.yNorm = 1.0;
                    b.xRel = (Math.random() - 0.5) * 0.76;
                  }
                  const bx = localCenterX + b.xRel * (nw * 0.36) + Math.sin(t * (b.wobbleSpeed || 0.003) + b.phase) * 3.5 + wineSloshAngle * 14;
                  const by = localBowlBottom - (localBowlBottom - 55) * (1.0 - b.yNorm);

                  if (by >= 55 && by <= localBowlBottom) {
                    const alpha = b.alpha * causticBloomAlpha;
                    if (b.isStardust) {
                      const twinkle = alpha * (0.6 + 0.4 * Math.sin(t * 0.007 + b.phase));
                      offCtx.save();
                      offCtx.fillStyle = `rgba(255, 245, 210, ${twinkle.toFixed(3)})`;
                      offCtx.shadowColor = '#f3d489';
                      offCtx.shadowBlur = 5;
                      offCtx.beginPath();
                      offCtx.arc(bx, by, b.r * 0.85, 0, Math.PI * 2);
                      offCtx.fill();
                      offCtx.restore();
                    } else {
                      offCtx.beginPath();
                      offCtx.arc(bx, by, b.r, 0, Math.PI * 2);
                      offCtx.fillStyle = `rgba(255, 235, 190, ${(alpha * 0.82).toFixed(3)})`;
                      offCtx.fill();
                      offCtx.beginPath();
                      offCtx.arc(bx - b.r * 0.3, by - b.r * 0.3, b.r * 0.35, 0, Math.PI * 2);
                      offCtx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.95).toFixed(3)})`;
                      offCtx.fill();
                    }
                  }
                }

                // Apply Wine Bowl Alpha Mask (Precision Pixel Masking to internal bowl contour)
                if (maskPrepared) {
                  offCtx.globalCompositeOperation = 'destination-in';
                  offCtx.drawImage(alphaMaskCanvas, 0, 0, nw, nh);
                  offCtx.globalCompositeOperation = 'source-over';
                  ctx.drawImage(offCanvas, ox, oy);
                } else {
                  prepareMask();
                  ctx.drawImage(offCanvas, ox, oy);
                }
              }
            }

            wineAnimId = requestAnimationFrame(renderWine);
          }

          wineAnimId = requestAnimationFrame(renderWine);
        }

        // Pointer and touch tracking for Real-Time Sloshing Physics with high-velocity damping stability
        function handleWinePointerMove(clientX, clientY) {
          const now = performance.now();
          if (wineLastPointerX >= 0) {
            const dtMs = Math.max(10, now - wineLastPointerTime);
            const mdx = clientX - wineLastPointerX;
            const velPxPerSec = (mdx / dtMs) * 1000.0;
            const clampedVel = Math.max(-1800, Math.min(1800, velPxPerSec));
            winePointerVelX = clampedVel / 100.0;

            // Apply fluid slosh inertia impulse responding to cursor velocity
            const impulse = Math.max(-0.6, Math.min(0.6, -clampedVel * 0.0006));
            wineSloshVel += impulse;
            vortexSpinVel += Math.max(-0.45, Math.min(0.45, -clampedVel * 0.00045));

            // Dynamically generate tears on high-velocity pointer movement
            if (Math.abs(impulse) > 0.12 && typeof spawnWineTears === 'function' && currentGoboStage >= 1) {
              spawnWineTears(1);
            }
          }
          wineLastPointerX = clientX;
          wineLastPointerY = clientY;
          wineLastPointerTime = now;
        }

        window.addEventListener('pointermove', (e) => {
          handleWinePointerMove(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
          if (e.touches && e.touches[0]) {
            handleWinePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: true });

        // 5. MICRO-DUST MOTES PARTICLE CANVAS ENGINE
        function initDustEngine() {
          if (!goboDustCanvas) return;
          const ctx = goboDustCanvas.getContext('2d');
          if (!ctx) return;

          const W = 976;
          const H = 1095;
          goboDustCanvas.width = W;
          goboDustCanvas.height = H;

          const DUST_COUNT = 52;
          goboDustParticles = [];
          const centerX = 488;
          const centerY = 460;
          const beamRadius = 380;

          for (let i = 0; i < DUST_COUNT; i++) {
            const z = 0.2 + Math.random() * 0.8;
            goboDustParticles.push({
              x: 180 + Math.random() * 616,
              y: 100 + Math.random() * 880,
              z: z,
              radius: 0.7 + z * 2.2,
              baseAlpha: 0.25 + z * 0.65,
              vx: (Math.random() - 0.5) * 0.28,
              vy: -0.16 - Math.random() * 0.38,
              shimmerPhase: Math.random() * Math.PI * 2,
              shimmerSpeed: 1.2 + Math.random() * 2.2
            });
          }

          let lastT = performance.now();
          function renderDust(t) {
            const dt = Math.min(50, t - lastT);
            lastT = t;

            ctx.clearRect(0, 0, W, H);

            for (let i = 0; i < goboDustParticles.length; i++) {
              const p = goboDustParticles[i];
              p.y += p.vy * (dt / 16.6);
              p.x += (p.vx + Math.sin(t * 0.0012 + p.shimmerPhase) * 0.22) * (dt / 16.6);

              // Convection wrap
              if (p.y < 40) {
                p.y = 960 + Math.random() * 60;
                p.x = 220 + Math.random() * 536;
              }
              if (p.x < 140) p.x = 836;
              else if (p.x > 836) p.x = 140;

              // Distance to center of circular amber beam
              const dx = p.x - centerX;
              const dy = p.y - centerY;
              const dist = Math.hypot(dx, dy);
              let beamFactor = 0;
              if (dist < beamRadius) {
                beamFactor = Math.pow(1 - (dist / beamRadius), 0.65);
              }

              if (beamFactor > 0.01) {
                const shimmer = 0.78 + 0.22 * Math.sin(t * 0.002 * p.shimmerSpeed + p.shimmerPhase);
                const alpha = Math.min(0.95, p.baseAlpha * beamFactor * shimmer);

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 246, 222, ${alpha.toFixed(3)})`;
                ctx.shadowColor = 'rgba(243, 212, 137, 0.8)';
                ctx.shadowBlur = p.radius * 3.6;
                ctx.fill();
                ctx.restore();
              }
            }

            dustAnimId = requestAnimationFrame(renderDust);
          }

          dustAnimId = requestAnimationFrame(renderDust);
        }

        // 6. INTERACTIVE 2.5D DOUBLE PARALLAX PORTHOLE ENGINE (STEP 3)
        // Outer Black Box: 0% gyro/mouse tilt (remains locked as a fixed framing window)
        // Inner Circular Light Beam: reacts subtly to mouse/gyro position with 0.4x parallax displacement
        // All 3D tilting & parallax disabled per Sean Park directive ("기울어지는 부분부터 별로인데, 그 부분 되기전에 소리든 효과든 다 막고 개발중 카드로 바꿔봐")
        function update2DParallaxPorthole() {
          curShift.x = 0;
          curShift.y = 0;
          curTilt.x = 0;
          curTilt.y = 0;
          targetShift.x = 0;
          targetShift.y = 0;
          targetTilt.x = 0;
          targetTilt.y = 0;

          if (goboFrame && !goboFrame.classList.contains('portal-zooming')) {
            goboFrame.style.transform = '';
          }
          if (symbolTrigger && !symbolTrigger.classList.contains('stage-dissolved')) {
            symbolTrigger.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
          }
          if (goboLightRig) {
            goboLightRig.style.transform = 'translate3d(0px, 0px, 0px) scale(1.0)';
          }
          if (goboSymbolRig) {
            goboSymbolRig.style.transform = 'perspective(1200px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)';
          }
        }
        update2DParallaxPorthole();

        // 7. DOM EVENT BINDINGS
        if (goboStartTrigger) {
          goboStartTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (suppressNextClickAfterHold || !borderPaintCompleted) return;
            startGoboExperience();
          });
          goboStartTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              startGoboExperience();
            }
          });
        }

        function handleSymbolClick(e) {
          e.stopPropagation();
          if (suppressNextClickAfterHold || !borderPaintCompleted) {
            return;
          }
          if (currentGoboStage === 0) {
            startGoboExperience();
          } else if (currentGoboStage === 1) {
            trigger3DObsidianItemUnlock();
          } else if (currentGoboStage === 2) {
            pulseGyroInteraction();
          }
        }

        if (goboSymbolLayer) {
          goboSymbolLayer.addEventListener('click', handleSymbolClick);
        }
        if (goboSymbolRig) {
          goboSymbolRig.addEventListener('click', handleSymbolClick);
        }
        const emblemContainer = document.getElementById('emblem-switch-container');
        if (emblemContainer) {
          emblemContainer.addEventListener('click', handleSymbolClick);
        }

        if (goboNextAffordance) {
          const handleAffordanceTrigger = (e) => {
            e.stopPropagation();
            if (suppressNextClickAfterHold || !borderPaintCompleted) return;
            if (currentGoboStage === 0) {
              startGoboExperience();
            } else if (currentGoboStage === 1) {
              trigger3DObsidianItemUnlock();
            } else {
              pulseGyroInteraction();
            }
          };
          goboNextAffordance.addEventListener('click', handleAffordanceTrigger);
          goboNextAffordance.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAffordanceTrigger(e);
            }
          });
        }

        // 7b. Emblem Version Switcher: 3-Stage 3D Evolution (v1 / v2 / v3)
        const switcherBtns = document.querySelectorAll('.emblem-switch-btn[data-target]');
        const emblemLayers = document.querySelectorAll('.emblem-layer');
        const versions = ['v1', 'v2', 'v3'];
        let currentVersionIndex = 0;
        let isAutoMorphActive = false;
        let autoMorphTimer = null;

        function switchEmblemVersion(versionId, isManual = false) {
          let stageNum = 1;
          if (versionId === 'v2') stageNum = 2;
          else if (versionId === 'v3') stageNum = 3;
          currentVersionIndex = stageNum - 1;

          if (isManual) {
            pauseAutoMorph();
          }

          if (typeof switchNebulaPalette === 'function') {
            switchNebulaPalette(versionId);
          }

          setEmblemEvolutionStage(stageNum, isManual);

          switcherBtns.forEach(btn => {
            if (btn.getAttribute('data-target') === versionId) {
              btn.classList.add('active');
              btn.setAttribute('aria-pressed', 'true');
            } else {
              btn.classList.remove('active');
              btn.setAttribute('aria-pressed', 'false');
            }
          });
        }

        function stepAutoMorph() {
          if (!isAutoMorphActive) return;
        }

        function startAutoMorph() {
          isAutoMorphActive = false;
        }

        function pauseAutoMorph() {
          isAutoMorphActive = false;
          if (autoMorphTimer) {
            clearInterval(autoMorphTimer);
            autoMorphTimer = null;
          }
        }

        // Default to 01 Ivory Porcelain & Rose Gold initially per master architecture
        switchEmblemVersion('v1');

        const switcherCapsule = document.getElementById('emblem-switcher');
        if (switcherCapsule) {
          switcherCapsule.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
              e.preventDefault();
              switcherCapsule.scrollLeft += e.deltaY;
            }
          }, { passive: false });
        }

        switcherBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = btn.getAttribute('data-target');
            if (target) switchEmblemVersion(target, true);
          });
        });

        // Digital Living Logo Overlay Toggle
        window.__isDigitalOverlayActive = false;
        const btnToggleOverlay = document.getElementById('btn-toggle-digital-overlay');
        const textToggleOverlay = document.getElementById('toggle-overlay-text');
        const digitalLogoEl = document.getElementById('digital-logo-overlay');

        function toggleDigitalOverlay(forceState) {
          window.__isDigitalOverlayActive = typeof forceState === 'boolean' ? forceState : !window.__isDigitalOverlayActive;
          if (btnToggleOverlay) {
            if (window.__isDigitalOverlayActive) {
              btnToggleOverlay.classList.add('active');
              btnToggleOverlay.setAttribute('aria-pressed', 'true');
              if (textToggleOverlay) textToggleOverlay.textContent = 'OVERLAY: ON';
              if (digitalLogoEl && cinematicStep >= 2) digitalLogoEl.classList.add('materialized');
            } else {
              btnToggleOverlay.classList.remove('active');
              btnToggleOverlay.setAttribute('aria-pressed', 'false');
              if (textToggleOverlay) textToggleOverlay.textContent = 'OVERLAY: OFF';
              if (digitalLogoEl) digitalLogoEl.classList.remove('materialized');
            }
          }
        }

        if (btnToggleOverlay) {
          btnToggleOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDigitalOverlay();
          });
        }

        window.__switchEmblemVersion = switchEmblemVersion;
        window.__toggleDigitalOverlay = toggleDigitalOverlay;

        window.__handleGoboClick = function(e) {
          if (!isTouchAllowed) return false;
          if (currentGoboStage === 0) {
            startGoboExperience();
            return true;
          } else if (currentGoboStage === 1) {
            trigger3DObsidianItemUnlock();
            return true;
          } else if (currentGoboStage === 2) {
            pulseGyroInteraction();
            return true;
          }
          return false;
        };

        // Hold-to-2x Fast-Forward & Release-to-1x Listeners during Gobo Warmup, Border Paint & 9.2s Symphonic Tail
        let postBorderHoldTimer = null;
        function handleFastForwardHoldStart(e) {
          if (!window.__noirCurtainUnveiled || window.__underDevCardActive) return;
          if (e.target && e.target.closest && e.target.closest('.noir-preload-curtain, .under-dev-card-overlay, a, button')) return;
          if (!borderPaintCompleted) {
            isHoldingFastForward = true;
            suppressNextClickAfterHold = true;
            setGoboPlaybackSpeed(2.0);
          } else if (orchConductorRunning) {
            // After 3.0s border lock, quick tap (<160ms) still flips card immediately, while press-and-hold (>=160ms) fast-forwards the remaining 9.2s orchestra!
            if (postBorderHoldTimer) clearTimeout(postBorderHoldTimer);
            postBorderHoldTimer = setTimeout(() => {
              postBorderHoldTimer = null;
              if (orchConductorRunning && !window.__underDevCardActive) {
                isHoldingFastForward = true;
                suppressNextClickAfterHold = true;
                setGoboPlaybackSpeed(2.0);
              }
            }, 160);
          }
        }

        function handleFastForwardHoldEnd() {
          if (postBorderHoldTimer) {
            clearTimeout(postBorderHoldTimer);
            postBorderHoldTimer = null;
          }
          if (isHoldingFastForward) {
            isHoldingFastForward = false;
            setGoboPlaybackSpeed(1.0);
            setTimeout(() => {
              suppressNextClickAfterHold = false;
            }, 80);
          } else if (goboSpeedMultiplier !== 1.0) {
            setGoboPlaybackSpeed(1.0);
          }
        }

        window.addEventListener('pointerdown', handleFastForwardHoldStart, { passive: true });
        window.addEventListener('pointerup', handleFastForwardHoldEnd, { passive: true });
        window.addEventListener('pointercancel', handleFastForwardHoldEnd, { passive: true });
        window.addEventListener('blur', handleFastForwardHoldEnd, { passive: true });

        // Screen-wide touch/click listener (Only flips card AFTER border paint is 100% finished)
        function handleGlobalScreenTouch(e) {
          if (!isTouchAllowed) return;
          if (!window.__noirCurtainUnveiled) {
            if (e.target && e.target.closest && e.target.closest('#u22-tile-matrix-stage, #tile-choreo-dock')) {
              return;
            }
            unveilNoirCurtainAndStartStage(e);
            return;
          }
          if (suppressNextClickAfterHold || !borderPaintCompleted) {
            return;
          }
          // Clicking/touching the Symbol Stage no longer auto-flips the card; users freely inspect the logo & long-press to upgrade the frame!
          return;
        }
        window.addEventListener('click', handleGlobalScreenTouch);

        // Keyboard navigation (Space, Enter, Down Arrow unveils initial curtain only; does not force-flip Symbol Stage)
        window.addEventListener('keydown', (e) => {
          if (['Space', 'Enter', 'ArrowDown', 'PageDown'].includes(e.code) || [' ', 'Enter', 'ArrowDown', 'PageDown'].includes(e.key)) {
            if (!window.__noirCurtainUnveiled) {
              unveilNoirCurtainAndStartStage(e);
              return;
            }
          }
        });

        // 8. PROGRAMMATIC HOOKS FOR TEST / PLAYWRIGHT VERIFICATION
        window.__getGoboStageState = function() {
          const lightStyle = goboLightRig ? window.getComputedStyle(goboLightRig) : null;
          const symbolStyle = goboSymbolLayer ? window.getComputedStyle(goboSymbolLayer) : null;
          const frameStyle = goboFrame ? window.getComputedStyle(goboFrame) : null;
          const triggerStyle = symbolTrigger ? window.getComputedStyle(symbolTrigger) : null;
          const underDevCard = document.getElementById('under-dev-card-overlay');

          return {
            cinematicStep: cinematicStep,
            stage: currentGoboStage,
            underDevCardActive: underDevCard ? underDevCard.classList.contains('active') : false,
            isMonolithPushedIn: false,
            isMonolithHolding: false,
            outerTilt: { x: 0, y: 0 },
            frameTransform: goboFrame ? goboFrame.style.transform : '',
            triggerTransform: symbolTrigger ? symbolTrigger.style.transform : '',
            lightDisplacement: {
              factor: 0.0,
              x: 0,
              y: 0,
              z: 0
            },
            symbolDisplacement: {
              factor: 0.0,
              x: 0,
              y: 0,
              z: 0,
              rotX: 0,
              rotY: 0
            },
            evolutionStage: 1,
            activeEmblemStage: 1,
            activeEmblem: 'v1',
            isFlickering: cinematicStep === 1,
            isStabilized: cinematicStep >= 2,
            lightOpacity: lightStyle ? parseFloat(lightStyle.opacity) : 0,
            symbolOpacity: symbolStyle ? parseFloat(symbolStyle.opacity) : 0,
            symbolMaterialized: (goboSymbolLayer && goboSymbolLayer.classList.contains('materialized')) || (goboSymbolRig && goboSymbolRig.classList.contains('materialized')),
            startTriggerVisible: false,
            startTriggerDissolved: true,
            isAudioPlaying: false,
            volume: 0,
            audioPaused: true,
            audioInitialVolume: 0,
            dustParticleCount: goboDustParticles ? goboDustParticles.length : 0,
            wineFillLevel: 0,
            wineTargetLevel: 0,
            isSloshing: false,
            sloshAngle: 0,
            sloshVel: 0,
            tearsCount: 0,
            isWineTearsActive: false,
            wineFilmLeft: 0,
            wineFilmRight: 0,
            silhouetteBreathing: currentGoboStage === 0 && cinematicStep >= 2,
            isUnsealed: isUnsealed,
            animationName: lightStyle ? lightStyle.animationName : (frameStyle ? frameStyle.animationName : null),
            nebulaPalette: currentPaletteVersion,
            nebulaParticleCount: nebulaParticles.length,
            isNebulaDormant: true,
            isBigBangActive: false,
            nebulaFillLevel: 0,
            audioPulse: 0,
            vortexSpinVel: 0
          };
        };

        window.__triggerWineSlosh = function() {};

        window.__getWineTearsState = function() {
          return {
            count: 0,
            isWineTearsActive: false,
            tears: [],
            filmLeft: 0,
            filmRight: 0,
            wineFillLevel: 0,
            sloshAngle: 0,
            isSloshing: false
          };
        };

        window.__spawnWineTears = function() {};

        window.__getNebulaState = function() {
          return {
            palette: currentPaletteVersion,
            particleCount: nebulaParticles.length,
            isDormant: true,
            isBigBangActive: false,
            fillLevel: 0,
            audioPulse: 0,
            sloshAngle: 0,
            sloshVel: 0,
            vortexSpinVel: 0
          };
        };
        window.__setNebulaPalette = switchNebulaPalette;

        window.__triggerGoboStart = function() {
          activateUnderDevCard();
        };

        window.__fastForwardGoboToStage2 = function() {
          activateUnderDevCard();
        };

        window.__fastForwardToStep = function(step) {
          if (step >= 1) {
            if (step1Timer) clearTimeout(step1Timer);
            cinematicStep = Math.max(cinematicStep, 1);
            if (goboLightRig) goboLightRig.classList.add('flicker-warmup');
          }
          if (step >= 2) {
            if (step2Timer) clearTimeout(step2Timer);
            cinematicStep = Math.max(cinematicStep, 2);
            if (goboLightRig) {
              goboLightRig.classList.remove('flicker-warmup');
              goboLightRig.classList.add('stabilized');
            }
            if (goboSymbolRig) goboSymbolRig.classList.add('materialized');
            if (goboSymbolLayer) goboSymbolLayer.classList.add('materialized');
          }
          if (step >= 3) {
            if (step3Timer) clearTimeout(step3Timer);
            cinematicStep = Math.max(cinematicStep, 3);
            if (goboNextAffordance) goboNextAffordance.classList.add('visible');
          }
          if (step >= 4) {
            activateUnderDevCard();
          }
        };

        window.__transitionToNextChapter = function() {
          activateUnderDevCard();
        };

        initDustEngine();
      }

      // Initialize Living Gobo Optical Stage (Lighting Only + 18K Gold Cursor Trail -> Under Dev Card on click)
      initGoboLivingOpticalStage();
      initCursorEngine();

      // -------------------------------------------------------------
      // WINDOW GOBO SEAMLESS 1:1 PORTAL INGRESS (TO 3D ATELIER)
      // -------------------------------------------------------------
      function enterWindowGoboPortal() {
        // Temporarily disabled per Sean's directive: never zoom/redirect to /u22_autocad.html
        return;
      }

      window.__enterWindowGoboPortal = enterWindowGoboPortal;

      const btnPortal = document.getElementById('btn-atelier-portal');
      if (btnPortal) {
        btnPortal.addEventListener('click', (e) => {
          e.stopPropagation();
          enterWindowGoboPortal();
        });
      }

      const symbolTriggerEl = document.getElementById('symbol-trigger');
      if (symbolTriggerEl) {
        symbolTriggerEl.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          enterWindowGoboPortal();
        });
      }

    })();
