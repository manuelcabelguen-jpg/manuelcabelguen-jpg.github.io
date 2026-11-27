/**
 * CARTOGRAFFECT® — Noyau Computationnel & Vérification Formelle v2.1.0 (Module JS)
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Aligné sur le noyau Strate 0 du compendium CARTOGRAFFECT (120 théorèmes constructifs, 0 sorry,
 * 6 prouveurs indépendants : Lean 4.35.0, Rocq 9.0, Agda 2.9.0, Dafny 4.11.0, SMT/Z3 5.3.3, TLA+/TLC 2.19)
 * et ses 10 modules .lean :
 *   1. Cartograffect.lean            (Intégration racine)
 *   2. PredictiveEngine.lean         (Moteur prédictif : interfaces, hystérésis, couplages A/C)
 *   3. CoreAffect.lean               (Noyau affectif : coordonnées X/Y/Z, norme L1, apportionRay)
 *   4. AffectiveMatrix.lean          (Matrice affective : régimes énergétiques, valence lexicographique)
 *   5. AffectiveTaxonomy.lean        (Taxonomie affective : 9 groupes, 17 sous-secteurs, dissipation)
 *   6. AffectiveDynamics.lean        (Dynamique markovienne, résolution active vs extinction passive)
 *   7. Lexicon176.lean               (176 positions certifiées sans collision)
 *   8. PredictiveCircuit.lean        (Circuit fermé à deux boucles & identité 4m^6)
 *   9. AuditTests.lean               (Batterie d'audit formel automatisé)
 *  10. OperantFactorization.lean     (Factorisation structurale des contingences opérantes Z = 2)
 *
 * Manuel Cabelguen, Ph. D., Psychologue clinicien, chercheur indépendant en psychologie,
 * Sainte-Agathe-des-Monts, Québec, Canada • OPIC n° 1233199
 */

