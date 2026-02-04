# Architecture Documentation

Technical deep-dive into the architecture and implementation of juancamilo.dev

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────┐
│                  User Browser                    │
├─────────────────────────────────────────────────┤
│  React App (SPA)                                │
│  ├── BackgroundContext (Global State)          │
│  ├── Theme Toggle                               │
│  ├── Background Selector                        │
│  └── Background Renderer                        │
│      ├── Particles (tsParticles)               │
│      ├── Fluid (Three.js + GLSL)              │
│      └── Space (Three.js + GLSL)              │
├─────────────────────────────────────────────────┤
│  LocalStorage (Theme Persistence)               │
└─────────────────────────────────────────────────┘
```

---

## 📦 Component Architecture

### Component Hierarchy

```
App
├── BackgroundProvider (Context)
│   └── AppContent
│       ├── BackgroundRenderer
│       │   ├── ParticlesBackground
│       │   ├── FluidBackground
│       │   └── SpaceBackground
│       │
│       ├── Controls
│       │   ├── ThemeToggle (Dark/Light)
│       │   └── BackgroundSelector (Theme switcher)
│       │
│       ├── Content
│       │   ├── Name & Title
│       │   └── SocialLinks
│       │
│       └── useSound (Hook)
```

### Component Responsibilities

#### **BackgroundContext**
- Global state management
- Dark/Light mode state
- Background theme state
- localStorage persistence
- 36 lines

#### **BackgroundRenderer**
- Theme switching logic
- Fade transitions between themes
- Lazy rendering optimization
- 50 lines

#### **BackgroundSelector**
- Circular button UI
- Cycles through themes
- Sound effects integration
- 48 lines

#### **ThemeToggle**
- Dark/Light mode toggle
- Sun/Moon icon animation
- 32 lines

#### **SocialLinks**
- GitHub, LinkedIn, Instagram, Email
- Hover animations
- Icon management
- 62 lines

---

## 🎨 Background Themes Deep Dive

### 1. Particles Theme
**File:** `ParticlesBackground.tsx` (90 lines)

**Technology:** tsParticles library

**Features:**
- Interactive particle system
- Mouse tracking
- Click to spawn particles
- Collision physics
- Link lines between nearby particles

**Configuration:**
```typescript
{
  particles: 80-150 (mobile vs desktop)
  movement: brownian motion
  interactions: collision, attract, link
  fps_limit: 60
}
```

**Performance:** Lightweight, ~5MB bundle

---

### 2. Fluid Theme
**File:** `FluidBackground.tsx` (530 lines)

**Technology:** 
- Three.js for rendering
- Custom GLSL shaders
- @react-three/fiber for React integration

**Features:**
- Metaball-based rendering
- FBM (Fractal Brownian Motion) for internal textures
- Gyroscope integration on mobile
- Mouse heat interaction (reduced radius)
- Click to spawn bubbles
- Viscous physics simulation

**Shader Uniforms:**
```glsl
uniform float uTime;           // Animation time
uniform vec2 uMouse;           // Mouse position
uniform vec2 uGyro;            // Gyroscope tilt
uniform vec3 uBlobColor;       // Primary color (cyan)
uniform vec3 uBlobColorSecondary; // Gradient color (deep blue)
uniform vec2 uClickBlobs[8];   // User-created bubbles
uniform float uClickTimes[8];  // Bubble timestamps
```

**Key Parameters:**
- **Blobs:** 9 main + 8 click-spawned
- **Movement Speed:** 0.18 (55% slower for viscosity)
- **Threshold:** 1.4 (higher = more defined edges)
- **Gradient:** Vertical (top cyan → bottom deep blue)

**Performance:** 
- Mobile: dpr=1, fewer blobs
- Desktop: dpr=1.5, all effects

---

### 3. Space Theme
**File:** `SpaceBackground.tsx` (1,600+ lines)

**Technology:**
- Three.js + @react-three/fiber
- Custom GLSL shaders (multiple)
- Procedural generation
- Physics simulation

**Components:**

#### **Camera**
- Mouse parallax (desktop)
- Gyroscope parallax (mobile)
- Auto-drift when gyroscope inactive
- FOV: 60° (desktop), 65° (mobile)

#### **Nebula Background**
- Fullscreen plane with shader
- 3 octaves of Simplex noise
- FBM for organic clouds
- Color based on dark/light mode

#### **Stars**
- 500 points (desktop), 350 (mobile)
- Twinkling effect
- Sharpness control (mobile vs desktop)
- Gravity attraction to black hole
- Spiral motion when near black hole
- Disappear at black hole center (r < 0.35)

#### **Celestial Body (Sun/Moon)**
- Shader-based rendering
- Craters for moon
- Granulation for sun
- Limb darkening
- Corona effect
- Position: [3.5, 1.8, -6] (desktop)
- Position: [1.5, 3.2, -6] (mobile)

#### **Planets**
- 4 planets (desktop): Mars, Blue, Saturn, Green
- 3 planets (mobile): Mars, Saturn, Blue
- Orbit around sun/moon
- Procedural textures (GLSL)
- Saturn has rings
- Sizes: 0.22 - 0.55
- Orbit radii: 3.5 - 10

**Mars:**
- Color: #cc4422 (red/orange)
- Closest orbit (3.5)
- Speed: 0.1

**Saturn:**
- Color: #aa8866 (tan)
- Has rings
- Orbit: 8
- Speed: 0.04

#### **Focal Stars**
- 6-8 bright stars
- Higher brightness
- Strategic positioning
- Mobile-optimized layout

#### **Black Hole**
- Interactive (press & hold)
- Gravitational lensing shader
- Orange/gold spinning ring (Interstellar style)
- Absolute black center (r=0.4)
- Attracts nearby stars with spiral motion
- Screen-to-world coordinate conversion
- Continuous interaction support
- Duration: Brief (1.2s) on quick click

**Black Hole Shader:**
```glsl
- Distortion effect
- Ring gradient (orange → gold → white)
- Rotation animation
- Intensity pulses
```

#### **Shooting Stars**
- 1-2 meteors
- Random spawn intervals (8-15s)
- Diagonal trajectory
- Trail fade effect

**Performance Optimizations:**
- Geometry LOD (mobile vs desktop)
- Shader complexity reduction on mobile
- DPR limiting (max 2)
- Frustum culling
- Conditional rendering (constellations desktop-only)

---

## 🎯 State Management

### Context API Structure

**BackgroundContext** manages:
```typescript
{
  darkMode: boolean,              // Dark/Light mode
  backgroundTheme: BackgroundTheme, // 'particles' | 'fluid' | 'space'
  setDarkMode: (mode: boolean) => void,
  setBackgroundTheme: (theme: BackgroundTheme) => void,
  toggleDarkMode: () => void
}
```

**Persistence:**
- localStorage keys: `darkMode`, `backgroundTheme`
- Restored on page load
- Default: `particles` theme, `dark` mode

---

## 🔊 Sound System

**Hook:** `useSound.ts`

**Sounds:**
- Click: 500Hz sine wave (50ms)
- Hover: 800Hz sine wave (30ms)

**Implementation:**
- Web Audio API
- OscillatorNode for generation
- GainNode for volume control
- No external audio files
- Lazy initialization

---

## 📱 Mobile Optimizations

### Device Detection
```typescript
useIsMobile: window.innerWidth < 768 || 'ontouchstart' in window
```

### Gyroscope Integration
- **iOS:** Permission prompt required
- **Android:** Automatic access
- **Smoothing:** 8% lerp factor
- **Sensitivity:** ±35° range
- **Applications:**
  - Camera parallax (Space)
  - Blob tilt (Fluid)

### Performance
- Reduced particle counts
- Lower shader quality
- Smaller geometry
- DPR limiting
- Conditional features

---

## 🎨 Styling Architecture

### CSS Structure
```css
:root {
  /* Colors */
  --color-accent: #00aaff;
  --color-accent-glow: #0088cc;
  --transition-speed: 0.3s;
}

