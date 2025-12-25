'use client';

import React from 'react';
import styles from './TrustBadges.module.css';

const PLATFORMS = [
    {
        name: 'TikTok',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.08.33-.54.31-.99.77-1.32 1.3-.43.68-.67 1.48-.68 2.29-.04 1.02.39 2.03 1.16 2.69.81.71 1.93.99 2.97.77 1.12-.22 2.13-.99 2.65-1.99.28-.53.43-1.13.44-1.74-.01-4.25-.01-8.5-.01-12.75z" />
            </svg>
        )
    },
    {
        name: 'Meta',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.141 5.04c-1.35 0-2.613.626-3.882 1.848-1.272 1.226-2.43 2.87-3.259 4.706C11.171 9.76 10.013 8.114 8.741 6.888 7.472 5.666 6.209 5.04 4.859 5.04 2.181 5.04 0 7.375 0 10.25c0 2.876 2.181 5.211 4.859 5.211 1.35 0 2.613-.626 3.882-1.848 1.272-1.226 2.43-2.87 3.259-4.706.829 1.836 1.987 3.483 3.259 4.706 1.269 1.22 2.532 1.848 3.882 1.848 2.678 0 4.859-2.335 4.859-5.211 0-2.875-2.181-5.21-4.859-5.21zm-14.282 8.444c-1.748 0-3.167-1.503-3.167-3.234 0-1.733 1.419-3.236 3.167-3.236 1.056 0 2.028.513 3.016 1.5.88.88 1.865 2.22 2.68 3.87-1.002.997-2.19 1.1-2.68 1.1h-.016zm14.282 0c-.49 0-1.678-.103-2.68-1.1.815-1.65 1.8-2.99 2.68-3.87.988-.987 1.96-1.5 3.016-1.5 1.748 0 3.167 1.503 3.167 3.236 0 1.731-1.419 3.234-3.167 3.234h-.016z" />
            </svg>
        )
    },
    {
        name: 'Tiendanube',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.1 0-2-.9-2-2s.9-2 2-2h1.5l2-3.5a1 1 0 011.73 0l2 3.5H16c1.1 0 2 .9 2 2s-.9 2-2 2z" />
            </svg>
        )
    },
    {
        name: 'Dropi',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.32L4 13a8 8 0 1116 0l-8 8.32zM12 15a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
        )
    },
    {
        name: 'Shopify',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.157 2.378l6.102 1.966c.465.15.8.547.882 1.028l1.328 15.657a.998.998 0 01-.84 1.071c-.053.007-.107.01-.161.01H.534c-.552 0-1-.448-1-1 0-.054.004-.108.012-.161L3.064 3.125a.998.998 0 01.815-.84l12.278-1.424a1 1 0 011 .517z" />
            </svg>
        )
    }
];

export const TrustBadges = () => {
    // Quadruple the array for a truly infinite scroll effect
    const items = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

    return (
        <div className={styles.trustWrapper}>
            <p className={styles.trustLabel}>Listo para exportar a anuncios</p>
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
                    {items.map((platform, index) => (
                        <div key={index} className={styles.platformBadge}>
                            <div className={styles.platformIcon}>{platform.svg}</div>
                            <span className={styles.platformName}>{platform.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
