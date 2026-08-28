import os
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "notebooklm_sources")
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Generating Google NotebookLM Knowledge Sources in: {OUTPUT_DIR}")

# 1. STORY & WALK JOURNEY
story_doc = """# [JUST SEAN FLOWS] 01. Brand Lore, Narrative & 7-Stage Frankfurt Walk Journey

## 1. Brand Essence & Philosophy
- **Brand Name**: JUST SEAN FLOWS (J•S•F)
- **Acoustic Signature**: 432Hz Frankfurt Velvet Harmonics
- **Origin**: Frankfurt am Main, Germany (Est. 2026)
- **Core Concept**: An immersive luxury night-walk through Frankfurt leading into an exclusive 432Hz acoustic atelier and private salon.
- **Visual Chiaroscuro**: Deep Bordeaux velvet (#480B1B), pitch-black ambient voids (#060405), radiant 18K Champagne Gold, and Neon Lime (#E7FF00) accents.

## 2. The 7-Stage 1st-Person Walk Narrative
1. **Stage 1: Midnight Frankfurt Alleyway (🌙)**
   - Time: 02:00 AM.
   - Ambience: Cold howl of the Frankfurt wind, quiet cobblestone streets, distant neon glimmers.
   - Interaction: 2-second atmospheric lock, continuous stride locomotion with WASD / swipe physics.

2. **Stage 2: Ancient Cartographic Map (🗺️)**
   - Lore: Uncovering the historical Frankfurt guild map marking the hidden sanctuary.
   - Acoustic Shift: Introduction of the D minor 7th harmonic string pad.

3. **Stage 3: The Club Gate Threshold (🗝️)**
   - Visual: Heavy brass & iron gate with the iconic 18K Gold JSF Emblem.
   - Interaction: Key unlocking sequence, threshold clearance.

4. **Stage 4: German Corporate Milestone (🏢 - UG Formation)**
   - Lore: Official corporate structuring of Sean Flows in Frankfurt.
   - 3-Phase Business Evolution:
     * July 2026: UG Application filed
     * August 2026: Legal documentation & notarization passed
     * September 2026: Official German Commercial Register (Handelsregister) registration

5. **Stage 5: The Illuminating Atelier (🏢 - Light Ingress)**
   - Visual: Dynamic lighting shift from pitch-black night into warm incandescent studio spotlights.

6. **Stage 6: Museum Portal & Threshold (🏛️)**
   - Lore: Crossing the gateway into the permanent digital archive and lookbook.

7. **Stage 7: Steinway & Sons Private Salon (👑)**
   - Climax: Grand 1st-person entry into the Frankfurt Steinway Salon.
   - Features: Steinway Grand Piano, 1780 Guarneri Violin, panoramic Frankfurt nightscape terrace, candlelit chandelier chiaroscuro.
"""

with open(os.path.join(OUTPUT_DIR, "01_Story_and_Walk_Journey.md"), "w", encoding="utf-8") as f:
    f.write(story_doc)

