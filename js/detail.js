/* ============================================================
   detail.js — selectRisk, closeDetail, changeStatus,
               markCatchupDiscussed
   ============================================================ */

let selectedRow = null;

const NEXT_STATUSES = {
  'otwarty':          [['w trakcie','→ W trakcie'], ['zamknięty','Zamknij'], ['zmaterializowany','Zmaterializował się'], ['skipnięty','Skipnij']],
  'w trakcie':        [['zamknięty','Zamknij'], ['zmaterializowany','Zmaterializował się']],
  'zamknięty':        [['otwarty','Otwórz ponownie']],
  'zmaterializowany': [['zamknięty','Archiwizuj']],
  'skipnięty':        [['otwarty','Otwórz ponownie']],
};

function selectRisk(id) {
  selectedRow = id;
  const r = risks.find(x => x.id === id);
  if (!r) return;
  render();

  const statusBtns = (NEXT_STATUSES[r.status] || []).map(([s, l]) =>
    `<button class="btn-action${s === 'zmaterializowany' ? ' danger' : ''}"
             onclick="changeStatus(${r.id},'${s}')">${l}</button>`
  ).join('');

  document.getElementById('dp-key').textContent   = r.key;
  document.getElementById('dp-title').textContent = r.title;
  document.getElementById('dp-body').innerHTML = `
    <div class="dp-section">
      <div class="dp-row"><span class="dp-label">Status</span>    <span class="dp-value">${lozenge(r.status, STATUS[r.status] || {})}</span></div>
      <div class="dp-row"><span class="dp-label">Efekt</span>     <span class="dp-value">${prioLozenge(r.prio)}</span></div>
      ${r.flag === 'tak' ? `<div class="dp-row"><span class="dp-label">Catch-up</span><span class="dp-value"><span class="flag-badge">wymaga omówienia</span></span></div>` : ''}
      <div class="dp-row"><span class="dp-label">Właściciel</span><span class="dp-value">${ownerChip(r.owner)}</span></div>
      <div class="dp-row"><span class="dp-label">Dodał</span>     <span class="dp-value">${ownerChip(r.author)}</span></div>
      <div class="dp-row">
        <span class="dp-label">Zmiana w</span>
        <span class="dp-value"><div class="dp-change-list">${changeBadges(r.change)}</div></span>
      </div>
    </div>

    <div class="dp-section">
      <div class="dp-section-title">Opis</div>
      <div class="dp-text-block">${r.desc}</div>
    </div>

    <div class="dp-section">
      <div class="dp-section-title">Konsekwencja</div>
      <div class="dp-text-block">${r.cons}</div>
    </div>

    <div class="dp-section">
      <div class="dp-section-title">Mitygacja</div>
      <div class="dp-text-block">${r.mit}</div>
    </div>

    <div class="dp-section" id="dp-actions-section">
      <div class="dp-section-title">Akcje</div>
      <div class="dp-actions">
        <button class="btn-action" onclick="editRisk(${r.id})">Edytuj</button>
        <button class="btn-action" data-copy-btn onclick="copyRiskJson(${r.id})">Kopiuj JSON</button>
        ${r.flag === 'tak' ? `<button class="btn-action" onclick="markCatchupDiscussed(${r.id})">Omówiono (odznacz catch-up)</button>` : ''}
        ${statusBtns}
      </div>
    </div>

    <div style="padding:12px 0 4px;font-size:11px;color:var(--text-faint)">
      Dodano: ${r.added} przez ${r.author}
      ${r.changed && r.changed !== '—' ? ' · Zmienione przez: ' + r.changed : ''}
    </div>`;

  document.getElementById('detail-panel').classList.add('open');
}

function closeDetail() {
  selectedRow = null;
  document.getElementById('detail-panel').classList.remove('open');
  render();
}

function changeStatus(id, status) {
  const r = risks.find(x => x.id === id);
  if (r) { r.status = status; r.changed = 'teraz'; }
  selectRisk(id);
}

function copyRiskJson(id) {
  const r = risks.find(x => x.id === id);
  if (!r) return;
  const payload = {
    id: r.id, key: r.key,
    title: r.title, desc: r.desc, cons: r.cons,
    prio: r.prio, author: r.author,
    mit: r.mit, change: r.change,
    owner: r.owner, flag: r.flag,
    status: r.status, added: r.added, changed: r.changed,
  };
  navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
    const btn = document.querySelector('[data-copy-btn]');
    if (btn) { btn.textContent = 'Skopiowano ✓'; setTimeout(() => { btn.textContent = 'Kopiuj JSON'; }, 2000); }
  });
}

function markCatchupDiscussed(id) {
  const r = risks.find(x => x.id === id);
  if (!r) return;
  r.flag = 'nie'; r.changed = 'teraz';
  selectRisk(id);
}
