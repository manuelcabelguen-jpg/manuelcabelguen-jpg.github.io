/**
 * CARTOGRAFFECT® - Quick Command & Search Palette (Cmd+K / Ctrl+K)
 * Compatible Tailwind CDN / Vanilla JS - Thème Cosmic Glass
 * Développé pour la plateforme scientifique CARTOGRAFFECT®
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

  // 1. Données d'indexation initiale (extensible avec cartograffect_model.js)
  const defaultIndex = [
    // Expérience immersive
    { id: 'voyage', title: 'Le Voyage Affectif — Vivre le Circuit d\'une Émotion (2 min)', category: 'Expérience', url: 'voyage.html', icon: ICONS.voyage, badge: 'Interactif' },

    // Territoires & Navigation principale
    { id: 'comp1', title: '1. Le Moteur Prédictif — Interfaces Perceptive, Subjective, Attentionnelle & Gradients A/C', category: 'Modèle', url: 'moteur-predictif.html', icon: ICONS.engine, badge: 'Niveau 1' },
    { id: 'comp2', title: '2. Le Noyau Affectif — Espace (X, Y, Z), Norme L₁ & Opérateurs Centraux', category: 'Modèle', url: 'noyau-affectif.html', icon: ICONS.core, badge: 'Niveau 2' },
    { id: 'comp3', title: '3. La Matrice Affective — Valence Lexicographique, Prototypes Z=2 & Dissipation', category: 'Modèle', url: 'matrice-affective.html', icon: ICONS.matrix, badge: 'Niveau 3' },
    { id: 't1', title: '4. La Taxonomie Affective — Carte Interactive 2D/3D des 176 États (Z=0 à Z=7)', category: 'Exploration', url: 'taxonomie-affective.html', icon: ICONS.taxonomy, badge: 'Niveau 4' },
    { id: 't4', title: 'Article Théorique — Monographie Intégrale v1.0.1 (Dr M. Cabelguen)', category: 'Recherche', url: 'article.html', icon: ICONS.article, badge: 'OPIC 1233199' },
    { id: 'lean4', title: 'Preuve Formelle Lean 4.35 — 68 Théorèmes & 0 Sorry (DOI: 10.5281/zenodo.23833938)', category: 'Recherche', url: 'https://doi.org/10.5281/zenodo.23833938', icon: ICONS.lean, badge: 'Lean 4' },
    { id: 't5', title: 'Corpus & Preuves — Modèles Historiques & Certification Lean 4', category: 'Recherche', url: 'scholar_drive.html', icon: ICONS.corpus, badge: 'Corpus' },
    { id: 't6', title: 'Accueil — Vue d\'ensemble de Cartograffect', category: 'Navigation', url: 'index.html', icon: ICONS.home, badge: 'Accueil' },

    // Strates Z (Norme L1)
    { id: 'z0', title: 'Strate Z = 0 — Point de Veille (0,0,0) [Origine & Repos]', category: 'Strate Z', url: 'taxonomie-affective.html#strate-0', icon: 'Z0', badge: 'Origine' },
    { id: 'z1', title: 'Strate Z = 1 — Opérateur Surprise (0,0,1) [Rupture de Repos]', category: 'Strate Z', url: 'taxonomie-affective.html#strate-1', icon: 'Z1', badge: 'Saillance' },
    { id: 'z2', title: 'Strate Z = 2 — Prototypes Fondamentaux (|X|+|Y|=2, 8 affects)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-2', icon: 'Z2', badge: 'Première Couronne' },
    { id: 'z3', title: 'Strate Z = 3 — Émotions Réactives (|X|+|Y|=4, 16 affects)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-3', icon: 'Z3', badge: 'Émoi' },
    { id: 'z4', title: 'Strate Z = 4 — Sentiments Réflexifs & Relationnels (|X|+|Y|=6)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-4', icon: 'Z4', badge: 'Réserve' },
    { id: 'z5', title: 'Strate Z = 5 — Orientations Durables & Humeurs (|X|+|Y|=8)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-5', icon: 'Z5', badge: 'Recul' },
    { id: 'z6', title: 'Strate Z = 6 — Identités Affectives (|X|+|Y|=10, Saisissement)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-6', icon: 'Z6', badge: 'Saisissement' },
    { id: 'z7', title: 'Strate Z = 7 — Sentiments Transcendantaux (|X|+|Y|=12)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-7', icon: 'Z7', badge: 'Suspension' },

    // Prototypes Axiaux et Diagonaux Clés
    { id: 'p_joie', title: 'Joie — X0 / Y+2 / Z2 (Élan / Mobilisation Y+)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Joie', icon: 'Y+', badge: 'Axial' },
    { id: 'p_tristesse', title: 'Tristesse — X0 / Y-2 / Z2 (Retenue / Apaisement Y−)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Tristesse', icon: 'Y−', badge: 'Axial' },
    { id: 'p_courage', title: 'Courage — X+2 / Y0 / Z2 (Décharge d’Attente X+)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Courage', icon: 'X+', badge: 'Axial' },
    { id: 'p_peur', title: 'Peur — X-2 / Y0 / Z2 (Charge d’Attente X−)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Peur', icon: 'X−', badge: 'Axial' },
    { id: 'p_desir', title: 'Désir — X+1 / Y+1 / Z2 (Synergie Positive +X/+Y)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Désir', icon: '++', badge: 'Diagonal' },
    { id: 'p_colere', title: 'Colère — X-1 / Y+1 / Z2 (Compensation Ergotropique −X/+Y)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Colère', icon: '−+', badge: 'Diagonal' },
    { id: 'p_calme', title: 'Calme — X+1 / Y-1 / Z2 (Relâchement Trophotropique +X/−Y)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Calme', icon: '+−', badge: 'Diagonal' },
    { id: 'p_degout', title: 'Dégoût — X-1 / Y-1 / Z2 (Congruence Aversive −X/−Y)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Dégoût', icon: '−−', badge: 'Diagonal' },

    // Concepts computationnels & Neurosciences
    { id: 'c1', title: 'Énergie Libre Variationnelle & Minimisation (Friston)', category: 'Concept', url: 'article.html#theorie', icon: ICONS.concept, badge: 'Physique' },
    { id: 'c2', title: 'Inférence Active & Allostasie Intéroceptive', category: 'Concept', url: 'article.html#allostasie', icon: ICONS.concept, badge: 'Biologie' },
    { id: 'c3', title: 'Norme L₁ des Couronnes : |X| + |Y| = 2Z - 2 (Manhattan)', category: 'Mathématiques', url: 'article.html#theorie', icon: 'L₁', badge: 'Loi L₁' },
    { id: 'c4', title: 'Inversion Centrale & Réflexion Controlatérale (-sgn(X)|Y|, -sgn(Y)|X|)', category: 'Mathématiques', url: 'article.html#theorie', icon: '⇄', badge: 'Géométrie' },
  ];

  let searchableItems = [...defaultIndex];

  // Si cartograffect_model.js expose ses 176 émotions, enrichissement dynamique complet
  function refreshModelData() {
    if (window.CartograffectModel && Array.isArray(window.CartograffectModel.emotions)) {
      const existingIds = new Set(defaultIndex.map(i => i.id));
      const emotionsFormatted = window.CartograffectModel.emotions
        .filter(e => !existingIds.has(`emo-${e.name}`))
        .map(e => ({
          id: `emo-${e.id !== undefined ? e.id : e.name}`,
          title: `${e.name} — ${e.code || `X${e.x}/Y${e.y}/Z${e.z}`} (${e.desc || 'Affect du modèle'})`,
          category: `Affect • Z=${e.z}`,
          url: `taxonomie-affective.html?id=${encodeURIComponent(e.name)}`,
          icon: e.type === 'operator' ? 'C' : (e.type === 'axial' ? 'Ax' : (e.type === 'diagonal' ? 'Dg' : 'Lt')),
          badge: e.group || `Z=${e.z}`
        }));
      searchableItems = [...defaultIndex, ...emotionsFormatted];
    }
  }

  // 2. Création de l'interface dans le DOM
  function createPaletteDOM() {
    if (document.getElementById('cmd-palette-backdrop')) return;

    const modalHTML = `
      <div id="cmd-palette-backdrop" class="hidden fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-200">
        <div id="cmd-palette-container" class="w-full max-w-2xl bg-cosmic-850/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transform scale-95 transition-all duration-200 backdrop-blur-xl">
          
          <!-- Barre de saisie -->
          <div class="flex items-center px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/50">
            <svg class="w-4 h-4 text-indigo-400 mr-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input id="cmd-input" type="text" placeholder="Rechercher un affect, une strate Z, un concept (ex: Colère, Z=3, Friston, L1)..." 
                   autocomplete="off" spellcheck="false"
                   class="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-sans">
            <div class="flex items-center gap-1.5 ml-2">
              <kbd class="px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded shadow-sm">Échap</kbd>
            </div>
          </div>

          <!-- Filtres rapides par catégories -->
          <div class="flex items-center gap-1 px-4 py-2 border-b border-slate-800/50 bg-slate-950/40 text-[11px] font-mono overflow-x-auto no-scrollbar">
            <span class="text-slate-400 mr-1 shrink-0">Filtres :</span>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-indigo-950/70 text-indigo-200 border border-indigo-500/40 font-semibold" data-filter="">Tous</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Exploration">Exploration</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Strate Z">Strates Z</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Affect">Affects</button>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" data-filter="Concept">Concepts</button>
          </div>

          <!-- Liste des résultats -->
          <ul id="cmd-results" class="max-h-84 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40 font-sans"></ul>

          <!-- Pied de la palette -->
          <div class="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div class="flex items-center gap-3 font-mono text-[11px]">
              <span><kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↑</kbd> <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↓</kbd> Naviguer</span>
              <span><kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">↵ Entrée</kbd> Ouvrir</span>
            </div>
            <div class="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>CARTOGRAFFECT® Index</span>
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

    function openPalette() {
      refreshModelData();
      backdrop.classList.remove('hidden');
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
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      container.classList.remove('scale-100');
      container.classList.add('scale-95');
      setTimeout(() => {
        backdrop.classList.add('hidden');
      }, 200);
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
        pool = pool.filter(item => item.category.toLowerCase().includes(currentCategoryFilter.toLowerCase()));
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
      if (currentMatches.length === 0) {
        resultsList.innerHTML = `
          <li class="px-4 py-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
            <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Aucun résultat correspondant dans le modèle CARTOGRAFFECT®.</span>
          </li>`;
        return;
      }

      resultsList.innerHTML = currentMatches.map((item, index) => {
        const isSelected = index === activeIndex;
        return `
          <li data-index="${index}" class="cmd-item flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-all ${
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
        if (backdrop.classList.contains('pointer-events-none')) {
          openPalette();
        } else {
          closePalette();
        }
      } else if (e.key === 'Escape' && !backdrop.classList.contains('pointer-events-none')) {
        closePalette();
      } else if (!backdrop.classList.contains('pointer-events-none')) {
        if (e.key === 'ArrowDown') {
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

    // Exposition API globale
    window.CartograffectCmd = {
      open: openPalette,
      close: closePalette,
      refresh: refreshModelData
    };
  }

  // Initialisation dès que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPaletteDOM);
  } else {
    createPaletteDOM();
  }
})();
