// ── State ──────────────────────────────────────────────────────────────
let state = JSON.parse(localStorage.getItem('budget-data') || 'null') || deepClone(BUDGET_DATA);

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }
function fmt(v, decimals = 0) {
  if (v === null || v === undefined) return '—';
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v) + ' €';
}
function fmtSigned(v) {
  if (v === 0) return '—';
  return (v > 0 ? '+' : '') + fmt(v);
}
function save() {
  localStorage.setItem('budget-data', JSON.stringify(state));
  const el = document.getElementById('save-status');
  el.textContent = '✓ Sauvegardé';
  el.style.color = 'var(--green)';
}

// ── Totals ─────────────────────────────────────────────────────────────
function catTotals(cat) {
  const planned = cat.items.reduce((s, i) => s + (i.planned || 0), 0);
  const actual = cat.items.reduce((s, i) => s + (i.actual || 0), 0);
  return { planned, actual };
}
function globalTotals() {
  let planned = 0, actual = 0;
  state.categories.forEach(c => { const t = catTotals(c); planned += t.planned; actual += t.actual; });
  return { planned, actual };
}
function incomeTotals() {
  return state.income.reduce((s, i) => s + (i.planned || 0), 0);
}

// ── Navigation ─────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    link.classList.add('active');
    document.getElementById('view-' + link.dataset.view).classList.add('active');
    if (link.dataset.view === 'details') renderDetails();
    if (link.dataset.view === 'abos') renderAbos();
    if (link.dataset.view === 'dashboard') renderDashboard();
  });
});

// ── Dashboard ──────────────────────────────────────────────────────────
function renderDashboard() {
  const { planned, actual } = globalTotals();
  const income = incomeTotals();
  const balance = income - actual;
  const pct = planned > 0 ? Math.round(actual / planned * 100) : 0;

  document.getElementById('kpi-income').textContent = fmt(income);
  document.getElementById('kpi-planned').textContent = fmt(planned);
  document.getElementById('kpi-actual').textContent = fmt(actual);
  document.getElementById('kpi-pct').textContent = pct + '% du budget';
  const balEl = document.getElementById('kpi-balance');
  balEl.textContent = fmtSigned(balance);
  balEl.style.color = balance >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('donut-total').textContent = fmt(planned);

  renderCatBars();
  renderDonut();
  renderAlerts();
}

function renderCatBars() {
  const container = document.getElementById('cat-bars');
  const { planned: gPlanned } = globalTotals();
  container.innerHTML = state.categories.map(cat => {
    const { planned, actual } = catTotals(cat);
    if (planned === 0 && actual === 0) return '';
    const pct = planned > 0 ? Math.min(actual / planned * 100, 150) : 0;
    const barColor = pct > 100 ? 'var(--red)' : pct > 80 ? 'var(--amber)' : cat.color;
    return `<div class="cat-bar-row">
      <div class="cat-bar-meta">
        <div class="cat-bar-label"><span>${cat.icon}</span> ${cat.label}</div>
        <div class="cat-bar-amounts">${fmt(actual)} / ${fmt(planned)}</div>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-fill" style="width:${Math.min(pct,100)}%;background:${barColor}"></div>
      </div>
    </div>`;
  }).join('');
}

