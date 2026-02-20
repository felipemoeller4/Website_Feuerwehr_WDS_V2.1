(function(){
  // Footer year
  const yearEl = document.querySelector('[data-year]');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if(nav.classList.contains('show')){
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded','false');
      }
    }));
  }

  // Toast helper
  const toast = document.querySelector('[data-toast]');
  const toastTitle = document.querySelector('[data-toast-title]');
  const toastText = document.querySelector('[data-toast-text]');
  function showToast(title, text){
    if(!toast) return;
    if(toastTitle) toastTitle.textContent = title || 'Info';
    if(toastText) toastText.textContent = text || '';
    toast.classList.add('show');
    window.clearTimeout(window.__fw_toast);
    window.__fw_toast = window.setTimeout(() => toast.classList.remove('show'), 4200);
  }

  // Generic mailto form handler
  const forms = document.querySelectorAll('[data-mailto-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const entries = [];
      fd.forEach((v, k) => entries.push([k, String(v)]));

      const subject = encodeURIComponent(
        form.getAttribute('data-mailto-subject') || 'Kontakt – Feuerwehr Weil der Stadt'
      );
      const to = form.getAttribute('data-mailto-to') || 'info@feuerwehr-weilderstadt.de';

      const body = encodeURIComponent(entries.map(([k,v]) => `${k}: ${v}`).join('\n'));
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      showToast('E-Mail geöffnet', 'Dein Entwurf ist bereit – bitte prüfen und absenden.');
      form.reset();
    });
  });

  // ===== Modal (Tiles) =====
  function bindTiles(){
    const tiles = document.querySelectorAll('[data-tile]');
    const modal = document.querySelector('[data-modal]');
    if(!tiles.length || !modal) return;

    const titleEl = modal.querySelector('[data-modal-title]');
    const metaEl = modal.querySelector('[data-modal-meta]');
    const closeBtn = modal.querySelector('[data-modal-close]');
    const phEl = modal.querySelector('[data-modal-ph]');

    function openModal(t){
      const title = t.getAttribute('data-title') || 'Bild';
      const meta = t.getAttribute('data-meta') || '';

      if(titleEl) titleEl.textContent = title;
      if(metaEl) metaEl.textContent = meta;

      // Bild aus der Kachel holen
      const ph = t.querySelector('.ph');
      const bg = ph ? ph.style.backgroundImage : '';

      if(phEl){
        phEl.textContent = '';
        phEl.style.backgroundImage = bg;
        phEl.style.backgroundSize = 'contain';
        phEl.style.backgroundPosition = 'center';
        phEl.style.backgroundRepeat = 'no-repeat';
      }

      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(){
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }

    // Only bind once per tile
    tiles.forEach(t => {
      if(t.dataset.bound === '1') return;
      t.dataset.bound = '1';
      t.addEventListener('click', () => openModal(t));
    });

    if(closeBtn && closeBtn.dataset.bound !== '1'){
      closeBtn.dataset.bound = '1';
      closeBtn.addEventListener('click', closeModal);
    }

    if(modal.dataset.bound !== '1'){
      modal.dataset.bound = '1';
      modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
      window.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
    }
  }

  // ===== Year filter (Einsätze) =====
  function initYearFilter(){
    const yearFilter = document.querySelector('[data-year-filter]');
    const einsatzGrid = document.querySelector('[data-einsatz-grid]');
    if(!yearFilter || !einsatzGrid) return;

    const pills = yearFilter.querySelectorAll('[data-year]');
    const einsaetze = einsatzGrid.querySelectorAll('.einsatz[data-year]');

    function setYear(year){
      pills.forEach(p => p.classList.toggle('active', p.getAttribute('data-year') === year));
      einsaetze.forEach(tile => {
        const y = tile.getAttribute('data-year');
        tile.style.display = (y === year) ? '' : 'none';
      });
    }

    pills.forEach(p => {
      if(p.dataset.bound === '1') return;
      p.dataset.bound = '1';
      p.addEventListener('click', () => setYear(p.getAttribute('data-year')));
    });

    const initial = yearFilter.querySelector('.active[data-year]') || pills[0];
    if(initial) setYear(initial.getAttribute('data-year'));
  }

  // Expose for dynamic pages
  window.FW_bindTiles = bindTiles;
  window.FW_initYearFilter = initYearFilter;

  // Initial bind
  bindTiles();
  initYearFilter();

  // Auto hero image for pages with a .media-frame but without a configured header image.
  // Convention: place an image named assets/header-<pagename>.(jpg|jpeg|png)
  // Example: abteilung-hausen.html -> assets/header-abteilung-hausen.jpeg
  function applyAutoHeroImages(){
    const frames = document.querySelectorAll('.media-frame');
    if(!frames.length) return;

    const raw = (location.pathname.split('/').pop() || 'index.html');
    const page = raw.split('?')[0].split('#')[0];
    const base = page.replace(/\.html$/i,'') || 'index';

    const defaultCandidates = [
      `assets/header-${base}.jpg`,
      `assets/header-${base}.jpeg`,
      `assets/header-${base}.png`,
      `assets/${base}.jpg`,
      `assets/${base}.jpeg`,
      `assets/${base}.png`
    ];

    function trySet(el, candidates){
      let i = 0;
      const next = () => {
        if(i >= candidates.length) return;
        const rel = candidates[i++];
const abs = new URL(rel, document.baseURI).toString();

const img = new Image();
img.onload = () => {
  el.style.setProperty('--hero-image', `url("${abs}")`);
};
img.onerror = next;
img.src = abs;
      };
      next();
    }

    frames.forEach(el => {
      const current = getComputedStyle(el).getPropertyValue('--hero-image').trim();
      if(current && current !== 'none') return;

      const custom = el.getAttribute('data-hero');
      const candidates = custom ? [custom] : defaultCandidates;
      trySet(el, candidates);
    });
  }
  applyAutoHeroImages();


})();
