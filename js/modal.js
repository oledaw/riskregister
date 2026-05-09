/* ============================================================
   modal.js — openModal, editRisk, closeModal, saveRisk,
              selectPrio, toggleChange, resetChangePickerUI, setChangePicker
   ============================================================ */

let selectedPrio    = '';
let selectedChanges = [];
let editingId       = null;

/* ---- Prio picker ---- */

function selectPrio(el) {
  document.querySelectorAll('.prio-opt').forEach(o => o.className = 'prio-opt');
  selectedPrio = el.dataset.prio;
  el.classList.add(PRIO[selectedPrio]?.sel || '');
}

/* ---- Change picker ---- */

function toggleChange(el) {
  const val = el.dataset.change;
  if (selectedChanges.includes(val)) {
    selectedChanges = selectedChanges.filter(c => c !== val);
    el.classList.remove('selected');
  } else {
    selectedChanges.push(val);
    el.classList.add('selected');
  }
}

function resetChangePickerUI() {
  selectedChanges = [];
  document.querySelectorAll('.change-opt').forEach(o => o.classList.remove('selected'));
}

function setChangePicker(values) {
  resetChangePickerUI();
  (values || []).forEach(val => {
    selectedChanges.push(val);
    const el = document.querySelector(`.change-opt[data-change="${val}"]`);
    if (el) el.classList.add('selected');
  });
}

/* ---- Shared reset helpers ---- */

function _resetAiUI() {
  document.getElementById('ai-confirm-banner').classList.remove('visible');
  document.getElementById('ai-loading').classList.remove('visible');
  document.getElementById('btn-ai').disabled = false;
}

function _resetPrioPicker() {
  document.querySelectorAll('.prio-opt').forEach(o => o.className = 'prio-opt');
  selectedPrio = '';
}

/* ---- Open (create) ---- */

function openModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Utwórz ryzyko';
  document.getElementById('f-title').value  = '';
  document.getElementById('f-desc').value   = '';
  document.getElementById('f-cons').value   = '';
  document.getElementById('f-mit').value    = '';
  document.getElementById('f-author').value = 'PM';
  document.getElementById('f-owner').value  = 'PM';
  document.getElementById('f-flag').checked = false;
  _resetPrioPicker();
  resetChangePickerUI();
  _resetAiUI();
  document.querySelector('.modal-footer .btn-primary').textContent = 'Utwórz ryzyko';
  document.getElementById('modal-backdrop').classList.add('open');
}

/* ---- Open (edit) ---- */

function editRisk(id) {
  const r = risks.find(x => x.id === id);
  if (!r) return;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Edytuj ryzyko';
  document.getElementById('f-title').value  = r.title;
  document.getElementById('f-desc').value   = r.desc;
  document.getElementById('f-cons').value   = r.cons;
  document.getElementById('f-mit').value    = r.mit;
  document.getElementById('f-author').value = r.author;
  document.getElementById('f-owner').value  = r.owner;
  document.getElementById('f-flag').checked = r.flag === 'tak';
  document.querySelectorAll('.prio-opt').forEach(o => {
    o.className = 'prio-opt';
    if (o.dataset.prio === r.prio) o.classList.add(PRIO[r.prio]?.sel || '');
  });
  selectedPrio = r.prio;
  setChangePicker(r.change || []);
  _resetAiUI();
  document.querySelector('.modal-footer .btn-primary').textContent = 'Zapisz zmiany';
  document.getElementById('modal-backdrop').classList.add('open');
}

/* ---- Close ---- */

function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-backdrop')) closeModal();
}

/* ---- Save ---- */

