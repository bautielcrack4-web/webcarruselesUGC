'use client';

import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button/Button";
import { GlassCard } from "@/components/ui/GlassCard/GlassCard";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.logo}>
              UGC<span className="text-gradient">Creator</span>
            </Link>
            <div className={styles.navLinks}>
              <a href="#features">Características</a>
              <a href="#pricing">Precios</a>
              <Link href="/login">
                <Button variant="glass" size="sm">Iniciar sesión</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Empieza ya</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeText}>La IA que revoluciona los anuncios</span>
          </div>
          <h1 className={styles.title}>
            Escala tus Ventas con <br />
            <span className="text-gradient">Videos UGC que Convierten</span>
          </h1>
          <p className={styles.subtitle}>
            Genera contenido auténtico, persuasivo y visualmente impactante en minutos. Diseñado para marcas que no se conforman con lo ordinario.
          </p>
          <div className={styles.heroActions}>
            <Link href="/signup">
              <Button size="lg">Probar AtlasCloud IA Gratis</Button>
            </Link>
            <Button variant="secondary" size="lg">Ver ejemplos</Button>
          </div>

          <div className={styles.previewContainer}>
            <GlassCard className={styles.previewCard}>
              <div className={styles.editorMockup}>
                <div className={styles.mockupHeader}>
                  <div className={styles.dots}><span /><span /><span /></div>
                  <div className={styles.url}>ugc-creator.ai/editor</div>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.sidebar}>
                    {[1, 2, 3, 4].map(i => <div key={i} className={styles.item} />)}
                  </div>
                  <div className={styles.stage}>
                    <div className={styles.videoPlayer}>
                      <div className={styles.playBtn} />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Todo lo que necesitas para <span className="text-gradient">volverte viral</span></h2>
          </div>
          <div className={styles.featureGrid}>
            <GlassCard className={styles.featureCard}>
              <h3>AtlasCloud IA</h3>
              <p>Generación de video y audio ultra-realista que no parece IA.</p>
            </GlassCard>
            <GlassCard className={styles.featureCard}>
              <h3>Editor Intuitivo</h3>
              <p>Arrastra y suelta para crear variaciones infinitas de tus anuncios.</p>
            </GlassCard>
            <GlassCard className={styles.featureCard}>
              <h3>Optimizado para TikTok</h3>
              <p>Formatos 9:16 diseñados específicamente para el algoritmo actual.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Planes que <span className="text-gradient">crecen contigo</span></h2>
          </div>
          <div className={styles.priceGrid}>
            <GlassCard className={styles.priceCard}>
              <div className={styles.planName}>Gratis</div>
              <div className={styles.price}>$0<span>/mes</span></div>
              <ul className={styles.planFeatures}>
                <li>1 Proyecto activo</li>
                <li>Créditos limitados</li>
                <li>Watermark</li>
              </ul>
              <Link href="/signup">
                <Button variant="secondary" className={styles.planBtn}>Empezar ahora</Button>
              </Link>
            </GlassCard>
            <GlassCard className={`${styles.priceCard} ${styles.featured}`}>
              <div className={styles.planName}>Pro 🚀</div>
              <div className={styles.price}>$29<span>/mes</span></div>
              <ul className={styles.planFeatures}>
                <li>Proyectos ilimitados</li>
                <li>Sin Watermark</li>
                <li>Soporte 24/7</li>
              </ul>
              <Link href="/signup">
                <Button className={styles.planBtn}>Sliar al Pro</Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2024 UGC Creator. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
