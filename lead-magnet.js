/* Coy Exterior Cleaning — free guide lead magnet.
   Mount with: <div data-lead-magnet></div>   (optional data-city="Palo Alto")
   Visitor enters name + email (+ optional phone) → you get the lead by email (Web3Forms)
   → the guide PDF unlocks for download. */
(function () {
  'use strict';

  var WEB3FORMS_KEY = '62897e4a-224e-4a36-a005-62fe6b1bacce';
  var GUIDE_URL = 'bay-area-home-exterior-care-guide.pdf';
  var COVER_URL = 'guide-cover.jpg';

  function track(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); }

  function build(root) {
    var city = root.getAttribute('data-city') || '';
    var quoteHref = document.getElementById('quote') ? '#quote' : (document.getElementById('get-quote') ? '#get-quote' : 'quote.html');
    root.classList.add('lm');
    root.innerHTML =
      '<div class="lm-cover"><img src="' + COVER_URL + '" alt="Cover of the free Bay Area Home Exterior Care Guide" width="408" height="528" loading="lazy" /><span class="lm-badge">FREE</span></div>' +
      '<div class="lm-body">' +
        '<span class="lm-kicker">Free download</span>' +
        '<h2 class="lm-h">The Bay Area Home Exterior <em>Care Guide.</em></h2>' +
        '<p class="lm-lead">A season-by-season checklist for ' + (city ? city + ' homes' : 'Bay Area homes') + ': when to clean windows, gutters and hardscape, how to do it yourself, and when to call a pro.</p>' +
        '<ul class="lm-list"><li>12-month care calendar timed to Bay Area rain</li><li>4 printable seasonal checklists</li><li>DIY how-tos for streak-free glass and clear gutters</li><li>Pressure wash vs. soft wash, surface by surface</li></ul>' +
        '<form class="lm-form" novalidate>' +
          '<div class="lm-row">' +
            '<input type="text" name="name" autocomplete="name" placeholder="First name" aria-label="First name" />' +
            '<input type="email" name="email" autocomplete="email" placeholder="Email address" aria-label="Email address" />' +
          '</div>' +
          '<input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="Phone (optional, for a free quote)" aria-label="Phone (optional)" />' +
          '<input type="checkbox" name="botcheck" class="lm-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
          '<button type="submit" class="lm-btn">Send Me the Free Guide →</button>' +
          '<p class="lm-err" role="alert"></p>' +
          '<p class="lm-fine">Instant download, 6-page PDF. No spam, ever.</p>' +
        '</form>' +
        '<div class="lm-done" role="status">' +
          '<h3>It\'s yours<span class="lm-fname"></span>!</h3>' +
          '<p>Your guide is ready. We\'ve also saved your details so we can follow up with seasonal reminders.</p>' +
          '<a class="lm-btn lm-dl" href="' + GUIDE_URL + '" download target="_blank" rel="noopener">Download the Guide (PDF) ↓</a>' +
          '<p class="lm-fine">Rather skip the ladder? <a href="' + quoteHref + '">Get a free quote →</a></p>' +
        '</div>' +
      '</div>';

    var form = root.querySelector('form'), F = form.elements;
    var errEl = root.querySelector('.lm-err'), started = false;
    form.addEventListener('input', function (e) {
      e.target.classList.remove('bad');
      if (!started) { started = true; track('guide_form_start'); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = F.name.value.trim(), email = F.email.value.trim(), phone = F.phone.value.trim(), bad = [];
      if (name.length < 2) { F.name.classList.add('bad'); bad.push('your name'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { F.email.classList.add('bad'); bad.push('a valid email'); }
      if (phone && phone.replace(/\D/g, '').length < 10) { F.phone.classList.add('bad'); bad.push('a full phone number'); }
      if (bad.length) { errEl.textContent = 'Please add ' + bad.join(' and ') + '.'; return; }
      if (F.botcheck.checked) return;
      errEl.textContent = '';

      var btn = form.querySelector('.lm-btn'), label = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = 'Sending…';
      var fd = new FormData();
      fd.append('access_key', WEB3FORMS_KEY);
      fd.append('subject', 'New Guide Download: ' + name + (city ? ' (' + city + ')' : ''));
      fd.append('from_name', 'Coy Website');
      fd.append('lead_type', 'Free guide download (Home Exterior Care Guide)');
      fd.append('name', name);
      fd.append('email', email);
      fd.append('replyto', email);
      if (phone) fd.append('phone', phone);
      fd.append('page', location.pathname.split('/').pop() || 'index.html');

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then(function (r) { return r.json().then(function (j) { return r.ok && j.success; }); })
        .then(function (ok) {
          if (!ok) throw new Error('rejected');
          root.querySelector('.lm-fname').textContent = ', ' + name.split(' ')[0];
          root.classList.add('sent');
          if (window.coyConversion) window.coyConversion('guideLead');
          track('generate_lead', { lead_type: 'guide_download' });
        })
        .catch(function () {
          btn.disabled = false; btn.innerHTML = label;
          errEl.textContent = 'Sorry, that didn\'t go through. Please try again.';
        });
    });
  }

  function init() { document.querySelectorAll('[data-lead-magnet]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
