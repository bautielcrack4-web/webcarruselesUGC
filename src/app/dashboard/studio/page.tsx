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
const AVATAR_GENDERS = ['Mujer', 'Hombre', 'No especificar'];
const AVATAR_AGES = ['Joven', 'Adulto', 'Adulto+', 'No especificar'];
const AVATAR_STYLES = ['Natural', 'Fitness', 'Lifestyle', 'Elegante', 'No especificar'];
const AVATAR_CLOTHING = ['Casual', 'Deportivo', 'Oficina', 'Formal', 'No especificar'];
const AVATAR_MOODS = ['Entusiasta', 'Profesional', 'Cercano', 'Enérgico', 'No especificar'];

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
    const [gender, setGender] = useState('No especificar');
    const [age, setAge] = useState('No especificar');
    const [avatarStyle, setAvatarStyle] = useState('No especificar');
    const [clothing, setClothing] = useState('No especificar');
    const [mood, setMood] = useState('No especificar');
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

    // 6. Estado de Créditos
    const [userCredits, setUserCredits] = useState<number | null>(null);

    // Estados de control
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('user_subscriptions')
                    .select('credits_remaining')
                    .eq('user_id', user.id)
                    .single();
                if (data) setUserCredits(data.credits_remaining);
            }
        };
        fetchCredits();
    }, []);

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

        let avatarDesc = 'A person';
        if (gender !== 'No especificar') avatarDesc = `A ${gender.toLowerCase()}`;
        if (age !== 'No especificar') avatarDesc += ` ${age.toLowerCase()}`;
        if (avatarStyle !== 'No especificar') avatarDesc += ` ${avatarStyle.toLowerCase()} style`;
        if (clothing !== 'No especificar') avatarDesc += ` wearing ${clothing.toLowerCase()}`;
        if (mood !== 'No especificar') avatarDesc += ` ${mood.toLowerCase()}`;

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
                        avatar: { gender, age, style: avatarStyle, clothing, mood },
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
                            <div className={styles.guidedState}>
                                <div className={styles.guidedIconBg}>
                                    <Video size={32} color="white" opacity={0.8} />
                                </div>
                                <h3 className={styles.guidedTitle}>Subí una imagen y escribí el mensaje.</h3>
                                <p className={styles.guidedSubtitle}>Nosotros hacemos el resto.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </div>

            <div className={styles.controlsSidebar}>
                <h2 className={styles.sidebarTitle}>Crear nuevo anuncio</h2>

                {/* PASO 1: PRODUCTO */}
                <div className={styles.stepContainer}>
                    <div className={styles.stepHeader}>
                        <div className={styles.stepNumber}>1</div>
                        <span className={styles.stepTitle}>Tu Producto</span>
                    </div>
                    <div className={styles.iosGroup}>
                        <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16 }}>
                            <div className={styles.imageUploadCard} onClick={() => fileInputRef.current?.click()}>
                                {image ? <img src={image} className={styles.previewThumb} alt="Preview" /> : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <Upload size={24} className={styles.uploadIcon} />
                                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Subir foto</span>
                                    </div>
                                )}
                                <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                            </div>
                        </div>
                        <div className={styles.iosItem} style={{ borderBottom: 'none', paddingTop: 12 }}>
                            <input className={styles.input} placeholder="¿Qué vendes? (Ej: Zapatillas Nike)" value={productDesc} onChange={(e) => setProductDesc(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* PASO 2: FORMATO */}
                <div className={styles.stepContainer}>
                    <div className={styles.stepHeader}>
                        <div className={styles.stepNumber}>2</div>
                        <span className={styles.stepTitle}>Formato</span>
                    </div>
                    <div className={styles.iosGroup}>
                        <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
                            <div className={styles.iosHeaderSmall}>Relación de aspecto</div>
                            <Segmented
                                options={[{ label: '9:16 (TikTok)', val: '720*1280' }, { label: '16:9 (YouTube)', val: '1280*720' }]}
                                value={format}
                                onChange={setFormat}
                            />
                        </div>
                        <div className={styles.iosItem} style={{ borderBottom: 'none', padding: '12px 0' }}>
                            <div className={styles.iosHeaderSmall}>Duración (Créditos)</div>
                            <Segmented
                                options={[{ label: '10s (30c)', val: 10 }, { label: '15s (45c)', val: 15 }]}
                                value={duration}
                                onChange={setDuration}
                            />
                        </div>
                    </div>
                </div>

                {/* PASO 3: MENSAJE */}
                <div className={styles.stepContainer}>
                    <div className={styles.stepHeader}>
                        <div className={styles.stepNumber}>3</div>
                        <span className={styles.stepTitle}>Mensaje</span>
                    </div>
                    <div className={styles.iosGroup}>
                        <div className={styles.iosItem}>
                            <textarea
                                className={styles.textarea}
                                placeholder="Ej: 'Desde que uso este producto, mis ventas subieron el doble. Es increíble lo fácil que es de usar...'"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <p className={styles.helperText}>No hace falta que sea perfecto. La IA lo optimiza.</p>
                        </div>
                    </div>
                </div>

                {/* PASO 4: PRODUCCIÓN (Colapsable) */}
                <button className={styles.advancedToggle} onClick={() => setShowAdvanced(!showAdvanced)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={styles.stepNumber} style={{ background: showAdvanced ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}>4</div>
                        <span style={{ fontWeight: 600 }}>Opciones de producción</span>
                    </div>
                    <ChevronDown size={18} className={`${styles.chevron} ${showAdvanced ? styles.rotated : ''}`} />
                </button>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.advancedContainer}>
                            <div className={styles.iosGroup} style={{ marginTop: 12 }}>
                                <div className={styles.iosItem}>
                                    <div className={styles.iosHeader}><User size={14} /><span className={styles.iosTitle}>Personalizar Avatar</span></div>
                                    <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Género</label>
                                        <PillSelector options={AVATAR_GENDERS} value={gender} onChange={setGender} />
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Edad</label>
                                        <PillSelector options={AVATAR_AGES} value={age} onChange={setAge} />
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Mood / Actitud</label>
                                        <PillSelector options={AVATAR_MOODS} value={mood} onChange={setMood} />
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: 'none', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Ropa</label>
                                        <PillSelector options={AVATAR_CLOTHING} value={clothing} onChange={setClothing} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.iosGroup} style={{ marginTop: 16 }}>
                                <div className={styles.iosItem}>
                                    <div className={styles.iosHeader}><Camera size={14} /><span className={styles.iosTitle}>Escena & Cámara</span></div>
                                    <div className={styles.iosItem} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Entorno</label>
                                        <PillSelector options={SCENE_LOCATIONS} value={location} onChange={setLocation} />
                                    </div>
                                    <div className={styles.iosItem} style={{ borderBottom: 'none', padding: '10px 0' }}>
                                        <label className={styles.iosTitle} style={{ fontSize: '0.7rem', marginBottom: 8, display: 'block' }}>Ritmo</label>
                                        <PillSelector options={EDITING_PACE} value={pace} onChange={setPace} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.footer}>
                    {/* Cost displayed prominently before button */}
                    <div className={styles.costBadge}>
                        <div className={styles.costLabel}>Costo del anuncio</div>
                        <div className={styles.costValue}>{duration === 15 ? 45 : 30} créditos</div>
                    </div>

                    {userCredits !== null && userCredits < (duration === 15 ? 45 : 30) ? (
                        <Button
                            className={styles.createBtn}
                            onClick={() => window.location.href = '/dashboard/billing'}
                            disabled={false}
                            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', border: 'none', color: 'white', height: '56px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
                                <span>Desbloquear ahora</span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400 }}>Faltan {(duration === 15 ? 45 : 30) - userCredits} créditos</span>
                            </div>
                        </Button>
                    ) : (
                        <Button
                            className={styles.createBtn}
                            onClick={handleGenerate}
                            loading={loading}
                            disabled={!imageFile || !message}
                            style={{ height: '56px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
                                <span>Crear anuncio</span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 400 }}>Listo para generar</span>
                            </div>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
