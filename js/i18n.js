/**
 * CARTOGRAFFECT® — Native Bilingual UI Switcher (FR <-> EN)
 * Zero-dependency DOM translator that preserves [data-payload], SVG icons, and KaTeX nodes.
 */
(function (root) {
    'use strict';

    const STORAGE_KEY = 'cartograffect_lang';
    const DEFAULT_LANG = 'fr';

    const textOrigMap = new WeakMap();
    const attrOrigMap = new WeakMap();

    // Exact trimmed text-node dictionary (FR -> EN)
    const TEXT_FR_EN = {
        // Brand & Header
        'Aller au contenu principal': 'Skip to main content',
        'Architecture hiérarchique affective': 'Hierarchical Affective Architecture',
        'Accueil': 'Home',
        'Le Voyage': 'The Journey',
        'Le Modèle': 'The Model',
        'Moteur Prédictif': 'Predictive Engine',
        'Interfaces, seuils & gradients A/C': 'Interfaces, thresholds & A/C gradients',
        'Noyau Affectif': 'Affective Core',
        'Espace (X, Y, Z) & norme L₁': 'Space (X, Y, Z) & L₁ norm',
        'Matrice Affective': 'Affective Matrix',
        'Orientation, valence & prototypes Z=2': 'Orientation, valence & Z=2 prototypes',
        'Taxonomie Affective': 'Affective Taxonomy',
        '176 états, strates Z=0..7 & carte 2D/3D': '176 states, strata Z=0..7 & 2D/3D map',
        "L'Article": 'The Paper',
        'Corpus & Preuves': 'Corpus & Proofs',
        'Rechercher': 'Search',
        'Carte 176': '176 Map',
        'Navigation': 'Navigation',

        // Mobile & Footer
        'Le Voyage (2 min)': 'The Journey (2 min)',
        '1. Moteur Prédictif': '1. Predictive Engine',
        '2. Noyau Affectif': '2. Affective Core',
        '3. Matrice Affective': '3. Affective Matrix',
        '4. Taxonomie (176)': '4. Taxonomy (176)',
        '4. La Taxonomie (176 États)': '4. Taxonomy (176 States)',
        'Mentions Légales & Propriété Intellectuelle': 'Legal Notice & Intellectual Property',
        'Mentions Légales & IP': 'Legal Notice & IP',
        'Architecture & Navigation': 'Architecture & Navigation',
        'Références & Preuves': 'References & Proofs',
        'Article': 'Paper',
        "L'Article (v2.1.0)": 'The Paper (v2.1.0)',
        'Compendium formel': 'Formal Compendium',
        'prouveurs) :': 'provers):',
        'prouveurs ·': 'provers ·',
        'GitHub Compendium': 'GitHub Compendium',
        "Architecture computationnelle et taxonomique des affects fondée sur le traitement prédictif, l'inférence active et la régulation allostatique.":
            'Computational and taxonomic architecture of affect grounded in predictive processing, active inference, and allostatic regulation.',
        '© 2024–2026 Manuel Cabelguen, Ph. D. • Marque déposée • OPIC n° 1233199':
            '© 2024–2026 Manuel Cabelguen, Ph. D. • Registered Trademark • CIPO #1233199',
        '© 2024–2026 Manuel Cabelguen, Ph. D.': '© 2024–2026 Manuel Cabelguen, Ph. D.',

        // Index Hero, Nav, Bento & Visualizer Controls
        'Boussole': 'Compass',
        'Origines': 'Origins',
        '2. Les 2 Leviers (X, Y)': '2. The 2 Levers (X, Y)',
        '3. Norme L₁': '3. L₁ Norm',
        '4. Strates Z=0..7': '4. Strata Z=0..7',
        '5. Architecture & Preuves': '5. Architecture & Proofs',
        '6. Explorateur 176': '6. Explorer 176',
        '7. Pour Qui & Citation': '7. Audience & Citation',
        'La Boussole Intérieure de nos Émotions': 'The Inner Compass of Our Emotions',
        "Et si nos émotions n'étaient pas des pannes de notre raison, mais des outils de navigation sur une carte de":
            'What if our emotions were not failures of reason, but navigation instruments on a map of',
        'états affectifs répertoriés ?': 'catalogued affective states?',
        '1. Découvrir le Fonctionnement ↓': '1. Discover How It Works ↓',
        'Ouvrir le Radar Géométrique ↓': 'Open Geometric Radar ↓',
        'Explorer la Taxonomie (176) →': 'Explore the Taxonomy (176) →',
        'Lire la Monographie →': 'Read the Monograph →',
        'Consulter les Preuves ↗': 'Inspect Formal Proofs ↗',
        "Vivre l'Expérience →": 'Experience the Journey →',
        "Lancer l'Exploration de la Carte Interactive →": 'Launch the Interactive Map Explorer →',
        'Lancer le Voyage (2 min)': 'Start the Journey (2 min)',
        'Vivre le Voyage affectif (2 min) →': 'Live the Affective Journey (2 min) →',
        'Explorer la Carte 176': 'Explore the 176 Map',
        'Explorer la Carte 3D': 'Explore the 3D Map',
        "Lire l'Article": 'Read the Paper',
        '3D Orbitale': '3D Orbital',
        'Carte 2D': '2D Map',
        'Pulsation': 'Pulse',
        'Auto-Rotation': 'Auto-Rotate',
        'Simuler Signal': 'Simulate Signal',
        'Toutes Strates': 'All Strata',
        'Toutes (176)': 'All (176)',
        'Z=0..2 Prototypes': 'Z=0..2 Prototypes',
        'Opérateur': 'Operator',
        'Axiales': 'Axial',
        'Diagonales': 'Diagonal',
        'Latérales': 'Lateral',
        'Copier citation': 'Copy citation',
        'Copier la citation APA': 'Copy APA citation',
        'Veille': 'Wake',
        'Surprise': 'Surprise',
        'Prototypes': 'Prototypes',
        'Émotions': 'Emotions',
        'Existentiel': 'Existential',
        'Glisser 3D • Ctrl+Molette ou +/−': 'Drag 3D • Ctrl+Wheel or +/−',
        'État sélectionné :': 'Selected state:',
        'Explorer sur la carte': 'Explore on map',
        'Le Voyage Affectif': 'The Affective Journey',
        'Première couronne (8 prototypes) & Opérateur Anticipation (0,0,2)': 'First Crown (8 Prototypes) & Anticipation Operator (0,0,2)',
        "À qui s'adresse cette boussole ?": 'Who Is This Compass For?',
        'Psychologues & Cliniciens': 'Psychologists & Clinicians',
        'Chercheurs en Sciences Cognitives': 'Cognitive Science Researchers',
        'Clarté Émotionnelle Personnelle': 'Personal Emotional Clarity',
        'Comment citer les travaux Cartograffect ?': 'How to Cite CARTOGRAFFECT?',

        // Index Bento / Sections
        'Les Origines : Pourquoi nos émotions ne sont pas des anomalies': 'Origins: Why Our Emotions Are Not Anomalies',
        '1. Le Point de Départ : Comment naissent nos émotions': '1. Starting Point: How Our Emotions Arise',
        "2. La Boussole : Les deux choix face à l'imprévu": '2. The Compass: Two Choices Facing the Unexpected',
        'Levier Y • Contrôlabilité Pragmatique (Axe Y)': 'Lever Y • Pragmatic Controllability (Y Axis)',
        'Levier X • Révisabilité Épistémique (Axe X)': 'Lever X • Epistemic Revisability (X Axis)',
        "3. La Règle d'Équilibre : Pourquoi nous ne pouvons pas tout ressentir à la fois": '3. The Balance Rule: Why We Cannot Feel Everything at Once',
        "4. L'Élévation de la Conscience : Du Réflexe Corporel aux Idéaux de Vie": '4. Rising Awareness: From Bodily Reflex to Life Ideals',
        'Point de Veille — Éveil Homéostatique': 'Wake Point — Homeostatic Awareness',
        'Surprise — Réactivité Sensorimotrice': 'Surprise — Sensorimotor Reactivity',
        'Anticipation — Prototypes Fondamentaux': 'Anticipation — Fundamental Prototypes',
        'Émoi — Émotions Réactives & Sociales': 'Stir — Reactive & Social Emotions',
        'Réserve — États Relationnels & Métacognition': 'Reserve — Relational States & Metacognition',
        'Recul — Dispositions Durables & Traits': 'Stepping Back — Enduring Dispositions & Traits',
        'Saisissement — Identités Affectives': 'Awe & Grip — Affective Identities',
        'Suspension — Horizon Existentiel': 'Suspension — Existential Horizon',
        "L'Architecture Complète de CARTOGRAFFECT": 'The Complete CARTOGRAFFECT Architecture',
        'Du Moteur Prédictif aux 176 États': 'From Predictive Engine to 176 States',
        "L'Explorateur Interactif : Voyage au Cœur des 176 Émotions": 'Interactive Explorer: Journey Through the 176 Emotions',
        "L'Article Théorique": 'The Theoretical Paper',
        'Compendium Formel': 'Formal Compendium',

        // Article Page
        'Article Scientifique Fondateur': 'Foundational Scientific Paper',
        'Cartographie des affects : une architecture hiérarchique de l’expérience affective fondée sur le traitement prédictif':
            'Mapping Affect: A Hierarchical Architecture of Affective Experience Grounded in Predictive Processing',
        'Résumé': 'Abstract',
        'FR Résumé (Français)': 'FR Summary (French)',
        'EN Abstract (English)': 'EN Abstract (English)',
        '1. Introduction': '1. Introduction',
        '2. Position Épistémologique': '2. Epistemological Position',
        '3. Fondements Théoriques du Traitement Prédictif Affectif': '3. Theoretical Foundations of Affective Predictive Processing',
        '3.1. Cognition incarnée et inférence active': '3.1. Embodied Cognition and Active Inference',
        '3.2. L’inférence intéroceptive': '3.2. Interoceptive Inference',
        '4. Le Moteur Prédictif': '4. The Predictive Engine',
        'Le Moteur prédictif': 'The Predictive Engine',
        '5. Le Noyau Affectif': '5. The Affective Core',
        '5.1. Les deux gradients de l’évaluation adaptative': '5.1. The Two Gradients of Adaptive Appraisal',
        '5.2. Modulation attentionnelle et géométrie des configurations élémentaires': '5.2. Attentional Modulation and Geometry of Elementary Configurations',
        'Schéma du Noyau affectif en coupe à la strate Z = 2': 'Cross-Section of the Affective Core at Stratum Z = 2',
        '6. La Matrice Affective': '6. The Affective Matrix',
        '6.1. Les quatre orientations axiales': '6.1. The Four Axial Orientations',
        '6.2. Les quatre prototypes combinés': '6.2. The Four Combined Prototypes',
        '6.3. Dynamique de la Matrice': '6.3. Dynamics of the Matrix',
        'Matrice affective en coupe à la strate Z = 2': 'Affective Matrix Cross-Section at Stratum Z = 2',
        '7. La Taxonomie Affective Hiérarchique': '7. The Hierarchical Affective Taxonomy',
        '7. La Taxonomie Affective': '7. The Affective Taxonomy',
        '7.1. La Taxonomie hiérarchique': '7.1. Hierarchical Taxonomy',
        '7.2. Les cinq couches de l’inférence affective': '7.2. The Five Layers of Affective Inference',
        '7.3. L’articulation des couches : contrôlabilité et révisabilité': '7.3. Layer Articulation: Controllability and Revisability',
        'Synthèse de la Taxonomie Hiérarchique des Affects': 'Synthesis of the Hierarchical Affective Taxonomy',
        '8. Discussion et Pistes de Recherche': '8. Discussion and Research Avenues',
        '8. Discussion': '8. Discussion',
        '8.1. Dialogue avec les théories existantes': '8.1. Dialogue with Existing Theories',
        '8.2. Forces et limites': '8.2. Strengths and Limitations',
        '9. Conclusion': '9. Conclusion',
        'Déclaration relative à l’utilisation de l’intelligence artificielle générative': 'Generative Artificial Intelligence Disclosure Statement',
        'Disponibilité des données et du référentiel algorithmique': 'Data and Algorithmic Repository Availability',
        'Références': 'References',
        'Table des matières': 'Table of Contents',
        "Simulateur Didactique de l'Affect Prédictif": 'Didactic Affective Predictive Simulator',
        'Comment CARTOGRAFFECT unifie et résout les 4 théories historiques': 'How CARTOGRAFFECT Unifies and Resolves the 4 Historical Theories',
        'Mode Didactique': 'Didactic Mode',
        'Mode Académique': 'Academic Mode',
        'Mode Didactique & Pédagogique': 'Didactic & Pedagogical Mode',
        'Texte Académique Intégral': 'Full Academic Text',
        'Copier Citation': 'Copy Citation',
        '+Y : Monde Contrôlable (Agir) +1': '+Y: Controllable World (Act) +1',
        'Y0 : Contrôle Indéterminé 0': 'Y0: Indeterminate Control 0',
        '-Y : Monde Non Contrôlable (Laisser) -1': '-Y: Uncontrollable World (Let Go) -1',
        '+X : Modèle Révisable (Ajuster) +1': '+X: Revisable Model (Adjust) +1',
        'X0 : Attente Indéterminée 0': 'X0: Indeterminate Expectation 0',
        '-X : Modèle Non Révisable (Tenir) -1': '-X: Non-Revisable Model (Hold) -1',
        '0. Résumé & Abstract': '0. Summary & Abstract',
        '1. Introduction & Clivages': '1. Introduction & Divides',
        '3. Fondements Théoriques': '3. Theoretical Foundations',
        '7. La Taxonomie Hiérarchique': '7. Hierarchical Taxonomy',
        'Tableau 1 · Strates Z=0..7': 'Table 1 · Strata Z=0..7',
        '8. Discussion & Prédictions': '8. Discussion & Predictions',
        'Tableau 2 · Prédictions P1–P5': 'Table 2 · Predictions P1–P5',
        '9. Conclusion & Disponibilité': '9. Conclusion & Availability',
        'Fig. 1 (Architecture)': 'Fig. 1 (Architecture)',
        'Fig. 2 (Noyau L1)': 'Fig. 2 (L1 Core)',
        'Fig. 3 (Matrice)': 'Fig. 3 (Matrix)',
        'Fig. 4 (Taxonomie)': 'Fig. 4 (Taxonomy)',
        'Simulateur': 'Simulator',
        'Inférence Active (23)': 'Active Inference (23)',
        'Intéroception & Allostasie (8)': 'Interoception & Allostasis (8)',
        'Théories des Émotions (23)': 'Emotion Theories (23)',
        'Psychiatrie Computationnelle (6)': 'Computational Psychiatry (6)',
        'Affectivisme & Modèles (12)': 'Affectivism & Models (12)',

        // Moteur Prédictif Page
        'Interfaces & Gradients A/C': 'Interfaces & A/C Gradients',
        'Espace (X,Y,Z) & L₁': 'Space (X,Y,Z) & L₁',
        'Valence & Prototypes Z=2': 'Valence & Z=2 Prototypes',
        '176 États & Carte 2D/3D': '176 States & 2D/3D Map',
        "Composante 1 • Section 4 de l'Article • Module PredictiveEngine.lean": 'Component 1 • Section 4 of the Paper • PredictiveEngine.lean Module',
        'Le Moteur Prédictif :': 'The Predictive Engine:',
        "Gérer l'Incertitude": 'Managing Uncertainty',
        "Le Moteur Prédictif : Gérer l'Incertitude": 'The Predictive Engine: Managing Uncertainty',
        "Premier niveau de l'architecture Cartograffect, le Moteur prédictif reçoit une seule grandeur d'entrée —": 'At the first level of the Cartograffect architecture, the Predictive Engine receives a single input quantity —',
        "l'écart de prédiction saillant": 'salient prediction error',
        "— et en évalue l'incertitude de résolution au moyen de trois interfaces fonctionnelles interdépendantes :": '— and assesses its resolution uncertainty through three interdependent functional interfaces:',
        '(Contrôle C),': '(Control C),',
        '(Attente A) et': '(Expectation A) and',
        '(pondération de précision).': '(precision weighting).',
        'Règle Terminologique Stricte': 'Strict Terminological Rule',
        'qualifient ici exclusivement un': 'here qualify exclusively a',
        'état fonctionnel de résolution': 'functional resolution state',
        'décharge': 'discharge',
        'charge': 'charge',
        'neutralité': 'neutrality',
        'sous seuil), et': 'below threshold), and',
        "une valence hédonique (qui n'émerge qu'au niveau 3, dans la Matrice affective).": 'hedonic valence (which emerges only at Level 3, in the Affective Matrix).',
        'Laboratoire Interactif • PredictiveEngine.lean': 'Interactive Lab • PredictiveEngine.lean',
        "Simulateur du Moteur Prédictif & Boucle d'Inférence": 'Predictive Engine Simulator & Inference Loop',
        'Veille basale': 'Basal wake',
        'Surprise (0,0,1)': 'Surprise (0,0,1)',
        'Anticipation (0,0,2)': 'Anticipation (0,0,2)',
        'Rémanence': 'Remanence',
        'A− / C+ (Colère)': 'A− / C+ (Anger)',
        'A+ / C− (Calme)': 'A+ / C− (Calm)',
        'A+ / C+ (Désir)': 'A+ / C+ (Desire)',
        '1. Écart de Prédiction & Hystérésis': '1. Prediction Error & Hysteresis',
        'Magnitude : 6': 'Magnitude: 6',
        "Amplitude de l'écart montant": 'Ascending discrepancy amplitude',
        'Seuil sensoriel': 'Sensory threshold',
        'Seuil de résorption (≤ sens.)': 'Resorption threshold (≤ sens.)',
        "Invariant d'hystérésis (": 'Hysteresis invariant (',
        ") : explique la rémanence temporaire d'un état affectif entre ces deux seuils.": '): explains the temporary remanence of an affective state between these two thresholds.',
        '2. Interface Attentionnelle & Profondeur': '2. Attentional Interface & Depth',
        'Engagée': 'Engaged',
        'Engagée (Π ≥ seuil)': 'Engaged (Π ≥ threshold)',
        'Sous seuil': 'Below threshold',
        'Précision allouée (Π)': 'Allocated precision (Π)',
        "Seuil d'engagement": 'Engagement threshold',
        'Profondeur d (Z = 2 + d)': 'Depth d (Z = 2 + d)',
        'Suspension descendante (R5)': 'Descending suspension (R5)',
        "Retient l'affect sur (0, 0, Z) quand Π < seuil.": 'Holds affect on (0, 0, Z) when Π < threshold.',
        "3. Interface Subjective → Gradient d'Attente (A)": '3. Subjective Interface → Expectation Gradient (A)',
        '4. Interface Perceptive → Gradient de Contrôle (C)': '4. Perceptual Interface → Control Gradient (C)',
        'A− (Charge)': 'A− (Charge)',
        'A0 (Neutre)': 'A0 (Neutral)',
        'A+ (Décharge)': 'A+ (Discharge)',
        'C− (Charge)': 'C− (Charge)',
        'C0 (Neutre)': 'C0 (Neutral)',
        'C+ (Décharge)': 'C+ (Discharge)',
        'Mode exploratoire (π': 'Exploratory mode (π',
        '— asymétrie latérale si Z ≥ 3': '— lateral asymmetry when Z ≥ 3',
        'Part épistémique π': 'Epistemic share π',
        '50% / 50% (Lean strict)': '50% / 50% (Strict Lean)',
        'Règle formelle (CoreAffect.lean) :': 'Formal rule (CoreAffect.lean):',
        'la neutralité globale': 'global neutrality',
        'suppose au moins un gradient polarisé sous engagement (': 'requires at least one polarized gradient under engagement (',
        'Déploiement Z=2': 'Z=2 Deployment',
        'Attente : A+ (Décharge)': 'Expectation: A+ (Discharge)',
        'Contrôle : C+ (Décharge)': 'Control: C+ (Discharge)',
        'Mag = 6 | Seuil = 4': 'Mag = 6 | Thresh = 4',
        'Π = 6 (Engagée)': 'Π = 6 (Engaged)',
        'Couplage (A+, C+)': 'Coupling (A+, C+)',
        'État : Désir': 'State: Desire',
        'Déploiement Diagonal Z=2 (+1, +1, 2)': 'Z=2 Diagonal Deployment (+1, +1, 2)',
        'Prototype : Désir': 'Prototype: Desire',
        'Régime Épistémique (A)': 'Epistemic Regime (A)',
        'Régime Pragmatique (C)': 'Pragmatic Regime (C)',
        'Transmettre ces coordonnées au niveau suivant :': 'Forward these coordinates to the next level:',
        'Figure 1 Interactive • Le Moteur prédictif (architecture fonctionnelle)': 'Interactive Figure 1 • The Predictive Engine (Functional Architecture)',
        'Figure 1 Interactive • Le Moteur prédictif canonique (Arbitrages A1–A4)': 'Interactive Figure 1 • The Canonical Predictive Engine (Arbitrations A1–A4)',
        'Figure 1 • Schéma Conceptuel': 'Figure 1 • Conceptual Diagram',
        'Le Moteur prédictif canonique (Arbitrages A1–A4)': 'The Canonical Predictive Engine (Arbitrations A1–A4)',
        'Interfaces & Couplages (A / C)': 'Interfaces & Couplings (A / C)',
        'Schéma vectoriel canonique à 2 boucles contra-rotatives et 6 circuits continus (source unique de vérité).':
            'Canonical vector diagram with 2 counter-rotating loops and 6 continuous circuits (single source of truth).',
        'Consulter la spécification formelle sur GitHub': 'View formal specification on GitHub',
        // Canonical Predictive Engine SVG (#moteur-svg)
        'Décharge': 'Discharge',
        'Charge': 'Charge',
        'Neutre': 'Neutral',
        "Signaux efférents (copie d'efférence)": 'Efferent signals (efference copy)',
        'INTERFACE SUBJECTIVE': 'SUBJECTIVE INTERFACE',
        'Modèle révisable ? (-X / +X / 0)': 'Revisable model? (-X / +X / 0)',
        '[États cachés]': '[Hidden states]',
        'Modèles génératifs & a priori': 'Generative models & priors',
        'Opérateur A : révisabilité (ρ)': 'Operator A: revisability (ρ)',
        'Réponse isolée sur 3 circuits (A0, A-, A+)': 'Isolated 3-circuit response (A0, A-, A+)',
        "Projection directe du niveau d'opérabilité Z": 'Direct projection of operability level Z',
        'INTERFACE PERCEPTIVE': 'PERCEPTUAL INTERFACE',
        'Monde contrôlable ? (+Y / -Y / 0)': 'Controllable world? (+Y / -Y / 0)',
        'Comparateur efférence / afférence': 'Efference / afference comparator',
        'Opérateur C : contrôlabilité (κ)': 'Operator C: controllability (κ)',
        'Réponse isolée sur 3 circuits (C0, C-, C+)': 'Isolated 3-circuit response (C0, C-, C+)',
        'Ensemble des possibles': 'Set of possibilities',
        "Réduction d'information": 'Information reduction',
        'INTERFACE ATTENTIONNELLE': 'ATTENTIONAL INTERFACE',
        'Ensemble des possibles : affect, émotion, sentiment': 'Set of possibilities: affect, emotion, feeling',
        'Champs : {±X, ±Y, Z} ⟷ (±π_A, ±π_C, Z)': 'Fields: {±X, ±Y, Z} ⟷ (±π_A, ±π_C, Z)',
        'Couronne : |π_A| + |π_C| = 2Z − 2 (Z ≥ 2)': 'Crown: |π_A| + |π_C| = 2Z − 2 (Z ≥ 2)',
        "Réduction de l'information : compression vers l'action": 'Information reduction: compression toward action',
        'Voie ascendante réflexive :': 'Reflexive upward path:',
        "possibilités d'action (révision)": 'action possibilities (revision)',
        'CORPS et': 'BODY and',
        'ENVIRONNEMENT': 'ENVIRONMENT',
        '(Couverture de Markov)': '(Markov Blanket)',
        'Voie descendante comportementale :': 'Behavioral downward pathway:',
        "politiques d'action sur le milieu": 'action policies on the environment',
        'Signaux afférents': 'Afferent signals',
        '(retour sensoriel & intéroceptif)': '(sensory & interoceptive feedback)',
        'ATTENTE': 'EXPECTATION',
        'NEUTRE (A0)': 'NEUTRAL (A0)',
        'INCERTAINE (A-)': 'UNCERTAIN (A-)',
        'CERTAINE (A+)': 'CERTAIN (A+)',
        'CONTRÔLE': 'CONTROL',
        'NEUTRE (C0)': 'NEUTRAL (C0)',
        'INCERTAIN (C-)': 'UNCERTAIN (C-)',
        'CERTAIN (C+)': 'CERTAIN (C+)',
        "Sections 3 & 4 de l'Article • Fondements Théoriques": 'Sections 3 & 4 of the Paper • Theoretical Foundations',
        'Inférence Active, Allostasie Intéroceptive & Frontière Sensorielle-Active': 'Active Inference, Interoceptive Allostasis & Sensory-Active Boundary',
        'Cognition Incarnée & Inférence Active': 'Embodied Cognition & Active Inference',
        "L'organisme maintient sa viabilité en minimisant la divergence entre ses prédictions et les signaux sensoriels : soit en ajustant ses modèles internes (": 'The organism maintains viability by minimizing divergence between predictions and sensory signals: either by updating its internal models (',
        'valeur épistémique': 'epistemic value',
        ", réduisant l'ambiguïté), soit en agissant sur le monde (": ', reducing ambiguity), or by acting on the world (',
        'valeur pragmatique': 'pragmatic value',
        ', réduisant le risque attendu) (Friston, 2010 ; Clark, 2016 ; Parr et al., 2022).': ', reducing expected risk) (Friston, 2010; Clark, 2016; Parr et al., 2022).',
        'Allostasie vs Homéostasie': 'Allostasis vs Homeostasis',
        'homéostasie': 'homeostasis',
        'allostasie': 'allostasis',
        "corrige les déviations autour de points de consigne fixes (Point de Veille). L'": 'corrects deviations around fixed setpoints (Wake Point). ',
        "(Sterling, 2012 ; Barrett & Simmons, 2015 ; Seth, 2013) ajuste proactivement les paramètres physiologiques en prévision des besoins à venir. À ce stade primaire, l'affect est pré-sémantique et pré-linguistique.": '(Sterling, 2012; Barrett & Simmons, 2015; Seth, 2013) proactively adjusts physiological parameters in anticipation of upcoming needs. At this primary stage, affect is pre-semantic and pre-linguistic.',
        'Précaution Épistémologique': 'Epistemological Precaution',
        'Décomposition Fonctionnelle': 'Functional Decomposition',
        'Les Trois Interfaces du Moteur Prédictif': 'The Three Interfaces of the Predictive Engine',
        'Axe Y • Contrôle (C)': 'Y Axis • Control (C)',
        'Axe X • Attente (A)': 'X Axis • Expectation (A)',
        'Axe Z • Opérabilité': 'Z Axis • Operability',
        'Possibles & Réduction ΔH': 'Possibilities & ΔH Reduction',
        '1. Interface Perceptive': '1. Perceptual Interface',
        'C0 (Neutre) :': 'C0 (Neutral):',
        'régime de routine ; micro-écarts sous le seuil de saillance.': 'routine regime; micro-discrepancies below the salience threshold.',
        'C− (Incertain / Charge) :': 'C− (Uncertain / Charge):',
        'faible contrôlabilité estimée ; résorption par': 'low estimated controllability; resorption by',
        'résolution active': 'active resolution',
        'extinction passive': 'passive extinction',
        'C+ (Certain / Décharge) :': 'C+ (Certain / Discharge):',
        "situation jugée modifiable ; mobilisation de l'action puis retour homéostatique.": 'situation judged modifiable; action mobilization followed by homeostatic return.',
        '2. Interface Subjective': '2. Subjective Interface',
        'A0 (Neutre) :': 'A0 (Neutral):',
        "flux conformes aux croyances d'arrière-plan, aucune saillance épistémique.": 'streams consistent with background beliefs, no epistemic salience.',
        'A− (Incertain / Charge) :': 'A− (Uncertain / Charge):',
        "mise à jour possible des croyances ; intégration de l'écart dans le modèle génératif.": 'possible belief updating; integration of discrepancy into the generative model.',
        'A+ (Certain / Décharge) :': 'A+ (Certain / Discharge):',
        '3. Interface Attentionnelle': '3. Attentional Interface',
        'Projection directe de Z :': 'Direct Z projection:',
        'sans incrémentation forcée.': 'without forced step incrementation.',
        'Double notation (A2) :': 'Dual notation (A2):',
        'Indépendance P1 / P2 :': 'P1 / P2 Independence:',
        'Boucle Récursive • InferentialOperation': 'Recursive Loop • InferentialOperation',
        'Les 4 Opérations Inférentielles Non Séquentielles': 'The 4 Non-Sequential Inferential Operations',
        '1. Inférence sensorielle ascendante': '1. Ascending sensory inference',
        'Remontée des écarts viscéraux, proprioceptifs et extéroceptifs.': 'Upward transmission of visceral, proprioceptive, and exteroceptive discrepancies.',
        "2. Mise en œuvre de l'action": '2. Action implementation',
        'Engagement moteur et ajustements comportementaux sur le corps/monde.': 'Motor engagement and behavioral adjustments on body/world.',
        '3. Inférence générative contextuelle': '3. Contextual generative inference',
        "Production d'hypothèses causales et de scénarios prospectifs (Anticipation).": 'Generation of causal hypotheses and prospective scenarios (Anticipation).',
        '4. Inférence intégrative & rétroaction': '4. Integrative inference & feedback',
        "Actualisation pondérée de l'état latent et réinjection vers A et C.": 'Precision-weighted latent state updating and feedback to A and C.',
        'Croisement I & Croisement II • 9 Ensembles': 'Crossing I & Crossing II • 9 Sets',
        'Les 9 Couplages (A, C) : Voies Réflexive & Comportementale': 'The 9 Couplings (A, C): Reflexive & Behavioral Pathways',
        'Base I : Veille (0,0,0)': 'Base I: Wake (0,0,0)',
        'Poss. (Z≥1) : {0, 0, Z}': 'Poss. (Z≥1): {0, 0, Z}',
        'Passer au Noyau Affectif →': 'Continue to Affective Core →',

        // Noyau Affectif Page
        'Le Noyau Affectif : Espace Géométrique (X, Y, Z)': 'The Affective Core: Geometric Space (X, Y, Z)',
        'Coupe du Noyau Affectif & Loi des Couronnes L₁': 'Affective Core Cross-Section & L₁ Crown Law',
        'Contrôle Primaire (Y) & Contrôle Secondaire (X)': 'Primary Control (Y) & Secondary Control (X)',
        "Cône d'Amorçage, Norme L₁ & Stabilité des Régimes": 'Priming Cone, L₁ Norm & Regime Stability',
        'Répartition Certifiée des Couronnes (Z = 0 à Z = 7) — Total : 176 Entrées': 'Certified Crown Distribution (Z = 0 to Z = 7) — Total: 176 Entries',
        'Passer à la Matrice Affective →': 'Continue to Affective Matrix →',

        // Matrice Affective Page
        '3. La Matrice Affective : Valence, Régimes Énergétiques & Prototypes Z=2': '3. The Affective Matrix: Valence, Energetic Regimes & Z=2 Prototypes',
        'La Matrice Affective Fondamentale ($Z = 2$)': 'The Fundamental Affective Matrix ($Z = 2$)',
        'Comparateur des 4 Paires Antagonistes Z=2': 'Comparator of the 4 Antagonistic Pairs Z=2',
        'Loi de Dissipation Allostatique & Fenêtre de Rémanence': 'Allostatic Dissipation Law & Remanence Window',
        'Trajectoire de retour vers le Point de Veille (0,0,0)': 'Return Trajectory to Wake Point (0,0,0)',
        'Architecture Complète de la Matrice Affective': 'Complete Architecture of the Affective Matrix',
        "L'injection de la cause inférée": 'Injection of the Inferred Cause',
        'Énergie libre & dissociation X / Y': 'Free Energy & X / Y Dissociation',
        'Un qualificatif dynamique, pas un axe': 'A Dynamic Qualifier, Not an Axis',
        'Loi de Primauté Hédonique Lexicographique & 6 Régimes Énergétiques': 'Lexicographic Hedonic Primacy Law & 6 Energetic Regimes',
        'Passer à la Taxonomie (176 États) →': 'Continue to Taxonomy (176 States) →',

        // Taxonomie Affective Page
        '4. La Taxonomie Affective Hiérarchique : 176 États & Carte 2D / 3D': '4. Hierarchical Affective Taxonomy: 176 States & 2D / 3D Map',
        'Carte 2D D3 (Couronnes Z=2..7)': '2D D3 Map (Crowns Z=2..7)',
        'Pyramide Orbitale 3D (Three.js)': '3D Orbital Pyramid (Three.js)',
        'Glisser : orbiter • Ctrl+Molette ou +/− : zoom • Clic : sélectionner': 'Drag: orbit • Ctrl+Wheel or +/−: zoom • Click: select',
        'Analyseur de Scénarios & Trajectoires Affectives': 'Scenario & Affective Trajectory Analyzer',
        'Exemple canonique §7.3 : Le Café Gâté': 'Canonical Example §7.3: The Spoiled Coffee',
        'Boucle Récursive, 8 Strates Hiérarchiques & Symétries Antagonistes': 'Recursive Loop, 8 Hierarchical Strata & Antagonistic Symmetries',
        "La boucle récursive de l'inférence active en 5 temps": 'The 5-Stage Recursive Active Inference Loop',
        '§7.2 — Les 8 Strates Hiérarchiques (5+2 Couronnes + Point de Veille)': '§7.2 — The 8 Hierarchical Strata (5+2 Crowns + Wake Point)',
        'Du café gâté au Désespoir': 'From Spoiled Coffee to Despair',
        "Pourquoi Haine et Affection s'opposent (et non Plénitude) ?": 'Why Hate and Affection Oppose (Rather Than Plenitude)',
        'Ce que prédit Cartograffect et sa validation formelle': 'What Cartograffect Predicts and Its Formal Validation',
        'Réinitialiser filtres': 'Reset filters',

        // Scholar Drive Page
        "Modèles Théoriques : Comprendre l'Affect, l'Émotion et le Sentiment": 'Theoretical Models: Understanding Affect, Emotion, and Feeling',
        'La Triade Fondamentale : Affect, Émotion & Sentiment': 'The Fundamental Triad: Affect, Emotion & Feeling',
        "1. L'AFFECT": '1. AFFECT',
        "2. L'ÉMOTION": '2. EMOTION',
        '3. LE SENTIMENT': '3. FEELING',
        'Matrice Comparative Synoptique': 'Synoptic Comparison Matrix',
        'Histoire et Évolution : De Descartes et Spinoza aux Neurosciences Modernes': 'History and Evolution: From Descartes and Spinoza to Modern Neuroscience',
        'Le Circumplexe de Russell': "Russell's Circumplex",
        "Émotions de Base d'Ekman": "Ekman's Basic Emotions",
        'Processus Composant (CPM)': 'Component Process Model (CPM)',
        'Émotions Construites': 'Constructed Emotions',
        'La Synthèse Cartograffect : Architecture Fonctionnelle Certifiée': 'The Cartograffect Synthesis: Certified Functional Architecture',
        "La Formulation Mathématique de l'Architecture Fonctionnelle (Vérification Formelle)": 'Mathematical Formulation of the Functional Architecture (Formal Verification)',
        'Gradient de Contrôle (Axe Y)': 'Control Gradient (Y Axis)',
        "Gradient d'Attente (Axe X)": 'Expectation Gradient (X Axis)',
        'Profondeur Inférentielle (Axe Z)': 'Inferential Depth (Z Axis)',
        'Documents de Recherche & Synthèses': 'Research Documents & Syntheses',
        'Preuves Formelles Mécanisées': 'Mechanized Formal Proofs',
        'Taxonomie & Lexique 176': 'Taxonomy & 176-State Lexicon',
        'Dépôt GitHub du Site Web': 'Website GitHub Repository',
        'Bibliographie Scientifique (APA 7)': 'Scientific Bibliography (APA 7)',
        'Exporter .BIB': 'Export .BIB',

        // Mentions Légales Page
        'Mentions Légales & Régime de Propriété Intellectuelle': 'Legal Notice & Intellectual Property Framework',
        'Éditeur et Direction Scientifique': 'Publisher and Scientific Direction',
        '1 Éditeur et Direction Scientifique': '1 Publisher and Scientific Direction',
        'Indépendance intellectuelle et portée scientifique': 'Intellectual Independence and Scientific Scope',
        '2 Indépendance intellectuelle et portée scientifique': '2 Intellectual Independence and Scientific Scope',
        'Indépendance intellectuelle totale et démarche personnelle': 'Total Intellectual Independence & Personal Research Initiative',
        'Recherche théorique fondamentale : aucun service psychologique ni usage diagnostique': 'Fundamental Theoretical Research: No Psychological Service or Diagnostic Use',
        'Absence de collecte de données personnelles ou cliniques': 'No Collection of Personal or Clinical Data',
        'Marque Déposée & Propriété Intellectuelle Fondamentale': 'Registered Trademark & Core Intellectual Property',
        '3 Marque Déposée & Propriété Intellectuelle Fondamentale': '3 Registered Trademark & Core Intellectual Property',
        'Directives de Protection Intellectuelle (Modèle Hybride)': 'Intellectual Property Guidelines (Hybrid Model)',
        '4 Directives de Protection Intellectuelle (Modèle Hybride)': '4 Intellectual Property Guidelines (Hybrid Model)',
        'Théorie, Ontologie & Textes': 'Theory, Ontology & Texts',
        'Code Source & Logique Applicative': 'Source Code & Application Logic',
        'Protocole de Citation Académique': 'Academic Citation Protocol',
        '5 Protocole de Citation Académique': '5 Academic Citation Protocol',
        'Avertissement Médical et Clinique': 'Medical and Clinical Disclaimer',
        '6 Avertissement Médical et Clinique': '6 Medical and Clinical Disclaimer',
        "Demande de Partenariat ou d'Autorisation Commerciale": 'Partnership or Commercial Licensing Inquiry',

        // Corpus & References
        'Toutes': 'All',
        'Toutes (72)': 'All (72)',
        'Bibliographie': 'Bibliography',
        'Références Fondamentales': 'Core References',
        '72 références': '72 references',
        'Export BibTeX (.bib)': 'Export BibTeX (.bib)',
        'Corpus bibliographique': 'Bibliographic Corpus',
        'Réinitialiser la recherche': 'Reset Search',
        "Sommaire de l'article": 'Article Contents',
        "Schéma aligné sur la Figure 1 conceptuelle de l'article.": 'Diagram aligned with Conceptual Figure 1 of the article.',
        'Consulter la spécification formelle sur GitHub ↗': 'View formal specification on GitHub ↗',
        'Inférence Active': 'Active Inference',
        'Intéroception & Allostasie': 'Interoception & Allostasis',
        'Théories des Émotions': 'Emotion Theories',
        'Psychiatrie Computationnelle': 'Computational Psychiatry',
        'Affectivisme & Modèles': 'Affectivism & Models',
        'Fondements Formels': 'Formal Foundations',
        'Écrire à manuelcabelguen@gmail.com': 'Email manuelcabelguen@gmail.com',
        "Contacter l'Éditeur →": 'Contact Publisher →',
        'Explorer la Carte 2D / Pyramide 3D ↓': 'Explore 2D Map / 3D Pyramid ↓',
        'Simulateur de Trajectoires ↓': 'Trajectory Simulator ↓',
        'Les 8 Strates Z=0..7 ↓': 'The 8 Strata Z=0..7 ↓',
        '← Niveau 3 : La Matrice Affective': '← Level 3: The Affective Matrix',
        "Lire l'Article Scientifique Intégral →": 'Read Full Scientific Paper →',
        'Vivre Le Voyage (2 min) →': 'Live The Journey (2 min) →',
        "← Retour à l'Accueil": '← Return Home',
        'Niveau 2 : Le Noyau Affectif (X, Y, Z & L₁) →': 'Level 2: The Affective Core (X, Y, Z & L₁) →',
        '← Niveau 1 : Le Moteur Prédictif': '← Level 1: The Predictive Engine',
        'Niveau 3 : La Matrice Affective (Valence & Prototypes) →': 'Level 3: The Affective Matrix (Valence & Prototypes) →',
        '← Niveau 2 : Le Noyau Affectif': '← Level 2: The Affective Core',
        'Niveau 4 : La Taxonomie Affective (176 États & Carte 2D/3D) →': 'Level 4: The Affective Taxonomy (176 States & 2D/3D Map) →',
        'Explorer la Figure 3 (Z=2) ↓': 'Explore Figure 3 (Z=2) ↓',
        'Simuler la Dissipation Allostatique ↓': 'Simulate Allostatic Dissipation ↓',
        'Niveau 4 : Taxonomie (176 états) →': 'Level 4: Taxonomy (176 states) →',
        'Ouvrir dans la Carte 176 →': 'Open in 176 Map →',
        '← Précédent': '← Previous',
        'Suivant →': 'Next →',
        'Inspecter dans le Noyau Affectif →': 'Inspect in Affective Core →',
        'Réinitialiser': 'Reset',
        '2D + 3D': '2D + 3D',
        '2D seule': '2D only',
        '3D seule': '3D only',
        '⛶ Agrandir': '⛶ Expand',
        'Manuscrit Théorique': 'Theoretical Manuscript',
        "00 Vue d'Ensemble": '00 Overview',
        '01 Affect vs Émotion vs Sentiment': '01 Affect vs Emotion vs Feeling',
        '02 Modèles Historiques Comparés': '02 Historical Models Compared',
        '03 Architecture Certifiée & Norme L1': '03 Certified Architecture & L1 Norm',
        '04 Publications & Documents': '04 Publications & Documents',
        '05 Corpus Bibliographique': '05 Bibliographic Corpus',
        'Triade : Affect, Émotion, Sentiment': 'Triad: Affect, Emotion, Feeling',
        'Modèles Historiques Comparés': 'Historical Models Compared',
        'Architecture Certifiée & Norme L1': 'Certified Architecture & L1 Norm',
        'Publications & Scholar Drive': 'Publications & Scholar Drive',
        'Consulter les Citations →': 'View Citations →',
        "Lire l'Article & Figures": 'Read Paper & Figures',

        // 404 Page
        'Dimension Affective Introuvable': 'Affective Dimension Not Found',
        "Retour à l'Accueil": 'Return Home',
        'Carte des 176 États': '176-State Map',
        "Retourner à l'Accueil": 'Return Home',
        'Explorer les 176 États (Taxonomie 2D & 3D)': 'Explore the 176 States (2D & 3D Taxonomy)',
        "L'état émotionnel ou la page que vous recherchez ne figure sur aucune des quatre composantes ou strates cartographiées. Peut-être s'agit-il d'un sentiment encore inconnu de la science...": 'The emotional state or page you are looking for does not appear on any of the four mapped components or strata. Perhaps it is a feeling not yet known to science...',
        'COORDONNÉES HORS-CHAMP : [X: ???, Y: ???, Z: ???]': 'OUT-OF-BOUNDS COORDINATES: [X: ???, Y: ???, Z: ???]',

        // Navigation mobile, footer & modales P2-1
        'NAVIGATION': 'NAVIGATION',
        'Recherche rapide': 'Quick search',
        'Le Voyage affectif (2 min)': 'The Affective Journey (2 min)',
        '2. Noyau Affectif (X,Y,Z)': '2. Affective Core (X,Y,Z)',
        '4. Taxonomie (176 états)': '4. Taxonomy (176 states)',
        "L'Article Scientifique": 'The Scientific Paper',
        'Corpus & Preuves formelles': 'Corpus & Formal Proofs',
        'Mentions Légales & PI': 'Legal Notice & IP',
        "L'Article (": 'The Paper (',
        'th. ·': 'thm. ·',
        'Lexique Bilingue & Terminologie Internationale': 'Bilingual Lexicon & International Terminology',
        'Tous les termes': 'All terms',
        'Mathématiques & Axes': 'Mathematics & Axes',
        '8 Prototypes Z=2': '8 Prototypes Z=2',
        'Citations APA': 'APA Citations',
        "Copier la référence APA de l'Article": "Copy the Paper's APA Reference",
        "Consulter l'Article en Ligne": 'Read the Paper Online',
        'Citation copiée dans le presse-papiers.': 'Citation copied to clipboard.',
        'Fermer': 'Close',

        // Index split headings
        'La Boussole Intérieure de nos': 'The Inner Compass of Our',
        'boussole ?': 'compass?',
        'Les Origines :': 'Origins:',
        'Pourquoi nos émotions ne sont pas des anomalies': 'Why Our Emotions Are Not Anomalies',
        '1. Le Point de Départ :': '1. Starting Point:',
        'Comment naissent nos émotions': 'How Our Emotions Arise',
        '2. La Boussole :': '2. The Compass:',
        "Les deux choix face à l'imprévu": 'Two Choices Facing the Unexpected',
        "3. La Règle d'Équilibre :": '3. The Balance Rule:',
        'Pourquoi nous ne pouvons pas tout ressentir à la fois': 'Why We Cannot Feel Everything at Once',
        "4. L'Élévation de la Conscience :": '4. Rising Awareness:',
        'Du Réflexe Corporel aux Idéaux de Vie': 'From Bodily Reflex to Life Ideals',
        "L'Architecture Complète de": 'The Complete Architecture of',
        "L'Explorateur Interactif :": 'Interactive Explorer:',
        'Voyage au Cœur des 176 Émotions': 'Journey Through the 176 Emotions',
        "À qui s'adresse cette": 'Who Is This',

        // Noyau, Matrice, Taxonomie & Simulateurs
        'Le Noyau Affectif :': 'The Affective Core:',
        'Espace Géométrique (X, Y, Z)': 'Geometric Space (X, Y, Z)',
        'Strate Z': 'Stratum Z',
        'Opérateur Central (0,0,Z)': 'Central Operator (0,0,Z)',
        'Rayon R(Z)': 'Radius R(Z)',
        'Positions Couronne N(Z)': 'Crown Positions N(Z)',
        'Typologies présentes': 'Present Typologies',
        'La Matrice Affective Fondamentale (': 'The Fundamental Affective Matrix (',
        'État initial :': 'Initial state:',
        "Voir l'antagoniste :": 'View antagonist:',
        'Peur (−2,0,2) vs Courage (+2,0,2) : la fausse neutralité': 'Fear (−2,0,2) vs Courage (+2,0,2): false neutrality',
        'Tristesse (0,−2,2) vs Joie (0,+2,2) : charge motrice vs décharge': 'Sadness (0,−2,2) vs Joy (0,+2,2): motor charge vs discharge',
        'Colère / Calme': 'Anger / Calm',
        'Désir / Dégoût': 'Desire / Disgust',
        'Peur / Courage': 'Fear / Courage',
        'Joie / Tristesse': 'Joy / Sadness',
        'Colère (−1, +1, 2)': 'Anger (−1, +1, 2)',
        'Désespoir (−1, −7, 5)': 'Despair (−1, −7, 5)',
        'Terreur (−1, +9, 6)': 'Terror (−1, +9, 6)',
        'Honte (−2, −4, 4)': 'Shame (−2, −4, 4)',
        'Panique (−3, +1, 3)': 'Panic (−3, +1, 3)',
        'Extase (+8, +2, 6)': 'Ecstasy (+8, +2, 6)',
        'Fureur (−4, +6, 6)': 'Fury (−4, +6, 6)',
        'Chagrin (−1, −3, 3)': 'Grief (−1, −3, 3)',
        'Courage (+2, 0, 2)': 'Courage (+2, 0, 2)',
        'Rechercher un état parmi les 176': 'Search among the 176 states',
        'Groupe / Secteur': 'Group / Sector',
        'Typologie': 'Typology',
        'Décrivez une situation ou choisissez un cas clinique ci-dessus :': 'Describe a situation or choose a clinical case above:',
        'Reset': 'Reset',
        'Sélectionner →': 'Select →',
        'Tracer sa dissipation allostatique sur 2D/3D': 'Trace its allostatic dissipation on 2D/3D',
        'Effacer la trajectoire active': 'Clear active trajectory',
        'Café gâté (§7.3)': 'Spoiled coffee (§7.3)',
        'Perte & Résilience': 'Loss & Resilience',
        'Colère & Retour': 'Anger & Recovery',
        'Défi & Courage': 'Challenge & Courage',
        'Analyser & Tracer la Trajectoire sur la Carte 2D/3D': 'Analyze & Plot Trajectory on 2D/3D Map',
        'Toutes (Z=0..7)': 'All (Z=0..7)',
        'Z=0 — Veille (1)': 'Z=0 — Wake (1)',
        'Z=1 — Surprise (1)': 'Z=1 — Surprise (1)',
        'Z=2 — Prototypes (9)': 'Z=2 — Prototypes (9)',
        'Z=3 — Émoi (17)': 'Z=3 — Stir (17)',
        'Z=4 — Réserve (25)': 'Z=4 — Reserve (25)',
        'Z=5 — Recul (33)': 'Z=5 — Stepping Back (33)',
        'Z=6 — Saisissement (41)': 'Z=6 — Saisissement (41)',
        'Z=7 — Suspension (49)': 'Z=7 — Suspension (49)',
        'Tous les groupes': 'All groups',
        'Courage (X+)': 'Courage (X+)',
        'Peur (X−)': 'Fear (X−)',
        'Joie (Y+)': 'Joy (Y+)',
        'Tristesse (Y−)': 'Sadness (Y−)',
        'Désir (X+, Y+)': 'Desire (X+, Y+)',
        'Dégoût (X−, Y−)': 'Disgust (X−, Y−)',
        'Colère (X−, Y+)': 'Anger (X−, Y+)',
        'Calme (X+, Y−)': 'Calm (X+, Y−)',
        'Opérateurs Centraux': 'Central Operators',
        'Toutes géométries': 'All geometries',
        'Opérateurs Centraux (8)': 'Central Operators (8)',
        'Axiales (24)': 'Axial (24)',
        'Diagonales (24)': 'Diagonal (24)',
        'Latérales (120)': 'Lateral (120)',

        // Scholar Drive & Article chrome/tables
        'Modèles Théoriques :': 'Theoretical Models:',
        "Comprendre l'Affect, l'Émotion et le Sentiment": 'Understanding Affect, Emotion, and Feeling',
        "Vue d'Ensemble": 'Overview',
        'Affect vs Émotion vs Sentiment': 'Affect vs Emotion vs Feeling',
        'Publications & Documents': 'Publications & Documents',
        'Corpus Bibliographique': 'Bibliographic Corpus',
        'Dimension': 'Dimension',
        'Affect': 'Affect',
        'Émotion': 'Emotion',
        'Sentiment': 'Feeling',
        'Mode de lecture :': 'Reading mode:',
        'Accès figures :': 'Figures:',
        'Résumé (Français)': 'Summary (French)',
        'Abstract (English)': 'Abstract (English)',
        '+Y : Monde Contrôlable (Agir)': '+Y: Controllable World (Act)',
        'Y0 : Contrôle Indéterminé': 'Y0: Indeterminate Control',
        '-Y : Monde Non Contrôlable (Laisser)': '-Y: Uncontrollable World (Let Go)',
        '+X : Modèle Révisable (Ajuster)': '+X: Revisable Model (Adjust)',
        'X0 : Attente Indéterminée': 'X0: Indeterminate Expectation',
        '-X : Modèle Non Révisable (Tenir)': '-X: Non-Revisable Model (Hold)',
        'Précision sous seuil (π < τ': 'Below-threshold precision (π < τ',
        '→ Surprise 0,0,1)': '→ Surprise 0,0,1)',
        'Suspension descendante (R5 → Anticipation 0,0,2)': 'Descending suspension (R5 → Anticipation 0,0,2)',
        'Théorie & Auteurs': 'Theory & Authors',
        'Postulat Fondamental': 'Fundamental Postulate',
        'Limite / Paradoxe Historique': 'Historical Limit / Paradox',
        'Résolution par CARTOGRAFFECT': 'CARTOGRAFFECT Resolution',
        'Strate (': 'Stratum (',
        'Opérateur central': 'Central operator',
        'Rayon': 'Radius',
        'Positions': 'Positions',
        'Registre dominant': 'Dominant register',
        "Objet principal de l'inférence": 'Primary inference target',
        'Exemples cliniques': 'Clinical examples',
        'Postulat testé': 'Tested postulate',
        'Prédiction falsifiable': 'Falsifiable prediction',
        'Opérationnalisation': 'Operationalization',
        'Critère de réfutation': 'Falsification criterion',
        'Article :': 'Paper:'
    };

    // Normalized attribute & metadata dictionaries
    const TITLE_FR_EN = {
        'Parcours expérientiel guidé (2 min)': 'Guided experiential journey (2 min)',
        'Rechercher un état affectif, concept ou niveau (Ctrl+K)': 'Search an affective state, concept or level (Ctrl+K)',
        'English / Français Summary': 'Switch interface to English',
        'Zoom avant': 'Zoom in',
        'Zoom arrière': 'Zoom out',
        'Zoom avant sur la carte 3D': 'Zoom in on 3D map',
        'Zoom arrière sur la carte 3D': 'Zoom out on 3D map',
        'Réinitialiser la vue 3D': 'Reset 3D view',
        "Consulter l'article original (DOI)": 'View original paper (DOI)',
        "Copier l'entrée BibTeX": 'Copy BibTeX entry',
        'Copier la référence au format APA 7': 'Copy reference in APA 7 format',
        'Imprimer / Sauvegarder en PDF': 'Print / Save as PDF',
        "Télécharger l'intégralité du corpus au format BibTeX": 'Download full corpus in BibTeX format',
        'Basculer la rotation automatique': 'Toggle automatic rotation',
        "Déclencher un cycle d'inférence active": 'Trigger an active inference cycle',
        'Perspective 3D Octaédrique': '3D Octahedral Perspective',
        'Projection 2D Losanges Manhattan': '2D Manhattan Diamonds Projection',
        '1. Affect vs Émotion vs Sentiment': '1. Affect vs Emotion vs Feeling',
        '2. Modèles Historiques Comparés': '2. Historical Models Compared',
        '3. Architecture Certifiée & Norme L1': '3. Certified Architecture & L1 Norm',
        '4. Documents & Publications': '4. Documents & Publications',
        '5. Corpus Bibliographique': '5. Bibliographic Corpus',
        "Vue d'Ensemble": 'Overview',
        'Plein écran 2D': '2D Fullscreen',
        'Plein écran 3D': '3D Fullscreen'
    };

    const PLACEHOLDER_FR_EN = {
        'Rechercher par auteur, titre, concept ou domaine...': 'Search by author, title, concept or domain...',
        'Rechercher un état affectif...': 'Search an affective state...',
        'Rechercher un terme, un concept, un état...': 'Search a term, concept, or state...',
        'Rechercher un état affectif, une strate, un concept ou une section...': 'Search an affective state, stratum, concept, or section...',
        'Ex : j’ai pris un café avarié, mon projet a échoué, une promotion surprise...': 'E.g., I drank spoiled coffee, my project failed, a surprise promotion...',
        'Rechercher dans les 176 états (ex : Honte, Courage, Nostalgie)...': 'Search across the 176 states (e.g., Shame, Courage, Nostalgia)...',
        'Ex : Colère, Haine, Affection, Honte, Joie...': 'E.g.: Anger, Hatred, Affection, Shame, Joy...',
        "Ex : Je renverse mon café le matin, je me reproche mon imprudence, j'ai honte puis j'ai l'impression de tout rater...": 'E.g.: I spill my coffee in the morning, blame myself for carelessness, feel ashamed, then feel like I fail at everything...'
    };

    const ARIA_FR_EN = {
        'Ouvrir le menu de navigation': 'Open navigation menu',
        'Fermer le menu': 'Close menu',
        'Menu de navigation': 'Navigation menu',
        'Navigation principale': 'Primary navigation',
        'Les 4 composantes emboîtées de Cartograffect': 'The 4 nested components of Cartograffect',
        "Sommaire de l'article": 'Article table of contents',
        'Rechercher dans le corpus bibliographique par auteur, titre, concept ou domaine': 'Search bibliographic corpus by author, title, concept or domain',
        'Arbitrage ressource entre Contrôle |Y| et Attente |X|': 'Resource trade-off between Control |Y| and Expectation |X|',
        'Progression de lecture': 'Reading progress',
        'Basculer la rotation automatique': 'Toggle automatic rotation',
        'Figure 3 : Matrice affective fondamentale Z=2': 'Figure 3: Fundamental affective matrix Z=2',
        'Courbe de dissipation allostatique par paliers Z': 'Allostatic dissipation curve across Z strata',
        'Carte 2D D3 des 176 états affectifs Cartograffect': 'D3 2D map of the 176 Cartograffect affective states',
        'Navigation des Modèles Théoriques': 'Theoretical Models Navigation',
        "Sommaire rapide de la page d'accueil": 'Quick home page summary',
        'Fermer le lexique': 'Close lexicon',
        'Rechercher dans le lexique bilingue': 'Search bilingual lexicon',
        'Recherche rapide Cartograffect': 'Cartograffect quick search',
        'Rechercher un affect, une strate ou un concept': 'Search an affect, stratum, or concept',
        'Zoom avant sur la carte 3D': 'Zoom in on 3D map',
        'Zoom arrière sur la carte 3D': 'Zoom out on 3D map',
        'Réinitialiser la vue 3D': 'Reset 3D view',
        'Zoom avant sur la pyramide 3D': 'Zoom in on 3D pyramid',
        'Zoom arrière sur la pyramide 3D': 'Zoom out on 3D pyramid',
        'Zoom avant sur la carte 2D': 'Zoom in on 2D map',
        'Zoom arrière sur la carte 2D': 'Zoom out on 2D map',
        'Réinitialiser la vue': 'Reset view',
        'Réinitialiser le zoom': 'Reset zoom',
        "Section Vue d'Ensemble": 'Overview section',
        'Section Modèles Historiques': 'Historical Models section',
        'Section Affect vs Émotion': 'Affect vs Emotion section',
        'Section Publications & Documents': 'Publications & Documents section',
        'Section Taxonomie & Pyramide': 'Taxonomy & Pyramid section',
        'Section Corpus Bibliographique': 'Bibliographic Corpus section',
        '1. Affect vs Émotion vs Sentiment': '1. Affect vs Emotion vs Feeling',
        '2. Modèles Historiques Comparés': '2. Historical Models Compared',
        '3. Architecture Certifiée & Norme L1': '3. Certified Architecture & L1 Norm',
        '4. Documents & Publications': '4. Documents & Publications',
        '5. Corpus Bibliographique': '5. Bibliographic Corpus',
        "Vue d'Ensemble": 'Overview',
        'Sélectionner Anticipation (0, 0, 2)': 'Select Anticipation (0, 0, 2)',
        'Sélectionner Joie (0, +2, 2)': 'Select Joy (0, +2, 2)',
        'Sélectionner Tristesse (0, -2, 2)': 'Select Sadness (0, -2, 2)',
        'Sélectionner Tristesse (0, −2, 2)': 'Select Sadness (0, −2, 2)',
        'Sélectionner Courage (+2, 0, 2)': 'Select Courage (+2, 0, 2)',
        'Sélectionner Peur (-2, 0, 2)': 'Select Fear (-2, 0, 2)',
        'Sélectionner Peur (−2, 0, 2)': 'Select Fear (−2, 0, 2)',
        'Sélectionner Désir (+1, +1, 2)': 'Select Desire (+1, +1, 2)',
        'Sélectionner Dégoût (-1, -1, 2)': 'Select Disgust (-1, -1, 2)',
        'Sélectionner Dégoût (−1, −1, 2)': 'Select Disgust (−1, −1, 2)',
        'Sélectionner Colère (-1, +1, 2)': 'Select Anger (-1, +1, 2)',
        'Sélectionner Colère (−1, +1, 2)': 'Select Anger (−1, +1, 2)',
        'Sélectionner Calme (+1, -1, 2)': 'Select Calm (+1, -1, 2)',
        'Sélectionner Calme (+1, −1, 2)': 'Select Calm (+1, −1, 2)'
    };

    const ALT_FR_EN = {
        'Cartograffect': 'Cartograffect',
        'Astrolabe Cartograffect': 'Cartograffect Astrolabe'
    };

    const PAGE_TITLE_FR_EN = {
        'CARTOGRAFFECT | La Boussole Intérieure de nos Émotions': 'CARTOGRAFFECT | The Inner Compass of Our Emotions',
        '1. Le Moteur Prédictif : Interfaces & Gradients A/C | CARTOGRAFFECT': '1. The Predictive Engine: Interfaces & A/C Gradients | CARTOGRAFFECT',
        '2. Le Noyau Affectif : Géométrie (X, Y, Z) & Norme L₁ | CARTOGRAFFECT': '2. The Affective Core: (X, Y, Z) Geometry & L₁ Norm | CARTOGRAFFECT',
        '3. La Matrice Affective : Valence Lexicographique & Prototypes Z=2 | CARTOGRAFFECT': '3. The Affective Matrix: Lexicographic Valence & Prototypes Z=2 | CARTOGRAFFECT',
        '4. La Taxonomie Affective : Les 176 États & Carte 2D/3D | CARTOGRAFFECT': '4. Affective Taxonomy: The 176 States & 2D/3D Map | CARTOGRAFFECT',
        "L'Article Théorique | Cartographie des affects : architecture hiérarchique fondée sur le traitement prédictif": 'Theoretical Paper | Affective Mapping: Hierarchical Architecture Grounded in Predictive Processing',
        'Modèles Théoriques : Affects, Émotions & Sentiments | CARTOGRAFFECT': 'Theoretical Models: Affects, Emotions & Feelings | CARTOGRAFFECT',
        'Mentions Légales & Propriété Intellectuelle | Cartograffect': 'Legal Notice & Intellectual Property | Cartograffect',
        '404 - Coordonnées Introuvables | CARTOGRAFFECT': '404 - Coordinates Not Found | CARTOGRAFFECT'
    };

    const META_DESC_FR_EN = {
        "La dimension affective demandée n'existe pas ou s'est évanouie dans le néant.": 'The requested affective dimension does not exist or has faded into the void.',
        "Publication théorique officielle : Cartographie des affects, une architecture hiérarchique de l'expérience affective fondée sur le traitement prédictif. Manuel Cabelguen, Ph. D.": 'Official theoretical paper: Cartographie des affects, a hierarchical architecture of affective experience grounded in predictive processing. Manuel Cabelguen, Ph. D.',
        'Découvrez Cartograffect, la boussole intérieure de nos émotions. Une cartographie claire et interactive de nos 176 états affectifs fondée sur le traitement prédictif. Modèle scientifique par Manuel Cabelguen (Ph. D.).': 'Discover Cartograffect, the inner compass of our emotions. A clear, interactive mapping of our 176 affective states grounded in predictive processing. Scientific model by Manuel Cabelguen (Ph. D.).',
        "Composante 3 de Cartograffect : la Matrice Affective (AffectiveMatrix.lean, Fig. 3). Primauté hédonique lexicographique de l'Axe X, 6 régimes énergétiques, 8 prototypes Z=2 (Joie, Tristesse, Peur, Courage, Désir, Colère, Calme, Dégoût) et dissipation allostatique.": 'Component 3 of Cartograffect: the Affective Matrix (AffectiveMatrix.lean, Fig. 3). Lexicographic hedonic primacy of the X-axis, 6 energetic regimes, 8 prototypes Z=2 (Joy, Sadness, Fear, Courage, Desire, Anger, Calm, Disgust) and allostatic dissipation.',
        'Cadre juridique, propriété intellectuelle, certificat OPIC 1233199, licences GNU AGPLv3 et CC BY-NC-SA 4.0 pour le projet Cartograffect et ses outils computationnels.': 'Legal framework, intellectual property, CIPO certificate 1233199, GNU AGPLv3 and CC BY-NC-SA 4.0 licenses for the Cartograffect project and its computational tools.',
        "Composante 1 de Cartograffect : le Moteur prédictif (PredictiveEngine.lean). Découvrez comment les Interfaces Perceptive, Subjective et Attentionnelle convertissent un écart de prédiction en gradients d'Attente (A) et de Contrôle (C) pondérés par la précision.": 'Component 1 of Cartograffect: the Predictive Engine (PredictiveEngine.lean). Discover how the Perceptive, Subjective, and Attentional Interfaces convert prediction error into precision-weighted Expectation (A) and Control (C) gradients.',
        'Composante 2 de Cartograffect : le Noyau affectif (CoreAffect.lean). Espace de coordonnées (X, Y, Z) pré-valencé, loi des couronnes |X|+|Y|=2Z-2, positions axiales instables et attracteurs diagonaux.': 'Component 2 of Cartograffect: the Affective Core (CoreAffect.lean). Pre-valenced (X, Y, Z) coordinate space, crown law |X|+|Y|=2Z-2, unstable axial positions, and diagonal attractors.',
        'Modèles Théoriques et Fondements : distinction conceptuelle et computationnelle entre Affects, Émotions et Sentiments, modèles historiques comparés et Algorithme Cartograffect de Manuel Cabelguen (Ph. D.).': 'Theoretical Models & Foundations: conceptual and computational distinction between Affects, Emotions, and Feelings, comparative historical models, and the Cartograffect Algorithm by Manuel Cabelguen (Ph. D.).',
        'Composante 4 de Cartograffect : la Taxonomie Affective Hiérarchique (AffectiveTaxonomy.lean & Lexicon176.lean). Explorez en 2D (D3) et 3D (Three.js) les 176 états répartis sur 8 strates (Z=0..7), 9 groupes et 84 paires antagonistes.': 'Component 4 of Cartograffect: the Hierarchical Affective Taxonomy (AffectiveTaxonomy.lean & Lexicon176.lean). Explore in 2D (D3) and 3D (Three.js) the 176 states across 8 strata (Z=0..7), 9 groups, and 84 antagonist pairs.'
    };

    function normSpace(s) {
        return String(s || '')
            .replace(/[\u00a0\u202f]/g, ' ')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
    }

    function buildLookup(dict) {
        const map = Object.create(null);
        Object.keys(dict).forEach((k) => {
            map[normSpace(k)] = dict[k];
        });
        return map;
    }

    const TEXT_LOOKUP = buildLookup(TEXT_FR_EN);
    const TITLE_LOOKUP = buildLookup(TITLE_FR_EN);
    const PLACEHOLDER_LOOKUP = buildLookup(PLACEHOLDER_FR_EN);
    const ARIA_LOOKUP = buildLookup(ARIA_FR_EN);
    const ALT_LOOKUP = buildLookup(ALT_FR_EN);
    const PAGE_TITLE_LOOKUP = buildLookup(PAGE_TITLE_FR_EN);
    const META_DESC_LOOKUP = buildLookup(META_DESC_FR_EN);
    let origDocTitle = null;
    let origMetaDesc = null;

    function getSavedLang() {
        try {
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang === 'en' || urlLang === 'fr') return urlLang;
            const saved = window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : null;
            return saved === 'en' ? 'en' : DEFAULT_LANG;
        } catch (_) {
            return DEFAULT_LANG;
        }
    }

    function saveLang(lang) {
        try {
            if (window.localStorage) window.localStorage.setItem(STORAGE_KEY, lang);
        } catch (_) { /* ignore storage restrictions */ }
    }

    function shouldSkipNode(node) {
        let el = node.parentElement;
        while (el) {
            const tag = (el.tagName || '').toUpperCase();
            if (
                tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE' ||
                tag === 'KBD' ||
                (tag === 'SVG' && el.getAttribute('data-i18n-svg') !== 'true') ||
                el.classList.contains('katex') ||
                el.classList.contains('no-i18n') ||
                el.hasAttribute('data-payload')
            ) {
                return true;
            }
            el = el.parentElement;
        }
        return false;
    }

    function translateTextNodes(lang) {
        if (!document.body) return;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let cur;
        while ((cur = walker.nextNode())) {
            if (!shouldSkipNode(cur)) nodes.push(cur);
        }

        for (const node of nodes) {
            if (!textOrigMap.has(node)) {
                textOrigMap.set(node, node.nodeValue);
            }
            const orig = textOrigMap.get(node);
            if (lang === 'fr') {
                if (node.nodeValue !== orig) node.nodeValue = orig;
                continue;
            }
            const trimmed = normSpace(orig);
            if (!trimmed) continue;
            const translated = TEXT_LOOKUP[trimmed];
            if (translated) {
                const leadMatch = orig.match(/^\s*/);
                const trailMatch = orig.match(/\s*$/);
                const lead = leadMatch ? leadMatch[0] : '';
                const trail = trailMatch ? trailMatch[0] : '';
                node.nodeValue = lead + translated + trail;
            }
        }
    }

    function translateAttributes(lang) {
        const els = document.querySelectorAll('[title], [aria-label], [placeholder], img[alt]');
        els.forEach((el) => {
            if (el.id === 'langToggleBtn' || el.hasAttribute('data-lang-toggle')) return;
            if (!attrOrigMap.has(el)) {
                attrOrigMap.set(el, {
                    title: el.getAttribute('title'),
                    placeholder: el.getAttribute('placeholder'),
                    ariaLabel: el.getAttribute('aria-label'),
                    alt: el.getAttribute('alt')
                });
            }
            const orig = attrOrigMap.get(el);
            if (lang === 'fr') {
                if (orig.title !== null) el.setAttribute('title', orig.title);
                if (orig.placeholder !== null) el.setAttribute('placeholder', orig.placeholder);
                if (orig.ariaLabel !== null) el.setAttribute('aria-label', orig.ariaLabel);
                if (orig.alt !== null) el.setAttribute('alt', orig.alt);
            } else {
                if (orig.title) {
                    const tr = TITLE_LOOKUP[normSpace(orig.title)];
                    if (tr) el.setAttribute('title', tr);
                }
                if (orig.placeholder) {
                    const tr = PLACEHOLDER_LOOKUP[normSpace(orig.placeholder)];
                    if (tr) el.setAttribute('placeholder', tr);
                }
                if (orig.ariaLabel) {
                    const tr = ARIA_LOOKUP[normSpace(orig.ariaLabel)];
                    if (tr) el.setAttribute('aria-label', tr);
                }
                if (orig.alt) {
                    const tr = ALT_LOOKUP[normSpace(orig.alt)];
                    if (tr) el.setAttribute('alt', tr);
                }
            }
        });
    }

    function translateDocumentMeta(lang) {
        if (typeof document === 'undefined') return;
        if (origDocTitle === null && typeof document.title === 'string') {
            origDocTitle = document.title;
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (origMetaDesc === null && metaDesc) {
            origMetaDesc = metaDesc.getAttribute('content') || '';
        }
        if (lang === 'fr') {
            if (origDocTitle !== null && document.title !== origDocTitle) document.title = origDocTitle;
            if (metaDesc && origMetaDesc !== null) metaDesc.setAttribute('content', origMetaDesc);
        } else {
            if (origDocTitle) {
                const trTitle = PAGE_TITLE_LOOKUP[normSpace(origDocTitle)];
                if (trTitle) document.title = trTitle;
            }
            if (metaDesc && origMetaDesc) {
                const trDesc = META_DESC_LOOKUP[normSpace(origMetaDesc)];
                if (trDesc) metaDesc.setAttribute('content', trDesc);
            }
        }
    }

    function updateLangButtonUI(lang) {
        document.querySelectorAll('#langToggleBtn, [data-lang-toggle]').forEach((btn) => {
            const directSpans = Array.from(btn.children || []).filter((el) => el.tagName === 'SPAN');
            const labelSpan = (directSpans.length ? directSpans[directSpans.length - 1] : null) || btn.querySelector('span:last-of-type');
            if (labelSpan) {
                labelSpan.innerHTML = lang === 'en'
                    ? '<span class="text-slate-400">FR</span> <span class="text-slate-600">|</span> <strong class="text-indigo-300 font-bold">EN</strong>'
                    : '<strong class="text-white font-bold">FR</strong> <span class="text-slate-500">|</span> <span class="text-slate-400">EN</span>';
            }
            btn.setAttribute('data-active-lang', lang);
            btn.setAttribute('aria-pressed', String(lang === 'en'));
            btn.setAttribute('title', lang === 'en' ? 'Passer l’interface en français' : 'Switch interface to English');
        });
    }

    function updateReferenceNoticeBanner(lang) {
        const existing = document.getElementById('i18nEnNoticeBanner');
        const path = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
        const isLongDoc = path.endsWith('article.html') || path.endsWith('mentions-legales.html');
        if (lang !== 'en' || !isLongDoc) {
            if (existing) existing.remove();
            return;
        }
        if (existing) return;
        const main = document.querySelector('main') || document.body;
        const banner = document.createElement('div');
        banner.id = 'i18nEnNoticeBanner';
        banner.className = 'no-i18n max-w-5xl mx-auto mt-4 mb-2 px-4 sm:px-6';
        banner.innerHTML =
            '<div class="rounded-xl border border-indigo-500/40 bg-indigo-950/70 px-4 py-3 text-xs sm:text-sm text-indigo-100 flex flex-wrap items-center justify-between gap-3 shadow-lg">' +
            '<div><strong class="text-white">English Interface Active.</strong> Navigation, headings and controls are displayed in English. The full academic manuscript and legal notice remain in their authoritative French version.</div>' +
            '<div class="flex items-center gap-2 shrink-0">' +
            '<button type="button" onclick="window.openLangModal && window.openLangModal()" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">EN Abstract &amp; Lexicon</button>' +
            '<button type="button" onclick="window.CartograffectI18n && window.CartograffectI18n.setLang(\'fr\')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 transition-colors">Version FR</button>' +
            '</div></div>';
        main.insertBefore(banner, main.firstChild);
    }

    function applyLanguage(lang, persist) {
        const target = lang === 'en' ? 'en' : 'fr';
        if (persist) saveLang(target);
        document.documentElement.lang = target;
        document.documentElement.setAttribute('data-lang', target);

        translateDocumentMeta(target);
        translateTextNodes(target);
        translateAttributes(target);
        updateLangButtonUI(target);
        updateReferenceNoticeBanner(target);

        try {
            window.dispatchEvent(new CustomEvent('cartograffect:lang-change', { detail: { lang: target } }));
        } catch (_) { /* ignore */ }
        return target;
    }

    function toggleLang() {
        const current = document.documentElement.getAttribute('data-lang') || getSavedLang();
        return applyLanguage(current === 'en' ? 'fr' : 'en', true);
    }

    function bindToggleButtons() {
        document.querySelectorAll('#langToggleBtn, [data-lang-toggle]').forEach((btn) => {
            if (btn.dataset.i18nBound === '1') return;
            btn.dataset.i18nBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleLang();
            });
        });
    }

    function init() {
        bindToggleButtons();
        applyLanguage(getSavedLang(), false);
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('cartograffect:payload-ready', function () {
            const current = document.documentElement.getAttribute('data-lang') || getSavedLang();
            if (current === 'en') {
                applyLanguage('en', false);
            } else {
                updateLangButtonUI('fr');
            }
        });
    }

    root.CartograffectI18n = {
        getLang: function () {
            return document.documentElement.getAttribute('data-lang') || getSavedLang();
        },
        setLang: function (lang) {
            return applyLanguage(lang, true);
        },
        toggleLang: toggleLang,
        applyLanguage: function (lang) {
            return applyLanguage(lang, false);
        },
        t: function (text) {
            return TEXT_LOOKUP[normSpace(text)] || text;
        }
    };
})(typeof window !== 'undefined' ? window : this);
