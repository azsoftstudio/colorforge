<div align="center">

# 🎨 ColorForge

**Explore, harmonize, and export colors with mathematical precision — fully offline and security-hardened.**
The ultimate color system design tool for **UI designers, frontend developers, and power users**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/azsoftstudio/colorforge) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/) [![Electron](https://img.shields.io/badge/Electron-Desktop-47848f?logo=electron&logoColor=white)](https://www.electronjs.org/) [![Vite](https://img.shields.io/badge/Vite-Built-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

![ColorForge Hero](docs/assets/hero.webp)

---

[Quick Start](#-quick-start) • [Features](#-main-features) • [Workflows](#-designer-workflows) • [Technical](#-technical-overview) • [Math & Precision](#-math-precision--validation)

</div>

## ⏱️ TL;DR (30 seconds)
1. **Open ColorForge.**
2. **Pick a base color** using the wheel (or image picker).
3. **Use Harmony Palette** to generate matching colors.
4. **Check readability** in Accessibility Rating.
5. **Copy values** from Color Values (HEX/RGB/HSL/CMYK/LAB/LCH).
6. **Reuse colors** from History.

That's the core workflow. ✅

---

## 👥 Who is this for?
- **Designers**: Who want fast visual harmony + accessibility confidence.
- **Developers**: Who need accurate color values and conversion formats.
- **Power Users / Modders**: Who want to understand internals and rebuild/extend the app.

---

## 🛠️ Main Features

### 1) Color Picking
- **Interactive Hue Ring + Saturation/Value square** for precise selection.
- **Optional Image / Eyedropper** picker flow for sampling from external sources.

### 2) Harmony Generation
Generate balanced palettes including:
- **Monochromatic, Complementary, Triadic, Analogous, Split Complementary, Tetradic**.
- **Lock Palette**: Keep your base color stable while exploring variants.
- **Enforce WCAG**: Push harmony choices toward better contrast automatically.

### 3) Accessibility Checker
Real-time contrast previews for white and black text on your selected color.
- **AAA / AA / AA Large / Fail** ratings based on WCAG 2.1.

### 4) Professional Export Formats
Copy directly as: **HEX, RGB, HSL, CMYK, LAB, LCH**.

### 5) Usability Features
- **Undo / Redo** (UI buttons + `Ctrl+Z` / `Ctrl+Y`).
- **Randomize color** for quick inspiration.
- **Persistent color history** stored locally.
- **Theme support** (Dark/Light) and resizable sidebar.

---

## 🏁 Quick Start

### A. Pick Your Color
- Drag around the **Hue Wheel**.
- Drag inside the **SV Square** to tune saturation and brightness.

### B. Build Palette
- Go to the **Harmony Palette** section.
- Switch tabs until it "feels right."
- Click swatches to set them as the active color.

### C. Verify Contrast
- Look at the **Accessibility Rating** cards.
- Prefer **AA** or **AAA** for normal text.

### D. Copy Value
- In **Color Values**, click the copy icon next to your needed format.

---

## 🎨 Designer Workflows

### Workflow 1: Brand Accent Exploration
1. Start with your brand seed color.
2. Open **Triadic** and **Analogous** tabs.
3. **Lock palette** to compare options.
4. Keep one vibrant accent + one support tone.
5. Check contrast before finalizing.

### Workflow 2: UI Theme Building
1. Pick your primary hue.
2. Use **Monochromatic** for depth (cards, hover states, borders).
3. Use **Complementary/Split** for call-to-action accents.
4. Check black/white text grades for each critical background.
5. Export **HEX + HSL** for design/dev handoff.

### Workflow 3: Accessibility-first Palette
1. Enable **Enforce WCAG**.
2. Iterate until major UI surfaces pass **AA** or **AAA**.
3. Validate manually for key text sizes and weights.
4. Export implementation-ready values.

---

## ⌨️ Controls & Shortcuts

| Action | Shortcut |
| :--- | :--- |
| **Undo** | `Ctrl+Z` (or `Cmd+Z`) |
| **Redo** | `Ctrl+Y` (or `Ctrl+Shift+Z`) |

---

## 📝 Color Value Notes

| Format | Best For |
| :--- | :--- |
| **HEX** | Quick dev/design handoff. Usually the default. |
| **RGB** | Canvas, dynamic UI rendering logic. |
| **HSL** | Thematic tuning (same hue, different lightness). |
| **CMYK** | Print-adjacent workflows (approximation). |
| **LAB / LCH** | Perceptual handling for harmony logic and visual balance. |

---

## ⚙️ Technical Overview

### Stack
- **React 19**: Modern UI library.
- **Vite**: Ultra-fast build tool.
- **Electron**: Cross-platform desktop runtime.
- **Vanilla CSS**: Performance-first styling.

### State Model (HSV)
Canonical color state is maintained in **HSV** (Hue, Saturation, Value).
- **Why?** It maps naturally to wheel + SV square interactions, keeping UI logic predictable.
- All other spaces (RGB, HEX, CMYK, HSL, LAB, LCH) are derived values.

### Harmony Engine
- **LCH-based** generation for perceptual consistency.
- Constrains lightness/chroma ranges to avoid unusable extremes.
- Optional **contrast nudging** for dark/light theme context.

### Security Defaults
ColorForge operates with restricted privileges:
- `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`.

---

## ⚖️ Math Precision & Validation

This section outlines the mathematical foundation and precision characteristics of the ColorForge engine.

### Standards Compliance
- **sRGB**: Implements IEC 61966-2-1 with correct linear/gamma transforms.
- **Illuminant**: Uses **D65** as the reference white point.
- **LAB/LCH**: Follows the **CIE 1976 LAB** specification.
- **Contrast**: Implements **WCAG 2.1** Relative Luminance formula exactly.

### Precision & Quantization
1. **Integer LAB Storage**: LAB/LCH components are stored as integers (L: 0–100, a/b: -128 to 127). This introduces a ±0.5 unit error in LAB, which can amplify to ±10 units in RGB for highly saturated colors.
2. **Gamma Correction**: Uses the full sRGB companding curve instead of a simple 2.2 power law to avoid errors in dark tones.

### Validation Results (Passing 56/56)

| Section | Tests | Status | Notes |
| :--- | :--- | :--- | :--- |
| HEX ↔ RGB | 9 | ✅ Pass | Exact mapping, no rounding loss. |
| RGB ↔ HSV | 10 | ✅ Pass | Round-trip Δ ≤ 1. |
| RGB ↔ HSL | 10 | ✅ Pass | Verified against CSS spec. |
| RGB ↔ CMYK | 8 | ✅ Pass | Handles K=100 edge case. |
| RGB → LAB | 5 | ✅ Pass | Matches D65 sRGB references. |
| LAB ↔ RGB | 4 | ✅ Pass | Verified within quantization limits. |
| RGB → LCH | 2 | ✅ Pass | Verified polar mapping. |
| WCAG Contrast| 4 | ✅ Pass | Exact to 4 decimal places. |
| Edge Cases | 4 | ✅ Pass | Invalid HEX returns null; no NaNs. |

---

## 🆘 Common Issues
- **"Eyedropper not available"**: Some environments lack the native EyeDropper API. Use image upload + click sampling fallback.
- **"My pasted format did not update color"**: Input parser expects full format (e.g., `hsl(180, 50%, 50%)`).
- **"Why did harmony swatches change slightly?"**: Engine may apply small variations for natural-looking exploration.
- **"Copied value failed"**: Clipboard permissions can fail in restricted environments; retry in desktop context.

---

## 🛡️ Data, Privacy & Security
- **Local-first**: No account, no cloud, no tracking.
- **Offline**: Core features require zero internet connection.
- **Restricted**: Desktop runtime uses restricted renderer privileges.
---
| Layer | Status | Technical Detail |
| :--- | :--- | :--- |
| **Offline Mode** | 100% | No external network requests; zero tracking or telemetry. |
| **Execution** | Sandboxed | Renderer process is strictly isolated from the operating system. |
| **Node Integration** | Disabled | Prevents arbitrary filesystem or shell access from the UI. |
| **Context Isolation** | Active | Separates renderer logic from internal app APIs via a secure IPC bridge. |
| **CSP** | Strict | Blocks unauthorized scripts and all non-system external assets. |

> [!IMPORTANT]
> **Windows Security Notice**: As ColorForge is an open-source, community-driven tool, Windows may flag the installer as "unsigned." This is expected. The source code is fully transparent and available here for audit. To install, click **More info → Run anyway**.


---

## 💡 Extension Ideas
- Strict deterministic harmony mode (remove randomness).
- Improved parser validation (decimals, stricter HEX).
- Expanded accessibility simulation (text sizes/weights).
- Palette export presets (JSON/Tailwind/CSS variables).

---

## 📖 Glossary
- **HSV**: Hue, Saturation, Value (interaction-friendly).
- **HSL**: Hue, Saturation, Lightness (styling-friendly).
- **LAB / LCH**: Perceptual spaces for visually consistent operations.
- **Contrast Ratio**: Readability metric between text and background.
- **WCAG**: Web Content Accessibility Guidelines.

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS)
- Windows 10/11 (Recommended for native EyeDropper support)

### Setup & Development
```bash
# Clone the repository
git clone https://github.com/azsoftstudio/colorforge.git

# Install dependencies
npm install

# Launch development environment (Vite + Electron)
npm run dev
```

### Production Build
```bash
# Generate a standalone Windows installer (.exe)
npm run make-exe
```

---

## 📖 Additional Resources

Looking for more depth? Master the LCH workflow with our [Official Documentation](https://colorforge.azsoftstudio.workers.dev/documentation):
- Mini-tutorials on accessible palette design.
- Technical deep-dives into LCH Color Theory.
- Developer API references for internal utilities.

---

## ❤️ Contributions & Support

Developed with ❤️ by **AZSoftStudio**.
Licensed under **MIT** — we welcome community contributions and feedback!

- **Website**: [colorforge.azsoftstudio.workers.dev](https://colorforge.azsoftstudio.workers.dev/)
- **Documentation**: [Full Guide](https://colorforge.azsoftstudio.workers.dev/documentation)

<div align="center">

**ColorForge** • Professional Color Engineering

</div>
