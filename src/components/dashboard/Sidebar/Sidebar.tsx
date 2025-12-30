import styles from './Sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

import Image from 'next/image';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', label: 'Proyectos', icon: '📁' },
        { href: '/dashboard/studio', label: 'Studio (IA)', icon: '🎬' },
        { href: '/dashboard/assets', label: 'Mis Assets', icon: '🖼️' },
        { href: '/dashboard/billing', label: 'Facturación', icon: '💳' },
        { href: '/dashboard/settings', label: 'Ajustes', icon: '⚙️' },
    ];

    const [credits, setCredits] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const [planId, setPlanId] = useState<string>('free');

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Set email from auth user
                setUserEmail(user.email || '');

                // Fetch subscription data
                const { data } = await supabase
                    .from('user_subscriptions')
                    .select('credits_remaining, plan_id')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setCredits(data.credits_remaining);
                    setPlanId(data.plan_id || 'free');
                } else {
                    setCredits(0);
                    setPlanId('free');
                }
            }
        };
        fetchUserData();
    }, []);

    const getPlanLabel = (plan: string) => {
        const labels: Record<string, string> = {
            'starter': 'Starter',
            'pro': 'Pro',
            'business': 'Business',
            'free': 'Free',
        };
        return labels[plan] || 'Free';
    };

    const isPaidPlan = planId && planId !== 'free';

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
                onClick={onClose}
            />

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <Image
                        src="/logo-white.png"
                        alt="Adfork"
                        width={140}
                        height={46}
                        style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
                        priority
                    />
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? styles.active : ''}`}
                            onClick={() => onClose?.()} // Close sidebar on mobile when navigating
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
                                <p className={styles.userName}>{userEmail ? userEmail.split('@')[0] : 'Usuario'}</p>
                                {isPaidPlan && <span className={styles.proBadge}>{getPlanLabel(planId).toUpperCase()}</span>}
                            </div>
                            <p className={styles.userEmail}>{userEmail || 'Cargando...'}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
