'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import styles from './success.module.css';

export default function SuccessPage() {
    return (
        <div className={styles.container}>
            <div className="nebula-bg" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={styles.content}
            >
                <div className={styles.iconWrapper}>
                    <CheckCircle2 size={80} className={styles.successIcon} />
                </div>

                <h1 className={styles.title}>¡Pago Completado!</h1>
                <p className={styles.subtitle}>
                    Tus créditos han sido añadidos a tu cuenta. Ya puedes empezar a crear videos de alto impacto.
                </p>

                <div className={styles.actions}>
                    <Link href="/dashboard/studio">
                        <Button className={styles.primaryBtn} size="lg">
                            Ir al Studio <Play size={18} style={{ marginLeft: 8 }} />
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg">
                            Ver mi cuenta <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Button>
                    </Link>
                </div>

                <GlassCard className={styles.infoCard}>
                    <h3>¿Qué sigue ahora?</h3>
                    <ul>
                        <li>Los créditos ya están disponibles en tu barra lateral.</li>
                        <li>Recibirás un recibo de Lemon Squeezy en tu email.</li>
                        <li>Si tienes alguna duda, escríbenos a bagasystudio@gmail.com</li>
                    </ul>
                </GlassCard>
            </motion.div>
        </div>
    );
}
