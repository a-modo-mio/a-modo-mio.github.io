// ============================================================================
//  PIZZERIA A MODO MIO · Contenuti del sito
//  ----------------------------------------------------------------------------
//  Questo è l'UNICO file da modificare per aggiornare dati, testi e menù.
//  I valori marcati "TODO: confermare" vanno ancora verificati col titolare.
//  Dopo ogni modifica: `npm run build`.
// ============================================================================

export const site = {
  name: 'A Modo Mio',
  fullName: 'Pizzeria A Modo Mio',
  vatId: 'P.IVA 13549730961',
  baseUrl: 'https://gianlu04-afk.github.io', // indirizzo GitHub Pages; da cambiare se si acquista un dominio
  locale: 'it_IT',
};

export const contact = {
  // Numero per TUTTI gli ordini (asporto, consegna, sala)
  phoneDisplay: '0362 915499',
  phoneE164: '+390362915499',
  email: 'pizzeriaamodo.mio.222@gmail.com',
  instagram: 'https://www.instagram.com/pizzeriaa.amodomio/',
  facebook: 'https://www.facebook.com/share/18U2pXq1MK/',
  justEat: 'https://www.justeat.it/restaurants-pizzeria-a-modo-mio-renate/menu',
  deliveroo: 'https://deliveroo.it/menu/milano/merate/pizzeria-a-modo-mio-renate?utm_campaign=organic&utm_medium=referrer&utm_source=menu_share',
};

export const address = {
  street: 'Via Concordia 3',
  postalCode: '20838',
  city: 'Renate',
  province: 'MB',
  region: 'Lombardia',
  country: 'IT',
  lat: 45.72280581578767,
  lng: 9.278680928539131,
  areaServed: ['Renate', 'Besana in Brianza', 'Veduggio con Colzano', 'Briosco', 'Cassago Brianza', 'Monza e Brianza'],
};

// Orari: formato 24h "HH:MM". Aperti tutti i giorni dell'anno.
const SLOTS = [['11:00', '14:30'], ['17:00', '23:00']];
export const hours = [
  { key: 'Mo', label: 'Lunedì', slots: SLOTS },
  { key: 'Tu', label: 'Martedì', slots: SLOTS },
  { key: 'We', label: 'Mercoledì', slots: SLOTS },
  { key: 'Th', label: 'Giovedì', slots: SLOTS },
  { key: 'Fr', label: 'Venerdì', slots: SLOTS },
  { key: 'Sa', label: 'Sabato', slots: SLOTS },
  { key: 'Su', label: 'Domenica', slots: SLOTS },
];
export const hoursNote = 'Aperti tutti i giorni dell’anno, festivi compresi.';

export const facts = {
  deliveryFee: 2,
  deliveryMinimum: 10,
  priceRange: '€',
  payments: 'Contanti, carte (POS portatile), Satispay e buoni pasto',
};

// Promozioni del volantino. Quelle con "validUntil" scaduto spariscono da sole alla build successiva.
export const promos = [
  {
    title: 'Pranzo, dal lunedì al venerdì',
    lines: ['Pizza tradizionale + bibita: € 7,00', 'Pizza tradizionale + birra 66 cl: € 9,00', 'Aggiungi le patatine: + € 2,00'],
    note: 'A mezzogiorno.',
    validUntil: null,
  },
  {
    title: 'Primo lunedì e primo martedì del mese',
    lines: ['Tutte le pizze tradizionali a € 5,00'],
    note: 'Con ritiro in pizzeria. Non cumulabile con la bibita omaggio. Fino al 31 dicembre 2026.',
    validUntil: '2026-12-31',
  },
  {
    title: 'Dal lunedì al giovedì',
    lines: ['Con almeno 3 pizze, una bibita omaggio per ogni pizza'],
    note: 'Con ritiro in pizzeria. Fino al 31 dicembre 2026.',
    validUntil: '2026-12-31',
  },
];

