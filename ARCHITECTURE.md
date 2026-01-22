# ColorForge – Architecture Overview

**Version:** 0.1.0 (GA)  
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
- **Color Wheel** (HSV/LCH)
- **Palette Controls** (Lock/Unlock)
- **Numeric Inputs** (RGB, HEX, CMYK, HSL, LAB, LCH)
- **Eyedropper** (Native Image/Screen Sampling)

#### State Management
`ColorContext.jsx` serves as the single source of truth:
- Stores canonical color representation (**HSV**) for selection logic.
- Implements a **Triple-Space Convergence**:
    - **HSV**: Drives the primary selection logic and UI state.
    - **HSL**: Utilized as a CSS rendering shortcut for the color square background.
    - **LCH**: Powers the professional harmony engine for perceptually uniform palettes.
- Handles all secondary color-space conversions (HEX ↔ RGB ↔ HSV ↔ LCH, etc.).
- Manages undo/redo stacks (50 states)
- Manages persistent **Color History** (10 items)

#### Reactive Outputs
Components subscribe to state changes:
- `PaletteDisplay` generates **LCH-based harmonies** (Perceptually uniform)
- `ContrastChecker` evaluates real-time WCAG compliance
- `ColorInputs` formats exportable values
- `ColorHistory` persists the last used colors

No component performs independent color calculations outside the context.

## 3. UI Component Model

The UI is divided into conceptual layers within a responsive sidebar layout.

### Layout Details
- **Dynamic Sidebar**: Resizable sidebar with persistent width in `localStorage`.
- **Dark/Light Mode**: Full theme support with a blocking script to prevent flicker.

### Core Components
- **ColorWheel.jsx**  
  High-end "floating" wheel with layered shadows and a theme-aware outer glow.
  
- **PaletteDisplay.jsx**  
  Generates harmonies using LCH color space.
  - **Palette Lock**: Toggles to freeze generation while clicking harmony colors.
  - **WCAG Enforcement**: Optional toggle to ensure generated colors meet the 4.5:1 ratio.

- **ContrastChecker.jsx**  
  Real-time accessibility rating with visual badges (AA/AAA).

- **ColorHistory.jsx**  
  Persistent list of recently selected colors with "Clear All" and "Empty State" support.

- **ImageColorPicker.jsx**  
  Modular interface for sampling colors from uploaded images or the entire screen (via EyeDropper API).

### Documentation Architecture
- **System Browser Integration**: To maintain a secure and performant sandbox, the full documentation is opened in the system's default browser via an IPC bridge (`preload.js`), rather than an in-app iframe.

## 4. Security Model 🛡️

ColorForge follows a Default-Deny Electron security posture.

| Layer             | Status   | Rationale                                         |
| :---              | :---     | :---                                              |
| Node Integration  | Disabled | Prevents filesystem and shell access              |
| Context Isolation | Enabled  | Separates UI from Electron internals              |
| Sandbox           | Enabled  | Restricts OS-level access                         |
| Preload Script    | Active   | Safely bridges IPC commands to the renderer       |
| CSP               | Strict   | Blocks all external scripts and network requests  |

## 5. Performance & Persistence

### State Persistence
User preferences and history are stored in `localStorage` using the `colorforge_` namespace.
- `colorforge_theme`: Current UI theme.
- `colorforge_history`: List of recent hex codes.
- `colorforge_sidebarWidth`: Stored sidebar dimensions.

### UI Polish & Animations
- **Spring-like Motion**: Uses CSS cubic-beziers for smooth UI transitions.
- **Fade/Scale effects**: Applied to History items and tooltips to prevent visual "popping".

## 6. Build & Distribution

### Build Tooling
Vite produces a static React bundle in the `dist/` directory.

### Packaging
`electron-builder` wraps the bundle into a standalone Windows executable.
- Output directory: `Windows Build/`
- Target: NSIS (Windows Setup)
- Icon: Managed via `scripts/generate-icon.js`

### 🛠️ Code Signing Note
Current builds are **unsigned**. Users will encounter the Windows SmartScreen "Unknown Publisher" warning. To eliminate this, an EV Code Signing Certificate would need to be integrated into the `electron-builder` pipeline.
