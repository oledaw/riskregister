/* ============================================================
   data.js — risks[], PRIO, STATUS, CHANGE_LABELS lookups
   ============================================================ */

const PRIO = {
  'przesuwa termin':  { bg:'var(--prio-low-bg)',  text:'var(--prio-low-text)',  dot:'var(--prio-low-dot)',  sel:'sel-low'  },
  'psuje rezultat':   { bg:'var(--prio-mid-bg)',  text:'var(--prio-mid-text)',  dot:'var(--prio-mid-dot)',  sel:'sel-mid'  },
  'zatrzyma projekt': { bg:'var(--prio-high-bg)', text:'var(--prio-high-text)', dot:'var(--prio-high-dot)', sel:'sel-high' },
};

const STATUS = {
  'otwarty':          { bg:'var(--status-open-bg)',     text:'var(--status-open-text)'     },
  'w trakcie':        { bg:'var(--status-progress-bg)', text:'var(--status-progress-text)' },
  'zamknięty':        { bg:'var(--status-done-bg)',     text:'var(--status-done-text)'     },
  'zmaterializowany': { bg:'var(--status-mat-bg)',      text:'var(--status-mat-text)'      },
  'skipnięty':        { bg:'var(--status-skip-bg)',     text:'var(--status-skip-text)'     },
};

const CHANGE_LABELS = {
  'wymagania':  'Wymagania',
  'plan':       'Plan',
  'zespół':     'Zespół',
  'komunikacja':'Komunikacja',
  'tech':       'Rozwiązanie tech.',
};

