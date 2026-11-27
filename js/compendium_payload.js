/**
 * CARTOGRAFFECT® — Client Payload Loader (Strate 2)
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Charge `data/site-payload.json` (contrat déterministe émis par CARTOGRAFFECT)
 * avec repli synchrone propre sur les métadonnées embarquées lorsque la page
 * est ouverte hors-ligne ou via `file://`.
 */
(function (root) {
  'use strict';

  /* BEGIN:SITE_PAYLOAD_FALLBACK */
  const FALLBACK_PAYLOAD = {
      "schema_version": "1.0",
      "release": {
          "version": "2.1.0",
          "tag": "v2.1.0",
          "date": "2026-11-22",
          "changelog_highlights": [
              {
                  "section": "Added",
                  "title": "End-to-End Formal Bridge Across All 6 Provers (`EndToEndBridge`, `130/130` Strate 0 theorems, `0 sorry`)",
                  "summary": "added `Cartograffect/EndToEndBridge.lean` (`11` Lean modules, `130/130` theorems + `all176Entries_unique_labels`), `rocq/theories/EndToEndBridge.v` (`11/11` `.v` modules, `131/131` `Closed under the global context`, `Axioms: <none>`), `agda/src/Cartograffect/EndToEndBridge.agda` (`12/12` `.agda` modules `--safe --without-K`, `130/130` theorems + `all176Entries_unique_labels` + `11/11` evaluation blocks), `dafny/src/EndToEndBridge.dfy` (`11/11` modules, `132/132` lemmas, `3,021` verified obligations, `0` errors), `smt/theories/10_EndToEndBridge.smt2` (`10/10` `.smt2` files, `10/10` `sat` consistency, `130/130` `unsat` theorems, `2/2` `unsat` AUX, `11/11` `unsat` evals), and `tla/specs/EndToEndBridge.tla` + `Model_EndToEndBridge.tla` (`18/18` SANY modules, `132/132` predicates, `8/8` TLC models including liveness `<>(pt.z = 7)` across 598 states / 175 distinct)."
              },
              {
                  "section": "Added",
                  "title": "Canonical Predictive Engine Extension (`extensions/predictive_engine/PredictiveEngineCanonical.lean`, `extensions/predictive_engine/EPISTEMIC_STATUS.md`)",
                  "summary": "Lean 4 canonical extension (`21/21` theorems, `0 sorry`) formalizing arbitrations A1–A4 (isolated 3-circuit responses, direct projection of operability level `Z >= 1`, possible-set symbolic domains `{±X, ±Y, Z}`, information reduction `ΔH >= 0`, crown law, strict exclusion of `Veille (0,0,0)` from the Attentional Interface, active resolution vs. passive extinction, and operant/taxonomy/lexicon bridges)."
              },
              {
                  "section": "Added",
                  "title": "Single-Source-of-Truth Vector Diagram & Python Engine Alignment (`docs/assets/moteur_predictif_canonique.html`, `docs/assets/moteur_predictif_article.svg`, `python/cartograffect_predictive_engine.py`, `python/test_predictive_engine.py`)",
                  "summary": "canonical `#moteur-svg` vector source and standalone light-theme manuscript SVG export paired with isolated-response assembly, direct `Z` projection, `ΔH >= 0` entropy reduction, automated diagnosis of the 5 ergodicity breaks, `EndToEndBridge` operant helpers, and 18 unit tests."
              },
              {
                  "section": "Changed",
                  "title": "Editorial Alignment & Companion Website Sync (`docs/01-Article_Cartograffect.md`, `README.md`, `VALIDATION.md`, `docs/CONVERGENCE_MATRIX.md`, `manuelcabelguen-jpg.github.io`)",
                  "summary": "aligned Section 4 and Figure 1 on the canonical two-loop / six-circuit Predictive Engine (`v2.1.0`), updated Hexa-Prover verification counters (`130/130` Strate 0 theorems + `36/36` Strate 1 lexicon Lean theorems), regenerated `site-payload.json`, and synchronized companion web pages."
              },
              {
                  "section": "Verified",
                  "title": "Strate 0 Hexa-Prover Core & Strate 1 Lean Extensions (`0 sorry`, `0` custom axioms)",
                  "summary": "full 6-prover parity (`11` `.lean` modules, `130/130` verified Strate 0 theorems + `21/21` in `PredictiveEngineCanonical.lean`, and `4/4` Strate 1 lexicon Lean modules with `36/36` audited theorems in `PolarityAntipodal3D.lean` [4], `AuditGeometricLexicalPlacement.lean` [4], `EmotionWheelsChallenge.lean` [7], and `SchererGRID.lean` [21])."
              }
          ]
      },
      "identifiers": {
          "zenodo_code_doi": "10.5281/zenodo.23833938",
          "zenodo_article_doi": "10.5281/zenodo.24022795",
          "osf_url": "https://osf.io/z89sg",
          "cipo_registration": "1233199",
          "github_repo_url": "https://github.com/manuelcabelguen-jpg/CARTOGRAFFECT",
          "github_release_url": "https://github.com/manuelcabelguen-jpg/CARTOGRAFFECT/releases/tag/v2.1.0"
      },
      "strate_0_core": {
          "theorems_verified": 130,
          "sorry_count": 0,
          "custom_axioms_count": 0,
          "provers": [
              {
                  "name": "Lean 4",
                  "version": "4.35.0",
                  "entrypoint": "Cartograffect.lean",
                  "directory": "Cartograffect",
                  "modules_count": 11,
                  "theorems_count": 130
              },
              {
                  "name": "Rocq",
                  "version": "9.1.0",
                  "entrypoint": "rocq/theories/Cartograffect.v",
                  "directory": "rocq",
                  "modules_count": 11,
                  "theorems_count": 130,
                  "closed_assumptions_count": 131
              },
              {
                  "name": "Agda",
                  "version": "2.9.0",
                  "entrypoint": "agda/src/Cartograffect.agda",
                  "directory": "agda",
                  "modules_count": 12,
                  "theorems_count": 130,
                  "eval_blocks_count": 11
              },
              {
                  "name": "Dafny",
                  "version": "4.11.0",
                  "entrypoint": "dafny/src/Cartograffect.dfy",
                  "directory": "dafny",
                  "modules_count": 11,
                  "theorems_count": 130,
                  "lemmas_count": 132,
                  "obligations_verified": 3021,
                  "eval_blocks_count": 11
              },
              {
                  "name": "SMT/Z3",
                  "version": "5.3.3",
                  "entrypoint": "smt/theories/10_EndToEndBridge.smt2",
                  "directory": "smt",
                  "modules_count": 10,
                  "theorems_count": 130,
                  "consistency_sat_count": 10,
                  "aux_unsat_count": 2,
                  "eval_blocks_count": 11
              },
              {
                  "name": "TLA+/TLC",
                  "version": "2.19",
                  "entrypoint": "tla/specs/Cartograffect.tla",
                  "directory": "tla",
                  "modules_count": 18,
                  "theorems_count": 130,
                  "predicates_count": 132,
                  "eval_blocks_count": 11,
                  "tlc_models_count": 8
              }
          ],
          "lean_modules_count": 11,
          "lean_modules": [
              "Cartograffect.lean",
              "Cartograffect/PredictiveEngine.lean",
              "Cartograffect/CoreAffect.lean",
              "Cartograffect/AffectiveMatrix.lean",
              "Cartograffect/AffectiveTaxonomy.lean",
              "Cartograffect/AffectiveDynamics.lean",
              "Cartograffect/Lexicon176.lean",
              "Cartograffect/PredictiveCircuit.lean",
              "Cartograffect/AuditTests.lean",
              "Cartograffect/OperantFactorization.lean",
              "Cartograffect/EndToEndBridge.lean"
          ],
          "states_count": 176,
          "predictions_count": 5,
          "lexicon176_sha256": "e66dbd6b6630e11d72f786b00025dd909f80ad98331083f3c5f80802f1755b65",
          "author_affiliation": "Psychologue clinicien, chercheur indépendant en psychologie, Sainte-Agathe-des-Monts, Québec, Canada"
      },
      "strate_1_extensions": {
          "lexicon": {
              "path": "extensions/lexicon",
              "status": "exploratory_subordinate",
              "epistemic_status_file": "extensions/lexicon/EPISTEMIC_STATUS.md",
              "theorems_verified": 10,
              "sorry_count": 0,
              "lean_challenges_count": 3,
              "summary": "Audit lexical et géométrique exploratoire de Strate 1 (10/10 théorèmes géométriques Lean 4 dans extensions/lexicon/lean/, 0 sorry, 0 constante statistique Python codée en dur ; banc GEW 3.0 / Plutchik sans surcharges manuelles avec H2 et H4 rapportées comme non corroborées) ; statut exploratoire subordonné à la Strate 0 ; extension axiologique Z- (« Diamant 303 ») strictement cloisonnée hors de l'axiomatique Z in {0..7}."
          },
          "in_silico": {
              "path": "extensions/in_silico",
              "status": "exploratory_subordinate",
              "epistemic_status_file": "extensions/in_silico/EPISTEMIC_STATUS.md",
              "predictions_tested": [
                  "P1",
                  "P2",
                  "P3",
                  "P4",
                  "P5"
              ],
              "experiments_count": 5,
              "a4_sanctuaire_policy": "Respect absolu de l'arbitrage A4-Sanctuaire : aucune métrique quantitative in silico (PXP, min r) n'est injectée dans le corps théorique de l'article canonique ; Exp 4–5 DSM-5 / HiTOP isolées en quarantaine dans exploratory_synthetic/ (SYNTHETIC EXPLORATORY ONLY — V3 = 0).",
              "summary": "Banc compagnon de simulation Active Inference (Exp 1–3 : test de cohérence numérique du projecteur budgétaire P1, cohérence générative interne P2–P5 et identifiabilité bayésienne ; Exp 4–5 DSM-5 / HiTOP en quarantaine exploratory_synthetic/ — SYNTHETIC EXPLORATORY ONLY, V3 = 0), strictement subordonné à la Strate 0."
          }
      },
      "ai_disclosure": {
          "author_ownership": "L’architecture conceptuelle, la psychologie affective, la taxonomie des 176 états et l’orientation théorique de CARTOGRAFFECT® sont entièrement conçues et assumées par l’auteur.",
          "ai_assistance_scope": "Des outils d’IA générative ont servi d’assistants techniques pour la rédaction, le site web, la traduction et la transposition exploratoire de propriétés du modèle vers des assistants de preuve formelle (Lean 4, Rocq, Agda, Dafny, Z3, TLA+) et des scripts sur GitHub.",
          "verification_and_audit_status": "Psychologue clinicien et non mathématicien formel, l’auteur n’a pas vérifié manuellement ligne par ligne le code mathématique/formel généré ; la validité technique repose sur la compilation mécanique des prouveurs et les tests automatisés. Ce matériel est publié en accès libre sur GitHub pour inviter l’audit indépendant de mathématiciens et de spécialistes des méthodes formelles.",
          "summary_en": "The conceptual architecture, affective psychology, taxonomy, and theoretical orientation of CARTOGRAFFECT® are conceived and owned entirely by the author. Generative AI served as a technical assistant for writing, website engineering, translation, and exploratory formal-method transposition (Lean 4, Rocq, Agda, Dafny, Z3, TLA+) and GitHub scripts. As a clinical psychologist and not a formal mathematician, the author has not manually verified generated formal code line by line; technical validity relies on mechanical prover compilation and automated tests, and the code is open-sourced on GitHub to invite independent specialist audit."
      },
      "licenses": {
          "spdx_expression": "AGPL-3.0-or-later AND CC-BY-NC-SA-4.0",
          "code_license": "GNU AGPLv3",
          "theory_license": "CC BY-NC-SA 4.0",
          "hybrid_clause_summary": "For hybrid files containing both executable/formal structures and the theoretical taxonomy/coordinates, the formal/software structure is licensed under AGPL-3.0-or-later while the nomenclature, coordinates, and 176-state/303-pole taxonomic architecture remain exclusively governed by CC BY-NC-SA 4.0 (commercial extraction of the taxonomy is strictly prohibited)."
      }
  };
  /* END:SITE_PAYLOAD_FALLBACK */

  function getByPath(obj, path) {
    if (!obj || !path) return undefined;
    const parts = String(path).split('.');
    let cur = obj;
    for (let i = 0; i < parts.length; i += 1) {
      if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  const SHORT_ALIASES = {
    version: 'release.version',
    tag: 'release.tag',
    date: 'release.date',
    zenodo_code_doi: 'identifiers.zenodo_code_doi',
    zenodo_article_doi: 'identifiers.zenodo_article_doi',
    osf_url: 'identifiers.osf_url',
    cipo_registration: 'identifiers.cipo_registration',
    github_repo_url: 'identifiers.github_repo_url',
    theorems_verified: 'strate_0_core.theorems_verified',
    sorry_count: 'strate_0_core.sorry_count',
    provers_count: 'strate_0_core.provers_count',
    lean_modules_count: 'strate_0_core.lean_modules_count',
    states_count: 'strate_0_core.states_count',
    predictions_count: 'strate_0_core.predictions_count',
    author_affiliation: 'strate_0_core.author_affiliation',
    spdx_expression: 'licenses.spdx_expression',
    code_license: 'licenses.code_license',
    theory_license: 'licenses.theory_license'
  };

  function resolveValue(payload, path) {
    if (path === 'version_label') {
      const ver = getByPath(payload, 'release.version');
      return ver !== undefined && ver !== null ? ('Version ' + ver) : undefined;
    }
    const targetPath = Object.prototype.hasOwnProperty.call(SHORT_ALIASES, path)
      ? SHORT_ALIASES[path]
      : path;
    if (targetPath === 'strate_0_core.provers_count') {
      const provers = getByPath(payload, 'strate_0_core.provers');
      return Array.isArray(provers) ? provers.length : undefined;
    }
    if (targetPath === 'strate_0_core.provers_names') {
      const provers = getByPath(payload, 'strate_0_core.provers');
      return Array.isArray(provers) ? provers.map(p => p.name).join(', ') : undefined;
    }
    return getByPath(payload, targetPath);
  }

  function hydrateDOM(payload) {
    if (typeof document === 'undefined') return;
    const nodes = document.querySelectorAll('[data-payload]');
    nodes.forEach(function (el) {
      const key = el.getAttribute('data-payload');
      const val = resolveValue(payload, key);
      if (val !== undefined && val !== null && typeof val !== 'object') {
        el.textContent = String(val);
      }
    });
  }

  function resolvePayloadUrl() {
    if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
      try {
        return new URL('../data/site-payload.json', document.currentScript.src).toString();
      } catch (_err) {
        // fallback below
      }
    }
    return 'data/site-payload.json';
  }

  const payloadUrl = resolvePayloadUrl();

  const api = {
    fallback: FALLBACK_PAYLOAD,
    current: FALLBACK_PAYLOAD,
    get: function (path, fallbackValue) {
      const val = resolveValue(api.current, path);
      return val !== undefined ? val : fallbackValue;
    },
    hydrate: function () {
      hydrateDOM(api.current);
    },
    ready: null
  };

  if (typeof fetch === 'function' && typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:') {
    api.ready = fetch(payloadUrl, { cache: 'no-cache' })
      .then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (json) {
        if (json && json.schema_version && json.release && json.strate_0_core) {
          api.current = json;
        }
        hydrateDOM(api.current);
        if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
          window.dispatchEvent(new CustomEvent('cartograffect:payload-ready', { detail: api.current }));
        }
        return api.current;
      })
      .catch(function () {
        hydrateDOM(api.current);
        return api.current;
      });
  } else {
    api.ready = Promise.resolve(FALLBACK_PAYLOAD);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        hydrateDOM(api.current);
      });
    } else {
      hydrateDOM(api.current);
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.CartograffectPayload = api;
  }
})(typeof window !== 'undefined' ? window : this);
