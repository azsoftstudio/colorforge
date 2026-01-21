import { useState, useEffect, useRef } from 'react';
import { ColorProvider, useColor } from './context/ColorContext';
import ColorWheel from './components/ColorWheel';
import ColorInputs from './components/ColorInputs';
import PaletteDisplay from './components/PaletteDisplay';
import ContrastChecker from './components/ContrastChecker';
import ColorHistory from './components/ColorHistory';
import ImageColorPicker from './components/ImageColorPicker';
import SettingsModal from './components/SettingsModal';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import TitleAnimation from './components/TitleAnimation';
import './App.css';

const RandomButton = () => {
  const { updateHsv } = useColor();

  const randomize = () => {
    updateHsv({
      h: Math.floor(Math.random() * 360),
      s: Math.floor(Math.random() * 50) + 50, // vibrant
      v: Math.floor(Math.random() * 30) + 70  // bright
    });
  };

  return (
    <button className="random-btn" onClick={randomize} title="Random Color">
      Randomize
    </button>
  );
};

const InnerApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('colorforge_sidebarWidth');
    return saved ? parseInt(saved) : 360;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarWidthRef = useRef(sidebarWidth);

  // Sync ref with state
  useEffect(() => {
    sidebarWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  const startResize = (e) => {
    e.preventDefault(); // Prevent text selection start
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      e.preventDefault();

      // Calculate from right edge
      const newWidth = window.innerWidth - e.clientX;

      // Smoother clamping
      if (newWidth < 280) {
        setSidebarWidth(280);
      } else if (newWidth > 800) {
        setSidebarWidth(800);
      } else {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = ''; // Reset cursor
      if (sidebarOpen) {
        localStorage.setItem('colorforge_sidebarWidth', sidebarWidthRef.current);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, sidebarOpen]);

  return (
    <main className="main-content">
      {/* Center Canvas */}
      <div className="canvas-area">
        <div className="flow-label-pick">PICK</div>
        <div className="wheel-container-wrapper">
          <ColorWheel />
        </div>
        <KeyboardShortcuts />
        <RandomButton />
      </div>

      {/* Right Sidebar Inspector */}
      <aside
        className={`inspector-sidebar ${sidebarOpen ? '' : 'collapsed'} ${isResizing ? 'resizing' : ''}`}
        style={{ width: sidebarOpen ? `${sidebarWidth}px` : '60px' }}
      >
        {sidebarOpen && (
          <div className="resize-handle" onMouseDown={startResize} />
        )}

        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? (
              <polyline points="9 18 15 12 9 6"></polyline>
            ) : (
              <polyline points="15 18 9 12 15 6"></polyline>
            )}
          </svg>
        </button>

        <div className="sidebar-content">
          {sidebarOpen && (
            <>
              <div className="flow-section">
                <h3 className="flow-header">ANALYZE</h3>

                <div className="inspector-section">
                  <PaletteDisplay />
                </div>

                <div className="inspector-section">
                  <ContrastChecker />
                </div>
              </div>

              <div className="flow-section">
                <h3 className="flow-header">EXPORT</h3>

                <div className="inspector-section">
                  <ColorInputs />
                </div>
              </div>

              <ColorHistory />
            </>
          )}
        </div>
      </aside>
    </main>
  );
};

function App() {
  const [theme, setTheme] = useState(() => {
    // Read from DOM if available (set by blocking script), otherwise storage
    const stored = localStorage.getItem('colorforge_theme');
    if (stored) return stored;
    // Fallback or read from attribute if script set it default
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('colorforge_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ColorProvider>
      <AppInner theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />
    </ColorProvider>
  )
}

const AppInner = ({ theme, setTheme }) => {
  const { undo, redo, canUndo, canRedo } = useColor();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Keyboard shortcuts for undo/redo
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <TitleAnimation />
        </div>

        <div className="header-actions">
          {/* Undo/Redo buttons */}
          <button
            className="icon-btn"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
            </svg>
          </button>

          <button
            className="icon-btn"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6"></path>
              <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
            </svg>
          </button>

          {/* Image upload button - WITH LABEL */}
          <button
            className="icon-btn image-btn with-label"
            onClick={() => setShowImagePicker(true)}
            title="Pick from image or screen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Image</span>
          </button>

          {/* Settings Button - WITH LABEL (Replaces About & Theme Toggle) */}
          <button
            className="icon-btn with-label"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </header>

      <InnerApp />

      {showImagePicker && (
        <ImageColorPicker onClose={() => setShowImagePicker(false)} />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </div>
  );
};

export default App;
