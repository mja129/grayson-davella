(function () {
  'use strict';

  // ── Smooth scroll for anchor links (JS-enhanced; CSS scroll-behavior is the fallback) ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length < 2) return; // bare "#" — no target
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  });

  // ── Suppress transitions on resize to prevent nav flash at breakpoint ──
  var resizeTimer;
  window.addEventListener('resize', function () {
    document.body.classList.add('is-resizing');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.body.classList.remove('is-resizing');
    }, 150);
  }, { passive: true });

  // ── Header scroll shadow ──
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  // ── Hamburger menu toggle ──
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav   = document.getElementById('site-nav');

  function openNav() {
    header.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    header.classList.contains('nav-open') ? closeNav() : openNav();
  }

  if (navToggle) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleNav();
    });

    // Close when a nav link is clicked
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeNav(); });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) closeNav();
    });
  }

  // ── Active nav link via IntersectionObserver ──
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('#site-header nav a');

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  // ── Fade-in on scroll ──
  var fadeTargets = document.querySelectorAll(
    '.timeline-item, .edu-item, .accomplishments-block, .summary-text, .contact-link'
  );

  if ('IntersectionObserver' in window) {
    fadeTargets.forEach(function (el) { el.classList.add('fade-in'); });

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    fadeTargets.forEach(function (el) { fadeObserver.observe(el); });
  }
  // If IntersectionObserver unsupported, elements stay fully visible (no fade-in class added)

}());
