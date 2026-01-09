'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Upload, Video, Sparkles, ChevronDown, ChevronUp, Zap, Image as ImageIcon, Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { generateVideo, waitForVideo } from '@/lib/atlas-api';
import { supabase } from '@/lib/supabase';
import { STOCK_AVATARS } from '@/lib/heygen';
import styles from './studio-cards.module.css';

// Curated HeyGen Voices - Premium Multi-Language Library
const VOICES = [
    // Spanish
    { id: '2d5b8583f3c1457fa5e844de4f03b03e', name: 'Spanish - Elena (Natural)', lang: 'es' },
    { id: '1bd001e7e50f421d891986aad5c05f49', name: 'Spanish - Pablo (Energetic)', lang: 'es' },
    { id: 'b69a3a9e8eca4abab1a0cfa06f94d37b', name: 'Spanish - Camila (Warm)', lang: 'es' },
    { id: 'c0a0a8c5b97f4c0dbf52c8cc3ed9c9d5', name: 'Spanish - Diego (Professional)', lang: 'es' },
    // English
    { id: '1985a8e6dbea4d4fab1f920f75af4e01', name: 'English - Aria (Confident)', lang: 'en' },
    { id: 'b7c4c7e7987c43d78a5c1e8c6e1c8d5a', name: 'English - Tony (Casual)', lang: 'en' },
    { id: '077ab11b14f04ce0b49b2f203c7f4a7a', name: 'English - Jessica (Friendly)', lang: 'en' },
    { id: 'd9a8c8e7f87b4d5b82e7a1f5d8b3c2a4', name: 'English - Marcus (Deep)', lang: 'en' },
    // Portuguese
    { id: '573e3b50c59e49b5bc4ef3d59a63f81b', name: 'Portuguese - Francisca (Expressive)', lang: 'pt' },
    { id: 'a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2', name: 'Portuguese - Duarte (Narrator)', lang: 'pt' },
    // French
    { id: '82bc1e69b8564d7bb5b8d8c48e0d0a4f', name: 'French - Denise (Elegant)', lang: 'fr' },
    { id: 'f4e6d8c0b2a4f6e8d0c2b4a6f8e0d2c4', name: 'French - Henri (Charming)', lang: 'fr' },
    // Italian
    { id: '4d5e6f70819243b5acd1e2f3a4b5c6d7', name: 'Italian - Isabella (Melodic)', lang: 'it' },
    { id: 'a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8', name: 'Italian - Marco (Smooth)', lang: 'it' },
    // German
    { id: '5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', name: 'German - Katja (Clear)', lang: 'de' },
    { id: 'c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4', name: 'German - Stefan (Authoritative)', lang: 'de' },
];

// Plan Limits Configuration
const PLAN_LIMITS = {
    starter: { maxDuration: 15, maxChars: 150, durations: [15] },
    pro: { maxDuration: 30, maxChars: 300, durations: [15, 30] },
    business: { maxDuration: 60, maxChars: 600, durations: [15, 30, 60] },
    free: { maxDuration: 15, maxChars: 150, durations: [15] } // Default for users without plan
};

// Loading Messages for Animation
const LOADING_MESSAGES = [
    "Analyzing your product...",
    "Writing the perfect script...",
    "Hiring the AI actor...",
    "Setting up the lighting...",
    "Recording voiceover...",
    "Editing final cut...",
    "Polishing pixels..."
];

