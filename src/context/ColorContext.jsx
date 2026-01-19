import { createContext, useContext, useState, useMemo, useEffect } from 'react';
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

export const useColor = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
    // HSV is our source of truth because it maps directly to the wheel UI
    // h: 0-360, s: 0-100, v: 0-100
    const [hsv, setHsv] = useState({ h: 220, s: 70, v: 100 });
    const [history, setHistory] = useState([]);

    // Undo/Redo stacks
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isUndoRedo, setIsUndoRedo] = useState(false);

    // Global Toast State
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
    };

    // update History with debounce logic could be added later
    const addToHistory = (hex) => {
        setHistory(prev => {
            if (prev.includes(hex)) return prev;
            const newHistory = [hex, ...prev];
            return newHistory.slice(0, 10);
        });
    };

    // Add current state to undo stack when color changes
    useEffect(() => {
        if (!isUndoRedo) {
            setUndoStack(prev => {
                const newStack = [...prev, hsv];
                return newStack.slice(-50); // Keep last 50 states
            });
            setRedoStack([]); // Clear redo when new change is made
        }
        setIsUndoRedo(false);
    }, [hsv.h, hsv.s, hsv.v]);

    const undo = () => {
        if (undoStack.length > 1) {
            const currentState = undoStack[undoStack.length - 1];
            const previousState = undoStack[undoStack.length - 2];

            setRedoStack(prev => [...prev, currentState]);
            setUndoStack(prev => prev.slice(0, -1));
            setIsUndoRedo(true);
            setHsv(previousState);
        }
    };

    const redo = () => {
        if (redoStack.length > 0) {
            const nextState = redoStack[redoStack.length - 1];

            setUndoStack(prev => [...prev, nextState]);
            setRedoStack(prev => prev.slice(0, -1));
            setIsUndoRedo(true);
            setHsv(nextState);
        }
    };

    // Derived values
    const rgb = useMemo(() => hsvToRgb(hsv), [hsv]);
    const hex = useMemo(() => rgbToHex(rgb), [rgb]);
    const cmyk = useMemo(() => rgbToCmyk(rgb), [rgb]);
    const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
    const lab = useMemo(() => rgbToLab(rgb), [rgb]);
    const lch = useMemo(() => rgbToLch(rgb), [rgb]);

    // Actions
    const updateHsv = (newHsv) => {
        setHsv(prev => ({ ...prev, ...newHsv }));
    };

    const updateFromHex = (hexString) => {
        const newRgb = hexToRgb(hexString);
        if (newRgb) {
            setHsv(rgbToHsv(newRgb));
        }
    };

    const updateFromRgb = (r, g, b) => {
        setHsv(rgbToHsv({ r, g, b }));
    };

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
