// Sito della Pizzeria A Modo Mio (versione 1). Genera ./dist da content.mjs. Nessuna dipendenza.
// Uso: node build.mjs
import { mkdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { site, contact, address, hours, hoursNote, facts, promos, copy, faq, menu, allergenNames } from './content.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const h = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const euro = (n) => `€ ${n.toFixed(2).replace('.', ',')}`;
const nb = (s) => String(s).replace(/€ /g, '€ ');
const priceLabel = (it) => `${it.priceFrom ? 'da ' : ''}${it.pricePlus ? '+ ' : ''}${euro(it.price)}`;
const abs = (path) => `${site.baseUrl}${path}`;
const fullAddress = `${address.street}, ${address.postalCode} ${address.city} (${address.province})`;
const tel = `tel:${contact.phoneE164}`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${site.fullName}, ${fullAddress}`)}`;
const activePromos = promos.filter((p) => !p.validUntil || p.validUntil >= BUILD_DATE);

// Elenco piatto di tutti gli item, con gli allergeni dell'impasto già uniti
const withAllergens = (cat, group, it) => {
  if (group.noAllergens) return [];
  const set = new Set([...(it.al || []), ...(it.noBase ? [] : cat.baseAllergens || [])]);
  return [...set].sort((a, b) => a - b);
};
const allItems = menu.flatMap((c) => c.groups.flatMap((g) => g.items.map((it) => ({ ...it, allergens: withAllergens(c, g, it), category: c.id }))));
const pick = (names, category) => names.map((n) => allItems.find((it) => it.name === n && (!category || it.category === category))).filter(Boolean);
const countItems = (c) => c.groups.reduce((n, g) => n + g.items.length, 0);

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const seedOf = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7) || 1;

// ---------------------------------------------------------------------------
// Icone
// ---------------------------------------------------------------------------
const icon = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  scooter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l2-7h-4M17 10l1-3h2"/><path d="M3 11h6l2 3"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h18M6 9v11M18 9v11M8 5h8"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chili: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 3.5c-.6 1-1.6 1.6-2.7 1.8 1.6.6 2.7 2.1 2.7 3.9 0 5.3-6.1 11.3-12.5 11.3-1 0-1.5-.6-1-1.3 5.4-1 8.5-6.6 8.5-10 0-1.9 1.5-3.4 3.4-3.6.4-1.1 1.2-2 2.2-2.6l-.6.5z"/></svg>',
};

// ---------------------------------------------------------------------------
// Logo del locale (ridisegnato in vettoriale dal menù cartaceo)
// ---------------------------------------------------------------------------
function logoBadge({ id = 'lb', text = true, label = '' } = {}) {
  // Riproduzione vettoriale del logo del menù cartaceo: disco nero con scritte bianche,
  // nastro giallo-arancio con code piegate dietro la pizza, fetta mancante in alto a destra.
  const cx = 130, cy = 100;
  const pepperoni = [[-24, -22], [-32, 6], [-14, 28], [14, 30], [0, 4], [29, 14], [-4, -31], [22, -12]]
    .map(([dx, dy]) => {
      const x = cx + dx, y = cy + dy;
      return `<circle cx="${x}" cy="${y}" r="9.5" fill="#ec6a5c" stroke="#c8473a" stroke-width="1.5"/>`
        + `<circle cx="${x - 3}" cy="${y - 2}" r="1.4" fill="#b83b2e"/><circle cx="${x + 2.5}" cy="${y - 1}" r="1.2" fill="#b83b2e"/><circle cx="${x - 0.5}" cy="${y + 3}" r="1.3" fill="#b83b2e"/>`;
    }).join('');
  const basil = [[-12, -10, 30], [12, 17, -30], [-26, 22, 60], [36, -2, 10], [-36, -10, -50]]
    .map(([dx, dy, r]) => `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="5" ry="2.6" transform="rotate(${r} ${cx + dx} ${cy + dy})" fill="#3e8e2f"/>`).join('');
  const textEls = text ? `
  <text font-family="'Barlow Condensed', 'Arial Narrow', Arial, sans-serif" font-weight="700" font-size="21" letter-spacing="1.3" fill="#fff"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">PIZZERIA A MODO MIO</textPath></text>
  <text font-family="'Barlow Condensed', 'Arial Narrow', Arial, sans-serif" font-weight="700" font-size="21" letter-spacing="3.2" fill="#fff"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">FORNO A LEGNA</textPath></text>` : '';
  return `<svg viewBox="0 0 260 200" ${label ? `role="img" aria-label="${h(label)}"` : 'aria-hidden="true"'}>
  <defs>
    <path id="${id}t" d="M 58 100 A 72 72 0 0 1 202 100"/>
    <path id="${id}b" d="M 47 100 A 83 83 0 0 0 213 100"/>
    <linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe36a"/><stop offset="1" stop-color="#f5a623"/></linearGradient>
    <mask id="${id}m"><rect width="260" height="200" fill="#fff"/><path d="M130 100 L140.4 40.9 A60 60 0 0 1 179.2 65.6 Z" fill="#000"/></mask>
  </defs>
  <circle cx="${cx}" cy="${cy}" r="97" fill="#141414"/>
  <circle cx="${cx}" cy="${cy}" r="94" fill="none" stroke="#fff" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="62" fill="none" stroke="#fff" stroke-width="2.5"/>${textEls}
  <path d="M8 88 H46 V110 H8 L17 99 Z" fill="#e58a1f"/>
  <path d="M40 102 L46 102 L46 110 Z" fill="#9c5512"/>
  <path d="M252 88 H214 V110 H252 L243 99 Z" fill="#e58a1f"/>
  <path d="M220 102 L214 102 L214 110 Z" fill="#9c5512"/>
  <rect x="40" y="80" width="180" height="22" fill="url(#${id}r)"/>
  <path d="M130 100 L139.2 47.8 A53 53 0 0 1 173.4 69.6 Z" fill="#141414"/>
  <g mask="url(#${id}m)">
    <circle cx="${cx}" cy="${cy}" r="50" fill="#f5a03a" stroke="#d97b16" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="42" fill="#f9d648"/>
    ${pepperoni}${basil}
  </g>
</svg>`;
}

