(function () {
  'use strict';

  // Mobile-Navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');

  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Aktiven Menüpunkt beim Scrollen markieren
  var navLinks = nav.querySelectorAll('a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    navLinks.forEach(function (l) {
      var target = document.querySelector(l.getAttribute('href'));
      if (target) observer.observe(target);
    });
  }

  // Countdown zum nächsten Heimspiel
  var countdown = document.getElementById('countdown');
  if (countdown) {
    var kickoff = new Date(countdown.dataset.kickoff).getTime();
    var units = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]')
    };

    var tick = function () {
      var diff = Math.max(0, kickoff - Date.now());
      var mins = Math.floor(diff / 60000);
      units.days.textContent = Math.floor(mins / 1440);
      units.hours.textContent = String(Math.floor((mins % 1440) / 60)).padStart(2, '0');
      units.minutes.textContent = String(mins % 60).padStart(2, '0');
    };
    tick();
    setInterval(tick, 30000);
  }

  // Spielplan-Filter
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  var rows = document.querySelectorAll('.fixtures tbody tr');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.dataset.filter;
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      rows.forEach(function (row) {
        row.classList.toggle('hidden', filter !== 'alle' && row.dataset.team !== filter);
      });
    });
  });

  // Kontaktformular (Validierung im Browser; Versand erfordert ein Backend)
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (input) {
      var ok = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';
      if (ok && input.type === 'email') {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      }
      input.closest('.field').classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = 'Bitte alle Pflichtfelder korrekt ausfüllen.';
      status.className = 'form-status error';
      return;
    }

    // TODO: Formular an Backend oder Formular-Dienst übermitteln
    status.textContent = 'Danke für deine Nachricht. Wir melden uns in Kürze.';
    status.className = 'form-status ok';
    form.reset();
  });

  // Jahr im Footer
  document.getElementById('year').textContent = new Date().getFullYear();
})();
