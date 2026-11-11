// ============================================================================
// JSF ALIBI 4-STEM SAMPLE-LOCKED ENSEMBLE & PER-LAMP VOLTAGE-SAG MICRO-MODULE
// - Web Audio API AudioBufferSourceNode lock: 0.000ms phase drift across stems!
// - Location -> Guitar | Party -> Drums | Social -> Bass & Keys | Biz -> Vocal
// - DelayNode micro-modulation gives true analog pitch sag during lamp flicker
//   with ZERO cumulative timing drift against the other playing stems!
// ============================================================================
(function initJsfAlibiStemEnsembleModule() {
  'use strict';

  const STEMS = {
    map: { key: 'map', code: 'GTR', label: 'Guitar', url: '/assets/stems_alibi/stem_location_guitar.mp3?v=zero_v3', weight: 1.00 },
    0:   { key: '0',   code: 'DRM', label: 'Drums',  url: '/assets/stems_alibi/stem_party_drums.mp3?v=zero_v3',     weight: 0.96 },
    1:   { key: '1',   code: 'BAS', label: 'Bass',   url: '/assets/stems_alibi/stem_social_bass.mp3?v=zero_v3',     weight: 0.95 },
    2:   { key: '2',   code: 'VOC', label: 'Vocal',  url: '/assets/stems_alibi/stem_biz_vocals.mp3?v=zero_v3',      weight: 0.92 }
  };
  const STEM_KEYS = ['map', '0', '1', '2'];

  const CFG = {
    baseGain: 0.24,           // Master per-stem studio gain (summing 4 stems stays clean & warm)
    startOffsetSec: 0.0,      // Start strictly from 0.00s (very beginning of the track) when Location is clicked!
    fadeInSec: 0.28,          // Smooth tube turn-on bloom when a lamp ignites
    fadeOutSec: 0.20,         // Crisp musical release when an individual lamp turns off
    darkStandbyMult: 0.42,    // Muffled Guitar room ambiance after all lamps auto-off
    darkCutoffHz: 940,        // Warm muffled lowpass cutoff in dark room standby
    flickerMinMult: 0.24,     // Floor multiplier during deepest tungsten voltage dip (-35%~-52%)
    flickerSagScale: 0.65,    // Strength of each lamp blink's volume bounce
    flickerMinCutoffHz: 780,  // Lowest treble dip during blink (Hz)
    flickerQBoost: 1.65,      // Analog resonant filter bounce during blink
    tapeSagDelaySec: 0.0036   // 3.6ms DelayNode modulation -> authentic vinyl pitch sag, 0.0ms cumulative drift!
  };
  window.__JSF_ALIBI_SYNC_CFG = CFG;

  const rawBuffers = {};      // ArrayBuffer cache (prefetched silently)
  const audioBuffers = {};    // Decoded AudioBuffer cache
  const decodePromises = {};  // In-flight decode promises
  const channels = {};        // Active Web Audio strip per stem: { src, delay, filter, gain }

  let masterGain = null;
  let ensemblePlaying = false;
  let hasStartedFirstLocation = false;
  let anchorCtxTime = 0;      // Exact AudioContext hardware clock when stem 0.00s aligns
  let pausedSongOffset = 0.0;
  let lastMuteToggleTs = 0;

  let latestLampState = {
    anyLit: false,
    lamps: {
      map: { lit: false, dying: false, power: 0, dip: 0 },
      0:   { lit: false, dying: false, power: 0, dip: 0 },
      1:   { lit: false, dying: false, power: 0, dip: 0 },
      2:   { lit: false, dying: false, power: 0, dip: 0 }
    }
  };

  function getCtx() {
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

  function ensureMasterBus(ctx) {
    if (!ctx) return null;
    if (!masterGain) {
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(window.__jsfAudioMuted ? 0.00001 : 1.0, ctx.currentTime);
      masterGain.connect(ctx.destination);
    }
    return masterGain;
  }

  function fetchStemBytes(k) {
    if (rawBuffers[k]) return Promise.resolve(rawBuffers[k]);
    return fetch(STEMS[k].url, { cache: 'force-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.arrayBuffer();
      })
      .then((buf) => {
        rawBuffers[k] = buf;
        return buf;
      });
  }

  function loadAndDecodeStem(ctx, k) {
    if (audioBuffers[k]) return Promise.resolve(audioBuffers[k]);
    if (decodePromises[k]) return decodePromises[k];
    decodePromises[k] = fetchStemBytes(k)
      .then((raw) => ctx.decodeAudioData(raw.slice(0)))
      .then((decoded) => {
        audioBuffers[k] = decoded;
        return decoded;
      })
      .catch((err) => {
        delete decodePromises[k];
        throw err;
      });
    return decodePromises[k];
  }

  // Silent idle prefetch of raw MP3 bytes (zero audio output, ready before user flips card!)
  setTimeout(() => {
    STEM_KEYS.forEach((k) => { fetchStemBytes(k).catch(() => {}); });
  }, 900);

  function ensureBottomStemHud() {
    const bottomBar = document.getElementById('jsf-minimal-mp3-bar');
    if (!bottomBar || document.getElementById('jsf-stem-pill-cluster')) return;

    if (!document.getElementById('jsf-stem-pill-style')) {
      const st = document.createElement('style');
      st.id = 'jsf-stem-pill-style';
      st.textContent = `
        .jsf-stem-pill-cluster {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
          margin-right: 4px;
          vertical-align: middle;
        }
        .jsf-stem-micro-pill {
          appearance: none;
          border: 1px solid rgba(223, 177, 91, 0.24);
          background: rgba(12, 10, 16, 0.78);
          color: rgba(223, 177, 91, 0.42);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 2px 6px;
          border-radius: 999px;
          line-height: 1.25;
          cursor: pointer;
          user-select: none;
          font-feature-settings: "tnum" 1;
          transition: color 0.22s ease, border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, opacity 0.08s linear;
        }
        .jsf-stem-micro-pill.lit {
          color: #fffbeb;
          border-color: rgba(253, 224, 71, 0.92);
          background: linear-gradient(135deg, rgba(66, 47, 15, 0.92), rgba(28, 20, 9, 0.95));
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.42);
        }
        .jsf-stem-micro-pill.standby {
          color: rgba(243, 212, 137, 0.72);
          border-color: rgba(223, 177, 91, 0.45);
        }
        @media (max-width: 520px) {
          .jsf-stem-pill-cluster { gap: 3px; margin-left: 5px; }
          .jsf-stem-micro-pill { font-size: 8px; padding: 2px 4.5px; }
        }
      `;
      document.head.appendChild(st);
    }

    const cluster = document.createElement('span');
    cluster.id = 'jsf-stem-pill-cluster';
    cluster.className = 'jsf-stem-pill-cluster';

    STEM_KEYS.forEach((k) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'jsf-stem-micro-pill';
      btn.id = `jsf-stem-pill-${k}`;
      btn.textContent = STEMS[k].code;
      btn.title = `${STEMS[k].label} Stem (Click to toggle lamp)`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof window.__toggleHarryPotterLamp === 'function') {
          window.__toggleHarryPotterLamp(k === 'map' ? 'map' : Number(k));
        }
      });
      cluster.appendChild(btn);
    });

    const muteBtn = bottomBar.querySelector('button');
    if (muteBtn && muteBtn.parentNode === bottomBar) {
      bottomBar.insertBefore(cluster, muteBtn);
    } else {
      bottomBar.appendChild(cluster);
    }
  }

  function updateBottomStemHud() {
    ensureBottomStemHud();
    const anyLit = !!latestLampState.anyLit;
    let maxPower = 0;
    let anyFlickering = false;

    STEM_KEYS.forEach((k) => {
      const pill = document.getElementById(`jsf-stem-pill-${k}`);
      const st = latestLampState.lamps[k] || { lit: false, dying: false, power: 0 };
      if (st.lit) {
        maxPower = Math.max(maxPower, st.dying ? st.power : 1.0);
        if (st.dying) anyFlickering = true;
      }
      if (!pill) return;
      pill.classList.toggle('lit', !!st.lit);
      pill.classList.toggle('standby', !anyLit && k === 'map' && !!window.__alibiUnlockedByLocation);
      if (st.lit && st.dying) {
        pill.style.opacity = (0.35 + 0.65 * st.power).toFixed(3);
      } else {
        pill.style.opacity = '';
      }
    });

    const bar = document.getElementById('jsf-minimal-mp3-bar');
    if (bar && bar.classList.contains('visible')) {
      bar.style.opacity = (!anyLit ? '0.68' : (anyFlickering ? (0.56 + 0.44 * maxPower).toFixed(3) : '1'));
    }
  }

  function showBottomBar() {
    const centerStage = document.getElementById('jsf-center-nowplaying-stage');
    const bottomBar = document.getElementById('jsf-minimal-mp3-bar');
    if (centerStage) {
      centerStage.classList.remove('active', 'dissolving-to-bottom');
      centerStage.style.display = 'none';
    }
    document.body.classList.remove('jsf-nowplaying-center-active');
    if (bottomBar) bottomBar.classList.add('visible');
    ensureBottomStemHud();
  }

  function computeChannelTargets(k) {
    const info = STEMS[k];
    const st = latestLampState.lamps[k] || { lit: false, dying: false, power: 0, dip: 0 };
    const anyLit = !!latestLampState.anyLit;

    if (!window.__alibiUnlockedByLocation || window.__jsfAudioMuted) {
      return { gain: 0.00001, cutoff: 800, q: 0.707, delay: 0.001, tc: 0.05 };
    }

    // All lamps have flickered off -> keep Location's Guitar glowing softly in muffled room standby!
    if (!anyLit) {
      if (k === 'map') {
        return {
          gain: Math.max(0.0005, CFG.baseGain * info.weight * CFG.darkStandbyMult),
          cutoff: CFG.darkCutoffHz,
          q: 0.95,
          delay: 0.0012,
          tc: 0.18
        };
      }
      return { gain: 0.00001, cutoff: 650, q: 0.707, delay: 0.001, tc: 0.14 };
    }

    // Individual lamp is OFF while other lamp(s) are ON -> mute this instrument cleanly!
    if (!st.lit) {
      return { gain: 0.00001, cutoff: 680, q: 0.707, delay: 0.001, tc: CFG.fadeOutSec * 0.45 };
    }

    // Individual lamp is in its 5-bounce dying tungsten flicker -> bounce ONLY THIS STEM in 1:1 sync!
    if (st.dying) {
      const power = typeof st.power === 'number' ? Math.max(0, Math.min(1, st.power)) : 1.0;
      const dip = typeof st.dip === 'number' ? Math.max(0, Math.min(1, st.dip)) : 0.0;
      const sag = Math.max(1.0 - power, dip * 0.96);
      const mult = Math.max(CFG.flickerMinMult, 1.0 - sag * CFG.flickerSagScale);
      const cutoff = Math.max(
        CFG.flickerMinCutoffHz,
        Math.min(20000, CFG.darkCutoffHz * Math.pow(21.2, Math.pow(1.0 - sag * 0.90, 1.35)))
      );
      const q = 0.75 + dip * CFG.flickerQBoost;
      const delay = 0.001 + dip * CFG.tapeSagDelaySec;
      const tc = dip > 0.15 ? 0.015 : 0.042;
      return {
        gain: Math.max(0.0005, CFG.baseGain * info.weight * mult),
        cutoff,
        q,
        delay,
        tc
      };
    }

    // Steady LIT lamp -> full 20kHz studio brilliance!
    return {
      gain: Math.max(0.0005, CFG.baseGain * info.weight),
      cutoff: 20000,
      q: 0.707,
      delay: 0.001,
      tc: CFG.fadeInSec * 0.35
    };
  }

  function applyAllChannelTargets(immediate = false) {
    const ctx = window.__noirPingAudioCtx;
    if (!ctx || !ensemblePlaying) return;
    const now = ctx.currentTime;

    STEM_KEYS.forEach((k) => {
      const ch = channels[k];
      if (!ch) return;
      const tgt = computeChannelTargets(k);
      try {
        ch.gain.gain.cancelScheduledValues(now);
        ch.filter.frequency.cancelScheduledValues(now);
        ch.filter.Q.cancelScheduledValues(now);
        ch.delay.delayTime.cancelScheduledValues(now);

        if (immediate) {
          ch.gain.gain.setValueAtTime(tgt.gain, now);
          ch.filter.frequency.setValueAtTime(tgt.cutoff, now);
          ch.filter.Q.setValueAtTime(tgt.q, now);
          ch.delay.delayTime.setValueAtTime(tgt.delay, now);
        } else {
          ch.gain.gain.setTargetAtTime(tgt.gain, now, tgt.tc);
          ch.filter.frequency.setTargetAtTime(tgt.cutoff, now, tgt.tc);
          ch.filter.Q.setTargetAtTime(tgt.q, now, 0.025);
          ch.delay.delayTime.setTargetAtTime(tgt.delay, now, 0.022);
        }
      } catch (_) {}
    });
  }

  function spawnChannelAtExactPhase(ctx, k, buf, startWhen) {
    if (channels[k]) return;
    ensureMasterBus(ctx);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const delay = ctx.createDelay(0.05);
    delay.delayTime.setValueAtTime(0.001, startWhen);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, startWhen);
    filter.Q.setValueAtTime(0.707, startWhen);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.00001, startWhen);

    src.connect(delay);
    delay.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    const dur = buf.duration || 123.6;
    const elapsedSinceAnchor = startWhen - anchorCtxTime;
    const exactOffset = (((elapsedSinceAnchor % dur) + dur) % dur);

    src.start(startWhen, exactOffset);
    channels[k] = { src, delay, filter, gain };

    // Smoothly ramp into current lamp state right from startWhen
    const tgt = computeChannelTargets(k);
    gain.gain.setTargetAtTime(tgt.gain, startWhen, CFG.fadeInSec * 0.45);
    filter.frequency.setTargetAtTime(tgt.cutoff, startWhen, CFG.fadeInSec * 0.45);
  }

  function stopEnsemblePreserveClock() {
    const ctx = window.__noirPingAudioCtx;
    if (ctx && ensemblePlaying) {
      const refBuf = audioBuffers.map || audioBuffers['0'];
      const dur = refBuf ? refBuf.duration : 123.6;
      pausedSongOffset = (((ctx.currentTime - anchorCtxTime) % dur) + dur) % dur;
    }
    STEM_KEYS.forEach((k) => {
      const ch = channels[k];
      if (!ch) return;
      try { ch.src.stop(); } catch (_) {}
      try { ch.src.disconnect(); ch.delay.disconnect(); ch.filter.disconnect(); ch.gain.disconnect(); } catch (_) {}
      delete channels[k];
    });
    ensemblePlaying = false;
  }

  function startSampleLockedEnsemble() {
    showBottomBar();
    updateBottomStemHud();
    if (window.__jsfAudioMuted) return;

    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    ensureMasterBus(ctx);
    masterGain.gain.setTargetAtTime(1.0, ctx.currentTime, 0.03);

    if (ensemblePlaying) {
      applyAllChannelTargets(false);
      return;
    }

    ensemblePlaying = true;
    window.__alibiMrStarted = true;

    // Decode all already-cached stems immediately on the exact same sample tick;
    // any still-downloading stem joins seamlessly at the exact same sample clock!
    Promise.all(STEM_KEYS.map((k) => loadAndDecodeStem(ctx, k).catch(() => null))).then((decodedList) => {
      if (!ensemblePlaying || window.__jsfAudioMuted) return;
      const startWhen = ctx.currentTime + 0.025;
      anchorCtxTime = startWhen - pausedSongOffset;

      STEM_KEYS.forEach((k, idx) => {
        const buf = decodedList[idx];
        if (buf) {
          spawnChannelAtExactPhase(ctx, k, buf, startWhen);
        } else {
          // Retry late stem & lock onto exact running anchorCtxTime
          loadAndDecodeStem(ctx, k).then((lateBuf) => {
            if (!ensemblePlaying || window.__jsfAudioMuted || !lateBuf) return;
            spawnChannelAtExactPhase(ctx, k, lateBuf, ctx.currentTime + 0.02);
          }).catch(() => {});
        }
      });
    });
  }

  window.__jsfAlibiSyncPlay = function() {
    if (!window.__alibiUnlockedByLocation) return;
    startSampleLockedEnsemble();
  };

  window.__startAlibiFromLocationLamp = function() {
    if (!hasStartedFirstLocation) {
      hasStartedFirstLocation = true;
      pausedSongOffset = 0.0;
      if (ensemblePlaying) {
        stopEnsemblePreserveClock();
        pausedSongOffset = 0.0;
      }
    }
    window.__alibiUnlockedByLocation = true;
    latestLampState.anyLit = true;
    latestLampState.lamps.map = { lit: true, dying: false, power: 1.0, dip: 0.0 };
    startSampleLockedEnsemble();
  };

  window.__triggerJsfCenterNowPlayingReveal = function(forceShow = false) {
    if (!forceShow && !window.__alibiUnlockedByLocation) return;
    showBottomBar();
  };

  window.__setAlibiLampSyncState = function(state) {
    if (!state) return;
    if (state.lamps) {
      STEM_KEYS.forEach((k) => {
        const incoming = state.lamps[k] || state.lamps[Number(k)];
        if (incoming) {
          latestLampState.lamps[k] = {
            lit: !!incoming.lit,
            dying: !!incoming.dying,
            power: typeof incoming.power === 'number' ? incoming.power : (incoming.lit ? 1.0 : 0.0),
            dip: typeof incoming.dip === 'number' ? incoming.dip : 0.0
          };
        }
      });
      latestLampState.anyLit = state.anyLit !== undefined
        ? !!state.anyLit
        : STEM_KEYS.some((k) => latestLampState.lamps[k].lit);
    } else {
      // Backwards-compatible fallback
      const anyLit = state.anyLit !== undefined ? !!state.anyLit : true;
      latestLampState.anyLit = anyLit;
      latestLampState.lamps.map = {
        lit: anyLit,
        dying: !!state.isFlickering,
        power: typeof state.power === 'number' ? state.power : 1.0,
        dip: typeof state.dip === 'number' ? state.dip : 0.0
      };
    }

    updateBottomStemHud();
    if (!window.__alibiUnlockedByLocation) return;

    // If user ignited any lamp after unlocking, ensure ensemble is running
    if (latestLampState.anyLit && !ensemblePlaying && !window.__jsfAudioMuted) {
      startSampleLockedEnsemble();
      return;
    }
    applyAllChannelTargets(false);
  };

  window.__toggleJsfMinimalMp3Mute = function(forceMuteState) {
    const nowMs = performance.now();
    if (typeof forceMuteState !== 'boolean' && (nowMs - lastMuteToggleTs < 120)) {
      return !!window.__jsfAudioMuted;
    }
    lastMuteToggleTs = nowMs;

    const nextMuted = typeof forceMuteState === 'boolean' ? forceMuteState : !window.__jsfAudioMuted;
    window.__jsfAudioMuted = nextMuted;

    if (nextMuted) {
      if (masterGain && window.__noirPingAudioCtx) {
        try {
          const now = window.__noirPingAudioCtx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(0.00001, now);
        } catch (_) {}
      }
      stopEnsemblePreserveClock();
    } else if (window.__alibiUnlockedByLocation) {
      startSampleLockedEnsemble();
    }

    document.querySelectorAll('video, #gobo-calibration-audio').forEach((v) => {
      try { v.muted = true; v.volume = 0; } catch (_) {}
    });

    [window.__noirPingAudioCtx, window.__hpLampAudioCtx].forEach((c) => {
      if (!c) return;
      try {
        if (nextMuted && c.state === 'running') c.suspend().catch(() => {});
        else if (!nextMuted && c.state === 'suspended') c.resume().catch(() => {});
      } catch (_) {}
    });

    if (typeof window.__syncAllSoundButtonsUI === 'function') {
      window.__syncAllSoundButtonsUI();
    }
    return nextMuted;
  };
})();