function renderDonut() {
  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');
  const cx = 100, cy = 100, r = 72, strokeW = 22;
  const cats = state.categories.filter(c => catTotals(c).planned > 0);
  const total = cats.reduce((s, c) => s + catTotals(c).planned, 0);
  if (total === 0) return;

  let offset = -Math.PI / 2;
  let paths = '';
  cats.forEach(cat => {
    const { planned } = catTotals(cat);
    const angle = (planned / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(offset);
    const y1 = cy + r * Math.sin(offset);
    const x2 = cx + r * Math.cos(offset + angle);
    const y2 = cy + r * Math.sin(offset + angle);
    const large = angle > Math.PI ? 1 : 0;
    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z"
      fill="${cat.color}" opacity="0.85" />`;
    offset += angle;
  });

  // Inner circle cutout
  paths += `<circle cx="${cx}" cy="${cy}" r="${r - strokeW}" fill="#131720"/>`;
  svg.innerHTML = paths;

  legend.innerHTML = cats.map(cat => {
    const pct = Math.round(catTotals(cat).planned / total * 100);
    return `<div class="donut-legend-item">
      <div class="donut-legend-dot" style="background:${cat.color}"></div>
      ${cat.icon} ${pct}%
    </div>`;
  }).join('');
}

function renderAlerts() {
  const container = document.getElementById('alerts');
  const alerts = [];

  state.categories.forEach(cat => {
    const { planned, actual } = catTotals(cat);
    if (actual > planned && planned > 0) {
      const over = actual - planned;
      alerts.push({ type: 'over', title: `${cat.icon} ${cat.label}`, desc: `Dépassement de ${fmt(over)}` });
    }
  });
  // Check items individually
  state.categories.forEach(cat => {
    cat.items.forEach(item => {
      if (item.planned > 0 && item.actual > item.planned) {
        const over = item.actual - item.planned;
        alerts.push({ type: 'over', title: item.name, desc: `+${fmt(over)} au-dessus du budget` });
      }
    });
  });
  // Good news
  const { planned, actual } = globalTotals();
  const pct = planned > 0 ? Math.round(actual / planned * 100) : 0;
  if (pct < 70 && actual > 0) {
    alerts.push({ type: 'ok', title: 'Budget maîtrisé', desc: `Seulement ${pct}% du budget consommé` });
  }

  if (alerts.length === 0) {
    container.innerHTML = '<div class="no-alerts">✓ Aucune alerte — tout est dans les clous !</div>';
    return;
  }
  container.innerHTML = alerts.slice(0, 6).map(a =>
    `<div class="alert alert-${a.type}">
      <div class="alert-dot"></div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
      </div>
    </div>`
  ).join('');
}

// ── Details ────────────────────────────────────────────────────────────
function renderDetails() {
  const container = document.getElementById('details-table');
  container.innerHTML = state.categories.map((cat, ci) => {
    const { planned: catPlanned, actual: catActual } = catTotals(cat);
    const catPct = catPlanned > 0 ? Math.round(catActual / catPlanned * 100) : 0;
    const pctClass = catActual === 0 ? 'pct-empty' : catPct > 100 ? 'pct-over' : 'pct-ok';
    const isOpen = ci < 2;
    return `<div class="cat-section" id="cats-${cat.id}">
      <div class="cat-section-header ${isOpen ? 'open' : ''}" onclick="toggleCat('${cat.id}')">
        <div class="cat-sec-left">
          <div class="cat-sec-icon" style="background:${cat.color}22">${cat.icon}</div>
          <div>
            <div class="cat-sec-title">${cat.label}</div>
            <div class="cat-sec-count">${cat.items.length} postes</div>
          </div>
        </div>
        <div class="cat-sec-right">
          <div class="cat-sec-totals">
            <div class="cat-sec-amt">
              <div class="cat-sec-amt-label">Prévu</div>
              <div class="cat-sec-amt-val">${fmt(catPlanned)}</div>
            </div>
            <div class="cat-sec-amt">
              <div class="cat-sec-amt-label">Réel</div>
              <div class="cat-sec-amt-val" id="sec-actual-${cat.id}">${fmt(catActual)}</div>
            </div>
          </div>
          <span class="cat-sec-pct ${pctClass}" id="sec-pct-${cat.id}">${catActual === 0 ? '—' : catPct + '%'}</span>
          <span class="chevron-icon ${isOpen ? 'open' : ''}" id="chev-${cat.id}">▼</span>
        </div>
      </div>
      <div class="cat-body ${isOpen ? 'open' : ''}" id="catbody-${cat.id}">
        <table class="expense-table">
          <thead><tr>
            <th style="width:38%">Poste de dépense</th>
            <th>Prévu</th>
            <th>Réel (€)</th>
            <th>Écart</th>
            <th>Avancement</th>
          </tr></thead>
          <tbody>
            ${cat.items.map((item, ii) => renderItemRow(cat.id, ci, ii, item)).join('')}
          </tbody>
          <tfoot>
            <tr class="tfoot-row">
              <td>Sous-total</td>
              <td>${fmt(catPlanned)}</td>
              <td id="sub-act-${cat.id}">${fmt(catActual)}</td>
              <td class="${diffClass(catActual - catPlanned)}" id="sub-diff-${cat.id}">${catActual > 0 ? fmtSigned(catActual - catPlanned) : '—'}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>`;
  }).join('');
}

function renderItemRow(catId, ci, ii, item) {
  const actual = item.actual;
  const diff = actual !== null ? (actual - (item.planned || 0)) : null;
  const pct = item.planned > 0 && actual !== null ? Math.min(actual / item.planned * 100, 100) : 0;
  const barColor = pct > 100 ? 'var(--red)' : pct > 80 ? 'var(--amber)' : 'var(--green)';

  return `<tr data-name="${item.name.toLowerCase()}" data-cat="${catId}">
    <td class="row-name">${item.name}${item.note ? `<small>${item.note}</small>` : ''}</td>
    <td class="row-planned">${fmt(item.planned)}</td>
    <td><input class="editable-cell" type="number" min="0" step="1"
      value="${actual !== null ? actual : ''}"
      placeholder="0"
      data-cat="${ci}" data-item="${ii}"
      onchange="updateItem(${ci},${ii},this.value)"
      onkeydown="if(event.key==='Enter')this.blur()"
    /></td>
    <td class="${diffClass(diff)}" id="diff-${catId}-${ii}">${diff !== null ? fmtSigned(diff) : '—'}</td>
    <td>
      ${item.planned > 0 ? `<div class="mini-prog"><div class="mini-prog-fill" style="width:${pct.toFixed(0)}%;background:${barColor}"></div></div> <span style="font-size:10px;color:var(--text3)">${Math.round(pct)}%</span>` : '—'}
    </td>
  </tr>`;
}

function diffClass(v) {
  if (v === null || v === undefined) return 'diff-zero';
  if (v > 0) return 'diff-neg';
  if (v < 0) return 'diff-pos';
  return 'diff-zero';
}

function toggleCat(id) {
  const body = document.getElementById('catbody-' + id);
  const hdr = document.querySelector(`#cats-${id} .cat-section-header`);
  const chev = document.getElementById('chev-' + id);
  const open = body.classList.contains('open');
  body.classList.toggle('open', !open);
  hdr.classList.toggle('open', !open);
  chev.classList.toggle('open', !open);
}

function updateItem(ci, ii, raw) {
  const val = raw === '' ? null : Math.max(0, parseFloat(raw) || 0);
  state.categories[ci].items[ii].actual = val;
  save();

  const cat = state.categories[ci];
  const item = cat.items[ii];
  const { planned, actual: catActual } = catTotals(cat);
  const diff = val !== null ? val - (item.planned || 0) : null;

  // Update diff cell
  const diffEl = document.getElementById(`diff-${cat.id}-${ii}`);
  if (diffEl) { diffEl.textContent = diff !== null ? fmtSigned(diff) : '—'; diffEl.className = diffClass(diff); }

  // Update section totals
  const catPct = planned > 0 ? Math.round(catActual / planned * 100) : 0;
  const pctClass = catActual === 0 ? 'pct-empty' : catPct > 100 ? 'pct-over' : 'pct-ok';
  const secAct = document.getElementById(`sec-actual-${cat.id}`);
  const secPct = document.getElementById(`sec-pct-${cat.id}`);
  const subAct = document.getElementById(`sub-act-${cat.id}`);
  const subDiff = document.getElementById(`sub-diff-${cat.id}`);
  if (secAct) secAct.textContent = fmt(catActual);
  if (secPct) { secPct.textContent = catActual === 0 ? '—' : catPct + '%'; secPct.className = `cat-sec-pct ${pctClass}`; }
  if (subAct) subAct.textContent = fmt(catActual);
  if (subDiff) { subDiff.textContent = catActual > 0 ? fmtSigned(catActual - planned) : '—'; subDiff.className = diffClass(catActual - planned); }

  // Refresh dashboard KPIs
  if (document.getElementById('view-dashboard').classList.contains('active')) renderDashboard();
  showToast('Mise à jour enregistrée');
}

function filterRows(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.expense-table tbody tr').forEach(row => {
    const name = row.dataset.name || '';
    row.style.display = name.includes(q) ? '' : 'none';
  });
}

// ── Abonnements ────────────────────────────────────────────────────────
function renderAbos() {
  const abosCat = state.categories.find(c => c.id === 'abos');
  if (!abosCat) return;
  const container = document.getElementById('abos-grid');
  const total = abosCat.items.reduce((s, i) => s + (i.planned || 0), 0);

  container.innerHTML = abosCat.items
    .filter(i => i.planned > 0 || (i.actual || 0) > 0)
    .map(item => {
      const price = item.planned || 0;
      const isActive = price > 0;
      const color = abosCat.color;
      return `<div class="abo-card" style="border-top-color:${isActive ? color : 'transparent'}">
        <div class="abo-name">${item.name}</div>
        <div class="abo-price">${fmt(price, 2)} <span>/ mois</span></div>
        <div class="abo-freq">${fmt(price * 12, 2)} / an</div>
        <div class="abo-status ${isActive ? 'abo-active' : 'abo-inactive'}">
          ${isActive ? '● Actif' : '○ Inactif'}
        </div>
      </div>`;
    }).join('');

  container.innerHTML += `<div class="abo-total-card">
    <div class="abo-total-label">Total abonnements</div>
    <div class="abo-total-value">${fmt(total, 2)}</div>
    <div class="abo-total-sub">par mois · ${fmt(total * 12, 2)} par an</div>
  </div>`;
}

// ── Month ──────────────────────────────────────────────────────────────
function updateMonth(val) {
  const [y, m] = val.split('-');
  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const label = `${months[parseInt(m) - 1]} ${y}`;
  state.meta.month = label;
  document.getElementById('meta-month').textContent = label;
  document.querySelector('.page-subtitle') && (document.querySelector('#view-dashboard .page-subtitle').textContent = `Vue d'ensemble · ${label}`);
  save();
}

// ── Export / Import ────────────────────────────────────────────────────
function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `budget-${state.meta.month.replace(' ', '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export téléchargé');
}

function importJSON() {
  document.getElementById('file-input').click();
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const parsed = JSON.parse(ev.target.result);
      state = parsed;
      save();
      renderDashboard();
      showToast('Données importées avec succès');
    } catch {
      showToast('Erreur : fichier JSON invalide');
    }
  };
  reader.readAsText(file);
}

// ── Toast ──────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

// ── Init ───────────────────────────────────────────────────────────────
renderDashboard();
