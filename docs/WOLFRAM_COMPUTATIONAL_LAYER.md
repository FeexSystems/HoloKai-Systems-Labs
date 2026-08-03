# HoloKai Computational Knowledge Layer — Wolfram Integration

## Core Principle

**HoloKai = cultural/historical reasoning + Wolfram = computation, structured entities, quantitative verification.**

Wolfram is **not** a general history database. It is the computational intelligence behind the visual research experience. HoloKai's dedicated historical knowledge layer contains the specialized African scholarship; Wolfram provides structured data and quantitative verification.

> **Wolfram should not be treated as a comprehensive African-history corpus.** Use it for computation and structured data. Several broad Africa-specific queries return no direct results from Wolfram's semantic search.

---

## Architecture

```text
                    HOLOKAI
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   KNOWLEDGE       COMPUTATION     EPISTEMOLOGY
        │              │              │
 History            Wolfram       Evidence
 Archaeology        Math          Consensus
 Culture            Astronomy     Debate
 Anthropology       Geography     Tradition
 Linguistics        Statistics    Speculation
 Genetics           Dates         Mythology
        │              │              │
        └──────────────┼──────────────┘
                       ▼
               HOLOKAI ORACLE
                       │
              "Where Civilizations
                   Remember"
```

### Oracle → Evidence → Computation → Visualization

```text
Research Question
       ↓
Oracle
       ↓
Sources / Claims
       ↓
Wolfram computation
       ↓
Verified numerical result
       ↓
Visualization
```

This makes the HoloKai Oracle feel like a **research instrument**, not a chatbot.

---

## 1. Civilization & Historical Entity Engine

HoloKai should computationally interrogate:

- Ancient Egypt / Kemet
- Nubia
- Kush
- Aksum
- Carthage
- Ghana Empire
- Mali Empire
- Songhai
- Kanem-Bornu
- Benin
- Ife
- Great Zimbabwe
- Swahili Coast
- Medieval Maghreb
- Moorish Iberia
- African diaspora
- Comparative civilizations worldwide

### Wolfram entity resolution

