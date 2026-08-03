import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Volume2, X, HelpCircle } from 'lucide-react';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { retroAudio } from '@/lib/audioFeedback';

export const CULTURAL_GLOSSARY_DICTIONARY = {
  kandake: {
    term: 'Kandake',
    nativeName: '𐦡𐦩𐦟𐦡 (Meroïtic)',
    pronunciation: 'kan-DAH-kay',
    region: 'Nubia / Kush',
    era: '1000 BCE – 350 CE',
    definition: 'The imperial title for the warrior queens and queen mothers of the Kingdom of Kush. Famous Kandakes like Amanirenas famously resisted Roman invasion and defeated Augustus Caesar\'s legions.',
    culturalContext: 'In Kushite society, Kandakes held supreme political, military, and ceremonial authority, often depicted leading armored battle phalanxes or presiding over sacred coronation rituals.',
  },
  oba: {
    term: 'Oba',
    nativeName: 'Oba (Edo)',
    pronunciation: 'OH-bah',
    region: 'Kingdom of Benin',
    era: '1180 CE – Present',
    definition: 'The sacred king and political leader of the Kingdom of Benin (Edo people). The Oba is revered as divine, acting as guardian of spiritual tradition and chief patron of royal brass-casters.',
    culturalContext: 'Each Oba commissioned master bronze sculptors to create elaborate brass commemorative heads and relief plaques detailing court victories, ceremonial attire, and royal genealogies.',
  },
  stelae: {
    term: 'Stelae (Obelisks)',
    nativeName: 'Hawilt (Ge\'ez)',
    pronunciation: 'STEEL-ee',
    region: 'Aksumite Empire',
    era: '100 CE – 700 CE',
    definition: 'Towering monolithic stone obelisks sculpted from single blocks of granite by Aksumite master architects to serve as underground royal tombs and symbols of skyward majesty.',
    culturalContext: 'The King Ezana Stele stands over 79 feet tall, featuring faux multi-story doors, architectural windows, and inscriptions in Ge\'ez, Sabaean, and Ancient Greek.',
  },
  griot: {
    term: 'Griot (Jeli)',
    nativeName: 'Jali / Jeliw (Mandinka)',
    pronunciation: 'GREE-oh',
    region: 'Mali / West Africa',
    era: '1200 CE – Present',
    definition: 'A traditional West African oral historian, poet, musician, and diplomat who preserves royal genealogies, heroic epics, and clan traditions across centuries.',
    culturalContext: 'Griots play the 21-stringed Kora harp-lute or Balafon xylophone, serving as living archives without whom ancient histories like the Epic of Sundiata Keita would have been lost.',
  },
  kente: {
    term: 'Kente Cloth',
    nativeName: 'Nwentoma (Akan)',
    pronunciation: 'KEN-tay',
    region: 'Ashanti / Akan',
    era: '1100 CE – Present',
    definition: 'A sacred, hand-woven silk and cotton fabric of the Ashanti Kingdom, characterized by intricate woven geometric patterns with specific symbolic meanings.',
    culturalContext: 'Originally reserved exclusively for royal ceremonies and sacred kings, each pattern represents a specific proverb, historic achievement, or moral philosophy (e.g., "Sika Futoro" = Gold Dust).',
  },
  mansa: {
    term: 'Mansa',
    nativeName: 'Mansa (Mandinka)',
    pronunciation: 'MAHN-sah',
    region: 'Mali Empire',
    era: '1235 CE – 1670 CE',
    definition: 'The title meaning "King of Kings" or Emperor in the Mali Empire, famously held by Mansa Musa who established Mali as a global center of wealth, trade, and Islamic scholarship.',
    culturalContext: 'During Mansa Musa\'s legendary 1324 pilgrimage to Mecca, his lavish distribution of gold across Cairo depressed local gold prices for over a decade.',
  },
  nsibidi: {
    term: 'Nsibidi',
    nativeName: 'Nsibidi (Ejagham/Igbo)',
    pronunciation: 'en-SEE-bee-dee',
    region: 'Cross River / Nigeria',
    era: '400 CE – Present',
    definition: 'An ancient indigenous ideographic script composed of hundreds of graphic symbols used for communication, record-keeping, court proceedings, and sacred secret societies.',
    culturalContext: 'Nsibidi symbols were carved onto ceremonial masks, painted onto body art, embroidered on cloth, and etched onto bronze, encoding deep proverbs and mystical allegories.',
  },
  nzimbu: {
    term: 'Nzimbu Shells',
    nativeName: 'Nzimbu (Kikongo)',
    pronunciation: 'en-ZEEM-boo',
    region: 'Kingdom of Kongo',
    era: '1300 CE – 1700 CE',
    definition: 'Small Olivella sea snail shells collected off Luanda Island that served as a standardized royal currency and monetary unit throughout the Kingdom of Kongo.',
    culturalContext: 'The Manikongo (King) strictly regulated the extraction and minting of Nzimbu shells to prevent inflation and collect taxes across Kongo\'s six central provinces.',
  },
  terracotta: {
    term: 'Nok Terracotta',
    nativeName: 'Terracotta Sculptures',
    pronunciation: 'terra-COT-ta',
    region: 'Nok Culture / Nigeria',
    era: '1000 BCE – 500 CE',
    definition: 'Hollow, highly detailed clay sculptures created by the Nok culture, featuring distinctive almond-shaped eyes, elaborate hairstyles, and royal beads.',
    culturalContext: 'These ceramics demonstrate some of the earliest sophisticated sculpture in West Africa, fired in specialized kilns alongside early iron-smelting furnaces.',
  },
  'golden stool': {
    term: 'Golden Stool',
    nativeName: 'Sika Dwa Kofi (Ashanti)',
    pronunciation: 'SEE-kah DWAH KOH-fee',
    region: 'Ashanti Empire',
    era: '1701 CE – Present',
    definition: 'The divine golden throne of the Ashanti nation, believed to have been summoned from the heavens by priest Okomfo Anokye into the lap of King Osei Tutu I.',
    culturalContext: 'The Golden Stool is so sacred that no person—including the King—is ever permitted to sit upon it; it represents the collective soul (*sunsum*) of all Ashanti people past, present, and future.',
  },
  geez: {
    term: 'Ge\'ez Script',
    nativeName: 'ግዕዝ (Ge\'ez)',
    pronunciation: 'geh-EZ',
    region: 'Aksum / Ethiopia',
    era: '100 BCE – Present',
    definition: 'An ancient South Semitic abugida writing system developed in Aksum, used for classical Ethiopic scriptures, royal stelae inscriptions, and illuminated parchment codices.',
    culturalContext: 'Ge\'ez remains the liturgical language of the Ethiopian Orthodox Tewahedo Church and is the ancestor of modern Amharic and Tigrinya scripts.',
  },
  lalibela: {
    term: 'Lalibela Rock Churches',
    nativeName: 'ላሊበላ (Amharic)',
    pronunciation: 'lah-lee-BEH-lah',
    region: 'Zagwe / Ethiopia',
    era: '1181 CE – 1221 CE',
    definition: 'A UNESCO World Heritage site comprising 11 monolithic Christian churches carved entirely downwards out of solid red volcanic basalt rock under King Lalibela.',
    culturalContext: 'Churches like Biete Ghiorgis (Church of St. George) were excavated in cruciform shapes with intricate drainage systems, subterranean tunnels, and ceremonial rock reliefs.',
  },
  sundiata: {
    term: 'Sundiata Keita',
    nativeName: 'Sundiata Keita (Mandinka)',
    pronunciation: 'soon-JAH-tah KYE-tah',
    region: 'Mali Empire',
    era: '1217 CE – 1255 CE',
    definition: 'The legendary "Lion King" founder of the Mali Empire who overcame paralysis as a child to unite 12 Malinke kingdoms at the historic Battle of Kirina in 1235 CE.',
    culturalContext: 'Sundiata established the *Kouroukan Fouga*, one of the world\'s earliest oral constitutions guaranteeing human rights, environmental stewardship, and social order.',
  },
  kilwa: {
    term: 'Kilwa Kisiwani',
    nativeName: 'Kilwa (Swahili)',
    pronunciation: 'KEEL-wah kee-see-WAH-nee',
    region: 'Swahili Coast',
    era: '950 CE – 1500 CE',
    definition: 'A wealthy Swahili island city-state that dominated the Indian Ocean gold trade, famous for its grand coral-stone architecture like the Husuni Kubwa palace.',
    culturalContext: 'Famed Moroccan traveler Ibn Battuta visited Kilwa in 1331 CE and described it as "one of the most beautiful and finely built cities in the world."',
  },
  'iron smelting': {
    term: 'African Iron Smelting',
    nativeName: 'Bloomery Smelting',
    pronunciation: 'EYE-urn SMELT-ing',
    region: 'Pan-African (Nok/Kush)',
    era: '1500 BCE – Present',
    definition: 'Indigenous metallurgical technology using natural-draft bloomeries and clay tuyère pipes to smelt iron ore at temperatures exceeding 1,200°C.',
    culturalContext: 'Master ironworkers were revered as spiritual alchemists who transformed earth into weapons, agricultural tools, and ceremonial regalia.',
  },
};

