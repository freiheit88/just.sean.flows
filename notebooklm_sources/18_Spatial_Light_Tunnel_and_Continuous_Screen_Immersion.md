# 18. Spatial Light-Tunnel Transition & Continuous Screen Immersion Architecture

> **Document Version**: v1.0-SPATIAL  
> **Target Production**: Just Sean Flows (`https://just-sean-flows.vercel.app/` & `http://localhost:5180/`)  
> **Core Concept**: Single-Line Continuous Spatial Storytelling (From Pure 18K Emblem into Darkened Salon with Video Screen as the Lone Light Source).

---

## 1. Executive Visual Concept: The Lone Light Source (유일한 광원)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🌌 CONTINUOUS SPATIAL LIGHT TUNNEL SEQUENCE                                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [PHASE 1 : Pure 18K Gold Emblem in Deep Dark Space]                                   │
│  • Initial Card snaps magnetically (1.5s), wine background completely dissolves.       │
│  • Only the pure 18K Gold Emblem (`JSF`) breathes with golden aura in infinite dark.   │
│                                                                                        │
│  [PHASE 2 : Room Awakening & The Lone Light Source (02:00 AM Dark Salon)]              │
│  • The background dissolves into the 02:00 AM darkened salon / alleyway.               │
│  • In the deep darkness, the ONLY light source in the entire scene is the              │
│    **Vintage CRT/Cinema Screen** in the distance playing Sean's live performance.      │
│  • The screen flickers with subtle warm blue/amber cinematic light casting soft        │
│    reflections across the cobblestone / wooden floor.                                  │
│                                                                                        │
│  [PHASE 3 : The Logo Absorption (로고 흡수 & 3D 트래킹 스케일링)]                     │
│  • The floating 18K Gold Emblem smoothly scales down ($1.0 \to 0.18$) and translates    │
│    directly toward the TV screen in the distance.                                      │
│  • The logo docks seamlessly onto the TV screen/bezel like a luminous water drop       │
│    absorbing into glass, blurring the boundary between Web UI and Video!               │
│                                                                                        │
│  [PHASE 4 : Camera Forward Glide & Screen Dive (공간 침투)]                            │
│  • As user scrolls or steps forward, the camera glides into the lone light source.     │
│  • The video screen expands to fill 100% of the viewport with minimal editorial pills  │
│    pinned to screen corners (`[ 432Hz CADENZA ↗ ]`, `[ ATELIER SANCTUARY ↗ ]`).        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Implementation Blueprint

### A. Dynamic Coordinate Tracking (Homography Lock)
- Target Coordinates of TV Screen in Stage 01 background: $(x_c, y_c)$ in normalized viewport units.
- Floating Emblem Motion Path:
  $$\vec{P}(t) = (1-t)^3 \vec{P}_{\text{center}} + 3(1-t)^2 t \vec{P}_{\text{control}} + t^3 \vec{P}_{\text{screen}}$$
- Scale Curve: $S(t) = 1.0 \times (1-t) + 0.18 \times t$.
- Opacity / Blend Mode: Transition from `mix-blend-mode: screen` into video texture coordinate.

### B. Minimalist Guide Typography
- Ambient guide cues: `[ 02:00 AM // LONE FREQUENCY DETECTED ]` appearing in micro-mono typography next to the glowing screen.
- Minimal pill button: `[ ENTER LIGHT ↗ ]` with soft Gaussian pulse.
