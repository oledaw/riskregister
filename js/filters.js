/* ============================================================
   filters.js — getFiltered, getSorted, setSort, statsFilter,
                toggleFilters, clearFilters
   ============================================================ */

let sortState    = { field: null, dir: 'asc' };
let statsFilter  = 'all';

/* ---- Filter ---- */

function getFiltered() {
  const q  = document.getElementById('search-input').value.toLowerCase();
  const fs = document.getElementById('filter-status').value;
  const fp = document.getElementById('filter-prio').value;
  const fc = document.getElementById('filter-change').value;

  let data = risks.filter(r => {
    if (q && ![r.title, r.key, r.desc, r.cons, r.mit].some(s => s.toLowerCase().includes(q))) return false;
    if (fs && r.status !== fs) return false;
    if (fp && r.prio !== fp) return false;
    if (fc && !(r.change || []).includes(fc)) return false;
    return true;
  });

  if (statsFilter === 'active')   data = data.filter(r => r.status === 'otwarty' || r.status === 'w trakcie');
  if (statsFilter === 'blocking') data = data.filter(r => r.prio === 'zatrzyma projekt' && r.status !== 'zamknięty' && r.status !== 'skipnięty');
  if (statsFilter === 'catchup')  data = data.filter(r => r.flag === 'tak' && (r.status === 'otwarty' || r.status === 'w trakcie'));

  return data;
}

/* ---- Sort ---- */

function getSorted(data) {
  if (!sortState.field) return data;
  const dir = sortState.dir === 'asc' ? 1 : -1;
  return [...data].sort((a, b) => {
    switch (sortState.field) {
      case 'key':    return (parseInt(a.key.split('-')[1]) - parseInt(b.key.split('-')[1])) * dir;
      case 'title':  return ((b.flag === 'tak' ? 1 : 0) - (a.flag === 'tak' ? 1 : 0)) * dir;
      case 'prio': {
        const po = { 'zatrzyma projekt':3, 'psuje rezultat':2, 'przesuwa termin':1 };
        return (po[b.prio] - po[a.prio]) * dir;
      }
      case 'status': {
        const so = { 'otwarty':1, 'w trakcie':2, 'zamknięty':3, 'zmaterializowany':4, 'skipnięty':5 };
        return (so[a.status] - so[b.status]) * dir;
      }
      case 'owner':  return a.owner.localeCompare(b.owner) * dir;
      case 'author': return a.author.localeCompare(b.author) * dir;
      default:       return 0;
    }
  });
}

function setSort(field) {
  sortState.dir   = sortState.field === field && sortState.dir === 'asc' ? 'desc' : 'asc';
  sortState.field = field;
  render();
}

function setStatsFilter(filter) {
  statsFilter = filter;
  selectedRow = null;
  render();
}

/* ---- Dropdown UI ---- */

function toggleFilters() {
  document.getElementById('filter-dropdown').classList.toggle('open');
}

function clearFilters() {
  ['filter-status', 'filter-prio', 'filter-change'].forEach(id => {
    document.getElementById(id).value = '';
  });
  render();
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrapper = document.querySelector('.filter-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('filter-dropdown').classList.remove('open');
  }
});
