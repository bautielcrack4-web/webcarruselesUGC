'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, Wand2, Monitor, Smartphone, Clock, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { generateVideo, waitForVideo } from '@/lib/atlas-api';
import styles from './studio.module.css';

export default function StudioPage() {
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [duration, setDuration] = useState<10 | 15>(10);
    const [size, setSize] = useState<'720*1280' | '1280*720'>('720*1280');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In a real app, we would upload to Supabase Storage here
            // For now, we use a data URL for UI preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!image || !prompt) return;

        setLoading(true);
        setStatus('Iniciando IA...');
        setVideoUrl(null);

        try {
            // 1. In a production app: Upload image to Supabase and get URL
            // Since we don't have a backend image store ready in this mock, 
            // we'll assume the URL is gathered.
            const mockImageURL = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000";

            // 2. Start generation
            const id = await generateVideo({
                image: mockImageURL,
                prompt,
                duration,
                size
            });

            // 3. Wait for result (Polling)
            const finalVideo = await waitForVideo(id, (s) => {
                if (s === 'processing') setStatus('Generando video (Sora 2)...');
            });

            setVideoUrl(finalVideo);
        } catch (err) {
            console.error(err);
            alert('Error en la generación. Asegúrate de tener la API KEY configurada.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.studioContainer}>
            <div className={styles.previewSection}>
                <GlassCard className={styles.editorCard}>
                    <AnimatePresence mode="wait">
                        {videoUrl ? (
                            <motion.video
                                key="video"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={videoUrl}
                                controls
                                className={styles.videoPlayer}
                            />
                        ) : loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.statusOverlay}
                            >
                                <div className={styles.loaderRing} />
                                <p>{status}</p>
                            </motion.div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Video size={48} className={styles.emptyIcon} />
                                <p>Tu video aparecerá aquí</p>
                            </div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </div>

            <div className={styles.controlsSidebar}>
                {/* Step 1: Product Image */}
                <div className={styles.controlGroup}>
                    <label>1. Imagen del Producto</label>
                    <div
                        className={styles.imageUpload}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <>
                                <img src={image} className={styles.previewThumb} alt="Preview" />
                                <div className={styles.imageOverlay}>Click para cambiar</div>
                            </>
                        ) : (
                            <>
                                <Upload size={24} color="var(--accent-primary)" />
                                <span>Subir imagen</span>
                            </>
                        )}
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Step 2: Prompt */}
                <div className={styles.controlGroup}>
                    <label>2. Instrucciones (Prompt)</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Ej: Cámara cinematográfica moviéndose hacia el producto, luz suave de atardecer..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                {/* Step 3: Format */}
                <div className={styles.controlGroup}>
                    <label>3. Formato</label>
                    <div className={styles.radioGroup}>
                        <button
                            className={`${styles.radioButton} ${size === '720*1280' ? styles.active : ''}`}
                            onClick={() => setSize('720*1280')}
                        >
                            <Smartphone size={14} style={{ marginRight: 6 }} /> 9:16
                        </button>
                        <button
                            className={`${styles.radioButton} ${size === '1280*720' ? styles.active : ''}`}
                            onClick={() => setSize('1280*720')}
                        >
                            <Monitor size={14} style={{ marginRight: 6 }} /> 16:9
                        </button>
                    </div>
                </div>

                {/* Step 4: Duration */}
                <div className={styles.controlGroup}>
                    <label>4. Duración (Segundos)</label>
                    <div className={styles.radioGroup}>
                        <button
                            className={`${styles.radioButton} ${duration === 10 ? styles.active : ''}`}
                            onClick={() => setDuration(10)}
                        >
                            <Clock size={14} style={{ marginRight: 6 }} /> 10s
                        </button>
                        <button
                            className={`${styles.radioButton} ${duration === 15 ? styles.active : ''}`}
                            onClick={() => setDuration(15)}
                        >
                            <Clock size={14} style={{ marginRight: 6 }} /> 15s
                        </button>
                    </div>
                </div>

                <Button
                    className={styles.generateBtn}
                    onClick={handleGenerate}
                    loading={loading}
                    disabled={!image || !prompt}
                >
                    <Wand2 size={18} style={{ marginRight: 8 }} />
                    Generar Video UGC
                </Button>
            </div>
        </div>
    );
}
