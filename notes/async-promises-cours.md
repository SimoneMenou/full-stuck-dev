# Cours : Asynchrone, Callbacks, Promises & async/await

> Notes d'apprentissage perso. Tout ce qu'il faut pour comprendre le code
> asynchrone de `blog.js` (la partie `fetch` / `renderArticles`).
> 💡 Astuce : ouvre la console du navigateur (F12 → Console) et copie-colle
> les exemples pour les voir tourner en vrai.

---

## 0. Le problème de départ

JavaScript est **mono-thread** : un seul "cuisinier", il fait UNE chose à la fois.
Si une tâche est longue (réseau, ~1s) et qu'elle **bloque**, toute la page gèle
(plus de clic, plus de scroll). Il faut donc un moyen de dire :
**"lance la tâche longue sans bloquer, et préviens-moi quand c'est fini".**

---

## 1. Le callback ("rappelle-moi")

`setTimeout` = notre tâche longue de laboratoire (attend X ms SANS bloquer).

```js
console.log("1. Je commande une pizza");
setTimeout(() => {
  console.log("3. Pizza livree ! (2s plus tard)");
}, 2000);
console.log("2. En attendant, je mets la table");
```

Affiche :
```
1. Je commande une pizza
2. En attendant, je mets la table
3. Pizza livree ! (2s plus tard)
```

➡️ Le `3.` s'affiche EN DERNIER alors qu'il est écrit AU MILIEU.
La fonction donnée à `setTimeout` = un **callback** : "voici quoi faire QUAND ce sera prêt".

### Le problème des callbacks : "callback hell"
Enchaîner des étapes longues part en escalier illisible vers la droite :
```js
commander(() => {
  cuire(() => {
    livrer(() => {
      manger(() => { console.log("Enfin !"); });
    });
  });
});
```
➡️ Les Promises sont nées pour résoudre ça.

---

## 2. La Promise = un "ticket de commande"

Au resto, on ne te donne pas le plat tout de suite : on te donne un **ticket**
qui GARANTIT soit un plat, soit une explication si ça rate.

Une Promise a **3 états** :
```
   pending (en attente)
      |
      |--> fulfilled (reussie)  -> une VALEUR  ("voici ton plat")
      |
      |--> rejected (echouee)   -> une ERREUR  ("plus de pates")
```
Une fois passée à fulfilled ou rejected, elle est **figée** (pas de retour arrière).

---

## 3. Lire une Promise : `.then()` / `.catch()`

- `.then(valeur => ...)` = "QUAND ça réussit, fais ça".
- `.catch(erreur => ...)` = "SI ça rate, fais ça".

`fetch` renvoie une Promise :
```js
console.log("1. Je demande une blague...");
fetch("https://official-joke-api.appspot.com/random_joke")
  .then(reponse => reponse.json())   // decode en objet JS (renvoie ENCORE une promesse)
  .then(blague  => console.log("3. Reponse :", blague.setup))
  .catch(erreur => console.log("Rate :", erreur));
console.log("2. Je continue sans attendre");
```
Ordre : 1, 2, puis ~1s plus tard 3. On **enchaîne les `.then` à plat** (plus d'escalier).

---

## 4. La syntaxe moderne : `async` / `await`

- `await` = "attends que la promesse soit tenue et donne-moi la valeur" (sans geler la page).
- `async` = mot-clé OBLIGATOIRE sur la fonction pour avoir le droit d'utiliser `await` dedans.

Même blague, version lisible "de haut en bas" :
```js
async function montreUneBlague() {
  try {
    console.log("1. Je demande une blague...");
    const reponse = await fetch("https://official-joke-api.appspot.com/random_joke");
    const blague  = await reponse.json();
    console.log("2. Reponse :", blague.setup);
  } catch (erreur) {
    console.log("Rate :", erreur);
  }
}
montreUneBlague();
```

➡️ `.then/.catch` et `async/await` font EXACTEMENT la même chose.
   `async/await` est juste une écriture plus lisible par-dessus les Promises.
🔑 Règle d'or : `await` ne s'utilise QUE dans une fonction `async`.

---

## 5. Plusieurs tâches EN PARALLÈLE : `Promise.all`

Séquentiel (LENT) : on additionne les attentes.
```js
const a = await fetch("art1.html"); // 1s
const b = await fetch("art2.html"); // PUIS 1s
const c = await fetch("art3.html"); // PUIS 1s   -> total ~3s
```

Parallèle (RAPIDE) : on lance tout en même temps.
```js
const [a, b, c] = await Promise.all([
  fetch("art1.html"),
  fetch("art2.html"),
  fetch("art3.html"),
]);                                  // -> total ~1s (le plus lent)
```
`Promise.all([...])` prend une liste de promesses, les lance toutes en même temps,
et renvoie UNE promesse qui se résout quand TOUTES sont finies.
Analogie : 3 machines à laver en parallèle au lieu de l'une après l'autre.

---

## 6. Le vrai code de blog.js (maintenant tu comprends tout)

```js
async function renderArticles() {            // async -> on peut utiliser await
  try {                                       // on prevoit l'echec
    const fragments = await Promise.all(      // attends que TOUS soient charges
      sorted.map(p =>                         // pour chaque article p...
        fetch(`./blog/posts/${p.slug}.html`)  // ...lance une requete (Promise)
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`); // erreur -> catch
            return r.text();                  // sinon : recupere le HTML
          })
      )
    );
    fragments.forEach(html => { /* injecte dans la page */ });
  } catch (err) {                             // si UNE requete rate (ex: file://)
    root.innerHTML = '<p>articles non charges...</p>';
  }
}
```
1. `sorted.map(p => fetch(...))` -> transforme la liste d'articles en liste de promesses.
2. `Promise.all([...])` -> lance les 8 requêtes en parallèle.
3. `await` -> attend les 8 sans geler la page.
4. `try/catch` -> si une échoue (cas file:// où fetch est bloqué) -> message propre.

C'est la pizza, mais x8, avec gestion d'erreur.

---

## 7. Carte mentale à retenir

```
Tache longue (reseau, timer)
   |
   v
