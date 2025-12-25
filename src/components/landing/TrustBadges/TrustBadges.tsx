'use client';

import React from 'react';
import styles from './TrustBadges.module.css';

// Platform logos as text for now - can be replaced with actual SVGs
const PLATFORMS = [
    { name: 'TikTok', icon: '♪' },
    { name: 'Meta', icon: '∞' },
    { name: 'Tiendanube', icon: '☁' },
    { name: 'Dropi', icon: '💧' },
    { name: 'Shopify', icon: '🛍' }
];

export const TrustBadges = () => {
    // Double the array for infinite scroll effect
    const doubledPlatforms = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

    return (
        <div className={styles.trustWrapper}>
            <p className={styles.trustLabel}>Listo para exportar a anuncios</p>
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
                    {doubledPlatforms.map((platform, index) => (
                        <div key={index} className={styles.platformBadge}>
                            <span className={styles.platformIcon}>{platform.icon}</span>
                            <span className={styles.platformName}>{platform.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
