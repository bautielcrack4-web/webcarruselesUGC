import React from 'react';
import Link from 'next/link';
import styles from '../terms/legal.module.css';

export default function RefundPolicyPage() {
    return (
        <div className={styles.legalContainer}>
            <div className={styles.legalContent}>
                <Link href="/" className={styles.backLink}>← Back to Home</Link>

                <h1>Refund Policy</h1>
                <p className={styles.lastUpdated}>Last Updated: December 26, 2024</p>

                <section>
                    <h2>1. Overview</h2>
                    <p>
                        At Adfork (operated by Adfork), we want you to be completely satisfied with our Service.
                        This Refund Policy outlines the conditions under which refunds are granted.
                    </p>
                </section>

                <section>
                    <h2>2. 7-Day Money-Back Guarantee</h2>
                    <p>
                        We offer a <strong>7-day money-back guarantee</strong> for all subscription plans and credit purchases,
                        subject to the conditions outlined below.
                    </p>
                </section>

                <section>
                    <h2>3. Refund Eligibility</h2>

                    <h3>3.1 Eligible for Full Refund</h3>
                    <p>You are eligible for a full refund if:</p>
                    <ul>
                        <li>You request a refund within 7 days of your purchase</li>
                        <li>You have <strong>not used any credits</strong> from your subscription or credit purchase</li>
                        <li>You have not generated any videos using the Service</li>
                    </ul>

                    <h3>3.2 Not Eligible for Refund</h3>
                    <p>Refunds will not be granted if:</p>
                    <ul>
                        <li>You have used any credits to generate videos</li>
                        <li>More than 7 days have passed since your purchase</li>
                        <li>You are requesting a refund due to violation of our Terms of Service</li>
                        <li>There is evidence of refund abuse or fraudulent activity</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Subscription Cancellations</h2>
                    <p>
                        You can cancel your subscription at any time through your account dashboard. Upon cancellation:
                    </p>
                    <ul>
                        <li>You will retain access to the Service until the end of your current billing period</li>
                        <li>Your subscription will not renew for the next billing cycle</li>
                        <li>Unused credits will expire at the end of the billing period</li>
                        <li>No refund will be issued for the current billing period (unless within the 7-day guarantee and no credits used)</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Partial Refunds</h2>
                    <p>
                        Partial refunds are not available. If you have used any credits, you are not eligible for a refund,
                        even if you used only a small portion of your credit allocation.
                    </p>
                </section>

                <section>
                    <h2>6. Processing Time</h2>
                    <p>
                        Refund requests are typically processed within 5-7 business days. The time it takes for the refund to appear
                        in your account depends on your payment method:
                    </p>
                    <ul>
                        <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                        <li><strong>PayPal:</strong> 3-5 business days</li>
                    </ul>
                    <p>
                        Please note that refunds cannot be processed for transactions older than 120 days for card payments
                        or 179 days for PayPal transactions.
                    </p>
                </section>

                <section>
                    <h2>7. How to Request a Refund</h2>
                    <p>To request a refund:</p>
                    <ol>
                        <li>Contact our support team at <a href="mailto:support@adfork.app">support@adfork.app</a></li>
                        <li>Include your account email and transaction details</li>
                        <li>Explain the reason for your refund request</li>
                    </ol>
                    <p>
                        Our team will review your request and respond within 2 business days.
                    </p>
                </section>

                <section>
                    <h2>8. Merchant of Record</h2>
                    <p>
                        All payments are processed by Lemon Squeezy, our Merchant of Record. Lemon Squeezy handles all payment-related inquiries
                        and refund processing. While we initiate refunds, the final processing is managed by Lemon Squeezy.
                    </p>
                    <p>
                        <strong>Note:</strong> Lemon Squeezy retains the original processing fee even when a refund is issued.
                    </p>
                </section>

                <section>
                    <h2>9. Service Issues</h2>
                    <p>
                        If you experience technical issues that prevent you from using the Service, please contact our support team
                        immediately at <a href="mailto:support@adfork.app">support@adfork.app</a>.
                        We will work to resolve the issue or provide appropriate compensation.
                    </p>
                </section>

                <section>
                    <h2>10. Fraudulent Activity</h2>
                    <p>
                        We reserve the right to refuse refunds in cases of suspected fraud, abuse, or violation of our Terms of Service.
                        This includes but is not limited to:
                    </p>
                    <ul>
                        <li>Multiple refund requests from the same user</li>
                        <li>Chargebacks filed after receiving a refund</li>
                        <li>Use of stolen payment methods</li>
                    </ul>
                </section>

                <section>
                    <h2>11. Changes to This Policy</h2>
                    <p>
                        We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting.
                        Your continued use of the Service after changes constitutes acceptance of the updated policy.
                    </p>
                </section>

                <section>
                    <h2>12. Contact Information</h2>
                    <p>
                        For questions about this Refund Policy or to request a refund, please contact us at:
                        <a href="mailto:support@adfork.app">support@adfork.app</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
