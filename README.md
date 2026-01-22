<div align="center">

# 🎨 ColorForge

**The ultimate color system design tool for UI designers and game developers.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/azsoftstudio/colorforge)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848f?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Built-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Documentation](https://colorforge.azsoftstudio.workers.dev/documentation)

</div>

## 🌟 Overview

**ColorForge** is a high-end color system design tool built for professionals who demand precision and aesthetics. It provides a sophisticated interface for exploring color harmonies, checking accessibility, and managing complex design workflows with ease.

---

## 🚀 Key Features

### 🎡 Premium Color Exploration
- **Floating Color Wheel**: An interactive, high-fidelity wheel supporting **HSV** and **LCH** color spaces for intuitive selection.
- **Pro LCH Engine**: Perceptually uniform color generation ensures your harmonies are visually balanced and mathematically accurate.

### 📋 Workflow Optimization
- **Palette Lock**: Freeze your inspiration. Lock generated colors to browse alternatives without losing your core base.
- **Persistent History**: Never lose a shade. Your recently used colors are automatically saved locally.
- **Keyboard Mastery**: Full support for power-user shortcuts (Undo `Ctrl+Z` / Redo `Ctrl+Y`).

### ⚖️ Accessibility & Sampling
- **EyeDropper API**: Sample any pixel from your screen directly (on supported systems).
- **Pro Contrast Checker**: Real-time **WCAG 2.1** ratings (AA/AAA) against light and dark backgrounds.
- **Image Palette Extraction**: Upload images to instantly extract their dominant color profiles.

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

## 🛡️ Security Model

ColorForge follows a **Default-Deny** Electron security posture to ensure the highest standard of user safety and data privacy.

| Layer | Status | Rationale |
| :--- | :--- | :--- |
| **Node Integration** | Disabled | Prevents arbitrary filesystem and shell access. |
| **Context Isolation** | Enabled | Maintains a clean separation between UI and internal APIs. |
| **Sandbox** | Enabled | Restricts application access to the operating system level. |
| **Preload Script** | Active | Safely bridges strictly defined IPC commands to the renderer. |
| **CSP** | Strict | Blocks external scripts and unauthorized network requests. |

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- `npm` or `yarn`

### Installation
```bash
# Clone the repository
git clone https://github.com/azsoftstudio/colorforge.git

# Enter the directory
cd colorforge

# Install dependencies
npm install
```

### Development
Launch the development environment:
```bash
npm run dev
```

### Building for Windows
To generate a standalone `.exe` installer:
```bash
npm run make-exe
```

---

<div align="center">

### 📖 [View Detailed Documentation](https://colorforge.azsoftstudio.workers.dev/documentation)

Developed with ❤️ by **AZSoftStudio**

</div>
