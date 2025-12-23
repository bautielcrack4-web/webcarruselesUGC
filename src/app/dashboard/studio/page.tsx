'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Video, Wand2, Monitor, Smartphone,
    X, Play, User, Camera, MessageSquare, Music, ChevronDown, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { generateVideo, waitForVideo } from '@/lib/atlas-api';
import { supabase } from '@/lib/supabase';
import styles from './studio.module.css';

// Opciones de configuración expandidas
const AVATAR_GENDERS = ['Mujer', 'Hombre', 'No especificar'];
const AVATAR_AGES = ['Joven (18–25)', 'Adulto (25–35)', 'Adulto+ (35–50)', 'No especificar'];
const AVATAR_STYLES = ['Natural', 'Fitness', 'Lifestyle', 'Elegante', 'No especificar'];
const AVATAR_CLOTHING = ['Casual', 'Deportivo', 'Oficina', 'Formal', 'No especificar'];
const AVATAR_MOODS = ['Entusiasta', 'Profesional', 'Cercano', 'Enérgico', 'No especificar'];

const SCENE_LOCATIONS = ['Interior', 'Exterior', 'No especificar'];
const SCENE_BACKGROUNDS = ['Oficina', 'Gimnasio', 'Cocina', 'Sala de estar', 'Calle', 'Naturaleza', 'No especificar'];
const LIGHTING_STYLES = ['Natural', 'Estudio', 'Neón', 'Atardecer', 'No especificar'];
const SHOT_TYPES = ['Selfie', 'Cámara fija', 'Movimiento suave', 'No especificar'];
const VIDEO_STYLES = ['Una sola toma', 'Varias tomas (Dinámico)', 'No especificar'];
const EDITING_PACE = ['Dinámico', 'Relajado', 'Cinematográfico', 'No especificar'];

