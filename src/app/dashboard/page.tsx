'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { ProjectCard } from '@/components/dashboard/ProjectCard/ProjectCard';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface Project {
    id: string;
    name: string;
    status: string;
    updated_at: string;
}

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (data) setProjects(data);
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

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
                {loading ? (
                    <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center' }}>
                        <div className="loader-orbit" /> {/* Assumes a global loader exists or style inline */}
                        <p>Cargando tus proyectos...</p>
                    </div>
                ) : (
                    <>
                        {projects.map((project: any) => (
                            <ProjectCard
                                key={project.id}
                                name={project.name}
                                status={project.status || 'Ready'}
                                updatedAt={new Date(project.updated_at).toLocaleDateString()}
                                videoUrl={project.video_url}
                            />
                        ))}

                        {projects.length === 0 && (
                            <div className={styles.emptyState}>
                                <p>Aún no tienes proyectos creados.</p>
                                <Button variant="secondary" onClick={() => window.location.href = '/dashboard/studio'}>
                                    Crear mi primer anuncio
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
