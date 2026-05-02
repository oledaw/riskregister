/* ============================================================
   tutorial.js — TOUR_STEPS, startTour, showTourStep,
                 nextTourStep, endTour
   ============================================================ */

const TOUR_STEPS = [
  {
    label:    'Krok 1 z 5',
    heading:  'Dashboard przed spotkaniem',
    body:     'Zanim wskoczysz na call z PM lub stakeholderem — rzuć tu okiem. Cztery liczby powiedzą Ci natychmiast: ile ryzyk blokuje projekt, ile wymaga omówienia i jaki jest ogólny stan.',
    target:    'stats-row',
    placement: 'below',
  },
  {
    label:    'Krok 2 z 5',
    heading:  'Lista ryzyk',
    body:     'Tu trzymasz wszystkie ryzyka projektu. Filtry u góry pozwalają szybko zawęzić widok — np. tylko blokujące albo tylko Twoje. Kliknij dowolny element, żeby zobaczyć szczegóły.',
    getTarget: () => window.getComputedStyle(document.getElementById('table-wrap')).display === 'none'
                      ? 'card-view' : 'table-wrap',
    placement: 'above',
  },
  {
    label:    'Krok 3 z 5',
    heading:  'Karta szczegółów',
    body:     'Po kliknięciu wiersza otwiera się ten panel. Masz tu opis ryzyka, konsekwencję, mitygację, właściciela i gdzie planujemy wprowadzić zmianę.',
    target:    'detail-panel',
    placement: 'left',
    requiresOpen: true,
  },
  {
    label:    'Krok 4 z 5',
    heading:  'Panel akcji',
    body:     'Tu zmieniasz status ryzyka jednym kliknięciem: przenosisz do "W trakcie", zamykasz po mitygacji albo oznaczasz jako zmaterializowane. Możesz też odznaczać catch-up po omówieniu.',
    target:    'dp-actions-section',
    placement: 'left',
  },
  {
    label:    'Krok 5 z 5',
    heading:  'Uzupełnij ryzyko z pomocą AI',
    body:     'Wpisz luźną notatkę w polu Opis i kliknij „Uzupełnij AI". AI przeanalizuje notatkę i automatycznie wypełni tytuł, konsekwencję, efekt, mitygację i obszary zmiany. Możesz potem ręcznie poprawić każde pole.',
    target:    'btn-ai',
    placement: 'below',
    requiresModal: true,
  },
];

let tourStep = 0;

function startTour() {
  closeDetail();
  tourStep = 0;
  document.getElementById('tour-overlay').classList.add('active');
  showTourStep();
}

function showTourStep() {
  const s = TOUR_STEPS[tourStep];

  // Step 5 (requiresModal): close detail, open modal
  if (s.requiresModal) {
    if (document.getElementById('detail-panel').classList.contains('open')) closeDetail();
    if (!document.getElementById('modal-backdrop').classList.contains('open')) openModal();
  } else {
    // Close modal if we navigated back from step 5
    if (document.getElementById('modal-backdrop').classList.contains('open')) closeModal();

    // Steps 3-4: ensure detail panel is open
    if (tourStep >= 2 && !document.getElementById('detail-panel').classList.contains('open')) {
      selectRisk(risks[0].id);
    }
    // Steps 1-2: ensure detail panel is closed
    if (tourStep < 2 && document.getElementById('detail-panel').classList.contains('open')) {
      closeDetail();
    }
  }

  // Longer delay for modal open animation (step 5) or panel animation (step 3)
  const delay = s.requiresModal ? 320 : tourStep === 2 ? 280 : 80;

  setTimeout(() => {
    const targetId = typeof s.getTarget === 'function' ? s.getTarget() : s.target;
    const el       = document.getElementById(targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const pad  = 6;
    const pos  = { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 };

    [document.getElementById('tour-cutout'), document.getElementById('tour-ring')].forEach(e => {
      e.style.top    = pos.top    + 'px';
      e.style.left   = pos.left   + 'px';
      e.style.width  = pos.width  + 'px';
      e.style.height = pos.height + 'px';
    });

    // Tooltip positioning
    const tt     = document.getElementById('tour-tooltip');
    const ttW    = 280, ttH = 220, margin = 14;
    const vp     = { w: window.innerWidth, h: window.innerHeight };
    let top, left;

    if      (s.placement === 'below') { top = rect.bottom + pad + margin;            left = rect.left + rect.width / 2 - ttW / 2; }
    else if (s.placement === 'above') { top = rect.top - pad - margin - ttH;         left = rect.left + rect.width / 2 - ttW / 2; }
    else if (s.placement === 'left')  { top = rect.top + rect.height / 2 - ttH / 2; left = rect.left - ttW - margin; if (left < 8) left = rect.right + margin; }
    else if (s.placement === 'right') { top = rect.top + rect.height / 2 - ttH / 2; left = rect.right + margin; }

    left = Math.max(8, Math.min(left, vp.w - ttW - 8));
    top  = Math.max(8, Math.min(top,  vp.h - ttH - 8));

    tt.style.top  = top  + 'px';
    tt.style.left = left + 'px';

    document.getElementById('tt-step').textContent    = s.label;
    document.getElementById('tt-heading').textContent = s.heading;
    document.getElementById('tt-body').textContent    = s.body;

    document.getElementById('tt-dots').innerHTML = TOUR_STEPS.map((_, i) =>
      `<span class="tt-dot ${i === tourStep ? 'on' : ''}"></span>`
    ).join('');

    const btn    = document.getElementById('tt-next-btn');
    const isLast = tourStep === TOUR_STEPS.length - 1;
    btn.textContent = isLast ? 'Rozumiem ✓' : 'Dalej →';
    btn.className   = 'tt-next' + (isLast ? ' finish' : '');
  }, delay);
}

function nextTourStep() {
  if (tourStep < TOUR_STEPS.length - 1) { tourStep++; showTourStep(); }
  else endTour();
}

function endTour() {
  document.getElementById('tour-overlay').classList.remove('active');
  if (document.getElementById('modal-backdrop').classList.contains('open')) closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('tour-overlay').classList.contains('active')) endTour();
});
