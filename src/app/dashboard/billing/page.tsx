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
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Fetch Subscription
                const { data: sub } = await supabase
                    .from('user_subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (sub) {
                    setCurrentPlan(sub.plan_id);
                    setCredits(sub.credits_remaining);
                    setSubscription(sub);
                    // Fetch Invoices only if sub exists
                    try {
                        const res = await fetch('/api/subscription/invoices');
                        const data = await res.json();
                        if (data.invoices) setInvoices(data.invoices);
                    } catch (e) {
                        console.error("Error fetching invoices", e);
                    }
                }
            }
            setLoading(false);
        };

        fetchData();

        // Initialize Paddle
        initializePaddle({
            environment: 'sandbox',
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || ''
        }).then((paddleInstance: Paddle | undefined) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }, []);

    const handleSelectPlan = (plan: any) => {
        if (!paddle || !user) {
            console.error('Paddle or User not initialized');
            return;
        }

        if (plan.id === 'agency') {
            window.location.href = 'mailto:ventas@ugccreator.ai';
            return;
        }

        paddle.Checkout.open({
            items: [{ priceId: plan.priceId, quantity: 1 }],
            customData: {
                userId: user.id,
                email: user.email,
            },
            settings: {
                displayMode: 'overlay',
                theme: 'dark',
                locale: 'es',
                successUrl: `${window.location.origin}/dashboard`,
            }
        });
    };

    // Placeholder for handleCancelSubscription, assuming it exists elsewhere or will be added
    const handleCancelSubscription = async () => {
        setCanceling(true);
        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId: subscription.paddle_subscription_id }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Suscripción cancelada con éxito.');
                setShowCancelModal(false);
                // Optionally refetch subscription status
                // window.location.reload();
            } else {
                alert(`Error al cancelar la suscripción: ${data.error}`);
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            alert('Error al cancelar la suscripción.');
        } finally {
            setCanceling(false);
        }
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
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`${styles.planWrapper} ${plan.popular ? styles.popularWrapper : ''}`}
                    >
                        {plan.popular && <div className={styles.glow} />}
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
                            {plan.popular && (
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 12, textAlign: 'center' }}>
                                    Usado por marcas que escalan ads cada semana
                                </p>
                            )}
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className={styles.addonsSection}>
                <h2 className={styles.addonsTitle}>¿Necesitás más créditos?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: -20, marginBottom: 32 }}>Perfecto para picos de campañas</p>
                <div className={styles.addonsContent}>
                    <div className={`${styles.addonCard} ${styles.packBlue}`}>
                        <div className={styles.packGlow} />
                        <span>Pack 90 créditos</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPlan({ priceId: 'pri_01kcqt266h5v2b6w8a2t9f1h5v_addon' })}
                        >$9</Button>
                    </div>
                    <div className={`${styles.addonCard} ${styles.packPurple}`}>
                        <div className={styles.packGlow} />
                        <span>Pack 240 créditos</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPlan({ priceId: 'pri_01j78y7f8v3m58g670v6z23zgh' })}
                        >$19</Button>
                    </div>
                    <div className={`${styles.addonCard} ${styles.packGreen}`}>
                        <div className={styles.packGlow} />
                        <span>Pack 540 créditos</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPlan({ priceId: 'pri_01j78y8m683m58g670v6z23zgh' })}
                        >$39</Button>
                    </div>
                </div>

                {/* SUBSCRIPTION MANAGEMENT SECTION */}
                {subscription && subscription.status !== 'free' && (
                    <div style={{ marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40 }}>
                        <h2 className={styles.addonsTitle} style={{ textAlign: 'left', marginBottom: 24 }}>Gestionar Suscripción</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            {/* Current Plan Info */}
                            <div className={styles.addonCard} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 24, background: 'rgba(255,255,255,0.02)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, color: 'white' }}>Plan Actual</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <span className={styles.planBadge}>{subscription.plan_id === 'pri_01j78y5q9m336h0f9q9z5g9v3a' ? 'PRO' : 'CREATOR'}</span>
                                    <span style={{ fontSize: '0.9rem', color: subscription.status === 'active' ? '#4ade80' : '#f87171' }}>
                                        • {subscription.status === 'active' ? 'Activo' : 'Cancelado'}
                                    </span>
                                </div>
                                {subscription.next_billing_date && (
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
                                        Renovación: {new Date(subscription.next_billing_date).toLocaleDateString()}
                                    </p>
                                )}

                                {subscription.status === 'active' ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCancelModal(true)}
                                        style={{ borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
                                    >
                                        Cancelar Suscripción
                                    </Button>
                                ) : (
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                                        Tu acceso finalizará al terminar el periodo actual.
                                    </p>
                                )}
                            </div>

                            {/* Invoices History */}
                            <div className={styles.addonCard} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 24, background: 'rgba(255,255,255,0.02)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, color: 'white' }}>Historial de Pagos</h3>
                                {invoices.length > 0 ? (
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {invoices.map((inv) => (
                                            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{new Date(inv.date).toLocaleDateString()}</span>
                                                <span style={{ color: 'white' }}>{inv.amount} {inv.currency}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No hay facturas disponibles.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* CANCEL MODAL */}
                {showCancelModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.1)', padding: 32, borderRadius: 16, maxWidth: 400, width: '90%' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, color: 'white' }}>¿Cancelar suscripción?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.5 }}>
                                Perderás acceso a los créditos acumulados y funciones premium al finalizar tu periodo actual. Esta acción no se puede deshacer.
                            </p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Volver</Button>
                                <Button
                                    style={{ background: '#ef4444', border: 'none', color: 'white' }}
                                    onClick={handleCancelSubscription}
                                    loading={canceling}
                                >
                                    Confirmar Cancelación
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 60, textAlign: 'center', opacity: 0.4, fontSize: '0.8rem', display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <span>🔒 Pago seguro</span>
                    <span>•</span>
                    <span>Cancelá cuando quieras</span>
                </div>
            </div>
        </div>
    );
}
