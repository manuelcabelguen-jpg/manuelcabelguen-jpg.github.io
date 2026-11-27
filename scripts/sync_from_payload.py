#!/usr/bin/env python3
"""
CARTOGRAFFECT — Phase 4 Payload Synchronization & Go/No-Go Validator (schema 2.0, v3.0.0).

Single Source of Truth: data/site-payload.json exported from CARTOGRAFFECT commit ca62e90.
Usage:
    python scripts/sync_from_payload.py --check
    python scripts/sync_from_payload.py --apply
"""
from __future__ import annotations

import argparse
import hashlib
import html as html_lib
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
PAYLOAD_PATH = ROOT / "data" / "site-payload.json"
COMPENDIUM_JS_PATH = ROOT / "js" / "compendium_payload.js"
CITATION_PATH = ROOT / "CITATION.cff"
MODEL_JS_PATH = ROOT / "cartograffect_model.js"
THEORY_JS_PATH = ROOT / "cartograffect_theory.js"

HTML_FILES = [
    "index.html",
    "article.html",
    "scholar_drive.html",
    "moteur-predictif.html",
    "noyau-affectif.html",
    "matrice-affective.html",
    "taxonomie-affective.html",
    "mentions-legales.html",
    "voyage.html",
    "emotions.html",
    "maintenance.html",
    "404.html",
]

SCAN_EXTENSIONS = {".html", ".js", ".md", ".cff", ".txt", ".json", ".yml", ".yaml", ".py"}
SKIP_DIRS = {".git", "node_modules", "__pycache__"}
SKIP_FILES = {"CHANGELOG.md"}

# Built via concatenation so this script itself never matches banned literals.
RED_LIST_PATTERNS: list[tuple[str, str]] = [
    ("reg_symbol", r"CARTOGRAFFECT(?:" + chr(174) + r"|&" + r"reg;)"),
    ("trademark_claim", r"Marque d[e\u00e9]pos[e\u00e9]" + r"e|Registered Trade" + r"mark"),
    ("nc_clause_in_js_or_active", r"CC[- ]?BY[- ]?" + r"NC[- ]?SA"),
    ("tail_cdn", r"cdn\.tailwind" + r"css\.com"),
    ("maintenance_guard", r"maintenance_" + r"guard\.js"),
    ("algorithme_36", r"#?algorithme-" + r"36\b"),
    ("friston_cabelguen", r"Friston\s*(?:&amp;|&)\s*" + r"Cabelguen"),
    ("regle_90s", r"r[e\u00e8]gle\s+des\s+" + r"90\s*s"),
    ("synthese_definitive", r"Synth[e\u00e8]se\s+D[e\u00e9]" + r"finitive"),
    ("clivages_historiques", r"clivages\s+" + r"historiques"),
    ("theoremes_constructifs", r"th[e\u00e9]or[e\u00e8]mes\s+" + r"constructifs"),
    ("martin_lof", r"Martin[- ]L[o\u00f6]" + r"f"),
    ("intuition_claim", r"\bintuition" + r"niste\b"),
    ("socle_certifie", r"Socle\s+Scientifique\s+Certifi" + r"[e\u00e9]"),
    ("grid_9502", r"\b95" + r"02\b|0\.95" + r"02|0\.87" + r"62|91[,.]" + r"3\s*%"),
    ("patient_clinical", r"votre\s+" + r"patient"),
    ("aussi_rigoureuses", r"aussi\s+rigoureuses\s+que\s+la\s+g[e\u00e9]om" + r"[e\u00e9]trie"),
    ("equilibre_naturel", r"loi\s+d['\u2019][e\u00e9]quilibre\s+" + r"naturel"),
    ("loi_universelle", r"Loi\s+universelle\s+de\s+conservation\s+" + r"attentionnelle"),
    ("flou_arbitraire", r"sans\s+le\s+moindre\s+flou\s+" + r"arbitraire"),
    ("premiere_carte", r"premi[e\u00e8]re\s+carte\s+interactive\s+de\s+l['\u2019]esprit\s+" + r"pr[e\u00e9]dictif"),
    ("revolution_claim", r"\bLa\s+r[e\u00e9]vo" + r"lution\s+de\s+l['\u2019]esprit\s+pr[e\u00e9]dictif|\bR[e\u00e9]vo" + r"lution\s+conceptuelle\b"),
    ("bad_pdf_meta", r"citation_pdf_url[^>\n]*article\." + r"html"),
    ("bad_antagonist_formula", r"-sgn\(X\)" + r"Y\b"),
]

