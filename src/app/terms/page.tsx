import React from 'react';
import Link from 'next/link';
import styles from './legal.module.css';

export default function TermsPage() {
    return (
        <div className={styles.legalContainer}>
            <div className={styles.legalContent}>
                <Link href="/" className={styles.backLink}>← Back to Home</Link>

                <h1>Terms of Service</h1>
                <p className={styles.lastUpdated}>Last Updated: December 26, 2024</p>

                <section>
                    <h2>1. Agreement to Terms</h2>
                    <p>
                        By accessing and using Adfork ("the Service"), operated by Adfork, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use the Service.
                    </p>
                </section>

                <section>
                    <h2>2. Description of Service</h2>
                    <p>
                        Adfork is a SaaS platform that enables users to create AI-generated User Generated Content (UGC) videos for advertising purposes.
                        The Service provides tools for script writing, avatar selection, and video generation using artificial intelligence technology.
                    </p>
                </section>

                <section>
                    <h2>3. Merchant of Record</h2>
                    <p className={styles.important}>
                        <strong>Our order process is conducted by our online reseller Lemon Squeezy. Lemon Squeezy is the Merchant of Record for all our orders.
                            Lemon Squeezy provides all customer service inquiries and handles returns.</strong>
                    </p>
                </section>

                <section>
                    <h2>4. User Accounts</h2>
                    <p>
                        To use the Service, you must create an account. You are responsible for:
                    </p>
                    <ul>
                        <li>Maintaining the confidentiality of your account credentials</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized use</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Credits and Usage</h2>
                    <p>
                        The Service operates on a credit-based system. Credits are consumed when generating videos.
                        Subscription plans include a monthly credit allocation. Additional credits may be purchased separately.
                    </p>
                    <ul>
                        <li>Credits expire at the end of each billing cycle for subscription plans</li>
                        <li>Unused credits do not roll over to the next billing period</li>
                        <li>One-time credit purchases do not expire</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Acceptable Use</h2>
                    <p>You agree not to use the Service to:</p>
                    <ul>
                        <li>Create content that violates any laws or regulations</li>
                        <li>Generate misleading, fraudulent, or deceptive content</li>
                        <li>Infringe on intellectual property rights of others</li>
                        <li>Create content that is defamatory, obscene, or offensive</li>
                        <li>Attempt to reverse engineer or exploit the Service</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Intellectual Property</h2>
                    <p>
                        You retain ownership of the content you create using the Service. Adfork retains all rights to the Service itself,
                        including its software, algorithms, and branding.
                    </p>
                    <p>
                        By using the Service, you grant us a limited license to process your content solely for the purpose of providing the Service.
                    </p>
                </section>

                <section>
                    <h2>8. Subscriptions and Payments</h2>
                    <p>
                        Subscription plans automatically renew at the end of each billing cycle unless cancelled.
                        You can cancel your subscription at any time through your account dashboard.
                    </p>
                    <p>
                        All payments are processed securely through Lemon Squeezy. We do not store or have access to your payment card details.
                    </p>
                </section>

                <section>
                    <h2>9. Refunds</h2>
                    <p>
                        Please refer to our <Link href="/refund-policy">Refund Policy</Link> for detailed information about refunds and cancellations.
                    </p>
                </section>

                <section>
                    <h2>10. Service Availability</h2>
                    <p>
                        We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the Service.
                        We reserve the right to modify, suspend, or discontinue any part of the Service with or without notice.
                    </p>
                </section>

                <section>
                    <h2>11. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, Adfork shall not be liable for any indirect, incidental, special,
                        consequential, or punitive damages resulting from your use of the Service.
                    </p>
                </section>

                <section>
                    <h2>12. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. We will notify users of significant changes via email
                        or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
                    </p>
                </section>

                <section>
                    <h2>13. Contact Information</h2>
                    <p>
                        For questions about these Terms, please contact us at: <a href="mailto:support@adfork.app">support@adfork.app</a>
                    </p>
                </section>

                <section>
                    <h2>14. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with applicable international laws for digital services.
                    </p>
                </section>
            </div>
        </div>
    );
}
