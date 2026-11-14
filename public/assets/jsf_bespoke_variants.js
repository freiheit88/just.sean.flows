/**
 * [JSF BESPOKE VARIANTS] Live 3-Concept Switcher (Hairline / Score Clef / Brass Signet)
 * Replaces pixel dot-art & boxy QR switcher with JSF Maison + Horology + Musical Engraving.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'jsf_bespoke_variant_v1';

  const QR_LABELS = {
    1: { salon: 'WEB SALON', ig: 'INSTAGRAM', dl: '↓' },
    2: { salon: '♩ SALON', ig: '𝄞 INSTA', dl: '𝄋' },
    3: { salon: '✦ SALON', ig: '◎ INSTA', dl: '⬇' },
  };

  // Bespoke 0.9px hairline & musical engraving SVGs (Zero pixel dot-art)
  const LOC_SVGS = {
    1: {
      ig: '<svg class="loc-bespoke-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="0.7" fill="currentColor" stroke="none"/></svg>',
      msg: '<svg class="loc-bespoke-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5L12 13l8.5-6.5"/><circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none"/></svg>',
    },
    2: {
      ig: '<svg class="loc-bespoke-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 9.2V5.6l2-.6" stroke-width="1.15"/><circle cx="15.9" cy="9.4" r="1.1" fill="currentColor" stroke="none"/></svg>',
      msg: '<svg class="loc-bespoke-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6.5h18v11H3z"/><path d="M3 7l9 6.2L21 7"/><path d="M12 15.8v-3.2l2.1-.6" stroke-width="1.1"/><circle cx="11.2" cy="16" r="1" fill="currentColor" stroke="none"/></svg>',
    },
    3: {
      ig: '<svg class="loc-bespoke-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2" fill="rgba(243,212,137,0.16)"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
      msg: '<svg class="loc-bespoke-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.2" fill="rgba(243,212,137,0.12)"/><path d="M3 6.5l9 6.5 9-6.5"/></svg>',
    },
  };

  function applyBespokeVariant(idx) {
    const v = [1, 2, 3].includes(Number(idx)) ? Number(idx) : 1;
    document.documentElement.setAttribute('data-jsf-bespoke', String(v));
    try { localStorage.setItem(STORAGE_KEY, String(v)); } catch (_) {}

    // Update QR top switcher labels
    const qrSw = document.getElementById('jsf-qr-mode-switcher');
    if (qrSw) {
      const salonBtn = qrSw.querySelector('[data-qr-mode="salon"]');
      const igBtn = qrSw.querySelector('[data-qr-mode="instagram"]');
      const dlBtn = qrSw.querySelector('.jsf-qr-dl-btn');
      if (salonBtn) salonBtn.textContent = QR_LABELS[v].salon;
      if (igBtn) igBtn.textContent = QR_LABELS[v].ig;
      if (dlBtn) dlBtn.textContent = QR_LABELS[v].dl;
    }

    // Update Location icons (replacing pixel dot-art SVGs)
    const igMark = document.getElementById('btn-loc-ig-mark');
    const msgMark = document.getElementById('btn-open-salon-msg-panel');
    if (igMark) igMark.innerHTML = LOC_SVGS[v].ig;
    if (msgMark) msgMark.innerHTML = LOC_SVGS[v].msg;

    // Update preview dock active state
    document.querySelectorAll('.jsf-bv-btn').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.variant) === v);
    });
  }

  function mountPreviewDock() {
    if (document.getElementById('jsf-bespoke-preview-dock')) return;
    const dock = document.createElement('div');
    dock.id = 'jsf-bespoke-preview-dock';
    dock.innerHTML =
      '<button type="button" class="jsf-bv-btn" data-variant="1">1·ENGRAVE</button>' +
      '<button type="button" class="jsf-bv-btn" data-variant="2">2·CLEF</button>' +
      '<button type="button" class="jsf-bv-btn" data-variant="3">3·SIGNET</button>';
    dock.addEventListener('click', (e) => {
      const btn = e.target.closest('.jsf-bv-btn');
      if (btn) {
        e.stopPropagation();
        applyBespokeVariant(Number(btn.dataset.variant));
      }
    });
    document.body.appendChild(dock);
  }

  function init() {
    let saved = 1;
    try { saved = Number(localStorage.getItem(STORAGE_KEY)) || 1; } catch (_) {}
    mountPreviewDock();
    applyBespokeVariant(saved);
    // Re-apply once jsf_qr_gate mounts #jsf-qr-mode-switcher asynchronously
    setTimeout(() => applyBespokeVariant(Number(document.documentElement.getAttribute('data-jsf-bespoke')) || saved), 350);
  }

  window.__setJsfBespokeVariant = applyBespokeVariant;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
