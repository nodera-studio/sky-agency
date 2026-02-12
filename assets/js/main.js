/* Agentia Sky — Vanilla JS (replaces jQuery + webflow.js)
   ~3KB minified — handles: nav, page loader, FAQ, contact form,
   testimonials slider, intersection-observer animations */

(function () {
  'use strict';

  /* ===== MOBILE NAV TOGGLE ===== */
  function initNav() {
    var toggle = document.querySelector('.menu-button.w-nav-button');
    var menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove('w--open');
      toggle.classList.remove('w--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('w--open');
      toggle.classList.toggle('w--open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link inside it is clicked
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('w--open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ===== PAGE LOADER (index.html only, once per session) ===== */
  function initLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;

    var logo = document.querySelector('.loader-logo');
    if (logo) logo.classList.add('zoom-out');
    requestAnimationFrame(function () {
      setTimeout(function () {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 200);
      setTimeout(function () {
        if (loader && loader.parentNode) loader.remove();
        try { sessionStorage.setItem('sky_loaded', '1'); } catch (e) {}
      }, 700);
    });
  }

  /* ===== FAQ ACCORDION (contact.html) ===== */
  function initFAQ() {
    var items = document.querySelectorAll('.tab-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var top = item.querySelector('.tab-top');
      if (!top) return;
      top.style.cursor = 'pointer';
      top.setAttribute('role', 'button');
      top.setAttribute('aria-expanded', 'false');

      top.addEventListener('click', function () {
        var isOpen = item.classList.toggle('active');
        top.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  /* ===== CONTACT FORM SUCCESS CHECK ===== */
  function initContactSuccess() {
    if (new URLSearchParams(window.location.search).get('success') !== 'true') return;
    var form = document.getElementById('contact-form');
    var msg = document.getElementById('form-success');
    if (form) form.style.display = 'none';
    if (msg) msg.style.display = 'block';
  }

  /* ===== INTERSECTION OBSERVER — SCROLL ANIMATIONS ===== */
  function initScrollAnimations() {
    var selectors = ['.cta-illustration', '.svc-illus', '.sp-illus', '.ab-illus'];
    var els = [];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { els.push(el); });
    });
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ===== TESTIMONIALS SLIDER (about.html) ===== */
  function initTestiSlider() {
    var slides = document.querySelector('.testi-slides');
    var allSlides = document.querySelectorAll('.testi-slide');
    var dotsWrap = document.querySelector('.testi-dots');
    var prevBtn = document.querySelector('.testi-prev');
    var nextBtn = document.querySelector('.testi-next');
    if (!slides || !allSlides.length || !dotsWrap) return;

    var total = allSlides.length;
    var current = 0;

    // Build dots
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.dataset.idx = i;
      dot.addEventListener('click', function () { goTo(parseInt(this.dataset.idx)); });
      dotsWrap.appendChild(dot);
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, total - 1));
      slides.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsWrap.querySelectorAll('.testi-dot').forEach(function (d, j) {
        d.classList.toggle('active', j === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
  }

  /* ===== BOOT ===== */
  // Run non-load-dependent code on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initFAQ();
    initContactSuccess();
    initScrollAnimations();
    initTestiSlider();
  });

  // Page loader runs on window load
  window.addEventListener('load', initLoader);
})();
