"""HoloKai Development Test Seed Data Fixture.

WARNING: These records are explicitly DEVELOPMENT TEST FIXTURES / SYNTHETIC DATA
for testing the Multimodal Artifact Resolver, Evidence Fusion, and World Model.
They are NOT archaeological primary evidence.
"""

from __future__ import annotations

from typing import Any

DEVELOPMENT_SEED_ARTIFACTS: list[dict[str, Any]] = [
    {
        "id": "artifact:nok:terracotta_head_01",
        "canonical_name": "Nok Terracotta Sculpture",
        "label": "Nok Terracotta Head",
        "aliases": [
            "Nok terracotta",
            "Nok sculpture",
            "Nok terracotta sculpture",
            "Nok head",
            "Nok terracotta figurine",
        ],
        "civilization": "Nok",
        "historical_period": "500 BCE - 200 CE",
        "epistemic_status": "ESTABLISHED",
        "region": "West Africa / Jos Plateau, Nigeria",
        "material": "Terracotta",
        "metadata": {
            "title": "Nok Terracotta Sculpture",
            "description": "Characteristic stylized terracotta head with pierced triangular eyes and elaborate coiffure.",
            "era": "Iron Age",
            "fixture_label": "DEVELOPMENT TEST DATA",
        },
        "provenance": {
            "source": "HoloKai Archaeological Benchmark (Synthetic Test Fixture)",
            "epistemicStance": "ESTABLISHED",
            "confidence": 0.95,
            "citations": ["Shaw, T. (1977). Unearthing Nigeria's past."],
        },
    },
    {
        "id": "artifact:ife:terracotta_head_01",
        "canonical_name": "Ife Terracotta / Sculpture",
        "label": "Ife Terracotta Head",
        "aliases": [
            "Ife terracotta",
            "Ife head",
            "Ife sculpture",
            "Yoruba sacred head",
            "Ife bronze portrait",
        ],
        "civilization": "Ife",
        "historical_period": "12th - 14th Century CE",
        "epistemic_status": "ESTABLISHED",
        "region": "West Africa / Ile-Ife, Nigeria",
        "material": "Terracotta / Brass",
        "metadata": {
            "title": "Ife Terracotta / Sculpture",
            "description": "Naturalistic portrait head with striated facial scarification and royal crown regalia.",
            "era": "Medieval West Africa",
            "fixture_label": "DEVELOPMENT TEST DATA",
        },
        "provenance": {
            "source": "HoloKai Archaeological Benchmark (Synthetic Test Fixture)",
            "epistemicStance": "ESTABLISHED",
            "confidence": 0.94,
            "citations": ["Willett, F. (1967). Ife in the History of West African Sculpture."],
        },
    },
    {
        "id": "artifact:generic:terracotta_fragment_01",
        "canonical_name": "Generic Terracotta Artifact",
        "label": "Generic Terracotta Vessel Fragment",
        "aliases": [
            "Terracotta fragment",
            "Pottery shard",
            "Terracotta vessel",
            "Ceramic piece",
        ],
        "civilization": "Unspecified",
        "historical_period": "Indeterminate",
        "epistemic_status": "SCHOLARLY_DEBATE",
        "region": "Pan-African",
        "material": "Clay / Terracotta",
        "metadata": {
            "title": "Generic Terracotta Artifact",
            "description": "Indeterminate ceramic shard without diagnostic decorative motifs.",
            "fixture_label": "DEVELOPMENT TEST DATA",
        },
        "provenance": {
            "source": "HoloKai Generic Archaeological Corpus (Synthetic Test Fixture)",
            "epistemicStance": "SCHOLARLY_DEBATE",
            "confidence": 0.50,
            "citations": [],
        },
    },
    {
        "id": "artifact:unknown:unclassified_item_01",
        "canonical_name": "Unknown Artifact",
        "label": "Unclassified Physical Object",
        "aliases": ["Unknown item", "Unclassified object", "Unknown specimen"],
        "civilization": "Unknown",
        "historical_period": "Unknown",
        "epistemic_status": "UNKNOWN",
        "region": "Unknown",
        "material": "Unknown",
        "metadata": {
            "title": "Unknown Artifact",
            "description": "Object without historical or archaeological match in canonical records.",
            "fixture_label": "DEVELOPMENT TEST DATA",
        },
        "provenance": {
            "source": "Synthetic Null Benchmark",
            "epistemicStance": "UNKNOWN",
            "confidence": 0.0,
            "citations": [],
        },
    },
]