.app.dark { /* Dark mode styles */ }
.app.light { /* Light mode styles */ }
```

### Glassmorphism Effects
- backdrop-filter: blur()
- rgba backgrounds
- Subtle borders
- Shadow layers

### Animations
- Theme transitions: 0.5s fade
- Button hovers: 0.3s scale + rotate
- Icon changes: smooth morphing

---

## 🚀 Build & Deployment

### Vite Configuration
```typescript
{
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
}
```

### Bundle Analysis
```
dist/
├── index.html          3.49 KB (1.11 KB gzipped)
├── index.css           6.10 KB (1.74 KB gzipped)
└── index.js         1250.76 KB (350.51 KB gzipped)
```

### GitHub Actions Workflow
1. Trigger: Push to `main`
2. Build: `npm run build`
3. Deploy: `gh-pages` branch
4. Duration: ~45 seconds

---

## 🔍 SEO Implementation

### Meta Tags
- Primary: title, description, keywords
- Open Graph: Facebook/LinkedIn
- Twitter Cards: Large image format
- Canonical URL

### Structured Data
```json
{
  "@type": "Person",
  "name": "Juan Camilo Villarreal Rios",
  "jobTitle": "Solution Engineer",
  "knowsAbout": ["Data Analytics", "Snowflake", "React", "Python"]
}
```

### Files
- `robots.txt`: Search engine rules
- `sitemap.xml`: Site structure (priority 1.0)
- `favicon.svg`: Minimalist "JC" logo

---

## ⚡ Performance Metrics

### Lighthouse Scores (Target)
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Optimizations
- Code splitting
- Lazy loading
- Asset optimization
- Cache headers
- Compression (gzip)

---

## 🧪 Testing Strategy

### Manual Testing
- Theme switching
- Dark/Light mode
- Mobile responsiveness
- Gyroscope (iOS/Android)
- Browser compatibility
- Performance monitoring

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

---

## 📚 Dependencies

### Core
- react: 18.3.1
- react-dom: 18.3.1
- typescript: 5.7.2

### Rendering
- three: 0.172.0
- @react-three/fiber: 8.18.6
- @tsparticles/react: 3.1.0

### UI
- react-icons: 5.4.0

### Build Tools
- vite: 6.4.1
- @vitejs/plugin-react: 4.4.4

---

## 🔮 Future Enhancements

### Potential Features
1. More interactive themes
2. Custom theme builder
3. Animation timeline controls
4. Performance dashboard
5. Analytics integration
6. A/B testing framework
7. Accessibility improvements
8. i18n (multi-language)

---

## 📖 Development Notes

### Code Style
- Functional components only
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

### Best Practices
- Component isolation
- Custom hooks for logic
- Context for global state
- CSS modules for scoping
- Performance monitoring

---

## 🐛 Known Issues

### Current
- None reported

### Limitations
- Large bundle size (~1.2MB)
- Three.js heavy for simple portfolio
- Mobile gyroscope permission UX

### Mitigation
- Code splitting consideration
- Lazy loading themes
- Improved permission flow

---

*Last Updated: February 4, 2026*
