'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FloatingSupport.module.css';
import Link from 'next/link';

export const FloatingSupport = () => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.3, type: 'spring' }}
            className={styles.wrapper}
        >
            <Link
                href="/contact"
                className={styles.button}
                title="Contactar Soporte"
            >
                <div style={{ transform: 'scale(0.8)' }}>
                    <MessageCircle size={20} />
                </div>
                <span className={styles.label}>Soporte</span>
            </Link>
        </motion.div>
    );
};
