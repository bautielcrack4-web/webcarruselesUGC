'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import styles from './VideoCarousel.module.css';

// Data Mapping - Corrected based on actual video content
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
        id: 6,
        video: '/hero-examples/video 6.mp4',
        image: '/hero-examples/imagen video 6.png',
        language: '🇦🇷 Spanish (ARG)',
        prompt: "Review de botas de invierno, estilo porteño y auténtico."
    },
    {
        id: 1,
        video: '/hero-examples/video 1.mp4',
        image: null, // App video - no input image
        language: '🇺🇸 English',
        prompt: "Mobile app showcase with modern UI and smooth animations."
    },
];

export const VideoCarousel = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -amount : amount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={styles.carouselWrapper}>
            <div className={styles.carouselHeader}>
                <h2 className={styles.carouselTitle}>
                    <Sparkles className={styles.titleIcon} />
                    Made with Adfork
                </h2>
                <div className={styles.navButtons}>
                    <button onClick={() => scroll('left')} className={styles.navBtn} aria-label="Scroll left">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.navBtn} aria-label="Scroll right">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.carouselTrack} ref={scrollRef}>
                {EXAMPLES.map((item) => (
                    <motion.div
                        key={item.id}
                        className={styles.card}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Video Layer */}
                        <div className={styles.videoContainer}>
                            <video
                                src={item.video}
                                className={styles.video}
                                loop
                                muted
                                playsInline
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                }}
                                onClick={(e) => {
                                    if (e.currentTarget.paused) {
                                        e.currentTarget.play();
                                    } else {
                                        e.currentTarget.pause();
                                    }
                                }}
                            />
                            <div className={styles.langBadge}>{item.language}</div>
                            <div className={styles.playHint}>
                                <Play size={24} fill="white" />
                            </div>
                        </div>

                        {/* Input/Output Info */}
                        <div className={styles.cardFooter}>
                            {item.image ? (
                                <div className={styles.inputPreview}>
                                    <span className={styles.inputLabel}>Product</span>
                                    <div className={styles.imgWrapper}>
                                        <img src={item.image} alt="Product" className={styles.inputImg} />
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.inputPreview}>
                                    <span className={styles.inputLabel}>From Scratch</span>
                                    <div className={styles.noImagePlaceholder}>
                                        <span>✨</span>
                                    </div>
                                </div>
                            )}
                            <div className={styles.promptPreview}>
                                <span className={styles.inputLabel}>Prompt</span>
                                <p className={styles.promptText}>{item.prompt}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
