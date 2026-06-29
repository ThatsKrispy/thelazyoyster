/* The Lazy Oyster — main.js · ThatsKrispy v4 */
'use strict';

/* ── Mobile nav ─────────────────────────────────────────────── */
(function(){
  var btn = document.getElementById('burger');
  var nav = document.getElementById('mob-nav');
  if(!btn||!nav) return;
  btn.addEventListener('click',function(){
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('click',function(e){
    if(!btn.contains(e.target)&&!nav.contains(e.target)){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label','Open menu');
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav.classList.contains('open')){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      btn.focus();
    }
  });
})();

/* ── Active nav link ────────────────────────────────────────── */
(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mob a').forEach(function(a){
    var href = a.getAttribute('href').split('/').pop() || 'index.html';
    if(path===href) a.classList.add('act');
  });
})();

/* ── Scroll fade-in ─────────────────────────────────────────── */
(function(){
  if(!window.IntersectionObserver) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }});
  },{threshold:.1,rootMargin:'0px 0px -36px 0px'});
  document.querySelectorAll('.fade').forEach(function(el){ io.observe(el); });
})();

/* ── FAQ accordion ──────────────────────────────────────────── */
(function(){
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var ans = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded')==='true';
      // close all
      document.querySelectorAll('.faq-q').forEach(function(b){
        b.setAttribute('aria-expanded','false');
        var a = document.getElementById(b.getAttribute('aria-controls'));
        if(a) a.classList.remove('open');
      });
      if(!open){ btn.setAttribute('aria-expanded','true'); if(ans) ans.classList.add('open'); }
    });
  });
})();

/* ── Catering form (Web3Forms) ──────────────────────────────── */
(function(){
  var form = document.getElementById('cat-form');
  if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var msg = document.getElementById('form-msg');
    var sbm = form.querySelector('.form-submit');
    var orig = sbm.textContent;
    sbm.textContent='Sending…'; sbm.disabled=true;
    msg.className='form-msg';

    var d={};
    new FormData(form).forEach(function(v,k){ d[k]=v; });
    var body=[
      'NEW CATERING INQUIRY — The Lazy Oyster','---',
      'Name: '+d.first_name+' '+d.last_name,
      'Email: '+d.email,'Phone: '+d.phone,
      'Event Address: '+d.event_address,
      'Date: '+d.event_date,' Time: '+d.event_time,
      'Guests: '+d.guest_count,
      'Occasion: '+d.celebration
    ].join('\n');

    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        access_key:form.dataset.accessKey,
        subject:'New Catering Inquiry – '+d.first_name+' '+d.last_name,
        from_name:'The Lazy Oyster Website',
        message:body, email:d.email,
        name:d.first_name+' '+d.last_name,
        replyto:d.email, botcheck:d.botcheck||''
      })
    })
    .then(function(r){return r.json();})
    .then(function(r){
      sbm.textContent=orig; sbm.disabled=false;
      if(r.success){
        msg.className='form-msg ok';
        msg.textContent='✓ Sent! We\'ll get back to you within 24 hours to confirm your date.';
        form.reset();
      } else throw new Error();
    })
    .catch(function(){
      sbm.textContent=orig; sbm.disabled=false;
      msg.className='form-msg err';
      msg.textContent='Something went wrong — call (305) 905-0257 or email StayLazy@TheLazyOyster.com';
    });
  });
})();

/* ── Newsletter forms ───────────────────────────────────────── */
(function(){
  document.querySelectorAll('.nl-form').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=form.querySelector('button');
      btn.textContent='Subscribing…'; btn.disabled=true;
      var d={}; new FormData(form).forEach(function(v,k){d[k]=v;});
      fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          access_key:form.dataset.accessKey,
          subject:'Newsletter Signup — The Lazy Oyster',
          from_name:'The Lazy Oyster Website',
          name:d.name||'', email:d.email||'',
          message:'Newsletter signup: '+d.name+' · '+d.email
        })
      })
      .then(function(r){return r.json();})
      .then(function(r){
        if(r.success){ btn.textContent='✓ You\'re in!'; form.reset(); }
        else{ btn.textContent='Try again'; btn.disabled=false; }
      })
      .catch(function(){ btn.textContent='Try again'; btn.disabled=false; });
    });
  });
})();

/* ── Legacy nav ID fallback (v3 pages use #hamburger / #mobile-nav) ── */
(function(){
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('mobile-nav');
  if(!btn||!nav) return; // already handled by v4 burger/mob-nav above
  btn.addEventListener('click',function(){
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('click',function(e){
    if(!btn.contains(e.target)&&!nav.contains(e.target)){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav.classList.contains('open')){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      btn.focus();
    }
  });
})();

/* ── Legacy FAQ class fallback (v3 uses .faq-btn) ── */
(function(){
  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var ans = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('.faq-btn').forEach(function(b){
        b.setAttribute('aria-expanded','false');
        var a = document.getElementById(b.getAttribute('aria-controls'));
        if(a) a.classList.remove('open');
      });
      if(!open){ btn.setAttribute('aria-expanded','true'); if(ans) ans.classList.add('open'); }
    });
  });
  /* Legacy form ID fallback */
  var form = document.getElementById('catering-form');
  if(!form) return;
  form.id = 'cat-form'; // alias
})();
