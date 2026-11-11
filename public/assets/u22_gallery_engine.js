// === U22 DIGITAL PHOTOGRAPHIE & SALON ARCHIVE GALLERY ENGINE (DEDICATED HOT-MODULE) ===
(function() {
  const KEEP_STORAGE_KEY = 'JSF_U22_ARCHIVE_KEEP_V1';
  let archiveState = {
    isOpen: false,
    domain: 'PARTY',     // 'PARTY' | 'SOCIAL' | 'BIZ' | 'KEEP' | 'ALL'
    roll: 'ALL',         // 'ALL' | 'P-JAM' | 'P-SPEAKEASY' | 'P-VENUE' | 'S-DUO' | 'S-SEAN' | 'S-KALINA' | 'B-ATELIER'
    quickTag: '',        // '' | 'duo' | 'wine' | 'piano' | 'real' | 'vinyl'
    searchQuery: '',
    viewMode: 'stage',   // 'stage' | 'contact' | 'ig'
    contactCols: 4,      // 4 | 6 | 8
    filtered: [],
    activeIndex: 0,
    zoomed: false,
    autoplayTimer: null,
    keepSet: new Set()
  };

  function loadKeepSet() {
    try {
      const raw = localStorage.getItem(KEEP_STORAGE_KEY);
      if (raw) {
        JSON.parse(raw).forEach((fn) => archiveState.keepSet.add(fn));
      }
    } catch (_) {}
    const cat = window.__U22_GALLERY_CATALOG__;
    if (cat && Array.isArray(cat.photos)) {
      cat.photos.forEach((p) => {
        if (p.keep) archiveState.keepSet.add(p.filename);
      });
    }
  }

  function saveKeepSet() {
    try {
      localStorage.setItem(KEEP_STORAGE_KEY, JSON.stringify(Array.from(archiveState.keepSet)));
    } catch (_) {}
  }

  function playLeicaShutterTick(freq = 432) {
    try {
      if (window.__jsfAudioMuted) return;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window.__u22ShutterAudioCtx) window.__u22ShutterAudioCtx = new Ctx();
      const ctx = window.__u22ShutterAudioCtx;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(144, now + 0.028);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.034);
    } catch (_) {}
  }

  function getCatalogPhotos() {
    const cat = window.__U22_GALLERY_CATALOG__;
    return (cat && Array.isArray(cat.photos)) ? cat.photos : [];
  }

  function updateDomainCounts() {
    const all = getCatalogPhotos();
    const counts = { PARTY: 0, SOCIAL: 0, BIZ: 0, KEEP: 0, ALL: all.length };
    all.forEach((p) => {
      if (counts[p.domain] !== undefined) counts[p.domain]++;
      if (archiveState.keepSet.has(p.filename)) counts.KEEP++;
    });
    const mapIds = {
      PARTY: 'u22-cnt-party',
      SOCIAL: 'u22-cnt-social',
      BIZ: 'u22-cnt-biz',
      KEEP: 'u22-cnt-keep',
      ALL: 'u22-cnt-all'
    };
    Object.keys(mapIds).forEach((k) => {
      const el = document.getElementById(mapIds[k]);
      if (el) el.textContent = String(counts[k]);
    });
  }

  function renderRollChips() {
    const wrap = document.getElementById('u22-roll-chips-wrap');
    if (!wrap) return;
    const cat = window.__U22_GALLERY_CATALOG__;
    const rolls = (cat && Array.isArray(cat.rolls)) ? cat.rolls : [];
    const dom = archiveState.domain;

    const applicable = rolls.filter((r) => {
      if (r.id === 'ALL') return true;
      if (dom === 'ALL' || dom === 'KEEP') return true;
      return r.domain === dom;
    });

    wrap.innerHTML = applicable.map((r) => {
      const isAct = archiveState.roll === r.id ? 'active' : '';
      const label = r.id === 'ALL' ? `전체 (${dom})` : r.label;
      return `<button type="button" class="u22-roll-chip ${isAct}" onclick="window.__setU22GalleryRoll('${r.id}')">${label}</button>`;
    }).join('');
  }

  function applyFilters(preserveFilename) {
    const all = getCatalogPhotos();
    const dom = archiveState.domain;
    const roll = archiveState.roll;
    const qtag = archiveState.quickTag.toLowerCase();
    const q = archiveState.searchQuery.trim().toLowerCase();

    const numMatch = q.match(/^#?(\d{1,3})$/);
    const targetNum = numMatch ? parseInt(numMatch[1], 10) : null;

    let list = all.filter((p) => {
      if (dom === 'KEEP') {
        if (!archiveState.keepSet.has(p.filename)) return false;
      } else if (dom !== 'ALL' && p.domain !== dom) {
        return false;
      }
      if (roll !== 'ALL' && p.roll !== roll) return false;
      if (qtag && !(p.tags || []).some((t) => t.toLowerCase().includes(qtag)) && !p.filename.toLowerCase().includes(qtag)) {
        return false;
      }
      if (q && targetNum === null) {
        const hay = `${p.code} ${p.title} ${p.filename} ${p.rollLabel} ${(p.tags || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (list.length === 0 && all.length > 0) {
      list = all.slice(0, 24);
    }

    archiveState.filtered = list;

    if (targetNum !== null) {
      const byGlobalIdx = list.findIndex((p) => p.index === targetNum);
      if (byGlobalIdx >= 0) {
        archiveState.activeIndex = byGlobalIdx;
      } else if (targetNum >= 1 && targetNum <= list.length) {
        archiveState.activeIndex = targetNum - 1;
      } else {
        archiveState.activeIndex = 0;
      }
    } else if (preserveFilename) {
      const idx = list.findIndex((p) => p.filename === preserveFilename);
      archiveState.activeIndex = idx >= 0 ? idx : 0;
    } else {
      archiveState.activeIndex = 0;
    }
  }

  function renderStageAndFilmstrip() {
    const list = archiveState.filtered;
    if (!list.length) return;
    const idx = Math.max(0, Math.min(archiveState.activeIndex, list.length - 1));
    archiveState.activeIndex = idx;
    const item = list[idx];

    const counterEl = document.getElementById('u22-archive-counter-pill');
    if (counterEl) {
      counterEl.textContent = `${item.code} (${idx + 1} / ${list.length}) · TOTAL ${getCatalogPhotos().length}`;
    }

    const mainImg = document.getElementById('u22-stage-main-img');
    if (mainImg) {
      mainImg.src = item.url;
      mainImg.alt = item.title;
    }
    const figWrap = document.getElementById('u22-stage-figure-wrap');
    if (figWrap) {
      figWrap.classList.remove('zoomed');
      archiveState.zoomed = false;
    }

    const codeEl = document.getElementById('u22-meta-code');
    if (codeEl) codeEl.textContent = item.code;
    const rollEl = document.getElementById('u22-meta-roll');
    if (rollEl) rollEl.textContent = item.rollLabel || item.roll;
    const dateEl = document.getElementById('u22-meta-date');
    if (dateEl) dateEl.textContent = item.date || '2026-10';
    const titleEl = document.getElementById('u22-meta-title');
    if (titleEl) titleEl.textContent = item.title;
    const camEl = document.getElementById('u22-meta-camera');
    if (camEl) camEl.textContent = `📷 ${item.camera || 'Leica Q3 · 28mm Summilux'}`;

    const tagsEl = document.getElementById('u22-meta-tags');
    if (tagsEl) {
      tagsEl.innerHTML = (item.tags || []).slice(0, 6).map((t) => `<span class="meta-tag-pill">#${t}</span>`).join('');
    }

    const isKept = archiveState.keepSet.has(item.filename);
    const keepBtn = document.getElementById('u22-meta-keep-btn');
    if (keepBtn) {
      keepBtn.classList.toggle('active', isKept);
      keepBtn.textContent = isKept ? '⭐ KEPT (보관됨)' : '☆ KEEP 보관함';
    }

    const igImg = document.getElementById('u22-ig-main-img');
    if (igImg) igImg.src = item.url;
    const igCode = document.getElementById('u22-ig-code-pill');
    if (igCode) igCode.textContent = item.code;
    const igCap = document.getElementById('u22-ig-caption-txt');
    if (igCap) igCap.textContent = `${item.title} (${item.rollLabel || item.domain})`;
    const igTags = document.getElementById('u22-ig-hashtags');
    if (igTags) {
      igTags.textContent = (item.tags || ['u22', 'frankfurt', 'salon']).map((t) => `#${t}`).join(' ') + ' #justseanflows';
    }

    const track = document.getElementById('u22-filmstrip-track');
    if (track) {
      const thumbs = track.querySelectorAll('.u22-film-thumb');
      thumbs.forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
      });
      const activeThumb = track.querySelector(`.u22-film-thumb[data-idx="${idx}"]`);
      if (activeThumb && typeof activeThumb.scrollIntoView === 'function') {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  function rebuildFilmstripAndContactGrid() {
    const list = archiveState.filtered;
    const track = document.getElementById('u22-filmstrip-track');
    if (track) {
      track.innerHTML = list.map((p, i) => `
        <button type="button" class="u22-film-thumb ${i === archiveState.activeIndex ? 'active' : ''}" data-idx="${i}" onclick="window.__selectU22GalleryIndex(${i})" title="${p.code} · ${p.title}">
          <img src="${p.url}" alt="${p.code}" loading="lazy" />
          <span class="film-code">${p.code}</span>
        </button>
      `).join('');
    }

    const grid = document.getElementById('u22-contact-grid');
    if (grid) {
      grid.innerHTML = list.map((p, i) => {
        const isKeep = archiveState.keepSet.has(p.filename);
        const isAct = i === archiveState.activeIndex ? 'active-focus' : '';
        return `
          <div class="u22-contact-card ${isAct}" id="u22-contact-card-${i}" data-idx="${i}" onclick="window.__openU22FromContactSheet(${i})">
            <div class="u22-contact-strip-top">
              <span>${p.code} &middot; ${p.domain}</span>
              <span>${isKeep ? '⭐' : '35MM'}</span>
            </div>
            <div class="u22-contact-thumb-box">
              <img src="${p.url}" alt="${p.title}" loading="lazy" />
            </div>
            <div class="u22-contact-caption" title="${p.title}">${p.title}</div>
          </div>
        `;
      }).join('');
    }
  }

  function syncTabsAndButtonsUI() {
    document.querySelectorAll('.u22-domain-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-domain') === archiveState.domain);
    });
    document.querySelectorAll('.u22-view-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === archiveState.viewMode);
    });
    document.querySelectorAll('.u22-qtag-chip').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-qtag') === archiveState.quickTag);
    });
    document.querySelectorAll('.u22-density-btn').forEach((btn) => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-cols'), 10) === archiveState.contactCols);
    });

    const shell = document.getElementById('u22-photo-archive-shell');
    if (shell) {
      shell.setAttribute('data-view-mode', archiveState.viewMode);
      shell.setAttribute('data-grid-cols', String(archiveState.contactCols));
    }

    const stagePane = document.getElementById('u22-stage-view-pane');
    const contactPane = document.getElementById('u22-contact-sheet-pane');
    const igPane = document.getElementById('u22-ig-mockup-pane');

    if (stagePane) stagePane.style.display = archiveState.viewMode === 'stage' ? 'flex' : 'none';
    if (contactPane) contactPane.style.display = archiveState.viewMode === 'contact' ? 'block' : 'none';
    if (igPane) igPane.style.display = archiveState.viewMode === 'ig' ? 'flex' : 'none';

    if (archiveState.viewMode === 'contact') {
      const cards = document.querySelectorAll('.u22-contact-card');
      cards.forEach((c, idx) => c.classList.toggle('active-focus', idx === archiveState.activeIndex));
      const focusEl = document.getElementById(`u22-contact-card-${archiveState.activeIndex}`);
      if (focusEl && typeof focusEl.scrollIntoView === 'function') {
        setTimeout(() => focusEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
      }
    }
  }

  window.__openU22PhotoGallery = function(initialDomain = 'PARTY', initialView = 'stage') {
    loadKeepSet();
    updateDomainCounts();
    archiveState.isOpen = true;
    archiveState.domain = initialDomain || 'PARTY';
    archiveState.roll = 'ALL';
    archiveState.quickTag = '';
    archiveState.searchQuery = '';
    archiveState.viewMode = initialView || 'stage';

    const sInput = document.getElementById('u22-archive-search-input');
    if (sInput) sInput.value = '';
    const sClear = document.getElementById('u22-search-clear');
    if (sClear) sClear.style.display = 'none';

    renderRollChips();
    applyFilters();
    rebuildFilmstripAndContactGrid();
    renderStageAndFilmstrip();
    syncTabsAndButtonsUI();

    const modal = document.getElementById('u22-photo-archive-modal');
    if (modal) {
      modal.classList.add('open');
    }
    playLeicaShutterTick(528);
  };

  window.__closeU22PhotoGallery = function() {
    archiveState.isOpen = false;
    if (archiveState.autoplayTimer) {
      clearInterval(archiveState.autoplayTimer);
      archiveState.autoplayTimer = null;
      const abtn = document.getElementById('u22-autoplay-btn');
      if (abtn) {
        abtn.classList.remove('playing');
        abtn.textContent = '▶ AUTO';
      }
    }
    const modal = document.getElementById('u22-photo-archive-modal');
    if (modal) modal.classList.remove('open');
  };

  window.__setU22GalleryDomain = function(domain) {
    archiveState.domain = domain;
    archiveState.roll = 'ALL';
    renderRollChips();
    applyFilters();
    rebuildFilmstripAndContactGrid();
    renderStageAndFilmstrip();
    syncTabsAndButtonsUI();
    playLeicaShutterTick(432);
  };

  window.__setU22GalleryRoll = function(rollId) {
    archiveState.roll = rollId;
    renderRollChips();
    applyFilters();
    rebuildFilmstripAndContactGrid();
    renderStageAndFilmstrip();
    syncTabsAndButtonsUI();
    playLeicaShutterTick(480);
  };

  window.__toggleU22QuickTag = function(tag) {
    archiveState.quickTag = (archiveState.quickTag === tag) ? '' : tag;
    applyFilters();
    rebuildFilmstripAndContactGrid();
    renderStageAndFilmstrip();
    syncTabsAndButtonsUI();
    playLeicaShutterTick(460);
  };

  window.__onU22GallerySearchInput = function(val) {
    archiveState.searchQuery = val || '';
    const sClear = document.getElementById('u22-search-clear');
    if (sClear) sClear.style.display = archiveState.searchQuery ? 'inline-block' : 'none';
    applyFilters();
    rebuildFilmstripAndContactGrid();
    renderStageAndFilmstrip();
    syncTabsAndButtonsUI();
  };

  window.__clearU22GallerySearch = function() {
    const sInput = document.getElementById('u22-archive-search-input');
    if (sInput) sInput.value = '';
    window.__onU22GallerySearchInput('');
  };

  window.__setU22GalleryViewMode = function(mode) {
    archiveState.viewMode = mode;
    syncTabsAndButtonsUI();
    playLeicaShutterTick(512);
  };

  window.__setU22ContactCols = function(cols) {
    archiveState.contactCols = cols;
    if (archiveState.viewMode !== 'contact') {
      archiveState.viewMode = 'contact';
    }
    syncTabsAndButtonsUI();
    playLeicaShutterTick(440);
  };

  window.__selectU22GalleryIndex = function(idx) {
    archiveState.activeIndex = idx;
    renderStageAndFilmstrip();
    playLeicaShutterTick(432);
  };

  window.__openU22FromContactSheet = function(idx) {
    archiveState.activeIndex = idx;
    archiveState.viewMode = 'stage';
    renderStageAndFilmstrip();
    syncTabsAndButtonsUI();
    playLeicaShutterTick(540);
  };

  window.__stepU22GalleryPhoto = function(delta) {
    const list = archiveState.filtered;
    if (!list.length) return;
    archiveState.activeIndex = (archiveState.activeIndex + delta + list.length) % list.length;
    renderStageAndFilmstrip();
    if (archiveState.viewMode === 'contact') syncTabsAndButtonsUI();
    playLeicaShutterTick(432);
  };

  window.__toggleU22CurrentPhotoKeep = function() {
    const item = archiveState.filtered[archiveState.activeIndex];
    if (!item) return;
    if (archiveState.keepSet.has(item.filename)) {
      archiveState.keepSet.delete(item.filename);
    } else {
      archiveState.keepSet.add(item.filename);
    }
    saveKeepSet();
    updateDomainCounts();
    renderStageAndFilmstrip();
    playLeicaShutterTick(648);
  };

  window.__toggleU22StageLoupeZoom = function(evt) {
    const figWrap = document.getElementById('u22-stage-figure-wrap');
    const mainImg = document.getElementById('u22-stage-main-img');
    if (!figWrap || !mainImg) return;
    archiveState.zoomed = !archiveState.zoomed;
    figWrap.classList.toggle('zoomed', archiveState.zoomed);
    if (archiveState.zoomed && evt) {
      window.__onU22StageLoupeMove(evt);
    } else {
      mainImg.style.transformOrigin = '50% 50%';
    }
  };

  window.__onU22StageLoupeMove = function(evt) {
    if (!archiveState.zoomed) return;
    const figWrap = document.getElementById('u22-stage-figure-wrap');
    const mainImg = document.getElementById('u22-stage-main-img');
    if (!figWrap || !mainImg) return;
    const rect = figWrap.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((evt.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((evt.clientY - rect.top) / rect.height) * 100));
    mainImg.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
  };

  window.__toggleU22GalleryAutoplay = function() {
    const btn = document.getElementById('u22-autoplay-btn');
    if (archiveState.autoplayTimer) {
      clearInterval(archiveState.autoplayTimer);
      archiveState.autoplayTimer = null;
      if (btn) {
        btn.classList.remove('playing');
        btn.textContent = '▶ AUTO';
      }
    } else {
      archiveState.autoplayTimer = setInterval(() => {
        window.__stepU22GalleryPhoto(1);
      }, 3200);
      if (btn) {
        btn.classList.add('playing');
        btn.textContent = '⏸ PLAYING';
      }
    }
  };

  // Route second click on lit Party (0), Social (1), Biz (2) cards directly to U22 Photo Archive!
  const domainMap = { 0: 'PARTY', 1: 'SOCIAL', 2: 'BIZ' };
  window.__openSalonConceptDrawer = function(idx) {
    const dom = domainMap[idx] || 'PARTY';
    window.__toggleHarryPotterLamp(idx, true);
    window.__openU22PhotoGallery(dom, 'stage');
  };

  window.addEventListener('keydown', (e) => {
    if (!archiveState.isOpen) return;
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea') {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      window.__closeU22PhotoGallery();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      window.__stepU22GalleryPhoto(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      window.__stepU22GalleryPhoto(-1);
    } else if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      window.__setU22GalleryViewMode(archiveState.viewMode === 'contact' ? 'stage' : 'contact');
    } else if (e.key === 'i' || e.key === 'I') {
      e.preventDefault();
      window.__setU22GalleryViewMode(archiveState.viewMode === 'ig' ? 'stage' : 'ig');
    } else if (e.key === ' ') {
      e.preventDefault();
      window.__toggleU22GalleryAutoplay();
    }
  });
})();
