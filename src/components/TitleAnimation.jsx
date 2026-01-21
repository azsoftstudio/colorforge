import React from 'react';
import './TitleAnimation.css';

const TitleAnimation = () => {
    const title = "ColorForge";
    // Convert string to array of characters including spaces if any
    const letters = title.split('');

    return (
        <div className="title-container">
            {letters.map((char, index) => (
                <span
                    key={index}
                    className="title-char"
                    style={{ animationDelay: `${index * 0.05}s` }} // Staggered delay
                    data-char={char}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    );
};

export default TitleAnimation;
