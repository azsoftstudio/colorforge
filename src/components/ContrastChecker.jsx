import { useColor } from '../context/ColorContext';
import { getContrastRatio } from '../utils/colorUtils';
import styles from './ContrastChecker.module.css';

const ContrastChecker = () => {
    const { rgb, hex } = useColor();

    const whiteRgb = { r: 255, g: 255, b: 255 };
    const blackRgb = { r: 0, g: 0, b: 0 };

    const contrastWhite = getContrastRatio(rgb, whiteRgb);
    const contrastBlack = getContrastRatio(rgb, blackRgb);

    // Helper to get grade
    const getGrade = (ratio) => {
        if (ratio >= 7) return 'AAA';
        if (ratio >= 4.5) return 'AA';
        if (ratio >= 3) return 'AA Large';
        return 'Fail';
    };

    const whiteGrade = getGrade(contrastWhite);
    const blackGrade = getGrade(contrastBlack);

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Contrast & Accessibility</h3>

            <div className={styles.grid}>
                {/* White Text Card */}
                <div
                    className={styles.card}
                    style={{ backgroundColor: hex, color: '#ffffff' }}
                >
                    <div className={styles.previewText}>
                        <span className={styles.large}>Aa</span>
                        <span className={styles.small}>Text Preview</span>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.ratio}>{contrastWhite.toFixed(2)}</div>
                        <div className={`${styles.badge} ${whiteGrade === 'Fail' ? styles.fail : styles.pass}`}>
                            {whiteGrade}
                        </div>
                    </div>
                </div>

                {/* Black Text Card */}
                <div
                    className={styles.card}
                    style={{ backgroundColor: hex, color: '#000000' }}
                >
                    <div className={styles.previewText}>
                        <span className={styles.large}>Aa</span>
                        <span className={styles.small}>Text Preview</span>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.ratio}>{contrastBlack.toFixed(2)}</div>
                        <div className={`${styles.badge} ${blackGrade === 'Fail' ? styles.fail : styles.pass}`}>
                            {blackGrade}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContrastChecker;
