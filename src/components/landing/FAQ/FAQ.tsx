'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const faqs = [
    {
        q: "¿Cuántos videos puedo hacer con cada plan?",
        a: "Depende de la duración: un video de 10s cuesta 30 créditos y uno de 15s cuesta 45. Por tanto: Starter ~1-2 videos, Pro ~3-5 videos y Business ~11-16 videos al mes."
    },
    {
        q: "¿Cuál es la duración máxima de los UGCs?",
        a: "Actualmente cada video tiene una duración máxima de 60 segundos, pero estamos trabajando en ampliar este límite muy pronto."
    },
    {
        q: "¿Puedo subir mi propio avatar o rostro?",
        a: "Sí. Puedes crear y subir tu avatar personal, y será privado y exclusivo en tu cuenta. Nadie más podrá usarlo."
    },
    {
        q: "¿Puedo generar anuncios en diferentes idiomas?",
        a: "Sí. Adfork soporta español, inglés, portugués, francés, alemán y más. Estamos ampliando a más idiomas poco a poco."
    },
    {
        q: "¿Puedo mostrar productos físicos en los videos?",
        a: "Sí. Elige la opción de “producto en mano” o “try on” y el avatar aparecerá mostrándolo o usando prendas/accesorios."
    },
    {
        q: "¿Los rostros generados son consistentes entre un video y otro?",
        a: "Sí. Una vez que eliges o creas un avatar, su rostro se mantiene consistente en todos tus videos. No cambia cada vez que generas."
    },
    {
        q: "¿Qué pasa si no me gusta el resultado?",
        a: "Puedes ponerte en contacto con soporte y te recargaremos créditos nuevamente para que generes otra versión sin costo adicional."
    },
    {
        q: "¿Hay versión gratuita?",
        a: "No tenemos versión gratuita, pero todos los planes incluyen descargas sin marca de agua y uso comercial desde el inicio. Así te aseguras de que cada anuncio que hagas ya es usable y profesional."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Preguntas frecuentes</h2>
                    <p className={styles.subtitle}>Todo lo que necesita saber antes de comprar.</p>
                </div>

                <div className={styles.list}>
                    {faqs.map((item, i) => (
                        <div key={i} className={styles.item}>
                            <button
                                className={styles.question}
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            >
                                {item.q}
                                <ChevronDown
                                    className={styles.icon}
                                    style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={styles.answer}
                                    >
                                        <div className={styles.answerContent}>{item.a}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