const logo = (tag = 'a') => `<${tag} class="logo" ${tag === 'a' ? `href="/" aria-label="${h(site.fullName)}, torna alla home"` : ''}>${logoBadge({ id: `lm${tag}` })}<span class="logo__word">${h(site.name)}<small>Pizzeria · Renate</small></span></${tag}>`;

// ---------------------------------------------------------------------------
// Illustrazioni (non foto: il locale non vuole foto sul sito)
// ---------------------------------------------------------------------------
function pizzaSvg({ seed = 'margherita', size = 400, toppings = 'classic', label = '' }) {
  const r = rng(seedOf(seed));
  const c = size / 2;
  const R = size * 0.42;
  let spots = '';
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2;
    const d = R - 6 - r() * 12;
    spots += `<circle cx="${(c + Math.cos(a) * d).toFixed(1)}" cy="${(c + Math.sin(a) * d).toFixed(1)}" r="${(1.5 + r() * 4).toFixed(1)}" fill="#3a2414" opacity="${(0.25 + r() * 0.45).toFixed(2)}"/>`;
  }
  let cheese = '';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + r() * 0.5;
    const d = R * (0.12 + 0.5 * Math.sqrt(r()));
    const x = (c + Math.cos(a) * d).toFixed(1);
    const y = (c + Math.sin(a) * d).toFixed(1);
    cheese += `<ellipse cx="${x}" cy="${y}" rx="${(R * (0.1 + r() * 0.06)).toFixed(1)}" ry="${(R * (0.075 + r() * 0.04)).toFixed(1)}" transform="rotate(${Math.round(r() * 180)} ${x} ${y})" fill="#fbf1dc" opacity="0.96"/>`;
  }
  let extra = '';
  const n = toppings === 'classic' ? 5 : 8;
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * R * 0.65;
    const x = (c + Math.cos(a) * d).toFixed(1);
    const y = (c + Math.sin(a) * d).toFixed(1);
    if (toppings === 'hot') extra += `<circle cx="${x}" cy="${y}" r="${(R * 0.09).toFixed(1)}" fill="#7f1d12"/>`;
    else if (toppings === 'veg') extra += `<rect x="${x}" y="${y}" width="${(R * 0.16).toFixed(1)}" height="${(R * 0.06).toFixed(1)}" rx="4" transform="rotate(${Math.round(r() * 180)} ${x} ${y})" fill="${r() > 0.5 ? '#5b6236' : '#c9772a'}"/>`;
    else if (toppings === 'meat') extra += `<path d="M${x} ${y}q${R * 0.08} -${R * 0.1} ${R * 0.16} 0q-${R * 0.04} ${R * 0.08} -${R * 0.16} 0z" fill="#d98a7a"/>`;
    else extra += `<ellipse cx="${x}" cy="${y}" rx="${(R * 0.07).toFixed(1)}" ry="${(R * 0.035).toFixed(1)}" transform="rotate(${Math.round(r() * 180)} ${x} ${y})" fill="#3f6b2a"/>`;
  }
  const id = `p${seedOf(seed + size)}`;
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${h(label)}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="${id}b" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#f3d9a4"/><stop offset="1" stop-color="#e8dcc8"/></radialGradient>
    <radialGradient id="${id}c" cx="50%" cy="50%" r="50%"><stop offset=".8" stop-color="#e7b25e"/><stop offset="1" stop-color="#c98a3a"/></radialGradient>
    <radialGradient id="${id}s" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#d0502a"/><stop offset="1" stop-color="#a93c1c"/></radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#${id}b)"/>
  <circle cx="${c + 6}" cy="${c + 10}" r="${R + 4}" fill="#1e1915" opacity=".12"/>
  <circle cx="${c}" cy="${c}" r="${R}" fill="url(#${id}c)"/>
  ${spots}
  <circle cx="${c}" cy="${c}" r="${R * 0.82}" fill="url(#${id}s)"/>
  ${cheese}
  ${extra}
