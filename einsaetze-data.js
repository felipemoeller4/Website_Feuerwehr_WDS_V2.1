(function(){
  async function load(){
    const grid = document.querySelector('[data-einsatz-grid]');
    const yearFilter = document.querySelector('[data-year-filter]');
    if(!grid || !yearFilter) return;

    try{
      const res = await fetch('data/einsaetze.json', {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      const items = Array.isArray(json.items) ? json.items : [];

      // sort newest first: by year desc then nr desc, fallback created_at
      items.sort((a,b) => {
        const ya = Number(a.jahr||0), yb = Number(b.jahr||0);
        if(yb !== ya) return yb - ya;
        const na = Number(a.nr||0), nb = Number(b.nr||0);
        if(nb !== na) return nb - na;
        return String(b.created_at||'').localeCompare(String(a.created_at||''));
      });

      // build year pills from data (keep existing but ensure data years exist)
      const years = Array.from(new Set(items.map(i => String(i.jahr||'').trim()).filter(Boolean)));
      years.sort((a,b) => Number(b) - Number(a));

      // If no items, keep existing pills and show note
      if(items.length === 0){
        grid.innerHTML = '<div class="card panel" style="grid-column: 1 / -1;">' +
          '<b>Noch keine Einsätze erfasst.</b><div class="section-note">Die Einpflege findet im internen Bereich statt.</div>' +
          '</div>';
        return;
      }

      // rebuild pills (but preserve styling)
      yearFilter.innerHTML = '';
      years.forEach((y, idx) => {
        const btn = document.createElement('button');
        btn.className = 'year-pill' + (idx === 0 ? ' active' : '');
        btn.type = 'button';
        btn.setAttribute('data-year', y);
        btn.textContent = y;
        yearFilter.appendChild(btn);
      });

      grid.innerHTML = '';

      items.forEach(it => {
        const y = String(it.jahr||'');
        const title = it.title || `Einsatz #${it.nr || '???'} / ${y}`;
        const subtitle = it.fahrzeuge || it.subtitle || '';
        const metaParts = [];
        if(it.datum) metaParts.push(it.datum);
        if(it.stichwort) metaParts.push(it.stichwort);
        if(subtitle) metaParts.push('Fahrzeuge: ' + subtitle);
        const meta = metaParts.join(' · ');

        const tile = document.createElement('div');
        tile.className = 'tile einsatz';
        tile.setAttribute('data-year', y);
        tile.setAttribute('data-tile', '');
        tile.setAttribute('data-title', title);
        tile.setAttribute('data-meta', meta);

        const ph = document.createElement('div');
        ph.className = 'ph';
        if(it.image){
          ph.style.backgroundImage = `url(${it.image})`;
        } else {
          ph.style.backgroundImage = 'linear-gradient(135deg, rgba(179,0,0,.18), rgba(0,0,0,.06))';
        }

        const metaDiv = document.createElement('div');
        metaDiv.className = 'meta';
        metaDiv.innerHTML = `<div class="t">${escapeHtml(title)}</div><div class="s">${escapeHtml(subtitle || '—')}</div>`;

        tile.appendChild(ph);
        tile.appendChild(metaDiv);
        grid.appendChild(tile);
      });

      // Re-bind modal + year filter after dynamic insert
      if(window.FW_bindTiles) window.FW_bindTiles();
      if(window.FW_initYearFilter) window.FW_initYearFilter();

    } catch(e){
      grid.innerHTML = '<div class="card panel" style="grid-column: 1 / -1;">' +
        '<b>Fehler beim Laden der Einsätze.</b><div class="section-note">Prüfe, ob <code>data/einsaetze.json</code> erreichbar ist.</div>' +
        '</div>';
      console.error(e);
    }
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  document.addEventListener('DOMContentLoaded', load);
})();
