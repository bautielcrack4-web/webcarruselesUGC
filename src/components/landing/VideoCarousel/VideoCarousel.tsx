'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import styles from './VideoCarousel.module.css';

// Data Mapping
const EXAMPLES = [
    {
        id: 1,
        video: '/hero-examples/video 1.mp4',
        // Assuming video 1 has specific input image if available, else generic placeholder or one of the others if not matched
        // Based on file list, let's map what we have.
        // It seems video 1 doesn't have a clear "imagen de video 1" in the list (we have 2,3,4,5,6).
        // I will use a placeholder or reuse one for demo purposes if strictly needed, or just skip if file missing.
        // Wait, list has: unique images for 2, 3, 4, 5, 6. And videos 1, 2, 3, 4, 5.
        // Let's align: 
        // Video 2 <- imagen de video 2.jpeg
        // Video 3 <- imagen de video 3.png
        // Video 4 <- imagen de video 4.webp
        // Video 5 <- imagen de video 5.png
        // Video 1 <- Let's treat it as the "Generic" one or maybe "imagen video 6.png" was meant for it?
        image: '/hero-examples/imagen de video 2.jpeg', // Fallback for 1? Or just start from 2-5

        // Let's use 2-5 as they match perfectly.
        language: '🇺🇸 English',
        prompt: "UGC video of a fitness enthusiast holding a protein shaker..."
    },
    {
        id: 2,
        video: '/hero-examples/video 2.mp4',
        image: '/hero-examples/imagen de video 2.jpeg',
        language: '🇪🇸 Spanish',
        prompt: "Unboxing de zapatillas urbanas, estilo dinámico y juvenil."
    },
    {
        id: 3,
        video: '/hero-examples/video 3.mp4',
        image: '/hero-examples/imagen de video 3.png',
        language: '🇫🇷 French',
        prompt: "Review élégante d'un parfum de luxe, ambiance soirée."
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
        language: '🇮🇹 Italian',
        prompt: "Tutorial di cucina veloce con utensili moderni."
    },
    {
        id: 6,
        video: '/hero-examples/video 6.mp4',
        image: '/hero-examples/imagen video 6.png',
        language: '🇦🇷 Spanish (ARG)',
        prompt: "Review de botas de invierno, estilo porteño y auténtico."
    }
];

export const VideoCarousel = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);

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
                {EXAMPLES.slice(1).map((item) => ( // Skipping 1 for now as it lacks a clear pair, showing 2-6
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
                            />
                            <div className={styles.langBadge}>{item.language}</div>
                            <div className={styles.playHint}>
                                <Play size={24} fill="white" />
                            </div>
                        </div>

                        {/* Input/Output Info */}
                        <div className={styles.cardFooter}>
                            <div className={styles.inputPreview}>
                                <span className={styles.inputLabel}>Input</span>
                                <div className={styles.imgWrapper}>
                                    <img src={item.image} alt="Input" className={styles.inputImg} />
                                </div>
                            </div>
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