</svg>`;
}

const ovenSvg = (label) => `<svg viewBox="0 0 400 500" role="img" aria-label="${h(label)}" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="go" cx="50%" cy="75%" r="60%"><stop offset="0" stop-color="#e0a43c"/><stop offset=".45" stop-color="#a93c1c"/><stop offset="1" stop-color="#1e1915"/></radialGradient></defs><rect width="400" height="500" fill="#1e1915"/><path d="M40 470V270a160 160 0 0 1 320 0v200z" fill="#2a231d"/><path d="M90 470V300a110 110 0 0 1 220 0v170z" fill="url(#go)"/><g fill="#3d342c"><rect x="130" y="440" width="140" height="14" rx="7"/><rect x="150" y="424" width="100" height="12" rx="6"/></g><rect x="20" y="460" width="360" height="40" fill="#3d342c"/></svg>`;

const ill = (svg, cls = '') => `<figure class="ph ${cls}">${svg}</figure>`;

const mapSvg = `<svg viewBox="0 0 400 300" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#f4ecdf"/><path d="M-10 210 C80 190 140 230 230 200 S360 150 420 170" stroke="#fffdf9" stroke-width="18" fill="none"/><path d="M120 -10 C130 80 110 160 150 310" stroke="#fffdf9" stroke-width="12" fill="none"/><path d="M260 -10 L300 310" stroke="#fffdf9" stroke-width="9" fill="none"/><path d="M-10 70 L420 110" stroke="#fffdf9" stroke-width="7" fill="none"/><ellipse cx="330" cy="240" rx="60" ry="34" fill="#e4e5cf"/><ellipse cx="60" cy="120" rx="40" ry="26" fill="#e4e5cf"/><g transform="translate(200 128)"><circle r="26" fill="#a93c1c" opacity=".16"/><path d="M0 14 C-12 0 -14 -8 -14 -14 a14 14 0 0 1 28 0 c0 6 -2 14 -14 28z" fill="#a93c1c"/><circle cy="-14" r="5" fill="#fffdf9"/></g></svg>`;

// ---------------------------------------------------------------------------
// Blocchi riusabili
// ---------------------------------------------------------------------------
const status = (cls = '') => `<p class="status ${cls}" data-status role="status" aria-live="polite"></p>`;


const dishRow = (it) => `<li class="dish">
  <p class="dish__name">${h(it.name)}${it.frozen ? '<span aria-label=" (surgelato)">*</span>' : ''}</p>
  <span class="dish__price">${priceLabel(it)}</span>
  ${it.desc ? `<p class="dish__desc">${h(it.desc)}</p>` : ''}
  ${it.allergens?.length ? `<p class="dish__al">Allergeni: ${it.allergens.map((n) => allergenNames[n]).join(', ')}</p>` : ''}
</li>`;

const hoursTable = () => `<table class="hours">
  <caption class="visually-hidden">Orari di apertura settimanali</caption>
  <tbody>
    ${hours.map((d) => `<tr data-day="${d.key}"><th scope="row">${d.label}</th><td>${d.slots.length ? d.slots.map(([a, b]) => `${a}–${b}`).join('<br>') : '<span class="closed">Chiuso</span>'}</td></tr>`).join('\n    ')}
  </tbody>
</table>
<p class="muted" style="margin-top:12px;font-size:.92rem">${h(hoursNote)}</p>`;