export default function StudioPage() {
    // UI State
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Core State
    const [format, setFormat] = useState<'720*1280' | '1280*720'>('720*1280');
    const [duration, setDuration] = useState<15 | 30 | 60>(15);
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productDesc, setProductDesc] = useState('');
    const [message, setMessage] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);

    // Avatar Mode State
    const [avatarMode, setAvatarMode] = useState<'upload' | 'stock'>('stock');
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(STOCK_AVATARS[0]?.id || null);

    // User Plan State
    const [userPlan, setUserPlan] = useState<'starter' | 'pro' | 'business' | 'free'>('free');

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
                    .select('credits_remaining, plan_id')
                    .eq('user_id', user.id)
                    .single();
                if (data) {
                    setUserCredits(data.credits_remaining);
                    setUserPlan(data.plan_id || 'free');
                }
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
        // Validation based on mode
        if (avatarMode === 'upload' && !imageFile) {
            alert("Please upload a photo with a visible face");
            return;
        }
        if (avatarMode === 'stock' && !selectedAvatar) {
            alert("Please select an avatar");
            return;
        }
        if (!message) {
            alert("Please enter a message for the avatar to say");
            return;
        }

        try {
            setLoading(true);
            setVideoUrl(null);

            let publicUrl: string | undefined = undefined;

            // Only upload if in upload mode
            if (avatarMode === 'upload' && imageFile) {
                const fileName = `${Math.random()}.${imageFile.name.split('.').pop()}`;
                const filePath = `product-uploads/${fileName}`;

                const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, imageFile);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
                publicUrl = data.publicUrl;
            }

            const fullPrompt = `UGC talking avatar video. Message: "${message}". Product: ${productDesc}. Authentic, 4k.`;

            const id = await generateVideo({
                image: avatarMode === 'upload' ? publicUrl! : '',
                prompt: fullPrompt,
                duration: duration,
                size: format,
                // @ts-ignore - Adding extras for HeyGen
                message: message,
                voice_id: selectedVoice,
                avatar_id: avatarMode === 'stock' ? selectedAvatar! : undefined
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

    const currentCost = duration === 60 ? 180 : duration === 30 ? 90 : 45;
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

                {/* CARD 1: AVATAR / PHOTO SOURCE */}
                <motion.div className={styles.card} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <div className={styles.cardTitle}><Users size={14} /> Choose Your Avatar</div>

                    {/* Mode Toggle */}
                    <div className={styles.pillGrid} style={{ marginBottom: 16 }}>
                        <button
                            className={`${styles.pillButton} ${avatarMode === 'stock' ? styles.pillActive : ''}`}
                            onClick={() => setAvatarMode('stock')}
                        >
                            <span>🎭 Stock Avatars</span>
                        </button>
                        <button
                            className={`${styles.pillButton} ${avatarMode === 'upload' ? styles.pillActive : ''}`}
                            onClick={() => setAvatarMode('upload')}
                        >
                            <span>📷 Upload Photo</span>
                        </button>
                    </div>

                    {avatarMode === 'stock' ? (
                        /* Stock Avatar Grid */
                        <div className={styles.avatarGrid}>
                            {STOCK_AVATARS.map(avatar => (
                                <div
                                    key={avatar.id}
                                    className={`${styles.avatarCard} ${selectedAvatar === avatar.id ? styles.avatarSelected : ''}`}
                                    onClick={() => setSelectedAvatar(avatar.id)}
                                >
                                    <Image
                                        src={avatar.preview}
                                        alt={avatar.name}
                                        width={200}
                                        height={300}
                                        className={styles.avatarImage}
                                        unoptimized
                                    />
                                    <span className={styles.avatarName}>{avatar.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Upload Photo Mode */
                        <>
                            <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                                {image ? (
                                    <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Your Photo" />
                                ) : (
                                    <div className={styles.uploadPlaceholder}>
                                        <Upload size={32} />
                                        <span className={styles.uploadLabel}>Upload a photo with a face</span>
                                    </div>
                                )}
                                <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                            </div>
                        </>
                    )}

                    <input
                        className={styles.productInput}
                        placeholder="What are you promoting? (e.g. Nike Sneakers)"
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

                    {/* Duration Pills - Plan-based */}
                    <div className={styles.pillGrid} style={{ marginBottom: 0, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <button
                            className={`${styles.pillButton} ${duration === 15 ? styles.pillActive : ''}`}
                            onClick={() => setDuration(15)}
                        >
                            <span>15s</span>
                            <span className={styles.subLabel}>45 credits</span>
                        </button>
                        <button
                            className={`${styles.pillButton} ${duration === 30 ? styles.pillActive : ''} ${!PLAN_LIMITS[userPlan].durations.includes(30) ? styles.pillDisabled : ''}`}
                            onClick={() => {
                                if (PLAN_LIMITS[userPlan].durations.includes(30)) {
                                    setDuration(30);
                                } else {
                                    alert(`Upgrade to Pro plan for 30s videos!`);
                                }
                            }}
                            disabled={!PLAN_LIMITS[userPlan].durations.includes(30)}
                        >
                            <span>30s</span>
                            <span className={styles.subLabel}>{PLAN_LIMITS[userPlan].durations.includes(30) ? '90 credits' : '🔒 Pro'}</span>
                        </button>
                        <button
                            className={`${styles.pillButton} ${duration === 60 ? styles.pillActive : ''} ${!PLAN_LIMITS[userPlan].durations.includes(60) ? styles.pillDisabled : ''}`}
                            onClick={() => {
                                if (PLAN_LIMITS[userPlan].durations.includes(60)) {
                                    setDuration(60);
                                } else {
                                    alert(`Upgrade to Business plan for 60s videos!`);
                                }
                            }}
                            disabled={!PLAN_LIMITS[userPlan].durations.includes(60)}
                        >
                            <span>60s</span>
                            <span className={styles.subLabel}>{PLAN_LIMITS[userPlan].durations.includes(60) ? '180 credits' : '🔒 Business'}</span>
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
                        maxLength={PLAN_LIMITS[userPlan].maxChars}
                    />

                    <div className={styles.helperText}>
                        <Sparkles size={12} color="#8b5cf6" />
                        <span style={{
                            color: message.length > PLAN_LIMITS[userPlan].maxChars * 0.9 ? '#f87171' : 'inherit'
                        }}>
                            {message.length} / {PLAN_LIMITS[userPlan].maxChars} characters
                        </span>
                    </div>

                    <div className={styles.helperText} style={{ marginTop: 4 }}>
                        💡 Keep it concise for better engagement! (~{Math.ceil(message.length / 10)}-{Math.ceil(message.length / 8)} seconds estimated)
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
