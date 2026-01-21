import { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
    hsvToRgb,
    rgbToHex,
    rgbToHsv,
    hexToRgb,
    rgbToCmyk,
    rgbToHsl,
    rgbToLab,
    rgbToLch
} from '../utils/colorUtils';
import Toast from '../components/Toast';

const ColorContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useColor = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
    // HSV is our source of truth because it maps directly to the wheel UI
    // h: 0-360, s: 0-100, v: 0-100
    const [hsv, setHsv] = useState({ h: 220, s: 70, v: 100 });
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('colorforge_history');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse history", e);
                return [];
            }
        }
        return [];
    });

    // Undo/Redo stacks
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const isUndoRedo = useRef(false);

    // Sync history to localStorage
    useEffect(() => {
        localStorage.setItem('colorforge_history', JSON.stringify(history));
    }, [history]);

    // Global Toast State
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
    };

    // update History with debounce logic could be added later
    const addToHistory = useCallback((hex) => {
        setHistory(prev => {
            if (prev.includes(hex)) return prev;
            const newHistory = [hex, ...prev];
            return newHistory.slice(0, 10);
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    // Add current state to undo stack when color changes
    useEffect(() => {
        if (!isUndoRedo.current) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUndoStack(prev => {
                const newStack = [...prev, hsv];
                return newStack.slice(-50); // Keep last 50 states
            });
            setRedoStack([]); // Clear redo when new change is made
        }
        isUndoRedo.current = false;
    }, [hsv]);

    const undo = useCallback(() => {
        if (undoStack.length > 1) {
            const currentState = undoStack[undoStack.length - 1];
            const previousState = undoStack[undoStack.length - 2];

            setRedoStack(prev => [...prev, currentState]);
            setUndoStack(prev => prev.slice(0, -1));
            isUndoRedo.current = true;
            setHsv(previousState);
        }
    }, [undoStack]);

    const redo = useCallback(() => {
        if (redoStack.length > 0) {
            const nextState = redoStack[redoStack.length - 1];

            setUndoStack(prev => [...prev, nextState]);
            setRedoStack(prev => prev.slice(0, -1));
            isUndoRedo.current = true;
            setHsv(nextState);
        }
    }, [redoStack]);

    // Derived values
    const rgb = useMemo(() => hsvToRgb(hsv), [hsv]);
    const hex = useMemo(() => rgbToHex(rgb), [rgb]);
    const cmyk = useMemo(() => rgbToCmyk(rgb), [rgb]);
    const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
    const lab = useMemo(() => rgbToLab(rgb), [rgb]);
    const lch = useMemo(() => rgbToLch(rgb), [rgb]);

    // Actions
    const updateHsv = useCallback((newHsv) => {
        setHsv(prev => ({ ...prev, ...newHsv }));
    }, []);

    const updateFromHex = useCallback((hexString) => {
        const newRgb = hexToRgb(hexString);
        if (newRgb) {
            setHsv(rgbToHsv(newRgb));
        }
    }, []);

    const updateFromRgb = useCallback((r, g, b) => {
        setHsv(rgbToHsv({ r, g, b }));
    }, []);

    // Global Context Value
    const value = {
        hsv,
        rgb,
        hex,
        cmyk,
        hsl,
        lab,
        lch,
        history,
        updateFromHex,
        updateFromRgb,
        updateHsv,
        addToHistory,
        clearHistory,
        undo,
        redo,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        showToast
    };

    return (
        <ColorContext.Provider value={value}>
            {children}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </ColorContext.Provider>
    );
};
