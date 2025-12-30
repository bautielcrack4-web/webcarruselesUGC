-- Final Migration: Paddle to Lemon Squeezy
-- Apply this in your Supabase SQL Editor

-- 1. Rename Paddle columns to Lemon Squeezy
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'paddle_subscription_id') THEN
        ALTER TABLE public.user_subscriptions RENAME COLUMN paddle_subscription_id TO lemonsqueezy_subscription_id;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'paddle_customer_id') THEN
        ALTER TABLE public.user_subscriptions RENAME COLUMN paddle_customer_id TO lemonsqueezy_customer_id;
    END IF;
END $$;

-- 2. Ensure Lemon Squeezy columns exist (if not renamed)
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS lemonsqueezy_subscription_id TEXT;
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS lemonsqueezy_customer_id TEXT;

-- 3. Update any existing logic that might depend on these names
-- (No structural changes needed for credit_transactions as they are linked via user_id)

-- 4. Verify RLS policies (should still work as they use user_id)
-- But let's make sure they are active
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
