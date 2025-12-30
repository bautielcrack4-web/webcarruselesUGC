'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import styles from './cancel.module.css';

export default function CancelPage() {
    return (
        <div className={styles.container}>
            <div className="nebula-bg" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.content}
            >
                <div className={styles.iconWrapper}>
                    <XCircle size={80} className={styles.cancelIcon} />
                </div>

                <h1 className={styles.title}>Pago Cancelado</h1>
                <p className={styles.subtitle}>
                    No te preocupes, no se ha realizado ningún cargo. Tu carrito sigue esperando por ti.
                </p>

                <div className={styles.actions}>
                    <Link href="/dashboard/billing">
                        <Button className={styles.primaryBtn} size="lg">
                            <ArrowLeft size={18} style={{ marginRight: 8 }} /> Volver a Planes
                        </Button>
                    </Link>
                    <a href="mailto:bagasystudio@gmail.com">
                        <Button variant="outline" size="lg">
                            Hablar con Soporte <MessageCircle size={18} style={{ marginLeft: 8 }} />
                        </Button>
                    </a>
                </div>

                <GlassCard className={styles.infoCard}>
                    <h3>¿Tuviste algún problema?</h3>
                    <p>
                        Si el pago falló o tienes preguntas sobre nuestros planes, estamos aquí para ayudarte.
                        Escríbenos y te responderemos en menos de 24 horas.
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
