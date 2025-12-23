'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Video, Wand2, Monitor, Smartphone,
    X, Play, User, Camera, MessageSquare, Music, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { generateVideo, waitForVideo } from '@/lib/atlas-api';
import { supabase } from '@/lib/supabase';
import styles from './studio.module.css';

// Opciones de configuración
const AVATAR_GENDERS = ['Mujer', 'Hombre', 'No especificar'];
const AVATAR_AGES = ['Joven (18–25)', 'Adulto (25–35)', 'Adulto+ (35–50)', 'No especificar'];
const AVATAR_STYLES = ['Natural', 'Fitness', 'Lifestyle', 'Elegante', 'No especificar'];
const SCENE_LOCATIONS = ['Interior (Hogar/Estudio)', 'Exterior', 'No especificar'];
const SHOT_TYPES = ['Selfie', 'Cámara fija', 'Movimiento suave', 'No especificar'];
const VIDEO_STYLES = ['Una sola toma', 'Varias tomas (Dinámico)', 'No especificar'];

export default function StudioPage() {
    // 1. Estados del bloque "Producto"
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productDesc, setProductDesc] = useState('');

    // 2. Estados del bloque "Avatar"
    const [gender, setGender] = useState('No especificar');
    const [age, setAge] = useState('No especificar');
    const [avatarStyle, setAvatarStyle] = useState('No especificar');
    const [avatarDetails, setAvatarDetails] = useState('');

    // 3. Estados del bloque "Escena & Cámara"
    const [location, setLocation] = useState('No especificar');
    const [shotType, setShotType] = useState('No especificar');
    const [videoStyle, setVideoStyle] = useState('No especificar');
    const [format, setFormat] = useState<'720*1280' | '1280*720'>('720*1280');

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

        // Contexto de cámara y toma
        if (shotType !== 'No especificar') parts.push(`${shotType} shot`);
        if (videoStyle !== 'No especificar') parts.push(`in ${videoStyle.toLowerCase()} style`);

        // Descripción del avatar
        let avatarDesc = 'A person';
        if (gender !== 'No especificar') avatarDesc = `A ${gender.toLowerCase()}`;
        if (age !== 'No especificar') avatarDesc += ` around ${age.split(' ')[0].toLowerCase()}`;
        if (avatarStyle !== 'No especificar') avatarDesc += ` with a ${avatarStyle.toLowerCase()} look`;
        if (avatarDetails) avatarDesc += `, ${avatarDetails}`;
        parts.push(avatarDesc);

        // Locación
        if (location !== 'No especificar') parts.push(`is in an ${location.split(' ')[0].toLowerCase()} environment`);

        // Producto y Mensaje
        parts.push(`using a ${productDesc || 'product'}. The person is talking to the camera.`);
        if (message) parts.push(`The person says: "${message}"`);

        // Idioma (si se especifica)
        if (language) parts.push(`The language spoken is ${language}${accent ? ` with a ${accent} accent` : ''}.`);

        parts.push("High quality UGC video, authentic marketing style, realistic lightning.");

        return parts.join('. ');
    };

    const handleGenerate = async () => {
        if (!imageFile || !message) return;

        const generatedPrompt = buildPrompt();
        setLoading(true);
        setStatus('Preparando producción...');
        setVideoUrl(null);

        try {
            // 1. Subir imagen a Supabase Storage
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `product-uploads/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            setStatus('Analizando producto...');

            // 2. Iniciar generación
            const id = await generateVideo({
                image: publicUrl,
                prompt: generatedPrompt,
                duration: 10,
                size: format
            });

            // 3. Esperar resultado
            const finalVideo = await waitForVideo(id, (s) => {
                if (s === 'processing') setStatus('Renderizando anuncio con IA...');
                if (s === 'completed' || s === 'succeeded') setStatus('¡Anuncio listo!');
            });

            // 4. Guardar proyecto
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
                        avatar: { gender, age, style: avatarStyle },
                        scene: { location, shotType }
                    }
                });
            }

            setVideoUrl(finalVideo);
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message || 'Falló la creación'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.studioContainer}>
            {/* PANEL IZQUIERDO: PREVIEW */}
            <div className={styles.previewSection}>
                <GlassCard className={styles.editorCard}>
                    <AnimatePresence mode="wait">
                        {videoUrl ? (
                            <motion.video
                                key="video"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={videoUrl}
                                controls
                                autoPlay
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
                                <p className={styles.statusText}>{status}</p>
                            </motion.div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.previewPlaceholder}>
                                    <Video size={48} className={styles.emptyIcon} />
                                    <p>Tu video aparecerá aquí</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </div>

            {/* PANEL DERECHO: CONSTRUCTOR */}
            <div className={styles.controlsSidebar}>
                <h2 className={styles.sidebarTitle}>Configura tu producción</h2>

                {/* BLOQUE 1: PRODUCTO */}
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        <div className={styles.blockNumber}>1</div>
                        <span>Producto</span>
                        <span className={styles.requiredLabel}>(Obligatorio)</span>
                    </div>
                    <div className={styles.blockContent}>
                        <div
                            className={styles.imageUpload}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {image ? (
                                <img src={image} className={styles.previewThumb} alt="Producto" />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <Upload size={20} />
                                    <span>Subir Imagen</span>
                                </div>
                            )}
                            <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                        </div>
                        <input
                            className={styles.input}
                            placeholder="Descripción breve (ej: Suplemento natural)"
                            value={productDesc}
                            onChange={(e) => setProductDesc(e.target.value)}
                        />
                    </div>
                </div>

                {/* BLOQUE 2: AVATAR */}
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        <div className={styles.blockNumber}>2</div>
                        <span>Avatar</span>
                    </div>
                    <div className={styles.blockContent}>
                        <div className={styles.selectorGroup}>
                            <label>Género</label>
                            <select className={styles.selectBox} value={gender} onChange={(e) => setGender(e.target.value)}>
                                {AVATAR_GENDERS.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className={styles.selectorGroup}>
                            <label>Edad aparente</label>
                            <select value={age} onChange={(e) => setAge(e.target.value)}>
                                {AVATAR_AGES.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className={styles.selectorGroup}>
                            <label>Estilo</label>
                            <select value={avatarStyle} onChange={(e) => setAvatarStyle(e.target.value)}>
                                {AVATAR_STYLES.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <textarea
                            className={styles.miniTextarea}
                            placeholder="Detalles (ojos claros, look latino...)"
                            value={avatarDetails}
                            onChange={(e) => setAvatarDetails(e.target.value)}
                        />
                    </div>
                </div>

                {/* BLOQUE 3: ESCENA & CÁMARA */}
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        <div className={styles.blockNumber}>3</div>
                        <span>Escena & Cámara</span>
                    </div>
                    <div className={styles.blockContent}>
                        <div className={styles.selectorGroup}>
                            <label>Escena</label>
                            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                                {SCENE_LOCATIONS.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className={styles.selectorGroup}>
                            <label>Tipo de toma</label>
                            <select value={shotType} onChange={(e) => setShotType(e.target.value)}>
                                {SHOT_TYPES.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className={styles.selectorGroup}>
                            <label>Estilo de video</label>
                            <select value={videoStyle} onChange={(e) => setVideoStyle(e.target.value)}>
                                {VIDEO_STYLES.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className={styles.formatGroup}>
                            <button
                                className={`${styles.formatBtn} ${format === '720*1280' ? styles.active : ''}`}
                                onClick={() => setFormat('720*1280')}
                            >
                                <Smartphone size={14} /> 9:16
                            </button>
                            <button
                                className={`${styles.formatBtn} ${format === '1280*720' ? styles.active : ''}`}
                                onClick={() => setFormat('1280*720')}
                            >
                                <Monitor size={14} /> 16:9
                            </button>
                        </div>
                    </div>
                </div>

                {/* BLOQUE 4: MENSAJE */}
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        <div className={styles.blockNumber}>4</div>
                        <span>Mensaje del anuncio</span>
                        <span className={styles.requiredLabel}>(Obligatorio)</span>
                    </div>
                    <div className={styles.blockContent}>
                        <textarea
                            className={styles.textarea}
                            placeholder="¿Qué tiene que decir el anuncio? Ej: Este producto cambió mi rutina..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>

                {/* BLOQUE 5: IDIOMA (OPCIONAL) */}
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        <div className={styles.blockNumber}>5</div>
                        <span>Idioma & Acento</span>
                        <span className={styles.optionalLabel}>Opcional</span>
                    </div>
                    <div className={styles.blockContent}>
                        <div className={styles.inlineInputs}>
                            <input
                                className={styles.input}
                                placeholder="Idioma (Español...)"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            />
                            <input
                                className={styles.input}
                                placeholder="Acento (Neutro...)"
                                value={accent}
                                onChange={(e) => setAccent(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button
                        className={styles.createBtn}
                        onClick={handleGenerate}
                        loading={loading}
                        disabled={!imageFile || !message}
                    >
                        Crear anuncio
                    </Button>
                    <p className={styles.subtext}>Consume créditos</p>
                </div>
            </div>
        </div>
    );
}
