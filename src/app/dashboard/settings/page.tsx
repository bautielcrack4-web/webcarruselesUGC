'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { Settings, User, Bell, Shield } from 'lucide-react';
import styles from '../page.module.css';

export default function SettingsPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Configuración</h1>
                    <p className={styles.subtitle}>Gestiona tu cuenta y preferencias</p>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px', maxWidth: '800px' }}>
                <GlassCard style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <User size={24} />
                    <div>
                        <h3 style={{ margin: 0 }}>Perfil</h3>
                        <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>Cambia tu nombre y avatar</p>
                    </div>
                </GlassCard>
                <GlassCard style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Bell size={24} />
                    <div>
                        <h3 style={{ margin: 0 }}>Notificaciones</h3>
                        <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>Configura tus alertas</p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
