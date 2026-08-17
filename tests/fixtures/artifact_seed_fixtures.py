"""Seed artifact fixtures for development and testing."""

from __future__ import annotations

DEVELOPMENT_SEED_ARTIFACTS = [
    {
        "id": "artifact:nok:terracotta_head_01",
        "canonical_name": "Nok Terracotta Head",
        "civilization": "Nok",
        "origin_site": "Nok Valley, Kaduna State, Nigeria",
        "period": "c. 500 BCE – 200 CE",
        "material": "terracotta",
        "category": "sculpture",
        "physical_properties": {
            "height_cm": 32.0,
            "width_cm": 18.0,
            "depth_cm": 15.0,
            "weight_kg": 4.2,
            "color": "red-ochre",
            "texture": "weathered granular terracotta",
        },
        "visual_features": [
            "triangular_perforated_eyes",
            "pierced_pupils",
            "flared_nostrils",
            "elaborate_coiffure",
            "beaded_neckband",
        ],
        "epistemic_status": "ESTABLISHED",
        "confidence_score": 0.94,
        "provenance": {
            "institution": "National Museum Jos / HoloKai Seed Archive",
            "acquisition_year": 1944,
            "provenance_type": "archaeological_recovery",
            "epistemicStance": "ESTABLISHED",
            "citations": [
                "Shaw, T. (1978) - Nigeria: Its Archaeology and Early History",
                "Fagg, B. (1977) - Nok Terracottas",
            ],
        },
        "academic_citations": [
            {
                "authors": "Shaw, T.",
                "title": "Nigeria: Its Archaeology and Early History",
                "year": 1978,
                "publication": "Thames and Hudson",
            },
            {
                "authors": "Fagg, B.",
                "title": "Nok Terracottas",
                "year": 1977,
                "publication": "National Commission for Museums and Monuments",
            },
        ],
        "provenance_records": [
            {
                "institution": "National Museum Jos / HoloKai Seed Archive",
                "acquisition_year": 1944,
                "provenance_type": "archaeological_recovery",
                "epistemic_stance": "ESTABLISHED",
            }
        ],
    },
    {
        "id": "artifact:ife:terracotta_head_01",
        "canonical_name": "Ife Terracotta Head (Wunmonije Compound)",
        "civilization": "Ife / Yoruba",
        "origin_site": "Ile-Ife, Osun State, Nigeria",
        "period": "c. 12th – 14th Century CE",
        "material": "terracotta",
        "category": "sculpture",
        "physical_properties": {
            "height_cm": 28.5,
            "width_cm": 16.0,
            "depth_cm": 17.0,
            "weight_kg": 3.8,
            "color": "warm terracotta",
            "texture": "refined smooth burnished terracotta",
        },
        "visual_features": [
            "striated_facial_lines",
            "coronet_crown",
            "refined_naturalism",
            "pierced_lips",
        ],
        "epistemic_status": "ESTABLISHED",
        "confidence_score": 0.96,
        "provenance": {
            "institution": "Ife Museum of Antiquities / HoloKai Seed Archive",
            "acquisition_year": 1938,
            "provenance_type": "archaeological_recovery",
            "epistemicStance": "ESTABLISHED",
            "citations": [
                "Drewal, H. J., & Pemberton, J. (1989) - Yoruba: Nine Centuries of African Art and Thought",
            ],
        },
        "academic_citations": [
            {
                "authors": "Drewal, H. J., & Pemberton, J.",
                "title": "Yoruba: Nine Centuries of African Art and Thought",
                "year": 1989,
                "publication": "Center for African Art",
            }
        ],
        "provenance_records": [
            {
                "institution": "Ife Museum of Antiquities / HoloKai Seed Archive",
                "acquisition_year": 1938,
                "provenance_type": "archaeological_recovery",
                "epistemic_stance": "ESTABLISHED",
            }
        ],
    },
    {
        "id": "artifact:igbo_ukwu:roped_pot_01",
        "canonical_name": "Igbo-Ukwu Roped Bronze Pot on Stand",
        "civilization": "Igbo-Ukwu",
        "origin_site": "Igbo-Ukwu, Anambra State, Nigeria",
        "period": "c. 9th Century CE",
        "material": "leaded_bronze",
        "category": "ceremonial_vessel",
        "physical_properties": {
            "height_cm": 32.3,
            "width_cm": 20.0,
            "depth_cm": 20.0,
            "weight_kg": 5.1,
            "color": "patinated bronze green-brown",
            "texture": "lost-wax cast intricate ropework",
        },
        "visual_features": [
            "lost_wax_rope_lattice",
            "concentric_band_decorations",
            "pedestal_stand",
        ],
        "epistemic_status": "ESTABLISHED",
        "confidence_score": 0.95,
        "provenance": {
            "institution": "National Museum Lagos / HoloKai Seed Archive",
            "acquisition_year": 1959,
            "provenance_type": "archaeological_recovery",
            "epistemicStance": "ESTABLISHED",
            "citations": [
                "Shaw, T. (1970) - Igbo-Ukwu: An Account of Archaeological Discoveries in Eastern Nigeria",
            ],
        },
        "academic_citations": [
            {
                "authors": "Shaw, T.",
                "title": "Igbo-Ukwu: An Account of Archaeological Discoveries in Eastern Nigeria",
                "year": 1970,
                "publication": "Faber & Faber",
            }
        ],
        "provenance_records": [
            {
                "institution": "National Museum Lagos / HoloKai Seed Archive",
                "acquisition_year": 1959,
                "provenance_type": "archaeological_recovery",
                "epistemic_stance": "ESTABLISHED",
            }
        ],
    },
]
