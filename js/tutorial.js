/* ============================================================
   tutorial.js — TOUR_STEPS, startTour, showTourStep,
                 nextTourStep, endTour
   ============================================================ */

const TOUR_STEPS = [
  {
    label:    'Krok 1 z 4',
    heading:  'Dashboard przed spotkaniem',
    body:     'Zanim wskoczysz na call z PM lub stakeholderem — rzuć tu okiem. Cztery liczby powiedzą Ci natychmiast: ile ryzyk blokuje projekt, ile wymaga omówienia i jaki jest ogólny stan.',
    target:    'stats-row',
    placement: 'below',
  },
  {
    label:    'Krok 2 z 4',
    heading:  'Lista ryzyk',
    body:     'Tu trzymasz wszystkie ryzyka projektu. Filtry u góry pozwalają szybko zawęzić widok — np. tylko blokujące albo tylko Twoje. Kliknij dowolny element, żeby zobaczyć szczegóły.',
    getTarget: () => window.getComputedStyle(document.getElementById('table-wrap')).display === 'none'
                      ? 'card-view' : 'table-wrap',
    placement: 'above',
  },
  {
    label:    'Krok 3 z 4',
    heading:  'Karta szczegółów',
    body:     'Po kliknięciu wiersza otwiera się ten panel. Masz tu opis ryzyka, konsekwencję, mitygację, właściciela i — nowość — gdzie planujemy wprowadzić zmianę.',
    target:    'detail-panel',
    placement: 'left',
    requiresOpen: true,
  },
  {
    label:    'Krok 4 z 4',
    heading:  'Panel akcji',
    body:     'Tu zmieniasz status ryzyka jednym kliknięciem: przenosisz do "W trakcie", zamykasz po mitygacji albo oznaczasz jako zmaterializowane. Możesz też odznaczać catch-up po omówieniu.',
    target:    'dp-actions-section',
    placement: 'left',
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

  // Ensure detail panel state matches the step
  if (tourStep >= 2 && !document.getElementById('detail-panel').classList.contains('open')) {
    selectRisk(risks[0].id);
  }
  if (tourStep < 2 && document.getElementById('detail-panel').classList.contains('open')) {
    closeDetail();
  }

  // Wait for panel animation on step 3
  const delay = tourStep === 2 ? 280 : 80;

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
    const ttW    = 280, ttH = 200, margin = 14;
    const vp     = { w: window.innerWidth, h: window.innerHeight };
    let top, left;

    if      (s.placement === 'below') { top = rect.bottom + pad + margin;          left = rect.left + rect.width / 2 - ttW / 2; }
    else if (s.placement === 'above') { top = rect.top - pad - margin - ttH;       left = rect.left + rect.width / 2 - ttW / 2; }
    else if (s.placement === 'left')  { top = rect.top + rect.height / 2 - ttH / 2; left = rect.left - ttW - margin; if (left < 8) left = rect.right + margin; }

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
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('tour-overlay').classList.contains('active')) endTour();
});
