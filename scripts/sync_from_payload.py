#!/usr/bin/env python3
"""
Deterministic website synchronizer and contract verifier for CARTOGRAFFECT (Strate 2).

Reads data/site-payload.json and:
  - In --apply mode: synchronizes static fallbacks (js/compendium_payload.js),
    CITATION.cff, sitemap.xml, [data-payload] HTML nodes, and release metadata
    deterministically (UTF-8 without BOM, LF endings).
  - In --check mode: verifies schema validity, zero drift against canonical payload,
    zero obsolete Strate 1/v1 residues (both raw and HTML-unescaped), A4-Sanctuaire
    isolation on article/theory pages, SPDX & hybrid-clause compliance, JS model
    integrity (176 states, 84 antagonist pairs), and optional 176/176 Lexicon176.lean
    parity.

Standard library Python 3.10+ only.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import sys
from pathlib import Path
from typing import Any


EXPECTED_SCHEMA_VERSION = "1.0"
REQUIRED_TOP_KEYS = (
    "schema_version",
    "release",
    "identifiers",
    "strate_0_core",
    "strate_1_extensions",
    "ai_disclosure",
    "licenses",
)

FALLBACK_BEGIN = "/* BEGIN:SITE_PAYLOAD_FALLBACK */"
FALLBACK_END = "/* END:SITE_PAYLOAD_FALLBACK */"

SCAN_EXTENSIONS = {".html", ".js", ".md", ".cff", ".json", ".xml", ".txt"}
SKIP_DIRS = {".git", ".github", "scripts", "assets", "node_modules"}

FORBIDDEN_PATTERNS: list[tuple[str, str]] = [
    (r"\b68\s*(?:th(?:éorèmes?|é\.|\.)|thé)\b", "obsolete theorem count (68)"),
    (r"\b33\s*(?:théorèmes?\s*audités|audités)\b", "obsolete audited theorem count (33)"),
    (r"\b38\s*vérifications?\s*d['’]axiomes\b", "obsolete axiom count (38)"),
    (r"(?<![0-9.])v?1\.0\.1(?![0-9.])", "obsolete current version v1.0.1"),
    (r"(?:\b3|trois)\s+prédictions?\b", "obsolete prediction count (3 instead of 5)"),
    (r"\b(?:6|six)\s+modules?\s+(?:lean|\.lean)\b|\bl'ensemble des\s+6\s+modules\b", "obsolete module count (6 instead of 9)"),
    (r"la\s+macaza", "obsolete institutional affiliation (La Macaza)"),
    (r"service\s+correctionnel", "obsolete institutional affiliation (SCC)"),
    (r"ph\.?\s*d\.?,\s*bcn\b", "obsolete BCN suffix"),
    (r"\bdrcab\b|c:\\\\users\\\\|c:/users/", "local workstation path leak"),
]

# Guard A4-Sanctuaire: experimental PXP / min_r metrics must not leak into
# the theoretical paper or core Strate 2 theory pages.
A4_SANCTUAIRE_FILES = {
    "article.html",
    "index.html",
    "scholar_drive.html",
    "moteur-predictif.html",
    "noyau-affectif.html",
    "matrice-affective.html",
    "taxonomie-affective.html",
    "mentions-legales.html",
    "voyage.html",
    "404.html",
    "maintenance.html",
    "README.md",
}

A4_FORBIDDEN_PATTERNS: list[tuple[str, str]] = [
    (r"\bPXP(?:_BIC|_WAIC)?\b", "PXP protected metrics leak (A4-Sanctuaire)"),
    (r"\bmin[\s_]+r\b", "min r in-silico metric leak (A4-Sanctuaire)"),
]


def load_payload(payload_path: Path) -> tuple[dict[str, Any], list[str]]:
    errors: list[str] = []
    if not payload_path.is_file():
        return {}, [f"Payload file missing: {payload_path}"]
    try:
        data = json.loads(payload_path.read_text(encoding="utf-8"))
    except Exception as exc:
        return {}, [f"Invalid JSON in {payload_path}: {exc}"]

    for key in REQUIRED_TOP_KEYS:
        if key not in data:
            errors.append(f"Missing required payload key: '{key}'")

    if data.get("schema_version") != EXPECTED_SCHEMA_VERSION:
        errors.append(
            f"Unexpected schema_version={data.get('schema_version')!r}, expected {EXPECTED_SCHEMA_VERSION!r}"
        )

    rel = data.get("release", {})
    ids = data.get("identifiers", {})
    s0 = data.get("strate_0_core", {})
    lic = data.get("licenses", {})

    for k in ("version", "tag", "date"):
        if not rel.get(k):
            errors.append(f"Missing release.{k}")
    for k in ("zenodo_code_doi", "zenodo_article_doi", "osf_url", "cipo_registration", "github_repo_url"):
        if not ids.get(k):
            errors.append(f"Missing identifiers.{k}")

    if not isinstance(s0.get("theorems_verified"), int) or s0.get("theorems_verified", 0) < 113:
        errors.append(f"Invalid strate_0_core.theorems_verified={s0.get('theorems_verified')!r}")
    if s0.get("sorry_count") != 0:
        errors.append(f"Invalid strate_0_core.sorry_count={s0.get('sorry_count')!r} (expected 0)")
    if not isinstance(s0.get("provers"), list) or len(s0.get("provers", [])) != 6:
        errors.append(f"Expected 6 provers in strate_0_core.provers, got {len(s0.get('provers', []))}")
    if s0.get("lean_modules_count") != 9:
        errors.append(f"Expected lean_modules_count=9, got {s0.get('lean_modules_count')!r}")
    if s0.get("states_count") != 176:
        errors.append(f"Expected states_count=176, got {s0.get('states_count')!r}")
    if s0.get("predictions_count") != 5:
        errors.append(f"Expected predictions_count=5, got {s0.get('predictions_count')!r}")
    if not s0.get("author_affiliation"):
        errors.append("Missing strate_0_core.author_affiliation")
    if lic.get("spdx_expression") != "AGPL-3.0-or-later AND CC-BY-NC-SA-4.0":
        errors.append(f"Unexpected licenses.spdx_expression={lic.get('spdx_expression')!r}")
    ai = data.get("ai_disclosure", {})
    ai_verif = str(ai.get("verification_and_audit_status", "")).lower()
    if not ai.get("author_ownership") or not ai.get("ai_assistance_scope"):
        errors.append("Missing ai_disclosure.author_ownership or ai_assistance_scope")
    for marker in ("non mathématicien formel", "ligne par ligne", "tests automatisés", "audit"):
        if marker not in ai_verif:
            errors.append(f"Incomplete ai_disclosure.verification_and_audit_status (missing {marker!r})")

    return data, errors


def build_payload_tokens(payload: dict[str, Any]) -> dict[str, str]:
    rel = payload["release"]
    ids = payload["identifiers"]
    s0 = payload["strate_0_core"]
    lic = payload["licenses"]
    return {
        "version": str(rel["version"]),
        "tag": str(rel["tag"]),
        "version_label": f"Version {rel['version']}",
        "date": str(rel["date"]),
        "zenodo_code_doi": str(ids["zenodo_code_doi"]),
        "zenodo_article_doi": str(ids["zenodo_article_doi"]),
        "osf_url": str(ids["osf_url"]),
        "cipo_registration": str(ids["cipo_registration"]),
        "github_repo_url": str(ids["github_repo_url"]),
        "theorems_verified": str(s0["theorems_verified"]),
        "sorry_count": str(s0["sorry_count"]),
        "provers_count": str(len(s0["provers"])),
        "lean_modules_count": str(s0["lean_modules_count"]),
        "states_count": str(s0["states_count"]),
        "predictions_count": str(s0["predictions_count"]),
        "author_affiliation": str(s0["author_affiliation"]),
        "spdx_expression": str(lic["spdx_expression"]),
        "code_license": str(lic["code_license"]),
        "theory_license": str(lic["theory_license"]),
    }


def sync_compendium_payload_js(root: Path, payload: dict[str, Any], apply: bool) -> list[str]:
    target = root / "js" / "compendium_payload.js"
    if not target.is_file():
        return [f"Missing file: {target}"]
    text = target.read_text(encoding="utf-8")
    b_idx = text.find(FALLBACK_BEGIN)
    e_idx = text.find(FALLBACK_END)
    if b_idx == -1 or e_idx == -1 or e_idx < b_idx:
        return [f"Missing fallback markers in {target}"]

    indent_payload = json.dumps(payload, ensure_ascii=False, indent=4)
    # Indent lines cleanly by 2 spaces under `const FALLBACK_PAYLOAD = ...;`
    lines = indent_payload.splitlines()
    formatted_lines = [lines[0]] + [("  " + ln if ln else "") for ln in lines[1:]]
    formatted_json = "\n".join(formatted_lines)

    new_block = f"{FALLBACK_BEGIN}\n  const FALLBACK_PAYLOAD = {formatted_json};\n  {FALLBACK_END}"
    before = text[:b_idx]
    after = text[e_idx + len(FALLBACK_END):]
    updated = before + new_block + after
    if updated != text:
        if apply:
            target.write_text(updated, encoding="utf-8", newline="\n")
        else:
            return [f"Out-of-sync fallback payload in js/compendium_payload.js (run --apply)"]
    return []


def sync_citation_cff(root: Path, payload: dict[str, Any], apply: bool) -> list[str]:
    target = root / "CITATION.cff"
    if not target.is_file():
        return ["Missing CITATION.cff"]
    text = target.read_text(encoding="utf-8")
    rel = payload["release"]
    ids = payload["identifiers"]
    lic = payload["licenses"]
    s0 = payload["strate_0_core"]

    updated = text
    updated = re.sub(r'(?m)^(\s*version:\s*)".*?"$', rf'\1"{rel["version"]}"', updated)
    updated = re.sub(r'(?m)^date-released:\s*".*?"$', f'date-released: "{rel["date"]}"', updated)
    updated = re.sub(r'(?m)^license:\s*".*?"$', f'license: "{lic["spdx_expression"]}"', updated)
    updated = re.sub(r'(?m)^(    affiliation:\s*)".*?"$', rf'\1"{s0["author_affiliation"]}"', updated)
    updated = re.sub(r'(?m)^doi:\s*".*?"$', f'doi: "{ids["zenodo_code_doi"]}"', updated)
    updated = re.sub(r'(?m)^repository-code:\s*".*?"$', f'repository-code: "{ids["github_repo_url"]}"', updated)
    updated = re.sub(r'(description:\s*"Zenodo [^"\n]+ DOI \()v\d+\.\d+\.\d+(\)")', rf'\g<1>{rel["tag"]}\g<2>', updated)
    updated = re.sub(r'(compendium unifié )v\d+\.\d+\.\d+', rf'\g<1>{rel["tag"]}', updated)
    updated = re.sub(r'(CARTOGRAFFECT )v\d+\.\d+\.\d+', rf'\g<1>{rel["tag"]}', updated)

    if updated != text:
        if apply:
            target.write_text(updated, encoding="utf-8", newline="\n")
        else:
            return ["Out-of-sync CITATION.cff metadata (run --apply)"]
    return []


def sync_sitemap_xml(root: Path, payload: dict[str, Any], apply: bool) -> list[str]:
    target = root / "sitemap.xml"
    if not target.is_file():
        return ["Missing sitemap.xml"]
    text = target.read_text(encoding="utf-8")
    date_str = payload["release"]["date"]
    updated = re.sub(r"<lastmod>\d{4}-\d{2}-\d{2}</lastmod>", f"<lastmod>{date_str}</lastmod>", text)
    if updated != text:
        if apply:
            target.write_text(updated, encoding="utf-8", newline="\n")
        else:
            return ["Out-of-sync lastmod dates in sitemap.xml (run --apply)"]
    return []


def sync_html_files(root: Path, payload: dict[str, Any], apply: bool) -> list[str]:
    errors: list[str] = []
    tokens = build_payload_tokens(payload)
    ver = tokens["version"]
    tag = tokens["tag"]

    tag_re = re.compile(
        r'(<(?P<elem>[a-zA-Z0-9]+)\b[^>]*?\bdata-payload=["\'](?P<key>[a-zA-Z0-9_]+)["\'][^>]*>)([^<]*)(</(?P=elem)>)'
    )

    for html_file in sorted(root.glob("*.html")):
        text = html_file.read_text(encoding="utf-8")

        def repl(m: re.Match[str]) -> str:
            key = m.group("key")
            if key in tokens:
                return f"{m.group(1)}{tokens[key]}{m.group(5)}"
            return m.group(0)

        updated = tag_re.sub(repl, text)
        # Keep inline APA citation strings, JSON-LD, meta and notices synchronized with payload version
        updated = re.sub(
            r"(Cartographie des affects\s*:[^\n]*?\(Version\s+)(\d+\.\d+\.\d+)(\))",
            rf"\g<1>{ver}\g<3>",
            updated,
        )
        updated = re.sub(
            r"(CARTOGRAFFECT:\s*Architecture[^\n]*?\(version\s+)(v\d+\.\d+\.\d+)(\))",
            rf"\g<1>{tag}\g<3>",
            updated,
        )
        updated = re.sub(
            r"(CARTOGRAFFECT:\s*Architecture[^\n]*?\(Version\s+)(\d+\.\d+\.\d+)(\))",
            rf"\g<1>{ver}\g<3>",
            updated,
        )
        updated = re.sub(
            r'(property="og:description"\s+content="[^"\n]*?\()v\d+\.\d+\.\d+(, compendium Hexa-Prover\))',
            rf'\g<1>{tag}\g<2>',
            updated,
        )
        updated = re.sub(
            r'("version":\s*")\d+\.\d+\.\d+(")',
            rf'\g<1>{ver}\g<2>',
            updated,
        )
        updated = re.sub(
            r'(Mise à disposition de la prépublication\s+)v\d+\.\d+\.\d+',
            rf'\g<1>{tag}',
            updated,
        )

        if updated != text:
            if apply:
                html_file.write_text(updated, encoding="utf-8", newline="\n")
            else:
                errors.append(f"Out-of-sync [data-payload]/citation markers in {html_file.name} (run --apply)")

    return errors


def check_zero_residue(root: Path) -> list[str]:
    errors: list[str] = []
    compiled_forbidden = [(re.compile(pat, re.IGNORECASE), desc) for pat, desc in FORBIDDEN_PATTERNS]
    compiled_a4 = [(re.compile(pat), desc) for pat, desc in A4_FORBIDDEN_PATTERNS]

    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(root)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        if path.suffix.lower() not in SCAN_EXTENSIONS:
            continue
        # Skip generated binary-like or vendor JSON if any; check text files
        raw_text = path.read_text(encoding="utf-8", errors="replace")
        unescaped_text = html.unescape(raw_text)

        for idx, (raw_line, clean_line) in enumerate(
            zip(raw_text.splitlines(), unescaped_text.splitlines()), start=1
        ):
            norm_line = re.sub(r"\s+", " ", clean_line)
            for creg, desc in compiled_forbidden:
                if creg.search(raw_line) or creg.search(norm_line):
                    errors.append(f"Residual '{desc}' in {rel.as_posix()}:{idx}")
            if path.name in A4_SANCTUAIRE_FILES:
                for areg, adesc in compiled_a4:
                    if areg.search(raw_line) or areg.search(clean_line):
                        errors.append(f"A4-Sanctuaire violation ({adesc}) in {rel.as_posix()}:{idx}")
    return errors


def check_required_markers(root: Path, payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    ids = payload["identifiers"]
    s0 = payload["strate_0_core"]
    lic = payload["licenses"]

    must_have: dict[str, list[str]] = {
        "index.html": [
            ids["zenodo_article_doi"],
            ids["zenodo_code_doi"],
            ids["cipo_registration"],
            str(s0["theorems_verified"]),
            s0["author_affiliation"],
            lic["spdx_expression"],
        ],
        "article.html": [
            ids["zenodo_article_doi"],
            ids["zenodo_code_doi"],
            ids["osf_url"].replace("https://", ""),
            ids["cipo_registration"],
            str(s0["theorems_verified"]),
            s0["author_affiliation"],
            "figure-1",
            "tableau-1",
            "tableau-2",
            "Déclaration relative à l’utilisation de l’intelligence artificielle générative",
            "non mathématicien formel",
            "ligne par ligne",
            "tests automatisés",
            "traduction",
            "audit",
        ],
        "scholar_drive.html": [
            ids["zenodo_article_doi"],
            ids["zenodo_code_doi"],
            ids["cipo_registration"],
            str(s0["theorems_verified"]),
            s0["author_affiliation"],
            lic["spdx_expression"],
        ],
        "mentions-legales.html": [
            ids["zenodo_article_doi"],
            ids["zenodo_code_doi"],
            ids["cipo_registration"],
            lic["spdx_expression"],
            "cartograffect_model.js",
            "Clause de Séparation des Fichiers Hybrides",
            "Statut professionnel et portée scientifique",
            "Ordre des psychologues du Québec",
            "ni aucun organisme",
            "révision par les pairs",
            "aucune donnée personnelle",
        ],
        "taxonomie-affective.html": [
            ids["zenodo_code_doi"],
            ids["cipo_registration"],
            str(s0["theorems_verified"]),
            "9",
        ],
        "LICENSE": [
            "GNU Affero General Public License",
            "CC BY-NC-SA 4.0",
            "cartograffect_model.js",
            lic["spdx_expression"],
        ],
        "README.md": [
            ids["zenodo_article_doi"],
            ids["zenodo_code_doi"],
            ids["osf_url"],
            ids["cipo_registration"],
            str(s0["theorems_verified"]),
            lic["spdx_expression"],
        ],
    }

    for filename, needles in must_have.items():
        fpath = root / filename
        if not fpath.is_file():
            errors.append(f"Missing expected file: {filename}")
            continue
        content = html.unescape(fpath.read_text(encoding="utf-8"))
        for needle in needles:
            if needle not in content:
                errors.append(f"Missing required content {needle!r} in {filename}")

    # Anti-regression & UI/editorial hygiene checks
    forbidden_bib = ("49+", "49 +", "references-v2-complementaires", "49 Références", "49 références")
    for fname in ("article.html", "scholar_drive.html", "corpus_system.js"):
        fpath = root / fname
        if fpath.is_file():
            raw_text = fpath.read_text(encoding="utf-8")
            for bad in forbidden_bib:
                if bad in raw_text:
                    errors.append(f"Forbidden legacy reference marker {bad!r} still present in {fname}")

    for fname in ("moteur-predictif.html", "article.html"):
        fpath = root / fname
        if fpath.is_file() and "couverture markovienne" in fpath.read_text(encoding="utf-8").lower():
            errors.append(f"Forbidden 'Couverture Markovienne' terminology on {fname}")

    for hpath in sorted(root.glob("*.html")):
        htext = hpath.read_text(encoding="utf-8")
        if "@studio-freight/lenis" in htext:
            errors.append(f"Forbidden Lenis CDN script still present in {hpath.name}")
        if "bg-[#0b1120]/98" in htext:
            errors.append(f"Invalid transparent Tailwind dropdown class bg-[#0b1120]/98 in {hpath.name}")
        if 'id="langToggleBtn"' in htext and "js/i18n.js" not in htext:
            errors.append(f"Missing js/i18n.js inclusion on page with #langToggleBtn: {hpath.name}")

    for fname in ("article.html", "README.md"):
        fpath = root / fname
        if fpath.is_file():
            low = fpath.read_text(encoding="utf-8").lower()
            if "section 4.1" in low or "§4.1" in low:
                errors.append(f"Forbidden broken cross-reference (section 4.1 / §4.1) in {fname}")

    css_path = root / "style.css"
    if css_path.is_file():
        css_text = css_path.read_text(encoding="utf-8")
        if "#modelDropdownMenu" not in css_text or "backdrop-filter: blur(12px)" not in css_text or "0.98" not in css_text:
            errors.append("Missing WCAG 2.1 opaque #modelDropdownMenu styling in style.css")

    sw_path = root / "sw.js"
    if sw_path.is_file():
        sw_text = sw_path.read_text(encoding="utf-8")
        expected_cache = f"cartograffect-{payload['release']['tag']}-"
        if expected_cache not in sw_text:
            errors.append(f"sw.js CACHE_NAME should include {expected_cache!r}")

    return errors


def parse_js_lexicon_and_pairs(js_path: Path) -> tuple[list[tuple[int, int, int, str]], list[tuple[str, str]]]:
    text = js_path.read_text(encoding="utf-8")
    # Extract CartograffectModel.emotions entries (JSON objects with quoted keys)
    state_pat = re.compile(
        r'"id"\s*:\s*\d+\s*,\s*"name"\s*:\s*"([^"]+)"\s*,\s*"x"\s*:\s*(-?\d+)\s*,\s*"y"\s*:\s*(-?\d+)\s*,\s*"z"\s*:\s*(\d+)'
    )
    states = [
        (int(m.group(2)), int(m.group(3)), int(m.group(4)), m.group(1))
        for m in state_pat.finditer(text)
    ]

    pairs: list[tuple[str, str]] = []
    for arr_name in ("axialPairs", "diagonalPairs", "controlateralPairs"):
        arr_m = re.search(rf"CartograffectModel\.{arr_name}\s*=\s*(\[.*?\]);", text, re.S)
        if arr_m:
            raw_pairs = json.loads(arr_m.group(1))
            for a, b in raw_pairs:
                pairs.append((str(a), str(b)))
    return states, pairs


def parse_lean_lexicon(lean_path: Path) -> list[tuple[int, int, int, str]]:
    text = lean_path.read_text(encoding="utf-8")
    pat = re.compile(r'⟨"([^"]+)",\s*⟨(-?\d+),\s*(-?\d+),\s*(\d+)⟩⟩')
    return [(int(m.group(2)), int(m.group(3)), int(m.group(4)), m.group(1)) for m in pat.finditer(text)]


def check_js_model_and_lexicon(
    root: Path, payload: dict[str, Any], lexicon_path: Path | None
) -> tuple[list[str], str]:
    errors: list[str] = []
    js_path = root / "cartograffect_model.js"
    if not js_path.is_file():
        return ["Missing cartograffect_model.js"], "unverified"

    states, pairs = parse_js_lexicon_and_pairs(js_path)
    if len(states) != 176:
        errors.append(f"Expected 176 states in cartograffect_model.js, found {len(states)}")
    if len(pairs) != 84:
        errors.append(f"Expected 84 antagonist pairs in cartograffect_model.js, found {len(pairs)}")

    coords_map = {(x, y, z): name for x, y, z, name in states}
    if len(coords_map) != len(states):
        errors.append("Duplicate (x, y, z) coordinates found in cartograffect_model.js")
    central_ops = [(x, y, z, name) for x, y, z, name in states if x == 0 and y == 0]
    if len(central_ops) != 8:
        errors.append(f"Expected 8 central operators (x=0, y=0), found {len(central_ops)}")
    for x, y, z, name in states:
        if x == 0 and y == 0:
            if not (0 <= z <= 7):
                errors.append(f"Central operator out of Z bounds for {name}: ({x},{y},{z})")
        else:
            expected_r = 2 * z - 2
            if z < 2 or abs(x) + abs(y) != expected_r:
                errors.append(
                    f"L1 radius mismatch for peripheral {name} ({x},{y},{z}): got {abs(x)+abs(y)}, expected {expected_r}"
                )

    if coords_map.get((0, 0, 0)) != "Point de Veille":
        errors.append(f"Expected (0,0,0) == 'Point de Veille', got {coords_map.get((0, 0, 0))!r}")
    if coords_map.get((-2, 6, 5)) != "Désenchantement":
        errors.append(f"Expected (-2,6,5) == 'Désenchantement', got {coords_map.get((-2, 6, 5))!r}")
    if coords_map.get((6, -2, 5)) != "Enchantement":
        errors.append(f"Expected (6,-2,5) == 'Enchantement', got {coords_map.get((6, -2, 5))!r}")
    if coords_map.get((2, -6, 5)) != "Sécurité":
        errors.append(f"Expected (2,-6,5) == 'Sécurité', got {coords_map.get((2, -6, 5))!r}")

    lex_status = "js_only(176_states,84_pairs)"
    if lexicon_path is not None and lexicon_path.is_file():
        lean_states = parse_lean_lexicon(lexicon_path)
        if len(lean_states) != 176:
            errors.append(f"Expected 176 entries in {lexicon_path}, found {len(lean_states)}")
        else:
            lean_sha = hashlib.sha256(lexicon_path.read_bytes()).hexdigest()
            expected_sha = payload.get("strate_0_core", {}).get("lexicon176_sha256")
            if expected_sha and lean_sha != expected_sha:
                errors.append(
                    f"Lexicon176.lean SHA-256 mismatch vs site-payload.json: {lean_sha} != {expected_sha}"
                )
            lean_set = set(lean_states)
            js_set = set(states)
            if lean_set != js_set:
                diff_lean = sorted(lean_set - js_set)[:5]
                diff_js = sorted(js_set - lean_set)[:5]
                errors.append(
                    f"Lexicon parity mismatch! Missing in JS={diff_lean}, Extra in JS={diff_js}"
                )
            else:
                lex_status = f"lean_parity_exact(176/176,84_pairs,sha256={lean_sha[:12]})"

    return errors, lex_status


def main() -> int:
    parser = argparse.ArgumentParser(description="CARTOGRAFFECT Strate 2 website synchronizer")
    mode_group = parser.add_mutually_exclusive_group()
    mode_group.add_argument("--check", action="store_true", help="Verify sync, zero-residue, and integrity (default)")
    mode_group.add_argument("--apply", action="store_true", help="Apply deterministic updates from payload")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1], help="Website repository root")
    parser.add_argument("--payload", type=Path, default=None, help="Path to site-payload.json")
    parser.add_argument("--lexicon", type=Path, default=None, help="Optional path to Lexicon176.lean for 176/176 parity check")
    args = parser.parse_args()

    root: Path = args.root.resolve()
    payload_path: Path = (args.payload or (root / "data" / "site-payload.json")).resolve()
    apply_mode: bool = bool(args.apply)

    lex_path: Path | None = args.lexicon.resolve() if args.lexicon else None
    if lex_path is None:
        candidate = root.parent.parent / "CARTOGRAFFECT" / "Cartograffect" / "Lexicon176.lean"
        if candidate.is_file():
            lex_path = candidate

    payload, errors = load_payload(payload_path)
    if errors:
        for err in errors:
            print(f"[ERROR] {err}", file=sys.stderr)
        return 1

    all_errors: list[str] = []
    all_errors.extend(sync_compendium_payload_js(root, payload, apply=apply_mode))
    all_errors.extend(sync_citation_cff(root, payload, apply=apply_mode))
    all_errors.extend(sync_sitemap_xml(root, payload, apply=apply_mode))
    all_errors.extend(sync_html_files(root, payload, apply=apply_mode))
    all_errors.extend(check_zero_residue(root))
    all_errors.extend(check_required_markers(root, payload))
    js_errors, lex_status = check_js_model_and_lexicon(root, payload, lex_path)
    all_errors.extend(js_errors)

    if all_errors:
        print(f"SYNC {'APPLY' if apply_mode else 'CHECK'} FAILED ({len(all_errors)} issue(s)):", file=sys.stderr)
        for err in all_errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    action_label = "APPLIED & VERIFIED" if apply_mode else "CHECK OK"
    print(
        f"SITE {action_label} : version={payload['release']['version']}, "
        f"theorems={payload['strate_0_core']['theorems_verified']}, "
        f"provers={len(payload['strate_0_core']['provers'])}, "
        f"modules={payload['strate_0_core']['lean_modules_count']}, "
        f"predictions={payload['strate_0_core']['predictions_count']}, "
        f"lexicon={lex_status}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
