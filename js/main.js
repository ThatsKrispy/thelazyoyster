/* ============================================================
   THE LAZY OYSTER - v3  |  ThatsKrispy
   ============================================================ */
'use strict';

/* -- NAVBAR SCROLL SHADOW ---------------------------------- */
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

/* -- HERO LOAD ANIMATION ----------------------------------- */
(function() {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  setTimeout(function() { hero.classList.add('loaded'); }, 60);
})();

/* -- MOBILE NAV -------------------------------------------- */
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

/* -- SCROLL REVEAL ----------------------------------------- */
(function() {
  var sel = '.fade-up, .reveal';
  if (!window.IntersectionObserver) {
    document.querySelectorAll(sel).forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll(sel).forEach(function(el) { io.observe(el); });
  /* stagger children */
  document.querySelectorAll('.ev-how__steps, .ev-packages__grid, .ev-proof, .values-grid').forEach(function(group) {
    group.querySelectorAll('.reveal').forEach(function(el, i) {
      el.style.transitionDelay = (i * 80) + 'ms';
    });
  });
})();

/* -- FAQ ACCORDION ----------------------------------------- */
(function() {
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      if (!item) return;
      var isOpen = item.classList.contains('open');
      /* close all */
      document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      /* open clicked if it was closed */
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* -- GENERIC FORM SUBMIT (catering + contact) -------------- */
(function() {
  ['catering-form', 'contact-form'].forEach(function(id) {
    var form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var statusEl = form.querySelector('.form-status');
      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      if (statusEl) { statusEl.className = 'form-status'; statusEl.textContent = ''; }
      var payload = { access_key: form.dataset.accessKey, from_name: 'The Lazy Oyster Website' };
      new FormData(form).forEach(function(v, k) { payload[k] = v; });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (statusEl) {
          if (res.success) {
            statusEl.className = 'form-status success';
            statusEl.textContent = "Thanks! We'll get back to you within 24 hours.";
            form.reset();
          } else { throw new Error(res.message || 'Failed'); }
        }
      })
      .catch(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Something went wrong. Please email StayLazy@TheLazyOyster.com or call (305) 905-0257.';
        }
      });
    });
  });
})();

/* -- NEWSLETTER FORMS -------------------------------------- */
(function() {
  document.querySelectorAll('.newsletter-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      var orig = btn.textContent;
      btn.textContent = '...'; btn.disabled = true;
      var payload = { access_key: form.dataset.accessKey, from_name: 'The Lazy Oyster Website', subject: 'Newsletter Sign-Up - The Lazy Oyster' };
      new FormData(form).forEach(function(v, k) { payload[k] = v; });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        btn.textContent = res.success ? "You're in!" : orig;
        btn.disabled = false;
        if (res.success) form.reset();
      })
      .catch(function() { btn.textContent = orig; btn.disabled = false; });
    });
  });
})();

/* -- TICKER PAUSE ON HOVER --------------------------------- */
(function() {
  var track = document.querySelector('.ticker-track');
  if (!track) return;
  track.addEventListener('mouseenter', function() { track.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', function() { track.style.animationPlayState = 'running'; });
})();
