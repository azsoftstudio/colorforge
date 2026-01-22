import { useState } from 'react';
import styles from './SettingsModal.module.css';

const SettingsModal = ({ onClose, theme, setTheme }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [isClosing, setIsClosing] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };



    return (
        <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
            <div className={`${styles.modal} ${isClosing ? styles.closing : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Settings</h2>
                    <button className={styles.closeBtn} onClick={handleClose} title="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className={styles.body}>
                    <aside className={styles.sidebar}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'about' ? styles.active : ''}`}
                            onClick={() => setActiveTab('about')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            About
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'visuals' ? styles.active : ''}`}
                            onClick={() => setActiveTab('visuals')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                            </svg>
                            Visuals
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'documentation' ? styles.active : ''}`}
                            onClick={() => setActiveTab('documentation')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Documentation
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'license' ? styles.active : ''}`}
                            onClick={() => setActiveTab('license')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            License
                        </button>
                    </aside>

                    <main className={styles.content}>
                        {activeTab === 'visuals' && (
                            <div className={styles.settingsSection}>
                                <div className={styles.sectionHeader}>Appearance</div>
                                <div className={styles.row}>
                                    <div className={styles.rowLabel}>
                                        <span className={styles.rowTitle}>Theme Mode</span>
                                        <span className={styles.rowDesc}>Switch between light and dark themes</span>
                                    </div>
                                    <div className={styles.dropdownContainer}>
                                        <button
                                            className={`${styles.dropdownTrigger} ${dropdownOpen ? styles.open : ''}`}
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                        >
                                            <span className={styles.selectedText}>
                                                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                            </span>
                                            <svg className={styles.arrowIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>

                                        <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.open : ''}`}>
                                            <button
                                                className={`${styles.dropdownOption} ${theme === 'light' ? styles.active : ''}`}
                                                onClick={() => { setTheme('light'); setDropdownOpen(false); }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="5"></circle>
                                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                                </svg>
                                                Light Mode
                                            </button>
                                            <button
                                                className={`${styles.dropdownOption} ${theme === 'dark' ? styles.active : ''}`}
                                                onClick={() => { setTheme('dark'); setDropdownOpen(false); }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                                </svg>
                                                Dark Mode
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'documentation' && (
                            <div className={styles.quickStartContainer}>
                                <h3 className={styles.quickStartTitle}>Quick Start</h3>
                                <div className={styles.stepList}>
                                    <div className={styles.stepItem}>
                                        <span className={styles.stepLabel}>Pick a color</span>
                                        <span className={styles.stepArrow}>→</span>
                                        <span className={styles.stepDesc}>Use the Color Wheel or Eyedropper on an image</span>
                                    </div>
                                    <div className={styles.stepItem}>
                                        <span className={styles.stepLabel}>Check accessibility</span>
                                        <span className={styles.stepArrow}>→</span>
                                        <span className={styles.stepDesc}>Instantly see WCAG rating (AA / AAA / Fail)</span>
                                    </div>
                                    <div className={styles.stepItem}>
                                        <span className={styles.stepLabel}>Generate palettes</span>
                                        <span className={styles.stepArrow}>→</span>
                                        <span className={styles.stepDesc}>Browse and click harmony colors</span>
                                    </div>
                                    <div className={styles.stepItem}>
                                        <span className={styles.stepLabel}>Export</span>
                                        <span className={styles.stepArrow}>→</span>
                                        <span className={styles.stepDesc}>Copy HEX, RGB, HSL, or advanced formats</span>
                                    </div>
                                </div>
                                <p className={styles.quickStartFooter}>That’s it. No setup. No accounts. No uploads.</p>

                                <a
                                    href="https://colorforge.azsoftstudio.workers.dev/documentation"
                                    className={styles.fullDocsBtn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                    View Full Documentation
                                </a>
                            </div>
                        )}

                        {activeTab === 'license' && (
                            <div className={styles.licenseText}>
                                {`MIT License

Copyright (c) 2026 AZSoftStudio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className={styles.aboutContainer}>
                                <div className={styles.logo}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m12 19 7-7 3 3-7 7-3-3z"></path>
                                        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                        <path d="m2 2 7.5 8.6"></path>
                                        <path d="M11 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                                    </svg>
                                </div>

                                <h2 className={styles.appName}>ColorForge</h2>
                                <span className={styles.version}>v0.1.0</span>

                                <p className={styles.description}>
                                    A professional color system designed for designers and developers.
                                    Features native screen sampling, advanced harmony generation, and accessibility checking.
                                </p>

                                <div className={styles.companySection}>
                                    <span className={styles.companyName}>AZSoftStudio</span>
                                    <span className={styles.copyright}>Released under the MIT License</span>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