// ----------------------------------------------------------------------------
//  TESTI
// ----------------------------------------------------------------------------
export const copy = {
  home: {
    eyebrow: 'Pizzeria e kebab a Renate (MB)',
    h1: 'La migliore pizzeria d’asporto della zona, 365 su 365.',
    lead: 'Pizza cotta nel forno a legna, kebab e fritti. Ti fermi nella nostra saletta, passi a ritirare o te la portiamo a casa. Siamo aperti tutti i giorni, a pranzo e a cena.',
    factsStrip: [
      { value: '7 giorni su 7', label: 'aperti tutto l’anno, festivi compresi' },
      { value: 'Forno a legna', label: 'e solo mozzarella fior di latte' },
      { value: '€ 2', label: 'per la consegna a casa, con ordine minimo di € 10' },
    ],
    promoTitle: 'Le offerte',
    featuredTitle: 'Assapora il gusto della Brianza',
    featuredLead: 'Alcune delle nostre speciali si chiamano come i paesi qui intorno.',
    featuredNames: ['Renate', 'Besana', 'Veduggio', 'Cassago'],
    kebabTitle: 'Non solo pizza',
    kebabLead: 'Kebab, falafel e cotoletta, nel panino, nella piadina o in vaschetta.',
    kebabNames: ['Panino kebab', 'Piadina kebab', 'Vaschetta kebab', 'Panino falafel'],
    orderTitle: 'Tre modi per avere la tua pizza',
    orderSteps: [
      { title: 'Ritiro in pizzeria', text: 'Chiama il 0362 915499, dicci cosa vuoi e a che ora passi.' },
      { title: 'Consegna a domicilio', text: 'Te la portiamo a casa con € 2 in più, ordine minimo € 10. Al telefono, su Just Eat o su Deliveroo.' },
      { title: 'Mangi da noi', text: 'Abbiamo una piccola sala. Non serve prenotare: entri e ti siedi.' },
    ],
    roomTitle: 'Una saletta per fermarti a mangiare',
    roomText: 'Non serve prenotare: entri, ordini e ti siedi. Se hai un cane, portalo pure. Per una festa ordina la pizza al metro, con un giorno di anticipo.',
    whyTitle: 'Perché tornano da noi',
    why: [
      { title: 'Non chiudiamo mai', text: 'Siamo aperti tutti i giorni dell’anno, a pranzo e a cena. Anche a Natale.' },
      { title: 'Prezzi giusti', text: 'Le tradizionali partono da € 5,00. A pranzo, pizza e bibita costano € 7,00.' },
      { title: 'Ti trattiamo bene', text: 'Qui ti chiamiamo per nome e ricordiamo come vuoi la tua pizza.' },
    ],
    whereTitle: 'Orari e dove siamo',
    faqTitle: 'Le domande che ci fate più spesso',
    finalTitle: 'Hai già fame?',
    finalText: 'Chiamaci per ordinare. Rispondiamo tutti i giorni, a pranzo e a cena.',
  },
  menu: {
    eyebrow: 'Pizzeria A Modo Mio · Renate',
    h1: 'Menù',
    lead: 'Pizze cotte nel forno a legna, calzoni, focacce, fritti, kebab e dolci. Tutto si può ordinare anche da asporto o con consegna a domicilio.',
    allergens: 'Hai allergie o intolleranze? Diccelo quando ordini. Sotto ogni piatto trovi gli allergeni presenti, secondo l’elenco dei 14 allergeni.',
    frozenNote: '* prodotto surgelato',
    pricesNote: 'Prezzi in euro, IVA inclusa.',
    updated: '2026-10-01',
  },
  contact: {
    eyebrow: 'Ordini, consegna e orari',
    h1: 'Ordina, passa a ritirare o mangia da noi',
    lead: 'Tutti gli ordini passano dal nostro numero di telefono, oppure da Just Eat e Deliveroo.',
  },
};

