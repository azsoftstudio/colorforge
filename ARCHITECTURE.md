# ColorForge – Architecture Overview

**Version:** 0.1.0 (Beta)  
**Audience:** Contributors & maintainers  
**Purpose:** Document the architectural decisions behind ColorForge  
**Stack:** React 19 (UI), Electron (Runtime), Vite (Build)

## 1. Architectural Philosophy

ColorForge is designed as a standalone, privacy-first color engineering tool with:

- **Deterministic behavior**
- **Predictable state transitions**
- **Zero network dependency**
- **Strict renderer isolation**

The architecture prioritizes stability, security, and real-time performance during continuous user interaction (dragging, sampling, palette generation).

## 2. Application Flow

ColorForge follows a unidirectional data flow model.

### Flow Overview

#### Input
User interaction via:
- **Color Wheel**
- **Numeric Inputs**
- **Eyedropper**

#### State Management
`ColorContext.jsx` serves as the single source of truth:
- Stores canonical color representation
- Handles all color-space conversions (HEX ↔ RGB ↔ HSV, etc.)
- Manages undo/redo history

#### Reactive Outputs
Components subscribe to state changes:
- `PaletteDisplay` generates color harmonies
- `ContrastChecker` evaluates WCAG compliance
- `ColorInputs` formats exportable values

No component performs independent color calculations outside the context.

## 3. UI Component Model

The UI is divided into two conceptual regions:

### Sidebar – Control Layer
Primary user input and configuration.

- **ColorWheel.jsx**  
  Main interaction surface for hue, saturation, and value selection.

- **ColorInputs.jsx**  
  Precision input and export interface.
  - Numeric editing
  - Clipboard-ready formats
  - “Advanced Formats” toggle (LAB, LCH)

- **PaletteDisplay.jsx**  
  Generates and displays harmony-based palettes.
  - Interactive swatches update the primary color

- **ContrastChecker.jsx**  
  Real-time WCAG contrast evaluation against light and dark text.

### Utilities

- **colorUtils.js**  
  Pure, stateless utility functions for color math.
  - Performance-critical
  - Memoized where necessary (e.g., LCH conversions)

## 4. Security Model 🛡️

ColorForge follows a Default-Deny Electron security posture.

| Layer             | Status   | Rationale                                         |
| :---              | :---     | :---                                              |
| Node Integration  | Disabled | Prevents filesystem and shell access              |
| Context Isolation | Enabled  | Separates UI from Electron internals              |
| Sandbox           | Enabled  | Restricts OS-level access                         |
| CSP               | Strict   | Blocks all external scripts and network requests  |

The renderer process is fully isolated and cannot exfiltrate data.

## 5. Performance & Persistence

### State Persistence
User preferences stored in `localStorage` using a `colorforge_` namespace.

### Startup Rendering
Anti-FOUC script prevents white flash during dark-mode initialization.

### Runtime Performance
Expensive color-space computations are memoized to maintain smooth interaction during dragging.

## 6. Build & Distribution

### Build Tooling
Vite produces a static React bundle.

### Packaging
`electron-builder` wraps the bundle into a standalone Windows executable.

### Installer
NSIS-based installer with uninstall support.

### Updates
Manual distribution (no auto-update infrastructure yet).
