/* ============================================================
   BLOG LOADER — lit posts.js, construit le calendrier (basé sur
   la date du jour) et charge les articles HTML dynamiquement.
   Vanilla JS, aucun framework.
   ============================================================ */

(() => {
  'use strict';

  const ALL_POSTS = window.BLOG_POSTS || [];

  const MONTH_LABELS    = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const MONTH_NAMES_EN  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Date du jour (source unique)
  const today      = new Date();
  const todayYear  = today.getFullYear();
  const todayMonth = today.getMonth() + 1;  // 1-12

  // Détection local vs prod (pour afficher les drafts en local)
  const isLocal = location.protocol === 'file:' ||
                  location.hostname === 'localhost' ||
                  location.hostname === '127.0.0.1' ||
                  location.hostname === '' ||
                  /^192\.168\./.test(location.hostname);

  // Filtre prod: hide posts where publishDate is in the future
  const POSTS = isLocal
    ? ALL_POSTS
    : ALL_POSTS.filter(p => !p.publishDate || new Date(p.publishDate) <= today);

  if (!isLocal) {
    const hidden = ALL_POSTS.length - POSTS.length;
    if (hidden > 0) console.log(`[blog.js] ${hidden} post(s) en attente de publication.`);
  }

  // années distinctes qui ont au moins un post (triées asc)
  const YEARS_WITH_POSTS = [...new Set(POSTS.map(p => p.year))].sort((a, b) => a - b);

  // année affichée dans le calendrier — par défaut l'année du mois courant
  // (s'il y a des posts cette année), sinon fallback sur l'année du post le plus récent
  let currentYear;
  if (YEARS_WITH_POSTS.includes(todayYear)) {
    currentYear = todayYear;
  } else {
    currentYear = (POSTS[0] && POSTS[0].year) || todayYear;
  }

  // tri descendant (plus récent en premier)
  const sorted = [...POSTS].sort((a, b) => (b.year - a.year) || (b.month - a.month));

  if (POSTS.length === 0) {
    console.warn('[blog.js] window.BLOG_POSTS est vide ou absent. Vérifie que posts.js est bien chargé AVANT blog.js.');
  }

  /* ---- Navigation année (◀ 2026 ▶) ---- */
  function renderYearNav() {
    const root = document.getElementById('blog-year-nav');
    if (!root) return;
    root.innerHTML = '';

    const minYear = YEARS_WITH_POSTS[0] || currentYear;
    const maxYear = YEARS_WITH_POSTS[YEARS_WITH_POSTS.length - 1] || currentYear;

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'blog-year-nav__btn';
    prev.textContent = '◀';
    prev.setAttribute('aria-label', 'année précédente');
    if (currentYear <= minYear) prev.disabled = true;
    prev.addEventListener('click', () => {
      if (currentYear > minYear) {
        currentYear--;
        renderYearNav();
        renderCalendar();
      }
    });

    const label = document.createElement('span');
    label.className = 'blog-year-nav__label';
    label.textContent = currentYear;

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'blog-year-nav__btn';
    next.textContent = '▶';
    next.setAttribute('aria-label', 'année suivante');
    if (currentYear >= maxYear) next.disabled = true;
    next.addEventListener('click', () => {
      if (currentYear < maxYear) {
        currentYear++;
        renderYearNav();
        renderCalendar();
      }
    });

    root.appendChild(prev);
    root.appendChild(label);
    root.appendChild(next);
  }

  /* ---- État: quel article est actuellement affiché ---- */
  function getActiveSlug() {
    // 1. hash dans URL (ex: #blog-2026-06)
    const m = location.hash.match(/^#blog-(\d{4}-\d{2})$/);
    if (m && POSTS.find(p => p.slug === m[1])) return m[1];
    // 2. post du mois courant (today) si publié
    const todaySlug = `${todayYear}-${String(todayMonth).padStart(2, '0')}`;
    if (POSTS.find(p => p.slug === todaySlug)) return todaySlug;
    // 3. fallback: post le plus récent
    return sorted[0] ? sorted[0].slug : null;
  }

  /* ---- Calendrier (le mois actif = celui de l'article affiché) ---- */
  function renderCalendar() {
    const root = document.getElementById('blog-months');
    if (!root) return;
    root.innerHTML = '';

    const publishedByMonth = {};
    POSTS.forEach(p => {
      if (p.year === currentYear) publishedByMonth[p.month] = p.slug;
    });

    const activeSlug = getActiveSlug();

    for (let m = 1; m <= 12; m++) {
      const li = document.createElement('li');
      const slug = publishedByMonth[m];
      const label = MONTH_LABELS[m - 1];
      const isActive = (slug && slug === activeSlug);

      if (slug) {
        const a = document.createElement('a');
        a.href = `#blog-${slug}`;
        a.className = 'blog-month' + (isActive ? ' is-current' : '');
        a.textContent = label;
        a.addEventListener('click', e => {
          e.preventDefault();
          location.hash = `#blog-${slug}`;
          // pas de scroll automatique vers l'article (déjà visible), juste le switch
        });
        li.appendChild(a);
      } else {
        const span = document.createElement('span');
        span.className = 'blog-month is-empty';
        span.textContent = label;
        li.appendChild(span);
      }
      root.appendChild(li);
    }
  }

  /* ---- Hint "next post" (créé et inséré dans #blog-articles) ---- */
  function buildNextHint() {
    const p = document.createElement('p');
    p.className = 'blog-next';
    if (todayMonth >= 12) {
      p.textContent = `// next post in January ${todayYear + 1} →`;
    } else {
      p.textContent = `// next post in ${MONTH_NAMES_EN[todayMonth]} ${todayYear} →`;
    }
    return p;
  }

  /* ---- Affiche uniquement l'article actif, masque les autres ---- */
  function updateActiveArticle() {
    const activeSlug = getActiveSlug();
    document.querySelectorAll('.blog-articles .blog-post').forEach(art => {
      const matches = art.id === `blog-${activeSlug}`;
      art.style.display = matches ? '' : 'none';
    });
    // re-render le calendrier pour mettre à jour le mois actif
    renderCalendar();
    renderPostsList();
  }

  /* ---- Articles (fetch async, tous insérés mais un seul visible) ---- */
  async function renderArticles() {
    const root = document.getElementById('blog-articles');
    if (!root) return;
    root.innerHTML = '';

    if (sorted.length === 0) {
      root.appendChild(buildNextHint());
      return;
    }

    try {
      const fragments = await Promise.all(sorted.map(p =>
        fetch(`./blog/posts/${p.slug}.html`)
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status} pour ${p.slug}`);
            return r.text();
          })
      ));

      fragments.forEach(html => {
        const wrap = document.createElement('div');
        wrap.innerHTML = html.trim();
        while (wrap.firstChild) root.appendChild(wrap.firstChild);
      });

      // hint de "prochain post" en bas
      root.appendChild(buildNextHint());

      // masque tout sauf l'actif
      updateActiveArticle();
    } catch (err) {
      console.error('[blog.js] Échec du chargement des articles. Servez ce site via HTTP (Live Server, python -m http.server, GitHub Pages).', err);
      root.innerHTML = '<p class="blog-error">⚠ articles non chargés. servez ce site via HTTP local (Live Server) pour voir le contenu.</p>';
    }
  }

  /* ---- Liste des posts publiés (mini sommaire sous le calendrier) ---- */
  function renderPostsList() {
    const root = document.getElementById('blog-postslist');
    if (!root) return;
    const activeSlug = getActiveSlug();
    root.innerHTML = '';
    sorted.forEach(p => {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = `#blog-${p.slug}`;
      a.className = 'blog-postslist__link' + (p.slug === activeSlug ? ' is-active' : '');

      const month = document.createElement('span');
      month.className = 'blog-postslist__month';
      month.textContent = MONTH_LABELS[p.month - 1];

      const tag = document.createElement('span');
      tag.className = 'blog-postslist__tag';
      tag.textContent = p.tag;

      a.appendChild(month);
      a.appendChild(tag);
      a.addEventListener('click', e => {
        e.preventDefault();
        location.hash = `#blog-${p.slug}`;
      });
      li.appendChild(a);
      root.appendChild(li);
    });
  }

  /* ---- Boot ---- */
  function init() {
    // Clear stale hash sur initial load : on veut toujours partir sur today
    // (le hash sera repris ensuite par les clicks via hashchange)
    const todaySlug = `${todayYear}-${String(todayMonth).padStart(2, '0')}`;
    const m = location.hash.match(/^#blog-(\d{4}-\d{2})$/);
    if (m && m[1] !== todaySlug && POSTS.find(p => p.slug === todaySlug)) {
      history.replaceState(null, '', location.pathname + location.search);
    }

    renderYearNav();
    renderCalendar();
    renderPostsList();
    renderArticles();
    // au changement de hash, on switche d'article
    window.addEventListener('hashchange', updateActiveArticle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
