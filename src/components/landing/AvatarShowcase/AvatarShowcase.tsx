'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './AvatarShowcase.module.css';

// Demo avatars - replace with actual avatar images
const AVATARS = [
    {
        id: 1,
        image: '/avatars/avatar-1.jpg',
        name: 'Sofia',
        message: 'Hola, soy Sofia. Me encanta probar productos de belleza...'
    },
    {
        id: 2,
        image: '/avatars/avatar-2.jpg',
        name: 'Carlos',
        message: 'Hey! Soy Carlos y hoy les traigo este unboxing increíble...'
    },
    {
        id: 3,
        image: '/avatars/avatar-3.jpg',
        name: 'Vale',
        message: 'Hola, yo soy Vale, la que ama diseñar. Quiero mostrarles porqué acabo de empezar...'
    },
    {
        id: 4,
        image: '/avatars/avatar-4.jpg',
        name: 'Luna',
        message: 'Chicos, tienen que probar esto. Es increíble...'
    },
    {
        id: 5,
        image: '/avatars/avatar-5.jpg',
        name: 'Marco',
        message: 'Qué onda! Les cuento mi experiencia con este producto...'
    }
];

export const AvatarShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(2); // Start with center avatar

    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % AVATARS.length);
    };

    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + AVATARS.length) % AVATARS.length);
    };

    const getPosition = (index: number) => {
        const diff = index - activeIndex;
        const normalizedDiff = ((diff + AVATARS.length + 2) % AVATARS.length) - 2;
        return normalizedDiff;
    };

    return (
        <div className={styles.showcaseWrapper}>
            <div className={styles.avatarContainer}>
                {AVATARS.map((avatar, index) => {
                    const position = getPosition(index);
                    const isCenter = position === 0;
                    const isVisible = Math.abs(position) <= 2;

                    if (!isVisible) return null;

                    return (
                        <motion.div
                            key={avatar.id}
                            className={`${styles.avatarCard} ${isCenter ? styles.centerCard : ''}`}
                            initial={false}
                            animate={{
                                x: position * 180,
                                scale: isCenter ? 1 : 0.75,
                                rotateY: position * -5,
                                zIndex: isCenter ? 10 : 5 - Math.abs(position),
                                opacity: isCenter ? 1 : 0.6
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30
                            }}
                        >
                            <div className={styles.avatarImageWrapper}>
                                {/* Real avatar images */}
                                <img src={avatar.image} alt={avatar.name} className={styles.avatarImage} />
                            </div>

                            {isCenter && (
                                <motion.div
                                    className={styles.messageOverlay}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className={styles.messageText}>{avatar.message}</p>
                                    <div className={styles.avatarInfo}>
                                        <div className={styles.avatarThumb}>
                                            <span>{avatar.name[0]}</span>
                                        </div>
                                        <span className={styles.avatarName}>{avatar.name}</span>
                                        <span className={styles.aiTag}>✨ Creado con AI</span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className={styles.navControls}>
                <button onClick={goPrev} className={styles.navBtn} aria-label="Previous">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={goNext} className={styles.navBtn} aria-label="Next">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
