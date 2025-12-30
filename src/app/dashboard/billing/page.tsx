'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Flame, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { supabase } from '@/lib/supabase';
import styles from './billing.module.css';

// Lemon Squeezy checkout URLs (Subscriptions)
const CHECKOUT_URLS = {
    starter: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/7afc5d16-2667-42a3-9e51-d127cf764fd7',
    pro: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/a3c69f06-f46c-4ce6-aa51-ac83d686e057',
    business: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/1c67e47f-4c29-4ca1-bf0e-96b07b3407fb',
};

// Credit Packs (One-time payments)
const CREDIT_PACKS = [
    {
        id: 'pack_starter',
        name: 'Starter Boost',
        description: 'Capacidad extra inmediata',
        credits: 50,
        price: 49,
        checkoutUrl: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/e2ddff42-1226-401c-bd96-a0adc5764c10',
        color: '#60a5fa'
    },
    {
        id: 'pack_pro',
        name: 'Pro Top-up',
        description: 'Para picos de demanda',
        credits: 150,
        price: 129,
        checkoutUrl: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/da689d0d-16be-4a81-87b0-10098b19026a',
        color: '#a78bfa'
    },
    {
        id: 'pack_agency',
        name: 'Agency Scale',
        description: 'Volumen masivo sin contrato',
        credits: 500,
        price: 349,
        checkoutUrl: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/9a8ac655-6180-430a-a8b3-3bf5bfafbb34',
        color: '#34d399'
    }
];

// ... (existing code) ...



const PLANS = [
    {
        id: 'starter',
        tier: 1,
        name: 'Starter',
        price: '29',
        description: 'Perfect for small businesses testing AI video ads',
        credits: 50,
        features: [
            '50 video generation credits/month',
            'Access to all AI avatars',
            'Multi-language support',
            '9:16 vertical format export',
            'Email support'
        ],
        icon: <Zap size={24} />,
        color: '#10b981'
    },
    {
        id: 'pro',
        tier: 2,
        name: 'Pro',
        price: '79',
        description: 'Ideal for agencies and growing e-commerce brands',
        credits: 150,
        features: [
            '150 video generation credits/month',
            'Access to all AI avatars',
            'Multi-language support',
            '9:16 vertical format export',
            'Priority email support',
            'Early access to new features'
        ],
        icon: <Star size={24} />,
        color: '#6366f1',
        popular: true
    },
    {
        id: 'business',
        tier: 3,
        name: 'Business',
        price: '199',
        description: 'Built for large agencies running high-volume campaigns',
        credits: 500,
        features: [
            '500 video generation credits/month',
            'Access to all AI avatars',
            'Multi-language support',
            '9:16 vertical format export',
            'Priority support',
            'Early access to new features',
            'Dedicated account manager'
        ],
        icon: <Flame size={24} />,
        color: '#f59e0b'
    }
];

