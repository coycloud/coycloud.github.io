/* Coy Exterior Cleaning — multi-step ("breadcrumb") lead form.
   Mount with: <div data-lead-form data-service="Windows" data-city="Palo Alto"></div>
   Optional:   data-details="1" adds an "anything else?" box on the last step.
   Leads are emailed through Web3Forms (same key as before). */
(function () {
  'use strict';

  var WEB3FORMS_KEY = '62897e4a-224e-4a36-a005-62fe6b1bacce';
  var PHONE_TEL = '7739974886';
  var PHONE_TXT = '(773) 997-4886';

  var ICONS = {
    Windows: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M12 3v18M3 12h18"/>',
    Gutters: '<path d="M2 9l10-6 10 6"/><path d="M3 11h18v3H3z"/><path d="M18 14v6"/>',
    'Pressure Washing': '<path d="M3 20h18"/><path d="M6 16l3-9h3"/><path d="M12 7h4l2 3"/><path d="M14 12l-1 3M17 12l1 3M20 11l2 2"/>',
    'Siding / Soft Wash': '<path d="M3 21V10l9-7 9 7v11z"/><path d="M3 14h18M3 17.5h18"/>',
    'Roof Cleaning': '<path d="M2 13l10-8 10 8"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/>',
    Other: '<circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'
  };
  var SERVICES = Object.keys(ICONS);
  var STORIES = ['1 story', '2 stories', '3+ stories', 'Not sure'];
  var TOTAL = 4;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function track(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); }
  var uid = 0;

  function build(root) {
    var id = 'lf' + (++uid);
    var city = root.getAttribute('data-city') || '';
    var preService = root.getAttribute('data-service') || '';
    var withDetails = root.getAttribute('data-details') === '1';
    var state = { step: 1, services: [], stories: '' };
    if (preService && ICONS[preService]) state.services.push(preService);

    root.classList.add('lf');
    root.setAttribute('id', root.id || 'lead-form');
    root.innerHTML =
      '<form novalidate>' +
      '<div class="lf-top"><span class="lf-count" aria-live="polite"></span><button type="button" class="lf-back" hidden>← Back</button></div>' +
      '<div class="lf-bar" aria-hidden="true">' + '<span></span>'.repeat(TOTAL) + '</div>' +

      '<fieldset class="lf-step" data-step="1"><legend class="lf-q" tabindex="-1">What can we clean for you?</legend>' +
      '<p class="lf-sub">Pick all that apply.</p><div class="lf-tiles">' +
      SERVICES.map(function (s) {
        return '<button type="button" class="lf-tile" data-svc="' + esc(s) + '" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[s] + '</svg>' + esc(s) + '</button>';
      }).join('') +
      '</div><p class="lf-err" data-err="1"></p><button type="button" class="lf-next" data-next>Continue →</button></fieldset>' +

      '<fieldset class="lf-step" data-step="2"><legend class="lf-q" tabindex="-1">How many stories is your home?</legend>' +
      '<p class="lf-sub">Helps us bring the right ladders and poles.</p><div class="lf-opts two" role="radiogroup">' +
      STORIES.map(function (s) { return '<button type="button" class="lf-opt" role="radio" aria-checked="false" data-stories="' + esc(s) + '"><span class="lf-dot"></span>' + esc(s) + '</button>'; }).join('') +
      '</div></fieldset>' +


      '<fieldset class="lf-step" data-step="3"><legend class="lf-q" tabindex="-1">Where is the home?</legend>' +
      '<p class="lf-sub">We\'ll use this to price your job. We never share it.</p>' +
      '<label class="lf-field"><span>Service address</span><input type="text" name="address" autocomplete="street-address" placeholder="' + esc(city ? '123 Main St, ' + city : '123 Main St, City') + '" /></label>' +
      '<p class="lf-err" data-err="3"></p><button type="submit" class="lf-next">Continue →</button></fieldset>' +

      '<fieldset class="lf-step" data-step="4"><legend class="lf-q" tabindex="-1">Where should we send your quote?</legend>' +
      '<p class="lf-sub">Last step. We usually reply the same day.</p>' +
      '<label class="lf-field"><span>Your name</span><input type="text" name="name" autocomplete="name" placeholder="Jane Smith" /></label>' +
      '<label class="lf-field"><span>Phone</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="(555) 123-4567" /></label>' +
      '<label class="lf-field"><span>Email <i>(optional)</i></span><input type="email" name="email" autocomplete="email" placeholder="jane@example.com" /></label>' +
      (withDetails ? '<label class="lf-field"><span>Anything else? <i>(optional)</i></span><textarea name="details" placeholder="Gate code, special requests, preferred timing…"></textarea></label>' : '') +
      '<input type="checkbox" name="botcheck" class="lf-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
      '<p class="lf-err" data-err="4"></p><button type="submit" class="lf-next lf-submit">Get My Free Quote →</button></fieldset>' +

      '<div class="lf-done" role="status"><div class="lf-check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
      '<h3>Thanks<span class="lf-fname"></span>!</h3><p>We got your request and will reach out today with your quote. Need us sooner? Call <a href="tel:' + PHONE_TEL + '">' + PHONE_TXT + '</a>.</p></div>' +

      '<div class="lf-foot"><span>Free quote · No obligation · No spam</span><span>Prefer to talk? <a href="tel:' + PHONE_TEL + '">' + PHONE_TXT + '</a></span></div>' +
      '</form>';

    var form = root.querySelector('form');
    var F = form.elements;
    var steps = root.querySelectorAll('.lf-step');
    var bars = root.querySelectorAll('.lf-bar span');
    var count = root.querySelector('.lf-count');
    var back = root.querySelector('.lf-back');
    var $ = function (sel) { return root.querySelector(sel); };
    var started = false;

    function err(n, msg) { var e = root.querySelector('[data-err="' + n + '"]'); if (e) e.textContent = msg || ''; }

    function syncSelections() {
      root.querySelectorAll('[data-svc]').forEach(function (b) { b.setAttribute('aria-pressed', state.services.indexOf(b.getAttribute('data-svc')) > -1 ? 'true' : 'false'); });
      root.querySelectorAll('[data-stories]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-stories') === state.stories ? 'true' : 'false'); });
    }

    function go(n, focus) {
      state.step = n;
      steps.forEach(function (s) { s.classList.toggle('active', +s.getAttribute('data-step') === n); });
      bars.forEach(function (b, i) { b.classList.toggle('on', i < n); });
      count.textContent = 'Step ' + n + ' of ' + TOTAL;
      back.hidden = n === 1;
      syncSelections();
      if (focus) {
        var r = root.getBoundingClientRect();
        if (r.top < 0 || r.top > window.innerHeight * 0.6) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var active = root.querySelector('.lf-step.active');
        var input = active.querySelector('input:not(.lf-hp)');
        if (input && !input.value) input.focus({ preventScroll: true });
        else active.querySelector('.lf-q').focus({ preventScroll: true });
      }
      track('lead_form_step', { step: n, page_city: city || 'none' });
    }

    function start() { if (!started) { started = true; track('lead_form_start', { page_city: city || 'none' }); } }

    function next() {
      var n = state.step;
      if (n === 1 && !state.services.length) return err(1, 'Choose at least one service.');
      if (n === 2 && !state.stories) return;
      if (n === 3) {
        var a = F.address.value.trim();
        if (a.length < 5) { F.address.classList.add('bad'); return err(3, 'Please enter the service address.'); }
      }
      err(n, '');
      if (n < TOTAL) go(n + 1, true); else submit();
    }

    root.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !root.contains(t)) return;
      start();
      if (t.hasAttribute('data-svc')) {
        var s = t.getAttribute('data-svc'), i = state.services.indexOf(s);
        if (i > -1) state.services.splice(i, 1); else state.services.push(s);
        err(1, ''); syncSelections();
      } else if (t.hasAttribute('data-stories')) {
        state.stories = t.getAttribute('data-stories'); syncSelections(); setTimeout(next, 220);
      } else if (t.hasAttribute('data-next')) {
        next();
      } else if (t === back) {
        go(Math.max(1, state.step - 1), true);
      }
    });
    root.addEventListener('input', function (e) { if (e.target.classList) e.target.classList.remove('bad'); start(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); next(); });

    function submit() {
      var name = F.name.value.trim(), phone = F.phone.value.trim(), email = F.email.value.trim();
      var bad = false;
      if (name.length < 2) { F.name.classList.add('bad'); bad = true; }
      if (phone.replace(/\D/g, '').length < 10) { F.phone.classList.add('bad'); bad = true; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { F.email.classList.add('bad'); bad = true; }
      if (bad) return err(4, 'Please add your name and a valid phone number' + (email ? ' and email.' : '.'));
      if (F.botcheck.checked) return;
      err(4, '');

      var btn = root.querySelector('.lf-submit'), label = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = 'Sending…';

      var fd = new FormData();
      fd.append('access_key', WEB3FORMS_KEY);
      fd.append('subject', 'New Quote Request: ' + state.services.join(', ') + (city ? ' (' + city + ')' : ''));
      fd.append('from_name', 'Coy Website');
      fd.append('name', name);
      fd.append('phone', phone);
      if (email) { fd.append('email', email); fd.append('replyto', email); }
      fd.append('address', F.address.value.trim());
      fd.append('services', state.services.join(', '));
      fd.append('stories', state.stories);
      if (F.details && F.details.value.trim()) fd.append('details', F.details.value.trim());
      fd.append('page', location.pathname.split('/').pop() || 'index.html');

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then(function (r) { return r.json().then(function (j) { return r.ok && j.success; }); })
        .then(function (ok) {
          if (!ok) throw new Error('rejected');
          $('.lf-fname').textContent = ', ' + name.split(' ')[0];
          root.classList.add('sent');
          root.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.coyConversion) window.coyConversion('quoteLead');
          track('generate_lead', { services: state.services.join(', ') });
        })
        .catch(function () {
          btn.disabled = false; btn.innerHTML = label;
          err(4, 'Sorry, that didn\'t go through. Please try again or call ' + PHONE_TXT + '.');
        });
    }

    root._lf = {
      pickWindows: function () {
        if (state.services.indexOf('Windows') < 0) state.services.push('Windows');
        go(state.stories ? 3 : 2, false);
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Prefill from the URL (?service=&name=&address=)
    var q = new URLSearchParams(location.search);
    var qs = q.get('service'); if (qs && ICONS[qs] && state.services.indexOf(qs) < 0) state.services.push(qs);
    if (q.get('name')) F.name.value = q.get('name');
    if (q.get('address')) F.address.value = q.get('address');
    if (q.get('plan') && state.services.indexOf('Windows') < 0) state.services.push('Windows');
    go(1, false);
  }

  function init() {
    var roots = document.querySelectorAll('[data-lead-form]');
    roots.forEach(build);
    if (!roots.length) return;
    // "Get your quote" buttons on the window cleaning cards: jump to this page's form with Windows selected
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="quote.html?plan="]');
      if (!a) return;
      e.preventDefault();
      roots[0]._lf.pickWindows();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