# 2. TECHNICAL ARCHITECTURE
tech_doc = """# [JUST SEAN FLOWS] 02. Full Codebase Architecture, 3D WebGL & Physics Engine

## 1. Technology Stack
- **Framework**: React 18 / Vite 6 (Single Page Luxury Application)
- **Styling**: Tailwind CSS + Custom Chiaroscuro Gradients + Glassmorphic Shaders
- **Animation**: Framer Motion (Spring physics, dynamic gesture tracking, layout animations)
- **3D Graphics**: Three.js (WebGL 18K Physical Gold Mesh, custom Normal Maps, Studio Directional Lighting)
- **Audio Engine**: Web Audio API + CADENZA-432 DSP Waveform Canvas Engine
- **Hardware Sensors**: DeviceOrientation / DeviceMotion Gyroscope with natural auto-calibration & 4-shake detection

## 2. Component Hierarchy & File Map
- `src/KineticPortfolio.jsx`: Master root application controller coordinating audio, gyro, physics, modals, and safe boundaries.
- `src/components/common/ArchitecturalLedBoundaries.jsx`: Photorealistic top (3%) and bottom (3%) linear LED light rails ensuring zero viewport clipping across all devices.
- `src/components/common/Header3D.jsx`: 3D kinetic champagne gold typography with letter-by-letter kinetic bounce, magnetic snap, and volume morph.
- `src/components/common/GoldEmblem3DCanvas.jsx`: Real-time Three.js WebGL 3D gold emblem featuring custom 3D normal maps and top-down keylight glints.
- `src/components/modals/InitialUnlockSplash.jsx`: Bordeaux velvet opening card with 5-stage scale resonance and 0.4s 4-shake [ENTER ATELIER] shortcut reveal.
- `src/components/museum/AtelierMuseumHub.jsx`: Luxury horizontal snap carousel archive featuring the CADENZA-432 multi-track micro-player (0:15 / 2:38 time counter + waveform visualizer).
- `src/components/museum/SpatialSalonViewerModal.jsx`: 1st-person 3D spatial tour of Frankfurt Salon (Center, Piano, Violin, Terrace) with responsive interactive radar.
- `src/components/museum/CoutureLookbookModal.jsx`: Editorial fashion magazine lookbook with swipe gestures and bottom metadata sheet.
- `src/components/walk/Step07Timeline.jsx`: 1.5x accelerated kinetic 3-line UG timeline.

## 3. Hardware Sensor Physics Heuristics
- **Gyro Auto-Calibration**: Captures initial resting phone tilt angle and sets it as the dynamic zero-origin.
- **EMA Smoothing**: Exponential Moving Average (alpha = 0.15) filtering out micro-tremors for butter-smooth 60fps parallax.
- **0.4s Shake Window**: 4 acceleration spikes within 400ms required to trigger the secret shortcut.
"""

with open(os.path.join(OUTPUT_DIR, "02_Technical_Architecture.md"), "w", encoding="utf-8") as f:
    f.write(tech_doc)

# 3. MUSIC & CADENZA-432
music_doc = """# [JUST SEAN FLOWS] 03. Music Theory, Acoustic Specifications & CADENZA-432 Engine

## 1. Tuning & Acoustic Fundamentals
- **Concert Pitch**: A4 = 432Hz (Verdi Tuning / Scientific Pitch)
- **Harmonic Profile**: Organic warm string resonances, reduced ear fatigue, high-definition transient dynamics.
- **Primary Progression**: D minor (Dm - Gm7 - C7 - Fmaj7 - Bbmaj7 - Em7b5 - A7 - Dm)

## 2. Master Track Catalog
1. **Track 1: A Twelve-minute Alibi (Strings Master)**
   - Tempo: 78 BPM
   - Meter: 4/4 Ballad / Neo-Classical Chiaroscuro
   - Key: D minor
   - Lead Vocals & Lyrics:
     * "When the Frankfurt freeze is howling, / And the surge pricing breaks your heart."
     * "You can slip through the cobblestone alleys, / Where the 432 velvet chords start."
     * "Twelve minutes of silence, twelve minutes of grace, / An alibi written in velvet and lace."

2. **Track 2: Capriccio in A minor, Op. 1 (Guarneri Violin Virtuoso)**
   - Solo Instrument: 1780 Guarneri del Gesù Acoustic Violin
   - Dynamic Range: ppp to fff con fuoco

3. **Track 3: Grand Single Master (Frankfurt Atelier 432Hz Cut)**
   - Mastered at: Frankfurt Abbey Studio 432Hz

## 3. CADENZA-432 Dynamic Digital Sheet Music Engine
- Real-time onset-to-grid transcription
- Dynamic pitch-to-MIDI heuristics
- Measure balance & beam grouping for 4/4 time
- Interactive karaoke-style lyric synchronization
"""

with open(os.path.join(OUTPUT_DIR, "03_Music_Theory_and_Audio.md"), "w", encoding="utf-8") as f:
    f.write(music_doc)