export default function BillingPage() {
    const [subscription, setSubscription] = useState<any>(null);
    const [credits, setCredits] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                    setSubscription(sub);
                    setCredits(sub.credits_remaining);
                }

                // Fetch History (Credit Transactions)
                const { data: txs } = await supabase
                    .from('credit_transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (txs) {
                    setTransactions(txs);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleSelectPlan = (plan: any) => {
        if (!user) {
            window.location.href = '/signup';
            return;
        }

        const checkoutUrl = CHECKOUT_URLS[plan.id as keyof typeof CHECKOUT_URLS];

        if (checkoutUrl) {
            const url = new URL(checkoutUrl);
            const successUrl = `${window.location.origin}/checkout/success`;
            url.searchParams.set('checkout[success_url]', successUrl);
            url.searchParams.set('checkout[custom][user_id]', String(user.id));
            window.location.href = url.toString();
        }
    };

    const handleBuyCredits = (pack: any) => {
        if (!pack.checkoutUrl) {
            alert("Este pack estará disponible muy pronto.");
            return;
        }

        if (!user) {
            window.location.href = '/signup';
            return;
        }

        const url = new URL(pack.checkoutUrl);
        const successUrl = `${window.location.origin}/checkout/success`;
        url.searchParams.set('checkout[success_url]', successUrl);
        url.searchParams.set('checkout[custom][user_id]', String(user.id));
        window.location.href = url.toString();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCurrentPlanTier = () => {
        if (!subscription) return 0;
        const plan = PLANS.find(p => p.id === subscription.plan_id);
        return plan ? plan.tier : 0;
    };

    const currentTier = getCurrentPlanTier();

    if (loading) {
        return (
            <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 className={styles.title}>Loading...</h1>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Planes y Facturación</h1>
                <p className={styles.subtitle}>Gestiona tu suscripción y créditos disponibles</p>

                <div className={styles.statsRow}>
                    <GlassCard className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <Zap size={16} />
                            <span>Créditos Disponibles</span>
                        </div>
                        <div className={styles.statValue}>{credits}</div>
                    </GlassCard>

                    {subscription && (
                        <GlassCard className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <Star size={16} />
                                <span>Plan Actual</span>
                            </div>
                            <div className={styles.statValue} style={{ textTransform: 'capitalize' }}>
                                {subscription.plan_id}
                            </div>
                            <div className={styles.subDetail}>
                                {subscription.status === 'active' ? '● Activo' : '● Inactivo'}
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>

            {subscription && subscription.status === 'active' && (
                <div className={styles.gridTwoCols}>
                    <div>
                        <h2 className={styles.sectionTitle}>
                            <CreditCard size={24} />
                            Detalles de Suscripción
                        </h2>
                        <div className={styles.subscriptionDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Estado</span>
                                <span className={styles.detailValue} style={{ color: '#4ade80' }}>Activa</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Próxima renovación</span>
                                <span className={styles.detailValue}>{formatDate(subscription.next_billing_date)}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Miembro desde</span>
                                <span className={styles.detailValue}>{formatDate(subscription.created_at)}</span>
                            </div>
                            <div style={{ marginTop: 24, textAlign: 'right' }}>
                                <a href="#" style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'underline' }}>
                                    Gestionar facturación (Portal)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.plansGrid}>
                {PLANS.map((plan) => {
                    const isCurrent = subscription?.plan_id === plan.id;
                    const isUpgrade = plan.tier > currentTier;

                    return (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={`${styles.planWrapper} ${plan.popular ? styles.popularWrapper : ''}`}
                        >
                            {plan.popular && <div className={styles.glow} />}
                            {plan.popular && <div className={styles.popularBadge}>Recomendado</div>}
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
                                    disabled={isCurrent}
                                    onClick={() => !isCurrent && handleSelectPlan(plan)}
                                >
                                    {isCurrent ? 'Tu Plan Actual' : (isUpgrade ? `Mejorar a ${plan.name}` : `Cambiar a ${plan.name}`)}
                                </Button>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            <div className={styles.addonsSection}>
                <div style={{ maxWidth: 600, margin: '0 auto 40px' }}>
                    <h2 className={styles.addonsTitle}>Packs de Velocidad (One-time)</h2>
                    <p className={styles.subtitle} style={{ fontSize: '0.95rem', marginBottom: 0 }}>
                        Ideales para picos de trabajo. Si necesitas más capacidad constante,
                        <span style={{ color: '#818cf8', fontWeight: 600 }}> subir de plan es siempre más conveniente.</span>
                    </p>
                </div>

                <div className={styles.addonsContent}>
                    {CREDIT_PACKS.map((pack) => (
                        <div key={pack.id} className={styles.addonCard}>
                            <div className={styles.packGlow} style={{ '--pack-color': pack.color } as any} />
                            <div className={styles.packName}>{pack.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginBottom: 8 }}>
                                {pack.description}
                            </div>
                            <div className={styles.packCredits}>{pack.credits}</div>
                            <div className={styles.packPrice}>
                                <span style={{ fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>${pack.price}</span>
                                <span style={{ opacity: 0.7 }}> / pago único</span>
                            </div>
                            <Button
                                className={styles.packBtn}
                                variant="outline"
                                onClick={() => handleBuyCredits(pack)}
                            >
                                Recargar
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.historySection}>
                <h2 className={styles.sectionTitle}>
                    <Clock size={24} />
                    Historial de Transacciones
                </h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className={styles.historyTable}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Tipo</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td>{formatDate(tx.created_at)}</td>
                                        <td>{tx.description}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                                        <td style={{ color: '#4ade80', fontWeight: 'bold' }}>+{tx.amount} 🪙</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                                        No hay transacciones recientes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
