/* Nicolas & Cecilia — Wedding Website JS */

/* ─────────────────────────────────────────────────────────
   Fade-in CSS injected once so elements animate on scroll
   ───────────────────────────────────────────────────────── */
(function () {
  var style = document.createElement('style');
  style.textContent =
    '.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }' +
    '.fade-in.visible { opacity: 1; transform: translateY(0); }';
  document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────────────────────
     MOBILE NAV — click toggle + hover-to-open + hamburger→X
     ───────────────────────────────────────────────────────── */
  const siteNav  = document.querySelector('.site-nav');
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  function openNav() {
    navLinks.classList.add('open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    navLinks.classList.remove('open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && navLinks && siteNav) {

    /* Click to toggle */
    toggle.addEventListener('click', function () {
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });

    /* Hover to open — ONLY on pointer devices (not touch screens).
       On touch, mouseenter fires before click which causes the double-tap bug. */
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canHover) {
      let hoverTimer;
      toggle.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        openNav();
      });
      /* Keep open while hovering anywhere inside the nav */
      siteNav.addEventListener('mouseleave', function () {
        hoverTimer = setTimeout(closeNav, 200);
      });
      siteNav.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
      });
    }

    /* Close when a link is tapped/clicked */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeNav();
      });
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ─────────────────────────────────────────────────────────
     ACTIVE NAV LINK — highlight current page
     ───────────────────────────────────────────────────────── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─────────────────────────────────────────────────────────
     HERO PARALLAX FOLD
     — background image moves slower than content (parallax)
     — hero text content fades + drifts upward as you scroll
     — effect reverses naturally when you scroll back up
     ───────────────────────────────────────────────────────── */
  const hero        = document.querySelector('.hero');
  const heroContent = hero ? hero.querySelector('.hero-content') : null;

  if (hero && heroContent) {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    /* On touch devices keep background-attachment: scroll for performance */
    function applyHeroParallax() {
      const sy         = window.scrollY;
      const heroH      = hero.offsetHeight;
      const rawProgress = sy / (heroH * 0.65);          /* reaches 1 at 65% of hero height */
      const progress   = Math.max(0, Math.min(1, rawProgress));

      /* Background parallax — image moves at ~40% of scroll speed */
      hero.style.backgroundPositionY = 'calc(50% + ' + (sy * 0.4) + 'px)';

      /* Content: gentle upward drift + fade */
      heroContent.style.transform = 'translateY(' + (sy * 0.18) + 'px)';
      heroContent.style.opacity   = String(Math.max(0, 1 - progress * 1.15));
    }

    if (!isTouchDevice) {
      /* Desktop / laptop: full parallax */
      window.addEventListener('scroll', applyHeroParallax, { passive: true });
      applyHeroParallax(); /* apply immediately in case page is not at top */
    } else {
      /* Touch: just fade the content (no background parallax for perf) */
      function applyHeroFadeMobile() {
        const sy       = window.scrollY;
        const heroH    = hero.offsetHeight;
        const progress = Math.max(0, Math.min(1, sy / (heroH * 0.5)));
        heroContent.style.opacity = String(Math.max(0, 1 - progress * 1.4));
      }
      window.addEventListener('scroll', applyHeroFadeMobile, { passive: true });
    }
  }

  /* ─────────────────────────────────────────────────────────
     FADE-IN ON SCROLL — reveal .fade-in elements
     ───────────────────────────────────────────────────────── */
  var observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

});
