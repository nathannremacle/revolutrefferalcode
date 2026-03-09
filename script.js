(function () {
  'use strict';

  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  var navLinks = nav ? nav.querySelectorAll('a') : [];

  function trapFocus(element) {
    var focusable = element.querySelectorAll('a[href], button:not([disabled])');
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    return function (e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('is-open');
      document.body.style.overflow = expanded ? '' : 'hidden';
      if (!expanded && navLinks.length) navLinks[0].focus();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
        menuToggle.focus();
      }
    });

    var trap = trapFocus(nav);
    nav.addEventListener('keydown', function (e) {
      if (nav.classList.contains('is-open')) trap(e);
    });
  }

  // FAQ accordion (A11y: aria-expanded, hidden)
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-faq');
      var panel = document.getElementById(id);
      if (!panel) return;
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isOpen);
      panel.hidden = isOpen;
    });
  });

  // Optional: track CTA clicks (replace with your analytics)
  document.querySelectorAll('a[href*="revolut.com/referral"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click_referral', { event_category: 'CTA', event_label: 'referral_link' });
      }
    });
  });
})();
