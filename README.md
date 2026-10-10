# SIGNATURE ROBOTICS EXPERIENCE
> Cinematic, Scroll-Driven Interactive Platform // Autonomous Kinematics Showcase

---

## 🚀 Quick Start & Run Instructions

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Launch Vite development server
npm run dev

# 3. Build for production (TypeScript check + Minified Rollup bundle)
npm run build

# 4. Preview production build
npm run preview
```

The application will run locally at `http://localhost:5173/`.

---

## 🏗️ Architecture Overview

```text
portfolio-dd/
├── index.html                     # Entry HTML, Google Fonts preconnect, Theme metadata
├── package.json                   # React 19, Three.js, GSAP, Lenis, Lucide-react
├── tsconfig.json                  # Strict TypeScript compiler options
├── vite.config.ts                 # Vite bundler with React plugin
├── src/
│   ├── main.tsx                   # React root mount
│   ├── App.tsx                    # Root shell: view router, Lenis provider, UNIT-01 companion
│   ├── styles/
│   │   └── index.css              # Design tokens, CSS variables, blueprint grid, HUD styling
│   ├── utils/
│   │   ├── audio.ts               # Procedural Web Audio API sound synthesizer
│   │   ├── lenis.ts               # Lenis smooth scroll wired to GSAP ScrollTrigger ticker
│   │   ├── splitText.tsx          # Split-text reveal utility with GSAP stagger
│   │   ├── magnetic.tsx           # Magnetic button spring utility
│   │   └── cursor.tsx             # Cyber reticle custom cursor (native cursor preserved)
│   ├── companion/                 # STAGE 2: UNIT-01 Background Companion Robot
│   │   ├── unit01.types.ts        # Poses, coordinates, and public API interfaces
│   │   ├── ikSolver.ts            # Analytic 3-joint Inverse Kinematics solver + spring physics
│   │   ├── CompanionContext.tsx   # React context & hook: targeting, clicks, keyboard, persistence
│   │   └── RobotScene.tsx         # Fixed Three.js WebGL layer + lightweight 2D SVG fallback
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx         # Unified navigation, Audio toggle, UNIT-01 HUD
│   │   │   ├── Loader.tsx         # Fast non-blocking system diagnostic loader (<1s)
│   │   │   ├── SectionHeader.tsx  # Blueprint section title header with split-text
│   │   │   └── DemoBadge.tsx      # Public verified citation vs demo data badge
│   │   ├── sections/              # 12 RICH SCROLL-DRIVEN SECTIONS
│   │   │   ├── 01_Hero/           # Cinematic Hero ("Engineering Beyond Limits")
│   │   │   ├── 02_Vision/         # The Future of Robotics (verified pillars & citations)
│   │   │   ├── 03_Atlas/          # Atlas Experience (3D inspector & hotspots)
│   │   │   ├── 04_Spot/           # Spot in Action (quadruped inspection & payloads)
│   │   │   ├── 05_Stretch/        # Industrial Automation (box-handling scrub sequence)
│   │   │   ├── 06_MissionControl/ # Mission Control Center (fleet map, statuses, logs)
│   │   │   ├── 07_ConnectedRobotics/ # Connected Robotics (interactive node network)
│   │   │   ├── 08_Performance/    # Performance & Insights (time-series analytics)
│   │   │   ├── 09_Timeline/       # Evolution Timeline (milestones 2005-2024)
│   │   │   ├── 10_Stories/        # Real-World Stories (enterprise case studies)
│   │   │   ├── 11_InnovationLab/  # Innovation Lab (Path Planning & LiDAR sandbox)
│   │   │   └── 12_Footer/         # Command Center CTA, booking modal, sitemap
│   │   └── products/              # DEDICATED PRODUCT DEEP DIVE PAGES
│   │       ├── AtlasPage.tsx      # Humanoid specs & dynamic balance test simulator
│   │       ├── SpotPage.tsx       # Quadruped gait modes & thermal camera simulator
│   │       ├── StretchPage.tsx    # Logistics specs & 4-phase work cycle flow
│   │       └── OrbitPage.tsx      # Fleet manager console & dispatch simulation
```

---

## 🎨 Design Tokens

- **Background Graphite**: `#0B0F14`
- **Sections Deep Navy**: `#121B26`
- **Accent Glow Electric Cyan**: `#00D5FF`
- **Text / Headings Snow White**: `#E9F1F8`
- **Secondary Lines Metallic Grey**: `#8E9AA8`
- **Status Green Emerald**: `#00E699`
- **Alert Amber**: `#FFB300` / Crimson `#FF3B5C`
- **Typography**: Orbitron (Display), Rajdhani (Technical), Space Grotesk (Body), JetBrains Mono (Telemetry)

---

## 🤖 UNIT-01 Public API

```typescript
import { useCompanionRobot } from './companion/CompanionContext';

const {
  enabled,             // boolean: whether companion robot is rendered
  currentPose,         // 'idle' | 'scanning' | 'lifting' | 'console-typing' | 'alert'
  target,              // TargetCoordinates | null (screen X/Y, width, height)
  isPressing,          // boolean: active press mirroring
  setPose,             // (pose: CompanionPose) => void
  setTarget,           // (elOrCoords: HTMLElement | TargetCoordinates | null) => void
  enable,              // () => void
  disable,             // () => void
  toggleEnabled,       // () => void
  toggleLowPowerMode,  // () => void (toggles between 3D WebGL and 2D SVG)
  lowPowerMode         // boolean
} = useCompanionRobot();
```

---

## 🧪 Testing & Verification Checklist

- [x] **Smoke Test**: Page boots with fast diagnostic loader in <1s and reveals Hero with no layout shift.
- [x] **Split Text Reveal**: Headline "Engineering Beyond Limits" animates smoothly with GSAP.
- [x] **UNIT-01 Companion**:
  - Arm smoothly follows mouse over buttons and interactive cards via analytic IK.
  - Keyboard `Tab` navigation triggers automatic servo aim on focused elements.
  - Pressing `Enter` / clicking triggers end-effector press forward with cyan pulse ring.
  - Scroll velocity tilts robot base using damped harmonic spring.
  - Pose directory buttons switch between `IDLE`, `RADAR SCAN`, `PAYLOAD LIFT`, etc.
  - LocalStorage toggle remembers ON/OFF and last pose across page reloads.
  - Low-Power toggle switches between Three.js WebGL and lightweight 2D SVG mode.
- [x] **Product Deep Dives**: Navigating to `Atlas`, `Spot`, `Stretch`, `Orbit` via header or CTAs switches views with browser URL hash sync (`#atlas`, `#spot`, etc.), Back/Forward button support, and instant return to Home.
- [x] **Audio Synthesizer**: Procedural Web Audio API sound effects play for hover, click, servo, and laser lock with global mute button.
- [x] **Performance & Accessibility**: Semantic HTML, AA contrast compliance, visible `:focus-visible` cyber outlines, and `prefers-reduced-motion` support.
