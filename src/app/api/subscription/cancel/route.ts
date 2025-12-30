import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cancelSubscription, lemonSqueezySetup } from '@/lib/lemonsqueezy';

// Initialize Lemon Squeezy
lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
});

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
            .select('lemonsqueezy_subscription_id')
            .eq('user_id', user.id)
            .single();

        if (!subscription?.lemonsqueezy_subscription_id) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
        }

        // 3. Cancel via Lemon Squeezy
        // Lemon Squeezy cancelSubscription defaults to cancelling at the end of the period
        const { error, data } = await cancelSubscription(subscription.lemonsqueezy_subscription_id);

        if (error) {
            throw new Error(error.message);
        }

        // 4. Update local DB (Optional here, webhook will confirm)
        await supabase
            .from('user_subscriptions')
            .update({ status: 'cancelled' })
            .eq('user_id', user.id);

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Cancel Subscription Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
