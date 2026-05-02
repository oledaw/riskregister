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