Wolfram provides `HistoricalCountry` entities with properties including **StartDate, EndDate, Area, CurrentCountries, Position, and Polygon**. [Wolfram HistoricalCountry reference](https://reference.wolfram.com/language/ref/entity/HistoricalCountry.html)

```wl
e = \[FreeformPrompt]["Mali Empire"];

EntityValue[
    e,
    {
        "StartDate",
        "EndDate",
        "Area",
        "CurrentCountries",
        "Position",
        "Polygon"
    },
    "Association"
]
```

> **Important:** Do not hard-code Wolfram entity identifiers. Use `\[FreeformPrompt]` to resolve natural-language names into valid entities. This is specifically recommended by the Wolfram documentation.

---

## 2. Chronology Engine

A **signature HoloKai capability**. HoloKai should calculate:

- "Which existed first?"
- "How many years did these civilizations overlap?"
- "What was happening in Africa when Rome was expanding?"
- "What civilizations existed around 500 BCE?"

### Wolfram functions

- `DateObject`
- `DateDifference`
- `DatePlus`
- `TimelinePlot`
- `DateHistogram`
- Historical-period entities

Wolfram has a `HistoricalPeriod` entity type specifically for notable historical periods. [Wolfram HistoricalPeriod reference](https://reference.wolfram.com/language/ref/entity/HistoricalPeriod.html)

---

## 3. Geographic Civilization Engine

Extremely powerful for HoloKai. Supports questions like:

- "How far was Timbuktu from Cairo?"
- "What modern countries correspond to the Mali Empire?"
- "How large was the Mali Empire compared with the Roman Empire?"
- "Which ancient civilizations developed around the Niger River?"

### Computational capabilities

- Latitude/longitude
- Geodesic distance
- Area comparison
- Borders and polygons
- Rivers, lakes, deserts, mountains, coastlines
- Migration routes
- Trade routes
- Historical territories

Historical `Polygon` data represents historical territories.

---

## 4. Astronomy & Ancient Sky Engine

This could make HoloKai **exceptionally distinctive**.

### Supported questions

- "What would the night sky have looked like over Kemet around 2500 BCE?"
- "When was the next lunar eclipse visible from Nubia?"
- "Could Sirius have been visible from this location on this historical date?"

### Astronomical entities

- Sun, Moon, planets
- Solstices, equinoxes, eclipses
- Stars, constellations
- Precession
- Ancient calendars
- Celestial visibility at geographic observation points

Wolfram performs the astronomical computation; HoloKai handles historical interpretation.

---

## 5. Mathematics & Engineering Verification

HoloKai should check claims about ancient technology **quantitatively**, not repeat impressive-sounding claims uncritically.

### Architecture
- Pyramid geometry, monumental dimensions
- Volume, surface area, load estimates
- Angles, material quantities

### Engineering
- Irrigation, water flow
- Agricultural productivity
- Transportation, construction

### Mathematics
- Ratios, geometry, statistics, probability
- Logarithms, unit conversions

---

## 6. Population & Genetics

**Requires particularly careful handling.**

HoloKai must distinguish:

| Concept | Not interchangeable with |
|---------|-------------------------|
| Historical population | Modern population |
| Genetic ancestry | Ethnicity |
| Language | Archaeological culture |

HoloKai should **never** infer:

> "Ancient civilization X = modern ethnic group Y"

without evidence.

Instead, present:

> **Evidence:** archaeological / linguistic / genetic / textual
> **Confidence:** high / moderate / low
> **Interpretation:** scholarly consensus / debated / speculative

---

## 7. Economics & Civilization Scale

Wolfram can provide quantitative analysis of:

- GDP, GDP per capita, PPP
- Inflation, population, growth
- Agriculture, industry, trade
- Geographic area

> **Important:** For ancient civilizations, **do not fabricate GDP equivalents** where historical data doesn't support them. Instead discuss: estimated population, agricultural capacity, documented trade volume, taxation systems, gold/salt trade, resource geography, urbanization.

> Time-dependent values must always be labeled with their reference year.

---

## 8. Linguistic Computation

Build support for:

- Language families and geographic distribution
- Etymology and phonetics
- Historical linguistics and cognates
- Writing systems
- Language change and comparative vocabulary

Especially useful for investigating claims like "Are these two languages related?" with evidence rather than binary answers.

---

## 9. Mythology & Esoteric Knowledge Layer

**Critical for HoloKai** given its cultural material. Do not delete esoteric material. Instead, create a separate epistemic layer:

### Epistemic classifications

| Level | Definition |
|-------|-----------|
| `ESTABLISHED` | Supported by substantial evidence |
| `SCHOLARLY_DEBATE` | Competing academic interpretations |
| `TRADITION` | Part of an oral, religious, cultural, or historical tradition |
| `ESOTERIC` | A belief system or esoteric teaching |
| `SPECULATIVE` | An unverified hypothesis |
| `FICTIONAL` | A creative or fictional narrative |

### Example: 9 Ether beings

> **Tradition / esoteric account:** Some teachings associated with X describe...
>
> **Historical evidence:** There is no established archaeological evidence demonstrating that these beings were extraterrestrial historical entities.
>
> **Context:** Here's where the belief comes from and how it developed.

This is much more powerful than censoring the topic.

---

## 10. HoloKai Evidence Matrix

A **core response protocol.** Every substantive historical answer internally evaluates:

```text
CLAIM
│
├── Primary sources
├── Archaeology
├── Linguistics
├── Genetics
├── Geography
├── Chronology
├── Astronomy
├── Oral tradition
├── Scholarly consensus
└── Alternative interpretations
        ↓
COMPUTATIONAL VERIFICATION
        ↓
CONFIDENCE ASSESSMENT
        ↓
HoloKai RESPONSE
```

### Confidence heuristic

| Range | Label |
|-------|-------|
| 0.90–1.00 | Very strong |
| 0.75–0.89 | Strong |
| 0.60–0.74 | Moderate |
| 0.40–0.59 | Uncertain |
| 0.20–0.39 | Weak |
| 0.00–0.19 | Speculative |

> Do not present this numeric confidence as an objectively measured scientific probability unless there's an actual statistical basis. Treat it as an **internal evidence-rating heuristic**.

---

## 11. Computational Query Router

```text
USER QUESTION
      │
      ▼
IDENTIFY DOMAIN
      │
 ┌────┼────┬────┬────┐
 ▼    ▼    ▼    ▼    ▼
History Geo  Math Astro Biology
 │     │    │    │     │
 └─────┴────┬───┴─────┘
             ▼
       WOLFRAM COMPUTE
             │
             ▼
     EVIDENCE CLASSIFIER
             │
             ▼
       HOLOKAI RESPONSE
```

### Trigger Wolfram when the user asks:

- "How many?"
- "How far?"
- "How large?"
- "When?"
- "How old?"
- "What percentage?"
- "Compare"
- "Calculate"
- "Could this have happened?"
- "What was visible?"
- "How long did they overlap?"
- "What was the population?"
- "What was the astronomical position?"

---

## 12. Core Computational Instruction

This instruction should be embedded directly into HoloKai's AI prompt:

> **When a question requires mathematics, quantitative comparison, chronology, geographic calculation, astronomical computation, statistical analysis, unit conversion, or structured historical entity data, use the computational knowledge layer whenever appropriate. Never invent numerical values. Identify the reference date, units, assumptions, uncertainty, and provenance of quantitative results. Distinguish calculated results from historical interpretation. For historical claims, distinguish established evidence, scholarly debate, cultural tradition, and speculation.**

> **When computational results conflict with a user's premise, do not force the result to support the premise. Explain the discrepancy respectfully and show the reasoning.**

---

## Wolfram's Specific Role in HoloKai

Wolfram is **not** another visual design tool. Its role is computational intelligence behind the visual research experience.

### Capabilities

- Timeline calculations
- Chronology normalization
- Geographic calculations
- Astronomical relationships
- Statistical analysis
- Quantitative comparisons
- Graph calculations
- Historical date transformations
- Mathematical validation
- Structured research computation

### UX integration

Oracle → Evidence → Computation → Visualization

---

## 13. Frontend Implementation Reference

The Wolfram Computational Layer is implemented in the HoloKai frontend via:

- **Service Module**: [`src/lib/wolframService.js`](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/holo-kai/src/lib/wolframService.js)
  - `queryWolframComputation(query)`
  - `classifyQueryDomain(query)`
  - `shouldTriggerComputation(query)`
  - `evaluateEvidenceMatrix(claimText)`
- **UI Components**:
  - [`EpistemicBadge.jsx`](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/holo-kai/src/components/oracle/EpistemicBadge.jsx) — Renders 6 epistemic levels
  - [`ConfidenceIndicator.jsx`](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/holo-kai/src/components/oracle/ConfidenceIndicator.jsx) — Renders confidence score & rating heuristic
  - [`ComputationResult.jsx`](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/holo-kai/src/components/oracle/ComputationResult.jsx) — Displays Wolfram code expression, data fields, and provenance
  - [`EvidenceMatrix.jsx`](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/holo-kai/src/components/oracle/EvidenceMatrix.jsx) — Combines claims, evidence sources, and Wolfram computation
- **Panel Integration**: Integrated into `OracleCorePanel.jsx` (under the "Wolfram Compute Engine" sub-tab) and `CompareCivilizations.jsx`.

