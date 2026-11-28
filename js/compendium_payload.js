/**
 * CARTOGRAFFECT — Shared Canonical Payload Loader & Fallback (schema 2.0)
 * Auto-synchronized from CARTOGRAFFECT data/site-payload.json (v3.0.0).
 * License: AGPL-3.0-or-later (code/scripts).
 */
(function (global) {
  'use strict';

  // BEGIN_PAYLOAD_FALLBACK
  const FALLBACK_PAYLOAD = {
    "schema_version": "2.0",
    "release": {
      "version": "3.0.0",
      "tag": "v3.0.0",
      "date": "2026-11-26",
      "changelog_highlights": []
    },
    "identifiers": {
      "zenodo_code_doi": "10.5281/zenodo.23833938",
      "zenodo_article_doi": "10.5281/zenodo.24022795",
      "osf_url": "https://osf.io/z89sg",
      "cipo_registration": "1233199",
      "github_repo_url": "https://github.com/manuelcabelguen-jpg/CARTOGRAFFECT",
      "github_release_url": "https://github.com/manuelcabelguen-jpg/CARTOGRAFFECT/releases/tag/v3.0.0"
    },
    "strate_0_core": {
      "reference_prover": "Lean 4",
      "prover_version": "4.35.0",
      "normative_modules_count": 8,
      "normative_lean_modules": [
        "Cartograffect/PredictiveEngine.lean",
        "Cartograffect/CoreAffect.lean",
        "Cartograffect/AffectiveMatrix.lean",
        "Cartograffect/AffectiveTaxonomy.lean",
        "Cartograffect/AffectiveDynamics.lean",
        "Cartograffect/PredictiveCircuit.lean",
        "Cartograffect/OperantFactorization.lean",
        "Cartograffect/EndToEndBridge.lean"
      ],
      "theorems_substantial": 148,
      "exported_declarations": 169,
      "auxiliary_lemmas": 21,
      "pillar_theorems_count": 8,
      "sorry_count": 0,
      "native_decide_count": 0,
      "custom_axioms_count": 0,
      "audit_pack": "FORMAL_AUDIT_PACK.md",
      "canonical_extension": {
        "path": "extensions/predictive_engine/PredictiveEngineCanonical.lean",
        "theorems_own": 16,
        "auxiliary_lemmas": 5,
        "exported_declarations": 21
      },
      "python_unit_tests_count": 11,
      "manuscript_path": "docs/01-Article_Cartograffect.md",
      "inventory_annex_path": "docs/02-Inventaire_176.md",
      "continuous_depth_range": "Z in [0, 5]",
      "canonical_discretization": "Z in {0, 1, 2}",
      "canonical_states_count": 11,
      "predictions_count": 5,
      "author_affiliation": "Psychologue clinicien, chercheur indépendant en psychologie, Sainte-Agathe-des-Monts, Québec, Canada",
      "legacy_v2_1_archived_provers": [
        {
          "name": "Rocq",
          "version": "9.1.0",
          "status": "archived_v2_1_frozen",
          "directory": "rocq"
        },
        {
          "name": "Agda",
          "version": "2.9.0",
          "status": "archived_v2_1_frozen",
          "directory": "agda"
        },
        {
          "name": "Dafny",
          "version": "4.11.0",
          "status": "archived_v2_1_frozen",
          "directory": "dafny"
        },
        {
          "name": "SMT/Z3",
          "version": "5.3.3",
          "status": "archived_v2_1_frozen",
          "directory": "smt"
        },
        {
          "name": "TLA+/TLC",
          "version": "2.19",
          "status": "archived_v2_1_frozen_bounded_model_checking",
          "directory": "tla"
        }
      ]
    },
    "exploratory_annexes": {
      "lexicon_176": {
        "status": "exploratory_annex_outside_normative_core",
        "path": "Cartograffect/Lexicon176.lean",
        "inventory_doc": "docs/02-Inventaire_176.md",
        "states_count": 176,
        "sha256": "e318b1d02750b82c1d86859e7af1be81459c604099283d3b7c2a11af4987771a"
      }
    },
    "strate_1_extensions": {
      "lexicon": {
        "path": "extensions/lexicon",
        "status": "exploratory_subordinate",
        "epistemic_status_file": "extensions/lexicon/EPISTEMIC_STATUS.md",
        "archive_warning_file": "extensions/lexicon/ARCHIVE_V2_HYBRID_Y_WARNING.md",
        "data_provenance_file": "DATA_PROVENANCE.md",
        "theorems_verified": 10,
        "sorry_count": 0,
        "lean_challenges_count": 3,
        "summary": "Audit lexical et géométrique exploratoire de Strate 1 (3 modules actifs dans extensions/lexicon/lean/, 10/10 théorèmes géométriques Lean 4, 0 sorry, 0 constante statistique Python codée en dur ; banc GEW 3.0 / Plutchik sans surcharges manuelles avec H2 et H4 rapportées comme non corroborées ; tables TSV v2.1.0 signalées comme archive historique sous ancien axe Y hybride)."
      },
      "in_silico": {
        "path": "extensions/in_silico",
        "status": "exploratory_subordinate",
        "epistemic_status_file": "extensions/in_silico/EPISTEMIC_STATUS.md",
        "lockfile": "extensions/in_silico/uv.lock",
        "predictions_tested": [
          "P1",
          "P2",
          "P3",
          "P4",
          "P5"
        ],
        "active_experiments_count": 3,
        "quarantined_experiments_count": 2,
        "a4_sanctuaire_policy": "Respect absolu de l'arbitrage A4-Sanctuaire : aucune métrique quantitative in silico (PXP, min r) n'est injectée dans le corps théorique de l'article canonique ; Exp 4-5 DSM-5 / HiTOP isolées en quarantaine dans exploratory_synthetic/ (SYNTHETIC EXPLORATORY ONLY — V3 = 0).",
        "summary": "Banc compagnon de simulation Active Inference (Exp 1-3 : test de cohérence numérique du projecteur budgétaire P1, cohérence générative interne P2-P5 et identifiabilité bayésienne ; Exp 4-5 DSM-5 / HiTOP en quarantaine exploratory_synthetic/ — SYNTHETIC EXPLORATORY ONLY, V3 = 0), strictement subordonné à la Strate 0."
      }
    },
    "ai_disclosure": {
      "author_ownership": "L'architecture conceptuelle, la psychologie affective, les arbitrages taxonomiques et l'orientation théorique de CARTOGRAFFECT sont entièrement conçus et assumés par l'auteur.",
      "ai_assistance_scope": "Des outils d'IA générative ont servi d'assistants techniques pour l'aide à la rédaction, la réalisation du site web vitrine, la traduction et la formalisation sous l'assistant de preuve de référence Lean 4 (ainsi que pour les annexes exploratoires archivées sur GitHub).",
      "verification_and_audit_status": "Psychologue clinicien et non mathématicien formel, l'auteur n'a pas vérifié manuellement ligne par ligne le code mathématique et formel généré ; la validité technique repose sur la compilation et vérification mécanique par les prouveurs ainsi que sur les tests automatisés. L'ensemble est publié en accès libre sur GitHub pour inviter l'audit indépendant de mathématiciens et de spécialistes des méthodes formelles.",
      "summary_en": "The conceptual architecture, affective psychology, taxonomic decisions, and theoretical orientation of CARTOGRAFFECT are conceived and owned entirely by the author. Generative AI served as a technical assistant for writing, website engineering, translation, and formalization in the reference Lean 4 proof assistant (and archived exploratory annexes). As a clinical psychologist and not a formal mathematician, the author has not manually verified generated formal code line by line; technical validity relies on mechanical prover compilation and automated tests, and all artifacts are open-sourced on GitHub to invite independent specialist audit."
    },
    "licenses": {
      "code_spdx": "AGPL-3.0-or-later",
      "docs_and_data_spdx": "CC-BY-4.0",
      "spdx_expression": "AGPL-3.0-or-later AND CC-BY-4.0",
      "code_license": "GNU AGPLv3 (AGPL-3.0-or-later)",
      "docs_and_taxonomy_license": "Creative Commons Attribution 4.0 International (CC-BY-4.0)",
      "physical_separation_policy": "Strict physical separation by file type (no hybrid NC clause): all source code, scripts, and formal proofs are licensed solely under OSI-approved AGPL-3.0-or-later; all texts, manuscript (docs/), documentation, and taxonomic tables are licensed under CC-BY-4.0. Zero non-commercial (NC) restriction applies to any source code or v3.0.0 artifact.",
      "non_commercial_clauses_in_code": false
    }
  };
  // END_PAYLOAD_FALLBACK

  const SHORT_ALIASES = {
    version: 'release.version',
    tag: 'release.tag',
    date: 'release.date',
    zenodo_code_doi: 'identifiers.zenodo_code_doi',
    zenodo_article_doi: 'identifiers.zenodo_article_doi',
    osf_url: 'identifiers.osf_url',
    cipo_registration: 'identifiers.cipo_registration',
    github_repo_url: 'identifiers.github_repo_url',
    github_release_url: 'identifiers.github_release_url',
    reference_prover: 'strate_0_core.reference_prover',
    prover_version: 'strate_0_core.prover_version',
    normative_modules_count: 'strate_0_core.normative_modules_count',
    lean_modules_count: 'strate_0_core.normative_modules_count',
    'strate_0_core.lean_modules_count': 'strate_0_core.normative_modules_count',
    theorems_substantial: 'strate_0_core.theorems_substantial',
    theorems_verified: 'strate_0_core.theorems_substantial',
    'strate_0_core.theorems_verified': 'strate_0_core.theorems_substantial',
    exported_declarations: 'strate_0_core.exported_declarations',
    auxiliary_lemmas: 'strate_0_core.auxiliary_lemmas',
    pillar_theorems_count: 'strate_0_core.pillar_theorems_count',
    sorry_count: 'strate_0_core.sorry_count',
    canonical_ext_theorems: 'strate_0_core.canonical_extension.theorems_own',
    canonical_ext_aux: 'strate_0_core.canonical_extension.auxiliary_lemmas',
    canonical_ext_declarations: 'strate_0_core.canonical_extension.exported_declarations',
    python_unit_tests_count: 'strate_0_core.python_unit_tests_count',
    canonical_states_count: 'strate_0_core.canonical_states_count',
    canonical_discretization: 'strate_0_core.canonical_discretization',
    continuous_depth_range: 'strate_0_core.continuous_depth_range',
    states_count: 'exploratory_annexes.lexicon_176.states_count',
    'strate_0_core.states_count': 'exploratory_annexes.lexicon_176.states_count',
    predictions_count: 'strate_0_core.predictions_count',
    author_affiliation: 'strate_0_core.author_affiliation',
    spdx_expression: 'licenses.spdx_expression',
    code_license: 'licenses.code_license',
    code_spdx: 'licenses.code_spdx',
    docs_and_data_spdx: 'licenses.docs_and_data_spdx',
    theory_license: 'licenses.docs_and_taxonomy_license'
  };

  let activePayload = JSON.parse(JSON.stringify(FALLBACK_PAYLOAD));

  function getByPath(obj, dotPath) {
    if (!obj || !dotPath) return undefined;
    const parts = dotPath.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length; i++) {
      if (cur === null || cur === undefined || typeof cur !== 'object') {
        return undefined;
      }
      cur = cur[parts[i]];
    }
    return cur;
  }

  function resolveValue(key, source) {
    const payload = source || activePayload;
    if (key === 'version_label') {
      const ver = getByPath(payload, 'release.version');
      return ver !== undefined ? 'Version ' + ver : undefined;
    }
    if (key === 'provers_count' || key === 'strate_0_core.provers_count') {
      return getByPath(payload, 'strate_0_core.reference_prover') ? 1 : undefined;
    }
    if (key === 'archived_provers_count') {
      const arr = getByPath(payload, 'strate_0_core.legacy_v2_1_archived_provers');
      return Array.isArray(arr) ? arr.length : undefined;
    }
    const mapped = SHORT_ALIASES[key] || key;
    let val = getByPath(payload, mapped);
    if (val === undefined && mapped !== key) {
      val = getByPath(payload, key);
    }
    return val;
  }

  function hydrateDOM(root) {
    if (typeof document === 'undefined') return;
    const scope = root || document;
    const nodes = scope.querySelectorAll('[data-payload]');
    nodes.forEach(function (el) {
      const key = el.getAttribute('data-payload');
      const val = resolveValue(key, activePayload);
      if (val !== undefined && val !== null) {
        const attr = el.getAttribute('data-payload-attr');
        const strVal = String(val);
        if (attr) {
          el.setAttribute(attr, strVal);
        } else {
          el.textContent = strVal;
        }
      }
    });
  }

  let resolveReady;
  const readyPromise = new Promise(function (resolve) {
    resolveReady = resolve;
  });

  function mergeDeep(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(function (k) {
      if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
        if (!target[k] || typeof target[k] !== 'object') target[k] = {};
        mergeDeep(target[k], source[k]);
      } else {
        target[k] = source[k];
      }
    });
    return target;
  }

  function loadRemote() {
    if (typeof fetch !== 'function' || typeof window === 'undefined') {
      resolveReady(activePayload);
      return Promise.resolve(activePayload);
    }
    if (window.location && window.location.protocol === 'file:') {
      hydrateDOM();
      resolveReady(activePayload);
      return Promise.resolve(activePayload);
    }
    const base = (window.location && window.location.pathname && window.location.pathname.indexOf('/CARTOGRAFFECT/') !== -1)
      ? '/CARTOGRAFFECT/data/site-payload.json'
      : './data/site-payload.json';
    return fetch(base, { cache: 'no-cache' })
      .then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (remote) {
        activePayload = mergeDeep(JSON.parse(JSON.stringify(FALLBACK_PAYLOAD)), remote);
        hydrateDOM();
        if (typeof document !== 'undefined') {
          document.dispatchEvent(new CustomEvent('cartograffect:payload-ready', { detail: activePayload }));
        }
        resolveReady(activePayload);
        return activePayload;
      })
      .catch(function () {
        hydrateDOM();
        resolveReady(activePayload);
        return activePayload;
      });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        hydrateDOM();
        loadRemote();
      });
    } else {
      hydrateDOM();
      loadRemote();
    }
  } else {
    resolveReady(activePayload);
  }

  global.CartograffectPayload = {
    get: function (key, fallback) {
      const val = resolveValue(key, activePayload);
      return val !== undefined ? val : fallback;
    },
    getRaw: function () {
      return activePayload;
    },
    hydrate: hydrateDOM,
    ready: readyPromise,
    reload: loadRemote
  };
})(typeof window !== 'undefined' ? window : globalThis);
