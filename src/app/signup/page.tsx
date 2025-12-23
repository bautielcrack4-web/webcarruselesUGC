'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import styles from './auth.module.css';
import Link from 'next/link';

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

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            // As user disabled email verification, we could redirect or show success
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            <GlassCard className={styles.authCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Crea tu <span className="text-gradient">cuenta</span></h1>
                    <p className={styles.subtitle}>Comienza a generar anuncios virales hoy mismo.</p>
                </div>

                {success ? (
                    <div className={styles.successMessage}>
                        <p>¡Cuenta creada con éxito! Redirigiendo...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        {error && <p className={styles.errorMessage}>{error}</p>}

                        <Button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </Button>
                    </form>
                )}

                <p className={styles.footer}>
                    ¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link>
                </p>
            </GlassCard>
        </div>
    );
}
