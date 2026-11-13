/**
 * CARTOGRAFFECT® — Noyau Computationnel & Formalisation Lean 4 (Module JS)
 * Traduction fidèle des quatre modules mécanisés sous Lean 4.35 :
 *   1. PredictiveEngine.lean  (Moteur prédictif : interfaces, hystérésis, couplages A/C)
 *   2. CoreAffect.lean        (Noyau affectif : coordonnées X/Y/Z, norme L1, typologie)
 *   3. AffectiveMatrix.lean   (Matrice affective : régimes énergétiques, valence lexicographique)
 *   4. AffectiveTaxonomy.lean (Taxonomie affective : 9 groupes, 17 sous-secteurs, dissipation)
 *
 * Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien • OPIC n° 1233199
 */

(function (root) {
    'use strict';

    const CartograffectTheory = {};

    // =========================================================================
    // 1. PREDICTIVE ENGINE (PredictiveEngine.lean)
    // =========================================================================

    CartograffectTheory.polarityToRegime = function (pol) {
        if (pol === 'neg') return 'charge';
        if (pol === 'pos') return 'discharge';
        return 'neutral';
    };

    CartograffectTheory.polarityToInt = function (pol) {
        if (pol === 'neg') return -1;
        if (pol === 'pos') return 1;
        return 0;
    };

    CartograffectTheory.polarityLabel = function (pol, axis) {
        if (axis === 'A') {
            if (pol === 'pos') return { code: 'A+', title: 'Attente Certaine', regime: 'Décharge épistémique', desc: 'Modèle interne révisable : mise à jour des croyances possible.' };
            if (pol === 'neg') return { code: 'A−', title: 'Attente Incertaine', regime: 'Charge épistémique', desc: 'Modèle interne non révisable : maintien / coût d’accommodation élevé.' };
            return { code: 'A0', title: 'Attente Neutre', regime: 'Neutre (sous seuil)', desc: 'Flux conformes aux croyances d’arrière-plan, aucune saillance épistémique.' };
        }
        if (pol === 'pos') return { code: 'C+', title: 'Contrôle Certain', regime: 'Décharge pragmatique', desc: 'Situation contrôlable : action motrice contributive possible.' };
        if (pol === 'neg') return { code: 'C−', title: 'Contrôle Incertain', regime: 'Charge pragmatique', desc: 'Situation non contrôlable : réduction ou suspension de l’effort.' };
        return { code: 'C0', title: 'Contrôle Neutre', regime: 'Neutre (sous seuil)', desc: 'Régime de contrôle de routine sous le seuil de saillance.' };
    };

    /**
     * Évalue l'état complet du Moteur Prédictif selon PredictiveEngine.lean & CoreAffect.lean
     * Supporte :
     *   - strictness Lean 4 (`projectToCoreAffect` + `remanence_preserves_state`)
     *   - profondeur `persistenceDepth` (d = 0..5 -> Z = 2..7)
     *   - extension pédagogique optionnelle `weightRatioA` (0..1) pour l'asymétrie (π_A, π_C)
     */
    CartograffectTheory.evaluateEngine = function (params) {
        const magnitude = Number(params.magnitude || 0);
        const sensoryThreshold = Number(params.sensoryThreshold || 4);
        const resorptionThreshold = Math.min(Number(params.resorptionThreshold || 2), sensoryThreshold);
        const allocatedPrecision = Number(params.allocatedPrecision || 0);
        const engagementThreshold = Number(params.engagementThreshold || 4);
        const attente = params.attente || 'zero';
        const controle = params.controle || 'zero';
        const descendingSuspension = Boolean(params.descendingSuspension);
        const persistenceDepth = Math.max(0, Math.min(5, Math.floor(Number(params.persistenceDepth || 0))));
        const continuousAsymmetry = Boolean(params.continuousAsymmetry);
        const weightRatioA = params.weightRatioA !== undefined ? Math.max(0.05, Math.min(0.95, Number(params.weightRatioA))) : 0.5;

        const isSensorilySalient = magnitude >= sensoryThreshold;
        const isInRemanenceWindow = magnitude >= resorptionThreshold && magnitude < sensoryThreshold;
        const isBelowResorption = magnitude < resorptionThreshold;
        const isAttentionalEngaged = allocatedPrecision >= engagementThreshold;

        const aEngaged = attente !== 'zero';
        const cEngaged = controle !== 'zero';
        const targetZ = 2 + persistenceDepth;
        const radius = 2 * targetZ - 2; // R(Z) = 2Z - 2

        const computeCrownCoords = () => {
            if (!aEngaged && !cEngaged) return { x: 0, y: 0 };
            if (aEngaged && !cEngaged) return { x: this.polarityToInt(attente) * radius, y: 0 };
            if (!aEngaged && cEngaged) return { x: 0, y: this.polarityToInt(controle) * radius };
            // Both engaged: strict Lean splits equally R/2 = Z - 1; continuous asymmetry shares R by weightRatioA
            let ax = radius / 2;
            if (continuousAsymmetry && targetZ >= 3) {
                ax = Math.max(1, Math.min(radius - 1, Math.round(radius * weightRatioA)));
            }
            const ay = radius - ax;
            return {
                x: this.polarityToInt(attente) * ax,
                y: this.polarityToInt(controle) * ay
            };
        };

        let stage = 'veille';
        let stageLabel = 'Point de Veille (0, 0, 0)';
        let stageDesc = 'Régime homéostatique basal : l’écart demeure sous le seuil de tolérance ou en neutralité globale (A0, C0).';
        let x = 0, y = 0, z = 0;

        if (isBelowResorption) {
            stage = 'veille';
            stageLabel = 'Point de Veille (0, 0, 0)';
            stageDesc = 'Écart inférieur au seuil de résorption homéostatique : retour ou maintien au Point de Veille (0, 0, 0).';
            x = 0; y = 0; z = 0;
        } else if (isInRemanenceWindow) {
            if (aEngaged || cEngaged) {
                const held = computeCrownCoords();
                x = held.x; y = held.y; z = targetZ;
                stage = 'remanence';
                stageLabel = 'Rémanence Allostatique (' + x + ', ' + y + ', ' + z + ')';
                stageDesc = 'Hystérésis (remanence_preserves_state) : l’écart (' + magnitude + ') est repassé sous le seuil sensoriel (' + sensoryThreshold + ') mais reste ≥ résorption (' + resorptionThreshold + '), maintenant l’état actif.';
            } else {
                stage = 'remanence_neutral';
                stageLabel = 'Point de Veille (0, 0, 0) — Zone d’hystérésis';
                stageDesc = 'La magnitude est dans la fenêtre d’hystérésis [' + resorptionThreshold + ', ' + sensoryThreshold + '[ mais le couplage est neutre (A0, C0) : aucun état périphérique à maintenir.';
                x = 0; y = 0; z = 0;
            }
        } else if (isSensorilySalient && !aEngaged && !cEngaged) {
            // CoreAffect.lean L264: !isSensorilySalient || c.isGlobalNeutrality => Point de Veille (0,0,0)
            stage = 'veille';
            stageLabel = 'Point de Veille (0, 0, 0)';
            stageDesc = 'Couplage globalement neutre (A0, C0) : selon CoreAffect.lean, la neutralité globale conjointe n’active pas la couronne et reste au Point de Veille (0, 0, 0). Choisissez une polarité A ou C pour rompre la veille.';
            x = 0; y = 0; z = 0;
        } else if (isSensorilySalient && !isAttentionalEngaged) {
            if (descendingSuspension) {
                x = 0; y = 0; z = targetZ;
                stage = 'anticipation';
                stageLabel = (targetZ === 2 ? 'Anticipation' : 'Opérateur Central Z=' + z) + ' (0, 0, ' + z + ')';
                stageDesc = 'Suspension descendante (CoreAffect.lean L267) : l’Interface Subjective retient le déploiement avant l’engagement attentionnel et place le système sur l’opérateur central d’orientation (0, 0, ' + z + ').';
            } else {
                x = 0; y = 0; z = 1;
                stage = 'surprise';
                stageLabel = 'Surprise (0, 0, 1)';
                stageDesc = 'Rupture ascendante : l’écart franchit le seuil sensoriel (' + sensoryThreshold + '), mais la précision attentionnelle (' + allocatedPrecision + ' < ' + engagementThreshold + ') reste sous le seuil d’engagement sans suspension descendante.';
            }
        } else if (isSensorilySalient && isAttentionalEngaged) {
            const pt = computeCrownCoords();
            x = pt.x; y = pt.y; z = targetZ;
            const gType = this.geometryType(x, y);
            if (gType === 'axial') {
                stage = 'deployed_axial';
                stageLabel = 'Déploiement Axial Z=' + z + ' (' + x + ', ' + y + ', ' + z + ')';
                stageDesc = (aEngaged ? 'Seule Attente (A)' : 'Seul Contrôle (C)') + ' est tranché : il capte tout le budget attentionnel L₁ = ' + radius + '.';
            } else if (gType === 'diagonal') {
                stage = 'deployed_diagonal';
                stageLabel = 'Déploiement Diagonal Z=' + z + ' (' + x + ', ' + y + ', ' + z + ')';
                stageDesc = 'Les deux dimensions (A et C) sont tranchées à parts égales : |X| = |Y| = ' + (radius / 2) + '.';
            } else {
                stage = 'deployed_lateral';
                stageLabel = 'Déploiement Latéral Z=' + z + ' (' + x + ', ' + y + ', ' + z + ')';
                stageDesc = 'Extension par asymétrie de précision (π_A / π_C) : répartition inégale sur la couronne |X|+|Y| = ' + radius + '.';
            }
        }

        // Recherche du prototype / état correspondant si disponible dans CartograffectModel
        let matchedPrototype = null;
        if (root.CartograffectModel && Array.isArray(root.CartograffectModel.emotions)) {
            matchedPrototype = root.CartograffectModel.emotions.find(
                e => e.x === x && e.y === y && e.z === z
            ) || null;
        }

        return {
            stage,
            stageLabel,
            stageDesc,
            isSensorilySalient,
            isInRemanenceWindow,
            isAttentionalEngaged,
            descendingSuspension,
            persistenceDepth,
            coupling: { attente, controle },
            regimes: {
                attente: this.polarityToRegime(attente),
                controle: this.polarityToRegime(controle)
            },
            coords: { x, y, z },
            budgetL1: Math.abs(x) + Math.abs(y),
            matchedPrototype
        };
    };

    // =========================================================================
    // 2. CORE AFFECT (CoreAffect.lean)
    // =========================================================================

    CartograffectTheory.crownRadius = function (z) {
        const zn = Number(z);
        return zn < 2 ? 0 : 2 * zn - 2;
    };

    CartograffectTheory.crownCount = function (z) {
        const zn = Number(z);
        return zn < 2 ? 1 : 8 * (zn - 1);
    };

    CartograffectTheory.geometryType = function (x, y) {
        if (x === 0 && y === 0) return 'operator';
        if (x === 0 || y === 0) return 'axial';
        if (Math.abs(x) === Math.abs(y)) return 'diagonal';
        return 'lateral';
    };

    // =========================================================================
    // 3. AFFECTIVE MATRIX (AffectiveMatrix.lean)
    // =========================================================================

    /**
     * Calcule l'antagoniste exact selon AffectiveMatrix.lean :
     *   - Central (0,0,Z) : fixe (0,0,Z)
     *   - Axial (X=0 ou Y=0) : inversion centrale (-X, -Y, Z)
     *   - Non-axial (X≠0, Y≠0, incl. diagonales et latérales) : loi unifiée
     *     (-sgn(X)*|Y|, -sgn(Y)*|X|, Z)
     */
    CartograffectTheory.antagonistPoint = function (x, y, z) {
        if (x === 0 && y === 0) return { x: 0, y: 0, z };
        if (x === 0 || y === 0) return { x: -x, y: -y, z };
        return {
            x: -Math.sign(x) * Math.abs(y),
            y: -Math.sign(y) * Math.abs(x),
            z
        };
    };

    CartograffectTheory.computeEnergyRegime = function (x, y) {
        if (x === 0 && y === 0) {
            return {
                id: 'neutralBasal',
                label: 'Régime Basal / Suspens Central',
                color: 'slate',
                desc: 'Aucune polarisation périphérique (X=0, Y=0) : maintien homéostatique ou opérateur de suspension.'
            };
        }
        if (x === 0 || y === 0) {
            return {
                id: 'axialPure',
                label: 'Régime Axial Pur (Instable)',
                color: 'sky',
                desc: 'Une seule dimension est tranchée ; toute la ressource L₁ porte sur un seul axe, rendant la position dynamiquement instable.'
            };
        }
        if (x > 0 && y > 0) {
            return {
                id: 'positiveSynergy',
                label: 'Synergie Positive (Congruence +X/+Y)',
                color: 'pink',
                desc: 'Double décharge épistémique et pragmatique : modèle révisable et situation contrôlable.'
            };
        }
        if (x < 0 && y < 0) {
            return {
                id: 'negativeSynergy',
                label: 'Synergie Négative (Congruence −X/−Y)',
                color: 'amber',
                desc: 'Double charge non résorbée : modèle non révisable et situation non contrôlable (repli / rejet).'
            };
        }
        if (x < 0 && y > 0) {
            return {
                id: 'ergotropicCompensation',
                label: 'Compensation Ergotropique (−X / +Y)',
                color: 'rose',
                desc: 'Modèle mis en échec et tenu pour non révisable (−X), compensé par une mobilisation motrice d’urgence (+Y).'
            };
        }
        return {
            id: 'trophotropicRelease',
            label: 'Relâchement Trophotropique (+X / −Y)',
            color: 'emerald',
            desc: 'Situation non contrôlable (−Y) compensée par une révision souple du modèle interne (+X) et un apaisement de l’effort.'
        };
    };

    /**
     * Loi de primauté hédonique lexicographique de l'Axe X (AffectiveMatrix.lean) :
     * Le signe de X gouverne la valence au premier rang ; Y n'intervient que si X = 0.
     */
    CartograffectTheory.computeHedonicPolarity = function (x, y) {
        if (x > 0) {
            return {
                polarity: 'positive',
                label: 'Valence Positive (+)',
                rule: 'Primauté de l’Axe X (X > 0) : résorption épistémique assurant une valence agréable quel que soit Y.'
            };
        }
        if (x < 0) {
            return {
                polarity: 'negative',
                label: 'Valence Négative (−)',
                rule: 'Primauté de l’Axe X (X < 0) : charge épistémique non résorbée imposant une valence aversive quel que soit Y.'
            };
        }
        if (y > 0) {
            return {
                polarity: 'positive',
                label: 'Valence Positive (+)',
                rule: 'X = 0 : l’Axe Y départage la valence en positif (décharge pragmatique Y > 0).'
            };
        }
        if (y < 0) {
            return {
                polarity: 'negative',
                label: 'Valence Négative (−)',
                rule: 'X = 0 : l’Axe Y départage la valence en négatif (charge pragmatique Y < 0).'
            };
        }
        return {
            polarity: 'neutral',
            label: 'Suspens Pré-Valencé (0)',
            rule: 'X = 0 et Y = 0 : aucune valence hédonique encore déployée.'
        };
    };

    // =========================================================================
    // 4. AFFECTIVE TAXONOMY (AffectiveTaxonomy.lean)
    // =========================================================================

    CartograffectTheory.classifyTaxonomicGroup = function (x, y) {
        if (x === 0 && y === 0) return { id: 'operateurCentral', label: 'Opérateur Central (0, 0, Z)', orientationLabel: 'Opérateur de Suspension Centrale' };
        if (Math.abs(y) > Math.abs(x)) {
            return y > 0
                ? { id: 'groupeJoie', label: 'Secteur Joie (Y+ dominant)', orientationLabel: 'Élan / Mobilisation (Secteur Joie, Y+)' }
                : { id: 'groupeTristesse', label: 'Secteur Tristesse (Y− dominant)', orientationLabel: 'Retenue / Apaisement (Secteur Tristesse, Y−)' };
        }
        if (Math.abs(x) > Math.abs(y)) {
            return x < 0
                ? { id: 'groupePeur', label: 'Secteur Peur (X− dominant)', orientationLabel: 'Maintien / Alerte Épistémique (Secteur Peur, X−)' }
                : { id: 'groupeCourage', label: 'Secteur Courage (X+ dominant)', orientationLabel: 'Révision / Ouverture Épistémique (Secteur Courage, X+)' };
        }
        if (x > 0) {
            return y > 0
                ? { id: 'groupeDesir', label: 'Filière Diagonale Désir (+X, +Y)', orientationLabel: 'Synergie d’Approche (Filière Désir)' }
                : { id: 'groupeCalme', label: 'Filière Diagonale Calme (+X, −Y)', orientationLabel: 'Relâchement Trophotropique (Filière Calme)' };
        }
        return y > 0
            ? { id: 'groupeColere', label: 'Filière Diagonale Colère (−X, +Y)', orientationLabel: 'Compensation Ergotropique (Filière Colère)' }
            : { id: 'groupeDegout', label: 'Filière Diagonale Dégoût (−X, −Y)', orientationLabel: 'Congruence Aversive (Filière Dégoût)' };
    };

    CartograffectTheory.classifySubsector = function (x, y) {
        const ax = Math.abs(x), ay = Math.abs(y);
        if (x === 0 && y === 0) return { id: 'centralOperator', label: 'Opérateur de suspens central' };
        if (x === 0 && y > 0) return { id: 'axialElan', label: 'Axial Élan (X=0, Y>0)' };
        if (x === 0 && y < 0) return { id: 'axialWithdrawal', label: 'Axial Repli (X=0, Y<0)' };
        if (x > 0 && y === 0) return { id: 'axialOpening', label: 'Axial Ouverture (X>0, Y=0)' };
        if (x < 0 && y === 0) return { id: 'axialThreat', label: 'Axial Menace (X<0, Y=0)' };
        if (x === y && x > 0) return { id: 'diagonalDesire', label: 'Diagonal Congruence Positive (X=Y>0)' };
        if (x === y && x < 0) return { id: 'diagonalDisgust', label: 'Diagonal Congruence Négative (X=Y<0)' };
        if (x === -y && x < 0) return { id: 'diagonalAnger', label: 'Diagonal Compensation Ergotropique (X=−Y<0)' };
        if (x === -y && x > 0) return { id: 'diagonalCalm', label: 'Diagonal Relâchement Trophotropique (X=−Y>0)' };
        if (y > ax && x > 0) return { id: 'lateralApproachSynergy', label: 'Latéral Synergie d’Approche (Y>|X|, X>0)' };
        if (y > ax && x < 0) return { id: 'lateralDefensiveUrgency', label: 'Latéral Urgence Défensive (Y>|X|, X<0)' };
        if (y < -ax && x > 0) return { id: 'lateralTrophotropicPeace', label: 'Latéral Paix Trophotropique (Y<−|X|, X>0)' };
        if (y < -ax && x < 0) return { id: 'lateralAversiveDistress', label: 'Latéral Détresse Aversive (Y<−|X|, X<0)' };
        if (x > ay && y > 0) return { id: 'lateralEpistemicMastery', label: 'Latéral Maîtrise Épistémique (X>|Y|, Y>0)' };
        if (x > ay && y < 0) return { id: 'lateralContemplativeOpen', label: 'Latéral Ouverture Contemplative (X>|Y|, Y<0)' };
        if (x < -ay && y > 0) return { id: 'lateralVigilantAlert', label: 'Latéral Alerte Vigilante (X<−|Y|, Y>0)' };
        return { id: 'lateralEpistemicClosure', label: 'Latéral Fermeture Épistémique (X<−|Y|, Y<0)' };
    };

    /**
     * Calcule la trajectoire théorique de dissipation allostatique (§6.3) :
     * 1) Contraction des coordonnées périphériques vers l'opérateur central (0,0,Z)
     * 2) Descente strate par strate jusqu'au Point de Veille (0,0,0)
     */
    CartograffectTheory.computeDissipationPath = function (startEmotion) {
        if (!startEmotion) return [];
        const steps = [];
        const emotions = (root.CartograffectModel && root.CartograffectModel.emotions) || [];
        const findByCoord = (cx, cy, cz) => emotions.find(e => e.x === cx && e.y === cy && e.z === cz);

        let cx = startEmotion.x;
        let cy = startEmotion.y;
        let cz = startEmotion.z;

        steps.push({
            phase: 'État initial saillant',
            x: cx, y: cy, z: cz,
            name: startEmotion.name,
            note: 'Position initiale engagée sous tension allostatique.'
        });

        // Contraction vers l'opérateur central de la strate Z (si périphérique)
        if (cz >= 2 && (cx !== 0 || cy !== 0)) {
            const centerOp = findByCoord(0, 0, cz);
            steps.push({
                phase: 'Contraction vers le centre opérateur (Z=' + cz + ')',
                x: 0, y: 0, z: cz,
                name: centerOp ? centerOp.name : 'Opérateur Z=' + cz,
                note: 'L’écart passe sous le seuil de résorption : les gradients se résorbent vers la suspension centrale de la strate.'
            });
        }

        // Descente séquentielle strate par strate jusqu'au Point de Veille (0,0,0)
        for (let z = cz - 1; z >= 0; z--) {
            const op = findByCoord(0, 0, z);
            steps.push({
                phase: z === 0 ? 'Retour à l’équilibre basal' : 'Descente de strate (Z=' + z + ')',
                x: 0, y: 0, z: z,
                name: op ? op.name : (z === 0 ? 'Point de Veille' : 'Opérateur Z=' + z),
                note: z === 0
                    ? 'Point de Veille (0,0,0) : unique attracteur stable d’équilibre homéostatique basal.'
                    : 'Dissipation graduelle de la profondeur inférentielle.'
            });
        }

        return steps;
    };

    /**
     * Initialise les menus déroulants "Le Modèle ▾" et le menu mobile sur les pages
     */
    CartograffectTheory.initNavMenus = function () {
        const dropdownBtn = document.getElementById('modelDropdownBtn');
        const dropdownMenu = document.getElementById('modelDropdownMenu');
        if (dropdownBtn && dropdownMenu) {
            const toggle = (show) => {
                const open = show !== undefined ? show : dropdownMenu.classList.contains('hidden');
                dropdownMenu.classList.toggle('hidden', !open);
                dropdownBtn.setAttribute('aria-expanded', String(open));
            };
            dropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggle();
            });
            document.addEventListener('click', (e) => {
                if (!dropdownMenu.contains(e.target) && e.target !== dropdownBtn) {
                    toggle(false);
                }
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') toggle(false);
            });
        }

        const mobileBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileClose = document.getElementById('mobileMenuClose');
        if (mobileBtn && mobileMenu && !mobileBtn.dataset.boundTheory) {
            mobileBtn.dataset.boundTheory = '1';
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
            const closeMenu = () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            };
            if (mobileClose) mobileClose.addEventListener('click', closeMenu);
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) closeMenu();
            });
        }
    };

    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function () {
            CartograffectTheory.initNavMenus();
        });
    }

    root.CartograffectTheory = CartograffectTheory;
})(typeof window !== 'undefined' ? window : this);

