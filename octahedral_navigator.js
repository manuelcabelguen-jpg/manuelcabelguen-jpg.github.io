/**
 * CARTOGRAFFECT - Navigateur Géométrique Octaédrique
 * Basé rigoureusement sur le document :
 * "Algorithme du système émotionnel par catégories et groupes" (Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien)
 * Discrétisation canonique Z ∈ {0,1,2} (11 états), profondeur continue Z ∈ [0,5], annexe exploratoire 176 états (Z=0..7)
 */

(function() {
    let currentZ = 2;
    let currentTypeFilter = 'all';
    let selectedAffectId = 8; // Joie par défaut (ID 3 est Émoi)

    const isEn = () => Boolean(window.CartograffectI18n && window.CartograffectI18n.getLang() === 'en');

    const strataMeta = {
        0: {
            title: "Point de Veille",
            titleEn: "Wake Point",
            subtitle: "Origine structurale du modèle",
            subtitleEn: "Structural origin of the model",
            operator: "Point de Veille (0,0,0)",
            r: 0,
            countText: "1 Entrée (Opérateur central)",
            countTextEn: "1 Entry (Central operator)",
            desc: "Strate Z=0 : Origine structurale du modèle affectif. État d'éveil fondamental neutre et potentiel d'activation.",
            descEn: "Stratum Z=0: Structural origin of the affective model. Neutral basal wakefulness state and activation potential.",
            formula: "Origine (0,0,0)",
            formulaEn: "Origin (0,0,0)"
        },
        1: {
            title: "Opérateur Surprise",
            titleEn: "Surprise Operator",
            subtitle: "Rupture & Saillance",
            subtitleEn: "Rupture & Salience",
            operator: "Surprise (0,0,1)",
            r: 0,
            countText: "1 Entrée (Opérateur ascendant)",
            countTextEn: "1 Entry (Ascending operator)",
            desc: "Strate Z=1 : Seule la Surprise (0,0,1) est présente. Opérateur ascendant de rupture et de saillance amorçant la trajectoire des huit prototypes sans constituer de couronne affective.",
            descEn: "Stratum Z=1: Only Surprise (0,0,1) is present. Ascending rupture and salience operator initiating the trajectory of the eight prototypes without forming an affective crown.",
            formula: "Opérateur (0,0,1)",
            formulaEn: "Operator (0,0,1)"
        },
        2: {
            title: "Prototypes Fondamentaux",
            titleEn: "Fundamental Prototypes",
            subtitle: "Première couronne (8 prototypes)",
            subtitleEn: "First crown (8 prototypes)",
            operator: "Anticipation (0,0,2)",
            r: 2,
            countText: "9 Entrées sur la strate (8 prototypes sur la couronne N(2)=8 + 1 opérateur central)",
            countTextEn: "9 Stratum Entries (8 crown prototypes N(2)=8 + 1 central operator)",
            desc: "Strate Z=2 : Première couronne de huit prototypes fondamentaux (Joie, Tristesse, Peur, Courage, Désir, Colère, Calme, Dégoût) organisée autour de l'Anticipation (0,0,2), opérateur central descendant d'orientation.",
            descEn: "Stratum Z=2: First crown of eight fundamental prototypes (Joy, Sadness, Fear, Courage, Desire, Anger, Calm, Disgust) organized around Anticipation (0,0,2), descending central orientation operator.",
            formula: "|X| + |Y| = 2 • N(2) = 8",
            formulaEn: "|X| + |Y| = 2 • N(2) = 8"
        },
        3: {
            title: "Émotions Réactives",
            titleEn: "Reactive Emotions",
            subtitle: "Couronne 3 • 16 positions",
            subtitleEn: "Crown 3 • 16 positions",
            operator: "Émoi (0,0,3)",
            r: 4,
            countText: "17 Entrées (1 op + 16 affects)",
            countTextEn: "17 Entries (1 op + 16 affects)",
            desc: "Strate Z=3 : Réponses réactives immédiates aux variations d'attente et de contrôle. Organisée autour de l'opérateur Émoi (0,0,3).",
            descEn: "Stratum Z=3: Immediate reactive responses to expectation and control shifts. Organized around the Stir (Émoi) operator (0,0,3).",
            formula: "|X| + |Y| = 4 • N(3) = 16",
            formulaEn: "|X| + |Y| = 4 • N(3) = 16"
        },
        4: {
            title: "États Relationnels",
            titleEn: "Relational States",
            subtitle: "Couronne 4 • 24 positions",
            subtitleEn: "Crown 4 • 24 positions",
            operator: "Réserve (0,0,4)",
            r: 6,
            countText: "25 Entrées (1 op + 24 affects)",
            countTextEn: "25 Entries (1 op + 24 affects)",
            desc: "Strate Z=4 : États émotionnels relationnels, interpersonnels et d'évaluation sociale (Amour, Haine, Fierté, Honte...). Opérateur central : Réserve (0,0,4).",
            descEn: "Stratum Z=4: Relational, interpersonal, and social appraisal states (Love, Hate, Pride, Shame...). Central operator: Reserve (0,0,4).",
            formula: "|X| + |Y| = 6 • N(4) = 24",
            formulaEn: "|X| + |Y| = 6 • N(4) = 24"
        },
        5: {
            title: "Dispositions Durables",
            titleEn: "Enduring Dispositions",
            subtitle: "Couronne 5 • 32 positions",
            subtitleEn: "Crown 5 • 32 positions",
            operator: "Recul (0,0,5)",
            r: 8,
            countText: "33 Entrées (1 op + 32 affects)",
            countTextEn: "33 Entries (1 op + 32 affects)",
            desc: "Strate Z=5 : Traits et humeurs affectives durables stabilisées (Confiance, Méfiance, Optimisme, Pessimisme...). Opérateur central : Recul (0,0,5).",
            descEn: "Stratum Z=5: Stabilized enduring affective traits and moods (Trust, Distrust, Optimism, Pessimism...). Central operator: Stepping Back (0,0,5).",
            formula: "|X| + |Y| = 8 • N(5) = 32",
            formulaEn: "|X| + |Y| = 8 • N(5) = 32"
        },
        6: {
            title: "Identités Affectives",
            titleEn: "Affective Identities",
            subtitle: "Couronne 6 • 40 positions",
            subtitleEn: "Crown 6 • 40 positions",
            operator: "Saisissement (0,0,6)",
            r: 10,
            countText: "41 Entrées (1 op + 40 affects)",
            countTextEn: "41 Entries (1 op + 40 affects)",
            desc: "Strate Z=6 : Identités affectives profondes et engagement existentiel (Élan, Inertie, Effacement, Affirmation...). Opérateur central : Saisissement (0,0,6).",
            descEn: "Stratum Z=6: Deep affective identities and existential engagement. Central operator: Saisissement (0,0,6).",
            formula: "|X| + |Y| = 10 • N(6) = 40",
            formulaEn: "|X| + |Y| = 10 • N(6) = 40"
        },
        7: {
            title: "Sentiments Transcendantaux",
            titleEn: "Transcendental Feelings",
            subtitle: "Couronne 7 • 48 positions",
            subtitleEn: "Crown 7 • 48 positions",
            operator: "Suspension (0,0,7)",
            r: 12,
            countText: "49 Entrées (1 op + 48 affects)",
            countTextEn: "49 Entries (1 op + 48 affects)",
            desc: "Strate Z=7 : Sentiments transcendantaux et contemplation au-delà du moi (Infini, Néant, Déréliction, Communion...). Opérateur central : Suspension (0,0,7).",
            descEn: "Stratum Z=7: Transcendental feelings and contemplation beyond the self (Infinity, Nothingness, Dereliction, Communion...). Central operator: Suspension (0,0,7).",
            formula: "|X| + |Y| = 12 • N(7) = 48",
            formulaEn: "|X| + |Y| = 12 • N(7) = 48"
        }
    };

    function initNavigator() {
        if (!window.CartograffectModel) {
            setTimeout(initNavigator, 100);
            return;
        }

        renderStrataPills();
        selectStrata(currentZ);

        window.addEventListener('cartograffect:lang-change', () => {
            renderStrataPills();
            updateStratumTexts(currentZ);
            updateAffectButtonsList();
            renderAffectDetails(selectedAffectId);
        });
    }

    function updateStratumTexts(z) {
        const en = isEn();
        const meta = strataMeta[z];
        const titleEl = document.getElementById('radarStrataTitle');
        const formulaEl = document.getElementById('radarFormulaBadge');
        const badgeEl = document.getElementById('strataBadge');
        const headingEl = document.getElementById('strataHeading');
        const countEl = document.getElementById('strataCount');
        const radiusEl = document.getElementById('strataManhattanRadius');
        const descEl = document.getElementById('strataDescription');

        const t = en ? meta.titleEn : meta.title;
        if (titleEl) titleEl.textContent = `${en ? 'Stratum' : 'Strate'} Z = ${z} : ${t}`;
        if (formulaEl) formulaEl.textContent = en ? meta.formulaEn : meta.formula;
        if (badgeEl) badgeEl.textContent = `${en ? 'STRATUM' : 'STRATE'} Z=${z} • ${t.toUpperCase()}`;
        if (headingEl) headingEl.textContent = `${en ? meta.subtitleEn : meta.subtitle} & ${en ? 'Operator' : 'Opérateur'} ${meta.operator}`;
        if (countEl) countEl.textContent = en ? meta.countTextEn : meta.countText;
        if (radiusEl) radiusEl.textContent = z >= 2
            ? `${en ? 'Manhattan Radius' : 'Rayon Manhattan'} r = 2Z - 2 = ${meta.r}`
            : (en ? 'Unique point / Operator' : 'Point unique / Opérateur');
        if (descEl) descEl.textContent = en ? meta.descEn : meta.desc;
    }

    function renderStrataPills() {
        const container = document.getElementById('strataPillsContainer');
        if (!container) return;
        const en = isEn();

        container.innerHTML = '';
        for (let z = 0; z <= 7; z++) {
            const meta = strataMeta[z];
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `strata-pill-btn px-4 py-2.5 rounded-xl border text-left whitespace-nowrap transition-all flex flex-col justify-center gap-0.5 ${
                z === currentZ 
                    ? 'bg-purple-900/60 border-purple-500/80 text-white shadow-lg shadow-purple-600/30' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`;
            if (z === 0) {
                btn.innerHTML = `
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs font-mono font-bold ${z === currentZ ? 'text-purple-300' : 'text-slate-400'}">Z = 0</span>
                        <span class="text-slate-500">&bull;</span>
                        <span class="text-xs font-semibold">${en ? meta.titleEn : meta.title}</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono">(r=0)</span>
                `;
            } else if (z === 1) {
                btn.innerHTML = `
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs font-mono font-bold ${z === currentZ ? 'text-purple-300' : 'text-slate-400'}">Z = 1</span>
                        <span class="text-slate-500">&bull;</span>
                        <span class="text-xs font-semibold">${en ? meta.titleEn : meta.title}</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono">(r=0)</span>
                `;
            } else {
                btn.innerHTML = `
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-mono font-bold ${z === currentZ ? 'text-purple-300' : 'text-slate-400'}">Z = ${z}</span>
                        <span class="text-xs font-semibold">${en ? meta.titleEn : meta.title}</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono">${meta.operator.split(' ')[0]} &bull; r=${meta.r}</span>
                `;
            }
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

        updateStratumTexts(z);

        // Choose default selected affect
        const strataAffects = window.CartograffectModel.emotions.filter(e => e.z === z);
        if (strataAffects.length > 0) {
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
            g.setAttribute("tabindex", "0");
            g.setAttribute("role", "button");
            g.setAttribute("aria-label", `${affect.name} (${affect.x}, ${affect.y}, Z=${affect.z})`);
            const activateNode = () => {
                selectedAffectId = affect.id;
                updateRadarSVG();
                updateAffectButtonsList();
                renderAffectDetails(affect.id);
            };
            g.onclick = activateNode;
            g.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateNode();
                }
            });

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
        const en = isEn();

        container.innerHTML = '';
        const allStrataAffects = window.CartograffectModel.emotions.filter(e => e.z === currentZ);
        const filtered = allStrataAffects.filter(e => currentTypeFilter === 'all' || e.type === currentTypeFilter);

        if (countSpan) {
            countSpan.textContent = en
                ? `${filtered.length} affect${filtered.length > 1 ? 's' : ''} shown`
                : `${filtered.length} affect${filtered.length > 1 ? 's' : ''} affiché${filtered.length > 1 ? 's' : ''}`;
        }

        filtered.forEach(affect => {
            const btn = document.createElement('button');
            btn.type = 'button';
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
        const en = isEn();

        const affect = window.CartograffectModel.getById(id) || window.CartograffectModel.emotions[0];
        const partner = window.CartograffectModel.getOpposite(affect.name);

        let typeBadge = "";
        if (affect.type === 'operator') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-900/60 text-purple-300 border border-purple-500/40">${en ? 'Central Operator' : 'Opérateur Central'}</span>`;
        else if (affect.type === 'axial') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-900/60 text-blue-300 border border-blue-500/40">${en ? 'Axial Position (X=0 or Y=0)' : 'Position Axiale (X=0 ou Y=0)'}</span>`;
        else if (affect.type === 'diagonal') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-pink-900/60 text-pink-300 border border-pink-500/40">${en ? 'Diagonal Position (|X|=|Y|)' : 'Position Diagonale (|X|=|Y|)'}</span>`;
        else if (affect.type === 'lateral') typeBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">${en ? 'Lateral Position' : 'Position Latérale'}</span>`;

        let correspondenceSection = '';
        if (partner) {
            let corrLabel = en ? "Axial Correspondence (-X, -Y, Z) [XY = 0]" : "Correspondance Axiale (-X, -Y, Z) [XY = 0]";
            if (partner.relation === 'diagonal') corrLabel = en ? "Diagonal Correspondence (-X, -Y, Z) [XY ≠ 0, |X| = |Y|]" : "Correspondance Diagonale (-X, -Y, Z) [XY ≠ 0, |X| = |Y|]";
            else if (partner.relation === 'controlateral') corrLabel = en ? "Contralateral Correspondence (-sgn(X)|Y|, -sgn(Y)|X|, Z) [XY ≠ 0]" : "Correspondance Controlatérale (-sgn(X)|Y|, -sgn(Y)|X|, Z) [XY ≠ 0]";

            correspondenceSection = `
                <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-purple-400 font-bold uppercase tracking-wider text-[10px]">${corrLabel}</span>
                        <span class="text-[10px] font-mono text-slate-400">${en ? 'Official symmetry' : 'Symétrie officielle'}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                            </span>
                            <div>
                                <div class="text-sm font-bold text-white">${partner.name}</div>
                                <div class="text-[11px] font-mono text-indigo-300">${partner.code} &bull; (${partner.x}, ${partner.y}, Z${partner.z})</div>
                            </div>
                        </div>
                        <button type="button" onclick="window.OctahedralNav.switchPartner('${partner.name}')" class="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/60 border border-purple-500/40 text-purple-200 transition-colors">
                            ${en ? 'View partner' : 'Voir le partenaire'} &rarr;
                        </button>
                    </div>
                </div>
            `;
        }

        // Geometric interpretation breakdown
        const xSign = affect.x > 0
            ? (en ? "Positive revisability (+X, epistemic flexibility / updating)" : "Révisabilité positive (+X, souplesse épistémique / mise à jour)")
            : (affect.x < 0
                ? (en ? "Negative revisability (-X, cognitive rigidity / retention)" : "Révisabilité négative (-X, rigidité cognitive / maintien)")
                : (en ? "Epistemic neutral (X=0)" : "Neutre épistémique (X=0)"));
        const ySign = affect.y > 0
            ? (en ? "Perceived controllability (+Y, pragmatic action / alignment)" : "Contrôlabilité perçue (+Y, action pragmatique / alignement)")
            : (affect.y < 0
                ? (en ? "Unmodifiable world (-Y, acceptance / adaptive withdrawal)" : "Monde non modifiable (-Y, acceptation / repli adaptatif)")
                : (en ? "Pragmatic neutral (Y=0)" : "Neutre pragmatique (Y=0)"));

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
                    <div class="text-xs font-mono font-bold text-slate-300">${en ? 'Group' : 'Groupe'} ${affect.group}</div>
                    <div class="text-[11px] font-mono text-purple-300">${en ? 'Stratum' : 'Strate'} Z = ${affect.z}</div>
                </div>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed italic">
                "${affect.desc}"
            </p>

            <!-- Vector coordinates breakdown -->
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div class="text-[10px] uppercase font-bold text-sky-400">${en ? 'X Axis: Expectation' : 'Axe X : Attente'}</div>
                    <div class="font-mono text-white font-semibold">X = ${affect.x}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${xSign}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div class="text-[10px] uppercase font-bold text-purple-400">${en ? 'Y Axis: Control' : 'Axe Y : Contrôle'}</div>
                    <div class="font-mono text-white font-semibold">Y = ${affect.y}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${ySign}</div>
                </div>
            </div>

            ${correspondenceSection}

            <!-- Accès direct à la Matrice 2D/3D -->
            <div class="pt-2 flex flex-wrap items-center gap-2">
                <a href="taxonomie-affective.html?highlight=${encodeURIComponent(affect.name)}&z=${affect.z}" class="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all inline-flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                    <span>${en ? 'Explore in the 176-State Map (Exploratory Annex)' : 'Explorer dans l\'Annexe Exploratoire 176 États'}</span>
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