function saveRisk() {
  const title = document.getElementById('f-title').value.trim();
  if (!title)       { alert('Wpisz tytuł ryzyka.'); return; }
  if (!selectedPrio){ alert('Wybierz efekt.');       return; }

  const data = {
    title,
    desc:   document.getElementById('f-desc').value.trim(),
    cons:   document.getElementById('f-cons').value.trim(),
    prio:   selectedPrio,
    change: [...selectedChanges],
    author: document.getElementById('f-author').value,
    mit:    document.getElementById('f-mit').value.trim(),
    owner:  document.getElementById('f-owner').value,
    flag:   document.getElementById('f-flag').checked ? 'tak' : 'nie',
  };

  if (editingId) {
    const idx = risks.findIndex(x => x.id === editingId);
    if (idx >= 0) risks[idx] = { ...risks[idx], ...data, changed: data.author };
    closeModal();
    selectRisk(editingId);
  } else {
    const now = new Date().toLocaleDateString('pl-PL', { day:'numeric', month:'short', year:'numeric' });
    risks.unshift({ id: getNextId(), key: 'RR-' + getNextKey(), ...data, status: 'otwarty', added: now, changed: '—' });
    closeModal();
    render();
  }
}

/* ---- Import JSON ---- */

async function importFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) {
      alert('Schowek jest pusty.');
      return;
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      alert('Schowek nie zawiera poprawnego formatu JSON.');
      return;
    }

    const {
      title,
      desc,
      cons,
      prio,
      author,
      mit,
      change,
      owner,
      flag,
      status,
      added,
      changed
    } = data;

    if (!title) {
      alert('Brak pola "title" w JSON. Ryzyko musi posiadać tytuł.');
      return;
    }

    const now = new Date().toLocaleDateString('pl-PL', { day:'numeric', month:'short', year:'numeric' });

    risks.unshift({
      id: getNextId(),
      key: 'RR-' + getNextKey(),
      title: title || '',
      desc: desc || '',
      cons: cons || '',
      prio: prio || 'przesuwa termin',
      author: author || 'PM',
      mit: mit || '',
      change: Array.isArray(change) ? change : [],
      owner: owner || 'PM',
      flag: flag || 'nie',
      status: status || 'otwarty',
      added: added || now,
      changed: changed || '—'
    });

    render();
    alert('Zaimportowano ryzyko z JSON.');
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
    alert('Nie udało się odczytać ze schowka. Upewnij się, że masz odpowiednie uprawnienia w przeglądarce.');
  }
}

/* ---- Export & Import Register ---- */

function exportRegister() {
  const dataStr = JSON.stringify(risks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `risk_register_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

function importRegister(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) {
        alert("Plik nie zawiera poprawnej listy ryzyk (oczekiwano tablicy JSON).");
        return;
      }
      
      const validRisks = parsed.filter(r => r.title && typeof r.id !== 'undefined' && r.key);
      if (validRisks.length === 0) {
        alert("Plik nie zawiera poprawnych ryzyk.");
        return;
      }
      
      if (confirm(`Czy na pewno chcesz nadpisać obecny rejestr ${validRisks.length} ryzykami z pliku? Poprzednie dane zostaną usunięte.`)) {
        risks = validRisks;
        render();
        alert("Rejestr został zaimportowany.");
      }
    } catch (err) {
      console.error(err);
      alert("Błąd podczas parsowania pliku JSON.");
    }
  };
  reader.readAsText(file);
  event.target.value = ""; // Reset file input
}

/* ---- Action Menu Toggle ---- */

function toggleActionMenu() {
  const dropdown = document.getElementById('action-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

// Close action menu when clicking outside
document.addEventListener('click', e => {
  const wrapper = document.querySelector('.action-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    const dropdown = document.getElementById('action-dropdown');
    if (dropdown) {
      dropdown.classList.remove('open');
    }
  }
});

/* ---- Clear Local Storage ---- */

function clearLocalStorage() {
  if (confirm("Czy na pewno chcesz usunąć wszystkie dane z pamięci przeglądarki?\n\nZostaną przywrócone dane domyślne. Operacji nie można cofnąć.")) {
    localStorage.removeItem('riskRegisterData');
    location.reload();
  }
}
