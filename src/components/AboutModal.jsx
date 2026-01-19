import { useState } from 'react';
import styles from './AboutModal.module.css';

const AboutModal = ({ onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
            <div className={`${styles.modal} ${isClosing ? styles.closing : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.logo}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19 7-7 3 3-7 7-3-3z"></path>
                            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                            <path d="m2 2 7.5 8.6"></path>
                            <path d="M11 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                        </svg>
                    </div>

                    <h2 className={styles.appName}>ColorForge</h2>
                    <span className={styles.version}>v1.0.0</span>

                    <p className={styles.description}>
                        A professional color system designed for designers and developers.
                        Features native screen sampling, advanced harmony generation, and accessibility checking.
                    </p>

                    <div className={styles.companySection}>
                        <span className={styles.companyName}>AZSoftStudio</span>
                        <span className={styles.copyright}>Copyright © 2026. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
