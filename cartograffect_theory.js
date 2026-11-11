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
     * Évalue l'état complet du Moteur Prédictif selon PredictiveEngine.lean
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

        const isSensorilySalient = magnitude >= sensoryThreshold;
        const isInRemanenceWindow = magnitude >= resorptionThreshold && magnitude < sensoryThreshold;
        const isBelowResorption = magnitude < resorptionThreshold;
        const isAttentionalEngaged = allocatedPrecision >= engagementThreshold;

        const aEngaged = attente !== 'zero';
        const cEngaged = controle !== 'zero';

        let stage = 'veille';
        let stageLabel = 'Point de Veille (0, 0, 0)';
        let stageDesc = 'Régime homéostatique basal : l’écart demeure sous le seuil de tolérance. Neutralité globale (A0, C0).';
        let x = 0, y = 0, z = 0;

        if (isBelowResorption) {
            stage = 'veille';
            stageLabel = 'Point de Veille (0, 0, 0)';
            stageDesc = 'Écart inférieur au seuil de résorption homéostatique : maintien dans la plage de tolérance, aucune alerte saillante.';
            x = 0; y = 0; z = 0;
        } else if (isInRemanenceWindow) {
            stage = 'remanence';
            stageLabel = 'Fenêtre de Rémanence (Hystérésis)';
            stageDesc = 'L’écart résiduel reste entre le seuil de résorption (' + resorptionThreshold + ') et le seuil sensoriel (' + sensoryThreshold + ') : rémanence temporaire avant retour au Point de Veille.';
            z = 1;
        } else if (isSensorilySalient && !isAttentionalEngaged) {
            stage = 'surprise';
            stageLabel = 'Surprise (0, 0, 1)';
            stageDesc = 'Rupture ascendante : l’écart franchit le seuil sensoriel (' + sensoryThreshold + '), mais la précision attentionnelle (' + allocatedPrecision + ' < ' + engagementThreshold + ') n’a pas encore déployé le couplage (A, C) en coordonnées spatiales.';
            x = 0; y = 0; z = 1;
        } else if (isSensorilySalient && isAttentionalEngaged) {
            if (!aEngaged && !cEngaged) {
                stage = 'anticipation';
                stageLabel = 'Anticipation (0, 0, 2)';
                stageDesc = 'Opérateur descendant d’orientation : précision engagée, en attente de polarisation sur Attente (A) et/ou Contrôle (C).';
                x = 0; y = 0; z = 2;
            } else if (aEngaged && !cEngaged) {
                // Régime axial sur X : tout le budget L1 (2) va sur X
                x = this.polarityToInt(attente) * 2;
                y = 0;
                z = 2;
                stage = 'deployed_axial';
                stageLabel = 'Déploiement Axial Z=2 (' + x + ', 0, 2)';
                stageDesc = 'Une seule dimension (Attente) est tranchée : elle capte l’intégralité du poids attentionnel (|X|=2, |Y|=0).';
            } else if (!aEngaged && cEngaged) {
                // Régime axial sur Y : tout le budget L1 (2) va sur Y
                x = 0;
                y = this.polarityToInt(controle) * 2;
                z = 2;
                stage = 'deployed_axial';
                stageLabel = 'Déploiement Axial Z=2 (0, ' + y + ', 2)';
                stageDesc = 'Une seule dimension (Contrôle) est tranchée : elle capte l’intégralité du poids attentionnel (|X|=0, |Y|=2).';
            } else {
                // Régime diagonal : partage équitable (±1, ±1)
                x = this.polarityToInt(attente);
                y = this.polarityToInt(controle);
                z = 2;
                stage = 'deployed_diagonal';
                stageLabel = 'Déploiement Diagonal Z=2 (' + x + ', ' + y + ', 2)';
                stageDesc = 'Les deux dimensions (Attente et Contrôle) sont tranchées conjointement : répartition équitable du budget attentionnel (|X|=1, |Y|=1).';
            }
        }

        // Recherche du prototype correspondant à Z=0,1,2 si disponible dans CartograffectModel
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
        if (x === 0 && y === 0) return { id: 'operateurCentral', label: 'Opérateur Central (0, 0, Z)' };
        if (Math.abs(y) > Math.abs(x)) {
            return y > 0
                ? { id: 'groupeJoie', label: 'Secteur Joie (Y+ dominant)' }
                : { id: 'groupeTristesse', label: 'Secteur Tristesse (Y− dominant)' };
        }
        if (Math.abs(x) > Math.abs(y)) {
            return x < 0
                ? { id: 'groupePeur', label: 'Secteur Peur (X− dominant)' }
                : { id: 'groupeCourage', label: 'Secteur Courage (X+ dominant)' };
        }
        if (x > 0) {
            return y > 0
                ? { id: 'groupeDesir', label: 'Filière Diagonale Désir (+X, +Y)' }
                : { id: 'groupeCalme', label: 'Filière Diagonale Calme (+X, −Y)' };
        }
        return y > 0
            ? { id: 'groupeColere', label: 'Filière Diagonale Colère (−X, +Y)' }
            : { id: 'groupeDegout', label: 'Filière Diagonale Dégoût (−X, −Y)' };
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

