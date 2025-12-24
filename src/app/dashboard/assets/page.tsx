'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { Image as ImageIcon, Video as VideoIcon, Download, Loader2 } from 'lucide-react'; // Added Loader2
import { supabase } from '@/lib/supabase';
import { getPredictionStatus } from '@/lib/atlas-api';
import styles from '../page.module.css';

interface Asset {
    id: string;
    url: string | null;
    type: 'image' | 'video';
    name: string;
    created_at: string;
    status?: 'processing' | 'completed' | 'failed';
    atlas_id?: string;
}

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAssets = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Obtener videos de la tabla projects
        const { data: projects } = await supabase
            .from('projects')
            .select('id, video_url, name, created_at, status, atlas_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        const videoAssets: Asset[] = (projects || [])
            .map(p => ({
                id: p.id,
                url: p.video_url,
                type: 'video',
                name: p.name,
                created_at: p.created_at,
                status: p.status || 'completed', // Legacy rows are completed
                atlas_id: p.atlas_id
            }));

        setAssets(videoAssets);
        setLoading(false);
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    // Polling Mechanism for Processing Assets
    useEffect(() => {
        const processingAssets = assets.filter(a => a.status === 'processing' && a.atlas_id);

        if (processingAssets.length === 0) return;

        const interval = setInterval(async () => {
            console.log('Polling for', processingAssets.length, 'assets...');
            let updated = false;

            for (const asset of processingAssets) {
                if (!asset.atlas_id) continue;
                try {
                    const status = await getPredictionStatus(asset.atlas_id);

                    if (status.status === 'completed' || status.status === 'succeeded') {
                        const videoUrl = status.outputs?.[0];
                        if (videoUrl) {
                            // Update DB
                            await supabase.from('projects').update({
                                status: 'completed',
                                video_url: videoUrl
                            }).eq('id', asset.id);
                            updated = true;
                        }
                    } else if (status.status === 'failed') {
                        await supabase.from('projects').update({
                            status: 'failed'
                        }).eq('id', asset.id);
                        updated = true;
                    }
                } catch (e) {
                    console.error("Poll error", e);
                }
            }

            if (updated) {
                fetchAssets();
            }

        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [assets]);

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
                                {asset.status === 'processing' ? (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                                        <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s infinite linear' }} />
                                        <span style={{ fontSize: '0.8rem', marginTop: '8px' }}>Generando...</span>
                                    </div>
                                ) : asset.type === 'video' && asset.url ? (
                                    <video src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                ) : (
                                    <img src={asset.url || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={asset.name} />
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

                                    {asset.status === 'completed' && asset.url && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await fetch(asset.url!);
                                                    const blob = await response.blob();
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.style.display = 'none';
                                                    a.href = url;
                                                    const cleanName = asset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                                                    a.download = `${cleanName}.mp4`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                } catch (error) {
                                                    console.error('Download failed', error);
                                                    if (asset.url) window.open(asset.url, '_blank');
                                                }
                                            }}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}
                                            title="Download MP4"
                                        >
                                            <Download size={18} />
                                        </button>
                                    )}
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

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
