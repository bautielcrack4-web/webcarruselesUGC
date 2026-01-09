-- =====================================================
-- ACTUALIZACIÓN DE ESTRUCTURA DE CRÉDITOS OPTIMIZADA
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Actualizar usuarios existentes con plan Starter
UPDATE public.user_subscriptions
SET 
    credits_remaining = CASE 
        WHEN plan_id = 'starter' THEN 540
        WHEN plan_id = 'pro' THEN 1800
        WHEN plan_id = 'business' THEN 5400
        ELSE credits_remaining
    END,
    credits_total = CASE 
        WHEN plan_id = 'starter' THEN 540
        WHEN plan_id = 'pro' THEN 1800
        WHEN plan_id = 'business' THEN 5400
        ELSE credits_total
    END,
    updated_at = NOW()
WHERE plan_id IN ('starter', 'pro', 'business');

-- 2. Actualizar tu cuenta específicamente (asegurar que tengas créditos)
UPDATE public.user_subscriptions
SET 
    credits_remaining = 5400,
    credits_total = 5400,
    plan_id = 'business',
    status = 'active',
    updated_at = NOW()
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'bautimoran86@gmail.com'
);

-- 3. Crear tabla de configuración de planes (si no existe)
CREATE TABLE IF NOT EXISTS public.plan_configs (
    plan_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly NUMERIC(10,2) NOT NULL,
    credits_monthly INTEGER NOT NULL,
    max_duration_seconds INTEGER NOT NULL,
    max_script_chars INTEGER NOT NULL,
    features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insertar/Actualizar configuración de planes
INSERT INTO public.plan_configs (plan_id, name, price_monthly, credits_monthly, max_duration_seconds, max_script_chars, features)
VALUES 
    ('starter', 'Starter', 29.00, 540, 15, 150, '["540 credits/month", "Up to 12 videos (15s)", "Max 15s duration", "All AI avatars", "Multi-language support"]'::jsonb),
    ('pro', 'Pro', 79.00, 1800, 30, 300, '["1,800 credits/month", "Up to 40 videos (15s)", "Max 30s duration", "All AI avatars", "Priority support", "Early access"]'::jsonb),
    ('business', 'Business', 199.00, 5400, 60, 600, '["5,400 credits/month", "Up to 120 videos (15s)", "Max 60s duration", "All AI avatars", "Priority support", "Dedicated account manager"]'::jsonb)
ON CONFLICT (plan_id) 
DO UPDATE SET
    price_monthly = EXCLUDED.price_monthly,
    credits_monthly = EXCLUDED.credits_monthly,
    max_duration_seconds = EXCLUDED.max_duration_seconds,
    max_script_chars = EXCLUDED.max_script_chars,
    features = EXCLUDED.features,
    updated_at = NOW();

-- 5. Verificar resultados
SELECT 
    plan_id,
    name,
    credits_monthly,
    max_duration_seconds,
    max_script_chars
FROM public.plan_configs
ORDER BY price_monthly;

-- 6. Verificar suscripciones actualizadas
SELECT 
    u.email,
    s.plan_id,
    s.credits_remaining,
    s.credits_total,
    s.status
FROM public.user_subscriptions s
JOIN auth.users u ON s.user_id = u.id
ORDER BY s.updated_at DESC
LIMIT 10;
