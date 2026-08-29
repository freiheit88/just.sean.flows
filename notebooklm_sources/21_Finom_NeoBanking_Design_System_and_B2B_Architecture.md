# 21. Finom Neo-Banking Design System & European B2B Fintech Architecture

> **Document Version**: v1.0-FINOM  
> **Target**: Sean Brain Gehirn Knowledge Base (`just.sean.flows`)  
> **Core References**: `https://finom.co/`, `lgchem-it-provisioning/index.html`, Conversation `e708ed06-2707-40f0-a494-80e1a7dde259` & `db89469a-a42d-487b-8282-29ca75d75abf`

---

## 1. Executive Summary & Design Philosophy

**Finom (`https://finom.co/`)** is an Amsterdam/European all-in-one financial operating system for SMEs and freelancers. In Sean's ecosystem, Finom serves as the benchmark for **High-End European B2B Fintech UI/UX**, characterized by:
1. **Ultra-Clean Architectural Restraint**: Zero unnecessary decoration; maximum clarity and typographic hierarchy.
2. **Subtle Tactile Micro-Shadows**: Soft multi-layered ambient drop shadows that give flat cards tactile depth.
3. **Physical Layer Physics (3D Sheet / Crate Stacking)**: Realistic spatial layering with spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`).
4. **Seamless State Transitions**: Modals and sheets that expand and settle with fluid momentum rather than abrupt snaps.

---

## 2. Finom Core Design Tokens (Tailwind & CSS)

```javascript
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace']
      },
      colors: {
        finom: {
          bg: '#f4f6f8',        // Clean Scandinavian/Dutch soft neutral canvas
          card: '#ffffff',      // Pure white tactile surface
          border: '#e5e7eb',    // Ultra-light 1px hairline border
          charcoal: '#0d0e12',  // Deep jet obsidian for primary actions & typography
          subtle: '#6b7280'     // Micro-editorial caption zinc
        }
      },
      boxShadow: {
        'finom-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'finom-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'finom-active': '0 12px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'modal': '0 30px 70px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.6)'
      }
    }
  }
}
```

---

## 3. Physical Layering & 3D Sheet Deck Physics

In `lgchem-it-provisioning`, Finom's physical folder/card interaction was implemented via CSS 3D Transforms:

```css
:root {
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.folder-stage {
  perspective: 2000px;
  perspective-origin: 50% 10%;
}

.sheet-card {
  transition: transform 0.45s var(--ease-spring), opacity 0.45s var(--ease-spring), box-shadow 0.45s var(--ease-spring);
  transform-origin: center top;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* Layer 1: Active Front Surface */
.sheet-front {
  transform: translateY(0px) scale(1) translateZ(0px);
  opacity: 1;
  z-index: 30;
}

/* Layer 2: Middle Physical Layer */
.sheet-middle {
  transform: translateY(-16px) scale(0.985) translateZ(-40px);
  opacity: 0.70;
  z-index: 20;
}

/* Layer 3: Rear Physical Layer */
.sheet-back {
  transform: translateY(-32px) scale(0.97) translateZ(-80px);
  opacity: 0.40;
  z-index: 10;
}
```

---

## 4. Integration into Sean Brain Gehirn

### Application Areas across Projects:
1. **B2B Enterprise Dashboards & Client Portals**:
   - Clean data density, monospaced asset tags, and responsive sidebar navigation.
2. **Fintech / Vault Locking Systems**:
   - Jet-black obsidian security keypad (`1020` VIP unlock) with amber micro-haptics.
3. **Atelier Booking & Invoice Modals**:
   - Single-board high-contrast invoice workflows and zero-clutter CSV/JSON export tools.
