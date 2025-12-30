-- PASO 1: Copia y pega esto en el SQL Editor de Supabase para crear las tablas necesarias.

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL DEFAULT 'free',
    credits_remaining INTEGER NOT NULL DEFAULT 0,
    credits_total INTEGER NOT NULL DEFAULT 0,
    paddle_subscription_id TEXT,
    paddle_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    next_billing_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'purchase', 'consumption', 'bonus'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- PASO 2: Asignar 5.000 créditos a tu cuenta.

INSERT INTO public.user_subscriptions (user_id, plan_id, credits_remaining, credits_total, status)
SELECT id, 'pro', 5000, 5000, 'active'
FROM auth.users
WHERE email = 'bautimoran86@gmail.com'
ON CONFLICT (user_id) DO UPDATE 
SET credits_remaining = 5000, credits_total = 5000;
