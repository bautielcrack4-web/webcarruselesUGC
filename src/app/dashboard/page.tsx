'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { ProjectCard } from '@/components/dashboard/ProjectCard/ProjectCard';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
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
                <Button onClick={() => window.location.href = '/dashboard/studio'}>
                    + Nuevo Proyecto
                </Button>
            </header>

            <div className={styles.grid}>
                {loading ? (
                    <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center' }}>
                        <div className="loader-orbit" /> {/* Assumes a global loader exists or style inline */}
                        <p>Cargando tus proyectos...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.grid}>
                            {projects.map((project: any) => (
                                <ProjectCard
                                    key={project.id}
                                    name={project.name}
                                    status={project.status || 'Ready'}
                                    updatedAt={new Date(project.updated_at).toLocaleDateString()}
                                    videoUrl={project.video_url}
                                />
                            ))}
                        </div>

                        {projects.length === 0 && (
                            <div className={styles.emptyStateWrapper}>
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className={styles.emptyState}
                                >
                                    <div className={styles.emptyIconGlow} />
                                    <h2 className={styles.emptyTitle}>Este es tu espacio creativo</h2>
                                    <p className={styles.emptySubtitle}>Acá se crean anuncios que convierten. Empezá ahora.</p>
                                    <Button
                                        size="lg"
                                        className={styles.emptyCta}
                                        onClick={() => window.location.href = '/dashboard/studio'}
                                    >
                                        Crear anuncio
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