const mapBlock = () => {
  const { lat, lng } = address;
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=it&output=embed`;
  return `<div class="map" data-src="${src}" data-title="Mappa: ${h(site.fullName)}, ${h(fullAddress)}">
  ${mapSvg}
  <div class="map__overlay">
    <p>La mappa interattiva si carica da Google Maps solo se la apri.</p>
    <button class="btn" type="button" data-map-load>Mostra mappa</button>
  </div>
</div>`;
};

const whereBlock = () => `<div class="info-grid">
  <div>
    <div class="info-block">
      <h3>${icon.clock}Orari</h3>
      ${hoursTable()}
    </div>
    <div class="info-block">
      <h3>${icon.pin}Indirizzo</h3>
      <address class="address">${h(site.fullName)}<br>${h(address.street)}<br>${h(address.postalCode)} ${h(address.city)} (${h(address.province)})</address>
      <p class="muted">Per ordinare chiama il <a href="${tel}">${h(contact.phoneDisplay)}</a>.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${directions}" target="_blank" rel="noopener">${icon.pin}Indicazioni stradali</a>
        <a class="btn" href="${tel}">${icon.phone}${h(contact.phoneDisplay)}</a>
      </div>
    </div>
  </div>
  <div class="reveal">${mapBlock()}</div>
</div>`;

const faqBlock = (page) => `<div class="faq">
  ${faq.filter((f) => f.pages.includes(page)).map((f) => `<details><summary>${h(f.q)}</summary><p>${h(f.a)}</p></details>`).join('\n  ')}
</div>`;

const promosBlock = () => (activePromos.length ? `<ul class="promos list-reset">
  ${activePromos.map((p, i) => `<li class="promo reveal" style="--i:${i}">
    <h3>${h(p.title)}</h3>
    <ul class="list-reset">${p.lines.map((l) => `<li>${h(nb(l))}</li>`).join('')}</ul>
    <p>${h(p.note)}</p>
  </li>`).join('\n  ')}
</ul>` : '');

const onlineLinks = (cls = 'btn') => `<a class="${cls}" href="${contact.justEat}" target="_blank" rel="noopener">${icon.bag}Just Eat</a>
<a class="${cls}" href="${contact.deliveroo}" target="_blank" rel="noopener">${icon.scooter}Deliveroo</a>`;

const ctaBand = () => `<section class="section section--brand cta-band" aria-labelledby="cta-title">
  <div class="container reveal">
    <h2 id="cta-title">${h(copy.home.finalTitle)}</h2>
    <p>${h(copy.home.finalText)}</p>
    <a class="phone-big" href="${tel}">${h(contact.phoneDisplay)}</a>
    <div class="btn-row">
      ${onlineLinks('btn btn--lg')}
      <a class="btn btn--lg btn--ghost-light" href="/menu/">Sfoglia il menù ${icon.arrow}</a>
    </div>
  </div>
</section>`;

const breadcrumb = (items) => `<nav class="breadcrumb" aria-label="Percorso"><ol>${items.map((it, i) => (i < items.length - 1 ? `<li><a href="${it.path}">${h(it.name)}</a></li>` : `<li aria-current="page">${h(it.name)}</li>`)).join('')}</ol></nav>`;

// ---------------------------------------------------------------------------
// Dati strutturati
// ---------------------------------------------------------------------------
const dayMap = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };
function openingSpecs() {
  const groups = new Map();
  hours.forEach((d) => d.slots.forEach(([o, c]) => {
    const k = `${o}-${c}`;
    if (!groups.has(k)) groups.set(k, { opens: o, closes: c, days: [] });
    groups.get(k).days.push(`https://schema.org/${dayMap[d.key]}`);
  }));
  return [...groups.values()].map((g) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: g.days, opens: g.opens, closes: g.closes }));
}
const restaurantLd = () => ({
  '@type': 'Restaurant',
  '@id': abs('/#restaurant'),
  name: site.fullName,
  url: abs('/'),
  telephone: contact.phoneE164,
  email: contact.email,
  image: abs('/og-image.png'),
  logo: abs('/logo.svg'),
  description: `Pizzeria e kebab a ${address.city} (${address.province}), in Brianza. Pizza nel forno a legna, kebab, fritti. Asporto, consegna a domicilio e piccola sala. Aperti tutti i giorni.`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: address.street,
    postalCode: address.postalCode,
    addressLocality: address.city,
    addressRegion: address.province,
    addressCountry: address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: address.lat, longitude: address.lng },
  servesCuisine: ['Pizza', 'Kebab', 'Italiana'],
  priceRange: facts.priceRange,
  acceptsReservations: false,
  paymentAccepted: facts.payments,
  currenciesAccepted: 'EUR',
  hasMenu: abs('/menu/'),
  areaServed: address.areaServed.map((n) => ({ '@type': 'Place', name: n })),
  openingHoursSpecification: openingSpecs(),
  sameAs: [contact.instagram, contact.facebook, contact.justEat].filter(Boolean),
});
const breadcrumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});
const faqLd = (page) => ({
  '@type': 'FAQPage',
  mainEntity: faq.filter((f) => f.pages.includes(page)).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
const menuLd = () => ({
  '@type': 'Menu',
  '@id': abs('/menu/#menu'),
  name: `Menù ${site.fullName}`,
  url: abs('/menu/'),
  inLanguage: 'it',
  hasMenuSection: menu.map((c) => ({
    '@type': 'MenuSection',
    name: c.label,
    hasMenuSection: c.groups.filter((g) => !g.noAllergens).map((g) => ({
      '@type': 'MenuSection',
      name: g.title || c.label,
      hasMenuItem: g.items.map((it) => ({
        '@type': 'MenuItem',
        name: it.name,
        ...(it.desc ? { description: it.desc } : {}),
        offers: { '@type': 'Offer', price: it.price.toFixed(2), priceCurrency: 'EUR' },
        ...(g.vegan ? { suitableForDiet: 'https://schema.org/VeganDiet' } : {}),
      })),
    })),
  })),
});

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
const NAV = [
  { path: '/menu/', label: 'Menù' },
  { path: '/contatti/', label: 'Ordina' },
];

function layout({ path, title, description, body, ld = [], noindex = false }) {
  const canonical = abs(path);
  const graph = { '@context': 'https://schema.org', '@graph': [restaurantLd(), ...ld] };
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${h(title)}</title>
<meta name="description" content="${h(description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#fbf7f0">
<meta property="og:type" content="website">
<meta property="og:locale" content="${site.locale}">
<meta property="og:site_name" content="${h(site.fullName)}">
<meta property="og:title" content="${h(title)}">
<meta property="og:description" content="${h(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs('/og-image.png')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="IT-MB">
<meta name="geo.placename" content="${h(address.city)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Figtree:wght@400..700&display=swap">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
<script src="/main.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Vai al contenuto</a>
<header class="site-header">
  <div class="container site-header__inner">
    ${logo()}
    <nav class="nav" aria-label="Principale">
      ${NAV.map((n) => `<a href="${n.path}"${n.path === path ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
      <a class="btn btn--primary" href="${tel}">${icon.phone}${h(contact.phoneDisplay)}</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        ${logo('div')}
        <p>Pizzeria e kebab a ${h(address.city)}, in Brianza. Forno a legna, asporto, consegna a domicilio e una piccola sala.</p>
        <address style="font-style:normal">${h(fullAddress)}</address>
      </div>
      <div>
        <h2>Pagine</h2>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/menu/">Menù</a></li>
          <li><a href="/contatti/">Ordina e orari</a></li>
        </ul>
      </div>
      <div>
        <h2>Contatti</h2>
        <ul>
          <li><a href="${tel}">Tel. ${h(contact.phoneDisplay)}</a></li>
          <li><a href="mailto:${contact.email}">${h(contact.email)}</a></li>
          <li><a href="${contact.instagram}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="${contact.facebook}" target="_blank" rel="noopener">Facebook</a></li>
        </ul>
      </div>
      <div>
        <h2>Orari</h2>
        <ul>
          <li>Tutti i giorni</li>
          ${hours[0].slots.map(([a, b]) => `<li>${a}–${b}</li>`).join('\n          ')}
          <li>Festivi compresi</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${h(site.fullName)} · ${h(site.vatId)}</span>
    </div>
  </div>
</footer>
<nav class="action-bar" aria-label="Contatti rapidi">
  <a class="is-primary" href="${tel}">${icon.phone}Chiama</a>
  <a href="${contact.justEat}" target="_blank" rel="noopener">${icon.bag}Just Eat</a>
  <a href="${directions}" target="_blank" rel="noopener">${icon.pin}Indicazioni</a>
</nav>
<script type="application/json" id="hours-data">${JSON.stringify(hours.map(({ key, label, slots }) => ({ key, label, slots })))}</script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Pagine
// ---------------------------------------------------------------------------
const toppingOf = (it) => (/piccante|nduja/i.test(it.desc || '') ? 'hot' : /cotto|crudo|salsiccia|salame|speck|mortadella|bresaola/i.test(it.desc || '') ? 'meat' : /zucchine|peperoni|melanzane|radicchio|trevisana|funghi/i.test(it.desc || '') ? 'veg' : 'classic');

function homePage() {
  const c = copy.home;
  const featured = pick(c.featuredNames, 'pizze');
  const kebabs = pick(c.kebabNames, 'kebab');
  const body = `
<section class="hero">
  <div class="container hero__grid">
    <div class="hero__copy">
      ${status('hero__status')}
      <p class="eyebrow">${h(c.eyebrow)}</p>
      <h1>${h(c.h1)}</h1>
      <p class="lead">${h(c.lead)}</p>
      <div class="btn-row hero__actions">
        <a class="btn btn--primary btn--lg" href="${tel}">${icon.phone}Chiama e ordina</a>
        <a class="btn btn--lg" href="/menu/">Sfoglia il menù ${icon.arrow}</a>
      </div>
      <p class="hero__sub">Preferisci ordinare online? <a href="${contact.justEat}" target="_blank" rel="noopener">Just Eat</a> o <a href="${contact.deliveroo}" target="_blank" rel="noopener">Deliveroo</a></p>
    </div>
    <div class="hero__logo">${logoBadge({ id: 'hero', label: 'Logo della Pizzeria A Modo Mio, forno a legna' })}</div>
  </div>
</section>

<section class="section section--dark" aria-label="In breve">
  <div class="container">
    <ul class="facts list-reset">
      ${c.factsStrip.map((f, i) => `<li class="reveal" style="--i:${i}"><strong>${h(f.value)}</strong><span>${h(f.label)}</span></li>`).join('\n      ')}
    </ul>
  </div>
</section>

${activePromos.length ? `<section class="section" aria-labelledby="promo-title">
  <div class="container">
    <div class="section__head reveal"><h2 id="promo-title">${h(c.promoTitle)}</h2></div>
    ${promosBlock()}
  </div>
</section>` : ''}

<section class="section section--alt" aria-labelledby="featured-title">
  <div class="container">
    <div class="section__head reveal">
      <h2 id="featured-title">${h(c.featuredTitle)}</h2>
      <p>${h(c.featuredLead)}</p>
    </div>
    <ul class="cards list-reset">
      ${featured.map((it, i) => `<li class="card reveal" style="--i:${i}">
        ${ill(pizzaSvg({ seed: it.name, size: 320, toppings: toppingOf(it), label: `Illustrazione della pizza ${it.name}` }))}
        <div class="card__body">
          <h3 class="card__title">${h(it.name)} <span class="card__price">${priceLabel(it)}</span></h3>
          <p>${h(it.desc)}</p>
        </div>
      </li>`).join('\n      ')}
    </ul>
    <p style="margin-top:var(--space-5)"><a class="link-arrow" href="/menu/">Vedi tutto il menù: oltre 70 pizze, calzoni, focacce, fritti e dolci ${icon.arrow}</a></p>
  </div>
</section>

<section class="section" aria-labelledby="kebab-title">
  <div class="container">
    <div class="section__head reveal">
      <h2 id="kebab-title">${h(c.kebabTitle)}</h2>
      <p>${h(c.kebabLead)}</p>
    </div>
    <ul class="menu-list list-reset">
      ${kebabs.map((it) => dishRow(it)).join('\n      ')}
    </ul>
    <p style="margin-top:var(--space-5)"><a class="link-arrow" href="/menu/#kebab">Tutti i kebab ${icon.arrow}</a></p>
  </div>
</section>

<section class="section section--alt" aria-labelledby="order-title">
  <div class="container">
    <div class="section__head reveal"><h2 id="order-title">${h(c.orderTitle)}</h2></div>
    <ul class="ways list-reset">
      ${c.orderSteps.map((s, i) => `<li class="reveal" style="--i:${i}"><span class="ways__icon">${[icon.bag, icon.scooter, icon.table][i]}</span><h3>${h(s.title)}</h3><p>${h(s.text)}</p></li>`).join('\n      ')}
    </ul>
    <div class="btn-row" style="margin-top:var(--space-6)">
      <a class="btn btn--primary" href="${tel}">${icon.phone}Ordina al ${h(contact.phoneDisplay)}</a>
      ${onlineLinks()}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="room-title">
  <div class="container split">
    <figure class="ph ph--photo reveal"><img src="/saletta.jpg" width="1200" height="1600" loading="lazy" decoding="async" alt="La saletta della pizzeria: tavolini bianchi, sedie nere e un bancone alto lungo la parete azzurra"></figure>
    <div class="reveal">
      <h2 id="room-title">${h(c.roomTitle)}</h2>
      <p class="quote">${h(c.roomText)}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${directions}" target="_blank" rel="noopener">${icon.pin}Come arrivare</a>
        <a class="btn" href="/menu/#calzoni">Pizza al metro e famiglia ${icon.arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--dark" aria-labelledby="why-title">
  <div class="container">
    <div class="section__head reveal"><h2 id="why-title">${h(c.whyTitle)}</h2></div>
    <ul class="values list-reset">
      ${c.why.map((v, i) => `<li class="reveal" style="--i:${i}"><h3>${h(v.title)}</h3><p>${h(v.text)}</p></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="where-title" id="orari">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Pizzeria a ${h(address.city)}</p>
      <h2 id="where-title">${h(c.whereTitle)}</h2>
      <p>${h(fullAddress)}. A pochi minuti da ${h(address.areaServed.slice(1, 4).join(', '))} e ${h(address.areaServed[4])}.</p>
    </div>
    ${whereBlock()}
  </div>
</section>

<section class="section section--alt" aria-labelledby="faq-title">
  <div class="container">
    <div class="section__head reveal"><h2 id="faq-title">${h(c.faqTitle)}</h2></div>
    ${faqBlock('home')}
  </div>
</section>

${ctaBand()}
`;
  return layout({
    path: '/',
    title: `Pizzeria e kebab a Renate (MB) | ${site.fullName}`,
    description: `${site.fullName} a ${address.city}: pizza nel forno a legna, kebab e fritti. Asporto, consegna a domicilio a € 2 e piccola sala. Aperti tutti i giorni.`,
    body,
    ld: [
      { '@type': 'WebSite', '@id': abs('/#website'), name: site.fullName, url: abs('/'), inLanguage: 'it' },
      faqLd('home'),
    ],
  });
}

function menuPage() {
  const c = copy.menu;
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Menù', path: '/menu/' }];
  const updated = new Date(c.updated).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const body = `
<section class="page-head">
  <div class="container">
    ${breadcrumb(crumbs)}
    <p class="eyebrow">${h(c.eyebrow)}</p>
    <h1>${h(c.h1)}</h1>
    <p class="lead">${h(c.lead)}</p>
    <div class="menu-meta">
      <span>${h(c.frozenNote)}</span>
      <span>Prezzi aggiornati al <time datetime="${c.updated}">${updated}</time></span>
    </div>
  </div>
</section>

<div class="filters">
  <div class="container">
    <ul class="filters__list" aria-label="Filtra il menù per categoria">
      <li><button class="chip" type="button" data-filter="tutto" data-label="Tutto" aria-pressed="true">Tutto</button></li>
      ${menu.map((cat) => `<li><button class="chip" type="button" data-filter="${cat.id}" data-label="${h(cat.label)}" aria-pressed="false" aria-controls="${cat.id}">${h(cat.label)}<span class="count">${countItems(cat)}</span></button></li>`).join('\n      ')}
    </ul>
    <p id="filter-status" class="visually-hidden" role="status" aria-live="polite"></p>
  </div>
</div>

<div class="container menu-body">
  ${activePromos.length ? `<section class="menu-promos" aria-labelledby="menu-promo-title">
    <h2 id="menu-promo-title" class="menu-group-title">Le offerte</h2>
    ${promosBlock()}
  </section>` : ''}
  ${menu.map((cat) => `<section class="menu-section" id="${cat.id}" aria-labelledby="${cat.id}-title">
    <div class="menu-section__head">
      <h2 id="${cat.id}-title">${h(cat.label)}</h2>
      ${cat.intro ? `<p>${h(cat.intro)}</p>` : ''}
    </div>
    ${cat.groups.map((g) => `${g.title ? `<h3 class="menu-group-title">${h(g.title)}</h3>` : ''}
    ${g.note ? `<p class="menu-group-note">${h(g.note)}</p>` : ''}
    <ul class="menu-list list-reset">
      ${g.items.map((it) => dishRow({ ...it, allergens: withAllergens(cat, g, it) })).join('\n      ')}
    </ul>`).join('\n')}
  </section>`).join('\n  ')}

  <p class="muted" style="margin-top:var(--space-6);max-width:44rem">${h(c.allergens)} ${h(c.frozenNote)}. ${h(c.pricesNote)}</p>

  <div class="menu-cta reveal">
    <div>
      <h2>Hai scelto? Chiamaci.</h2>
      <p>Ritiro in pizzeria, oppure consegna a casa con € ${facts.deliveryFee},00 in più (ordine minimo € ${facts.deliveryMinimum},00).</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--primary btn--lg" href="${tel}">${icon.phone}${h(contact.phoneDisplay)}</a>
      <a class="btn btn--lg btn--ghost-light" href="${contact.justEat}" target="_blank" rel="noopener">${icon.bag}Just Eat</a>
      <a class="btn btn--lg btn--ghost-light" href="${contact.deliveroo}" target="_blank" rel="noopener">${icon.scooter}Deliveroo</a>
    </div>
  </div>
</div>
<div style="height:var(--space-8)"></div>
`;
  return layout({
    path: '/menu/',
    title: `Menù pizze e kebab con prezzi | ${site.fullName}, Renate`,
    description: `Il menù completo di ${site.fullName} a ${address.city}: pizze tradizionali e speciali, vegane, calzoni, focacce, fritti, kebab e dolci, con prezzi e allergeni.`,
    body,
    ld: [menuLd(), breadcrumbLd(crumbs)],
  });
}

function contactPage() {
  const c = copy.contact;
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Ordina e orari', path: '/contatti/' }];
  const body = `
<section class="page-head">
  <div class="container">
    ${breadcrumb(crumbs)}
    ${status()}
    <p class="eyebrow" style="margin-top:var(--space-4)">${h(c.eyebrow)}</p>
    <h1>${h(c.h1)}</h1>
    <p class="lead">${h(c.lead)}</p>
  </div>
</section>

<section class="section" style="padding-top:0" aria-labelledby="order-title">
  <div class="container">
    <h2 id="order-title" class="visually-hidden">Come ordinare</h2>
    <div class="options">
      <a class="option option--featured reveal" href="${tel}">
        <span class="option__icon">${icon.phone}</span>
        <h3>Telefono</h3>
        <p>Per il ritiro in pizzeria e per la consegna a domicilio. Ci dici cosa vuoi e a che ora.</p>
        <strong>${h(contact.phoneDisplay)} ${icon.arrow}</strong>
      </a>
      <a class="option reveal" style="--i:1" href="${contact.justEat}" target="_blank" rel="noopener">
        <span class="option__icon">${icon.bag}</span>
        <h3>Just Eat</h3>
        <p>Scegli dal menù, paghi online e la ricevi a casa.</p>
        <strong>Ordina su Just Eat ${icon.arrow}</strong>
      </a>
      <a class="option reveal" style="--i:2" href="${contact.deliveroo}" target="_blank" rel="noopener">
        <span class="option__icon">${icon.scooter}</span>
        <h3>Deliveroo</h3>
        <p>Trovi la pizzeria anche su Deliveroo, con consegna a domicilio.</p>
        <strong>Ordina su Deliveroo ${icon.arrow}</strong>
      </a>
    </div>
  </div>
</section>

<section class="section section--alt" aria-labelledby="ways-title">
  <div class="container">
    <div class="section__head reveal"><h2 id="ways-title">${h(copy.home.orderTitle)}</h2></div>
    <ul class="ways list-reset">
      ${copy.home.orderSteps.map((s, i) => `<li class="reveal" style="--i:${i}"><span class="ways__icon">${[icon.bag, icon.scooter, icon.table][i]}</span><h3>${h(s.title)}</h3><p>${h(s.text)}</p></li>`).join('\n      ')}
    </ul>
    <p class="muted" style="margin-top:var(--space-5)">Paghi come preferisci: ${h(facts.payments.toLowerCase())}. Gli animali sono i benvenuti.</p>
  </div>
</section>

<section class="section" aria-labelledby="where-title">
  <div class="container">
    <div class="section__head reveal">
      <h2 id="where-title">Orari e dove siamo</h2>
      <p>${h(site.fullName)}, ${h(fullAddress)}.</p>
    </div>
    ${whereBlock()}
  </div>
</section>

<section class="section section--alt" aria-labelledby="faq-title">
  <div class="container">
    <div class="section__head reveal"><h2 id="faq-title">Domande frequenti</h2></div>
    ${faqBlock('contact')}
  </div>
</section>
`;
  return layout({
    path: '/contatti/',
    title: `Ordina, consegna e orari | ${site.fullName} Renate`,
    description: `Ordina da ${site.fullName} a ${address.city}: al ${contact.phoneDisplay}, su Just Eat o Deliveroo. Consegna € 2, minimo € 10. Aperti tutti i giorni.`,
    body,
    ld: [breadcrumbLd(crumbs), faqLd('contact')],
  });
}

function notFoundPage() {
  return layout({
    path: '/404.html',
    title: `Pagina non trovata | ${site.fullName}`,
    description: 'Questa pagina non esiste.',
    noindex: true,
    body: `<section class="page-head"><div class="container"><h1>Questa pagina non c’è.</h1><p class="lead">Forse il link è vecchio. Il menù e i contatti invece sono qui.</p><div class="btn-row" style="margin-top:var(--space-5)"><a class="btn btn--primary" href="/menu/">Vai al menù</a><a class="btn" href="/">Torna alla home</a></div></div></section>`,
  });
}

// ---------------------------------------------------------------------------
// File SEO / AI
// ---------------------------------------------------------------------------
const PAGES = [
  { path: '/', priority: '1.0' },
  { path: '/menu/', priority: '0.9' },
  { path: '/contatti/', priority: '0.9' },
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${BUILD_DATE}</lastmod><changefreq>monthly</changefreq><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`;
const robots = `User-agent: *
Allow: /

# Assistenti AI e motori di ricerca possono leggere e citare il sito
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`;
const llms = `# ${site.fullName}, pizzeria e kebab a ${address.city} (${address.province})

> Pizzeria e kebab a ${address.city}, in Brianza (provincia di Monza e Brianza). Pizza cotta nel forno a legna con mozzarella fior di latte, kebab, falafel, fritti. Asporto, consegna a domicilio (€ ${facts.deliveryFee}, ordine minimo € ${facts.deliveryMinimum}) e una piccola sala. Non serve prenotare. Aperti tutti i giorni dell'anno.

## Contatti
- Indirizzo: ${fullAddress}
- Telefono (per tutti gli ordini): ${contact.phoneDisplay}
- Email: ${contact.email}
- Ordini online: Just Eat (${contact.justEat}), Deliveroo
- Pagamenti: ${facts.payments}
- Animali ammessi

## Orari
- Tutti i giorni: ${hours[0].slots.map(([a, b]) => `${a}-${b}`).join(', ')}
- ${hoursNote}

${activePromos.length ? `## Offerte\n${activePromos.map((p) => `- ${p.title}: ${p.lines.join('; ')}. ${p.note}`).join('\n')}\n\n` : ''}## Menù (prezzi in euro)
${menu.map((cat) => `### ${cat.label}\n${cat.groups.map((g) => `${g.title ? `#### ${g.title}\n` : ''}${g.items.map((it) => {
  const al = withAllergens(cat, g, it);
  return `- ${it.name}: ${priceLabel(it).replace(' ', ' ')}${it.desc ? ` (${it.desc})` : ''}${al.length ? ` [allergeni: ${al.map((n) => allergenNames[n]).join(', ')}]` : ''}`;
}).join('\n')}`).join('\n')}`).join('\n\n')}

## Domande frequenti
${faq.map((f) => `- ${f.q} ${f.a}`).join('\n')}

## Pagine
- [Home](${abs('/')})
- [Menù](${abs('/menu/')})
- [Ordina, consegna e orari](${abs('/contatti/')})
`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" ${logoBadge({ id: 'fav', text: false }).slice(5)}`;
const logoFile = `<svg xmlns="http://www.w3.org/2000/svg" ${logoBadge({ id: 'logo', label: site.fullName }).slice(5)}`;

// Immagine di anteprima social (PNG 1200x630): il logo su fondo crema
function ogImagePng() {
  const W = 1200, H = 630;
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const px = Buffer.alloc((W * 3 + 1) * H);
  const shapes = [];
  const circle = (cx, cy, r, color) => shapes.push((x, y) => ((x - cx) ** 2 + (y - cy) ** 2 <= r * r ? color : null));
  const cx = 600, cy = 315, k = 2.6;
  circle(cx, cy, 98 * k, hex('#1e1915'));
  circle(cx, cy, 61 * k, hex('#fbf7f0'));
  circle(cx, cy, 51 * k, hex('#e8892b'));
  circle(cx, cy, 44 * k, hex('#f6c343'));
  [[76, 80], [68, 112], [92, 128], [120, 122], [98, 96], [134, 98], [80, 62]].forEach(([x, y]) => circle(cx + (x - 100) * k, cy + (y - 100) * k, 8.5 * k, hex('#d9432b')));
  shapes.push((x, y) => (Math.abs(y - cy - 4 * k) <= 9 * k && Math.abs(x - cx) <= 62 * k ? hex('#f2a33a') : null));
  const bg = hex('#fbf7f0');
  for (let y = 0; y < H; y++) {
    const row = y * (W * 3 + 1);
    for (let x = 0; x < W; x++) {
      let c = bg;
      for (let i = shapes.length - 1; i >= 0; i--) { const v = shapes[i](x, y); if (v) { c = v; break; } }
      px.set(c, row + 1 + x * 3);
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(px, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Scrittura
// ---------------------------------------------------------------------------
async function out(rel, content) {
  const file = join(DIST, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

await rm(DIST, { recursive: true, force: true });
await out('index.html', homePage());
await out('menu/index.html', menuPage());
await out('contatti/index.html', contactPage());
await out('404.html', notFoundPage());
await out('sitemap.xml', sitemap);
await out('robots.txt', robots);
await out('llms.txt', llms);
await out('favicon.svg', favicon);
await out('logo.svg', logoFile);
await out('og-image.png', ogImagePng());
await copyFile(join(ROOT, 'src/styles.css'), join(DIST, 'styles.css'));
await copyFile(join(ROOT, 'src/main.js'), join(DIST, 'main.js'));
await copyFile(join(ROOT, 'src/saletta.jpg'), join(DIST, 'saletta.jpg'));
console.log(`✓ Sito generato in dist/ (${BUILD_DATE})`);