# 4. LOOKBOOK & DESIGN SYSTEM
design_doc = """# [JUST SEAN FLOWS] 04. Couture Lookbook, Brand CI/BI & Spatial Design System

## 1. Brand Identity Assets (CI/BI)
- **Official Monogram**: Wine Glass + Treble G-Clef + J•S•F Letterform
- **Color Codes**:
  * Imperial Bordeaux: `#480B1B` (RGB: 72, 11, 27)
  * Deep Obsidian Void: `#060405` (RGB: 6, 4, 5)
  * 18K Champagne Gold: `#C8A96E` (RGB: 200, 169, 110)
  * High-Resonance Neon: `#E7FF00` (RGB: 231, 255, 0)
  * Pure Pearl White: `#F7EBE1` (RGB: 247, 235, 225)

## 2. 14-Piece Editorial Lookbook Collection
- 01. Portrait: Editorial Wool Overcoat in Deep Charcoal
- 02. Stride: Frankfurt Skyline Midnight Silhouette
- 03. Seated: Bordeaux Velvet Lounge Armchair
- 04. Side Profile: Chiaroscuro Shadow Falloff
- 05. Editorial: Silk Cravat & Gold Cufflinks
- 06. Bag Hero: Handcrafted Calfskin Messenger
- 07. Bag Hand: 18K Gold Clasp Close-up
- 08. Necklace: Minimalist Acoustic Tuning Fork Pendant (432Hz engraved)
- 09. Ring & Bracelet: Brutalist Gold Band
- 10. Scarf: Cashmere Bordeaux Weave
- 11. Buttons: Hand-engraved JSF Monogram Horn Buttons
- 12. Stiletto: High-gloss Patent Leather
- 13. Wine Glass: Riedel Crystal with 2018 Bordeaux Grand Cru
- 14. Journal: Leather-bound Musical Manuscript

## 3. Spatial Salon Coordinates
- Spot A: Steinway Grand Piano Center Stage
- Spot B: Guarneri Violin Acoustic Shell
- Spot C: Frankfurt Skyline Open-air Terrace
- Spot D: Private Vault & VIP Tasting Lounge
"""

with open(os.path.join(OUTPUT_DIR, "04_Design_System_and_Lookbook.md"), "w", encoding="utf-8") as f:
    f.write(design_doc)

# 5. BUSINESS & ROADMAP
biz_doc = """# [JUST SEAN FLOWS] 05. German Corporate Structure (UG), VIP Membership & 2026 Party Roadmap

## 1. Corporate Milestones (Frankfurt am Main)
- **Entity**: Just Sean Flows UG (haftungsbeschränkt)
- **July 2026**: Notarial deed & articles of association drafted
- **August 2026**: Bank capital verification & document approval
- **September 2026**: Commercial register entry (Amtsgericht Frankfurt am Main)

## 2. Instagram VIP Authentication & Private Vault
- Automatic OAuth/Avatar sync for verified VIP members
- VIP recognition badge on splash (`⚜️ WELCOME BACK, @username (VIP #001)`)
- Personalized Salon Vault with private listening room and score downloads

## 3. October 2026 Frankfurt Exclusive Atelier Party
- **Date**: October 2026
- **Location**: Frankfurt Historical Altstadt Secret Salon
- **Dress Code**: Black Velvet & 18K Gold Chiaroscuro
- **Live Performances**: 432Hz String Quartet + Steinway Solo + Wine Pairing
"""

with open(os.path.join(OUTPUT_DIR, "05_Business_and_Roadmap.md"), "w", encoding="utf-8") as f:
    f.write(biz_doc)

# 6. MASTER COMBINED DOSSIER
master_doc = f"""# JUST SEAN FLOWS — Complete Master Project Knowledge Dossier
Generated for Google NotebookLM Deep Knowledge Ingestion

---
{story_doc}

---
{tech_doc}

---
{music_doc}

---
{design_doc}

---
{biz_doc}
"""

with open(os.path.join(OUTPUT_DIR, "JUST_SEAN_FLOWS_MASTER_DOSSIER.md"), "w", encoding="utf-8") as f:
    f.write(master_doc)

print("All 6 NotebookLM Knowledge Sources successfully generated in notebooklm_sources/!")
