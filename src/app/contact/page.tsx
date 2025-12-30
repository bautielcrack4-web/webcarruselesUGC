'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './contact.module.css';

const FAQ_ITEMS = [
    {
        question: "How do I get started?",
        answer: "Simply sign up for an account, choose a plan, and start creating videos immediately. Our intuitive interface guides you through the process."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and PayPal through our secure payment processor, Lemon Squeezy."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes! You can cancel your subscription at any time from your account dashboard. You'll retain access until the end of your billing period."
    },
    {
        question: "Do you offer refunds?",
        answer: "We offer a 7-day money-back guarantee if you haven't used any credits. See our Refund Policy for details."
    },
    {
        question: "What languages are supported for video generation?",
        answer: "We support multiple languages including English, Spanish, Italian, German, French, and more. Check the avatar selection for available language options."
    },
    {
        question: "How long does it take to generate a video?",
        answer: "Most videos are generated within 2-5 minutes, depending on length and complexity. You'll receive a notification when your video is ready."
    }
];

export default function ContactPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.contactContainer}>
            <div className={styles.contactContent}>
                <Link href="/" className={styles.backLink}>← Adfork Home</Link>

                <h1>Contact Us</h1>
                <p className={styles.subtitle}>
                    We're here to help! Reach out to us with any questions, feedback, or support requests.
                </p>

                <div className={styles.contactGrid}>
                    <div className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <Mail size={32} />
                        </div>
                        <h2>Email Support</h2>
                        <p>Get in touch with our support team for any questions or issues.</p>
                        <a href="mailto:bagasystudio@gmail.com" className={styles.contactButton}>
                            bagasystudio@gmail.com
                        </a>
                        <p className={styles.responseTime}>We typically respond within 24 hours</p>
                    </div>

                    <div className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <MessageSquare size={32} />
                        </div>
                        <h2>General Inquiries</h2>
                        <p>Questions about pricing, features, or partnerships?</p>
                        <a href="mailto:bagasystudio@gmail.com?subject=General Inquiry" className={styles.contactButton}>
                            Send an Inquiry
                        </a>
                        <p className={styles.responseTime}>Business hours: Mon-Fri, 9AM-6PM</p>
                    </div>
                </div>

                <div className={styles.faqSection}>
                    <h2>Frequently Asked Questions</h2>

                    <div className={styles.faqList}>
                        {FAQ_ITEMS.map((item, index) => (
                            <div
                                key={index}
                                className={`${styles.faqItem} ${openIndex === index ? styles.active : ''}`}
                                onClick={() => toggleFaq(index)}
                            >
                                <div className={styles.faqHeader}>
                                    <h3>{item.question}</h3>
                                    <div className={styles.faqIcon}>
                                        {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                                {openIndex === index && (
                                    <div className={styles.faqAnswer}>
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.supportInfo}>
                    <h2>Need Immediate Help?</h2>
                    <p>
                        Check out our <Link href="/terms">Terms of Service</Link>, <Link href="/privacy">Privacy Policy</Link>,
                        or <Link href="/refund-policy">Refund Policy</Link> for more information.
                    </p>
                </div>
            </div>
        </div>
    );
}
