-- Create user_subscriptions table
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

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Create credit_transactions table for auditing
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'purchase', 'consumption', 'refund', 'bonus'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Function to handle new user registration (give some free credits)
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_subscriptions (user_id, plan_id, credits_remaining, credits_total)
    VALUES (NEW.id, 'free', 10, 10); -- Give 10 credits to try (0.33 of a 10s video)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
-- DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
-- CREATE TRIGGER on_auth_user_created_subscription
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id UUID, p_amount INTEGER, p_description TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_remaining INTEGER;
BEGIN
    SELECT credits_remaining INTO v_remaining FROM public.user_subscriptions WHERE user_id = p_user_id;
    
    IF v_remaining >= p_amount THEN
        UPDATE public.user_subscriptions 
        SET credits_remaining = credits_remaining - p_amount,
            updated_at = NOW()
        WHERE user_id = p_user_id;
        
        INSERT INTO public.credit_transactions (user_id, amount, type, description)
        VALUES (p_user_id, -p_amount, 'consumption', p_description);
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
