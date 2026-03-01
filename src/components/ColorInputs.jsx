import { useState, useEffect } from 'react';
import { useColor } from '../context/ColorContext';
import { cmykToRgb, hslToRgb, labToRgb, lchToRgb } from '../utils/colorUtils';
import styles from './ColorInputs.module.css';

// ─── Copy icon ────────────────────────────────────────────────────────────────
const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

// ─── Parsers for each format ──────────────────────────────────────────────────
const parseRgb = (str) => {
    const m = str.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
    return null;
};

const parseHsl = (str) => {
    const m = str.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/i);
    if (m) return { h: parseFloat(m[1]), s: parseFloat(m[2]), l: parseFloat(m[3]) };
    return null;
};

const parseCmyk = (str) => {
    const m = str.match(/cmyk\s*\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/i);
    if (m) return { c: parseFloat(m[1]), m: parseFloat(m[2]), y: parseFloat(m[3]), k: parseFloat(m[4]) };
    return null;
};

const parseLab = (str) => {
    const m = str.match(/lab\s*\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/i);
    if (m) return { l: parseFloat(m[1]), a: parseFloat(m[2]), b: parseFloat(m[3]) };
    return null;
};

const parseLch = (str) => {
    const m = str.match(/lch\s*\(\s*([\d.]+)%?\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (m) return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
    return null;
};

// ─── A single-line text field that shows a formatted value, allows paste/edit,
//     and commits only on blur or Enter ─────────────────────────────────────────
const FormatField = ({ label, displayValue, onCommit, placeholder }) => {
    const [local, setLocal] = useState(displayValue);
    const [focused, setFocused] = useState(false);
    const [error, setError] = useState(false);

    // Sync display value when external color changes (but not while the user is typing)
    useEffect(() => {
        if (!focused) {
            setLocal(displayValue);
            setError(false);
        }
    }, [displayValue, focused]);

    const commit = () => {
        const ok = onCommit(local);
        if (!ok) {
            setError(true);
            // Revert to canonical value after a short visual error flash
            setTimeout(() => {
                setLocal(displayValue);
                setError(false);
            }, 800);
        } else {
            setError(false);
        }
        setFocused(false);
    };

    return (
        <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''}`}>
            <input
                type="text"
                aria-label={label}
                value={local}
                placeholder={placeholder}
                className={styles.inputText}
                spellCheck={false}
                onFocus={() => setFocused(true)}
                onChange={(e) => { setLocal(e.target.value); setError(false); }}
                onBlur={commit}
                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
            />
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ColorInputs = () => {
    const { hex, rgb, cmyk, hsl, lab, lch, updateFromHex, updateFromRgb, addToHistory, showToast } = useColor();

    // Add to history on change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => addToHistory(hex), 500);
        return () => clearTimeout(timer);
    }, [hex, addToHistory]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showToast(`Copied ${text}`);
    };

    // ── Formatted display strings ─────────────────────────────────────────────
    const hexString = hex;
    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const labString = `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    const lchString = `lch(${Math.round(lch.l)}, ${Math.round(lch.c)}, ${Math.round(lch.h)})`;

    // ── Commit handlers — return true if parse succeeded ─────────────────────
    const commitHex = (val) => {
        const clean = val.replace('#', '').trim();
        if (clean.length === 3 || clean.length === 6) {
            updateFromHex('#' + clean);
            return true;
        }
        return false;
    };

    const commitRgb = (val) => {
        const p = parseRgb(val);
        if (p) { updateFromRgb(p.r, p.g, p.b); return true; }
        return false;
    };

    const commitHsl = (val) => {
        const p = parseHsl(val);
        if (p) { const r = hslToRgb(p); updateFromRgb(r.r, r.g, r.b); return true; }
        return false;
    };

    const commitCmyk = (val) => {
        const p = parseCmyk(val);
        if (p) { const r = cmykToRgb(p); updateFromRgb(r.r, r.g, r.b); return true; }
        return false;
    };

    const commitLab = (val) => {
        const p = parseLab(val);
        if (p) { const r = labToRgb(p); updateFromRgb(r.r, r.g, r.b); return true; }
        return false;
    };

    const commitLch = (val) => {
        const p = parseLch(val);
        if (p) { const r = lchToRgb(p); updateFromRgb(r.r, r.g, r.b); return true; }
        return false;
    };

    // ── Collapse / expand advanced ────────────────────────────────────────────
    const [showAdvanced, setShowAdvanced] = useState(
        () => localStorage.getItem('colorforge_showAdvanced') === 'true'
    );

    const Row = ({ label, displayValue, onCommit, copyText, placeholder }) => (
        <div className={styles.row}>
            <div className={styles.group}>
                <label className={styles.label}>{label}</label>
                <FormatField
                    label={label}
                    displayValue={displayValue}
                    onCommit={onCommit}
                    placeholder={placeholder}
                />
            </div>
            <button className={styles.copyBtn} onClick={() => handleCopy(copyText ?? displayValue)} title={`Copy ${label}`}>
                <CopyIcon />
            </button>
        </div>
    );

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Color Values</h3>

            <Row label="HEX" displayValue={hexString} onCommit={commitHex} placeholder="#rrggbb" />
            <Row label="RGB" displayValue={rgbString} onCommit={commitRgb} placeholder="rgb(255, 128, 0)" />

            {/* Advanced Toggle */}
            <button
                className={styles.advancedToggle}
                onClick={() => {
                    const next = !showAdvanced;
                    setShowAdvanced(next);
                    localStorage.setItem('colorforge_showAdvanced', next);
                }}
            >
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {showAdvanced && (
                <div className={styles.advancedSection}>
                    <Row label="HSL" displayValue={hslString} onCommit={commitHsl} placeholder="hsl(219, 100%, 65%)" />
                    <Row label="CMYK" displayValue={cmykString} onCommit={commitCmyk} placeholder="cmyk(50%, 25%, 0%, 10%)" />
                    <Row label="LAB" displayValue={labString} onCommit={commitLab} placeholder="lab(50, 25, -30)" />
                    <Row label="LCH" displayValue={lchString} onCommit={commitLch} placeholder="lch(50, 40, 220)" />
                </div>
            )}
        </div>
    );
};

export default ColorInputs;
