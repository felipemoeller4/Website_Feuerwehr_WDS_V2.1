(function(){
  async function run(){
    const box = document.querySelector('[data-latest-einsaetze]');
    if(!box) return;

    try{
      const res = await fetch('data/einsaetze.json', {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      const items = Array.isArray(json.items) ? json.items : [];

      items.sort((a,b) => {
        const ya = Number(a.jahr||0), yb = Number(b.jahr||0);
        if(yb !== ya) return yb - ya;
        const na = Number(a.nr||0), nb = Number(b.nr||0);
        if(nb !== na) return nb - na;
        return String(b.created_at||'').localeCompare(String(a.created_at||''));
      });

      const latest = items.slice(0,3);

      if(latest.length === 0){
        box.innerHTML = '<div class="list-item"><b>—</b><span>Noch keine Einsätze erfasst.</span></div>';
        return;
      }

      box.innerHTML = '';
      latest.forEach(it => {
        const left = escapeHtml(it.datum || (it.title || 'Einsatz'));
        const right = escapeHtml(it.fahrzeuge || it.subtitle || '—');
        const row = document.createElement('div');
        row.className = 'list-item';
        row.innerHTML = `<b>${left}</b><span>${right}</span>`;
        box.appendChild(row);
      });

    } catch(e){
      box.innerHTML = '<div class="list-item"><b>—</b><span>Einsätze konnten nicht geladen werden.</span></div>';
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

  document.addEventListener('DOMContentLoaded', run);
})();