# Aliases mapping data-payload attribute keys to schema 2.0 paths
SHORT_ALIASES = {
    "version": "release.version",
    "tag": "release.tag",
    "date": "release.date",
    "zenodo_code_doi": "identifiers.zenodo_code_doi",
    "zenodo_article_doi": "identifiers.zenodo_article_doi",
    "osf_url": "identifiers.osf_url",
    "cipo_registration": "identifiers.cipo_registration",
    "github_repo_url": "identifiers.github_repo_url",
    "github_release_url": "identifiers.github_release_url",
    "reference_prover": "strate_0_core.reference_prover",
    "prover_version": "strate_0_core.prover_version",
    "normative_modules_count": "strate_0_core.normative_modules_count",
    "lean_modules_count": "strate_0_core.normative_modules_count",
    "strate_0_core.lean_modules_count": "strate_0_core.normative_modules_count",
    "theorems_substantial": "strate_0_core.theorems_substantial",
    "theorems_verified": "strate_0_core.theorems_substantial",
    "strate_0_core.theorems_verified": "strate_0_core.theorems_substantial",
    "exported_declarations": "strate_0_core.exported_declarations",
    "auxiliary_lemmas": "strate_0_core.auxiliary_lemmas",
    "pillar_theorems_count": "strate_0_core.pillar_theorems_count",
    "sorry_count": "strate_0_core.sorry_count",
    "canonical_ext_theorems": "strate_0_core.canonical_extension.theorems_own",
    "canonical_ext_aux": "strate_0_core.canonical_extension.auxiliary_lemmas",
    "canonical_ext_declarations": "strate_0_core.canonical_extension.exported_declarations",
    "python_unit_tests_count": "strate_0_core.python_unit_tests_count",
    "canonical_states_count": "strate_0_core.canonical_states_count",
    "canonical_discretization": "strate_0_core.canonical_discretization",
    "continuous_depth_range": "strate_0_core.continuous_depth_range",
    "states_count": "exploratory_annexes.lexicon_176.states_count",
    "strate_0_core.states_count": "exploratory_annexes.lexicon_176.states_count",
    "predictions_count": "strate_0_core.predictions_count",
    "author_affiliation": "strate_0_core.author_affiliation",
    "spdx_expression": "licenses.spdx_expression",
    "code_license": "licenses.code_license",
    "code_spdx": "licenses.code_spdx",
    "docs_and_data_spdx": "licenses.docs_and_data_spdx",
    "theory_license": "licenses.docs_and_taxonomy_license",
}


def get_by_path(obj: dict[str, Any], dot_path: str) -> Any:
    cur: Any = obj
    for part in dot_path.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


def resolve_payload_value(key: str, payload: dict[str, Any]) -> Any:
    if key == "version_label":
        v = get_by_path(payload, "release.version")
        return f"Version {v}" if v is not None else None
    if key in ("provers_count", "strate_0_core.provers_count"):
        return 1 if get_by_path(payload, "strate_0_core.reference_prover") else None
    if key == "archived_provers_count":
        arr = get_by_path(payload, "strate_0_core.legacy_v2_1_archived_provers")
        return len(arr) if isinstance(arr, list) else None
    mapped = SHORT_ALIASES.get(key, key)
    val = get_by_path(payload, mapped)
    if val is None and mapped != key:
        val = get_by_path(payload, key)
    return val


