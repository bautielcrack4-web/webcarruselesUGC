'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Video, Monitor, Smartphone,
    Play, User, Camera, MessageSquare, ChevronDown, Settings2, Clock, Maximize
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { generateVideo, waitForVideo } from '@/lib/atlas-api';
import { supabase } from '@/lib/supabase';
import styles from './studio.module.css';

// Opciones de configuración
const AVATAR_PRESETS = [
    {
        id: 'mia',
        name: 'Mia',
        tag: 'Influencer',
        thumb: '/avatars/mia.jpg',
        prompt: 'Shot on iPhone Pro Max, attractive young woman selfie in modern apartment, natural light, realistic skin texture, casual influencer style, authentic UGC look'
    },
    {
        id: 'sofia',
        name: 'Sofia',
        tag: 'Profesional',
        thumb: '/avatars/sofia.png',
        prompt: 'iPhone Pro Max portrait of professional woman in modern office, clean natural lighting, realistic mobile photo style'
    },
    {
        id: 'tomas',
        name: 'Tomás',
        tag: 'Confianza',
        thumb: '/avatars/tomas.jpg',
        prompt: 'Shot on iPhone selfie of adult man in casual setting, authentic UGC style, realistic lighting and texture'
    },
    {
        id: 'marta',
        name: 'Marta',
        tag: 'Hogar',
        thumb: '/avatars/marta.jpg',
        prompt: 'Realistic iPhone photo of older woman at home, natural light, authentic UGC style, no retouching'
    },
    {
        id: 'arturo',
        name: 'Arturo',
        tag: 'Senior',
        thumb: '/avatars/arturo.jpg',
        prompt: 'Shot on iPhone Pro Max, elderly man in home environment, natural lighting, realistic smartphone capture'
    }
];

const SCENE_LOCATIONS = ['Interior', 'Exterior', 'No especificar'];
const LIGHTING_STYLES = ['Natural', 'Estudio', 'Neón', 'Atardecer', 'No especificar'];
const SHOT_TYPES = ['Selfie', 'Fija', 'Movimiento', 'No especificar'];
const EDITING_PACE = ['Dinámico', 'Relajado', 'Cinematográfico', 'No especificar'];

