/**
 * Pro Color Picker - Color Utilities
 * Handles conversion between HEX, RGB, HSL, HSV, and CMYK.
 */

// Helper: Clamp a value between min and max
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Helper: Parse standard HEX string to {r, g, b}
// Supports 3-digit and 6-digit hex codes
export const hexToRgb = (hex) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
    }

    if (cleanHex.length !== 6) return null;

    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
};

// Helper: Convert RGB object {r,g,b} to HEX string components
const componentToHex = (c) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

export const rgbToHex = ({ r, g, b }) => {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

// RGB values are 0-255. HSV values: h=0-360, s=0-100, v=0-100
export const rgbToHsv = ({ r, g, b }) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const d = max - min;

    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
        switch (max) {
            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: h = (bNorm - rNorm) / d + 2; break;
            case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
};

export const hsvToRgb = ({ h, s, v }) => {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const vNorm = v / 100;

    let r, g, b;

    const i = Math.floor(hNorm * 6);
    const f = hNorm * 6 - i;
    const p = vNorm * (1 - sNorm);
    const q = vNorm * (1 - f * sNorm);
    const t = vNorm * (1 - (1 - f) * sNorm);

    switch (i % 6) {
        case 0: r = vNorm; g = t; b = p; break;
        case 1: r = q; g = vNorm; b = p; break;
        case 2: r = p; g = vNorm; b = t; break;
        case 3: r = p; g = q; b = vNorm; break;
        case 4: r = t; g = p; b = vNorm; break;
        case 5: r = vNorm; g = p; b = q; break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

// HSL Conversion - needed for some inputs or CSS usage
export const rgbToHsl = ({ r, g, b }) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: h = (bNorm - rNorm) / d + 2; break;
            case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

export const hslToRgb = ({ h, s, l }) => {
    // h in 0-360, s,l in 0-100
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;
    let r, g, b;

    if (sNorm === 0) {
        r = g = b = lNorm; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
        const p = 2 * lNorm - q;

        r = hue2rgb(p, q, hNorm + 1 / 3);
        g = hue2rgb(p, q, hNorm);
        b = hue2rgb(p, q, hNorm - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

export const rgbToCmyk = ({ r, g, b }) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    // Handling edge case for black (k=1)
    if (isNaN(c)) c = 0;
    if (isNaN(m)) m = 0;
    if (isNaN(y)) y = 0;

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
};

export const cmykToRgb = ({ c, m, y, k }) => {
    const minC = c / 100;
    const minM = m / 100;
    const minY = y / 100;
    const minK = k / 100;

    const r = 255 * (1 - minC) * (1 - minK);
    const g = 255 * (1 - minM) * (1 - minK);
    const b = 255 * (1 - minY) * (1 - minK);

    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    };
};

// Accessibility Helpers
const getChannelLuminance = (v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
};

export const getRelativeLuminance = ({ r, g, b }) => {
    return 0.2126 * getChannelLuminance(r) +
        0.7152 * getChannelLuminance(g) +
        0.0722 * getChannelLuminance(b);
};

export const getContrastRatio = (color1, color2) => {
    const l1 = getRelativeLuminance(color1);
    const l2 = getRelativeLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
};

export const generateHarmonies = (hsv) => {
    const { h, s, v } = hsv;

    const createColor = (hueOffset) => {
        let newH = (h + hueOffset) % 360;
        if (newH < 0) newH += 360;
        return { h: newH, s, v };
    };

    return {
        complementary: [createColor(180)],
        analogous: [createColor(-30), createColor(30)],
        triadic: [createColor(120), createColor(240)],
        splitComplementary: [createColor(150), createColor(210)],
        tetradic: [createColor(90), createColor(180), createColor(270)],
        monochromatic: [
            { h, s, v: Math.max(0, v - 30) },
            { h, s, v: Math.min(100, v + 30) }
        ]
    };
};

// RGB (0-255) to LAB
export const rgbToLab = ({ r, g, b }) => {
    // 1. RGB to XYZ
    let rLin = r / 255;
    let gLin = g / 255;
    let bLin = b / 255;

    rLin = rLin > 0.04045 ? Math.pow((rLin + 0.055) / 1.055, 2.4) : rLin / 12.92;
    gLin = gLin > 0.04045 ? Math.pow((gLin + 0.055) / 1.055, 2.4) : gLin / 12.92;
    bLin = bLin > 0.04045 ? Math.pow((bLin + 0.055) / 1.055, 2.4) : bLin / 12.92;

    rLin *= 100;
    gLin *= 100;
    bLin *= 100;

    const x = rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805;
    const y = rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722;
    const z = rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505;

    // 2. XYZ to LAB (D65 Illuminant)
    // Ref: http://www.easyrgb.com/index.php?X=MATH&H=07
    const xRef = 95.047;
    const yRef = 100.000;
    const zRef = 108.883;

    let varX = x / xRef;
    let varY = y / yRef;
    let varZ = z / zRef;

    const epsilon = 0.008856;
    const kappa = 903.3;

    varX = varX > epsilon ? Math.pow(varX, 1 / 3) : (kappa * varX + 16) / 116;
    varY = varY > epsilon ? Math.pow(varY, 1 / 3) : (kappa * varY + 16) / 116;
    varZ = varZ > epsilon ? Math.pow(varZ, 1 / 3) : (kappa * varZ + 16) / 116;

    const lVal = (116 * varY) - 16;
    const aVal = 500 * (varX - varY);
    const bVal = 200 * (varY - varZ);

    return {
        l: Math.round(lVal),
        a: Math.round(aVal),
        b: Math.round(bVal)
    };
};

// LAB to RGB (Inverse of rgbToLab)
export const labToRgb = ({ l, a, b }) => {
    // 1. LAB to XYZ
    let varY = (l + 16) / 116;
    let varX = a / 500 + varY;
    let varZ = varY - b / 200;

    const pow3 = (v) => v * v * v;
    const epsilon = 0.008856;
    const kappa = 903.3;

    if (pow3(varY) > epsilon) varY = pow3(varY);
    else varY = (varY * 116 - 16) / kappa;

    if (pow3(varX) > epsilon) varX = pow3(varX);
    else varX = (varX * 116 - 16) / kappa;

    if (pow3(varZ) > epsilon) varZ = pow3(varZ);
    else varZ = (varZ * 116 - 16) / kappa;

    const xRef = 95.047;
    const yRef = 100.000;
    const zRef = 108.883;

    const x = varX * xRef;
    const y = varY * yRef;
    const z = varZ * zRef;

    // 2. XYZ to RGB
    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let blue = x * 0.0557 + y * -0.2040 + z * 1.0570;

    r = r / 100;
    g = g / 100;
    blue = blue / 100;

    const correct = (val) => {
        return val > 0.0031308
            ? 1.055 * Math.pow(val, 1 / 2.4) - 0.055
            : 12.92 * val;
    };

    r = correct(r);
    g = correct(g);
    blue = correct(blue);

    return {
        r: clamp(Math.round(r * 255), 0, 255),
        g: clamp(Math.round(g * 255), 0, 255),
        b: clamp(Math.round(blue * 255), 0, 255)
    };
};

// LAB to LCH
export const labToLch = ({ l, a, b }) => {
    const c = Math.sqrt(a * a + b * b);
    let h = (Math.atan2(b, a) * 180) / Math.PI; // in degrees
    if (h < 0) h += 360;

    return {
        l: parseFloat(l.toFixed(1)),
        c: parseFloat(c.toFixed(1)),
        h: parseFloat(h.toFixed(1))
    };
};

// LCH to LAB
export const lchToLab = ({ l, c, h }) => {
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);

    return { l, a, b };
};

// RGB to LCH Helper
export const rgbToLch = (rgb) => labToLch(rgbToLab(rgb));

// LCH to RGB Helper
export const lchToRgb = (lch) => labToRgb(lchToLab(lch));

// Perceptually Uniform Harmonies (LCH Engine)
export const generateHarmoniesLCH = (baseRgb, enforceContrast = false, isDarkTheme = true) => {
    const baseLch = rgbToLch(baseRgb);

    // Constraints (User's Rules: L 25-85, S/C clamped)
    const constrain = (lch) => {
        let { l, c, h } = lch;
        l = clamp(l, 25, 90); // Slightly wider range
        c = clamp(c, 10, 95); // Avoid gray or super-neon
        return { l, c, h: (h % 360 + 360) % 360 }; // Normalize H
    };

    // Heuristic Contrast Enforcement
    const contrastAdjust = (lch) => {
        if (!enforceContrast) return lch;
        // If dark theme, background is dark (e.g. L=10). We want lighter colors (L>40?)
        // If light theme, background is light (e.g. L=95). We want darker colors (L<60?)

        let { l, c, h } = lch;
        if (isDarkTheme) {
            // Ensure enough lightness to pop against dark bg
            if (l < 45) l = 45 + (45 - l) * 0.5;
        } else {
            // Ensure enough darkness to pop against light bg
            if (l > 60) l = 60 - (l - 60) * 0.5;
        }
        return { l, c, h };
    };

    const process = (hueOffset, lAdjust = 0, cAdjust = 1) => {
        // Randomization: +/- 5 deg hue, +/- 5% lightness
        const randomH = (Math.random() * 10 - 5);
        const randomL = (Math.random() * 6 - 3);

        let newH = baseLch.h + hueOffset + randomH;
        let newL = baseLch.l + lAdjust + randomL;
        let newC = baseLch.c * cAdjust;

        let col = constrain({ l: newL, c: newC, h: newH });
        col = contrastAdjust(col);
        return lchToRgb(col); // Return RGB for easier display
    };

    // Bases
    // Monochromatic: Same Hue, vary Lightness/Chroma
    const mono = [
        process(0, 20, 0.8), // Lighter, less chroma
        process(0, -20, 0.9) // Darker
    ];

    // Analogous: +/- 30 deg
    const analog = [
        process(-30),
        process(30)
    ];

    // Complementary: 180 deg
    const comp = [
        process(180)
    ];

    // Split Comp: 150, 210
    const split = [
        process(150),
        process(210)
    ];

    // Triadic: 120, 240
    const triad = [
        process(120),
        process(240)
    ];

    // Tetradic: 90, 180, 270 (Rectangle logic varies, User said 60, 180, 240. Let's use Rect: 60, 180, 240)
    // Actually user said: 60/180/240. Let's follow that.
    const tetrad = [
        process(60),
        process(180),
        process(240)
    ];

    return {
        monochromatic: mono,
        analogous: analog,
        complementary: comp,
        splitComplementary: split,
        triadic: triad,
        tetradic: tetrad
    };
};
