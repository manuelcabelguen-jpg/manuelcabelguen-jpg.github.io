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
        'Architecture hiérarchique · Hexa-Prover': 'Hierarchical Architecture · Hexa-Prover',
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
        "L'Article (v2.0.1)": 'The Paper (v2.0.1)',
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
        'Vertige Ontologique — Horizon Existentiel': 'Ontological Vertigo — Existential Horizon',
        "L'Architecture Complète de CARTOGRAFFECT": 'The Complete CARTOGRAFFECT Architecture',
        'Du Moteur Prédictif aux 176 États': 'From Predictive Engine to 176 States',
        "L'Explorateur Interactif : Voyage au Cœur des 176 Émotions": 'Interactive Explorer: Journey Through the 176 Emotions',
        "L'Article Théorique": 'The Theoretical Paper',
        'Compendium Hexa-Prover': 'Hexa-Prover Compendium',

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
        "Le Moteur Prédictif : Gérer l'Incertitude": 'The Predictive Engine: Managing Uncertainty',
        'Simulateur du Moteur Prédictif & Boucle d\'Inférence': 'Predictive Engine Simulator & Inference Loop',
        'Figure 1 Interactive • Le Moteur prédictif (architecture fonctionnelle)': 'Interactive Figure 1 • The Predictive Engine (Functional Architecture)',
        'Consulter la spécification formelle sur GitHub': 'View formal specification on GitHub',
        'Inférence Active, Allostasie Intéroceptive & Frontière Sensorielle-Active': 'Active Inference, Interoceptive Allostasis & Sensory-Active Boundary',
        'Les Trois Interfaces du Moteur Prédictif': 'The Three Interfaces of the Predictive Engine',
        '1. Interface Perceptive': '1. Perceptual Interface',
        '2. Interface Subjective': '2. Subjective Interface',
        '3. Interface Attentionnelle': '3. Attentional Interface',
        'Les 4 Opérations Inférentielles Non Séquentielles': 'The 4 Non-Sequential Inferential Operations',
        'Les 9 Couplages (A, C) : Voies Réflexive & Comportementale': 'The 9 Couplings (A, C): Reflexive & Behavioral Pathways',
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
        "La Formulation Mathématique de l'Architecture Fonctionnelle (Hexa-Prover)": 'Mathematical Formulation of the Functional Architecture (Hexa-Prover)',
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
        'Statut professionnel et portée scientifique (Information déontologique)': 'Professional Status and Scientific Scope (Deontological Notice)',
        '2 Statut professionnel et portée scientifique (Information déontologique)': '2 Professional Status and Scientific Scope (Deontological Notice)',
        "Indépendance professionnelle et membre de l'Ordre des psychologues du Québec (OPQ)": 'Professional Independence & Member of the Ordre des psychologues du Québec (OPQ)',
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
        'Carte des 176 États': '176-State Map'
    };

    // Normalized attribute dictionary
    const TITLE_FR_EN = {
        'Parcours expérientiel guidé (2 min)': 'Guided experiential journey (2 min)',
        'Rechercher un état affectif, concept ou niveau (Ctrl+K)': 'Search an affective state, concept or level (Ctrl+K)',
        'English / Français Summary': 'Switch interface to English',
        'Zoom avant': 'Zoom in',
        'Zoom arrière': 'Zoom out',
        'Zoom avant sur la carte 3D': 'Zoom in on 3D map',
        'Zoom arrière sur la carte 3D': 'Zoom out on 3D map',
        'Réinitialiser la vue 3D': 'Reset 3D view'
    };

    const PLACEHOLDER_FR_EN = {
        'Rechercher par auteur, titre, concept ou domaine...': 'Search by author, title, concept or domain...',
        'Rechercher un état affectif...': 'Search an affective state...'
    };

    function normSpace(s) {
        return s
            .replace(/[\u00a0\u202f]/g, ' ')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
    }

    const TEXT_LOOKUP = Object.create(null);
    Object.keys(TEXT_FR_EN).forEach((k) => {
        TEXT_LOOKUP[normSpace(k)] = TEXT_FR_EN[k];
    });

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
                tag === 'SVG' || tag === 'KBD' ||
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
        const titleEls = document.querySelectorAll('[title], [aria-label]');
        titleEls.forEach((el) => {
            if (el.id === 'langToggleBtn') return;
            if (!attrOrigMap.has(el)) {
                attrOrigMap.set(el, {
                    title: el.getAttribute('title'),
                    placeholder: el.getAttribute('placeholder'),
                    ariaLabel: el.getAttribute('aria-label')
                });
            }
            const orig = attrOrigMap.get(el);
            if (lang === 'fr') {
                if (orig.title !== null) el.setAttribute('title', orig.title);
                if (orig.placeholder !== null) el.setAttribute('placeholder', orig.placeholder);
                if (orig.ariaLabel !== null) el.setAttribute('aria-label', orig.ariaLabel);
            } else {
                if (orig.title && TITLE_FR_EN[orig.title]) {
                    el.setAttribute('title', TITLE_FR_EN[orig.title]);
                }
                if (orig.placeholder && PLACEHOLDER_FR_EN[orig.placeholder]) {
                    el.setAttribute('placeholder', PLACEHOLDER_FR_EN[orig.placeholder]);
                }
            }
        });
        document.querySelectorAll('input[placeholder]').forEach((input) => {
            if (!attrOrigMap.has(input)) {
                attrOrigMap.set(input, {
                    title: input.getAttribute('title'),
                    placeholder: input.getAttribute('placeholder'),
                    ariaLabel: input.getAttribute('aria-label')
                });
            }
            const orig = attrOrigMap.get(input);
            if (lang === 'fr') {
                if (orig.placeholder !== null) input.setAttribute('placeholder', orig.placeholder);
            } else if (orig.placeholder && PLACEHOLDER_FR_EN[orig.placeholder]) {
                input.setAttribute('placeholder', PLACEHOLDER_FR_EN[orig.placeholder]);
            }
        });
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
        }
    };
})(typeof window !== 'undefined' ? window : this);
