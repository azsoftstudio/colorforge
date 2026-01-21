import { useState, useMemo, useRef, useEffect } from 'react';
import { useColor } from '../context/ColorContext';
import { generateHarmoniesLCH, hsvToRgb, rgbToHex, rgbToHsv } from '../utils/colorUtils';
import styles from './PaletteDisplay.module.css';

const PaletteDisplay = () => {
    const { hsv, updateHsv, hex } = useColor();
    const [activeTab, setActiveTab] = useState('complementary');
    const tabsRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const [enforceContrast, setEnforceContrast] = useState(false);

    // Palette Locking
    const [isLocked, setIsLocked] = useState(false);
    const [lockedHsv, setLockedHsv] = useState(hsv);

    // Sync lockedHsv with global hsv when NOT locked
    useEffect(() => {
        if (!isLocked) {
            setLockedHsv(hsv);
        }
    }, [hsv, isLocked]);

    // Detect Theme (Basic implementation)
    const [isDark, setIsDark] = useState(true);
    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDark(theme !== 'light');
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    // Generate harmonies using Pro LCH Engine based on LOCKED HSV
    const harmonies = useMemo(() => {
        const baseRgb = hsvToRgb(lockedHsv);
        return generateHarmoniesLCH(baseRgb, enforceContrast, isDark);
    }, [lockedHsv, enforceContrast, isDark]);

    const tabs = [
        { id: 'monochromatic', label: 'Monochromatic' },
        { id: 'complementary', label: 'Complementary' },
        { id: 'triadic', label: 'Triadic' },
        { id: 'analogous', label: 'Analogous' },
        { id: 'splitComplementary', label: 'Split' },
        { id: 'tetradic', label: 'Tetradic' },
    ];

    const handleColorClick = (colorHsv) => {
        updateHsv(colorHsv);
    };

    const checkScroll = () => {
        if (tabsRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        const tabsElement = tabsRef.current;
        if (tabsElement) {
            tabsElement.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (tabsElement) {
                tabsElement.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scroll = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = 150;
            tabsRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Calculate base color for display (if locked, show locked color, else current)
    // Actually, design-wise: The "Base" swatch in the row should probably reflect the *palette's* base.
    // So if locked, it shows the locked base.
    const paletteBaseRgb = hsvToRgb(lockedHsv);
    const paletteBaseHex = rgbToHex(paletteBaseRgb);

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Harmony Palette</h3>

            <div className={styles.controlsRow}>
                {/* Palette Lock Toggle */}
                <label className={styles.toggleLabel}>
                    <div
                        className={`${styles.toggleSwitch} ${isLocked ? styles.on : ''}`}
                        onClick={() => setIsLocked(!isLocked)}
                        title={isLocked ? "Unlock Palette" : "Lock Palette"}
                    >
                        <div className={styles.toggleKnob}></div>
                    </div>
                    <span className={styles.toggleText}>Lock Palette</span>
                </label>

                {/* WCAG Contrast Toggle */}
                <label className={styles.toggleLabel}>
                    <div
                        className={`${styles.toggleSwitch} ${enforceContrast ? styles.on : ''}`}
                        onClick={() => setEnforceContrast(!enforceContrast)}
                        title={enforceContrast ? "Disable WCAG contrast" : "Enforce WCAG 4.5:1 contrast"}
                    >
                        <div className={styles.toggleKnob}></div>
                    </div>
                    <span className={styles.toggleText}>Enforce WCAG</span>
                </label>
            </div>

            <div className={styles.tabsWrapper}>
                {showLeftArrow && (
                    <button className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`} onClick={() => scroll('left')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )}

                <div className={styles.tabs} ref={tabsRef}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {showRightArrow && (
                    <button className={`${styles.scrollArrow} ${styles.scrollArrowRight}`} onClick={() => scroll('right')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>

            <div className={styles.palette}>


                <div
                    className={styles.swatch}
                    style={{ backgroundColor: paletteBaseHex }}
                    title={paletteBaseHex}
                    onClick={() => handleColorClick(lockedHsv)}
                >
                    <span className={styles.swatchLabel}>Base</span>
                </div>

                {harmonies[activeTab].map((colRgb, idx) => {
                    const hx = rgbToHex(colRgb);
                    return (
                        <div
                            key={idx}
                            className={styles.swatch}
                            style={{ backgroundColor: hx }}
                            onClick={() => handleColorClick(rgbToHsv(colRgb))}
                            title={hx}
                        >
                            <span className={styles.swatchLabel}>{hx}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaletteDisplay;
