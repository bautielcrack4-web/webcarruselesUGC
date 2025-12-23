import React from 'react';
import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const GlassCard = ({ children, className = '', style, onClick }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${styles.glassCard} ${className}`}
            style={style}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};
