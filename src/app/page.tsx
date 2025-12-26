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
              <Link href="/login" className={styles.secondaryLink}>
                Ejemplos
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
