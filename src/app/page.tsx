import styles from "./page.module.css";
import { Button } from "@/components/ui/Button/Button";
import { GlassCard } from "@/components/ui/GlassCard/GlassCard";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>UGC<span className="text-gradient">Creator</span></div>
        <div className={styles.navLinks}>
          <a href="#features">Características</a>
          <a href="#examples">Ejemplos</a>
          <a href="#pricing">Precios</a>
          <Button variant="glass" size="sm">Iniciar sesión</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeText}>Impulsado por AtlasCloud IA</span>
        </div>
        <h1 className={styles.title}>
          Crea Videos <span className="text-gradient">UGC Virales</span> <br />
          en Cuestión de Minutos
        </h1>
        <p className={styles.subtitle}>
          Transforma tus ideas en anuncios auténticos que convierten. La plataforma más avanzada para marcas que buscan impacto real.
        </p>
        <div className={styles.heroActions}>
          <Button size="lg">Comenzar gratis</Button>
          <Button variant="secondary" size="lg">Ver demo</Button>
        </div>

        {/* Hero Visual Preview */}
        <div className={styles.previewContainer}>
          <GlassCard className={styles.previewCard}>
            <div className={styles.editorMockup}>
              <div className={styles.mockupSidebar}>
                <div className={styles.mockupItem} />
                <div className={styles.mockupItem} />
                <div className={styles.mockupItem} />
              </div>
              <div className={styles.mockupMain}>
                <div className={styles.videoWindow}>
                  <div className={styles.playButton} />
                </div>
                <div className={styles.timeline}>
                  <div className={styles.timelineBar} />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Trust Bar */}
      <div className={styles.trustBar}>
        <p>CONFIADO POR MARCAS LÍDERES</p>
        <div className={styles.logoGrid}>
          <span>Shopify</span>
          <span>TikTok</span>
          <span>Meta</span>
          <span>Amazon</span>
        </div>
      </div>
    </main>
  );
}
