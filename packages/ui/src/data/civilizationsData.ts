import { CivilizationEntry } from '@holokai/contracts';

export const CIVILIZATIONS: CivilizationEntry[] = [
  {
    id: 'kush',
    name: 'Kingdom of Kush',
    region: 'Nubia / Nile Valley',
    era: 'Ancient',
    centuryRange: '1500 BCE – 350 CE',
    description: 'An ancient imperial superpower in Nubia that ruled the Nile valley for millennia, famous for its iron metallurgy, formidable warrior queens (Kandakes), and distinct steep pyramids.',
    achievements: [
      'Conquered Egypt and established the 25th Dynasty (Black Pharaohs)',
      'Developed Africa\'s earliest indigenous alphabetic script (Meroitic)',
      'Constructed more pyramids than Egypt (over 200 steep Nubian pyramids)',
      'Defeated Roman legions under Augustus Caesar'
    ],
    keyFigures: ['Piankhy (Piye)', 'Shabaqo', 'Taharqa', 'Kandake Amanirenas', 'Kandake Amanishakheto']
  },
  {
    id: 'kemet',
    name: 'Kemet (Ancient Egypt)',
    region: 'Nile Valley / North Africa',
    era: 'Ancient',
    centuryRange: '3100 BCE – 30 BCE',
    description: 'A foundational Nile civilization whose monumental stone architecture, scientific papyri, complex spiritual traditions, and artistic canons influenced the ancient Mediterranean world.',
    achievements: [
      'Built the Great Pyramid of Giza',
      'Developed complex hieroglyphic writing system',
      'Pioneered early medical codices',
      'Created standardized 365-day solar calendar'
    ],
    keyFigures: ['Narmer', 'Hatshepsut', 'Thutmose III', 'Akhenaten', 'Ramesses II', 'Cleopatra VII']
  },
  {
    id: 'aksum',
    name: 'Kingdom of Aksum',
    region: 'Horn of Africa (Ethiopia & Eritrea)',
    era: 'Classical',
    centuryRange: '100 CE – 940 CE',
    description: 'A maritime trading empire in the Horn of Africa that dominated Red Sea commerce, minted gold coins, erected towering stone obelisks, and adopted Christianity in the early 4th century.',
    achievements: [
      'First Sub-Saharan African empire to mint its own coinage',
      'Carved the largest single pieces of stone in the ancient world',
      'Created Ge\'ez abugida writing system',
      'One of the four great world powers of the 3rd century'
    ],
    keyFigures: ['King Zoskales', 'King Ezana', 'King Kaleb', 'Queen Gudit']
  },
  {
    id: 'mali',
    name: 'Mali Empire',
    region: 'West Africa (Sahel)',
    era: 'Medieval',
    centuryRange: '1235 CE – 1670 CE',
    description: 'A legendary Mandé empire that controlled the trans-Saharan gold trade, established groundbreaking human rights charters, and made Timbuktu a world capital of Islamic scholarship.',
    achievements: [
      'Enacted the Kouroukan Fouga (1235 CE)',
      'Transformed Timbuktu into an intellectual hub',
      'Preserved over 700,000 manuscripts',
      'Mansa Musa\'s legendary 1324 pilgrimage'
    ],
    keyFigures: ['Sundiata Keita (Mari Djata I)', 'Mansa Sakura', 'Mansa Musa', 'Mansa Sulayman']
  },
  {
    id: 'benin',
    name: 'Kingdom of Benin (Edo Empire)',
    region: 'West Africa (Forest Zone)',
    era: 'Medieval',
    centuryRange: '1180 CE – 1897 CE',
    description: 'A highly sophisticated West African forest empire renowned for its unparalleled lost-wax bronze casting art, royal court guilds, and monumental earthen rampart fortifications.',
    achievements: [
      'Created the world-famous Benin Bronzes',
      'Constructed the Benin Moat/Earthworks',
      'Pioneered early African diplomatic treaties with Renaissance Portugal',
      'Queen Idia led military campaigns'
    ],
    keyFigures: ['Eweka I', 'Oba Ewuare the Great', 'Oba Esigie', 'Queen Idia', 'Oba Ovonramwen']
  },
  {
    id: 'zimbabwe',
    name: 'Great Zimbabwe Empire',
    region: 'Southern Africa',
    era: 'Medieval',
    centuryRange: '1100 CE – 1450 CE',
    description: 'A monumental stone citadel in Southern Africa constructed by Shona ancestors without mortar, serving as a thriving metropolis of trade, metallurgy, and spiritual devotion.',
    achievements: [
      'Built the largest stone structure in Sub-Saharan Africa prior to the modern era',
      'Mastered dry-stone architecture with zero mortar',
      'Linked Southern African gold mines to Indian Ocean maritime networks',
      'Carved the 8 sacred Soapstone Birds'
    ],
    keyFigures: ['Ancestral Shona Mwenemutapa Dynastic Lineage']
  },
  {
    id: 'songhai',
    name: 'Songhai Empire',
    region: 'West Africa (Sahel)',
    era: 'Early Modern',
    centuryRange: '1464 CE – 1591 CE',
    description: 'The largest empire in African history, Songhai unified the Niger River bend into a centralized military and commercial titan with a standing navy, standardized trade, and world-class universities.',
    achievements: [
      'Became the largest territorial empire in African history',
      'Built a standing war fleet of armored canoes',
      'Standardized trade measures and appointed market inspectors',
      'Expanded Timbuktu and Djenné into global academic centers'
    ],
    keyFigures: ['Sonni Ali Ber', 'Askia Muhammad I', 'Askia Daoud']
  }
];