Promise = "ticket" pour un resultat futur
   etats:  pending  ->  fulfilled (valeur)  |  rejected (erreur)
   |
   |- Ancienne lecture :  .then(v => ...) / .catch(e => ...)
   |
   |- Lecture moderne  :  await (dans fonction async) + try/catch

Plusieurs en parallele :  Promise.all([p1, p2, p3])  -> attend que TOUTES finissent
```

=====================================================================
# EXERCICES (corrigés tout en bas — essaie AVANT de regarder !)
=====================================================================

## Exercice 1 — l'ordre d'affichage
Dans quel ordre s'affichent A, B, C, D ?
```js
console.log("A");
setTimeout(() => console.log("B"), 1000);
setTimeout(() => console.log("C"), 0);
console.log("D");
```

## Exercice 2 — async / await
Dans quel ordre s'affichent 1, 2, 3, 4 ?
```js
async function go() {
  console.log("1");
  await new Promise(r => setTimeout(r, 500));
  console.log("2");
}
console.log("3");
go();
console.log("4");
```

## Exercice 3 — répare le bug
Ce code veut afficher le texte d'une page, mais il affiche `[object Promise]`.
Pourquoi, et comment le corriger ?
```js
function charge() {
  const texte = fetch("page.html").then(r => r.text());
  console.log(texte);
}
```










=====================================================================
# CORRIGÉS
=====================================================================

## Corrigé 1 :  A, D, C, B
- A et D sont SYNCHRONES -> ils passent en premier, dans l'ordre.
- Ensuite les callbacks de setTimeout. C (0ms) avant B (1000ms).
- Leçon : le code synchrone tourne TOUJOURS avant les callbacks asynchrones,
  même un setTimeout a 0ms.

## Corrigé 2 :  3, 1, 4, 2
- "3" : synchrone, avant l'appel de go().
- go() : tout ce qui est AVANT le premier `await` est synchrone -> "1".
- Au `await`, la fonction se met en PAUSE et rend la main -> "4" s'affiche.
- 500ms plus tard, la promesse est tenue -> reprise -> "2".
- Leçon : le code avant le 1er `await` s'exécute tout de suite ; ce qui suit
  est differe.

## Corrigé 3 :
`fetch(...).then(...)` renvoie une PROMESSE, pas le texte. On affiche donc le
ticket, pas le plat. Il faut ATTENDRE le résultat.
```js
async function charge() {              // 1) marquer async
  const reponse = await fetch("page.html");
  const texte   = await reponse.text(); // 2) await -> on a la vraie valeur
  console.log(texte);
}
```
(ou en .then : `fetch("page.html").then(r => r.text()).then(texte => console.log(texte));`)
- Leçon : une Promise n'est pas sa valeur. Il faut la "dérouler" avec await ou .then.
```
