import { useState, useEffect } from 'react';
import { useColor } from '../context/ColorContext';
import { cmykToRgb, hslToRgb } from '../utils/colorUtils';
import styles from './ColorInputs.module.css';

const ColorInputs = () => {
    const { hex, rgb, hsv, cmyk, hsl, lab, lch, updateFromHex, updateFromRgb, addToHistory, showToast } = useColor();

    // Local state for inputs to allow typing before validation kicks in
    const [hexInput, setHexInput] = useState(hex);
    const [cmykInput, setCmykInput] = useState('');
    const [hslInput, setHslInput] = useState('');
    const [labInput, setLabInput] = useState('');
    const [lchInput, setLchInput] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(() => {
        return localStorage.getItem('colorforge_showAdvanced') === 'true';
    });

    // Sync local state with global state when it changes externally
    useEffect(() => {
        setHexInput(hex);
    }, [hex]);

    // Add to history when color changes (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            addToHistory(hex);
        }, 500); // Debounce 500ms to avoid excessive history entries
        return () => clearTimeout(timer);
    }, [hex, addToHistory]);

    const handleCopy = (text, format) => {
        navigator.clipboard.writeText(text);
        showToast(`Copied ${text}`);
    };

    const handleHexChange = (e) => {
        const val = e.target.value;
        setHexInput(val);

        // Auto-update if valid length (with or without #)
        const clean = val.replace('#', '');
        if (clean.length === 3 || clean.length === 6) {
            updateFromHex(val);
        }
    };

    const handleHexBlur = () => {
        // Reset to real value if invalid
        setHexInput(hex);
    };

    const handleRgbChange = (key, val) => {
        const newRgb = { ...rgb, [key]: parseInt(val) || 0 };
        updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
    };

    // Format strings for copying and display
    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const labString = `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    const lchString = `lch(${lch.l}%, ${lch.c}, ${lch.h})`;

    // Sync formatted strings to local inputs when color changes
    useEffect(() => {
        setCmykInput(cmykString);
        setHslInput(hslString);
        setLabInput(labString);
        setLchInput(lchString);
    }, [cmykString, hslString, labString, lchString]);

    // Parse CMYK string: "cmyk(50%, 25%, 0%, 10%)" -> {c, m, y, k}
    const parseCmyk = (str) => {
        const match = str.match(/cmyk\s*\(\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
        if (match) {
            return {
                c: parseInt(match[1]),
                m: parseInt(match[2]),
                y: parseInt(match[3]),
                k: parseInt(match[4])
            };
        }
        return null;
    };

    // Parse HSL string: "hsl(180, 50%, 50%)" -> {h, s, l}
    const parseHsl = (str) => {
        const match = str.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
        if (match) {
            return {
                h: parseInt(match[1]),
                s: parseInt(match[2]),
                l: parseInt(match[3])
            };
        }
        return null;
    };

    const handleCmykChange = (e) => {
        const val = e.target.value;
        setCmykInput(val);
        const parsed = parseCmyk(val);
        if (parsed) {
            const newRgb = cmykToRgb(parsed);
            updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
        }
    };

    const handleCmykBlur = () => {
        // Reset to real value if invalid
        setCmykInput(cmykString);
    };

    const handleHslChange = (e) => {
        const val = e.target.value;
        setHslInput(val);
        const parsed = parseHsl(val);
        if (parsed) {
            const newRgb = hslToRgb(parsed);
            updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
        }
    };

    const handleHslBlur = () => {
        // Reset to real value if invalid
        setHslInput(hslString);
    };


    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Color Values</h3>

            {/* HEX Input */}
            <div className={styles.row}>
                <div className={styles.group}>
                    <label className={styles.label}>HEX</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.hash}>#</span>
                        <input
                            type="text"
                            value={hexInput.replace('#', '')}
                            onChange={handleHexChange}
                            onBlur={handleHexBlur}
                            className={styles.inputHex}
                            maxLength={6}
                        />
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    className={styles.copyBtn}
                    onClick={() => handleCopy(hex, 'hex')}
                    title="Copy HEX"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                </button>
            </div>

            {/* RGB Inputs */}
            <div className={styles.row}>
                <div className={styles.group}>
                    <label className={styles.label}>RGB</label>
                    <div className={styles.multiInput}>
                        <input
                            type="number"
                            value={rgb.r}
                            onChange={(e) => handleRgbChange('r', e.target.value)}
                            className={styles.inputNum}
                            min="0"
                            max="255"
                        />
                        <input
                            type="number"
                            value={rgb.g}
                            onChange={(e) => handleRgbChange('g', e.target.value)}
                            className={styles.inputNum}
                            min="0"
                            max="255"
                        />
                        <input
                            type="number"
                            value={rgb.b}
                            onChange={(e) => handleRgbChange('b', e.target.value)}
                            className={styles.inputNum}
                            min="0"
                            max="255"
                        />
                    </div>
                </div>
                <button
                    className={styles.copyBtn}
                    onClick={() => handleCopy(rgbString, 'rgb')}
                    title={`Copy ${rgbString}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                </button>
            </div>

            {/* Advanced Toggle */}
            <button
                className={styles.advancedToggle}
                onClick={() => {
                    const newValue = !showAdvanced;
                    setShowAdvanced(newValue);
                    localStorage.setItem('colorforge_showAdvanced', newValue);
                }}
            >
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {/* Advanced Formats (Collapsible) */}
            {showAdvanced && (
                <div className={styles.advancedSection}>
                    {/* CMYK Read-only */}
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>CMYK</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={cmykInput}
                                    onChange={handleCmykChange}
                                    onBlur={handleCmykBlur}
                                    className={styles.inputReadOnly}
                                />
                            </div>
                        </div>
                        <button
                            className={styles.copyBtn}
                            onClick={() => handleCopy(cmykString, 'cmyk')}
                            title={`Copy ${cmykString}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>
                    </div>

                    {/* HSL Read-only */}
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>HSL</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={hslInput}
                                    onChange={handleHslChange}
                                    onBlur={handleHslBlur}
                                    className={styles.inputReadOnly}
                                />
                            </div>
                        </div>
                        <button
                            className={styles.copyBtn}
                            onClick={() => handleCopy(hslString, 'hsl')}
                            title={`Copy ${hslString}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>
                    </div>

                    {/* LAB Read-only */}
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>LAB</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={labInput}
                                    readOnly
                                    className={styles.inputReadOnly}
                                />
                            </div>
                        </div>
                        <button
                            className={styles.copyBtn}
                            onClick={() => handleCopy(labString, 'lab')}
                            title={`Copy ${labString}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>
                    </div>

                    {/* LCH Read-only */}
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>LCH</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={lchInput}
                                    readOnly
                                    className={styles.inputReadOnly}
                                />
                            </div>
                        </div>
                        <button
                            className={styles.copyBtn}
                            onClick={() => handleCopy(lchString, 'lch')}
                            title={`Copy ${lchString}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ColorInputs;
