(function () {
  var btn = document.querySelector('.nav__btn');
  var mega = document.getElementById('mega');
  if (btn && mega) {
    var item = btn.parentElement, timer, hoverAt = 0;
    function set(open) { btn.setAttribute('aria-expanded', open); mega.classList.toggle('is-open', open); }
    btn.addEventListener('click', function () { if (Date.now() - hoverAt < 500) { set(true); return; } set(btn.getAttribute('aria-expanded') !== 'true'); });
    item.addEventListener('mouseenter', function () { clearTimeout(timer); if (matchMedia('(hover:hover)').matches && btn.getAttribute('aria-expanded') !== 'true') { hoverAt = Date.now(); set(true); } });
    item.addEventListener('mouseleave', function () { timer = setTimeout(function () { set(false); }, 180); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) set(false); });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) set(false); });
  }
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    function setM(open) {
      if (open) mnav.style.top = Math.max(0, burger.closest('.hdr').getBoundingClientRect().bottom) + 'px';
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mnav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      burger.innerHTML = open
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    }
    burger.addEventListener('click', function () { setM(burger.getAttribute('aria-expanded') !== 'true'); });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setM(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('is-open')) { setM(false); burger.focus(); } });
    matchMedia('(min-width:1061px)').addEventListener('change', function (m) { if (m.matches) setM(false); });
  }
})();

/* Smooth scroll-in for photos and cards (skipped for reduced-motion visitors) */
(function () {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.bfd-svc__grid > li, .bfd-doc__fig, .bfd-new__photo, .bfd-team li, .bfd-vid__grid > li, .bfd-loc__card');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  Array.prototype.forEach.call(els, function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el) % 4;
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--d', i * 80 + 'ms');
    io.observe(el);
  });
  document.documentElement.classList.add('js-motion');
})();

/* Click-to-load patient videos: nothing is requested from YouTube until a visitor presses play */
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.bfd-vid__card');
    if (!b) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.getAttribute('data-yt')) + '?autoplay=1&rel=0&modestbranding=1';
    f.title = b.getAttribute('data-title') || 'Patient video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    b.parentNode.replaceChild(f, b);
    f.focus();
  });
})();

/* Ken Burns for blog <img> photos: wrap so the zoom stays inside rounded corners */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  Array.prototype.forEach.call(document.querySelectorAll('img.post__img'), function (img) {
    var w = document.createElement('span');
    w.className = 'kb-wrap';
    img.parentNode.insertBefore(w, img);
    w.appendChild(img);
  });
})();

/* Scroll-linked zoom: each photo zooms in as it travels up the screen and eases back if you scroll up */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = Array.prototype.slice.call(document.querySelectorAll('.bfd-doc__photo, .bfd-new__photo, .bfd-cta__photo, .bfd-tour__photo, .phero__img, .kb-wrap .post__img'));
  if (!els.length) return;
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight || 800;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var p = (vh - r.top) / (vh + r.height);
      el.style.setProperty('--kb-p', Math.max(0, Math.min(1, p)).toFixed(3));
    });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  update();
})();
