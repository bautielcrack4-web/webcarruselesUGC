'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Layout, Smartphone } from 'lucide-react';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import { VideoCarousel } from '@/components/landing/VideoCarousel/VideoCarousel';
import { TrustBadges } from '@/components/landing/TrustBadges/TrustBadges';
import { useMagneticButton } from '@/hooks/useMagneticButton';

/* Animation Variants */
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const magneticButtonRef = useMagneticButton();

  return (
    <main className={styles.main}>
      <div className="nebula-bg" />

      {/* Background Glow */}
      <div className={styles.heroGlow} />

      {/* Navigation - Simplified like Forkads */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            {/* Logo Left */}
            <Link href="/" className={styles.logo}>
              <Image src="/logo-white.png" alt="Adfork" width={240} height={60} style={{ height: '48px', width: 'auto' }} priority />
            </Link>

            <div className={styles.navSpacer} />

            {/* Auth Right */}
            <div className={styles.authActions}>
              <Link href="/contact" className={styles.secondaryLink}>
                Contact
              </Link>
              <Link href="/login">
                <Button className={styles.whiteBtn}>Iniciar sesión</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>

          {/* Badge Pill with Gradient */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeIn}
            className={styles.pillBadge}
          >
            <span className={styles.pillText}>
              Escribe tu Script <span className={styles.arrow}>→</span> Selecciona Un Avatar <span className={styles.arrow}>→</span> Genera tu video
            </span>
          </motion.div>

          {/* Title - Bigger and Bolder */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
            className={styles.title}
          >
            Crea UGCs con IA, <br />
            Efectivos y Rápido
          </motion.h1>

          {/* Subtitle - More subtle */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
            className={styles.subtitle}
          >
            Genera contenido que conecta con tu audiencia y aumenta tus
            conversiones, todo desde una plataforma fácil de usar.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
            className={styles.heroActions}
          >
            <Link href="/dashboard/studio">
              <button ref={magneticButtonRef} className={styles.mainCta}>
                Haz tu primer video ahora
              </button>
            </Link>
          </motion.div>

          {/* Fan Video Showcase (Forkads style) */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeIn}
            className={styles.showcaseWrapper}
          >
            <VideoCarousel />
          </motion.div>

        </div>
      </section>

      {/* Trust Badges - BELOW the Showcase like Forkads */}
      <TrustBadges />

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className={styles.centerHeader}
          >
            <h2 className={styles.sectionTitle}>How It <span className="text-gradient">Works</span></h2>
            <p className={styles.sectionSubtitle}>Create professional UGC videos in three simple steps</p>
          </motion.div>

          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Write Your Script</h3>
              <p>Enter your product description or ad copy. Our AI helps you craft compelling scripts optimized for conversions.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Choose an Avatar</h3>
              <p>Select from our diverse library of AI avatars. Each avatar supports multiple languages and natural expressions.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Generate & Export</h3>
              <p>Click generate and receive your video in minutes. Download in 9:16 format, ready for TikTok, Meta, and YouTube Shorts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className={styles.detailedFeatures}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className={styles.centerHeader}
          >
            <h2 className={styles.sectionTitle}>What You Can <span className="text-gradient">Create</span></h2>
          </motion.div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <h3>🎬 AI-Generated UGC Videos</h3>
              <p>Create authentic-looking user-generated content with AI avatars that speak your script naturally. Perfect for product reviews, testimonials, and promotional content.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>🌍 Multi-Language Support</h3>
              <p>Generate videos in English, Spanish, Italian, German, French, and more. Expand your reach to global audiences with native-sounding avatars.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>📱 Mobile-Optimized Format</h3>
              <p>All videos are exported in 9:16 vertical format, specifically designed for TikTok, Instagram Reels, YouTube Shorts, and Facebook Stories.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>⚡ Fast Generation</h3>
              <p>Most videos are ready in 2-5 minutes. No need to hire actors, rent studios, or spend hours editing. Just write, select, and generate.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>💳 Credit-Based System</h3>
              <p>Pay only for what you use. Each video costs credits based on length. Subscription plans include monthly credit allocations, or purchase credits as needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations & Transparency */}
      <section className={styles.limitations}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className={styles.centerHeader}
          >
            <h2 className={styles.sectionTitle}>Important <span className="text-gradient">Information</span></h2>
          </motion.div>

          <div className={styles.limitationsContent}>
            <h3>What Adfork Does:</h3>
            <ul>
              <li>Generates AI-powered UGC-style videos with realistic avatars</li>
              <li>Supports multiple languages and avatar personalities</li>
              <li>Exports videos optimized for social media advertising</li>
              <li>Provides a simple, fast alternative to traditional video production</li>
            </ul>

            <h3>What Adfork Does NOT Do:</h3>
            <ul>
              <li>Does not create videos with real human actors</li>
              <li>Cannot edit existing videos or footage</li>
              <li>Does not guarantee specific conversion rates or ad performance</li>
              <li>Cannot create videos longer than 60 seconds per generation</li>
              <li>Does not provide video hosting or analytics (export only)</li>
            </ul>

            <p className={styles.disclaimer}>
              <strong>Note:</strong> All videos are generated using AI technology. While our avatars are highly realistic,
              they are not real people. Always comply with platform advertising policies when using AI-generated content.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className={styles.centerHeader}
          >
            <h2 className={styles.sectionTitle}>Built for <span className="text-gradient">performance</span></h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className={styles.featureGrid}
          >
            {[
              { icon: <Zap />, title: "Instant Generation", desc: "Craft entire ad scripts and videos in seconds using AtlasCloud AI." },
              { icon: <Layout />, title: "Pro Workflow", desc: "A clean, distraction-free environment to manage all your UGC projects." },
              { icon: <Smartphone />, title: "Mobile Ready", desc: "Optimized 9:16 formats for TikTok, Meta and YouTube Shorts." }
            ].map((f, i) => (
              <GlassCard key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLeft}>
              <div className={styles.logo}>
                <Image src="/logo-white.png" alt="Adfork" width={100} height={32} style={{ height: '24px', width: 'auto', opacity: 0.8 }} />
              </div>
              <p className={styles.footerCopy}>© 2024 Bagasy Studio. All rights reserved.</p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/pricing">Pricing</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/refund-policy">Refund Policy</Link>
              <a href="mailto:bagasystudio@gmail.com">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
