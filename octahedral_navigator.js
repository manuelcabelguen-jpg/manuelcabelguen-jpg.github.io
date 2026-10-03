/**
 * CARTOGRAFFECT - Navigateur Géométrique Octaédrique
 * Basé rigoureusement sur le document :
 * "Algorithme du système émotionnel par catégories et groupes" (Dr Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien)
 * 176 entrées (8 opérateurs centraux + 80 positions sur couronnes Z=2..7)
 */

(function() {
    let currentZ = 2;
    let currentTypeFilter = 'all';
    let selectedAffectId = 3; // Joie par défaut

    const strataMeta = {
        0: {
            title: "Point de Veille",
            subtitle: "Origine structurale du modèle",
            operator: "Point de Veille (0,0,0)",
            r: 0,
            countText: "1 Entrée (Opérateur central)",
            desc: "Strate Z=0 : Origine structurale du modèle affectif. État d'éveil fondamental neutre et potentiel d'activation.",
            formula: "Origine (0,0,0)"
        },
        1: {
            title: "Opérateur Surprise",
            subtitle: "Rupture & Saillance",
            operator: "Surprise (0,0,1)",
            r: 0,
            countText: "1 Entrée (Opérateur ascendant)",
            desc: "Strate Z=1 : Seule la Surprise (0,0,1) est présente. Opérateur ascendant de rupture et de saillance amorçant la trajectoire des huit prototypes sans constituer de couronne affective.",
            formula: "Opérateur (0,0,1)"
        },
        2: {
            title: "Prototypes Fondamentaux",
            subtitle: "Noyau affectif & Première couronne",
            operator: "Anticipation (0,0,2)",
            r: 2,
            countText: "9 Entrées (1 op + 8 prototypes)",
            desc: "Strate Z=2 : Première couronne de huit prototypes fondamentaux (Joie, Tristesse, Peur, Courage, Désir, Colère, Calme, Dégoût) organisée autour de l'Anticipation (0,0,2), opérateur central descendant d'orientation.",
            formula: "|X| + |Y| = 2 • N(2) = 8"
        },
        3: {
            title: "Émotions Réactives",
            subtitle: "Couronne 3 • 16 positions",
            operator: "Émoi (0,0,3)",
            r: 4,
            countText: "17 Entrées (1 op + 16 affects)",
            desc: "Strate Z=3 : Réponses réactives immédiates aux variations d'attente et de contrôle. Organisée autour de l'opérateur Émoi (0,0,3).",
            formula: "|X| + |Y| = 4 • N(3) = 16"
        },
        4: {
            title: "États Relationnels",
            subtitle: "Couronne 4 • 24 positions",
            operator: "Réserve (0,0,4)",
            r: 6,
            countText: "25 Entrées (1 op + 24 affects)",
            desc: "Strate Z=4 : États émotionnels relationnels, interpersonnels et d'évaluation sociale (Amour, Haine, Fierté, Honte...). Opérateur central : Réserve (0,0,4).",
            formula: "|X| + |Y| = 6 • N(4) = 24"
        },
        5: {
            title: "Dispositions Durables",
            subtitle: "Couronne 5 • 32 positions",
            operator: "Recul (0,0,5)",
            r: 8,
            countText: "33 Entrées (1 op + 32 affects)",
            desc: "Strate Z=5 : Traits et humeurs affectives durables stabilisées (Confiance, Méfiance, Optimisme, Pessimisme...). Opérateur central : Recul (0,0,5).",
            formula: "|X| + |Y| = 8 • N(5) = 32"
        },
        6: {
            title: "Identités Affectives",
            subtitle: "Couronne 6 • 40 positions",
            operator: "Saisie / Saisissement (0,0,6)",
            r: 10,
            countText: "41 Entrées (1 op + 40 affects)",
            desc: "Strate Z=6 : Identités affectives profondes et engagement existentiel (Élan, Inertie, Effacement, Affirmation...). Opérateur central : Saisie / Saisissement (0,0,6).",
            formula: "|X| + |Y| = 10 • N(6) = 40"
        },
        7: {
            title: "Sentiments Transcendantaux",
            subtitle: "Couronne 7 • 48 positions",
            operator: "Suspension (0,0,7)",
            r: 12,
            countText: "49 Entrées (1 op + 48 affects)",
            desc: "Strate Z=7 : Sentiments transcendantaux et contemplation au-delà du moi (Infini, Néant, Déréliction, Communion...). Opérateur central : Suspension (0,0,7).",
            formula: "|X| + |Y| = 12 • N(7) = 48"
        }
    };

    function initNavigator() {
        if (!window.CartograffectModel) {
            setTimeout(initNavigator, 100);
            return;
        }

        renderStrataPills();
        selectStrata(currentZ);
    }

    function renderStrataPills() {
        const container = document.getElementById('strataPillsContainer');
        if (!container) return;

        container.innerHTML = '';
        for (let z = 0; z <= 7; z++) {
            const meta = strataMeta[z];
            const btn = document.createElement('button');
            btn.className = `strata-pill-btn px-4 py-2.5 rounded-xl border text-left whitespace-nowrap transition-all flex flex-col justify-center gap-0.5 ${
                z === currentZ 
                    ? 'bg-purple-900/60 border-purple-500/80 text-white shadow-lg shadow-purple-600/30' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`;
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold ${z === currentZ ? 'text-purple-300' : 'text-slate-400'}">Z = ${z}</span>
                    <span class="text-xs font-semibold">${meta.title}</span>
                </div>
                <span class="text-[10px] text-slate-400 font-mono">${meta.operator.split(' ')[0]} ${z >= 2 ? `&bull; r=${meta.r}` : ''}</span>
            `;
            btn.onclick = () => selectStrata(z);
            btn.id = `pill-z-${z}`;
            container.appendChild(btn);
        }
    }

    function selectStrata(z) {
        currentZ = z;
        currentTypeFilter = 'all';

        // Update pills active styling
        for (let i = 0; i <= 7; i++) {
            const pill = document.getElementById(`pill-z-${i}`);
            if (pill) {
                if (i === z) {
                    pill.className = "strata-pill-btn px-4 py-2.5 rounded-xl border text-left whitespace-nowrap transition-all flex flex-col justify-center gap-0.5 bg-purple-900/60 border-purple-500/80 text-white shadow-lg shadow-purple-600/30";
                } else {
                    pill.className = "strata-pill-btn px-4 py-2.5 rounded-xl border text-left whitespace-nowrap transition-all flex flex-col justify-center gap-0.5 bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700";
                }
            }
        }

        // Reset typology buttons
        document.querySelectorAll('.geo-type-btn').forEach(b => {
            if (b.dataset.type === 'all') {
                b.className = "geo-type-btn active px-2.5 py-1 rounded text-xs font-semibold bg-purple-600 text-white";
            } else {
                b.className = "geo-type-btn px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white";
            }
        });

        // Update texts
        const meta = strataMeta[z];
        document.getElementById('radarStrataTitle').textContent = `Strate Z = ${z} : ${meta.title}`;
        document.getElementById('radarFormulaBadge').textContent = meta.formula;
        document.getElementById('strataBadge').textContent = `STRATE Z=${z} • ${meta.title.toUpperCase()}`;
        document.getElementById('strataHeading').textContent = `${meta.subtitle} & Opérateur ${meta.operator.split(' ')[0]}`;
        document.getElementById('strataCount').textContent = meta.countText;
        document.getElementById('strataManhattanRadius').textContent = z >= 2 ? `Rayon Manhattan r = 2Z - 2 = ${meta.r}` : 'Point unique / Opérateur';
        document.getElementById('strataDescription').textContent = meta.desc;

        // Choose default selected affect
        const strataAffects = window.CartograffectModel.emotions.filter(e => e.z === z);
        if (strataAffects.length > 0) {
            // Find operator or first axial
            const op = strataAffects.find(e => e.type === 'operator');
            const first = strataAffects.find(e => e.type === 'axial') || strataAffects[0];
            selectedAffectId = (z === 0 || z === 1) ? op.id : first.id;
        }

        updateRadarSVG();
        updateAffectButtonsList();
        renderAffectDetails(selectedAffectId);
    }

    function updateRadarSVG() {
        const diamondGroup = document.getElementById('radarDiamondGroup');
        const pointsGroup = document.getElementById('radarPointsGroup');
        if (!diamondGroup || !pointsGroup) return;

        diamondGroup.innerHTML = '';
        pointsGroup.innerHTML = '';

        const meta = strataMeta[currentZ];
        const r = meta.r;

        // Draw Manhattan diamond if r > 0
        if (r > 0) {
            const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            diamond.setAttribute("points", `0,${-r} ${r},0 0,${r} ${-r},0`);
            diamond.setAttribute("fill", "rgba(59, 130, 246, 0.05)");
            diamond.setAttribute("stroke", "#60a5fa");
            diamond.setAttribute("stroke-width", "0.2");
            diamond.setAttribute("stroke-dasharray", "0.6, 0.4");
            diamondGroup.appendChild(diamond);

            // Connective diagonal guides
            const diag1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            diag1.setAttribute("x1", `${-r * 0.7}`); diag1.setAttribute("y1", `${-r * 0.7}`);
            diag1.setAttribute("x2", `${r * 0.7}`); diag1.setAttribute("y2", `${r * 0.7}`);
            diag1.setAttribute("stroke", "#475569"); diag1.setAttribute("stroke-width", "0.1"); diag1.setAttribute("stroke-dasharray", "0.4, 0.4");
            diamondGroup.appendChild(diag1);

            const diag2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            diag2.setAttribute("x1", `${-r * 0.7}`); diag2.setAttribute("y1", `${r * 0.7}`);
            diag2.setAttribute("x2", `${r * 0.7}`); diag2.setAttribute("y2", `${-r * 0.7}`);
            diag2.setAttribute("stroke", "#475569"); diag2.setAttribute("stroke-width", "0.1"); diag2.setAttribute("stroke-dasharray", "0.4, 0.4");
            diamondGroup.appendChild(diag2);
        }

        // Draw points of current stratum
        const allStrataAffects = window.CartograffectModel.emotions.filter(e => e.z === currentZ);
        const filteredAffects = allStrataAffects.filter(e => currentTypeFilter === 'all' || e.type === currentTypeFilter);

        // Highlight selected affect's vector line
        const sel = window.CartograffectModel.getById(selectedAffectId);
        if (sel && sel.z === currentZ && (sel.x !== 0 || sel.y !== 0)) {
            const vectorLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            vectorLine.setAttribute("x1", "0");
            vectorLine.setAttribute("y1", "0");
            vectorLine.setAttribute("x2", `${sel.x}`);
            vectorLine.setAttribute("y2", `${-sel.y}`);
            vectorLine.setAttribute("stroke", "#f472b6");
            vectorLine.setAttribute("stroke-width", "0.25");
            vectorLine.setAttribute("stroke-dasharray", "0.5, 0.3");
            pointsGroup.appendChild(vectorLine);
        }

        allStrataAffects.forEach(affect => {
            const isSelected = affect.id === selectedAffectId;
            const isDimmed = currentTypeFilter !== 'all' && affect.type !== currentTypeFilter;

            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", "cursor-pointer");
            g.onclick = () => {
                selectedAffectId = affect.id;
                updateRadarSVG();
                updateAffectButtonsList();
                renderAffectDetails(affect.id);
            };

            // Halo glow for selected
            if (isSelected) {
                const glowCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                glowCircle.setAttribute("cx", `${affect.x}`);
                glowCircle.setAttribute("cy", `${-affect.y}`);
                glowCircle.setAttribute("r", "1.2");
                glowCircle.setAttribute("fill", "rgba(240, 171, 252, 0.35)");
                g.appendChild(glowCircle);
            }

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", `${affect.x}`);
            circle.setAttribute("cy", `${-affect.y}`);
            circle.setAttribute("r", affect.type === 'operator' ? "0.6" : (isSelected ? "0.65" : "0.45"));

            // Point Color based on type
            let fillColor = "#94a3b8";
            if (affect.type === 'operator') fillColor = "#c084fc";
            else if (affect.type === 'axial') fillColor = "#60a5fa";
            else if (affect.type === 'diagonal') fillColor = "#f472b6";
            else if (affect.type === 'lateral') fillColor = "#34d399";

            circle.setAttribute("fill", fillColor);
            circle.setAttribute("stroke", isSelected ? "#ffffff" : "#1e293b");
            circle.setAttribute("stroke-width", isSelected ? "0.15" : "0.08");
            circle.setAttribute("opacity", isDimmed ? "0.25" : "1");
            g.appendChild(circle);

            // Label for key points or selected
            if (isSelected || affect.type === 'operator' || affect.type === 'axial' || currentZ <= 3) {
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", `${affect.x}`);
                text.setAttribute("y", `${-affect.y + (affect.y >= 0 ? 0.9 : -0.7)}`);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-size", isSelected ? "0.65" : "0.45");
                text.setAttribute("font-weight", isSelected ? "bold" : "normal");
                text.setAttribute("fill", isSelected ? "#ffffff" : (isDimmed ? "#64748b" : "#cbd5e1"));
                text.setAttribute("letter-spacing", "0.02");
                text.textContent = affect.name;
                g.appendChild(text);
            }

            pointsGroup.appendChild(g);
        });
    }

    function updateAffectButtonsList() {
        const container = document.getElementById('strataAffectButtons');
        const countSpan = document.getElementById('currentListCount');
        if (!container) return;

        container.innerHTML = '';
        const allStrataAffects = window.CartograffectModel.emotions.filter(e => e.z === currentZ);
        const filtered = allStrataAffects.filter(e => currentTypeFilter === 'all' || e.type === currentTypeFilter);

        countSpan.textContent = `${filtered.length} affect${filtered.length > 1 ? 's' : ''} affiché${filtered.length > 1 ? 's' : ''}`;

        filtered.forEach(affect => {
            const btn = document.createElement('button');
            const isSelected = affect.id === selectedAffectId;

            let badgeColor = "border-slate-700 bg-slate-800 text-slate-300";
            if (affect.type === 'operator') badgeColor = "border-purple-500/40 bg-purple-950/40 text-purple-300";
            else if (affect.type === 'axial') badgeColor = "border-blue-500/40 bg-blue-950/40 text-blue-300";
            else if (affect.type === 'diagonal') badgeColor = "border-pink-500/40 bg-pink-950/40 text-pink-300";
            else if (affect.type === 'lateral') badgeColor = "border-emerald-500/40 bg-emerald-950/40 text-emerald-300";

            btn.className = `px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                isSelected 
                    ? '!bg-gradient-to-r !from-purple-600 !to-indigo-600 !border-purple-400 !text-white font-bold shadow-md' 
                    : `${badgeColor} hover:border-slate-500 hover:text-white`
            }`;
            btn.innerHTML = `
                <span>${affect.name}</span>
                <span class="text-[9px] font-mono opacity-80">(${affect.x},${affect.y})</span>
            `;
            btn.onclick = () => {
                selectedAffectId = affect.id;
                updateRadarSVG();
                updateAffectButtonsList();
                renderAffectDetails(affect.id);
            };
            container.appendChild(btn);
        });
    }

    function renderAffectDetails(id) {
        const card = document.getElementById('affectDetailCard');
        if (!card) return;

        const affect = window.CartograffectModel.getById(id) || window.CartograffectModel.emotions[0];
        const partner = window.CartograffectModel.getOpposite(affect.name);

        let typeBadge = "";
        if (affect.type === 'operator') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-900/60 text-purple-300 border border-purple-500/40">Opérateur Central</span>`;
        else if (affect.type === 'axial') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-900/60 text-blue-300 border border-blue-500/40">Position Axiale (X=0 ou Y=0)</span>`;
        else if (affect.type === 'diagonal') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-pink-900/60 text-pink-300 border border-pink-500/40">Position Diagonale (|X|=|Y|)</span>`;
        else if (affect.type === 'lateral') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">Position Latérale</span>`;

        let correspondenceSection = '';
        if (partner) {
            let corrLabel = "Correspondance Axiale (-X,-Y)";
            if (partner.relation === 'diagonal') corrLabel = "Correspondance Diagonale (-X,-Y)";
            else if (partner.relation === 'controlateral') corrLabel = "Correspondance Controlatérale (Croisements Td / Ti)";

            correspondenceSection = `
                <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-purple-400 font-bold uppercase tracking-wider text-[10px]">${corrLabel}</span>
                        <span class="text-[10px] font-mono text-slate-400">Symétrie officielle</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">↔️</span>
                            <div>
                                <div class="text-sm font-bold text-white">${partner.name}</div>
                                <div class="text-[11px] font-mono text-indigo-300">${partner.code} &bull; (${partner.x}, ${partner.y}, Z${partner.z})</div>
                            </div>
                        </div>
                        <button onclick="window.OctahedralNav.switchPartner('${partner.name}')" class="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/60 border border-purple-500/40 text-purple-200 transition-colors">
                            Voir le partenaire &rarr;
                        </button>
                    </div>
                </div>
            `;
        }

        // Geometric interpretation breakdown
        const xSign = affect.x > 0 ? "Révisabilité positive (+X, souplesse épistémique / mise à jour)" : (affect.x < 0 ? "Révisabilité négative (-X, rigidité cognitive / maintien)" : "Neutre épistémique (X=0)");
        const ySign = affect.y > 0 ? "Contrôlabilité perçue (+Y, action pragmatique / alignement)" : (affect.y < 0 ? "Monde non modifiable (-Y, acceptation / repli adaptatif)" : "Neutre pragmatique (Y=0)");

        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        ${typeBadge}
                        <span class="text-xs font-mono text-slate-400">ID #${affect.id}</span>
                    </div>
                    <h4 class="text-2xl font-heading font-black text-white flex items-center gap-2">
                        <span>${affect.name}</span>
                        <span class="text-sm font-mono font-bold text-purple-400">(${affect.code})</span>
                    </h4>
                </div>
                <div class="text-right">
                    <div class="text-xs font-mono font-bold text-slate-300">Groupe ${affect.group}</div>
                    <div class="text-[11px] font-mono text-purple-300">Strate Z = ${affect.z}</div>
                </div>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed italic">
                "${affect.desc}"
            </p>

            <!-- Vector coordinates breakdown -->
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div class="text-[10px] uppercase font-bold text-sky-400">Axe X : Attente</div>
                    <div class="font-mono text-white font-semibold">X = ${affect.x}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${xSign}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div class="text-[10px] uppercase font-bold text-purple-400">Axe Y : Contrôle</div>
                    <div class="font-mono text-white font-semibold">Y = ${affect.y}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${ySign}</div>
                </div>
            </div>

            ${correspondenceSection}

            <!-- Direct Bridges to the 3 Territories -->
            <div class="pt-2 flex flex-wrap items-center gap-2">
                <a href="emotions.html?highlight=${encodeURIComponent(affect.name)}&z=${affect.z}" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5">
                    <span>🧭</span> Ouvrir dans la Matrice 2D/3D
                </a>
                <a href="crimes.html" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/50 hover:bg-rose-900 border border-rose-600/30 transition-colors flex items-center gap-1.5">
                    <span>⚡</span> Territoire C.R.I.M.E.S.
                </a>
                <a href="miracles.html" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-600/30 transition-colors flex items-center gap-1.5">
                    <span>✨</span> Régulation M.I.R.A.C.L.E.S.
                </a>
            </div>
        `;
    }

    // Public API on window
    window.OctahedralNav = {
        selectStrata: selectStrata,
        filterByType: function(type) {
            currentTypeFilter = type;
            document.querySelectorAll('.geo-type-btn').forEach(b => {
                if (b.dataset.type === type) {
                    b.className = "geo-type-btn active px-2.5 py-1 rounded text-xs font-semibold bg-purple-600 text-white";
                } else {
                    b.className = "geo-type-btn px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white";
                }
            });
            updateRadarSVG();
            updateAffectButtonsList();
        },
        switchPartner: function(partnerName) {
            const p = window.CartograffectModel.getByName(partnerName);
            if (p) {
                if (p.z !== currentZ) {
                    selectStrata(p.z);
                }
                selectedAffectId = p.id;
                updateRadarSVG();
                updateAffectButtonsList();
                renderAffectDetails(p.id);
            }
        }
    };

    window.filterRadarByType = window.OctahedralNav.filterByType;

    document.addEventListener("DOMContentLoaded", initNavigator);
})();