def validate_payload_schema(payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if payload.get("schema_version") != "2.0":
        errors.append(f"schema_version must be '2.0', got {payload.get('schema_version')!r}")
    rel = payload.get("release", {})
    if rel.get("version") != "3.0.0":
        errors.append(f"release.version must be '3.0.0', got {rel.get('version')!r}")
    core = payload.get("strate_0_core", {})
    checks = {
        "normative_modules_count": 8,
        "theorems_substantial": 148,
        "exported_declarations": 169,
        "pillar_theorems_count": 8,
        "sorry_count": 0,
        "native_decide_count": 0,
        "python_unit_tests_count": 11,
        "predictions_count": 5,
    }
    for field, expected in checks.items():
        if core.get(field) != expected:
            errors.append(f"strate_0_core.{field}: expected {expected!r}, got {core.get(field)!r}")
    ext = core.get("canonical_extension", {})
    if ext.get("theorems_own") != 16 or ext.get("auxiliary_lemmas") != 5 or ext.get("exported_declarations") != 21:
        errors.append(f"strate_0_core.canonical_extension mismatch: {ext!r}")
    lic = payload.get("licenses", {})
    if lic.get("spdx_expression") != "AGPL-3.0-or-later AND CC-BY-4.0":
        errors.append(f"licenses.spdx_expression mismatch: {lic.get('spdx_expression')!r}")
    if lic.get("non_commercial_clauses_in_code") is not False:
        errors.append("licenses.non_commercial_clauses_in_code must be False")
    return errors


def build_sanitized_fallback(payload: dict[str, Any]) -> dict[str, Any]:
    copy = json.loads(json.dumps(payload, ensure_ascii=False))
    if isinstance(copy.get("release"), dict):
        copy["release"]["changelog_highlights"] = []
    return copy


def sync_compendium_js(payload: dict[str, Any], apply_changes: bool) -> list[str]:
    issues: list[str] = []
    if not COMPENDIUM_JS_PATH.exists():
        return [f"Missing {COMPENDIUM_JS_PATH}"]
    content = COMPENDIUM_JS_PATH.read_text(encoding="utf-8")
    begin_marker = "// BEGIN_PAYLOAD_FALLBACK"
    end_marker = "// END_PAYLOAD_FALLBACK"
    if begin_marker not in content or end_marker not in content:
        return ["compendium_payload.js missing BEGIN/END_PAYLOAD_FALLBACK markers"]

    fallback_obj = build_sanitized_fallback(payload)
    json_str = json.dumps(fallback_obj, indent=2, ensure_ascii=False)
    indented = "\n".join("  " + line if line else "" for line in json_str.splitlines())
    replacement_block = f"{begin_marker}\n  const FALLBACK_PAYLOAD = {indented.lstrip()};\n  {end_marker}"

    pattern = re.compile(re.escape(begin_marker) + r".*?" + re.escape(end_marker), re.DOTALL)
    new_content = pattern.sub(lambda _: replacement_block, content, count=1)
    if new_content != content:
        if apply_changes:
            COMPENDIUM_JS_PATH.write_text(new_content, encoding="utf-8")
        else:
            issues.append("js/compendium_payload.js FALLBACK_PAYLOAD out of sync with data/site-payload.json")
    return issues


def sync_citation_cff(payload: dict[str, Any], apply_changes: bool) -> list[str]:
    issues: list[str] = []
    if not CITATION_PATH.exists():
        return ["Missing CITATION.cff"]
    content = CITATION_PATH.read_text(encoding="utf-8")
    rel = payload["release"]
    ids = payload["identifiers"]
    expected_lines = [
        f"version: {rel['version']}",
        f'date-released: "{rel["date"]}"',
        f'doi: "{ids["zenodo_article_doi"]}"',
        "  - AGPL-3.0-or-later",
        "  - CC-BY-4.0",
    ]
    updated = content
    updated = re.sub(r"^version:\s*.*$", f"version: {rel['version']}", updated, flags=re.MULTILINE)
    updated = re.sub(r"^date-released:\s*.*$", f'date-released: "{rel["date"]}"', updated, flags=re.MULTILINE)
    updated = re.sub(r'^doi:\s*".*"$', f'doi: "{ids["zenodo_article_doi"]}"', updated, flags=re.MULTILINE)
    if updated != content:
        if apply_changes:
            CITATION_PATH.write_text(updated, encoding="utf-8")
            content = updated
        else:
            issues.append("CITATION.cff metadata fields out of sync with payload")
    for line in expected_lines:
        if line not in content:
            issues.append(f"CITATION.cff missing expected line: {line}")
    return issues


def sync_and_check_html_payload_spans(payload: dict[str, Any], apply_changes: bool) -> list[str]:
    issues: list[str] = []
    span_re = re.compile(
        r'(<(?P<tag>[a-zA-Z0-9]+)\b[^>]*\bdata-payload="(?P<key>[^"]+)"[^>]*>)(?P<inner>[^<]*)(</(?P=tag)>)'
    )
    for rel_path in HTML_FILES:
        path = ROOT / rel_path
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        changed = False

        def _repl(match: re.Match[str]) -> str:
            nonlocal changed
            key = match.group("key")
            val = resolve_payload_value(key, payload)
            if val is None:
                issues.append(f"{rel_path}: unresolved data-payload key {key!r}")
                return match.group(0)
            expected = str(val)
            current = html_lib.unescape(match.group("inner")).strip()
            if current != expected:
                if apply_changes:
                    changed = True
                    return f"{match.group(1)}{html_lib.escape(expected, quote=False)}{match.group(5)}"
                issues.append(f"{rel_path}: [data-payload={key!r}] has {current!r}, expected {expected!r}")
            return match.group(0)

        new_text = span_re.sub(_repl, text)
        if apply_changes and changed and new_text != text:
            path.write_text(new_text, encoding="utf-8")
    return issues


def check_red_list() -> list[str]:
    issues: list[str] = []
    compiled = [(name, re.compile(pat, re.IGNORECASE)) for name, pat in RED_LIST_PATTERNS]
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        if path.name in SKIP_FILES or path.suffix.lower() not in SCAN_EXTENSIONS:
            continue
        # data/site-payload.json intentionally retains changelog history verbatim from upstream repo
        if rel.as_posix() == "data/site-payload.json":
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for line_no, line in enumerate(text.splitlines(), 1):
            for name, regex in compiled:
                if regex.search(line):
                    # Markdown/CITATION only banned for active NC in .js; check NC globally except git history notes
                    issues.append(f"REDLIST[{name}] {rel.as_posix()}:{line_no}: {line.strip()[:120]}")
    return issues


def check_js_model_and_theory() -> list[str]:
    issues: list[str] = []
    if MODEL_JS_PATH.exists():
        mtxt = MODEL_JS_PATH.read_text(encoding="utf-8")
        # Extract data entry tuples: name & coordinates & group
        entries = re.findall(r'"?x"?:\s*(-?\d+),\s*"?y"?:\s*(-?\d+),\s*"?z"?:\s*(\d+)[^}]*?"?group"?:\s*"([^"]+)"', mtxt)
        if len(entries) != 176:
            issues.append(f"cartograffect_model.js: expected 176 coordinate entries with group, found {len(entries)}")
        for xs, ys, zs, grp in entries:
            x, y, z = int(xs), int(ys), int(zs)
            if x * y != 0 and ("Joie" in grp or "Tristesse" in grp or "Peur" in grp or "Courage" in grp):
                issues.append(f"cartograffect_model.js: Option 1A violation on ({x},{y},{z}) assigned to {grp!r}")
    else:
        issues.append("Missing cartograffect_model.js")

    if THEORY_JS_PATH.exists():
        ttxt = THEORY_JS_PATH.read_text(encoding="utf-8")
        if "(-X, -Y, Z)" not in ttxt and "xy === 0" not in ttxt.lower() and "x * y === 0" not in ttxt:
            issues.append("cartograffect_theory.js: missing piecewise antagonist check")
    else:
        issues.append("Missing cartograffect_theory.js")
    return issues


def check_required_markers() -> list[str]:
    issues: list[str] = []
    for name in ["index.html", "scholar_drive.html", "article.html", "mentions-legales.html"]:
        p = ROOT / name
        if not p.exists():
            issues.append(f"Missing {name}")
            continue
        txt = p.read_text(encoding="utf-8")
        if "styles.min.css" not in txt:
            issues.append(f"{name}: missing static assets/styles.min.css link")
        if "FR | EN (UI only)" not in txt and name in ("index.html", "scholar_drive.html", "article.html", "mentions-legales.html"):
            issues.append(f"{name}: language selector must clearly say 'FR | EN (UI only)'")
    for name in ["index.html", "scholar_drive.html"]:
        txt = (ROOT / name).read_text(encoding="utf-8")
        if "statut-epistemique" not in txt:
            issues.append(f"{name}: missing V1/V2/V3 epistemic status box (#statut-epistemique)")
    return issues


def check_internal_links() -> list[str]:
    issues: list[str] = []
    ref_re = re.compile(r'(?:href|src)="([^"]+)"')
    ids_cache: dict[str, set[str]] = {}
    for rel_path in HTML_FILES:
        p = ROOT / rel_path
        if p.exists():
            ids_cache[rel_path] = set(re.findall(r'\bid="([^"]+)"', p.read_text(encoding="utf-8")))
    for rel_path in HTML_FILES:
        p = ROOT / rel_path
        if not p.exists():
            continue
        txt = p.read_text(encoding="utf-8")
        for m in ref_re.finditer(txt):
            target = m.group(1)
            if target.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
                continue
            if target.startswith("#"):
                anc = target[1:]
                if anc and anc not in ids_cache.get(rel_path, set()):
                    issues.append(f"{rel_path}: broken local anchor #{anc}")
                continue
            path_part, _, anc = target.partition("#")
            path_part = path_part.split("?", 1)[0].lstrip("/")
            if not path_part:
                continue
            resolved = ROOT / path_part
            if not resolved.exists():
                issues.append(f"{rel_path}: missing local target {target!r}")
                continue
            if anc and path_part in ids_cache and anc not in ids_cache[path_part]:
                issues.append(f"{rel_path}: broken cross-page anchor {target!r}")
    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description="CARTOGRAFFECT Phase 4 Payload Sync & Validator")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--check", action="store_true", help="Read-only check across website repo")
    group.add_argument("--apply", action="store_true", help="Synchronize JS fallback, CITATION.cff and HTML counters")
    args = parser.parse_args()

    if not PAYLOAD_PATH.exists():
        print(f"ERROR: Missing {PAYLOAD_PATH}", file=sys.stderr)
        return 1
    payload = json.loads(PAYLOAD_PATH.read_text(encoding="utf-8"))

    errors = validate_payload_schema(payload)
    errors.extend(sync_compendium_js(payload, apply_changes=args.apply))
    errors.extend(sync_citation_cff(payload, apply_changes=args.apply))
    errors.extend(sync_and_check_html_payload_spans(payload, apply_changes=args.apply))

    if args.check:
        errors.extend(check_red_list())
        errors.extend(check_js_model_and_theory())
        errors.extend(check_required_markers())
        errors.extend(check_internal_links())

    if errors:
        print(f"SYNC {'APPLY' if args.apply else 'CHECK'} FAILED ({len(errors)} issue(s)):")
        for err in errors[:80]:
            print(" -", err)
        if len(errors) > 80:
            print(f" ... and {len(errors) - 80} more issues.")
        return 1

    print(
        f"SYNC {'APPLY' if args.apply else 'CHECK'} OK : "
        f"schema={payload['schema_version']}, version={payload['release']['version']}, "
        f"lean_modules={payload['strate_0_core']['normative_modules_count']}, "
        f"theorems={payload['strate_0_core']['theorems_substantial']}/{payload['strate_0_core']['exported_declarations']} "
        f"(pillars={payload['strate_0_core']['pillar_theorems_count']}), "
        f"ext={payload['strate_0_core']['canonical_extension']['theorems_own']}+{payload['strate_0_core']['canonical_extension']['auxiliary_lemmas']}={payload['strate_0_core']['canonical_extension']['exported_declarations']}, "
        f"tests={payload['strate_0_core']['python_unit_tests_count']}, predictions={payload['strate_0_core']['predictions_count']}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
