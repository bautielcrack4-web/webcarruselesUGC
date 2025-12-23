'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import styles from '../page.module.css';

export default function AssetsPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Mis Assets</h1>
                    <p className={styles.subtitle}>Gestiona tus imágenes y videos subidos</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
                <GlassCard style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
                    <ImageIcon size={48} style={{ marginBottom: '16px', color: 'var(--accent-primary)' }} />
                    <p>No tienes imágenes aún</p>
                </GlassCard>
                <GlassCard style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
                    <VideoIcon size={48} style={{ marginBottom: '16px', color: 'var(--accent-primary)' }} />
                    <p>No tienes videos generados</p>
                </GlassCard>
            </div>
        </div>
    );
}
