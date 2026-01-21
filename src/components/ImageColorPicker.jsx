import { useState, useRef, useEffect } from 'react';
import { useColor } from '../context/ColorContext';
import styles from './ImageColorPicker.module.css';

const ImageColorPicker = ({ onClose }) => {
    const { updateFromHex } = useColor();
    const [image, setImage] = useState(null);
    const [supportsEyeDropper] = useState(() => 'EyeDropper' in window);
    const [isClosing, setIsClosing] = useState(false);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200); // Match animation duration
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Scale image to fit container while maintaining aspect ratio
                const maxWidth = 600;
                const maxHeight = 400;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
            };

            img.src = image;
        }
    }, [image]);

    const handleCanvasClick = async (e) => {
        if (supportsEyeDropper) {
            try {
                const eyeDropper = new window.EyeDropper();
                const result = await eyeDropper.open();
                updateFromHex(result.sRGBHex);
                handleClose();
            } catch {
                console.log('Color picking canceled');
            }
            return;
        }

        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(x, y, 1, 1).data;

        const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
            .toString(16).slice(1);

        updateFromHex(hex);
        handleClose();
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
                    {!image ? (
                        <div className={styles.uploadOptions}>
                            <div className={styles.uploadArea}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className={styles.fileInput}
                                />
                                <button
                                    className={styles.uploadBtn}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    <span>Upload Image</span>
                                    <span className={styles.hint}>Click to select an image file</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.canvasContainer}>
                            <canvas
                                ref={canvasRef}
                                className={styles.canvas}
                                onClick={handleCanvasClick}
                            />

                            <div className={styles.canvasActions}>
                                {supportsEyeDropper && (
                                    <button
                                        className={styles.screenPickBtn}
                                        onClick={handleCanvasClick}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="m2 22 1-1h3l9-9"></path>
                                            <path d="M3 21v-3l9-9"></path>
                                            <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z"></path>
                                        </svg>
                                        Pick with Eyedropper
                                    </button>
                                )}
                                <button
                                    className={styles.changeBtn}
                                    onClick={() => setImage(null)}
                                >
                                    Change Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageColorPicker;
