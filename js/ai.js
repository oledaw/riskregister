/* ============================================================
   ai.js — triggerAiConfirm, cancelAiConfirm, runAiFill,
           applyAiResult (+ mock fallback)
   ============================================================ */

const AI_SYSTEM_PROMPT = `Jesteś asystentem PM-a który zarządza rejestrem ryzyk projektowych.
Na podstawie luźnej notatki użytkownika wygeneruj kompletny wpis ryzyka w JSON.
Odpowiedz WYŁĄCZNIE poprawnym JSON, bez markdown, bez komentarzy.

Format:
{
  "title": "krótki tytuł ryzyka (max 12 słów, zaczyna się od rzeczownika lub podmiotu)",
  "desc": "pełny opis w formie: Jeżeli X, to Y — jedno lub dwa zdania",
  "cons": "konkretna konsekwencja dla projektu — co się stanie, jaki narzut, ile czasu",
  "prio": "przesuwa termin" | "psuje rezultat" | "zatrzyma projekt",
  "mit": "konkretna mitygacja — kto, co, kiedy, jedno lub dwa zdania",
  "change": tablica zawierająca dowolne z: "wymagania", "plan", "zespół", "komunikacja", "tech"
}

Zasady:
- prio dobieraj według realnego wpływu na projekt
- change wybieraj tylko te obszary które faktycznie wymagają zmiany przy tej mitygacji
- Pisz po polsku, zwięźle i konkretnie`;

const AI_MOCK = {
  title:  'Nieautoryzowane angażowanie developera w zadania spoza projektu',
  desc:   'Jeżeli developer będzie regularnie odrywany od zadań projektowych do prac w projekcie MAIN, to harmonogram bieżącego projektu ulegnie opóźnieniu.',
  cons:   'Przesunięcie terminu dostarczenia o około 2 tygodnie, konieczność renegocjacji harmonogramu z interesariuszami oraz ryzyko kar umownych lub utraty zaufania klienta.',
  prio:   'przesuwa termin',
  mit:    'Eskalacja do PMO celem ustalenia jednoznacznej alokacji developera.',
  change: ['zespół'],
};

/* ---- Step 1: show confirm banner ---- */

function triggerAiConfirm() {
  const desc = document.getElementById('f-desc').value.trim();
  if (!desc) { alert('Najpierw wpisz opis ryzyka w polu Opis.'); return; }
  document.getElementById('ai-confirm-banner').classList.add('visible');
  document.getElementById('btn-ai').disabled = true;
  document.getElementById('ai-confirm-banner').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cancelAiConfirm() {
  document.getElementById('ai-confirm-banner').classList.remove('visible');
  document.getElementById('btn-ai').disabled = false;
}

/* ---- Step 2: call API (with mock fallback) ---- */

async function runAiFill() {
  document.getElementById('ai-confirm-banner').classList.remove('visible');
  document.getElementById('ai-loading').classList.add('visible');

  const desc = document.getElementById('f-desc').value.trim();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     AI_SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: desc }],
      }),
    });

    const data   = await response.json();
    const raw    = data.content?.find(b => b.type === 'text')?.text || '';
    const clean  = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    applyAiResult(result);

  } catch (err) {
    console.warn('AI unavailable, using mock:', err);
    applyAiResult(AI_MOCK);

  } finally {
    document.getElementById('ai-loading').classList.remove('visible');
    document.getElementById('btn-ai').disabled = false;
  }
}

/* ---- Step 3: populate form fields ---- */

function applyAiResult(r) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (!el || val === undefined) return;
    el.value = val;
    el.classList.add('ai-filled');
    setTimeout(() => el.classList.remove('ai-filled'), 2000);
  };

  set('f-title', r.title);
  set('f-desc',  r.desc);
  set('f-cons',  r.cons);
  set('f-mit',   r.mit);

  // Efekt picker
  if (r.prio && PRIO[r.prio]) {
    document.querySelectorAll('.prio-opt').forEach(o => o.className = 'prio-opt');
    selectedPrio = r.prio;
    const el = document.querySelector(`.prio-opt[data-prio="${r.prio}"]`);
    if (el) {
      el.classList.add(PRIO[r.prio].sel);
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Zmiana w picker
  if (Array.isArray(r.change)) setChangePicker(r.change);
}
