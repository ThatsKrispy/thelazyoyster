/* ============================================================
   THE LAZY OYSTER — v2 Main JS  |  ThatsKrispy
   ============================================================ */
'use strict';

/* ── NAVBAR SCROLL SHADOW ────────────────────────────────── */
(function() {
  var nav = document.querySelector('.navbar');
  if (!nav) return;
  var tick = false;
  window.addEventListener('scroll', function() {
    if (!tick) {
      requestAnimationFrame(function() {
        nav.classList.toggle('scrolled', window.scrollY > 10);
        tick = false;
      });
      tick = true;
    }
  });
})();

/* ── HERO LOAD ANIMATION ─────────────────────────────────── */
(function() {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  setTimeout(function() { hero.classList.add('loaded'); }, 60);
})();

/* ── MOBILE NAV ──────────────────────────────────────────── */
(function() {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function() {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('click', function(e) {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
})();

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
(function() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(function(a) {
    var href = a.getAttribute('href').split('/').pop() || 'index.html';
    if (path === href) a.classList.add('active');
  });
})();

/* ── SCROLL FADE-UP ──────────────────────────────────────── */
(function() {
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.fade-up').forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-up').forEach(function(el) { io.observe(el); });
})();

/* ── FAQ ACCORDION ───────────────────────────────────────── */
(function() {
  document.querySelectorAll('.faq-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-btn').forEach(function(b) {
        b.setAttribute('aria-expanded', 'false');
        var a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.classList.remove('open');
      });
      if (!open && answer) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

/* ── CATERING FORM ───────────────────────────────────────── */
(function() {
  var form = document.getElementById('catering-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var statusEl = document.getElementById('form-status');
    var submitBtn = form.querySelector('.form-submit');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    statusEl.className = 'form-status';
    var data = {};
    new FormData(form).forEach(function(v, k) { data[k] = v; });
    var body = [
      'NEW CATERING INQUIRY — The Lazy Oyster', '---',
      'Name: ' + (data.first_name || '') + ' ' + (data.last_name || ''),
      'Email: ' + (data.email || ''), 'Phone: ' + (data.phone || ''),
      'Event Address: ' + (data.event_address || ''),
      'Event Date: ' + (data.event_date || ''),
      'Event Time: ' + (data.event_time || ''),
      'Guest Count: ' + (data.guest_count || ''),
      'Celebration: ' + (data.celebration || ''),
    ].join('\n');
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: form.dataset.accessKey,
        subject: 'New Catering Inquiry – ' + data.first_name + ' ' + data.last_name,
        from_name: 'The Lazy Oyster Website',
        message: body, email: data.email,
        name: data.first_name + ' ' + data.last_name,
        replyto: data.email,
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      if (res.success) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '✓ Received! We\'ll be in touch within 24 hours to confirm your date.';
        form.reset();
      } else { throw new Error(res.message || 'Failed'); }
    })
    .catch(function() {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Something went wrong. Please email us at StayLazy@TheLazyOyster.com';
    });
  });
})();

/* ── NEWSLETTER FORM ─────────────────────────────────────── */
(function() {
  document.querySelectorAll('.newsletter-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      var orig = btn.textContent;
      btn.textContent = '…'; btn.disabled = true;
      var data = {};
      new FormData(form).forEach(function(v, k) { data[k] = v; });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: form.dataset.accessKey,
          subject: 'Newsletter Sign-Up – The Lazy Oyster',
          from_name: 'The Lazy Oyster Website',
          message: 'New subscriber: ' + data.name + ' | ' + data.email,
          email: data.email, name: data.name,
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        btn.textContent = res.success ? '✓ You\'re in!' : orig;
        btn.disabled = false;
        if (res.success) form.reset();
      })
      .catch(function() { btn.textContent = orig; btn.disabled = false; });
    });
  });
})();

/* ── COOKIE CONSENT ──────────────────────────────────────── */
(function() {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (!localStorage.getItem('tlo_cookie_consent')) banner.classList.add('show');
  var accept = document.getElementById('cookie-accept');
  var decline = document.getElementById('cookie-decline');
  function dismiss(val) {
    banner.classList.remove('show');
    localStorage.setItem('tlo_cookie_consent', val);
  }
  if (accept)  accept.addEventListener('click',  function() { dismiss('accepted'); });
  if (decline) decline.addEventListener('click', function() { dismiss('declined'); });
})();

/* ── LOGO TICKER PAUSE ON HOVER ──────────────────────────── */
(function() {
  var track = document.querySelector('.ticker-track');
  if (!track) return;
  track.addEventListener('mouseenter', function() { track.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', function() { track.style.animationPlayState = 'running'; });
})();
