import { useState } from 'react';
import styles from './FullDocsModal.module.css';

const FullDocsModal = ({ onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
            <div className={`${styles.modal} ${isClosing ? styles.closing : ''}`} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <button className={styles.backBtn} onClick={handleClose} title="Back to Settings">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <h2 className={styles.title}>Full Documentation</h2>
                </header>
                <div className={styles.content}>
                    <iframe
                        src="/documentation.html"
                        className={styles.docFrame}
                        title="Full Documentation"
                    />
                </div>
            </div>
        </div>
    );
};

export default FullDocsModal;