(function (root) {
    'use strict';

    const CartograffectTheory = {};

    function isEn() {
        return Boolean(root.CartograffectI18n && typeof root.CartograffectI18n.getLang === 'function' && root.CartograffectI18n.getLang() === 'en');
    }

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
        const en = isEn();
        if (axis === 'A') {
            if (pol === 'pos') {
                return en
                    ? { code: 'A+', title: 'Certain Expectation', regime: 'Epistemic discharge', desc: 'Revisable internal model: belief updating is possible.' }
                    : { code: 'A+', title: 'Attente Certaine', regime: 'Décharge épistémique', desc: 'Modèle interne révisable : mise à jour des croyances possible.' };
            }
            if (pol === 'neg') {
                return en
                    ? { code: 'A−', title: 'Uncertain Expectation', regime: 'Epistemic charge', desc: 'Non-revisable internal model: retention / high accommodation cost.' }
                    : { code: 'A−', title: 'Attente Incertaine', regime: 'Charge épistémique', desc: 'Modèle interne non révisable : maintien / coût d’accommodation élevé.' };
            }
            return en
                ? { code: 'A0', title: 'Neutral Expectation', regime: 'Neutral (below threshold)', desc: 'Streams consistent with background beliefs, no epistemic salience.' }
                : { code: 'A0', title: 'Attente Neutre', regime: 'Neutre (sous seuil)', desc: 'Flux conformes aux croyances d’arrière-plan, aucune saillance épistémique.' };
        }
        if (pol === 'pos') {
            return en
                ? { code: 'C+', title: 'Certain Control', regime: 'Pragmatic discharge', desc: 'Controllable situation: contributory motor action is possible.' }
                : { code: 'C+', title: 'Contrôle Certain', regime: 'Décharge pragmatique', desc: 'Situation contrôlable : action motrice contributive possible.' };
        }
        if (pol === 'neg') {
            return en
                ? { code: 'C−', title: 'Uncertain Control', regime: 'Pragmatic charge', desc: 'Uncontrollable situation: reduction or suspension of effort.' }
                : { code: 'C−', title: 'Contrôle Incertain', regime: 'Charge pragmatique', desc: 'Situation non contrôlable : réduction ou suspension de l’effort.' };
        }
        return en
            ? { code: 'C0', title: 'Neutral Control', regime: 'Neutral (below threshold)', desc: 'Routine control regime below the salience threshold.' }
            : { code: 'C0', title: 'Contrôle Neutre', regime: 'Neutre (sous seuil)', desc: 'Régime de contrôle de routine sous le seuil de saillance.' };
    };

    /**
     * Évalue l'état complet du Moteur Prédictif selon PredictiveEngine.lean & CoreAffect.lean
     * Supporte :
     *   - strictness Lean 4 (`projectToCoreAffect` + `remanence_preserves_state`)
     *   - profondeur `persistenceDepth` (d = 0..5 -> Z = 2..7)
     *   - extension pédagogique optionnelle `weightRatioA` (0..1) pour l'asymétrie (π_A, π_C)
     */
    CartograffectTheory.evaluateEngine = function (params) {
        const en = isEn();
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
        let stageLabel = en ? 'Wake Point (0, 0, 0)' : 'Point de Veille (0, 0, 0)';
        let stageDesc = en
            ? 'Basal homeostatic regime: discrepancy remains below tolerance threshold or in global neutrality (A0, C0).'
            : 'Régime homéostatique basal : l’écart demeure sous le seuil de tolérance ou en neutralité globale (A0, C0).';
        let x = 0, y = 0, z = 0;

        if (isBelowResorption) {
            stage = 'veille';
            stageLabel = en ? 'Wake Point (0, 0, 0)' : 'Point de Veille (0, 0, 0)';
            stageDesc = en
                ? 'Discrepancy below homeostatic resorption threshold: return to or stay at Wake Point (0, 0, 0).'
                : 'Écart inférieur au seuil de résorption homéostatique : retour ou maintien au Point de Veille (0, 0, 0).';
            x = 0; y = 0; z = 0;
        } else if (isInRemanenceWindow) {
            if (aEngaged || cEngaged) {
                const held = computeCrownCoords();
                x = held.x; y = held.y; z = targetZ;
                stage = 'remanence';
                stageLabel = (en ? 'Allostatic Remanence (' : 'Rémanence Allostatique (') + x + ', ' + y + ', ' + z + ')';
                stageDesc = en
                    ? 'Hysteresis (remanence_preserves_state): discrepancy (' + magnitude + ') dropped below sensory threshold (' + sensoryThreshold + ') while remaining ≥ resorption (' + resorptionThreshold + '), preserving the active state.'
                    : 'Hystérésis (remanence_preserves_state) : l’écart (' + magnitude + ') est repassé sous le seuil sensoriel (' + sensoryThreshold + ') mais reste ≥ résorption (' + resorptionThreshold + '), maintenant l’état actif.';
            } else {
                stage = 'remanence_neutral';
                stageLabel = en ? 'Wake Point (0, 0, 0) — Hysteresis Zone' : 'Point de Veille (0, 0, 0) — Zone d’hystérésis';
                stageDesc = en
                    ? 'Magnitude lies in the hysteresis window [' + resorptionThreshold + ', ' + sensoryThreshold + '[ while coupling is neutral (A0, C0): no peripheral state to sustain.'
                    : 'La magnitude est dans la fenêtre d’hystérésis [' + resorptionThreshold + ', ' + sensoryThreshold + '[ mais le couplage est neutre (A0, C0) : aucun état périphérique à maintenir.';
                x = 0; y = 0; z = 0;
            }
        } else if (isSensorilySalient && !aEngaged && !cEngaged) {
            // CoreAffect.lean L264: !isSensorilySalient || c.isGlobalNeutrality => Point de Veille (0,0,0)
            stage = 'veille';
            stageLabel = en ? 'Wake Point (0, 0, 0)' : 'Point de Veille (0, 0, 0)';
            stageDesc = en
                ? 'Globally neutral coupling (A0, C0): per CoreAffect.lean, joint global neutrality does not activate the crown and remains at Wake Point (0, 0, 0). Select an A or C polarity to break wakefulness.'
                : 'Couplage globalement neutre (A0, C0) : selon CoreAffect.lean, la neutralité globale conjointe n’active pas la couronne et reste au Point de Veille (0, 0, 0). Choisissez une polarité A ou C pour rompre la veille.';
            x = 0; y = 0; z = 0;
        } else if (isSensorilySalient && !isAttentionalEngaged) {
            if (descendingSuspension) {
                x = 0; y = 0; z = targetZ;
                stage = 'anticipation';
                stageLabel = (targetZ === 2 ? 'Anticipation' : (en ? 'Central Operator Z=' : 'Opérateur Central Z=') + z) + ' (0, 0, ' + z + ')';
                stageDesc = en
                    ? 'Descending suspension (CoreAffect.lean L267): the Subjective Interface holds deployment before attentional engagement and places the system on the central orientation operator (0, 0, ' + z + ').'
                    : 'Suspension descendante (CoreAffect.lean L267) : l’Interface Subjective retient le déploiement avant l’engagement attentionnel et place le système sur l’opérateur central d’orientation (0, 0, ' + z + ').';
            } else {
                x = 0; y = 0; z = 1;
                stage = 'surprise';
                stageLabel = 'Surprise (0, 0, 1)';
                stageDesc = en
                    ? 'Ascending rupture: discrepancy crosses sensory threshold (' + sensoryThreshold + '), while allocated precision (' + allocatedPrecision + ' < ' + engagementThreshold + ') stays below engagement threshold without descending suspension.'
                    : 'Rupture ascendante : l’écart franchit le seuil sensoriel (' + sensoryThreshold + '), mais la précision attentionnelle (' + allocatedPrecision + ' < ' + engagementThreshold + ') reste sous le seuil d’engagement sans suspension descendante.';
            }
        } else if (isSensorilySalient && isAttentionalEngaged) {
            const pt = computeCrownCoords();
            x = pt.x; y = pt.y; z = targetZ;
            const gType = this.geometryType(x, y);
            if (gType === 'axial') {
                stage = 'deployed_axial';
                stageLabel = (en ? 'Axial Deployment Z=' : 'Déploiement Axial Z=') + z + ' (' + x + ', ' + y + ', ' + z + ')';
                stageDesc = en
                    ? (aEngaged ? 'Only Expectation (A)' : 'Only Control (C)') + ' is resolved: it captures the entire L₁ attentional budget = ' + radius + '.'
                    : (aEngaged ? 'Seule Attente (A)' : 'Seul Contrôle (C)') + ' est tranché : il capte tout le budget attentionnel L₁ = ' + radius + '.';
            } else if (gType === 'diagonal') {
                stage = 'deployed_diagonal';
                stageLabel = (en ? 'Diagonal Deployment Z=' : 'Déploiement Diagonal Z=') + z + ' (' + x + ', ' + y + ', ' + z + ')';
                stageDesc = en
                    ? 'Both dimensions (A and C) are equally resolved: |X| = |Y| = ' + (radius / 2) + '.'
                    : 'Les deux dimensions (A et C) sont tranchées à parts égales : |X| = |Y| = ' + (radius / 2) + '.';
            } else {
                stage = 'deployed_lateral';
                stageLabel = (en ? 'Lateral Deployment Z=' : 'Déploiement Latéral Z=') + z + ' (' + x + ', ' + y + ', ' + z + ')';
                stageDesc = en
                    ? 'Precision-asymmetry extension (π_A / π_C): unequal distribution on the crown |X|+|Y| = ' + radius + '.'
                    : 'Extension par asymétrie de précision (π_A / π_C) : répartition inégale sur la couronne |X|+|Y| = ' + radius + '.';
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

    CartograffectTheory.geometryLabel = function (typeOrX, y, lang) {
        const typ = typeof typeOrX === 'string'
            ? typeOrX
            : this.geometryType(Number(typeOrX), Number(y));
        const useEn = lang ? lang === 'en' : isEn();
        const labels = useEn
            ? {
                operator: 'Central Operator',
                axial: 'Axial Position',
                diagonal: 'Diagonal Position',
                lateral: 'Lateral Position'
            }
            : {
                operator: 'Opérateur Central',
                axial: 'Position Axiale',
                diagonal: 'Position Diagonale',
                lateral: 'Position Latérale'
            };
        return labels[typ] || typ;
    };

    // =========================================================================
    // 3. AFFECTIVE MATRIX (AffectiveMatrix.lean)
    // =========================================================================

    /**
     * Calcule l'antagoniste exact par morceaux selon AffectiveMatrix.lean :
     *   - Si XY = 0 (centre (0,0,Z) et positions axiales X=0 ou Y=0) :
     *     (-X, -Y, Z)
     *   - Si XY ≠ 0 (positions diagonales et latérales, X≠0 et Y≠0) :
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
        const en = isEn();
        if (x === 0 && y === 0) {
            return {
                id: 'neutralBasal',
                label: en ? 'Basal Regime / Central Suspension' : 'Régime Basal / Suspens Central',
                color: 'slate',
                hexColor: '#94a3b8',
                desc: en
                    ? 'No peripheral polarization (X=0, Y=0): homeostatic baseline or central suspension operator.'
                    : 'Aucune polarisation périphérique (X=0, Y=0) : maintien homéostatique ou opérateur de suspension.'
            };
        }
        if (x === 0 || y === 0) {
            return {
                id: 'axialPure',
                label: en ? 'Pure Axial Regime (Unstable)' : 'Régime Axial Pur (Instable)',
                color: 'sky',
                hexColor: '#38bdf8',
                desc: en
                    ? 'A single dimension is resolved; the entire L₁ budget sits on one axis, making the position dynamically unstable.'
                    : 'Une seule dimension est tranchée ; toute la ressource L₁ porte sur un seul axe, rendant la position dynamiquement instable.'
            };
        }
        if (x > 0 && y > 0) {
            return {
                id: 'positiveSynergy',
                label: en ? 'Positive Synergy (Congruence +X/+Y)' : 'Synergie Positive (Congruence +X/+Y)',
                color: 'pink',
                hexColor: '#f472b6',
                desc: en
                    ? 'Dual epistemic and pragmatic discharge: revisable model and controllable situation.'
                    : 'Double décharge épistémique et pragmatique : modèle révisable et situation contrôlable.'
            };
        }
        if (x < 0 && y < 0) {
            return {
                id: 'negativeSynergy',
                label: en ? 'Negative Synergy (Congruence −X/−Y)' : 'Synergie Négative (Congruence −X/−Y)',
                color: 'amber',
                hexColor: '#fbbf24',
                desc: en
                    ? 'Dual unresolved charge: non-revisable model and uncontrollable situation (withdrawal / rejection).'
                    : 'Double charge non résorbée : modèle non révisable et situation non contrôlable (repli / rejet).'
            };
        }
        if (x < 0 && y > 0) {
            return {
                id: 'ergotropicCompensation',
                label: en ? 'Ergotropic Compensation (−X / +Y)' : 'Compensation Ergotropique (−X / +Y)',
                color: 'rose',
                hexColor: '#fb7185',
                desc: en
                    ? 'Challenged model held non-revisable (−X), compensated by urgent motor mobilization (+Y).'
                    : 'Modèle mis en échec et tenu pour non révisable (−X), compensé par une mobilisation motrice d’urgence (+Y).'
            };
        }
        return {
            id: 'trophotropicRelease',
            label: en ? 'Trophotropic Release (+X / −Y)' : 'Relâchement Trophotropique (+X / −Y)',
            color: 'emerald',
            hexColor: '#34d399',
            desc: en
                ? 'Uncontrollable situation (−Y) compensated by flexible internal model revision (+X) and effort release.'
                : 'Situation non contrôlable (−Y) compensée par une révision souple du modèle interne (+X) et un apaisement de l’effort.'
        };
    };

    /**
     * Loi de primauté hédonique lexicographique de l'Axe X (AffectiveMatrix.lean) :
     * Le signe de X gouverne la valence au premier rang ; Y n'intervient que si X = 0.
     */
    CartograffectTheory.computeHedonicPolarity = function (x, y) {
        const en = isEn();
        if (x > 0) {
            return {
                polarity: 'positive',
                label: en ? 'Positive Valence (+)' : 'Valence Positive (+)',
                rule: en
                    ? 'X-Axis Primacy (X > 0): epistemic resorption secures a pleasant valence regardless of Y.'
                    : 'Primauté de l’Axe X (X > 0) : résorption épistémique assurant une valence agréable quel que soit Y.'
            };
        }
        if (x < 0) {
            return {
                polarity: 'negative',
                label: en ? 'Negative Valence (−)' : 'Valence Négative (−)',
                rule: en
                    ? 'X-Axis Primacy (X < 0): unresolved epistemic charge enforces an aversive valence regardless of Y.'
                    : 'Primauté de l’Axe X (X < 0) : charge épistémique non résorbée imposant une valence aversive quel que soit Y.'
            };
        }
        if (y > 0) {
            return {
                polarity: 'positive',
                label: en ? 'Positive Valence (+)' : 'Valence Positive (+)',
                rule: en
                    ? 'X = 0: Y-Axis breaks valence positively (pragmatic discharge Y > 0).'
                    : 'X = 0 : l’Axe Y départage la valence en positif (décharge pragmatique Y > 0).'
            };
        }
        if (y < 0) {
            return {
                polarity: 'negative',
                label: en ? 'Negative Valence (−)' : 'Valence Négative (−)',
                rule: en
                    ? 'X = 0: Y-Axis breaks valence negatively (pragmatic charge Y < 0).'
                    : 'X = 0 : l’Axe Y départage la valence en négatif (charge pragmatique Y < 0).'
            };
        }
        return {
            polarity: 'neutral',
            label: en ? 'Pre-Valence Suspension (0)' : 'Suspens Pré-Valencé (0)',
            rule: en
                ? 'X = 0 and Y = 0: no hedonic valence deployed yet.'
                : 'X = 0 et Y = 0 : aucune valence hédonique encore déployée.'
        };
    };

    // =========================================================================
    // 4. AFFECTIVE TAXONOMY (AffectiveTaxonomy.lean)
    // =========================================================================

    CartograffectTheory.classifyTaxonomicGroup = function (x, y) {
        const en = isEn();
        if (x === 0 && y === 0) {
            return {
                id: 'operateurCentral',
                label: en ? 'Central Operator (0, 0, Z)' : 'Opérateur Central (0, 0, Z)',
                orientationLabel: en ? 'Central Suspension Operator' : 'Opérateur de Suspension Centrale'
            };
        }
        if (Math.abs(y) > Math.abs(x)) {
            return y > 0
                ? {
                    id: 'groupeJoie',
                    label: en ? 'Joy Sector (Y+ dominant)' : 'Secteur Joie (Y+ dominant)',
                    orientationLabel: en ? 'Drive / Mobilization (Joy Sector, Y+)' : 'Élan / Mobilisation (Secteur Joie, Y+)'
                }
                : {
                    id: 'groupeTristesse',
                    label: en ? 'Sadness Sector (Y− dominant)' : 'Secteur Tristesse (Y− dominant)',
                    orientationLabel: en ? 'Restraint / Withdrawal (Sadness Sector, Y−)' : 'Retenue / Apaisement (Secteur Tristesse, Y−)'
                };
        }
        if (Math.abs(x) > Math.abs(y)) {
            return x < 0
                ? {
                    id: 'groupePeur',
                    label: en ? 'Fear Sector (X− dominant)' : 'Secteur Peur (X− dominant)',
                    orientationLabel: en ? 'Retention / Epistemic Alert (Fear Sector, X−)' : 'Maintien / Alerte Épistémique (Secteur Peur, X−)'
                }
                : {
                    id: 'groupeCourage',
                    label: en ? 'Courage Sector (X+ dominant)' : 'Secteur Courage (X+ dominant)',
                    orientationLabel: en ? 'Revision / Epistemic Opening (Courage Sector, X+)' : 'Révision / Ouverture Épistémique (Secteur Courage, X+)'
                };
        }
        if (x > 0) {
            return y > 0
                ? {
                    id: 'groupeDesir',
                    label: en ? 'Desire Diagonal Lineage (+X, +Y)' : 'Filière Diagonale Désir (+X, +Y)',
                    orientationLabel: en ? 'Approach Synergy (Desire Lineage)' : 'Synergie d’Approche (Filière Désir)'
                }
                : {
                    id: 'groupeCalme',
                    label: en ? 'Calm Diagonal Lineage (+X, −Y)' : 'Filière Diagonale Calme (+X, −Y)',
                    orientationLabel: en ? 'Trophotropic Release (Calm Lineage)' : 'Relâchement Trophotropique (Filière Calme)'
                };
        }
        return y > 0
            ? {
                id: 'groupeColere',
                label: en ? 'Anger Diagonal Lineage (−X, +Y)' : 'Filière Diagonale Colère (−X, +Y)',
                orientationLabel: en ? 'Ergotropic Compensation (Anger Lineage)' : 'Compensation Ergotropique (Filière Colère)'
            }
            : {
                id: 'groupeDegout',
                label: en ? 'Disgust Diagonal Lineage (−X, −Y)' : 'Filière Diagonale Dégoût (−X, −Y)',
                orientationLabel: en ? 'Aversive Congruence (Disgust Lineage)' : 'Congruence Aversive (Filière Dégoût)'
            };
    };

    CartograffectTheory.classifySubsector = function (x, y) {
        const en = isEn();
        const ax = Math.abs(x), ay = Math.abs(y);
        if (x === 0 && y === 0) return { id: 'centralOperator', label: en ? 'Central suspension operator' : 'Opérateur de suspens central' };
        if (x === 0 && y > 0) return { id: 'axialElan', label: en ? 'Axial Drive (X=0, Y>0)' : 'Axial Élan (X=0, Y>0)' };
        if (x === 0 && y < 0) return { id: 'axialWithdrawal', label: en ? 'Axial Withdrawal (X=0, Y<0)' : 'Axial Repli (X=0, Y<0)' };
        if (x > 0 && y === 0) return { id: 'axialOpening', label: en ? 'Axial Opening (X>0, Y=0)' : 'Axial Ouverture (X>0, Y=0)' };
        if (x < 0 && y === 0) return { id: 'axialThreat', label: en ? 'Axial Threat (X<0, Y=0)' : 'Axial Menace (X<0, Y=0)' };
        if (x === y && x > 0) return { id: 'diagonalDesire', label: en ? 'Diagonal Positive Congruence (X=Y>0)' : 'Diagonal Congruence Positive (X=Y>0)' };
        if (x === y && x < 0) return { id: 'diagonalDisgust', label: en ? 'Diagonal Negative Congruence (X=Y<0)' : 'Diagonal Congruence Négative (X=Y<0)' };
        if (x === -y && x < 0) return { id: 'diagonalAnger', label: en ? 'Diagonal Ergotropic Compensation (X=−Y<0)' : 'Diagonal Compensation Ergotropique (X=−Y<0)' };
        if (x === -y && x > 0) return { id: 'diagonalCalm', label: en ? 'Diagonal Trophotropic Release (X=−Y>0)' : 'Diagonal Relâchement Trophotropique (X=−Y>0)' };
        if (y > ax && x > 0) return { id: 'lateralApproachSynergy', label: en ? 'Lateral Approach Synergy (Y>|X|, X>0)' : 'Latéral Synergie d’Approche (Y>|X|, X>0)' };
        if (y > ax && x < 0) return { id: 'lateralDefensiveUrgency', label: en ? 'Lateral Defensive Urgency (Y>|X|, X<0)' : 'Latéral Urgence Défensive (Y>|X|, X<0)' };
        if (y < -ax && x > 0) return { id: 'lateralTrophotropicPeace', label: en ? 'Lateral Trophotropic Peace (Y<−|X|, X>0)' : 'Latéral Paix Trophotropique (Y<−|X|, X>0)' };
        if (y < -ax && x < 0) return { id: 'lateralAversiveDistress', label: en ? 'Lateral Aversive Distress (Y<−|X|, X<0)' : 'Latéral Détresse Aversive (Y<−|X|, X<0)' };
        if (x > ay && y > 0) return { id: 'lateralEpistemicMastery', label: en ? 'Lateral Epistemic Mastery (X>|Y|, Y>0)' : 'Latéral Maîtrise Épistémique (X>|Y|, Y>0)' };
        if (x > ay && y < 0) return { id: 'lateralContemplativeOpen', label: en ? 'Lateral Contemplative Opening (X>|Y|, Y<0)' : 'Latéral Ouverture Contemplative (X>|Y|, Y<0)' };
        if (x < -ay && y > 0) return { id: 'lateralVigilantAlert', label: en ? 'Lateral Vigilant Alert (X<−|Y|, Y>0)' : 'Latéral Alerte Vigilante (X<−|Y|, Y>0)' };
        return { id: 'lateralEpistemicClosure', label: en ? 'Lateral Epistemic Closure (X<−|Y|, Y<0)' : 'Latéral Fermeture Épistémique (X<−|Y|, Y<0)' };
    };

    /**
     * Calcule la trajectoire théorique de dissipation allostatique (§6.3) :
     * 1) Contraction des coordonnées périphériques vers l'opérateur central (0,0,Z)
     * 2) Descente strate par strate jusqu'au Point de Veille (0,0,0)
     */
    CartograffectTheory.computeDissipationPath = function (startEmotion) {
        if (!startEmotion) return [];
        const en = isEn();
        const steps = [];
        const emotions = (root.CartograffectModel && root.CartograffectModel.emotions) || [];
        const findByCoord = (cx, cy, cz) => emotions.find(e => e.x === cx && e.y === cy && e.z === cz);

        let cx = startEmotion.x;
        let cy = startEmotion.y;
        let cz = startEmotion.z;

        steps.push({
            phase: en ? 'Initial salient state' : 'État initial saillant',
            x: cx, y: cy, z: cz,
            name: startEmotion.name,
            note: en
                ? 'Initial position engaged under allostatic tension.'
                : 'Position initiale engagée sous tension allostatique.'
        });

        // Contraction vers l'opérateur central de la strate Z (si périphérique)
        if (cz >= 2 && (cx !== 0 || cy !== 0)) {
            const centerOp = findByCoord(0, 0, cz);
            steps.push({
                phase: en ? 'Contraction to central operator (Z=' + cz + ')' : 'Contraction vers le centre opérateur (Z=' + cz + ')',
                x: 0, y: 0, z: cz,
                name: centerOp ? centerOp.name : (en ? 'Operator Z=' : 'Opérateur Z=') + cz,
                note: en
                    ? 'Discrepancy falls below the resorption threshold: gradients dissipate toward the stratum’s central suspension.'
                    : 'L’écart passe sous le seuil de résorption : les gradients se résorbent vers la suspension centrale de la strate.'
            });
        }

        // Descente séquentielle strate par strate jusqu'au Point de Veille (0,0,0)
        for (let z = cz - 1; z >= 0; z--) {
            const op = findByCoord(0, 0, z);
            steps.push({
                phase: z === 0
                    ? (en ? 'Return to basal equilibrium' : 'Retour à l’équilibre basal')
                    : (en ? 'Stratum descent (Z=' + z + ')' : 'Descente de strate (Z=' + z + ')'),
                x: 0, y: 0, z: z,
                name: op ? op.name : (z === 0 ? 'Point de Veille' : (en ? 'Operator Z=' : 'Opérateur Z=') + z),
                note: z === 0
                    ? (en ? 'Wake Point (0,0,0): unique stable attractor of basal homeostatic equilibrium.' : 'Point de Veille (0,0,0) : unique attracteur stable d’équilibre homéostatique basal.')
                    : (en ? 'Gradual dissipation of inferential depth.' : 'Dissipation graduelle de la profondeur inférentielle.')
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
        if (dropdownBtn && dropdownMenu && !dropdownBtn.dataset.boundTheory) {
            dropdownBtn.dataset.boundTheory = '1';
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
                if (e.key === 'Escape' && !dropdownMenu.classList.contains('hidden')) {
                    toggle(false);
                    dropdownBtn.focus();
                }
            });
        }

        const mobileBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileClose = document.getElementById('mobileMenuClose');
        if (mobileBtn && mobileMenu && !mobileBtn.dataset.boundTheory) {
            mobileBtn.dataset.boundTheory = '1';
            const getFocusable = () => Array.from(
                mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            ).filter((el) => el.offsetParent !== null);

            const openMenu = () => {
                mobileMenu.classList.add('open');
                mobileMenu.setAttribute('aria-hidden', 'false');
                mobileBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
                const target = mobileClose || getFocusable()[0];
                if (target) {
                    requestAnimationFrame(() => target.focus());
                }
            };

            const closeMenu = (restoreFocus) => {
                if (!mobileMenu.classList.contains('open')) return;
                mobileMenu.classList.remove('open');
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                if (restoreFocus) {
                    mobileBtn.focus();
                }
            };

            mobileBtn.addEventListener('click', openMenu);
            if (mobileClose) mobileClose.addEventListener('click', () => closeMenu(true));
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) closeMenu(true);
            });
            mobileMenu.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => closeMenu(false));
            });
            document.addEventListener('keydown', (e) => {
                if (!mobileMenu.classList.contains('open')) return;
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeMenu(true);
                    return;
                }
                if (e.key === 'Tab') {
                    const focusables = getFocusable();
                    if (!focusables.length) return;
                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];
                    if (e.shiftKey) {
                        if (document.activeElement === first || !mobileMenu.contains(document.activeElement)) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else if (document.activeElement === last || !mobileMenu.contains(document.activeElement)) {
                        e.preventDefault();
                        first.focus();
                    }
                }
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
