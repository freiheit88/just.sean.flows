# 23. Reinforcement Learning Tuning Parameters & Spatial Synthesis (Gehirn RL)

> **Document Version**: v1.0-RL-ALIGNMENT  
> **Source**: Sean Direct Reinforcement Learning Feedback (2026-08-29 11:06 CET)  
> **Target**: Sean Brain Gehirn Knowledge Base (`just.sean.flows`)  
> **Status**: APPROVED & LOCKED INTO NEURAL ENGINE

---

## 1. Executive Synthesis of Learned Parameters

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🧠 GEHIRN REINFORCEMENT LEARNING TUNED WEIGHTS                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  1. 🧲 [하이브리드 관성 피직스 (Dual-Stage Inertia Engine)] :                          │
│     • 초기 드래그/스크롤 : `lerp: 0.05` (롤스로이스 문짝처럼 묵직하고 쫀득한 럭셔리 감속)│
│     • 스냅 & 핫스팟 도킹  : `lerp: 0.12` (애플/피놈처럼 군더더기 없이 0.2초 만에 스냅)  │
│                                                                                        │
│  2. 🚶 [1인칭 시점 전진 글라이드 (First-Person Gliding)] :                             │
│     • 카메라 왜곡(Vertigo) 대신 **사람 눈높이(Eye-Level Y-Lock)를 엄격히 유지**.        │
│     • 어두운 02:00 AM 살롱 복도를 터벅터벅 걸어 들어가듯 깊이감(Z축)만 자연스럽게 이동.  │
│                                                                                        │
│  3. 📻 [연속적인 아날로그 햅틱 (Continuous Tactile Soundscape)] :                      │
│     • 스크롤/드래그 속도에 비례하여 미세한 **LP 바이닐 바늘 크랙클 + CRT 브라운관 험**   │
│       앰비언트가 초저음량(-24dB)으로 인터랙티브하게 발생.                              │
│                                                                                        │
│  4. 🏛️ [최종 스크린 도달 = 뮤지엄 허브 (Museum Hub Direct Landing)] :                  │
│     • TV 스크린 속으로 100% 빨려 들어간 직후, 복잡한 군더더기 없이                      │
│       **[Just Sean Flows 아틀리에 / 뮤지엄 허브]**로 매끄럽게 연결 및 해금!             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mathematical & Component-Level Tuning Specifications

### A. Dual-Stage Inertia (Lenis + Framer Motion)
$$\text{Current Position } P(t) = P(t-1) + \text{lerp} \times (\text{Target } - P(t-1))$$
- Free Space Exploration: $\text{lerp} = 0.050$, $\text{damping} = 28.0$.
- Hotspot Lock & Docking: $\text{lerp} = 0.120$, $\text{stiffness} = 380$.

### B. 1st-Person Camera Rig (Three.js / CSS 3D)
- Camera Position: $(0, 0, Z_{\text{scroll}})$.
- Pitch ($\theta_x$) & Yaw ($\theta_y$): Damped gyro parallax ($\pm 3^\circ$).
- Field of View ($\text{FOV}$): Fixed at $45^\circ$ for authentic cinematic eye-level realism.

### C. Continuous Tactile Audio Synthesis (Web Audio API)
- Vinyl Crackle Grain: Procedural Pink Noise + Poisson burst trigger tied to $\Delta \text{Scroll}$.
- CRT 50Hz/60Hz Hum: Band-passed sine wave ($50\text{Hz} \sim 120\text{Hz}$) dynamically modulated by camera proximity to screen.

### D. Final Screen Transition Hook
- When Camera $Z \ge Z_{\text{screen\_dive}}$: Trigger instant dissolve to `MuseumHubModal` / Atelier Navigation.
