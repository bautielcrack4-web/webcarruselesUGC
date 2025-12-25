'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import styles from './VideoCarousel.module.css';

const EXAMPLES = [
    {
        id: 2,
        video: '/hero-examples/video 2.mp4',
        image: '/hero-examples/imagen de video 2.jpeg',
        language: '🇲🇽 Spanish (MX)',
        prompt: "Unboxing de zapatillas urbanas, estilo dinámico y juvenil."
    },
    {
        id: 3,
        video: '/hero-examples/video 3.mp4',
        image: '/hero-examples/imagen de video 3.png',
        language: '🇮🇹 Italian',
        prompt: "Tutorial di cucina veloce con utensili moderni."
    },
    {
        id: 6,
        video: '/hero-examples/video 6.mp4',
        image: '/hero-examples/imagen video 6.png',
        language: '🇦🇷 Spanish (ARG)',
        prompt: "Review de botas de invierno, estilo porteño y auténtico."
    },
    {
        id: 4,
        video: '/hero-examples/video 4.mp4',
        image: '/hero-examples/imagen de video 4.webp',
        language: '🇩🇪 German',
        prompt: "Vorstellung eines neuen Tech-Gadgets, klar und professionell."
    },
    {
        id: 5,
        video: '/hero-examples/video 5.mp4',
        image: '/hero-examples/imagen de video 5.png',
        language: '🇫🇷 French',
        prompt: "Review élégante d'un parfum de luxe, ambiance soirée."
    },
    {
        id: 1,
        video: '/hero-examples/video 1.mp4',
        image: null,
        language: '🇺🇸 English',
        prompt: "Mobile app showcase with modern UI and smooth animations."
    },
];

export const VideoCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const next = () => setActiveIndex((prev) => (prev + 1) % EXAMPLES.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + EXAMPLES.length) % EXAMPLES.length);

    useEffect(() => {
        // Ensure ONLY the active video is playing
        videoRefs.current.forEach((video, index) => {
            if (!video) return;

            if (index === activeIndex) {
                video.muted = isMuted;
                video.play().catch(err => {
                    // If play fails with sound, try playing muted
                    if (!isMuted) {
                        video.muted = true;
                        video.play();
                    }
                });
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [activeIndex, isMuted]);

    return (
        <div className={styles.fanWrapper}>
            <div className={styles.fanContainer}>
                <AnimatePresence initial={false}>
                    {EXAMPLES.map((item, index) => {
                        // Calculate relative position to active index
                        const diff = (index - activeIndex + EXAMPLES.length) % EXAMPLES.length;

                        // Normalized relative position (-2, -1, 0, 1, 2)
                        let position = diff;
                        if (position > EXAMPLES.length / 2) position -= EXAMPLES.length;

                        const isCenter = position === 0;
                        const isVisible = Math.abs(position) <= 2;

                        if (!isVisible) return null;

                        return (
                            <motion.div
                                key={item.id}
                                className={`${styles.fanCard} ${isCenter ? styles.centerCard : ''}`}
                                initial={{ opacity: 0, scale: 0.5, x: position * 100 }}
                                animate={{
                                    opacity: 1,
                                    scale: isCenter ? 1 : 0.75,
                                    x: position * 220,
                                    zIndex: 10 - Math.abs(position),
                                    rotateY: position * -15,
                                    filter: isCenter ? 'brightness(1)' : 'brightness(0.5)',
                                }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                            >
                                <div className={styles.videoBox}>
                                    <video
                                        ref={el => { videoRefs.current[index] = el; }}
                                        src={item.video}
                                        className={styles.video}
                                        muted={isMuted}
                                        loop
                                        playsInline
                                        onClick={() => isCenter && setIsMuted(!isMuted)}
                                    />
                                    <div className={styles.metaBadge}>{item.language}</div>

                                    {isCenter && (
                                        <motion.div
                                            className={styles.promptOverlay}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <p className={styles.promptText}>{item.prompt}</p>
                                            <div className={styles.productTag}>
                                                {item.image ? (
                                                    <div className={styles.productInfo}>
                                                        <img src={item.image} alt="Product" className={styles.productImg} />
                                                        <span>Product</span>
                                                    </div>
                                                ) : (
                                                    <div className={styles.productInfo}>
                                                        <span className={styles.sparkleIcon}>✨</span>
                                                        <span>From Scratch</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className={styles.fanControls}>
                <button onClick={prev} className={styles.navBtn} aria-label="Previous">
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`${styles.navBtn} ${!isMuted ? styles.activeAudio : ''}`}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button onClick={next} className={styles.navBtn} aria-label="Next">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};
