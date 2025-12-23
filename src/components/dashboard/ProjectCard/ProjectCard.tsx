import { GlassCard } from '@/components/ui/GlassCard/GlassCard';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
    name: string;
    status: string;
    updatedAt: string;
    videoUrl?: string;
    thumbnailUrl?: string;
}

export const ProjectCard = ({ name, status, updatedAt, videoUrl, thumbnailUrl }: ProjectCardProps) => {
    const handlePlay = () => {
        if (videoUrl) window.open(videoUrl, '_blank');
    };

    return (
        <GlassCard className={styles.card} onClick={handlePlay}>
            <div className={styles.preview}>
                {thumbnailUrl || videoUrl ? (
                    <video src={videoUrl} className={styles.previewMedia} muted />
                ) : (
                    <div className={styles.placeholderIcon}>🎬</div>
                )}
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
