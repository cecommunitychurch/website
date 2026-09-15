/* ============================================================
   CECC — ChurchSuite event rendering
   Loads data/events.json and renders cards into #events-container.
   Also exposes window.CECCEvents for embedding on other pages.
   ============================================================ */

(function () {
  'use strict';

  var CATEGORY = {
    sunday:    { icon: '⛪', cls: '',      label: 'Sunday'     },
    childrens: { icon: '⭐', cls: 'sage',  label: "Children's" },
    toddler:   { icon: '🌈', cls: 'tan',   label: 'Toddlers'   },
    prayer:    { icon: '🙏', cls: 'taupe', label: 'Prayer'     },
    general:   { icon: '📅', cls: 'taupe', label: 'Event'      },
  };

  // Tint colours matching the CSS icon classes
  var TINTS = {
    '':      'rgba(216,97,60,0.10)',
    'sage':  'rgba(177,197,164,0.20)',
    'tan':   'rgba(194,169,144,0.20)',
    'taupe': 'rgba(207,202,190,0.30)',
  };

  // All dynamic values placed into innerHTML are passed through esc().
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fmtDate(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function fmtTime(hhmm) {
    if (!hhmm) return '';
    var parts = hhmm.split(':').map(Number);
    var h = parts[0], m = parts[1];
    var suffix = h < 12 ? 'am' : 'pm';
    var h12 = h % 12 || 12;
    return m === 0 ? h12 + suffix : h12 + ':' + String(m).padStart(2, '0') + suffix;
  }

  function safeColour(c) {
    return /^#[0-9a-fA-F]{3,8}$/.test(String(c || '')) ? c : '';
  }

  function safeSignupUrl(u) {
    return (typeof u === 'string' && u.indexOf('https://cecommunitychurch.churchsuite.com/') === 0) ? u : '';
  }

  // ---- Modal -------------------------------------------

  var eventMap   = {};   // id → event object, populated by renderCard
  var modalEl    = null;
  var prevFocus  = null;

  function buildModal() {
    if (modalEl) return modalEl;

    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'cecc-modal-title');

    var panel = document.createElement('div');
    panel.className = 'modal';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeModal);

    var imgDiv = document.createElement('div');
    imgDiv.className = 'modal-img';

    var body = document.createElement('div');
    body.className = 'modal-body';

    var whenP  = document.createElement('p');  whenP.className  = 'modal-when';
    var titleH = document.createElement('h3'); titleH.id        = 'cecc-modal-title';
    var descP  = document.createElement('p');  descP.className  = 'modal-desc';
    var locP   = document.createElement('p');  locP.className   = 'modal-location';

    var actions = document.createElement('div');
    actions.className = 'modal-actions';
    var contactLink = document.createElement('a');
    contactLink.href = 'mailto:info@cecommunitychurch.com';
    contactLink.className = 'btn btn-primary';
    contactLink.textContent = 'Get in touch';
    actions.appendChild(contactLink);

    body.append(whenP, titleH, descP, locP, actions);
    panel.append(closeBtn, imgDiv, body);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    // Close on backdrop click
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });

    // Focus trap inside panel
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = panel.querySelectorAll('button:not([disabled]), a[href]');
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    modalEl = backdrop;
    return backdrop;
  }

  function openModal(ev) {
    var el  = buildModal();
    var cat = CATEGORY[ev.category];

    // Header — image or tinted colour block
    var imgDiv = el.querySelector('.modal-img');
    imgDiv.textContent = '';
    imgDiv.removeAttribute('style');
    if (ev.imageUrl) {
      var img = document.createElement('img');
      img.src = ev.imageUrl;
      img.alt = '';
      img.loading = 'lazy';
      imgDiv.style.background = 'var(--col-line)';
      imgDiv.appendChild(img);
    } else {
      var colour = safeColour(ev.categoryColour);
      var bg = cat ? (TINTS[cat.cls] || TINTS.taupe)
                   : (colour ? colour + '26' : TINTS.taupe);
      imgDiv.style.background = bg;
      imgDiv.textContent = cat ? cat.icon : '📅';
    }

    // Body — textContent only (no innerHTML) for user-supplied strings
    var start   = fmtTime(ev.startTime);
    var end     = fmtTime(ev.endTime);
    var timeStr = start ? (end ? start + ' – ' + end : start) : '';
    el.querySelector('.modal-when').textContent =
      fmtDate(ev.date) + (timeStr ? '  ·  ' + timeStr : '');
    el.querySelector('#cecc-modal-title').textContent = ev.title || '';
    el.querySelector('.modal-desc').textContent = ev.description || '';

    var locP = el.querySelector('.modal-location');
    if (ev.location) {
      locP.textContent = '📍  ' + ev.location;
      locP.style.display = '';
    } else {
      locP.style.display = 'none';
    }

    // Action button — sign-up link when the event has public sign-up, else mailto.
    // The button is reused across events, so reset both branches every open.
    var contactLink = el.querySelector('.modal-actions a');
    var signup = safeSignupUrl(ev.signupUrl);
    if (signup) {
      contactLink.href = signup;
      contactLink.textContent = 'Sign up';
      contactLink.target = '_blank';
      contactLink.rel = 'noopener';
    } else {
      contactLink.href = 'mailto:info@cecommunitychurch.com';
      contactLink.textContent = 'Get in touch';
      contactLink.removeAttribute('target');
      contactLink.removeAttribute('rel');
    }

    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    prevFocus = document.activeElement;
    el.querySelector('.modal-close').focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
    if (prevFocus) { prevFocus.focus(); prevFocus = null; }
  }

  // Attach delegated click+keyboard handlers once per container.
  function attachCardClicks(container) {
    if (container._eventsAttached) return;
    container._eventsAttached = true;
    container.addEventListener('click', function (e) {
      var card = e.target.closest('.event-card[data-event-id]');
      if (!card) return;
      var ev = eventMap[card.dataset.eventId];
      if (ev) openModal(ev);
    });
    container.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.event-card[data-event-id]');
      if (!card) return;
      e.preventDefault();
      var ev = eventMap[card.dataset.eventId];
      if (ev) openModal(ev);
    });
  }

  // ---- Card rendering ----------------------------------

  function renderCard(ev) {
    eventMap[ev.id] = ev;

    var cat     = CATEGORY[ev.category];
    var start   = fmtTime(ev.startTime);
    var end     = fmtTime(ev.endTime);
    var timeStr = start ? (end ? start + ' – ' + end : start) : '';
    var whenStr = fmtDate(ev.date) + (timeStr ? '  ·  ' + timeStr : '');
    var locStr  = ev.location ? '📍  ' + esc(ev.location) : '';

    var headerInner, headerStyle;
    if (ev.imageUrl) {
      headerInner = '<img src="' + esc(ev.imageUrl) + '" alt="" loading="lazy">';
      headerStyle = 'background:var(--col-line)';
    } else {
      var icon   = cat ? cat.icon : '📅';
      var colour = safeColour(ev.categoryColour);
      var bg     = cat ? (TINTS[cat.cls] || TINTS.taupe)
                       : (colour ? colour + '26' : TINTS.taupe);
      headerInner = icon;
      headerStyle = 'background:' + bg;
    }

    var labelHtml = (!cat && ev.categoryLabel)
      ? '<p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--col-muted);margin-bottom:0.25rem;">' + esc(ev.categoryLabel) + '</p>'
      : '';

    return '<div class="event-card" data-event-id="' + esc(String(ev.id)) + '" tabindex="0" role="button" aria-label="' + esc(ev.title) + ', ' + esc(fmtDate(ev.date)) + '">' +
      '<div class="event-card-header" style="' + headerStyle + '" aria-hidden="true">' + headerInner + '</div>' +
      '<p class="event-when">' + whenStr + '</p>' +
      labelHtml +
      '<h4>' + esc(ev.title) + '</h4>' +
      (locStr ? '<p class="event-meta">' + locStr + '</p>' : '') +
      '</div>';
  }


  // ---- Structured data (SEO) ---------------------------
  // Emits schema.org Event JSON-LD for the ChurchSuite feed so Google can
  // surface dated event rich results. Written at runtime; Google renders JS
  // before extracting structured data. type="application/ld+json" is a data
  // block, not executable script, so the script-src 'self' CSP allows it.

  var SITE = 'https://cecommunitychurch.com';

  function isVirtual(loc) {
    return /zoom|online|teams/i.test(String(loc || ''));
  }

  // schema.org accepts a local ISO date-time with no offset; the venue's local
  // time is assumed. Avoids getting BST/GMT wrong across the DST boundary.
  function isoLocal(date, time) {
    return time ? date + 'T' + time + ':00' : date;
  }

  function eventSchema(ev) {
    var node = {
      '@type': 'Event',
      '@id': SITE + '/whats-on.html#event-' + ev.id,
      'name': ev.title,
      'startDate': isoLocal(ev.date, ev.startTime),
      'eventStatus': 'https://schema.org/EventScheduled',
      'organizer': {
        '@type': 'Organization',
        'name': 'Coopers Edge Community Church',
        'url': SITE
      },
      'url': SITE + '/whats-on.html'
    };

    if (ev.endTime) node.endDate = isoLocal(ev.date, ev.endTime);
    if (ev.description) node.description = String(ev.description).replace(/\s+/g, ' ').trim();
    if (ev.imageUrl) node.image = ev.imageUrl;

    if (isVirtual(ev.location)) {
      node.eventAttendanceMode = 'https://schema.org/OnlineEventAttendanceMode';
      node.location = { '@type': 'VirtualLocation', 'url': SITE + '/whats-on.html' };
    } else {
      node.eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
      node.location = {
        '@type': 'Place',
        'name': ev.location || '@TheEdge Community Centre',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Typhoon Way',
          'addressLocality': 'Brockworth',
          'addressRegion': 'Gloucestershire',
          'postalCode': 'GL3 4DY',
          'addressCountry': 'GB'
        }
      };
    }

    var signup = safeSignupUrl(ev.signupUrl);
    if (signup) {
      node.offers = {
        '@type': 'Offer',
        'url': signup,
        'availability': 'https://schema.org/InStock'
      };
    } else {
      node.isAccessibleForFree = true;
    }

    return node;
  }

  var schemaInjected = false;

  function injectEventSchema(evs) {
    if (schemaInjected || !evs || !evs.length) return;
    schemaInjected = true;

    var payload = {
      '@context': 'https://schema.org',
      '@graph': evs.slice(0, 25).map(eventSchema)
    };

    var tag = document.createElement('script');
    tag.type = 'application/ld+json';
    // Prevent a stray "</script>" inside event text from closing the block.
    tag.textContent = JSON.stringify(payload).replace(/</g, '\\u003c');
    document.head.appendChild(tag);
  }

  // ---- Render functions --------------------------------

  function renderUpcomingEvents(containerId, limit) {
    var el = document.getElementById(containerId);
    if (!el) return;
    fetch('data/events.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var today = new Date().toISOString().slice(0, 10);
        var evs = (data.events || [])
          .filter(function (e) { return e.date >= today; })
          .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
        if (limit) evs = evs.slice(0, limit);
        if (evs.length === 0) {
          el.innerHTML = '<p style="color:var(--col-muted)">No upcoming events right now — check back soon.</p>';
          return;
        }
        el.innerHTML = '<div class="events-grid">' + evs.map(renderCard).join('') + '</div>';
        attachCardClicks(el);
      })
      .catch(function () {
        el.innerHTML = '<p style="color:var(--col-muted)">Events couldn\'t be loaded right now. Please try again later.</p>';
      });
  }

  function renderMonthlyEvents(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    fetch('data/events.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var today = new Date().toISOString().slice(0, 10);
        var evs = (data.events || [])
          .filter(function (e) { return e.date >= today; })
          .sort(function (a, b) { return a.date < b.date ? -1 : 1; });

        if (evs.length === 0) {
          el.innerHTML = '<p style="color:var(--col-muted)">No upcoming events right now — check back soon.</p>';
          return;
        }

        injectEventSchema(evs);

        var monthKeys = [], months = {};
        evs.forEach(function (e) {
          var key = e.date.slice(0, 7);
          if (!months[key]) { months[key] = []; monthKeys.push(key); }
          months[key].push(e);
        });

        var idx = 0;

        function monthName(key) {
          return new Date(key + '-15T12:00:00')
            .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        }

        function paint() {
          var key  = monthKeys[idx];
          var prev = idx > 0 ? monthKeys[idx - 1] : null;
          var next = idx < monthKeys.length - 1 ? monthKeys[idx + 1] : null;

          el.innerHTML =
            '<div class="month-nav">' +
              '<button class="month-nav-btn prev"' + (prev ? '' : ' disabled') + ' aria-label="Go to ' + (prev ? monthName(prev) : 'previous month') + '">' +
                (prev ? '&#8592;&nbsp;' + monthName(prev) : '') +
              '</button>' +
              '<h3 class="month-nav-label">' + monthName(key) + '</h3>' +
              '<button class="month-nav-btn next"' + (next ? '' : ' disabled') + ' aria-label="Go to ' + (next ? monthName(next) : 'next month') + '">' +
                (next ? monthName(next) + '&nbsp;&#8594;' : '') +
              '</button>' +
            '</div>' +
            '<div class="events-grid">' + months[key].map(renderCard).join('') + '</div>';

          if (prev) el.querySelector('.month-nav-btn.prev').addEventListener('click', function () { idx--; paint(); });
          if (next) el.querySelector('.month-nav-btn.next').addEventListener('click', function () { idx++; paint(); });
        }

        paint();
        attachCardClicks(el);
      })
      .catch(function () {
        el.innerHTML = '<p style="color:var(--col-muted)">Events couldn\'t be loaded right now. Please try again later.</p>';
      });
  }

  function endOfWeek() {
    var d = new Date();
    var end = new Date(d);
    end.setDate(d.getDate() + (d.getDay() === 0 ? 0 : 7 - d.getDay()));
    return end.toISOString().slice(0, 10);
  }

  function renderThisWeek(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    function hide() {
      var wrapper = el.closest ? el.closest('.this-week-wrapper') : el.parentElement;
      if (wrapper) wrapper.style.display = 'none';
    }

    fetch('data/events.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var today = new Date().toISOString().slice(0, 10);
        var evs = (data.events || [])
          .filter(function (e) { return e.date >= today && e.date <= endOfWeek(); })
          .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
        if (evs.length === 0) { hide(); return; }
        el.innerHTML = '<div class="events-grid">' + evs.map(renderCard).join('') + '</div>';
        attachCardClicks(el);
      })
      .catch(hide);
  }

  // ---- Init --------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    renderMonthlyEvents('events-container');
    renderThisWeek('home-events-container');

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalEl && modalEl.classList.contains('open')) closeModal();
    });
  });

  window.CECCEvents = {
    renderUpcomingEvents:  renderUpcomingEvents,
    renderMonthlyEvents:   renderMonthlyEvents,
    renderThisWeek:        renderThisWeek,
  };

}());
