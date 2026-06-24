# Exercices pour maîtriser blog.js

> 12 exercices, du plus simple au plus dur, chacun cible UN concept de blog.js.
> Fais-les dans la console du navigateur (F12). Corrigés tout en bas.
>
> Données de référence (le format de tes vrais articles dans posts.js) :

```js
const POSTS = [
  { slug: '2026-08', year: 2026, month: 8,  publishDate: '2026-08-01', title: 'aout',     tag: 'things I hate' },
  { slug: '2026-07', year: 2026, month: 7,  publishDate: '2026-07-01', title: 'juillet',  tag: 'things I love' },
  { slug: '2026-06', year: 2026, month: 6,  publishDate: '2026-06-01', title: 'juin',     tag: 'things I hate' },
  { slug: '2025-12', year: 2025, month: 12, publishDate: '2025-12-01', title: 'decembre', tag: 'things I love' },
];
```

---

## Exo 1 — Portée / scope (le concept de l'IIFE)
Que se passe-t-il quand on tente d'afficher `secret` ? Pourquoi ?
```js
(() => {
  const secret = 42;
})();
console.log(secret);
```
👉 Que faudrait-il changer pour pouvoir l'afficher ? Quel est l'intérêt de NE PAS pouvoir ?

---

## Exo 2 — `.map()` (transformer)
À partir de `POSTS`, fabrique un tableau qui contient **seulement les titres**.
Résultat attendu : `['aout', 'juillet', 'juin', 'decembre']`.

---

