'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FloatingSupport.module.css';

export const FloatingSupport = () => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.3, type: 'spring' }}
            className={styles.wrapper}
        >
            <a
                href="https://wa.me/YOUR_PHONE_NUMBER"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
                title="Hablar con soporte"
            >
                <MessageCircle size={24} />
                <span className={styles.label}>Soporte</span>
            </a>
        </motion.div>
    );
};
