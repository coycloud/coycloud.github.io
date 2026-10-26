/* Coy Exterior Cleaning — Meta (Facebook/Instagram) Pixel.
   Paste your Pixel ID below (Meta Events Manager > Data sources > your pixel > Settings).
   It's the 15–16 digit number, e.g. '123456789012345'. Leave it blank to keep the pixel off.

   What it tracks:
   - PageView  — every page visit
   - Contact   — taps/clicks on any phone number
   - Lead      — a quote form sent successfully (fired from lead-form.js) */
(function () {
  'use strict';
  var PIXEL_ID = '1627784318743810';

  if (!PIXEL_ID) return;

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (a) fbq('track', 'Contact');
  });
})();
