'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Flame, Building2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { supabase } from '@/lib/supabase';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import styles from './billing.module.css';

const PLANS = [
    {
        id: 'starter',
        name: 'TRY',
        price: '9',
        priceId: 'pri_01kcqt266h5v2b6w8a2t9f1h5v',
        description: 'Probá anuncios realistas en minutos',
        credits: 90,
        features: [
            'Hasta 3 anuncios listos para ads',
            'Avatares ultra realistas',
            'Ideal para testear la herramienta'
        ],
        icon: <Zap size={24} />,
        color: '#10b981'
    },
    {
        id: 'creator',
        name: 'CREATOR',
        price: '29',
        priceId: 'pri_01kcqt0m6p3y6h8v2nvs9k2edd',
        description: 'Creá anuncios que parecen grabados por personas reales',
        credits: 360,
        features: [
            'Hasta 12 anuncios por mes',
            'Perfecto para testing en Meta y TikTok',
            'Personas sosteniendo tu producto',
            'Export listo para escalar'
        ],
        icon: <Star size={24} />,
        color: '#6366f1',
        popular: true
    },
    {
        id: 'pro',
        name: 'PRO',
        price: '59',
        priceId: 'pri_01j78y5q9m336h0f9q9z5g9v3a',
        description: 'Escalá creatividades sin depender de UGC real',
        credits: 900,
        features: [
            'Hasta 30 anuncios mensuales',
            'Prioridad de generación',
            'Sin marca de agua',
            'Uso comercial completo'
        ],
        icon: <Flame size={24} />,
        color: '#f59e0b'
    },
    {
        id: 'agency',
        name: 'AGENCY',
        price: '99',
        priceId: 'pri_01j78y6m683m58g670v6z23zgh',
        description: 'Volumen, velocidad y control total',
        credits: 1800,
        features: [
            'Hasta 60 anuncios por mes',
            'Máxima prioridad',
            'Multi-marca',
            'Soporte preferencial'
        ],
        icon: <Building2 size={24} />,
        color: '#ec4899'
    }
];

export default function BillingPage() {
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const [credits, setCredits] = useState<number>(0);
    const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data } = await supabase
                    .from('user_subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setCurrentPlan(data.plan_id);
                    setCredits(data.credits_remaining);
                }
            }
        };
        fetchSubscription();

        // Initialize Paddle
        initializePaddle({
            environment: 'sandbox', // Use sandbox for testing
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || ''
        }).then((paddleInstance: Paddle | undefined) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }, []);

    const handleSelectPlan = (plan: any) => {
        if (!paddle || !user) return;

        if (plan.id === 'agency') {
            window.location.href = 'mailto:ventas@ugccreator.ai';
            return;
        }

        paddle.Checkout.open({
            items: [
                {
                    priceId: plan.priceId,
                    quantity: 1,
                },
            ],
            customData: {
                userId: user.id,
            },
            customer: {
                email: user.email,
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Planes y Créditos</h1>
                <p className={styles.subtitle}>Elegí el plan perfecto para escalar tu contenido UGC</p>

                <div className={styles.statsRow}>
                    <GlassCard className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <CreditCard size={18} />
                            <span>Créditos Disponibles</span>
                        </div>
                        <div className={styles.statValue}>{credits}</div>
                    </GlassCard>
                </div>
            </div>

            <div className={styles.plansGrid}>
                {PLANS.map((plan) => (
                    <motion.div
                        key={plan.id}
                        whileHover={{ y: -5 }}
                        className={`${styles.planWrapper} ${plan.popular ? styles.popularWrapper : ''}`}
                    >
                        {plan.popular && <div className={styles.popularBadge}>Más elegido</div>}
                        <GlassCard className={`${styles.planCard} ${plan.popular ? styles.popularCard : ''}`}>
                            <div className={styles.planHeader}>
                                <div className={styles.planIcon} style={{ color: plan.color }}>
                                    {plan.icon}
                                </div>
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.priceContainer}>
                                    <span className={styles.currency}>$</span>
                                    <span className={styles.price}>{plan.price}</span>
                                    <span className={styles.period}>/mes</span>
                                </div>
                                <p className={styles.planDescription}>{plan.description}</p>
                            </div>

                            <div className={styles.planFeatures}>
                                {plan.features.map((feature, i) => (
                                    <div key={i} className={styles.featureItem}>
                                        <Check size={16} className={styles.checkIcon} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={styles.planBtn}
                                variant={plan.popular ? 'primary' : 'outline'}
                                onClick={() => handleSelectPlan(plan)}
                            >
                                {plan.id === 'agency' ? 'Contactar ventas' : (currentPlan === plan.priceId ? 'Tu plan actual' : `Elegir ${plan.name}`)}
                            </Button>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className={styles.addonsSection}>
                <h2 className={styles.addonsTitle}>¿Necesitás más créditos?</h2>
                <div className={styles.addonsContent}>
                    <div className={styles.addonCard}>
                        <span>Pack 90 créditos</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPlan({ priceId: 'pri_01kcqt266h5v2b6w8a2t9f1h5v' })}
                        >$9</Button>
                    </div>
                    <div className={styles.addonCard}>
                        <span>Pack 240 créditos</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPlan({ priceId: 'pri_01j78y7f8v3m58g670v6z23zgh' })} // Assuming a price ID for this
                        >$19</Button>
                    </div>
                    <div className={styles.addonCard}>
                        <span>Pack 540 créditos</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPlan({ priceId: 'pri_01j78y8m683m58g670v6z23zgh' })} // Assuming a price ID for this
                        >$39</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
