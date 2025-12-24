import styles from './Sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', label: 'Proyectos', icon: '📁' },
        { href: '/dashboard/studio', label: 'Studio (IA)', icon: '🎬' },
        { href: '/dashboard/assets', label: 'Mis Assets', icon: '🖼️' },
        { href: '/dashboard/billing', label: 'Facturación', icon: '💳' },
        { href: '/dashboard/settings', label: 'Ajustes', icon: '⚙️' },
    ];

    const [credits, setCredits] = useState<number | null>(null);

    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('user_subscriptions')
                    .select('credits_remaining')
                    .eq('user_id', user.id)
                    .single();
                if (data) setCredits(data.credits_remaining);
            }
        };
        fetchCredits();
    }, []);

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
                <Link href="/dashboard/billing" className={styles.creditBadge}>
                    <span className={styles.creditIcon}>🪙</span>
                    <span className={styles.creditLabel}>Créditos:</span>
                    <span className={styles.creditValue}>{credits !== null ? credits : '...'}</span>
                </Link>
                <div className={styles.userProfile}>
                    <div className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <p className={styles.userName}>Usuario Pro</p>
                            <span className={styles.proBadge}>PRO</span>
                        </div>
                        <p className={styles.userEmail}>bauti@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
