/* ============================================================
   THE LAZY OYSTER — Cookie Consent Manager
   GDPR / CCPA compliant, zero dependency, self-hosted
   ============================================================ */

(function () {
  'use strict';

  var CONSENT_KEY = 'tlo_consent';
  var CONSENT_VERSION = '1'; // bump to re-prompt after policy changes

  /* ── Already consented? Skip everything ─────────────────── */
  function getConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      return c && c.v === CONSENT_VERSION ? c : null;
    } catch (e) { return null; }
  }

  function saveConsent(analytics, marketing) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        v: CONSENT_VERSION,
        essential: true,
        analytics: !!analytics,
        marketing: !!marketing,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  if (getConsent()) return; // already decided — bail out

  /* ── Styles ──────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = `
    #tlo-consent-overlay {
      position: fixed;
      inset: 0;
      background: rgba(13,27,42,0.55);
      z-index: 99990;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 20px;
      animation: tlo-fade-in 0.3s ease;
    }
    @keyframes tlo-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #tlo-consent-banner {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.25);
      max-width: 680px;
      width: 100%;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px;
      color: #1a1a2e;
      overflow: hidden;
      animation: tlo-slide-up 0.35s ease;
    }
    @keyframes tlo-slide-up {
      from { transform: translateY(30px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .tlo-consent-header {
      background: #0d1b2a;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tlo-consent-header h2 {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #3AB5C2;
      margin: 0;
      font-family: 'Inter', Arial, sans-serif;
    }
    .tlo-consent-body {
      padding: 18px 20px 6px;
    }
    .tlo-consent-body p {
      color: #444;
      line-height: 1.55;
      margin: 0 0 14px;
      font-size: 13.5px;
    }
    .tlo-consent-body a {
      color: #3AB5C2;
      text-decoration: underline;
    }

    /* Toggle rows */
    .tlo-consent-toggles {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    .tlo-consent-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e8ecef;
      gap: 12px;
    }
    .tlo-consent-row-info {}
    .tlo-consent-row-title {
      font-weight: 700;
      font-size: 13px;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tlo-badge-required {
      font-size: 10px;
      font-weight: 700;
      background: #3AB5C2;
      color: #fff;
      padding: 2px 7px;
      border-radius: 20px;
      letter-spacing: 0.06em;
    }
    .tlo-consent-row-desc {
      font-size: 12px;
      color: #6c7a8d;
      margin-top: 2px;
      line-height: 1.4;
    }

    /* Toggle switch */
    .tlo-toggle {
      position: relative;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }
    .tlo-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }
    .tlo-toggle-slider {
      position: absolute;
      inset: 0;
      background: #ccc;
      border-radius: 24px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .tlo-toggle-slider::before {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      left: 3px;
      top: 3px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    .tlo-toggle input:checked + .tlo-toggle-slider {
      background: #3AB5C2;
    }
    .tlo-toggle input:checked + .tlo-toggle-slider::before {
      transform: translateX(20px);
    }
    .tlo-toggle input:disabled + .tlo-toggle-slider {
      background: #3AB5C2;
      cursor: not-allowed;
      opacity: 0.6;
    }
    .tlo-toggle input:focus-visible + .tlo-toggle-slider {
      outline: 3px solid #E8A020;
      outline-offset: 2px;
    }

    /* Buttons */
    .tlo-consent-actions {
      padding: 0 20px 18px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .tlo-btn-accept-all {
      flex: 1;
      padding: 12px 20px;
      background: #3AB5C2;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .tlo-btn-accept-all:hover,
    .tlo-btn-accept-all:focus-visible {
      background: #2a919b;
      outline: 3px solid #E8A020;
      outline-offset: 2px;
    }
    .tlo-btn-save {
      padding: 12px 20px;
      background: none;
      color: #1a1a2e;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .tlo-btn-save:hover,
    .tlo-btn-save:focus-visible {
      border-color: #3AB5C2;
      color: #3AB5C2;
      outline: none;
    }
    .tlo-btn-reject {
      padding: 12px 16px;
      background: none;
      color: #999;
      border: none;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;
      white-space: nowrap;
    }
    .tlo-btn-reject:hover { color: #555; }

    /* Cookie settings re-open button (persists after consent) */
    #tlo-consent-settings-btn {
      position: fixed;
      bottom: 88px;
      left: 16px;
      z-index: 99985;
      background: #0d1b2a;
      color: rgba(255,255,255,0.6);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 20px;
      padding: 5px 12px;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: color 0.15s, border-color 0.15s;
    }
    #tlo-consent-settings-btn:hover { color: #3AB5C2; border-color: #3AB5C2; }
    #tlo-consent-settings-btn svg { width: 12px; height: 12px; }

    @media (max-width: 480px) {
      #tlo-consent-overlay { padding: 12px; align-items: flex-end; }
      .tlo-consent-actions { flex-direction: column; }
      .tlo-btn-accept-all, .tlo-btn-save { width: 100%; }
    }
  `;
  document.head.appendChild(style);

  /* ── HTML ────────────────────────────────────────────────── */
  var html = `
    <div id="tlo-consent-overlay" role="dialog" aria-modal="true" aria-labelledby="tlo-consent-title">
      <div id="tlo-consent-banner">
        <div class="tlo-consent-header">
          <h2 id="tlo-consent-title">🍪 Cookie Preferences</h2>
        </div>
        <div class="tlo-consent-body">
          <p>We use cookies to keep the site running and understand how it's used. You control which optional cookies are active — essential ones are always on. See our <a href="privacy.html">Privacy Policy</a> for details.</p>
          <div class="tlo-consent-toggles">

            <div class="tlo-consent-row">
              <div class="tlo-consent-row-info">
                <div class="tlo-consent-row-title">
                  Essential Cookies
                  <span class="tlo-badge-required">Always On</span>
                </div>
                <div class="tlo-consent-row-desc">Site functionality, accessibility preferences, form submissions. Required for the site to work.</div>
              </div>
              <label class="tlo-toggle" aria-label="Essential cookies — always on">
                <input type="checkbox" checked disabled aria-disabled="true">
                <span class="tlo-toggle-slider"></span>
              </label>
            </div>

            <div class="tlo-consent-row">
              <div class="tlo-consent-row-info">
                <div class="tlo-consent-row-title">Analytics Cookies</div>
                <div class="tlo-consent-row-desc">Help us understand how visitors interact with the site so we can improve it. No personal data is sold.</div>
              </div>
              <label class="tlo-toggle" aria-label="Toggle analytics cookies">
                <input type="checkbox" id="tlo-analytics-toggle" checked>
                <span class="tlo-toggle-slider"></span>
              </label>
            </div>

            <div class="tlo-consent-row">
              <div class="tlo-consent-row-info">
                <div class="tlo-consent-row-title">Marketing Cookies</div>
                <div class="tlo-consent-row-desc">Used to show relevant promotions. May be set by our social media platforms (Instagram, Meta).</div>
              </div>
              <label class="tlo-toggle" aria-label="Toggle marketing cookies">
                <input type="checkbox" id="tlo-marketing-toggle">
                <span class="tlo-toggle-slider"></span>
              </label>
            </div>

          </div>
        </div>
        <div class="tlo-consent-actions">
          <button class="tlo-btn-accept-all" id="tlo-accept-all">Accept All</button>
          <button class="tlo-btn-save" id="tlo-save-prefs">Save My Preferences</button>
          <button class="tlo-btn-reject" id="tlo-reject-all">Essential Only</button>
        </div>
      </div>
    </div>
  `;

  var settingsBtnHtml = `
    <button id="tlo-consent-settings-btn" aria-label="Review cookie settings">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-4.08 3.05-7.44 7-7.93v15.86z"/></svg>
      Cookies
    </button>
  `;

  /* ── Mount banner ────────────────────────────────────────── */
  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  var overlay        = document.getElementById('tlo-consent-overlay');
  var analyticsChk   = document.getElementById('tlo-analytics-toggle');
  var marketingChk   = document.getElementById('tlo-marketing-toggle');
  var acceptAllBtn   = document.getElementById('tlo-accept-all');
  var savePrefsBtn   = document.getElementById('tlo-save-prefs');
  var rejectAllBtn   = document.getElementById('tlo-reject-all');

  /* ── Dismiss banner ──────────────────────────────────────── */
  function dismiss(analytics, marketing) {
    saveConsent(analytics, marketing);
    overlay.style.animation = 'tlo-fade-in 0.2s ease reverse';
    setTimeout(function () {
      overlay.remove();
      // Add small "Cookies" button so user can revisit
      var sb = document.createElement('div');
      sb.innerHTML = settingsBtnHtml;
      document.body.appendChild(sb);
      document.getElementById('tlo-consent-settings-btn').addEventListener('click', reopenBanner);
    }, 200);
  }

  acceptAllBtn.addEventListener('click', function () {
    dismiss(true, true);
  });

  savePrefsBtn.addEventListener('click', function () {
    dismiss(analyticsChk.checked, marketingChk.checked);
  });

  rejectAllBtn.addEventListener('click', function () {
    dismiss(false, false);
  });

  /* ── Trap focus inside banner ────────────────────────────── */
  overlay.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = overlay.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), a[href]'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  // Focus first interactive element on open
  setTimeout(function () {
    var firstBtn = overlay.querySelector('button:not([disabled])');
    if (firstBtn) firstBtn.focus();
  }, 100);

  /* ── Re-open handler (for settings button) ───────────────── */
  function reopenBanner() {
    var sb = document.getElementById('tlo-consent-settings-btn');
    if (sb) sb.remove();
    // Clear consent so banner re-renders
    try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    var w2 = document.createElement('div');
    w2.innerHTML = html;
    document.body.appendChild(w2);
    // Re-bind (simple reload approach)
    location.reload();
  }

})();
