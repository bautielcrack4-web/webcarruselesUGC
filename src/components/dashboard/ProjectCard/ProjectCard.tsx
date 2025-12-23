import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
    name: string;
    status: string;
    updatedAt: string;
}

export const ProjectCard = ({ name, status, updatedAt }: ProjectCardProps) => {
    return (
        <GlassCard className={styles.card}>
            <div className={styles.preview}>
                <div className={styles.playOverlay}>
                    <span className={styles.playIcon}>▶</span>
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.meta}>
                    <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>{status}</span>
                    <span className={styles.date}>{updatedAt}</span>
                </div>
            </div>
        </GlassCard>
    );
};
