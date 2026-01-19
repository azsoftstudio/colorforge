import { useState, useMemo, useRef, useEffect } from 'react';
import { useColor } from '../context/ColorContext';
import { generateHarmoniesLCH, hsvToRgb, rgbToHex } from '../utils/colorUtils';
import styles from './PaletteDisplay.module.css';

const PaletteDisplay = () => {
    const { hsv, updateHsv } = useColor();
    const [activeTab, setActiveTab] = useState('complementary');
    const tabsRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const [enforceContrast, setEnforceContrast] = useState(false);

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

    // Generate harmonies using Pro LCH Engine
    const harmonies = useMemo(() => {
        const baseRgb = hsvToRgb(hsv);
        return generateHarmoniesLCH(baseRgb, enforceContrast, isDark);
    }, [hsv, enforceContrast, isDark]);

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

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h3 className={styles.title}>Harmony Palette</h3>
                <label className={styles.checkboxLabel} title="Auto-adjust lightness for WCAG 4.5:1">
                    <input
                        type="checkbox"
                        checked={enforceContrast}
                        onChange={(e) => setEnforceContrast(e.target.checked)}
                        className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxText}>Enforce WCAG contrast</span>
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
                    style={{ backgroundColor: rgbToHex(hsvToRgb(hsv)) }}
                    title="Base Color"
                    onClick={() => handleColorClick(hsv)}
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
                            // onClick={() => handleColorClick(colRgb)} // Need to convert RGB back to HSV for updateHsv? 
                            // updateHsv handles RGB? checking context... 
                            // context: updateHsv expects {h,s,v}. We have rgb.
                            // Need to import rgbToHsv or add updateFromBaseRGB helper. 
                            // Let's use rgbToHsv in the click handler.
                            onClick={() => {
                                // Dynamic import or just rely on global import? 
                                // rgbToHsv is not imported yet. I need to fix imports.
                                import('../utils/colorUtils').then(utils => {
                                    handleColorClick(utils.rgbToHsv(colRgb));
                                });
                            }}
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
