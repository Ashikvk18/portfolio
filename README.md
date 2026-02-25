<div align="center">

# ⚡ The Wizard's Portfolio

<img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
<img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />

<br />
<br />

*"I solemnly swear that I am up to no good."*

<br />

A cinematic, Harry Potter-themed developer portfolio built with production-level visual effects, custom canvas renderers, and immersive audio — all running in the browser.

<br />

[🔮 **Live Demo**](#) · [📜 **Source Code**](https://github.com/Ashikvk18/portfolio) · [⚡ **Report Bug**](https://github.com/Ashikvk18/portfolio/issues)

</div>

---

<br />

## 🎬 Cinematic Visual Effects

This isn't a typical portfolio. Every pixel is crafted to deliver a **movie-quality dark fantasy experience** — no plugins, no iframes, pure browser rendering.

<br />

### 🌌 Production Canvas Background — `HogwartsBackground.tsx`

A fully custom **HTML5 Canvas renderer** running at 60fps with device pixel ratio scaling:

```
✦ 250+ twinkling stars with cross-spike glow effects
✦ Procedural shooting stars with luminous trails
✦ Volumetric moon with crater detail and atmospheric halo
✦ Aurora borealis — animated curtain streaks across the sky
✦ Dual mountain ranges with depth parallax
✦ 7-tower castle silhouette with battlements, bridges & entrance gate
✦ 70+ flickering windows with warm glow halos
✦ Animated dementors with flowing spectral robes
✦ Dual forest silhouettes at different depths
✦ Floating ember particles rising from the castle
✦ Volumetric ground fog with rolling wisps
✦ Full scroll-driven parallax on every layer
```

All elements use **seeded random generation** for deterministic, reproducible visuals across sessions.

<br />

### 🎞️ Cinematic Overlay Engine — `CinematicOverlay.tsx`

A secondary canvas layer rendering real-time post-processing effects:

```
◈ Film grain noise (regenerated per frame at 1/4 resolution)
◈ Chromatic aberration on mouse proximity
◈ Animated dust/ash particles with physics
◈ Spell streak light beams (randomized golden trails)
◈ Cinematic letterbox bars (top accent + bottom widescreen)
◈ Dynamic vignette darkening at screen edges
◈ Mouse-reactive light pooling effect
```

<br />

### 🎥 Video Background System — `VideoBackground.tsx`

Optional cinematic video loop layer with:

```
▸ Automatic detection of video files in /public/videos/
▸ Crossfade transitions between scenes
▸ Cinematic color grading (CSS filters)
▸ Graceful fallback to canvas when no videos present
```

<br />

### ✨ Particle & Scene Systems

| System | Description |
|--------|-------------|
| `ParticleBackground.tsx` | Floating magical particles with depth-based sizing and drift |
| `WizardScenes.tsx` | Scroll-triggered ambient spell effects and atmospheric transitions |
| `WizardPhoto.tsx` | Circular portrait with radial fade, orbiting particles, enchanted ring borders, and lightning bolt accent |

<br />

---

## 🔊 Immersive Audio System — `SoundManager.tsx`

A dual-layer audio engine combining **HTML5 Audio** for music and **Web Audio API** for real-time sound synthesis:

### 🎵 Background Music
```
♫ MP3 track playback from /public/audio/
♫ Auto-play on first user interaction (respects browser policies)
♫ Global singleton — survives React Strict Mode re-renders
♫ Track cycling for multiple files
♫ 40% volume, looped continuously
```

### 🔮 Synthesized Sound Effects
All SFX are **generated in real-time** using the Web Audio API — no audio files needed:

| Effect | Trigger | Synthesis |
|--------|---------|-----------|
| ✧ Hover chime | Mouse enter on links | Dual-frequency sine oscillators (1200Hz + 1800Hz) |
| ⚡ Click spark | Button clicks | Filtered noise burst with bandpass at 2000Hz |
| 🌟 Spell cast | CTA / form submit | Frequency sweep (200→800Hz) + harmonic overtones |
| 🌊 Transition | Page transitions | Low sine drone (150Hz) + filtered noise wash |

<br />

---

## 🏗️ Architecture

```
portfolio/
├── public/
│   ├── audio/              # Background music tracks (MP3)
│   ├── videos/             # Optional cinematic video loops
│   └── profile.jpg         # Portrait photo
│
├── src/
│   ├── app/
│   │   ├── globals.css     # Custom utilities, gradients, animations
│   │   ├── layout.tsx      # Root layout with fonts
│   │   └── page.tsx        # Main composition layer
│   │
│   └── components/
│       ├── Navbar.tsx           # Responsive nav + mobile drawer
│       ├── Hero.tsx             # Animated landing with TypeAnimation
│       ├── About.tsx            # Bio + WizardPhoto + highlight cards
│       ├── Skills.tsx           # Animated skill bars (4 categories)
│       ├── Projects.tsx         # Project cards with GitHub links
│       ├── Experience.tsx       # Timeline layout
│       ├── Education.tsx        # Education + awards grid
│       ├── Contact.tsx          # Contact form + social links
│       ├── Footer.tsx           # Responsive footer
│       │
│       ├── HogwartsBackground.tsx   # ⭐ Production canvas renderer
│       ├── CinematicOverlay.tsx     # ⭐ Post-processing effects
│       ├── VideoBackground.tsx      # Optional video loop layer
│       ├── ParticleBackground.tsx   # Floating particle system
│       ├── WizardScenes.tsx         # Scroll-triggered effects
│       ├── WizardPhoto.tsx          # Enchanted portrait component
│       │
│       ├── SoundManager.tsx         # 🔊 Audio engine (music + SFX)
│       ├── SoundToggle.tsx          # Mute toggle (unused)
│       └── SectionHeading.tsx       # Reusable animated heading
│
├── tailwind.config.ts      # Custom theme (colors, fonts, animations)
├── next.config.js
├── tsconfig.json
└── package.json
```

<br />

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Ashikvk18/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** — scroll, click, and listen.

### Optional: Add Video Backgrounds

Place `.mp4` / `.mov` files in `public/videos/` named `scene1.mp4`, `scene2.mov`, etc. The system auto-detects and plays them with crossfade transitions.

### Optional: Add Background Music

Place `.mp3` files in `public/audio/` named `track1.mp3`, `track2.mp3`, etc. Music auto-plays on first user interaction.

<br />

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS 3.4 + custom utilities |
| **Animation** | Framer Motion 11 + CSS keyframes |
| **Canvas** | HTML5 Canvas 2D (custom renderers) |
| **Audio** | Web Audio API + HTML5 Audio |
| **Fonts** | Playfair Display (serif) + Inter (sans) + JetBrains Mono |
| **Icons** | Lucide React |
| **Typing Effect** | react-type-animation |

<br />

---

## ✨ Design Philosophy

> *"The wand chooses the wizard, Mr. Potter."*

Every design decision serves the cinematic dark fantasy theme:

- **Color palette**: Deep void blacks (`#050508`), amber golds, mystical purples, cool blues
- **Typography**: Playfair Display serif for headings — classic wizarding aesthetic
- **Glass morphism**: Semi-transparent cards with subtle borders and backdrop blur
- **Micro-interactions**: Sound-reactive hover states, spring-based animations
- **Performance**: Canvas effects run on `requestAnimationFrame` with DPR scaling
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, screen reader friendly
- **Mobile-first**: Fully responsive from 320px to 4K displays

<br />

---

<div align="center">

### ⚡ Mischief Managed ⚡

*Built by [Ashik Dey Rupak](https://github.com/Ashikvk18) — CS Wizard at Truman State University*

<br />

<img src="https://img.shields.io/github/stars/Ashikvk18/portfolio?style=social" alt="Stars" />
<img src="https://img.shields.io/github/forks/Ashikvk18/portfolio?style=social" alt="Forks" />

</div>
