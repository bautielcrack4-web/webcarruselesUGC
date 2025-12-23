import { Sidebar } from '@/components/dashboard/Sidebar/Sidebar';
import styles from './layout.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.search}>
                        <input type="text" placeholder="Buscar proyectos..." className={styles.searchInput} />
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.notificationBtn}>🔔</button>
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
