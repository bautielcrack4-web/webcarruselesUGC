import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';

export async function POST(req: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // 1. Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get Subscription ID from DB
        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('paddle_subscription_id')
            .eq('user_id', user.id)
            .single();

        if (!subscription?.paddle_subscription_id) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
        }

        // 3. Initialize Paddle
        const paddle = new Paddle(process.env.PADDLE_API_KEY || '');

        // 4. Cancel via Paddle
        // "immediate" means it cancels now. user might want "at period end".
        // Usually safer to set effectiveFrom: 'next_billing_period' to let them finish the month.
        const canceledParams = {
            effectiveFrom: 'next_billing_period' as const // or 'immediately'
        };

        const result = await paddle.subscriptions.cancel(subscription.paddle_subscription_id, canceledParams);

        // 5. Update local DB (Optional here, webhook will confirm, but specific UI feedback is good)
        // We can optimistically mark as 'canceled' or 'canceling'
        await supabase
            .from('user_subscriptions')
            .update({ status: 'canceled' }) // Simplified, webhook should be source of truth
            .eq('user_id', user.id);

        return NextResponse.json({ success: true, data: result });

    } catch (error: any) {
        console.error('Cancel Subscription Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