export default function StudioPage() {
    // Control de interfaz
    const [showAdvanced, setShowAdvanced] = useState(false);

    // 0. Configuración Primordial
    const [format, setFormat] = useState<'720*1280' | '1280*720'>('720*1280');
    const [duration, setDuration] = useState<10 | 15>(10);

    // 1. Estados del bloque "Producto"
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productDesc, setProductDesc] = useState('');

    // 2. Estados del bloque "Avatar"
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>(AVATAR_PRESETS[0].id);
    const [avatarDetails, setAvatarDetails] = useState('');

    // 3. Estados del bloque "Escena & Cámara"
    const [location, setLocation] = useState('No especificar');
    const [lighting, setLighting] = useState('No especificar');
    const [shotType, setShotType] = useState('No especificar');
    const [pace, setPace] = useState('No especificar');

    // 4. Estados del bloque "Mensaje"
    const [message, setMessage] = useState('');

    // 5. Estados del bloque "Audio & Idioma"
    const [language, setLanguage] = useState('');
    const [accent, setAccent] = useState('');

    // Estados de control
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

    const buildPrompt = () => {
        const parts = [];
        if (shotType !== 'No especificar') parts.push(`${shotType} shot`);
        if (pace !== 'No especificar') parts.push(`with ${pace.toLowerCase()} edit`);

        const avatar = AVATAR_PRESETS.find(a => a.id === selectedAvatarId);
        let avatarDesc = avatar ? avatar.prompt : 'A person';

        if (avatarDetails) avatarDesc += `, ${avatarDetails}`;
        parts.push(avatarDesc);

        let sceneDesc = '';
        if (location !== 'No especificar') sceneDesc += `in ${location.toLowerCase()}`;
        if (lighting !== 'No especificar') sceneDesc += ` with ${lighting.toLowerCase()} light`;
        if (sceneDesc) parts.push(sceneDesc);

        parts.push(`using ${productDesc || 'a product'}. Talking to camera.`);
        if (message) parts.push(`Saying: "${message}"`);
        if (language) parts.push(`Language: ${language}${accent ? ` (${accent})` : ''}.`);

        parts.push("UGC style, authentic, 4k, realistic.");
        return parts.join('. ');
    };

    const handleGenerate = async () => {
        if (!imageFile || !message) return;
        const generatedPrompt = buildPrompt();
        setLoading(true);
        setVideoUrl(null);
        try {
            const fileName = `${Math.random()}.${imageFile.name.split('.').pop()}`;
            const filePath = `product-uploads/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, imageFile);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);

            setStatus('Produciendo...');
            const id = await generateVideo({
                image: publicUrl,
                prompt: generatedPrompt,
                duration: duration,
                size: format
            });

            const finalVideo = await waitForVideo(id, (s) => {
                if (s === 'processing') setStatus('Renderizando...');
                if (s === 'completed' || s === 'succeeded') setStatus('¡Listo!');
            });

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('projects').insert({
                    user_id: user.id,
                    name: `UGC - ${productDesc || 'Anuncio'}`,
                    video_url: finalVideo,
                    status: 'Ready',
                    settings: {
                        prompt: generatedPrompt,
                        original_message: message,
                        duration,
                        size: format,
                        avatar: { selectedAvatarId, extraDetails: avatarDetails },
                        scene: { location, lighting, shotType, pace }
                    }
                });
            }
            setVideoUrl(finalVideo);
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // UI Helper: Segmented Control
    const Segmented = ({ options, value, onChange }: any) => (
        <div className={styles.segmentedControl}>
            {options.map((opt: any) => (
                <button
                    key={opt.val}
                    className={`${styles.segment} ${value === opt.val ? styles.segmentActive : ''}`}
                    onClick={() => onChange(opt.val)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );

    // UI Helper: Pill Selector (Chips)
    const PillSelector = ({ options, value, onChange }: any) => (
        <div className={styles.pillContainer}>
            {options.map((opt: string) => (
                <button
                    key={opt}
                    className={`${styles.pillButton} ${value === opt ? styles.pillActive : ''}`}
                    onClick={() => onChange(opt)}
                >
                    {opt}
                </button>
            ))}
        </div>
    );

    return (
        <div className={styles.studioContainer}>
            <div className={styles.previewSection}>
                <GlassCard className={styles.editorCard}>
                    <AnimatePresence mode="wait">
                        {videoUrl ? (
                            <motion.video key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={videoUrl} controls autoPlay className={styles.videoPlayer} />
                        ) : loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.statusOverlay}>
                                <div className={styles.loaderRing} />
                                <p className={styles.statusText}>{status}</p>
                            </motion.div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Play size={48} opacity={0.1} />
                            </div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </div>

            <div className={styles.controlsSidebar}>
                <h2 className={styles.sidebarTitle}>Constructor</h2>

                {/* BLOQUE PRINCIPAL: PRODUCTO & CONFIG */}
                <div className={styles.iosGroup}>
                    <div className={styles.iosItem}>
                        <div className={styles.iosHeader}>
                            <Upload size={14} className={styles.iosIcon} />
                            <span className={styles.iosTitle}>Imagen del Producto</span>
                        </div>
                        <div className={styles.imageUploadCard} onClick={() => fileInputRef.current?.click()}>
                            {image ? <img src={image} className={styles.previewThumb} alt="Preview" /> : <Upload size={24} className={styles.uploadIcon} />}
                            <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                        </div>
                        <input className={styles.input} placeholder="¿Qué vendes? (Nombre)" value={productDesc} onChange={(e) => setProductDesc(e.target.value)} />
                    </div>

                    <div className={styles.iosItem}>
                        <div className={styles.iosHeader}>
                            <Maximize size={14} className={styles.iosIcon} />
                            <span className={styles.iosTitle}>Formato de Video</span>
                        </div>
                        <Segmented
                            options={[{ label: '9:16 (TikTok)', val: '720*1280' }, { label: '16:9 (YouTube)', val: '1280*720' }]}
                            value={format}
                            onChange={setFormat}
                        />
                    </div>

                    <div className={styles.iosItem}>
                        <div className={styles.iosHeader}>
                            <Clock size={14} className={styles.iosIcon} />
                            <span className={styles.iosTitle}>Duración</span>
                        </div>
                        <Segmented
                            options={[{ label: '10 Segundos', val: 10 }, { label: '15 Segundos', val: 15 }]}
                            value={duration}
                            onChange={setDuration}
                        />
                    </div>
                </div>

                {/* BLOQUE MENSAJE */}
                <div className={styles.iosGroup}>
                    <div className={styles.iosItem}>
                        <div className={styles.iosHeader}>
                            <MessageSquare size={14} className={styles.iosIcon} />
                            <span className={styles.iosTitle}>Mensaje del anuncio</span>
                        </div>
                        <textarea
                            className={styles.textarea}
                            placeholder="Escribe el guion aquí..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>

                {/* BOTÓN AVANZADO */}
                <button className={styles.advancedToggle} onClick={() => setShowAdvanced(!showAdvanced)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Settings2 size={18} />
                        <span>Opciones de producción</span>
                    </div>
                    <ChevronDown size={18} className={`${styles.chevron} ${showAdvanced ? styles.rotated : ''}`} />
                </button>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.advancedContainer}>
                            <div className={styles.iosGroup}>
                                <div className={styles.iosItem}>
                                    <div className={styles.iosHeader}><User size={14} /><span className={styles.iosTitle}>Elegir Avatar AI</span></div>
                                    <div className={styles.avatarScroll}>
                                        {AVATAR_PRESETS.map((avatar) => (
                                            <div
                                                key={avatar.id}
                                                className={`${styles.avatarCard} ${selectedAvatarId === avatar.id ? styles.avatarActive : ''}`}
                                                onClick={() => setSelectedAvatarId(avatar.id)}
                                            >
                                                <div className={styles.avatarImageWrapper}>
                                                    <img src={avatar.thumb} alt={avatar.name} className={styles.avatarThumb} />
                                                    <div className={styles.avatarTag}>{avatar.tag}</div>
                                                </div>
                                                <span className={styles.avatarName}>{avatar.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: 'none', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Detalles extra (Opcional)</label>
                                        <input
                                            className={styles.input}
                                            placeholder="Ej: con anteojos, gorra roja..."
                                            value={avatarDetails}
                                            onChange={(e) => setAvatarDetails(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.iosGroup}>
                                <div className={styles.iosItem}>
                                    <div className={styles.iosHeader}><Camera size={14} /><span className={styles.iosTitle}>Escena & Cámara</span></div>
                                    <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Iluminación</label>
                                        <PillSelector options={LIGHTING_STYLES} value={lighting} onChange={setLighting} />
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Entorno</label>
                                        <PillSelector options={SCENE_LOCATIONS} value={location} onChange={setLocation} />
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Toma</label>
                                        <PillSelector options={SHOT_TYPES} value={shotType} onChange={setShotType} />
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: 'none', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Ritmo de Edición</label>
                                        <PillSelector options={EDITING_PACE} value={pace} onChange={setPace} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.footer}>
                    <Button className={styles.createBtn} onClick={handleGenerate} loading={loading} disabled={!imageFile || !message}>
                        Crear anuncio
                    </Button>
                    <p className={styles.subtext}>Consume créditos</p>
                </div>
            </div>
        </div>
    );
}
