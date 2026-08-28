# [JUST SEAN FLOWS] 02. Full Codebase Architecture, 3D WebGL & Physics Engine

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
