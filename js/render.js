/* ============================================================
   render.js — HTML helpers + renderTable / renderCards / renderStats
   ============================================================ */

/* ---- HTML helpers ---- */

function lozenge(text, cfg) {
  return `<span class="lozenge" style="background:${cfg.bg};color:${cfg.text}">${text}</span>`;
}

function prioLozenge(p) {
  const c = PRIO[p] || {};
  return `<span class="lozenge" style="background:${c.bg};color:${c.text}">
            <span class="dot" style="background:${c.dot}"></span>${p}
          </span>`;
}

function ownerChip(o) {
  const cls      = o === 'PM' ? 'av-pm' : 'av-st';
  const initials = o === 'PM' ? 'PM'    : 'ST';
  return `<span class="owner-chip"><span class="av ${cls}">${initials}</span>${o}</span>`;
}

function changeBadges(changes) {
  if (!changes || !changes.length)
    return '<span style="color:var(--text-faint);font-size:12px">—</span>';
  return changes.map(c =>
    `<span class="change-badge">${CHANGE_LABELS[c] || c}</span>`
  ).join(' ');
}

/* ---- Table ---- */

function renderTable(data) {
  const tbody = document.getElementById('tbody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-faint)">
      Brak ryzyk pasujących do filtrów</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(r => {
    const sel     = selectedRow === r.id ? ' selected' : '';
    const flagHtml = r.flag === 'tak' ? `<span class="flag-badge">catch-up</span> ` : '';
    return `<tr class="${sel}" onclick="selectRisk(${r.id})">
      <td class="td-key">${r.key}</td>
      <td class="td-title">
        <div class="td-title-inner">
          <span>${flagHtml}${r.title}</span>
          <span class="td-desc">${r.desc}</span>
        </div>
      </td>
      <td>${prioLozenge(r.prio)}</td>
      <td>${lozenge(r.status, STATUS[r.status] || {})}</td>
      <td><div style="display:flex;flex-wrap:wrap;gap:3px">${changeBadges(r.change)}</div></td>
      <td>${ownerChip(r.owner)}</td>
      <td><span style="font-size:12px;color:var(--text-muted)">${r.author}</span></td>
    </tr>`;
  }).join('');
}

/* ---- Cards (mobile) ---- */

function renderCards(data) {
  const wrap = document.getElementById('card-view');
  if (!data.length) {
    wrap.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-faint)">Brak ryzyk</div>`;
    return;
  }
  wrap.innerHTML = data.map(r => {
    const flag = r.flag === 'tak' ? `<span class="flag-badge">catch-up</span>` : '';
    return `<div class="risk-card" onclick="selectRisk(${r.id})">
      <div class="rc-top">
        <div>
          <div class="td-key">${r.key}</div>
          <div class="rc-title">${flag} ${r.title}</div>
        </div>
        ${lozenge(r.status, STATUS[r.status] || {})}
      </div>
      <div class="rc-meta">
        ${prioLozenge(r.prio)}
        <div style="display:flex;flex-wrap:wrap;gap:3px">${changeBadges(r.change)}</div>
      </div>
      <div class="rc-footer">${ownerChip(r.owner)}<span style="font-size:11px;color:var(--text-muted)">${r.author}</span></div>
    </div>`;
  }).join('');
}

/* ---- Stats ---- */

function renderStats() {
  const active   = risks.filter(r => r.status === 'otwarty' || r.status === 'w trakcie').length;
  const blocking = risks.filter(r => r.prio === 'zatrzyma projekt' && r.status !== 'zamknięty' && r.status !== 'skipnięty').length;
  const catchup  = risks.filter(r => r.flag === 'tak' && (r.status === 'otwarty' || r.status === 'w trakcie')).length;

  const card = (label, value, filterKey, color) => `
    <div class="stat-card" onclick="setStatsFilter('${filterKey}')"
         style="cursor:pointer;${statsFilter === filterKey ? 'outline:2px solid var(--blue)' : ''}">
      <div class="stat-num" style="color:${color || 'var(--text)'}">${value}</div>
      <div class="stat-label">${label}</div>
    </div>`;

  document.getElementById('stats-row').innerHTML =
    card('Blokujących projekt', blocking, 'blocking', 'var(--prio-high-text)') +
    card('Wymaga catch-upu',    catchup,  'catchup',  'var(--prio-mid-text)')  +
    card('Aktywnych',           active,   'active',   'var(--blue)')           +
    card('Wszystkich ryzyk',    risks.length, 'all');
}

/* ---- Master render ---- */

function render() {
  const filtered = getSorted(getFiltered());
  renderTable(filtered);
  renderCards(filtered);
  renderStats();
}
