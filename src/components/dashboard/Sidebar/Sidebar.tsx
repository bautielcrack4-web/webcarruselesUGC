import styles from './Sidebar.module.css';
import Link from 'next/link';

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                UGC<span className="text-gradient">Creator</span>
            </div>

            <nav className={styles.nav}>
                <Link href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
                    <span className={styles.icon}>📊</span>
                    Proyectos
                </Link>
                <Link href="/dashboard/assets" className={styles.navItem}>
                    <span className={styles.icon}>🖼️</span>
                    Mis Assets
                </Link>
                <Link href="/dashboard/settings" className={styles.navItem}>
                    <span className={styles.icon}>⚙️</span>
                    Ajustes
                </Link>
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>Usuario Pro</p>
                        <p className={styles.userEmail}>bauti@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