export function findGlossaryTerm(text) {
  if (!text) return null;
  const clean = text.trim().toLowerCase().replace(/[^\w\s']/g, '');
  
  // Direct key match
  if (CULTURAL_GLOSSARY_DICTIONARY[clean]) {
    return CULTURAL_GLOSSARY_DICTIONARY[clean];
  }

  // Partial or alias match
  for (const [key, item] of Object.entries(CULTURAL_GLOSSARY_DICTIONARY)) {
    if (clean.includes(key) || key.includes(clean) || item.term.toLowerCase().includes(clean)) {
      return item;
    }
  }

  return null;
}

export default function CulturalGlossary() {
  const { theme, soundEffectsEnabled } = useHoloKai();
  const [activeTerm, setActiveTerm] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [customQuery, setCustomQuery] = useState(null);
  const [isDynamicLoading, setIsDynamicLoading] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        return;
      }

      const selectedText = selection.toString().trim();
      if (selectedText.length < 3 || selectedText.length > 50) return;

      const matched = findGlossaryTerm(selectedText);
      
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Calculate position above selection
        const top = Math.max(20, rect.top + window.scrollY - 10);
        const left = Math.min(window.innerWidth - 340, Math.max(20, rect.left + window.scrollX + rect.width / 2 - 160));
        
        setPosition({ top, left });

        if (matched) {
          setActiveTerm(matched);
          setCustomQuery(null);
          if (soundEffectsEnabled) retroAudio.playClick();
        } else {
          // Allow dynamic Oracle lookup for highlighted unknown term
          setCustomQuery({
            term: selectedText,
            rawSelection: selectedText,
          });
          setActiveTerm(null);
        }
      } catch (err) {
        // Ignore selection bounds errors
      }
    };

    const handleMouseUp = (e) => {
      // Don't close if clicking inside popover
      if (popoverRef.current && popoverRef.current.contains(e.target)) {
        return;
      }
      setTimeout(handleSelectionChange, 10);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [soundEffectsEnabled]);

  const speakTerm = (text) => {
    if (soundEffectsEnabled) retroAudio.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const closeGlossary = () => {
    if (soundEffectsEnabled) retroAudio.playClick();
    setActiveTerm(null);
    setCustomQuery(null);
  };

  const handleFetchDynamicDefinition = async () => {
    if (!customQuery || isDynamicLoading) return;
    setIsDynamicLoading(true);
    if (soundEffectsEnabled) retroAudio.playClick();

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.6-flash',
          messages: [
            {
              role: 'user',
              content: `Provide a quick cultural glossary entry for the African historical/cultural term or phrase "${customQuery.term}". Return a JSON or clear text with Term, Region/Civilization, Era, Definition (1-2 sentences), and Cultural Context (1 sentence).`
            }
          ],
          system_instruction: "You are the HoloKai Cultural Glossary engine. Provide concise, accurate historical definitions for African historical terms."
        })
      });

      if (!response.ok) throw new Error('Failed to fetch glossary entry');

      const data = await response.json();
      const text = data.text || '';

      setActiveTerm({
        term: customQuery.term,
        nativeName: 'Historical Reference',
        pronunciation: 'Archival Term',
        region: 'Alkebulan Archive',
        era: 'Ancient Era',
        definition: text.split('\n')[0] || text,
        culturalContext: text.split('\n').slice(1).join(' ') || 'Researched via Gemini HoloKai Matrix.',
      });
      setCustomQuery(null);
    } catch (err) {
      setActiveTerm({
        term: customQuery.term,
        region: 'Archive Term',
        definition: `Historical term referenced in Alkebulan civilizational archives.`,
        culturalContext: 'Explore further in the Oracle Portal or Voice Synthesis module.',
      });
      setCustomQuery(null);
    } finally {
      setIsDynamicLoading(false);
    }
  };

  if (!activeTerm && !customQuery) return null;

  return (
    <AnimatePresence>
      <div
        ref={popoverRef}
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 9999,
        }}
        className="font-sans"
      >
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-[320px] rounded-2xl shadow-2xl border p-4 relative overflow-hidden backdrop-blur-xl bg-zinc-950/95 border-amber-500/30 text-zinc-100 shadow-black/90"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2.5 mb-3 border-amber-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-400 flex items-center gap-1">
                  Cultural Glossary
                  <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                </span>
                <p className="text-[9px] font-mono opacity-60">ALKEBULAN TERMINOLOGY</p>
              </div>
            </div>
            <button
              onClick={closeGlossary}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt for Custom Term */}
          {customQuery && !activeTerm && (
            <div className="space-y-3">
              <p className="text-xs">
                Highlighted: <strong className="text-amber-400 font-mono">"{customQuery.term}"</strong>
              </p>
              <button
                onClick={handleFetchDynamicDefinition}
                disabled={isDynamicLoading}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
              >
                {isDynamicLoading ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Querying Oracle Matrix...</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explain Term with Oracle AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Content for Recognized Term */}
          {activeTerm && (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold font-mono text-amber-400 flex items-center gap-2">
                    {activeTerm.term}
                    {activeTerm.pronunciation && (
                      <button
                        onClick={() => speakTerm(activeTerm.term)}
                        className="p-1 hover:text-amber-500 transition-colors"
                        title="Pronounce Term"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </h4>
                  {activeTerm.nativeName && (
                    <p className="text-[11px] font-serif italic text-zinc-400">
                      {activeTerm.nativeName}
                    </p>
                  )}
                </div>

                {activeTerm.region && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border shrink-0 bg-amber-500/10 border-amber-500/30 text-amber-300">
                    {activeTerm.region}
                  </span>
                )}
              </div>

              {activeTerm.definition && (
                <p className="text-xs leading-relaxed text-zinc-200">
                  {activeTerm.definition}
                </p>
              )}

              {activeTerm.culturalContext && (
                <div className="p-2.5 rounded-xl text-[11px] leading-normal border bg-zinc-900/80 border-white/5 text-zinc-300">
                  <strong className="text-amber-400 font-mono uppercase text-[9px] block mb-0.5">Cultural Significance:</strong>
                  {activeTerm.culturalContext}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
