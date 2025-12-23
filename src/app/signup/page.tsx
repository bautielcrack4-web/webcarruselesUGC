'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import styles from './auth.module.css';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => { window.location.href = '/login'; }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            <div className="nebula-bg" />

            <Link href="/" className={styles.backBtn}>
                <ArrowLeft size={18} /> Back to home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <GlassCard className={styles.authCard}>
                    <div className={styles.header}>
                        <div className={styles.iconCircle}>
                            <UserPlus size={24} className={styles.accentIcon} />
                        </div>
                        <h1 className={styles.title}>Create account</h1>
                        <p className={styles.subtitle}>Join top brands creating high-converting UGC ads</p>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={styles.successMessage}
                        >
                            <CheckCircle2 size={40} strokeWidth={1} style={{ marginBottom: 16 }} />
                            <h3>Welcome aboard!</h3>
                            <p>Your account has been created. Redirecting to login...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSignup} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label><Mail size={14} /> Email address</label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Lock size={14} /> Password</label>
                                <input
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <p className={styles.inputHint}>Min. 6 characters</p>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={styles.errorMessage}
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button type="submit" loading={loading} className={styles.submitBtn}>
                                Get Started for Free
                            </Button>
                        </form>
                    )}

                    <p className={styles.footer}>
                        Already have an account? <Link href="/login">Log in here</Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
