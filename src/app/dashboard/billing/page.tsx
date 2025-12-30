'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { supabase } from '@/lib/supabase';
import styles from './billing.module.css';

// Lemon Squeezy checkout URLs
// Lemon Squeezy checkout URLs
const CHECKOUT_URLS = {
    starter: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/7afc5d16-2667-42a3-9e51-d127cf764fd7',
    pro: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/a3c69f06-f46c-4ce6-aa51-ac83d686e057',
    business: 'https://bagasystudio.lemonsqueezy.com/checkout/buy/1c67e47f-4c29-4ca1-bf0e-96b07b3407fb',
};

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: '29',
        variantId: '1180151',
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
        name: 'Pro',
        price: '79',
        variantId: '1180157',
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
        name: 'Business',
        price: '199',
        variantId: '1180158',
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
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const [credits, setCredits] = useState<number>(0);
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
                    setCurrentPlan(sub.plan_tier);
                    setCredits(sub.credits_remaining);
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

        // Open Lemon Squeezy checkout using Permalinks (UUIDs)
        // We use these specific URLs because the integer variant IDs cause 404s
        const checkoutUrl = CHECKOUT_URLS[plan.id as keyof typeof CHECKOUT_URLS];

        if (checkoutUrl) {
            // Add redirect URL and user data for webhook processing
            const url = new URL(checkoutUrl);
            const successUrl = `${window.location.origin}/checkout/success`;
            url.searchParams.set('checkout[success_url]', successUrl);
            // Pass user_id for webhook to identify the user
            url.searchParams.set('checkout[custom][user_id]', String(user.id));

            window.location.href = url.toString();
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Planes y Créditos</h1>
                <p className={styles.subtitle}>Elige el plan perfecto para escalar tu contenido UGC</p>

                <div className={styles.statsRow}>
                    <GlassCard className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span>Available Credits</span>
                        </div>
                        <div className={styles.statValue}>{credits}</div>
                    </GlassCard>
                    {currentPlan && (
                        <GlassCard className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <span>Current Plan</span>
                            </div>
                            <div className={styles.statValue} style={{ textTransform: 'capitalize' }}>
                                {currentPlan}
                            </div>
                        </GlassCard>
                    )}
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
                        {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
                        <GlassCard className={`${styles.planCard} ${plan.popular ? styles.popularCard : ''}`}>
                            <div className={styles.planHeader}>
                                <div className={styles.planIcon} style={{ color: plan.color }}>
                                    {plan.icon}
                                </div>
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.priceContainer}>
                                    <span className={styles.currency}>$</span>
                                    <span className={styles.price}>{plan.price}</span>
                                    <span className={styles.period}>/month</span>
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
                                {currentPlan === plan.id ? 'Current Plan' : `Choose ${plan.name}`}
                            </Button>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: 60, textAlign: 'center', opacity: 0.4, fontSize: '0.8rem', display: 'flex', gap: 16, justifyContent: 'center' }}>
                <span>🔒 Secure payment</span>
                <span>•</span>
                <span>Cancel anytime</span>
            </div>
        </div>
    );
}
