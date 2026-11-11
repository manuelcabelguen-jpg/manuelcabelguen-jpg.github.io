/**
 * CARTOGRAFFECT® - Quick Command & Search Palette (Cmd+K / Ctrl+K)
 * Compatible Tailwind CDN / Vanilla JS - Thème Cosmic Glass
 * Développé pour la plateforme scientifique CARTOGRAFFECT®
 */
(function () {
  'use strict';

  // 1. Données d'indexation initiale (extensible avec cartograffect_model.js)
  const defaultIndex = [
    // Expérience immersive
    { id: 'voyage', title: 'Le Voyage Affectif — Vivre le Circuit d\'une Émotion (2 min)', category: 'Expérience', url: 'voyage.html', icon: '✨', badge: 'Interactif' },

    // Territoires & Navigation principale
    { id: 'comp1', title: '1. Le Moteur Prédictif — Interfaces Perceptive, Subjective, Attentionnelle & Gradients A/C', category: 'Modèle', url: 'moteur-predictif.html', icon: '⚡', badge: 'Niveau 1' },
    { id: 'comp2', title: '2. Le Noyau Affectif — Espace (X, Y, Z), Métrique L₁ & Opérateurs Centraux', category: 'Modèle', url: 'noyau-affectif.html', icon: '🧭', badge: 'Niveau 2' },
    { id: 'comp3', title: '3. La Matrice Affective — Valence Lexicographique, Prototypes Z=2 & Dissipation', category: 'Modèle', url: 'matrice-affective.html', icon: '🔷', badge: 'Niveau 3' },
    { id: 't1', title: '4. La Taxonomie Affective — Carte Interactive 2D/3D des 176 États (Z=0 à Z=7)', category: 'Exploration', url: 'taxonomie-affective.html', icon: '🌐', badge: 'Niveau 4' },
            { id: 't4', title: 'Article Théorique — Monographie Intégrale (Dr M. Cabelguen)', category: 'Recherche', url: 'article.html', icon: '📄', badge: 'OPIC 1233199' },
    { id: 'lean4', title: 'Preuve Formelle Lean 4.35 — 17 Théorèmes & 0 Sorry (DOI: 10.5281/zenodo.23833938)', category: 'Recherche', url: 'https://doi.org/10.5281/zenodo.23833938', icon: '💎', badge: 'Lean 4' },
    { id: 't5', title: 'Scholar Drive — Corpus Conceptuel & Références', category: 'Recherche', url: 'scholar_drive.html', icon: '📚', badge: 'Corpus' },
    { id: 't6', title: 'Accueil — Synthèse du Moteur Prédictif', category: 'Navigation', url: 'index.html', icon: '🏠', badge: 'Accueil' },

    // Strates Z (Norme L1)
    { id: 'z0', title: 'Strate Z = 0 — Point de Veille (0,0,0) [Origine & Repos]', category: 'Strate Z', url: 'taxonomie-affective.html#strate-0', icon: '0', badge: 'Origine' },
    { id: 'z1', title: 'Strate Z = 1 — Opérateur Surprise (0,0,1) [Rupture de Repos]', category: 'Strate Z', url: 'taxonomie-affective.html#strate-1', icon: '1', badge: 'Saillance' },
    { id: 'z2', title: 'Strate Z = 2 — Prototypes Fondamentaux (|X|+|Y|=2, 8 affects)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-2', icon: '2', badge: 'Première Couronne' },
    { id: 'z3', title: 'Strate Z = 3 — Émotions Réactives (|X|+|Y|=4, 16 affects)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-3', icon: '3', badge: 'Émoi' },
    { id: 'z4', title: 'Strate Z = 4 — Sentiments Réflexifs & Relationnels (|X|+|Y|=6)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-4', icon: '4', badge: 'Réserve' },
    { id: 'z5', title: 'Strate Z = 5 — Dispositions Durables & Humeurs (|X|+|Y|=8)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-5', icon: '5', badge: 'Recul' },
    { id: 'z6', title: 'Strate Z = 6 — Identités Affectives (|X|+|Y|=10, Saisissement)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-6', icon: '6', badge: 'Saisissement' },
    { id: 'z7', title: 'Strate Z = 7 — Sentiments Transcendantaux (|X|+|Y|=12)', category: 'Strate Z', url: 'taxonomie-affective.html#strate-7', icon: '7', badge: 'Suspension' },

    // Prototypes Axiaux et Diagonaux Clés
    { id: 'p_joie', title: 'Joie — X0 / Y+2 / Z2 (Décharge de Contrôle)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Joie', icon: '☀️', badge: 'Axial' },
    { id: 'p_tristesse', title: 'Tristesse — X0 / Y-2 / Z2 (Charge de Contrôle)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Tristesse', icon: '💧', badge: 'Axial' },
    { id: 'p_courage', title: 'Courage — X+2 / Y0 / Z2 (Décharge d’Attente)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Courage', icon: '🛡️', badge: 'Axial' },
    { id: 'p_peur', title: 'Peur — X-2 / Y0 / Z2 (Charge d’Attente)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Peur', icon: '⚡', badge: 'Axial' },
    { id: 'p_desir', title: 'Désir — X+1 / Y+1 / Z2 (Attracteur Équilibré)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Désir', icon: '🔥', badge: 'Diagonal' },
    { id: 'p_colere', title: 'Colère — X-1 / Y+1 / Z2 (Modèle Rigide & Action)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Colère', icon: '⚔️', badge: 'Diagonal' },
    { id: 'p_calme', title: 'Calme — X+1 / Y-1 / Z2 (Modèle Révisable & Lâcher-prise)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Calme', icon: '🍃', badge: 'Diagonal' },
    { id: 'p_degout', title: 'Dégoût — X-1 / Y-1 / Z2 (Rejet & Non-contrôle)', category: 'Affect Clé', url: 'taxonomie-affective.html?id=Dégoût', icon: '🛑', badge: 'Diagonal' },

    // Concepts computationnels & Neurosciences
    { id: 'c1', title: 'Énergie Libre Variationnelle & Minimisation (Friston)', category: 'Concept', url: 'article.html#theorie', icon: '⚡', badge: 'Physique' },
    { id: 'c2', title: 'Inférence Active & Allostasie Intéroceptive', category: 'Concept', url: 'article.html#allostasie', icon: '🧠', badge: 'Biologie' },
    { id: 'c3', title: 'Norme L1 de Manhattan : |X| + |Y| = 2Z - 2', category: 'Mathématiques', url: 'article.html#theorie', icon: '∑', badge: 'Loi L1' },
    { id: 'c4', title: 'Inversion Centrale (X, Y) → (-X, -Y) & Symétrie Octaédrique', category: 'Mathématiques', url: 'article.html#theorie', icon: '⬡', badge: 'Géométrie' },
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
          icon: e.type === 'operator' ? '⭐' : (e.type === 'axial' ? '◈' : '🔹'),
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
        <div id="cmd-palette-container" class="w-full max-w-2xl bg-[#0b101d]/95 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/60 overflow-hidden transform scale-95 transition-all duration-200 backdrop-blur-xl">
          
          <!-- Barre de saisie -->
          <div class="flex items-center px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/50">
            <span class="text-purple-400 mr-3 text-lg">🔍</span>
            <input id="cmd-input" type="text" placeholder="Rechercher un affect, une strate Z, un concept (ex: Colère, Z=3, Friston, Manhattan)..." 
                   autocomplete="off" spellcheck="false"
                   class="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-sans">
            <div class="flex items-center gap-1.5 ml-2">
              <kbd class="px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded shadow-sm">Échap</kbd>
            </div>
          </div>

          <!-- Filtres rapides par catégories -->
          <div class="flex items-center gap-1 px-4 py-2 border-b border-slate-800/50 bg-slate-950/40 text-[11px] font-mono overflow-x-auto no-scrollbar">
            <span class="text-slate-400 mr-1 shrink-0">Filtres :</span>
            <button type="button" class="cmd-filter-pill px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30 font-semibold hover:bg-purple-900" data-filter="">Tous</button>
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
            <div class="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>CARTOGRAFFECT® Quick Index</span>
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
          btn.className = 'cmd-filter-pill px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-200 border border-purple-500/50 font-semibold';
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
          <li class="px-4 py-8 text-center text-sm text-slate-400">
            <div class="text-2xl mb-1">🔍</div>
            Aucun résultat correspondant dans le modèle CARTOGRAFFECT®.
          </li>`;
        return;
      }

      resultsList.innerHTML = currentMatches.map((item, index) => {
        const isSelected = index === activeIndex;
        return `
          <li data-index="${index}" class="cmd-item flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-all ${
            isSelected ? 'bg-purple-600/30 border border-purple-500/40 text-white shadow-md' : 'text-slate-200 hover:bg-slate-800/60 hover:text-white border border-transparent'
          }">
            <div class="flex items-center space-x-3 overflow-hidden">
              <span class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/80 text-sm">${item.icon}</span>
              <span class="font-medium truncate">${item.title}</span>
            </div>
            <span class="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-purple-300 ml-2">${item.badge || item.category}</span>
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
