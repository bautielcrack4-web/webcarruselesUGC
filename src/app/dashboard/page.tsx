import { Button } from '@/components/ui/Button/Button';
import { ProjectCard } from '@/components/dashboard/ProjectCard/ProjectCard';
import styles from './page.module.css';

export default function DashboardPage() {
    // Mock data for initial design validation
    const projects = [
        { id: '1', name: 'Zapatillas Summer 2024', status: 'Ready', updatedAt: 'Hace 2 horas' },
        { id: '2', name: 'Perfume Noir Promo', status: 'Draft', updatedAt: 'Ayer' },
        { id: '3', name: 'Gaming Chair Review', status: 'Draft', updatedAt: 'Hace 3 días' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Mis Proyectos</h1>
                    <p className={styles.subtitle}>Gestiona y crea tus anuncios UGC impulsados por IA.</p>
                </div>
                <Button>+ Nuevo Proyecto</Button>
            </header>

            <div className={styles.grid}>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        name={project.name}
                        status={project.status}
                        updatedAt={project.updatedAt}
                    />
                ))}

                {/* Empty state / placeholder for adding first project */}
                {projects.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>Aún no tienes proyectos creados.</p>
                        <Button variant="secondary">Crear mi primer anuncio</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
