# ColorForge

ColorForge is a high-end color system design tool built for UI designers and game developers. It provides a sophisticated interface for exploring color harmonies, checking accessibility, and managing color workflows.

## Key Features

- **Interactive Color Wheel**: A premium, "floating" color wheel with support for HSV and LCH color spaces.
- **Harmony Palette**: Generate and explore color schemes based on LCH for perceptually uniform results.
- **Palette Lock**: Lock your generated colors to browse without the palette regenerating.
- **WCAG Contrast Checker**: Built-in accessibility checks against white and black text with AA/AAA ratings.
- **Image Color Picker**: Upload images and pick colors directly using the native EyeDropper API where supported.
- **Persistent History**: Your recently used colors are saved automatically using `localStorage`.
- **Keyboard Shortcuts**: Power-user support for Undo (Ctrl+Z) and Redo (Ctrl+Y).

## Tech Stack

- **Frontend**: React 19, Vite
- **Desktop**: Electron (Native app support)
- **Styling**: Vanilla CSS with CSS Modules
- **Color Logic**: Custom-built LCH/LAB conversion utilities

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
To run the app in development mode:
```bash
npm run dev
```

### Build
To build the standalone executable for Windows:
```bash
npm run make-exe
```

## Optimization & Credits
Developed by **AZSoftStudio**. Focused on performance, accessibility, and high-end design aesthetics.
