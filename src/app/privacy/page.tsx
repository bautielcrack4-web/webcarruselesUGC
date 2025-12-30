import React from 'react';
import Link from 'next/link';
import styles from '../terms/legal.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.legalContainer}>
            <div className={styles.legalContent}>
                <Link href="/" className={styles.backLink}>← Back to Home</Link>

                <h1>Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last Updated: December 26, 2024</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        Adfork ("we," "our," or "us") operates Adfork. This Privacy Policy explains how we collect, use, disclose,
                        and safeguard your information when you use our Service.
                    </p>
                </section>

                <section>
                    <h2>2. Information We Collect</h2>

                    <h3>2.1 Information You Provide</h3>
                    <ul>
                        <li><strong>Account Information:</strong> Email address, name, and password</li>
                        <li><strong>Content:</strong> Scripts, prompts, and generated videos you create</li>
                        <li><strong>Communication:</strong> Messages you send to our support team</li>
                    </ul>

                    <h3>2.2 Automatically Collected Information</h3>
                    <ul>
                        <li><strong>Usage Data:</strong> Features used, videos generated, credits consumed</li>
                        <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                        <li><strong>Cookies:</strong> Session cookies for authentication and functionality</li>
                    </ul>

                    <h3>2.3 Third-Party Information</h3>
                    <ul>
                        <li><strong>Payment Information:</strong> Processed and stored by Lemon Squeezy (our payment processor)</li>
                        <li><strong>Authentication:</strong> If you sign in with Google or other providers</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Provide, maintain, and improve the Service</li>
                        <li>Process your transactions and manage your account</li>
                        <li>Generate AI videos based on your inputs</li>
                        <li>Send you service-related notifications and updates</li>
                        <li>Respond to your support requests</li>
                        <li>Analyze usage patterns to improve user experience</li>
                        <li>Detect and prevent fraud or abuse</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Storage and Processing</h2>
                    <p>Your data is stored and processed using the following services:</p>
                    <ul>
                        <li><strong>Supabase:</strong> Database and authentication (hosted in secure cloud infrastructure)</li>
                        <li><strong>AtlasCloud AI:</strong> Video generation processing</li>
                        <li><strong>Vercel:</strong> Application hosting and delivery</li>
                    </ul>
                    <p>All data is encrypted in transit using industry-standard SSL/TLS protocols.</p>
                </section>

                <section>
                    <h2>5. Data Sharing and Disclosure</h2>
                    <p>We do not sell your personal information. We may share your data with:</p>
                    <ul>
                        <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our Service (Supabase, AtlasCloud, Lemon Squeezy)</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                        <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                        <li><strong>Export:</strong> Download your generated content</li>
                        <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                    </ul>
                    <p>To exercise these rights, contact us at <a href="mailto:support@adfork.app">support@adfork.app</a></p>
                </section>

                <section>
                    <h2>7. Data Retention</h2>
                    <p>
                        We retain your personal information for as long as your account is active or as needed to provide the Service.
                        Generated videos and content are stored for the duration of your subscription.
                        After account deletion, we may retain certain information for legal or legitimate business purposes.
                    </p>
                </section>

                <section>
                    <h2>8. Cookies and Tracking</h2>
                    <p>We use cookies for:</p>
                    <ul>
                        <li>Authentication and session management</li>
                        <li>Remembering your preferences</li>
                        <li>Analytics to understand how users interact with the Service</li>
                    </ul>
                    <p>You can control cookies through your browser settings, but disabling them may affect Service functionality.</p>
                </section>

                <section>
                    <h2>9. Children's Privacy</h2>
                    <p>
                        The Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.
                        If we discover that a child has provided us with personal information, we will delete it immediately.
                    </p>
                </section>

                <section>
                    <h2>10. International Data Transfers</h2>
                    <p>
                        Your information may be transferred to and processed in countries other than your own.
                        We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                    </p>
                </section>

                <section>
                    <h2>11. Security</h2>
                    <p>
                        We implement industry-standard security measures to protect your data, including encryption, secure authentication,
                        and regular security audits. However, no method of transmission over the internet is 100% secure.
                    </p>
                </section>

                <section>
                    <h2>12. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of significant changes via email or
                        through the Service. Your continued use after changes constitutes acceptance of the updated policy.
                    </p>
                </section>

                <section>
                    <h2>13. Contact Us</h2>
                    <p>
                        For questions about this Privacy Policy or our data practices, please contact us at:
                        <a href="mailto:support@adfork.app">support@adfork.app</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
