'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { Image as ImageIcon, Video as VideoIcon, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from '../page.module.css';

interface Asset {
    id: string;
    url: string;
    type: 'image' | 'video';
    name: string;
    created_at: string;
}

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Obtener videos de la tabla projects
            const { data: projects } = await supabase
                .from('projects')
                .select('id, video_url, name, created_at')
                .eq('user_id', user.id);

            const videoAssets: Asset[] = (projects || [])
                .filter(p => p.video_url)
                .map(p => ({
                    id: p.id,
                    url: p.video_url,
                    type: 'video',
                    name: p.name,
                    created_at: p.created_at
                }));

            // 2. En el futuro podríamos listar los archivos de Storage aquí también
            setAssets(videoAssets);
            setLoading(false);
        };

        fetchAssets();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Mis Assets</h1>
                    <p className={styles.subtitle}>Gestiona tus imágenes y videos generados</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' }}>
                {loading ? (
                    <p>Cargando assets...</p>
                ) : assets.length > 0 ? (
                    assets.map(asset => (
                        <GlassCard key={asset.id} className="glow-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
                                {asset.type === 'video' ? (
                                    <video src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                ) : (
                                    <img src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={asset.name} />
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'rgba(0,0,0,0.5)',
                                    padding: '6px',
                                    borderRadius: '8px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    {asset.type === 'video' ? <VideoIcon size={16} /> : <ImageIcon size={16} />}
                                </div>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {asset.name}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                                        {new Date(asset.created_at).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => window.open(asset.url, '_blank')}
                                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
                        <p>No tienes assets guardados aún.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
