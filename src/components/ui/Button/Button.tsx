'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    ...props
}) => {
    const buttonClass = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

    return (
        <button className={buttonClass} disabled={loading} {...props}>
            {loading ? (
                <span className={styles.loader}></span>
            ) : children}
        </button>
    );
};
