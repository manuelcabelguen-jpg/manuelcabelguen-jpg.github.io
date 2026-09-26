# CARTOGRAFFECT

> **Cartographie des affects : une architecture hiérarchique de l’expérience affective fondée sur le traitement prédictif**  
> *Manuel Cabelguen, Ph. D., BCN*  
> Droit d'auteur enregistré auprès de l'OPIC (Office de la propriété intellectuelle du Canada) n° 1233199  
> Site officiel : [www.cartograffect.com](https://www.cartograffect.com)

---

## 🌟 Présentation Théorique

L'étude scientifique des émotions demeure historiquement fragmentée entre les théories des émotions de base, les approches dimensionnelles (circonplexe de Russell), les modèles d'évaluation cognitive (appraisal) et le constructionnisme psychologique.

**CARTOGRAFFECT** dépasse ces clivages en proposant une **grammaire fonctionnelle unifiée** de l'affect, de l'émotion et du sentiment, enracinée dans les cadres du **traitement prédictif (predictive processing)**, de l'**inférence active**, de l'**inférence intéroceptive** et de l'**allostasie**.

L’architecture se déploie en quatre volets rigoureusement emboîtés :

### 1. Le Moteur Prédictif
Définit la circulation des écarts de prédiction à travers trois interfaces computationnelles fondamentales :
- **Interface Perceptive (Axe Y vertical — Gradient de Contrôle)** : Porte l'incertitude sensorimotrice et la capacité d'agir sur le monde pour conformer la réalité aux attentes de l'organisme (+Y : monde contrôlable / décharge pragmatique ; -Y : monde non contrôlable / repli adaptatif).
- **Interface Subjective (Axe X horizontal — Gradient d'Attente)** : Porte l'incertitude cognitive et la capacité à réviser le modèle interne (+X : modèle révisable / mise à jour épistémique ; -X : modèle non révisable / rigidité / charge épistémique).
- **Interface Attentionnelle (Axe Z orthogonal — Profondeur Inférentielle)** : Ne porte aucun contenu propre mais module la précision et le degré de confiance accordé aux flux sensoriels ou interprétatifs. Graduée à partir de $Z \ge 0$, elle indexe l'horizon temporel et le niveau d'abstraction.

### 2. Le Noyau Affectif
Condense les forces régulatrices selon une dynamique de **charge** (écart non résorbé / énergie libre croissante) et de **décharge** (écart résorbé / énergie libre décroissante) :
- **Budget attentionnel fini sous la norme L1 de Manhattan** :
  $$\|X\| + \|Y\| = 2Z - 2 \quad \text{pour } Z \ge 2, \text{ avec } X, Y \in \mathbb{Z}$$
- **Statut de l'activation somatique** : L'activation n'est pas une coordonnée spatiale de la carte, mais un paramètre de vitesse et de mobilisation transversal à l'ensemble de la trajectoire.
- **Statut de la valence** : Se lit à partir des polarités axiales et de la résolution intégrée de la trajectoire.

### 3. La Matrice Affective (Strate Z = 2)
Arrime la dynamique algorithmique à l'espace phénoménologique à la première couronne ($Z=2$, budget $\|X\|+\|Y\|=2$) :
- **4 Orientations Axiales Pures (instables, 1 dimension résolue)** :
  - **Joie $(0, +2, 2)$** : Décharge de Contrôle, Attente indéterminée ($X0$).
  - **Tristesse $(0, -2, 2)$** : Charge de Contrôle, Attente indéterminée ($X0$).
  - **Courage $(+2, 0, 2)$** : Décharge d'Attente, Contrôle indéterminé ($Y0$).
  - **Peur $(-2, 0, 2)$** : Charge d'Attente, Contrôle indéterminé ($Y0$).
- **4 Prototypes Combinés Équilibrés (attracteurs locaux stables, $\|X\|=\|Y\|=1$)** :
  - **Désir $(+1, +1, 2)$** : Modèle révisable & Monde contrôlable.
  - **Colère $(-1, +1, 2)$** : Modèle non révisable & Monde contrôlable.
  - **Calme $(+1, -1, 2)$** : Modèle révisable & Monde non contrôlable.
  - **Dégoût $(-1, -1, 2)$** : Modèle non révisable & Monde non contrôlable.
- **Inversion Centrale $(X, Y) \to (-X, -Y)$** : Constitue la relation d'antagonisme adaptatif principal de la Matrice (ex. Colère $\leftrightarrow$ Calme, Désir $\leftrightarrow$ Dégoût).

### 4. La Taxonomie Hiérarchique (Les 5 Couches d'Inférence)
Organise l'univers affectif selon des niveaux croissants de profondeur temporelle et d'abstraction. Chaque strate est centrée sur un **opérateur de suspension** non résolu ($0 \ne 2Z - 2$) :
- **Niveau Initial ($Z = 0$)** : **Point de Veille $(0, 0, 0)$** — Veille homéostatique de fond.
- **1ère Couche ($Z = 1$)** : **Surprise $(0, 0, 1)$** — Rupture ascendante de repos, entrée indéterminée dans l'espace.
- **2e Couche ($Z = 2$)** : **Anticipation $(0, 0, 2)$** — Première couronne affective (orientations axiales et attracteurs combinés).
- **3e Couche ($Z = 3$)** : **Émoi $(0, 0, 3)$** — Émotions réactives, horizon immédiat ($\|X\|+\|Y\|=4$).
- **4e Couche ($Z = 4$)** : **Réserve $(0, 0, 4)$** — Sentiments réflexifs, modèles de second ordre (soi face à autrui, $\|X\|+\|Y\|=6$).
- **5e Couche ($Z = 5$)** : **Recul $(0, 0, 5)$** — Orientations stables & Humeurs, paramètres lents sur classes étendues de situations ($\|X\|+\|Y\|=8$).

---

## 🗺️ Les Trois Territoires de la Plateforme

1. **[Territoire 1 : ÉMOTIONS](emotions.html)**
   - Visualisation interactive sous D3.js avec graduation selon la norme L1 de Manhattan (losanges $\|X\|+\|Y\|=2Z-2$).
   - Filtres dynamiques par strates d'inférence $Z \in \{0, 1, 2, 3, 4, 5\}$.
   - Visualisation des antagonismes centraux $(X,Y) \to (-X,-Y)$ et des symétries axiales.
   - Fiches d'identité computationnelles détaillant la révision épistémique (Axe X), l'action pragmatique (Axe Y) et la minimisation de l'énergie libre.
   - Traçage dynamique de trajectoires et simulateur d'inversion matricielle.

2. **[Territoire 2 : CRIMES](crimes.html)**
   - Analyse des impasses computationnelles et des blocages de l'inférence active aux strates profondes ($Z=4, 5$).
   - Étude des boucles d'immunisation cognitive, du ressentiment gelé et de l'effondrement allostatique.

3. **[Territoire 3 : MIRACLES](miracles.html)**
   - Transmutation affective par inférence active congruente.
   - Navigateur d'itinéraires de résilience cartographiés étape par étape.
   - Activation des antagonistes centraux pour restaurer la viabilité adaptative.

4. **Laboratoire IA Scientifique** *(Actuellement en cours de développement / Standby)*
   - Module d'analyse et de formalisation assistée par modèles de langage pour la cartographie des états affectifs et la production de synthèses théoriques.

---

## 📜 Propriété Intellectuelle & Droits d'Auteur

- **Théorie, Ontologie & Textes** : © 2026 Manuel Cabelguen. Tous droits réservés. Enregistrement auprès de l'OPIC n° 1233199. Licence [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
- **Code Source & Algorithmes** : Licence [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html).