// ----------------------------------------------------------------------------
//  FAQ (usate in pagina e nei dati strutturati FAQPage)
// ----------------------------------------------------------------------------
export const faq = [
  {
    q: 'Bisogna prenotare?',
    a: 'No. Abbiamo una piccola sala: entri e ti siedi. Se siete un gruppo numeroso, chiamaci prima e ti diciamo se c’è posto.',
    pages: ['home', 'contact'],
  },
  {
    q: 'Fate consegna a domicilio?',
    a: `Sì. La consegna costa € ${facts.deliveryFee},00 e l’ordine minimo è di € ${facts.deliveryMinimum},00. Ordini al 0362 915499, su Just Eat o su Deliveroo.`,
    pages: ['home', 'contact'],
  },
  {
    q: 'Siete aperti anche nei festivi?',
    a: 'Sì, siamo aperti tutti i giorni dell’anno, dalle 11:00 alle 14:30 e dalle 17:00 alle 23:00.',
    pages: ['home', 'contact'],
  },
  {
    q: 'Avete l’impasto senza glutine?',
    a: 'Sì, con € 3,00 in più. Abbiamo anche impasto integrale, senza lievito, al kamut e la pinsa. Se sei celiaco o allergico, diccelo quando ordini.',
    pages: ['home'],
  },
  {
    q: 'Avete pizze vegane o senza lattosio?',
    a: 'Sì. In menù ci sono pizze vegane e vegetariane, e su richiesta usiamo la mozzarella senza lattosio.',
    pages: ['home'],
  },
  {
    q: 'Fate anche il kebab?',
    a: 'Sì: panino, piadina, vaschetta, kebab con focaccia, falafel e cotoletta. C’è anche la pizza kebab.',
    pages: ['home'],
  },
  {
    q: 'Come si può pagare?',
    a: `${facts.payments}.`,
    pages: ['home', 'contact'],
  },
  {
    q: 'Posso portare il cane?',
    a: 'Sì, gli animali sono i benvenuti.',
    pages: ['contact'],
  },
  {
    q: 'Fate pizze per feste e compleanni?',
    a: 'Sì. La pizza al metro si ordina la mattina per la sera, o il giorno prima: margherita € 30,00, farcita da € 35,00. Ci sono anche le pizze famiglia.',
    pages: ['home', 'contact'],
  },
];

// ----------------------------------------------------------------------------
//  ALLERGENI (numerazione del menù cartaceo)
// ----------------------------------------------------------------------------
export const allergenNames = {
  1: 'arachidi', 2: 'frutta a guscio', 3: 'latte', 4: 'pesce', 5: 'crostacei', 6: 'senape', 7: 'sedano',
  8: 'uova', 9: 'soia', 10: 'anidride solforosa', 11: 'glutine', 12: 'lupini', 13: 'sesamo', 14: 'molluschi',
};

// ----------------------------------------------------------------------------
//  MENÙ: trascritto UNICAMENTE dal menù cartaceo (foto del titolare).
//  Nomi, ingredienti, prezzi, sezioni e allergeni come sul cartaceo; sciolte solo
//  le abbreviazioni (pom. = pomodoro, mozz. = mozzarella, sal. picc. = salame piccante).
//  Aggiunte su indicazione del titolare: bevande, latte nelle mozzarelline,
//  molluschi nei calamari, allergeni dei dolci alla Nutella.
//
//  al: numeri degli allergeni (legenda sopra) · frozen: prodotto surgelato (*)
//  noBase: l'item non ha base di pasta · priceFrom: "da" · pricePlus: "+"
//  baseAllergens: allergeni delle basi, aggiunti a ogni item della categoria
//  noAllergens (sul gruppo): il cartaceo non riporta allergeni per quel gruppo
// ----------------------------------------------------------------------------
const BASE_NOTE = 'Tutte le basi (esclusa quella senza glutine) contengono glutine (allergene 11).';