export default function StudioPage() {
    // Control de interfaz
    const [showAdvanced, setShowAdvanced] = useState(false);

    // 1. Estados del bloque "Producto" (OBLIGATORIO)
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productDesc, setProductDesc] = useState('');

    // 2. Estados del bloque "Avatar" (AVANZADO)
    const [gender, setGender] = useState('No especificar');
    const [age, setAge] = useState('No especificar');
    const [avatarStyle, setAvatarStyle] = useState('No especificar');
    const [clothing, setClothing] = useState('No especificar');
    const [mood, setMood] = useState('No especificar');
    const [avatarDetails, setAvatarDetails] = useState('');

    // 3. Estados del bloque "Escena & Cámara" (AVANZADO)
    const [location, setLocation] = useState('No especificar');
    const [background, setBackground] = useState('No especificar');
    const [lighting, setLighting] = useState('No especificar');
    const [shotType, setShotType] = useState('No especificar');
    const [videoStyle, setVideoStyle] = useState('No especificar');
    const [pace, setPace] = useState('No especificar');
    const [format, setFormat] = useState<'720*1280' | '1280*720'>('720*1280');

    // 4. Estados del bloque "Mensaje" (OBLIGATORIO)
    const [message, setMessage] = useState('');

    // 5. Estados del bloque "Audio & Idioma" (AVANZADO)
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
        if (pace !== 'No especificar') parts.push(`with ${pace.toLowerCase()} editing pace`);

        // Descripción del avatar
        let avatarDesc = 'A person';
        if (gender !== 'No especificar') avatarDesc = `A ${gender.toLowerCase()}`;
        if (age !== 'No especificar') avatarDesc += ` around ${age.split(' ')[0].toLowerCase()}`;
        if (avatarStyle !== 'No especificar') avatarDesc += ` with a ${avatarStyle.toLowerCase()} look`;
        if (clothing !== 'No especificar') avatarDesc += ` wearing ${clothing.toLowerCase()} clothes`;
        if (mood !== 'No especificar') avatarDesc += ` behaving in an ${mood.toLowerCase()} way`;
        if (avatarDetails) avatarDesc += `, ${avatarDetails}`;
        parts.push(avatarDesc);

        // Locación e Iluminación
        let sceneDesc = '';
        if (location !== 'No especificar') sceneDesc += `is in an ${location.toLowerCase()} environment`;
        if (background !== 'No especificar') sceneDesc += ` specifically in a ${background.toLowerCase()}`;
        if (lighting !== 'No especificar') sceneDesc += ` with ${lighting.toLowerCase()} lighting`;
        if (sceneDesc) parts.push(sceneDesc);

        // Producto y Mensaje
        parts.push(`using a ${productDesc || 'product'}. The person is talking to the camera.`);
        if (message) parts.push(`The person says: "${message}"`);

        // Idioma (si se especifica)
        if (language) parts.push(`The language spoken is ${language}${accent ? ` with a ${accent} accent` : ''}.`);

        parts.push("High quality UGC video, authentic marketing style, realistic lightning, 4k resolution.");

        return parts.join('. ');
    };

    const handleGenerate = async () => {
        if (!imageFile || !message) return;

        const generatedPrompt = buildPrompt();
        setLoading(true);
        setStatus('Preparando producción...');
        setVideoUrl(null);

        try {
            // 1. Subir imagen
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
                        avatar: { gender, age, style: avatarStyle, clothing, mood },
                        scene: { location, background, lighting, shotType, pace }
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
                <h2 className={styles.sidebarTitle}>Constructor de Anuncios</h2>

                {/* BLOQUE 1: PRODUCTO (SIEMPRE VISIBLE) */}
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        <div className={styles.blockNumber}>1</div>
                        <span>Imagen del Producto</span>
                        <span className={styles.requiredLabel}>Obligatorio</span>
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
                            placeholder="Nombre del producto (ej: Suplemento Natural)"
                            value={productDesc}
                            onChange={(e) => setProductDesc(e.target.value)}
                        />
                    </div>
                </div>

                {/* BLOQUE 4: MENSAJE (SIEMPRE VISIBLE) */}
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        <div className={styles.blockNumber}>2</div>
                        <span>Mensaje del anuncio</span>
                        <span className={styles.requiredLabel}>Obligatorio</span>
                    </div>
                    <div className={styles.blockContent}>
                        <textarea
                            className={styles.textarea}
                            placeholder="¿Qué tiene que decir el avatar? Ej: Este producto cambió mi vida..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>

                {/* TOGGLE OPCIONES AVANZADAS */}
                <button
                    className={styles.advancedToggle}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    <Settings2 size={16} />
                    <span>Opciones de producción avanzadas</span>
                    <ChevronDown size={16} className={`${styles.chevron} ${showAdvanced ? styles.rotated : ''}`} />
                </button>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={styles.advancedContainer}
                        >
                            {/* BLOQUE 2: AVATAR */}
                            <div className={styles.block}>
                                <div className={styles.blockHeader}>
                                    <User size={16} color="var(--accent-primary)" />
                                    <span>Personalizar Avatar</span>
                                </div>
                                <div className={styles.blockContent}>
                                    <div className={styles.grid2}>
                                        <div className={styles.selectorGroup}>
                                            <label>Género</label>
                                            <select className={styles.selectBox} value={gender} onChange={(e) => setGender(e.target.value)}>
                                                {AVATAR_GENDERS.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.selectorGroup}>
                                            <label>Edad</label>
                                            <select className={styles.selectBox} value={age} onChange={(e) => setAge(e.target.value)}>
                                                {AVATAR_AGES.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles.grid2}>
                                        <div className={styles.selectorGroup}>
                                            <label>Estilo</label>
                                            <select className={styles.selectBox} value={avatarStyle} onChange={(e) => setAvatarStyle(e.target.value)}>
                                                {AVATAR_STYLES.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.selectorGroup}>
                                            <label>Ropa</label>
                                            <select className={styles.selectBox} value={clothing} onChange={(e) => setClothing(e.target.value)}>
                                                {AVATAR_CLOTHING.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles.selectorGroup}>
                                        <label>Mood / Actitud</label>
                                        <select className={styles.selectBox} value={mood} onChange={(e) => setMood(e.target.value)}>
                                            {AVATAR_MOODS.map(opt => <option key={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <textarea
                                        className={styles.miniTextarea}
                                        placeholder="Detalles extras (ojos claros, look latino...)"
                                        value={avatarDetails}
                                        onChange={(e) => setAvatarDetails(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* BLOQUE 3: ESCENA & CÁMARA */}
                            <div className={styles.block}>
                                <div className={styles.blockHeader}>
                                    <Camera size={16} color="var(--accent-primary)" />
                                    <span>Escena & Detalles Técnicos</span>
                                </div>
                                <div className={styles.blockContent}>
                                    <div className={styles.grid2}>
                                        <div className={styles.selectorGroup}>
                                            <label>Entorno</label>
                                            <select className={styles.selectBox} value={location} onChange={(e) => setLocation(e.target.value)}>
                                                {SCENE_LOCATIONS.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.selectorGroup}>
                                            <label>Fondo</label>
                                            <select className={styles.selectBox} value={background} onChange={(e) => setBackground(e.target.value)}>
                                                {SCENE_BACKGROUNDS.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles.grid2}>
                                        <div className={styles.selectorGroup}>
                                            <label>Iluminación</label>
                                            <select className={styles.selectBox} value={lighting} onChange={(e) => setLighting(e.target.value)}>
                                                {LIGHTING_STYLES.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.selectorGroup}>
                                            <label>Toma</label>
                                            <select className={styles.selectBox} value={shotType} onChange={(e) => setShotType(e.target.value)}>
                                                {SHOT_TYPES.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles.grid2}>
                                        <div className={styles.selectorGroup}>
                                            <label>Estilo</label>
                                            <select className={styles.selectBox} value={videoStyle} onChange={(e) => setVideoStyle(e.target.value)}>
                                                {VIDEO_STYLES.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.selectorGroup}>
                                            <label>Ritmo</label>
                                            <select className={styles.selectBox} value={pace} onChange={(e) => setPace(e.target.value)}>
                                                {EDITING_PACE.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        </div>
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

                            {/* BLOQUE 5: IDIOMA */}
                            <div className={styles.block}>
                                <div className={styles.blockHeader}>
                                    <MessageSquare size={16} color="var(--accent-primary)" />
                                    <span>Idioma & Acento</span>
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
                        </motion.div>
                    )}
                </AnimatePresence>

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
