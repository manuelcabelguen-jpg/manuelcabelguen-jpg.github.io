/**
 * CARTOGRAFFECT - Quick Command & Search Palette (Cmd+K / Ctrl+K)
 * Compatible Tailwind CDN / Vanilla JS - Thème Cosmic Glass
 * Développé pour la plateforme scientifique CARTOGRAFFECT
 */
(function () {
  'use strict';

  // Helper icône SVG minimaliste selon type
  const ICONS = {
    voyage: '<svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    engine: '<svg class="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    core: '<svg class="w-4 h-4 text-sky-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><polygon points="12 2 22 12 12 22 2 12 12 2"/></svg>',
    matrix: '<svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/></svg>',
    taxonomy: '<svg class="w-4 h-4 text-rose-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    article: '<svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    lean: '<svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    corpus: '<svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    home: '<svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    concept: '<svg class="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>'
  };

  function isEn() {
    return Boolean(typeof window !== 'undefined' && window.CartograffectI18n && window.CartograffectI18n.getLang() === 'en');
  }

  // 1. Données d'indexation initiale (synchronisée via data/site-payload.json avec repli statique v3.0.0)
  function buildDefaultIndex() {
    const en = isEn();
    const P = (typeof window !== 'undefined' && window.CartograffectPayload) ? window.CartograffectPayload : null;
    const tag = P ? P.get('release.tag', 'v3.0.0') : 'v3.0.0';
    const theorems = P ? P.get('strate_0_core.theorems_substantial', 148) : 148;
    const proversCount = P ? P.get('strate_0_core.provers_count', 6) : 6;
    const leanModulesCount = P ? P.get('strate_0_core.lean_modules_count', 10) : 10;
    const statesCount = P ? P.get('strate_0_core.states_count', 176) : 176;
    const codeDoi = P ? P.get('identifiers.zenodo_code_doi', '10.5281/zenodo.23833938') : '10.5281/zenodo.23833938';
    const cipo = P ? P.get('identifiers.cipo_registration', '1233199') : '1233199';

    return [
      // Expérience immersive
      { id: 'voyage', title: en ? "The Affective Journey — Live an Emotion's Circuit (2 min)" : "Le Voyage Affectif — Vivre le Circuit d'une Émotion (2 min)", category: en ? 'Experience' : 'Expérience', filterKey: 'Expérience', url: 'voyage.html', icon: ICONS.voyage, badge: en ? 'Interactive' : 'Interactif' },

      // Territoires & Navigation principale
      { id: 'comp1', title: en ? '1. The Predictive Engine — Perceptual, Subjective, Attentional Interfaces & A/C Gradients' : '1. Le Moteur Prédictif — Interfaces Perceptive, Subjective, Attentionnelle & Gradients A/C', category: en ? 'Model' : 'Modèle', filterKey: 'Modèle', url: 'moteur-predictif.html', icon: ICONS.engine, badge: en ? 'Level 1' : 'Niveau 1' },
      { id: 'comp2', title: en ? '2. The Affective Core — (X, Y, Z) Space, L₁ Norm & Central Operators' : '2. Le Noyau Affectif — Espace (X, Y, Z), Norme L₁ & Opérateurs Centraux', category: en ? 'Model' : 'Modèle', filterKey: 'Modèle', url: 'noyau-affectif.html', icon: ICONS.core, badge: en ? 'Level 2' : 'Niveau 2' },
      { id: 'comp3', title: en ? '3. The Affective Matrix — Lexicographic Valence, Z=2 Prototypes & Dissipation' : '3. La Matrice Affective — Valence Lexicographique, Prototypes Z=2 & Dissipation', category: en ? 'Model' : 'Modèle', filterKey: 'Modèle', url: 'matrice-affective.html', icon: ICONS.matrix, badge: en ? 'Level 3' : 'Niveau 3' },
      { id: 't1', title: en ? `4. Affective Taxonomy — Interactive 2D/3D Map of ${statesCount} States (Z=0 to Z=7)` : `4. La Taxonomie Affective — Carte Interactive 2D/3D des ${statesCount} États (Z=0 à Z=7)`, category: 'Exploration', filterKey: 'Exploration', url: 'taxonomie-affective.html', icon: ICONS.taxonomy, badge: en ? 'Level 4' : 'Niveau 4' },
      { id: 't4', title: en ? `Theoretical Paper — Full Monograph ${tag} (Dr. M. Cabelguen)` : `Article Théorique — Monographie Intégrale ${tag} (Dr M. Cabelguen)`, category: en ? 'Research' : 'Recherche', filterKey: 'Recherche', url: 'article.html', icon: ICONS.article, badge: `${en ? 'CIPO' : 'OPIC'} ${cipo}` },
      { id: 'lean4', title: en ? `Formal Verification (${proversCount} Provers) — ${theorems} Theorems, ${leanModulesCount} .lean Modules & 0 Sorry (DOI: ${codeDoi})` : `Vérification Formelle (${proversCount} Prouveurs) — ${theorems} Théorèmes, ${leanModulesCount} Modules .lean & 0 Sorry (DOI: ${codeDoi})`, category: en ? 'Research' : 'Recherche', filterKey: 'Recherche', url: `https://doi.org/${codeDoi}`, icon: ICONS.lean, badge: en ? 'Formal' : 'Formel' },
      { id: 't5', title: en ? 'Corpus & Proofs — Historical Models & Formal Verification' : 'Corpus & Preuves — Modèles Historiques & Vérification Formelle', category: en ? 'Research' : 'Recherche', filterKey: 'Recherche', url: 'scholar_drive.html', icon: ICONS.corpus, badge: 'Corpus' },
      { id: 't6', title: en ? 'Home — Cartograffect Overview' : "Accueil — Vue d'ensemble de Cartograffect", category: 'Navigation', filterKey: 'Navigation', url: 'index.html', icon: ICONS.home, badge: en ? 'Home' : 'Accueil' },

      // Strates Z (Norme L1)
      { id: 'z0', title: en ? 'Stratum Z = 0 — Wake Point (0,0,0) [Origin & Rest]' : 'Strate Z = 0 — Point de Veille (0,0,0) [Origine & Repos]', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-0', icon: 'Z0', badge: en ? 'Origin' : 'Origine' },
      { id: 'z1', title: en ? 'Stratum Z = 1 — Surprise Operator (0,0,1) [Rest Rupture]' : 'Strate Z = 1 — Opérateur Surprise (0,0,1) [Rupture de Repos]', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-1', icon: 'Z1', badge: en ? 'Salience' : 'Saillance' },
      { id: 'z2', title: en ? 'Stratum Z = 2 — Fundamental Prototypes (|X|+|Y|=2, 8 affects)' : 'Strate Z = 2 — Prototypes Fondamentaux (|X|+|Y|=2, 8 affects)', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-2', icon: 'Z2', badge: en ? 'First Crown' : 'Première Couronne' },
      { id: 'z3', title: en ? 'Stratum Z = 3 — Reactive Emotions (|X|+|Y|=4, 16 affects)' : 'Strate Z = 3 — Émotions Réactives (|X|+|Y|=4, 16 affects)', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-3', icon: 'Z3', badge: 'Émoi' },
      { id: 'z4', title: en ? 'Stratum Z = 4 — Reflexive & Relational Feelings (|X|+|Y|=6)' : 'Strate Z = 4 — Sentiments Réflexifs & Relationnels (|X|+|Y|=6)', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-4', icon: 'Z4', badge: 'Réserve' },
      { id: 'z5', title: en ? 'Stratum Z = 5 — Enduring Dispositions & Moods (|X|+|Y|=8)' : 'Strate Z = 5 — Orientations Durables & Humeurs (|X|+|Y|=8)', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-5', icon: 'Z5', badge: 'Recul' },
      { id: 'z6', title: en ? 'Stratum Z = 6 — Affective Identities (|X|+|Y|=10, Saisissement)' : 'Strate Z = 6 — Identités Affectives (|X|+|Y|=10, Saisissement)', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-6', icon: 'Z6', badge: 'Saisissement' },
      { id: 'z7', title: en ? 'Stratum Z = 7 — Transcendental Feelings (|X|+|Y|=12, Suspension)' : 'Strate Z = 7 — Sentiments Transcendantaux (|X|+|Y|=12, Suspension)', category: en ? 'Stratum Z' : 'Strate Z', filterKey: 'Strate Z', url: 'taxonomie-affective.html#strate-7', icon: 'Z7', badge: 'Suspension' },

      // Prototypes Axiaux et Diagonaux Clés
      { id: 'p_joie', title: en ? 'Joie (Joy) — X0 / Y+2 / Z2 (Drive / Mobilization Y+)' : 'Joie — X0 / Y+2 / Z2 (Élan / Mobilisation Y+)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Joie', icon: 'Y+', badge: 'Axial' },
      { id: 'p_tristesse', title: en ? 'Tristesse (Sadness) — X0 / Y-2 / Z2 (Restraint Y−)' : 'Tristesse — X0 / Y-2 / Z2 (Retenue / Apaisement Y−)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Tristesse', icon: 'Y−', badge: 'Axial' },
      { id: 'p_courage', title: en ? 'Courage — X+2 / Y0 / Z2 (Expectation Discharge X+)' : 'Courage — X+2 / Y0 / Z2 (Décharge d’Attente X+)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Courage', icon: 'X+', badge: 'Axial' },
      { id: 'p_peur', title: en ? 'Peur (Fear) — X-2 / Y0 / Z2 (Expectation Charge X−)' : 'Peur — X-2 / Y0 / Z2 (Charge d’Attente X−)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Peur', icon: 'X−', badge: 'Axial' },
      { id: 'p_desir', title: en ? 'Désir (Desire) — X+1 / Y+1 / Z2 (Positive Synergy +X/+Y)' : 'Désir — X+1 / Y+1 / Z2 (Synergie Positive +X/+Y)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Désir', icon: '++', badge: 'Diagonal' },
      { id: 'p_colere', title: en ? 'Colère (Anger) — X-1 / Y+1 / Z2 (Ergotropic Compensation −X/+Y)' : 'Colère — X-1 / Y+1 / Z2 (Compensation Ergotropique −X/+Y)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Colère', icon: '−+', badge: 'Diagonal' },
      { id: 'p_calme', title: en ? 'Calme (Calm) — X+1 / Y-1 / Z2 (Trophotropic Release +X/−Y)' : 'Calme — X+1 / Y-1 / Z2 (Relâchement Trophotropique +X/−Y)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Calme', icon: '+−', badge: 'Diagonal' },
      { id: 'p_degout', title: en ? 'Dégoût (Disgust) — X-1 / Y-1 / Z2 (Aversive Congruence −X/−Y)' : 'Dégoût — X-1 / Y-1 / Z2 (Congruence Aversive −X/−Y)', category: en ? 'Key Affect' : 'Affect Clé', filterKey: 'Affect', url: 'taxonomie-affective.html?id=Dégoût', icon: '−−', badge: 'Diagonal' },

      // Concepts computationnels & Neurosciences
      { id: 'c1', title: en ? 'Variational Free Energy & Minimization (Friston)' : 'Énergie Libre Variationnelle & Minimisation (Friston)', category: 'Concept', filterKey: 'Concept', url: 'article.html#section-3', icon: ICONS.concept, badge: en ? 'Physics' : 'Physique' },
      { id: 'c2', title: en ? 'Active Inference & Interoceptive Allostasis' : 'Inférence Active & Allostasie Intéroceptive', category: 'Concept', filterKey: 'Concept', url: 'article.html#section-3', icon: ICONS.concept, badge: en ? 'Biology' : 'Biologie' },
      { id: 'c3', title: en ? 'L₁ Crown Law: |X| + |Y| = 2Z - 2 (Manhattan)' : 'Norme L₁ des Couronnes : |X| + |Y| = 2Z - 2 (Manhattan)', category: en ? 'Mathematics' : 'Mathématiques', filterKey: 'Concept', url: 'article.html#section-5', icon: 'L₁', badge: en ? 'L₁ Law' : 'Loi L₁' },
      { id: 'c4', title: en ? 'Piecewise Antagonist: (-X,-Y,Z) if XY=0; (-sgn(X)|Y|,-sgn(Y)|X|,Z) if XY≠0' : 'Antagoniste par morceaux : (-X,-Y,Z) si XY=0 ; (-sgn(X)|Y|,-sgn(Y)|X|,Z) si XY≠0', category: en ? 'Mathematics' : 'Mathématiques', filterKey: 'Concept', url: 'article.html#section-6', icon: '⇄', badge: en ? 'Geometry' : 'Géométrie' },
    ];
  }

  let searchableItems = buildDefaultIndex();

  // Si cartograffect_model.js expose ses 176 émotions, enrichissement dynamique complet
  function refreshModelData() {
    const baseIndex = buildDefaultIndex();
    if (window.CartograffectModel && Array.isArray(window.CartograffectModel.emotions)) {
      const existingIds = new Set(baseIndex.map(i => i.id));
      const emotionsFormatted = window.CartograffectModel.emotions
        .filter(e => !existingIds.has(`emo-${e.name}`))
        .map(e => ({
          id: `emo-${e.id !== undefined ? e.id : e.name}`,
          title: `${e.name} — ${e.code || `X${e.x}/Y${e.y}/Z${e.z}`} (${e.desc || 'Affect'})`,
          category: `Affect • Z=${e.z}`,
          filterKey: 'Affect',
          url: `taxonomie-affective.html?id=${encodeURIComponent(e.name)}`,
          icon: e.type === 'operator' ? 'C' : (e.type === 'axial' ? 'Ax' : (e.type === 'diagonal' ? 'Dg' : 'Lt')),
          badge: e.group || `Z=${e.z}`
        }));
      searchableItems = [...baseIndex, ...emotionsFormatted];
    } else {
      searchableItems = baseIndex;
    }
  }

  // 2. Création de l'interface dans le DOM
  function createPaletteDOM() {
    if (document.getElementById('cmd-palette-backdrop')) return;

    const modalHTML = `
      <div id="cmd-palette-backdrop" role="dialog" aria-modal="true" aria-label="Recherche rapide Cartograffect" aria-hidden="true" class="hidden fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-200">
        <div id="cmd-palette-container" class="w-full max-w-2xl bg-cosmic-850/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transform scale-95 transition-all duration-200 backdrop-blur-xl">
          
          <!-- Barre de saisie -->
          <div class="flex items-center px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/50">
            <svg class="w-4 h-4 text-indigo-400 mr-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input id="cmd-input" type="text" aria-label="Rechercher un affect, une strate ou un concept" placeholder="Rechercher un affect, une strate Z, un concept (ex: Colère, Z=3, Friston, L1)..." 
                   autocomplete="off" spellcheck="false"
                   class="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-sans">
            <div class="flex items-center gap-1.5 ml-2">
              <kbd id="cmd-esc-kbd" class="px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded shadow-sm">Échap</kbd>
            </div>
          </div>

          <!-- Filtres rapides par catégories -->
          <div class="flex items-center gap-1 px-4 py-2 border-b border-slate-800/50 bg-slate-950/40 text-[11px] font-mono overflow-x-auto no-scrollbar">
            <span id="cmd-filters-label" class="text-slate-400 mr-1 shrink-0">Filtres :</span>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-indigo-950/70 text-indigo-200 border border-indigo-500/40 font-semibold" data-filter="">Tous</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Exploration">Exploration</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Strate Z">Strates Z</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Affect">Affects</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Concept">Concepts</button>
          </div>

          <!-- Liste des résultats -->
          <ul id="cmd-results" role="listbox" class="max-h-84 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40 font-sans"></ul>

          <!-- Pied de la palette -->
          <div class="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div class="flex items-center gap-3 font-mono text-[11px]">
              <span id="cmd-nav-hint"><kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↑</kbd> <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↓</kbd> Naviguer</span>
              <span id="cmd-open-hint"><kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↵ Entrée</kbd> Ouvrir</span>
            </div>
            <div class="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>CARTOGRAFFECT Index</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const backdrop = document.getElementById('cmd-palette-backdrop');
    const container = document.getElementById('cmd-palette-container');
    const input = document.getElementById('cmd-input');
    const resultsList = document.getElementById('cmd-results');

    let activeIndex = 0;
    let currentMatches = [];
    let currentCategoryFilter = '';
    let lastFocusedEl = null;

    function syncPaletteChrome() {
      const en = isEn();
      backdrop.setAttribute('aria-label', en ? 'Cartograffect Quick Search' : 'Recherche rapide Cartograffect');
      input.setAttribute('aria-label', en ? 'Search an affective state, stratum or concept' : 'Rechercher un affect, une strate ou un concept');
      input.setAttribute('placeholder', en
        ? 'Search an affective state, stratum Z, or concept (e.g. Colère, Z=3, Friston, L1)...'
        : 'Rechercher un affect, une strate Z, un concept (ex: Colère, Z=3, Friston, L1)...');
      const escKbd = document.getElementById('cmd-esc-kbd');
      if (escKbd) escKbd.textContent = en ? 'Esc' : 'Échap';
      const filtersLbl = document.getElementById('cmd-filters-label');
      if (filtersLbl) filtersLbl.textContent = en ? 'Filters:' : 'Filtres :';
      const pillLabels = en
        ? { '': 'All', 'Exploration': 'Exploration', 'Strate Z': 'Strata Z', 'Affect': 'Affects', 'Concept': 'Concepts' }
        : { '': 'Tous', 'Exploration': 'Exploration', 'Strate Z': 'Strates Z', 'Affect': 'Affects', 'Concept': 'Concepts' };
      document.querySelectorAll('.cmd-filter-pill').forEach(btn => {
        const fk = btn.getAttribute('data-filter') || '';
        if (pillLabels[fk]) btn.textContent = pillLabels[fk];
      });
      const navHint = document.getElementById('cmd-nav-hint');
      if (navHint) navHint.innerHTML = `<kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↑</kbd> <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↓</kbd> ${en ? 'Navigate' : 'Naviguer'}`;
      const openHint = document.getElementById('cmd-open-hint');
      if (openHint) openHint.innerHTML = `<kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">${en ? '↵ Enter' : '↵ Entrée'}</kbd> ${en ? 'Open' : 'Ouvrir'}`;
    }

    function getFocusable() {
      return Array.from(
        container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(el => el.offsetParent !== null);
    }

    function openPalette() {
      lastFocusedEl = document.activeElement;
      refreshModelData();
      syncPaletteChrome();
      backdrop.classList.remove('hidden');
      backdrop.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        container.classList.remove('scale-95');
        container.classList.add('scale-100');
      });
      input.value = '';
      currentCategoryFilter = '';
      updatePills();
      filterItems('');
      setTimeout(() => input.focus(), 60);
    }

    function closePalette() {
      if (backdrop.classList.contains('hidden')) return;
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      backdrop.setAttribute('aria-hidden', 'true');
      container.classList.remove('scale-100');
      container.classList.add('scale-95');
      setTimeout(() => {
        backdrop.classList.add('hidden');
      }, 200);
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function' && document.contains(lastFocusedEl)) {
        lastFocusedEl.focus();
      }
    }

    function updatePills() {
      document.querySelectorAll('.cmd-filter-pill').forEach(btn => {
        const cat = btn.getAttribute('data-filter');
        if (cat === currentCategoryFilter) {
          btn.className = 'cmd-filter-pill px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-200 border border-indigo-500/50 font-semibold';
        } else {
          btn.className = 'cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white';
        }
      });
    }

    function filterItems(query) {
      const q = query.toLowerCase().trim();
      let pool = searchableItems;

      if (currentCategoryFilter) {
        pool = pool.filter(item =>
          (item.filterKey && item.filterKey.toLowerCase().includes(currentCategoryFilter.toLowerCase())) ||
          item.category.toLowerCase().includes(currentCategoryFilter.toLowerCase())
        );
      }

      if (!q) {
        currentMatches = pool.slice(0, 10);
      } else {
        currentMatches = pool.filter(item => 
          item.title.toLowerCase().includes(q) || 
          item.category.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
        ).slice(0, 25);
      }
      activeIndex = 0;
      renderResults();
    }

    function renderResults() {
      const en = isEn();
      if (currentMatches.length === 0) {
        resultsList.innerHTML = `
          <li class="px-4 py-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
            <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>${en ? 'No matching results in the CARTOGRAFFECT model.' : 'Aucun résultat correspondant dans le modèle CARTOGRAFFECT.'}</span>
          </li>`;
        return;
      }

      resultsList.innerHTML = currentMatches.map((item, index) => {
        const isSelected = index === activeIndex;
        return `
          <li data-index="${index}" role="option" aria-selected="${isSelected}" class="cmd-item flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-all ${
            isSelected ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' : 'text-slate-200 hover:bg-slate-800/60 hover:text-white border border-transparent'
          }">
            <div class="flex items-center space-x-3 overflow-hidden">
              <span class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono text-slate-300">${item.icon}</span>
              <span class="font-medium truncate">${item.title}</span>
            </div>
            <span class="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-indigo-300 ml-2">${item.badge || item.category}</span>
          </li>
        `;
      }).join('');

      // Clic souris
      document.querySelectorAll('.cmd-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-index'), 10);
          selectItem(idx);
        });
      });
    }

    function selectItem(index) {
      const item = currentMatches[index];
      if (item && item.url) {
        closePalette();
        window.location.href = item.url;
      }
    }

    // Événements clavier
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.classList.contains('hidden')) {
          openPalette();
        } else {
          closePalette();
        }
      } else if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
        e.preventDefault();
        closePalette();
      } else if (!backdrop.classList.contains('hidden')) {
        if (e.key === 'Tab') {
          const focusables = getFocusable();
          if (focusables.length) {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey) {
              if (document.activeElement === first || !container.contains(document.activeElement)) {
                e.preventDefault();
                last.focus();
              }
            } else if (document.activeElement === last || !container.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
            }
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (currentMatches.length > 0) {
            activeIndex = (activeIndex + 1) % currentMatches.length;
            renderResults();
            ensureVisible(activeIndex);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentMatches.length > 0) {
            activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length;
            renderResults();
            ensureVisible(activeIndex);
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          selectItem(activeIndex);
        }
      }
    });

    function ensureVisible(idx) {
      const el = resultsList.querySelector(`[data-index="${idx}"]`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', (e) => filterItems(e.target.value));
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePalette();
    });

    document.querySelectorAll('.cmd-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategoryFilter = btn.getAttribute('data-filter') || '';
        updatePills();
        filterItems(input.value);
        input.focus();
      });
    });

    // Bind triggers present in headers
    document.querySelectorAll('[data-command-trigger]').forEach(btn => {
      if (!btn.dataset.cmdBound) {
        btn.dataset.cmdBound = '1';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openPalette();
        });
      }
    });

    syncPaletteChrome();
    window.addEventListener('cartograffect:lang-change', () => {
      refreshModelData();
      syncPaletteChrome();
      if (!backdrop.classList.contains('hidden')) {
        filterItems(input.value);
      }
    });

    // Exposition API globale
    window.CartograffectCmd = {
      open: openPalette,
      close: closePalette,
      refresh: refreshModelData
    };
  }

  // Initialisation dès que le DOM est prêt
  if (typeof window !== 'undefined') {
    window.addEventListener('cartograffect:payload-ready', refreshModelData);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPaletteDOM);
  } else {
    createPaletteDOM();
  }
})();
