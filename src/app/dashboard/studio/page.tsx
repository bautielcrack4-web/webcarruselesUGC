'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Upload, Video, Sparkles, ChevronDown, ChevronUp, Zap, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { generateVideo, waitForVideo } from '@/lib/atlas-api';
import { supabase } from '@/lib/supabase';
import styles from './studio-cards.module.css';

// Curated HeyGen Voices
const VOICES = [
    { id: '2d2df894c7b848038b39a3f295b92271', name: 'Spanish - Antonia (Natural)', lang: 'es' },
    { id: 'f0028a3885d5494294b4b0e3860bb116', name: 'Spanish - Álvaro (Friendly)', lang: 'es' },
    { id: '24cc9ad147f14147814b301710927dfa', name: 'English - Matthew (Business)', lang: 'en' },
    { id: '73981882d9694f488ee279b940e4fbc1', name: 'English - Sarah (Elegant)', lang: 'en' },
];

export default function StudioPage() {
    // UI State
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Core State
    const [format, setFormat] = useState<'720*1280' | '1280*720'>('720*1280');
    const [duration, setDuration] = useState<10 | 15>(10);
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productDesc, setProductDesc] = useState('');
    const [message, setMessage] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);

    // System State
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Initializing AI...');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Cycling Loading Messages
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            let i = 0;
            setLoadingMessage(LOADING_MESSAGES[0]);
            interval = setInterval(() => {
                i++;
                setLoadingMessage(LOADING_MESSAGES[i % LOADING_MESSAGES.length]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
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

    const handleGenerate = async () => {
        if (!imageFile || !message) {
            alert("Missing image or prompt");
            return;
        }

        try {
            setLoading(true);
            setVideoUrl(null);

            // Upload Logic
            let publicUrl = "";

            if (imageFile instanceof File) {
                const fileName = `${Math.random()}.${imageFile.name.split('.').pop()}`;
                const filePath = `product-uploads/${fileName}`;

                const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, imageFile);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
                publicUrl = data.publicUrl;
            } else {
                publicUrl = imageFile as string;
            }

            const fullPrompt = `UGC video of a ${gender} ${age} holding the product. ${location} setting. Talking to camera saying: "${message}". Product: ${productDesc}. Authentic, 4k.`;

            const id = await generateVideo({
                image: publicUrl,
                prompt: fullPrompt,
                duration: duration,
                size: format,
                // @ts-ignore - Adding message for HeyGen
                message: message
            });

            const finalVideo = await waitForVideo(id);

            setVideoUrl(finalVideo);

            // PERSISTENCE: Save to History (projects table)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('projects').insert({
                    user_id: user.id,
                    name: productDesc || message.slice(0, 30) || `Gen ${new Date().toLocaleTimeString()}`,
                    video_url: finalVideo,
                    // 'created_at' is mostly default NOW() in schema
                });

                // Refresh credits
                const { data } = await supabase.from('user_subscriptions').select('credits_remaining').eq('user_id', user.id).single();
                if (data) setUserCredits(data.credits_remaining);
            }

        } catch (err: any) {
            console.error(err);
            alert(`Generation Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const currentCost = duration === 15 ? 45 : 30;
    const canGenerate = userCredits !== null && userCredits >= currentCost;

    return (
        <div className={styles.container}>
            {/* LEFT PANEL: CANVAS */}
            <div className={styles.canvasArea}>
                <div className={styles.canvasCard}>
                    <AnimatePresence mode="wait">
                        {videoUrl ? (
                            <motion.video
                                key="video"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={videoUrl}
                                controls
                                autoPlay
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        ) : loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.emptyState}
                            >
                                <div className={styles.loadingContainer}>
                                    <div className={styles.loadingOrb}>
                                        <Sparkles size={40} className={styles.pulsingIcon} />
                                    </div>
                                    <h3 className={styles.loadingTitle}>Creating Magic</h3>
                                    <p className={styles.loadingValid}>{loadingMessage}</p>
                                    <div className={styles.progressBar}>
                                        <motion.div
                                            className={styles.progressFill}
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 40, ease: "linear" }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <Video size={32} />
                                </div>
                                <h3 className={styles.emptyTitle}>
                                    Upload an image and write a message.<br />
                                    We'll do the rest.
                                </h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT PANEL: CARD STACK */}
            <div className={styles.stackPanel}>
                <h1 className={styles.panelTitle}>Create new ad</h1>

                {/* CARD 1: PRODUCT */}
                <motion.div className={styles.card} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <div className={styles.cardTitle}><ImageIcon size={14} /> Your Product</div>

                    <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                        {image ? (
                            <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product" />
                        ) : (
                            <div className={styles.uploadPlaceholder}>
                                <Upload size={32} />
                                <span className={styles.uploadLabel}>Upload product image</span>
                            </div>
                        )}
                        <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                    </div>

                    <input
                        className={styles.productInput}
                        placeholder="What are you selling? (e.g. Nike Sneakers)"
                        value={productDesc}
                        onChange={(e) => setProductDesc(e.target.value)}
                    />
                </motion.div>

                {/* CARD 2: FORMAT */}
                <motion.div className={styles.card} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <div className={styles.cardTitle}><Zap size={14} /> Format & Length</div>

                    {/* Ratio Pills */}
                    <div className={styles.pillGrid} style={{ marginBottom: 16 }}>
                        <button
                            className={`${styles.pillButton} ${format === '720*1280' ? styles.pillActive : ''}`}
                            onClick={() => setFormat('720*1280')}
                        >
                            <span>9:16</span>
                            <span className={styles.subLabel}>TikTok / Reels</span>
                        </button>
                        <button
                            className={`${styles.pillButton} ${format === '1280*720' ? styles.pillActive : ''}`}
                            onClick={() => setFormat('1280*720')}
                        >
                            <span>16:9</span>
                            <span className={styles.subLabel}>YouTube</span>
                        </button>
                    </div>

                    {/* Duration Pills */}
                    <div className={styles.pillGrid} style={{ marginBottom: 0 }}>
                        <button
                            className={`${styles.pillButton} ${duration === 10 ? styles.pillActive : ''}`}
                            onClick={() => setDuration(10)}
                        >
                            <span>10s</span>
                            <span className={styles.subLabel}>30 credits</span>
                        </button>
                        <button
                            className={`${styles.pillButton} ${duration === 15 ? styles.pillActive : ''}`}
                            onClick={() => setDuration(15)}
                        >
                            <span>15s</span>
                            <span className={styles.subLabel}>45 credits</span>
                        </button>
                    </div>
                </motion.div>

                {/* CARD 3: MESSAGE */}
                <motion.div className={styles.card} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <div className={styles.cardTitle}><Sparkles size={14} /> Message</div>

                    <textarea
                        className={styles.messageInput}
                        placeholder="Since I started using this product, my sales doubled. It's incredible how easy it is to use..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className={styles.helperText}>
                        <Sparkles size={12} color="#8b5cf6" />
                        Don't worry if it's not perfect. The AI will optimize it.
                    </div>
                </motion.div>

                {/* CARD 4: ADVANCED (Collapsed) */}
                <motion.div className={styles.card} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <button className={styles.advancedToggle} onClick={() => setShowAdvanced(!showAdvanced)}>
                        <span>Advanced Options</span>
                        {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={styles.advancedContent}
                            >
                                <div className={styles.advancedSection}>
                                    <h4 className={styles.sectionTitle}>AI Voice Selection</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 16 }}>
                                        Choose the personality and language for your AI avatar.
                                    </p>

                                    <div className={styles.optionGroup}>
                                        <div className={styles.tagsContainer} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {VOICES.map(voice => (
                                                <button
                                                    key={voice.id}
                                                    className={`${styles.tag} ${selectedVoice === voice.id ? styles.tagActive : ''}`}
                                                    onClick={() => setSelectedVoice(voice.id)}
                                                    style={{ justifyContent: 'space-between', padding: '12px 16px', width: '100%' }}
                                                >
                                                    <span>{voice.name}</span>
                                                    <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>{voice.lang.toUpperCase()}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* STICKY FOOTER - CONVERSION OPTIMIZED */}
                <div className={styles.stickyFooter}>
                    <Button
                        className={styles.generateBtn}
                        disabled={loading}
                        loading={loading}
                        onClick={() => {
                            if (!canGenerate) {
                                router.push('/dashboard/billing');
                                return;
                            }
                            handleGenerate();
                        }}
                    >
                        {loading ? 'Creating magic...' : (canGenerate ? 'Generate ad' : 'Unlock ad')}
                        {!loading && <Sparkles size={18} fill={canGenerate ? "black" : "currentColor"} />}
                    </Button>

                    <div className={styles.costDisplay}>
                        Cost: {currentCost} credits
                        {!canGenerate && (
                            <span className={styles.insufficientFunds}>
                                • You need more credits
                            </span>
                        )}
                    </div>
                </div>

                {/* No DEBUG CONSOLE here */}
            </div>
        </div>
    );
}
