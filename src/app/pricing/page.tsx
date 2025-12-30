import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import styles from './pricing.module.css';

export default function PricingPage() {
    const plans = [
        {
            name: 'Starter',
            price: '$29',
            period: '/month',
            credits: '50 credits/month',
            features: [
                '50 video generation credits per month',
                'Access to all AI avatars',
                'Multi-language support',
                '9:16 vertical format export',
                'Email support',
                'Credits expire monthly'
            ],
            cta: 'Elegir Plan',
            popular: false
        },
        {
            name: 'Pro',
            price: '$79',
            period: '/month',
            credits: '150 credits/month',
            features: [
                '150 video generation credits per month',
                'Access to all AI avatars',
                'Multi-language support',
                '9:16 vertical format export',
                'Priority email support',
                'Credits expire monthly',
                'Early access to new features'
            ],
            cta: 'Elegir Plan',
            popular: true
        },
        {
            name: 'Business',
            price: '$199',
            period: '/month',
            credits: '500 credits/month',
            features: [
                '500 video generation credits per month',
                'Access to all AI avatars',
                'Multi-language support',
                '9:16 vertical format export',
                'Priority support',
                'Credits expire monthly',
                'Early access to new features',
                'Dedicated account manager'
            ],
            cta: 'Elegir Plan',
            popular: false
        }
    ];

    return (
        <div className={styles.pricingContainer}>
            <div className={styles.pricingContent}>
                <Link href="/" className={styles.backLink}>← Back to Home</Link>

                <div className={styles.header}>
                    <h1>Simple, Transparent Pricing</h1>
                    <p className={styles.subtitle}>
                        Elige el plan que mejor se adapte a tus necesidades.
                    </p>
                </div>

                <div className={styles.plansGrid}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${styles.planCard} ${plan.popular ? styles.popularPlan : ''}`}
                        >
                            {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}

                            <div className={styles.planHeader}>
                                <h2>{plan.name}</h2>
                                <div className={styles.priceWrapper}>
                                    <span className={styles.price}>{plan.price}</span>
                                    <span className={styles.period}>{plan.period}</span>
                                </div>
                                <p className={styles.credits}>{plan.credits}</p>
                            </div>

                            <ul className={styles.featuresList}>
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <Check size={20} className={styles.checkIcon} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup" className={styles.ctaButton}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className={styles.creditInfo}>
                    <h2>How Credits Work</h2>
                    <div className={styles.creditGrid}>
                        <div className={styles.creditItem}>
                            <h3>📹 Video Generation</h3>
                            <p>Each video costs credits based on length. A 30-second video typically costs 5-10 credits.</p>
                        </div>
                        <div className={styles.creditItem}>
                            <h3>🔄 Monthly Reset</h3>
                            <p>Subscription credits reset at the start of each billing cycle. Unused credits do not roll over.</p>
                        </div>
                        <div className={styles.creditItem}>
                            <h3>💳 Buy More Anytime</h3>
                            <p>Need extra credits? Purchase one-time credit packs that never expire.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.faq}>
                    <h2>Frequently Asked Questions</h2>

                    <div className={styles.faqItem}>
                        <h3>Can I cancel anytime?</h3>
                        <p>Yes! You can cancel your subscription at any time from your dashboard. You'll retain access until the end of your billing period.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>What happens if I run out of credits?</h3>
                        <p>You can purchase additional one-time credit packs or upgrade to a higher plan. One-time credits never expire.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>Do you offer refunds?</h3>
                        <p>Sí, ofrecemos una garantía de satisfacción. Consulta nuestra <Link href="/refund-policy">Política de Reembolso</Link> para más detalles.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept all major credit cards, debit cards, and PayPal through our secure payment processor, Lemon Squeezy.</p>
                    </div>
                </div>

                <div className={styles.cta}>
                    <h2>Ready to Get Started?</h2>
                    <p>Join hundreds of creators using Adfork to generate high-converting UGC videos.</p>
                    <Link href="/signup" className={styles.mainCta}>
                        Empezar ahora
                    </Link>
                </div>
            </div>
        </div>
    );
}
