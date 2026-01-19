import styles from './KeyboardShortcuts.module.css';

const KeyboardShortcuts = () => {
    const shortcuts = [
        { keys: ['Ctrl', 'Z'], label: 'Undo' },
        { keys: ['Ctrl', 'Y'], label: 'Redo' },
        // { keys: ['Space'], label: 'Randomize' }, // If we implement space to randomize
    ];

    return (
        <div className={styles.container}>
            {shortcuts.map((sc, index) => (
                <div key={index} className={styles.item}>
                    <div className={styles.keys}>
                        {sc.keys.map((key, i) => (
                            <span key={i} className={styles.key}>
                                {key}
                            </span>
                        ))}
                    </div>
                    <span className={styles.label}>{sc.label}</span>
                </div>
            ))}
        </div>
    );
};

export default KeyboardShortcuts;
