import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Paddle, EventName } from '@paddle/paddle-node-sdk';

export async function POST(req: Request) {
    // Initialize Paddle inside handler
    const paddle = new Paddle(process.env.PADDLE_API_KEY || '');

    const signature = req.headers.get('paddle-signature') || '';
    const body = await req.text();

    try {
        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const event = await paddle.webhooks.unmarshal(body, process.env.PADDLE_WEBHOOK_SECRET || '', signature);

        if (!event) {
            return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
        }

        console.log(`Paddle Webhook received: ${event.eventType}`);

        // Handle relevant events
        switch (event.eventType) {
            case EventName.TransactionCompleted:
                await handleTransactionCompleted(event.data);
                break;
            case EventName.SubscriptionCreated:
            case EventName.SubscriptionUpdated:
                await handleSubscriptionUpdated(event.data);
                break;
            default:
                console.log(`Unhandled event type: ${event.eventType}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
}

async function handleTransactionCompleted(data: any) {
    const supabase = getSupabaseAdmin();
    const userId = data.customData?.userId;
    const items = data.items;

    if (!userId) {
        console.error('No userId in customData');
        return;
    }

    // Process items (credits packages or plans)
    for (const item of items) {
        const priceId = item.priceId;
        const credits = getCreditsForPrice(priceId);

        if (credits > 0) {
            const { error } = await supabase.rpc('add_credits', {
                p_user_id: userId,
                p_amount: credits,
                p_description: `Compra de créditos (Paddle: ${data.id})`
            });
            if (error) console.error('Error adding credits:', error);
        }
    }
}

async function handleSubscriptionUpdated(data: any) {
    const supabase = getSupabaseAdmin();
    const userId = data.customData?.userId;
    const planId = data.items[0]?.priceId; // Simplified

    if (!userId) return;

    // Update subscription plan
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            plan_id: planId,
            status: data.status,
            paddle_subscription_id: data.id,
            next_billing_date: data.nextBillDate
        })
        .eq('user_id', userId);

    if (error) console.error('Error updating subscription:', error);
}

function getCreditsForPrice(priceId: string): number {
    const MAPPING: Record<string, number> = {
        'pri_01kcqt266h5v2b6w8a2t9f1h5v': 90,   // TRY
        'pri_01kcqt0m6p3y6h8v2nvs9k2edd': 360,  // CREATOR (Corrected to 360 based on frontend)
        'pri_01j78y5q9m336h0f9q9z5g9v3a': 900,  // PRO
        'pri_01j78y6m683m58g670v6z23zgh': 1800, // AGENCY (Corrected ID and Amount based on frontend)
        // Addons placeholders
        'pri_01kcqt266h5v2b6w8a2t9f1h5v_addon': 90,
    };
    return MAPPING[priceId] || 0;
}
