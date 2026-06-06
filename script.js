(function () {
  'use strict';

  // ── Suppress transitions during resize ──
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

  if (navToggle) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      header.classList.contains('nav-open') ? closeNav() : openNav();
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeNav(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) closeNav();
    });
  }

  // ── Active nav link (based on current page filename) ──
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#site-nav a').forEach(function (link) {
    var linkFile = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkFile === currentFile);
  });

  // ── Page fade-out on navigation ──
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    // Skip: anchors, external URLs, mailto/tel, links that open in a new tab
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto:') || href.startsWith('tel:') || link.target) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function () {
      window.location.href = href;
    }, 280);
  });

  // ── Contact form → mailto ──
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = contactForm.querySelector('[name="name"]').value.trim();
      var email   = contactForm.querySelector('[name="email"]').value.trim();
      var subject = contactForm.querySelector('[name="subject"]').value.trim();
      var message = contactForm.querySelector('[name="message"]').value.trim();

      var body = 'From: ' + name + ' <' + email + '>\n\n' + message;
      window.location.href = 'mailto:graysondavella3@gmail.com'
        + '?subject=' + encodeURIComponent(subject || '(No subject)')
        + '&body='    + encodeURIComponent(body);
    });
  }

}());
