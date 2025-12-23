'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './Button.module.css';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className={styles.loader}></div>
            ) : (
                <span className={styles.content}>{children}</span>
            )}
        </motion.button>
    );
};
