# CARTOGRAFFECT

> **Cartographie des affects : une architecture hiérarchique de l’expérience affective fondée sur le traitement prédictif**  
> *Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien*  
> Prépublication scientifique : Version 1.0.1 — **Zenodo DOI** : [10.5281/zenodo.24022795](https://doi.org/10.5281/zenodo.24022795) | **OSF** : [osf.io/z89sg](https://osf.io/z89sg)  
> Vérification Formelle Lean 4 : Version 1.0.0 — **Zenodo DOI** : [10.5281/zenodo.23833938](https://doi.org/10.5281/zenodo.23833938)  
> Droit d'auteur enregistré auprès de l'OPIC (Office de la propriété intellectuelle du Canada) n° 1233199  
> Site officiel : [www.cartograffect.com](https://www.cartograffect.com)

---

## 🌟 Présentation Théorique

L'étude scientifique des affects demeure historiquement fragmentée entre les théories des émotions de base, les approches dimensionnelles (circonplexe de Russell), les modèles d'évaluation cognitive (*appraisal*) et le constructionnisme psychologique.

**CARTOGRAFFECT** unifie ces perspectives en proposant une **architecture computationnelle et fonctionnelle rigoureuse**, ancrée dans les cadres du **traitement prédictif (*predictive processing*)**, de l'**inférence active**, de l'**inférence intéroceptive** et de la **régulation allostatique**.

L’architecture se déploie en quatre piliers certifiés formellement en Lean 4 :

---

### 1. Le Moteur Prédictif

Définit la circulation et la résorption des écarts de prédiction à travers trois dimensions fondamentales :

- **Gradient de Contrôle (Axe Y vertical — Contrôlabilité Pragmatique)** : Porte l'incertitude sensorimotrice et la capacité d'agir sur le monde pour conformer la réalité aux attentes de l'organisme (+Y : monde contrôlable / décharge pragmatique ; -Y : monde non contrôlable / charge pragmatique).
- **Gradient d'Attente (Axe X horizontal — Révisabilité Épistémique)** : Porte l'incertitude cognitive et la capacité à réviser le modèle interne (+X : modèle révisable / mise à jour épistémique ; -X : modèle non révisable / rigidité / charge épistémique).
- **Interface Attentionnelle (Axe Z orthogonal — Profondeur Inférentielle)** : Ne porte aucun contenu sémantique propre mais module la précision et le degré de confiance accordé aux flux sensoriels ou interprétatifs. Graduée de $Z = 0$ à $Z = 7$, elle indexe l'horizon temporel, le coût allostatique et le niveau d'abstraction. L'arbitrage entre l'axe épistémique (X) et l'axe pragmatique (Y) est gouverné exclusivement par la pondération de précision de cette interface attentionnelle.

---

### 2. Le Noyau Affectif & Conservation L1

Condense les forces régulatrices selon une géométrie discrète bornée :

- **Budget attentionnel fini sous la norme L1 de Manhattan** :
  $$\|X\| + \|Y\| = 2Z - 2 \quad \text{pour } Z \ge 2, \text{ avec } X, Y \in \mathbb{Z}$$
- **8 Strates d'Inférence ($Z = 0 \dots 7$) et 8 Opérateurs Centraux $(0,0,Z)$** :
  - $Z = 0$ : **Point de Veille $(0,0,0)$** — Veille homéostatique de fond.
  - $Z = 1$ : **Surprise $(0,0,1)$** — Rupture ascendante de repos, suspension indéterminée.
  - $Z = 2$ : **Anticipation $(0,0,2)$** — Première couronne affective.
  - $Z = 3$ : **Émoi $(0,0,3)$** — Suspension réactive.
  - $Z = 4$ : **Réserve $(0,0,4)$** — Suspension réflexive.
  - $Z = 5$ : **Recul $(0,0,5)$** — Suspension perspective.
  - $Z = 6$ : **Saisissement $(0,0,6)$** — Rupture critique de haut niveau.
  - $Z = 7$ : **Vertige Ontologique $(0,0,7)$** — Suspension existentielle.
- **Lexique canonique de 176 positions** : 168 états périphériques satisfaisant rigoureusement la contrainte $\|X\| + \|Y\| = 2Z - 2$ combinés aux 8 opérateurs centraux de suspension.
- **Dissipation Allostatique & Fonction de Lyapunov** :  
  La dynamique de résorption d'écart vers l'équilibre homéostatique $(0,0,0)$ est modélisée par un potentiel de Lyapunov discret $V(p) = 2Z + \mathbb{I}_{\text{periph}}(p)$. Sa variation temporelle $\Delta V < 0$ quantifie strictement le taux de dissipation allostatique et la convergence de la trajectoire affective.

---

### 3. La Matrice Affective (Strate Z = 2)

Arrime la dynamique algorithmique à l'espace phénoménologique à la première couronne ($Z=2$, budget $\|X\|+\|Y\|=2$) :

- **4 Orientations Axiales Pures (1 dimension résolue)** :
  - **Joie $(0, +2, 2)$** : Décharge de Contrôle, Attente indéterminée ($X=0$).
  - **Tristesse $(0, -2, 2)$** : Charge de Contrôle, Attente indéterminée ($X=0$).
  - **Courage $(+2, 0, 2)$** : Décharge d'Attente, Contrôle indéterminé ($Y=0$).
  - **Peur $(-2, 0, 2)$** : Charge d'Attente, Contrôle indéterminé ($Y=0$).
- **4 Prototypes Combinés Équilibrés (attracteurs stables, $\|X\|=\|Y\|=1$)** :
  - **Désir $(+1, +1, 2)$** : Modèle révisable & Monde contrôlable.
  - **Colère $(-1, +1, 2)$** : Modèle non révisable & Monde contrôlable.
  - **Calme $(+1, -1, 2)$** : Modèle révisable & Monde non contrôlable.
  - **Dégoût $(-1, -1, 2)$** : Modèle non révisable & Monde non contrôlable.
- **Antagonismes Formels Involutifs** :
  - Inversion centrale sur le losange : $(X, Y, Z) \mapsto (-X, -Y, Z)$
  - Réflexion controlatérale aux strates supérieures
  - Prouvé formellement involutif sans exception : $\text{antagonist}(\text{antagonist}(p)) = p$ (84 paires vérifiées dans Lean 4).

---

### 4. La Taxonomie Hiérarchique (4 Niveaux Inférentiels)

Organise l'univers affectif selon des niveaux emboîtés de profondeur temporelle et de complexité :

1. **Niveau 0 — Sensibilité Primaire & Éveil ($Z = 0, 1$)** : Veille homéostatique et détection de saillance ascendante.
2. **Niveau 1 — Affects Fondamentaux & Noyau d'Action ($Z = 2$)** : Matrice fondamentale des orientations axiales et attracteurs combinés.
3. **Niveau 2 — Émotions Situées & Réactives ($Z = 3$)** : Émotions dynamiques contextualisées à court terme ($\|X\|+\|Y\|=4$).
4. **Niveau 3 — Sentiments Complexes, Régulation & Humeurs ($Z = 4, 5, 6, 7$)** : Sentiments de second ordre, postures réflexives, humeurs lentes et états critiques.

---

## 🏛️ Structure du Dépôt Web

Le site web statique est structuré pour une consultation scientifique transparente et interactive :

- **`index.html`** : Page principale présentant l'architecture computationnelle, le moteur prédictif et les fondements théoriques.
- **`emotions.html`** : Explorateur interactif en D3.js de la carte des 176 positions, avec filtres par strate, visualisation des antagonismes formels et fiches computationnelles d'identité affective.
- **`scholar_drive.html`** : Corpus documentaire scientifique, documentation des preuves formelles Lean 4, formules mathématiques et liens de téléchargement certifiés.
- **`article.html`** : Version Web intégrale de la prépublication v1.0.1, avec moteur de recherche interne, métadonnées Schema.org et badges scientifiques.
- **`voyage.html`** : Parcours phénoménologique guidé à travers les strates de profondeur inférentielle.
- **`js/cartograffect_model.js`** : Modèle JavaScript canonique généré et synchronisé à l'identique avec le lexique certifié Lean 4 (`Lexicon176.lean`).

---

## 🔬 Preuves Formelles en Lean 4

Le système complet a fait l'objet d'une vérification formelle mécanisée en **Lean 4** (dépôt certifié, 0 `sorry`, 0 axiome ad hoc, DOI : [10.5281/zenodo.23833938](https://doi.org/10.5281/zenodo.23833938)) :

- `PredictiveEngine.lean` : Interfaces computationnelles, gradients d'Attente et de Contrôle, seuils de saillance.
- `AffectiveCore.lean` : Norme L1 de Manhattan ($\|X\| + \|Y\| = 2Z - 2$), potentiel de Lyapunov $V(p)$ et dissipation $\Delta V$.
- `AffectiveMatrix.lean` : Définition des 8 prototypes de base, théorème d'involution des antagonismes formels.
- `Taxonomy.lean` : Hiérarchie en 4 niveaux inférentiels.
- `Lexicon176.lean` : Spécification exhaustive et certification géométrique des 176 positions affectives discrètes.

---

## 📜 Propriété Intellectuelle & Licences

- **Marque Déposée** : **CARTOGRAFFECT®** est une marque déposée de Manuel Cabelguen. Tous droits réservés.
- **Théorie, Ontologie & Textes** : © 2026 Manuel Cabelguen. Tous droits réservés. Enregistrement auprès de l'OPIC (Office de la propriété intellectuelle du Canada) n° 1233199. Distribué sous licence [Creative Commons CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
- **Code Source & Algorithmes** : Distribué sous licence [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html).