## Exo 3 — `.filter()` (le coeur du scheduling)
Écris la ligne qui garde **uniquement les articles de l'année 2026**.
(C'est exactement la logique du filtre `publishDate <= today` de blog.js, version simplifiée.)

---

## Exo 4 — `new Set()` (valeurs distinctes)
À partir de `POSTS`, obtiens la liste des **années distinctes**, triées croissant.
Résultat attendu : `[2025, 2026]`.
Indice : `[...new Set(...)]` puis `.sort()`.

---

## Exo 5 — Date + `padStart` (fabriquer un slug)
On a `year = 2026` et `month = 6`. Fabrique le slug `"2026-06"` (le mois doit avoir 2 chiffres).
Puis : à partir d'un `new Date()`, récupère l'année et le mois (attention au piège `getMonth()`).

---

## Exo 6 — Ternaire + court-circuit (`||`)
Réécris ce `if/else` en UNE ligne avec un ternaire :
```js
let affichage;
if (isLocal) {
  affichage = POSTS;
} else {
  affichage = POSTS.filter(p => new Date(p.publishDate) <= today);
}
```
Bonus : que renvoie `p.publishDate || "pas de date"` si `p.publishDate` vaut `undefined` ?

---

## Exo 7 — `.sort()` (tri multi-critères)
Trie `POSTS` du **plus récent au plus ancien** (année décroissante, puis mois décroissant).
Quel doit être le 1er élément du résultat ? Et le dernier ?

---

## Exo 8 — Créer du DOM (le coeur des fonctions render…)
En JS pur (sans innerHTML), crée un `<a>` qui :
- a pour texte `"JUIN"`,
- a pour href `"#blog-2026-06"`,
- a la classe `"blog-month"`,
- et est ajouté dans `document.body`.
Indice : `createElement`, `textContent`, `href`, `className`, `appendChild`.

---

## Exo 9 — Événement (addEventListener)
Reprends ton `<a>` de l'exo 8. Ajoute un gestionnaire : au clic, il doit
`console.log("clic sur juin")` ET empêcher le comportement par défaut du lien.
Indice : `addEventListener('click', e => { ... })` et `e.preventDefault()`.

---

## Exo 10 — Cascade de repli (la logique de getActiveSlug)
Écris une fonction `choisir(hash, moisCourantSlug)` qui renvoie :
1. `hash` s'il correspond à un article existant dans POSTS,
2. sinon `moisCourantSlug` s'il existe dans POSTS,
3. sinon le slug du 1er article de POSTS,
4. sinon `null`.
Teste-la avec `choisir('2026-07', '2026-09')` et `choisir('xxxx', '2026-09')`.

---

## Exo 11 — Expression régulière (regex)
La regex de blog.js est `/^#blog-(\d{4}-\d{2})$/`.
Pour CHACUNE de ces chaînes, dis si elle "matche", et si oui ce que `match[1]` contient :
```
"#blog-2026-06"
"#blog-2026-6"
"#blog-2026-06-extra"
"blog-2026-06"
```

---

## Exo 12 — Asynchrone : ordre + Promise.all
Partie A — ordre d'affichage de 1,2,3,4 ?
```js
async function go() {
  console.log("1");
  await Promise.resolve();   // promesse deja resolue
  console.log("2");
}
console.log("3");
go();
console.log("4");
```
Partie B — Réécris ce chargement séquentiel (lent) en version **parallèle** avec `Promise.all` :
```js
async function lent() {
  const a = await fetch("a.html").then(r => r.text());
  const b = await fetch("b.html").then(r => r.text());
  return [a, b];
}
```

---

## Exo 13 (bonus) — Gestion d'erreur (try/catch)
Complète pour que, si `fetch` échoue, la fonction affiche `"oups"` au lieu de planter :
```js
async function charge() {
  // ... ajoute try/catch ici
  const r = await fetch("page.html");
  const txt = await r.text();
  console.log(txt);
}
```










=====================================================================
# CORRIGÉS
=====================================================================

## Corrigé 1
`console.log(secret)` provoque une ERREUR (`secret is not defined`). `secret`
n'existe QUE dans l'IIFE (sa portée). Pour l'exposer il faudrait le déclarer
dehors. L'intérêt de ne PAS pouvoir : on évite de polluer l'espace global et les
conflits de noms entre scripts. C'est l'ENCAPSULATION (le rôle de l'IIFE de blog.js).

## Corrigé 2
```js
const titres = POSTS.map(p => p.title);
```

## Corrigé 3
```js
const en2026 = POSTS.filter(p => p.year === 2026);
```
(Dans blog.js, le test est `new Date(p.publishDate) <= today` au lieu de `p.year === 2026`.)

## Corrigé 4
```js
const annees = [...new Set(POSTS.map(p => p.year))].sort((a, b) => a - b);
// [2025, 2026]
```
`map` -> [2026,2026,2026,2025] ; `Set` retire les doublons ; `[...]` re-transforme
en tableau ; `sort((a,b)=>a-b)` trie en numérique.

## Corrigé 5
```js
const slug = `${year}-${String(month).padStart(2, '0')}`; // "2026-06"

const d = new Date();
const y = d.getFullYear();
const m = d.getMonth() + 1;   // PIÈGE : getMonth() renvoie 0-11, donc +1
```

## Corrigé 6
```js
const affichage = isLocal ? POSTS : POSTS.filter(p => new Date(p.publishDate) <= today);
```
Bonus : `undefined || "pas de date"` renvoie `"pas de date"` (car undefined est
"falsy", donc `||` passe à la valeur suivante). C'est le sens de `!p.publishDate || ...`.

## Corrigé 7
```js
const sorted = [...POSTS].sort((a, b) => (b.year - a.year) || (b.month - a.month));
```
1er = `2026-08` (le plus récent). Dernier = `2025-12`.
Note : `[...POSTS]` fait une COPIE pour ne pas modifier l'original (immuabilité).
Le `|| (b.month - a.month)` ne sert qu'en cas d'égalité d'année.

## Corrigé 8
```js
const a = document.createElement('a');
a.textContent = 'JUIN';
a.href = '#blog-2026-06';
a.className = 'blog-month';
document.body.appendChild(a);
```

## Corrigé 9
```js
a.addEventListener('click', e => {
  e.preventDefault();           // empêche le saut/scroll par défaut du lien
  console.log('clic sur juin');
});
```

## Corrigé 10
```js
function choisir(hash, moisCourantSlug) {
  if (POSTS.find(p => p.slug === hash)) return hash;
  if (POSTS.find(p => p.slug === moisCourantSlug)) return moisCourantSlug;
  return POSTS[0] ? POSTS[0].slug : null;
}
choisir('2026-07', '2026-09'); // '2026-07' (le hash existe)
choisir('xxxx',    '2026-09'); // '2026-08' -> non : '2026-09' n'existe pas dans POSTS,
                               //   donc on tombe sur POSTS[0].slug = '2026-08'
```
C'est exactement la structure de `getActiveSlug` : URL -> mois courant -> 1er dispo.

## Corrigé 11
```
"#blog-2026-06"        -> MATCHE,    match[1] = "2026-06"
"#blog-2026-6"         -> NE matche pas (le mois n'a qu'1 chiffre, il en faut 2 : \d{2})
"#blog-2026-06-extra"  -> NE matche pas (le $ exige que ça FINISSE après les 2 chiffres)
"blog-2026-06"         -> NE matche pas (le ^ exige que ça COMMENCE par #)
```
`^` = début, `$` = fin, `\d{4}` = 4 chiffres, `(...)` = groupe capturé -> match[1].

## Corrigé 12
Partie A : ordre = `3, 1, 4, 2`.
- "3" synchrone. go() : "1" (avant le 1er await, synchrone). `await` -> pause,
  rend la main -> "4". Puis la promesse résolue reprend -> "2".

Partie B :
```js
async function rapide() {
  const [a, b] = await Promise.all([
    fetch("a.html").then(r => r.text()),
    fetch("b.html").then(r => r.text()),
  ]);
  return [a, b];
}
```
Les deux fetch partent EN MÊME TEMPS -> temps total ≈ le plus lent (au lieu de la somme).

## Corrigé 13
```js
async function charge() {
  try {
    const r = await fetch("page.html");
    const txt = await r.text();
    console.log(txt);
  } catch (err) {
    console.log("oups");
  }
}
```
Si fetch échoue (ex: file://), on tombe dans `catch` -> "oups" au lieu d'un crash.
C'est exactement ce que fait `renderArticles` avec son message d'erreur.
```
