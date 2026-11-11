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

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncVipUiState);
      } else {
        syncVipUiState();
      }
    })();

    // === HARRY POTTER LIVING NEWSPAPER & BRASS LAMP ENGINE START ===
    (function() {
      const litLamps = { map: false, 0: false, 1: false, 2: false };
      const everDiscoveredLamps = { map: false, 0: false, 1: false, 2: false };
      let salon4of4QuestCleared = false;
      window.__salon4of4QuestCleared = false;

      function playQuestClearHarmonicChime() {
        try {
          if (window.__jsfAudioMuted) return;
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window.__hpLampAudioCtx) {
            window.__hpLampAudioCtx = new AudioCtx();
          }
          const ctx = window.__hpLampAudioCtx;
          if (ctx.state === 'suspended') ctx.resume().catch(() => {});
          if (ctx.state !== 'running') return;

          const now = ctx.currentTime + 0.01;
          // 432Hz Verdi A-Major Golden Triad Arpeggio (A4 432Hz -> C#5 544.29Hz -> E5 647.27Hz -> A5 864Hz)
          const freqs = [432.0, 544.29, 647.27, 864.0];
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = idx === 3 ? 'triangle' : 'sine';
            const t0 = now + idx * 0.075;
            osc.frequency.setValueAtTime(f, t0);
            gain.gain.setValueAtTime(0.0001, t0);
            gain.gain.exponentialRampToValueAtTime(0.032, t0 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.98);
          });
        } catch (_) {}
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

      // 5-Bounce Elastic Analog Tungsten Voltage-Sag Profile (p: 0.0 -> 1.0)
      // Blink troughs (0.08, 0.36, 0.63, 0.77, 0.86) act as physical cinema shutters for Location's
      // word-by-word dying filament whisper ("ASK" -> "ME" -> "For the details . . ." -> "Location")!
      const TUNGSTEN_FLICKER_BOUNCES = [
        { s: 0.03, e: 0.15, depth: 0.68 }, // Blink 1 (trough ~0.08): crisp sag -> "ASK"
        { s: 0.31, e: 0.43, depth: 0.74 }, // Blink 2 (trough ~0.36): deeper tug -> "ME"
        { s: 0.58, e: 0.69, depth: 0.78 }, // Blink 3 (trough ~0.63): shutter -> "For the details ."
        { s: 0.73, e: 0.81, depth: 0.70 }, // Blink 4A (trough ~0.77): double-stutter 1st hit -> ". ."
        { s: 0.82, e: 0.91, depth: 0.86 }  // Blink 4B (trough ~0.86): double-stutter 2nd hit -> ". . ."
      ];

      let lastLocWhisperSig = 'location:0';
      const LOCATION_WHISPER_PRESETS = {
        location: { text: 'Location',        size: '76', spacing: '2',   yMain: '176', yExt: '180.5', strokeW: '2.6', maskStrokeW: '3.5' },
        ask:      { text: 'ASK',             size: '88', spacing: '6',   yMain: '176', yExt: '180.5', strokeW: '2.8', maskStrokeW: '3.8' },
        me:       { text: 'ME',              size: '92', spacing: '6',   yMain: '176', yExt: '180.5', strokeW: '2.8', maskStrokeW: '3.8' },
        details:  { text: 'For the details', size: '45', spacing: '1.2', yMain: '160', yExt: '164',   strokeW: '2.2', maskStrokeW: '2.8' }
      };

      function setLocationKnockoutPhrase(stageKey, dotsCount = 0) {
        const preset = LOCATION_WHISPER_PRESETS[stageKey] || LOCATION_WHISPER_PRESETS.location;
        const sig = `${stageKey}:${dotsCount}`;
        if (sig === lastLocWhisperSig) return;
        lastLocWhisperSig = sig;

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
          extMain.setAttribute('y', preset.yExt);
          extMain.setAttribute('stroke-width', preset.maskStrokeW);
        }
        if (rimMain) {
          rimMain.setAttribute('y', preset.yMain);
          rimMain.setAttribute('stroke-width', preset.strokeW);
        }

        const maskDotsGroup = document.getElementById('hp-loc-mask-dots');
        const rimDotsGroup = document.getElementById('hp-loc-rim-dots');
        const showDots = dotsCount > 0 ? '1' : '0';
        if (maskDotsGroup) maskDotsGroup.setAttribute('opacity', showDots);
        if (rimDotsGroup) rimDotsGroup.setAttribute('opacity', showDots);

        for (let i = 1; i <= 3; i++) {
          const on = i <= dotsCount ? '1' : '0';
          const md = document.getElementById(`hp-loc-mask-dot-${i}`);
          const rd = document.getElementById(`hp-loc-rim-dot-${i}`);
          if (md) md.setAttribute('opacity', on);
          if (rd) rd.setAttribute('opacity', on);
        }
      }

      function computeDyingFilamentState(p) {
        // Carrier stays warm & bright (1.0 -> 0.78) through p=0.91 so every blink visibly & audibly bounces,
        // then collapses rapidly over the final 0.91..1.00 tail right into auto-off!
        let carrier = p < 0.91
          ? (1.0 - (p / 0.91) * 0.20)
          : Math.max(0.04, 0.80 * Math.pow(1.0 - (p - 0.91) / 0.09, 1.65));

        let dip = 0.0;
        let bounceIdx = -1;
        for (let i = 0; i < TUNGSTEN_FLICKER_BOUNCES.length; i++) {
          const b = TUNGSTEN_FLICKER_BOUNCES[i];
          if (p >= b.s && p <= b.e) {
            const u = (p - b.s) / (b.e - b.s);
            // Skewed impulse (fast voltage drop, elastic spring rebound)
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
          nGain.gain.setValueAtTime(0.011 * strength, now);
          nGain.gain.exponentialRampToValueAtTime(0.0002, now + dur);
          nSrc.connect(bp);
          bp.connect(nGain);
          nGain.connect(ctx.destination);
          nSrc.start(now);
          nSrc.stop(now + dur + 0.005);

          const hum = ctx.createOscillator();
          const hGain = ctx.createGain();
          hum.type = 'triangle';
          hum.frequency.setValueAtTime(108, now);
          hum.frequency.exponentialRampToValueAtTime(58, now + 0.065);
          hGain.gain.setValueAtTime(0.014 * strength, now);
          hGain.gain.exponentialRampToValueAtTime(0.0002, now + 0.065);
          hum.connect(hGain);
          hGain.connect(ctx.destination);
          hum.start(now);
          hum.stop(now + 0.07);
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
          // Warm 2200K tungsten map glow shining INSIDE the hollow knockout letters ("ASK" -> "ME" -> "For the details . . .")
          const b = (0.28 + 0.96 * power).toFixed(3);
          const s = (0.75 + 0.65 * power).toFixed(3);
          const sep = (0.42 * (1.0 - power * 0.45)).toFixed(3);
          mediaEls.forEach((m) => {
            m.style.setProperty('filter', `brightness(${b}) sepia(${sep}) saturate(${s}) contrast(1.04)`, 'important');
          });

          // Swap words strictly inside the dark voltage troughs so each blink unveils the next word!
          if (p < 0.36) {
            setLocationKnockoutPhrase('ask', 0);
          } else if (p < 0.63) {
            setLocationKnockoutPhrase('me', 0);
          } else if (p < 0.968) {
            const dots = p < 0.76 ? 1 : (p < 0.85 ? 2 : 3);
            setLocationKnockoutPhrase('details', dots);
          } else {
            // Final extinction shutter right before lamp clicks OFF -> seamlessly lands back on "Location"
            setLocationKnockoutPhrase('location', 0);
          }

          if (cover) {
            const rampIn = Math.min(1.0, p / 0.055);
            const coverAlpha = Math.max(0, Math.min(0.985, rampIn * (0.86 + 0.125 * (1.0 - power))));
            cover.style.setProperty('visibility', 'visible', 'important');
            cover.style.setProperty('opacity', coverAlpha.toFixed(3), 'important');
            cover.style.setProperty('transform', 'scale(1.0)', 'important');
          }

          const glyphLayer = document.getElementById('hp-loc-glyph-layer');
          if (glyphLayer) {
            const glyphAlpha = p >= 0.968
              ? Math.max(0.18, (1.0 - p) / 0.032)
              : (0.34 + 0.66 * power);
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

      function scheduleLampAutoOffTimer(target) {
        const key = target === 'map' ? 'map' : Number(target);
        clearLampAutoOffTimer(key);
        if (key === 'map' && window.__holdLocationLampForMessage) {
          return;
        }

        const el = getZoneElement(key);
        if (!el) return;

        // Give Location a 3.65s dying filament window (5.20s -> 8.85s) so "ASK" -> "ME" -> "For the details . . ." -> "Location" lands with cinema pacing
        const defaultWarn = key === 'map' ? 5200 : (Number(window.__HP_LAMP_DYING_START_MS) || 5500);
        const defaultOff  = key === 'map' ? 8850 : (Number(window.__HP_LAMP_AUTO_OFF_MS) || 8200);
        const warnMs = Math.max(500, defaultWarn);
        const offMs = Math.max(warnMs + 400, defaultOff);
        const dyingDuration = Math.max(400, offMs - warnMs);

        lampTimers[key].warn = setTimeout(() => {
          const zoneEl = getZoneElement(key);
          if (zoneEl && zoneEl.getAttribute('data-lamp-lit') === 'true') {
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
              const fState = computeDyingFilamentState(p);
              if (lampDyingState[key]) {
                lampDyingState[key].dying = true;
                lampDyingState[key].power = fState.power;
                lampDyingState[key].dip = fState.dip;
                if (fState.bounceIdx >= 0 && fState.bounceIdx !== lampDyingState[key].lastBounceIdx) {
                  lampDyingState[key].lastBounceIdx = fState.bounceIdx;
                  playFilamentBounceCrackle(0.55 + fState.dip * 0.45);
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
          if (zoneEl && zoneEl.getAttribute('data-lamp-lit') === 'true') {
            window.__toggleHarryPotterLamp(key, false);
          }
        }, offMs);
      }

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
        try {
          if (window.__jsfAudioMuted) return;
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window.__hpLampAudioCtx) {
            window.__hpLampAudioCtx = new AudioCtx();
          }
          const ctx = window.__hpLampAudioCtx;
          if (ctx.state === 'suspended') return;

          const now = ctx.currentTime;
          // Subtle warm tungsten voltage sag hum
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);
          gain.gain.setValueAtTime(0.018, now);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.36);
        } catch (_) {}
      }

      function playBrassSwitchClickSound(isTurningOn) {
        try {
          if (window.__jsfAudioMuted) return;
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window.__hpLampAudioCtx) {
            window.__hpLampAudioCtx = new AudioCtx();
          }
          const ctx = window.__hpLampAudioCtx;
          if (ctx.state === 'suspended') ctx.resume();

          const now = ctx.currentTime;
          // 1. Crisp mechanical brass rotary click
          const oscClick = ctx.createOscillator();
          const gainClick = ctx.createGain();
          oscClick.type = 'triangle';
          oscClick.frequency.setValueAtTime(isTurningOn ? 1480 : 980, now);
          oscClick.frequency.exponentialRampToValueAtTime(220, now + 0.028);
          gainClick.gain.setValueAtTime(0.09, now);
          gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
          oscClick.connect(gainClick);
          gainClick.connect(ctx.destination);
          oscClick.start(now);
          oscClick.stop(now + 0.03);

          // 2. Warm 2200K tungsten filament ignition hum/swell when turned ON
          if (isTurningOn) {
            const oscHum = ctx.createOscillator();
            const gainHum = ctx.createGain();
            oscHum.type = 'sine';
            oscHum.frequency.setValueAtTime(110.0, now + 0.02);
            oscHum.frequency.exponentialRampToValueAtTime(440.0, now + 0.24);
            gainHum.gain.setValueAtTime(0.001, now + 0.02);
            gainHum.gain.linearRampToValueAtTime(0.045, now + 0.09);
            gainHum.gain.exponentialRampToValueAtTime(0.0008, now + 0.32);
            oscHum.connect(gainHum);
            gainHum.connect(ctx.destination);
            oscHum.start(now + 0.02);
            oscHum.stop(now + 0.34);
          }
        } catch (err) {}
      }

      let lastQuestLevel = 0;

      function playFrameLevelUpStepChime(level) {
        try {
          if (window.__jsfAudioMuted || level <= 0 || level >= 4) return;
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window.__hpLampAudioCtx) {
            window.__hpLampAudioCtx = new AudioCtx();
          }
          const ctx = window.__hpLampAudioCtx;
          if (ctx.state === 'suspended') ctx.resume().catch(() => {});
          if (ctx.state !== 'running') return;

          const now = ctx.currentTime + 0.02;
          // Progressive 440Hz Neo-Soul / Golden Harmonic step notes (Level 1: A4 440Hz, Level 2: C#5 554.37Hz, Level 3: E5 659.25Hz)
          const stepFreqs = [440.0, 554.37, 659.25];
          const baseFreq = stepFreqs[Math.min(2, level - 1)] || 440.0;
          [baseFreq, baseFreq * 1.5].forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = idx === 0 ? 'sine' : 'triangle';
            const t0 = now + idx * 0.055;
            osc.frequency.setValueAtTime(f, t0);
            gain.gain.setValueAtTime(0.0001, t0);
            gain.gain.exponentialRampToValueAtTime(idx === 0 ? 0.024 : 0.014, t0 + 0.035);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.58);
          });
        } catch (_) {}
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

          // If user clicks the lamp while it is dying/flickering (4.5s~7.0s) without explicit forceState=false,
          // rescue & reset the 7-second timer to full brightness!
          if (typeof forceState !== 'boolean' && isCurrentlyLit && isCurrentlyDying) {
            scheduleLampAutoOffTimer('map');
            playBrassSwitchClickSound(true);
            pulseLocationConciergeBar();
            if (typeof window.__startAlibiFromLocationLamp === 'function') {
              window.__startAlibiFromLocationLamp();
            }
            syncAlibiToActiveLamps();
            return;
          }

          const next = typeof forceState === 'boolean' ? forceState : !isCurrentlyLit;
          clearLampAutoOffTimer('map');
          z1.setAttribute('data-lamp-lit', next ? 'true' : 'false');
          z1.setAttribute('data-zone-state', next ? 'lit' : 'unlit');
          litLamps.map = next;
          playBrassSwitchClickSound(next);
          if (next) {
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
          const isCurrentlyDying = cell.getAttribute('data-lamp-dying') === 'true';

          if (typeof forceState !== 'boolean' && isCurrentlyLit && isCurrentlyDying) {
            scheduleLampAutoOffTimer(idx);
            playBrassSwitchClickSound(true);
            syncAlibiToActiveLamps();
            return;
          }

          const next = typeof forceState === 'boolean' ? forceState : !isCurrentlyLit;
          clearLampAutoOffTimer(idx);
          cell.setAttribute('data-lamp-lit', next ? 'true' : 'false');
          litLamps[idx] = next;
          playBrassSwitchClickSound(next);

          if (vid) {
            if (next) {
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
          // Clicking while flickering/dying rescues the lamp back to full 7s brightness!
          window.__resetHarryPotterLampTimer(idx);
          playBrassSwitchClickSound(true);
        } else if (typeof window.__openSalonConceptDrawer === 'function') {
          // Clicking an already-lit living portrait opens the full preview drawer & extends timer
          window.__resetHarryPotterLampTimer(idx);
          window.__openSalonConceptDrawer(idx);
        }
      };

      // Motion sensor extension on Map Box: interacting with the map resets its 7s auto-off timer!
      function bindMapSensorExtension() {
        const mapZone = document.getElementById('torch-zone-1');
        if (!mapZone) return;
        ['pointerdown', 'wheel', 'touchstart'].forEach((evt) => {
          mapZone.addEventListener(evt, () => {
            if (mapZone.getAttribute('data-lamp-lit') === 'true') {
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
        const z1 = document.getElementById('torch-zone-1');
        if (z1 && z1.getAttribute('data-lamp-lit') !== 'true') {
          window.__toggleHarryPotterLamp('map', true);
        }
        if (z1) z1.classList.add('loc-msg-open');
        window.__holdLocationLampForMessage = true;
        clearLampAutoOffTimer('map');

        const panel = document.getElementById('salon-location-msg-panel');
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
            fbEl.textContent = '⚠ 연락처(인스타 ID) 또는 메시지를 입력해주세요.';
          }
          if (contactEl) contactEl.focus();
          return false;
        }

        if (btnEl) btnEl.disabled = true;
        if (fbEl) {
          fbEl.style.color = '#fde047';
          fbEl.textContent = '⏳ 서버에 메시지 저장 중...';
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
              fbEl.textContent = `✓ 서버 저장 완료 (${data.entry ? data.entry.id : 'OK'})! 확인 후 연락드리겠습니다.`;
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
            fbEl.textContent = '✓ 메시지 접수 완료! 빠른 확인을 위해 @just.sean.flows DM도 열려 있습니다.';
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
            depthText.setAttribute('x', '232.50');
            depthText.setAttribute('y', '180.50');
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
            depthText.setAttribute('x', (232.5 - curX * 3.2).toFixed(2));
            depthText.setAttribute('y', (180.5 - curY * 2.8).toFixed(2));
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
          try {
            if (window.__jsfAudioMuted || level <= 0) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!window.__hpLampAudioCtx) {
              window.__hpLampAudioCtx = new AudioCtx();
            }
            const ctx = window.__hpLampAudioCtx;
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            if (ctx.state !== 'running') return;

            const now = ctx.currentTime + 0.015;
            // Ascending Verdi 432Hz harmonic ladder (A3=216 -> C#4=272.14 -> E4=323.63 -> A4=432)
            const roots = [216.0, 272.14, 323.63, 432.0];
            const root = roots[Math.min(roots.length - 1, level - 1)] || 432.0;
            const intervals = level >= 4 ? [1.0, 1.25, 1.5, 2.0] : [1.0, 1.5];

            intervals.forEach((mult, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = idx === 0 ? 'sine' : 'triangle';
              const t0 = now + idx * 0.048;
              osc.frequency.setValueAtTime(root * mult, t0);
              gain.gain.setValueAtTime(0.0001, t0);
              gain.gain.exponentialRampToValueAtTime(idx === 0 ? 0.032 : 0.018, t0 + 0.03);
              gain.gain.exponentialRampToValueAtTime(0.0001, t0 + (level >= 4 ? 0.85 : 0.55));
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(t0);
              osc.stop(t0 + (level >= 4 ? 0.9 : 0.6));
            });
          } catch (_) {}
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
    })();
    // === HARRY POTTER LIVING NEWSPAPER & BRASS LAMP ENGINE END ===
