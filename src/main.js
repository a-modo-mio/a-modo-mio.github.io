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
})();
