/* ============================================================
   THE LAZY OYSTER - Consent Manager + Accessibility Widget
   Self-contained, no dependencies, no third-party calls.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. CONSENT MANAGER (GDPR / CCPA-friendly)
     --------------------------------------------------------- */
  var CONSENT_KEY = 'tlo_consent_v2';

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function saveConsent(obj) {
    obj.ts = Date.now();
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function buildConsentBanner() {
    if (getConsent()) return; // already decided

    var bar = document.createElement('div');
    bar.className = 'tlo-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.setAttribute('aria-live', 'polite');
    bar.innerHTML =
      '<div class="tlo-consent__inner">' +
        '<div class="tlo-consent__text">' +
          '<strong>We value your privacy</strong>' +
          '<p>We use cookies to improve your experience, analyze traffic, and remember your preferences. ' +
          'You can accept all, reject non-essential, or choose what to allow. ' +
          '<a href="privacy.html">Privacy Policy</a></p>' +
        '</div>' +
        '<div class="tlo-consent__actions">' +
          '<button type="button" class="tlo-btn tlo-btn--ghost" data-consent="customize">Customize</button>' +
          '<button type="button" class="tlo-btn tlo-btn--ghost" data-consent="reject">Reject Non-Essential</button>' +
          '<button type="button" class="tlo-btn tlo-btn--solid" data-consent="accept">Accept All</button>' +
        '</div>' +
      '</div>' +
      '<div class="tlo-consent__panel" hidden>' +
        '<label class="tlo-consent__row"><span><strong>Essential</strong><br>Required for the site to function. Always on.</span>' +
          '<input type="checkbox" checked disabled aria-label="Essential cookies, always on"></label>' +
        '<label class="tlo-consent__row"><span><strong>Analytics</strong><br>Helps us understand how visitors use the site.</span>' +
          '<input type="checkbox" id="tlo-c-analytics"></label>' +
        '<label class="tlo-consent__row"><span><strong>Marketing</strong><br>Used to personalize promotions and measure campaigns.</span>' +
          '<input type="checkbox" id="tlo-c-marketing"></label>' +
        '<div class="tlo-consent__panel-actions">' +
          '<button type="button" class="tlo-btn tlo-btn--solid" data-consent="save">Save Preferences</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);

    function close() { bar.remove(); }

    bar.addEventListener('click', function (e) {
      var action = e.target.getAttribute('data-consent');
      if (!action) return;
      if (action === 'accept') {
        saveConsent({ essential: true, analytics: true, marketing: true });
        applyConsent({ analytics: true, marketing: true });
        close();
      } else if (action === 'reject') {
        saveConsent({ essential: true, analytics: false, marketing: false });
        close();
      } else if (action === 'customize') {
        var panel = bar.querySelector('.tlo-consent__panel');
        panel.hidden = !panel.hidden;
      } else if (action === 'save') {
        var a = bar.querySelector('#tlo-c-analytics').checked;
        var m = bar.querySelector('#tlo-c-marketing').checked;
        saveConsent({ essential: true, analytics: a, marketing: m });
        applyConsent({ analytics: a, marketing: m });
        close();
      }
    });
  }

  // Hook for future analytics/marketing tags. Only fires when allowed.
  function applyConsent(prefs) {
    if (prefs.analytics) { document.dispatchEvent(new CustomEvent('tlo:analytics-allowed')); }
    if (prefs.marketing) { document.dispatchEvent(new CustomEvent('tlo:marketing-allowed')); }
  }

  /* ---------------------------------------------------------
     2. ACCESSIBILITY WIDGET (ADA / WCAG helper)
     --------------------------------------------------------- */
  var A11Y_KEY = 'tlo_a11y_v1';
  var state = loadA11y();

  function loadA11y() {
    try { return JSON.parse(localStorage.getItem(A11Y_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveA11y() {
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var FEATURES = [
    { key: 'bigText',      label: 'Larger Text',        cls: 'tlo-a11y-bigtext' },
    { key: 'readable',     label: 'Readable Font',      cls: 'tlo-a11y-readable' },
    { key: 'contrast',     label: 'High Contrast',      cls: 'tlo-a11y-contrast' },
    { key: 'highlightLinks', label: 'Highlight Links',  cls: 'tlo-a11y-links' },
    { key: 'bigCursor',    label: 'Big Cursor',         cls: 'tlo-a11y-cursor' },
    { key: 'pauseMotion',  label: 'Pause Animations',   cls: 'tlo-a11y-nomotion' },
    { key: 'readingGuide', label: 'Reading Guide',      cls: 'tlo-a11y-guide' }
  ];

  function applyA11y() {
    var root = document.documentElement;
    FEATURES.forEach(function (f) {
      root.classList.toggle(f.cls, !!state[f.key]);
    });
    toggleReadingGuide(!!state.readingGuide);
  }

  var guideEl = null;
  function toggleReadingGuide(on) {
    if (on && !guideEl) {
      guideEl = document.createElement('div');
      guideEl.className = 'tlo-reading-guide';
      document.body.appendChild(guideEl);
      window.addEventListener('mousemove', moveGuide);
    } else if (!on && guideEl) {
      window.removeEventListener('mousemove', moveGuide);
      guideEl.remove(); guideEl = null;
    }
  }
  function moveGuide(e) { if (guideEl) guideEl.style.top = e.clientY + 'px'; }

  function buildA11yWidget() {
    var btn = document.createElement('button');
    btn.className = 'tlo-a11y-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open accessibility menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="4" r="2"/><path d="M19 13v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2"/>' +
      '<path d="M12 10v4"/><path d="M9 21l3-7 3 7"/></svg>';

    var menu = document.createElement('div');
    menu.className = 'tlo-a11y-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Accessibility options');
    menu.hidden = true;

    var html = '<div class="tlo-a11y-menu__head">' +
      '<strong>Accessibility</strong>' +
      '<button type="button" class="tlo-a11y-close" aria-label="Close accessibility menu">&times;</button></div>' +
      '<div class="tlo-a11y-menu__grid">';
    FEATURES.forEach(function (f) {
      html += '<button type="button" class="tlo-a11y-opt" data-feat="' + f.key + '" aria-pressed="false">' +
              f.label + '</button>';
    });
    html += '</div>' +
      '<button type="button" class="tlo-btn tlo-btn--ghost tlo-a11y-reset" data-feat="__reset">Reset All</button>';
    menu.innerHTML = html;

    document.body.appendChild(btn);
    document.body.appendChild(menu);

    function syncButtons() {
      menu.querySelectorAll('.tlo-a11y-opt').forEach(function (o) {
        var k = o.getAttribute('data-feat');
        var on = !!state[k];
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function openMenu() { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
    function closeMenu() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

    btn.addEventListener('click', function () { menu.hidden ? openMenu() : closeMenu(); });

    menu.addEventListener('click', function (e) {
      if (e.target.classList.contains('tlo-a11y-close')) { closeMenu(); return; }
      var feat = e.target.getAttribute('data-feat');
      if (!feat) return;
      if (feat === '__reset') {
        state = {}; saveA11y(); applyA11y(); syncButtons(); return;
      }
      state[feat] = !state[feat];
      saveA11y(); applyA11y(); syncButtons();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
    });

    syncButtons();
    applyA11y();
  }

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */
  function init() {
    buildConsentBanner();
    buildA11yWidget();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
