import { useColor } from '../context/ColorContext';
// import { rgbToHex, hsvToRgb } from '../utils/colorUtils'; // Unused
import styles from './ColorHistory.module.css';

const ColorHistory = () => {
    const { history, updateFromHex, clearHistory } = useColor();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>History</h3>
                {history.length > 0 && (
                    <button
                        className={styles.clearBtn}
                        onClick={clearHistory}
                        title="Clear history"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {history.length > 0 ? (
                <div className={styles.list}>
                    {history.map((hex, i) => (
                        <div
                            key={i}
                            className={styles.swatch}
                            style={{ backgroundColor: hex }}
                            onClick={() => updateFromHex(hex)}
                            title={hex}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    There is nothing to show you
                </div>
            )}
        </div>
    );
};

export default ColorHistory;
