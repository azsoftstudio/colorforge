<div align="center">

# 🎨 ColorForge

**Explore, harmonize, and export colors with mathematical precision — fully offline and security-hardened.**
The ultimate color system design tool for **UI designers, frontend developers, and game developers**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/azsoftstudio/colorforge) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/) [![Electron](https://img.shields.io/badge/Electron-Desktop-47848f?logo=electron&logoColor=white)](https://www.electronjs.org/) [![Vite](https://img.shields.io/badge/Vite-Built-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

![ColorForge Hero](docs/assets/hero.webp)

---

[Features](#-key-features) • [Security](#-security--privacy) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Full Documentation](https://colorforge.azsoftstudio.workers.dev/documentation)

</div>

## 🌟 Overview

**ColorForge** is a professional-grade color exploration tool that bridges the gap between creative inspiration and technical implementation. Built with a focus on **perceptive uniformity**, ColorForge ensures that your palettes aren't just mathematically aligned in RGB space, but visually balanced for human eyes using our custom **Pro LCH Engine**.

### 🔮 The Forge Alchemy

ColorForge transforms raw inspiration into production-ready color systems through a calibrated three-stage cycle. 

graph LR
    %% Node Definitions
    A["<b>1. PICK</b><br/><i>The Spark</i>"] 
    B["<b>2. ANALYZE</b><br/><i>The Refinement</i>"] 
    C["<b>3. FORGE</b><br/><i>The Export</i>"]
    
    %% Flow
    A --> B --> C
    
    %% Input Details
    subgraph "Sourcing"
    A1[HSV Wheel] -.-> A
    A2[Native EyeDropper] -.-> A
    A3[Image Upload] -.-> A
    end
    
    %% Processing Details
    subgraph "Processing"
    B1[LCH Harmony Engine] -.-> B
    B2[WCAG Contrast Check] -.-> B
    B3[Palette Locking] -.-> B
    end
    
    %% Output Details
    subgraph "Deployment"
    C1[LAB / LCH] -.-> C
    C2[CMYK / RGB] -.-> C
    C3[HEX / CSS] -.-> C
    end

    %% Styles
    style A fill:#6366f1,stroke:#818cf8,stroke-width:2px,color:#fff
    style B fill:#14b8a6,stroke:#2dd4bf,stroke-width:2px,color:#fff
    style C fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#fff
    
    classDef default font-family:Inter,font-size:14px;
```

---

## 🚀 Key Features

### 🎡 Perceptual Exploration
- **Pro LCH Engine**: Generate harmonies (Complementary, Triadic, Tetradic, etc.) using the **LCH** (Lightness, Chroma, Hue) space, ensuring perceptual balance across all shades.
- **Interactive HSV Wheel**: A high-fidelity, real-time interface for rapid color discovery.
- **Palette Locking**: Toggle "Lock" to explore harmony variations while keeping your core base color persistent.

### 📋 Professional Workflow
- **Precision Export**: Copy colors in professional formats including **LAB, LCH, CMYK, HSL, RGB, and HEX**.
- **Local History**: Automatically saves your recently used colors locally, persisting across sessions without any cloud dependency.
- **Undo/Redo Mastery**: Native support for history management via dedicated UI buttons or standard `Ctrl+Z` / `Ctrl+Y` shortcuts.

### ⚖️ Accessibility & Screen Sampling
- **Native EyeDropper**: Sample any pixel from your screen (or uploaded images) using the high-accuracy system API.
- **WCAG Contrast Checker**: Get instant **WCAG 2.1** (AA/AAA) ratings for text readability on both light and dark backgrounds.
- **Contrast Enforcement**: Mathematically shift your palette to automatically meet WCAG standards with a single toggle.

---

## 🛡 Security & Privacy

ColorForge is built on a **Default-Deny** security model. We prioritize your privacy and system integrity by ensuring the application operates in a completely isolated environment.

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

## 🛠 Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | [React 19](https://reactjs.org/) |
| **Runtime** | [Electron](https://www.electronjs.org/) |
| **Bundler** | [Vite](https://vitejs.dev/) |
| **Styling** | Vanilla CSS + CSS Modules |
| **Logic** | Custom LAB/LCH/XYZ Math Utilities |

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
