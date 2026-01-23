<div align="center">

# 🎨 ColorForge

**Explore, harmonize, and export colors with precision — fully offline and WCAG-ready.**
The ultimate color system design tool for **UI designers, frontend developers, and game developers**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/azsoftstudio/colorforge)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848f?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Built-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

![ColorForge Hero](docs/assets/hero.webp)

---

[Features](#-key-features) • [Security](#-security--privacy) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started)

</div>

## 🌟 Overview

**ColorForge** is a high-end color system design tool built for professionals who demand precision, aesthetics, and workflow efficiency. From exploring harmonies to checking accessibility and managing palettes, ColorForge provides a **sophisticated, distraction-free interface** for designers and developers alike.

---

## 🚀 Key Features

### 🎡 Premium Color Exploration
- **Hover-Ready Color Wheel**: An intuitive **HSV** (Hue, Saturation, Value) selection interface with real-time feedback and high-fidelity rendering.
- **Pro LCH Engine**: Perceptually uniform color generation via the **LCH** space ensures your harmonies are visually balanced and mathematically superior.
- **Image Palette Extraction**: Upload images to instantly extract dominant colors and build themed palettes.

### 📋 Workflow Optimization
- **Palette Lock**: Freeze your inspiration. Lock generated colors to browse alternatives without losing your core base.
- **Persistent History**: Never lose a shade. Your recently used colors are automatically saved locally and persist across sessions.
- **Keyboard Mastery**: Full support for power-user shortcuts (Undo `Ctrl+Z` / Redo `Ctrl+Y`) with dedicated top-bar buttons for ease of use.

### ⚖️ Accessibility & Sampling
- **EyeDropper Tool**: Sample any pixel from your image directly (Windows native support).
- **Pro Contrast Checker**: Real-time **WCAG 2.1** ratings (AA/AAA) for text readability on both light & dark backgrounds.

---

## 🛡 Security & Privacy

ColorForge follows **Electron’s Default-Deny security model**, ensuring the highest standard of user safety and data privacy. The app is **fully offline**, with **zero tracking**, and all history is stored exclusively on your local machine.

| Layer | Status | Why it Matters |
| :--- | :--- | :--- |
| **Node Integration** | Disabled | Prevents arbitrary filesystem and shell access. |
| **Context Isolation** | Enabled | Keeps the UI logic strictly separated from internal app APIs. |
| **Sandbox** | Enabled | Restricts application access to the operating system level. |
| **Preload Script** | Active | Allows only strictly defined, safe IPC commands to pass through. |
| **CSP**| Strict | Blocks unauthorized scripts and all external network requests. |

> [!IMPORTANT]
> **Windows SmartScreen Note**: Since this is an open-source, unsigned application, Windows may show a warning during installation. This is normal. The **source code is fully available** in this repository for transparency. To proceed, click **More info → Run anyway**.

---

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Core Framework** | [React 19](https://reactjs.org/) |
| **Build Tooling** | [Vite](https://vitejs.dev/) |
| **Desktop Shell** | [Electron](https://www.electronjs.org/) |
| **Styling** | Vanilla CSS + CSS Modules |
| **Logic** | Custom LAB/LCH Math Utilities |

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- `npm` or `yarn`
- Windows 10+ recommended

### Clone & Install
```bash
git clone https://github.com/azsoftstudio/colorforge.git
cd colorforge
npm install
```

### Development
Launch the development environment:
```bash
npm run dev
```

### Build Standalone EXE
```bash
# Generates the localized, fully-offline installer
npm run make-exe
```

> **Note**: Once built, the standalone `.exe` works fully offline — just double-click to launch.

---

## 📖 Documentation & Resources

- **Documentation**: [colorforge.azsoftstudio/docs](https://colorforge.azsoftstudio.workers.dev/documentation)

Detailed guides, tutorials, and architectural references are available to help you master the LCH color workflow.

---

## ❤️ Support & Contributions

Developed with ❤️ by **AZSoftStudio**.
Licensed under **MIT** — contributions and feedback are always welcome!

- **GitHub**: [github.com/azsoftstudio/colorforge](https://github.com/azsoftstudio/colorforge)
- **Website**: [colorforge.azsoftstudio](https://colorforge.azsoftstudio.workers.dev/)

---

<div align="center">

Developed by **AZSoftStudio**

</div>
