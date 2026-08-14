import { db } from '../db/index.js';
import { archives } from '../db/schema.js';
import { v4 as uuidv4 } from 'uuid';

const CIVILIZATIONS = [
  {
    id: "kemet",
    name: "Kemet (Ancient Egypt)",
    era: "c. 3100 BCE – 332 BCE",
    region: "Northeast Africa",
    description: "Kemet ('Black Land') along the Nile built one of the world's longest-lived civilizations: divine kingship, hieroglyphic records, monumental architecture, and Maat as cosmic-ethical order.",
    people: [
      { name: "Narmer / Menes", desc: "Early unifier of Upper and Lower Egypt; double crown symbolism." },
      { name: "Imhotep", desc: "Architect of Djoser's Step Pyramid; later revered as sage and healer." },
      { name: "Khufu", desc: "Fourth Dynasty pharaoh; Great Pyramid of Giza builder-patron." },
      { name: "Hatshepsut", desc: "Female pharaoh; Punt expedition; Deir el-Bahri temple." },
      { name: "Akhenaten", desc: "Religious reformer associated with Aten worship at Amarna." },
      { name: "Tutankhamun", desc: "Boy king; tomb discovery transformed modern Egyptology." },
      { name: "Ramesses II", desc: "Long-reigning New Kingdom ruler; Abu Simbel; Qadesh campaigns." },
      { name: "Cleopatra VII", desc: "Last Ptolemaic ruler; Hellenistic-Egyptian political endgame." },
    ],
    places: [
      { name: "Giza", desc: "Pyramid plateau including Khufu, Khafre, Menkaure monuments." },
      { name: "Thebes / Waset", desc: "Religious-political capital; Karnak and Luxor temples." },
      { name: "Memphis", desc: "Early capital near Nile apex; Ptah cult center." },
      { name: "Amarna (Akhetaten)", desc: "Akhenaten's planned capital for Aten worship." },
      { name: "Valley of the Kings", desc: "New Kingdom royal necropolis on west bank of Thebes." },
      { name: "Alexandria", desc: "Ptolemaic intellectual hub; library and lighthouse fame." },
    ],
    events: [
      { name: "Unification of Egypt", desc: "Formation of the dual monarchy and nome administration.", era: "c. 3100 BCE" },
      { name: "Old Kingdom pyramid age", desc: "Peak of royal pyramid construction and centralized labor.", era: "c. 2686–2181 BCE" },
      { name: "New Kingdom empire", desc: "Imperial expansion into Nubia and the Levant.", era: "c. 1550–1070 BCE" },
      { name: "Alexander's conquest", desc: "End of Late Period independence; Ptolemaic succession.", era: "332 BCE" },
    ],
    concepts: [
      { name: "Maat", desc: "Truth, balance, justice, and cosmic order opposed to isfet." },
      { name: "Divine kingship", desc: "Pharaoh as mediator of gods, land, and Nile surplus." },
      { name: "Hieroglyphs", desc: "Sacred writing system for ritual and royal display." },
      { name: "Afterlife theology", desc: "Judgment, ka/ba, and tomb provisioning for eternity." },
    ],
    artifacts: [
      { name: "Rhind Mathematical Papyrus", desc: "Practical mathematics for surveying and accounting." },
      { name: "Rosetta Stone", desc: "Trilingual decree enabling hieroglyph decipherment." },
      { name: "Great Pyramid", desc: "Old Kingdom engineering and labor organization landmark." },
    ]
  },
  {
    id: "kush",
    name: "Nubia & Kingdom of Kush",
    region: "Northeast Africa / Sudan",
    era: "c. 2500 BCE – 350 CE",
    description: "Nubian kingdoms (Kerma, Napata, Meroë) built pyramids, iron industries, and pharaonic dual power—ruling Egypt as the 25th Dynasty and sustaining long Nile trade.",
    people: [
      { name: "Piye (Piankhi)", desc: "Kushite conqueror who established 25th Dynasty authority in Egypt." },
      { name: "Taharqa", desc: "25th Dynasty pharaoh; Assyrian conflicts; monumental builder." },
      { name: "Amanirenas", desc: "Kandake who resisted Roman expansion in the south." },
    ],
    places: [
      { name: "Kerma", desc: "Early Nubian urban capital with deffufa temples." },
      { name: "Napata", desc: "Religious-political center near Jebel Barkal." },
      { name: "Meroë", desc: "Later capital; iron production and distinctive pyramids." },
      { name: "Jebel Barkal", desc: "Sacred mountain of Amun for Kushite kingship." },
    ],
    events: [
      { name: "25th Dynasty", desc: "Kushite pharaohs rule a reunified Nile empire.", era: "c. 744–656 BCE" },
      { name: "Move to Meroë", desc: "Southward political shift and cultural innovation.", era: "c. 6th–4th c. BCE" },
    ],
    concepts: [
      { name: "Kandake (Candace)", desc: "Title for powerful royal women in Kushite politics." },
      { name: "Meroitic script", desc: "Indigenous writing for the Meroitic language." },
      { name: "Nile corridor trade", desc: "Gold, ivory, ebony, and cattle along north-south routes." },
    ],
    artifacts: [
      { name: "Meroë pyramids", desc: "Steep royal tombs distinct from Egyptian proportions." },
      { name: "Deffufa of Kerma", desc: "Massive mud-brick religious structures." },
    ]
  }
];

async function seed() {
  console.log('Seeding HoloKai Archives...');
  
  for (const civ of CIVILIZATIONS) {
    // 1. Insert civilization summary as an overarching concept
    await db.insert(archives).values({
      id: uuidv4(),
      civilizationId: civ.id,
      title: civ.name,
      category: 'civilization',
      description: civ.description,
      era: civ.era,
      region: civ.region
    });

    // 2. Insert people
    for (const p of civ.people) {
      await db.insert(archives).values({
        id: uuidv4(),
        civilizationId: civ.id,
        title: p.name,
        category: 'person',
        description: p.desc,
        era: civ.era,
        region: civ.region
      });
    }

    // 3. Insert places
    for (const p of civ.places) {
      await db.insert(archives).values({
        id: uuidv4(),
        civilizationId: civ.id,
        title: p.name,
        category: 'place',
        description: p.desc,
        era: civ.era,
        region: civ.region
      });
    }

    // 4. Insert events
    for (const e of civ.events) {
      await db.insert(archives).values({
        id: uuidv4(),
        civilizationId: civ.id,
        title: e.name,
        category: 'event',
        description: e.desc,
        era: e.era,
        region: civ.region
      });
    }

    // 5. Insert concepts
    for (const c of civ.concepts) {
      await db.insert(archives).values({
        id: uuidv4(),
        civilizationId: civ.id,
        title: c.name,
        category: 'concept',
        description: c.desc,
        era: civ.era,
        region: civ.region
      });
    }

    // 6. Insert artifacts
    for (const a of civ.artifacts) {
      await db.insert(archives).values({
        id: uuidv4(),
        civilizationId: civ.id,
        title: a.name,
        category: 'artifact',
        description: a.desc,
        era: civ.era,
        region: civ.region
      });
    }
  }

  console.log('Archive seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
