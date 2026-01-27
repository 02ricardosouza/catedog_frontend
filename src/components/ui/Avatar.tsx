import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
    src?: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
    return (
        <div className={`${styles.avatar} ${styles[size]}`}>
            {src ? (
                <img src={src} alt={alt} className={styles.image} />
            ) : (
                <div className={styles.placeholder}>{alt.charAt(0).toUpperCase()}</div>
            )}
        </div>
    );
};
