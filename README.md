# CARTOGRAFFECT® — Vitrine Web & Explorateur Interactif (Strate 2)

> **Cartographie des affects : une architecture hiérarchique de l’expérience affective fondée sur le traitement prédictif**  
> *Manuel Cabelguen, Ph. D. — Psychologue clinicien, chercheur indépendant en psychologie, Sainte-Agathe-des-Monts, Québec, Canada*  
> Prépublication scientifique : **Version 2.0.0** (`2026-11-21`) — **Zenodo DOI** : [10.5281/zenodo.24022795](https://doi.org/10.5281/zenodo.24022795) | **OSF** : [osf.io/z89sg](https://osf.io/z89sg)  
> Méta-fondation formelle Hexa-Prover : **Version 2.0.0** (`113` théorèmes constructifs, `0 sorry`, `0` axiome personnalisé, `6` prouveurs indépendants, `9` modules `.lean`) — **Zenodo DOI** : [10.5281/zenodo.23833938](https://doi.org/10.5281/zenodo.23833938)  
> Droit d'auteur enregistré auprès de l'OPIC / CIPO n° `1233199` • Site officiel : [www.cartograffect.com](https://www.cartograffect.com)  
> Double licence SPDX : `AGPL-3.0-or-later AND CC-BY-NC-SA-4.0`

---

## Hiérarchie Épistémique & Couplage avec `CARTOGRAFFECT`

Ce dépôt constitue la **Strate 2 (vitrine web scientifique et explorateurs interactifs)** adossée au compendium unifié [`CARTOGRAFFECT`](https://github.com/manuelcabelguen-jpg/CARTOGRAFFECT) (`v2.0.0`), selon une stricte hiérarchie épistémique :

- **Strate 0 (Noyau normatif faisant autorité) :** fondation formelle **Hexa-Prover** (`113` théorèmes constructifs sur `6` prouveurs, `9` modules `.lean`, `0 sorry`), moteur markovien entier exact (`python/cartograffect_predictive_engine.py`) et article théorique canonique (`docs/01-Article_Cartograffect.md` `v2.0.0`, 176 états sur $Z \in \{0, \dots, 7\}$, **5 prédictions empiriques falsifiables P1–P5**).
- **Strate 1 (Satellites exploratoires subordonnés dans le compendium) :** triangulation psychométrique préliminaire Scherer GRID-24 / réfutation formelle des roues 2D et extension axiologique $Z^-$ cloisonnée (`extensions/lexicon/`), ainsi que le banc compagnon *in silico* Exp 1–5 (`extensions/in_silico/`, réservé à un second article méthodologique dédié dans le respect absolu de l'arbitrage A4-Sanctuaire).
- **Strate 2 (Présent dépôt web) :** synchronisé de manière déterministe depuis le contrat [`data/site-payload.json`](data/site-payload.json) émis lors des releases de `CARTOGRAFFECT` via [`scripts/sync_from_payload.py`](scripts/sync_from_payload.py), [`js/compendium_payload.js`](js/compendium_payload.js) et [`.github/workflows/sync-from-compendium.yml`](.github/workflows/sync-from-compendium.yml).

---

## Présentation Théorique (Strate 0)

L'étude scientifique des affects demeure historiquement fragmentée entre les théories des émotions de base, les approches dimensionnelles (circomplexe de Russell), les modèles d'évaluation cognitive (*appraisal*) et le constructionnisme psychologique. **CARTOGRAFFECT®** unifie ces traditions en une **architecture fonctionnelle et mathématique** ancrée dans le **traitement prédictif**, l'**inférence active**, l'**inférence intéroceptive** et la **régulation allostatique** :

1. **Le Moteur Prédictif & Dynamique du Circuit Fermé (§4 & §4.1) :** évalue la résorption d'un écart de prédiction saillant le long de deux gradients orthogonaux d'incertitude — **Attente** ($X$, révisabilité épistémique) et **Contrôle** ($Y$, contrôlabilité pragmatique) — pondérés par l'**Interface Attentionnelle**. La section `4.1` formalise l'opposition entre résolution active et extinction passive (pseudo-veille instable), l'indépendance entre conservation $L_1$ (P1) et couplage croisé $\chi$ (P2), la typologie clinique des **5 ruptures d'ergodicité** ($\rho, \kappa, \gamma, \chi, \epsilon$) et la loi unifiée à trois équations ($R_t, Z_t, \tilde{\pi}_{A,t}$ avec court-circuit R5).
2. **Le Noyau Affectif & Norme $L_1$ (§5) :** projette les évaluations dans l'espace discret $(X, Y, Z)$ sous la loi des couronnes $|X| + |Y| = 2Z - 2$ ($Z \ge 2$) et la règle de répartition proportionnelle idempotente `apportionRay`.
3. **La Matrice Affective (§6) :** applique la règle **lexicographique** de valence portée prioritairement par l'Attente ($X \ne 0 \implies \text{Valence} = \operatorname{sgn}(X)$), relie les 4 prototypes combinés aux contingences écologiques ($R^+, P^-, P^+, R^-$) et dissocie l'activation physiologique comme paramètre transversal.
4. **La Taxonomie Affective Hiérarchique (§7) :** déploie les **176 états uniques** (8 opérateurs centraux $(0,0,Z)$ + 168 positions périphériques sur $Z = 0 \dots 7$), l'involution unifiée d'antagonisme $\mathcal{A}(X,Y,Z) = (-\operatorname{sgn}(X)|Y|, -\operatorname{sgn}(Y)|X|, Z)$ (84 paires), et formule **5 prédictions empiriques réfutables P1–P5** (§8.2, Tableau 2).

---

## Méta-Fondation Formelle Hexa-Prover (113 théorèmes · 6 prouveurs · 9 modules `.lean`)

L'architecture complète est certifiée sans contradiction interne (**113 théorèmes purement constructifs**, `0 sorry`, `0 Admitted`, `0 postulate`, `0 {:axiom}`, `0` axiome personnalisé) sur **6 environnements de preuve formelle indépendants** :

1. **Lean 4** (`4.35.0`) — **9 modules `.lean`** (`11` cibles Lake avec `warningAsError := true`) :
   - `Cartograffect.lean` (module racine d'intégration)
   - `Cartograffect/PredictiveEngine.lean`
   - `Cartograffect/CoreAffect.lean`
   - `Cartograffect/AffectiveMatrix.lean`
   - `Cartograffect/AffectiveTaxonomy.lean`
   - `Cartograffect/AffectiveDynamics.lean`
   - `Cartograffect/Lexicon176.lean` (répertoire canonique certifié des 176 états)
   - `Cartograffect/PredictiveCircuit.lean` (circuit fermé à 6 opérateurs & identité $4m^6$)
   - `Cartograffect/AuditTests.lean` (batterie d'audit formel automatisé)
2. **The Rocq Prover** (`9.0`, 100 % `Closed under the global context`, `Axioms: <none>`)
3. **Agda** (`2.9.0`, `--safe --without-K`)
4. **Dafny** (`4.11.0`, obligations de preuve + parité d'exécution)
5. **SMT-LIB 2.6 / Z3** (`5.3.3`)
6. **TLA+ / TLC** (`2.19`, vérification exhaustive de modèles temporels, 0 deadlock)

---

## Structure & Couplage Automatisé du Dépôt Web

- **`data/site-payload.json`** : contrat JSON déterministe (`schema_version: "1.0"`) exporté depuis `CARTOGRAFFECT/scripts/export_site_payload.py`.
- **`scripts/sync_from_payload.py`** : synchroniseur déterministe Python 3.10+ (`--apply` / `--check`) mettant à jour marqueurs, versions, compteurs, identifiants et mentions légales avec scan zéro-résidu et contrôle de parité 176/176 intégré.
- **`js/compendium_payload.js`** : client léger chargeant `data/site-payload.json` avec repli synchrone propre sur les valeurs statiques injectées.
- **`.github/workflows/sync-from-compendium.yml`** : workflow récepteur (`repository_dispatch: compendium-release` et `workflow_dispatch`) ouvrant automatiquement une Pull Request propre sur `main`.
- **Pages scientifiques & interactives :** `index.html`, `voyage.html`, `moteur-predictif.html`, `noyau-affectif.html`, `matrice-affective.html`, `taxonomie-affective.html` (`emotions.html`), `article.html` (version Web complète `v2.0.0` avec section `4.1`, Tableaux 1 & 2, arbitrage A3, A4-Sanctuaire et A5), `scholar_drive.html`, `mentions-legales.html`, `maintenance.html`, `404.html`.
- **Modèle & scripts JS :** `cartograffect_model.js` (parité 176/176 certifiée avec `Cartograffect/Lexicon176.lean`), `cartograffect_theory.js`, `dynamic_cartograffect.js`, `octahedral_navigator.js`, `hero_octahedron.js`, `corpus_system.js`, `command_palette.js`, `bilingual_modal.js`, `maintenance_guard.js`, `sw.js`.

---

## Propriété Intellectuelle & Double Licence SPDX (`AGPL-3.0-or-later AND CC-BY-NC-SA-4.0`)

- **Marque déposée :** **CARTOGRAFFECT®** est une marque déposée de Manuel Cabelguen.
- **Théorie, ontologie, textes & taxonomie des 176 états :** &copy; 2024–2026 Manuel Cabelguen. Enregistrement OPIC / CIPO n° `1233199`. Licence [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (usage commercial strictement interdit).
- **Code source & algorithmes :** Licence [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html) (`AGPL-3.0-or-later`).
- **Clause de séparation des fichiers hybrides (`cartograffect_model.js`) :** la structure logicielle et les accesseurs de [`cartograffect_model.js`](cartograffect_model.js) relèvent de `AGPL-3.0-or-later`, tandis que la nomenclature, les coordonnées `(X, Y, Z)`, les appariements et la taxonomie des 176 états restent exclusivement régis par `CC BY-NC-SA 4.0` (extraction commerciale strictement interdite). Voir [`LICENSE`](LICENSE) et [`mentions-legales.html`](mentions-legales.html).
