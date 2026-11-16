    (function initInstagramVipAndIntroSkipEngine() {
      const VIP_KEY_VERIFIED = 'jsf_vip_verified';
      const VIP_KEY_HANDLE = 'jsf_vip_instagram_handle';
      const VIP_KEY_AUTOSKIP = 'jsf_vip_auto_skip_intro';

      const BADGE_DESIGNS = [
        { key: 'ring',  label: '⭕ BADGE 1 · IG FLAME RING' },
        { key: 'card',  label: '🪪 BADGE 2 · MINI IG CARD' },
        { key: 'vinyl', label: '💿 BADGE 3 · VINYL SEAL' }
      ];
      let currentDesignIdx = 0;

      window.__setIgBadgeDesign = function(designKey) {
        const torchEl = document.getElementById('salon-draggable-torch');
        const lbl = document.getElementById('jsf-puppet-style-label');
        const foundIdx = BADGE_DESIGNS.findIndex((d) => d.key === designKey);
        if (foundIdx >= 0) currentDesignIdx = foundIdx;
        const item = BADGE_DESIGNS[currentDesignIdx];
        if (torchEl) torchEl.setAttribute('data-badge-design', item.key);
        if (lbl) lbl.textContent = item.label;
        return item.key;
      };

      window.__cycleIgBadgeDesign = function() {
        currentDesignIdx = (currentDesignIdx + 1) % BADGE_DESIGNS.length;
        return window.__setIgBadgeDesign(BADGE_DESIGNS[currentDesignIdx].key);
      };

      window.__syncIgBadgeProgressRing = function() {
        const st = window.__torchAltarState || { visited: {}, masterUnlocked: false };
        const torchEl = document.getElementById('salon-draggable-torch');
        const cradleDock = document.getElementById('torch-cradle-dock');
        if (torchEl && cradleDock && !torchEl.classList.contains('dragging') && torchEl.parentElement !== cradleDock) {
          cradleDock.appendChild(torchEl);
        }
        const litCount = [1, 2, 3].filter((id) => st.masterUnlocked || (st.visited && st.visited[id])).length;
        [1, 2, 3].forEach((id) => {
          const seg = document.getElementById('ig-ring-seg-' + id);
          if (seg) {
            seg.classList.toggle('lit', !!(st.masterUnlocked || (st.visited && st.visited[id])));
          }
        });
        const subEl = document.getElementById('salon-torch-label');
        const pipEl = document.getElementById('ig-verified-check-pip');
        if (subEl) {
          if (st.masterUnlocked || litCount === 3) {
            subEl.textContent = '👑 VIP 3/3 UNLOCKED';
          } else {
            subEl.textContent = '🔥 TORCH KEY · ' + litCount + '/3';
          }
        }
        if (pipEl) {
          pipEl.textContent = (st.masterUnlocked || litCount === 3) ? '👑' : (litCount > 0 ? String(litCount) : '🔥');
        }
      };

      // Hook into window.__plugTorchIntoAltar so every torch ignition updates the IG progress ring!
      const origPlug = window.__plugTorchIntoAltar;
      if (typeof origPlug === 'function' && !origPlug.__igRingHooked) {
        const wrappedPlug = function(zoneId) {
          const res = origPlug.apply(this, arguments);
          window.__syncIgBadgeProgressRing();
          return res;
        };
        wrappedPlug.__igRingHooked = true;
        window.__plugTorchIntoAltar = wrappedPlug;
      }

      const origReset = window.__resetTorchAltarPuzzle;
      if (typeof origReset === 'function' && !origReset.__igRingHooked) {
        const wrappedReset = function() {
          const res = origReset.apply(this, arguments);
          window.__syncIgBadgeProgressRing();
          return res;
        };
        wrappedReset.__igRingHooked = true;
        window.__resetTorchAltarPuzzle = wrappedReset;
      }

      function normalizeHandle(raw) {
        let v = String(raw || '').trim();
        if (!v) return '';
        if (!v.startsWith('@')) v = '@' + v;
        return v.replace(/\s+/g, '');
      }

      function syncVipUiState() {
        const isVerified = localStorage.getItem(VIP_KEY_VERIFIED) === 'true';
        const handle = localStorage.getItem(VIP_KEY_HANDLE) || '@just.sean.flows';
        const skipWrap = document.getElementById('jsf-vip-skip-intro-wrap');
        const skipLabel = document.getElementById('jsf-vip-skip-label');
        const backPill = document.getElementById('btn-open-ig-vip-modal');
        const backPillText = document.getElementById('jsf-backface-vip-pill-text');
        const issuedBox = document.getElementById('jsf-ig-vip-issued-box');
        const issuedHandle = document.getElementById('jsf-ig-issued-handle');
        const handleInput = document.getElementById('jsf-ig-handle-input');

        if (isVerified) {
          if (skipWrap) skipWrap.classList.add('vip-skip-ready');
          if (skipLabel) skipLabel.textContent = 'VIP ' + handle + ' · SKIP INTRO';
          if (backPill) backPill.classList.add('is-verified');
          if (backPillText) backPillText.textContent = 'VIP ' + handle;
          if (issuedBox) issuedBox.style.display = 'flex';
          if (issuedHandle) issuedHandle.textContent = handle;
          if (handleInput && !handleInput.value) handleInput.value = handle;
        } else {
          if (skipWrap) skipWrap.classList.remove('vip-skip-ready');
          if (backPill) backPill.classList.remove('is-verified');
          if (backPillText) backPillText.textContent = 'VIP INTRO SKIP';
          if (issuedBox) issuedBox.style.display = 'none';
        }
        window.__syncIgBadgeProgressRing();
      }

      window.__openInstagramVipModal = function() {
        const modal = document.getElementById('jsf-ig-vip-modal');
        if (!modal) return;
        syncVipUiState();
        modal.classList.add('open');
      };

      window.__closeInstagramVipModal = function() {
        const modal = document.getElementById('jsf-ig-vip-modal');
        if (!modal) return;
        modal.classList.remove('open');
      };

      window.__markInstagramProfileVisited = function() {
        const fb = document.getElementById('jsf-ig-feedback');
        if (fb) {
          fb.style.color = '#fde68a';
          fb.textContent = '✦ @just.sean.flows 프로필 확인됨! 아래에 본인 인스타 아이디를 입력해주세요.';
        }
      };

      window.__quickFillDemoInstagramHandle = function() {
        const input = document.getElementById('jsf-ig-handle-input');
        if (input) {
          input.value = '@sean.salon.vip';
          input.focus();
        }
      };

      window.__verifyInstagramVipPass = function() {
        const input = document.getElementById('jsf-ig-handle-input');
        const fb = document.getElementById('jsf-ig-feedback');
        const autoChk = document.getElementById('jsf-ig-autoskip-checkbox');
        const handle = normalizeHandle(input ? input.value : '');

        if (!handle || handle.length < 3) {
          if (fb) {
            fb.style.color = '#fca5a5';
            fb.textContent = '⚠ 인스타그램 아이디(@username)를 입력해주세요.';
          }
          if (input) input.focus();
          return false;
        }

        localStorage.setItem(VIP_KEY_VERIFIED, 'true');
        localStorage.setItem(VIP_KEY_HANDLE, handle);
        localStorage.setItem(VIP_KEY_AUTOSKIP, (!autoChk || autoChk.checked) ? 'true' : 'false');

        if (fb) {
          fb.style.color = '#4ade80';
          fb.textContent = '👑 인스타그램 VIP 인증 완료! 인트로 스킵 패스가 영구 개통되었습니다.';
        }

        syncVipUiState();
        return true;
      };

      window.__skipIntroAsVip = function() {
        window.__suppressAutoVipModalOnce = true;
        window.__noirCurtainUnveiled = true;
        window.__borderPaintCompleted = true;

        const curtain = document.getElementById('noir-preload-curtain');
        if (curtain) {
          curtain.classList.add('unveiled', 'curtain-unveiled');
          curtain.style.opacity = '0';
          curtain.style.pointerEvents = 'none';
        }

        const goboFrame = document.getElementById('gobo-canvas-frame');
        if (goboFrame) {
          goboFrame.classList.remove('worm-eye-monolith');
          goboFrame.classList.add('frame-illuminated', 'card-flipped-out');
        }

        document.body.classList.add('vip-pass-flipped');
        window.__underDevCardActive = true;

        const cardOverlay = document.getElementById('under-dev-card-overlay');
        if (cardOverlay) {
          cardOverlay.classList.add('active', 'webpage-zoomed', 'master-torch-unlocked');
          cardOverlay.style.opacity = '1';
          cardOverlay.style.visibility = 'visible';
          cardOverlay.style.pointerEvents = 'auto';
        }

        // Do NOT auto-play Alibi on VIP Intro Skip! Wait strictly until the user clicks Location (starts at 0:00.000).

        if (typeof window.__plugTorchIntoAltar === 'function') {
          window.__plugTorchIntoAltar(1);
          window.__plugTorchIntoAltar(2);
          window.__plugTorchIntoAltar(3);
        }

        setTimeout(() => {
          window.__suppressAutoVipModalOnce = false;
        }, 900);

        syncVipUiState();
        return true;
      };

      window.__testVipIntroSkipFromModal = function() {
        window.__closeInstagramVipModal();
        document.body.classList.remove('vip-pass-flipped', 'under-dev-open');
        window.__underDevCardActive = false;

        const curtain = document.getElementById('noir-preload-curtain');
        if (curtain) {
          curtain.classList.remove('unveiled', 'curtain-unveiled');
          curtain.style.opacity = '1';
          curtain.style.visibility = 'visible';
          curtain.style.pointerEvents = 'auto';
        }
        syncVipUiState();
      };

      function bootVipAndOptionalSalonJump() {
        syncVipUiState();
        try {
          if (window.location && window.location.search.indexOf('salon=1') !== -1) {
            setTimeout(() => {
              const qr = document.getElementById('jsf-qr-entry-gate');
              if (qr) { qr.classList.add('dismissed'); qr.style.display = 'none'; }
              if (typeof window.__skipIntroAsVip === 'function') window.__skipIntroAsVip();
            }, 120);
          }
        } catch (_) {}
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootVipAndOptionalSalonJump);
      } else {
        bootVipAndOptionalSalonJump();
      }
    })();

    // === HARRY POTTER LIVING NEWSPAPER & BRASS LAMP ENGINE START ===
    (function() {
      const litLamps = { map: false, 0: false, 1: false, 2: false };
      const everDiscoveredLamps = { map: false, 0: false, 1: false, 2: false };
      let salon4of4QuestCleared = false;
      window.__salon4of4QuestCleared = false;

      // === ELEVENLABS LUXURY CLOSE-MIC FOLEY SOUND BANK (ZERO SYNTH OSCILLATORS!) ===
      const JSF_FOLEY_MANIFEST = {
        switch_on:           { url: '/assets/sounds/brass_lamp_switch_on.mp3?v=loc_unlock_v13',              gain: 0.16, jitter: 0.03 },
        switch_off:          { url: '/assets/sounds/brass_lamp_switch_off.mp3?v=loc_unlock_v13',             gain: 0.16, jitter: 0.03 },
        ensemble_unseal:     { url: '/assets/sounds/salon_ensemble_unseal.mp3?v=loc_unlock_v13',             gain: 0.14, jitter: 0.00 },
        shutter:             { url: '/assets/sounds/leica_shutter_click.mp3?v=loc_unlock_v13',               gain: 0.16, jitter: 0.03 },
        kalina_loc_ask:      { url: '/assets/sounds/location_voice/kalina_loc_01_ask.mp3?v=exact_loc_v18',      gain: 0.24, jitter: 0.00 },
        kalina_loc_for:      { url: '/assets/sounds/location_voice/kalina_loc_02_for.mp3?v=exact_loc_v18',      gain: 0.24, jitter: 0.00 },
        kalina_loc_exact:    { url: '/assets/sounds/location_voice/kalina_loc_03_exact.mp3?v=exact_loc_v18',    gain: 0.24, jitter: 0.00 },
        kalina_loc_location: { url: '/assets/sounds/location_voice/kalina_loc_04_location.mp3?v=exact_loc_v18', gain: 0.24, jitter: 0.00 },
        kalina_loc_sentence: { url: '/assets/sounds/location_voice/kalina_loc_sentence_v2.mp3?v=cand3_final_170cello_121timp', gain: 0.34, jitter: 0.00 }
      };

      const foleyRawBytes = {};
      const foleyDecodedBuffers = {};
      const foleyHtmlAudioPool = {};
      window.__jsfFoleyStats = { preloaded: {}, played: {} };

      (function preloadAllJsfFoleySfx() {
        Object.keys(JSF_FOLEY_MANIFEST).forEach((key) => {
          const spec = JSF_FOLEY_MANIFEST[key];
          window.__jsfFoleyStats.preloaded[key] = 0;
          window.__jsfFoleyStats.played[key] = 0;
          try {
            fetch(spec.url, { cache: key === 'kalina_loc_sentence' ? 'no-cache' : 'force-cache' })
              .then((r) => (r.ok ? r.arrayBuffer() : null))
              .then((ab) => {
                if (ab && ab.byteLength > 0) {
                  foleyRawBytes[key] = ab;
                  window.__jsfFoleyStats.preloaded[key] = ab.byteLength;
                  if (window.__hpLampAudioCtx) {
                    window.__hpLampAudioCtx.decodeAudioData(ab.slice(0))
                      .then((buf) => { foleyDecodedBuffers[key] = buf; })
                      .catch(() => {});
                  }
                }
              })
              .catch(() => {});
            const a = new Audio(spec.url);
            a.preload = 'auto';
            a.volume = Math.min(1.0, spec.gain);
            foleyHtmlAudioPool[key] = a;
          } catch (_) {}
        });
      })();

      window.__playJsfFoleySfx = function(key, opts = {}) {
        try {
          if (window.__jsfAudioMuted) return;
          const spec = JSF_FOLEY_MANIFEST[key];
          if (!spec) return;
          const gainMul = typeof opts.gain === 'number' ? opts.gain : spec.gain;
          const rateBase = typeof opts.rate === 'number' ? opts.rate : 1.0;
          const jitter = typeof opts.jitter === 'number' ? opts.jitter : spec.jitter;
          const rate = Math.max(0.75, Math.min(1.35, rateBase + (jitter ? (Math.random() * 2 - 1) * jitter : 0)));

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            if (!window.__hpLampAudioCtx) {
              window.__hpLampAudioCtx = new AudioCtx();
            }
            const ctx = window.__hpLampAudioCtx;
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }

            const fireDecoded = (buf) => {
              if (!buf || window.__jsfAudioMuted) return;
              const now = ctx.currentTime + (opts.delaySec || 0.002);
              const src = ctx.createBufferSource();
              const gain = ctx.createGain();
              src.buffer = buf;
              src.playbackRate.setValueAtTime(rate, now);
              if (key === 'loc_unlock_3s') {
                const dur = Math.min(buf.duration || 3.2, 3.24);
                gain.gain.setValueAtTime(0.035, now);
                gain.gain.linearRampToValueAtTime(gainMul, now + 0.18);
                gain.gain.setValueAtTime(gainMul, now + Math.max(0.25, dur - 0.52));
                gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);
                src.connect(gain);
                gain.connect(ctx.destination);
                src.start(now);
                src.stop(now + dur + 0.02);
              } else {
                gain.gain.setValueAtTime(gainMul, now);
                src.connect(gain);
                gain.connect(ctx.destination);
                src.start(now);
              }
              window.__jsfFoleyStats.played[key] = (window.__jsfFoleyStats.played[key] || 0) + 1;
              if (key === 'loc_unlock_3s' && window.__locUnlockAudioStats) {
                window.__locUnlockAudioStats.playedCount += 1;
                window.__locUnlockAudioStats.lastMethod = 'webaudio';
                window.__locUnlockAudioStats.preloadedBytes = window.__jsfFoleyStats.preloaded.loc_unlock_3s || 0;
              }
            };

            if (foleyDecodedBuffers[key]) {
              fireDecoded(foleyDecodedBuffers[key]);
              return;
            }
            if (foleyRawBytes[key]) {
              ctx.decodeAudioData(foleyRawBytes[key].slice(0))
                .then((decoded) => {
                  foleyDecodedBuffers[key] = decoded;
                  fireDecoded(decoded);
                })
                .catch(() => {
                  const base = foleyHtmlAudioPool[key];
                  if (base) {
                    const node = base.cloneNode();
                    node.volume = Math.min(1.0, gainMul);
                    node.playbackRate = rate;
                    node.play().catch(() => {});
                    window.__jsfFoleyStats.played[key] = (window.__jsfFoleyStats.played[key] || 0) + 1;
                  }
                });
              return;
            }
          }

          const base = foleyHtmlAudioPool[key];
          if (base) {
            const node = base.cloneNode();
            node.volume = Math.min(1.0, gainMul);
            node.playbackRate = rate;
            node.play().catch(() => {});
            window.__jsfFoleyStats.played[key] = (window.__jsfFoleyStats.played[key] || 0) + 1;
          }
        } catch (_) {}
      };

      function playQuestClearHarmonicChime() {
        window.__playJsfFoleySfx('ensemble_unseal');
      }

      window.__triggerQuestClearEffect = function(side = 'back') {
        const fxId = side === 'front' ? 'u22-quest-clear-fx-front' : 'u22-quest-clear-fx-back';
        const fxEl = document.getElementById(fxId);
        if (fxEl) {
          fxEl.classList.remove('quest-fx-active');
          void fxEl.offsetWidth;
          fxEl.classList.add('quest-fx-active');
        }
        if (side === 'front') {
          const gobo = document.getElementById('gobo-canvas-frame');
          if (gobo) gobo.classList.add('doc-quest-cleared');
          const tc = document.getElementById('doc-top-timecode');
          if (tc) tc.textContent = '✦ DOSSIER VERIFIED // 03/03 ARCHIVE UNLOCKED';
        } else {
          const card = document.getElementById('under-dev-card-overlay');
          if (card) card.classList.add('salon-quest-cleared');
        }
        playQuestClearHarmonicChime();
      };
      const lampTimers = {
        map: { warn: null, off: null, raf: null },
        0: { warn: null, off: null, raf: null },
        1: { warn: null, off: null, raf: null },
        2: { warn: null, off: null, raf: null }
      };

      // Configurable timings (default: 5500ms full glow -> 5500ms..8200ms 5-bounce dying filament flicker -> 8200ms auto-off)
      window.__HP_LAMP_DYING_START_MS = 5500;
      window.__HP_LAMP_AUTO_OFF_MS = 8200;

      function getZoneElement(target) {
        if (target === 'map') return document.getElementById('torch-zone-1');
        return document.getElementById(`hp-cell-${Number(target)}`);
      }

      const lampDyingState = {
        map: { dying: false, power: 0, dip: 0, lastBounceIdx: -1 },
        0:   { dying: false, power: 0, dip: 0, lastBounceIdx: -1 },
        1:   { dying: false, power: 0, dip: 0, lastBounceIdx: -1 },
        2:   { dying: false, power: 0, dip: 0, lastBounceIdx: -1 }
      };

      // 5-Bounce Elastic Analog Tungsten Voltage-Sag Profile for Portrait Lamps 0..2 (p: 0.0 -> 1.0)
      const TUNGSTEN_FLICKER_BOUNCES = [
        { s: 0.03, e: 0.15, depth: 0.68 },
        { s: 0.31, e: 0.43, depth: 0.74 },
        { s: 0.58, e: 0.69, depth: 0.78 },
        { s: 0.73, e: 0.81, depth: 0.70 },
        { s: 0.82, e: 0.91, depth: 0.86 }
      ];

      // Organic Elastic Analog Tungsten Voltage-Sag Profile for Location ('map', 4.8s dying window: p 0.0 -> 1.0)
      // Matches Music's living bulb-bounce feel (zero frozen dead gap!), unveiling:
      // - 0.00..0.22 (~1.06s): "ASK"  (Bounce 1 unveils "ASK", then warm lamp rebound breathes over map)
      // - 0.22..0.44 (~1.06s): "FOR"  (swaps inside Bounce 2 dark trough at p=0.22, then warm rebound)
      // - 0.44..0.885 (~2.14s): "The exact" (swaps inside Bounce 3 trough at p=0.44 + living Bounce 4 filament breath)
      // - 0.885..1.00 (~0.55s): swaps naturally mid-rapid-sputter (trough p=0.885) into "Location" & settles cleanly!
      const MAP_TUNGSTEN_FLICKER_BOUNCES = [
        { s: 0.025, e: 0.145, depth: 0.80 }, // Bounce 1 (trough ~0.085): deep sag -> "ASK", then warm bulb rebound
        { s: 0.175, e: 0.285, depth: 0.84 }, // Bounce 2 (trough ~0.230): shutter -> "FOR", then warm bulb rebound
        { s: 0.385, e: 0.505, depth: 0.86 }, // Bounce 3 (trough ~0.445): shutter -> "The exact"
        { s: 0.615, e: 0.725, depth: 0.76 }, // Bounce 4 (trough ~0.670): living tungsten filament pulse on "The exact"
        { s: 0.805, e: 0.860, depth: 0.88 }, // Terminal Sputter 1 ("The exact" flickers into rapid tail)
        { s: 0.860, e: 0.915, depth: 0.94 }, // Terminal Sputter 2 (trough 0.885 -> swaps naturally to "Location"!)
        { s: 0.915, e: 0.975, depth: 0.92 }  // Terminal Sputter 3 ("Location" flickers with final filament spark)
      ];

      let locIconsEverUnlocked = false;
      let locIconsUnlockTimer = null;
      window.__locUnlockAudioStats = { preloadedBytes: 52287, playedCount: 0, lastMethod: 'none' };

      function playLocationFilamentUnlockSound() {
        // Removed per Sean's feedback: Location lamp uses only the subtle brass switch click.
      }

      window.__kalinaLocVoiceStats = { ask: 0, for: 0, exact: 0, location: 0, sentence: 0 };
      let locSpokenStages = { ask: false, for: false, exact: false, location: false, sentence: false };
      let lastMapDyingP = 0;
      let activeKalinaWordNodes = [];
      let kalinaSentenceTiming = { ctxStartTime: null, htmlNode: null, wallStartMs: null };
      // Exact ElevenLabs /with-timestamps alignment for "If you're coming tonight... just ask, for, the exact location." (3.855s)
      const KALINA_SENTENCE_CUES = { ask: 1.521, for: 1.950, exact: 2.357, location: 2.972 };

      function getKalinaSentenceElapsedSec(fallbackSec) {
        try {
          if (kalinaSentenceTiming.htmlNode && !kalinaSentenceTiming.htmlNode.paused) {
            return kalinaSentenceTiming.htmlNode.currentTime || fallbackSec;
          }
          if (kalinaSentenceTiming.ctxStartTime !== null && window.__hpLampAudioCtx) {
            return Math.max(0, window.__hpLampAudioCtx.currentTime - kalinaSentenceTiming.ctxStartTime);
          }
          if (kalinaSentenceTiming.wallStartMs !== null) {
            return Math.max(0, (performance.now() - kalinaSentenceTiming.wallStartMs) / 1000);
          }
        } catch (_) {}
        return fallbackSec;
      }

      function playKalinaLocationSentence() {
        kalinaSentenceTiming = { ctxStartTime: null, htmlNode: null, wallStartMs: performance.now() };
        try {
          if (window.__jsfAudioMuted) return;
          const spec = JSF_FOLEY_MANIFEST.kalina_loc_sentence;
          if (!spec) return;
          stopActiveKalinaLocationWords(false);
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            if (!window.__hpLampAudioCtx) window.__hpLampAudioCtx = new AudioCtx();
            const ctx = window.__hpLampAudioCtx;
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            const startBuf = (buf) => {
              if (!buf || window.__jsfAudioMuted) return;
              const t0 = ctx.currentTime + 0.002;
              const src = ctx.createBufferSource();
              const gain = ctx.createGain();
              src.buffer = buf;
              gain.gain.setValueAtTime(spec.gain, t0);
              src.connect(gain);
              gain.connect(ctx.destination);
              kalinaSentenceTiming.ctxStartTime = t0;
              const rec = { src, gain, stageName: 'location' };
              activeKalinaWordNodes.push(rec);
              src.onended = () => {
                activeKalinaWordNodes = activeKalinaWordNodes.filter((x) => x !== rec);
              };
              src.start(t0);
              window.__kalinaLocVoiceStats.sentence = (window.__kalinaLocVoiceStats.sentence || 0) + 1;
            };
            if (foleyDecodedBuffers.kalina_loc_sentence) {
              startBuf(foleyDecodedBuffers.kalina_loc_sentence);
              return;
            }
            if (foleyRawBytes.kalina_loc_sentence) {
              ctx.decodeAudioData(foleyRawBytes.kalina_loc_sentence.slice(0))
                .then((decoded) => {
                  foleyDecodedBuffers.kalina_loc_sentence = decoded;
                  startBuf(decoded);
                })
                .catch(() => {});
              return;
            }
          }
          const base = foleyHtmlAudioPool.kalina_loc_sentence;
          if (base) {
            const htmlNode = base.cloneNode();
            htmlNode.volume = Math.min(1.0, spec.gain);
            kalinaSentenceTiming.htmlNode = htmlNode;
            const rec = { htmlNode, stageName: 'location' };
            activeKalinaWordNodes.push(rec);
            htmlNode.onended = () => {
              activeKalinaWordNodes = activeKalinaWordNodes.filter((x) => x !== rec);
            };
            htmlNode.play().catch(() => {});
            window.__kalinaLocVoiceStats.sentence = (window.__kalinaLocVoiceStats.sentence || 0) + 1;
          }
        } catch (_) {}
      }

      function stopActiveKalinaLocationWords(preserveFinalLocation = false) {
        const keep = [];
        const now = window.__hpLampAudioCtx ? window.__hpLampAudioCtx.currentTime : 0;
        for (let i = 0; i < activeKalinaWordNodes.length; i++) {
          const item = activeKalinaWordNodes[i];
          if (preserveFinalLocation && item.stageName === 'location') {
            keep.push(item);
            continue;
          }
          try {
            if (item.gain && window.__hpLampAudioCtx) {
              item.gain.gain.cancelScheduledValues(now);
              item.gain.gain.setValueAtTime(Math.max(0.001, item.gain.gain.value || 0.35), now);
              item.gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.06);
              if (item.src) item.src.stop(now + 0.065);
            } else if (item.htmlNode) {
              item.htmlNode.pause();
            }
          } catch (_) {}
        }
        activeKalinaWordNodes = keep;
      }

      function playKalinaLocationWord(manifestKey, stageName) {
        try {
          if (window.__jsfAudioMuted) return;
          const spec = JSF_FOLEY_MANIFEST[manifestKey];
          if (!spec) return;
          stopActiveKalinaLocationWords(false);

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            if (!window.__hpLampAudioCtx) {
              window.__hpLampAudioCtx = new AudioCtx();
            }
            const ctx = window.__hpLampAudioCtx;
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }
            const startBuf = (buf) => {
              if (!buf || window.__jsfAudioMuted) return;
              const t0 = ctx.currentTime + 0.002;
              const src = ctx.createBufferSource();
              const gain = ctx.createGain();
              src.buffer = buf;
              gain.gain.setValueAtTime(spec.gain, t0);
              src.connect(gain);
              gain.connect(ctx.destination);
              const rec = { src, gain, stageName };
              activeKalinaWordNodes.push(rec);
              src.onended = () => {
                activeKalinaWordNodes = activeKalinaWordNodes.filter((x) => x !== rec);
              };
              src.start(t0);
              window.__kalinaLocVoiceStats[stageName] = (window.__kalinaLocVoiceStats[stageName] || 0) + 1;
            };

            if (foleyDecodedBuffers[manifestKey]) {
              startBuf(foleyDecodedBuffers[manifestKey]);
              return;
            }
            if (foleyRawBytes[manifestKey]) {
              ctx.decodeAudioData(foleyRawBytes[manifestKey].slice(0))
                .then((decoded) => {
                  foleyDecodedBuffers[manifestKey] = decoded;
                  startBuf(decoded);
                })
                .catch(() => {});
              return;
            }
          }

          const base = foleyHtmlAudioPool[manifestKey];
          if (base) {
            const htmlNode = base.cloneNode();
            htmlNode.volume = Math.min(1.0, spec.gain);
            const rec = { htmlNode, stageName };
            activeKalinaWordNodes.push(rec);
            htmlNode.onended = () => {
              activeKalinaWordNodes = activeKalinaWordNodes.filter((x) => x !== rec);
            };
            htmlNode.play().catch(() => {});
            window.__kalinaLocVoiceStats[stageName] = (window.__kalinaLocVoiceStats[stageName] || 0) + 1;
          }
        } catch (_) {}
      }

      let lastLocWhisperSig = 'location';
      const LOCATION_WHISPER_PRESETS = {
        location: { text: 'Location',  size: '76', spacing: '2',   yMain: '176', yExt: '180.5', strokeW: '2.6', maskStrokeW: '3.5' },
        ask:      { text: 'ASK',       size: '88', spacing: '6',   yMain: '176', yExt: '180.5', strokeW: '2.8', maskStrokeW: '3.8' },
        for:      { text: 'FOR',       size: '88', spacing: '6',   yMain: '176', yExt: '180.5', strokeW: '2.8', maskStrokeW: '3.8' },
        exact:    { text: 'The exact', size: '58', spacing: '2.4', yMain: '176', yExt: '180.5', strokeW: '2.5', maskStrokeW: '3.4' }
      };

      function setLocationKnockoutPhrase(stageKey) {
        const preset = LOCATION_WHISPER_PRESETS[stageKey] || LOCATION_WHISPER_PRESETS.location;
        if (stageKey === lastLocWhisperSig) return;
        lastLocWhisperSig = stageKey;

        const maskMain = document.getElementById('hp-loc-mask-main');
        const extMain = document.getElementById('hp-loc-extrude-main');
        const rimMain = document.getElementById('hp-loc-rim-main');
        [maskMain, extMain, rimMain].forEach((node) => {
          if (!node) return;
          node.textContent = preset.text;
          node.setAttribute('font-size', preset.size);
          node.setAttribute('letter-spacing', preset.spacing);
        });
        if (maskMain) {
          maskMain.setAttribute('y', preset.yMain);
          maskMain.setAttribute('stroke-width', preset.maskStrokeW);
        }
        if (extMain) {
          extMain.setAttribute('data-base-y', preset.yExt);
          extMain.setAttribute('y', preset.yExt);
          extMain.setAttribute('stroke-width', preset.maskStrokeW);
        }
        if (rimMain) {
          rimMain.setAttribute('y', preset.yMain);
          rimMain.setAttribute('stroke-width', preset.strokeW);
          rimMain.setAttribute('stroke', stageKey === 'exact' ? 'url(#hp-details-shimmer-grad)' : 'url(#hp-gold-rim-map)');
          if (stageKey !== 'exact') {
            rimMain.style.removeProperty('filter');
          }
        }
      }

      function applyExactTypoShimmer(p, power) {
        const rimMain = document.getElementById('hp-loc-rim-main');
        const grad = document.getElementById('hp-details-shimmer-grad');
        const u = Math.max(0, Math.min(1, (p - 0.44) / 0.445));

        // 1. Zero letter-spacing mutation (0.0px subpixel jitter!); pure 24K platinum-gold specular sweep across "The exact"
        if (grad) {
          const wavePos = 35 + u * 390;
          grad.setAttribute('x1', (wavePos - 135).toFixed(1));
          grad.setAttribute('x2', (wavePos + 135).toFixed(1));
        }

        // 2. Physical filament-coupled gold rim bloom (brightens crisply as tungsten filament surges & dips)
        if (rimMain) {
          const contrastBoost = 0.55 + 0.45 * (1.0 - power * 0.4);
          const glowPx = (14 + 14 * contrastBoost).toFixed(1);
          const glowAlpha = (0.50 + 0.40 * contrastBoost).toFixed(2);
          rimMain.style.setProperty(
            'filter',
            `drop-shadow(0 4px 12px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 ${glowPx}px rgba(253, 224, 71, ${glowAlpha}))`,
            'important'
          );
        }
      }

      function computeDyingFilamentState(p, isMap = false) {
        if (isMap) {
          // Elastic tungsten carrier matching Music's organic bulb-bounce curve (1.0 -> 0.78 -> crisp rapid-sputter tail -> 0.04)
          const carrier = p < 0.92
            ? (1.0 - (p / 0.92) * 0.22)
            : Math.max(0.04, 0.78 * Math.pow(1.0 - (p - 0.92) / 0.08, 1.55));

          let dip = 0.0;
          let bounceIdx = -1;
          for (let i = 0; i < MAP_TUNGSTEN_FLICKER_BOUNCES.length; i++) {
            const b = MAP_TUNGSTEN_FLICKER_BOUNCES[i];
            if (p >= b.s && p <= b.e) {
              const u = (p - b.s) / (b.e - b.s);
              const shape = Math.pow(Math.sin(u * Math.PI), 0.78);
              dip = b.depth * shape;
              if (u >= 0.24 && u <= 0.76) bounceIdx = i;
              break;
            }
          }
          if (p >= 0.965) {
            dip = Math.max(dip, Math.min(1.0, (p - 0.965) / 0.035));
          }
          const power = Math.max(0.04, Math.min(1.0, carrier * (1.0 - dip)));
          return { power, dip, bounceIdx };
        }

        // Default 5-bounce profile for bottom living portraits (0, 1, 2)
        let carrier = p < 0.91
          ? (1.0 - (p / 0.91) * 0.20)
          : Math.max(0.04, 0.80 * Math.pow(1.0 - (p - 0.91) / 0.09, 1.65));

        let dip = 0.0;
        let bounceIdx = -1;
        for (let i = 0; i < TUNGSTEN_FLICKER_BOUNCES.length; i++) {
          const b = TUNGSTEN_FLICKER_BOUNCES[i];
          if (p >= b.s && p <= b.e) {
            const u = (p - b.s) / (b.e - b.s);
            const shape = Math.pow(Math.sin(u * Math.PI), 0.78);
            dip = b.depth * shape;
            if (u >= 0.25 && u <= 0.75) bounceIdx = i;
            break;
          }
        }
        if (p >= 0.92) {
          dip = Math.max(dip, Math.min(1.0, (p - 0.92) / 0.08));
        }

        const power = Math.max(0.04, Math.min(1.0, carrier * (1.0 - dip)));
        return { power, dip, bounceIdx };
      }

      function computeDyingFilamentPower(p) {
        return computeDyingFilamentState(p).power;
      }

      function playFilamentBounceCrackle(strength = 0.6) {
        try {
          if (window.__jsfAudioMuted) return;
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window.__hpLampAudioCtx) {
            window.__hpLampAudioCtx = new AudioCtx();
          }
          const ctx = window.__hpLampAudioCtx;
          if (ctx.state !== 'running') return;

          const now = ctx.currentTime;
          const dur = 0.055;
          // Whisper-soft warm 2200K filament contact flutter ('zzzt') + 100Hz mains sag thump
          const bufLen = Math.max(64, Math.floor(ctx.sampleRate * dur));
          const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
          const ch = noiseBuf.getChannelData(0);
          for (let i = 0; i < bufLen; i++) {
            const env = Math.sin((i / bufLen) * Math.PI);
            ch[i] = (Math.random() * 2 - 1) * env;
          }
          const nSrc = ctx.createBufferSource();
          nSrc.buffer = noiseBuf;
          const bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(1650, now);
          bp.Q.setValueAtTime(2.4, now);
          const nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.0085 * strength, now);
          nGain.gain.exponentialRampToValueAtTime(0.0002, now + dur);
          nSrc.connect(bp);
          bp.connect(nGain);
          nGain.connect(ctx.destination);
          nSrc.start(now);
          nSrc.stop(now + dur + 0.005);
        } catch (_) {}
      }

      function syncAlibiToActiveLamps() {
        if (typeof window.__setAlibiLampSyncState !== 'function') return;
        const keys = ['map', 0, 1, 2];
        const anyLit = keys.some((k) => !!litLamps[k]);
        const lampsPayload = {};
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          const ds = lampDyingState[k] || { dying: false, power: 0, dip: 0 };
          lampsPayload[String(k)] = {
            lit: !!litLamps[k],
            dying: !!(litLamps[k] && ds.dying),
            power: litLamps[k] ? (ds.dying ? ds.power : 1.0) : 0.0,
            dip: (litLamps[k] && ds.dying) ? ds.dip : 0.0
          };
        }
        window.__setAlibiLampSyncState({
          anyLit,
          lamps: lampsPayload
        });
      }

      function applyDyingVisuals(el, power, p = 0) {
        if (!el) return;
        const isMapZone = el.id === 'torch-zone-1';
        const lampOn = el.querySelector('.hp-lamp-on');
        const cone = el.querySelector('.hp-lamp-light-cone');
        const cover = el.querySelector('.hp-knockout-text-cover');
        const mediaEls = el.querySelectorAll('.pass-expose-map-img, .pass-expose-map-iframe, .hp-living-video');

        if (lampOn) {
          lampOn.style.setProperty('opacity', power.toFixed(3), 'important');
          lampOn.style.setProperty('filter', `brightness(${(0.3 + 0.7 * power).toFixed(3)})`, 'important');
        }
        if (cone) {
          cone.style.setProperty('opacity', (power * 0.95).toFixed(3), 'important');
        }

        if (isMapZone) {
          // Warm 2200K tungsten map glow breathing 1:1 with the physical bulb ("ASK" -> "FOR" -> "The exact" -> "Location")
          const settleTail = p >= 0.94 ? Math.min(1.0, (p - 0.94) / 0.06) : 0.0;
          const warmB = 0.26 + 0.86 * power;
          const warmS = 0.65 + 0.55 * power;
          const warmSep = 0.28 * (1.0 - power * 0.55);
          // Blend smoothly into the unlit knockout aperture look (brightness 1.18, saturate 1.38, sepia 0) over final 6%
          const b = (warmB * (1.0 - settleTail) + 1.18 * settleTail).toFixed(3);
          const s = (warmS * (1.0 - settleTail) + 1.38 * settleTail).toFixed(3);
          const sep = (warmSep * (1.0 - settleTail)).toFixed(3);
          const con = (1.03 * (1.0 - settleTail) + 1.25 * settleTail).toFixed(3);
          mediaEls.forEach((m) => {
            m.style.setProperty('filter', `brightness(${b}) sepia(${sep}) saturate(${s}) contrast(${con})`, 'important');
          });

          // Continuous sentence timestamp sync ("If you're coming tonight... just ask, for, the exact location.")
          lastMapDyingP = p;
          if (!locSpokenStages.sentence) {
            locSpokenStages.sentence = true;
            playKalinaLocationSentence();
          }
          const sec = getKalinaSentenceElapsedSec(p * 4.8);
          if (sec < KALINA_SENTENCE_CUES.ask) {
            setLocationKnockoutPhrase('location');
          } else if (sec < KALINA_SENTENCE_CUES.for) {
            setLocationKnockoutPhrase('ask');
            if (!locSpokenStages.ask) {
              locSpokenStages.ask = true;
              window.__kalinaLocVoiceStats.ask = (window.__kalinaLocVoiceStats.ask || 0) + 1;
            }
          } else if (sec < KALINA_SENTENCE_CUES.exact) {
            setLocationKnockoutPhrase('for');
            if (!locSpokenStages.for) {
              locSpokenStages.for = true;
              window.__kalinaLocVoiceStats.for = (window.__kalinaLocVoiceStats.for || 0) + 1;
            }
          } else if (sec < KALINA_SENTENCE_CUES.location) {
            setLocationKnockoutPhrase('exact');
            applyExactTypoShimmer(p, power);
            if (!locSpokenStages.exact) {
              locSpokenStages.exact = true;
              window.__kalinaLocVoiceStats.exact = (window.__kalinaLocVoiceStats.exact || 0) + 1;
            }
          } else {
            setLocationKnockoutPhrase('location');
            if (!locSpokenStages.location) {
              locSpokenStages.location = true;
              window.__kalinaLocVoiceStats.location = (window.__kalinaLocVoiceStats.location || 0) + 1;
              unlockLocationConciergeDockClimax(false);
            }
          }

          // Dynamic Bulb-Coupled Cover Veil (just like Music!):
          // Instead of slamming a frozen 95% black wall over the map, coverAlpha breathes inversely with lamp power:
          // - Bulb rebound (power ~ 0.82) -> coverAlpha eases to ~0.46 so the warm lit map breathes visibly!
          // - Voltage sag (power ~ 0.12)  -> coverAlpha snaps to ~0.91 so "ASK / FOR / The exact / Location" pops!
          const endLock = p >= 0.885 ? Math.min(1.0, (p - 0.885) / 0.115) : 0.0;
          if (cover) {
            const rampIn = Math.min(1.0, p / 0.055);
            const rawCover = rampIn * (0.36 + 0.62 * (1.0 - power));
            const coverAlpha = Math.max(0, Math.min(1.0, rawCover * (1.0 - endLock) + 1.0 * endLock));
            cover.style.setProperty('visibility', 'visible', 'important');
            cover.style.setProperty('opacity', coverAlpha.toFixed(3), 'important');
            cover.style.setProperty('transform', 'scale(1.0)', 'important');
          }

          const glyphLayer = document.getElementById('hp-loc-glyph-layer');
          if (glyphLayer) {
            // Crisp gold rim presence during both voltage dips AND rebounds, settling smoothly to 1.000 at offMs
            const dipPresence = 0.62 + 0.38 * (1.0 - power * 0.45);
            const glyphAlpha = p >= 0.885
              ? (dipPresence * (1.0 - endLock) + 1.0 * endLock)
              : dipPresence;
            glyphLayer.style.opacity = glyphAlpha.toFixed(3);
          }
        } else {
          const b = (0.22 + 0.80 * power).toFixed(3);
          const s = (0.35 + 0.68 * power).toFixed(3);
          mediaEls.forEach((m) => {
            m.style.setProperty('filter', `brightness(${b}) saturate(${s}) contrast(1.02)`, 'important');
          });
          if (cover) {
            const coverAlpha = Math.max(0, Math.min(0.95, (1.0 - power) * 0.92));
            cover.style.setProperty('visibility', 'visible', 'important');
            cover.style.setProperty('opacity', coverAlpha.toFixed(3), 'important');
            cover.style.setProperty('transform', 'scale(1.0)', 'important');
          }
        }
      }

      function clearDyingVisuals(el) {
        if (!el) return;
        const lampOn = el.querySelector('.hp-lamp-on');
        const cone = el.querySelector('.hp-lamp-light-cone');
        const cover = el.querySelector('.hp-knockout-text-cover');
        const mediaEls = el.querySelectorAll('.pass-expose-map-img, .pass-expose-map-iframe, .hp-living-video');

        if (lampOn) {
          lampOn.style.removeProperty('opacity');
          lampOn.style.removeProperty('filter');
        }
        if (cone) {
          cone.style.removeProperty('opacity');
        }
        mediaEls.forEach((m) => {
          m.style.removeProperty('filter');
        });
        if (cover) {
          cover.style.removeProperty('visibility');
          cover.style.removeProperty('opacity');
          cover.style.removeProperty('transform');
        }
        if (el.id === 'torch-zone-1') {
          setLocationKnockoutPhrase('location', 0);
          const glyphLayer = document.getElementById('hp-loc-glyph-layer');
          if (glyphLayer) {
            glyphLayer.style.removeProperty('opacity');
          }
        }
      }

      function clearLampAutoOffTimer(target) {
        const key = target === 'map' ? 'map' : Number(target);
        const rec = lampTimers[key];
        if (!rec) return;
        if (rec.warn) {
          clearTimeout(rec.warn);
          rec.warn = null;
        }
        if (rec.off) {
          clearTimeout(rec.off);
          rec.off = null;
        }
        if (rec.raf) {
          cancelAnimationFrame(rec.raf);
          rec.raf = null;
        }
        if (key === 'map') {
          stopActiveKalinaLocationWords(lastMapDyingP >= 0.88);
          locSpokenStages = { ask: false, for: false, exact: false, location: false, sentence: false };
          lastMapDyingP = 0;
        }
        if (lampDyingState[key]) {
          lampDyingState[key].dying = false;
          lampDyingState[key].power = litLamps[key] ? 1.0 : 0.0;
          lampDyingState[key].dip = 0.0;
          lampDyingState[key].lastBounceIdx = -1;
        }
        const el = getZoneElement(key);
        if (el) {
          el.removeAttribute('data-lamp-dying');
          clearDyingVisuals(el);
        }
        syncAlibiToActiveLamps();
      }

      function pulseLocationConciergeBar() {
        const bar = document.getElementById('salon-location-concierge-bar');
        if (!bar) return;
        bar.classList.remove('loc-concierge-rescued-glow');
        void bar.offsetWidth;
        bar.classList.add('loc-concierge-rescued-glow');
      }

      function triggerLampRefillSurge(el) {
        if (!el) return;
        el.classList.remove('hp-lamp-refill-surge');
        void el.offsetWidth;
        el.classList.add('hp-lamp-refill-surge');
        if (el.__refillSurgeTid) clearTimeout(el.__refillSurgeTid);
        el.__refillSurgeTid = setTimeout(() => {
          el.classList.remove('hp-lamp-refill-surge');
        }, 440);
      }

      function scheduleLampAutoOffTimer(target) {
        const key = target === 'map' ? 'map' : Number(target);
        clearLampAutoOffTimer(key);
        if (key === 'map' && window.__holdLocationLampForMessage) {
          return;
        }

        const el = getZoneElement(key);
        if (!el) return;

        // 7-second core cycle for portrait lamps (4.8s full bright + 2.2s dying flicker = 7.0s)
        // & Location narrative cycle (4.5s full bright + 4.8s ASK -> FOR -> The exact -> Location)
        const defaultWarn = key === 'map' ? (Number(window.__HP_MAP_DYING_START_MS) || 4500) : (Number(window.__HP_LAMP_DYING_START_MS) || 4800);
        const defaultOff  = key === 'map' ? (Number(window.__HP_MAP_AUTO_OFF_MS) || 9300) : (Number(window.__HP_LAMP_AUTO_OFF_MS) || 7000);
        const warnMs = Math.max(500, defaultWarn);
        const offMs = Math.max(warnMs + 400, defaultOff);
        const dyingDuration = Math.max(400, offMs - warnMs);

        lampTimers[key].warn = setTimeout(() => {
          const zoneEl = getZoneElement(key);
          if (zoneEl && zoneEl.getAttribute('data-lamp-lit') === 'true') {
            if (key === 'map') {
              locSpokenStages = { ask: false, for: false, exact: false, location: false, sentence: false };
              lastMapDyingP = 0;
              setLocationKnockoutPhrase('location');
            }
            zoneEl.setAttribute('data-lamp-dying', 'true');
            if (lampDyingState[key]) {
              lampDyingState[key].dying = true;
              lampDyingState[key].power = 1.0;
              lampDyingState[key].dip = 0.0;
              lampDyingState[key].lastBounceIdx = -1;
            }
            playFilamentDyingWarningSound();
            const startDyingTs = performance.now();
            function tickDying(now) {
              if (!zoneEl || zoneEl.getAttribute('data-lamp-lit') !== 'true' || zoneEl.getAttribute('data-lamp-dying') !== 'true') {
                return;
              }
              const p = Math.max(0, Math.min(1, (now - startDyingTs) / dyingDuration));
              const isMapKey = key === 'map';
              const fState = computeDyingFilamentState(p, isMapKey);
              if (lampDyingState[key]) {
                lampDyingState[key].dying = true;
                lampDyingState[key].power = fState.power;
                lampDyingState[key].dip = fState.dip;
                if (fState.bounceIdx >= 0 && fState.bounceIdx !== lampDyingState[key].lastBounceIdx) {
                  lampDyingState[key].lastBounceIdx = fState.bounceIdx;
                  const crackleStrength = (isMapKey && p >= 0.82)
                    ? (0.36 + fState.dip * 0.28)
                    : (0.55 + fState.dip * 0.45);
                  playFilamentBounceCrackle(crackleStrength);
                }
              }
              applyDyingVisuals(zoneEl, fState.power, p);
              syncAlibiToActiveLamps();
              if (p < 1) {
                lampTimers[key].raf = requestAnimationFrame(tickDying);
              }
            }
            lampTimers[key].raf = requestAnimationFrame(tickDying);
          }
        }, warnMs);

        lampTimers[key].off = setTimeout(() => {
          const zoneEl = getZoneElement(key);
          if (key === 'map') {
            unlockLocationConciergeDockClimax(true);
          }
          if (zoneEl && zoneEl.getAttribute('data-lamp-lit') === 'true') {
            window.__toggleHarryPotterLamp(key, false);
          }
        }, offMs);
      }

      function unlockLocationConciergeDockClimax(silent) {
        const z1 = document.getElementById('torch-zone-1');
        if (!z1 || locIconsEverUnlocked) return;
        locIconsEverUnlocked = true;
        z1.setAttribute('data-loc-unlocked', 'true');
        if (!silent) {
          z1.setAttribute('data-loc-unlocking', 'true');
          if (!window.__jsfAudioMuted && typeof window.__playJsfFoleySfx === 'function') {
            window.__playJsfFoleySfx('switch_on', { gain: 0.14, rate: 0.96, jitter: 0.01 });
          }
          if (locIconsUnlockTimer) clearTimeout(locIconsUnlockTimer);
          locIconsUnlockTimer = setTimeout(() => {
            z1.removeAttribute('data-loc-unlocking');
          }, 820);
        }
      }
      window.__forceUnlockLocationConciergeDock = unlockLocationConciergeDockClimax;

      window.__resetHarryPotterLampTimer = function(target) {
        const key = target === 'map' ? 'map' : Number(target);
        const el = getZoneElement(key);
        if (el && el.getAttribute('data-lamp-lit') === 'true') {
          const wasDying = el.getAttribute('data-lamp-dying') === 'true';
          scheduleLampAutoOffTimer(key);
          if (wasDying && key === 'map') {
            playBrassSwitchClickSound(true);
            pulseLocationConciergeBar();
          }
        }
      };

      function playFilamentDyingWarningSound() {
        // Pure visual + organic crackle flutter only — zero synthetic oscillator hum!
      }

      function playBrassSwitchClickSound(isTurningOn) {
        window.__playJsfFoleySfx(isTurningOn ? 'switch_on' : 'switch_off');
      }

      let lastQuestLevel = 0;

      function playFrameLevelUpStepChime(_level) {
        // Clean physical brass switch foley only — zero synthetic arcade step beep!
      }

      function updateMasterLampProgress() {
        Object.keys(litLamps).forEach((k) => {
          if (litLamps[k]) everDiscoveredLamps[k] = true;
        });
        const discoveredCount = Object.values(everDiscoveredLamps).filter(Boolean).length;
        const litCount = Object.values(litLamps).filter(Boolean).length;

        const cardOverlay = document.getElementById('under-dev-card-overlay');
        if (cardOverlay) {
          cardOverlay.setAttribute('data-quest-level', String(discoveredCount));
          if (discoveredCount > lastQuestLevel) {
            cardOverlay.classList.remove('frame-level-up-pulse');
            void cardOverlay.offsetWidth;
            cardOverlay.classList.add('frame-level-up-pulse');
            if (discoveredCount < 4) {
              playFrameLevelUpStepChime(discoveredCount);
            }
          }
        }
        lastQuestLevel = discoveredCount;

        // Trigger 4/4 Quest Clear celebration once all 4 zones have been discovered,
        // WHILE preserving each lamp's dying filament flicker & per-stem audio bounce!
        if (!salon4of4QuestCleared && (discoveredCount === 4 || litCount === 4)) {
          salon4of4QuestCleared = true;
          window.__salon4of4QuestCleared = true;
          window.__triggerQuestClearEffect('back');
        }

        const vipPillText = document.getElementById('jsf-backface-vip-pill-text');
        if (vipPillText) {
          if (salon4of4QuestCleared) {
            vipPillText.textContent = `👑 4/4 · SALON ENSEMBLE`;
          } else {
            vipPillText.textContent = `💡 STEMS ${litCount}/4 · VIP PASS`;
          }
        }

        // Clicking Location unlocks ALL 3 bottom portrait buttons (Party, Social, Biz) at once!
        const z1 = document.getElementById('torch-zone-1');
        if (z1 && (litLamps.map || everDiscoveredLamps.map)) {
          z1.setAttribute('data-zone-state', litLamps.map ? 'lit' : 'ember');
        }

        const z2 = document.getElementById('torch-zone-2');
        const cell0 = document.getElementById('hp-cell-0');
        const cell1 = document.getElementById('hp-cell-1');
        const cell2 = document.getElementById('hp-cell-2');

        const unlockAllBottom = !!(everDiscoveredLamps.map || discoveredCount >= 1);
        const unlockTicket = !!(salon4of4QuestCleared || discoveredCount >= 4);

        if (z2) {
          z2.setAttribute('data-zone-state', unlockAllBottom ? 'lit' : 'unlit');
        }
        if (cell0) {
          cell0.setAttribute('data-cell-unlocked', unlockAllBottom ? 'true' : 'false');
        }
        if (cell1) {
          cell1.setAttribute('data-cell-unlocked', unlockAllBottom ? 'true' : 'false');
        }
        if (cell2) {
          cell2.setAttribute('data-cell-unlocked', unlockAllBottom ? 'true' : 'false');
        }

        const z3 = document.getElementById('torch-zone-3');
        if (z3) {
          z3.setAttribute('data-zone-state', unlockTicket ? 'lit' : 'unlit');
          z3.setAttribute('data-sanctuary-sealed', unlockTicket ? 'false' : 'true');
        }
      }

      // Initialize progressive state immediately on load so 0/4 starts clean (only Location visible, frame at Level 0)
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateMasterLampProgress);
      } else {
        updateMasterLampProgress();
      }

      window.__toggleHarryPotterLamp = function(target, forceState) {
        if (target === 'map') {
          window.__holdLocationLampForMessage = false;
          const pnl = document.getElementById('salon-location-msg-panel');
          if (pnl) pnl.classList.remove('open');
          const z1 = document.getElementById('torch-zone-1');
          if (!z1) return;
          z1.classList.remove('loc-msg-open');
          const isCurrentlyLit = z1.getAttribute('data-lamp-lit') === 'true';
          const isCurrentlyDying = z1.getAttribute('data-lamp-dying') === 'true';

          // Clicking the lamp ANYTIME before it goes completely dark (whether full bright OR flickering/dying!)
          // REFILLS +7s back to 100% voltage with a warm filament surge instead of turning it off!
          if (typeof forceState !== 'boolean' && isCurrentlyLit) {
            scheduleLampAutoOffTimer('map');
            playBrassSwitchClickSound(true);
            triggerLampRefillSurge(z1);
            pulseLocationConciergeBar();
            if (typeof window.__startAlibiFromLocationLamp === 'function') {
              window.__startAlibiFromLocationLamp();
            }
            syncAlibiToActiveLamps();
            return;
          }

          const next = typeof forceState === 'boolean' ? forceState : true;
          clearLampAutoOffTimer('map');
          z1.setAttribute('data-lamp-lit', next ? 'true' : 'false');
          z1.setAttribute('data-zone-state', next ? 'lit' : 'unlit');
          litLamps.map = next;
          playBrassSwitchClickSound(next);
          if (next) {
            // Note: 3D Leica Brass Concierge Dock now stays hidden until the 2.972s "Location" + Timpani Climax!
            if (typeof window.__startAlibiFromLocationLamp === 'function') {
              window.__startAlibiFromLocationLamp();
            }
            scheduleLampAutoOffTimer('map');
          }
        } else {
          const idx = Number(target);
          const cell = document.getElementById(`hp-cell-${idx}`);
          const vid = document.getElementById(`hp-video-${idx}`);
          if (!cell) return;
          const isCurrentlyLit = cell.getAttribute('data-lamp-lit') === 'true';

          // Clicking the lamp ANYTIME before it turns completely off REFILLS +7s back to 100% brightness!
          if (typeof forceState !== 'boolean' && isCurrentlyLit) {
            scheduleLampAutoOffTimer(idx);
            playBrassSwitchClickSound(true);
            triggerLampRefillSurge(cell);
            if (vid && vid.paused) {
              const p = vid.play();
              if (p && typeof p.catch === 'function') p.catch(() => {});
            }
            syncAlibiToActiveLamps();
            return;
          }

          const next = typeof forceState === 'boolean' ? forceState : true;
          clearLampAutoOffTimer(idx);
          cell.setAttribute('data-lamp-lit', next ? 'true' : 'false');
          litLamps[idx] = next;
          playBrassSwitchClickSound(next);

          if (vid) {
            if (next) {
              // Pure New-Venue (U22 Party16 / Net16) 3x3 random rotation pools
              const SALON_VIDEO_POOLS = {
                0: [
                  '/assets/videos/music_vinyl_jam_curated.mp4',
                  '/assets/videos/music_brass_guitar_jam.mp4',
                  '/assets/videos/music_vinyl_b2b_duo.mp4'
                ],
                1: [
                  '/assets/videos/social_design_talk_curated.mp4',
                  '/assets/videos/social_group_cheers.mp4'
                ],
                2: [
                  '/assets/videos/solo_doorway_peek.mp4',
                  '/assets/videos/solo_atelier_afterglow_curated.mp4'
                ]
              };
              const pool = SALON_VIDEO_POOLS[idx];
              if (pool && pool.length > 1) {
                const curSrc = vid.getAttribute('src') || '';
                const others = pool.filter((u) => u !== curSrc);
                const chosen = others.length ? others[Math.floor(Math.random() * others.length)] : pool[0];
                if (chosen && chosen !== curSrc) {
                  vid.src = chosen;
                  vid.load();
                }
              }
              vid.currentTime = 0;
              const p = vid.play();
              if (p && typeof p.catch === 'function') p.catch(() => {});
              scheduleLampAutoOffTimer(idx);
            } else {
              vid.pause();
            }
          } else if (next) {
            scheduleLampAutoOffTimer(idx);
          }
        }

        updateMasterLampProgress();
        syncAlibiToActiveLamps();
      };

      window.__handleLivingPortraitClick = function(idx) {
        const cell = document.getElementById(`hp-cell-${idx}`);
        if (!cell) return;
        // First click on an unlit portrait turns on its brass lamp & starts the 7s timer!
        if (cell.getAttribute('data-lamp-lit') !== 'true') {
          window.__toggleHarryPotterLamp(idx, true);
        } else if (cell.getAttribute('data-lamp-dying') === 'true') {
          // Clicking while flickering/dying rescues & refills the lamp back to full 7s brightness!
          window.__resetHarryPotterLampTimer(idx);
          playBrassSwitchClickSound(true);
          triggerLampRefillSurge(cell);
        } else if (typeof window.__openSalonConceptDrawer === 'function') {
          // Clicking an already-lit living portrait opens the full preview drawer & refills 7s timer
          window.__resetHarryPotterLampTimer(idx);
          window.__openSalonConceptDrawer(idx);
        }
      };

      // Only rescue/refill on map body pointerdown when the map lamp is flickering/dying, so the user gets to actively tap the lamp to keep it alive!
      function bindMapSensorExtension() {
        const mapZone = document.getElementById('torch-zone-1');
        if (!mapZone) return;
        ['wheel'].forEach((evt) => {
          mapZone.addEventListener((evt), () => {
            if (mapZone.getAttribute('data-lamp-lit') === 'true' && mapZone.getAttribute('data-lamp-dying') !== 'true') {
              window.__resetHarryPotterLampTimer('map');
            }
          }, { passive: true });
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindMapSensorExtension);
      } else {
        bindMapSensorExtension();
      }

      // Also upgrade the fullscreen drawer so it plays the living video when opened!
      const origOpenDrawer = window.__openSalonConceptDrawer;
      if (typeof origOpenDrawer === 'function') {
        window.__openSalonConceptDrawer = function(idx) {
          origOpenDrawer(idx);
          window.__toggleHarryPotterLamp(idx, true);
        };
      }

// === SALON LOCATION MESSAGE PANEL & SERVER STORAGE API ===
      window.__holdLocationLampForMessage = false;

      window.__openSalonLocationMessagePanel = function() {
        const panel = document.getElementById('salon-location-msg-panel');
        if (panel && panel.classList.contains('open')) {
          window.__closeSalonLocationMessagePanel();
          return;
        }
        const z1 = document.getElementById('torch-zone-1');
        if (z1 && z1.getAttribute('data-lamp-lit') !== 'true') {
          window.__toggleHarryPotterLamp('map', true);
        }
        if (z1) z1.classList.add('loc-msg-open');
        window.__holdLocationLampForMessage = true;
        clearLampAutoOffTimer('map');

        if (panel) {
          panel.classList.add('open');
          panel.setAttribute('aria-hidden', 'false');
        }
        const contactInp = document.getElementById('salon-msg-contact-input');
        if (contactInp) {
          setTimeout(() => contactInp.focus(), 80);
        }
      };

      window.__closeSalonLocationMessagePanel = function() {
        window.__holdLocationLampForMessage = false;
        const panel = document.getElementById('salon-location-msg-panel');
        if (panel) {
          panel.classList.remove('open');
          panel.setAttribute('aria-hidden', 'true');
        }
        const z1 = document.getElementById('torch-zone-1');
        if (z1) z1.classList.remove('loc-msg-open');
        if (z1 && z1.getAttribute('data-lamp-lit') === 'true') {
          scheduleLampAutoOffTimer('map');
        }
      };

      window.__submitSalonLocationMessage = async function() {
        const contactEl = document.getElementById('salon-msg-contact-input');
        const bodyEl = document.getElementById('salon-msg-body-input');
        const fbEl = document.getElementById('salon-msg-feedback');
        const btnEl = document.getElementById('salon-msg-submit-btn');

        const contact = contactEl ? contactEl.value.trim() : '';
        const message = bodyEl ? bodyEl.value.trim() : '';

        if (!contact && !message) {
          if (fbEl) {
            fbEl.style.color = '#fca5a5';
            fbEl.textContent = 'Enter @handle or message';
          }
          if (contactEl) contactEl.focus();
          return false;
        }

        if (btnEl) btnEl.disabled = true;
        if (fbEl) {
          fbEl.style.color = '#fde047';
          fbEl.textContent = 'Sending...';
        }

        const payload = {
          topic: 'Location & Salon Inquiry',
          contact: contact || '미기재',
          message: message || '상세 위치 안내 요청',
          submittedAt: new Date().toISOString()
        };

        // Always keep a backup in localStorage as well
        try {
          const localList = JSON.parse(localStorage.getItem('jsf_salon_messages_backup') || '[]');
          localList.push(payload);
          localStorage.setItem('jsf_salon_messages_backup', JSON.stringify(localList));
        } catch (_) {}

        try {
          const res = await fetch('/api/salon-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            if (fbEl) {
              fbEl.style.color = '#4ade80';
              fbEl.textContent = '✓ Sent';
            }
            if (bodyEl) bodyEl.value = '';
            if (btnEl) btnEl.disabled = false;
            return data;
          } else {
            throw new Error('HTTP ' + res.status);
          }
        } catch (err) {
          if (fbEl) {
            fbEl.style.color = '#4ade80';
            fbEl.textContent = '✓ Saved';
          }
          if (btnEl) btnEl.disabled = false;
          return { ok: true, fallback: true };
        }
      };

      const prevPlugTorch = window.__plugTorchIntoAltar;
      window.__plugTorchIntoAltar = function(zoneId) {
        if (typeof prevPlugTorch === 'function') {
          prevPlugTorch(zoneId);
        }
        // Keep all 4 Harry Potter lamps under explicit user control so the 4 Knockout Text Covers
        // (Location, Party, Social, Biz) start covered (LAMPS 0/4) until clicked!
      };

      // === 4TH-WALL-BREAKING 3D LOCATION LEVITATION & POINTER PARALLAX ENGINE ===
      (function initLocation3dBreakoutRig() {
        let rafId = null;
        let pointerNormX = 0;
        let pointerNormY = 0;
        let curX = 0;
        let curY = 0;

        function resetUnlitVars(z1) {
          if (!z1) return;
          z1.style.setProperty('--loc-tx', '0px');
          z1.style.setProperty('--loc-ty', '0px');
          z1.style.setProperty('--loc-rx', '0deg');
          z1.style.setProperty('--loc-ry', '0deg');
          z1.style.setProperty('--loc-rz', '0deg');
          z1.style.setProperty('--loc-shx', '8px');
          z1.style.setProperty('--loc-shy', '26px');
          const depthText = z1.querySelector('.hp-knockout-depth-extrude');
          if (depthText) {
            const baseExtY = parseFloat(depthText.getAttribute('data-base-y') || '180.5');
            depthText.setAttribute('x', '232.50');
            depthText.setAttribute('y', baseExtY.toFixed(2));
          }
        }

        function startLoopIfActive() {
          const overlay = document.getElementById('under-dev-card-overlay');
          const z1 = document.getElementById('torch-zone-1');
          if (!overlay || !z1) return;
          const isLit = z1.getAttribute('data-lamp-lit') === 'true';
          if (overlay.classList.contains('active') && isLit && !rafId) {
            rafId = requestAnimationFrame(tickLocation3d);
          } else if (!isLit) {
            resetUnlitVars(z1);
          }
        }

        function tickLocation3d(now) {
          const overlay = document.getElementById('under-dev-card-overlay');
          const z1 = document.getElementById('torch-zone-1');
          if (!overlay || !z1 || !overlay.classList.contains('active') || z1.getAttribute('data-lamp-lit') !== 'true') {
            rafId = null;
            resetUnlitVars(z1);
            return;
          }

          curX += (pointerNormX - curX) * 0.11;
          curY += (pointerNormY - curY) * 0.11;

          const t = now * 0.00115;
          const floatX = Math.sin(t * 0.85) * 1.6 + curX * 4.5;
          const floatY = Math.cos(t * 1.15) * 3.2 + curY * 3.5;
          const rx = -curY * 5.2 + Math.sin(t * 0.95) * 0.65;
          const ry = curX * 6.8 + Math.cos(t * 0.78) * 0.75;
          const rz = curX * 0.45 + Math.sin(t * 0.62) * 0.18;

          const shx = (8 - curX * 11).toFixed(2);
          const shy = (27 - curY * 8 + Math.cos(t * 1.15) * 2.5).toFixed(2);

          z1.style.setProperty('--loc-tx', floatX.toFixed(2) + 'px');
          z1.style.setProperty('--loc-ty', floatY.toFixed(2) + 'px');
          z1.style.setProperty('--loc-rx', rx.toFixed(2) + 'deg');
          z1.style.setProperty('--loc-ry', ry.toFixed(2) + 'deg');
          z1.style.setProperty('--loc-rz', rz.toFixed(2) + 'deg');
          z1.style.setProperty('--loc-shx', shx + 'px');
          z1.style.setProperty('--loc-shy', shy + 'px');

          const depthText = z1.querySelector('.hp-knockout-depth-extrude');
          if (depthText) {
            const baseExtY = parseFloat(depthText.getAttribute('data-base-y') || '180.5');
            depthText.setAttribute('x', (232.5 - curX * 3.2).toFixed(2));
            depthText.setAttribute('y', (baseExtY - curY * 2.8).toFixed(2));
          }

          rafId = requestAnimationFrame(tickLocation3d);
        }

        function bindBreakoutEvents() {
          const overlay = document.getElementById('under-dev-card-overlay');
          if (!overlay) return;

          window.addEventListener('pointermove', (e) => {
            if (!overlay.classList.contains('active')) return;
            const rect = overlay.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const nx = ((e.clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.65));
            const ny = ((e.clientY - (rect.top + rect.height * 0.36)) / (rect.height * 0.55));
            pointerNormX = Math.max(-1, Math.min(1, nx));
            pointerNormY = Math.max(-1, Math.min(1, ny));
            startLoopIfActive();
          }, { passive: true });

          overlay.addEventListener('pointerleave', () => {
            pointerNormX = 0;
            pointerNormY = 0;
          }, { passive: true });

          const obs = new MutationObserver(startLoopIfActive);
          obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
          const z1 = document.getElementById('torch-zone-1');
          if (z1) {
            obs.observe(z1, { attributes: true, attributeFilter: ['data-lamp-lit'] });
          }
          startLoopIfActive();
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', bindBreakoutEvents);
        } else {
          bindBreakoutEvents();
        }
      })();

      // =========================================================================
      // RETURNED SYMBOL INSPECT MODE (.symbol-inspect-mode ONLY!)
      // - Zero 3D tilt (prevents WebGL Z-buffer plane slicing across the Wine-Clef symbol!)
      // - Active ONLY after flipping to Salon & returning via ↺ (.symbol-inspect-mode)
      // - Cumulative hold >= 3.0s -> Lv.1, +1.0s each -> Lv.2..Lv.4 outer 2.5D frame upgrade
      // =========================================================================
      (function initSymbolInspectAndCumulativeFrameUpgrade() {
        const MAX_LEVEL = 4; // Lv.1 at 3.0s, Lv.2 at 4.0s, Lv.3 at 5.0s, Lv.4 at 6.0s
        const MAX_HOLD_MS = 6000;

        let savedHoldMs = 0;
        let holdStartTs = 0;
        let cumulativeHoldMs = 0;
        let unlockedMaxLevel = 0;
        let activeDisplayLevel = 0;
        let isHoldingSymbol = false;
        let holdRafId = null;

        function computeTierFromMs(ms) {
          if (ms < 3000) return 0;
          return Math.min(MAX_LEVEL, 1 + Math.floor((ms - 3000) / 1000));
        }

        function playSymbolFrameUpgradeChime(level) {
          if (window.__jsfAudioMuted || level <= 0) return;
          if (typeof window.__playJsfFoleySfx === 'function') {
            if (level >= 4) {
              window.__playJsfFoleySfx('ensemble_unseal');
            } else {
              window.__playJsfFoleySfx('switch_on', { gain: 0.16, rate: 0.94 + level * 0.04, jitter: 0.01 });
            }
          }
        }

        function applySymbolFrameLevel(level, isNewUnlock) {
          activeDisplayLevel = Math.max(0, Math.min(MAX_LEVEL, level));
          const goboFrame = document.getElementById('gobo-canvas-frame');
          const fxFront = document.getElementById('u22-quest-clear-fx-front');
          const toastFront = document.getElementById('quest-clear-toast-front');

          if (!goboFrame) return;
          goboFrame.setAttribute('data-symbol-frame-level', String(activeDisplayLevel));
          if (unlockedMaxLevel > 0) {
            goboFrame.setAttribute('data-symbol-frame-unlocked', 'true');
          }

          if (isNewUnlock && activeDisplayLevel > 0) {
            goboFrame.classList.remove('frame-level-up-pulse');
            void goboFrame.offsetWidth;
            goboFrame.classList.add('frame-level-up-pulse');
            playSymbolFrameUpgradeChime(activeDisplayLevel);

            if (toastFront) toastFront.style.display = 'none';
            if (fxFront) {
              fxFront.classList.remove('quest-fx-active');
              void fxFront.offsetWidth;
              fxFront.classList.add('quest-fx-active');
            }
          }
        }

        function syncCumulativeHoldClock(nowTs) {
          if (isHoldingSymbol) {
            cumulativeHoldMs = Math.min(MAX_HOLD_MS + 250, savedHoldMs + Math.max(0, nowTs - holdStartTs));
          } else {
            cumulativeHoldMs = savedHoldMs;
          }
          const computedLvl = computeTierFromMs(cumulativeHoldMs);
          if (computedLvl > unlockedMaxLevel) {
            unlockedMaxLevel = computedLvl;
            applySymbolFrameLevel(unlockedMaxLevel, true);
          }
        }

        function tickCumulativeHold(now) {
          if (!isHoldingSymbol) {
            holdRafId = null;
            return;
          }
          const goboFrame = document.getElementById('gobo-canvas-frame');
          if (!goboFrame || !goboFrame.classList.contains('symbol-inspect-mode') || window.__underDevCardActive || !window.__noirCurtainUnveiled) {
            stopCumulativeHold();
            return;
          }
          syncCumulativeHoldClock(now);
          holdRafId = requestAnimationFrame(tickCumulativeHold);
        }

        function startCumulativeHold(e) {
          if (!window.__noirCurtainUnveiled || window.__underDevCardActive) return;
          if (e && typeof e.button === 'number' && e.button !== 0) return;
          if (e && e.target && e.target.closest && e.target.closest('button, a, .noir-preload-curtain, .under-dev-card-overlay')) {
            return;
          }
          const goboFrame = document.getElementById('gobo-canvas-frame');
          if (!goboFrame || !goboFrame.classList.contains('symbol-inspect-mode') || goboFrame.classList.contains('card-flipped-out')) {
            return;
          }

          if (!isHoldingSymbol) {
            isHoldingSymbol = true;
            holdStartTs = performance.now();
          }
          goboFrame.classList.add('symbol-holding-press');
          if (!holdRafId) {
            holdRafId = requestAnimationFrame(tickCumulativeHold);
          }
        }

        function stopCumulativeHold() {
          if (!isHoldingSymbol) return;
          syncCumulativeHoldClock(performance.now());
          savedHoldMs = cumulativeHoldMs;
          isHoldingSymbol = false;
          if (holdRafId) {
            cancelAnimationFrame(holdRafId);
            holdRafId = null;
          }
          const goboFrame = document.getElementById('gobo-canvas-frame');
          if (goboFrame) goboFrame.classList.remove('symbol-holding-press');
        }

        window.__getSymbolFrameUpgradeState = function() {
          return {
            cumulativeHoldMs: Math.round(cumulativeHoldMs),
            unlockedMaxLevel,
            activeDisplayLevel,
            isHoldingSymbol
          };
        };

        function bindSymbolInspectAndHold() {
          const goboFrame = document.getElementById('gobo-canvas-frame');
          if (!goboFrame) return;

          goboFrame.addEventListener('pointerdown', startCumulativeHold, { passive: true });
          window.addEventListener('pointerup', stopCumulativeHold, { passive: true });
          window.addEventListener('pointercancel', stopCumulativeHold, { passive: true });
          window.addEventListener('blur', stopCumulativeHold, { passive: true });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', bindSymbolInspectAndHold);
        } else {
          bindSymbolInspectAndHold();
        }
      })();

      // Bulletproof capture-phase binding for Front Return Flip button & Extended Room BG photo
      (function bindGoboReturnFlipAndRoomReveal() {
        const goboFlipBtn = document.getElementById('btn-gobo-flip-to-salon');
        if (goboFlipBtn) {
          goboFlipBtn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
          }, true);
          goboFlipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.__activateUnderDevCard === 'function') {
              window.__activateUnderDevCard(true);
            }
          }, true);
        }
        const goboFrameEl = document.getElementById('gobo-canvas-frame');
        const bgImg = document.getElementById('window-room-bg-img');
        if (goboFrameEl && bgImg && typeof MutationObserver !== 'undefined') {
          const syncRoomImg = () => {
            if (goboFrameEl.classList.contains('symbol-inspect-mode')) {
              if (!bgImg.src.includes('sean_window_crop_vertical_9_16.jpg')) {
                bgImg.src = '/assets/sean_window_crop_vertical_9_16.jpg';
              }
            }
          };
          syncRoomImg();
          new MutationObserver(syncRoomImg).observe(goboFrameEl, { attributes: true, attributeFilter: ['class'] });
        }
        // Fast-jump (?stage=inspect) for instant alignment inspection
        if (window.location.search.includes('stage=inspect')) {
          const jumpInspect = () => {
            document.documentElement.classList.remove('jsf-qr-gate-first');
            ['jsf-pure-qr-float', 'noir-preload-curtain', 'noir-intro-screen'].forEach((id) => {
              const el = document.getElementById(id);
              if (el) el.style.display = 'none';
            });
            const mainStage = document.getElementById('symbol-stage-3d');
            if (mainStage) { mainStage.style.opacity = '1'; mainStage.style.visibility = 'visible'; }
            window.__noirCurtainUnveiled = true;
            window.__borderPaintCompleted = true;
            const gf = document.getElementById('gobo-canvas-frame');
            const lr = document.getElementById('gobo-light-rig');
            const sr = document.getElementById('gobo-symbol-rig');
            if (gf) {
              gf.classList.remove('card-flipped-out', 'worm-eye-monolith');
              gf.classList.add('frame-illuminated', 'symbol-inspect-mode');
              gf.style.opacity = '1';
              gf.style.visibility = 'visible';
            }
            if (lr) { lr.classList.add('stabilized'); lr.style.opacity = '1'; }
            if (sr) { sr.classList.add('materialized'); sr.style.opacity = '1'; }
            const emblem = document.getElementById('digital-logo-overlay');
            if (emblem) emblem.style.opacity = '1';
            document.body.classList.remove('vip-pass-flipped');
          };
          setTimeout(jumpInspect, 200);
          setTimeout(jumpInspect, 800);
        }
      })();

      // Delegated Leica M tactile micro-click foley for Salon UI pill & icon buttons
      document.addEventListener('click', (e) => {
        const t = e && e.target && e.target.closest
          ? e.target.closest('#btn-under-dev-replay, #btn-gobo-flip-to-salon, #btn-open-ig-vip-modal, #btn-open-salon-msg-panel, #btn-loc-ig-mark, .salon-msg-close-btn, .salon-msg-submit-btn')
          : null;
        if (!t || typeof window.__playJsfFoleySfx !== 'function') return;
        if (t.id === 'btn-open-salon-msg-panel') {
          const z1 = document.getElementById('torch-zone-1');
          if (z1 && z1.getAttribute('data-lamp-lit') !== 'true') return;
        }
        window.__playJsfFoleySfx('shutter', { gain: 0.16, jitter: 0.03 });
      }, true);
    })();
    // === HARRY POTTER LIVING NEWSPAPER & BRASS LAMP ENGINE END ===
