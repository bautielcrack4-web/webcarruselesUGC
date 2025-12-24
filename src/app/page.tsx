'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Zap, Layout, Smartphone } from 'lucide-react';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button/Button';
import { GlassCard } from '@/components/ui/GlassCard/GlassCard';

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
  return (
    <main className={styles.main}>
      <div className="nebula-bg" />

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.logo}>
              <Image src="/logo-white.png" alt="Adfork" width={100} height={32} style={{ height: '28px', width: 'auto' }} />
            </Link>
            <div className={styles.navLinks}>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <div className={styles.authActions}>
                <Link href="/login">
                  <Button variant="minimal" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeIn}
            className={styles.heroBadge}
          >
            <Zap size={14} className={styles.badgeIcon} />
            <span>Powering the next generation of ads</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
            className={styles.title}
          >
            Create High-Converting <br />
            <span className="text-gradient">UGC Ads with AI</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
            className={styles.subtitle}
          >
            Generate authentic, persuasive content in seconds.
            Designed for brands that value professional results over noise.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
            className={styles.heroActions}
          >
            <Link href="/signup">
              <Button size="lg">Try it for Free <ArrowRight size={18} /></Button>
            </Link>
            <Button variant="secondary" size="lg">Watch Demo</Button>
          </motion.div>

          {/* Visual Piece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className={styles.previewContainer}
          >
            <GlassCard className={styles.previewCard}>
              <div className={styles.mockupHeader}>
                <div className={styles.dots}><span /><span /><span /></div>
                <div className={styles.url}>adfork.ai/studio</div>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.mockupSidebar}>
                  {[1, 2, 3].map(i => <div key={i} className={styles.mockupItem} />)}
                </div>
                <div className={styles.mockupStage}>
                  <div className={styles.videoWindow}>
                    <Play size={32} fill="white" color="white" />
                  </div>
                </div>
              </div>
            </GlassCard>
            <div className={styles.previewGlow} />
          </motion.div>
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
            <div className={styles.logo}>
              <Image src="/logo-white.png" alt="Adfork" width={100} height={32} style={{ height: '24px', width: 'auto', opacity: 0.8 }} />
            </div>
            <p>© 2024 Nebula Pro Design. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
