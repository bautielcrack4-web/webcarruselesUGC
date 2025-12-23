import styles from './Sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', label: 'Proyectos', icon: '📁' },
        { href: '/dashboard/studio', label: 'Studio (IA)', icon: '🎬' },
        { href: '/dashboard/assets', label: 'Mis Assets', icon: '🖼️' },
        { href: '/dashboard/settings', label: 'Ajustes', icon: '⚙️' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                UGC<span className="text-gradient">Creator</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
                <button
                    onClick={() => {
                        const { handleSignOut } = require('@/lib/auth-helpers');
                        handleSignOut();
                    }}
                    className={styles.navItem}
                    style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                >
                    <span className={styles.icon}>🚪</span>
                    Cerrar sesión
                </button>
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
