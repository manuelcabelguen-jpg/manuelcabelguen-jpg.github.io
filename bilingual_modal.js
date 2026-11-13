/**
 * CARTOGRAFFECT - Guide Bilingue & Lexique International (FR <-> EN)
 * Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien • OPIC n° 1233199
 */

(function() {
    // Injected Modal HTML
    const modalHTML = `
    <div id="bilingualModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden transition-opacity duration-200">
        <div class="relative w-full max-w-4xl max-h-[90vh] bg-cosmic-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-800 bg-cosmic-800/80 flex items-start justify-between gap-4">
                <div>
                    <div class="flex flex-wrap items-center gap-2 mb-1.5">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            Lexique FR ⇄ EN • OPIC n° 1233199
                        </span>
                        <span class="text-xs text-slate-400">Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien</span>
                    </div>
                    <h3 class="font-heading font-bold text-2xl text-white flex items-center gap-2.5">
                        <svg class="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        <span>Lexique Bilingue &amp; Terminologie Internationale</span>
                    </h3>
                    <p class="text-xs text-slate-400 mt-1">
                        Correspondances scientifiques Français ⇄ Anglais et passerelle entre vécu phénoménologique et formalisation Lean 4.
                    </p>
                </div>
                <button onclick="closeLangModal()" aria-label="Fermer le lexique" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xl leading-none cursor-pointer">
                    &times;
                </button>
            </div>

            <!-- Filter Tabs & Live Search -->
            <div class="p-4 border-b border-slate-800/80 bg-cosmic-850 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-indigo-600 text-white transition-colors cursor-pointer" data-filter="all">Tous les termes</button>
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer" data-filter="math">Mathématiques &amp; Axes</button>
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer" data-filter="affects">8 Prototypes Z=2</button>
                    <button class="lang-tab-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer" data-filter="citation">Citations APA</button>
                </div>
                <div class="relative w-full sm:w-64">
                    <input type="text" id="langSearchInput" placeholder="Rechercher (ex: agency, PEUR, L1)..." class="w-full px-3 py-1.5 pl-8 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-400">
                    <svg class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
            </div>

            <!-- Modal Body Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6 text-sm" id="langTermsContainer">

                <!-- Section Math & Inférence -->
                <div class="term-group" data-group="math">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                        <span>Paramètres Computationnels &amp; Passerelle Lexicale</span>
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="term-card p-3.5 rounded-xl bg-cosmic-800/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Gradient d'Attente (Axe X)</span>
                                <span class="text-[10px] text-indigo-300 font-mono">X ∈ [-12, +12]</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Expectation Gradient / Epistemic Revisability</div>
                            <p class="text-[11px] text-slate-400">Révisabilité du modèle interne (+X : ajuster ses repères) vs maintien rigide (-X : tenir ses repères). Gouverne la valence au 1er rang.</p>
                        </div>

                        <div class="term-card p-3.5 rounded-xl bg-cosmic-800/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Gradient de Contrôle (Axe Y)</span>
                                <span class="text-[10px] text-indigo-300 font-mono">Y ∈ [-12, +12]</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Control Gradient / World Controllability</div>
                            <p class="text-[11px] text-slate-400">Contrôlabilité pragmatique : élan/mobilisation d'action (+Y : agir) vs retenue/apaisement (-Y : laisser). Oriente le secteur vertical.</p>
                        </div>

                        <div class="term-card p-3.5 rounded-xl bg-cosmic-800/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Profondeur Structurelle (Axe Z)</span>
                                <span class="text-[10px] text-indigo-300 font-mono">Z ∈ {0, 1, ..., 7}</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Temporal Depth &amp; Structural Embedding</div>
                            <p class="text-[11px] text-slate-400">8 strates d'encastrement temporel : Veille (Z=0), Surprise (Z=1), Affect (Z=2), Émotion (Z=3), Sentiments &amp; identités (Z=4..7).</p>
                        </div>

                        <div class="term-card p-3.5 rounded-xl bg-cosmic-800/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Loi des Couronnes (Norme L₁)</span>
                                <span class="text-[10px] text-indigo-300 font-mono">|X| + |Y| = 2Z - 2</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">L₁ Crown Law / N(Z) = 8(Z-1)</div>
                            <p class="text-[11px] text-slate-400">176 entrées certifiées : 8 opérateurs centraux (0,0,Z) et 168 positions sur 6 couronnes (8, 16, 24, 32, 40, 48).</p>
                        </div>

                        <div class="term-card p-3.5 rounded-xl bg-cosmic-800/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Typologie Géométrique</span>
                                <span class="text-[10px] text-indigo-300 font-mono">Axiales • Diag. • Lat.</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Geometric Typology of Affects</div>
                            <p class="text-[11px] text-slate-400">Axiales (X=0 ou Y=0, instables), diagonales (|X|=|Y|, attracteurs métastables) et latérales (X≠0, Y≠0, |X|≠|Y|, dès Z≥3).</p>
                        </div>

                        <div class="term-card p-3.5 rounded-xl bg-cosmic-800/80 border border-slate-800 space-y-1">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-white">Symétries Antagonistes (84 paires)</span>
                                <span class="text-[10px] text-indigo-300 font-mono">Centrale / Controlatérale</span>
                            </div>
                            <div class="text-xs text-indigo-300 font-medium">Central &amp; Contralateral Inversion</div>
                            <p class="text-[11px] text-slate-400">Axes : (-X, -Y). Non-axial (diagonales &amp; latérales) : loi unifiée (-sgn(X)|Y|, -sgn(Y)|X|), permutant X et Y sur les latérales.</p>
                        </div>
                    </div>
                </div>

                <!-- Section 8 Prototypes Z=2 -->
                <div class="term-group" data-group="affects">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><polygon points="12 2 22 12 12 22 2 12 12 2"/></svg>
                        <span>Les 8 Prototypes de la Première Couronne (Z = 2)</span>
                    </h4>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Joie</div>
                            <div class="text-[11px] text-indigo-300 italic">Joy / Agency Gain</div>
                            <div class="text-[10px] text-slate-400 font-mono">(0, +2, 2) • Axial Y+</div>
                        </div>
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Tristesse</div>
                            <div class="text-[11px] text-indigo-300 italic">Sadness / Agency Loss</div>
                            <div class="text-[10px] text-slate-400 font-mono">(0, -2, 2) • Axial Y−</div>
                        </div>
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Courage</div>
                            <div class="text-[11px] text-indigo-300 italic">Courage / Epistemic Opening</div>
                            <div class="text-[10px] text-slate-400 font-mono">(+2, 0, 2) • Axial X+</div>
                        </div>
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Peur</div>
                            <div class="text-[11px] text-indigo-300 italic">Fear / Threat Rigidity</div>
                            <div class="text-[10px] text-slate-400 font-mono">(-2, 0, 2) • Axial X−</div>
                        </div>
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Désir</div>
                            <div class="text-[11px] text-indigo-300 italic">Desire / Positive Synergy</div>
                            <div class="text-[10px] text-slate-400 font-mono">(+1, +1, 2) • Diag.</div>
                        </div>
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Dégoût</div>
                            <div class="text-[11px] text-indigo-300 italic">Disgust / Negative Synergy</div>
                            <div class="text-[10px] text-slate-400 font-mono">(-1, -1, 2) • Diag.</div>
                        </div>
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Colère</div>
                            <div class="text-[11px] text-indigo-300 italic">Anger / Urgent Mobilization</div>
                            <div class="text-[10px] text-slate-400 font-mono">(-1, +1, 2) • Diag.</div>
                        </div>
                        <div class="term-card p-2.5 rounded-lg bg-cosmic-800/90 border border-slate-800 text-center space-y-0.5">
                            <div class="font-bold text-white">Calme</div>
                            <div class="text-[11px] text-indigo-300 italic">Calm / Trophotropic Release</div>
                            <div class="text-[10px] text-slate-400 font-mono">(+1, -1, 2) • Diag.</div>
                        </div>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-2.5">
                        Note : le <span class="text-slate-200 font-medium">Point de Veille (0, 0, 0)</span>, la <span class="text-slate-200 font-medium">Surprise (0, 0, 1)</span> et l'<span class="text-slate-200 font-medium">Anticipation (0, 0, 2)</span> forment les trois premiers opérateurs centraux hors couronne.
                    </p>
                </div>

                <!-- Section Citation -->
                <div class="term-group" data-group="citation">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                        <span>Formats de Citation Officiels (APA 7th)</span>
                    </h4>
                    <div class="p-4 rounded-xl bg-cosmic-800/90 border border-slate-800 space-y-4">
                        <div class="term-card space-y-1.5">
                            <span class="text-[11px] font-bold text-indigo-300 uppercase">1. Article Théorique (v1.0.1) :</span>
                            <p class="text-xs text-slate-300 leading-relaxed font-mono bg-cosmic-950 p-3 rounded-lg border border-slate-800/80" id="apaCitationText">
                                Cabelguen, M. (2026). <em>Cartographie des affects : une architecture hiérarchique de l’expérience affective fondée sur le traitement prédictif</em> (version v1.0.1, OPIC n° 1233199). Zenodo. https://doi.org/10.5281/zenodo.24022795
                            </p>
                        </div>
                        <div class="term-card space-y-1.5">
                            <span class="text-[11px] font-bold text-sky-300 uppercase">2. Vérification Formelle Lean 4 (v1.0.1) :</span>
                            <p class="text-xs text-slate-300 leading-relaxed font-mono bg-cosmic-950 p-3 rounded-lg border border-slate-800/80">
                                Cabelguen, M. (2026). <em>CARTOGRAFFECT: Architecture mathématique et taxonomique vérifiée sous Lean 4</em> (version v1.0.1) [Logiciel]. Zenodo. https://doi.org/10.5281/zenodo.23833938
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 pt-1">
                            <button onclick="copyCitationText()" id="copyCitationBtn" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                <span>Copier la référence APA de l'Article</span>
                            </button>
                            <a href="article.html" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all">
                                <span>Consulter l'Article en Ligne</span>
                            </a>
                            <span id="copySuccessNotice" class="text-xs text-emerald-400 hidden">Citation copiée dans le presse-papiers.</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Modal Footer -->
            <div class="p-4 border-t border-slate-800 bg-cosmic-850 flex items-center justify-between text-xs text-slate-400">
                <span>CARTOGRAFFECT&reg; &bull; OPIC n° 1233199 &bull; &copy; 2024–2026 Manuel Cabelguen</span>
                <button onclick="closeLangModal()" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer">
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
                    b.classList.remove("bg-indigo-600", "text-white");
                    b.classList.add("bg-slate-800", "text-slate-300");
                });
                btn.classList.add("bg-indigo-600", "text-white");
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

                document.querySelectorAll(".term-group").forEach(group => {
                    let anyVisible = false;
                    group.querySelectorAll(".term-card").forEach(card => {
                        const text = card.textContent.toLowerCase();
                        const match = text.includes(query);
                        card.classList.toggle("hidden", !match);
                        if (match) anyVisible = true;
                    });
                    group.classList.toggle("hidden", !anyVisible);
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
        const text = "Cabelguen, M. (2026). Cartographie des affects : une architecture hiérarchique de l’expérience affective fondée sur le traitement prédictif (version v1.0.1, OPIC n° 1233199). Zenodo. https://doi.org/10.5281/zenodo.24022795";
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
