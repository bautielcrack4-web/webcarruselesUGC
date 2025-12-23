'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '../login/auth.module.css';

export default function ForgotPasswordPage() {
    return (
        <div className={styles.container}>
            <div className="nebula-bg" />

            <Link href="/login" className={styles.backBtn}>
                <ArrowLeft size={18} /> Back to login
            </Link>

            <GlassCard className={styles.authCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Reset password</h1>
                    <p className={styles.subtitle}>Enter your email to receive a reset link</p>
                </div>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.inputGroup}>
                        <label><Mail size={14} /> Email address</label>
                        <input type="email" placeholder="name@company.com" required />
                    </div>

                    <button type="submit" className={styles.submitBtn} style={{ background: 'white', color: 'black', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 600, width: '100%', cursor: 'pointer', marginTop: '16px' }}>
                        Send Reset Link
                    </button>
                </form>

                <p className={styles.footer}>
                    Remembered? <Link href="/login">Go back</Link>
                </p>
            </GlassCard>
        </div>
    );
}
