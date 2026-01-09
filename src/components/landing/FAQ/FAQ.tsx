'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const faqs = [
    {
        q: "¿Cuántos videos puedo hacer con cada plan?",
        a: "Depende de la duración elegida. Por ejemplo, en el plan Starter puedes generar hasta 12 videos de 15s. En el plan Pro hasta 40 videos de 15s (o 20 de 30s), y en el plan Business hasta 120 videos de 15s (o 30 de 60s)."
    },
    {
        q: "¿Cuál es la duración máxima de los UGCs?",
        a: "Varía según tu plan: Starter permite hasta 15 segundos, Pro hasta 30 segundos y Business hasta 60 segundos por video. Ofrecemos total flexibilidad para adaptarnos a tu estrategia de TikTok, Reels o YouTube."
    },
    {
        q: "¿Puedo usar mi propio rostro para los videos?",
        a: "¡Sí! Puedes usar la función 'Talking Photo' para subir una foto tuya o de cualquier persona y la IA la hará hablar de forma realista. También disponemos de una galería de avatares stock premium listos para usar."
    },
    {
        q: "¿Puedo generar anuncios en diferentes idiomas?",
        a: "Sí. Soportamos más de 10 idiomas con voces premium, incluyendo español, inglés, portugués, francés, alemán, italiano y más. Cada video suena natural y profesional."
    },
    {
        q: "¿Cómo funcionan los créditos?",
        a: "Cada duración tiene un costo fijo: 15s cuesta 45 créditos, 30s cuesta 90 créditos y 60s cuesta 180 créditos. Los créditos de tu plan se renuevan cada mes y puedes comprar packs extra si los necesitas."
    },
    {
        q: "¿Los videos tienen marca de agua?",
        a: "No. Todos nuestros planes de pago incluyen exportaciones en alta definición (4k/HD) sin marcas de agua y con derechos de uso comercial completo."
    },
    {
        q: "¿Hay versión gratuita?",
        a: "No tenemos versión gratuita permanentemente, pero nuestro plan Starter es la forma más económica de empezar a generar contenido publicitario de alta conversión con tecnología HeyGen de última generación."
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
