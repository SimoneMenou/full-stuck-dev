/* ============================================================
   BLOG REGISTRY — la liste de tous les articles.

   POUR AJOUTER UN POST:
     1. créer le fichier HTML dans /blog/posts/YYYY-MM.html
     2. ajouter une entrée en haut de la liste ci-dessous
     3. mettre la publishDate au format 'YYYY-MM-DD' (ex: '2026-08-01')

   PIPELINE:
     - en prod (GitHub Pages, Netlify, etc) → les posts ne s'affichent
       QUE si publishDate <= today
     - en local (localhost ou file://) → TOUS les posts s'affichent
       (pour preview/test des drafts à l'avance)
   ============================================================ */

window.BLOG_POSTS = [
  {
    slug: '2027-01',
    year: 2027,
    month: 1,
    publishDate: '2027-01-01',
    title: '10/2 things I love about C#',
    tag: 'things I love'
  },
  {
    slug: '2026-12',
    year: 2026,
    month: 12,
    publishDate: '2026-12-01',
    title: '10/2 things I love-hate about frontend design',
    tag: 'things I love-hate'
  },
  {
    slug: '2026-11',
    year: 2026,
    month: 11,
    publishDate: '2026-11-01',
    title: '10/2 things I learned about manual testing',
    tag: 'things I learned'
  },
  {
    slug: '2026-10',
    year: 2026,
    month: 10,
    publishDate: '2026-10-01',
    title: '10/2 things I love-hate about security',
    tag: 'things I love-hate'
  },
  {
    slug: '2026-09',
    year: 2026,
    month: 9,
    publishDate: '2026-09-01',
    title: '10/2 things I love about becoming a dev',
    tag: 'things I love'
  },
  {
    slug: '2026-08',
    year: 2026,
    month: 8,
    publishDate: '2026-08-01',
    title: '10/2 things I hate about becoming a dev',
    tag: 'things I hate'
  },
  {
    slug: '2026-07',
    year: 2026,
    month: 7,
    publishDate: '2026-07-01',
    title: '10/2 things I love about LinkedIn',
    tag: 'things I love'
  },
  {
    slug: '2026-06',
    year: 2026,
    month: 6,
    publishDate: '2026-06-01',
    title: '10/2 things I hate about LinkedIn',
    tag: 'things I hate'
  }
];

/* Année à afficher dans le calendrier (le plus récent). Le mois courant
   est auto-déduit du premier post de la liste. */
window.BLOG_CURRENT_YEAR = 2026;
