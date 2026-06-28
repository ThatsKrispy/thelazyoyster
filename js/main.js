/* ============================================================
   THE LAZY OYSTER — Main JS
   ThatsKrispy Build
   ============================================================ */

'use strict';

/* === MOBILE NAV === */
(function() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function() {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });
})();

/* === SCROLL FADE-IN ANIMATIONS === */
(function() {
  if (!window.IntersectionObserver) return;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(function(el) {
    observer.observe(el);
  });
})();

/* === ACTIVE NAV LINK === */
(function() {
  var path = window.location.pathname.replace(/\/$/, '') || '/index';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(function(link) {
    var href = link.getAttribute('href').replace(/\/$/, '') || '/index';
    if (path === href || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });
})();

/* === FAQ ACCORDION === */
(function() {
  document.querySelectorAll('.faq-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-btn').forEach(function(b) {
        b.setAttribute('aria-expanded', 'false');
        var a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
      }
    });
  });
})();

/* === CATERING FORM — Web3Forms (free, no backend) === */
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
    statusEl.textContent = '';

    var formData = new FormData(form);
    var data = {};
    formData.forEach(function(val, key) { data[key] = val; });

    // Build a nicely formatted message for the email
    var body = [
      'NEW CATERING INQUIRY — The Lazy Oyster',
      '---',
      'Name: ' + (data.first_name || '') + ' ' + (data.last_name || ''),
      'Email: ' + (data.email || ''),
      'Phone: ' + (data.phone || ''),
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
        subject: 'New Catering Inquiry – ' + (data.first_name || '') + ' ' + (data.last_name || ''),
        from_name: 'The Lazy Oyster Website',
        message: body,
        email: data.email,
        name: data.first_name + ' ' + data.last_name,
        replyto: data.email,
        botcheck: data.botcheck || ''
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      if (result.success) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '✓ Thank you! We\'ll get back to you within 24 hours to confirm your date.';
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    })
    .catch(function(err) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Something went wrong. Please call us at (305) 905-0257 or email StayLazy@TheLazyOyster.com';
    });
  });
})();

/* === NEWSLETTER FORM === */
(function() {
  var forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      var emailInput = form.querySelector('input[type="email"]');
      var nameInput = form.querySelector('input[name="name"]');

      btn.textContent = 'Subscribing…';
      btn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: form.dataset.accessKey,
          subject: 'New Newsletter Signup — The Lazy Oyster',
          from_name: 'The Lazy Oyster Website',
          name: nameInput ? nameInput.value : '',
          email: emailInput ? emailInput.value : '',
          message: 'Newsletter signup from ' + (nameInput ? nameInput.value : '') + ' — ' + (emailInput ? emailInput.value : '')
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (res.success) {
          btn.textContent = '✓ You\'re in!';
          form.reset();
        } else {
          btn.textContent = 'Try again';
          btn.disabled = false;
        }
      })
      .catch(function() {
        btn.textContent = 'Try again';
        btn.disabled = false;
      });
    });
  });
})();