export const menu = [
  {
    id: 'pizze',
    label: 'Pizze',
    intro: `Forno a legna. Per le nostre pizze usiamo solo mozzarella fior di latte. ${BASE_NOTE}`,
    baseAllergens: [11],
    groups: [
      {
        title: 'Pizze tradizionali',
        items: [
          { name: 'Focaccia liscia', desc: 'Olio extra vergine, sale, origano', price: 3.5 },
          { name: 'Marinara', desc: 'Pomodoro, aglio, olio, origano', price: 5.0 },
          { name: 'Biancaneve', desc: 'Doppia mozzarella, grana', price: 6.0, al: [3] },
          { name: 'Margherita', desc: 'Pomodoro, mozzarella', price: 6.0, al: [3] },
          { name: 'Wurstel', desc: 'Pomodoro, mozzarella, wurstel', price: 6.5, al: [3] },
          { name: 'Pugliese', desc: 'Pomodoro, mozzarella, cipolle', price: 6.5, al: [3] },
          { name: 'Napoli', desc: 'Pomodoro, mozzarella, acciughe, origano', price: 6.5, al: [3, 4, 10] },
          { name: 'Prosciutto cotto', desc: 'Pomodoro, mozzarella, prosciutto cotto', price: 6.5, al: [3] },
          { name: 'Patatine', desc: 'Pomodoro, mozzarella, patatine fritte*', price: 6.5, al: [3] },
          { name: 'Brianzola', desc: 'Pomodoro, mozzarella, salsiccia', price: 6.5, al: [3] },
          { name: 'Stella', desc: 'Pomodoro, mozzarella, salame dolce', price: 6.5, al: [3] },
          { name: 'Diavola', desc: 'Pomodoro, mozzarella, salame piccante', price: 6.5, al: [3] },
          { name: 'Tonno e cipolla', desc: 'Pomodoro, mozzarella, tonno, cipolla', price: 7.0, al: [3, 4] },
          { name: 'Affumicata', desc: 'Pomodoro, mozzarella, prosciutto, scamorza', price: 7.0, al: [3] },
          { name: 'Margellina', desc: 'Pomodoro, mozzarella, prosciutto, acciughe', price: 7.0, al: [3, 4] },
          { name: 'Patatine e wurstel', desc: 'Pomodoro, mozzarella, patatine, wurstel', price: 7.0, al: [3] },
          { name: 'Bismark', desc: 'Pomodoro, mozzarella, prosciutto, uovo', price: 7.0, al: [3, 8] },
          { name: 'Prosciutto e funghi', desc: 'Pomodoro, mozzarella, prosciutto, funghi', price: 7.0, al: [3, 10] },
          { name: 'Bufala', desc: 'Pomodoro, mozzarella, bufala', price: 7.0, al: [3] },
          { name: 'Regina', desc: 'Pomodoro, mozzarella, zucchine, taleggio', price: 7.0, al: [3] },
          { name: 'Melanzane e zola', desc: 'Pomodoro, mozzarella, melanzane, zola', price: 7.0, al: [3] },
          { name: 'Gustosa', desc: 'Pomodoro, mozzarella, gorgonzola, salame piccante', price: 7.5, al: [3] },
          { name: 'Romana', desc: 'Pomodoro, mozzarella, acciughe, capperi, olive, origano', price: 7.5, al: [3, 4, 10] },
          { name: 'Siciliana', desc: 'Pomodoro, acciughe, capperi, olive, olio, origano', price: 7.5, al: [4, 10] },
          { name: 'Braccio di ferro', desc: 'Pomodoro, mozzarella, spinaci*, wurstel, ricotta', price: 7.5, al: [3] },
          { name: 'Sei formaggi', desc: 'Mozzarella, formaggi misti', price: 8.0, al: [3] },
          { name: 'Quattro stagioni', desc: 'Pomodoro, mozzarella, prosciutto, funghi, carciofi, olive', price: 8.0, al: [3, 10] },
          { name: 'Vegetariana', desc: 'Pomodoro, mozzarella, zucchine, melanzane, peperoni', price: 8.0, al: [3] },
        ],
      },
      {
        title: 'Pizze speciali',
        items: [
          { name: 'Renate', desc: 'Pomodoro, mozzarella, taleggio, trevisana, crudo', price: 8.0, al: [3] },
          { name: 'Carbonara', desc: 'Pomodoro, mozzarella, pancetta, uova, grana', price: 8.0, al: [3, 8] },
          { name: 'Contadina', desc: 'Pomodoro, mozzarella, funghi, salsiccia, gorgonzola', price: 8.0, al: [3, 10] },
          { name: 'Pasticciata', desc: 'Pomodoro, mozzarella, zola, radicchio, speck, noci', price: 8.0, al: [2, 3] },
          { name: 'Besana', desc: 'Pomodoro, mozzarella, pomodori secchi, squacquerone, salsiccia, basilico', price: 8.0, al: [3, 10] },
          { name: 'Mery', desc: 'Pomodoro, mozzarella, gamberetti, brie, zucchine', price: 8.0, al: [3, 5] },
          { name: 'Troppo forti', desc: 'Pomodoro, mozzarella, friarielli, ’nduja, salame piccante, fagioli', price: 8.0, al: [3, 10, 12] },
          { name: 'Vulcano', desc: 'Pomodoro, mozzarella, peperoni, salsiccia, brie', price: 8.0, al: [3] },
          { name: 'Panaro', desc: 'Pomodoro, mozzarella, funghi porcini, speck, zola', price: 8.0, al: [3, 10] },
          { name: 'Calabra', desc: 'Pomodoro, mozzarella, ’nduja, tonno, cipolla', price: 8.0, al: [3, 4] },
          { name: 'Pazza', desc: 'Pomodoro, mozzarella, bresaola, rucola, grana', price: 8.0, al: [3] },
          { name: 'Primavera', desc: 'Pomodoro, mozzarella, pomodorini, rucola, grana', price: 8.0, al: [3] },
          { name: 'Delicata', desc: 'Pomodoro, mozzarella, squacquerone, zucchine, grana', price: 8.0, al: [3] },
          { name: 'Carina', desc: 'Pomodoro, mozzarella, salame dolce, olive nere, taleggio', price: 8.0, al: [3, 10] },
          { name: 'Gamberi e rucola', desc: 'Pomodoro, mozzarella, gamberetti, rucola', price: 8.0, al: [3, 5] },
          { name: 'Bella Napoli', desc: 'Pomodoro, mozzarella, friarielli, salsiccia', price: 8.0, al: [3, 10] },
          { name: 'Veduggio', desc: 'Mozzarella, peperoni, ricotta, radicchio, speck', price: 8.0, al: [3] },
          { name: 'Adamo', desc: 'Mozzarella, pesto ligure, carciofi, melanzane, pomodorini', price: 8.0, al: [3, 10] },
          { name: 'Salmone e scamorza', desc: 'Pomodoro, mozzarella, salmone, scamorza affumicata', price: 8.0, al: [3, 4] },
          { name: 'Sud', desc: 'Pomodoro, mozzarella, salsiccia, trevisana, scamorza', price: 8.5, al: [3] },
          { name: 'Cattiva', desc: 'Pomodoro, mozzarella, salame piccante, olive nere, ’nduja, grana', price: 8.5, al: [3, 10] },
          { name: 'Bufalina', desc: 'Pomodoro, mozzarella di bufala, pomodorini, basilico', price: 8.5, al: [3] },
          { name: 'Golosa', desc: 'Pomodoro, filetti di acciughe, bufala, basilico', price: 8.5, al: [3, 4, 10] },
          { name: 'Mangia e taci', desc: 'Tutto di tutto…', price: 8.5 },
          { name: 'Bomba', desc: 'Pomodoro, mozzarella, cipolla, peperoni, tonno, salame, olive', price: 8.5, al: [3, 4, 10] },
          { name: 'Pizza kebab', desc: 'Pomodoro, mozzarella, kebab, insalata, cipolla, pomodoro, salse', price: 9.0, al: [3, 7, 8] },
          { name: 'Pizza più', desc: 'Pomodoro, mozzarella, speck, rucola, porcini, scamorza', price: 9.0, al: [3, 10] },
          { name: 'Porcini e gamberetti', desc: 'Pomodoro, mozzarella, funghi porcini, gamberetti', price: 9.0, al: [3, 5, 10] },
          { name: 'Salmone e gamberetti', desc: 'Pomodoro, mozzarella, salmone, gamberetti', price: 9.0, al: [3, 4, 5] },
          { name: 'Italia', desc: 'Pomodoro, mozzarella, pomodorini, rucola, mozzarella di bufala', price: 9.0, al: [3] },
          { name: 'Valtellina', desc: 'Pomodoro, mozzarella, funghi porcini, bresaola, rucola, grana', price: 9.0, al: [3, 10] },
          { name: 'Frutti di mare', desc: 'Pomodoro, frutti di mare*, aglio, prezzemolo', price: 9.0, al: [4, 5] },
          { name: 'Barese', desc: 'Pomodoro, mozzarella, burrata pugliese, pomodori secchi', price: 9.0, al: [3, 10] },
          { name: 'Nada', desc: 'Mozzarella, brie, burrata, crudo', price: 9.0, al: [3] },
          { name: 'Sila', desc: 'Pomodoro, mozzarella, mortadella, pistacchio, burrata', price: 9.0, al: [2, 3] },
          { name: 'Cassago', desc: 'Pomodoro, mozzarella, squacquerone, trevisana, speck', price: 9.0, al: [3] },
          { name: 'Nadin', desc: 'Mozzarella, zucchine, gamberetti, squacquerone', price: 9.0, al: [3, 5] },
          { name: 'Mari e monti', desc: 'Pomodoro, mozzarella, frutti di mare*, porcini', price: 10.0, al: [3, 4, 5, 10] },
          { name: 'Piramide', desc: 'Mozzarella, salame piccante, acciughe, burrata, pomodorini, basilico', price: 10.0, al: [3, 4, 10] },
          { name: 'Mar rosso', desc: 'Pomodoro, gamberetti, salmone, scamorza, porcini', price: 10.0, al: [3, 5, 10] },
          { name: 'Lety', desc: 'Bordo ripieno di mozzarella, cotto, mozzarella, scamorza', price: 10.0, al: [3] },
        ],
      },
      {
        title: 'Pizze vegane',
        vegan: true,
        items: [
          { name: 'Vegana 2', desc: 'Pomodoro, funghi, cipolla di Tropea, peperoni rossi e gialli', price: 8.0, al: [10] },
          { name: 'Vegana 3', desc: 'Pomodoro, radicchio, friarielli, carciofi, pomodori secchi', price: 8.5, al: [10] },
        ],
      },
      {
        title: 'Impasti speciali',
        note: 'Aggiunte a partire da + € 1,00. Disponibile mozzarella senza lattosio.',
        noAllergens: true,
        items: [
          { name: 'Integrale', price: 1.0, pricePlus: true },
          { name: 'Senza lievito', price: 1.5, pricePlus: true },
          { name: 'Kamut', price: 2.0, pricePlus: true },
          { name: 'Pinsa', price: 2.0, pricePlus: true },
          { name: 'Senza glutine', price: 3.0, pricePlus: true },
        ],
      },
    ],
  },
  {
    id: 'calzoni',
    label: 'Calzoni e pizze famiglia',
    intro: BASE_NOTE,
    baseAllergens: [11],
    groups: [
      {
        title: 'Calzoni',
        items: [
          { name: 'Liscio', desc: 'Pomodoro, mozzarella, cotto', price: 6.5, al: [3] },
          { name: 'Farcito', desc: 'Pomodoro, mozzarella, cotto, funghi, carciofi', price: 7.0, al: [3, 10] },
          { name: '4 formaggi', desc: 'Mozzarella, zola, taleggio, scamorza affumicata', price: 7.0, al: [3] },
          { name: 'Kebab', price: 8.0 },
        ],
      },
      {
        title: 'Pizze famiglia',
        items: [
          { name: 'Margherita', price: 18.0 },
          { name: 'Farcita a piacere', price: 22.0, priceFrom: true },
          { name: 'Pizza kebab', price: 30.0 },
        ],
      },
      {
        title: 'Pizza al metro',
        note: 'Solo su ordinazione (la mattina per la sera, o il giorno prima).',
        noAllergens: true,
        items: [
          { name: 'Margherita', price: 30.0 },
          { name: 'Farcita', price: 35.0, priceFrom: true },
        ],
      },
    ],
  },
  {
    id: 'focacce',
    label: 'Focacce',
    intro: BASE_NOTE,
    baseAllergens: [11],
    groups: [
      {
        title: null,
        items: [
          { name: 'Focaccia liscia', price: 3.5 },
          { name: 'Focaccia crudo', price: 6.0 },
          { name: 'Focaccia verdure', price: 6.0 },
          { name: 'Focaccia della casa', desc: 'Pomodoro fresco, crudo, rucola, grana', price: 7.0, al: [3] },
        ],
      },
    ],
  },
  {
    id: 'fritti',
    label: 'Fritti',
    intro: '* Surgelato.',
    groups: [
      {
        title: null,
        items: [
          { name: 'Patatine fritte piccole', price: 4.0, frozen: true },
          { name: 'Patatine fritte grandi', price: 5.0, frozen: true },
          { name: 'Crocchette di patate', desc: '10 pezzi', price: 5.0, al: [11], frozen: true },
          { name: 'Olive ascolane', desc: '10 pezzi', price: 6.0, al: [11], frozen: true },
          { name: 'Mozzarelline', desc: '10 pezzi', price: 6.0, al: [3, 11], frozen: true },
          { name: 'Jalapenos', desc: '6 pezzi', price: 6.0, al: [11], frozen: true },
          { name: 'Nuggets di pollo', desc: '6 pezzi', price: 5.0, al: [11], frozen: true },
          { name: 'Alette di pollo', desc: '5 pezzi', price: 6.0, frozen: true },
          { name: 'Anelli di cipolla', desc: '10 pezzi', price: 6.0, al: [11], frozen: true },
          { name: 'Chele di granchio', desc: '6 pezzi', price: 6.0, al: [5, 11], frozen: true },
          { name: 'Fritto misto di pesce', price: 14.0, al: [4, 5, 11], frozen: true },
          { name: 'Calamari fritti', price: 11.0, al: [11, 14], frozen: true },
        ],
      },
    ],
  },
  {
    id: 'kebab',
    label: 'Kebab & Falafel',
    intro: BASE_NOTE,
    baseAllergens: [11],
    groups: [
      {
        title: null,
        items: [
          { name: 'Panino kebab', desc: 'Kebab, insalata, cipolla, pomodoro, salse', price: 6.0, al: [3, 6, 7, 8, 9, 11] },
          { name: 'Piadina kebab', desc: 'Kebab, insalata, cipolla, pomodoro, salse', price: 7.0, al: [3, 6, 7, 8, 9, 11] },
          { name: 'Panino cotoletta', desc: 'Cotoletta, pomodoro, insalata, maionese', price: 7.5, al: [6, 8, 11] },
          { name: 'Panino falafel', desc: 'Falafel, insalata, cipolla, pomodoro, salse', price: 6.0, al: [3, 6, 7, 8, 9, 13] },
          { name: 'Vaschetta kebab', desc: 'Kebab, insalata, cipolla, pomodoro, salse', price: 8.0, al: [3, 6, 7, 8, 9, 11], noBase: true },
          { name: 'Kebab & focaccia', desc: 'Kebab, insalata, cipolla, pomodoro, salse, focaccia', price: 9.0, al: [3, 6, 7, 8, 9, 11] },
          { name: 'Cotoletta', desc: 'Con contorno di patatine*', price: 8.0, al: [11], noBase: true },
          { name: 'Seekh kebab', desc: '4 pezzi', price: 7.0, noBase: true },
        ],
      },
    ],
  },
  {
    id: 'dolci',
    label: 'Dolci',
    intro: null,
    baseAllergens: [11],
    groups: [
      {
        title: null,
        items: [
          { name: 'Focaccia Nutella', price: 5.0, al: [2, 3, 9] },
          { name: 'Focaccia Nutella + noci', price: 6.0, al: [2, 3, 9] },
          { name: 'Calzone Nutella', price: 5.0, al: [2, 3, 9] },
        ],
      },
    ],
  },
  {
    id: 'bevande',
    label: 'Bevande',
    intro: null,
    groups: [
      {
        title: null,
        items: [
          { name: 'Coca-Cola', price: 2.0 },
          { name: 'Coca-Cola Zero', price: 2.0 },
          { name: 'Sprite', price: 2.0 },
          { name: 'Fanta', price: 2.0 },
          { name: 'Tè al limone', price: 2.0 },
          { name: 'Tè alla pesca', price: 2.0 },
          { name: 'Acqua naturale', price: 1.0 },
          { name: 'Acqua frizzante', price: 1.0 },
          { name: 'Birra', desc: '33 cl', price: 2.0, al: [11] },
          { name: 'Birra', desc: '66 cl', price: 4.0, al: [11] },
        ],
      },
    ],
  },
];
