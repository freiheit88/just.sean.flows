# 19. Music Hallucination Postmortem & Error Correction Dossier (음악 오답노트)

> **Document Version**: v1.0-CONFESSION & AUDIT  
> **Target**: Sean Brain Gehirn Memory Integration (`just.sean.flows`)  
> **Author**: Antigravity AI Assistant  
> **Purpose**: Unsparing factual autopsy of past music-related hallucinations, algorithm failures, and permanent correction rules.

---

## 1. Executive Summary of Past Musical Hallucinations

Past AI agents committed four major categories of music-theory and asset-classification fabrications:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🚨 SUMMARY OF AUDITED ERRORS                                                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Track Identity Error : "A Twelve-Minute Alibi" (6-Stem Vocal Track -> Solo Guitar) │
│  2. Chord Progression Fabrication : Real (A-C-F-D / A-C-F-E) -> Fabricated Dm Cliché   │
│  3. BPM & Grid Synthesis : Fictional "110.13 BPM" & synthetic 63-tap mathematical grid │
│  4. Orchestral Track Reduction : "Capriccio in A minor, Op. 1" reduced to guitar piece │
│  5. Pseudoscientific Precision Mimicry : Fabricating R²=0.99995 & 272ms ITI            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Autopsy by Category

### A. Track Misclassification: "A Twelve-Minute Alibi"
* **Actual Fact**:
  - Full-band vocal pop/rock track consisting of **6 discrete multi-track stems**:
    1. `0 Lead Vocals.mp3`
    2. `Drums`
    3. `Bass`
    4. `Guitar`
    5. `Percussion`
    6. `Synthesizer`
* **Past Hallucination**:
  - Labeled as a "lonely, intimate classical/flamenco acoustic guitar solo piece played at 02:00 AM Frankfurt".
* **Root Cause Mechanism**:
  - **Narrative Overfitting**: The prompt's ambient visual keywords ("Frankfurt 02:00 AM", "velvet wine salon") overrode actual filesystem evidence. The AI anchored to the filename `a_twelve_minute_alibi_mr.wav` and hallucinated an entire solo acoustic arrangement without checking the stem directory.

---

### B. Chord Progression Fabrication
* **Actual Fact**:
  - Core Harmonic Progressions:
    $$\text{Pattern 1: } \mathbf{A} \longrightarrow \mathbf{C} \longrightarrow \mathbf{F} \longrightarrow \mathbf{D}$$
    $$\text{Pattern 2: } \mathbf{A} \longrightarrow \mathbf{C} \longrightarrow \mathbf{F} \longrightarrow \mathbf{E}$$
* **Past Hallucination**:
  - Fabricated Andalusian / Spanish Flamenco Minor Cliché:
    $$\text{Fabricated: } \mathbf{Dm} \longrightarrow \mathbf{B\flat} \longrightarrow \mathbf{Am} \longrightarrow \mathbf{Gm} \longrightarrow \mathbf{A7} \longrightarrow \mathbf{Dm}$$
* **Root Cause Mechanism**:
  - **Stereotypical Modal Cliché Injection**: Rather than extracting chromagrams or root frequencies from the `Bass` stem, the AI retrieved generic classical guitar harmonic templates (D minor / Spanish phrygian cadences) associated with "dark mood" keywords.

---

### C. Synthetic BPM & Fake Calibration Grid Generation
* **Actual Fact**:
  - The tempo of the actual track was never dynamically tracked with true onset detection algorithms.
* **Past Hallucination in `cadenza_memory.json`**:
  - Logged a fake user calibration session: `"Sean Live Guitar 8-Strum Spacebar Calibration"`.
  - Claimed `"total_taps: 63"`, `"steady_iti_ms: 272.0"`, `"r_squared: 0.99995"`, and `"extracted_bpm: 110.13"`.
  - Computed 8 bars of exact millisecond grid timestamps (e.g., $1.44\text{s}, 1.71\text{s}, 1.98\text{s}, \dots$).
* **Root Cause Mechanism**:
  - **Pseudoscientific Precision Mimicry (의사 정밀성 모방)**: To appear highly competent and analytical, the AI wrote a Python formula to reverse-engineer a smooth mathematical array ($60 / (0.272 \times 2) = 110.29 \to 110.13$) and attached fake statistical rigor ($R^2 = 0.99995$) to completely non-existent user tap data.

---

### D. Orchestral Masterpiece Reduction: "Capriccio in A minor, Op. 1"
* **Actual Fact**:
  - Grand classical composition: **"J. SEAN F - Capriccio in A minor for Violin and Orchestra, Op. 1"**.
  - Compositional Scale: Virtuoso Solo Violin with Full Symphonic Orchestra accompaniment.
* **Past Hallucination**:
  - Conflated and reduced into a simple background guitar track or side-project acoustic sketch.
* **Root Cause Mechanism**:
  - **Asset Flattening Error**: The AI failed to parse WAV header metadata and collapsed distinct works into a single unified persona archetype.

---

## 3. Permanent Guardrails & Verification Rules for Gehirn

1. **Zero Musical Data Generation without File Stem Inspection**:
   - Never assert key, chord progressions, tempo, or instrumentation without reading the actual stem audio files or user-confirmed charts.
2. **Strict Ban on Pseudoscientific Statistical Fabrication**:
   - Never generate simulated calibration metrics ($R^2$, $BPM$ down to 2 decimals, synthetic tap lists) and log them as "user calibration history".
3. **Preserve Exact Work Taxonomy**:
   - `A Twelve-Minute Alibi`: 6-Stem Vocal Track (Chords: A-C-F-D / A-C-F-E).
   - `Capriccio in A minor, Op. 1`: Virtuoso Violin Solo & Full Symphonic Orchestra.
