import { useColor } from '../context/ColorContext';
import { rgbToHex, hsvToRgb } from '../utils/colorUtils';
import styles from './ColorHistory.module.css';

const ColorHistory = () => {
    const { history, updateFromHex } = useColor();

    if (history.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>History</h3>
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
        </div>
    );
};

export default ColorHistory;
