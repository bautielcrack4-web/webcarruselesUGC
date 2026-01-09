'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CookieBanner.module.css';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className={styles.banner}
                >
                    <div className={styles.content}>
                        <p>
                            Usamos cookies para mejorar tu experiencia.
                            Al continuar, aceptas nuestra <a href="/privacy">Política de Privacidad</a>.
                        </p>
                        <button onClick={acceptCookies} className={styles.button}>
                            Entendido
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
