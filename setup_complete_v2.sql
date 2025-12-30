-- 1. CONFIGURACIÓN DE TABLA PROYECTOS (Video History)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL,
    name TEXT,
    video_url TEXT,
    status TEXT DEFAULT 'completed', -- 'processing', 'completed', 'failed'
    atlas_id TEXT
);

-- Asegurar que las columnas existan si la tabla ya existía
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS atlas_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2. CONFIGURACIÓN DE SUSCRIPCIONES Y CRÉDITOS
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    credits_remaining INTEGER DEFAULT 0,
    plan_tier TEXT DEFAULT 'free',
    paddle_subscription_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'purchase', 'usage', 'bonus'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEGURIDAD (Row Level Security) - CRÍTICO PARA EL HISTORIAL
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE PROYECTOS (¡Esto arregla el historial!)
-- Permitir insertar (crear video)
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir ver (listar en Mis Assets)
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

-- Permitir actualizar (CRÍTICO: Para cambiar de 'processing' a 'completed')
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

-- POLÍTICAS DE SUSCRIPCIÓN
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- 4. BONUS DE BIENVENIDA (Opcional: triggers para nuevos usuarios)
-- ... (se puede añadir después si se requiere)
