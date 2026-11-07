// A Modo Mio: interazioni leggere, nessuna dipendenza.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Header: bordo quando si scorre ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Aperto ora / oggi (fuso orario italiano) ----------
  const hoursEl = document.getElementById('hours-data');
  if (hoursEl) {
    const hours = JSON.parse(hoursEl.textContent);
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const dayKey = get('weekday').slice(0, 2); // Mon -> Mo
    const now = Number(get('hour')) * 60 + Number(get('minute'));
    const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
    const todayIdx = hours.findIndex((d) => d.key === dayKey);
    const today = hours[todayIdx];

    let text;
    let open = false;
    const current = today?.slots.find(([a, b]) => now >= toMin(a) && now < toMin(b));
    if (current) {
      open = true;
      text = `Aperto ora · fino alle ${current[1]}`;
    } else {
      const later = today?.slots.find(([a]) => toMin(a) > now);
      if (later) {
        text = `Chiuso ora · apriamo alle ${later[0]}`;
      } else {
        for (let i = 1; i <= 7; i++) {
          const d = hours[(todayIdx + i) % 7];
          if (d.slots.length) {
            text = `Chiuso ora · riapriamo ${i === 1 ? 'domani' : d.label.toLowerCase()} alle ${d.slots[0][0]}`;
            break;
          }
        }
      }
    }
    document.querySelectorAll('[data-status]').forEach((el) => {
      el.dataset.open = String(open);
      el.innerHTML = `<span class="status__dot" aria-hidden="true"></span>${text}`;
    });
    document.querySelectorAll(`.hours tr[data-day="${dayKey}"]`).forEach((tr) => tr.classList.add('is-today'));
  }

  // ---------- Ingressi a scorrimento ----------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // ---------- Filtri menù ----------
  const chips = document.querySelectorAll('[data-filter]');
  if (chips.length) {
    const sections = document.querySelectorAll('.menu-section');
    const apply = (id, push) => {
      const valid = id === 'tutto' || [...sections].some((s) => s.id === id);
      const target = valid ? id : 'tutto';
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === target)));
      sections.forEach((s) => { s.hidden = target !== 'tutto' && s.id !== target; });
      if (push) history.replaceState(null, '', target === 'tutto' ? location.pathname : `#${target}`);
      const status = document.getElementById('filter-status');
      if (status) {
        const label = [...chips].find((c) => c.dataset.filter === target)?.dataset.label;
        status.textContent = target === 'tutto' ? 'Mostro tutto il menù' : `Mostro solo: ${label}`;
      }
    };
    // Al clic si va dritti alla sezione scelta ("Tutto" porta alla prima categoria), saltando le offerte
    chips.forEach((c) => c.addEventListener('click', () => {
      apply(c.dataset.filter, true);
      const id = c.dataset.filter;
      const target = id === 'tutto' ? sections[0] : document.getElementById(id);
      if (!target) return;
      const offset = document.querySelector('.site-header').offsetHeight + document.querySelector('.filters').offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
    apply(location.hash.slice(1) || 'tutto', false);
  }

  // ---------- Mappa al clic (nessun servizio esterno finché non serve) ----------
  document.querySelectorAll('[data-map-load]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const map = btn.closest('.map');
      const iframe = document.createElement('iframe');
      iframe.src = map.dataset.src;
      iframe.title = map.dataset.title;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer';
      map.appendChild(iframe);
      map.classList.add('is-loaded');
    });
  });

  // ---------- Galleria 3D circolare ----------
  document.querySelectorAll('[data-ring]').forEach((ring) => {
    const stage = ring.querySelector('.ring__stage');
    const items = [...ring.querySelectorAll('.ring__item')];
    const n = items.length;
    if (!n) return;
    const step = 360 / n;
    let angle = 0;
    let target = null;
    let dragging = false;
    let hovering = false;
    let visible = false;
    let radius = 0;
    let last = performance.now();
    let lastScroll = window.scrollY;

    const layout = () => {
      const w = items[0].offsetWidth;
      radius = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.3);
      items.forEach((el, i) => { el.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`; });
    };
    const paint = () => {
      stage.style.transform = `translateZ(${-radius}px) rotateY(${-angle}deg)`;
      items.forEach((el, i) => {
        const d = Math.abs(((i * step - angle) % 360 + 540) % 360 - 180);
        el.style.opacity = String(Math.max(0.25, 1 - d / 150));
        el.style.pointerEvents = d < 60 ? '' : 'none';
        el.setAttribute('aria-hidden', d < 100 ? 'false' : 'true');
      });
    };
    const goTo = (deg) => { target = deg; };
    const snap = () => Math.round(angle / step) * step;

    ring.querySelector('[data-ring-prev]').addEventListener('click', () => goTo(snap() - step));
    ring.querySelector('[data-ring-next]').addEventListener('click', () => goTo(snap() + step));
    ring.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(snap() - step); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(snap() + step); }
    });
    ring.addEventListener('mouseenter', () => { hovering = true; });
    ring.addEventListener('mouseleave', () => { hovering = false; });
    ring.addEventListener('focusin', () => { hovering = true; });
    ring.addEventListener('focusout', () => { hovering = false; });

    let startX = 0;
    let startAngle = 0;
    ring.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      dragging = true; target = null; startX = e.clientX; startAngle = angle;
      ring.classList.add('is-dragging');
      ring.setPointerCapture(e.pointerId);
    });
    ring.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      angle = startAngle - (e.clientX - startX) * 0.25;
    });
    const endDrag = () => { if (!dragging) return; dragging = false; ring.classList.remove('is-dragging'); goTo(snap()); };
    ring.addEventListener('pointerup', endDrag);
    ring.addEventListener('pointercancel', endDrag);

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (visible && !reduceMotion && target === null && !dragging) angle += (y - lastScroll) * 0.05;
      lastScroll = y;
    }, { passive: true });

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        if (target !== null) {
          const diff = target - angle;
          if (Math.abs(diff) < 0.05) { angle = target; target = null; }
          else angle += diff * Math.min(1, dt * 8);
        } else if (!dragging && !hovering && !reduceMotion && !document.hidden) {
          angle += dt * 5;
        }
        paint();
      }
      requestAnimationFrame(tick);
    };
    layout(); paint();
    window.addEventListener('resize', () => { layout(); paint(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '100px' }).observe(ring);
    } else { visible = true; }
    requestAnimationFrame(tick);
  });
})();
