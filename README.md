# Pizzeria A Modo Mio · sito

Sito statico della Pizzeria A Modo Mio, Via Concordia 3, Renate (MB). Nessun framework, nessuna dipendenza: basta Node 18+.

## Avvio

```bash
npm start
```

Genera il sito in `dist/` e lo apre su http://localhost:4321 (oppure `PORT=4322 npm start`).
Per pubblicare basta caricare il contenuto di `dist/` su un hosting statico.

## Pagine

- `/` Home: offerte, pizze in evidenza, kebab, modi di ordinare, orari, FAQ
- `/menu/` Menù completo con prezzi, allergeni e filtri per categoria
- `/contatti/` Ordina, consegna e orari

## Dove si modifica cosa

| File | Contenuto |
|---|---|
| `content.mjs` | **Tutti** i dati: contatti, orari, offerte, menù con allergeni, testi, FAQ. È l'unico file da toccare. |
| `src/styles.css` | Stile del sito. |
| `src/main.js` | "Aperto ora", filtri del menù, mappa al clic, animazioni d'ingresso. |
| `build.mjs` | Genera HTML, logo, dati strutturati JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`, immagine social. |

Le offerte con una data di scadenza (`validUntil`) spariscono da sole alla prima build successiva alla scadenza.

Tutti gli ordini passano dal numero **0362 915499**, da Just Eat o da Deliveroo.

## Da confermare

- **Dominio**: oggi è l'indirizzo GitHub Pages (`a-modo-mio.github.io`), da cambiare in `content.mjs` se si acquista un dominio

## Pubblicazione

Ogni push su `main` rigenera il sito e lo pubblica su GitHub Pages (`.github/workflows/pages.yml`).
