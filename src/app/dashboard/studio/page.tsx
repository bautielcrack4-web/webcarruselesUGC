'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, Wand2, Monitor, Smartphone, Clock, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { generateVideo, waitForVideo } from '@/lib/atlas-api';
import { supabase } from '@/lib/supabase';
import styles from './studio.module.css';

export default function StudioPage() {
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
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
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!imageFile || !prompt) return;

        setLoading(true);
        setStatus('Subiendo imagen del producto...');
        setVideoUrl(null);

        try {
            // 1. Subir imagen a Supabase Storage
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `product-uploads/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error('Studio: Upload Error:', uploadError);
                throw uploadError;
            }
            console.log('Studio: Upload Success:', uploadData);

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            setStatus('Analizando producto con IA...');

            // Simular pasos pro para mejor UX
            setTimeout(() => setStatus('Generando hook de marketing...'), 2000);
            setTimeout(() => setStatus('Renderizando escena (Sora 2)...'), 5000);

            // 2. Iniciar generación en AtlasCloud
            const id = await generateVideo({
                image: publicUrl,
                prompt,
                duration,
                size
            });
            console.log('Studio: Generation Started, ID:', id);

            // 3. Polling (esperar resultado)
            const finalVideo = await waitForVideo(id, (s) => {
                console.log('Studio: Generation Status:', s);
                if (s === 'processing') setStatus('Finalizando renderizado de video...');
            });
            console.log('Studio: Generation Complete, Video URL:', finalVideo);

            // 4. Guardar en base de datos como un proyecto
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error: dbError } = await supabase.from('projects').insert({
                    user_id: user.id,
                    name: `UGC Video - ${new Date().toLocaleDateString()}`,
                    video_url: finalVideo,
                    status: 'Ready',
                    settings: { prompt, duration, size }
                });
                if (dbError) {
                    console.error('Studio: DB Save Error:', dbError);
                } else {
                    console.log('Studio: Project Saved Successfully');
                }
            } else {
                console.warn('Studio: No user found when trying to save project');
            }

            setVideoUrl(finalVideo);
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message || 'Falló la generación'}`);
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
                    disabled={!imageFile || !prompt}
                >
                    <Wand2 size={18} style={{ marginRight: 8 }} />
                    Generar Video UGC
                </Button>
            </div>
        </div>
    );
}
