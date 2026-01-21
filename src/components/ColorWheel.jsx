import { useRef, useEffect, useState, useCallback } from 'react';
import { useColor } from '../context/ColorContext';
import styles from './ColorWheel.module.css';

const ColorWheel = () => {
    const { hsv, updateHsv } = useColor();
    const wheelRef = useRef(null);
    const squareRef = useRef(null);

    const [isDraggingHue, setIsDraggingHue] = useState(false);
    const [isDraggingSV, setIsDraggingSV] = useState(false);

    // Constants - Must match CSS
    const WHEEL_SIZE = 320;

    // Calculate positions based on state
    const hueDeg = hsv.h;
    const satPercent = hsv.s;
    const valPercent = hsv.v;

    // Handle Hue Drag
    const handleHueDrag = useCallback((e) => {
        if (!wheelRef.current) return;
        e.preventDefault();

        const rect = wheelRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left - centerX;
        const y = clientY - rect.top - centerY;

        // Calculate angle in degrees
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;

        updateHsv({ h: Math.round(angle) });
    }, [updateHsv]);

    // Handle SV Drag
    const handleSVDrag = useCallback((e) => {
        if (!squareRef.current) return;
        e.preventDefault();

        const rect = squareRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        let x = clientX - rect.left;
        let y = clientY - rect.top;

        // Clamp
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        const s = Math.round((x / rect.width) * 100);
        const v = Math.round(100 - (y / rect.height) * 100);

        updateHsv({ s, v });
    }, [updateHsv]);

    // Mouse Up Global Handler
    useEffect(() => {
        const handleUp = () => {
            setIsDraggingHue(false);
            setIsDraggingSV(false);
        };

        const handleMove = (e) => {
            if (isDraggingHue) handleHueDrag(e);
            if (isDraggingSV) handleSVDrag(e);
        };

        if (isDraggingHue || isDraggingSV) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDraggingHue, isDraggingSV, handleHueDrag, handleSVDrag]);

    return (
        <div className={styles.container}>
            {/* Outer Hue Ring */}
            <div
                className={styles.hueRing}
                ref={wheelRef}
                onMouseDown={(e) => { setIsDraggingHue(true); handleHueDrag(e); }}
                onTouchStart={(e) => { setIsDraggingHue(true); handleHueDrag(e); }}
            >
                <div
                    className={styles.hueHandle}
                    style={{ transform: `translate(-50%, -50%) rotate(${hueDeg}deg) translateY(-${WHEEL_SIZE / 2 - 15}px)` }}
                />
            </div>

            {/* Inner Saturation/Value Square */}
            <div
                className={styles.svSquare}
                ref={squareRef}
                style={{ backgroundColor: `hsl(${hueDeg}, 100%, 50%)` }}
                onMouseDown={(e) => { setIsDraggingSV(true); handleSVDrag(e); }}
                onTouchStart={(e) => { setIsDraggingSV(true); handleSVDrag(e); }}
            >
                <div className={`${styles.svOverlay} ${styles.svOverlayWhite}`} />
                <div className={`${styles.svOverlay} ${styles.svOverlayBlack}`} />

                <div
                    className={styles.svHandle}
                    style={{
                        left: `${satPercent}%`,
                        top: `${100 - valPercent}%`
                    }}
                />
            </div>
        </div>
    );
};

export default ColorWheel;
