# CARTOGRAFFECT — Vitrine Scientifique & Explorateur Interactif (v3.0.0)

Vitrine web statique (GitHub Pages) du programme théorique **CARTOGRAFFECT** : une architecture formelle et dimensionnelle de l'expérience affective fondée sur le traitement prédictif et l'inférence active.

## Statut Épistémique (V1 / V2 / V3)

- **V1 — Cohérence formelle :** Noyau normatif vérifié sous l'assistant de preuve de référence **Lean 4 (`v4.35.0`)** : `8` modules normatifs, `148` théorèmes substantiels / `169` déclarations exportées (`8` théorèmes piliers prioritaires), `0 sorry`, `0 native_decide` (utilise explicitement `Classical.choice` sur `84` déclarations). Extension canonique distincte : `PredictiveEngineCanonical.lean` (`16` théorèmes propres + `5` auxiliaires = `21` déclarations). Suite unitaire Python : `11` tests.
  - Les 5 autres prouveurs historiques de la v2.1 (Rocq, Agda, Dafny, SMT/Z3, TLA+/TLC en *bounded model checking* fini) sont archivés hors du cœur actif v3.0.
- **V2 — Cadre théorique :** Architecture v3.0.0 (`Option 1A` contrôlabilité instrumentale stricte `Y` découplée du canal autonome `A >= 0`, `Option 2a` dynamique verticale pas-à-pas + court-circuit `2 → 0`, `Option 3b` asymétrie Charge/Décharge sous P2, discrétisation canonique `Z ∈ {0, 1, 2}` à `11` états, profondeur continue `Z ∈ [0, 5]`, annexe exploratoire `176` états séparée du cœur normatif) avec `5` prédictions empiriques durcies (`P1–P5`).
- **V3 — Corroboration empirique :** `0` donnée humaine ou clinique recueillie à ce stade. Modèle heuristique et non diagnostique.

## Architecture & Synchronisation (Schema 2.0)

- **Source de vérité unique :** [`data/site-payload.json`](data/site-payload.json) (`schema_version = "2.0"`, `version = "3.0.0"`), exporté depuis le dépôt scientifique `CARTOGRAFFECT` (`scripts/export_site_payload.py`).
- **Validation & synchronisation :** `python scripts/sync_from_payload.py --apply` et `--check`.
- **Styles statiques & Préprint PDF :** Tailwind CSS précompilé dans `assets/styles.min.css` (aucune dépendance CDN runtime) ; prépublication compilée dans `assets/Cartograffect_v3.0.0_preprint.pdf`.

## Licences (Séparation physique Phase 3)

- **Code, scripts et visualisateurs JS/Python :** `AGPL-3.0-or-later`
- **Textes scientifiques, manuscrit, schémas et données :** `CC-BY-4.0`
- **Expression littéraire et graphique originale :** Dépôt OPIC / CIPO n° 1233199 (ne porte pas sur les idées scientifiques ni les formulations mathématiques).
