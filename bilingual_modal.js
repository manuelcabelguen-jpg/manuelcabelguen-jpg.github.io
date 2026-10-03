/**
 * CARTOGRAFFECT - Guide Bilingue & Lexique International (FR <-> EN)
 * Dr Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien • OPIC n° 1233199
 */

(function() {
    // Injected Modal HTML
    const modalHTML = `
    <div id="bilingualModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden transition-opacity duration-200">
        <div class="relative w-full max-w-4xl max-h-[90vh] bg-cosmic-900 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-800 bg-gradient-to-r from-cosmic-800 via-purple-950/20 to-cosmic-800 flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            International Research Ready • OPIC n° 1233199
                        </span>
                        <span class="text-xs text-slate-400">Dr Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien</span>
                    </div>
                    <h3 class="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
                        <span>🌐</span> Lexique Bilingue &amp; Terminologie Internationale
                    </h3>
                    <p class="text-xs text-slate-400 mt-1">
                        Correspondances scientifiques Français ⇄ Anglais pour publications, conférences et recherche translationnelle.
                    </p>
                </div>
                <button onclick="closeLangModal()" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xl leading-none">
                    &times;
                </button>
            </div>

            <!-- Filter Tabs & Live Search -->
            <div class="p-4 border-b border-slate-800/80 bg-cosmic-850 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-purple-600 text-white transition-colors" data-filter="all">Tous les termes</button>
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors" data-filter="math">Mathématiques &amp; Inférence</button>
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors" data-filter="acronyms">CRIMES &amp; MIRACLES</button>
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors" data-filter="affects">8 Affects Cardinaux</button>
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors" data-filter="citation">Citation APA</button>
                </div>
                <div class="relative w-full sm:w-64">
                    <input type="text" id="langSearchInput" placeholder="Rechercher un terme (ex: agency, attente, L1)..." class="w-full px-3 py-1.5 pl-8 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500">
                    <span class="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
                </div>
            </div>

            <!-- Modal Body Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6 text-sm" id="langTermsContainer">

                <!-- Section Math & Inférence -->
                <div class="term-group" data-group="math">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
                        <span>📐</span> Paramètres Computationnels &amp; Traitement Prédictif
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="term-card p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Gradient d'Attente (Axe X)</span>
                                <span class="text-[10px] text-purple-400 font-mono">X ∈ [-12, +12]</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Expectation Gradient / Internal Model Revisability</div>
                            <p class="text-[11px] text-slate-400">Révisabilité du modèle interne : souplesse épistémique (+X) vs maintien rigide (-X).</p>
                        </div>

                        <div class="term-card p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Gradient de Contrôle (Axe Y)</span>
                                <span class="text-[10px] text-purple-400 font-mono">Y ∈ [-12, +12]</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Control Gradient / World Controllability</div>
                            <p class="text-[11px] text-slate-400">Contrôlabilité du monde : action pragmatique (+Y) vs repli ou acceptation (-Y).</p>
                        </div>

                        <div class="term-card p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Profondeur &amp; Abstraction (Axe Z)</span>
                                <span class="text-[10px] text-purple-400 font-mono">Z ∈ {0, 1, 2, ..., 7}</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Temporal Depth &amp; Abstraction Level</div>
                            <p class="text-[11px] text-slate-400">8 strates d'abstraction : du Point de Veille (Z=0) aux Sentiments Transcendantaux (Z=7).</p>
                        </div>

                        <div class="term-card p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Loi des Couronnes (Norme L1)</span>
                                <span class="text-[10px] text-purple-400 font-mono">|X| + |Y| = 2Z - 2</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Manhattan Crown Law / N(Z) = 8(Z-1)</div>
                            <p class="text-[11px] text-slate-400">176 entrées : 8 opérateurs centraux (0,0,Z) + 168 affects sur 6 couronnes (8, 16, 24, 32, 40, 48).</p>
                        </div>

                        <div class="term-card p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Typologie Géométrique</span>
                                <span class="text-[10px] text-purple-400 font-mono">Axiales, Diagonales, Latérales</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Geometric Typology of Affects</div>
                            <p class="text-[11px] text-slate-400">Positions axiales (X=0 ou Y=0), diagonales (|X|=|Y|), latérales (X≠0, Y≠0, |X|≠|Y|) et 8 opérateurs centraux.</p>
                        </div>

                        <div class="term-card p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Correspondances &amp; Symétries</span>
                                <span class="text-[10px] text-purple-400 font-mono">Axiales, Diag., Controlatérales</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Geometric &amp; Semantic Correspondences</div>
                            <p class="text-[11px] text-slate-400">Inversions centrales (-X,-Y) et croisements Td(X,Y)=(Y,X) et Ti(X,Y)=(-Y,-X) (84 paires).</p>
                        </div>
                    </div>
                </div>

                <!-- Section Acronymes -->
                <div class="term-group" data-group="acronyms">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
                        <span>🛡️</span> Acronymes Fondateurs : CRIMES &amp; MIRACLES
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- CRIMES -->
                        <div class="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                            <div class="font-heading font-bold text-sm text-rose-300 flex items-center justify-between">
                                <span>C.R.I.M.E.S. (Territoire Sombre)</span>
                                <span class="text-[10px] px-2 py-0.5 rounded bg-rose-900/50 text-rose-200">Dysrégulation</span>
                            </div>
                            <ul class="text-xs space-y-1.5 text-slate-300">
                                <li><strong class="text-rose-400">C</strong>onflit ⇄ <span class="text-indigo-200">Internal Cognitive/Emotional Conflict</span></li>
                                <li><strong class="text-rose-400">R</strong>upture ⇄ <span class="text-indigo-200">Relational / Model Rupture</span></li>
                                <li><strong class="text-rose-400">I</strong>ncompétence ⇄ <span class="text-indigo-200">Perceived Helplessness / Low Agency</span></li>
                                <li><strong class="text-rose-400">M</strong>anque ⇄ <span class="text-indigo-200">Chronic Deficit / Emotional Void</span></li>
                                <li><strong class="text-rose-400">É</strong>puisement ⇄ <span class="text-indigo-200">Allostatic Exhaustion / Burnout</span></li>
                                <li><strong class="text-rose-400">S</strong>ubmersion ⇄ <span class="text-indigo-200">Cognitive Flooding / Hyper-arousal</span></li>
                            </ul>
                        </div>

                        <!-- MIRACLES -->
                        <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                            <div class="font-heading font-bold text-sm text-emerald-300 flex items-center justify-between">
                                <span>M.I.R.A.C.L.E.S. (Territoire Lumineux)</span>
                                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-200">Régulation</span>
                            </div>
                            <ul class="text-xs space-y-1.5 text-slate-300">
                                <li><strong class="text-emerald-400">M</strong>odèle ⇄ <span class="text-indigo-200">Generative Mental Schema &amp; Reframing</span></li>
                                <li><strong class="text-emerald-400">I</strong>ntention ⇄ <span class="text-indigo-200">Goal-directed Purposive Stance</span></li>
                                <li><strong class="text-emerald-400">R</strong>égulation ⇄ <span class="text-indigo-200">Somatic &amp; Cognitive Homeostasis</span></li>
                                <li><strong class="text-emerald-400">A</strong>cceptation ⇄ <span class="text-indigo-200">Experiential Acceptance / Radical Presence</span></li>
                                <li><strong class="text-emerald-400">C</strong>ohérence ⇄ <span class="text-indigo-200">Integrative Autonomic Coherence</span></li>
                                <li><strong class="text-emerald-400">L</strong>ibération ⇄ <span class="text-indigo-200">Release of Rigid Predictive Priors</span></li>
                                <li><strong class="text-emerald-400">É</strong>nergie ⇄ <span class="text-indigo-200">Restoration of Metabolic Vitality</span></li>
                                <li><strong class="text-emerald-400">S</strong>ens ⇄ <span class="text-indigo-200">Meaning Reconstruction &amp; Eudaimonia</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Section 8 Affects Primaires -->
                <div class="term-group" data-group="affects">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                        <span>🌐</span> Les 8 Affects Cardinaux
                    </h4>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Surprise</div>
                            <div class="text-[11px] text-purple-300 italic">Surprise / Prediction Error</div>
                            <div class="text-[10px] text-slate-500 font-mono">(0, 0, 1)</div>
                        </div>
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Peur</div>
                            <div class="text-[11px] text-purple-300 italic">Fear / Anticipated Threat</div>
                            <div class="text-[10px] text-slate-500 font-mono">(0, -2, 2)</div>
                        </div>
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Colère</div>
                            <div class="text-[11px] text-purple-300 italic">Anger / Blocked Agency</div>
                            <div class="text-[10px] text-slate-500 font-mono">(-2, 0, 2)</div>
                        </div>
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Tristesse</div>
                            <div class="text-[11px] text-purple-300 italic">Sadness / Grief / Loss</div>
                            <div class="text-[10px] text-slate-500 font-mono">(0, -2, 2)</div>
                        </div>
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Joie</div>
                            <div class="text-[11px] text-purple-300 italic">Joy / Model Confirmation</div>
                            <div class="text-[10px] text-slate-500 font-mono">(0, +2, 2)</div>
                        </div>
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Dégoût</div>
                            <div class="text-[11px] text-purple-300 italic">Disgust / Visceral Rejection</div>
                            <div class="text-[10px] text-slate-500 font-mono">(-1, -1, 2)</div>
                        </div>
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Désir</div>
                            <div class="text-[11px] text-purple-300 italic">Desire / Incentive Salience</div>
                            <div class="text-[10px] text-slate-500 font-mono">(+1, +1, 2)</div>
                        </div>
                        <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Calme</div>
                            <div class="text-[11px] text-purple-300 italic">Calm / Baseline Allostasis</div>
                            <div class="text-[10px] text-slate-500 font-mono">(0, 0, 0)</div>
                        </div>
                    </div>
                </div>

                <!-- Section Citation -->
                <div class="term-group" data-group="citation">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                        <span>📚</span> Formats de Citation Officielle (APA 7th &amp; Publications)
                    </h4>
                    <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                        <div class="space-y-1.5">
                            <span class="text-[11px] font-bold text-purple-300 uppercase">1. Article Théorique de Référence :</span>
                            <p class="text-xs text-slate-300 leading-relaxed font-mono bg-cosmic-950 p-3 rounded-lg border border-slate-800/80">
                                Cabelguen, M. (2026). <em>Cartographie des affects : une architecture hiérarchique de l’expérience affective fondée sur le traitement prédictif</em> (Enregistrement de droit d'auteur OPIC n° 1233199). Prépublication théorique. https://www.cartograffect.com/article.html
                            </p>
                        </div>
                        <div class="space-y-1.5">
                            <span class="text-[11px] font-bold text-sky-300 uppercase">2. Algorithme &amp; Modèle Computationnel 3.6 :</span>
                            <p class="text-xs text-slate-300 leading-relaxed font-mono bg-cosmic-950 p-3 rounded-lg border border-slate-800/80" id="apaCitationText">
                                Cabelguen, M. (2026). <em>Cartograffect : Algorithme tridimensionnel des affects sous norme L1 et dynamique d'inférence active</em> (Certificat d'enregistrement de droit d'auteur OPIC n° 1233199). Montréal, QC : Cartograffect Publications. https://www.cartograffect.com
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 pt-1">
                            <button onclick="copyCitationText()" id="copyCitationBtn" class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md">
                                <span>📋</span> Copier la référence APA de l'Article
                            </button>
                            <a href="article.html" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all">
                                <span>📖</span> Consulter l'Article en Ligne
                            </a>
                            <span id="copySuccessNotice" class="text-xs text-emerald-400 hidden">✓ Citation copiée dans le presse-papiers !</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Modal Footer -->
            <div class="p-4 border-t border-slate-800 bg-cosmic-850 flex items-center justify-between text-xs text-slate-400">
                <span>Certificat OPIC n° 1233199 &bull; © 2024–2026 Manuel Cabelguen</span>
                <button onclick="closeLangModal()" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors">
                    Fermer
                </button>
            </div>
        </div>
    </div>
    `;

    // Inject modal into document body if not already present
    function injectModal() {
        if (!document.getElementById("bilingualModal")) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = modalHTML;
            document.body.appendChild(wrapper.firstElementChild);
            setupModalEvents();
        }
    }

    function setupModalEvents() {
        // Tab buttons
        const tabBtns = document.querySelectorAll(".lang-tab-btn");
        const termGroups = document.querySelectorAll(".term-group");

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const filter = btn.getAttribute("data-filter");
                tabBtns.forEach(b => {
                    b.classList.remove("bg-purple-600", "text-white");
                    b.classList.add("bg-slate-800", "text-slate-300");
                });
                btn.classList.add("bg-purple-600", "text-white");
                btn.classList.remove("bg-slate-800", "text-slate-300");

                termGroups.forEach(group => {
                    if (filter === "all" || group.getAttribute("data-group") === filter) {
                        group.classList.remove("hidden");
                    } else {
                        group.classList.add("hidden");
                    }
                });
            });
        });

        // Search Input
        const searchInput = document.getElementById("langSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase().trim();
                
                if (!query) {
                    document.querySelectorAll(".term-card, .term-group").forEach(el => el.classList.remove("hidden"));
                    return;
                }

                document.querySelectorAll(".term-card").forEach(card => {
                    const text = card.textContent.toLowerCase();
                    if (text.includes(query)) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        }

        // Close on background click
        const modal = document.getElementById("bilingualModal");
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeLangModal();
            });
        }
    }

    // Global Functions
    window.openLangModal = function() {
        injectModal();
        const modal = document.getElementById("bilingualModal");
        if (modal) {
            modal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        }
    };

    window.closeLangModal = function() {
        const modal = document.getElementById("bilingualModal");
        if (modal) {
            modal.classList.add("hidden");
            document.body.style.overflow = "";
        }
    };

    window.copyCitationText = function() {
        const text = "Cabelguen, M. (2026). Cartograffect : Algorithme tridimensionnel des affects sous norme L1 et dynamique d'inférence active (Certificat d'enregistrement de droit d'auteur OPIC n° 1233199). Montréal, QC : Cartograffect Publications. https://www.cartograffect.com";
        navigator.clipboard.writeText(text).then(() => {
            const notice = document.getElementById("copySuccessNotice");
            if (notice) {
                notice.classList.remove("hidden");
                setTimeout(() => notice.classList.add("hidden"), 3000);
            }
        });
    };

    // Auto-init on DOMContentLoaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectModal);
    } else {
        injectModal();
    }
})();
