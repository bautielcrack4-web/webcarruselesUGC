-- Function to add credits (for purchases, bonuses, etc.)
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_amount INTEGER, p_description TEXT)
RETURNS VOID AS $$
BEGIN
    -- Update or insert into user_subscriptions
    INSERT INTO public.user_subscriptions (user_id, plan_id, credits_remaining, credits_total)
    VALUES (p_user_id, 'free', p_amount, p_amount)
    ON CONFLICT (user_id) DO UPDATE 
    SET credits_remaining = user_subscriptions.credits_remaining + p_amount,
        credits_total = user_subscriptions.credits_total + p_amount,
        updated_at = NOW();
    
    -- Log transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (p_user_id, p_amount, 'purchase', p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
