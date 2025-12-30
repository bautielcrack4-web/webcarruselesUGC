'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import confetti from 'canvas-confetti';
import styles from './success.module.css';

export default function SuccessPage() {
    useEffect(() => {
        // Launch confetti on page load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Launch confetti from both sides
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f472b6']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <div className="nebula-bg" />

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={styles.content}
            >
                <motion.div
                    className={styles.iconWrapper}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                >
                    <CheckCircle2 size={80} className={styles.successIcon} />
                    <motion.div
                        className={styles.sparkle}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <Sparkles size={32} />
                    </motion.div>
                </motion.div>

                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    🎉 ¡Felicidades!
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Tu suscripción está activa. Tus créditos ya fueron añadidos a tu cuenta.
                    <br />
                    ¡Ahora puedes crear videos UGC de alto impacto!
                </motion.p>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link href="/dashboard/studio">
                        <Button className={styles.primaryBtn} size="lg">
                            Crear mi primer video <Play size={18} style={{ marginLeft: 8 }} />
                        </Button>
                    </Link>
                    <Link href="/dashboard/billing">
                        <Button variant="outline" size="lg">
                            Ver mi suscripción <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <GlassCard className={styles.infoCard}>
                        <h3>¿Qué sigue ahora?</h3>
                        <ul>
                            <li>✅ Tus créditos ya están disponibles en tu barra lateral.</li>
                            <li>📧 Recibirás un recibo de Lemon Squeezy en tu email.</li>
                            <li>🎬 Ve al Studio y crea tu primer video con IA.</li>
                            <li>💬 Si tienes alguna duda, escríbenos a support@adfork.app</li>
                        </ul>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
}
