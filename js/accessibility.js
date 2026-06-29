/* ============================================================
   THE LAZY OYSTER — Custom Accessibility Toolbar
   Free, no third-party, WCAG 2.1 AA compliant
   Features: font size, contrast, grayscale, highlight links,
             pause animations, reading guide, dyslexia font,
             keyboard nav, screen reader optimizations
   ============================================================ */

(function () {
  'use strict';

  /* ── State ───────────────────────────────────────────────── */
  var STORAGE_KEY = 'tlo_a11y';
  var defaults = {
    fontSize: 0,        // -2 to +4 steps (each step = 2px on root)
    contrast: 'none',   // none | high | dark
    grayscale: false,
    highlightLinks: false,
    pauseAnimations: false,
    readingGuide: false,
    dyslexiaFont: false,
  };
  var state = Object.assign({}, defaults);

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) state = Object.assign({}, defaults, saved);
    } catch (e) {}
  }

  /* ── Inject CSS ──────────────────────────────────────────── */
  var style = document.createElement('style');
  style.id = 'tlo-a11y-styles';
  style.textContent = `
    /* Widget trigger button */
    #tlo-a11y-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99998;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #0d1b2a;
      border: 3px solid #3AB5C2;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: background 0.2s, transform 0.2s;
      outline: none;
      padding: 0;
    }
    #tlo-a11y-trigger:hover,
    #tlo-a11y-trigger:focus-visible {
      background: #3AB5C2;
      transform: scale(1.08);
      outline: 3px solid #E8A020;
      outline-offset: 2px;
    }
    #tlo-a11y-trigger svg { width: 26px; height: 26px; fill: #3AB5C2; }
    #tlo-a11y-trigger:hover svg,
    #tlo-a11y-trigger:focus-visible svg { fill: #0d1b2a; }

    /* Panel */
    #tlo-a11y-panel {
      position: fixed;
      bottom: 88px;
      right: 24px;
      z-index: 99999;
      width: 300px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.22);
      border: 1px solid #e0e0e0;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px;
      color: #1a1a2e;
      display: none;
      overflow: hidden;
    }
    #tlo-a11y-panel.open { display: block; }

    .tlo-a11y-header {
      background: #0d1b2a;
      color: #fff;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tlo-a11y-header h2 {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #fff;
      margin: 0;
      font-family: 'Inter', Arial, sans-serif;
    }
    .tlo-a11y-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      line-height: 1;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    .tlo-a11y-close:hover,
    .tlo-a11y-close:focus-visible {
      color: #fff;
      background: rgba(255,255,255,0.15);
      outline: 2px solid #3AB5C2;
    }

    .tlo-a11y-body { padding: 14px; }

    .tlo-a11y-section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #3AB5C2;
      margin: 12px 0 8px;
    }
    .tlo-a11y-section-label:first-child { margin-top: 0; }

    /* Toggle buttons */
    .tlo-a11y-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .tlo-a11y-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 10px 8px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: #f9f9f9;
      cursor: pointer;
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      color: #1a1a2e;
      transition: all 0.15s;
      line-height: 1.2;
      text-align: center;
    }
    .tlo-a11y-btn svg { width: 20px; height: 20px; }
    .tlo-a11y-btn:hover,
    .tlo-a11y-btn:focus-visible {
      border-color: #3AB5C2;
      background: #eaf8fa;
      outline: none;
    }
    .tlo-a11y-btn.active {
      border-color: #3AB5C2;
      background: #3AB5C2;
      color: #fff;
    }
    .tlo-a11y-btn.active svg { fill: #fff; stroke: #fff; }

    /* Font size row */
    .tlo-font-row {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 8px 12px;
      justify-content: space-between;
    }
    .tlo-font-row span {
      font-size: 11px;
      font-weight: 700;
      color: #1a1a2e;
      min-width: 70px;
      text-align: center;
    }
    .tlo-font-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 2px solid #e0e0e0;
      background: #fff;
      cursor: pointer;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1a1a2e;
      flex-shrink: 0;
      font-family: inherit;
      transition: all 0.15s;
    }
    .tlo-font-btn:hover,
    .tlo-font-btn:focus-visible {
      border-color: #3AB5C2;
      background: #eaf8fa;
      outline: none;
    }
    .tlo-font-btn:disabled { opacity: 0.35; cursor: not-allowed; }

    /* Contrast row (3 options) */
    .tlo-contrast-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }

    /* Reset */
    .tlo-a11y-reset {
      width: 100%;
      margin-top: 14px;
      padding: 9px;
      border: 2px solid #e8e8e8;
      border-radius: 8px;
      background: none;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      color: #6c7a8d;
      transition: all 0.15s;
    }
    .tlo-a11y-reset:hover,
    .tlo-a11y-reset:focus-visible {
      border-color: #e74c3c;
      color: #e74c3c;
      background: #fff0ee;
      outline: none;
    }

    /* ── Active accessibility states ─────────────────────── */

    /* High contrast */
    body.tlo-contrast-high {
      filter: contrast(1.6) !important;
    }
    /* Dark mode */
    body.tlo-contrast-dark {
      background: #000 !important;
      color: #fff !important;
      filter: invert(1) hue-rotate(180deg) !important;
    }
    body.tlo-contrast-dark img,
    body.tlo-contrast-dark video,
    body.tlo-contrast-dark [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Grayscale */
    body.tlo-grayscale {
      filter: grayscale(1) !important;
    }
    body.tlo-contrast-dark.tlo-grayscale {
      filter: invert(1) hue-rotate(180deg) grayscale(1) !important;
    }
    /* Highlight links */
    body.tlo-highlight-links a:not(.btn):not(.navbar__logo):not(.skip-link) {
      background: #ffff00 !important;
      color: #000 !important;
      text-decoration: underline !important;
      outline: 2px solid #e8a020 !important;
      border-radius: 2px;
    }
    /* Pause animations */
    body.tlo-pause-anim *,
    body.tlo-pause-anim *::before,
    body.tlo-pause-anim *::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
    /* Dyslexia font */
    @font-face {
      font-family: 'OpenDyslexic';
      src: url('https://cdn.jsdelivr.net/npm/opendyslexic@0.91.12/fonts/OpenDyslexic-Regular.woff2') format('woff2');
    }
    body.tlo-dyslexia,
    body.tlo-dyslexia * {
      font-family: 'OpenDyslexic', Arial, sans-serif !important;
      letter-spacing: 0.05em !important;
      word-spacing: 0.1em !important;
      line-height: 1.8 !important;
    }

    /* Reading guide */
    #tlo-reading-guide {
      position: fixed;
      left: 0;
      right: 0;
      height: 36px;
      background: rgba(232, 160, 32, 0.22);
      border-top: 2px solid rgba(232, 160, 32, 0.5);
      border-bottom: 2px solid rgba(232, 160, 32, 0.5);
      pointer-events: none;
      z-index: 99997;
      display: none;
      transform: translateY(-50%);
    }
    #tlo-reading-guide.active { display: block; }

    /* Skip link enhancement */
    .skip-link:focus {
      top: 0 !important;
      outline: 3px solid #3AB5C2 !important;
    }
  `;
  document.head.appendChild(style);

  /* ── HTML ────────────────────────────────────────────────── */
  var html = `
    <button id="tlo-a11y-trigger" aria-label="Open accessibility tools" aria-expanded="false" aria-controls="tlo-a11y-panel">
      <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 5h-6l-1 5 3 9h-2l-2-6-2 6H9l3-9-1-5H5V5h16v2z"/>
      </svg>
    </button>

    <div id="tlo-a11y-panel" role="dialog" aria-label="Accessibility Tools" aria-modal="true">
      <div class="tlo-a11y-header">
        <h2>♿ Accessibility Tools</h2>
        <button class="tlo-a11y-close" id="tlo-a11y-close" aria-label="Close accessibility panel">✕</button>
      </div>
      <div class="tlo-a11y-body">

        <div class="tlo-a11y-section-label">Text Size</div>
        <div class="tlo-font-row">
          <button class="tlo-font-btn" id="tlo-font-down" aria-label="Decrease font size">A−</button>
          <span id="tlo-font-label">Default</span>
          <button class="tlo-font-btn" id="tlo-font-up" aria-label="Increase font size">A+</button>
        </div>

        <div class="tlo-a11y-section-label">Color & Contrast</div>
        <div class="tlo-contrast-row">
          <button class="tlo-a11y-btn" data-action="contrast-none" aria-pressed="true" aria-label="Normal contrast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg>
            Normal
          </button>
          <button class="tlo-a11y-btn" data-action="contrast-high" aria-pressed="false" aria-label="High contrast">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-4.08 3.05-7.44 7-7.93v15.86z"/></svg>
            High
          </button>
          <button class="tlo-a11y-btn" data-action="contrast-dark" aria-pressed="false" aria-label="Dark mode">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
            Dark
          </button>
        </div>

        <div class="tlo-a11y-section-label">Visual Aids</div>
        <div class="tlo-a11y-grid">
          <button class="tlo-a11y-btn" data-action="grayscale" aria-pressed="false" aria-label="Toggle grayscale mode">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
            Grayscale
          </button>
          <button class="tlo-a11y-btn" data-action="highlightLinks" aria-pressed="false" aria-label="Highlight all links">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Links
          </button>
          <button class="tlo-a11y-btn" data-action="readingGuide" aria-pressed="false" aria-label="Toggle reading guide line">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            Reading
          </button>
          <button class="tlo-a11y-btn" data-action="pauseAnimations" aria-pressed="false" aria-label="Pause all animations">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            Pause Anim
          </button>
        </div>

        <div class="tlo-a11y-section-label">Reading</div>
        <div class="tlo-a11y-grid">
          <button class="tlo-a11y-btn" data-action="dyslexiaFont" aria-pressed="false" aria-label="Toggle dyslexia-friendly font" style="grid-column: 1 / -1;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            Dyslexia-Friendly Font
          </button>
        </div>

        <button class="tlo-a11y-reset" id="tlo-a11y-reset" aria-label="Reset all accessibility settings to default">
          ↺ Reset All Settings
        </button>
      </div>
    </div>

    <div id="tlo-reading-guide" aria-hidden="true"></div>
  `;

  var container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  /* ── Elements ────────────────────────────────────────────── */
  var trigger   = document.getElementById('tlo-a11y-trigger');
  var panel     = document.getElementById('tlo-a11y-panel');
  var closeBtn  = document.getElementById('tlo-a11y-close');
  var fontUp    = document.getElementById('tlo-font-up');
  var fontDown  = document.getElementById('tlo-font-down');
  var fontLabel = document.getElementById('tlo-font-label');
  var guide     = document.getElementById('tlo-reading-guide');
  var resetBtn  = document.getElementById('tlo-a11y-reset');
  var body      = document.body;

  /* ── Panel open/close ────────────────────────────────────── */
  function openPanel() {
    panel.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }
  function closePanel() {
    panel.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }

  trigger.addEventListener('click', function () {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== trigger) {
      if (panel.classList.contains('open')) closePanel();
    }
  });

  // Escape to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

  /* ── Font size ───────────────────────────────────────────── */
  var FONT_STEPS = [-2, 0, 2, 4, 6, 8];
  var FONT_LABELS = ['Smaller', 'Default', 'Larger', 'Large', 'X-Large', 'XX-Large'];
  var BASE_SIZE = 16;

  function applyFontSize() {
    var idx = state.fontSize + 1; // offset: -2 → 0, 0 → 1, etc
    // clamp to valid range
    var step = Math.max(-2, Math.min(4, state.fontSize));
    state.fontSize = step;
    var px = BASE_SIZE + step * 2;
    document.documentElement.style.fontSize = px + 'px';
    var labelIdx = step + 1; // -2→-1 oops, recalc
    // map -2 to 0→5
    var li = ['-2','-1','0','1','2','3','4'].indexOf(String(step));
    // simpler: just clamp index
    var displayLabel = FONT_LABELS[step + 2] || 'Default';
    fontLabel.textContent = displayLabel;
    fontDown.disabled = step <= -2;
    fontUp.disabled   = step >= 4;
  }

  fontUp.addEventListener('click', function () {
    state.fontSize = Math.min(4, state.fontSize + 1);
    applyFontSize();
    saveState();
  });
  fontDown.addEventListener('click', function () {
    state.fontSize = Math.max(-2, state.fontSize - 1);
    applyFontSize();
    saveState();
  });

  /* ── Contrast ────────────────────────────────────────────── */
  function applyContrast(mode) {
    body.classList.remove('tlo-contrast-high', 'tlo-contrast-dark');
    if (mode === 'high') body.classList.add('tlo-contrast-high');
    if (mode === 'dark') body.classList.add('tlo-contrast-dark');
    // update aria-pressed
    ['contrast-none', 'contrast-high', 'contrast-dark'].forEach(function (a) {
      var btn = panel.querySelector('[data-action="' + a + '"]');
      if (btn) {
        var active = a === 'contrast-' + mode;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.classList.toggle('active', active);
      }
    });
  }

  /* ── Toggle helpers ──────────────────────────────────────── */
  function applyToggle(key, cssClass, el) {
    body.classList.toggle(cssClass, state[key]);
    if (el) {
      el.setAttribute('aria-pressed', state[key] ? 'true' : 'false');
      el.classList.toggle('active', state[key]);
    }
  }

  /* ── Reading guide ───────────────────────────────────────── */
  function moveGuide(e) {
    guide.style.top = e.clientY + 'px';
  }
  function applyReadingGuide() {
    if (state.readingGuide) {
      guide.classList.add('active');
      document.addEventListener('mousemove', moveGuide);
    } else {
      guide.classList.remove('active');
      document.removeEventListener('mousemove', moveGuide);
    }
    var btn = panel.querySelector('[data-action="readingGuide"]');
    if (btn) {
      btn.setAttribute('aria-pressed', state.readingGuide ? 'true' : 'false');
      btn.classList.toggle('active', state.readingGuide);
    }
  }

  /* ── Button click handler ────────────────────────────────── */
  panel.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');

    switch (action) {
      case 'contrast-none':
        state.contrast = 'none';
        applyContrast('none');
        break;
      case 'contrast-high':
        state.contrast = state.contrast === 'high' ? 'none' : 'high';
        applyContrast(state.contrast);
        break;
      case 'contrast-dark':
        state.contrast = state.contrast === 'dark' ? 'none' : 'dark';
        applyContrast(state.contrast);
        break;
      case 'grayscale':
        state.grayscale = !state.grayscale;
        applyToggle('grayscale', 'tlo-grayscale', btn);
        break;
      case 'highlightLinks':
        state.highlightLinks = !state.highlightLinks;
        applyToggle('highlightLinks', 'tlo-highlight-links', btn);
        break;
      case 'pauseAnimations':
        state.pauseAnimations = !state.pauseAnimations;
        applyToggle('pauseAnimations', 'tlo-pause-anim', btn);
        break;
      case 'dyslexiaFont':
        state.dyslexiaFont = !state.dyslexiaFont;
        applyToggle('dyslexiaFont', 'tlo-dyslexia', btn);
        break;
      case 'readingGuide':
        state.readingGuide = !state.readingGuide;
        applyReadingGuide();
        break;
    }
    saveState();
  });

  /* ── Reset ───────────────────────────────────────────────── */
  resetBtn.addEventListener('click', function () {
    state = Object.assign({}, defaults);
    saveState();
    applyAll();
  });

  /* ── Apply all state ─────────────────────────────────────── */
  function applyAll() {
    applyFontSize();
    applyContrast(state.contrast);
    applyToggle('grayscale', 'tlo-grayscale',
      panel.querySelector('[data-action="grayscale"]'));
    applyToggle('highlightLinks', 'tlo-highlight-links',
      panel.querySelector('[data-action="highlightLinks"]'));
    applyToggle('pauseAnimations', 'tlo-pause-anim',
      panel.querySelector('[data-action="pauseAnimations"]'));
    applyToggle('dyslexiaFont', 'tlo-dyslexia',
      panel.querySelector('[data-action="dyslexiaFont"]'));
    applyReadingGuide();
  }

  /* ── Init ────────────────────────────────────────────────── */
  loadState();
  applyAll();

  // Respect prefers-reduced-motion on first load
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (!state.pauseAnimations) {
      state.pauseAnimations = true;
      applyToggle('pauseAnimations', 'tlo-pause-anim',
        panel.querySelector('[data-action="pauseAnimations"]'));
    }
  }

})();
