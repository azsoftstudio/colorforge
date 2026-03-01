const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const hslToRgb = ({ h, s, l }) => {
    const hN = h / 360, sN = s / 100, lN = l / 100;
    let r, g, b;
    if (sN === 0) { r = g = b = lN; } else {
        const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
        const q = lN < 0.5 ? lN * (1 + sN) : lN + sN - lN * sN, p = 2 * lN - q;
        r = hue2rgb(p, q, hN + 1 / 3); g = hue2rgb(p, q, hN); b = hue2rgb(p, q, hN - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

console.log(hslToRgb({ h: 219, s: 100, l: 65 }));