let risks = [
  {
    id: 2, key: 'RR-1',
    title: 'Projekt cofnięty do analizy technicznej',
    desc:  'Jeżeli pominiemy analizę Solution Architecta przed startem fazy dev, to zespół może chcieć cofnąć projekt',
    cons:  'Restart analizy, koncepcja PM-a zostanie uznana za nieprzemyślaną — strata 2–3 tygodni',
    prio: 'zatrzyma projekt', author: 'PM',
    mit:   'Zaplanować sesję z SA przed startem sprintu. PM rezerwuje slot, stakeholder potwierdza priorytety.',
    change: ['wymagania','plan'],
    owner: 'PM', flag: 'tak', status: 'otwarty', added: '30 kwi 2026', changed: '—',
  },
  {
    id: 3, key: 'RR-2',
    title: 'Developer podbierany do innych projektów',
    desc:  'Jeżeli developer zostanie przydzielony do innych zadań, zabraknie mocy przerobowych',
    cons:  'Opóźnienie realizacji, ryzyko niedostarczenia projektu X w terminie',
    prio: 'psuje rezultat', author: 'Stakeholder',
    mit:   'Stakeholder formalnie zabezpiecza dedykację. PM monitoruje alokację co tydzień i eskaluje przy pierwszym sygnale.',
    change: ['zespół'],
    owner: 'Stakeholder', flag: 'nie', status: 'w trakcie', added: '30 kwi 2026', changed: 'Stakeholder',
  },
  {
    id: 4, key: 'RR-3',
    title: 'Formularz rejestru zbyt ciężki w uzupełnianiu',
    desc:  'Jeżeli formularz będzie skomplikowany, nikt nie będzie go regularnie wypełniał',
    cons:  'Rejestr staje się martwy — brak danych, brak mitygacji, projekt nieprzewidywalny',
    prio: 'zatrzyma projekt', author: 'PM',
    mit:   'Uprościć do minimum. PM i stakeholder testują formularz przed wdrożeniem i wspólnie decydują o formie.',
    change: ['komunikacja'],
    owner: 'PM', flag: 'tak', status: 'otwarty', added: '30 kwi 2026', changed: 'Stakeholder',
  },
  {
    id: 5, key: 'RR-4',
    title: 'Opóźnienia w odpowiedziach między zespołami',
    desc:  'Jeżeli któryś z zespołów będzie zwlekał z odpowiedzią, to pozostałe zespoły będą blokowane w pracy',
    cons:  'Spadek płynności pracy, kumulacja blokad i realne zagrożenie dla timeline całego projektu',
    prio: 'psuje rezultat', author: 'PM',
    mit:   'Ustalić SLA na odpowiedzi między zespołami (np. 24h). PM monitoruje blokery i eskaluje przy przekroczeniach.',
    change: ['komunikacja'],
    owner: 'PM', flag: 'tak', status: 'otwarty', added: '1 maj 2026', changed: '—',
  },
  {
    id: 6, key: 'RR-5',
    title: 'Brak wspólnego zrozumienia procesu',
    desc:  'Jeżeli zespoły nie będą miały wspólnego spojrzenia na proces, mogą różnie interpretować wymagania',
    cons:  'Niejednoznaczna implementacja, rozjazd między komponentami i konieczność reworku',
    prio: 'zatrzyma projekt', author: 'PM',
    mit:   "Zorganizować warsztat alignmentowy. Spisać i zatwierdzić flow procesu oraz edge case'y przed rozpoczęciem developmentu.",
    change: ['wymagania','komunikacja'],
    owner: 'PM', flag: 'tak', status: 'otwarty', added: '1 maj 2026', changed: '—',
  },
  {
    id: 7, key: 'RR-6',
    title: 'Brak danych do endpointów dla Webcon',
    desc:  'Jeżeli Webcon nie otrzyma wymaganych danych do endpointów, nie będzie w stanie poprawnie zasilić UI',
    cons:  'Brak działania kluczowych funkcji UI, blokada testów i opóźnienie wdrożenia',
    prio: 'zatrzyma projekt', author: 'Stakeholder',
    mit:   'Zdefiniować kontrakty API upfront. Backend dostarcza mocki danych, a Webcon rozpoczyna integrację równolegle.',
    change: ['tech','wymagania'],
    owner: 'Stakeholder', flag: 'tak', status: 'w trakcie', added: '1 maj 2026', changed: 'Stakeholder',
  },
  {
    id: 8, key: 'RR-7',
    title: 'Feature X nie spełnia oczekiwań, potrzebne dodatkowe zmiany',
    desc:  'Jeżeli wymagania nie będą w pełni doprecyzowane, zespół może implementować błędne założenia',
    cons:  'Rework, opóźnienia i potencjalne niedostarczenie wartości biznesowej',
    prio: 'psuje rezultat', author: 'PM',
    mit:   'Wprowadzić checkpointy akceptacji wymagań przez stakeholdera przed developmentem. Każdy feature musi mieć jasne acceptance criteria.',
    change: ['wymagania'],
    owner: 'PM', flag: 'nie', status: 'otwarty', added: '1 maj 2026', changed: '—',
  },
  {
    id: 9, key: 'RR-8',
    title: 'Brak dostępności kluczowego stakeholdera',
    desc:  'Jeżeli stakeholder nie będzie dostępny do szybkich decyzji, zespół może utknąć na blokadach',
    cons:  'Opóźnienia decyzyjne, zatrzymanie prac i ryzyko przekroczenia terminów',
    prio: 'przesuwa termin', author: 'PM',
    mit:   'Zarezerwować cykliczne sloty decyzyjne. Ustalić zastępstwo decyzyjne na czas niedostępności.',
    change: ['komunikacja','zespół'],
    owner: 'Stakeholder', flag: 'tak', status: 'otwarty', added: '1 maj 2026', changed: '—',
  },
  {
    id: 10, key: 'RR-9',
    title: 'Brak środowiska testowego na czas',
    desc:  'Jeżeli środowisko testowe nie będzie gotowe na czas, nie będzie możliwości walidacji rozwiązania',
    cons:  "Opóźnienie testów, kumulacja błędów i ryzyko przesunięcia release'u",
    prio: 'psuje rezultat', author: 'PM',
    mit:   'Zarezerwować przygotowanie środowiska jako osobny task z ownerem. Monitorować gotowość przed startem testów.',
    change: ['plan','tech'],
    owner: 'PM', flag: 'nie', status: 'w trakcie', added: '1 maj 2026', changed: 'PM',
  },
];

function getNextId()  { return Math.max(...risks.map(r => r.id))  + 1; }
function getNextKey() { return Math.max(...risks.map(r => parseInt(r.key.replace('RR-',''), 10))) + 1; }
